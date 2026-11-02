// Ngẫu nhiên có hạt giống (cùng hạt giống → cùng đề, dùng cho in phiếu và kiểm tra) và công cụ định dạng cho bài sinh tự động.
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.taoRng = m.taoRng; root.TOAN8.congCu = m.congCu; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // mulberry32
  function taoRng(seed) {
    var a = (seed >>> 0) || 1;
    function next() {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var r = {
      ngauNhien: next,
      so: function (a, b) { return a + Math.floor(next() * (b - a + 1)); },
      khac0: function (a, b) { var x; do { x = r.so(a, b); } while (x === 0); return x; },
      chon: function (m) { return m[Math.floor(next() * m.length)]; },
      dau: function () { return next() < 0.5 ? -1 : 1; },
      xaoTron: function (m) {
        var x = m.slice();
        for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)), t = x[i]; x[i] = x[j]; x[j] = t; }
        return x;
      },
      khacNhau: function (k, a, b) {
        var all = [];
        for (var v = a; v <= b; v++) all.push(v);
        return r.xaoTron(all).slice(0, k);
      }
    };
    return r;
  }

  function ucln(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  function congCu(P) {
    return {
      ucln: ucln,
      tex: function (ascii) { return P.toLatex(P.parse(ascii)); },
      so: function (x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); },
      phanSo: function (a, b) {
        if (b === 0) throw new Error('phanSo: mẫu bằng 0');
        var g = ucln(a, b), tu = a / g, mau = b / g;
        if (mau < 0) { tu = -tu; mau = -mau; }
        var tex = mau === 1 ? String(tu) : (tu < 0 ? '-' : '') + '\\frac{' + Math.abs(tu) + '}{' + mau + '}';
        return { tu: tu, mau: mau, tex: tex, ascii: mau === 1 ? String(tu) : tu + '/' + mau };
      },
      // [[hệ số, phần biến], …] → ascii gọn: bỏ hệ số 1, bỏ hạng tử 0, dấu đúng; toàn 0 → '0'
      daThuc: function (heSo) {
        var s = '';
        heSo.forEach(function (h) {
          var c = h[0], m = h[1];
          if (!c) return;
          var abs = Math.abs(c), dau = c < 0 ? '-' : (s ? '+' : '');
          s += dau + (m && abs === 1 ? '' : String(abs)) + m;
        });
        return s || '0';
      }
    };
  }
  return { taoRng: taoRng, congCu: congCu };
});
