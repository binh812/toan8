// Luyện thêm – Bài 14: Hình thoi và hình vuông
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5', LA = '#2f9e44', VUONG = { mau: '#868e96' };
  var TEN = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']];

  // ---------- Hình tĩnh (toạ độ dựng từ chính số liệu trong đề) ----------
  function rad(d) { return d * Math.PI / 180; }
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
  // Hình thoi t (t[0] trái, t[1] trên, t[2] phải, t[3] dưới), tâm O ở gốc, nửa hai đường chéo a (ngang), b (dọc).
  function thoi(t, a, b) { var o = { O: [0, 0] }; o[t[0]] = [-a, 0]; o[t[1]] = [0, b]; o[t[2]] = [a, 0]; o[t[3]] = [0, -b]; return o; }
  // Hình thoi cạnh s, góc tại t[0] bằng g.
  function thoiGoc(t, s, g) { return thoi(t, s * Math.cos(rad(g / 2)), s * Math.sin(rad(g / 2))); }
  function vach4(t) { var o = {}; t.forEach(function (a, i) { o[a + t[(i + 1) % 4]] = 1; }); return o; }
  function cheo(t, net) { return [[t[0], t[2], { mau: TIM, day: 2, net: net || 0 }], [t[1], t[3], { mau: TIM, day: 2, net: net || 0 }]]; }
  // Hình vuông t (t[0] trên trái, đi ngược chiều kim đồng hồ), cạnh s, tâm O.
  function vuong(t, s) { var o = { O: [s / 2, s / 2] }; o[t[0]] = [0, s]; o[t[1]] = [0, 0]; o[t[2]] = [s, 0]; o[t[3]] = [s, s]; return o; }
  function vuong4(t) { return [0, 1, 2, 3].map(function (i) { return [t[(i + 3) % 4], t[i], t[(i + 1) % 4], VUONG]; }); }
  function d(x) { return x + '^\\circ'; }
  function ds(x) { return String(x).replace('.', ','); }
  function boTrung(gt, ds) {
    var da = [gt];
    return ds.filter(function (l) {
      if (da.some(function (v) { return Math.abs(l.gt - v) < 1e-9; })) return false;
      da.push(l.gt); return true;
    });
  }

  var hVuong = hinhTG({ diem: vuong(['A', 'B', 'C', 'D'], 6), vong: ['A', 'B', 'C', 'D'], vach: vach4(['A', 'B', 'C', 'D']), canh: cheo(['A', 'B', 'C', 'D']),
    goc: vuong4(['A', 'B', 'C', 'D']).concat([['O', 'A', 'B', { mau: XANH }]]), soGoc: [['O', 'A', 'B', '?', 1.1, XANH]], lechTen: { O: [16, 0] } });

  TOAN8.luyen(14, [
    { ten: 'Chu vi hình thoi, hình vuông', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), laThoi = r.dau() > 0, s = r.so(3, 15), P = 4 * s, xuoi = r.dau() > 0, kq = xuoi ? P : s, ten = laThoi ? 'hình thoi' : 'hình vuông';
      var D = laThoi ? thoiGoc(t, 5, r.chon([60, 70, 80, 100, 110])) : vuong(t, 5);
      delete D.O;
      return {
        de: xuoi ? 'Một ' + ten + ' $' + t.join('') + '$ có cạnh dài $' + s + '$ cm (hình). Tính chu vi của nó (cm).'
          : 'Một ' + ten + ' $' + t.join('') + '$ có chu vi $' + P + '$ cm (hình). Tính độ dài mỗi cạnh (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hình thoi và hình vuông đều có **bốn cạnh bằng nhau**.', xuoi ? 'Chu vi $= 4 \\cdot$ cạnh.' : 'Cạnh $=$ chu vi $: 4$.'],
        loiGiai: ['Bốn cạnh của ' + ten + ' bằng nhau.', xuoi ? 'Chu vi $= 4 \\cdot ' + s + ' = ' + P + '$ (cm)' : 'Cạnh $= ' + P + ' : 4 = ' + s + '$ (cm)'],
        loiThuongGap: boTrung(kq, xuoi ? [{ gt: 2 * s, giaiThich: 'Chu vi là tổng **bốn** cạnh: $4 \\cdot ' + s + '$.' }, { gt: s * s, giaiThich: 'Em tính $' + s + ' \\cdot ' + s + '$ (giống diện tích hình vuông). Chu vi là $4 \\cdot ' + s + '$.' }]
          : [{ gt: P / 2, giaiThich: 'Em chia cho $2$. ' + (laThoi ? 'Hình thoi' : 'Hình vuông') + ' có **bốn** cạnh bằng nhau: chia cho $4$.' }]),
        hinh: hinhTG({ diem: D, vong: t, vach: vach4(t), goc: laThoi ? null : vuong4(t),
          nhan: [[t[0], t[1], xuoi ? s + ' cm' : '?', false, 1, xuoi ? '#212529' : XANH]] })
      };
    } },
    { ten: 'Đường chéo là phân giác', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), a = r.so(20, 40), xuoi = r.dau() > 0, kq = xuoi ? 2 * a : a;
      var goc0 = t[1] + t[0] + t[3], nua = t[1] + t[0] + t[2];
      return {
        de: xuoi ? 'Hình thoi $' + t.join('') + '$ trong hình có $\\widehat{' + nua + '} = ' + d(a) + '$. Tính góc $' + goc0 + '$ (độ).'
          : 'Hình thoi $' + t.join('') + '$ trong hình có $\\widehat{' + goc0 + '} = ' + d(2 * a) + '$. Tính góc $' + nua + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trong hình thoi, hai đường chéo là các **đường phân giác** của các góc.', 'Đường chéo $' + t[0] + t[2] + '$ chia góc $' + t[0] + '$ thành hai góc bằng nhau.'],
        loiGiai: ['$' + t[0] + t[2] + '$ là phân giác của góc $' + goc0 + '$ nên $\\widehat{' + nua + '} = \\frac{1}{2}\\widehat{' + goc0 + '}$.',
          xuoi ? '$\\widehat{' + goc0 + '} = 2 \\cdot ' + d(a) + ' = ' + d(kq) + '$' : '$\\widehat{' + nua + '} = ' + d(2 * a) + ' : 2 = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, xuoi ? [{ gt: a, giaiThich: '$' + d(a) + '$ chỉ là **một nửa** góc $' + goc0 + '$ (đường chéo là phân giác).' }, { gt: 180 - 2 * a, giaiThich: 'Đó là góc kề với góc $' + t[0] + '$, không phải góc $' + goc0 + '$.' }]
          : [{ gt: 2 * a, giaiThich: 'Đó là cả góc $' + goc0 + '$. Đường chéo chia đôi nó.' }, { gt: 90 - a, giaiThich: 'Đó là góc $' + t[0] + t[1] + t[3] + '$ trong tam giác vuông $O' + t[0] + t[1] + '$.' }]),
        hinh: hinhTG({ diem: thoiGoc(t, 5, 2 * a), vong: t, vach: vach4(t), canh: cheo(t),
          goc: xuoi ? [[t[1], t[0], t[2]], [t[1], t[0], t[3], { mau: XANH, r: 0.9 }]] : [[t[1], t[0], t[3]], [t[1], t[0], t[2], { mau: XANH, r: 1.1 }]],
          soGoc: xuoi ? [[t[1], t[0], t[2], a + '°', 1.9], [t[3], t[0], t[2], '?', 1.6, XANH]] : [[t[1], t[0], t[3], 2 * a + '°', 1.4], [t[1], t[0], t[2], '?', 2.2, XANH]],
          lechTen: { O: [10, -16] } })
      };
    } },
    { ten: 'Góc hình thoi qua đường chéo', muc: 2, sinh: function (r) {
      // góc tại t[1] bằng b, góc tại t[0] bằng 180 − b; hỏi góc t[1] t[0] t[2] = (180 − b)/2
      var t = r.chon(TEN), b = r.so(35, 75) * 2;
      if (b === 90) b = 100;
      var kq = (180 - b) / 2;
      return {
        de: 'Hình thoi $' + t.join('') + '$ trong hình có $\\widehat{' + t[0] + t[1] + t[2] + '} = ' + d(b) + '$. Tính góc $' + t[1] + t[0] + t[2] + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hai góc kề một cạnh của hình thoi (cũng là hình bình hành) bù nhau: tính góc $' + t[0] + '$.', 'Đường chéo $' + t[0] + t[2] + '$ là phân giác của góc $' + t[0] + '$.'],
        loiGiai: ['$\\widehat{' + t[1] + t[0] + t[3] + '} = 180^\\circ - ' + d(b) + ' = ' + d(180 - b) + '$ (hai góc kề cạnh $' + t[0] + t[1] + '$ bù nhau).',
          '$' + t[0] + t[2] + '$ là phân giác góc $' + t[0] + '$: $\\widehat{' + t[1] + t[0] + t[2] + '} = ' + d(180 - b) + ' : 2 = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [{ gt: 180 - b, giaiThich: '$' + d(180 - b) + '$ là cả góc $' + t[0] + '$. Đường chéo $' + t[0] + t[2] + '$ chia đôi góc đó.' }, { gt: b / 2, giaiThich: '$' + d(b / 2) + '$ là một nửa góc $' + t[1] + '$, không phải nửa góc $' + t[0] + '$.' }]),
        hinh: hinhTG({ diem: thoiGoc(t, 5, 180 - b), vong: t, vach: vach4(t), canh: cheo(t),
          goc: [[t[0], t[1], t[2]], [t[1], t[0], t[2], { mau: XANH }]], soGoc: [[t[0], t[1], t[2], b + '°', b < 90 ? 1.6 : 1], [t[1], t[0], t[2], '?', 2, XANH]], lechTen: { O: [10, -16] } })
      };
    } },
    { ten: 'Diện tích hình thoi', muc: 2, sinh: function (r, cc) {
      var t = r.chon(TEN), d1 = r.so(4, 20), d2 = r.so(Math.max(3, Math.ceil(d1 / 2.5)), Math.min(16, Math.floor(d1 * 2.5))), S = d1 * d2 / 2, f = 5 / Math.max(d1, d2);
      return {
        de: 'Hình thoi $' + t.join('') + '$ trong hình có hai đường chéo $' + t[0] + t[2] + ' = ' + d1 + '$ cm và $' + t[1] + t[3] + ' = ' + d2 + '$ cm. Tính diện tích hình thoi (cm²).',
        dapAn: { kieu: 'so', gt: S },
        goiY: ['Diện tích hình thoi bằng **nửa** tích hai đường chéo.', '$S = \\frac{1}{2} \\cdot d_1 \\cdot d_2$.'],
        loiGiai: ['Hai đường chéo của hình thoi vuông góc với nhau, nên $S = \\frac{1}{2} \\cdot ' + t[0] + t[2] + ' \\cdot ' + t[1] + t[3] + '$.',
          '$S = \\frac{1}{2} \\cdot ' + d1 + ' \\cdot ' + d2 + ' = ' + cc.so(S) + '$ (cm²)'],
        loiThuongGap: boTrung(S, [{ gt: d1 * d2, giaiThich: 'Em quên nhân $\\frac{1}{2}$. Diện tích hình thoi bằng **nửa** tích hai đường chéo.' }, { gt: d1 * d2 / 4, giaiThich: 'Em nhân hai **nửa** đường chéo với nhau ($' + cc.so(d1 / 2) + ' \\cdot ' + cc.so(d2 / 2) + '$). Công thức dùng cả hai đường chéo: $\\frac{1}{2} \\cdot ' + d1 + ' \\cdot ' + d2 + '$.' }]),
        hinh: hinhTG({ diem: thoi(t, d1 * f / 2, d2 * f / 2), vong: t, vach: vach4(t), canh: cheo(t, 2), goc: [[t[1], 'O', t[2], VUONG]],
          nhan: [['O', t[2], d1 + ' cm', false, 1.2, TIM], ['O', t[1], d2 + ' cm', false, 1.6, TIM]], lechTen: { O: [12, -14] } })
      };
    } },
    { ten: 'Hình thoi có một góc 60°', muc: 2, sinh: function (r, cc) {
      var t = r.chon(TEN), s = r.so(3, 16), gocB = r.dau() > 0, hoiNua = r.dau() > 0, kq = hoiNua ? s / 2 : s;
      var tgDeu = t[1] + t[0] + t[3];
      return {
        de: 'Hình thoi $' + t.join('') + '$ trong hình có cạnh $' + s + '$ cm và ' + (gocB ? '$\\widehat{' + t[2] + t[3] + t[0] + '} = 120^\\circ$' : '$\\widehat{' + t[1] + t[0] + t[3] + '} = 60^\\circ$') + '. Hai đường chéo cắt nhau tại $O$. Tính ' + (hoiNua ? '$O' + t[1] + '$' : 'đường chéo $' + t[1] + t[3] + '$') + ' (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: [(gocB ? 'Tính góc $' + t[0] + '$ trước: hai góc kề một cạnh bù nhau. ' : '') + 'Tam giác $' + tgDeu + '$ có $' + t[0] + t[1] + ' = ' + t[0] + t[3] + '$ và góc ở đỉnh $60^\\circ$: là tam giác gì?',
          'Tam giác đều có ba cạnh bằng nhau' + (hoiNua ? '; $O$ là trung điểm của $' + t[1] + t[3] + '$.' : '.')],
        loiGiai: (gocB ? ['$\\widehat{' + t[1] + t[0] + t[3] + '} = 180^\\circ - 120^\\circ = 60^\\circ$.'] : []).concat([
          '$' + t[0] + t[1] + ' = ' + t[0] + t[3] + '$ (cạnh hình thoi) và $\\widehat{' + t[1] + t[0] + t[3] + '} = 60^\\circ$ nên tam giác $' + tgDeu + '$ đều: $' + t[1] + t[3] + ' = ' + s + '$ cm.',
          hoiNua ? '$O' + t[1] + ' = ' + s + ' : 2 = ' + cc.so(kq) + '$' : '$' + t[1] + t[3] + ' = ' + t[0] + t[1] + ' = ' + s + '$']),
        loiThuongGap: boTrung(kq, hoiNua ? [{ gt: s, giaiThich: '$' + s + '$ cm là cả đường chéo $' + t[1] + t[3] + '$. $O$ là trung điểm nên $O' + t[1] + '$ bằng một nửa.' }]
          : [{ gt: s / 2, giaiThich: '$' + cc.so(s / 2) + '$ cm là $O' + t[1] + '$ (nửa đường chéo). Cả đường chéo $' + t[1] + t[3] + '$ bằng cạnh tam giác đều.' }]),
        hinh: hinhTG({ diem: thoiGoc(t, 5, 60), vong: t, vach: vach4(t), canh: [[t[1], t[3], { mau: TIM, day: 3, net: 2 }]],
          goc: gocB ? [[t[2], t[3], t[0]]] : [[t[1], t[0], t[3]]], soGoc: gocB ? [[t[2], t[3], t[0], '120°', 0.8]] : [[t[1], t[0], t[3], '60°', 1.4]],
          nhan: [[t[0], t[1], s + ' cm'], hoiNua ? ['O', t[1], '?', false, 1.2, XANH] : [t[1], t[3], '?', false, 1.2, XANH]], lechTen: { O: [12, -14] } })
      };
    } },
    { ten: 'Đường chéo hình vuông', muc: 1, sinh: function (r, cc) {
      var t = r.chon(TEN), x = r.so(4, 30), hoiGoc = r.chon([0, 1, 2]);
      if (hoiGoc === 0) {
        return {
          de: 'Hình vuông $' + t.join('') + '$ trong hình có đường chéo $' + t[0] + t[2] + ' = ' + x + '$ cm, $O$ là giao điểm hai đường chéo. Tính $O' + t[3] + '$ (cm).',
          dapAn: { kieu: 'so', gt: x / 2 },
          goiY: ['Hình vuông là hình chữ nhật: hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường.', '$O' + t[3] + ' = ' + t[1] + t[3] + ' : 2$, mà $' + t[1] + t[3] + ' = ' + t[0] + t[2] + '$.'],
          loiGiai: ['$' + t[1] + t[3] + ' = ' + t[0] + t[2] + ' = ' + x + '$ cm (hai đường chéo bằng nhau), $O$ là trung điểm của $' + t[1] + t[3] + '$.', '$O' + t[3] + ' = ' + x + ' : 2 = ' + cc.so(x / 2) + '$'],
          loiThuongGap: boTrung(x / 2, [{ gt: x, giaiThich: '$O' + t[3] + '$ chỉ là **nửa** đường chéo.' }]),
          hinh: hinhTG({ diem: vuong(t, 6), vong: t, vach: vach4(t), canh: cheo(t), goc: vuong4(t), nhan: [[t[0], 'O', x + ' cm', false, 1.2, TIM], ['O', t[3], '?', false, 1, XANH]], lechTen: { O: [16, 0] } })
        };
      }
      var kq = hoiGoc === 1 ? 90 : 45, hoi = hoiGoc === 1 ? t[0] + 'O' + t[1] : 'O' + t[0] + t[1];
      return {
        de: 'Hình vuông $' + t.join('') + '$ trong hình có hai đường chéo cắt nhau tại $O$. Tính góc $' + hoi + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: hoiGoc === 1 ? ['Hình vuông là hình thoi: hai đường chéo có quan hệ gì?', 'Hai đường chéo của hình thoi vuông góc với nhau.']
          : ['Đường chéo $' + t[0] + t[2] + '$ là phân giác của góc $' + t[0] + '$ (hình vuông là hình thoi).', 'Góc $' + t[0] + '$ bằng $90^\\circ$.'],
        loiGiai: hoiGoc === 1 ? ['Hình vuông là hình thoi nên hai đường chéo vuông góc.', '$\\widehat{' + hoi + '} = 90^\\circ$']
          : ['$' + t[0] + t[2] + '$ là phân giác của góc vuông $' + t[0] + '$.', '$\\widehat{' + hoi + '} = 90^\\circ : 2 = 45^\\circ$'],
        loiThuongGap: hoiGoc === 1 ? [{ gt: 45, giaiThich: 'Hai đường chéo của hình vuông **vuông góc** với nhau.' }] : [{ gt: 90, giaiThich: '$90^\\circ$ là cả góc $' + t[0] + '$; đường chéo chia đôi nó.' }],
        hinh: hinhTG({ diem: vuong(t, 6), vong: t, vach: vach4(t), canh: cheo(t), goc: vuong4(t).concat([hoiGoc === 1 ? [t[0], 'O', t[1], { mau: XANH }] : ['O', t[0], t[1], { mau: XANH }]]),
          soGoc: [hoiGoc === 1 ? [t[0], 'O', t[1], '?', 0.6, XANH] : ['O', t[0], t[1], '?', 1.1, XANH]], lechTen: { O: [16, 0] } })
      };
    } },
    { ten: 'Luống hoa hình thoi', muc: 3, sinh: function (r) {
      var dai = r.so(5, 20) * 2, rong = r.so(Math.max(2, Math.ceil(dai / 6)), dai / 2 - 1) * 2, gia = r.chon([20, 25, 30, 40, 50]), S = dai * rong / 2, kq = S * gia;
      var vat = r.chon([['mảnh vườn', 'luống hoa', 'trồng hoa'], ['sân', 'thảm cỏ', 'trồng cỏ'], ['tấm vải', 'miếng thêu', 'thêu']]);
      var f = 6 / dai, R = { A: [0, rong * f], B: [dai * f, rong * f], C: [dai * f, 0], D: [0, 0] };
      R.E = [dai * f / 2, rong * f]; R.F = [dai * f, rong * f / 2]; R.G = [dai * f / 2, 0]; R.H = [0, rong * f / 2];
      var dv = vat[0] === 'tấm vải' ? 'dm' : 'm';
      return {
        de: 'Một ' + vat[0] + ' hình chữ nhật dài $' + dai + '$ ' + dv + ', rộng $' + rong + '$ ' + dv + '. Nối trung điểm bốn cạnh ta được ' + vat[1] + ' $EFGH$ hình thoi (màu xanh). Chi phí ' + vat[2] + ' là $' + gia + '$ nghìn đồng mỗi ' + dv + '². Tính tổng chi phí ' + vat[2] + ' trên ' + vat[1] + ' (nghìn đồng).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hai đường chéo của hình thoi $EFGH$ dài bằng chiều dài và chiều rộng của hình chữ nhật.', 'Diện tích hình thoi $= \\frac{1}{2} d_1 d_2$; rồi nhân với chi phí mỗi ' + dv + '².'],
        loiGiai: ['Hai đường chéo: $FH = ' + dai + '$ ' + dv + ', $EG = ' + rong + '$ ' + dv + '.',
          'Diện tích ' + vat[1] + ': $S = \\frac{1}{2} \\cdot ' + dai + ' \\cdot ' + rong + ' = ' + S + '$ (' + dv + '²).',
          'Chi phí: $' + S + ' \\cdot ' + gia + ' = ' + kq + '$ (nghìn đồng)'],
        loiThuongGap: boTrung(kq, [{ gt: dai * rong * gia, giaiThich: '$' + dai * rong + '$ ' + dv + '² là diện tích **cả** hình chữ nhật. Hình thoi chỉ bằng một nửa.' }, { gt: S, giaiThich: 'Đó mới là diện tích. Còn phải nhân với $' + gia + '$ nghìn đồng mỗi ' + dv + '².' }]),
        hinh: hinhTG({ diem: R, vong: ['A', 'B', 'C', 'D'],
          canh: [['E', 'F', { mau: LA, day: 4 }], ['F', 'G', { mau: LA, day: 4 }], ['G', 'H', { mau: LA, day: 4 }], ['H', 'E', { mau: LA, day: 4 }]],
          nhan: [['D', 'C', 'dài ' + dai + ' ' + dv, false, 1.3]], ghiChu: 'Chiều rộng ' + rong + ' ' + dv, lechTen: { E: [0, -16], G: [0, 16] } })
      };
    } },
    { ten: 'Tìm đường chéo từ diện tích', muc: 3, sinh: function (r, cc) {
      var t = r.chon(TEN), d1 = r.so(4, 20), d2 = r.so(Math.max(3, Math.ceil(d1 / 2.5)), Math.min(16, Math.floor(d1 * 2.5))), S = d1 * d2 / 2, f = 5 / Math.max(d1, d2);
      return {
        de: 'Một hình thoi $' + t.join('') + '$ có diện tích $' + cc.so(S) + '$ cm² và đường chéo $' + t[0] + t[2] + ' = ' + d1 + '$ cm (hình). Tính đường chéo $' + t[1] + t[3] + '$ (cm).',
        dapAn: { kieu: 'so', gt: d2 },
        goiY: ['$S = \\frac{1}{2} \\cdot ' + t[0] + t[2] + ' \\cdot ' + t[1] + t[3] + '$, nên $' + t[1] + t[3] + ' = 2S : ' + t[0] + t[2] + '$.', 'Nhân đôi diện tích trước rồi mới chia.'],
        loiGiai: ['$\\frac{1}{2} \\cdot ' + d1 + ' \\cdot ' + t[1] + t[3] + ' = ' + cc.so(S) + '$, nên $' + d1 + ' \\cdot ' + t[1] + t[3] + ' = ' + 2 * S + '$.',
          '$' + t[1] + t[3] + ' = ' + 2 * S + ' : ' + d1 + ' = ' + d2 + '$'],
        loiThuongGap: boTrung(d2, [{ gt: S / d1, giaiThich: 'Em quên $\\frac{1}{2}$: $' + t[1] + t[3] + ' = 2S : ' + t[0] + t[2] + '$, phải nhân đôi diện tích trước.' }]),
        hinh: hinhTG({ diem: thoi(t, d1 * f / 2, d2 * f / 2), vong: t, vach: vach4(t), canh: cheo(t, 2), goc: [[t[1], 'O', t[2], VUONG]],
          nhan: [['O', t[2], d1 + ' cm', false, 1.2, TIM], ['O', t[1], '?', false, 1.2, XANH]], lechTen: { O: [12, -14] } })
      };
    } }
  ], { deCo: [
    { id: '14.L1', muc: 1, de: 'Khẳng định "Hình thoi cũng là một hình bình hành" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hình thoi có bốn cạnh bằng nhau. Các cạnh đối của nó thế nào?', 'Tứ giác có các cạnh đối bằng nhau là hình gì?'],
      loiGiai: ['Hình thoi có bốn cạnh bằng nhau nên các cạnh đối bằng nhau.', 'Tứ giác có các cạnh đối bằng nhau là hình bình hành. Khẳng định **đúng**.'] },
    { id: '14.L2', muc: 1, de: 'Khẳng định "Hình vuông vừa là hình chữ nhật, vừa là hình thoi" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hình vuông có bốn góc vuông và bốn cạnh bằng nhau.', 'Bốn góc vuông: hình gì? Bốn cạnh bằng nhau: hình gì?'],
      loiGiai: ['Bốn góc vuông nên hình vuông là hình chữ nhật; bốn cạnh bằng nhau nên hình vuông là hình thoi.', 'Khẳng định **đúng**: hình vuông có mọi tính chất của hình chữ nhật và hình thoi.'] },
    { id: '14.L3', muc: 1, de: 'Khẳng định "Mọi hình thoi đều có hai đường chéo bằng nhau" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Vẽ một hình thoi "dẹt": hai đường chéo dài bằng nhau không?', 'Hai đường chéo của hình thoi có tính chất gì (theo Định lí 1)?'],
      loiGiai: ['Hai đường chéo của hình thoi **vuông góc** với nhau và là phân giác các góc, nhưng nói chung **không** bằng nhau (hình thoi dẹt có một đường chéo dài, một đường chéo ngắn).', 'Chỉ hình thoi là hình vuông mới có hai đường chéo bằng nhau. Khẳng định **sai**.'] },
    { id: '14.L4', muc: 1, de: 'Hình chữ nhật có hai cạnh kề bằng nhau là hình gì?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Hình thoi nhưng không phải hình vuông', 'Hình bình hành nhưng không phải hình thoi', 'Hình vuông', 'Hình thang cân nhưng không phải hình chữ nhật'] },
      goiY: ['Hình chữ nhật có các cạnh đối bằng nhau. Nếu thêm hai cạnh kề bằng nhau thì bốn cạnh thế nào?', 'Bốn góc vuông và bốn cạnh bằng nhau là hình gì?'],
      loiGiai: ['Hai cạnh kề bằng nhau, lại có các cạnh đối bằng nhau, nên bốn cạnh bằng nhau.', 'Bốn góc vuông, bốn cạnh bằng nhau: đó là **hình vuông**.'] },
    { id: '14.L5', muc: 1, de: 'Trong hình thoi, hai đường chéo có tính chất nào?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['Vuông góc với nhau và là các đường phân giác của các góc', 'Bằng nhau', 'Bằng nhau và vuông góc với nhau', 'Không cắt nhau tại trung điểm mỗi đường'] },
      goiY: ['Nhớ lại Định lí 1 của bài.', 'Hình thoi là hình bình hành nên hai đường chéo vẫn cắt nhau tại trung điểm mỗi đường.'],
      loiGiai: ['Hai đường chéo của hình thoi vuông góc với nhau và là các đường phân giác của các góc.', '"Bằng nhau" chỉ đúng khi hình thoi là hình vuông.'] },
    { id: '14.L6', muc: 1, de: 'Hình vuông $ABCD$ trong hình có hai đường chéo cắt nhau tại $O$. Tính góc $OAB$ (độ).', hinh: hVuong,
      dapAn: { kieu: 'so', gt: 45 },
      goiY: ['Hình vuông là hình thoi: đường chéo $AC$ là phân giác của góc $A$.', 'Góc $A$ của hình vuông bằng $90^\\circ$.'],
      loiGiai: ['$AC$ là phân giác của góc vuông $BAD$.', '$\\widehat{OAB} = 90^\\circ : 2 = 45^\\circ$'],
      loiThuongGap: [{ gt: 90, giaiThich: '$90^\\circ$ là cả góc $A$. Đường chéo $AC$ chia đôi góc đó.' }] },
    { id: '14.L7', muc: 2, de: 'Hình bình hành có một đường chéo là đường phân giác của một góc là hình gì?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Hình chữ nhật', 'Hình thoi', 'Hình thang cân', 'Chưa đủ để kết luận gì thêm'] },
      goiY: ['Nhớ lại Định lí 2 (dấu hiệu nhận biết hình thoi).', 'Đường chéo là phân giác: tính chất của hình nào?'],
      loiGiai: ['Theo dấu hiệu nhận biết: hình bình hành có một đường chéo là đường phân giác của một góc là **hình thoi**.'] },
    { id: '14.L8', muc: 2, de: 'Khẳng định "Tứ giác có hai đường chéo vuông góc với nhau là hình thoi" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Dấu hiệu nhận biết hình thoi theo đường chéo áp dụng cho hình nào?', 'Nghĩ tới hình "cái diều" ở Bài 10: hai đường chéo vuông góc nhưng bốn cạnh có bằng nhau không?'],
      loiGiai: ['Hình "cái diều" có hai đường chéo vuông góc nhưng các cạnh không bằng nhau, nên không phải hình thoi.', 'Phải là **hình bình hành** có hai đường chéo vuông góc mới là hình thoi. Khẳng định **sai**.'] },
    { id: '14.L9', muc: 2, de: 'Khẳng định "Hình chữ nhật có hai đường chéo vuông góc với nhau là hình vuông" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hình chữ nhật là hình bình hành. Hình bình hành có hai đường chéo vuông góc là hình gì?', 'Vừa là hình chữ nhật vừa là hình thoi thì là hình gì?'],
      loiGiai: ['Hình chữ nhật là hình bình hành; có hai đường chéo vuông góc nên là hình thoi.', 'Vừa là hình chữ nhật vừa là hình thoi nên là hình vuông. Khẳng định **đúng**.'] },
    { id: '14.L10', muc: 2, de: 'Một hình thoi có một góc bằng $70^\\circ$. Tính góc tù của hình thoi đó (độ).',
      dapAn: { kieu: 'so', gt: 110 },
      goiY: ['Hình thoi là hình bình hành: hai góc kề một cạnh bù nhau.', 'Góc tù $= 180^\\circ - 70^\\circ$.'],
      loiGiai: ['Hai góc kề một cạnh của hình thoi bù nhau.', 'Góc tù $= 180^\\circ - 70^\\circ = 110^\\circ$'],
      loiThuongGap: [{ gt: 290, giaiThich: 'Em dùng tổng $360^\\circ$ cho một góc. Hai góc **kề** một cạnh có tổng $180^\\circ$.' }] },
    { id: '14.L11', muc: 2, de: 'Tứ giác có hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường là hình gì?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hình thoi', 'Hình chữ nhật', 'Hình thang cân', 'Chỉ là tứ giác bất kì'] },
      goiY: ['Hai đường chéo cắt nhau tại trung điểm mỗi đường: tứ giác là hình gì?', 'Hình bình hành có hai đường chéo vuông góc là hình gì?'],
      loiGiai: ['Hai đường chéo cắt nhau tại trung điểm mỗi đường nên tứ giác là hình bình hành.', 'Hình bình hành có hai đường chéo vuông góc là **hình thoi**.'] },
    { id: '14.L12', muc: 3, de: 'Khẳng định "Hình thoi có một góc vuông là hình vuông" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hình thoi là hình bình hành. Hình bình hành có một góc vuông là hình gì?', 'Hình chữ nhật có bốn cạnh bằng nhau là hình gì?'],
      loiGiai: ['Hình thoi là hình bình hành, có một góc vuông nên là hình chữ nhật.', 'Hình chữ nhật có bốn cạnh bằng nhau là hình vuông. Khẳng định **đúng**.'] },
    { id: '14.L13', muc: 3, de: 'Hình nào dưới đây có hai đường chéo vừa **bằng nhau** vừa **vuông góc** với nhau?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['Hình thoi (bất kì)', 'Hình chữ nhật (bất kì)', 'Hình thang cân (bất kì)', 'Hình vuông'] },
      goiY: ['Hai đường chéo bằng nhau: hình chữ nhật, hình thang cân. Hai đường chéo vuông góc: hình thoi.', 'Hình nào vừa là hình chữ nhật vừa là hình thoi?'],
      loiGiai: ['Hình vuông là hình chữ nhật (đường chéo bằng nhau) và là hình thoi (đường chéo vuông góc).', 'Các hình còn lại chỉ có một trong hai tính chất (nói chung).'] }
  ] });
})();
