// Widget cảnh: vẽ một cảnh trong js/canh/, có thanh tua, thanh đổi số, các bước sáng theo t, tự chạy lặp (T.tuChay) và chạm là dừng.
(function (T) {
  'use strict';
  var el = T.el, C = T.canh;
  // Một vòng tự chạy: đứng, chạy tới, đứng, chạy về
  var VONG = 9, DUNG_DAU = 0.14, CHAY = 0.32, DUNG_CUOI = 0.22;

  function tuVong(p) {
    if (p < DUNG_DAU) return 0;
    if (p < DUNG_DAU + CHAY) return (p - DUNG_DAU) / CHAY;
    if (p < DUNG_DAU + CHAY + DUNG_CUOI) return 1;
    return 1 - (p - DUNG_DAU - CHAY - DUNG_CUOI) / CHAY;
  }
  function macDinh(canh, thamSo) {
    var p = {};
    Object.keys(canh.thamSo || {}).forEach(function (k) { p[k] = canh.thamSo[k].md; });
    Object.keys(thamSo || {}).forEach(function (k) { p[k] = thamSo[k]; });
    return p;
  }
  function veLai(svg, canh, p, t, tuyChon) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    canh.ve(svg, canh.tinh(p, t, tuyChon || {}), p, t, tuyChon || {});
  }
  function taoSvg(moTa) { return C.mk('svg', { class: 'c-svg', role: 'img', 'aria-label': moTa || 'Hình minh họa' }); }

  // Một khung tĩnh, dùng cho hình nhỏ ở trang chủ
  C.veTinh = function (chua, ten, tuyChon, t, thamSo) {
    var canh = C.lay(ten), svg = taoSvg();
    veLai(svg, canh, macDinh(canh, thamSo), t, tuyChon);
    chua.appendChild(svg);
    return svg;
  };

  T.widgets.canh = function (chua, cfg) {
    var canh = C.lay(cfg.ten), p = macDinh(canh, cfg.thamSo), t = cfg.t || 0;
    var khung = el('div', { class: 'c-khung' }), svg = taoSvg(cfg.moTa);
    khung.appendChild(svg);
    chua.appendChild(khung);
    var tua = null, cacBuoc = [], nhanSo = {}, inputSo = {}, dauVong = 0, dieuKhien = null;

    function capNhat() {
      veLai(svg, canh, p, t, cfg.tuyChon);
      if (tua) tua.value = Math.round(t * 100);
      var dang = -1;
      (cfg.buoc || []).forEach(function (b, i) { if (t >= b.t - 1e-9) dang = i; });
      cacBuoc.forEach(function (li, i) { li.classList.toggle('dang', i === dang); });
      Object.keys(nhanSo).forEach(function (k) { nhanSo[k].textContent = C.fmt(p[k]); inputSo[k].value = p[k]; });
    }

    if (cfg.buoc && cfg.buoc.length) {
      var ds = el('ol', { class: 'c-buoc' });
      cfg.buoc.forEach(function (b) {
        var li = el('li', { html: T.md(b.chu).replace(/^<p>|<\/p>$/g, '') });
        li.addEventListener('click', function () { dung(); t = b.t; capNhat(); });
        ds.appendChild(li);
        cacBuoc.push(li);
      });
      (cfg.choBuoc || chua).appendChild(ds);
    }
    if (!cfg.chiXem) {
      var dk = el('div', { class: 'c-dk' });
      tua = el('input', { type: 'range', min: 0, max: 100, value: 0, 'aria-label': 'Tua hình' });
      tua.addEventListener('input', function () { t = tua.value / 100; capNhat(); });
      dk.appendChild(el('label', { class: 'c-dong' }, el('span', null, 'Tua'), tua, el('span')));
      Object.keys(canh.thamSo || {}).forEach(function (k) {
        var s = canh.thamSo[k], inp = el('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: p[k], 'aria-label': s.nhan || k });
        inp.addEventListener('input', function () { p[k] = +inp.value; capNhat(); });
        inputSo[k] = inp;
        nhanSo[k] = el('output');
        dk.appendChild(el('label', { class: 'c-dong' }, el('span', { style: s.mau ? 'color:var(' + s.mau + ')' : null }, s.nhan || k), inp, nhanSo[k]));
      });
      khung.appendChild(dk);
    }
    capNhat();

    if (cfg.tuChay !== false && !cfg.chiXem && T.tuChay) {
      dieuKhien = T.tuChay.dangKi(khung, {
        buoc: function (dt) {
          dauVong = (dauVong + dt / VONG) % 1;
          t = tuVong(dauVong);
          capNhat();
        }
      });
    }
    function dung() { if (dieuKhien) dieuKhien.dungLai(); }

    return {
      datT: function (v) { dung(); t = C.kep(v, 0, 1); dauVong = DUNG_DAU + CHAY * t; capNhat(); },
      datThamSo: function (o) { dung(); Object.keys(o).forEach(function (k) { p[k] = o[k]; }); capNhat(); },
      datTrangThai: function (ten) { dung(); p.trangThai = ten; capNhat(); },
      layT: function () { return t; },
      dung: dung,
      huy: function () { dung(); khung.remove(); }
    };
  };
})(window.TOAN8);
