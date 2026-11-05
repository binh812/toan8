// Lõi cảnh hình động. Mỗi cảnh có tinh (thuần toán, chạy được trong Node) và ve (vẽ SVG).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.canh = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var ds = {}, NS = 'http://www.w3.org/2000/svg';

  function dangKi(ten, canh) {
    if (Object.prototype.hasOwnProperty.call(ds, ten)) throw new Error('Cảnh trùng tên: ' + ten);
    ds[ten] = canh;
  }
  function lay(ten) {
    if (!Object.prototype.hasOwnProperty.call(ds, ten)) throw new Error('Không có cảnh: ' + ten);
    return ds[ten];
  }
  function kep(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function muot(x) { x = kep(x, 0, 1); return x * x * (3 - 2 * x); }
  function noiSuy(a, b, k) { return a + (b - a) * k; }
  function chuNhat(r) { return [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]]; }
  // Dấu phẩy thập phân như trong SGK: 42.25 → "42,25"
  function fmt(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

  // Tiện ích vẽ, chỉ dùng trong ve (cần trình duyệt)
  function mk(tag, at, cha, noiDung) {
    var e = document.createElementNS(NS, tag);
    for (var k in at) if (at[k] != null) e.setAttribute(k, at[k]);
    if (noiDung !== undefined) e.textContent = noiDung;
    if (cha) cha.appendChild(e);
    return e;
  }
  function diem(p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); }
  function chu(cha, x, y, s, co, mau, them) {
    var at = { x: x, y: y, 'font-size': co, class: 'c-chu', style: mau ? 'fill:var(' + mau + ')' : null };
    for (var k in them || {}) at[k] = them[k];
    return mk('text', at, cha, s);
  }
  return { dangKi: dangKi, lay: lay, kep: kep, muot: muot, noiSuy: noiSuy, chuNhat: chuNhat, fmt: fmt, mk: mk, diem: diem, chu: chu };
});
