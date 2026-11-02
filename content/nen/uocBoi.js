// Bài nền (lớp 6): Phân tích ra thừa số nguyên tố, ƯCLN, BCNN – cần cho Chương VI (quy đồng, rút gọn phân thức).
(function () {
  'use strict';
  function themLoi(ds, gt, dap, giaiThich) {
    if (gt === dap || ds.some(function (l) { return l.gt === gt; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }
  // phân tích n (thừa số đến 13) → { mu: {2: a, ...}, tex: '2^{3} \\cdot 3', chia: ['72 : 2 = 36', …] }
  function phanTich(n) {
    var mu = {}, chia = [], ps = [2, 3, 5, 7, 11, 13], x = n;
    ps.forEach(function (p) { while (x % p === 0) { chia.push(x + ' : ' + p + ' = ' + x / p); x /= p; mu[p] = (mu[p] || 0) + 1; } });
    var tex = ps.filter(function (p) { return mu[p]; }).map(function (p) { return mu[p] === 1 ? String(p) : p + '^{' + mu[p] + '}'; }).join(' \\cdot ');
    return { mu: mu, tex: tex, chia: chia };
  }
  function ucln(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }

  TOAN8.nen({
    id: 'uocBoi', ten: 'Phân tích ra thừa số nguyên tố, ƯCLN và BCNN', lop: 6,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Số nguyên tố – phân tích ra thừa số nguyên tố',
        noiDung: '**Số nguyên tố** là số tự nhiên lớn hơn $1$, chỉ có hai ước là $1$ và chính nó: $2, 3, 5, 7, 11, 13, \\ldots$\n\n**Phân tích ra thừa số nguyên tố**: chia liên tiếp cho các số nguyên tố từ nhỏ đến lớn, rồi viết thành tích (dùng lũy thừa): $60 = 2^2 \\cdot 3 \\cdot 5$.' },
      { loai: 'dinhLi', tieuDe: 'Tìm ƯCLN và BCNN',
        noiDung: '**ƯCLN** (ước chung lớn nhất): lấy các thừa số nguyên tố **chung**, mỗi thừa số với số mũ **nhỏ nhất**.\n\n**BCNN** (bội chung nhỏ nhất): lấy các thừa số nguyên tố **chung và riêng**, mỗi thừa số với số mũ **lớn nhất**.\n\nVí dụ: $24 = 2^3 \\cdot 3$, $36 = 2^2 \\cdot 3^2$ nên ƯCLN$(24, 36) = 2^2 \\cdot 3 = 12$; BCNN$(24, 36) = 2^3 \\cdot 3^2 = 72$.' },
      { loai: 'chuY', tieuDe: 'Dùng để làm gì?',
        noiDung: '• Rút gọn phân số: chia cả tử và mẫu cho **ƯCLN** thì được phân số tối giản.\n\n• Quy đồng mẫu: mẫu chung nhỏ nhất là **BCNN** của các mẫu.\n\n• Bài toán "chia đều thành **nhiều nhất** bao nhiêu phần" → ƯCLN; "**sớm nhất** khi nào lại cùng lúc" → BCNN.\n\nNhận xét: ƯCLN$(a, b) \\cdot$ BCNN$(a, b) = a \\cdot b$.' }
    ],
    viDu: [
      { de: 'Tìm ƯCLN và BCNN của $18$ và $30$.', buoc: [
        { lam: '$18 = 2 \\cdot 3^2$; $30 = 2 \\cdot 3 \\cdot 5$', vi: 'Phân tích mỗi số ra thừa số nguyên tố.' },
        { lam: 'ƯCLN$(18, 30) = 2 \\cdot 3 = 6$', vi: 'Thừa số chung là $2$ và $3$; lấy số mũ nhỏ nhất ($3^1$).' },
        { lam: 'BCNN$(18, 30) = 2 \\cdot 3^2 \\cdot 5 = 90$', vi: 'Lấy cả thừa số chung và riêng ($5$), số mũ lớn nhất ($3^2$). Kiểm tra: $6 \\cdot 90 = 540 = 18 \\cdot 30$.' }] }
    ],
    luyen: [
      { ten: 'Phân tích ra thừa số nguyên tố', muc: 1, sinh: function (r) {
        var a, b, c, n;
        do { a = r.so(0, 4); b = r.so(0, 3); c = r.so(0, 2); n = Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c); }
        while (n < 12 || n > 1000 || (a > 0) + (b > 0) + (c > 0) < 2);
        var pt = phanTich(n);
        return {
          de: 'Phân tích $' + n + '$ ra thừa số nguyên tố và viết dưới dạng $2^a \\cdot 3^b \\cdot 5^c$. Điền các số mũ $a$, $b$, $c$ (thừa số nào không có thì số mũ là $0$).',
          dapAn: { kieu: 'nhieuO', o: [{ nhan: 'a', kieu: 'so', gt: a }, { nhan: 'b', kieu: 'so', gt: b }, { nhan: 'c', kieu: 'so', gt: c }] },
          goiY: ['Chia liên tiếp cho $2$ đến khi không chia hết, rồi chia cho $3$, rồi cho $5$.', 'Đếm xem đã chia cho mỗi số nguyên tố bao nhiêu lần – đó là số mũ.'],
          loiGiai: ['$' + pt.chia.join('$; $') + '$', '$' + n + ' = ' + pt.tex + '$', 'Vậy $a = ' + a + '$, $b = ' + b + '$, $c = ' + c + '$.']
        };
      } },
      { ten: 'Tìm ƯCLN', muc: 2, sinh: function (r) {
        var g = r.so(2, 15), m = r.so(2, 9), n = r.so(2, 9);
        while (n === m || ucln(m, n) !== 1) n = r.so(2, 9);
        var x = g * m, y = g * n, bc = g * m * n, px = phanTich(x), py = phanTich(y), ltg = [];
        themLoi(ltg, bc, g, 'Đó là **BCNN**. ƯCLN lấy thừa số **chung** với số mũ **nhỏ nhất**.');
        return {
          de: 'Tìm ƯCLN$(' + x + ', ' + y + ')$.',
          dapAn: { kieu: 'so', gt: g },
          goiY: ['Phân tích $' + x + '$ và $' + y + '$ ra thừa số nguyên tố.', 'Lấy các thừa số chung, mỗi thừa số với số mũ nhỏ nhất, rồi nhân lại.'],
          loiGiai: ['$' + x + ' = ' + px.tex + '$; $' + y + ' = ' + py.tex + '$', 'ƯCLN$(' + x + ', ' + y + ') = ' + (phanTich(g).tex === String(g) ? '' : phanTich(g).tex + ' = ') + g + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Tìm BCNN', muc: 2, sinh: function (r) {
        var g = r.so(1, 6), m = r.so(2, 9), n = r.so(2, 9);
        while (n === m || ucln(m, n) !== 1) n = r.so(2, 9);
        var x = g * m, y = g * n, bc = g * m * n, px = phanTich(x), py = phanTich(y), ltg = [];
        themLoi(ltg, x * y, bc, 'Tích $' + x + ' \\cdot ' + y + '$ là một bội chung nhưng **chưa nhỏ nhất** (vì hai số còn ước chung $' + g + '$).');
        if (g > 1) themLoi(ltg, g, bc, 'Đó là **ƯCLN**. BCNN lấy thừa số chung **và riêng** với số mũ **lớn nhất**.');
        return {
          de: 'Tìm BCNN$(' + x + ', ' + y + ')$.',
          dapAn: { kieu: 'so', gt: bc },
          goiY: ['Phân tích $' + x + '$ và $' + y + '$ ra thừa số nguyên tố.', 'Lấy các thừa số chung và riêng, mỗi thừa số với số mũ lớn nhất.'],
          loiGiai: ['$' + x + ' = ' + px.tex + '$; $' + y + ' = ' + py.tex + '$', 'BCNN$(' + x + ', ' + y + ') = ' + phanTich(bc).tex + ' = ' + bc + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Bài toán thực tế (ƯCLN, BCNN)', muc: 3, sinh: function (r) {
        var bc = r.dau() > 0, ltg = [], de, gt, goiY, loiGiai;
        if (!bc) {
          var g = r.so(4, 12), m = r.so(2, 9), n = r.so(2, 9);
          while (n === m || ucln(m, n) !== 1) n = r.so(2, 9);
          var vat = r.chon([['quyển vở', 'chiếc bút'], ['quả cam', 'quả táo'], ['bông hồng', 'bông cúc'], ['cái bánh', 'hộp sữa']]);
          var x = g * m, y = g * n;
          de = 'Cô giáo có $' + x + '$ ' + vat[0] + ' và $' + y + '$ ' + vat[1] + '. Cô muốn chia đều số ' + vat[0] + ' và số ' + vat[1] + ' vào các phần quà (mỗi phần có số ' + vat[0] + ' như nhau, số ' + vat[1] + ' như nhau). Chia được **nhiều nhất** bao nhiêu phần quà?';
          gt = g;
          goiY = ['Số phần quà phải là ước chung của $' + x + '$ và $' + y + '$.', '"Nhiều nhất" nên tìm ƯCLN$(' + x + ', ' + y + ')$.'];
          loiGiai = ['Số phần quà là ước chung của $' + x + '$ và $' + y + '$, lớn nhất nên là ƯCLN.', '$' + x + ' = ' + phanTich(x).tex + '$; $' + y + ' = ' + phanTich(y).tex + '$', 'ƯCLN$(' + x + ', ' + y + ') = ' + g + '$', 'Mỗi phần có $' + m + '$ ' + vat[0] + ' và $' + n + '$ ' + vat[1] + '.'];
          themLoi(ltg, g * m * n, g, 'Đó là BCNN. Chia **nhiều nhất** thành bao nhiêu phần thì tìm **ƯCLN**.');
        } else {
          var a = r.chon([6, 8, 9, 10, 12, 15, 18, 20]), b = r.chon([6, 8, 9, 10, 12, 15, 18, 20]);
          while (b === a || b % a === 0 || a % b === 0) b = r.chon([6, 8, 9, 10, 12, 15, 18, 20]);
          var u = ucln(a, b), l = a * b / u;
          var ngu = r.chon([['Xe buýt tuyến số 1', 'xe buýt tuyến số 2', 'xuất bến', 'phút'], ['Đèn xanh', 'đèn đỏ', 'nháy sáng', 'giây'], ['Bạn An', 'bạn Bình', 'đến thư viện', 'ngày']]);
          de = ngu[0] + ' cứ $' + a + '$ ' + ngu[3] + ' ' + ngu[2] + ' một lần, ' + ngu[1] + ' cứ $' + b + '$ ' + ngu[3] + ' ' + ngu[2] + ' một lần. Lần đầu cả hai cùng ' + ngu[2] + ' một lúc. Sau **ít nhất** bao nhiêu ' + ngu[3] + ' thì cả hai lại cùng ' + ngu[2] + '?';
          gt = l;
          goiY = ['Thời gian cần tìm là bội chung của $' + a + '$ và $' + b + '$.', '"Ít nhất" nên tìm BCNN$(' + a + ', ' + b + ')$.'];
          loiGiai = ['Thời gian cần tìm là bội chung nhỏ nhất của $' + a + '$ và $' + b + '$.', '$' + a + ' = ' + phanTich(a).tex + '$; $' + b + ' = ' + phanTich(b).tex + '$', 'BCNN$(' + a + ', ' + b + ') = ' + phanTich(l).tex + ' = ' + l + '$'];
          themLoi(ltg, a * b, l, 'Tích $' + a + ' \\cdot ' + b + '$ là một bội chung nhưng chưa **nhỏ nhất**.');
          themLoi(ltg, u, l, 'Đó là ƯCLN. "Sớm nhất lại cùng lúc" thì tìm **BCNN**.');
        }
        return { de: de, dapAn: { kieu: 'so', gt: gt }, goiY: goiY, loiGiai: loiGiai, loiThuongGap: ltg };
      } }
    ]
  });
})();
