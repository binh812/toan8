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

const FIGURE = path.join(__dirname, '..', 'js', 'widgets', 'figure.js');
const KNOWN_WIDGETS = ['dienTich', 'hieuHaiBinhPhuong', 'geo', 'doThi', 'hinhChop', 'bieuDo', 'xacSuat'];
const KIEU = ['bieuThuc', 'so', 'nghiem', 'chon', 'dungSai', 'nhieuO'];
const errors = [];
const seenIds = {};

function loadFile(file) {
  const lessons = [], luyen = [], nen = [];
  const ctx = { TOAN8: {
    bai: def => lessons.push(def),
    luyen: (id, dang, opts) => luyen.push({ id, dang, deCo: (opts && opts.deCo) || [] }),
    nen: def => nen.push(def)
  }, console };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(FIGURE, 'utf8'), ctx, { filename: FIGURE }); // TOAN8.hinhTinh, TOAN8.hh dùng lúc nạp bài
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return { lessons, luyen, nen };
}

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

function checkLesson(L, file) {
  const T = 'bai' + L.id;
  const need = (cond, msg) => { if (!cond) errors.push(T + ': ' + msg); };
  need(L.id && L.ten, 'thiếu id/ten');
  need(L.sgk && L.sgk.tap && L.sgk.trang, 'thiếu sgk.tap/trang');
  need(L.khamPha && L.khamPha.nhiemVu, 'thiếu khamPha.nhiemVu');
  if (L.khamPha && L.khamPha.widget) need(KNOWN_WIDGETS.includes(L.khamPha.widget), 'khamPha.widget lạ: ' + L.khamPha.widget);
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
function checkLuyen(g) {
  const tagBai = 'luyen' + g.id;
  if (!Array.isArray(g.dang)) { errors.push(tagBai + ': danh sách dạng phải là mảng'); return 0; }
  g.dang.forEach((d, i) => {
    const tag = tagBai + ' dạng "' + (d.ten || i) + '"';
    if (![1, 2, 3].includes(d.muc)) errors.push(tag + ': muc phải là 1/2/3');
    if (typeof d.sinh !== 'function') { errors.push(tag + ': thiếu hàm sinh'); return; }
    for (let s = 1; s <= SO_HAT; s++) {
      let q;
      try { q = LL.sinhCau(d, s, CC, g.id); } catch (e) { errors.push(tag + ' hạt giống ' + s + ': ném lỗi (' + e.message + ')'); break; }
      const n = errors.length;
      checkCauSinh(tag + ' hạt giống ' + s, q);
      if (errors.length > n) break; // một hạt giống hỏng là đủ để báo dạng này
    }
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

const args = process.argv.slice(2), duLuyen = args.includes('--du-luyen');
const fileArgs = args.filter(a => !a.startsWith('--'));
const CONTENT = path.join(__dirname, '..', 'content');
const quet = (dir, re) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => re.test(f)).map(f => path.join(dir, f)) : [];
const files = fileArgs.length ? fileArgs : quet(CONTENT, /^bai\d+\.js$/).concat(quet(path.join(CONTENT, 'luyen'), /^luyen\d+\.js$/));
let count = 0, soDang = 0;
const baiCo = [], luyenCo = {};
for (const f of files) {
  checkBackslashes(fs.readFileSync(f, 'utf8'), path.basename(f));
  try {
    const r = loadFile(f);
    r.lessons.forEach(L => { count++; baiCo.push(L.id); checkLesson(L, path.basename(f)); });
    r.luyen.forEach(g => { soDang += checkLuyen(g); luyenCo[g.id] = g.dang.length + Math.ceil(g.deCo.length / 3); });
  } catch (e) { errors.push(path.basename(f) + ': không chạy được file (' + e.message + ')'); }
}
if (duLuyen) baiCo.forEach(id => {
  if (!luyenCo[id]) errors.push('bai' + id + ': chưa có luyện thêm (content/luyen/luyen' + String(id).padStart(2, '0') + '.js)');
  else if (luyenCo[id] < 3) errors.push('luyen' + id + ': cần ≥ 3 dạng (câu soạn sẵn tính 3 câu = 1 dạng)');
});
const tomTat = count + ' bài, ' + Object.keys(seenIds).length + ' bài tập, ' + soDang + ' dạng luyện thêm (' + soDang * SO_HAT + ' đề thử)';
if (errors.length) { console.log(errors.join('\n')); console.log('\n' + errors.length + ' lỗi (' + tomTat + ').'); process.exitCode = 1; }
else console.log('OK: ' + tomTat + ', không có lỗi.');
