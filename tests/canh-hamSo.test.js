const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/hamSo.js');

const GAN = (x, y, msg) => assert.ok(Math.abs(x - y) < 1e-9, (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const huuHan = (o, duong) => {
  if (typeof o === 'number') assert.ok(Number.isFinite(o), duong + ' = ' + o);
  else if (o && typeof o === 'object') Object.keys(o).forEach(k => huuHan(o[k], duong + '.' + k));
};

// ---------- Sơ đồ đoạn ----------
const DUOI_KIP = { tenTren: 'Ô tô', tenDuoi: 'Xe máy', tren: [{ x: 60 }], duoi: [{ so: 40 }, { x: 40 }],
  buoc: [{ tren: [{ x: 40 }, { x: 20 }], duoi: [{ x: 40 }, { so: 40 }] }, { tren: [{ x: 40, bo: true }, { x: 20 }], duoi: [{ x: 40, bo: true }, { so: 40 }] }, { tren: [{ x: 20 }], duoi: [{ so: 40 }] }] };
test('soDoDoan: tại nghiệm hai đoạn dài bằng nhau ở mọi bước', () => {
  TT.forEach(t => { const k = tinh('soDoDoan', {}, t, DUOI_KIP); GAN(k.goc, 2); GAN(k.lech, 0); GAN(k.hang[0].tong, k.hang[1].tong); huuHan(k, 't' + t); });
  const buoc = new Set(); for (let t = 0; t <= 1; t += .05) buoc.add(tinh('soDoDoan', {}, t, DUOI_KIP).buocHienTai);
  assert.deepStrictEqual([...buoc], [0, 1, 2, 3]);
});
test('soDoDoan: các mảnh xếp liền nhau, tổng độ dài = tổng của đoạn', () => {
  const o = { tren: [{ x: 1 }, { x: 1, so: -5 }, { x: 1 }, { x: 1, so: -5 }], duoi: [{ so: 50 }] };
  [{}, { thu: 27.5 }, { thu: 10 }].forEach(p => {
    const k = tinh('soDoDoan', p, 1, o);
    k.hang.forEach(h => { let tu = 0; h.manh.forEach(m => { GAN(m.tu, tu); tu += m.dai; }); GAN(tu, h.tong); });
  });
  GAN(tinh('soDoDoan', {}, 1, o).goc, 15);
});
test('soDoDoan: thử số sai thì lệch đúng bằng hiệu hai vế (4x − 10 − 50)', () => {
  const o = { tren: [{ x: 1 }, { x: 1, so: -5 }, { x: 1 }, { x: 1, so: -5 }], duoi: [{ so: 50 }] };
  [27.5, 10, 15, 0, 100].forEach(v => GAN(tinh('soDoDoan', { thu: v }, 1, o).lech, 4 * v - 10 - 50));
});
test('soDoDoan: bước làm đổi nghiệm thì ném lỗi; vô nghiệm thì ném lỗi', () => {
  assert.throws(() => tinh('soDoDoan', {}, 1, { tren: [{ x: 2 }], duoi: [{ so: 4 }], buoc: [{ tren: [{ x: 1 }], duoi: [{ so: 3 }] }] }), /nghiệm/);
  assert.throws(() => tinh('soDoDoan', {}, 1, { tren: [{ x: 2 }], duoi: [{ x: 2 }, { so: 1 }] }), /nghiệm/);
});
test('soDoDoan: một bước thì các mảnh hiện dần, t=0 chưa hiện gì, t=1 hiện đủ', () => {
  const o = { tren: [{ x: 12 }, { x: 3 }], duoi: [{ so: 225 }] };
  assert.ok(tinh('soDoDoan', {}, 0, o).hang.every(h => h.manh.every(m => m.hien === 0)));
  assert.ok(tinh('soDoDoan', {}, 1, o).hang.every(h => h.manh.every(m => m.hien === 1)));
});

// ---------- Máy hàm số ----------
test('mayHamSo: mỗi điểm là (x; f(x)), đủ cả năm điểm ở t=1', () => {
  const o = { f: { a: 2, b: -1 }, cacX: [-2, -1, 0, 1, 2] };
  const k = tinh('mayHamSo', {}, 1, o);
  k.diem.forEach(d => { GAN(d.y, 2 * d.x - 1); GAN(d.hien, 1); });
  assert.deepStrictEqual(k.trung, []);
  TT.forEach(t => huuHan(tinh('mayHamSo', {}, t, o), 't' + t));
  assert.ok(tinh('mayHamSo', {}, 0, o).diem.every(d => d.hien === 0));
});
test('mayHamSo: hàm k/x; bảng có một x hai y thì báo trùng', () => {
  tinh('mayHamSo', {}, 1, { f: { k: 12 }, cacX: [-4, 2, 3] }).diem.forEach(d => GAN(d.y * d.x, 12));
  assert.deepStrictEqual(tinh('mayHamSo', {}, 1, { f: { bang: [[1, 4], [2, 5], [3, 6], [2, 7]] } }).trung, [2]);
  assert.deepStrictEqual(tinh('mayHamSo', {}, 1, { f: { bang: [[1, 5], [2, 5], [3, 6]] } }).trung, []);
  assert.throws(() => tinh('mayHamSo', {}, 1, { f: { k: 6 }, cacX: [0] }), /f\(0\)/);
});
test('mayHamSo: thử số – xuôi so với f(x), ngược so f(thu) với y cho trước', () => {
  const xuoi = { f: { a: 4, b: -1 }, cacX: [0, 1, 2], hoi: 2 };
  assert.strictEqual(tinh('mayHamSo', { thu: 7 }, 1, xuoi).thu.dung, true);
  assert.strictEqual(tinh('mayHamSo', { thu: 9 }, 1, xuoi).thu.dung, false);
  assert.strictEqual(tinh('mayHamSo', {}, 1, xuoi).diem[2].an, true);
  assert.strictEqual(tinh('mayHamSo', { trangThai: 'giai' }, 1, xuoi).diem[2].an, false);
  const nguoc = { f: { a: 0.5, b: 1 }, cacX: [-2, 0, 2], nguoc: { y: 4 } };
  GAN(tinh('mayHamSo', {}, 1, nguoc).nguoc.x, 6);
  assert.strictEqual(tinh('mayHamSo', { thu: 6 }, 1, nguoc).thu.dung, true);
  const sai = tinh('mayHamSo', { thu: 3 }, 1, nguoc).thu;
  assert.strictEqual(sai.dung, false); GAN(sai.y, 2.5);
});

// ---------- Đường thẳng, bậc thang ----------
const AB = []; for (let a = -2; a <= 2; a += .5) for (let b = -2; b <= 2; b++) if (a) AB.push({ a, b });
test('duongThang: mỗi bậc ngang dx thì đứng đúng a·dx, đầu và cuối bậc đều nằm trên đường thẳng', () => {
  AB.forEach(p => [1, 2, -1].forEach(huong => TT.forEach(t => {
    const k = tinh('duongThang', p, t, { theoThamSo: true, bac: [{ duong: 0, tu: -2, soBuoc: 4 * Math.sign(huong), dx: Math.abs(huong) }] });
    k.bac[0].buoc.forEach(s => {
      GAN(s.y1, p.a * s.x1 + p.b); GAN(s.y2, p.a * s.x2 + p.b); GAN(s.y2 - s.y1, p.a * (s.x2 - s.x1)); GAN(s.len, p.a * s.ngang);
    });
    huuHan(k, 'a=' + p.a + ' b=' + p.b + ' t=' + t);
  })));
});
test('duongThang: bậc thang đi sang trái (soBuoc âm) vẫn nằm trên đường thẳng', () => {
  const k = tinh('duongThang', {}, 1, { duong: [{ a: -2, b: 5 }], bac: [{ duong: 0, tu: 0, soBuoc: -3 }] });
  GAN(k.bac[0].buoc[2].x2, -3); GAN(k.bac[0].buoc[2].y2, 11);
  k.bac[0].buoc.forEach(s => GAN(s.y2 - s.y1, 2));
});
test('haiDuongThang: tịnh tiến giữ hệ số góc, khoảng dọc như nhau ở mọi x, cuối cùng trùng đường thứ hai', () => {
  for (let a = -2; a <= 2; a += .5) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) {
    const p = { a, b, c }, o = { theoThamSo: 2, tinhTien: { tu: 0, den: 1 } };
    const k = tinh('haiDuongThang', p, 1, o);
    GAN(k.dich.a, a); GAN(k.dich.b, c); GAN(k.dich.khoang, c - b);
    [-3, 0, 1.5, 4].forEach(x => GAN((k.ds[1].a * x + k.ds[1].b) - (k.ds[0].a * x + k.ds[0].b), c - b));
    GAN(tinh('haiDuongThang', p, 0, o).dich.b, b);
  }
});
test('duongThang: giao điểm nằm trên cả hai đường; cùng hệ số góc thì không có giao điểm', () => {
  const k = tinh('duongThang', {}, 1, { duong: [{ a: 2, b: -1 }, { a: -1, b: 5 }], giao: [0, 1] });
  GAN(k.giao.x, 2); GAN(k.giao.y, 3);
  assert.strictEqual(tinh('duongThang', {}, 1, { duong: [{ a: 2, b: -1 }, { a: 2, b: 5 }], giao: [0, 1] }).giao, null);
});
test('duongThang: thử số đổi đúng hệ số, gõ đúng thì dung = true', () => {
  const o = { duong: [{ a: -1, b: 5 }, { a: -1, b: 1, an: 'giai' }], thu: { duong: 1, gan: 'a', cong: 3 }, giao: [0, 1] };
  const sai = tinh('duongThang', { thu: 2 }, 1, o);
  GAN(sai.ds[1].a, 5); assert.strictEqual(sai.ds[1].dung, false); assert.ok(sai.giao);
  const dung = tinh('duongThang', { thu: -4 }, 1, o);
  assert.strictEqual(dung.ds[1].dung, true); assert.strictEqual(dung.giao, null);
  assert.strictEqual(tinh('duongThang', {}, 1, o).ds[1].hien, 0);
});
test('duongThang: khung tự chọn luôn chứa gốc toạ độ và mọi điểm', () => {
  const k = tinh('duongThang', {}, 1, { duong: [{ a: 2, b: 40 }], diem: [{ x: 30, y: 100 }], bac: [{ duong: 0, tu: 0, soBuoc: 3, dx: 10 }] });
  assert.ok(k.kh.x0 <= 0 && k.kh.x1 >= 30 && k.kh.y0 <= 0 && k.kh.y1 >= 100);
});
test('duongThang anKetQua: chưa giải thì bỏ bậc cuối, giấu đường cần tìm và tịnh tiến; giải rồi thì hiện đủ', () => {
  const o = { anKetQua: true, duong: [{ a: -2, b: 5 }, { a: -2, b: 1, an: true }], bac: [{ duong: 0, tu: 0, soBuoc: -3, nhan: true }], tinhTien: { tu: 0, den: 1 }, diem: [{ x: -3, y: 11, an: true }] };
  const chua = tinh('duongThang', {}, 1, o), roi = tinh('duongThang', { trangThai: 'giai' }, 1, o);
  assert.strictEqual(chua.bac[0].buoc.length, 2); assert.strictEqual(chua.bac[0].anNhan, true);
  assert.strictEqual(chua.ds[1].hien, 0); assert.strictEqual(chua.dich, null); assert.strictEqual(chua.diem[0].hien, 0);
  assert.strictEqual(roi.bac[0].buoc.length, 3); assert.strictEqual(roi.ds[1].hien, 1); assert.ok(roi.dich); assert.strictEqual(roi.diem[0].hien, 1);
  const motBac = tinh('duongThang', {}, 1, { anKetQua: true, duong: [{ a: -3, b: 2 }], bac: [{ duong: 0, tu: 0, soBuoc: -1 }] });
  assert.strictEqual(motBac.bac[0].buoc.length, 1); assert.strictEqual(motBac.bac[0].buoc[0].anDoc, true);
});
test('soDoDoan: thử số làm một mảnh dài âm thì đánh dấu mảnh đó', () => {
  const o = { tren: [{ x: 1 }, { x: 1, so: -5 }], duoi: [{ so: 25 }] };
  assert.ok(tinh('soDoDoan', { thu: 3 }, 1, o).hang[0].manh[1].am);
  assert.ok(!tinh('soDoDoan', { thu: 8 }, 1, o).hang[0].manh.some(m => m.am));
});
