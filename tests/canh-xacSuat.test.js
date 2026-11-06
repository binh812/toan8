const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/xacSuat.js');

const GAN = (x, y, msg) => assert.ok(Math.abs(x - y) < 1e-9, (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const huuHan = (o, duong) => {
  if (typeof o === 'number') assert.ok(Number.isFinite(o), duong + ' = ' + o);
  else if (Array.isArray(o) || (o && typeof o === 'object' && !(o instanceof Function))) Object.keys(o).forEach(k => huuHan(o[k], duong + '.' + k));
};

// ---------- Lưới kết quả ----------
const DOI = { nhom: [{ ten: '8A nam', chu: 'A', so: 4 }, { ten: '8B nữ', chu: 'B', so: 5 }, { ten: '8C nam', chu: 'C', so: 3 }, { ten: '8D nữ', chu: 'D', so: 2 }],
  nhomThuan: ['8B nữ', '8D nữ'], tenBienCo: 'Chọn được một bạn nữ', gom: true };

test('luoiKetQua: mỗi vật là một chấm, chấm sáng đúng là kết quả thuận lợi', () => {
  const k = tinh('luoiKetQua', {}, 1, DOI);
  assert.strictEqual(k.n, 14);
  assert.strictEqual(k.m, 7);
  assert.deepStrictEqual(k.cham.filter(c => c.thuan).map(c => c.nhan), ['B1', 'B2', 'B3', 'B4', 'B5', 'D1', 'D2']);
  assert.ok(k.cham.every(c => c.sang === (c.thuan ? 1 : 0)));
  TT.forEach(t => huuHan(tinh('luoiKetQua', {}, t, DOI), 't' + t));
});
test('luoiKetQua: lúc gộp mỗi nhóm chỉ còn một chỗ, tách xong mọi chấm ở chỗ riêng', () => {
  const dau = tinh('luoiKetQua', {}, 0, DOI), cuoi = tinh('luoiKetQua', {}, 1, DOI);
  const cho = k => new Set(k.cham.map(c => c.x.toFixed(3) + ',' + c.y.toFixed(3))).size;
  assert.strictEqual(cho(dau), 4);
  assert.strictEqual(cho(cuoi), 14);
  assert.ok(dau.cham.every(c => c.sang === 0), 't = 0 chưa sáng chấm nào (không lộ đáp án)');
});
test('luoiKetQua: hai đồng xu có 4 kết quả, SN và NS là hai ô khác nhau', () => {
  const o = { loai: 'haiDongXu', gom: true, thuanLoi: ['SN', 'NS'], tenBienCo: 'Hai mặt khác nhau' };
  const dau = tinh('luoiKetQua', {}, 0, o), k = tinh('luoiKetQua', {}, 1, o);
  assert.strictEqual(k.n, 4);
  assert.strictEqual(k.m, 2);
  assert.strictEqual(new Set(dau.cham.map(c => c.x + ',' + c.y)).size, 3, 'gộp theo loại chỉ thấy 3');
  assert.strictEqual(new Set(k.cham.map(c => c.x + ',' + c.y)).size, 4, 'tách ra thành 4 ô');
});
test('luoiKetQua: hai xúc xắc có 36 ô, tổng bằng 3 là (1;2) và (2;1)', () => {
  const k = tinh('luoiKetQua', {}, 1, { loai: 'haiXucXac', loc: v => v[0] + v[1] === 3 });
  assert.strictEqual(k.n, 36);
  assert.deepStrictEqual(k.cham.filter(c => c.thuan).map(c => c.nhan), ['1;2', '2;1']);
});
test('luoiKetQua: thẻ từ a đến b có b − a + 1 chấm', () => {
  [[1, 15], [11, 20], [10, 99], [21, 30]].forEach(([a, b]) => assert.strictEqual(tinh('luoiKetQua', {}, 1, { loai: 'theSo', tu: a, den: b }).n, b - a + 1));
});

test('luoiKetQua chia: n phần bằng nhau lấp đủ thanh dài 1; phần sáng luôn dài m/n', () => {
  const cauHinh = [
    { loai: 'theSo', tu: 1, den: 12, cheDo: 'chia', thuanLoi: [2, 3, 5, 7, 11] },
    { loai: 'xucXac', cheDo: 'chia', thuanLoi: [1, 2, 3, 4] },
    { nhom: [{ ten: 'Xanh', so: 12 }, { ten: 'Đỏ', so: 10 }, { ten: 'Trắng', so: 8 }], nhomThuan: ['Xanh'], cheDo: 'chia', gom: true },
    { loai: 'haiXucXac', cheDo: 'chia', loc: v => v[0] === v[1] }
  ];
  cauHinh.forEach(o => TT.forEach(t => {
    const k = tinh('luoiKetQua', {}, t, o);
    huuHan(k, 't' + t);
    GAN(k.phan.reduce((s, q) => s + q.w, 0), 92, 'tổng các phần');
    assert.ok(k.phan.every(q => Math.abs(q.w - 92 / k.n) < 1e-9), 'các phần bằng nhau');
    GAN(k.phan.filter(q => q.thuan).reduce((s, q) => s + q.w, 0) / 92, k.m / k.n, 'phần sáng');
    GAN(k.phanSang, k.m / k.n);
  }));
});
test('luoiKetQua chia: dồn xong thì các phần sáng nằm liền nhau từ đầu thanh, không chồng nhau', () => {
  const o = { loai: 'theSo', tu: 1, den: 12, cheDo: 'chia', thuanLoi: [2, 3, 5, 7, 11] };
  const k = tinh('luoiKetQua', {}, 1, o), w = 92 / 12;
  const x = k.phan.map(q => Math.round((q.x - 4) / w * 1e6) / 1e6).sort((a, b) => a - b);
  assert.deepStrictEqual(x, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  k.phan.filter(q => q.thuan).forEach(q => assert.ok(q.x - 4 < 5 * w - 1e-9));
});
test('luoiKetQua: chọn biến cố theo p.chon', () => {
  const o = { loai: 'xucXac', bienCo: [{ ten: 'Hợp số', thuanLoi: [4, 6] }, { ten: 'Nhỏ hơn 5', loc: v => v < 5 }] };
  assert.strictEqual(tinh('luoiKetQua', {}, 1, o).m, 2);
  assert.strictEqual(tinh('luoiKetQua', { chon: 1 }, 1, o).m, 4);
});
test('luoiKetQua: cấu hình sai thì báo lỗi', () => {
  assert.throws(() => tinh('luoiKetQua', {}, 1, { loai: 'theSo', tu: 5, den: 2 }), /khoảng/);
  assert.throws(() => tinh('luoiKetQua', {}, 1, { nhom: [{ ten: 'a', so: 0 }] }), /số lượng/);
});

// ---------- Lần thử ----------
test('lanThu: đúng k ô sáng trong n ô, thanh tỉ lệ cuối cùng bằng k/n', () => {
  [[50, 23], [160, 120], [20, 1], [10, 0], [10, 10]].forEach(([n, k]) => {
    const r = tinh('lanThu', {}, 1, { n, k, hat: 3 });
    assert.strictEqual(r.o.length, n);
    assert.strictEqual(r.o.filter(q => q.thuan).length, k);
    GAN(r.thanh, k / n);
    TT.forEach(t => huuHan(tinh('lanThu', {}, t, { n, k }), 'n' + n + ' t' + t));
  });
});
test('lanThu: cùng hạt giống thì cùng vị trí ô sáng (tất định)', () => {
  const a = tinh('lanThu', {}, 0.5, { n: 50, k: 23, hat: 9 }), b = tinh('lanThu', {}, 0.5, { n: 50, k: 23, hat: 9 });
  assert.deepStrictEqual(a.o.map(q => q.thuan), b.o.map(q => q.thuan));
});
test('lanThu: gom xong thì k ô sáng đứng đầu, không hai ô trùng chỗ', () => {
  const r = tinh('lanThu', {}, 1, { n: 50, k: 23, hat: 9 });
  assert.strictEqual(new Set(r.o.map(q => q.x.toFixed(3) + ',' + q.y.toFixed(3))).size, 50);
  const thuTu = q => Math.round((q.y - 12) / q.s) * 10 + Math.round((q.x - (100 - 10 * q.s) / 2) / q.s);
  r.o.forEach(q => assert.ok(q.thuan ? thuTu(q) < 23 : thuTu(q) >= 23));
});
test('lanThu: bảng theo nhóm đếm đúng số lần thuận lợi', () => {
  const r = tinh('lanThu', {}, 1, { nhom: [{ ten: '0', so: 12 }, { ten: '1', so: 4 }, { ten: '2', so: 2 }, { ten: '3', so: 1 }, { ten: '≥4', so: 1 }], nhomThuan: ['2', '3', '≥4'] });
  assert.strictEqual(r.n, 20);
  assert.strictEqual(r.k, 4);
});
test('lanThu: chọn biến cố theo p.chon (ít nhất 5 / nhiều nhất 3 cuộc gọi trong 59 ngày)', () => {
  const ten = ['0', '1', '2', '3', '4', '5', '6', '7', '8'], so = [5, 9, 15, 10, 5, 6, 4, 2, 3];
  const o = { nhom: ten.map((t, i) => ({ ten: t, so: so[i] })), bienCo: [{ ten: 'E', nhom: ['5', '6', '7', '8'] }, { ten: 'F', nhom: ['0', '1', '2', '3'] }] };
  const e = tinh('lanThu', {}, 1, o), f = tinh('lanThu', { chon: 1 }, 1, o);
  assert.strictEqual(e.n, 59); assert.strictEqual(e.k, 15); assert.strictEqual(f.k, 39);
  assert.strictEqual(e.o.filter(q => q.thuan).length, 15);
  const lon = tinh('lanThu', {}, 1, { nhom: [{ ten: 'Bé trai', so: 123120 }, { ten: 'Bé gái', so: 116880 }], nhomThuan: ['Bé gái'] });
  assert.strictEqual(lon.luoi, false);
  GAN(lon.doanNhom[1].w / lon.L1Day, 116880 / 240000);
});
test('lanThu dự đoán: hai thanh cùng tỉ lệ sáng, dự đoán = m · k/n', () => {
  [[100, 40, 80], [100, 35, 120], [61, 40, 92], [500, 4, 2000]].forEach(([n, k, m]) => {
    const r = tinh('lanThu', {}, 1, { n, k, duBao: m });
    GAN(r.duDoan, m * k / n);
    GAN(r.sang1 / r.L1, k / n);
    GAN(r.sang2 / r.L2, k / n);
    GAN(r.L2 / r.L1, m / n, 'độ dài hai thanh theo tỉ lệ số lần');
    TT.forEach(t => huuHan(tinh('lanThu', {}, t, { n, k, duBao: m }), 't' + t));
  });
});
test('lanThu: số lần lớn thì vẽ thanh, phần sáng = k/n', () => {
  const r = tinh('lanThu', {}, 1, { n: 240000, k: 116880 });
  assert.strictEqual(r.luoi, false);
  GAN(r.sang1 / r.L1, 116880 / 240000);
  assert.throws(() => tinh('lanThu', {}, 1, { n: 10, k: 11 }), /n, k/);
});

// ---------- Mô phỏng ----------
test('moPhong: tất định theo hạt giống; mỗi điểm là đúng k/n của dãy đã rút', () => {
  const C = canh.sinhNgauNhien;
  const a = tinh('moPhong', { hat: 4 }, 1, {}), b = tinh('moPhong', { hat: 4 }, 1, {});
  assert.deepStrictEqual(a.diem, b.diem);
  // Dựng lại dãy bằng cùng bộ sinh: 3 đỏ, 2 xanh, rút có trả lại
  const r = C(1302); let k = 0; const dem = [0];
  for (let i = 1; i <= 1000; i++) { if (Math.floor(r() * 5) < 3) k++; dem.push(k); }
  const c = tinh('moPhong', { hat: 3 }, 1, {});
  assert.strictEqual(c.k, dem[1000]);
  c.diem.forEach(([u, v]) => { const n = Math.round(Math.exp(u * Math.log(1000))); GAN(v, dem[n] / n); });
});
test('moPhong: n tăng theo t, tỉ lệ luôn trong [0; 1], 1000 lần thì gần 3/5', () => {
  for (let h = 1; h <= 9; h++) {
    let truoc = -1;
    TT.forEach(t => {
      const k = tinh('moPhong', { hat: h }, t, {});
      huuHan(k, 'hat' + h + ' t' + t);
      assert.ok(k.n >= truoc); truoc = k.n;
      k.diem.forEach(([, v]) => assert.ok(v >= 0 && v <= 1));
    });
    const cuoi = tinh('moPhong', { hat: h }, 1, {});
    assert.strictEqual(cuoi.n, 1000);
    GAN(cuoi.p, 0.6);
    assert.ok(Math.abs(cuoi.tiLe - 0.6) < 0.05, 'lần chạy ' + h + ': ' + cuoi.tiLe);
  }
  assert.strictEqual(tinh('moPhong', {}, 0, {}).n, 0, 't = 0 chưa rút lần nào');
});
