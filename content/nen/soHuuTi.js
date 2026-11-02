// Bài nền (lớp 7): Số hữu tỉ, lũy thừa, quy tắc dấu ngoặc – cần cho Chương I, II, VII.
(function () {
  'use strict';
  function giaTri(s) { if (typeof s === 'number') return s; var p = String(s).split('/'); return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(s); }
  // thêm lỗi thường gặp (đáp án kiểu số) nếu khác đáp án và khác các lỗi đã có
  function themLoi(ds, gt, dap, giaiThich) {
    var v = giaTri(gt);
    if (!isFinite(v) || Math.abs(v - giaTri(dap)) < 1e-9) return;
    if (ds.some(function (l) { return Math.abs(giaTri(l.gt) - v) < 1e-9; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }

  TOAN8.nen({
    id: 'soHuuTi', ten: 'Số hữu tỉ, lũy thừa và quy tắc dấu ngoặc', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Số hữu tỉ',
        noiDung: 'Số hữu tỉ là số viết được dưới dạng phân số $\\frac{a}{b}$ với $a, b$ là số nguyên, $b \\ne 0$. Ví dụ: $-3 = \\frac{-3}{1}$; $0{,}5 = \\frac{1}{2}$; $-\\frac{2}{3}$.\n\nCộng, trừ, nhân, chia số hữu tỉ làm **như với phân số**. Thứ tự: lũy thừa → nhân, chia → cộng, trừ (có ngoặc thì làm trong ngoặc trước).' },
      { loai: 'dinhLi', tieuDe: 'Lũy thừa với số mũ tự nhiên',
        noiDung: '$x^n = x \\cdot x \\cdots x$ ($n$ thừa số $x$). Với $m, n$ là số tự nhiên:\n\n• $x^m \\cdot x^n = x^{m + n}$ (nhân: **cộng** số mũ);\n\n• $x^m : x^n = x^{m - n}$ ($x \\ne 0$, $m \\ge n$; chia: **trừ** số mũ);\n\n• $(x^m)^n = x^{m \\cdot n}$ (lũy thừa của lũy thừa: **nhân** số mũ);\n\n• $\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$.' },
      { loai: 'dinhLi', tieuDe: 'Quy tắc dấu ngoặc',
        noiDung: 'Bỏ ngoặc có dấu "$+$" đằng trước: **giữ nguyên** dấu các số hạng trong ngoặc.\n\nBỏ ngoặc có dấu "$-$" đằng trước: **đổi dấu** tất cả các số hạng trong ngoặc: $-(a - b + c) = -a + b - c$.' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** $(-2)^2 = 4$ nhưng $-2^2 = -4$ (chỉ $2$ được bình phương). Lũy thừa bậc **chẵn** của số âm là số dương, bậc **lẻ** là số âm: $(-2)^3 = -8$.' }
    ],
    viDu: [
      { de: 'Tính $\\left(-\\frac{2}{3}\\right)^3$.', buoc: [
        { lam: 'Số mũ $3$ lẻ nên kết quả âm.', vi: 'Tích của ba số âm là một số âm.' },
        { lam: '$\\left(-\\frac{2}{3}\\right)^3 = -\\frac{2^3}{3^3} = -\\frac{8}{27}$', vi: 'Nâng cả tử và mẫu lên lũy thừa bậc $3$.' }] },
      { de: 'Tính hợp lí: $\\left(15 + \\frac{3}{7}\\right) - \\left(15 - \\frac{4}{7}\\right)$.', buoc: [
        { lam: '$= 15 + \\frac{3}{7} - 15 + \\frac{4}{7}$', vi: 'Trước ngoặc thứ hai có dấu "$-$" nên đổi dấu mọi số hạng trong ngoặc: $-15$ và $+\\frac{4}{7}$.' },
        { lam: '$= (15 - 15) + \\left(\\frac{3}{7} + \\frac{4}{7}\\right) = 0 + 1 = 1$', vi: 'Nhóm các số đối nhau lại cho gọn.' }] }
    ],
    luyen: [
      { ten: 'Lũy thừa của số hữu tỉ', muc: 1, sinh: function (r, cc) {
        var laPs = r.dau() > 0, p, q, n, am;
        if (laPs) {
          p = r.so(1, 5); q = r.so(2, 5);
          while (cc.ucln(p, q) !== 1) { p = r.so(1, 5); q = r.so(2, 5); }
          n = r.so(2, 3); am = r.dau() < 0;
        } else { p = r.so(2, 5); q = 1; n = r.so(2, p <= 3 ? 4 : 3); am = true; }
        var s = am ? -1 : 1, tu = Math.pow(s * p, n), mau = Math.pow(q, n), kq = cc.phanSo(tu, mau);
        var coSo = (am ? '-' : '') + (q === 1 ? String(p) : '\\frac{' + p + '}{' + q + '}');
        var loiGiai = [];
        if (am) loiGiai.push('Số mũ $' + n + '$ là số ' + (n % 2 ? 'lẻ' : 'chẵn') + ' nên kết quả là số **' + (n % 2 ? 'âm' : 'dương') + '**.');
        if (q === 1) {
          var tich = []; for (var i = 0; i < n; i++) tich.push('(-' + p + ')');
          loiGiai.push('$(-' + p + ')^{' + n + '} = ' + tich.join(' \\cdot ') + ' = ' + kq.tex + '$');
        } else {
          loiGiai.push('$\\left(' + coSo + '\\right)^{' + n + '} = ' + (tu < 0 ? '-' : '') + '\\frac{' + p + '^{' + n + '}}{' + q + '^{' + n + '}} = ' + kq.tex + '$');
        }
        var ltg = [];
        if (am) themLoi(ltg, cc.phanSo(-tu, mau).ascii, kq.ascii, 'Sai dấu: lũy thừa bậc **chẵn** của số âm là số dương, bậc **lẻ** là số âm.');
        if (q === 1) themLoi(ltg, String(s * p * n), kq.ascii, 'Em đã nhân cơ số với số mũ. $a^n$ là tích của $n$ thừa số $a$.');
        else themLoi(ltg, cc.phanSo(tu, q).ascii, kq.ascii, 'Phải nâng **cả tử và mẫu** lên lũy thừa: $\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$.');
        return {
          de: 'Tính $' + (q === 1 ? '(' + coSo + ')' : '\\left(' + coSo + '\\right)') + '^{' + n + '}$.',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['$x^n$ là tích của $n$ thừa số $x$; số âm mũ chẵn thì dương, mũ lẻ thì âm.', q === 1 ? 'Viết thành tích $' + n + '$ thừa số $(-' + p + ')$ rồi nhân dần.' : 'Nâng cả tử và mẫu lên lũy thừa bậc $' + n + '$, rồi xét dấu.'],
          loiGiai: loiGiai, loiThuongGap: ltg
        };
      } },
      { ten: 'Nhân, chia lũy thừa cùng cơ số', muc: 2, sinh: function (r) {
        var v = r.chon(['x', 'y', 'a']), loai = r.chon([0, 1, 2]), m, n, k, de, quyTac, bieuThuc, ltg = [];
        if (loai === 0) {
          m = r.so(2, 9); n = r.so(2, 9); k = m + n;
          bieuThuc = v + '^{' + m + '} \\cdot ' + v + '^{' + n + '}'; quyTac = 'Nhân hai lũy thừa cùng cơ số: giữ cơ số, **cộng** số mũ.';
          if (m * n !== k) ltg.push({ gt: v + '^' + (m * n), giaiThich: 'Nhân hai lũy thừa cùng cơ số thì **cộng** số mũ, không nhân.' });
        } else if (loai === 1) {
          n = r.so(2, 6); m = r.so(n + 2, 12); k = m - n;
          bieuThuc = v + '^{' + m + '} : ' + v + '^{' + n + '}'; quyTac = 'Chia hai lũy thừa cùng cơ số (khác $0$): giữ cơ số, **trừ** số mũ.';
          if (m % n === 0 && m / n !== k) ltg.push({ gt: v + '^' + (m / n), giaiThich: 'Chia hai lũy thừa cùng cơ số thì **trừ** số mũ, không chia.' });
        } else {
          m = r.so(2, 5); n = r.so(2, 4); k = m * n;
          bieuThuc = '(' + v + '^{' + m + '})^{' + n + '}'; quyTac = 'Lũy thừa của một lũy thừa: giữ cơ số, **nhân** số mũ.';
          if (m + n !== k) ltg.push({ gt: v + '^' + (m + n), giaiThich: 'Lũy thừa của lũy thừa thì **nhân** số mũ: $(x^m)^n = x^{m \\cdot n}$.' });
        }
        de = 'Viết kết quả dưới dạng một lũy thừa của $' + v + '$' + (loai === 1 ? ' ($' + v + ' \\ne 0$)' : '') + ': $' + bieuThuc + '$.';
        var phep = loai === 0 ? m + ' + ' + n : loai === 1 ? m + ' - ' + n : m + ' \\cdot ' + n;
        return {
          de: de,
          dapAn: { kieu: 'bieuThuc', gt: v + '^' + k },
          goiY: ['Nhân: cộng số mũ; chia: trừ số mũ; lũy thừa của lũy thừa: nhân số mũ.', quyTac],
          loiGiai: [quyTac, '$' + bieuThuc + ' = ' + v + '^{' + phep + '} = ' + v + '^{' + k + '}$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Quy tắc dấu ngoặc (tính hợp lí)', muc: 2, sinh: function (r, cc) {
        var A = r.so(11, 99), q = r.so(3, 9), p = r.so(1, 2 * q), s = r.so(1, 2 * q), v2 = r.dau() > 0;
        while (cc.ucln(p, q) !== 1) p = r.so(1, 2 * q);
        while (cc.ucln(s, q) !== 1 || (v2 && s === p)) s = r.so(1, 2 * q);
        var f = function (t) { return '\\frac{' + t + '}{' + q + '}'; };
        var de, kq, sai, buoc, lg;
        if (!v2) {
          de = '\\left(' + A + ' + ' + f(p) + '\\right) - \\left(' + A + ' - ' + f(s) + '\\right)';
          kq = cc.phanSo(p + s, q); sai = cc.phanSo(p - s, q);
          buoc = ['$= ' + A + ' + ' + f(p) + ' - ' + A + ' + ' + f(s) + '$', '$= (' + A + ' - ' + A + ') + \\frac{' + p + ' + ' + s + '}{' + q + '} = ' + kq.tex + '$'];
          lg = 'Trước ngoặc thứ hai có dấu "$-$": bỏ ngoặc phải đổi dấu **mọi** số hạng: $-\\left(' + A + ' - ' + f(s) + '\\right) = -' + A + ' + ' + f(s) + '$.';
        } else {
          de = '-\\left(' + A + ' - ' + f(p) + '\\right) + \\left(' + A + ' - ' + f(s) + '\\right)';
          kq = cc.phanSo(p - s, q); sai = cc.phanSo(-p - s, q);
          buoc = ['$= -' + A + ' + ' + f(p) + ' + ' + A + ' - ' + f(s) + '$', '$= (-' + A + ' + ' + A + ') + \\frac{' + p + ' - ' + s + '}{' + q + '} = ' + kq.tex + '$'];
          lg = 'Trước ngoặc thứ nhất có dấu "$-$": $-\\left(' + A + ' - ' + f(p) + '\\right) = -' + A + ' + ' + f(p) + '$ (đổi dấu cả $' + f(p) + '$).';
        }
        var ltg = []; themLoi(ltg, sai.ascii, kq.ascii, lg);
        return {
          de: 'Tính hợp lí: $' + de + '$.',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Bỏ ngoặc: trước ngoặc có dấu "$-$" thì đổi dấu mọi số hạng trong ngoặc.', 'Sau khi bỏ ngoặc, nhóm $' + A + '$ với $-' + A + '$ cho triệt tiêu.'],
          loiGiai: ['Bỏ dấu ngoặc (ngoặc có dấu "$-$" đằng trước thì đổi dấu các số hạng bên trong):'].concat(buoc),
          loiThuongGap: ltg
        };
      } },
      { ten: 'Thứ tự thực hiện phép tính', muc: 3, sinh: function (r, cc) {
        var k = r.so(2, 3), b = r.so(3, 7), a = r.so(1, b - 1), c = r.so(1, 9), k2 = k * k;
        while (cc.ucln(a, b) !== 1) a = r.so(1, b - 1);
        while (cc.ucln(c, b) !== 1) c = r.so(1, 9);
        var kq = cc.phanSo(k2 * a - c, b), ltg = [];
        themLoi(ltg, cc.phanSo(-k2 * a - c, b).ascii, kq.ascii, '$(-' + k + ')^2 = ' + k2 + '$ là số **dương** (bậc chẵn của số âm).');
        themLoi(ltg, cc.phanSo(k2 * (a - c), b).ascii, kq.ascii, 'Sai thứ tự: phải **nhân trước, trừ sau**, không trừ $\\frac{' + a + '}{' + b + '} - \\frac{' + c + '}{' + b + '}$ trước.');
        return {
          de: 'Tính $(-' + k + ')^2 \\cdot \\frac{' + a + '}{' + b + '} - \\frac{' + c + '}{' + b + '}$.',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Thứ tự: lũy thừa → nhân, chia → cộng, trừ.', 'Tính $(-' + k + ')^2$ trước, rồi nhân với $\\frac{' + a + '}{' + b + '}$, cuối cùng mới trừ.'],
          loiGiai: ['Lũy thừa trước: $(-' + k + ')^2 = ' + k2 + '$.',
            'Nhân: $' + k2 + ' \\cdot \\frac{' + a + '}{' + b + '} = \\frac{' + k2 * a + '}{' + b + '}$.',
            'Trừ: $\\frac{' + k2 * a + '}{' + b + '} - \\frac{' + c + '}{' + b + '} = ' + (kq.mau === b ? '' : '\\frac{' + (k2 * a - c) + '}{' + b + '} = ') + kq.tex + '$'],
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
