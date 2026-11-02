// Luyện thêm – Bài 4: Phép nhân đa thức
(function () {
  'use strict';
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  function ngoac(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function nhi(cc, p, a) { return cc.daThuc([[p, 'x'], [a, '']]); } // px + a

  TOAN8.luyen(4, [
    { ten: 'Nhân đơn thức với đa thức', muc: 1, sinh: function (r, cc) {
      var k = r.khac0(-5, 5), m = r.so(1, 2), a = r.khac0(-5, 5), b = r.khac0(-6, 6), c = r.so(-7, 7);
      if (k === 1) k = 2;
      var don = cc.daThuc([[k, m === 1 ? 'x' : 'x^2']]);
      var ba = r.dau() > 0;
      var trong = ba ? cc.daThuc([[a, 'x^2'], [b, 'x'], [c, '']]) : cc.daThuc([[a, 'x'], [b, '']]);
      var heSo = ba ? [[k * a, 'x^' + (m + 2)], [k * b, 'x^' + (m + 1)], [k * c, m === 1 ? 'x' : 'x^2']]
        : [[k * a, 'x^' + (m + 1)], [k * b, m === 1 ? 'x' : 'x^2']];
      var kq = cc.daThuc(heSo);
      // lỗi: chỉ nhân với hạng tử đầu
      var sai = ba ? cc.daThuc([[k * a, 'x^' + (m + 2)], [b, 'x'], [c, '']]) : cc.daThuc([[k * a, 'x^' + (m + 1)], [b, '']]);
      var donTex = tx(cc, don);
      return {
        de: 'Tính $' + (k < 0 ? '(' + donTex + ')' : donTex) + '(' + tx(cc, trong) + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Nhân đơn thức với **từng** hạng tử của đa thức rồi cộng các tích.', 'Nhân lũy thừa cùng cơ số thì cộng số mũ; chú ý dấu khi nhân với số âm.'],
        loiGiai: ['$= ' + (ba ? [[a, 'x^2'], [b, 'x'], [c, '']] : [[a, 'x'], [b, '']]).filter(function (h) { return h[0]; }).map(function (h) {
          return '(' + donTex + ') \\cdot (' + tx(cc, cc.daThuc([h])) + ')';
        }).join(' + ') + '$',
          '$= ' + tx(cc, kq) + '$'],
        loiThuongGap: [{ gt: sai, giaiThich: 'Phải nhân $' + donTex + '$ với **tất cả** các hạng tử trong ngoặc, không chỉ hạng tử đầu tiên.' }]
      };
    } },

    { ten: 'Nhân (x + a)(x + b)', muc: 1, sinh: function (r, cc) {
      var a = r.khac0(-7, 7), b = r.khac0(-7, 7);
      while (a + b === 0) b = r.khac0(-7, 7);
      var kq = cc.daThuc([[1, 'x^2'], [a + b, 'x'], [a * b, '']]);
      var A = nhi(cc, 1, a), B = nhi(cc, 1, b);
      return {
        de: 'Tính $(' + cc.tex(A) + ')(' + cc.tex(B) + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Nhân **mỗi** hạng tử của đa thức này với **từng** hạng tử của đa thức kia: được $4$ tích.', '$x \\cdot x$, $x \\cdot ' + ngoac(b) + '$, $' + ngoac(a) + ' \\cdot x$, $' + ngoac(a) + ' \\cdot ' + ngoac(b) + '$. Rồi thu gọn hai hạng tử chứa $x$.'],
        loiGiai: ['$= x \\cdot x + x \\cdot ' + ngoac(b) + ' + ' + ngoac(a) + ' \\cdot x + ' + ngoac(a) + ' \\cdot ' + ngoac(b) + '$',
          '$= ' + cc.tex(cc.daThuc([[1, 'x^2'], [b, 'x'], [a, 'x'], [a * b, '']])) + ' = ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc([[1, 'x^2'], [a * b, '']]), giaiThich: 'Em mới nhân "đầu với đầu, cuối với cuối". Còn thiếu hai tích $x \\cdot ' + ngoac(b) + '$ và $' + ngoac(a) + ' \\cdot x$.' }]
      };
    } },

    { ten: 'Nhân hai nhị thức', muc: 2, sinh: function (r, cc) {
      var hai = r.dau() > 0;
      if (hai) {
        // (x + a·y)(x + b·y)
        var a = r.khac0(-5, 5), b = r.khac0(-5, 5);
        while (a + b === 0) b = r.khac0(-5, 5);
        var A = cc.daThuc([[1, 'x'], [a, 'y']]), B = cc.daThuc([[1, 'x'], [b, 'y']]);
        var kq = cc.daThuc([[1, 'x^2'], [a + b, 'xy'], [a * b, 'y^2']]);
        return {
          de: 'Tính $(' + cc.tex(A) + ')(' + cc.tex(B) + ')$.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Nhân mỗi hạng tử của ngoặc đầu với từng hạng tử của ngoặc sau: $4$ tích.', 'Hai tích chứa $xy$ là hạng tử đồng dạng, nhớ gộp lại.'],
          loiGiai: ['$= x^2 ' + (b < 0 ? '- ' + cc.tex(cc.daThuc([[-b, 'xy']])) : '+ ' + cc.tex(cc.daThuc([[b, 'xy']]))) + ' ' + (a < 0 ? '- ' + cc.tex(cc.daThuc([[-a, 'xy']])) : '+ ' + cc.tex(cc.daThuc([[a, 'xy']]))) + ' ' + (a * b < 0 ? '- ' : '+ ') + cc.tex(cc.daThuc([[Math.abs(a * b), 'y^2']])) + '$',
            '$= ' + tx(cc, kq) + '$'],
          loiThuongGap: [{ gt: cc.daThuc([[1, 'x^2'], [a * b, 'y^2']]), giaiThich: 'Thiếu hai tích ở giữa $x \\cdot ' + cc.tex(cc.daThuc([[b, 'y']])) + '$ và $' + cc.tex(cc.daThuc([[a, 'y']])) + ' \\cdot x$.' }]
        };
      }
      var p = r.so(2, 4), q = r.so(1, 3), c = r.khac0(-6, 6), d = r.khac0(-6, 6);
      while (p * d + q * c === 0) d = r.khac0(-6, 6);
      var kq2 = cc.daThuc([[p * q, 'x^2'], [p * d + q * c, 'x'], [c * d, '']]);
      var A2 = nhi(cc, p, c), B2 = nhi(cc, q, d);
      var ltg = [{ gt: cc.daThuc([[p * q, 'x^2'], [c * d, '']]), giaiThich: 'Còn thiếu hai tích ở giữa: $' + cc.tex(p + 'x') + ' \\cdot ' + ngoac(d) + '$ và $' + ngoac(c) + ' \\cdot ' + cc.tex(q === 1 ? 'x' : q + 'x') + '$.' }];
      if (p * d - q * c !== p * d + q * c) ltg.push({ gt: cc.daThuc([[p * q, 'x^2'], [p * d - q * c, 'x'], [c * d, '']]), giaiThich: 'Sai dấu ở tích $' + ngoac(c) + ' \\cdot ' + cc.tex(q === 1 ? 'x' : q + 'x') + ' = ' + tx(cc, cc.daThuc([[c * q, 'x']])) + '$.' });
      return {
        de: 'Tính $(' + cc.tex(A2) + ')(' + cc.tex(B2) + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'khaiTrien' },
        goiY: ['Nhân mỗi hạng tử của ngoặc đầu với từng hạng tử của ngoặc sau.', '$' + cc.tex(p + 'x') + ' \\cdot ' + cc.tex(q === 1 ? 'x' : q + 'x') + ' = ' + cc.tex(p * q + 'x^2') + '$; còn ba tích nữa.'],
        loiGiai: ['$= ' + cc.tex(p + 'x') + ' \\cdot ' + cc.tex(q === 1 ? 'x' : q + 'x') + ' + ' + cc.tex(p + 'x') + ' \\cdot ' + ngoac(d) + ' + ' + ngoac(c) + ' \\cdot ' + cc.tex(q === 1 ? 'x' : q + 'x') + ' + ' + ngoac(c) + ' \\cdot ' + ngoac(d) + '$',
          '$= ' + tx(cc, cc.daThuc([[p * q, 'x^2'], [p * d, 'x'], [q * c, 'x'], [c * d, '']])) + ' = ' + tx(cc, kq2) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Giá trị không phụ thuộc vào biến', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), b = r.khac0(-6, 6);
      while (a + b === 0) b = r.khac0(-6, 6);
      var c = a + b, kq = a * b;
      var de = '(' + cc.tex(nhi(cc, 1, a)) + ')(' + cc.tex(nhi(cc, 1, b)) + ') - x(' + cc.tex(nhi(cc, 1, c)) + ')';
      var ltg = [];
      if (a + b !== kq) ltg.push({ gt: a + b, giaiThich: 'Tích $' + ngoac(a) + ' \\cdot ' + ngoac(b) + ' = ' + kq + '$ (nhân hai số hạng tự do), không cộng.' });
      if (-kq !== kq && -kq !== a + b) ltg.push({ gt: -kq, giaiThich: 'Kiểm tra lại dấu: $' + ngoac(a) + ' \\cdot ' + ngoac(b) + ' = ' + kq + '$.' });
      return {
        de: 'Chứng tỏ giá trị của biểu thức $' + de + '$ không phụ thuộc vào $x$. Giá trị đó bằng bao nhiêu?',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Nhân phá ngoặc từng phần rồi thu gọn: các hạng tử chứa $x$ sẽ triệt tiêu.', 'Trước $x(' + cc.tex(nhi(cc, 1, c)) + ')$ có dấu trừ: nhân xong phải đổi dấu cả hai hạng tử.'],
        loiGiai: ['$(' + cc.tex(nhi(cc, 1, a)) + ')(' + cc.tex(nhi(cc, 1, b)) + ') = ' + cc.tex(cc.daThuc([[1, 'x^2'], [c, 'x'], [kq, '']])) + '$; $x(' + cc.tex(nhi(cc, 1, c)) + ') = ' + cc.tex(cc.daThuc([[1, 'x^2'], [c, 'x']])) + '$.',
          'Hiệu: $(' + cc.tex(cc.daThuc([[1, 'x^2'], [c, 'x'], [kq, '']])) + ') - (' + cc.tex(cc.daThuc([[1, 'x^2'], [c, 'x']])) + ') = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Rút gọn rồi tính giá trị', muc: 2, sinh: function (r, cc) {
      var p = r.so(2, 3), a = r.khac0(-4, 4), b = r.khac0(-4, 4), x = r.chon([-3, -2, -1, 2, 3]);
      // (px + a)(x + b) − p·x^2 = (pb + a)x + ab
      var k1 = p * b + a, k0 = a * b;
      while (k1 === 0) { b = r.khac0(-4, 4); k1 = p * b + a; k0 = a * b; }
      var gon = cc.daThuc([[k1, 'x'], [k0, '']]), kq = k1 * x + k0;
      var sai = p * x * x + k1 * x + k0; // quên trừ p·x^2
      var thay = (k1 === 1 ? '' : k1 === -1 ? '-' : k1 + ' \\cdot ') + ngoac(x) + (k0 ? (k0 > 0 ? ' + ' : ' - ') + Math.abs(k0) : '');
      return {
        de: 'Rút gọn rồi tính giá trị của biểu thức $(' + cc.tex(nhi(cc, p, a)) + ')(' + cc.tex(nhi(cc, 1, b)) + ') - ' + p + 'x^2$ tại $x = ' + x + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Nhân hai đa thức trước, rồi trừ $' + p + 'x^2$: biểu thức thu gọn chỉ còn bậc nhất.', 'Thay $x = ' + x + '$ vào dạng thu gọn.'],
        loiGiai: ['$(' + cc.tex(nhi(cc, p, a)) + ')(' + cc.tex(nhi(cc, 1, b)) + ') - ' + p + 'x^2 = ' + cc.tex(cc.daThuc([[p, 'x^2'], [k1, 'x'], [k0, '']])) + ' - ' + p + 'x^2 = ' + tx(cc, gon) + '$',
          'Tại $x = ' + x + '$: $' + thay + ' = ' + kq + '$'],
        loiThuongGap: sai !== kq ? [{ gt: sai, giaiThich: 'Em quên trừ $' + p + 'x^2$ (hay quên hạng tử đó khi rút gọn).' }] : []
      };
    } },

    { ten: 'Bài toán thực tế', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var a = r.so(2, 8), b = r.so(1, a - 1), k = r.so(1, 3);
        var noi = r.chon(['mảnh vườn', 'sân chơi', 'bể bơi', 'tấm thảm']);
        var kq = cc.daThuc([[2 * k, 'x'], [k * (a + b) + k * k, '']]);
        return {
          de: 'Một ' + noi + ' hình chữ nhật có chiều dài $x + ' + a + '$ (m) và chiều rộng $x + ' + b + '$ (m). Người ta mở rộng mỗi chiều thêm $' + k + '$ m. Diện tích tăng thêm bao nhiêu mét vuông? (Viết đa thức thu gọn theo $x$.)',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Diện tích mới là $(x + ' + (a + k) + ')(x + ' + (b + k) + ')$; diện tích cũ là $(x + ' + a + ')(x + ' + b + ')$.', 'Khai triển hai tích rồi lấy hiệu: hạng tử $x^2$ sẽ triệt tiêu.'],
          loiGiai: ['Mới: $(x + ' + (a + k) + ')(x + ' + (b + k) + ') = ' + cc.tex(cc.daThuc([[1, 'x^2'], [a + b + 2 * k, 'x'], [(a + k) * (b + k), '']])) + '$; cũ: $(x + ' + a + ')(x + ' + b + ') = ' + cc.tex(cc.daThuc([[1, 'x^2'], [a + b, 'x'], [a * b, '']])) + '$.',
            'Diện tích tăng: $' + cc.tex(cc.daThuc([[a + b + 2 * k, 'x'], [(a + k) * (b + k), '']])) + ' - (' + cc.tex(cc.daThuc([[a + b, 'x'], [a * b, '']])) + ') = ' + cc.tex(kq) + '$'],
          loiThuongGap: [{ gt: cc.daThuc([[2 * k, 'x'], [k * (a + b), '']]), giaiThich: 'Em quên tích $' + k + ' \\cdot ' + k + ' = ' + k * k + '$ (mảnh vuông nhỏ ở góc phần mở rộng).' }]
        };
      }
      // (n + a)(n + b) − (n + c)(n + d) với a + b = c + d
      var s = r.so(5, 11), a2 = r.so(1, s - 1), c2 = r.so(1, s - 1);
      while (c2 === a2 || c2 === s - a2) c2 = r.so(1, s - 1);
      var b2 = s - a2, d2 = s - c2, kq2 = a2 * b2 - c2 * d2;
      return {
        de: 'Cho $P = (n + ' + a2 + ')(n + ' + b2 + ') - (n + ' + c2 + ')(n + ' + d2 + ')$. Chứng tỏ $P$ luôn bằng một số không đổi với mọi $n$. Số đó là bao nhiêu?',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Khai triển từng tích $(n + a)(n + b) = n^2 + (a + b)n + ab$.', 'Hai tích có cùng hạng tử $n^2$ và cùng hạng tử $' + s + 'n$, nên chỉ còn hiệu hai số hạng tự do.'],
        loiGiai: ['$(n + ' + a2 + ')(n + ' + b2 + ') = n^2 + ' + s + 'n + ' + a2 * b2 + '$; $(n + ' + c2 + ')(n + ' + d2 + ') = n^2 + ' + s + 'n + ' + c2 * d2 + '$.',
          '$P = ' + a2 * b2 + ' - ' + c2 * d2 + ' = ' + kq2 + '$'],
        loiThuongGap: [{ gt: a2 * b2 + c2 * d2, giaiThich: 'Trước tích thứ hai có dấu **trừ**: $' + a2 * b2 + ' - ' + c2 * d2 + '$, không cộng.' }]
      };
    } }
  ]);
})();
