const test = require('node:test'), assert = require('node:assert');
const { taoRng, congCu } = require('../js/core/rng.js');
const P = require('../js/core/parser.js');

test('cùng hạt giống → cùng dãy; khác hạt giống → khác', () => {
  const a = taoRng(42), b = taoRng(42), c = taoRng(43);
  const da = [1, 2, 3, 4, 5].map(() => a.so(1, 1000)), db = [1, 2, 3, 4, 5].map(() => b.so(1, 1000)), dc = [1, 2, 3, 4, 5].map(() => c.so(1, 1000));
  assert.deepStrictEqual(da, db);
  assert.notDeepStrictEqual(da, dc);
});

test('so, khac0, chon, khacNhau nằm trong khoảng', () => {
  const r = taoRng(7);
  for (let i = 0; i < 2000; i++) {
    const x = r.so(-3, 3);
    assert.ok(Number.isInteger(x) && x >= -3 && x <= 3);
    assert.notStrictEqual(r.khac0(-2, 2), 0);
    assert.ok(['a', 'b'].includes(r.chon(['a', 'b'])));
  }
  const k = r.khacNhau(4, 1, 6);
  assert.strictEqual(new Set(k).size, 4);
  assert.ok(k.every(v => v >= 1 && v <= 6));
});

test('công cụ định dạng', () => {
  const cc = congCu(P);
  assert.strictEqual(cc.daThuc([[1, 'x^2'], [-6, 'x'], [9, '']]), 'x^2-6x+9');
  assert.strictEqual(cc.daThuc([[-1, 'x^2'], [0, 'x'], [1, '']]), '-x^2+1');
  assert.strictEqual(cc.daThuc([[0, 'x'], [0, '']]), '0');
  assert.deepStrictEqual([cc.phanSo(6, -8).tu, cc.phanSo(6, -8).mau], [-3, 4]);
  assert.strictEqual(cc.phanSo(6, 3).tex, '2');
  assert.strictEqual(cc.phanSo(-3, 4).tex, '-\\frac{3}{4}');
  assert.strictEqual(cc.phanSo(-3, 4).ascii, '-3/4');
  assert.strictEqual(cc.so(0.5), '0{,}5');
  assert.strictEqual(cc.so(-2), '-2');
  assert.strictEqual(cc.ucln(12, -18), 6);
  assert.strictEqual(cc.tex('x^2-6x+9'), P.toLatex(P.parse('x^2-6x+9')));
});
