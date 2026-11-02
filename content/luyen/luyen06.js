// Luyện thêm – Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu
(function () {
  'use strict';
  function nhan(a) { return a === 1 ? '' : String(a); }

  TOAN8.luyen(6, [
    { ten: 'Khai triển (ax ± b)²', muc: 1, sinh: function (r, cc) {
      var a = r.chon([1, 1, 2, 3]), b = r.so(1, 9), s = r.dau(), dau = s > 0 ? '+' : '-';
      var de = '(' + nhan(a) + 'x' + dau + b + ')^2';
      var kq = cc.daThuc([[a * a, 'x^2'], [2 * a * b * s, 'x'], [b * b, '']]);
      return {
        de: 'Khai triển $' + cc.tex(de) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Dùng $(A ' + dau + ' B)^2 = A^2 ' + dau + ' 2AB + B^2$ với $A = ' + cc.tex(nhan(a) + 'x') + '$ và $B = ' + b + '$.',
          'Tính lần lượt $A^2$, $2AB$ và $B^2$ rồi ghép lại.'],
        loiGiai: ['$A^2 = ' + cc.tex(a * a + 'x^2') + '$; $2AB = ' + cc.tex(2 * a * b + 'x') + '$; $B^2 = ' + b * b + '$.',
          '$' + cc.tex(de) + ' = ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc([[a * a, 'x^2'], [b * b, '']]), giaiThich: 'Em quên hạng tử ở giữa $2AB$: $(A ' + dau + ' B)^2$ **không** bằng $A^2 + B^2$.' }]
      };
    } },
    { ten: 'Viết thành bình phương', muc: 2, sinh: function (r, cc) {
      var k = r.so(1, 9), s = r.dau(), dau = s > 0 ? '+' : '-';
      var de = cc.daThuc([[1, 'x^2'], [2 * k * s, 'x'], [k * k, '']]), kq = '(x' + dau + k + ')^2';
      return {
        de: 'Viết $' + cc.tex(de) + '$ dưới dạng bình phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + '.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
        goiY: ['Tìm $A$, $B$ sao cho $A^2 = x^2$ và $B^2 = ' + k * k + '$.',
          'Kiểm tra hạng tử giữa: $2AB$ có bằng $' + 2 * k + 'x$ không? Dấu của nó cho biết là tổng hay hiệu.'],
        loiGiai: ['$x^2 = A^2$ với $A = x$; $' + k * k + ' = B^2$ với $B = ' + k + '$; $2AB = ' + 2 * k + 'x$.',
          '$' + cc.tex(de) + ' = ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: '(x' + (s > 0 ? '-' : '+') + k + ')^2', giaiThich: 'Sai dấu: hạng tử giữa là $' + (s > 0 ? '+' : '-') + 2 * k + 'x$ nên phải là bình phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + '.' }]
      };
    } },
    { ten: 'Tính nhanh', muc: 3, sinh: function (r) {
      var trong = r.chon([10, 20, 30, 50, 100]), d = r.so(1, trong === 10 ? 3 : 4);
      if (r.dau() > 0) {
        var x = trong - d, y = trong + d, kq = trong * trong - d * d;
        return {
          de: 'Tính nhanh $' + x + ' \\cdot ' + y + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Hai số cách đều $' + trong + '$: viết $' + x + ' = ' + trong + ' - ' + d + '$ và $' + y + ' = ' + trong + ' + ' + d + '$.',
            'Dùng $(A - B)(A + B) = A^2 - B^2$.'],
          loiGiai: ['$' + x + ' \\cdot ' + y + ' = (' + trong + ' - ' + d + ')(' + trong + ' + ' + d + ') = ' + trong + '^2 - ' + d + '^2$',
            '$= ' + trong * trong + ' - ' + d * d + ' = ' + kq + '$'],
          loiThuongGap: [{ gt: trong * trong + d * d, giaiThich: 'Hiệu hai bình phương là $A^2 \\mathbf{-} B^2$, không phải cộng.' }]
        };
      }
      var s = r.dau(), z = trong + s * d, kq2 = z * z, dau = s > 0 ? '+' : '-';
      return {
        de: 'Tính nhanh $' + z + '^2$.',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Viết $' + z + ' = ' + trong + ' ' + dau + ' ' + d + '$.', 'Dùng $(A ' + dau + ' B)^2 = A^2 ' + dau + ' 2AB + B^2$.'],
        loiGiai: ['$' + z + '^2 = (' + trong + ' ' + dau + ' ' + d + ')^2 = ' + trong * trong + ' ' + dau + ' ' + 2 * trong * d + ' + ' + d * d + '$',
          '$= ' + kq2 + '$'],
        loiThuongGap: [{ gt: trong * trong + d * d, giaiThich: 'Em quên hạng tử $2AB = ' + 2 * trong * d + '$.' }]
      };
    } }
  ]);
})();
