TOAN8.luyen(901, [
  { ten: 'Khai triển (x + a)²', muc: 1, sinh: function (r, cc) {
    var a = r.khac0(-9, 9), bp = '(x' + (a > 0 ? '+' : '') + a + ')^2', kq = cc.daThuc([[1, 'x^2'], [2 * a, 'x'], [a * a, '']]);
    return { de: 'Khai triển $' + cc.tex(bp) + '$.',
      dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
      goiY: ['Dùng hằng đẳng thức bình phương của một tổng/hiệu.'],
      loiGiai: ['$' + cc.tex(bp) + ' = ' + cc.tex(kq) + '$'],
      loiThuongGap: [{ gt: 'x^2+' + (a * a), giaiThich: 'Em quên hạng tử $2ab$.' }] };
  } },
  { ten: 'Tính tổng', muc: 2, sinh: function (r) {
    var a = r.so(1, 9), b = r.so(1, 9);
    return { de: 'Tính $' + a + ' + ' + b + '$.', dapAn: { kieu: 'so', gt: a + b }, goiY: ['Cộng hai số.'], loiGiai: ['$' + a + ' + ' + b + ' = ' + (a + b) + '$'] };
  } }
]);
