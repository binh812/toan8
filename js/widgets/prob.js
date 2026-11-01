// Thí nghiệm xác suất: tung đồng xu / gieo xúc xắc / rút bóng trong túi / quay vòng quay, đếm số lần biến cố xảy ra
// và so xác suất thực nghiệm với xác suất lí thuyết khi số lần thử tăng dần.
(function (T) {
  'use strict';
  var el = T.el, NS = 'http://www.w3.org/2000/svg';
  var MAT_XX = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  // Danh sách kết quả có thể (mỗi phần tử cùng khả năng xảy ra)
  function ketQua(cfg) {
    if (cfg.loai === 'dongXu') return [{ ten: 'S', hien: 'Sấp' }, { ten: 'N', hien: 'Ngửa' }];
    if (cfg.loai === 'xucXac') return [1, 2, 3, 4, 5, 6].map(function (k) { return { ten: k, hien: MAT_XX[k - 1] + ' ' + k }; });
    if (cfg.loai === 'theSo') {
      var a = cfg.tu || 1, b = cfg.den || 10, r = [];
      for (var k = a; k <= b; k++) r.push({ ten: k, hien: String(k) });
      return r;
    }
    // tui / vongQuay: [{ten, so, mau}] – mỗi quả bóng (ô) là một kết quả
    var out = [];
    (cfg.tui || []).forEach(function (g) { for (var i = 0; i < g.so; i++) out.push({ ten: g.ten, hien: g.ten, mau: g.mau }); });
    return out;
  }

  // cfg: { loai: 'dongXu'|'xucXac'|'tui'|'theSo'|'vongQuay', tui?:[{ten, so, mau}], tu?, den?,
  //        suKien?: { ten, thuanLoi: [tên kết quả…] }, anLiThuyet?: bool }
  T.widgets.xacSuat = function (container, cfg) {
    var kq = ketQua(cfg), sk = cfg.suKien;
    var thuan = function (x) { return sk && sk.thuanLoi.indexOf(x.ten) >= 0; };
    var nThuan = kq.filter(thuan).length;
    var dem = 0, co = 0, lichSu = [], cuoi = null;
    var root = el('div', { class: 'xac-suat' });
    var hien = el('div', { class: 'xs-hien', 'aria-live': 'polite' });
    var thongKe = el('div', { class: 'dt-tong' });
    var hinh = el('div');
    var nut = el('div', { class: 'xs-nut' });
    [1, 10, 100, 1000].forEach(function (k) {
      nut.appendChild(el('button', { class: 'btn' + (k === 1 ? ' primary' : ''), type: 'button', onclick: function () { thu(k); } }, k === 1 ? 'Thử 1 lần' : 'Thử ' + k + ' lần'));
    });
    nut.appendChild(el('button', { class: 'btn', type: 'button', onclick: function () { dem = co = 0; lichSu = []; cuoi = null; ve(); } }, 'Làm lại'));
    // danh sách kết quả có thể, tô màu kết quả thuận lợi
    var ds = el('div', { class: 'xs-ds' });
    kq.forEach(function (x) {
      ds.appendChild(el('span', { class: 'xs-o' + (thuan(x) ? ' thuan' : ''), style: !x.mau ? '' : thuan(x) ? 'border-color:' + x.mau + ';background:' + x.mau : 'border-color:' + x.mau + ';color:' + x.mau }, x.hien));
    });
    root.appendChild(el('div', { class: 'xs-nhan' }, 'Các kết quả có thể' + (sk ? ' (ô tô đậm là kết quả thuận lợi cho biến cố "' + sk.ten + '")' : '') + ':'));
    root.appendChild(ds);
    root.appendChild(nut);
    root.appendChild(hien);
    root.appendChild(thongKe);
    root.appendChild(hinh);
    container.appendChild(root);

    function thu(k) {
      for (var i = 0; i < k; i++) {
        cuoi = kq[Math.floor(Math.random() * kq.length)];
        dem++;
        if (thuan(cuoi)) co++;
        if (dem <= 50 || dem % Math.ceil(dem / 200) === 0) lichSu.push([dem, co / dem]);
      }
      ve();
    }

    function ve() {
      hien.innerHTML = '';
      if (cuoi) hien.appendChild(el('span', { class: 'xs-cuoi' + (thuan(cuoi) ? ' thuan' : ''), style: cuoi.mau ? 'background:' + cuoi.mau + ';color:#fff' : '' }, cuoi.hien));
      var f = T.fmtSo;
      var lt = sk ? nThuan + '/' + kq.length : '';
      thongKe.innerHTML = !sk ? 'Đã thử <b>' + dem + '</b> lần.' :
        'Đã thử <b>' + dem + '</b> lần, biến cố "' + sk.ten + '" xảy ra <b>' + co + '</b> lần → xác suất thực nghiệm ' +
        T.tex('\\frac{' + co + '}{' + (dem || 1) + '}') + ' ≈ <b>' + (dem ? f(co / dem, 3) : '…') + '</b>' +
        (cfg.anLiThuyet ? '' : '<br>Xác suất (lí thuyết) = ' + T.tex('\\frac{' + nThuan + '}{' + kq.length + '}') + ' ≈ <b>' + f(nThuan / kq.length, 3) + '</b>');
      hinh.innerHTML = '';
      if (sk && lichSu.length > 1) hinh.appendChild(doThi(lt));
    }

    // Đường xác suất thực nghiệm theo số lần thử, so với đường ngang xác suất lí thuyết
    function doThi() {
      var W = 560, H = 200, x0 = 46, y0 = H - 28, x1 = W - 10, y1 = 12, n = lichSu[lichSu.length - 1][0];
      var s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', '0 0 ' + W + ' ' + H); s.setAttribute('width', '100%'); s.setAttribute('style', 'max-width:' + W + 'px');
      var X = function (k) { return x0 + (x1 - x0) * k / n; }, Y = function (p) { return y0 - (y0 - y1) * p; };
      var add = function (tag, a, txt) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; s.appendChild(e); };
      [0, 0.5, 1].forEach(function (p) { add('line', { x1: x0, y1: Y(p), x2: x1, y2: Y(p), stroke: '#dee2e6' }); add('text', { x: x0 - 6, y: Y(p) + 5, 'text-anchor': 'end', 'font-size': 13 }, T.fmtSo(p)); });
      if (!cfg.anLiThuyet) add('line', { x1: x0, y1: Y(nThuan / kq.length), x2: x1, y2: Y(nThuan / kq.length), stroke: '#2f9e44', 'stroke-width': 2, 'stroke-dasharray': '6 4' });
      add('polyline', { points: lichSu.map(function (q) { return X(q[0]) + ',' + Y(q[1]); }).join(' '), fill: 'none', stroke: '#c2255c', 'stroke-width': 2.5 });
      add('text', { x: x1, y: H - 6, 'text-anchor': 'end', 'font-size': 13 }, 'số lần thử: ' + n);
      return s;
    }
    ve();
    return root;
  };
})(window.TOAN8);
