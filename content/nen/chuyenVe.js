// Bài nền (lớp 6–7): Quy tắc chuyển vế, tìm x – cần cho Chương VII (Phương trình bậc nhất).
(function () {
  'use strict';
  function giaTri(s) { if (typeof s === 'number') return s; var p = String(s).split('/'); return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(s); }
  function themLoi(ds, gt, dap, giaiThich) {
    var v = giaTri(gt);
    if (!isFinite(v) || Math.abs(v - giaTri(dap)) < 1e-9) return;
    if (ds.some(function (l) { return Math.abs(giaTri(l.gt) - v) < 1e-9; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }
  // đa thức ascii gọn (cc.daThuc) → TeX có khoảng trắng quanh dấu: 4x-4 → 4x - 4
  function tx(s) { return s.replace(/(.)([+-])/g, '$1 $2 '); }
  function ngoac(a) { return a < 0 ? '(' + a + ')' : String(a); }
  // "c − b" viết gọn: 5 − (−3) → 5 + 3
  function tru(c, b) { return c + (b < 0 ? ' + ' + (-b) : ' - ' + b); }

  TOAN8.nen({
    id: 'chuyenVe', ten: 'Quy tắc chuyển vế, tìm x', lop: 7,
    tomTat: [
      { loai: 'dinhLi', tieuDe: 'Quy tắc chuyển vế',
        noiDung: 'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải **đổi dấu** số hạng đó: dấu "$+$" thành dấu "$-$", dấu "$-$" thành dấu "$+$".\n\n$x + a = b \\Rightarrow x = b - a$;  $x - a = b \\Rightarrow x = b + a$.' },
      { loai: 'dinhLi', tieuDe: 'Chia hai vế cho cùng một số',
        noiDung: 'Nếu $a \\cdot x = b$ với $a \\ne 0$ thì $x = b : a = \\frac{b}{a}$.\n\nNếu $\\frac{p}{q} \\cdot x = b$ thì $x = b : \\frac{p}{q} = b \\cdot \\frac{q}{p}$.' },
      { loai: 'chuY', tieuDe: 'Các bước tìm $x$',
        noiDung: '1. Chuyển các số hạng chứa $x$ về một vế, các số về vế kia (nhớ **đổi dấu**).\n\n2. Thu gọn mỗi vế.\n\n3. Chia hai vế cho hệ số của $x$.\n\n4. Thử lại: thay $x$ vừa tìm vào đề xem hai vế có bằng nhau không.' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** $x + 5 = 2 \\Rightarrow x = 2 + 5$ (quên đổi dấu). Đúng là $x = 2 - 5 = -3$. Và $3x = 12 \\Rightarrow x = 12 - 3$ (sai) – phải **chia**: $x = 12 : 3 = 4$.' }
    ],
    viDu: [
      { de: 'Tìm $x$, biết $2x - 7 = 5$.', buoc: [
        { lam: '$2x = 5 + 7 = 12$', vi: 'Chuyển $-7$ sang vế phải thành $+7$.' },
        { lam: '$x = 12 : 2 = 6$', vi: 'Chia hai vế cho hệ số $2$ của $x$. Thử lại: $2 \\cdot 6 - 7 = 5$ ✓.' }] },
      { de: 'Tìm $x$, biết $5x + 4 = 2x - 8$.', buoc: [
        { lam: '$5x - 2x = -8 - 4$', vi: 'Chuyển $2x$ sang vế trái thành $-2x$, chuyển $4$ sang vế phải thành $-4$.' },
        { lam: '$3x = -12$', vi: 'Thu gọn mỗi vế.' },
        { lam: '$x = -12 : 3 = -4$', vi: 'Chia hai vế cho $3$.' }] }
    ],
    luyen: [
      { ten: 'Tìm x trong x + a = b', muc: 1, sinh: function (r) {
        var a = r.so(1, 20), b = r.so(-20, 20), loai = r.chon([0, 1, 2]), de, kq, sai, lg, buoc;
        if (loai === 0) { de = 'x + ' + a + ' = ' + b; kq = b - a; sai = b + a; buoc = '$x = ' + b + ' - ' + a + ' = ' + kq + '$'; lg = 'Chuyển $+' + a + '$ sang vế phải phải **đổi dấu** thành $-' + a + '$.'; }
        else if (loai === 1) { de = 'x - ' + a + ' = ' + b; kq = b + a; sai = b - a; buoc = '$x = ' + b + ' + ' + a + ' = ' + kq + '$'; lg = 'Chuyển $-' + a + '$ sang vế phải phải **đổi dấu** thành $+' + a + '$.'; }
        else {
          while (a === b) b = r.so(-20, 20);
          de = a + ' - x = ' + b; kq = a - b; sai = b - a; buoc = '$x = ' + tru(a, b) + ' = ' + kq + '$';
          lg = 'Từ $' + a + ' - x = ' + b + '$ ta có $x = ' + a + ' - ' + ngoac(b) + '$ (số bị trừ trừ đi hiệu), không phải $' + b + ' - ' + a + '$.';
        }
        var ltg = []; themLoi(ltg, sai, kq, lg);
        return {
          de: 'Tìm $x$, biết $' + de + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Chuyển số hạng sang vế kia thì phải đổi dấu.', loai === 2 ? 'Chuyển $x$ sang vế phải và $' + b + '$ sang vế trái: $' + a + ' - ' + ngoac(b) + ' = x$.' : 'Đưa $' + a + '$ sang vế phải với dấu ngược lại.'],
          loiGiai: [loai === 2 ? '$' + a + ' - ' + ngoac(b) + ' = x$ (chuyển $x$ sang vế phải, $' + b + '$ sang vế trái).' : 'Chuyển $' + (loai === 1 ? '-' : '+') + a + '$ sang vế phải và đổi dấu.', buoc],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Tìm x trong ax + b = c', muc: 2, sinh: function (r, cc) {
        var a = r.khac0(-9, 9); while (Math.abs(a) < 2) a = r.khac0(-9, 9);
        var x0 = r.so(-9, 9), b = r.khac0(-15, 15), c = a * x0 + b;
        var ve = tx(cc.daThuc([[a, 'x'], [b, '']])), ax = tx(cc.daThuc([[a, 'x']]));
        var ltg = []; themLoi(ltg, cc.phanSo(c + b, a).ascii, x0, 'Chuyển $' + (b > 0 ? '+' : '') + b + '$ sang vế phải phải **đổi dấu**.');
        themLoi(ltg, String(c - b - a), x0, 'Cuối cùng phải **chia** cho hệ số $' + a + '$, không phải trừ.');
        return {
          de: 'Tìm $x$, biết $' + ve + ' = ' + c + '$.',
          dapAn: { kieu: 'so', gt: x0 },
          goiY: ['Chuyển số $' + b + '$ sang vế phải (đổi dấu), rồi chia hai vế cho hệ số của $x$.', '$' + ax + ' = ' + tru(c, b) + '$.'],
          loiGiai: ['$' + ax + ' = ' + tru(c, b) + '$', '$' + ax + ' = ' + (c - b) + '$', '$x = ' + (c - b) + ' : ' + ngoac(a) + ' = ' + x0 + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Tìm x với phân số', muc: 2, sinh: function (r, cc) {
        var p = r.so(1, 7), q = r.so(2, 8), u = r.so(1, 9), v = r.so(2, 8), nhan = r.dau() > 0;
        while (cc.ucln(p, q) !== 1) p = r.so(1, 7);
        while (cc.ucln(u, v) !== 1 || u * q === p * v) { u = r.so(1, 9); v = r.so(2, 8); }
        var P = '\\frac{' + p + '}{' + q + '}', U = '\\frac{' + u + '}{' + v + '}', kq, ltg = [], de, lg;
        if (nhan) {
          kq = cc.phanSo(u * q, v * p);
          de = P + ' \\cdot x = ' + U;
          lg = ['$x = ' + U + ' : ' + P + ' = ' + U + ' \\cdot \\frac{' + q + '}{' + p + '}$', '$x = \\frac{' + u * q + '}{' + v * p + '} = ' + kq.tex + '$'];
          if (kq.tu === u * q && kq.mau === v * p) lg[1] = '$x = ' + kq.tex + '$';
          themLoi(ltg, cc.phanSo(u * p, v * q).ascii, kq.ascii, 'Chia cho $' + P + '$ là **nhân với phân số nghịch đảo** $\\frac{' + q + '}{' + p + '}$.');
        } else {
          kq = cc.phanSo(u * q - p * v, v * q);
          de = 'x + ' + P + ' = ' + U;
          var M = v * q / cc.ucln(v, q);
          lg = ['$x = ' + U + ' - ' + P + '$', '$x = \\frac{' + u * M / v + '}{' + M + '} - \\frac{' + p * M / q + '}{' + M + '} = ' + kq.tex + '$'];
          if (v === q) lg = ['$x = ' + U + ' - ' + P + ' = \\frac{' + (u - p) + '}{' + q + '}' + (kq.tu === u - p && kq.mau === q ? '' : ' = ' + kq.tex) + '$'];
          themLoi(ltg, cc.phanSo(u * q + p * v, v * q).ascii, kq.ascii, 'Chuyển $+' + P + '$ sang vế phải phải **đổi dấu** thành $-' + P + '$.');
        }
        return {
          de: 'Tìm $x$, biết $' + de + '$.',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: [nhan ? 'Tìm thừa số chưa biết: lấy tích chia cho thừa số đã biết.' : 'Chuyển $' + P + '$ sang vế phải (đổi dấu).', nhan ? 'Chia cho một phân số là nhân với phân số nghịch đảo.' : 'Quy đồng mẫu rồi trừ hai phân số.'],
          loiGiai: lg, loiThuongGap: ltg
        };
      } },
      { ten: 'Ẩn ở cả hai vế', muc: 3, sinh: function (r, cc) {
        var a = r.so(2, 9), c = r.khac0(-6, 9); while (c === a) c = r.khac0(-6, 9);
        var x0 = r.so(-9, 9), b = r.khac0(-15, 15), d = (a - c) * x0 + b;
        var trai = tx(cc.daThuc([[a, 'x'], [b, '']])), phai = tx(cc.daThuc([[c, 'x'], [d, '']]));
        var hs = a - c, ltg = [];
        themLoi(ltg, cc.phanSo(d + b, hs).ascii, x0, 'Chuyển $' + b + '$ sang vế phải phải **đổi dấu**.');
        if (a + c !== 0) themLoi(ltg, cc.phanSo(d - b, a + c).ascii, x0, 'Chuyển $' + tx(cc.daThuc([[c, 'x']])) + '$ sang vế trái phải **đổi dấu**: $' + tx(cc.daThuc([[a, 'x'], [-c, 'x']])) + '$.');
        return {
          de: 'Tìm $x$, biết $' + trai + ' = ' + phai + '$.',
          dapAn: { kieu: 'so', gt: x0 },
          goiY: ['Đưa các số hạng chứa $x$ về vế trái, các số về vế phải (đổi dấu khi chuyển vế).', '$' + tx(cc.daThuc([[a, 'x'], [-c, 'x']])) + ' = ' + tru(d, b) + '$.'],
          loiGiai: ['$' + tx(cc.daThuc([[a, 'x'], [-c, 'x']])) + ' = ' + tru(d, b) + '$', '$' + tx(cc.daThuc([[hs, 'x']])) + ' = ' + (d - b) + '$'].concat(hs === 1 ? [] : ['$x = ' + (d - b) + ' : ' + ngoac(hs) + ' = ' + x0 + '$']),
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
