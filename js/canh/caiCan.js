// Cái cân: phương trình ax + b = cx + d. Số dương là quả nặng, số âm là bóng bay kéo lên. Lệch = vế trái − vế phải khi thay x.
(function (C) {
  'use strict';
  function nghiemCua(s) {
    var a = s.trai.x - s.phai.x, b = s.phai.so - s.trai.so;
    return a === 0 ? null : b / a;
  }
  C.dangKi('caiCan', {
    tinh: function (p, t, o) {
      var cacBuoc = [{ trai: o.trai, phai: o.phai }].concat(o.buoc || []);
      var goc = nghiemCua(cacBuoc[0]);
      cacBuoc.forEach(function (s, i) {
        var n = nghiemCua(s);
        if (n === null ? goc !== null : goc === null || Math.abs(n - goc) > 1e-9) throw new Error('caiCan: bước ' + i + ' làm đổi nghiệm');
      });
      var i = Math.min(cacBuoc.length - 1, Math.floor(t * cacBuoc.length));
      var s = cacBuoc[i], coThu = typeof p.thu === 'number' && isFinite(p.thu);
      var x = coThu ? p.thu : (goc === null ? 0 : goc);
      return { trai: s.trai, phai: s.phai, nghiem: goc, buocHienTai: i, thu: coThu ? p.thu : null,
        lech: (s.trai.x - s.phai.x) * x + (s.trai.so - s.phai.so) };
    }
  });
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
