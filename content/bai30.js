// Bài 30 – Kết quả có thể và kết quả thuận lợi (SGK Toán 8 KNTT, Tập 2, tr. 59–62)
(function () {
  'use strict';
  var XANH = '#2f9e44', DO = '#e03131';

  // n quả bóng/bạn được kí hiệu riêng: chu + 1, chu + 2, … (mỗi kí hiệu là một kết quả có thể)
  function nhom(chu, n, mau) {
    var r = [];
    for (var i = 1; i <= n; i++) r.push({ ten: chu + i, so: 1, mau: mau });
    return r;
  }

  // Đội văn nghệ (Ví dụ 2 SGK): A = nam 8A, B = nữ 8B, C = nam 8C, D = nữ 8D
  var doiVanNghe = {
    loai: 'tui',
    tui: [].concat(nhom('A', 4, '#1971c2'), nhom('B', 5, '#c2255c'), nhom('C', 3, '#0c8599'), nhom('D', 2, '#9c36b5')),
    suKien: { ten: 'Chọn được một bạn nữ', thuanLoi: ['B1', 'B2', 'B3', 'B4', 'B5', 'D1', 'D2'] },
    anLiThuyet: true
  };

  TOAN8.bai({
    id: 30, ten: 'Kết quả có thể và kết quả thuận lợi', sgk: { tap: 2, trang: 59 },

    khamPha: {
      nhiemVu: 'Hộp có **20 phiếu câu hỏi** đánh số từ 1 đến 20. Phiếu số 1 đến 4 thuộc lĩnh vực **Lịch sử – Địa lí**. Bạn Sơn mong rút được câu Lịch sử – Địa lí. Em bấm **Thử 1 lần** vài lần: Sơn có **chắc chắn** rút được phiếu mình muốn không? Các ô tô đậm là những phiếu làm Sơn vui.',
      widget: 'xacSuat',
      config: { loai: 'theSo', tu: 1, den: 20, suKien: { ten: 'Rút được câu Lịch sử – Địa lí', thuanLoi: [1, 2, 3, 4] }, anLiThuyet: true },
      cauHoi: {
        de: 'Khi Sơn rút một phiếu bất kì: có bao nhiêu **kết quả có thể**? Có bao nhiêu kết quả làm Sơn rút được câu Lịch sử – Địa lí?',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: 20,
            loiThuongGap: [{ gt: 19, giaiThich: 'Từ 1 đến 20 có **20** số (em đếm cả số 1 và số 20 nhé).' }] },
          { nhan: 'Số kết quả làm Sơn vui', kieu: 'so', gt: 4,
            loiThuongGap: [{ gt: 3, giaiThich: 'Phiếu 1; 2; 3; 4 là **4** phiếu, em đừng bỏ sót phiếu số 1.' }] }] },
        goiY: ['Mỗi phiếu Sơn có thể rút là một kết quả có thể.', 'Đếm số ô trong danh sách, rồi đếm số ô tô đậm.'],
        loiGiai: [
          'Sơn có thể rút được bất kì phiếu nào trong 20 phiếu, nên có **20 kết quả có thể**: phiếu 1, phiếu 2, …, phiếu 20.',
          'Sơn **không chắc chắn** rút được câu Lịch sử – Địa lí: kết quả chỉ biết sau khi rút.',
          'Chỉ có **4** kết quả làm Sơn vui: phiếu 1; 2; 3; 4. Đó là các **kết quả thuận lợi** cho biến cố "Rút được câu Lịch sử – Địa lí".'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Kết quả có thể',
        noiDung: 'Có những **hành động, thực nghiệm** mà ta không biết trước kết quả (gieo xúc xắc, rút thẻ, lấy bóng trong túi…). Nhưng ta thường **liệt kê được tất cả** các kết quả có thể xảy ra, gọi tắt là **các kết quả có thể**.\n\nVí dụ: gieo một con xúc xắc có 6 kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$ (số chấm xuất hiện).' },
      { loai: 'chuY', tieuDe: 'Liệt kê thế nào cho khỏi sót, khỏi trùng?',
        noiDung: 'Khi có nhiều đồ vật giống nhau, em **đặt kí hiệu riêng** cho từng cái.\n\nVí dụ: hộp có 5 quả cầu xanh đánh số 1 đến 5 và 4 quả cầu đỏ đánh số 1 đến 4. Kí hiệu $X1, X2, X3, X4, X5$ và $D1, D2, D3, D4$. Lấy một quả cầu: có $5 + 4 = 9$ kết quả có thể.\n\nVới các số liên tiếp từ $a$ đến $b$: có $b - a + 1$ số (đừng quên **cộng 1**). Ví dụ từ 11 đến 20 có $20 - 11 + 1 = 10$ số.' },

      { loai: 'dinhNghia', tieuDe: '2. Kết quả thuận lợi cho một biến cố',
        noiDung: 'Xét một biến cố $E$ mà $E$ xảy ra hay không **tuỳ thuộc vào kết quả** của hành động, thực nghiệm $T$.\n\nMột kết quả có thể của $T$ **làm cho $E$ xảy ra** được gọi là **kết quả thuận lợi** cho biến cố $E$.\n\nVí dụ: gieo xúc xắc, biến cố $E$: "Số chấm là số chẵn". Các kết quả thuận lợi cho $E$ là $2;\\ 4;\\ 6$.' },
      { loai: 'hinh', widget: 'xacSuat', config: doiVanNghe,
        chuThich: 'Đội văn nghệ khối 8 có 14 bạn: 4 bạn nam lớp 8A ($A1$–$A4$), 5 bạn nữ lớp 8B ($B1$–$B5$), 3 bạn nam lớp 8C ($C1$–$C3$), 2 bạn nữ lớp 8D ($D1, D2$). Chọn ngẫu nhiên một bạn: có **14 kết quả có thể**. Các ô tô đậm là **7 kết quả thuận lợi** cho biến cố "Chọn được một bạn nữ": $B1, \\dots, B5, D1, D2$. Bấm thử để thấy biến cố lúc xảy ra, lúc không.' },

      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '**Số 1 không phải số nguyên tố**, cũng không phải hợp số. Các số nguyên tố nhỏ: $2;\\ 3;\\ 5;\\ 7;\\ 11;\\ 13;\\ 17;\\ 19;\\ 23;\\ 29$.\n\n**Số chính phương** là bình phương của một số tự nhiên: $1;\\ 4;\\ 9;\\ 16;\\ 25;\\ 36;\\ 49;\\ 64;\\ 81$ (số 1 cũng là số chính phương).\n\n"Nhỏ hơn 3" **không** lấy số 3; "không vượt quá 3" (hay "nhiều nhất 3") thì **có** lấy số 3.\n\n"Hoặc" nghĩa là chỉ cần **một trong hai** điều xảy ra: "lớp 8C **hoặc** 8D" gồm cả bạn lớp 8C và bạn lớp 8D.' }
    ],

    viDu: [
      { de: 'Một hộp có 5 quả cầu xanh đánh số 1 đến 5 và 4 quả cầu đỏ đánh số 1 đến 4. Lấy ngẫu nhiên một quả cầu. Liệt kê các kết quả có thể. Có bao nhiêu kết quả có thể?', buoc: [
        { lam: 'Kí hiệu quả xanh là $X1, X2, X3, X4, X5$; quả đỏ là $D1, D2, D3, D4$.', vi: 'Hai quả cùng ghi số 1 vẫn là **hai quả khác nhau** (một xanh, một đỏ), nên cần kí hiệu riêng để không đếm trùng.' },
        { lam: 'Các kết quả có thể: $X1, X2, X3, X4, X5, D1, D2, D3, D4$.', vi: 'Lấy được quả nào thì kết quả là quả đó.' },
        { lam: 'Có $5 + 4 = 9$ kết quả có thể.', vi: 'Đếm theo từng nhóm màu rồi cộng lại, nhanh và không sót.' } ] },
      { de: 'Đội văn nghệ có 4 bạn nam lớp 8A, 5 bạn nữ lớp 8B, 3 bạn nam lớp 8C và 2 bạn nữ lớp 8D. Chọn ngẫu nhiên một bạn. Liệt kê các kết quả thuận lợi cho biến cố $E$: "Chọn được một bạn lớp 8A" và $F$: "Chọn được một bạn nữ".', buoc: [
        { lam: 'Kí hiệu: $A1$–$A4$ (8A), $B1$–$B5$ (8B), $C1$–$C3$ (8C), $D1, D2$ (8D). Có $14$ kết quả có thể.', vi: 'Mỗi bạn là một kết quả có thể.' },
        { lam: 'Kết quả thuận lợi cho $E$: $A1, A2, A3, A4$.', vi: '$E$ xảy ra khi bạn được chọn học lớp 8A, tức là một trong 4 bạn $A$.' },
        { lam: 'Kết quả thuận lợi cho $F$: $B1, B2, B3, B4, B5, D1, D2$.', vi: 'Bạn nữ gồm 5 bạn lớp 8B **và** 2 bạn lớp 8D. Em đừng quên nhóm 8D.' } ] },
      { de: 'Gieo một con xúc xắc. Liệt kê các kết quả thuận lợi cho biến cố $A$: "Số chấm xuất hiện là hợp số" và $B$: "Số chấm nhỏ hơn 5".', buoc: [
        { lam: 'Các kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$.', vi: 'Xúc xắc có 6 mặt, từ 1 đến 6 chấm.' },
        { lam: 'Kết quả thuận lợi cho $A$: $4;\\ 6$.', vi: 'Hợp số là số lớn hơn 1 có **nhiều hơn hai** ước. $1$ không phải hợp số; $2, 3, 5$ là số nguyên tố.' },
        { lam: 'Kết quả thuận lợi cho $B$: $1;\\ 2;\\ 3;\\ 4$.', vi: '"Nhỏ hơn 5" không lấy số 5.' } ] },
      { de: 'Hộp có 10 tấm thẻ ghi số $11;\\ 12;\\ \\dots;\\ 20$. Rút ngẫu nhiên một thẻ. Liệt kê các kết quả thuận lợi cho $E$: "Rút được thẻ ghi số là bội của 3" và $F$: "Rút được thẻ ghi số nguyên tố".', buoc: [
        { lam: 'Các kết quả có thể: $11;\\ 12;\\ \\dots;\\ 20$, có $20 - 11 + 1 = 10$ kết quả.', vi: 'Nhớ cộng 1 khi đếm các số liên tiếp.' },
        { lam: 'Kết quả thuận lợi cho $E$: $12;\\ 15;\\ 18$.', vi: 'Bội của 3 có tổng các chữ số chia hết cho 3.' },
        { lam: 'Kết quả thuận lợi cho $F$: $11;\\ 13;\\ 17;\\ 19$.', vi: '$15 = 3\\cdot 5$, $14 = 2 \\cdot 7$… không phải số nguyên tố. Còn $11, 13, 17, 19$ chỉ có hai ước là 1 và chính nó.' } ] }
    ],

    viDuMo: [
      { de: 'Túi có 3 viên bi đỏ và 2 viên bi xanh, cùng kích thước. Lấy ngẫu nhiên một viên. Có bao nhiêu kết quả thuận lợi cho biến cố "Lấy được bi đỏ"?', buoc: [
        { lam: 'Kí hiệu bi đỏ là **Đ1, Đ2, Đ3**; bi xanh là $X1, X2$. Có $5$ kết quả có thể.', vi: 'Mỗi viên bi là một kết quả có thể.' },
        { lam: 'Các kết quả thuận lợi là **Đ1, Đ2, Đ3**: có $3$ kết quả.', vi: 'Em hãy đếm số kết quả thuận lợi:', an: true,
          dapAn: { kieu: 'so', gt: 3 },
          loiThuongGap: [{ gt: 1, giaiThich: 'Ba viên bi đỏ là **ba viên khác nhau**, mỗi viên là một kết quả thuận lợi. Có 3 chứ không phải 1.' }] } ] },
      { de: 'Hộp có 12 tấm thẻ ghi số $1;\\ 2;\\ \\dots;\\ 12$. Rút ngẫu nhiên một thẻ. Có bao nhiêu kết quả thuận lợi cho biến cố "Rút được thẻ ghi số chính phương"?', buoc: [
        { lam: 'Các số chính phương từ 1 đến 12: $1 = 1^2$, $4 = 2^2$, $9 = 3^2$.', vi: '$4^2 = 16 > 12$ nên dừng lại.' },
        { lam: 'Có $3$ kết quả thuận lợi: $1;\\ 4;\\ 9$.', vi: 'Em hãy đếm số kết quả thuận lợi:', an: true,
          dapAn: { kieu: 'so', gt: 3 },
          loiThuongGap: [{ gt: 2, giaiThich: 'Số $1 = 1^2$ cũng là số chính phương, em đừng bỏ sót.' }] } ] }
    ],

    baiTap: [
      { id: '30.1', muc: 1, de: 'Hộp có các tấm thẻ ghi số $1;\\ 2;\\ 3;\\ \\dots;\\ 15$. Rút ngẫu nhiên một thẻ. Có bao nhiêu kết quả có thể?',
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Mỗi tấm thẻ là một kết quả có thể.', 'Từ 1 đến 15 có bao nhiêu số?'],
        loiGiai: ['Các kết quả có thể là $1;\\ 2;\\ \\dots;\\ 15$.', 'Số kết quả có thể $= 15$'],
        loiThuongGap: [{ gt: 14, giaiThich: 'Từ 1 đến 15 có $15 - 1 + 1 = 15$ số. Em quên cộng 1 rồi.' }] },

      { id: '30.2', muc: 1, de: 'Gieo một con xúc xắc. Có bao nhiêu kết quả thuận lợi cho biến cố "Số chấm xuất hiện lớn hơn 4"?',
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Liệt kê 6 kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$.', 'Số nào **lớn hơn** 4? Số 4 có được tính không?'],
        loiGiai: ['Các kết quả thuận lợi là $5;\\ 6$.', 'Số kết quả thuận lợi $= 2$'],
        loiThuongGap: [{ gt: 3, giaiThich: '"Lớn hơn 4" không lấy số 4. Chỉ có 5 và 6.' }] },

      { id: '30.3', muc: 1, de: 'Gieo một con xúc xắc. Các kết quả thuận lợi cho biến cố "Số chấm xuất hiện là số nguyên tố" là:',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['$2;\\ 3;\\ 5$', '$1;\\ 2;\\ 3;\\ 5$', '$2;\\ 4;\\ 6$', '$1;\\ 3;\\ 5$'] },
        goiY: ['Số nguyên tố là số lớn hơn 1, chỉ có hai ước là 1 và chính nó.', 'Số 1 có phải số nguyên tố không?'],
        loiGiai: ['Trong các số $1, \\dots, 6$: số nguyên tố là $2;\\ 3;\\ 5$.', '$1$ không phải số nguyên tố; $4 = 2\\cdot 2$ và $6 = 2\\cdot 3$ là hợp số.', 'Đáp án: $2;\\ 3;\\ 5$.'] },

      { id: '30.4', muc: 1, de: 'Rút ngẫu nhiên một thẻ từ hộp có các thẻ ghi số $1;\\ 2;\\ \\dots;\\ 10$. Khẳng định sau đúng hay sai: "Các kết quả thuận lợi cho biến cố ‘Rút được thẻ ghi số chẵn’ là $2;\\ 4;\\ 6;\\ 8;\\ 10$."',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Liệt kê các số chẵn từ 1 đến 10.', 'Số 10 có phải số chẵn không?'],
        loiGiai: ['Các số chẵn từ 1 đến 10 là $2;\\ 4;\\ 6;\\ 8;\\ 10$ (5 số).', 'Vậy khẳng định **đúng**.'] },

      { id: '30.5', muc: 2, de: 'Hộp có 15 tấm thẻ ghi số $1;\\ 2;\\ \\dots;\\ 15$. Rút ngẫu nhiên một thẻ. Đếm số kết quả thuận lợi cho mỗi biến cố:\n\n$A$: "Rút được thẻ ghi số chẵn"; $B$: "Rút được thẻ ghi số nguyên tố"; $C$: "Rút được thẻ ghi số chính phương".',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Biến cố $A$', kieu: 'so', gt: 7,
            loiThuongGap: [{ gt: 8, giaiThich: 'Từ 1 đến 15, số chẵn là $2, 4, \\dots, 14$: chỉ có 7 số (15 là số lẻ).' }] },
          { nhan: 'Biến cố $B$', kieu: 'so', gt: 6,
            loiThuongGap: [{ gt: 7, giaiThich: 'Số 1 **không** phải số nguyên tố. Các số nguyên tố là $2, 3, 5, 7, 11, 13$.' }] },
          { nhan: 'Biến cố $C$', kieu: 'so', gt: 3,
            loiThuongGap: [{ gt: 2, giaiThich: 'Số $1 = 1^2$ cũng là số chính phương.' }] }] },
        goiY: ['Liệt kê từng nhóm số rồi đếm.', 'Nhớ: 1 không phải số nguyên tố, nhưng 1 là số chính phương.'],
        loiGiai: ['$A$: $2;\\ 4;\\ 6;\\ 8;\\ 10;\\ 12;\\ 14$ → 7 kết quả thuận lợi.', '$B$: $2;\\ 3;\\ 5;\\ 7;\\ 11;\\ 13$ → 6 kết quả thuận lợi.', '$C$: $1;\\ 4;\\ 9$ → 3 kết quả thuận lợi.'] },

      { id: '30.6', muc: 2, de: 'Tủ sách của Hà có 16 cuốn sách khác nhau: 5 cuốn tiểu thuyết, 6 cuốn Lịch sử, 2 cuốn Khoa học tự nhiên và 3 cuốn Toán. Bạn Minh lấy ngẫu nhiên một cuốn. Hãy đếm:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: 16,
            loiThuongGap: [{ gt: 4, giaiThich: 'Mỗi **cuốn sách** là một kết quả có thể (16 cuốn khác nhau), không phải mỗi loại sách.' }] },
          { nhan: 'Số kết quả thuận lợi cho "lấy được sách Khoa học tự nhiên hoặc sách Toán"', kieu: 'so', gt: 5,
            loiThuongGap: [{ gt: 2, giaiThich: '"Hoặc" nghĩa là lấy được sách KHTN **hay** sách Toán đều được: $2 + 3 = 5$.' }] },
          { nhan: 'Số kết quả thuận lợi cho "lấy được cuốn không phải sách Lịch sử"', kieu: 'so', gt: 10,
            loiThuongGap: [{ gt: 6, giaiThich: '6 là số sách Lịch sử. Biến cố hỏi sách **không phải** Lịch sử: $16 - 6 = 10$.' }] }] },
        goiY: ['Mỗi cuốn sách là một kết quả có thể.', 'Sách không phải Lịch sử gồm tiểu thuyết, KHTN và Toán.'],
        loiGiai: ['Có $5 + 6 + 2 + 3 = 16$ kết quả có thể.', 'Sách KHTN hoặc Toán: $2 + 3 = 5$ kết quả thuận lợi.', 'Sách không phải Lịch sử: $5 + 2 + 3 = 10$ kết quả thuận lợi (hoặc $16 - 6 = 10$).'] },

      { id: '30.7', muc: 2, de: 'Một đội văn nghệ có 3 bạn nam lớp 8A, 4 bạn nữ lớp 8B, 2 bạn nam lớp 8C và 5 bạn nữ lớp 8D. Chọn ngẫu nhiên một bạn. Đếm số kết quả thuận lợi cho mỗi biến cố:',
        hinh: { widget: 'xacSuat', config: { loai: 'tui', tui: [].concat(nhom('A', 3, '#1971c2'), nhom('B', 4, '#c2255c'), nhom('C', 2, '#0c8599'), nhom('D', 5, '#9c36b5')) } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$G$: "Chọn được một bạn nam"', kieu: 'so', gt: 5,
            loiThuongGap: [{ gt: 3, giaiThich: 'Bạn nam có ở **cả** lớp 8A (3 bạn) và lớp 8C (2 bạn): $3 + 2 = 5$.' }] },
          { nhan: '$H$: "Chọn được một bạn lớp 8C hoặc 8D"', kieu: 'so', gt: 7,
            loiThuongGap: [{ gt: 2, giaiThich: '"8C hoặc 8D" gồm cả bạn lớp 8C và bạn lớp 8D: $2 + 5 = 7$.' }] }] },
        goiY: ['Kí hiệu $A1$–$A3$, $B1$–$B4$, $C1, C2$, $D1$–$D5$.', 'Bạn nam ở những lớp nào? Bạn lớp 8C hoặc 8D gồm những ai?'],
        loiGiai: ['$G$: các bạn $A1, A2, A3, C1, C2$ → 5 kết quả thuận lợi.', '$H$: các bạn $C1, C2, D1, D2, D3, D4, D5$ → 7 kết quả thuận lợi.'] },

      { id: '30.8', muc: 2, de: 'Hộp có 10 tấm thẻ ghi số $21;\\ 22;\\ \\dots;\\ 30$. Rút ngẫu nhiên một thẻ. Đếm số kết quả thuận lợi cho $E$: "Rút được thẻ ghi số là bội của 3" và $F$: "Rút được thẻ ghi số nguyên tố".',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Biến cố $E$', kieu: 'so', gt: 4,
            loiThuongGap: [{ gt: 3, giaiThich: 'Bội của 3 từ 21 đến 30 là $21, 24, 27, 30$: có 4 số (đừng bỏ sót 21 và 30).' }] },
          { nhan: 'Biến cố $F$', kieu: 'so', gt: 2,
            loiThuongGap: [{ gt: 3, giaiThich: '$27 = 3\\cdot 9$ và $21 = 3 \\cdot 7$ không phải số nguyên tố. Chỉ có 23 và 29.' }] }] },
        goiY: ['Bội của 3 có tổng các chữ số chia hết cho 3.', 'Thử chia từng số lẻ cho 3, 5, 7 để biết có phải số nguyên tố không.'],
        loiGiai: ['$E$: $21;\\ 24;\\ 27;\\ 30$ → 4 kết quả thuận lợi.', '$F$: $23;\\ 29$ → 2 kết quả thuận lợi ($21 = 3\\cdot 7$, $25 = 5\\cdot 5$, $27 = 3\\cdot 9$ là hợp số).'] },

      { id: '30.9', muc: 2, de: 'Gieo một con xúc xắc. Có bao nhiêu kết quả thuận lợi cho biến cố "Số chấm xuất hiện **không** chia hết cho 3"?',
        dapAn: { kieu: 'so', gt: 4 },
        goiY: ['Số chấm nào chia hết cho 3?', 'Lấy 6 kết quả có thể bỏ đi các số chia hết cho 3.'],
        loiGiai: ['Số chấm chia hết cho 3: $3;\\ 6$.', 'Không chia hết cho 3: $1;\\ 2;\\ 4;\\ 5$.', 'Số kết quả thuận lợi $= 4$'],
        loiThuongGap: [{ gt: 2, giaiThich: '2 là số kết quả **chia hết** cho 3 (3 và 6). Đề hỏi **không** chia hết cho 3: $6 - 2 = 4$.' }] },

      { id: '30.10', muc: 3, de: 'Chọn ngẫu nhiên một số tự nhiên có hai chữ số. Hãy đếm:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: 90,
            loiThuongGap: [{ gt: 99, giaiThich: 'Số có hai chữ số bắt đầu từ **10** (không phải từ 1): $99 - 10 + 1 = 90$.' },
              { gt: 89, giaiThich: 'Từ 10 đến 99 có $99 - 10 + 1 = 90$ số. Em quên cộng 1.' }] },
          { nhan: 'Số kết quả thuận lợi cho "số được chọn nhỏ hơn 20"', kieu: 'so', gt: 10,
            loiThuongGap: [{ gt: 19, giaiThich: 'Số có hai chữ số nhỏ hơn 20 là $10, 11, \\dots, 19$: chỉ có 10 số.' }] },
          { nhan: 'Số kết quả thuận lợi cho "số được chọn là số chính phương"', kieu: 'so', gt: 6,
            loiThuongGap: [{ gt: 9, giaiThich: '$1, 4, 9$ chỉ có một chữ số. Số chính phương có hai chữ số: $16, 25, 36, 49, 64, 81$.' }] }] },
        goiY: ['Số nhỏ nhất có hai chữ số là 10, lớn nhất là 99.', 'Số chính phương có hai chữ số là $4^2, 5^2, \\dots$ Dừng khi bình phương vượt quá 99.'],
        loiGiai: ['Kết quả có thể: $10;\\ 11;\\ \\dots;\\ 99$, có $99 - 10 + 1 = 90$ kết quả.', 'Nhỏ hơn 20: $10;\\ 11;\\ \\dots;\\ 19$ → 10 kết quả thuận lợi.', 'Số chính phương: $16;\\ 25;\\ 36;\\ 49;\\ 64;\\ 81$ → 6 kết quả thuận lợi ($10^2 = 100$ đã có ba chữ số).'] },

      { id: '30.11', muc: 3, de: 'Lớp 8B có 36 học sinh, trong đó có 16 bạn nữ. Có 5 bạn nữ tham gia câu lạc bộ bóng đá và 7 bạn nam **không** tham gia câu lạc bộ này. Chọn ngẫu nhiên một học sinh. Có bao nhiêu kết quả thuận lợi cho biến cố "Chọn được một bạn nam có tham gia câu lạc bộ bóng đá"?',
        dapAn: { kieu: 'so', gt: 13 },
        goiY: ['Trước hết tính số bạn nam của lớp.', 'Số bạn nam tham gia = số bạn nam − số bạn nam không tham gia.'],
        loiGiai: ['Số bạn nam: $36 - 16 = 20$.', 'Số bạn nam tham gia câu lạc bộ: $20 - 7 = 13$.', 'Số kết quả thuận lợi $= 13$'],
        loiThuongGap: [
          { gt: 7, giaiThich: '7 là số bạn nam **không** tham gia. Số bạn nam tham gia là $20 - 7 = 13$.' },
          { gt: 18, giaiThich: '5 bạn nữ tham gia không được tính: biến cố chỉ nói về **bạn nam**.' }] },

      { id: '30.12', muc: 3, de: 'Tung cùng lúc hai đồng xu: một đồng 500 đồng và một đồng 1 000 đồng. Mỗi đồng có thể ra mặt sấp (S) hoặc ngửa (N). Hãy đếm:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: 4,
            loiThuongGap: [{ gt: 3, giaiThich: '"Đồng 500 sấp, đồng 1 000 ngửa" (SN) khác với "đồng 500 ngửa, đồng 1 000 sấp" (NS). Có 4 kết quả: SS, SN, NS, NN.' }] },
          { nhan: 'Số kết quả thuận lợi cho "hai đồng xu ra hai mặt khác nhau"', kieu: 'so', gt: 2,
            loiThuongGap: [{ gt: 1, giaiThich: 'Có hai cách ra khác mặt: SN và NS (hai đồng xu là hai đồng khác nhau).' }] }] },
        goiY: ['Viết kết quả thành cặp: mặt của đồng 500 trước, mặt của đồng 1 000 sau.', 'Đồng 500 có 2 khả năng, với mỗi khả năng đó đồng 1 000 lại có 2 khả năng.'],
        loiGiai: ['Các kết quả có thể: $SS,\\ SN,\\ NS,\\ NN$ → 4 kết quả.', 'Hai mặt khác nhau: $SN,\\ NS$ → 2 kết quả thuận lợi.'] }
    ],

    timLoi: [
      { de: 'Rút ngẫu nhiên một thẻ từ hộp có các thẻ ghi số $1;\\ 2;\\ \\dots;\\ 10$. Bạn Tùng liệt kê kết quả thuận lợi cho biến cố "Rút được thẻ ghi số nguyên tố" như sau. Dòng nào sai?',
        loiGiaiSai: ['Các kết quả có thể: $1;\\ 2;\\ \\dots;\\ 10$ (10 kết quả).', 'Các kết quả thuận lợi: $1;\\ 2;\\ 3;\\ 5;\\ 7$.', 'Có 5 kết quả thuận lợi.'],
        dongSai: 1, giaiThich: 'Số 1 **không** phải số nguyên tố (nó chỉ có một ước). Kết quả thuận lợi chỉ là $2;\\ 3;\\ 5;\\ 7$.', sua: 'Các kết quả thuận lợi: $2;\\ 3;\\ 5;\\ 7$ (4 kết quả).' },
      { de: 'Hộp có các thẻ ghi số $5;\\ 6;\\ \\dots;\\ 12$. Bạn Mai đếm số kết quả có thể khi rút một thẻ như sau. Dòng nào sai?',
        loiGiaiSai: ['Các kết quả có thể là các số từ 5 đến 12.', 'Số kết quả có thể là $12 - 5 = 7$.'],
        dongSai: 1, giaiThich: 'Đếm các số liên tiếp từ $a$ đến $b$ phải là $b - a + 1$. Liệt kê ra: $5, 6, 7, 8, 9, 10, 11, 12$ là 8 số.', sua: 'Số kết quả có thể là $12 - 5 + 1 = 8$.' },
      { de: 'Gieo một con xúc xắc. Bạn Nam liệt kê kết quả thuận lợi cho biến cố "Số chấm nhỏ hơn 3" như sau. Dòng nào sai?',
        loiGiaiSai: ['Các kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$.', 'Các kết quả thuận lợi: $1;\\ 2;\\ 3$.'],
        dongSai: 1, giaiThich: '"Nhỏ hơn 3" **không** lấy số 3.', sua: 'Các kết quả thuận lợi: $1;\\ 2$.' }
    ]
  });
})();
