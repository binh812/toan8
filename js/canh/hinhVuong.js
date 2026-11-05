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
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
