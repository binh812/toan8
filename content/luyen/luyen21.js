// Luyện thêm – Bài 21: Phân thức đại số
(function () {
  'use strict';

  // ---- Đa thức theo x: mảng hệ số từ bậc 0 lên; nhân tử (x − r) ghi bằng nghiệm r ----
  function nhanDT(p, q) {
    var o = [];
    for (var i = 0; i < p.length + q.length - 1; i++) o.push(0);
    p.forEach(function (a, i) { q.forEach(function (b, j) { o[i + j] += a * b; }); });
    return o;
  }
  function trienKhai(k, ng) { var p = [k]; ng.forEach(function (r) { p = nhanDT(p, [-r, 1]); }); return p; }
  function vietDT(cc, p) {
    var h = [];
    for (var i = p.length - 1; i >= 0; i--) h.push([p[i], i === 0 ? '' : i === 1 ? 'x' : 'x^' + i]);
    return cc.daThuc(h);
  }
  function giaTri(p, x) { return p.reduceRight(function (s, a) { return s * x + a; }, 0); }
  function bangDT(p, q) {
    for (var i = 0; i < Math.max(p.length, q.length); i++) if ((p[i] || 0) !== (q[i] || 0)) return false;
    return true;
  }
  function coSo(r) { return r === 0 ? 'x' : 'x' + (r > 0 ? '-' + r : '+' + (-r)); }
  function frac(t, m) { return '\\frac{' + t + '}{' + m + '}'; }
  // Thay x = x0 vào đa thức, viết từng hạng tử (số âm trong ngoặc)
  function thay(p, x0) {
    var X = x0 < 0 ? '(' + x0 + ')' : String(x0), s = '';
    for (var i = p.length - 1; i >= 0; i--) {
      var a = p[i];
      if (!a) continue;
      var abs = Math.abs(a), dau = a < 0 ? ' - ' : (s ? ' + ' : '');
      s += dau + (i === 0 ? String(abs) : (abs !== 1 ? abs + ' \\cdot ' : '') + X + (i > 1 ? '^' + i : ''));
    }
    return s || '0';
  }
  // Giá trị khi em "quên ngoặc": (−a)² tính thành −a²
  function giaTriSaiDau(p, x0) {
    var s = 0;
    p.forEach(function (a, i) { s += a * (i > 0 && i % 2 === 0 ? -Math.pow(Math.abs(x0), i) : Math.pow(x0, i)); });
    return s;
  }
  function lcm(cc, a, b) { return a / cc.ucln(a, b) * b; }

  TOAN8.luyen(21, [
    { ten: 'Điều kiện xác định', muc: 1, sinh: function (r, cc) {
      var loai = r.so(0, 3), q = r.khac0(-6, 6), mau, mauNT, kq, ltg = [], buoc, goi;
      if (loai === 0) {
        var a = r.chon([1, 2, 3]);
        mau = vietDT(cc, trienKhai(a, [q])); kq = [q];
        goi = 'Giải $' + mau + ' = 0$.';
        buoc = ['$' + mau + ' = 0$ khi $' + (a === 1 ? 'x' : a + 'x') + ' = ' + a * q + '$, tức $x = ' + q + '$.'];
      } else if (loai === 1) {
        mau = vietDT(cc, trienKhai(1, [0, q])); mauNT = 'x(' + coSo(q) + ')'; kq = [0, q];
        goi = 'Đặt nhân tử chung: $' + mau + ' = ' + mauNT + '$. Tích bằng $0$ khi một thừa số bằng $0$.';
        buoc = ['$' + mau + ' = ' + mauNT + ' = 0$ khi $x = 0$ hoặc $' + coSo(q) + ' = 0$.', 'Tức là $x = 0$ hoặc $x = ' + q + '$.'];
        ltg.push({ gt: [q], giaiThich: 'Em quên thừa số $x$: $' + mauNT + ' = 0$ cả khi $x = 0$.' });
      } else if (loai === 2) {
        q = r.so(1, 7);
        mau = vietDT(cc, trienKhai(1, [q, -q])); mauNT = '(' + coSo(q) + ')(' + coSo(-q) + ')'; kq = [q, -q];
        goi = 'Hiệu hai bình phương: $' + mau + ' = ' + mauNT + '$.';
        buoc = ['$' + mau + ' = ' + mauNT + ' = 0$ khi $x = ' + q + '$ hoặc $x = ' + (-q) + '$.'];
        ltg.push({ gt: [q], giaiThich: '$x^2 = ' + q * q + '$ có **hai** giá trị: $x = ' + q + '$ và $x = ' + (-q) + '$.' });
      } else {
        var p = r.khac0(-6, 6);
        while (p === q || p === -q) p = r.khac0(-6, 6);
        mau = '(' + coSo(p) + ')(' + coSo(q) + ')'; kq = [p, q];
        goi = 'Tích bằng $0$ khi một trong hai thừa số bằng $0$.';
        buoc = ['$' + mau + ' = 0$ khi $' + coSo(p) + ' = 0$ hoặc $' + coSo(q) + ' = 0$.', 'Tức là $x = ' + p + '$ hoặc $x = ' + q + '$.'];
        ltg.push({ gt: [-p, -q], giaiThich: 'Sai dấu: $' + coSo(p) + ' = 0$ khi $x = ' + p + '$ (chuyển vế phải đổi dấu).' });
      }
      var s = r.so(-6, 6);
      while (kq.indexOf(s) >= 0 || s === -q) s = r.so(-6, 6);
      var c = r.chon([1, 1, 2, 3, -1]), tu = vietDT(cc, trienKhai(c, [s]));
      ltg.push({ gt: [s], giaiThich: 'Em cho **tử** bằng $0$. Phân thức không xác định khi **mẫu** bằng $0$.' });
      var F = frac(tu, mau);
      return {
        de: r.chon(['Tìm các giá trị của $x$ làm phân thức $' + F + '$ không xác định.', 'Phân thức $' + F + '$ xác định khi $x$ khác những giá trị nào?']) +
          (kq.length > 1 ? ' (Ghi các giá trị cách nhau bởi dấu ;)' : ''),
        dapAn: { kieu: 'nghiem', gt: kq },
        goiY: ['Phân thức không xác định khi **mẫu** bằng $0$ (không phải tử).', goi],
        loiGiai: ['Mẫu thức là $' + mau + '$.'].concat(buoc, ['Vậy phân thức không xác định tại ' + kq.map(function (v) { return '$x = ' + v + '$'; }).join(' và ') + '; điều kiện xác định: ' + kq.map(function (v) { return '$x \\ne ' + v + '$'; }).join(' và ') + '.']),
        loiThuongGap: ltg
      };
    } },

    { ten: 'Giá trị của phân thức', muc: 1, sinh: function (r, cc) {
      var tu, mau, x0, N, D, lan = 0;
      do {
        tu = r.dau() > 0 ? [r.so(-5, 5), r.so(-4, 4), 1] : [r.so(-6, 6), r.khac0(-4, 4)];
        mau = tu.length === 3 ? (r.dau() > 0 ? [r.khac0(-5, 5), 1] : [r.khac0(-3, 3), r.so(1, 3)]) : [r.so(1, 5), r.chon([0, 1, -1]), 1];
        x0 = r.khac0(-4, 4);
        N = giaTri(tu, x0); D = giaTri(mau, x0);
      } while ((D === 0 || N === 0) && ++lan < 50);
      if (D === 0 || N === 0) { tu = [-1, -1, 1]; mau = [3, 1]; x0 = 2; N = 1; D = 5; }
      var kq = cc.phanSo(N, D), ltg = [], tuS = vietDT(cc, tu), mauS = vietDT(cc, mau);
      if (x0 < 0) {
        var Nw = giaTriSaiDau(tu, x0), Dw = giaTriSaiDau(mau, x0);
        if (Dw !== 0 && Nw * D !== N * Dw) ltg.push({ gt: cc.phanSo(Nw, Dw).ascii, giaiThich: 'Thay số âm phải đặt trong ngoặc: $(' + x0 + ')^2 = ' + x0 * x0 + '$, không phải $' + (-x0 * x0) + '$.' });
      }
      var giua = D === 1 ? String(N) : frac(N, D);
      return {
        de: r.chon(['Tính giá trị của phân thức $' + frac(tuS, mauS) + '$ tại $x = ' + x0 + '$.', 'Cho phân thức $P = ' + frac(tuS, mauS) + '$. Tính $P$ khi $x = ' + x0 + '$.']) + ' (Kết quả là số nguyên hoặc phân số tối giản.)',
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: ['Kiểm tra mẫu khác $0$ tại $x = ' + x0 + '$, rồi thay $x = ' + x0 + '$ vào cả tử và mẫu.', x0 < 0 ? 'Số âm đặt trong ngoặc: $(' + x0 + ')^2 = ' + x0 * x0 + '$.' : 'Tính tử và mẫu riêng, rồi rút gọn phân số.'],
        loiGiai: ['Tại $x = ' + x0 + '$, mẫu bằng $' + thay(mau, x0) + ' = ' + D + ' \\ne 0$ nên phân thức xác định.',
          'Tử bằng $' + thay(tu, x0) + ' = ' + N + '$.',
          '$P = ' + (giua === kq.tex ? '' : giua + ' = ') + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tìm đa thức (hai phân thức bằng nhau)', muc: 2, sinh: function (r, cc) {
      if (r.dau() > 0) {
        // A/(x+a) = U(x−a)/(x²−a²)  ⟹  A = U
        var a = r.so(1, 7) * r.dau(), k = r.khac0(-4, 4), ngU = r.chon([[], [0], [0], [0, 0]]);
        if (!ngU.length && k === 1) k = r.chon([2, 3, 5]);
        var U = trienKhai(k, ngU), Ustr = vietDT(cc, U), tu2 = vietDT(cc, trienKhai(k, ngU.concat([a]))), mau2 = vietDT(cc, trienKhai(1, [a, -a]));
        return {
          de: 'Tìm đa thức $A$ sao cho $' + frac('A', coSo(-a)) + ' = ' + frac(tu2, mau2) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: Ustr },
          goiY: ['Phân tích mẫu bên phải: $' + mau2 + ' = (' + coSo(a) + ')(' + coSo(-a) + ')$; phân tích cả tử bên phải.', 'Chia cả tử và mẫu bên phải cho nhân tử chung $' + coSo(a) + '$ để có mẫu $' + coSo(-a) + '$.'],
          loiGiai: ['$' + frac(tu2, mau2) + ' = ' + frac((k < 0 ? '(' + Ustr + ')' : Ustr) + '(' + coSo(a) + ')', '(' + coSo(-a) + ')(' + coSo(a) + ')') + ' = ' + frac(Ustr, coSo(-a)) + '$.',
            'Hai phân thức có cùng mẫu $' + coSo(-a) + '$ nên tử bằng nhau: $A = ' + Ustr + '$'],
          loiThuongGap: [{ gt: tu2, giaiThich: 'Mẫu bên trái là $' + coSo(-a) + '$ (đã chia cho $' + coSo(a) + '$), nên tử cũng phải **chia** cho $' + coSo(a) + '$.' }]
        };
      }
      // (mx+n)/(x−b) = ?/((x−b)·M)  ⟹  ? = (mx+n)·M
      var b = r.khac0(-6, 6), m = r.chon([1, 2, 3]), n = r.khac0(-7, 7);
      while (n === -m * b) n = r.khac0(-7, 7);
      var tu1 = [n, m], loaiM = r.so(0, 2), M, Mstr;
      if (loaiM === 0) { M = [b, 1]; Mstr = '(' + coSo(-b) + ')'; } else if (loaiM === 1) { M = [0, 1]; Mstr = 'x'; } else { var h = r.chon([2, 3, 4, 5]); M = [h]; Mstr = String(h); }
      var mau2b = vietDT(cc, nhanDT([-b, 1], M)), kq = vietDT(cc, nhanDT(tu1, M)), tu1s = vietDT(cc, tu1);
      return {
        de: 'Tìm đa thức thích hợp thay cho dấu "?": $' + frac(tu1s, coSo(b)) + ' = ' + frac('?', mau2b) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq },
        goiY: ['Mẫu $' + coSo(b) + '$ đã được nhân với gì để thành $' + mau2b + '$?', 'Phân tích: $' + mau2b + ' = (' + coSo(b) + ')\\cdot ' + Mstr + '$. Nhân cả tử với đúng $' + Mstr + '$.'],
        loiGiai: ['$' + mau2b + ' = (' + coSo(b) + ')\\cdot ' + Mstr + '$: mẫu được nhân với $' + Mstr + '$.',
          'Tử cũng nhân với $' + Mstr + '$ (khi đó nhân chéo bằng nhau): $? = (' + tu1s + ')\\cdot ' + Mstr + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: tu1s, giaiThich: 'Mẫu đã được nhân với $' + Mstr + '$ thì tử cũng phải nhân với $' + Mstr + '$.' }]
      };
    } },

    { ten: 'Hai phân thức có bằng nhau không?', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), b = r.khac0(-6, 6);
      while (b === a) b = r.khac0(-6, 6);
      var loai = r.so(0, 3), A, B, C, D, ghiChu;
      var xa = [a, 1], xb = [b, 1];
      if (loai === 0) { var c = r.so(2, 7); A = xa; B = [c]; C = [0, a, 1]; D = [0, c]; ghiChu = 'nhân cả tử và mẫu với $x$'; }
      else if (loai === 1) { A = xa; B = xb; C = [0, a, 1]; D = [0, b, 1]; ghiChu = 'nhân cả tử và mẫu với $x$'; }
      else if (loai === 2) { A = xa; B = xb; C = [a, 0, 1]; D = [b, 0, 1]; ghiChu = '"thêm mũ 2" vào $x$ ở tử và mẫu'; }
      else { A = xa; B = xb; C = [0, a, 1]; D = [b, 0, 1]; ghiChu = 'nhân tử với $x$ nhưng mẫu thì không'; }
      var AD = nhanDT(A, D), BC = nhanDT(B, C), dung = bangDT(AD, BC);
      var P = frac(vietDT(cc, A), vietDT(cc, B)), Q = frac(vietDT(cc, C), vietDT(cc, D));
      return {
        de: 'Khẳng định sau đúng hay sai? $$' + P + ' = ' + Q + '$$',
        dapAn: { kieu: 'dungSai', gt: dung },
        goiY: ['$\\frac{A}{B} = \\frac{C}{D}$ khi $A\\cdot D = B\\cdot C$ (nhân chéo).', 'Tính hai tích chéo $(' + vietDT(cc, A) + ')(' + vietDT(cc, D) + ')$ và $' + (B.length > 1 ? '(' + vietDT(cc, B) + ')' : vietDT(cc, B)) + '(' + vietDT(cc, C) + ')$ rồi so sánh.'],
        loiGiai: ['$A\\cdot D = (' + vietDT(cc, A) + ')(' + vietDT(cc, D) + ') = ' + vietDT(cc, AD) + '$.',
          '$B\\cdot C = ' + (B.length > 1 ? '(' + vietDT(cc, B) + ')' : vietDT(cc, B)) + '(' + vietDT(cc, C) + ') = ' + vietDT(cc, BC) + '$.',
          dung ? 'Hai tích bằng nhau nên khẳng định **đúng** (ở đây ta đã ' + ghiChu + ').'
            : 'Hai tích khác nhau nên khẳng định **sai**: không được ' + ghiChu + ' (ví dụ thay $x = 1$ hai vế cho hai số khác nhau).']
      };
    } },

    { ten: 'Bài toán thực tế (vận tốc, năng suất)', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var xe = r.chon([{ di: 'đạp xe', v: [8, 10, 12, 15, 16], d: [2, 3, 4, 5, 6], max: 48 }, { di: 'đi xe máy', v: [30, 36, 40, 45, 48, 50, 60], d: [4, 5, 6, 9, 10, 12, 15, 20], max: 120 }]);
        var v, d, S, lan = 0;
        do { v = r.chon(xe.v); d = r.chon(xe.d); S = lcm(cc, v, v + d); } while (S > xe.max && ++lan < 80);
        if (S > xe.max) { v = xe.v[1]; d = xe.v[1] / 2; S = 3 * d; }
        var ten = r.chon(['Bạn An', 'Bạn Bình', 'Chị Mai', 'Anh Dũng', 'Bạn Lan', 'Cô Hoa']);
        var t1 = S / v, t2 = S / (v + d), noi = r.chon(['một khu du lịch', 'nhà ông bà', 'một thị trấn']);
        return {
          de: ten + ' ' + xe.di + ' từ nhà đến ' + noi + ' cách đó $' + S + '$ km với vận tốc $x$ (km/h). Lúc về, ' + ten.split(' ').pop() + ' đi nhanh hơn lúc đi $' + d + '$ km/h.\n\na) Viết biểu thức (tổng hai phân thức) biểu thị tổng thời gian cả đi và về (giờ).\n\nb) Tính tổng thời gian đó khi $x = ' + v + '$.',
          dapAn: { kieu: 'nhieuO', o: [
            { nhan: 'a) Tổng thời gian (giờ)', kieu: 'bieuThuc', gt: S + '/x+' + S + '/(x+' + d + ')',
              loiThuongGap: [{ gt: S + '/x+' + S + '/(x-' + d + ')', giaiThich: 'Lúc về đi **nhanh hơn** nên vận tốc là $x + ' + d + '$.' },
                { gt: 'x/' + S + '+(x+' + d + ')/' + S, giaiThich: 'Thời gian = quãng đường **chia** vận tốc, không phải vận tốc chia quãng đường.' }] },
            { nhan: 'b) Khi $x = ' + v + '$ (giờ)', kieu: 'so', gt: t1 + t2,
              loiThuongGap: [{ gt: 2 * t1, giaiThich: 'Lúc về vận tốc là $' + v + ' + ' + d + ' = ' + (v + d) + '$ km/h, không phải $' + v + '$ km/h.' }] }] },
          goiY: ['Thời gian = quãng đường : vận tốc. Vận tốc lúc về là $x + ' + d + '$.', 'Thay $x = ' + v + '$ vào từng phân thức rồi cộng.'],
          loiGiai: ['a) Thời gian đi: $' + frac(S, 'x') + '$; thời gian về: $' + frac(S, 'x+' + d) + '$. Tổng: $' + frac(S, 'x') + ' + ' + frac(S, 'x+' + d) + '$ (giờ).',
            'b) Khi $x = ' + v + '$: $' + frac(S, v) + ' + ' + frac(S, v + d) + ' = ' + cc.so(t1) + ' + ' + cc.so(t2) + ' = ' + cc.so(t1 + t2) + '$ (giờ).']
        };
      }
      var v2, d2, L, N, lan2 = 0;
      do { v2 = r.chon([20, 25, 30, 40, 50, 60]); d2 = r.chon([5, 10, 20]); L = lcm(cc, v2, v2 + d2); } while (L > 1200 && ++lan2 < 60);
      if (L > 1200) { v2 = 40; d2 = 10; L = 200; }
      N = L * r.so(1, Math.max(1, Math.floor(2400 / L)));
      var to = r.chon(['Một tổ sản xuất', 'Một xưởng may', 'Một tổ công nhân', 'Một nhóm thợ']), sp = r.chon(['sản phẩm', 'chiếc áo', 'chiếc khẩu trang']);
      var n1 = N / v2, n2 = N / (v2 + d2);
      return {
        de: to + ' phải làm $' + N + '$ ' + sp + '. Theo kế hoạch mỗi ngày làm $x$ ' + sp + '. Thực tế mỗi ngày làm thêm được $' + d2 + '$ ' + sp + '.\n\na) Viết biểu thức (hiệu hai phân thức) biểu thị số ngày làm xong **sớm hơn** kế hoạch.\n\nb) Tính số ngày đó khi $x = ' + v2 + '$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Số ngày sớm hơn', kieu: 'bieuThuc', gt: N + '/x-' + N + '/(x+' + d2 + ')',
            loiThuongGap: [{ gt: N + '/(x+' + d2 + ')-' + N + '/x', giaiThich: 'Số ngày theo kế hoạch ($' + frac(N, 'x') + '$) nhiều hơn, nên lấy kế hoạch **trừ** thực tế.' }] },
          { nhan: 'b) Khi $x = ' + v2 + '$ (ngày)', kieu: 'so', gt: n1 - n2,
            loiThuongGap: [{ gt: n1, giaiThich: 'Đó mới là số ngày theo kế hoạch. Còn phải trừ số ngày thực tế $' + frac(N, v2 + d2) + ' = ' + n2 + '$.' }] }] },
        goiY: ['Số ngày = số ' + sp + ' : số ' + sp + ' mỗi ngày. Kế hoạch: $' + frac(N, 'x') + '$; thực tế: $' + frac(N, 'x+' + d2) + '$.', 'Thay $x = ' + v2 + '$ vào rồi trừ.'],
        loiGiai: ['a) Số ngày kế hoạch $' + frac(N, 'x') + '$, thực tế $' + frac(N, 'x+' + d2) + '$. Sớm hơn: $' + frac(N, 'x') + ' - ' + frac(N, 'x+' + d2) + '$ (ngày).',
          'b) Khi $x = ' + v2 + '$: $' + frac(N, v2) + ' - ' + frac(N, v2 + d2) + ' = ' + n1 + ' - ' + n2 + ' = ' + (n1 - n2) + '$ (ngày).']
      };
    } }
  ]);
})();
