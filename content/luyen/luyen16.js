// Luyện thêm – Bài 16: Đường trung bình của tam giác
(function () {
  'use strict';
  var TIM = '#9c36b5', CAM = '#d9480f';
  // CAM: đoạn KF trong hình tứ giác

  function so(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); }   // trong $…$
  function chu(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }     // nhãn trên hình
  function lech(a, b) { return Math.abs(a - b) > 1e-9; }
  // Ba cạnh nguyên a = BC, b = CA, c = AB của một tam giác "đẹp" (không dẹt).
  function baCanh(r, lo, hi) {
    var a, b, c, n = 0;
    do { a = r.so(lo, hi); b = r.so(lo, hi); c = r.so(lo, hi); n++; }
    while (n < 100 && !(b + c > a + 2 && a + b > c + 2 && a + c > b + 2 && Math.min(a, b, c) >= 0.65 * Math.max(a, b, c) && !(a === b && b === c)));
    if (n >= 100) { a = 10; b = 8; c = 7; }
    return { a: a, b: b, c: c };
  }
  // Hình tam giác có hai trung điểm M ∈ AB, N ∈ AC; ten = [A, B, C, M, N].
  // ghiChu: ghi độ dài AB, AC ở góc hình (nhãn đặt giữa AB, AC sẽ đè lên tên trung điểm M, N)
  function hinhTB(ten, s, nhan, vachAN, ghiChu) {
    var T = TOAN8.hh.tg(s.a, s.b, s.c), g = TOAN8.hh.giua, d = {};
    d[ten[0]] = T.A; d[ten[1]] = T.B; d[ten[2]] = T.C; d[ten[3]] = g(T.A, T.B); d[ten[4]] = g(T.A, T.C);
    return TOAN8.hinhGeo({ diem: d, to: [ten[0], ten[1], ten[2]],
      canh: [[ten[0], ten[3], { vach: 1 }], [ten[3], ten[1], { vach: 1 }], [ten[0], ten[4], vachAN === false ? {} : { vach: 2 }], [ten[4], ten[2], vachAN === false ? {} : { vach: 2 }],
        [ten[1], ten[2]], [ten[3], ten[4], { mau: TIM, day: 4 }]], nhan: nhan, ghiChu: ghiChu });
  }
  // Hình lời giải: cảnh đường trung bình theo chính số của đề (s.a = BC, s.b = CA, s.c = AB)
  function hinhGiai(ten, s, tuyChon, ghiChu) {
    return { widget: 'canh', config: { ten: 'thalesTrungBinh', thamSo: { trangThai: 'giai' }, chiXem: true, t: 1, ghiChu: ghiChu,
      tuyChon: Object.assign({ ten: ten, AB: s.c, AC: s.b, BC: s.a }, tuyChon) } };
  }
  var BO_TEN = [['A', 'B', 'C', 'M', 'N'], ['A', 'B', 'C', 'D', 'E'], ['D', 'E', 'F', 'M', 'N'], ['M', 'N', 'P', 'I', 'K'], ['P', 'Q', 'R', 'E', 'F']];

  TOAN8.luyen(16, [
    { ten: 'Tính đường trung bình hoặc cạnh thứ ba', muc: 1, sinh: function (r) {
      var t = r.chon(BO_TEN), s = baCanh(r, 6, 16), A = t[0], B = t[1], C = t[2], M = t[3], N = t[4];
      var canh = B + C, tb = M + N, BC = s.a, MN = s.a / 2, tinhTB = r.dau() > 0, ltg = [];
      var de, kq, lg;
      if (tinhTB) {
        kq = MN;
        if (lech(2 * BC, kq)) ltg.push({ gt: 2 * BC, giaiThich: 'Em nhân đôi rồi. Đường trung bình **bằng nửa** cạnh thứ ba: $' + tb + ' = \\frac{1}{2}' + canh + '$.' });
        de = 'Trong hình, $' + M + '$, $' + N + '$ lần lượt là trung điểm của $' + A + B + '$, $' + A + C + '$ và $' + canh + ' = ' + so(BC) + '$. Tính $x = ' + tb + '$.';
        lg = ['$' + tb + '$ nối trung điểm hai cạnh $' + A + B + '$, $' + A + C + '$ nên là đường trung bình của $\\triangle ' + A + B + C + '$.', '$x = \\frac{1}{2} \\cdot ' + so(BC) + ' = ' + so(kq) + '$'];
      } else {
        kq = BC;
        if (lech(MN / 2, kq)) ltg.push({ gt: MN / 2, giaiThich: 'Em chia đôi $' + tb + '$. Ở đây $' + canh + '$ là cạnh lớn, **gấp đôi** đường trung bình.' });
        de = 'Trong hình, $' + M + '$, $' + N + '$ lần lượt là trung điểm của $' + A + B + '$, $' + A + C + '$ và $' + tb + ' = ' + so(MN) + '$. Tính $x = ' + canh + '$.';
        lg = ['$' + tb + '$ là đường trung bình của $\\triangle ' + A + B + C + '$ nên $' + tb + ' = \\frac{1}{2}' + canh + '$, tức $' + canh + ' = 2 \\cdot ' + tb + '$.', '$x = 2 \\cdot ' + so(MN) + ' = ' + so(kq) + '$'];
      }
      return {
        de: de,
        hinh: hinhTB(t, s, tinhTB ? [[B, C, chu(BC)], [M, N, 'x', true, 0.8]] : [[B, C, 'x'], [M, N, chu(MN), true, 0.8]]),
        hinhGiai: hinhGiai(t, s, tinhTB ? { nhan: { BC: chu(BC), MN: 'x' }, giai: { MN: chu(MN) } } : { nhan: { BC: 'x', MN: chu(MN) }, giai: { BC: chu(BC) } },
          'Quay mảnh tam giác trên nửa vòng: hai đoạn ' + M + N + ' nối nhau dài bằng ' + B + C + '.'),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$' + tb + '$ nối trung điểm hai cạnh nên là **đường trung bình**.', 'Đường trung bình bằng nửa cạnh thứ ba: $' + tb + ' = \\frac{1}{2}' + canh + '$.'],
        loiGiai: lg, loiThuongGap: ltg
      };
    } },

    { ten: 'Nhận dạng đường trung bình', muc: 1, khongHinh: 'Câu nhận dạng: hình của đề đã vẽ đủ các trung điểm và các đoạn, chỉ cần xem đoạn nối hai trung điểm hay nối đỉnh với trung điểm.', sinh: function (r) {
      var t = r.chon([['A', 'B', 'C', 'D', 'E', 'F'], ['M', 'N', 'P', 'D', 'E', 'F'], ['A', 'B', 'C', 'M', 'N', 'P']]);
      var A = t[0], B = t[1], C = t[2], D = t[3], E = t[4], F = t[5]; // D ∈ AB, E ∈ AC, F ∈ BC là trung điểm
      var s = baCanh(r, 7, 14), T = TOAN8.hh.tg(s.a, s.b, s.c), g = TOAN8.hh.giua, dd = {};
      dd[A] = T.A; dd[B] = T.B; dd[C] = T.C; dd[D] = g(T.A, T.B); dd[E] = g(T.A, T.C); dd[F] = g(T.B, T.C);
      var tb = [D + E, E + F, D + F], tt = [A + F, B + E, C + D];
      var hoiLa = r.dau() > 0; // true: chọn đoạn LÀ đường trung bình; false: chọn đoạn KHÔNG phải
      var dung, sai;
      if (hoiLa) { dung = r.chon(tb); sai = r.xaoTron(tt); }
      else { dung = r.chon(tt); sai = r.xaoTron(tb); }
      var lc = r.xaoTron([dung].concat(sai)), gt = lc.indexOf(dung);
      var canh = [[A, D, { vach: 1 }], [D, B, { vach: 1 }], [A, E, { vach: 2 }], [E, C, { vach: 2 }], [B, F, { vach: 3 }], [F, C, { vach: 3 }]];
      // mọi đoạn được hỏi vẽ cùng một kiểu để màu không "lộ" đáp án
      lc.forEach(function (x) { canh.push([x[0], x[1], { mau: TIM, day: 2 }]); });
      return {
        de: 'Trong hình, $' + D + '$, $' + E + '$, $' + F + '$ lần lượt là trung điểm của $' + A + B + '$, $' + A + C + '$, $' + B + C + '$. Đoạn nào ' + (hoiLa ? '**là**' : '**không phải là**') + ' đường trung bình của tam giác $' + A + B + C + '$?',
        hinh: TOAN8.hinhGeo({ diem: dd, to: [A, B, C], canh: canh }),
        dapAn: { kieu: 'chon', gt: gt, luaChon: lc.map(function (x) { return '$' + x + '$'; }) },
        goiY: ['Đường trung bình nối **trung điểm của hai cạnh**.', 'Đoạn nối **một đỉnh** với trung điểm cạnh đối diện là đường trung tuyến, không phải đường trung bình.'],
        loiGiai: ['$' + tb.join('$, $') + '$ nối trung điểm hai cạnh nên là đường trung bình; $' + tt.join('$, $') + '$ nối một đỉnh với trung điểm cạnh đối diện nên là đường trung tuyến.',
          'Vậy đáp án là $' + dung + '$.']
      };
    } },

    { ten: 'Chu vi tạo bởi đường trung bình', muc: 2, sinh: function (r, cc) {
      var s = baCanh(r, 6, 20), AB = s.c, BC = s.a, CA = s.b, P = AB + BC + CA, ltg = [];
      var hinh;
      if (r.dau() > 0) {
        // tam giác MNP tạo bởi ba đường trung bình
        var T = TOAN8.hh.tg(BC, CA, AB), g = TOAN8.hh.giua;
        hinh = TOAN8.hinhGeo({ diem: { A: T.A, B: T.B, C: T.C, M: g(T.A, T.B), N: g(T.A, T.C), P: g(T.B, T.C) }, to: ['A', 'B', 'C'],
          canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM }], ['N', 'P', { mau: TIM }], ['P', 'M', { mau: TIM }]],
          nhan: [['B', 'C', String(BC)]], ghiChu: 'AB = ' + AB + ', AC = ' + CA });
        ltg.push({ gt: P, giaiThich: '$' + P + '$ là chu vi $\\triangle ABC$. Chu vi $\\triangle MNP$ chỉ bằng **một nửa**.' });
        ltg.push({ gt: 2 * P, giaiThich: 'Mỗi đường trung bình bằng **nửa** cạnh tương ứng, không phải gấp đôi.' });
        return {
          de: 'Tam giác $ABC$ có $AB = ' + AB + '$ cm, $BC = ' + BC + '$ cm, $CA = ' + CA + '$ cm. $M$, $N$, $P$ lần lượt là trung điểm của $AB$, $AC$, $BC$. Tính chu vi tam giác $MNP$ (cm).',
          hinh: hinh, dapAn: { kieu: 'so', gt: P / 2 },
          hinhGiai: hinhGiai(['A', 'B', 'C', 'M', 'N', 'P'], s, { dang: 'ba', giai: { MN: chu(BC / 2), NP: chu(AB / 2), MP: chu(CA / 2) } },
            'AB = ' + AB + ', BC = ' + BC + ', CA = ' + CA + '. Mỗi đoạn màu đặt hai lần thì vừa khít cạnh song song với nó.'),
          goiY: ['Mỗi cạnh của $\\triangle MNP$ là một đường trung bình, bằng nửa cạnh **song song** với nó.', '$MN = \\frac{1}{2}BC$, $NP = \\frac{1}{2}AB$, $MP = \\frac{1}{2}AC$.'],
          loiGiai: ['$MN = \\frac{1}{2}BC = ' + so(BC / 2) + '$; $NP = \\frac{1}{2}AB = ' + so(AB / 2) + '$; $MP = \\frac{1}{2}AC = ' + so(CA / 2) + '$.',
            'Chu vi $\\triangle MNP = ' + so(BC / 2) + ' + ' + so(AB / 2) + ' + ' + so(CA / 2) + ' = ' + so(P / 2) + '$'],
          loiThuongGap: ltg
        };
      }
      // chu vi tứ giác BMNC
      var kq = AB / 2 + BC / 2 + CA / 2 + BC;
      var quen = AB / 2 + BC / 2 + CA / 2;
      ltg.push({ gt: quen, giaiThich: 'Em quên cạnh đáy $BC = ' + BC + '$. Chu vi gồm cả bốn cạnh $BM$, $MN$, $NC$, $CB$.' });
      var sai = AB / 2 + 2 * BC + CA / 2 + BC;
      ltg.push({ gt: sai, giaiThich: 'Kiểm tra lại $MN$: đường trung bình bằng **nửa** $BC$, tức $' + so(BC / 2) + '$ cm.' });
      return {
        de: 'Tam giác $ABC$ có $AB = ' + AB + '$ cm, $AC = ' + CA + '$ cm, $BC = ' + BC + '$ cm. $M$, $N$ lần lượt là trung điểm của $AB$, $AC$. Tính chu vi tứ giác $BMNC$ (cm).',
        hinh: hinhTB(['A', 'B', 'C', 'M', 'N'], s, [['B', 'C', String(BC)]], undefined, 'AB = ' + AB + ', AC = ' + CA),
        hinhGiai: hinhGiai(['A', 'B', 'C', 'M', 'N'], s, { dang: 'quaM', nhan: { BC: String(BC), MB: chu(AB / 2), NC: chu(CA / 2) }, giai: { MN: chu(BC / 2) } },
          'BM = AB : 2, NC = AC : 2, còn MN là đường trung bình nên bằng BC : 2.'),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Chu vi $BMNC = BM + MN + NC + CB$.', '$BM = \\frac{1}{2}AB$, $NC = \\frac{1}{2}AC$, $MN = \\frac{1}{2}BC$.'],
        loiGiai: ['$BM = ' + so(AB / 2) + '$, $NC = ' + so(CA / 2) + '$, $MN = \\frac{1}{2}BC = ' + so(BC / 2) + '$.',
          'Chu vi $BMNC = ' + so(AB / 2) + ' + ' + so(BC / 2) + ' + ' + so(CA / 2) + ' + ' + BC + ' = ' + so(kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Qua trung điểm, song song cạnh thứ hai', muc: 2, sinh: function (r) {
      var s = baCanh(r, 6, 18), AC = s.b, hoi = r.chon(['AN', 'NC', 'MN']), ltg = [], kq;
      var de0 = 'Cho tam giác $ABC$ có $AC = ' + AC + '$ cm, $BC = ' + s.a + '$ cm. Qua trung điểm $M$ của $AB$ kẻ đường thẳng song song với $BC$, cắt $AC$ tại $N$. ';
      var lg0 = '$M$ là trung điểm $AB$ và $MN \\parallel BC$ nên $N$ là trung điểm của $AC$.';
      var lg;
      if (hoi === 'MN') {
        kq = s.a / 2;
        lg = [lg0, 'Do đó $MN$ là đường trung bình của $\\triangle ABC$.', '$MN = \\frac{1}{2}BC = \\frac{1}{2} \\cdot ' + s.a + ' = ' + so(kq) + '$'];
        if (lech(AC / 2, kq)) ltg.push({ gt: AC / 2, giaiThich: '$' + so(AC / 2) + '$ là $AN$. Đường trung bình $MN$ bằng nửa cạnh **song song** với nó là $BC$.' });
      } else {
        kq = AC / 2;
        lg = [lg0, '$' + hoi + ' = \\frac{1}{2}AC = \\frac{1}{2} \\cdot ' + AC + ' = ' + so(kq) + '$'];
        if (lech(s.a / 2, kq)) ltg.push({ gt: s.a / 2, giaiThich: 'Em lấy nửa $BC$. $N$ là trung điểm của $AC$ nên $' + hoi + ' = \\frac{1}{2}AC$.' });
        if (lech(2 * AC, kq)) ltg.push({ gt: 2 * AC, giaiThich: '$N$ là trung điểm nên $' + hoi + '$ là **một nửa** $AC$.' });
      }
      return {
        de: de0 + 'Tính $' + hoi + '$ (cm).',
        // không vạch AN = NC: đó chính là điều em phải suy ra
        hinh: hinhTB(['A', 'B', 'C', 'M', 'N'], s, [['B', 'C', s.a + ' cm']], false, 'AC = ' + AC + ' cm'),
        hinhGiai: hinhGiai(['A', 'B', 'C', 'M', 'N'], s, (function () { var gi = {}; gi[hoi] = chu(kq); return { dang: 'quaM', nhan: { BC: String(s.a) }, giai: gi }; })(),
          'Đường trung bình nối M với trung điểm AC cũng song song với BC. Qua M chỉ có một đường song song với BC, nên N chính là trung điểm của AC.'),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua **trung điểm** của cạnh thứ ba.', 'Vậy $N$ là trung điểm của $AC$' + (hoi === 'MN' ? ' và $MN$ là đường trung bình.' : '.')],
        loiGiai: lg, loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế, tứ giác', muc: 3, sinh: function (r) {
      var kieu = r.chon(['ho', 'ho', 'tuGiac', 'vuong']), ltg = [];
      if (kieu === 'ho') {
        var dv = r.chon([10, 20, 30]), BC = 2 * dv * r.so(4, 9), AB = 2 * dv * r.so(3, 8), AC = 2 * dv * r.so(3, 8);
        var n = 0;
        while (n < 50 && !(AB + AC > BC * 1.15 && AB + BC > AC * 1.15 && AC + BC > AB * 1.15)) { AB = 2 * dv * r.so(3, 8); AC = 2 * dv * r.so(3, 8); n++; }
        if (!(AB + AC > BC * 1.15 && AB + BC > AC * 1.15 && AC + BC > AB * 1.15)) { BC = 26 * dv; AB = 24 * dv; AC = 36 * dv; }
        var nguoi = r.chon(['Bác Mến', 'Chú Tư', 'Anh Hùng', 'Cô Lan']);
        var hoiPQ = r.dau() > 0, kq = hoiPQ ? BC / 2 : BC;
        var k = 1 / dv, T = TOAN8.hh.tg(BC * k, AC * k, AB * k), g = TOAN8.hh.giua, Pp = g(T.A, T.B), Q = g(T.A, T.C);
        var hinh = TOAN8.hinhGeo({ diem: { A: T.A, B: T.B, C: T.C, P: Pp, Q: Q },
          canh: [['A', 'B', { net: 2 }], ['A', 'C', { net: 2 }], ['B', 'C', { net: 2 }], ['P', 'Q', { mau: TIM, day: 3 }]],
          nhan: hoiPQ ? [['A', 'P', AB / 2 + ' m'], ['P', 'B', AB / 2 + ' m'], ['A', 'Q', AC / 2 + ' m'], ['Q', 'C', AC / 2 + ' m'], ['B', 'C', BC + ' m']] : [['P', 'Q', BC / 2 + ' m', true, 0.8], ['B', 'C', '?']],
          // hồ chắn đoạn cần tìm: PQ (khi hỏi PQ) hoặc BC (khi hỏi BC) – đoạn đo được phải đi lại được
          them: function (board) {
            var X = hoiPQ ? Pp : T.B, Y = hoiPQ ? Q : T.C, Mx = (X[0] + Y[0]) / 2, My = (X[1] + Y[1]) / 2, f = hoiPQ ? 0.7 : 0.5;
            var F1 = [Mx + f * (X[0] - Mx), My + f * (X[1] - My)], F2 = [Mx + f * (Y[0] - Mx), My + f * (Y[1] - My)];
            var Qua = hoiPQ ? Pp : [Mx + 0.62 * (X[0] - Mx), My + 0.62 * (X[1] - My)];
            board.create('ellipse', [F1, F2, Qua], { fillColor: '#74c0fc', fillOpacity: 0.35, strokeColor: '#74c0fc', fixed: true, highlight: false });
          },
          ghiChu: hoiPQ ? 'P, Q ở hai bờ hồ' : 'Hồ nằm giữa B và C' });
        if (hoiPQ) {
          ltg.push({ gt: 2 * BC, giaiThich: 'Đường trung bình bằng **nửa** cạnh thứ ba: $PQ = ' + BC + ' : 2$.' });
          if (lech((AB + AC) / 4, kq)) ltg.push({ gt: (AB + AC) / 4, giaiThich: 'Em lấy trung bình cộng $AP$ và $AQ$. Hãy dùng tính chất đường trung bình: $PQ = \\frac{1}{2}BC$.' });
          return {
            de: nguoi + ' muốn biết khoảng cách giữa hai điểm $P$, $Q$ ở hai bờ hồ. ' + nguoi + ' chọn các vị trí $A$, $B$, $C$ và đo được $AP = PB = ' + AB / 2 + '$ m, $AQ = QC = ' + AC / 2 + '$ m, $BC = ' + BC + '$ m (xem hình). Tính $PQ$ (m).',
            hinh: hinh, dapAn: { kieu: 'so', gt: kq },
            goiY: ['$P$ là trung điểm $AB$, $Q$ là trung điểm $AC$. Vậy $PQ$ là gì của $\\triangle ABC$?', '$PQ = \\frac{1}{2}BC$.'],
            loiGiai: ['$P$, $Q$ là trung điểm của $AB$, $AC$ nên $PQ$ là đường trung bình của $\\triangle ABC$.', '$PQ = \\frac{1}{2} \\cdot ' + BC + ' = ' + kq + '$ (m)'],
            loiThuongGap: ltg
          };
        }
        ltg.push({ gt: BC / 4, giaiThich: 'Ngược rồi: $PQ$ mới là một nửa của $BC$, nên $BC = 2 \\cdot PQ$.' });
        return {
          de: 'Hai điểm $B$, $C$ bị một hồ nước ngăn cách. ' + nguoi + ' chọn điểm $A$ rồi đánh dấu $P$, $Q$ là trung điểm của $AB$, $AC$, đo được $PQ = ' + BC / 2 + '$ m. Tính khoảng cách $BC$ (m).',
          hinh: hinh, dapAn: { kieu: 'so', gt: kq },
          goiY: ['$PQ$ nối trung điểm hai cạnh $AB$, $AC$ nên là đường trung bình.', '$PQ = \\frac{1}{2}BC$ nên $BC = 2 \\cdot PQ$.'],
          loiGiai: ['$PQ$ là đường trung bình của $\\triangle ABC$ nên $PQ = \\frac{1}{2}BC$.', '$BC = 2 \\cdot ' + BC / 2 + ' = ' + BC + '$ (m)'],
          loiThuongGap: ltg
        };
      }
      if (kieu === 'tuGiac') {
        var ab = r.so(3, 9), cd = ab + r.so(2, 7), h = 0.6 * cd, lx = r.so(0, 2) + 0.5;
        var A = [lx, h], B = [lx + ab, h], C = [cd, 0], D = [0, 0], E = TOAN8.hh.giua(A, D), F = TOAN8.hh.giua(B, C), K = TOAN8.hh.giua(A, C);
        var kq2 = (ab + cd) / 2;
        ltg.push({ gt: ab + cd, giaiThich: '$' + (ab + cd) + ' = AB + CD$. Mỗi đường trung bình chỉ bằng **nửa** cạnh song song với nó.' });
        if (lech(cd / 2, kq2)) ltg.push({ gt: cd / 2, giaiThich: '$' + so(cd / 2) + '$ mới là $EK$. Còn phải cộng thêm $KF = \\frac{1}{2}AB$.' });
        return {
          de: 'Cho tứ giác $ABCD$ có $AB = ' + ab + '$ cm, $CD = ' + cd + '$ cm. $E$, $F$, $K$ lần lượt là trung điểm của $AD$, $BC$, $AC$. Tính $EK + KF$ (cm).',
          hinh: TOAN8.hinhGeo({ diem: { A: A, B: B, C: C, D: D, E: E, F: F, K: K },
            canh: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C', { mau: '#adb5bd', net: 2 }], ['E', 'K', { mau: TIM, day: 4 }], ['K', 'F', { mau: CAM, day: 4 }]],
            nhan: [['A', 'B', String(ab)], ['D', 'C', String(cd)]], lechTen: { K: [0, -16] } }),
          dapAn: { kieu: 'so', gt: kq2 },
          goiY: ['Xét $\\triangle ACD$: $E$, $K$ là trung điểm của $AD$, $AC$. Xét $\\triangle CAB$: $K$, $F$ là trung điểm của $CA$, $CB$.', '$EK = \\frac{1}{2}CD$, $KF = \\frac{1}{2}AB$.'],
          loiGiai: ['Trong $\\triangle ACD$, $EK$ là đường trung bình nên $EK = \\frac{1}{2}CD = ' + so(cd / 2) + '$.',
            'Trong $\\triangle ABC$, $KF$ là đường trung bình nên $KF = \\frac{1}{2}AB = ' + so(ab / 2) + '$.',
            '$EK + KF = ' + so(cd / 2) + ' + ' + so(ab / 2) + ' = ' + so(kq2) + '$'],
          loiThuongGap: ltg
        };
      }
      // tam giác vuông tại A, M trung điểm AB, MN ⊥ AB (N ∈ BC) → N trung điểm BC, AC = 2MN
      var bo = r.chon([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]]); // [AC/… , AB/…, BC/…] theo nửa
      var MN = bo[0], BM = bo[1], BN = bo[2];
      ltg.push({ gt: MN / 2, giaiThich: '$MN$ là đường trung bình nên $AC = 2 \\cdot MN$, không phải $MN : 2$.' });
      ltg.push({ gt: 2 * BN, giaiThich: '$' + 2 * BN + '$ là cạnh $BC$. Đề hỏi $AC$, cạnh song song với $MN$.' });
      return {
        de: 'Tam giác $ABC$ vuông tại $A$. $M$ là trung điểm của $AB$ ($BM = MA = ' + BM + '$). Đường thẳng qua $M$ vuông góc với $AB$ cắt $BC$ tại $N$, biết $BN = ' + BN + '$, $MN = ' + MN + '$. Tính $AC$.',
        hinh: TOAN8.hinhGeo({ diem: { A: [0, 0], B: [0, 2 * BM], C: [2 * MN, 0], M: [0, BM], N: [MN, BM] }, to: ['A', 'B', 'C'],
          canh: [['A', 'B'], ['B', 'C'], ['A', 'C'], ['M', 'N', { mau: TIM }]],
          goc: [['B', 'M', 'N', { mau: '#495057', r: 0.08 * BM }], ['B', 'A', 'C', { mau: '#495057', r: 0.08 * BM }]],
          nhan: [['B', 'M', String(BM)], ['M', 'A', String(BM)], ['B', 'N', String(BN)], ['M', 'N', String(MN), true, 0.6]] }),
        dapAn: { kieu: 'so', gt: 2 * MN },
        goiY: ['$MN \\perp AB$ và $AC \\perp AB$ nên $MN \\parallel AC$. Đường thẳng qua trung điểm $M$ của $AB$, song song với $AC$ thì đi qua trung điểm của $BC$.', 'Vậy $MN$ là đường trung bình: $AC = 2MN$.'],
        loiGiai: ['$MN \\perp AB$, $AC \\perp AB$ nên $MN \\parallel AC$; $M$ là trung điểm $AB$ nên $N$ là trung điểm $BC$.', '$MN$ là đường trung bình của $\\triangle ABC$.', '$AC = 2 \\cdot ' + MN + ' = ' + 2 * MN + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Hai đường trung bình, tính ngược', muc: 3, sinh: function (r) {
      // Biết chu vi tam giác tạo bởi ba đường trung bình và hai cạnh → tính cạnh thứ ba
      var s = baCanh(r, 6, 20), AB = s.c, BC = s.a, CA = s.b, Pn = (AB + BC + CA) / 2, ltg = [];
      var kq = CA;
      ltg.push({ gt: Pn - AB / 2 - BC / 2, giaiThich: '$' + so(Pn - AB / 2 - BC / 2) + '$ là $MP$ (đường trung bình). Đề hỏi cạnh $AC = 2 \\cdot MP$.' });
      return {
        de: 'Tam giác $ABC$ có $AB = ' + AB + '$ cm, $BC = ' + BC + '$ cm. Gọi $M$, $N$, $P$ là trung điểm của $AB$, $AC$, $BC$. Biết chu vi tam giác $MNP$ bằng $' + so(Pn) + '$ cm. Tính $AC$ (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Chu vi $\\triangle MNP$ bằng **nửa** chu vi $\\triangle ABC$.', 'Chu vi $\\triangle ABC = 2 \\cdot ' + so(Pn) + '$; rồi $AC = $ chu vi $- AB - BC$.'],
        loiGiai: ['Mỗi cạnh của $\\triangle MNP$ là đường trung bình nên chu vi $\\triangle MNP$ bằng nửa chu vi $\\triangle ABC$.',
          'Chu vi $\\triangle ABC = 2 \\cdot ' + so(Pn) + ' = ' + (2 * Pn) + '$ (cm).', '$AC = ' + 2 * Pn + ' - ' + AB + ' - ' + BC + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } }
  ]);
})();
