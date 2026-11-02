// Bài nền (lớp 7): Hai tam giác bằng nhau, các trường hợp c.c.c, c.g.c, g.c.g – cần cho Chương III, IX.
(function () {
  'use strict';
  var TEN2 = ['MNP', 'DEF', 'HIK', 'XYZ'];
  function goc(v) { return '\\widehat{' + v + '}'; }
  // ba cạnh khác nhau, thỏa bất đẳng thức tam giác
  function baCanh(r) {
    var s;
    do { s = r.khacNhau(3, 3, 12); } while (s[0] + s[1] <= s[2] || s[1] + s[2] <= s[0] || s[0] + s[2] <= s[1]);
    return s;
  }

  TOAN8.nen({
    id: 'tamGiacBang', ten: 'Hai tam giác bằng nhau', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Hai tam giác bằng nhau',
        noiDung: 'Hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau.\n\nKhi viết $\\triangle ABC = \\triangle MNP$, **thứ tự các đỉnh** cho biết đỉnh tương ứng: $A \\leftrightarrow M$, $B \\leftrightarrow N$, $C \\leftrightarrow P$. Do đó $AB = MN$, $BC = NP$, $CA = PM$ và $\\widehat{A} = \\widehat{M}$, $\\widehat{B} = \\widehat{N}$, $\\widehat{C} = \\widehat{P}$.' },
      { loai: 'dinhLi', tieuDe: 'Ba trường hợp bằng nhau của tam giác',
        noiDung: '• **c.c.c**: ba cạnh của tam giác này bằng ba cạnh của tam giác kia.\n\n• **c.g.c**: hai cạnh và **góc xen giữa** hai cạnh đó.\n\n• **g.c.g**: một cạnh và **hai góc kề** cạnh đó.' },
      { loai: 'dinhLi', tieuDe: 'Trường hợp riêng của tam giác vuông',
        noiDung: 'Hai tam giác vuông bằng nhau nếu có: hai cạnh góc vuông bằng nhau; hoặc một cạnh góc vuông và góc nhọn kề cạnh ấy bằng nhau; hoặc **cạnh huyền và một góc nhọn** bằng nhau; hoặc **cạnh huyền và một cạnh góc vuông** bằng nhau.' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** dùng c.g.c khi góc **không xen giữa** hai cạnh (chưa đủ để kết luận); ghép sai cặp đỉnh tương ứng (phải đọc theo thứ tự đỉnh trong kí hiệu).' }
    ],
    viDu: [
      { de: 'Cho tứ giác $ABCD$ có $AB = AD$, $CB = CD$. Chứng minh $\\widehat{B} = \\widehat{D}$.', buoc: [
        { lam: 'Xét $\\triangle ABC$ và $\\triangle ADC$: $AB = AD$, $CB = CD$, $AC$ là cạnh chung.', vi: 'Tìm ba cặp cạnh bằng nhau; cạnh chung cũng là một cặp.' },
        { lam: '$\\triangle ABC = \\triangle ADC$ (c.c.c)', vi: 'Viết đúng thứ tự đỉnh: $A \\leftrightarrow A$, $B \\leftrightarrow D$, $C \\leftrightarrow C$.' },
        { lam: 'Suy ra $\\widehat{B} = \\widehat{D}$ (hai góc tương ứng).', vi: 'Hai tam giác bằng nhau thì các góc tương ứng bằng nhau.' }] }
    ],
    luyen: [
      { ten: 'Cạnh, góc tương ứng', muc: 1, sinh: function (r) {
        var T2 = r.chon(TEN2), sg = r.xaoTron([0, 1, 2]), L = 'ABC', ph = sg.map(function (j) { return T2[j]; }).join('');
        var inv = [0, 1, 2].map(function (j) { return sg.indexOf(j); }); // đỉnh thứ j của T2 ứng với L[inv[j]]
        var tuongUng = 'Theo thứ tự đỉnh: $A \\leftrightarrow ' + ph[0] + '$, $B \\leftrightarrow ' + ph[1] + '$, $C \\leftrightarrow ' + ph[2] + '$.';
        var ltg = [];
        if (r.dau() > 0) {
          var s = baCanh(r), canh = { AB: s[0], BA: s[0], BC: s[1], CB: s[1], CA: s[2], AC: s[2] };
          var jk = r.chon([[0, 1], [1, 2], [0, 2]]), j0 = jk[0], k0 = jk[1];
          var hoi = T2[j0] + T2[k0], tu = L[inv[j0]] + L[inv[k0]], kq = canh[tu], ngay = canh[L[j0] + L[k0]];
          if (ngay !== kq) ltg.push({ gt: ngay, giaiThich: 'Không ghép theo bảng chữ cái. Đọc thứ tự đỉnh trong kí hiệu: $' + T2[j0] + ' \\leftrightarrow ' + L[inv[j0]] + '$, $' + T2[k0] + ' \\leftrightarrow ' + L[inv[k0]] + '$.' });
          return {
            de: 'Cho $\\triangle ABC = \\triangle ' + ph + '$, biết $AB = ' + s[0] + '$ cm, $BC = ' + s[1] + '$ cm, $CA = ' + s[2] + '$ cm. Tính độ dài cạnh $' + hoi + '$ (cm).',
            dapAn: { kieu: 'so', gt: kq },
            goiY: ['Thứ tự đỉnh trong kí hiệu cho biết đỉnh nào ứng với đỉnh nào.', 'Tìm xem $' + T2[j0] + '$ và $' + T2[k0] + '$ ứng với hai đỉnh nào của $\\triangle ABC$.'],
            loiGiai: [tuongUng, 'Cạnh $' + hoi + '$ tương ứng với cạnh $' + tu + '$ nên $' + hoi + ' = ' + tu + ' = ' + kq + '$ (cm).'],
            loiThuongGap: ltg
          };
        }
        var gA = 5 * r.so(8, 20), gB = 5 * r.so(8, (150 - gA) / 5), g = { A: gA, B: gB, C: 180 - gA - gB };
        var j = r.so(0, 2), hoiG = T2[j], tuG = L[inv[j]], kqG = g[tuG];
        if (g[L[j]] !== kqG) ltg.push({ gt: g[L[j]], giaiThich: 'Đỉnh $' + hoiG + '$ ứng với đỉnh $' + tuG + '$ (đọc theo thứ tự đỉnh), không phải đỉnh $' + L[j] + '$.' });
        var lg = [tuongUng];
        if (tuG === 'C') lg.push('$\\widehat{C} = 180^\\circ - ' + gA + '^\\circ - ' + gB + '^\\circ = ' + g.C + '^\\circ$.');
        lg.push('$' + goc(hoiG) + ' = ' + goc(tuG) + ' = ' + kqG + '^\\circ$');
        return {
          de: 'Cho $\\triangle ABC = \\triangle ' + ph + '$, biết $\\widehat{A} = ' + gA + '^\\circ$, $\\widehat{B} = ' + gB + '^\\circ$. Tính $' + goc(hoiG) + '$.',
          dapAn: { kieu: 'so', gt: kqG },
          goiY: ['Đỉnh $' + hoiG + '$ ứng với đỉnh nào của $\\triangle ABC$? Xem vị trí của nó trong kí hiệu.', 'Nếu là đỉnh $C$ thì dùng tổng ba góc bằng $180^\\circ$.'],
          loiGiai: lg, loiThuongGap: ltg
        };
      } },
      { ten: 'Nhận ra trường hợp bằng nhau', muc: 2, sinh: function (r) {
        var canh = { AB: 'AB = DE', BC: 'BC = EF', CA: 'CA = FD' }, gc = { A: goc('A') + ' = ' + goc('D'), B: goc('B') + ' = ' + goc('E'), C: goc('C') + ' = ' + goc('F') };
        var ke = { A: ['AB', 'CA'], B: ['AB', 'BC'], C: ['BC', 'CA'] }, dinhCanh = { AB: ['A', 'B'], BC: ['B', 'C'], CA: ['C', 'A'] };
        var loai = r.chon([0, 1, 1, 2, 2, 3, 3]), dk, giai;
        if (loai === 0) { dk = [canh.AB, canh.BC, canh.CA]; giai = 'Ba cặp cạnh bằng nhau nên $\\triangle ABC = \\triangle DEF$ (c.c.c).'; }
        else if (loai === 1) {
          var v = r.chon(['A', 'B', 'C']);
          dk = [canh[ke[v][0]], canh[ke[v][1]], gc[v]];
          giai = 'Góc $' + goc(v) + '$ **xen giữa** hai cạnh $' + ke[v][0] + '$ và $' + ke[v][1] + '$ nên $\\triangle ABC = \\triangle DEF$ (c.g.c).';
        } else if (loai === 2) {
          var c = r.chon(['AB', 'BC', 'CA']), d = dinhCanh[c];
          dk = [canh[c], gc[d[0]], gc[d[1]]];
          giai = 'Hai góc $' + goc(d[0]) + '$, $' + goc(d[1]) + '$ đều **kề** cạnh $' + c + '$ nên $\\triangle ABC = \\triangle DEF$ (g.c.g).';
        } else if (r.dau() > 0) {
          var v2 = r.chon(['A', 'B', 'C']), khac = ['A', 'B', 'C'].filter(function (x) { return x !== v2; });
          var gk = r.chon(khac);
          dk = [canh[ke[v2][0]], canh[ke[v2][1]], gc[gk]];
          giai = 'Góc $' + goc(gk) + '$ **không xen giữa** hai cạnh $' + ke[v2][0] + '$ và $' + ke[v2][1] + '$ (góc xen giữa là $' + goc(v2) + '$), nên chưa đủ điều kiện để kết luận.';
        } else {
          dk = [gc.A, gc.B, gc.C];
          giai = 'Ba cặp góc bằng nhau nhưng **không có cặp cạnh nào** bằng nhau: hai tam giác có thể to nhỏ khác nhau, nên chưa đủ để kết luận.';
        }
        var gt = loai === 3 ? 3 : loai;
        return {
          de: '$\\triangle ABC$ và $\\triangle DEF$ có: $' + r.xaoTron(dk).join('$; $') + '$. Hai tam giác này bằng nhau theo trường hợp nào?',
          dapAn: { kieu: 'chon', gt: gt, luaChon: ['c.c.c', 'c.g.c', 'g.c.g', 'Chưa đủ điều kiện để kết luận'] },
          goiY: ['Đếm số cặp cạnh và số cặp góc bằng nhau.', 'Nếu có hai cạnh và một góc: góc đó có nằm **xen giữa** hai cạnh không? Nếu có một cạnh và hai góc: hai góc có **kề** cạnh đó không?'],
          loiGiai: [giai]
        };
      } },
      { ten: 'Bổ sung điều kiện', muc: 2, sinh: function (r) {
        var ke = { A: ['AB', 'CA'], B: ['AB', 'BC'], C: ['BC', 'CA'] }, doi = { A: 'D', B: 'E', C: 'F' };
        var canhDoi = { AB: 'DE', BC: 'EF', CA: 'FD' }, dinhCanh = { AB: ['A', 'B'], BC: ['B', 'C'], CA: ['C', 'A'] };
        var gcd = function (v) { return goc(v) + ' = ' + goc(doi[v]); }, ccd = function (c) { return c + ' = ' + canhDoi[c]; };
        var de, dung, sai, giai;
        if (r.dau() > 0) {
          var v = r.chon(['A', 'B', 'C']), khac = ['A', 'B', 'C'].filter(function (x) { return x !== v; });
          var c3 = ['AB', 'BC', 'CA'].filter(function (c) { return ke[v].indexOf(c) < 0; })[0];
          de = '$\\triangle ABC$ và $\\triangle DEF$ có $' + ccd(ke[v][0]) + '$, $' + ccd(ke[v][1]) + '$. Cần thêm điều kiện nào để $\\triangle ABC = \\triangle DEF$ theo trường hợp **cạnh – góc – cạnh**?';
          dung = gcd(v); sai = [gcd(khac[0]), gcd(khac[1]), ccd(c3)];
          giai = 'Trường hợp c.g.c cần góc **xen giữa** hai cạnh $' + ke[v][0] + '$ và $' + ke[v][1] + '$, đó là $' + goc(v) + '$. Vậy cần thêm $' + gcd(v) + '$.';
        } else {
          var c = r.chon(['AB', 'BC', 'CA']), d = r.xaoTron(dinhCanh[c]), con = ['A', 'B', 'C'].filter(function (x) { return dinhCanh[c].indexOf(x) < 0; })[0];
          var cKhac = ['AB', 'BC', 'CA'].filter(function (x) { return x !== c; });
          de = '$\\triangle ABC$ và $\\triangle DEF$ có $' + ccd(c) + '$, $' + gcd(d[0]) + '$. Cần thêm điều kiện nào để $\\triangle ABC = \\triangle DEF$ theo trường hợp **góc – cạnh – góc**?';
          // không dùng góc thứ ba (con) làm phương án nhiễu: thêm góc thứ ba bằng nhau thì (nhờ tổng ba góc) cũng suy ra được g.c.g
          dung = gcd(d[1]); sai = [goc(d[1]) + ' = ' + goc(doi[con]), ccd(cKhac[0]), ccd(cKhac[1])];
          giai = 'Trường hợp g.c.g cần **hai góc kề** cạnh $' + c + '$, tức là $' + goc(d[0]) + '$ và $' + goc(d[1]) + '$. Vậy cần thêm $' + gcd(d[1]) + '$.';
        }
        var lc = r.xaoTron([dung].concat(sai));
        return {
          de: de,
          dapAn: { kieu: 'chon', gt: lc.indexOf(dung), luaChon: lc.map(function (s) { return '$' + s + '$'; }) },
          goiY: ['c.g.c: góc phải **xen giữa** hai cạnh; g.c.g: hai góc phải **kề** cạnh.', 'Xác định góc nằm giữa (hoặc ở hai đầu) cạnh đã cho.'],
          loiGiai: [giai]
        };
      } },
      { ten: 'Tính toán nhờ hai tam giác bằng nhau', muc: 3, sinh: function (r) {
        var T2 = r.chon(TEN2), M = T2[0], N = T2[1], P = T2[2];
        if (r.dau() > 0) {
          var s = baCanh(r), cv = s[0] + s[1] + s[2];
          return {
            de: 'Cho $\\triangle ABC = \\triangle ' + T2 + '$, biết $AB = ' + s[0] + '$ cm, $' + N + P + ' = ' + s[1] + '$ cm, $' + M + P + ' = ' + s[2] + '$ cm. Tính chu vi tam giác $ABC$ (cm).',
            dapAn: { kieu: 'so', gt: cv },
            goiY: ['Cạnh $' + N + P + '$ ứng với cạnh nào của $\\triangle ABC$? Cạnh $' + M + P + '$ thì sao?', '$BC = ' + N + P + '$, $CA = ' + M + P + '$; chu vi $= AB + BC + CA$.'],
            loiGiai: ['Vì $\\triangle ABC = \\triangle ' + T2 + '$ nên $BC = ' + N + P + ' = ' + s[1] + '$ cm, $CA = ' + M + P + ' = ' + s[2] + '$ cm.',
              'Chu vi $\\triangle ABC = ' + s[0] + ' + ' + s[1] + ' + ' + s[2] + ' = ' + cv + '$ (cm).']
          };
        }
        var gA = 5 * r.so(8, 20), gB = 5 * r.so(8, (150 - gA) / 5), gC = 180 - gA - gB;
        return {
          de: 'Cho $\\triangle ABC = \\triangle ' + T2 + '$, biết $\\widehat{A} = ' + gA + '^\\circ$, $' + goc(N) + ' = ' + gB + '^\\circ$. Tính $' + goc(P) + '$.',
          dapAn: { kieu: 'so', gt: gC },
          goiY: ['$' + goc(N) + '$ bằng góc nào của $\\triangle ABC$? $' + goc(P) + '$ bằng góc nào?', 'Tính $\\widehat{C}$ bằng tổng ba góc của $\\triangle ABC$.'],
          loiGiai: ['Vì $\\triangle ABC = \\triangle ' + T2 + '$ nên $\\widehat{B} = ' + goc(N) + ' = ' + gB + '^\\circ$ và $' + goc(P) + ' = \\widehat{C}$.',
            '$\\widehat{C} = 180^\\circ - ' + gA + '^\\circ - ' + gB + '^\\circ = ' + gC + '^\\circ$', '$' + goc(P) + ' = \\widehat{C} = ' + gC + '^\\circ$'],
          loiThuongGap: [{ gt: 180 - gB, giaiThich: 'Em quên trừ $\\widehat{A} = ' + gA + '^\\circ$: tổng **ba** góc mới bằng $180^\\circ$.' }]
        };
      } }
    ]
  });
})();
