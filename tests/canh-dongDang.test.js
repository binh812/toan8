// Cảnh chương IX: kiểm tính chất toán thật của phần tinh (tỉ số không đổi, góc giữ nguyên khi trượt, quay, phóng; bản sao trùng khít hình đích; diện tích gấp k²)
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/dongDang.js');

const GAN = (x, y, msg, e = 1e-9) => assert.ok(Math.abs(x - y) < e, (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, 0.25, 0.5, 0.75, 1];
const DD = canh.dongDang;
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o || {});
const kc = DD.kc, goc = DD.goc;
const ba = d => [goc(d[2], d[0], d[1]), goc(d[0], d[1], d[2]), goc(d[1], d[2], d[0])];
const soHet = kq => JSON.stringify(kq.net).match(/NaN|null,null|Infinity/) === null && kq.khung.every(Number.isFinite);
const trongKhung = (kq, q) => q[0] >= kq.khung[0] - 1e-9 && q[0] <= kq.khung[0] + kq.khung[2] + 1e-9 && q[1] >= kq.khung[1] - 1e-9 && q[1] <= kq.khung[1] + kq.khung[3] + 1e-9;

test('songSong: AM:AB = AN:AC = MN:BC = k với mọi k và t', () => {
  [0.2, 0.35, 0.5, 0.6, 0.8].forEach(k => TT.forEach(t => {
    const kq = tinh('songSong', { k }, t, { ab: 5, ac: 6.5, bc: 8 });
    const [A, B, C] = kq.ds[0], [, M, N] = kq.ds[1];
    GAN(kc(A, M) / kc(A, B), k); GAN(kc(A, N) / kc(A, C), k); GAN(kc(M, N) / kc(B, C), k);
    assert.ok(soHet(kq), 'NaN ở k=' + k + ', t=' + t);
  }));
});
test('songSong chungMinh: đoạn MN trượt giữ nguyên độ dài, cuối cùng nằm đúng lên BP trên cạnh BC', () => {
  [0.3, 0.6, 0.75].forEach(k => {
    TT.forEach(t => {
      const kq = tinh('songSong', { k }, t), d = kq.di[0].diem, [, M, N] = kq.ds[1];
      GAN(kc(d[0], d[1]), kc(M, N), 'độ dài MN');
    });
    const kq = tinh('songSong', { k }, 1), d = kq.di[0].diem, [, B, C] = kq.ds[0];
    GAN(kc(d[0], B), 0); GAN(d[1][1], 0); GAN(kc(B, d[1]) / kc(B, C), k, 'BP : BC');
    assert.ok(kq.di[0].khop);
  });
});
test('songSong tinh: tam giác AMN phóng từ A trùng khít ABC; 33.7 cho MN = 6', () => {
  const o = { ab: 5, ac: 7, bc: 10, am: 3, cheDo: 'tinh' };
  const kq = tinh('songSong', {}, 1, o), [, M, N] = kq.ds[1];
  GAN(kc(M, N), 6); assert.ok(kq.di[0].khop);
  TT.forEach(t => { const d = tinh('songSong', {}, t, o).di[0].diem; ba(d).forEach((g, i) => GAN(g, ba(kq.ds[0])[i], 'góc', 1e-7)); });
});
test('songSong: số em gõ (cả số rất lớn) chỉ vẽ trong giới hạn, không NaN', () => {
  [0.5, 6, 15, 9999].forEach(thu => assert.ok(soHet(tinh('songSong', { thu }, 1, { ab: 5, ac: 7, bc: 10, am: 3, cheDo: 'tinh' }))));
});

test('ggTrung: hai góc bằng nhau, trượt rồi phóng thì trùng khít; giữa đường các góc không đổi', () => {
  for (let gB = 30; gB <= 75; gB += 15) for (let gC = 30; gC <= 75; gC += 15) [1.2, 1.8, 2.4].forEach(k => {
    const p = { gB, gC, k }, cuoi = tinh('ggTrung', p, 1);
    assert.ok(cuoi.di[0].khop, 'không khít ' + JSON.stringify(p));
    const [S, T] = cuoi.ds;
    [kc(T[0], T[1]) / kc(S[0], S[1]), kc(T[1], T[2]) / kc(S[1], S[2]), kc(T[2], T[0]) / kc(S[2], S[0])].forEach(r => GAN(r, k, 'tỉ số', 1e-9));
    TT.forEach(t => { const d = tinh('ggTrung', p, t).di[0].diem; ba(d).forEach((g, i) => GAN(g, ba(S)[i], 'góc', 1e-7)); });
  });
});
test('ggTrung: gB + gC quá lớn thì vẫn dựng được tam giác', () => {
  const kq = tinh('ggTrung', { gB: 75, gC: 75, k: 2 }, 0.5);
  assert.ok(soHet(kq)); GAN(ba(kq.ds[0]).reduce((a, b) => a + b), 180, 'tổng góc', 1e-7);
});

test('duongCao: AH² = BH·CH; ba tam giác lật, phóng đều trùng khít ABC; HBA quay quanh H rồi phóng trùng HAC', () => {
  [[2, 4.5], [3.6, 6.4], [1, 8], [6, 1]].forEach(([bh, ch]) => {
    const dau = tinh('duongCao', { bh, ch }, 0), [A, B, C] = dau.ds[0], H = dau.ds[1][0];
    GAN(kc(A, H) ** 2, bh * ch); GAN(goc(B, A, C), 90, 'góc A', 1e-7);
    const cuoi = tinh('duongCao', { bh, ch }, 1);
    assert.ok(cuoi.di.every(x => x.khop), 'baTamGiac không khít');
    const hai = tinh('duongCao', { bh, ch }, 1, { cheDo: 'haiNho' });
    assert.ok(hai.di[0].khop, 'haiNho không khít');
    assert.deepStrictEqual(hai.di[0].kh.map(b => b.loai), ['quay', 'phong']);
    TT.forEach(t => {
      const d = tinh('duongCao', { bh, ch }, t, { cheDo: 'haiNho' }).di[0].diem;
      ba(d).forEach((g, i) => GAN(g, ba(dau.ds[1])[i], 'góc khi quay/phóng', 1e-7));
    });
  });
});
test('duongCao: AH em gõ khác √(BH·CH) thì góc A không còn vuông', () => {
  const kq = tinh('duongCao', { thu: 5 }, 0, { bh: 3.6, ch: 6.4, cheDo: 'haiNho' });
  assert.ok(kq.net.some(n => n.k === 'chu' && /góc A ≈ 88°/.test(n.s)));
  assert.ok(soHet(tinh('duongCao', { thu: 1e5 }, 0, { bh: 3.6, ch: 6.4 })));
});

test('keHoach: hai tam giác ngược chiều thì lật, cùng chiều thì quay; cuối cùng trùng khít', () => {
  const S = DD.tuCanh([3, 4, 5]).map(q => [q[0] + 1, q[1] + 2]);
  const ds = [
    { T: S.map(q => [2 * q[0], 2 * q[1]]), loai: ['doi', 'phong'] },
    { T: S.map(q => [-1.5 * q[0], 1.5 * q[1]]), loai: ['lat', 'doi', 'phong'] },
    { T: S.map(q => [-q[1] + 7, q[0]]), loai: ['quay', 'doi'] }
  ];
  ds.forEach(x => {
    const kh = DD.keHoach(S, x.T, {});
    assert.deepStrictEqual(kh.map(b => b.loai), x.loai);
    DD.viTri(S, kh, 1).diem.forEach((q, i) => { GAN(q[0], x.T[i][0]); GAN(q[1], x.T[i][1]); });
  });
});
test('trungKhit: hai tam giác không đồng dạng thì không khít (c.c.c sai); tâm phối cảnh giữ tỉ số OA\':OA = k', () => {
  const kq = tinh('trungKhit', {}, 1, { hinh: [{ dai: [3, 6, 4] }, { dai: [6, 10, 8], dat: { sau: 0 } }], di: [{ tu: 0, toi: 1 }] });
  assert.strictEqual(kq.di[0].khop, false);
  const o = { hinh: [{ diem: [[2, 1], [3, 1], [3, 2]] }], di: [{ tu: 0, tam: [0, 0], k: 2.5 }] };
  TT.forEach(t => {
    const kq2 = tinh('trungKhit', {}, t, o), d = kq2.di[0].diem;
    const r = kc(d[0], [0, 0]) / kc([2, 1], [0, 0]);
    d.forEach((q, i) => GAN(kc(q, [0, 0]) / kc(o.hinh[0].diem[i], [0, 0]), r));
    assert.ok(d.every(q => trongKhung(kq2, q)));
  });
});
test('trungKhit: nhãn ẩn hiện "?" tới khi em làm đúng', () => {
  const o = { hinh: [{ dai: [3, 5, 4], canh: [{ s: '9', an: true }] }] };
  assert.ok(tinh('trungKhit', {}, 1, o).net.some(n => n.s === '?'));
  assert.ok(tinh('trungKhit', { trangThai: 'giai' }, 1, o).net.some(n => n.s === '9'));
});

test('luoiO: hình ghép n ô, cạnh gấp k thì diện tích gấp k²; ô mới đếm được đúng n·k²', () => {
  [1, 2, 3, 4].forEach(k => TT.forEach(t => {
    const kq = tinh('luoiO', { k }, t);
    GAN(kq.dtMoi / kq.dtCu, k * k);
    if (t === 1) {
      const dt = kq.moi.reduce((s, d) => s + Math.abs(DD.dtCoDau(d)), 0);
      GAN(dt, kq.dtCu * k * k); assert.strictEqual(kq.oMoi.length, kq.dtCu * k * k);
    }
  }));
  const r = tinh('luoiO', {}, 1, { chuNhat: [6, 9], k: 5 / 3 });
  assert.strictEqual(r.oMoi.length, 150); GAN(r.dtMoi / r.dtCu, 25 / 9);
});

// Luyện thêm bài 35 (Pythagore đảo) dùng cảnh vuongDao trong hinhVuong.js
require('../js/canh/hinhVuong.js');
test('vuongDao: hình vuông trên mỗi cạnh có diện tích = cạnh²; góc lớn nhất 90° đúng khi a² + b² = c²', () => {
  [[3, 4, 5], [5, 12, 13], [7, 24, 25], [1.5, 2, 2.5], [3, 4, 6], [4, 5, 6], [2, 3, 4], [20, 21, 29], [10, 6, 8]].forEach(x => {
    const k = tinh('vuongDao', {}, 1, { canh: x }), s = x.slice().sort((p, q) => p - q);
    k.vuong.forEach(v => { GAN(kc(v.d[0], v.d[1]), v.canh); GAN(kc(v.d[1], v.d[2]), v.canh); GAN(Math.abs(DD.dtCoDau(v.d)), v.canh * v.canh, 'diện tích'); });
    const vuong = Math.abs(s[0] ** 2 + s[1] ** 2 - s[2] ** 2) < 1e-9;
    assert.strictEqual(Math.abs(k.gocLon - 90) < 1e-7, vuong, x.join(','));
    // Hình vuông dựng ra phía ngoài: tâm hình vuông và đỉnh đối diện nằm khác phía cạnh
    k.vuong.forEach((v, i) => {
      const W = k.dinh[[2, 0, 1][i]], g = v.d.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4], [0, 0]);
      const ben = q => Math.sign((v.d[1][0] - v.d[0][0]) * (q[1] - v.d[0][1]) - (v.d[1][1] - v.d[0][1]) * (q[0] - v.d[0][0]));
      assert.ok(ben(W) * ben(g) < 0);
    });
  });
  assert.throws(() => tinh('vuongDao', {}, 1, { canh: [1, 2, 3.5] }), /tam giác/);
});
