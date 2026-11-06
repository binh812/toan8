const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/khoiDaiSo.js');

const GAN = (x, y, msg) => assert.ok(Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y)), (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, 0.25, 0.5, 0.75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o);
// Tính giá trị đa thức viết kiểu đáp án ('3x^2y-2xy+5'), viết riêng ở đây để không dựa vào chính cảnh
function gt(s, v) {
  return (String(s).replace(/\s/g, '').match(/[+-]?[^+-]+/g) || []).reduce((tong, h) => {
    const m = /^([+-]?)(\d+(?:\.\d+)?(?:\/\d+)?)?(.*)$/.exec(h);
    const so = m[2] ? m[2].split('/') : ['1'], he = so.length > 1 ? +so[0] / +so[1] : +so[0];
    let tich = (m[1] === '-' ? -1 : 1) * he;
    for (const k of m[3].matchAll(/([a-z])(?:\^(\d+))?/g)) tich *= v[k[1]] ** (k[2] ? +k[2] : 1);
    return tong + tich;
  }, 0);
}
const XY = []; for (let x = 2; x <= 3; x += 0.25) for (let y = 1.25; y <= 1.75; y += 0.25) XY.push({ x, y });
const coSo = k => JSON.stringify(k, (key, v) => (typeof v === 'number' && !Number.isFinite(v) ? 'KHONG_HUU_HAN' : v));

test('khoiGop: mảnh có dấu cộng lại đúng giá trị đa thức sau khi lật, cả trước và sau khi triệt tiêu', () => {
  const de = [
    [{ nhom: ['2x^2y', '3x^2y', 'xy^2'] }, '5x^2y+xy^2'],
    [{ da: '5xy-2y^2', tru: '3xy+y^2' }, '2xy-3y^2'],
    [{ da: '2x^2-3xy+x^2+5xy' }, '3x^2+2xy'],
    [{ da: 'x-2y', nhom: [], tru: 'x+y-z' }, '-3y+z'],
    [{ da: '3x^2y-xy^2+15+xy^2-3x^2y+10' }, '25'],
    [{ da: '1/2x^2y-5/2x^2y+3xy' }, '-2x^2y+3xy']
  ];
  de.forEach(([o, kq]) => XY.forEach(p => {
    const v = { x: p.x, y: p.y, z: 3.4 };
    TT.forEach(t => {
      const k = tinh('khoiGop', p, t, o);
      assert.ok(!coSo(k).includes('KHONG_HUU_HAN'), 'NaN ở ' + JSON.stringify(o));
      if (t >= 0.35) {
        GAN(k.manh.reduce((s, m) => s + m.dau * m.gt, 0), gt(kq, v), 'tổng mảnh ' + JSON.stringify(o));
        // Mỗi cặp triệt tiêu gồm một mảnh dương, một mảnh âm cùng loại: bỏ cặp đi, tổng không đổi
        GAN(k.manh.filter(m => !m.cap).reduce((s, m) => s + m.dau * m.gt, 0), gt(kq, v), 'sau triệt tiêu');
      }
      GAN(k.giaTri, gt(kq, v), 'giaTri');
    });
  }));
});
test('khoiGop: mỗi hàng chỉ một loại mảnh, mọi mảnh cùng loại có cùng hình; khác phần biến thì khác hình', () => {
  const k = tinh('khoiGop', { x: 2.25, y: 1.5 }, 1, { nhom: ['2x^2y', '3x^2y', '-xy^2', 'x^2', 'xy', '5', 'x^4'] });
  const theoLoai = {};
  k.manh.forEach(m => { const h = [m.w, m.h, m.d].join(); (theoLoai[m.k] = theoLoai[m.k] || new Set()).add(h); });
  Object.values(theoLoai).forEach(s => assert.strictEqual(s.size, 1));
  const hinh = Object.keys(theoLoai).map(l => [...theoLoai[l]][0]);
  assert.strictEqual(new Set(hinh).size, hinh.length, 'hai loại khác nhau trùng hình: ' + hinh);
  // Thể tích khối x²y = x·x·y; bậc từ 4 là thẻ, riêng mảnh báo lỗi x⁴ là tấm vuông cạnh x²
  const x2y = k.manh.find(m => m.k === 'x2y1'); GAN(x2y.w * x2y.h * x2y.d, 2.25 * 2.25 * 1.5);
  assert.strictEqual(k.manh.find(m => m.k === 'x4').loai, 'the');
  const ma = tinh('khoiGop', { x: 2.25, y: 1.5, trangThai: 'm' }, 1, { nhom: ['4x^2'], sai: { m: { ma: { don: 'x^4' } } } }).ma;
  GAN(ma.hinh.w * ma.hinh.h, 2.25 ** 4);
});
test('khoiGop: lật mảnh của đa thức bị trừ; quên lật một mảnh thì kết quả đúng như lỗi đó', () => {
  const o = { da: '5xy-2y^2', tru: '3xy+y^2', sai: { quen: { khongLat: [3] } } };
  assert.strictEqual(tinh('khoiGop', { x: 2, y: 1.5 }, 1, o).tong.s, '= 2xy − 3y²');
  assert.strictEqual(tinh('khoiGop', { x: 2, y: 1.5, trangThai: 'quen' }, 1, o).tong.s, '= 2xy − y²');
  // Lúc đầu chưa lật, giữa chừng đang lật, cuối cùng đã lật
  assert.ok(tinh('khoiGop', { x: 2, y: 1.5 }, 0, o).manh.filter(m => m.g.lat).every(m => m.dauNay === m.g.dau0));
  assert.ok(tinh('khoiGop', { x: 2, y: 1.5 }, 0.4, o).manh.filter(m => m.g.lat).every(m => m.dauNay === -m.g.dau0));
});
test('khoiGop: đứng yên ở đầu cảnh, kết quả chỉ hiện ở cuối', () => {
  const o = { nhom: ['4x^2', '3x^2'] };
  const a = tinh('khoiGop', { x: 2.25, y: 1.5 }, 0, o), b = tinh('khoiGop', { x: 2.25, y: 1.5 }, 0.09, o);
  assert.deepStrictEqual(a.manh.map(m => [m.x, m.y]), b.manh.map(m => [m.x, m.y]));
  assert.strictEqual(a.ket, 0); assert.strictEqual(tinh('khoiGop', { x: 2.25, y: 1.5 }, 0.85, o).ket, 0);
  assert.strictEqual(a.tong.s, '= 7x²');
});

test('thuaSo nhân: tích các thẻ bằng đơn thức thu gọn, số thẻ chữ bằng bậc', () => {
  const de = [[['3x^2y', '-2xy^3'], '-6x^3y^4', 7], [['2x^3y', '5xy^2'], '10x^4y^3', 7], [['-1/3x^2y', '6xy^2z'], '-2x^3y^3z', 7], [['5x^2y^3'], '5x^2y^3', 5], [['4x^2y', '-3xy^3'], '-12x^3y^4', 7]];
  const v = { x: 1.7, y: -0.6, z: 2.3 };
  de.forEach(([don, kq, bac]) => TT.forEach(t => {
    const k = tinh('thuaSo', {}, t, { don, bac: true });
    assert.ok(!coSo(k).includes('KHONG_HUU_HAN'));
    const tich = k.the.reduce((s, c) => s * (c.loai === 'so' ? c.he[0] / c.he[1] : v[c.chu]), 1);
    GAN(tich, gt(kq, v), don.join('·'));
    assert.strictEqual(k.the.filter(c => c.loai === 'chu').length, bac);
  }));
});
test('thuaSo thay số: giá trị cuối đúng', () => {
  [['-2x^2y', { x: 3, y: -1 }, '18'], ['-3x^2y', { x: -2, y: '1/3' }, '−4']].forEach(([d, thay, kq]) => {
    const s = tinh('thuaSo', {}, 1, { don: d, thay }).dong.s;
    assert.ok(s.endsWith('= ' + kq), s);
  });
});
test('thuaSo chia: B nhân thương bằng A khi chia hết; thừa thẻ thì không chia hết', () => {
  const v = { x: 1.3, y: 0.7, z: 2 };
  [['12x^6', '3x^2', '4x^4'], ['-20x^3y^2', '5xy', '-4x^2y'], ['12x^4y^3', '4x^2y', '3x^2y^2'], ['8x^3y^2z', '-2x^2yz', '-4xy']].forEach(([a, b, q]) => {
    const k = tinh('thuaSo', {}, 1, { chia: [a, b] });
    assert.ok(k.dong.duoc && k.dong.s === '= ' + canh.daiSo.chuDon(canh.daiSo.docDon(q)), k.dong.s);
    GAN(gt(b, v) * gt(q, v), gt(a, v));
    // Thẻ chữ của A còn lại (không bị ghép) đúng bằng phần biến của thương
    assert.strictEqual(k.the.filter(c => c.loai === 'chu' && c.don === 0 && !c.cap).length, canh.daiSo.bacDon(canh.daiSo.docDon(q).mu));
  });
  const k = tinh('thuaSo', {}, 1, { chia: ['6x^2y', '2xy^2'] });
  assert.strictEqual(k.dong.duoc, false);
  assert.deepStrictEqual(k.the.filter(c => c.thua).map(c => c.chu), ['y']);
});

test('hcnNhan: tổng diện tích các ô bằng diện tích hình chữ nhật và bằng giá trị tích', () => {
  const de = [['x+2', 'x+3', 'x^2+5x+6'], ['2x', 'x+3', '2x^2+6x'], ['x+1', '2x+3', '2x^2+5x+3'], ['3y', '2x+x', '9xy'], ['x+2', 'x+5', 'x^2+7x+10']];
  for (let x = 1.5; x <= 5; x += 0.5) for (let y = 1; y <= 4; y += 0.5) de.forEach(([h, c, kq]) => TT.forEach(t => {
    const k = tinh('hcnNhan', { x, y }, t, { hang: h, cot: c });
    assert.ok(k.thuc && !coSo(k).includes('KHONG_HUU_HAN'));
    GAN(k.o.reduce((s, o) => s + o.w * o.h, 0), k.W * k.H);
    GAN(k.W * k.H, gt(kq, { x, y }));
    // Mỗi ô là tích của đoạn trên và đoạn trái tương ứng
    k.o.forEach(o => GAN(o.w * o.h, k.o.filter(q => q.i === 0 && q.j === o.j)[0].w * k.o.filter(q => q.j === 0 && q.i === o.i)[0].h));
  }));
});
test('hcnNhan: có hạng tử âm thì thành bảng; tổng các ô đúng tích', () => {
  const v = { x: 1.7, y: -0.6 };
  [['x-y', 'x^2+xy+y^2', 'x^3-y^3'], ['2x-3', 'x+5', '2x^2+7x-15'], ['-3xy', '2x^2-xy+4y', '-6x^3y+3x^2y^2-12xy^2']].forEach(([h, c, kq]) => {
    const k = tinh('hcnNhan', { x: 3, y: 2 }, 1, { hang: h, cot: c });
    assert.ok(!k.thuc);
    GAN(k.o.reduce((s, o) => s + canh.daiSo.giaTri(o.tich.mu, v) * o.tich.he[0] / o.tich.he[1], 0), gt(kq, v));
  });
  assert.strictEqual(tinh('hcnNhan', { x: 3, y: 2 }, 1, { hang: 'x-y', cot: 'x^2+xy+y^2' }).tong.s, '= x³ − y³');
});
test('hcnNhan chia: mỗi ô có cạnh trên bằng diện tích chia cạnh trái; mảnh không chia hết bị chỉ ra', () => {
  for (let x = 1.5; x <= 5; x += 0.5) {
    const k = tinh('hcnNhan', { x, y: 2 }, 1, { chia: '4xy', dt: '12x^2y+8xy^2' });
    assert.ok(k.thuc); assert.strictEqual(k.tong.s, '= 3x + 2y');
    k.o.forEach((o, j) => GAN(o.w * o.h, gt(['12x^2y', '8xy^2'][j], { x, y: 2 })));
  }
  const k = tinh('hcnNhan', { x: 3, y: 2 }, 1, { chia: '2x^2y', dt: '6x^3y-4x^2y^2+2xy' });
  assert.deepStrictEqual(k.o.map(o => o.khong), [false, false, true]);
  assert.strictEqual(k.tong.duoc, false);
  // Chưa chia thì cạnh trên chưa hiện
  assert.ok(tinh('hcnNhan', { x: 3, y: 2 }, 0, { chia: '2x', dt: '6x^2+4x' }).canhTren.every(c => c.lo === 0));
});
test('hcnNhan chia, trạng thái lỗi: ô nào nhân lại không ra diện tích thì bị chỉ ra, ô đúng thì không', () => {
  const o = { chia: '4xy', dt: '12x^2y+8xy^2', sai: { heSo: { tren: ['3x^2y', '2y'] }, thieu: { tren: ['3x', null] } } };
  const a = tinh('hcnNhan', { x: 3, y: 2, trangThai: 'heSo' }, 1, o);
  assert.deepStrictEqual(a.o.map(c => !!c.lech), [true, false]);
  assert.strictEqual(a.o[0].s, '12x³y² ≠');
  const b = tinh('hcnNhan', { x: 3, y: 2, trangThai: 'thieu' }, 1, o);
  assert.deepStrictEqual(b.o.map(c => !!c.thieu), [false, true]);
  assert.strictEqual(b.canhTren[1].s, '?');
});
test('khoiGop: nhóm ghi sau chỉ hiện khi hình chạy', () => {
  const o = { nhom: ['x^2', { don: 'x', sau: true }] };
  assert.ok(tinh('khoiGop', { x: 2.25, y: 1.5 }, 0, o).manh.filter(m => m.g.sau).every(m => m.op === 0));
  assert.ok(tinh('khoiGop', { x: 2.25, y: 1.5 }, 1, o).manh.every(m => m.op === 1));
});
test('hcnNhanX: chỉ có thanh x, tính giống hệt hcnNhan', () => {
  assert.deepStrictEqual(Object.keys(canh.lay('hcnNhanX').thamSo), ['x']);
  const o = { hang: 'x+2', cot: 'x+3' };
  assert.deepStrictEqual(tinh('hcnNhanX', { x: 4 }, 0.6, o), tinh('hcnNhan', { x: 4, y: 2 }, 0.6, o));
});
test('hcnNhan: ô bị thiếu (lỗi) và ô bị bỏ không tính vào tổng hiện ra đúng chỗ', () => {
  const o = { hang: 'x+2', cot: 'x+4', sai: { thieu: { an: [[0, 1], [1, 0]] } } };
  const k = tinh('hcnNhan', { x: 3, y: 2, trangThai: 'thieu' }, 1, o);
  assert.deepStrictEqual(k.o.filter(c => c.an).map(c => c.s), ['4x', '2x']);
  assert.strictEqual(tinh('hcnNhan', { x: 3, y: 2 }, 1, { hang: 'x+2', cot: 'x+5', bo: [[0, 0]] }).tong.s, '= 7x + 10');
});
