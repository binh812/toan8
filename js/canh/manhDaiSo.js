// Mảnh đại số: hằng đẳng thức nhìn thành diện tích các mảnh. Mỗi mảnh có dinh (4 đỉnh) để cả mảnh đang xoay cũng tính được diện tích.
(function (C) {
  'use strict';
  function manh(ten, x, y, w, h, dau, mau) { return { ten: ten, x: x, y: y, w: w, h: h, dau: dau, mau: mau, dinh: C.chuNhat({ x: x, y: y, w: w, h: h }) }; }
  // a−b phải dương mới vẽ được: khi b ≥ a thì giữ b nhỏ hơn a nửa đơn vị
  function hopLe(p) { return { a: p.a, b: Math.max(0.5, Math.min(p.b, p.a - 0.5)) }; }

  function tong(p, t) {
    var a = p.a, b = p.b, g = (a + b) * 0.1 * (1 - C.muot(t / 0.8));
    var m = [manh('a2', -g, -g, a, a, 1, '--a'), manh('ab1', a + g, -g, b, a, 1, '--c'), manh('ab2', -g, a + g, a, b, 1, '--c'), manh('b2', a + g, a + g, b, b, 1, '--b')];
    if (p.trangThai === 'thieuHaiManh') m.forEach(function (x) { if (x.ten === 'ab1' || x.ten === 'ab2') x.an = true; });
    return { a: a, b: b, manh: m, khung: { w: a + b, h: a + b } };
  }
  function hieu(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b;
    var m = [manh('a2', 0, 0, a, a, 1, '--a'), manh('ab1', r, 0, b, a, -1, '--c'), manh('ab2', 0, r, a, b, -1, '--c'), manh('b2', r, r, b, b, 1, '--b')];
    m[1].hien = C.muot((t - 0.15) / 0.25); m[2].hien = C.muot((t - 0.4) / 0.25); m[3].hien = C.muot((t - 0.7) / 0.25);
    return { a: a, b: b, manh: m, khung: { w: a, h: a }, conLai: { x: 0, y: 0, w: r, h: r } };
  }
  function hieuHaiBP(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b, k = C.muot((t - 0.25) / 0.6);
    // Mảnh dưới (rộng a−b, cao b) xoay 90° sang bên phải mảnh trên
    var tx = C.noiSuy(r / 2, a + b / 2, k), ty = C.noiSuy(r + b / 2, r / 2, k), goc = k * Math.PI / 2;
    var cs = Math.cos(goc), sn = Math.sin(goc);
    var dinh = [[-r / 2, -b / 2], [r / 2, -b / 2], [r / 2, b / 2], [-r / 2, b / 2]].map(function (d) { return [tx + d[0] * cs - d[1] * sn, ty + d[0] * sn + d[1] * cs]; });
    return { a: a, b: b, manh: [manh('tren', 0, 0, a, r, 1, '--a'), { ten: 'duoi', dau: 1, mau: '--b', dinh: dinh }],
      khung: { w: a + b, h: a }, lo: { x: r, y: r, w: b, h: b, hien: 1 - C.muot(t / 0.2) } };
  }
  C.dangKi('manhVuong', {
    thamSo: { a: { min: 1, max: 6, step: 0.5, md: 4, nhan: 'Cạnh a', mau: '--a' }, b: { min: 1, max: 6, step: 0.5, md: 2, nhan: 'Cạnh b', mau: '--b' } },
    trangThai: { thieuHaiManh: true },
    tinh: function (p, t, o) {
      var dang = (o && o.dang) || 'tong';
      if (dang === 'tong') return tong(p, t);
      if (dang === 'hieu') return hieu(p, t);
      if (dang === 'hieuHaiBP') return hieuHaiBP(p, t);
      throw new Error('manhVuong: dạng lạ ' + dang);
    }
  });
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
