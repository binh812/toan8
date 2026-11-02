// Luyện thêm – Bài 8: Tổng và hiệu hai lập phương
(function () {
  'use strict';
  function nhan(a) { return a === 1 ? '' : String(a); }
  function lp(s) { return /^([0-9]+|[a-z])$/.test(s) ? s + '^3' : '(' + s + ')^3'; }
  function bp(s) { return /^([0-9]+|[a-z])$/.test(s) ? s + '^2' : '(' + s + ')^2'; }

  // A³ ± B³ với A = a·u, B = b·v (u, v là biến hoặc ''): trả về đề, đáp án và các lỗi
  function hang(cc, a, u, b, v, s) {
    var A = nhan(a) + u || String(a), B = (v ? nhan(b) + v : String(b));
    var A3 = cc.daThuc([[a * a * a, u ? u + '^3' : '']]), B3 = cc.daThuc([[b * b * b, v ? v + '^3' : '']]);
    var A2 = cc.daThuc([[a * a, u ? u + '^2' : '']]), B2 = cc.daThuc([[b * b, v ? v + '^2' : '']]);
    var AB = cc.daThuc([[a * b, u + v]]);
    var dau = s > 0 ? '+' : '-', nguoc = s > 0 ? '-' : '+';
    return {
      A: A, B: B, A2: A2, AB: AB, A3: A3, B3: B3, dau: dau,
      de: A3 + dau + B3,
      kq: '(' + A + dau + B + ')(' + A2 + nguoc + AB + '+' + B2 + ')',
      saiDau: '(' + A + dau + B + ')(' + A2 + dau + AB + '+' + B2 + ')',
      sai2: '(' + A + dau + B + ')(' + A2 + nguoc + cc.daThuc([[2 * a * b, u + v]]) + '+' + B2 + ')',
      khai: '(' + A2 + nguoc + AB + '+' + B2 + ')'
    };
  }

  TOAN8.luyen(8, [
    { ten: 'Viết x³ ± b³ thành tích', muc: 1, sinh: function (r, cc) {
      var b = r.so(1, 6), s = r.dau(), h = hang(cc, 1, 'x', b, '', s);
      return {
        de: 'Viết $' + cc.tex(h.de) + '$ dưới dạng tích.',
        dapAn: { kieu: 'bieuThuc', gt: h.kq, dang: 'nhanTu' },
        goiY: ['Viết $' + b * b * b + ' = ' + b + '^3$ để thấy ' + (s > 0 ? 'tổng' : 'hiệu') + ' hai lập phương với $A = x$, $B = ' + b + '$.',
          s > 0 ? '$A^3 + B^3 = (A + B)(A^2 - AB + B^2)$.' : '$A^3 - B^3 = (A - B)(A^2 + AB + B^2)$.'],
        loiGiai: ['$' + cc.tex(h.de) + ' = x^3 ' + h.dau + ' ' + b + '^3$',
          '$= ' + cc.tex(h.kq) + '$'],
        loiThuongGap: [{ gt: h.saiDau, giaiThich: 'Trong thừa số thứ hai, hạng tử $AB$ mang dấu **ngược** với dấu của đề: $A^3 ' + h.dau + ' B^3 = (A ' + h.dau + ' B)(A^2 ' + (s > 0 ? '-' : '+') + ' AB + B^2)$.' },
          { gt: h.sai2, giaiThich: 'Hạng tử giữa là $AB = ' + cc.tex(cc.daThuc([[b, 'x']])) + '$, **không** có hệ số $2$ như trong bình phương.' }]
      };
    } },

    { ten: 'Viết A³ ± B³ thành tích (có hệ số)', muc: 2, sinh: function (r, cc) {
      var s = r.dau(), loai = r.so(0, 2), h;
      if (loai === 0) { var a = r.chon([2, 3, 4]), b = r.chon([1, 3, 5]); if (a === 3 && b === 3) b = 1; h = hang(cc, a, 'x', b, '', s); }
      else if (loai === 1) { h = hang(cc, r.chon([2, 3, 4]), 'x', 1, 'y', s); }
      else { var c = r.chon([2, 3, 4, 5]); h = hang(cc, c, '', 1, 'y', s); } // c³ ± y³
      return {
        de: 'Viết $' + cc.tex(h.de) + '$ dưới dạng tích.',
        dapAn: { kieu: 'bieuThuc', gt: h.kq, dang: 'nhanTu' },
        goiY: ['Viết mỗi hạng tử thành một lập phương: $' + cc.tex(h.A3) + ' = ' + lp(h.A) + '$, $' + cc.tex(h.B3) + ' = ' + lp(h.B) + '$.',
          s > 0 ? 'Dùng $A^3 + B^3 = (A + B)(A^2 - AB + B^2)$.' : 'Dùng $A^3 - B^3 = (A - B)(A^2 + AB + B^2)$.'],
        loiGiai: ['$' + cc.tex(h.de) + ' = ' + lp(h.A) + ' ' + h.dau + ' ' + lp(h.B) + '$, với $A = ' + h.A + '$, $B = ' + h.B + '$; $A^2 = ' + cc.tex(h.A2) + '$, $AB = ' + cc.tex(h.AB) + '$.',
          '$= ' + cc.tex(h.kq) + '$'],
        loiThuongGap: [{ gt: h.saiDau, giaiThich: 'Hạng tử $AB$ trong thừa số thứ hai mang dấu **ngược** với dấu của đề.' },
          { gt: '(' + h.A + h.dau + h.B + ')^3', giaiThich: '$A^3 ' + h.dau + ' B^3$ **không** bằng $(A ' + h.dau + ' B)^3$.' }]
      };
    } },

    { ten: 'Tính tích (A ± B)(A² ∓ AB + B²)', muc: 1, sinh: function (r, cc) {
      var b = r.so(1, 5), s = r.dau(), h = hang(cc, 1, 'x', b, '', s);
      var kq = cc.daThuc([[1, 'x^3'], [s * b * b * b, '']]);
      return {
        de: 'Tính $' + cc.tex(h.kq) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Nhận ra dạng ' + (s > 0 ? '$(A + B)(A^2 - AB + B^2) = A^3 + B^3$' : '$(A - B)(A^2 + AB + B^2) = A^3 - B^3$') + '.', 'Ở đây $A = x$, $B = ' + b + '$. (Hoặc nhân phá ngoặc: các hạng tử giữa triệt tiêu.)'],
        loiGiai: ['$= x^3 ' + h.dau + ' ' + b + '^3$', '$= ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc([[1, 'x^3'], [-s * b * b * b, '']]), giaiThich: 'Dấu của kết quả trùng với dấu trong thừa số thứ nhất $(x ' + h.dau + ' ' + b + ')$.' }]
      };
    } },

    { ten: 'Tính nhanh giá trị', muc: 2, sinh: function (r, cc) {
      var b = r.so(1, 3), s = r.dau(), x = r.chon([5, 10, 20, 30, 100]), h = hang(cc, 1, 'x', b, '', s);
      var kq = x * x * x + s * b * b * b;
      return {
        de: 'Tính nhanh giá trị của biểu thức $' + cc.tex(h.kq) + '$ tại $x = ' + x + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Biểu thức bằng $x^3 ' + h.dau + ' ' + b * b * b + '$ (' + (s > 0 ? 'tổng' : 'hiệu') + ' hai lập phương).', 'Thay $x = ' + x + '$ vào $x^3 ' + h.dau + ' ' + b * b * b + '$.'],
        loiGiai: ['$' + cc.tex(h.kq) + ' = x^3 ' + h.dau + ' ' + b + '^3 = x^3 ' + h.dau + ' ' + b * b * b + '$',
          'Tại $x = ' + x + '$: $' + x + '^3 ' + h.dau + ' ' + b * b * b + ' = ' + x * x * x + ' ' + h.dau + ' ' + b * b * b + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: Math.pow(x + s * b, 3), giaiThich: 'Biểu thức bằng $x^3 ' + h.dau + ' ' + b + '^3$, không phải $(x ' + h.dau + ' ' + b + ')^3$.' },
          { gt: x * x * x - s * b * b * b, giaiThich: 'Dấu của kết quả trùng với dấu trong thừa số $(x ' + h.dau + ' ' + b + ')$.' }]
      };
    } },

    { ten: 'Rút gọn biểu thức', muc: 3, sinh: function (r, cc) {
      var a = r.so(1, 5), loai = r.so(0, 2);
      var P = hang(cc, 1, 'x', a, '', 1), M = hang(cc, 1, 'x', a, '', -1);
      if (loai === 0) {
        // (x + a)(x² − ax + a²) − (x − a)(x² + ax + a²) = 2a³
        var kq = 2 * a * a * a;
        return {
          de: 'Rút gọn biểu thức $' + cc.tex(P.kq) + ' - ' + cc.tex(M.kq) + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Tích thứ nhất là $x^3 + ' + a + '^3$, tích thứ hai là $x^3 - ' + a + '^3$.', 'Trừ hai kết quả, nhớ dấu trừ đứng trước tích thứ hai.'],
          loiGiai: ['$= (x^3 + ' + a * a * a + ') - (x^3 - ' + a * a * a + ')$', '$= x^3 + ' + a * a * a + ' - x^3 + ' + a * a * a + ' = ' + kq + '$'],
          loiThuongGap: [{ gt: 0, giaiThich: 'Bỏ ngoặc có dấu trừ: $-(x^3 - ' + a * a * a + ') = -x^3 + ' + a * a * a + '$, không phải $-x^3 - ' + a * a * a + '$.' }]
        };
      }
      if (loai === 1) {
        // (x − a)(x² + ax + a²) − x³ + c  → −a³ + c … dùng dạng SGK: (x ± a)(…) ∓ x³
        var s = r.dau(), h = s > 0 ? P : M, kq2 = s * a * a * a;
        return {
          de: 'Rút gọn biểu thức $' + cc.tex(h.kq) + ' - x^3$.',
          dapAn: { kieu: 'so', gt: kq2 },
          goiY: ['Tích bằng $x^3 ' + h.dau + ' ' + a + '^3$.', 'Trừ đi $x^3$ thì chỉ còn lại một số.'],
          loiGiai: ['$= (x^3 ' + h.dau + ' ' + a * a * a + ') - x^3$', '$= ' + kq2 + '$'],
          loiThuongGap: [{ gt: -kq2, giaiThich: 'Dấu của $' + a + '^3$ trùng với dấu trong thừa số $(x ' + h.dau + ' ' + a + ')$.' }]
        };
      }
      // (x + y)(x² − xy + y²) + (x − y)(x² + xy + y²) = 2x³ ; hoặc hiệu = 2y³
      var cong = r.dau() > 0, X = hang(cc, 1, 'x', 1, 'y', 1), Y = hang(cc, 1, 'x', 1, 'y', -1);
      var kq3 = cong ? '2x^3' : '2y^3';
      return {
        de: 'Rút gọn biểu thức $' + cc.tex(X.kq) + (cong ? ' + ' : ' - ') + cc.tex(Y.kq) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq3, dang: 'khaiTrien' },
        goiY: ['Tích thứ nhất là $x^3 + y^3$, tích thứ hai là $x^3 - y^3$.', cong ? 'Cộng hai kết quả: $y^3$ và $-y^3$ triệt tiêu.' : 'Trừ hai kết quả, nhớ đổi dấu cả hai hạng tử của tích thứ hai.'],
        loiGiai: ['$= (x^3 + y^3) ' + (cong ? '+' : '-') + ' (x^3 - y^3)$', '$= ' + kq3 + '$'],
        loiThuongGap: [{ gt: cong ? '2y^3' : '2x^3', giaiThich: cong ? 'Cộng: $(x^3 + y^3) + (x^3 - y^3) = 2x^3$ (hai hạng tử $y^3$ triệt tiêu).' : 'Bỏ ngoặc có dấu trừ: $-(x^3 - y^3) = -x^3 + y^3$, nên $x^3$ triệt tiêu, còn lại $2y^3$.' }]
      };
    } }
  ]);
})();
