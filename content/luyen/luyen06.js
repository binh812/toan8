// Luyện thêm – Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu
(function () {
  'use strict';
  function nhan(a) { return a === 1 ? '' : String(a); }
  // (3x)^2 nhưng x^2, 9^2 (không cần ngoặc)
  function bp(s) { return /^([0-9]+|[a-z])$/.test(s) ? s + '^2' : '(' + s + ')^2'; }
  // Hình lời giải theo chính số của đề: mảnh ghép hình vuông (cảnh manhVuong của bài 6)
  function dep(s) { return String(s).replace(/\^2/g, '²').replace(/-/g, '−'); }
  function hinh(dang, tenA, tenB, nhan) {
    var to = dang === 'tong';
    return { widget: 'canh', config: { ten: 'manhVuong', chiXem: true, t: 1, thamSo: { a: to ? 4 : 5, b: 2 },
      tuyChon: { dang: dang, tenA: tenA, tenB: tenB, nhan: nhan }, ghiChu: to ? null : 'Hình vẽ khi ' + tenA + ' lớn hơn ' + tenB + '.' } };
  }

  TOAN8.luyen(6, [
    { ten: 'Khai triển (ax ± b)²', muc: 1, sinh: function (r, cc) {
      var a = r.chon([1, 1, 2, 3]), b = r.so(1, 9), s = r.dau(), dau = s > 0 ? '+' : '-';
      var de = '(' + nhan(a) + 'x' + dau + b + ')^2';
      var kq = cc.daThuc([[a * a, 'x^2'], [2 * a * b * s, 'x'], [b * b, '']]);
      return {
        de: 'Khai triển $' + cc.tex(de) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        hinhGiai: hinh(s > 0 ? 'tong' : 'hieu', nhan(a) + 'x', String(b), { a2: dep(cc.daThuc([[a * a, 'x^2']])), ab: dep(cc.daThuc([[a * b, 'x']])), b2: String(b * b), hieu: nhan(a) + 'x−' + b }),
        goiY: ['Dùng $(A ' + dau + ' B)^2 = A^2 ' + dau + ' 2AB + B^2$ với $A = ' + cc.tex(nhan(a) + 'x') + '$ và $B = ' + b + '$.',
          'Tính lần lượt $A^2$, $2AB$ và $B^2$ rồi ghép lại.'],
        loiGiai: ['$A^2 = ' + cc.tex(cc.daThuc([[a * a, 'x^2']])) + '$; $2AB = ' + cc.tex(2 * a * b + 'x') + '$; $B^2 = ' + b * b + '$.',
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
        hinhGiai: hinh(s > 0 ? 'tong' : 'hieu', 'x', String(k), { a2: 'x²', ab: dep(cc.daThuc([[k, 'x']])), b2: String(k * k), hieu: 'x−' + k }),
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
    } },
    { ten: 'Viết hiệu hai bình phương thành tích', muc: 2, sinh: function (r, cc) {
      var a = r.chon([1, 1, 2, 3, 4]), b = r.so(1, 9), coY = r.dau() > 0, nguoc = r.dau() > 0;
      while (cc.ucln(a, b) !== 1) b = r.so(1, 9);
      if (a === 1 && b === 1) b = r.so(2, 9);
      var A = nhan(a) + 'x', B = coY ? nhan(b) + 'y' : String(b);
      var A2 = cc.daThuc([[a * a, 'x^2']]), B2 = coY ? cc.daThuc([[b * b, 'y^2']]) : String(b * b);
      // nguoc: B² − A² = (B − A)(B + A)
      var P = nguoc ? B : A, Q = nguoc ? A : B, P2 = nguoc ? B2 : A2, Q2 = nguoc ? A2 : B2;
      var kq = '(' + P + '-' + Q + ')(' + P + '+' + Q + ')';
      return {
        de: 'Viết $' + cc.tex(P2 + '-' + Q2) + '$ dưới dạng tích.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
        hinhGiai: hinh('hieuHaiBP', P, Q, { a2: dep(P2), b2: dep(Q2) }),
        goiY: ['Viết mỗi hạng tử thành một bình phương: $' + cc.tex(P2) + ' = ' + bp(P) + '$, $' + cc.tex(Q2) + ' = ' + bp(Q) + '$.',
          'Dùng $A^2 - B^2 = (A - B)(A + B)$.'],
        loiGiai: ['$' + cc.tex(P2 + '-' + Q2) + ' = ' + bp(P) + ' - ' + bp(Q) + '$',
          '$= ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: '(' + P + '-' + Q + ')^2', giaiThich: 'Hiệu hai bình phương là $(A - B)(A + B)$, không phải $(A - B)^2$ (vì $(A - B)^2$ còn có hạng tử $-2AB$).' }]
      };
    } },
    { ten: 'Rút gọn biểu thức', muc: 3, sinh: function (r, cc) {
      var a = r.so(1, 7);
      if (r.dau() > 0) {
        var kq = 4 * a + 'x';
        return {
          de: 'Rút gọn biểu thức $(x + ' + a + ')^2 - (x - ' + a + ')^2$.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Khai triển từng bình phương, hoặc dùng luôn $A^2 - B^2 = (A - B)(A + B)$ với $A = x + ' + a + '$, $B = x - ' + a + '$.',
            'Trước ngoặc thứ hai có dấu trừ: phải đổi dấu **cả ba** hạng tử.'],
          loiGiai: ['$= (' + cc.tex(cc.daThuc([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])) + ') - (' + cc.tex(cc.daThuc([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])) + ')$',
            '$= ' + cc.tex(cc.daThuc([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])) + ' - x^2 + ' + 2 * a + 'x - ' + a * a + ' = ' + kq + '$'],
          loiThuongGap: [{ gt: cc.daThuc([[4 * a, 'x'], [2 * a * a, '']]), giaiThich: 'Khi bỏ ngoặc có dấu trừ, hạng tử $' + a * a + '$ cũng phải đổi thành $-' + a * a + '$.' }]
        };
      }
      // (x + a)(x − a) − (x − a)² = 2ax − 2a²
      var kq2 = cc.daThuc([[2 * a, 'x'], [-2 * a * a, '']]);
      return {
        de: 'Rút gọn biểu thức $(x + ' + a + ')(x - ' + a + ') - (x - ' + a + ')^2$.',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'khaiTrien' },
        goiY: ['$(x + ' + a + ')(x - ' + a + ')$ là hiệu hai bình phương; $(x - ' + a + ')^2$ là bình phương của một hiệu.', 'Khai triển xong, bỏ ngoặc có dấu trừ phải đổi dấu cả ba hạng tử.'],
        loiGiai: ['$= (x^2 - ' + a * a + ') - (' + cc.tex(cc.daThuc([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])) + ')$',
          '$= x^2 - ' + a * a + ' - x^2 + ' + 2 * a + 'x - ' + a * a + ' = ' + cc.tex(kq2) + '$'],
        loiThuongGap: [{ gt: -2 * a + 'x', giaiThich: 'Bỏ ngoặc có dấu trừ phải đổi dấu **tất cả**: $-(x^2 - ' + 2 * a + 'x + ' + a * a + ') = -x^2 + ' + 2 * a + 'x - ' + a * a + '$.' }]
      };
    } }
  ]);
})();
