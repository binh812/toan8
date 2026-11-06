// Mở mọi bài đã có nội dung × 5 tab, báo lỗi console/trang và công thức KaTeX lỗi. Thoát mã 1 nếu có lỗi.
// Dùng: node tools/smoke-all.js [--query nomathlive]
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const TABS = ['khamPha', 'lyThuyet', 'viDu', 'tuLam', 'timLoi', 'luyenThem'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const qi = process.argv.indexOf('--query');
  const q = qi > 0 ? '?' + process.argv[qi + 1] : '';
  const exe = require('./trinh-duyet.js').timTrinhDuyet();
  if (!exe) throw new Error('Không tìm thấy Chrome/Edge');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: require('./trinh-duyet.js').thamSoChay(), protocolTimeout: 60000 });
  const issues = [];
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    await page.setViewport({ width: 1366, height: 900 });
    let where = 'trang chủ';
    page.on('console', async m => {
      if (!['error', 'warn', 'warning'].includes(m.type())) return;
      const w = where; // ghi lại nơi xảy ra trước khi chờ đọc chi tiết
      // in cả ngăn xếp lỗi (m.text() chỉ ra "JSHandle@error" khi đối số là đối tượng Error)
      const chiTiet = await Promise.all(m.args().map(a => a.evaluate(x => (x && x.stack ? x.stack.split('\n').slice(0, 3).join(' | ') : String(x))).catch(() => '?')));
      issues.push(w + ' – ' + m.type() + ': ' + chiTiet.join(' '));
    });
    page.on('pageerror', e => issues.push(where + ' – pageerror: ' + e.message));
    page.on('requestfailed', r => issues.push(where + ' – requestfailed: ' + r.url()));
    const base = url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + q;
    await page.goto(base + '#/', { waitUntil: 'load' });
    await sleep(500);
    const ids = await page.evaluate(() => Object.keys(TOAN8.lessons).map(Number).sort((a, b) => a - b));
    let pages = 0;
    for (const id of ids) {
      for (const tab of TABS) {
        where = 'bai' + id + '/' + tab;
        await page.evaluate(h => { location.hash = h; }, '#/bai/' + id + '/' + tab);
        await sleep(250);
        const r = await page.evaluate(() => ({
          katex: document.querySelectorAll('.katex-error').length,
          err: [...document.querySelectorAll('.err')].map(e => e.textContent),
          empty: document.querySelector('.tab-body') ? document.querySelector('.tab-body').children.length : -1
        }));
        if (r.katex) issues.push(where + ' – ' + r.katex + ' công thức KaTeX lỗi');
        r.err.forEach(t => issues.push(where + ' – ' + t));
        if (r.empty <= 0) issues.push(where + ' – tab trống');
        pages++;
      }
    }
    // bài nền, kiểm tra đầu chương, phiếu in, ôn tập cuối năm
    const them = await page.evaluate(() => Object.keys(TOAN8.nenBai || {}).map(id => '#/nen/' + id)
      .concat(TOAN8.mucLuc.filter(c => c.kiemTra).map(c => '#/kiem-tra/' + c.so))
      .concat(['#/phieu/bai-6/1', '#/phieu/cuoi-nam-1.2.3.4.5.6.7.8.9.10/1', '#/on-tap-cuoi-nam', '#/on-tap']));
    for (const h of them) {
      where = h;
      await page.evaluate(x => { location.hash = x; }, h);
      await sleep(300);
      const r = await page.evaluate(() => ({ katex: document.querySelectorAll('.katex-error').length, err: [...document.querySelectorAll('.err')].map(e => e.textContent) }));
      if (r.katex) issues.push(where + ' – ' + r.katex + ' công thức KaTeX lỗi');
      r.err.forEach(t => issues.push(where + ' – ' + t));
      pages++;
    }
    console.log('Đã mở ' + ids.length + ' bài, ' + pages + ' trang' + (q ? ' (' + q + ')' : '') + '.');
  } finally {
    await browser.close();
  }
  if (issues.length) { console.log(issues.join('\n')); process.exitCode = 1; }
  else console.log('Không có lỗi.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
