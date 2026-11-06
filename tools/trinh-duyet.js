// Chọn trình duyệt cho các công cụ kiểm: CHROME_PATH (máy CI) trước, rồi Edge/Chrome trên Windows.
const fs = require('fs');
const CAC_DUONG = [process.env.CHROME_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium-browser'].filter(Boolean);
function timTrinhDuyet() { return CAC_DUONG.find(p => fs.existsSync(p)); }
// Máy CI chạy bằng tài khoản không có sandbox của Chrome
function thamSoChay() { return process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []; }
module.exports = { timTrinhDuyet, thamSoChay };
