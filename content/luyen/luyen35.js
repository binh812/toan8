// Luyện thêm – Bài 35: Định lí Pythagore và ứng dụng
(function () {
  'use strict';
  var TIM = '#9c36b5', XANH = '#1971c2';
  var geo = TOAN8.hinhGeo;
  var BO3 = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 12, 15], [6, 8, 10], [12, 16, 20]];
  var TEN = [['A', 'B', 'C'], ['D', 'E', 'F'], ['M', 'N', 'P'], ['H', 'I', 'K']];
  function nh(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }
  function chinhPhuong(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  // Tam giác vuông tại T[0]: cạnh T[0]T[1] thẳng đứng dài dung, cạnh T[0]T[2] nằm ngang dài ngang.
  function vuong(T, ngang, dung, nhan) {
    var d = {}; d[T[0]] = [0, 0]; d[T[1]] = [0, dung]; d[T[2]] = [ngang, 0];
    return geo({ diem: d, to: T, canh: [[T[0], T[1]], [T[0], T[2]], [T[1], T[2], { mau: TIM }]],
      goc: [[T[1], T[0], T[2], { mau: '#495057', r: 0.09 * Math.max(ngang, dung) }]], nhan: nhan });
  }
  function boBa(r) {
    var b = r.chon(BO3), k = b[2] <= 13 ? r.chon([1, 1, 2, 3, 0.5]) : (b[2] <= 20 ? r.chon([1, 2]) : 1);
    var x = b.map(function (v) { return v * k; });
    return r.dau() > 0 ? x : [x[1], x[0], x[2]];
  }

  TOAN8.luyen(35, [
    { ten: 'Tính cạnh huyền', muc: 1, sinh: function (r, cc) {
      var T = r.chon(TEN), x = boBa(r), a = x[0], b = x[1], c = x[2];
      var ten1 = T[0] + T[1], ten2 = T[0] + T[2], huyen = T[1] + T[2];
      return {
        de: 'Tam giác $' + T.join('') + '$ vuông tại $' + T[0] + '$ có $' + ten1 + ' = ' + cc.so(a) + '$ cm, $' + ten2 + ' = ' + cc.so(b) + '$ cm. Tính $x = ' + huyen + '$ (cm).',
        hinh: vuong(T, b, a, [[T[0], T[1], nh(a)], [T[0], T[2], nh(b)], [T[1], T[2], 'x', false, 1, TIM]]),
        dapAn: { kieu: 'so', gt: c },
        goiY: ['$' + huyen + '$ là cạnh huyền (đối diện góc vuông $' + T[0] + '$): $' + huyen + '^2 = ' + ten1 + '^2 + ' + ten2 + '^2$.', 'Tính tổng hai bình phương rồi **lấy căn**.'],
        loiGiai: ['$' + huyen + '^2 = ' + cc.so(a) + '^2 + ' + cc.so(b) + '^2 = ' + cc.so(a * a) + ' + ' + cc.so(b * b) + ' = ' + cc.so(c * c) + '$.',
          '$x = \\sqrt{' + cc.so(c * c) + '} = ' + cc.so(c) + '$'],
        loiThuongGap: [{ gt: a + b, giaiThich: 'Em cộng hai cạnh. Định lí Pythagore cộng các **bình phương**: $' + huyen + '^2 = ' + ten1 + '^2 + ' + ten2 + '^2$.' },
          { gt: c * c, giaiThich: 'Đó là $' + huyen + '^2$. Em nhớ lấy căn bậc hai để ra độ dài.' }]
      };
    } },
    { ten: 'Tính cạnh góc vuông', muc: 1, sinh: function (r, cc) {
      var T = r.chon(TEN), x = boBa(r), a = x[0], b = x[1], c = x[2];
      var ten1 = T[0] + T[1], ten2 = T[0] + T[2], huyen = T[1] + T[2];
      return {
        de: 'Tam giác $' + T.join('') + '$ vuông tại $' + T[0] + '$ có cạnh huyền $' + huyen + ' = ' + cc.so(c) + '$ và $' + ten1 + ' = ' + cc.so(a) + '$. Tính $x = ' + ten2 + '$.',
        hinh: vuong(T, b, a, [[T[0], T[1], nh(a)], [T[0], T[2], 'x'], [T[1], T[2], nh(c), false, 1, TIM]]),
        dapAn: { kieu: 'so', gt: b },
        goiY: ['Tính cạnh góc vuông thì **trừ**: $' + ten2 + '^2 = ' + huyen + '^2 - ' + ten1 + '^2$.', 'Tính hiệu rồi lấy căn.'],
        loiGiai: ['$' + ten2 + '^2 = ' + cc.so(c) + '^2 - ' + cc.so(a) + '^2 = ' + cc.so(c * c) + ' - ' + cc.so(a * a) + ' = ' + cc.so(b * b) + '$.',
          '$x = \\sqrt{' + cc.so(b * b) + '} = ' + cc.so(b) + '$'],
        loiThuongGap: [{ gt: c - a, giaiThich: 'Em trừ hai độ dài. Phải trừ hai **bình phương** rồi lấy căn.' }]
      };
    } },
    { ten: 'Kết quả dạng căn', muc: 2, sinh: function (r, cc) {
      var T = r.chon(TEN), a, b, n, hoiHuyen = r.dau() > 0;
      do { a = r.so(1, 9); b = r.so(2, 9); n = hoiHuyen ? a * a + b * b : b * b - a * a; }
      // hai cạnh góc vuông không chênh quá 4 lần để hình không quá dẹt, nhãn không đè nhau
      while (n <= 1 || chinhPhuong(n) || (hoiHuyen ? Math.max(a, b) > 4 * Math.min(a, b) : Math.max(a * a, n) > 16 * Math.min(a * a, n)));
      var ten1 = T[0] + T[1], ten2 = T[0] + T[2], huyen = T[1] + T[2], kq = Math.sqrt(n), lam = cc.so(Math.round(kq * 100) / 100);
      var de, lg, hinh, ltg;
      if (hoiHuyen) {
        de = 'Tam giác $' + T.join('') + '$ vuông tại $' + T[0] + '$ có $' + ten1 + ' = ' + a + '$, $' + ten2 + ' = ' + b + '$. Tính $x = ' + huyen + '$';
        lg = ['$' + huyen + '^2 = ' + a + '^2 + ' + b + '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + n + '$.'];
        hinh = vuong(T, b, a, [[T[0], T[1], String(a)], [T[0], T[2], String(b)], [T[1], T[2], 'x', false, 1, TIM]]);
        ltg = [{ gt: a + b, giaiThich: 'Em cộng hai cạnh. Phải cộng hai **bình phương** rồi lấy căn.' }];
      } else {
        var h = Math.sqrt(n);
        de = 'Tam giác $' + T.join('') + '$ vuông tại $' + T[0] + '$ có cạnh huyền $' + huyen + ' = ' + b + '$ và $' + ten1 + ' = ' + a + '$. Tính $x = ' + ten2 + '$';
        lg = ['$' + ten2 + '^2 = ' + b + '^2 - ' + a + '^2 = ' + (b * b) + ' - ' + (a * a) + ' = ' + n + '$.'];
        hinh = vuong(T, h, a, [[T[0], T[1], String(a)], [T[0], T[2], 'x'], [T[1], T[2], String(b), false, 1, TIM]]);
        ltg = [{ gt: Math.sqrt(a * a + b * b), giaiThich: '$' + huyen + '$ là cạnh huyền nên phải **trừ**: $' + ten2 + '^2 = ' + huyen + '^2 - ' + ten1 + '^2$.' }];
      }
      return {
        de: de + ' (viết dạng căn như $\\sqrt{7}$, hoặc số thập phân làm tròn đến hàng phần trăm).',
        hinh: hinh,
        dapAn: { kieu: 'so', gt: 'sqrt(' + n + ')', saiSo: 0.006 },
        goiY: [hoiHuyen ? 'Cạnh huyền: $' + huyen + '^2 = ' + ten1 + '^2 + ' + ten2 + '^2$.' : 'Cạnh góc vuông: $' + ten2 + '^2 = ' + huyen + '^2 - ' + ten1 + '^2$.',
          'Số dưới căn không phải số chính phương thì để kết quả dạng $\\sqrt{\\ }$ (gõ sqrt(…) hoặc √…), hoặc bấm máy rồi làm tròn.'],
        loiGiai: lg.concat(['$x = \\sqrt{' + n + '} \\approx ' + lam + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Pythagore đảo: có phải tam giác vuông?', muc: 1, sinh: function (r, cc) {
      var x = boBa(r).slice().sort(function (p, q) { return p - q; }), vuongDung = r.dau() > 0;
      if (!vuongDung) {
        var lech = r.chon([-1, 1]);
        if (x[0] + x[1] <= x[2] + lech) lech = -1; // tránh ba số không tạo thành tam giác (vd 1,5; 2; 3,5)
        x = [x[0], x[1], x[2] + lech];
      }
      var c3 = x.slice().sort(function (p, q) { return p - q; }), dung = Math.abs(c3[0] * c3[0] + c3[1] * c3[1] - c3[2] * c3[2]) < 1e-9;
      var hien = r.xaoTron(x), tong = c3[0] * c3[0] + c3[1] * c3[1];
      return {
        de: 'Một tam giác có ba cạnh dài $' + hien.map(cc.so).join('$ cm, $') + '$ cm. Khẳng định "tam giác này là tam giác vuông" đúng hay sai?',
        // Hình vẽ đúng tam giác có ba cạnh đó, hình vuông trên mỗi cạnh ghi diện tích; không ghi sẵn kết luận
        hinhGiai: { widget: 'canh', config: { ten: 'vuongDao', tuyChon: { canh: x }, chiXem: true, t: 1,
          moTa: 'Tam giác có ba cạnh như đề, trên mỗi cạnh dựng một hình vuông; số trong hình vuông là diện tích.',
          ghiChu: 'Số trong mỗi hình vuông là diện tích. So hình vuông lớn nhất với tổng hai hình kia.' } },
        dapAn: { kieu: 'dungSai', gt: dung },
        goiY: ['Dùng định lí Pythagore đảo: so sánh bình phương cạnh **lớn nhất** với tổng bình phương hai cạnh còn lại.', 'Cạnh lớn nhất là $' + cc.so(c3[2]) + '$.'],
        loiGiai: ['$' + cc.so(c3[2]) + '^2 = ' + cc.so(c3[2] * c3[2]) + '$; $' + cc.so(c3[0]) + '^2 + ' + cc.so(c3[1]) + '^2 = ' + cc.so(c3[0] * c3[0]) + ' + ' + cc.so(c3[1] * c3[1]) + ' = ' + cc.so(tong) + '$.',
          dung ? 'Hai số bằng nhau nên tam giác **vuông** (góc vuông đối diện cạnh $' + cc.so(c3[2]) + '$). Khẳng định **đúng**.' : 'Hai số khác nhau nên tam giác **không** vuông. Khẳng định **sai**.']
      };
    } },
    { ten: 'Tam giác cân, hình chữ nhật', muc: 2, sinh: function (r, cc) {
      var b = r.chon(BO3.slice(0, 6)), k = r.chon([1, 2]), p = b[0] * k, q = b[1] * k, c = b[2] * k;
      if (r.dau() > 0) {
        // tam giác cân ABC đỉnh A: nửa đáy p, đường cao q, cạnh bên c
        return {
          de: 'Tam giác $ABC$ cân tại $A$ có đường cao $AH = ' + q + '$ cm và cạnh đáy $BC = ' + 2 * p + '$ cm. Tính cạnh bên $x = AB$ (cm).',
          hinh: geo({ diem: { A: [p, q], B: [0, 0], C: [2 * p, 0], H: [p, 0] }, to: ['A', 'B', 'C'],
            canh: [['A', 'B', { vach: 1 }], ['A', 'C', { vach: 1 }], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
            goc: [['A', 'H', 'C', { mau: '#495057', r: 0.08 * Math.max(p, q) }]],
            nhan: [['A', 'H', String(q), true, 0.7, TIM], ['B', 'C', String(2 * p), false, 1.9], ['A', 'B', 'x']], lechTen: { H: [-12, 14] } }),
          dapAn: { kieu: 'so', gt: c },
          goiY: ['Trong tam giác cân, đường cao $AH$ cũng là trung tuyến: $BH = \\frac{BC}{2}$.', 'Áp dụng Pythagore cho tam giác $ABH$ vuông tại $H$.'],
          loiGiai: ['$BH = ' + 2 * p + ' : 2 = ' + p + '$ (cm).', '$AB^2 = AH^2 + BH^2 = ' + q * q + ' + ' + p * p + ' = ' + c * c + '$.', '$x = \\sqrt{' + c * c + '} = ' + c + '$'],
          loiThuongGap: [{ gt: Math.sqrt(q * q + 4 * p * p), giaiThich: 'Em dùng cả cạnh đáy $BC$. Tam giác vuông là $ABH$ với $BH$ chỉ bằng **nửa** đáy.' }]
        };
      }
      var vat = r.chon(['Một hình chữ nhật', 'Một mảnh vườn hình chữ nhật', 'Một tấm kính hình chữ nhật']), dv = vat === 'Một mảnh vườn hình chữ nhật' ? 'm' : 'cm';
      return {
        de: vat + ' có chiều rộng $' + p + '$ ' + dv + ' và đường chéo $' + c + '$ ' + dv + '. Tính diện tích của nó (' + dv + '²).',
        hinh: geo({ diem: { A: [0, p], B: [q, p], C: [q, 0], D: [0, 0] }, to: ['A', 'B', 'C', 'D'],
          canh: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C', { mau: TIM, net: 2 }]],
          goc: [['A', 'D', 'C', { mau: '#495057', r: 0.07 * q }]],
          nhan: [['D', 'A', p + ' ' + dv], ['A', 'C', c + ' ' + dv, true, 1, TIM], ['D', 'C', '?']] }),
        dapAn: { kieu: 'so', gt: p * q },
        goiY: ['Đường chéo chia hình chữ nhật thành hai tam giác vuông. Tính chiều dài bằng Pythagore.', 'Chiều dài$^2$ = đường chéo$^2$ − chiều rộng$^2$; rồi diện tích = dài × rộng.'],
        loiGiai: ['Chiều dài: $\\sqrt{' + c + '^2 - ' + p + '^2} = \\sqrt{' + (c * c - p * p) + '} = ' + q + '$ (' + dv + ').',
          'Diện tích $= ' + q + ' \\cdot ' + p + ' = ' + p * q + '$'],
        loiThuongGap: [{ gt: p * c, giaiThich: 'Em nhân chiều rộng với **đường chéo**. Phải tính chiều dài trước (Pythagore).' }]
      };
    } },
    { ten: 'Bài toán thực tế', muc: 3, sinh: function (r, cc) {
      var loai = r.so(0, 2);
      if (loai === 0) {
        var t = r.chon([[2.5, 6, 6.5], [1.5, 2, 2.5], [1.2, 3.5, 3.7], [0.7, 2.4, 2.5], [1.5, 3.6, 3.9], [1.8, 2.4, 3]]);
        return {
          de: 'Một chiếc thang dài $' + cc.so(t[2]) + '$ m dựa vào bức tường thẳng đứng, chân thang cách chân tường $' + cc.so(t[0]) + '$ m. Đầu thang chạm tường ở độ cao $h$ bằng bao nhiêu mét?',
          hinh: geo({ diem: { A: [0, 0], B: [0, t[1]], C: [t[0], 0] },
            ve: [[[0, -0.03 * t[1]], [0, 1.12 * t[1]], { mau: '#868e96', day: 6 }], [[-0.3 * t[1], 0], [t[0] + 0.3 * t[1], 0], { mau: '#868e96', day: 3 }], [[0, -0.2 * t[1]], [0.01, -0.2 * t[1]], { mau: '#ffffff', day: 0 }]],
            canh: [['B', 'C', { mau: '#7f4f24', day: 5 }]], goc: [['B', 'A', 'C', { mau: '#495057', r: 0.08 * t[1] }]],
            nhan: [['B', 'C', nh(t[2]) + ' m', false, 1.4], ['A', 'C', nh(t[0]) + ' m', false, 3], ['A', 'B', 'h', false, 1.3]], lechTen: { A: [-14, -10], C: [12, -12] }, ghiChu: 'Tường thẳng đứng, thang BC' }),
          dapAn: { kieu: 'so', gt: t[1] },
          goiY: ['Tường, mặt đất và thang tạo thành tam giác vuông tại chân tường; thang là **cạnh huyền**.', '$h^2 = $ (dài thang)$^2 - $ (khoảng cách chân thang)$^2$.'],
          loiGiai: ['$h^2 = ' + cc.so(t[2]) + '^2 - ' + cc.so(t[0]) + '^2 = ' + cc.so(t[2] * t[2]) + ' - ' + cc.so(t[0] * t[0]) + ' = ' + cc.so(t[1] * t[1]) + '$.', '$h = ' + cc.so(t[1]) + '$'],
          loiThuongGap: [{ gt: Math.sqrt(t[2] * t[2] + t[0] * t[0]), giaiThich: 'Thang là cạnh huyền nên phải **trừ** hai bình phương, không cộng.' }]
        };
      }
      if (loai === 1) {
        var b3 = r.chon([[3, 4, 5], [6, 8, 10], [4, 3, 5], [8, 6, 10], [12, 9, 15], [9, 12, 15]]), di = r.so(1, Math.max(1, b3[0] - 2)), ve = b3[0] - di;
        var ten = r.chon(['Một xe taxi', 'Bạn Minh đạp xe', 'Một chiếc xe máy']);
        return {
          de: ten + ' xuất phát từ $A$, đi thẳng $' + di + '$ km về phía bắc đến $B$, rẽ sang phía đông đi $' + b3[1] + '$ km đến $C$, rồi rẽ về phía bắc đi tiếp $' + ve + '$ km đến $D$. Tính khoảng cách (đường chim bay) $AD$ (km).',
          hinh: geo({ diem: { A: [0, 0], B: [0, di], C: [b3[1], di], D: [b3[1], b3[0]] },
            canh: [['A', 'B', { mau: XANH }], ['B', 'C', { mau: XANH }], ['C', 'D', { mau: XANH }], ['A', 'D', { mau: '#d9480f', net: 2 }]],
            nhan: [['A', 'B', di + ' km'], ['B', 'C', b3[1] + ' km', true], ['C', 'D', ve + ' km']], lechTen: { A: [0, -18], B: [-14, 10], C: [14, -12], D: [0, 18] } }),
          dapAn: { kieu: 'so', gt: b3[2] },
          goiY: ['Từ $A$ đến $D$ em đi về phía bắc tổng cộng $' + di + ' + ' + ve + '$ km và về phía đông $' + b3[1] + '$ km.', 'Hai quãng này vuông góc: $AD$ là cạnh huyền của tam giác vuông có hai cạnh góc vuông đó.'],
          loiGiai: ['Đi về phía bắc tổng cộng $' + di + ' + ' + ve + ' = ' + b3[0] + '$ km, về phía đông $' + b3[1] + '$ km.',
            '$AD^2 = ' + b3[0] + '^2 + ' + b3[1] + '^2 = ' + (b3[0] * b3[0] + b3[1] * b3[1]) + '$.', '$AD = ' + b3[2] + '$'],
          loiThuongGap: [{ gt: b3[0] + b3[1], giaiThich: 'Đó là quãng đường xe đã đi, không phải khoảng cách đường chim bay $AD$.' }]
        };
      }
      var inch = r.chon([40, 50, 55, 65, 75]);
      // tivi tỉ lệ 4:3, đường chéo 5 phần (dùng đơn vị inch)
      var p = inch / 5;
      return {
        de: 'Màn hình tivi có tỉ lệ chiều ngang : chiều cao $= 4 : 3$ và đường chéo $' + inch + '$ inch. Tính chiều ngang của màn hình (inch).',
        dapAn: { kieu: 'so', gt: 4 * p },
        goiY: ['Đặt chiều ngang $4t$, chiều cao $3t$. Theo Pythagore, đường chéo bằng $\\sqrt{(4t)^2 + (3t)^2}$.', '$\\sqrt{16t^2 + 9t^2} = 5t$. Từ $5t = ' + inch + '$ tìm $t$.'],
        loiGiai: ['Đường chéo $= \\sqrt{16t^2 + 9t^2} = \\sqrt{25t^2} = 5t$, nên $5t = ' + inch + '$, $t = ' + cc.so(p) + '$.', 'Chiều ngang $= 4 \\cdot ' + cc.so(p) + ' = ' + cc.so(4 * p) + '$'],
        loiThuongGap: [{ gt: inch * 4 / 7, giaiThich: 'Em chia đường chéo theo tỉ lệ $4 : 3$ như chia tổng. Đường chéo **không** bằng ngang + cao; dùng Pythagore: đường chéo $= 5t$.' }]
      };
    } }
  ]);
})();
