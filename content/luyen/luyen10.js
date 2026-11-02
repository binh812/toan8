// Luyện thêm – Bài 10: Tứ giác
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';
  var TEN = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H'], ['P', 'Q', 'R', 'S']];

  // ---------- Hình tĩnh (toạ độ dựng từ chính số đo trong đề) ----------
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
  function chuGoc(P, O, Q, k) {
    var ux = P[0] - O[0], uy = P[1] - O[1], vx = Q[0] - O[0], vy = Q[1] - O[1];
    var lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
    var wx = ux / lu + vx / lv, wy = uy / lu + vy / lv, lw = Math.hypot(wx, wy);
    if (lw < 1e-6) { wx = -uy / lu; wy = ux / lu; lw = 1; }
    return [O[0] + k * wx / lw, O[1] + k * wy / lw];
  }
  // o: { diem, vong, canh?, goc?, soGoc?:[[P,O,Q,'chữ',hệ số xa?,màu?]], nhan?, lechTen?, ghiChu? }
  function hinhTG(o) {
    var D = o.diem, v = o.vong || [], canh = [], ten = Object.keys(D);
    v.forEach(function (a, i) { canh.push([a, v[(i + 1) % v.length], {}]); });
    var xs = ten.map(function (n) { return D[n][0]; }), ys = ten.map(function (n) { return D[n][1]; });
    var s = Math.max(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys));
    var chu = (o.soGoc || []).map(function (g) {
      var p = chuGoc(D[g[0]], D[g[1]], D[g[2]], 0.17 * s * (g[4] || 1));
      return [p[0], p[1], g[3], g[5] || CAM];
    });
    return TOAN8.hinhGeo({ diem: D, to: v, canh: canh.concat(o.canh || []), goc: o.goc, nhan: o.nhan, lechTen: o.lechTen, ghiChu: o.ghiChu,
      them: function (board, G) {
        chu.forEach(function (c) { G.label(c[0], c[1], c[2], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: c[3] }); });
      } });
  }
  // Tứ giác ABCD (A ở gốc, B bên phải, ngược chiều kim đồng hồ) biết góc A, B, D và hai cạnh AB, AD.
  function tg4(gA, gB, gD, ab, ad) {
    var A = [0, 0], B = [ab, 0], D = toi(A, gA, ad);
    var u = [Math.cos(rad(180 - gB)), Math.sin(rad(180 - gB))], v = [Math.cos(rad(gA + 180 + gD)), Math.sin(rad(gA + 180 + gD))];
    var rx = D[0] - B[0], ry = D[1] - B[1], det = -u[0] * v[1] + u[1] * v[0];
    var t = (-rx * v[1] + ry * v[0]) / det;
    return [A, B, [B[0] + t * u[0], B[1] + t * u[1]], D];
  }
  function doGoc(P, O, Q) {
    var ux = P[0] - O[0], uy = P[1] - O[1], vx = Q[0] - O[0], vy = Q[1] - O[1];
    return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / Math.hypot(ux, uy) / Math.hypot(vx, vy)))) * 180 / Math.PI;
  }
  // Kiểm tra hình dựng được: lồi, đúng số đo bốn góc, các cạnh không quá chênh lệch.
  function hopLe(P, g) {
    var canh = [], dau = 0;
    for (var i = 0; i < 4; i++) {
      var a = P[(i + 3) % 4], o = P[i], b = P[(i + 1) % 4];
      var c = (o[0] - a[0]) * (b[1] - o[1]) - (o[1] - a[1]) * (b[0] - o[0]);
      if (!dau) dau = c > 0 ? 1 : -1; else if ((c > 0 ? 1 : -1) !== dau) return false;
      if (Math.abs(doGoc(a, o, b) - g[i]) > 0.5) return false;
      canh.push(Math.hypot(b[0] - o[0], b[1] - o[1]));
    }
    return Math.min.apply(null, canh) > 1.8 && Math.max.apply(null, canh) < 2.8 * Math.min.apply(null, canh);
  }
  var CAP = [[6, 4], [6, 3.5], [5.5, 4.5], [7, 4], [5, 5], [7, 5.5], [4.5, 5], [6, 6], [8, 4]];
  function dung(g) {
    for (var i = 0; i < CAP.length; i++) { var P = tg4(g[0], g[1], g[3], CAP[i][0], CAP[i][1]); if (hopLe(P, g)) return P; }
    return null;
  }
  function diemTen(P, t) { var o = {}; t.forEach(function (n, i) { o[n] = P[i]; }); return o; }
  // Ba đỉnh kề của đỉnh i theo vòng t (trước, đỉnh, sau)
  function bo(t, i) { return [t[(i + 3) % 4], t[i], t[(i + 1) % 4]]; }
  function xa(v) { return v < 75 ? 1.4 : 1.05; }
  // Bốn góc (bội của 5, trong [55°; 135°]) thoả điều kiện dk, dựng được hình.
  function bonGoc(r, dk) {
    for (var k = 0; k < 300; k++) {
      var g = [r.so(11, 27) * 5, r.so(11, 27) * 5, r.so(11, 27) * 5];
      g.push(360 - g[0] - g[1] - g[2]);
      if (g[3] < 55 || g[3] > 135 || (dk && !dk(g))) continue;
      var P = dung(g);
      if (P) return { g: g, P: P };
    }
    return { g: [100, 70, 110, 80], P: dung([100, 70, 110, 80]) };
  }
  // Hình tứ giác: hiện số đo các góc biết, '?' ở các góc cần tìm.
  function hinhBonGoc(P, t, g, an, them) {
    var goc = [], so = [];
    t.forEach(function (n, i) {
      var b = bo(t, i), hoi = an.indexOf(i) >= 0;
      if (them && them.boGoc && them.boGoc.indexOf(i) >= 0) return;
      goc.push([b[0], b[1], b[2], hoi ? { mau: XANH } : {}]);
      so.push([b[0], b[1], b[2], hoi ? '?' : g[i] + '°', hoi ? 1 : xa(g[i]), hoi ? XANH : CAM]);
    });
    var o = { diem: diemTen(P, t), vong: t, goc: goc, soGoc: so };
    for (var k in them || {}) if (k !== 'boGoc') o[k] = them[k];
    return hinhTG(o);
  }
  function G(n) { return '\\widehat{' + n + '}'; }
  function d(x) { return x + '^\\circ'; }
  // Bỏ lỗi trùng đáp án hoặc trùng giá trị với lỗi đứng trước
  function boTrung(gt, ds) {
    var da = [gt];
    return ds.filter(function (l) {
      if (da.some(function (v) { return Math.abs(l.gt - v) < 1e-9; })) return false;
      da.push(l.gt); return true;
    });
  }
  function tong(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  // Hình cho câu soạn sẵn: góc ngoài tại B bằng 70°
  var gN = [85, 110, 75, 90], PN = dung(gN), xN = [PN[1][0] + 0.45 * (PN[1][0] - PN[0][0]), PN[1][1]];
  var hNgoai = hinhTG({ diem: { A: PN[0], B: PN[1], C: PN[2], D: PN[3], x: xN }, vong: ['A', 'B', 'C', 'D'], canh: [['B', 'x', { day: 2 }]],
    goc: [['x', 'B', 'C'], ['A', 'B', 'C', { mau: XANH }]], soGoc: [['x', 'B', 'C', '70°', 1.3], ['A', 'B', 'C', '?', 0.9, XANH]] });

  TOAN8.luyen(10, [
    { ten: 'Tìm góc còn lại', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), q = bonGoc(r), g = q.g, k = r.so(0, 3);
      var biet = [0, 1, 2, 3].filter(function (i) { return i !== k; }), s = tong(biet.map(function (i) { return g[i]; }));
      var ds = biet.map(function (i) { return '$' + G(t[i]) + ' = ' + d(g[i]) + '$'; });
      return {
        de: 'Tứ giác $' + t.join('') + '$ trong hình có ' + ds.slice(0, 2).join(', ') + ' và ' + ds[2] + '. Tính $' + G(t[k]) + '$ (độ).',
        dapAn: { kieu: 'so', gt: g[k] },
        goiY: ['Tổng bốn góc của một tứ giác bằng bao nhiêu độ?', 'Lấy $360^\\circ$ trừ đi tổng ba góc đã biết.'],
        loiGiai: ['$' + t.map(G).join(' + ') + ' = 360^\\circ$ (tổng các góc của một tứ giác).',
          '$' + G(t[k]) + ' = 360^\\circ - (' + biet.map(function (i) { return d(g[i]); }).join(' + ') + ') = 360^\\circ - ' + d(s) + '$',
          '$' + G(t[k]) + ' = ' + d(g[k]) + '$'],
        hinh: hinhBonGoc(q.P, t, g, [k])
      };
    } },
    { ten: 'Góc ngoài của tứ giác', muc: 2, sinh: function (r) {
      var t = r.chon(TEN), q = bonGoc(r, function (g) { return g[1] !== 90; }), g = q.g, e = 180 - g[1], P = q.P;
      var x = [P[1][0] + 0.45 * (P[1][0] - P[0][0]), P[1][1] + 0.45 * (P[1][1] - P[0][1])];
      var D = diemTen(P, t); D.x = x;
      var sai = 360 - (g[0] + e + g[2]);
      return {
        de: 'Tứ giác $' + t.join('') + '$ trong hình có $' + G(t[0]) + ' = ' + d(g[0]) + '$, $' + G(t[2]) + ' = ' + d(g[2]) + '$; tia $' + t[1] + 'x$ là tia đối của tia $' + t[1] + t[0] + '$ và $\\widehat{x' + t[1] + t[2] + '} = ' + d(e) + '$. Tính $' + G(t[3]) + '$ (độ).',
        dapAn: { kieu: 'so', gt: g[3] },
        goiY: ['$' + d(e) + '$ là góc **ngoài** tại $' + t[1] + '$. Góc trong $' + G(t[1]) + '$ kề bù với nó.',
          '$' + G(t[1]) + ' = 180^\\circ - ' + d(e) + '$, rồi dùng tổng bốn góc bằng $360^\\circ$.'],
        loiGiai: ['$' + G(t[1]) + ' = 180^\\circ - ' + d(e) + ' = ' + d(g[1]) + '$ (hai góc kề bù).',
          '$' + G(t[3]) + ' = 360^\\circ - (' + d(g[0]) + ' + ' + d(g[1]) + ' + ' + d(g[2]) + ')$',
          '$' + G(t[3]) + ' = ' + d(g[3]) + '$'],
        loiThuongGap: boTrung(g[3], [{ gt: sai, giaiThich: 'Em lấy luôn góc ngoài $' + d(e) + '$ làm góc $' + t[1] + '$ của tứ giác. Góc trong là $180^\\circ - ' + d(e) + ' = ' + d(g[1]) + '$.' }]),
        hinh: hinhTG({ diem: D, vong: t, canh: [[t[1], 'x', { day: 2 }]],
          goc: [bo(t, 0), ['x', t[1], t[2]], bo(t, 2), bo(t, 3).concat([{ mau: XANH }])],
          soGoc: [bo(t, 0).concat([g[0] + '°', xa(g[0])]), ['x', t[1], t[2], e + '°', xa(e) * 1.15], bo(t, 2).concat([g[2] + '°', xa(g[2])]), bo(t, 3).concat(['?', 1, XANH])] })
      };
    } },
    { ten: 'Hai góc hơn kém nhau', muc: 2, sinh: function (r) {
      var t = r.chon(TEN), q = bonGoc(r, function (g) { return g[3] - g[0] >= 10; }), g = q.g, k = g[3] - g[0], s = g[0] + g[3];
      return {
        de: 'Tứ giác $' + t.join('') + '$ trong hình có $' + G(t[1]) + ' = ' + d(g[1]) + '$, $' + G(t[2]) + ' = ' + d(g[2]) + '$ và $' + G(t[3]) + ' = ' + G(t[0]) + ' + ' + d(k) + '$. Tính $' + G(t[0]) + '$ và $' + G(t[3]) + '$ (độ).',
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$' + G(t[0]) + ' =$', kieu: 'so', gt: g[0] }, { nhan: '$' + G(t[3]) + ' =$', kieu: 'so', gt: g[3] }] },
        goiY: ['Tính tổng hai góc chưa biết trước: $' + G(t[0]) + ' + ' + G(t[3]) + ' = 360^\\circ - (' + d(g[1]) + ' + ' + d(g[2]) + ')$.',
          'Thay $' + G(t[3]) + ' = ' + G(t[0]) + ' + ' + d(k) + '$ vào tổng đó rồi tìm $' + G(t[0]) + '$.'],
        loiGiai: ['$' + G(t[0]) + ' + ' + G(t[3]) + ' = 360^\\circ - (' + d(g[1]) + ' + ' + d(g[2]) + ') = ' + d(s) + '$',
          '$2' + G(t[0]) + ' + ' + d(k) + ' = ' + d(s) + '$, nên $' + G(t[0]) + ' = (' + s + ' - ' + k + ') : 2 = ' + d(g[0]) + '$',
          '$' + G(t[3]) + ' = ' + d(g[0]) + ' + ' + d(k) + ' = ' + d(g[3]) + '$'],
        hinh: hinhBonGoc(q.P, t, g, [0, 3])
      };
    } },
    { ten: 'Bốn góc tỉ lệ', muc: 2, sinh: function (r) {
      var TL = [[1, 2, 3, 4], [2, 3, 3, 4], [1, 1, 2, 2], [3, 4, 5, 6], [2, 3, 4, 6], [1, 2, 2, 3], [4, 5, 6, 9], [3, 3, 4, 5], [5, 6, 7, 6], [2, 2, 3, 5]];
      var tl = r.chon(TL), t = r.chon(TEN), n = tong(tl), x = 360 / n;
      var hoiLon = r.dau() > 0, m = hoiLon ? Math.max.apply(null, tl) : Math.min.apply(null, tl), kq = m * x;
      var ltg = [{ gt: x, giaiThich: '$' + d(x) + '$ mới là giá trị của **một phần** ($x$). Góc ' + (hoiLon ? 'lớn' : 'nhỏ') + ' nhất ứng với $' + m + '$ phần: $' + m + 'x$.' },
        { gt: m * 180 / n, giaiThich: 'Em dùng tổng $180^\\circ$ của tam giác. Tổng bốn góc của tứ giác là $360^\\circ$.' }];
      return {
        de: 'Bốn góc $' + t.join('$, $') + '$ của tứ giác $' + t.join('') + '$ tỉ lệ với $' + tl.join(' : ') + '$. Tính góc ' + (hoiLon ? '**lớn nhất**' : '**nhỏ nhất**') + ' của tứ giác (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Đặt các góc là $' + tl.map(function (a) { return (a === 1 ? '' : a) + 'x'; }).join('$, $') + '$.',
          'Cộng lại: $' + n + 'x = 360^\\circ$. Tìm $x$ rồi nhân với số phần của góc cần tìm.'],
        loiGiai: ['$' + tl.map(function (a) { return (a === 1 ? '' : a) + 'x'; }).join(' + ') + ' = 360^\\circ$, tức $' + n + 'x = 360^\\circ$, $x = ' + d(x) + '$',
          'Góc ' + (hoiLon ? 'lớn' : 'nhỏ') + ' nhất ứng với $' + m + '$ phần: $' + (m === 1 ? 'x = ' + d(kq) : m + 'x = ' + m + ' \\cdot ' + d(x) + ' = ' + d(kq)) + '$'],
        loiThuongGap: boTrung(kq, ltg)
      };
    } },
    { ten: 'Phân giác hai góc kề', muc: 3, sinh: function (r) {
      var t = r.chon([['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']]);
      // giao của hai tia phân giác tại đỉnh thứ 3 và thứ 4
      function huong(O, X, Y) {
        var a = [X[0] - O[0], X[1] - O[1]], b = [Y[0] - O[0], Y[1] - O[1]], la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]);
        return [a[0] / la + b[0] / lb, a[1] / la + b[1] / lb];
      }
      function giaoPG(P) {
        var u = huong(P[2], P[1], P[3]), v = huong(P[3], P[2], P[0]);
        var det = u[0] * (-v[1]) - u[1] * (-v[0]), rx = P[3][0] - P[2][0], ry = P[3][1] - P[2][1];
        var k = (rx * (-v[1]) - ry * (-v[0])) / det;
        return [P[2][0] + k * u[0], P[2][1] + k * u[1]];
      }
      // I phải nằm hẳn bên trong tứ giác (cách mỗi cạnh ít nhất 0,6) để hình dễ nhìn
      function trong(P, I) {
        for (var i = 0; i < 4; i++) {
          var a = P[i], b = P[(i + 1) % 4], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (((b[0] - a[0]) * (I[1] - a[1]) - (b[1] - a[1]) * (I[0] - a[0])) / l < 0.6) return false;
        }
        return true;
      }
      var q, I;
      for (var lan = 0; lan < 50; lan++) {
        q = bonGoc(r, function (g) { return (g[0] + g[1]) % 2 === 0; });
        I = giaoPG(q.P);
        if (trong(q.P, I)) break;
      }
      if (!trong(q.P, I)) { q = { g: [90, 100, 85, 85] }; q.P = dung(q.g); I = giaoPG(q.P); }
      var g = q.g, P = q.P, s = g[0] + g[1], kq = s / 2, cd = 360 - s;
      var D = diemTen(P, t); D.I = I;
      return {
        de: 'Tứ giác $' + t.join('') + '$ có $' + G(t[0]) + ' = ' + d(g[0]) + '$, $' + G(t[1]) + ' = ' + d(g[1]) + '$. Tia phân giác của góc $' + t[2] + '$ và góc $' + t[3] + '$ cắt nhau tại $I$ (hình). Tính góc $' + t[2] + 'I' + t[3] + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tính $' + G(t[2]) + ' + ' + G(t[3]) + '$ trước, nhờ tổng bốn góc của tứ giác.',
          'Trong tam giác $I' + t[2] + t[3] + '$: hai góc tại $' + t[2] + '$, $' + t[3] + '$ bằng **một nửa** $' + G(t[2]) + '$, $' + G(t[3]) + '$. Rồi dùng tổng ba góc tam giác.'],
        loiGiai: ['$' + G(t[2]) + ' + ' + G(t[3]) + ' = 360^\\circ - (' + d(g[0]) + ' + ' + d(g[1]) + ') = ' + d(cd) + '$',
          'Vì $' + t[2] + 'I$, $' + t[3] + 'I$ là phân giác: $\\widehat{I' + t[2] + t[3] + '} + \\widehat{I' + t[3] + t[2] + '} = ' + d(cd) + ' : 2 = ' + d(cd / 2) + '$',
          'Trong tam giác $I' + t[2] + t[3] + '$: $\\widehat{' + t[2] + 'I' + t[3] + '} = 180^\\circ - ' + d(cd / 2) + ' = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [{ gt: cd / 2, giaiThich: '$' + d(cd / 2) + '$ là tổng hai góc $\\widehat{I' + t[2] + t[3] + '} + \\widehat{I' + t[3] + t[2] + '}$. Góc $' + t[2] + 'I' + t[3] + '$ bằng $180^\\circ$ trừ đi tổng đó.' }]),
        hinh: hinhTG({ diem: D, vong: t, canh: [[t[2], 'I', { mau: TIM, day: 2 }], [t[3], 'I', { mau: TIM, day: 2 }]],
          goc: [bo(t, 0), bo(t, 1), [t[2], 'I', t[3], { mau: XANH }]],
          soGoc: [bo(t, 0).concat([g[0] + '°', xa(g[0])]), bo(t, 1).concat([g[1] + '°', xa(g[1])]), [t[2], 'I', t[3], '?', 0.8, XANH]] })
      };
    } }
  ], { deCo: [
    { id: '10.L1', muc: 1, de: 'Hai đường chéo của tứ giác $PQRS$ là cặp đoạn thẳng nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['$PQ$ và $RS$', '$PS$ và $QR$', '$PR$ và $QS$', '$PQ$ và $QR$'] },
      goiY: ['Đường chéo nối hai đỉnh **đối nhau** (không cùng thuộc một cạnh).', 'Đi vòng $P \\to Q \\to R \\to S$: đỉnh đối của $P$ là đỉnh cách nó một đỉnh.'],
      loiGiai: ['Các cặp đỉnh đối nhau: $P$ và $R$; $Q$ và $S$.', 'Hai đường chéo là $PR$ và $QS$. ($PQ$ và $RS$ là một cặp **cạnh đối**.)'] },
    { id: '10.L2', muc: 1, de: 'Trong tứ giác $ABCD$, cạnh nào là cạnh **đối** của cạnh $BC$?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['$AB$', '$CD$', '$AC$', '$DA$'] },
      goiY: ['Hai cạnh đối là hai cạnh **không có đỉnh chung**.', '$BC$ có hai đỉnh $B$, $C$. Cạnh nào không chứa $B$ cũng không chứa $C$?'],
      loiGiai: ['$AB$ chung đỉnh $B$, $CD$ chung đỉnh $C$ với $BC$; $AC$ là đường chéo.', 'Cạnh đối của $BC$ là $DA$.'] },
    { id: '10.L3', muc: 1, de: 'Tên nào dưới đây **không** dùng để gọi tứ giác $ABCD$?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['$BCDA$', '$ACBD$', '$DCBA$', '$CDAB$'] },
      goiY: ['Tên tứ giác đọc các đỉnh theo thứ tự đi **vòng quanh** hình (xuôi hay ngược đều được).', 'Trong tên nào có hai đỉnh liền nhau lại là hai đỉnh đối nhau?'],
      loiGiai: ['$BCDA$, $CDAB$ là đi vòng xuôi; $DCBA$ là đi vòng ngược: đều gọi được.', '$ACBD$ đi từ $A$ sang $C$ (nhảy qua đường chéo) nên **không** phải tên của tứ giác $ABCD$.'] },
    { id: '10.L4', muc: 1, de: 'Khẳng định "Tổng các góc của một tứ giác bằng $180^\\circ$" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['$180^\\circ$ là tổng ba góc của hình nào?', 'Kẻ một đường chéo, tứ giác được chia thành mấy tam giác?'],
      loiGiai: ['Đường chéo chia tứ giác thành hai tam giác, nên tổng các góc của tứ giác là $180^\\circ + 180^\\circ = 360^\\circ$.', 'Khẳng định **sai**.'] },
    { id: '10.L5', muc: 1, de: 'Một tứ giác có bốn góc bằng nhau. Mỗi góc bằng bao nhiêu độ?',
      dapAn: { kieu: 'so', gt: 90 },
      goiY: ['Tổng bốn góc là $360^\\circ$.', 'Bốn góc bằng nhau: chia đều $360^\\circ$ cho $4$.'],
      loiGiai: ['Bốn góc bằng nhau, tổng là $360^\\circ$.', 'Mỗi góc: $360^\\circ : 4 = 90^\\circ$'],
      loiThuongGap: [{ gt: 45, giaiThich: 'Em lấy $180^\\circ : 4$. Tổng bốn góc của tứ giác là $360^\\circ$.' }] },
    { id: '10.L6', muc: 1, de: 'Trong tứ giác $MNPQ$, góc nào là góc **đối** của góc $N$?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['$\\widehat{M}$', '$\\widehat{P}$', '$\\widehat{Q}$', 'Không có'] },
      goiY: ['Hai góc đối là hai góc ở hai **đỉnh đối nhau**.', 'Đỉnh đối của $N$ là đỉnh không cùng thuộc một cạnh với $N$.'],
      loiGiai: ['$N$ kề với $M$ và $P$; đỉnh đối của $N$ là $Q$.', 'Góc đối của $\\widehat{N}$ là $\\widehat{Q}$.'] },
    { id: '10.L7', muc: 2, de: 'Khẳng định "Có tứ giác mà cả bốn góc đều là góc nhọn" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Góc nhọn nhỏ hơn $90^\\circ$. Bốn góc nhọn có tổng thế nào so với $4 \\cdot 90^\\circ$?', 'So sánh với tổng bốn góc của tứ giác.'],
      loiGiai: ['Nếu bốn góc đều nhọn thì tổng nhỏ hơn $4 \\cdot 90^\\circ = 360^\\circ$: vô lí vì tổng phải bằng $360^\\circ$.', 'Khẳng định **sai**: tứ giác luôn có ít nhất một góc không nhọn.'] },
    { id: '10.L8', muc: 2, de: 'Tứ giác $ABCD$ có $\\widehat{A} = \\widehat{C} = 90^\\circ$. Tính tổng $\\widehat{B} + \\widehat{D}$ (độ).',
      dapAn: { kieu: 'so', gt: 180 },
      goiY: ['Tổng bốn góc là $360^\\circ$.', 'Trừ đi hai góc vuông đã biết.'],
      loiGiai: ['$\\widehat{B} + \\widehat{D} = 360^\\circ - (\\widehat{A} + \\widehat{C})$', '$\\widehat{B} + \\widehat{D} = 360^\\circ - 180^\\circ = 180^\\circ$'],
      loiThuongGap: [{ gt: 90, giaiThich: 'Em chia đôi. Đề hỏi **tổng** hai góc, không hỏi mỗi góc.' }] },
    { id: '10.L9', muc: 2, de: 'Tứ giác có ba góc bằng nhau, mỗi góc bằng $100^\\circ$. Tính góc còn lại (độ).',
      dapAn: { kieu: 'so', gt: 60 },
      goiY: ['Ba góc bằng nhau có tổng $3 \\cdot 100^\\circ$.', 'Góc còn lại $= 360^\\circ -$ tổng ba góc.'],
      loiGiai: ['Tổng ba góc: $3 \\cdot 100^\\circ = 300^\\circ$.', 'Góc còn lại $= 360^\\circ - 300^\\circ = 60^\\circ$'],
      loiThuongGap: [{ gt: 260, giaiThich: 'Em chỉ trừ một góc $100^\\circ$. Có **ba** góc bằng $100^\\circ$.' }] },
    { id: '10.L10', muc: 2, de: 'Tứ giác $ABCD$ trong hình có góc ngoài tại đỉnh $B$ là $\\widehat{xBC} = 70^\\circ$ (tia $Bx$ là tia đối của tia $BA$). Tính góc $ABC$ của tứ giác (độ).', hinh: hNgoai,
      dapAn: { kieu: 'so', gt: 110 },
      goiY: ['Góc trong $\\widehat{ABC}$ và góc ngoài $\\widehat{xBC}$ có quan hệ gì?', 'Hai góc kề bù có tổng $180^\\circ$.'],
      loiGiai: ['$\\widehat{ABC}$ và $\\widehat{xBC}$ kề bù.', '$\\widehat{ABC} = 180^\\circ - 70^\\circ = 110^\\circ$'],
      loiThuongGap: [{ gt: 70, giaiThich: '$70^\\circ$ là góc **ngoài**. Góc của tứ giác tại $B$ là góc trong, kề bù với nó.' }] },
    { id: '10.L11', muc: 2, de: 'Khẳng định "Trong tứ giác (lồi), hai đường chéo cắt nhau tại một điểm nằm giữa mỗi đường" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Nhớ lại phần Lý thuyết về đường chéo của tứ giác.', 'Vẽ thử một tứ giác lồi và hai đường chéo của nó.'],
      loiGiai: ['Trong tứ giác lồi, hai đường chéo luôn cắt nhau và giao điểm nằm **bên trong** mỗi đường chéo.', 'Khẳng định **đúng**. (Chú ý: điểm đó không nhất thiết là trung điểm.)'] },
    { id: '10.L12', muc: 3, de: 'Một tứ giác có **nhiều nhất** bao nhiêu góc nhọn?',
      dapAn: { kieu: 'so', gt: 3 },
      goiY: ['Bốn góc nhọn thì tổng nhỏ hơn $360^\\circ$: có được không?', 'Thử tìm một tứ giác có ba góc nhọn, ví dụ $80^\\circ, 80^\\circ, 80^\\circ$ và góc thứ tư?'],
      loiGiai: ['Bốn góc nhọn có tổng nhỏ hơn $360^\\circ$: vô lí. Vậy không thể có $4$ góc nhọn.', 'Tứ giác có các góc $80^\\circ, 80^\\circ, 80^\\circ, 120^\\circ$ có ba góc nhọn.', 'Vậy: $\\text{số góc nhọn nhiều nhất} = 3$'],
      loiThuongGap: [{ gt: 4, giaiThich: 'Bốn góc nhọn thì tổng nhỏ hơn $360^\\circ$, không thể có.' }, { gt: 2, giaiThich: 'Vẫn có tứ giác có **ba** góc nhọn, ví dụ $80^\\circ, 80^\\circ, 80^\\circ, 120^\\circ$.' }] },
    { id: '10.L13', muc: 3, de: 'Tứ giác $ABCD$ có $\\widehat{A} = 2\\widehat{B} = 3\\widehat{C}$ và $\\widehat{D} = 85^\\circ$. Tính $\\widehat{A}$ (độ).',
      dapAn: { kieu: 'so', gt: 150 },
      goiY: ['Đặt $\\widehat{A} = 6x$ thì $\\widehat{B} = 3x$, $\\widehat{C} = 2x$ (vì $6x = 2 \\cdot 3x = 3 \\cdot 2x$).', '$6x + 3x + 2x = 360^\\circ - 85^\\circ$.'],
      loiGiai: ['$6x + 3x + 2x = 360^\\circ - 85^\\circ$, tức $11x = 275^\\circ$, $x = 25^\\circ$.', 'Thử lại: $150^\\circ + 75^\\circ + 50^\\circ + 85^\\circ = 360^\\circ$ ✓.', '$\\widehat{A} = 6x = 150^\\circ$'],
      loiThuongGap: [{ gt: 25, giaiThich: '$25^\\circ$ mới là $x$. $\\widehat{A} = 6x$.' }] }
  ] });
})();
