// Bài nền (lớp 7): Góc kề bù, đối đỉnh, hai đường thẳng song song, tổng ba góc tam giác – cần cho Chương III, IV.
(function () {
  'use strict';
  var RAD = Math.PI / 180, CAM = '#d9480f', XANH = '#1971c2';
  function don(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return [v[0] / l, v[1] / l]; }
  // vị trí nhãn góc: trên tia phân giác của góc PÔQ, cách O một khoảng d
  function viTriNhan(P, O, Q, d) {
    var u = don([P[0] - O[0], P[1] - O[1]]), v = don([Q[0] - O[0], Q[1] - O[1]]), w = don([u[0] + v[0], u[1] + v[1]]);
    return [O[0] + w[0] * d, O[1] + w[1] * d];
  }
  function cung(board, P, O, Q, mau, r) {
    var an = { visible: false, fixed: true, withLabel: false };
    var pts = [P, O, Q].map(function (X) { return board.create('point', X, an); });
    board.create('nonreflexangle', pts, { radius: r, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.3, fixed: true, highlight: false });
  }
  // Tam giác ABC biết số đo ba góc (độ); nhan: { A: '50°', B: '?', … }
  function hinhTamGiac(gA, gB, gC, nhan) {
    var a = 6, c = a * Math.sin(gC * RAD) / Math.sin(gA * RAD);
    var D = { A: [c * Math.cos(gB * RAD), c * Math.sin(gB * RAD)], B: [0, 0], C: [a, 0] };
    return TOAN8.hinhGeo({ diem: D, to: ['A', 'B', 'C'], canh: [['A', 'B'], ['B', 'C'], ['C', 'A']],
      goc: [['C', 'B', 'A', { mau: nhan.B === '?' ? XANH : CAM }], ['A', 'C', 'B', { mau: nhan.C === '?' ? XANH : CAM }], ['B', 'A', 'C', { mau: nhan.A === '?' ? XANH : CAM }]],
      them: function (board, G) {
        [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']].forEach(function (t) {
          var p = viTriNhan(D[t[1]], D[t[0]], D[t[2]], 1.25);
          G.label(p[0], p[1], nhan[t[0]], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: nhan[t[0]] === '?' ? XANH : CAM });
        });
      } });
  }
  // a ∥ b (a ở trên), c cắt a tại A, cắt b tại B; góc cho tại A (giữa tia sang phải của a và tia AB) bằng alpha.
  // loai: 'soLe' | 'dongVi' | 'trongCungPhia' – góc hỏi tại B.
  function hinhSongSong(alpha, loai) {
    var phi = (180 - alpha) * RAD, cx = Math.cos(phi), sy = Math.sin(phi);
    var B = [0, 0], A = [3 * cx / sy, 3];
    var x1 = Math.min(0, A[0]) - 3, x2 = Math.max(0, A[0]) + 3;
    var RA = [A[0] + 2, 3], RB = [2, 0], LB = [-2, 0], DB = [-1.6 * cx, -1.6 * sy], UA = [A[0] + 1.6 * cx, 3 + 1.6 * sy];
    var hoi = loai === 'soLe' ? [LB, B, A] : loai === 'dongVi' ? [RB, B, DB] : [RB, B, A];
    return TOAN8.hinhGeo({ diem: { A: A, B: B }, // tên đỉnh đặt vào góc phần tư không có đường c và không có cung tô màu
      lechTen: alpha < 90 ? { A: [14, 14], B: [-14, -14] } : { A: [-14, 14], B: loai === 'soLe' ? [14, -14] : [-14, 14] },
      ve: [[[x1, 3], [x2, 3], { mau: '#343a40' }], [[x1, 0], [x2, 0], { mau: '#343a40' }], [DB, UA, { mau: '#495057' }]],
      them: function (board, G) {
        cung(board, RA, A, B, CAM, 0.7);
        cung(board, hoi[0], hoi[1], hoi[2], XANH, 0.7);
        var p = viTriNhan(RA, A, B, 1.2), q = viTriNhan(hoi[0], hoi[1], hoi[2], 1.2);
        G.label(p[0], p[1], alpha + '°', { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: CAM });
        G.label(q[0], q[1], '?', { anchorX: 'middle', anchorY: 'middle', fontSize: 17, strokeColor: XANH });
        G.label(x2 - 0.3, 3.35, 'a', { fontSize: 17 });
        G.label(x2 - 0.3, 0.35, 'b', { fontSize: 17 });
        G.label(UA[0] + 0.25, UA[1], 'c', { fontSize: 17 });
      } });
  }

  TOAN8.nen({
    id: 'gocSongSong', ten: 'Góc, hai đường thẳng song song, tổng ba góc của tam giác', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Góc kề bù, góc đối đỉnh',
        noiDung: 'Hai góc **kề bù** (chung một cạnh, hai cạnh còn lại là hai tia đối nhau) có tổng bằng $180^\\circ$.\n\nHai góc **đối đỉnh** (mỗi cạnh góc này là tia đối của một cạnh góc kia) thì **bằng nhau**.\n\nTia phân giác của một góc chia góc đó thành hai góc bằng nhau.' },
      { loai: 'dinhLi', tieuDe: 'Hai đường thẳng song song',
        noiDung: 'Nếu đường thẳng $c$ cắt hai đường thẳng **song song** $a$ và $b$ thì:\n\n• hai góc **so le trong** bằng nhau;\n\n• hai góc **đồng vị** bằng nhau;\n\n• hai góc **trong cùng phía** bù nhau (tổng $180^\\circ$).\n\nNgược lại, nếu có một cặp góc so le trong (hoặc đồng vị) bằng nhau thì $a \\parallel b$. **Tiên đề Euclid:** qua một điểm ở ngoài một đường thẳng chỉ có **một** đường thẳng song song với đường thẳng đó.' },
      { loai: 'dinhLi', tieuDe: 'Tổng ba góc của một tam giác',
        noiDung: '$\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ$.\n\nTam giác vuông: hai góc nhọn **phụ nhau** (tổng $90^\\circ$).\n\nGóc ngoài của tam giác bằng **tổng hai góc trong không kề** với nó.' },
      { loai: 'chuY', noiDung: 'Muốn tính một góc, em tìm xem nó có quan hệ gì với góc đã biết: kề bù ($180^\\circ - $), đối đỉnh (bằng), so le trong / đồng vị (bằng), trong cùng phía ($180^\\circ - $), hay nằm trong một tam giác (tổng $180^\\circ$).' }
    ],
    viDu: [
      { de: 'Tam giác $ABC$ có $\\widehat{A} = 70^\\circ$, $\\widehat{B} = 45^\\circ$. Tính $\\widehat{C}$.', buoc: [
        { lam: '$\\widehat{C} = 180^\\circ - \\widehat{A} - \\widehat{B}$', vi: 'Tổng ba góc của một tam giác bằng $180^\\circ$.' },
        { lam: '$\\widehat{C} = 180^\\circ - 70^\\circ - 45^\\circ = 65^\\circ$', vi: 'Thay số rồi tính.' }] },
      { de: 'Cho $a \\parallel b$, đường thẳng $c$ cắt $a$ tại $A$, cắt $b$ tại $B$. Một góc tại $A$ bằng $120^\\circ$. Tính góc tại $B$ trong cùng phía với nó.', buoc: [
        { lam: 'Hai góc trong cùng phía bù nhau.', vi: 'Vì $a \\parallel b$.' },
        { lam: 'Góc cần tìm $= 180^\\circ - 120^\\circ = 60^\\circ$', vi: 'Hai góc bù nhau có tổng $180^\\circ$.' }] }
    ],
    luyen: [
      { ten: 'Góc kề bù, góc đối đỉnh', muc: 1, sinh: function (r) {
        var a = 5 * r.so(4, 32); while (a === 90) a = 5 * r.so(4, 32);
        var keBu = r.dau() > 0, kq = keBu ? 180 - a : a;
        return {
          de: 'Hai đường thẳng $xx\'$ và $yy\'$ cắt nhau tại $O$, biết $\\widehat{xOy} = ' + a + '^\\circ$. Tính số đo góc $' + (keBu ? 'x\'Oy' : 'x\'Oy\'') + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Xét xem $\\widehat{' + (keBu ? 'x\'Oy' : 'x\'Oy\'') + '}$ và $\\widehat{xOy}$ là hai góc kề bù hay đối đỉnh.', keBu ? 'Hai góc kề bù có tổng $180^\\circ$.' : 'Hai góc đối đỉnh thì bằng nhau.'],
          loiGiai: keBu
            ? ['$\\widehat{x\'Oy}$ và $\\widehat{xOy}$ kề bù (vì $Ox$ và $Ox\'$ là hai tia đối nhau).', '$\\widehat{x\'Oy} = 180^\\circ - ' + a + '^\\circ = ' + kq + '^\\circ$']
            : ['$\\widehat{x\'Oy\'}$ và $\\widehat{xOy}$ là hai góc đối đỉnh nên bằng nhau.', '$\\widehat{x\'Oy\'} = \\widehat{xOy} = ' + kq + '^\\circ$'],
          loiThuongGap: [{ gt: keBu ? a : 180 - a, giaiThich: keBu ? 'Hai góc này **kề bù** (tổng $180^\\circ$), không phải đối đỉnh.' : 'Hai góc này **đối đỉnh** (bằng nhau), không phải kề bù.' }]
        };
      } },
      { ten: 'Tổng ba góc của tam giác', muc: 1, sinh: function (r) {
        var A = 5 * r.so(7, 20), B = 5 * r.so(7, (145 - A) / 5), C = 180 - A - B;
        var hoi = r.chon(['A', 'B', 'C']), g = { A: A, B: B, C: C }, biet = ['A', 'B', 'C'].filter(function (x) { return x !== hoi; });
        var nhan = {}; ['A', 'B', 'C'].forEach(function (x) { nhan[x] = x === hoi ? '?' : g[x] + '°'; });
        return {
          de: 'Tam giác $ABC$ có $\\widehat{' + biet[0] + '} = ' + g[biet[0]] + '^\\circ$, $\\widehat{' + biet[1] + '} = ' + g[biet[1]] + '^\\circ$. Tính $\\widehat{' + hoi + '}$.',
          hinh: hinhTamGiac(A, B, C, nhan),
          dapAn: { kieu: 'so', gt: g[hoi] },
          goiY: ['Tổng ba góc của một tam giác bằng $180^\\circ$.', '$\\widehat{' + hoi + '} = 180^\\circ - \\widehat{' + biet[0] + '} - \\widehat{' + biet[1] + '}$.'],
          loiGiai: ['$\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ$', '$\\widehat{' + hoi + '} = 180^\\circ - ' + g[biet[0]] + '^\\circ - ' + g[biet[1]] + '^\\circ = ' + g[hoi] + '^\\circ$']
        };
      } },
      { ten: 'Góc tạo bởi hai đường thẳng song song', muc: 2, sinh: function (r) {
        var a = 5 * r.so(8, 28); while (a === 90) a = 5 * r.so(8, 28);
        var loai = r.chon(['soLe', 'dongVi', 'trongCungPhia']), ten = { soLe: 'so le trong', dongVi: 'đồng vị', trongCungPhia: 'trong cùng phía' }[loai];
        var kq = loai === 'trongCungPhia' ? 180 - a : a;
        return {
          de: 'Trong hình, $a \\parallel b$; đường thẳng $c$ cắt $a$ tại $A$, cắt $b$ tại $B$. Góc tô cam tại $A$ bằng $' + a + '^\\circ$. Tính góc tô xanh tại $B$ (hai góc này là hai góc **' + ten + '**).',
          hinh: hinhSongSong(a, loai),
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Nhớ: $a \\parallel b$ thì so le trong bằng nhau, đồng vị bằng nhau, trong cùng phía bù nhau.', 'Hai góc này là hai góc ' + ten + '.'],
          loiGiai: [loai === 'trongCungPhia' ? 'Vì $a \\parallel b$ nên hai góc trong cùng phía bù nhau.' : 'Vì $a \\parallel b$ nên hai góc ' + ten + ' bằng nhau.',
            'Góc cần tìm $= ' + (loai === 'trongCungPhia' ? '180^\\circ - ' + a + '^\\circ = ' : '') + kq + '^\\circ$'],
          loiThuongGap: [{ gt: loai === 'trongCungPhia' ? a : 180 - a, giaiThich: loai === 'trongCungPhia' ? 'Hai góc trong cùng phía **bù nhau** (tổng $180^\\circ$), không bằng nhau.' : 'Hai góc ' + ten + ' **bằng nhau**, không phải bù nhau.' }]
        };
      } },
      { ten: 'Tam giác vuông, góc ngoài', muc: 2, sinh: function (r) {
        var vuong = r.dau() > 0;
        if (vuong) {
          var b = r.so(15, 75); while (b === 45) b = r.so(15, 75);
          return {
            de: 'Tam giác $ABC$ vuông tại $A$ có $\\widehat{B} = ' + b + '^\\circ$. Tính $\\widehat{C}$.',
            dapAn: { kieu: 'so', gt: 90 - b },
            goiY: ['Trong tam giác vuông, hai góc nhọn phụ nhau.', '$\\widehat{B} + \\widehat{C} = 90^\\circ$.'],
            loiGiai: ['$\\widehat{B} + \\widehat{C} = 90^\\circ$ (hai góc nhọn của tam giác vuông phụ nhau).', '$\\widehat{C} = 90^\\circ - ' + b + '^\\circ = ' + (90 - b) + '^\\circ$'],
            loiThuongGap: [{ gt: 180 - b, giaiThich: 'Em quên góc vuông $\\widehat{A} = 90^\\circ$: $\\widehat{C} = 180^\\circ - 90^\\circ - ' + b + '^\\circ$.' }]
          };
        }
        var A = 5 * r.so(6, 18), B = 5 * r.so(6, (150 - A) / 5); while (A + B === 90) B = 5 * r.so(6, (150 - A) / 5);
        return {
          de: 'Tam giác $ABC$ có $\\widehat{A} = ' + A + '^\\circ$, $\\widehat{B} = ' + B + '^\\circ$. Tính số đo góc ngoài của tam giác tại đỉnh $C$.',
          dapAn: { kieu: 'so', gt: A + B },
          goiY: ['Góc ngoài của tam giác bằng tổng hai góc trong không kề với nó.', 'Góc ngoài tại $C$ không kề với $\\widehat{A}$ và $\\widehat{B}$.'],
          loiGiai: ['Góc ngoài tại $C$ bằng tổng hai góc trong không kề: $\\widehat{A} + \\widehat{B}$.', 'Góc ngoài tại $C$ $= ' + A + '^\\circ + ' + B + '^\\circ = ' + (A + B) + '^\\circ$'],
          loiThuongGap: [{ gt: 180 - A - B, giaiThich: 'Đó là góc **trong** $\\widehat{C}$. Góc ngoài tại $C$ kề bù với $\\widehat{C}$.' }]
        };
      } },
      { ten: 'Tính góc nhiều bước', muc: 3, sinh: function (r) {
        if (r.dau() > 0) {
          var C = 5 * r.so(4, 14), d = 10 * r.so(1, 4), B = C + d, A = 180 - B - C;
          while (A < 20) { C = 5 * r.so(4, 14); B = C + d; A = 180 - B - C; }
          var hoiB = r.dau() > 0;
          return {
            de: 'Tam giác $ABC$ có $\\widehat{A} = ' + A + '^\\circ$ và $\\widehat{B} - \\widehat{C} = ' + d + '^\\circ$. Tính $\\widehat{' + (hoiB ? 'B' : 'C') + '}$.',
            dapAn: { kieu: 'so', gt: hoiB ? B : C },
            goiY: ['Từ tổng ba góc: $\\widehat{B} + \\widehat{C} = 180^\\circ - ' + A + '^\\circ = ' + (B + C) + '^\\circ$.', 'Biết tổng và hiệu: số lớn $= (\\text{tổng} + \\text{hiệu}) : 2$, số bé $= (\\text{tổng} - \\text{hiệu}) : 2$.'],
            loiGiai: ['$\\widehat{B} + \\widehat{C} = 180^\\circ - ' + A + '^\\circ = ' + (B + C) + '^\\circ$; $\\widehat{B} - \\widehat{C} = ' + d + '^\\circ$.',
              hoiB ? '$\\widehat{B} = (' + (B + C) + '^\\circ + ' + d + '^\\circ) : 2 = ' + B + '^\\circ$' : '$\\widehat{C} = (' + (B + C) + '^\\circ - ' + d + '^\\circ) : 2 = ' + C + '^\\circ$'],
            loiThuongGap: [{ gt: hoiB ? C : B, giaiThich: hoiB ? 'Đó là $\\widehat{C}$ (góc bé). $\\widehat{B}$ lớn hơn $\\widehat{C}$ là $' + d + '^\\circ$.' : 'Đó là $\\widehat{B}$ (góc lớn). $\\widehat{C}$ bé hơn $\\widehat{B}$ là $' + d + '^\\circ$.' }]
          };
        }
        var ts = r.chon([[1, 2, 3], [2, 3, 4], [1, 1, 2], [3, 4, 5], [1, 2, 2], [2, 3, 5], [1, 3, 5], [4, 5, 6], [1, 4, 5], [2, 2, 5]]);
        var tong = ts[0] + ts[1] + ts[2], k = 180 / tong, lon = ts[2] * k;
        return {
          de: 'Ba góc $\\widehat{A}$, $\\widehat{B}$, $\\widehat{C}$ của tam giác $ABC$ tỉ lệ với $' + ts.join('$; $') + '$. Tính số đo góc lớn nhất của tam giác.',
          dapAn: { kieu: 'so', gt: lon },
          goiY: ['$\\frac{\\widehat{A}}{' + ts[0] + '} = \\frac{\\widehat{B}}{' + ts[1] + '} = \\frac{\\widehat{C}}{' + ts[2] + '}$ và tổng ba góc bằng $180^\\circ$.', 'Dùng dãy tỉ số bằng nhau: mỗi tỉ số bằng $\\frac{180^\\circ}{' + tong + '}$.'],
          loiGiai: ['$\\frac{\\widehat{A}}{' + ts[0] + '} = \\frac{\\widehat{B}}{' + ts[1] + '} = \\frac{\\widehat{C}}{' + ts[2] + '} = \\frac{180^\\circ}{' + tong + '} = ' + k + '^\\circ$',
            'Góc lớn nhất là $\\widehat{C} = ' + ts[2] + ' \\cdot ' + k + '^\\circ = ' + lon + '^\\circ$'],
          loiThuongGap: [{ gt: k, giaiThich: '$' + k + '^\\circ$ mới là giá trị của mỗi tỉ số. Góc lớn nhất $= ' + ts[2] + ' \\cdot ' + k + '^\\circ$.' }]
        };
      } }
    ]
  });
})();
