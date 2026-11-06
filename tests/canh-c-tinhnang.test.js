// Chương V, VI: thử phá (k.pha) và soi chi tiết (canh.soi) của các cảnh Nhìn. Chỉ kiểm phần tính, không đụng DOM.
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/phanThuc.js');
require('../js/canh/duLieu.js');

const C = ten => canh.lay(ten);
const md = ten => { const p = {}, ts = C(ten).thamSo || {}; Object.keys(ts).forEach(k => { p[k] = ts[k].md; }); return p; };
const coSo = (s, so, msg) => assert.ok(s.indexOf(so) >= 0, (msg || '') + ': thiếu "' + so + '" trong "' + s + '"');

// Cấu hình đúng như phần Nhìn của bài 21–24
const O21 = { tu: [1, 1], mau: [-2, 1], tenTu: 'x + 1', tenMau: 'x − 2', xs: [6, 4, 3, 2.5, 2] };
const O22 = { dang: 'mot', tu: [0, 1], mau: [1, 1], M: [2, 1], tenM: 'x + 2', chieu: 'chia' };
const O23 = { dang: 'cong', p1: { tu: 1, mau: [0, 1] }, p2: { tu: 1, mau: [1, 1] }, mtc: [0, 1, 1] };
const O24 = { dang: 'nhan', p1: { tu: [0, 1], mau: [1, 1] }, p2: { tu: [-1, 1], mau: [0, 1] }, gon: { tu: [-1, 1], mau: [1, 1], ten: '\\frac{x-1}{x+1}', dk: 'x \\ne 0' } };

test('doanChia thử phá: ở md không hỏng (kể cả khi đường x tới mẫu 0), ép mẫu về 0 thì hỏng', () => {
  const ts = C('doanChia').thamSo.epMau;
  assert.ok(ts.pha && ts.md === 1 && ts.min === 0);
  [0, 0.3, 0.6, 1].forEach(t => assert.strictEqual(C('doanChia').tinh(md('doanChia'), t, O21).pha.hong, false, 't = ' + t));
  // Thiếu tham số (các chỗ cũ gọi tinh với p rỗng) thì như md
  assert.strictEqual(C('doanChia').tinh({}, 0, O21).pha.hong, false);
  const h = C('doanChia').tinh({ epMau: 0 }, 0, O21);
  assert.strictEqual(h.pha.hong, true);
  assert.strictEqual(h.hang[0].xd, false); assert.strictEqual(h.hang[0].ban.length, 0);
  coSo(h.pha.chu, 'đoạn tử dài $7', 'tử 7 tại x = 6');
  coSo(h.pha.chu, 'chia cho $0$ không có kết quả', 'chỗ hỏng');
  coSo(h.pha.chu, '\\frac{7}{4}', 'phân thức thật vẫn có giá trị');
});

test('doanChia thử phá: thu mẫu còn ep lần thì số bản = tử : (ep · mẫu), mẫu gốc giữ nguyên', () => {
  const k = C('doanChia').tinh({ epMau: 0.5 }, 0, O21), h = k.hang[0];
  assert.strictEqual(k.pha.hong, false);
  assert.ok(Math.abs(h.B0 - 4) < 1e-9 && Math.abs(h.B - 2) < 1e-9);
  assert.ok(Math.abs(h.dem - 3.5) < 1e-9);
  coSo(k.pha.chu, '3{,}5', 'số lần đặt');
  // Nói rõ đó là đoạn đã thu; phân thức thật vẫn bằng 7/4
  coSo(k.pha.chu, '\\frac{7}{4} = 1{,}75', 'giá trị thật');
  const sg = C('doanChia').soi(k, {}, O21).giaTri.chu;
  coSo(sg, 'đoạn đã thu', 'thẻ giá trị'); coSo(sg, '\\frac{7}{4}', 'thẻ giá trị: giá trị thật');
  // Không thử phá: hành vi cũ
  const cu = C('doanChia').tinh({}, 0, O21).hang[0];
  assert.ok(Math.abs(cu.B - 4) < 1e-9 && Math.abs(cu.dem - 1.75) < 1e-9);
});

test('luoiPhanSo thử phá bài 22: x = −2 làm M = 0, x = −1 làm mẫu 0; các x khác thì a/b = aM/bM', () => {
  const tinh = v => C('luoiPhanSo').tinh(Object.assign(md('luoiPhanSo'), { xThu: v }), 1, O22).pha;
  assert.strictEqual(tinh(1).hong, false);
  coSo(tinh(1).chu, '\\frac{3}{4} = \\frac{15}{20}', 'x = 3 (md)');
  assert.strictEqual(tinh(-2).hong, true);
  // M = x + 2 là đa thức khác 0: đẳng thức vẫn đúng, chỉ tại x = −2 vế phải không có giá trị (vàng, không đỏ)
  assert.strictEqual(tinh(-2).chiHinh, true); assert.strictEqual(tinh(-1).chiHinh, true);
  coSo(tinh(-2).chu, '\\frac{-2}{-1} = 2', 'bên trái vẫn là 2');
  coSo(tinh(-2).chu, '\\frac{0}{0}', 'bên phải 0/0');
  assert.strictEqual(tinh(-1).hong, true);
  [0, -3].forEach(v => assert.strictEqual(tinh(v).hong, false, 'x = ' + v));
  coSo(tinh(-3).chu, '1{,}5', '−3/−2 = 3/2');
});

test('luoiPhanSo thử phá bài 23: mẫu x hoặc x + 1 bằng 0 thì không cộng được; x = −2 cộng đúng −3/2', () => {
  const tinh = v => C('luoiPhanSo').tinh(Object.assign(md('luoiPhanSo'), { xThu: v }), 1, O23).pha;
  assert.strictEqual(tinh(1).hong, false);
  coSo(tinh(1).chu, '\\frac{7}{12}', '1/3 + 1/4');
  assert.strictEqual(tinh(0).hong, true); assert.strictEqual(tinh(-1).hong, true);
  assert.strictEqual(tinh(-2).hong, false);
  coSo(tinh(-2).chu, '\\frac{-3}{2} = -1{,}5', '1/(−2) + 1/(−1)');
});

test('luoiPhanSo thử phá bài 24: x = 0 tích không tính được, mà kết quả rút gọn vẫn ra −1', () => {
  const tinh = v => C('luoiPhanSo').tinh(Object.assign(md('luoiPhanSo'), { xThu: v }), 1, O24).pha;
  assert.strictEqual(tinh(1).hong, false);
  coSo(tinh(1).chu, '\\frac{6}{12} = 0{,}5', '3/4 · 2/3');
  const h = tinh(0);
  assert.strictEqual(h.hong, true);
  coSo(h.chu, '\\frac{-1}{0}', 'phân thức thứ hai');
  coSo(h.chu, 'lại cho $-1', 'rút gọn (x − 1)/(x + 1) tại 0');
  assert.strictEqual(tinh(-1).hong, true);
  // x = −2: (−2)/(−1) · (−3)/(−2) = 6/2 = 3, khớp (x − 1)/(x + 1) = 3
  coSo(tinh(-2).chu, '\\frac{6}{2} = 3', 'x = −2');
});

test('luoiPhanSo: thanh thử phá ở md không đổi gì so với trước', () => {
  const a = C('luoiPhanSo').tinh({ x: 4 }, 0.6, O22), b = C('luoiPhanSo').tinh({ x: 4, xThu: 1 }, 0.6, O22);
  assert.deepStrictEqual(Object.assign({}, a, { pha: null }), Object.assign({}, b, { pha: null }));
  assert.strictEqual(a.x, 4);
  assert.ok(C('luoiPhanSo').tinh({ x: 4, xThu: -1 }, 0.6, O22).loi, 'x = −1 không vẽ ô');
});

test('soi chương VI: có khoá, có số theo hình đang hiện; điều còn giấu thì không nói', () => {
  const d = C('doanChia'), k = d.tinh({}, 0, O21), s = d.soi(k, {}, O21);
  ['tu', 'mau', 'ban', 'giaTri'].forEach(x => assert.ok(s[x] && s[x].chu, x));
  coSo(s.tu.chu, '$7$', 'tử'); coSo(s.mau.chu, '$4$', 'mẫu'); coSo(s.giaTri.chu, '1{,}75', 'giá trị');
  const giau = { tu: [3, 2], mau: [-5, 1], x: 7, anSo: true, anGiaTri: true };
  const sg = d.soi(d.tinh({}, 1, giau), {}, giau);
  assert.ok(!/17|\$2\$/.test(sg.tu.chu + sg.mau.chu + sg.giaTri.chu), 'anSo: không lộ số');

  const L = C('luoiPhanSo');
  const s22 = L.soi(L.tinh({ x: 3 }, 1, O22), {}, O22);
  ['to', 'ca', 'M'].forEach(x => assert.ok(s22[x], x));
  coSo(s22.to.chu, '$15$', '3 · 5 ô tô');
  const anM = { dang: 'mot', tu: [-3, 1], mau: [3, 1], M: [-3, 1], tenM: 'x − 3', chieu: 'gop', x: 5, anM: true };
  assert.ok(!/\$2\$ ô bằng/.test(L.soi(L.tinh({}, 0, anM), {}, anM).M.chu), 'anM: không nói số ô mỗi cột');
  const s23 = L.soi(L.tinh({ x: 3 }, 1, O23), {}, O23);
  coSo(s23.tong.chu, '4 + 3 = 7', 'dồn ô');
  const s24 = L.soi(L.tinh({ x: 3 }, 1, O24), {}, O24);
  ['dai1', 'dai2', 'chong', 'vuong'].forEach(x => assert.ok(s24[x], x));
  coSo(s24.chong.chu, '3 \\cdot 2 = 6', 'ô chồng');
  coSo(s24.vuong.chu, '4 \\cdot 3 = 12', 'cả hình');
});

test('soi chương V: thẻ dữ liệu, biến hình, cắt trục', () => {
  const T = C('theDuLieu'), g = T.tinh({}, 1, { tron: true }), s = T.soi(g, {}, { tron: true });
  ['roiRac', 'lienTuc', 'coThuTu', 'khongThuTu', 'voLi'].forEach(x => assert.ok(s[x] && s[x].chu, x));
  coSo(s.voLi.chu, '$30$', 'thẻ vô lí'); coSo(s.lienTuc.chu, '12{,}5', 'số phút'); coSo(s.coThuTu.chu, 'Đạt < Khá < Tốt', 'bậc');
  // Đề bắt em phân loại (anTen) thì không soi
  assert.deepStrictEqual(T.soi(g, {}, { anTen: true }), {});

  const B = C('bienHinh'), ob = { nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], so: [16, 10, 8, 6], don: 'bạn', den: 'tron', thuoc: '%' };
  const sb = B.soi(B.tinh({}, 1, ob), {}, ob);
  ['muc0', 'muc1', 'muc2', 'muc3', 'bang'].forEach(x => assert.ok(sb[x], x));
  coSo(sb.muc0.chu, '\\frac{16}{40}', 'bóng đá'); coSo(sb.muc0.chu, '= 40\\%', '16/40 = 40%');
  coSo(sb.muc2.chu, '= 20\\%', '8/40');
  const an = Object.assign({ anLucDau: true }, ob);
  assert.ok(!/%/.test(B.soi(B.tinh({}, 1, an), {}, an).muc0.chu), 'anLucDau: không tính sẵn phần trăm');

  const K = C('catTruc'), ok = { nhan: ['2019 – 2020', '2020 – 2021'], so: [81, 82], goc: 80, dinh: 84, don: '%', hoi: [1, 0] };
  const sk = K.soi(K.tinh({}, 1, ok), {}, ok);
  ['cot0', 'cot1', 'goc', 'cat'].forEach(x => assert.ok(sk[x], x));
  coSo(sk.cot1.chu, '82 - 80 = 2', 'cột xanh'); coSo(sk.goc.chu, 'gấp $2$ lần', 'tỉ số chiều cao');
  coSo(sk.goc.chu, '\\approx 1{,}01', 'tỉ số số liệu');
  const s0 = K.soi(K.tinh({}, 0, ok), {}, ok);
  coSo(s0.goc.chu, 'bắt đầu từ $0$', 'chưa cắt');
  const giau = Object.assign({ anLucDau: true, nguoc: true }, ok);
  assert.ok(!/= 2\$ phần|gấp/.test(K.soi(K.tinh({}, 0, giau), {}, giau).cot1.chu + K.soi(K.tinh({}, 0, giau), {}, giau).goc.chu), 'anLucDau: không lộ chiều cao');
});
