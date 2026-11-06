// Widget cảnh: vẽ một cảnh trong js/canh/, có thanh tua, thanh đổi số, các bước sáng theo t, tự chạy lặp (T.tuChay) và chạm là dừng.
// Thử phá: tham số có pha: true chỉ hiện khi cfg.thuPha; cảnh trả k.pha = { hong, chu } để báo công thức còn đúng hay hỏng.
// Soi chi tiết: phần tử SVG có data-soi="khoá"; bấm vào thì hiện thẻ lấy từ canh.soi(k, p, o)[khoá], cfg.soi ghi đè.
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
    var k = canh.tinh(p, t, tuyChon || {});
    canh.ve(svg, k, p, t, tuyChon || {});
    return k;
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
    var dongSo = cfg.dongSo ? khung.appendChild(el('div', { class: 'c-so' })) : null, dongCu = null;
    var oPha = cfg.thuPha ? khung.appendChild(el('div', { class: 'c-pha', role: 'status' })) : null, phaCu = null;
    var oSoi = khung.appendChild(el('div', { class: 'c-soi', hidden: true, role: 'status' })), soiDang = null, kHienTai = null;
    if (cfg.ghiChu) khung.appendChild(el('p', { class: 'c-ghi-chu' }, cfg.ghiChu));

    function capNhat() {
      kHienTai = veLai(svg, canh, p, t, cfg.tuyChon);
      if (oPha) {
        var ph = kHienTai && kHienTai.pha, moiPha = ph ? (ph.hong ? 'h' : 'd') + ph.chu : '';
        if (moiPha !== phaCu) { phaCu = moiPha; oPha.className = 'c-pha' + (ph && ph.hong ? ' hong' : ''); oPha.innerHTML = ph ? T.md((ph.hong ? '✗ ' : '✓ ') + ph.chu) : ''; }
      }
      if (soiDang) hienSoi(soiDang);
      if (tua) tua.value = Math.round(t * 100);
      if (cfg.khiDoiT) cfg.khiDoiT(t);
      var dang = -1;
      (cfg.buoc || []).forEach(function (b, i) { if (t >= b.t - 1e-9) dang = i; });
      cacBuoc.forEach(function (li, i) { li.classList.toggle('dang', i === dang); });
      Object.keys(nhanSo).forEach(function (k) { nhanSo[k].textContent = C.fmt(p[k]); inputSo[k].value = p[k]; });
      if (dongSo) {
        var moi = cfg.dongSo(p, C.fmt);
        if (moi !== dongCu) { dongCu = moi; dongSo.innerHTML = T.md(moi); }
      }
    }

    if (cfg.buoc && cfg.buoc.length) {
      var ds = el('ol', { class: 'c-buoc' });
      cfg.buoc.forEach(function (b) {
        var li = el('li', { html: T.md(b.chu).replace(/^<p>|<\/p>$/g, '') });
        li.addEventListener('click', function () { dung(); dat(b.t); });
        ds.appendChild(li);
        cacBuoc.push(li);
      });
      (cfg.choBuoc || chua).appendChild(ds);
    }
    if (!cfg.chiXem) {
      var dk = el('div', { class: 'c-dk' });
      tua = el('input', { type: 'range', min: 0, max: 100, value: 0, 'aria-label': 'Tua hình' });
      tua.addEventListener('input', function () { dat(tua.value / 100); });
      dk.appendChild(el('label', { class: 'c-dong' }, el('span', null, 'Tua'), tua, el('span')));
      var coPha = false;
      Object.keys(canh.thamSo || {}).forEach(function (k) {
        var s = canh.thamSo[k];
        if (s.pha && !cfg.thuPha) return;
        if (s.pha && !coPha) { coPha = true; dk.appendChild(el('div', { class: 'c-nhom-pha' }, 'Thử phá: kéo ra ngoài điều kiện của định lí')); }
        var inp = el('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: p[k], 'aria-label': s.nhan || k });
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
          dauVong = (dauVong + dt / (cfg.giay || VONG)) % 1;
          t = tuVong(dauVong);
          capNhat();
        }
      });
    }
    function dung() { if (dieuKhien) dieuKhien.dungLai(); }
    // Thẻ soi: tên, số đo hiện tại và vì sao; số đo lấy theo hình đang hiện nên tự đổi khi kéo thanh
    function hienSoi(khoa) {
      var bang = {}, goc = canh.soi ? canh.soi(kHienTai, p, cfg.tuyChon || {}) || {} : {};
      Object.keys(goc).forEach(function (x) { bang[x] = goc[x]; });
      Object.keys(cfg.soi || {}).forEach(function (x) { bang[x] = cfg.soi[x]; });
      var m = bang[khoa];
      if (!m) { oSoi.hidden = true; soiDang = null; return; }
      soiDang = khoa;
      oSoi.hidden = false;
      oSoi.innerHTML = '<b>' + T.mdInline(m.tieuDe || khoa) + '</b> ' + T.md(m.chu || '').replace(/^<p>|<\/p>$/g, '');
      oSoi.appendChild(el('button', { class: 'c-soi-dong', type: 'button', 'aria-label': 'Đóng', onclick: function () { oSoi.hidden = true; soiDang = null; } }, '✕'));
    }
    svg.addEventListener('click', function (e) {
      var n = e.target.closest ? e.target.closest('[data-soi]') : null;
      // Hình trong đề (chiXem: Dùng, Suy ra, lời giải) không soi, kẻo thẻ soi đọc ra đáp số
      if (n && !cfg.chiXem) hienSoi(n.getAttribute('data-soi'));
    });
    // Đặt t và dời vị trí trong vòng tự chạy theo, để bấm Tự chạy lại không làm hình nhảy
    function dat(v) { t = C.kep(v, 0, 1); dauVong = DUNG_DAU + CHAY * t; capNhat(); }

    return {
      datT: function (v) { dung(); dat(v); },
      datThamSo: function (o) { dung(); Object.keys(o).forEach(function (k) { p[k] = o[k]; }); capNhat(); },
      datTrangThai: function (ten) { dung(); p.trangThai = ten; capNhat(); },
      layT: function () { return t; },
      layKetQua: function () { return kHienTai; },
      soi: function (khoa) { hienSoi(khoa); },
      dung: dung,
      svg: svg,
      huy: function () { dung(); khung.remove(); }
    };
  };
})(window.TOAN8);
