// Bài 7 – Lập phương của một tổng. Lập phương của một hiệu (SGK Toán 8 KNTT Tập 1, tr. 34–36)
(function () {
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  // (a+b)³ = (a+b)²·(a+b): hàng là ba hạng tử của (a+b)², cột là hai hạng tử của (a+b).
  // Mỗi ô là một tích; ô cam = a³, ô xanh dương = b³, các ô xanh lá gom lại thành 3a²b và 3ab².
  var hinhLapPhuong = {
    hang: [{ nhan: 'a^2', dai: 'a^2', mau: CAM }, { nhan: '2ab', dai: '2ab', mau: LA }, { nhan: 'b^2', dai: 'b^2', mau: XANH }],
    cot: [{ nhan: 'a', dai: 'a', mau: CAM }, { nhan: 'b', dai: 'b', mau: XANH }],
    o: [['\\ca{a^3}', 'a^2b'], ['2a^2b', '2ab^2'], ['ab^2', '\\cb{b^3}']],
    thanhTruot: [{ ten: 'a', min: 1, max: 3, buoc: 0.5, gt: 2 }, { ten: 'b', min: 1.5, max: 3, buoc: 0.5, gt: 1.5 }],
    congThuc: '(\\ca{a}+\\cb{b})^3 = (\\ca{a^2}+\\cc{2ab}+\\cb{b^2})(\\ca{a}+\\cb{b}) = \\ca{a^3} + \\cc{3a^2b} + \\cc{3ab^2} + \\cb{b^3}'
  };

  // Cấu hình hình cho "Nhìn là hiểu": khối lập phương tách thành 8 khối (tổng) hoặc bỏ dần từng phần (hiệu)
  var KHONG_TI_LE = 'Hình không theo tỉ lệ.';
  function lp(dang, tenA, tenB, a, b, nhan, ghiChu) {
    // Hình cắt bớt chỉ vẽ được khi cạnh lớn hơn phần cắt: nói rõ điều kiện đó
    var chu = ghiChu || (dang === 'tong' ? null : 'Hình vẽ khi ' + tenA + ' lớn hơn ' + tenB + '.');
    return { ten: 'lapPhuong', thamSo: { a: a, b: b }, tuyChon: { dang: dang, tenA: tenA, tenB: tenB, nhan: nhan }, ghiChu: chu };
  }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  // Thẻ Suy ra: bấm nút chỉ tách khối, tên khối ghi dấu hỏi tới khi em làm đúng
  function an(c) { return Object.assign({}, c, { tuyChon: Object.assign({}, c.tuyChon, { anNhan: true }) }); }
  var X4 = { a3: 'x³', a2b: '4x²', ab2: '16x', b3: '64' };

  TOAN8.bai({
    id: 7, ten: 'Lập phương của một tổng. Lập phương của một hiệu', sgk: { tap: 1, trang: 34 },

    nhin: {
      tieuDe: 'Tách khối lập phương thành 8 khối', loai: 'chungMinh',
      luuY: 'Hình đúng khi $a$, $b$ dương. Nhân $(a+b)^2$ với $(a+b)$ cho thấy công thức đúng với mọi số. Lập phương của một hiệu có hình riêng ở Ví dụ 2.',
      canh: { ten: 'lapPhuong', thuPha: true, tuyChon: { dang: 'tong' }, moTa: 'Khối lập phương cạnh a cộng b, mỗi cạnh chia thành đoạn a và đoạn b, tách ra thành tám khối hộp: một khối a mũ ba, ba khối a bình phương b, ba khối a b bình phương, một khối b mũ ba.',
        dongSo: (function (g) { return function (p, f) { var s = g(p, f); return p.dau < 0 ? '(Hình vẽ theo độ dài dương $|b| = ' + String(p.b).replace('.', '{,}') + '$.) ' + s : s; }; })(function (p, f) { // Bước 0,5 nên mọi số ở đây đúng tới ba chữ số thập phân, không phải làm tròn
        var so = function (x) { return String(Math.round(x * 1000) / 1000).replace('.', '{,}'); };
          return '$\\ca{' + so(p.a * p.a * p.a) + '} + 3 \\cdot \\cc{' + so(p.a * p.a * p.b) + '} + 3 \\cdot \\cd{' + so(p.a * p.b * p.b) + '} + \\cb{' + so(p.b * p.b * p.b) + '} = ' + so(Math.pow(p.a + p.b, 3)) + '$\n$(' + so(p.a) + ' + ' + so(p.b) + ')^3 = ' + so(Math.pow(p.a + p.b, 3)) + '$'; }) },
      buoc: [
        { t: 0, chu: 'Khối lập phương cạnh $\\ca{a} + \\cb{b}$. Mỗi cạnh chia thành một đoạn $\\ca{a}$ và một đoạn $\\cb{b}$.' },
        { t: 0.1, chu: 'Cắt theo các đường chia rồi tách ra: được $8$ khối hộp. Không khối nào đổi kích thước.' },
        { t: 0.55, chu: 'Mỗi khối có ba kích thước, mỗi kích thước là $\\ca{a}$ hoặc $\\cb{b}$. Thể tích là tích ba kích thước, ví dụ $\\ca{a}\\cdot\\ca{a}\\cdot\\cb{b} = \\cc{a^2b}$.' },
        { t: 0.8, chu: 'Nhấc tầng trên lên để thấy cả khối nấp phía sau. Đếm theo màu: $1$ khối $\\ca{a^3}$, $3$ khối $\\cc{a^2b}$, $3$ khối $\\cd{ab^2}$, $1$ khối $\\cb{b^3}$.' }
      ],
      ketLuan: 'Thể tích khối lớn bằng tổng tám khối: $$(\\ca{a} + \\cb{b})^3 = \\ca{a}^3 + 3\\cc{a^2b} + 3\\cd{ab^2} + \\cb{b}^3$$',
      dung: {
        tieuDe: 'Đếm đủ tám khối', tuBai: '7.1',
        canh: { ten: 'lapPhuong', thamSo: { a: 3, b: 2 }, t: 1, tuyChon: { dang: 'tong', tenA: 'x', tenB: '4', anGiua: true, nhan: X4 },
          moTa: 'Khối lập phương cạnh x cộng 4 đã tách thành tám khối; sáu khối ở giữa ghi dấu hỏi.' },
        moiThu: 'Mỗi khối có ba kích thước là $x$ hoặc $4$. Khối dấu hỏi có thể tích bao nhiêu, và có mấy khối như vậy? Nếu gõ sai, hình sẽ chỉ ra khối em bỏ sót.',
        phanUng: [
          { gt: 'x^3+64', trangThai: 'chiHaiDau', loi: 'Em mới tính khối $x^3$ và khối $64$. Còn $6$ khối ở giữa: ba khối $x\\cdot x\\cdot 4 = 4x^2$ và ba khối $x\\cdot 4\\cdot 4 = 16x$.' },
          { gt: 'x^3+4x^2+16x+64', trangThai: 'motMoiLoai', loi: 'Mỗi loại khối ở giữa có **ba** khối, em mới tính một. Ba khối $4x^2$ là $12x^2$, ba khối $16x$ là $48x$.' },
          { gt: 'x^3+12x^2+48x', trangThai: 'thieuB3', loi: 'Còn trống khối ở góc: khối cạnh $4$, thể tích $4\\cdot 4\\cdot 4 = 64$.' }
        ],
        dungChu: 'Đủ tám khối: $x^3 + 3\\cdot 4x^2 + 3\\cdot 16x + 64 = x^3 + 12x^2 + 48x + 64$.',
        saiChu: 'Đếm lại trên hình: một khối $x^3$, ba khối $x\\cdot x\\cdot 4$, ba khối $x\\cdot 4\\cdot 4$, một khối $4\\cdot 4\\cdot 4$.'
      },
      suyRa: {
        tieuDe: 'Số, chữ hay hệ số: vẫn là tám khối',
        baDe: [
          { tuBai: '7.10', canh: an(lp('tong', '20', '1', 4, 1, { a3: '8000', a2b: '400', ab2: '20', b3: '1' }, KHONG_TI_LE)), tenNut: 'Tách khối',
            dungChu: '$21^3 = (20 + 1)^3 = 8000 + 3\\cdot 400 + 3\\cdot 20 + 1 = 9261$.', saiChu: 'Khối cạnh $21 = 20 + 1$ tách thành $8$ khối: một khối $20^3$, ba khối $20\\cdot 20\\cdot 1$, ba khối $20\\cdot 1\\cdot 1$, một khối $1$.' },
          { tuBai: '7.7', canh: { ten: 'lapPhuong', thamSo: { a: 3, b: 2 }, tuyChon: { dang: 'tong', tenA: 'x', tenB: '5', anB: true, anNhan: true, nhan: { a3: 'x³', a2b: '5x²', ab2: '25x', b3: '125' } } }, tenNut: 'Tách khối',
            dungChu: '$125 = 5^3$; ba khối $5x^2$ là $15x^2$, ba khối $25x$ là $75x$: đúng tám khối của khối lập phương cạnh $x + 5$.', saiChu: 'Khối góc nhỏ có thể tích $125$. Cạnh của nó là số nào? Khối lớn có cạnh $x$ cộng cạnh đó.' },
          { tuBai: '7.5', canh: an(lp('tong', '2x', '1', 4, 1.5, { a3: '8x³', a2b: '4x²', ab2: '2x', b3: '1' })), tenNut: 'Tách khối',
            dungChu: '$8x^3 + 3\\cdot 4x^2 + 3\\cdot 2x + 1 = 8x^3 + 12x^2 + 6x + 1$.', saiChu: 'Khối lớn nhất có cạnh $2x$, nên thể tích là $(2x)^3 = 8x^3$. Ba khối $2x\\cdot 2x\\cdot 1$, ba khối $2x\\cdot 1\\cdot 1$.' }
        ],
        cachNhan: 'Thấy lập phương của một tổng, hoặc một số gần số tròn được lập phương lên: nghĩ tới khối lập phương tách thành $8$ khối, đếm $1, 3, 3, 1$.'
      }
    },

    khamPha: {
      nhiemVu: 'Em đã biết $(\\ca{a}+\\cb{b})^2 = \\ca{a^2} + \\cc{2ab} + \\cb{b^2}$. Muốn có $(a+b)^3$, ta nhân tiếp với $(a+b)$: $(a+b)^3 = (a^2+2ab+b^2)(a+b)$. Hình dưới là phép nhân đó: **hàng** là $a^2$, $2ab$, $b^2$; **cột** là $a$, $b$. Kéo thanh trượt rồi gom các ô cùng loại: $a^2b$ và $2a^2b$ gom thành mấy $a^2b$? $2ab^2$ và $ab^2$ gom thành mấy $ab^2$?',
      widget: 'dienTich',
      config: hinhLapPhuong,
      cauHoi: {
        de: 'Kiểm chứng bằng số với $a = 2$, $b = 1$. Em hãy tính ba giá trị sau:',
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'so', gt: 27, nhan: '$(a+b)^3 =$',
            loiThuongGap: [{ gt: 9, giaiThich: '$(2+1)^3 = 3^3 = 3\\cdot 3\\cdot 3 = 27$. Em đã tính $2^3 + 1^3$ mất rồi.' }] },
          { kieu: 'so', gt: 27, nhan: '$a^3 + 3a^2b + 3ab^2 + b^3 =$' },
          { kieu: 'so', gt: 9, nhan: '$a^3 + b^3 =$' }] },
        goiY: ['$(2+1)^3 = 3^3$.', '$a^3 + 3a^2b + 3ab^2 + b^3 = 8 + 3\\cdot 4\\cdot 1 + 3\\cdot 2\\cdot 1 + 1$.'],
        loiGiai: [
          '$(2+1)^3 = 3^3 = 27$.',
          '$2^3 + 3\\cdot 2^2\\cdot 1 + 3\\cdot 2\\cdot 1^2 + 1^3 = 8 + 12 + 6 + 1 = 27$. Bằng nhau!',
          '$2^3 + 1^3 = 8 + 1 = 9 \\ne 27$. Vậy $(a+b)^3 \\ne a^3 + b^3$: không được quên hai hạng tử giữa $\\cc{3a^2b}$ và $\\cc{3ab^2}$.'
        ]
      }
    },

    mucTieu: [
      'Nói được vì sao $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$ bằng cách đếm tám khối của khối lập phương.',
      'Khai triển lập phương của một tổng và của một hiệu, đặt đúng dấu và các hệ số $1, 3, 3, 1$.',
      'Viết biểu thức dạng $A^3 + 3A^2B + 3AB^2 + B^3$ thành lập phương của một tổng.',
      'Tính nhanh các số như $21^3$ bằng hằng đẳng thức.'
    ],
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Lập phương của một tổng',
        noiDung: 'Với $A$, $B$ là hai biểu thức tuỳ ý:\n\n$$(\\ca{A}+\\cb{B})^3 = \\ca{A}^3 + \\cc{3\\ca{A}^2\\cb{B}} + \\cc{3\\ca{A}\\cb{B}^2} + \\cb{B}^3$$\n\nCó được bằng cách nhân $(A+B)^2$ với $(A+B)$.' },
      { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$?', config: {
        de: 'Xếp các bước theo đúng thứ tự lập luận (với $a$, $b$ dương). Bước nào chưa đủ căn cứ, máy sẽ nói thiếu gì.',
        canh: { ten: 'lapPhuong', tuyChon: { dang: 'tong' } },
        buoc: [
          { id: 'gt', chu: 'Dựng khối lập phương cạnh $a + b$.', canh: { t: 0 } },
          { id: 'tt', chu: 'Thể tích khối lập phương đó là $(a + b)^3$.', can: ['gt'], canh: { t: 0 } },
          { id: 'cat', chu: 'Chia mỗi cạnh thành một đoạn $a$ và một đoạn $b$, cắt theo các chỗ chia: được $2 \\cdot 2 \\cdot 2 = 8$ khối hộp.', can: ['gt'], canh: { t: 0.55 } },
          { id: 'the', chu: 'Mỗi khối hộp có ba kích thước (dài, rộng, cao), mỗi kích thước là $a$ hoặc $b$; thể tích của nó là tích ba kích thước.', can: ['cat'], canh: { t: 0.6 } },
          { id: 'dau', chu: 'Ba kích thước đều là $a$: chỉ có $1$ khối, thể tích $a^3$; ba kích thước đều là $b$: cũng chỉ $1$ khối, thể tích $b^3$.', can: ['the'], canh: { t: 1 } },
          { id: 'a2b', chu: 'Đúng một kích thước là $b$: nó nằm theo một trong ba chiều, nên có $3$ khối $a^2b$.', can: ['the'], canh: { t: 1 } },
          { id: 'ab2', chu: 'Đúng một kích thước là $a$: nó nằm theo một trong ba chiều, nên có $3$ khối $ab^2$.', can: ['the'], canh: { t: 1 } },
          { id: 'cong', chu: 'Tám khối ghép khít thành khối lớn, nên thể tích khối lớn bằng tổng tám khối: $a^3 + 3a^2b + 3ab^2 + b^3$.', can: ['dau', 'a2b', 'ab2'], canh: { t: 1 } },
          { id: 'kl', chu: 'Vậy $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$.', can: ['tt', 'cong'], canh: { t: 1 } }
        ],
        ketLuan: 'Cùng một khối lập phương, tính thể tích hai cách: $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$.'
      } },
      { loai: 'hinh', widget: 'dienTich', config: hinhLapPhuong,
        chuThich: 'Nhân từng hạng tử của $a^2 + 2ab + b^2$ với $a$ và với $b$ được 6 ô. Gom lại: ô cam $\\ca{a^3}$; ô $a^2b$ và ô $2a^2b$ thành $\\cc{3a^2b}$; ô $2ab^2$ và ô $ab^2$ thành $\\cc{3ab^2}$; ô xanh dương $\\cb{b^3}$. Nếu ghép hình lập phương cạnh $a+b$ thật thì nó gồm đúng 8 khối: 1 khối $a^3$, 3 khối $a^2b$, 3 khối $ab^2$, 1 khối $b^3$.' },
      { loai: 'dinhLi', tieuDe: '2. Lập phương của một hiệu',
        noiDung: '$$(\\ca{A}-\\cb{B})^3 = \\ca{A}^3 - \\cc{3\\ca{A}^2\\cb{B}} + \\cc{3\\ca{A}\\cb{B}^2} - \\cb{B}^3$$\n\nCó được bằng cách viết $A - B = A + (-B)$ rồi dùng lập phương của một tổng.' },
      { loai: 'chuY', tieuDe: 'Cách nhớ dấu và hệ số',
        noiDung: 'Hệ số luôn là $1,\\ 3,\\ 3,\\ 1$. Số mũ của $A$ giảm dần $3, 2, 1, 0$; số mũ của $B$ tăng dần $0, 1, 2, 3$.\n\nVới $(A-B)^3$: dấu **xen kẽ** $+,\\ -,\\ +,\\ -$. Hạng tử nào có $B$ mũ **lẻ** ($B$ hoặc $B^3$) thì mang dấu trừ.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '$(A+B)^3 \\ne A^3 + B^3$ — còn hai hạng tử $3A^2B$ và $3AB^2$.\n\n$(A-B)^3 \\ne A^3 - 3A^2B - 3AB^2 - B^3$ — hạng tử $3AB^2$ mang dấu **cộng**.\n\nĐừng quên hệ số **3**: $(x+2)^3$ có hạng tử $3\\cdot x^2\\cdot 2 = 6x^2$, không phải $2x^2$.\n\nLập phương cả hệ số: $(2x)^3 = 8x^3$, không phải $2x^3$.' },
      { loai: 'text', tieuDe: 'Dùng theo chiều ngược lại',
        noiDung: 'Nhận ra $A^3$ và $B^3$ ở hai đầu, kiểm tra hai hạng tử giữa có đúng $3A^2B$, $3AB^2$ không:\n\n$x^3 + 6x^2 + 12x + 8 = x^3 + 3\\cdot x^2\\cdot 2 + 3\\cdot x\\cdot 2^2 + 2^3 = (x+2)^3$.\n\nLưu ý: $(a-b)^3 = -(b-a)^3$.' }
    ],

    viDu: [
      { de: 'Khai triển $(x+1)^3$.', canh: lp('tong', 'x', '1', 3, 1.5, { a3: 'x³', a2b: 'x²', ab2: 'x', b3: '1' }), buoc: [
        { lam: '$(\\ca{x}+\\cb{1})^3 = \\ca{x}^3 + \\cc{3\\cdot x^2\\cdot 1} + \\cc{3\\cdot x\\cdot 1^2} + \\cb{1}^3$', vi: 'Lập phương của một tổng với $\\ca{A = x}$, $\\cb{B = 1}$.' },
        { lam: '$= x^3 + 3x^2 + 3x + 1$', vi: 'Tính từng hạng tử.' } ] },
      { de: 'Khai triển $(x-3)^3$.', canh: lp('hieu', 'x', '3', 5, 2, { a3: 'x³', a2b: '3x²', ab2: '9x', b3: '27', baA2b: '9x²', baAb2: '27x', hieu: 'x−3' }), buoc: [
        { lam: '$(\\ca{x}-\\cb{3})^3 = \\ca{x}^3 - \\cc{3\\cdot x^2\\cdot 3} + \\cc{3\\cdot x\\cdot 3^2} - \\cb{3}^3$', vi: 'Lập phương của một hiệu với $\\ca{A = x}$, $\\cb{B = 3}$. Trên hình: khối cạnh $x$ bỏ ba tấm $x\\cdot x\\cdot 3$. Ba thanh $x\\cdot 3\\cdot 3$ bị bỏ hai lần nên trả lại một lần. Khối góc $27$ lúc đó chưa bị bỏ lần nào nên bỏ thêm. Số trên mỗi khối là số lần nó đã bị bỏ.', canh: { t: 0.85 } },
        { lam: '$= x^3 - 9x^2 + 27x - 27$', vi: '$3\\cdot x\\cdot 9 = 27x$, $3^3 = 27$. Mọi khối nhỏ đều bị bỏ đúng một lần, chỉ còn lại khối $(x-3)^3$.', canh: { t: 1 } } ] },
      { de: 'Khai triển $(3x+y)^3$.', canh: lp('tong', '3x', 'y', 4, 1.5, { a3: '27x³', a2b: '9x²y', ab2: '3xy²', b3: 'y³' }), buoc: [
        { lam: '$(3x+y)^3 = (3x)^3 + 3\\cdot (3x)^2\\cdot y + 3\\cdot 3x\\cdot y^2 + y^3$', vi: '$A = 3x$, $B = y$. Nhớ để $3x$ trong ngoặc khi nâng lũy thừa.' },
        { lam: '$= 27x^3 + 27x^2y + 9xy^2 + y^3$', vi: '$(3x)^3 = 27x^3$, $3\\cdot 9x^2\\cdot y = 27x^2y$.' } ] },
      { de: 'Viết $8 + 12x + 6x^2 + x^3$ dưới dạng lập phương của một tổng.', canh: lp('tong', '2', 'x', 3, 2, { a3: '8', a2b: '4x', ab2: '2x²', b3: 'x³' }), buoc: [
        { lam: '$8 + 12x + 6x^2 + x^3 = 2^3 + 3\\cdot 2^2\\cdot x + 3\\cdot 2\\cdot x^2 + x^3$', vi: 'Hai đầu là $2^3$ và $x^3$, nên $A = 2$, $B = x$. Kiểm tra: $3\\cdot 4\\cdot x = 12x$, $3\\cdot 2\\cdot x^2 = 6x^2$. Khớp!' },
        { lam: '$= (2+x)^3$', vi: 'Dùng hằng đẳng thức theo chiều ngược lại.' } ] },
      { de: 'Tính nhanh giá trị của $x^3 + 6x^2 + 12x + 8$ tại $x = 98$.', canh: lp('tong', 'x', '2', 4, 1, { a3: 'x³', a2b: '2x²', ab2: '4x', b3: '8' }), buoc: [
        { lam: '$x^3 + 6x^2 + 12x + 8 = (x+2)^3$', vi: 'Nhận ra lập phương của một tổng với $A = x$, $B = 2$.' },
        { lam: 'Tại $x = 98$: $(98+2)^3 = 100^3 = 1000000$', vi: 'Thay số vào dạng gọn, tính nhẩm được ngay.' } ] }
    ],

    viDuMo: [
      { de: 'Khai triển $(x-2)^3$.', buoc: [
        { lam: '$(x-2)^3 = x^3 - 3\\cdot x^2\\cdot 2 + 3\\cdot x\\cdot 2^2 - 2^3$', vi: 'Lập phương của một hiệu với $A = x$, $B = 2$.' },
        { lam: '$= x^3 - 6x^2 + 12x - 8$', vi: 'Em hãy tính kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: 'x^3-6x^2+12x-8', dang: 'khaiTrien' },
          loiThuongGap: [
            { gt: 'x^3-6x^2-12x-8', giaiThich: 'Hạng tử $3AB^2 = 3\\cdot x\\cdot 4 = 12x$ mang dấu **cộng** (vì $B^2$ luôn dương).' },
            { gt: 'x^3-8', giaiThich: '$(A-B)^3 \\ne A^3 - B^3$. Còn thiếu $-6x^2$ và $+12x$.' }] } ] },
      { de: 'Viết $x^3 - 3x^2 + 3x - 1$ dưới dạng lập phương của một hiệu.', buoc: [
        { lam: '$x^3 - 3x^2 + 3x - 1 = x^3 - 3\\cdot x^2\\cdot 1 + 3\\cdot x\\cdot 1^2 - 1^3$', vi: 'Hai đầu là $x^3$ và $1^3$; dấu xen kẽ nên là lập phương của một hiệu với $A = x$, $B = 1$.' },
        { lam: '$= (x-1)^3$', vi: 'Em hãy viết dạng lập phương:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '(x-1)^3', dang: 'nhanTu' },
          loiThuongGap: [{ gt: '(x+1)^3', giaiThich: 'Dấu xen kẽ $+, -, +, -$ là dấu hiệu của lập phương một **hiệu**.' }] } ] }
    ],

    baiTap: [
      { id: '7.1', hinhGiai: hg(lp('tong', 'x', '4', 3, 2, X4)), muc: 1, de: 'Khai triển $(x+4)^3$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x^3+12x^2+48x+64', dang: 'khaiTrien' },
        goiY: ['Dùng $(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$.', '$A = x$, $B = 4$: $3A^2B = 3\\cdot x^2\\cdot 4$, $3AB^2 = 3\\cdot x\\cdot 16$.'],
        loiGiai: ['$(x+4)^3 = x^3 + 3\\cdot x^2\\cdot 4 + 3\\cdot x\\cdot 4^2 + 4^3$', '$= x^3 + 12x^2 + 48x + 64$'],
        loiThuongGap: [
          { gt: 'x^3+64', hinh: hg({ ten: 'lapPhuong', thamSo: { a: 3, b: 2, trangThai: 'chiHaiDau' }, tuyChon: { dang: 'tong', tenA: 'x', tenB: '4', nhan: X4 } }), giaiThich: '$(A+B)^3 \\ne A^3 + B^3$. Em còn thiếu $3A^2B = 12x^2$ và $3AB^2 = 48x$.' },
          { gt: 'x^3+4x^2+16x+64', hinh: hg({ ten: 'lapPhuong', thamSo: { a: 3, b: 2, trangThai: 'motMoiLoai' }, tuyChon: { dang: 'tong', tenA: 'x', tenB: '4', nhan: X4 } }), giaiThich: 'Quên hệ số **3**: $3\\cdot x^2\\cdot 4 = 12x^2$ và $3\\cdot x\\cdot 16 = 48x$.' }] },

      { id: '7.2', hinhGiai: hg(lp('hieu', 'x', '5', 5, 2, { a3: 'x³', a2b: '5x²', ab2: '25x', b3: '125', baA2b: '15x²', baAb2: '75x', hieu: 'x−5' })), muc: 1, de: 'Khai triển $(x-5)^3$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x^3-15x^2+75x-125', dang: 'khaiTrien' },
        goiY: ['Dùng $(A-B)^3 = A^3 - 3A^2B + 3AB^2 - B^3$.', '$A = x$, $B = 5$. Dấu xen kẽ $+, -, +, -$.'],
        loiGiai: ['$(x-5)^3 = x^3 - 3\\cdot x^2\\cdot 5 + 3\\cdot x\\cdot 5^2 - 5^3$', '$= x^3 - 15x^2 + 75x - 125$'],
        loiThuongGap: [
          { gt: 'x^3-125', giaiThich: '$(A-B)^3 \\ne A^3 - B^3$. Còn thiếu $-15x^2$ và $+75x$.' },
          { gt: 'x^3-15x^2-75x-125', giaiThich: 'Sai dấu: hạng tử $3AB^2 = 75x$ mang dấu **cộng**. Dấu đúng là $+, -, +, -$.' },
          { gt: 'x^3-15x^2+75x+125', giaiThich: 'Hạng tử cuối là $-B^3 = -125$ (dấu trừ).' }] },

      { id: '7.3', hinhGiai: hg(lp('tong', 'a', 'b', 3, 2, {})), muc: 1, de: 'Đúng hay sai: $(a+b)^3 = a^3 + b^3$ với mọi $a$, $b$.',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Thử với $a = 1$, $b = 1$.', '$(1+1)^3 = 8$, còn $1^3 + 1^3 = 2$.'],
        loiGiai: ['Với $a = b = 1$: $(1+1)^3 = 8$ nhưng $1^3 + 1^3 = 2$.', 'Vậy khẳng định **sai**. Đúng là $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$.'] },

      { id: '7.4', hinhGiai: hg(lp('hieu', 'A', 'B', 4, 1.5, {})), muc: 1, de: 'Chọn khai triển đúng của $(A-B)^3$.',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$A^3 - B^3$', '$A^3 - 3A^2B - 3AB^2 - B^3$', '$A^3 - 3A^2B + 3AB^2 - B^3$', '$A^3 + 3A^2B - 3AB^2 - B^3$'] },
        goiY: ['Hệ số $1, 3, 3, 1$.', 'Dấu xen kẽ, bắt đầu bằng dấu $+$: $+, -, +, -$.'],
        loiGiai: ['$(A-B)^3 = A^3 - 3A^2B + 3AB^2 - B^3$ (dấu xen kẽ $+, -, +, -$).'] },

      { id: '7.5', hinhGiai: hg(lp('tong', '2x', '1', 4, 1.5, { a3: '8x³', a2b: '4x²', ab2: '2x', b3: '1' })), muc: 2, de: 'Khai triển $(2x+1)^3$.',
        dapAn: { kieu: 'bieuThuc', gt: '8x^3+12x^2+6x+1', dang: 'khaiTrien' },
        goiY: ['$A = 2x$, $B = 1$.', '$(2x)^3 = 8x^3$; $3\\cdot (2x)^2\\cdot 1 = 3\\cdot 4x^2 = 12x^2$; $3\\cdot 2x\\cdot 1 = 6x$.'],
        loiGiai: ['$(2x+1)^3 = (2x)^3 + 3\\cdot (2x)^2\\cdot 1 + 3\\cdot 2x\\cdot 1^2 + 1^3$', '$= 8x^3 + 12x^2 + 6x + 1$'],
        loiThuongGap: [
          { gt: '2x^3+6x^2+6x+1', giaiThich: 'Phải lập phương cả hệ số: $(2x)^3 = 8x^3$, $(2x)^2 = 4x^2$.' },
          { gt: '8x^3+1', giaiThich: '$(A+B)^3 \\ne A^3 + B^3$. Còn thiếu $12x^2$ và $6x$.' }] },

      { id: '7.6', hinhGiai: hg(lp('hieu', '3x', 'y', 5, 2, { a3: '27x³', a2b: '9x²y', ab2: '3xy²', b3: 'y³', baA2b: '27x²y', baAb2: '9xy²', hieu: '3x−y' })), muc: 2, de: 'Khai triển $(3x-y)^3$.',
        dapAn: { kieu: 'bieuThuc', gt: '27x^3-27x^2y+9xy^2-y^3', dang: 'khaiTrien' },
        goiY: ['$A = 3x$, $B = y$. Dấu xen kẽ $+, -, +, -$.', '$(3x)^3 = 27x^3$; $3\\cdot 9x^2\\cdot y = 27x^2y$; $3\\cdot 3x\\cdot y^2 = 9xy^2$.'],
        loiGiai: ['$(3x-y)^3 = (3x)^3 - 3\\cdot (3x)^2\\cdot y + 3\\cdot 3x\\cdot y^2 - y^3$', '$= 27x^3 - 27x^2y + 9xy^2 - y^3$'],
        loiThuongGap: [
          { gt: '27x^3-y^3', giaiThich: '$(A-B)^3 \\ne A^3 - B^3$. Còn thiếu hai hạng tử giữa.' },
          { gt: '27x^3-27x^2y-9xy^2-y^3', giaiThich: 'Hạng tử $3AB^2 = 9xy^2$ mang dấu **cộng**.' },
          { gt: '3x^3-9x^2y+9xy^2-y^3', giaiThich: 'Phải lập phương cả hệ số 3: $(3x)^3 = 27x^3$, $(3x)^2 = 9x^2$.' }] },

      { id: '7.7', hinhGiai: hg(lp('tong', 'x', '5', 3, 2, { a3: 'x³', a2b: '5x²', ab2: '25x', b3: '125' })), muc: 2, de: 'Viết $x^3 + 15x^2 + 75x + 125$ dưới dạng lập phương của một tổng.',
        dapAn: { kieu: 'bieuThuc', gt: '(x+5)^3', dang: 'nhanTu' },
        goiY: ['Hai đầu: $x^3 = A^3$, $125 = B^3$. Vậy $B = ?$', '$B = 5$. Kiểm tra $3\\cdot x^2\\cdot 5 = 15x^2$ và $3\\cdot x\\cdot 25 = 75x$.'],
        loiGiai: ['$x^3 + 15x^2 + 75x + 125 = x^3 + 3\\cdot x^2\\cdot 5 + 3\\cdot x\\cdot 5^2 + 5^3$', '$= (x+5)^3$'],
        loiThuongGap: [{ gt: '(x+25)^3', giaiThich: '$B$ là số mà $B^3 = 125$, tức $B = 5$.' }] },

      { id: '7.8', hinhGiai: hg(lp('hieu', '2', 'x', 5, 2, { a3: '8', a2b: '4x', ab2: '2x²', b3: 'x³', baA2b: '12x', baAb2: '6x²', hieu: '2−x' })), muc: 2, de: 'Viết $8 - 12x + 6x^2 - x^3$ dưới dạng lập phương của một hiệu.',
        dapAn: { kieu: 'bieuThuc', gt: '(2-x)^3', dang: 'nhanTu' },
        goiY: ['Hạng tử đầu $8 = 2^3$ là $A^3$, hạng tử cuối $-x^3$ là $-B^3$.', '$A = 2$, $B = x$. Kiểm tra: $3\\cdot 4\\cdot x = 12x$, $3\\cdot 2\\cdot x^2 = 6x^2$.'],
        loiGiai: ['$8 - 12x + 6x^2 - x^3 = 2^3 - 3\\cdot 2^2\\cdot x + 3\\cdot 2\\cdot x^2 - x^3$', '$= (2-x)^3$'],
        loiThuongGap: [{ gt: '(x-2)^3', giaiThich: '$(x-2)^3 = x^3 - 6x^2 + 12x - 8$, ngược dấu với đề bài. Ở đây $A = 2$ (vì $+8$), $B = x$ (vì $-x^3$), nên là $(2-x)^3$.' }] },

      { id: '7.9', hinhGiai: hg(lp('hieu', 'x', '2', 5, 2, { a3: 'x³', a2b: '2x²', ab2: '4x', b3: '8', baA2b: '6x²', baAb2: '12x', hieu: 'x−2' })), muc: 2, de: 'Tính nhanh giá trị của $x^3 - 6x^2 + 12x - 8$ tại $x = 12$.',
        dapAn: { kieu: 'so', gt: 1000 },
        goiY: ['Viết biểu thức thành lập phương của một hiệu.', '$x^3 - 6x^2 + 12x - 8 = (x-2)^3$. Thay $x = 12$.'],
        loiGiai: ['$x^3 - 6x^2 + 12x - 8 = (x-2)^3$', 'Tại $x = 12$: $(12-2)^3 = 10^3$', '$= 1000$'],
        loiThuongGap: [{ gt: 2744, giaiThich: 'Đó là $(x+2)^3 = 14^3$. Dấu xen kẽ nên là $(x-2)^3$.' }] },

      { id: '7.10', hinhGiai: hg(lp('tong', '20', '1', 4, 1, { a3: '8000', a2b: '400', ab2: '20', b3: '1' }, KHONG_TI_LE)), muc: 2, de: 'Tính nhanh $21^3$.',
        dapAn: { kieu: 'so', gt: 9261 },
        goiY: ['$21 = 20 + 1$.', '$(20+1)^3 = 20^3 + 3\\cdot 20^2\\cdot 1 + 3\\cdot 20\\cdot 1 + 1$.'],
        loiGiai: ['$21^3 = (20+1)^3 = 20^3 + 3\\cdot 20^2\\cdot 1 + 3\\cdot 20\\cdot 1^2 + 1^3$', '$= 8000 + 1200 + 60 + 1$', '$= 9261$'],
        loiThuongGap: [{ gt: 8001, giaiThich: '$(A+B)^3 \\ne A^3 + B^3$. Còn thiếu $3A^2B = 1200$ và $3AB^2 = 60$.' }] },

      { id: '7.11', khongHinh: 'Khai triển hai lập phương rồi trừ: hình từng lần khai triển có ở bài 7.1 và 7.2.', muc: 3, de: 'Rút gọn biểu thức $(x+1)^3 - (x-1)^3$ (viết kết quả dưới dạng đa thức thu gọn).',
        dapAn: { kieu: 'bieuThuc', gt: '6x^2+2', dang: 'khaiTrien' },
        goiY: ['Khai triển từng lập phương, đặt mỗi kết quả trong ngoặc.', 'Bỏ ngoặc có dấu trừ đằng trước thì đổi dấu **mọi** hạng tử trong ngoặc.'],
        loiGiai: ['$(x+1)^3 - (x-1)^3 = (x^3 + 3x^2 + 3x + 1) - (x^3 - 3x^2 + 3x - 1)$', '$= x^3 + 3x^2 + 3x + 1 - x^3 + 3x^2 - 3x + 1$', '$= 6x^2 + 2$'],
        loiThuongGap: [
          { gt: '2', giaiThich: 'Em đã dùng $(A+B)^3 = A^3 + B^3$ — sai. Phải khai triển đủ 4 hạng tử.' },
          { gt: '6x', giaiThich: 'Bỏ ngoặc sau dấu trừ phải đổi dấu **mọi** hạng tử: $-(x^3-3x^2+3x-1) = -x^3+3x^2-3x+1$.' }] },

      { id: '7.12', khongHinh: 'Khai triển hai lập phương rồi cộng: hình từng lần khai triển có ở bài 7.5.', muc: 3, de: 'Rút gọn biểu thức $(2x+1)^3 + (2x-1)^3$ (viết kết quả dưới dạng đa thức thu gọn).',
        dapAn: { kieu: 'bieuThuc', gt: '16x^3+12x', dang: 'khaiTrien' },
        goiY: ['Khai triển $(2x+1)^3$ và $(2x-1)^3$, nhớ $(2x)^3 = 8x^3$, $(2x)^2 = 4x^2$.', 'Cộng lại: các hạng tử $12x^2$ và $-12x^2$, $1$ và $-1$ triệt tiêu.'],
        loiGiai: ['$(2x+1)^3 = 8x^3 + 12x^2 + 6x + 1$', '$(2x-1)^3 = 8x^3 - 12x^2 + 6x - 1$', 'Cộng lại: $(2x+1)^3 + (2x-1)^3 = 16x^3 + 12x$'],
        loiThuongGap: [
          { gt: '16x^3', giaiThich: 'Em đã dùng $(A+B)^3 = A^3 + B^3$ — sai. Còn hai hạng tử $6x + 6x = 12x$.' },
          { gt: '4x^3+12x', giaiThich: '$(2x)^3 = 8x^3$ (lập phương cả hệ số 2), không phải $2x^3$.' }] }
    ],

    timLoi: [
      { de: 'Bạn Hùng khai triển $(x-2)^3$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$(x-2)^3 = x^3 - 3\\cdot x^2\\cdot 2 - 3\\cdot x\\cdot 2^2 - 2^3$', '$= x^3 - 6x^2 - 12x - 8$'],
        dongSai: 0, giaiThich: 'Dấu của $(A-B)^3$ là $+, -, +, -$: hạng tử $3AB^2 = 3\\cdot x\\cdot 2^2$ mang dấu **cộng** (vì $(-2)^2 = 4$ dương).', sua: '$(x-2)^3 = x^3 - 3\\cdot x^2\\cdot 2 + 3\\cdot x\\cdot 2^2 - 2^3 = x^3 - 6x^2 + 12x - 8$' },
      { de: 'Bạn Mai tính $(y+3)^3$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$(y+3)^3 = y^3 + 3^3$', '$= y^3 + 27$'],
        dongSai: 0, giaiThich: '$(A+B)^3 \\ne A^3 + B^3$. Bạn Mai quên hai hạng tử $3A^2B = 9y^2$ và $3AB^2 = 27y$.', sua: '$(y+3)^3 = y^3 + 9y^2 + 27y + 27$' },
      { de: 'Bạn Tú khai triển $(2x+1)^3$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$(2x+1)^3 = (2x)^3 + 3\\cdot (2x)^2\\cdot 1 + 3\\cdot 2x\\cdot 1^2 + 1^3$', '$= 2x^3 + 6x^2 + 6x + 1$'],
        dongSai: 1, giaiThich: 'Lũy thừa của một tích phải lũy thừa cả hệ số: $(2x)^3 = 8x^3$ và $(2x)^2 = 4x^2$, nên $3\\cdot 4x^2 = 12x^2$.', sua: '$= 8x^3 + 12x^2 + 6x + 1$' }
    ]
  });
})();
