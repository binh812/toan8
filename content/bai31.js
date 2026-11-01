// Bài 31 – Cách tính xác suất của biến cố bằng tỉ số (SGK Toán 8 KNTT, Tập 2, tr. 63–66)
(function () {
  'use strict';

  var tuiKeo = {
    loai: 'tui',
    tui: [{ ten: 'Sữa', so: 7, mau: '#e8590c' }, { ten: 'Chanh', so: 4, mau: '#2f9e44' },
      { ten: 'Dừa', so: 6, mau: '#1971c2' }, { ten: 'Bạc hà', so: 3, mau: '#0c8599' }],
    suKien: { ten: 'Lấy được kẹo sữa', thuanLoi: ['Sữa'] },
    anLiThuyet: true
  };

  var tuiBi17 = {
    loai: 'tui',
    tui: [{ ten: 'Đỏ', so: 8, mau: '#e03131' }, { ten: 'Xanh', so: 5, mau: '#1971c2' }, { ten: 'Vàng', so: 4, mau: '#f08c00' }],
    suKien: { ten: 'Lấy được bi đỏ', thuanLoi: ['Đỏ'] }
  };

  // Vòng quay 12 hình quạt như nhau đánh số 1–12 (H.8.1 SGK), mỗi ô một màu
  var vongMau = ['#94d82d', '#fcc419', '#ffa94d', '#fd7e14', '#f76707', '#e03131', '#c2255c', '#9c36b5', '#6741d9', '#1971c2', '#1098ad', '#2f9e44']
    .map(function (m, i) { return { ten: String(i + 1), so: 1, mau: m }; });

  TOAN8.bai({
    id: 31, ten: 'Cách tính xác suất của biến cố bằng tỉ số', sgk: { tap: 2, trang: 63 },

    khamPha: {
      nhiemVu: 'Túi có **20 viên kẹo** giống hệt nhau, chỉ khác loại: 7 kẹo sữa, 4 kẹo chanh, 6 kẹo dừa, 3 kẹo bạc hà. Lan lấy ngẫu nhiên một viên. Bạn Vuông nói: "Có 4 loại kẹo nên xác suất lấy được kẹo sữa là $\\frac{1}{4}$". Em hãy bấm **Thử 1000 lần** vài lượt và xem tỉ lệ lấy được kẹo sữa dừng lại gần số nào: có gần $\\frac{1}{4} = 0{,}25$ không?',
      widget: 'xacSuat',
      config: tuiKeo,
      cauHoi: {
        de: 'Mỗi **viên kẹo** là một kết quả có thể (các viên đồng khả năng). Tính xác suất để Lan lấy được viên kẹo sữa.',
        dapAn: { kieu: 'so', gt: '7/20' },
        goiY: ['Có bao nhiêu viên kẹo trong túi? Đó là số kết quả có thể.', 'Có bao nhiêu viên kẹo sữa? Đó là số kết quả thuận lợi. Lập tỉ số.'],
        loiGiai: [
          'Có 20 kết quả có thể (20 viên kẹo), đồng khả năng vì các viên giống hệt nhau.',
          'Có 7 kết quả thuận lợi (7 viên kẹo sữa).',
          'Bốn **loại** kẹo không đồng khả năng (kẹo sữa nhiều hơn hẳn) nên không thể nói xác suất là $\\frac{1}{4}$.',
          '$P = \\dfrac{7}{20}$'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhLi', tieuDe: 'Công thức tính xác suất',
        noiDung: 'Giả thiết rằng các kết quả có thể của một hành động hay thực nghiệm là **đồng khả năng**. Khi đó xác suất của biến cố $E$, kí hiệu $P(E)$, bằng tỉ số giữa số kết quả thuận lợi cho $E$ và tổng số kết quả có thể:\n\n$P(E)$ = **Số kết quả thuận lợi cho $E$ : Tổng số kết quả có thể**.\n\nNếu có $\\cb{n}$ kết quả có thể (đồng khả năng), trong đó có $\\cc{m}$ kết quả thuận lợi cho $E$ thì $$P(E) = \\dfrac{\\cc{m}}{\\cb{n}}.$$' },
      { loai: 'chuY', tieuDe: 'Bốn bước tính xác suất',
        noiDung: '**Bước 1.** Đếm các kết quả có thể (thường bằng cách liệt kê).\n\n**Bước 2.** Chỉ ra các kết quả có thể là **đồng khả năng** (thẻ giống nhau, bi cùng kích thước, hình quạt như nhau, xúc xắc cân đối…).\n\n**Bước 3.** Đếm các kết quả thuận lợi cho biến cố $E$.\n\n**Bước 4.** Lập tỉ số: số kết quả thuận lợi chia cho **tổng** số kết quả có thể.' },
      { loai: 'hinh', widget: 'xacSuat', config: { loai: 'vongQuay', tui: vongMau, suKien: { ten: 'Mũi tên chỉ vào số nguyên tố', thuanLoi: ['2', '3', '5', '7', '11'] } },
        chuThich: 'Tấm bìa tròn chia thành 12 hình quạt như nhau, đánh số 1 đến 12 theo chiều kim đồng hồ, bắt đầu từ ô ngay bên phải điểm cao nhất (xem màu từng số ở danh sách phía trên). Quay tấm bìa: 12 kết quả có thể, đồng khả năng. Biến cố $A$: "Mũi tên chỉ vào số nguyên tố" có 5 kết quả thuận lợi $2;\\ 3;\\ 5;\\ 7;\\ 11$, nên $P(A) = \\dfrac{\\cc{5}}{\\cb{12}} \\approx 0{,}417$. Bấm **Thử 1000 lần**: đường đỏ (tỉ lệ thực tế) bám sát đường xanh lá đứt nét (xác suất).' },
      { loai: 'chuY', tieuDe: 'Vì sao cần "đồng khả năng"?',
        noiDung: 'Túi có 17 viên bi: 8 đỏ, 5 xanh, 4 vàng. Nếu coi kết quả là "màu" thì chỉ có 3 kết quả, nhưng chúng **không** đồng khả năng (bi đỏ nhiều hơn). Vì vậy xác suất lấy được bi đỏ **không** bằng $\\dfrac{1}{3}$.\n\nCách đúng: mỗi **viên bi** là một kết quả (17 kết quả đồng khả năng), có 8 viên đỏ, nên xác suất lấy được bi đỏ là $\\dfrac{8}{17}$.' },
      { loai: 'hinh', widget: 'xacSuat', config: tuiBi17,
        chuThich: 'Thử 1000 lần: tỉ lệ lấy được bi đỏ dừng lại gần $\\dfrac{8}{17} \\approx 0{,}47$, không phải gần $\\dfrac{1}{3} \\approx 0{,}33$.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Mẫu số là **tổng số kết quả có thể**, không phải số kết quả **không** thuận lợi. Ví dụ 3 bi đỏ, 2 bi xanh: xác suất lấy được bi đỏ là $\\dfrac{3}{5}$, không phải $\\dfrac{3}{2}$.\n\nXác suất luôn nằm trong khoảng từ $0$ đến $1$. Nếu em tính ra số lớn hơn 1 thì chắc chắn đã sai.\n\nNên **rút gọn** phân số: $\\dfrac{3}{12} = \\dfrac{1}{4}$. Máy chấm nhận cả $\\dfrac{3}{12}$, $\\dfrac{1}{4}$, $0{,}25$ hay $25\\%$.' }
    ],

    viDu: [
      { de: 'Tấm bìa tròn chia thành 12 hình quạt như nhau đánh số $1;\\ 2;\\ \\dots;\\ 12$. Quay tấm bìa. Tính xác suất của $A$: "Mũi tên chỉ vào số nguyên tố" và $B$: "Mũi tên chỉ vào số chính phương".', buoc: [
        { lam: 'Có 12 kết quả có thể: $1;\\ 2;\\ \\dots;\\ 12$, đồng khả năng.', vi: '12 hình quạt **như nhau** nên mũi tên dừng ở hình quạt nào cũng có khả năng như nhau.' },
        { lam: 'Kết quả thuận lợi cho $A$: $2;\\ 3;\\ 5;\\ 7;\\ 11$ (5 kết quả). $P(A) = \\dfrac{5}{12}$.', vi: 'Số 1 không phải số nguyên tố; 9 = 3·3 là hợp số.' },
        { lam: 'Kết quả thuận lợi cho $B$: $1;\\ 4;\\ 9$ (3 kết quả). $P(B) = \\dfrac{3}{12} = \\dfrac{1}{4}$.', vi: 'Số chính phương: $1 = 1^2$, $4 = 2^2$, $9 = 3^2$. Rút gọn phân số cho gọn.' } ] },
      { de: 'Hộp có 18 viên bi cùng khối lượng và kích thước, màu đỏ hoặc vàng; số bi vàng gấp đôi số bi đỏ. Lấy ngẫu nhiên một viên. Tính xác suất lấy được bi vàng.', buoc: [
        { lam: 'Gọi $x$ là số bi đỏ thì số bi vàng là $2x$. Ta có $x + 2x = 18$, nên $3x = 18$, $x = 6$.', vi: 'Chưa biết số bi mỗi màu thì đặt ẩn rồi lập phương trình.' },
        { lam: 'Số bi vàng là $2\\cdot 6 = 12$.', vi: 'Đó là số kết quả thuận lợi.' },
        { lam: '$P = \\dfrac{12}{18} = \\dfrac{2}{3}$', vi: '18 viên bi giống nhau về kích thước nên 18 kết quả đồng khả năng.' } ] },
      { de: 'Túi có 17 viên bi cùng kích thước: 8 đỏ, 5 xanh, 4 vàng. Lấy ngẫu nhiên một viên. Tính xác suất của $E$: "Lấy được bi đỏ". Bạn Vuông nói $\\dfrac{1}{3}$, bạn Tròn nói $\\dfrac{8}{17}$. Ai đúng?', buoc: [
        { lam: 'Mỗi viên bi là một kết quả: có 17 kết quả có thể, đồng khả năng.', vi: '17 viên bi cùng kích thước, lấy ngẫu nhiên.' },
        { lam: 'Có 8 kết quả thuận lợi (8 viên đỏ), nên $P(E) = \\dfrac{8}{17}$. Bạn Tròn đúng.', vi: 'Áp dụng công thức tỉ số.' },
        { lam: 'Vuông sai vì 3 màu **không đồng khả năng**.', vi: 'Bi đỏ nhiều nhất nên dễ lấy được màu đỏ hơn màu vàng: không thể chia đều $\\frac{1}{3}$.' } ] },
      { de: 'Trên giá có 15 cuốn sách, trong đó có một số cuốn tiểu thuyết. Thủ thư đặt thêm 5 cuốn tiểu thuyết mới vào giá. Chọn ngẫu nhiên một cuốn trên giá thì xác suất được tiểu thuyết là $\\dfrac{3}{4}$. Lúc đầu có bao nhiêu cuốn tiểu thuyết?', buoc: [
        { lam: 'Sau khi thêm, giá có $15 + 5 = 20$ cuốn.', vi: 'Xác suất $\\frac{3}{4}$ là tính **sau khi** đã thêm sách.' },
        { lam: 'Số tiểu thuyết lúc này: $20 \\cdot \\dfrac{3}{4} = 15$ cuốn.', vi: 'Số thuận lợi chia cho 20 bằng $\\dfrac{3}{4}$, suy ra số thuận lợi $= 20\\cdot \\frac{3}{4}$.' },
        { lam: 'Lúc đầu có $15 - 5 = 10$ cuốn tiểu thuyết.', vi: 'Bớt đi 5 cuốn mới đặt thêm.' } ] }
    ],

    viDuMo: [
      { de: 'Gieo một con xúc xắc cân đối. Tính xác suất của biến cố "Số chấm xuất hiện chia hết cho 3".', buoc: [
        { lam: 'Có 6 kết quả có thể, đồng khả năng (xúc xắc cân đối).', vi: 'Bước 1 và bước 2.' },
        { lam: 'Kết quả thuận lợi: $3;\\ 6$ (2 kết quả).', vi: 'Bước 3.' },
        { lam: '$P = \\dfrac{2}{6} = \\dfrac{1}{3}$', vi: 'Em hãy tính xác suất:', an: true,
          dapAn: { kieu: 'so', gt: '1/3' },
          loiThuongGap: [{ gt: '1/2', giaiThich: 'Em đã chia cho số kết quả **không thuận lợi** (4). Phải chia cho **tổng** số kết quả có thể: $\\frac{2}{6}$.' }] } ] },
      { de: 'Túi có 5 viên kẹo đen, 3 viên kẹo đỏ, 7 viên kẹo trắng, giống hệt nhau trừ màu. Lấy ngẫu nhiên một viên. Tính xác suất của biến cố "Không lấy được kẹo đỏ".', buoc: [
        { lam: 'Có $5 + 3 + 7 = 15$ kết quả có thể, đồng khả năng.', vi: 'Mỗi viên kẹo là một kết quả.' },
        { lam: 'Kẹo không phải màu đỏ: $5 + 7 = 12$ viên.', vi: 'Gồm kẹo đen và kẹo trắng.' },
        { lam: '$P = \\dfrac{12}{15} = \\dfrac{4}{5}$', vi: 'Em hãy tính xác suất:', an: true,
          dapAn: { kieu: 'so', gt: '4/5' },
          loiThuongGap: [{ gt: '1/5', giaiThich: '$\\frac{3}{15} = \\frac{1}{5}$ là xác suất **lấy được** kẹo đỏ. Đề hỏi **không** lấy được kẹo đỏ.' }] } ] }
    ],

    baiTap: [
      { id: '31.1', muc: 1, de: 'Gieo một con xúc xắc cân đối. Tính xác suất của biến cố "Số chấm xuất hiện nhỏ hơn 5".',
        dapAn: { kieu: 'so', gt: '2/3' },
        goiY: ['Có 6 kết quả có thể, đồng khả năng.', 'Số chấm nhỏ hơn 5 là những số nào? (Không lấy số 5.)'],
        loiGiai: ['Kết quả thuận lợi: $1;\\ 2;\\ 3;\\ 4$ (4 kết quả).', '$P = \\dfrac{4}{6} = \\dfrac{2}{3}$'],
        loiThuongGap: [
          { gt: '5/6', giaiThich: '"Nhỏ hơn 5" không lấy số 5: chỉ có 4 kết quả thuận lợi.' },
          { gt: 2, giaiThich: 'Em lấy 4 chia cho 2 (số kết quả không thuận lợi). Xác suất không thể lớn hơn 1! Phải chia cho 6.' }] },

      { id: '31.2', muc: 1, de: 'Hộp có 20 tấm thẻ giống nhau ghi số $1;\\ 2;\\ \\dots;\\ 20$. Rút ngẫu nhiên một thẻ. Tính xác suất rút được thẻ ghi số chia hết cho 5.',
        dapAn: { kieu: 'so', gt: '1/5' },
        goiY: ['Có 20 kết quả có thể.', 'Các số chia hết cho 5 từ 1 đến 20: 5; 10; …'],
        loiGiai: ['Kết quả thuận lợi: $5;\\ 10;\\ 15;\\ 20$ (4 kết quả).', '$P = \\dfrac{4}{20} = \\dfrac{1}{5}$'],
        loiThuongGap: [{ gt: '1/4', giaiThich: 'Em đã chia 4 cho 16 (số kết quả không thuận lợi). Mẫu số phải là tổng số kết quả có thể: 20.' }] },

      { id: '31.3', muc: 1, de: 'Túi có 12 quả bóng xanh, 10 quả bóng đỏ và 8 quả bóng trắng, giống hệt nhau trừ màu. Lấy ngẫu nhiên một quả. Tính xác suất lấy được bóng xanh.',
        dapAn: { kieu: 'so', gt: '2/5' },
        goiY: ['Mỗi quả bóng là một kết quả có thể. Có bao nhiêu quả bóng?', 'Số kết quả thuận lợi là số bóng xanh.'],
        loiGiai: ['Có $12 + 10 + 8 = 30$ kết quả có thể, đồng khả năng.', '$P = \\dfrac{12}{30} = \\dfrac{2}{5}$'],
        loiThuongGap: [{ gt: '1/3', giaiThich: 'Ba màu **không** đồng khả năng (số bóng mỗi màu khác nhau). Mỗi **quả bóng** mới là một kết quả: $\\frac{12}{30}$.' }] },

      { id: '31.4', muc: 1, de: 'Công thức tính xác suất bằng tỉ số "$P(E)$ = số kết quả thuận lợi cho $E$ : tổng số kết quả có thể" chỉ dùng được khi nào?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Khi số kết quả có thể là số chẵn', 'Khi có ít nhất một kết quả thuận lợi', 'Khi các kết quả có thể là đồng khả năng', 'Khi biến cố $E$ chắc chắn xảy ra'] },
        goiY: ['Nhớ lại bước 2 trong bốn bước tính xác suất.', 'Ví dụ túi bi 8 đỏ, 5 xanh, 4 vàng: vì sao không dùng 3 màu làm 3 kết quả?'],
        loiGiai: ['Công thức chỉ dùng khi các kết quả có thể là **đồng khả năng** (khả năng xảy ra như nhau).', 'Đáp án: Khi các kết quả có thể là đồng khả năng.'] },

      { id: '31.5', muc: 2, de: 'Tấm bìa tròn chia thành 20 hình quạt như nhau, đánh số $1;\\ 2;\\ \\dots;\\ 20$, gắn vào trục quay có mũi tên cố định. Quay tấm bìa. Tính xác suất để mũi tên:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'chỉ vào số chia hết cho 3', kieu: 'so', gt: '3/10',
            loiThuongGap: [{ gt: '1/3', giaiThich: 'Từ 1 đến 20 có 6 số chia hết cho 3 (3; 6; 9; 12; 15; 18), nên $P = \\frac{6}{20}$, không phải $\\frac{1}{3}$.' }] },
          { nhan: 'chỉ vào số **không** phải số nguyên tố', kieu: 'so', gt: '3/5',
            loiThuongGap: [{ gt: '11/20', giaiThich: 'Em đã coi 1 là số nguyên tố. Từ 1 đến 20 chỉ có 8 số nguyên tố: 2; 3; 5; 7; 11; 13; 17; 19.' },
              { gt: '2/5', giaiThich: '$\\frac{8}{20}$ là xác suất chỉ vào số **nguyên tố**. Đề hỏi số **không** phải nguyên tố: $20 - 8 = 12$.' }] }] },
        goiY: ['20 hình quạt như nhau nên 20 kết quả đồng khả năng.', 'Đếm các số nguyên tố từ 1 đến 20 rồi lấy 20 trừ đi.'],
        loiGiai: ['Chia hết cho 3: $3;\\ 6;\\ 9;\\ 12;\\ 15;\\ 18$ → $P = \\dfrac{6}{20} = \\dfrac{3}{10}$.', 'Số nguyên tố: $2;\\ 3;\\ 5;\\ 7;\\ 11;\\ 13;\\ 17;\\ 19$ (8 số), nên có $20 - 8 = 12$ số không phải số nguyên tố.', '$P = \\dfrac{12}{20} = \\dfrac{3}{5}$.'] },

      { id: '31.6', muc: 2, de: 'Hộp có các tấm thẻ giống nhau ghi số $15;\\ 16;\\ \\dots;\\ 29$. Rút ngẫu nhiên một thẻ. Tính xác suất của các biến cố:',
        hinh: { widget: 'xacSuat', config: { loai: 'theSo', tu: 15, den: 29 } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$A$: "Rút được thẻ ghi số lẻ"', kieu: 'so', gt: '8/15',
            loiThuongGap: [{ gt: '4/7', giaiThich: 'Từ 15 đến 29 có $29 - 15 + 1 = 15$ thẻ, không phải 14.' }] },
          { nhan: '$B$: "Rút được thẻ ghi số nguyên tố"', kieu: 'so', gt: '4/15',
            loiThuongGap: [{ gt: '1/3', giaiThich: '$15, 21, 25, 27$ là hợp số. Số nguyên tố chỉ có $17, 19, 23, 29$.' }] }] },
        goiY: ['Đếm số thẻ: từ 15 đến 29 có bao nhiêu số? (Nhớ cộng 1.)', 'Số lẻ: 15; 17; …; 29. Số nguyên tố: thử chia cho 3, 5.'],
        loiGiai: ['Có $29 - 15 + 1 = 15$ kết quả có thể, đồng khả năng.', 'Số lẻ: $15;\\ 17;\\ 19;\\ 21;\\ 23;\\ 25;\\ 27;\\ 29$ (8 số) → $P(A) = \\dfrac{8}{15}$.', 'Số nguyên tố: $17;\\ 19;\\ 23;\\ 29$ → $P(B) = \\dfrac{4}{15}$.'] },

      { id: '31.7', muc: 2, de: 'Vòng quay may mắn chia thành 12 hình quạt như nhau: 2 ô 100 điểm, 2 ô 200 điểm, 2 ô 300 điểm, 2 ô 400 điểm, 1 ô 500 điểm, 2 ô 1 000 điểm, 1 ô 2 000 điểm. Lan quay một lần. Tính xác suất để Lan được:',
        hinh: { widget: 'xacSuat', config: { loai: 'vongQuay', tui: [
          { ten: '100', so: 2, mau: '#e03131' }, { ten: '200', so: 2, mau: '#1971c2' }, { ten: '300', so: 2, mau: '#c2255c' }, { ten: '400', so: 2, mau: '#f08c00' },
          { ten: '500', so: 1, mau: '#2f9e44' }, { ten: '1000', so: 2, mau: '#9c36b5' }, { ten: '2000', so: 1, mau: '#e8590c' }] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'ít hơn 300 điểm', kieu: 'so', gt: '1/3',
            loiThuongGap: [{ gt: '2/7', giaiThich: 'Có 7 **mức điểm** nhưng các mức không đồng khả năng. Mỗi **hình quạt** là một kết quả: 12 kết quả.' }] },
          { nhan: 'ít nhất 1 000 điểm', kieu: 'so', gt: '1/4',
            loiThuongGap: [{ gt: '1/6', giaiThich: '"Ít nhất 1 000" gồm cả 1 000 điểm (2 ô) **và** 2 000 điểm (1 ô): 3 ô.' }] }] },
        goiY: ['12 hình quạt như nhau: 12 kết quả có thể đồng khả năng.', '"Ít hơn 300" gồm 100 và 200 điểm. "Ít nhất 1 000" gồm 1 000 và 2 000 điểm.'],
        loiGiai: ['Ít hơn 300 điểm: $2 + 2 = 4$ ô → $P = \\dfrac{4}{12} = \\dfrac{1}{3}$.', 'Ít nhất 1 000 điểm: $2 + 1 = 3$ ô → $P = \\dfrac{3}{12} = \\dfrac{1}{4}$.'] },

      { id: '31.8', muc: 2, de: 'Lớp 8A có 40 học sinh, trong đó có 22 bạn nữ. Có 8 bạn nữ tham gia câu lạc bộ thể thao và 6 bạn nam **không** tham gia câu lạc bộ thể thao. Chọn ngẫu nhiên một học sinh. Tính xác suất để học sinh đó là:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'một bạn nam có tham gia câu lạc bộ', kieu: 'so', gt: '3/10',
            loiThuongGap: [{ gt: '3/20', giaiThich: '6 là số bạn nam **không** tham gia. Số nam tham gia: $18 - 6 = 12$.' }] },
          { nhan: 'một bạn không tham gia câu lạc bộ', kieu: 'so', gt: '1/2',
            loiThuongGap: [{ gt: '3/20', giaiThich: 'Còn thiếu các bạn **nữ** không tham gia: $22 - 8 = 14$ bạn. Tổng: $14 + 6 = 20$.' }] }] },
        goiY: ['Số bạn nam $= 40 - 22$.', 'Bạn không tham gia gồm nữ không tham gia và nam không tham gia.'],
        loiGiai: ['Số nam: $40 - 22 = 18$; nam tham gia: $18 - 6 = 12$ → $P = \\dfrac{12}{40} = \\dfrac{3}{10}$.', 'Nữ không tham gia: $22 - 8 = 14$; tổng không tham gia: $14 + 6 = 20$ → $P = \\dfrac{20}{40} = \\dfrac{1}{2}$.'] },

      { id: '31.9', muc: 2, de: 'Trong phòng có 16 học sinh lớp 8A (10 nam, 6 nữ) và 14 học sinh lớp 8B (8 nam, 6 nữ). Chọn ngẫu nhiên một học sinh trong phòng. Tính xác suất của các biến cố:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$E$: "Chọn được học sinh nam"', kieu: 'so', gt: '3/5',
            loiThuongGap: [{ gt: '5/8', giaiThich: 'Đây là tỉ lệ nam **trong lớp 8A**. Em phải xét cả phòng: $10 + 8 = 18$ nam trên 30 học sinh.' }] },
          { nhan: '$F$: "Chọn được học sinh nam lớp 8B"', kieu: 'so', gt: '4/15',
            loiThuongGap: [{ gt: '4/7', giaiThich: 'Chọn trong **cả phòng** (30 học sinh), nên mẫu số là 30, không phải 14.' }] },
          { nhan: '$G$: "Chọn được học sinh nữ lớp 8A"', kieu: 'so', gt: '1/5',
            loiThuongGap: [{ gt: '3/8', giaiThich: 'Mẫu số phải là cả phòng 30 học sinh, không phải 16 học sinh lớp 8A.' }] }] },
        goiY: ['Cả phòng có $16 + 14 = 30$ học sinh: 30 kết quả có thể.', 'Mẫu số luôn là 30 vì ta chọn trong cả phòng.'],
        loiGiai: ['Có 30 kết quả có thể, đồng khả năng.', '$P(E) = \\dfrac{10 + 8}{30} = \\dfrac{18}{30} = \\dfrac{3}{5}$.', '$P(F) = \\dfrac{8}{30} = \\dfrac{4}{15}$; $\\;P(G) = \\dfrac{6}{30} = \\dfrac{1}{5}$.'] },

      { id: '31.10', muc: 3, de: 'Chọn ngẫu nhiên một số tự nhiên có hai chữ số. Tính xác suất của các biến cố:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$A$: "Số được chọn nhỏ hơn 20"', kieu: 'so', gt: '1/9',
            loiThuongGap: [{ gt: '10/99', giaiThich: 'Số có hai chữ số là từ 10 đến 99: có **90** số, không phải 99.' }] },
          { nhan: '$B$: "Số được chọn là số chính phương"', kieu: 'so', gt: '1/15',
            loiThuongGap: [{ gt: '1/10', giaiThich: 'Chỉ đếm số chính phương **có hai chữ số**: 16; 25; 36; 49; 64; 81 (6 số), không tính 1; 4; 9.' }] }] },
        goiY: ['Từ 10 đến 99 có bao nhiêu số?', 'Số chính phương có hai chữ số: $4^2, 5^2, \\dots, 9^2$.'],
        loiGiai: ['Có $99 - 10 + 1 = 90$ kết quả có thể, đồng khả năng.', '$A$: $10;\\ 11;\\ \\dots;\\ 19$ (10 số) → $P(A) = \\dfrac{10}{90} = \\dfrac{1}{9}$.', '$B$: $16;\\ 25;\\ 36;\\ 49;\\ 64;\\ 81$ → $P(B) = \\dfrac{6}{90} = \\dfrac{1}{15}$.'] },

      { id: '31.11', muc: 3, de: 'Hộp có 24 viên bi cùng kích thước, chỉ có màu đỏ và màu vàng; số bi vàng **gấp ba** số bi đỏ. Lấy ngẫu nhiên một viên. Tính xác suất lấy được bi đỏ.',
        dapAn: { kieu: 'so', gt: '1/4' },
        goiY: ['Gọi $x$ là số bi đỏ thì số bi vàng là $3x$.', 'Giải $x + 3x = 24$.'],
        loiGiai: ['Gọi $x$ là số bi đỏ: $x + 3x = 24$, $4x = 24$, $x = 6$.', 'Có 24 kết quả đồng khả năng, 6 kết quả thuận lợi.', '$P = \\dfrac{6}{24} = \\dfrac{1}{4}$'],
        loiThuongGap: [
          { gt: '1/3', giaiThich: 'Số bi đỏ không phải $24 : 3 = 8$. Bi đỏ là $x$, bi vàng là $3x$, nên $4x = 24$, $x = 6$.' },
          { gt: '3/4', giaiThich: 'Đó là xác suất lấy được bi **vàng**. Đề hỏi bi đỏ.' }] },

      { id: '31.12', muc: 3, de: 'Trên kệ có 12 cuốn truyện, trong đó có một số cuốn truyện tranh. Cô thủ thư đặt thêm 4 cuốn truyện tranh lên kệ. Bạn An chọn ngẫu nhiên một cuốn trên kệ; xác suất chọn được truyện tranh là $\\dfrac{5}{8}$. Hỏi lúc đầu trên kệ có bao nhiêu cuốn truyện tranh?',
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Sau khi thêm, kệ có bao nhiêu cuốn?', 'Số truyện tranh lúc sau = tổng số cuốn $\\times \\dfrac{5}{8}$. Rồi bớt đi 4 cuốn mới thêm.'],
        loiGiai: ['Sau khi thêm, kệ có $12 + 4 = 16$ cuốn.', 'Số truyện tranh lúc sau: $16 \\cdot \\dfrac{5}{8} = 10$ cuốn.', 'Lúc đầu: $10 - 4 = 6$'],
        loiThuongGap: [
          { gt: 10, giaiThich: '10 là số truyện tranh **sau khi** thêm. Lúc đầu phải bớt 4 cuốn: $10 - 4 = 6$.' },
          { gt: 3.5, giaiThich: 'Xác suất $\\frac{5}{8}$ tính trên **16** cuốn (sau khi thêm), không phải 12 cuốn.' }] }
    ],

    timLoi: [
      { de: 'Túi có 17 viên bi cùng kích thước: 8 đỏ, 5 xanh, 4 vàng. Bạn Vuông tính xác suất lấy được bi đỏ như sau. Dòng nào sai?',
        loiGiaiSai: ['Bi trong túi có 3 màu: đỏ, xanh, vàng.', 'Vậy có 3 kết quả có thể, trong đó có 1 kết quả thuận lợi là "màu đỏ".', 'Xác suất lấy được bi đỏ là $\\dfrac{1}{3}$.'],
        dongSai: 1, giaiThich: 'Ba màu **không đồng khả năng** (bi đỏ nhiều hơn hẳn) nên không dùng được công thức tỉ số với 3 kết quả này. Phải coi mỗi viên bi là một kết quả: 17 kết quả đồng khả năng.', sua: 'Có 17 kết quả có thể đồng khả năng (17 viên bi), 8 kết quả thuận lợi, nên xác suất lấy được bi đỏ là $\\dfrac{8}{17}$.' },
      { de: 'Hộp có 12 thẻ ghi số $1;\\ 2;\\ \\dots;\\ 12$. Bạn Hoa tính xác suất rút được thẻ ghi số lẻ như sau. Dòng nào sai?',
        loiGiaiSai: ['Các số lẻ: $1;\\ 3;\\ 5;\\ 7;\\ 9;\\ 11$ → 6 kết quả thuận lợi.', 'Các số chẵn: 6 kết quả không thuận lợi.', '$P = \\dfrac{6}{6} = 1$.'],
        dongSai: 2, giaiThich: 'Mẫu số phải là **tổng số kết quả có thể** (12), không phải số kết quả không thuận lợi. Xác suất bằng 1 nghĩa là chắc chắn xảy ra, vô lí vì có thể rút được số chẵn.', sua: '$P = \\dfrac{6}{12} = \\dfrac{1}{2}$.' }
    ]
  });
})();
