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

  // ---------- Cấu hình hình cho "Nhìn là hiểu": mỗi kết quả là một chấm; thanh xác suất 1 chia đều cho các chấm ----------
  function lk(tuyChon, them) { return Object.assign({ ten: 'luoiKetQua', tuyChon: Object.assign({ cheDo: 'chia' }, tuyChon) }, them); }
  // Hình lời giải: số đáp án chỉ hiện khi em đã xem lời giải (cảnh sang trạng thái giai)
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c, { tuyChon: Object.assign({ anSo: true }, c.tuyChon) }) }; }
  function g(ten, so, mau, nhan) { return { ten: ten, so: so, mau: mau, nhan: nhan }; }
  var BONG = [g('Xanh', 12, '#1971c2'), g('Đỏ', 10, '#e03131'), g('Trắng', 8, '#868e96')];
  var DIEM = ['100', '200', '300', '400', '500', '1000', '2000'].map(function (d, i) { return g(d, [2, 2, 2, 2, 1, 2, 1][i], ['#e03131', '#1971c2', '#c2255c', '#f08c00', '#2f9e44', '#9c36b5', '#e8590c'][i], d === '1000' ? '1k' : d === '2000' ? '2k' : d); });
  var PHONG = [g('8A nam', 10, '#1971c2'), g('8A nữ', 6, '#c2255c'), g('8B nam', 8, '#0c8599'), g('8B nữ', 6, '#9c36b5')];
  var NT20 = [2, 3, 5, 7, 11, 13, 17, 19];
  function khongNT(a, b) { var r = []; for (var i = a; i <= b; i++) if (NT20.indexOf(i) < 0) r.push(i); return r; }
  function the(a, b, bienCo, them) { return lk(Object.assign({ loai: 'theSo', tu: a, den: b, bienCo: bienCo }, them)); }
  var VONG12 = function (them) { return the(1, 12, [{ ten: 'A: Chỉ vào số nguyên tố', thuanLoi: [2, 3, 5, 7, 11] }, { ten: 'B: Chỉ vào số chính phương', thuanLoi: [1, 4, 9] }], Object.assign({ cot: 6 }, them)); };
  function soBatKi(v) {
    if (v > 1) return { thamSo: { thu: v }, t: 1, loi: 'Xác suất không lớn hơn $1$: cả thanh chỉ dài $1$.' };
    return { thamSo: { thu: v }, t: 1, loi: 'Vạch đỏ là số em gõ, chưa trùng chỗ phần sáng kết thúc. Đếm số chấm sáng và **tổng** số chấm rồi lập tỉ số.' };
  }

  TOAN8.bai({
    id: 31, ten: 'Cách tính xác suất của biến cố bằng tỉ số', sgk: { tap: 2, trang: 63 },

    nhin: {
      tieuDe: 'Chia đều thanh xác suất cho các chấm, rồi lấy phần sáng', loai: 'chungMinh',
      luuY: 'Lập luận dựa trên hai điều: các kết quả **đồng khả năng** nên phần của mọi chấm bằng nhau; xác suất của một biến cố là tổng phần của các chấm làm nó xảy ra. Công thức chỉ đúng khi có điều kiện đồng khả năng. Nếu coi ba màu bi là ba kết quả trong khi số bi mỗi màu khác nhau, các phần không còn bằng nhau và công thức cho số sai.',
      canh: Object.assign(VONG12({ tenBienCo: 'A: Chỉ vào số nguyên tố', bienCo: [{ ten: 'A: Chỉ vào số nguyên tố', thuanLoi: [2, 3, 5, 7, 11] }] }), { thuPha: true }),
      buoc: [
        { t: 0, chu: 'Tấm bìa có $12$ hình quạt **như nhau**, đánh số $1$ đến $12$. Mỗi hình quạt là một chấm. Các hình quạt như nhau nên $\\cb{12}$ kết quả **đồng khả năng**: không ô nào dễ trúng hơn ô nào.' },
        { t: 0.08, chu: 'Chắc chắn mũi tên chỉ vào một ô nào đó, nên cả thanh là xác suất $1$. Các chấm có khả năng như nhau nên chia **đều** thanh: mỗi chấm được $\\frac{1}{12}$.' },
        { t: 0.47, chu: 'Biến cố $A$: "Mũi tên chỉ vào số nguyên tố". Các chấm $2, 3, 5, 7, 11$ sáng lên, cùng với phần của chúng trên thanh.' },
        { t: 0.66, chu: 'Dồn các phần sáng về đầu thanh: $\\cc{5}$ phần, mỗi phần $\\frac{1}{12}$. Phần sáng dài $\\frac{5}{12}$ cả thanh. Mỗi lần quay, mũi tên chỉ vào đúng một ô. $A$ xảy ra khi mũi tên chỉ vào một trong $5$ ô sáng, nên xác suất của $A$ là tổng $5$ phần đó.' }
      ],
      ketLuan: 'Xác suất của $A$ là phần sáng của thanh: $P(A) = \\dfrac{\\cc{5}}{\\cb{12}}$. Tổng quát, có $\\cb{n}$ kết quả **đồng khả năng**, trong đó $\\cc{m}$ kết quả thuận lợi cho $E$ thì $$P(E) = \\dfrac{\\cc{m}}{\\cb{n}}$$',
      dung: {
        tieuDe: 'Xác suất lấy được bóng xanh là bao nhiêu?', tuBai: '31.3',
        canh: lk({ nhom: BONG, nhomThuan: ['Xanh'], tenBienCo: 'Lấy được bóng xanh', gom: true, anSo: true },
          { t: 0.45, moTa: 'Ba mươi quả bóng, mỗi quả một chấm, xếp theo màu. Bên dưới là thanh dài 1 chia đều cho các chấm.' }),
        moiThu: 'Mỗi quả bóng là một chấm, cả thanh dài $1$ chia đều cho các chấm. Gõ xác suất. Nếu sai, hình vẽ đúng số em gõ để em so.',
        phanUng: [
          { gt: '1/3', trangThai: 'theoLoai', t: 1, loi: 'Em đã coi ba **màu** là ba kết quả đồng khả năng, mỗi màu $\\frac13$. Nhìn thanh dưới: chia theo màu thì không khớp với số bóng. Mỗi **quả** mới có phần bằng nhau, mà bóng xanh có tới $12$ quả.' },
          { gt: '12/18', trangThai: 'chiaKhong', t: 1, loi: 'Em chia $12$ cho $18$ chấm **không sáng** (viền đỏ). Mẫu số là **tất cả** các chấm, kể cả chấm sáng.' },
          { gt: 12, thamSo: { thu: 12 }, t: 1, loi: '$12$ là **số** chấm sáng. Xác suất là **phần** của thanh: số chấm sáng chia cho tổng số chấm.' }
        ],
        soBatKi: soBatKi,
        dungChu: 'Có $12 + 10 + 8 = 30$ chấm, $12$ chấm sáng: $P = \\frac{12}{30} = \\frac{2}{5}$.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là phần sáng của thanh',
        baDe: [
          { tuBai: '31.2', canh: the(1, 20, [{ ten: 'Chia hết cho 5', thuanLoi: [5, 10, 15, 20] }], { cot: 10, anSo: true }), tenNut: 'Chia thanh xác suất',
            phanUng: [{ gt: '1/4', trangThai: 'chiaKhong', loi: 'Em chia $4$ cho $16$ chấm **không sáng** (viền đỏ). Mẫu số là **tất cả** $20$ chấm.' }],
            dungChu: '$4$ chấm sáng trên $20$ chấm: $\\frac{4}{20} = \\frac{1}{5}$.', saiChu: 'Đếm chấm sáng rồi chia cho **tất cả** $20$ chấm.' },
          { tuBai: '31.7', canh: lk({ nhom: DIEM, nhomThuan: ['100', '200'], tenBienCo: 'Ít hơn 300 điểm', gom: true, anSo: true, cot: 6 }, { ghiChu: '1k là 1 000 điểm, 2k là 2 000 điểm.' }), tenNut: 'Tách từng hình quạt',
            de: 'Vòng quay may mắn chia thành 12 hình quạt như nhau: 2 ô 100 điểm, 2 ô 200 điểm, 2 ô 300 điểm, 2 ô 400 điểm, 1 ô 500 điểm, 2 ô 1 000 điểm, 1 ô 2 000 điểm. Lan quay một lần. Tính xác suất để Lan được ít hơn 300 điểm.',
            dapAn: { kieu: 'so', gt: '1/3' }, goiY: ['Mỗi **hình quạt** là một kết quả, không phải mỗi mức điểm.'], loiGiai: ['Có $12$ kết quả đồng khả năng. Ít hơn 300 điểm: $2 + 2 = 4$ ô.', '$P = \\dfrac{4}{12} = \\dfrac{1}{3}$'],
            loiThuongGap: [],
            phanUng: [{ gt: '2/7', trangThai: 'theoLoai', loi: 'Em coi $7$ **mức điểm** là $7$ kết quả đồng khả năng. Nhưng các mức có số ô khác nhau; mỗi **hình quạt** mới là một kết quả.' }],
            dungChu: '$4$ ô sáng trên $12$ ô: $\\frac{4}{12} = \\frac13$.', saiChu: 'Tách mỗi mức điểm thành từng hình quạt, rồi chia thanh cho cả $12$ ô.' },
          { tuBai: '31.9', canh: lk({ nhom: PHONG, nhomThuan: ['8B nam'], tenBienCo: 'Nam lớp 8B', gom: true, anSo: true }), tenNut: 'Tách từng bạn',
            de: 'Trong phòng có 16 học sinh lớp 8A (10 nam, 6 nữ) và 14 học sinh lớp 8B (8 nam, 6 nữ). Chọn ngẫu nhiên một học sinh trong phòng. Tính xác suất chọn được học sinh nam lớp 8B.',
            dapAn: { kieu: 'so', gt: '4/15' }, goiY: ['Chọn trong **cả phòng**: có bao nhiêu chấm?'], loiGiai: ['Có $30$ kết quả đồng khả năng, $8$ kết quả thuận lợi.', '$P = \\dfrac{8}{30} = \\dfrac{4}{15}$'],
            loiThuongGap: [],
            phanUng: [{ gt: '4/7', loi: '$\\frac{8}{14}$ là tỉ lệ trong riêng lớp 8B. Nhưng ta chọn trong **cả phòng**: thanh chia cho tất cả $30$ chấm.' }],
            dungChu: '$8$ chấm sáng trên $30$ chấm: $\\frac{8}{30} = \\frac{4}{15}$.', saiChu: 'Mẫu số là số học sinh **cả phòng**: $16 + 14 = 30$.' }
        ],
        cachNhan: 'Đề nào cũng vậy: mỗi vật (mỗi thẻ, mỗi hình quạt, mỗi bạn) là một chấm đồng khả năng. Chia đều thanh cho **tất cả** các chấm rồi lấy phần sáng. Đừng chia theo loại.'
      }
    },

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

    mucTieu: [
      'Tính xác suất bằng tỉ số $\\frac{m}{n}$: đếm kết quả thuận lợi, đếm tổng kết quả có thể.',
      'Kiểm điều kiện đồng khả năng trước khi dùng công thức (thẻ giống nhau, ô bằng nhau, xúc xắc cân đối).',
      'Nói được vì sao công thức sai khi các kết quả không đồng khả năng, ví dụ vòng quay có ô to ô nhỏ.',
      'Nhận ra lỗi coi mỗi màu hay mỗi loại là một kết quả, và sửa bằng cách coi mỗi vật là một kết quả.',
      'Rút gọn và kiểm kết quả: xác suất luôn nằm trong khoảng từ $0$ đến $1$.'
    ],
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: 'Công thức tính xác suất',
        noiDung: 'Giả thiết rằng các kết quả có thể của một hành động hay thực nghiệm là **đồng khả năng**. Khi đó xác suất của biến cố $E$, kí hiệu $P(E)$, bằng tỉ số giữa số kết quả thuận lợi cho $E$ và tổng số kết quả có thể:\n\n$P(E)$ = **Số kết quả thuận lợi cho $E$ : Tổng số kết quả có thể**.\n\nNếu có $\\cb{n}$ kết quả có thể (đồng khả năng), trong đó có $\\cc{m}$ kết quả thuận lợi cho $E$ thì $$P(E) = \\dfrac{\\cc{m}}{\\cb{n}}.$$' },
      { loai: 'lapCM', tieuDe: 'Lắp lập luận: vì sao $P(E) = \\dfrac{m}{n}$?', config: {
        de: 'Xếp các ý theo đúng thứ tự lập luận, ví dụ với vòng quay $12$ ô và biến cố "chỉ vào số nguyên tố". Ý nào chưa đủ căn cứ, máy sẽ nói còn thiếu ý nào.',
        canh: VONG12({ tenBienCo: 'A: Chỉ vào số nguyên tố', bienCo: [{ ten: 'A: Chỉ vào số nguyên tố', thuanLoi: [2, 3, 5, 7, 11] }] }),
        buoc: [
          { id: 'dk', chu: 'Có $n$ kết quả có thể, và chúng **đồng khả năng**: không kết quả nào dễ xảy ra hơn kết quả nào.', canh: { t: 0 } },
          { id: 'chac', chu: 'Mỗi lần thử chắc chắn xảy ra đúng một trong $n$ kết quả, nên cả $n$ phần gộp lại là xác suất $1$.', canh: { t: 0.3 } },
          { id: 'deu', chu: 'Các kết quả có khả năng như nhau nên phần của chúng bằng nhau: mỗi kết quả được $\\frac{1}{n}$.', can: ['dk', 'chac'], canh: { t: 0.42 } },
          { id: 'thuan', chu: 'Biến cố $E$ có $m$ kết quả thuận lợi.', canh: { t: 0.6 } },
          { id: 'tong', chu: '$E$ xảy ra đúng khi xảy ra một trong $m$ kết quả đó, nên xác suất của $E$ là tổng $m$ phần của chúng.', can: ['thuan'], canh: { t: 0.84 } },
          { id: 'kl', chu: 'Vậy $P(E) = m \\cdot \\frac{1}{n} = \\frac{m}{n}$.', can: ['deu', 'tong'], canh: { t: 1 } }
        ],
        ketLuan: 'Mỗi kết quả một phần $\\frac{1}{n}$, biến cố lấy $m$ phần: $P(E) = \\frac{m}{n}$. Thiếu điều kiện đồng khả năng thì các phần không bằng nhau và công thức có thể cho số sai.'
      } },
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
      { de: 'Tấm bìa tròn chia thành 12 hình quạt như nhau đánh số $1;\\ 2;\\ \\dots;\\ 12$. Quay tấm bìa. Tính xác suất của $A$: "Mũi tên chỉ vào số nguyên tố" và $B$: "Mũi tên chỉ vào số chính phương".', canh: VONG12(), buoc: [
        { lam: 'Có 12 kết quả có thể: $1;\\ 2;\\ \\dots;\\ 12$, đồng khả năng.', vi: '12 hình quạt **như nhau** nên mũi tên dừng ở hình quạt nào cũng có khả năng như nhau.', canh: { t: 0.3 } },
        { lam: 'Kết quả thuận lợi cho $A$: $2;\\ 3;\\ 5;\\ 7;\\ 11$ (5 kết quả). $P(A) = \\dfrac{5}{12}$.', vi: 'Số 1 không phải số nguyên tố; 9 = 3·3 là hợp số.', canh: { t: 1, thamSo: { chon: 0 } } },
        { lam: 'Kết quả thuận lợi cho $B$: $1;\\ 4;\\ 9$ (3 kết quả). $P(B) = \\dfrac{3}{12} = \\dfrac{1}{4}$.', vi: 'Số chính phương: $1 = 1^2$, $4 = 2^2$, $9 = 3^2$. Rút gọn phân số cho gọn.', canh: { t: 1, thamSo: { chon: 1 } } } ] },
      { de: 'Hộp có 18 viên bi cùng khối lượng và kích thước, màu đỏ hoặc vàng; số bi vàng gấp đôi số bi đỏ. Lấy ngẫu nhiên một viên. Tính xác suất lấy được bi vàng.', canh: lk({ nhom: [g('Đỏ', 6, '#e03131'), g('Vàng', 12, '#f08c00')], nhomThuan: ['Vàng'], tenBienCo: 'Lấy được bi vàng', gom: true }), buoc: [
        { lam: 'Gọi $x$ là số bi đỏ thì số bi vàng là $2x$. Ta có $x + 2x = 18$, nên $3x = 18$, $x = 6$.', vi: 'Chưa biết số bi mỗi màu thì đặt ẩn rồi lập phương trình.', canh: { t: 0.3 } },
        { lam: 'Số bi vàng là $2\\cdot 6 = 12$.', vi: 'Đó là số kết quả thuận lợi.', canh: { t: 0.62 } },
        { lam: '$P = \\dfrac{12}{18} = \\dfrac{2}{3}$', vi: '18 viên bi giống nhau về kích thước nên 18 kết quả đồng khả năng.', canh: { t: 1 } } ] },
      { de: 'Túi có 17 viên bi cùng kích thước: 8 đỏ, 5 xanh, 4 vàng. Lấy ngẫu nhiên một viên. Tính xác suất của $E$: "Lấy được bi đỏ". Bạn Vuông nói $\\dfrac{1}{3}$, bạn Tròn nói $\\dfrac{8}{17}$. Ai đúng?', canh: lk({ nhom: [g('Đỏ', 8, '#e03131'), g('Xanh', 5, '#1971c2'), g('Vàng', 4, '#f08c00')], nhomThuan: ['Đỏ'], tenBienCo: 'E: Lấy được bi đỏ', gom: true }), buoc: [
        { lam: 'Mỗi viên bi là một kết quả: có 17 kết quả có thể, đồng khả năng.', vi: '17 viên bi cùng kích thước, lấy ngẫu nhiên.', canh: { t: 0.45 } },
        { lam: 'Có 8 kết quả thuận lợi (8 viên đỏ), nên $P(E) = \\dfrac{8}{17}$. Bạn Tròn đúng.', vi: 'Áp dụng công thức tỉ số.', canh: { t: 1 } },
        { lam: 'Vuông sai vì 3 màu **không đồng khả năng**.', vi: 'Bi đỏ nhiều nhất nên dễ lấy được màu đỏ hơn màu vàng: không thể chia đều $\\frac{1}{3}$.', canh: { t: 1, trangThai: 'theoLoai' } } ] },
      { de: 'Trên giá có 15 cuốn sách, trong đó có một số cuốn tiểu thuyết. Thủ thư đặt thêm 5 cuốn tiểu thuyết mới vào giá. Chọn ngẫu nhiên một cuốn trên giá thì xác suất được tiểu thuyết là $\\dfrac{3}{4}$. Lúc đầu có bao nhiêu cuốn tiểu thuyết?', canh: lk({ nhom: [{ ten: 'Tiểu thuyết', so: 15, mau: '#1971c2', danhDau: { so: 5, chu: 'Viền cam: 5 cuốn mới đặt thêm' } }, g('Sách khác', 5, '#868e96')], nhomThuan: ['Tiểu thuyết'], tenBienCo: 'Chọn được tiểu thuyết' }), buoc: [
        { lam: 'Sau khi thêm, giá có $15 + 5 = 20$ cuốn.', vi: 'Xác suất $\\frac{3}{4}$ là tính **sau khi** đã thêm sách.', canh: { t: 0.45 } },
        { lam: 'Số tiểu thuyết lúc này: $20 \\cdot \\dfrac{3}{4} = 15$ cuốn.', vi: 'Số thuận lợi chia cho 20 bằng $\\dfrac{3}{4}$, suy ra số thuận lợi $= 20\\cdot \\frac{3}{4}$.', canh: { t: 1 } },
        { lam: 'Lúc đầu có $15 - 5 = 10$ cuốn tiểu thuyết.', vi: 'Bớt đi 5 cuốn mới đặt thêm.', canh: { t: 1, thamSo: { danhDau: true } } } ] }
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
      { id: '31.1', hinhGiai: hg(lk({ loai: 'xucXac', thuanLoi: [1, 2, 3, 4], tenBienCo: 'Số chấm nhỏ hơn 5' })), muc: 1, de: 'Gieo một con xúc xắc cân đối. Tính xác suất của biến cố "Số chấm xuất hiện nhỏ hơn 5".',
        dapAn: { kieu: 'so', gt: '2/3' },
        goiY: ['Có 6 kết quả có thể, đồng khả năng.', 'Số chấm nhỏ hơn 5 là những số nào? (Không lấy số 5.)'],
        loiGiai: ['Kết quả thuận lợi: $1;\\ 2;\\ 3;\\ 4$ (4 kết quả).', '$P = \\dfrac{4}{6} = \\dfrac{2}{3}$'],
        loiThuongGap: [
          { gt: '5/6', giaiThich: '"Nhỏ hơn 5" không lấy số 5: chỉ có 4 kết quả thuận lợi.' },
          { gt: 2, giaiThich: 'Em lấy 4 chia cho 2 (số kết quả không thuận lợi). Xác suất không thể lớn hơn 1! Phải chia cho 6.' }] },

      { id: '31.2', hinhGiai: hg(the(1, 20, [{ ten: 'Chia hết cho 5', thuanLoi: [5, 10, 15, 20] }], { cot: 10 })), muc: 1, de: 'Hộp có 20 tấm thẻ giống nhau ghi số $1;\\ 2;\\ \\dots;\\ 20$. Rút ngẫu nhiên một thẻ. Tính xác suất rút được thẻ ghi số chia hết cho 5.',
        dapAn: { kieu: 'so', gt: '1/5' },
        goiY: ['Có 20 kết quả có thể.', 'Các số chia hết cho 5 từ 1 đến 20: 5; 10; …'],
        loiGiai: ['Kết quả thuận lợi: $5;\\ 10;\\ 15;\\ 20$ (4 kết quả).', '$P = \\dfrac{4}{20} = \\dfrac{1}{5}$'],
        loiThuongGap: [{ gt: '1/4', giaiThich: 'Em đã chia 4 cho 16 (số kết quả không thuận lợi). Mẫu số phải là tổng số kết quả có thể: 20.' }] },

      { id: '31.3', hinhGiai: hg(lk({ nhom: BONG, nhomThuan: ['Xanh'], tenBienCo: 'Lấy được bóng xanh' })), muc: 1, de: 'Túi có 12 quả bóng xanh, 10 quả bóng đỏ và 8 quả bóng trắng, giống hệt nhau trừ màu. Lấy ngẫu nhiên một quả. Tính xác suất lấy được bóng xanh.',
        dapAn: { kieu: 'so', gt: '2/5' },
        goiY: ['Mỗi quả bóng là một kết quả có thể. Có bao nhiêu quả bóng?', 'Số kết quả thuận lợi là số bóng xanh.'],
        loiGiai: ['Có $12 + 10 + 8 = 30$ kết quả có thể, đồng khả năng.', '$P = \\dfrac{12}{30} = \\dfrac{2}{5}$'],
        loiThuongGap: [{ gt: '1/3', giaiThich: 'Ba màu **không** đồng khả năng (số bóng mỗi màu khác nhau). Mỗi **quả bóng** mới là một kết quả: $\\frac{12}{30}$.' }] },

      { id: '31.4', khongHinh: 'Câu hỏi lí thuyết về điều kiện đồng khả năng; phần Nhìn đã cho thấy vì sao cần điều kiện này.', muc: 1, de: 'Công thức tính xác suất bằng tỉ số "$P(E)$ = số kết quả thuận lợi cho $E$ : tổng số kết quả có thể" chỉ dùng được khi nào?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Khi số kết quả có thể là số chẵn', 'Khi có ít nhất một kết quả thuận lợi', 'Khi các kết quả có thể là đồng khả năng', 'Khi biến cố $E$ chắc chắn xảy ra'] },
        goiY: ['Nhớ lại bước 2 trong bốn bước tính xác suất.', 'Ví dụ túi bi 8 đỏ, 5 xanh, 4 vàng: vì sao không dùng 3 màu làm 3 kết quả?'],
        loiGiai: ['Công thức chỉ dùng khi các kết quả có thể là **đồng khả năng** (khả năng xảy ra như nhau).', 'Đáp án: Khi các kết quả có thể là đồng khả năng.'] },

      { id: '31.5', hinhGiai: hg(Object.assign(the(1, 20, [{ ten: 'Chia hết cho 3', thuanLoi: [3, 6, 9, 12, 15, 18] }, { ten: 'Không phải số nguyên tố (có cả số 1)', thuanLoi: khongNT(1, 20) }], { cot: 10 }), { thamSo: { chon: 1 } })), muc: 2, de: 'Tấm bìa tròn chia thành 20 hình quạt như nhau, đánh số $1;\\ 2;\\ \\dots;\\ 20$, gắn vào trục quay có mũi tên cố định. Quay tấm bìa. Tính xác suất để mũi tên:',
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

      { id: '31.8', hinhGiai: hg(lk({ nhom: [g('Nữ, có CLB', 8, '#c2255c'), g('Nữ, không CLB', 14, '#e8590c'), g('Nam, có CLB', 12, '#1971c2'), g('Nam, không CLB', 6, '#0c8599')], nhomThuan: ['Nam, có CLB'], tenBienCo: 'Bạn nam có tham gia câu lạc bộ' })), muc: 2, de: 'Lớp 8A có 40 học sinh, trong đó có 22 bạn nữ. Có 8 bạn nữ tham gia câu lạc bộ thể thao và 6 bạn nam **không** tham gia câu lạc bộ thể thao. Chọn ngẫu nhiên một học sinh. Tính xác suất để học sinh đó là:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'một bạn nam có tham gia câu lạc bộ', kieu: 'so', gt: '3/10',
            loiThuongGap: [{ gt: '3/20', giaiThich: '6 là số bạn nam **không** tham gia. Số nam tham gia: $18 - 6 = 12$.' }] },
          { nhan: 'một bạn không tham gia câu lạc bộ', kieu: 'so', gt: '1/2',
            loiThuongGap: [{ gt: '3/20', giaiThich: 'Còn thiếu các bạn **nữ** không tham gia: $22 - 8 = 14$ bạn. Tổng: $14 + 6 = 20$.' }] }] },
        goiY: ['Số bạn nam $= 40 - 22$.', 'Bạn không tham gia gồm nữ không tham gia và nam không tham gia.'],
        loiGiai: ['Số nam: $40 - 22 = 18$; nam tham gia: $18 - 6 = 12$ → $P = \\dfrac{12}{40} = \\dfrac{3}{10}$.', 'Nữ không tham gia: $22 - 8 = 14$; tổng không tham gia: $14 + 6 = 20$ → $P = \\dfrac{20}{40} = \\dfrac{1}{2}$.'] },

      { id: '31.9', hinhGiai: hg(lk({ nhom: PHONG, bienCo: [{ ten: 'E: Học sinh nam', nhom: ['8A nam', '8B nam'] }, { ten: 'F: Nam lớp 8B', nhom: ['8B nam'] }, { ten: 'G: Nữ lớp 8A', nhom: ['8A nữ'] }] })), muc: 2, de: 'Trong phòng có 16 học sinh lớp 8A (10 nam, 6 nữ) và 14 học sinh lớp 8B (8 nam, 6 nữ). Chọn ngẫu nhiên một học sinh trong phòng. Tính xác suất của các biến cố:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$E$: "Chọn được học sinh nam"', kieu: 'so', gt: '3/5',
            loiThuongGap: [{ gt: '5/8', giaiThich: 'Đây là tỉ lệ nam **trong lớp 8A**. Em phải xét cả phòng: $10 + 8 = 18$ nam trên 30 học sinh.' }] },
          { nhan: '$F$: "Chọn được học sinh nam lớp 8B"', kieu: 'so', gt: '4/15',
            loiThuongGap: [{ gt: '4/7', giaiThich: 'Chọn trong **cả phòng** (30 học sinh), nên mẫu số là 30, không phải 14.' }] },
          { nhan: '$G$: "Chọn được học sinh nữ lớp 8A"', kieu: 'so', gt: '1/5',
            loiThuongGap: [{ gt: '3/8', giaiThich: 'Mẫu số phải là cả phòng 30 học sinh, không phải 16 học sinh lớp 8A.' }] }] },
        goiY: ['Cả phòng có $16 + 14 = 30$ học sinh: 30 kết quả có thể.', 'Mẫu số luôn là 30 vì ta chọn trong cả phòng.'],
        loiGiai: ['Có 30 kết quả có thể, đồng khả năng.', '$P(E) = \\dfrac{10 + 8}{30} = \\dfrac{18}{30} = \\dfrac{3}{5}$.', '$P(F) = \\dfrac{8}{30} = \\dfrac{4}{15}$; $\\;P(G) = \\dfrac{6}{30} = \\dfrac{1}{5}$.'] },

      { id: '31.10', hinhGiai: hg(the(10, 99, [{ ten: 'A: Số nhỏ hơn 20', thuanLoi: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] }, { ten: 'B: Số chính phương', thuanLoi: [16, 25, 36, 49, 64, 81] }])), muc: 3, de: 'Chọn ngẫu nhiên một số tự nhiên có hai chữ số. Tính xác suất của các biến cố:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$A$: "Số được chọn nhỏ hơn 20"', kieu: 'so', gt: '1/9',
            loiThuongGap: [{ gt: '10/99', giaiThich: 'Số có hai chữ số là từ 10 đến 99: có **90** số, không phải 99.' }] },
          { nhan: '$B$: "Số được chọn là số chính phương"', kieu: 'so', gt: '1/15',
            loiThuongGap: [{ gt: '1/10', giaiThich: 'Chỉ đếm số chính phương **có hai chữ số**: 16; 25; 36; 49; 64; 81 (6 số), không tính 1; 4; 9.' }] }] },
        goiY: ['Từ 10 đến 99 có bao nhiêu số?', 'Số chính phương có hai chữ số: $4^2, 5^2, \\dots, 9^2$.'],
        loiGiai: ['Có $99 - 10 + 1 = 90$ kết quả có thể, đồng khả năng.', '$A$: $10;\\ 11;\\ \\dots;\\ 19$ (10 số) → $P(A) = \\dfrac{10}{90} = \\dfrac{1}{9}$.', '$B$: $16;\\ 25;\\ 36;\\ 49;\\ 64;\\ 81$ → $P(B) = \\dfrac{6}{90} = \\dfrac{1}{15}$.'] },

      { id: '31.11', hinhGiai: hg(lk({ nhom: [g('Đỏ', 6, '#e03131'), g('Vàng', 18, '#f08c00')], nhomThuan: ['Đỏ'], tenBienCo: 'Lấy được bi đỏ' })), muc: 3, de: 'Hộp có 24 viên bi cùng kích thước, chỉ có màu đỏ và màu vàng; số bi vàng **gấp ba** số bi đỏ. Lấy ngẫu nhiên một viên. Tính xác suất lấy được bi đỏ.',
        dapAn: { kieu: 'so', gt: '1/4' },
        goiY: ['Gọi $x$ là số bi đỏ thì số bi vàng là $3x$.', 'Giải $x + 3x = 24$.'],
        loiGiai: ['Gọi $x$ là số bi đỏ: $x + 3x = 24$, $4x = 24$, $x = 6$.', 'Có 24 kết quả đồng khả năng, 6 kết quả thuận lợi.', '$P = \\dfrac{6}{24} = \\dfrac{1}{4}$'],
        loiThuongGap: [
          { gt: '1/3', giaiThich: 'Số bi đỏ không phải $24 : 3 = 8$. Bi đỏ là $x$, bi vàng là $3x$, nên $4x = 24$, $x = 6$.' },
          { gt: '3/4', giaiThich: 'Đó là xác suất lấy được bi **vàng**. Đề hỏi bi đỏ.' }] },

      { id: '31.12', hinhGiai: hg(lk({ nhom: [g('Truyện tranh cũ', 6, '#1971c2'), g('Truyện tranh mới', 4, '#0c8599'), g('Truyện khác', 6, '#868e96')], nhomThuan: ['Truyện tranh cũ', 'Truyện tranh mới'], tenBienCo: 'Chọn được truyện tranh' }, { ghiChu: '16 · 5/8 = 10 truyện tranh lúc sau; bớt 4 cuốn mới.' })), muc: 3, de: 'Trên kệ có 12 cuốn truyện, trong đó có một số cuốn truyện tranh. Cô thủ thư đặt thêm 4 cuốn truyện tranh lên kệ. Bạn An chọn ngẫu nhiên một cuốn trên kệ; xác suất chọn được truyện tranh là $\\dfrac{5}{8}$. Hỏi lúc đầu trên kệ có bao nhiêu cuốn truyện tranh?',
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
