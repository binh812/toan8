const test = require('node:test'), assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');
const run = f => spawnSync(process.execPath, [path.join(__dirname, '..', 'tools', 'validate-content.js'), path.join(__dirname, 'fixtures', f)], { encoding: 'utf8' });

test('bài hợp lệ: không lỗi', () => {
  const r = run('bai-dung.js');
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
});
test('bài có lỗi: báo đủ các loại lỗi', () => {
  const r = run('bai-sai.js');
  assert.strictEqual(r.status, 1);
  const out = r.stdout;
  for (const s of ['nhanTu', 'loiThuongGap', 'baiTap', 'viDu', 'viDuMo', 'dongSai', 'dấu $', 'loiGiai', 'goiY phải là mảng', 'KaTeX', 'dấu \\ đơn'])
    assert.ok(out.includes(s), 'thiếu báo lỗi: ' + s + '\n' + out);
});
test('luyện thêm hợp lệ: không lỗi', () => {
  const r = run('luyen-dung.js');
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /2 dạng luyện thêm/);
});
test('luyện thêm có lỗi: bắt đáp án sai, chia 0 (Infinity/NaN), dạng ném lỗi, thiếu mức 2', () => {
  const r = run('luyen-sai.js');
  assert.strictEqual(r.status, 1);
  for (const s of ['Sai đáp án', 'Chia 0', 'Infinity', 'Ném lỗi', 'hạt giống', 'mức 1 và mức 2']) assert.ok(r.stdout.includes(s), 'thiếu: ' + s + '\n' + r.stdout);
});
