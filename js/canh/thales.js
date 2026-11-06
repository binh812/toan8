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
    return { gt: v, tu: tu, cuoi: cong(tu, nhanSo(donVi(tru(den, tu)), Math.min(v, tran))) };
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
      nhanDoan: function (P, Q, ref, s, m, op) {
        var M = lerp(P, Q, 0.5), n = phap(P, Q, M, ref), d = co * (0.78 + Math.abs(n[0]) * 0.3 * String(s).length);
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
    ve.cham(thu.cuoi, '--sai', 0.2);
    var n = [-u[1], u[0]];
    if (n[1] > 0) n = [-n[0], -n[1]];
    ve.chu(thu.cuoi[0] + n[0] * 1.0 * co, thu.cuoi[1] + n[1] * 1.0 * co, C.fmt(thu.gt), '--sai', 1, 0.9);
  }
  function nhanCua(o, giai) { return Object.assign({}, o.nhan || {}, giai ? o.giai || {} : {}); }

  /* ================= 1. Định lí Thalès: chia AB thành m + k phần bằng nhau ================= */
  // Kẻ qua mỗi vạch một đường song song với BC. Tam giác nhỏ trên cùng trượt dọc AB từng nấc, vừa khít giữa hai
  // đường song song kề nhau; cạnh của nó song song với AC trượt ngang sang AC (hình bình hành) và trùng một khúc.
  // Nên AC cũng bị chia thành m + k khúc bằng nhau. Chỉ đúng khi tỉ số là phân số m/k.
  C.dangKi('thalesLuoi', {
    thamSo: { m: { min: 1, max: 5, step: 1, md: 2, nhan: 'm', mau: '--a' }, k: { min: 1, max: 5, step: 1, md: 3, nhan: 'k', mau: '--b' } },
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
      var M = P[m], N = o.dao ? lerp(A, Cc, o.dao.AN / (o.dao.AN + o.dao.NC)) : Q[m];
      var diem = { A: A, B: B, C: Cc, M: M, N: N };
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 1.6 * Math.max(dai(A, B), dai(A, Cc), dai(B, Cc))) : null;
      return { A: A, B: B, C: Cc, M: M, N: N, P: P, Q: Q, m: m, k: k, n: n, banSao: banSao, canhTruot: canhTruot, thu: thu,
        songSong: dai(N, Q[m]) < 1e-9 * (1 + dai(A, Cc)), AM: dai(A, M), MB: dai(M, B), AN: dai(A, N), NC: dai(N, Cc) };
    }
  });

  C.lay('thalesLuoi').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], A = g.A, B = g.B, Cc = g.C, M = g.M, N = g.N, n = g.n, P = g.P, Q = g.Q, i;
    var G = trongTam(A, B, Cc), giuaBC = lerp(B, Cc, 0.5);
    var ve = bang(svg, [A, B, Cc]), co = ve.co;
    var giai = p.trangThai === 'giai', cuoi = C.muot((t - 0.88) / 0.1), hienVach = o.anLucDau ? C.muot((t - 0.02) / 0.06) : 1;
    var w1 = 0.3 / Math.max(1, n - 1);
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
    g.banSao.forEach(function (b) { if (b.hien > 0) ve.da(b.dinh, '--cc', 0.3 * b.hien * (1 - 0.6 * cuoi), '--cc', 0.05, { 'stroke-opacity': b.hien }); });
    for (i = 1; i < n; i++) {
      var s = C.muot((t - 0.1 - (i - 1) * w1) / w1);
      if (i === g.m && !o.dao) continue;
      if (s > 0) ve.net(P[i], lerp(P[i], Q[i], s), '--nhat', 0.06, o.dao && i === g.m ? { 'stroke-dasharray': 0.25 * co + ' ' + 0.15 * co } : null);
      if (!o.dao || i !== g.m) ve.vachDiem(Q[i], tru(Cc, A), C.muot((s - 0.85) / 0.15));
    }
    var truot = C.muot((t - 0.7) / 0.04) * (1 - 0.5 * cuoi);
    if (truot > 0) g.canhTruot.forEach(function (d) { ve.net(d[0], d[1], '--cc', 0.17, { opacity: truot }); });
    ve.net(A, B); ve.net(A, Cc); ve.net(B, Cc);
    for (i = 1; i < n; i++) ve.vachDiem(P[i], tru(B, A), hienVach);
    if (cuoi > 0) {
      ve.net(A, M, '--a', 0.18, { opacity: cuoi }); ve.net(M, B, '--b', 0.18, { opacity: cuoi });
      if (!o.dao) { ve.net(A, N, '--a', 0.18, { opacity: cuoi }); ve.net(N, Cc, '--b', 0.18, { opacity: cuoi }); }
    }
    if (o.goc) { ve.cung(M, A, N, 1.1, '--a'); ve.cung(B, A, Cc, 1.1, '--a'); }
    ve.net(M, N, o.dao ? (cuoi > 0.5 ? (g.songSong ? '--cc' : '--sai') : '--nhat') : TIM, 0.14);
    veThu(ve, g.thu);
    ve.ten(A, G, ten[0]); ve.ten(B, G, ten[1]); ve.ten(Cc, G, ten[2]);
    ve.tenCanh(M, A, B, G, ten[3]); ve.tenCanh(N, A, Cc, G, ten[4]);
    var nhan = nhanCua(o, giai), doan = { AM: [A, M], MB: [M, B], AN: [A, N], NC: [N, Cc], AB: [A, B], AC: [A, Cc], BC: [B, Cc], MN: [M, N] };
    var dem = { AM: g.m, MB: g.k, AN: g.m, NC: g.k };
    Object.keys(doan).forEach(function (r) {
      var s = nhan[r], m = null, op = 1;
      // Hình không có số của đề: cuối cùng ghi số phần của mỗi đoạn
      if (s == null && !o.nhan && dem[r] && !(o.dao && (r === 'AN' || r === 'NC'))) { s = dem[r] + ' phần'; op = cuoi; m = r === 'AM' || r === 'AN' ? '--a' : '--b'; }
      if (s == null) return;
      if (giai && o.giai && o.giai[r] != null) m = '--cc';
      ve.nhanDoan(doan[r][0], doan[r][1], r === 'MN' ? giuaBC : G, s, m, op);
    });
    if (o.dao) ve.chu(giuaBC[0], Math.max(B[1], Cc[1]) + 2.3 * co, ten[3] + ten[4] + (g.songSong ? ' ∥ ' : ' không song song với ') + ten[1] + ten[2],
      g.songSong ? '--cc' : '--sai', cuoi, 0.85);
    ve.xong();
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
    thamSo: { ax: { min: -1, max: 9, step: 0.5, md: 3, nhan: 'Đỉnh A', mau: '--tg' }, bc: { min: 6, max: 12, step: 0.5, md: 10, nhan: 'Cạnh BC', mau: '--b' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var T = tamGiac(o, { A: [p.ax, -7], B: [0, 0], C: [p.bc, 0] }), A = T.A, B = T.B, Cc = T.C, dang = o.dang || 'quay';
      var M = lerp(A, B, 0.5), N = lerp(A, Cc, 0.5), P = lerp(B, Cc, 0.5), M2 = tru(nhanSo(N, 2), M);
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
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 1.4 * dai(B, Cc)) : null;
      return { A: A, B: B, C: Cc, M: M, N: N, P: P, M2: M2, manh: manh, goc: goc, banSao: banSao, thu: thu, dang: dang,
        MN: dai(M, N), BC: dai(B, Cc) };
    }
  });

  C.lay('thalesTrungBinh').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'M', 'N'], A = g.A, B = g.B, Cc = g.C, M = g.M, N = g.N, P = g.P, M2 = g.M2;
    var G = trongTam(A, B, Cc), giuaBC = lerp(B, Cc, 0.5), giai = p.trangThai === 'giai';
    var ve = bang(svg, g.dang === 'quay' ? [A, B, Cc, M2] : [A, B, Cc]), co = ve.co;
    var tenM2 = ten[5] || ten[3] + '′', cuoi = C.muot((t - 0.88) / 0.1);
    if (o.ho) {
      // Hồ nước chắn giữa M và N: hai điểm nằm đúng trên bờ hồ
      var tam = lerp(M, N, 0.5), rx = dai(M, N) / 2;
      C.mk('ellipse', { cx: tam[0], cy: tam[1], rx: rx, ry: 0.3 * rx, fill: '#74c0fc', 'fill-opacity': 0.45, stroke: '#74c0fc', 'stroke-width': 0.05 * co }, svg);
    }
    if (g.dang === 'quay') {
      var hl = C.muot((t - 0.72) / 0.12), roi = g.goc !== 0;
      ve.da([M, B, Cc, N], '--tg', 0.07);
      if (hl > 0) ve.da([M, B, Cc, M2], '--cc', 0.12 * hl, '--cc', 0.12, { 'stroke-opacity': hl });
      ve.da(g.manh, '--a', 0.12 + 0.13 * C.muot((t - 0.06) / 0.1), '--a', 0.08);
      if (roi) { ve.net(A, M, '--nhat', 0.05, { 'stroke-dasharray': 0.22 * co + ' ' + 0.16 * co }); ve.net(A, N, '--nhat', 0.05, { 'stroke-dasharray': 0.22 * co + ' ' + 0.16 * co }); }
      ve.net(M, B); ve.net(B, Cc); ve.net(Cc, N);
      ve.vach(M, B, 1); ve.vach(N, Cc, 2);
      ve.vach(g.manh[0], g.manh[1], 1); ve.vach(g.manh[0], N, 2);
      ve.net(M, N, TIM, 0.14); ve.net(g.manh[1], N, TIM, 0.14);
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
      // Ba đường trung bình: giữa mỗi cạnh đã có tên trung điểm, nên ghi độ dài cạnh lệch về phía một đầu
      if (g.dang === 'ba' && (r === 'AB' || r === 'AC' || r === 'BC')) ve.nhanDoan(d[0], lerp(d[0], d[1], 0.76), d[2], nhan[r], mauNhan);
      else ve.nhanDoan(d[0], d[1], d[2], nhan[r], mauNhan);
    });
    if (g.dang === 'quay' && !o.nhan && cuoi > 0) ve.chu(giuaBC[0], giuaBC[1] + 1.1 * co, ten[3] + tenM2 + ' = ' + ten[1] + ten[2], '--cc', cuoi, 0.9);
    ve.xong();
  };

  /* ================= 4. Phân giác: hai tam giác chung đỉnh A, tính diện tích hai cách ================= */
  C.dangKi('thalesPhanGiac', {
    thamSo: { ab: { min: 3, max: 9, step: 0.5, md: 5, nhan: 'Cạnh AB', mau: '--a' }, ac: { min: 3, max: 9, step: 0.5, md: 8, nhan: 'Cạnh AC', mau: '--b' },
      gocA: { min: 40, max: 120, step: 5, md: 70, nhan: 'Góc A' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var T = o.AB && o.AC && o.BC ? tgCanh(o.AB, o.AC, o.BC) : tgGoc(p.ab, p.ac, p.gocA), A = T.A, B = T.B, Cc = T.C;
      // D là giao của tia phân giác (tổng hai vectơ đơn vị) với BC, không dùng sẵn tính chất cần chứng minh
      var D = giao(A, cong(donVi(tru(B, A)), donVi(tru(Cc, A))), B, tru(Cc, B));
      var H = chan(A, B, Cc), E = chan(D, A, B), F = chan(D, A, Cc);
      var diem = { A: A, B: B, C: Cc, D: D };
      var thu = o.thu ? doanThu(p, diem[o.thu.tu], diem[o.thu.den], 1.3 * dai(B, Cc)) : null;
      return { A: A, B: B, C: Cc, D: D, H: H, E: E, F: F, thu: thu,
        AB: dai(A, B), AC: dai(A, Cc), DB: dai(D, B), DC: dai(D, Cc), AH: dai(A, H), DE: dai(D, E), DF: dai(D, F),
        S1: dienTich(A, B, D), S2: dienTich(A, Cc, D) };
    }
  });

  C.lay('thalesPhanGiac').ve = function (svg, g, p, t, o) {
    var ten = o.ten || ['A', 'B', 'C', 'D'], A = g.A, B = g.B, Cc = g.C, D = g.D, H = g.H, E = g.E, F = g.F;
    var G = trongTam(A, B, Cc), giai = p.trangThai === 'giai';
    var ve = bang(svg, [A, B, Cc, H, E, F]), co = ve.co, net2 = { 'stroke-dasharray': 0.22 * co + ' ' + 0.15 * co };
    var cao = C.muot((t - 0.1) / 0.3), cach = C.muot((t - 0.45) / 0.3), cuoi = C.muot((t - 0.85) / 0.12);
    ve.da([A, B, D], '--a', 0.12 + 0.1 * cao);
    ve.da([A, Cc, D], '--b', 0.12 + 0.1 * cao);
    // Đường cao AH có thể rơi ra ngoài đoạn BC: kéo dài BC bằng nét đứt
    function keoDai(X, P, Q, op) { if (op <= 0) return; var k = ((X[0] - P[0]) * (Q[0] - P[0]) + (X[1] - P[1]) * (Q[1] - P[1])) / (dai(P, Q) * dai(P, Q));
      if (k < 0) ve.net(P, X, '--nhat', 0.05, Object.assign({ opacity: op }, net2)); if (k > 1) ve.net(Q, X, '--nhat', 0.05, Object.assign({ opacity: op }, net2)); }
    keoDai(H, B, Cc, cao); keoDai(E, A, B, cach); keoDai(F, A, Cc, cach);
    ve.net(A, B, cuoi > 0 ? '--a' : '--muc', 0.08 + 0.08 * cuoi); ve.net(A, Cc, cuoi > 0 ? '--b' : '--muc', 0.08 + 0.08 * cuoi);
    ve.net(B, Cc);
    if (cuoi > 0) { ve.net(D, B, '--a', 0.18, { opacity: cuoi }); ve.net(D, Cc, '--b', 0.18, { opacity: cuoi }); }
    ve.cung(A, B, D, 1.25, '--a'); ve.cung(A, D, Cc, 1.25, '--b');
    ve.net(A, D, TIM, 0.12);
    if (cao > 0) { ve.net(A, lerp(A, H, cao), '--muc', 0.07, net2); if (cao >= 1) ve.vuong(H, A, dai(H, B) > dai(H, Cc) ? B : Cc); }
    if (cach > 0) {
      ve.net(D, lerp(D, E, cach), '--cc', 0.1); ve.net(D, lerp(D, F, cach), '--cc', 0.1);
      if (cach >= 1) { ve.vuong(E, D, A); ve.vuong(F, D, A); ve.vach(D, E, 1, '--cc'); ve.vach(D, F, 1, '--cc'); }
    }
    veThu(ve, g.thu);
    ve.ten(A, G, ten[0]); ve.ten(B, G, ten[1]); ve.ten(Cc, G, ten[2]);
    ve.tenCanh(D, B, Cc, G, ten[3]);
    // Tên H chỉ ghi khi hình không có số của đề, kẻo đè lên nhãn độ dài DB, DC
    if (!o.nhan && cao > 0 && dai(H, D) > 0.9 * co) ve.tenCanh(H, B, Cc, G, 'H', cao);
    var nhan = nhanCua(o, giai), doan = { AB: [A, B], AC: [A, Cc], BC: [B, Cc], DB: [D, B], DC: [D, Cc] };
    Object.keys(doan).forEach(function (r) {
      if (nhan[r] == null) return;
      ve.nhanDoan(doan[r][0], doan[r][1], G, nhan[r], giai && o.giai && o.giai[r] != null ? '--cc' : (r === 'DB' ? null : null));
    });
    ve.xong();
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
