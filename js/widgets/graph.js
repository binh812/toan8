// Đồ thị hàm số trên mặt phẳng toạ độ (JSXGraph): đường thẳng y = ax + b có thanh trượt, điểm kéo được.
(function (T) {
  'use strict';
  var el = T.el, MAU = ['#c2255c', '#1971c2', '#2f9e44', '#e8590c'];

  // Viết "y = ax + b" gọn: bỏ hệ số 1, bỏ "+ 0", đổi "+ −3" thành "− 3"
  function ptDuongThang(a, b) {
    var f = T.fmtSo, s;
    if (a === 0) return 'y = ' + f(b);
    s = 'y = ' + (a === 1 ? '' : a === -1 ? '−' : f(a)) + 'x';
    if (b > 0) s += ' + ' + f(b); else if (b < 0) s += ' − ' + f(-b);
    return s;
  }
  T.ptDuongThang = ptDuongThang;

  // cfg: { bbox?, thanhTruot?:[…], duong?:[{a, b, mau?, nhan?}] (a, b: số hoặc tên thanh trượt),
  //        ham?:[{f:'x^2/2', mau?, nhan?}], diem?:[{x, y, ten, keo?}], giaoTruc?: bool, tamGiacDoc?: bool, an?: bool (ẩn phương trình),
  //        doan?:[[x1, y1, x2, y2, {mau?, net?}]], tiLe?: false (hai trục khác tỉ lệ, cho bài toán thực tế), them?: function(board, G, env) }
  T.widgets.doThi = function (container, cfg) {
    var env = {};
    (cfg.thanhTruot || []).forEach(function (t) { env[t.ten] = t.gt != null ? t.gt : (t.min + t.max) / 2; });
    var info = el('div', { class: 'dt-tong' });
    var board = T.widgets.geo(container, {
      bbox: cfg.bbox || [-6, 6, 6, -6], axis: true, grid: true, tiLe: cfg.tiLe,
      build: function (bd, G) {
        (cfg.duong || []).forEach(function (d, i) {
          var mau = d.mau || MAU[i % MAU.length];
          var a = function () { return T.giaTri(d.a, env); }, b = function () { return T.giaTri(d.b, env); };
          bd.create('functiongraph', [function (x) { return a() * x + b(); }], { strokeColor: mau, strokeWidth: 3, fixed: true, highlight: false });
          if (cfg.giaoTruc) {
            bd.create('point', [0, b], { name: '', size: 4, color: mau, fixed: true, showInfobox: false });
            bd.create('point', [function () { return a() ? -b() / a() : NaN; }, 0], { name: '', size: 4, color: mau, fixed: true, showInfobox: false });
          }
          if (cfg.tamGiacDoc) {
            // từ điểm có hoành độ 0: đi ngang 1 đơn vị, đi dọc a đơn vị
            var P = bd.create('point', [0, b], { visible: false }), Q = bd.create('point', [1, b], { visible: false });
            var R = bd.create('point', [1, function () { return a() + b(); }], { visible: false });
            bd.create('segment', [P, Q], { strokeColor: '#495057', dash: 2, fixed: true });
            bd.create('segment', [Q, R], { strokeColor: mau, strokeWidth: 3, fixed: true });
            bd.create('text', [1.15, function () { return b() + a() / 2; }, function () { return 'a = ' + T.fmtSo(a()); }], { fontSize: 16, color: mau, fixed: true });
          }
        });
        (cfg.ham || []).forEach(function (h, i) {
          var ast = T.parser.parse(h.f);
          bd.create('functiongraph', [function (x) { return T.parser.evaluate(ast, Object.assign({ x: x }, env)); }],
            { strokeColor: h.mau || MAU[(i + 1) % MAU.length], strokeWidth: 3, fixed: true, highlight: false });
        });
        (cfg.doan || []).forEach(function (d) {
          var k = d[4] || {};
          bd.create('segment', [[d[0], d[1]], [d[2], d[3]]], { strokeColor: k.mau || '#343a40', strokeWidth: 3, dash: k.net ? 2 : 0, fixed: true, highlight: false });
        });
        if (cfg.them) cfg.them(bd, G, env);
        (cfg.diem || []).forEach(function (p) {
          var pt = G.pt(p.ten || '', p.x, p.y, { fixed: !p.keo, size: p.keo ? 7 : 4, snapToGrid: !!p.keo, snapSizeX: 0.5, snapSizeY: 0.5 });
          if (p.keo) pt.on('drag', update);
          if (p.keo) bd.create('text', [function () { return pt.X() + 0.25; }, function () { return pt.Y() - 0.45; },
            function () { return '(' + T.fmtSo(pt.X()) + '; ' + T.fmtSo(pt.Y()) + ')'; }], { fontSize: 15, fixed: true });
        });
      }
    });
    function update() {
      board.update();
      if (cfg.an) { info.innerHTML = ''; return; }
      info.innerHTML = (cfg.duong || []).map(function (d, i) {
        return '<span style="color:' + (d.mau || MAU[i % MAU.length]) + ';font-weight:700">' + (d.nhan ? d.nhan + ': ' : '') +
          ptDuongThang(T.giaTri(d.a, env), T.giaTri(d.b, env)) + '</span>';
      }).join(' &nbsp; ');
    }
    if (cfg.thanhTruot) container.appendChild(T.makeSliders(cfg.thanhTruot, env, update));
    container.appendChild(info);
    update();
    return board;
  };
})(window.TOAN8);
