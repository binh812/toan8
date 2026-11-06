// Luyện thêm – Bài 25: Phương trình bậc nhất một ẩn
(function () {
  'use strict';
  function ng(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function lin(cc, a, b) { return (cc.daThuc([[a, 'x'], [b, '']])); }
  function heSo(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  // thêm lỗi thường gặp kiểu nghiệm nếu khác đáp án và khác các lỗi đã có
  function them(ds, v, ans, giaiThich) {
    if (!isFinite(v) || Math.abs(v - ans) < 1e-9) return;
    if (ds.some(function (l) { return Math.abs(l.gt[0] - v) < 1e-9; })) return;
    ds.push({ gt: [v], giaiThich: giaiThich });
  }
  // bỏ dòng lặp liền nhau (khi hệ số bằng 1, "x = 6" rồi lại "x = 6")
  function boLap(ds) { return ds.filter(function (d, i) { return d !== ds[i - 1]; }); }
  // Hình lời giải: cái cân của bài 25 theo chính số của đề (v = một vế: hệ số x và số)
  function v(x, so) { return { x: x, so: so }; }
  function b2(tr, ph) { return { trai: tr, phai: ph }; }
  function hg(tr, ph, buoc, them) {
    var tuyChon = Object.assign({ trai: tr, phai: ph, buoc: buoc }, them && them.tuyChon);
    return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1, ten: 'caiCan' }, them, { tuyChon: tuyChon }) };
  }
  var SAU_BO_NGOAC = 'Hình bắt đầu từ lúc đã bỏ dấu ngoặc.';
  var GHI =' (Nếu vô nghiệm, em gõ **vô nghiệm**; nếu mọi số đều là nghiệm, gõ **vô số nghiệm**.)';

  TOAN8.luyen(25, [
    { ten: 'Giải ax + b = 0 (nghiệm nguyên)', muc: 1, sinh: function (r, cc) {
      var x0 = r.khac0(-9, 9), a = r.chon([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5]), b = -a * x0;
      var truoc = r.dau() > 0, ve = truoc ? lin(cc, a, b) : (cc.daThuc([[b, ''], [a, 'x']]));
      var ltg = [];
      them(ltg, b / a, x0, 'Chuyển $' + b + '$ sang vế phải phải **đổi dấu**: $' + heSo(a) + 'x = ' + (-b) + '$.');
      them(ltg, -b - a, x0, 'Từ $' + heSo(a) + 'x = ' + (-b) + '$ phải **chia** hai vế cho $' + a + '$, không phải trừ đi $' + a + '$.');
      return {
        de: 'Giải phương trình $' + ve + ' = 0$.',
        dapAn: { kieu: 'nghiem', gt: [x0] },
        goiY: ['Quy tắc chuyển vế: chuyển hạng tử tự do sang vế phải và **đổi dấu** nó.', 'Được $' + heSo(a) + 'x = ' + (-b) + '$. Chia hai vế cho hệ số của $x$.'],
        hinhGiai: hg(v(a, b), v(0, 0), [b2(v(a, 0), v(0, -b)), b2(v(1, 0), v(0, x0))]),
        loiGiai: ['$' + heSo(a) + 'x = ' + (-b) + '$ (chuyển $' + b + '$ sang vế phải, đổi dấu)', '$x = ' + (-b) + ' : ' + ng(a) + '$', '$x = ' + x0 + '$'],
        loiThuongGap: ltg
      };
    } },
    { ten: 'Kiểm tra một số có là nghiệm', muc: 1, sinh: function (r, cc) {
      var p = r.khac0(-5, 5), q;
      do { q = r.khac0(-5, 5); } while (q === p);
      var x0 = r.so(-5, 5), c = r.so(-9, 9), d = p * x0 + c - q * x0;
      var la = r.dau() > 0, t = la ? x0 : x0 + r.khac0(-3, 3);
      var tr = p * t + c, ph = q * t + d;
      var trai = lin(cc, p, c), phai = lin(cc, q, d);
      return {
        de: '$x = ' + t + '$ có phải là nghiệm của phương trình $' + trai + ' = ' + phai + '$ không?',
        dapAn: { kieu: 'dungSai', gt: tr === ph },
        hinhGiai: hg(v(p, c), v(q, d), [], { thamSo: { thu: t }, ghiChu: 'Cân thay x = ' + t + ' vào hai đĩa.' }),
        goiY: ['Thay $x = ' + t + '$ vào **từng vế** rồi tính riêng.', 'Hai vế bằng nhau thì $x = ' + t + '$ là nghiệm; khác nhau thì không.'],
        loiGiai: ['Vế trái: $' + heSo(p) + (Math.abs(p) === 1 ? '' : '\\cdot ') + ng(t) + (c ? (c > 0 ? ' + ' : ' - ') + Math.abs(c) : '') + ' = ' + tr + '$.',
          'Vế phải: $' + heSo(q) + (Math.abs(q) === 1 ? '' : '\\cdot ') + ng(t) + (d ? (d > 0 ? ' + ' : ' - ') + Math.abs(d) : '') + ' = ' + ph + '$.',
          tr === ph ? 'Hai vế bằng nhau nên $x = ' + t + '$ **là** nghiệm. Chọn **Đúng**.' : '$' + tr + ' \\ne ' + ph + '$ nên $x = ' + t + '$ **không** là nghiệm. Chọn **Sai**.']
      };
    } },
    { ten: 'Giải ax + b = 0 (nghiệm phân số)', muc: 2, sinh: function (r, cc) {
      var a = r.chon([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5, -6, -8]), b;
      do { b = r.khac0(-15, 15); } while (b % a === 0);
      var kq = cc.phanSo(-b, a), sai = cc.phanSo(b, a), dao = cc.phanSo(-a, b);
      var ltg = [];
      them(ltg, b / a, -b / a, 'Chuyển $' + b + '$ sang vế phải phải **đổi dấu** thành $' + (-b) + '$ (em được $' + sai.tex + '$ là sai dấu).');
      them(ltg, -a / b, -b / a, 'Em chia ngược: $' + heSo(a) + 'x = ' + (-b) + '$ thì $x = ' + (-b) + ' : ' + ng(a) + '$ (vế phải chia cho hệ số), không phải $' + dao.tex + '$.');
      return {
        de: 'Giải phương trình $' + lin(cc, a, b) + ' = 0$ (nghiệm viết dạng phân số tối giản).',
        dapAn: { kieu: 'nghiem', gt: [-b / a] },
        goiY: ['Chuyển $' + b + '$ sang vế phải, nhớ đổi dấu.', 'Chia hai vế cho $' + a + '$ rồi rút gọn phân số (chú ý dấu).'],
        hinhGiai: hg(v(a, b), v(0, 0), [b2(v(a, 0), v(0, -b)), b2(v(1, 0), v(0, -b / a))]),
        loiGiai: boLap(['$' + heSo(a) + 'x = ' + (-b) + '$', '$x = ' + (-b) + ' : ' + ng(a) + '$', '$x = ' + kq.tex + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Phương trình có dấu ngoặc', muc: 2, sinh: function (r, cc) {
      var x0 = r.so(-6, 6), a, b, d, e, c, k = 0;
      do {
        a = r.so(2, 9); b = r.so(1, 5); d = r.so(1, 4); e = r.khac0(-6, 6);
        c = (a - b - d) * x0 - d * e; k++;
      } while ((a - b - d === 0 || c === 0 || Math.abs(c) > 20) && k < 50);
      if (a - b - d === 0 || c === 0) { a = 6; b = 2; d = 1; e = 3; c = 3 * x0 - 3; if (c === 0) { e = 2; c = 3 * x0 - 2; } }
      var h = a - b - d, trong = lin(cc, b, c), sau = lin(cc, d, d * e), phai = lin(cc, 1, e);
      var de = heSo(a) + 'x - (' + trong + ') = ' + heSo(d) + (d === 1 ? '' : '') + '(' + phai + ')';
      if (d === 1) de = heSo(a) + 'x - (' + trong + ') = ' + phai;
      var ltg = [];
      // quên đổi dấu số hạng tự do trong ngoặc: -(bx + c) thành -bx + c
      them(ltg, (d * e - c) / h, x0, 'Bỏ ngoặc có dấu trừ phía trước phải đổi dấu **cả hai** hạng tử: $-(' + trong + ') = ' + (cc.daThuc([[-b, 'x'], [-c, '']])) + '$.');
      // quên nhân d vào hạng tử thứ hai trong ngoặc
      if (d > 1) them(ltg, (e + c) / h, x0, 'Nhân $' + d + '$ vào **mọi** hạng tử trong ngoặc: $' + d + '(' + phai + ') = ' + sau + '$.');
      return {
        de: 'Giải phương trình $' + de + '$.',
        dapAn: { kieu: 'nghiem', gt: [x0] },
        hinhGiai: hg(v(a - b, -c), v(d, d * e), [b2(v(h, 0), v(0, d * e + c)), b2(v(1, 0), v(0, x0))], { ghiChu: SAU_BO_NGOAC }),
        goiY: ['Bỏ dấu ngoặc trước: trước $(' + trong + ')$ là dấu trừ nên **đổi dấu** mọi hạng tử trong ngoặc' + (d > 1 ? '; nhân $' + d + '$ vào từng hạng tử của ngoặc bên phải' : '') + '.',
          'Chuyển hạng tử chứa $x$ sang trái, số sang phải, thu gọn rồi chia cho hệ số của $x$.'],
        loiGiai: boLap(['$' + heSo(a) + 'x ' +(cc.daThuc([[-b, 'x'], [-c, '']])).replace(/^([^-])/, '+$1') + ' = ' + sau + '$',
          '$' + a + 'x - ' + (b === 1 ? '' : b) + 'x - ' + (d === 1 ? '' : d) + 'x = ' + d * e + ' ' + (c >= 0 ? '+ ' + c : '- ' + (-c)) + '$',
          '$' + heSo(h) + 'x = ' + (d * e + c) + '$',
          '$x = ' + x0 + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Phương trình có mẫu số', muc: 3, sinh: function (r, cc) {
      var ms = r.xaoTron([2, 3, 4, 5, 6]), m = ms[0], n = ms[1];
      if (m * n > 20 && cc.ucln(m, n) === 1) n = ms[2];
      if (m === n) n = m === 2 ? 3 : 2;
      var L = m * n / cc.ucln(m, n), x0 = r.so(-6, 8), u = r.so(-3, 4), v = r.so(-3, 4);
      var p = m * u - x0, q = x0 - n * v, k = u - v;
      var hm = L / m, hn = L / n, h = hm - hn, cst = hm * p + hn * q;
      var tu1 = cc.daThuc([[1, 'x'], [p, '']]), tu2 = cc.daThuc([[1, 'x'], [-q, '']]);
      var de = '\\frac{' + tu1 + '}{' + m + '} - \\frac{' + tu2 + '}{' + n + '} = ' + k;
      var ltg = [];
      if (k !== 0) them(ltg, (k - cst) / h, x0, 'Khi khử mẫu, vế phải $' + k + '$ cũng phải nhân với mẫu chung $' + L + '$ thành $' + k * L + '$.');
      if (q !== 0) them(ltg, (k * L - hm * p + hn * q) / h, x0, 'Trước $' + hn + '(' + tu2 + ')$ là dấu trừ: bỏ ngoặc phải đổi dấu cả hai hạng tử, được $' + (cc.daThuc([[-hn, 'x'], [hn * q, '']])) + '$.');
      function nhan(hs, tu) { return tu === 'x' ? (hs === 1 ? '' : hs) + 'x' : (hs === 1 ? '' : hs) + '(' + tu + ')'; }
      return {
        de: 'Giải phương trình $' + de + '$.',
        dapAn: { kieu: 'nghiem', gt: [x0] },
        goiY: ['Mẫu chung của $' + m + '$ và $' + n + '$ là $' + L + '$. Nhân **mọi** hạng tử của hai vế với $' + L + '$ để khử mẫu.',
          'Được $' + nhan(hm, tu1) + ' - ' + nhan(hn, tu2) + ' = ' + k * L + '$. Bỏ ngoặc (chú ý dấu trừ) rồi chuyển vế.'],
        loiGiai: boLap(['Nhân hai vế với $' + L + '$: $' + nhan(hm, tu1) + ' - ' + nhan(hn, tu2) + ' = ' + k * L + '$',
          '$' + (cc.daThuc([[hm, 'x'], [hm * p, '']])) + ' ' + (cc.daThuc([[-hn, 'x'], [-hn * -q, '']])).replace(/^([^-])/, '+$1') + ' = ' + k * L + '$',
          '$' + heSo(h) + 'x = ' + (k * L - cst) + '$',
          '$x = ' + x0 + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Một nghiệm, vô nghiệm hay vô số nghiệm', muc: 2, sinh: function (r, cc) {
      var loai = r.chon(['vo', 'vo', 'voSo', 'mot']), k = r.so(2, 5), p = r.khac0(-5, 5), q = r.so(1, 9);
      var m = loai === 'mot' ? k + r.chon([-1, 1, 2]) : k;
      if (m === 0) m = k + 1;
      var x0 = r.so(-5, 5), s;
      if (loai === 'voSo') s = k * p - q;
      else if (loai === 'vo') { s = k * p - q + r.khac0(-6, 6); }
      else s = k * (x0 + p) - q - m * x0;
      var trai = k + '(' + lin(cc, 1, p) + ') - ' + q, phai = lin(cc, m, s);
      var c = s - k * p + q; // sau khi chuyển vế: (k - m)x = c
      var dong = ['$' + lin(cc, k, k * p) + ' - ' + q + ' = ' + phai + '$', '$' + k + 'x - ' + (m === 1 ? '' : m) + 'x = ' + s + ' ' + (k * p >= 0 ? '- ' + k * p : '+ ' + (-k * p)) + ' + ' + q + '$'];
      var d, ltg = [];
      if (loai === 'mot') {
        dong.push('$' + heSo(k - m) + 'x = ' + c + '$', '$x = ' + x0 + '$');
        d = { kieu: 'nghiem', gt: [x0] };
      } else if (loai === 'vo') {
        dong.push('$0x = ' + c + '$', 'Không có số nào nhân với $0$ được $' + c + '$. Vậy phương trình **vô nghiệm**.');
        d = { kieu: 'nghiem', gt: 'voNghiem' };
        ltg.push({ gt: [c], giaiThich: '$0x = ' + c + '$ không có nghĩa $x = ' + c + '$: thay vào thì $0\\cdot' + ng(c) + ' = 0 \\ne ' + c + '$. Phương trình vô nghiệm.' });
      } else {
        dong.push('$0x = 0$', 'Mọi số nhân với $0$ đều bằng $0$. Vậy phương trình có **vô số nghiệm** (mọi số đều là nghiệm).');
        d = { kieu: 'nghiem', gt: 'voSoNghiem' };
        ltg.push({ gt: [0], giaiThich: '$0x = 0$ đúng với **mọi** $x$, không chỉ $x = 0$. Phương trình có vô số nghiệm.' });
      }
      return {
        de: 'Giải phương trình $' + trai + ' = ' + phai + '$.' + GHI,
        hinhGiai: hg(v(k, k * p - q), v(m, s), [b2(v(k - m, 0), v(0, c))].concat(loai === 'mot' ? [b2(v(1, 0), v(0, x0))] : []),
          { ghiChu: SAU_BO_NGOAC + (loai === 'mot' ? '' : loai === 'vo' ? ' Hai đĩa lệch với mọi x: vô nghiệm.' : ' Hai đĩa luôn thăng bằng: mọi x đều là nghiệm.') }),
        dapAn: d,
        goiY: ['Bỏ ngoặc, rồi chuyển hạng tử chứa $x$ sang trái, số sang phải.', 'Thu gọn được dạng $Ax = C$. Nếu $A = 0$ thì xem $C$ có bằng $0$ không.'],
        loiGiai: boLap(dong),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Tìm m để phương trình nhận x = t làm nghiệm', muc: 2, sinh: function (r, cc) {
      var t = r.khac0(-4, 5), a = r.khac0(-5, 6), c, dd = r.so(-9, 9);
      do { c = r.khac0(-5, 5); } while (c === a);
      var m = c * t + dd - a * t;
      var trai = (cc.daThuc([[a, 'x'], [1, 'm']])), phai = lin(cc, c, dd);
      var ltg = [];
      var sai = c * t + dd + a * t;
      if (sai !== m) ltg.push({ gt: sai, giaiThich: 'Chuyển $' + (a * t) + '$ sang vế phải phải đổi dấu: $m = ' + (c * t + dd) + ' - ' + ng(a * t) + '$.' });
      return {
        de: 'Tìm $m$ để phương trình $' + trai + ' = ' + phai + '$ nhận $x = ' + t + '$ làm nghiệm.',
        dapAn: { kieu: 'so', gt: m },
        hinhGiai: hg(v(1, a * t), v(0, c * t + dd), [b2(v(1, 0), v(0, m))], { tuyChon: { bien: 'm' }, ghiChu: 'Đã thay x = ' + t + '; ẩn còn lại là m.' }),
        goiY: ['$x = ' + t + '$ là nghiệm nghĩa là thay $x = ' + t + '$ vào thì hai vế bằng nhau.', 'Thay vào được một phương trình ẩn $m$: $' + heSo(a) + (Math.abs(a) === 1 ? '' : '\\cdot ') + ng(t) + ' + m = ' + heSo(c) + (Math.abs(c) === 1 ? '' : '\\cdot ') + ng(t) + (dd ? (dd > 0 ? ' + ' : ' - ') + Math.abs(dd) : '') + '$.'],
        loiGiai: ['Thay $x = ' + t + '$: $' + (a * t) + ' + m = ' + (c * t + dd) + '$', '$m = ' + (c * t + dd) + ' - ' + ng(a * t) + '$', '$m = ' + m + '$'],
        loiThuongGap: ltg
      };
    } },
    { ten: 'Bài toán thực tế', muc: 3, sinh: function (r) {
      var loai = r.chon(['mua', 'taxi', 'nhiet']);
      if (loai === 'mua') {
        var ten = r.xaoTron(['Lan', 'Hương', 'Minh', 'Nam', 'Mai', 'Hùng']), vat = r.chon([['quyển vở', 'nghìn đồng'], ['cái bút', 'nghìn đồng'], ['hộp sữa', 'nghìn đồng']]);
        var x = r.so(4, 15), p = r.so(3, 7), q = r.so(1, p - 1), A = r.so(20, 60), B = A + (p - q) * x;
        return {
          de: ten[0] + ' mua $' + p + '$ ' + vat[0] + ' và một món quà giá $' + A + '$ nghìn đồng. ' + ten[1] + ' mua $' + q + '$ ' + vat[0] + ' cùng loại và một món quà khác giá $' + B + '$ nghìn đồng. Hai bạn trả số tiền bằng nhau. Mỗi ' + vat[0] + ' giá bao nhiêu nghìn đồng?',
          dapAn: { kieu: 'so', gt: x },
          goiY: ['Gọi $x$ (nghìn đồng) là giá một ' + vat[0] + '. Viết số tiền mỗi bạn trả theo $x$.', 'Lập phương trình $' + p + 'x + ' + A + ' = ' + (q === 1 ? '' : q) + 'x + ' + B + '$ rồi giải.'],
          loiGiai: boLap(['Gọi $x$ (nghìn đồng) là giá một ' + vat[0] + ', $x > 0$.', '$' + p + 'x + ' + A + ' = ' + (q === 1 ? '' : q) + 'x + ' + B + '$',
            '$' + (p - q === 1 ? '' : p - q) + 'x = ' + (B - A) + '$', '$x = ' + x + '$']),
          loiThuongGap: p - q > 1 ? [{ gt: B - A, giaiThich: '$' + (B - A) + '$ nghìn đồng là giá của $' + (p - q) + '$ ' + vat[0] + '. Em còn phải chia cho $' + (p - q) + '$.' }] : []
        };
      }
      if (loai === 'taxi') {
        var mo = r.chon([10, 12, 15, 20]), gia = r.chon([12, 14, 15, 16, 18]), km = r.so(3, 20), T = mo + gia * km;
        return {
          de: 'Giá cước một hãng taxi: $' + mo + '$ nghìn đồng mở cửa, sau đó $' + gia + '$ nghìn đồng mỗi ki-lô-mét. Bác Tư đi taxi hết $' + T + '$ nghìn đồng. Bác đã đi bao nhiêu ki-lô-mét?',
          dapAn: { kieu: 'so', gt: km },
          goiY: ['Gọi $x$ (km) là quãng đường bác đi. Số tiền phải trả là $' + mo + ' + ' + gia + 'x$ (nghìn đồng).', 'Giải phương trình $' + mo + ' + ' + gia + 'x = ' + T + '$.'],
          loiGiai: ['Gọi $x$ (km) là quãng đường, $x > 0$.', '$' + mo + ' + ' + gia + 'x = ' + T + '$', '$' + gia + 'x = ' + (T - mo) + '$', '$x = ' + km + '$'],
          loiThuongGap: [{ gt: (T + mo) / gia, giaiThich: 'Chuyển $' + mo + '$ sang vế phải phải đổi dấu: $' + gia + 'x = ' + T + ' - ' + mo + '$.' }].filter(function (l) { return l.gt !== km; })
        };
      }
      var C = r.chon([5, 10, 15, 20, 25, 30, 35, 40, 45]), F = 9 * C / 5 + 32;
      return {
        de: 'Độ C và độ F liên hệ bởi công thức $C = \\frac{5}{9}(F - 32)$. Hỏi $' + C + '\\,^{\\circ}\\mathrm{C}$ ứng với bao nhiêu độ F?',
        dapAn: { kieu: 'so', gt: F },
        goiY: ['Thay $C = ' + C + '$ vào công thức, được phương trình ẩn $F$.', 'Nhân hai vế với $\\frac{9}{5}$ để tìm $F - 32$, rồi tìm $F$.'],
        loiGiai: ['$' + C + ' = \\frac{5}{9}(F - 32)$', '$F - 32 = ' + C + '\\cdot\\frac{9}{5} = ' + (F - 32) + '$', '$F = ' + (F - 32) + ' + 32 = ' + F + '$'],
        loiThuongGap: [{ gt: F - 32, giaiThich: '$' + (F - 32) + '$ mới là $F - 32$. Còn phải cộng thêm $32$.' }, { gt: F - 64, giaiThich: 'Từ $F - 32 = ' + (F - 32) + '$, chuyển $-32$ sang vế phải thành $+32$.' }]
      };
    } }
  ]);
})();
