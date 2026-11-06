// Cảnh chương VI: kiểm tính chất toán thật của phần tinh (không đụng DOM).
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/phanThuc.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o || {});
const huuHan = o => JSON.stringify(o, (k, v) => { if (typeof v === 'number') assert.ok(Number.isFinite(v), 'số hỏng ở ' + k); return v; });
const trongHinh = (o, r, msg) => assert.ok(o.x >= r.x - 1e-9 && o.y >= r.y - 1e-9 && o.x + o.w <= r.x + r.w + 1e-9 && o.y + o.h <= r.y + r.h + 1e-9, msg);
const dt = r => r.w * r.h;
const cungO = (r, q, msg) => ['x', 'y', 'w', 'h'].forEach(k => GAN(r[k], q[k], msg + ' ' + k));

test('doanChia: các bản đoạn mẫu nối tiếp phủ đúng đoạn tử, số bản bằng |tử| : |mẫu|', () => {
  const pt = { tu: [1, 1], mau: [-2, 1] };
  [-3, -1, 0, 0.5, 1, 3, 4, 6, 2.5, 10].forEach(x => {
    const k = tinh('doanChia', {}, 1, Object.assign({ x }, pt)), h = k.hang[0];
    huuHan(k);
    GAN(h.A, x + 1, 'tử'); GAN(h.B, x - 2, 'mẫu');
    assert.strictEqual(h.xd, x !== 2);
    GAN(h.dem * Math.abs(h.B), Math.abs(h.A), 'đếm · mẫu = tử');
    GAN(h.gt, (x + 1) / (x - 2), 'giá trị');
    GAN(h.ban.reduce((s, b) => s + b.dai, 0), Math.abs(h.A), 'tổng các bản = tử');
    h.ban.forEach((b, i) => { GAN(b.tu, i * Math.abs(h.B), 'nối tiếp'); assert.ok(b.dai <= Math.abs(h.B) + 1e-9); });
  });
});

test('doanChia: mẫu bằng 0 thì không xác định, không có bản nào; tử bằng 0 thì giá trị 0', () => {
  const k = tinh('doanChia', { thu: 5 }, 1, { tu: [3, 2], mau: [-5, 1], x: 7 }), h = k.hang[0];
  assert.strictEqual(h.xd, false); assert.strictEqual(h.ban.length, 0); assert.strictEqual(h.gt, null);
  const k0 = tinh('doanChia', { thu: -1.5 }, 1, { tu: [3, 2], mau: [-5, 1], x: 7 }).hang[0];
  GAN(k0.A, 0); GAN(k0.gt, 0); assert.strictEqual(k0.ban.length, 0);
  // Giải đúng thì vẽ tại xGiai
  GAN(tinh('doanChia', { trangThai: 'giai' }, 1, { tu: [3, 2], mau: [-5, 1], x: 7, xGiai: 5 }).hang[0].B, 0);
});

test('doanChia: theo đường đi x, đứng yên lúc đầu, tới đúng từng giá trị; một tỉ lệ cho mọi khung', () => {
  const o = { tu: [1, 1], mau: [-2, 1], xs: [6, 4, 3, 2.5, 2] };
  GAN(tinh('doanChia', {}, 0, o).hang[0].x, 6); GAN(tinh('doanChia', {}, 0.08, o).hang[0].x, 6, 'đứng yên 10% đầu');
  GAN(tinh('doanChia', {}, 1, o).hang[0].x, 2);
  const L = tinh('doanChia', {}, 0, o).L;
  TT.concat([0.33, 0.6, 0.9]).forEach(t => { const k = tinh('doanChia', {}, t, o); huuHan(k); GAN(k.L, L, 'tỉ lệ chung ở t=' + t); assert.ok(Math.abs(k.hang[0].A) <= L + 1e-9); });
  // Đặt dần các bản: chưa đặt bản nào lúc đầu, đủ lúc cuối
  const m = { tu: 7, mau: 2 };
  assert.strictEqual(tinh('doanChia', {}, 0, m).hang[0].ban.length, 0);
  GAN(tinh('doanChia', {}, 1, m).hang[0].ban.reduce((s, b) => s + b.dai, 0), 7);
});

test('luoiPhanSo mot: chia mỗi cột thành M ô thì phần tô không đổi (a/b = aM/bM)', () => {
  for (let x = 1; x <= 6; x++) TT.forEach(t => {
    const k = tinh('luoiPhanSo', { x }, t, { dang: 'mot', tu: [0, 1], mau: [1, 1], M: [2, 1] });
    huuHan(k);
    assert.strictEqual(k.a, x); assert.strictEqual(k.b, x + 1); assert.strictEqual(k.M, x + 2);
    GAN(k.gtCu, k.gtMoi, 'phần tô'); assert.strictEqual(k.oToMoi, k.a * k.M); assert.strictEqual(k.oCaMoi, k.b * k.M);
    // Diện tích tô bằng a/b diện tích một hình
    GAN(k.cotTo.reduce((s, r) => s + dt(r), 0) / dt(k.khoi[0]), x / (x + 1), 'diện tích tô');
    k.cotTo.forEach(r => assert.ok(k.khoi.some(q => { try { trongHinh(r, q); return true; } catch (e) { return false; } }), 'ô nằm trong hình'));
  });
  // Phân số lớn hơn 1 dùng nhiều hình
  const k = tinh('luoiPhanSo', {}, 1, { dang: 'mot', tu: 7, mau: 3, M: 2, dauDe: '' });
  assert.strictEqual(k.n, 3); GAN(k.cotTo.reduce((s, r) => s + dt(r), 0) / dt(k.khoi[0]), 7 / 3);
  // Rút gọn: lưới mịn lúc đầu, thô lúc cuối
  GAN(tinh('luoiPhanSo', {}, 0, { dang: 'mot', tu: 2, mau: 8, M: 2, chieu: 'gop' }).mien, 1);
  GAN(tinh('luoiPhanSo', {}, 1, { dang: 'mot', tu: 2, mau: 8, M: 2, chieu: 'gop' }).mien, 0);
});

test('luoiPhanSo cong/tru: về cùng mẫu chung, số ô của tổng (hiệu) bằng a1·k1 ± a2·k2 và đúng giá trị', () => {
  const ca = [];
  for (let x = 1; x <= 6; x++) ca.push({ p1: { tu: 1, mau: [0, 1] }, p2: { tu: 1, mau: [1, 1] }, x });
  ca.push({ p1: { tu: 2, mau: 4 }, p2: { tu: 2, mau: 8 }, mtc: 32, x: 6 });         // 2/(x−2) + 2/(x+2) tại x = 6, mẫu chung (x−2)(x+2)
  ca.push({ p1: { tu: 4, mau: 6 }, p2: { tu: 1, mau: 6 }, x: 1 });                  // cùng mẫu
  ca.push({ p1: { tu: 1, mau: 2 }, p2: { tu: 1, mau: 6 }, x: 1 });                  // 23.10 tại x = 1
  ca.forEach(o => ['cong', 'tru'].forEach(dang => TT.forEach(t => {
    const k = tinh('luoiPhanSo', {}, t, Object.assign({ dang }, o));
    if (k.loi) { assert.ok(dang === 'tru', 'chỉ hiệu âm mới không vẽ: ' + k.loi); return; }
    huuHan(k);
    const v1 = k.a1 / k.b1, v2 = k.a2 / k.b2;
    assert.strictEqual(k.Mc % k.b1, 0); assert.strictEqual(k.Mc % k.b2, 0);
    GAN(k.s1 / k.Mc, v1, 'đổi phân số thứ nhất'); GAN(k.s2 / k.Mc, v2, 'đổi phân số thứ hai');
    GAN(k.gt, dang === 'cong' ? v1 + v2 : v1 - v2, 'giá trị');
    assert.strictEqual(k.cam.length, k.s1); assert.strictEqual(k.xanh.length, k.s2);
    // Mỗi ô của mẫu chung có diện tích bằng 1/Mc của một hình, ô cam và xanh ở lưới gốc cũng vậy
    k.cam.concat(k.xanh).forEach(c => { GAN(dt(c.goc), dt(k.A) / k.Mc, 'ô gốc'); GAN(dt(c.dich), dt(k.khoi[0]) / k.Mc, 'ô đích'); });
    k.cam.forEach(c => trongHinh(c.goc, k.A, 'ô cam trong hình A')); k.xanh.forEach(c => trongHinh(c.goc, k.B, 'ô xanh trong hình B'));
    // Cộng: các ô đích không trùng nhau; trừ: ô xanh đè đúng lên các ô cam cuối
    const ten = k.cam.map(c => c.dich).concat(k.xanh.map(c => c.dich)).map(r => r.x.toFixed(6) + ',' + r.y.toFixed(6));
    if (dang === 'cong') assert.strictEqual(new Set(ten).size, ten.length, 'ô đích trùng');
    else k.xanh.forEach((c, i) => cungO(c.dich, k.cam[k.s1 - k.s2 + i].dich, 'ô xanh đè ô cam'));
    if (t === 1) k.xanh.forEach(c => cungO(c.o, c.dich, 'ô xanh tới đích'));
  })));
  assert.throws(() => tinh('luoiPhanSo', {}, 1, { dang: 'cong', p1: { tu: 1, mau: 4 }, p2: { tu: 1, mau: 6 }, mtc: 18 }), /chia hết/);
});

test('luoiPhanSo nhan: ô tô chồng là a1·a2 trong b1·b2 ô, diện tích chồng bằng tích hai phân số', () => {
  for (let x = 1; x <= 6; x++) TT.forEach(t => {
    const k = tinh('luoiPhanSo', { x }, t, { dang: 'nhan', p1: { tu: [0, 1], mau: [1, 1] }, p2: { tu: [-1, 1], mau: [0, 1] } });
    huuHan(k);
    assert.strictEqual(k.oChong, x * (x - 1)); assert.strictEqual(k.oCa, (x + 1) * x);
    GAN(dt(k.chongO) / dt(k.vuong), (x / (x + 1)) * ((x - 1) / x), 'diện tích chồng');
    GAN(k.gt, (x - 1) / (x + 1), 'rút gọn');
  });
  // Thừa số lớn hơn 1 thò ra ngoài hình vuông đơn vị
  const k = tinh('luoiPhanSo', {}, 1, { dang: 'nhan', p1: { tu: 1, mau: 6 }, p2: { tu: 6, mau: 3 } });
  GAN(dt(k.chongO) / dt(k.vuong), 1 / 3); assert.ok(k.chongO.h > k.vuong.h);
});

test('luoiPhanSo: số em gõ đi kèm giá trị đúng để so sánh; số không vẽ được thì báo, không ném lỗi', () => {
  const k = tinh('luoiPhanSo', { thu: 7 / 3 }, 1, { dang: 'mot', tu: 2, mau: 8, M: 2 });
  GAN(k.thu.dung, 0.25); GAN(k.thu.em, 7 / 3);
  assert.ok(tinh('luoiPhanSo', {}, 1, { dang: 'mot', tu: -1, mau: 3 }).loi);
  assert.ok(tinh('luoiPhanSo', {}, 1, { dang: 'mot', tu: 1.5, mau: 3 }).loi);
  assert.ok(tinh('luoiPhanSo', {}, 1, { dang: 'mot', tu: 1, mau: 300 }).loi);
});

// Thẻ: đếm số lần mỗi thẻ (bỏ dấu cách)
const dem = ds => ds.reduce((m, n) => { const k = String(n).replace(/\s+/g, ''); m[k] = (m[k] || 0) + 1; return m; }, {});
test('theNhanTu mtc: mẫu chung chứa đủ thẻ của mọi mẫu, mỗi mẫu cộng nhân tử phụ đúng bằng mẫu chung', () => {
  const ca = [
    { mau: [['2', 'x', 'x + 1'], ['3', 'x', 'x − 2']], mtc: '6x(x + 1)(x − 2)', phu: ['3(x − 2)', '2(x + 1)'] },
    { mau: [['2', '2', 'x', 'x', 'y'], ['2', '5', 'x', 'y', 'y', 'y']], mtc: '20x²y³', phu: ['5y²', '2x'] },
    { mau: [['x − 2'], [{ n: '2 − x', doi: 'x − 2' }]], mtc: 'x − 2', phu: ['1', '1'] },
    { mau: [['3', 'x − 4'], ['3', 'x', { n: '4 − x', doi: 'x − 4' }]], mtc: '3x(x − 4)', phu: ['x', '1'] }
  ];
  ca.forEach(c => TT.forEach(t => {
    const k = tinh('theNhanTu', {}, t, { dang: 'mtc', mau: c.mau });
    huuHan(k);
    assert.strictEqual(k.mtc.chu, c.mtc);
    const mtc = dem(k.cot.map(q => q.ten));
    k.hang.forEach((h, i) => {
      assert.strictEqual(h.phu, c.phu[i]);
      const r = c.mau[i].map(q => typeof q === 'object' ? q.doi : q);
      assert.deepStrictEqual(dem(r.concat(h.thieu.map(q => q.ten))), mtc, 'mẫu ' + i + ' · phụ = MTC');
      // Thẻ không chồng lên nhau sau khi xếp cột
      if (t === 1) { const xs = h.the.map(q => q.x).concat(h.thieu.map(q => q.x)).sort((a, b) => a - b); for (let j = 1; j < xs.length; j++) assert.ok(xs[j] > xs[j - 1]); }
    });
  }));
  assert.strictEqual(tinh('theNhanTu', {}, 1, { mau: [['x − 2'], [{ n: '2 − x', doi: 'x − 2' }]] }).hang[1].dau, true);
});

test('theNhanTu rutGon: bỏ từng cặp thẻ giống nhau, phần còn lại cùng với các cặp đúng bằng tử và mẫu ban đầu', () => {
  const ca = [
    { tu: ['2', '2', '5', 'x', { n: '2 − x', doi: 'x − 2' }], mau: ['2', '2', '2', 'x', 'x − 2', 'x − 2', 'x − 2'], kq: ['−5', '2(x − 2)²'] },
    { tu: ['x', 'x + 2'], mau: ['x − 2', 'x + 2'], kq: ['x', 'x − 2'] },
    { tu: ['2', 'x'], mau: ['2', 'x'], kq: ['1', '1'] },
    // Dấu trừ sinh ra ở mẫu được đưa lên tử; nhị thức âm đứng một mình phải có ngoặc
    { tu: ['a', 'x', 'x − 2'], mau: [{ n: '2 − x', doi: 'x − 2' }, 'x + 2'], kq: ['−ax', 'x + 2'] },
    { tu: ['x − 5'], mau: [{ n: '3 − x', doi: 'x − 3' }], kq: ['−(x − 5)', 'x − 3'] }
  ];
  ca.forEach(c => TT.forEach(t => {
    const k = tinh('theNhanTu', {}, t, { dang: 'rutGon', tu: c.tu, mau: c.mau });
    huuHan(k);
    assert.strictEqual(k.kqTu, c.kq[0]); assert.strictEqual(k.kqMau, c.kq[1]);
    const cap = k.tu.filter(q => q.ghep).length;
    assert.strictEqual(cap, k.mau.filter(q => q.ghep).length); assert.strictEqual(cap, k.cap);
    assert.strictEqual(k.conTu.length + cap, k.boTu.length); assert.strictEqual(k.conMau.length + cap, k.boMau.length);
    // Cặp bị bỏ là thẻ giống nhau
    const cTu = dem(k.boTu), cMau = dem(k.boMau), conT = dem(k.conTu), conM = dem(k.conMau);
    Object.keys(cTu).forEach(n => assert.strictEqual(cTu[n] - (conT[n] || 0), (cMau[n] || 0) - (conM[n] || 0), 'cặp ' + n));
  }));
});

test('buocNhay: nhảy nối tiếp, điểm cuối là tổng các bước', () => {
  const ds = [{ v: 1 }, { v: 5 / 3 }, { v: -5 / 3 }, { v: -1 }];
  TT.forEach(t => {
    const k = tinh('buocNhay', {}, t, { nhay: ds });
    huuHan(k);
    GAN(k.tong, 0);
    k.buoc.forEach((b, i) => { GAN(b.den - b.tu, ds[i].v); if (i) GAN(b.tu, k.buoc[i - 1].den); });
  });
  GAN(tinh('buocNhay', {}, 1, { nhay: [{ v: 4 / 3 }, { v: -2 / 3 }] }).tong, 2 / 3);
  assert.strictEqual(tinh('buocNhay', {}, 0, { nhay: ds }).buoc[0].hien, 0);
});
