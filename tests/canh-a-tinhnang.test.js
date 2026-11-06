// Chương I, II: thử phá (k.pha) và soi chi tiết (canh.soi) của các cảnh khoiGop, hcnNhan, manhVuong, lapPhuong, haiLapPhuong, xepChuNhat
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/khoiDaiSo.js');
require('../js/canh/manhDaiSo.js');
require('../js/canh/hangDangThuc.js');

const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
const soi = (ten, p, t, o) => canh.lay(ten).soi(tinh(ten, p, t, o), p, o);
// Số như trong chữ TeX: dấu phẩy thập phân viết {,}
const so = x => String(+x.toFixed(6)).replace('.', '{,}');
const phaCua = ten => { const ts = canh.lay(ten).thamSo; return Object.keys(ts).filter(k => ts[k].pha).map(k => [k, ts[k]]); };
const coSo = (chu, x, msg) => assert.ok(chu.includes(so(x)), (msg || '') + ': thiếu số ' + so(x) + ' trong "' + chu + '"');

test('mỗi cảnh có thử phá có đúng một tham số pha, giá trị mặc định 1 (giữ số dương)', () => {
  ['hcnNhanXPha', 'manhVuong', 'lapPhuong', 'haiLapPhuong', 'xepChuNhat'].forEach(ten => {
    const ds = phaCua(ten);
    assert.strictEqual(ds.length, 1, ten);
    assert.deepStrictEqual([ds[0][1].min, ds[0][1].md, ds[0][1].max], [-1, 1, 1], ten);
  });
  // Cảnh dùng chung không đổi: hcnNhanX vẫn chỉ có thanh x
  assert.deepStrictEqual(Object.keys(canh.lay('hcnNhanX').thamSo), ['x']);
});

test('hcnNhanXPha nhân: x dương thì không hỏng; x âm thì hỏng, hai vế vẫn bằng nhau và đúng số', () => {
  const o = { hang: 'x+2', cot: 'x+3' };
  [1.5, 2, 3, 4.5, 5].forEach(x => {
    const d = tinh('hcnNhanXPha', { x, dau: 1 }, 1, o).pha;
    assert.strictEqual(d.hong, false);
    coSo(d.chu, (x + 2) * (x + 3), 'x = ' + x);
    const h = tinh('hcnNhanXPha', { x, dau: -1 }, 1, o), xs = -x;
    assert.strictEqual(h.pha.hong, true);
    assert.ok(h.pha.chu.startsWith('Hình không dựng được') && h.pha.chiHinh === true, h.pha.chu);
    coSo(h.pha.chu, xs, 'x âm');
    const ve = (xs + 2) * (xs + 3), cong = xs * xs + 3 * xs + 2 * xs + 6;
    assert.ok(Math.abs(ve - cong) < 1e-9);
    coSo(h.pha.chu, ve, 'tích');
    // Ô có đoạn x âm được tô viền đỏ: cả bốn ô đều chạm đoạn x khi x âm (trừ ô 2·3 dương)
    assert.strictEqual(h.phaO.length, 3);
  });
  // Ở x dương không có ô nào bị tô viền thử phá
  assert.strictEqual(tinh('hcnNhanXPha', { x: 3, dau: 1 }, 1, o).phaO.length, 0);
});

test('hcnNhanXPha chia: x âm vẫn chia đúng, và thẻ không lộ thương 3x + 2', () => {
  const o = { chia: '2x', dt: '6x^2+4x' };
  const d = tinh('hcnNhanXPha', { x: 3, dau: 1 }, 1, o).pha;
  assert.strictEqual(d.hong, false);
  assert.ok(d.chu.includes('66 : 6 = 11'), d.chu);
  const h = tinh('hcnNhanXPha', { x: 3, dau: -1 }, 1, o).pha;
  assert.strictEqual(h.hong, true);
  assert.ok(h.chu.includes('42 : (-6) = -7'), h.chu);
  assert.ok(!/3x/.test(d.chu) && !/3x/.test(h.chu), 'thử phá không được lộ đoạn 3x của cạnh trên');
});

test('manhVuong: b âm thì hỏng, (a + b)² vẫn bằng a² + 2ab + b²', () => {
  for (let a = 1; a <= 6; a += 0.5) for (let b = 1; b <= 6; b += 0.5) {
    assert.strictEqual(tinh('manhVuong', { a, b, dau: 1 }, 1, { dang: 'tong' }).pha.hong, false);
    const h = tinh('manhVuong', { a, b, dau: -1 }, 1, { dang: 'tong' }).pha, bs = -b;
    assert.strictEqual(h.hong, true);
    coSo(h.chu, (a + bs) ** 2, 'vế trái');
    coSo(h.chu, a * bs, 'mảnh ab');
    assert.ok(h.chu.includes(so(a * a) + (2 * a * bs < 0 ? ' - ' : ' + ') + so(Math.abs(2 * a * bs)) + ' + ' + so(b * b) + ' = ' + so((a + bs) ** 2)), h.chu);
  }
});

test('lapPhuong: b âm thì hỏng; tám khối cộng lại vẫn bằng (a + b)³', () => {
  for (let a = 1; a <= 5; a += 0.5) for (let b = 1; b <= 5; b += 0.5) {
    assert.strictEqual(tinh('lapPhuong', { a, b, dau: 1 }, 1, { dang: 'tong' }).pha.hong, false);
    const h = tinh('lapPhuong', { a, b, dau: -1 }, 1, { dang: 'tong' }).pha, bs = -b;
    assert.strictEqual(h.hong, true);
    const kh = a ** 3 + 3 * a * a * bs + 3 * a * bs * bs + bs ** 3;
    assert.ok(Math.abs(kh - (a + bs) ** 3) < 1e-9);
    assert.ok(h.chu.includes('^3 = ' + so((a + bs) ** 3) + '$'), h.chu);
    coSo(h.chu, a * a * bs, 'khối a²b');
  }
  // Cảnh haiLapPhuong dạng tổng mượn lapPhuong nhưng không mang thử phá của (a + b)³
  assert.strictEqual(tinh('haiLapPhuong', { a: 3, b: 1.5 }, 1, { dang: 'tong' }).pha, undefined);
});

test('haiLapPhuong hiệu: b âm thì hỏng; a³ − b³ vẫn bằng (a − b)(a² + ab + b²)', () => {
  for (let a = 2.5; a <= 5; a += 0.5) for (let b = 0.5; b <= 2; b += 0.5) {
    const d = tinh('haiLapPhuong', { a, b, dau: 1 }, 1, { dang: 'hieu' }).pha;
    assert.strictEqual(d.hong, false);
    coSo(d.chu, a ** 3 - b ** 3, 'vế trái');
    const h = tinh('haiLapPhuong', { a, b, dau: -1 }, 1, { dang: 'hieu' }).pha, bs = -b;
    assert.strictEqual(h.hong, true);
    const tr = a ** 3 - bs ** 3, ph = (a - bs) * (a * a + a * bs + bs * bs);
    assert.ok(Math.abs(tr - ph) < 1e-9);
    assert.ok(h.chu.includes(' = ' + so(tr) + '$ và'), h.chu);
    assert.ok(h.chu.includes(so(a - bs) + ' \\cdot ' + so(a * a + a * bs + bs * bs) + ' = ' + so(ph)), h.chu);
  }
});

test('xepChuNhat: x âm thì hỏng; tổng các mảnh vẫn bằng tích hai cạnh', () => {
  const o = { hang: [{ ten: '2x', dai: [2, 0] }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '3', dai: 3 }], o: [['2x²', '6x']], tenRong: 'x + 3' };
  for (let x = 1; x <= 5; x += 0.5) {
    const d = tinh('xepChuNhat', { x, dau: 1 }, 1, o);
    assert.strictEqual(d.pha.hong, false);
    assert.ok(d.pha.chu.includes(so(2 * x * x) + ' + ' + so(6 * x) + ' = ' + so(2 * x * x + 6 * x)), d.pha.chu);
    assert.strictEqual(d.phaManh.length, 0);
    const h = tinh('xepChuNhat', { x, dau: -1 }, 1, o), xs = -x;
    assert.strictEqual(h.pha.hong, true);
    const tong = 2 * xs * xs + 6 * xs;
    assert.ok(h.pha.chu.includes(' = ' + so(tong) + '$, tích hai cạnh'), h.pha.chu);
    assert.ok(h.pha.chu.includes(' = ' + so(2 * xs * (xs + 3)) + '$'), h.pha.chu);
    assert.ok(h.pha.chu.includes('2x = ' + so(2 * xs)), h.pha.chu);
    assert.strictEqual(h.phaManh.length, 2, 'cả hai mảnh có cạnh 2x âm');
  }
});

test('soi khoiGop: mỗi loại mảnh một khoá có số đo; mảnh âm, ngoặc trừ, kết quả', () => {
  const p = { x: 2.25, y: 1.5 }, o = { nhom: ['2x^2y', '3x^2y', 'xy^2'] };
  const s = soi('khoiGop', p, 1, o);
  assert.deepStrictEqual(Object.keys(s).sort(), ['loai-x1y2', 'loai-x2y1', 'tong']);
  // x²y = 7,59375 phải làm tròn: ghi ≈
  assert.ok(s['loai-x2y1'].chu.includes('x^2y \\approx 7{,}59'), s['loai-x2y1'].chu);
  assert.ok(s['loai-x2y1'].chu.includes('$5$ mảnh dương'));
  assert.ok(s.tong.chu.includes('5x^2y + xy^2'));
  const o3 = { da: '3x^2+y', tru: 'x^2-2y' }, s3 = soi('khoiGop', p, 1, o3);
  assert.ok(s3.am && s3.ngoac && s3['loai-x2'] && s3['loai-y1']);
  assert.ok(s3['loai-y1'].chu.includes('y = 1{,}5'));
  assert.ok(s3.tong.chu.includes('2x^2 + 3y'), s3.tong.chu);
});

test('soi khoiGop, đề còn giấu kết quả (anNhan): không nói số mảnh, bậc, kết quả', () => {
  const p = { x: 2.25, y: 1.5 }, o = { da: '3x^2-2xy+x^2+5xy-y^2', anNhan: true };
  const s = soi('khoiGop', p, 1, o), tat = Object.values(s).map(m => m.chu).join(' ');
  assert.ok(!/\$\d+\$ mảnh dương|Bậc|4x\^2/.test(tat), tat);
  // Em đã gõ sai (trạng thái lỗi) cũng chưa được lộ
  const s2 = soi('khoiGop', Object.assign({ trangThai: 'quenCuoi' }, p), 1, o);
  assert.ok(!/4x\^2/.test(s2.tong.chu));
  assert.ok(soi('khoiGop', Object.assign({ trangThai: 'giai' }, p), 1, o).tong.chu.includes('4x^2 + 3xy - y^2'));
});

test('soi hcnNhan: cạnh, nhóm ô cùng màu, tổng; số đo theo x', () => {
  const o = { hang: 'x+2', cot: 'x+3' }, s = soi('hcnNhanXPha', { x: 3, dau: 1 }, 1, o);
  assert.deepStrictEqual(Object.keys(s).sort(), ['canhTrai', 'canhTren', 'loai0', 'loai1', 'loai2', 'tong']);
  assert.ok(s.canhTrai.chu.includes('x + 2 = 3 + 2 = 5'));
  assert.ok(s.loai1.chu.includes('x \\cdot 3 = 3x') && s.loai1.chu.includes('2 \\cdot x = 2x') && s.loai1.chu.includes('5x'));
  assert.ok(s.tong.chu.includes('x^2 + 5x + 6') && s.tong.chu.includes('$30$'));
  // Kéo x thì số đổi theo
  assert.ok(soi('hcnNhanXPha', { x: 4, dau: 1 }, 1, o).canhTrai.chu.includes('4 + 2 = 6'));
});

test('soi hcnNhan chia: cạnh trên và thương chỉ hiện khi hình đã chạy tới, và khi em đã giải (anNhan)', () => {
  const o = { chia: '2x', dt: '6x^2+4x' };
  const dau = soi('hcnNhanXPha', { x: 3, dau: 1 }, 0, o), cuoi = soi('hcnNhanXPha', { x: 3, dau: 1 }, 1, o);
  assert.ok(!/3x \+ 2|= 3x/.test(Object.values(dau).map(m => m.chu).join(' ')), 'lúc đầu chưa lộ cạnh trên');
  assert.ok(cuoi.loai0.chu.includes('6x^2 : 2x = 3x'), cuoi.loai0.chu);
  assert.ok(cuoi.tong.chu.includes('3x + 2'));
  const o2 = { chia: '4xy', dt: '12x^2y+8xy^2', anNhan: true };
  const an = soi('hcnNhan', { x: 2, y: 1, trangThai: 'heSo' }, 1, o2);
  assert.ok(!/3x \+ 2y|= 3x\$/.test(Object.values(an).map(m => m.chu).join(' ')), 'gõ sai chưa được lộ thương');
  assert.ok(soi('hcnNhan', { x: 2, y: 1, trangThai: 'giai' }, 1, o2).tong.chu.includes('3x + 2y'));
});

test('soi manhVuong, lapPhuong, haiLapPhuong, xepChuNhat: có khoá, có số theo thanh kéo', () => {
  const m = soi('manhVuong', { a: 4, b: 2, dau: 1 }, 1, { dang: 'tong' });
  assert.deepStrictEqual(Object.keys(m).sort(), ['a2', 'ab', 'b2', 'canh']);
  assert.ok(m.ab.chu.includes('ab = 8') && m.canh.chu.includes('= 36'));
  const l = soi('lapPhuong', { a: 3, b: 2, dau: 1 }, 1, { dang: 'tong' });
  assert.deepStrictEqual(Object.keys(l).sort(), ['a2b', 'a3', 'ab2', 'b3', 'canh']);
  assert.ok(l.a2b.chu.includes('a^2b = 18') && l.a2b.chu.includes('$3$ khối'));
  const h = soi('haiLapPhuong', { a: 3, b: 1.5, dau: 1 }, 1, { dang: 'hieu' });
  assert.deepStrictEqual(Object.keys(h).sort(), ['day', 'goc', 'tam1', 'tam2', 'tam3']);
  assert.ok(h.tam2.chu.includes('ab = 4{,}5') && h.day.chu.includes('a-b = 1{,}5'));
  const o = { hang: [{ ten: '2x', dai: [2, 0] }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '3', dai: 3 }], o: [['2x²', '6x']], tenRong: 'x + 3' };
  const x = soi('xepChuNhat', { x: 3, dau: 1 }, 1, o);
  assert.deepStrictEqual(Object.keys(x).sort(), ['canhDoc', 'canhNgang', 'khung', 'manh00', 'manh01']);
  assert.ok(x.manh00.chu.includes('$18$') && x.khung.chu.includes('36 = 6 \\cdot 6'));
});

test('soi giữ kín điều đề còn giấu: anAb, anGiua, anTam, anCanh', () => {
  const o6 = { dang: 'tong', tenA: 'x', tenB: '5', anAb: true, nhan: { a2: 'x²', ab: '5x', b2: '25' } };
  assert.ok(!/5x/.test(soi('manhVuong', { a: 5, b: 3 }, 1, o6).ab.chu));
  const o7 = { dang: 'tong', tenA: 'x', tenB: '4', anGiua: true, nhan: { a3: 'x³', a2b: '4x²', ab2: '16x', b3: '64' } };
  const l = soi('lapPhuong', { a: 3, b: 2 }, 1, o7);
  assert.ok(!/4x\^2|\$3\$ khối/.test(l.a2b.chu + l.ab2.chu), l.a2b.chu);
  const o8 = { dang: 'hieu', tenA: 'x', tenB: '3', anTam: true };
  assert.ok(!/x-3|3x/.test(Object.values(soi('haiLapPhuong', { a: 3.5, b: 1.5 }, 1, o8)).map(m => m.chu).join(' ')));
  const o9 = { hang: [{ ten: '3', dai: 3 }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '4', dai: 4 }], o: [['3x', '12']], tenRong: 'x + 4', anCanh: true };
  const s9 = soi('xepChuNhat', { x: 5 }, 1, o9);
  assert.ok(!/x \+ 4|Cạnh chung/.test(Object.values(s9).map(m => m.chu).join(' ')));
});

test('thử phá chương I, II: chỉ hình hỏng (chiHinh), công thức vẫn đúng; có tiêu đề nhóm và cách ghi thanh riêng', () => {
  const ca = [['hcnNhanXPha', { x: 4 }, { hang: 'x+2', cot: 'x+3' }], ['manhVuong', { a: 4, b: 2 }, { dang: 'tong' }], ['lapPhuong', { a: 3, b: 2 }, { dang: 'tong' }],
    ['haiLapPhuong', { a: 3, b: 1.5 }, { dang: 'hieu' }], ['xepChuNhat', { x: 2 }, { hang: [{ ten: '2x', dai: [2, 0] }], cot: [{ ten: 'x', dai: [1, 0] }, { ten: '3', dai: 3 }] }]];
  ca.forEach(([ten, p, o]) => {
    const c = canh.lay(ten), d = c.thamSo.dau;
    assert.ok(/Thử số âm/.test(c.tieuDePha), ten);
    assert.ok(/< 0/.test(d.hienSo(-1)) && /> 0/.test(d.hienSo(1)), ten);
    const md = tinh(ten, Object.assign({ dau: 1 }, p), 1, o).pha, am = tinh(ten, Object.assign({ dau: -1 }, p), 1, o).pha;
    assert.ok(!md.hong && !md.chiHinh, ten);
    assert.ok(am.hong && am.chiHinh && /vẫn đúng/.test(am.chu) && /Viền đỏ đứt/.test(am.chu), ten + ': ' + am.chu);
    // Thẻ soi nói rõ số đo là của hình vẽ theo độ dài dương
    const k = tinh(ten, Object.assign({ dau: -1 }, p), 1, o), sv = c.soi(k, Object.assign({ dau: -1 }, p), o);
    Object.values(sv).forEach(m => assert.ok(/Hình vẽ theo độ dài/.test(m.chu), ten));
  });
});

test('manhVuong: chỉ nói "cắt bớt hai dải" khi |b| < a', () => {
  assert.ok(/hai dải/.test(tinh('manhVuong', { a: 4, b: 2, dau: -1 }, 1, { dang: 'tong' }).pha.chu));
  assert.ok(!/hai dải/.test(tinh('manhVuong', { a: 1, b: 6, dau: -1 }, 1, { dang: 'tong' }).pha.chu));
  assert.ok(!/hai dải/.test(tinh('manhVuong', { a: 3, b: 3, dau: -1 }, 1, { dang: 'tong' }).pha.chu));
});

test('hcnNhanXPha chia: chưa chạy tới cuối thì ô thử phá không nói thương', () => {
  const o = { chia: '2x', dt: '6x^2+4x' };
  [1, -1].forEach(dau => assert.ok(!/66 : 6|= 11|-7/.test(tinh('hcnNhanXPha', { x: 3, dau }, 0, o).pha.chu)));
});

test('một cạnh bằng 0 khi lật dấu thì có câu nhắc thử số khác; haiLapPhuong đã bỏ góc thì không nhắc khối góc', () => {
  assert.ok(/cạnh bằng \$0\$/.test(tinh('hcnNhanXPha', { x: 3, dau: -1 }, 1, { hang: 'x+2', cot: 'x+3' }).pha.chu));
  assert.ok(!/cạnh bằng \$0\$/.test(tinh('hcnNhanXPha', { x: 4, dau: -1 }, 1, { hang: 'x+2', cot: 'x+3' }).pha.chu));
  assert.ok(/khối góc/.test(tinh('haiLapPhuong', { a: 3, b: 1.5, dau: -1 }, 0, { dang: 'hieu' }).pha.chu));
  assert.ok(!/khối góc/.test(tinh('haiLapPhuong', { a: 3, b: 1.5, dau: -1 }, 1, { dang: 'hieu' }).pha.chu));
});
