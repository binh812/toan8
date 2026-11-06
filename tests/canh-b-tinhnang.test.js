// Thử phá và soi chi tiết của các cảnh chương III, IV (bài 10–17): js/canh/tuGiac.js, js/canh/thales.js
const test = require('node:test'), assert = require('node:assert');
const C = require('../js/canh/loi.js');
require('../js/canh/tuGiac.js');
require('../js/canh/thales.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-6), (msg || '') + ' ' + x + ' ≠ ' + y);
const tinh = (ten, p, t, o) => C.lay(ten).tinh(p, t, o || {});
const md = ten => { const s = C.lay(ten).thamSo || {}, p = {}; Object.keys(s).forEach(k => { p[k] = s[k].md; }); return p; };
const voi = (ten, them) => Object.assign(md(ten), them);
const dai = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
const doGoc = (P, O, Q) => { const u = [P[0] - O[0], P[1] - O[1]], v = [Q[0] - O[0], Q[1] - O[1]]; return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)))) * 180 / Math.PI; };
const boPha = k => { const c = Object.assign({}, k); delete c.pha; return c; };

// Mỗi cảnh: tên, tuỳ chọn của phần Nhìn, tham số pha, giá trị lệch
const CANH = [
  ['gocTuGiac', { dang: 'chia' }, 'lom', 1.25],
  ['thangCan', { cheo: true, goc: { D: '', C: '' } }, 'lech', 1],
  ['quayHBH', { cheo: 'sau' }, 'lech', 1],
  ['haiThanh', { chungMinh: true }, 'lech', 2],
  ['khungThoi', { dang: 'bop' }, 'lech', 1],
  ['thalesLuoi', {}, 'dN', 0.4],
  ['thalesTrungBinh', {}, 'tM', 0.3],
  ['thalesPhanGiac', {}, 'lech', 10]
];

test('mọi cảnh chương III, IV: giá trị mặc định của tham số pha giữ định lí đúng, lệch đi thì báo hỏng', () => {
  CANH.forEach(([ten, o, k, lech]) => {
    const s = C.lay(ten).thamSo[k];
    assert.ok(s && s.pha, ten + ' thiếu tham số pha ' + k);
    [0, 0.5, 1].forEach(t => {
      const ok = tinh(ten, md(ten), t, o);
      assert.strictEqual(ok.pha.hong, false, ten + ' ở md, t=' + t);
      assert.ok(ok.pha.chu.length > 20, ten + ' chữ khẳng định');
      const sai = tinh(ten, voi(ten, { [k]: lech }), t, o);
      assert.strictEqual(sai.pha.hong, true, ten + ' lệch, t=' + t);
      assert.match(sai.pha.chu, /\d/, ten + ' chữ báo hỏng phải có số');
      [s.min, s.max].forEach(v => assert.ok(tinh(ten, voi(ten, { [k]: v }), t, o).pha, ten + ' ' + k + '=' + v));
    });
  });
});

test('thử phá không đổi hành vi cũ: ở md, kết quả trùng với lúc chưa có tham số pha', () => {
  CANH.forEach(([ten, o, k]) => {
    const p = md(ten), cu = Object.assign({}, p);
    delete cu[k];
    [0, 0.3, 0.7, 1].forEach(t => assert.deepStrictEqual(boPha(tinh(ten, p, t, o)), boPha(tinh(ten, cu, t, o)), ten + ' t=' + t));
  });
});

test('gocTuGiac lõm: bốn góc đo được hụt đúng 2(∠CBD + ∠CDB) so với 360°, và chỗ hở trên vòng đúng bằng phần hụt', () => {
  for (const lom of [1.125, 1.25]) {
    const k = tinh('gocTuGiac', voi('gocTuGiac', { lom }), 1, { dang: 'chia' }), P = k.P;
    const b2 = doGoc(P[2], P[1], P[3]), d2 = doGoc(P[1], P[3], P[2]);
    GAN(k.pha.tong, 360 - 2 * (b2 + d2), 'tổng góc');
    assert.ok(k.pha.hut > 10, 'phải hụt rõ');
    GAN(k.ho.goc, k.pha.hut, 'chỗ hở');
    assert.match(k.pha.chu, new RegExp(String(Math.round(k.pha.tong))));
  }
  const thang = tinh('gocTuGiac', voi('gocTuGiac', { lom: 1 }), 1, { dang: 'chia' });
  assert.ok(thang.pha.hong && thang.pha.thangHang, 'lom = 1: B, C, D thẳng hàng');
  assert.ok(!tinh('gocTuGiac', voi('gocTuGiac', { lom: 0.75 }), 1, { dang: 'chia' }).pha.hong, 'lom < 1 vẫn lồi');
});

test('thangCan dời đáy nhỏ: hai góc đáy, hai cạnh bên, hai đường chéo lệch nhau đúng như đo; gập thì A cách B đúng 2·lech', () => {
  const p = voi('thangCan', { lech: 1 }), k = tinh('thangCan', p, 1, {}), x = (8 - p.dn) / 2;
  GAN(k.AD, Math.hypot(x + 1, p.h), 'AD'); GAN(k.BC, Math.hypot(x - 1, p.h), 'BC');
  GAN(k.gocDay, Math.atan2(p.h, x + 1) * 180 / Math.PI, 'góc D'); GAN(k.gocC, Math.atan2(p.h, x - 1) * 180 / Math.PI, 'góc C');
  GAN(dai(k.lat.A, k.B), 2, 'gập xong A cách B');
  assert.match(k.pha.chu, new RegExp(C.fmt(k.AD).replace(',', '\\{,\\}')));
  assert.match(k.pha.chu, new RegExp(C.fmt(k.BC).replace(',', '\\{,\\}')));
});

test('quayHBH đổi CD: quay nửa vòng quanh trung điểm AC thì B rơi cách D đúng |lech|', () => {
  for (const lech of [-2, -0.5, 1.5]) {
    const k = tinh('quayHBH', voi('quayHBH', { lech }), 1, { cheo: 'sau' });
    GAN(dai(k.xoay.B, k.D), Math.abs(lech), 'B lệch D');
    GAN(k.pha.lechB, Math.abs(lech));
    assert.ok(Math.abs(dai(k.O, k.B) - dai(k.O, k.D)) > 0.1, 'OB khác OD');
  }
});

test('haiThanh thanh lệch: góc B tính lại khác 90°, khớp với số trong chữ', () => {
  for (const lech of [-3, -1, 2, 3]) {
    const k = tinh('haiThanh', voi('haiThanh', { lech }), 1, { chungMinh: true });
    GAN(k.gocB, doGoc(k.A, k.B, k.C)); GAN(dai(k.O, k.B), 4 + lech / 2, 'OB');
    assert.ok(Math.abs(k.gocB - 90) > 3, 'góc B phải lệch rõ');
    assert.match(k.pha.chu, new RegExp('Góc \\$B \\\\approx ' + Math.round(k.gocB)));
  }
  GAN(tinh('haiThanh', md('haiThanh'), 1, { chungMinh: true }).gocB, 90, 'md: góc vuông');
});

test('khungThoi thanh lệch: khung là hình bình hành AB = CD, AD = BC, hai đường chéo không vuông góc', () => {
  for (const t of [0, 0.5, 1]) {
    const k = tinh('khungThoi', voi('khungThoi', { lech: 1 }), t, { dang: 'bop' });
    GAN(dai(k.A, k.B), 4, 'AB'); GAN(dai(k.C, k.D), 4, 'CD'); GAN(dai(k.A, k.D), 5, 'AD'); GAN(dai(k.B, k.C), 5, 'BC');
    GAN(k.A[1], 0, 'AC nằm ngang'); GAN(k.C[1], 0);
    GAN(k.pha.gocO, doGoc(k.A, k.O, k.B));
    assert.ok(Math.abs(k.pha.gocO - 90) > 3, 't=' + t + ' góc giữa hai đường chéo phải lệch rõ');
  }
});

test('thalesLuoi dời N: AN/NC đổi đúng, MN không còn song song với BC', () => {
  for (const dN of [-0.6, 0.4]) {
    const k = tinh('thalesLuoi', voi('thalesLuoi', { dN }), 1, {});
    GAN(k.pha.tiAN, (2 + dN) / (3 - dN), 'AN/NC');
    assert.ok(k.pha.gocLech > 1, 'MN lệch khỏi BC');
    assert.ok(!k.songSong);
    assert.match(k.pha.chu, new RegExp(C.fmt(k.pha.tiAN).replace(',', '\\{,\\}')));
  }
});

test('thalesTrungBinh M lệch trung điểm: CM\' = AM ≠ MB, MN không song song BC', () => {
  const k = tinh('thalesTrungBinh', voi('thalesTrungBinh', { tM: 0.3 }), 1, {});
  GAN(dai(k.C, k.M2), k.AM, "CM' = AM");
  assert.ok(Math.abs(k.AM - k.MB) > 1, 'AM khác MB');
  assert.ok(k.pha.lechMN > 3);
  assert.match(k.pha.chu, new RegExp(C.fmt(k.MN).replace(',', '\\{,\\}')));
  GAN(tinh('thalesTrungBinh', md('thalesTrungBinh'), 1, {}).MN, 5, 'md: MN = BC/2');
});

test('thalesPhanGiac lệch: vẫn S_ABD : S_ACD = DB : DC, nhưng DB : DC khác AB : AC và D không cách đều hai cạnh', () => {
  const k = tinh('thalesPhanGiac', voi('thalesPhanGiac', { lech: 10 }), 1, {});
  GAN(k.S1 / k.S2, k.DB / k.DC, 'chung đường cao');
  assert.ok(Math.abs(k.DB / k.DC - k.AB / k.AC) > 0.1, 'tỉ số khác');
  assert.ok(Math.abs(k.DE - k.DF) > 0.3, 'không cách đều');
  GAN(k.gocBAD + k.gocDAC, 70, 'hai phần góc A');
  GAN(k.gocDAC - k.gocBAD, 20, 'lệch 10° mỗi bên');
  const ok = tinh('thalesPhanGiac', md('thalesPhanGiac'), 1, {});
  GAN(ok.DE, ok.DF); GAN(ok.DB / ok.DC, ok.AB / ok.AC);
});

test('soi chi tiết: mỗi cảnh Nhìn có 4–6 thẻ, đủ tiêu đề và chữ, số đo đổi theo hình', () => {
  CANH.forEach(([ten, o, k, lech]) => {
    const p = md(ten), s = C.lay(ten).soi(tinh(ten, p, 1, o), p, o), khoa = Object.keys(s);
    assert.ok(khoa.length >= 4 && khoa.length <= 6, ten + ' có ' + khoa.length + ' thẻ');
    khoa.forEach(x => { assert.ok(s[x].tieuDe && s[x].chu, ten + '.' + x); assert.ok((s[x].chu.match(/\$/g) || []).length % 2 === 0, ten + '.' + x + ' lẻ dấu $'); });
    assert.ok(khoa.some(x => /\d/.test(s[x].chu)), ten + ' phải có số đo');
    const p2 = voi(ten, { [k]: lech }), s2 = C.lay(ten).soi(tinh(ten, p2, 1, o), p2, o);
    assert.ok(khoa.some(x => s2[x].chu !== s[x].chu), ten + ' thẻ soi phải đổi khi hình hỏng');
  });
  const tg = tinh('thangCan', md('thangCan'), 0, {}), st = C.lay('thangCan').soi(tg, md('thangCan'), {});
  assert.match(st.canhBen.chu, new RegExp(C.fmt(tg.AD).replace(',', '\\{,\\}')));
  const h = tinh('haiThanh', md('haiThanh'), 1, { chungMinh: true }), sh = C.lay('haiThanh').soi(h, md('haiThanh'), { chungMinh: true });
  assert.match(sh.OAB.chu, /55/); assert.match(sh.OBC.chu, /35/);
});

test('soi không gắn vào hình mang số của đề (tránh lộ đáp số)', () => {
  // Ở Node không có DOM: một document giả, ghi lại mọi thuộc tính data-soi được gắn
  const thay = [], phanTu = () => ({ setAttribute(k, v) { if (k === 'data-soi') thay.push(v); }, appendChild(e) { return e; }, insertBefore() {}, set textContent(v) {} });
  const svg = phanTu(), cu = global.document;
  global.document = { createElementNS: phanTu };
  try {
    const ve = (ten, o, p) => { const pp = p || md(ten); C.lay(ten).ve(svg, tinh(ten, pp, 1, o), pp, 1, o); };
    ve('thangCan', { goc: { C: '65°', D: { dau: '?', cuoi: '65°' } } });
    ve('thangCan', { nhan: { AB: '6 cm' } });
    ve('gocTuGiac', { goc: [105, 95, 70, 90], an: [3] });
    ve('thalesPhanGiac', { nhan: { AB: '6' } });
    ve('thalesLuoi', { dao: { AN: 2, NC: 1 } });
    assert.deepStrictEqual(thay, []);
    ve('thangCan', { cheo: true, goc: { D: '', C: '' } });
    assert.ok(thay.length > 0, 'phần Nhìn phải có soi');
  } finally { global.document = cu; }
});
