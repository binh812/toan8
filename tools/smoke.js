// Mở app qua file:// bằng Edge/Chrome chạy ngầm, gom lỗi console, chụp màn hình, chạy thử thao tác.
// Dùng: node tools/smoke.js "#/bai/6/tuLam" [--shot out.png] [--query nomathlive] [--eval "js"] [--full] [--width 1366]
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];

function arg(name, def) { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; }
function flag(name) { return process.argv.includes('--' + name); }

async function main() {
  const hash = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '#/';
  const exe = BROWSERS.find(p => fs.existsSync(p));
  if (!exe) throw new Error('Không tìm thấy Chrome/Edge');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: Number(arg('width', 1366)), height: Number(arg('height', 900)) });
  const problems = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') problems.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => problems.push('pageerror: ' + e.message));
  page.on('requestfailed', r => problems.push('requestfailed: ' + r.url()));
  const q = arg('query') ? '?' + arg('query') : '';
  const target = url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + q + hash;
  await page.goto(target, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, Number(arg('wait', 600))));
  const ev = arg('eval');
  if (ev) {
    const out = await page.evaluate(`(async () => { ${ev} })()`);
    if (out !== undefined) console.log('EVAL:', typeof out === 'string' ? out : JSON.stringify(out, null, 1));
    await new Promise(r => setTimeout(r, 400));
  }
  const shot = arg('shot');
  if (shot) { await page.screenshot({ path: shot, fullPage: flag('full') }); console.log('SHOT:', shot); }
  console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'CONSOLE: sạch');
  await browser.close();
  if (problems.length) process.exitCode = 2;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
