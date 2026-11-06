// Tạo anh-chia-se.png (1200 × 630) cho thẻ xem trước khi gửi link qua Zalo/Facebook: chụp phần đầu trang chủ.
const path = require('path'), url = require('url'), puppeteer = require('puppeteer-core');
const { timTrinhDuyet, thamSoChay } = require('./trinh-duyet.js');
(async () => {
  const b = await puppeteer.launch({ executablePath: timTrinhDuyet(), headless: true, args: thamSoChay() });
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630 });
  await p.goto(url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + '#/', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    const h = document.querySelector('.hero h1'), q = document.querySelector('.hero p');
    if (h) h.textContent = 'Toán 8 – Nhìn là hiểu';
    if (q) q.textContent = 'Mỗi bài bắt đầu từ một hình cho thấy vì sao công thức đúng. Đủ 39 bài theo SGK Kết nối tri thức.';
    document.querySelectorAll('.hero-nut').forEach(e => e.remove());
  });
  await new Promise(r => setTimeout(r, 400));
  await p.screenshot({ path: path.join(__dirname, '..', 'anh-chia-se.png') });
  await b.close();
  console.log('Đã tạo anh-chia-se.png');
})();
