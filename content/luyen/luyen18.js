// Luyện thêm – Bài 18: Thu thập và phân loại dữ liệu
(function () {
  'use strict';
  var LOAI = ['Số liệu rời rạc', 'Số liệu liên tục', 'Dữ liệu không là số, không thể sắp thứ tự', 'Dữ liệu không là số, có thể sắp thứ tự'];
  var VI_SAO = [
    'Các giá trị là số có được bằng cách **đếm**, chỉ nhận các số tự nhiên → **số liệu rời rạc**.',
    'Các giá trị có được nhờ **phép đo**, có thể nhận mọi giá trị trong một khoảng → **số liệu liên tục**.',
    'Các giá trị là chữ (tên gọi) và không có cái nào "hơn" cái nào → dữ liệu không là số, **không thể sắp thứ tự**.',
    'Các giá trị là chữ nhưng **xếp được** theo thứ tự (cao – thấp, nhiều – ít) → dữ liệu không là số, **có thể sắp thứ tự**.'];
  // Ngân hàng dãy dữ liệu: { ten, gon (tên ngắn ghi trên hình), sinh(r) → các giá trị, loai, thuTu (chữ có thứ tự, thấp → cao), viet (chữ viết gọn trên hình) }
  function so(r, ds) { return ds.map(function (d) { return d.length === 3 ? r.so(d[0], d[1]) / d[2] : r.so(d[0], d[1]); }); }
  function chu(r, ds, k) { return r.xaoTron(ds).slice(0, k || ds.length); }
  var NGAN_HANG = [
    { ten: 'Số anh chị em ruột của mỗi bạn', gon: 'Số anh chị em', loai: 0, sinh: function (r) { return so(r, [[0, 2], [0, 3], [1, 2], [0, 1]]); } },
    { ten: 'Số bàn thắng mỗi trận của một đội bóng', gon: 'Số bàn thắng', loai: 0, sinh: function (r) { return so(r, [[0, 3], [0, 4], [1, 2], [0, 2]]); } },
    { ten: 'Số học sinh vắng mặt mỗi ngày trong tuần', gon: 'Số bạn vắng', loai: 0, sinh: function (r) { return so(r, [[0, 3], [0, 2], [1, 4], [0, 1]]); } },
    { ten: 'Số quyển sách mỗi bạn đọc trong tháng', gon: 'Số sách đã đọc', loai: 0, sinh: function (r) { return so(r, [[1, 4], [0, 3], [2, 5], [1, 2]]); } },
    { ten: 'Số xe máy của mỗi gia đình', gon: 'Số xe máy', loai: 0, sinh: function (r) { return so(r, [[1, 2], [1, 3], [0, 2], [2, 3]]); } },
    { ten: 'Số tin nhắn em nhận được mỗi ngày', gon: 'Số tin nhắn', loai: 0, sinh: function (r) { return so(r, [[5, 15], [3, 20], [8, 12]]); } },
    { ten: 'Chiều cao (cm) của các bạn trong tổ', gon: 'Chiều cao (cm)', loai: 1, sinh: function (r) { return so(r, [[1450, 1600, 10], [140, 165], [1480, 1620, 10]]); } },
    { ten: 'Cân nặng (kg) của các bạn', gon: 'Cân nặng (kg)', loai: 1, sinh: function (r) { return so(r, [[380, 520, 10], [40, 55], [400, 500, 10]]); } },
    { ten: 'Nhiệt độ (°C) lúc 7 giờ sáng trong ba ngày', gon: 'Nhiệt độ (°C)', loai: 1, sinh: function (r) { return so(r, [[220, 300, 10], [23, 29], [240, 310, 10]]); } },
    { ten: 'Thời gian (phút) đi từ nhà đến trường', gon: 'Số phút đi đường', loai: 1, sinh: function (r) { return so(r, [[50, 250, 10], [5, 25], [80, 200, 10]]); } },
    { ten: 'Lượng mưa (mm) trong ba ngày', gon: 'Lượng mưa (mm)', loai: 1, sinh: function (r) { return so(r, [[0, 400, 10], [5, 60], [10, 300, 10]]); } },
    { ten: 'Thời gian ngủ mỗi đêm (giờ)', gon: 'Giờ ngủ', loai: 1, sinh: function (r) { return so(r, [[14, 19, 2], [7, 9], [14, 18, 2]]); } },
    { ten: 'Thời gian chạy $100$ m (giây)', gon: 'Giây chạy 100 m', loai: 1, sinh: function (r) { return so(r, [[130, 170, 10], [140, 180, 10], [13, 17]]); } },
    { ten: 'Màu áo yêu thích', loai: 2, sinh: function (r) { return chu(r, ['Xanh', 'Đỏ', 'Trắng', 'Vàng', 'Tím'], 4); } },
    { ten: 'Môn thể thao yêu thích', loai: 2, sinh: function (r) { return chu(r, ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua', 'Bóng rổ'], 4); } },
    { ten: 'Tỉnh/thành phố nơi em sinh ra', gon: 'Nơi sinh', loai: 2, sinh: function (r) { return chu(r, ['Hải Phòng', 'Hà Nội', 'Nam Định', 'Thái Bình', 'Huế'], 3); } },
    { ten: 'Phương tiện đến trường', loai: 2, sinh: function (r) { return chu(r, ['Đi bộ', 'Xe đạp', 'Xe buýt', 'Bố mẹ đưa']); } },
    { ten: 'Loại quả yêu thích', loai: 2, sinh: function (r) { return chu(r, ['Cam', 'Xoài', 'Nhãn', 'Bưởi', 'Ổi'], 4); } },
    { ten: 'Xếp loại học tập', loai: 3, thuTu: ['Đạt', 'Khá', 'Tốt'], sinh: function (r) { return chu(r, ['Tốt', 'Khá', 'Tốt', 'Đạt', 'Khá']); } },
    { ten: 'Mức độ hài lòng của khách', gon: 'Mức hài lòng', loai: 3, thuTu: ['Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'],
      viet: { 'Rất hài lòng': 'Rất', 'Bình thường': 'Thường', 'Không hài lòng': 'Không' }, sinh: function (r) { return chu(r, ['Rất hài lòng', 'Hài lòng', 'Bình thường', 'Không hài lòng']); } },
    { ten: 'Mức độ yêu thích môn Toán', gon: 'Yêu thích Toán', loai: 3, thuTu: ['Không thích', 'Bình thường', 'Thích', 'Rất thích'],
      viet: { 'Rất thích': 'Rất', 'Bình thường': 'Thường', 'Không thích': 'Không' }, sinh: function (r) { return chu(r, ['Rất thích', 'Thích', 'Bình thường', 'Không thích']); } },
    { ten: 'Kết quả thi đấu', loai: 3, thuTu: ['Huy chương đồng', 'Huy chương bạc', 'Huy chương vàng'],
      viet: { 'Huy chương vàng': 'Vàng', 'Huy chương bạc': 'Bạc', 'Huy chương đồng': 'Đồng' }, sinh: function (r) { return chu(r, ['Huy chương vàng', 'Huy chương bạc', 'Huy chương đồng']); } },
    { ten: 'Đánh giá độ khó của đề', gon: 'Độ khó của đề', loai: 3, thuTu: ['Dễ', 'Trung bình', 'Khó', 'Rất khó'],
      viet: { 'Trung bình': 'Vừa', 'Rất khó': 'Rất' }, sinh: function (r) { return chu(r, ['Rất khó', 'Khó', 'Trung bình', 'Dễ']); } }
  ];
  var MAU_LOAI = ['--a', '--b', '#9c36b5', '--cc'];
  function moTa(m, ds) { return m.ten + ': ' + (m.loai < 2 ? '$' + ds.map(cs).join('$; $') + '$' : ds.join('; ')); }
  // Một hàng thẻ của hình lời giải: số đếm đứng ở chấm, số đo đứng trên thước, chữ thì bậc thang hoặc túi
  function hangHinh(m, ds) {
    var v = m.viet || {}, gon = function (x) { return v[x] || x; };
    var h = { loai: m.loai, ten: m.gon || m.ten, the: m.loai < 2 ? ds : ds.map(gon), mau: MAU_LOAI[m.loai] };
    if (m.thuTu) h.thuTu = m.thuTu.map(gon);
    return h;
  }
  function ghiChuViet(ms) {
    var ds = [];
    ms.forEach(function (m) { Object.keys(m.viet || {}).forEach(function (k) { ds.push('"' + m.viet[k] + '" là ' + k); }); });
    return ds.length ? 'Viết gọn: ' + ds.join(', ') + '.' : null;
  }
  function hinhGia(cap) {
    var cf = { ten: 'theDuLieu', tuyChon: { hang: cap.map(function (c) { return hangHinh(c[0], c[1]); }), anTen: true }, chiXem: true, t: 1 };
    var gc = ghiChuViet(cap.map(function (c) { return c[0]; }));
    if (gc) cf.ghiChu = gc;
    return { widget: 'canh', config: cf };
  }
  function cs(x) { return String(x).replace('.', '{,}'); }

  // Bối cảnh cho "giá trị không hợp lí": [câu hỏi, đơn vị, min, max, bước, giá trị vô lí (hàm)]
  var BOI_CANH = [
    { hoi: 'Bạn nặng bao nhiêu ki-lô-gam?', dv: 'kg', lo: 38, hi: 56, vl: function (r, x) { return r.dau() > 0 ? x * 10 : x + 150; } },
    { hoi: 'Bạn cao bao nhiêu xăng-ti-mét?', dv: 'cm', lo: 142, hi: 170, vl: function (r, x) { return Math.round(x / 10); } },
    { hoi: 'Gia đình bạn có mấy người?', dv: 'người', lo: 3, hi: 7, vl: function (r, x) { return x * 10 + r.so(0, 5); } },
    { hoi: 'Nhà bạn có mấy chiếc ti vi?', dv: 'chiếc', lo: 1, hi: 3, vl: function (r, x) { return x * 10 + r.so(1, 9); } },
    { hoi: 'Mỗi đêm bạn ngủ mấy giờ?', dv: 'giờ', lo: 6, hi: 10, vl: function (r) { return r.so(25, 40); } },
    { hoi: 'Bạn bao nhiêu tuổi?', dv: 'tuổi', lo: 13, hi: 14, vl: function (r, x) { return Number(String(x).split('').reverse().join('')); } }
  ];

  TOAN8.luyen(18, [
    { ten: 'Phân loại một dãy dữ liệu', muc: 1, sinh: function (r) {
      var m = r.chon(NGAN_HANG), loai = m.loai, ds = m.sinh(r);
      var ltg = [];
      return {
        de: 'Dãy dữ liệu sau thuộc loại nào?\n\n' + moTa(m, ds) + '.',
        hinhGiai: hinhGia([[m, ds]]),
        dapAn: { kieu: 'chon', gt: loai, luaChon: LOAI.slice() },
        goiY: ['Trước hết: các giá trị là **số** hay **chữ**?', loai < 2 ? 'Là số: có được bằng cách **đếm** hay bằng **phép đo**?' : 'Là chữ: có xếp được theo thứ tự (cao – thấp, nhiều – ít) không?'],
        loiGiai: [VI_SAO[loai]],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Đếm số dãy rời rạc / liên tục', muc: 2, sinh: function (r) {
      var laSo = NGAN_HANG.filter(function (m) { return m.loai < 2; });
      var chon = r.xaoTron(laSo).slice(0, 5), hoiRoiRac = r.dau() > 0;
      var dem = chon.filter(function (m) { return m.loai === (hoiRoiRac ? 0 : 1); }).length;
      var giaTri = chon.map(function (m) { return m.sinh(r); });
      var ds = chon.map(function (m, i) { return '(' + (i + 1) + ') ' + moTa(m, giaTri[i]) + '.'; });
      var dsRR = [], dsLT = [];
      chon.forEach(function (m, i) { (m.loai === 0 ? dsRR : dsLT).push('(' + (i + 1) + ')'); });
      var hinh = hinhGia(chon.map(function (m, i) { return [Object.assign({}, m, { gon: '(' + (i + 1) + ') ' + (m.gon || m.ten) }), giaTri[i]]; }));
      var ltg = [];
      if (dem !== 5) ltg.push({ gt: 5, giaiThich: 'Không phải dãy số nào cũng ' + (hoiRoiRac ? 'rời rạc' : 'liên tục') + ': số **đếm** được là rời rạc, số **đo** được là liên tục.' });
      if (5 - dem !== dem && dem !== 0) ltg.push({ gt: 5 - dem, giaiThich: 'Em đếm nhầm sang loại kia. Đếm → rời rạc; đo → liên tục.' });
      return {
        de: 'Trong 5 dãy dữ liệu sau, có **bao nhiêu** dãy là số liệu ' + (hoiRoiRac ? '**rời rạc**' : '**liên tục**') + '?\n\n' + ds.join('\n\n'),
        hinhGiai: hinh,
        dapAn: { kieu: 'so', gt: dem },
        goiY: ['Dãy nào có được bằng cách **đếm**? Dãy nào có được bằng **phép đo** (cân, thước, đồng hồ, nhiệt kế…)?', 'Đếm → rời rạc; đo → liên tục (dù số ghi ra có thể là số nguyên).'],
        loiGiai: ['Đếm (rời rạc): ' + (dsRR.join(', ') || 'không có') + '.', 'Đo (liên tục): ' + (dsLT.join(', ') || 'không có') + '.', 'Số dãy ' + (hoiRoiRac ? 'rời rạc' : 'liên tục') + ' là $' + dem + '$.'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tìm giá trị không hợp lí', muc: 2, sinh: function (r) {
      var b = r.chon(BOI_CANH), n = r.so(5, 7), ds = [];
      for (var i = 0; i < n; i++) ds.push(r.so(b.lo, b.hi));
      var goc = ds[r.so(0, n - 1)], vl = b.vl(r, goc);
      if (vl >= b.lo && vl <= b.hi) vl = b.hi * 10 + 3;
      var vt = r.so(1, n - 2);
      ds.splice(vt, 0, vl);
      var lonNhatHopLi = Math.max.apply(null, ds.filter(function (x) { return x !== vl; }));
      var nhoNhatHopLi = Math.min.apply(null, ds.filter(function (x) { return x !== vl; }));
      var ten = r.chon(['An', 'Hà', 'Quỳnh', 'Minh', 'Lan']);
      var ltg = [{ gt: vl > b.hi ? lonNhatHopLi : nhoNhatHopLi, giaiThich: '$' + (vl > b.hi ? lonNhatHopLi : nhoNhatHopLi) + '$ ' + b.dv + ' vẫn là giá trị bình thường. Em tìm giá trị ' + (vl > b.hi ? '**lớn**' : '**nhỏ**') + ' đến mức vô lí.' }];
      return {
        de: ten + ' hỏi ' + ds.length + ' bạn lớp 8: "' + b.hoi + '" và ghi được: $' + ds.join('$; $') + '$. Giá trị nào **không hợp lí**?',
        hinhGiai: { widget: 'canh', config: { ten: 'cotHopLi', tuyChon: { so: ds.slice(), don: b.dv, lo: b.lo, hi: b.hi, vl: [vt], anLucDau: true }, chiXem: true, t: 1 } },
        dapAn: { kieu: 'so', gt: vl },
        goiY: ['Với học sinh lớp 8, câu trả lời thường nằm trong khoảng từ $' + b.lo + '$ đến $' + b.hi + '$ ' + b.dv + '.', 'Giá trị nào ' + (vl > b.hi ? 'lớn' : 'nhỏ') + ' đến mức không thể xảy ra (có thể do ghi nhầm)?'],
        loiGiai: ['Các giá trị khác đều bình thường với học sinh lớp 8.', 'Không thể có câu trả lời $' + vl + '$ ' + b.dv + ' (có thể ghi nhầm). Giá trị không hợp lí là $' + vl + '$.'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tỉ lệ phiếu dùng được', muc: 3, sinh: function (r) {
      var lop = r.chon([20, 25, 40, 50]), n = 0, thu, hong, kq;
      do { thu = lop - r.so(0, 4); hong = r.so(1, 4); kq = (thu - hong) * 100 / lop; n++; } while (n < 50 && Math.abs(kq * 10 - Math.round(kq * 10)) > 1e-9);
      if (Math.abs(kq * 10 - Math.round(kq * 10)) > 1e-9) { lop = 40; thu = 38; hong = 3; kq = 87.5; }
      var cau = r.chon(['Mỗi tuần bạn đọc mấy cuốn sách?', 'Nhà bạn có mấy chiếc xe đạp?', 'Mỗi ngày bạn tự học mấy giờ?']);
      var ten = r.chon(['Hoa', 'Nam', 'Tú', 'Mai']), lopTen = r.chon(['8A', '8B', '8C', '8D']);
      var ltg = [];
      var sai1 = thu * 100 / lop, sai2 = (lop - hong) * 100 / lop;
      if (Math.abs(sai1 - kq) > 1e-9) ltg.push({ gt: sai1, giaiThich: '$' + cs(sai1) + '\\%$ là tỉ lệ phiếu **thu về**; còn phải bỏ $' + hong + '$ phiếu không hợp lí.' });
      if (Math.abs(sai2 - kq) > 1e-9 && Math.abs(sai2 - sai1) > 1e-9) ltg.push({ gt: sai2, giaiThich: 'Em lấy $' + lop + ' - ' + hong + '$? Chỉ thu về $' + thu + '$ phiếu, nên số phiếu dùng được là $' + thu + ' - ' + hong + '$.' });
      return {
        de: 'Lớp ' + lopTen + ' có $' + lop + '$ học sinh. ' + ten + ' phát phiếu hỏi "' + cau + '" cho cả lớp và thu về $' + thu + '$ phiếu, trong đó có $' + hong + '$ phiếu ghi giá trị không hợp lí. Số phiếu **dùng được** chiếm bao nhiêu phần trăm số học sinh của lớp?',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Phiếu dùng được = phiếu thu về − phiếu không hợp lí.', 'Tỉ lệ = (số phiếu dùng được) : $' + lop + ' \\cdot 100\\%$.'],
        loiGiai: ['Số phiếu dùng được: $' + thu + ' - ' + hong + ' = ' + (thu - hong) + '$.', 'Tỉ lệ: $\\frac{' + (thu - hong) + '}{' + lop + '} \\cdot 100\\% = ' + cs(kq) + '\\%$.', 'Đáp số: $' + cs(kq) + '\\%$.'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Đếm và tính tỉ lệ từ dữ liệu thô', muc: 3, sinh: function (r) {
      var N = r.chon([20, 20, 25]), nhom = r.chon([['A', 'B', 'C', 'D'], ['Toán', 'Văn', 'Anh', 'KHTN'], ['Đỏ', 'Xanh', 'Vàng', 'Trắng']]);
      var dem = [0, 0, 0, 0], n = 0;
      do { dem[0] = r.so(4, 10); dem[1] = r.so(2, 7); dem[2] = r.so(1, 5); dem[3] = N - dem[0] - dem[1] - dem[2]; n++; } while (n < 50 && (dem[3] < 1 || dem[3] > 6));
      if (dem[3] < 1) { dem = N === 20 ? [8, 6, 4, 2] : [10, 7, 5, 3]; }
      var ds = [];
      dem.forEach(function (c, i) { for (var k = 0; k < c; k++) ds.push(nhom[i]); });
      ds = r.xaoTron(ds);
      var hoi = r.so(0, 3), kq = dem[hoi] * 100 / N;
      var ltg = [{ gt: dem[hoi], giaiThich: '$' + dem[hoi] + '$ là **số bạn**; đề hỏi **phần trăm**: $\\frac{' + dem[hoi] + '}{' + N + '} \\cdot 100\\%$.' }];
      if (Math.abs(dem[hoi] - kq) < 1e-9) ltg = [];
      var chuDe = nhom[0] === 'A' ? 'dự đoán đội vô địch giải bóng đá khối 8 (các đội A, B, C, D)' : nhom[0] === 'Toán' ? 'chọn môn học yêu thích nhất' : 'chọn màu áo đồng phục thể thao';
      return {
        de: 'Bình hỏi $' + N + '$ bạn ' + chuDe + ' và ghi được:\n\n' + ds.join(', ') + '.\n\nCó bao nhiêu **phần trăm** số bạn được hỏi chọn **' + nhom[hoi] + '**?',
        hinhGiai: { widget: 'canh', config: { ten: 'chongThe', tuyChon: { the: ds.slice(), nhom: nhom.slice(), hoi: nhom[hoi], anLucDau: true }, chiXem: true, t: 1 } },
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Lập bảng: đếm số lần mỗi lựa chọn xuất hiện (tổng phải bằng $' + N + '$).', 'Tỉ lệ = (số lần ' + nhom[hoi] + ') : $' + N + ' \\cdot 100\\%$.'],
        loiGiai: ['Bảng thống kê: ' + nhom.map(function (x, i) { return x + ': $' + dem[i] + '$'; }).join('; ') + ' (tổng $' + N + '$).',
          'Tỉ lệ chọn ' + nhom[hoi] + ': $\\frac{' + dem[hoi] + '}{' + N + '} \\cdot 100\\% = ' + cs(kq) + '\\%$.', 'Đáp số: $' + cs(kq) + '\\%$.'],
        loiThuongGap: ltg
      };
    } }
  ], { deCo: [
    { id: '18.L1', muc: 1, de: 'Dữ liệu "Nhiệt độ cơ thể (°C) của các bạn khi khám sức khoẻ: $36{,}5$; $36{,}8$; $37$; $36{,}6$" thuộc loại nào?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: LOAI.slice() },
      goiY: ['Nhiệt độ có được bằng cách đếm hay đo?', 'Đo bằng nhiệt kế, có thể là $36{,}55$ °C.'],
      loiGiai: ['Nhiệt độ đo bằng nhiệt kế, nhận mọi giá trị trong một khoảng → **số liệu liên tục**.'] },
    { id: '18.L2', muc: 1, de: 'Dữ liệu "Mạng điện thoại di động gia đình em đang dùng: Viettel; Vinaphone; Mobifone" thuộc loại nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: LOAI.slice() },
      goiY: ['Các giá trị là số hay chữ?', 'Có mạng nào "lớn hơn" mạng nào không?'],
      loiGiai: ['Tên các mạng là chữ và không có thứ tự tự nhiên → dữ liệu không là số, **không thể sắp thứ tự**.'] },
    { id: '18.L3', muc: 1, de: 'Dữ liệu "Kết quả rèn luyện: Tốt; Khá; Đạt; Chưa đạt" thuộc loại nào?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: LOAI.slice() },
      goiY: ['Các giá trị là chữ.', 'Có thể xếp từ cao xuống thấp không?'],
      loiGiai: ['Tốt > Khá > Đạt > Chưa đạt: xếp được theo thứ tự → dữ liệu không là số, **có thể sắp thứ tự**.'] },
    { id: '18.L4', muc: 1, de: 'Dữ liệu "Số cây mỗi lớp trồng được trong buổi lao động: $12$; $15$; $9$; $14$" thuộc loại nào?',
      dapAn: { kieu: 'chon', gt: 0, luaChon: LOAI.slice() },
      goiY: ['Số cây có được bằng cách nào?', 'Có lớp nào trồng được $12{,}5$ cây không?'],
      loiGiai: ['Số cây có được bằng cách **đếm**, chỉ là số tự nhiên → **số liệu rời rạc**.'] },
    { id: '18.L5', muc: 1, de: 'Trồng hạt đậu trong ba chậu với lượng nước tưới khác nhau rồi đo chiều cao cây mỗi ngày. Đây là phương pháp thu thập dữ liệu nào?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Lập bảng hỏi', 'Làm thí nghiệm', 'Phỏng vấn', 'Thu thập từ nguồn có sẵn'] },
      goiY: ['Em có hỏi ai không? Có tra sách báo không?', 'Em tự bố trí trồng cây với các điều kiện khác nhau rồi đo.'],
      loiGiai: ['Em tự bố trí các điều kiện (lượng nước) rồi đo kết quả: đó là **làm thí nghiệm** (thu thập trực tiếp).'] },
    { id: '18.L6', muc: 1, de: 'Mai vào website của Cục Thống kê để lấy số dân các tỉnh năm 2023. Khẳng định "Mai thu thập dữ liệu **gián tiếp**" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Thu thập gián tiếp là lấy từ nguồn **có sẵn** (sách, báo, Internet).', 'Số dân đã được công bố sẵn trên website.'],
      loiGiai: ['Mai lấy dữ liệu từ nguồn có sẵn → thu thập **gián tiếp**. Khẳng định **đúng**.'] },
    { id: '18.L7', muc: 2, de: 'Cô giáo phát cho mỗi bạn trong lớp một tờ giấy có câu hỏi "Em thích môn học nào nhất?" để các bạn tự ghi câu trả lời. Đây là phương pháp nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Quan sát', 'Làm thí nghiệm', 'Lập bảng hỏi (phiếu hỏi)', 'Thu thập từ nguồn có sẵn'] },
      goiY: ['Các bạn trả lời vào giấy cô phát.', 'Tờ giấy có câu hỏi in sẵn gọi là gì?'],
      loiGiai: ['Cô phát phiếu có câu hỏi để các bạn tự trả lời: đó là **lập bảng hỏi** (thu thập trực tiếp).'] },
    { id: '18.L8', muc: 2, de: 'Để biết số giờ đọc sách mỗi tuần của học sinh **cả trường**, Hùng chỉ hỏi các bạn đang ngồi trong thư viện. Khẳng định "Dữ liệu Hùng thu được đại diện tốt cho cả trường" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Dữ liệu phải đảm bảo **tính đại diện**.', 'Các bạn hay vào thư viện có đọc sách nhiều hơn các bạn khác không?'],
      loiGiai: ['Các bạn ngồi trong thư viện thường đọc sách nhiều hơn hẳn mức chung.', 'Dữ liệu **không** đại diện cho cả trường. Khẳng định **sai**.'] },
    { id: '18.L9', muc: 2, de: 'Khẳng định "Dữ liệu là số thì luôn là số liệu rời rạc" đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Nhớ lại: có hai loại số liệu.', 'Chiều cao $152{,}5$ cm là số, nó là loại nào?'],
      loiGiai: ['Số liệu có hai loại: rời rạc (đếm) và **liên tục** (đo, như chiều cao, cân nặng, thời gian).', 'Khẳng định **sai**.'] },
    { id: '18.L10', muc: 2, de: 'Tổ 2 ghi lại tuổi của các bạn: $13$; $14$; $13$; $41$; $14$; $13$. Giá trị nào **không hợp lí**?',
      dapAn: { kieu: 'so', gt: 41 },
      goiY: ['Học sinh lớp 8 thường bao nhiêu tuổi?', 'Có thể bạn ghi ngược hai chữ số.'],
      loiGiai: ['Học sinh lớp 8 khoảng $13$ – $14$ tuổi.', 'Giá trị $41$ không hợp lí (có thể ghi nhầm $14$). Giá trị không hợp lí là $41$.'],
      loiThuongGap: [{ gt: 14, giaiThich: '$14$ tuổi là bình thường với học sinh lớp 8. Em tìm giá trị lớn vô lí.' }] },
    { id: '18.L11', muc: 2, de: 'Để biết **tên các nước thuộc khối ASEAN**, cách thu thập nào phù hợp nhất?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['Làm thí nghiệm', 'Quan sát', 'Phỏng vấn các bạn trong lớp', 'Tìm trong sách, báo, Internet'] },
      goiY: ['Dữ liệu này có sẵn ở đâu?', 'Hỏi các bạn thì có thể nhớ sai.'],
      loiGiai: ['Đây là thông tin đã được công bố chính thức → tìm từ **nguồn có sẵn** (sách, báo, Internet): thu thập gián tiếp.'] },
    { id: '18.L12', muc: 3, de: 'Em muốn biết **thời gian đi từ nhà đến trường** (phút) của các bạn trong lớp. Cách làm nào hợp lí nhất, và dữ liệu thu được thuộc loại nào?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['Hỏi 3 bạn ở gần nhà em; số liệu liên tục.', 'Tra trên Internet; số liệu rời rạc.', 'Phát phiếu hỏi cho cả lớp; số liệu liên tục.', 'Phát phiếu hỏi cho cả lớp; số liệu rời rạc.'] },
      goiY: ['Hỏi mấy bạn thì dữ liệu mới đại diện cho cả lớp?', 'Thời gian là đại lượng đếm hay đo?'],
      loiGiai: ['Phải hỏi **cả lớp** để dữ liệu đại diện; Internet không có dữ liệu về lớp em.', 'Thời gian đo bằng đồng hồ → **số liệu liên tục**.'] }
  ] });
})();
