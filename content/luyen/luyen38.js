// Luyện thêm – Bài 38: Hình chóp tam giác đều
(function () {
  'use strict';
  var BO3 = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 48, 52]];
  // Hình chóp tam giác đều tĩnh: cạnh đáy a, trung đoạn d (chiều cao tính lại từ d để hình đúng tỉ lệ).
  function hinh(a, d, h) {
    if (h == null) { var r0 = a / (2 * Math.sqrt(3)); h = Math.sqrt(Math.max(d * d - r0 * r0, 0.01)); }
    return { widget: 'hinhChop', config: { day: 3, a: a, h: h, an: true, thanhTruot: false, trai: false, hienTrungDoan: true, tenChan: 'O', tenGiua: 'M' } };
  }
  var VAT = ['Một chiếc chóp trang trí', 'Một chiếc đèn ngủ', 'Một hộp quà', 'Một mô hình kim tự tháp mini'];

  TOAN8.luyen(38, [
    { ten: 'Diện tích xung quanh', muc: 1, sinh: function (r, cc) {
      var a = r.so(2, 12) * 2, d = r.so(Math.ceil(a / 2), a + 6), p = 1.5 * a, kq = p * d;
      return {
        de: 'Hình chóp tam giác đều $S.ABC$ có cạnh đáy $' + a + '$ cm, trung đoạn $SM = ' + d + '$ cm. Tính diện tích xung quanh (cm²).',
        hinh: hinh(a, d),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$S_{xq} = p \\cdot d$, với $p$ là **nửa chu vi** đáy và $d$ là trung đoạn.', 'Nửa chu vi đáy: $p = \\frac{3 \\cdot ' + a + '}{2}$.'],
        loiGiai: ['$p = \\frac{3 \\cdot ' + a + '}{2} = ' + cc.so(p) + '$ (cm).', '$S_{xq} = p \\cdot d = ' + cc.so(p) + ' \\cdot ' + d + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: 3 * a * d, giaiThich: 'Em nhân **cả chu vi** với trung đoạn. Công thức dùng **nửa** chu vi (mỗi mặt bên là tam giác, diện tích $\\frac{1}{2} a d$).' },
          { gt: a * d / 2, giaiThich: 'Đó mới là diện tích **một** mặt bên. Hình chóp tam giác đều có $3$ mặt bên.' }]
      };
    } },
    { ten: 'Thể tích', muc: 2, sinh: function (r, cc) {
      var h = r.so(4, 15), S = r.so(2, 20) * (h % 3 === 0 ? 1 : 3), kq = S * h / 3, vat = r.chon(VAT);
      var a = Math.sqrt(4 * S / Math.sqrt(3));
      return {
        de: vat + ' có dạng hình chóp tam giác đều, diện tích đáy $' + S + '$ cm² và chiều cao $' + h + '$ cm. Tính thể tích của nó (cm³).',
        hinh: hinh(a, null, h),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$V = \\frac{1}{3} S_{đáy} \\cdot h$.', 'Nhân diện tích đáy với chiều cao rồi chia cho $3$.'],
        loiGiai: ['$V = \\frac{1}{3} \\cdot ' + S + ' \\cdot ' + h + '$', '$V = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: S * h, giaiThich: 'Em quên nhân $\\frac{1}{3}$. Thể tích hình chóp bằng **một phần ba** thể tích hình lăng trụ cùng đáy, cùng chiều cao.' }]
      };
    } },
    { ten: 'Tính ngược: cạnh đáy, diện tích đáy', muc: 2, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var a = r.so(2, 10) * 2, d = r.so(Math.ceil(a / 2), a + 6), sxq = 1.5 * a * d;
        return {
          de: 'Một hình chóp tam giác đều có trung đoạn $' + d + '$ cm và diện tích xung quanh $' + cc.so(sxq) + '$ cm². Tính độ dài cạnh đáy (cm).',
          dapAn: { kieu: 'so', gt: a },
          goiY: ['$S_{xq} = p \\cdot d$ nên nửa chu vi $p = S_{xq} : d$.', 'Nửa chu vi đáy tam giác đều là $\\frac{3a}{2}$, nên $a = \\frac{2p}{3}$.'],
          loiGiai: ['$p = ' + cc.so(sxq) + ' : ' + d + ' = ' + cc.so(1.5 * a) + '$ (cm).', 'Chu vi đáy $= 2p = ' + 3 * a + '$ (cm), nên cạnh đáy $= ' + 3 * a + ' : 3 = ' + a + '$'],
          loiThuongGap: [{ gt: sxq / d / 3, giaiThich: 'Em coi $S_{xq} : d$ là **chu vi**. Đó là **nửa** chu vi; chu vi phải nhân $2$.' }]
        };
      }
      var h = r.so(3, 12), S = r.so(2, 15) * 2, V = S * h / 3;
      return {
        de: 'Một hình chóp tam giác đều có thể tích $' + cc.so(V) + '$ cm³ và chiều cao $' + h + '$ cm. Tính diện tích đáy (cm²).',
        dapAn: { kieu: 'so', gt: S },
        goiY: ['$V = \\frac{1}{3} S \\cdot h$ nên $S = \\frac{3V}{h}$.', 'Nhân thể tích với $3$ rồi chia cho chiều cao.'],
        loiGiai: ['$S = \\frac{3V}{h} = \\frac{3 \\cdot ' + cc.so(V) + '}{' + h + '}$', '$S = ' + S + '$'],
        loiThuongGap: [{ gt: V / h, giaiThich: 'Em quên nhân $3$: từ $V = \\frac{1}{3} S h$ suy ra $S = \\frac{3V}{h}$.' }]
      };
    } },
    { ten: 'Trung đoạn từ cạnh bên (thực tế)', muc: 3, sinh: function (r, cc) {
      var t = r.chon(BO3), nua = t[0], d = t[1], l = t[2];
      var a = 2 * nua, kq = 1.5 * a * d, vat = r.chon([['Một chiếc chóp trang trí bằng inox', 'tổng diện tích các mặt bên', 'cm', 'cm²'],
        ['Một chiếc lều cắm trại', 'diện tích vải phủ ba mặt bên', 'dm', 'dm²'], ['Một chiếc đèn trang trí', 'diện tích giấy màu dán kín ba mặt bên', 'cm', 'cm²']]);
      return {
        de: vat[0] + ' có dạng hình chóp tam giác đều, cạnh đáy $' + a + '$ ' + vat[2] + ', cạnh bên $' + l + '$ ' + vat[2] + '. Tính ' + vat[1] + ' (' + vat[3] + ', coi mép nối không đáng kể).',
        hinh: hinh(a, d),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Mỗi mặt bên là tam giác cân có cạnh bên $' + l + '$, đáy $' + a + '$. Trung đoạn là đường cao của tam giác cân đó, chia đôi cạnh đáy.', 'Tính trung đoạn $d = \\sqrt{' + l + '^2 - ' + nua + '^2}$ rồi dùng $S_{xq} = p \\cdot d$.'],
        loiGiai: ['Trung đoạn $d = \\sqrt{' + l + '^2 - ' + nua + '^2} = \\sqrt{' + (l * l - nua * nua) + '} = ' + d + '$ (' + vat[2] + ').',
          'Nửa chu vi đáy $p = \\frac{3 \\cdot ' + a + '}{2} = ' + cc.so(1.5 * a) + '$ (' + vat[2] + ').',
          '$S_{xq} = ' + cc.so(1.5 * a) + ' \\cdot ' + d + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: 1.5 * a * l, giaiThich: 'Em lấy **cạnh bên** làm trung đoạn. Trung đoạn là đường cao của mặt bên, ngắn hơn cạnh bên: $d = \\sqrt{' + l + '^2 - ' + nua + '^2}$.' }]
      };
    } },
    { ten: 'Tất cả các cạnh bằng nhau (làm tròn)', muc: 3, sinh: function (r, cc) {
      var a = r.so(3, 12) * 2, vat = r.chon(['Một chiếc đèn trang trí', 'Một khối đồ chơi xếp hình', 'Một chiếc hộp quà bằng giấy']);
      var d = a * Math.sqrt(3) / 2, kq = 1.5 * a * d, lam = Math.round(kq);
      return {
        de: vat + ' có dạng hình chóp tam giác đều, **tất cả các cạnh** đều dài $' + a + '$ cm. Người ta dán giấy màu kín ba mặt bên. Tính diện tích giấy cần dùng (cm²), **làm tròn đến hàng đơn vị**.',
        hinh: hinh(a, d),
        dapAn: { kieu: 'so', gt: lam, saiSo: 0.5 },
        goiY: ['Mỗi mặt bên là tam giác **đều** cạnh $' + a + '$. Trung đoạn là đường cao của tam giác đều đó.', 'Trung đoạn $d = \\sqrt{' + a + '^2 - ' + a / 2 + '^2}$, rồi $S_{xq} = p \\cdot d$ với $p = \\frac{3 \\cdot ' + a + '}{2}$.'],
        loiGiai: ['$d = \\sqrt{' + a + '^2 - ' + a / 2 + '^2} = \\sqrt{' + (a * a - a * a / 4) + '} \\approx ' + cc.so(Math.round(d * 100) / 100) + '$ (cm).',
          '$p = \\frac{3 \\cdot ' + a + '}{2} = ' + 1.5 * a + '$ (cm).',
          '$S_{xq} = ' + 1.5 * a + ' \\cdot \\sqrt{' + (a * a - a * a / 4) + '} \\approx ' + lam + '$ (cm²)'],
        loiThuongGap: [{ gt: 1.5 * a * a, giaiThich: 'Em lấy cạnh bên $' + a + '$ làm trung đoạn. Trung đoạn là đường cao của mặt bên: $d = \\sqrt{' + a + '^2 - ' + a / 2 + '^2}$.' }]
      };
    } }
  ]);
})();
