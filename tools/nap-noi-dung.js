// Nạp một file nội dung (content/baiNN.js, content/luyen/*.js, content/nen/*.js) trong môi trường riêng, thu các lời gọi
// TOAN8.bai / TOAN8.luyen / TOAN8.nen. Dùng chung cho validate-content.js và dump-luyen.js.
const fs = require('fs'), path = require('path'), vm = require('vm');
const FIGURE = path.join(__dirname, '..', 'js', 'widgets', 'figure.js');

function loadFile(file) {
  const lessons = [], luyen = [], nen = [];
  const ctx = { TOAN8: {
    bai: def => lessons.push(def),
    luyen: (id, dang, opts) => luyen.push({ id, dang, deCo: (opts && opts.deCo) || [] }),
    nen: def => nen.push(def)
  }, console };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(FIGURE, 'utf8'), ctx, { filename: FIGURE }); // TOAN8.hinhTinh, TOAN8.hh dùng lúc nạp bài
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return { lessons, luyen, nen };
}
module.exports = { loadFile };
