// Tự chạy hình động: bắt đầu khi hình hiện trên màn hình, dừng khi em chạm vào; nút ▶/⏸ ở góc hình.
// Mỗi hình đăng kí một "trình" { buoc(dt), dung?() }; buoc được gọi mỗi khung hình (requestAnimationFrame) khi hình đang chạy.
(function (T) {
  'use strict';
  var el = T.el, ds = [], raf = null, last = 0;
  var giam = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function vong(ts) {
    raf = null;
    var dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
    last = ts;
    var con = false;
    ds.forEach(function (m) {
      if (m.tt !== 'chay' || !m.hien || document.hidden) return;
      con = true;
      try { m.trinh.buoc(dt); } catch (e) { console.error('Tự chạy lỗi', e); dat(m, 'dung'); }
    });
    if (con) raf = requestAnimationFrame(vong); else last = 0;
  }
  function keo() { if (!raf) raf = requestAnimationFrame(vong); }

  function dat(m, tt) {
    if (m.tt === tt) return;
    if (m.tt === 'chay' && m.trinh.dung) m.trinh.dung();
    m.tt = tt;
    m.nut.textContent = tt === 'chay' ? '⏸ Dừng' : '▶ Tự chạy';
    m.nut.setAttribute('aria-pressed', tt === 'chay' ? 'true' : 'false');
    if (tt === 'chay') keo();
  }

  function dangKi(khung, trinh) {
    khung.classList.add('co-tu-chay');
    var nut = el('button', { class: 'nut-tu-chay', type: 'button', 'aria-pressed': 'false' }, '▶ Tự chạy');
    var m = { khung: khung, trinh: trinh, tt: 'cho', hien: false, nut: nut };
    nut.addEventListener('click', function () { m.hien = true; dat(m, m.tt === 'chay' ? 'dung' : 'chay'); });
    khung.appendChild(nut);
    // chỉ thao tác thật của em (isTrusted) mới dừng; sự kiện do tự chạy phát ra thì không
    var thatSu = function (e) {
      if (!e.isTrusted || e.target === nut || nut.contains(e.target)) return;
      dat(m, 'dung');
    };
    ['pointerdown', 'keydown', 'wheel', 'input'].forEach(function (t) { khung.addEventListener(t, thatSu, true); });
    if ('IntersectionObserver' in window) {
      m.ob = new IntersectionObserver(function (en) {
        m.hien = en[en.length - 1].intersectionRatio >= 0.5;
        if (m.hien && m.tt === 'cho' && !giam) dat(m, 'chay');
        if (m.hien) keo();
      }, { threshold: [0, 0.5] });
      m.ob.observe(khung);
    } else { m.hien = true; if (!giam) dat(m, 'chay'); }
    ds.push(m);
    return { trangThai: function () { return m.tt; }, batLai: function () { m.hien = true; dat(m, 'chay'); }, dungLai: function () { dat(m, 'dung'); } };
  }

  function huyHet() {
    ds.forEach(function (m) { if (m.ob) m.ob.disconnect(); if (m.tt === 'chay' && m.trinh.dung) m.trinh.dung(); });
    ds = [];
    if (raf) cancelAnimationFrame(raf);
    raf = null; last = 0;
  }

  // Lần lượt từng tác tử (mỗi cái `giay` giây), nghỉ `nghi` giây giữa hai tác tử, lặp mãi.
  function noiTiep(tacTu, nghi) {
    nghi = nghi == null ? 0.8 : nghi;
    var i = 0, t = 0, dangNghi = true;
    return {
      buoc: function (dt) {
        if (!tacTu.length) return;
        t += dt;
        if (dangNghi) { if (t >= nghi) { dangNghi = false; t = 0; if (tacTu[i].batDau) tacTu[i].batDau(); } return; }
        var a = tacTu[i], p = Math.min(1, t / a.giay);
        a.buoc(p);
        if (p >= 1) { if (a.ketThuc) a.ketThuc(); i = (i + 1) % tacTu.length; t = 0; dangNghi = true; }
      },
      dung: function () { var a = tacTu[i]; if (!dangNghi && a && a.ketThuc) a.ketThuc(); dangNghi = true; t = 0; }
    };
  }

  // Sóng: giá trị đầu → max → min → giá trị đầu theo tiến độ p ∈ [0, 1]
  function song(p, v0, mn, mx) {
    return p < 0.25 ? v0 + (mx - v0) * (p / 0.25) : p < 0.75 ? mx + (mn - mx) * ((p - 0.25) / 0.5) : mn + (v0 - mn) * ((p - 0.75) / 0.25);
  }

  // Thanh trượt HTML: chạy sóng, làm tròn theo bước, phát sự kiện input như người dùng (rangBuoc vẫn áp dụng).
  function datRange(inp, v) {
    var mn = Number(inp.min), mx = Number(inp.max), st = Number(inp.step) || 0.1;
    var s = +(Math.round((v - mn) / st) * st + mn).toFixed(6);
    s = Math.max(mn, Math.min(mx, s));
    if (String(s) !== inp.value) { inp.value = s; inp.dispatchEvent(new Event('input', { bubbles: true })); }
  }
  function tacTuThanhTruot(inp) {
    var v0;
    return {
      ten: 'thanh ' + (inp.getAttribute('data-ten') || ''), giay: 4,
      batDau: function () { v0 = Number(inp.value); },
      buoc: function (p) { datRange(inp, song(p, v0, Number(inp.min), Number(inp.max))); },
      ketThuc: function () { datRange(inp, v0); }
    };
  }

  // Bộ tìm tác tử: mỗi hàm (khung, tênWidget, config) → [tác tử]; Task sau thêm JSXGraph, xác suất, hình chóp…
  var boTacTu = [function (khung, ten) {
    if (ten === 'hinhChop') return []; // hình chóp có bộ riêng (xen kẽ xoay)
    return [].slice.call(khung.querySelectorAll('input[type=range]')).map(tacTuThanhTruot);
  }];

  function tacTu(khung, ten, config) {
    var out = [];
    boTacTu.forEach(function (f) { out = out.concat(f(khung, ten, config) || []); });
    return out;
  }

  // Dựng trình mặc định (hoặc kịch bản config.tuChay) cho một hình vừa gắn vào khung; không có gì để chạy thì thôi.
  function tuDong(khung, ten, config) {
    config = config || {};
    if (config.tuChay === false) return null;
    var trinh = Array.isArray(config.tuChay) && T.tuChay.kichBan ? T.tuChay.kichBan(khung, config.tuChay) : null;
    if (!trinh) {
      var tt = tacTu(khung, ten, config);
      if (!tt.length) return null;
      trinh = noiTiep(tt);
    }
    return dangKi(khung, trinh);
  }

  T.tuChay = {
    dangKi: dangKi, huyHet: huyHet, noiTiep: noiTiep, tuDong: tuDong, tacTu: tacTu, song: song,
    tacTuThanhTruot: tacTuThanhTruot, datRange: datRange,
    themTacTu: function (f) { boTacTu.push(f); },
    soDangChay: function () { return ds.filter(function (m) { return m.tt === 'chay'; }).length; }
  };
})(window.TOAN8);
