// Bài nền (lớp 7): Biểu thức đại số, đa thức một biến – cần cho Chương I, II, VI.
(function () {
  'use strict';
  // đa thức ascii gọn (cc.daThuc) → TeX có khoảng trắng quanh dấu: 4x^2-4 → 4x^2 - 4
  function tx(s) { return s.replace(/(.)([+-])/g, '$1 $2 '); }
  function coDau(n) { return n < 0 ? '- ' + (-n) : '+ ' + n; }
  function ngoac(n) { return n < 0 ? '(' + n + ')' : String(n); }

  TOAN8.nen({
    id: 'bieuThucDaiSo', ten: 'Biểu thức đại số và đa thức một biến', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Biểu thức đại số – giá trị của biểu thức',
        noiDung: 'Biểu thức đại số gồm các số và chữ (biến) nối bởi các phép toán, ví dụ $2x^2 - 3x + 1$.\n\nTính giá trị: **thay** biến bằng số rồi tính. Thay số âm thì đặt trong **ngoặc**: tại $x = -2$, $x^2 = (-2)^2 = 4$.' },
      { loai: 'dinhNghia', tieuDe: 'Đa thức một biến',
        noiDung: 'Đa thức một biến là tổng các đơn thức của cùng một biến, ví dụ $P(x) = 5x^3 - 2x + 7$.\n\n**Thu gọn**: cộng các hạng tử cùng lũy thừa (chỉ cộng hệ số, giữ nguyên phần biến): $3x^2 + 2x^2 = 5x^2$. Thường **sắp xếp** theo lũy thừa giảm dần.\n\n**Bậc** = số mũ lớn nhất của biến (sau khi thu gọn). Hệ số của lũy thừa cao nhất là **hệ số cao nhất**; số hạng không chứa biến là **hệ số tự do**.' },
      { loai: 'dinhLi', tieuDe: 'Cộng, trừ, nhân đa thức',
        noiDung: '**Trừ** đa thức: bỏ ngoặc có dấu "$-$" thì đổi dấu **mọi** hạng tử: $-(x^2 - 3x + 1) = -x^2 + 3x - 1$.\n\n**Nhân** đơn thức với đa thức: $a(b + c) = ab + ac$ (nhân với **từng** hạng tử). Nhân đa thức với đa thức: $(a + b)(c + d) = ac + ad + bc + bd$.\n\nĐọc ngược tính chất phân phối là **đặt nhân tử chung**: $ab + ac = a(b + c)$, ví dụ $6x^2 + 4x = 2x(3x + 2)$.' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** $-x^2$ tại $x = -3$ bằng $-9$ (không phải $9$); $x^2 + x^2 = 2x^2$ (không phải $x^4$); trừ đa thức mà chỉ đổi dấu hạng tử đầu.' }
    ],
    viDu: [
      { de: 'Tính giá trị của $2x^2 - 3x + 1$ tại $x = -2$.', buoc: [
        { lam: '$2 \\cdot (-2)^2 - 3 \\cdot (-2) + 1$', vi: 'Thay $x$ bằng $-2$, nhớ đặt $-2$ trong ngoặc.' },
        { lam: '$= 2 \\cdot 4 + 6 + 1 = 15$', vi: 'Lũy thừa trước: $(-2)^2 = 4$; $-3 \\cdot (-2) = 6$.' }] },
      { de: 'Thu gọn, sắp xếp rồi tìm bậc của $P(x) = 4x - 2x^3 + 5 + x^3 - 3x + 2x^3$.', buoc: [
        { lam: '$P(x) = (-2x^3 + x^3 + 2x^3) + (4x - 3x) + 5 = x^3 + x + 5$', vi: 'Gom các hạng tử cùng lũy thừa rồi cộng hệ số.' },
        { lam: 'Bậc của $P(x)$ là $3$, hệ số cao nhất là $1$, hệ số tự do là $5$.', vi: 'Bậc là số mũ lớn nhất sau khi đã thu gọn.' }] }
    ],
    luyen: [
      { ten: 'Giá trị của biểu thức', muc: 1, sinh: function (r, cc) {
        var a = r.khac0(-4, 4), b = r.khac0(-6, 6), c = r.so(-9, 9), v = r.khac0(-4, 4);
        var bt = tx(cc.daThuc([[a, 'x^2'], [b, 'x'], [c, '']]));
        var A1 = a * v * v, B1 = b * v, kq = A1 + B1 + c;
        var thay = (a === 1 ? '' : a === -1 ? '-' : a + ' \\cdot ') + ngoac(v) + '^2 ' + (b === 1 ? '+ ' : b === -1 ? '- ' : coDau(b) + ' \\cdot ') + ngoac(v) + (c ? ' ' + coDau(c) : '');
        var ltg = [];
        if (v < 0 && -A1 + B1 + c !== kq) ltg.push({ gt: -A1 + B1 + c, giaiThich: '$(' + v + ')^2 = ' + v * v + '$ là số **dương**. Em nhớ đặt số âm trong ngoặc khi thay vào.' });
        return {
          de: 'Tính giá trị của biểu thức $' + bt + '$ tại $x = ' + v + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Thay $x = ' + v + '$ vào biểu thức' + (v < 0 ? ' (đặt $' + v + '$ trong ngoặc)' : '') + '.', 'Tính lũy thừa trước, rồi nhân, cuối cùng cộng trừ.'],
          loiGiai: ['$' + thay + '$', '$= ' + A1 + ' ' + coDau(B1) + (c ? ' ' + coDau(c) : '') + ' = ' + kq + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Bậc của đa thức', muc: 1, sinh: function (r, cc) {
        var d = r.so(2, 4), k = r.khac0(-5, 5), bay = r.dau() > 0, t = r.khac0(-4, 4);
        var mu = function (n) { return n === 0 ? '' : n === 1 ? 'x' : 'x^' + n; };
        var thap = r.khacNhau(2, 0, d - 1).map(function (n) { return [r.khac0(-9, 9), mu(n)]; });
        var hang = r.xaoTron([[k, mu(d)]].concat(thap));
        if (bay) { hang.splice(r.so(0, 1), 0, [t, mu(d + 1)]); hang.push([-t, mu(d + 1)]); }
        var gon = [[k, mu(d)]].concat(thap.slice().sort(function (p, q) { return q[1].length - p[1].length || (q[1] > p[1] ? 1 : -1); }));
        var ltg = bay ? [{ gt: d + 1, giaiThich: 'Phải **thu gọn** trước: hai hạng tử chứa $x^{' + (d + 1) + '}$ đối nhau, cộng lại bằng $0$.' }] : [];
        return {
          de: 'Tìm bậc của đa thức $P(x) = ' + tx(cc.daThuc(hang)) + '$.',
          dapAn: { kieu: 'so', gt: d },
          goiY: ['Bậc là số mũ lớn nhất của biến **sau khi thu gọn**.', bay ? 'Xem các hạng tử chứa $x^{' + (d + 1) + '}$ cộng lại bằng bao nhiêu.' : 'Tìm hạng tử có số mũ lớn nhất.'],
          loiGiai: (bay ? ['Thu gọn: $' + tx(cc.daThuc([[t, mu(d + 1)], [-t, mu(d + 1)]])) + ' = 0$.'] : [])
            .concat(['$P(x) = ' + tx(cc.daThuc(gon)) + '$', 'Hạng tử có số mũ lớn nhất là $' + tx(cc.daThuc([[k, mu(d)]])) + '$ nên bậc của $P(x)$ là $' + d + '$.']),
          loiThuongGap: ltg
        };
      } },
      { ten: 'Thu gọn đa thức', muc: 2, sinh: function (r, cc) {
        var a1 = r.khac0(-6, 6), a2 = r.khac0(-6, 6), b1 = r.khac0(-9, 9), b2 = r.khac0(-9, 9), c1 = r.khac0(-9, 9), c2 = r.khac0(-9, 9);
        while (a1 + a2 === 0) a2 = r.khac0(-6, 6);
        var A = a1 + a2, B = b1 + b2, C = c1 + c2;
        var hang = r.xaoTron([[a1, 'x^2'], [b1, 'x'], [c1, ''], [a2, 'x^2'], [b2, 'x'], [c2, '']]);
        var kq = cc.daThuc([[A, 'x^2'], [B, 'x'], [C, '']]);
        var gom = '(' + tx(cc.daThuc([[a1, 'x^2'], [a2, 'x^2']])) + ') + (' + tx(cc.daThuc([[b1, 'x'], [b2, 'x']])) + ') + (' + tx(cc.daThuc([[c1, ''], [c2, '']])) + ')';
        return {
          de: 'Thu gọn và sắp xếp theo lũy thừa giảm dần của biến: $' + tx(cc.daThuc(hang)) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Gom các hạng tử cùng lũy thừa của $x$ vào một nhóm.', 'Cộng các hệ số trong mỗi nhóm, giữ nguyên phần biến.'],
          loiGiai: ['$= ' + gom + '$', '$= ' + tx(kq) + '$'],
          loiThuongGap: [{ gt: cc.daThuc([[A, 'x^4'], [B, 'x^2'], [C, '']]), giaiThich: 'Cộng hai hạng tử đồng dạng chỉ cộng **hệ số**, giữ nguyên phần biến: $x^2 + x^2 = 2x^2$ (không phải $2x^4$).' }]
        };
      } },
      { ten: 'Cộng, trừ hai đa thức', muc: 2, sinh: function (r, cc) {
        var p = [r.khac0(-6, 6), r.khac0(-9, 9), r.khac0(-9, 9)], q = [r.khac0(-6, 6), r.khac0(-9, 9), r.khac0(-9, 9)], tru = r.dau() > 0;
        var s = tru ? -1 : 1, mu = ['x^2', 'x', ''];
        var P = cc.daThuc(p.map(function (c, i) { return [c, mu[i]]; })), Q = cc.daThuc(q.map(function (c, i) { return [c, mu[i]]; }));
        var boNgoac = cc.daThuc(p.map(function (c, i) { return [c, mu[i]]; }).concat(q.map(function (c, i) { return [s * c, mu[i]]; })));
        var kq = cc.daThuc(p.map(function (c, i) { return [c + s * q[i], mu[i]]; }));
        var ltg = tru ? [{ gt: cc.daThuc([[p[0] - q[0], 'x^2'], [p[1] + q[1], 'x'], [p[2] + q[2], '']]), giaiThich: 'Bỏ ngoặc có dấu "$-$" đằng trước phải đổi dấu **tất cả** các hạng tử của $Q(x)$, không chỉ hạng tử đầu.' }] : [];
        return {
          de: 'Cho $P(x) = ' + tx(P) + '$ và $Q(x) = ' + tx(Q) + '$. Tính $P(x) ' + (tru ? '-' : '+') + ' Q(x)$.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: [tru ? 'Viết $(' + tx(P) + ') - (' + tx(Q) + ')$ rồi bỏ ngoặc: đổi dấu mọi hạng tử của $Q(x)$.' : 'Viết $(' + tx(P) + ') + (' + tx(Q) + ')$ rồi bỏ ngoặc.', 'Cộng các hạng tử cùng lũy thừa.'],
          loiGiai: ['$P(x) ' + (tru ? '-' : '+') + ' Q(x) = (' + tx(P) + ') ' + (tru ? '-' : '+') + ' (' + tx(Q) + ')$', '$= ' + tx(boNgoac) + '$', '$= ' + tx(kq) + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Nhân đa thức, đặt nhân tử chung', muc: 3, sinh: function (r, cc) {
        var loai = r.chon([0, 1, 2]), de, kq, dang, goiY, loiGiai, ltg = [];
        if (loai === 0) {
          var k = r.khac0(-5, 5), a = r.khac0(-5, 5), b = r.khac0(-9, 9);
          while (Math.abs(k) < 2) k = r.khac0(-5, 5);
          var kx = tx(cc.daThuc([[k, 'x']])), trong = tx(cc.daThuc([[a, 'x'], [b, '']]));
          kq = cc.daThuc([[k * a, 'x^2'], [k * b, 'x']]); dang = 'khaiTrien';
          de = 'Thực hiện phép nhân: $' + kx + '(' + trong + ')$.';
          var ax = a < 0 ? '(' + tx(cc.daThuc([[a, 'x']])) + ')' : tx(cc.daThuc([[a, 'x']])), kx2 = k < 0 ? '(' + kx + ')' : kx;
          goiY = ['Nhân đơn thức $' + kx + '$ với **từng** hạng tử trong ngoặc.', '$' + kx + ' \\cdot ' + ax + '$ và $' + kx + ' \\cdot ' + ngoac(b) + '$.'];
          loiGiai = ['$' + kx + '(' + trong + ') = ' + kx + ' \\cdot ' + ax + ' + ' + kx2 + ' \\cdot ' + ngoac(b) + '$', '$= ' + tx(kq) + '$'];
          ltg.push({ gt: cc.daThuc([[k * a, 'x^2'], [b, '']]), giaiThich: 'Em mới nhân $' + kx + '$ với hạng tử đầu. Phải nhân với **cả** $' + ngoac(b) + '$.' });
        } else if (loai === 1) {
          var m = r.khac0(-9, 9), n = r.khac0(-9, 9);
          var x1 = tx(cc.daThuc([[1, 'x'], [m, '']])), x2 = tx(cc.daThuc([[1, 'x'], [n, '']]));
          kq = cc.daThuc([[1, 'x^2'], [m + n, 'x'], [m * n, '']]); dang = 'khaiTrien';
          de = 'Thực hiện phép nhân: $(' + x1 + ')(' + x2 + ')$.';
          goiY = ['Nhân mỗi hạng tử của đa thức này với **từng** hạng tử của đa thức kia.', '$x \\cdot x + x \\cdot ' + ngoac(n) + ' + ' + ngoac(m) + ' \\cdot x + ' + ngoac(m) + ' \\cdot ' + ngoac(n) + '$.'];
          var hx = function (t) { return (t < 0 ? '- ' : '+ ') + (Math.abs(t) === 1 ? '' : Math.abs(t)) + 'x'; };
          loiGiai = ['$(' + x1 + ')(' + x2 + ') = x^2 ' + hx(n) + ' ' + hx(m) + ' ' + coDau(m * n) + '$', '$= ' + tx(kq) + '$'];
          if (m + n !== 0) ltg.push({ gt: cc.daThuc([[1, 'x^2'], [m * n, '']]), giaiThich: 'Em quên hai tích "chéo" $x \\cdot ' + ngoac(n) + '$ và $' + ngoac(m) + ' \\cdot x$.' });
        } else {
          var g = r.so(1, 5), p = r.so(1, 6), q = r.khac0(-9, 9);
          while (cc.ucln(p, q) !== 1) q = r.khac0(-9, 9);
          var bt = tx(cc.daThuc([[g * p, 'x^2'], [g * q, 'x']])), chung = g === 1 ? 'x' : g + 'x';
          kq = chung + '(' + cc.daThuc([[p, 'x'], [q, '']]) + ')'; dang = 'nhanTu';
          de = 'Viết $' + bt + '$ thành một tích bằng cách đặt nhân tử chung (lấy nhân tử chung lớn nhất).';
          goiY = ['Tìm ƯCLN của các hệ số và lũy thừa nhỏ nhất của $x$ có trong mọi hạng tử.', 'Nhân tử chung là $' + chung + '$.'];
          loiGiai = ['$' + bt + ' = ' + chung + ' \\cdot ' + tx(cc.daThuc([[p, 'x']])) + ' ' + coDau(q).replace(/^([+-]) /, '$1 ' + (g === 1 ? 'x' : chung) + ' \\cdot ') + '$', '$= ' + chung + '(' + tx(cc.daThuc([[p, 'x'], [q, '']])) + ')$'];
        }
        return { de: de, dapAn: { kieu: 'bieuThuc', gt: kq, dang: dang }, goiY: goiY, loiGiai: loiGiai, loiThuongGap: ltg };
      } }
    ]
  });
})();
