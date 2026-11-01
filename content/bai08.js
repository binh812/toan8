// Bài 8 – Tổng và hiệu hai lập phương (SGK Toán 8 KNTT Tập 1, tr. 37–39)
TOAN8.bai({
  id: 8, ten: 'Tổng và hiệu hai lập phương', sgk: { tap: 1, trang: 37 },

  khamPha: {
    nhiemVu: 'Bạn Tròn hỏi: $a^3 + b^3$ có bằng $(a+b)^3$ không? Em hãy **kiểm chứng bằng số** với $a = 2$, $b = 1$: tính $a^3 + b^3$, tính $(a+b)^3$, và tính thêm tích $(a+b)(a^2 - ab + b^2)$. Biểu thức nào bằng $a^3 + b^3$?',
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

  lyThuyet: [
    { loai: 'dinhLi', tieuDe: '1. Tổng hai lập phương',
      noiDung: 'Với $A$, $B$ là hai biểu thức tuỳ ý:\n\n$$\\ca{A}^3 + \\cb{B}^3 = (\\ca{A}+\\cb{B})(\\ca{A}^2 - \\cc{\\ca{A}\\cb{B}} + \\cb{B}^2)$$\n\nKiểm tra: nhân $(A+B)(A^2 - AB + B^2) = A^3 - A^2B + AB^2 + A^2B - AB^2 + B^3 = A^3 + B^3$.' },
    { loai: 'dinhLi', tieuDe: '2. Hiệu hai lập phương',
      noiDung: '$$\\ca{A}^3 - \\cb{B}^3 = (\\ca{A}-\\cb{B})(\\ca{A}^2 + \\cc{\\ca{A}\\cb{B}} + \\cb{B}^2)$$\n\nCó được bằng cách viết $A^3 - B^3 = A^3 + (-B)^3$ rồi dùng tổng hai lập phương.' },
    { loai: 'chuY', tieuDe: 'Cách nhớ dấu',
      noiDung: 'Thừa số thứ nhất **cùng dấu** với đề: $A^3 \\mathbf{+} B^3 \\to (A \\mathbf{+} B)$, $\\;A^3 \\mathbf{-} B^3 \\to (A \\mathbf{-} B)$.\n\nTrong thừa số thứ hai, hạng tử $\\cc{AB}$ mang dấu **ngược lại**, còn $A^2$ và $B^2$ luôn **cộng**.\n\nThừa số thứ hai chỉ có $AB$ (hệ số 1), **không** phải $2AB$ như trong bình phương.' },
    { loai: 'chuY', tieuDe: 'Hay nhầm',
      noiDung: '$A^3 + B^3 \\ne (A+B)^3$ và $A^3 - B^3 \\ne (A-B)^3$. (Thử $A = 2$, $B = 1$ thì $A^3 + B^3 = 9$, còn $(A+B)^3 = 27$.)\n\n$x^3 + 8 = (x+2)(x^2 \\mathbf{-} 2x + 4)$ chứ không phải $(x+2)(x^2 + 2x + 4)$.\n\n$x^3 + 8 \\ne (x+2)(x^2 - 4x + 4)$: hạng tử giữa là $AB = 2x$, không có hệ số 2.' },
    { loai: 'text', tieuDe: 'Bảy hằng đẳng thức đáng nhớ',
      noiDung: 'Các hằng đẳng thức đã học dùng rất thường xuyên khi biến đổi biểu thức, nên gọi là **hằng đẳng thức đáng nhớ**:\n\n$$\\begin{aligned} A^2 - B^2 &= (A-B)(A+B)\\\\ (A+B)^2 &= A^2 + 2AB + B^2\\\\ (A-B)^2 &= A^2 - 2AB + B^2\\\\ (A+B)^3 &= A^3 + 3A^2B + 3AB^2 + B^3\\\\ (A-B)^3 &= A^3 - 3A^2B + 3AB^2 - B^3\\\\ A^3 + B^3 &= (A+B)(A^2 - AB + B^2)\\\\ A^3 - B^3 &= (A-B)(A^2 + AB + B^2) \\end{aligned}$$' }
  ],

  viDu: [
    { de: 'Viết $x^3 + 1$ dưới dạng tích.', buoc: [
      { lam: '$x^3 + 1 = \\ca{x}^3 + \\cb{1}^3$', vi: 'Viết $1 = 1^3$ để thấy tổng hai lập phương với $\\ca{A = x}$, $\\cb{B = 1}$.' },
      { lam: '$= (\\ca{x}+\\cb{1})(\\ca{x}^2 - \\cc{x\\cdot 1} + \\cb{1}^2)$', vi: 'Dùng $A^3 + B^3 = (A+B)(A^2 - AB + B^2)$.' },
      { lam: '$= (x+1)(x^2 - x + 1)$', vi: 'Thu gọn.' } ] },
    { de: 'Viết $27x^3 - y^3$ dưới dạng tích.', buoc: [
      { lam: '$27x^3 - y^3 = (\\ca{3x})^3 - \\cb{y}^3$', vi: '$27x^3 = (3x)^3$ vì $3^3 = 27$. Đây là hiệu hai lập phương với $\\ca{A = 3x}$, $\\cb{B = y}$.' },
      { lam: '$= (3x - y)\\big((3x)^2 + 3x\\cdot y + y^2\\big)$', vi: 'Dùng $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.' },
      { lam: '$= (3x - y)(9x^2 + 3xy + y^2)$', vi: '$(3x)^2 = 9x^2$.' } ] },
    { de: 'Rút gọn biểu thức $(x+2)(x^2 - 2x + 4) - x^3$.', buoc: [
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
    { id: '8.1', muc: 1, de: 'Viết $x^3 + 64$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(x+4)(x^2-4x+16)', dang: 'nhanTu' },
      goiY: ['$64 = 4^3$. Dùng $A^3 + B^3 = (A+B)(A^2 - AB + B^2)$.', '$A = x$, $B = 4$: $AB = 4x$, $B^2 = 16$.'],
      loiGiai: ['$x^3 + 64 = x^3 + 4^3$', '$= (x+4)(x^2 - 4x + 16)$'],
      loiThuongGap: [
        { gt: '(x+4)^3', giaiThich: '$A^3 + B^3 \\ne (A+B)^3$. $(x+4)^3$ còn có $12x^2$ và $48x$.' },
        { gt: '(x+4)(x^2+4x+16)', giaiThich: 'Với tổng hai lập phương, hạng tử $AB$ trong ngoặc thứ hai mang dấu **trừ**: $x^2 - 4x + 16$.' },
        { gt: '(x+4)(x^2-8x+16)', giaiThich: 'Hạng tử giữa là $AB = 4x$, không phải $2AB$. Đừng nhầm với bình phương của một hiệu.' }] },

    { id: '8.2', muc: 1, de: 'Viết $x^3 - 27$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(x-3)(x^2+3x+9)', dang: 'nhanTu' },
      goiY: ['$27 = 3^3$. Dùng $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.', '$A = x$, $B = 3$: $AB = 3x$, $B^2 = 9$.'],
      loiGiai: ['$x^3 - 27 = x^3 - 3^3$', '$= (x-3)(x^2 + 3x + 9)$'],
      loiThuongGap: [
        { gt: '(x-3)^3', giaiThich: '$A^3 - B^3 \\ne (A-B)^3$. $(x-3)^3 = x^3 - 9x^2 + 27x - 27$.' },
        { gt: '(x-3)(x^2-3x+9)', giaiThich: 'Với hiệu hai lập phương, hạng tử $AB$ mang dấu **cộng**: $x^2 + 3x + 9$.' },
        { gt: '(x-3)(x^2+6x+9)', giaiThich: 'Hạng tử giữa là $AB = 3x$, không phải $2AB = 6x$.' }] },

    { id: '8.3', muc: 1, de: 'Chọn đẳng thức **đúng**.',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['$A^3 + B^3 = (A+B)^3$', '$A^3 + B^3 = (A+B)(A^2 + AB + B^2)$', '$A^3 - B^3 = (A-B)(A^2 - AB + B^2)$', '$A^3 - B^3 = (A-B)(A^2 + AB + B^2)$'] },
      goiY: ['Thừa số thứ nhất cùng dấu với đề, hạng tử $AB$ trong ngoặc thứ hai mang dấu ngược lại.', 'Hiệu hai lập phương: $(A-B)$ và $+AB$.'],
      loiGiai: ['$A^3 + B^3 = (A+B)(A^2 - AB + B^2)$ và $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$.', 'Chỉ đáp án cuối đúng.'] },

    { id: '8.4', muc: 1, de: 'Tính $(x+1)(x^2 - x + 1)$.',
      dapAn: { kieu: 'bieuThuc', gt: 'x^3+1', dang: 'khaiTrien' },
      goiY: ['Đây là dạng $(A+B)(A^2 - AB + B^2)$.', 'Kết quả là $A^3 + B^3$ với $A = x$, $B = 1$.'],
      loiGiai: ['$(x+1)(x^2 - x + 1) = x^3 + 1^3$', '$= x^3 + 1$'],
      loiThuongGap: [
        { gt: 'x^3-1', giaiThich: '$(A+B)(A^2 - AB + B^2) = A^3 \\mathbf{+} B^3$, dấu cộng.' },
        { gt: 'x^3+3x^2+3x+1', giaiThich: 'Đó là $(x+1)^3$. Ở đây ngoặc thứ hai là $x^2 - x + 1$, không phải $(x+1)^2$.' }] },

    { id: '8.5', muc: 2, de: 'Viết $8x^3 + 27$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(2x+3)(4x^2-6x+9)', dang: 'nhanTu' },
      goiY: ['$8x^3 = (2x)^3$, $27 = 3^3$.', '$A = 2x$, $B = 3$: $A^2 = 4x^2$, $AB = 6x$, $B^2 = 9$.'],
      loiGiai: ['$8x^3 + 27 = (2x)^3 + 3^3$', '$= (2x+3)(4x^2 - 6x + 9)$'],
      loiThuongGap: [
        { gt: '(2x+3)(4x^2+6x+9)', giaiThich: 'Tổng hai lập phương: hạng tử $AB = 6x$ mang dấu **trừ**.' },
        { gt: '(2x+3)(2x^2-6x+9)', giaiThich: '$A^2 = (2x)^2 = 4x^2$, phải bình phương cả hệ số 2.' },
        { gt: '(2x+3)^3', giaiThich: '$A^3 + B^3 \\ne (A+B)^3$.' }] },

    { id: '8.6', muc: 2, de: 'Viết $64 - y^3$ dưới dạng tích.',
      dapAn: { kieu: 'bieuThuc', gt: '(4-y)(16+4y+y^2)', dang: 'nhanTu' },
      goiY: ['$64 = 4^3$. Đây là hiệu hai lập phương với $A = 4$, $B = y$.', '$(A-B)(A^2 + AB + B^2)$ với $A^2 = 16$, $AB = 4y$.'],
      loiGiai: ['$64 - y^3 = 4^3 - y^3$', '$= (4-y)(16 + 4y + y^2)$'],
      loiThuongGap: [
        { gt: '(4-y)(16-4y+y^2)', giaiThich: 'Hiệu hai lập phương: hạng tử $AB = 4y$ mang dấu **cộng**.' },
        { gt: '(4-y)^3', giaiThich: '$A^3 - B^3 \\ne (A-B)^3$.' }] },

    { id: '8.7', muc: 2, de: 'Rút gọn biểu thức $(x-2)(x^2 + 2x + 4) - x^3$.',
      dapAn: { kieu: 'so', gt: -8 },
      goiY: ['Dạng $(A-B)(A^2 + AB + B^2) = A^3 - B^3$.', '$(x-2)(x^2 + 2x + 4) = x^3 - 8$.'],
      loiGiai: ['$(x-2)(x^2 + 2x + 4) = x^3 - 2^3 = x^3 - 8$', '$(x-2)(x^2 + 2x + 4) - x^3 = x^3 - 8 - x^3 = -8$'],
      loiThuongGap: [{ gt: 8, giaiThich: '$(A-B)(A^2 + AB + B^2) = A^3 \\mathbf{-} B^3 = x^3 - 8$. Vậy kết quả là $-8$.' }] },

    { id: '8.8', muc: 2, de: 'Điền vào ô trống: $x^3 + 125 = (x+5)(x^2 - \\boxed{?} + 25)$ và $8x^3 - 1 = (2x - 1)(\\boxed{?} + 2x + 1)$.',
      dapAn: { kieu: 'nhieuO', o: [
        { kieu: 'bieuThuc', gt: '5x', nhan: 'Ô thứ nhất',
          loiThuongGap: [{ gt: '10x', giaiThich: 'Hạng tử giữa là $AB = x\\cdot 5 = 5x$, không có hệ số 2.' }] },
        { kieu: 'bieuThuc', gt: '4x^2', nhan: 'Ô thứ hai',
          loiThuongGap: [{ gt: '2x^2', giaiThich: '$A^2 = (2x)^2 = 4x^2$: bình phương cả hệ số 2.' }] }] },
      goiY: ['Ô thứ nhất là $AB$ với $A = x$, $B = 5$.', 'Ô thứ hai là $A^2$ với $A = 2x$.'],
      loiGiai: ['$x^3 + 125 = (x+5)(x^2 - 5x + 25)$, ô thứ nhất là $5x$.', '$8x^3 - 1 = (2x-1)(4x^2 + 2x + 1)$, ô thứ hai là $4x^2$.'] },

    { id: '8.9', muc: 2, de: 'Tính nhanh giá trị của $(x+1)(x^2 - x + 1)$ tại $x = 9$.',
      dapAn: { kieu: 'so', gt: 730 },
      goiY: ['Rút gọn trước: $(x+1)(x^2 - x + 1) = x^3 + 1$.', 'Thay $x = 9$: $9^3 + 1$.'],
      loiGiai: ['$(x+1)(x^2 - x + 1) = x^3 + 1$', 'Tại $x = 9$: $9^3 + 1 = 729 + 1$', '$= 730$'],
      loiThuongGap: [{ gt: 728, giaiThich: 'Kết quả rút gọn là $x^3 \\mathbf{+} 1$, nên $729 + 1 = 730$.' }] },

    { id: '8.10', muc: 3, de: 'Rút gọn biểu thức $(x+3)(x^2 - 3x + 9) - (x-3)(x^2 + 3x + 9)$.',
      dapAn: { kieu: 'so', gt: 54 },
      goiY: ['Ngoặc đầu là $x^3 + 27$, ngoặc sau là $x^3 - 27$.', 'Nhớ đổi dấu khi bỏ ngoặc: $(x^3 + 27) - (x^3 - 27)$.'],
      loiGiai: ['$(x+3)(x^2 - 3x + 9) = x^3 + 27$', '$(x-3)(x^2 + 3x + 9) = x^3 - 27$', 'Biểu thức $= (x^3 + 27) - (x^3 - 27) = x^3 + 27 - x^3 + 27 = 54$'],
      loiThuongGap: [{ gt: 0, giaiThich: 'Khi bỏ ngoặc $-(x^3 - 27)$ phải đổi dấu cả $-27$ thành $+27$: kết quả $27 + 27 = 54$.' }] },

    { id: '8.11', muc: 3, de: 'Rút gọn biểu thức $(x+y)(x^2 - xy + y^2) + (x-y)(x^2 + xy + y^2)$.',
      dapAn: { kieu: 'bieuThuc', gt: '2x^3', dang: 'khaiTrien' },
      goiY: ['Mỗi tích là một hằng đẳng thức: $x^3 + y^3$ và $x^3 - y^3$.', 'Cộng lại: $y^3$ và $-y^3$ triệt tiêu.'],
      loiGiai: ['$(x+y)(x^2 - xy + y^2) = x^3 + y^3$', '$(x-y)(x^2 + xy + y^2) = x^3 - y^3$', 'Biểu thức $= x^3 + y^3 + x^3 - y^3 = 2x^3$'],
      loiThuongGap: [
        { gt: '2x^3+2y^3', giaiThich: '$(x-y)(x^2 + xy + y^2) = x^3 \\mathbf{-} y^3$ (hiệu hai lập phương), nên $y^3$ triệt tiêu.' },
        { gt: '2y^3', giaiThich: 'Xem lại: tích thứ nhất là $x^3 + y^3$, tích thứ hai là $x^3 - y^3$. Hai hạng tử $x^3$ cộng lại, còn $y^3$ triệt tiêu.' }] },

    { id: '8.12', muc: 3, de: 'Bạn Tròn nói viết được $x^6 + y^6$ thành tích. Em hãy viết $x^6 + y^6$ thành tích của hai đa thức (gợi ý: $x^6 = (x^2)^3$).',
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
