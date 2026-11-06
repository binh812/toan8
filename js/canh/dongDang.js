// Cảnh chương IX: tam giác đồng dạng, hình đồng dạng.
// Mọi cảnh dựng trên một lõi chung: các hình cố định, và các bản sao di chuyển (lật, quay, trượt, phóng) cho tới khi trùng khít hình đích.
// tinh chỉ tính toạ độ và danh sách nét theo hệ trục toán (y hướng lên); ve chỉ vẽ.
(function (C) {
  'use strict';
  var EPS = 1e-9, RAD = Math.PI / 180;

  /* ---------- Hình học phẳng ---------- */
  function cong(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function tru(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function nhan(a, k) { return [a[0] * k, a[1] * k]; }
  function tichVo(a, b) { return a[0] * b[1] - a[1] * b[0]; }
  function tichVh(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function dai(a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1]); }
  function kc(a, b) { return dai(tru(a, b)); }
  function donVi(a) { var l = dai(a); return l < EPS ? [1, 0] : [a[0] / l, a[1] / l]; }
  function quay(p, o, g) { var c = Math.cos(g), s = Math.sin(g), v = tru(p, o); return [o[0] + v[0] * c - v[1] * s, o[1] + v[0] * s + v[1] * c]; }
  function phong(p, o, k) { return cong(o, nhan(tru(p, o), k)); }
  // Lật dần qua đường thẳng đi qua o theo hướng d (đơn vị): s = 1 là phép đối xứng trục
  function lat(p, o, d, s) {
    var v = tru(p, o), n = [-d[1], d[0]];
    return cong(o, cong(nhan(d, tichVh(v, d)), nhan(n, (1 - 2 * s) * tichVh(v, n))));
  }
  function trongTam(d) { var x = 0, y = 0; d.forEach(function (q) { x += q[0] / d.length; y += q[1] / d.length; }); return [x, y]; }
  function dtCoDau(d) { var s = 0; d.forEach(function (q, i) { s += tichVo(q, d[(i + 1) % d.length]); }); return s / 2; }
  function goc(a, o, b) { var u = tru(a, o), v = tru(b, o); return Math.acos(C.kep(tichVh(u, v) / (dai(u) * dai(v)), -1, 1)) / RAD; }
  function bien(ds) {
    var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    ds.forEach(function (q) { b.x0 = Math.min(b.x0, q[0]); b.y0 = Math.min(b.y0, q[1]); b.x1 = Math.max(b.x1, q[0]); b.y1 = Math.max(b.y1, q[1]); });
    return b;
  }
  // Tam giác từ ba cạnh [d01, d12, d20]: đỉnh 1 ở gốc, đỉnh 2 trên trục hoành, đỉnh 0 ở trên
  function tuCanh(c) {
    var x = (c[0] * c[0] - c[2] * c[2] + c[1] * c[1]) / (2 * c[1]);
    return [[x, Math.sqrt(Math.max(0, c[0] * c[0] - x * x))], [0, 0], [c[1], 0]];
  }
  // Tam giác từ hai góc ở đáy (độ) tại đỉnh 1, đỉnh 2 và độ dài đáy
  function tuGoc(g, day) {
    var g1 = g[1] * RAD, g2 = g[2] * RAD, l = day * Math.sin(g2) / Math.sin(g1 + g2);
    return [[l * Math.cos(g1), l * Math.sin(g1)], [0, 0], [day, 0]];
  }
  function hienRa(t, w) { return w ? C.muot((t - w[0]) / Math.max(EPS, w[1] - w[0])) : 1; }
  function doMo(t, x) { return x ? (x.hien ? hienRa(t, x.hien) : 1) * (x.mat ? 1 - hienRa(t, x.mat) : 1) : 1; }

  function dungDiem(h, ds, rong) {
    var d;
    if (h.diem) d = h.diem.map(function (q) { return q.slice(); });
    else if (h.dai) d = tuCanh(h.dai);
    else if (h.goc3) d = tuGoc(h.goc3, h.day || 1);
    else throw new Error('dongDang: hình thiếu diem, dai hoặc goc3');
    var dt = h.dat || {}, g = trongTam(d);
    if (dt.lat) d = d.map(function (q) { return [2 * g[0] - q[0], q[1]]; });
    if (dt.quay) d = d.map(function (q) { return quay(q, g, dt.quay * RAD); });
    var dx = dt.x || 0, dy = dt.y || 0;
    if (dt.sau != null) {
      var b = bien(ds[dt.sau]), m = bien(d);
      dx += b.x1 + (dt.cach != null ? dt.cach : Math.max((rong ? 0.55 : 0.375) * (b.x1 - b.x0 + m.x1 - m.x0), 0.3 * Math.max(b.y1 - b.y0, m.y1 - m.y0))) - m.x0; dy += b.y0 - m.y0;
    }
    return d.map(function (q) { return [q[0] + dx, q[1] + dy]; });
  }

  /* ---------- Đưa một hình tới trùng hình kia ---------- */
  // Thứ tự: lật (nếu ngược chiều) hoặc quay quanh đỉnh neo cho một cạnh cùng hướng, trượt đỉnh neo tới chỗ mới, rồi phóng từ đỉnh neo.
  function keHoach(S, T, m) {
    if (m.tam) return [{ loai: 'phong', o: m.tam, k: m.k }];
    var n = m.neo != null ? m.neo : (S.length > 2 ? 1 : 0), j = (n + 1) % S.length, kh = [];
    var u = donVi(tru(S[j], S[n])), w = donVi(tru(T[j], T[n]));
    var hs = S.length > 2 ? dtCoDau(S) : 0, ht = T.length > 2 ? dtCoDau(T) : 0;
    if (hs * ht < 0) {
      var tong = cong(u, w);
      kh.push({ loai: 'lat', o: S[n], d: dai(tong) < 1e-6 ? [-u[1], u[0]] : donVi(tong) });
    } else {
      var g = Math.atan2(tichVo(u, w), tichVh(u, w));
      if (Math.abs(g) > 1e-6) kh.push({ loai: 'quay', o: S[n], g: g });
    }
    var v = tru(T[n], S[n]);
    if (dai(v) > EPS) kh.push({ loai: 'doi', v: v });
    var k = kc(T[j], T[n]) / kc(S[j], S[n]);
    if (Math.abs(k - 1) > EPS) kh.push({ loai: 'phong', o: T[n], k: k });
    return kh;
  }
  function apDung(p, b, s) {
    if (b.loai === 'lat') return lat(p, b.o, b.d, s);
    if (b.loai === 'quay') return quay(p, b.o, b.g * s);
    if (b.loai === 'doi') return cong(p, nhan(b.v, s));
    return phong(p, b.o, 1 + (b.k - 1) * s);
  }
  // s ∈ [0, 1] là tiến độ cả quá trình; mỗi bước một khoảng bằng nhau
  function viTri(S, kh, s) {
    var n = kh.length, d = S, dang = null;
    kh.forEach(function (b, i) {
      var si = C.kep(s * n - i, 0, 1);
      if (si > 0) { d = d.map(function (q) { return apDung(q, b, C.muot(si)); }); if (si < 1) dang = b; }
    });
    return { diem: d, dang: dang };
  }
  function tenBuoc(b) {
    if (!b) return '';
    if (b.loai === 'lat') return 'Lật';
    if (b.loai === 'quay') return 'Quay';
    if (b.loai === 'doi') return 'Trượt';
    return (b.k > 1 ? 'Phóng to, k ' : 'Thu nhỏ, k ') + (gan(b.k * 100, Math.round(b.k * 100)) ? '= ' : '≈ ') + C.fmt(b.k);
  }

  /* ---------- Lõi: từ mô tả tới danh sách nét ---------- */
  function nhanChu(x, p, t) {
    if (x == null) return null;
    if (typeof x !== 'object') return { s: String(x), op: 1 };
    return { s: x.an && p.trangThai !== 'giai' ? (x.anChu || '?') : String(x.s), op: doMo(t, x), mau: x.mau, lech: x.lech };
  }
  function veHinh(net, d, h, p, t, co, mo, mauVien, moTen) {
    var kin = h.kin !== false && d.length > 2, g = trongTam(d), op = mo * doMo(t, h);
    if (h.to && d.length > 2) net.push({ k: 'da', d: d, to: h.to, mo: h.mo != null ? h.mo : 0.18, op: op * doMo(t, h.toHien), soi: h.soi });
    net.push({ k: kin ? 'da' : 'duong', d: d, vien: mauVien || h.mau || '--muc', net: h.net, day: h.day, op: op, soi: h.soi });
    var ngoai = [], dt2 = d.length > 2 ? Math.abs(dtCoDau(d)) * 2 : 0;
    (h.goc || []).forEach(function (x, i) {
      if (!x || d.length < 3) return;
      var o = typeof x === 'object' ? x : { mau: x === 'v' ? '--muc' : x, vuong: x === 'v' };
      var P = d[(i + d.length - 1) % d.length], Q = d[(i + 1) % d.length];
      net.push({ k: 'goc', o: d[i], a: P, b: Q, mau: o.mau || '--muc', vuong: o.vuong, r: co * (o.r || 1.1), op: op * doMo(t, o), soi: o.soi });
      var nh = nhanChu(o.nhan, p, t);
      if (!nh) return;
      var ph = donVi(cong(donVi(tru(P, d[i])), donVi(tru(Q, d[i])))), xa = co * (o.xa || 2.3);
      // Ghi số đo bên trong góc chỉ khi đủ chỗ: góc đủ mở và tam giác đủ cao. Không thì ghi ra ngoài đỉnh, đẩy tên đỉnh ra xa hơn
      var nua = goc(P, d[i], Q) * RAD / 2, cao = dt2 / kc(P, Q), chuVi = d.reduce(function (a, q, j) { return a + kc(q, d[(j + 1) % d.length]); }, 0);
      var duCho = 2 * xa * Math.tan(nua) >= 1.7 * co && cao >= xa + 0.7 * co && dt2 / chuVi >= 1.25 * co;
      if (!duCho) ngoai[i] = true;
      net.push({ k: 'chu', p: cong(d[i], nhan(ph, duCho ? xa : -1.15 * co)), s: nh.s, co: co * 0.85, mau: o.mau, op: op * nh.op * doMo(t, o) });
    });
    (h.canh || []).forEach(function (x, i) {
      var nh = nhanChu(x, p, t);
      if (!nh || (!kin && i >= d.length - 1)) return;
      var a = d[i], b = d[(i + 1) % d.length], m = nhan(cong(a, b), 0.5), n = donVi([a[1] - b[1], b[0] - a[0]]);
      if (tichVh(n, tru(m, g)) < 0) n = nhan(n, -1);
      net.push({ k: 'chu', p: cong(m, nhan(n, co * (nh.lech || 0.85))), s: nh.s, co: co * 0.95, mau: nh.mau, op: op * nh.op });
    });
    (h.ten || []).forEach(function (s, i) {
      if (!s) return;
      var huong = d.length > 2 ? donVi(tru(d[i], g)) : [0, 1], lech = (h.lechTen && h.lechTen[i]) || [0, 0];
      net.push({ k: 'chu', p: cong(cong(d[i], nhan(huong, co * (ngoai[i] ? 2.3 : 0.95))), nhan(lech, co)), s: s, co: co, mau: mauVien || h.mauTen, op: op * (moTen == null ? 1 : moTen), nghieng: true });
    });
  }
  function moTaChu(x) { return typeof x === 'object' ? x : { s: x }; }

  // o: { hinh: [...], di: [{ tu, toi, neo, tam, k, mau, khung }], them: [...], loiCuoi: [...], co }
  function lo(o, p, t) {
    var ds = [], net = [], diem = [];
    var coSoGoc = (o.hinh || []).some(function (h) { return (h.goc || []).some(function (g) { return g && typeof g === 'object' && g.nhan; }); });
    (o.hinh || []).forEach(function (h) { var d = dungDiem(h, ds, coSoGoc); ds.push(d); if (!h.khongTinh) diem = diem.concat(d); });
    var soDi = (o.di || []).length;
    var di = (o.di || []).map(function (m, i) {
      var S = ds[m.tu], T = m.tam ? S.map(function (q) { return phong(q, m.tam, m.k); }) : (typeof m.toi === 'number' ? ds[m.toi] : m.toi);
      var kh = keHoach(S, T, m), w = m.khung || [0.1 + 0.84 * i / soDi, 0.1 + 0.84 * (i + 1) / soDi - (soDi > 1 ? 0.04 : 0)];
      for (var k = 0; k <= kh.length; k++) diem = diem.concat(viTri(S, kh, k / Math.max(1, kh.length)).diem);
      var vt = viTri(S, kh, C.kep((t - w[0]) / (w[1] - w[0]), 0, 1));
      return { S: S, T: T, kh: kh, w: w, m: m, diem: vt.diem, dang: vt.dang, khop: S.length === T.length && vt.diem.every(function (q, j) { return kc(q, T[j]) < 1e-6; }) };
    });
    (o.them || []).forEach(function (x) { ['a', 'b', 'p'].forEach(function (k) { if (x[k] && !x.khongTinh) diem.push(x[k]); }); if (x.d && !x.khongTinh) diem = diem.concat(x.d); });
    // Hình có ghi số đo góc thì chừa lề rộng hơn, vì số đo có thể phải ghi ra ngoài đỉnh
    var le = coSoGoc ? 3 : 1.6, b = bien(diem), L = Math.max(b.x1 - b.x0, b.y1 - b.y0, EPS), co = L / (16 - 2 * le) * (o.co || 1), pad = le * co;
    var dong = (o.loiCuoi || []).map(moTaChu), soDong = Math.max(dong.length, soDi && o.chuBuoc !== false ? 1 : 0);
    var x0 = b.x0 - 1.4 * pad, x1 = b.x1 + 1.4 * pad, yTren = b.y1 + pad, yDuoi = b.y0 - pad - soDong * 1.3 * co;
    // Hình cố định, nét thêm, rồi tới các bản sao đang di chuyển (vẽ sau cùng để nằm trên)
    (o.hinh || []).forEach(function (h, i) { veHinh(net, ds[i], h, p, t, co, 1); });
    (o.them || []).forEach(function (x) {
      var op = doMo(t, x);
      if (x.k === 'chu') { var nh = nhanChu(x.s != null && typeof x.s === 'object' ? x.s : { s: x.s }, p, t); net.push({ k: 'chu', p: x.p, s: nh.s, co: co * (x.co || 0.95), mau: x.mau, op: op * nh.op, nghieng: x.nghieng }); }
      else net.push(Object.assign({}, x, { op: op, r: x.r != null ? x.r * co : co * 1.1 }));
    });
    di.forEach(function (x) {
      var h = o.hinh[x.m.tu], dangDi = t > x.w[0], cuoi = 1 - hienRa(t, [x.w[1] - 0.06, x.w[1]]);
      if (!dangDi && !x.m.hienTruoc) return;
      if (x.m.tia) x.S.forEach(function (q, j) { net.push({ k: 'doan', a: x.m.tam, b: kc(x.m.tam, x.T[j]) > kc(x.m.tam, q) ? x.T[j] : q, mau: '--nhat', net: true, day: 1.2, op: 1 }); });
      // Tên đỉnh của bản sao mờ dần khi tới nơi, để không chồng lên tên đỉnh của hình đích
      veHinh(net, x.diem, { goc: (h.goc || []).map(function (g) { return g && typeof g === 'object' ? Object.assign({}, g, { nhan: null }) : g; }), ten: dangDi ? h.ten : null, to: x.m.mau || '--a', mo: 0.28, kin: h.kin, day: h.day, soi: x.m.soi || h.soi }, p, t, co, dangDi ? 1 : 0.5, x.m.mau || '--a', cuoi);
    });
    // Dòng chữ dưới hình: tên bước đang làm, rồi các dòng kết quả
    var dangLam = di.filter(function (x) { return x.dang; })[0];
    if (dangLam && o.chuBuoc !== false) net.push({ k: 'chu', p: [(x0 + x1) / 2, b.y0 - pad - 0.55 * co], s: tenBuoc(dangLam.dang), co: co, mau: dangLam.m.mau || '--a', op: 1 });
    dong.forEach(function (x, i) {
      var nh = nhanChu(x, p, t);
      net.push({ k: 'chu', p: [(x0 + x1) / 2, b.y0 - pad - (0.55 + 1.3 * i) * co], s: nh.s, co: co * (x.co || 1), mau: x.mau, op: (dangLam && i === 0 && o.chuBuoc !== false ? 0 : 1) * doMo(t, x.hien ? x : { hien: [0.9, 1] }) * nh.op });
    });
    return { khung: [x0, yDuoi, x1 - x0, yTren - yDuoi], co: co, net: net, ds: ds, di: di };
  }

  /* ---------- Các cảnh ---------- */
  function gan(x, y) { return Math.abs(x - y) < 1e-9; }
  // Tam giác ABC có đáy BC nằm ngang, đỉnh A ở trên, từ ba cạnh
  function tamGiacABC(o) {
    var ab = o.ab || 5, ac = o.ac || 6, bc = o.bc || 7, x = (ab * ab - ac * ac + bc * bc) / (2 * bc);
    return { A: [x, Math.sqrt(Math.max(0, ab * ab - x * x))], B: [0, 0], C: [bc, 0] };
  }
  function lay(n, k) { return n && Object.prototype.hasOwnProperty.call(n, k) ? n[k] : null; }

  // MN song song BC: tam giác AMN là tam giác ABC thu nhỏ từ A
  function songSong(p, t, o) {
    var T = tamGiacABC(o), A = T.A, B = T.B, Cc = T.C, n = o.nhan || {}, ch = o.cheDo || 'chungMinh';
    var k = o.am != null ? o.am / (o.ab || 5) : C.kep(p.k, 0.05, 0.95), M = phong(B, A, k), N = phong(Cc, A, k);
    if (ch === 'dem') return demTamGiac(p, t, o, T);
    // Thử phá (chỉ ở chế độ chứng minh): MN quay lệch khỏi phương BC quanh M, N trượt theo trên đường AC
    var lech = ch === 'chungMinh' && typeof p.lech === 'number' ? p.lech : 0, hong = Math.abs(lech) > EPS, N0 = N, u = k;
    if (hong) {
      var dh = quay(tru(Cc, B), [0, 0], lech * RAD);
      u = tichVo(tru(M, A), dh) / tichVo(tru(Cc, A), dh);
      N = cong(A, nhan(tru(Cc, A), u));
    }
    var canhAB = n.AB != null ? [n.AB] : [n.AM, n.MB], canhAC = n.AC != null ? [n.AC] : [n.AN, n.NC];
    var mauM = hong ? '--sai' : '--a', mauN = hong ? '--sai' : '--b';
    var hinh = [
      { diem: [A, B, Cc], ten: ['A', 'B', 'C'], goc: ch === 'chungMinh' ? [{ mau: '--nhat', hien: [0.1, 0.25], soi: 'gocA' }, { mau: '--a', hien: [0.1, 0.25], soi: 'gocM' }, { mau: '--b', hien: [0.1, 0.25], soi: 'gocN' }] : null, canh: [canhAB.length === 1 ? canhAB[0] : null, n.BC, canhAC.length === 1 ? canhAC[0] : null] },
      { diem: [A, M, N], ten: [null, 'M', 'N'], lechTen: [null, [0.75, -0.7], [-0.75, -0.7]], to: '--cc', mo: 0.16, mau: '--cc', day: 1.6, soi: ch === 'chungMinh' ? 'AMN' : null, goc: ch === 'chungMinh' ? [null, { mau: mauM, hien: [0.1, 0.25], soi: 'gocM' }, { mau: mauN, hien: [0.1, 0.25], soi: 'gocN' }] : null },
      { diem: [M, N], kin: false, mau: hong ? '--sai' : '--cc', day: 3.5, canh: [lay(n, 'MN')], soi: ch === 'chungMinh' ? 'MN' : null }
    ];
    var them = [];
    if (canhAB.length === 2) { them.push(chuCanh(A, M, A, B, Cc, canhAB[0])); them.push(chuCanh(M, B, A, B, Cc, canhAB[1])); }
    if (canhAC.length === 2) { them.push(chuCanh(A, N, A, B, Cc, canhAC[0])); them.push(chuCanh(N, Cc, A, B, Cc, canhAC[1])); }
    them = them.filter(Boolean);
    var kq = { hinh: hinh, them: them, loiCuoi: o.loiCuoi, di: [], chiTiet: { k: k, u: u, A: A, B: B, C: Cc, M: M, N: N, lech: lech, hong: hong } };
    if (hong) {
      // Đoạn song song thật (nét đứt) để so: MN lệch không còn trùng nó, ba tỉ số lệch nhau
      them.push({ k: 'doan', a: M, b: N0, mau: '--nhat', net: true, day: 1.6 });
      kq.loiCuoi = [{ s: 'AM : AB = ' + C.fmt(k), hien: [-1, -0.5] }, { s: 'AN : AC ≈ ' + C.fmt(u) + ';  MN : BC ≈ ' + C.fmt(kc(M, N) / kc(B, Cc)), mau: '--sai', hien: [-1, -0.5] }];
      kq.chuBuoc = false;
    } else if (ch === 'chungMinh') {
      var P = phong(Cc, B, k);
      them.push({ k: 'da', d: [M, N, P, B], to: '--cc', mo: 0.12, hien: [0.55, 0.65], soi: 'MNPB' });
      them.push({ k: 'doan', a: N, b: P, mau: '--nhat', net: true, day: 1.6, hien: [0.55, 0.62] });
      them.push({ k: 'chu', p: cong(P, [0, -0.07 * kc(B, Cc)]), s: 'P', mau: '--cc', hien: [0.55, 0.62], nghieng: true });
      kq.di = [{ tu: 2, toi: [B, P], neo: 0, mau: '--cc', khung: [0.62, 0.86] }];
      kq.loiCuoi = [{ s: 'AM : AB = AN : AC = ' + C.fmt(k), hien: [0.35, 0.45] }, { s: 'MN : BC = BP : BC = ' + C.fmt(k), hien: [0.88, 0.96] }];
      kq.chuBuoc = false;
    } else {
      kq.di = [{ tu: 1, toi: 0, neo: 0, mau: '--cc', khung: [0.15, 0.85] }];
    }
    if (typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0) {
      // Vẽ đoạn đỏ dài đúng như em gõ, dừng ở mép hình nếu quá dài
      var huong = donVi(tru(Cc, B)), l = Math.min(p.thu, Cc[0] - M[0] + 0.12 * kc(B, Cc)), E = cong(M, nhan(huong, l));
      them.push({ k: 'doan', a: M, b: E, mau: '--sai', day: 3, net: true, khongTinh: true });
      kq.loiCuoi = (kq.loiCuoi || []).concat([{ s: 'x = ' + C.fmt(p.thu), mau: '--sai', hien: [-1, -0.5] }]);
    }
    return kq;
  }
  // Chữ cho một phần của cạnh (AM, MB…), đặt ra phía ngoài tam giác ABC
  function chuCanh(P, Q, A, B, Cc, x) {
    if (x == null) return null;
    var g = trongTam([A, B, Cc]), m = nhan(cong(P, Q), 0.5), n = donVi([P[1] - Q[1], Q[0] - P[0]]);
    if (tichVh(n, tru(m, g)) < 0) n = nhan(n, -1);
    return { k: 'chu', p: cong(m, nhan(n, 0.075 * Math.max(kc(A, B), kc(B, Cc), kc(A, Cc)))), s: x };
  }
  // Ba tam giác lồng nhau chung đỉnh A, lần lượt sáng lên
  function demTamGiac(p, t, o, T) {
    var A = T.A, cat = o.cat || [0.25, 0.5], ten = o.tenCat || [['P', 'Q'], ['M', 'N']], mau = ['--a', '--b', '--cc'];
    var hinh = [{ diem: [A, T.B, T.C], ten: ['A', 'B', 'C'], to: mau[2], mo: 0.14, toHien: [0.6, 0.8] }];
    cat.forEach(function (k, i) {
      var d = [A, phong(T.B, A, k), phong(T.C, A, k)];
      hinh.push({ diem: d, ten: [null].concat(ten[i]), to: mau[i], mo: 0.22, toHien: [0.1 + 0.25 * i, 0.3 + 0.25 * i], mau: mau[i], day: 1.6, mauTen: mau[i] });
    });
    return { hinh: hinh, loiCuoi: o.loiCuoi };
  }
  function soDo(x) { return C.fmt(x).replace(',', '{,}'); }
  // Số đo kèm dấu: "= 3" nếu đúng tới hai chữ số thập phân, "≈ 3,46" nếu đã làm tròn
  function bs(x) { return (Math.abs(x * 100 - Math.round(x * 100)) < 1e-6 ? '= ' : '\\approx ') + soDo(x); }
  function phaSongSong(ct) {
    var gM = goc(ct.A, ct.M, ct.N), gB = goc(ct.A, ct.B, ct.C), mn = kc(ct.M, ct.N) / kc(ct.B, ct.C);
    if (!ct.hong) return { hong: false, chu: '$MN \\parallel BC$: $\\widehat{AMN} = \\widehat{ABC}$ và $\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC} = ' + soDo(ct.k) + '$.' };
    return { hong: true, lech: ct.lech, gocM: gM, gocB: gB, tiAN: ct.u, tiMN: mn,
      chu: '$MN$ lệch $' + Math.abs(ct.lech) + '^\\circ$ khỏi phương $BC$: $\\widehat{AMN} ' + bs(gM) + '^\\circ$ còn $\\widehat{ABC} ' + bs(gB) + '^\\circ$, không còn là cặp góc đồng vị bằng nhau. Ba tỉ số lệch nhau: $\\frac{AM}{AB} = ' + soDo(ct.k) + '$, $\\frac{AN}{AC} ' + bs(ct.u) + '$, $\\frac{MN}{BC} ' + bs(mn) + '$. Tam giác $AMN$ không còn là tam giác $ABC$ thu nhỏ.' };
  }
  C.dangKi('songSong', {
    thamSo: { k: { min: 0.2, max: 0.8, step: 0.05, md: 0.6, nhan: 'AM : AB', mau: '--cc' },
      // Chỉ quay MN lên phía A, để N luôn nằm trên đoạn AC
      lech: { min: 0, max: 20, step: 5, md: 0, nhan: 'MN lệch (độ)', pha: true } },
    tinh: function (p, t, o) {
      var mo = songSong(p, t, o || {}), kq = lo(mo, p, t);
      if (mo.chiTiet) { kq.chiTiet = mo.chiTiet; if (!(o && o.cheDo) || o.cheDo === 'chungMinh') kq.pha = phaSongSong(mo.chiTiet); }
      return kq;
    }
  });
  // Soi chi tiết: chỉ bật khi nội dung xin (tuyChon.chiTiet), để hình trong đề không lộ số đo cần tìm
  C.lay('songSong').soi = function (k, p, o) {
    var ct = k.chiTiet;
    if (!o.chiTiet || !ct) return {};
    var A = ct.A, B = ct.B, Cc = ct.C, M = ct.M, N = ct.N, bc = kc(B, Cc), mn = kc(M, N);
    var gA = goc(B, A, Cc), gB = goc(A, B, Cc), gC = goc(A, Cc, B), gM = goc(A, M, N), gN = goc(A, N, M);
    var bang = {
      gocA: { tieuDe: 'Góc $A$', chu: '$\\widehat{A} ' + bs(gA) + '^\\circ$. Đây là góc chung của tam giác $AMN$ và tam giác $ABC$.' },
      gocM: { tieuDe: 'Góc $AMN$ và góc $ABC$', chu: ct.hong
        ? '$\\widehat{AMN} ' + bs(gM) + '^\\circ$ còn $\\widehat{ABC} ' + bs(gB) + '^\\circ$: không bằng nhau, vì $MN$ không song song với $BC$.'
        : '$\\widehat{AMN} = \\widehat{ABC} ' + bs(gB) + '^\\circ$: cặp góc đồng vị, vì $MN \\parallel BC$.' },
      gocN: { tieuDe: 'Góc $ANM$ và góc $ACB$', chu: ct.hong
        ? '$\\widehat{ANM} ' + bs(gN) + '^\\circ$ còn $\\widehat{ACB} ' + bs(gC) + '^\\circ$: không bằng nhau.'
        : '$\\widehat{ANM} = \\widehat{ACB} ' + bs(gC) + '^\\circ$: cặp góc đồng vị, vì $MN \\parallel BC$.' },
      AMN: { tieuDe: 'Tam giác $AMN$', chu: '$AM ' + bs(kc(A, M)) + '$, $AN ' + bs(kc(A, N)) + '$, $MN ' + bs(mn) + '$. ' + (ct.hong
        ? 'Các cạnh không cùng nhân một số với cạnh của $ABC$, nên nó không phải tam giác $ABC$ thu nhỏ.'
        : 'Mỗi cạnh bằng cạnh tương ứng của $ABC$ nhân $' + soDo(ct.k) + '$ (định lí Thalès và hình bình hành $MNPB$).') },
      MN: { tieuDe: 'Đoạn $MN$', chu: '$MN ' + bs(mn) + '$, $BC ' + bs(bc) + '$, $\\frac{MN}{BC} ' + bs(mn / bc) + '$. ' + (ct.hong
        ? 'Đoạn này không song song với $BC$ (nét đứt mới là đoạn song song).'
        : 'Kẻ $NP \\parallel AB$ thì $MNPB$ là hình bình hành, nên $MN = BP$.') }
    };
    if (!ct.hong) bang.MNPB = { tieuDe: 'Hình bình hành $MNPB$', chu: '$MN \\parallel BP$ (vì $MN \\parallel BC$) và $NP \\parallel MB$ (kẻ như thế), nên $MNPB$ là hình bình hành: $MN = BP = ' + soDo(mn) + '$.' };
    return bang;
  };

  // Hai góc bằng nhau: trượt tam giác nhỏ tới đỉnh B', phóng lên thì trùng khít tam giác lớn
  C.dangKi('ggTrung', {
    thamSo: {
      gB: { min: 30, max: 75, step: 5, md: 50, nhan: 'Góc B', mau: '--b' },
      gC: { min: 30, max: 75, step: 5, md: 65, nhan: 'Góc C', mau: '--cc' },
      k: { min: 1.2, max: 2.4, step: 0.1, md: 1.8, nhan: 'Tỉ số k', mau: '--a' },
      lechC: { min: -20, max: 20, step: 5, md: 0, nhan: "C' lệch (độ)", pha: true }
    },
    tinh: function (p, t) {
      var gB = p.gB, gC = Math.min(p.gC, 150 - gB), k = p.k, lech = typeof p.lechC === 'number' ? p.lechC : 0, hong = Math.abs(lech) > EPS;
      // Thử phá: góc C' của tam giác lớn khác góc C (giữ tam giác lớn có góc A' từ 10° trở lên)
      var gC1 = hong ? C.kep(gC + lech, 10, 170 - gB) : gC;
      var A0 = { mau: '--nhat', hien: [0.9, 1], soi: 'gocA' }, gocB = { mau: '--b', soi: 'gocB' };
      var S0 = tuGoc([0, gB, gC], 3), T0 = tuGoc([0, gB, gC1], 3 * k), tiA = kc(T0[0], T0[1]) / kc(S0[0], S0[1]);
      var kq = lo({
        hinh: [
          { goc3: [0, gB, gC], day: 3, ten: ['A', 'B', 'C'], goc: [A0, gocB, { mau: '--cc', soi: 'gocC' }], soi: 'nho' },
          { goc3: [0, gB, gC1], day: 3 * k, dat: { sau: 0 }, ten: ["A'", "B'", "C'"], goc: [A0, gocB, { mau: hong ? '--sai' : '--cc', soi: 'gocC' }], soi: 'lon' }
        ],
        di: [{ tu: 0, toi: 1, neo: 1, mau: '--a', khung: [0.1, 0.9] }],
        loiCuoi: [hong ? { s: "B'C' : BC = " + C.fmt(k) + ";  B'A' : BA ≈ " + C.fmt(tiA), mau: '--sai', hien: [0.9, 1] } : { s: 'Mọi cạnh nhân k = ' + C.fmt(k), hien: [0.9, 1] }]
      }, p, t);
      var S = kq.ds[0], T = kq.ds[1];
      kq.chiTiet = { gB: gB, gC: gC, gC1: gC1, k: k, tiA: tiA, tiCA: kc(T[2], T[0]) / kc(S[2], S[0]), hong: hong };
      if (hong) {
        // Phóng xong, đỉnh A của bản sao không tới A': nối hai điểm bằng đoạn đỏ
        var x = kq.di[0], cuoi = viTri(x.S, x.kh, 1).diem[0];
        kq.net.push({ k: 'doan', a: cuoi, b: T[0], mau: '--sai', net: true, day: 2.5, op: hienRa(t, [0.85, 0.95]) });
        kq.pha = { hong: true, gocC: gC, gocC1: gC1, tiBC: k, tiBA: tiA,
          chu: "Góc $C' = " + gC1 + "^\\circ$ khác góc $C = " + gC + "^\\circ$: sau khi trượt, $AC$ không song song với $A'C'$ nữa. $\\frac{B'C'}{BC} = " + soDo(k) + "$ nhưng $\\frac{B'A'}{BA} \\approx " + soDo(tiA) + "$, hai tỉ số khác nhau. Phóng tam giác nhỏ lên, đỉnh $A$ không tới $A'$ (đoạn đỏ): hai tam giác không đồng dạng." };
      } else {
        kq.pha = { hong: false, chu: "$\\widehat{B} = \\widehat{B'}$, $\\widehat{C} = \\widehat{C'}$: mọi cạnh của tam giác lớn bằng cạnh tương ứng nhân $k = " + soDo(k) + '$.' };
      }
      return kq;
    }
  });
  C.lay('ggTrung').soi = function (k, p, o) {
    var ct = k.chiTiet;
    if (!o.chiTiet || !ct) return {};
    var S = k.ds[0], T = k.ds[1], gA = 180 - ct.gB - ct.gC, gA1 = 180 - ct.gB - ct.gC1;
    return {
      gocB: { tieuDe: "Góc $B$ và góc $B'$", chu: "$\\widehat{B} = \\widehat{B'} = " + ct.gB + "^\\circ$ (giả thiết). Nhờ vậy, khi đặt $B$ lên $B'$ và $BC$ lên tia $B'C'$ thì tia $BA$ nằm trên tia $B'A'$." },
      gocC: { tieuDe: "Góc $C$ và góc $C'$", chu: ct.hong
        ? "$\\widehat{C} = " + ct.gC + "^\\circ$ còn $\\widehat{C'} = " + ct.gC1 + "^\\circ$: khác nhau, nên sau khi trượt $AC$ không song song với $A'C'$."
        : "$\\widehat{C} = \\widehat{C'} = " + ct.gC + "^\\circ$ (giả thiết). Sau khi trượt, đây là cặp góc đồng vị, nên $AC \\parallel A'C'$." },
      gocA: { tieuDe: "Góc $A$ và góc $A'$", chu: ct.hong
        ? "$\\widehat{A} = 180^\\circ - " + ct.gB + "^\\circ - " + ct.gC + "^\\circ = " + gA + "^\\circ$, còn $\\widehat{A'} = " + gA1 + "^\\circ$."
        : "$\\widehat{A} = \\widehat{A'} = 180^\\circ - " + ct.gB + "^\\circ - " + ct.gC + "^\\circ = " + gA + "^\\circ$, vì tổng ba góc của tam giác bằng $180^\\circ$." },
      nho: { tieuDe: 'Tam giác $ABC$', chu: '$BC = ' + soDo(kc(S[1], S[2])) + '$, $BA ' + bs(kc(S[0], S[1])) + '$, $CA ' + bs(kc(S[2], S[0])) + '$.' },
      lon: { tieuDe: "Tam giác $A'B'C'$", chu: "$B'C' = " + soDo(kc(T[1], T[2])) + "$, $B'A' \\approx " + soDo(kc(T[0], T[1])) + "$, $C'A' \\approx " + soDo(kc(T[2], T[0])) + '$. ' + (ct.hong
        ? "Tỉ số với cạnh tương ứng của $ABC$: $" + soDo(ct.k) + '$; $' + bs(ct.tiA) + '$; $' + bs(ct.tiCA) + '$, không bằng nhau.'
        : 'Mỗi cạnh bằng cạnh tương ứng của $ABC$ nhân $k = ' + soDo(ct.k) + '$.') }
    };
  };

  // Tam giác vuông có đường cao AH: hai tam giác nhỏ và tam giác lớn đồng dạng
  function duongCao(p, t, o) {
    var bh = o.bh != null ? o.bh : p.bh, ch = o.ch != null ? o.ch : p.ch, ah = Math.sqrt(bh * ch), n = o.nhan || {};
    // Thử phá (chỉ khi số đo lấy từ thanh trượt): góc A khác 90°, tìm độ cao đỉnh A cho đúng góc đó
    var gA = o.bh == null && typeof p.gocA === 'number' ? p.gocA : 90, hong = Math.abs(gA - 90) > EPS;
    if (hong) ah = doCaoChoGoc(bh, ch, gA);
    var B = [0, 0], H = [bh, 0], Cc = [bh + ch, 0], A = [bh, ah];
    var hinh = [
      { diem: [A, B, Cc], ten: ['A', 'B', 'C'], soi: 'ABC', goc: [hong ? { mau: '--sai', r: 0.8, soi: 'gocA' } : { vuong: true, mau: '--muc', r: 0.6, soi: 'gocA' }, o.cheDo === 'haiNho' ? null : '--a', o.cheDo === 'haiNho' ? null : '--b'], canh: [n.AB, null, n.AC] },
      { diem: [H, B, A], to: '--a', mo: 0.1, mau: '--nhat', day: 1, goc: [{ vuong: true, mau: '--nhat', r: 0.5 }], soi: 'HBA' },
      { diem: [H, A, Cc], to: '--b', mo: 0.1, mau: '--nhat', day: 1, soi: 'HAC' }
    ];
    var them = [{ k: 'doan', a: A, b: H, mau: '--muc', day: 1.8, net: true, soi: 'AH' },
      { k: 'chu', p: cong(H, [0, -0.09 * (bh + ch)]), s: 'H', nghieng: true }];
    if (n.BH != null) them.push({ k: 'chu', p: [bh / 2, -0.07 * (bh + ch)], s: n.BH });
    if (n.CH != null) them.push({ k: 'chu', p: [bh + ch / 2, -0.07 * (bh + ch)], s: n.CH });
    if (n.AH != null) them.push({ k: 'chu', p: [bh + 0.075 * (bh + ch), ah * 0.45], s: n.AH });
    var di = o.cheDo === 'haiNho' ? [{ tu: 1, toi: [H, A, Cc], neo: 0, mau: '--a', khung: [0.12, 0.88] }]
      : [{ tu: 1, toi: [A, B, Cc], neo: 1, mau: '--a' }, { tu: 2, toi: [A, B, Cc], neo: 2, mau: '--b' }];
    if (typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0) {
      var At = [bh, Math.min(p.thu, 1.5 * ah)], cuoi = (o.loiCuoi || []).slice();
      them.push({ k: 'doan', a: B, b: At, mau: '--sai', net: true, day: 2 });
      them.push({ k: 'doan', a: Cc, b: At, mau: '--sai', net: true, day: 2 });
      // Góc tính theo đúng số em gõ, kể cả khi đoạn vẽ phải dừng ở mép hình
      cuoi.push({ s: 'AH = ' + C.fmt(p.thu) + ' thì góc A ≈ ' + Math.round(goc(B, [bh, p.thu], Cc)) + '°', mau: '--sai', hien: [-1, -0.5] });
      return { hinh: hinh, them: them, di: di, loiCuoi: cuoi };
    }
    return { hinh: hinh, them: them, di: di, loiCuoi: hong ? [{ s: 'AH² ≈ ' + C.fmt(ah * ah) + ';  BH · CH = ' + C.fmt(bh * ch), mau: '--sai', hien: [-1, -0.5] }] : o.loiCuoi,
      chiTiet: { bh: bh, ch: ch, ah: ah, gocA: gA, hong: hong, A: A, B: B, C: Cc, H: H } };
  }
  // Góc BAC nhìn đoạn BC từ đỉnh A cao x trên H: atan(bh/x) + atan(ch/x), giảm dần theo x. Chia đôi để tìm x.
  function doCaoChoGoc(bh, ch, g) {
    var lo0 = 1e-6, hi = 1e3, r = g * RAD;
    for (var i = 0; i < 80; i++) { var m = (lo0 + hi) / 2; if (Math.atan(bh / m) + Math.atan(ch / m) > r) lo0 = m; else hi = m; }
    return (lo0 + hi) / 2;
  }
  C.dangKi('duongCao', {
    thamSo: { bh: { min: 1, max: 6, step: 0.5, md: 2, nhan: 'BH', mau: '--a' }, ch: { min: 1, max: 8, step: 0.5, md: 4.5, nhan: 'CH', mau: '--b' },
      gocA: { min: 60, max: 120, step: 5, md: 90, nhan: 'Góc A (độ)', pha: true } },
    tinh: function (p, t, o) {
      o = o || {};
      var mo = duongCao(p, t, o), kq = lo(mo, p, t), ct = mo.chiTiet;
      if (!ct) return kq;
      kq.chiTiet = ct;
      if (o.bh != null) return kq;
      if (ct.hong) {
        // Phóng xong, đỉnh góc vuông H của bản sao HBA không tới A: nối bằng đoạn đỏ
        var x = kq.di[0], cuoi = viTri(x.S, x.kh, 1).diem[0];
        kq.net.push({ k: 'doan', a: cuoi, b: ct.A, mau: '--sai', net: true, day: 2.5, op: hienRa(t, [x.w[1] - 0.06, x.w[1]]) });
        kq.pha = { hong: true, gocA: ct.gocA, ah2: ct.ah * ct.ah, tich: ct.bh * ct.ch,
          chu: 'Góc $A = ' + ct.gocA + '^\\circ$: $AH^2 ' + bs(ct.ah * ct.ah) + '$ nhưng $BH \\cdot CH = ' + soDo(ct.bh * ct.ch) + '$. Tam giác $ABC$ không còn góc vuông, nên tam giác vuông $HBA$ không đồng dạng với nó: lật và phóng lên, đỉnh $H$ không tới $A$ (đoạn đỏ).' };
      } else kq.pha = { hong: false, chu: 'Góc $A$ vuông: $AH^2 = BH \\cdot CH = ' + soDo(ct.bh * ct.ch) + '$.' };
      return kq;
    }
  });
  C.lay('duongCao').soi = function (k, p, o) {
    var ct = k.chiTiet;
    if (!o.chiTiet || !ct) return {};
    var A = ct.A, B = ct.B, Cc = ct.C, bc = ct.bh + ct.ch, gB = goc(A, B, Cc), gC = goc(A, Cc, B), ab = kc(A, B), ac = kc(A, Cc);
    return {
      gocA: { tieuDe: 'Góc $A$', chu: ct.hong ? '$\\widehat{A} = ' + ct.gocA + '^\\circ$, không vuông. Các hệ thức của tam giác vuông không còn đúng.' : '$\\widehat{A} = 90^\\circ$. Ba tam giác $ABC$, $HBA$, $HAC$ đều vuông (tại $A$, $H$, $H$).' },
      AH: { tieuDe: 'Đường cao $AH$', chu: '$AH ' + bs(ct.ah) + '$, $AH^2 ' + bs(ct.ah * ct.ah) + '$, $BH \\cdot CH = ' + soDo(ct.bh) + ' \\cdot ' + soDo(ct.ch) + ' = ' + soDo(ct.bh * ct.ch) + '$. ' + (ct.hong ? 'Hai số khác nhau.' : 'Bằng nhau, vì $\\triangle HBA \\backsim \\triangle HAC$ cho $\\frac{HB}{HA} = \\frac{HA}{HC}$.') },
      HBA: { tieuDe: 'Tam giác $HBA$', chu: 'Vuông tại $H$, có góc $B ' + bs(gB) + '^\\circ$ chung với tam giác $ABC$. ' + (ct.hong ? 'Nhưng $ABC$ không vuông, nên hai tam giác không có đủ hai cặp góc bằng nhau.' : 'Hai tam giác vuông có chung một góc nhọn nên đồng dạng: $\\triangle HBA \\backsim \\triangle ABC$.') },
      HAC: { tieuDe: 'Tam giác $HAC$', chu: 'Vuông tại $H$, có góc $C ' + bs(gC) + '^\\circ$ chung với tam giác $ABC$. ' + (ct.hong ? 'Nhưng $ABC$ không vuông, nên hai tam giác không đồng dạng.' : 'Vậy $\\triangle HAC \\backsim \\triangle ABC$.') },
      ABC: { tieuDe: 'Tam giác $ABC$', chu: '$BC = BH + CH = ' + soDo(bc) + '$, $AB ' + bs(ab) + '$, $AC ' + bs(ac) + '$. ' + (ct.hong ? '' : '$AB^2 = BH \\cdot BC = ' + soDo(ct.bh * bc) + '$, $AC^2 = CH \\cdot BC = ' + soDo(ct.ch * bc) + '$.') }
    };
  };

  // Mô tả tự do: hình cố định + bản sao di chuyển, dùng cho đề có số liệu riêng
  C.dangKi('trungKhit', {
    tinh: function (p, t, o) {
      var coThu = o.thu && typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0;
      if (!coThu) return lo(o, p, t);
      // Số em gõ ghi ở dòng dưới; đoạn đỏ dài đúng số đó (theo đơn vị của hình), dừng ở mép khung nếu quá dài
      var kq = lo(Object.assign({}, o, { loiCuoi: (o.loiCuoi || []).concat([{ s: (o.thu.ten || 'x') + ' = ' + C.fmt(p.thu), mau: '--sai', hien: [-1, -0.5] }]) }), p, t);
      var h = donVi(o.thu.huong || [0, 1]), g0 = o.thu.goc, kh = kq.khung, m = 1.2 * kq.co, l = p.thu * (o.thu.tiLe || 1);
      [[0, kh[0] + m, kh[0] + kh[2] - m], [1, kh[1] + m + 1.3 * kq.co * ((o.loiCuoi || []).length + 1), kh[1] + kh[3] - m]].forEach(function (x) {
        if (h[x[0]] > EPS) l = Math.min(l, (x[2] - g0[x[0]]) / h[x[0]]);
        if (h[x[0]] < -EPS) l = Math.min(l, (x[1] - g0[x[0]]) / h[x[0]]);
      });
      kq.net.push({ k: 'doan', a: g0, b: cong(g0, nhan(h, Math.max(0, l))), mau: '--sai', day: 3, net: true, op: 1 });
      return kq;
    }
  });

  // Lưới ô vuông: cạnh gấp k thì mỗi ô vuông cạnh 1 thành ô vuông cạnh k, diện tích k·k. Hình ghép từ n ô thì diện tích gấp k².
  function luoiO(p, t, o) {
    var k = o.k != null ? o.k : p.k, cell = [];
    // Thử phá (chỉ khi k lấy từ thanh trượt): chiều dọc nhân kd = k + thêm, khác chiều ngang
    var kd = o.k == null && typeof p.them === 'number' ? Math.max(1, k + p.them) : k, hong = !gan(kd, k);
    if (o.chuNhat) { for (var i = 0; i < o.chuNhat[0]; i++) for (var j = 0; j < o.chuNhat[1]; j++) cell.push([i, j]); }
    else cell = (o.o || [[0, 0], [1, 0], [0, 1]]).map(function (q) { return q.slice(); });
    var wc = 0, hc = 0;
    cell.forEach(function (q) { wc = Math.max(wc, q[0] + 1); hc = Math.max(hc, q[1] + 1); });
    var co = Math.max(wc * (1 + k) / 10.2, hc * Math.max(k, kd) / 11, hc / 6) * (o.co || 1), gap = Math.max(2.6 * co, 0.3 * wc), x0 = wc + gap;
    var tien = C.muot((t - 0.1) / 0.4), s = 1 + (k - 1) * tien, sd = 1 + (kd - 1) * tien;
    var cu = cell.map(function (q) { return C.chuNhat({ x: q[0], y: q[1], w: 1, h: 1 }); });
    var moi = cell.map(function (q) { return C.chuNhat({ x: x0 + q[0] * s, y: q[1] * sd, w: s, h: sd }); });
    // Hình đồng dạng thật (hai chiều cùng nhân k), để so khi thử phá
    var dungK = hong ? cell.map(function (q) { return C.chuNhat({ x: x0 + q[0] * s, y: q[1] * s, w: s, h: s }); }) : null;
    // Ô đơn vị của hình mới: đếm được khi k nguyên, hoặc hình chữ nhật có hai cạnh mới là số nguyên
    var nguyen = gan(k, Math.round(k)) && gan(kd, Math.round(kd)), oMoi = [];
    if (nguyen) cell.forEach(function (q) { for (var a = 0; a < k; a++) for (var b = 0; b < kd; b++) oMoi.push([q[0] * k + a, q[1] * kd + b]); });
    else if (o.chuNhat && gan(wc * k, Math.round(wc * k)) && gan(hc * k, Math.round(hc * k))) {
      for (var a2 = 0; a2 < Math.round(wc * k); a2++) for (var b2 = 0; b2 < Math.round(hc * k); b2++) oMoi.push([a2, b2]);
    }
    var demDuoc = oMoi.length > 0 && oMoi.length <= 400;
    return { k: k, kd: kd, hong: hong, s: s, x0: x0, co: co, wc: wc, hc: hc, cu: cu, moi: moi, dungK: dungK, oMoi: demDuoc ? oMoi : [], dtCu: cell.length, dtMoi: cell.length * k * kd,
      W: x0 + wc * Math.max(1, k), H: Math.max(hc, hc * Math.max(k, kd)), hienLuoi: demDuoc ? C.muot((t - 0.5) / 0.35) : 0, chuNhat: !!o.chuNhat, nguyen: nguyen,
      pha: o.k == null ? (hong
        ? { hong: true, k: k, kd: kd, gap: k * kd,
          chu: 'Ngang nhân $' + soDo(k) + '$, dọc nhân $' + soDo(kd) + '$: mỗi ô thành hình chữ nhật $' + soDo(k) + ' \\times ' + soDo(kd) + '$, diện tích gấp $' + soDo(k) + ' \\cdot ' + soDo(kd) + ' = ' + soDo(k * kd) + '$ lần, không phải $k^2 = ' + soDo(k * k) + '$ lần. Hình bị kéo dãn một chiều nên không đồng dạng với hình cũ (nét đứt đỏ là hình đồng dạng thật).' }
        : { hong: false, chu: 'Hai chiều cùng nhân $k = ' + soDo(k) + '$: diện tích gấp $k^2 = ' + soDo(k * k) + '$ lần.' }) : undefined };
  }
  C.dangKi('luoiO', {
    thamSo: { k: { min: 1, max: 4, step: 1, md: 2, nhan: 'Tỉ số k', mau: '--a' },
      them: { min: -1, max: 2, step: 1, md: 0, nhan: 'Dọc nhân thêm', pha: true } },
    tinh: function (p, t, o) { return luoiO(p, t, o || {}); }
  });
  C.lay('luoiO').soi = function (k, p, o) {
    if (!o.chiTiet) return {};
    var n = k.dtCu;
    return {
      cu: { tieuDe: 'Hình cũ', chu: '$' + n + '$ ô vuông cạnh $1$, diện tích $' + n + '$.' },
      moi: { tieuDe: 'Hình mới', chu: k.hong
        ? 'Mỗi ô cũ thành hình chữ nhật $' + soDo(k.k) + ' \\times ' + soDo(k.kd) + '$, không phải hình vuông. Diện tích $' + n + ' \\cdot ' + soDo(k.k * k.kd) + ' = ' + soDo(k.dtMoi) + '$.'
        : 'Mọi cạnh nhân $k = ' + soDo(k.k) + '$, nên mỗi ô cũ thành hình vuông cạnh $' + soDo(k.k) + '$, diện tích $' + soDo(k.k) + ' \\cdot ' + soDo(k.k) + ' = ' + soDo(k.k * k.k) + '$. Cả hình: $' + n + ' \\cdot ' + soDo(k.k * k.k) + ' = ' + soDo(k.dtMoi) + '$.' },
      oNho: { tieuDe: 'Ô nhỏ cạnh $1$', chu: 'Hình mới chia được thành $' + soDo(k.dtMoi) + '$ ô vuông cạnh $1$, đúng bằng diện tích của nó. So với $' + n + '$ ô của hình cũ: gấp $' + soDo(k.dtMoi / n) + '$ lần.' }
    };
  };

  /* ---------- Phần vẽ ---------- */
  function veNet(svg, kq) {
    var mk = C.mk, Y = function (q) { return [q[0], -q[1]]; }, kh = kq.khung;
    svg.setAttribute('viewBox', [kh[0], -(kh[1] + kh[3]), kh[2], kh[3]].join(' '));
    kq.net.forEach(function (n) {
      if (!n.op) return;
      var mau = 'var(' + (n.vien || n.mau || '--muc') + ')', mo = { opacity: n.op, 'data-soi': n.soi };
      if (n.k === 'da' || n.k === 'duong') {
        mk(n.k === 'da' ? 'polygon' : 'polyline', Object.assign({ points: C.diem(n.d.map(Y)), fill: n.to ? 'var(' + n.to + ')' : 'none', 'fill-opacity': n.to ? n.mo : null,
          stroke: n.to && !n.vien ? 'none' : mau, 'stroke-width': n.day || 2.2, 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round', 'stroke-dasharray': n.net ? '6 4' : null }, mo), svg);
      } else if (n.k === 'doan') {
        var a = Y(n.a), b = Y(n.b);
        mk('line', Object.assign({ x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: mau, 'stroke-width': n.day || 2, 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round', 'stroke-dasharray': n.net ? '6 4' : null }, mo), svg);
      } else if (n.k === 'goc') veGoc(svg, n, Y, mau);
      else if (n.k === 'chu') C.chu(svg, n.p[0], -n.p[1], n.s, n.co, n.mau, Object.assign({ 'font-style': n.nghieng ? 'italic' : null }, { opacity: n.op }));
    });
  }
  function veGoc(svg, n, Y, mau) {
    var o = Y(n.o), u = donVi(tru(Y(n.a), o)), v = donVi(tru(Y(n.b), o)), r = n.r;
    if (n.vuong) {
      var s = r * 0.55, p1 = cong(o, nhan(u, s)), p2 = cong(p1, nhan(v, s)), p3 = cong(o, nhan(v, s));
      // Ô vuông nhỏ có nền trong suốt để bấm soi được
      if (n.soi) C.mk('polygon', { points: C.diem([o, p1, p2, p3]), fill: 'transparent', stroke: 'none', 'data-soi': n.soi }, svg);
      C.mk('polyline', { points: C.diem([p1, p2, p3]), fill: 'none', stroke: mau, 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', opacity: n.op, 'data-soi': n.soi }, svg);
      return;
    }
    var a = cong(o, nhan(u, r)), b = cong(o, nhan(v, r)), quet = tichVo(u, v) > 0 ? 1 : 0;
    C.mk('path', { d: 'M' + o.join(' ') + 'L' + a.join(' ') + 'A' + r + ' ' + r + ' 0 0 ' + quet + ' ' + b.join(' ') + 'Z', fill: mau, 'fill-opacity': 0.3, stroke: mau, 'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke', opacity: n.op, 'data-soi': n.soi }, svg);
  }
  ['songSong', 'ggTrung', 'duongCao', 'trungKhit'].forEach(function (ten) { C.lay(ten).ve = function (svg, kq) { veNet(svg, kq); }; });

  C.lay('luoiO').ve = function (svg, k, p, t, o) {
    var mk = C.mk, co = k.co, n = o.nhan || {}, dong = o.loiCuoi || [], net = { stroke: 'var(--muc)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' };
    var tren = k.H + 1.9 * co;
    // Dòng chữ dài hơn hình thì nới khung hai bên cho đủ chỗ (ước bề rộng chữ ≈ 0,55 cỡ chữ mỗi kí tự)
    var rongChu = Math.max.apply(null, [0].concat(dong.map(function (x) { return String(typeof x === 'object' ? x.s : x).length * 0.55 * co; })));
    var them = Math.max(0, (rongChu - k.W - 3.8 * co) / 2);
    svg.setAttribute('viewBox', [-1.9 * co - them, -tren, k.W + 3.8 * co + 2 * them, tren + 1.6 * co + dong.length * 1.3 * co].join(' '));
    var Y = function (d) { return d.map(function (q) { return [q[0], -q[1]]; }); };
    k.cu.forEach(function (d) { mk('polygon', Object.assign({ points: C.diem(Y(d)), fill: 'var(--b)', 'fill-opacity': 0.25, 'data-soi': 'cu' }, net), svg); });
    k.moi.forEach(function (d, i) {
      // k nguyên: các ô cũ sau khi phóng tô xen kẽ hai màu, để thấy mỗi ô cũ thành k·k ô mới.
      // k không nguyên: ô cũ phóng ra không trùng lưới ô 1, nên chỉ tô, không kẻ viền từng ô (kẻo đếm nhầm)
      mk('polygon', Object.assign({ points: C.diem(Y(d)), fill: k.nguyen && i % 2 ? 'var(--cc)' : 'var(--a)', 'fill-opacity': 0.22, 'data-soi': 'moi' }, k.nguyen ? net : { stroke: 'none' }), svg);
    });
    if (!k.nguyen) {
      var vien = k.moi.reduce(function (a, d) { return a.concat(d); }, []), bx = bien(vien);
      if (k.chuNhat) mk('rect', Object.assign({ x: bx.x0, y: -bx.y1, width: bx.x1 - bx.x0, height: bx.y1 - bx.y0, fill: 'none' }, net), svg);
      else k.moi.forEach(function (d) { mk('polygon', Object.assign({ points: C.diem(Y(d)), fill: 'none' }, net), svg); });
    }
    if (k.hienLuoi > 0) {
      var g = mk('g', { opacity: k.hienLuoi }, svg);
      k.oMoi.forEach(function (q) { mk('rect', { x: k.x0 + q[0], y: -q[1] - 1, width: 1, height: 1, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 0.6, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '3 2', 'data-soi': 'oNho' }, g); });
    }
    if (k.dungK) {
      // Thử phá: hình đồng dạng thật (hai chiều cùng nhân k), nét đứt đỏ, để thấy hình kéo dãn lệch khỏi nó
      var gd = mk('g', { opacity: C.muot((t - 0.3) / 0.2) }, svg);
      k.dungK.forEach(function (d) { mk('polygon', { points: C.diem(Y(d)), fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4' }, gd); });
    }
    if (typeof p.thu === 'number' && isFinite(p.thu) && p.thu > 0 && k.oMoi.length) {
      // Tô đúng số ô em vừa gõ: thấy ngay chúng phủ được bao nhiêu phần hình mới
      k.oMoi.slice().sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; }).slice(0, Math.round(p.thu)).forEach(function (q) {
        mk('rect', { x: k.x0 + q[0], y: -q[1] - 1, width: 1, height: 1, fill: 'var(--sai)', 'fill-opacity': 0.5 }, svg);
      });
    }
    // Nhãn có thể là chữ, { s, an, anChu } (giấu tới khi em làm đúng) hoặc hàm của k (ở phần Nhìn, k đổi theo thanh trượt)
    var hien = function (x) {
      if (typeof x === 'function') return x(k.k, k.kd);
      return x && typeof x === 'object' ? (x.an && p.trangThai !== 'giai' ? (x.anChu || '?') : x.s) : x;
    };
    var dat = function (x, y, s, mau, op) { if (s != null) C.chu(svg, x, y, hien(s), co, mau, { opacity: op == null ? 1 : op }); };
    var moi = C.muot((t - 0.45) / 0.1);
    dat(k.wc / 2, 0.8 * co, n.rong, '--b'); dat(-0.9 * co, -k.hc / 2, n.cao, '--b');
    dat(k.x0 + k.wc * k.k / 2, 0.8 * co, n.rongMoi, '--a', moi); dat(k.x0 - 0.9 * co, -k.hc * k.kd / 2, n.caoMoi, '--a', moi);
    dat(k.wc / 2, -k.hc - 0.8 * co, n.cu, '--b'); dat(k.x0 + k.wc * k.k / 2, -k.hc * Math.max(k.k, k.kd) - 0.8 * co, n.moi, '--a', C.muot((t - 0.85) / 0.15));
    dong.forEach(function (x, i) {
      var d = typeof x === 'object' ? x : { s: x }, w = d.hien || [0.88, 1];
      dat(k.W / 2, 2.1 * co + 1.3 * co * i, d, d.mau, C.muot((t - w[0]) / (w[1] - w[0])));
    });
  };

  // Cho bộ kiểm: các phép tính hình học, để test kiểm tính chất thật
  C.dongDang = { keHoach: keHoach, viTri: viTri, goc: goc, kc: kc, tuCanh: tuCanh, tuGoc: tuGoc, dtCoDau: dtCoDau };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
