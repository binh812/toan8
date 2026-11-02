const test = require('node:test'), assert = require('node:assert');
const L = require('../js/core/luyen.js');
const { taoRng, congCu } = require('../js/core/rng.js');
const P = require('../js/core/parser.js');

test('lên mức sau 3 câu đúng liền; xuống ngay khi sai 2 lần; xuống khi xem lời giải 2 câu liền', () => {
  let t = { muc: 1, dungLien: 0, xemLien: 0 };
  t = L.mucTiepTheo(t, 'dung'); t = L.mucTiepTheo(t, 'dung');
  assert.strictEqual(t.muc, 1);
  t = L.mucTiepTheo(t, 'dung');
  assert.strictEqual(t.muc, 2);
  assert.strictEqual(t.dungLien, 0);
  t = L.mucTiepTheo(t, 'sai2');
  assert.strictEqual(t.muc, 1);
  t = L.mucTiepTheo(t, 'sai2');
  assert.strictEqual(t.muc, 1);
  t = { muc: 3, dungLien: 2, xemLien: 0 };
  t = L.mucTiepTheo(t, 'xemLoiGiai');
  assert.strictEqual(t.muc, 3);
  t = L.mucTiepTheo(t, 'xemLoiGiai');
  assert.strictEqual(t.muc, 2);
  t = L.mucTiepTheo({ muc: 3, dungLien: 2, xemLien: 0 }, 'dung');
  assert.strictEqual(t.muc, 3);
});

test('kết quả một câu', () => {
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 1, xemLoiGiai: false }), 'dung');
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 2, xemLoiGiai: false }), 'sai2');
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 0, xemLoiGiai: true }), 'xemLoiGiai');
  assert.strictEqual(L.ketQuaCau({ dung: false, soLanSai: 0, xemLoiGiai: false }), 'xemLoiGiai');
});

test('chọn nguồn đúng mức, tránh lặp; sinh câu có hạt giống', () => {
  const goi = { dang: [
    { ten: 'A', muc: 1, sinh: r => ({ de: 'a' + r.so(1, 9), dapAn: { kieu: 'so', gt: 1 } }) },
    { ten: 'B', muc: 1, sinh: () => ({ de: 'b', dapAn: { kieu: 'so', gt: 1 } }) },
    { ten: 'C', muc: 3, sinh: () => ({ de: 'c', dapAn: { kieu: 'so', gt: 1 } }) }],
    deCo: [{ id: '6.L1', muc: 2, de: 'cố định', dapAn: { kieu: 'so', gt: 2 } }] };
  const ng = L.danhSachNguon(goi), r = taoRng(1);
  assert.strictEqual(ng.length, 4);
  for (let i = 0; i < 50; i++) assert.notStrictEqual(L.chonNguon(ng, 1, 'A', r).ten, 'A');
  assert.strictEqual(L.chonNguon(ng, 2, null, r).ten, '6.L1');
  assert.notStrictEqual(L.chonNguon(ng.filter(n => n.muc !== 2), 2, null, r).muc, 2);
  const cc = congCu(P);
  const q1 = L.sinhCau(ng[0], 99, cc, 6), q2 = L.sinhCau(ng[0], 99, cc, 6);
  assert.strictEqual(q1.de, q2.de);
  assert.strictEqual(q1.id, 'L6-99');
  assert.strictEqual(q1.muc, 1);
  const q3 = L.sinhCau(ng[3], 5, cc, 6);
  assert.strictEqual(q3.id, '6.L1');
  assert.strictEqual(q3.de, 'cố định');
});
