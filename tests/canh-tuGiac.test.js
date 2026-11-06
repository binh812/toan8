// Kiểm tính chất toán của các cảnh chương III (js/canh/tuGiac.js)
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/tuGiac.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-6), (msg || '') + ' ' + x + ' ≠ ' + y);
const GANP = (P, Q, msg) => { GAN(P[0], Q[0], msg + ' (x)'); GAN(P[1], Q[1], msg + ' (y)'); };
const TT = [0, 0.25, 0.5, 0.75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const md = ten => { const s = canh.lay(ten).thamSo || {}, p = {}; Object.keys(s).forEach(k => { p[k] = s[k].md; }); return p; };
const dai = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
const doGoc = (P, O, Q) => { const u = [P[0] - O[0], P[1] - O[1]], v = [Q[0] - O[0], Q[1] - O[1]]; return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)))) * 180 / Math.PI; };
const chuan = a => ((a % 360) + 360) % 360;
const dtDaGiac = d => Math.abs(d.reduce((s, q, i) => { const r = d[(i + 1) % d.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
// Mọi số trong kết quả đều hữu hạn
function huuHan(x, duong) {
  if (typeof x === 'number') assert.ok(Number.isFinite(x), 'NaN/Infinity ở ' + duong);
  else if (Array.isArray(x)) x.forEach((y, i) => huuHan(y, duong + '[' + i + ']'));
  else if (x && typeof x === 'object') Object.keys(x).forEach(k => huuHan(x[k], duong + '.' + k));
}
// Các quạt nằm liền nhau quanh cùng một tâm, phủ đúng tong độ
function lienNhau(ds, T, tong, msg) {
  let bd = ds[0].bd;
  ds.forEach((q, i) => { GANP(q.tam, T, msg + ' tâm quạt ' + i); GAN(chuan(q.bd - bd + 1e-9), 1e-9, msg + ' quạt ' + i + ' không liền', 1e-6); bd = q.bd + q.goc; });
  GAN(ds.reduce((s, q) => s + q.goc, 0), tong, msg + ' tổng');
}

test('gocTuGiac chia: hai tam giác mỗi tam giác 180°, sáu góc ghép thành một vòng đúng bằng bốn góc tứ giác', () => {
  for (let cx = 4.5; cx <= 8.5; cx += 0.5) for (let cy = 3; cy <= 6; cy += 0.5) {
    TT.forEach(t => huuHan(tinh('gocTuGiac', { cx, cy }, t, { dang: 'chia' }), 'chia'));
    const k = tinh('gocTuGiac', { cx, cy }, 1, { dang: 'chia' });
    k.tamGiac.forEach((tg, i) => GAN(tg.reduce((s, q) => s + q.goc, 0), 180, 'tam giác ' + i));
    GAN(k.g.reduce((s, x) => s + x, 0), 360, 'tổng bốn góc');
    lienNhau(k.di, k.T, 360, 'chia');
    GAN(k.di[2].goc + k.di[3].goc, k.g[1], 'hai phần góc B');
    GAN(k.di[5].goc + k.di[0].goc, k.g[3], 'hai phần góc D');
    const dau = tinh('gocTuGiac', { cx, cy }, 0, { dang: 'chia' });
    dau.di.forEach((q, i) => assert.ok(dai(q.tam, k.T) > 1, 'ở t=0 quạt ' + i + ' phải còn ở đỉnh'));
  }
});

test('gocTuGiac vòng: dựng đúng tứ giác lồi có bốn góc cho trước; góc biết + chỗ hở = 360°', () => {
  const ds = [[100, 70, 110, 80], [105, 95, 70, 90], [90, 115, 90, 65], [60, 90, 90, 120], [36, 72, 108, 144], [100, 100, 100, 60], [48, 72, 96, 144], [55, 135, 55, 115]];
  ds.forEach(g => {
    [[3], [0, 3], [1, 3], []].forEach(an => {
      TT.forEach(t => huuHan(tinh('gocTuGiac', md('gocTuGiac'), t, { goc: g, an }), 'vong'));
      const k = tinh('gocTuGiac', md('gocTuGiac'), 1, { goc: g, an });
      k.g.forEach((x, i) => GAN(x, g[i], 'góc ' + i, 1e-6));
      const biet = g.filter((_, i) => !an.includes(i)).reduce((s, x) => s + x, 0);
      GAN(k.ho.bd, biet, 'chỗ hở bắt đầu sau các góc đã biết');
      GAN(k.ho.goc, an.reduce((s, i) => s + g[i], 0), 'chỗ hở bằng tổng các góc chưa biết');
      if (k.di.length) lienNhau(k.di, k.T, biet, 'vòng');
    });
  });
  assert.throws(() => tinh('gocTuGiac', {}, 0, { goc: [200, 60, 50, 50] }), /không dựng được/);
});

test('gocTuGiac vòng: số em gõ vẽ đúng cỡ góc (hai góc bằng nhau thì hai quạt)', () => {
  const k = tinh('gocTuGiac', { thu: 95 }, 1, { goc: [120, 95, 50, 95], an: [1, 3], bang: true });
  assert.strictEqual(k.thu.length, 2);
  GAN(k.thu[0].goc + k.thu[1].goc, 190);
  GAN(k.thu[0].bd, 170);
  [-5, 0, NaN, Infinity, undefined].forEach(v => assert.strictEqual(tinh('gocTuGiac', { thu: v }, 1, { goc: [100, 70, 110, 80], an: [3] }).thu, undefined));
});

test('thangCan: gập theo trục thì A trùng B, D trùng C; cạnh bên và đường chéo bằng nhau; hai góc đáy bằng nhau', () => {
  for (let dn = 1; dn <= 6; dn += 0.5) for (let h = 1.5; h <= 5; h += 0.5) {
    TT.forEach(t => huuHan(tinh('thangCan', { dn, h }, t, { dinh: 'S' }), 'thangCan'));
    const k = tinh('thangCan', { dn, h }, 1, {});
    GANP(k.lat.A, k.B, 'A gập'); GANP(k.lat.D, k.C, 'D gập'); GANP(k.lat.H, k.K, 'H gập'); GANP(k.lat.C, k.D, 'C gập');
    GAN(dai(k.A, k.D), dai(k.B, k.C), 'cạnh bên'); GAN(dai(k.A, k.C), dai(k.B, k.D), 'đường chéo');
    GAN(doGoc(k.A, k.D, k.C), doGoc(k.B, k.C, k.D), 'góc đáy'); GAN(dai(k.A, k.B), dn, 'đáy nhỏ');
    const dau = tinh('thangCan', { dn, h }, 0, {});
    GANP(dau.lat.A, dau.A, 't=0 chưa gập');
  }
  const s = tinh('thangCan', { dn: 3, h: 2 }, 1, { dinh: 'S' });
  GAN(dai(s.S, s.D), dai(s.S, s.C), 'tam giác cân ở đỉnh');
  const g = tinh('thangCan', { dn: 3, h: 3.5 }, 0, { dl: 8, gocDay: 55 });
  GAN(g.gocDay, 55, 'góc đáy theo đề');
  const b = tinh('thangCan', md('thangCan'), 0, { dl: 18, dn: 10, canhBen: 9 });
  GAN(dai(b.A, b.D), 9, 'cạnh bên theo đề');
  const c = tinh('thangCan', md('thangCan'), 0, { dl: 14, dn: 6, h: 5 });
  GAN(dai(c.D, c.H), 4, 'DH = (14 − 6) : 2');
  assert.throws(() => tinh('thangCan', md('thangCan'), 0, { dl: 18, dn: 10, canhBen: 3 }), /quá ngắn/);
});

test('quayHBH: quay nửa vòng quanh O thì tam giác ABC trùng CDA (hoặc ABD trùng CDB)', () => {
  for (let g = 40; g <= 140; g += 5) for (let b = 2; b <= 5; b += 0.5) {
    TT.forEach(t => huuHan(tinh('quayHBH', { g, b }, t, {}), 'quayHBH'));
    const k = tinh('quayHBH', { g, b }, 1, {});
    GANP(k.xoay.A, k.C, 'A tới C'); GANP(k.xoay.B, k.D, 'B tới D'); GANP(k.xoay.C, k.A, 'C tới A');
    GAN(dai(k.A, k.B), dai(k.C, k.D), 'AB = CD'); GAN(dai(k.A, k.D), dai(k.B, k.C), 'AD = BC');
    GAN(dai(k.O, k.B), dai(k.O, k.D), 'OB = OD'); GAN(doGoc(k.A, k.B, k.C), doGoc(k.C, k.D, k.A), 'góc B = góc D');
    const bd = tinh('quayHBH', { g, b }, 1, { cat: 'BD' });
    GANP(bd.xoay.A, bd.C, 'cắt BD: A tới C'); GANP(bd.xoay.D, bd.B, 'cắt BD: D tới B');
    GAN(doGoc(bd.B, bd.A, bd.D), doGoc(bd.B, bd.C, bd.D), 'góc A = góc C');
    const dau = tinh('quayHBH', { g, b }, 0, {});
    GANP(dau.xoay.B, dau.B, 't=0 chưa quay');
  }
});

test('quayHBH baDiem: ba vị trí D đều cho hình bình hành; chỉ một vị trí hiện khi chưa giải', () => {
  TT.forEach(t => huuHan(tinh('quayHBH', {}, t, { dang: 'baDiem' }), 'baDiem'));
  const k = tinh('quayHBH', { trangThai: 'giai' }, 1, { dang: 'baDiem' });
  // D = tổng hai đỉnh của đường chéo trừ đỉnh còn lại (hai đường chéo cắt nhau tại trung điểm)
  const A = k.A, B = k.B, C = k.C, cong = (P, Q, R) => [P[0] + Q[0] - R[0], P[1] + Q[1] - R[1]];
  [cong(A, C, B), cong(A, B, C), cong(B, C, A)].forEach((D, i) => { GANP(k.cap[i].D, D, 'vị trí D ' + i); GANP(k.cap[i].tamGiac[2], D, 'đỉnh quay tới D ' + i); });
  const D = k.cap.map(c => c.D);
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(dai(D[i], D[j]) > 1, 'ba điểm D khác nhau');
  const chua = tinh('quayHBH', {}, 1, { dang: 'baDiem' });
  assert.deepStrictEqual(chua.cap.map(c => c.k), [1, 0, 0]);
});

test('haiThanh: hai thanh bằng nhau gắn ở trung điểm thì bốn góc vuông; góc B ghép đúng nửa góc bẹt', () => {
  for (let phi = 30; phi <= 150; phi += 5) {
    TT.forEach(t => huuHan(tinh('haiThanh', { phi }, t, { chungMinh: true }), 'haiThanh'));
    const k = tinh('haiThanh', { phi }, 1, { chungMinh: true }), P = [k.A, k.B, k.C, k.D];
    P.forEach((V, i) => GAN(doGoc(P[(i + 3) % 4], V, P[(i + 1) % 4]), 90, 'góc ' + i));
    P.forEach((V, i) => GAN(dai(k.O, V), k.L, 'nửa thanh ' + i));
    GAN(doGoc(k.A, k.O, k.B), phi, 'góc giữa hai thanh');
    lienNhau(k.di, k.T, 180, 'ghép');
    GAN(k.di[2].goc + k.di[3].goc, 90, 'góc B');
    GAN(k.di[0].goc, k.di[2].goc, 'hai góc x'); GAN(k.di[1].goc, k.di[3].goc, 'hai góc y');
  }
});

test('haiThanh trungTuyen: AM bằng nửa BC, ABDC có bốn góc vuông, AD = BC', () => {
  [{ ab: 9, ac: 12 }, { bc: 13, gocB: 40 }, { bc: 8, gocB: 30 }, { bc: 15, gocB: 70 }].forEach(o => {
    const oo = Object.assign({ dang: 'trungTuyen' }, o);
    TT.forEach(t => huuHan(tinh('haiThanh', md('haiThanh'), t, oo), 'trungTuyen'));
    const k = tinh('haiThanh', md('haiThanh'), 1, oo);
    GAN(doGoc(k.B, k.A, k.C), 90, 'góc A'); GAN(dai(k.A, k.M), k.bc / 2, 'AM'); GAN(dai(k.A, k.D), k.bc, 'AD = BC');
    const R = [k.A, k.B, k.D, k.C];
    R.forEach((V, i) => GAN(doGoc(R[(i + 3) % 4], V, R[(i + 1) % 4]), 90, 'ABDC góc ' + i));
    GANP(k.Dk, k.D, 'D hiện đủ ở t=1');
    GANP(tinh('haiThanh', md('haiThanh'), 0, oo).Dk, k.M, 't=0 chưa kéo dài');
  });
  const k = tinh('haiThanh', md('haiThanh'), 0, { dang: 'trungTuyen', ab: 9, ac: 12 });
  GAN(k.bc, 15, 'cạnh huyền 15');
});

test('khungThoi bop: bốn cạnh luôn bằng nhau, hai đường chéo luôn vuông góc và là phân giác', () => {
  for (let g = 30; g <= 80; g += 5) TT.concat([0.3, 0.45]).forEach(t => {
    const k = tinh('khungThoi', { g }, t, { dang: 'bop' }), P = [k.A, k.B, k.C, k.D];
    huuHan(k, 'bop');
    P.forEach((V, i) => GAN(dai(V, P[(i + 1) % 4]), k.s, 'cạnh ' + i));
    GAN(doGoc(k.A, k.O, k.B), 90, 'chéo vuông góc');
    GAN(doGoc(k.B, k.A, k.C), doGoc(k.D, k.A, k.C), 'phân giác góc A');
    GAN(doGoc(k.D, k.A, k.B), k.gA, 'góc A');
  });
  GAN(tinh('khungThoi', { g: 50 }, 1, { dang: 'bop' }).gA, 130, 'bóp xong góc A thành góc bù');
});

test('khungThoi dienTich: bốn tam giác góc quay nửa vòng lấp kín hình thoi, diện tích bằng nửa hình chữ nhật', () => {
  [[16, 12], [10, 6], [8, 8]].forEach(([d1, d2]) => {
    TT.forEach(t => huuHan(tinh('khungThoi', {}, t, { dang: 'dienTich', d1, d2 }), 'dienTich'));
    const k = tinh('khungThoi', {}, 1, { dang: 'dienTich', d1, d2 });
    k.goc.forEach((tg, i) => GANP(tg[1], k.O, 'đỉnh góc ' + i + ' quay về tâm'));
    GAN(k.goc.reduce((s, tg) => s + dtDaGiac(tg), 0), dtDaGiac([k.E, k.F, k.G, k.H]), 'lấp kín');
    GAN(dtDaGiac([k.E, k.F, k.G, k.H]), d1 * d2 / 2, 'nửa hình chữ nhật');
  });
});

test('khungThoi goc: đường chéo AC chia đôi góc A', () => {
  [35 * 2, 60, 90, 120].forEach(gA => {
    const k = tinh('khungThoi', {}, 1, { gA, s: 5 });
    GAN(doGoc(k.B, k.A, k.O), gA / 2, 'nửa góc A'); GAN(doGoc(k.A, k.O, k.B), 90, 'vuông góc');
  });
  const k = tinh('khungThoi', {}, 1, { gA: 60, s: 8 });
  GAN(dai(k.B, k.D), 8, 'thoi có góc 60° thì BD bằng cạnh');
});
