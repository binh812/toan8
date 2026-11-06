// Thử phá và soi chi tiết cho các cảnh chương VII, VIII (bài 25–32)
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/caiCan.js');
require('../js/canh/hamSo.js');
require('../js/canh/xacSuat.js');

const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const soi = (ten, p, t, o) => canh.lay(ten).soi(tinh(ten, p, t, o), p, o);
const coSo = s => /\d/.test(s);
// Mọi khoá có tiêu đề và chữ; ít nhất một khoá có số
function kiemSoi(bang, khoa) {
  khoa.forEach(x => { assert.ok(bang[x], 'thiếu khoá ' + x); assert.ok(bang[x].tieuDe && bang[x].chu, 'khoá ' + x + ' thiếu chữ'); });
  assert.ok(Object.keys(bang).some(x => coSo(bang[x].chu)), 'không khoá nào có số');
}

// ---------- Bài 25: cái cân, nhân hai vế với 0 ----------
const CAN25 = { trai: { x: 3, so: 2 }, phai: { x: 1, so: 6 }, buoc: [{ trai: { x: 2, so: 2 }, phai: { x: 0, so: 6 } }, { trai: { x: 2, so: 0 }, phai: { x: 0, so: 4 } }, { trai: { x: 1, so: 0 }, phai: { x: 0, so: 2 } }] };
test('caiCan thử phá: nhân với số khác 0 giữ nghiệm, nhân với 0 thì hỏng', () => {
  const md = tinh('caiCan', { nhan: 1 }, 0, CAN25);
  assert.strictEqual(md.pha.hong, false);
  assert.deepStrictEqual([md.trai, md.phai], [CAN25.trai, CAN25.phai]);
  const k15 = tinh('caiCan', { nhan: 1.5 }, 0, CAN25);
  assert.strictEqual(k15.pha.hong, false);
  assert.deepStrictEqual(k15.trai, { x: 4.5, so: 3 });
  assert.strictEqual(k15.lech, 0);
  assert.match(k15.pha.chu, /4\{,\}5x \+ 3/);
  const k0 = tinh('caiCan', { nhan: 0 }, 0, CAN25);
  assert.strictEqual(k0.pha.hong, true);
  assert.deepStrictEqual([k0.trai, k0.phai], [{ x: 0, so: 0 }, { x: 0, so: 0 }]);
  // Thử x = 5: phương trình gốc 3·5 + 2 = 17, 5 + 6 = 11; sau khi nhân 0 thì cân vẫn thăng bằng
  assert.deepStrictEqual(k0.pha.truoc, [17, 11]);
  assert.strictEqual(tinh('caiCan', { nhan: 0, thu: 5 }, 0, CAN25).lech, 0);
  assert.match(k0.pha.chu, /\$17\$.*\$11\$/);
  assert.match(k0.pha.chu, /S = \\\{2\\\}/);
});
test('caiCan: không có tham số nhan thì giữ nguyên hành vi cũ', () => {
  const DT = { trai: { x: 4, so: -12 }, phai: { x: 0, so: 0 } };
  assert.strictEqual(tinh('caiCan', { thu: 4 }, 0, DT).lech, 4);
  assert.strictEqual(tinh('caiCan', { thu: 4, nhan: 1 }, 0, DT).lech, 4);
});
test('caiCan soi: có khoá, số chỉ hiện khi em đã gõ thử', () => {
  const b = soi('caiCan', { nhan: 1 }, 0, CAN25);
  kiemSoi(b, ['trai', 'phai', 'khoiX', 'qua', 'bong', 'don']);
  assert.match(b.khoiX.chu, /\$3\$ khối.*\$1\$ khối/);
  // Nhân với 0: đòn nằm ngang với mọi x, thẻ phải cảnh báo chứ không khen
  assert.match(soi('caiCan', { nhan: 0 }, 0, CAN25).don.chu, /mọi\*\* \$x\$.*không còn chỉ ra/);
  assert.match(soi('caiCan', {}, 0, { trai: { x: -2, so: 7 }, phai: { x: 0, so: 0 } }).khoiX.chu, /Hệ số của \$x\$ âm/);
  const DT = { trai: { x: 4, so: -12 }, phai: { x: 0, so: 0 } };
  assert.doesNotMatch(soi('caiCan', {}, 0, DT).trai.chu, /Thay|đĩa nặng/, 'chưa gõ thì không nói đĩa nặng bao nhiêu');
  assert.match(soi('caiCan', { thu: 4 }, 0, DT).trai.chu, /nặng \$4\$/);
  // Đề lời văn còn giấu: cân trống, không đọc ra hai vế
  const gia = soi('caiCan', {}, 0, { trai: { x: 5, so: 10 }, phai: { x: 0, so: 50 }, anLucDau: true });
  assert.doesNotMatch(gia.trai.chu, /5x/);
});

// ---------- Bài 26: sơ đồ đoạn ----------
test('soDoDoan soi: có khoá, chỉ nói độ dài khi em gõ thử', () => {
  const o = { tenTren: 'Ô tô', tren: [{ x: 60, nhan: '60x' }], tenDuoi: 'Xe máy', duoi: [{ so: 40, nhan: '40' }, { x: 40, nhan: '40x' }], ghi: '60x = 40 + 40x' };
  const b = soi('soDoDoan', {}, 1, o);
  kiemSoi(b, ['tren', 'duoi', 'bo', 'vach', 'pt']);
  assert.doesNotMatch(b.tren.chu, /120/, 'không lộ độ dài tại nghiệm x = 2');
  const c = soi('soDoDoan', { thu: 3 }, 1, o);
  assert.match(c.tren.chu, /dài \$180\$/);
  assert.match(c.vach.chu, /lệch nhau \$20\$/);
});

// ---------- Bài 27: máy hàm số ----------
test('mayHamSo soi: có khoá, điểm dấu hỏi không lộ', () => {
  const o = { f: { a: 2, b: -1 }, cacX: [-2, -1, 0, 1, 2], nhanF: 'f(x) = 2x − 1' };
  const b = soi('mayHamSo', {}, 1, o);
  kiemSoi(b, ['may', 'vao', 'ra', 'diem', 'truc']);
  assert.match(b.diem.chu, /\(-2; -5\)/);
  const hoi = soi('mayHamSo', {}, 1, Object.assign({ hoi: 4 }, o));
  assert.doesNotMatch(hoi.diem.chu, /\(2; 3\)/);
  assert.match(hoi.ra.chu, /dấu hỏi/);
  // 27.8: đề cho số ra y = 4; thẻ phải nói 4 như trên hình
  const nguoc = soi('mayHamSo', {}, 1, { f: { a: 0.5, b: 1 }, cacX: [-2, 0, 2], nguoc: { y: 4 } });
  assert.match(nguoc.ra.chu, /y = 4\$/);
});

// ---------- Bài 28: thêm x² thì các bậc không đều ----------
const D28 = { theoThamSo: true, tiLe: false, khung: [-3, 3, -8.5, 8.5], bac: [{ duong: 0, tu: -2, soBuoc: 4, nhan: true }], diem: [] };
test('duongThang thử phá: cong = 0 thì bậc đều, cong ≠ 0 thì bậc lệch đúng 2·cong mỗi bậc', () => {
  const md = tinh('duongThang', { a: 3, b: -1, cong: 0 }, 1, D28);
  assert.strictEqual(md.pha.hong, false);
  md.bac[0].buoc.forEach(s => assert.strictEqual(s.len, 3));
  const k = tinh('duongThang', { a: 3, b: -1, cong: 0.5 }, 1, D28);
  assert.strictEqual(k.pha.hong, true);
  // y = 0,5x² + 3x − 1: từ x = −2 sang phải từng bậc, đứng 1,5; 2,5; 3,5; 4,5
  assert.deepStrictEqual(k.pha.dung, [1.5, 2.5, 3.5, 4.5]);
  assert.match(k.pha.chu, /0\{,\}5x\^2 \+ 3x - 1/);
  assert.match(k.pha.chu, /1\{,\}5\$; \$2\{,\}5/);
});
test('duongThang: các cảnh không theo thanh trượt không đổi', () => {
  const o = { khung: [-3, 3, -4, 9], duong: [{ a: -4, b: 1 }], bac: [{ duong: 0, tu: 0, soBuoc: 2, nhan: true }] };
  const k = tinh('duongThang', { a: 1, b: -1, cong: 0 }, 1, o);
  assert.strictEqual(k.pha, undefined);
  assert.deepStrictEqual(k.bac[0].buoc.map(s => [s.y1, s.y2, s.len]), [[1, -3, -4], [-3, -7, -4]]);
});
test('duongThang soi: đường cần tìm không lộ hệ số', () => {
  kiemSoi(soi('duongThang', { a: 3, b: -1, cong: 0 }, 1, D28), ['truc', 'duong0', 'bac']);
  const an = soi('duongThang', {}, 1, { khung: [-4, 1, -1, 12], tiLe: false, duong: [{ a: -2, b: 5, an: true }], bac: [{ duong: 0, tu: 0, soBuoc: -3, nhan: true }] });
  assert.doesNotMatch(an.duong0.chu, /-2x/);
});

// ---------- Bài 29: hai hệ số góc khác nhau thì cắt nhau ----------
const D29 = { theoThamSo: 2, khung: [-4, 4, -5, 5], tinhTien: { tu: 0, den: 1 }, bac: [{ duong: 0, tu: 0, soBuoc: 1, nhan: true }] };
test('haiDuongThang thử phá: cùng a thì song song, khác a thì giao điểm đúng', () => {
  const md = tinh('haiDuongThang', { a: 1, b: -2, c: 2, lechA: 0 }, 1, D29);
  assert.strictEqual(md.pha.hong, false);
  assert.strictEqual(md.dich.cungA, true);
  assert.match(md.pha.chu, /b' - b = 4/);
  // y = x − 2 và y = 3x + 2: −2x = 4, x = −2, cắt tại (−2; −4), trong khung
  const k = tinh('haiDuongThang', { a: 1, b: -2, c: 2, lechA: 2 }, 1, D29);
  assert.strictEqual(k.pha.hong, true);
  assert.deepStrictEqual(k.pha.giao, { x: -2, y: -4 });
  assert.strictEqual(k.pha.ngoai, false);
  assert.strictEqual(k.ds[1].a, 3);
  assert.strictEqual(k.dich.cungA, false);
  assert.match(k.pha.chu, /tức \$-2x = 4\$/);
  // y = x − 2 và y = 1,5x + 2: −0,5x = 4, x = −8, ngoài khung
  const xa = tinh('haiDuongThang', { a: 1, b: -2, c: 2, lechA: 0.5 }, 1, D29);
  assert.deepStrictEqual(xa.pha.giao, { x: -8, y: -10 });
  assert.strictEqual(xa.pha.ngoai, true);
  assert.match(xa.pha.chu, /tại \$x = 2\$ là \$5\$/);
  assert.match(xa.pha.chu, /\(-8; -10\)/);
  // a = −1 thì a' = −2 (ra xa 0): (a − a')x = 4 tức x = 4, không viết thừa "tức x = 4"
  const am = tinh('haiDuongThang', { a: -1, b: -2, c: 2, lechA: 1 }, 1, D29);
  assert.strictEqual(am.ds[1].a, -2);
  assert.doesNotMatch(am.pha.chu, /tức/);
  assert.match(am.pha.chu, /được \$x = 4\$/);
});
test("haiDuongThang: a' không bao giờ bằng 0, với mọi a và mọi mức phá", () => {
  [-3, -1, 1, 3].forEach(a => [0, 0.5, 1, 1.5, 2].forEach(l => {
    const k = tinh('haiDuongThang', { a, b: -2, c: 2, lechA: l }, 1, D29);
    assert.ok(Math.abs(k.ds[1].a) >= 1, 'a = ' + a + ', lechA = ' + l);
  }));
});
test('soi đường nằm ngang (a = 0, như 28.10): không phải hàm số bậc nhất', () => {
  const b = soi('duongThang', {}, 1, { khung: [0, 40, 0, 120], tiLe: false, duong: [{ a: 0, b: 100, nhan: 'chi phí 100' }] });
  assert.match(b.duong0.chu, /không\*\* phải hàm số bậc nhất/);
  assert.doesNotMatch(b.duong0.chu, /Hệ số góc/);
});
test('haiDuongThang soi: có khoá, có số', () => {
  kiemSoi(soi('haiDuongThang', { a: 1, b: -2, c: 2, lechA: 0 }, 1, D29), ['truc', 'duong0', 'duong1', 'bac', 'dich']);
  assert.ok(soi('haiDuongThang', { a: 1, b: -2, c: 2, lechA: 1 }, 1, D29).pha);
});

// ---------- Bài 30, 31: lưới kết quả, ô to ô nhỏ ----------
const V12 = { cheDo: 'chia', loai: 'theSo', tu: 1, den: 12, cot: 6, bienCo: [{ ten: 'A: Chỉ vào số nguyên tố', thuanLoi: [2, 3, 5, 7, 11] }] };
test('luoiKetQua thử phá: ô đều thì phần sáng = m/n; ô 1 to gấp 3 thì phần sáng thật = 5/14', () => {
  const md = tinh('luoiKetQua', { to: 1 }, 1, V12);
  assert.strictEqual(md.pha.hong, false);
  assert.strictEqual(md.phanSang, 5 / 12);
  const k = tinh('luoiKetQua', { to: 3 }, 1, V12);
  assert.strictEqual(k.pha.hong, true);
  assert.strictEqual(k.phanSang, 5 / 14);
  assert.match(k.pha.chu, /\\frac\{5\}\{12\} \\approx 0\{,\}417/);
  assert.match(k.pha.chu, /\\frac\{5\}\{14\} \\approx 0\{,\}357/);
  // Các phần nằm liền nhau, phủ đúng cả thanh
  const ph = k.phan.slice().sort((a, b) => a.x - b.x);
  let x = ph[0].x;
  ph.forEach(q => { assert.ok(Math.abs(q.x - x) < 1e-9); x += q.w; });
  assert.ok(Math.abs(x - ph[0].x - 92) < 1e-9);
  assert.ok(Math.abs(k.phan[0].w - 3 * k.phan[1].w) < 1e-9);
  // Ô 1 to gấp 4: 5/15 rút gọn thành 1/3
  assert.match(tinh('luoiKetQua', { to: 4 }, 1, V12).pha.chu, /\\frac\{5\}\{15\} = \\frac\{1\}\{3\}/);
});
test('luoiKetQua: không có tham số to thì các phần như cũ', () => {
  const k = tinh('luoiKetQua', {}, 1, V12);
  k.phan.forEach(q => assert.ok(Math.abs(q.w - 92 / 12) < 1e-12));
  assert.strictEqual(k.phanSang, 5 / 12);
});
test('luoiKetQua soi: có khoá, giấu số chấm sáng khi anSo', () => {
  kiemSoi(soi('luoiKetQua', {}, 1, V12), ['cham', 'sang', 'thanh', 'phanSang']);
  const an = soi('luoiKetQua', {}, 1, Object.assign({ anSo: true }, V12));
  assert.doesNotMatch(an.sang.chu, /\$5\$/);
  assert.doesNotMatch(an.phanSang.chu, /\{5\}/);
  const nhom = soi('luoiKetQua', {}, 1, { nhom: [{ ten: 'Nam', so: 4 }, { ten: 'Nữ', so: 5 }], nhomThuan: ['Nữ'], tenBienCo: 'F', gom: true });
  kiemSoi(nhom, ['cham', 'sang', 'nhom']);
});

// ---------- Bài 32: mô phỏng ----------
test('moPhong soi: có khoá, tỉ lệ khớp với k/n', () => {
  const o = { nhom: [{ ten: 'Đỏ', so: 3 }, { ten: 'Xanh', so: 2 }], thuan: ['Đỏ'] };
  const k = tinh('moPhong', { hat: 5 }, 1, o), b = canh.lay('moPhong').soi(k, { hat: 5 }, o);
  kiemSoi(b, ['tui', 'xacSuat', 'tiLe', 'cuoi', 'truc']);
  assert.match(b.xacSuat.chu, /\\frac\{3\}\{5\} = 0\{,\}6/);
  assert.ok(b.tiLe.chu.includes('n = ' + k.n + '$') && b.tiLe.chu.includes('k = ' + k.k + '$'));
});
