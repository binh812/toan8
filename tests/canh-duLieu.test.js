// Cảnh chương V: kiểm tính chất toán thật của phần tinh (không đụng DOM).
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/duLieu.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p || {}, t, o || {});
const huuHan = o => JSON.stringify(o, (k, v) => { if (typeof v === 'number') assert.ok(Number.isFinite(v), 'số hỏng ở ' + k); return v; });
const dt = pts => Math.abs(pts.reduce((s, P, i) => { const Q = pts[(i + 1) % pts.length]; return s + P[0] * Q[1] - Q[0] * P[1]; }, 0)) / 2;

const HANG = [
  { loai: 0, ten: 'Số xe máy', the: [2, 1, 3, 30], vl: [3], tu: 0, den: 4 },
  { loai: 1, ten: 'Số phút', the: [6, 12.5, 20.3, 12.6], tu: 0, den: 25, buoc: 5 },
  { loai: 3, ten: 'Xếp loại', the: ['Tốt', 'Khá', 'Tốt', 'Đạt'], thuTu: ['Đạt', 'Khá', 'Tốt'] },
  { loai: 2, ten: 'Màu áo', the: ['Đỏ', 'Xanh', 'Trắng'] },
  { loai: 0, ten: 'Số người', the: [4, 3, 5, 4, 6], tu: 2, den: 7, giua: { s: '4,5', v: 4.5 } }
];

test('theDuLieu: xếp xong, thẻ số đứng đúng chỗ trên trục, thẻ đếm đứng ở chấm, thẻ vô lí ở ngoài trục', () => {
  const g = tinh('theDuLieu', {}, 1, { hang: HANG });
  assert.ok(g.xepXong);
  g.hang.forEach((r, ih) => {
    const ds = g.the.filter(c => c.hang === ih);
    ds.forEach(c => { GAN(c.x, c.dich[0], 'x'); GAN(c.y, c.dich[1], 'y'); assert.ok(c.y - c.h / 2 >= r.y0 && c.y + c.h / 2 <= r.y0 + r.cao, 'thẻ nằm trong hàng'); });
    if (r.loai > 1) return;
    const tr = r.truc, X = v => tr.x0 + (v - tr.tu) / (tr.den - tr.tu) * (tr.x1 - tr.x0);
    r.the.forEach(c => {
      if (c.vl) { assert.ok(c.x - c.w / 2 > tr.x1, 'thẻ vô lí ở ngoài trục'); return; }
      GAN(c.x, X(c.v), 'vị trí ' + c.s);
      if (r.loai === 0) assert.ok(tr.cham.some(x => Math.abs(x - c.x) < 1e-9), 'thẻ đếm đứng ở chấm');
    });
    // Thẻ cùng tầng không chồng lên nhau
    r.the.forEach(a => r.the.forEach(b => { if (a !== b && a.tang === b.tang && !a.vl && !b.vl) assert.ok(Math.abs(a.x - b.x) >= (a.w + b.w) / 2, 'chồng thẻ'); }));
  });
  // Thẻ thử 4,5 nằm giữa chấm 4 và chấm 5, không trùng chấm nào
  const r = g.hang[4]; assert.ok(r.truc.cham.every(x => Math.abs(x - r.giua.x) > 0.1));
});

test('theDuLieu: bậc thang xếp chữ theo thứ tự, bậc cao hơn thì thẻ đứng cao hơn', () => {
  const g = tinh('theDuLieu', {}, 1, { hang: HANG }), ds = g.the.filter(c => c.hang === 2 && c.dich[1] === g.hang[2].day - 0.85 - c.bac * 0.55);
  const theoBac = {}; ds.forEach(c => { theoBac[c.bac] = c; });
  assert.ok(theoBac[0].y > theoBac[1].y && theoBac[1].y > theoBac[2].y);
  assert.ok(theoBac[0].x < theoBac[1].x && theoBac[1].x < theoBac[2].x);
});

test('theDuLieu: chưa làm đúng (anTen) thì thẻ chữ chỉ dàn hàng, không lộ bậc thang; đúng rồi mới lên bậc', () => {
  const hang = [{ loai: 3, ten: 'Xếp loại', the: ['Tốt', 'Khá', 'Tốt', 'Đạt', 'Khá'], thuTu: ['Đạt', 'Khá', 'Tốt'] }];
  const an = tinh('theDuLieu', {}, 1, { anTen: true, hang });
  assert.ok(an.the.every(c => Math.abs(c.y - an.the[0].y) < 1e-9), 'cùng một độ cao');
  assert.ok(an.the.every((c, i) => i === 0 || c.x > an.the[i - 1].x), 'giữ thứ tự ghi');
  const hien = tinh('theDuLieu', { trangThai: 'giai' }, 1, { anTen: true, hang });
  assert.ok(hien.the.some(c => Math.abs(c.y - hien.the[0].y) > 0.1), 'lên bậc');
  GAN(an.H, hien.H, 'hàng không đổi cao khi bậc thang hiện ra');
});

test('theDuLieu: túi chữ dài thì xếp hai tầng, khung giữ bề rộng 16', () => {
  const g = tinh('theDuLieu', {}, 1, { hang: [{ loai: 2, ten: 'Nơi sinh', the: ['Hải Phòng', 'Hà Nội', 'Nam Định', 'Thái Bình', 'Huế'] }] });
  assert.strictEqual(g.W, 16);
  const tang = new Set(g.the.map(c => Math.round(c.y * 100))); assert.strictEqual(tang.size, 2);
  g.the.forEach(a => g.the.forEach(b => { if (a !== b && Math.abs(a.y - b.y) < 1e-9) assert.ok(Math.abs(a.x - b.x) >= (a.w + b.w) / 2, 'thẻ đè nhau'); }));
});

test('theDuLieu: trộn thẻ ở Nhìn, mọi t hữu hạn, t = 0 chưa thẻ nào ở chỗ của mình', () => {
  TT.forEach(t => huuHan(tinh('theDuLieu', {}, t, { tron: true })));
  const g = tinh('theDuLieu', {}, 0, { tron: true });
  assert.ok(g.the.every(c => Math.hypot(c.x - c.dich[0], c.y - c.dich[1]) > 0.5));
});

test('cotHopLi: cột tỉ lệ với số đo, chỉ giá trị lạc khỏi dải bình thường bị đánh dấu', () => {
  const o = { so: [152, 148.5, 160, 15.5, 155, 149], lo: 140, hi: 175, vl: [3] }, g = tinh('cotHopLi', {}, 1, o);
  g.cot.forEach((c, i) => GAN(c.h / g.cot[0].h, o.so[i] / o.so[0], 'tỉ lệ cột'));
  assert.deepStrictEqual(g.cot.map((c, i) => c.ngoai ? i : -1).filter(i => i >= 0), [3]);
  assert.ok(tinh('cotHopLi', { thu: 160 }, 1, o).cot[2].thu);
  TT.forEach(t => huuHan(tinh('cotHopLi', {}, t, o)));
});

test('chongThe: số thẻ mỗi chồng bằng tần số, cộng lại đủ', () => {
  const the = 'A B A C A A B D A B A C A B A D A B C A'.split(' '), g = tinh('chongThe', {}, 1, { the, nhom: ['A', 'B', 'C', 'D'] });
  assert.deepStrictEqual(g.dem, [10, 5, 3, 2]);
  ['A', 'B', 'C', 'D'].forEach((x, i) => assert.strictEqual(g.the.filter(c => c.nhom === i).length, g.dem[i]));
  // Thẻ trong một chồng xếp khít, không đè nhau
  [0, 1, 2, 3].forEach(i => { const ys = g.the.filter(c => c.nhom === i).map(c => c.y).sort((a, b) => a - b); for (let k = 1; k < ys.length; k++) GAN(ys[k] - ys[k - 1], g.ph, 'khít'); });
  TT.forEach(t => huuHan(tinh('chongThe', {}, t, { the, nhom: ['A', 'B', 'C', 'D'] })));
});

test('luoiPhieu: số ô mỗi nhóm đúng, phần còn lại đủ tổng', () => {
  const g = tinh('luoiPhieu', {}, 1, { n: 40, cot: 10, nhom: [{ so: 35 }, { so: 3 }] });
  assert.deepStrictEqual(g.dem, [35, 3]); assert.strictEqual(g.conLai, 2);
  const g2 = tinh('luoiPhieu', {}, 1, { n: 160, cot: 20, nhom: [{ so: 5, o: [0, 1, 2, 20, 21] }] });
  assert.deepStrictEqual(g2.dem, [5]); assert.strictEqual(g2.conLai, 155);
});

test('bienHinh: băng dài đúng tổng, mỗi đoạn tỉ lệ với số liệu; quạt có góc bằng 360° nhân tỉ lệ', () => {
  const o = { nhan: ['a', 'b', 'c', 'd'], so: [16, 10, 8, 6] };
  const g = tinh('bienHinh', { trangThai: 'bang' }, 1, o);
  GAN(g.muc[g.muc.length - 1].ub, g.L, 'băng đủ dài');
  g.muc.forEach(m => GAN((m.ub - m.ua) / g.L, m.v / 40, 'đoạn tỉ lệ'));
  // Băng thẳng: diện tích mỗi đoạn = dài × dày
  g.muc.forEach(m => GAN(dt(m.manh), (m.ub - m.ua) * g.th, 'diện tích đoạn', 1e-6));
  const q = tinh('bienHinh', { trangThai: 'tron' }, 1, o), R = q.R;
  GAN(q.muc.reduce((s, m) => s + m.goc, 0), 2 * Math.PI, 'tổng góc');
  // Cuộn xong: hình quạt có diện tích = tỉ lệ × diện tích hình tròn (đa giác nội tiếp nên sai số nhỏ)
  q.muc.forEach(m => GAN(dt(m.manh) / (Math.PI * R * R), m.v / 40, 'diện tích quạt', 0.01));
  // Mọi điểm của quạt cách tâm không quá R
  q.muc.forEach(m => m.manh.forEach(P => assert.ok(Math.hypot(P[0] - q.tam[0], P[1] - q.tam[1]) <= R + 1e-9)));
});

test('bienHinh: cột cao tỉ lệ với số liệu; mọi trạng thái, mọi t hữu hạn', () => {
  const o = { nhan: ['8A', '8B', '8C', '8D'], so: [12.7, 16.8, 15.5, 14.3], moi: 1 };
  const g = tinh('bienHinh', { trangThai: 'cot' }, 1, o);
  g.muc.forEach(m => GAN(m.hb / g.muc[0].hb, m.v / 12.7, 'tỉ lệ cột'));
  const tr = tinh('bienHinh', { trangThai: 'tranh' }, 1, o).tranh;
  tr.hang.forEach((h, i) => GAN(h.so * tr.moi, o.so[i], 'số biểu tượng'));
  [null, 'cot', 'bang', 'tron', 'duong', 'tranh', 'giai'].forEach(s => TT.forEach(t => huuHan(tinh('bienHinh', { trangThai: s }, t, o))));
  TT.forEach(t => huuHan(tinh('bienHinh', {}, t, { nhan: ['a', 'b'], so: [100, 60], nguoc: true, thuoc: { tong: 160 } })));
});

test('catTruc: gốc 0 thì cột tỉ lệ số liệu; cắt ở gốc g thì cột tỉ lệ (số − g)', () => {
  const o = { nhan: ['a', 'b'], so: [81, 82], goc: 80, dinh: 84, hoi: [1, 0] };
  const g0 = tinh('catTruc', {}, 0, o), g1 = tinh('catTruc', {}, 1, o);
  GAN(g0.cot[1].cao / g0.cot[0].cao, 82 / 81, 'gốc 0');
  GAN(g1.cot[1].cao / g1.cot[0].cao, 2, 'gốc 80');
  GAN(g1.tiCao, 2); GAN(g1.tiSo, 82 / 81);
  const d = tinh('catTruc', {}, 0, { nhan: ['a', 'b'], so: [84, 92], goc: 80, dinh: 96, hoi: [1, 0], nguoc: true });
  GAN(d.tiCao, 3, 'Dùng 20.6: cột 2022 cao gấp 3');
  const thu = tinh('catTruc', { thu: 2 }, 0, { nhan: ['a', 'b'], so: [84, 92], goc: 80, dinh: 96, hoi: [1, 0], nguoc: true });
  GAN(thu.thu.cao, 2 * thu.cot[0].cao, 'cột em gõ');
  TT.forEach(t => huuHan(tinh('catTruc', {}, t, o)));
});

test('trucNgang: chia đúng thì khoảng cách tỉ lệ số năm, tăng đều thì độ dốc bằng nhau', () => {
  const o = { nam: [2015, 2016, 2017, 2018, 2022], so: [20, 22, 24, 26, 34], dinh: 40 };
  const g = tinh('trucNgang', {}, 1, o), d = g.diem;
  for (let i = 1; i < d.length; i++) GAN((d[i].x - d[i - 1].x) / (d[1].x - d[0].x), o.nam[i] - o.nam[i - 1], 'khoảng năm');
  g.doan.forEach(s => GAN(s.doc, g.doan[0].doc, 'cùng độ dốc'));
  const g0 = tinh('trucNgang', {}, 0, o);
  assert.ok(Math.abs(g0.doan[3].doc) > 3 * Math.abs(g0.doan[0].doc), 'chia đều: đoạn cuối dốc hơn hẳn');
  assert.strictEqual(g.namThieu.length, 3);
  TT.forEach(t => huuHan(tinh('trucNgang', {}, t, o)));
});

test('soVoiCu: các bản sao phần tăng xếp chồng vừa đúng cột so sánh', () => {
  [[32, 40], [30, 38], [60, 42], [20, 21]].forEach(([cu, moi]) => {
    ['giai', 'chiaMoi'].forEach(tt => {
      const g = tinh('soVoiCu', { trangThai: tt }, 1, { cu, moi }), goc = tt === 'chiaMoi' ? moi : cu;
      GAN(g.ban.reduce((s, b) => s + b.cao, 0), goc * g.k, 'tổng chiều cao bản sao');
      GAN(g.soBan * g.d, goc, 'số bản sao × phần tăng = cột');
      GAN(g.ban[g.ban.length - 1].y, g.base - goc * g.k, 'đỉnh chồng = đỉnh cột');
    });
    TT.forEach(t => huuHan(tinh('soVoiCu', {}, t, { cu, moi })));
  });
});
