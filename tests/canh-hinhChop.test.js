// Cảnh chương X: kiểm tính chất toán thật của phần tinh (trải phẳng giữ nguyên diện tích, ghép khít thành hình chữ nhật p × d; đổ nước giữ nguyên thể tích)
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/hinhChop.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const dt = ds => Math.abs(ds.reduce((s, q, i) => { const r = ds[(i + 1) % ds.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
const kc = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1], (P[2] || 0) - (Q[2] || 0));
const huuHan = k => k.manh.forEach(m => m.dinh.concat(m.dinh3).forEach(q => q.forEach(v => assert.ok(Number.isFinite(v), 'NaN'))));
// Bộ số: thanh trượt của cảnh và số trong các bài tập
const BO = [];
[3, 4].forEach(n => { for (let a = 2; a <= 6; a++) for (let d = 4; d <= 9; d++) BO.push({ n, a, d }); });
[[3, 40, 48], [3, 12, Math.sqrt(108)], [3, 8, Math.sqrt(48)], [4, 16, 10], [4, 10, 13], [4, 3, 2.5]].forEach(([n, a, d]) => BO.push({ n, a, d }));

test('traiChop: lúc là hình chóp, mọi mặt bên chung đỉnh S; trung đoạn d, cạnh bên l, chiều cao h thoả Pythagore', () => {
  BO.forEach(({ n, a, d }) => {
    const k = tinh('traiChop', { a, d }, 0, { n }), S = [0, 0, k.h];
    huuHan(k);
    k.manh.forEach(m => GAN(kc(m.dinh3[m.hinh.length - 1], S), 0, 'đỉnh mặt ' + m.mat, 1e-9));
    // Mảnh nửa trái của mặt 0: đỉnh đáy B, trung điểm M, đỉnh S
    const [B, M] = k.manh[0].dinh3;
    GAN(kc(M, S), d, 'SM = d');
    GAN(kc(B, M), a / 2, 'BM = a/2');
    GAN(kc(B, S), k.l, 'SB = l');
    GAN(k.l * k.l, d * d + a * a / 4, 'l² = d² + (a/2)²');
    GAN(d * d, k.h * k.h + k.r * k.r, 'd² = h² + OM²');
    assert.ok(k.h < d && d < k.l, 'h < d < l');
    if (n === 4) GAN(k.r, a / 2, 'OM = a/2');
  });
});
test('traiChop: trải phẳng và di chuyển không làm đổi diện tích; tổng luôn là n · ad/2 = p · d', () => {
  BO.forEach(({ n, a, d }) => [0.4, 0.5, 0.6, 0.7, 0.8, 1].forEach(t => {
    const k = tinh('traiChop', { a, d }, t, { n });
    huuHan(k);
    GAN(k.p, n * a / 2, 'p là nửa chu vi');
    // Diện tích thật đo trên mặt bàn (z = 0); từ t = 0,5 nhìn thẳng từ trên nên hình vẽ cũng đúng diện tích
    k.manh.forEach(m => m.dinh3.forEach(q => GAN(q[2], 0, 'nằm trên mặt bàn')));
    // Chỉ nửa phải của mặt 0 khi n lẻ được lật mặt; lúc đang lật nó trông hẹp lại đúng theo hệ số |lat|
    k.manh.forEach(m => { if (Math.abs(m.lat) < 1 - 1e-12) assert.ok(n % 2 === 1 && m.nua === 'phai', 'chỉ một mảnh được lật'); });
    const that = m => Math.abs(m.lat) < 1e-6 ? a * d / 4 : dt(m.dinh3) / Math.abs(m.lat);
    k.manh.forEach(m => GAN(that(m), m.nua ? a * d / 4 : a * d / 2, 'mảnh giữ nguyên diện tích', 1e-7));
    GAN(k.manh.reduce((s, m) => s + that(m), 0), k.p * d, 'tổng diện tích', 1e-7);
    if (t >= 0.5) GAN(k.manh.reduce((s, m) => s + dt(m.dinh) / Math.max(Math.abs(m.lat), 1e-6) * (Math.abs(m.lat) < 1e-6 ? 0 : 1), 0) + k.manh.filter(m => Math.abs(m.lat) < 1e-6).length * a * d / 4, k.p * d, 'diện tích trên hình', 1e-7);
  }));
});
test('traiChop: ở t=1 các mảnh nằm trong hình chữ nhật p × d và phủ kín nó', () => {
  BO.forEach(({ n, a, d }) => {
    const k = tinh('traiChop', { a, d }, 1, { n }), W = k.p;
    k.manh.forEach(m => m.dinh.forEach(q => {
      assert.ok(Math.abs(q[0]) <= W / 2 + 1e-9 && Math.abs(q[1]) <= d / 2 + 1e-9, 'mảnh ra ngoài hình chữ nhật');
    }));
    // Trong hình chữ nhật mà tổng diện tích bằng diện tích hình chữ nhật thì các mảnh phủ kín, không chồng nhau
    GAN(k.manh.reduce((s, m) => s + dt(m.dinh), 0), W * d, 'phủ kín', 1e-7);
    GAN(dt(k.chuNhat), W * d);
  });
});
test('traiChop: t đi qua mọi khoảng không có NaN; trung đoạn quá ngắn hoặc đáy lạ thì báo lỗi', () => {
  BO.forEach(({ n, a, d }) => TT.forEach(t => huuHan(tinh('traiChop', { a, d }, t, { n }))));
  assert.throws(() => tinh('traiChop', { a: 6, d: 3 }, 0, { n: 4 }));
  assert.throws(() => tinh('traiChop', { a: 4, d: 6 }, 0, { n: 5 }));
});
test('traiChop: khung không đổi theo t (hình không nhảy)', () => {
  const k0 = tinh('traiChop', { a: 4, d: 6 }, 0, { n: 3 }), k1 = tinh('traiChop', { a: 4, d: 6 }, 1, { n: 3 });
  ['x0', 'y0', 'x1', 'y1'].forEach(c => GAN(k0.khung[c], k1.khung[c]));
});

test('doNuoc: nước chỉ chuyển từ cốc chóp sang cốc lăng trụ; ba cốc chóp đầy đúng một lăng trụ', () => {
  [3, 4].forEach(n => [[4, 5], [2, 8], [6, 2], [10, 12], [12, 12]].forEach(([a, h]) => {
    const t0 = tinh('doNuoc', { a, h }, 0, { n }), Vchop = t0.vCoc, Vlang = t0.S * h;
    // Thể tích cốc chóp đo bằng cách cộng các lát mỏng (diện tích lát tỉ lệ với bình phương độ cao)
    let tong = 0; const N = 2000; for (let i = 0; i < N; i++) { const z = (i + 0.5) * h / N; tong += t0.S * (z / h) ** 2 * h / N; }
    GAN(Vchop, tong, 'thể tích cốc đầy', 1e-4 * Vlang);
    assert.strictEqual(t0.vLang, 0);
    [0.15, 0.2, 0.25].forEach(t => GAN(tinh('doNuoc', { a, h }, t, { n }).vCoc + tinh('doNuoc', { a, h }, t, { n }).vLang, Vchop, 'lần 1'));
    [0.4, 0.45].forEach(t => { const k = tinh('doNuoc', { a, h }, t, { n }); GAN(k.vCoc + k.vLang, 2 * Vchop, 'lần 2'); });
    [0.7, 0.8].forEach(t => { const k = tinh('doNuoc', { a, h }, t, { n }); GAN(k.vCoc + k.vLang, 3 * Vchop, 'lần 3'); });
    const k1 = tinh('doNuoc', { a, h }, 1, { n });
    GAN(k1.vLang, Vlang, 'lăng trụ đầy');
    GAN(k1.zLang, h);
    assert.strictEqual(k1.nuoc.xong, 3);
    TT.forEach(t => { const k = tinh('doNuoc', { a, h }, t, { n }); assert.ok(k.zCoc >= 0 && k.zCoc <= h + 1e-9 && k.zLang <= h + 1e-9 && Number.isFinite(k.vCoc)); });
  }));
});
test('doNuoc: đáy hai cốc bằng nhau (cùng đa giác), cạnh đáy phải dương', () => {
  const k = tinh('doNuoc', { a: 4, h: 5 }, 0, { n: 4 });
  const canhDay = ds => ds.map((q, i) => Math.hypot(q[0] - ds[(i + 1) % ds.length][0], q[1] - ds[(i + 1) % ds.length][1]));
  canhDay(k.lang.tren).forEach((c, i) => GAN(c, canhDay(k.coc.mieng)[i], 'cạnh miệng'));
  GAN(k.S, 16);
  assert.throws(() => tinh('doNuoc', { a: 0, h: 5 }, 0, { n: 4 }));
});
