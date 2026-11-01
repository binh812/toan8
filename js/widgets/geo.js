// Tiện ích dựng hình động bằng JSXGraph: điểm kéo được, đoạn thẳng, song song, giao điểm, nhãn số đo động.
(function (T) {
  'use strict';
  var n = 0, live = [];
  // Gọi khi chuyển trang: JSXGraph giữ mọi board (và ResizeObserver) cho tới khi freeBoard.
  T.freeBoards = function () {
    live.forEach(function (b) { try { JXG.JSXGraph.freeBoard(b); } catch (e) { console.warn('Không giải phóng được hình', e); } });
    live = [];
  };
  function fmt(v, d) {
    var p = Math.pow(10, d == null ? 2 : d);
    return (Math.round(v * p) / p).toString().replace('.', ',');
  }

  // cfg: { bbox:[x1,y1,x2,y2], axis?, wide?, build:function(board, G) }
  T.widgets.geo = function (container, cfg) {
    var id = 'jxg' + (++n);
    var div = T.el('div', { id: id, class: 'board' + (cfg.wide ? ' wide' : '') });
    container.appendChild(div);
    var board = JXG.JSXGraph.initBoard(id, {
      boundingbox: cfg.bbox || [-1, 7, 9, -1], axis: !!cfg.axis, grid: !!cfg.grid,
      showCopyright: false, showNavigation: false, keepAspectRatio: true,
      pan: { enabled: false }, zoom: { enabled: false, wheel: false },
      defaultAxes: { x: { ticks: { label: { fontSize: 14 } } }, y: { ticks: { label: { fontSize: 14 } } } }
    });
    var C = getComputedStyle(document.documentElement).getPropertyValue('--c').trim() || '#1971c2';
    var LBL = { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700' };
    function opt(base, o) { return Object.assign({}, base, o || {}); }
    var G = {
      board: board, color: C, fmt: fmt,
      pt: function (name, x, y, o) {
        var fixed = o && o.fixed;
        return board.create('point', [x, y], opt({ name: name, size: fixed ? 3 : 7, color: fixed ? '#343a40' : C, fixed: !!fixed, label: LBL, showInfobox: false }, o));
      },
      glider: function (name, x, y, on, o) {
        return board.create('glider', [x, y, on], opt({ name: name, size: 7, color: '#e8590c', label: LBL, showInfobox: false }, o));
      },
      mid: function (A, B, name, o) { return board.create('midpoint', [A, B], opt({ name: name, size: 4, color: '#495057', label: LBL, showInfobox: false }, o)); },
      seg: function (A, B, o) { return board.create('segment', [A, B], opt({ strokeWidth: 3, strokeColor: '#343a40', fixed: true }, o)); },
      line: function (A, B, o) { return board.create('line', [A, B], opt({ strokeWidth: 2, strokeColor: '#adb5bd', dash: 2, fixed: true }, o)); },
      par: function (A, l, o) { return board.create('parallel', [l, A], opt({ strokeWidth: 2, strokeColor: '#adb5bd', dash: 2, fixed: true }, o)); },
      inter: function (a, b, name, o) { return board.create('intersection', [a, b, 0], opt({ name: name, size: 4, color: '#495057', label: LBL, showInfobox: false }, o)); },
      poly: function (pts, o) {
        return board.create('polygon', pts, opt({ fillOpacity: 0.1, fillColor: C, hasInnerPoints: false, fixed: true, borders: { strokeWidth: 3, strokeColor: '#343a40', fixed: true }, vertices: { visible: false } }, o));
      },
      angle: function (A, O, B, o) { return board.create('angle', [A, O, B], opt({ radius: 0.7, fillOpacity: 0.3, name: '', fixed: true }, o)); },
      len: function (A, B) { return A.Dist(B); },
      label: function (x, y, fn, o) { return board.create('text', [x, y, fn], opt({ fontSize: 18, fixed: true, cssClass: 'geo-label', highlightCssClass: 'geo-label' }, o)); }
    };
    live.push(board);
    cfg.build(board, G);
    return board;
  };
})(window.TOAN8);
