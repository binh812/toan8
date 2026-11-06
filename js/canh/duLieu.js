// Cảnh cho chương V: dữ liệu và biểu đồ.
// theDuLieu: thẻ dữ liệu về đúng giá (đếm → chấm, đo → thước, chữ → bậc thang hoặc túi); thẻ vô lí không có chỗ đứng.
// cotHopLi: mỗi số đo thành một cột, cột lạc khỏi dải bình thường là giá trị không hợp lí.
// chongThe: gom thẻ thành chồng (bảng thống kê, rồi biểu đồ cột). luoiPhieu: lưới ô tô màu theo nhóm. xepHop: thẻ vào hộp.
// bienHinh: bảng → cột → băng nối đuôi → quạt tròn (hoặc → đoạn thẳng, → tranh).
// catTruc: nâng gốc trục đứng. trucNgang: trục ngang chia đều hay đúng khoảng năm. soVoiCu: phần tăng so với giá trị cũ.
(function (C) {
  'use strict';
  var TIM = '#9c36b5', VANG = '#f08c00', PI = Math.PI;
  var MAU = ['--b', '--a', '--cc', TIM, VANG, '#0c8599', '#c2255c', '#5c940d'];
  var TEN_LOAI = ['rời rạc', 'liên tục', 'không thể sắp thứ tự', 'có thể sắp thứ tự'];
  var KHOA_LOAI = ['roiRac', 'lienTuc', 'khongThuTu', 'coThuTu'];

  /* ---------- Tiện ích ---------- */
  function mau(m) { return m && m.charAt(0) === '-' ? 'var(' + m + ')' : m; }
  function rong(s, co) { return 0.56 * co * String(s).length; }
  function tong(ds) { return ds.reduce(function (a, b) { return a + b; }, 0); }
  function lerp(P, Q, k) { return [C.noiSuy(P[0], Q[0], k), C.noiSuy(P[1], Q[1], k)]; }
  function nhip(t, a, d) { return C.muot((t - a) / d); }
  function lonNhat(ds) { return Math.max.apply(null, ds); }
  // Số kiểu SGK: dấu phẩy thập phân, nhóm ba chữ số (15600 → 15 600)
  function soDep(x) {
    var r = Math.round(x * 100) / 100, s = String(Math.abs(r)).split('.');
    var n = s[0].length >= 4 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s[0];
    return (r < 0 ? '−' : '') + n + (s[1] ? ',' + s[1] : '');
  }
  // Số đặt trong $…$ (thẻ soi): dấu phẩy thập phân {,}, khoảng nhóm \,
  function soM(x) { return soDep(x).replace(/,/g, '{,}').replace(/ /g, '\\,').replace('−', '-'); }
  // Tỉ lệ phần trăm: chia hết thì ghi thẳng, lẻ thì ghi ≈ và làm tròn một chữ số thập phân
  function phanTram(a, b, chuSo) {
    var h = Math.pow(10, chuSo == null ? 1 : chuSo), p = 100 * a / b, r = Math.round(p * h) / h;
    return (Math.abs(p - r) < 1e-9 ? '' : '≈ ') + soDep(r) + '%';
  }
  // Bước chia trục đẹp: nhỏ nhất mà không quá toiDa vạch
  function buocDep(nhip0, toiDa) {
    var ds = [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
    for (var i = 0; i < ds.length; i++) if (nhip0 / ds[i] <= toiDa + 1e-9) return ds[i];
    return Math.pow(10, Math.ceil(Math.log(nhip0 / toiDa) / Math.LN10));
  }

  // Tiện ích vẽ (chỉ chạy trong trình duyệt)
  function viet(svg, x, y, s, co, o) {
    o = o || {};
    var st = [];
    if (o.mau) st.push('fill:' + mau(o.mau));
    if (o.neo) st.push('text-anchor:' + o.neo);
    if (o.nhe) st.push('font-weight:400');
    var them = { style: st.length ? st.join(';') : null };
    if (o.op != null && o.op < 1) them.opacity = o.op < 0.01 ? 0 : o.op;
    return C.chu(svg, x, y, s, co, null, them);
  }
  // Một dòng chữ giữa khung, thu nhỏ cho vừa bề rộng
  function vietDong(svg, W, y, s, co, o) { return viet(svg, W / 2, y, s, Math.min(co, (W - 0.5) / (0.6 * String(s).length)), o); }
  function hcn(svg, x, y, w, h, o) {
    o = o || {};
    return C.mk('rect', { x: x, y: y, width: Math.max(0, w), height: Math.max(0, h), rx: o.rx == null ? 0.1 : o.rx,
      fill: o.nen ? mau(o.nen) : 'none', 'fill-opacity': o.dac == null ? 1 : o.dac,
      stroke: o.vien ? mau(o.vien) : 'none', 'stroke-width': o.day || 0.07, 'stroke-dasharray': o.dut || null,
      opacity: o.op != null && o.op < 1 ? Math.max(0, o.op) : null }, svg);
  }
  function net(svg, P, Q, m, day, them) {
    return C.mk('line', Object.assign({ x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], stroke: mau(m || '--muc'), 'stroke-width': day || 0.06, 'stroke-linecap': 'round' }, them || {}), svg);
  }
  function da(svg, pts, nen, o) {
    o = o || {};
    return C.mk('polygon', { points: C.diem(pts), fill: nen ? mau(nen) : 'none', 'fill-opacity': o.dac == null ? 1 : o.dac,
      stroke: o.vien ? mau(o.vien) : 'none', 'stroke-width': o.day || 0.05, 'stroke-linejoin': 'round', 'stroke-dasharray': o.dut || null,
      opacity: o.op != null && o.op < 1 ? Math.max(0, o.op) : null }, svg);
  }
  // Thẻ dữ liệu: nền trắng, viền màu, chữ ở giữa
  function veThe(svg, c, s, o) {
    o = o || {};
    if (o.op != null && o.op <= 0) return;
    hcn(svg, c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, { nen: o.nen || '#fff', vien: o.vien || '--nhat', day: o.day || 0.09, dut: o.dut, op: o.op, rx: 0.18 });
    viet(svg, c.x, c.y + 0.04, s, c.co, { mau: o.chu, op: o.op });
  }
  function dauX(svg, x, y, r, m, op) {
    if (op <= 0) return;
    var t = { opacity: op < 1 ? op : null };
    net(svg, [x - r, y - r], [x + r, y + r], m, 0.14, t); net(svg, [x - r, y + r], [x + r, y - r], m, 0.14, t);
  }
  function dauV(svg, x, y, r, m, op) {
    if (op <= 0) return;
    C.mk('polyline', { points: C.diem([[x - r, y], [x - r * 0.3, y + r * 0.7], [x + r, y - r * 0.8]]), fill: 'none', stroke: mau(m), 'stroke-width': 0.16,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: op < 1 ? op : null }, svg);
  }
  function muiTen2(svg, P, Q, m, op) {
    if (op <= 0) return;
    var d = Q[0] > P[0] ? 1 : -1, t = { opacity: op < 1 ? op : null };
    net(svg, P, Q, m, 0.07, t);
    [[P, -d], [Q, d]].forEach(function (u) {
      var X = u[0], s = u[1];
      net(svg, X, [X[0] - s * 0.25, X[1] - 0.18], m, 0.07, t); net(svg, X, [X[0] - s * 0.25, X[1] + 0.18], m, 0.07, t);
    });
  }

  /* ================= 1. Thẻ dữ liệu lên giá ================= */
  // Mỗi hàng là một câu hỏi: { loai: 0 đếm | 1 đo | 2 chữ không thứ tự | 3 chữ có thứ tự, ten, the: [giá trị],
  //   vl: [chỉ số thẻ vô lí], tu, den, buoc (trục số), thuTu: [thấp → cao] (loai 3), giua: { s, v } thẻ thử ở giữa, mau }
  var CO_THE = 0.85, CAO_THE = 1.3, TANG = 1.45, BAC = 0.55;
  var HANG_MD = [
    { loai: 0, ten: 'Số xe máy mỗi nhà', the: [2, 1, 3, 30], vl: [3], tu: 0, den: 4, mau: '--a' },
    { loai: 1, ten: 'Số phút đi đến trường', the: [6, 12.5, 20.3], tu: 0, den: 25, buoc: 5, mau: '--b' },
    { loai: 3, ten: 'Xếp loại học tập', the: ['Khá', 'Tốt', 'Đạt'], thuTu: ['Đạt', 'Khá', 'Tốt'], mau: '--cc' },
    { loai: 2, ten: 'Màu áo yêu thích', the: ['Đỏ', 'Xanh', 'Trắng'], mau: TIM }
  ];
  function rongThe(s) { return Math.max(1.6, rong(s, CO_THE) + 0.6); }
  // Thẻ chồng lên nhau theo chiều ngang thì đẩy lên tầng trên
  function xepTang(ds) {
    var tang = [];
    ds.slice().sort(function (a, b) { return a.x - b.x; }).forEach(function (c) {
      var k = 0;
      while ((tang[k] || []).some(function (d) { return Math.abs(d.x - c.x) < (d.w + c.w) / 2 + 0.12; })) k++;
      (tang[k] = tang[k] || []).push(c);
      c.tang = k;
    });
    return Math.max(1, tang.length);
  }
  // trung: chưa cho biết loại (anTen, em chưa làm đúng): chữ chỉ đứng dàn hàng trên một đường đáy phẳng
  function boTriHang(h, W, trung) {
    var loai = h.loai;
    var ds = h.the.map(function (v, i) {
      var s = typeof v === 'number' ? soDep(v) : String(v);
      return { s: s, v: v, w: rongThe(s), vl: (h.vl || []).indexOf(i) >= 0, tang: 0, bac: 0 };
    });
    var r = { loai: loai, ten: h.ten || '', mau: h.mau || '--b', the: ds, giua: null, thuTu: h.thuTu }, soTang = 1, bac = 0;
    if (loai <= 1) {
      var hl = ds.filter(function (c) { return !c.vl; }), vl = ds.filter(function (c) { return c.vl; });
      var vs = hl.map(function (c) { return c.v; });
      var tu = h.tu != null ? h.tu : Math.floor(Math.min.apply(null, vs)), den = h.den != null ? h.den : Math.ceil(lonNhat(vs));
      if (den <= tu) den = tu + 1;
      var wVl = vl.length ? lonNhat(vl.map(function (c) { return c.w; })) : 0;
      var wHl = lonNhat(hl.map(function (c) { return c.w; })), x0 = Math.max(0.9, 0.35 + wHl / 2), x1 = W - (wVl ? wVl + 1.0 : 0) - Math.max(0.7, 0.35 + wHl / 2);
      var buoc = h.buoc || (loai === 0 && den - tu <= 12 ? 1 : buocDep(den - tu, 6));
      var X = function (v) { return x0 + (v - tu) / (den - tu) * (x1 - x0); };
      r.truc = { tu: tu, den: den, x0: x0, x1: x1, buoc: buoc, vach: [] };
      for (var v = Math.ceil(tu / buoc - 1e-9) * buoc; v <= den + 1e-9; v += buoc) r.truc.vach.push({ v: v, x: X(v) });
      if (loai === 0 && den - tu <= 30) { r.truc.cham = []; for (var k = Math.ceil(tu); k <= den; k++) r.truc.cham.push(X(k)); }
      hl.forEach(function (c) { c.x = X(c.v); });
      soTang = xepTang(hl);
      // Thẻ vô lí không có chỗ trên trục: đứng ở mút phải
      vl.forEach(function (c, k) { c.x = W - 0.4 - c.w / 2; c.tang = k; });
      soTang = Math.max(soTang, vl.length);
      if (h.giua) { r.giua = { s: h.giua.s + '?', v: h.giua.v, x: X(h.giua.v), w: rongThe(h.giua.s + '?'), tang: soTang }; soTang++; }
    } else if (loai === 3 && !trung) {
      var thu = h.thuTu, kb = thu.length, sw = (W - 1.6) / kb, dem = {};
      ds.forEach(function (c) { c.bac = thu.indexOf(c.s); c.x = 0.8 + sw * (c.bac + 0.5); c.tang = dem[c.bac] = dem[c.bac] == null ? 0 : dem[c.bac] + 1; });
      soTang = 1 + lonNhat(ds.map(function (c) { return c.tang; }));
      bac = (kb - 1) * BAC;
      r.bac = { k: kb, x0: 0.8, sw: sw };
    } else {
      // Dàn đều; dài quá một hàng thì xếp hai tầng
      var hai = tong(ds.map(function (c) { return c.w + 0.5; })) + 1.6 > W, moiTang = hai ? Math.ceil(ds.length / 2) : ds.length;
      ds.forEach(function (c, i) {
        var tg = Math.floor(i / moiTang), soO = tg ? ds.length - moiTang : moiTang, sw2 = (W - 1.6) / soO;
        c.x = 0.8 + sw2 * (i - tg * moiTang + 0.5); c.tang = tg;
      });
      soTang = hai ? 2 : 1;
      // Hàng chữ có thứ tự đang giấu: chừa sẵn chỗ cho bậc thang để hàng không đổi cao khi hiện ra
      if (loai === 3) { bac = (h.thuTu.length - 1) * BAC; soTang = Math.max(soTang, 1 + lonNhat(h.thuTu.map(function (x) { return h.the.filter(function (y) { return y === x; }).length - 1; }))); }
      r.trung = trung;
    }
    r.soTang = soTang;
    r.duoi = loai <= 1 ? 1.15 : 0.55;
    r.cao = 1.35 + TANG * soTang + bac + r.duoi;
    return r;
  }

  C.dangKi('theDuLieu', {
    trangThai: { giai: true, kiem: true },
    tinh: function (p, t, o) {
      // Khung rộng thêm khi thẻ chữ dài, để các thẻ không đè nhau
      var can = (o.hang || HANG_MD).map(function (h) {
        if (h.loai === 3) return h.thuTu.length * (lonNhat(h.thuTu.map(function (s) { return rongThe(s); })) + 0.3) + 1.6;
        return 16;
      });
      var trung = o.anTen && p.trangThai !== 'giai' && p.trangThai !== 'kiem';
      var W = o.rong || Math.max(16, lonNhat(can)), y = 0.15, hang = (o.hang || HANG_MD).map(function (h) { return boTriHang(h, W, trung); }), the = [];
      hang.forEach(function (r, ih) {
        r.y0 = y; r.day = y + r.cao - r.duoi; y += r.cao;
        // Chưa xếp: các thẻ đứng thành hàng theo thứ tự ghi, ngay dưới tên câu hỏi
        var tong0 = tong(r.the.map(function (c) { return c.w; })) + 0.3 * (r.the.length - 1), xd = Math.max(0.3, (W - tong0) / 2);
        r.the.forEach(function (c) {
          var dich = [c.x, r.day - 0.85 - c.tang * TANG - c.bac * BAC];
          the.push({ s: c.s, w: c.w, h: CAO_THE, co: CO_THE, hang: ih, vl: c.vl, bac: c.bac, dich: dich, xuat: [xd + c.w / 2, r.y0 + 1.95] });
          xd += c.w + 0.3;
        });
        if (r.giua) r.giua.y = r.day - 0.85 - r.giua.tang * TANG;
      });
      var n = the.length;
      // Nhìn: thẻ để lẫn lộn, mỗi thẻ bắt đầu ở chỗ của một thẻ khác
      if (o.tron) { var lech = Math.ceil(n / 2); the.forEach(function (c, j) { c.xuat = the[(j + lech) % n].dich; }); }
      // Nhìn: thẻ về giá theo từng hàng, hàng sau bắt đầu khi hàng trước gần xong (khớp với các bước chữ)
      var thuTrongHang = {};
      the.forEach(function (c, j) {
        var k = thuTrongHang[c.hang] = thuTrongHang[c.hang] == null ? 0 : thuTrongHang[c.hang] + 1;
        var a = o.tron ? 0.12 + 0.15 * c.hang + 0.025 * k : 0.15 + 0.45 * j / Math.max(1, n - 1);
        var s = nhip(t, a, o.tron ? 0.1 : 0.15);
        c.s0 = s;
        var P = lerp(c.xuat, c.dich, s);
        c.x = P[0]; c.y = P[1];
      });
      return { W: W, H: y + 0.15, hang: hang, the: the, xepXong: the.every(function (c) { return c.s0 >= 1; }) };
    }
  });

  C.lay('theDuLieu').ve = function (svg, g, p, t, o) {
    var W = g.W, giai = p.trangThai === 'giai', kiem = giai || p.trangThai === 'kiem';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + g.H);
    var hienGia = o.tron ? nhip(t, 0.05, 0.1) : 1, opTen = giai ? 1 : (o.anTen ? 0 : nhip(t, 0.88, 0.08));
    var opVl = nhip(t, 0.75, 0.06), opGiua = nhip(t, 0.62, 0.08), xet = kiem || (!o.anTen && t > 0.85);
    g.hang.forEach(function (r) {
      var day = r.day, m = r.mau, trung = o.anTen && !kiem;
      viet(svg, 0.3, r.y0 + 0.65, r.ten, 0.8, { mau: m, neo: 'start' });
      viet(svg, W - 0.3, r.y0 + 0.65, TEN_LOAI[r.loai], 0.8, { mau: m, neo: 'end', op: opTen });
      var opG = hienGia < 1 ? { opacity: hienGia } : null;
      // Soi chi tiết: bấm vào giá thì hiện loại dữ liệu (chưa cho biết loại thì không gắn, kẻo lộ đáp án)
      var svg0 = svg;
      svg = trung ? svg0 : C.mk('g', { 'data-soi': KHOA_LOAI[r.loai] }, svg0);
      if (r.loai <= 1 && hienGia > 0) {
        var tr = r.truc;
        if (trung || (r.loai === 0 && !tr.cham)) {
          // Chưa biết đếm hay đo: một đường thẳng có vạch, chưa nói gì
          net(svg, [tr.x0, day], [tr.x1, day], '--nhat', 0.06, opG);
          tr.vach.forEach(function (v) { net(svg, [v.x, day - 0.18], [v.x, day + 0.18], '--nhat', 0.06, opG); });
        } else if (r.loai === 0) {
          net(svg, [tr.x0, day], [tr.x1, day], '--nhat', 0.04, Object.assign({ 'stroke-dasharray': '0.12 0.22' }, opG));
          tr.cham.forEach(function (x) { C.mk('circle', { cx: x, cy: day, r: 0.17, fill: mau(m), opacity: hienGia < 1 ? hienGia : null }, svg); });
        } else {
          hcn(svg, tr.x0, day - 0.14, tr.x1 - tr.x0, 0.28, { nen: m, dac: 0.3, vien: m, day: 0.05, rx: 0.05, op: hienGia });
          for (var v = tr.tu; v <= tr.den + 1e-9; v += tr.buoc / 5) {
            var x = tr.x0 + (v - tr.tu) / (tr.den - tr.tu) * (tr.x1 - tr.x0);
            net(svg, [x, day - 0.14], [x, day + 0.05], m, 0.03, opG);
          }
          tr.vach.forEach(function (v) { net(svg, [v.x, day - 0.28], [v.x, day + 0.2], m, 0.06, opG); });
        }
        tr.vach.forEach(function (v) { viet(svg, v.x, day + 0.72, soDep(v.v), 0.7, { nhe: true, op: hienGia }); });
      } else if (r.trung && hienGia > 0) {
        net(svg, [0.6, day], [W - 0.6, day], '--nhat', 0.06, opG);
      } else if (r.loai === 3 && hienGia > 0) {
        var b = r.bac, pts = [[b.x0, day]];
        for (var i = 0; i < b.k; i++) { pts.push([b.x0 + i * b.sw, day - i * BAC]); pts.push([b.x0 + (i + 1) * b.sw, day - i * BAC]); }
        pts.push([b.x0 + b.k * b.sw, day]);
        da(svg, pts, m, { dac: 0.15, vien: m, day: 0.06, op: hienGia });
      } else if (r.loai === 2 && hienGia > 0) {
        hcn(svg, 0.45, day - 0.3 - TANG * r.soTang, W - 0.9, TANG * r.soTang + 0.25, { vien: m, day: 0.05, dut: '0.25 0.18', rx: 0.5, op: hienGia });
      }
      svg = svg0;
    });
    // Túi chữ không thứ tự: đổi chỗ hai thẻ cạnh nhau vẫn thế
    g.hang.forEach(function (r, ih) {
      if (r.loai !== 2 || r.trung) return;
      var ds = g.the.filter(function (c) { return c.hang === ih; }), xong = Math.min.apply(null, ds.map(function (c) { return c.s0; }));
      for (var i = 0; i + 1 < ds.length; i++) {
        var a = ds[i].dich, b = ds[i + 1].dich, x0 = a[0] + ds[i].w / 2 + 0.15, x1 = b[0] - ds[i + 1].w / 2 - 0.15;
        if (Math.abs(a[1] - b[1]) > 1e-9) continue;
        if (x1 - x0 > 0.8) muiTen2(svg, [x0, a[1]], [x1, a[1]], r.mau, hienGia * C.muot((xong - 0.9) / 0.1));
      }
    });
    var anLoai = o.anTen && !kiem;
    g.the.forEach(function (c) {
      var r = g.hang[c.hang], cha = anLoai ? svg : C.mk('g', { 'data-soi': c.vl ? 'voLi' : KHOA_LOAI[r.loai] }, svg);
      veThe(cha, c, c.s, { vien: r.mau });
      if (c.vl && opVl > 0) {
        hcn(cha, c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, { vien: '--sai', day: 0.14, rx: 0.18, op: opVl });
        viet(cha, c.x, c.y + 0.04, c.s, c.co, { mau: '--sai', op: opVl });
        if (c.dich[1] === r.day - 0.85) viet(cha, c.x, r.day + 0.72, 'vô lí', 0.7, { mau: '--sai', op: opVl });
      }
    });
    // Thẻ thử ở giữa hai giá trị: có nghĩa không?
    g.hang.forEach(function (r) {
      var q = r.giua;
      if (!q || opGiua <= 0) return;
      var ve = { x: q.x, y: q.y, w: q.w, h: CAO_THE, co: CO_THE }, dem = r.loai === 0, cha = xet ? C.mk('g', { 'data-soi': 'giua' }, svg) : svg;
      net(cha, [q.x, q.y + CAO_THE / 2], [q.x, r.day - 0.2], '--nhat', 0.05, { 'stroke-dasharray': '0.15 0.12', opacity: opGiua < 1 ? opGiua : null });
      veThe(cha, ve, q.s, { vien: xet ? (dem ? '--sai' : '--cc') : '--nhat', dut: xet && !dem ? null : '0.22 0.14', op: opGiua, chu: xet ? (dem ? '--sai' : '--cc') : null });
      if (xet) { if (dem) dauX(cha, q.x, q.y, 0.55, '--sai', opGiua); else dauV(cha, q.x + q.w / 2 + 0.45, q.y, 0.35, '--cc', opGiua); }
    });
  };
  // Soi chi tiết: loại dữ liệu của mỗi giá, thẻ vô lí, thẻ thử. Chưa cho biết loại (anTen, em chưa làm) thì không soi.
  C.lay('theDuLieu').soi = function (g, p, o) {
    if (o.anTen && p.trangThai !== 'giai' && p.trangThai !== 'kiem') return {};
    var ra = {}, M = function (x) { return '$' + soM(x) + '$'; };
    g.hang.forEach(function (r) {
      var k = KHOA_LOAI[r.loai], hl = r.the.filter(function (c) { return !c.vl; }), vl = r.the.filter(function (c) { return c.vl; });
      var ds = hl.map(function (c) { return typeof c.v === 'number' ? M(c.v) : c.s; }).join('; ');
      if (!ra[k]) {
        if (r.loai === 0) ra[k] = { tieuDe: 'Số liệu rời rạc', chu: '"' + r.ten + '": ' + ds + '. Có được nhờ **đếm**, nên chỉ đứng ở các chấm ' + M(r.truc.tu) + ', ' + M(r.truc.tu + 1) + ', ' + M(r.truc.tu + 2) + ',… Giữa hai chấm không có giá trị nào.' };
        else if (r.loai === 1) ra[k] = { tieuDe: 'Số liệu liên tục', chu: '"' + r.ten + '": ' + ds + '. Có được nhờ **đo**, nên đứng được ở bất kì chỗ nào trên thước từ ' + M(r.truc.tu) + ' đến ' + M(r.truc.den) + '.' };
        else if (r.loai === 3) ra[k] = { tieuDe: 'Có thể sắp thứ tự', chu: '"' + r.ten + '": là chữ, nhưng xếp được thành bậc ' + r.thuTu.join(' < ') + '. Nên đây là dữ liệu không là số, **có thể sắp thứ tự**.' };
        else ra[k] = { tieuDe: 'Không thể sắp thứ tự', chu: '"' + r.ten + '": ' + ds + '. Đổi chỗ thế nào cũng được, không có bậc nào cao hơn: dữ liệu **không thể sắp thứ tự**.' };
      }
      if (vl.length && !ra.voLi) ra.voLi = { tieuDe: 'Giá trị không hợp lí', chu: 'Thẻ ' + M(vl[0].v) + ' ở câu "' + r.ten + '" không có chỗ trên giá: các giá trị hợp lí chỉ từ ' + M(r.truc.tu) + ' đến ' + M(r.truc.den) + '. Có lẽ ai đó ghi nhầm.' };
      if (r.giua && !ra.giua) ra.giua = r.loai === 0
        ? { tieuDe: 'Thẻ thử ' + r.giua.s, chu: 'Số liệu đếm được chỉ là số tự nhiên, nên ' + M(r.giua.v) + ' không thể là câu trả lời.' }
        : { tieuDe: 'Thẻ thử ' + r.giua.s, chu: 'Số đo có thể nằm giữa hai vạch, nên ' + M(r.giua.v) + ' vẫn là một câu trả lời có thể có.' };
    });
    return ra;
  };

  /* ================= 2. Mỗi số đo thành một cột: cột lạc khỏi dải bình thường ================= */
  // tuyChon: { so: [...], don, lo, hi (dải bình thường), vl: [chỉ số giá trị vô lí], nhanDai, anLucDau }
  C.dangKi('cotHopLi', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var so = o.so, n = so.length, W = 16, x0 = 1.5, base = 9.6;
      var max = Math.max(lonNhat(so), o.hi || 0), k = 7.4 / max, slot = (W - x0 - 0.4) / n, len = nhip(t, 0.12, 0.45);
      var cot = so.map(function (v, i) {
        var h = v * k * len;
        return { v: v, s: soDep(v), x: x0 + slot * (i + 0.5), w: Math.min(1.6, slot * 0.6), h: h, ngoai: (o.lo != null && v < o.lo) || (o.hi != null && v > o.hi),
          thu: typeof p.thu === 'number' && Math.abs(p.thu - v) < 1e-9 };
      });
      var chat = so.some(function (v) { return 0.56 * 0.8 * soDep(v).length + 0.4 > slot - 0.1; });
      return { W: W, H: base + (chat ? 3.0 : 1.75), base: base, x0: x0, slot: slot, cot: cot, k: k, len: len, soLe: chat,
        dai: o.lo != null ? { y0: base - o.hi * k, y1: base - o.lo * k } : null };
    }
  });
  C.lay('cotHopLi').ve = function (svg, g, p, t, o) {
    var giai = p.trangThai === 'giai', base = g.base;
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    var opDai = nhip(t, 0.55, 0.12), opDo = (!o.anLucDau || giai) ? nhip(t, 0.8, 0.1) : 0, vl = o.vl || [];
    if (g.dai && opDai > 0) {
      hcn(svg, g.x0 - 0.2, g.dai.y0, g.W - g.x0, g.dai.y1 - g.dai.y0, { nen: '--cc', dac: 0.13, rx: 0, op: opDai });
      viet(svg, g.W - 0.25, 0.55, o.nhanDai || ('thường gặp: ' + soDep(o.lo) + ' – ' + soDep(o.hi) + ' ' + (o.don || '')), 0.75, { mau: '--cc', neo: 'end', op: opDai });
    }
    net(svg, [g.x0 - 0.4, base], [g.W - 0.2, base], '--muc', 0.07);
    if (o.don) viet(svg, 0.25, 0.55, '(' + o.don + ')', 0.7, { neo: 'start', nhe: true });
    g.cot.forEach(function (c, i) {
      var la = vl.indexOf(i) >= 0;
      if (c.h > 0) {
        hcn(svg, c.x - c.w / 2, base - c.h, c.w, c.h, { nen: '--b', dac: 0.75, rx: 0.06 });
        if (la && opDo > 0) hcn(svg, c.x - c.w / 2, base - c.h, c.w, c.h, { nen: '--sai', rx: 0.06, op: opDo });
        if (c.thu) hcn(svg, c.x - c.w / 2 - 0.12, base - c.h - 0.12, c.w + 0.24, c.h + 0.12, { vien: '--muc', day: 0.12, rx: 0.08 });
      }
      veThe(svg, { x: c.x, y: base + 0.85 + (g.soLe && i % 2 ? 1.25 : 0), w: rong(c.s, 0.8) + 0.4, h: 1.15, co: 0.8 }, c.s,
        { vien: la && opDo > 0.5 ? '--sai' : (c.thu ? '--muc' : '--b'), chu: la && opDo > 0.5 ? '--sai' : null, day: c.thu ? 0.14 : 0.08 });
      if (la && opDo > 0) viet(svg, c.x, Math.min(base - c.h - 0.5, base - 0.5), 'vô lí', 0.75, { mau: '--sai', op: opDo });
    });
  };

  /* ================= 3. Gom thẻ thành chồng: bảng thống kê và biểu đồ cột ================= */
  // tuyChon: { the: [...], nhom: [...], hoi, anLucDau }
  C.dangKi('chongThe', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var W = 16, the = o.the, n = the.length, nhom = o.nhom, G = nhom.length;
      var dem = nhom.map(function (x) { return the.filter(function (y) { return y === x; }).length; }), maxDem = Math.max(1, lonNhat(dem));
      var cw = Math.max(1.2, lonNhat(the.map(function (s) { return rong(s, 0.75); })) + 0.5), ch = 1.15;
      var cot = Math.max(1, Math.floor((W - 0.4) / (cw + 0.15))), hang = Math.ceil(n / cot);
      var dauHang = 0.35 + hang * 1.3 + 0.9, ph = Math.min(ch, 7.2 / maxDem), slot = (W - 1) / G, pw = Math.min(cw * 1.2, slot * 0.7);
      var base = dauHang + maxDem * ph + 1.1, tang = nhom.map(function () { return 0; });
      var ds = the.map(function (s, j) {
        var gI = nhom.indexOf(s), c = j % cot, hg = Math.floor(j / cot), soCot = hg === hang - 1 ? n - hg * cot : cot;
        var xuat = [W / 2 + (c - (soCot - 1) / 2) * (cw + 0.15), 0.35 + hg * 1.3 + ch / 2];
        var lev = tang[gI]++, dich = [0.5 + slot * (gI + 0.5), base - ph * (lev + 0.5)];
        var k = nhip(t, 0.12 + 0.6 * j / Math.max(1, n - 1), 0.14), P = lerp(xuat, dich, k);
        return { s: s, nhom: gI, x: P[0], y: P[1], w: C.noiSuy(cw, pw, k) - 0.06, h: C.noiSuy(ch, ph, k) - 0.06, co: C.noiSuy(0.75, Math.min(0.75, ph * 0.62), k), k: k };
      });
      return { W: W, H: base + 2.3, base: base, slot: slot, pw: pw, ph: ph, dem: dem, n: n, the: ds, nhom: nhom };
    }
  });
  C.lay('chongThe').ve = function (svg, g, p, t, o) {
    var giai = p.trangThai === 'giai', base = g.base, iHoi = o.hoi != null ? g.nhom.indexOf(o.hoi) : -1;
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    var opDem = nhip(t, 0.82, 0.08);
    net(svg, [0.3, base], [g.W - 0.3, base], '--muc', 0.07);
    g.nhom.forEach(function (x, i) {
      var cx = 0.5 + g.slot * (i + 0.5), m = MAU[i % MAU.length];
      viet(svg, cx, base + 0.7, x, 0.8, { mau: m });
      viet(svg, cx, base - g.dem[i] * g.ph - 0.5, String(g.dem[i]), 0.85, { op: opDem, mau: i === iHoi && giai ? '--muc' : null });
      if (i === iHoi && (giai || !o.anLucDau) && opDem > 0)
        hcn(svg, cx - g.pw / 2 - 0.15, base - g.dem[i] * g.ph - 0.1, g.pw + 0.3, g.dem[i] * g.ph + 0.1, { vien: '--muc', day: 0.1, rx: 0.12, op: opDem });
    });
    g.the.forEach(function (c) { var m = MAU[c.nhom % MAU.length]; veThe(svg, c, c.s, { vien: m, nen: c.k > 0.5 ? m : '#fff', chu: c.k > 0.5 ? '#fff' : null, day: 0.06 }); });
    if (giai && iHoi >= 0) viet(svg, g.W / 2, base + 1.7, g.nhom[iHoi] + ': ' + g.dem[iHoi] + ' : ' + g.n + ' = ' + phanTram(g.dem[iHoi], g.n), 0.85, { mau: '--muc' });
  };

  /* ================= 4. Lưới ô tô màu theo nhóm ================= */
  // tuyChon: { n, cot, nhom: [{ so, mau, ten, o?: [chỉ số ô] }], conLai: 'tên phần còn lại' }
  C.dangKi('luoiPhieu', {
    tinh: function (p, t, o) {
      var W = 16, cot = o.cot || 10, n = o.n, c = Math.min(1.1, (W - 0.8) / cot), hang = Math.ceil(n / cot), mauO = [];
      for (var i = 0; i < n; i++) mauO.push(-1);
      o.nhom.forEach(function (gr, gi) { (gr.o || []).forEach(function (k) { mauO[k] = gi; }); });
      var tro = 0;
      o.nhom.forEach(function (gr, gi) {
        if (gr.o) return;
        for (var d = 0; d < gr.so; d++) { while (tro < n && mauO[tro] >= 0) tro++; if (tro < n) mauO[tro++] = gi; }
      });
      var x0 = (W - cot * c) / 2, G = o.nhom.length;
      var o2 = mauO.map(function (gi, k) {
        return { x: x0 + (k % cot) * c, y: 0.3 + Math.floor(k / cot) * c, c: c, nhom: gi, hien: gi < 0 ? 0 : nhip(t, 0.1 + 0.6 * gi / Math.max(1, G), 0.15) };
      });
      var dem = o.nhom.map(function (gr, gi) { return mauO.filter(function (x) { return x === gi; }).length; });
      var y = 0.3 + hang * c + 0.5;
      return { W: W, H: y + (G + (o.conLai ? 1 : 0)) * 1.05 + 0.2, o: o2, dem: dem, conLai: mauO.filter(function (x) { return x < 0; }).length, yChu: y };
    }
  });
  C.lay('luoiPhieu').ve = function (svg, g, p, t, o) {
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    g.o.forEach(function (q) {
      hcn(svg, q.x + 0.06, q.y + 0.06, q.c - 0.12, q.c - 0.12, { nen: '--nhat', dac: 0.12, rx: 0.1 });
      if (q.hien > 0) hcn(svg, q.x + 0.06, q.y + 0.06, q.c - 0.12, q.c - 0.12, { nen: o.nhom[q.nhom].mau || MAU[q.nhom], rx: 0.1, op: q.hien });
    });
    var y = g.yChu + 0.5;
    o.nhom.forEach(function (gr, gi) {
      hcn(svg, 0.6, y - 0.35, 0.7, 0.7, { nen: gr.mau || MAU[gi], rx: 0.1 });
      viet(svg, 1.6, y + 0.03, g.dem[gi] + ' ' + gr.ten, 0.8, { neo: 'start', mau: gr.mau || MAU[gi], op: nhip(t, 0.1 + 0.6 * gi / Math.max(1, o.nhom.length), 0.15) });
      y += 1.05;
    });
    if (o.conLai) {
      hcn(svg, 0.6, y - 0.35, 0.7, 0.7, { nen: '--nhat', dac: 0.12, rx: 0.1 });
      viet(svg, 1.6, y + 0.03, g.conLai + ' ' + o.conLai, 0.8, { neo: 'start', nhe: true });
    }
  };

  /* ================= 5. Thẻ vào hộp (cách thu thập dữ liệu) ================= */
  // tuyChon: { hop: [{ ten, phu }], the: [{ s, h: chỉ số hộp }] }
  C.dangKi('xepHop', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var W = 16, nH = o.hop.length, bw = (W - 0.6 - 0.4 * (nH - 1)) / nH, n = o.the.length, dem = o.hop.map(function () { return 0; });
      var tongR = tong(o.the.map(function (c) { return 0.45 * String(c.s).length + 0.6; })) + 0.3 * (n - 1), mot = tongR <= W - 0.6;
      var xd = (W - tongR) / 2, yHop = mot ? 2.6 : 1.3 + n * 1.35;
      var maxTrong = 0;
      o.the.forEach(function (c) { maxTrong = Math.max(maxTrong, ++dem[c.h]); });
      dem = o.hop.map(function () { return 0; });
      var ds = o.the.map(function (c, j) {
        var w = 0.45 * String(c.s).length + 0.6, xuat = mot ? [xd + w / 2, 1.0] : [W / 2, 1.0 + j * 1.35];
        if (mot) xd += w + 0.3;
        var dich = [0.3 + c.h * (bw + 0.4) + bw / 2, yHop + 2.6 + dem[c.h]++ * 1.35];
        var k = nhip(t, 0.15 + 0.4 * j / Math.max(1, n - 1), 0.2), P = lerp(xuat, dich, k);
        return { s: c.s, x: P[0], y: P[1], w: Math.min(w, bw - 0.2), h: 1.15, co: 0.72, hop: c.h };
      });
      return { W: W, H: yHop + 2.05 + maxTrong * 1.35 + 0.4, yHop: yHop, bw: bw, cao: 2.05 + maxTrong * 1.35, the: ds };
    }
  });
  C.lay('xepHop').ve = function (svg, g, p, t, o) {
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    o.hop.forEach(function (h, i) {
      var x = 0.3 + i * (g.bw + 0.4), m = h.mau || MAU[i];
      hcn(svg, x, g.yHop, g.bw, g.cao, { nen: m, dac: 0.08, vien: m, day: 0.07, rx: 0.3 });
      viet(svg, x + g.bw / 2, g.yHop + 0.7, h.ten, 0.85, { mau: m });
      if (h.phu) viet(svg, x + g.bw / 2, g.yHop + 1.45, h.phu, 0.62, { nhe: true });
    });
    g.the.forEach(function (c) { veThe(svg, c, c.s, { vien: o.hop[c.hop].mau || MAU[c.hop] }); });
  };

  /* ================= 6. Một bộ số biến hình: bảng → cột → băng → quạt tròn (hoặc đoạn thẳng, tranh) ================= */
  // tuyChon: { nhan, so, don, den: 'cot' | 'bang' | 'tron' | 'duong' | 'tranh', giai, nguoc (từ quạt trải ra băng),
  //   thuoc: '%' | { tong, don } (thước dưới băng), hoi, hieu: [i, j], moi (mỗi biểu tượng), voNghia, voTong, tongChu, ptTrong (ghi phần trăm trong băng),
  //   demBT (biểu đồ tranh: khi giải xong ghi số biểu tượng mỗi hàng và tổng), anLucDau }
  var LOAI_HINH = ['cot', 'bang', 'tron', 'duong', 'tranh'];
  var BH = { W: 14, H: 10.6, base: 8.9, L: 12.0, xs: 1.0, yo: 3.2, cao: 5.3, tableY: [2.6, 4.1, 5.6], chuThich: 9.85 };
  C.dangKi('bienHinh', {
    trangThai: { giai: true, cot: true, bang: true, tron: true, duong: true, tranh: true },
    tinh: function (p, t, o) {
      var so = o.so, n = so.length, T = tong(so), W = BH.W, L = BH.L, xs = BH.xs, yo = BH.yo, base = BH.base, th = L / (2 * PI);
      var den = LOAI_HINH.indexOf(p.trangThai) >= 0 ? p.trangThai : (p.trangThai === 'giai' ? (o.giai || o.den || 'cot') : (o.den || 'tron'));
      var s1 = 0, s2 = 0, s3 = 0, s4 = 0;
      if (o.nguoc) { s1 = 1; s2 = 1; s4 = 1 - nhip(t, 0.05, 0.1); s3 = 1 - nhip(t, 0.2, 0.5); den = 'bang'; }
      else if (den === 'cot') s1 = nhip(t, 0.1, 0.4);
      else if (den === 'bang') { s1 = nhip(t, 0.08, 0.3); s2 = nhip(t, 0.5, 0.35); }
      else if (den === 'tron') { s1 = nhip(t, 0.1, 0.22); s2 = nhip(t, 0.42, 0.2); s3 = nhip(t, 0.7, 0.18); s4 = nhip(t, 0.9, 0.08); }
      else if (den === 'duong') { s1 = nhip(t, 0.1, 0.3); s2 = C.kep((t - 0.5) / 0.35, 0, 1); }
      else s1 = nhip(t, 0.1, 0.5);
      var slot = 12.8 / n, bw = Math.min(1.7, slot * 0.55), kb = BH.cao / lonNhat(so), sc = 1 + 0.4 * s4, O = [W / 2, yo + th];
      // Cuộn băng quanh điểm giữa (độ cong tăng dần tới một vòng tròn), đồng thời xoay nửa vòng quanh tâm quạt
      // để đoạn đầu tiên bắt đầu ở chỗ 12 giờ; cuộn xong thì phóng to quạt
      var xoay = PI * C.muot((s3 - 0.5) / 0.5), cosX = Math.cos(xoay), sinX = Math.sin(xoay);
      function diemBang(u, h) {
        var k = s3 * 2 * PI / L, uu = u - L / 2, P;
        if (k < 1e-9) P = [W / 2 + uu, yo + h];
        else { var rho = 1 / k, phi = uu * k, r = rho - h; P = [W / 2 + r * Math.sin(phi), yo + rho - r * Math.cos(phi)]; }
        var d = [P[0] - O[0], P[1] - O[1]];
        return [O[0] + (cosX * d[0] - sinX * d[1]) * sc, O[1] + (sinX * d[0] + cosX * d[1]) * sc];
      }
      // Chú giải: một hàng nếu vừa, không thì hai hàng
      var coCG = 0.65, wChu = function (i) { return 0.68 * coCG * String(o.nhan[i]).length + 1.1; }, chiaHang = n;
      if (tong(so.map(function (v, i) { return wChu(i); })) > W - 0.4) chiaHang = Math.ceil(n / 2);
      var cum = 0, hangCG = [so.slice(0, chiaHang), so.slice(chiaHang)].map(function (ds, h) {
        var w = tong(ds.map(function (v, k) { return wChu(h * chiaHang + k); }));
        return { x: (W - w) / 2, y: chiaHang < n ? BH.chuThich - 0.5 + h * 0.95 : BH.chuThich };
      });
      var muc = so.map(function (v, i) {
        var cx = 0.6 + slot * (i + 0.5), hb = v * kb, ua = L * cum / T, ub = L * (cum + v) / T;
        cum += v;
        var m = { v: v, cx: cx, bw: bw, hb: hb * (den === 'tranh' ? 0 : s1), ua: ua, ub: ub, goc: 2 * PI * v / T };
        // Chú giải dưới cùng (khi đã thành băng hoặc quạt)
        var hc = hangCG[i < chiaHang ? 0 : 1];
        m.chuGiai = [hc.x + 0.35, hc.y]; m.tenCG = [hc.x + 0.85 + 0.34 * coCG * String(o.nhan[i]).length, hc.y];
        hc.x += wChu(i);
        if (s2 > 0 && s2 < 1) {
          // Cột nằm xuống thành một đoạn của băng: quay 90° theo chiều kim đồng hồ, co giãn dần
          var a = s2 * PI / 2, Bc = [cx, base - hb / 2], Sc = [xs + (ua + ub) / 2, yo + th / 2], c = lerp(Bc, Sc, s2);
          var dai = C.noiSuy(hb, ub - ua, s2) / 2, ngang = C.noiSuy(bw, th, s2) / 2, du = [Math.sin(a), -Math.cos(a)], dv = [Math.cos(a), Math.sin(a)];
          m.manh = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (q) {
            return [c[0] + du[0] * dai * q[0] + dv[0] * ngang * q[1], c[1] + du[1] * dai * q[0] + dv[1] * ngang * q[1]];
          });
        } else if (s2 >= 1) {
          var so0 = Math.max(2, Math.ceil(36 * (ub - ua) / L) + 1), ngoai = [], trong = [];
          for (var k = 0; k < so0; k++) { var u = ua + (ub - ua) * k / (so0 - 1); ngoai.push(diemBang(u, 0)); trong.unshift(diemBang(u, th)); }
          m.manh = ngoai.concat(trong);
          m.giua = diemBang((ua + ub) / 2, th * 0.38);
          m.giuaBang = diemBang((ua + ub) / 2, th / 2);
        }
        return m;
      });
      var tranh = null;
      if (den === 'tranh') {
        var moi = o.moi || 1, buocH = Math.min(1.3, 5.6 / Math.max(1, n - 1)), soBT = so.map(function (v) { return v / moi; });
        var iw = Math.min(0.85, 9.2 / Math.ceil(lonNhat(soBT) - 1e-9));
        tranh = { moi: moi, iw: iw, hang: so.map(function (v, i) { return { y: 3.6 + i * buocH, so: soBT[i], hien: soBT[i] * s1 }; }) };
      }
      return { W: W, H: BH.H, den: den, s1: s1, s2: s2, s3: s3, s4: s4, T: T, L: L, th: th, muc: muc, tranh: tranh, tam: O, R: th * sc,
        bang: { x0: diemBang(0, 0), x1: diemBang(L, 0) } };
    }
  });
  C.lay('bienHinh').ve = function (svg, g, p, t, o) {
    var W = g.W, base = BH.base, giai = p.trangThai === 'giai', hien = giai || !o.anLucDau, tb = BH.tableY, s1 = g.s1, s2 = g.s2, s3 = g.s3;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + g.H);
    var n = g.muc.length, slot = 12.8 / n, coTen = function (s) { return Math.min(0.8, (slot - 0.2) / (0.62 * String(s).length)); };
    if (o.don) viet(svg, W - 0.25, 0.4, 'Đơn vị: ' + o.don, 0.6, { neo: 'end', nhe: true });
    // Bảng số liệu (mờ dần khi dựng thành cột)
    var opBang = o.nguoc ? 0 : 1 - s1;
    if (opBang > 0) {
      var ob = { opacity: opBang < 1 ? opBang : null };
      [tb[0], tb[1], tb[2]].forEach(function (y) { net(svg, [0.6, y], [13.4, y], '--nhat', 0.04, ob); });
      for (var i = 0; i <= n; i++) net(svg, [0.6 + slot * i, tb[0]], [0.6 + slot * i, tb[2]], '--nhat', 0.04, ob);
      for (i = 0; i < n; i++) C.mk('rect', { x: 0.6 + slot * i, y: tb[0], width: slot, height: tb[2] - tb[0], fill: 'transparent', 'data-soi': 'muc' + i }, svg);
    }
    var trucOp = o.nguoc ? 0 : (g.den === 'tranh' ? 0 : s1 * (1 - s2 * (g.den === 'duong' ? 0 : 1)));
    if (trucOp > 0) net(svg, [0.4, base], [13.6, base], '--muc', 0.07, trucOp < 1 ? { opacity: trucOp } : null);
    var thuocOp = (g.den === 'bang' || g.den === 'tron') && o.thuoc ? s2 * C.kep(1 - 4 * s3, 0, 1) : 0;
    if (thuocOp > 0) {
      var y = BH.yo + g.th, ot = { opacity: thuocOp < 1 ? thuocOp : null }, x0 = BH.xs, L = g.L;
      // Vùng bấm trong suốt phủ thước, để soi "cả băng"
      C.mk('rect', { x: x0, y: y, width: L, height: 1.4, fill: 'transparent', 'data-soi': 'bang' }, svg);
      net(svg, [x0, y + 0.15], [x0 + L, y + 0.15], '--muc', 0.05, ot);
      for (var k = 0; k <= 10; k++) net(svg, [x0 + L * k / 10, y + 0.15], [x0 + L * k / 10, y + (k % 5 ? 0.4 : 0.55)], '--muc', 0.05, ot);
      if (o.thuoc === '%') [0, 50, 100].forEach(function (v) { viet(svg, x0 + L * v / 100, y + 1.15, v + '%', 0.7, { nhe: true, op: thuocOp }); });
      else { viet(svg, x0, y + 1.15, '0', 0.7, { nhe: true, op: thuocOp }); viet(svg, x0 + L, y + 1.15, soDep(o.thuoc.tong) + ' ' + (o.thuoc.don || o.don || ''), 0.7, { nhe: true, op: thuocOp, neo: 'end' }); }
      viet(svg, W / 2, BH.yo - 1.8, o.tongChu || ('Cả băng: ' + soDep(o.thuoc === '%' ? g.T : o.thuoc.tong) + ' ' + (o.don || '') + (o.thuoc === '%' ? ' = 100%' : '')), 0.75, { op: thuocOp });
    }
    // Các cột, đoạn băng, hình quạt
    g.muc.forEach(function (m, i) {
      var mu = MAU[i % MAU.length], hoi = o.hoi === i;
      if (g.den === 'tranh') return;
      if (s2 > 0 && m.manh && g.den !== 'duong') {
        da(svg, m.manh, mu, { vien: hoi ? '--muc' : '#fff', day: hoi ? 0.12 : 0.05 }).setAttribute('data-soi', 'muc' + i);
      } else if (m.hb > 0) {
        var opCot = g.den === 'duong' ? 1 - 0.75 * s2 : 1;
        hcn(svg, m.cx - m.bw / 2, base - m.hb, m.bw, m.hb, { nen: mu, rx: 0.05, op: opCot, vien: hoi ? '--muc' : null, day: 0.1 }).setAttribute('data-soi', 'muc' + i);
      }
    });
    // Hiệu hai cột: phần chênh lệch
    if (o.hieu && s1 >= 1 && s2 === 0 && g.den === 'cot') {
      var a = g.muc[o.hieu[0]], b = g.muc[o.hieu[1]], lon = a.v >= b.v ? a : b, be = lon === a ? b : a;
      net(svg, [be.cx - be.bw / 2, base - be.hb], [lon.cx + lon.bw / 2 + 0.3, base - be.hb], '--muc', 0.05, { 'stroke-dasharray': '0.2 0.14' });
      if (hien) {
        var xh = lon.cx + lon.bw / 2 + 0.3;
        net(svg, [xh, base - lon.hb], [xh, base - be.hb], '--sai', 0.1);
        viet(svg, xh + 0.2, base - (lon.hb + be.hb) / 2, soDep(lon.v - be.v), 0.8, { mau: '--sai', neo: 'start' });
      }
    }
    // Biểu đồ đoạn thẳng: nối đỉnh cột theo thứ tự
    if (g.den === 'duong' && s2 > 0) {
      var pts = g.muc.map(function (m) { return [m.cx, base - m.hb]; }), du = s2 * (n - 1), ve = [pts[0]];
      for (var j = 1; j < n; j++) { if (j <= du) ve.push(pts[j]); else { ve.push(lerp(pts[j - 1], pts[j], du - j + 1)); break; } }
      C.mk('polyline', { points: C.diem(ve), fill: 'none', stroke: mau(o.voNghia ? '--sai' : '--b'), 'stroke-width': 0.14, 'stroke-linejoin': 'round',
        'stroke-dasharray': o.voNghia ? '0.35 0.2' : null }, svg);
      pts.forEach(function (P) { C.mk('circle', { cx: P[0], cy: P[1], r: 0.18, fill: mau('--b') }, svg); });
      if (o.voNghia) for (var q = 0; q + 1 < n; q++) { var M = lerp(pts[q], pts[q + 1], 0.5); viet(svg, M[0], M[1] - 0.55, '?', 1.0, { mau: '--sai', op: nhip(s2, 0.85, 0.15) }); }
    }
    // Biểu đồ tranh: mỗi biểu tượng ứng với moi đơn vị, phần lẻ bị cắt
    if (g.tranh) {
      var tr = g.tranh, sz = Math.min(tr.iw * 0.8, 0.95);
      tr.hang.forEach(function (h, i) {
        var mu = MAU[i % MAU.length];
        for (var k = 0; k < Math.ceil(h.hien - 1e-9); k++) {
          var phan = Math.min(1, h.hien - k);
          hcn(svg, 3.9 + k * tr.iw, h.y - sz / 2, sz * phan, sz, { nen: mu, rx: Math.min(0.12, sz * 0.2) });
        }
        if (o.demBT && giai) viet(svg, BH.W - 0.2, h.y - Math.min(0.6, sz / 2 + 0.35), Math.ceil(h.so - 1e-9) + ' biểu tượng', 0.62, { neo: 'end', mau: mu });
        if (giai && o.hoi === i) viet(svg, 3.9 + Math.ceil(h.so) * tr.iw + 0.25, h.y + 0.03, soDep(h.so) + ' × ' + soDep(tr.moi) + ' = ' + soDep(g.muc[i].v), 0.75, { neo: 'start', mau: '--muc' });
      });
      if (o.demBT && giai) viet(svg, BH.W / 2, BH.chuThich - 1.0, 'Tổng: ' + tr.hang.map(function (h) { return Math.ceil(h.so - 1e-9); }).join(' + ') + ' = ' +
        tong(tr.hang.map(function (h) { return Math.ceil(h.so - 1e-9); })) + ' biểu tượng', 0.75, { mau: '--muc' });
      var opCG = s1;
      hcn(svg, 0.6, BH.chuThich - 0.32, 0.64, 0.64, { nen: MAU[0], rx: 0.1, op: opCG });
      viet(svg, 1.5, BH.chuThich + 0.03, '= ' + soDep(tr.moi) + ' ' + (o.don || ''), 0.75, { neo: 'start', op: opCG });
    }
    // Tên: ô đầu bảng → dưới cột → chú giải (hoặc → đầu hàng của biểu đồ tranh)
    g.muc.forEach(function (m, i) {
      var ten = o.nhan[i], coNhan = coTen(ten), P = [m.cx, tb[0] + 0.78], co = coNhan, mu = MAU[i % MAU.length];
      if (g.den === 'tranh') { P = lerp(P, [0.4 + rong(ten, 0.7) / 2, g.tranh.hang[i].y + 0.03], s1); co = C.noiSuy(coNhan, 0.7, s1); }
      else {
        if (!o.nguoc) P = lerp(P, [m.cx, base + 0.65], s1);
        if (s2 > 0 && g.den !== 'duong') { P = lerp(P, m.tenCG, s2); co = C.noiSuy(coNhan, 0.65, s2); }
      }
      var tach = ten.indexOf(' ') > 0 && coNhan < 0.62 && g.den !== 'tranh' && !o.nguoc, op2 = 1 - s2;
      if (tach && op2 > 0) {
        // Tên dài: xuống hai dòng ở bảng và dưới cột, gộp lại một dòng khi về chú giải
        var cat = ten.lastIndexOf(' ', Math.ceil(ten.length / 2)) > 0 ? ten.lastIndexOf(' ', Math.ceil(ten.length / 2)) : ten.indexOf(' ');
        var d1 = ten.slice(0, cat), d2 = ten.slice(cat + 1), co2 = Math.min(0.8, (slot - 0.2) / (0.62 * Math.max(d1.length, d2.length)));
        var mau2 = { mau: s1 > 0.5 ? mu : null, op: s2 > 0 ? 1 - C.muot(s2 / 0.5) : 1 };
        viet(svg, P[0], P[1] - 0.42, d1, co2, mau2); viet(svg, P[0], P[1] + 0.42, d2, co2, mau2);
        if (s2 > 0) viet(svg, P[0], P[1], ten, co, { mau: mu, op: C.muot(s2 / 0.5) });
      } else viet(svg, P[0], P[1], ten, co, { mau: s1 > 0.5 || o.nguoc ? mu : null });
      if (s2 > 0 && g.den !== 'duong' && g.den !== 'tranh') hcn(svg, m.chuGiai[0] - 0.3, m.chuGiai[1] - 0.3, 0.6, 0.6, { nen: mu, rx: 0.1, op: o.nguoc ? 1 : s2 });
    });
    // Số: ô bảng → đỉnh cột → giữa đoạn băng; phần trăm trong hình quạt
    g.muc.forEach(function (m, i) {
      var s = o.ptTrong ? phanTram(m.v, g.T) : soDep(m.v), P = [m.cx, tb[1] + 0.78], op = 1, trang = false;
      if (g.den === 'tranh') { op = 1 - s1; }
      else {
        if (!o.nguoc) P = lerp(P, [m.cx, base - m.hb - 0.45], s1);
        if (s2 > 0 && m.giuaBang && g.den !== 'duong') {
          P = lerp(P, m.giuaBang, s2); trang = s2 > 0.5;
          if (m.ub - m.ua < rong(s, 0.75) + 0.2) op = 1 - s2;
        }
      }
      var opPT = s3 > 0 ? C.muot((s3 - 0.5) / 0.4) : 0;
      if (o.nguoc) { opPT = 0; op = 0; }
      viet(svg, P[0], P[1], s, 0.75, { op: op * (1 - opPT), mau: trang ? '#fff' : null });
      if (opPT > 0 && m.giua && m.goc > 0.42) viet(svg, m.giua[0], m.giua[1], phanTram(m.v, g.T), 0.7, { mau: '#fff', op: opPT });
      // Trải quạt thành băng: mỗi đoạn vẫn ghi phần trăm như trên quạt (chưa ghi số lượng, đó là việc em tính)
      if (o.nguoc && m.giua) {
        var pt = phanTram(m.v, g.T), vua = s3 > 0.5 ? m.goc > 0.42 : m.ub - m.ua > rong(pt, 0.7) + 0.2;
        if (vua) viet(svg, (s3 > 0.5 ? m.giua : m.giuaBang)[0], (s3 > 0.5 ? m.giua : m.giuaBang)[1], pt, 0.7, { mau: '#fff', op: Math.abs(s3 - 0.5) < 0.15 ? Math.abs(s3 - 0.5) / 0.15 : 1 });
      }
    });
    // Trải băng xong: ghi phần trăm hoặc số lượng của phần đề hỏi
    if (giai && o.hoi != null && g.den === 'bang' && s2 >= 1 && s3 === 0) {
      var mh = g.muc[o.hoi], x = BH.xs + (mh.ua + mh.ub) / 2;
      viet(svg, x, BH.yo - 0.55, o.thuoc && o.thuoc !== '%' ? soDep(o.thuoc.tong * mh.v / g.T) + ' ' + (o.thuoc.don || o.don || '') : phanTram(mh.v, g.T), 0.85, { mau: '--muc' });
    }
    if (o.voTong && g.den === 'tron') viet(svg, W / 2, 1.2, o.voTong, 0.75, { mau: '--sai', op: nhip(s3, 0.5, 0.4) });
  };
  // Soi chi tiết: mỗi mục là một ô bảng, một cột, một đoạn băng hay một hình quạt, tuỳ lúc.
  // Đề còn giấu (anLucDau) thì chỉ nhắc lại số đã ghi trên hình, không tính sẵn phần trăm.
  C.lay('bienHinh').soi = function (g, p, o) {
    var an = o.anLucDau && p.trangThai !== 'giai', don = o.don ? ' ' + o.don : '', ra = {};
    var M = function (x) { return '$' + soM(x) + '$'; };
    // "= 40\%" hoặc "\approx 12{,}5\%" (dùng trong $…$)
    var pt = function (a) { var s = phanTram(a, g.T); return (s.charAt(0) === '≈' ? '\\approx ' : '= ') + s.replace('≈ ', '').replace(/,/g, '{,}').replace('%', '\\%'); };
    var PT = function (a) { return '$' + pt(a).replace(/^= /, '') + '$'; };
    var dang = g.s3 > 0.5 ? 'Hình quạt' : g.s2 > 0.5 ? 'Đoạn băng' : g.s1 > 0.5 ? 'Cột' : 'Ô bảng';
    g.muc.forEach(function (m, i) {
      var chu;
      if (o.nguoc) chu = 'Phần này chiếm ' + PT(m.v) + ' cả tổng thể.';
      else if (an) chu = 'Số liệu: ' + M(m.v) + don + '.';
      else {
        chu = 'Số liệu: ' + M(m.v) + don + ' trong tổng ' + M(g.T) + don + '. Tỉ lệ $\\frac{' + soM(m.v) + '}{' + soM(g.T) + '} \\cdot 100\\% ' + pt(m.v) + '$.';
        chu += g.s3 > 0.5 ? ' Hình quạt chiếm đúng phần ấy của hình tròn.' : g.s1 > 0.5 && g.s2 < 0.5 ? ' Cột cao theo số liệu, nên so các cột là so các số.' : '';
      }
      ra['muc' + i] = { tieuDe: dang + ': ' + o.nhan[i], chu: chu };
    });
    ra.bang = { tieuDe: 'Cả băng', chu: o.thuoc && o.thuoc !== '%'
      ? 'Cả băng là tổng ' + M(o.thuoc.tong) + ' ' + (o.thuoc.don || o.don || '') + ', tức $100\\%$. Mỗi đoạn dài theo phần trăm của nó.'
      : 'Các cột nối đuôi dài đúng bằng tổng ' + M(g.T) + don + ', tức $100\\%$. Vì thế băng cuộn được thành đúng một hình tròn.' };
    return ra;
  };

  /* ================= 7. Cắt trục đứng: số không đổi, cột thì đổi ================= */
  // tuyChon: { nhan, so, goc, dinh, don, mau: [...], nguoc (bắt đầu ở hình đã cắt), hoi: [i, j] so cột i với cột j, anLucDau }
  C.dangKi('catTruc', {
    trangThai: { giai: true, goc0: true },
    tinh: function (p, t, o) {
      var so = o.so, n = so.length, W = 14, base = 9.0, Hc = 6.6, xa = 2.1, xb = 13.6, slot = (xb - xa) / n, bw = Math.min(1.7, slot * 0.55);
      var e = o.nguoc ? 1 - t : t;
      if (p.trangThai === 'giai' || typeof p.thu === 'number') e = 1;
      if (p.trangThai === 'goc0') e = 0;
      var sA = nhip(e, 0.1, 0.35), sB = nhip(e, 0.55, 0.35), cat = o.goc * sA, L = o.goc * sB, dinh = o.dinh;
      function Y(v) { return base - (v - L) / (dinh - L) * Hc; }
      var cot = so.map(function (v, i) {
        var x = xa + slot * (i + 0.5);
        return { v: v, x: x, w: bw, yDinh: Y(v), yCat: Y(Math.max(cat, L)), cao: (v - L) / (dinh - L) * Hc };
      });
      var vach = [];
      for (var k = 0; k <= 4; k++) { var v = L + (dinh - L) * k / 4; vach.push({ v: v, y: Y(v) }); }
      var r = { W: W, H: base + 3.1, base: base, Hc: Hc, xa: xa, xb: xb, e: e, sA: sA, sB: sB, L: L, cat: cat, yCat: Y(cat), cot: cot, vach: vach };
      if (o.hoi) {
        var a = cot[o.hoi[0]], b = cot[o.hoi[1]];
        r.tiCao = a.cao / b.cao;
        r.tiSo = so[o.hoi[0]] / so[o.hoi[1]];
        if (typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0) r.thu = { gt: p.thu, cao: Math.min(p.thu * b.cao, Hc * 1.25) };
      }
      return r;
    }
  });
  C.lay('catTruc').ve = function (svg, g, p, t, o) {
    var base = g.base, giai = p.trangThai === 'giai', mauCot = o.mau || [VANG, '--b', '--cc', TIM, '--a'];
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    if (o.don) viet(svg, 0.2, 0.7, '(' + o.don + ')', 0.7, { neo: 'start', nhe: true });
    g.vach.forEach(function (v, k) {
      net(svg, [g.xa, v.y], [g.xb, v.y], k ? '--nhat' : '--muc', k ? 0.03 : 0.07, k ? { opacity: 0.5 } : null);
      viet(svg, g.xa - 0.2, v.y + 0.03, soDep(Math.round(v.v * 10) / 10), 0.7, { neo: 'end', nhe: true });
    });
    // Vùng bấm trong suốt ở trục đứng và các số trên trục: soi "gốc trục"
    C.mk('rect', { x: 0, y: base - g.Hc - 0.3, width: g.xa + 0.3, height: g.Hc + 0.9, fill: 'transparent', 'data-soi': 'goc' }, svg);
    net(svg, [g.xa, base], [g.xa, base - g.Hc - 0.3], '--muc', 0.07);
    // Trục đã cắt: kí hiệu gãy khúc ở chân trục
    if (g.sB > 0.5) C.mk('polyline', { points: C.diem([[g.xa, base - 0.15], [g.xa - 0.22, base - 0.3], [g.xa + 0.22, base - 0.5], [g.xa, base - 0.65]]), fill: 'none',
      stroke: mau('--sai'), 'stroke-width': 0.08, opacity: C.muot((g.sB - 0.5) / 0.3) }, svg);
    g.cot.forEach(function (c, i) {
      var m = mauCot[i % mauCot.length], cha = C.mk('g', { 'data-soi': 'cot' + i }, svg);
      if (c.yCat < base) hcn(cha, c.x - c.w / 2, c.yCat, c.w, base - c.yCat, { nen: m, dac: 0.18, vien: m, day: 0.04, dut: '0.15 0.12', rx: 0.04 });
      hcn(cha, c.x - c.w / 2, c.yDinh, c.w, Math.max(0, Math.min(c.yCat, base) - c.yDinh), { nen: m, rx: 0.05 });
      viet(cha, c.x, c.yDinh - 0.45, soDep(c.v), 0.85);
      viet(svg, c.x, base + 0.65, o.nhan[i], Math.min(0.75, (g.cot.length > 1 ? g.cot[1].x - g.cot[0].x - 0.15 : 4) / (0.62 * String(o.nhan[i]).length)));
    });
    // Đường cắt đang nâng lên
    var opCat = g.sA > 0 && g.sB < 1 ? Math.min(1, g.sA * 4) * (1 - g.sB) : 0;
    if (opCat > 0) {
      net(svg, [g.xa - 0.1, g.yCat], [g.xb, g.yCat], '--sai', 0.08, { 'stroke-dasharray': '0.3 0.18', opacity: opCat < 1 ? opCat : null, 'data-soi': 'cat' });
      viet(svg, g.xb, g.yCat - 0.4, 'cắt ở ' + soDep(Math.round(g.cat)), 0.7, { neo: 'end', mau: '--sai', op: opCat });
    }
    if (!o.hoi) return;
    var a = g.cot[o.hoi[0]], b = g.cot[o.hoi[1]], cuoi = g.e >= 1 ? 1 : nhip(g.e, 0.9, 0.08);
    // Đặt chồng cột thấp lên nhau bên cạnh cột cao: thấy ngay cột cao gấp mấy lần
    if ((giai || (!o.anLucDau && !p.trangThai)) && cuoi > 0 && !g.thu) {
      var x = a.x + a.w / 2 + 0.12, w = Math.min(0.55, a.w * 0.45), soLan = g.tiCao, k = 0;
      for (; k < Math.floor(soLan + 1e-9); k++) hcn(svg, x, base - (k + 1) * b.cao, w, b.cao, { vien: mauCot[o.hoi[1] % mauCot.length], day: 0.07, dut: '0.15 0.1', rx: 0, op: cuoi });
      var le = soLan - k;
      if (le > 1e-6) hcn(svg, x, base - k * b.cao - le * b.cao, w, le * b.cao, { vien: mauCot[o.hoi[1] % mauCot.length], day: 0.07, dut: '0.15 0.1', rx: 0, op: cuoi });
      vietDong(svg, g.W, base + 1.55, 'Cột ' + (o.tenCot || o.nhan)[o.hoi[0]] + ' cao gấp ' + (Math.abs(soLan - Math.round(soLan * 100) / 100) < 1e-9 ? '' : '≈ ') + soDep(soLan) + ' lần cột ' + (o.tenCot || o.nhan)[o.hoi[1]], 0.75, { mau: '--sai', op: cuoi });
    }
    if (g.thu) {
      var xt = a.x + a.w / 2 + 0.12, wt = Math.min(0.55, a.w * 0.45);
      hcn(svg, xt, base - g.thu.cao, wt, g.thu.cao, { nen: '--sai', dac: 0.15, vien: '--sai', day: 0.08, dut: '0.2 0.12', rx: 0 });
      vietDong(svg, g.W, base + 1.55, 'Nét đứt: cao gấp ' + soDep(g.thu.gt) + ' lần cột ' + (o.tenCot || o.nhan)[o.hoi[1]], 0.75, { mau: '--sai' });
    }
    if (p.trangThai === 'goc0' || (giai && o.nguoc) || (!o.anLucDau && !p.trangThai && g.e <= 0 && t > 0.9))
      vietDong(svg, g.W, base + 2.45, 'Số liệu: ' + soDep(o.so[o.hoi[0]]) + ' : ' + soDep(o.so[o.hoi[1]]) + ' ≈ ' + soDep(Math.round(g.tiSo * 100) / 100) + ' lần', 0.75, { mau: '--cc' });
  };

  // Soi chi tiết: cột (số liệu và chiều cao trên gốc), gốc trục, đường cắt.
  // Đề còn giấu (anLucDau) thì không ghi chiều cao từng cột, vì tỉ số hai chiều cao là điều em cần tìm.
  C.lay('catTruc').soi = function (g, p, o) {
    var an = o.anLucDau && p.trangThai !== 'giai', don = o.don ? ' ' + o.don : '', ra = {};
    var M = function (x) { return '$' + soM(x) + '$'; }, L = Math.round(g.L * 10) / 10, coGoc = L > 0.05;
    g.cot.forEach(function (c, i) {
      var chu = 'Số liệu ' + M(c.v) + don + ', ghi trên đầu cột, không đổi khi cắt trục.';
      if (!an) chu += coGoc ? ' Gốc trục đang ở ' + M(L) + ' nên cột chỉ cao $' + soM(c.v) + ' - ' + soM(L) + ' = ' + soM(Math.round((c.v - L) * 10) / 10) + '$ phần.' : ' Trục bắt đầu từ $0$ nên cột cao đúng ' + M(c.v) + ' phần.';
      else chu += ' Chiều cao cột chỉ ứng với phần nằm trên gốc trục.';
      ra['cot' + i] = { tieuDe: 'Cột ' + o.nhan[i], chu: chu };
    });
    var goc = coGoc ? 'Trục đứng bắt đầu từ ' + M(L) + ', không phải từ $0$. Phần cột dưới mức này bị bỏ đi, nên tỉ số chiều cao hai cột không còn bằng tỉ số hai số liệu.'
      : 'Trục đứng bắt đầu từ $0$: chiều cao mỗi cột tỉ lệ với số liệu.';
    if (o.hoi && coGoc && !an && g.sB > 0.99) {
      var lam = function (x) { var r = Math.round(x * 100) / 100; return (Math.abs(x - r) > 1e-9 ? '\\approx ' : '= ') + soM(r); };
      goc += ' Ở đây chiều cao gấp $' + lam(g.tiCao).replace(/^= /, '') + '$ lần, còn số liệu chỉ gấp $\\frac{' + soM(o.so[o.hoi[0]]) + '}{' + soM(o.so[o.hoi[1]]) + '} ' + lam(g.tiSo) + '$ lần.';
    }
    ra.goc = { tieuDe: 'Gốc trục đứng', chu: goc };
    ra.cat = { tieuDe: 'Đường cắt', chu: 'Đang nâng tới ' + M(Math.round(g.cat)) + '. Phần cột dưới đường này (nét đứt) sẽ bị bỏ đi, rồi phần còn lại được kéo giãn cho đầy khung.' };
    return ra;
  };

  /* ================= 8. Trục ngang: chia đều từng mốc hay chia đúng khoảng năm ================= */
  // tuyChon: { nam, so, dinh, buoc, don, deu (không đổi trục), dauBuoc (tô màu tăng, giảm), anLucDau }
  C.dangKi('trucNgang', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var nam = o.nam, so = o.so, n = nam.length, W = 14, base = 8.4, Hc = 6.0, xa = 2.0, xb = 13.4, dinh = o.dinh || buocDep(lonNhat(so), 4) * 4;
      var e = o.deu ? 0 : (p.trangThai === 'giai' ? 1 : nhip(t, 0.15, 0.6));
      var a = nam[0], b = nam[n - 1];
      function Xdeu(i) { return xa + 0.5 + i * (xb - xa - 1) / (n - 1); }
      function Xthat(y) { return xa + 0.5 + (y - a) * (xb - xa - 1) / (b - a); }
      var diem = so.map(function (v, i) { return { v: v, nam: nam[i], x: C.noiSuy(Xdeu(i), Xthat(nam[i]), e), y: base - v / dinh * Hc }; });
      var namThieu = [];
      for (var y = a + 1; y < b; y++) if (nam.indexOf(y) < 0) namThieu.push({ nam: y, x: Xthat(y) });
      var doan = [];
      for (var i = 0; i + 1 < n; i++) doan.push({ tang: so[i + 1] - so[i], soNam: nam[i + 1] - nam[i], doc: (diem[i + 1].y - diem[i].y) / (diem[i + 1].x - diem[i].x) });
      return { W: W, H: base + 2.15, base: base, Hc: Hc, xa: xa, xb: xb, dinh: dinh, e: e, diem: diem, namThieu: namThieu, doan: doan };
    }
  });
  C.lay('trucNgang').ve = function (svg, g, p, t, o) {
    var base = g.base, giai = p.trangThai === 'giai', buoc = o.buoc || g.dinh / 4;
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    if (o.don) viet(svg, 0.2, 0.75, '(' + o.don + ')', 0.7, { neo: 'start', nhe: true });
    for (var v = 0; v <= g.dinh + 1e-9; v += buoc) {
      var y = base - v / g.dinh * g.Hc;
      net(svg, [g.xa, y], [g.xb, y], v ? '--nhat' : '--muc', v ? 0.03 : 0.07, v ? { opacity: 0.5 } : null);
      viet(svg, g.xa - 0.2, y + 0.03, soDep(v), 0.7, { neo: 'end', nhe: true });
    }
    net(svg, [g.xa, base], [g.xa, base - g.Hc - 0.3], '--muc', 0.07);
    var opThieu = C.muot((g.e - 0.4) / 0.4);
    g.namThieu.forEach(function (q) { net(svg, [q.x, base - 0.25], [q.x, base + 0.25], '--nhat', 0.06, opThieu < 1 ? { opacity: opThieu } : null); });
    var d = g.diem, n = d.length;
    for (var i = 0; i + 1 < n; i++) {
      var tang = g.doan[i].tang, mauD = o.dauBuoc ? (tang > 0 ? '--cc' : tang < 0 ? '--sai' : '--nhat') : (i === n - 2 ? '--a' : '--b');
      net(svg, [d[i].x, d[i].y], [d[i + 1].x, d[i + 1].y], mauD, 0.14);
      if (o.dauBuoc || !o.anLucDau || giai) {
        var M = [(d[i].x + d[i + 1].x) / 2, (d[i].y + d[i + 1].y) / 2];
        viet(svg, M[0], M[1] - 0.6, (tang > 0 ? '+' : '') + soDep(tang), 0.7, { mau: mauD });
      }
    }
    d.forEach(function (q) {
      C.mk('circle', { cx: q.x, cy: q.y, r: 0.17, fill: mau('--b') }, svg);
      net(svg, [q.x, base - 0.2], [q.x, base + 0.2], '--muc', 0.06);
      var k0 = d.indexOf(q), khe = Math.min(k0 > 0 ? q.x - d[k0 - 1].x : 9, k0 + 1 < n ? d[k0 + 1].x - q.x : 9);
      viet(svg, q.x, base + 0.65, String(q.nam), Math.min(0.7, (khe - 0.1) / 2.5));
    });
    // Khoảng năm của đoạn cuối, khi trục đã chia đúng
    var cuoi = d[n - 1], truoc = d[n - 2], soNam = g.doan[n - 2].soNam, opNgoac = C.muot((g.e - 0.8) / 0.2);
    if (soNam > 1 && opNgoac > 0) {
      var yN = base + 1.25, ot = opNgoac < 1 ? { opacity: opNgoac } : null;
      net(svg, [truoc.x, yN], [cuoi.x, yN], '--a', 0.06, ot);
      net(svg, [truoc.x, yN - 0.2], [truoc.x, yN + 0.05], '--a', 0.06, ot); net(svg, [cuoi.x, yN - 0.2], [cuoi.x, yN + 0.05], '--a', 0.06, ot);
      viet(svg, (truoc.x + cuoi.x) / 2, yN + 0.42, soNam + ' năm', 0.65, { mau: '--a', op: opNgoac });
    }
  };

  /* ================= 9. Phần tăng (giảm) so với giá trị cũ ================= */
  // tuyChon: { cu, moi, nhanCu, nhanMoi, don, anLucDau }. trangThai 'chiaMoi': đặt phần tăng lên cột mới (cách làm sai)
  C.dangKi('soVoiCu', {
    trangThai: { giai: true, chiaMoi: true },
    tinh: function (p, t, o) {
      var W = 14, base = 9.0, Hc = 6.2, cu = o.cu, moi = o.moi, d = Math.abs(moi - cu), k = Hc / Math.max(cu, moi);
      var xCu = 4.2, xMoi = 9.8, bw = 2.2, theoMoi = p.trangThai === 'chiaMoi', goc = theoMoi ? moi : cu, xGoc = theoMoi ? xMoi : xCu;
      var sA = nhip(t, 0.1, 0.3), soBan = goc / d, N = Math.ceil(soBan - 1e-9);
      // Miếng chênh lệch: ở đỉnh cột mới (tăng) hoặc phần cột cũ bị mất (giảm)
      var xMieng = moi >= cu ? xMoi : xCu, yMieng = base - Math.max(cu, moi) * k;
      var ban = [];
      for (var m = 0; m < N; m++) {
        var phan = Math.min(1, soBan - m), s = nhip(t, 0.5 + 0.38 * m / N, 0.38 / N + 0.02);
        var dau = [xMieng + bw / 2 + 0.25 + 0.4, yMieng], dich = [xGoc + bw / 2 + 0.25 + 0.4, base - (m + phan) * d * k];
        var P = lerp(dau, dich, s);
        ban.push({ x: P[0], y: P[1], cao: phan * d * k, phan: phan, s: s });
      }
      return { W: W, H: base + 2.2, base: base, k: k, cu: cu, moi: moi, d: d, xCu: xCu, xMoi: xMoi, bw: bw, sA: sA, ban: ban, soBan: soBan, goc: goc, theoMoi: theoMoi };
    }
  });
  C.lay('soVoiCu').ve = function (svg, g, p, t, o) {
    var base = g.base, k = g.k, giai = p.trangThai === 'giai', tang = g.moi >= g.cu;
    svg.setAttribute('viewBox', '0 0 ' + g.W + ' ' + g.H);
    if (o.don) viet(svg, 0.2, 0.7, '(' + o.don + ')', 0.7, { neo: 'start', nhe: true });
    net(svg, [0.6, base], [g.W - 0.4, base], '--muc', 0.07);
    [[g.xCu, g.cu, o.nhanCu || 'Cũ', '--b'], [g.xMoi, g.moi, o.nhanMoi || 'Mới', '--b']].forEach(function (c) {
      hcn(svg, c[0] - g.bw / 2, base - c[1] * k, g.bw, c[1] * k, { nen: c[3], dac: 0.65, rx: 0.05 });
      viet(svg, c[0], base - c[1] * k - 0.45, soDep(c[1]), 0.85);
      viet(svg, c[0], base + 0.65, c[2], 0.75);
    });
    // Miếng chênh lệch tô cam
    var xM = tang ? g.xMoi : g.xCu, yTren = base - Math.max(g.cu, g.moi) * k, cao = g.d * k;
    if (g.sA > 0) {
      hcn(svg, xM - g.bw / 2, yTren, g.bw, cao, { nen: '--a', rx: 0.05, op: g.sA, dut: tang ? null : '0.2 0.12', vien: '--a', day: 0.06, dac: tang ? 1 : 0.35 });
      viet(svg, xM, yTren + cao / 2 + 0.03, (tang ? '+' : '−') + soDep(g.d), 0.8, { mau: '#fff', op: tang && cao > 0.9 ? g.sA : 0 });
      if (!tang || cao <= 0.9) viet(svg, xM - g.bw / 2 - 0.2, yTren + cao / 2, (tang ? '+' : '−') + soDep(g.d), 0.75, { mau: '--a', neo: 'end', op: g.sA });
    }
    // Các bản sao của miếng đặt chồng cạnh cột so sánh
    var w = 0.8;
    g.ban.forEach(function (b) {
      if (b.s <= 0) return;
      hcn(svg, b.x - w / 2, b.y, w, b.cao, { nen: '--a', dac: 0.35, vien: '--a', day: 0.06, rx: 0 });
    });
    var xong = g.ban.length ? g.ban[g.ban.length - 1].s : 0, xG = (g.theoMoi ? g.xMoi : g.xCu) + g.bw / 2 + 0.65;
    if (xong > 0) viet(svg, xG + 0.6, base - g.goc * k / 2, (Math.abs(g.soBan - Math.round(g.soBan * 100) / 100) < 1e-9 ? '× ' : '≈ × ') + soDep(Math.round(g.soBan * 100) / 100), 0.75, { neo: 'start', mau: '--a', op: xong });
    if ((giai || (!o.anLucDau && !p.trangThai) || g.theoMoi) && xong >= 1)
    { var pt = phanTram(g.d, g.goc, 2); vietDong(svg, g.W, base + 1.55, soDep(g.d) + ' : ' + soDep(g.goc) + (pt.charAt(0) === '≈' ? ' ' : ' = ') + pt, 0.8, { mau: g.theoMoi ? '--sai' : '--cc' }); }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
