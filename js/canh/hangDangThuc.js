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
      khung3: [[-G, -2.4 * G, -2 * G], [S + G, S + 2.4 * G, S + 2 * G + 0.45 * S]], pha: phaLapPhuong(a, b, p.dau) };
  }
  /* ---------- Thử phá: đổi dấu một cạnh. Hình vẫn vẽ theo độ dài dương, k.pha tính lại hai vế với số âm ---------- */
  // Các thanh bước 0,5 nên số ở đây đúng tới vài chữ số thập phân: ghi đúng, không làm tròn
  function so(x) { return String(+x.toFixed(6)).replace('.', '{,}'); }
  function soN(x) { return x < 0 ? '(' + so(x) + ')' : so(x); }
  function day(ds) { return ds.map(function (x, i) { return i === 0 ? so(x) : (x < 0 ? ' - ' : ' + ') + so(Math.abs(x)); }).join(''); }
  function cong(ds) { return ds.reduce(function (s, x) { return s + x; }, 0); }
  function laAm(dau) { return dau != null && dau < 0; }
  var DAU = { min: -1, max: 1, step: 2, md: 1, nhan: 'Dấu của b', pha: true };
  function phaLapPhuong(a, b, dau) {
    var am = laAm(dau), bs = am ? -b : b, ve = Math.pow(a + bs, 3), kh = [a * a * a, 3 * a * a * bs, 3 * a * bs * bs, bs * bs * bs];
    var dong = '$(' + so(a) + ' + ' + soN(bs) + ')^3 = ' + so(ve) + '$ và $a^3 + 3a^2b + 3ab^2 + b^3 = ' + day(kh) + ' = ' + so(cong(kh)) + '$';
    if (!am) return { hong: false, chu: 'Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: ' + dong + '.' };
    return { hong: true, chu: 'Hình hỏng: với $b = ' + so(bs) + '$, khối $a^2b = ' + so(a * a) + ' \\cdot ' + soN(bs) + ' = ' + so(a * a * bs) + '$ và khối $b^3 = ' + so(bs * bs * bs) +
      '$ có thể tích âm: không có khối nào như thế. Công thức thì không hỏng: ' + dong + '. Công thức có được bằng phép nhân nên đúng với mọi số; chỉ cách nhìn bằng thể tích mới cần $a$, $b$ dương.' };
  }
  function phaHaiHieu(a, b, dau) {
    var am = laAm(dau), bs = am ? -b : b, tr = a * a * a - bs * bs * bs, r = a - bs, m = a * a + a * bs + bs * bs;
    var dong = '$a^3 - b^3 = ' + so(a * a * a) + ' - ' + soN(bs * bs * bs) + ' = ' + so(tr) + '$ và $(a - b)(a^2 + ab + b^2) = ' + so(r) + ' \\cdot ' + so(m) + ' = ' + so(r * m) + '$';
    if (!am) return { hong: false, chu: 'Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: ' + dong + '.' };
    return { hong: true, chu: 'Hình hỏng: với $b = ' + so(bs) + '$, khối góc có cạnh âm, tấm giữa có mặt $ab = ' + so(a) + ' \\cdot ' + soN(bs) + ' = ' + so(a * bs) +
      '$ âm: không bỏ được, cũng không tách được tấm nào như thế. Công thức thì không hỏng: ' + dong + '. Chỉ cách nhìn bằng thể tích mới cần $a > b > 0$.' };
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
    thamSo: { a: { min: 1, max: 5, step: 0.5, md: 3, nhan: 'Cạnh a', mau: '--a' }, b: { min: 1, max: 5, step: 0.5, md: 2, nhan: 'Cạnh b', mau: '--b' }, dau: DAU },
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
      khung3: [[-G, 0, 0], [a, a + G, a + G + 0.45 * a]], pha: phaHaiHieu(a, b, p.dau) };
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
    // Thử phá của lapPhuong nói về (a + b)³, không hợp với cảnh này
    delete k.pha;
    k.dang = 'tong'; k.gom = gom; k.bo = bo; k.nhanHien = C.muot((t - 0.4) / 0.15);
    return k;
  }
  C.dangKi('haiLapPhuong', {
    // a ≥ 2,5 và b ≤ 2 nên kéo thế nào cũng còn b < a, hình không phải tự sửa b
    thamSo: { a: { min: 2.5, max: 5, step: 0.5, md: 3, nhan: 'Cạnh a', mau: '--a' }, b: { min: 0.5, max: 2, step: 0.5, md: 1.5, nhan: 'Cạnh b', mau: '--b' }, dau: DAU },
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
    thamSo: { x: { min: 1, max: 5, step: 0.5, md: 3, nhan: 'Giá trị x', mau: '--a' }, dau: { min: -1, max: 1, step: 2, md: 1, nhan: 'Dấu của x', pha: true } },
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
      var pha = phaXep(o, p);
      return { hang: hang, cot: cot, W: W, H: H, rongCo: rongCo, caoCo: caoCo, manh: manh, tach: g, thu: thu,
        hienBo: C.muot((t - 0.58) / 0.15), ket: C.muot((t - 0.8) / 0.15),
        dienTich: manh.reduce(function (s, m) { return s + m.dau * m.w * m.h; }, 0), pha: pha,
        phaManh: pha.hong ? manh.filter(function (m) { return m.coSan && (pha.amHang[m.i] || pha.amCot[m.j]); }) : [] };
    }
  });
  function tex(s) { return String(s).replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/·/g, ' \\cdot '); }
  // Thử phá cho xepChuNhat: x âm thì có cạnh âm, không có mảnh nào để xếp; nhưng tổng các mảnh vẫn bằng tích hai cạnh
  function phaXep(o, p) {
    var am = laAm(p.dau), xs = am ? -p.x : p.x, dau = function (c) { return c.tru ? -1 : 1; };
    var dh = o.hang.map(function (c) { return doDai(c.dai, xs); }), dc = o.cot.map(function (c) { return doDai(c.dai, xs); });
    var H = cong(o.hang.map(function (c, i) { return dau(c) * dh[i]; })), W = cong(o.cot.map(function (c, j) { return dau(c) * dc[j]; })), manh = [];
    o.hang.forEach(function (r, i) { o.cot.forEach(function (c, j) { manh.push(dau(r) * dau(c) * dh[i] * dc[j]); }); });
    var dong = 'tổng các mảnh $' + day(manh) + ' = ' + so(cong(manh)) + '$, tích hai cạnh $' + soN(H) + ' \\cdot ' + soN(W) + ' = ' + so(H * W) + '$';
    var amHang = dh.map(function (L) { return L < 0; }), amCot = dc.map(function (L) { return L < 0; }), thay = {}, ds = [];
    o.hang.concat(o.cot).forEach(function (c) {
      var L = doDai(c.dai, xs), s = '$' + tex(c.ten || '?') + ' = ' + so(L) + '$';
      if (L < 0 && !thay[s]) { thay[s] = true; ds.push(s); }
    });
    if (!am) return { hong: false, amHang: amHang, amCot: amCot, chu: 'Với $x = ' + so(xs) + '$: ' + dong + '.' };
    return { hong: true, amHang: amHang, amCot: amCot, chu: 'Hình hỏng: với $x = ' + so(xs) + '$' + (ds.length ? ', cạnh ' + ds.join(' và ') + ' âm, mà độ dài không thể âm, nên không có mảnh nào để xếp' : '') +
      '. Phân tích thì không hỏng: ' + dong + '. Đẳng thức đúng với mọi $x$; chỉ cách xếp hình mới cần $x > 0$.' };
  }

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
        var gh = veHop(svg, h, MAU_LOAI[h.loai], { thieu: h.an });
        if (h.an) return;
        gh.setAttribute('data-soi', h.loai);
        // Thử phá: khối có cạnh b âm thì viền đỏ đứt, vì không có khối nào như thế
        if (k.pha && k.pha.hong && h.nB > 0) veHop(gh, h, '--sai', { thieu: true });
        var q = choNhan(h), giua = h.nB === 1 || h.nB === 2;
        // o.anGiua: chưa làm đúng thì sáu khối giữa ghi dấu hỏi, để em tự đếm và tính; o.anNhan: cả tám khối
        var s = (o.anNhan || (o.anGiua && giua)) && !giai ? '?' : n[h.loai];
        chuMau(gh, q[0], q[1], s, co * (s.length > 4 ? 0.8 : 1.05), MAU_LOAI[h.loai], { opacity: k.nhanHien });
      });
      nhanCanh(C.mk('g', { 'data-soi': 'canh' }, svg), k, n, co, o.anB && !giai);
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
      var gh = veHop(svg, h, soi ? '--sai' : MAU_TAM[i]);
      gh.setAttribute('data-soi', h.ten);
      // Thử phá: tấm có cạnh b âm thì viền đỏ đứt
      if (k.pha && k.pha.hong && i > 0) veHop(gh, h, '--sai', { thieu: true });
    });
    if (k.goc.hien > 0.01) {
      var gg = veHop(svg, k.goc, '--tg', { mo: k.goc.hien, net: k.bo > 0.2 });
      gg.setAttribute('data-soi', 'goc');
      if (k.pha && k.pha.hong) veHop(gg, k.goc, '--sai', { thieu: true });
      var qg = tamChieu(k.goc);
      C.chu(svg, qg[0], qg[1], (k.bo > 0.2 ? 'bỏ ' : '') + n.b3, c2 * 0.85, '--sai', { opacity: k.goc.hien });
    }
    // Cạnh dày a − b của từng tấm tô đỏ khi đã tách
    var a = k.a, r = k.r, b = k.b, T1 = k.tam[0], T2 = k.tam[1], T3 = k.tam[2];
    var g = C.mk('g', { opacity: k.nhanHien, 'data-soi': 'day' }, svg);
    canh3(g, [T1.x + T1.w, T1.y, 0], [T1.x + T1.w, T1.y, r], '--sai');
    canh3(g, [T2.x, T2.y, T2.z + T2.h], [T2.x + T2.w, T2.y, T2.z + T2.h], '--sai');
    canh3(g, [T3.x + T3.w, T3.y, T3.z + T3.h], [T3.x + T3.w, T3.y + T3.d, T3.z + T3.h], '--sai');
    // o.anTam: chưa làm đúng thì mặt các tấm ghi dấu hỏi
    var matTam = [n.a2, n.ab, n.b2];
    k.tam.forEach(function (h, i) {
      var q = chieu([h.x + h.w / 2, h.y + h.d / 2, h.z + h.h]);
      var s = o.anTam && !giai ? '?' : matTam[i];
      chuMau(C.mk('g', { 'data-soi': h.ten }, svg), q[0], q[1], s, c2 * (s.length > 4 ? 0.75 : 0.95), MAU_TAM[i], { opacity: k.nhanHien });
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
      C.mk('rect', Object.assign({ x: m.x, y: m.y, width: m.w, height: m.h, fill: mauVar(mauManh(m)), 'fill-opacity': 0.3, stroke: 'var(--muc)', 'stroke-width': 1.5, 'data-soi': m.nhan ? 'manh' + m.i + m.j : null }, net), svg);
    });
    // Thử phá: mảnh có cạnh âm thì viền đỏ đứt, vì không có mảnh nào như thế
    (k.phaManh || []).forEach(function (m) {
      C.mk('rect', Object.assign({ x: m.x, y: m.y, width: m.w, height: m.h, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2.5, 'stroke-dasharray': '7 4' }, net), svg);
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
      chuMau(m.coSan ? C.mk('g', { 'data-soi': 'manh' + m.i + m.j }, svg) : svg, q[0], q[1], s, Math.max(co * (m.coSan ? 0.55 : 0.7), c), m.coSan ? mauManh(m) : m.traLai ? '--cc' : '--sai', them);
    });
    var gKhung = C.mk('g', { 'data-soi': 'khung' }, svg);
    C.mk('rect', Object.assign({ x: 0, y: 0, width: k.W, height: k.H, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 3.5, opacity: k.ket }, net), gKhung);
    // Cạnh từng đoạn và cạnh cả hình: chưa tới cuối (hoặc o.anCanh mà em chưa làm đúng) thì ghi dấu hỏi
    var lo = o.anCanh ? !giai : (k.ket < 0.5 && !giai), it = { 'font-style': 'italic' };
    var gNgang = C.mk('g', { 'data-soi': 'canhNgang' }, svg), gDoc = C.mk('g', { 'data-soi': 'canhDoc' }, svg);
    k.cot.forEach(function (c) {
      var s = lo ? '?' : (c.dau < 0 ? '−' : '') + c.ten;
      chuMau(gNgang, c.bat + c.dai / 2, -g0 / 2 - co * 0.8 - (c.dau < 0 ? co * 1.05 : 0), s, co * 0.9, c.dau < 0 ? '--sai' : '--muc', it);
    });
    k.hang.forEach(function (r) {
      var s = lo ? '?' : (r.dau < 0 ? '−' : '') + r.ten;
      chuMau(gDoc, -g0 / 2 - co * (0.6 + 0.3 * s.length) - (r.dau < 0 ? co * 1.2 : 0), r.bat + r.dai / 2, s, co * 0.9, r.dau < 0 ? '--sai' : '--muc', it);
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
    if (tenRong) C.chu(gKhung, k.W / 2, k.caoCo + co * 1.1, lo ? '?' : tenRong, co, '--muc', { opacity: k.ket });
    if (tenCao) C.chu(gKhung, k.rongCo + co * (0.7 + 0.28 * (lo ? 1 : tenCao.length)), k.H / 2, lo ? '?' : tenCao, co, '--muc', { opacity: k.ket });
    if (thu) {
      C.mk('rect', Object.assign({ x: 0, y: 0, width: thu.W, height: thu.H, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, net), svg);
      // Ghi dưới tên cạnh của hình đúng, để hai dòng không đè nhau
      if (thu.nhan) C.chu(svg, thu.W / 2, Math.max(thu.H, k.caoCo) + co * (o.tenRong ? 2.3 : 1.1), thu.nhan, co * 0.9, '--sai');
    }
  };

  /* ---------- Soi chi tiết ---------- */
  // Đề đặt tên cạnh riêng (tenA, tenB) thì hình chỉ là mô hình: thẻ nói bằng chữ, không ghi số đo của hình.
  // Nhãn đang bị giấu (anNhan, anGiua, anB, anTam, anCanh) mà em chưa giải thì thẻ cũng không nói điều đó.
  var m$ = function (s) { return '$' + s + '$'; };
  C.lay('lapPhuong').soi = function (k, p, o) {
    if (k.dang !== 'tong') return {};
    var n = tenMac(o), giai = p.trangThai === 'giai', coSo = !o.tenA && !o.tenB, a = k.a, b = k.b;
    var A = tex(n.A), B = o.anB && !giai ? '?' : tex(n.B);
    var LOAI = {
      a3: { canh: [A, A, A], dem: 1, vi: 'cả ba cạnh đều là ' + m$(A), gt: a * a * a },
      a2b: { canh: [A, A, B], dem: 3, vi: 'cạnh ' + m$(B) + ' nằm theo chiều ngang, chiều sâu hoặc chiều đứng', gt: a * a * b },
      ab2: { canh: [A, B, B], dem: 3, vi: 'cạnh ' + m$(A) + ' nằm theo chiều ngang, chiều sâu hoặc chiều đứng', gt: a * b * b },
      b3: { canh: [B, B, B], dem: 1, vi: 'cả ba cạnh đều là ' + m$(B), gt: b * b * b }
    };
    var ra = {};
    Object.keys(LOAI).forEach(function (ten) {
      var L = LOAI[ten], giau = (o.anNhan || (o.anGiua && (ten === 'a2b' || ten === 'ab2'))) && !giai;
      var chu = 'Ba cạnh ' + L.canh.map(m$).join(', ') + '. ';
      chu += giau ? 'Thể tích của khối là tích ba cạnh.'
        : 'Thể tích ' + m$(tex(n[ten]) + (coSo ? ' = ' + so(L.gt) : '')) + '. Có $' + L.dem + '$ khối như thế: ' + L.vi + '.';
      ra[ten] = { tieuDe: giau ? 'Một khối' : 'Khối ' + m$(tex(n[ten])), chu: chu };
    });
    ra.canh = { tieuDe: 'Cạnh khối lớn', chu: 'Mỗi cạnh gồm một đoạn ' + m$(A) + ' và một đoạn ' + m$(B) + '. Cắt theo các chỗ chia thì được $2 \\cdot 2 \\cdot 2 = 8$ khối, và thể tích khối lớn bằng tổng tám khối đó.' +
      (coSo ? ' Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: $(a + b)^3 = ' + so(Math.pow(a + b, 3)) + '$.' : '') };
    return ra;
  };
  C.lay('haiLapPhuong').soi = function (k, p, o) {
    if (k.dang !== 'hieu') return {};
    var n = tenMac(o), giau = o.anTam && p.trangThai !== 'giai', coSo = !o.tenA && !o.tenB, a = k.a, b = k.b, r = k.r;
    var A = tex(n.A), B = tex(n.B), H = '(' + tex(n.hieu) + ')';
    var so1 = function (x) { return coSo ? ' = ' + so(x) : ''; };
    var tam = [[A, A, tex(n.a2), a * a], [A, B, tex(n.ab), a * b], [B, B, tex(n.b2), b * b]], ra = {};
    tam.forEach(function (T, i) {
      ra['tam' + (i + 1)] = giau
        ? { tieuDe: 'Một tấm', chu: 'Đọc trên hình: cạnh tô đỏ là bề dày, hai cạnh kia làm thành mặt. Thể tích tấm bằng diện tích mặt nhân bề dày.' }
        : { tieuDe: 'Tấm mặt ' + m$(T[2]), chu: 'Mặt ' + m$(T[0] + ' \\cdot ' + T[1] + ' = ' + T[2] + so1(T[3])) + ', dày ' + m$(tex(n.hieu) + so1(r)) +
          '. Thể tích bằng mặt nhân bề dày: ' + m$(T[2] + H + so1(T[3] * r)) + '.' };
    });
    ra.goc = { tieuDe: 'Khối góc', chu: 'Khối lập phương nhỏ cạnh ' + m$(B) + ', thể tích ' + m$(tex(n.b3) + so1(b * b * b)) + '. Bỏ nó đi thì phần còn lại có thể tích ' + m$(tex(n.a3) + ' - ' + tex(n.b3) + so1(a * a * a - b * b * b)) + '.' };
    ra.day = { tieuDe: 'Bề dày', chu: giau ? 'Ba cạnh tô đỏ là bề dày của ba tấm: đọc độ dài của chúng trên hình.'
      : 'Ba cạnh tô đỏ cùng dài ' + m$(tex(n.hieu) + so1(r)) + ': cạnh ' + m$(A) + ' bỏ đi đoạn ' + m$(B) + ' của khối góc. Ba tấm cùng dày nên tổng thể tích là ' + m$(H + '(' + tex(n.a2) + ' + ' + tex(n.ab) + ' + ' + tex(n.b2) + ')') + '.' };
    return ra;
  };
  C.lay('xepChuNhat').soi = function (k, p, o) {
    var giai = p.trangThai === 'giai', lo = o.anCanh ? !giai : (k.ket < 0.5 && !giai), ra = {};
    // Có ghi số đo khi mọi cạnh là số thật hoặc đi theo x (thanh kéo), kẻo số của hình mẫu bị đọc như số thật
    var coSo = o.hang.concat(o.cot).every(function (c) { return Array.isArray(c.dai) || /^[\d.,]+$/.test(String(c.ten)); });
    var voi = coSo ? 'Với $x = ' + so(p.x) + '$, ' : '';
    var ten = function (ds) { return ds.map(function (c, i) { return (i ? (c.tru ? ' - ' : ' + ') : (c.tru ? '-' : '')) + tex(c.ten || '?'); }).join(''); };
    k.manh.forEach(function (m) {
      if (!m.coSan || !m.nhan) return;
      var h = o.hang[m.i], c = o.cot[m.j];
      ra['manh' + m.i + m.j] = { tieuDe: 'Mảnh ' + m$(tex(m.nhan)), chu: (voi ? voi + 'diện tích $' + so(m.w * m.h) + '$. ' : '') +
        (lo ? 'Mảnh là hình chữ nhật: viết diện tích thành tích hai thừa số để tìm hai cạnh của nó.'
          : 'Hai cạnh ' + m$(tex(h.ten)) + ' và ' + m$(tex(c.ten)) + ', nên diện tích là tích hai cạnh: ' + m$(tex(h.ten) + ' \\cdot ' + tex(c.ten) + ' = ' + tex(m.nhan)) + '.') };
    });
    var doDaiCanh = function (ds) { return coSo ? ' ' + voi + 'cạnh dài $' + so(cong(ds.map(function (c) { return c.dau * c.dai; }))) + '$.' : ''; };
    ra.canhNgang = { tieuDe: 'Cạnh ngang', chu: lo ? 'Chưa biết. Tìm bằng cách viết diện tích mỗi mảnh thành tích hai thừa số.'
      : 'Gồm các đoạn ' + o.cot.map(function (c) { return m$(tex(c.ten || '?')); }).join(', ') + ', cả cạnh là ' + m$(o.tenRong ? tex(o.tenRong) : ten(o.cot)) + '.' + doDaiCanh(k.cot) };
    ra.canhDoc = { tieuDe: 'Cạnh đứng', chu: lo ? 'Chưa biết. Tìm thừa số có mặt ở các mảnh cùng hàng.'
      : (o.hang.length === 1 ? 'Cạnh chung ' + m$(tex(o.hang[0].ten)) + ': mảnh nào cũng có cạnh này, nên nó là nhân tử chung.'
        : 'Gồm các đoạn ' + o.hang.map(function (c) { return m$(tex(c.ten || '?')); }).join(', ') + ', cả cạnh là ' + m$(o.tenCao ? tex(o.tenCao) : ten(o.hang)) + '.') + doDaiCanh(k.hang) };
    ra.khung = { tieuDe: 'Hình chữ nhật sau khi ghép', chu: lo || k.ket < 0.5 ? 'Các mảnh ghép khít thành hình chữ nhật này. Hai cạnh của nó là hai nhân tử cần tìm.'
      : 'Diện tích bằng tổng các mảnh và cũng bằng tích hai cạnh ' + m$(o.tenCao ? tex(o.tenCao) : ten(o.hang)) + ' và ' + m$(o.tenRong ? tex(o.tenRong) : ten(o.cot)) + ': hai cạnh là hai nhân tử.' +
        (coSo ? ' ' + voi + 'tổng các mảnh $' + so(k.dienTich) + ' = ' + so(k.H) + ' \\cdot ' + so(k.W) + '$.' : '') };
    return ra;
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
