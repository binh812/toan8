// Mảnh đại số: hằng đẳng thức nhìn thành diện tích các mảnh. Mỗi mảnh có dinh (4 đỉnh) để cả mảnh đang xoay cũng tính được diện tích.
(function (C) {
  'use strict';
  function manh(ten, x, y, w, h, dau, mau) { return { ten: ten, x: x, y: y, w: w, h: h, dau: dau, mau: mau, dinh: C.chuNhat({ x: x, y: y, w: w, h: h }) }; }
  // a−b phải dương mới vẽ được: khi b ≥ a thì giữ b nhỏ hơn a nửa đơn vị
  function hopLe(p) { return { a: p.a, b: Math.max(0.5, Math.min(p.b, p.a - 0.5)) }; }

  function tong(p, t) {
    var a = p.a, b = p.b, g = (a + b) * 0.1 * (1 - C.muot(t / 0.8));
    var m = [manh('a2', -g, -g, a, a, 1, '--a'), manh('ab1', a + g, -g, b, a, 1, '--cc'), manh('ab2', -g, a + g, a, b, 1, '--cc'), manh('b2', a + g, a + g, b, b, 1, '--b')];
    if (p.trangThai === 'thieuHaiManh') m.forEach(function (x) { if (x.ten === 'ab1' || x.ten === 'ab2') x.an = true; });
    return { a: a, b: b, manh: m, khung: { w: a + b, h: a + b } };
  }
  function hieu(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b;
    var m = [manh('a2', 0, 0, a, a, 1, '--a'), manh('ab1', r, 0, b, a, -1, '--cc'), manh('ab2', 0, r, a, b, -1, '--cc'), manh('b2', r, r, b, b, 1, '--b')];
    m[1].hien = C.muot((t - 0.15) / 0.25); m[2].hien = C.muot((t - 0.4) / 0.25); m[3].hien = C.muot((t - 0.7) / 0.25);
    return { a: a, b: b, manh: m, khung: { w: a, h: a }, conLai: { x: 0, y: 0, w: r, h: r } };
  }
  function hieuHaiBP(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b, k = C.muot((t - 0.25) / 0.6);
    // Mảnh dưới (rộng a−b, cao b) xoay 90° sang bên phải mảnh trên
    // Trượt ngang ra khỏi mảnh trên trước, rồi mới xoay và nhấc lên, để hai mảnh không đè nhau
    var ngang = C.muot(k / 0.5), xoay = C.muot((k - 0.5) / 0.5);
    var tx = C.noiSuy(r / 2, a + b / 2, ngang), ty = C.noiSuy(r + b / 2, r / 2, xoay), goc = xoay * Math.PI / 2;
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

  /* ---------- Phần vẽ ---------- */
  function veManh(svg, m, co, nhan, them) {
    var g = C.mk('g', them || {}, svg);
    C.mk('polygon', { points: C.diem(m.dinh), fill: 'var(' + m.mau + ')', 'fill-opacity': 0.3, stroke: 'var(--muc)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, g);
    if (nhan) {
      var x = 0, y = 0; m.dinh.forEach(function (q) { x += q[0] / 4; y += q[1] / 4; });
      C.chu(g, x, y, nhan, co, m.mau);
    }
    return g;
  }
  C.lay('manhVuong').ve = function (svg, k, p, t, o) {
    var dang = o.dang || 'tong', nh = o.nhan || {}, tenA = o.tenA || 'a', tenB = o.tenB || 'b', a = k.a, b = k.b;
    var ab = nh.ab || (tenA + tenB), a2 = nh.a2 || (tenA + '²'), b2 = nh.b2 || (tenB + '²');
    var rong = k.khung.w, cao = k.khung.h, l = Math.max(rong, cao), lech = dang === 'tong' ? 0.1 * l : 0, d = 0.14 * l + lech, co = 0.06 * l;
    svg.setAttribute('viewBox', [-d, -d, rong + 2 * d, cao + 2 * d].join(' '));
    var nhCanh = { 'font-style': 'italic' };
    if (dang === 'tong') {
      k.manh.forEach(function (m) {
        var chu = m.ten === 'a2' ? a2 : m.ten === 'b2' ? b2 : ab;
        if (!m.an) { veManh(svg, m, co, chu); return; }
        // Mảnh bị thiếu: chỉ còn viền đứt, để thấy ngay chỗ trống
        C.mk('polygon', { points: C.diem(m.dinh), fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4' }, svg);
        var x = 0, y = 0; m.dinh.forEach(function (q) { x += q[0] / 4; y += q[1] / 4; });
        C.chu(svg, x, y, 'thiếu ' + chu, co * 0.85, '--sai');
      });
      var g = lech * (1 - C.muot(t / 0.8));
      C.chu(svg, a / 2, -g - d * 0.35, tenA, co, '--a', nhCanh);
      C.chu(svg, a + g + b / 2, -g - d * 0.35, tenB, co, '--b', nhCanh);
      C.chu(svg, -g - d * 0.35, a / 2, tenA, co, '--a', nhCanh);
      C.chu(svg, -g - d * 0.35, a + g + b / 2, tenB, co, '--b', nhCanh);
    } else if (dang === 'hieu') {
      veManh(svg, k.manh[0], co, null);
      var r = k.conLai.w;
      k.manh.slice(1, 3).forEach(function (m) {
        var mo = C.mk('g', { opacity: m.hien }, svg);
        C.mk('polygon', { points: C.diem(m.dinh), fill: 'var(--mat)', 'fill-opacity': 0.75, stroke: 'var(--sai)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4' }, mo);
      });
      var b2m = k.manh[3];
      veManh(svg, b2m, co * 0.8, '+' + b2, { opacity: b2m.hien });
      C.chu(svg, r / 2, -d * 0.35, nh.hieu || (tenA + '−' + tenB), co, '--a', nhCanh);
      C.chu(svg, r + b / 2, -d * 0.35, tenB, co, '--b', Object.assign({ opacity: k.manh[1].hien }, nhCanh));
      C.chu(svg, r + b / 2, r / 2, '−' + ab, co * 0.8, '--sai', { opacity: k.manh[1].hien });
      C.chu(svg, r / 2, r + b / 2, '−' + ab, co * 0.8, '--sai', { opacity: k.manh[2].hien });
      C.chu(svg, r / 2, r / 2, a2, co, '--a', { opacity: 1 - C.muot((t - 0.8) / 0.2) });
      var mc = C.muot((t - 0.8) / 0.2);
      C.mk('rect', { width: r, height: r, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke', opacity: mc }, svg);
      C.chu(svg, r / 2, r / 2, '(' + (nh.hieu || (tenA + '−' + tenB)) + ')²', co, '--a', { opacity: mc });
    } else {
      var lo = k.lo, xa = a - b, ket = C.muot((t - 0.85) / 0.15);
      C.mk('rect', { x: lo.x, y: lo.y, width: lo.w, height: lo.h, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4', opacity: lo.hien }, svg);
      C.chu(svg, lo.x + lo.w / 2, lo.y + lo.h / 2, 'bỏ ' + b2, co * 0.8, '--sai', { opacity: lo.hien });
      k.manh.forEach(function (m) { veManh(svg, m, co, null); });
      C.chu(svg, a / 2, -d * 0.35, tenA, co, '--a', Object.assign({ opacity: 1 - ket }, nhCanh));
      C.chu(svg, (a + b) / 2, -d * 0.35, nh.tong || (tenA + '+' + tenB), co, '--muc', Object.assign({ opacity: ket }, nhCanh));
      C.chu(svg, -d * 0.45, xa / 2, nh.hieu || (tenA + '−' + tenB), co, '--muc', nhCanh);
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
