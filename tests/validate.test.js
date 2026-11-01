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
  for (const s of ['nhanTu', 'loiThuongGap', 'baiTap', 'viDu', 'viDuMo', 'dongSai', 'dấu $', 'loiGiai'])
    assert.ok(out.includes(s), 'thiếu báo lỗi: ' + s + '\n' + out);
});
