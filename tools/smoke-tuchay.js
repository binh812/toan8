// Kiểm tự chạy: mọi hình ở Khám phá/Lý thuyết có tự chạy, đang chạy thì hình đổi, chạm thì dừng, đổi trang thì tắt hết.
// Dùng: node tools/smoke-tuchay.js [id…]   (Edge/Chrome chạy ngầm; thoát mã 1 nếu có lỗi)
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
// "Dấu vân" trạng thái một khung hình: giá trị thanh trượt, toạ độ điểm JSXGraph, kích thước SVG, độ dài chữ
const VAN = `(k => [...k.querySelectorAll('input[type=range]')].map(i => i.value).join(',') + '|' +
  (window.JXG ? Object.values(JXG.boards).filter(b => k.contains(b.containerObj)).map(b => b.objectsList.filter(o => o.elType === 'point' || o.elType === 'glider').map(o => o.X().toFixed(2) + ':' + o.Y().toFixed(2)).join(',')).join('/') : '') + '|' +
  [...k.querySelectorAll('svg')].map(s => s.innerHTML.length).join(',') + '|' + k.textContent.length)`;

async function main() {
  const ids = process.argv.slice(2).map(Number).filter(Boolean);
  const exe = BROWSERS.find(p => fs.existsSync(p));
  if (!exe) throw new Error('Không tìm thấy Chrome/Edge');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, protocolTimeout: 120000 });
  const loi = [];
  let khung = 0;
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    await page.setViewport({ width: 1366, height: 1000 });
    let where = 'trang chủ';
    page.on('console', m => { if (['error', 'warn', 'warning'].includes(m.type())) loi.push(where + ' – ' + m.text()); });
    page.on('pageerror', e => loi.push(where + ' – pageerror: ' + e.message));
    await page.goto(url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + '#/', { waitUntil: 'load' });
    await sleep(400);
    const all = await page.evaluate(() => Object.keys(TOAN8.lessons).map(Number).sort((a, b) => a - b));
    for (const id of (ids.length ? ids : all)) for (const tab of ['khamPha', 'lyThuyet']) {
      where = 'bai' + id + '/' + tab;
      await page.evaluate(h => { location.hash = h; }, '#/bai/' + id + '/' + tab);
      await sleep(300);
      const n = await page.evaluate(() => document.querySelectorAll('.co-tu-chay').length);
      if (tab === 'khamPha' && !n) loi.push(where + ' – Khám phá không có hình tự chạy');
      for (let i = 0; i < n; i++) {
        khung++;
        await page.evaluate(i => document.querySelectorAll('.co-tu-chay')[i].scrollIntoView({ block: 'center' }), i);
        await sleep(500);
        const a = await page.evaluate((i, V) => eval(V)(document.querySelectorAll('.co-tu-chay')[i]), i, VAN);
        // Lấy mẫu ở các thời điểm không đều: hình chạy tuần hoàn nên một mẫu có thể trùng đúng trạng thái cũ
        let doi = false;
        for (const ms of [900, 1300, 1700]) {
          await sleep(ms);
          if (a !== await page.evaluate((i, V) => eval(V)(document.querySelectorAll('.co-tu-chay')[i]), i, VAN)) { doi = true; break; }
        }
        if (!doi) loi.push(where + ' – hình ' + (i + 1) + ': tự chạy không làm hình thay đổi');
        const box = await page.evaluate(i => { const r = document.querySelectorAll('.co-tu-chay')[i].getBoundingClientRect(); return { x: r.left + 30, y: r.top + r.height / 2 }; }, i);
        const truoc = await page.evaluate(() => TOAN8.tuChay.soDangChay());
        await page.mouse.click(box.x, box.y);
        await sleep(150);
        const sau = await page.evaluate(i => ({ n: TOAN8.tuChay.soDangChay(), nut: document.querySelectorAll('.co-tu-chay')[i].querySelector('.nut-tu-chay').textContent }), i);
        if (!(sau.n < truoc) || !/Tự chạy/.test(sau.nut)) loi.push(where + ' – hình ' + (i + 1) + ': chạm vào không dừng (' + truoc + '→' + sau.n + ', nút "' + sau.nut + '")');
      }
    }
    where = 'đổi trang';
    await page.evaluate(() => { location.hash = '#/'; });
    await sleep(200);
    if (await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('đổi trang mà tự chạy vẫn còn');
    console.log('Đã kiểm ' + khung + ' hình tự chạy.');
  } finally { await browser.close(); }
  if (loi.length) { console.log(loi.join('\n')); process.exitCode = 1; } else console.log('Không có lỗi.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
