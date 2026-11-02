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

  // ---------- JSXGraph: điểm kéo được, thanh trượt ----------
  function bangTrong(khung) {
    if (!window.JXG) return [];
    return Object.keys(JXG.boards).map(function (k) { return JXG.boards[k]; })
      .filter(function (b) { return b.containerObj && khung.contains(b.containerObj); });
  }
  // Kéo điểm như người dùng: moveTo rồi gọi các handler 'drag' (giữ ràng buộc của hình), kẹp trong khung nhìn.
  function keoDiem(b, p, x, y) {
    var bb = b.getBoundingBox(), mx = (bb[2] - bb[0]) * 0.04, my = (bb[1] - bb[3]) * 0.04;
    x = Math.max(bb[0] + mx, Math.min(bb[2] - mx, x));
    y = Math.max(bb[3] + my, Math.min(bb[1] - my, y));
    p.moveTo([x, y]);
    if (p.triggerEventHandlers) p.triggerEventHandlers(['drag'], [{ type: 'drag', tuChay: true }]);
    b.update();
  }
  function tacTuDiem(b, p) {
    var bb = b.getBoundingBox(), rx = (bb[2] - bb[0]) * 0.1, ry = (bb[1] - bb[3]) * 0.08, x0, y0;
    return { ten: 'điểm ' + p.name, giay: 4,
      batDau: function () { x0 = p.X(); y0 = p.Y(); },
      buoc: function (t) { var g = 2 * Math.PI * t; keoDiem(b, p, x0 + rx * Math.sin(g), y0 + ry * (1 - Math.cos(g))); },
      ketThuc: function () { keoDiem(b, p, x0, y0); } };
  }
  function tacTuSliderJXG(b, s) {
    var v0;
    return { ten: 'slider ' + s.name, giay: 4,
      batDau: function () { v0 = s.Value(); },
      buoc: function (p) { s.setValue(song(p, v0, s._smin, s._smax)); b.update(); },
      ketThuc: function () { s.setValue(v0); b.update(); } };
  }
  function keoDuoc(o) {
    return (o.elType === 'point' || o.elType === 'glider') && !o.visProp.fixed && o.visProp.visible !== false && o.isDraggable !== false;
  }
  boTacTu.push(function (khung) {
    var out = [];
    bangTrong(khung).forEach(function (b) {
      b.objectsList.forEach(function (o) {
        if (o.elType === 'slider' && o.visProp.visible !== false) out.push(tacTuSliderJXG(b, o));
        else if (keoDuoc(o)) out.push(tacTuDiem(b, o));
      });
    });
    return out.slice(0, 6);
  });

  // ---------- Widget có nút: xác suất, biểu đồ đổi loại, cắt và ghép ----------
  function nutCo(khung, re) {
    return [].slice.call(khung.querySelectorAll('button')).filter(function (b) { return re.test(b.textContent) && !b.classList.contains('nut-tu-chay'); })[0];
  }
  boTacTu.push(function (khung, ten) {
    if (ten !== 'xacSuat') return [];
    var dem = 0, hen = 0;
    return [{ ten: 'gieo', giay: 30,
      batDau: function () { dem = 0; hen = 0; var l = nutCo(khung, /Làm lại/); if (l) l.click(); },
      buoc: function (p) {
        var t = p * 30;
        if (t < hen) return;
        var n1 = nutCo(khung, /Thử 1 lần/), n10 = nutCo(khung, /Thử 10 lần/);
        if (dem < 20 && n1) { n1.click(); dem++; hen = t + 0.6; }
        else if (n10) { n10.click(); dem += 10; hen = t + 0.8; }
      } }];
  });
  boTacTu.push(function (khung, ten) {
    if (ten !== 'hinhChop') return [];
    var h = khung.querySelector('.chop');
    var xoay = { ten: 'xoay', giay: 3, buoc: function () { if (h && h.tuChayXoay) h.tuChayXoay(0.02); } };
    var out = [];
    [].slice.call(khung.querySelectorAll('input[type=range]')).forEach(function (inp) {
      var a = tacTuThanhTruot(inp), buoc = a.buoc;
      a.buoc = function (p) { buoc(p); if (h && h.tuChayXoay) h.tuChayXoay(0.01); }; // vừa trượt vừa xoay nhẹ
      out.push(xoay, a);
    });
    return out.length ? out : [xoay];
  });
  boTacTu.push(function (khung) {
    var out = [], nutLoai = [].slice.call(khung.querySelectorAll('.doi-loai button'));
    var dau = 0;
    // bắt đầu bằng loại kế tiếp loại đang hiện, mỗi loại 3 giây, hết vòng thì về loại ban đầu
    if (nutLoai.length > 1) out.push({ ten: 'đổi loại', giay: 3 * nutLoai.length,
      batDau: function () { dau = Math.max(0, nutLoai.findIndex(function (b) { return b.classList.contains('primary'); })); },
      buoc: function (p) {
        var k = (dau + 1 + Math.min(nutLoai.length - 1, Math.floor(p * nutLoai.length))) % nutLoai.length;
        if (!nutLoai[k].classList.contains('primary')) nutLoai[k].click();
      } });
    var cat = nutCo(khung, /Cắt và ghép|Trả về/);
    if (cat) out.push({ ten: 'cắt ghép', giay: 6, buoc: function (p) {
      if ((p < 0.5 ? /Cắt và ghép/ : /Trả về/).test(cat.textContent)) cat.click();
    } });
    return out;
  });

  // ---------- Kịch bản riêng: config.tuChay = [{ thanhTruot, den, giay } | { diem, den:[x,y], giay } | { nut } | { cho }] ----------
  function kichBan(khung, cacBuoc) {
    var bangs = bangTrong(khung);
    function timJXG(ten) {
      for (var i = 0; i < bangs.length; i++) {
        var o = bangs[i].objectsList.filter(function (x) { return x.name === ten && (x.elType === 'point' || x.elType === 'glider' || x.elType === 'slider'); })[0];
        if (o) return { b: bangs[i], o: o };
      }
      return null;
    }
    var tt = cacBuoc.map(function (s) {
      if (s.cho != null) return { ten: 'chờ', giay: s.cho, buoc: function () {} };
      if (s.nut) return { ten: 'nút', giay: 0.3, buoc: function (p) {
        if (p < 1) return;
        var re = new RegExp(String(s.nut).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), n = nutCo(khung, re);
        if (n) n.click();
      } };
      if (s.thanhTruot) {
        var inp = khung.querySelector('input[type=range][data-ten="' + s.thanhTruot + '"]'), j = inp ? null : timJXG(s.thanhTruot), v0 = 0;
        return { ten: 'thanh ' + s.thanhTruot, giay: s.giay || 2,
          batDau: function () { v0 = inp ? Number(inp.value) : j ? j.o.Value() : 0; },
          buoc: function (p) {
            var v = v0 + (s.den - v0) * p;
            if (inp) datRange(inp, v); else if (j) { j.o.setValue(v); j.b.update(); }
          } };
      }
      if (s.diem) {
        var d = timJXG(s.diem), x0 = 0, y0 = 0;
        return { ten: 'điểm ' + s.diem, giay: s.giay || 2,
          batDau: function () { if (d) { x0 = d.o.X(); y0 = d.o.Y(); } },
          buoc: function (p) { if (d) keoDiem(d.b, d.o, x0 + (s.den[0] - x0) * p, y0 + (s.den[1] - y0) * p); } };
      }
      return { ten: 'bước lạ', giay: 0.1, buoc: function () {} };
    });
    return noiTiep(tt, 0.3);
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
    dangKi: dangKi, huyHet: huyHet, kichBan: kichBan, noiTiep: noiTiep, tuDong: tuDong, tacTu: tacTu, song: song,
    tacTuThanhTruot: tacTuThanhTruot, datRange: datRange,
    themTacTu: function (f) { boTacTu.push(f); },
    soDangChay: function () { return ds.filter(function (m) { return m.tt === 'chay'; }).length; }
  };
})(window.TOAN8);
