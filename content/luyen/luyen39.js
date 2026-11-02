// Luyện thêm – Bài 39: Hình chóp tứ giác đều
(function () {
  'use strict';
  var BO3 = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20], [4, 3, 5], [8, 6, 10], [12, 5, 13], [12, 9, 15]];
  // Hình chóp tứ giác đều tĩnh: cạnh đáy a, chiều cao h (hoặc trung đoạn d thì tính h).
  function hinh(a, h, d) {
    if (h == null) h = Math.sqrt(Math.max(d * d - a * a / 4, 0.01));
    return { widget: 'hinhChop', config: { day: 4, a: a, h: h, an: true, thanhTruot: false, trai: false, hienTrungDoan: true, tenChan: 'O', tenGiua: 'M' } };
  }

  TOAN8.luyen(39, [
    { ten: 'Diện tích xung quanh', muc: 1, sinh: function (r, cc) {
      var a = r.so(2, 15), d = r.so(Math.ceil(a / 2) + 1, a + 8), kq = 2 * a * d;
      return {
        de: 'Hình chóp tứ giác đều $S.ABCD$ có cạnh đáy $' + a + '$ cm, trung đoạn $SM = ' + d + '$ cm. Tính diện tích xung quanh (cm²).',
        hinh: hinh(a, null, d),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$S_{xq} = p \\cdot d$ với $p$ là **nửa chu vi** đáy, $d$ là trung đoạn.', 'Đáy là hình vuông cạnh $' + a + '$: $p = \\frac{4 \\cdot ' + a + '}{2} = ' + 2 * a + '$.'],
        loiGiai: ['$p = \\frac{4 \\cdot ' + a + '}{2} = ' + 2 * a + '$ (cm).', '$S_{xq} = ' + 2 * a + ' \\cdot ' + d + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: 4 * a * d, giaiThich: 'Em nhân **cả chu vi** đáy với trung đoạn. Công thức dùng **nửa** chu vi.' },
          { gt: a * d / 2, giaiThich: 'Đó là diện tích **một** mặt bên. Hình chóp tứ giác đều có $4$ mặt bên.' }]
      };
    } },
    { ten: 'Diện tích toàn phần', muc: 2, sinh: function (r, cc) {
      var a = r.so(3, 14), d = r.so(Math.ceil(a / 2) + 1, a + 8), sxq = 2 * a * d, kq = sxq + a * a;
      var vat = r.chon(['Một hộp quà', 'Một chiếc hộp đựng bánh', 'Một mô hình kim tự tháp bằng bìa']);
      return {
        de: vat + ' có dạng hình chóp tứ giác đều, cạnh đáy $' + a + '$ cm, trung đoạn $' + d + '$ cm. Tính diện tích bìa cần để làm **toàn bộ** hộp (diện tích toàn phần, cm²), coi mép dán không đáng kể.',
        hinh: hinh(a, null, d),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Diện tích toàn phần $=$ diện tích xung quanh $+$ diện tích đáy.', '$S_{xq} = p \\cdot d$; đáy là hình vuông nên $S_{đáy} = ' + a + '^2$.'],
        loiGiai: ['$S_{xq} = \\frac{4 \\cdot ' + a + '}{2} \\cdot ' + d + ' = ' + sxq + '$ (cm²); $S_{đáy} = ' + a + '^2 = ' + a * a + '$ (cm²).',
          '$S_{tp} = ' + sxq + ' + ' + a * a + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: sxq, giaiThich: 'Đó mới là diện tích xung quanh. Toàn phần phải cộng thêm diện tích **đáy** $' + a + '^2$.' }]
      };
    } },
    { ten: 'Thể tích', muc: 2, sinh: function (r, cc) {
      var a, h;
      do { a = r.so(2, 12); h = r.so(2, 15); } while ((a * a * h) % 3 !== 0);
      var kq = a * a * h / 3, theoChuVi = r.dau() > 0;
      var vat = r.chon([['Một chiếc bánh ít', 'cm', 'cm³'], ['Một chiếc lều', 'dm', 'dm³'], ['Một khối gỗ trang trí', 'cm', 'cm³'], ['Một mái che', 'dm', 'dm³']]);
      var de = vat[0] + ' có dạng hình chóp tứ giác đều, ' + (theoChuVi ? '**chu vi đáy** $' + 4 * a + '$ ' : 'cạnh đáy $' + a + '$ ') + vat[1] + ', chiều cao $' + h + '$ ' + vat[1] + '. Tính thể tích của nó (' + vat[2] + ').';
      var ltg = [{ gt: a * a * h, giaiThich: 'Em quên nhân $\\frac{1}{3}$: $V = \\frac{1}{3} S_{đáy} \\cdot h$.' }];
      if (theoChuVi) ltg.push({ gt: 16 * a * a * h / 3, giaiThich: 'Em dùng chu vi $' + 4 * a + '$ làm cạnh đáy. Cạnh đáy $= ' + 4 * a + ' : 4 = ' + a + '$.' });
      return {
        de: de,
        hinh: hinh(a, h),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$V = \\frac{1}{3} S_{đáy} \\cdot h$, đáy là hình vuông.', theoChuVi ? 'Tìm cạnh đáy từ chu vi trước: cạnh $=$ chu vi $: 4$.' : '$S_{đáy} = ' + a + '^2$.'],
        loiGiai: (theoChuVi ? ['Cạnh đáy $= ' + 4 * a + ' : 4 = ' + a + '$ (' + vat[1] + ').'] : []).concat([
          '$S_{đáy} = ' + a + '^2 = ' + a * a + '$ (' + vat[1] + '²).', '$V = \\frac{1}{3} \\cdot ' + a * a + ' \\cdot ' + h + ' = ' + kq + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Trung đoạn từ chiều cao', muc: 3, sinh: function (r, cc) {
      var t = r.chon(BO3), nua = t[0], h = t[1], d = t[2], a = 2 * nua, kq = 2 * a * d;
      return {
        de: 'Hình chóp tứ giác đều $S.ABCD$ có cạnh đáy $' + a + '$ cm, chiều cao $SO = ' + h + '$ cm ($O$ là tâm đáy, $M$ là trung điểm $AB$). Tính diện tích xung quanh (cm²).',
        hinh: hinh(a, h),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tam giác $SOM$ vuông tại $O$, với $OM = \\frac{' + a + '}{2} = ' + nua + '$ (nửa cạnh đáy). Trung đoạn $SM$ là cạnh huyền.', '$SM = \\sqrt{SO^2 + OM^2}$, rồi $S_{xq} = p \\cdot SM$.'],
        loiGiai: ['$OM = ' + a + ' : 2 = ' + nua + '$ (cm); $SM = \\sqrt{' + h + '^2 + ' + nua + '^2} = \\sqrt{' + d * d + '} = ' + d + '$ (cm).',
          '$p = \\frac{4 \\cdot ' + a + '}{2} = ' + 2 * a + '$ (cm).', '$S_{xq} = ' + 2 * a + ' \\cdot ' + d + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: 2 * a * h, giaiThich: 'Em dùng **chiều cao** $SO$ thay cho trung đoạn. Trung đoạn $SM$ là đường cao của mặt bên, dài hơn $SO$.' }]
      };
    } },
    { ten: 'Trung đoạn từ cạnh bên (thực tế)', muc: 3, sinh: function (r, cc) {
      var t = r.chon(BO3.filter(function (x) { return x[1] > x[0]; })), nua = t[0], d = t[1], l = t[2], a = 2 * nua, kq = 2 * a * d;
      var vat = r.chon([['Một mái che giếng trời', 'bốn mặt bên lợp kính', 'diện tích kính cần dùng', 'm', 'm²'],
        ['Một chiếc lều cắm trại', 'bốn mặt bên phủ vải', 'diện tích vải cần dùng', 'dm', 'dm²'],
        ['Một mái nhà chòi', 'bốn mặt bên lợp lá', 'diện tích mái cần lợp', 'm', 'm²']]);
      if (vat[3] === 'm' && a > 16) { a = a / 2; nua = nua / 2; d = d / 2; l = l / 2; kq = 2 * a * d; }
      return {
        de: vat[0] + ' có dạng hình chóp tứ giác đều, ' + vat[1] + '. Cạnh đáy dài $' + cc.so(a) + '$ ' + vat[3] + ', mỗi cạnh bên dài $' + cc.so(l) + '$ ' + vat[3] + '. Tính ' + vat[2] + ' (' + vat[4] + '), coi viền không đáng kể.',
        hinh: hinh(a, null, d),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Mỗi mặt bên là tam giác cân (cạnh bên $' + cc.so(l) + '$, đáy $' + cc.so(a) + '$). Trung đoạn là đường cao của tam giác đó, chia đôi cạnh đáy.', 'Trung đoạn $d = \\sqrt{' + cc.so(l) + '^2 - ' + cc.so(nua) + '^2}$; rồi $S_{xq} = p \\cdot d$.'],
        loiGiai: ['$d = \\sqrt{' + cc.so(l) + '^2 - ' + cc.so(nua) + '^2} = \\sqrt{' + cc.so(l * l - nua * nua) + '} = ' + cc.so(d) + '$ (' + vat[3] + ').',
          '$p = \\frac{4 \\cdot ' + cc.so(a) + '}{2} = ' + cc.so(2 * a) + '$ (' + vat[3] + ').', '$S_{xq} = ' + cc.so(2 * a) + ' \\cdot ' + cc.so(d) + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: 2 * a * l, giaiThich: 'Em lấy **cạnh bên** làm trung đoạn. Trung đoạn ngắn hơn cạnh bên: $d = \\sqrt{' + cc.so(l) + '^2 - ' + cc.so(nua) + '^2}$.' }]
      };
    } },
    { ten: 'Khối ghép: lập phương và hình chóp', muc: 3, sinh: function (r, cc) {
      var a, c;
      do { a = r.so(2, 10); c = r.so(2, 12); } while ((a * a * c) % 3 !== 0);
      var H = a + c, v1 = a * a * a, v2 = a * a * c / 3, kq = v1 + v2;
      return {
        de: 'Một khối gỗ gồm đế là hình lập phương cạnh $' + a + '$ cm, phía trên là một hình chóp tứ giác đều có đáy là mặt trên của lập phương. Chiều cao của **cả khối gỗ** là $' + H + '$ cm. Tính thể tích khối gỗ (cm³).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Thể tích $=$ thể tích lập phương $+$ thể tích hình chóp. Hình chóp có cạnh đáy $' + a + '$ cm.', 'Chiều cao hình chóp $=$ chiều cao cả khối $-$ cạnh lập phương.'],
        loiGiai: ['Lập phương: $V_1 = ' + a + '^3 = ' + v1 + '$ (cm³).', 'Chiều cao hình chóp: $' + H + ' - ' + a + ' = ' + c + '$ (cm); $V_2 = \\frac{1}{3} \\cdot ' + a + '^2 \\cdot ' + c + ' = ' + v2 + '$ (cm³).',
          '$V = ' + v1 + ' + ' + v2 + ' = ' + kq + '$'],
        loiThuongGap: [{ gt: v1 + a * a * H / 3, giaiThich: 'Em dùng chiều cao **cả khối** $' + H + '$ cm cho hình chóp. Chiều cao hình chóp chỉ là $' + H + ' - ' + a + ' = ' + c + '$ cm.' },
          { gt: v1 + a * a * c, giaiThich: 'Em quên nhân $\\frac{1}{3}$ khi tính thể tích hình chóp.' }]
      };
    } }
  ]);
})();
