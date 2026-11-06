const test = require('node:test'), assert = require('node:assert');
const L = require('../js/core/lapcm.js');

const CM = { ketLuan: 'AB = CD', buoc: [
  { id: 'gt', chu: 'Giả thiết' },
  { id: 'g1', chu: 'Góc 1 = góc 2', can: ['gt'] },
  { id: 'bn', chu: 'Hai tam giác bằng nhau', can: ['gt', 'g1'] },
  { id: 'kl', chu: 'AB = CD', can: ['bn'] }
] };

test('lắp bước khi đủ căn cứ; thiếu thì nói đúng căn cứ còn thiếu', () => {
  assert.deepStrictEqual(L.kiemBuoc(CM, [], 'gt'), { ok: true, thieu: [] });
  assert.deepStrictEqual(L.kiemBuoc(CM, ['gt'], 'bn'), { ok: false, thieu: ['g1'] });
  assert.deepStrictEqual(L.kiemBuoc(CM, ['gt', 'g1'], 'bn'), { ok: true, thieu: [] });
  assert.strictEqual(L.kiemBuoc(CM, [], 'khongCo').ok, false);
});
test('thứ tự mẫu là một cách lắp hợp lệ', () => {
  const tt = L.thuTuMau(CM), daCo = [];
  assert.strictEqual(tt.length, 4);
  tt.forEach(id => { assert.ok(L.kiemBuoc(CM, daCo, id).ok, id); daCo.push(id); });
});
test('gợi ý chỉ đưa các bước lắp được ngay', () => {
  assert.deepStrictEqual(L.buocKeTiep(CM, []), ['gt']);
  assert.deepStrictEqual(L.buocKeTiep(CM, ['gt']), ['g1']);
});
test('kiểm dữ liệu: bắt id trùng, căn cứ không có, tự tham chiếu, vòng tròn, thiếu kết luận', () => {
  assert.deepStrictEqual(L.kiemDuLieu(CM), []);
  const loi = s => L.kiemDuLieu(s).join(' | ');
  assert.match(loi({ ketLuan: 'x', buoc: [{ id: 'a', chu: 'a' }, { id: 'a', chu: 'b' }] }), /id trùng/);
  assert.match(loi({ ketLuan: 'x', buoc: [{ id: 'a', chu: 'a' }, { id: 'b', chu: 'b', can: ['z'] }] }), /không có: z/);
  assert.match(loi({ ketLuan: 'x', buoc: [{ id: 'a', chu: 'a', can: ['a'] }, { id: 'b', chu: 'b' }] }), /tự làm căn cứ/);
  assert.match(loi({ ketLuan: 'x', buoc: [{ id: 'a', chu: 'a', can: ['b'] }, { id: 'b', chu: 'b', can: ['a'] }] }), /vòng tròn/);
  assert.match(loi({ buoc: [{ id: 'a', chu: 'a' }, { id: 'b', chu: 'b' }] }), /ketLuan/);
});
test('thứ tự hiện trên màn hình không bao giờ là một thứ tự lắp đúng', () => {
  const laDung = (cm, ds) => { const co = []; return ds.every(id => { const ok = L.kiemBuoc(cm, co, id).ok; co.push(id); return ok; }); };
  // Xếp theo chữ cái thì ra đúng thứ tự lắp: phải bị đảo lại
  const theoChu = { ketLuan: 'x', buoc: [{ id: 'a', chu: 'A trước' }, { id: 'b', chu: 'B sau', can: ['a'] }, { id: 'c', chu: 'C cuối', can: ['b'] }] };
  const hien = L.thuTuHien(theoChu);
  assert.strictEqual(hien.length, 3);
  assert.ok(!laDung(theoChu, hien), hien.join(','));
  // Một bước duy nhất không có căn cứ thì vẫn hiện đủ
  assert.deepStrictEqual(L.thuTuHien(CM).slice().sort(), ['bn', 'g1', 'gt', 'kl']);
});
