// Cảnh cho chương II: lập phương của tổng/hiệu (khối 3D cắt thành 8 khối), tổng/hiệu hai lập phương (khối bỏ góc tách thành 3 tấm),
// phân tích nhân tử (xếp các mảnh thành một hình chữ nhật, hai cạnh là hai nhân tử).
(function (C) {
  'use strict';
  var TIM = '#9c36b5';
  // a−b phải dương mới vẽ được: khi b ≥ a thì giữ b nhỏ hơn a nửa đơn vị (như manhVuong)
  function hopLe(p) { return { a: p.a, b: Math.max(0.5, Math.min(p.b, p.a - 0.5)) }; }
  function hop(x, y, z, w, d, h, them) {
    var o = { x: x, y: y, z: z, w: w, d: d, h: h };
    for (var k in them || {}) o[k] = them[k];
    return o;
  }
  // Thứ tự vẽ từ xa tới gần (người nhìn ở phía x lớn, y nhỏ, z lớn): đúng cho các khối xếp theo lưới
  function xep(ds) { return ds.slice().sort(function (p, q) { return (p.x + p.w / 2 - p.y - p.d / 2 + p.z + p.h / 2) - (q.x + q.w / 2 - q.y - q.d / 2 + q.z + q.h / 2); }); }
  var TEN_LOAI = ['a3', 'a2b', 'ab2', 'b3'];

  // Khối lập phương chia mỗi cạnh thành hai đoạn; doan[trục] = [{ bat, dai, laB }]; tach: khoảng hở giữa các khối.
  // Theo chiều sâu và chiều đứng hở nhiều hơn, để nhìn được cả khối nấp ở góc sau, dưới.
  function tamKhoi(doan, tach, nhac) {
    var ds = [];
    [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { [0, 1].forEach(function (k) {
      var X = doan[0][i], Y = doan[1][j], Z = doan[2][k], nB = X.laB + Y.laB + Z.laB;
      var lech = function (s, he) { return (s === 0 ? -1 : 1) * tach * he / 2; };
      // nhac: nhấc riêng tầng trên lên cao, để thấy mặt trên của khối nấp ở góc sau, trái, dưới
      ds.push(hop(X.bat + lech(i, 1), Y.bat + lech(j, 2.4), Z.bat + lech(k, 2) + (k ? nhac || 0 : 0), X.dai, Y.dai, Z.dai, { o: [i, j, k], nB: nB, loai: TEN_LOAI[nB], laB: [X.laB, Y.laB, Z.laB] }));
    }); }); });
    return ds;
  }

  function lapPhuongTong(p, t) {
    var a = p.a, b = p.b, S = a + b, mo = C.muot((t - 0.1) / 0.45), g = 0.2 * S * mo;
    var d = [{ bat: 0, dai: a, laB: 0 }, { bat: a, dai: b, laB: 1 }];
    var nhac = 0.45 * S * C.muot((t - 0.5) / 0.25), ds = tamKhoi([d, d, d], g, nhac), dem = [0, 0, 0, 0];
    ds.forEach(function (h) {
      var n = dem[h.nB]++;
      if (p.trangThai === 'chiHaiDau' && (h.nB === 1 || h.nB === 2)) h.an = true;
      if (p.trangThai === 'motMoiLoai' && (h.nB === 1 || h.nB === 2) && n > 0) h.an = true;
      if (p.trangThai === 'thieuB3' && h.nB === 3) h.an = true;
    });
    var G = 0.2 * S / 2;
    return { dang: 'tong', a: a, b: b, S: S, hop: xep(ds), doan: [d, d, d], tach: g, nhac: nhac, nhanHien: C.muot((t - 0.55) / 0.2),
      khung3: [[-G, -2.4 * G, -2 * G], [S + G, S + 2.4 * G, S + 2 * G + 0.45 * S]] };
  }
  // (a−b)³: khối cạnh a; bỏ ba tấm a·a·b, trả lại ba thanh a·b·b (bị bỏ hai lần), bỏ khối b³ (bị trả lại hết). Mỗi khối con bị bỏ đúng một lần, trừ khối (a−b)³.
  function lapPhuongHieu(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b, mo = C.muot((t - 0.1) / 0.25), g = 0.16 * a * mo;
    // Đặt khối (a−b)³ ở góc gần người nhìn nhất để luôn thấy rõ
    var dx = [{ bat: 0, dai: b, laB: 1 }, { bat: b, dai: r, laB: 0 }], dy = [{ bat: 0, dai: r, laB: 0 }, { bat: r, dai: b, laB: 1 }], dz = dx;
    var buoc = [0.42, 0.62, 0.82].map(function (m) { return C.muot((t - m) / 0.1); });
    var da = buoc.filter(function (s) { return s > 0.5; }).length;
    var nhac = 0.6 * a * C.muot((t - 0.2) / 0.2), ds = tamKhoi([dx, dy, dz], g, nhac);
    ds.forEach(function (h) {
      var n = h.nB;
      h.lan = (da >= 1 ? n : 0) - (da >= 2 ? n * (n - 1) / 2 : 0) + (da >= 3 && n === 3 ? 1 : 0);
    });
    var G = 0.16 * a / 2;
    return { kep: p.b != null && q.b !== p.b, khung3: [[-G, -2.4 * G, -2 * G], [a + G, a + 2.4 * G, a + 2 * G + 0.6 * a]], dang: 'hieu', a: a, b: b, S: a, r: r, hop: xep(ds), doan: [dx, dy, dz], tach: g, nhac: nhac, giaiDoan: da, buoc: buoc, xong: C.muot((t - 0.92) / 0.08),
    };
  }
  C.dangKi('lapPhuong', {
    thamSo: { a: { min: 1, max: 5, step: 0.5, md: 3, nhan: 'Cạnh a', mau: '--a' }, b: { min: 1, max: 5, step: 0.5, md: 2, nhan: 'Cạnh b', mau: '--b' } },
    trangThai: { chiHaiDau: true, motMoiLoai: true, thieuB3: true },
    tinh: function (p, t, o) {
      var dang = (o && o.dang) || 'tong';
      if (dang === 'tong') return lapPhuongTong(p, t);
      if (dang === 'hieu') return lapPhuongHieu(p, t);
      throw new Error('lapPhuong: dạng lạ ' + dang);
    }
  });

  // a³ − b³: khối cạnh a bỏ góc b³, phần còn lại tách thành ba tấm cùng dày a − b, mặt lần lượt a², ab, b²
  function haiHieu(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b;
    var bo = C.muot((t - 0.1) / 0.25), mo = C.muot((t - 0.4) / 0.35), g = 0.22 * a * mo, nhac = 0.45 * a * bo;
    var tam = [
      hop(0, 0, 0, a, a, r, { ten: 'tam1', mat: 'a2', truc: 2 }),
      hop(-g, 0, r + g, r, a, b, { ten: 'tam2', mat: 'ab', truc: 0 }),
      hop(r, b + g, r + g, b, r, b, { ten: 'tam3', mat: 'b2', truc: 1 })
    ];
    var goc = hop(r, 0, r + g + nhac, b, b, b, { ten: 'goc', hien: 1 - bo });
    var G = 0.22 * a;
    return { kep: p.b != null && q.b !== p.b, dang: 'hieu', a: a, b: b, r: r, S: a, tam: tam, goc: goc, hop: tam.concat([goc]), bo: bo, tach: mo, nhanHien: C.muot((t - 0.75) / 0.15),
      khung3: [[-G, 0, 0], [a, a + G, a + G + 0.45 * a]] };
  }
  // a³ + b³ = (a + b)³ − 3·ab(a + b): sáu khối giữa ghép từng đôi thành ba hộp ab(a + b), bỏ đi thì còn a³ và b³
  var DOI = [[[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [1, 1, 0]], [[0, 0, 1], [0, 1, 1]]];
  function haiTong(p, t) {
    // Tách khối nhanh hơn (xong ở t ≈ 0,4) để còn thời gian ghép đôi và bỏ
    var k = lapPhuongTong({ a: p.a, b: p.b }, Math.min(1, t / 0.75));
    var gom = C.muot((t - 0.5) / 0.15), bo = C.muot((t - 0.72) / 0.18);
    k.hop.forEach(function (h) {
      DOI.forEach(function (d, i) { d.forEach(function (o, m) { if (o[0] === h.o[0] && o[1] === h.o[1] && o[2] === h.o[2]) { h.doi = i; h.dauDoi = m === 0; } }); });
    });
    k.dang = 'tong'; k.gom = gom; k.bo = bo; k.nhanHien = C.muot((t - 0.4) / 0.15);
    return k;
  }
  C.dangKi('haiLapPhuong', {
    // a ≥ 2,5 và b ≤ 2 nên kéo thế nào cũng còn b < a, hình không phải tự sửa b
    thamSo: { a: { min: 2.5, max: 5, step: 0.5, md: 3, nhan: 'Cạnh a', mau: '--a' }, b: { min: 0.5, max: 2, step: 0.5, md: 1.5, nhan: 'Cạnh b', mau: '--b' } },
    trangThai: { soiTam1: true, soiTam2: true, soiTam3: true },
    tinh: function (p, t, o) {
      var dang = (o && o.dang) || 'hieu';
      if (dang === 'hieu') return haiHieu(p, t);
      if (dang === 'tong') return haiTong(p, t);
      throw new Error('haiLapPhuong: dạng lạ ' + dang);
    }
  });

  // Xếp mảnh thành hình chữ nhật. Cạnh là số hoặc [hệ số của x, số hạng tự do]; cạnh "tru" thì lấy lùi lại (mảnh bị bỏ đi).
  function doDai(d, x) { return typeof d === 'number' ? d : d[0] * x + d[1]; }
  function bayRa(ds, x, ten) {
    var cum = 0;
    return ds.map(function (c) {
      var L = doDai(c.dai, x);
      if (!(L > 0)) throw new Error(ten + ': cạnh phải dương');
      var bat;
      if (c.tru) { cum -= L; bat = cum; } else { bat = cum; cum += L; }
      if (cum < -1e-9) throw new Error(ten + ': phần bỏ đi dài hơn phần có');
      return { bat: bat, dai: L, dau: c.tru ? -1 : 1, ten: c.ten };
    }).concat([{ tong: cum }]);
  }
  C.dangKi('xepChuNhat', {
    thamSo: { x: { min: 1, max: 5, step: 0.5, md: 3, nhan: 'Giá trị x', mau: '--a' } },
    tinh: function (p, t, o) {
      var hang = bayRa(o.hang, p.x, 'xepChuNhat'), cot = bayRa(o.cot, p.x, 'xepChuNhat');
      var H = hang.pop().tong, W = cot.pop().tong;
      if (!(H > 0 && W > 0)) throw new Error('xepChuNhat: hình chữ nhật cuối cần hai cạnh dương');
      var rongCo = 0, caoCo = 0;
      cot.forEach(function (c) { if (c.dau > 0) rongCo = Math.max(rongCo, c.bat + c.dai); });
      hang.forEach(function (c) { if (c.dau > 0) caoCo = Math.max(caoCo, c.bat + c.dai); });
      var l = Math.max(rongCo, caoCo), ve = 1 - C.muot((t - 0.1) / 0.45), g = 0.16 * l * ve;
      var manh = [];
      hang.forEach(function (r, i) {
        cot.forEach(function (c, j) {
          var dau = r.dau * c.dau, ca2Tru = r.dau < 0 && c.dau < 0;
          // Mảnh có (hai cạnh dương) đứng tản ra rồi trượt vào; mảnh bỏ đi và mảnh trả lại hiện tại chỗ
          var lx = r.dau > 0 && c.dau > 0 ? (j - (cot.length - 1) / 2) * g : 0, ly = r.dau > 0 && c.dau > 0 ? (i - (hang.length - 1) / 2) * g : 0;
          manh.push({ i: i, j: j, x: c.bat + lx, y: r.bat + ly, w: c.dai, h: r.dai, dau: dau, traLai: ca2Tru, coSan: r.dau > 0 && c.dau > 0,
            nhan: o.o && o.o[i] ? o.o[i][j] : '', mau: o.mau && o.mau[i] ? o.mau[i][j] : null });
        });
      });
      var thu = null;
      if (p.thu && typeof p.thu === 'object') {
        var th = bayRa(p.thu.hang || o.hang, p.x, 'xepChuNhat (số em ghi)'), tc = bayRa(p.thu.cot || o.cot, p.x, 'xepChuNhat (số em ghi)');
        thu = { H: th.pop().tong, W: tc.pop().tong, nhan: p.thu.nhan || '' };
      }
      return { hang: hang, cot: cot, W: W, H: H, rongCo: rongCo, caoCo: caoCo, manh: manh, tach: g, thu: thu,
        hienBo: C.muot((t - 0.58) / 0.15), ket: C.muot((t - 0.8) / 0.15),
        dienTich: manh.reduce(function (s, m) { return s + m.dau * m.w * m.h; }, 0) };
    }
  });

  /* ---------- Phần vẽ ---------- */
  var QUAY = -0.6, NGHIENG = 1.1, CQ = Math.cos(QUAY), SQ = Math.sin(QUAY), CN = Math.cos(NGHIENG), SN = Math.sin(NGHIENG);
  function chieu(q) { var x = q[0] * CQ - q[1] * SQ, y = q[0] * SQ + q[1] * CQ; return [x, -(y * CN + q[2] * SN)]; }
  function mauVar(m) { return m.charAt(0) === '-' ? 'var(' + m + ')' : m; }
  function chuMau(cha, x, y, s, co, mau, them) {
    var at = Object.assign({}, them || {});
    if (mau && mau.charAt(0) !== '-') { at.style = 'fill:' + mau; mau = null; }
    // Viền nền quanh chữ, để chữ vẫn đọc được khi nằm đè lên cạnh khối
    at['paint-order'] = 'stroke'; at.stroke = 'var(--mat)'; at['stroke-width'] = co * 0.22; at['stroke-linejoin'] = 'round';
    return C.chu(cha, x, y, s, co, mau, at);
  }
  function datKhung(svg, k3, le, them) {
    var xs = [], ys = [];
    [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { [0, 1].forEach(function (m) {
      var q = chieu([k3[i][0], k3[j][1], k3[m][2]]); xs.push(q[0]); ys.push(q[1]);
    }); }); });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var rong = x1 - x0, d = le * rong, duoi = (them || 0) * rong;
    svg.setAttribute('viewBox', [x0 - d, y0 - d, rong + 2 * d, y1 - y0 + 2 * d + duoi].join(' '));
    return { co: 0.068 * rong, x0: x0 - d, y0: y0 - d, rong: rong + 2 * d, cao: y1 - y0 + 2 * d + duoi, day: y1 + d * 0.4 };
  }
  // Ba mặt nhìn thấy của một hộp: trên, phải (+x), trước (−y). Lót nền đục để hộp sau không nhìn xuyên qua.
  function veHop(cha, h, mau, tuy) {
    tuy = tuy || {};
    var g = C.mk('g', { opacity: tuy.mo == null ? 1 : tuy.mo }, cha), x = h.x, y = h.y, z = h.z, X = x + h.w, Y = y + h.d, Z = z + h.h;
    var mat = [
      { p: [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]], dam: 0.2 },
      { p: [[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]], dam: 0.5 },
      { p: [[x, y, z], [X, y, z], [X, y, Z], [x, y, Z]], dam: 0.34 }
    ];
    mat.forEach(function (m) {
      var diem = C.diem(m.p.map(chieu));
      if (tuy.thieu) { C.mk('polygon', { points: diem, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 1.6, 'stroke-dasharray': '5 4', 'vector-effect': 'non-scaling-stroke' }, g); return; }
      C.mk('polygon', { points: diem, fill: 'var(--mat)' }, g);
      C.mk('polygon', { points: diem, fill: mauVar(mau), 'fill-opacity': m.dam * (tuy.nhat ? 0.45 : 1), stroke: 'var(--muc)', 'stroke-width': 1.2, 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke',
        'stroke-dasharray': tuy.net ? '5 4' : null }, g);
    });
    return g;
  }
  function tamChieu(h) { return chieu([h.x + h.w / 2, h.y + h.d / 2, h.z + h.h / 2]); }
  // Chỗ ghi tên một khối trong lưới 2×2×2: giữa mặt không bị khối bên cạnh che (trước, phải, rồi trên)
  function choNhan(h) {
    var o = h.o || [1, 0, 1];
    // Khối nấp ở góc sau, trái, dưới: chỉ lộ phần trước của mặt trên
    if (o[0] === 0 && o[1] === 1 && o[2] === 0) return chieu([h.x + h.w * 0.4, h.y + h.d * 0.2, h.z + h.h]);
    if (o[1] === 0) return chieu([h.x + h.w / 2, h.y, h.z + h.h / 2]);
    if (o[0] === 1) return chieu([h.x + h.w, h.y + h.d / 2, h.z + h.h / 2]);
    return chieu([h.x + h.w / 2, h.y + h.d / 2, h.z + h.h]);
  }
  function canh3(cha, p, q, mau, day) {
    var a = chieu(p), b = chieu(q);
    C.mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: mauVar(mau), 'stroke-width': day || 4, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, cha);
  }
  var MAU_LOAI = { a3: '--a', a2b: '--cc', ab2: TIM, b3: '--b' };
  function tenMac(o) {
    var A = o.tenA || 'a', B = o.tenB || 'b', nh = o.nhan || {};
    return { A: A, B: B, a3: nh.a3 || A + '³', a2b: nh.a2b || A + '²' + B, ab2: nh.ab2 || A + B + '²', b3: nh.b3 || B + '³', hieu: nh.hieu || A + '−' + B,
      baA2b: nh.baA2b || '3·' + (nh.a2b || A + '²' + B), baAb2: nh.baAb2 || '3·' + (nh.ab2 || A + B + '²'),
      a2: nh.a2 || A + '²', ab: nh.ab || A + B, b2: nh.b2 || B + '²', hop: nh.hop || A + B + '(' + A + '+' + B + ')' };
  }
  // Tên đoạn trên ba cạnh gần người nhìn, đi theo các khối khi tách ra
  // anB: cạnh b là điều đề hỏi thì ghi dấu hỏi tới khi em làm đúng
  function nhanCanh(svg, k, n, co, anB) {
    var S = k.S, g = k.tach, it = { 'font-style': 'italic' }, len = function (s) { return (s === 0 ? -1 : 1) * g / 2; };
    var ten = function (d) { return d.laB ? (anB ? '?' : n.B) : k.dang === 'hieu' ? n.hieu : n.A; }, mau = function (d) { return d.laB ? '--b' : '--a'; };
    k.doan[0].forEach(function (d, i) { var q = chieu([d.bat + d.dai / 2 + len(i), -1.2 * g, -g]); chuMau(svg, q[0] - co * 0.3, q[1] + co * 1.1, ten(d), co, mau(d), it); });
    k.doan[1].forEach(function (d, j) { var q = chieu([S + g / 2, d.bat + d.dai / 2 + 2.4 * len(j), -g]); chuMau(svg, q[0] + co * 1.1, q[1] + co * 0.7, ten(d), co, mau(d), it); });
    // Cạnh đứng: lấy mép trái của mặt trước, để chữ không nằm đè lên mặt bên phải
    k.doan[2].forEach(function (d, m) { var q = chieu([-g / 2, -1.2 * g, d.bat + d.dai / 2 + 2 * len(m) + (m ? k.nhac : 0)]); chuMau(svg, q[0] - co * 0.9, q[1], ten(d), co, mau(d), it); });
  }

  C.lay('lapPhuong').ve = function (svg, k, p, t, o) {
    var n = tenMac(o), giai = p.trangThai === 'giai';
    var kh = datKhung(svg, k.khung3, 0.2, 0.1), co = kh.co;
    if (k.dang === 'tong') {
      var thieu = k.hop.filter(function (h) { return h.an; }).length;
      // Ghi tên ngay sau khi vẽ khối, để khối gần hơn che đúng tên của khối ở sau
      k.hop.forEach(function (h) {
        veHop(svg, h, MAU_LOAI[h.loai], { thieu: h.an });
        if (h.an) return;
        var q = choNhan(h), giua = h.nB === 1 || h.nB === 2;
        // o.anGiua: chưa làm đúng thì sáu khối giữa ghi dấu hỏi, để em tự đếm và tính; o.anNhan: cả tám khối
        var s = (o.anNhan || (o.anGiua && giua)) && !giai ? '?' : n[h.loai];
        chuMau(svg, q[0], q[1], s, co * (s.length > 4 ? 0.8 : 1.05), MAU_LOAI[h.loai], { opacity: k.nhanHien });
      });
      nhanCanh(svg, k, n, co, o.anB && !giai);
      if (thieu) C.chu(svg, kh.x0 + kh.rong / 2, kh.day + co * 0.9, 'Còn thiếu ' + thieu + ' khối', co, '--sai');
    } else {
      k.hop.forEach(function (h) {
        var lan = h.lan, mau = lan === 0 ? (h.nB === 0 ? '--a' : '--tg') : lan === 1 ? '--tg' : '--sai';
        var boHan = k.xong > 0 && h.nB > 0;
        veHop(svg, h, h.nB === 0 ? '--a' : mau, { nhat: lan === 1 && h.nB > 0, mo: boHan ? 1 - 0.75 * k.xong : 1, net: boHan && k.xong > 0.5 });
        var q = h.nB === 0 ? tamChieu(h) : choNhan(h);
        if (h.nB === 0) { chuMau(svg, q[0], q[1], '(' + n.hieu + ')³', co * 0.85, '--a', { opacity: k.xong }); return; }
        if (k.giaiDoan > 0 && k.xong < 1) chuMau(svg, q[0], q[1], String(h.lan), co * 1.05, h.lan >= 2 ? '--sai' : h.lan === 0 ? '--cc' : '--muc', { opacity: 1 - k.xong });
      });
      nhanCanh(svg, k, n, co);
      // Dòng công thức lớn dần theo từng bước bỏ, trả lại, bỏ
      var dong = [n.a3, ' − ' + n.baA2b, ' + ' + n.baAb2, ' − ' + n.b3].slice(0, k.giaiDoan + 1).join('');
      C.chu(svg, kh.x0 + kh.rong / 2, kh.day + co * 0.9, dong, co * (dong.length > 22 ? 0.8 : 0.95), k.xong > 0.5 ? '--a' : '--muc');
      if (k.kep) C.chu(svg, kh.x0 + kh.rong / 2, kh.y0 + co * 0.8, 'b phải nhỏ hơn a, đang vẽ b = ' + C.fmt(k.b), co * 0.8, '--sai');
    }
  };

  C.lay('haiLapPhuong').ve = function (svg, k, p, t, o) {
    var n = tenMac(o), giai = p.trangThai === 'giai';
    if (k.dang === 'tong') {
      var kh = datKhung(svg, k.khung3, 0.2, 0.1), co = kh.co;
      k.hop.forEach(function (h) {
        var giua = h.doi != null, mau = giua && k.gom > 0.5 ? '--cc' : MAU_LOAI[h.loai];
        veHop(svg, h, mau, { mo: giua ? 1 - 0.8 * k.bo : 1, net: giua && k.bo > 0.5 });
        var q = choNhan(h);
        if (h.doi == null) { chuMau(svg, q[0], q[1], n[h.loai], co * 1.05, MAU_LOAI[h.loai], { opacity: k.nhanHien }); return; }
        // Tên hộp chỉ ghi lúc ghép đôi; khi đã bỏ thì nói ở dòng chữ bên dưới
        if (h.dauDoi) chuMau(svg, q[0], q[1], n.hop, co * (n.hop.length > 8 ? 0.72 : 0.85), '--muc', { opacity: k.gom * (1 - k.bo) });
      });
      nhanCanh(svg, k, n, co);
      var duoi = k.bo > 0.5 ? 'Bỏ 3 hộp ' + n.hop + ', còn ' + n.a3 + ' + ' + n.b3 : k.gom > 0.5 ? 'Ghép đôi: 3 hộp ' + n.hop : '';
      C.chu(svg, kh.x0 + kh.rong / 2, kh.day + co * 0.9, duoi, Math.min(co * 0.85, kh.rong * 0.95 / (0.55 * Math.max(1, duoi.length))), k.bo > 0.5 ? '--muc' : '--cc');
      return;
    }
    var kh2 = datKhung(svg, k.khung3, 0.14, 0.12), c2 = kh2.co, it = { 'font-style': 'italic' };
    var MAU_TAM = ['--a', '--cc', '--b'];
    k.tam.forEach(function (h, i) {
      var soi = p.trangThai === 'soiTam' + (i + 1);
      veHop(svg, h, soi ? '--sai' : MAU_TAM[i]);
    });
    if (k.goc.hien > 0.01) {
      veHop(svg, k.goc, '--tg', { mo: k.goc.hien, net: k.bo > 0.2 });
      var qg = tamChieu(k.goc);
      C.chu(svg, qg[0], qg[1], (k.bo > 0.2 ? 'bỏ ' : '') + n.b3, c2 * 0.85, '--sai', { opacity: k.goc.hien });
    }
    // Cạnh dày a − b của từng tấm tô đỏ khi đã tách
    var a = k.a, r = k.r, b = k.b, T1 = k.tam[0], T2 = k.tam[1], T3 = k.tam[2];
    var g = C.mk('g', { opacity: k.nhanHien }, svg);
    canh3(g, [T1.x + T1.w, T1.y, 0], [T1.x + T1.w, T1.y, r], '--sai');
    canh3(g, [T2.x, T2.y, T2.z + T2.h], [T2.x + T2.w, T2.y, T2.z + T2.h], '--sai');
    canh3(g, [T3.x + T3.w, T3.y, T3.z + T3.h], [T3.x + T3.w, T3.y + T3.d, T3.z + T3.h], '--sai');
    // o.anTam: chưa làm đúng thì mặt các tấm ghi dấu hỏi
    var matTam = [n.a2, n.ab, n.b2];
    k.tam.forEach(function (h, i) {
      var q = chieu([h.x + h.w / 2, h.y + h.d / 2, h.z + h.h]);
      var s = o.anTam && !giai ? '?' : matTam[i];
      chuMau(svg, q[0], q[1], s, c2 * (s.length > 4 ? 0.75 : 0.95), MAU_TAM[i], { opacity: k.nhanHien });
    });
    // Cạnh khối ban đầu: a, a và phần b ở góc
    var q1 = chieu([a / 2, 0, 0]), q2 = chieu([a, a / 2, 0]), q3 = chieu([a, 0, r + b / 2]);
    chuMau(svg, q1[0] - c2 * 0.3, q1[1] + c2 * 1.1, n.A, c2, '--a', Object.assign({ opacity: 1 - k.tach }, it));
    chuMau(svg, q2[0] + c2 * 1.1, q2[1] + c2 * 0.6, n.A, c2, '--a', Object.assign({ opacity: 1 - k.tach }, it));
    chuMau(svg, q3[0] + c2 * 0.9, q3[1], n.B, c2, '--b', Object.assign({ opacity: 1 - k.bo }, it));
    C.chu(svg, kh2.x0 + kh2.rong / 2, kh2.day + c2 * 0.9, 'Ba tấm cùng dày ' + (o.anTam && !giai ? '?' : n.hieu), c2 * 0.9, '--sai', { opacity: k.nhanHien });
    if (k.kep) C.chu(svg, kh2.x0 + kh2.rong / 2, kh2.y0 + c2 * 0.8, 'b phải nhỏ hơn a, đang vẽ b = ' + C.fmt(b), c2 * 0.8, '--sai');
  };

  C.lay('xepChuNhat').ve = function (svg, k, p, t, o) {
    var giai = p.trangThai === 'giai', thu = k.thu;
    var rong = Math.max(k.rongCo, thu ? thu.W : 0), cao = Math.max(k.caoCo, thu ? thu.H : 0), l = Math.max(rong, cao);
    var g0 = 0.16 * Math.max(k.rongCo, k.caoCo), d = 0.2 * l + g0 / 2, co = 0.09 * l;
    // Chừa chỗ bên trái cho tên hàng dài nhất, bên phải cho tên cạnh đứng của hình cuối
    var dai = function (s) { return String(s || '').length; };
    var trai = Math.max(d + g0 / 2, g0 / 2 + co * (1.6 + 0.6 * Math.max.apply(null, k.hang.map(function (r) { return dai(r.ten) + 1; }))));
    var phai = Math.max(d + g0 / 2, co * (1.2 + 0.85 * dai(o.tenCao)) + (rong - k.rongCo));
    // Mảnh có sẵn bị phần bỏ đi phủ lên: tên của nó chuyển lên dòng "cả hình" phía trên, để không đọc nhầm là phần bị bỏ
    var bo = k.manh.filter(function (m) { return !m.coSan && !m.traLai; });
    var chong = function (m) { return bo.some(function (n) { return n.x < m.x + m.w - 1e-9 && m.x < n.x + n.w - 1e-9 && n.y < m.y + m.h - 1e-9 && m.y < n.y + n.h - 1e-9; }); };
    var biPhu = k.manh.filter(function (m) { return m.coSan && m.nhan && chong(m); });
    var caHinh = biPhu.length ? 'cả hình: ' + biPhu.map(function (m) { return m.nhan; }).join(' + ') : '';
    var tren = d + g0 / 2 + (caHinh ? co * 2.4 : 0), coCot = k.cot.some(function (c) { return c.dau < 0; });
    svg.setAttribute('viewBox', [-trai, -tren, rong + trai + phai, cao + tren + d + g0 / 2 + (thu ? co * 1.6 : 0)].join(' '));
    var net = { 'vector-effect': 'non-scaling-stroke' };
    function mauManh(m) {
      if (m.mau) return m.mau;
      if (m.i === 0 && m.j === 0) return '--a';
      return m.i === k.hang.length - 1 && m.j === k.cot.length - 1 && k.hang.length > 1 ? '--b' : '--cc';
    }
    function giua(m) { return [m.x + m.w / 2, m.y + m.h / 2]; }
    k.manh.filter(function (m) { return m.coSan; }).forEach(function (m) {
      C.mk('rect', Object.assign({ x: m.x, y: m.y, width: m.w, height: m.h, fill: mauVar(mauManh(m)), 'fill-opacity': 0.3, stroke: 'var(--muc)', 'stroke-width': 1.5 }, net), svg);
    });
    // Mảnh bỏ đi: phủ nền rồi kẻ viền đỏ đứt; mảnh bị bỏ hai lần thì trả lại một lần
    k.manh.filter(function (m) { return !m.coSan; }).forEach(function (m) {
      var mo = C.mk('g', { opacity: k.hienBo }, svg);
      if (!m.traLai) C.mk('rect', { x: m.x, y: m.y, width: m.w, height: m.h, fill: 'var(--mat)', 'fill-opacity': 0.8 }, mo);
      C.mk('rect', Object.assign({ x: m.x, y: m.y, width: m.w, height: m.h, fill: m.traLai ? 'var(--cc)' : 'none', 'fill-opacity': 0.25, stroke: m.traLai ? 'var(--cc)' : 'var(--sai)', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }, net), mo);
    });
    k.manh.forEach(function (m) {
      if (!m.nhan) return;
      var q = giua(m), them = m.coSan ? (biPhu.indexOf(m) >= 0 ? { opacity: 1 - k.hienBo } : {}) : { opacity: k.hienBo };
      var s = m.coSan ? m.nhan : (m.traLai ? '+' : '−') + m.nhan;
      var c = co * Math.min(1, 0.9 * Math.min(m.w, m.h * 2.2) / (co * 0.6 * s.length));
      chuMau(svg, q[0], q[1], s, Math.max(co * (m.coSan ? 0.55 : 0.7), c), m.coSan ? mauManh(m) : m.traLai ? '--cc' : '--sai', them);
    });
    C.mk('rect', Object.assign({ x: 0, y: 0, width: k.W, height: k.H, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 3.5, opacity: k.ket }, net), svg);
    // Cạnh từng đoạn và cạnh cả hình: chưa tới cuối (hoặc o.anCanh mà em chưa làm đúng) thì ghi dấu hỏi
    var lo = o.anCanh ? !giai : (k.ket < 0.5 && !giai), it = { 'font-style': 'italic' };
    k.cot.forEach(function (c) {
      var s = lo ? '?' : (c.dau < 0 ? '−' : '') + c.ten;
      chuMau(svg, c.bat + c.dai / 2, -g0 / 2 - co * 0.8 - (c.dau < 0 ? co * 1.05 : 0), s, co * 0.9, c.dau < 0 ? '--sai' : '--muc', it);
    });
    k.hang.forEach(function (r) {
      var s = lo ? '?' : (r.dau < 0 ? '−' : '') + r.ten;
      chuMau(svg, -g0 / 2 - co * (0.6 + 0.3 * s.length) - (r.dau < 0 ? co * 1.2 : 0), r.bat + r.dai / 2, s, co * 0.9, r.dau < 0 ? '--sai' : '--muc', it);
    });
    if (caHinh) {
      var rongVe = rong + trai + phai;
      chuMau(svg, rong / 2, -g0 / 2 - co * (coCot ? 3.1 : 2.1), caHinh, Math.min(co * 0.85, rongVe * 0.9 / (0.55 * caHinh.length)), '--muc', { opacity: k.hienBo });
      // Phần còn lại chính là hình chữ nhật cuối: ghi tích của hai cạnh (giấu như tên cạnh)
      // tenKet là chuỗi hoặc mảng nhiều dòng (mỗi thừa số một dòng khi phần còn lại hẹp)
      if (o.tenKet) {
        var dong = lo ? ['?'] : [].concat(o.tenKet), dai1 = Math.max.apply(null, dong.map(function (x) { return x.length; }));
        var ck = Math.max(co * 0.5, Math.min(co, 0.9 * k.W / (0.55 * dai1), 0.8 * k.H / dong.length));
        dong.forEach(function (x, i) { chuMau(svg, k.W / 2, k.H / 2 + (i - (dong.length - 1) / 2) * ck * 1.2, x, ck, '--muc', { opacity: k.hienBo }); });
      }
    }
    var tenRong = o.tenRong || '', tenCao = o.tenCao || '';
    // Hai cạnh của hình chữ nhật cuối ghi ngoài phần có sẵn, để không đè lên mảnh bỏ đi
    if (tenRong) C.chu(svg, k.W / 2, k.caoCo + co * 1.1, lo ? '?' : tenRong, co, '--muc', { opacity: k.ket });
    if (tenCao) C.chu(svg, k.rongCo + co * (0.7 + 0.28 * (lo ? 1 : tenCao.length)), k.H / 2, lo ? '?' : tenCao, co, '--muc', { opacity: k.ket });
    if (thu) {
      C.mk('rect', Object.assign({ x: 0, y: 0, width: thu.W, height: thu.H, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, net), svg);
      // Ghi dưới tên cạnh của hình đúng, để hai dòng không đè nhau
      if (thu.nhan) C.chu(svg, thu.W / 2, Math.max(thu.H, k.caoCo) + co * (o.tenRong ? 2.3 : 1.1), thu.nhan, co * 0.9, '--sai');
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
