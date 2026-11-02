// Luyện thêm – Bài 1: Đơn thức
(function () {
  'use strict';
  // phần biến x^a y^b (bỏ số mũ 1, bỏ biến mũ 0)
  function bien(ex, ey) {
    var s = '';
    if (ex) s += 'x' + (ex > 1 ? '^' + ex : '');
    if (ey) s += 'y' + (ey > 1 ? '^' + ey : '');
    return s;
  }
  function don(cc, c, ex, ey) { return cc.daThuc([[c, bien(ex, ey)]]); }
  // cc.tex viết hệ số âm đứng đầu thành (−4)x; tách dấu trừ ra cho gọn
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  function ngoac(c) { return c < 0 ? '(' + c + ')' : String(c); }

  TOAN8.luyen(1, [
    { ten: 'Thu gọn tích hai đơn thức', muc: 1, sinh: function (r, cc) {
      var a = r.khac0(-5, 6), b = r.khac0(-5, 6);
      while (Math.abs(a) === 1 && Math.abs(b) === 1) b = r.khac0(-5, 6);
      var p = r.so(1, 4), q = r.so(0, 3), m = r.so(1, 3), n = r.so(1, 3);
      if (q === 0 && r.dau() > 0) q = 1;
      var A = don(cc, a, p, q), B = don(cc, b, m, n), kq = don(cc, a * b, p + m, q + n);
      var ltg = [];
      if (a + b !== a * b && a + b !== 0) ltg.push({ gt: don(cc, a + b, p + m, q + n), giaiThich: 'Khi **nhân** hai đơn thức thì hệ số cũng **nhân**: $' + ngoac(a) + ' \\cdot ' + ngoac(b) + ' = ' + a * b + '$, không cộng.' });
      if (p * m !== p + m) ltg.push({ gt: don(cc, a * b, p * m, q + n), giaiThich: 'Nhân hai lũy thừa cùng cơ số thì **cộng** số mũ: $x^{' + p + '} \\cdot x^{' + m + '} = x^{' + (p + m) + '}$, không nhân số mũ.' });
      return {
        de: 'Thu gọn đơn thức $' + tx(cc, A) + ' \\cdot ' + (b < 0 ? '(' + tx(cc, B) + ')' : tx(cc, B)) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Nhân các số với nhau, nhân các lũy thừa của cùng một biến với nhau.',
          'Hệ số: $' + ngoac(a) + ' \\cdot ' + ngoac(b) + '$. Phần biến: $x^{' + p + '} \\cdot x^{' + m + '} = x^{' + p + ' + ' + m + '}$, làm tương tự với $y$ (nhớ $y = y^1$).'],
        loiGiai: ['$= [' + a + ' \\cdot ' + ngoac(b) + '] \\cdot (x^{' + p + '} \\cdot x^{' + m + '}) \\cdot ' + (q ? '(y^{' + q + '} \\cdot y^{' + n + '})' : 'y^{' + n + '}') + '$',
          '$' + tx(cc, A) + ' \\cdot ' + (b < 0 ? '(' + tx(cc, B) + ')' : tx(cc, B)) + ' = ' + tx(cc, kq) + '$'],
        loiThuongGap: ltg.slice(0, 2)
      };
    } },

    { ten: 'Bậc của đơn thức', muc: 1, sinh: function (r, cc) {
      var c = r.khac0(-9, 9), p = r.so(1, 5), q = r.so(1, 4), coZ = r.dau() > 0, t = coZ ? r.so(1, 3) : 0;
      var phan = bien(p, q) + (t ? 'z' + (t > 1 ? '^' + t : '') : '');
      var bac = p + q + t, mu = [p, q].concat(t ? [t] : []);
      var so1 = mu.filter(function (e) { return e === 1; }).length;
      var ltg = [];
      if (so1 && bac - so1 !== bac) ltg.push({ gt: bac - so1, giaiThich: 'Biến không ghi số mũ có số mũ là $1$ (vì $y = y^1$), vẫn phải cộng vào bậc.' });
      var lon = Math.max.apply(null, mu);
      if (lon !== bac && lon !== bac - so1) ltg.push({ gt: lon, giaiThich: 'Bậc là **tổng** số mũ của tất cả các biến, không phải số mũ lớn nhất.' });
      if (Math.abs(c) + bac !== bac && ltg.length < 2 && Math.abs(c) + bac !== lon) ltg.push({ gt: Math.abs(c) + bac, giaiThich: 'Hệ số không tính vào bậc. Bậc chỉ là tổng số mũ của các biến.' });
      var tex = tx(cc, cc.daThuc([[c, phan]]));
      return {
        de: 'Tìm bậc của đơn thức $' + tex + '$.',
        dapAn: { kieu: 'so', gt: bac },
        goiY: ['Bậc của đơn thức là **tổng số mũ** của các biến; hệ số không tính.', 'Viết rõ số mũ của từng biến (biến không ghi số mũ thì số mũ là $1$) rồi cộng lại.'],
        loiGiai: ['Số mũ của các biến lần lượt là ' + mu.map(function (e) { return '$' + e + '$'; }).join(', ') + '.',
          'Bậc $= ' + mu.join(' + ') + ' = ' + bac + '$'],
        loiThuongGap: ltg.slice(0, 2)
      };
    } },

    { ten: 'Cộng, trừ đơn thức đồng dạng', muc: 1, sinh: function (r, cc) {
      var p = r.so(1, 3), q = r.so(0, 3);
      if (p + q < 2) q = 1;
      var a = r.khac0(-9, 9), b = r.khac0(-9, 9), c = r.khac0(-5, 5), ba = r.dau() > 0;
      var ph = bien(p, q);
      if (!ba) {
        // A − B với B âm hay gặp lỗi dấu
        b = -r.so(2, 9);
        var kq = a - b;
        if (kq === 0) a += 1, kq = a - b;
        var A = don(cc, a, p, q), B = don(cc, b, p, q), K = don(cc, kq, p, q);
        var ltg = [{ gt: don(cc, a + b, p, q), giaiThich: 'Trừ một số âm là cộng số đối: $' + a + ' - (' + b + ') = ' + a + ' + ' + (-b) + ' = ' + kq + '$.' }];
        if (a + b === kq) ltg = [];
        ltg.push({ gt: don(cc, kq, 2 * p, 2 * q), giaiThich: 'Cộng, trừ đơn thức đồng dạng chỉ làm với hệ số, **giữ nguyên** phần biến $' + tx(cc, ph) + '$.' });
        return {
          de: 'Cho $A = ' + tx(cc, A) + '$ và $B = ' + tx(cc, B) + '$. Tính $A - B$.',
          dapAn: { kieu: 'bieuThuc', gt: K, dang: 'khaiTrien' },
          goiY: ['Hai đơn thức đồng dạng: trừ hệ số, giữ nguyên phần biến.', '$A - B = [' + a + ' - (' + b + ')]' + tx(cc, ph) + '$. Trừ một số âm là cộng số đối của nó.'],
          loiGiai: ['$A - B = ' + tx(cc, A) + ' - (' + tx(cc, B) + ') = [' + a + ' - (' + b + ')]' + tx(cc, ph) + '$',
            '$A - B = ' + tx(cc, K) + '$'],
          loiThuongGap: ltg
        };
      }
      var tong = a + b + c;
      if (tong === 0) { c += c > 0 ? 1 : -1; tong = a + b + c; }
      var bt = cc.daThuc([[a, ph], [b, ph], [c, ph]]), K2 = don(cc, tong, p, q);
      return {
        de: 'Tính $' + tx(cc, bt) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: K2, dang: 'khaiTrien' },
        goiY: ['Ba đơn thức đồng dạng (cùng phần biến $' + tx(cc, ph) + '$): cộng các hệ số, giữ nguyên phần biến.', 'Hạng tử nào chỉ ghi $' + tx(cc, ph) + '$ hay $-' + tx(cc, ph) + '$ thì hệ số là $1$ hay $-1$. Nhớ mang theo dấu.'],
        loiGiai: ['$' + tx(cc, bt) + ' = (' + a + ' ' + (b < 0 ? '- ' + (-b) : '+ ' + b) + ' ' + (c < 0 ? '- ' + (-c) : '+ ' + c) + ')' + tx(cc, ph) + '$',
          '$= ' + tx(cc, K2) + '$'],
        loiThuongGap: [{ gt: don(cc, tong, 3 * p, 3 * q), giaiThich: 'Khi **cộng** đơn thức đồng dạng thì số mũ giữ nguyên, không cộng số mũ.' }]
      };
    } },

    { ten: 'Thu gọn rồi tìm hệ số và bậc', muc: 2, sinh: function (r, cc) {
      var mau = r.chon([2, 3, 4]), a = r.chon([-1, 1, -2, 2, -3, 3, -5, 5]), b = mau * r.khac0(-3, 3);
      while (cc.ucln(a, mau) !== 1) a = r.chon([-1, 1, -2, 2, -3, 3, -5, 5]);
      var p = r.so(1, 3), q = r.so(1, 2), m = r.so(1, 2), n = r.so(1, 3);
      var hs = a * b / mau;
      var bac = p + m + q + n + 1;
      var phanA = bien(p, q), phanB = bien(m, n) + 'z';
      var kq = cc.daThuc([[hs, bien(p + m, q + n) + 'z']]);
      var dauA = a < 0 ? '-' : '';
      var deA = dauA + '\\frac{' + Math.abs(a) + '}{' + mau + '}' + tx(cc, phanA);
      var deB = tx(cc, cc.daThuc([[b, phanB]]));
      return {
        de: 'Thu gọn đơn thức $' + deA + ' \\cdot ' + (b < 0 ? '(' + deB + ')' : deB) + '$, rồi cho biết hệ số và bậc của nó.',
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien', nhan: 'Đơn thức thu gọn',
            loiThuongGap: [{ gt: cc.daThuc([[hs, bien(p * m, q * n) + 'z']]), giaiThich: 'Nhân lũy thừa cùng biến phải **cộng** số mũ.' }].filter(function () { return p * m !== p + m || q * n !== q + n; }) },
          { kieu: 'so', gt: hs, nhan: 'Hệ số' },
          { kieu: 'so', gt: bac, nhan: 'Bậc',
            loiThuongGap: [{ gt: bac - 1, giaiThich: 'Biến $z$ có số mũ $1$, cũng phải cộng vào bậc.' }] }] },
        goiY: ['Nhân các số với nhau, nhân các lũy thừa cùng biến (cộng số mũ). Bậc = tổng số mũ các biến.',
          'Hệ số: $' + deA.replace(tx(cc, phanA), '') + ' \\cdot ' + ngoac(b) + '$. Đừng quên biến $z$ (số mũ $1$).'],
        loiGiai: ['$= \\left(' + dauA + '\\frac{' + Math.abs(a) + '}{' + mau + '} \\cdot ' + ngoac(b) + '\\right)(x^{' + p + '} \\cdot x^{' + m + '})(y^{' + q + '} \\cdot y^{' + n + '})z = ' + tx(cc, kq) + '$',
          'Hệ số là $' + hs + '$; bậc là $' + (p + m) + ' + ' + (q + n) + ' + 1 = ' + bac + '$.']
      };
    } },

    { ten: 'Giá trị của đơn thức', muc: 2, sinh: function (r, cc) {
      var c = r.khac0(-4, 4), p = r.chon([2, 2, 3]), q = r.so(1, 2);
      var x = r.chon([-3, -2, -1, 1, 2, 3]), y = r.chon([-2, -1, 1, 2]);
      if (p === 3 && Math.abs(x) === 3) x = x > 0 ? 2 : -2;
      var kq = c * Math.pow(x, p) * Math.pow(y, q);
      var phan = bien(p, q), tex = tx(cc, don(cc, c, p, q));
      var ltg = [];
      if (x < 0 && p % 2 === 0) ltg.push({ gt: -kq, giaiThich: 'Lũy thừa bậc chẵn của số âm là số **dương**: $(' + x + ')^' + p + ' = ' + Math.pow(x, p) + '$.' });
      var sai = Math.pow(c * x, p) * Math.pow(y, q);
      if (Math.abs(c) !== 1 && sai !== kq && (!ltg.length || sai !== ltg[0].gt)) ltg.push({ gt: sai, giaiThich: 'Chỉ có $x$ được nâng lên lũy thừa: $' + tex + '$ là $' + c + ' \\cdot x^' + p + '$, không phải $(' + c + 'x)^' + p + '$.' });
      return {
        de: 'Tính giá trị của đơn thức $' + tex + '$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Thay giá trị của $x$, $y$ vào đơn thức. Tính lũy thừa trước rồi mới nhân.', 'Số âm thì đặt trong ngoặc: $(' + x + ')^' + p + ' = ' + Math.pow(x, p) + '$.'],
        loiGiai: ['$' + tex + ' = ' + c + ' \\cdot ' + ngoac(x) + '^' + p + ' \\cdot ' + ngoac(y) + (q > 1 ? '^' + q : '') + '$',
          '$= ' + c + ' \\cdot ' + ngoac(Math.pow(x, p)) + ' \\cdot ' + ngoac(Math.pow(y, q)) + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var vat = r.chon([['kg gạo', 'kg', 'hộp sữa', 'hộp'], ['kg đường', 'kg', 'gói bánh', 'gói'], ['quyển vở', 'quyển', 'cây bút', 'cây']]);
        var a = r.so(8, 25), b = r.so(3, 12);
        while (b === a) b = r.so(3, 12);
        var kq = (a + b) + 'xy';
        return {
          de: 'Mỗi phần quà gồm $x$ ' + vat[0] + ' (giá $' + a + '$ nghìn đồng/' + vat[1] + ') và $x$ ' + vat[2] + ' (giá $' + b + '$ nghìn đồng/' + vat[3] + '). Viết **đơn thức thu gọn** biểu thị tổng số tiền (nghìn đồng) của $y$ phần quà.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Tiền ' + vat[0].split(' ')[1] + ' của $y$ phần quà là $' + a + ' \\cdot x \\cdot y$; tiền ' + vat[2].split(' ')[1] + ' tính tương tự.', 'Cộng hai đơn thức đồng dạng.'],
          loiGiai: ['Tiền ' + vat[0].split(' ')[1] + ': $' + a + 'xy$; tiền ' + vat[2].split(' ')[1] + ': $' + b + 'xy$.', 'Tổng số tiền: $' + a + 'xy + ' + b + 'xy = ' + kq + '$'],
          loiThuongGap: [{ gt: (a + b) + 'x^2y^2', giaiThich: 'Khi cộng $' + a + 'xy + ' + b + 'xy$ chỉ cộng hệ số, phần biến vẫn là $xy$.' },
            { gt: (a + b) + 'x', giaiThich: 'Đó là giá tiền **một** phần quà. Có $y$ phần quà nên phải nhân thêm với $y$.' }]
        };
      }
      var d = r.so(3, 6), rr = r.so(2, d - 1), h = r.so(2, 4);
      var kq2 = (d * rr * h) + 'x^2y';
      return {
        de: 'Một bể nước hình hộp chữ nhật có chiều dài $' + d + 'x$ (dm), chiều rộng $' + rr + 'x$ (dm) và chiều cao $' + h + 'y$ (dm). Viết đơn thức thu gọn biểu thị thể tích của bể (dm³).',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'khaiTrien' },
        goiY: ['Thể tích hình hộp chữ nhật = dài × rộng × cao.', 'Nhân các hệ số với nhau: $' + d + ' \\cdot ' + rr + ' \\cdot ' + h + '$; nhân phần biến: $x \\cdot x \\cdot y$.'],
        loiGiai: ['$V = ' + d + 'x \\cdot ' + rr + 'x \\cdot ' + h + 'y = (' + d + ' \\cdot ' + rr + ' \\cdot ' + h + ')(x \\cdot x)y$', '$V = ' + tx(cc, kq2) + '$'],
        loiThuongGap: [{ gt: (d * rr * h) + 'xy', giaiThich: 'Có hai thừa số $x$ nên $x \\cdot x = x^2$, không phải $x$.' },
          { gt: (d + rr + h) + 'x^2y', giaiThich: 'Thể tích là **tích** ba kích thước: hệ số là $' + d + ' \\cdot ' + rr + ' \\cdot ' + h + '$, không phải tổng.' }]
      };
    } }
  ]);
})();
