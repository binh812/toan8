// Cảnh chương II: kiểm tính chất toán thật của phần tinh (thể tích, diện tích giữ nguyên; mỗi khối bị bỏ đúng một lần…)
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/hangDangThuc.js');

const GAN = (x, y, msg) => assert.ok(Math.abs(x - y) < 1e-9, (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const AB = []; for (let a = 1; a <= 5; a += .5) for (let b = 1; b <= 5; b += .5) AB.push({ a, b });
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const V = h => h.w * h.d * h.h;
const huuHan = ds => ds.forEach(h => ['x', 'y', 'z', 'w', 'd', 'h'].forEach(k => assert.ok(Number.isFinite(h[k]), k + ' = ' + h[k])));
// Hai hộp không chồng nhau (chỉ chạm mặt)
const roi = (p, q) => p.x + p.w <= q.x + 1e-9 || q.x + q.w <= p.x + 1e-9 || p.y + p.d <= q.y + 1e-9 || q.y + q.d <= p.y + 1e-9 || p.z + p.h <= q.z + 1e-9 || q.z + q.h <= p.z + 1e-9;
const khongChong = ds => ds.forEach((p, i) => ds.slice(i + 1).forEach(q => assert.ok(roi(p, q), 'hai khối chồng nhau')));

test('lapPhuong tong: 8 khối, tổng thể tích = (a+b)³, đếm được 1, 3, 3, 1 khối a³, a²b, ab², b³', () => {
  AB.forEach(p => TT.forEach(t => {
    const k = tinh('lapPhuong', p, t, { dang: 'tong' });
    huuHan(k.hop);
    assert.strictEqual(k.hop.length, 8);
    GAN(k.hop.reduce((s, h) => s + V(h), 0), (p.a + p.b) ** 3, 'thể tích');
    const dem = [0, 0, 0, 0];
    k.hop.forEach(h => { dem[h.nB]++; GAN(V(h), p.a ** (3 - h.nB) * p.b ** h.nB, h.loai); });
    assert.deepStrictEqual(dem, [1, 3, 3, 1]);
    khongChong(k.hop);
  }));
});
test('lapPhuong tong: ở t=0 tám khối ghép khít thành khối lập phương cạnh a+b', () => {
  AB.forEach(p => {
    const k = tinh('lapPhuong', p, 0, { dang: 'tong' }), S = p.a + p.b;
    k.hop.forEach(h => ['x', 'y', 'z'].forEach((tr, i) => { assert.ok(h[tr] >= -1e-9); assert.ok(h[tr] + [h.w, h.d, h.h][i] <= S + 1e-9); }));
  });
});
test('lapPhuong tong: chiHaiDau ẩn sáu khối giữa, motMoiLoai ẩn hai khối mỗi loại, thieuB3 ẩn khối b³', () => {
  const an = tt => tinh('lapPhuong', { a: 3, b: 2, trangThai: tt }, 1, { dang: 'tong' }).hop.filter(h => h.an).map(h => h.loai).sort();
  assert.deepStrictEqual(an('chiHaiDau'), ['a2b', 'a2b', 'a2b', 'ab2', 'ab2', 'ab2']);
  assert.deepStrictEqual(an('motMoiLoai'), ['a2b', 'a2b', 'ab2', 'ab2']);
  assert.deepStrictEqual(an('thieuB3'), ['b3']);
  assert.deepStrictEqual(an(undefined), []);
});
test('lapPhuong hieu: bỏ ba tấm a²b, trả lại ba thanh ab², bỏ b³ đúng là a³ − 3a²b + 3ab² − b³ = (a−b)³', () => {
  AB.filter(p => p.a > p.b).forEach(p => {
    const { a, b } = p, k0 = tinh('lapPhuong', p, 0, { dang: 'hieu' });
    // Tấm a·a·b gồm các khối có đoạn b trên một trục; thanh a·b·b gồm các khối có đoạn b trên hai trục
    GAN(k0.hop.reduce((s, h) => s + h.nB * V(h), 0), 3 * a * a * b, 'ba tấm');
    GAN(k0.hop.reduce((s, h) => s + h.nB * (h.nB - 1) / 2 * V(h), 0), 3 * a * b * b, 'ba thanh');
    GAN(k0.hop.filter(h => h.nB === 3).reduce((s, h) => s + V(h), 0), b ** 3, 'góc');
    TT.forEach(t => {
      const k = tinh('lapPhuong', p, t, { dang: 'hieu' });
      huuHan(k.hop); khongChong(k.hop);
      GAN(k.hop.reduce((s, h) => s + V(h), 0), a ** 3, 'thể tích');
      k.hop.forEach(h => assert.ok(h.lan >= 0 && h.lan <= 3));
    });
    const k1 = tinh('lapPhuong', p, 1, { dang: 'hieu' });
    assert.strictEqual(k1.giaiDoan, 3);
    k1.hop.forEach(h => assert.strictEqual(h.lan, h.nB === 0 ? 0 : 1, 'khối ' + h.loai + ' phải bị bỏ đúng một lần'));
    GAN(a ** 3 - k1.hop.reduce((s, h) => s + h.lan * V(h), 0), (a - b) ** 3, 'còn lại');
    GAN(V(k1.hop.find(h => h.nB === 0)), (a - b) ** 3);
  });
});
test('lapPhuong hieu: số lần bị bỏ sau từng bước là 1,2,3 rồi 1,1,0 rồi 1,1,1', () => {
  const lan = t => { const k = tinh('lapPhuong', { a: 4, b: 1.5 }, t, { dang: 'hieu' }); return [1, 2, 3].map(n => k.hop.find(h => h.nB === n).lan); };
  assert.deepStrictEqual(lan(0.3), [0, 0, 0]);
  assert.deepStrictEqual(lan(0.55), [1, 2, 3]);
  assert.deepStrictEqual(lan(0.75), [1, 1, 0]);
  assert.deepStrictEqual(lan(1), [1, 1, 1]);
});
test('lapPhuong hieu: b ≥ a không ném lỗi, không có cạnh âm', () => {
  TT.forEach(t => { const k = tinh('lapPhuong', { a: 2, b: 5 }, t, { dang: 'hieu' }); k.hop.forEach(h => assert.ok(h.w > 0 && h.d > 0 && h.h > 0)); });
});

test('haiLapPhuong hieu: ba tấm cùng dày a−b, mặt a², ab, b²; tổng = a³ − b³ = (a−b)(a²+ab+b²)', () => {
  AB.filter(p => p.a > p.b).forEach(p => TT.forEach(t => {
    const { a, b } = p, r = a - b, k = tinh('haiLapPhuong', p, t, { dang: 'hieu' });
    huuHan(k.hop); khongChong(k.hop);
    const tong = k.tam.reduce((s, h) => s + V(h), 0);
    GAN(tong, a ** 3 - b ** 3, 'ba tấm'); GAN(tong, r * (a * a + a * b + b * b));
    GAN(V(k.goc), b ** 3, 'góc');
    const mat = { a2: a * a, ab: a * b, b2: b * b };
    k.tam.forEach(h => { const day = [h.w, h.d, h.h][h.truc]; GAN(day, r, h.ten + ' dày'); GAN(V(h) / day, mat[h.mat], h.ten + ' mặt'); });
  }));
});
test('haiLapPhuong hieu: ở t=0 ba tấm và góc ghép khít khối cạnh a; góc mờ dần khi bỏ', () => {
  AB.filter(p => p.a > p.b).forEach(p => {
    const k = tinh('haiLapPhuong', p, 0, { dang: 'hieu' });
    k.hop.forEach(h => { assert.ok(h.x >= -1e-9 && h.y >= -1e-9 && h.z >= -1e-9); assert.ok(h.x + h.w <= p.a + 1e-9 && h.y + h.d <= p.a + 1e-9 && h.z + h.h <= p.a + 1e-9); });
    GAN(k.hop.reduce((s, h) => s + V(h), 0), p.a ** 3);
    GAN(k.goc.hien, 1);
    GAN(tinh('haiLapPhuong', p, 1, { dang: 'hieu' }).goc.hien, 0);
  });
});
test('haiLapPhuong tong: sáu khối giữa ghép thành ba hộp ab(a+b) liền mặt; bỏ đi còn a³ + b³', () => {
  AB.forEach(p => TT.forEach(t => {
    const { a, b } = p, k = tinh('haiLapPhuong', p, t, { dang: 'tong' });
    huuHan(k.hop);
    [0, 1, 2].forEach(i => {
      const d = k.hop.filter(h => h.doi === i);
      assert.strictEqual(d.length, 2);
      GAN(V(d[0]) + V(d[1]), a * b * (a + b), 'hộp ' + i);
      // hai khối của một đôi chỉ khác nhau ở đúng một trục: ghép lại là một hộp
      assert.strictEqual(d[0].o.filter((v, m) => v !== d[1].o[m]).length, 1);
    });
    const con = k.hop.filter(h => h.doi == null);
    GAN(con.reduce((s, h) => s + V(h), 0), a ** 3 + b ** 3);
    GAN((a + b) ** 3 - 3 * a * b * (a + b), (a + b) * (a * a - a * b + b * b));
  }));
});

const XEP = [
  { hang: [{ ten: '2x', dai: [2, 0] }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '3', dai: 3 }] },
  { hang: [{ ten: 'x', dai: [1, 0] }, { ten: '3', dai: 3 }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: 'y', dai: 2 }] },
  { hang: [{ ten: 'x', dai: 9 }], cot: [{ ten: 'x', dai: 9 }, { ten: '7', dai: 7, tru: true }] },
  { hang: [{ ten: 'x', dai: 6 }, { ten: '3', dai: 2.5, tru: true }], cot: [{ ten: 'x', dai: 6 }, { ten: '2y', dai: 2, tru: true }] }
];
test('xepChuNhat: tổng diện tích có dấu của các mảnh = tích hai cạnh hình chữ nhật cuối, ở mọi x và t', () => {
  XEP.forEach(o => [1, 2, 3.5, 5].forEach(x => TT.forEach(t => {
    const k = tinh('xepChuNhat', { x }, t, o);
    k.manh.forEach(m => ['x', 'y', 'w', 'h'].forEach(c => assert.ok(Number.isFinite(m[c]))));
    GAN(k.dienTich, k.W * k.H, 'diện tích');
    const cao = o.hang.reduce((s, c) => s + (c.tru ? -1 : 1) * (typeof c.dai === 'number' ? c.dai : c.dai[0] * x + c.dai[1]), 0);
    const rong = o.cot.reduce((s, c) => s + (c.tru ? -1 : 1) * (typeof c.dai === 'number' ? c.dai : c.dai[0] * x + c.dai[1]), 0);
    GAN(k.H, cao); GAN(k.W, rong);
  })));
});
test('xepChuNhat: ở t=1 các mảnh có sẵn lát kín, không chồng nhau, vừa khít khung các phần dương', () => {
  XEP.forEach(o => {
    const k = tinh('xepChuNhat', { x: 3 }, 1, o), co = k.manh.filter(m => m.coSan);
    GAN(co.reduce((s, m) => s + m.w * m.h, 0), k.rongCo * k.caoCo);
    co.forEach((p, i) => co.slice(i + 1).forEach(q => assert.ok(p.x + p.w <= q.x + 1e-9 || q.x + q.w <= p.x + 1e-9 || p.y + p.h <= q.y + 1e-9 || q.y + q.h <= p.y + 1e-9)));
    // mảnh bỏ đi nằm trong phần có sẵn
    k.manh.filter(m => !m.coSan).forEach(m => assert.ok(m.x >= -1e-9 && m.y >= -1e-9 && m.x + m.w <= k.rongCo + 1e-9 && m.y + m.h <= k.caoCo + 1e-9));
  });
});
test('xepChuNhat: phần bỏ đi dài hơn phần có thì báo lỗi; số em ghi được tính lại thành khung riêng', () => {
  assert.throws(() => tinh('xepChuNhat', { x: 2 }, 1, { hang: [{ ten: 'x', dai: [1, 0] }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '7', dai: 7, tru: true }] }), /dài hơn/);
  const k = tinh('xepChuNhat', { x: 3, thu: { cot: [{ ten: 'x', dai: [1, 0] }, { ten: '12', dai: 12 }], nhan: 'em ghi' } }, 1, { hang: [{ ten: '3', dai: 3 }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '4', dai: 4 }] });
  GAN(k.thu.W, 15); GAN(k.thu.H, 3); GAN(k.W, 7);
  assert.strictEqual(tinh('xepChuNhat', { x: 3, thu: 5 }, 1, XEP[0]).thu, null);
});
test('xepChuNhat: đứng yên ở đầu cảnh', () => {
  assert.deepStrictEqual(tinh('xepChuNhat', { x: 3 }, 0.09, XEP[0]).manh, tinh('xepChuNhat', { x: 3 }, 0, XEP[0]).manh);
});
