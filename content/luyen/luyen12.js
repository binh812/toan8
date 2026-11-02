// Luyện thêm – Bài 12: Hình bình hành
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';
  var TEN = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']];

  // ---------- Hình tĩnh (toạ độ dựng từ chính số liệu trong đề) ----------
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
  function cong(P, Q) { return [P[0] + Q[0], P[1] + Q[1]]; }
  function chuGoc(P, O, Q, k) {
    var ux = P[0] - O[0], uy = P[1] - O[1], vx = Q[0] - O[0], vy = Q[1] - O[1];
    var lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
    var wx = ux / lu + vx / lv, wy = uy / lu + vy / lv, lw = Math.hypot(wx, wy);
    if (lw < 1e-6) { wx = -uy / lu; wy = ux / lu; lw = 1; }
    return [O[0] + k * wx / lw, O[1] + k * wy / lw];
  }
  // o: { diem, vong, vach?:{AB:1}, canh?, goc?, soGoc?:[[P,O,Q,'chữ',hệ số xa?,màu?]], nhan?, lechTen?, ghiChu? }
  function hinhTG(o) {
    var D = o.diem, v = o.vong || [], canh = [], ten = Object.keys(D);
    v.forEach(function (a, i) { var b = v[(i + 1) % v.length], k = (o.vach || {})[a + b]; canh.push([a, b, k ? { vach: k } : {}]); });
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
  // Hình bình hành t[0]t[1]t[2]t[3]: t[3] ở gốc, cạnh đáy t[3]t[2] = a nằm ngang, cạnh bên t[3]t[0] = b nghiêng góc g.
  function hbh(t, a, b, g) {
    var o = {}, A = toi([0, 0], g, b);
    o[t[0]] = A; o[t[1]] = cong(A, [a, 0]); o[t[2]] = [a, 0]; o[t[3]] = [0, 0];
    return o;
  }
  // Tứ giác ABCD (A ở gốc, B bên phải) biết góc A, B, D và hai cạnh AB, AD.
  function tg4(gA, gB, gD, ab, ad) {
    var A = [0, 0], B = [ab, 0], D = toi(A, gA, ad);
    var u = [Math.cos(rad(180 - gB)), Math.sin(rad(180 - gB))], v = [Math.cos(rad(gA + 180 + gD)), Math.sin(rad(gA + 180 + gD))];
    var rx = D[0] - B[0], ry = D[1] - B[1], det = -u[0] * v[1] + u[1] * v[0];
    var t = (-rx * v[1] + ry * v[0]) / det;
    return [A, B, [B[0] + t * u[0], B[1] + t * u[1]], D];
  }
  function canhOk(P) {
    var c = P.map(function (p, i) { var q = P[(i + 1) % 4]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
    var lo = Math.min.apply(null, c), hi = Math.max.apply(null, c);
    return lo > 1.8 && hi < 2.8 * lo;
  }
  function G(n) { return '\\widehat{' + n + '}'; }
  function d(x) { return x + '^\\circ'; }
  function xa(v) { return v < 60 ? 1.4 : 1.05; }
  function boTrung(gt, ds) {
    var da = [gt];
    return ds.filter(function (l) {
      if (da.some(function (v) { return Math.abs(l.gt - v) < 1e-9; })) return false;
      da.push(l.gt); return true;
    });
  }
  function bo(t, i) { return [t[(i + 3) % 4], t[i], t[(i + 1) % 4]]; }
  function ds(x) { return String(x).replace('.', ','); } // số trên hình (chữ thường)

  TOAN8.luyen(12, [
    { ten: 'Góc của hình bình hành', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), g = r.so(9, 16) * 5, gt = [180 - g, g, 180 - g, g], i = r.so(0, 3), j;
      do { j = r.so(0, 3); } while (j === i);
      var v = gt[i], kq = gt[j], doi = (i + j) % 2 === 0;
      return {
        de: 'Hình bình hành $' + t.join('') + '$ trong hình có $' + G(t[i]) + ' = ' + d(v) + '$. Tính $' + G(t[j]) + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong hình bình hành: các góc **đối** bằng nhau; hai góc **kề một cạnh** thì bù nhau.', 'Góc $' + t[j] + '$ là góc đối hay góc kề với góc $' + t[i] + '$?'],
        loiGiai: doi
          ? ['Góc $' + t[i] + '$ và góc $' + t[j] + '$ là hai góc đối của hình bình hành nên bằng nhau.', '$' + G(t[j]) + ' = ' + G(t[i]) + ' = ' + d(kq) + '$']
          : ['Góc $' + t[i] + '$ và góc $' + t[j] + '$ kề cạnh $' + (Math.abs(i - j) === 1 ? t[Math.min(i, j)] + t[Math.max(i, j)] : t[3] + t[0]) + '$ nên bù nhau.', '$' + G(t[j]) + ' = 180^\\circ - ' + d(v) + ' = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [doi
          ? { gt: 180 - v, giaiThich: 'Hai góc đối của hình bình hành **bằng** nhau, không phải bù nhau.' }
          : { gt: v, giaiThich: 'Góc $' + t[j] + '$ kề với góc $' + t[i] + '$ (chung một cạnh) nên **bù** với nó. Góc bằng góc $' + t[i] + '$ là góc đối.' }]),
        hinh: hinhTG({ diem: hbh(t, 6.5, r.chon([3.5, 4, 4.5]), g), vong: t,
          goc: [bo(t, i), bo(t, j).concat([{ mau: XANH }])], soGoc: [bo(t, i).concat([v + '°', xa(v)]), bo(t, j).concat(['?', 1, XANH])] })
      };
    } },
    { ten: 'Hai đường chéo cắt nhau tại trung điểm', muc: 1, sinh: function (r, cc) {
      var t = r.chon(TEN), oa = r.so(6, 24) / 2, ob = Math.round(oa * r.chon([0.5, 0.6, 0.7, 0.8, 1.2, 1.4]) * 2) / 2, th = r.so(10, 14) * 10;
      var O = [0, 0], A = toi(O, 200, oa), B = toi(O, 200 + th, ob), D = {};
      D[t[0]] = A; D[t[1]] = B; D[t[2]] = [-A[0], -A[1]]; D[t[3]] = [-B[0], -B[1]]; D.O = O;
      var hoiAC = r.dau() > 0, kq, de, lg, ltg, nhan;
      if (hoiAC) {
        kq = 2 * oa;
        de = 'Hình bình hành $' + t.join('') + '$ trong hình có hai đường chéo cắt nhau tại $O$, $O' + t[0] + ' = ' + cc.so(oa) + '$ cm. Tính $' + t[0] + t[2] + '$ (cm).';
        lg = ['$O$ là trung điểm của $' + t[0] + t[2] + '$ (hai đường chéo cắt nhau tại trung điểm mỗi đường).', '$' + t[0] + t[2] + ' = 2 \\cdot ' + cc.so(oa) + ' = ' + cc.so(kq) + '$'];
        ltg = [{ gt: oa / 2, giaiThich: '$O' + t[0] + '$ là **một nửa** $' + t[0] + t[2] + '$, nên phải nhân đôi chứ không chia đôi.' }];
        nhan = [['O', t[0], ds(oa) + ' cm', false, 1, TIM], ['O', t[2], '?', false, 1, XANH]];
      } else {
        kq = ob;
        de = 'Hình bình hành $' + t.join('') + '$ trong hình có hai đường chéo cắt nhau tại $O$, $' + t[1] + t[3] + ' = ' + cc.so(2 * ob) + '$ cm. Tính $O' + t[1] + '$ (cm).';
        lg = ['$O$ là trung điểm của $' + t[1] + t[3] + '$ (hai đường chéo cắt nhau tại trung điểm mỗi đường).', '$O' + t[1] + ' = ' + cc.so(2 * ob) + ' : 2 = ' + cc.so(kq) + '$'];
        ltg = [{ gt: 4 * ob, giaiThich: '$O' + t[1] + '$ là **một nửa** $' + t[1] + t[3] + '$, nên phải chia đôi chứ không nhân đôi.' }];
        nhan = [['O', t[1], '?', false, 1, XANH]];
      }
      return {
        de: de, dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong hình bình hành, hai đường chéo cắt nhau tại **trung điểm** của mỗi đường.', hoiAC ? '$' + t[0] + t[2] + ' = 2 \\cdot O' + t[0] + '$.' : '$O' + t[1] + ' = ' + t[1] + t[3] + ' : 2$.'],
        loiGiai: lg, loiThuongGap: boTrung(kq, ltg),
        hinh: hinhTG({ diem: D, vong: t, canh: [[t[0], t[2], { mau: TIM, day: 2 }], [t[1], t[3], { mau: TIM, day: 2 }]], nhan: nhan,
          lechTen: { O: [0, -18] }, ghiChu: hoiAC ? null : t[1] + t[3] + ' = ' + ds(2 * ob) + ' cm' })
      };
    } },
    { ten: 'Chu vi hình bình hành', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), a = r.so(5, 14), b = r.so(3, a - 1), P = 2 * (a + b), g = r.so(10, 15) * 5;
      var s = 6.5 / a;
      return {
        de: 'Hình bình hành $' + t.join('') + '$ trong hình có $' + t[3] + t[2] + ' = ' + a + '$ cm, $' + t[3] + t[0] + ' = ' + b + '$ cm. Tính chu vi của nó (cm).',
        dapAn: { kieu: 'so', gt: P },
        goiY: ['Các cạnh đối của hình bình hành bằng nhau.', 'Chu vi $= 2 \\cdot ($tổng hai cạnh kề$)$.'],
        loiGiai: ['$' + t[0] + t[1] + ' = ' + t[3] + t[2] + ' = ' + a + '$ cm, $' + t[1] + t[2] + ' = ' + t[3] + t[0] + ' = ' + b + '$ cm (cạnh đối).',
          'Chu vi $= 2 \\cdot (' + a + ' + ' + b + ') = ' + P + '$ (cm)'],
        loiThuongGap: boTrung(P, [{ gt: a + b, giaiThich: '$' + (a + b) + '$ cm mới là **nửa** chu vi (tổng hai cạnh kề). Hình bình hành có bốn cạnh: nhân đôi.' }]),
        hinh: hinhTG({ diem: hbh(t, a * s, b * s, g), vong: t, nhan: [[t[3], t[2], a + ' cm'], [t[3], t[0], b + ' cm']] })
      };
    } },
    { ten: 'Phân giác cắt cạnh đối', muc: 2, sinh: function (r) {
      var L = r.so(6, 14), S = r.so(Math.max(3, Math.ceil(L / 3)), L - 2), g = r.so(10, 14) * 5, kq = L - S, D;
      var veD = r.dau() > 0, de, lg, hinh;
      if (veD) { // phân giác góc D cắt AB tại E: AE = AD
        var A = toi([0, 0], g, S);
        D = { A: A, B: cong(A, [L, 0]), C: [L, 0], D: [0, 0], E: cong(A, [S, 0]) };
        de = 'Hình bình hành $ABCD$ trong hình có $CD = ' + L + '$ cm, $AD = ' + S + '$ cm. Tia phân giác của góc $D$ cắt cạnh $AB$ tại $E$. Tính $EB$ (cm).';
        lg = ['$AB \\parallel CD$ nên $\\widehat{AED} = \\widehat{EDC}$ (so le trong) $= \\widehat{ADE}$ (phân giác). Vậy tam giác $ADE$ cân tại $A$: $AE = AD = ' + S + '$ cm.',
          '$AB = CD = ' + L + '$ cm (cạnh đối).', '$EB = AB - AE = ' + L + ' - ' + S + ' = ' + kq + '$'];
        hinh = hinhTG({ diem: D, vong: ['A', 'B', 'C', 'D'], canh: [['D', 'E', { mau: CAM, day: 3 }]], goc: [['A', 'D', 'E', { r: 0.09 * L }], ['E', 'D', 'C', { r: 0.11 * L }]],
          nhan: [['D', 'A', S + ' cm'], ['D', 'C', L + ' cm'], ['E', 'B', '?', true, 1, XANH]], lechTen: { E: [0, 16] } });
      } else { // phân giác góc A cắt BC tại E: BE = AB
        var B = toi([0, 0], g, S);
        D = { A: [0, 0], B: B, C: cong(B, [L, 0]), D: [L, 0], E: cong(B, [S, 0]) };
        de = 'Hình bình hành $ABCD$ trong hình có $AB = ' + S + '$ cm, $AD = ' + L + '$ cm. Tia phân giác của góc $A$ cắt cạnh $BC$ tại $E$. Tính $EC$ (cm).';
        lg = ['$AD \\parallel BC$ nên $\\widehat{BEA} = \\widehat{EAD}$ (so le trong) $= \\widehat{BAE}$ (phân giác). Vậy tam giác $ABE$ cân tại $B$: $BE = AB = ' + S + '$ cm.',
          '$BC = AD = ' + L + '$ cm (cạnh đối).', '$EC = BC - BE = ' + L + ' - ' + S + ' = ' + kq + '$'];
        hinh = hinhTG({ diem: D, vong: ['A', 'B', 'C', 'D'], canh: [['A', 'E', { mau: CAM, day: 3 }]], goc: [['B', 'A', 'E', { r: 0.09 * L }], ['E', 'A', 'D', { r: 0.11 * L }]],
          nhan: [['A', 'B', S + ' cm'], ['A', 'D', L + ' cm'], ['E', 'C', '?', false, 1, XANH]], lechTen: { E: [0, 16] } });
      }
      return {
        de: de, dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hai cạnh đối song song cho một cặp góc so le trong; kết hợp với tia phân giác, em tìm được một **tam giác cân**.',
          'Tam giác cân cho một đoạn bằng cạnh đã biết; phần còn lại = cạnh đối − đoạn đó.'],
        loiGiai: lg,
        loiThuongGap: boTrung(kq, [{ gt: S, giaiThich: '$' + S + '$ cm là đoạn ' + (veD ? '$AE$' : '$BE$') + ' (cạnh của tam giác cân). Đề hỏi phần còn lại.' }, { gt: L, giaiThich: '$' + L + '$ cm là cả cạnh ' + (veD ? '$AB$' : '$BC$') + '. Còn phải trừ đi đoạn ' + (veD ? '$AE$' : '$BE$') + '.' }]),
        hinh: hinh
      };
    } },
    { ten: 'Góc kề hơn kém, gấp nhau', muc: 2, sinh: function (r) {
      var t = r.chon(TEN), loai = r.dau() > 0, lon, nho, de, lg, ltg;
      var hoi = r.chon([0, 1, 2, 3]); // hỏi góc t[hoi]; t[0] là góc lớn
      if (loai) {
        var k = r.so(2, 14) * 10; lon = (180 + k) / 2; nho = 180 - lon;
        if (lon % 1) { k += 10; lon = (180 + k) / 2; nho = 180 - lon; }
        de = 'Hình bình hành $' + t.join('') + '$ có $' + G(t[0]) + ' - ' + G(t[1]) + ' = ' + d(k) + '$. Tính $' + G(t[hoi]) + '$ (độ).';
        lg = ['$' + G(t[0]) + ' + ' + G(t[1]) + ' = 180^\\circ$ (hai góc kề cạnh $' + t[0] + t[1] + '$ bù nhau).',
          '$' + G(t[0]) + ' = (180^\\circ + ' + d(k) + ') : 2 = ' + d(lon) + '$; $' + G(t[1]) + ' = 180^\\circ - ' + d(lon) + ' = ' + d(nho) + '$.'];
      } else {
        var m = r.chon([2, 3, 4, 5, 8, 9]); nho = 180 / (m + 1); lon = m * nho;
        de = 'Hình bình hành $' + t.join('') + '$ có $' + G(t[0]) + ' = ' + m + G(t[1]) + '$. Tính $' + G(t[hoi]) + '$ (độ).';
        lg = ['$' + G(t[0]) + ' + ' + G(t[1]) + ' = 180^\\circ$ nên $' + m + G(t[1]) + ' + ' + G(t[1]) + ' = 180^\\circ$, $' + G(t[1]) + ' = 180^\\circ : ' + (m + 1) + ' = ' + d(nho) + '$.',
          '$' + G(t[0]) + ' = ' + m + ' \\cdot ' + d(nho) + ' = ' + d(lon) + '$.'];
      }
      var kq = hoi % 2 === 0 ? lon : nho;
      if (hoi >= 2) lg.push('$' + G(t[hoi]) + ' = ' + G(t[hoi - 2]) + ' = ' + d(kq) + '$ (hai góc đối bằng nhau)');
      else lg.push('Vậy $' + G(t[hoi]) + ' = ' + d(kq) + '$');
      ltg = [{ gt: hoi % 2 === 0 ? nho : lon, giaiThich: 'Em nhầm góc. ' + (hoi < 2 ? '$' + G(t[hoi]) + '$ là góc ' + (hoi === 0 ? 'lớn' : 'nhỏ') + ' trong hai góc kề.'
        : '$' + G(t[hoi]) + '$ đối với $' + G(t[hoi - 2]) + '$ nên bằng nó: là góc ' + (hoi === 2 ? 'lớn' : 'nhỏ') + '.') }];
      return {
        de: de, dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hai góc kề một cạnh của hình bình hành bù nhau: $' + G(t[0]) + ' + ' + G(t[1]) + ' = 180^\\circ$.', 'Tìm $' + G(t[0]) + '$, $' + G(t[1]) + '$ rồi dùng: các góc đối bằng nhau.'],
        loiGiai: lg, loiThuongGap: boTrung(kq, ltg)
      };
    } },
    { ten: 'Nhận biết hình bình hành theo góc', muc: 2, sinh: function (r) {
      var gA, gB, gC, gD, P, la, lan = 0;
      do {
        la = r.dau() > 0;
        gA = r.so(13, 26) * 5; gB = 180 - gA;
        if (la) { gC = gA; gD = gB; } else { gC = gA + r.chon([-10, -5, 5, 10]); gD = 360 - gA - gB - gC; }
        P = tg4(gA, gB, gD, r.chon([6, 6.5, 7]), r.chon([3.5, 4, 4.5]));
        lan++;
      } while ((!canhOk(P) || P[2][1] < 1) && lan < 50);
      if (!canhOk(P)) { la = true; gA = 115; gB = 65; gC = 115; gD = 65; P = tg4(115, 65, 65, 6.5, 4); }
      var t = ['A', 'B', 'C', 'D'], D = { A: P[0], B: P[1], C: P[2], D: P[3] };
      return {
        de: 'Tứ giác $ABCD$ trong hình có $\\widehat{A} = ' + d(gA) + '$, $\\widehat{B} = ' + d(gB) + '$, $\\widehat{D} = ' + d(gD) + '$. Khẳng định "$ABCD$ là hình bình hành" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: la },
        goiY: ['Tính góc $C$ nhờ tổng bốn góc bằng $360^\\circ$.', 'Tứ giác có **các góc đối bằng nhau** là hình bình hành. So sánh $\\widehat{A}$ với $\\widehat{C}$, $\\widehat{B}$ với $\\widehat{D}$.'],
        loiGiai: ['$\\widehat{C} = 360^\\circ - (' + d(gA) + ' + ' + d(gB) + ' + ' + d(gD) + ') = ' + d(gC) + '$.',
          la ? '$\\widehat{A} = \\widehat{C} = ' + d(gA) + '$ và $\\widehat{B} = \\widehat{D} = ' + d(gB) + '$: các góc đối bằng nhau.' : '$\\widehat{A} = ' + d(gA) + ' \\ne ' + d(gC) + ' = \\widehat{C}$: hai góc đối không bằng nhau.',
          la ? 'Vậy $ABCD$ là hình bình hành. Khẳng định **đúng**.' : 'Vậy $ABCD$ **không** là hình bình hành (dù $\\widehat{A} + \\widehat{B} = 180^\\circ$ cho $AD \\parallel BC$, nó chỉ là hình thang). Khẳng định **sai**.'],
        hinh: hinhTG({ diem: D, vong: t, goc: [bo(t, 0), bo(t, 1), bo(t, 3)],
          soGoc: [bo(t, 0).concat([gA + '°', xa(gA)]), bo(t, 1).concat([gB + '°', xa(gB)]), bo(t, 3).concat([gD + '°', xa(gD)])] })
      };
    } },
    { ten: 'Chu vi khi biết phân giác', muc: 3, sinh: function (r) {
      var a = r.so(3, 9), c = r.so(2, Math.min(8, 2 * a)), L = a + c, P = 2 * (a + L), g = r.so(10, 14) * 5;
      var B = toi([0, 0], g, a), D = { A: [0, 0], B: B, C: cong(B, [L, 0]), D: [L, 0], E: cong(B, [a, 0]) };
      return {
        de: 'Hình bình hành $ABCD$ trong hình có $AB = ' + a + '$ cm. Tia phân giác của góc $A$ cắt cạnh $BC$ tại $E$, biết $EC = ' + c + '$ cm. Tính chu vi hình bình hành (cm).',
        dapAn: { kieu: 'so', gt: P },
        goiY: ['$AD \\parallel BC$ nên $\\widehat{BEA} = \\widehat{EAD} = \\widehat{BAE}$: tam giác $ABE$ cân. Tìm $BE$.', '$BC = BE + EC$; chu vi $= 2 \\cdot (AB + BC)$.'],
        loiGiai: ['$AD \\parallel BC$ nên $\\widehat{BEA} = \\widehat{EAD}$ (so le trong) $= \\widehat{BAE}$ (phân giác). Tam giác $ABE$ cân tại $B$: $BE = AB = ' + a + '$ cm.',
          '$BC = BE + EC = ' + a + ' + ' + c + ' = ' + L + '$ (cm).',
          'Chu vi $= 2 \\cdot (' + a + ' + ' + L + ') = ' + P + '$ (cm)'],
        loiThuongGap: boTrung(P, [{ gt: 2 * (a + c), giaiThich: 'Em lấy $BC = EC = ' + c + '$ cm. Cạnh $BC$ gồm cả $BE$ và $EC$.' }, { gt: a + L, giaiThich: '$' + (a + L) + '$ cm mới là nửa chu vi ($AB + BC$). Nhân đôi.' }]),
        hinh: hinhTG({ diem: D, vong: ['A', 'B', 'C', 'D'], canh: [['A', 'E', { mau: CAM, day: 3 }]], goc: [['B', 'A', 'E', { r: 0.09 * L }], ['E', 'A', 'D', { r: 0.11 * L }]],
          nhan: [['A', 'B', a + ' cm'], ['E', 'C', c + ' cm', true]], lechTen: { E: [0, 16] } })
      };
    } },
    { ten: 'Bài toán thực tế: tìm cạnh', muc: 3, sinh: function (r) {
      var vat = r.chon([['Một mảnh đất', 'm'], ['Một tấm bìa', 'cm'], ['Một khung cửa sổ trang trí', 'dm'], ['Một luống rau', 'm']]);
      var b = r.so(3, 12), k = r.so(1, 8), a = b + k, P = 2 * (a + b), hoiDai = r.dau() > 0, kq = hoiDai ? a : b;
      return {
        de: vat[0] + ' có dạng hình bình hành với chu vi $' + P + '$ ' + vat[1] + ', trong đó một cạnh dài hơn cạnh kề với nó $' + k + '$ ' + vat[1] + '. Tính độ dài cạnh ' + (hoiDai ? '**dài** hơn' : '**ngắn** hơn') + ' (' + vat[1] + ').',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Các cạnh đối bằng nhau nên tổng hai cạnh kề bằng **nửa** chu vi.', 'Biết tổng và hiệu hai cạnh kề: số lớn $= ($tổng $+$ hiệu$) : 2$.'],
        loiGiai: ['Tổng hai cạnh kề: $' + P + ' : 2 = ' + (a + b) + '$ (' + vat[1] + ').',
          hoiDai ? 'Cạnh dài: $(' + (a + b) + ' + ' + k + ') : 2 = ' + a + '$' : 'Cạnh ngắn: $(' + (a + b) + ' - ' + k + ') : 2 = ' + b + '$'],
        loiThuongGap: boTrung(kq, [{ gt: hoiDai ? (P + k) / 2 : (P - k) / 2, giaiThich: 'Em quên chia đôi chu vi. Tổng **hai cạnh kề** chỉ bằng nửa chu vi: $' + (a + b) + '$ ' + vat[1] + '.' },
          { gt: hoiDai ? b : a, giaiThich: 'Đó là cạnh ' + (hoiDai ? 'ngắn' : 'dài') + '. Đề hỏi cạnh ' + (hoiDai ? 'dài' : 'ngắn') + ' hơn.' }])
      };
    } }
  ]);
})();
