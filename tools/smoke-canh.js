// Kiểm cảnh hình động trong trình duyệt: mỗi cảnh ở t=0, t=.5, t=1 vẽ được, không có NaN, nằm trong khung; tự chạy, chạm là dừng, đổi trang là tắt.
// Dùng: node tools/smoke-canh.js [--shot thư-mục]
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CAU_HINH = [
  { ten: 'toHopHinhVuong' },
  { ten: 'toHopHinhVuong', thamSo: { a: 1, b: 6 } },
  { ten: 'toHopHinhVuong', thamSo: { a: 6, b: 6 } },
  { ten: 'baHinhVuong', tuyChon: { a: 2.5, c: 6.5, tenThang: 'thang' } },
  { ten: 'baHinhVuong', tuyChon: { a: 2.5, c: 6.5 }, thamSo: { thu: 6.96 } },
  { ten: 'baHinhVuong', tuyChon: { a: 2.5, c: 6.5 }, thamSo: { thu: 9999 } },
  { ten: 'tamGiacAn', tuyChon: { mau: 'hcn', rong: 9, cheo: 15 } },
  { ten: 'tamGiacAn', tuyChon: { mau: 'can', cao: 4, day: 6 } },
  { ten: 'tamGiacAn', tuyChon: { mau: 'taxi', d1: 5, d2: 8, d3: 1 } },
  { ten: 'manhVuong', tuyChon: { dang: 'tong' } },
  { ten: 'manhVuong', tuyChon: { dang: 'tong', tenA: 'x', tenB: '5', nhan: { a2: 'x²', ab: '5x', b2: '25' } }, thamSo: { a: 5, b: 3, trangThai: 'thieuHaiManh' } },
  { ten: 'manhVuong', tuyChon: { dang: 'hieu' } },
  { ten: 'manhVuong', tuyChon: { dang: 'hieuHaiBP' } },
  { ten: 'manhVuong', tuyChon: { dang: 'hieuHaiBP' }, thamSo: { a: 2, b: 5 } },
  { ten: 'caiCan', tuyChon: { trai: { x: 4, so: -12 }, phai: { x: 0, so: 0 } } },
  { ten: 'caiCan', tuyChon: { trai: { x: 4, so: -12 }, phai: { x: 0, so: 0 } }, thamSo: { thu: 9999 } },
  { ten: 'caiCan', tuyChon: { trai: { x: 5, so: 10 }, phai: { x: 0, so: 50 } } },
  { ten: 'caiCan', tuyChon: { trai: { x: -2, so: 7 }, phai: { x: 0, so: 0 } } },
  { ten: 'caiCan', tuyChon: { trai: { x: 1, so: 6 }, phai: { x: 1, so: 5 } } },
  { ten: 'caiCan', tuyChon: { trai: { x: 3, so: 2 }, phai: { x: 1, so: 6 }, buoc: [{ trai: { x: 2, so: 2 }, phai: { x: 0, so: 6 } }, { trai: { x: 2, so: 0 }, phai: { x: 0, so: 4 } }, { trai: { x: 1, so: 0 }, phai: { x: 0, so: 2 } }] } }
];

async function main() {
  const si = process.argv.indexOf('--shot'), thuMuc = si > 0 ? process.argv[si + 1] : null;
  const exe = BROWSERS.find(p => fs.existsSync(p));
  if (!exe) throw new Error('Không tìm thấy Chrome/Edge');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true });
  const loi = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 1000 });
    page.on('console', m => { if (['error', 'warn', 'warning'].includes(m.type())) loi.push('console: ' + m.text()); });
    page.on('pageerror', e => loi.push('pageerror: ' + e.message));
    await page.goto(url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + '#/', { waitUntil: 'load' });
    await sleep(300);
    for (let i = 0; i < CAU_HINH.length; i++) {
      const kq = await page.evaluate(c => {
        const T = TOAN8, ra = [], hop = document.createElement('div');
        hop.style.cssText = 'position:fixed;left:0;top:0;width:640px;background:#fff;z-index:99';
        document.body.appendChild(hop);
        const w = T.widgets.canh(hop, Object.assign({}, c, { tuChay: false }));
        [0, .5, 1].forEach(t => {
          w.datT(t);
          const svg = hop.querySelector('svg.c-svg'), vb = svg.viewBox.baseVal;
          if (!svg.children.length) ra.push('t=' + t + ' không vẽ gì');
          if (/NaN|Infinity|undefined/.test(svg.outerHTML)) ra.push('t=' + t + ' có NaN/undefined');
          const g = svg.getBBox();
          if (g.x < vb.x - .01 || g.y < vb.y - .01 || g.x + g.width > vb.x + vb.width + .01 || g.y + g.height > vb.y + vb.height + .01)
            ra.push('t=' + t + ' tràn khung: bbox ' + [g.x, g.y, g.width, g.height].map(v => v.toFixed(2)) + ' viewBox ' + [vb.x, vb.y, vb.width, vb.height].map(v => v.toFixed(2)));
        });
        w.datT(.5);
        return { ra, id: (hop.id = 'phong-' + Date.now()) };
      }, CAU_HINH[i]);
      kq.ra.forEach(s => loi.push(CAU_HINH[i].ten + ' #' + i + ': ' + s));
      if (thuMuc) { const e = await page.$('#' + kq.id); await e.screenshot({ path: path.join(thuMuc, 'canh-' + i + '.png') }); }
      await page.evaluate(id => document.getElementById(id).remove(), kq.id);
    }
    // Tự chạy: t đổi; chạm thật thì dừng; đổi trang thì tắt
    await page.evaluate(() => {
      const hop = document.createElement('div'); hop.id = 'hop-chay';
      hop.style.cssText = 'position:fixed;left:0;top:0;width:640px;background:#fff;z-index:99';
      document.body.appendChild(hop);
      window.__w = TOAN8.widgets.canh(hop, { ten: 'toHopHinhVuong', buoc: [{ t: 0, chu: 'Đầu' }, { t: 1, chu: 'Cuối' }] });
    });
    await sleep(2200);
    const t1 = await page.evaluate(() => __w.layT()); await sleep(800);
    const t2 = await page.evaluate(() => __w.layT());
    if (t1 === t2) loi.push('tự chạy không làm t đổi (' + t1 + ')');
    if (!await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('cảnh không đăng kí tự chạy');
    const box = await page.evaluate(() => { const r = document.querySelector('#hop-chay svg.c-svg').getBoundingClientRect(); return { x: r.left + 30, y: r.top + 60 }; });
    await page.mouse.click(box.x, box.y); await sleep(120);
    if (await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('chạm vào hình không dừng');
    const t3 = await page.evaluate(() => __w.layT()); await sleep(400);
    if (t3 !== await page.evaluate(() => __w.layT())) loi.push('đã dừng mà t vẫn đổi');
    await page.evaluate(() => { __w.datThamSo({ a: 1, b: 6 }); __w.datT(1); __w.datThamSo({ a: 6, b: 1 }); document.querySelector('#hop-chay .nut-tu-chay').click(); });
    await sleep(200);
    if (!await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('nút Tự chạy không bật lại');
    await page.evaluate(() => { location.hash = '#/bai/1/khamPha'; }); await sleep(250);
    await page.evaluate(() => { location.hash = '#/'; }); await sleep(250);
    if (await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('đổi trang mà cảnh vẫn chạy');
    console.log('Đã kiểm ' + CAU_HINH.length + ' cấu hình cảnh.');
  } finally { await browser.close(); }
  if (loi.length) { console.log(loi.join('\n')); process.exitCode = 1; } else console.log('Không có lỗi.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
