// Cảnh cho chương X: hình chóp đều.
// traiChop: trải phẳng các mặt bên, cắt đôi một mặt theo trung đoạn rồi xếp xen kẽ thành hình chữ nhật dài p (nửa chu vi đáy), cao d (trung đoạn).
// doNuoc: múc đầy cốc hình chóp đổ sang cốc lăng trụ cùng đáy, cùng chiều cao; đổ ba lần thì đầy (thí nghiệm, SGK công nhận công thức).
(function (C) {
  'use strict';
  var TIM = '#9c36b5', HO_PHACH = '#f59f00';
  // Góc nhìn xiên lúc đầu: quay quanh trục đứng Q0, nghiêng N0 (0 là nhìn thẳng từ trên xuống)
  var Q0 = 0.4, N0 = 1.15;

  function layN(o) {
    var n = (o && o.n) || 4;
    if (n !== 3 && n !== 4) throw new Error('hình chóp: đáy là tam giác đều (n = 3) hoặc hình vuông (n = 4)');
    return n;
  }
  // Số đo hình chóp đều n cạnh đáy a, trung đoạn d: r từ tâm đáy tới trung điểm cạnh, R tới đỉnh đáy, h chiều cao, l cạnh bên
  function soDo(n, a, d) {
    var r = a / (2 * Math.tan(Math.PI / n)), R = a / (2 * Math.sin(Math.PI / n));
    if (!(a > 0) || !(d > r + 1e-9)) throw new Error('hình chóp: trung đoạn phải dài hơn ' + C.fmt(r) + ' (khoảng cách từ tâm đáy tới cạnh đáy)');
    return { n: n, a: a, d: d, r: r, R: R, h: Math.sqrt(d * d - r * r), l: Math.sqrt(d * d + a * a / 4), p: n * a / 2 };
  }
  // Chiếu xiên: trả về [x, y màn hình, độ xa] (độ xa lớn là ở xa người nhìn)
  function chieu(q, Q, N) {
    var cq = Math.cos(Q), sq = Math.sin(Q), x = q[0] * cq - q[1] * sq, y = q[0] * sq + q[1] * cq, z = q[2] || 0;
    return [x, -(y * Math.cos(N) + z * Math.sin(N)), y * Math.sin(N) - z * Math.cos(N)];
  }
  function huongNhin(Q, N) { return [-Math.sin(N) * Math.sin(Q), -Math.sin(N) * Math.cos(Q), Math.cos(N)]; }
  // Đáy: đa giác đều ngược chiều kim đồng hồ; mặt 0 quay về phía người nhìn (lệch một chút để các mặt bên không bị nhìn nghiêng hẳn)
  function dinhDay(n, R) {
    var phi0 = Math.atan2(-Math.cos(Q0), -Math.sin(Q0)) - Math.PI / n - (n === 3 ? 0.8 : 0.4), ds = [], u = [];
    for (var i = 0; i < n; i++) {
      var f = phi0 + 2 * Math.PI * i / n;
      ds.push([R * Math.cos(f), R * Math.sin(f), 0]);
      u.push([Math.cos(f + Math.PI / n), Math.sin(f + Math.PI / n)]);
    }
    return { dinh: ds, u: u };
  }
  function bao(ds) {
    var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    ds.forEach(function (q) { b.x0 = Math.min(b.x0, q[0]); b.x1 = Math.max(b.x1, q[0]); b.y0 = Math.min(b.y0, q[1]); b.y1 = Math.max(b.y1, q[1]); });
    return b;
  }
  function gop(b, c) { return { x0: Math.min(b.x0, c.x0), y0: Math.min(b.y0, c.y0), x1: Math.max(b.x1, c.x1), y1: Math.max(b.y1, c.y1) }; }

  /* ---------- traiChop ---------- */
  // Mỗi mặt bên ghi trong hệ toạ độ riêng: trung điểm cạnh đáy là gốc, cạnh đáy nằm ngang, đỉnh ở (0, d).
  function traiTai(p, t, o) {
    var n = layN(o), g = soDo(n, p.a, p.d), a = g.a, d = g.d, r = g.r, W = g.p;
    var s = C.muot((t - 0.1) / 0.3), kv = C.muot((t - 0.4) / 0.1), Q = Q0 * (1 - kv), N = N0 * (1 - kv);
    var dd = dinhDay(n, g.R), u = dd.u, w = huongNhin(Q, N);
    // Lúc còn là hình chóp thì phóng to cho dễ nhìn, trải phẳng xong về đúng cỡ
    var to = 1 + 0.9 * (1 - s), cz = function (q) { var c = chieu(q, Q, N); return [c[0] * to, c[1] * to, c[2]]; };
    var beta = (1 - s) * (Math.PI - Math.atan2(g.h, r)), cb = Math.cos(beta), sb = Math.sin(beta);
    var TAM = [[-a / 2, 0], [a / 2, 0], [0, d]], NUA_T = [[-a / 2, 0], [0, 0], [0, d]], NUA_P = [[0, 0], [a / 2, 0], [0, d]];
    function khongGian(i, q) {
      var ux = u[i][0], uy = u[i][1];
      return [r * ux + q[0] * uy + q[1] * cb * ux, r * uy - q[0] * ux + q[1] * cb * uy, q[1] * sb];
    }
    function luoi(i) { return { x: r * u[i][0], y: r * u[i][1], th: Math.atan2(u[i][1], u[i][0]) - Math.PI / 2, sx: 1 }; }
    function datTheo(ps, q) {
      var c = Math.cos(ps.th), sn = Math.sin(ps.th), x = ps.sx * q[0];
      return [ps.x + c * x - sn * q[1], ps.y + sn * x + c * q[1], 0];
    }
    function giua(A, B, k) {
      var dth = B.th - A.th;
      while (dth > Math.PI) dth -= 2 * Math.PI;
      while (dth <= -Math.PI) dth += 2 * Math.PI;
      return { x: C.noiSuy(A.x, B.x, k), y: C.noiSuy(A.y, B.y, k), th: A.th + dth * k, sx: C.noiSuy(A.sx, B.sx, k) };
    }
    // Mặt 0 cắt đôi theo trung đoạn; hai nửa vào hai đầu. n lẻ thì nửa phải phải lật mặt mới vừa chỗ.
    var manh = [
      { mat: 0, nua: 'trai', hinh: NUA_T, dich: { x: -W / 2, y: d / 2, th: Math.PI, sx: 1 } },
      { mat: 0, nua: 'phai', hinh: NUA_P, dich: n % 2 === 0 ? { x: W / 2, y: d / 2, th: Math.PI, sx: 1 } : { x: W / 2, y: -d / 2, th: 0, sx: -1 } }
    ];
    for (var k = 1; k < n; k++) {
      var cx = -W / 2 + k * a / 2;
      manh.push({ mat: k, hinh: TAM, dich: k % 2 ? { x: cx, y: -d / 2, th: 0, sx: 1 } : { x: cx, y: d / 2, th: Math.PI, sx: 1 } });
    }
    manh.forEach(function (m, j) {
      var di = C.muot((t - (0.56 + 0.025 * j)) / 0.2), ps = di > 0 ? giua(luoi(m.mat), m.dich, di) : null;
      var diem = function (q) { return ps ? datTheo(ps, q) : khongGian(m.mat, q); };
      m.di = di;
      // Mảnh đang lật mặt (n lẻ): nhìn từ trên thấy hẹp lại, như tờ giấy đang lật
      m.lat = ps ? ps.sx : 1;
      m.dinh3 = m.hinh.map(diem);
      var ch = m.dinh3.map(cz);
      m.dinh = ch.map(function (q) { return [q[0], q[1]]; });
      m.sau = ch.reduce(function (sum, q) { return sum + q[2]; }, 0) / 3;
      // Trung đoạn của mảnh: từ trung điểm cạnh đáy tới đỉnh
      m.trungDoan = [diem([0, 0]), diem([0, d])].map(function (q) { var c = cz(q); return [c[0], c[1]]; });
      var ux = u[m.mat][0], uy = u[m.mat][1];
      m.an = s < 0.02 && g.h * (ux * w[0] + uy * w[1]) + r * w[2] < 0;
    });
    var day = dd.dinh.map(function (q) { var c = cz(q); return [c[0], c[1]]; });
    var pS = cz([0, 0, g.h]), pO = cz([0, 0, 0]), pM = cz([r * u[0][0], r * u[0][1], 0]);
    return { n: n, a: a, d: d, r: r, R: g.R, h: g.h, l: g.l, p: W, s: s, kv: kv, manh: manh, day: day,
      dayMo: 1 - C.muot((t - 0.42) / 0.08), S: [pS[0], pS[1]], O: [pO[0], pO[1]], M0: [pM[0], pM[1]],
      ba: 1 - C.muot((t - 0.09) / 0.04), dau: 1 - C.muot((t - 0.52) / 0.05), cat: C.muot((t - 0.5) / 0.05), cuoi: C.muot((t - 0.86) / 0.1),
      // Hình chữ nhật cuối, toạ độ màn hình (nhìn thẳng từ trên: y màn hình = −y)
      chuNhat: [[-W / 2, -d / 2], [W / 2, -d / 2], [W / 2, d / 2], [-W / 2, d / 2]] };
  }
  C.dangKi('traiChop', {
    thamSo: { a: { min: 2, max: 6, step: 1, md: 4, nhan: 'Cạnh đáy a', mau: '--cc' }, d: { min: 4, max: 9, step: 1, md: 6, nhan: 'Trung đoạn d', mau: '--b' } },
    trangThai: { soiSAM: true, soiSOM: true, caChuVi: true, motMat: true },
    tinh: function (p, t, o) {
      var k = traiTai(p, t, o), b = bao(k.chuNhat);
      // Khung cố định theo số đo, không theo t, để hình không nhảy khi chạy
      for (var i = 0; i <= 20; i++) {
        var q = i === Math.round(t * 20) ? k : traiTai(p, i / 20, o);
        q.manh.forEach(function (m) { b = gop(b, bao(m.dinh)); });
        b = gop(b, bao(q.day));
      }
      if (p.trangThai === 'caChuVi') b.x1 = Math.max(b.x1, 1.5 * k.p);
      k.khung = b;
      return k;
    }
  });

  /* ---------- doNuoc ---------- */
  var BAT = [0.1, 0.37, 0.64], DO = 0.2;
  function nuocTai(t) {
    var vao = 0, coc = 1, dangDo = -1, xong = 0;
    BAT.forEach(function (b, k) {
      var f = C.kep((t - b) / DO, 0, 1);
      vao += f;
      if (f >= 1) xong = k + 1;
      if (f > 0 && f < 1) dangDo = k;
      if (t >= b) {
        // Đổ xong thì múc đầy lại (trừ lần cuối)
        var lai = k < 2 ? C.muot((t - b - DO - 0.01) / 0.04) : 0;
        coc = (1 - f) + f * lai;
      }
    });
    return { vao: vao / 3, coc: coc, dangDo: dangDo, xong: xong };
  }
  C.dangKi('doNuoc', {
    thamSo: { a: { min: 2, max: 6, step: 0.5, md: 4, nhan: 'Cạnh đáy a', mau: '--cc' }, h: { min: 2, max: 8, step: 0.5, md: 5, nhan: 'Chiều cao h', mau: '--tg' } },
    trangThai: { quen13: true, trungDoan: true },
    tinh: function (p, t, o) {
      var n = layN(o), a = p.a, h = p.h;
      if (!(a > 0 && h > 0)) throw new Error('doNuoc: cạnh đáy và chiều cao phải dương');
      var R = a / (2 * Math.sin(Math.PI / n)), r = a / (2 * Math.tan(Math.PI / n)), S = n * a * r / 2, w = nuocTai(t);
      // Thể tích nước trong cốc hình chóp tỉ lệ với lập phương độ cao mặt nước (hình chóp nhỏ đồng dạng)
      var zCoc = h * Math.cbrt(w.coc), zLang = h * w.vao;
      var dd = dinhDay(n, R), le = 1.35 * R + 0.25 * a;
      var dat = function (q, dx) { var c = chieu(q, Q0, N0); return [c[0] + dx, c[1], c[2]]; };
      var lang = { day: [], tren: [], nuocDay: [], nuocTren: [] }, coc = { dinh: dat([0, 0, 0], le), mieng: [], nuoc: [] };
      dd.dinh.forEach(function (q) {
        lang.day.push(dat(q, -le)); lang.tren.push(dat([q[0], q[1], h], -le)); lang.nuocTren.push(dat([q[0], q[1], zLang], -le));
        coc.mieng.push(dat([q[0], q[1], h], le));
        var k = zCoc / h;
        coc.nuoc.push(dat([q[0] * k, q[1] * k, zCoc], le));
      });
      var wv = huongNhin(Q0, N0);
      var truocLang = dd.u.map(function (v) { return v[0] * wv[0] + v[1] * wv[1] > 0; });
      var truocCoc = dd.u.map(function (v) { return h * (v[0] * wv[0] + v[1] * wv[1]) - r * wv[2] > 0; });
      var mu = [0, 0, h], ti = [0, 0, 0];
      var giuaMieng = dd.dinh.map(function (q, i) { var q2 = dd.dinh[(i + 1) % n]; return dat([(q[0] + q2[0]) / 2, (q[1] + q2[1]) / 2, h], le); });
      var khung = bao(lang.day.concat(lang.tren, coc.mieng, [coc.dinh]));
      return { n: n, a: a, h: h, S: S, R: R, r: r, le: le, vCoc: S * zCoc * Math.pow(zCoc / h, 2) / 3, vLang: S * zLang, zCoc: zCoc, zLang: zLang,
        nuoc: w, lang: lang, coc: coc, truocLang: truocLang, truocCoc: truocCoc, giuaMieng: giuaMieng,
        tamDayLang: dat(ti, -le), tamTrenLang: dat(mu, -le), tamMieng: dat(mu, le), cuoi: C.muot((t - 0.86) / 0.1), khung: khung };
    }
  });

  /* ---------- Phần vẽ ---------- */
  function mauVar(m) { return m.charAt(0) === '-' ? 'var(' + m + ')' : m; }
  function chuMau(cha, x, y, s, co, mau, them) {
    var at = Object.assign({}, them || {});
    if (mau && mau.charAt(0) !== '-') { at.style = 'fill:' + mau; mau = null; }
    return C.chu(cha, x, y, s, co, mau, at);
  }
  var NET = { 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  function duong(cha, P, Q, mau, day, them) {
    return C.mk('line', Object.assign({ x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], stroke: mauVar(mau), 'stroke-width': day }, NET, them || {}), cha);
  }
  function daGiac(cha, ds, at) { return C.mk('polygon', Object.assign({ points: C.diem(ds) }, NET, at), cha); }
  // Chữ ở giữa đoạn PQ, đẩy ra xa điểm tham chiếu ra
  function nhanDoan(cha, P, Q, ra, s, co, mau, them) {
    if (!s) return;
    var mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, vx = -(Q[1] - P[1]), vy = Q[0] - P[0], l = Math.hypot(vx, vy) || 1;
    if ((ra[0] - mx) * vx + (ra[1] - my) * vy > 0) { vx = -vx; vy = -vy; }
    chuMau(cha, mx + vx / l * co * 0.8, my + vy / l * co * 0.8, s, co, mau, Object.assign({ 'font-style': 'italic' }, them || {}));
  }
  function tam(ds) { return [ds.reduce(function (s, q) { return s + q[0]; }, 0) / ds.length, ds.reduce(function (s, q) { return s + q[1]; }, 0) / ds.length]; }
  // Dấu góc vuông tại V, hai cạnh đi về phía A và B
  function gocVuong(cha, V, A, B, c) {
    var ua = [A[0] - V[0], A[1] - V[1]], ub = [B[0] - V[0], B[1] - V[1]], la = Math.hypot(ua[0], ua[1]) || 1, lb = Math.hypot(ub[0], ub[1]) || 1;
    var p1 = [V[0] + ua[0] / la * c, V[1] + ua[1] / la * c], p3 = [V[0] + ub[0] / lb * c, V[1] + ub[1] / lb * c], p2 = [p1[0] + p3[0] - V[0], p1[1] + p3[1] - V[1]];
    C.mk('polyline', Object.assign({ points: C.diem([p1, p2, p3]), fill: 'none', stroke: 'var(--muc)', 'stroke-width': 1.3 }, NET), cha);
  }
  function datKhung(svg, b, duoi) {
    var rong = b.x1 - b.x0, co = Math.max(rong, (b.y1 - b.y0) * 0.8) / 13, le = co * 1.6;
    svg.setAttribute('viewBox', [b.x0 - le, b.y0 - le, rong + 2 * le, b.y1 - b.y0 + 2 * le + co * (duoi || 0)].join(' '));
    return { co: co, x0: b.x0 - le, rong: rong + 2 * le, day: b.y1 + le };
  }
  function ten(o, k, md) { var t = o.ten || {}; return t[k] != null ? t[k] : md; }

  C.lay('traiChop').ve = function (svg, k, p, t, o) {
    var giai = p.trangThai === 'giai', tt = p.trangThai;
    var kh = datKhung(svg, k.khung, 2.4), co = kh.co;
    var tA = ten(o, 'a', 'a'), tD = o.anD && !giai ? '?' : ten(o, 'd', 'd'), tL = ten(o, 'l', ''), tH = ten(o, 'h', 'h'), tP = ten(o, 'p', 'p');
    var traiDuoi = k.s < 0.02;
    if (k.dayMo > 0.01) daGiac(svg, k.day, { fill: 'var(--cc)', 'fill-opacity': 0.12, stroke: 'var(--muc)', 'stroke-width': 1.3, 'stroke-dasharray': traiDuoi ? '5 4' : null, opacity: k.dayMo });
    var sx = k.manh.slice().sort(function (m1, m2) { return m2.sau - m1.sau; });
    var mo = function (m) { return tt === 'motMat' && k.cuoi > 0.5 && m.mat !== 1 ? 0.3 : 1; };
    sx.forEach(function (m) {
      var la0 = m.mat === 0, g = C.mk('g', { opacity: mo(m) }, svg);
      daGiac(g, m.dinh, { fill: la0 ? HO_PHACH : 'var(--tg)', 'fill-opacity': (la0 ? 0.32 : 0.16) * (traiDuoi ? 0.7 : 1),
        stroke: 'var(--muc)', 'stroke-width': m.an ? 1.2 : 1.8, 'stroke-dasharray': m.an ? '5 4' : null });
      // Trung đoạn trên mỗi mặt: lúc còn là hình chóp chỉ vẽ ở mặt trước có ghi tên
      if (!traiDuoi || la0) duong(g, m.trungDoan[0], m.trungDoan[1], '--b', la0 ? 3 : 2, { 'stroke-dasharray': la0 ? null : '6 4' });
    });
    // Đường cắt: nửa trái và nửa phải của mặt 0 tách nhau theo trung đoạn
    var L = k.manh[0], P = k.manh[1];
    if (k.cat > 0.01 && L.di < 0.05) duong(svg, L.dinh[1], L.dinh[2], '--sai', 2.5, { 'stroke-dasharray': '7 5', opacity: k.cat });
    // Đường cao, khi cần
    if (k.ba > 0.01 && (o.hienH || tt === 'soiSOM')) {
      var gh = C.mk('g', { opacity: k.ba }, svg);
      if (tt === 'soiSOM') {
        daGiac(gh, [k.S, k.O, k.M0], { fill: TIM, 'fill-opacity': 0.18, stroke: 'none' });
        duong(gh, k.O, k.M0, '--muc', 1.5, { 'stroke-dasharray': '5 4' });
        gocVuong(gh, k.O, k.M0, k.S, co * 0.45);
        nhanDoan(gh, k.O, k.M0, k.S, ten(o, 'r', ''), co * 0.85, '--muc');
      }
      duong(gh, k.S, k.O, TIM, 2.5, { 'stroke-dasharray': '6 4' });
      nhanDoan(gh, k.S, k.O, k.M0, tH, co * 0.9, TIM);
    }
    // Tên đoạn lúc đầu (hình chóp, rồi lưới trải phẳng): cạnh đáy và trung đoạn của mặt 0
    var nhanDau = k.dau * (tt === 'soiSAM' ? 0 : 1);
    if (nhanDau > 0.01) {
      var gd = C.mk('g', { opacity: nhanDau }, svg);
      nhanDoan(gd, L.dinh[0], P.dinh[1], L.dinh[2], tA, co, '--cc');
      nhanDoan(gd, L.dinh[1], L.dinh[2], L.dinh[0], tD, co, '--b');
      if (tL && k.ba > 0.01) nhanDoan(gd, L.dinh[2], L.dinh[0], L.dinh[1], tL, co * 0.9, '--a', { opacity: k.ba });
    }
    // Soi tam giác vuông: cạnh bên là cạnh huyền, trung đoạn và nửa cạnh đáy là hai cạnh góc vuông
    if (tt === 'soiSAM') {
      daGiac(svg, L.dinh, { fill: 'var(--a)', 'fill-opacity': 0.22, stroke: 'none' });
      duong(svg, L.dinh[2], L.dinh[0], '--a', 3.5);
      duong(svg, L.dinh[0], L.dinh[1], '--cc', 3.5);
      duong(svg, L.dinh[1], L.dinh[2], '--b', 3.5);
      gocVuong(svg, L.dinh[1], L.dinh[0], L.dinh[2], co * 0.45);
      nhanDoan(svg, L.dinh[2], L.dinh[0], L.dinh[1], tL || 'cạnh bên', co * 0.9, '--a');
      nhanDoan(svg, L.dinh[0], L.dinh[1], L.dinh[2], ten(o, 'nua', tA + '/2'), co * 0.85, '--cc');
      nhanDoan(svg, L.dinh[1], L.dinh[2], L.dinh[0], tD, co * 0.9, '--b');
    }
    // Hình chữ nhật cuối: dài p, cao d
    if (k.cuoi > 0.01) {
      var gc = C.mk('g', { opacity: k.cuoi }, svg), cn = k.chuNhat;
      daGiac(gc, cn, { fill: 'none', stroke: 'var(--muc)', 'stroke-width': 3 });
      if (tt !== 'soiSAM') nhanDoan(gc, cn[1], cn[2], [0, 0], tD, co, '--b');
      chuMau(gc, 0, cn[2][1] + co * 0.95, tP, co, '--cc', { 'font-style': 'italic' });
      var dong = giai && o.ketQua ? o.ketQua : o.dong || 'Sxq = ' + tP + ' · ' + tD;
      if (tt === 'motMat') dong = 'Một mặt bên chỉ là ' + (o.motMatChu || tA + '·' + tD + '/2');
      if (tt === 'caChuVi') {
        var x1 = cn[0][0] + 2 * k.p;
        daGiac(gc, [cn[0], [x1, cn[0][1]], [x1, cn[2][1]], cn[3]], { fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
        dong = 'Dài cả chu vi thì gấp đôi các mặt bên';
      }
      chuMau(gc, kh.x0 + kh.rong / 2, kh.day + co * 1.3, dong, co * (dong.length > 26 ? 0.75 : 0.95), tt === 'caChuVi' || tt === 'motMat' ? '--sai' : '--muc');
    }
  };

  C.lay('doNuoc').ve = function (svg, k, p, t, o) {
    var giai = p.trangThai === 'giai', tt = p.trangThai, b = k.khung;
    var kh = datKhung(svg, { x0: b.x0, y0: b.y0 - (b.x1 - b.x0) * 0.08, x1: b.x1, y1: b.y1 }, o.ghiDay ? 3.2 : 2.6), co = kh.co;
    var L = k.lang, Cc = k.coc, n = k.n, xy = function (q) { return [q[0], q[1]]; };
    var tA = ten(o, 'a', 'a'), tH = ten(o, 'h', 'h');
    // Nước trong lăng trụ: các mặt đứng phía trước và mặt nước
    if (k.zLang > 1e-6) {
      for (var i = 0; i < n; i++) if (k.truocLang[i]) daGiac(svg, [L.day[i], L.day[(i + 1) % n], L.nuocTren[(i + 1) % n], L.nuocTren[i]].map(xy), { fill: 'var(--b)', 'fill-opacity': 0.28, stroke: 'none' });
      daGiac(svg, L.nuocTren.map(xy), { fill: 'var(--b)', 'fill-opacity': 0.4, stroke: 'var(--b)', 'stroke-width': 1.2 });
    }
    // Vỏ lăng trụ: mép trên luôn thấy; cạnh khuất vẽ đứt
    var sai = tt === 'quen13' && k.cuoi > 0.5;
    var vien = sai ? '--sai' : '--muc';
    for (var j = 0; j < n; j++) {
      var j2 = (j + 1) % n, an = !k.truocLang[j], anDung = !k.truocLang[j] && !k.truocLang[(j - 1 + n) % n];
      duong(svg, xy(L.day[j]), xy(L.day[j2]), vien, an ? 1.2 : 2, { 'stroke-dasharray': an ? '5 4' : null });
      duong(svg, xy(L.tren[j]), xy(L.tren[j2]), vien, 2);
      duong(svg, xy(L.day[j]), xy(L.tren[j]), vien, anDung ? 1.2 : 2, { 'stroke-dasharray': anDung ? '5 4' : null });
    }
    // Vạch mỗi lần đổ: một phần ba chiều cao
    var vach = function (m) {
      var z = m / 3, ds = L.day.map(function (q, i) { return [q[0] + (L.tren[i][0] - q[0]) * z, q[1] + (L.tren[i][1] - q[1]) * z]; });
      return ds;
    };
    for (var m = 1; m <= Math.min(k.nuoc.xong, 3); m++) {
      var vd = vach(m);
      daGiac(svg, vd, { fill: 'none', stroke: 'var(--b)', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      var tr = vd.reduce(function (s, q) { return q[0] > s[0] ? q : s; });
      chuMau(svg, tr[0] + co * 0.5, tr[1], String(m), co * 0.75, '--b');
    }
    // Cốc hình chóp (đỉnh ở dưới): nước là một hình chóp nhỏ, rồi vỏ cốc
    if (k.zCoc > 1e-6) {
      for (var i2 = 0; i2 < n; i2++) if (k.truocCoc[i2]) daGiac(svg, [xy(Cc.dinh), xy(Cc.nuoc[i2]), xy(Cc.nuoc[(i2 + 1) % n])], { fill: 'var(--b)', 'fill-opacity': 0.28, stroke: 'none' });
      daGiac(svg, Cc.nuoc.map(xy), { fill: 'var(--b)', 'fill-opacity': 0.4, stroke: 'var(--b)', 'stroke-width': 1.2 });
    }
    for (var c = 0; c < n; c++) {
      var anC = !k.truocCoc[c] && !k.truocCoc[(c - 1 + n) % n];
      duong(svg, xy(Cc.mieng[c]), xy(Cc.mieng[(c + 1) % n]), '--muc', 2);
      duong(svg, xy(Cc.dinh), xy(Cc.mieng[c]), '--muc', anC ? 1.2 : 2, { 'stroke-dasharray': anC ? '5 4' : null });
    }
    // Dòng nước đang đổ: từ miệng cốc sang miệng lăng trụ
    if (k.nuoc.dangDo >= 0) {
      var tu = Cc.mieng.reduce(function (s, q) { return q[0] < s[0] ? q : s; }), den = k.tamTrenLang, dinhCong = Math.min(tu[1], den[1]) - co * 1.4;
      C.mk('path', Object.assign({ d: 'M' + tu[0] + ' ' + tu[1] + ' Q ' + (tu[0] + den[0]) / 2 + ' ' + dinhCong + ' ' + den[0] + ' ' + den[1], fill: 'none', stroke: 'var(--b)', 'stroke-width': 3, 'stroke-dasharray': '2 5' }, NET), svg);
    }
    // Hai hình cùng đáy a, cùng chiều cao h
    var tLang = tam(L.day.map(xy)), tCoc = tam(Cc.mieng.map(xy));
    var iT = 0;
    for (var q = 0; q < n; q++) if (k.truocLang[q] && L.day[q][1] + L.day[(q + 1) % n][1] > L.day[iT][1] + L.day[(iT + 1) % n][1]) iT = q;
    if (tA) {
      nhanDoan(svg, xy(L.day[iT]), xy(L.day[(iT + 1) % n]), tLang, tA, co * 0.9, '--cc');
    }
    var trai = L.day.reduce(function (s, q, i) { return q[0] < L.day[s][0] ? i : s; }, 0);
    nhanDoan(svg, xy(L.day[trai]), xy(L.tren[trai]), tLang, tH, co * 0.9, TIM);
    duong(svg, xy(Cc.dinh), xy(k.tamMieng), TIM, 2, { 'stroke-dasharray': '6 4' });
    var phaiCoc = Cc.mieng.reduce(function (s, q) { return Math.max(s, q[0]); }, -Infinity);
    chuMau(svg, phaiCoc + co * 0.7, (Cc.dinh[1] + k.tamMieng[1]) / 2, tH, co * 0.9, TIM, { 'font-style': 'italic' });
    if (tt === 'trungDoan') {
      var gm = k.giuaMieng[iT];
      duong(svg, xy(Cc.dinh), xy(gm), '--b', 3);
      nhanDoan(svg, xy(Cc.dinh), xy(gm), k.tamMieng, ten(o, 'd', 'd'), co * 0.9, '--b');
    }
    // Dòng chữ dưới hình
    var dong = k.nuoc.xong >= 3 ? '3 lần cốc chóp = 1 ' + (o.tenLang || 'lăng trụ') : k.nuoc.xong > 0 || k.nuoc.dangDo >= 0 ? 'Đổ lần ' + Math.min(3, k.nuoc.xong + (k.nuoc.dangDo >= 0 ? 1 : 0)) : 'Cùng đáy, cùng chiều cao';
    var mau = '--muc';
    if (tt === 'quen13' && k.cuoi > 0.5) { dong = 'S·h là cả ' + (o.tenLang || 'lăng trụ') + ', gấp 3 hình chóp'; mau = '--sai'; }
    if (tt === 'trungDoan') { dong = 'Chiều cao đo thẳng đứng, không theo mặt bên'; mau = '--sai'; }
    if (giai && o.ketQua) dong = o.ketQua;
    chuMau(svg, kh.x0 + kh.rong / 2, kh.day + co * (o.ghiDay ? 1.8 : 1.2), dong, co * (dong.length > 28 ? 0.72 : 0.9), mau);
    if (o.ghiDay) chuMau(svg, tLang[0], kh.day + co * 0.05, o.ghiDay, co * 0.75, '--cc');
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
