// Luyện thêm – Bài 13: Hình chữ nhật
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5', VUONG = { mau: '#868e96' };
  var TEN = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']];

  // ---------- Hình tĩnh (toạ độ dựng từ chính số liệu trong đề) ----------
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
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
  // Hình chữ nhật t (t[0] trên trái, t[1] trên phải, t[2] dưới phải, t[3] dưới trái), tâm O ở gốc:
  // nửa đường chéo R, hai đường chéo tạo góc t[0]Ot[1] = al.
  function hcn(t, R, al) {
    var b = (180 - al) / 2, o = {};
    var q = al < 90 ? 90 : 0; // góc nhọn: xoay 90° để hình nằm ngang, không bị cao gầy
    o[t[0]] = toi([0, 0], 180 - b + q, R); o[t[1]] = toi([0, 0], b + q, R); o[t[2]] = toi([0, 0], 360 - b + q, R); o[t[3]] = toi([0, 0], 180 + b + q, R);
    o.O = [0, 0];
    return o;
  }
  function vuong4(t) { return [0, 1, 2, 3].map(function (i) { return [t[(i + 3) % 4], t[i], t[(i + 1) % 4], VUONG]; }); }
  // Tam giác ABC vuông tại A, cạnh huyền BC = a nằm ngang, góc B = gB; M là trung điểm BC.
  function tgVuong(a, gB) {
    var A = toi([0, 0], gB, a * Math.cos(rad(gB)));
    return { A: A, B: [0, 0], C: [a, 0], M: [a / 2, 0] };
  }
  function G(n) { return '\\widehat{' + n + '}'; }
  function d(x) { return x + '^\\circ'; }
  function ds(x) { return String(x).replace('.', ','); }
  function boTrung(gt, ds) {
    var da = [gt];
    return ds.filter(function (l) {
      if (da.some(function (v) { return Math.abs(l.gt - v) < 1e-9; })) return false;
      da.push(l.gt); return true;
    });
  }

  // Hình cho câu soạn sẵn
  var hHBH = hinhTG({ diem: hcn(['A', 'B', 'C', 'D'], 3.5, 118), vong: ['A', 'B', 'C', 'D'], canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    lechTen: { O: [0, -18] }, ghiChu: 'AC = BD = 7 cm' });
  var hTG = tgVuong(10, 35);
  var hTT = hinhTG({ diem: hTG, vong: ['A', 'B', 'C'], canh: [['A', 'M', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
    nhan: [['A', 'M', '5 cm', true, 1, TIM]], ghiChu: 'BC = 10 cm', goc: [['B', 'A', 'C', { mau: XANH }]], lechTen: { M: [0, -18] } });

  TOAN8.luyen(13, [
    { ten: 'Đường chéo hình chữ nhật', muc: 1, sinh: function (r, cc) {
      var t = r.chon(TEN), loai = r.dau() > 0, x = r.so(6, 30) / 2, al = r.so(10, 14) * 10;
      var D = hcn(t, 3.5, al), kq, de, lg, ltg, nhan, ghi = null;
      if (loai) { // biết đường chéo, hỏi nửa đường chéo ở đường chéo kia
        kq = x;
        de = 'Hình chữ nhật $' + t.join('') + '$ trong hình có đường chéo $' + t[0] + t[2] + ' = ' + cc.so(2 * x) + '$ cm, $O$ là giao điểm hai đường chéo. Tính $O' + t[1] + '$ (cm).';
        lg = ['Hình chữ nhật có hai đường chéo bằng nhau: $' + t[1] + t[3] + ' = ' + t[0] + t[2] + ' = ' + cc.so(2 * x) + '$ cm.', '$O$ là trung điểm của $' + t[1] + t[3] + '$ nên $O' + t[1] + ' = ' + cc.so(2 * x) + ' : 2 = ' + cc.so(x) + '$'];
        ltg = [{ gt: 2 * x, giaiThich: '$' + cc.so(2 * x) + '$ cm là cả đường chéo. $O$ là trung điểm nên $O' + t[1] + '$ chỉ bằng một nửa.' }];
        nhan = [['O', t[1], '?', false, 1, XANH]]; ghi = t[0] + t[2] + ' = ' + ds(2 * x) + ' cm';
      } else { // biết OA, hỏi BD
        kq = 2 * x;
        de = 'Hình chữ nhật $' + t.join('') + '$ trong hình có hai đường chéo cắt nhau tại $O$ và $O' + t[0] + ' = ' + cc.so(x) + '$ cm. Tính đường chéo $' + t[1] + t[3] + '$ (cm).';
        lg = ['$O$ là trung điểm của $' + t[0] + t[2] + '$ nên $' + t[0] + t[2] + ' = 2 \\cdot ' + cc.so(x) + ' = ' + cc.so(2 * x) + '$ cm.', 'Hai đường chéo của hình chữ nhật bằng nhau: $' + t[1] + t[3] + ' = ' + t[0] + t[2] + ' = ' + cc.so(2 * x) + '$'];
        ltg = [{ gt: x, giaiThich: 'Em lấy $' + t[1] + t[3] + ' = O' + t[0] + '$. $O' + t[0] + '$ chỉ là **một nửa** đường chéo.' }];
        nhan = [['O', t[0], ds(x) + ' cm', false, 1, TIM]];
      }
      return {
        de: de, dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong hình chữ nhật, hai đường chéo **bằng nhau** và cắt nhau tại **trung điểm** mỗi đường.', 'Vậy $O' + t[0] + ' = O' + t[1] + ' = O' + t[2] + ' = O' + t[3] + '$ = một nửa đường chéo.'],
        loiGiai: lg, loiThuongGap: boTrung(kq, ltg),
        hinh: hinhTG({ diem: D, vong: t, canh: [[t[0], t[2], { mau: TIM, day: 2 }], [t[1], t[3], { mau: TIM, day: 2 }]], goc: vuong4(t), nhan: nhan, ghiChu: ghi, lechTen: { O: [0, -18] } })
      };
    } },
    { ten: 'Trung tuyến ứng với cạnh huyền', muc: 1, sinh: function (r, cc) {
      var a = r.so(6, 30), gB = r.chon([30, 35, 40, 50, 55, 60]), hoiAM = r.dau() > 0, kq = hoiAM ? a / 2 : a;
      var D = tgVuong(a, gB);
      return {
        de: hoiAM
          ? 'Tam giác $ABC$ trong hình vuông tại $A$, cạnh huyền $BC = ' + a + '$ cm, $M$ là trung điểm $BC$. Tính $AM$ (cm).'
          : 'Tam giác $ABC$ trong hình vuông tại $A$, $M$ là trung điểm $BC$ và trung tuyến $AM = ' + cc.so(a / 2) + '$ cm. Tính cạnh huyền $BC$ (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng **một nửa** cạnh huyền.', hoiAM ? '$AM = BC : 2$.' : '$BC = 2 \\cdot AM$.'],
        loiGiai: ['Tam giác $ABC$ vuông tại $A$, $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $AM = \\frac{BC}{2}$.',
          hoiAM ? '$AM = ' + a + ' : 2 = ' + cc.so(kq) + '$' : '$BC = 2 \\cdot ' + cc.so(a / 2) + ' = ' + kq + '$'],
        loiThuongGap: boTrung(kq, hoiAM ? [{ gt: a, giaiThich: 'Trung tuyến $AM$ chỉ bằng **nửa** cạnh huyền, không bằng cả cạnh huyền.' }]
          : [{ gt: a / 4, giaiThich: '$AM$ là nửa $BC$ nên $BC$ gấp đôi $AM$ (nhân 2, không chia 2).' }]),
        hinh: hinhTG({ diem: D, vong: ['A', 'B', 'C'], canh: [['A', 'M', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]], goc: [['B', 'A', 'C', VUONG]],
          nhan: hoiAM ? [['A', 'M', '?', true, 1, XANH]] : [['A', 'M', ds(a / 2) + ' cm', true, 1, TIM]], ghiChu: 'BC = ' + (hoiAM ? a + ' cm' : '?'), lechTen: { M: [0, -18] } })
      };
    } },
    { ten: 'Góc tạo bởi hai đường chéo', muc: 2, sinh: function (r) {
      var t = r.chon(TEN), al = r.so(20, 75) * 2, hoiKe = r.dau() > 0; // hoiKe: hỏi góc O t0 t1; ngược lại hỏi góc O t0 t3
      if (al === 90) al = 100;
      var kq = hoiKe ? (180 - al) / 2 : al / 2, X = hoiKe ? t[1] : t[3];
      var lg = hoiKe
        ? ['$O' + t[0] + ' = O' + t[1] + '$ (nửa hai đường chéo bằng nhau) nên tam giác $O' + t[0] + t[1] + '$ cân tại $O$.',
          '$\\widehat{O' + t[0] + t[1] + '} = (180^\\circ - ' + d(al) + ') : 2 = ' + d(kq) + '$']
        : ['$\\widehat{' + t[0] + 'O' + t[3] + '} = 180^\\circ - ' + d(al) + ' = ' + d(180 - al) + '$ (kề bù với $\\widehat{' + t[0] + 'O' + t[1] + '}$).',
          '$O' + t[0] + ' = O' + t[3] + '$ nên tam giác $O' + t[0] + t[3] + '$ cân tại $O$.',
          '$\\widehat{O' + t[0] + t[3] + '} = (180^\\circ - ' + d(180 - al) + ') : 2 = ' + d(kq) + '$'];
      var ltg = hoiKe ? [{ gt: 180 - al, giaiThich: '$' + d(180 - al) + '$ là **tổng** hai góc ở đáy của tam giác cân $O' + t[0] + t[1] + '$. Mỗi góc chỉ bằng một nửa.' }, { gt: al / 2, giaiThich: 'Đó là góc $O' + t[0] + t[3] + '$. Góc $O' + t[0] + t[1] + '$ nằm trong tam giác $O' + t[0] + t[1] + '$.' }]
        : [{ gt: (180 - al) / 2, giaiThich: 'Đó là góc $O' + t[0] + t[1] + '$. Góc $O' + t[0] + t[3] + '$ nằm trong tam giác $O' + t[0] + t[3] + '$, có góc ở đỉnh $O$ là $' + d(180 - al) + '$.' }];
      return {
        de: 'Hình chữ nhật $' + t.join('') + '$ trong hình có hai đường chéo cắt nhau tại $O$, $\\widehat{' + t[0] + 'O' + t[1] + '} = ' + d(al) + '$. Tính góc $O' + t[0] + X + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong hình chữ nhật, $O' + t[0] + ' = O' + t[1] + ' = O' + t[2] + ' = O' + t[3] + '$. Tam giác $O' + t[0] + X + '$ là tam giác gì?', hoiKe ? 'Hai góc ở đáy của tam giác cân bằng $(180^\\circ - ' + d(al) + ') : 2$.' : 'Tính góc $' + t[0] + 'O' + t[3] + '$ trước (kề bù với góc $' + t[0] + 'O' + t[1] + '$).'],
        loiGiai: lg, loiThuongGap: boTrung(kq, ltg),
        hinh: hinhTG({ diem: hcn(t, 3.5, al), vong: t, canh: [[t[0], t[2], { mau: TIM, day: 2 }], [t[1], t[3], { mau: TIM, day: 2 }]],
          goc: [[t[0], 'O', t[1]], ['O', t[0], X, { mau: XANH }]], soGoc: [[t[0], 'O', t[1], al + '°', al < 70 ? 0.8 : 0.6], ['O', t[0], X, '?', 1.1, XANH]], lechTen: { O: [0, -18] } })
      };
    } },
    { ten: 'Trung tuyến bằng nửa cạnh: góc còn lại', muc: 2, sinh: function (r) {
      var a = r.so(3, 12) * 2, gB = r.chon([25, 30, 35, 40, 50, 55, 60, 65]), kq = 90 - gB;
      return {
        de: 'Tam giác $ABC$ trong hình có $M$ là trung điểm của $BC$, $BC = ' + a + '$ cm, trung tuyến $AM = ' + a / 2 + '$ cm và $\\widehat{B} = ' + d(gB) + '$. Tính $\\widehat{C}$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['So sánh $AM$ với $\\frac{BC}{2}$: tam giác có trung tuyến bằng nửa cạnh tương ứng là tam giác gì?', 'Biết $\\widehat{A}$ rồi dùng tổng ba góc của tam giác.'],
        loiGiai: ['$\\frac{BC}{2} = ' + a / 2 + ' = AM$ nên tam giác $ABC$ vuông tại $A$: $\\widehat{A} = 90^\\circ$.',
          '$\\widehat{C} = 180^\\circ - (90^\\circ + ' + d(gB) + ') = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [{ gt: gB, giaiThich: 'Tam giác $ABC$ không cân. Hãy nhận ra $\\widehat{A} = 90^\\circ$ (vì $AM = \\frac{BC}{2}$) rồi dùng tổng ba góc.' }]),
        hinh: hinhTG({ diem: tgVuong(a, gB), vong: ['A', 'B', 'C'], canh: [['A', 'M', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
          goc: [['A', 'B', 'C'], ['A', 'C', 'B', { mau: XANH }]], soGoc: [['A', 'B', 'C', gB + '°', 1.5], ['A', 'C', 'B', '?', 1.3, XANH]],
          nhan: [['A', 'M', a / 2 + ' cm', true, 1, TIM]], ghiChu: 'BC = ' + a + ' cm', lechTen: { M: [0, -18] } })
      };
    } },
    { ten: 'Tam giác vuông: góc tại trung điểm cạnh huyền', muc: 3, sinh: function (r) {
      var gB = r.chon([25, 30, 35, 40, 50, 55, 60, 65]), hoiC = r.dau() > 0, kq = hoiC ? 2 * gB : 180 - 2 * gB, X = hoiC ? 'C' : 'B';
      return {
        de: 'Tam giác $ABC$ vuông tại $A$ có $\\widehat{B} = ' + d(gB) + '$, $M$ là trung điểm của cạnh huyền $BC$ (hình). Tính góc $AM' + X + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$AM = \\frac{BC}{2} = MB = MC$. Tam giác $ABM$ là tam giác gì?', 'Tam giác $ABM$ cân tại $M$ nên $\\widehat{BAM} = \\widehat{B}$; tính góc $AMB$ bằng tổng ba góc' + (hoiC ? ', rồi dùng hai góc kề bù.' : '.')],
        loiGiai: ['$AM$ là trung tuyến ứng với cạnh huyền nên $AM = \\frac{BC}{2} = MB$: tam giác $ABM$ cân tại $M$, $\\widehat{BAM} = \\widehat{B} = ' + d(gB) + '$.',
          '$\\widehat{AMB} = 180^\\circ - 2 \\cdot ' + d(gB) + ' = ' + d(180 - 2 * gB) + '$' + (hoiC ? '.' : ''),
          hoiC ? '$\\widehat{AMC} = 180^\\circ - ' + d(180 - 2 * gB) + ' = ' + d(kq) + '$' : 'Vậy $\\widehat{AMB} = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [{ gt: hoiC ? 180 - 2 * gB : 2 * gB, giaiThich: 'Em nhầm hai góc $AMB$ và $AMC$. Chúng kề bù nhau; góc cần tìm là góc $AM' + X + '$.' }, { gt: 180 - gB, giaiThich: 'Tam giác $ABM$ cân tại $M$ nên **hai** góc ở đáy bằng $' + d(gB) + '$; phải trừ $2 \\cdot ' + d(gB) + '$.' }]),
        hinh: hinhTG({ diem: tgVuong(8, gB), vong: ['A', 'B', 'C'], canh: [['A', 'M', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
          goc: [['C', 'A', 'B', VUONG], ['A', 'B', 'C'], ['A', 'M', X, { mau: XANH }]], soGoc: [['A', 'B', 'C', gB + '°', 1.5], ['A', 'M', X, '?', 0.9, XANH]], lechTen: { M: [0, -18] } })
      };
    } },
    { ten: 'Hình chữ nhật có MA ⊥ MD', muc: 3, sinh: function (r) {
      var ab = r.so(3, 12), P = 6 * ab, hoiAB = r.dau() > 0, kq = hoiAB ? ab : 2 * ab;
      return {
        de: 'Hình chữ nhật $ABCD$ trong hình có chu vi $' + P + '$ cm, $M$ là trung điểm cạnh $BC$ và $MA \\perp MD$. Tính ' + (hoiAB ? '$AB$' : '$BC$') + ' (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$\\triangle ABM = \\triangle DCM$ (c.g.c) nên $MA = MD$: tam giác $AMD$ vuông cân tại $M$, suy ra $\\widehat{AMB} = 45^\\circ$.', 'Tam giác $ABM$ vuông cân: $AB = BM = \\frac{BC}{2}$, nên chu vi $= 2(AB + 2AB) = 6AB$.'],
        loiGiai: ['$\\triangle ABM = \\triangle DCM$ (c.g.c) nên $MA = MD$; tam giác $AMD$ vuông cân tại $M$, nên $\\widehat{AMB} = \\widehat{MAD} = 45^\\circ$ (so le trong).',
          'Tam giác $ABM$ vuông cân tại $B$: $AB = BM$, tức $BC = 2AB$. Chu vi $= 2(AB + 2AB) = 6AB = ' + P + '$ cm, nên $AB = ' + ab + '$ cm.',
          hoiAB ? '$AB = ' + P + ' : 6 = ' + ab + '$' : '$BC = 2 \\cdot ' + ab + ' = ' + kq + '$'],
        loiThuongGap: boTrung(kq, [{ gt: P / 4, giaiThich: 'Em coi $ABCD$ là hình vuông. Ở đây $BC = 2AB$, chu vi $= 6AB$.' }, { gt: hoiAB ? 2 * ab : ab, giaiThich: 'Em nhầm hai cạnh: $BC$ dài gấp đôi $AB$.' }]),
        hinh: hinhTG({ diem: { A: [0, 1], B: [0, 0], C: [2, 0], D: [2, 1], M: [1, 0] }, vong: ['A', 'B', 'C', 'D'],
          canh: [['M', 'A', { mau: TIM, day: 3 }], ['M', 'D', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
          goc: [['A', 'M', 'D', VUONG]], lechTen: { M: [0, -18] }, ghiChu: 'Chu vi ' + P + ' cm' })
      };
    } }
  ], { deCo: [
    { id: '13.L1', muc: 1, de: 'Khẳng định "Hình chữ nhật cũng là một hình bình hành" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hình chữ nhật có bốn góc vuông. Các góc đối của nó thế nào?', 'Tứ giác có các góc đối bằng nhau là hình gì?'],
      loiGiai: ['Hình chữ nhật có $\\widehat{A} = \\widehat{C} = 90^\\circ$, $\\widehat{B} = \\widehat{D} = 90^\\circ$: các góc đối bằng nhau.', 'Nên hình chữ nhật là hình bình hành. Khẳng định **đúng**.'] },
    { id: '13.L2', muc: 1, de: 'Tứ giác $ABCD$ có $\\widehat{A} = \\widehat{B} = \\widehat{C} = 90^\\circ$. Tính $\\widehat{D}$ (độ).',
      dapAn: { kieu: 'so', gt: 90 },
      goiY: ['Tổng bốn góc của tứ giác bằng $360^\\circ$.', '$\\widehat{D} = 360^\\circ - 3 \\cdot 90^\\circ$.'],
      loiGiai: ['$\\widehat{D} = 360^\\circ - (90^\\circ + 90^\\circ + 90^\\circ) = 360^\\circ - 270^\\circ$', 'Tứ giác có ba góc vuông thì là hình chữ nhật: $\\widehat{D} = 90^\\circ$'] },
    { id: '13.L3', muc: 1, de: 'Trong hình chữ nhật, hai đường chéo có tính chất nào?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Vuông góc với nhau', 'Bằng nhau và cắt nhau tại trung điểm của mỗi đường', 'Là đường phân giác của các góc', 'Bằng cạnh dài của hình chữ nhật'] },
      goiY: ['Nhớ lại Định lí 1 của bài.', 'Hình chữ nhật là hình bình hành và là hình thang cân: nó có cả tính chất đường chéo của hai hình đó.'],
      loiGiai: ['Như hình bình hành: hai đường chéo cắt nhau tại trung điểm mỗi đường. Như hình thang cân: hai đường chéo bằng nhau.', 'Vuông góc, là phân giác: đó là tính chất của hình thoi, hình chữ nhật nói chung **không** có.'] },
    { id: '13.L4', muc: 1, de: 'Tứ giác nào dưới đây **chắc chắn** là hình chữ nhật?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Tứ giác có hai góc vuông', 'Tứ giác có hai đường chéo bằng nhau', 'Tứ giác có ba góc vuông', 'Hình thang có một góc vuông'] },
      goiY: ['Thử nghĩ tới hình thang vuông: nó có hai góc vuông.', 'Ba góc vuông thì góc còn lại bằng bao nhiêu?'],
      loiGiai: ['Tứ giác có ba góc vuông thì góc thứ tư bằng $360^\\circ - 270^\\circ = 90^\\circ$: là hình chữ nhật.', 'Hình thang vuông có hai góc vuông nhưng không phải hình chữ nhật; hình thang cân có hai đường chéo bằng nhau cũng vậy.'] },
    { id: '13.L5', muc: 2, de: 'Hình bình hành $ABCD$ trong hình có hai đường chéo $AC = BD = 7$ cm. Khẳng định "$ABCD$ là hình chữ nhật" đúng hay sai?', hinh: hHBH,
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Nhớ lại dấu hiệu nhận biết hình chữ nhật từ hình bình hành.', 'Hình bình hành có hai đường chéo bằng nhau là hình gì?'],
      loiGiai: ['$ABCD$ là hình bình hành và có hai đường chéo bằng nhau.', 'Theo dấu hiệu nhận biết (Định lí 2b), $ABCD$ là hình chữ nhật. Khẳng định **đúng**.'] },
    { id: '13.L6', muc: 2, de: 'Khẳng định "Hình thang có một góc vuông là hình chữ nhật" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Hình thang $ABCD$ ($AB \\parallel CD$) có $\\widehat{D} = 90^\\circ$ thì $\\widehat{A}$ bằng bao nhiêu? Còn $\\widehat{B}$, $\\widehat{C}$?', 'Nghĩ tới hình thang vuông.'],
      loiGiai: ['Hình thang có một góc vuông thì có thêm một góc vuông nữa (kề cùng cạnh bên), nhưng hai góc còn lại có thể là $60^\\circ$ và $120^\\circ$.', 'Đó là **hình thang vuông**, chưa chắc là hình chữ nhật. Khẳng định **sai**.'] },
    { id: '13.L7', muc: 2, de: 'Hình thang cân có một góc vuông là hình gì?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hình chữ nhật', 'Hình thang vuông nhưng không phải hình chữ nhật', 'Hình bình hành nhưng không phải hình chữ nhật', 'Không có hình như vậy'] },
      goiY: ['Hình thang cân $ABCD$ ($AB \\parallel CD$) có $\\widehat{D} = 90^\\circ$. Góc $C$ bằng bao nhiêu?', 'Rồi tính các góc $A$, $B$ (kề cạnh bên với $D$, $C$).'],
      loiGiai: ['$\\widehat{C} = \\widehat{D} = 90^\\circ$ (hình thang cân); $\\widehat{A} = 180^\\circ - \\widehat{D} = 90^\\circ$, $\\widehat{B} = 90^\\circ$.', 'Bốn góc vuông: đó là **hình chữ nhật**.'] },
    { id: '13.L8', muc: 2, de: 'Tam giác $ABC$ trong hình có $M$ là trung điểm $BC$, $BC = 10$ cm và $AM = 5$ cm. Tính góc $BAC$ (độ).', hinh: hTT,
      dapAn: { kieu: 'so', gt: 90 },
      goiY: ['So sánh $AM$ với nửa cạnh $BC$.', 'Tam giác có một trung tuyến bằng nửa cạnh tương ứng thì vuông.'],
      loiGiai: ['$\\frac{BC}{2} = 5 = AM$: trung tuyến $AM$ bằng nửa cạnh $BC$.', 'Vậy tam giác $ABC$ vuông tại $A$: $\\widehat{BAC} = 90^\\circ$'] },
    { id: '13.L9', muc: 2, de: 'Một tam giác vuông có đường trung tuyến ứng với cạnh huyền dài $6{,}5$ cm. Tính cạnh huyền (cm).',
      dapAn: { kieu: 'so', gt: 13 },
      goiY: ['Trung tuyến ứng với cạnh huyền bằng một nửa cạnh huyền.', 'Cạnh huyền $= 2 \\cdot$ trung tuyến.'],
      loiGiai: ['Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.', 'Cạnh huyền $= 2 \\cdot 6{,}5 = 13$'],
      loiThuongGap: [{ gt: 3.25, giaiThich: 'Trung tuyến là **nửa** cạnh huyền, nên cạnh huyền gấp đôi trung tuyến (nhân 2).' }] },
    { id: '13.L10', muc: 2, de: 'Khẳng định "Tứ giác có hai đường chéo bằng nhau và cắt nhau tại trung điểm của mỗi đường là hình chữ nhật" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hai đường chéo cắt nhau tại trung điểm mỗi đường: tứ giác là hình gì?', 'Hình bình hành có thêm hai đường chéo bằng nhau thì sao?'],
      loiGiai: ['Hai đường chéo cắt nhau tại trung điểm mỗi đường nên tứ giác là hình bình hành.', 'Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật. Khẳng định **đúng**.'] },
    { id: '13.L11', muc: 3, de: 'Khẳng định "Hình bình hành có hai góc kề một cạnh bằng nhau là hình chữ nhật" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Trong hình bình hành, hai góc kề một cạnh có tổng bằng bao nhiêu?', 'Hai góc bằng nhau mà tổng là $180^\\circ$ thì mỗi góc bằng bao nhiêu?'],
      loiGiai: ['Hai góc kề một cạnh của hình bình hành bù nhau; nếu chúng bằng nhau thì mỗi góc bằng $90^\\circ$.', 'Hình bình hành có một góc vuông là hình chữ nhật. Khẳng định **đúng**.'] },
    { id: '13.L12', muc: 3, de: 'Hình chữ nhật $ABCD$ có hai đường chéo cắt nhau tại $O$ và $\\widehat{AOB} = 60^\\circ$, $AC = 12$ cm. Tính $AB$ (cm).',
      dapAn: { kieu: 'so', gt: 6 },
      goiY: ['$OA = OB$ bằng nửa đường chéo. Tam giác $OAB$ cân có một góc $60^\\circ$ là tam giác gì?', 'Tam giác đều $OAB$: $AB = OA$.'],
      loiGiai: ['$OA = OB = 12 : 2 = 6$ cm; tam giác $OAB$ cân tại $O$ có $\\widehat{AOB} = 60^\\circ$ nên là tam giác đều.', '$AB = OA = 6$'],
      loiThuongGap: [{ gt: 12, giaiThich: '$AB$ bằng $OA$ (tam giác đều), mà $OA$ chỉ là nửa đường chéo.' }] }
  ] });
})();
