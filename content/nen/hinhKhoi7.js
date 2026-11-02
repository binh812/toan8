// Bài nền (lớp 7): Hình hộp chữ nhật, hình lập phương, hình lăng trụ đứng – cần cho Chương X (Hình chóp).
(function () {
  'use strict';
  function themLoi(ds, gt, dap, giaiThich) {
    if (Math.abs(gt - dap) < 1e-9 || ds.some(function (l) { return Math.abs(l.gt - gt) < 1e-9; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }
  var BA_SO = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];

  TOAN8.nen({
    id: 'hinhKhoi7', ten: 'Hình hộp chữ nhật, hình lập phương, hình lăng trụ đứng', lop: 7,
    tomTat: [
      { loai: 'dinhLi', tieuDe: 'Hình hộp chữ nhật và hình lập phương',
        noiDung: 'Hình hộp chữ nhật có chiều dài $a$, chiều rộng $b$, chiều cao $c$:\n\n$S_{xq} = 2(a + b) \\cdot c$ (chu vi đáy nhân chiều cao);  $V = a \\cdot b \\cdot c$.\n\nHình lập phương cạnh $a$ (sáu mặt là hình vuông): $S_{xq} = 4a^2$; diện tích toàn phần $6a^2$; $V = a^3$.' },
      { loai: 'dinhLi', tieuDe: 'Hình lăng trụ đứng tam giác, tứ giác',
        noiDung: 'Hai đáy song song và bằng nhau; các mặt bên là **hình chữ nhật**; chiều cao $h$ là độ dài cạnh bên.\n\n$S_{xq} = C_{\\text{đáy}} \\cdot h$ (chu vi đáy nhân chiều cao);  $V = S_{\\text{đáy}} \\cdot h$ (diện tích đáy nhân chiều cao).' },
      { loai: 'chuY', noiDung: '• Đáy là tam giác vuông: $S_{\\text{đáy}} = \\frac{1}{2} \\cdot$ (tích hai cạnh góc vuông). Đáy là hình thang: $S = \\frac{(\\text{đáy lớn} + \\text{đáy bé}) \\cdot \\text{chiều cao}}{2}$.\n\n• Đơn vị: diện tích là $\\text{cm}^2$, thể tích là $\\text{cm}^3$. $1 \\text{ dm}^3 = 1$ lít; $1 \\text{ m}^3 = 1000 \\text{ dm}^3$.\n\n• **Lỗi hay gặp:** quên nhân $\\frac{1}{2}$ khi đáy là tam giác; nhầm diện tích xung quanh với thể tích.' }
    ],
    viDu: [
      { de: 'Hình hộp chữ nhật có chiều dài $5$ cm, chiều rộng $4$ cm, chiều cao $3$ cm. Tính diện tích xung quanh và thể tích.', buoc: [
        { lam: '$S_{xq} = 2(5 + 4) \\cdot 3 = 54$ (cm²)', vi: 'Chu vi đáy $2(5 + 4) = 18$ cm, nhân với chiều cao.' },
        { lam: '$V = 5 \\cdot 4 \\cdot 3 = 60$ (cm³)', vi: 'Thể tích là tích ba kích thước.' }] },
      { de: 'Lăng trụ đứng có đáy là tam giác vuông với hai cạnh góc vuông $3$ cm, $4$ cm, cạnh huyền $5$ cm; chiều cao lăng trụ $10$ cm. Tính $S_{xq}$ và $V$.', buoc: [
        { lam: '$S_{xq} = (3 + 4 + 5) \\cdot 10 = 120$ (cm²)', vi: 'Chu vi đáy là tổng ba cạnh tam giác.' },
        { lam: '$S_{\\text{đáy}} = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6$; $V = 6 \\cdot 10 = 60$ (cm³)', vi: 'Diện tích tam giác vuông bằng nửa tích hai cạnh góc vuông.' }] }
    ],
    luyen: [
      { ten: 'Thể tích hình hộp chữ nhật, hình lập phương', muc: 1, sinh: function (r) {
        var ltg = [];
        if (r.dau() > 0) {
          var a = r.so(2, 12), V = a * a * a;
          themLoi(ltg, 3 * a, V, '$a^3 = a \\cdot a \\cdot a$, không phải $3 \\cdot a$.');
          themLoi(ltg, 6 * a * a, V, 'Đó là diện tích toàn phần $6a^2$. Thể tích là $a^3$.');
          return {
            de: 'Tính thể tích của hình lập phương có cạnh $' + a + '$ cm (đơn vị $\\text{cm}^3$).',
            dapAn: { kieu: 'so', gt: V },
            goiY: ['Thể tích hình lập phương cạnh $a$ là $V = a^3$.', '$V = ' + a + ' \\cdot ' + a + ' \\cdot ' + a + '$.'],
            loiGiai: ['$V = a^3 = ' + a + '^3 = ' + a + ' \\cdot ' + a + ' \\cdot ' + a + ' = ' + V + '$ (cm³)'],
            loiThuongGap: ltg
          };
        }
        var d = r.so(3, 15), rr = r.so(2, 10), c = r.so(2, 12), V2 = d * rr * c;
        while (rr === d) rr = r.so(2, 10);
        V2 = d * rr * c;
        themLoi(ltg, 2 * (d + rr) * c, V2, 'Đó là diện tích xung quanh. Thể tích là **tích** ba kích thước.');
        return {
          de: 'Một hình hộp chữ nhật có chiều dài $' + d + '$ cm, chiều rộng $' + rr + '$ cm, chiều cao $' + c + '$ cm. Tính thể tích của nó (cm³).',
          dapAn: { kieu: 'so', gt: V2 },
          goiY: ['$V = a \\cdot b \\cdot c$ (dài nhân rộng nhân cao).', '$V = ' + d + ' \\cdot ' + rr + ' \\cdot ' + c + '$.'],
          loiGiai: ['$V = ' + d + ' \\cdot ' + rr + ' \\cdot ' + c + ' = ' + V2 + '$ (cm³)'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Diện tích xung quanh', muc: 2, sinh: function (r) {
        var ltg = [];
        if (r.dau() > 0) {
          var a = r.so(2, 15), S = 4 * a * a;
          themLoi(ltg, 6 * a * a, S, 'Đó là diện tích **toàn phần** (cả hai đáy). Diện tích xung quanh chỉ gồm $4$ mặt bên.');
          themLoi(ltg, 4 * a, S, 'Mỗi mặt là hình vuông có diện tích $a^2$; bốn mặt bên là $4a^2$.');
          return {
            de: 'Tính diện tích xung quanh của hình lập phương có cạnh $' + a + '$ cm (cm²).',
            dapAn: { kieu: 'so', gt: S },
            goiY: ['Diện tích xung quanh hình lập phương là diện tích $4$ mặt bên.', '$S_{xq} = 4a^2$.'],
            loiGiai: ['$S_{xq} = 4a^2 = 4 \\cdot ' + a + '^2 = ' + S + '$ (cm²)'],
            loiThuongGap: ltg
          };
        }
        var d = r.so(4, 20), rr = r.so(2, 12), c = r.so(2, 12);
        while (rr >= d) rr = r.so(2, 12);
        var S2 = 2 * (d + rr) * c;
        themLoi(ltg, (d + rr) * c, S2, 'Chu vi đáy là $2(a + b)$, em quên nhân $2$.');
        themLoi(ltg, d * rr * c, S2, 'Đó là thể tích. Diện tích xung quanh $= 2(a + b) \\cdot c$.');
        return {
          de: 'Một hình hộp chữ nhật có chiều dài $' + d + '$ cm, chiều rộng $' + rr + '$ cm, chiều cao $' + c + '$ cm. Tính diện tích xung quanh của nó (cm²).',
          dapAn: { kieu: 'so', gt: S2 },
          goiY: ['$S_{xq}$ = chu vi đáy $\\cdot$ chiều cao.', 'Chu vi đáy $= 2(' + d + ' + ' + rr + ')$.'],
          loiGiai: ['Chu vi đáy: $2(' + d + ' + ' + rr + ') = ' + 2 * (d + rr) + '$ (cm).', '$S_{xq} = ' + 2 * (d + rr) + ' \\cdot ' + c + ' = ' + S2 + '$ (cm²)'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Lăng trụ đứng tam giác', muc: 2, sinh: function (r) {
        var t = r.chon(BA_SO), a = t[0], b = t[1], c = t[2], h = r.so(4, 15), ltg = [];
        var dau = 'Một hình lăng trụ đứng có đáy là tam giác vuông với hai cạnh góc vuông $' + a + '$ cm, $' + b + '$ cm và cạnh huyền $' + c + '$ cm; chiều cao của lăng trụ là $' + h + '$ cm. ';
        if (r.dau() > 0) {
          var Sd = a * b / 2, V = Sd * h;
          themLoi(ltg, a * b * h, V, 'Diện tích đáy tam giác vuông là $\\frac{1}{2} \\cdot ' + a + ' \\cdot ' + b + '$, em quên nhân $\\frac{1}{2}$.');
          themLoi(ltg, (a + b + c) * h, V, 'Đó là diện tích xung quanh. Thể tích = diện tích đáy $\\cdot$ chiều cao.');
          return {
            de: dau + 'Tính thể tích của lăng trụ (cm³).',
            dapAn: { kieu: 'so', gt: V },
            goiY: ['$V = S_{\\text{đáy}} \\cdot h$.', 'Đáy là tam giác vuông: $S_{\\text{đáy}} = \\frac{1}{2} \\cdot ' + a + ' \\cdot ' + b + '$.'],
            loiGiai: ['$S_{\\text{đáy}} = \\frac{1}{2} \\cdot ' + a + ' \\cdot ' + b + ' = ' + Sd + '$ (cm²).', '$V = ' + Sd + ' \\cdot ' + h + ' = ' + V + '$ (cm³)'],
            loiThuongGap: ltg
          };
        }
        var C = a + b + c, S = C * h;
        themLoi(ltg, (a + b) * h, S, 'Chu vi đáy gồm **cả ba** cạnh của tam giác, kể cả cạnh huyền $' + c + '$ cm.');
        return {
          de: dau + 'Tính diện tích xung quanh của lăng trụ (cm²).',
          dapAn: { kieu: 'so', gt: S },
          goiY: ['$S_{xq} = C_{\\text{đáy}} \\cdot h$.', 'Chu vi đáy $= ' + a + ' + ' + b + ' + ' + c + '$.'],
          loiGiai: ['$C_{\\text{đáy}} = ' + a + ' + ' + b + ' + ' + c + ' = ' + C + '$ (cm).', '$S_{xq} = ' + C + ' \\cdot ' + h + ' = ' + S + '$ (cm²)'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Bài toán thực tế', muc: 3, sinh: function (r) {
        var ltg = [];
        if (r.dau() > 0) {
          var d = r.so(8, 20), rr = r.so(5, 12), c = r.so(6, 12), n = r.so(2, c - 2), conLai = r.dau() > 0;
          while (rr >= d) rr = r.so(5, 12);
          var V = d * rr * (conLai ? c - n : n);
          themLoi(ltg, d * rr * c, V, 'Đó là thể tích **cả bể**. Em chỉ tính phần ' + (conLai ? 'còn trống' : 'có nước') + '.');
          return {
            de: 'Một bể nước dạng hình hộp chữ nhật có chiều dài $' + d + '$ dm, chiều rộng $' + rr + '$ dm, chiều cao $' + c + '$ dm. Mực nước trong bể đang cao $' + n + '$ dm. ' + (conLai ? 'Cần đổ thêm bao nhiêu lít nước thì bể đầy?' : 'Trong bể đang có bao nhiêu lít nước?'),
            dapAn: { kieu: 'so', gt: V },
            goiY: [conLai ? 'Phần còn trống cũng là một hình hộp chữ nhật, chiều cao $' + c + ' - ' + n + '$ dm.' : 'Nước trong bể có dạng hình hộp chữ nhật cao $' + n + '$ dm.', 'Nhớ: $1 \\text{ dm}^3 = 1$ lít.'],
            loiGiai: conLai
              ? ['Chiều cao phần còn trống: $' + c + ' - ' + n + ' = ' + (c - n) + '$ (dm).', '$V = ' + d + ' \\cdot ' + rr + ' \\cdot ' + (c - n) + ' = ' + V + '$ (dm³, tức là lít).']
              : ['Nước có dạng hình hộp chữ nhật $' + d + ' \\times ' + rr + ' \\times ' + n + '$ (dm).', '$V = ' + d + ' \\cdot ' + rr + ' \\cdot ' + n + ' = ' + V + '$ (dm³, tức là lít).'],
            loiThuongGap: ltg
          };
        }
        var lon = r.so(6, 14), be = r.so(2, lon - 2), cao = r.so(2, 8), dai = r.so(10, 30);
        while (((lon + be) * cao) % 2) cao = r.so(2, 8);
        var Sd = (lon + be) * cao / 2, V2 = Sd * dai;
        themLoi(ltg, (lon + be) * cao * dai, V2, 'Diện tích hình thang là $\\frac{(\\text{đáy lớn} + \\text{đáy bé}) \\cdot \\text{cao}}{2}$, em quên chia $2$.');
        return {
          de: 'Một khối bê tông có dạng hình lăng trụ đứng, đáy là hình thang có hai đáy $' + lon + '$ dm và $' + be + '$ dm, chiều cao hình thang $' + cao + '$ dm; chiều dài khối (chiều cao lăng trụ) là $' + dai + '$ dm. Tính thể tích khối bê tông (dm³).',
          dapAn: { kieu: 'so', gt: V2 },
          goiY: ['$V = S_{\\text{đáy}} \\cdot h$, đáy là hình thang.', '$S_{\\text{đáy}} = \\frac{(' + lon + ' + ' + be + ') \\cdot ' + cao + '}{2}$.'],
          loiGiai: ['$S_{\\text{đáy}} = \\frac{(' + lon + ' + ' + be + ') \\cdot ' + cao + '}{2} = ' + Sd + '$ (dm²).', '$V = ' + Sd + ' \\cdot ' + dai + ' = ' + V2 + '$ (dm³)'],
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
