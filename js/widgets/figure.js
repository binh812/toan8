// Hình tĩnh cho đề bài hình học (JSXGraph qua widget 'geo'): toạ độ dựng từ chính số liệu đề, có nhãn độ dài, góc, vạch.
// Thuần JS lúc nạp (không gọi JXG) nên công cụ kiểm tra nội dung chạy được trong Node.
(function (T) {
  'use strict';
  var CAM = '#d9480f';
  function lerp(P, Q, t) { return [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]; }
  function giua(P, Q) { return lerp(P, Q, 0.5); }
  // Tam giác biết ba cạnh BC = a, CA = b, AB = c: B ở gốc, C bên phải, A phía trên.
  function tg(a, b, c) { var x = (c * c - b * b + a * a) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] }; }
  // Tam giác biết AB = c, AC = b và góc A (độ).
  function tgGoc(c, b, gocA) { var r = gocA * Math.PI / 180; return tg(Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(r)), b, c); }
  // o: { diem:{A:[x,y]}, to?:[tên], canh:[[P,Q,{mau,day,vach,net}]], nhan:[[P,Q,'chữ',đảoPhía?,xa?,màu?]],
  //      goc:[[P,O,Q,{mau,r}]], ve:[[[x,y],[x,y],{mau,net}]], lechTen?:{A:[dx,dy]}, ghiChu?, them?:function(board,G,P) }
  function hinh(o) {
    var D = o.diem, ten = Object.keys(D), all = ten.map(function (n) { return D[n]; });
    (o.ve || []).forEach(function (v) { all.push(v[0], v[1]); });
    var x1 = Math.min.apply(null, all.map(function (p) { return p[0]; })), x2 = Math.max.apply(null, all.map(function (p) { return p[0]; }));
    var y1 = Math.min.apply(null, all.map(function (p) { return p[1]; })), y2 = Math.max.apply(null, all.map(function (p) { return p[1]; }));
    var s = Math.max(x2 - x1, y2 - y1), m = 0.13 * s;
    var bx1 = x1 - m, bx2 = x2 + m, by1 = y1 - m, by2 = y2 + m + (o.ghiChu ? 0.08 * s : 0);
    var W = bx2 - bx1, H = by2 - by1;
    if (W / H < 4 / 3) { var dw = (H * 4 / 3 - W) / 2; bx1 -= dw; bx2 += dw; } else { var dh = (W * 3 / 4 - H) / 2; by1 -= dh; by2 += dh; }
    var cx = 0, cy = 0;
    ten.forEach(function (n) { cx += D[n][0] / ten.length; cy += D[n][1] / ten.length; });
    var d = 0.06 * s;
    return { bbox: [bx1, by2, bx2, by1], build: function (board, G) {
      var P = {};
      (o.ve || []).forEach(function (v) {
        var c = v[2] || {};
        board.create('segment', [v[0], v[1]], { strokeColor: c.mau || '#74c0fc', strokeWidth: c.day || 2, dash: c.net == null ? 0 : c.net, fixed: true, highlight: false });
      });
      if (o.them) o.them(board, G);
      ten.forEach(function (n) {
        var p = D[n], vx = p[0] - cx, vy = p[1] - cy, l = Math.sqrt(vx * vx + vy * vy) || 1;
        var off = (o.lechTen && o.lechTen[n]) || [17 * vx / l, 17 * vy / l];
        P[n] = G.pt(n, p[0], p[1], { fixed: true, label: { fontSize: 19, offset: off, anchorX: 'middle', anchorY: 'middle', cssStyle: 'font-weight:700' } });
      });
      if (o.to) G.poly(o.to.map(function (n) { return P[n]; }), { borders: { visible: false }, fillOpacity: 0.06 });
      (o.canh || []).forEach(function (c) {
        var k = c[2] || {};
        var sg = G.seg(P[c[0]], P[c[1]], { strokeColor: k.mau || '#343a40', strokeWidth: k.day || 3, dash: k.net || 0 });
        if (k.vach) board.create('hatch', [sg, k.vach], { strokeColor: k.mau || '#343a40', fixed: true });
      });
      (o.goc || []).forEach(function (g) {
        var k = g[3] || {};
        board.create('nonreflexangle', [P[g[0]], P[g[1]], P[g[2]]], { radius: k.r || 0.08 * s, name: '', fillColor: k.mau || CAM, strokeColor: k.mau || CAM, fillOpacity: 0.3, fixed: true, highlight: false });
      });
      (o.nhan || []).forEach(function (t) {
        var A = D[t[0]], B = D[t[1]], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
        var dx = B[0] - A[0], dy = B[1] - A[1], l = Math.sqrt(dx * dx + dy * dy), nx = -dy / l, ny = dx / l;
        var far = Math.pow(mx + nx - cx, 2) + Math.pow(my + ny - cy, 2) > Math.pow(mx - nx - cx, 2) + Math.pow(my - ny - cy, 2);
        var sg = (far ? 1 : -1) * (t[3] ? -1 : 1), kc = d * (t[4] || 1);
        G.label(mx + sg * nx * kc, my + sg * ny * kc, t[2], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, strokeColor: t[5] || '#212529' });
      });
      if (o.ghiChu) G.label(bx1 + 0.03 * (bx2 - bx1), by2 - 0.05 * (by2 - by1), o.ghiChu, { fontSize: 14, strokeColor: '#868e96' });
    } };
  }
  T.hh = { lerp: lerp, giua: giua, tg: tg, tgGoc: tgGoc };
  T.hinhTinh = hinh; // trả về config cho widget 'geo'
  T.hinhGeo = function (o) { return { widget: 'geo', config: hinh(o) }; };
})(window.TOAN8);
