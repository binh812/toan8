// Cảnh cho chương VIII: xác suất.
//  luoiKetQua – mỗi kết quả có thể là một chấm, chấm thuận lợi sáng lên (bài 30); chia thanh xác suất 1 thành phần bằng nhau (bài 31).
//  lanThu     – mỗi lần thử là một ô, ô sáng là lần biến cố xảy ra; tỉ lệ ô sáng là xác suất thực nghiệm, giữ tỉ lệ để dự đoán (bài 32).
//  moPhong    – rút bi có trả lại rất nhiều lần, tỉ lệ k/n tiến dần về xác suất (bài 32). Tất định theo hạt giống.
(function (C) {
  'use strict';
  var MAU_NHOM = ['--b', '--a', '#9c36b5', '--tg', '#0c8599', '#e8590c'];
  var X0 = 4, RONG = 92;
  function la(v) { return typeof v === 'number' && isFinite(v); }
  function to(m) { return !m ? 'var(--b)' : m.indexOf('--') === 0 ? 'var(' + m + ')' : m; }
  function doan(t, a, b) { return C.muot((t - a) / (b - a)); }
  function ucln(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a || 1; }
  // "6/18 = 1/3", hoặc "5/12" khi đã tối giản
  function phanSo(m, n) {
    var g = ucln(m, n), goc = m + '/' + n;
    return g > 1 && n ? goc + ' = ' + (m / g) + (n / g === 1 ? '' : '/' + (n / g)) : goc;
  }
  function soViet(x) { return la(x) ? C.fmt(x) : '?'; }
  // Số nguyên lớn viết cách nhóm ba chữ số: 240 000
  function soLon(x) { var s = String(Math.round(x)); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s; }
  // Cỡ chữ vừa một dòng rộng khoảng 92 đơn vị
  function coVua(s) { return Math.min(4.3, 190 / Math.max(10, s.length)); }
  function trai(mau) { return { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:start' }; }
  function phai(mau) { return { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:end' }; }

  // Bộ sinh số ngẫu nhiên tất định (mulberry32): cùng hạt giống thì cùng dãy, để hình và test lặp lại được
  function sinhNgauNhien(hat) {
    var s = (hat >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var x = s;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Chọn k vị trí trong n vị trí, trộn tất định theo hạt giống
  function viTriSang(n, k, hat) {
    var r = sinhNgauNhien(hat), a = [], i;
    for (i = 0; i < n; i++) a.push(i < k);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  C.sinhNgauNhien = sinhNgauNhien;

  /* ================= Lưới kết quả có thể ================= */
  // Danh sách kết quả: { nhan, v (giá trị cho hàm lọc), g (nhóm), hang, cot }
  function dsKetQua(o) {
    var kq = [], nhom = [], i, j, loai = o.loai || (o.nhom ? 'nhom' : 'theSo'), luoi = 0;
    if (loai === 'xucXac') for (i = 1; i <= 6; i++) kq.push({ nhan: String(i), v: i, g: 0 });
    else if (loai === 'theSo') {
      var a = la(o.tu) ? o.tu : 1, b = la(o.den) ? o.den : 10;
      if (b < a || b - a > 120) throw new Error('luoiKetQua: khoảng số lạ ' + a + '…' + b);
      for (i = a; i <= b; i++) kq.push({ nhan: String(i), v: i, g: 0 });
    } else if (loai === 'haiDongXu') {
      // Gộp theo "loại" (số mặt sấp) thì chỉ thấy 3 nhóm; tách ra thì SN và NS là hai ô khác nhau
      nhom = [{ ten: 'Hai sấp', so: 1 }, { ten: 'Một sấp, một ngửa', so: 2 }, { ten: 'Hai ngửa', so: 1 }];
      luoi = 2;
      ['S', 'N'].forEach(function (x, h) { ['S', 'N'].forEach(function (y, c) { kq.push({ nhan: x + y, v: x + y, g: (x === 'N') + (y === 'N'), hang: h, cot: c }); }); });
    } else if (loai === 'haiXucXac') {
      luoi = 6;
      for (i = 1; i <= 6; i++) for (j = 1; j <= 6; j++) kq.push({ nhan: i + ';' + j, v: [i, j], g: 0, hang: i - 1, cot: j - 1 });
    } else if (loai === 'nhom') {
      nhom = o.nhom;
      if (!Array.isArray(nhom) || !nhom.length) throw new Error('luoiKetQua: thiếu nhom');
      nhom.forEach(function (gr, gi) {
        if (!(gr.so >= 1) || gr.so !== Math.round(gr.so)) throw new Error('luoiKetQua: số lượng nhóm lạ: ' + gr.so);
        for (var k = 0; k < gr.so; k++) kq.push({ nhan: gr.chu ? gr.chu + (k + 1) : (gr.nhan || ''), v: gr.ten, g: gi });
      });
    } else throw new Error('luoiKetQua: loại lạ: ' + loai);
    return { kq: kq, nhom: nhom, luoi: luoi, loai: loai };
  }
  function bienCoCua(o, p) {
    var ds = o.bienCo || (o.thuanLoi || o.nhomThuan || o.loc ? [{ ten: o.tenBienCo, thuanLoi: o.thuanLoi, nhom: o.nhomThuan, loc: o.loc }] : []);
    if (!ds.length) return null;
    var i = la(p.chon) ? Math.round(p.chon) : 0;
    return ds[Math.max(0, Math.min(ds.length - 1, i))];
  }
  function laThuan(bc, x, nhom) {
    if (!bc) return false;
    if (bc.loc) return !!bc.loc(x.v);
    if (bc.nhom) return !!nhom[x.g] && bc.nhom.indexOf(nhom[x.g].ten) >= 0;
    return (bc.thuanLoi || []).some(function (y) { return String(y) === x.nhan || String(y) === String(x.v); });
  }

  // Vị trí các chấm (đã tách) và vị trí lúc còn gộp theo nhóm
  function xepCham(o, d, top) {
    var kq = d.kq, n = kq.length, out = { cham: [], tieuDe: [], nhanNhom: [] }, i;
    if (d.luoi) {
      var N = d.luoi, le = 13, o0 = N === 2 ? 15 : 10.5, oo = Math.min(o0, (RONG - le) / N), w = le + N * oo, bx = (100 - w) / 2 + le, by = top + 8;
      kq.forEach(function (x) { out.cham.push({ x: bx + (x.cot + 0.5) * oo, y: by + (x.hang + 0.5) * oo }); });
      var ten = d.loai === 'haiDongXu' ? ['S', 'N'] : ['1', '2', '3', '4', '5', '6'];
      for (i = 0; i < N; i++) {
        out.tieuDe.push({ x: bx + (i + 0.5) * oo, y: by - 3, chu: ten[i] });
        out.tieuDe.push({ x: bx - 3, y: by + (i + 0.5) * oo, chu: ten[i] });
      }
      out.tenTruc = d.loai === 'haiDongXu' ? [o.ten1 || 'Đồng thứ nhất', o.ten2 || 'Đồng thứ hai'] : ['Con thứ nhất', 'Con thứ hai'];
      out.goc = { x: bx, y: by, o: oo, N: N };
      out.R = oo * (N === 2 ? 0.36 : 0.42);
      out.co = N === 2 ? 5.2 : Math.min(3.4, oo * 0.32);
      out.day = by + N * oo;
    } else {
      var hang = d.nhom.length && d.nhom.length <= 6 && !o.cot && Math.max.apply(null, d.nhom.map(function (g) { return g.so; })) <= 18;
      if (hang) {
        var dai = Math.max.apply(null, d.nhom.map(function (g) { return (g.ten || '').length; }));
        var lw = Math.min(44, dai * 2.4 + 3), maxSo = Math.max.apply(null, d.nhom.map(function (g) { return g.so; }));
        var s = Math.min(9.5, (RONG - lw) / maxSo), h = Math.max(s, 8.5), dem = 0;
        out.R = Math.min(3.6, s * 0.42);
        d.nhom.forEach(function (g, gi) {
          var y = top + (gi + 0.5) * h;
          out.nhanNhom.push({ x: X0, y: y, chu: g.ten, mau: g.mau || MAU_NHOM[gi % MAU_NHOM.length] });
          for (var k = 0; k < g.so; k++) { out.cham.push({ x: X0 + lw + (k + 0.5) * s, y: y }); dem++; }
        });
        out.day = top + d.nhom.length * h;
      } else {
        var cot = o.cot || (n <= 8 ? n : n <= 16 ? 8 : 10), s2 = Math.min(11, RONG / cot), bx2 = (100 - cot * s2) / 2;
        out.R = Math.min(4, s2 * 0.4);
        for (i = 0; i < n; i++) out.cham.push({ x: bx2 + (i % cot + 0.5) * s2, y: top + (Math.floor(i / cot) + 0.5) * s2 });
        out.day = top + Math.ceil(n / cot) * s2;
      }
      out.co = Math.min(4.2, out.R * 1.05);
    }
    // Gộp: mọi chấm của một nhóm chồng lên chấm đầu tiên của nhóm
    var dau = {};
    kq.forEach(function (x, j) { if (!(x.g in dau)) dau[x.g] = j; });
    out.gom = kq.map(function (x) { return out.cham[dau[x.g]]; });
    out.dauNhom = dau;
    return out;
  }

  // Số trong $…$ của thẻ: dấu phẩy thập phân viết {,}
  function soTex(x) { return String(x).replace('.', '{,}'); }
  function gan3(v) { var r = Math.round(v * 1000) / 1000; return (Math.abs(v - r) < 1e-12 ? '= ' : '\\approx ') + soTex(r); }
  // Thử phá bài 31: ô đầu to gấp to1 lần thì các kết quả không còn đồng khả năng, công thức đếm m/n cho số sai
  function phaDongKhaNang(dau, m, n, mW, W, to1) {
    if (Math.abs(to1 - 1) < 1e-9) {
      return { hong: false, to: 1, chu: 'Mọi ô to như nhau: $' + n + '$ kết quả đồng khả năng, mỗi ô được $\\frac{1}{' + n + '}$ thanh, nên $P = \\frac{' + m + '}{' + n + '}$ đúng bằng phần sáng.' };
    }
    return { hong: true, to: to1, dem: m / n, that: mW / W, chu: 'Ô «' + dau.nhan + '» to gấp $' + soTex(to1) + '$ ô khác, nên dễ trúng hơn: $' + n + '$ kết quả **không** còn đồng khả năng. Đếm vẫn ra $\\frac{' + m + '}{' + n + '} ' + gan3(m / n) +
      '$, nhưng phần sáng thật trên thanh là $\\frac{' + soTex(mW) + '}{' + soTex(W) + '} ' + gan3(mW / W) + '$. Công thức $\\frac{m}{n}$ chỉ đúng khi mọi kết quả có phần bằng nhau.' };
  }
  C.dangKi('luoiKetQua', {
    // Thử phá (bài 31): ô đầu tiên to gấp mấy lần các ô khác; 1 là mọi ô như nhau
    thamSo: { to: { min: 1, max: 4, step: 1, md: 1, nhan: 'Ô đầu to gấp', pha: true } },
    tinh: function (p, t, o) {
      var d = dsKetQua(o), kq = d.kq, n = kq.length, bc = bienCoCua(o, p), chia = o.cheDo === 'chia', st = p.trangThai;
      var coGom = !!o.gom && d.nhom.length > 0 && d.nhom.length < n;
      var top = bc && bc.ten ? 12 : 4, xep = xepCham(o, d, top);
      var thuan = kq.map(function (x) { return laThuan(bc, x, d.nhom); }), m = thuan.filter(Boolean).length;
      // Các mốc thời gian
      var P = chia
        ? { tach: [0.06, 0.22], thanh: [coGom ? 0.25 : 0.08, coGom ? 0.42 : 0.25], sang: [0.47, 0.6], don: [0.66, 0.84], so: 0.9 }
        : { tach: [0.08, 0.3], sang: [coGom ? 0.45 : 0.12, 0.8], so: 0.85 };
      var tach = coGom ? doan(t, P.tach[0], P.tach[1]) : 1;
      if (st === 'theoLoai' && coGom && !chia) tach = 0;
      var hang = 0;
      var cham = kq.map(function (x, i) {
        var a = xep.gom[i], b = xep.cham[i], s = 0;
        if (thuan[i]) {
          if (chia) s = doan(t, P.sang[0], P.sang[1]);
          else { var r = hang / Math.max(1, m), A = P.sang[0], L = P.sang[1] - P.sang[0]; s = doan(t, A + L * r * 0.7, A + L * (r * 0.7 + 0.3)); }
          hang++;
        }
        var gr = d.nhom[x.g], viTri = i - xep.dauNhom[x.g];
        return { danhDau: !!(p.danhDau && gr && gr.danhDau && viTri >= gr.so - gr.danhDau.so),
          x: C.noiSuy(a.x, b.x, tach), y: C.noiSuy(a.y, b.y, tach), nhan: x.nhan, g: x.g, thuan: thuan[i], sang: s,
          dau: xep.dauNhom[x.g] === i, dauTien: i === 0 };
      });
      var moiBienCo = (o.bienCo || []).length > 1 ? o.bienCo.map(function (b) { return { ten: b.ten, m: kq.filter(function (x) { return laThuan(b, x, d.nhom); }).length, dangXem: b === bc }; }) : null;
      var ra = { moiBienCo: moiBienCo, cham: cham, n: n, m: m, tach: tach, coGom: coGom, nhom: d.nhom, xep: xep, bienCo: bc, chia: chia,
        soHien: t >= P.so - 1e-9 ? 1 : 0, sangXong: doan(t, P.sang[0], P.sang[1]) };
      if (chia) {
        // Thanh dài 1 (biến cố chắc chắn) chia đều cho n chấm; dồn các phần sáng về đầu thanh
        // Mỗi chấm một phần theo "độ to" của nó; mặc định mọi chấm như nhau (đồng khả năng)
        var to1 = la(p.to) && p.to > 0 ? p.to : 1, wt = kq.map(function (x, i) { return i === 0 ? to1 : 1; });
        var W = wt.reduce(function (a, b) { return a + b; }, 0), mW = wt.reduce(function (a, b, i) { return a + (thuan[i] ? b : 0); }, 0);
        var w = RONG / W, dd = doan(t, P.don[0], P.don[1]), cs = 0, ct = 0, cg = 0;
        ra.phan = kq.map(function (x, i) {
          var goc = cg, dich = thuan[i] ? cs : mW + ct;
          cg += wt[i];
          if (thuan[i]) cs += wt[i]; else ct += wt[i];
          return { x: X0 + w * C.noiSuy(goc, dich, dd), w: w * wt[i], thuan: thuan[i], sang: cham[i].sang,
            hien: doan(t, P.thanh[0] + (P.thanh[1] - P.thanh[0]) * 0.7 * i / n, P.thanh[0] + (P.thanh[1] - P.thanh[0]) * (0.7 * i / n + 0.3)) };
        });
        ra.don = dd;
        ra.phanSang = mW / W;
        ra.to = to1; ra.mW = mW; ra.W = W;
        ra.pha = phaDongKhaNang(kq[0], m, n, mW, W, to1);
        ra.mocThanh = doan(t, P.thanh[0], P.thanh[1]);
      }
      return ra;
    }
  });
  C.lay('luoiKetQua').ve = function (svg, k, p, t, o) {
    var mk = C.mk, st = p.trangThai, giai = st === 'giai', xep = k.xep, R = xep.R, anM = o.anSo && !giai;
    var mauSang = st === 'nguoc' ? '--sai' : '--cc';
    // Nhãn tiêu đề của biến cố
    if (k.bienCo && k.bienCo.ten) {
      var tieu = k.bienCo.ten, co0 = Math.min(5, 190 / Math.max(10, tieu.length));
      C.chu(svg, 50, 5.5, tieu, co0, '--cc');
    }
    if (xep.goc) {
      var g = xep.goc;
      mk('rect', { x: g.x, y: g.y, width: g.o * g.N, height: g.o * g.N, fill: 'none', stroke: 'var(--nhat)', 'stroke-width': 0.2, 'data-soi': 'luoi' }, svg);
      for (var i = 1; i < g.N; i++) {
        mk('line', { x1: g.x + i * g.o, y1: g.y, x2: g.x + i * g.o, y2: g.y + g.N * g.o, stroke: 'var(--nhat)', 'stroke-width': 0.12, opacity: 0.6 }, svg);
        mk('line', { x1: g.x, y1: g.y + i * g.o, x2: g.x + g.N * g.o, y2: g.y + i * g.o, stroke: 'var(--nhat)', 'stroke-width': 0.12, opacity: 0.6 }, svg);
      }
      var coTD = g.N === 2 ? 4.6 : 3.6;
      xep.tieuDe.forEach(function (q) { C.chu(svg, q.x, q.y, q.chu, coTD, '--nhat'); });
      C.chu(svg, g.x - 1, g.y - 7.2, xep.tenTruc[1] + ' →', 3.6, '--nhat', trai('--nhat'));
      C.chu(svg, g.x - 8.5, g.y + g.N * g.o / 2, xep.tenTruc[0], 3.6, '--nhat', { transform: 'rotate(-90 ' + (g.x - 8.5) + ' ' + (g.y + g.N * g.o / 2) + ')' });
    }
    xep.nhanNhom.forEach(function (q) { C.chu(svg, q.x, q.y, q.chu, 4.2, null, { style: 'fill:' + to(q.mau) + ';text-anchor:start', 'data-soi': 'nhom' }); });
    // Lúc còn gộp: chấm đầu mỗi nhóm ghi số vật của nhóm
    // Chấm đầu nhóm vẽ sau cùng để số ×n lúc gộp không bị che
    k.cham.slice().sort(function (a, b) { return (a.dau ? 1 : 0) - (b.dau ? 1 : 0); }).forEach(function (c) {
      if (k.coGom && !c.dau && k.tach < 0.02) return;
      var gr = k.nhom[c.g] || {}, mauNhom = gr.mau || (k.nhom.length ? MAU_NHOM[c.g % MAU_NHOM.length] : '--b');
      var choi = st === 'chiaKhong' && !c.thuan;
      var gc = mk('g', null, svg), sang = st === 'nguoc' ? (c.thuan ? 0 : k.sangXong) : c.sang, khoa = c.thuan && sang > 0.5 ? 'sang' : 'cham';
      // Thử phá: ô đầu to hơn thì chấm của nó vẽ to hơn, viền đứt đỏ
      var R1 = c.dauTien && k.to > 1 ? R * (1 + 0.2 * (k.to - 1)) : R;
      mk('circle', { cx: c.x, cy: c.y, r: R1, fill: 'var(--mat)', stroke: choi || R1 > R ? 'var(--sai)' : to(mauNhom), 'stroke-width': choi ? 0.9 : 0.5, 'stroke-dasharray': R1 > R ? '1 0.6' : null, 'data-soi': khoa }, gc);
      if (sang > 0) mk('circle', { cx: c.x, cy: c.y, r: R1 * (0.55 + 0.45 * sang), fill: 'var(' + mauSang + ')', opacity: sang, 'data-soi': khoa }, gc);
      if (c.danhDau) mk('circle', { cx: c.x, cy: c.y, r: R + 0.8, fill: 'none', stroke: 'var(--a)', 'stroke-width': 0.6, 'stroke-dasharray': '1 0.6' }, gc);
      var gomChu = k.coGom && c.dau && k.tach < 0.5 && gr.so > 1;
      var nhan = gomChu ? '×' + (k.nhom[c.g].so || '') : c.nhan;
      if (k.coGom && !c.dau && k.tach < 0.02) return;
      if (nhan && xep.co >= 1.6) C.chu(gc, c.x, c.y + 0.15, nhan, gomChu ? Math.max(xep.co, 3.4) : xep.co, null,
        { style: 'fill:' + (sang > 0.5 ? 'var(--mat)' : to(mauNhom)) });
    });
    var y = xep.day + 2;
    // Đếm loại (lúc còn gộp)
    if (k.coGom && k.tach < 1) {
      var soLoai = k.nhom.filter(function (gr, gi) { return k.cham.some(function (c) { return c.g === gi; }); }).length;
      C.chu(svg, 50, y + 4, o.chuGom || ('Gộp theo loại: ' + soLoai + ' loại'), 4.8, '--sai', { opacity: 1 - k.tach });
      if (!k.chia && (k.soHien || giai)) y += 7;
    }
    if (k.chia) {
      var by = y + (k.coGom ? 9 : 3), bh = 7;
      mk('rect', { x: X0, y: by, width: RONG, height: bh, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 0.35, 'data-soi': 'thanh' }, svg);
      k.phan.forEach(function (q) {
        if (q.hien <= 0) return;
        var choi = st === 'chiaKhong' && !q.thuan;
        mk('rect', { x: q.x + 0.15, y: by + 0.15, width: Math.max(0, q.w - 0.3), height: bh - 0.3, opacity: q.hien,
          fill: q.sang > 0 ? 'var(--cc)' : 'var(--b)', 'fill-opacity': q.sang > 0 ? 0.25 + 0.65 * q.sang : 0.12,
          stroke: choi ? 'var(--sai)' : 'none', 'stroke-width': 0.5, 'data-soi': q.sang > 0 ? 'phanSang' : 'thanh' }, svg);
      });
      C.chu(svg, X0, by + bh + 4, '0', 4.2, '--nhat');
      C.chu(svg, X0 + RONG, by + bh + 4, '1', 4.2, '--nhat');
      var duoi = by + bh + 9.5;
      var hong = k.pha && k.pha.hong;
      if (k.mocThanh > 0 && k.don < 0.5) C.chu(svg, 50, duoi, hong ? 'Ô ' + k.cham[0].nhan + ' to gấp ' + k.to + ': các phần không bằng nhau' : 'Mỗi chấm một phần bằng nhau: 1/' + k.n, 4.6, hong ? '--sai' : '--b', { opacity: k.mocThanh * (1 - 2 * k.don) });
      if (k.don > 0) {
        var cuoi = X0 + RONG * k.phanSang;
        mk('line', { x1: cuoi, y1: by - 1.5, x2: cuoi, y2: by + bh + 1.5, stroke: 'var(--cc)', 'stroke-width': 0.5, opacity: k.don }, svg);
        if (hong) {
          // Chỗ công thức đếm chỉ tới (m/n), lệch khỏi chỗ phần sáng thật kết thúc
          var xd = X0 + RONG * k.m / k.n;
          mk('line', { x1: xd, y1: by - 2.5, x2: xd, y2: by + bh + 2.5, stroke: 'var(--sai)', 'stroke-width': 0.5, 'stroke-dasharray': '1 0.6', opacity: k.don, 'data-soi': 'pha' }, svg);
        }
        if (k.soHien || giai) C.chu(svg, 50, duoi, anM ? 'Phần sáng = ? phần' : hong ? 'Đếm: ' + k.m + '/' + k.n + ', nhưng phần sáng thật là ' + phanSo(k.mW, k.W) : 'Phần sáng = ' + k.m + ' phần = ' + phanSo(k.m, k.n), hong ? 4.2 : 4.8, hong ? '--sai' : '--cc');
      }
      // Số em gõ: một vạch trên thanh
      if (la(p.thu)) {
        var xt = X0 + RONG * C.kep(p.thu, 0, 1);
        mk('path', { d: 'M' + xt + ' ' + (by - 0.5) + 'l-1.6 -3h3.2z', fill: 'var(--sai)' }, svg);
        mk('line', { x1: xt, y1: by - 0.5, x2: xt, y2: by + bh + 0.5, stroke: 'var(--sai)', 'stroke-width': 0.6, 'stroke-dasharray': '1 0.6' }, svg);
        C.chu(svg, p.thu > 1 ? 50 : C.kep(xt, 22, 78), duoi + 5.5, (p.thu > 1 ? 'Em gõ ' + soViet(p.thu) + ': dài hơn cả thanh!' : 'Em gõ ' + soViet(p.thu)), 4.4, '--sai');
      }
      y = duoi + (la(p.thu) ? 8.5 : 3);
      // Coi mỗi loại là một kết quả: chia đều thanh theo loại (sai vì các loại không đồng khả năng)
      if (st === 'theoLoai' && k.nhom.length) {
        var G = k.nhom.length, wg = RONG / G, by2 = y + 6;
        C.chu(svg, 50, by2 - 3, 'Nếu coi mỗi loại là một kết quả: mỗi loại 1/' + G, 4.2, '--sai');
        k.nhom.forEach(function (gr, gi) {
          var tl = k.cham.some(function (c) { return c.g === gi && c.thuan; });
          mk('rect', { x: X0 + gi * wg + 0.15, y: by2, width: wg - 0.3, height: bh, fill: tl ? 'var(--sai)' : 'var(--nhat)', 'fill-opacity': tl ? 0.4 : 0.12, stroke: 'var(--sai)', 'stroke-width': 0.25 }, svg);
          var tenNgan = gr.ten.length * 2.2 < wg - 2 ? gr.ten : gr.ten.slice(0, Math.max(1, Math.floor((wg - 2) / 2.2)));
          C.chu(svg, X0 + (gi + 0.5) * wg, by2 + bh / 2 + 0.2, tenNgan, 3.4, null, { style: 'fill:var(--muc)' });
        });
        y = by2 + bh + 2;
      }
    }
    // Dòng đếm
    if (k.soHien || giai) {
      var dong = k.n + ' kết quả có thể';
      if (k.bienCo) dong += ', ' + (anM ? '?' : k.m) + ' chấm sáng';
      C.chu(svg, 50, y + 5, dong, 5, k.bienCo ? '--muc' : '--b');
      y += 6;
      if (p.danhDau) k.nhom.forEach(function (gr) { if (gr.danhDau) { C.chu(svg, 50, y + 5, gr.danhDau.chu, 4.3, '--a'); y += 5.5; } });
      if (k.moiBienCo && !anM) k.moiBienCo.forEach(function (b) {
        if (b.dangXem) return;
        var dongBC = b.ten + ': ' + (k.chia ? phanSo(b.m, k.n) : b.m + ' kết quả thuận lợi');
        C.chu(svg, 50, y + 5, dongBC, coVua(dongBC), b.dangXem ? '--cc' : '--muc');
        y += 5.5;
      });
    } else y += 6;
    svg.setAttribute('viewBox', '0 0 100 ' + Math.max(30, y + 3));
  };

  // Soi chi tiết: số chấm sáng chỉ nói khi hình đang không giấu số (anSo), để không lộ đáp số bài tập
  C.lay('luoiKetQua').soi = function (k, p, o) {
    var anM = o.anSo && p.trangThai !== 'giai', ten = k.bienCo && k.bienCo.ten, hong = k.pha && k.pha.hong;
    var ra = {
      cham: { tieuDe: 'Một chấm', chu: 'Mỗi chấm là **một** kết quả có thể' + (anM ? '.' : ': có tất cả $' + k.n + '$ chấm.') + (k.coGom ? ' Các vật cùng loại vẫn là những chấm khác nhau, vì lấy ra thì được một vật cụ thể.' : '') +
        (hong ? ' Chấm ' + k.cham[0].nhan + ' viền đỏ to gấp $' + soTex(k.to) + '$ chấm khác, nên dễ xảy ra hơn.' : '') },
      sang: { tieuDe: 'Chấm sáng', chu: 'Chấm sáng là kết quả **thuận lợi**' + (ten ? ' cho biến cố «' + ten + '»' : '') + ': nó xảy ra thì biến cố xảy ra. ' + (anM ? 'Em tự đếm các chấm sáng.' : 'Có $' + k.m + '$ chấm sáng.') }
    };
    if (k.chia) {
      ra.thanh = { tieuDe: 'Thanh xác suất', chu: 'Cả thanh dài $1$, vì chắc chắn xảy ra một kết quả nào đó. ' + (hong ? 'Ô ' + k.cham[0].nhan + ' to gấp $' + soTex(k.to) + '$ nên được phần to gấp $' + soTex(k.to) + '$: các phần **không** bằng nhau.'
        : 'Các kết quả đồng khả năng nên thanh chia đều cho $' + k.n + '$ chấm, mỗi phần $\\frac{1}{' + k.n + '}$.') };
      ra.phanSang = { tieuDe: 'Phần sáng', chu: anM ? 'Phần sáng là tổng các phần của chấm sáng. Đếm số phần sáng rồi so với cả thanh.'
        : hong ? 'Phần sáng thật dài $\\frac{' + soTex(k.mW) + '}{' + soTex(k.W) + '} ' + gan3(k.mW / k.W) + '$ thanh, không bằng $\\frac{' + k.m + '}{' + k.n + '}$ mà công thức đếm cho.'
        : 'Gồm $' + k.m + '$ phần, mỗi phần $\\frac{1}{' + k.n + '}$, nên dài $\\frac{' + k.m + '}{' + k.n + '}$ cả thanh. Đó là xác suất của biến cố.' };
      if (hong) ra.pha = { tieuDe: 'Vạch đứt đỏ', chu: 'Vạch đứt đỏ ở $\\frac{' + k.m + '}{' + k.n + '}$, chỗ công thức đếm chỉ tới. Phần sáng thật kết thúc ở chỗ khác, vì các kết quả không đồng khả năng.' };
    }
    if (k.nhom.length) ra.nhom = { tieuDe: 'Nhóm', chu: anM ? 'Các vật xếp theo nhóm cho dễ đếm. Mỗi vật trong nhóm vẫn là một chấm riêng.'
      : 'Các vật xếp theo nhóm cho dễ đếm: ' + k.nhom.map(function (g) { return g.ten + ' $' + g.so + '$'; }).join(', ') + '. Mỗi vật trong nhóm vẫn là một chấm riêng.' };
    if (k.xep.goc) ra.luoi = { tieuDe: 'Bảng hai chiều', chu: 'Hàng là kết quả của cái thứ nhất, cột là kết quả của cái thứ hai. Mỗi ô là một cặp: có $' + k.xep.goc.N + ' \\cdot ' + k.xep.goc.N + ' = ' + (k.xep.goc.N * k.xep.goc.N) + '$ ô.' };
    return ra;
  };

  /* ================= Mỗi lần thử là một ô ================= */
  // Biến cố đang xét của bảng theo nhóm: o.bienCo[p.chon] hoặc o.nhomThuan
  function bienCoLanThu(o, p) {
    if (!o.bienCo || !o.bienCo.length) return { ten: o.tieuDe, nhom: o.nhomThuan || [] };
    var i = la(p.chon) ? Math.round(C.kep(p.chon, 0, o.bienCo.length - 1)) : 0;
    return o.bienCo[i];
  }
  function dsLanThu(o, p) {
    var o2 = [], k = 0, n = 0;
    if (o.nhom) {
      var nt = bienCoLanThu(o, p).nhom || [];
      o.nhom.forEach(function (gr, gi) {
        if (!(gr.so >= 0) || Math.round(gr.so) !== gr.so) throw new Error('lanThu: số lượng nhóm lạ: ' + gr.so);
        var tl = nt.indexOf(gr.ten) >= 0;
        n += gr.so;
        if (tl) k += gr.so;
      });
      // Ít lần thì vẽ từng ô; nhiều quá thì chỉ vẽ thanh
      if (n <= 400) o.nhom.forEach(function (gr, gi) { var tl = nt.indexOf(gr.ten) >= 0; for (var i = 0; i < gr.so; i++) o2.push({ thuan: tl, g: gi }); });
    } else {
      n = o.n; k = o.k;
      if (!(n >= 1) || !(k >= 0) || k > n || Math.round(n) !== n || Math.round(k) !== k) throw new Error('lanThu: n, k lạ: ' + n + ', ' + k);
      if (n <= 400) o2 = viTriSang(n, k, o.hat || 7).map(function (b) { return { thuan: b, g: 0 }; });
    }
    if (!n) throw new Error('lanThu: chưa có lần thử nào');
    return { o: o2, n: n, k: k };
  }
  C.dangKi('lanThu', {
    tinh: function (p, t, o) {
      var bc = o.nhom ? bienCoLanThu(o, p) : null;
      var d = dsLanThu(o, p), n = d.n, k = d.k, luoi = !o.thanh && !o.duBao && n <= 200 && d.o.length === n;
      var chuNgan = !!o.nhom && o.nhom.every(function (gr) { return (gr.viet || gr.ten).length <= 3; });
      var moiBC = o.nhom && (o.bienCo || []).length > 1 ? o.bienCo.map(function (b) { var s = 0; o.nhom.forEach(function (gr) { if ((b.nhom || []).indexOf(gr.ten) >= 0) s += gr.so; }); return { ten: b.ten, k: s, dangXem: b === bc }; }) : null;
      var ra = { chuNgan: chuNgan, moiBienCo: moiBC, n: n, k: k, tiLe: k / n, luoi: luoi, soHien: t >= 0.88 - 1e-9 ? 1 : 0, tieuDe: bc && bc.ten ? bc.ten : o.tieuDe };
      if (luoi) {
        var cot = n <= 60 ? 10 : 20, s = Math.min(9, RONG / cot), bx = (100 - cot * s) / 2, top = 12;
        var rs = 0, rt = 0, gom = doan(t, 0.55, 0.8), daSang = 0, daHien = 0;
        ra.o = d.o.map(function (x, i) {
          var dich = x.thuan ? rs++ : k + rt++;
          var vt = C.noiSuy(i, dich, gom), hien = doan(t, 0.08 + 0.4 * i / n, 0.08 + 0.4 * i / n + 0.06);
          if (hien >= 1) { daHien++; if (x.thuan) daSang++; }
          // Ô trượt theo đường thẳng từ chỗ cũ tới chỗ mới
          var xn = bx + (i % cot) * s, yn = top + Math.floor(i / cot) * s, xd = bx + (dich % cot) * s, yd = top + Math.floor(dich / cot) * s;
          return { x: C.noiSuy(xn, xd, gom), y: C.noiSuy(yn, yd, gom), s: s, thuan: x.thuan, g: x.g, hien: hien };
        });
        ra.day = top + Math.ceil(n / cot) * s;
        ra.daHien = daHien; ra.daSang = daSang;
        ra.thanh = daSang / n;
        ra.gom = gom;
      } else {
        // Thanh: dài theo số lần; phần sáng theo tỉ lệ
        var m = o.duBao || 0, L1 = m > n ? RONG * n / m : RONG, L2 = m ? (m > n ? RONG : RONG * m / n) : 0;
        ra.L1 = L1 * doan(t, 0.08, 0.35);
        ra.sang1 = L1 * (k / n) * doan(t, 0.4, 0.6);
        if (m) { ra.m = m; ra.duDoan = m * k / n; ra.L2 = L2 * doan(t, 0.62, 0.78); ra.sang2 = L2 * (k / n) * doan(t, 0.8, 0.92); ra.L2Day = L2; }
        ra.L1Day = L1;
        if (o.nhom) {
          var tu = 0, nt = bc.nhom || [];
          ra.doanNhom = o.nhom.map(function (gr) { var q = { tu: tu, w: L1 * gr.so / n, ten: gr.ten, thuan: nt.indexOf(gr.ten) >= 0 }; tu += q.w; return q; });
        }
        ra.thanh = k / n * doan(t, 0.4, 0.6);
      }
      return ra;
    }
  });
  C.lay('lanThu').ve = function (svg, k, p, t, o) {
    var mk = C.mk, st = p.trangThai, giai = st === 'giai', anK = o.anSo && !giai, tenCo = o.tenCo || '', dv = o.donVi || 'lần', y;
    if (k.tieuDe) C.chu(svg, 50, 5.5, k.tieuDe, Math.min(5, 190 / Math.max(10, k.tieuDe.length)), '--cc');
    if (k.luoi) {
      k.o.forEach(function (q) {
        if (q.hien <= 0) return;
        var mauNhom = o.nhom ? (o.nhom[q.g].mau || MAU_NHOM[q.g % MAU_NHOM.length]) : '--b', choi = st === 'chiaKhong' && !q.thuan;
        mk('rect', { x: q.x + 0.35, y: q.y + 0.35, width: q.s - 0.7, height: q.s - 0.7, rx: 0.6, opacity: q.hien,
          fill: q.thuan ? 'var(--cc)' : 'var(--mat)', 'fill-opacity': q.thuan ? 0.85 : 1, stroke: choi ? 'var(--sai)' : to(mauNhom), 'stroke-width': choi ? 0.8 : 0.3 }, svg);
        var chu = o.nhom ? (k.chuNgan ? (o.nhom[q.g].viet || o.nhom[q.g].ten) : '') : (q.thuan ? tenCo : (o.tenKhong || ''));
        if (chu && q.s >= 6 && chu.length <= 3) C.chu(svg, q.x + q.s / 2, q.y + q.s / 2 + 0.2, chu, Math.min(4, q.s * 0.45), null,
          { style: 'fill:' + (q.thuan ? 'var(--mat)' : to(mauNhom)), opacity: q.hien });
      });
      y = k.day + 3;
      // Thanh tỉ lệ: phần sáng / cả thanh = ô sáng / tất cả ô
      var by = y + (la(p.thu) ? 7 : 2), bh = 6;
      mk('rect', { x: X0, y: by, width: RONG, height: bh, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 0.35 }, svg);
      mk('rect', { x: X0, y: by, width: RONG * k.thanh, height: bh, fill: 'var(--cc)', 'fill-opacity': 0.8 }, svg);
      C.chu(svg, X0, by + bh + 3.8, '0', 4, '--nhat');
      C.chu(svg, X0 + RONG, by + bh + 3.8, '1', 4, '--nhat');
      veMoc(svg, k, p, o, by, bh, st);
      y = by + bh + 8.5;
      var dong = k.soHien || giai
        ? (anK ? '? ô sáng trong ' + k.n + ' ô' : k.k + ' ô sáng trong ' + k.n + ' ô: ' + phanSo(k.k, k.n))
        : (dv === 'lần' ? 'Đã thử ' : 'Đã ghi ') + k.daHien + ' ' + dv + (anK ? '' : ', ' + k.daSang + ' ' + dv + ' sáng');
      C.chu(svg, 50, y + 1.5, dong, 4.8, k.soHien || giai ? '--cc' : '--muc');
      y += 5;
      if (k.moiBienCo && !anK && (k.soHien || giai)) k.moiBienCo.forEach(function (b) {
        if (b.dangXem) return;
        C.chu(svg, 50, y + 3, b.ten + ': ' + phanSo(b.k, k.n), coVua(b.ten + ': ' + phanSo(b.k, k.n)), b.dangXem ? '--cc' : '--muc');
        y += 5.5;
      });
    } else {
      y = k.tieuDe ? 12 : 6;
      var bh2 = 8, nhan1 = o.nhan1 || (soLon(k.n) + ' ' + dv);
      C.chu(svg, X0, y + 1, nhan1, 4.4, null, trai('--b'));
      y += 3.5;
      mk('rect', { x: X0, y: y, width: k.L1, height: bh2, fill: 'var(--b)', 'fill-opacity': 0.12, stroke: 'var(--b)', 'stroke-width': 0.3 }, svg);
      var keo = k.L1Day ? k.L1 / k.L1Day : 0, phanSang = k.L1Day ? k.sang1 / (k.L1Day * k.tiLe || 1) : 0;
      if (k.doanNhom) k.doanNhom.forEach(function (q) {
        var x = X0 + q.tu * keo, w = q.w * keo;
        // Bảng theo nhóm: chính các đoạn của nhóm thuận lợi sáng lên
        if (q.thuan && phanSang > 0) mk('rect', { x: x, y: y, width: w * phanSang, height: bh2, fill: 'var(--cc)', 'fill-opacity': 0.8 }, svg);
        mk('line', { x1: x, y1: y, x2: x, y2: y + bh2, stroke: 'var(--b)', 'stroke-width': 0.3 }, svg);
        if (w > q.ten.length * 2.1 + 1) C.chu(svg, x + w / 2, y + bh2 + 3.6, q.ten, 3.5, q.thuan ? '--cc' : '--nhat');
      });
      else if (k.sang1 > 0) mk('rect', { x: X0, y: y, width: k.sang1, height: bh2, fill: 'var(--cc)', 'fill-opacity': 0.8 }, svg);
      var by3 = y;
      y += bh2 + (k.doanNhom ? 4.5 : 0);
      if (k.soHien || giai) C.chu(svg, X0, y + 4, ((o.bienCo && k.tieuDe) || tenCo || 'Xảy ra') + ': ' + (anK ? '?' : tiLeChu(k.k, k.n)), 4.4, null, trai('--cc'));
      y += 6;
      if (k.moiBienCo && !anK && (k.soHien || giai)) k.moiBienCo.forEach(function (b) {
        if (b.dangXem) return;
        C.chu(svg, X0, y + 4, b.ten + ': ' + tiLeChu(b.k, k.n), coVua(b.ten + ': ' + tiLeChu(b.k, k.n)), null, trai('--muc'));
        y += 5.5;
      });
      if (!k.m) veMoc(svg, { thanh: k.tiLe }, p, o, by3, bh2, st, k.L1Day);
      if (k.m) {
        y += 3;
        C.chu(svg, X0, y + 1, o.nhan2 || (soLon(k.m) + ' ' + dv + ' mới'), 4.4, null, trai('--a'));
        y += 3.5;
        mk('rect', { x: X0, y: y, width: k.L2, height: bh2, fill: 'var(--a)', 'fill-opacity': 0.12, stroke: 'var(--a)', 'stroke-width': 0.3 }, svg);
        if (k.sang2 > 0) mk('rect', { x: X0, y: y, width: k.sang2, height: bh2, fill: 'var(--cc)', 'fill-opacity': 0.8 }, svg);
        if (la(p.thu)) {
          var xt = X0 + k.L2Day * C.kep(p.thu / k.m, 0, 1);
          mk('line', { x1: xt, y1: y - 1.5, x2: xt, y2: y + bh2 + 1.5, stroke: 'var(--sai)', 'stroke-width': 0.6, 'stroke-dasharray': '1 0.6' }, svg);
          C.chu(svg, p.thu > k.m ? 50 : C.kep(xt, 14, 86), y + bh2 + 4.5, 'Em gõ ' + soViet(p.thu) + (p.thu > k.m ? ': nhiều hơn cả ' + soLon(k.m) + '!' : ''), 4.2, '--sai');
          y += 6;
        }
        y += bh2;
        if (k.soHien || giai) C.chu(svg, X0, y + 4.5, anK ? 'Khoảng ? ' + dv + ' (giữ đúng tỉ lệ)' : 'Khoảng ' + soLon(k.m) + ' · ' + phanSo(k.k, k.n).split(' = ').pop() + ' ' + (Math.abs(k.duDoan - Math.round(k.duDoan)) < 1e-9 ? '= ' : '≈ ') + soViet(k.duDoan) + ' ' + dv, 4.4, null, trai('--cc'));
        y += 7;
      }
    }
    svg.setAttribute('viewBox', '0 0 100 ' + Math.max(26, y + 2));
  };
  // "35/100 = 7/20"; số lớn thì "116 880/240 000 ≈ 0,487"
  function tiLeChu(k, n) {
    if (n < 1000) return phanSo(k, n);
    var v = k / n, r = Math.round(v * 1000) / 1000;
    return soLon(k) + '/' + soLon(n) + (Math.abs(v - r) < 1e-12 ? ' = ' : ' ≈ ') + String(r).replace('.', ',');
  }
  // Vạch xác suất lí thuyết và số em gõ trên thanh tỉ lệ
  function veMoc(svg, k, p, o, by, bh, st, dai) {
    var mk = C.mk, L = dai || RONG;
    if (la(o.p) && (o.hienP || st === 'lyThuyet')) {
      var xp = X0 + L * o.p;
      mk('line', { x1: xp, y1: by - 2.5, x2: xp, y2: by + bh + 1, stroke: 'var(--tg)', 'stroke-width': 0.55, 'stroke-dasharray': '1.2 0.8' }, svg);
      C.chu(svg, C.kep(xp, 24, 76), by + bh + 3.8, 'Xác suất ' + (o.pNhan || soViet(o.p)), 4, '--tg');
    }
    if (la(p.thu) && !k.m) {
      var xt = X0 + L * C.kep(p.thu, 0, 1);
      mk('path', { d: 'M' + xt + ' ' + (by - 0.3) + 'l-1.6 -3h3.2z', fill: 'var(--sai)' }, svg);
      mk('line', { x1: xt, y1: by - 0.3, x2: xt, y2: by + bh + 0.5, stroke: 'var(--sai)', 'stroke-width': 0.6, 'stroke-dasharray': '1 0.6' }, svg);
      C.chu(svg, C.kep(xt, 14, 86), by - 4.6, p.thu > 1 ? 'Em gõ ' + soViet(p.thu) + ' > 1' : 'Em gõ ' + soViet(p.thu), 4, '--sai');
    }
  }

  /* ================= Mô phỏng: rút bi có trả lại ================= */
  // Hạt giống của từng "lần chạy" (thanh trượt 1–9)
  var HAT = [0, 2024, 77, 1302, 4141, 512, 9001, 333, 6060, 4242];
  function chayMoPhong(o, hat) {
    var nhom = o.nhom || [{ ten: 'Đỏ', so: 3 }, { ten: 'Xanh', so: 2 }], thuan = o.thuan || [nhom[0].ten];
    var tong = 0, tl = 0;
    nhom.forEach(function (g) { tong += g.so; if (thuan.indexOf(g.ten) >= 0) tl += g.so; });
    var N = o.N || 1000, r = sinhNgauNhien(hat), dem = [0], k = 0;
    for (var i = 1; i <= N; i++) { if (Math.floor(r() * tong) < tl) k++; dem.push(k); }
    return { N: N, p: tl / tong, tl: tl, tong: tong, dem: dem };
  }
  C.dangKi('moPhong', {
    thamSo: { hat: { min: 1, max: 9, step: 1, md: 5, nhan: 'Lần chạy', mau: '--a' } },
    tinh: function (p, t, o) {
      var h = la(p.hat) ? Math.round(C.kep(p.hat, 1, 9)) : 5, mp = chayMoPhong(o, HAT[h]), N = mp.N, logN = Math.log(N);
      var u = (t - 0.08) / 0.92, n = t < 0.08 ? 0 : Math.max(1, Math.min(N, Math.round(Math.exp(u * logN))));
      var diem = [], buoc = 1;
      for (var i = 1; i <= n; i += buoc) {
        diem.push([Math.log(i) / logN, mp.dem[i] / i]);
        buoc = i < 60 ? 1 : Math.ceil(i / 60);
      }
      if (n && (!diem.length || diem[diem.length - 1][0] !== Math.log(n) / logN)) diem.push([Math.log(n) / logN, mp.dem[n] / n]);
      return { N: N, n: n, k: n ? mp.dem[n] : 0, tiLe: n ? mp.dem[n] / n : null, p: mp.p, tl: mp.tl, tong: mp.tong, diem: diem, hat: h };
    }
  });
  C.lay('moPhong').soi = function (k, p, o) {
    var nhom = o.nhom || [{ ten: 'Đỏ', so: 3 }, { ten: 'Xanh', so: 2 }], tiLe = k.n ? Math.round(k.tiLe * 1000) / 1000 : null;
    return {
      tui: { tieuDe: 'Túi bi', chu: 'Túi có ' + nhom.map(function (g) { return '$' + g.so + '$ bi ' + g.ten.toLowerCase(); }).join(' và ') + '. Rút một viên, ghi màu, rồi **trả lại** túi, nên lần nào túi cũng như cũ.' },
      xacSuat: { tieuDe: 'Đường đứt nét: xác suất', chu: 'Các viên bi đồng khả năng nên xác suất là $\\frac{' + k.tl + '}{' + k.tong + '} = ' + soTex(Math.round(k.p * 1000) / 1000) + '$. Số này không đổi, dù rút bao nhiêu lần.' },
      tiLe: { tieuDe: 'Đường cam: tỉ lệ $\\frac{k}{n}$', chu: k.n ? 'Sau $n = ' + k.n + '$ lần có $k = ' + k.k + '$ lần thuận lợi, tỉ lệ $\\frac{k}{n} ' + gan3(k.tiLe) + '$. Đó là xác suất thực nghiệm. Lúc $n$ nhỏ đường nhảy nhiều, $n$ lớn thì đường dồn về gần đường đứt nét.' : 'Chưa rút lần nào.' },
      cuoi: { tieuDe: 'Lần rút mới nhất', chu: k.n ? 'Ở $n = ' + k.n + '$: tỉ lệ $' + soTex(tiLe) + '$, lệch xác suất khoảng $' + soTex(Math.round(Math.abs(k.tiLe - k.p) * 1000) / 1000) + '$. Lệch nhỏ dần khi $n$ lớn, nhưng hiếm khi bằng $0$.' : 'Chưa rút lần nào.' },
      truc: { tieuDe: 'Trục số lần rút', chu: 'Trục ngang chia theo bậc gấp $10$: $1$, $10$, $100$, $1000$. Nhờ vậy thấy được cả lúc mới rút vài lần lẫn lúc đã rút $' + k.N + '$ lần.' }
    };
  };
  C.lay('moPhong').ve = function (svg, k, p, t, o) {
    var mk = C.mk, L = 13, Rr = 95, T = 15, D = 62, N = k.N;
    var X = function (u) { return L + (Rr - L) * u; }, Y = function (v) { return D - (D - T) * v; };
    svg.setAttribute('viewBox', '0 0 100 74');
    // Túi bi nhỏ ở góc
    var nhom = o.nhom || [{ ten: 'Đỏ', so: 3, mau: '#e03131' }, { ten: 'Xanh', so: 2, mau: '#1971c2' }], j = 0;
    nhom.forEach(function (g) { for (var i = 0; i < g.so; i++) { mk('circle', { cx: 4 + j * 3.4, cy: 4.5, r: 1.4, fill: to(g.mau), 'data-soi': 'tui' }, svg); j++; } });
    C.chu(svg, 4 + j * 3.4 + 1, 5, k.n ? 'n = ' + soLon(k.n) + '   k = ' + soLon(k.k) + '   k/n ' + (Math.abs(k.tiLe * 1000 - Math.round(k.tiLe * 1000)) > 1e-9 ? '≈ ' : '= ') + String(Math.round(k.tiLe * 1000) / 1000).replace('.', ',') : 'Chưa rút lần nào', 4.6, null, trai(k.n ? '--a' : '--nhat'));
    // Lưới và trục
    [0, 0.5, 1].forEach(function (v) {
      mk('line', { x1: L, y1: Y(v), x2: Rr, y2: Y(v), stroke: 'var(--nhat)', 'stroke-width': 0.15, opacity: 0.5 }, svg);
      C.chu(svg, L - 1.5, Y(v), C.fmt(v), 3.8, '--nhat', phai('--nhat'));
    });
    var vach = [1, 10, 100, 1000, 10000].filter(function (v) { return v <= N; });
    vach.forEach(function (v) {
      var x = X(Math.log(v) / Math.log(N));
      mk('line', { x1: x, y1: T, x2: x, y2: D, stroke: 'var(--nhat)', 'stroke-width': 0.15, opacity: 0.5 }, svg);
      C.chu(svg, x, D + 3.6, soLon(v), 3.8, '--nhat');
    });
    C.chu(svg, (L + Rr) / 2, D + 8.6, 'Số lần rút n (mỗi vạch gấp 10 lần)', 3.8, '--nhat', { 'data-soi': 'truc' });
    mk('line', { x1: L, y1: D, x2: Rr, y2: D, stroke: 'var(--muc)', 'stroke-width': 0.35, 'data-soi': 'truc' }, svg);
    mk('line', { x1: L, y1: T - 1, x2: L, y2: D, stroke: 'var(--muc)', 'stroke-width': 0.35 }, svg);
    // Xác suất
    mk('line', { x1: L, y1: Y(k.p), x2: Rr, y2: Y(k.p), stroke: 'var(--cc)', 'stroke-width': 0.6, 'stroke-dasharray': '1.6 1', 'data-soi': 'xacSuat' }, svg);
    C.chu(svg, Rr, T - 3, '- - xác suất ' + k.tl + '/' + k.tong + ' = ' + soViet(k.p), 4, '--cc', phai('--cc'));
    // Tỉ lệ thực nghiệm
    if (k.diem.length) {
      mk('polyline', { points: k.diem.map(function (q) { return X(q[0]) + ',' + Y(q[1]); }).join(' '), fill: 'none', stroke: 'var(--a)', 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'data-soi': 'tiLe' }, svg);
      var c = k.diem[k.diem.length - 1];
      mk('circle', { cx: X(c[0]), cy: Y(c[1]), r: 1.1, fill: 'var(--a)', 'data-soi': 'cuoi' }, svg);
    }
    C.chu(svg, L + 1, T - 3, 'Tỉ lệ k/n', 4, '--a', trai('--a'));
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
