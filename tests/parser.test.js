const test = require('node:test'), assert = require('node:assert');
const P = require('../js/core/parser.js');
const ev = (s, env = {}) => P.evaluate(P.parse(s), env);

test('số và phép tính cơ bản', () => {
  assert.strictEqual(ev('2+3*4'), 14);
  assert.strictEqual(ev('2^3^2'), 512);
  assert.strictEqual(ev('-2^2'), -4);
  assert.strictEqual(ev('(3)/(4)'), 0.75);
});
test('nhân ngầm', () => {
  assert.strictEqual(ev('2x', { x: 5 }), 10);
  assert.strictEqual(ev('2x^2', { x: 3 }), 18);
  assert.strictEqual(ev('x(x+1)', { x: 2 }), 6);
  assert.strictEqual(ev('(a+b)(a-b)', { a: 5, b: 2 }), 21);
  assert.strictEqual(ev('xy', { x: 2, y: 3 }), 6);
  assert.strictEqual(ev('(3)/(4)x', { x: 8 }), 6);
  assert.strictEqual(ev('2(x+1)^2', { x: 1 }), 8);
});
test('kiểu nhập Việt Nam', () => {
  assert.strictEqual(ev('0,75'), 0.75);
  assert.strictEqual(ev('3:4'), 0.75);
  assert.strictEqual(ev('x²', { x: 3 }), 9);
  assert.strictEqual(ev('x³', { x: 2 }), 8);
  assert.strictEqual(ev('2·x', { x: 4 }), 8);
  assert.strictEqual(ev('2×3'), 6);
  assert.strictEqual(ev('5 − 2'), 3);
  assert.strictEqual(ev(' x ^ 2 + 1 ', { x: 2 }), 5);
});
test('căn bậc hai', () => {
  assert.strictEqual(ev('sqrt(9)'), 3);
  assert.strictEqual(ev('√16'), 4);
});
test('biến', () => {
  assert.deepStrictEqual(P.variables(P.parse('x^2y+3z-x')), ['x', 'y', 'z']);
});
test('không đọc được', () => {
  for (const bad of ['', '2+', '(x+1', 'x)', '2**3', '#'])
    assert.throws(() => P.parse(bad), e => e.code === 'khongDoc', bad);
});
test('toNerdamer tương đương', () => {
  assert.strictEqual(P.toNerdamer(P.parse('2x(x-1)')), '2*x*(x-1)');
  assert.strictEqual(P.toNerdamer(P.parse('-x^2')), '-(x^2)');
});
test('toLatex', () => {
  assert.strictEqual(P.toLatex(P.parse('(x+1)/(x-1)')), '\\frac{x+1}{x-1}');
  assert.strictEqual(P.toLatex(P.parse('2x^2')), '2x^{2}');
  assert.strictEqual(P.toLatex(P.parse('4x^2-4x+1')), '4x^{2}-4x+1');
  assert.strictEqual(P.toLatex(P.parse('x-(a+b)')), 'x-\\left(a+b\\right)');
});
test('toLatex: số âm đứng đầu tích không bọc ngoặc; không ra "+-"', () => {
  assert.strictEqual(P.toLatex(P.parse('-4x+1')), '-4x+1');
  assert.strictEqual(P.toLatex(P.parse('-4x^2y')), '-4x^{2}y');
  assert.strictEqual(P.toLatex(P.parse('2*(-3)')), '2\\left(-3\\right)');
  assert.strictEqual(P.toLatex(P.parse('x+(-4)x')), 'x-4x');
});
test('ngoặc nhọn kiểu LaTeX đọc như ngoặc tròn: x^{2}+1', () => {
  assert.strictEqual(P.evaluate(P.parse('x^{2}+1'), { x: 3 }), 10);
  assert.strictEqual(P.evaluate(P.parse('2^{x+1}'), { x: 2 }), 8);
});
