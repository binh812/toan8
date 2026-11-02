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
  // dấu chấm phân cách hàng nghìn kiểu Việt Nam
  assert.strictEqual(C.parseNumber('9.801'), 9801);
  assert.strictEqual(C.parseNumber('1.000.000'), 1000000);
  assert.strictEqual(C.parseNumber('-4.045'), -4045);
  assert.strictEqual(C.parseNumber('0.75'), 0.75);
  assert.strictEqual(C.parseNumber('1.234,5'), 1234.5);
});
test('nghiệm: các cách ghi khác', () => {
  const d = { kieu: 'nghiem', gt: [3, -3] };
  assert.strictEqual(C.checkAnswer(d, '3, -3').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, 'x = 3 hoặc x = -3').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, 'x=3, x=-3').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [0.5] }, '0,5').code, 'dung');
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

test('nhiều ô: hiện lỗi thường gặp / sai dạng của từng ô; ô trống là chưa nhập', () => {
  const m = { kieu: 'nhieuO', o: [
    { kieu: 'bieuThuc', gt: 'x^2+2x+1', dang: 'khaiTrien', nhan: 'Ô thứ nhất', loiThuongGap: [{ gt: 'x^2+1', giaiThich: 'Thiếu 2AB' }] },
    { kieu: 'so', gt: 7, nhan: 'Ô thứ hai' }] };
  const a = C.checkAnswer(m, ['x^2+1', '7']);
  assert.strictEqual(a.code, 'sai');
  assert.match(a.msg, /Thiếu 2AB/);
  const b = C.checkAnswer(m, ['(x+1)^2', '7']);
  assert.match(b.msg, /khai triển/);
  const e = C.checkAnswer(m, ['x^2+2x+1', '']);
  assert.strictEqual(e.code, 'khongDoc');
  assert.match(e.msg, /chưa điền/);
});
test('số: 0.125 là số thập phân; 1.125 chấp nhận cả hai cách đọc', () => {
  assert.strictEqual(C.parseNumber('0.125'), 0.125);
  assert.strictEqual(C.parseNumber('-0.750'), -0.75);
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 1.125 }, '1.125').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 1125 }, '1.125').code, 'dung');
});
test('bộ gõ tiếng Việt đang bật: nhắc tắt bộ gõ', () => {
  const r = C.checkAnswer({ kieu: 'bieuThuc', gt: 'ax+1' }, 'ãx+1');
  assert.strictEqual(r.code, 'khongDoc');
  assert.match(r.msg, /bộ gõ/);
});
test('Caps Lock: chữ in hoa đúng giá trị → nhắc, không chấm sai', () => {
  const r = C.checkAnswer({ kieu: 'bieuThuc', gt: 'x^2+6x+9', dang: 'khaiTrien' }, 'X^2+6X+9');
  assert.strictEqual(r.code, 'saiDang');
  assert.match(r.msg, /in hoa/);
});
test('số: nhận phần trăm và đơn vị đo ở cuối', () => {
  const so = (gt, s) => C.checkAnswer({ kieu: 'so', gt }, s).code;
  assert.strictEqual(so(0.25, '25%'), 'dung');
  assert.strictEqual(so(25, '25 %'), 'dung');
  assert.strictEqual(so(0.25, '30%'), 'sai');
  assert.strictEqual(so(6, '6 cm'), 'dung');
  assert.strictEqual(so(12, '12cm2'), 'dung');
  assert.strictEqual(so(12, '12 cm²'), 'dung');
  assert.strictEqual(so(36, '36 cm³'), 'dung');
  assert.strictEqual(so(60, '60°'), 'dung');
  assert.strictEqual(so(60, '60 độ'), 'dung');
  assert.strictEqual(so(2.5, '2,5 km'), 'dung');
  assert.strictEqual(so(5, '5 m'), 'dung');
  assert.strictEqual(so(5, '7 m'), 'sai');
});
test('biểu thức: bỏ tiền tố "y =" hoặc "f(x) ="', () => {
  const bt = s => C.checkAnswer({ kieu: 'bieuThuc', gt: '2x+3' }, s).code;
  assert.strictEqual(bt('y = 2x+3'), 'dung');
  assert.strictEqual(bt('f(x)=2x+3'), 'dung');
  assert.strictEqual(bt('y=2x-3'), 'sai');
});
test('số: chữ đơn vị bất kỳ sau con số (có dấu tiếng Việt) được bỏ qua', () => {
  const so = (gt, s) => C.checkAnswer({ kieu: 'so', gt }, s).code;
  assert.strictEqual(so(12, '12 bạn'), 'dung');
  assert.strictEqual(so(3, '3 quyển sách'), 'dung');
  assert.strictEqual(so(0.5, '0,5 triệu đồng'), 'dung');
  assert.strictEqual(so(12, '13 bạn'), 'sai');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 12 }, 'mười hai').code, 'khongDoc');
});
test('rút gọn: phải gọn thành một phân thức, không chép lại tổng/tích trong đề', () => {
  const rg = (gt, s) => C.checkAnswer({ kieu: 'bieuThuc', gt, dang: 'rutGon' }, s).code;
  assert.strictEqual(rg('2/(x(x+2))', '1/x-1/(x+2)'), 'saiDang');
  assert.strictEqual(rg('(3y-2x)/(6x^2y^2)', '1/(2x^2y)-1/(3xy^2)'), 'saiDang');
  assert.strictEqual(rg('-5/(2(x-2)^2)', '5/(4-2x)^2*(-2)'), 'saiDang');
  // các cách viết đúng vẫn được nhận
  assert.strictEqual(rg('2/(x(x+2))', '2/(x^2+2x)'), 'dung');
  assert.strictEqual(rg('x(x-3)/(x+3)', '(x-3)x/(3+x)'), 'dung');
  assert.strictEqual(rg('(x+4)/(x+1)', '-(x+4)/(-x-1)'), 'dung');
  assert.strictEqual(rg('2x^2/(3y^3)', '2/3*x^2/y^3'), 'dung');
  assert.strictEqual(rg('(x-3)/2', 'x/2-3/2'), 'dung');
  assert.strictEqual(rg('-5/(2(x-2)^2)', '-5/(2(x-2)^2)'), 'dung');
  assert.strictEqual(rg('2x^2/(3y^3)', '2/(3y^3)*x^2'), 'dung');
});
test('số: nhận "x = 2"; nghiệm: nhận "S = ∅" là vô nghiệm', () => {
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 2 }, 'x = 2').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 2 }, 'AB = 2 cm').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: 'voNghiem' }, 'S = ∅').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: 'voNghiem' }, '∅').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [2] }, 'S = ∅').code, 'sai');
});
test('phần trăm: 0,1% không phải 10%; nhận sai số làm tròn nhỏ', () => {
  const so = (gt, s) => C.checkAnswer({ kieu: 'so', gt }, s).code;
  assert.strictEqual(so(0.1, '0,1%'), 'sai');
  assert.strictEqual(so('3/200', '0,015%'), 'sai');
  assert.strictEqual(so(0.1, '10%'), 'dung');
  assert.strictEqual(so('3/200', '1,5%'), 'dung');
  assert.strictEqual(so(25, '25%'), 'dung');
  assert.strictEqual(so('1/3', '33,33%'), 'dung');
  assert.strictEqual(so('1/3', '33%'), 'sai');
  assert.strictEqual(so(0.5, '50 phần trăm'), 'dung');
});
test('số: nghìn/triệu/tỉ là bậc của số', () => {
  const so = (gt, s) => C.checkAnswer({ kieu: 'so', gt }, s).code;
  assert.strictEqual(so(46000, '46 nghìn'), 'dung');
  assert.strictEqual(so(1500000, '1,5 triệu'), 'dung');
  assert.strictEqual(so(0.5, '0,5 triệu đồng'), 'dung');
  assert.strictEqual(so(46000, '47 nghìn'), 'sai');
});
test('nghiệm: các cách viết vô nghiệm và tập nghiệm có ngoặc nhọn', () => {
  const ng = (gt, s) => C.checkAnswer({ kieu: 'nghiem', gt }, s).code;
  for (const s of ['Ø', 'ø', 'không có nghiệm', 'S = rỗng']) assert.strictEqual(ng('voNghiem', s), 'dung', s);
  assert.strictEqual(ng('voNghiem', 'abc'), 'khongDoc');
  assert.strictEqual(ng('voNghiem', 'x = 2'), 'sai');
  assert.strictEqual(ng([2, 3], 'S = {2; 3}'), 'dung');
  assert.strictEqual(ng([2], 'S={2}'), 'dung');
  assert.strictEqual(ng([2, 3], 'x ∈ {2; 3}'), 'dung');
});
test('biểu thức: bỏ tiền tố "r =", "Y =" như "y ="', () => {
  const bt = (gt, s) => C.checkAnswer({ kieu: 'bieuThuc', gt }, s).code;
  assert.strictEqual(bt('(xy-600)/(50y)', 'r = (xy-600)/(50y)'), 'dung');
  assert.strictEqual(bt('2x+3', 'Y = 2x+3'), 'dung');
  assert.strictEqual(bt('2x+3', 'P(x) = 2x+3'), 'dung');
});
test('nghiệm: 1.125 nhận cả hai cách đọc như câu số', () => {
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [1.125] }, 'x = 1.125').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [1125] }, '1.125').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [1.125, -2] }, '1.125; -2').code, 'dung');
});
test('nhân tử: đưa dấu trừ ra trước lũy thừa vẫn là đã phân tích (-x^2(1-4x))', () => {
  const nt = (gt, s) => C.checkAnswer({ kieu: 'bieuThuc', gt, dang: 'nhanTu' }, s).code;
  assert.strictEqual(nt('x^2(4x-1)', '-x^2(1-4x)'), 'dung');
  assert.strictEqual(nt('x^2(4x-1)', 'x^2(4x-1)'), 'dung');
  assert.strictEqual(nt('x^2(4x-1)', '-x(x-4x^2)'), 'saiDang');
});
