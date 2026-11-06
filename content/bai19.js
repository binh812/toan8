// Bài 19 – Biểu diễn dữ liệu bằng bảng, biểu đồ (SGK Toán 8 KNTT, Tập 1, tr. 93–98)
(function () {
  'use strict';

  // ---------- Dữ liệu dùng cho hình ----------
  var theThao = { loai: 'cot', doiLoai: ['cot', 'tron', 'duong'], hienBang: true,
    tieuDe: 'Môn thể thao yêu thích nhất của 40 bạn lớp 8A', tenNhan: 'Môn thể thao', tenSo: 'Số bạn',
    nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], chuoi: [{ ten: 'Số bạn', so: [16, 10, 8, 6] }], donVi: 'bạn' };

  var thaoCamVien = { loai: 'cot', tieuDe: 'Động vật ở Thảo Cầm Viên ngày 14-7-1869', tenNhan: 'Loài', hienBang: true,
    nhan: ['Thú', 'Chim', 'Bò sát'], chuoi: [{ ten: 'Số lượng (con)', so: [120, 344, 45] }], donVi: 'con' };

  var thaiNhi = { loai: 'duong', doiLoai: ['duong', 'cot'], tieuDe: 'Cân nặng thai nhi chuẩn theo tuần tuổi',
    nhan: ['8', '12', '16', '20', '24', '28', '32', '36', '40'],
    chuoi: [{ ten: 'Cân nặng (gam)', so: [1, 14, 100, 300, 600, 1000, 1700, 2600, 3500] }], donVi: 'gam' };

  var coAoKep = { loai: 'cotKep', tieuDe: 'Cỡ áo của học sinh lớp 8A theo giới tính', tenNhan: 'Cỡ áo', hienBang: true,
    nhan: ['Lớn (L)', 'Trung bình (M)', 'Nhỏ (S)'], chuoi: [{ ten: 'Nam', so: [10, 8, 4] }, { ten: 'Nữ', so: [5, 12, 6] }], donVi: 'bạn' };

  var coAoTron = { loai: 'tron', doiLoai: ['tron', 'cot'], tieuDe: 'Tỉ lệ học sinh lớp 8A theo cỡ áo',
    nhan: ['Cỡ L', 'Cỡ M', 'Cỡ S'], chuoi: [{ ten: 'Số bạn', so: [15, 20, 10] }], donVi: 'bạn' };

  var thaiNhi2 = { loai: 'duong', tieuDe: 'Cân nặng thai nhi từ tuần 24 đến tuần 40',
    nhan: ['24', '28', '32', '36', '40'], chuoi: [{ ten: 'Cân nặng (gam)', so: [600, 1000, 1700, 2600, 3500] }], donVi: 'gam' };

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  function hg(c, giai) {
    var cf = Object.assign({ chiXem: true, t: 1 }, c);
    if (giai) cf.thamSo = Object.assign({}, cf.thamSo, { trangThai: 'giai' });
    return { widget: 'canh', config: cf };
  }
  function bh(tc, them) { return Object.assign({ ten: 'bienHinh', tuyChon: tc }, them || {}); }
  var GIAY_VUN = { nhan: ['8A', '8B', '8C', '8D'], so: [12.7, 16.8, 15.5, 14.3], don: 'kg', den: 'cot', moi: 1, voNghia: true };
  var KHACH_SAN = { nhan: ['Rất tốt', 'Tốt', 'Trung bình', 'Kém'], so: [6, 22, 8, 4], don: 'khách', den: 'bang', giai: 'bang', thuoc: '%', hoi: 1 };
  var DU_DOAN_20 = 'A B A C A A B D A B A C A B A D A B C A'.split(' ');
  function soVN(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }

  TOAN8.bai({
    id: 19, ten: 'Biểu diễn dữ liệu bằng bảng, biểu đồ', sgk: { tap: 1, trang: 93 },
    nhin: {
      tieuDe: 'Dựng bảng thành cột, nối cột thành băng, cuộn băng thành quạt tròn', loai: 'minhHoa',
      luuY: 'Băng chỉ cuộn được thành một hình tròn khi các phần cộng lại đúng bằng cả tổng thể. Nếu mỗi bạn được chọn nhiều môn thì các phần cộng lại quá $100\\%$, không vẽ được quạt tròn. Còn biểu đồ đoạn thẳng dùng khi các cột là những thời điểm nối tiếp nhau.',
      canh: bh({ nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], so: [16, 10, 8, 6], don: 'bạn', den: 'tron', thuoc: '%' },
        { moTa: 'Bảng số bạn thích mỗi môn dựng thành bốn cột, bốn cột nằm xuống nối đuôi thành một băng dài bằng cả lớp, rồi băng cuộn tròn thành biểu đồ quạt.' }),
      buoc: [
        { t: 0, chu: 'Bảng: $40$ bạn lớp 8A chọn môn thể thao yêu thích nhất.' },
        { t: 0.1, chu: 'Dựng mỗi ô số thành một cột, cao theo số bạn. Nhìn cột là biết ngay môn nào nhiều, môn nào ít: biểu đồ **cột** để so sánh.' },
        { t: 0.42, chu: 'Cho các cột nằm xuống, nối đuôi nhau: được một băng dài đúng bằng cả lớp, $40$ bạn, tức $100\\%$. Bóng đá chiếm $16$ trên $40$ phần của băng.' },
        { t: 0.7, chu: 'Cuộn băng lại thành vòng tròn: mỗi đoạn thành một hình quạt. Biểu đồ **quạt tròn** cho biết mỗi phần chiếm bao nhiêu phần trăm cả lớp: $\\frac{16}{40} = 40\\%$.' }
      ],
      ketLuan: 'Cột: so sánh các loại với nhau. Quạt tròn: phần trong tổng thể, $$\\text{tỉ lệ} = \\frac{\\text{phần}}{\\text{tổng}} \\cdot 100\\%, \\qquad \\text{phần} = \\text{tổng} \\cdot \\text{tỉ lệ}.$$ Đoạn thẳng: một đại lượng thay đổi theo thời gian.',
      dung: {
        tieuDe: 'Giấy vụn của bốn lớp nên vẽ bằng biểu đồ nào?', tuBai: '19.8',
        canh: bh(Object.assign({ anLucDau: true }, GIAY_VUN), { moTa: 'Bảng khối lượng giấy vụn bốn lớp thu được. Em chọn loại biểu đồ nào, hình sẽ vẽ loại đó.' }),
        moiThu: 'Chọn một loại biểu đồ. Hình sẽ vẽ đúng loại em chọn bằng số liệu của đề, để em xem nó có giúp so các lớp không.',
        phanUng: [
          { gt: 0, trangThai: 'tranh', loi: 'Mỗi biểu tượng là $1$ kg thì phải vẽ $12{,}7$; $16{,}8$; $15{,}5$; $14{,}3$ biểu tượng: lẻ, bị cắt, khó vẽ và khó đọc.' },
          { gt: 2, trangThai: 'duong', loi: 'Đoạn nối 8A với 8B có nghĩa gì? Các lớp không phải những thời điểm nối tiếp nhau, nên đường nối không nói lên điều gì.' },
          { gt: 3, trangThai: 'tron', loi: 'Bốn hình quạt gần bằng nhau, khó thấy lớp nào thu nhiều hơn. Quạt tròn để xem phần trong tổng thể, còn đề muốn so các lớp với nhau.' }
        ],
        dungChu: 'Bốn cột đứng cạnh nhau trên cùng một đáy: nhìn là thấy 8B nhiều nhất, 8A ít nhất. Biểu đồ cột để so sánh.'
      },
      suyRa: {
        tieuDe: 'Khách sạn, cửa hàng quả, dự đoán đội vô địch: một bộ số đổi dạng',
        baDe: [
          { tuBai: '19.7', canh: bh(Object.assign({ anLucDau: true }, KHACH_SAN), { moTa: 'Bảng đánh giá của 40 khách.' }), tenNut: 'Nối đuôi thành băng',
            soBatKi: function (v) {
              if (v <= 0 || v > 100) return { t: 1, loi: 'Tỉ lệ phần trăm phải lớn hơn $0$ và không quá $100$.' };
              return { t: 1, loi: 'Nếu "Tốt" chiếm $' + soVN(v) + '\\%$ thì có $40 \\cdot ' + soVN(v) + '\\% = ' + soVN(0.4 * v) + '$ khách, mà đề cho $22$ khách.' };
            },
            dungChu: 'Đoạn "Tốt" dài $22$ trên $40$ phần của băng: $\\frac{22}{40} \\cdot 100\\% = 55\\%$.',
            saiChu: 'Cả băng là $40$ khách, tức $100\\%$. Đoạn "Tốt" dài $22$ phần: chia $22$ cho $40$.' },
          { tuBai: '19.6', canh: bh({ nhan: ['Cam', 'Xoài', 'Bưởi', 'Nho'], so: [100, 60, 50, 40], don: 'kg', nguoc: true, thuoc: { tong: 250, don: 'kg' }, hoi: 1, anLucDau: true },
            { moTa: 'Biểu đồ quạt: cam 40%, xoài 24%, bưởi 20%, nho 16%.' }), tenNut: 'Trải quạt thành băng',
            soBatKi: function (v) {
              if (v <= 0 || v >= 250) return { t: 1, loi: 'Xoài là một phần của $250$ kg, nên phải lớn hơn $0$ và nhỏ hơn $250$ kg.' };
              return { t: 1, loi: '$' + soVN(v) + '$ kg thì chiếm $' + soVN(v) + ' : 250 = ' + soVN(v / 2.5) + '\\%$ của băng, mà quạt Xoài ghi $24\\%$.' };
            },
            dungChu: 'Trải ra, cả băng dài $250$ kg. Đoạn Xoài chiếm $24\\%$ băng: $250 \\cdot 24\\% = 60$ kg.',
            saiChu: 'Cả băng là $250$ kg. Đoạn Xoài chiếm $24\\%$ của băng: lấy $250 \\cdot 24\\%$.' },
          { tuBai: '19.11', canh: { ten: 'chongThe', tuyChon: { the: DU_DOAN_20, nhom: ['A', 'B', 'C', 'D'], hoi: 'B', anLucDau: true }, moTa: 'Hai mươi thẻ dự đoán đội vô địch.' }, tenNut: 'Gom thành chồng',
            dungChu: 'Chồng B có $5$ thẻ trong $20$ thẻ: $\\frac{5}{20} \\cdot 100\\% = 25\\%$.',
            saiChu: 'Gom thẻ thành chồng, đếm chồng B rồi chia cho tổng $20$ thẻ.' }
        ],
        cachNhan: 'Cả ba đề là một bộ số đổi dạng: gom thẻ thành chồng (bảng, cột), nối đuôi các cột thành băng (cả băng là $100\\%$), cuộn băng thành quạt tròn. Tỉ lệ $=$ phần $:$ tổng $\\cdot 100\\%$; phần $=$ tổng $\\cdot$ tỉ lệ.'
      }
    },

    khamPha: {
      nhiemVu: 'Cùng một bảng số liệu có thể vẽ thành nhiều loại biểu đồ. Em bấm các nút **Biểu đồ cột**, **Biểu đồ hình quạt tròn**, **Biểu đồ đoạn thẳng** để so sánh. Loại nào giúp em thấy ngay môn nào được thích nhất? Loại nào cho biết mỗi môn chiếm **bao nhiêu phần trăm** cả lớp? Đường nối giữa "Bóng đá" và "Cầu lông" có ý nghĩa gì không?',
      widget: 'bieuDo',
      config: theThao,
      cauHoi: {
        de: 'Xem biểu đồ hình quạt tròn: số bạn thích **Cầu lông** chiếm bao nhiêu phần trăm cả lớp?',
        dapAn: { kieu: 'so', gt: 25 },
        goiY: ['Bấm nút **Biểu đồ hình quạt tròn** và đọc phần trăm của Cầu lông.', 'Hoặc tính: $\\frac{10}{40} \\cdot 100\\%$.'],
        loiGiai: [
          'Tỉ lệ bạn thích Cầu lông: $\\frac{10}{40} \\cdot 100\\% = 25\\%$.',
          'Biểu đồ **cột** giúp so sánh số lượng; biểu đồ **hình quạt tròn** cho thấy tỉ lệ của mỗi phần trong cả lớp ($100\\%$).',
          'Còn biểu đồ **đoạn thẳng** ở đây **không** phù hợp: các môn thể thao không phải là các thời điểm nối tiếp nhau, nên đường nối giữa chúng không có ý nghĩa.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'text', tieuDe: 'Các dạng biểu diễn dữ liệu đã học',
        noiDung: 'Dữ liệu có thể biểu diễn bằng **bảng thống kê** hoặc bằng **biểu đồ**: biểu đồ tranh, biểu đồ cột, biểu đồ cột kép, biểu đồ đoạn thẳng, biểu đồ hình quạt tròn.\n\nTrong bài này em học cách **chuyển** dữ liệu từ dạng này sang dạng khác và **chọn biểu đồ phù hợp** với dữ liệu.' },

      { loai: 'dinhNghia', tieuDe: '1. Biểu đồ tranh hay biểu đồ cột?',
        noiDung: 'Có thể dùng **biểu đồ tranh**, **biểu đồ cột** để biểu diễn số lượng các loại đối tượng khác nhau.\n\nTuy nhiên, khi dùng biểu đồ tranh mà phải vẽ **rất nhiều biểu tượng** (hoặc phải vẽ nhiều biểu tượng bị cắt lẻ) thì ta nên dùng **biểu đồ cột**.' },
      { loai: 'hinh', widget: 'bieuDo', config: thaoCamVien,
        chuThich: 'Nếu vẽ biểu đồ tranh, mỗi biểu tượng ứng với $10$ con thì Chim cần $34{,}4$ biểu tượng, Bò sát cần $4{,}5$ biểu tượng: vừa nhiều vừa lẻ. Biểu đồ **cột** gọn và chính xác hơn.' },

      { loai: 'dinhNghia', tieuDe: '2. Biểu đồ cột hay biểu đồ đoạn thẳng?',
        noiDung: 'Nếu muốn biểu diễn **sự thay đổi của một đại lượng theo thời gian** ta dùng **biểu đồ đoạn thẳng**.\n\nKhi số lượng thời điểm quan sát ít ta cũng có thể biểu diễn bằng biểu đồ cột.' },
      { loai: 'hinh', widget: 'bieuDo', config: thaiNhi,
        chuThich: 'Cân nặng thai nhi thay đổi **theo thời gian** (tuần tuổi), nên biểu đồ **đoạn thẳng** cho thấy rõ xu thế: càng về cuối thai kì cân nặng tăng càng nhanh. Bấm **Biểu đồ cột** để so sánh. Với bảng có tới $35$ tuần thì vẽ cột sẽ rất dày, khi đó nên dùng biểu đồ đoạn thẳng.' },

      { loai: 'dinhNghia', tieuDe: '3. Biểu đồ cột kép hay biểu đồ hình quạt tròn?',
        noiDung: 'Khi muốn **so sánh hai tập dữ liệu** với nhau ta dùng **biểu đồ cột kép**.\n\nKhi muốn biểu diễn **tỉ lệ các phần trong tổng thể** ta dùng **biểu đồ hình quạt tròn**.' },
      { loai: 'hinh', widget: 'bieuDo', config: coAoKep,
        chuThich: '**So sánh** số lượng mỗi cỡ áo của nam và nữ: dùng biểu đồ **cột kép** (mỗi cỡ áo có hai cột đặt cạnh nhau).' },
      { loai: 'hinh', widget: 'bieuDo', config: coAoTron,
        chuThich: 'So sánh **tỉ lệ** học sinh cả lớp theo cỡ áo: dùng biểu đồ **hình quạt tròn**. Lớp có $15 + 20 + 10 = 45$ bạn, cỡ M chiếm $\\frac{20}{45} \\cdot 100\\% \\approx 44{,}4\\%$.' },

      { loai: 'chuY', tieuDe: 'Bảng chọn biểu đồ nhanh',
        noiDung: '• So sánh **số lượng** của các loại (ít loại, số tròn) → biểu đồ **tranh** hoặc **cột**.\n\n• **Thay đổi theo thời gian** → biểu đồ **đoạn thẳng**.\n\n• So sánh **hai tập dữ liệu** → biểu đồ **cột kép**.\n\n• **Tỉ lệ các phần trong tổng thể** (tổng là $100\\%$) → biểu đồ **hình quạt tròn**.\n\nViệc lựa chọn biểu đồ không chỉ phụ thuộc vào dữ liệu mà còn phụ thuộc vào **mục đích** của người dùng.' },
      { loai: 'chuY', tieuDe: 'Tính tỉ lệ phần trăm',
        noiDung: '**Tỉ lệ một phần** = (số lượng của phần đó) : (tổng số lượng) $\\cdot\\, 100\\%$.\n\nNgược lại, biết tỉ lệ thì: **số lượng = tổng × tỉ lệ**.\n\nVí dụ: $25\\%$ của $200$ kg là $200 \\cdot 25\\% = 200 \\cdot \\frac{25}{100} = 50$ kg.' }
    ],

    viDu: [
      { de: 'Một trận bóng đá bán được: vé loại $100\\,000$ đồng: $8\\,200$ vé; loại $150\\,000$ đồng: $15\\,600$ vé; loại $200\\,000$ đồng: $3\\,400$ vé. Nên dùng biểu đồ tranh hay biểu đồ cột?',
        canh: bh({ nhan: ['100 000 đ', '150 000 đ', '200 000 đ'], so: [8200, 15600, 3400], moi: 1000, don: 'vé', den: 'cot' }),
        buoc: [
        { canh: { t: 1, trangThai: 'tranh' }, lam: 'Thử biểu đồ tranh, mỗi biểu tượng ứng với $1\\,000$ vé: cần $8{,}2 + 15{,}6 + 3{,}4 = 27{,}2$ biểu tượng.', vi: 'Vừa phải vẽ **nhiều** biểu tượng, vừa có biểu tượng bị **cắt lẻ** ($0{,}2$; $0{,}6$; $0{,}4$ biểu tượng) – rất khó vẽ và khó đọc.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: 'Vậy nên dùng **biểu đồ cột**.', vi: 'Biểu đồ cột biểu diễn được mọi số lượng một cách chính xác, chỉ cần chia trục đứng hợp lí.' } ] },
      { de: 'Nhiệt độ trung bình tháng 6 ở bốn thành phố: Hà Nội $30{,}2$ °C, Huế $29{,}8$ °C, Đà Lạt $19{,}6$ °C, TP Hồ Chí Minh $28{,}1$ °C. Chọn biểu đồ phù hợp nhất và giải thích.',
        canh: bh({ nhan: ['Hà Nội', 'Huế', 'Đà Lạt', 'TP HCM'], so: [30.2, 29.8, 19.6, 28.1], don: '°C', den: 'cot', moi: 1, voNghia: true, voTong: 'Cộng bốn nhiệt độ: 107,7 °C?' }),
        buoc: [
        { canh: { t: 1, trangThai: 'tranh' }, lam: 'Không dùng biểu đồ tranh.', vi: 'Các số liệu là số thập phân, không biểu diễn được bằng một số nguyên biểu tượng.' },
        { canh: { t: 1, trangThai: 'duong' }, lam: 'Không dùng biểu đồ đoạn thẳng.', vi: 'Nhiệt độ ở đây thay đổi **theo thành phố**, không phải theo thời gian.' },
        { canh: { t: 1, trangThai: 'tron' }, lam: 'Không dùng biểu đồ hình quạt tròn.', vi: 'Cộng nhiệt độ của bốn thành phố lại không ra một "tổng thể" có ý nghĩa.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: 'Nên dùng **biểu đồ cột**.', vi: 'Biểu đồ cột giúp so sánh nhiệt độ giữa các thành phố: Đà Lạt có cột thấp hẳn.' } ] },
      { de: 'Hỏi $400$ học sinh về phương tiện đến trường: đi bộ $80$ bạn, xe đạp $200$ bạn, xe buýt $40$ bạn, bố mẹ đưa đón $80$ bạn. Muốn thấy **tỉ lệ** học sinh theo từng phương tiện thì dùng biểu đồ nào? Tính các tỉ lệ đó.',
        hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: 'Phương tiện đến trường của 400 học sinh', nhan: ['Đi bộ', 'Xe đạp', 'Xe buýt', 'Bố mẹ đưa đón'], chuoi: [{ so: [80, 200, 40, 80] }] } },
        buoc: [
        { lam: 'Dùng **biểu đồ hình quạt tròn**.', vi: 'Ta cần biểu diễn **tỉ lệ các phần** trong tổng số $400$ học sinh.' },
        { lam: 'Đi bộ: $\\frac{80}{400} = 20\\%$; xe đạp: $\\frac{200}{400} = 50\\%$.', vi: 'Tỉ lệ = số lượng phần đó chia cho tổng, rồi đổi ra phần trăm.' },
        { lam: 'Xe buýt: $\\frac{40}{400} = 10\\%$; bố mẹ đưa đón: $\\frac{80}{400} = 20\\%$.', vi: 'Kiểm tra: $20\\% + 50\\% + 10\\% + 20\\% = 100\\%$. Đúng!' } ] },
      { de: 'Biểu đồ hình quạt tròn cho biết tỉ lệ các loại quả một cửa hàng bán được: Lê $20\\%$, Táo $30\\%$, Nhãn $40\\%$, Nho $10\\%$. Cửa hàng bán được tất cả $300$ kg quả. Lập bảng số lượng mỗi loại (để vẽ biểu đồ cột).',
        hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: 'Tỉ lệ mỗi loại quả bán được', nhan: ['Lê', 'Táo', 'Nhãn', 'Nho'], chuoi: [{ so: [20, 30, 40, 10] }] } },
        buoc: [
        { lam: 'Lê: $300 \\cdot 20\\% = 60$ (kg); Táo: $300 \\cdot 30\\% = 90$ (kg).', vi: 'Biết tổng và tỉ lệ thì: số lượng = tổng × tỉ lệ.' },
        { lam: 'Nhãn: $300 \\cdot 40\\% = 120$ (kg); Nho: $300 \\cdot 10\\% = 30$ (kg).', vi: 'Kiểm tra: $60 + 90 + 120 + 30 = 300$ kg. Đúng!' },
        { lam: 'Bảng: Lê $60$ | Táo $90$ | Nhãn $120$ | Nho $30$ (kg). Từ bảng này em vẽ được biểu đồ cột.', vi: 'Đây là **chuyển dữ liệu** từ biểu đồ quạt tròn → bảng → biểu đồ cột.' } ] },
      { de: 'Mật độ dân số (người/km²) của ba vùng năm 2009 và năm 2019 được cho trong bảng dưới đây. Muốn biết sau 10 năm mật độ dân số **thay đổi thế nào ở mỗi vùng**, nên dùng biểu đồ nào?',
        hinh: { widget: 'bieuDo', config: { loai: 'cotKep', tieuDe: 'Mật độ dân số (người/km²)', hienBang: true, tenNhan: 'Vùng',
          nhan: ['ĐB sông Hồng', 'Bắc Trung Bộ – DH miền Trung', 'ĐB sông Cửu Long'], chuoi: [{ ten: 'Năm 2009', so: [930, 196, 424] }, { ten: 'Năm 2019', so: [1060, 211, 423] }], donVi: 'người/km²' } },
        buoc: [
        { lam: 'Ta có **hai tập dữ liệu** (năm 2009 và năm 2019) cần đặt cạnh nhau để so sánh.', vi: 'Mỗi vùng có hai số liệu: một của năm 2009, một của năm 2019.' },
        { lam: 'Nên dùng **biểu đồ cột kép**.', vi: 'Biểu đồ cột kép đặt hai cột của cùng một vùng cạnh nhau: nhìn là thấy vùng nào tăng, vùng nào giảm.' } ] }
    ],

    viDuMo: [
      { de: 'Lớp 8B có $40$ học sinh, trong đó $14$ bạn chọn Toán là môn học yêu thích nhất. Trên biểu đồ hình quạt tròn, phần ứng với môn Toán chiếm bao nhiêu phần trăm?', buoc: [
        { lam: 'Tỉ lệ $= \\frac{14}{40} \\cdot 100\\%$', vi: 'Lấy số bạn chọn Toán chia cho tổng số học sinh.' },
        { lam: '$= 35\\%$', vi: 'Em hãy tính tỉ lệ phần trăm:', an: true,
          dapAn: { kieu: 'so', gt: 35 },
          loiThuongGap: [{ gt: 14, giaiThich: '$14$ là **số bạn**, chưa phải tỉ lệ. Em chia cho $40$ rồi nhân $100\\%$.' }] } ] },
      { de: 'Biểu đồ hình quạt tròn cho biết $25\\%$ trong số $360$ học sinh khối 8 đi học bằng xe buýt. Có bao nhiêu học sinh đi xe buýt?', buoc: [
        { lam: 'Số học sinh $= 360 \\cdot 25\\% = 360 \\cdot \\frac{25}{100}$', vi: 'Biết tổng và tỉ lệ: số lượng = tổng × tỉ lệ.' },
        { lam: '$= 90$ (học sinh)', vi: 'Em hãy tính kết quả:', an: true,
          dapAn: { kieu: 'so', gt: 90 },
          loiThuongGap: [{ gt: 1440, giaiThich: 'Em lấy $360 : 25 \\cdot 100$ rồi. Phải nhân với $\\frac{25}{100}$: $360 \\cdot 25 : 100 = 90$.' }] } ] }
    ],

    baiTap: [
      { id: '19.1', hinhGiai: hg(bh({ nhan: ['24', '28', '32', '36', '40'], so: [600, 1000, 1700, 2600, 3500], don: 'gam', den: 'duong' }, { ghiChu: 'Cân nặng thai nhi theo tuần tuổi: nối đỉnh cột theo thứ tự thời gian.' })), muc: 1, de: 'Để biểu diễn **sự thay đổi của một đại lượng theo thời gian**, ta nên dùng biểu đồ nào?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Biểu đồ cột kép', 'Biểu đồ tranh', 'Biểu đồ đoạn thẳng', 'Biểu đồ hình quạt tròn'] },
        goiY: ['Biểu đồ nào có các điểm nối với nhau theo thứ tự thời gian?', 'Đường gấp khúc đi lên là tăng, đi xuống là giảm.'],
        loiGiai: ['Biểu đồ **đoạn thẳng** nối các điểm theo thứ tự thời gian, nhìn là thấy tăng hay giảm.'] },

      { id: '19.2', hinhGiai: hg(bh({ nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], so: [16, 10, 8, 6], don: 'bạn', den: 'tron' })), muc: 1, de: 'Để biểu diễn **tỉ lệ của các phần trong tổng thể**, ta dùng biểu đồ nào?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['Biểu đồ tranh', 'Biểu đồ cột', 'Biểu đồ đoạn thẳng', 'Biểu đồ hình quạt tròn'] },
        goiY: ['Tổng thể ứng với $100\\%$.', 'Biểu đồ nào chia một hình tròn thành các phần?'],
        loiGiai: ['Cả hình tròn là tổng thể ($100\\%$), mỗi hình quạt là một phần: biểu đồ **hình quạt tròn**.'] },

      { id: '19.3', muc: 1, de: 'Biểu đồ cho biết số sách mỗi tổ của lớp 8A quyên góp được. Cả lớp quyên góp được bao nhiêu cuốn sách?',
        hinh: { widget: 'bieuDo', config: { loai: 'cot', tieuDe: 'Số sách quyên góp của lớp 8A', nhan: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'], chuoi: [{ ten: 'Số sách', so: [18, 24, 15, 21] }], donVi: 'cuốn' } },
        dapAn: { kieu: 'so', gt: 78 },
        goiY: ['Đọc số ghi trên đầu mỗi cột.', 'Cộng số sách của 4 tổ.'],
        loiGiai: ['Đọc biểu đồ: Tổ 1: $18$, Tổ 2: $24$, Tổ 3: $15$, Tổ 4: $21$ cuốn.', 'Cả lớp: $18 + 24 + 15 + 21 = 78$'],
        loiThuongGap: [{ gt: 24, giaiThich: '$24$ là số sách của tổ nhiều nhất. Đề hỏi **cả lớp**: cộng cả 4 tổ.' }] },

      { id: '19.4', muc: 1, de: 'Biểu đồ tranh cho biết số bạn lớp 8A tham gia các câu lạc bộ. Có bao nhiêu bạn tham gia câu lạc bộ **Võ thuật**?',
        hinh: { widget: 'bieuDo', config: { loai: 'tranh', tieuDe: 'Số bạn lớp 8A tham gia câu lạc bộ', bieuTuong: '😊', moiBieuTuong: 3, donVi: 'bạn',
          nhan: ['Tiếng Anh', 'Võ thuật', 'Nghệ thuật'], chuoi: [{ ten: 'Số bạn', so: [6, 12, 9] }] } },
        dapAn: { kieu: 'so', gt: 12 },
        goiY: ['Xem chú thích dưới biểu đồ: mỗi biểu tượng ứng với mấy bạn?', 'Đếm số biểu tượng ở hàng "Võ thuật" rồi nhân với $3$.'],
        loiGiai: ['Mỗi biểu tượng 😊 ứng với $3$ bạn; hàng "Võ thuật" có $4$ biểu tượng.', 'Số bạn tham gia Võ thuật: $4 \\cdot 3 = 12$'],
        loiThuongGap: [{ gt: 4, giaiThich: '$4$ là số **biểu tượng**. Mỗi biểu tượng ứng với $3$ bạn nên phải nhân với $3$.' }] },

      { id: '19.5', muc: 2, de: 'Biểu đồ cột kép cho biết số học sinh các lớp tham gia câu lạc bộ Thể thao và Nghệ thuật. Ở lớp 8A, số bạn tham gia Nghệ thuật nhiều hơn Thể thao bao nhiêu bạn?',
        hinh: { widget: 'bieuDo', config: { loai: 'cotKep', tieuDe: 'Học sinh tham gia câu lạc bộ', hienBang: true, tenNhan: 'Lớp',
          nhan: ['8A', '8B', '8C', '8D'], chuoi: [{ ten: 'Thể thao', so: [9, 12, 10, 6] }, { ten: 'Nghệ thuật', so: [15, 5, 8, 9] }], donVi: 'bạn' } },
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Tìm hai cột của lớp 8A: cột xanh dương là Thể thao, cột cam là Nghệ thuật.', 'Lấy số bạn Nghệ thuật trừ số bạn Thể thao.'],
        loiGiai: ['Lớp 8A: Thể thao $9$ bạn, Nghệ thuật $15$ bạn.', 'Chênh lệch: $15 - 9 = 6$'],
        loiThuongGap: [{ gt: 24, giaiThich: '$9 + 15 = 24$ là tổng. Đề hỏi Nghệ thuật **nhiều hơn** Thể thao bao nhiêu: làm phép trừ.' }] },

      { id: '19.6', muc: 2, de: 'Biểu đồ hình quạt tròn cho biết tỉ lệ các loại quả một cửa hàng bán được. Cửa hàng bán tất cả $250$ kg quả. Cửa hàng bán được bao nhiêu kilôgam **xoài**?',
        hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: 'Tỉ lệ các loại quả bán được', nhan: ['Cam', 'Xoài', 'Bưởi', 'Nho'], chuoi: [{ so: [100, 60, 50, 40] }] } },
        dapAn: { kieu: 'so', gt: 60 },
        goiY: ['Đọc tỉ lệ của xoài trên biểu đồ.', 'Số kilôgam xoài $= 250 \\cdot 24\\%$.'],
        loiGiai: ['Xoài chiếm $24\\%$.', 'Số xoài bán được: $250 \\cdot 24\\% = 250 \\cdot \\frac{24}{100} = 60$'],
        loiThuongGap: [{ gt: 24, giaiThich: '$24$ là **tỉ lệ phần trăm**. Muốn ra kilôgam phải nhân với tổng: $250 \\cdot 24\\%$.' }] },

      { id: '19.7', hinhGiai: hg(bh(KHACH_SAN), true), muc: 2, de: 'Một khách sạn hỏi $40$ khách về chất lượng dịch vụ: Rất tốt $6$ người, Tốt $22$ người, Trung bình $8$ người, Kém $4$ người. Nếu vẽ biểu đồ hình quạt tròn thì phần "Tốt" chiếm bao nhiêu phần trăm?',
        dapAn: { kieu: 'so', gt: 55 },
        goiY: ['Tổng số khách là $40$.', 'Tỉ lệ $= \\frac{22}{40} \\cdot 100\\%$.'],
        loiGiai: ['Tổng: $6 + 22 + 8 + 4 = 40$ khách.', 'Tỉ lệ "Tốt": $\\frac{22}{40} \\cdot 100\\% = 55\\%$'],
        loiThuongGap: [{ gt: 22, giaiThich: '$22$ là số khách. Tỉ lệ phần trăm là $\\frac{22}{40} \\cdot 100\\%$.' }] },

      { id: '19.8', hinhGiai: hg(bh(GIAY_VUN), true), muc: 2, de: 'Khối lượng giấy vụn các lớp thu gom được: 8A $12{,}7$ kg; 8B $16{,}8$ kg; 8C $15{,}5$ kg; 8D $14{,}3$ kg. Nên chọn biểu đồ nào để biểu diễn bảng này?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Biểu đồ tranh', 'Biểu đồ cột', 'Biểu đồ đoạn thẳng', 'Biểu đồ hình quạt tròn'] },
        goiY: ['Số liệu là số thập phân – vẽ tranh được không?', 'Số liệu thay đổi theo lớp hay theo thời gian?'],
        loiGiai: ['Số thập phân nên biểu đồ tranh không phù hợp.', 'Dữ liệu thay đổi theo **lớp**, không theo thời gian → không dùng đoạn thẳng.', 'Ta muốn so sánh khối lượng giữa các lớp → **biểu đồ cột**.'] },

      { id: '19.9', khongHinh: 'Đề không cho số liệu cụ thể; Ví dụ 5 đã có một biểu đồ cột kép như vậy.', muc: 2, de: 'Doanh thu (tỉ đồng) của hai chi nhánh Hà Nội và TP Hồ Chí Minh trong năm 2021 và 2022 được cho trong bảng. Muốn **so sánh** doanh thu của hai chi nhánh trong từng năm, nên dùng biểu đồ nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Biểu đồ cột kép', 'Biểu đồ hình quạt tròn', 'Biểu đồ tranh', 'Biểu đồ đoạn thẳng'] },
        goiY: ['Có mấy tập dữ liệu cần so sánh?', 'So sánh hai tập dữ liệu → biểu đồ …?'],
        loiGiai: ['Có hai tập dữ liệu (hai chi nhánh) cần đặt cạnh nhau trong mỗi năm.', 'Dùng **biểu đồ cột kép**.'] },

      { id: '19.10', muc: 3, de: 'Biểu đồ cho biết cân nặng chuẩn của thai nhi. Cân nặng ở tuần thứ $40$ gấp bao nhiêu lần cân nặng ở tuần thứ $28$?',
        hinh: { widget: 'bieuDo', config: thaiNhi2 },
        dapAn: { kieu: 'so', gt: 3.5 },
        goiY: ['Đọc cân nặng ở tuần 40 và tuần 28 trên biểu đồ.', 'Gấp bao nhiêu lần → lấy số lớn chia số nhỏ.'],
        loiGiai: ['Tuần 40: $3\\,500$ g; tuần 28: $1\\,000$ g.', '$3\\,500 : 1\\,000 = 3{,}5$'],
        loiThuongGap: [{ gt: 2500, giaiThich: '$3\\,500 - 1\\,000 = 2\\,500$ g là **nặng hơn bao nhiêu**. Đề hỏi **gấp bao nhiêu lần**: phép chia.' }] },

      { id: '19.11', hinhGiai: hg({ ten: 'chongThe', tuyChon: { the: DU_DOAN_20, nhom: ['A', 'B', 'C', 'D'], hoi: 'B' } }, true), muc: 3, de: 'Bình hỏi $20$ bạn dự đoán đội vô địch giải bóng đá khối 8 và ghi được: A, B, A, C, A, A, B, D, A, B, A, C, A, B, A, D, A, B, C, A. Nếu vẽ biểu đồ hình quạt tròn thì phần ứng với **đội B** chiếm bao nhiêu phần trăm?',
        dapAn: { kieu: 'so', gt: 25 },
        goiY: ['Lập bảng: đếm số lần mỗi chữ A, B, C, D xuất hiện.', 'Tỉ lệ đội B = (số lần B) : $20 \\cdot 100\\%$.'],
        loiGiai: ['Bảng thống kê: A: $10$; B: $5$; C: $3$; D: $2$ (tổng $20$).', 'Tỉ lệ dự đoán đội B: $\\frac{5}{20} \\cdot 100\\% = 25\\%$'],
        loiThuongGap: [{ gt: 5, giaiThich: '$5$ là số bạn chọn B. Tỉ lệ là $\\frac{5}{20} \\cdot 100\\%$.' }, { gt: 50, giaiThich: '$50\\%$ là tỉ lệ của **đội A** ($10$ bạn). Em đếm lại số chữ B.' }] },

      { id: '19.12', hinhGiai: hg(bh({ nhan: ['Đoàn Kết', 'Bình Minh', 'Hoà Bình'], so: [13, 47, 183], moi: 5, don: 'học sinh', den: 'tranh' })), muc: 3, de: 'Số học sinh ba trường đăng kí giải chạy việt dã: Đoàn Kết $13$, Bình Minh $47$, Hoà Bình $183$. Nếu vẽ biểu đồ tranh, mỗi biểu tượng ứng với $5$ học sinh (phần lẻ vẫn vẽ thêm một biểu tượng bị cắt) thì phải vẽ tất cả bao nhiêu biểu tượng?',
        dapAn: { kieu: 'so', gt: 50 },
        goiY: ['Đoàn Kết: $13 : 5 = 2{,}6$ → cần $3$ biểu tượng (2 nguyên + 1 bị cắt).', 'Làm tương tự với Bình Minh và Hoà Bình rồi cộng lại.'],
        loiGiai: ['Đoàn Kết: $13 : 5 = 2{,}6$ → $3$ biểu tượng.', 'Bình Minh: $47 : 5 = 9{,}4$ → $10$ biểu tượng.', 'Hoà Bình: $183 : 5 = 36{,}6$ → $37$ biểu tượng.', 'Tổng: $3 + 10 + 37 = 50$ biểu tượng. Quá nhiều và nhiều biểu tượng bị cắt → nên dùng **biểu đồ cột**.'],
        loiThuongGap: [{ gt: 48.6, giaiThich: '$243 : 5 = 48{,}6$: mỗi trường có một biểu tượng bị cắt nhưng vẫn phải **vẽ** nó, nên làm tròn lên từng trường: $3 + 10 + 37$.' }] }
    ],

    timLoi: [
      { de: 'An hỏi $50$ bạn "Bạn lo lắng điều gì khi đi thi? (được chọn nhiều ý)" và thấy $30$ bạn chọn "Sợ điểm thấp", $35$ bạn chọn "Sợ hết giờ". An làm như sau. Dòng nào sai?',
        loiGiaiSai: ['Tỉ lệ chọn "Sợ điểm thấp": $\\frac{30}{50} = 60\\%$.', 'Tỉ lệ chọn "Sợ hết giờ": $\\frac{35}{50} = 70\\%$.', 'Vậy ta biểu diễn các tỉ lệ này bằng biểu đồ hình quạt tròn.'],
        dongSai: 2,
        giaiThich: 'Mỗi bạn được chọn nhiều ý nên tổng các tỉ lệ là $60\\% + 70\\% = 130\\% > 100\\%$. Biểu đồ hình quạt tròn chỉ dùng khi các phần cộng lại đúng bằng tổng thể ($100\\%$).',
        sua: 'Nên dùng **biểu đồ cột** để biểu diễn các tỉ lệ $60\\%$ và $70\\%$.' },
      { de: 'Lớp 8D có $16$ bạn nam và $24$ bạn nữ. Bình tính tỉ lệ bạn nữ trong lớp như sau. Dòng nào sai?',
        loiGiaiSai: ['Tổng số học sinh: $16 + 24 = 40$.', 'Tỉ lệ bạn nữ: $\\frac{24}{16} \\cdot 100\\% = 150\\%$.'],
        dongSai: 1,
        giaiThich: 'Tỉ lệ một phần phải chia cho **tổng** ($40$), không chia cho phần còn lại. Tỉ lệ một phần không thể vượt quá $100\\%$.',
        sua: 'Tỉ lệ bạn nữ: $\\frac{24}{40} \\cdot 100\\% = 60\\%$.' }
    ]
  });
})();
