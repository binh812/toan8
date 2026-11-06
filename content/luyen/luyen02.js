// Luyện thêm – Bài 2: Đa thức
(function () {
  'use strict';
  // phần biến kèm bậc
  var PHAN = [['x^2', 2], ['xy', 2], ['y^2', 2], ['x^2y', 3], ['xy^2', 3], ['x^3', 3], ['x', 1], ['y', 1]];
  var CAO = [['x^3y^2', 5], ['x^2y^3', 5], ['x^4y', 5], ['x^4', 4], ['x^3y', 4], ['x^2y^2', 4]];
  var RATCAO = [['x^5y', 6], ['x^4y^2', 6], ['x^6', 6], ['x^3y^4', 7], ['x^5y^2', 7]];

  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  // Hình lời giải theo chính số của đề: mỗi hạng tử là một nhóm mảnh (khoiGop)
  function hg(tuyChon) { return { widget: 'canh', config: { ten: 'khoiGop', tuyChon: tuyChon, chiXem: true, t: 1 } }; }
  function ngoac(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function soMu(ph, b) { var m = ph.match(new RegExp(b + '(\\^(\\d+))?')); return m ? (m[2] ? +m[2] : 1) : 0; }
  function giaTri(heSo, x, y, saiDau) {
    var pw = function (c, e) { return saiDau && c < 0 && e > 0 && e % 2 === 0 ? -Math.pow(c, e) : Math.pow(c, e); };
    return heSo.reduce(function (s, h) { return s + h[0] * pw(x, soMu(h[1], 'x')) * pw(y, soMu(h[1], 'y')); }, 0);
  }
  // "−2·(−1)^2·3" cho từng hạng tử khi thay số
  function thay(heSo, x, y) {
    return heSo.map(function (h, i) {
      var c = h[0], ph = h[1], ex = soMu(ph, 'x'), ey = soMu(ph, 'y'), parts = [];
      if (ex) parts.push(ngoac(x) + (ex > 1 ? '^' + ex : ''));
      if (ey) parts.push(ngoac(y) + (ey > 1 ? '^' + ey : ''));
      var abs = Math.abs(c), dau = c < 0 ? '- ' : (i ? '+ ' : '');
      var than = (abs === 1 && parts.length ? '' : abs + (parts.length ? ' \\cdot ' : '')) + parts.join(' \\cdot ');
      return dau + than;
    }).join(' ');
  }

  TOAN8.luyen(2, [
    { ten: 'Thu gọn đa thức', muc: 1, sinh: function (r, cc) {
      var ds = r.xaoTron(PHAN.slice(0, 6)), u = ds[0][0], v = ds[1][0];
      var a1 = r.khac0(-6, 7), a2 = r.khac0(-6, 7), b1 = r.khac0(-6, 7), b2 = r.khac0(-6, 7), c = r.so(-9, 9);
      while (a1 + a2 === 0) a2 = r.khac0(-6, 7);
      while (b1 + b2 === 0) b2 = r.khac0(-6, 7);
      var de = cc.daThuc([[a1, u], [b1, v], [a2, u], [c, ''], [b2, v]]);
      var kq = cc.daThuc([[a1 + a2, u], [b1 + b2, v], [c, '']]);
      var ltg = [];
      if (a2 < 0 || b2 < 0) {
        var sai = cc.daThuc([[a1 + Math.abs(a2), u], [b1 + Math.abs(b2), v], [c, '']]);
        ltg.push({ gt: sai, giaiThich: 'Hạng tử mang theo **dấu** đứng trước nó: hạng tử có dấu trừ phải cộng hệ số âm.' });
      }
      ltg.push({ gt: cc.daThuc([[a1 + a2, u], [b1 + b2, v]]), giaiThich: 'Em đừng bỏ quên hạng tử tự do $' + c + '$.' });
      if (c === 0) ltg.pop();
      return {
        hinhGiai: hg({ da: de }),
        de: 'Thu gọn đa thức $' + tx(cc, de) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Nhóm các hạng tử đồng dạng (cùng phần biến) với nhau.', 'Cộng hệ số trong mỗi nhóm, giữ nguyên phần biến: nhóm $' + cc.tex(u) + '$ và nhóm $' + cc.tex(v) + '$.'],
        loiGiai: ['$= (' + tx(cc, cc.daThuc([[a1, u], [a2, u]])) + ') + (' + tx(cc, cc.daThuc([[b1, v], [b2, v]])) + ')' + (c ? (c > 0 ? ' + ' : ' - ') + Math.abs(c) : '') + '$',
          '$= ' + tx(cc, kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bậc của đa thức', muc: 1, sinh: function (r, cc) {
      var cao = r.chon(CAO), ds = r.xaoTron(PHAN).slice(0, 2), c = r.khac0(-9, 9);
      var heSo = r.xaoTron([[r.khac0(-7, 7), cao[0], cao[1]], [r.khac0(-7, 7), ds[0][0], ds[0][1]], [r.khac0(-7, 7), ds[1][0], ds[1][1]]]);
      heSo.push([c, '', 0]);
      var de = cc.daThuc(heSo.map(function (h) { return [h[0], h[1]]; }));
      var tong = heSo.reduce(function (s, h) { return s + h[2]; }, 0);
      return {
        hinhGiai: hg({ da: de, gop: false, bac: true }),
        de: 'Tìm bậc của đa thức $' + tx(cc, de) + '$.',
        dapAn: { kieu: 'so', gt: cao[1] },
        goiY: ['Đa thức đã thu gọn. Tìm bậc của từng hạng tử (tổng số mũ các biến).', 'Bậc của đa thức là bậc **lớn nhất** trong các bậc đó.'],
        loiGiai: ['Các hạng tử có bậc lần lượt là ' + heSo.map(function (h) { return '$' + h[2] + '$'; }).join('; ') + '.',
          'Bậc của đa thức là $' + cao[1] + '$'],
        loiThuongGap: [{ gt: tong, giaiThich: 'Bậc của đa thức là bậc **lớn nhất** của các hạng tử, không phải tổng các bậc.' }]
      };
    } },

    { ten: 'Thu gọn trước rồi tìm bậc', muc: 2, sinh: function (r, cc) {
      var rc = r.chon(RATCAO), cao = r.chon(CAO), ds = r.xaoTron(PHAN.slice(0, 6)).slice(0, 1);
      var k = r.so(2, 7), c = r.khac0(-9, 9), a = r.khac0(-6, 6), b = r.khac0(-6, 6);
      var de = cc.daThuc([[k, rc[0]], [a, cao[0]], [b, ds[0][0]], [-k, rc[0]], [c, '']]);
      var gon = cc.daThuc([[a, cao[0]], [b, ds[0][0]], [c, '']]);
      return {
        hinhGiai: hg({ da: de, bac: true }),
        de: 'Tìm bậc của đa thức $' + tx(cc, de) + '$.',
        dapAn: { kieu: 'so', gt: cao[1] },
        goiY: ['Phải **thu gọn trước** rồi mới tìm bậc.', 'Hai hạng tử $' + k + cc.tex(rc[0]) + '$ và $-' + k + cc.tex(rc[0]) + '$ cộng lại bằng bao nhiêu?'],
        loiGiai: ['$' + k + cc.tex(rc[0]) + ' - ' + k + cc.tex(rc[0]) + ' = 0$ nên đa thức thu gọn là $' + tx(cc, gon) + '$.',
          'Các hạng tử có bậc $' + cao[1] + '$; $' + ds[0][1] + '$; $0$. Bậc của đa thức là $' + cao[1] + '$'],
        loiThuongGap: [{ gt: rc[1], giaiThich: 'Phải thu gọn trước! $' + k + cc.tex(rc[0]) + ' - ' + k + cc.tex(rc[0]) + ' = 0$ nên hạng tử bậc $' + rc[1] + '$ không còn.' },
          { gt: cao[1] + ds[0][1], giaiThich: 'Bậc của đa thức là bậc **lớn nhất** của các hạng tử, không phải tổng các bậc.' }]
          .filter(function (l, i) { return i === 0 || l.gt !== rc[1]; })
      };
    } },

    { ten: 'Giá trị của đa thức', muc: 2, khongHinh: 'Thay số vào từng hạng tử rồi cộng; cách lật thẻ chữ thành số đã có hình ở luyện thêm bài 1.', sinh: function (r, cc) {
      var coY = r.chon(['xy', 'y^2', 'x^2y', 'xy^2']), khac = r.chon(PHAN.slice(0, 6).filter(function (p) { return p[0] !== coY; }));
      var ds = r.xaoTron([[coY], khac]);
      var heSo = [[r.khac0(-4, 4), ds[0][0]], [r.khac0(-4, 4), ds[1][0]], [r.khac0(-6, 6), '']];
      var x = r.chon([-2, -1, 1, 2, 3, -3]), y = r.chon([-2, -1, 1, 2]);
      if (x === -1 && y === -1) y = 2;
      var kq = giaTri(heSo, x, y), sai = giaTri(heSo, x, y, true);
      var de = cc.daThuc(heSo);
      var ltg = sai !== kq ? [{ gt: sai, giaiThich: 'Lũy thừa bậc chẵn của số âm là số **dương**, ví dụ $(' + (x < 0 ? x : y) + ')^2 = ' + Math.pow(x < 0 ? x : y, 2) + '$.' }] : [];
      return {
        de: 'Tính giá trị của đa thức $P = ' + tx(cc, de) + '$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Thay $x = ' + x + '$, $y = ' + y + '$ vào từng hạng tử. Số âm phải đặt trong ngoặc.', 'Tính lũy thừa trước, rồi nhân, cuối cùng cộng trừ. Âm nhân âm ra dương.'],
        loiGiai: ['$P = ' + thay(heSo, x, y) + '$',
          '$P = ' + heSo.map(function (h, i) { var v = h[0] * Math.pow(x, soMu(h[1], 'x')) * Math.pow(y, soMu(h[1], 'y')); return i ? (v < 0 ? '- ' + (-v) : '+ ' + v) : String(v); }).join(' ') + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Thu gọn rồi tính giá trị', muc: 3, sinh: function (r, cc) {
      var rc = r.chon(RATCAO.slice(0, 3)), k = r.so(2, 9);
      var u = r.chon(['x^2y', 'xy^2', 'xy']), a = r.khac0(-4, 4), a2 = r.khac0(-4, 4), b = r.khac0(-5, 5);
      while (a + a2 === 0) a2 = r.khac0(-4, 4);
      var x = r.chon([-2, -1, 2, 3]), y = r.chon([-2, -1, 1, 2]);
      var heSoDe = [[k, rc[0]], [a, u], [b, 'y'], [-k, rc[0]], [a2, u]];
      var gon = [[a + a2, u], [b, 'y']];
      var kq = giaTri(gon, x, y);
      var ltg = [];
      var quen = giaTri([[a, u], [b, 'y']], x, y);
      if (quen !== kq) ltg.push({ gt: quen, giaiThich: 'Em mới gộp thiếu: hai hạng tử $' + tx(cc, cc.daThuc([[a, u]])) + '$ và $' + tx(cc, cc.daThuc([[a2, u]])) + '$ đồng dạng, phải cộng hệ số.' });
      return {
        de: 'Thu gọn rồi tính giá trị của đa thức $M = ' + tx(cc, cc.daThuc(heSoDe)) + '$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Thu gọn trước cho đỡ tính: hạng tử bậc cao $' + k + cc.tex(rc[0]) + '$ có triệt tiêu với hạng tử nào không?', 'Sau khi thu gọn, $M$ chỉ còn hai hạng tử. Thay số vào dạng thu gọn.'],
        loiGiai: ['$M = (' + k + cc.tex(rc[0]) + ' - ' + k + cc.tex(rc[0]) + ') + (' + tx(cc, cc.daThuc([[a, u], [a2, u]])) + ')' + (b > 0 ? ' + ' : ' - ') + cc.tex(cc.daThuc([[Math.abs(b), 'y']])) + ' = ' + tx(cc, cc.daThuc(gon)) + '$',
          '$M = ' + thay(gon, x, y) + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế', muc: 3, sinh: function (r, cc) {
      var bc = r.chon([
        { x: 'quyển sách', y: 'cây bút', hop: 'hộp bút', donX: 'quyển', donY: 'cây' },
        { x: 'chai nước', y: 'cái bánh', hop: 'hộp bánh', donX: 'chai', donY: 'cái' },
        { x: 'quả bóng', y: 'quả cầu', hop: 'túi cầu', donX: 'quả', donY: 'quả' }]);
      var ten = r.xaoTron(['Lan', 'Minh', 'Hà', 'Nam', 'Mai']).slice(0, 2);
      var a = r.so(2, 6), b = r.so(2, 4), k = r.chon([5, 6, 10, 12]), c = r.so(1, 5), d = r.so(2, 9);
      var kq = cc.daThuc([[a + c, 'x'], [b * k + d, 'y']]);
      return {
        de: 'Mỗi ' + bc.x + ' giá $x$ nghìn đồng, mỗi ' + bc.y + ' giá $y$ nghìn đồng. ' + ten[0] + ' mua $' + a + '$ ' + bc.x + ' và $' + b + '$ ' + bc.hop + ' (mỗi ' + bc.hop.split(' ')[0] + ' có $' + k + '$ ' + bc.donY + '). ' + ten[1] + ' mua $' + c + '$ ' + bc.x + ' và $' + d + '$ ' + bc.y + '. Viết đa thức thu gọn biểu thị **tổng** số tiền cả hai bạn đã trả.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: [ten[0] + ' mua bao nhiêu ' + bc.y + '? ($' + b + '$ ' + bc.hop + ', mỗi ' + bc.hop.split(' ')[0] + ' $' + k + '$ ' + bc.donY + '.)', 'Viết số tiền của từng bạn, cộng lại rồi thu gọn các hạng tử đồng dạng.'],
        loiGiai: [ten[0] + ' trả: $' + a + 'x + ' + b + ' \\cdot ' + k + 'y = ' + a + 'x + ' + b * k + 'y$; ' + ten[1] + ' trả: $' + cc.tex(cc.daThuc([[c, 'x'], [d, 'y']])) + '$.',
          'Tổng: $(' + cc.tex(cc.daThuc([[a, 'x'], [c, 'x']])) + ') + (' + b * k + 'y + ' + d + 'y) = ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc([[a + c, 'x'], [b + d, 'y']]), giaiThich: 'Mỗi ' + bc.hop.split(' ')[0] + ' có $' + k + '$ ' + bc.donY + ' nên ' + ten[0] + ' mua $' + b * k + '$ ' + bc.y + ', tiền là $' + b * k + 'y$.' }]
      };
    } }
  ]);
})();
