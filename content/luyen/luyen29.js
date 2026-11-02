// Luyện thêm – Bài 29: Hệ số góc của đường thẳng
(function () {
  'use strict';
  function ng(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function heSo(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  function lin(cc, a, b) { return cc.daThuc([[a, 'x'], [b, '']]); }
  function loc(ds, ans) {
    var out = [];
    ds.forEach(function (l) {
      if (!isFinite(l.gt) || Math.abs(l.gt - ans) < 1e-9) return;
      if (out.some(function (o) { return Math.abs(o.gt - l.gt) < 1e-9; })) return;
      out.push(l);
    });
    return out;
  }
  // lỗi thường gặp kiểu biểu thức: bỏ nếu tương đương đáp án hoặc trùng nhau
  function locBt(ds, ans) {
    var out = [];
    ds.forEach(function (l) { if (l.gt !== ans && out.every(function (o) { return o.gt !== l.gt; })) out.push(l); });
    return out;
  }
  function cong(b) { return (b >= 0 ? '+ ' : '- ') + Math.abs(b); }

  TOAN8.luyen(29, [
    { ten: 'Đọc hệ số góc', muc: 1, sinh: function (r, cc) {
      var loai = r.chon(['nguoc', 'nguoc', 'phan']);
      if (loai === 'nguoc') {
        var a = r.khac0(-7, 7), b = r.khac0(-9, 9);
        return {
          de: 'Hệ số góc của đường thẳng $y = ' + cc.daThuc([[b, ''], [a, 'x']]) + '$ là bao nhiêu?',
          dapAn: { kieu: 'so', gt: a },
          goiY: ['Viết lại về dạng $y = ax + b$ (hạng tử chứa $x$ đứng trước).', 'Hệ số góc là hệ số **của $x$**, lấy cả dấu.'],
          loiGiai: ['$y = ' + cc.daThuc([[b, ''], [a, 'x']]) + ' = ' + lin(cc, a, b) + '$', 'Hệ số góc: $a = ' + a + '$'],
          loiThuongGap: loc([{ gt: b, giaiThich: '$' + b + '$ là hạng tử tự do $b$ (tung độ gốc), không phải hệ số góc.' }, { gt: -a, giaiThich: 'Hệ số góc lấy **cả dấu** của hệ số của $x$.' }], a)
        };
      }
      var k = r.chon([2, 3, 4, 5]), p, q = r.khac0(-9, 9);
      do { p = r.khac0(-9, 9); } while (p % k === 0 && Math.abs(p) === k);
      var hs = cc.phanSo(p, k);
      return {
        de: 'Hệ số góc của đường thẳng $y = \\frac{' + lin(cc, p, q) + '}{' + k + '}$ là bao nhiêu?',
        dapAn: { kieu: 'so', gt: hs.ascii },
        goiY: ['Chia **từng hạng tử** của tử cho $' + k + '$ để đưa về dạng $y = ax + b$.', 'Ví dụ: $\\frac{3x + 1}{2} = \\frac{3}{2}x + \\frac{1}{2}$ có hệ số góc $\\frac{3}{2}$. Nhớ rút gọn phân số.'],
        loiGiai: ['$y = \\frac{' + lin(cc, p, q) + '}{' + k + '} = \\frac{' + p + '}{' + k + '}x ' + (q > 0 ? '+ ' : '- ') + '\\frac{' + Math.abs(q) + '}{' + k + '}$', 'Hệ số góc: $a = ' + hs.tex + '$'],
        loiThuongGap: loc([{ gt: p, giaiThich: 'Phải chia cả hạng tử $' + heSo(p) + 'x$ cho mẫu $' + k + '$: hệ số góc là $\\frac{' + p + '}{' + k + '}$, không phải $' + p + '$.' }], p / k)
      };
    } },
    { ten: 'Góc nhọn hay góc tù', muc: 1, sinh: function (r, cc) {
      var tu = r.dau() > 0, as = [];
      while (as.length < 4) { var v = r.khac0(-5, 5); if (as.indexOf(v) < 0 && (as.length ? (tu ? v > 0 : v < 0) : (tu ? v < 0 : v > 0))) as.push(v); }
      var bs = as.map(function () { return r.khac0(-6, 6); });
      var dung = as[0];
      var ds = r.xaoTron(as.map(function (a, i) { return { a: a, tex: '$y = ' + cc.daThuc(i % 2 ? [[bs[i], ''], [a, 'x']] : [[a, 'x'], [bs[i], '']]) + '$' }; }));
      var gt = ds.findIndex(function (d) { return d.a === dung; });
      return {
        de: 'Đường thẳng nào dưới đây tạo với trục $Ox$ một **góc ' + (tu ? 'tù' : 'nhọn') + '**?',
        dapAn: { kieu: 'chon', gt: gt, luaChon: ds.map(function (d) { return d.tex; }) },
        goiY: ['Góc tạo bởi đường thẳng $y = ax + b$ và trục $Ox$ là góc nhọn khi $a > 0$, là góc tù khi $a < 0$.', 'Tìm hệ số của $x$ (cả dấu) trong từng đường thẳng.'],
        loiGiai: ['Chỉ có ' + ds[gt].tex + ' có hệ số góc $a = ' + dung + (tu ? ' < 0' : ' > 0') + '$, các đường còn lại có $a ' + (tu ? '> 0' : '< 0') + '$.', 'Vậy đáp án là ' + ds[gt].tex + '.']
      };
    } },
    { ten: 'Nhận biết hai đường thẳng song song', muc: 1, sinh: function (r, cc) {
      var a = r.khac0(-4, 4), b1 = r.khac0(-6, 6), b2, c;
      do { b2 = r.khac0(-6, 6); } while (b2 === b1);
      do { c = r.khac0(-4, 4); } while (c === a || c === -a);
      var cap = function (a1, q1, a2, q2) { return '$y = ' + lin(cc, a1, q1) + '$ và $y = ' + lin(cc, a2, q2) + '$'; };
      var dung = cap(a, b1, a, b2);
      var s = r.khac0(-3, 3), trung = '$y = ' + (a === -1 ? '-' : a) + '(x ' + cong(s) + ')$ và $y = ' + lin(cc, a, a * s) + '$';
      var ds = r.xaoTron([dung, cap(c, b1, a, b1), cap(a, b1, -a, b2), trung]), gt = ds.indexOf(dung);
      return {
        de: 'Cặp đường thẳng nào dưới đây **song song** với nhau?',
        dapAn: { kieu: 'chon', gt: gt, luaChon: ds },
        goiY: ['Hai đường thẳng $y = ax + b$ và $y = a\'x + b\'$ song song khi $a = a\'$ **và** $b \\ne b\'$.', 'Thu gọn từng đường về dạng $y = ax + b$ rồi so sánh. Cùng $a$, cùng $b$ là **trùng** nhau.'],
        loiGiai: [dung + ': cùng hệ số góc $' + a + '$, khác tung độ gốc ($' + b1 + ' \\ne ' + b2 + '$) nên song song.',
          'Cặp có hai hệ số góc khác nhau thì cắt nhau; cặp thu gọn ra giống hệt nhau thì trùng nhau. Đáp án: ' + dung + '.']
      };
    } },
    { ten: 'Tìm m để hai đường thẳng song song', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-5, 5), q, c = r.khac0(-6, 6);
      do { q = r.khac0(-6, 6); } while (q === c);
      if (r.dau() > 0) {
        var p = r.khac0(-5, 5), m = a - p;
        var hs = 'm ' + cong(p);
        return {
          de: 'Tìm $m$ để đường thẳng $y = (' + hs + ')x ' + cong(q) + '$ $(m \\ne ' + (-p) + ')$ song song với đường thẳng $y = ' + lin(cc, a, c) + '$.',
          dapAn: { kieu: 'so', gt: m },
          goiY: ['Song song khi hai hệ số góc bằng nhau (và hai tung độ gốc khác nhau: $' + q + ' \\ne ' + c + '$).', 'Giải $' + hs + ' = ' + a + '$.'],
          loiGiai: ['$' + hs + ' = ' + a + '$ và $' + q + ' \\ne ' + c + '$ (đúng).', '$m = ' + a + ' - ' + ng(p) + ' = ' + m + '$, thoả mãn $m \\ne ' + (-p) + '$.', 'Vậy $m = ' + m + '$'],
          loiThuongGap: loc([{ gt: a + p, giaiThich: 'Chuyển $' + p + '$ sang vế phải phải đổi dấu: $m = ' + a + ' - ' + ng(p) + '$.' }, { gt: c, giaiThich: 'Song song cần **hệ số góc** bằng nhau, không phải tung độ gốc.' }], m)
        };
      }
      // y = k·m·x + q song song y = (m + d)x + c: k m = m + d, m = d / (k - 1)
      var k = r.chon([2, 3, 4, 5]), m2 = r.khac0(-4, 4), d = m2 * (k - 1);
      if (m2 + d === 0) { m2 = Math.abs(m2) || 1; d = m2 * (k - 1); }
      return {
        de: 'Cho hai hàm số bậc nhất $y = ' + k + 'mx ' + cong(q) + '$ và $y = (m ' + cong(d) + ')x ' + cong(c) + '$. Tìm $m$ để đồ thị của chúng là hai đường thẳng song song.',
        dapAn: { kieu: 'so', gt: m2 },
        goiY: ['Song song khi $' + k + 'm = m ' + cong(d) + '$ (và $' + q + ' \\ne ' + c + '$, luôn đúng).', 'Chuyển $m$ sang vế trái rồi giải. Nhớ kiểm tra hai hệ số góc khác $0$.'],
        loiGiai: ['$' + k + 'm = m ' + cong(d) + '$, nên $' + heSo(k - 1) + 'm = ' + d + '$, $m = ' + m2 + '$.', 'Khi đó $' + k + 'm = ' + k * m2 + ' \\ne 0$ (thoả mãn).', 'Vậy $m = ' + m2 + '$'],
        loiThuongGap: loc([{ gt: d / (k + 1), giaiThich: 'Chuyển $m$ sang vế trái phải đổi dấu: $' + k + 'm - m = ' + (k - 1) + 'm$, không phải $' + (k + 1) + 'm$.' }], m2)
      };
    } },
    { ten: 'Viết phương trình đường thẳng biết hệ số góc và một điểm', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-4, 4), b = r.khac0(-7, 7), t = r.khac0(-3, 3), y = a * t + b;
      var loai = r.chon(['diem', 'diem', 'Ox']);
      if (loai === 'Ox') {
        var x0 = r.khac0(-4, 4), bb = -a * x0, kq = lin(cc, a, bb);
        return {
          de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $' + a + '$ và cắt trục hoành tại điểm có hoành độ bằng $' + x0 + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq },
          goiY: ['Cắt trục hoành tại hoành độ $' + x0 + '$ nghĩa là đi qua điểm $(' + x0 + '; 0)$.', 'Thay vào $y = ' + heSo(a) + 'x + b$: $0 = ' + a + '\\cdot ' + ng(x0) + ' + b$.'],
          loiGiai: ['Hàm số có dạng $y = ' + heSo(a) + 'x + b$, đi qua $(' + x0 + '; 0)$: $0 = ' + a * x0 + ' + b$, nên $b = ' + bb + '$.', '$y = ' + kq + '$'],
          loiThuongGap: locBt([{ gt: lin(cc, a, x0), giaiThich: 'Điểm $(' + x0 + '; 0)$ nằm trên trục **hoành**, còn $b$ là tung độ giao điểm với trục **tung**. Phải thay $(' + x0 + '; 0)$ để tính $b$.' },
            { gt: lin(cc, a, -bb), giaiThich: '$0 = ' + a * x0 + ' + b$ thì $b = ' + bb + '$ (chú ý dấu).' }], kq)
        };
      }
      var kq2 = lin(cc, a, b);
      return {
        de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $' + a + '$ và đi qua điểm $(' + t + '; ' + y + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq2 },
        goiY: ['Hàm số có dạng $y = ' + heSo(a) + 'x + b$.', 'Thay $x = ' + t + '$, $y = ' + y + '$: $' + y + ' = ' + a + '\\cdot ' + ng(t) + ' + b$.'],
        loiGiai: ['$y = ' + heSo(a) + 'x + b$; qua $(' + t + '; ' + y + ')$: $' + y + ' = ' + a * t + ' + b$, nên $b = ' + b + '$.', '$y = ' + kq2 + '$'],
        loiThuongGap: locBt([{ gt: lin(cc, a, y), giaiThich: '$' + y + '$ là tung độ của điểm, không phải $b$. Phải thay toạ độ vào để tính $b$.' },
          { gt: lin(cc, a, y + a * t), giaiThich: '$' + y + ' = ' + a * t + ' + b$ thì $b = ' + y + ' - ' + ng(a * t) + ' = ' + b + '$ (chuyển vế phải đổi dấu).' }], kq2)
      };
    } },
    { ten: 'Đường thẳng song song và đi qua một điểm', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-4, 4), c = r.khac0(-6, 6), b, t = r.khac0(-3, 3);
      do { b = r.khac0(-7, 7); } while (b === c);
      var y = a * t + b, kq = lin(cc, a, b);
      return {
        de: 'Tìm hàm số bậc nhất có đồ thị song song với đường thẳng $y = ' + lin(cc, a, c) + '$ và đi qua điểm $(' + t + '; ' + y + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq },
        goiY: ['Song song nên cùng hệ số góc: $y = ' + heSo(a) + 'x + b$ với $b \\ne ' + c + '$.', 'Thay $x = ' + t + '$, $y = ' + y + '$ để tìm $b$.'],
        loiGiai: ['$y = ' + heSo(a) + 'x + b$; qua $(' + t + '; ' + y + ')$: $' + y + ' = ' + a * t + ' + b$, nên $b = ' + b + '$ (khác $' + c + '$).', '$y = ' + kq + '$'],
        loiThuongGap: locBt([{ gt: lin(cc, a, c), giaiThich: 'Đó chính là đường thẳng đã cho, và nó không đi qua $(' + t + '; ' + y + ')$.' },
          { gt: lin(cc, a, y + a * t), giaiThich: '$' + y + ' = ' + a * t + ' + b$ thì $b = ' + y + ' - ' + ng(a * t) + '$ (chuyển vế phải đổi dấu).' },
          { gt: lin(cc, -a, b), giaiThich: 'Song song thì hệ số góc **bằng** nhau (cùng dấu), không đổi dấu.' }], kq)
      };
    } },
    { ten: 'Giao điểm của hai đường thẳng', muc: 3, sinh: function (r, cc) {
      var x0 = r.so(-3, 3), y0 = r.so(-3, 3), a1 = r.khac0(-3, 3), a2;
      do { a2 = r.khac0(-3, 3); } while (a2 === a1);
      var b1 = y0 - a1 * x0, b2 = y0 - a2 * x0, h = a1 - a2;
      return {
        de: 'Tìm toạ độ giao điểm của hai đường thẳng $y = ' + lin(cc, a1, b1) + '$ và $y = ' + lin(cc, a2, b2) + '$.',
        hinh: { widget: 'doThi', config: { bbox: [-6, 6, 6, -6], an: true, duong: [{ a: a1, b: b1 }, { a: a2, b: b2 }] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Hoành độ giao điểm', kieu: 'so', gt: x0, loiThuongGap: loc([{ gt: (b2 - b1) / (a1 + a2), giaiThich: 'Chuyển $' + heSo(a2) + 'x$ sang vế trái phải đổi dấu: $' + heSo(a1) + 'x - ' + ng(a2) + 'x = ' + (a1 - a2) + 'x$.' }, { gt: y0, giaiThich: '$' + y0 + '$ là tung độ. Hoành độ là nghiệm $x$ của phương trình hoành độ.' }], x0) },
          { nhan: 'Tung độ giao điểm', kieu: 'so', gt: y0, loiThuongGap: loc([{ gt: x0, giaiThich: '$' + x0 + '$ là hoành độ. Tung độ: thay $x = ' + x0 + '$ vào một trong hai công thức.' }], y0) }] },
        goiY: ['Tại giao điểm hai giá trị $y$ bằng nhau: $' + lin(cc, a1, b1) + ' = ' + lin(cc, a2, b2) + '$.', 'Tìm $x$ rồi thay vào một trong hai công thức để tìm $y$. Nhìn hình để kiểm tra.'],
        loiGiai: ['$' + lin(cc, a1, b1) + ' = ' + lin(cc, a2, b2) + '$, nên $' + lin(cc, h, 0) + ' = ' + (b2 - b1) + '$, $x = ' + x0 + '$.',
          'Thay vào: $y = ' + (Math.abs(a1) === 1 ? (a1 < 0 ? '-' : '') + ng(x0) : a1 + '\\cdot ' + ng(x0)) + (b1 ? ' ' + cong(b1) : '') + ' = ' + y0 + '$.',
          'Giao điểm là $(' + x0 + '; ' + y0 + ')$.']
      };
    } },
    { ten: 'Tham số m: song song rồi tìm giao với trục', muc: 3, sinh: function (r, cc) {
      var a = r.khac0(-3, 3), p = r.khac0(-4, 4), m = a + p, x0 = r.khac0(-4, 4), q = -a * x0;
      if (q === 0 || m === p) { x0 = 2; q = -2 * a; }
      return {
        de: 'Cho hàm số bậc nhất $y = (m ' + cong(-p) + ')x ' + cong(q) + '$ $(m \\ne ' + p + ')$. a) Tìm $m$ để đồ thị song song với đường thẳng $y = ' + heSo(a) + 'x$. b) Với $m$ đó, đồ thị cắt trục hoành tại điểm có hoành độ bằng bao nhiêu?',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $m =$', kieu: 'so', gt: m, loiThuongGap: loc([{ gt: a - p, giaiThich: '$m ' + cong(-p) + ' = ' + a + '$ thì $m = ' + a + ' ' + cong(p) + ' = ' + m + '$ (chuyển vế đổi dấu).' }], m) },
          { nhan: 'b) Hoành độ giao điểm với trục hoành', kieu: 'so', gt: x0, loiThuongGap: loc([{ gt: -x0, giaiThich: 'Giải $' + lin(cc, a, q) + ' = 0$: $' + heSo(a) + 'x = ' + (-q) + '$, $x = ' + x0 + '$ (chú ý dấu).' }, { gt: q, giaiThich: '$' + q + '$ là tung độ giao điểm với trục **tung**.' }], x0) }] },
        goiY: ['a) Song song khi hệ số góc bằng nhau: $m ' + cong(-p) + ' = ' + a + '$ (và $' + q + ' \\ne 0$).', 'b) Thay $m$ vào được $y = ' + lin(cc, a, q) + '$. Cho $y = 0$ rồi giải.'],
        loiGiai: ['a) $m ' + cong(-p) + ' = ' + a + '$, nên $m = ' + m + '$ (thoả mãn $m \\ne ' + p + '$; $' + q + ' \\ne 0$ nên không trùng).',
          'b) Hàm số $y = ' + lin(cc, a, q) + '$. Cho $y = 0$: $' + heSo(a) + 'x = ' + (-q) + '$, $x = ' + x0 + '$.']
      };
    } }
  ]);
})();
