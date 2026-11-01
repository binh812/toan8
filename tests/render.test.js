const test = require('node:test'), assert = require('node:assert');
const R = require('../js/core/render.js');

test('escape và đậm', () => {
  assert.strictEqual(R.md('a < b **đậm**'), '<p>a &lt; b <b>đậm</b></p>');
});
test('tách công thức, không escape bên trong', () => {
  assert.match(R.md('Ta có $a<b$.'), /<span class="m">a<b<\/span>/);
  assert.strictEqual(R.md('$$x^2$$'), '<div class="mb">x^2</div>');
});
test('đoạn văn và xuống dòng', () => {
  assert.strictEqual(R.md('một\n\nhai'), '<p>một</p><p>hai</p>');
  assert.strictEqual(R.md('một\nhai'), '<p>một<br>hai</p>');
});
test('xuống dòng chỉ đổi ở phần chữ, không chèn <br> vào công thức', () => {
  assert.strictEqual(R.md('$a\nb$'), '<p><span class="m">a\nb</span></p>');
  assert.strictEqual(R.md('dòng 1\n$x$'), '<p>dòng 1<br><span class="m">x</span></p>');
});
test('chữ đậm bọc quanh công thức', () => {
  assert.strictEqual(R.md('**đậm $x$**'), '<p><b>đậm <span class="m">x</span></b></p>');
});
test('mdInline không bọc <p>', () => {
  assert.strictEqual(R.mdInline('Hệ quả $x$'), 'Hệ quả <span class="m">x</span>');
});
test('chuỗi rỗng / null không lỗi', () => {
  assert.strictEqual(R.md(''), '');
  assert.strictEqual(R.md(null), '');
});
