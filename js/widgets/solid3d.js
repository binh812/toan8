// Hình chóp đều 3D (SVG, không cần thư viện): kéo để xoay, thanh trượt cạnh đáy/chiều cao, trải phẳng các mặt bên.
(function (T) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', el = T.el, W = 520, H = 420;
  var MAU_BEN = ['#ffd8a8', '#ffc078', '#ffa94d', '#ff922b'], MAU_DAY = '#a5d8ff';

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; }
  function cross(u, v) { return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; }

  // Số đo của hình chóp đều n cạnh đáy a, chiều cao h
  T.soDoChop = function (n, a, h) {
    var R = a / (2 * Math.sin(Math.PI / n)), r = a / (2 * Math.tan(Math.PI / n));
    var d = Math.sqrt(h * h + r * r), canhBen = Math.sqrt(h * h + R * R);
    var Sday = n * a * r / 2, Sxq = n * a * d / 2;
    return { R: R, r: r, trungDoan: d, canhBen: canhBen, Sday: Sday, Sxq: Sxq, Stp: Sday + Sxq, V: Sday * h / 3 };
  };

  // cfg: { day: 3|4, a, h, thanhTruot?: bool (mặc định có), trai?: bool (có thanh "Trải phẳng"), hienTrungDoan?, hienDuongCao?, an?: bool (ẩn số đo) }
  T.widgets.hinhChop = function (container, cfg) {
    var n = cfg.day === 3 ? 3 : 4;
    var env = { a: cfg.a || 4, h: cfg.h || 4, t: 0 };
    var goc = { quay: -0.5, nghieng: 1.05 }; // nghiêng: góc nhìn từ trục đứng (0 = nhìn từ trên xuống)
    var ten = n === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    var holder = el('div', { class: 'chop' }), info = el('div', { class: 'dt-tong' });
    container.appendChild(holder);

    function project(p, k) {
      var c = Math.cos(goc.quay), s = Math.sin(goc.quay);
      var x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c, z = p[2];
      var cn = Math.cos(goc.nghieng), sn = Math.sin(goc.nghieng);
      var len = y * cn + z * sn, depth = -y * sn + z * cn; // len: hướng lên trên màn hình; depth lớn = gần người nhìn
      return [W / 2 + x * k, H * 0.62 - len * k, depth];
    }

    function draw() {
      var m = T.soDoChop(n, env.a, env.h);
      var base = [];
      for (var i = 0; i < n; i++) {
        var phi = -Math.PI / 2 - Math.PI / n + 2 * Math.PI * i / n;
        base.push([m.R * Math.cos(phi), m.R * Math.sin(phi), 0]);
      }
      var S = [0, 0, env.h];
      var alpha = Math.atan2(env.h, m.r); // góc giữa mặt bên và mặt đáy
      // Mỗi mặt bên có đỉnh riêng: xoay quanh cạnh đáy từ vị trí S (t=0) tới nằm phẳng ra ngoài (t=1)
      var faces = base.map(function (P, i) {
        var Q = base[(i + 1) % n], M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, 0];
        var len = Math.hypot(M[0], M[1]), out = [M[0] / len, M[1] / len, 0];
        var beta = (1 - env.t) * (Math.PI - alpha);
        var apex = [M[0] + m.trungDoan * Math.cos(beta) * out[0], M[1] + m.trungDoan * Math.cos(beta) * out[1], m.trungDoan * Math.sin(beta)];
        return { pts: [P, Q, apex], mau: MAU_BEN[i % 4] };
      });
      var span = Math.max(m.R + (env.t > 0 ? m.trungDoan * env.t : 0), env.h * 0.8, 1);
      var k = Math.min(W, H) * 0.42 / span;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', class: 'chop-svg', style: 'max-width:' + W + 'px;touch-action:none;cursor:grab' });
      var pr = function (p) { var q = project(p, k); return q; };
      var all = [{ pts: base, mau: MAU_DAY, day: true }].concat(faces);
      all.forEach(function (f) { var ps = f.pts.map(pr); f.depth = ps.reduce(function (a, q) { return a + q[2]; }, 0) / ps.length; f.ps = ps; });
      all.sort(function (a, b) { return a.depth - b.depth; });
      all.forEach(function (f) {
        s.appendChild(svg('polygon', { points: f.ps.map(function (q) { return q[0] + ',' + q[1]; }).join(' '),
          fill: f.mau, 'fill-opacity': env.t > 0.02 ? 0.92 : 0.55, stroke: '#343a40', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      });
      if (env.t < 0.02) {
        var Sp = pr(S), O = pr([0, 0, 0]);
        if (cfg.hienDuongCao !== false) {
          s.appendChild(svg('line', { x1: Sp[0], y1: Sp[1], x2: O[0], y2: O[1], stroke: '#c2255c', 'stroke-width': 2, 'stroke-dasharray': '6 4' }));
          lbl(s, O, 'H', '#c2255c', 6, 18);
        }
        if (cfg.hienTrungDoan) {
          var M0 = pr([(base[0][0] + base[1][0]) / 2, (base[0][1] + base[1][1]) / 2, 0]);
          s.appendChild(svg('line', { x1: Sp[0], y1: Sp[1], x2: M0[0], y2: M0[1], stroke: '#1971c2', 'stroke-width': 3 }));
          lbl(s, M0, 'M', '#1971c2', 4, 20);
        }
        lbl(s, Sp, 'S', '#343a40', -6, -10);
      }
      base.forEach(function (P, i) { var q = pr(P); lbl(s, q, ten[i], '#343a40', q[0] < W / 2 ? -20 : 8, 16); });
      holder.innerHTML = '';
      holder.appendChild(s);
      bindDrag(s);
      var f = T.fmtSo;
      info.innerHTML = cfg.an ? '' :
        'Cạnh đáy ' + T.tex('a') + ' = <b>' + f(env.a) + '</b> · chiều cao ' + T.tex('SH = h') + ' = <b>' + f(env.h) + '</b> · trung đoạn ' + T.tex('d') + ' ≈ <b>' + f(m.trungDoan) + '</b><br>' +
        T.tex('S_{xq} = p \\cdot d') + ' ≈ <b>' + f(m.Sxq) + '</b> &nbsp; · &nbsp; ' + T.tex('V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h') + ' ≈ <b>' + f(m.V) + '</b>';
    }
    function lbl(s, q, txt, mau, dx, dy) {
      var t = svg('text', { x: q[0] + dx, y: q[1] + dy, fill: mau, 'font-size': 20, 'font-weight': 700 });
      t.textContent = txt;
      s.appendChild(t);
    }
    function bindDrag(s) {
      var start = null;
      s.addEventListener('pointerdown', function (e) { start = { x: e.clientX, y: e.clientY, q: goc.quay, n: goc.nghieng }; s.setPointerCapture(e.pointerId); });
      s.addEventListener('pointermove', function (e) {
        if (!start) return;
        goc.quay = start.q - (e.clientX - start.x) / 120;
        goc.nghieng = Math.min(1.5, Math.max(0.2, start.n - (e.clientY - start.y) / 160));
        draw();
      });
      s.addEventListener('pointerup', function () { start = null; });
    }
    var list = [];
    if (cfg.thanhTruot !== false) list.push({ ten: 'a', nhan: 'Cạnh đáy', min: 2, max: 8, buoc: 0.5, gt: env.a }, { ten: 'h', nhan: 'Chiều cao', min: 1, max: 8, buoc: 0.5, gt: env.h });
    if (cfg.trai !== false) list.push({ ten: 't', nhan: 'Trải phẳng', min: 0, max: 1, buoc: 0.05, gt: 0 });
    container.appendChild(el('p', { class: 'goi-y-nho' }, 'Kéo chuột trên hình để xoay.'));
    if (list.length) container.appendChild(T.makeSliders(list, env, draw));
    container.appendChild(info);
    draw();
    return holder;
  };
})(window.TOAN8);
