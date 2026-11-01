// Kiểm tra nội dung bài học: đủ trường, đủ số bài, đáp án tự khớp, lỗi thường gặp không trùng đáp án,
// dòng cuối lời giải khớp đáp án, công thức không thiếu dấu $.
// Dùng: node tools/validate-content.js [file…]  (không truyền file thì quét content/bai*.js)
const fs = require('fs'), path = require('path'), vm = require('vm');
const P = require('../js/core/parser.js');
const C = require('../js/core/checker.js');

const KNOWN_WIDGETS = ['dienTich', 'hieuHaiBinhPhuong', 'geo'];
const KIEU = ['bieuThuc', 'so', 'nghiem', 'chon', 'dungSai', 'nhieuO'];
const errors = [];
const seenIds = {};

function loadLessons(file) {
  const lessons = [];
  const ctx = { TOAN8: { bai: def => lessons.push(def) }, console };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return lessons;
}

// LaTeX đơn giản → ascii-math cho parser (bỏ qua nếu không đọc được)
function latexToAscii(s) {
  let t = s.replace(/\\left|\\right/g, '').replace(/\\cdot|\\times/g, '*').replace(/\\[,;!: ]/g, '')
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
  walkStrings(L, (s, where) => { if ((s.match(/\$/g) || []).length % 2) errors.push(T + where + ': số dấu $ lẻ: "' + s.slice(0, 50) + '"'); }, '');
}

const files = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(path.join(__dirname, '..', 'content')).filter(f => /^bai\d+\.js$/.test(f)).map(f => path.join(__dirname, '..', 'content', f));
let count = 0;
for (const f of files) {
  try { loadLessons(f).forEach(L => { count++; checkLesson(L, path.basename(f)); }); }
  catch (e) { errors.push(path.basename(f) + ': không chạy được file (' + e.message + ')'); }
}
if (errors.length) { console.log(errors.join('\n')); console.log('\n' + errors.length + ' lỗi trong ' + count + ' bài.'); process.exitCode = 1; }
else console.log('OK: ' + count + ' bài, ' + Object.keys(seenIds).length + ' bài tập, không có lỗi.');
