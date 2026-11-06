// Cảnh cho chương IV: định lí Thalès (lưới đường song song), tỉ số hai đoạn, đường trung bình (quay nửa vòng), phân giác (diện tích).
(function (C) {
  'use strict';
  var TIM = '#9c36b5';

  /* ---------- Hình học phẳng. Toạ độ SVG: y hướng xuống, đỉnh A nằm phía trên cạnh BC ---------- */
  function cong(P, Q) { return [P[0] + Q[0], P[1] + Q[1]]; }
  function tru(P, Q) { return [P[0] - Q[0], P[1] - Q[1]]; }
  function nhanSo(P, k) { return [P[0] * k, P[1] * k]; }
  function lerp(P, Q, k) { return [C.noiSuy(P[0], Q[0], k), C.noiSuy(P[1], Q[1], k)]; }
  function dai(P, Q) { return Math.sqrt((Q[0] - P[0]) * (Q[0] - P[0]) + (Q[1] - P[1]) * (Q[1] - P[1])); }
  function donVi(u) { var l = Math.sqrt(u[0] * u[0] + u[1] * u[1]) || 1; return [u[0] / l, u[1] / l]; }
  function cheo(u, v) { return u[0] * v[1] - u[1] * v[0]; }
  function trongTam(A, B, D) { return [(A[0] + B[0] + D[0]) / 3, (A[1] + B[1] + D[1]) / 3]; }
  function quay(P, O, g) { var c = Math.cos(g), s = Math.sin(g), d = tru(P, O); return [O[0] + c * d[0] - s * d[1], O[1] + s * d[0] + c * d[1]]; }
  // Giao của đường thẳng qua P hướng u với đường thẳng qua Q hướng v
  function giao(P, u, Q, v) { return cong(P, nhanSo(u, cheo(tru(Q, P), v) / cheo(u, v))); }
  // Chân đường vuông góc kẻ từ P xuống đường thẳng QR
  function chan(P, Q, R) { var u = tru(R, Q), k = ((P[0] - Q[0]) * u[0] + (P[1] - Q[1]) * u[1]) / (u[0] * u[0] + u[1] * u[1]); return cong(Q, nhanSo(u, k)); }
  function dienTich(P, Q, R) { return Math.abs(cheo(tru(Q, P), tru(R, P))) / 2; }
  // Tam giác biết ba cạnh: B ở gốc, C trên trục ngang, A phía trên
  function tgCanh(AB, AC, BC) { var x = (AB * AB - AC * AC + BC * BC) / (2 * BC); return { A: [x, -Math.sqrt(Math.max(0, AB * AB - x * x))], B: [0, 0], C: [BC, 0] }; }
  function tgGoc(AB, AC, g) { var r = g * Math.PI / 180; return tgCanh(AB, AC, Math.sqrt(AB * AB + AC * AC - 2 * AB * AC * Math.cos(r))); }
  // o.AB, o.AC, o.BC: ba cạnh thật của đề; o.AB, o.AC, o.gocA: hai cạnh và góc xen giữa; o.dinh: toạ độ (y hướng lên)
  function tamGiac(o, md) {
    if (o.AB && o.AC && o.BC) return tgCanh(o.AB, o.AC, o.BC);
    if (o.AB && o.AC) return tgGoc(o.AB, o.AC, o.gocA || 58);
    if (o.dinh) return { A: [o.dinh.A[0], -o.dinh.A[1]], B: [o.dinh.B[0], -o.dinh.B[1]], C: [o.dinh.C[0], -o.dinh.C[1]] };
    return md;
  }
  // Đoạn em vừa gõ: từ điểm tu theo hướng tới điểm den, dài đúng số em gõ (quá dài thì dừng ở trần)
  function doanThu(p, tu, den, tran) {
    var v = p.thu;
    if (typeof v !== 'number' || !isFinite(v) || v <= 0 || !tu || !den) return null;
    return { gt: v, tu: tu, cuoi: cong(tu, nhanSo(donVi(tru(den, tu)), Math.min(v, tran))), catBot: v > tran };
  }

  /* ---------- Tiện ích vẽ: gom mọi điểm và chữ để khung vừa khít; cỡ chữ theo bề rộng hình ---------- */
  function mau(m) { return m && m.charAt(0) === '-' ? 'var(' + m + ')' : m; }
  function bang(svg, diem) {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, chuDS = [], nen = [];
    function gom(x, y) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    diem.forEach(function (q) { gom(q[0], q[1]); });
    var co = Math.max(x1 - x0, 0.75 * (y1 - y0)) / 10.5;
    var b = {
      co: co,
      net: function (P, Q, m, day, them) {
        gom(P[0], P[1]); gom(Q[0], Q[1]);
        return C.mk('line', Object.assign({ x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], stroke: mau(m || '--muc'), 'stroke-width': (day || 0.08) * co, 'stroke-linecap': 'round' }, them || {}), svg);
      },
      da: function (pts, nenMau, op, vien, day, them) {
        pts.forEach(function (q) { gom(q[0], q[1]); });
        return C.mk('polygon', Object.assign({ points: C.diem(pts), fill: nenMau ? mau(nenMau) : 'none', 'fill-opacity': op == null ? 1 : op,
          stroke: vien ? mau(vien) : 'none', 'stroke-width': (day || 0.06) * co, 'stroke-linejoin': 'round' }, them || {}), svg);
      },
      cham: function (P, m, r) { gom(P[0], P[1]); return C.mk('circle', { cx: P[0], cy: P[1], r: (r || 0.16) * co, fill: mau(m || '--muc') }, svg); },
      // Vạch chia tại điểm X, vuông góc với hướng u
      vachDiem: function (X, u, op) {
        if (op <= 0) return;
        var n = donVi([-u[1], u[0]]), d = 0.26 * co;
        b.net(cong(X, nhanSo(n, d)), tru(X, nhanSo(n, d)), '--muc', 0.07, op < 1 ? { opacity: op } : null);
      },
      // so vạch nhỏ giữa đoạn PQ: kí hiệu các đoạn bằng nhau
      vach: function (P, Q, so, m, op) {
        var M = lerp(P, Q, 0.5), u = donVi(tru(Q, P)), n = [-u[1], u[0]], d = 0.26 * co;
        for (var i = 0; i < so; i++) {
          var X = cong(M, nhanSo(u, (i - (so - 1) / 2) * 0.2 * co));
          b.net(cong(X, nhanSo(n, d)), tru(X, nhanSo(n, d)), m || '--muc', 0.07, op != null && op < 1 ? { opacity: op } : null);
        }
      },
      // Góc tô màu tại O, giữa hai tia OP và OQ (góc không quá 180°)
      cung: function (O, P, Q, r, m, op) {
        var a = donVi(tru(P, O)), c = donVi(tru(Q, O)), S = cong(O, nhanSo(a, r * co)), E = cong(O, nhanSo(c, r * co));
        return C.mk('path', { d: 'M' + O[0] + ' ' + O[1] + 'L' + S[0] + ' ' + S[1] + 'A' + r * co + ' ' + r * co + ' 0 0 ' + (cheo(a, c) > 0 ? 1 : 0) + ' ' + E[0] + ' ' + E[1] + 'Z',
          fill: mau(m), 'fill-opacity': 0.35 * (op == null ? 1 : op), stroke: mau(m), 'stroke-width': 0.04 * co, 'stroke-opacity': op == null ? 1 : op }, svg);
      },
      vuong: function (O, P, Q, op) {
        var u = nhanSo(donVi(tru(P, O)), 0.42 * co), v = nhanSo(donVi(tru(Q, O)), 0.42 * co);
        return C.mk('path', { d: 'M' + cong(O, u).join(' ') + 'L' + cong(cong(O, u), v).join(' ') + 'L' + cong(O, v).join(' '), fill: 'none', stroke: mau('--muc'), 'stroke-width': 0.05 * co, opacity: op == null ? 1 : op }, svg);
      },
      chu: function (x, y, s, m, op, lon) {
        var c = (lon || 1) * co, nua = 0.3 * c * String(s).length + 0.15 * c;
        gom(x - nua, y - 0.62 * c); gom(x + nua, y + 0.62 * c);
        chuDS.push({ x: x, y: y, s: s, co: c, mau: m, op: op });
      },
      // Tên đỉnh: lệch ra xa trọng tâm
      ten: function (V, G, s, op) { var u = donVi(tru(V, G)); b.chu(V[0] + u[0] * 0.95 * co, V[1] + u[1] * 0.95 * co, s, null, op); },
      // Tên điểm nằm trên cạnh PQ: lệch ra phía ngoài cạnh (xa điểm ref)
      tenCanh: function (X, P, Q, ref, s, op) { var n = phap(P, Q, X, ref); b.chu(X[0] + n[0] * 0.85 * co, X[1] + n[1] * 0.85 * co, s, null, op); },
      // Nhãn độ dài ở giữa đoạn, phía xa điểm ref; nhãn dài thì đẩy xa hơn khi đoạn gần thẳng đứng
      // xa: đẩy thêm ra ngoài (tính theo cỡ chữ), để nhãn dài không đè lên tên hai đầu đoạn ngắn
      nhanDoan: function (P, Q, ref, s, m, op, xa) {
        var M = lerp(P, Q, 0.5), n = phap(P, Q, M, ref), d = co * (0.78 + (xa || 0) + Math.abs(n[0]) * 0.3 * String(s).length);
        b.chu(M[0] + n[0] * d, M[1] + n[1] * d, s, m, op);
      },
      nen: function (f) { nen.push(f); },
      xong: function () {
        var dem = 0.35 * co, vb = [x0 - dem, y0 - dem, x1 - x0 + 2 * dem, y1 - y0 + 2 * dem];
        svg.setAttribute('viewBox', vb.join(' '));
        // Phần nền (bờ sông…) cần khung: vẽ sau nhưng đặt xuống dưới cùng
        nen.forEach(function (f) { var g = C.mk('g', {}); f(g, vb); svg.insertBefore(g, svg.firstChild); });
        chuDS.forEach(function (c) {
          var them = {};
          if (c.op != null && c.op < 1) them.opacity = c.op < 0.01 ? 0 : c.op;
          if (c.mau && c.mau.charAt(0) === '#') them.style = 'fill:' + c.mau;
          C.chu(svg, c.x, c.y, c.s, c.co, c.mau && c.mau.charAt(0) === '-' ? c.mau : null, them);
        });
      }
    };
    return b;
  }
  // Pháp tuyến đơn vị của PQ tại X, quay về phía xa điểm ref
  function phap(P, Q, X, ref) {
    var u = donVi(tru(Q, P)), n = [-u[1], u[0]];
    return (X[0] - ref[0]) * n[0] + (X[1] - ref[1]) * n[1] < 0 ? [-n[0], -n[1]] : n;
  }
  function veThu(ve, thu) {
    if (!thu) return;
    var co = ve.co, u = donVi(tru(thu.cuoi, thu.tu));
    ve.net(thu.tu, thu.cuoi, '--sai', 0.12, { 'stroke-dasharray': 0.35 * co + ' ' + 0.22 * co });
    var n = [-u[1], u[0]];
    if (n[1] > 0) n = [-n[0], -n[1]];
    if (thu.catBot) {
      // Quá dài so với khung: vẽ mũi tên ở đầu đoạn và nói rõ là hình đã cắt bớt
      var x = thu.cuoi, l = 0.55 * co, w = 0.32 * co;
      ve.da([cong(x, nhanSo(u, 0.2 * co)), cong(tru(x, nhanSo(u, l)), nhanSo(n, w)), tru(tru(x, nhanSo(u, l)), nhanSo(n, w))], '--sai', 1);
    } else ve.cham(thu.cuoi, '--sai', 0.2);
    ve.chu(thu.cuoi[0] + n[0] * 1.0 * co, thu.cuoi[1] + n[1] * 1.0 * co, C.fmt(thu.gt), '--sai', 1, 0.9);
    if (thu.catBot) ve.chu(thu.cuoi[0] + n[0] * 1.0 * co, thu.cuoi[1] + n[1] * 1.0 * co - 0.95 * co, '(hình cắt bớt)', '--sai', 1, 0.7);
  }
  function nhanCua(o, giai) { return Object.assign({}, o.nhan || {}, giai ? o.giai || {} : {}); }
  function soTex(x) { return C.fmt(x).replace(',', '{,}'); }
  // Số đúng tới hai chữ số thập phân thì ghi "=", còn lại ghi "≈"
  function bang2(x) { return Math.abs(x * 100 - Math.round(x * 100)) < 1e-6 ? '= ' + soTex(x) : '\\approx ' + soTex(x); }
  function xoayHuong(u, d) { var r = d * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [u[0] * c - u[1] * s, u[0] * s + u[1] * c]; }
  function gocDo(P, O, Q) { var u = donVi(tru(P, O)), v = donVi(tru(Q, O)); return Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) * 180 / Math.PI; }
  // Soi chi tiết chỉ khi hình không mang số của đề (phần Nhìn), kẻo lộ đáp số
  function theSoi(o) { return function (khoa, them) { return Object.assign(o.nhan || o.thu || o.giai || o.dao ? {} : { 'data-soi': khoa }, them || {}); }; }

  /* ================= 1. Định lí Thalès: chia AB thành m + k phần bằng nhau ================= */
  // Kẻ qua mỗi vạch một đường song song với BC. Tam giác nhỏ trên cùng trượt dọc AB từng nấc, vừa khít giữa hai
  // đường song song kề nhau; cạnh của nó song song với AC trượt ngang sang AC (hình bình hành) và trùng một khúc.
  // Nên AC cũng bị chia thành m + k khúc bằng nhau. Chỉ đúng khi tỉ số là phân số m/k.
  C.dangKi('thalesLuoi', {
    thamSo: { m: { min: 1, max: 5, step: 1, md: 2, nhan: 'm', mau: '--a' }, k: { min: 1, max: 5, step: 1, md: 3, nhan: 'k', mau: '--b' },
      dN: { min: -0.6, max: 0.6, step: 0.2, md: 0, nhan: 'Dời N khỏi vạch', pha: true } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var m = o.m || p.m, k = o.k || p.k, n = m + k, i;
      var T = tamGiac(o, { A: [3.4, -7.2], B: [0, 0], C: [10, 0] }), A = T.A, B = T.B, Cc = T.C;
      var huong = tru(Cc, B), P = [], Q = [];
      // Q[i]: giao của đường song song với BC qua vạch P[i] với AC (tính bằng giao điểm, không giả định chia đều)
      for (i = 0; i <= n; i++) { P.push(lerp(A, B, i / n)); Q.push(giao(P[i], huong, A, tru(Cc, A))); }
      var w = 0.3 / Math.max(1, n - 1), banSao = [], canhTruot = [[A, Q[1]]];
      for (i = 0; i < n; i++) {
        var s = i === 0 ? 1 : C.muot((t - 0.42 - (i - 1) * w) / w);
        var hien = i === 0 ? C.muot((t - 0.38) / 0.04) : (t >= 0.42 + (i - 1) * w ? 1 : 0);
        var d = tru(lerp(P[Math.max(0, i - 1)], P[i], s), A);
        banSao.push({ dinh: [A, P[1], Q[1]].map(function (q) { return cong(q, d); }), hien: hien });
        if (i > 0) {
          // Cạnh song song với AC của bản sao thứ i, trượt ngang theo đường song song với BC sang AC
          var r = C.muot((t - 0.74) / 0.14), V = cong(Q[1], tru(P[i], A)), dd = nhanSo(tru(Q[i], P[i]), r);
          canhTruot.push([cong(P[i], dd), cong(V, dd)]);
        }
      }
      // Thử phá: dời N trên AC lệch khỏi vạch thứ m một phần khúc (dN), nên MN không còn song song với BC
      var lech = o.dao ? 0 : p.dN || 0;
      var M = P[m], N = o.dao ? lerp(A, Cc, o.dao.AN / (o.dao.AN + o.dao.NC)) : lech ? lerp(A, Cc, (m + lech) / n) : Q[m];
      var diem = { A: A, B: B, C: Cc, M: M, N: N };
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 1.6 * Math.max(dai(A, B), dai(A, Cc), dai(B, Cc))) : null;
      var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], tiAN = dai(A, N) / dai(N, Cc), tiM = '\\frac{' + m + '}{' + k + '}';
      var ti = function (a, b) { return '\\frac{' + ten[a[0]] + ten[a[1]] + '}{' + ten[b[0]] + ten[b[1]] + '}'; };
      var gocLech = gocDo(cong(B, tru(N, M)), B, Cc);
      gocLech = Math.min(gocLech, 180 - gocLech);
      var pha = lech
        ? { hong: true, tiAN: tiAN, gocLech: gocLech, chu: '$' + ten[3] + ten[4] + '$ lệch $\\approx ' + Math.round(gocLech) + '^\\circ$ so với phương $' + ten[1] + ten[2] + '$, không còn song song: $' + ti([0, 3], [3, 1]) + ' = ' + tiM + ' ' + bang2(m / k) + '$ nhưng $' + ti([0, 4], [4, 2]) + ' \\approx ' + soTex(tiAN) +
          '$. Các đường song song vẫn chia $' + ten[0] + ten[2] + '$ thành $' + n + '$ khúc bằng nhau, nhưng $' + ten[4] + '$ không nằm ở vạch thứ $' + m + '$ nữa.' }
        : { hong: false, tiAN: tiAN, gocLech: gocLech, chu: '$' + ten[3] + ten[4] + ' \\parallel ' + ten[1] + ten[2] + '$: $' + ti([0, 3], [3, 1]) + ' = ' + ti([0, 4], [4, 2]) + ' = ' + tiM + '$.' };
      return { A: A, B: B, C: Cc, M: M, N: N, P: P, Q: Q, m: m, k: k, n: n, banSao: banSao, canhTruot: canhTruot, thu: thu, lech: lech, pha: pha,
        songSong: dai(N, Q[m]) < 1e-9 * (1 + dai(A, Cc)), AM: dai(A, M), MB: dai(M, B), AN: dai(A, N), NC: dai(N, Cc) };
    }
  });

  C.lay('thalesLuoi').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], A = g.A, B = g.B, Cc = g.C, M = g.M, N = g.N, n = g.n, P = g.P, Q = g.Q, i;
    var G = trongTam(A, B, Cc), giuaBC = lerp(B, Cc, 0.5);
    // Cỡ chữ tính theo cả hình, kể cả đoạn đỏ em gõ, để chữ không bé đi khi đoạn đỏ dài
    var ve = bang(svg, [A, B, Cc].concat(g.thu ? [g.thu.cuoi] : [])), co = ve.co;
    var giai = p.trangThai === 'giai', cuoi = C.muot((t - 0.88) / 0.1), hienVach = o.anLucDau ? C.muot((t - 0.02) / 0.06) : 1;
    var w1 = 0.3 / Math.max(1, n - 1), lech = !!g.lech, the = theSoi(o);
    ve.da([A, B, Cc], '--tg', 0.05);
    if (o.song) ve.nen(function (cha, vb) {
      // Hai bờ sông: hai đường song song với BC, qua B và qua M, kéo hết bề ngang khung
      var u = tru(Cc, B);
      [B, M].forEach(function (X) {
        var a = (vb[0] - X[0]) / u[0], b = (vb[0] + vb[2] - X[0]) / u[0];
        C.mk('line', { x1: X[0] + a * u[0], y1: X[1] + a * u[1], x2: X[0] + b * u[0], y2: X[1] + b * u[1], stroke: '#74c0fc', 'stroke-width': 0.32 * co }, cha);
      });
    });
    if (o.luoi && cuoi > 0) for (i = 1; i < n; i++) {
      // Lưới đầy đủ: thêm các đường song song với AC và với AB, thấy tam giác lớn gồm các tam giác nhỏ bằng nhau
      ve.net(P[i], lerp(B, Cc, 1 - i / n), '--nhat', 0.05, { opacity: 0.8 * cuoi, 'stroke-dasharray': 0.2 * co + ' ' + 0.15 * co });
      ve.net(Q[i], lerp(B, Cc, i / n), '--nhat', 0.05, { opacity: 0.8 * cuoi, 'stroke-dasharray': 0.2 * co + ' ' + 0.15 * co });
      ve.vachDiem(lerp(B, Cc, i / n), tru(Cc, B), cuoi);
    }
    g.banSao.forEach(function (b) { if (b.hien > 0) ve.da(b.dinh, '--cc', 0.3 * b.hien * (1 - 0.6 * cuoi), '--cc', 0.05, the('tgNho', { 'stroke-opacity': b.hien })); });
    for (i = 1; i < n; i++) {
      var s = C.muot((t - 0.1 - (i - 1) * w1) / w1);
      // Thử phá: vẫn vẽ đường song song thật qua M (nét đứt) để thấy MN lệch khỏi nó
      if (i === g.m && !o.dao && !lech) continue;
      if (s > 0) ve.net(P[i], lerp(P[i], Q[i], s), '--nhat', 0.06, the('song', (o.dao || lech) && i === g.m ? { 'stroke-dasharray': 0.25 * co + ' ' + 0.15 * co } : null));
      if (!o.dao || i !== g.m) ve.vachDiem(Q[i], tru(Cc, A), C.muot((s - 0.85) / 0.15));
    }
    var truot = C.muot((t - 0.7) / 0.04) * (1 - 0.5 * cuoi);
    if (truot > 0) g.canhTruot.forEach(function (d) { ve.net(d[0], d[1], '--cc', 0.17, the('tgNho', { opacity: truot })); });
    ve.net(A, B, null, null, the('AB')); ve.net(A, Cc, null, null, the('AC')); ve.net(B, Cc);
    for (i = 1; i < n; i++) ve.vachDiem(P[i], tru(B, A), hienVach);
    if (cuoi > 0) {
      ve.net(A, M, '--a', 0.18, the('AB', { opacity: cuoi })); ve.net(M, B, '--b', 0.18, the('AB', { opacity: cuoi }));
      if (!o.dao && !lech) { ve.net(A, N, '--a', 0.18, the('AC', { opacity: cuoi })); ve.net(N, Cc, '--b', 0.18, the('AC', { opacity: cuoi })); }
    }
    if (o.goc) { ve.cung(M, A, N, 1.1, '--a'); ve.cung(B, A, Cc, 1.1, '--a'); }
    ve.net(M, N, o.dao ? (cuoi > 0.5 ? (g.songSong ? '--cc' : '--sai') : '--nhat') : lech ? '--sai' : TIM, 0.14, the('MN'));
    if (lech) ve.cham(N, '--sai', 0.2);
    veThu(ve, g.thu);
    ve.ten(A, G, ten[0]); ve.ten(B, G, ten[1]); ve.ten(Cc, G, ten[2]);
    ve.tenCanh(M, A, B, G, ten[3]); ve.tenCanh(N, A, Cc, G, ten[4]);
    var nhan = nhanCua(o, giai), doan = { AM: [A, M], MB: [M, B], AN: [A, N], NC: [N, Cc], AB: [A, B], AC: [A, Cc], BC: [B, Cc], MN: [M, N] };
    var dem = { AM: g.m, MB: g.k, AN: g.m, NC: g.k };
    Object.keys(doan).forEach(function (r) {
      var s = nhan[r], m = null, op = 1, xa = 0;
      // Hình không có số của đề: cuối cùng ghi số phần của mỗi đoạn; đoạn ngắn thì đẩy nhãn xa hơn, khỏi đè tên M, N
      if (s == null && !o.nhan && dem[r] && !((o.dao || lech) && (r === 'AN' || r === 'NC'))) {
        s = dem[r] + ' phần'; op = cuoi; m = r === 'AM' || r === 'AN' ? '--a' : '--b';
        xa = dai(doan[r][0], doan[r][1]) < 4.5 * co ? 1.4 : 0;
      }
      if (s == null) return;
      if (giai && o.giai && o.giai[r] != null) m = '--cc';
      ve.nhanDoan(doan[r][0], doan[r][1], r === 'MN' ? giuaBC : G, s, m, op, xa);
    });
    if (o.dao) ve.chu(giuaBC[0], Math.max(B[1], Cc[1]) + 2.3 * co, ten[3] + ten[4] + (g.songSong ? ' ∥ ' : ' không song song với ') + ten[1] + ten[2],
      g.songSong ? '--cc' : '--sai', cuoi, 0.85);
    ve.xong();
  };

  C.lay('thalesLuoi').soi = function (g, p, o) {
    var n = o.ten || ['A', 'B', 'C', 'M', 'N'], m = g.m, k = g.k, tong = g.n;
    return {
      AB: { tieuDe: 'Cạnh $' + n[0] + n[1] + '$', chu: 'Chia thành $' + m + ' + ' + k + ' = ' + tong + '$ phần bằng nhau. $' + n[0] + n[3] + '$ có $' + m + '$ phần, $' + n[3] + n[1] + '$ có $' + k + '$ phần, nên $\\frac{' + n[0] + n[3] + '}{' + n[3] + n[1] + '} = \\frac{' + m + '}{' + k + '}$.' },
      AC: { tieuDe: 'Cạnh $' + n[0] + n[2] + '$', chu: 'Các đường song song với $' + n[1] + n[2] + '$ chia nó thành $' + tong + '$ khúc bằng nhau, mỗi khúc $\\approx ' + soTex(dai(g.A, g.C) / tong) + '$. ' +
        (g.lech ? 'Nhưng $' + n[4] + '$ lệch khỏi vạch: $\\frac{' + n[0] + n[4] + '}{' + n[4] + n[2] + '} \\approx ' + soTex(g.pha.tiAN) + '$.' : '$' + n[0] + n[4] + '$ có $' + m + '$ khúc, $' + n[4] + n[2] + '$ có $' + k + '$ khúc.') },
      MN: { tieuDe: 'Đoạn $' + n[3] + n[4] + '$', chu: g.lech ? 'Lệch $\\approx ' + Math.round(g.pha.gocLech) + '^\\circ$ khỏi phương $' + n[1] + n[2] + '$, nên không trùng đường song song qua $' + n[3] + '$ (nét đứt).'
        : 'Song song với $' + n[1] + n[2] + '$. Qua $' + n[3] + '$ chỉ có một đường song song với $' + n[1] + n[2] + '$ (tiên đề Euclid), nên $' + n[3] + n[4] + '$ chính là đường kẻ qua vạch thứ $' + m + '$.' },
      tgNho: { tieuDe: 'Tam giác nhỏ', chu: 'Trượt dọc $' + n[0] + n[1] + '$ từng nấc thì không đổi hình. Đáy luôn song song với $' + n[1] + n[2] + '$, nên vừa khít giữa hai đường song song kề nhau. Cạnh phải trượt sang $' + n[0] + n[2] + '$ thành một khúc: các khúc bằng nhau.' },
      song: { tieuDe: 'Đường song song', chu: 'Kẻ qua mỗi vạch của $' + n[0] + n[1] + '$, song song với $' + n[1] + n[2] + '$. Các đường này cắt $' + n[0] + n[2] + '$ tại những điểm chia; tam giác nhỏ trượt xuống cho thấy các khúc trên $' + n[0] + n[2] + '$ dài bằng nhau.' }
    };
  };

  /* ================= 2. Tỉ số hai đoạn thẳng: đo cả hai bằng cùng một đơn vị ================= */
  C.dangKi('thalesDoan', {
    tinh: function (p, t, o) {
      var u = o.u || 1, na = Math.round(o.a / u), nb = Math.round(o.b / u);
      return { a: o.a, b: o.b, u: u, na: na, nb: nb, lon: Math.max(o.a, o.b) };
    }
  });
  C.lay('thalesDoan').ve = function (svg, g, p, t, o) {
    var mk = C.mk, L = 12, x0 = 1, don = o.don == null ? ' cm' : o.don, chia = C.muot((t - 0.15) / 0.5), cuoi = C.muot((t - 0.8) / 0.15);
    svg.setAttribute('viewBox', '0 0 15 7.6');
    [[g.a, g.na, o.tenA || 'AB', 1.6, '--a'], [g.b, g.nb, o.tenB || 'CD', 5.2, '--b']].forEach(function (d) {
      var w = L * d[0] / g.lon, y = d[3], buoc = L * g.u / g.lon, so = d[1];
      mk('rect', { x: x0, y: y, width: w, height: 0.7, fill: mau(d[4]), 'fill-opacity': 0.3, stroke: mau(d[4]), 'stroke-width': 0.06 }, svg);
      // Vạch từng đơn vị, hiện dần; quá nhiều vạch thì chỉ ghi số phần
      if (Math.max(g.na, g.nb) <= 30) for (var i = 1; i < so; i++) if (i / so <= chia + 1e-9)
        mk('line', { x1: x0 + i * buoc, y1: y - 0.12, x2: x0 + i * buoc, y2: y + 0.82, stroke: 'var(--muc)', 'stroke-width': 0.05 }, svg);
      C.chu(svg, x0, y - 0.6, d[2] + ' = ' + C.fmt(d[0]) + don, 0.9, null, { style: 'text-anchor:start' });
      C.chu(svg, x0, y + 1.35, so + ' phần', 0.85, d[4], { style: 'text-anchor:start;fill:var(' + d[4] + ')', opacity: cuoi < 0.01 ? 0 : cuoi });
    });
  };

  /* ================= 3. Đường trung bình: cắt theo MN, quay mảnh trên nửa vòng quanh N ================= */
  // dang: 'quay' (mặc định), 'ba' (ba đường trung bình, mỗi đường gấp đôi vừa khít cạnh song song), 'quaM' (qua trung điểm M kẻ song song)
  C.dangKi('thalesTrungBinh', {
    thamSo: { ax: { min: -1, max: 9, step: 0.5, md: 3, nhan: 'Đỉnh A', mau: '--tg' }, bc: { min: 6, max: 12, step: 0.5, md: 10, nhan: 'Cạnh BC', mau: '--b' },
      tM: { min: 0.3, max: 0.7, step: 0.05, md: 0.5, nhan: 'Tỉ số AM : AB', pha: true } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var T = tamGiac(o, { A: [p.ax, -7], B: [0, 0], C: [p.bc, 0] }), A = T.A, B = T.B, Cc = T.C, dang = o.dang || 'quay';
      // Thử phá (chỉ ở hình quay): M không còn là trung điểm của AB
      var tM = dang === 'quay' && p.tM != null ? p.tM : 0.5;
      var M = lerp(A, B, tM), N = lerp(A, Cc, 0.5), P = lerp(B, Cc, 0.5), M2 = tru(nhanSo(N, 2), M);
      // Quay về phía ngoài tam giác (xa B) để mảnh không đè lên phần còn lại
      var chieu = dai(quay(A, N, Math.PI / 2), B) >= dai(quay(A, N, -Math.PI / 2), B) ? 1 : -1;
      var goc = dang === 'quay' ? chieu * Math.PI * C.muot((t - 0.2) / 0.5) : 0;
      var manh = [A, M, N].map(function (q) { return quay(q, N, goc); });
      var banSao = [];
      if (dang === 'ba') [[M, N, B, P], [N, P, A, M], [M, P, A, N]].forEach(function (d, j) {
        var s = C.muot((t - 0.1 - 0.28 * j) / 0.24);
        banSao.push({ s: s, j: j, doan: [d[2], d[3]].map(function (S) { var v = nhanSo(tru(S, d[0]), s); return [cong(d[0], v), cong(d[1], v)]; }) });
      });
      var diem = { A: A, B: B, C: Cc, M: M, N: N };
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 2.2 * dai(B, Cc)) : null;
      var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], t2 = ten[5] || ten[3] + '\'', AM = dai(A, M), MB = dai(M, B), MN = dai(M, N), BC = dai(B, Cc);
      // Góc giữa MN và BC (độ), để nói MN lệch khỏi song song bao nhiêu
      var lechMN = gocDo(cong(B, tru(N, M)), B, Cc);
      lechMN = Math.min(lechMN, 180 - lechMN);
      var pha = Math.abs(tM - 0.5) > 1e-9
        ? { hong: true, lechMN: lechMN, chu: '$' + ten[3] + '$ không là trung điểm: $' + ten[0] + ten[3] + ' \\approx ' + soTex(AM) + '$ còn $' + ten[3] + ten[1] + ' \\approx ' + soTex(MB) + '$. Quay quanh $' + ten[4] + '$, $' + ten[0] + '$ vẫn tới $' + ten[2] + '$, nhưng $' + ten[2] + t2 + ' = ' + ten[0] + ten[3] +
          ' \\ne ' + ten[3] + ten[1] + '$: tứ giác $' + ten[3] + ten[1] + ten[2] + t2 + '$ không là hình bình hành. $' + ten[3] + ten[4] + ' \\approx ' + soTex(MN) + '$' +
          (Math.abs(MN - BC / 2) > 0.05 ? ', không bằng $\\frac{' + ten[1] + ten[2] + '}{2} ' + bang2(BC / 2) + '$, và' : ' (tình cờ gần bằng $\\frac{' + ten[1] + ten[2] + '}{2}$), nhưng') +
          ' lệch khỏi phương $' + ten[1] + ten[2] + '$ khoảng $' + Math.round(lechMN) + '^\\circ$: không song song.' }
        : { hong: false, lechMN: lechMN, chu: '$' + ten[3] + '$, $' + ten[4] + '$ là trung điểm: $' + ten[2] + t2 + ' = ' + ten[0] + ten[3] + ' = ' + ten[3] + ten[1] + '$, nên $' + ten[3] + ten[1] + ten[2] + t2 + '$ là hình bình hành và $' + ten[3] + ten[4] + ' = \\frac{' + ten[1] + ten[2] + '}{2} ' + bang2(BC / 2) + '$.' };
      return { A: A, B: B, C: Cc, M: M, N: N, P: P, M2: M2, manh: manh, goc: goc, banSao: banSao, thu: thu, dang: dang, tM: tM, pha: pha,
        MN: MN, BC: BC, AM: AM, MB: MB };
    }
  });

  C.lay('thalesTrungBinh').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], A = g.A, B = g.B, Cc = g.C, M = g.M, N = g.N, P = g.P, M2 = g.M2;
    var G = trongTam(A, B, Cc), giuaBC = lerp(B, Cc, 0.5), giai = p.trangThai === 'giai';
    var ve = bang(svg, (g.dang === 'quay' ? [A, B, Cc, M2] : [A, B, Cc]).concat(g.thu ? [g.thu.cuoi] : [])), co = ve.co;
    var tenM2 = ten[5] || ten[3] + '′', cuoi = C.muot((t - 0.88) / 0.1);
    if (o.ho) {
      // Hồ nước chắn giữa M và N: hai điểm nằm đúng trên bờ hồ
      var tam = lerp(M, N, 0.5), rx = dai(M, N) / 2;
      C.mk('ellipse', { cx: tam[0], cy: tam[1], rx: rx, ry: 0.3 * rx, fill: '#74c0fc', 'fill-opacity': 0.45, stroke: '#74c0fc', 'stroke-width': 0.05 * co }, svg);
    }
    var the = theSoi(o), hong = !!(g.pha && g.pha.hong);
    if (g.dang === 'quay') {
      var hl = C.muot((t - 0.72) / 0.12), roi = g.goc !== 0, mauHBH = hong ? '--sai' : '--cc';
      ve.da([M, B, Cc, N], '--tg', 0.07, null, null, the('hbh'));
      if (hl > 0) ve.da([M, B, Cc, M2], mauHBH, 0.12 * hl, mauHBH, 0.12, the('hbh', { 'stroke-opacity': hl }));
      ve.da(g.manh, '--a', 0.12 + 0.13 * C.muot((t - 0.06) / 0.1), '--a', 0.08, the('manh'));
      if (roi) { ve.net(A, M, '--nhat', 0.05, { 'stroke-dasharray': 0.22 * co + ' ' + 0.16 * co }); ve.net(A, N, '--nhat', 0.05, { 'stroke-dasharray': 0.22 * co + ' ' + 0.16 * co }); }
      ve.net(M, B, null, null, the('MB')); ve.net(B, Cc, null, null, the('BC')); ve.net(Cc, N);
      // Hỏng: AM khác MB, nên đoạn AM (đang quay) mang ba vạch, khác một vạch của MB
      ve.vach(M, B, 1); ve.vach(N, Cc, 2);
      ve.vach(g.manh[0], g.manh[1], hong ? 3 : 1); ve.vach(g.manh[0], N, 2);
      ve.net(M, N, TIM, 0.14, the('MN')); ve.net(g.manh[1], N, TIM, 0.14, the('MN'));
      ve.ten(roi ? A : A, G, ten[0], roi ? 0.55 : 1);
      ve.chu(M2[0] + 0.9 * co, M2[1] - 0.5 * co, tenM2, null, C.muot((t - 0.66) / 0.06));
    } else {
      ve.da([A, B, Cc], '--tg', 0.05);
      ve.net(A, B); ve.net(A, Cc); ve.net(B, Cc);
      ve.vach(A, M, 1); ve.vach(M, B, 1);
      var hienN = g.dang === 'quaM' ? C.muot((t - 0.45) / 0.25) : 1;
      ve.vach(A, N, 2, null, hienN); ve.vach(N, Cc, 2, null, hienN);
      if (g.dang === 'ba') {
        ve.vach(B, P, 3); ve.vach(P, Cc, 3);
        var mauBa = ['--a', '--b', '--cc'];
        ve.da([M, N, P], '--tg', 0.08);
        g.banSao.forEach(function (b) { if (b.s > 0) b.doan.forEach(function (d) { ve.net(d[0], d[1], mauBa[b.j], 0.2, { opacity: 0.55 }); }); });
        ve.net(M, N, mauBa[0], 0.14); ve.net(N, P, mauBa[1], 0.14); ve.net(M, P, mauBa[2], 0.14);
      } else ve.net(M, N, TIM, 0.14);
      ve.ten(A, G, ten[0]);
    }
    if (o.goc) { ve.cung(M, A, N, 1.1, '--a'); ve.cung(B, A, Cc, 1.1, '--a'); }
    veThu(ve, g.thu);
    ve.ten(B, G, ten[1]); ve.ten(Cc, G, ten[2]);
    ve.tenCanh(M, A, B, G, ten[3]); ve.tenCanh(N, A, Cc, G, ten[4]);
    if (g.dang === 'ba') ve.tenCanh(P, B, Cc, G, ten[5] || 'P');
    var nhan = nhanCua(o, giai), G2 = trongTam(M, N, P);
    var doan = { AB: [A, B, G], AC: [A, Cc, G], BC: [B, Cc, G], AM: [A, M, G], MB: [M, B, G], AN: [A, N, G], NC: [N, Cc, G],
      MN: [M, N, g.dang === 'ba' ? G2 : giuaBC], NP: [N, P, G2], MP: [M, P, G2] };
    Object.keys(doan).forEach(function (r) {
      if (nhan[r] == null) return;
      // Trong hình ba đường trung bình, nhãn của đường trung bình nằm trong tam giác góc, xa tam giác giữa
      var d = doan[r];
      var mauNhan = giai && o.giai && o.giai[r] != null ? '--cc' : null;
      // Ba đường trung bình: giữa mỗi cạnh đã có tên trung điểm, nên độ dài ba cạnh ghi ở ghiChu, không ghi trên hình
      if (g.dang === 'ba' && (r === 'AB' || r === 'AC' || r === 'BC')) return;
      ve.nhanDoan(d[0], d[1], d[2], nhan[r], mauNhan);
    });
    if (g.dang === 'quay' && !o.nhan && cuoi > 0) ve.chu(giuaBC[0], giuaBC[1] + 1.1 * co, ten[3] + tenM2 + (hong ? (Math.abs(2 * g.MN - g.BC) > 0.1 ? ' ≠ ' : ' không song song ') : ' = ') + ten[1] + ten[2], hong ? '--sai' : '--cc', cuoi, 0.9);
    ve.xong();
  };

  C.lay('thalesTrungBinh').soi = function (g, p, o) {
    if (g.dang !== 'quay' || !g.pha) return {};
    var n = o.ten || ['A', 'B', 'C', 'M', 'N'], t2 = n[5] || n[3] + '\'', hong = g.pha.hong;
    return {
      MN: { tieuDe: 'Đoạn $' + n[3] + n[4] + '$', chu: '$' + n[3] + n[4] + ' \\approx ' + soTex(g.MN) + '$, $' + n[1] + n[2] + ' ' + bang2(g.BC) + '$. ' + (hong ? '$' + n[3] + '$ không là trung điểm nên $' + n[3] + n[4] + '$ không song song với $' + n[1] + n[2] + '$ (lệch $\\approx ' + Math.round(g.pha.lechMN) + '^\\circ$)' + (Math.abs(g.MN - g.BC / 2) > 0.05 ? ' và không bằng nửa $' + n[1] + n[2] + '$.' : '.')
        : '$' + n[4] + '$ là trung điểm của $' + n[3] + t2 + '$, nên $' + n[3] + n[4] + ' = \\frac{1}{2}' + n[3] + t2 + ' = \\frac{1}{2}' + n[1] + n[2] + '$.') },
      manh: { tieuDe: 'Mảnh $' + n[0] + n[3] + n[4] + '$', chu: 'Quay nửa vòng quanh $' + n[4] + '$. $' + n[4] + n[0] + ' = ' + n[4] + n[2] + '$ nên $' + n[0] + '$ tới đúng $' + n[2] + '$. Hai tam giác $' + n[0] + n[3] + n[4] + '$ và $' + n[2] + t2 + n[4] + '$ bằng nhau (c.g.c), góc ở $' + n[4] + '$ là hai góc đối đỉnh.' },
      hbh: { tieuDe: 'Tứ giác $' + n[3] + n[1] + n[2] + t2 + '$', chu: hong ? '$' + n[2] + t2 + ' = ' + n[0] + n[3] + ' \\approx ' + soTex(g.AM) + '$ còn $' + n[3] + n[1] + ' \\approx ' + soTex(g.MB) + '$: song song nhưng không bằng nhau, nên không là hình bình hành.'
        : '$' + n[2] + t2 + ' = ' + n[0] + n[3] + ' = ' + n[3] + n[1] + '$ và $' + n[2] + t2 + ' \\parallel ' + n[3] + n[1] + '$ (so le trong): hai cạnh đối song song và bằng nhau, nên là hình bình hành.' },
      MB: { tieuDe: 'Đoạn $' + n[3] + n[1] + '$', chu: hong ? '$' + n[3] + n[1] + ' \\approx ' + soTex(g.MB) + '$, $' + n[0] + n[3] + ' \\approx ' + soTex(g.AM) + '$: khác nhau.' : '$' + n[3] + n[1] + ' = ' + n[0] + n[3] + ' \\approx ' + soTex(g.MB) + '$ vì $' + n[3] + '$ là trung điểm của $' + n[0] + n[1] + '$.' },
      BC: { tieuDe: 'Cạnh $' + n[1] + n[2] + '$', chu: '$' + n[1] + n[2] + ' ' + bang2(g.BC) + '$. ' + (hong ? '' : 'Trong hình bình hành, $' + n[3] + t2 + '$ song song và bằng cạnh này.') }
    };
  };

  /* ================= 4. Phân giác: hai tam giác chung đỉnh A, tính diện tích hai cách ================= */
  C.dangKi('thalesPhanGiac', {
    // Khoảng kéo vừa phải (hai cạnh chênh nhau không quá 2 lần, góc A 50°–100°) để tam giác không dẹt, các kí hiệu không dồn đống
    thamSo: { ab: { min: 4, max: 8, step: 0.5, md: 5, nhan: 'Cạnh AB', mau: '--a' }, ac: { min: 4, max: 8, step: 0.5, md: 8, nhan: 'Cạnh AC', mau: '--b' },
      gocA: { min: 50, max: 100, step: 5, md: 70, nhan: 'Góc A' },
      lech: { min: -15, max: 15, step: 5, md: 0, nhan: 'Xoay AD lệch phân giác (độ)', pha: true } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var T = o.AB && o.AC && o.BC ? tgCanh(o.AB, o.AC, o.BC) : tgGoc(p.ab, p.ac, p.gocA), A = T.A, B = T.B, Cc = T.C;
      // D là giao của tia phân giác (tổng hai vectơ đơn vị) với BC, không dùng sẵn tính chất cần chứng minh
      // Thử phá: xoay tia AD lệch khỏi phân giác một góc lech (độ)
      var lech = p.lech || 0, w = cong(donVi(tru(B, A)), donVi(tru(Cc, A)));
      var D = giao(A, lech ? xoayHuong(w, lech) : w, B, tru(Cc, B));
      var H = chan(A, B, Cc), E = chan(D, A, B), F = chan(D, A, Cc);
      var diem = { A: A, B: B, C: Cc, D: D };
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 2.2 * dai(B, Cc)) : null;
      var kq = { A: A, B: B, C: Cc, D: D, H: H, E: E, F: F, thu: thu,
        AB: dai(A, B), AC: dai(A, Cc), DB: dai(D, B), DC: dai(D, Cc), AH: dai(A, H), DE: dai(D, E), DF: dai(D, F),
        S1: dienTich(A, B, D), S2: dienTich(A, Cc, D) };
      var n = o.ten || ['A', 'B', 'C', 'D'], g1 = gocDo(B, A, D), g2 = gocDo(D, A, Cc), fr = function (a, b) { return '\\frac{' + a + '}{' + b + '}'; };
      kq.gocBAD = g1; kq.gocDAC = g2;
      kq.pha = lech
        ? { hong: true, chu: '$' + n[0] + n[3] + '$ lệch khỏi phân giác: $\\widehat{' + n[1] + n[0] + n[3] + '} \\approx ' + Math.round(g1) + '^\\circ$ còn $\\widehat{' + n[3] + n[0] + n[2] + '} \\approx ' + Math.round(g2) + '^\\circ$. $' + n[3] + '$ không cách đều hai cạnh: khoảng cách tới $' + n[0] + n[1] + '$ là $\\approx ' + soTex(kq.DE) + '$, tới $' + n[0] + n[2] + '$ là $\\approx ' + soTex(kq.DF) +
          '$. Vẫn có $' + fr('S_{' + n[0] + n[1] + n[3] + '}', 'S_{' + n[0] + n[2] + n[3] + '}') + ' = ' + fr(n[3] + n[1], n[3] + n[2]) + ' \\approx ' + soTex(kq.DB / kq.DC) + '$ (chung đường cao), nhưng $' + fr(n[0] + n[1], n[0] + n[2]) + ' ' + bang2(kq.AB / kq.AC) + '$: hai tỉ số khác nhau.' }
        : { hong: false, chu: '$' + n[0] + n[3] + '$ là phân giác: $' + n[3] + '$ cách đều hai cạnh (cùng $\\approx ' + soTex(kq.DE) + '$), nên $' + fr(n[3] + n[1], n[3] + n[2]) + ' = ' + fr(n[0] + n[1], n[0] + n[2]) + ' ' + bang2(kq.AB / kq.AC) + '$.' };
      return kq;
    }
  });

  C.lay('thalesPhanGiac').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'D'], A = g.A, B = g.B, Cc = g.C, D = g.D, H = g.H, E = g.E, F = g.F;
    var G = trongTam(A, B, Cc), giai = p.trangThai === 'giai';
    var ve = bang(svg, [A, B, Cc, H, E, F].concat(g.thu ? [g.thu.cuoi] : [])), co = ve.co, net2 = { 'stroke-dasharray': 0.22 * co + ' ' + 0.15 * co };
    var cao = C.muot((t - 0.1) / 0.3), cach = C.muot((t - 0.45) / 0.3), cuoi = C.muot((t - 0.85) / 0.12);
    var the = theSoi(o), hong = !!(g.pha && g.pha.hong);
    ve.da([A, B, D], '--a', 0.12 + 0.1 * cao, null, null, the('ABD'));
    ve.da([A, Cc, D], '--b', 0.12 + 0.1 * cao, null, null, the('ACD'));
    // Đường cao AH có thể rơi ra ngoài đoạn BC: kéo dài BC bằng nét đứt
    // Chân đường vuông góc rơi ngoài đoạn PQ (góc tù): kéo dài PQ bằng nét đứt, vượt qua chân một chút cho dễ thấy
    function ngoaiDoan(X, P, Q) { return ((X[0] - P[0]) * (Q[0] - P[0]) + (X[1] - P[1]) * (Q[1] - P[1])) / (dai(P, Q) * dai(P, Q)); }
    function keoDai(X, P, Q, op) {
      if (op <= 0) return;
      var k = ngoaiDoan(X, P, Q), dau = k < 0 ? P : k > 1 ? Q : null;
      if (dau && dai(dau, X) > 1e-9) ve.net(dau, cong(X, nhanSo(donVi(tru(X, dau)), 0.5 * co)), '--muc', 0.06, Object.assign({ opacity: 0.75 * op }, net2));
    }
    keoDai(H, B, Cc, cao); keoDai(E, A, B, cach); keoDai(F, A, Cc, cach);
    ve.net(A, B, cuoi > 0 ? '--a' : '--muc', 0.08 + 0.08 * cuoi); ve.net(A, Cc, cuoi > 0 ? '--b' : '--muc', 0.08 + 0.08 * cuoi);
    ve.net(B, Cc);
    if (cuoi > 0) { ve.net(D, B, '--a', 0.18, { opacity: cuoi }); ve.net(D, Cc, '--b', 0.18, { opacity: cuoi }); }
    ve.cung(A, B, D, 1.25, '--a'); ve.cung(A, D, Cc, 1.25, '--b');
    ve.net(A, D, hong ? '--sai' : TIM, 0.12, the('AD'));
    if (cao > 0) { ve.net(A, lerp(A, H, cao), '--muc', 0.07, the('AH', net2)); if (cao >= 1) ve.vuong(H, A, dai(H, B) > dai(H, Cc) ? B : Cc); }
    if (cach > 0) {
      // Hỏng: D không cách đều hai cạnh, đoạn tới AC tô đỏ và mang hai vạch
      ve.net(D, lerp(D, E, cach), '--cc', 0.1, the('cach')); ve.net(D, lerp(D, F, cach), hong ? '--sai' : '--cc', 0.1, the('cach'));
      if (cach >= 1) { ve.vuong(E, D, A); ve.vuong(F, D, A); ve.vach(D, E, 1, '--cc'); ve.vach(D, F, hong ? 2 : 1, hong ? '--sai' : '--cc'); }
    }
    veThu(ve, g.thu);
    ve.ten(A, G, ten[0]); ve.ten(B, G, ten[1]); ve.ten(Cc, G, ten[2]);
    ve.tenCanh(D, B, Cc, G, ten[3]);
    // Tên H chỉ ghi khi hình không có số của đề, kẻo đè lên nhãn độ dài DB, DC
    // H ngoài đoạn BC hay sát một đỉnh thì không ghi tên, kẻo đè lên tên đỉnh
    var kH = ngoaiDoan(H, B, Cc);
    if (!o.nhan && cao > 0 && kH > 0 && kH < 1 && Math.min(dai(H, D), dai(H, B), dai(H, Cc)) > 1.1 * co) ve.tenCanh(H, B, Cc, G, 'H', cao);
    var nhan = nhanCua(o, giai), doan = { AB: [A, B], AC: [A, Cc], BC: [B, Cc], DB: [D, B], DC: [D, Cc] };
    Object.keys(doan).forEach(function (r) {
      if (nhan[r] == null) return;
      ve.nhanDoan(doan[r][0], doan[r][1], G, nhan[r], giai && o.giai && o.giai[r] != null ? '--cc' : (r === 'DB' ? null : null));
    });
    ve.xong();
  };
  C.lay('thalesPhanGiac').soi = function (g, p, o) {
    if (!g.pha) return {};
    var n = o.ten || ['A', 'B', 'C', 'D'], hong = g.pha.hong, x = soTex, dg = function (v) { return Math.round(v) + '^\\circ'; };
    var S = function (a, b, c) { return 'S_{' + a + b + c + '}'; };
    return {
      ABD: { tieuDe: 'Mảnh $' + n[0] + n[1] + n[3] + '$', chu: '$' + S(n[0], n[1], n[3]) + ' \\approx ' + x(g.S1) + '$. Tính hai cách: $\\frac{1}{2} \\cdot ' + n[3] + n[1] + ' \\cdot ' + n[0] + 'H$ (đáy $' + n[3] + n[1] + ' \\approx ' + x(g.DB) + '$), hoặc $\\frac{1}{2} \\cdot ' + n[0] + n[1] + ' \\cdot$ (khoảng cách từ $' + n[3] + '$ tới $' + n[0] + n[1] + '$) với $' + n[0] + n[1] + ' ' + bang2(g.AB) + '$.' },
      ACD: { tieuDe: 'Mảnh $' + n[0] + n[2] + n[3] + '$', chu: '$' + S(n[0], n[2], n[3]) + ' \\approx ' + x(g.S2) + '$. Đáy $' + n[3] + n[2] + ' \\approx ' + x(g.DC) + '$ với đường cao $' + n[0] + 'H$, hoặc đáy $' + n[0] + n[2] + ' ' + bang2(g.AC) + '$ với khoảng cách từ $' + n[3] + '$ tới $' + n[0] + n[2] + '$.' },
      AD: { tieuDe: 'Đoạn $' + n[0] + n[3] + '$', chu: hong ? 'Lệch khỏi phân giác: $\\widehat{' + n[1] + n[0] + n[3] + '} \\approx ' + dg(g.gocBAD) + '$, $\\widehat{' + n[3] + n[0] + n[2] + '} \\approx ' + dg(g.gocDAC) + '$.'
        : 'Phân giác của góc $' + n[0] + '$: $\\widehat{' + n[1] + n[0] + n[3] + '} = \\widehat{' + n[3] + n[0] + n[2] + '} \\approx ' + dg(g.gocBAD) + '$.' },
      AH: { tieuDe: 'Đường cao $' + n[0] + 'H$', chu: '$' + n[0] + 'H \\approx ' + x(g.AH) + '$, chung cho cả hai mảnh. Nên $\\frac{' + S(n[0], n[1], n[3]) + '}{' + S(n[0], n[2], n[3]) + '} = \\frac{' + n[3] + n[1] + '}{' + n[3] + n[2] + '} \\approx ' + x(g.DB / g.DC) + '$.' },
      cach: { tieuDe: 'Khoảng cách từ $' + n[3] + '$ tới hai cạnh', chu: hong ? 'Tới $' + n[0] + n[1] + '$: $\\approx ' + x(g.DE) + '$; tới $' + n[0] + n[2] + '$: $\\approx ' + x(g.DF) + '$. Không bằng nhau vì $' + n[3] + '$ không nằm trên tia phân giác.'
        : 'Cùng $\\approx ' + x(g.DE) + '$, vì điểm trên tia phân giác của một góc cách đều hai cạnh của góc (lớp 7). Nên $\\frac{' + S(n[0], n[1], n[3]) + '}{' + S(n[0], n[2], n[3]) + '} = \\frac{' + n[0] + n[1] + '}{' + n[0] + n[2] + '}$.' }
    };
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
