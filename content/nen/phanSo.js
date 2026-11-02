// Bài nền (lớp 6): Phân số và các phép tính – cần cho Chương VI (Phân thức đại số).
(function () {
  'use strict';
  function ps(cc, a, b) { return cc.phanSo(a, b); }

  TOAN8.nen({
    id: 'phanSo', ten: 'Phân số và các phép tính', lop: 6,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Rút gọn phân số',
        noiDung: 'Chia cả tử và mẫu cho **cùng một** ước chung (khác $1$). Chia cho ƯCLN thì được phân số **tối giản**.\n\nVí dụ: $\\frac{12}{18} = \\frac{12 : 6}{18 : 6} = \\frac{2}{3}$.' },
      { loai: 'dinhLi', tieuDe: 'Cộng, trừ phân số',
        noiDung: 'Cùng mẫu: cộng (trừ) các tử, **giữ nguyên** mẫu: $\\frac{a}{m} + \\frac{b}{m} = \\frac{a + b}{m}$.\n\nKhác mẫu: **quy đồng** (đưa về cùng mẫu, thường là BCNN của các mẫu) rồi cộng.' },
      { loai: 'dinhLi', tieuDe: 'Nhân, chia phân số',
        noiDung: '$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$ (tử nhân tử, mẫu nhân mẫu).\n\n$\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$ (nhân với phân số **đảo ngược**).' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** cộng tử với tử, mẫu với mẫu: $\\frac{1}{2} + \\frac{1}{3} \\ne \\frac{2}{5}$. Phải quy đồng: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.' }
    ],
    viDu: [
      { de: 'Tính $\\frac{3}{4} + \\frac{5}{6}$.', buoc: [
        { lam: 'BCNN$(4, 6) = 12$: $\\frac{3}{4} = \\frac{9}{12}$, $\\frac{5}{6} = \\frac{10}{12}$', vi: 'Quy đồng để hai phân số có cùng mẫu; nhân cả tử và mẫu với cùng một số thì giá trị không đổi.' },
        { lam: '$\\frac{9}{12} + \\frac{10}{12} = \\frac{19}{12}$', vi: 'Cùng mẫu thì cộng các tử, giữ nguyên mẫu.' }] },
      { de: 'Tính $\\frac{4}{9} : \\frac{2}{3}$.', buoc: [
        { lam: '$\\frac{4}{9} : \\frac{2}{3} = \\frac{4}{9} \\cdot \\frac{3}{2}$', vi: 'Chia cho một phân số là nhân với phân số đảo ngược của nó.' },
        { lam: '$= \\frac{12}{18} = \\frac{2}{3}$', vi: 'Nhân tử với tử, mẫu với mẫu rồi rút gọn (chia cả tử và mẫu cho $6$).' }] }
    ],
    luyen: [
      { ten: 'Rút gọn phân số', muc: 1, sinh: function (r, cc) {
        var t = r.so(1, 9), m = r.so(2, 9), k = r.so(2, 9);
        while (cc.ucln(t, m) !== 1) { t = r.so(1, 9); m = r.so(2, 9); }
        var a = t * k, b = m * k, kq = ps(cc, a, b);
        return {
          de: 'Rút gọn phân số $\\frac{' + a + '}{' + b + '}$ về phân số tối giản.',
          dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
          goiY: ['Tìm ƯCLN của $' + a + '$ và $' + b + '$.', 'Chia cả tử và mẫu cho ƯCLN đó.'],
          loiGiai: ['ƯCLN$(' + a + ', ' + b + ') = ' + k + '$.', '$\\frac{' + a + '}{' + b + '} = \\frac{' + a + ' : ' + k + '}{' + b + ' : ' + k + '} = ' + kq.tex + '$']
        };
      } },
      { ten: 'Cộng/trừ hai phân số khác mẫu', muc: 2, sinh: function (r, cc) {
        var b = r.chon([2, 3, 4, 5, 6]), d = r.chon([3, 4, 6, 8, 9, 10]);
        while (d === b) d = r.chon([3, 4, 6, 8, 9, 10]);
        var a = r.so(1, b + 2), c = r.so(1, d + 2), s = r.dau(), dau = s > 0 ? '+' : '-';
        var kq = ps(cc, a * d + s * c * b, b * d), sai = ps(cc, a + s * c, b + d);
        var ltg = Math.abs(sai.tu * kq.mau - kq.tu * sai.mau) > 0 ? [{ gt: sai.ascii, giaiThich: 'Em đã ' + (s > 0 ? 'cộng' : 'trừ') + ' tử với tử, mẫu với mẫu. Phải **quy đồng** trước.' }] : [];
        return {
          de: 'Tính $\\frac{' + a + '}{' + b + '} ' + dau + ' \\frac{' + c + '}{' + d + '}$ (viết kết quả tối giản).',
          dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
          goiY: ['Quy đồng mẫu: có thể dùng mẫu chung $' + b * d + '$ (hoặc BCNN của $' + b + '$ và $' + d + '$).', 'Cùng mẫu rồi thì ' + (s > 0 ? 'cộng' : 'trừ') + ' các tử, sau đó rút gọn.'],
          loiGiai: ['$\\frac{' + a + '}{' + b + '} ' + dau + ' \\frac{' + c + '}{' + d + '} = \\frac{' + a * d + '}{' + b * d + '} ' + dau + ' \\frac{' + c * b + '}{' + b * d + '} = \\frac{' + (a * d + s * c * b) + '}{' + b * d + '}$',
            '$= ' + kq.tex + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Nhân/chia phân số', muc: 2, sinh: function (r, cc) {
        var a = r.so(1, 9), b = r.so(2, 9), c = r.so(1, 9), d = r.so(2, 9), chia = r.dau() > 0;
        var kq = chia ? ps(cc, a * d, b * c) : ps(cc, a * c, b * d);
        var sai = chia ? ps(cc, a * c, b * d) : null;
        var ltg = chia && Math.abs(sai.tu * kq.mau - kq.tu * sai.mau) > 0 ? [{ gt: sai.ascii, giaiThich: 'Em quên **đảo ngược** phân số chia: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$.' }] : [];
        return {
          de: 'Tính $\\frac{' + a + '}{' + b + '} ' + (chia ? ':' : '\\cdot') + ' \\frac{' + c + '}{' + d + '}$ (viết kết quả tối giản).',
          dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
          goiY: chia ? ['Chia cho một phân số = nhân với phân số đảo ngược.', 'Tử nhân tử, mẫu nhân mẫu rồi rút gọn.'] : ['Tử nhân tử, mẫu nhân mẫu.', 'Rút gọn kết quả.'],
          loiGiai: chia
            ? ['$\\frac{' + a + '}{' + b + '} : \\frac{' + c + '}{' + d + '} = \\frac{' + a + '}{' + b + '} \\cdot \\frac{' + d + '}{' + c + '} = \\frac{' + a * d + '}{' + b * c + '}$', '$= ' + kq.tex + '$']
            : ['$\\frac{' + a + '}{' + b + '} \\cdot \\frac{' + c + '}{' + d + '} = \\frac{' + a * c + '}{' + b * d + '}$', '$= ' + kq.tex + '$'],
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
