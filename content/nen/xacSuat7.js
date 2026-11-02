// Bài nền (lớp 7): Biến cố, xác suất của biến cố đơn giản – cần cho Chương VIII.
(function () {
  'use strict';
  var LOAI = ['Biến cố chắc chắn', 'Biến cố không thể', 'Biến cố ngẫu nhiên'];
  function laNguyenTo(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }

  TOAN8.nen({
    id: 'xacSuat7', ten: 'Biến cố và xác suất của biến cố', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Biến cố',
        noiDung: '• **Biến cố chắc chắn**: luôn xảy ra. Ví dụ: gieo xúc xắc, "số chấm nhỏ hơn $7$".\n\n• **Biến cố không thể**: không bao giờ xảy ra. Ví dụ: "số chấm bằng $7$".\n\n• **Biến cố ngẫu nhiên**: có thể xảy ra, cũng có thể không xảy ra. Ví dụ: "số chấm là số chẵn".' },
      { loai: 'dinhNghia', tieuDe: 'Xác suất của biến cố',
        noiDung: 'Xác suất là con số đo khả năng xảy ra của biến cố, nằm trong khoảng từ $0$ đến $1$. Biến cố chắc chắn có xác suất $1$; biến cố không thể có xác suất $0$.' },
      { loai: 'dinhLi', tieuDe: 'Cách tính khi các kết quả đồng khả năng',
        noiDung: 'Nếu các kết quả có thể **đồng khả năng** (xúc xắc cân đối, các quả bóng giống hệt nhau chỉ khác màu…) thì\n\n$$P = \\frac{\\text{số kết quả thuận lợi cho biến cố}}{\\text{tổng số kết quả có thể}}.$$\n\nVí dụ: gieo xúc xắc, $P(\\text{số chấm chẵn}) = \\frac{3}{6} = \\frac{1}{2}$ (thuận lợi: $2, 4, 6$).' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** chia số kết quả thuận lợi cho số kết quả **không** thuận lợi. Ví dụ: hộp có $3$ bi đỏ, $5$ bi xanh thì $P(\\text{đỏ}) = \\frac{3}{8}$, không phải $\\frac{3}{5}$.' }
    ],
    viDu: [
      { de: 'Một hộp có $3$ quả bóng đỏ và $2$ quả bóng xanh có cùng kích thước. Lấy ngẫu nhiên một quả. Tính xác suất lấy được bóng đỏ.', buoc: [
        { lam: 'Có $3 + 2 = 5$ kết quả có thể, đồng khả năng.', vi: 'Mỗi quả bóng là một kết quả; các quả giống nhau nên khả năng như nhau.' },
        { lam: 'Có $3$ kết quả thuận lợi nên $P = \\frac{3}{5}$', vi: 'Xác suất bằng số kết quả thuận lợi chia cho tổng số kết quả.' }] }
    ],
    luyen: [
      { ten: 'Nhận biết loại biến cố', muc: 1, sinh: function (r) {
        var cau = r.chon([
          function () { var k = r.so(1, 9); return ['Gieo một con xúc xắc. Biến cố "Số chấm xuất hiện nhỏ hơn $' + k + '$".', k >= 7 ? 0 : k <= 1 ? 1 : 2, k >= 7 ? 'Số chấm luôn từ $1$ đến $6$, đều nhỏ hơn $' + k + '$.' : k <= 1 ? 'Không có mặt nào có số chấm nhỏ hơn $1$.' : 'Có mặt nhỏ hơn $' + k + '$ (như mặt $1$) và có mặt không nhỏ hơn (như mặt $6$).']; },
          function () { var k = r.so(0, 7); return ['Gieo một con xúc xắc. Biến cố "Số chấm xuất hiện lớn hơn $' + k + '$".', k === 0 ? 0 : k >= 6 ? 1 : 2, k === 0 ? 'Số chấm nhỏ nhất là $1$, luôn lớn hơn $0$.' : k >= 6 ? 'Số chấm lớn nhất là $6$, không thể lớn hơn $' + k + '$.' : 'Mặt $6$ thì lớn hơn $' + k + '$, mặt $1$ thì không.']; },
          function () { return ['Gieo một con xúc xắc. Biến cố "Số chấm xuất hiện là ước của $60$".', 0, 'Các số $1, 2, 3, 4, 5, 6$ đều là ước của $60$.']; },
          function () { return ['Gieo một con xúc xắc. Biến cố "Số chấm xuất hiện là số nguyên tố".', 2, 'Mặt $2$ là số nguyên tố, mặt $4$ thì không.']; },
          function () { var n = r.so(3, 9), mau = r.chon(['đỏ', 'xanh', 'vàng']), mau2 = r.chon(['trắng', 'tím', 'đen']); var hoi = r.dau() > 0; return ['Một hộp có $' + n + '$ viên bi đều màu ' + mau + '. Lấy ngẫu nhiên một viên. Biến cố "Lấy được viên bi màu ' + (hoi ? mau : mau2) + '".', hoi ? 0 : 1, hoi ? 'Mọi viên bi đều màu ' + mau + '.' : 'Trong hộp không có viên bi màu ' + mau2 + ' nào.']; },
          function () { var a = r.so(2, 6), b = r.so(2, 6); return ['Một hộp có $' + a + '$ bi đỏ và $' + b + '$ bi xanh. Lấy ngẫu nhiên một viên. Biến cố "Lấy được viên bi đỏ".', 2, 'Có thể lấy được bi đỏ, cũng có thể lấy được bi xanh.']; }
        ])();
        return {
          de: cau[0] + ' Đây là loại biến cố nào?',
          dapAn: { kieu: 'chon', gt: cau[1], luaChon: LOAI },
          goiY: ['Liệt kê các kết quả có thể xảy ra.', 'Biến cố xảy ra với **mọi** kết quả → chắc chắn; **không** kết quả nào → không thể; một số kết quả → ngẫu nhiên.'],
          loiGiai: [cau[2] + ' Vậy đây là **' + LOAI[cau[1]].toLowerCase() + '**.']
        };
      } },
      { ten: 'Lấy bóng từ hộp', muc: 2, sinh: function (r, cc) {
        var mau = r.xaoTron(['đỏ', 'xanh', 'vàng']), so = [r.so(1, 9), r.so(1, 9), r.so(0, 6)];
        var co = [0, 1, 2].filter(function (k) { return so[k] > 0; }), tong = so[0] + so[1] + so[2];
        var i = r.chon([0, 1]), kq = cc.phanSo(so[i], tong), ltg = [];
        var khac = tong - so[i], sai = cc.phanSo(so[i], khac);
        if (sai.tu * kq.mau !== kq.tu * sai.mau) ltg.push({ gt: sai.ascii, giaiThich: 'Mẫu số phải là **tổng số** quả bóng ($' + tong + '$), không phải số bóng không phải màu ' + mau[i] + '.' });
        var mo = co.map(function (k) { return '$' + so[k] + '$ quả bóng ' + mau[k]; });
        return {
          de: 'Một hộp có ' + mo.slice(0, -1).join(', ') + ' và ' + mo[mo.length - 1] + ', các quả bóng có cùng kích thước và khối lượng. Lấy ngẫu nhiên một quả bóng. Tính xác suất lấy được quả bóng màu **' + mau[i] + '**.',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Mỗi quả bóng là một kết quả có thể (đồng khả năng). Có bao nhiêu kết quả?', 'Xác suất $= \\frac{\\text{số bóng ' + mau[i] + '}}{\\text{tổng số bóng}}$.'],
          loiGiai: ['Tổng số quả bóng: $' + co.map(function (k) { return so[k]; }).join(' + ') + ' = ' + tong + '$ (kết quả có thể).', 'Số kết quả thuận lợi: $' + so[i] + '$.', '$P = \\frac{' + so[i] + '}{' + tong + '}' + (kq.mau === tong ? '' : ' = ' + kq.tex) + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Gieo xúc xắc', muc: 2, sinh: function (r, cc) {
        var bc = r.chon([
          function () { return ['là số chẵn', [2, 4, 6]]; },
          function () { return ['là số lẻ', [1, 3, 5]]; },
          function () { return ['chia hết cho $3$', [3, 6]]; },
          function () { return ['là số nguyên tố', [2, 3, 5]]; },
          function () { var k = r.so(1, 5); var t = []; for (var v = k + 1; v <= 6; v++) t.push(v); return ['lớn hơn $' + k + '$', t]; },
          function () { var k = r.so(2, 6); var t = []; for (var v = 1; v < k; v++) t.push(v); return ['nhỏ hơn $' + k + '$', t]; },
          function () { var n = r.chon([4, 6, 8, 9, 10, 15]); var t = []; for (var v = 1; v <= 6; v++) if (n % v === 0) t.push(v); return ['là ước của $' + n + '$', t]; }
        ])();
        var m = bc[1].length, kq = cc.phanSo(m, 6);
        var ltg = m !== 6 - m && 6 - m > 0 ? [{ gt: cc.phanSo(m, 6 - m).ascii, giaiThich: 'Mẫu số là **tổng số kết quả có thể** ($6$ mặt), không phải số kết quả không thuận lợi.' }] : [];
        return {
          de: 'Gieo một con xúc xắc cân đối. Tính xác suất của biến cố "Số chấm xuất hiện ' + bc[0] + '".',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Có $6$ kết quả có thể, đồng khả năng: $1, 2, 3, 4, 5, 6$.', 'Liệt kê các mặt có số chấm ' + bc[0] + '.'],
          loiGiai: ['Các kết quả thuận lợi: $' + bc[1].join(', ') + '$ (có $' + m + '$ kết quả).', '$P = \\frac{' + m + '}{6}' + (kq.mau === 6 ? '' : ' = ' + kq.tex) + '$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Rút thẻ đánh số', muc: 3, sinh: function (r, cc) {
        var n = r.chon([10, 12, 15, 20, 24, 25, 30]);
        var bc = r.chon([
          function () { var k = r.so(2, 6); return ['là số chia hết cho $' + k + '$', function (v) { return v % k === 0; }]; },
          function () { return ['là số nguyên tố', laNguyenTo]; },
          function () { return ['là số chính phương', function (v) { return Math.round(Math.sqrt(v)) * Math.round(Math.sqrt(v)) === v; }]; },
          function () { return ['là số có hai chữ số', function (v) { return v >= 10; }]; },
          function () { var k = r.chon([3, 5, 7, 9]); return ['có chữ số tận cùng là $' + k + '$', function (v) { return v % 10 === k; }]; }
        ])();
        var tl = []; for (var v = 1; v <= n; v++) if (bc[1](v)) tl.push(v);
        var m = tl.length, kq = cc.phanSo(m, n), ltg = [];
        if (n - m > 0 && m !== n - m) ltg.push({ gt: cc.phanSo(m, n - m).ascii, giaiThich: 'Mẫu số là **tổng số thẻ** ($' + n + '$), không phải số thẻ không thuận lợi.' });
        return {
          de: 'Một hộp có $' + n + '$ tấm thẻ cùng loại, được đánh số $1, 2, 3, \\ldots, ' + n + '$. Rút ngẫu nhiên một tấm thẻ. Tính xác suất của biến cố "Số ghi trên thẻ ' + bc[0] + '".',
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Có $' + n + '$ kết quả có thể, đồng khả năng.', 'Liệt kê **cẩn thận** các số từ $1$ đến $' + n + '$ thỏa mãn rồi đếm.'],
          loiGiai: ['Các kết quả thuận lợi: $' + tl.join(', ') + '$ (có $' + m + '$ kết quả).', '$P = \\frac{' + m + '}{' + n + '}' + (kq.mau === n ? '' : ' = ' + kq.tex) + '$'],
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
