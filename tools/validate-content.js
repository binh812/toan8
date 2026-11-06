// Kiểm tra nội dung bài học: đủ trường, đủ số bài, đáp án tự khớp, lỗi thường gặp không trùng đáp án,
// dòng cuối lời giải khớp đáp án, công thức không thiếu dấu $.
// Luyện thêm (content/luyen/*.js): sinh thử SO_HAT đề mỗi dạng, mỗi đề kiểm như một bài tập.
// Dùng: node tools/validate-content.js [--du-luyen] [file…]  (không truyền file thì quét content/bai*.js, content/luyen/*.js)
//   --du-luyen: báo bài chưa có luyện thêm hoặc có ít hơn 3 nguồn bài
const fs = require('fs'), path = require('path'), vm = require('vm');
const P = require('../js/core/parser.js');
const C = require('../js/core/checker.js');
const R = require('../js/core/render.js');
const katex = require('../lib/katex/katex.min.js');
const RNG = require('../js/core/rng.js');
const LL = require('../js/core/luyen.js');
const CC = RNG.congCu(P);
const SO_HAT = 300;
const CANH = require('../js/canh/loi.js');
fs.readdirSync(path.join(__dirname, '..', 'js', 'canh')).filter(f => f.endsWith('.js') && f !== 'loi.js').forEach(f => require('../js/canh/' + f));

// Render thử từng công thức như trên trình duyệt nhưng bật báo lỗi (trên trang, lệnh lạ chỉ hiện chữ đỏ, khó thấy).
function checkMath(s, where) {
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let m;
  while ((m = re.exec(s))) {
    const src = m[1] != null ? m[1] : m[2];
    try { katex.renderToString(src, { displayMode: m[1] != null, throwOnError: true, strict: 'ignore', macros: Object.assign({}, R.MACROS) }); }
    catch (e) { errors.push(where + ': công thức KaTeX lỗi "' + src.slice(0, 40) + '" – ' + String(e.message).split('\n')[0].slice(0, 80)); }
  }
}

// Trong chuỗi JS, "\o", "\f", "\s"… (một dấu \) bị nuốt hoặc thành kí tự điều khiển: lệnh LaTeX phải viết "\\".
function checkBackslashes(src, file) {
  src.split('\n').forEach((line, i) => {
    if (/(^|[^\\])(\\\\)*\\(?![nu'"\\])[a-zA-Z]/.test(line))
      errors.push(file + ':' + (i + 1) + ': dấu \\ đơn trước chữ cái (lệnh LaTeX trong chuỗi JS phải viết \\\\) – "' + line.trim().slice(0, 60) + '"');
  });
}

const KNOWN_WIDGETS = ['canh', 'dienTich', 'hieuHaiBinhPhuong', 'geo', 'doThi', 'hinhChop', 'bieuDo', 'xacSuat'];
const KIEU = ['bieuThuc', 'so', 'nghiem', 'chon', 'dungSai', 'nhieuO'];
const errors = [];
const seenIds = {};

const { loadFile } = require('./nap-noi-dung.js');

// LaTeX đơn giản → ascii-math cho parser (bỏ qua nếu không đọc được)
function latexToAscii(s) {
  let t = s.replace(/\^\{?\\circ\}?|°/g, '').replace(/\\left|\\right/g, '').replace(/\\cdot|\\times/g, '*').replace(/\\[,;!: ]/g, '')
    .replace(/\\c[abcd]\{([^{}]*)\}/g, '$1').replace(/\{,\}/g, '.');
  for (let i = 0; i < 5; i++) t = t.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
  return t.replace(/\{/g, '(').replace(/\}/g, ')').replace(/\s+/g, '');
}

function lastValue(line) {
  const segs = String(line).match(/\$([^$]+)\$/g);
  if (!segs) return null;
  const last = segs[segs.length - 1].slice(1, -1);
  if (last.indexOf('=') < 0) return null;
  const rhs = last.split('=').pop().trim().replace(/\.$/, '');
  return rhs ? latexToAscii(rhs) : null;
}

function walkStrings(obj, fn, where) {
  if (typeof obj === 'string') fn(obj, where);
  else if (Array.isArray(obj)) obj.forEach((x, i) => walkStrings(x, fn, where + '[' + i + ']'));
  else if (obj && typeof obj === 'object') for (const k of Object.keys(obj)) if (k !== 'config') walkStrings(obj[k], fn, where + '.' + k);
}

function checkDapAn(tag, d, ltg) {
  if (!d || KIEU.indexOf(d.kieu) < 0) { errors.push(tag + ': dapAn.kieu không hợp lệ (' + (d && d.kieu) + ')'); return; }
  if (d.kieu === 'nhieuO') { (d.o || []).forEach((sub, i) => checkDapAn(tag + ' ô ' + (i + 1), sub, sub.loiThuongGap)); return; }
  if (d.kieu === 'chon') {
    if (!Array.isArray(d.luaChon) || d.luaChon.length < 2) errors.push(tag + ': chon thiếu luaChon');
    else if (!(d.gt >= 0 && d.gt < d.luaChon.length)) errors.push(tag + ': chon gt ngoài khoảng');
    return;
  }
  if (d.kieu === 'dungSai') { if (typeof d.gt !== 'boolean') errors.push(tag + ': dungSai gt phải là true/false'); return; }
  let self;
  try {
    const input = d.kieu === 'nghiem' ? (Array.isArray(d.gt) ? d.gt.join(';') : (d.gt === 'voNghiem' ? 'vô nghiệm' : 'vô số nghiệm')) : String(d.gt);
    self = C.checkAnswer(d, input);
  } catch (e) { errors.push(tag + ': không chấm được đáp án (' + e.message + ')'); return; }
  if (!self.ok) errors.push(tag + ': đáp án tự chấm không đúng (' + self.code + (d.dang ? ', dang ' + d.dang : '') + ': ' + self.msg + ')');
  (ltg || []).forEach((l, i) => {
    if (d.kieu === 'bieuThuc') {
      try { if (C.equivalent(l.gt, d.gt)) errors.push(tag + ': loiThuongGap[' + i + '] tương đương đáp án'); }
      catch (e) { errors.push(tag + ': loiThuongGap[' + i + '] không đọc được'); }
    } else if (d.kieu === 'so' && Math.abs(C.parseNumber(String(l.gt)) - C.parseNumber(String(d.gt))) < 1e-9) {
      errors.push(tag + ': loiThuongGap[' + i + '] trùng đáp án');
    }
    if (!l.giaiThich) errors.push(tag + ': loiThuongGap[' + i + '] thiếu giaiThich');
  });
}

function checkLastLine(tag, q) {
  if (!q.loiGiai || !q.loiGiai.length || !q.dapAn) return;
  const d = q.dapAn;
  if (d.kieu !== 'bieuThuc' && d.kieu !== 'so') return;
  const v = lastValue(q.loiGiai[q.loiGiai.length - 1]);
  if (!v) return;
  let same;
  try {
    if (d.kieu === 'so') { const x = C.parseNumber(v); if (Number.isNaN(x)) return; same = Math.abs(x - C.parseNumber(String(d.gt))) <= (d.saiSo || 1e-9) + 1e-12; }
    else { P.parse(v); same = C.equivalent(v, d.gt); }
  } catch (e) { return; } // dòng cuối không đọc được: bỏ qua luật này
  if (!same) errors.push(tag + ': loiGiai dòng cuối "' + v + '" không khớp đáp án "' + d.gt + '"');
}

// Kịch bản tự chạy: mỗi bước đúng một loại; tên thanh trượt/điểm phải có trong cấu hình hoặc hàm build của hình.
function checkTuChay(tag, cfg) {
  if (!cfg || !Array.isArray(cfg.tuChay)) return;
  const nguon = JSON.stringify(cfg.thanhTruot || []) + JSON.stringify(cfg.diem || []) + String(cfg.build || '') + String(cfg.them || '');
  const co = ten => nguon.includes("'" + ten + "'") || nguon.includes('"' + ten + '"');
  cfg.tuChay.forEach((s, i) => {
    const loai = ['thanhTruot', 'diem', 'nut', 'cho'].filter(k => s && s[k] != null);
    if (loai.length !== 1) { errors.push(tag + ': tuChay: bước lạ ở bước ' + (i + 1) + ' (' + JSON.stringify(s) + ')'); return; }
    const ten = s.thanhTruot || s.diem;
    if (ten && !co(ten)) errors.push(tag + ': tuChay: không thấy "' + ten + '" trong hình (bước ' + (i + 1) + ')');
    if (s.diem && !(Array.isArray(s.den) && s.den.length === 2)) errors.push(tag + ': tuChay: bước ' + (i + 1) + ' cần den: [x, y]');
  });
}

// Một cấu hình cảnh phải có cảnh thật và tính được ở đầu, cuối
function checkCanh(tag, c) {
  if (!c || !c.ten) { errors.push(tag + ': thiếu tên cảnh'); return; }
  let canh;
  try { canh = CANH.lay(c.ten); } catch (e) { errors.push(tag + ': cảnh lạ: ' + c.ten); return; }
  const p = {};
  Object.keys(canh.thamSo || {}).forEach(k => { p[k] = canh.thamSo[k].md; });
  Object.assign(p, c.thamSo || {});
  [0, 1].forEach(t => { try { canh.tinh(p, t, c.tuyChon || {}); } catch (e) { errors.push(tag + ': cảnh ' + c.ten + ' lỗi ở t=' + t + ': ' + e.message); } });
}
function checkHinhCanh(tag, h) { if (h && h.widget === 'canh') checkCanh(tag, h.config); }

// Khối "Nhìn là hiểu"; câu Dùng và Suy ra lấy đề từ bài tập gốc (tuBai), có thể ghi đè từng trường
function checkCauNhin(tag, d, bt) {
  const goc = bt.find(q => q.id === d.tuBai);
  if (!goc) errors.push(tag + ': tuBai không có: ' + d.tuBai);
  const q = Object.assign({}, goc, d);
  if (!q.de) errors.push(tag + ': thiếu de');
  checkDapAn(tag, q.dapAn, q.loiThuongGap);
  checkCanh(tag, d.canh);
  return q;
}
function checkNhin(L, T) {
  const n = L.nhin, bt = L.baiTap || [];
  if (!['chungMinh', 'minhHoa'].includes(n.loai)) errors.push(T + ' nhin: loai lạ: ' + n.loai);
  ['tieuDe', 'ketLuan'].forEach(k => { if (!n[k]) errors.push(T + ' nhin: thiếu ' + k); });
  checkCanh(T + ' nhin', n.canh);
  const buoc = n.buoc || [];
  if (!buoc.length) errors.push(T + ' nhin: thiếu buoc');
  buoc.forEach((b, i) => { if (i && b.t <= buoc[i - 1].t) errors.push(T + ' nhin: buoc[' + i + '] t không tăng'); });
  if (!n.dung) errors.push(T + ' nhin: thiếu dung');
  else {
    const q = checkCauNhin(T + ' nhin.dung', n.dung, bt);
    if (!n.dung.dungChu) errors.push(T + ' nhin.dung: thiếu dungChu');
    const pu = n.dung.phanUng || [];
    pu.forEach((u, i) => pu.slice(i + 1).forEach((v, j) => { try { if (q.dapAn && C.checkAnswer({ kieu: q.dapAn.kieu, gt: u.gt }, String(v.gt)).ok) errors.push(T + ' nhin.dung: phanUng[' + (i + j + 1) + '] tương đương phanUng[' + i + '], sẽ không bao giờ hiện'); } catch (e) {} }));
    (n.dung.phanUng || []).forEach((u, i) => {
      if (q.dapAn && C.checkAnswer(q.dapAn, String(u.gt)).ok) errors.push(T + ' nhin.dung: phanUng[' + i + '] phanUng trùng đáp án');
      if (!u.loi) errors.push(T + ' nhin.dung: phanUng[' + i + '] thiếu loi');
    });
  }
  const ba = (n.suyRa && n.suyRa.baDe) || [];
  if (ba.length !== 3) errors.push(T + ' nhin.suyRa: cần đúng 3 đề (đang có ' + ba.length + ')');
  if (!n.suyRa || !n.suyRa.cachNhan) errors.push(T + ' nhin.suyRa: thiếu cachNhan');
  ba.forEach((d, i) => {
    const tag = T + ' nhin.suyRa[' + i + ']';
    const cau = checkCauNhin(tag, d, bt);
    (d.phanUng || []).forEach((u, k) => { if (cau.dapAn && C.checkAnswer(cau.dapAn, String(u.gt)).ok) errors.push(tag + ': phanUng[' + k + '] phanUng trùng đáp án'); });
    ['tenNut', 'dungChu', 'saiChu'].forEach(k => { if (!d[k]) errors.push(tag + ': thiếu ' + k); });
  });
  (L.viDu || []).forEach((v, i) => {
    if (!v.hinh && !v.canh) errors.push(T + ' viDu[' + i + '] cần hình (hinh hoặc canh)');
    if (v.canh) checkCanh(T + ' viDu[' + i + ']', v.canh);
    checkHinhCanh(T + ' viDu[' + i + ']', v.hinh);
  });
  bt.forEach(q => {
    if (!q.hinh && !q.hinhGiai && !q.khongHinh) errors.push(T + ' ' + q.id + ': thiếu hình (hinh, hinhGiai hoặc khongHinh)');
    checkHinhCanh(T + ' ' + q.id, q.hinh);
    checkHinhCanh(T + ' ' + q.id + ' hinhGiai', q.hinhGiai);
    (q.loiThuongGap || []).forEach((l, i) => checkHinhCanh(T + ' ' + q.id + ' loiThuongGap[' + i + ']', l.hinh));
  });
}

function checkLesson(L, file) {
  const T = 'bai' + L.id;
  const need = (cond, msg) => { if (!cond) errors.push(T + ': ' + msg); };
  need(L.id && L.ten, 'thiếu id/ten');
  need(L.sgk && L.sgk.tap && L.sgk.trang, 'thiếu sgk.tap/trang');
  need(L.khamPha && L.khamPha.nhiemVu, 'thiếu khamPha.nhiemVu');
  if (L.khamPha && L.khamPha.widget) need(KNOWN_WIDGETS.includes(L.khamPha.widget), 'khamPha.widget lạ: ' + L.khamPha.widget);
  if (L.khamPha) checkTuChay(T + ' khamPha', L.khamPha.config);
  (L.lyThuyet || []).forEach((k, i) => { if (k.loai === 'hinh') checkTuChay(T + ' lyThuyet[' + i + ']', k.config); });
  if (L.khamPha && L.khamPha.cauHoi) checkDapAn(T + ' khamPha.cauHoi', L.khamPha.cauHoi.dapAn, []);
  // goiY ở mọi chỗ phải là mảng (chuỗi sẽ bị tính số nấc theo số kí tự)
  (function walkGoiY(o, where) {
    if (!o || typeof o !== 'object') return;
    if ('goiY' in o && !Array.isArray(o.goiY)) errors.push(T + where + ': goiY phải là mảng');
    for (const k of Object.keys(o)) if (k !== 'config' && k !== 'goiY') walkGoiY(o[k], where + '.' + k);
  })(L, '');
  need(Array.isArray(L.lyThuyet) && L.lyThuyet.length >= 1, 'lyThuyet cần ≥ 1 khối');
  (L.lyThuyet || []).forEach((k, i) => { if (k.loai === 'hinh') need(KNOWN_WIDGETS.includes(k.widget), 'lyThuyet[' + i + '] widget lạ: ' + k.widget); });
  // trường "hinh" ở ví dụ, ví dụ khuyết, bài tập, tìm lỗi sai
  ['viDu', 'viDuMo', 'baiTap', 'timLoi'].forEach(k => (L[k] || []).forEach((x, i) => {
    if (x && x.hinh) need(KNOWN_WIDGETS.includes(x.hinh.widget), k + '[' + i + '].hinh widget lạ: ' + x.hinh.widget);
  }));
  need(Array.isArray(L.viDu) && L.viDu.length >= 2, 'viDu cần ≥ 2 ví dụ');
  need(Array.isArray(L.viDuMo) && L.viDuMo.length >= 1, 'viDuMo cần ≥ 1');
  (L.viDuMo || []).forEach((v, i) => {
    const hidden = (v.buoc || []).filter(b => b.an);
    need(hidden.length >= 1, 'viDuMo[' + i + '] cần ≥ 1 bước an');
    hidden.forEach((b, k) => checkDapAn(T + ' viDuMo[' + i + '].an' + k, b.dapAn, b.loiThuongGap));
  });
  const bt = L.baiTap || [];
  need(bt.length >= 8 && bt.length <= 12, 'baiTap cần 8–12 bài (đang có ' + bt.length + ')');
  const muc = m => bt.filter(q => q.muc === m).length;
  need(muc(1) >= 3 && muc(2) >= 3 && muc(3) >= 1, 'baiTap cần ≥3 mức 1, ≥3 mức 2, ≥1 mức 3 (đang ' + muc(1) + '/' + muc(2) + '/' + muc(3) + ')');
  bt.forEach(q => {
    const tag = T + ' ' + q.id;
    if (seenIds[q.id]) errors.push(tag + ': id trùng với ' + seenIds[q.id]);
    seenIds[q.id] = file;
    if (![1, 2, 3].includes(q.muc)) errors.push(tag + ': muc phải là 1/2/3');
    if (!q.de) errors.push(tag + ': thiếu de');
    if (!q.goiY || !q.goiY.length) errors.push(tag + ': thiếu goiY');
    if (!q.loiGiai || !q.loiGiai.length) errors.push(tag + ': thiếu loiGiai');
    checkDapAn(tag, q.dapAn, q.loiThuongGap);
    checkLastLine(tag, q);
  });
  if (L.nhin) checkNhin(L, T);
  need(Array.isArray(L.timLoi) && L.timLoi.length >= 1, 'timLoi cần ≥ 1');
  (L.timLoi || []).forEach((t, i) => {
    need(Array.isArray(t.loiGiaiSai) && t.dongSai >= 0 && t.dongSai < t.loiGiaiSai.length, 'timLoi[' + i + '] dongSai ngoài khoảng');
    need(t.giaiThich, 'timLoi[' + i + '] thiếu giaiThich');
  });
  walkStrings(L, (s, where) => {
    if ((s.match(/\$/g) || []).length % 2) errors.push(T + where + ': số dấu $ lẻ: "' + s.slice(0, 50) + '"');
    else checkMath(s, T + where);
  }, '');
}

// ---------- Luyện thêm ----------
function checkCauSinh(tag, q) {
  if (!q || typeof q !== 'object') { errors.push(tag + ': sinh() không trả về câu hỏi'); return; }
  if (!q.de) errors.push(tag + ': thiếu de');
  if (!q.goiY || !q.goiY.length) errors.push(tag + ': thiếu goiY');
  if (!q.loiGiai || !q.loiGiai.length) errors.push(tag + ': thiếu loiGiai');
  if (q.hinh && !KNOWN_WIDGETS.includes(q.hinh.widget)) errors.push(tag + ': hinh widget lạ: ' + q.hinh.widget);
  if (q.hinhGiai && !KNOWN_WIDGETS.includes(q.hinhGiai.widget)) errors.push(tag + ': hinhGiai widget lạ: ' + q.hinhGiai.widget);
  checkHinhCanh(tag, q.hinh);
  checkHinhCanh(tag + ' hinhGiai', q.hinhGiai);
  walkStrings(q, (s, where) => {
    if (/undefined|NaN|Infinity|\[object/.test(s)) errors.push(tag + where + ': có "undefined/NaN/Infinity" trong chữ: "' + s.slice(0, 60) + '"');
    if ((s.match(/\$/g) || []).length % 2) errors.push(tag + where + ': số dấu $ lẻ: "' + s.slice(0, 50) + '"');
    else checkMath(s, tag + where);
  }, '');
  const d = q.dapAn;
  if (d && d.kieu === 'so' && !Number.isFinite(C.parseNumber(String(d.gt)))) errors.push(tag + ': đáp án không phải số hữu hạn (' + d.gt + ')');
  else checkDapAn(tag, d, q.loiThuongGap);
  checkLastLine(tag, q);
}
const baiCoNhin = new Set();
function checkLuyen(g) {
  const tagBai = 'luyen' + g.id;
  if (!Array.isArray(g.dang)) { errors.push(tagBai + ': danh sách dạng phải là mảng'); return 0; }
  g.dang.forEach((d, i) => {
    const tag = tagBai + ' dạng "' + (d.ten || i) + '"';
    if (![1, 2, 3].includes(d.muc)) errors.push(tag + ': muc phải là 1/2/3');
    if (typeof d.sinh !== 'function') { errors.push(tag + ': thiếu hàm sinh'); return; }
    let coHinh = false;
    for (let s = 1; s <= SO_HAT; s++) {
      let q;
      try { q = LL.sinhCau(d, s, CC, g.id); } catch (e) { errors.push(tag + ' hạt giống ' + s + ': ném lỗi (' + e.message + ')'); break; }
      const n = errors.length;
      if (q && (q.hinhGiai || q.hinh)) coHinh = true;
      checkCauSinh(tag + ' hạt giống ' + s, q);
      if (errors.length > n) break; // một hạt giống hỏng là đủ để báo dạng này
    }
    // Bài đã học theo cách Nhìn là hiểu: dạng dễ và vừa cũng cần hình theo chính số của đề
    if (baiCoNhin.has(g.id) && d.muc <= 2 && !coHinh && !d.khongHinh) errors.push(tag + ': mức ' + d.muc + ' cần hinhGiai (hoặc ghi khongHinh: lí do)');
  });
  g.deCo.forEach(q => {
    const tag = tagBai + ' ' + q.id;
    if (seenIds[q.id]) errors.push(tag + ': id trùng với ' + seenIds[q.id]);
    seenIds[q.id] = tagBai;
    if (![1, 2, 3].includes(q.muc)) errors.push(tag + ': muc phải là 1/2/3');
    checkCauSinh(tag, q);
  });
  const muc = new Set(g.dang.map(d => d.muc).concat(g.deCo.map(q => q.muc)));
  if (!(muc.has(1) && muc.has(2))) errors.push(tagBai + ': cần có ít nhất mức 1 và mức 2');
  return g.dang.length;
}

// ---------- Bài nền (ôn kiến thức lớp 6–7) và kiểm tra đầu chương ----------
function checkNen(N) {
  const tag = 'nen ' + N.id;
  if (!N.id || !N.ten || !N.lop) errors.push(tag + ': thiếu id/ten/lop');
  if (!Array.isArray(N.tomTat) || !N.tomTat.length) errors.push(tag + ': tomTat cần ≥ 1 khối');
  if (!Array.isArray(N.viDu) || !N.viDu.length) errors.push(tag + ': viDu cần ≥ 1 ví dụ');
  if (!Array.isArray(N.luyen) || N.luyen.length < 2) errors.push(tag + ': luyen cần ≥ 2 dạng');
  walkStrings({ tomTat: N.tomTat, viDu: N.viDu }, (s, where) => {
    if ((s.match(/\$/g) || []).length % 2) errors.push(tag + where + ': số dấu $ lẻ');
    else checkMath(s, tag + where);
  }, '');
  return Array.isArray(N.luyen) && N.luyen.length ? checkLuyen({ id: 'nen-' + N.id, dang: N.luyen, deCo: [] }) : 0;
}
function checkKiemTra(nenIds) {
  const f = path.join(CONTENT, 'index.js'), ctx = { TOAN8: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  (ctx.TOAN8.mucLuc || []).forEach(c => (c.kiemTra || []).forEach((k, i) => {
    const tag = 'kiemTra chương ' + c.so + ' câu ' + (i + 1);
    if (!nenIds.includes(k.nen)) errors.push(tag + ': bài nền "' + k.nen + '" không có');
    if (!k.cau) { errors.push(tag + ': thiếu cau'); return; }
    checkCauSinh(tag, k.cau);
  }));
}

const args = process.argv.slice(2), duLuyen = args.includes('--du-luyen');
const fileArgs = args.filter(a => !a.startsWith('--'));
const CONTENT = path.join(__dirname, '..', 'content');
const quet = (dir, re) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => re.test(f)).map(f => path.join(dir, f)) : [];
const files = fileArgs.length ? fileArgs : quet(CONTENT, /^bai\d+\.js$/).concat(quet(path.join(CONTENT, 'luyen'), /^luyen\d+\.js$/)).concat(quet(path.join(CONTENT, 'nen'), /\.js$/));
let count = 0, soDang = 0;
const baiCo = [], luyenCo = {}, nenIds = [];
for (const f of files) {
  checkBackslashes(fs.readFileSync(f, 'utf8'), path.basename(f));
  try {
    const r = loadFile(f);
    r.lessons.forEach(L => { count++; baiCo.push(L.id); if (L.nhin) baiCoNhin.add(L.id); checkLesson(L, path.basename(f)); });
    r.luyen.forEach(g => { soDang += checkLuyen(g); luyenCo[g.id] = g.dang.length + Math.ceil(g.deCo.length / 3); });
    r.nen.forEach(N => { nenIds.push(N.id); soDang += checkNen(N); });
  } catch (e) { errors.push(path.basename(f) + ': không chạy được file (' + e.message + ')'); }
}
if (!fileArgs.length) checkKiemTra(nenIds);
if (duLuyen) baiCo.forEach(id => {
  if (!luyenCo[id]) errors.push('bai' + id + ': chưa có luyện thêm (content/luyen/luyen' + String(id).padStart(2, '0') + '.js)');
  else if (luyenCo[id] < 3) errors.push('luyen' + id + ': cần ≥ 3 dạng (câu soạn sẵn tính 3 câu = 1 dạng)');
});
const tomTat = count + ' bài, ' + (nenIds.length ? nenIds.length + ' bài nền, ' : '') + Object.keys(seenIds).length + ' bài tập, ' + soDang + ' dạng luyện thêm (' + soDang * SO_HAT + ' đề thử)';
if (errors.length) { console.log(errors.join('\n')); console.log('\n' + errors.length + ' lỗi (' + tomTat + ').'); process.exitCode = 1; }
else console.log('OK: ' + tomTat + ', không có lỗi.');
