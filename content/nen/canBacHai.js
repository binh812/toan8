// Bài nền (lớp 7): Căn bậc hai số học, số vô tỉ, làm tròn số – cần cho Chương IX (Pythagore), X (hình chóp).
(function () {
  'use strict';
  function so(x) { return String(x).replace('.', '{,}'); }
  var BA_SO = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]];

  TOAN8.nen({
    id: 'canBacHai', ten: 'Căn bậc hai số học và làm tròn số', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Căn bậc hai số học',
        noiDung: 'Căn bậc hai số học của số $a \\ge 0$ là số $x \\ge 0$ sao cho $x^2 = a$, kí hiệu $\\sqrt{a}$.\n\nVí dụ: $\\sqrt{49} = 7$ vì $7 \\ge 0$ và $7^2 = 49$; $\\sqrt{0{,}25} = 0{,}5$; $\\sqrt{\\frac{4}{9}} = \\frac{2}{3}$.\n\nSố âm **không có** căn bậc hai. Với $a \\ge 0$: $(\\sqrt{a})^2 = a$.' },
      { loai: 'dinhNghia', tieuDe: 'Số vô tỉ',
        noiDung: 'Nhiều căn bậc hai không phải số hữu tỉ, ví dụ $\\sqrt{2} = 1{,}41421356\\ldots$ là số thập phân **vô hạn không tuần hoàn** – gọi là **số vô tỉ**. Dùng máy tính cầm tay (phím $\\sqrt{\\ }$) để tính gần đúng.\n\nƯớc lượng: $\\sqrt{20}$ nằm giữa $4$ và $5$ vì $16 < 20 < 25$.' },
      { loai: 'dinhLi', tieuDe: 'Làm tròn số',
        noiDung: 'Xét **chữ số đầu tiên bị bỏ đi**:\n\n• nếu nhỏ hơn $5$: giữ nguyên chữ số cuối cùng được giữ lại;\n\n• nếu lớn hơn hoặc bằng $5$: **cộng thêm $1$** vào chữ số cuối cùng được giữ lại.\n\nVí dụ: $3{,}1416 \\approx 3{,}14$ (hàng phần trăm); $2{,}236 \\approx 2{,}24$; $7{,}45 \\approx 7{,}5$ (hàng phần mười).' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** $\\sqrt{9 + 16} = \\sqrt{25} = 5$, **không** bằng $\\sqrt{9} + \\sqrt{16} = 7$. Phải tính trong căn trước.' }
    ],
    viDu: [
      { de: 'Tính $\\sqrt{3^2 + 4^2}$.', buoc: [
        { lam: '$3^2 + 4^2 = 9 + 16 = 25$', vi: 'Tính biểu thức trong căn trước.' },
        { lam: '$\\sqrt{25} = 5$', vi: 'Vì $5 \\ge 0$ và $5^2 = 25$.' }] },
      { de: 'Tính $\\sqrt{5}$ rồi làm tròn đến hàng phần trăm.', buoc: [
        { lam: '$\\sqrt{5} = 2{,}2360679\\ldots$', vi: 'Bấm máy tính. (Ước lượng: $4 < 5 < 9$ nên $2 < \\sqrt{5} < 3$.)' },
        { lam: '$\\sqrt{5} \\approx 2{,}24$', vi: 'Chữ số đầu bị bỏ là $6 \\ge 5$ nên cộng $1$ vào chữ số hàng phần trăm.' }] }
    ],
    luyen: [
      { ten: 'Căn bậc hai số học', muc: 1, sinh: function (r, cc) {
        var loai = r.chon([0, 0, 1, 2]), de, kq, lg, ltg = [];
        if (loai === 0) {
          var k = r.so(2, 20), n = k * k; kq = String(k);
          de = '\\sqrt{' + n + '}'; lg = ['$' + k + ' \\ge 0$ và $' + k + '^2 = ' + n + '$', '$\\sqrt{' + n + '} = ' + k + '$'];
          if (n % 2 === 0 && n / 2 !== k) ltg.push({ gt: String(n / 2), giaiThich: 'Căn bậc hai không phải chia đôi: cần số $x \\ge 0$ có $x^2 = ' + n + '$.' });
        } else if (loai === 1) {
          var p = r.so(1, 9), q = r.so(2, 12); while (cc.ucln(p, q) !== 1 || p === q) { p = r.so(1, 9); q = r.so(2, 12); }
          var f = cc.phanSo(p, q); kq = f.ascii;
          de = '\\sqrt{\\frac{' + p * p + '}{' + q * q + '}}'; lg = ['$\\left(' + f.tex + '\\right)^2 = \\frac{' + p * p + '}{' + q * q + '}$ và $' + f.tex + ' \\ge 0$', '$' + de + ' = ' + f.tex + '$'];
        } else {
          var t = r.so(2, 19); while (t % 10 === 0) t = r.so(2, 19);
          var a = t * t / 100, b = t / 10; kq = String(b);
          de = '\\sqrt{' + so(a) + '}'; lg = ['$(' + so(b) + ')^2 = ' + so(a) + '$ và $' + so(b) + ' \\ge 0$', '$\\sqrt{' + so(a) + '} = ' + so(b) + '$'];
          if (Math.abs(a / 2 - b) > 1e-9) ltg.push({ gt: String(a / 2), giaiThich: 'Căn bậc hai không phải chia đôi: cần số $x \\ge 0$ có $x^2 = ' + so(a) + '$.' });
        }
        return {
          de: 'Tính $' + de + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['$\\sqrt{a}$ là số **không âm** mà bình phương lên bằng $a$.', loai === 2 ? 'Nhẩm: số thập phân nào bình phương lên bằng $' + so(loai === 2 ? a : 0) + '$? (Bình phương số có một chữ số sau dấu phẩy thì được hai chữ số sau dấu phẩy.)' : 'Thử bình phương các số tự nhiên nhỏ.'],
          loiGiai: lg, loiThuongGap: ltg
        };
      } },
      { ten: 'Làm tròn số thập phân', muc: 2, sinh: function (r) {
        var N = r.so(10000, 999999); while (N % 10 === 0) N = r.so(10000, 999999);
        var x = N / 10000, d = r.chon([0, 1, 2]), b = Math.pow(10, 4 - d);
        var giu = Math.round(N / b), kq = giu / Math.pow(10, d), cat = Math.floor(N / b) / Math.pow(10, d);
        var chuSoBo = Math.floor(N / Math.pow(10, 3 - d)) % 10, ten = ['hàng đơn vị', 'hàng phần mười', 'hàng phần trăm'][d];
        var ltg = Math.abs(cat - kq) > 1e-9 ? [{ gt: cat, giaiThich: 'Chữ số đầu tiên bị bỏ đi là $' + chuSoBo + ' \\ge 5$ nên phải **cộng thêm $1$** vào chữ số cuối được giữ lại.' }] : [];
        return {
          de: 'Làm tròn số $' + so(x) + '$ đến ' + ten + '.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Giữ lại các chữ số đến ' + ten + ', xét chữ số đầu tiên bị bỏ đi.', 'Chữ số đầu tiên bị bỏ đi là $' + chuSoBo + '$.'],
          loiGiai: ['Chữ số đầu tiên bị bỏ đi là $' + chuSoBo + (chuSoBo >= 5 ? ' \\ge 5$ nên cộng thêm $1$ vào chữ số cuối được giữ lại.' : ' < 5$ nên giữ nguyên chữ số cuối được giữ lại.'), '$' + so(x) + ' \\approx ' + so(kq) + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Ước lượng và tính gần đúng căn bậc hai', muc: 2, sinh: function (r) {
        var n = r.so(2, 99); while (Math.round(Math.sqrt(n)) * Math.round(Math.sqrt(n)) === n) n = r.so(2, 99);
        var s = Math.sqrt(n), k = Math.floor(s), kq = Math.round(s * 100) / 100;
        var s4 = Math.floor(s * 10000) / 10000;
        return {
          de: 'Dùng máy tính cầm tay, tính $\\sqrt{' + n + '}$ rồi làm tròn kết quả đến hàng phần trăm.',
          dapAn: { kieu: 'so', gt: kq, saiSo: 0.001 },
          goiY: ['Ước lượng trước: $' + k * k + ' < ' + n + ' < ' + (k + 1) * (k + 1) + '$ nên $' + k + ' < \\sqrt{' + n + '} < ' + (k + 1) + '$.', 'Bấm máy được $\\sqrt{' + n + '} = ' + so(s4) + '\\ldots$; xét chữ số thứ ba sau dấu phẩy để làm tròn.'],
          loiGiai: ['$\\sqrt{' + n + '} = ' + so(s4) + '\\ldots$ (nằm giữa $' + k + '$ và $' + (k + 1) + '$).', '$\\sqrt{' + n + '} \\approx ' + so(kq) + '$']
        };
      } },
      { ten: 'Vận dụng căn bậc hai', muc: 3, sinh: function (r) {
        var loai = r.chon([0, 1, 2]);
        if (loai === 0) {
          var k = r.so(2, 15), S = k * k;
          return {
            de: 'Một mảnh vườn hình vuông có diện tích $' + S + '\\text{ m}^2$. Tính chu vi mảnh vườn (m).',
            dapAn: { kieu: 'so', gt: 4 * k },
            goiY: ['Cạnh hình vuông $= \\sqrt{\\text{diện tích}}$.', 'Cạnh $= \\sqrt{' + S + '}$; chu vi $= 4 \\cdot$ cạnh.'],
            loiGiai: ['Cạnh mảnh vườn: $\\sqrt{' + S + '} = ' + k + '$ (m).', 'Chu vi: $4 \\cdot ' + k + ' = ' + 4 * k + '$ (m).'],
            loiThuongGap: [{ gt: k, giaiThich: 'Đó mới là **cạnh** mảnh vườn. Chu vi $= 4 \\cdot$ cạnh.' }]
          };
        }
        if (loai === 1) {
          var t = r.chon(BA_SO), tru = r.dau() > 0;
          var de = tru ? '\\sqrt{' + t[2] + '^2 - ' + t[1] + '^2}' : '\\sqrt{' + t[0] + '^2 + ' + t[1] + '^2}', kq = tru ? t[0] : t[2];
          return {
            de: 'Tính $' + de + '$.',
            dapAn: { kieu: 'so', gt: kq },
            goiY: ['Tính biểu thức **trong căn** trước.', tru ? '$' + t[2] + '^2 - ' + t[1] + '^2 = ' + t[2] * t[2] + ' - ' + t[1] * t[1] + '$.' : '$' + t[0] + '^2 + ' + t[1] + '^2 = ' + t[0] * t[0] + ' + ' + t[1] * t[1] + '$.'],
            loiGiai: tru ? ['$' + t[2] + '^2 - ' + t[1] + '^2 = ' + t[2] * t[2] + ' - ' + t[1] * t[1] + ' = ' + t[0] * t[0] + '$', '$\\sqrt{' + t[0] * t[0] + '} = ' + t[0] + '$']
              : ['$' + t[0] + '^2 + ' + t[1] + '^2 = ' + t[0] * t[0] + ' + ' + t[1] * t[1] + ' = ' + t[2] * t[2] + '$', '$\\sqrt{' + t[2] * t[2] + '} = ' + t[2] + '$'],
            loiThuongGap: [{ gt: tru ? t[2] - t[1] : t[0] + t[1], giaiThich: 'Không được tách căn: $\\sqrt{a^2 ' + (tru ? '-' : '+') + ' b^2} \\ne a ' + (tru ? '-' : '+') + ' b$. Phải tính trong căn trước.' }]
          };
        }
        var m = r.so(2, 12), a = m * m;
        return {
          de: 'Tìm $x$, biết $x^2 = ' + a + '$.',
          dapAn: { kieu: 'nghiem', gt: [m, -m] },
          goiY: ['Có hai số đối nhau mà bình phương đều bằng $' + a + '$.', '$x = \\sqrt{' + a + '}$ hoặc $x = -\\sqrt{' + a + '}$.'],
          loiGiai: ['$x^2 = ' + a + '$ nên $x = \\sqrt{' + a + '} = ' + m + '$ hoặc $x = -\\sqrt{' + a + '} = -' + m + '$.', 'Vậy $x = ' + m + '$ hoặc $x = -' + m + '$.'],
          loiThuongGap: [{ gt: [m], giaiThich: 'Còn thiếu một giá trị: $(-' + m + ')^2 = ' + a + '$ cũng đúng.' }]
        };
      } }
    ]
  });
})();
