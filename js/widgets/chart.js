// Biểu đồ thống kê (SVG): cột, cột kép, đoạn thẳng, hình quạt tròn; có nút đổi loại biểu đồ và bảng số liệu.
(function (T) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', el = T.el, W = 600, H = 360;
  var MAU = ['#1971c2', '#e8590c', '#2f9e44', '#9c36b5', '#f08c00', '#0c8599', '#c2255c', '#5c940d'];
  var TEN_LOAI = { cot: 'Biểu đồ cột', cotKep: 'Biểu đồ cột kép', duong: 'Biểu đồ đoạn thẳng', tron: 'Biểu đồ hình quạt tròn' };

  function svg(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function fmt(v) { return T.fmtSo(v, 2); }
  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }

  function truc(s, max, x0, y0, x1, y1, donVi) {
    for (var i = 0; i <= 5; i++) {
      var v = max * i / 5, y = y0 - (y0 - y1) * i / 5;
      s.appendChild(svg('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: i ? '#e9ecef' : '#343a40', 'stroke-width': i ? 1 : 2 }));
      s.appendChild(svg('text', { x: x0 - 8, y: y + 5, 'text-anchor': 'end', 'font-size': 14, fill: '#495057' }, fmt(v)));
    }
    s.appendChild(svg('line', { x1: x0, y1: y0, x2: x0, y2: y1 - 10, stroke: '#343a40', 'stroke-width': 2 }));
    if (donVi) s.appendChild(svg('text', { x: x0 - 8, y: y1 - 18, 'text-anchor': 'start', 'font-size': 14, fill: '#495057' }, '(' + donVi + ')'));
  }

  function veCot(s, cfg, kep) {
    var chuoi = kep ? cfg.chuoi : cfg.chuoi.slice(0, 1), nh = cfg.nhan.length;
    var max = niceMax(Math.max.apply(null, chuoi.map(function (c) { return Math.max.apply(null, c.so); })));
    var x0 = 70, y0 = H - 50, x1 = W - 20, y1 = 40, bw = (x1 - x0) / nh;
    truc(s, max, x0, y0, x1, y1, cfg.donVi);
    var w = bw * 0.7 / chuoi.length;
    cfg.nhan.forEach(function (nhan, i) {
      chuoi.forEach(function (c, j) {
        var v = c.so[i], h = (y0 - y1) * v / max, x = x0 + bw * i + bw * 0.15 + w * j;
        var r = svg('rect', { x: x, y: y0 - h, width: w - 2, height: h, fill: c.mau || MAU[j], rx: 3 });
        r.appendChild(svg('title', {}, (c.ten ? c.ten + ' – ' : '') + nhan + ': ' + fmt(v)));
        s.appendChild(r);
        s.appendChild(svg('text', { x: x + w / 2 - 1, y: y0 - h - 6, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#343a40' }, fmt(v)));
      });
      s.appendChild(svg('text', { x: x0 + bw * (i + 0.5), y: y0 + 22, 'text-anchor': 'middle', 'font-size': 14 }, nhan));
    });
  }

  function veDuong(s, cfg) {
    var nh = cfg.nhan.length;
    var max = niceMax(Math.max.apply(null, cfg.chuoi.map(function (c) { return Math.max.apply(null, c.so); })));
    var x0 = 70, y0 = H - 50, x1 = W - 30, y1 = 40, bw = (x1 - x0) / nh;
    truc(s, max, x0, y0, x1, y1, cfg.donVi);
    cfg.chuoi.forEach(function (c, j) {
      var pts = c.so.map(function (v, i) { return [x0 + bw * (i + 0.5), y0 - (y0 - y1) * v / max]; });
      s.appendChild(svg('polyline', { points: pts.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: c.mau || MAU[j], 'stroke-width': 3 }));
      pts.forEach(function (p, i) {
        s.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 5, fill: c.mau || MAU[j] }));
        s.appendChild(svg('text', { x: p[0], y: p[1] - 10, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700 }, fmt(c.so[i])));
      });
    });
    cfg.nhan.forEach(function (nhan, i) { s.appendChild(svg('text', { x: x0 + bw * (i + 0.5), y: y0 + 22, 'text-anchor': 'middle', 'font-size': 14 }, nhan)); });
  }

  function veTron(s, cfg) {
    var so = cfg.chuoi[0].so, tong = so.reduce(function (a, b) { return a + b; }, 0);
    var cx = 190, cy = H / 2, R = 140, goc = -Math.PI / 2;
    so.forEach(function (v, i) {
      var g = 2 * Math.PI * v / (tong || 1), g2 = goc + g, mau = MAU[i % MAU.length];
      var p1 = [cx + R * Math.cos(goc), cy + R * Math.sin(goc)], p2 = [cx + R * Math.cos(g2), cy + R * Math.sin(g2)];
      var d = g >= 2 * Math.PI - 1e-9 ? 'M' + (cx - R) + ',' + cy + 'a' + R + ',' + R + ' 0 1,0 ' + 2 * R + ',0a' + R + ',' + R + ' 0 1,0 ' + -2 * R + ',0'
        : 'M' + cx + ',' + cy + 'L' + p1 + 'A' + R + ',' + R + ' 0 ' + (g > Math.PI ? 1 : 0) + ',1 ' + p2 + 'Z';
      s.appendChild(svg('path', { d: d, fill: mau, stroke: '#fff', 'stroke-width': 2 }));
      var m = goc + g / 2, pt = Math.round(1000 * v / (tong || 1)) / 10;
      if (g > 0.25) s.appendChild(svg('text', { x: cx + R * 0.65 * Math.cos(m), y: cy + R * 0.65 * Math.sin(m) + 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#fff' }, fmt(pt) + '%'));
      s.appendChild(svg('rect', { x: 370, y: 40 + i * 30, width: 18, height: 18, fill: mau, rx: 3 }));
      s.appendChild(svg('text', { x: 396, y: 55 + i * 30, 'font-size': 15 }, cfg.nhan[i] + ' (' + fmt(pt) + '%)'));
      goc = g2;
    });
  }

  function bang(cfg) {
    var t = el('table', { class: 'bang-so-lieu' });
    var head = el('tr', null, el('th', null, cfg.tenNhan || ''));
    cfg.nhan.forEach(function (n) { head.appendChild(el('th', null, n)); });
    t.appendChild(head);
    cfg.chuoi.forEach(function (c) {
      var tr = el('tr', null, el('th', null, c.ten || cfg.tenSo || 'Số liệu'));
      c.so.forEach(function (v) { tr.appendChild(el('td', null, fmt(v))); });
      t.appendChild(tr);
    });
    return t;
  }

  // cfg: { loai: 'cot'|'cotKep'|'duong'|'tron', tieuDe?, nhan:[…], chuoi:[{ten?, so:[…], mau?}], donVi?,
  //        doiLoai?: ['cot','tron',…] (nút đổi loại), hienBang?: bool, tenNhan?, tenSo? }
  T.widgets.bieuDo = function (container, cfg) {
    var loai = cfg.loai || 'cot';
    var root = el('div', { class: 'bieu-do' }), holder = el('div');
    if (cfg.doiLoai && cfg.doiLoai.length > 1) {
      var nut = el('div', { class: 'doi-loai' });
      cfg.doiLoai.forEach(function (l) {
        nut.appendChild(el('button', { class: 'btn' + (l === loai ? ' primary' : ''), type: 'button', onclick: function () {
          loai = l;
          [].forEach.call(nut.children, function (b) { b.classList.toggle('primary', b.textContent === TEN_LOAI[l]); });
          draw();
        } }, TEN_LOAI[l]));
      });
      root.appendChild(nut);
    }
    root.appendChild(holder);
    if (cfg.hienBang) root.appendChild(bang(cfg));
    container.appendChild(root);
    function draw() {
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: 'max-width:' + W + 'px', role: 'img', 'aria-label': (cfg.tieuDe || TEN_LOAI[loai]) });
      if (cfg.tieuDe) s.appendChild(svg('text', { x: W / 2, y: 22, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700 }, cfg.tieuDe));
      if (loai === 'tron') veTron(s, cfg); else if (loai === 'duong') veDuong(s, cfg); else veCot(s, cfg, loai === 'cotKep');
      holder.innerHTML = '';
      holder.appendChild(s);
      if (loai === 'cotKep' || (loai === 'duong' && cfg.chuoi.length > 1)) {
        var cg = el('div', { class: 'chu-giai' });
        cfg.chuoi.forEach(function (c, j) { cg.appendChild(el('span', null, el('i', { style: 'background:' + (c.mau || MAU[j]) }), c.ten || '')); });
        holder.appendChild(cg);
      }
    }
    draw();
    return root;
  };
})(window.TOAN8);
