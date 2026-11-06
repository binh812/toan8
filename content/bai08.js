// Bài 8 – Tổng và hiệu hai lập phương (SGK Toán 8 KNTT Tập 1, tr. 37–39)
(function () {
// Hình "Nhìn là hiểu": hiệu là khối bỏ góc tách thành ba tấm; tổng là khối (A+B)³ bỏ ba hộp AB(A+B)
function hieu(tenA, tenB, a, b, nhan, ghiChu) {
  return { ten: 'haiLapPhuong', thamSo: { a: a, b: b }, tuyChon: { dang: 'hieu', tenA: tenA, tenB: tenB, nhan: nhan }, ghiChu: ghiChu || 'Hình vẽ khi ' + tenA + ' lớn hơn ' + tenB + '.' };
}
function tong(tenA, tenB, a, b, nhan) { return { ten: 'haiLapPhuong', thamSo: { a: a, b: b }, tuyChon: { dang: 'tong', tenA: tenA, tenB: tenB, nhan: nhan } }; }
function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
// Thẻ Suy ra: bấm nút chỉ bỏ góc và tách tấm, mặt và độ dày các tấm ghi dấu hỏi tới khi em làm đúng
function an(c) { return Object.assign({}, c, { tuyChon: Object.assign({}, c.tuyChon, { anTam: true }) }); }
var X3 = { a2: 'x²', ab: '3x', b2: '9', b3: '27', hieu: 'x−3' }, X2 = { a2: 'x²', ab: '2x', b2: '4', b3: '8', hieu: 'x−2' };
var T1 = { a3: 'x³', a2b: 'x²', ab2: 'x', b3: '1', hop: 'x(x+1)' };

TOAN8.bai({
  id: 8, ten: 'Tổng và hiệu hai lập phương', sgk: { tap: 1, trang: 37 },

  nhin: {
    tieuDe: 'Khối lập phương bỏ một góc, còn lại ba tấm', loai: 'chungMinh',
    luuY: 'Hình đúng khi $a > b > 0$. Nhân phá ngoặc cho thấy công thức đúng với mọi số. Tổng hai lập phương có được khi thay $b$ bởi $-b$; hình của nó ở Ví dụ 1.',
    canh: { ten: 'haiLapPhuong', thuPha: true, tuyChon: { dang: 'hieu' }, moTa: 'Khối lập phương cạnh a bỏ đi khối nhỏ cạnh b ở một góc. Phần còn lại tách thành ba tấm cùng dày a trừ b, mặt lần lượt là a bình phương, a b, b bình phương.',
      dongSo: function (p, f) { // Bước 0,5 nên mọi số ở đây đúng tới ba chữ số thập phân, không phải làm tròn
        var so = function (x) { return String(Math.round(x * 1000) / 1000).replace('.', '{,}'); }, b = Math.max(0.5, Math.min(p.b, p.a - 0.5));
        return '$\\ca{' + so(p.a * p.a * p.a) + '} - \\cb{' + so(b * b * b) + '} = ' + so(p.a * p.a * p.a - b * b * b) + '$\n$(' + so(p.a) + ' - ' + so(b) + ')(\\ca{' + so(p.a * p.a) + '} + \\cc{' + so(p.a * b) + '} + \\cb{' + so(b * b) + '}) = ' + so(p.a * p.a * p.a - b * b * b) + '$'; } },
    buoc: [
      { t: 0, chu: 'Khối lập phương cạnh $\\ca{a}$, thể tích $\\ca{a}^3$. Ở một góc là khối nhỏ cạnh $\\cb{b}$.' },
      { t: 0.1, chu: 'Bỏ khối nhỏ đi. Phần còn lại có thể tích $\\ca{a}^3 - \\cb{b}^3$.' },
      { t: 0.4, chu: 'Tách phần còn lại thành ba tấm. Không cắt thêm, không đổi kích thước.' },
      { t: 0.75, chu: 'Cả ba tấm cùng dày $\\ca{a} - \\cb{b}$ (cạnh tô đỏ). Mặt của chúng là $\\ca{a}\\cdot\\ca{a}$, $\\ca{a}\\cdot\\cb{b}$ và $\\cb{b}\\cdot\\cb{b}$.' }
    ],
    ketLuan: 'Ba tấm cùng dày $a - b$, mặt cộng lại là $a^2 + ab + b^2$: $$\\ca{a}^3 - \\cb{b}^3 = (\\ca{a} - \\cb{b})(\\ca{a^2} + \\cc{ab} + \\cb{b^2})$$',
    dung: {
      tieuDe: 'Đọc ba tấm thành một tích', tuBai: '8.2',
      canh: { ten: 'haiLapPhuong', thamSo: { a: 3.5, b: 1.5 }, t: 1, tuyChon: { dang: 'hieu', tenA: 'x', tenB: '3', anTam: true, nhan: X3 }, ghiChu: 'Hình vẽ khi x lớn hơn 3.',
        moTa: 'Khối lập phương cạnh x bỏ góc cạnh 3, còn ba tấm cùng dày x trừ 3; mặt các tấm ghi dấu hỏi.' },
      moiThu: '$x^3 - 27$ là khối cạnh $x$ bỏ góc cạnh $3$. Mặt của ba tấm là gì? Nếu gõ sai, hình sẽ chỉ ra tấm em tính nhầm.',
      phanUng: [
        { gt: '(x-3)^3', loi: '$(x-3)^3$ chỉ là một khối nhỏ cạnh $x - 3$. Phần còn lại trên hình là **ba tấm** cùng dày $x - 3$; mặt của cả ba cộng lại mới là thừa số thứ hai.' },
        { gt: '(x-3)(x^2-3x+9)', trangThai: 'soiTam2', loi: 'Tấm tô đỏ có mặt $x\\cdot 3 = 3x$. Nó là một tấm có thật nên được **cộng** vào, không trừ.' },
        { gt: '(x-3)(x^2+6x+9)', trangThai: 'soiTam2', loi: 'Chỉ có **một** tấm mặt $x\\cdot 3$ (tô đỏ), không phải hai.' },
        { gt: '(x-3)(x^2+9)', trangThai: 'soiTam2', loi: 'Em quên tấm tô đỏ, mặt $x\\cdot 3 = 3x$.' }
      ],
      dungChu: 'Ba tấm dày $x - 3$, mặt $x^2$, $3x$, $9$: $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$.',
      saiChu: 'Nhìn ba tấm: cùng dày $x - 3$, mặt là $x\\cdot x$, $x\\cdot 3$ và $3\\cdot 3$.'
    },
    suyRa: {
      tieuDe: 'Thấy hiệu hai lập phương là thấy ba tấm',
      baDe: [
        { tuBai: '8.6', canh: an(hieu('4', 'y', 3.5, 1.5, { a2: '16', ab: '4y', b2: 'y²', b3: 'y³', hieu: '4−y' })), tenNut: 'Bỏ góc, tách tấm',
          dungChu: '$64 - y^3 = 4^3 - y^3 = (4 - y)(16 + 4y + y^2)$.', saiChu: 'Khối lớn cạnh $4$ (vì $64 = 4^3$), bỏ góc cạnh $y$. Ba tấm cùng dày $4 - y$, mặt là $4\\cdot 4$, $4\\cdot y$, $y\\cdot y$.' },
        { tuBai: '8.7', canh: an(hieu('x', '2', 3.5, 1.5, X2)), tenNut: 'Bỏ góc, tách tấm',
          dungChu: '$(x - 2)(x^2 + 2x + 4)$ là ba tấm, tức khối $x^3$ đã bỏ góc $8$. Trừ tiếp $x^3$ thì còn $-8$.', saiChu: 'Tích $(x - 2)(x^2 + 2x + 4)$ chính là ba tấm trên hình: khối $x^3$ đã bỏ góc $2^3 = 8$. Lấy cái đó trừ $x^3$.' },
        { tuBai: '8.8', canh: an(hieu('2x', '1', 3.5, 1.5, { a2: '4x²', ab: '2x', b2: '1', b3: '1', hieu: '2x−1' })), tenNut: 'Bỏ góc, tách tấm',
          de: 'Điền vào ô trống: $8x^3 - 1 = (2x - 1)(\\boxed{?} + 2x + 1)$.',
          dapAn: { kieu: 'bieuThuc', gt: '4x^2' },
          goiY: ['$8x^3 = (2x)^3$: khối lớn có cạnh $2x$.', 'Ô trống là mặt của tấm lớn nhất: $(2x)\\cdot(2x)$.'],
          loiGiai: ['$8x^3 - 1 = (2x)^3 - 1^3 = (2x - 1)\\big((2x)^2 + 2x\\cdot 1 + 1^2\\big)$', 'Ô trống là $(2x)^2 = 4x^2$'],
          loiThuongGap: [{ gt: '2x^2', giaiThich: '$(2x)^2 = 2x\\cdot 2x = 4x^2$: bình phương cả hệ số 2.' }],
          dungChu: '$8x^3 - 1 = (2x - 1)(4x^2 + 2x + 1)$: tấm lớn nhất có mặt $2x\\cdot 2x = 4x^2$.', saiChu: 'Khối lớn có cạnh $2x$ (vì $8x^3 = (2x)^3$). Tấm lớn nhất có mặt là hình vuông cạnh $2x$.' }
      ],
      cachNhan: 'Thấy hiệu của hai lập phương ($64 = 4^3$, $8x^3 = (2x)^3$, …): nghĩ tới khối lớn bỏ một góc. Phần còn lại là ba tấm cùng dày $A - B$, mặt $A^2$, $AB$, $B^2$.'
    }
  },

  khamPha: {
    nhiemVu: 'Bạn Tròn hỏi: $a^3 + b^3$ có bằng $(a+b)^3$ không? Em hãy **kiểm chứng bằng số** với $a = 2$, $b = 1$: tính $a^3 + b^3$, tính $(a+b)^3$, và tính thêm tích $(a+b)(a^2 - ab + b^2)$. Biểu thức nào bằng $a^3 + b^3$?\n\nHình dưới là $(a+b)^3 = (a^2 + 2ab + b^2)(a + b)$ chia thành 6 mảnh (như Bài 7). Chỉ có mảnh **cam** $\\ca{a^3}$ và mảnh **xanh** $\\cb{b^3}$ là $a^3 + b^3$; kéo thanh trượt để thấy bốn mảnh còn lại không bao giờ biến mất.',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: 'a', dai: 'a', mau: '#d9480f' }, { nhan: 'b', dai: 'b', mau: '#1971c2' }],
      cot: [{ nhan: 'a^2', dai: 'a^2', mau: '#d9480f' }, { nhan: '2ab', dai: '2ab', mau: '#2f9e44' }, { nhan: 'b^2', dai: 'b^2', mau: '#1971c2' }],
      o: [['\\ca{a^3}', '2a^2b', 'ab^2'], ['a^2b', '2ab^2', '\\cb{b^3}']],
      thanhTruot: [{ ten: 'a', min: 1, max: 3, buoc: 0.5, gt: 2 }, { ten: 'b', min: 1, max: 3, buoc: 0.5, gt: 1 }],
      congThuc: '(a+b)^3 = \\ca{a^3} + \\cb{b^3} + \\cc{3a^2b + 3ab^2} \\ne \\ca{a^3} + \\cb{b^3}',
      // a, b đổi: mảnh cam và mảnh xanh luôn chỉ là một phần nhỏ của cả hình (a+b)^3
      tuChay: [{ thanhTruot: 'a', den: 3, giay: 2 }, { cho: 1 }, { thanhTruot: 'b', den: 2.5, giay: 2 }, { cho: 1 },
        { thanhTruot: 'a', den: 1.5, giay: 2 }, { cho: 1 }, { thanhTruot: 'a', den: 2, giay: 1 }, { thanhTruot: 'b', den: 1, giay: 1.5 }, { cho: 1 }]
    },
    cauHoi: {
      de: 'Với $a = 2$, $b = 1$, em hãy tính:',
      dapAn: { kieu: 'nhieuO', o: [
        { kieu: 'so', gt: 9, nhan: '$a^3 + b^3 = 2^3 + 1^3 =$' },
        { kieu: 'so', gt: 27, nhan: '$(a+b)^3 = 3^3 =$',
          loiThuongGap: [{ gt: 9, giaiThich: '$(2+1)^3 = 3^3 = 27$, không bằng $2^3 + 1^3 = 9$.' }] },
        { kieu: 'so', gt: 9, nhan: '$(a+b)(a^2 - ab + b^2) = (2+1)(4 - 2 + 1) =$',
          loiThuongGap: [{ gt: 21, giaiThich: 'Em tính $4 + 2 + 1$ rồi. Trong ngoặc là $a^2 \\mathbf{-} ab + b^2 = 4 - 2 + 1 = 3$.' }] }] },
      goiY: ['Tính từng lũy thừa trước, ví dụ $2^3 = 2\\cdot 2\\cdot 2$.', '$2^3 = 8$, $1^3 = 1$, $3^3 = 27$; còn $(2+1)(4 - 2 + 1) = 3\\cdot 3$.'],
      loiGiai: [
        '$a^3 + b^3 = 8 + 1 = 9$.',
        '$(a+b)^3 = 3^3 = 27$ — **khác** $9$. Vậy $a^3 + b^3 \\ne (a+b)^3$.',
        '$(a+b)(a^2 - ab + b^2) = 3\\cdot 3 = 9$ — **bằng** $a^3 + b^3$!',
        'Đó chính là hằng đẳng thức tổng hai lập phương: $\\ca{a}^3 + \\cb{b}^3 = (\\ca{a}+\\cb{b})(\\ca{a}^2 - \\ca{a}\\cb{b} + \\cb{b}^2)$.'
      ]
    }
  },

  mucTieu: [
    'Nói được vì sao $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ bằng cách chỉ vào ba tấm cùng dày $a - b$.',
    'Viết tổng và hiệu hai lập phương thành tích, đặt đúng dấu ở cả hai thừa số.',
    'Phân biệt $A^3 - B^3$ với $(A - B)^3$.',
    'Rút gọn biểu thức có tích dạng $(x - 2)(x^2 + 2x + 4)$.'
  ],
  lyThuyet: [
    { loai: 'dinhLi', tieuDe: '1. Tổng hai lập phương',
      noiDung: 'Với $A$, $B$ là hai biểu thức tuỳ ý:\n\n$$\\ca{A}^3 + \\cb{B}^3 = (\\ca{A}+\\cb{B})(\\ca{A}^2 - \\cc{\\ca{A}\\cb{B}} + \\cb{B}^2)$$\n\nKiểm tra: nhân $(A+B)(A^2 - AB + B^2) = A^3 - A^2B + AB^2 + A^2B - AB^2 + B^3 = A^3 + B^3$.' },
    { loai: 'dinhLi', tieuDe: '2. Hiệu hai lập phương',
      noiDung: '$$\\ca{A}^3 - \\cb{B}^3 = (\\ca{A}-\\cb{B})(\\ca{A}^2 + \\cc{\\ca{A}\\cb{B}} + \\cb{B}^2)$$\n\nCó được bằng cách viết $A^3 - B^3 = A^3 + (-B)^3$ rồi dùng tổng hai lập phương.' },
    { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$?', config: {
      de: 'Xếp các bước theo đúng thứ tự lập luận (với $a > b > 0$). Bước nào chưa đủ căn cứ, máy sẽ nói thiếu gì.',
      canh: { ten: 'haiLapPhuong', tuyChon: { dang: 'hieu' } },
      buoc: [
        { id: 'gt', chu: 'Khối lập phương cạnh $a$ có thể tích $a^3$; ở một góc là khối nhỏ cạnh $b$.', canh: { t: 0 } },
        { id: 'bo', chu: 'Bỏ khối nhỏ đi: phần còn lại có thể tích $a^3 - b^3$.', can: ['gt'], canh: { t: 0.35 } },
        { id: 'tach', chu: 'Tách phần còn lại thành ba tấm, không cắt thêm, không đổi kích thước.', can: ['bo'], canh: { t: 0.75 } },
        { id: 'day', chu: 'Cả ba tấm cùng dày $a - b$: cạnh $a$ bỏ đi đoạn $b$ của khối nhỏ.', can: ['tach'], canh: { t: 1 } },
        { id: 'mat', chu: 'Mặt của ba tấm là $a \\cdot a$, $a \\cdot b$ và $b \\cdot b$.', can: ['tach'], canh: { t: 1 } },
        { id: 'the', chu: 'Thể tích một tấm bằng mặt nhân bề dày, nên ba tấm có tổng thể tích $(a - b)(a^2 + ab + b^2)$.', can: ['day', 'mat'], canh: { t: 1 } },
        { id: 'kl', chu: 'Vậy $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$.', can: ['bo', 'the'], canh: { t: 1 } }
      ],
      ketLuan: 'Cùng một phần còn lại, tính thể tích hai cách: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$.'
    } },
    { loai: 'chuY', tieuDe: 'Cách nhớ dấu',
      noiDung: 'Thừa số thứ nhất **cùng dấu** với đề: $A^3 \\mathbf{+} B^3 \\to (A \\mathbf{+} B)$, $\\;A^3 \\mathbf{-} B^3 \\to (A \\mathbf{-} B)$.\n\nTrong thừa số thứ hai, hạng tử $\\cc{AB}$ mang dấu **ngược lại**, còn $A^2$ và $B^2$ luôn **cộng**.\n\nThừa số thứ hai chỉ có $AB$ (hệ số 1), **không** phải $2AB$ như trong bình phương.' },
    { loai: 'chuY', tieuDe: 'Hay nhầm',
      noiDung: '$A^3 + B^3 \\ne (A+B)^3$ và $A^3 - B^3 \\ne (A-B)^3$. (Thử $A = 2$, $B = 1$ thì $A^3 + B^3 = 9$, còn $(A+B)^3 = 27$.)\n\n$x^3 + 8 = (x+2)(x^2 \\mathbf{-} 2x + 4)$ chứ không phải $(x+2)(x^2 + 2x + 4)$.\n\n$x^3 + 8 \\ne (x+2)(x^2 - 4x + 4)$: hạng tử giữa là $AB = 2x$, không có hệ số 2.' },
    { loai: 'text', tieuDe: 'Bảy hằng đẳng thức đáng nhớ',
      noiDung: 'Các hằng đẳng thức đã học dùng rất thường xuyên khi biến đổi biểu thức, nên gọi là **hằng đẳng thức đáng nhớ**:\n\n$$\\begin{aligned} A^2 - B^2 &= (A-B)(A+B)\\\\ (A+B)^2 &= A^2 + 2AB + B^2\\\\ (A-B)^2 &= A^2 - 2AB + B^2\\\\ (A+B)^3 &= A^3 + 3A^2B + 3AB^2 + B^3\\\\ (A-B)^3 &= A^3 - 3A^2B + 3AB^2 - B^3\\\\ A^3 + B^3 &= (A+B)(A^2 - AB + B^2)\\\\ A^3 - B^3 &= (A-B)(A^2 + AB + B^2) \\end{aligned}$$' }
  ],

  viDu: [
    { de: 'Viết $x^3 + 1$ dưới dạng tích.', canh: tong('x', '1', 3, 1.5, T1), buoc: [
      { lam: '$x^3 + 1 = \\ca{x}^3 + \\cb{1}^3$', vi: 'Viết $1 = 1^3$ để thấy tổng hai lập phương với $\\ca{A = x}$, $\\cb{B = 1}$.' },
      { lam: '$= (\\ca{x}+\\cb{1})(\\ca{x}^2 - \\cc{x\\cdot 1} + \\cb{1}^2)$', vi: 'Dùng $A^3 + B^3 = (A+B)(A^2 - AB + B^2)$. Trên hình: khối $(x+1)^3$ có tám khối; sáu khối giữa ghép từng đôi thành ba hộp $x\\cdot 1\\cdot (x+1)$. Bỏ ba hộp thì còn đúng $x^3 + 1$.' },
      { lam: '$= (x+1)(x^2 - x + 1)$', vi: 'Thu gọn. Kiểm lại theo hình: $(x+1)^3 - 3x(x+1) = (x+1)\\big((x+1)^2 - 3x\\big) = (x+1)(x^2 - x + 1)$.' } ] },
    { de: 'Viết $27x^3 - y^3$ dưới dạng tích.', canh: hieu('3x', 'y', 3.5, 1.5, { a2: '9x²', ab: '3xy', b2: 'y²', b3: 'y³', hieu: '3x−y' }), buoc: [
      { lam: '$27x^3 - y^3 = (\\ca{3x})^3 - \\cb{y}^3$', vi: '$27x^3 = (3x)^3$ vì $3^3 = 27$. Đây là hiệu hai lập phương với $\\ca{A = 3x}$, $\\cb{B = y}$.' },
      { lam: '$= (3x - y)\\big((3x)^2 + 3x\\cdot y + y^2\\big)$', vi: 'Dùng $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.' },
      { lam: '$= (3x - y)(9x^2 + 3xy + y^2)$', vi: '$(3x)^2 = 9x^2$.' } ] },
    { de: 'Rút gọn biểu thức $(x+2)(x^2 - 2x + 4) - x^3$.', canh: tong('x', '2', 3, 1.5, { a3: 'x³', a2b: '2x²', ab2: '4x', b3: '8', hop: '2x(x+2)' }), buoc: [
      { lam: '$(x+2)(x^2 - 2x + 4) = x^3 + 2^3 = x^3 + 8$', vi: 'Nhận ra dạng $(A+B)(A^2 - AB + B^2) = A^3 + B^3$ với $A = x$, $B = 2$. Không cần nhân từng hạng tử!' },
      { lam: '$(x+2)(x^2 - 2x + 4) - x^3 = x^3 + 8 - x^3 = 8$', vi: 'Hai hạng tử $x^3$ và $-x^3$ triệt tiêu.' } ] }
  ],

  viDuMo: [
    { de: 'Viết $x^3 - 8$ dưới dạng tích.', buoc: [
      { lam: '$x^3 - 8 = x^3 - 2^3$', vi: 'Hiệu hai lập phương với $A = x$, $B = 2$.' },
      { lam: '$= (x-2)(x^2 + 2x + 4)$', vi: 'Em hãy viết thành tích:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '(x-2)(x^2+2x+4)', dang: 'nhanTu' },
        loiThuongGap: [
          { gt: '(x-2)^3', giaiThich: '$(x-2)^3 = x^3 - 6x^2 + 12x - 8$, không phải $x^3 - 8$.' },
          { gt: '(x-2)(x^2-2x+4)', giaiThich: 'Với hiệu hai lập phương, hạng tử $AB$ trong ngoặc thứ hai mang dấu **cộng**: $x^2 + 2x + 4$.' }] } ] },
    { de: 'Rút gọn $(x-1)(x^2 + x + 1) + 1$.', buoc: [
      { lam: '$(x-1)(x^2 + x + 1) = x^3 - 1$', vi: 'Dạng $(A-B)(A^2 + AB + B^2) = A^3 - B^3$ với $A = x$, $B = 1$.' },
      { lam: '$x^3 - 1 + 1 = x^3$', vi: 'Em hãy viết kết quả rút gọn:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: 'x^3', dang: 'khaiTrien' },
        loiThuongGap: [{ gt: 'x^3+2', giaiThich: '$(x-1)(x^2+x+1) = x^3 - 1$ (dấu trừ), cộng thêm 1 thì được $x^3$.' }] } ] }
  ],

  baiTap: [
    { id: '8.1', hinhGiai: hg(tong('x', '4', 3, 2, { a3: 'x³', a2b: '4x²', ab2: '16x', b3: '64', hop: '4x(x+4)' })), muc: 1, de: 'Viết $x^3 + 64$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(x+4)(x^2-4x+16)', dang: 'nhanTu' },
      goiY: ['$64 = 4^3$. Dùng $A^3 + B^3 = (A+B)(A^2 - AB + B^2)$.', '$A = x$, $B = 4$: $AB = 4x$, $B^2 = 16$.'],
      loiGiai: ['$x^3 + 64 = x^3 + 4^3$', '$= (x+4)(x^2 - 4x + 16)$'],
      loiThuongGap: [
        { gt: '(x+4)^3', giaiThich: '$A^3 + B^3 \\ne (A+B)^3$. $(x+4)^3$ còn có $12x^2$ và $48x$.' },
        { gt: '(x+4)(x^2+4x+16)', giaiThich: 'Với tổng hai lập phương, hạng tử $AB$ trong ngoặc thứ hai mang dấu **trừ**: $x^2 - 4x + 16$.' },
        { gt: '(x+4)(x^2-8x+16)', giaiThich: 'Hạng tử giữa là $AB = 4x$, không phải $2AB$. Đừng nhầm với bình phương của một hiệu.' }] },

    { id: '8.2', hinhGiai: hg(hieu('x', '3', 3.5, 1.5, X3)), muc: 1, de: 'Viết $x^3 - 27$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(x-3)(x^2+3x+9)', dang: 'nhanTu' },
      goiY: ['$27 = 3^3$. Dùng $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.', '$A = x$, $B = 3$: $AB = 3x$, $B^2 = 9$.'],
      loiGiai: ['$x^3 - 27 = x^3 - 3^3$', '$= (x-3)(x^2 + 3x + 9)$'],
      loiThuongGap: [
        { gt: '(x-3)^3', giaiThich: '$A^3 - B^3 \\ne (A-B)^3$. $(x-3)^3 = x^3 - 9x^2 + 27x - 27$.' },
        { gt: '(x-3)(x^2-3x+9)', giaiThich: 'Với hiệu hai lập phương, hạng tử $AB$ mang dấu **cộng**: $x^2 + 3x + 9$.' },
        { gt: '(x-3)(x^2+6x+9)', giaiThich: 'Hạng tử giữa là $AB = 3x$, không phải $2AB = 6x$.' }] },

    { id: '8.3', hinhGiai: hg(hieu('A', 'B', 3.5, 1.5, {})), muc: 1, de: 'Chọn đẳng thức **đúng**.',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['$A^3 + B^3 = (A+B)^3$', '$A^3 + B^3 = (A+B)(A^2 + AB + B^2)$', '$A^3 - B^3 = (A-B)(A^2 - AB + B^2)$', '$A^3 - B^3 = (A-B)(A^2 + AB + B^2)$'] },
      goiY: ['Thừa số thứ nhất cùng dấu với đề, hạng tử $AB$ trong ngoặc thứ hai mang dấu ngược lại.', 'Hiệu hai lập phương: $(A-B)$ và $+AB$.'],
      loiGiai: ['$A^3 + B^3 = (A+B)(A^2 - AB + B^2)$ và $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.', 'Chỉ đáp án cuối đúng.'] },

    { id: '8.4', hinhGiai: hg(tong('x', '1', 3, 1.5, T1)), muc: 1, de: 'Tính $(x+1)(x^2 - x + 1)$.',
      dapAn: { kieu: 'bieuThuc', gt: 'x^3+1', dang: 'khaiTrien' },
      goiY: ['Đây là dạng $(A+B)(A^2 - AB + B^2)$.', 'Kết quả là $A^3 + B^3$ với $A = x$, $B = 1$.'],
      loiGiai: ['$(x+1)(x^2 - x + 1) = x^3 + 1^3$', '$= x^3 + 1$'],
      loiThuongGap: [
        { gt: 'x^3-1', giaiThich: '$(A+B)(A^2 - AB + B^2) = A^3 \\mathbf{+} B^3$, dấu cộng.' },
        { gt: 'x^3+3x^2+3x+1', giaiThich: 'Đó là $(x+1)^3$. Ở đây ngoặc thứ hai là $x^2 - x + 1$, không phải $(x+1)^2$.' }] },

    { id: '8.5', hinhGiai: hg(tong('2x', '3', 3, 2, { a3: '8x³', a2b: '12x²', ab2: '18x', b3: '27', hop: '6x(2x+3)' })), muc: 2, de: 'Viết $8x^3 + 27$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(2x+3)(4x^2-6x+9)', dang: 'nhanTu' },
      goiY: ['$8x^3 = (2x)^3$, $27 = 3^3$.', '$A = 2x$, $B = 3$: $A^2 = 4x^2$, $AB = 6x$, $B^2 = 9$.'],
      loiGiai: ['$8x^3 + 27 = (2x)^3 + 3^3$', '$= (2x+3)(4x^2 - 6x + 9)$'],
      loiThuongGap: [
        { gt: '(2x+3)(4x^2+6x+9)', giaiThich: 'Tổng hai lập phương: hạng tử $AB = 6x$ mang dấu **trừ**.' },
        { gt: '(2x+3)(2x^2-6x+9)', giaiThich: '$A^2 = (2x)^2 = 4x^2$, phải bình phương cả hệ số 2.' },
        { gt: '(2x+3)^3', giaiThich: '$A^3 + B^3 \\ne (A+B)^3$.' }] },

    { id: '8.6', hinhGiai: hg(hieu('4', 'y', 3.5, 1.5, { a2: '16', ab: '4y', b2: 'y²', b3: 'y³', hieu: '4−y' })), muc: 2, de: 'Viết $64 - y^3$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(4-y)(16+4y+y^2)', dang: 'nhanTu' },
      goiY: ['$64 = 4^3$. Đây là hiệu hai lập phương với $A = 4$, $B = y$.', '$(A-B)(A^2 + AB + B^2)$ với $A^2 = 16$, $AB = 4y$.'],
      loiGiai: ['$64 - y^3 = 4^3 - y^3$', '$= (4-y)(16 + 4y + y^2)$'],
      loiThuongGap: [
        { gt: '(4-y)(16-4y+y^2)', giaiThich: 'Hiệu hai lập phương: hạng tử $AB = 4y$ mang dấu **cộng**.' },
        { gt: '(4-y)^3', giaiThich: '$A^3 - B^3 \\ne (A-B)^3$.' }] },

    { id: '8.7', hinhGiai: hg(hieu('x', '2', 3.5, 1.5, X2)), muc: 2, de: 'Rút gọn biểu thức $(x-2)(x^2 + 2x + 4) - x^3$.',
      dapAn: { kieu: 'so', gt: -8 },
      goiY: ['Dạng $(A-B)(A^2 + AB + B^2) = A^3 - B^3$.', '$(x-2)(x^2 + 2x + 4) = x^3 - 8$.'],
      loiGiai: ['$(x-2)(x^2 + 2x + 4) = x^3 - 2^3 = x^3 - 8$', '$(x-2)(x^2 + 2x + 4) - x^3 = x^3 - 8 - x^3 = -8$'],
      loiThuongGap: [{ gt: 8, giaiThich: '$(A-B)(A^2 + AB + B^2) = A^3 \\mathbf{-} B^3 = x^3 - 8$. Vậy kết quả là $-8$.' }] },

    { id: '8.8', hinhGiai: hg(tong('x', '5', 3, 2, { a3: 'x³', a2b: '5x²', ab2: '25x', b3: '125', hop: '5x(x+5)' })), muc: 2, de: 'Điền vào ô trống: $x^3 + 125 = (x+5)(x^2 - \\boxed{?} + 25)$ và $8x^3 - 1 = (2x - 1)(\\boxed{?} + 2x + 1)$.',
      dapAn: { kieu: 'nhieuO', o: [
        { kieu: 'bieuThuc', gt: '5x', nhan: 'Ô thứ nhất',
          loiThuongGap: [{ gt: '10x', giaiThich: 'Hạng tử giữa là $AB = x\\cdot 5 = 5x$, không có hệ số 2.' }] },
        { kieu: 'bieuThuc', gt: '4x^2', nhan: 'Ô thứ hai',
          loiThuongGap: [{ gt: '2x^2', giaiThich: '$A^2 = (2x)^2 = 4x^2$: bình phương cả hệ số 2.' }] }] },
      goiY: ['Ô thứ nhất là $AB$ với $A = x$, $B = 5$.', 'Ô thứ hai là $A^2$ với $A = 2x$.'],
      loiGiai: ['$x^3 + 125 = (x+5)(x^2 - 5x + 25)$, ô thứ nhất là $5x$.', '$8x^3 - 1 = (2x-1)(4x^2 + 2x + 1)$, ô thứ hai là $4x^2$.'] },

    { id: '8.9', hinhGiai: hg(tong('x', '1', 3, 1.5, T1)), muc: 2, de: 'Tính nhanh giá trị của $(x+1)(x^2 - x + 1)$ tại $x = 9$.',
      dapAn: { kieu: 'so', gt: 730 },
      goiY: ['Rút gọn trước: $(x+1)(x^2 - x + 1) = x^3 + 1$.', 'Thay $x = 9$: $9^3 + 1$.'],
      loiGiai: ['$(x+1)(x^2 - x + 1) = x^3 + 1$', 'Tại $x = 9$: $9^3 + 1 = 729 + 1$', '$= 730$'],
      loiThuongGap: [{ gt: 728, giaiThich: 'Kết quả rút gọn là $x^3 \\mathbf{+} 1$, nên $729 + 1 = 730$.' }] },

    { id: '8.10', khongHinh: 'Ghép hai hằng đẳng thức rồi trừ: hình mỗi hằng đẳng thức có ở bài 8.1 và 8.2.', muc: 3, de: 'Rút gọn biểu thức $(x+3)(x^2 - 3x + 9) - (x-3)(x^2 + 3x + 9)$.',
      dapAn: { kieu: 'so', gt: 54 },
      goiY: ['Ngoặc đầu là $x^3 + 27$, ngoặc sau là $x^3 - 27$.', 'Nhớ đổi dấu khi bỏ ngoặc: $(x^3 + 27) - (x^3 - 27)$.'],
      loiGiai: ['$(x+3)(x^2 - 3x + 9) = x^3 + 27$', '$(x-3)(x^2 + 3x + 9) = x^3 - 27$', 'Biểu thức $= (x^3 + 27) - (x^3 - 27) = x^3 + 27 - x^3 + 27 = 54$'],
      loiThuongGap: [{ gt: 0, giaiThich: 'Khi bỏ ngoặc $-(x^3 - 27)$ phải đổi dấu cả $-27$ thành $+27$: kết quả $27 + 27 = 54$.' }] },

    { id: '8.11', khongHinh: 'Ghép hai hằng đẳng thức rồi cộng: hình mỗi hằng đẳng thức có ở bài 8.1 và 8.2.', muc: 3, de: 'Rút gọn biểu thức $(x+y)(x^2 - xy + y^2) + (x-y)(x^2 + xy + y^2)$.',
      dapAn: { kieu: 'bieuThuc', gt: '2x^3', dang: 'khaiTrien' },
      goiY: ['Mỗi tích là một hằng đẳng thức: $x^3 + y^3$ và $x^3 - y^3$.', 'Cộng lại: $y^3$ và $-y^3$ triệt tiêu.'],
      loiGiai: ['$(x+y)(x^2 - xy + y^2) = x^3 + y^3$', '$(x-y)(x^2 + xy + y^2) = x^3 - y^3$', 'Biểu thức $= x^3 + y^3 + x^3 - y^3 = 2x^3$'],
      loiThuongGap: [
        { gt: '2x^3+2y^3', giaiThich: '$(x-y)(x^2 + xy + y^2) = x^3 \\mathbf{-} y^3$ (hiệu hai lập phương), nên $y^3$ triệt tiêu.' },
        { gt: '2y^3', giaiThich: 'Xem lại: tích thứ nhất là $x^3 + y^3$, tích thứ hai là $x^3 - y^3$. Hai hạng tử $x^3$ cộng lại, còn $y^3$ triệt tiêu.' }] },

    { id: '8.12', hinhGiai: hg(tong('x²', 'y²', 3, 2, { a3: 'x⁶', a2b: 'x⁴y²', ab2: 'x²y⁴', b3: 'y⁶', hop: 'x²y²(x²+y²)' })), muc: 3, de: 'Bạn Tròn nói viết được $x^6 + y^6$ thành tích. Em hãy viết $x^6 + y^6$ thành tích của hai đa thức (gợi ý: $x^6 = (x^2)^3$).',
      dapAn: { kieu: 'bieuThuc', gt: '(x^2+y^2)(x^4-x^2y^2+y^4)', dang: 'nhanTu' },
      goiY: ['$x^6 + y^6 = (x^2)^3 + (y^2)^3$: tổng hai lập phương với $A = x^2$, $B = y^2$.', '$A^2 = x^4$, $AB = x^2y^2$, $B^2 = y^4$.'],
      loiGiai: ['$x^6 + y^6 = (x^2)^3 + (y^2)^3$', '$= (x^2 + y^2)\\big((x^2)^2 - x^2y^2 + (y^2)^2\\big)$', '$= (x^2 + y^2)(x^4 - x^2y^2 + y^4)$'],
      loiThuongGap: [
        { gt: '(x^2+y^2)(x^4+x^2y^2+y^4)', giaiThich: 'Tổng hai lập phương: hạng tử $AB = x^2y^2$ mang dấu **trừ**.' },
        { gt: '(x^2+y^2)^3', giaiThich: '$A^3 + B^3 \\ne (A+B)^3$.' }] }
  ],

  timLoi: [
    { de: 'Bạn An viết $x^3 + 27$ thành tích như sau. Dòng nào sai?',
      loiGiaiSai: ['$x^3 + 27 = x^3 + 3^3$', '$= (x+3)(x^2 - 6x + 9)$'],
      dongSai: 1, giaiThich: 'Trong ngoặc thứ hai, hạng tử giữa là $AB = 3x$, không phải $2AB = 6x$. Bạn An nhầm với bình phương của một hiệu.', sua: '$= (x+3)(x^2 - 3x + 9)$' },
    { de: 'Bạn Bình viết $y^3 - 8$ thành tích như sau. Dòng nào sai?',
      loiGiaiSai: ['$y^3 - 8 = y^3 - 2^3$', '$= (y - 2)^3$'],
      dongSai: 1, giaiThich: '$A^3 - B^3 \\ne (A-B)^3$. Thử $y = 1$: $1^3 - 8 = -7$, còn $(1-2)^3 = -1$, hai vế khác nhau. Phải dùng hiệu hai lập phương.', sua: '$= (y-2)(y^2 + 2y + 4)$' },
    { de: 'Bạn Chi viết $a^3 - 1$ thành tích như sau. Dòng nào sai?',
      loiGiaiSai: ['$a^3 - 1 = a^3 - 1^3$', '$= (a - 1)(a^2 - a + 1)$'],
      dongSai: 1, giaiThich: 'Với **hiệu** hai lập phương, hạng tử $AB$ trong ngoặc thứ hai mang dấu **cộng** (ngược dấu với thừa số $a - 1$).', sua: '$= (a-1)(a^2 + a + 1)$' }
  ]
});
})();
