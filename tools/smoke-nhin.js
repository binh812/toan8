// Kiểm trang "Nhìn là hiểu" bằng thao tác thật: gõ đáp án đúng, sai, lạ và xem hình phản ứng; bài chưa có nhin vẫn như cũ.
// Dùng: node tools/smoke-nhin.js [--shot thư-mục]   (chạy ở chế độ ô nhập chữ để gõ được công thức)
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const si = process.argv.indexOf('--shot'), thuMuc = si > 0 ? process.argv[si + 1] : null;
  const exe = BROWSERS.find(p => fs.existsSync(p));
  if (!exe) throw new Error('Không tìm thấy Chrome/Edge');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true });
  const loi = [];
  const can = (dk, msg) => { if (!dk) loi.push(msg); };
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 1000 });
    page.on('console', m => { if (['error', 'warn', 'warning'].includes(m.type())) loi.push('console: ' + m.text()); });
    page.on('pageerror', e => loi.push('pageerror: ' + e.message));
    page.on('requestfailed', r => loi.push('tải lỗi: ' + r.url()));
    const goc = url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + '?nomathlive';
    await page.goto(goc + '#/', { waitUntil: 'load' });
    const moBai = async h => { await page.evaluate(x => { location.hash = x; }, h); await sleep(300); };
    // Gõ vào câu thứ i của một phần, bấm Kiểm tra, trả về lời nhắc và chữ trong hình
    const go = async (phan, gt, i = 0) => {
      await page.evaluate((phan, gt, i) => {
        const q = document.querySelectorAll(phan + ' .q')[i], o = q.querySelector('.q-input input');
        o.value = gt; o.dispatchEvent(new Event('input', { bubbles: true }));
        [...q.querySelectorAll('.q-input button')].pop().click();
      }, phan, gt, i);
      await sleep(80);
      return page.evaluate((phan, i) => {
        const goi = phan === '.nhin-dung' ? document.querySelector(phan) : document.querySelectorAll(phan + ' .nhin-the')[i];
        const tin = goi.querySelector('.nhin-tin');
        return { lop: tin.className, tin: tin.textContent, hinh: goi.querySelector('svg.c-svg').textContent };
      }, phan, i);
    };
    const chup = async ten => { if (thuMuc) await page.screenshot({ path: path.join(thuMuc, ten + '.png'), fullPage: true }); };

    // Bài 6: hình chỉ đúng mảnh còn thiếu
    await moBai('#/bai/6/khamPha');
    can(await page.evaluate(() => ['.nhin-nhin', '.nhin-dung', '.nhin-suy-ra'].every(s => document.querySelector(s))), 'bài 6 thiếu phần');
    can(await page.evaluate(() => document.querySelector('.tabs a').textContent.includes('Nhìn là hiểu')), 'bài 6: tab chưa đổi tên');
    can(await page.evaluate(() => [...document.querySelectorAll('.muc-h')].some(e => e.textContent === 'Tự kéo thử')), 'bài 6 mất phần Tự kéo thử');
    let r = await go('.nhin-dung', 'x^2+25');
    can(/sai/.test(r.lop) && (r.hinh.match(/thiếu/g) || []).length === 2, 'x²+25 phải hiện thiếu hai mảnh: ' + JSON.stringify(r));
    can(await page.evaluate(() => !document.querySelector('.nhin-dung .hinh-loi')), 'phần Dùng đã có hình lớn, không được hiện thêm hình lỗi');
    await chup('6-sai');
    r = await go('.nhin-dung', 'x^2+5x+25');
    can((r.hinh.match(/thiếu/g) || []).length === 1, 'x²+5x+25 phải hiện thiếu một mảnh: ' + JSON.stringify(r));
    for (const gt of ['x^2+10x+25', 'x²+10x+25', '25+10x+x^2']) {
      r = await go('.nhin-dung', gt);
      can(/dung/.test(r.lop) && !/thiếu/.test(r.hinh), gt + ' phải đúng và không còn báo thiếu: ' + JSON.stringify(r));
    }
    r = await go('.nhin-dung', 'abc');
    can(!/thiếu/.test(r.hinh), 'gõ chữ lạ không được làm hình báo thiếu');
    can(await page.evaluate(() => { const h = document.querySelectorAll('.nhin-the svg.c-svg')[1].textContent; return /100/.test(h) && !/99/.test(h); }), '99²: chưa cắt thì hình phải ghi cạnh 100, chưa được lộ 99');
    r = await go('.nhin-suy-ra', '2500', 0);
    can(/sai/.test(r.lop), '52·48 = 2500 phải sai');
    r = await go('.nhin-suy-ra', '2496', 0);
    can(/dung/.test(r.lop), '52·48 = 2496 phải đúng');
    await page.evaluate(() => document.querySelector('.nhin-the button.btn.ghost').click());
    await sleep(1500);
    await chup('6-dung');

    // Bài 35: hình vẽ đúng độ cao em gõ; số lạ không làm hỏng
    await moBai('#/bai/35/khamPha');
    r = await go('.nhin-dung', '6,96');
    can(/h = 6,96/.test(r.hinh) && /cao hơn cả/.test(r.tin), '6,96 phải vẽ lên hình và báo cao hơn thang: ' + JSON.stringify(r));
    await chup('35-sai');
    r = await go('.nhin-dung', '5');
    can(/h = 5/.test(r.hinh) && /5{,}|chỉ cần dài/.test(r.tin), '5 phải báo chiều dài thang: ' + JSON.stringify(r));
    for (const gt of ['-1', '0', '9999', 'abc', 'sqrt(48.5)']) {
      r = await go('.nhin-dung', gt);
      can(!/NaN|undefined/.test(r.hinh + r.tin), gt + ' sinh NaN/undefined');
    }
    r = await go('.nhin-dung', 'sqrt(48.5)');
    can(!/h = 48/.test(r.hinh), 'sqrt(48.5) không được đọc thành 48,5');
    r = await go('.nhin-dung', '6');
    can(/dung/.test(r.lop) && !/h = /.test(r.hinh) && /36/.test(r.hinh), '6 phải đúng, xoá nét thử, hiện 36: ' + JSON.stringify(r));
    for (const [i, gt] of [[0, '12'], [1, '5'], [2, '10']]) { r = await go('.nhin-suy-ra', gt, i); can(/dung/.test(r.lop), 'suy ra bài 35 câu ' + i + ' phải đúng: ' + JSON.stringify(r)); }
    await chup('35-dung');

    // Bài 25: cân nghiêng theo số em gõ; vô nghiệm thì lệch
    await moBai('#/bai/25/khamPha');
    r = await go('.nhin-dung', '4');
    can(/≠/.test(r.hinh) && /sai/.test(r.lop), 'x = 4 phải làm cân lệch: ' + JSON.stringify(r));
    await chup('25-sai');
    r = await go('.nhin-dung', 'x = 3');
    can(/dung/.test(r.lop) && !/≠/.test(r.hinh), 'x = 3 phải cân thăng bằng: ' + JSON.stringify(r));
    r = await go('.nhin-suy-ra', 'vô nghiệm', 1);
    can(/dung/.test(r.lop) && /≠/.test(r.hinh), 'bài 25.8 vô nghiệm: ' + JSON.stringify(r));
    can(await page.evaluate(() => /Hai đĩa là hai vế nào/.test(document.querySelectorAll('.nhin-suy-ra .nhin-the')[2].textContent)), 'đề lời văn phải giấu cân lúc đầu');
    await chup('25-dung');

    // Ví dụ: bước tiếp đưa hình tiến; câu Tự làm có hình lời giải ở gợi ý cuối
    await moBai('#/bai/6/viDu');
    const vanVD = () => page.evaluate(() => document.querySelectorAll('.vidu')[1].querySelector('svg.c-svg').innerHTML);
    const v0 = await vanVD();
    await page.evaluate(() => document.querySelectorAll('.vidu')[1].querySelector('.stepper-actions button').click());
    can(v0 !== await vanVD(), 'bài 6 ví dụ 2: bấm Bước tiếp mà hình không đổi');
    await moBai('#/bai/6/tuLam');
    const soHinh = () => page.evaluate(() => document.querySelector('.q').querySelectorAll('.hinh-giai svg').length);
    can(await soHinh() === 0, 'hình lời giải hiện quá sớm');
    const hetGoiY = await page.evaluate(() => { const q = document.querySelector('.q'), n = q.querySelector('.q-actions button'); let lan = 0; while (!n.disabled && lan++ < 8) n.click(); return lan; });
    can(hetGoiY > 1 && await soHinh() === 1, 'hình lời giải phải hiện đúng một lần');
    r = await page.evaluate(() => {
      const q = document.querySelector('.q'), o = q.querySelector('.q-input input');
      o.value = 'x^2+25'; o.dispatchEvent(new Event('input', { bubbles: true }));
      [...q.querySelectorAll('.q-input button')].pop().click();
      return q.querySelectorAll('.hinh-loi svg').length;
    });
    can(r === 1, 'lỗi thường gặp x²+25 phải hiện hình');

    // Giao diện: phông riêng có đủ dấu tiếng Việt, không tải file nào lỗi; thẻ bài có hình nhỏ
    await moBai('#/');
    await page.evaluate(() => document.fonts.ready);
    const phong = await page.evaluate(() => {
      const co = (f) => document.fonts.check(f + ' "Be Vietnam Pro"', 'Pythagore ấ ệ đ ơ ữ') && [...document.fonts].some(x => x.family.includes('Be Vietnam Pro') && x.status === 'loaded');
      return { than: co('400 18px'), body: getComputedStyle(document.body).fontFamily, tieuDe: getComputedStyle(document.querySelector('h1')).fontFamily };
    });
    can(phong.than && /Be Vietnam Pro/.test(phong.body), 'phông thân chưa nạp: ' + JSON.stringify(phong));
    can(/Bricolage/.test(phong.tieuDe), 'phông tiêu đề chưa dùng: ' + phong.tieuDe);
    can(await page.evaluate(() => !!document.querySelector('a[href="#/bai/35/khamPha"] .hinh-nho svg') && !document.querySelector('a[href="#/bai/1/khamPha"] .hinh-nho')), 'thẻ bài 35 phải có hình nhỏ, bài 1 thì không');
    await chup('trang-chu');

    // Khổ hẹp: không tràn ngang
    await page.setViewport({ width: 400, height: 800 });
    for (const h of ['#/', '#/bai/6/khamPha', '#/bai/35/khamPha', '#/bai/25/khamPha', '#/bai/6/viDu']) {
      await moBai(h);
      const rong = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      can(rong[0] <= rong[1], h + ' tràn ngang ở 400px: ' + rong);
    }
    await page.setViewport({ width: 1366, height: 1000 });

    // Bài chưa có nhin giữ nguyên
    await moBai('#/bai/1/khamPha');
    can(await page.evaluate(() => document.querySelector('.tabs a').textContent.includes('Khám phá') && !document.querySelector('.nhin-nhin')), 'bài 1 phải giữ nguyên Khám phá');

    console.log('Đã kiểm bài 6, 35, 25 và bài 1.');
  } finally { await browser.close(); }
  if (loi.length) { console.log(loi.join('\n')); process.exitCode = 1; } else console.log('Không có lỗi.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
