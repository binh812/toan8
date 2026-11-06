// Cảnh cho chương III: tứ giác và các hình đặc biệt.
//   gocTuGiac: các góc của tứ giác ghép quanh một điểm thành đúng một vòng (bài 10)
//   thangCan:  gập hình thang cân theo trục, hai nửa trùng khít (bài 11)
//   quayHBH:   quay nửa hình bình hành nửa vòng quanh tâm, trùng nửa kia (bài 12)
//   haiThanh:  hai thanh bằng nhau gắn ở trung điểm luôn tạo hình chữ nhật (bài 13)
//   khungThoi: khung bốn thanh bằng nhau; hai đường chéo vuông góc (bài 14)
// Toạ độ trong tinh theo kiểu toán (trục y hướng lên); phần vẽ lật lại cho SVG.
(function (C) {
  'use strict';
  var PI = Math.PI, NGUONG_CUOI = 0.85;

  /* ---------- Hình học phẳng ---------- */
  function rad(d) { return d * PI / 180; }
  function deg(r) { return r * 180 / PI; }
  function huongDen(d) { return [Math.cos(rad(d)), Math.sin(rad(d))]; }
  function cong(P, Q) { return [P[0] + Q[0], P[1] + Q[1]]; }
  function tru(P, Q) { return [P[0] - Q[0], P[1] - Q[1]]; }
  function nhan(P, k) { return [P[0] * k, P[1] * k]; }
  function dai(P, Q) { return Math.hypot(Q[0] - P[0], Q[1] - P[1]); }
  function giua(P, Q) { return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; }
  function lerp(P, Q, k) { return [P[0] + (Q[0] - P[0]) * k, P[1] + (Q[1] - P[1]) * k]; }
  function huong(O, P) { return deg(Math.atan2(P[1] - O[1], P[0] - O[0])); }
  function chuan(a) { return ((a % 360) + 360) % 360; }
  function doGoc(P, O, Q) {
    var u = tru(P, O), v = tru(Q, O);
    return deg(Math.acos(C.kep((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1])), -1, 1)));
  }
  function quay(P, O, a) {
    var c = Math.cos(rad(a)), s = Math.sin(rad(a)), x = P[0] - O[0], y = P[1] - O[1];
    return [O[0] + x * c - y * s, O[1] + x * s + y * c];
  }
  function doiXung(P, O) { return [2 * O[0] - P[0], 2 * O[1] - P[1]]; }
  // Hình quạt của góc POQ (đỉnh O, nhỏ hơn 180°): bắt đầu ở hướng bd, quét ngược chiều kim đồng hồ goc độ
  function quat(O, P, Q, r, mau) {
    var a1 = huong(O, P), a2 = huong(O, Q), d = chuan(a2 - a1);
    return d <= 180 ? { tam: O, bd: a1, goc: d, r: r, mau: mau } : { tam: O, bd: a2, goc: 360 - d, r: r, mau: mau };
  }
  // Quạt q trượt tới tâm T và xoay cho hướng bắt đầu thành b; k = 0 là chỗ cũ, k = 1 là chỗ mới (bán kính đổi dần thành rMoi nếu có)
  function doiQuat(q, T, b, k, rMoi) {
    var d = chuan(b - q.bd);
    if (d > 180) d -= 360;
    return { tam: lerp(q.tam, T, k), bd: q.bd + d * k, goc: q.goc, r: rMoi ? q.r + (rMoi - q.r) * k : q.r, mau: q.mau, den: k };
  }
  function bien(ds) {
    var xs = ds.map(function (q) { return q[0]; }), ys = ds.map(function (q) { return q[1]; });
    return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
  }
  // Chữ trên hình: chuỗi cố định, hoặc { dau, cuoi, giai }: cuoi hiện khi hình đã chạy gần hết, giai khi em làm đúng
  function viet(spec, p, t, o) {
    if (spec == null) return '';
    if (typeof spec !== 'object') return String(spec);
    if ((p.trangThai === 'giai' || (o.loCuoi && t >= 1 - 1e-9)) && spec.giai != null) return spec.giai;
    if (t >= NGUONG_CUOI && spec.cuoi != null) return spec.cuoi;
    return spec.dau == null ? '' : spec.dau;
  }
  function soThu(p) { return typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0 ? p.thu : null; }

  /* ---------- Bài 10: các góc của tứ giác ---------- */
  var R_QUAT = 1.5, CO_HINH = 6;
  // Tứ giác lồi đi ngược chiều kim đồng hồ có đúng bốn góc g (độ)
  function loiDung(P, g) {
    for (var i = 0; i < 4; i++) {
      var a = P[(i + 3) % 4], o = P[i], b = P[(i + 1) % 4];
      if ((o[0] - a[0]) * (b[1] - o[1]) - (o[1] - a[1]) * (b[0] - o[0]) <= 1e-9) return false;
      if (Math.abs(doGoc(a, o, b) - g[i]) > 0.01) return false;
    }
    return true;
  }
  function tuGoc(g) {
    var tot = null, tiTot = Infinity;
    for (var ab = 3; ab <= 9; ab += 0.5) for (var ad = 2; ad <= 8; ad += 0.5) {
      var B = [ab, 0], D = nhan(huongDen(g[0]), ad), u = huongDen(180 - g[1]), v = huongDen(g[0] + 180 + g[3]);
      var rx = D[0] - B[0], ry = D[1] - B[1], det = -u[0] * v[1] + u[1] * v[0];
      if (Math.abs(det) < 1e-9) continue;
      var P = [[0, 0], B, cong(B, nhan(u, (-rx * v[1] + ry * v[0]) / det)), D];
      if (!loiDung(P, g)) continue;
      var c = [0, 1, 2, 3].map(function (i) { return dai(P[i], P[(i + 1) % 4]); }), ti = Math.max.apply(null, c) / Math.min.apply(null, c);
      if (ti < tiTot - 1e-9) { tiTot = ti; tot = P; }
    }
    if (!tot) throw new Error('gocTuGiac: không dựng được tứ giác lồi có bốn góc ' + g.join(', '));
    return tot;
  }
  // Dời và co dãn cho hình nằm trong khung 6 × 6, góc dưới trái ở gốc
  function chuanHoa(P) {
    var b = bien(P), k = CO_HINH / Math.max(b.x1 - b.x0, b.y1 - b.y0);
    return P.map(function (q) { return [(q[0] - b.x0) * k, (q[1] - b.y0) * k]; });
  }
  function nhipQuat(t, j, m) { var w = 0.7 / m; return C.muot((t - 0.15 - w * j) / w); }

  C.dangKi('gocTuGiac', {
    thamSo: { cx: { min: 4.5, max: 8.5, step: 0.5, md: 7, nhan: 'Đỉnh C: ngang' }, cy: { min: 3, max: 6, step: 0.5, md: 5, nhan: 'Đỉnh C: dọc' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var chia = o.dang === 'chia';
      var P = chuanHoa(chia ? [[0, 0], [6, 0], [p.cx, p.cy], [1, 4.5]] : o.diem ? o.diem : tuGoc(o.goc));
      var g = P.map(function (V, i) { return doGoc(P[(i + 3) % 4], V, P[(i + 1) % 4]); });
      var b = bien(P), r = R_QUAT, T = [b.x1 + 2.6 + r, (b.y0 + b.y1) / 2];
      var dinh = P.map(function (V, i) { return quat(V, P[(i + 1) % 4], P[(i + 3) % 4], r, ['--a', '--b', '--cc', '--tg'][i]); });
      var kq = { P: P, g: g, T: T, r: r, w: b.x1, h: b.y1, dinh: dinh };
      if (chia) {
        // Đường chéo BD chia tứ giác thành tam giác ABD và CBD; mỗi tam giác góp ba góc
        var A = P[0], B = P[1], Cc = P[2], D = P[3];
        var qA = quat(A, B, D, r, '--a'), qB1 = quat(B, D, A, r, '--b'), qD1 = quat(D, A, B, r, '--tg');
        var qB2 = quat(B, Cc, D, r, '--b'), qC = quat(Cc, D, B, r, '--cc'), qD2 = quat(D, B, Cc, r, '--tg');
        var k1 = C.muot((t - 0.25) / 0.3), k2 = C.muot((t - 0.6) / 0.3);
        kq.tamGiac = [[qD1, qA, qB1], [qB2, qC, qD2]];
        kq.k1 = k1; kq.k2 = k2;
        kq.di = [doiQuat(qD1, T, 0, k1), doiQuat(qA, T, qD1.goc, k1), doiQuat(qB1, T, qD1.goc + qA.goc, k1),
          doiQuat(qB2, T, 180, k2), doiQuat(qC, T, 180 + qB2.goc, k2), doiQuat(qD2, T, 180 + qB2.goc + qC.goc, k2)];
        kq.cheo = C.muot((t - 0.1) / 0.1);
        return kq;
      }
      var an = o.an || [], biet = [0, 1, 2, 3].filter(function (i) { return an.indexOf(i) < 0; }), daGhep = 0;
      kq.di = biet.map(function (i, j) {
        var q = doiQuat(dinh[i], T, daGhep, nhipQuat(t, j, biet.length));
        q.dinh = i; daGhep += dinh[i].goc;
        return q;
      });
      kq.ho = { bd: daGhep, goc: 360 - daGhep, hien: C.muot((t - 0.85) / 0.1) };
      var v = soThu(p);
      if (v !== null) {
        var moi = Math.min(v, 400), so = an.length > 1 && o.bang ? an.length : 1;
        kq.thu = [];
        for (var k = 0; k < so; k++) kq.thu.push({ tam: T, bd: daGhep + k * moi, goc: moi, r: r * 0.92, mau: '--sai' });
        kq.thuTong = so * v;
      }
      return kq;
    }
  });

  /* ---------- Bài 11: hình thang cân gập theo trục ---------- */
  C.dangKi('thangCan', {
    thamSo: { dn: { min: 1, max: 6, step: 0.5, md: 3.5, nhan: 'Đáy nhỏ AB' }, h: { min: 1.5, max: 5, step: 0.5, md: 3.5, nhan: 'Chiều cao' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var dl = o.dl || 8, dn = o.dn != null ? o.dn : p.dn, h = o.h != null ? o.h : p.h, x;
      if (o.gocDay != null) { x = h / Math.tan(rad(o.gocDay)); dn = dl - 2 * x; }
      dn = C.kep(dn, 0.2, dl - 0.2);
      x = (dl - dn) / 2;
      if (o.canhBen != null) {
        if (o.canhBen <= x) throw new Error('thangCan: cạnh bên quá ngắn');
        h = Math.sqrt(o.canhBen * o.canhBen - x * x);
      }
      var m = dl / 2, A = [x, h], B = [dl - x, h], Cc = [dl, 0], D = [0, 0];
      var S = o.dinh ? [m, h * dl / (dl - dn)] : null, k = C.muot((t - 0.2) / 0.6);
      function lat(Q) { return Q && [m + (Q[0] - m) * Math.cos(PI * k), Q[1]]; }
      return { A: A, B: B, C: Cc, D: D, H: [x, 0], K: [dl - x, 0], S: S, m: m, h: h, dl: dl, dn: dn, k: k,
        gocDay: deg(Math.atan2(h, x)), lat: { A: lat(A), B: lat(B), C: lat(Cc), D: lat(D), H: lat([x, 0]), S: lat(S) }, thu: soThu(p) };
    }
  });

  /* ---------- Bài 12: quay nửa vòng quanh tâm hình bình hành ---------- */
  C.dangKi('quayHBH', {
    thamSo: { g: { min: 40, max: 140, step: 5, md: 65, nhan: 'Góc D' }, b: { min: 2, max: 5, step: 0.5, md: 3.5, nhan: 'Cạnh AD' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      if (o.dang === 'baDiem') {
        // Ba điểm A, B, C; quay tam giác nửa vòng quanh trung điểm một cạnh thì được đỉnh thứ tư của một hình bình hành
        var Q = o.diem || [[0, 0], [5, 0], [1.5, 3.5]], A3 = Q[0], B3 = Q[1], C3 = Q[2];
        var cap = [[A3, C3, B3], [A3, B3, C3], [B3, C3, A3]], k1 = C.muot((t - 0.2) / 0.6);
        return { A: A3, B: B3, C: C3, k: k1, cap: cap.map(function (c, i) {
          var O = giua(c[0], c[1]), kk = i === 0 ? k1 : (p.trangThai === 'giai' ? 1 : 0);
          return { O: O, D: doiXung(c[2], O), k: kk, tamGiac: [c[0], c[1], c[2]].map(function (X) { return quay(X, O, 180 * kk); }) };
        }) };
      }
      var a = o.a || 6, b = o.b != null ? o.b : p.b, g = o.g != null ? o.g : p.g;
      var D = [0, 0], Cc = [a, 0], A = nhan(huongDen(g), b), B = cong(A, [a, 0]), O = giua(A, Cc);
      var k = C.muot((t - 0.25) / 0.6), cat = o.cat === 'BD' ? 'BD' : 'AC';
      var nua = cat === 'AC' ? { A: A, B: B, C: Cc } : { A: A, B: B, D: D }, xoay = {};
      Object.keys(nua).forEach(function (n) { xoay[n] = quay(nua[n], O, 180 * k); });
      return { A: A, B: B, C: Cc, D: D, O: O, a: a, b: b, g: g, k: k, cat: cat, xoay: xoay, catHien: C.muot((t - 0.1) / 0.1) };
    }
  });

  /* ---------- Bài 13: hai thanh bằng nhau gắn ở trung điểm ---------- */
  function trungTuyen(p, t, o) {
    var bc, be;
    if (o.ab != null) { bc = Math.hypot(o.ab, o.ac); be = deg(Math.atan2(o.ac, o.ab)); } else { bc = o.bc; be = o.gocB; }
    var B = [0, 0], Cc = [bc, 0], A = nhan(huongDen(be), bc * Math.cos(rad(be))), M = [bc / 2, 0], D = doiXung(A, M);
    var k1 = C.muot((t - 0.15) / 0.4);
    return { dang: 'trungTuyen', A: A, B: B, C: Cc, M: M, D: D, Dk: lerp(M, D, k1), k1: k1, k2: C.muot((t - 0.6) / 0.3), bc: bc, thu: soThu(p) };
  }
  C.dangKi('haiThanh', {
    thamSo: { phi: { min: 30, max: 150, step: 5, md: 70, nhan: 'Góc giữa hai thanh' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      if (o.dang === 'trungTuyen') return trungTuyen(p, t, o);
      var phi = o.phi != null ? o.phi : p.phi, L = o.L || 4, O = [0, 0];
      var A = nhan(huongDen(90 + phi / 2), L), B = nhan(huongDen(90 - phi / 2), L), kq = { A: A, B: B, C: nhan(A, -1), D: nhan(B, -1), O: O, L: L, phi: phi };
      if (o.chungMinh) {
        // Tam giác ABC: hai tam giác cân OAB (góc đáy x, cam) và OBC (góc đáy y, xanh)
        // Quạt nhỏ ở đỉnh, lớn dần khi về chỗ ghép cho dễ đọc
        var r = 0.28 * L, R = 0.6 * L, T = [L + 1.2 + R, -0.25 * L];
        var qA = quat(A, B, O, r, '--a'), qB1 = quat(B, A, O, r, '--a'), qB2 = quat(B, O, kq.C, r, '--b'), qC = quat(kq.C, O, B, r, '--b');
        var km = C.muot((t - 0.45) / 0.4);
        kq.r = R; kq.T = T; kq.km = km; kq.tamGiac = C.muot((t - 0.25) / 0.15);
        kq.quat = [qA, qC, qB1, qB2];
        kq.di = [doiQuat(qA, T, 0, km, R), doiQuat(qC, T, qA.goc, km, R), doiQuat(qB1, T, qA.goc + qC.goc, km, R), doiQuat(qB2, T, qA.goc + qC.goc + qB1.goc, km, R)];
        kq.khung = C.muot((t - 0.1) / 0.1);
      } else kq.khung = 1;
      kq.thanh = o.chungMinh ? 1 : C.muot((t - 0.2) / 0.4);
      return kq;
    }
  });

  /* ---------- Bài 14: khung bốn thanh bằng nhau ---------- */
  function thoiGoc(s, gA) { var a = s * Math.cos(rad(gA / 2)), b = s * Math.sin(rad(gA / 2)); return { A: [-a, 0], B: [0, b], C: [a, 0], D: [0, -b], O: [0, 0] }; }
  C.dangKi('khungThoi', {
    thamSo: { g: { min: 30, max: 80, step: 5, md: 50, nhan: 'Góc A lúc đầu' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      if (o.dang === 'dienTich') {
        var w = o.d1, h = o.d2, E = [w / 2, h], F = [w, h / 2], G = [w / 2, 0], H = [0, h / 2], k = C.muot((t - 0.2) / 0.6);
        var goc = [[E, [w, h], F], [H, [0, h], E], [G, [0, 0], H], [F, [w, 0], G]];
        // Mỗi tam giác ở góc trượt thẳng vào trong, đỉnh góc về đúng tâm O: bốn tam giác lấp kín hình thoi
        var O = [w / 2, h / 2];
        return { dang: 'dienTich', w: w, h: h, E: E, F: F, G: G, H: H, O: O, k: k,
          goc: goc.map(function (tg) { var d = nhan(tru(O, tg[1]), k); return tg.map(function (X) { return cong(X, d); }); }) };
      }
      var s = o.s || 4, gA, kq;
      if (o.dang === 'bop') {
        var g0 = o.g != null ? o.g : p.g;
        gA = g0 + (180 - 2 * g0) * C.muot((t - 0.1) / 0.4);
        kq = thoiGoc(s, gA);
        kq.kA = C.muot((t - 0.55) / 0.12); kq.kC = C.muot((t - 0.75) / 0.12); kq.kT = C.muot((t - 0.9) / 0.08);
        kq.g0 = g0;
      } else {
        gA = o.gA;
        kq = thoiGoc(s, gA);
        kq.kc = C.muot((t - 0.2) / 0.3); kq.kp = C.muot((t - 0.5) / 0.3);
      }
      kq.dang = o.dang || 'goc'; kq.s = s; kq.gA = gA; kq.thu = soThu(p);
      return kq;
    }
  });

  /* ================= Phần vẽ ================= */
  function L(q) { return [q[0], -q[1]]; }
  function khung(svg, x0, y0, x1, y1) {
    svg.setAttribute('viewBox', [x0, -y1, x1 - x0, y1 - y0].join(' '));
    return (x1 - x0) / 16;
  }
  function net(mau, day, them) { return Object.assign({ stroke: 'var(' + mau + ')', 'stroke-width': day, 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, them || {}); }
  function da(svg, pts, at) { return C.mk('polygon', Object.assign({ points: C.diem(pts.map(L)) }, at), svg); }
  function doan(svg, P, Q, at) { var a = L(P), b = L(Q); return C.mk('line', Object.assign({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, at), svg); }
  function to(mau, dam, them) { return Object.assign({ fill: 'var(' + mau + ')', 'fill-opacity': dam, stroke: 'none' }, them || {}); }
  function diemQuat(q) {
    var n = Math.max(3, Math.ceil(q.goc / 6)), pts = [q.tam];
    for (var i = 0; i <= n; i++) pts.push(cong(q.tam, nhan(huongDen(q.bd + q.goc * i / n), q.r)));
    return pts;
  }
  function veQuat(svg, q, at) {
    return da(svg, diemQuat(q), Object.assign({ fill: 'var(' + q.mau + ')', 'fill-opacity': 0.45, stroke: 'var(' + q.mau + ')', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, at));
  }
  function vienQuat(svg, q, at) { return da(svg, diemQuat(q), net(q.mau, 1, Object.assign({ 'stroke-dasharray': '3 3' }, at))); }
  function chuTai(svg, P, s, co, mau, them) { var a = L(P); return C.chu(svg, a[0], a[1], s, co, mau, them); }
  // Đơn vị đường thẳng từ P tới Q
  function donVi(P, Q) { var d = tru(Q, P), l = Math.hypot(d[0], d[1]) || 1; return [d[0] / l, d[1] / l]; }
  function vuongGoc(svg, O, P, Q, e, them) {
    var u = nhan(donVi(O, P), e), v = nhan(donVi(O, Q), e);
    C.mk('polyline', Object.assign({ points: C.diem([cong(O, u), cong(cong(O, u), v), cong(O, v)].map(L)) }, net('--muc', 1.5), them), svg);
  }
  function vach(svg, P, Q, n, e, mau, them) {
    var M = giua(P, Q), u = donVi(P, Q), w = [-u[1], u[0]];
    for (var i = 0; i < n; i++) {
      var c = cong(M, nhan(u, (i - (n - 1) / 2) * e * 0.7));
      doan(svg, cong(c, nhan(w, e)), cong(c, nhan(w, -e)), Object.assign(net(mau || '--muc', 1.6), them));
    }
  }
  // Chữ bên cạnh đoạn PQ, đẩy ra phía xa điểm G
  function chuCanh(svg, P, Q, G, s, co, mau, xa, them) {
    if (!s) return;
    var M = giua(P, Q), u = donVi(P, Q), w = [-u[1], u[0]];
    if ((M[0] + w[0] - G[0]) * (M[0] + w[0] - G[0]) + (M[1] + w[1] - G[1]) * (M[1] + w[1] - G[1]) < (M[0] - w[0] - G[0]) * (M[0] - w[0] - G[0]) + (M[1] - w[1] - G[1]) * (M[1] - w[1] - G[1])) w = nhan(w, -1);
    // Chữ nằm ngang: cạnh càng đứng thì càng phải đẩy xa, kẻo chữ đè lên cạnh
    var kc = co * (xa || 0.85) * 0.75 + Math.abs(w[0]) * 0.28 * co * String(s).length;
    chuTai(svg, cong(M, nhan(w, kc)), s, co, mau, them);
  }
  // Chữ số đo góc POQ, đặt trên tia phân giác, cách đỉnh kc
  function chuGoc(svg, O, P, Q, s, co, kc, mau, them) {
    if (!s) return;
    var u = cong(donVi(O, P), donVi(O, Q)), l = Math.hypot(u[0], u[1]);
    if (l < 1e-6) u = [0, 1]; else u = [u[0] / l, u[1] / l];
    chuTai(svg, cong(O, nhan(u, kc)), s, co, mau, them);
  }
  function tenDinh(svg, P, G, s, co) {
    var u = donVi(G, P);
    chuTai(svg, cong(P, nhan(u, co * 0.95)), s, co);
  }
  function trongTam(ds) { var x = 0, y = 0; ds.forEach(function (q) { x += q[0] / ds.length; y += q[1] / ds.length; }); return [x, y]; }
  function cham(svg, P, r, mau) { var a = L(P); C.mk('circle', { cx: a[0], cy: a[1], r: r, fill: 'var(' + (mau || '--muc') + ')' }, svg); }

  /* ---------- Vẽ bài 10 ---------- */
  C.lay('gocTuGiac').ve = function (svg, k, p, t, o) {
    var P = k.P, T = k.T, r = k.r, chia = o.dang === 'chia', ten = o.ten || ['A', 'B', 'C', 'D'], G = trongTam(P);
    var mo = [];
    (Array.isArray(o.ngoai) ? o.ngoai : o.ngoai ? [o.ngoai] : []).forEach(function (n) {
      var i = n.i, V = P[i], E = cong(V, nhan(donVi(P[(i + 3) % 4], V), 1.7));
      mo.push({ i: i, V: V, E: E, nhan: n.nhan });
    });
    var bd = bien(P.concat(mo.map(function (m) { return m.E; })));
    var co = khung(svg, Math.min(bd.x0, 0) - 1.4, Math.min(bd.y0 - 1.6, T[1] - r - 1.4), T[0] + r + 2.3, Math.max(bd.y1 + 1.6, T[1] + r + 1.4));
    // Vòng tròn chờ: các góc sẽ được ghép quanh tâm của nó
    var vT = L(T);
    C.mk('circle', { cx: vT[0], cy: vT[1], r: r, fill: 'none', stroke: 'var(--nhat)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'vector-effect': 'non-scaling-stroke' }, svg);
    cham(svg, T, 0.07, '--nhat');
    da(svg, P, { fill: 'var(--nhat)', 'fill-opacity': 0.07, stroke: 'none' });
    k.dinh.forEach(function (q) { vienQuat(svg, q); });
    mo.forEach(function (m) {
      doan(svg, m.V, m.E, net('--muc', 1.5, { 'stroke-dasharray': '5 4' }));
      var q = quat(m.V, m.E, P[(m.i + 1) % 4], 0.7, '--nhat');
      veQuat(svg, q, { 'fill-opacity': 0.25 });
      chuGoc(svg, m.V, m.E, P[(m.i + 1) % 4], viet(m.nhan, p, t, o), co * 0.9, 1.75, '--nhat');
    });
    da(svg, P, net('--muc', 2.2));
    var lo = p.trangThai === 'giai' || (o.loCuoi && t >= 1 - 1e-9), an = o.an || [], nh = o.nhan || {};
    function chuDinh(i) {
      if (nh[i] != null) return viet(nh[i], p, t, o);
      if (an.indexOf(i) >= 0 && !lo) return '?';
      return Math.round(k.g[i]) + '°';
    }
    if (chia) {
      doan(svg, P[1], P[3], net('--muc', 1.8, { 'stroke-dasharray': '6 4', opacity: k.cheo }));
      k.di.forEach(function (q) { veQuat(svg, q); });
      if (k.k1 > 0.97) doan(svg, [T[0] - r - 0.3, T[1]], [T[0] + r + 0.3, T[1]], net('--muc', 1.5));
      if (k.k2 > 0.97) {
        // Bốn nhóm quanh vòng: A, B (hai phần), C, D (hai phần)
        var d = k.di, c = function (i) { return chuan(d[i].bd); };
        var giuaNhom = [c(1) + d[1].goc / 2, (c(2) + c(3) + d[3].goc) / 2, c(4) + d[4].goc / 2, (c(5) + 360 + d[0].goc) / 2];
        giuaNhom.forEach(function (a, i) { chuTai(svg, cong(T, nhan(huongDen(a), r + 0.6)), ten[i], co, ['--a', '--b', '--cc', '--tg'][i]); });
      }
    } else {
      // Chỗ hở: phần vòng tròn chưa có góc nào
      var ho = k.ho, qHo = { tam: T, bd: ho.bd, goc: ho.goc, r: r, mau: '--muc' };
      if (ho.goc > 0.5) da(svg, diemQuat(qHo), net('--muc', 1.5, { 'stroke-dasharray': '5 4', opacity: ho.hien }));
      (k.thu || []).forEach(function (q) { veQuat(svg, q, { 'fill-opacity': 0.35 }); });
      k.di.forEach(function (q) {
        veQuat(svg, q);
        if (o.phan) for (var j = 1; j < o.phan[q.dinh]; j++) doan(svg, q.tam, cong(q.tam, nhan(huongDen(q.bd + q.goc * j / o.phan[q.dinh]), q.r)), net('--muc', 1));
        if (q.den > 0.97) chuTai(svg, cong(T, nhan(huongDen(q.bd + q.goc / 2), r + 0.62)), chuDinh(q.dinh), co * 0.95, q.mau);
      });
      if (o.phan) k.dinh.forEach(function (q, i) { for (var j = 1; j < o.phan[i]; j++) doan(svg, q.tam, cong(q.tam, nhan(huongDen(q.bd + q.goc * j / o.phan[i]), q.r)), net('--muc', 0.8, { 'stroke-dasharray': '2 2' })); });
      if (ho.goc > 0.5 && ho.hien > 0.5) {
        var soAn = an.length > 1 && o.bang ? an.length : 1;
        if (soAn > 1) doan(svg, T, cong(T, nhan(huongDen(ho.bd + ho.goc / 2), r)), net('--muc', 1.2, { 'stroke-dasharray': '3 3' }));
        for (var j = 0; j < soAn; j++) {
          var a = ho.bd + ho.goc * (j + 0.5) / soAn, chu = o.nhanHo != null ? viet(o.nhanHo, p, t, o) : soAn > 1 ? chuDinh(an[j]) : lo ? Math.round(ho.goc) + '°' : '?';
          chuTai(svg, cong(T, nhan(huongDen(a), r + 0.62)), chu, co * 0.95, '--sai');
        }
      }
    }
    P.forEach(function (V, i) {
      tenDinh(svg, V, G, ten[i], co);
      if (!chia) chuGoc(svg, V, P[(i + 1) % 4], P[(i + 3) % 4], chuDinh(i), co * 0.9, Math.min(1.25, 0.8 + 18 / k.g[i]), an.indexOf(i) >= 0 ? '--sai' : null);
    });
  };

  /* ---------- Vẽ bài 11 ---------- */
  C.lay('thangCan').ve = function (svg, k, p, t, o) {
    var dl = k.dl, mg = 0.17 * dl, top = k.S ? k.S[1] : k.h, ten = o.ten || ['A', 'B', 'C', 'D'];
    var co = khung(svg, -mg, -mg - (k.thu ? 0.06 * dl : 0), dl + mg, top + mg * 0.9);
    var D4 = { A: k.A, B: k.B, C: k.C, D: k.D, H: k.H, K: k.K, S: k.S }, G = trongTam([k.A, k.B, k.C, k.D]), rg = 0.1 * dl;
    var vTruc = [[k.m, -mg * 0.6], [k.m, top + mg * 0.5]];
    if (k.S) {
      da(svg, [k.S, k.D, k.C], { fill: 'var(--nhat)', 'fill-opacity': 0.05, stroke: 'none' });
      doan(svg, k.S, k.A, net('--muc', 2)); doan(svg, k.S, k.B, net('--muc', 2));
    }
    da(svg, [k.A, k.B, k.C, k.D], { fill: 'var(--nhat)', 'fill-opacity': 0.08, stroke: 'none' });
    doan(svg, vTruc[0], vTruc[1], net('--nhat', 1.5, { 'stroke-dasharray': '6 5' }));
    var goc = o.goc || (o.nhin ? { D: '', C: '' } : {}), ma = { A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'], S: ['D', 'C'] };
    Object.keys(goc).forEach(function (n) {
      var q = quat(D4[n], D4[ma[n][0]], D4[ma[n][1]], rg, n === 'C' || n === 'D' ? '--cc' : n === 'S' ? '--nhat' : '--b');
      veQuat(svg, q, { 'fill-opacity': 0.3 });
    });
    if (o.cheo) { doan(svg, k.A, k.C, net('--b', 2.5)); doan(svg, k.B, k.D, net('--b', 2.5)); }
    if (o.duongCao) {
      doan(svg, k.A, k.H, net('--muc', 1.5, { 'stroke-dasharray': '5 4' })); doan(svg, k.B, k.K, net('--muc', 1.5, { 'stroke-dasharray': '5 4' }));
      vuongGoc(svg, k.H, k.A, k.C, 0.05 * dl); vuongGoc(svg, k.K, k.B, k.D, 0.05 * dl);
      doan(svg, k.D, k.H, net('--cc', 5)); doan(svg, k.K, k.C, net('--cc', 5));
    }
    doan(svg, k.A, k.B, net('--muc', 2.5)); doan(svg, k.D, k.C, net('--muc', 2.5));
    doan(svg, k.A, k.D, net('--a', 3.5)); doan(svg, k.B, k.C, net('--a', 3.5));
    if (k.thu) {
      // Hai đoạn dài đúng số em gõ, đặt ở hai đầu đáy lớn (gập lại thì chúng trùng nhau)
      var v = Math.min(k.thu, 1.2 * dl), y = -0.05 * dl;
      doan(svg, [0, y], [v, y], net('--sai', 5)); doan(svg, [dl, y], [dl - v, y], net('--sai', 5, { opacity: 0.6 }));
    }
    // Bản gập: lật quanh trục, cuối cùng trùng nửa bên kia
    if (k.k > 0.001) {
      var l = k.lat, mo = { opacity: 0.9 };
      if (k.S) doan(svg, l.S, l.A, net('--muc', 3, mo));
      Object.keys(goc).forEach(function (n) {
        if (n !== 'D' && n !== 'A') return;
        var q = quat(l[n], l[ma[n][0]], l[ma[n][1]], rg, n === 'D' ? '--cc' : '--b');
        veQuat(svg, q, { 'fill-opacity': 0.55 });
      });
      if (o.cheo) doan(svg, l.A, l.C, net('--b', 5, mo));
      if (o.duongCao) doan(svg, l.D, l.H, net('--cc', 7, mo));
      doan(svg, l.A, l.D, net('--a', 6, mo));
    }
    ['A', 'B', 'C', 'D'].forEach(function (n, i) { tenDinh(svg, D4[n], G, ten[i], co); });
    if (k.S) tenDinh(svg, k.S, G, o.dinh, co);
    if (o.duongCao) { chuTai(svg, cong(k.H, [0, -0.8 * co]), 'H', co * 0.9); chuTai(svg, cong(k.K, [0, -0.8 * co]), 'K', co * 0.9); }
    var nh = o.nhan || {};
    Object.keys(nh).forEach(function (key) {
      var s = viet(nh[key], p, t, o), P1 = D4[key[0]], P2 = D4[key[1]];
      if (key === 'AC' || key === 'BD') { chuTai(svg, cong(lerp(P1, P2, 0.78), [0, 0.7 * co]), s, co * 0.9, '--b'); return; }
      if (key === 'DH' || key === 'KC' || key === 'HC') { chuTai(svg, cong(giua(P1, P2), [0, 0.8 * co]), s, co * 0.95, '--cc'); return; }
      // Hai đáy: ghi lệch sang trái của trục nét đứt cho khỏi đè lên trục
      if (key === 'DC' || key === 'AB') { chuCanh(svg, P1, lerp(P1, P2, 0.6), G, s, co * 0.95, null, 0.9); return; }
      chuCanh(svg, P1, P2, [k.m, G[1]], s, co * 0.95, key === 'AD' || key === 'BC' ? '--a' : null, 0.9);
    });
    Object.keys(goc).forEach(function (n) {
      var s = viet(goc[n], p, t, o);
      chuGoc(svg, D4[n], D4[ma[n][0]], D4[ma[n][1]], s, co * 0.9, rg + 0.9 * co, n === 'C' || n === 'D' ? '--cc' : null);
    });
  };

  /* ---------- Vẽ bài 12 ---------- */
  function veBaDiem(svg, k, p, t, o) {
    // Khung chứa cả đường đi của các tam giác đang quay
    var ds = [k.A, k.B, k.C];
    k.cap.forEach(function (c) { for (var i = 1; i <= 12; i++) [k.A, k.B, k.C].forEach(function (V) { ds.push(quay(V, c.O, 15 * i)); }); });
    var b = bien(ds), s = Math.max(b.x1 - b.x0, b.y1 - b.y0), mg = 0.14 * s;
    var co = khung(svg, b.x0 - mg, b.y0 - mg, b.x1 + mg, b.y1 + mg), G = trongTam([k.A, k.B, k.C]);
    da(svg, [k.A, k.B, k.C], { fill: 'var(--nhat)', 'fill-opacity': 0.12, stroke: 'none' });
    k.cap.forEach(function (c, i) {
      if (c.k <= 0.001) return;
      var mau = ['--a', '--b', '--cc'][i];
      da(svg, c.tamGiac, to(mau, 0.25, net(mau, 2)));
      cham(svg, c.O, 0.018 * s, mau);
      if (c.k > 0.98) { cham(svg, c.D, 0.022 * s, mau); chuTai(svg, cong(c.D, nhan(donVi(G, c.D), co)), 'D', co, mau); }
    });
    da(svg, [k.A, k.B, k.C], net('--muc', 2.2));
    [['A', k.A], ['B', k.B], ['C', k.C]].forEach(function (x) { cham(svg, x[1], 0.02 * s); tenDinh(svg, x[1], G, x[0], co); });
  }
  C.lay('quayHBH').ve = function (svg, k, p, t, o) {
    if (o.dang === 'baDiem') { veBaDiem(svg, k, p, t, o); return; }
    // Khung chứa trọn vòng quay của nửa hình quanh O, để hình không bị cắt khi đang quay
    var D4 = { A: k.A, B: k.B, C: k.C, D: k.D, O: k.O }, bo = [k.A, k.B, k.C, k.D], b = bien(bo), s = Math.max(b.x1 - b.x0, b.y1 - b.y0);
    var nuaQuay = k.cat === 'AC' ? [k.A, k.B, k.C] : [k.A, k.B, k.D], vet = bo.slice();
    for (var i = 1; i < 12; i++) nuaQuay.forEach(function (V) { vet.push(quay(V, k.O, 15 * i)); });
    var bv = bien(vet), mg = 0.12 * s;
    var co = khung(svg, bv.x0 - mg, bv.y0 - mg, bv.x1 + mg, bv.y1 + mg), G = k.O, rg = 0.11 * s;
    var mauCanh = { AB: '--a', CD: '--a', BC: '--b', DA: '--b' }, keCanh = { A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] };
    da(svg, bo, { fill: 'var(--nhat)', 'fill-opacity': 0.08, stroke: 'none' });
    var gocDay = k.cat === 'AC' ? ['B', 'D'] : ['A', 'C'];
    gocDay.forEach(function (n) { vienQuat(svg, quat(D4[n], D4[keCanh[n][0]], D4[keCanh[n][1]], rg, '--cc')); });
    Object.keys(mauCanh).forEach(function (c) { doan(svg, D4[c[0]], D4[c[1]], net(mauCanh[c], 2.2)); });
    if (o.cheo) { doan(svg, k.A, k.C, net('--tg', 1.8)); doan(svg, k.B, k.D, net('--tg', 1.8)); }
    var catLa = k.cat === 'AC' ? [k.A, k.C] : [k.B, k.D];
    doan(svg, catLa[0], catLa[1], net('--muc', 1.8, { 'stroke-dasharray': '6 4', opacity: k.catHien }));
    // Các cạnh em còn thiếu khi tính (trạng thái "thieu-AB-CD"…)
    if (typeof p.trangThai === 'string' && p.trangThai.indexOf('thieu-') === 0)
      p.trangThai.slice(6).split('-').forEach(function (c) { if (D4[c[0]] && D4[c[1]]) doan(svg, D4[c[0]], D4[c[1]], net('--sai', 6, { 'stroke-dasharray': '7 5' })); });
    if (k.k > 0.001 || k.catHien > 0.5) {
      var x = k.xoay, mo = { opacity: 0.92 };
      if (k.cat === 'AC') {
        da(svg, [x.A, x.B, x.C], to('--b', 0.12));
        veQuat(svg, quat(x.B, x.A, x.C, rg, '--cc'), { 'fill-opacity': 0.55 });
        doan(svg, x.A, x.B, net('--a', 5.5, mo)); doan(svg, x.B, x.C, net('--b', 5.5, mo));
        if (o.cheo) doan(svg, x.B, giua(x.A, x.C), net('--tg', 4.5, mo));
      } else {
        da(svg, [x.A, x.B, x.D], to('--a', 0.12));
        veQuat(svg, quat(x.A, x.B, x.D, rg, '--cc'), { 'fill-opacity': 0.55 });
        doan(svg, x.A, x.B, net('--a', 5.5, mo)); doan(svg, x.A, x.D, net('--b', 5.5, mo));
        if (o.cheo) doan(svg, x.A, giua(x.B, x.D), net('--tg', 4.5, mo));
      }
    }
    cham(svg, k.O, 0.018 * s);
    ['A', 'B', 'C', 'D'].forEach(function (n, i) { tenDinh(svg, D4[n], G, (o.ten || 'ABCD')[i], co); });
    if (o.cheo || o.tenO) chuTai(svg, cong(k.O, [0.3 * co, -0.9 * co]), 'O', co * 0.9);
    var nh = o.nhan || {};
    Object.keys(nh).forEach(function (key) {
      var s2 = viet(nh[key], p, t, o), P1 = D4[key[0]], P2 = D4[key[1]];
      if (key[0] === 'O' || key === 'AC' || key === 'BD') { chuCanh(svg, P1, P2, k.D, s2, co * 0.9, '--tg', 0.7); return; }
      chuCanh(svg, P1, P2, G, s2, co * 0.95, mauCanh[key] || mauCanh[key[1] + key[0]], 0.9);
    });
    var goc = o.goc || {};
    Object.keys(goc).forEach(function (n) { chuGoc(svg, D4[n], D4[keCanh[n][0]], D4[keCanh[n][1]], viet(goc[n], p, t, o), co * 0.9, rg + 0.95 * co, gocDay.indexOf(n) >= 0 ? '--cc' : null); });
  };

  /* ---------- Vẽ bài 13 ---------- */
  function veTrungTuyen(svg, k, p, t, o) {
    var ds = [k.A, k.B, k.C, k.D], b = bien(ds), s = k.bc, mg = 0.14 * s;
    var co = khung(svg, b.x0 - mg, b.y0 - mg, b.x1 + mg, b.y1 + mg), G = k.M, D4 = { A: k.A, B: k.B, C: k.C, M: k.M, D: k.D };
    da(svg, [k.A, k.B, k.C], { fill: 'var(--nhat)', 'fill-opacity': 0.1, stroke: 'none' });
    doan(svg, k.B, k.D, net('--muc', 1.6, { 'stroke-dasharray': '6 4', opacity: k.k2 }));
    doan(svg, k.D, k.C, net('--muc', 1.6, { 'stroke-dasharray': '6 4', opacity: k.k2 }));
    doan(svg, k.B, k.C, net('--cc', 2 + 5 * k.k2, { opacity: 0.55 + 0.4 * k.k2 }));
    da(svg, [k.A, k.B, k.C], net('--muc', 2.2));
    if (o.vuongA !== false || p.trangThai === 'giai') vuongGoc(svg, k.A, k.B, k.C, 0.05 * s);
    doan(svg, k.A, k.M, net('--a', 3.5));
    if (k.k1 > 0.001) doan(svg, k.M, k.Dk, net('--a', 3.5, { 'stroke-dasharray': '7 4' }));
    if (k.k2 > 0.001) doan(svg, k.A, k.D, net('--cc', 7, { opacity: 0.45 * k.k2 }));
    vach(svg, k.B, k.M, 1, 0.025 * s); vach(svg, k.M, k.C, 1, 0.025 * s);
    if (k.k1 > 0.98) { vach(svg, k.A, k.M, 2, 0.025 * s, '--a'); vach(svg, k.M, k.D, 2, 0.025 * s, '--a'); }
    if (k.thu) {
      var v = Math.min(k.thu, 1.6 * s), E = cong(k.A, nhan(donVi(k.A, k.M), v));
      doan(svg, k.A, E, net('--sai', 4)); cham(svg, E, 0.02 * s, '--sai');
    }
    cham(svg, k.M, 0.018 * s);
    ['A', 'B', 'C'].forEach(function (n) { tenDinh(svg, D4[n], trongTam([k.A, k.B, k.C]), n, co); });
    chuTai(svg, cong(k.M, [0, k.A[1] > 0 ? -0.85 * co : 0.85 * co]), 'M', co * 0.9);
    if (k.k1 > 0.98) tenDinh(svg, k.D, k.M, 'D', co);
    var nh = o.nhan || {};
    Object.keys(nh).forEach(function (key) {
      var s2 = viet(nh[key], p, t, o);
      if (key === 'AM') { chuCanh(svg, k.A, k.M, k.B, s2, co * 0.95, '--a', 0.8); return; }
      if (key === 'BC') { chuTai(svg, cong(lerp(k.B, k.C, 0.2), [0, (k.A[1] > 0 ? 1 : -1) * 0.75 * co]), s2, co * 0.95, '--cc'); return; }
      chuCanh(svg, D4[key[0]], D4[key[1]], k.M, s2, co * 0.95, key === 'AD' ? '--cc' : null, 0.85);
    });
    var goc = o.goc || {};
    if (goc.A != null) chuGoc(svg, k.A, k.B, k.C, viet(goc.A, p, t, o), co * 0.95, 0.12 * s + co, '--sai');
  }
  C.lay('haiThanh').ve = function (svg, k, p, t, o) {
    if (k.dang === 'trungTuyen') { veTrungTuyen(svg, k, p, t, o); return; }
    var D4 = { A: k.A, B: k.B, C: k.C, D: k.D, O: k.O }, Ls = k.L, bo = [k.A, k.B, k.C, k.D];
    var b = bien(bo.concat(k.T ? [[k.T[0] + k.r, k.T[1] - k.r], [k.T[0] - k.r, k.T[1] + k.r]] : []));
    var mg = 0.3 * Ls, co = khung(svg, b.x0 - mg, Math.min(b.y0, -0.5 * Ls) - 1.3 * mg, b.x1 + mg * (k.T ? 1.3 : 1), Math.max(b.y1, 0.5 * Ls) + 1.3 * mg), e = 0.05 * Ls;
    da(svg, bo, { fill: 'var(--nhat)', 'fill-opacity': 0.08 * k.khung, stroke: 'none' });
    if (o.to) { var tg = o.to.split('').map(function (n) { return D4[n]; }); da(svg, tg, to('--a', 0.22 * C.muot((t - 0.6) / 0.2))); }
    if (k.tamGiac) {
      da(svg, [k.O, k.A, k.B], to('--a', 0.18 * k.tamGiac)); da(svg, [k.O, k.B, k.C], to('--b', 0.18 * k.tamGiac));
      k.quat.forEach(function (q) { vienQuat(svg, q, { opacity: k.tamGiac }); });
    }
    // Hai thanh: luôn thấy; nét to dần khi hình làm nổi chúng lên
    doan(svg, k.A, k.C, net('--cc', 2 + 5 * k.thanh, { opacity: 0.5 + 0.35 * k.thanh }));
    doan(svg, k.B, k.D, net('--cc', 2 + 5 * k.thanh, { opacity: 0.5 + 0.35 * k.thanh }));
    da(svg, bo, net('--muc', 2.2, { opacity: k.khung }));
    var vachHien = o.chungMinh ? 1 : C.muot((t - 0.6) / 0.2);
    [k.A, k.B, k.C, k.D].forEach(function (V) { vach(svg, k.O, V, 1, e, '--muc', { opacity: vachHien }); });
    var vuongHien = o.chungMinh ? C.muot((t - 0.92) / 0.06) : o.vuong === false ? 0 : 1;
    bo.forEach(function (V, i) { vuongGoc(svg, V, bo[(i + 1) % 4], bo[(i + 3) % 4], 0.07 * Ls, { opacity: vuongHien }); });
    if (k.di) {
      k.di.forEach(function (q, i) { if (q.den > 0.001) veQuat(svg, q); else veQuat(svg, q, { opacity: k.tamGiac }); });
      k.quat.forEach(function (q, i) { chuGoc(svg, q.tam, cong(q.tam, huongDen(q.bd)), cong(q.tam, huongDen(q.bd + q.goc)), i % 2 === 0 && i < 2 ? 'x' : i < 2 ? 'y' : i === 2 ? 'x' : 'y', co * 0.8, q.r + 0.55 * co, q.mau, { 'font-style': 'italic', opacity: k.tamGiac * (1 - k.km) }); });
      if (k.km > 0.97) {
        var T = k.T, r = k.r;
        doan(svg, [T[0] - r - 0.25, T[1]], [T[0] + r + 0.25, T[1]], net('--muc', 1.5));
        vuongGoc(svg, T, cong(T, [0, 1]), cong(T, [-1, 0]), 0.3 * r);
        k.di.forEach(function (q, i) { chuTai(svg, cong(T, nhan(huongDen(q.bd + q.goc / 2), r + 0.5 * co)), ['x', 'y', 'x', 'y'][i], co * 0.85, q.mau, { 'font-style': 'italic' }); });
        chuTai(svg, cong(T, [-0.45 * r, 0.42 * r]), 'B', co * 0.8);
      }
    }
    cham(svg, k.O, 0.04 * Ls);
    ['A', 'B', 'C', 'D'].forEach(function (n, i) { tenDinh(svg, D4[n], k.O, (o.ten || 'ABCD')[i], co); });
    chuTai(svg, cong(k.O, [0.75 * co, 0]), 'O', co * 0.85);
    var nh = o.nhan || {};
    Object.keys(nh).forEach(function (key) {
      var s2 = viet(nh[key], p, t, o), P1 = D4[key[0]], P2 = D4[key[1]];
      // Chữ trên một thanh: đặt cạnh nửa thanh, đẩy ra xa thanh kia
      var coO = key.indexOf('O') >= 0;
      if (key === 'AC' || key === 'BD' || coO) {
        // Cả thanh ghi ở nửa dưới (C, D), nửa thanh OA, OB ghi ở nửa trên: hai chữ không chồng nhau
        var nua = key === 'AC' ? 'C' : key === 'BD' ? 'D' : key.replace('O', ''), dau = D4[nua];
        var xaDiem = { A: k.B, B: k.A, C: k.D, D: k.C }[nua];
        chuCanh(svg, dau, k.O, xaDiem, s2, co * 0.9, coO ? null : '--cc', 0.8);
        return;
      }
      chuCanh(svg, P1, P2, k.O, s2, co * 0.9, null, 0.8);
    });
    var goc = o.goc || {};
    Object.keys(goc).forEach(function (n) {
      var s2 = viet(goc[n], p, t, o);
      if (n.length === 3) chuGoc(svg, D4[n[1]], D4[n[0]], D4[n[2]], s2, co * 0.85, n[1] === 'O' ? 1.3 * co : 0.22 * Ls + 0.6 * co, '--sai');
    });
  };

  /* ---------- Vẽ bài 14 ---------- */
  function veDienTich(svg, k, p, t, o) {
    var w = k.w, h = k.h, s = Math.max(w, h), mg = 0.13 * s;
    var co = khung(svg, -mg, -mg, w + mg, h + mg * 0.6);
    C.mk('rect', { x: 0, y: -h, width: w, height: h, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, svg);
    da(svg, [k.E, k.F, k.G, k.H], to('--cc', 0.2, net('--cc', 3)));
    doan(svg, k.E, k.G, net('--tg', 1.5, { 'stroke-dasharray': '5 4' })); doan(svg, k.H, k.F, net('--tg', 1.5, { 'stroke-dasharray': '5 4' }));
    vuongGoc(svg, k.O, k.E, k.F, 0.04 * s);
    k.goc.forEach(function (tg) { da(svg, tg, to('--a', 0.35, net('--a', 1.5))); });
    var nh = o.nhan || {};
    if (nh.d1) chuTai(svg, [w / 2, -0.55 * mg], viet(nh.d1, p, t, o), co);
    if (nh.d2) chuTai(svg, [-0.55 * mg, h / 2], viet(nh.d2, p, t, o), co, null, { transform: 'rotate(-90 ' + (-0.55 * mg) + ' ' + (-h / 2) + ')' });
    if (o.nhanDT != null) chuTai(svg, [w / 2, h / 2 - 0.12 * h], viet(o.nhanDT, p, t, o), co * 1.1, '--sai');
  }
  C.lay('khungThoi').ve = function (svg, k, p, t, o) {
    if (k.dang === 'dienTich') { veDienTich(svg, k, p, t, o); return; }
    var s = k.s, D4 = { A: k.A, B: k.B, C: k.C, D: k.D, O: k.O }, bo = [k.A, k.B, k.C, k.D], co;
    if (k.dang === 'bop') co = khung(svg, -1.3 * s, -1.25 * s, 1.3 * s, 1.25 * s);
    else {
      var b = bien(o.tron ? [[k.A[0] - s, -s], [k.C[0] + s, s]] : bo), mg = 0.3 * s;
      co = khung(svg, b.x0 - mg, b.y0 - mg, b.x1 + mg, b.y1 + mg);
    }
    if (o.tron) [k.A, k.C].forEach(function (Q) { var a = L(Q); C.mk('circle', { cx: a[0], cy: a[1], r: s, fill: 'none', stroke: 'var(--nhat)', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'vector-effect': 'non-scaling-stroke' }, svg); });
    da(svg, bo, { fill: 'var(--nhat)', 'fill-opacity': 0.08, stroke: 'none' });
    if (o.to) da(svg, o.to.split('').map(function (n) { return D4[n]; }), to('--a', 0.22 * C.muot((t - 0.5) / 0.3)));
    var e = 0.045 * s, hienCheo = k.dang === 'bop' ? 1 : k.kc;
    if (k.dang === 'bop') {
      if (k.kT > 0.001) doan(svg, [-1.25 * s, 0], [1.25 * s, 0], net('--sai', 2, { 'stroke-dasharray': '8 5', opacity: k.kT }));
      doan(svg, k.A, k.C, net('--tg', 2)); doan(svg, k.B, k.D, net('--tg', 2));
      vuongGoc(svg, k.O, k.B, k.C, 0.09 * s);
      bo.forEach(function (V, i) { doan(svg, V, bo[(i + 1) % 4], net('--muc', 3)); });
      [['B', '--a', k.kA], ['D', '--a', k.kA]].concat([['B', '--b', k.kC], ['D', '--b', k.kC]]).forEach(function (x, i) {
        if (x[2] > 0.001) doan(svg, i < 2 ? k.A : k.C, D4[x[0]], net(x[1], 6, { opacity: x[2] }));
      });
      if (k.kT > 0.001) { vach(svg, k.O, k.B, 2, e, '--sai', { opacity: k.kT }); vach(svg, k.O, k.D, 2, e, '--sai', { opacity: k.kT }); }
    } else {
      doan(svg, k.A, k.C, net('--tg', 2, { opacity: hienCheo })); doan(svg, k.B, k.D, net('--tg', 2, { opacity: hienCheo }));
      if (k.kp > 0.001) {
        vuongGoc(svg, k.O, k.B, k.C, 0.08 * s, { opacity: k.kp });
        veQuat(svg, quat(k.A, k.B, k.O, 0.26 * s, '--a'), { opacity: k.kp }); veQuat(svg, quat(k.A, k.O, k.D, 0.22 * s, '--b'), { opacity: k.kp });
      }
      bo.forEach(function (V, i) { doan(svg, V, bo[(i + 1) % 4], net('--muc', 2.6)); });
    }
    bo.forEach(function (V, i) { vach(svg, V, bo[(i + 1) % 4], 1, e); cham(svg, V, 0.035 * s); });
    if (k.thu && o.thuDoan === 'BD') {
      var v = Math.min(k.thu, 2.4 * s);
      doan(svg, [0.07 * s, -v / 2], [0.07 * s, v / 2], net('--sai', 5));
    }
    if (k.thu && o.thuGoc === 'BAC') {
      var a0 = huong(k.A, k.B), R = cong(k.A, nhan(huongDen(a0 - Math.min(k.thu, 170)), 1.5 * s));
      doan(svg, k.A, R, net('--sai', 3.5));
      veQuat(svg, quat(k.A, k.B, R, 0.45 * s, '--sai'), { 'fill-opacity': 0.2 });
    }
    cham(svg, k.O, 0.03 * s);
    ['A', 'B', 'C', 'D'].forEach(function (n, i) { tenDinh(svg, D4[n], k.O, (o.ten || 'ABCD')[i], co); });
    chuTai(svg, cong(k.O, [0.75 * co, -0.75 * co]), 'O', co * 0.85);
    var nh = o.nhan || {};
    Object.keys(nh).forEach(function (key) {
      var s2 = viet(nh[key], p, t, o), P1 = D4[key[0]], P2 = D4[key[1]];
      if (key === 'BD' || key === 'OB') { chuTai(svg, cong(giua(P1, P2), [-0.9 * co, key === 'BD' ? 0.35 * s : 0]), s2, co * 0.9, '--tg'); return; }
      if (key === 'AC' || key === 'OA') { chuTai(svg, cong(giua(P1, P2), [key === 'AC' ? -0.35 * s : 0, -0.7 * co]), s2, co * 0.9, '--tg'); return; }
      chuCanh(svg, P1, P2, k.O, s2, co * 0.9, null, 0.85);
    });
    var goc = o.goc || {}, ma = { A: 'BAD', B: 'ABC', C: 'BCD', D: 'ADC' };
    Object.keys(goc).forEach(function (n) {
      var g3 = ma[n] || n, kc = g3[1] === 'O' ? 0.1 * s + 0.35 * co : g3 === ma[n] ? Math.min(0.3 * s, 0.6 * dai(D4[g3[1]], k.O)) : 0.3 * s, s2 = viet(goc[n], p, t, o);
      if (g3 === 'BAC' || g3 === 'DAC') {
        var lech = g3 === 'BAC' ? 1 : -1;
        chuTai(svg, cong(k.A, nhan(huongDen(lech * Math.max(k.gA / 4, 12)), 0.42 * s + 0.3 * co)), s2, co * 0.85, g3 === 'BAC' ? '--a' : '--b');
        return;
      }
      chuGoc(svg, D4[g3[1]], D4[g3[0]], D4[g3[2]], s2, co * 0.85, kc, null);
    });
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
