// In mẫu đề luyện thêm (Markdown) để soát toán: mỗi dạng N đề theo hạt giống 1..N, kèm đáp án, gợi ý, lời giải, lỗi thường gặp.
// Dùng: node tools/dump-luyen.js <idBài | nen-<id>> [số đề = 20] > ra.md
const path = require('path'), fs = require('fs');
const { loadFile } = require('./nap-noi-dung.js');
const P = require('../js/core/parser.js');
const { congCu } = require('../js/core/rng.js');
const LL = require('../js/core/luyen.js');

const [ten, soDe = '20'] = process.argv.slice(2);
if (!ten) { console.error('Dùng: node tools/dump-luyen.js <idBài | nen-<id>> [số đề]'); process.exit(2); }
const CONTENT = path.join(__dirname, '..', 'content');
const nen = /^nen-(.+)$/.exec(ten);
const file = nen ? path.join(CONTENT, 'nen', nen[1] + '.js') : path.join(CONTENT, 'luyen', 'luyen' + String(ten).padStart(2, '0') + '.js');
if (!fs.existsSync(file)) { console.error('Không có file ' + file); process.exit(2); }
const r = loadFile(file);
const goi = nen ? { id: ten, dang: (r.nen[0] && r.nen[0].luyen) || [], deCo: [] } : r.luyen[0];
if (!goi) { console.error('File chưa có TOAN8.luyen/TOAN8.nen'); process.exit(2); }
const cc = congCu(P), N = Number(soDe);

function dapAnChu(d) {
  switch (d.kieu) {
    case 'chon': return 'ABCDEFGH'[d.gt] + '. ' + d.luaChon[d.gt];
    case 'dungSai': return d.gt ? 'Đúng' : 'Sai';
    case 'nghiem': return Array.isArray(d.gt) ? d.gt.join('; ') : d.gt;
    case 'nhieuO': return d.o.map(o => (o.nhan || '') + ' ' + dapAnChu(o)).join(' | ');
    default: return String(d.gt) + (d.dang ? ' (dạng ' + d.dang + ')' : '') + (d.saiSo ? ' (sai số ' + d.saiSo + ')' : '');
  }
}
function inCau(q, tieuDe) {
  const out = ['### ' + tieuDe, '', '**Đề:** ' + q.de];
  if (q.hinh) out.push('', '_(có hình: ' + q.hinh.widget + ')_');
  if (q.dapAn.kieu === 'chon') q.dapAn.luaChon.forEach((x, i) => out.push('- ' + 'ABCDEFGH'[i] + '. ' + x));
  out.push('', '**Đáp án:** ' + dapAnChu(q.dapAn));
  (q.goiY || []).forEach((g, i) => out.push('- Gợi ý ' + (i + 1) + ': ' + g));
  out.push('', '**Lời giải:**');
  (q.loiGiai || []).forEach(l => out.push('  - ' + l));
  (q.loiThuongGap || []).forEach(l => out.push('- Lỗi thường gặp `' + l.gt + '`: ' + l.giaiThich));
  out.push('');
  return out.join('\n');
}

const ra = ['# Mẫu đề luyện thêm – ' + ten, ''];
goi.dang.forEach(d => {
  ra.push('## Dạng "' + d.ten + '" (mức ' + d.muc + ')', '');
  for (let s = 1; s <= N; s++) {
    try { ra.push(inCau(LL.sinhCau(d, s, cc, goi.id), 'Hạt giống ' + s)); }
    catch (e) { ra.push('### Hạt giống ' + s, '', '**LỖI:** ' + e.message, ''); }
  }
});
if (goi.deCo.length) {
  ra.push('## Câu soạn sẵn (deCo)', '');
  goi.deCo.forEach(q => ra.push(inCau(q, q.id + ' (mức ' + q.muc + ')')));
}
console.log(ra.join('\n'));
