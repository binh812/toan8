// Luyện thêm – Bài 19: Biểu diễn dữ liệu bằng bảng, biểu đồ
(function () {
  'use strict';
  function cs(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); }
  function lech(a, b) { return Math.abs(a - b) > 1e-9; }
  // số nguyên ≥ 10 000 → nhóm ba chữ số: 12000 → 12\,000 (trong $…$)
  function ng(x) {
    if (x < 10000 || x % 1) return String(x);
    var s = String(x), out = '';
    while (s.length > 3) { out = '\\,' + s.slice(-3) + out; s = s.slice(0, -3); }
    return s + out;
  }
  function cong(ds) { return ds.reduce(function (a, b) { return a + b; }, 0); }
  // Chia 100% thành n phần, mỗi phần là bội của buoc và ≥ min.
  function phanTram(r, n, buoc, min) {
    var p, k = 0;
    do {
      p = []; var con = 100;
      for (var i = 0; i < n - 1; i++) { var x = buoc * r.so(Math.ceil(min / buoc), Math.floor((con - min * (n - 1 - i)) / buoc / 1.6)); p.push(x); con -= x; }
      p.push(con); k++;
    } while (k < 50 && (p[n - 1] < min || p.some(function (x) { return x <= 0; })));
    return r.xaoTron(p);
  }

  // Bối cảnh cho biểu đồ cột một chuỗi: [tiêu đề, tên nhãn, các nhãn, đơn vị, khoảng giá trị]
  var COT = [
    { td: 'Số sách quyên góp của các tổ lớp 8A', nhan: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'], dv: 'cuốn', lo: 10, hi: 30 },
    { td: 'Số cây trồng được của các lớp khối 8', nhan: ['8A', '8B', '8C', '8D', '8E'], dv: 'cây', lo: 12, hi: 40 },
    { td: 'Số học sinh đạt điểm giỏi môn Toán', nhan: ['8A', '8B', '8C', '8D'], dv: 'bạn', lo: 5, hi: 20 },
    { td: 'Số vé xem phim bán được trong tuần', nhan: ['Thứ 6', 'Thứ 7', 'Chủ nhật'], dv: 'vé', lo: 60, hi: 200, buoc: 10 },
    { td: 'Số lượt mượn sách thư viện theo tháng', nhan: ['Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], dv: 'lượt', lo: 40, hi: 120, buoc: 5 }
  ];
  var TRANH = [
    { td: 'Số bạn lớp 8A tham gia câu lạc bộ', nhan: ['Tiếng Anh', 'Võ thuật', 'Nghệ thuật', 'Cờ vua'], bt: '😊', dv: 'bạn', moi: [2, 3, 4, 5] },
    { td: 'Số cây các tổ trồng được', nhan: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'], bt: '🌳', dv: 'cây', moi: [2, 4, 5, 10] },
    { td: 'Số ki-lô-gam cam bán được trong ngày', nhan: ['Sáng', 'Trưa', 'Chiều'], bt: '🍊', dv: 'kg', moi: [5, 10, 20] },
    { td: 'Số sách mỗi bạn đọc trong năm', nhan: ['An', 'Bình', 'Chi', 'Dũng'], bt: '📘', dv: 'cuốn', moi: [2, 3, 5] }
  ];
  var QUAT = [
    { td: 'Tỉ lệ các loại quả cửa hàng bán được', nhan: ['Cam', 'Xoài', 'Bưởi', 'Nho'], tong: 'kg quả', vat: 'kilôgam' },
    { td: 'Phương tiện đến trường của học sinh', nhan: ['Đi bộ', 'Xe đạp', 'Xe buýt', 'Bố mẹ đưa đón'], tong: 'học sinh', vat: 'học sinh' },
    { td: 'Cơ cấu chi tiêu một tháng của gia đình', nhan: ['Ăn uống', 'Học tập', 'Điện nước', 'Khác'], tong: 'nghìn đồng', vat: 'nghìn đồng', dsT: [8000, 10000, 12000, 15000, 16000, 20000], giam: true },
    { td: 'Môn thể thao yêu thích của học sinh khối 8', nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], tong: 'học sinh', vat: 'học sinh' }
  ];

  TOAN8.luyen(19, [
    { ten: 'Đọc biểu đồ cột', muc: 1, sinh: function (r) {
      var b = r.chon(COT), st = b.buoc || 1, so = b.nhan.map(function () { return st * r.so(Math.ceil(b.lo / st), Math.floor(b.hi / st)); });
      var kieu = r.chon(['tong', 'hieu', 'hieu']), ltg = [], de, kq, lg, gy;
      if (kieu === 'tong') {
        kq = cong(so);
        var lonNhat = Math.max.apply(null, so);
        ltg.push({ gt: lonNhat, giaiThich: '$' + lonNhat + '$ chỉ là số lớn nhất. Đề hỏi **tất cả**: cộng mọi cột.' });
        de = 'Biểu đồ cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Tính **tổng** số ' + b.dv + ' của tất cả các cột.';
        gy = ['Đọc số ghi trên đầu mỗi cột.', 'Cộng tất cả các số đó.'];
        lg = ['Đọc biểu đồ: ' + b.nhan.map(function (n, i) { return n + ': $' + so[i] + '$'; }).join('; ') + '.', 'Tổng: $' + so.join(' + ') + ' = ' + kq + '$'];
      } else {
        var ij = r.khacNhau(2, 0, so.length - 1), i = ij[0], j = ij[1];
        while (so[i] === so[j]) so[j] += st;
        var lon = so[i] > so[j] ? i : j, be = lon === i ? j : i;
        kq = so[lon] - so[be];
        ltg.push({ gt: so[lon] + so[be], giaiThich: '$' + (so[lon] + so[be]) + '$ là tổng. Đề hỏi **nhiều hơn bao nhiêu**: làm phép trừ.' });
        de = 'Biểu đồ cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. **' + b.nhan[lon] + '** nhiều hơn **' + b.nhan[be] + '** bao nhiêu ' + b.dv + '?';
        gy = ['Đọc số trên hai cột ' + b.nhan[lon] + ' và ' + b.nhan[be] + '.', 'Nhiều hơn bao nhiêu → lấy số lớn trừ số nhỏ.'];
        lg = [b.nhan[lon] + ': $' + so[lon] + '$; ' + b.nhan[be] + ': $' + so[be] + '$.', '$' + so[lon] + ' - ' + so[be] + ' = ' + kq + '$'];
      }
      return {
        de: de,
        hinh: { widget: 'bieuDo', config: { loai: 'cot', tieuDe: b.td, nhan: b.nhan.slice(), chuoi: [{ ten: 'Số ' + b.dv, so: so }], donVi: b.dv } },
        dapAn: { kieu: 'so', gt: kq }, goiY: gy, loiGiai: lg, loiThuongGap: ltg
      };
    } },

    { ten: 'Đọc biểu đồ tranh', muc: 1, sinh: function (r) {
      var b = r.chon(TRANH), moi = r.chon(b.moi);
      var nua = moi % 2 === 0 && r.dau() > 0; // có thể có nửa biểu tượng
      var so = b.nhan.map(function () { return moi * r.so(1, 6) + (nua && r.dau() > 0 ? moi / 2 : 0); });
      var i = r.so(0, so.length - 1), bt = so[i] / moi, ltg = [];
      if (lech(bt, so[i])) ltg.push({ gt: bt, giaiThich: '$' + cs(bt) + '$ là số **biểu tượng**. Mỗi biểu tượng ứng với $' + moi + '$ ' + b.dv + ' nên phải nhân với $' + moi + '$.' });
      return {
        de: 'Biểu đồ tranh cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Hàng **' + b.nhan[i] + '** ứng với bao nhiêu ' + b.dv + '?',
        hinh: { widget: 'bieuDo', config: { loai: 'tranh', tieuDe: b.td, bieuTuong: b.bt, moiBieuTuong: moi, donVi: b.dv, nhan: b.nhan.slice(), chuoi: [{ ten: 'Số ' + b.dv, so: so }] } },
        dapAn: { kieu: 'so', gt: so[i] },
        goiY: ['Xem chú thích dưới biểu đồ: mỗi biểu tượng ứng với mấy ' + b.dv + '?', 'Đếm số biểu tượng ở hàng "' + b.nhan[i] + '" (nửa biểu tượng tính là $0{,}5$) rồi nhân.'],
        loiGiai: ['Mỗi biểu tượng ứng với $' + moi + '$ ' + b.dv + '; hàng "' + b.nhan[i] + '" có $' + cs(bt) + '$ biểu tượng.', '$' + cs(bt) + ' \\cdot ' + moi + ' = ' + so[i] + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Từ biểu đồ quạt ra số lượng', muc: 2, sinh: function (r) {
      var b = r.chon(QUAT), p = phanTram(r, b.nhan.length, 5, 10);
      if (b.giam) p.sort(function (x, y) { return y - x; }); // ăn uống là khoản lớn nhất
      var i = r.so(0, p.length - 1), T, k = 0;
      do { T = r.chon(b.dsT || [200, 240, 300, 360, 400, 480, 500, 600, 800, 1000, 1200]); k++; } while (k < 30 && lech(T * p[i] / 100, Math.round(T * p[i] / 100)));
      if (lech(T * p[i] / 100, Math.round(T * p[i] / 100))) T = 1000;
      var kq = T * p[i] / 100, ltg = [];
      if (lech(p[i], kq)) ltg.push({ gt: p[i], giaiThich: '$' + p[i] + '$ là **tỉ lệ phần trăm**. Muốn ra số lượng phải nhân với tổng: $' + ng(T) + ' \\cdot ' + p[i] + '\\%$.' });
      var chia = T * 100 / p[i];
      if (lech(chia, kq) && Math.abs(chia * 1e6 - Math.round(chia * 1e6)) < 1e-6) ltg.push({ gt: Math.round(chia * 1e6) / 1e6, giaiThich: 'Em chia cho $' + p[i] + '\\%$. Biết tổng và tỉ lệ thì **nhân**: số lượng = tổng × tỉ lệ.' });
      return {
        de: 'Biểu đồ hình quạt tròn: ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Tổng cộng là $' + ng(T) + '$ ' + b.tong + '. Phần **' + b.nhan[i] + '** là bao nhiêu ' + b.vat + '?',
        hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: b.td, nhan: b.nhan.slice(), chuoi: [{ so: p }] } },
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Đọc tỉ lệ của ' + b.nhan[i] + ' trên biểu đồ.', 'Số lượng = tổng × tỉ lệ $= ' + ng(T) + ' \\cdot ' + p[i] + '\\%$.'],
        loiGiai: [b.nhan[i] + ' chiếm $' + p[i] + '\\%$.', '$' + ng(T) + ' \\cdot ' + p[i] + '\\% = ' + ng(T) + ' \\cdot \\frac{' + p[i] + '}{100} = ' + ng(kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Từ số lượng ra tỉ lệ phần trăm', muc: 2, sinh: function (r) {
      var N = r.chon([20, 25, 40, 50]), n = 4, so, k = 0;
      do {
        so = [r.so(2, Math.floor(N / 2)), r.so(2, Math.floor(N / 3)), r.so(1, Math.floor(N / 4))];
        so.push(N - cong(so)); k++;
      } while (k < 80 && (so[3] < 1 || so[3] > N / 2 || so.some(function (x) { return Math.abs(x * 100 / N * 10 - Math.round(x * 100 / N * 10)) > 1e-9; })));
      if (so[3] < 1) so = N === 25 ? [10, 7, 5, 3] : [N / 2, N / 4, N / 5, N - N / 2 - N / 4 - N / 5];
      var b = r.chon([{ ten: 'Môn học yêu thích nhất', nhan: ['Toán', 'Ngữ văn', 'Tiếng Anh', 'KHTN'] },
        { ten: 'Đánh giá chất lượng bữa ăn bán trú', nhan: ['Rất ngon', 'Ngon', 'Bình thường', 'Chưa ngon'] },
        { ten: 'Hoạt động cuối tuần yêu thích', nhan: ['Thể thao', 'Đọc sách', 'Xem phim', 'Đi chơi'] }]);
      var i = r.so(0, n - 1), kq = so[i] * 100 / N, ltg = [];
      if (lech(so[i], kq)) ltg.push({ gt: so[i], giaiThich: '$' + so[i] + '$ là **số bạn**, chưa phải tỉ lệ. Chia cho tổng $' + N + '$ rồi nhân $100\\%$.' });
      var sai = so[i] * 100 / (N - so[i]);
      if (lech(sai, kq) && Math.abs(sai * 100 - Math.round(sai * 100)) < 1e-9) ltg.push({ gt: sai, giaiThich: 'Tỉ lệ một phần phải chia cho **tổng** ($' + N + '$), không chia cho phần còn lại.' });
      return {
        de: 'Biểu đồ cột cho biết kết quả hỏi $' + N + '$ học sinh về ' + b.ten.charAt(0).toLowerCase() + b.ten.slice(1) + '. Nếu vẽ biểu đồ hình quạt tròn thì phần **' + b.nhan[i] + '** chiếm bao nhiêu phần trăm?',
        hinh: { widget: 'bieuDo', config: { loai: 'cot', tieuDe: b.ten, nhan: b.nhan.slice(), chuoi: [{ ten: 'Số bạn', so: so }], donVi: 'bạn' } },
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tổng số học sinh là $' + N + '$ (kiểm tra: $' + so.join(' + ') + ' = ' + N + '$).', 'Tỉ lệ $= \\frac{' + so[i] + '}{' + N + '} \\cdot 100\\%$.'],
        loiGiai: ['Tổng: $' + so.join(' + ') + ' = ' + N + '$ học sinh.', 'Tỉ lệ ' + b.nhan[i] + ': $\\frac{' + so[i] + '}{' + N + '} \\cdot 100\\% = ' + cs(kq) + '\\%$.', 'Đáp số: $' + cs(kq) + '$.'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'So sánh trên biểu đồ cột kép', muc: 2, sinh: function (r) {
      var b = r.chon([
        { td: 'Học sinh tham gia câu lạc bộ', tenNhan: 'Lớp', o: 'lớp ', nhan: ['8A', '8B', '8C', '8D'], chuoi: ['Thể thao', 'Nghệ thuật'], dv: 'bạn', lo: 4, hi: 16 },
        { td: 'Cỡ áo của học sinh lớp 8A', tenNhan: 'Cỡ áo', o: 'cỡ ', nhan: ['S', 'M', 'L', 'XL'], chuoi: ['Nam', 'Nữ'], dv: 'bạn', lo: 2, hi: 12 },
        { td: 'Điểm thi đua của các tổ', tenNhan: 'Tổ', o: '', nhan: ['Tổ 1', 'Tổ 2', 'Tổ 3'], chuoi: ['Học kì I', 'Học kì II'], dv: 'điểm', lo: 60, hi: 95 }]);
      var s1 = b.nhan.map(function () { return r.so(b.lo, b.hi); }), s2 = b.nhan.map(function () { return r.so(b.lo, b.hi); });
      var i = r.so(0, b.nhan.length - 1);
      if (s1[i] === s2[i]) s2[i] = s1[i] + r.so(2, 4);
      var lon = s1[i] > s2[i] ? 0 : 1, a = [s1[i], s2[i]], kq = Math.abs(s1[i] - s2[i]), ltg = [];
      ltg.push({ gt: s1[i] + s2[i], giaiThich: '$' + (s1[i] + s2[i]) + '$ là tổng. Đề hỏi **nhiều hơn bao nhiêu**: phép trừ.' });
      return {
        de: 'Biểu đồ cột kép cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Ở ' + b.o + '**' + b.nhan[i] + '**, ' + b.chuoi[lon] + ' nhiều hơn ' + b.chuoi[1 - lon] + ' bao nhiêu ' + b.dv + '?',
        hinh: { widget: 'bieuDo', config: { loai: 'cotKep', tieuDe: b.td, tenNhan: b.tenNhan, nhan: b.nhan.slice(), chuoi: [{ ten: b.chuoi[0], so: s1 }, { ten: b.chuoi[1], so: s2 }], donVi: b.dv } },
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tìm hai cột của ' + b.nhan[i] + ': cột xanh dương là ' + b.chuoi[0] + ', cột cam là ' + b.chuoi[1] + '.', 'Lấy số lớn trừ số nhỏ.'],
        loiGiai: [b.nhan[i] + ': ' + b.chuoi[0] + ' $' + s1[i] + '$, ' + b.chuoi[1] + ' $' + s2[i] + '$.', '$' + a[lon] + ' - ' + a[1 - lon] + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Biểu đồ đoạn thẳng, số biểu tượng', muc: 3, sinh: function (r) {
      if (r.dau() > 0) {
        // gấp bao nhiêu lần trên biểu đồ đoạn thẳng
        var b = r.chon([
          { td: 'Số khách tham quan bảo tàng', nhan: ['2019', '2020', '2021', '2022', '2023'], dv: 'nghìn lượt' },
          { td: 'Sản lượng lúa của một hợp tác xã', nhan: ['2019', '2020', '2021', '2022', '2023'], dv: 'tấn' },
          { td: 'Số học sinh đăng kí học bơi', nhan: ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'], dv: 'bạn' }]);
        var goc = r.so(4, 12), lan = r.chon([1.5, 2, 2.5, 3, 4]), n = b.nhan.length, so = [];
        for (var t = 0; t < n; t++) so.push(r.so(goc, Math.round(goc * lan)));
        var i = r.so(0, 1), j = r.so(n - 2, n - 1);
        so[i] = goc * 2; so[j] = goc * 2 * lan;
        var kq = lan, ltg = [];
        ltg.push({ gt: so[j] - so[i], giaiThich: '$' + (so[j] - so[i]) + '$ là **nhiều hơn bao nhiêu**. Đề hỏi **gấp bao nhiêu lần**: phép chia.' });
        return {
          de: 'Biểu đồ đoạn thẳng cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Số liệu ở **' + b.nhan[j] + '** gấp bao nhiêu lần ở **' + b.nhan[i] + '**?',
          hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: b.td, nhan: b.nhan.slice(), chuoi: [{ ten: b.td, so: so }], donVi: b.dv } },
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Đọc số liệu tại ' + b.nhan[j] + ' và ' + b.nhan[i] + '.', 'Gấp bao nhiêu lần → lấy số lớn chia số nhỏ.'],
          loiGiai: [b.nhan[j] + ': $' + so[j] + '$; ' + b.nhan[i] + ': $' + so[i] + '$.', '$' + so[j] + ' : ' + so[i] + ' = ' + cs(kq) + '$'],
          loiThuongGap: ltg
        };
      }
      // số biểu tượng phải vẽ nếu dùng biểu đồ tranh (phần lẻ vẫn vẽ một biểu tượng bị cắt)
      var moi = r.chon([5, 10, 20]), truong = r.xaoTron(['Đoàn Kết', 'Bình Minh', 'Hoà Bình', 'Thắng Lợi', 'Quang Trung']).slice(0, 3);
      var hs = truong.map(function () { var x; do { x = r.so(2 * moi, 30 * moi); } while (x % moi === 0); return x; });
      var bt = hs.map(function (x) { return Math.ceil(x / moi); }), kq2 = cong(bt), le = cong(hs) / moi;
      return {
        de: 'Số học sinh ba trường đăng kí giải chạy: ' + truong.map(function (t, i) { return t + ' $' + hs[i] + '$'; }).join(', ') + '. Nếu vẽ biểu đồ tranh, mỗi biểu tượng ứng với $' + moi + '$ học sinh (phần lẻ vẫn vẽ thêm một biểu tượng bị cắt) thì phải vẽ tất cả bao nhiêu biểu tượng?',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: [truong[0] + ': $' + hs[0] + ' : ' + moi + ' = ' + cs(hs[0] / moi) + '$ → cần $' + bt[0] + '$ biểu tượng.', 'Làm tương tự với hai trường còn lại rồi cộng lại.'],
        loiGiai: truong.map(function (t, i) { return t + ': $' + hs[i] + ' : ' + moi + ' = ' + cs(hs[i] / moi) + '$ → $' + bt[i] + '$ biểu tượng.'; })
          .concat(['Tổng: $' + bt.join(' + ') + ' = ' + kq2 + '$. Quá nhiều và có biểu tượng bị cắt → nên dùng **biểu đồ cột**.']),
        loiThuongGap: lech(le, kq2) ? [{ gt: Math.round(le * 1e6) / 1e6, giaiThich: '$' + cong(hs) + ' : ' + moi + ' = ' + cs(le) + '$: mỗi trường có một biểu tượng bị cắt nhưng vẫn phải **vẽ** nó, nên làm tròn lên từng trường.' }] : []
      };
    } }
  ], { deCo: [
    { id: '19.L1', muc: 1, de: 'Để biểu diễn **nhiệt độ lúc 12 giờ trưa của một thành phố trong 7 ngày liên tiếp**, nên dùng biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Biểu đồ tranh', 'Biểu đồ hình quạt tròn', 'Biểu đồ đoạn thẳng', 'Biểu đồ cột kép'] },
      goiY: ['Dữ liệu thay đổi theo cái gì?', 'Thay đổi theo thời gian → biểu đồ …?'],
      loiGiai: ['Nhiệt độ thay đổi **theo thời gian** (theo ngày) → **biểu đồ đoạn thẳng**.'] },
    { id: '19.L2', muc: 1, de: 'Để biểu diễn **tỉ lệ** số học sinh giỏi, khá, đạt, chưa đạt **trong tổng số** học sinh của trường, nên dùng biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['Biểu đồ tranh', 'Biểu đồ đoạn thẳng', 'Biểu đồ cột kép', 'Biểu đồ hình quạt tròn'] },
      goiY: ['Tỉ lệ các phần trong tổng thể ($100\\%$).', 'Biểu đồ nào chia một hình tròn thành các phần?'],
      loiGiai: ['Tỉ lệ các phần trong tổng thể → **biểu đồ hình quạt tròn**.'] },
    { id: '19.L3', muc: 1, de: 'Để **so sánh** số học sinh nam và số học sinh nữ của từng lớp 8A, 8B, 8C, 8D, nên dùng biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['Biểu đồ cột kép', 'Biểu đồ hình quạt tròn', 'Biểu đồ đoạn thẳng', 'Biểu đồ tranh'] },
      goiY: ['Có mấy tập dữ liệu (nam, nữ)?', 'So sánh hai tập dữ liệu → biểu đồ …?'],
      loiGiai: ['Có hai tập dữ liệu (nam và nữ) cần đặt cạnh nhau ở mỗi lớp → **biểu đồ cột kép**.'] },
    { id: '19.L4', muc: 1, de: 'Khẳng định "Biểu đồ hình quạt tròn dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Biểu đồ hình quạt tròn biểu diễn cái gì?', 'Thay đổi theo thời gian thì dùng biểu đồ đoạn thẳng.'],
      loiGiai: ['Biểu đồ hình quạt tròn biểu diễn **tỉ lệ các phần trong tổng thể**; sự thay đổi theo thời gian dùng **biểu đồ đoạn thẳng**.', 'Khẳng định **sai**.'] },
    { id: '19.L5', muc: 2, de: 'Số học sinh của ba trường: $1\\,245$; $987$; $1\\,530$. Vì sao **không nên** dùng biểu đồ tranh để biểu diễn bảng này?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Vì dữ liệu không phải là số.', 'Vì phải vẽ rất nhiều biểu tượng và nhiều biểu tượng bị cắt lẻ.', 'Vì dữ liệu thay đổi theo thời gian.', 'Vì tổng không bằng $100\\%$.'] },
      goiY: ['Thử chọn mỗi biểu tượng ứng với $100$ học sinh: cần bao nhiêu biểu tượng?', '$12{,}45$; $9{,}87$; $15{,}3$ biểu tượng…'],
      loiGiai: ['Số liệu lớn và lẻ nên phải vẽ rất nhiều biểu tượng, nhiều biểu tượng bị cắt → khó vẽ, khó đọc. Nên dùng **biểu đồ cột**.'] },
    { id: '19.L6', muc: 2, de: 'Nhiệt độ trung bình tháng 7 ở bốn thành phố: Hà Nội $30{,}5$ °C, Huế $30{,}1$ °C, Đà Lạt $19{,}8$ °C, Cần Thơ $27{,}6$ °C. Nên chọn biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Biểu đồ đoạn thẳng', 'Biểu đồ cột', 'Biểu đồ hình quạt tròn', 'Biểu đồ tranh'] },
      goiY: ['Dữ liệu thay đổi theo thành phố, không theo thời gian.', 'Cộng nhiệt độ bốn thành phố có ra "tổng thể" nào không?'],
      loiGiai: ['Không theo thời gian → không dùng đoạn thẳng; không có tổng thể → không dùng quạt tròn; số thập phân → không dùng tranh.', 'Nên dùng **biểu đồ cột** để so sánh.'] },
    { id: '19.L7', muc: 2, de: 'Hỏi $40$ bạn "Bạn thích những môn thể thao nào? (được chọn nhiều môn)". Có $24$ bạn chọn Bóng đá, $18$ bạn chọn Cầu lông, $10$ bạn chọn Bơi. Khẳng định "Có thể biểu diễn các tỉ lệ này bằng biểu đồ hình quạt tròn" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Tính tổng các tỉ lệ: $\\frac{24}{40}$, $\\frac{18}{40}$, $\\frac{10}{40}$.', 'Tổng có bằng $100\\%$ không?'],
      loiGiai: ['Các tỉ lệ $60\\%$, $45\\%$, $25\\%$ cộng lại được $130\\% > 100\\%$ (mỗi bạn chọn nhiều môn).', 'Không vẽ được biểu đồ hình quạt tròn. Khẳng định **sai**; nên dùng biểu đồ cột.'] },
    { id: '19.L8', muc: 2, de: 'Một biểu đồ hình quạt tròn có bốn phần: $35\\%$, $25\\%$, $30\\%$ và phần còn lại. Phần còn lại chiếm bao nhiêu phần trăm?',
      dapAn: { kieu: 'so', gt: 10 },
      goiY: ['Cả hình tròn là $100\\%$.', 'Lấy $100\\%$ trừ tổng ba phần đã biết.'],
      loiGiai: ['Tổng ba phần: $35 + 25 + 30 = 90$ (%).', 'Phần còn lại: $100 - 90 = 10$'],
      loiThuongGap: [{ gt: 90, giaiThich: '$90\\%$ là tổng ba phần đã biết. Phần còn lại là $100\\% - 90\\%$.' }] },
    { id: '19.L9', muc: 2, de: 'Lớp 8A có $45$ học sinh: $15$ bạn cỡ áo L, $20$ bạn cỡ M, $10$ bạn cỡ S. Muốn biết **mỗi cỡ chiếm bao nhiêu phần của cả lớp**, nên dùng biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Biểu đồ đoạn thẳng', 'Biểu đồ cột kép', 'Biểu đồ hình quạt tròn', 'Biểu đồ tranh'] },
      goiY: ['"Mỗi cỡ chiếm bao nhiêu phần của cả lớp" là hỏi về tỉ lệ.', 'Tỉ lệ các phần trong tổng thể → …'],
      loiGiai: ['Biểu diễn tỉ lệ các phần trong tổng thể (cả lớp) → **biểu đồ hình quạt tròn**.'] },
    { id: '19.L10', muc: 3, de: 'Biểu đồ hình quạt tròn cho biết $30\\%$ trong số học sinh khối 8 đi học bằng xe đạp, tức là $96$ học sinh. Khối 8 có bao nhiêu học sinh?',
      dapAn: { kieu: 'so', gt: 320 },
      goiY: ['Số lượng = tổng × tỉ lệ, nên tổng = số lượng : tỉ lệ.', 'Tổng $= 96 : 30\\% = 96 : \\frac{30}{100}$.'],
      loiGiai: ['$96$ học sinh ứng với $30\\%$ tổng số.', 'Tổng số học sinh: $96 : \\frac{30}{100} = 96 \\cdot \\frac{100}{30} = 320$'],
      loiThuongGap: [{ gt: 28.8, giaiThich: 'Em tính $96 \\cdot 30\\%$. Ở đây $96$ **là** $30\\%$ của tổng, nên phải chia: $96 : 30\\%$.' }] },
    { id: '19.L11', muc: 3, de: 'Doanh thu (tỉ đồng) của **một** cửa hàng trong 12 tháng của năm. Muốn thấy rõ **xu thế tăng, giảm** qua các tháng thì nên dùng biểu đồ nào?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['Biểu đồ đoạn thẳng', 'Biểu đồ hình quạt tròn', 'Biểu đồ tranh', 'Biểu đồ cột kép'] },
      goiY: ['Dữ liệu theo thời gian, có nhiều mốc (12 tháng).', 'Đường nối các điểm cho thấy đi lên hay đi xuống.'],
      loiGiai: ['Một đại lượng thay đổi theo thời gian, nhiều mốc → **biểu đồ đoạn thẳng**: đoạn đi lên là tăng, đi xuống là giảm.'] }
  ] });
})();
