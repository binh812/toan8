const test = require('node:test'), assert = require('node:assert');
const C = require('../js/core/checker.js');
const P = require('../js/core/parser.js');

test('tương đương: hằng đẳng thức', () => {
  assert.ok(C.equivalent('(x+1)^2', 'x^2+2x+1'));
  assert.ok(C.equivalent('(a-b)(a+b)', 'a^2-b^2'));
  assert.ok(C.equivalent('(a+b)^3', 'a^3+3a^2b+3ab^2+b^3'));
  assert.ok(!C.equivalent('(x+1)^2', 'x^2+1'));
  assert.ok(!C.equivalent('x^2-2x+1', 'x^2+2x+1'));
});
test('tương đương: phân thức, bỏ qua điểm mẫu = 0', () => {
  assert.ok(C.equivalent('(x^2-1)/(x-1)', 'x+1'));
  assert.ok(C.equivalent('1/(x-1)+1/(x+1)', '2x/(x^2-1)'));
  // khoảng nửa số điểm thử cho căn số âm (NaN) → phải bỏ qua, không kết luận "khác"
  assert.ok(C.equivalent('sqrt(x)^2', 'x'));
});
test('tương đương: hằng số', () => {
  assert.ok(C.equivalent('2+3', '5'));
  assert.ok(!C.equivalent('2+3', '6'));
});
test('dạng khai triển', () => {
  const k = s => C.isExpanded(P.parse(s)).ok;
  assert.ok(k('x^2+6x+9'));
  assert.ok(k('-3x^2y+2xy^2-1'));
  assert.ok(k('(1)/(2)x^2-3'));
  assert.ok(!k('(x+3)^2'));
  assert.ok(!k('x(x+6)+9'));
  assert.ok(!k('x^2+3x+3x+9'));
  // đơn thức chưa thu gọn
  assert.ok(!k('2x*3x^2y'));
  assert.ok(!k('x*x'));
  assert.ok(!k('2*3x'));
  assert.ok(k('6x^3y'));
});
test('dạng nhân tử', () => {
  const f = s => C.isFactored(P.parse(s)).ok;
  assert.ok(f('(x-3)(x+3)'));
  assert.ok(f('3(x-1)'));
  assert.ok(f('2x(x+2)'));
  assert.ok(f('(x+2)^2'));
  assert.ok(f('-(x-1)(x+1)'));
  assert.ok(f('(a+2b)(a^2-2ab+4b^2)'));
  assert.ok(!f('x^2-9'));
  assert.ok(!f('(x^2-4)(x+1)'));
  assert.ok(!f('x(x+1)+2(x+1)'));
  assert.ok(!f('x(2x-4)'));                // (2x-4) còn đặt được nhân tử chung 2
  assert.ok(f('2x(x-2)'));
});
test('dạng rút gọn phân thức', () => {
  const r = s => C.isReduced(P.parse(s)).ok;
  assert.ok(r('(x+1)/(x-2)'));
  assert.ok(r('x+1'));
  assert.ok(!r('(x^2-1)/(x-1)'));
  assert.ok(!r('(2x+2)/(4x+4)'));
  assert.ok(!r('(2x)/(4y)'));
});
test('số kiểu Việt Nam', () => {
  assert.strictEqual(C.parseNumber('0,75'), 0.75);
  assert.strictEqual(C.parseNumber('3/4'), 0.75);
  assert.strictEqual(C.parseNumber('-1,5'), -1.5);
  assert.ok(Number.isNaN(C.parseNumber('abc')));
});
test('checkAnswer biểu thức', () => {
  const d = { kieu: 'bieuThuc', gt: 'x^2+6x+9', dang: 'khaiTrien' };
  assert.strictEqual(C.checkAnswer(d, 'x^2+6x+9').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, '9+6x+x²').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, '(x+3)^2').code, 'saiDang');
  const l = C.checkAnswer(d, 'x^2+9', [{ gt: 'x^2+9', giaiThich: 'Thiếu 2AB' }]);
  assert.strictEqual(l.code, 'loiThuongGap');
  assert.strictEqual(l.msg, 'Thiếu 2AB');
  assert.strictEqual(C.checkAnswer(d, 'x^2+5x+9').code, 'sai');
  assert.strictEqual(C.checkAnswer(d, 'x^2+').code, 'khongDoc');
  const f = { kieu: 'bieuThuc', gt: '(x-3)(x+3)', dang: 'nhanTu' };
  assert.strictEqual(C.checkAnswer(f, 'x^2-9').code, 'saiDang');
  assert.strictEqual(C.checkAnswer(f, '(x+3)(x-3)').code, 'dung');
});
test('checkAnswer số, nghiệm, chọn, đúng/sai, nhiều ô', () => {
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 0.75 }, '3/4').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: '3/4' }, '0,75').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 5, saiSo: 0.1 }, '5,05').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 5 }, 'năm').code, 'khongDoc');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [2, -3] }, 'x = -3; x = 2').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [2, -3] }, '2').code, 'sai');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [0.5] }, 'x = 1/2').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: 'voNghiem' }, 'vô nghiệm').code, 'dung');
  const ln = C.checkAnswer({ kieu: 'nghiem', gt: [0, 5] }, 'x = 5', [{ gt: [5], giaiThich: 'Em chia hai vế cho x nên mất nghiệm x = 0.' }]);
  assert.strictEqual(ln.code, 'loiThuongGap');
  assert.match(ln.msg, /mất nghiệm/);
  assert.strictEqual(C.checkAnswer({ kieu: 'chon', gt: 2 }, 2).code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'dungSai', gt: false }, false).code, 'dung');
  const m = { kieu: 'nhieuO', o: [{ kieu: 'so', gt: 2 }, { kieu: 'bieuThuc', gt: 'x+1' }] };
  assert.strictEqual(C.checkAnswer(m, ['2', '1+x']).code, 'dung');
  const r = C.checkAnswer(m, ['2', 'x']);
  assert.strictEqual(r.code, 'sai');
  assert.deepStrictEqual(r.tungO.map(x => x.ok), [true, false]);
});
