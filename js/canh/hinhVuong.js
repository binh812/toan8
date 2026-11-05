// Các cảnh quanh định lí Pythagore: bốn tam giác trượt trong khung, ba hình vuông trên ba cạnh, tam giác vuông nấp trong đề.
(function (C) {
  'use strict';
  C.dangKi('toHopHinhVuong', {
    thamSo: { a: { min: 1, max: 6, step: 0.5, md: 3, nhan: 'Cạnh a', mau: '--a' }, b: { min: 1, max: 6, step: 0.5, md: 4, nhan: 'Cạnh b', mau: '--b' } },
    tinh: function (p, t) {
      var a = p.a, b = p.b, s = a + b;
      // Mỗi tam giác chỉ tịnh tiến; trượt lần lượt để mắt theo kịp và không đè lên nhau
      var goc = [
        { p: [[0, 0], [a, 0], [0, b]], d: [0, a], tu: 0.6 },
        { p: [[s, 0], [s, a], [a, 0]], d: [0, 0], tu: 0 },
        { p: [[s, s], [b, s], [s, a]], d: [-b, 0], tu: 0.3 },
        { p: [[0, s], [0, b], [b, s]], d: [a, -b], tu: 0 }
      ];
      var tamGiac = goc.map(function (g) {
        var k = C.muot((t - g.tu) / 0.4);
        return g.p.map(function (q) { return [q[0] + g.d[0] * k, q[1] + g.d[1] * k]; });
      });
      return { a: a, b: b, s: s, tamGiac: tamGiac, oC: [[a, 0], [s, a], [b, s], [0, b]],
        oA: { x: 0, y: 0, w: a, h: a }, oB: { x: a, y: a, w: b, h: b }, phanTrong: s * s - 2 * a * b };
    }
  });

  C.dangKi('baHinhVuong', {
    tinh: function (p, t, o) {
      var a = o.a, c = o.c, h = Math.sqrt(c * c - a * a);
      var hopLe = typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0;
      return { a: a, c: c, h: h, dienTich: { a: a * a, c: c * c, h: c * c - a * a },
        thu: hopLe ? { h: p.thu, dai: Math.sqrt(a * a + p.thu * p.thu) } : null };
    }
  });

  C.dangKi('tamGiacAn', {
    tinh: function (p, t, o) {
      if (o.mau === 'hcn') {
        var dai = Math.sqrt(o.cheo * o.cheo - o.rong * o.rong);
        return { canhA: o.rong, canhB: dai, huyen: o.cheo, dinh: [[0, 0], [0, o.rong], [dai, o.rong]] };
      }
      if (o.mau === 'can') {
        var nua = o.day / 2;
        return { canhA: nua, canhB: o.cao, huyen: Math.sqrt(nua * nua + o.cao * o.cao), dinh: [[nua, 0], [0, o.cao], [nua, o.cao]] };
      }
      if (o.mau === 'taxi') {
        var ngang = o.d1 + o.d3;
        return { canhA: ngang, canhB: o.d2, huyen: Math.sqrt(ngang * ngang + o.d2 * o.d2), dinh: [[0, o.d2], [ngang, o.d2], [ngang, 0]],
          duong: [[0, o.d2], [o.d1, o.d2], [o.d1, 0], [ngang, 0]] };
      }
      throw new Error('tamGiacAn: mẫu lạ ' + o.mau);
    }
  });

  /* ---------- Phần vẽ ---------- */
  C.lay('toHopHinhVuong').ve = function (svg, k, p, t) {
    var s = k.s, d = 0.1 * s, co = 0.062 * s, mk = C.mk, a = k.a, b = k.b;
    svg.setAttribute('viewBox', [-d, -d, s + 2 * d, s + 2 * d].join(' '));
    mk('rect', { width: s, height: s, fill: 'var(--mat)' }, svg);
    var mC = 1 - C.muot(t / 0.15), mS = C.muot((t - 0.85) / 0.15);
    mk('polygon', { points: C.diem(k.oC), fill: 'var(--cc)', 'fill-opacity': 0.32, opacity: mC }, svg);
    [[k.oA, '--a'], [k.oB, '--b']].forEach(function (x) {
      mk('rect', { x: x[0].x, y: x[0].y, width: x[0].w, height: x[0].h, fill: 'var(' + x[1] + ')', 'fill-opacity': 0.32, opacity: mS }, svg);
    });
    k.tamGiac.forEach(function (g) {
      mk('polygon', { points: C.diem(g), fill: 'var(--tg)', stroke: 'var(--mat)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round' }, svg);
    });
    mk('rect', { width: s, height: s, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 2.5, 'vector-effect': 'non-scaling-stroke' }, svg);
    var it = { 'font-style': 'italic' };
    C.chu(svg, s / 2, s / 2, 'c²', co * 1.5, '--cc', Object.assign({ opacity: mC }, it));
    C.chu(svg, a / 2, a / 2, 'a²', co * 1.3, '--a', Object.assign({ opacity: mS }, it));
    C.chu(svg, a + b / 2, a + b / 2, 'b²', co * 1.3, '--b', Object.assign({ opacity: mS }, it));
    C.chu(svg, a / 2, -d / 2, 'a', co, '--a', it);
    C.chu(svg, a + b / 2, -d / 2, 'b', co, '--b', it);
    // Cạnh trái đổi thứ tự b, a thành a, b khi tam giác đã trượt xong
    var e = C.muot(t / 0.9);
    C.chu(svg, -d / 2, b / 2 + a * e, 'b', co, '--b', it);
    C.chu(svg, -d / 2, b + a / 2 - b * e, 'a', co, '--a', it);
  };

  C.lay('baHinhVuong').ve = function (svg, k, p, t, o) {
    var mk = C.mk, a = k.a, h = k.h, c = k.c, don = o.don == null ? ' m' : o.don, tren = h + a + 0.8;
    svg.setAttribute('viewBox', [-h - 0.8, -tren, 2 * h + a + 1.6, tren + a + 0.8].join(' '));
    var trai = -h - 0.8, phai = h + a + 0.8, xong = t >= 1 || p.trangThai === 'giai';
    mk('rect', { x: 0, y: 0, width: a, height: a, fill: 'var(--b)', 'fill-opacity': 0.3 }, svg);
    mk('polygon', { points: C.diem([[a, 0], [0, -h], [h, -h - a], [h + a, -a]]), fill: 'var(--cc)', 'fill-opacity': 0.3 }, svg);
    mk('rect', { x: -h, y: -h, width: h, height: h, fill: 'var(--a)', 'fill-opacity': xong ? 0.3 : 0.06, stroke: 'var(--a)', 'stroke-width': 0.05, 'stroke-dasharray': '.2 .15' }, svg);
    mk('line', { x1: trai, y1: 0, x2: phai, y2: 0, stroke: 'var(--muc)', 'stroke-width': 0.07 }, svg);
    mk('line', { x1: 0, y1: 0, x2: 0, y2: -tren, stroke: 'var(--muc)', 'stroke-width': 0.16 }, svg);
    mk('line', { x1: a, y1: 0, x2: 0, y2: -h, stroke: 'var(--tg)', 'stroke-width': 0.2, 'stroke-linecap': 'round' }, svg);
    C.chu(svg, a / 2, a / 2, C.fmt(k.dienTich.a), 0.55, '--b');
    C.chu(svg, (h + a) * 0.62, -(h + a) * 0.59, C.fmt(k.dienTich.c), 0.8, '--cc');
    C.chu(svg, -h / 2, -h / 2, xong ? C.fmt(k.dienTich.h) : '?', xong ? 1 : 1.3, '--a');
    C.chu(svg, a / 2, -0.45, C.fmt(a) + don, 0.45);
    C.chu(svg, a * 0.95, -h * 0.52, C.fmt(c) + don, 0.45);
    if (k.thu) {
      // Vẽ đúng độ cao em vừa gõ (quá cao thì dừng ở mép khung và ghi số)
      var v = Math.min(k.thu.h, tren - 0.4);
      mk('line', { x1: a, y1: 0, x2: 0, y2: -v, stroke: 'var(--sai)', 'stroke-width': 0.09, 'stroke-dasharray': '.25 .15' }, svg);
      C.chu(svg, -0.15, -v + 0.05, 'h = ' + C.fmt(k.thu.h), 0.5, '--sai', { style: 'fill:var(--sai);text-anchor:end' });
    }
  };

  // Tam giác vuông nấp trong đề: t chạy thì tam giác hiện ra
  C.lay('tamGiacAn').ve = function (svg, k, p, t, o) {
    var mk = C.mk, hien = C.muot(t), net = { fill: 'none', stroke: 'var(--muc)' };
    function tamGiac(g, co) {
      var goc = mk('g', { opacity: hien }, svg);
      mk('polygon', { points: C.diem(k.dinh), fill: 'var(--cc)', 'fill-opacity': 0.32 }, goc);
      if (g) g(goc, co);
    }
    function chuDap() { return p.trangThai === 'giai' ? C.fmt(o.mau === 'hcn' ? k.canhB : k.huyen) : '?'; }
    if (o.mau === 'hcn') {
      var w = k.canhB, h = k.canhA, u = Math.max(w, h) / 12;
      svg.setAttribute('viewBox', [-2.2 * u, -1.4 * u, w + 4.4 * u, h + 3.6 * u].join(' '));
      tamGiac(function (g) { mk('path', { d: 'M0 ' + (h - u) + 'H' + u + 'V' + h, fill: 'none', stroke: 'var(--cc)', 'stroke-width': 0.12 * u }, g); });
      mk('rect', Object.assign({ width: w, height: h, 'stroke-width': 0.14 * u }, net), svg);
      mk('line', { x1: 0, y1: 0, x2: w, y2: h, stroke: 'var(--muc)', 'stroke-width': 0.14 * u }, svg);
      C.chu(svg, -u, h / 2, C.fmt(h), 0.95 * u);
      C.chu(svg, w * 0.58, h * 0.4, C.fmt(k.huyen), 0.95 * u);
      C.chu(svg, w / 2, h + 1.2 * u, chuDap(), 1.1 * u, '--a');
    } else if (o.mau === 'can') {
      var n = k.canhA, cao = k.canhB, v = Math.max(2 * n, cao) / 6;
      svg.setAttribute('viewBox', [-1.3 * v, -0.7 * v, 2 * n + 2.6 * v, cao + 2 * v].join(' '));
      tamGiac(function (g) {
        mk('path', { d: 'M' + (n - 0.4 * v) + ' ' + cao + 'V' + (cao - 0.4 * v) + 'H' + n, fill: 'none', stroke: 'var(--cc)', 'stroke-width': 0.06 * v }, g);
        C.chu(g, n / 2, cao + 0.4 * v, C.fmt(n), 0.45 * v, '--cc');
      });
      mk('polygon', Object.assign({ points: C.diem([[n, 0], [0, cao], [2 * n, cao]]), 'stroke-width': 0.07 * v }, net), svg);
      mk('line', { x1: n, y1: 0, x2: n, y2: cao, stroke: 'var(--muc)', 'stroke-width': 0.07 * v, 'stroke-dasharray': (0.15 * v) + ' ' + (0.1 * v) }, svg);
      C.chu(svg, n + 0.35 * v, cao * 0.55, C.fmt(cao), 0.5 * v);
      C.chu(svg, n, cao + 0.95 * v, C.fmt(2 * n), 0.5 * v);
      C.chu(svg, n * 0.33, cao * 0.38, chuDap(), 0.6 * v, '--a');
    } else {
      var ng = k.canhA, doc = k.canhB, x = Math.max(ng, doc) / 8, d = k.duong;
      svg.setAttribute('viewBox', [-1.6 * x, -1.6 * x, ng + 4.2 * x, doc + 3.2 * x].join(' '));
      tamGiac(function (g) {
        mk('polyline', { points: C.diem([d[1], [ng, doc], [ng, 0]]), fill: 'none', stroke: 'var(--cc)', 'stroke-width': 0.1 * x, 'stroke-dasharray': (0.2 * x) + ' ' + (0.14 * x) }, g);
        C.chu(g, ng / 2, doc + 0.8 * x, C.fmt(o.d1) + ' + ' + C.fmt(o.d3) + ' = ' + C.fmt(ng), 0.6 * x, '--cc');
        C.chu(g, ng + 0.7 * x, doc / 2, C.fmt(doc), 0.65 * x, '--cc');
      });
      mk('polyline', Object.assign({ points: C.diem(d), 'stroke-width': 0.13 * x }, net), svg);
      mk('line', { x1: 0, y1: doc, x2: ng, y2: 0, stroke: 'var(--a)', 'stroke-width': 0.1 * x, 'stroke-dasharray': (0.28 * x) + ' ' + (0.2 * x) }, svg);
      C.chu(svg, o.d1 / 2, doc - 0.6 * x, C.fmt(o.d1), 0.65 * x);
      C.chu(svg, o.d1 - 0.55 * x, doc / 2, C.fmt(doc), 0.65 * x);
      C.chu(svg, o.d1 + o.d3 / 2, -0.6 * x, C.fmt(o.d3), 0.65 * x);
      C.chu(svg, ng * 0.38, doc * 0.5, chuDap(), 0.9 * x, '--a');
      C.chu(svg, -0.6 * x, doc + 0.2 * x, 'A', 0.6 * x);
      C.chu(svg, ng + 0.6 * x, -0.2 * x, 'D', 0.6 * x);
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
