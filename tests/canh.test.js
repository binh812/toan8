const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/hinhVuong.js');
require('../js/canh/manhDaiSo.js');
require('../js/canh/caiCan.js');

const GAN = (x, y, msg) => assert.ok(Math.abs(x - y) < 1e-9, (msg || '') + ' ' + x + ' ≠ ' + y);
const AB = []; for (let a = 1; a <= 6; a += .5) for (let b = 1; b <= 6; b += .5) AB.push({ a, b });
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const dtDaGiac = d => Math.abs(d.reduce((s, q, i) => { const r = d[(i + 1) % d.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
const dtManh = m => dtDaGiac(m.dinh);
const trong = (q, d) => { let c = false; for (let i = 0, j = d.length - 1; i < d.length; j = i++) if ((d[i][1] > q[1]) !== (d[j][1] > q[1]) && q[0] < (d[j][0] - d[i][0]) * (q[1] - d[i][1]) / (d[j][1] - d[i][1]) + d[i][0]) c = !c; return c; };
const chuNhat = r => [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];

test('toHopHinhVuong: phần trống luôn bằng c² lúc đầu và a²+b² lúc cuối', () => {
  AB.forEach(p => {
    const dau = tinh('toHopHinhVuong', p, 0), cuoi = tinh('toHopHinhVuong', p, 1);
    GAN(dtDaGiac(dau.oC), p.a * p.a + p.b * p.b, 'c²');
    GAN(dtDaGiac(chuNhat(cuoi.oA)) + dtDaGiac(chuNhat(cuoi.oB)), p.a * p.a + p.b * p.b, 'a²+b²');
    GAN(dau.phanTrong, cuoi.phanTrong);
  });
});
test('toHopHinhVuong: tọa độ không có NaN, nằm trong khung ở t=0 và t=1', () => {
  AB.forEach(p => TT.forEach(t => {
    const k = tinh('toHopHinhVuong', p, t);
    k.tamGiac.forEach(g => g.forEach(q => q.forEach(v => assert.ok(Number.isFinite(v)))));
    if (t === 0 || t === 1) k.tamGiac.forEach(g => g.forEach(q => q.forEach(v => assert.ok(v >= -1e-9 && v <= k.s + 1e-9))));
  }));
});
test('toHopHinhVuong: ở t=1 bốn tam giác không chồng nhau, trùng bố cục bản mẫu', () => {
  [{ a: 3, b: 4 }, { a: 2, b: 5.5 }, { a: 4, b: 4 }].forEach(p => {
    const k = tinh('toHopHinhVuong', p, 1), n = 53;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const q = [(i + .37) / n * k.s, (j + .41) / n * k.s];
      const so = k.tamGiac.filter(g => trong(q, g)).length + (trong(q, chuNhat(k.oA)) ? 1 : 0) + (trong(q, chuNhat(k.oB)) ? 1 : 0);
      assert.strictEqual(so, 1, 'điểm ' + q + ' thuộc ' + so + ' mảnh');
    }
  });
});
test('baHinhVuong: a=2.5, c=6.5 cho h=6, dienTich.h=36', () => {
  const k = tinh('baHinhVuong', {}, 0, { a: 2.5, c: 6.5 });
  GAN(k.h, 6); GAN(k.dienTich.h, 36); GAN(k.dienTich.a, 6.25); GAN(k.dienTich.c, 42.25);
  assert.strictEqual(k.thu, null);
});
test('baHinhVuong: thu=6.96 cho thu.dai≈7.39; thu âm, 0, NaN cho thu=null, không ném lỗi', () => {
  const k = tinh('baHinhVuong', { thu: 6.96 }, 0, { a: 2.5, c: 6.5 });
  GAN(k.thu.dai, Math.hypot(2.5, 6.96));
  [-1, 0, NaN, undefined, Infinity].forEach(v => assert.strictEqual(tinh('baHinhVuong', { thu: v }, 0, { a: 2.5, c: 6.5 }).thu, null));
});
test('tamGiacAn: hcn huyen=15 canh 9,12; can 3,4,5; taxi 6,8,10', () => {
  const ba = (o, a, b, c) => { const k = tinh('tamGiacAn', {}, 1, o); GAN(k.canhA, a); GAN(k.canhB, b); GAN(k.huyen, c); GAN(k.canhA ** 2 + k.canhB ** 2, k.huyen ** 2); GAN(dtDaGiac(k.dinh), a * b / 2); };
  ba({ mau: 'hcn', rong: 9, cheo: 15 }, 9, 12, 15);
  ba({ mau: 'can', cao: 4, day: 6 }, 3, 4, 5);
  ba({ mau: 'taxi', d1: 5, d2: 8, d3: 1 }, 6, 8, 10);
});
test('manhVuong tong: tổng diện tích các mảnh = (a+b)²', () => {
  AB.forEach(p => TT.forEach(t => {
    const k = tinh('manhVuong', p, t, { dang: 'tong' });
    GAN(k.manh.reduce((s, m) => s + m.dau * dtManh(m), 0), (p.a + p.b) ** 2);
  }));
});
test('manhVuong tong: thieuHaiManh ẩn đúng hai mảnh ab, phần còn lại là a²+b²', () => {
  const k = tinh('manhVuong', { a: 3, b: 5, trangThai: 'thieuHaiManh' }, 1, { dang: 'tong' });
  assert.deepStrictEqual(k.manh.filter(m => m.an).map(m => m.ten).sort(), ['ab1', 'ab2']);
  GAN(k.manh.filter(m => !m.an).reduce((s, m) => s + dtManh(m), 0), 34);
});
test('manhVuong tong: thieuMotManh ẩn đúng một mảnh ab', () => {
  const k = tinh('manhVuong', { a: 3, b: 5, trangThai: 'thieuMotManh' }, 1, { dang: 'tong' });
  assert.deepStrictEqual(k.manh.filter(m => m.an).map(m => m.ten), ['ab2']);
});
test('manhVuong hieu: tổng có dấu = (a-b)² với a>b', () => {
  AB.filter(p => p.a > p.b).forEach(p => TT.forEach(t => {
    const k = tinh('manhVuong', p, t, { dang: 'hieu' });
    GAN(k.manh.reduce((s, m) => s + m.dau * dtManh(m), 0), (p.a - p.b) ** 2);
    GAN(k.conLai.w, p.a - p.b); GAN(k.conLai.h, p.a - p.b);
  }));
});
test('manhVuong hieu và hieuHaiBP: b ≥ a không ném lỗi, không có cạnh âm', () => {
  ['hieu', 'hieuHaiBP'].forEach(dang => TT.forEach(t => {
    const k = tinh('manhVuong', { a: 2, b: 5 }, t, { dang });
    k.manh.forEach(m => m.dinh.forEach(q => q.forEach(v => assert.ok(Number.isFinite(v)))));
    assert.ok(k.a > k.b);
  }));
});
test('manhVuong hieuHaiBP: diện tích giữ nguyên = a²-b² ở mọi t; cuối cùng là hình chữ nhật (a+b)(a-b)', () => {
  AB.filter(p => p.a > p.b).forEach(p => {
    TT.forEach(t => GAN(tinh('manhVuong', p, t, { dang: 'hieuHaiBP' }).manh.reduce((s, m) => s + dtManh(m), 0), p.a ** 2 - p.b ** 2));
    const ds = tinh('manhVuong', p, 1, { dang: 'hieuHaiBP' }).manh.flatMap(m => m.dinh);
    const xs = ds.map(q => q[0]), ys = ds.map(q => q[1]);
    GAN(Math.max(...xs) - Math.min(...xs), p.a + p.b); GAN(Math.max(...ys) - Math.min(...ys), p.a - p.b);
  });
});
const DT = { trai: { x: 4, so: -12 }, phai: { x: 0, so: 0 } };
test('caiCan: 4x-12=0, thu=3 lech=0; thu=4 lech=4', () => {
  GAN(tinh('caiCan', { thu: 3 }, 0, DT).lech, 0);
  GAN(tinh('caiCan', { thu: 4 }, 0, DT).lech, 4);
  GAN(tinh('caiCan', {}, 0, DT).nghiem, 3);
});
test('caiCan: 2(x+3)-x=x+5 có lech=1 với mọi thu', () => {
  const o = { trai: { x: 1, so: 6 }, phai: { x: 1, so: 5 } };
  [-3, 0, 2, 100, undefined].forEach(thu => GAN(tinh('caiCan', { thu }, 0, o).lech, 1));
  assert.strictEqual(tinh('caiCan', {}, 0, o).nghiem, null);
});
test('caiCan: mỗi bước biến đổi giữ nguyên nghiệm', () => {
  const o = { trai: { x: 3, so: 2 }, phai: { x: 1, so: 6 }, buoc: [{ trai: { x: 2, so: 2 }, phai: { x: 0, so: 6 } }, { trai: { x: 2, so: 0 }, phai: { x: 0, so: 4 } }, { trai: { x: 1, so: 0 }, phai: { x: 0, so: 2 } }] };
  const thay = new Set();
  for (let t = 0; t <= 1; t += .05) { const k = tinh('caiCan', {}, t, o); GAN(k.nghiem, 2); GAN(k.lech, 0); thay.add(k.buocHienTai); }
  assert.deepStrictEqual([...thay], [0, 1, 2, 3]);
  assert.throws(() => tinh('caiCan', {}, 1, { trai: { x: 3, so: 2 }, phai: { x: 1, so: 6 }, buoc: [{ trai: { x: 1, so: 0 }, phai: { x: 0, so: 3 } }] }), /nghiệm/);
});
test('caiCan: x âm thì khối x kéo lên, x dương thì đè xuống; đúng với cả hệ số âm', () => {
  const o = { trai: { x: 4, so: 10 }, phai: { x: 0, so: 0 } };
  assert.strictEqual(tinh('caiCan', {}, 0, o).xAm, true);
  assert.strictEqual(tinh('caiCan', { thu: 3 }, 0, o).xAm, false);
  assert.strictEqual(tinh('caiCan', { thu: -1 }, 0, DT).xAm, true);
  assert.strictEqual(tinh('caiCan', {}, 0, DT).xAm, false);
  assert.strictEqual(tinh('caiCan', {}, 0, { trai: { x: 1, so: 6 }, phai: { x: 1, so: 5 } }).xAm, false);
});
test('toHopHinhVuong: đứng yên ở đầu cảnh để câu đầu kịp nói về hình vuông c²', () => {
  const dau = tinh('toHopHinhVuong', { a: 3, b: 4 }, 0), sau = tinh('toHopHinhVuong', { a: 3, b: 4 }, 0.09);
  assert.deepStrictEqual(sau.tamGiac, dau.tamGiac);
});
test('dangKi trùng tên thì ném lỗi', () => {
  canh.dangKi('thuTrung', { tinh() {}, ve() {} });
  assert.throws(() => canh.dangKi('thuTrung', { tinh() {}, ve() {} }), /thuTrung/);
  assert.throws(() => canh.lay('khongCo'), /khongCo/);
});
