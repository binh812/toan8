// Cái cân: phương trình ax + b = cx + d (ẩn mặc định là x, đổi bằng tuyChon.bien). Số dương là quả nặng, số âm là bóng bay kéo lên. Lệch = vế trái − vế phải khi thay x.
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
      return { trai: s.trai, phai: s.phai, nghiem: goc, buocHienTai: i, thu: coThu ? p.thu : null, xAm: x < 0,
        lech: (s.trai.x - s.phai.x) * x + (s.trai.so - s.phai.so) };
    }
  });

  /* ---------- Phần vẽ: khung 100 × 70, trục ở giữa ---------- */
  var O = 5.2, MOI_HANG = 6;
  function viet(v, bien) {
    // Viết như trong đề: 7 − 2x thay vì −2x + 7
    var tx = v.x ? (Math.abs(v.x) === 1 ? '' : C.fmt(Math.abs(v.x))) + (bien || 'x') : '', ts = v.so ? C.fmt(Math.abs(v.so)) : '';
    if (v.x < 0 && v.so > 0) return ts + ' − ' + tx;
    var ra = tx ? (v.x < 0 ? '−' : '') + tx : '';
    if (ts) ra += ra ? (v.so < 0 ? ' − ' : ' + ') + ts : (v.so < 0 ? '−' : '') + ts;
    return ra || '0';
  }
  // Tách một vế thành các vật: x, quả 10, quả 1; số âm thành bóng bay
  function vatCua(v, xAm) {
    var nang = [], bong = [], i, tach = function (so, ds, duoi) {
      var chuc = duoi ? 0 : Math.floor(so / 10), don = Math.floor(so - chuc * 10), le = Math.round((so - chuc * 10 - don) * 100) / 100;
      for (i = 0; i < chuc; i++) ds.push('10');
      for (i = 0; i < don; i++) ds.push(duoi ? 'x' : '1');
      if (le) ds.push(C.fmt(le) + (duoi ? 'x' : ''));
    };
    // x âm thì khối x kéo lên như bóng bay, để cân luôn đúng về lực
    tach(Math.abs(v.x), (v.x > 0) !== xAm ? nang : bong, true);
    tach(Math.abs(v.so), v.so > 0 ? nang : bong, false);
    return { nang: nang, bong: bong };
  }
  function veDia(svg, cx, cy, v, xAm, bien) {
    var vat = vatCua(v, xAm), mk = C.mk;
    mk('path', { d: 'M' + (cx - 17) + ' ' + cy + 'H' + (cx + 17) + 'L' + (cx + 13) + ' ' + (cy + 3) + 'H' + (cx - 13) + 'Z', fill: 'var(--tg)' }, svg);
    var tungHang = function (i) { return { x: cx - (MOI_HANG - 1) * O / 2 + (i % MOI_HANG) * O, h: Math.floor(i / MOI_HANG) }; };
    vat.nang.forEach(function (ten, i) {
      var q = tungHang(i), y = cy - O - q.h * O;
      mk('rect', { x: q.x - O / 2 + 0.2, y: y + 0.2, width: O - 0.4, height: O - 0.4, rx: 0.5, fill: /x/.test(ten) ? 'var(--a)' : ten === '10' ? 'var(--muc)' : 'var(--tg)' }, svg);
      C.chu(svg, q.x, y + O / 2, bien ? ten.replace('x', bien) : ten, ten.length > 2 ? 1.7 : 2.9, null, { style: 'fill:var(--mat)' });
    });
    var dinhVat = cy - O * Math.ceil(vat.nang.length / MOI_HANG);
    vat.bong.forEach(function (ten, i) {
      var q = tungHang(i), y = dinhVat - 8 - q.h * O;
      mk('line', { x1: q.x, y1: y + O / 2 - 0.2, x2: q.x, y2: dinhVat, stroke: 'var(--nhat)', 'stroke-width': 0.2 }, svg);
      mk('circle', { cx: q.x, cy: y, r: O / 2 - 0.1, fill: 'var(--b)', 'fill-opacity': 0.85 }, svg);
      C.chu(svg, q.x, y, bien ? ten.replace('x', bien) : ten, ten.length > 2 ? 1.6 : 2.2, null, { style: 'fill:var(--mat)' });
    });
  }
  C.lay('caiCan').ve = function (svg, k, p, t, o) {
    var mk = C.mk, cao = 30, nua = 34, tam = 50, gia = o.anLucDau && t === 0;
    // Có bóng bay ở bước nào thì mới chừa chỗ phía trên; cả cảnh dùng một khung để hình không nhảy giữa các bước
    var coBong = [{ trai: o.trai, phai: o.phai }].concat(o.buoc || []).some(function (s) { return s.trai.x < 0 || s.trai.so < 0 || s.phai.x < 0 || s.phai.so < 0; });
    svg.setAttribute('viewBox', coBong || k.xAm ? '-3 -12 106 90' : '-3 14 106 64');
    // Đề lời văn: chưa bấm nút thì cân còn trống, để em tự lập phương trình trước
    if (gia) k = { trai: { x: 0, so: 0 }, phai: { x: 0, so: 0 }, lech: 0, thu: null, xAm: false };
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
    veDia(svg, trai.x, trai.y + treo, k.trai, !!k.xAm, o.bien);
    veDia(svg, phai.x, phai.y + treo, k.phai, !!k.xAm, o.bien);
    var bang = Math.abs(k.lech) < 1e-9;
    // Số đã làm tròn thì ghi ≈, không ghi =
    var tron = [k.trai.x, k.trai.so, k.phai.x, k.phai.so].some(function (n) { return Math.abs(n * 100 - Math.round(n * 100)) > 1e-9; });
    C.chu(svg, tam, 73, gia ? 'Hai đĩa là hai vế nào?' : viet(k.trai, o.bien) + (bang ? (tron ? ' ≈ ' : ' = ') : ' ≠ ') + viet(k.phai, o.bien), 4.4, bang ? null : '--sai');
    if (k.xAm && !gia && k.thu == null) C.chu(svg, tam, 18, (o.bien || 'x') + ' âm nên khối ' + (o.bien || 'x') + ' cũng kéo lên', 3.2, '--nhat');
    if (k.thu != null) {
      var x = k.thu, vt = k.trai.x * x + k.trai.so, vp = k.phai.x * x + k.phai.so;
      C.chu(svg, trai.x, trai.y + treo + 7, C.fmt(vt), 3.4, bang ? '--cc' : '--sai');
      C.chu(svg, phai.x, phai.y + treo + 7, C.fmt(vp), 3.4, bang ? '--cc' : '--sai');
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
