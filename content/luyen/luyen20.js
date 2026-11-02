// Luyện thêm – Bài 20: Phân tích số liệu thống kê dựa vào biểu đồ
(function () {
  'use strict';
  function cs(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); }
  function lech(a, b) { return Math.abs(a - b) > 1e-9; }
  function tron2(x) { return Math.round(x * 100) / 100; }
  // số nguyên ≥ 10 000 → nhóm ba chữ số (trong $…$)
  function ng(x) {
    if (x < 10000 || x % 1) return cs(x);
    var s = String(x), out = '';
    while (s.length > 3) { out = '\\,' + s.slice(-3) + out; s = s.slice(0, -3); }
    return s + out;
  }

  // Bối cảnh biểu đồ cột có gốc trục khác 0: gốc g, mỗi "đơn vị cao" là buoc.
  var GOC = [
    { td: 'Tỉ lệ học sinh khá, giỏi', nhan: ['Năm 2022', 'Năm 2023'], dv: '%', g: 80, buoc: 1, ten: 'tỉ lệ' },
    { td: 'Tiền bán phế liệu', nhan: ['Tuyết', 'Khánh'], dv: 'nghìn đồng', g: 200, buoc: 10, ten: 'số tiền' },
    { td: 'Số lượt chọn món ăn yêu thích', nhan: ['Phở', 'Bún chả'], dv: 'lượt', g: 900, buoc: 5, ten: 'số lượt chọn' },
    { td: 'Điểm thi đua của lớp', nhan: ['Học kì I', 'Học kì II'], dv: 'điểm', g: 70, buoc: 2, ten: 'điểm' },
    { td: 'Số khách mỗi ngày của cửa hàng', nhan: ['Thứ 7', 'Chủ nhật'], dv: 'khách', g: 100, buoc: 4, ten: 'số khách' }
  ];
  function boGoc(r) {
    var b = r.chon(GOC), h1 = r.so(1, 4), lan = r.chon([2, 3, 4, 1.5, 2.5]), h2 = h1 * lan, k = 0;
    while ((h2 % 1 || h2 * b.buoc + b.g >= (b.dv === '%' ? 100 : Infinity)) && k < 30) { h1 = r.so(1, 4); lan = r.chon([2, 3, 4, 1.5, 2.5]); h2 = h1 * lan; k++; }
    if (h2 % 1 || h2 * b.buoc + b.g >= (b.dv === '%' ? 100 : Infinity)) { h1 = 2; lan = 2; h2 = 4; }
    var nho = b.g + h1 * b.buoc, lon = b.g + h2 * b.buoc, dao = r.dau() > 0;
    var so = dao ? [lon, nho] : [nho, lon], iLon = dao ? 0 : 1;
    return { b: b, nho: nho, lon: lon, lan: lan, so: so, iLon: iLon,
      hinh: { widget: 'bieuDo', config: { loai: 'cot', gocTruc: b.g, tieuDe: b.td + ' (gốc ' + b.g + ')', nhan: b.nhan.slice(), chuoi: [{ ten: b.ten, so: so }], donVi: b.dv } } };
  }

  TOAN8.luyen(20, [
    { ten: 'Gốc trục khác 0: tỉ lệ chiều cao cột', muc: 1, sinh: function (r) {
      var d = boGoc(r), b = d.b, L = b.nhan[d.iLon], N = b.nhan[1 - d.iLon], ltg = [];
      var that = d.lon / d.nho;
      ltg.push({ gt: tron2(that), giaiThich: 'Đó gần bằng tỉ lệ **số liệu** ($' + d.lon + ' : ' + d.nho + '$). Đề hỏi tỉ lệ **chiều cao cột** khi gốc là $' + b.g + '$.' });
      return {
        de: 'Biểu đồ cột có gốc trục đứng là $' + b.g + '$. Trên biểu đồ, cột **' + L + '** cao gấp bao nhiêu lần cột **' + N + '**?',
        hinh: d.hinh,
        dapAn: { kieu: 'so', gt: d.lan },
        goiY: ['Chiều cao cột chỉ tính phần **trên gốc** $' + b.g + '$.', 'Cột ' + L + ' cao $' + d.lon + ' - ' + b.g + '$, cột ' + N + ' cao $' + d.nho + ' - ' + b.g + '$.'],
        loiGiai: ['Cột ' + L + ' cao $' + d.lon + ' - ' + b.g + ' = ' + (d.lon - b.g) + '$; cột ' + N + ' cao $' + d.nho + ' - ' + b.g + ' = ' + (d.nho - b.g) + '$ (theo cùng đơn vị của trục).',
          'Trên biểu đồ cột ' + L + ' cao gấp $' + cs(d.lan) + '$ lần, trong khi số liệu chỉ gấp $' + d.lon + ' : ' + d.nho + ' \\approx ' + cs(tron2(that)) + '$ lần.',
          '$' + (d.lon - b.g) + ' : ' + (d.nho - b.g) + ' = ' + cs(d.lan) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Gốc trục khác 0: nhận xét đúng hay sai', muc: 2, sinh: function (r) {
      var d = boGoc(r), b = d.b, L = b.nhan[d.iLon], N = b.nhan[1 - d.iLon], ten = r.chon(['Tâm', 'Huy', 'Ngọc', 'Phúc']);
      var kieu = r.chon(['saiLan', 'saiLan', 'dungThuTu', 'dungThat']);
      var that = tron2(d.lon / d.nho), cau, gt, lg;
      if (kieu === 'saiLan') {
        cau = '"' + b.ten.charAt(0).toUpperCase() + b.ten.slice(1) + ' của ' + L + ' gấp ' + cs(d.lan) + ' lần của ' + N + ', vì cột cao gấp ' + cs(d.lan) + ' lần."';
        gt = false;
        lg = ['Gốc trục đứng là $' + b.g + '$ nên tỉ lệ chiều cao cột **không bằng** tỉ lệ số liệu.', 'Số liệu thật: $' + d.lon + ' : ' + d.nho + ' \\approx ' + cs(that) + '$, không phải $' + cs(d.lan) + '$. Bạn ' + ten + ' nói **sai**.'];
      } else if (kieu === 'dungThuTu') {
        cau = '"' + b.ten.charAt(0).toUpperCase() + b.ten.slice(1) + ' của ' + L + ' lớn hơn của ' + N + ', vì cột ' + L + ' cao hơn."';
        gt = true;
        lg = ['Dù gốc trục khác $0$, cột cao hơn vẫn biểu diễn số liệu lớn hơn: $' + d.lon + ' > ' + d.nho + '$.', 'Bạn ' + ten + ' nói **đúng**.'];
      } else {
        cau = '"' + b.ten.charAt(0).toUpperCase() + b.ten.slice(1) + ' của ' + L + ' chỉ gấp khoảng $' + cs(that) + '$ lần của ' + N + '."';
        gt = true;
        lg = ['Đọc số liệu: ' + L + ' $' + d.lon + '$, ' + N + ' $' + d.nho + '$.', '$' + d.lon + ' : ' + d.nho + ' \\approx ' + cs(that) + '$. Bạn ' + ten + ' nói **đúng** (không bị chiều cao cột đánh lừa).'];
      }
      return {
        de: 'Biểu đồ cột có gốc trục đứng là $' + b.g + '$. Bạn ' + ten + ' nhận xét: ' + cau + ' Nhận xét đó đúng hay sai?',
        hinh: d.hinh,
        dapAn: { kieu: 'dungSai', gt: gt },
        goiY: ['Gốc trục đứng của biểu đồ là bao nhiêu? Khi gốc khác $0$, chiều cao cột có tỉ lệ với số liệu không?', 'Đọc **con số** trên đầu mỗi cột rồi so sánh.'],
        loiGiai: lg
      };
    } },

    { ten: 'Tăng (giảm) bao nhiêu phần trăm', muc: 2, sinh: function (r) {
      var b = r.chon([
        { td: 'Doanh thu của cửa hàng', dv: 'triệu đồng', nhan: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'] },
        { td: 'Số học sinh đăng kí câu lạc bộ', dv: 'bạn', nhan: ['2019', '2020', '2021', '2022', '2023'] },
        { td: 'Sản lượng cà phê của hợp tác xã', dv: 'tấn', nhan: ['2019', '2020', '2021', '2022', '2023'] },
        { td: 'Số khách du lịch đến một xã đảo', dv: 'nghìn lượt', nhan: ['2019', '2020', '2021', '2022', '2023'] }]);
      var a = r.chon([20, 25, 40, 50, 60, 80]), pt = r.chon([5, 10, 15, 20, 25, 30, 40, 50]), giam = r.dau() < 0 && pt <= 30;
      var k = 0;
      while (lech(a * pt / 100, Math.round(a * pt / 100)) && k < 20) { a = r.chon([20, 40, 60, 80, 100]); k++; }
      var bb = giam ? a - a * pt / 100 : a + a * pt / 100;
      var n = b.nhan.length, i = r.so(0, n - 3), j = r.so(i + 1, n - 1);
      var so = b.nhan.map(function () { return Math.round(a * r.so(70, 130) / 100); });
      so[i] = a; so[j] = bb;
      var ltg = [], doi = Math.abs(bb - a);
      var chiaMoi = tron2(doi / bb * 100);
      if (lech(chiaMoi, pt)) ltg.push({ gt: chiaMoi, giaiThich: 'Em chia cho giá trị **mới** ($' + cs(bb) + '$). Phải chia cho **giá trị cũ** $' + a + '$.' });
      if (lech(doi, pt)) ltg.push({ gt: doi, giaiThich: '$' + cs(doi) + '$ ' + b.dv + ' là mức ' + (giam ? 'giảm' : 'tăng') + '; đề hỏi ' + (giam ? 'giảm' : 'tăng') + ' bao nhiêu **phần trăm**.' });
      return {
        de: 'Biểu đồ đoạn thẳng cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + '. Từ ' + b.nhan[i] + ' đến ' + b.nhan[j] + ', số liệu ' + (giam ? '**giảm**' : '**tăng**') + ' bao nhiêu phần trăm?',
        hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: b.td, nhan: b.nhan.slice(), chuoi: [{ ten: b.td, so: so }], donVi: b.dv } },
        dapAn: { kieu: 'so', gt: pt },
        goiY: ['Đọc giá trị cũ (' + b.nhan[i] + ') và giá trị mới (' + b.nhan[j] + ').', 'Mức ' + (giam ? 'giảm' : 'tăng') + ' $= \\frac{\\text{chênh lệch}}{\\text{giá trị cũ}} \\cdot 100\\%$.'],
        loiGiai: [b.nhan[i] + ': $' + a + '$; ' + b.nhan[j] + ': $' + cs(bb) + '$ (' + b.dv + '). Chênh lệch: $' + cs(doi) + '$.',
          'Tỉ lệ ' + (giam ? 'giảm' : 'tăng') + ': $\\frac{' + cs(doi) + '}{' + a + '} \\cdot 100\\% = ' + pt + '\\%$.', 'Đáp số: $' + pt + '$.'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Nhận xét xu thế', muc: 2, sinh: function (r) {
      var kieu = r.chon([0, 1, 2]); // 0 tăng liên tục, 1 giảm liên tục, 2 lúc tăng lúc giảm
      var b = r.chon([
        { td: 'Thị phần xuất khẩu gạo (%)', chuoi: ['Việt Nam', 'Thái Lan'], dv: '%', lo: 10, hi: 30 },
        { td: 'Số học sinh đạt giải học sinh giỏi', chuoi: ['Trường A', 'Trường B'], dv: 'bạn', lo: 8, hi: 30 },
        { td: 'Lượng mưa trung bình (mm)', chuoi: ['Hà Nội', 'Huế'], dv: 'mm', lo: 40, hi: 300 }]);
      var nhan = ['2019', '2020', '2021', '2022', '2023'], ai = r.so(0, 1);
      function day(k) {
        var v = r.so(b.lo, Math.round((b.lo + b.hi) / 2)), out = [v];
        var buoc = Math.max(1, Math.round((b.hi - b.lo) / 10));
        for (var t = 1; t < 5; t++) {
          var d = r.so(1, 2) * buoc;
          if (k === 0) v += d; else if (k === 1) v -= d; else v += (t % 2 ? 1 : -1) * d * (t === 1 && r.dau() < 0 ? -1 : 1);
          out.push(v);
        }
        if (k === 1) out = out.map(function (x) { return x + 4 * 2 * buoc; });
        if (k === 2) { var mn = Math.min.apply(null, out); if (mn < b.lo) out = out.map(function (x) { return x + b.lo - mn; }); }
        return out;
      }
      var s = day(kieu);
      // đảm bảo "lúc tăng lúc giảm" thật sự có cả tăng và giảm
      if (kieu === 2) { var coT = false, coG = false; for (var t = 1; t < 5; t++) { if (s[t] > s[t - 1]) coT = true; if (s[t] < s[t - 1]) coG = true; } if (!(coT && coG)) { s[2] = s[1] - 2; s[3] = s[2] + 3; } }
      var khac = day(r.chon([0, 1, 2]));
      var chuoi = ai === 0 ? [{ ten: b.chuoi[0], so: s }, { ten: b.chuoi[1], so: khac }] : [{ ten: b.chuoi[0], so: khac }, { ten: b.chuoi[1], so: s }];
      var lc = ['Tăng liên tục.', 'Giảm liên tục.', 'Lúc tăng lúc giảm.', 'Không thay đổi.'];
      return {
        de: 'Biểu đồ cho biết ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + ' từ năm 2019 đến năm 2023. Nhận xét nào đúng về số liệu của **' + b.chuoi[ai] + '**?',
        hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: b.td, tenNhan: 'Năm', nhan: nhan, chuoi: chuoi, donVi: b.dv } },
        dapAn: { kieu: 'chon', gt: kieu, luaChon: lc },
        goiY: ['Chỉ xem đường của ' + b.chuoi[ai] + ' (theo chú giải màu).', 'So từng năm với năm trước: lớn hơn là tăng, nhỏ hơn là giảm.'],
        loiGiai: [b.chuoi[ai] + ': $' + s.join(' \\to ') + '$.', kieu === 0 ? 'Năm sau luôn cao hơn năm trước → **tăng liên tục**.' : kieu === 1 ? 'Năm sau luôn thấp hơn năm trước → **giảm liên tục**.' : 'Có năm tăng, có năm giảm → **lúc tăng lúc giảm**.']
      };
    } },

    { ten: 'Kết hợp hai biểu đồ quạt tròn', muc: 3, sinh: function (r) {
      // dân số già đi: nhóm trên 64 tuổi tăng tỉ lệ, nhóm 0 – 14 tuổi giảm tỉ lệ
      var gia = r.dau() > 0, nhom = { ten: gia ? 'nhóm trên $64$ tuổi' : 'nhóm $0$ – $14$ tuổi' };
      var d1 = r.chon([1200000, 1500000, 1600000, 2000000]), d2 = d1 + r.chon([100000, 200000, 400000]);
      var p1 = gia ? r.chon([6, 6.5, 7, 7.5]) : r.chon([24, 25, 26, 28]), p2 = gia ? p1 + r.chon([0.5, 1, 1.5, 2]) : p1 - r.chon([1, 2, 3]);
      if (Math.abs(d2 * p2 - d1 * p1) < 1e-6) p2 = p1 < 20 ? p2 + 0.5 : p2 - 1; // tránh hai năm bằng nhau
      var a = d1 * p1 / 100, b2 = d2 * p2 / 100, kq = b2 - a, ltg = [];
      var sai = d1 * (p2 - p1) / 100;
      if (lech(sai, kq)) ltg.push({ gt: sai, giaiThich: 'Em lấy $' + ng(d1) + ' \\cdot ' + cs(Math.abs(p2 - p1)) + '\\%$: dân số hai năm **khác nhau**, phải tính riêng từng năm.' });
      var tang = kq > 0;
      return {
        de: 'Một tỉnh có $' + ng(d1) + '$ người năm 2010 và $' + ng(d2) + '$ người năm 2020. Hai biểu đồ hình quạt tròn cho biết ' + nhom.ten + ' chiếm $' + cs(p1) + '\\%$ (năm 2010) và $' + cs(p2) + '\\%$ (năm 2020). Số người của nhóm này năm 2020 ' + (tang ? 'nhiều' : 'ít') + ' hơn năm 2010 bao nhiêu người?',
        dapAn: { kieu: 'so', gt: Math.abs(kq) },
        goiY: ['Kết hợp hai biểu đồ: tính số người của nhóm ở **từng** năm (dân số mỗi năm khác nhau).', '$' + ng(d1) + ' \\cdot ' + cs(p1) + '\\%$ và $' + ng(d2) + ' \\cdot ' + cs(p2) + '\\%$.'],
        loiGiai: ['Năm 2010: $' + ng(d1) + ' \\cdot ' + cs(p1) + '\\% = ' + ng(a) + '$ (người).', 'Năm 2020: $' + ng(d2) + ' \\cdot ' + cs(p2) + '\\% = ' + ng(b2) + '$ (người).',
          (tang ? 'Nhiều hơn' : 'Ít hơn') + ': $' + (tang ? ng(b2) + ' - ' + ng(a) : ng(a) + ' - ' + ng(b2)) + ' = ' + ng(Math.abs(kq)) + '$'],
        loiThuongGap: ltg.map(function (l) { return { gt: Math.abs(l.gt), giaiThich: l.giaiThich }; }).filter(function (l) { return lech(l.gt, Math.abs(kq)); })
      };
    } },

    { ten: 'Trục ngang chia không đều', muc: 3, sinh: function (r) {
      var nam0 = r.chon([2012, 2014, 2015, 2016]), toc = r.so(2, 6), goc = r.so(15, 40), cach = r.so(3, 5);
      var nam = [nam0, nam0 + 1, nam0 + 2, nam0 + 3, nam0 + 3 + cach];
      var so = nam.map(function (n) { return goc + toc * (n - nam0); });
      var b = r.chon([{ td: 'Số thành viên câu lạc bộ', dv: 'người' }, { td: 'Số cây xanh trong khuôn viên trường', dv: 'cây' }, { td: 'Số đầu sách của thư viện lớp', dv: 'cuốn' }]);
      var tang = so[4] - so[3], kq = tang / cach, ltg = [{ gt: tang, giaiThich: '$' + tang + '$ ' + b.dv + ' là mức tăng của **cả ' + cach + ' năm** (' + nam[3] + ' → ' + nam[4] + '). Chia cho $' + cach + '$ để được mỗi năm.' }];
      return {
        de: 'Biểu đồ đoạn thẳng về ' + b.td.charAt(0).toLowerCase() + b.td.slice(1) + ' có trục ngang chia **đều** từng mốc dù các năm cách nhau không đều. Trung bình mỗi năm từ ' + nam[3] + ' đến ' + nam[4] + ' tăng bao nhiêu ' + b.dv + '?',
        hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: b.td, nhan: nam.map(String), chuoi: [{ ten: b.td, so: so }], donVi: b.dv } },
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Từ ' + nam[3] + ' đến ' + nam[4] + ' là mấy năm?', 'Lấy mức tăng $' + so[4] + ' - ' + so[3] + '$ chia cho số năm.'],
        loiGiai: ['Từ ' + nam[3] + ' đến ' + nam[4] + ' tăng $' + so[4] + ' - ' + so[3] + ' = ' + tang + '$ ' + b.dv + ' trong $' + cach + '$ năm.',
          'Bằng đúng tốc độ các năm trước ($' + toc + '$ ' + b.dv + '/năm): đoạn cuối dốc chỉ vì trục ngang chia không đều.',
          '$' + tang + ' : ' + cach + ' = ' + cs(kq) + '$'],
        loiThuongGap: ltg
      };
    } }
  ]);
})();
