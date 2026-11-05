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

  /* ---------- Phần vẽ: khung 100 × 70, trục ở giữa ---------- */
  var O = 5.2, MOI_HANG = 6;
  function viet(v) {
    var ra = '';
    if (v.x) ra += (v.x === 1 ? '' : v.x === -1 ? '−' : String(v.x).replace('-', '−')) + 'x';
    if (v.so) ra += (v.so < 0 ? ' − ' : ra ? ' + ' : '') + C.fmt(Math.abs(v.so));
    return ra || '0';
  }
  // Tách một vế thành các vật: x, quả 10, quả 1; số âm thành bóng bay
  function vatCua(v) {
    var nang = [], bong = [], i, tach = function (so, ds) {
      for (i = 0; i < Math.floor(so / 10); i++) ds.push('10');
      for (i = 0; i < Math.round(so % 10); i++) ds.push('1');
    };
    for (i = 0; i < Math.abs(v.x); i++) (v.x > 0 ? nang : bong).push('x');
    tach(Math.abs(v.so), v.so > 0 ? nang : bong);
    return { nang: nang, bong: bong };
  }
  function veDia(svg, cx, cy, v) {
    var vat = vatCua(v), mk = C.mk;
    mk('path', { d: 'M' + (cx - 17) + ' ' + cy + 'H' + (cx + 17) + 'L' + (cx + 13) + ' ' + (cy + 3) + 'H' + (cx - 13) + 'Z', fill: 'var(--tg)' }, svg);
    var tungHang = function (i) { return { x: cx - (MOI_HANG - 1) * O / 2 + (i % MOI_HANG) * O, h: Math.floor(i / MOI_HANG) }; };
    vat.nang.forEach(function (ten, i) {
      var q = tungHang(i), y = cy - O - q.h * O;
      mk('rect', { x: q.x - O / 2 + 0.2, y: y + 0.2, width: O - 0.4, height: O - 0.4, rx: 0.5, fill: ten === 'x' ? 'var(--a)' : ten === '10' ? 'var(--muc)' : 'var(--tg)' }, svg);
      C.chu(svg, q.x, y + O / 2, ten, 2.9, null, { style: 'fill:var(--mat)' });
    });
    var dinhVat = cy - O * Math.ceil(vat.nang.length / MOI_HANG);
    vat.bong.forEach(function (ten, i) {
      var q = tungHang(i), y = dinhVat - 8 - q.h * O;
      mk('line', { x1: q.x, y1: y + O / 2 - 0.2, x2: q.x, y2: dinhVat, stroke: 'var(--nhat)', 'stroke-width': 0.2 }, svg);
      mk('circle', { cx: q.x, cy: y, r: O / 2 - 0.1, fill: 'var(--b)', 'fill-opacity': 0.85 }, svg);
      C.chu(svg, q.x, y, ten === 'x' ? 'x' : ten, 2.2, null, { style: 'fill:var(--mat)' });
    });
  }
  C.lay('caiCan').ve = function (svg, k, p) {
    var mk = C.mk, cao = 30, nua = 34, tam = 50;
    svg.setAttribute('viewBox', '-3 -12 106 90');
    // Lệch thì nghiêng ít nhất 3°, để lệch nhỏ vẫn nhìn ra; vế nặng hơn đi xuống
    var goc = Math.abs(k.lech) < 1e-9 ? 0 : (k.lech > 0 ? 1 : -1) * C.kep(Math.abs(k.lech) * 3, 3, 14);
    var r = goc * Math.PI / 180, dx = nua * Math.cos(r), dy = nua * Math.sin(r);
    var trai = { x: tam - dx, y: cao + dy }, phai = { x: tam + dx, y: cao - dy }, treo = 22;
    mk('path', { d: 'M' + tam + ' ' + cao + 'L' + (tam - 8) + ' 66H' + (tam + 8) + 'Z', fill: 'var(--nhat)' }, svg);
    mk('line', { x1: trai.x, y1: trai.y, x2: phai.x, y2: phai.y, stroke: 'var(--muc)', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, svg);
    [trai, phai].forEach(function (d) {
      mk('line', { x1: d.x, y1: d.y, x2: d.x - 16, y2: d.y + treo, stroke: 'var(--nhat)', 'stroke-width': 0.25 }, svg);
      mk('line', { x1: d.x, y1: d.y, x2: d.x + 16, y2: d.y + treo, stroke: 'var(--nhat)', 'stroke-width': 0.25 }, svg);
    });
    veDia(svg, trai.x, trai.y + treo, k.trai);
    veDia(svg, phai.x, phai.y + treo, k.phai);
    var bang = Math.abs(k.lech) < 1e-9;
    C.chu(svg, tam, 73, viet(k.trai) + (bang ? ' = ' : ' ≠ ') + viet(k.phai), 4.4, bang ? null : '--sai');
    if (k.thu != null) {
      var x = k.thu, vt = k.trai.x * x + k.trai.so, vp = k.phai.x * x + k.phai.so;
      C.chu(svg, trai.x, trai.y + treo + 7, C.fmt(vt), 3.4, bang ? '--cc' : '--sai');
      C.chu(svg, phai.x, phai.y + treo + 7, C.fmt(vp), 3.4, bang ? '--cc' : '--sai');
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
