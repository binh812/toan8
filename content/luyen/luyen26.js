// Luyện thêm – Bài 26: Giải bài toán bằng cách lập phương trình
(function () {
  'use strict';
  function heSo(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  // chỉ giữ lỗi thường gặp có giá trị hữu hạn, khác đáp án và khác nhau
  function loc(ds, ans) {
    var out = [];
    ds.forEach(function (l) {
      if (!isFinite(l.gt) || Math.abs(l.gt - ans) < 1e-9) return;
      if (out.some(function (o) { return Math.abs(o.gt - l.gt) < 1e-9; })) return;
      out.push(l);
    });
    return out;
  }
  // Hình lời giải: sơ đồ đoạn (mỗi vế là một đoạn) theo chính số của đề. m(hệ số x, số, nhãn) là một mảnh.
  function m(x, so, nhan) { return { x: x, so: so, nhan: nhan }; }
  function lap(n, manh) { var ds = []; for (var i = 0; i < n; i++) ds.push(manh); return ds; }
  function hg(tenTren, tren, tenDuoi, duoi, them) {
    var tuyChon = Object.assign({ tenTren: tenTren, tren: tren, tenDuoi: tenDuoi, duoi: duoi, hienX: true }, them && them.tuyChon);
    return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1, ten: 'soDoDoan' }, them, { tuyChon: tuyChon }) };
  }
  var X_BAT_KI = 'Hình vẽ với một giá trị x bất kì.';
  var TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh', 'Nga', 'Phúc'];

  TOAN8.luyen(26, [
    { ten: 'Biểu diễn đại lượng theo ẩn', muc: 1, sinh: function (r, cc) {
      var loai = r.chon(['duong', 'mua', 'tuoi', 'chuVi']);
      if (loai === 'duong') {
        var t = r.so(2, 4), d = r.so(2, 9);
        return {
          de: 'Một người đi xe đạp $' + t + '$ giờ với vận tốc $x$ (km/h), rồi đi bộ thêm $' + d + '$ km. Viết biểu thức biểu thị tổng quãng đường người đó đã đi (km).',
          dapAn: { kieu: 'bieuThuc', gt: t + 'x+' + d },
          hinhGiai: hg('Xe đạp ' + t + ' giờ, rồi đi bộ', lap(t, m(1, 0, 'x')).concat([m(0, d, String(d))]), null, null, { tuyChon: { x: 10, hienX: false }, ghiChu: 'Mỗi đoạn x là quãng đường đi trong 1 giờ. ' + X_BAT_KI }),
          goiY: ['Quãng đường = vận tốc $\\times$ thời gian.', 'Đoạn đi xe đạp dài $' + t + '\\cdot x$ km; cộng thêm đoạn đi bộ.'],
          loiGiai: ['Đi xe đạp: $' + t + 'x$ (km); đi bộ: $' + d + '$ (km).', 'Tổng quãng đường: $' + t + 'x + ' + d + '$'],
          loiThuongGap: [{ gt: 'x+' + (t + d), giaiThich: 'Đi $' + t + '$ giờ với vận tốc $x$ thì được $' + t + 'x$ km (nhân), không phải $x + ' + t + '$.' }]
        };
      }
      if (loai === 'mua') {
        var n = r.so(3, 9), th = r.so(2, 9), vat = r.chon(['quyển vở', 'cái bút', 'hộp bánh', 'chai nước']);
        return {
          de: 'Giá mỗi ' + vat + ' là $x$ nghìn đồng. Hôm nay giá mỗi ' + vat + ' tăng thêm $' + th + '$ nghìn đồng. Viết biểu thức biểu thị số tiền (nghìn đồng) phải trả khi mua $' + n + '$ ' + vat + ' hôm nay.',
          dapAn: { kieu: 'bieuThuc', gt: n + '(x+' + th + ')' },
          hinhGiai: hg('Tiền mua ' + n + ' ' + vat, lap(n, m(1, th, 'x + ' + th)), null, null, { tuyChon: { x: 10, hienX: false }, ghiChu: 'Mỗi đoạn là giá mới của một ' + vat + '. ' + X_BAT_KI }),
          goiY: ['Giá mới của mỗi ' + vat + ' là $x + ' + th + '$ (nghìn đồng).', 'Số tiền = giá mỗi ' + vat + ' $\\times$ số lượng.'],
          loiGiai: ['Giá mới mỗi ' + vat + ': $x + ' + th + '$.', 'Số tiền phải trả: $' + n + '(x + ' + th + ') = ' + n + 'x + ' + n * th + '$'],
          loiThuongGap: [{ gt: n + 'x+' + th, giaiThich: 'Mỗi ' + vat + ' đều tăng $' + th + '$ nghìn nên phải nhân **cả** $x + ' + th + '$ với $' + n + '$: $' + n + '(x + ' + th + ')$.' }]
        };
      }
      if (loai === 'tuoi') {
        var k = r.so(2, 5), y = r.so(2, 10);
        return {
          de: 'Hiện nay con $x$ tuổi, tuổi mẹ gấp $' + k + '$ lần tuổi con. Viết biểu thức biểu thị **tổng** số tuổi của hai mẹ con sau $' + y + '$ năm nữa.',
          dapAn: { kieu: 'bieuThuc', gt: (k + 1) + 'x+' + 2 * y },
          hinhGiai: hg('Con + mẹ sau ' + y + ' năm', [m(1, y, 'x + ' + y), m(k, y, k + 'x + ' + y)], null, null, { tuyChon: { x: 10, hienX: false }, ghiChu: 'Cả hai đoạn đều có thêm ' + y + ' năm. ' + X_BAT_KI }),
          goiY: ['Tuổi mẹ hiện nay là $' + k + 'x$. Sau $' + y + '$ năm, **mỗi người** thêm $' + y + '$ tuổi.', 'Cộng $(x + ' + y + ')$ với $(' + k + 'x + ' + y + ')$.'],
          loiGiai: ['Sau $' + y + '$ năm: con $x + ' + y + '$, mẹ $' + k + 'x + ' + y + '$.', 'Tổng: $(x + ' + y + ') + (' + k + 'x + ' + y + ') = ' + (k + 1) + 'x + ' + 2 * y + '$'],
          loiThuongGap: [{ gt: (k + 1) + 'x+' + y, giaiThich: 'Sau $' + y + '$ năm **cả hai** mẹ con đều thêm $' + y + '$ tuổi, nên tổng tăng $' + 2 * y + '$.' }]
        };
      }
      var h = r.so(2, 8);
      return {
        de: 'Một mảnh vườn hình chữ nhật có chiều dài $x$ (m), chiều rộng ngắn hơn chiều dài $' + h + '$ m. Viết biểu thức biểu thị chu vi mảnh vườn (m).',
        dapAn: { kieu: 'bieuThuc', gt: '4x-' + 2 * h },
        hinhGiai: hg('Dài + rộng + dài + rộng', [m(1, 0, 'x'), m(1, -h, 'x − ' + h), m(1, 0, 'x'), m(1, -h, 'x − ' + h)], null, null, { tuyChon: { x: h + 8, hienX: false }, ghiChu: X_BAT_KI }),
        goiY: ['Chiều rộng là $x - ' + h + '$ (m).', 'Chu vi hình chữ nhật $= 2\\cdot($dài $+$ rộng$)$.'],
        loiGiai: ['Chiều rộng: $x - ' + h + '$ (m).', 'Chu vi: $2(x + x - ' + h + ') = 4x - ' + 2 * h + '$'],
        loiThuongGap: [{ gt: '2x-' + h, giaiThich: 'Em mới cộng dài với rộng (nửa chu vi). Chu vi phải nhân thêm $2$.' }]
      };
    } },
    { ten: 'Tìm một số chưa biết', muc: 1, sinh: function (r) {
      var loai = r.chon(['luong', 'lop', 'thung']);
      if (loai === 'luong') {
        var th = r.so(1, 3), x = r.chon([8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20]), T = (12 + th) * x;
        return {
          de: 'Chị ' + r.chon(['Linh', 'Hoa', 'Thảo', 'Yến']) + ' được thưởng Tết bằng $' + th + '$ tháng lương. Tổng thu nhập một năm (lương $12$ tháng và thưởng Tết) là $' + T + '$ triệu đồng. Lương mỗi tháng của chị là bao nhiêu triệu đồng?',
          dapAn: { kieu: 'so', gt: x },
          hinhGiai: hg('Lương 12 tháng + thưởng', [m(12, 0, '12x'), m(th, 0, (th === 1 ? '' : th) + 'x')], 'Thu nhập cả năm', [m(0, T, String(T))]),
          goiY: ['Gọi $x$ (triệu đồng) là lương một tháng. Thưởng Tết là $' + heSo(th) + 'x$.', 'Lập phương trình $12x + ' + heSo(th) + 'x = ' + T + '$.'],
          loiGiai: ['Gọi $x$ (triệu đồng) là lương một tháng, $x > 0$.', '$12x + ' + heSo(th) + 'x = ' + T + '$', '$' + (12 + th) + 'x = ' + T + '$', '$x = ' + x + '$'],
          loiThuongGap: loc([{ gt: T / 12, giaiThich: 'Thu nhập gồm $12$ tháng lương **và** $' + th + '$ tháng thưởng, tức là $' + (12 + th) + '$ lần lương tháng.' }], x)
        };
      }
      if (loai === 'lop') {
        var nam = r.so(14, 22), hon = r.so(1, 8), N = 2 * nam + hon;
        var hoiNu = r.dau() > 0, kq = hoiNu ? nam + hon : nam;
        return {
          de: 'Lớp 8A có $' + N + '$ học sinh, số học sinh nữ nhiều hơn số học sinh nam là $' + hon + '$ bạn. Lớp 8A có bao nhiêu học sinh ' + (hoiNu ? 'nữ' : 'nam') + '?',
          dapAn: { kieu: 'so', gt: kq },
          hinhGiai: hg('Nam + nữ', [m(1, 0, 'x'), m(1, hon, 'x + ' + hon)], 'Cả lớp', [m(0, N, String(N))]),
          goiY: ['Gọi $x$ là số học sinh nam ($x$ nguyên dương) thì số học sinh nữ là $x + ' + hon + '$.', 'Lập phương trình $x + (x + ' + hon + ') = ' + N + '$.'],
          loiGiai: ['Gọi $x$ là số học sinh nam, $x$ nguyên dương. Số học sinh nữ: $x + ' + hon + '$.', '$x + x + ' + hon + ' = ' + N + '$, nên $2x = ' + (N - hon) + '$, $x = ' + nam + '$.',
            hoiNu ? 'Số học sinh nữ: $' + nam + ' + ' + hon + ' = ' + kq + '$' : 'Số học sinh nam: $x = ' + kq + '$'],
          loiThuongGap: loc([{ gt: hoiNu ? nam : nam + hon, giaiThich: hoiNu ? 'Đó là số học sinh **nam**. Số nữ còn phải cộng thêm $' + hon + '$.' : 'Đó là số học sinh **nữ**. Đề hỏi số học sinh nam.' }], kq)
        };
      }
      var k = r.so(2, 4), x2 = r.so(4, 30), T2 = (k + 1) * x2;
      return {
        de: 'Hai thùng chứa tất cả $' + T2 + '$ lít dầu. Thùng thứ nhất chứa gấp $' + k + '$ lần thùng thứ hai. Thùng thứ hai chứa bao nhiêu lít dầu?',
        dapAn: { kieu: 'so', gt: x2 },
        hinhGiai: hg('Thùng hai + thùng một', [m(1, 0, 'x'), m(k, 0, k + 'x')], 'Cả hai thùng', [m(0, T2, String(T2))]),
        goiY: ['Gọi $x$ (lít) là số dầu ở thùng thứ hai thì thùng thứ nhất có $' + k + 'x$ lít.', 'Lập phương trình $x + ' + k + 'x = ' + T2 + '$.'],
        loiGiai: ['Gọi $x$ (lít) là số dầu ở thùng thứ hai, $x > 0$. Thùng thứ nhất: $' + k + 'x$.', '$x + ' + k + 'x = ' + T2 + '$, tức là $' + (k + 1) + 'x = ' + T2 + '$', '$x = ' + x2 + '$'],
        loiThuongGap: loc([{ gt: T2 / k, giaiThich: '$x + ' + k + 'x = ' + (k + 1) + 'x$ (cộng cả $x$ của thùng thứ hai), không phải $' + k + 'x$.' }, { gt: k * x2, giaiThich: 'Đó là số dầu ở thùng **thứ nhất**.' }], x2)
      };
    } },
    { ten: 'Bài toán tuổi', muc: 2, sinh: function (r) {
      var ten = r.chon(TEN), nguoi = r.chon(['Bố', 'Mẹ']);
      if (r.dau() > 0) {
        var c, n, k, d, lan = 0;
        do { c = r.so(4, 14); n = r.so(2, 10); k = r.so(2, 4); d = (k - 1) * (c + n); lan++; } while ((d < 20 || d > 40) && lan < 100);
        if (d < 20 || d > 40) { c = 8; n = 4; k = 3; d = 24; }
        return {
          de: nguoi + ' hơn ' + ten + ' $' + d + '$ tuổi. Sau $' + n + '$ năm nữa tuổi ' + nguoi.toLowerCase() + ' gấp $' + k + '$ lần tuổi ' + ten + '. Hiện nay ' + ten + ' bao nhiêu tuổi?',
          dapAn: { kieu: 'so', gt: c },
          hinhGiai: hg('Tuổi ' + nguoi.toLowerCase() + ' sau ' + n + ' năm', [m(1, d + n, 'x + ' + (d + n))], k + ' lần tuổi ' + ten + ' sau ' + n + ' năm', lap(k, m(1, n, 'x + ' + n))),
          goiY: ['Gọi $x$ là tuổi ' + ten + ' hiện nay thì tuổi ' + nguoi.toLowerCase() + ' là $x + ' + d + '$.', 'Sau $' + n + '$ năm: $x + ' + (d + n) + ' = ' + k + '(x + ' + n + ')$.'],
          loiGiai: ['Gọi $x$ (tuổi) là tuổi ' + ten + ' hiện nay, $x$ nguyên dương. Tuổi ' + nguoi.toLowerCase() + ': $x + ' + d + '$.',
            'Sau $' + n + '$ năm: $x + ' + d + ' + ' + n + ' = ' + k + '(x + ' + n + ')$', '$x + ' + (d + n) + ' = ' + k + 'x + ' + k * n + '$' + (k === 2 ? '' : ', nên $' + (k - 1) + 'x = ' + (d + n - k * n) + '$'),
            '$x = ' + c + '$'],
          loiThuongGap: loc([{ gt: (d - k * n) / (k - 1), giaiThich: 'Sau $' + n + '$ năm **' + nguoi.toLowerCase() + '** cũng thêm $' + n + '$ tuổi: vế trái là $x + ' + d + ' + ' + n + '$.' },
            { gt: c + n, giaiThich: '$' + (c + n) + '$ là tuổi ' + ten + ' **sau** $' + n + '$ năm. Đề hỏi tuổi hiện nay.' }], c)
        };
      }
      // bố/mẹ hơn con từ 20 đến 40 tuổi cho hợp lí thực tế
      var x, k2, lan2 = 0;
      do { x = r.so(5, 14); k2 = r.so(3, 5); lan2++; } while (((k2 - 1) * x < 20 || (k2 - 1) * x > 40) && lan2 < 100);
      if ((k2 - 1) * x < 20 || (k2 - 1) * x > 40) { x = 10; k2 = 4; }
      var y = r.so(2, 8), S = (k2 + 1) * x + 2 * y;
      return {
        de: 'Hiện nay tuổi ' + nguoi.toLowerCase() + ' gấp $' + k2 + '$ lần tuổi ' + ten + '. Sau $' + y + '$ năm nữa, tổng số tuổi của hai người là $' + S + '$. Hỏi hiện nay ' + ten + ' bao nhiêu tuổi?',
        dapAn: { kieu: 'so', gt: x },
        hinhGiai: hg('Hai người sau ' + y + ' năm', [m(1, y, 'x + ' + y), m(k2, y, k2 + 'x + ' + y)], 'Tổng số tuổi', [m(0, S, String(S))]),
        goiY: ['Gọi $x$ là tuổi ' + ten + ' hiện nay thì tuổi ' + nguoi.toLowerCase() + ' là $' + k2 + 'x$.', 'Sau $' + y + '$ năm **cả hai** người đều thêm $' + y + '$ tuổi: $(x + ' + y + ') + (' + k2 + 'x + ' + y + ') = ' + S + '$.'],
        loiGiai: ['Gọi $x$ (tuổi) là tuổi ' + ten + ' hiện nay, $x$ nguyên dương. Tuổi ' + nguoi.toLowerCase() + ': $' + k2 + 'x$.',
          '$(x + ' + y + ') + (' + k2 + 'x + ' + y + ') = ' + S + '$', '$' + (k2 + 1) + 'x + ' + 2 * y + ' = ' + S + '$, nên $' + (k2 + 1) + 'x = ' + (S - 2 * y) + '$', '$x = ' + x + '$'],
        loiThuongGap: loc([{ gt: (S - y) / (k2 + 1), giaiThich: 'Sau $' + y + '$ năm **cả hai** người đều thêm $' + y + '$ tuổi, tổng tăng $' + 2 * y + '$ chứ không phải $' + y + '$.' },
          { gt: k2 * x, giaiThich: 'Đó là tuổi ' + nguoi.toLowerCase() + '. Đề hỏi tuổi ' + ten + '.' }], x)
      };
    } },
    { ten: 'Chuyển động: đuổi kịp, gặp nhau', muc: 2, sinh: function (r) {
      if (r.dau() > 0) {
        var t, h, v1, v2, lan = 0;
        do {
          t = r.so(1, 4); h = r.chon([1, 1, 2]); v1 = 5 * r.so(6, 12); v2 = v1 + v1 * h / t; lan++;
        } while ((v2 > 100 || v2 % 5) && lan < 200);
        if (v2 > 100 || v2 % 1) { t = 2; h = 1; v1 = 40; v2 = 60; }
        var gio = r.so(6, 8), xe = r.chon([['xe máy', 'ô tô'], ['xe khách', 'ô tô con'], ['xe tải', 'xe con']]);
        return {
          de: 'Một ' + xe[0] + ' xuất phát lúc $' + gio + '$ giờ với vận tốc $' + v1 + '$ km/h. Sau đó $' + h + '$ giờ, một ' + xe[1] + ' xuất phát từ cùng chỗ, đi cùng đường với vận tốc $' + v2 + '$ km/h. Hỏi ' + xe[1] + ' đi bao nhiêu giờ thì đuổi kịp ' + xe[0] + '?',
          dapAn: { kieu: 'so', gt: t },
          hinhGiai: hg(xe[1].charAt(0).toUpperCase() + xe[1].slice(1) + ' đi (km)', [m(v2, 0, v2 + 'x')], xe[0].charAt(0).toUpperCase() + xe[0].slice(1) + ' đi (km)', [m(0, v1 * h, String(v1 * h)), m(v1, 0, v1 + 'x')], { tuyChon: { donVi: ' giờ' } }),
          goiY: ['Gọi $x$ (giờ) là thời gian ' + xe[1] + ' đi đến lúc đuổi kịp. Khi đó ' + xe[0] + ' đã đi $x + ' + h + '$ giờ.', 'Đuổi kịp khi hai quãng đường bằng nhau: $' + v2 + 'x = ' + v1 + '(x + ' + h + ')$.'],
          loiGiai: ['Gọi $x$ (giờ) là thời gian ' + xe[1] + ' đi, $x > 0$.', '$' + v2 + 'x = ' + v1 + '(x + ' + h + ')$, tức là $' + v2 + 'x = ' + v1 + 'x + ' + v1 * h + '$',
            '$' + (v2 - v1) + 'x = ' + v1 * h + '$', '$x = ' + t + '$'],
          loiThuongGap: loc([{ gt: t + h, giaiThich: '$' + (t + h) + '$ giờ là thời gian **' + xe[0] + '** đã đi. ' + xe[1].charAt(0).toUpperCase() + xe[1].slice(1) + ' xuất phát sau $' + h + '$ giờ.' },
            { gt: h / (v2 - v1), giaiThich: 'Khi ' + xe[1] + ' đi $x$ giờ thì ' + xe[0] + ' đã đi $x + ' + h + '$ giờ: $' + v1 + '(x + ' + h + ')$, nhớ nhân $' + v1 + '$ với $' + h + '$.' }], t)
        };
      }
      var tg = r.so(1, 4), a = r.chon([30, 35, 40, 45, 50]), b = r.chon([40, 45, 50, 55, 60]), D = tg * (a + b);
      var hoiCach = r.dau() > 0, kq = hoiCach ? a * tg : tg;
      return {
        de: 'Hai thành phố A và B cách nhau $' + D + '$ km. Cùng một lúc, một xe đi từ A về B với vận tốc $' + a + '$ km/h và một xe đi từ B về A với vận tốc $' + b + '$ km/h. ' + (hoiCach ? 'Chỗ hai xe gặp nhau cách A bao nhiêu ki-lô-mét?' : 'Sau bao nhiêu giờ hai xe gặp nhau?'),
        dapAn: { kieu: 'so', gt: kq },
        hinhGiai: hg('Xe từ A + xe từ B (km)', [m(a, 0, a + 'x'), m(b, 0, b + 'x')], 'Quãng đường AB', [m(0, D, D + ' km')], { tuyChon: { donVi: ' giờ' } }),
        goiY: ['Gọi $x$ (giờ) là thời gian từ lúc xuất phát đến lúc gặp nhau. Hai xe đi được $' + a + 'x$ và $' + b + 'x$ km.', 'Lúc gặp nhau, **tổng** hai quãng đường bằng $' + D + '$ km.'],
        loiGiai: ['Gọi $x$ (giờ) là thời gian đến lúc gặp nhau, $x > 0$.', '$' + a + 'x + ' + b + 'x = ' + D + '$, tức là $' + (a + b) + 'x = ' + D + '$, nên $x = ' + tg + '$.',
          hoiCach ? 'Chỗ gặp cách A: $' + a + '\\cdot ' + tg + ' = ' + kq + '$' : 'Hai xe gặp nhau sau $x = ' + tg + '$'],
        loiThuongGap: loc(hoiCach ? [{ gt: b * tg, giaiThich: '$' + b * tg + '$ km là quãng đường xe đi từ **B**, tức là khoảng cách từ chỗ gặp đến B.' }, { gt: tg, giaiThich: '$' + tg + '$ là thời gian (giờ). Đề hỏi khoảng cách đến A: lấy vận tốc xe từ A nhân thời gian.' }]
          : [{ gt: D / Math.abs(b - a), giaiThich: 'Hai xe đi **ngược chiều** nên quãng đường được rút ngắn theo **tổng** vận tốc $' + a + ' + ' + b + '$.' }], kq)
      };
    } },
    { ten: 'Hình chữ nhật', muc: 2, sinh: function (r) {
      var rong = r.so(4, 25), hon = r.so(2, 12), dai = rong + hon, P = 2 * (dai + rong), vat = r.chon(['mảnh vườn', 'sân chơi', 'thửa ruộng', 'tấm bảng']);
      var hoi = r.chon(['dai', 'rong', 'dt']), kq = hoi === 'dai' ? dai : hoi === 'rong' ? rong : dai * rong;
      var muc = hoi === 'dt' ? 'diện tích của ' + vat + ' (m²)' : (hoi === 'dai' ? 'chiều dài' : 'chiều rộng') + ' của ' + vat + ' (m)';
      var ds = [{ gt: hoi === 'dai' ? rong : hoi === 'rong' ? dai : P, giaiThich: hoi === 'dt' ? 'Đó là chu vi. Diện tích $=$ dài $\\times$ rộng.' : 'Em nhầm giữa chiều dài và chiều rộng.' }];
      var sai = (P - hon) / 2; // quên chia đôi chu vi: x + x + hon = P
      ds.push({ gt: hoi === 'rong' ? sai : hoi === 'dai' ? sai + hon : sai * (sai + hon), giaiThich: 'Chu vi $= 2\\cdot($dài $+$ rộng$)$: nửa chu vi là $' + P / 2 + '$ m, em cần lấy $' + P + ' : 2$ trước.' });
      return {
        de: 'Một ' + vat + ' hình chữ nhật có chu vi $' + P + '$ m, chiều dài hơn chiều rộng $' + hon + '$ m. Tính ' + muc + '.',
        dapAn: { kieu: 'so', gt: kq },
        hinhGiai: hg('Rộng + dài + rộng + dài', [m(1, 0, 'x'), m(1, hon, 'x + ' + hon), m(1, 0, 'x'), m(1, hon, 'x + ' + hon)], 'Chu vi', [m(0, P, P + ' m')], { tuyChon: { donVi: ' m' } }),
        goiY: ['Gọi $x$ (m) là chiều rộng thì chiều dài là $x + ' + hon + '$. Nửa chu vi là $' + P / 2 + '$ m.', 'Lập phương trình $x + (x + ' + hon + ') = ' + P / 2 + '$.'],
        loiGiai: ['Gọi $x$ (m) là chiều rộng, $x > 0$. Chiều dài: $x + ' + hon + '$.', '$2(x + x + ' + hon + ') = ' + P + '$, nên $2x + ' + hon + ' = ' + P / 2 + '$, $2x = ' + (P / 2 - hon) + '$, $x = ' + rong + '$.',
          hoi === 'rong' ? 'Chiều rộng: $x = ' + rong + '$' : hoi === 'dai' ? 'Chiều dài: $' + rong + ' + ' + hon + ' = ' + dai + '$' : 'Chiều dài $' + dai + '$ m. Diện tích: $' + dai + '\\cdot ' + rong + ' = ' + kq + '$'],
        loiThuongGap: loc(ds, kq)
      };
    } },
    { ten: 'Phần trăm: giảm giá, lãi suất', muc: 3, sinh: function (r, cc) {
      var loai = r.chon(['giam', 'giam2', 'dauTu']);
      if (loai === 'giam') {
        var p = r.chon([10, 20, 25, 30, 40]), g = r.chon([200, 240, 300, 360, 400, 480, 500, 600, 800]), G = g * (100 - p) / 100;
        var vat = r.chon(['chiếc áo', 'đôi giày', 'chiếc cặp', 'quyển từ điển']);
        return {
          de: 'Một ' + vat + ' sau khi giảm giá $' + p + '\\%$ được bán với giá $' + G + '$ nghìn đồng. Giá ban đầu của ' + vat + ' là bao nhiêu nghìn đồng?',
          dapAn: { kieu: 'so', gt: g },
          goiY: ['Gọi $x$ (nghìn đồng) là giá ban đầu. Giảm $' + p + '\\%$ thì còn $' + (100 - p) + '\\%$ giá ban đầu.', 'Lập phương trình $' + cc.so((100 - p) / 100) + 'x = ' + G + '$.'],
          loiGiai: ['Gọi $x$ (nghìn đồng) là giá ban đầu, $x > 0$.', '$x - ' + cc.so(p / 100) + 'x = ' + G + '$, tức là $' + cc.so((100 - p) / 100) + 'x = ' + G + '$', '$x = ' + G + ' : ' + cc.so((100 - p) / 100) + ' = ' + g + '$'],
          loiThuongGap: loc([{ gt: G * (100 + p) / 100, giaiThich: 'Giá sau khi giảm bằng $' + (100 - p) + '\\%$ giá **ban đầu** (chưa biết). Không lấy giá đã giảm cộng thêm $' + p + '\\%$ của chính nó.' }], g)
        };
      }
      if (loai === 'giam2') {
        var p1 = r.chon([10, 20, 25]), p2 = r.chon([10, 20]), g2 = r.chon([400, 500, 600, 800, 1000]), G2 = g2 * (100 - p1) * (100 - p2) / 10000;
        return {
          de: 'Một món hàng được giảm giá $' + p1 + '\\%$; khách quen được giảm thêm $' + p2 + '\\%$ trên giá đã giảm nên chỉ phải trả $' + cc.so(G2) + '$ nghìn đồng. Giá ban đầu của món hàng là bao nhiêu nghìn đồng?',
          dapAn: { kieu: 'so', gt: g2 },
          goiY: ['Gọi $x$ là giá ban đầu. Sau lần giảm thứ nhất còn $' + cc.so((100 - p1) / 100) + 'x$.', 'Lần giảm thứ hai tính trên giá đã giảm: còn $' + cc.so((100 - p2) / 100) + '\\cdot ' + cc.so((100 - p1) / 100) + 'x$.'],
          loiGiai: ['Gọi $x$ (nghìn đồng) là giá ban đầu, $x > 0$.', '$' + cc.so((100 - p2) / 100) + '\\cdot ' + cc.so((100 - p1) / 100) + 'x = ' + cc.so(G2) + '$, tức là $' + cc.so((100 - p1) * (100 - p2) / 10000) + 'x = ' + cc.so(G2) + '$',
            '$x = ' + g2 + '$'],
          loiThuongGap: loc([{ gt: G2 * 100 / (100 - p1 - p2), giaiThich: 'Lần giảm thứ hai tính trên **giá đã giảm**, nên không được cộng gộp thành giảm $' + (p1 + p2) + '\\%$.' }], g2)
        };
      }
      var V = r.chon([200, 300, 400, 500, 600]), r1 = r.chon([7, 8, 9]), r2 = r.chon([4, 5, 6]), x = r.so(1, V / 50 - 1) * 50, L = (x * r1 + (V - x) * r2) / 100;
      var ten = r.chon(['Cô Hương', 'Bác Hùng', 'Chú Nam', 'Bà Tư']);
      return {
        de: ten + ' đầu tư $' + V + '$ triệu đồng vào hai khoản: một khoản lãi $' + r1 + '\\%$ một năm, khoản còn lại lãi $' + r2 + '\\%$ một năm. Cuối năm nhận được $' + cc.so(L) + '$ triệu đồng tiền lãi. Hỏi khoản lãi $' + r1 + '\\%$ là bao nhiêu triệu đồng?',
        dapAn: { kieu: 'so', gt: x },
        goiY: ['Gọi $x$ (triệu đồng) là khoản lãi $' + r1 + '\\%$ thì khoản kia là $' + V + ' - x$.', 'Tiền lãi: $' + cc.so(r1 / 100) + 'x + ' + cc.so(r2 / 100) + '(' + V + ' - x) = ' + cc.so(L) + '$.'],
        loiGiai: ['Gọi $x$ (triệu đồng) là khoản lãi $' + r1 + '\\%$, $0 < x < ' + V + '$.', '$' + cc.so(r1 / 100) + 'x + ' + cc.so(r2 / 100) + '(' + V + ' - x) = ' + cc.so(L) + '$',
          '$' + cc.so((r1 - r2) / 100) + 'x + ' + cc.so(r2 * V / 100) + ' = ' + cc.so(L) + '$, nên $' + cc.so((r1 - r2) / 100) + 'x = ' + cc.so(L - r2 * V / 100) + '$', '$x = ' + x + '$'],
        loiThuongGap: loc([{ gt: V - x, giaiThich: 'Đó là khoản lãi $' + r2 + '\\%$. Đề hỏi khoản lãi $' + r1 + '\\%$.' }], x)
      };
    } },
    { ten: 'Năng suất: làm vượt mức', muc: 3, sinh: function (r) {
      var a, d, n, k, e, lan = 0;
      do { a = r.so(5, 30); d = r.so(2, 8); n = r.so(8, 25); k = r.so(1, 4); e = (a + d) * (n - k) - a * n; lan++; } while ((e < 0 || e > 60) && lan < 200);
      if (e < 0 || e > 60) { a = 20; d = 3; n = 20; k = 2; e = 14; }
      var sp = r.chon([['xưởng may', 'chiếc áo'], ['tổ sản xuất', 'sản phẩm'], ['đội công nhân', 'mét đường'], ['nhà in', 'quyển sách']]);
      var vuot = e > 0 ? ' và còn vượt kế hoạch $' + e + '$ ' + sp[1] : '';
      return {
        de: 'Một ' + sp[0] + ' dự định hoàn thành kế hoạch trong $' + n + '$ ngày. Nhưng mỗi ngày ' + sp[0] + ' làm vượt mức $' + d + '$ ' + sp[1] + ' nên đã xong sớm $' + k + '$ ngày' + vuot + '. Hỏi theo kế hoạch ' + sp[0] + ' phải làm bao nhiêu ' + sp[1] + '?',
        dapAn: { kieu: 'so', gt: a * n },
        goiY: ['Gọi $x$ là số ' + sp[1] + ' làm mỗi ngày theo kế hoạch. Thực tế mỗi ngày làm $x + ' + d + '$, trong $' + (n - k) + '$ ngày.', 'Lập phương trình $' + (n - k) + '(x + ' + d + ') = ' + n + 'x' + (e ? ' + ' + e : '') + '$. Nhớ: đề hỏi **cả kế hoạch**, không phải mỗi ngày.'],
        loiGiai: ['Gọi $x$ là số ' + sp[1] + ' mỗi ngày theo kế hoạch, $x > 0$. Kế hoạch: $' + n + 'x$; thực tế: $' + (n - k) + '(x + ' + d + ')$.',
          '$' + (n - k) + '(x + ' + d + ') = ' + n + 'x' + (e ? ' + ' + e : '') + '$', '$' + (n - k) + 'x + ' + (n - k) * d + ' = ' + n + 'x' + (e ? ' + ' + e : '') + '$, nên $' + (k === 1 ? '' : k + 'x = ' + ((n - k) * d - e) + '$, $') + 'x = ' + a + '$',
          'Số ' + sp[1] + ' theo kế hoạch: $' + n + '\\cdot ' + a + ' = ' + a * n + '$'],
        loiThuongGap: loc([{ gt: a, giaiThich: '$' + a + '$ là số ' + sp[1] + ' **mỗi ngày**. Kế hoạch cả $' + n + '$ ngày là $' + n + '\\cdot ' + a + '$.' },
          { gt: (a + d) * (n - k), giaiThich: 'Đó là số ' + sp[1] + ' đã làm **thực tế**' + (e ? ' (vượt kế hoạch $' + e + '$)' : '') + '. Đề hỏi số theo kế hoạch.' }], a * n)
      };
    } }
  ]);
})();
