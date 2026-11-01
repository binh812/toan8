const test = require('node:test'), assert = require('node:assert');
const { createStore } = require('../js/core/store.js');
function mem() { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, _m: m }; }
const day = d => () => new Date(2026, 10, d, 10);

test('ghi lần làm và đọc lại sau khi tạo store mới', () => {
  const s = mem(); const a = createStore(s, day(2));
  a.recordAttempt('6.1', { ok: true, hintLevel: 0, hintMax: 3 });
  const b = createStore(s, day(2));
  assert.deepStrictEqual(b.exState('6.1'), { tries: 1, correct: true, usedSolution: false, lastOk: true });
});
test('dùng nấc gợi ý cuối thì usedSolution, không tính là đúng', () => {
  const a = createStore(mem(), day(2));
  a.recordAttempt('6.2', { ok: true, hintLevel: 3, hintMax: 3 });
  assert.strictEqual(a.exState('6.2').usedSolution, true);
  assert.strictEqual(a.exState('6.2').correct, false);
});
test('thành thạo', () => {
  const a = createStore(mem(), day(2));
  const bai = { baiTap: [{ id: 'a', muc: 1 }, { id: 'b', muc: 1 }, { id: 'c', muc: 2 }, { id: 'd', muc: 2 }, { id: 'e', muc: 2 }, { id: 'f', muc: 3 }] };
  ['a', 'b', 'c', 'd'].forEach(id => a.recordAttempt(id, { ok: true, hintLevel: 0, hintMax: 3 }));
  assert.strictEqual(a.lessonStatus(bai).mastered, false);
  a.recordAttempt('f', { ok: true, hintLevel: 1, hintMax: 3 });
  assert.strictEqual(a.lessonStatus(bai).mastered, true);
  assert.strictEqual(a.lessonStatus(bai).done, 5);
  const b = createStore(mem(), day(2));
  ['a', 'b', 'c', 'f'].forEach(id => b.recordAttempt(id, { ok: true, hintLevel: 0, hintMax: 3 }));
  assert.strictEqual(b.lessonStatus(bai).mastered, false);        // 3/5 = 60%
});
test('Leitner: sai → ôn ngày mai; đúng khi ôn → lên hộp', () => {
  const s = mem();
  createStore(s, day(2)).recordAttempt('x', { ok: false, hintLevel: 0, hintMax: 3 });
  assert.deepStrictEqual(createStore(s, day(2)).dueToday(5), []);
  assert.deepStrictEqual(createStore(s, day(3)).dueToday(5), ['x']);
  createStore(s, day(3)).recordAttempt('x', { ok: true, hintLevel: 0, hintMax: 3 });
  assert.deepStrictEqual(createStore(s, day(4)).dueToday(5), []);
  assert.deepStrictEqual(createStore(s, day(5)).dueToday(5), ['x']);
});
test('storage hỏng hoặc bị chặn', () => {
  const s = mem(); s.setItem('toan8.v1', '{hỏng');
  const a = createStore(s, day(2));
  assert.strictEqual(a.ok, true);
  assert.strictEqual(a.exState('z'), null);
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const b = createStore(blocked, day(2));
  assert.strictEqual(b.ok, false);
  b.recordAttempt('q', { ok: true, hintLevel: 0, hintMax: 3 });
  assert.strictEqual(b.exState('q').tries, 1);
  assert.strictEqual(createStore(null).ok, false);
});
test('xuất / nhập', () => {
  const a = createStore(mem(), day(2));
  a.recordAttempt('k', { ok: true, hintLevel: 0, hintMax: 3 });
  const b = createStore(mem(), day(2));
  assert.strictEqual(b.importJSON(a.exportJSON()), true);
  assert.strictEqual(b.exState('k').tries, 1);
  assert.strictEqual(b.importJSON('rác'), false);
  assert.strictEqual(b.importJSON('{"v":1}'), false);
});

test('tiến độ hỏng: giữ bản cũ và báo recovered', () => {
  const s = mem(); s.setItem('toan8.v1', '{"v":1,"ex":{"a":');
  const a = createStore(s, day(2));
  assert.strictEqual(a.recovered, true);
  assert.strictEqual(s.getItem('toan8.v1.hong'), '{"v":1,"ex":{"a":');
  assert.strictEqual(createStore(mem(), day(2)).recovered, false);
});
test('nhập file có cấu trúc lạ: làm sạch, không làm hỏng trang', () => {
  const a = createStore(mem(), day(2));
  assert.strictEqual(a.importJSON('{"v":1,"ex":{"k":{"tries":1,"correct":true},"bad":5},"box":{"1.1":null,"k":{"box":2,"due":0}},"tabs":{"1":5,"2":["khamPha",3]}}'), true);
  assert.deepStrictEqual(a.dueToday(5), ['k']);
  assert.strictEqual(a.exState('bad'), null);
  a.markTab(1, 'viDu');
  assert.deepStrictEqual(a.tabsSeen(1), ['viDu']);
  assert.deepStrictEqual(a.tabsSeen(2), ['khamPha']);
  assert.strictEqual(a.importJSON('{"v":1,"ex":{},"tabs":"s"}'), true);
  a.markTab(3, 'x');
});
test('ôn tập: bấm Kiểm tra nhiều lần trong ngày chỉ lên hộp một lần', () => {
  const s = mem();
  createStore(s, day(2)).recordAttempt('x', { ok: false, hintLevel: 0, hintMax: 3 });
  const b = createStore(s, day(3));
  for (let i = 0; i < 4; i++) b.recordAttempt('x', { ok: true, hintLevel: 0, hintMax: 3 });
  assert.deepStrictEqual(createStore(s, day(5)).dueToday(5), ['x']);   // hộp 2 (+2 ngày), không phải hộp 5
});
