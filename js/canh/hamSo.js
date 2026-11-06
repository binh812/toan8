// Cảnh cho chương VII: sơ đồ đoạn (lập phương trình), máy hàm số, đường thẳng và bậc thang (đồ thị, hệ số góc).
(function (C) {
  'use strict';
  var GAN = 1e-9;
  function la(v) { return typeof v === 'number' && isFinite(v); }
  // Số đã làm tròn thì ghi ≈, không ghi =
  function tron(v) { return Math.abs(v * 100 - Math.round(v * 100)) > 1e-6; }
  function viet(v) { return (v < 0 ? '−' : '') + C.fmt(Math.abs(v)); }
  function bang(v) { return (tron(v) ? ' ≈ ' : ' = ') + viet(v); }
  function canTrai(mau) { return { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:start' }; }

  /* ================= Sơ đồ đoạn: mỗi vế là một đoạn, dài bằng nhau khi thay đúng nghiệm ================= */
  // Một mảnh: { x: hệ số của ẩn, so: số, nhan, bo?: mảnh đang bỏ đi ở cả hai đoạn }
  function daiManh(m, x) { return (m.x || 0) * x + (m.so || 0); }
  function tongDoan(ds, x) { return (ds || []).reduce(function (s, m) { return s + daiManh(m, x); }, 0); }
  function heSo(ds, k) { return (ds || []).reduce(function (s, m) { return s + (m[k] || 0); }, 0); }
  function nghiemDoan(s) {
    var a = heSo(s.tren, 'x') - heSo(s.duoi, 'x'), b = heSo(s.duoi, 'so') - heSo(s.tren, 'so');
    return Math.abs(a) < GAN ? null : b / a;
  }
  C.dangKi('soDoDoan', {
    tinh: function (p, t, o) {
      var cac = [{ tren: o.tren, duoi: o.duoi, ghi: o.ghi }].concat(o.buoc || []);
      var goc = o.duoi ? nghiemDoan(cac[0]) : o.x;
      if (!la(goc)) throw new Error('soDoDoan: cần đúng một nghiệm (hoặc o.x khi chỉ có một đoạn)');
      if (o.duoi) cac.forEach(function (s, i) {
        var n = nghiemDoan(s);
        if (n === null || Math.abs(n - goc) > 1e-9) throw new Error('soDoDoan: bước ' + i + ' làm đổi nghiệm');
      });
      var i = Math.min(cac.length - 1, Math.floor(t * cac.length)), s = cac[i];
      var coThu = la(p.thu), x = coThu ? p.thu : goc;
      var hang = [{ ten: o.tenTren, ds: s.tren }].concat(o.duoi ? [{ ten: o.tenDuoi, ds: s.duoi }] : []);
      var soManh = hang.reduce(function (n, h) { return n + h.ds.length; }, 0), j = 0;
      // Một bước duy nhất: các mảnh hiện dần (để bấm nút mới thấy); nhiều bước: đổi bước theo t
      var dan = cac.length === 1 && !o.hienHet;
      var ra = hang.map(function (h) {
        var tu = 0;
        return { ten: h.ten, tong: tongDoan(h.ds, x), manh: h.ds.map(function (m) {
          var w = Math.max(0, daiManh(m, x)), hien = dan ? C.muot((t - 0.1 - 0.6 * j / soManh) / (0.6 / soManh)) : 1;
          j++;
          var q = { tu: tu, dai: w, nhan: m.nhan, bo: !!m.bo, laAn: !!m.x, hien: hien };
          tu += w;
          return q;
        }) };
      });
      // Một tỉ lệ cho mọi bước, để thấy rõ phần nào bị bỏ đi
      var lon = 0;
      cac.forEach(function (c) { [c.tren, c.duoi].forEach(function (d) { if (d) lon = Math.max(lon, tongDoan(d, goc)); }); });
      ra.forEach(function (h) { lon = Math.max(lon, h.tong); });
      return { hang: ra, lon: lon || 1, goc: goc, x: x, thu: coThu ? p.thu : null, buocHienTai: i, ghi: s.ghi,
        lech: o.duoi ? ra[0].tong - ra[1].tong : null, ketHien: dan ? C.muot((t - 0.75) / 0.15) : 1 };
    }
  });
  C.lay('soDoDoan').ve = function (svg, k, p, t, o) {
    var X0 = 4, RONG = 92, CAO = 11, KC = 23, mk = C.mk, s = RONG / k.lon, giai = p.trangThai === 'giai';
    var H = 11 + (k.hang.length - 1) * KC + CAO + 11;
    svg.setAttribute('viewBox', '0 0 100 ' + H);
    k.hang.forEach(function (h, r) {
      var y = 11 + r * KC;
      if (h.ten) C.chu(svg, X0, y - 3.4, h.ten, 4.6, null, canTrai('--nhat'));
      mk('rect', { x: X0, y: y, width: RONG, height: CAO, fill: 'none', stroke: 'var(--nhat)', 'stroke-width': 0.15, 'stroke-dasharray': '1 1', opacity: 0.5 }, svg);
      h.manh.forEach(function (m) {
        var x = X0 + m.tu * s, w = m.dai * s;
        if (w <= 0) return;
        var g = mk('g', { opacity: m.hien }, svg);
        if (m.bo) mk('rect', { x: x + 0.2, y: y, width: Math.max(0, w - 0.4), height: CAO, fill: 'var(--mat)', stroke: 'var(--sai)', 'stroke-width': 0.4, 'stroke-dasharray': '1.5 1' }, g);
        else mk('rect', { x: x + 0.2, y: y, width: Math.max(0, w - 0.4), height: CAO, rx: 0.6, fill: m.laAn ? 'var(--a)' : 'var(--b)', 'fill-opacity': 0.88 }, g);
        var nhan = m.nhan || '', co = Math.min(5, (w - 1) / (Math.max(1, nhan.length) * 0.52));
        if (nhan && co >= 2.2) C.chu(g, x + w / 2, y + CAO / 2 + 0.2, nhan, co, null, { style: 'fill:var(' + (m.bo ? '--sai' : '--mat') + ')', opacity: m.hien });
      });
    });
    var yCuoi = 11 + (k.hang.length - 1) * KC + CAO;
    if (k.lech !== null && k.ketHien > 0) {
      var bang0 = Math.abs(k.lech) < 1e-9, a = k.hang[0].tong * s, b = k.hang[1].tong * s;
      var g = mk('g', { opacity: k.ketHien }, svg);
      [a, b].forEach(function (e) {
        mk('line', { x1: X0 + Math.max(0, e), y1: 9, x2: X0 + Math.max(0, e), y2: yCuoi + 1.5, stroke: bang0 ? 'var(--cc)' : 'var(--sai)', 'stroke-width': 0.45, 'stroke-dasharray': '1.4 1' }, g);
      });
      if (!bang0) {
        var tu = X0 + Math.max(0, Math.min(a, b)), den = X0 + Math.max(0, Math.max(a, b));
        mk('rect', { x: tu, y: 11 + (a > b ? 0 : KC), width: Math.max(0, den - tu), height: CAO, fill: 'var(--sai)', 'fill-opacity': 0.18 }, g);
      }
    }
    // Dòng chữ dưới hình: phương trình của bước, hoặc hai độ dài khi em thử một số
    var bien = o.bien || 'x', chu, mau = null;
    if (k.thu !== null && k.lech !== null) {
      var bg = Math.abs(k.lech) < 1e-9;
      var gan = function (v) { return (tron(v) ? '≈' : '') + viet(v); };
      chu = bien + (tron(k.thu) ? ' ≈ ' : ' = ') + viet(k.thu) + ': ' + gan(k.hang[0].tong) + (bg ? ' = ' : ' ≠ ') + gan(k.hang[1].tong);
      mau = bg ? '--cc' : '--sai';
    } else {
      chu = k.ghi || '';
      if (giai || (o.hienX && t >= 1)) chu = (chu ? chu + '   ' : '') + bien + bang(k.goc) + (o.donVi || '');
    }
    if (chu) C.chu(svg, 50, H - 4, chu, 4.8, mau, { opacity: k.thu !== null ? 1 : k.ketHien });
  };

  /* ================= Mặt phẳng toạ độ dùng chung ================= */
  var BUOC_VACH = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000];
  function vach(nhip) { for (var i = 0; i < BUOC_VACH.length; i++) if (nhip / BUOC_VACH[i] <= 8.5) return BUOC_VACH[i]; return BUOC_VACH[BUOC_VACH.length - 1]; }
  // Vạch thưa đủ để số không chồng nhau (mỗi vạch cách nhau ít nhất 5 đơn vị hình)
  function vachThua(nhip, s) { var b = vach(nhip), i = BUOC_VACH.indexOf(b); while (b * s < 5 && i < BUOC_VACH.length - 1) b = BUOC_VACH[++i]; return b; }
  // Khung vừa mọi điểm cần thấy, luôn chứa gốc O
  function tuKhung(o, diem) {
    if (o.khung) return { x0: o.khung[0], x1: o.khung[1], y0: o.khung[2], y1: o.khung[3] };
    var xs = [0], ys = [0];
    diem.forEach(function (q) { if (la(q[0]) && la(q[1])) { xs.push(q[0]); ys.push(q[1]); } });
    var nx = Math.min.apply(null, xs), lx = Math.max.apply(null, xs), ny = Math.min.apply(null, ys), ly = Math.max.apply(null, ys);
    var px = Math.max(1, (lx - nx) * 0.1), py = Math.max(1, (ly - ny) * 0.1);
    var kh = { x0: Math.floor(nx - px), x1: Math.ceil(lx + px), y0: Math.floor(ny - py), y1: Math.ceil(ly + py) };
    if (kh.x1 - kh.x0 < 5) { kh.x0 -= 1; kh.x1 += 1; }
    if (kh.y1 - kh.y0 < 5) { kh.y0 -= 1; kh.y1 += 1; }
    return kh;
  }
  // Ánh xạ khung toán vào hình chữ nhật R của hình (trục y hướng lên)
  function anhXa(kh, R, tiLe) {
    var sx = R.w / (kh.x1 - kh.x0), sy = R.h / (kh.y1 - kh.y0), ox = R.x, oy = R.y;
    if (tiLe) {
      var s0 = Math.min(sx, sy);
      ox += (R.w - s0 * (kh.x1 - kh.x0)) / 2; oy += (R.h - s0 * (kh.y1 - kh.y0)) / 2; sx = sy = s0;
    }
    return { sx: sx, sy: sy, P: function (x, y) { return [ox + (x - kh.x0) * sx, oy + (kh.y1 - y) * sy]; },
      trai: ox, phai: ox + sx * (kh.x1 - kh.x0), tren: oy, duoi: oy + sy * (kh.y1 - kh.y0) };
  }
  function nhanVach(v) { return (tron(v) ? '≈' : '') + viet(v); }
  function veMatPhang(svg, kh, M, o, tranh) {
    var mk = C.mk, co = 3.1, bx = vachThua(kh.x1 - kh.x0, M.sx), by = vachThua(kh.y1 - kh.y0, M.sy);
    var ax = C.kep(0, kh.y0, kh.y1), ay = C.kep(0, kh.x0, kh.x1), i, v, q;
    for (v = Math.ceil(kh.x0 / bx) * bx; v <= kh.x1 + GAN; v += bx) { q = M.P(v, 0); mk('line', { x1: q[0], y1: M.tren, x2: q[0], y2: M.duoi, stroke: 'var(--nhat)', 'stroke-width': 0.12, opacity: 0.45 }, svg); }
    for (v = Math.ceil(kh.y0 / by) * by; v <= kh.y1 + GAN; v += by) { q = M.P(0, v); mk('line', { x1: M.trai, y1: q[1], x2: M.phai, y2: q[1], stroke: 'var(--nhat)', 'stroke-width': 0.12, opacity: 0.45 }, svg); }
    var gx = M.P(kh.x0, ax), gy = M.P(ay, kh.y1);
    mk('line', { x1: M.trai, y1: gx[1], x2: M.phai + 1.6, y2: gx[1], stroke: 'var(--muc)', 'stroke-width': 0.35 }, svg);
    mk('line', { x1: gy[0], y1: M.duoi, x2: gy[0], y2: M.tren - 1.6, stroke: 'var(--muc)', 'stroke-width': 0.35 }, svg);
    mk('path', { d: 'M' + (M.phai + 2.2) + ' ' + gx[1] + 'l-1.8 -0.9v1.8z', fill: 'var(--muc)' }, svg);
    mk('path', { d: 'M' + gy[0] + ' ' + (M.tren - 2.2) + 'l-0.9 1.8h1.8z', fill: 'var(--muc)' }, svg);
    C.chu(svg, M.phai + 1.2, gx[1] - 2.6, 'x', co * 1.1, null, { 'font-style': 'italic' });
    C.chu(svg, gy[0] + 2.4, M.tren - 0.6, 'y', co * 1.1, null, { 'font-style': 'italic' });
    var gan = function (u, ds, b) { return (ds || []).some(function (d) { return Math.abs(d - u) < b * 0.6; }); };
    for (v = Math.ceil(kh.x0 / bx) * bx; v <= kh.x1 + GAN; v += bx) {
      if (Math.abs(v) < GAN || gan(v, tranh && tranh.x, bx)) continue;
      q = M.P(v, ax); C.chu(svg, q[0], q[1] + 2.9, nhanVach(v), co, '--nhat');
    }
    for (v = Math.ceil(kh.y0 / by) * by; v <= kh.y1 + GAN; v += by) {
      if (Math.abs(v) < GAN || gan(v, tranh && tranh.y, by)) continue;
      q = M.P(ay, v); C.chu(svg, q[0] - 1.2, q[1], nhanVach(v), co, '--nhat', { style: 'fill:var(--nhat);text-anchor:end' });
    }
    if (ax === 0 && ay === 0) { q = M.P(0, 0); C.chu(svg, q[0] - 1.8, q[1] + 2.6, 'O', co, '--nhat', { 'font-style': 'italic' }); }
    if (o.gocPhanTu) {
      var cg = [[1, 1, 'I'], [-1, 1, 'II'], [-1, -1, 'III'], [1, -1, 'IV']];
      for (i = 0; i < 4; i++) {
        var cx = cg[i][0] > 0 ? kh.x1 / 2 : kh.x0 / 2, cy = cg[i][1] > 0 ? kh.y1 / 2 : kh.y0 / 2;
        if (cg[i][0] > 0 ? kh.x1 < 1 : kh.x0 > -1) continue;
        if (cg[i][1] > 0 ? kh.y1 < 1 : kh.y0 > -1) continue;
        q = M.P(cx, cy); C.chu(svg, q[0], q[1], cg[i][2], 5, '--nhat', { opacity: 0.55 });
      }
    }
  }
  // Đoạn của đường thẳng y = ax + b nằm trong khung
  function catKhung(a, b, kh) {
    var xa = kh.x0, xb = kh.x1;
    if (Math.abs(a) > GAN) {
      var u = (kh.y0 - b) / a, w = (kh.y1 - b) / a;
      xa = Math.max(xa, Math.min(u, w)); xb = Math.min(xb, Math.max(u, w));
    } else if (b < kh.y0 || b > kh.y1) return null;
    return xa < xb ? [[xa, a * xa + b], [xb, a * xb + b]] : null;
  }
  function trongKhung(x, y, kh) { return x >= kh.x0 - GAN && x <= kh.x1 + GAN && y >= kh.y0 - GAN && y <= kh.y1 + GAN; }
  function veDiem(svg, M, kh, q, mau, ten, mo) {
    if (!trongKhung(q[0], q[1], kh)) return;
    var c = M.P(q[0], q[1]), g = C.mk('g', { opacity: mo == null ? 1 : mo }, svg);
    C.mk('circle', { cx: c[0], cy: c[1], r: 1.25, fill: 'var(' + (mau || '--muc') + ')' }, g);
    if (ten) {
      // Nhãn đặt bên phải điểm; sát mép phải thì đặt bên trái, sát mép trên thì đặt dưới
      var rong = ten.length * 2, benTrai = c[0] + 2 + rong > 99, ly = c[1] - 2.4 < M.tren + 2 ? c[1] + 3 : c[1] - 2.2;
      C.chu(g, benTrai ? c[0] - 1.6 : c[0] + 1.6, ly, ten, 3.8, mau || null, { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:' + (benTrai ? 'end' : 'start'), opacity: mo == null ? 1 : mo });
    }
  }
  // Hai nét đứt từ điểm xuống hai trục, kèm số ở chân
  function veChieu(svg, M, kh, q, mau, mo) {
    var ax = C.kep(0, kh.y0, kh.y1), ay = C.kep(0, kh.x0, kh.x1), c = M.P(q[0], q[1]), cx = M.P(q[0], ax), cy = M.P(ay, q[1]);
    var g = C.mk('g', { opacity: mo }, svg), net = { stroke: 'var(' + (mau || '--nhat') + ')', 'stroke-width': 0.3, 'stroke-dasharray': '1.2 0.9' };
    if (Math.abs(q[1] - ax) > GAN) { C.mk('line', Object.assign({ x1: c[0], y1: c[1], x2: cx[0], y2: cx[1] }, net), g); }
    if (Math.abs(q[0] - ay) > GAN) { C.mk('line', Object.assign({ x1: c[0], y1: c[1], x2: cy[0], y2: cy[1] }, net), g); }
    if (Math.abs(q[0]) > GAN) C.chu(g, cx[0], cx[1] + (q[1] >= ax ? 2.9 : -2.4), nhanVach(q[0]), 3.3, mau || '--muc', { opacity: mo });
    if (Math.abs(q[1]) > GAN) C.chu(g, cy[0] - 1.2, cy[1], nhanVach(q[1]), 3.3, mau || '--muc', { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:end', opacity: mo });
  }

  /* ================= Máy hàm số: x vào, đúng một y ra, mỗi cặp rơi thành một điểm ================= */
  function giaTri(f, x) {
    if (f.k != null) return Math.abs(x) < GAN ? NaN : f.k / x;
    return (f.a || 0) * x + (f.b || 0);
  }
  function timX(f, y) {
    if (f.k != null) return Math.abs(y) < GAN ? null : f.k / y;
    return Math.abs(f.a || 0) < GAN ? null : (y - (f.b || 0)) / f.a;
  }
  C.dangKi('mayHamSo', {
    tinh: function (p, t, o) {
      var f = o.f || {}, cap = f.bang ? f.bang.map(function (c) { return [c[0], c[1]]; }) : (o.cacX || []).map(function (x) { return [x, giaTri(f, x)]; });
      cap.forEach(function (c) { if (!la(c[1])) throw new Error('mayHamSo: không tính được f(' + c[0] + ')'); });
      var giai = p.trangThai === 'giai', n = cap.length || 1, dang = -1, khe = 0.85 / n;
      var diem = cap.map(function (c, i) {
        var tu = 0.1 + khe * i, ra = C.muot((t - tu - khe / 2) / (khe / 2));
        if (t >= tu - GAN) dang = i;
        return { x: c[0], y: c[1], hien: ra, vao: C.muot((t - tu) / (khe / 2)), an: (o.an || o.hoi === i) && !giai };
      });
      // Một x mà hai y khác nhau: không phải hàm số
      var trung = [];
      cap.forEach(function (c, i) { cap.forEach(function (d, j) { if (j > i && Math.abs(c[0] - d[0]) < GAN && Math.abs(c[1] - d[1]) > GAN && trung.indexOf(c[0]) < 0) trung.push(c[0]); }); });
      var nguoc = o.nguoc ? { y: o.nguoc.y, x: timX(f, o.nguoc.y) } : null;
      var thu = null;
      if (la(p.thu)) {
        if (nguoc) { var fy = giaTri(f, p.thu); thu = { x: p.thu, y: fy, dung: la(fy) && Math.abs(fy - nguoc.y) < GAN }; }
        else if (o.hoi != null && cap[o.hoi]) thu = { x: cap[o.hoi][0], y: p.thu, dung: Math.abs(p.thu - cap[o.hoi][1]) < GAN };
      }
      // Điểm còn là dấu hỏi thì không được làm khung giãn ra, kẻo lộ đáp án
      var can = cap.filter(function (c, i) { return !diem[i].an; }).concat(cap.filter(function (c, i) { return diem[i].an; }).map(function (c) { return [c[0], 0]; }));
      if (nguoc) can.push(la(nguoc.x) && giai ? [nguoc.x, nguoc.y] : [0, nguoc.y]);
      if (thu && la(thu.y) && Math.abs(thu.y) <= 60 && Math.abs(thu.x) <= 60) can.push([thu.x, thu.y]);
      return { cap: cap, diem: diem, dang: dang, trung: trung, nguoc: nguoc, thu: thu, giai: giai, kh: tuKhung(o, can) };
    }
  });
  C.lay('mayHamSo').ve = function (svg, k, p, t, o) {
    var mk = C.mk, H = 62, kh = k.kh;
    svg.setAttribute('viewBox', '0 0 100 ' + H);
    var M = anhXa(kh, { x: 46, y: 4, w: 51, h: 52 }, o.tiLe === true);
    veMatPhang(svg, kh, M, o);
    // Máy ở bên trái
    var dong = k.dang >= 0 ? k.diem[k.dang] : null, bien = o.bien || 'x', ham = o.tenHam || 'y';
    var vao = '?', ra = '?', mauRa = null;
    if (k.nguoc) {
      vao = k.giai && la(k.nguoc.x) ? viet(k.nguoc.x) : '?'; ra = viet(k.nguoc.y);
      if (k.thu) { vao = viet(k.thu.x); ra = la(k.thu.y) ? (tron(k.thu.y) ? '≈ ' : '') + viet(k.thu.y) : '?'; mauRa = k.thu.dung ? '--cc' : '--sai'; }
    } else if (k.thu) { vao = viet(k.thu.x); ra = viet(k.thu.y) + ' ?'; mauRa = k.thu.dung ? '--cc' : '--sai'; }
    else if (dong) {
      vao = viet(dong.x);
      ra = dong.an ? '?' : dong.hien > 0.5 ? (tron(dong.y) ? '≈ ' : '') + viet(dong.y) : '…';
    }
    C.chu(svg, 20, 7, bien + ' = ' + vao, 4.6, '--a', { opacity: k.nguoc || k.thu || !dong ? 1 : 0.35 + 0.65 * dong.vao });
    mk('path', { d: 'M20 10.5V17', stroke: 'var(--nhat)', 'stroke-width': 0.5 }, svg);
    mk('path', { d: 'M18.4 15.6L20 18.6L21.6 15.6Z', fill: 'var(--nhat)' }, svg);
    mk('rect', { x: 2, y: 19.5, width: 36, height: 17, rx: 2.2, fill: 'var(--tg)', 'fill-opacity': 0.92 }, svg);
    var nhanF = o.nhanF || '', coF = Math.min(4.6, 33 / (Math.max(1, nhanF.length) * 0.5));
    C.chu(svg, 20, 28.2, nhanF, coF, null, { style: 'fill:var(--mat)' });
    mk('path', { d: 'M20 37V43.5', stroke: 'var(--nhat)', 'stroke-width': 0.5 }, svg);
    mk('path', { d: 'M18.4 42.2L20 45.2L21.6 42.2Z', fill: 'var(--nhat)' }, svg);
    C.chu(svg, 20, 50, ham + ' = ' + ra, 4.6, mauRa || '--b');
    if (k.trung.length) C.chu(svg, 20, 58, 'Một x mà hai y!', 3.8, '--sai', { opacity: C.muot((t - 0.9) / 0.1) });
    // Đường y = giá trị cần tìm (bài cho y, hỏi x)
    if (k.nguoc) {
      var dd = catKhung(0, k.nguoc.y, kh);
      if (dd) { var u = M.P(dd[0][0], dd[0][1]), w = M.P(dd[1][0], dd[1][1]); mk('line', { x1: u[0], y1: u[1], x2: w[0], y2: w[1], stroke: 'var(--b)', 'stroke-width': 0.45, 'stroke-dasharray': '1.6 1' }, svg); }
    }
    k.trung.forEach(function (x) {
      var u = M.P(x, kh.y0), w = M.P(x, kh.y1);
      mk('line', { x1: u[0], y1: u[1], x2: w[0], y2: w[1], stroke: 'var(--sai)', 'stroke-width': 0.4, 'stroke-dasharray': '1.4 1', opacity: C.muot((t - 0.9) / 0.1) }, svg);
    });
    k.diem.forEach(function (d) {
      if (d.an) {
        // Chỗ của câu hỏi: cột x đã biết, y còn là dấu hỏi
        if (d.hien > 0 && trongKhung(d.x, 0, kh)) { var c = M.P(d.x, C.kep(0, kh.y0, kh.y1)); C.chu(svg, c[0], c[1] - 2.6, '?', 4.4, '--a', { opacity: d.hien }); }
        return;
      }
      veDiem(svg, M, kh, [d.x, d.y], '--a', null, d.hien);
      if (o.chieu && d.hien > 0) veChieu(svg, M, kh, [d.x, d.y], '--nhat', d.hien * 0.8);
    });
    if (k.nguoc && k.giai && la(k.nguoc.x)) { veDiem(svg, M, kh, [k.nguoc.x, k.nguoc.y], '--cc'); veChieu(svg, M, kh, [k.nguoc.x, k.nguoc.y], '--cc', 1); }
    if (k.thu && la(k.thu.y)) { veDiem(svg, M, kh, [k.thu.x, k.thu.y], k.thu.dung ? '--cc' : '--sai'); veChieu(svg, M, kh, [k.thu.x, k.thu.y], k.thu.dung ? '--cc' : '--sai', 1); }
  };

  /* ================= Đường thẳng, bậc thang, tịnh tiến ================= */
  function tinhDuong(p, t, o) {
    var giai = p.trangThai === 'giai';
    var ds = (o.duong || []).map(function (d) { return Object.assign({}, d); });
    if (o.theoThamSo) {
      ds = [{ a: p.a, b: p.b, mau: '--b', an: !!o.bac && o.theoThamSo !== 2 }].concat(p.c != null && o.theoThamSo === 2 ? [{ a: p.a, b: p.c, mau: '--cc', an: true }] : []).concat(ds);
    }
    var thu = null;
    if (o.thu && la(p.thu)) {
      // Em gõ một số: đường thẳng đó vẽ theo số em gõ; trùng hệ số gốc thì là đúng
      if (o.thu.duong != null) {
        var d0 = ds[o.thu.duong], gan = o.thu.gan || 'a', moi = p.thu + (o.thu.cong || 0);
        d0.dung = Math.abs(moi - d0[gan]) < GAN; d0[gan] = moi; d0.thu = true;
      }
      thu = p.thu;
    }
    // an: true thì hiện dần ở cuối cảnh; an: 'giai' thì chỉ hiện khi em đã gõ (đúng hoặc sai)
    ds.forEach(function (d) {
      if (!la(d.a) || !la(d.b)) throw new Error('duongThang: hệ số lạ');
      d.hien = !d.an || d.thu || giai ? 1 : d.an === true ? C.muot((t - 0.8) / 0.15) : 0;
    });
    // Bậc thang: sang ngang dx thì đứng a·dx, lần lượt từng bậc
    var bac = (o.bac || []).map(function (b) {
      var d = ds[b.duong || 0], n = Math.abs(b.soBuoc), h = b.soBuoc < 0 ? -1 : 1, dx = (b.dx || 1) * h;
      var tu = b.tu != null ? b.tu : 0, khe = 0.65 / Math.max(1, n), ds2 = [];
      for (var k = 0; k < n; k++) {
        var x1 = tu + dx * k, x2 = x1 + dx, bd = 0.1 + khe * k;
        ds2.push({ x1: x1, y1: d.a * x1 + d.b, x2: x2, y2: d.a * x2 + d.b, len: d.a * dx, ngang: dx,
          tienNgang: C.muot((t - bd) / (khe / 2)), tienDoc: C.muot((t - bd - khe / 2) / (khe / 2)) });
      }
      return { duong: b.duong || 0, buoc: ds2, mau: d.thu ? (d.dung ? '--cc' : '--sai') : null };
    });
    var dich = null;
    if (o.tinhTien) {
      var A = ds[o.tinhTien.tu], B = ds[o.tinhTien.den], k2 = C.muot((t - 0.15) / 0.55);
      dich = { a: A.a, b: C.noiSuy(A.b, B.b, k2), tien: k2, khoang: B.b - A.b, cungA: Math.abs(A.a - B.a) < GAN, hienKhoang: C.muot((t - 0.72) / 0.15) };
    }
    var giao = null;
    if (o.giao) {
      var u = ds[o.giao[0]], v = ds[o.giao[1]];
      if (Math.abs(u.a - v.a) > GAN) { var gx = (v.b - u.b) / (u.a - v.a); giao = { x: gx, y: u.a * gx + u.b }; }
    }
    var diem = (o.diem || []).map(function (q) {
      return Object.assign({}, q, { hien: !q.an ? 1 : giai ? 1 : q.an === true ? C.muot((t - 0.9) / 0.1) : 0 });
    });
    var can = [];
    diem.forEach(function (q) { can.push([q.x, q.y]); });
    bac.forEach(function (b) { b.buoc.forEach(function (s) { can.push([s.x1, s.y1], [s.x2, s.y2]); }); });
    ds.forEach(function (d) { can.push([0, d.b]); });
    return { ds: ds, bac: bac, dich: dich, giao: giao, diem: diem, thu: thu, giai: giai, kh: tuKhung(o, can) };
  }
  function veDuong(svg, k, p, t, o) {
    var mk = C.mk, kh = k.kh, tiLe = o.tiLe !== false, xs = kh.x1 - kh.x0, ys = kh.y1 - kh.y0;
    // Lề trái đủ cho số dài nhất trên trục tung
    var by = vach(ys), dai = 1;
    for (var v = Math.ceil(kh.y0 / by) * by; v <= kh.y1; v += by) dai = Math.max(dai, nhanVach(v).length);
    k.diem.forEach(function (q) { if (q.chieu) dai = Math.max(dai, nhanVach(q.y).length); });
    var trai = 3 + dai * 1.75, rongP = 100 - trai - 5, caoP = tiLe ? C.kep(rongP * ys / xs, 40, 105) : 62;
    var H = caoP + 10;
    svg.setAttribute('viewBox', '0 0 100 ' + H);
    var M = anhXa(kh, { x: trai, y: 5, w: rongP, h: caoP }, tiLe);
    var tranh = { x: [], y: [] };
    k.diem.forEach(function (q) { if (q.chieu && q.hien > 0) { tranh.x.push(q.x); tranh.y.push(q.y); } });
    veMatPhang(svg, kh, M, o, tranh);
    var net = function (a, b, mau, mo, dut, day) {
      var d = catKhung(a, b, kh);
      if (!d || mo <= 0) return;
      var u = M.P(d[0][0], d[0][1]), w = M.P(d[1][0], d[1][1]);
      mk('line', { x1: u[0], y1: u[1], x2: w[0], y2: w[1], stroke: 'var(' + mau + ')', 'stroke-width': day || 0.7, 'stroke-dasharray': dut ? '1.8 1.1' : null, opacity: mo, 'stroke-linecap': 'round' }, svg);
    };
    k.ds.forEach(function (d) {
      var mau = d.thu ? (d.dung ? '--cc' : '--sai') : (d.mau || '--b');
      if (d.x2) {
        // Đường cong y = x2·x² + ax + b (để so với đường thẳng)
        var diemCong = [], buocX = xs / 80;
        for (var x = kh.x0; x <= kh.x1 + GAN; x += buocX) {
          var y = d.x2 * x * x + d.a * x + d.b;
          if (y >= kh.y0 && y <= kh.y1) diemCong.push(M.P(x, y)); else if (diemCong.length) break;
        }
        if (diemCong.length > 1) mk('polyline', { points: C.diem(diemCong), fill: 'none', stroke: 'var(' + mau + ')', 'stroke-width': 0.7, opacity: d.hien }, svg);
      } else net(d.a, d.b, mau, d.hien, d.net);
      if (d.nhan && d.hien > 0) {
        // Nhãn đặt ở gần cuối đoạn nhìn thấy (hoặc ở hoành độ nhanX), bên trái điểm; không đủ chỗ thì sang phải
        var c = catKhung(d.a, d.b, { x0: kh.x0, x1: kh.x1 - xs * 0.05, y0: kh.y0 + ys * 0.08, y1: kh.y1 - ys * 0.08 });
        var xn = d.nhanX != null ? d.nhanX : c ? c[0][0] + (c[1][0] - c[0][0]) * 0.82 : kh.x1 - xs * 0.25;
        var q = M.P(xn, C.kep(d.a * xn + d.b, kh.y0, kh.y1)), rongNhan = d.nhan.length * 1.85, benPhai = q[0] - 1.5 - rongNhan < 1;
        C.chu(svg, benPhai ? Math.min(q[0] + 1.5, 99 - rongNhan) : Math.min(q[0] - 1.5, 96), q[1] - 2.4, d.nhan, 3.6, mau, { style: 'fill:var(' + mau + ');text-anchor:' + (benPhai ? 'start' : 'end'), opacity: d.hien });
      }
    });
    if (k.dich) {
      var dc = k.dich;
      net(dc.a, dc.b, '--a', dc.tien > 0 && dc.tien < 1 ? 0.9 : 0, true, 0.6);
      if (dc.hienKhoang > 0 && Math.abs(dc.khoang) > GAN && dc.cungA) {
        var goc0 = k.ds[o.tinhTien.tu];
        // Ba mũi tên dọc ở ba chỗ mà cả hai đường đều còn trong khung
        var hop = [];
        for (var f = 0.08; f < 0.95; f += 0.04) { var xf = kh.x0 + xs * f, yf = goc0.a * xf + goc0.b; if (trongKhung(xf, yf, kh) && trongKhung(xf, yf + dc.khoang, kh)) hop.push(xf); }
        var chon = hop.length > 2 ? [hop[0], hop[Math.floor(hop.length / 2)], hop[hop.length - 1]] : hop;
        chon.forEach(function (x, i) {
          var y1 = goc0.a * x + goc0.b, y2 = y1 + dc.khoang;
          var u = M.P(x, y1), w = M.P(x, y2), len = w[1] > u[1] ? -1 : 1, g = mk('g', { opacity: dc.hienKhoang }, svg);
          mk('line', { x1: u[0], y1: u[1], x2: w[0], y2: w[1] + len * 0.9, stroke: 'var(--a)', 'stroke-width': 0.5 }, g);
          mk('path', { d: 'M' + w[0] + ' ' + w[1] + 'l-1 ' + (len * 1.8) + 'h2z', fill: 'var(--a)' }, g);
          if (i === chon.length - 1) C.chu(g, u[0] + 1.4, (u[1] + w[1]) / 2, (dc.khoang > 0 ? '+' : '−') + C.fmt(Math.abs(dc.khoang)), 3.6, '--a', { style: 'fill:var(--a);text-anchor:start', opacity: dc.hienKhoang });
        });
      }
    }
    k.bac.forEach(function (b, bi) {
      var mauDoc = b.mau || '--a', cau = (o.bac[bi] || {});
      b.buoc.forEach(function (s) {
        if (s.tienNgang <= 0) return;
        var xm = s.x1 + (s.x2 - s.x1) * s.tienNgang;
        if (!trongKhung(s.x1, s.y1, kh) || !trongKhung(s.x2, s.y1, kh)) return;
        var u = M.P(s.x1, s.y1), w = M.P(xm, s.y1);
        mk('line', { x1: u[0], y1: u[1], x2: w[0], y2: w[1], stroke: 'var(--nhat)', 'stroke-width': 0.45, 'stroke-dasharray': '1.2 0.8' }, svg);
        if (s.tienDoc <= 0 || !trongKhung(s.x2, s.y2, kh)) return;
        var ym = s.y1 + (s.y2 - s.y1) * s.tienDoc, z = M.P(s.x2, ym);
        mk('line', { x1: w[0], y1: w[1], x2: z[0], y2: z[1], stroke: 'var(' + mauDoc + ')', 'stroke-width': 0.8, 'stroke-linecap': 'round' }, svg);
        if (cau.nhan && s.tienDoc >= 1) {
          var trai0 = s.ngang < 0;
          C.chu(svg, (u[0] + w[0]) / 2, u[1] + (s.len > 0 ? 2.6 : -2.2), C.fmt(Math.abs(s.ngang)), 3.1, '--nhat');
          C.chu(svg, z[0] + (trai0 ? -1.2 : 1.2), (w[1] + z[1]) / 2, (s.len >= 0 ? '+' : '−') + C.fmt(Math.abs(s.len)), 3.3, mauDoc, { style: 'fill:var(' + mauDoc + ');text-anchor:' + (trai0 ? 'end' : 'start') });
        }
        if (s.tienDoc >= 1) veDiem(svg, M, kh, [s.x2, s.y2], mauDoc);
      });
      if (b.buoc.length) veDiem(svg, M, kh, [b.buoc[0].x1, b.buoc[0].y1], mauDoc);
    });
    (o.goc || []).forEach(function (i) {
      var d = k.ds[i];
      if (!d || Math.abs(d.a) < GAN || d.hien <= 0) return;
      var xA = -d.b / d.a;
      if (!trongKhung(xA, 0, kh)) return;
      var A = M.P(xA, 0), r = 6, phi = Math.atan2(d.a * M.sy, M.sx); // hướng đi lên của đường thẳng trên hình
      if (phi < 0) phi += Math.PI;
      var E = [A[0] + r * Math.cos(phi), A[1] - r * Math.sin(phi)];
      mk('path', { d: 'M' + A[0] + ' ' + A[1] + 'L' + (A[0] + r) + ' ' + A[1] + 'A' + r + ' ' + r + ' 0 0 0 ' + E[0] + ' ' + E[1] + 'Z', fill: 'var(--a)', 'fill-opacity': 0.25, stroke: 'var(--a)', 'stroke-width': 0.35, opacity: d.hien }, svg);
      var m = phi / 2;
      C.chu(svg, A[0] + (r + 2.4) * Math.cos(m), A[1] - (r + 2.4) * Math.sin(m), 'α', 3.8, '--a', { opacity: d.hien });
    });
    k.diem.forEach(function (q) {
      if (q.hien <= 0) return;
      veDiem(svg, M, kh, [q.x, q.y], q.mau || '--muc', q.ten, q.hien);
      if (q.chieu) veChieu(svg, M, kh, [q.x, q.y], q.mau || '--nhat', q.hien);
    });
    if (k.giao && trongKhung(k.giao.x, k.giao.y, kh) && k.ds[o.giao[0]].hien > 0.5 && k.ds[o.giao[1]].hien > 0.5) {
      var gp = M.P(k.giao.x, k.giao.y);
      mk('circle', { cx: gp[0], cy: gp[1], r: 1.9, fill: 'none', stroke: 'var(' + (o.mauGiao || '--sai') + ')', 'stroke-width': 0.5 }, svg);
    }
    if (o.ghi) C.chu(svg, 50, H - 1.8, typeof o.ghi === 'function' ? o.ghi(k, p) : o.ghi, 3.6, '--nhat');
  }
  C.dangKi('duongThang', {
    thamSo: { a: { min: -2, max: 2, step: 0.5, md: 2, nhan: 'Hệ số a', mau: '--a' }, b: { min: -2, max: 2, step: 1, md: -1, nhan: 'b', mau: '--b' } },
    tinh: tinhDuong
  });
  C.dangKi('haiDuongThang', {
    thamSo: { a: { min: -2, max: 2, step: 0.5, md: 1, nhan: 'Hệ số a', mau: '--a' }, b: { min: -3, max: 3, step: 1, md: -2, nhan: 'b', mau: '--b' },
      c: { min: -3, max: 3, step: 1, md: 2, nhan: "b'", mau: '--cc' } },
    tinh: tinhDuong
  });
  C.lay('duongThang').ve = veDuong;
  C.lay('haiDuongThang').ve = veDuong;
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
