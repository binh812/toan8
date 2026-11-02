// Luyện thêm – Bài 7: Lập phương của một tổng. Lập phương của một hiệu
(function () {
  'use strict';
  function nhan(a) { return a === 1 ? '' : String(a); }
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }

  TOAN8.luyen(7, [
    { ten: 'Khai triển (x ± b)³', muc: 1, sinh: function (r, cc) {
      var b = r.so(1, 6), s = r.dau(), dau = s > 0 ? '+' : '-';
      var kq = cc.daThuc([[1, 'x^3'], [3 * b * s, 'x^2'], [3 * b * b, 'x'], [s * b * b * b, '']]);
      var ltg = [{ gt: cc.daThuc([[1, 'x^3'], [s * b * b * b, '']]), giaiThich: 'Em quên hai hạng tử ở giữa $3A^2B$ và $3AB^2$: $(A ' + dau + ' B)^3 \\ne A^3 ' + dau + ' B^3$.' }];
      if (s < 0) ltg.push({ gt: cc.daThuc([[1, 'x^3'], [-3 * b, 'x^2'], [-3 * b * b, 'x'], [-b * b * b, '']]), giaiThich: 'Với $(A - B)^3$ dấu **xen kẽ** $+, -, +, -$: hạng tử $3AB^2 = ' + 3 * b * b + 'x$ mang dấu cộng.' });
      else ltg.push({ gt: cc.daThuc([[1, 'x^3'], [b, 'x^2'], [b * b, 'x'], [b * b * b, '']]), giaiThich: 'Đừng quên hệ số $3$: $3A^2B = 3 \\cdot x^2 \\cdot ' + b + ' = ' + 3 * b + 'x^2$.' });
      return {
        de: 'Khai triển $(x ' + dau + ' ' + b + ')^3$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['$(A ' + dau + ' B)^3 = A^3 ' + dau + ' 3A^2B + 3AB^2 ' + dau + ' B^3$ với $A = x$, $B = ' + b + '$.', 'Tính lần lượt $A^3$, $3A^2B$, $3AB^2$, $B^3$ rồi ghép với đúng dấu.'],
        loiGiai: ['$(x ' + dau + ' ' + b + ')^3 = x^3 ' + dau + ' 3 \\cdot x^2 \\cdot ' + b + ' + 3 \\cdot x \\cdot ' + b + '^2 ' + dau + ' ' + b + '^3$',
          '$= ' + cc.tex(kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Khai triển (ax ± B)³', muc: 2, sinh: function (r, cc) {
      var a = r.chon([2, 3]), s = r.dau(), dau = s > 0 ? '+' : '-', coY = r.dau() > 0, b = coY ? 1 : r.chon(a === 2 ? [1, 3] : [1, 2]);
      var Bv = coY ? 'y' : '', B = coY ? 'y' : String(b);
      // (ax + sB)^3 = a³x³ + 3a²·sB x² + 3a B² x + s B³
      var kq = cc.daThuc([[a * a * a, 'x^3'], [3 * a * a * b * s, 'x^2' + Bv], [3 * a * b * b, 'x' + (coY ? 'y^2' : '')], [s * b * b * b, coY ? 'y^3' : '']]);
      var sai = cc.daThuc([[a, 'x^3'], [3 * a * a * b * s, 'x^2' + Bv], [3 * a * b * b, 'x' + (coY ? 'y^2' : '')], [s * b * b * b, coY ? 'y^3' : '']]);
      var sai2 = cc.daThuc([[a * a * a, 'x^3'], [3 * a * b * s, 'x^2' + Bv], [3 * a * b * b, 'x' + (coY ? 'y^2' : '')], [s * b * b * b, coY ? 'y^3' : '']]);
      return {
        de: 'Khai triển $(' + a + 'x ' + dau + ' ' + B + ')^3$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Dùng $(A ' + dau + ' B)^3 = A^3 ' + dau + ' 3A^2B + 3AB^2 ' + dau + ' B^3$ với $A = ' + a + 'x$, $B = ' + B + '$.', 'Lập phương cả hệ số: $(' + a + 'x)^3 = ' + a * a * a + 'x^3$; $(' + a + 'x)^2 = ' + a * a + 'x^2$.'],
        loiGiai: ['$= (' + a + 'x)^3 ' + dau + ' 3(' + a + 'x)^2 \\cdot ' + B + ' + 3 \\cdot ' + a + 'x \\cdot ' + (coY ? 'y^2' : B + '^2') + ' ' + dau + ' ' + B + '^3$',
          '$= ' + tx(cc, kq) + '$'],
        loiThuongGap: [{ gt: sai, giaiThich: 'Phải lập phương cả hệ số: $(' + a + 'x)^3 = ' + a + '^3x^3 = ' + a * a * a + 'x^3$, không phải $' + a + 'x^3$.' },
          { gt: sai2, giaiThich: 'Hạng tử thứ hai là $3A^2B$ với $A^2 = (' + a + 'x)^2 = ' + a * a + 'x^2$, không phải $' + a + 'x^2$.' }]
      };
    } },

    { ten: 'Viết thành lập phương', muc: 2, sinh: function (r, cc) {
      var b = r.so(1, 5), s = r.dau(), dau = s > 0 ? '+' : '-', nguoc = r.dau() > 0;
      var heSo = [[1, 'x^3'], [3 * b * s, 'x^2'], [3 * b * b, 'x'], [s * b * b * b, '']];
      var kq = '(x' + dau + b + ')^3';
      // nguoc: viết từ hạng tử tự do (với hiệu thì đổi thành (b − x)³ = b³ − 3b²x + 3bx² − x³)
      var de, kq2 = kq;
      if (nguoc) {
        if (s > 0) de = cc.daThuc(heSo.slice().reverse());
        else { de = cc.daThuc([[b * b * b, ''], [-3 * b * b, 'x'], [3 * b, 'x^2'], [-1, 'x^3']]); kq2 = '(' + b + '-x)^3'; }
      } else de = cc.daThuc(heSo);
      var Atex = kq2.charAt(1) === 'x' ? 'x' : String(b), Btex = kq2.charAt(1) === 'x' ? String(b) : 'x';
      return {
        de: 'Viết $' + tx(cc, de) + '$ dưới dạng lập phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + '.',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'nhanTu' },
        goiY: ['Tìm $A$, $B$ từ hai hạng tử $A^3$ và $B^3$ ở hai đầu.', 'Kiểm tra hai hạng tử giữa có đúng là $3A^2B$ và $3AB^2$ không; dấu xen kẽ thì là lập phương của một hiệu.'],
        loiGiai: ['$A = ' + Atex + '$, $B = ' + Btex + '$: $3A^2B = 3 \\cdot ' + (Atex === 'x' ? 'x^2 \\cdot ' + b : b + '^2 \\cdot x') + '$, $3AB^2 = 3 \\cdot ' + (Atex === 'x' ? 'x \\cdot ' + b + '^2' : b + ' \\cdot x^2') + '$ (đúng).',
          '$' + tx(cc, de) + ' = ' + cc.tex(kq2) + '$'],
        loiThuongGap: [{ gt: '(' + Atex + (s > 0 ? '-' : '+') + Btex + ')^3', giaiThich: 'Sai dấu: các dấu ' + (s > 0 ? 'đều là cộng nên là lập phương của một **tổng**.' : 'xen kẽ nên là lập phương của một **hiệu**.') }]
      };
    } },

    { ten: 'Tính nhanh', muc: 3, sinh: function (r, cc) {
      var tron = r.chon([10, 20, 30, 100]), d = r.so(1, 2), s = r.dau(), dau = s > 0 ? '+' : '-';
      if (r.dau() > 0) {
        // tính nhanh (10 ± d)³
        var z = tron + s * d, kq = z * z * z;
        return {
          de: 'Tính nhanh $' + z + '^3$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Viết $' + z + ' = ' + tron + ' ' + dau + ' ' + d + '$.', 'Dùng $(A ' + dau + ' B)^3 = A^3 ' + dau + ' 3A^2B + 3AB^2 ' + dau + ' B^3$.'],
          loiGiai: ['$' + z + '^3 = (' + tron + ' ' + dau + ' ' + d + ')^3 = ' + tron * tron * tron + ' ' + dau + ' ' + 3 * tron * tron * d + ' + ' + 3 * tron * d * d + ' ' + dau + ' ' + d * d * d + '$',
            '$= ' + kq + '$'],
          loiThuongGap: [{ gt: tron * tron * tron + s * d * d * d, giaiThich: 'Em quên hai hạng tử $3A^2B$ và $3AB^2$.' }]
        };
      }
      // giá trị x³ ± 3bx² + 3b²x ± b³ tại x = tron ∓ b
      var b = r.so(1, 4), x = tron - s * b;
      var bt = cc.daThuc([[1, 'x^3'], [3 * b * s, 'x^2'], [3 * b * b, 'x'], [s * b * b * b, '']]);
      var kq2 = tron * tron * tron;
      return {
        de: 'Tính nhanh giá trị của biểu thức $' + cc.tex(bt) + '$ tại $x = ' + x + '$.',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Biểu thức có dạng lập phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + ' với $A = x$, $B = ' + b + '$.', 'Viết thành $(x ' + dau + ' ' + b + ')^3$ rồi thay $x = ' + x + '$: số trong ngoặc rất tròn.'],
        loiGiai: ['$' + cc.tex(bt) + ' = (x ' + dau + ' ' + b + ')^3$',
          'Tại $x = ' + x + '$: $(' + x + ' ' + dau + ' ' + b + ')^3 = ' + tron + '^3 = ' + kq2 + '$'],
        loiThuongGap: [{ gt: Math.pow(x - s * b, 3), giaiThich: 'Sai dấu: biểu thức là $(x ' + dau + ' ' + b + ')^3$, không phải $(x ' + (s > 0 ? '-' : '+') + ' ' + b + ')^3$.' }]
      };
    } },

    { ten: 'Rút gọn biểu thức', muc: 3, sinh: function (r, cc) {
      var a = r.so(1, 4), tru = r.dau() > 0;
      if (tru) {
        // (x + a)³ − (x − a)³ = 6a x² + 2a³
        var kq = cc.daThuc([[6 * a, 'x^2'], [2 * a * a * a, '']]);
        var sai = cc.daThuc([[6 * a * a, 'x']]); // chỉ đổi dấu x³ khi bỏ ngoặc
        return {
          de: 'Rút gọn biểu thức $(x + ' + a + ')^3 - (x - ' + a + ')^3$ (viết kết quả dưới dạng đa thức thu gọn).',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Khai triển hai lập phương rồi trừ.', 'Trước ngoặc thứ hai có dấu trừ: phải đổi dấu **cả bốn** hạng tử.'],
          loiGiai: ['$= (' + cc.tex(cc.daThuc([[1, 'x^3'], [3 * a, 'x^2'], [3 * a * a, 'x'], [a * a * a, '']])) + ') - (' + cc.tex(cc.daThuc([[1, 'x^3'], [-3 * a, 'x^2'], [3 * a * a, 'x'], [-a * a * a, '']])) + ')$',
            '$= ' + cc.tex(cc.daThuc([[1, 'x^3'], [3 * a, 'x^2'], [3 * a * a, 'x'], [a * a * a, ''], [-1, 'x^3'], [3 * a, 'x^2'], [-3 * a * a, 'x'], [a * a * a, '']])) + ' = ' + cc.tex(kq) + '$'],
          loiThuongGap: [{ gt: sai, giaiThich: 'Khi bỏ ngoặc có dấu trừ phải đổi dấu **tất cả** các hạng tử của $(x - ' + a + ')^3$, không chỉ $x^3$.' }]
        };
      }
      // (x + a)³ + (x − a)³ = 2x³ + 6a² x
      var kq2 = cc.daThuc([[2, 'x^3'], [6 * a * a, 'x']]);
      return {
        de: 'Rút gọn biểu thức $(x + ' + a + ')^3 + (x - ' + a + ')^3$ (viết kết quả dưới dạng đa thức thu gọn).',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'khaiTrien' },
        goiY: ['Khai triển hai lập phương rồi cộng.', 'Các hạng tử $\\pm ' + 3 * a + 'x^2$ và $\\pm ' + a * a * a + '$ triệt tiêu nhau.'],
        loiGiai: ['$= (' + cc.tex(cc.daThuc([[1, 'x^3'], [3 * a, 'x^2'], [3 * a * a, 'x'], [a * a * a, '']])) + ') + (' + cc.tex(cc.daThuc([[1, 'x^3'], [-3 * a, 'x^2'], [3 * a * a, 'x'], [-a * a * a, '']])) + ')$',
          '$= ' + cc.tex(kq2) + '$'],
        loiThuongGap: [{ gt: '2x^3', giaiThich: 'Hạng tử $3AB^2 = ' + 3 * a * a + 'x$ trong cả hai khai triển đều mang dấu **cộng**, không triệt tiêu.' }]
      };
    } }
  ]);
})();
