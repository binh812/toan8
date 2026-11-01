// Mô hình diện tích (SVG): nhìn thấy phép nhân đa thức và hằng đẳng thức bằng diện tích các mảnh.
(function (T) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', el = T.el;
  var W = 560, PAD = 46;

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }

  // Nhãn tích của hai đoạn: "a"·"a" → a^2, "2"·"x" → 2x, "a-b"·"b" → (a-b)b
  function productLabel(h, c) {
    var wrap = function (s) { return /[+\-]/.test(s) ? '(' + s + ')' : s; };
    if (h === c) return wrap(h) + '^2';
    if (/[+\-]/.test(h + c)) return wrap(h) + wrap(c); // nhãn là tổng/hiệu: giữ dạng tích (a-b)b
    // hai đơn thức: nhân thật (3x·2y → 6xy, x·1 → x), hệ số trước, biến theo thứ tự chữ cái
    try {
      var P = T.parser;
      var ast = P.parse(String(nerdamer(P.toNerdamer(P.parse(h)) + '*' + P.toNerdamer(P.parse(c))).toString()));
      if (ast.t === 'mul') {
        var key = function (f) { return f.t === 'num' ? '' : f.t === 'var' ? f.n : f.t === 'pow' && f.b.t === 'var' ? f.b.n : '~'; };
        ast = { t: 'mul', fs: ast.fs.slice().sort(function (a, b) { return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0; }) };
      }
      return P.toLatex(ast);
    } catch (e) {
      return wrap(h) + wrap(c);
    }
  }
  // Ô giao giữa hai màu khác nhau tô xanh lá – trùng màu \cc dùng cho hạng tử "chéo" (2ab) trong công thức.
  var CROSS = '#2f9e44';
  function cellColor(a, b) { return a === b ? a : CROSS; }

  function segLen(s, env) {
    if (typeof s.dai === 'number') return s.dai;
    return T.parser.evaluate(T.parser.parse(String(s.dai)), env);
  }

  // config: { hang:[{nhan, dai(number|biểu thức theo thanh trượt), mau}], cot:[…], o?:[[nhãn]],
  //           thanhTruot?:[{ten, min, max, buoc, gt}], congThuc?: latex hiện dưới hình }
  T.widgets.dienTich = function (container, cfg) {
    var env = {};
    (cfg.thanhTruot || []).forEach(function (s) { env[s.ten] = s.gt != null ? s.gt : (s.min + s.max) / 2; });
    var root = el('div', { class: 'dt-wrap' });
    var holder = el('div');
    var info = el('div', { class: 'dt-tong' });
    root.appendChild(holder);
    container.appendChild(root);

    function draw() {
      var rows = cfg.hang.map(function (s) { return segLen(s, env); });
      var cols = cfg.cot.map(function (s) { return segLen(s, env); });
      var sw = cols.reduce(function (a, b) { return a + b; }, 0), sh = rows.reduce(function (a, b) { return a + b; }, 0);
      var k = (W - PAD - 10) / Math.max(sw, sh * 1.25, 0.001);
      var Hpx = sh * k + PAD + 10;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + Hpx, class: 'dt', width: '100%', style: 'max-width:' + W + 'px;max-height:460px' });
      var y = PAD, areas = [];
      rows.forEach(function (rh, i) {
        var x = PAD;
        cols.forEach(function (cw, j) {
          var h = cfg.hang[i], c = cfg.cot[j];
          var r = svg('rect', { x: x, y: y, width: cw * k, height: rh * k, fill: cellColor(h.mau || '#868e96', c.mau || '#868e96'), 'fill-opacity': 0.32, stroke: '#343a40', 'stroke-width': 2 });
          s.appendChild(r);
          var lbl = cfg.o && cfg.o[i] && cfg.o[i][j] ? cfg.o[i][j] : productLabel(h.nhan, c.nhan);
          if (cw * k > 30 && rh * k > 22) {
            var fo = svg('foreignObject', { x: x, y: y, width: cw * k, height: rh * k });
            fo.appendChild(el('div', { class: 'lbl', style: 'width:100%;height:100%;display:flex;align-items:center;justify-content:center', html: T.tex(lbl) }));
            s.appendChild(fo);
          }
          areas.push(cw * rh);
          x += cw * k;
        });
        y += rh * k;
      });
      // nhãn cạnh: trên (cột) và trái (hàng)
      var x0 = PAD;
      cols.forEach(function (cw, j) {
        var fo = svg('foreignObject', { x: x0, y: 4, width: cw * k, height: PAD - 6 });
        fo.appendChild(el('div', { style: 'text-align:center;color:' + (cfg.cot[j].mau || '#343a40'), html: T.tex(cfg.cot[j].nhan) }));
        s.appendChild(fo);
        x0 += cw * k;
      });
      var y0 = PAD;
      rows.forEach(function (rh, i) {
        var fo = svg('foreignObject', { x: 0, y: y0, width: PAD - 4, height: rh * k });
        fo.appendChild(el('div', { style: 'height:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;color:' + (cfg.hang[i].mau || '#343a40'), html: T.tex(cfg.hang[i].nhan) }));
        s.appendChild(fo);
        y0 += rh * k;
      });
      holder.innerHTML = '';
      holder.appendChild(s);
      var total = sw * sh;
      info.innerHTML = (cfg.congThuc ? T.tex(cfg.congThuc, true) : '') +
        (cfg.thanhTruot ? '<div>Với các giá trị đang chọn: tổng diện tích = <b>' + fmt(total) + '</b> = ' + areas.map(fmt).join(' + ') + '</div>' : '');
    }

    if (cfg.thanhTruot) {
      var sl = el('div', { class: 'sliders' });
      cfg.thanhTruot.forEach(function (t) {
        var out = el('b', null, fmt(env[t.ten]));
        var inp = el('input', { type: 'range', min: t.min, max: t.max, step: t.buoc || 0.5, value: env[t.ten], 'aria-label': t.ten });
        inp.addEventListener('input', function () {
          var prev = env[t.ten];
          env[t.ten] = Number(inp.value);
          // rangBuoc(env): điều kiện giữa các thanh trượt (vd b < a); sai thì trả thanh về giá trị cũ
          if (cfg.rangBuoc && !cfg.rangBuoc(env)) { env[t.ten] = prev; inp.value = prev; return; }
          out.textContent = fmt(env[t.ten]);
          draw();
        });
        sl.appendChild(el('label', null, el('span', { html: T.tex(t.ten) }), inp, out));
      });
      root.appendChild(sl);
    }
    root.appendChild(info);
    draw();
    return { redraw: draw, env: env };
  };

  // a² − b²: hình vuông cạnh a bị khoét góc b×b; cắt mảnh trên, xoay ghép thành hình chữ nhật (a+b)(a−b).
  T.widgets.hieuHaiBinhPhuong = function (container, cfg) {
    var env = { a: cfg.a || 5, b: cfg.b || 2 }, t = 0, anim = null;
    var holder = el('div'), note = el('div', { class: 'dt-tong' });
    var btn = el('button', { class: 'btn primary' }, '✂ Cắt và ghép');
    var C1 = '#d9480f', C2 = '#1971c2';
    container.appendChild(holder);

    function draw() {
      var a = env.a, b = env.b, k = 360 / (a + b + 0.5), o = 30;
      var s = svg('svg', { viewBox: '0 0 480 ' + (a * k + 2 * o + 14), width: '100%', style: 'max-width:460px', class: 'dt' });
      // ô b×b bị khoét (nét đứt)
      s.appendChild(svg('rect', { x: o + (a - b) * k, y: o, width: b * k, height: b * k, fill: 'none', stroke: '#adb5bd', 'stroke-dasharray': '6 5', 'stroke-width': 2, opacity: 1 - t }));
      // mảnh dưới: a × (a−b), đứng yên
      s.appendChild(svg('rect', { x: o, y: o + b * k, width: a * k, height: (a - b) * k, fill: C1, 'fill-opacity': 0.3, stroke: '#343a40', 'stroke-width': 2 }));
      // mảnh trên: (a−b) × b, xoay 90° sang phải
      var g = svg('g', { transform: 'translate(' + (o + t * (a + b) * k) + ',' + (o + t * b * k) + ') rotate(' + (90 * t) + ')' });
      g.appendChild(svg('rect', { x: 0, y: 0, width: (a - b) * k, height: b * k, fill: C2, 'fill-opacity': 0.3, stroke: '#343a40', 'stroke-width': 2 }));
      s.appendChild(g);
      // nhãn kích thước
      function text(x, y, str, color) {
        var tx = svg('text', { x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: color || '#343a40' });
        tx.textContent = str;
        s.appendChild(tx);
      }
      text(o + a * k / 2, o + b * k + (a - b) * k / 2, '(a−b)·a', C1);
      if (t === 0) {
        text(o + (a - b) * k / 2, o + b * k / 2, '(a−b)·b', C2);
        text(o + a * k / 2, o - 12, 'a');
        text(o + (a - b) * k + b * k / 2, o + b * k / 2, 'b²', '#868e96');
      }
      if (t === 1) {
        text(o + a * k + b * k / 2, o + b * k + (a - b) * k / 2, 'b·(a−b)', C2);
        text(o + (a + b) * k / 2, o + a * k + 16, 'a + b');
        text(o - 4 + (a + b) * k + 30, o + b * k + (a - b) * k / 2, 'a − b');
      }
      holder.innerHTML = '';
      holder.appendChild(s);
      note.innerHTML = t < 1
        ? 'Phần tô màu có diện tích ' + T.tex('a^2-b^2') + ' = ' + fmt(a * a) + ' − ' + fmt(b * b) + ' = <b>' + fmt(a * a - b * b) + '</b>'
        : 'Ghép lại được hình chữ nhật ' + T.tex('(a+b)\\times(a-b)') + ' = ' + fmt(a + b) + ' × ' + fmt(a - b) + ' = <b>' + fmt((a + b) * (a - b)) + '</b>' + T.tex('a^2-b^2=(a+b)(a-b)', true);
    }
    btn.addEventListener('click', function () {
      if (anim) return;
      var from = t, to = t < 1 ? 1 : 0, start = performance.now();
      btn.textContent = to ? '↺ Trả về' : '✂ Cắt và ghép';
      (function step(now) {
        var p = Math.min(1, (now - start) / 1200);
        t = from + (to - from) * (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        draw();
        anim = p < 1 ? requestAnimationFrame(step) : null;
      })(start);
    });
    var sl = el('div', { class: 'sliders' });
    [['a', 2, 8], ['b', 1, 6]].forEach(function (d) {
      var out = el('b', null, String(env[d[0]]));
      var inp = el('input', { type: 'range', min: d[1], max: d[2], step: 0.5, value: env[d[0]] });
      inp.addEventListener('input', function () {
        var v = Number(inp.value), nb = d[0] === 'b' ? v : env.b, na = d[0] === 'a' ? v : env.a;
        if (nb >= na) { inp.value = env[d[0]]; return; } // giữ b < a
        env[d[0]] = v; out.textContent = fmt(v); draw();
      });
      sl.appendChild(el('label', null, el('span', { html: T.tex(d[0]) }), inp, out));
    });
    container.appendChild(el('div', { class: 'sliders' }, btn));
    container.appendChild(sl);
    container.appendChild(note);
    draw();
  };
})(window.TOAN8);
