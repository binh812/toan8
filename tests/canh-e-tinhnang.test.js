// Chương IX, X: thử phá (k.pha) đúng toán, soi chi tiết có khoá và số, lắp chứng minh dữ liệu đúng và có nhiều thứ tự.
const test = require('node:test'), assert = require('node:assert');
const path = require('path');
const canh = require('../js/canh/loi.js');
require('../js/canh/dongDang.js');
require('../js/canh/hinhChop.js');
const LCM = require('../js/core/lapcm.js');
const { loadFile } = require('../tools/nap-noi-dung.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);
const lay = ten => canh.lay(ten);
const md = ten => { const ts = lay(ten).thamSo, p = {}; Object.keys(ts).forEach(k => { p[k] = ts[k].md; }); return p; };
const DD = canh.dongDang, kc = DD.kc, goc = DD.goc;
const RAD = Math.PI / 180;
// Số trong chữ ghi kiểu SGK: 0{,}45
const coSo = (s, x) => s.indexOf(canh.fmt(x).replace(',', '{,}')) >= 0;

test('songSong thử phá: ở md không hỏng; lệch thì góc AMN = góc B − lệch và ba tỉ số khác nhau', () => {
  const p0 = md('songSong');
  assert.strictEqual(p0.lech, 0);
  const k0 = lay('songSong').tinh(p0, 1, {});
  assert.strictEqual(k0.pha.hong, false);
  assert.ok(lay('songSong').thamSo.lech.max < 12.68, 'lệch tối đa phải dưới B − C, tránh vị trí đối song');
  [5, 10].forEach(lech => [0.3, 0.6, 0.8].forEach(k => {
    const kq = lay('songSong').tinh(Object.assign({}, p0, { k, lech }), 1, {}), f = kq.pha, ct = kq.chiTiet;
    assert.strictEqual(f.hong, true);
    GAN(f.gocM, f.gocB - lech, 'góc AMN', 1e-7);
    GAN(f.gocB, goc(ct.A, ct.B, ct.C), 'góc B', 1e-9);
    // N nằm trên đoạn AC và đúng tỉ số AN : AC
    GAN(kc(ct.A, ct.N) + kc(ct.N, ct.C), kc(ct.A, ct.C), 'N trên AC', 1e-9);
    GAN(f.tiAN, kc(ct.A, ct.N) / kc(ct.A, ct.C));
    assert.ok(f.tiAN < k - 1e-3, 'AN : AC phải nhỏ hơn AM : AB khi MN quay lên phía A');
    assert.ok(Math.abs(f.tiMN - k) > 1e-3);
    assert.ok(coSo(f.chu, f.tiAN) && coSo(f.chu, k), f.chu);
  }));
});

test('ggTrung thử phá: góc C\' lệch thì B\'A\' : BA khác B\'C\' : BC (theo định lí sin) và bản sao không trùng khít', () => {
  const p0 = md('ggTrung');
  const k0 = lay('ggTrung').tinh(p0, 1);
  assert.strictEqual(k0.pha.hong, false);
  assert.ok(k0.di[0].khop);
  [-20, -5, 10, 20].forEach(lechC => {
    const p = Object.assign({}, p0, { lechC }), kq = lay('ggTrung').tinh(p, 1), f = kq.pha;
    const gB = p.gB * RAD, gC = p.gC * RAD, gC1 = (p.gC + lechC) * RAD;
    const kyVong = p.k * (Math.sin(gC1) / Math.sin(gB + gC1)) / (Math.sin(gC) / Math.sin(gB + gC));
    assert.strictEqual(f.hong, true);
    GAN(f.tiBA, kyVong, 'B\'A\' : BA', 1e-9);
    GAN(f.tiBC, p.k);
    assert.ok(Math.abs(f.tiBA - f.tiBC) > 1e-3);
    assert.ok(!kq.di[0].khop, 'không được trùng khít khi góc lệch');
    assert.ok(coSo(f.chu, f.tiBA), f.chu);
  });
  // C' = A: vẫn đồng dạng theo cặp đỉnh khác, câu báo phải nói đúng điều đó
  let dem = 0;
  for (let gB = 30; gB <= 75; gB += 5) for (let gC = 30; gC <= 75; gC += 5) for (let lechC = -20; lechC <= 20; lechC += 5) {
    if (!lechC) continue;
    const f = lay('ggTrung').tinh({ gB, gC, k: 1.8, lechC }, 1).pha, gCc = Math.min(gC, 150 - gB);
    const doi = Math.abs(Math.max(10, Math.min(gCc + lechC, 170 - gB)) - (180 - gB - gCc)) < 1e-9;
    assert.strictEqual(f.doiDinh, doi);
    assert.ok(/theo thứ tự đỉnh/.test(f.chu));
    if (doi) { dem++; assert.ok(f.chu.indexOf("\\triangle A'B'C' \\backsim \\triangle CBA") >= 0, f.chu); }
  }
  assert.ok(dem > 0);
});

test('duongCao thử phá: góc A đúng như thanh trượt, AH² khác BH · CH; ở 90° thì bằng', () => {
  const p0 = md('duongCao');
  const k0 = lay('duongCao').tinh(p0, 1, {});
  assert.strictEqual(k0.pha.hong, false);
  GAN(k0.chiTiet.ah * k0.chiTiet.ah, p0.bh * p0.ch);
  [60, 80, 100, 120].forEach(gocA => {
    const kq = lay('duongCao').tinh(Object.assign({}, p0, { gocA }), 1, {}), ct = kq.chiTiet, f = kq.pha;
    assert.strictEqual(f.hong, true);
    GAN(goc(ct.B, ct.A, ct.C), gocA, 'góc A', 1e-6);
    GAN(f.ah2, ct.ah * ct.ah); GAN(f.tich, p0.bh * p0.ch);
    assert.ok(gocA < 90 ? f.ah2 > f.tich : f.ah2 < f.tich, 'góc nhọn thì A cao hơn, góc tù thì thấp hơn');
    assert.ok(coSo(f.chu, f.ah2), f.chu);
  });
  // Đề có số đo riêng (o.bh) thì không bị thử phá chạm vào
  const de = lay('duongCao').tinh(Object.assign({}, p0, { gocA: 70 }), 1, { bh: 3.6, ch: 6.4, cheDo: 'haiNho' });
  assert.strictEqual(de.pha, undefined);
  GAN(de.chiTiet.ah, 4.8);
});

test('luoiO thử phá: chiều dọc nhân khác chiều ngang thì diện tích gấp k · kd, không phải k²', () => {
  const p0 = md('luoiO');
  const k0 = lay('luoiO').tinh(p0, 1, {});
  assert.strictEqual(k0.pha.hong, false);
  assert.strictEqual(k0.dtMoi, 3 * 4);
  [[2, 1], [2, 2], [3, -1], [1, 1]].forEach(([k, them]) => {
    const kq = lay('luoiO').tinh({ k, them }, 1, {}), kd = k + them;
    assert.strictEqual(kq.pha.hong, true);
    assert.strictEqual(kq.dtMoi, 3 * k * kd);
    assert.strictEqual(kq.oMoi.length, 3 * k * kd, 'đếm ô');
    assert.ok(kq.pha.chu.indexOf('= ' + (k * kd) + '$') >= 0 && kq.pha.chu.indexOf('k^2 = ' + k * k) >= 0, kq.pha.chu);
  });
  // k = 1, thêm = −1: dọc nhân 0,5, hình vẫn đổi
  const nua = lay('luoiO').tinh({ k: 1, them: -1 }, 1, {});
  assert.strictEqual(nua.pha.hong, true); assert.strictEqual(nua.kd, 0.5); assert.strictEqual(nua.dtMoi, 1.5);
  // Đề có k riêng: không đổi
  assert.strictEqual(lay('luoiO').tinh({ k: 2, them: 2 }, 1, { k: 3 }).dtMoi, 27);
});

test('traiChop thử phá: đáy a, a, a + lệch; ba mặt áp theo cạnh bên bằng nhau, trung đoạn khác nhau, S_xq khác p · d', () => {
  const p0 = md('traiChop');
  assert.strictEqual(lay('traiChop').tinh(p0, 1, { n: 3 }).pha.hong, false);
  const dtCoDau = d => d.reduce((s, q, i) => { const r = d[(i + 1) % d.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;
  [[4, 6, 1], [4, 6, -1.5], [2, 4, 1.5], [6, 9, -0.5], [2, 4, -1], [2, 4, -1.5], [3, 4, -1.5], [2, 9, -1.5]].forEach(([a, d, lech]) => {
    const kq = lay('traiChop').tinh({ a, d, lech }, 1, { n: 3 }), f = kq.phaHinh, b = a + lech;
    assert.strictEqual(kq.pha.hong, true);
    // Đỉnh trên tâm đường tròn ngoại tiếp đáy, cùng chiều cao h với hình chóp đều
    const dt = b / 4 * Math.sqrt(4 * a * a - b * b), R = a * a * b / (4 * dt);
    GAN(f.l, Math.sqrt(R * R + kq.h * kq.h));
    const [T1, T2, T3] = f.tamGiac, L = kc;
    GAN(L(T1[0], T1[1]), a); GAN(L(T1[1], T1[2]), f.l); GAN(L(T1[0], T1[2]), f.l);
    GAN(L(T2[0], T2[1]), f.l); GAN(L(T2[1], T2[2]), b); GAN(L(T2[0], T2[2]), f.l);
    GAN(L(T3[0], T3[1]), a); GAN(L(T3[1], T3[2]), f.l);
    // Không gập ngược: ba mặt nối tiếp sang phải, mặt ngửa và mặt úp xen kẽ chiều quay, R nằm bên phải P1
    [T1, T2, T3].forEach((T, i) => assert.ok(dtCoDau(T) > 0, 'mặt ' + (i + 1) + ' bị lật ngược'));
    const g = T => T.reduce((s, q) => s + q[0], 0) / 3;
    assert.ok(g(T1) < g(T2) && g(T2) < g(T3), 'các mặt phải nối tiếp từ trái sang phải: ' + [g(T1), g(T2), g(T3)]);
    assert.ok(T3[1][0] > T1[1][0], 'R phải nằm bên phải P1');
    GAN(f.dA, Math.sqrt(f.l * f.l - a * a / 4)); GAN(f.dB, Math.sqrt(f.l * f.l - b * b / 4));
    GAN(f.sxq, (2 * a * f.dA + b * f.dB) / 2);
    assert.ok(lech > 0 ? f.dB < f.dA : f.dB > f.dA, 'đáy dài hơn thì trung đoạn ngắn hơn');
    assert.ok(Math.abs(f.pd - f.sxq) > 1e-3, 'p · d phải khác S_xq');
    assert.ok(coSo(kq.pha.chu, f.sxq) && coSo(kq.pha.chu, f.pd), kq.pha.chu);
  });
  // Hình chóp tứ giác đều (bài 39) không có thử phá đáy
  assert.strictEqual(lay('traiChop').tinh({ a: 4, d: 6, lech: 1 }, 1, { n: 4 }).pha, undefined);
});

test('soi: chỉ bật khi nội dung xin; mỗi cảnh 3–6 khoá, mỗi khoá có tiêu đề và số', () => {
  const ca = [
    ['songSong', md('songSong'), 1, {}], ['songSong', Object.assign(md('songSong'), { lech: 10 }), 1, {}],
    ['ggTrung', md('ggTrung'), 1, {}], ['duongCao', md('duongCao'), 1, {}], ['duongCao', Object.assign(md('duongCao'), { gocA: 75 }), 1, {}],
    ['luoiO', md('luoiO'), 1, {}], ['traiChop', md('traiChop'), 1, { n: 3 }], ['traiChop', Object.assign(md('traiChop'), { lech: 1 }), 1, { n: 3 }],
    ['doNuoc', md('doNuoc'), 1, { n: 4, tenLang: 'hình hộp' }]
  ];
  ca.forEach(([ten, p, t, o]) => {
    const kq = lay(ten).tinh(p, t, o);
    assert.deepStrictEqual(lay(ten).soi(kq, p, o), {}, ten + ': không xin thì không soi');
    const bang = lay(ten).soi(kq, p, Object.assign({ chiTiet: true }, o)), khoa = Object.keys(bang);
    assert.ok(khoa.length >= (kq.phaHinh ? 2 : 3) && khoa.length <= 6, ten + ': ' + khoa.length + ' khoá');
    khoa.forEach(x => {
      assert.ok(bang[x].tieuDe && bang[x].chu, ten + '.' + x);
      assert.ok(/\d/.test(bang[x].chu), ten + '.' + x + ' thiếu số: ' + bang[x].chu);
      assert.ok(!/NaN|undefined|Infinity/.test(bang[x].chu), ten + '.' + x + ': ' + bang[x].chu);
    });
  });
  // Số trong thẻ đúng với hình: songSong ở md có MN = 0,6 · 7 = 4,2
  const kq = lay('songSong').tinh(md('songSong'), 1, {}), b = lay('songSong').soi(kq, md('songSong'), { chiTiet: true });
  assert.ok(b.MN.chu.indexOf('MN = 4{,}2') >= 0, b.MN.chu);
  const dc = lay('duongCao').tinh(md('duongCao'), 1, {}), bd = lay('duongCao').soi(dc, md('duongCao'), { chiTiet: true });
  assert.ok(bd.AH.chu.indexOf('AH = 3') >= 0 && bd.AH.chu.indexOf('= 9') >= 0, bd.AH.chu);
});

test('lắp chứng minh bài 33, 34, 36, 37, 38: dữ liệu đúng, 5–9 bước, có ít nhất hai thứ tự đúng', () => {
  [33, 34, 36, 37, 38].forEach(n => {
    const L = loadFile(path.join(__dirname, '..', 'content', 'bai' + n + '.js')).lessons[0];
    const khoi = L.lyThuyet.filter(k => k.loai === 'lapCM');
    assert.strictEqual(khoi.length, 1, 'bài ' + n);
    const cm = khoi[0].config;
    assert.deepStrictEqual(LCM.kiemDuLieu(cm), [], 'bài ' + n);
    assert.ok(cm.buoc.length >= 5 && cm.buoc.length <= 9, 'bài ' + n + ': ' + cm.buoc.length + ' bước');
    // Có lúc được chọn giữa hai bước
    const tt = LCM.thuTuMau(cm), daCo = [];
    let coChon = false;
    tt.forEach(id => { if (LCM.buocKeTiep(cm, daCo).length > 1) coChon = true; daCo.push(id); });
    assert.ok(coChon, 'bài ' + n + ' chỉ có một thứ tự');
    cm.buoc.forEach(b => assert.ok(!/^(Bước \d|Trước hết|Đầu tiên)/.test(b.chu), 'bài ' + n + ' lộ thứ tự: ' + b.chu));
    assert.ok(L.mucTieu.length >= 3 && L.mucTieu.length <= 5, 'bài ' + n + ' mucTieu');
  });
  const L39 = loadFile(path.join(__dirname, '..', 'content', 'bai39.js')).lessons[0];
  assert.ok(L39.mucTieu.length >= 3 && L39.mucTieu.length <= 5);
});
