// Bài 1. Đơn thức – SGK Toán 8 KNTT Tập 1, trang 5–10.
TOAN8.bai({
  id: 1, ten: 'Đơn thức', sgk: { tap: 1, trang: 5 },
  khamPha: {
    nhiemVu: 'Một mảnh vườn hình chữ nhật có chiều dài $\\ca{3x}$ và chiều rộng $\\cb{2y}$ (mét). Mảnh vườn được chia thành các ô nhỏ, mỗi ô có kích thước $x \\times y$. Em kéo thanh trượt **x**, **y** rồi **đếm số ô**.',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: 'y', dai: 'y', mau: '#1971c2' }, { nhan: 'y', dai: 'y', mau: '#1971c2' }],
      cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: 'x', dai: 'x', mau: '#d9480f' }],
      thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }, { ten: 'y', min: 1, max: 4, buoc: 0.5, gt: 1.5 }],
      congThuc: 'S = \\ca{3x} \\cdot \\cb{2y} = \\;?'
    },
    cauHoi: {
      de: 'Diện tích $S$ của mảnh vườn $3x \\times 2y$ bằng đơn thức nào? (Mỗi ô nhỏ có diện tích $xy$.)',
      dapAn: { kieu: 'bieuThuc', gt: '6xy', dang: 'khaiTrien' },
      goiY: ['Đếm số ô: có mấy cột, mấy hàng?'],
      loiGiai: ['Có $3$ cột và $2$ hàng nên có $3 \\cdot 2 = 6$ ô, mỗi ô có diện tích $xy$.',
        'Nhân số với số, chữ với chữ: $S = 3x \\cdot 2y = (3 \\cdot 2)(x \\cdot y) = 6xy$']
    }
  },
  lyThuyet: [
    { loai: 'dinhNghia', tieuDe: 'Đơn thức',
      noiDung: '**Đơn thức** là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc có dạng tích của những số và biến.\n\nVí dụ: $6xy$; $-5x^2y$; $\\frac{1}{2}$; $z$ là các đơn thức.\n\n$x + 2y$ **không** là đơn thức (có phép cộng). $\\frac{3}{x}$ **không** là đơn thức (có phép chia cho biến).' },
    { loai: 'dinhNghia', tieuDe: 'Đơn thức thu gọn',
      noiDung: '**Đơn thức thu gọn** là đơn thức chỉ gồm một số, hoặc có dạng tích của một số với những biến, mỗi biến chỉ xuất hiện một lần và đã được nâng lên lũy thừa với số mũ nguyên dương.\n\nĐể thu gọn: nhân các số với nhau, nhân các lũy thừa của cùng một biến với nhau:\n$$2xy \\cdot (-3)x^2 = [2 \\cdot (-3)] \\cdot (x \\cdot x^2) \\cdot y = -6x^3y$$' },
    { loai: 'dinhNghia', tieuDe: 'Hệ số, phần biến, bậc',
      noiDung: 'Trong đơn thức thu gọn $\\ca{-6}\\,\\cb{x^3y}$: phần số $\\ca{-6}$ là **hệ số**, phần còn lại $\\cb{x^3y}$ là **phần biến**.\n\n**Bậc** của đơn thức (thu gọn, hệ số khác 0) là **tổng số mũ** của tất cả các biến.\nVí dụ: $-6x^3y$ có bậc $3 + 1 = 4$; $5x^2y^3z$ có bậc $2 + 3 + 1 = 6$.' },
    { loai: 'chuY',
      noiDung: '• Hệ số $1$ hay $-1$ thì không viết số 1: $xy^2$ có hệ số $1$; $-x^2y$ có hệ số $-1$.\n• Mỗi số khác 0 là một đơn thức thu gọn bậc 0.\n• Số 0 cũng là một đơn thức, nó **không có bậc**.\n• **Hay nhầm:** bậc của $5x^2y^3$ là $2 + 3 = 5$, không phải $3$. Biến $y$ (không ghi số mũ) có số mũ là $1$.' },
    { loai: 'dinhNghia', tieuDe: 'Đơn thức đồng dạng',
      noiDung: 'Hai **đơn thức đồng dạng** là hai đơn thức với hệ số khác 0 và có **phần biến giống nhau**.\n\nVí dụ: $2x^2y^3$ và $-\\frac{1}{2}x^2y^3$ đồng dạng. Còn $2x^2y^3$ và $x^3y^2$ **không** đồng dạng (cùng bậc 5 nhưng phần biến khác nhau).\n\nHai số khác 0 cũng được coi là hai đơn thức đồng dạng.' },
    { loai: 'dinhLi', tieuDe: 'Cộng, trừ hai đơn thức đồng dạng',
      noiDung: 'Muốn cộng (hay trừ) hai đơn thức đồng dạng, ta cộng (hay trừ) các **hệ số** với nhau và **giữ nguyên phần biến**.\n$$\\ca{2}x^2 + \\cc{3}x^2 = (\\ca{2} + \\cc{3})x^2 = 5x^2$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }],
        cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: 'x', dai: 'x', mau: '#d9480f' },
          { nhan: 'x', dai: 'x', mau: '#1971c2' }, { nhan: 'x', dai: 'x', mau: '#1971c2' }, { nhan: 'x', dai: 'x', mau: '#1971c2' }],
        o: [['\\ca{x^2}', '\\ca{x^2}', '\\cc{x^2}', '\\cc{x^2}', '\\cc{x^2}']],
        thanhTruot: [{ ten: 'x', min: 1, max: 3, buoc: 0.5, gt: 2 }],
        congThuc: '\\ca{2x^2} + \\cc{3x^2} = 5x^2'
      },
      chuThich: '2 hình vuông cam và 3 hình vuông xanh lá, mỗi hình đều là $x^2$. Ghép lại được **5 hình vuông** $x^2$, tức là $5x^2$. Hình vuông vẫn là $x^2$, số mũ **không** đổi.' },
    { loai: 'chuY', noiDung: '**Hay nhầm:** $2x^2 + 3x^2 \\ne 5x^4$. Khi **cộng** đơn thức đồng dạng, số mũ giữ nguyên. Chỉ khi **nhân** mới cộng số mũ: $x^2 \\cdot x^3 = x^5$.' }
  ],
  viDu: [
    { de: 'Thu gọn đơn thức $3x^2y \\cdot (-2)xy^3$, rồi cho biết hệ số, phần biến và bậc của nó.', buoc: [
      { lam: '$3x^2y \\cdot (-2)xy^3 = [3 \\cdot (-2)] \\cdot (x^2 \\cdot x) \\cdot (y \\cdot y^3)$', vi: 'Nhóm các số với nhau, các lũy thừa của cùng một biến với nhau.' },
      { lam: '$= -6x^3y^4$', vi: '$3 \\cdot (-2) = -6$; $x^2 \\cdot x = x^3$; $y \\cdot y^3 = y^4$ (nhân thì cộng số mũ).' },
      { lam: 'Hệ số: $-6$. Phần biến: $x^3y^4$. Bậc: $3 + 4 = 7$.', vi: 'Bậc là tổng số mũ của các biến.' } ] },
    { de: 'Cho hai đơn thức đồng dạng $A = 4xy^2$ và $B = -7xy^2$. Tính $A + B$ và $A - B$.', buoc: [
      { lam: '$A + B = 4xy^2 + (-7)xy^2 = [4 + (-7)]xy^2 = -3xy^2$', vi: 'Cộng hai hệ số, giữ nguyên phần biến $xy^2$.' },
      { lam: '$A - B = 4xy^2 - (-7)xy^2 = [4 - (-7)]xy^2 = 11xy^2$', vi: 'Trừ hai hệ số: $4 - (-7) = 4 + 7 = 11$.' } ] },
    { de: 'Tính giá trị của đơn thức $-2x^2y$ tại $x = 3$, $y = -1$.', buoc: [
      { lam: '$-2x^2y = -2 \\cdot 3^2 \\cdot (-1)$', vi: 'Thay $x = 3$, $y = -1$ vào đơn thức.' },
      { lam: '$= -2 \\cdot 9 \\cdot (-1) = 18$', vi: 'Tính lũy thừa trước: $3^2 = 9$, rồi nhân. Âm nhân âm ra dương.' } ] }
  ],
  viDuMo: [
    { de: 'Tính $5x^3y - 8x^3y + x^3y$.', buoc: [
      { lam: '$= (5 - 8 + 1)x^3y$', vi: 'Ba đơn thức đồng dạng (cùng phần biến $x^3y$). Đơn thức $x^3y$ có hệ số là $1$.' },
      { lam: '$= -2x^3y$', vi: 'Em hãy tính kết quả:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '-2x^3y', dang: 'khaiTrien' },
        loiThuongGap: [{ gt: '-3x^3y', giaiThich: 'Đơn thức $x^3y$ có hệ số là $1$, em đừng bỏ quên: $5 - 8 + 1 = -2$.' }] } ] },
    { de: 'Thu gọn đơn thức $-\\frac{1}{2}x^2y \\cdot 4xy^2z$ rồi tìm bậc của nó.', buoc: [
      { lam: '$= \\left(-\\frac{1}{2} \\cdot 4\\right)(x^2 \\cdot x)(y \\cdot y^2)z$', vi: 'Nhóm số với số, lũy thừa cùng biến với nhau.' },
      { lam: '$= -2x^3y^3z$', vi: 'Em hãy viết đơn thức thu gọn:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '-2x^3y^3z', dang: 'khaiTrien' } },
      { lam: 'Bậc: $3 + 3 + 1 = 7$', vi: 'Bậc của đơn thức là bao nhiêu?', an: true,
        dapAn: { kieu: 'so', gt: 7 },
        loiThuongGap: [{ gt: 6, giaiThich: 'Biến $z$ có số mũ $1$, cũng phải cộng vào: $3 + 3 + 1 = 7$.' }] } ] }
  ],
  baiTap: [
    { id: '1.1', muc: 1, de: 'Biểu thức nào sau đây **là đơn thức**?',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['$x + 3y$', '$-\\frac{2}{5}x^2y$', '$\\frac{4}{x}$', '$2\\surd\overline{x}$'] },
      goiY: ['Đơn thức chỉ là một số, một biến, hoặc **tích** của số và biến. Không có phép cộng, trừ, không chia cho biến, không có căn của biến.',
        'Xét từng biểu thức: có dấu $+$ không? có biến ở mẫu không? có căn không?'],
      loiGiai: ['$x + 3y$ có phép cộng; $\\frac{4}{x}$ có biến ở mẫu; $2\\surd\overline{x}$ có căn của biến.',
        'Chỉ $-\\frac{2}{5}x^2y$ là tích của số và biến, nên nó là đơn thức.'] },
    { id: '1.2', muc: 1, de: 'Đúng hay sai: Hai đơn thức $3x^2y$ và $-5xy^2$ là hai đơn thức đồng dạng.',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Hai đơn thức đồng dạng phải có **phần biến giống nhau**.', 'So sánh $x^2y$ với $xy^2$: số mũ của $x$ có giống nhau không?'],
      loiGiai: ['Phần biến của hai đơn thức là $x^2y$ và $xy^2$, khác nhau (số mũ của $x$ là 2 và 1).',
        'Vậy hai đơn thức **không** đồng dạng. Khẳng định **sai**.'] },
    { id: '1.3', muc: 1, de: 'Thu gọn đơn thức $2x^3y \\cdot 5xy^2$.',
      dapAn: { kieu: 'bieuThuc', gt: '10x^4y^3', dang: 'khaiTrien' },
      goiY: ['Nhân các số với nhau, nhân các lũy thừa của cùng một biến với nhau.', '$x^3 \\cdot x = x^{3+1}$, $y \\cdot y^2 = y^{1+2}$.'],
      loiGiai: ['$2x^3y \\cdot 5xy^2 = (2 \\cdot 5)(x^3 \\cdot x)(y \\cdot y^2)$', '$= 10x^4y^3$'],
      loiThuongGap: [
        { gt: '10x^3y^2', giaiThich: 'Em chưa nhân các lũy thừa cùng biến: $x^3 \\cdot x = x^4$ và $y \\cdot y^2 = y^3$.' },
        { gt: '7x^4y^3', giaiThich: 'Khi **nhân** hai đơn thức thì các hệ số cũng **nhân**: $2 \\cdot 5 = 10$, không phải $2 + 5$.' }] },
    { id: '1.4', muc: 1, de: 'Bậc của đơn thức $5x^2y^3$ là bao nhiêu?',
      dapAn: { kieu: 'so', gt: 5 },
      goiY: ['Bậc của đơn thức là **tổng số mũ** của các biến. Hệ số không tính vào bậc.', 'Số mũ của $x$ là bao nhiêu? Của $y$ là bao nhiêu? Cộng lại.'],
      loiGiai: ['Số mũ của $x$ là $2$, số mũ của $y$ là $3$.', 'Bậc là $2 + 3 = 5$'],
      loiThuongGap: [
        { gt: 3, giaiThich: 'Bậc là **tổng** số mũ của tất cả các biến: $2 + 3 = 5$, không phải số mũ lớn nhất.' },
        { gt: 6, giaiThich: 'Bậc là tổng $2 + 3$, không phải tích $2 \\cdot 3$.' },
        { gt: 10, giaiThich: 'Hệ số $5$ không tính vào bậc. Bậc chỉ là tổng số mũ của các biến: $2 + 3 = 5$.' }] },
    { id: '1.5', muc: 1, de: 'Tính $4x^2 + 3x^2$.',
      dapAn: { kieu: 'bieuThuc', gt: '7x^2', dang: 'khaiTrien' },
      goiY: ['Hai đơn thức đồng dạng: cộng hệ số, **giữ nguyên phần biến**.', '$4x^2 + 3x^2 = (4 + 3)x^2$.'],
      loiGiai: ['$4x^2 + 3x^2 = (4 + 3)x^2$', '$= 7x^2$'],
      loiThuongGap: [
        { gt: '7x^4', giaiThich: 'Em đã cộng cả số mũ! Khi **cộng** đơn thức đồng dạng chỉ cộng hệ số, giữ nguyên phần biến $x^2$: $4x^2 + 3x^2 = 7x^2$.' },
        { gt: '12x^2', giaiThich: 'Đây là phép cộng: $4 + 3 = 7$, không phải $4 \\cdot 3$.' },
        { gt: '12x^4', giaiThich: 'Em đã làm như phép nhân. Đây là phép **cộng**: cộng hệ số $4 + 3 = 7$ và giữ nguyên $x^2$.' }] },
    { id: '1.6', muc: 2, de: 'Cho $A = 3xy^3$ và $B = -5xy^3$. Tính $A - B$.',
      dapAn: { kieu: 'bieuThuc', gt: '8xy^3', dang: 'khaiTrien' },
      goiY: ['Trừ hai đơn thức đồng dạng: trừ hệ số, giữ nguyên phần biến.', '$A - B = [3 - (-5)]xy^3$. Trừ một số âm là cộng số đối của nó.'],
      loiGiai: ['$A - B = 3xy^3 - (-5)xy^3 = [3 - (-5)]xy^3$', '$= 8xy^3$'],
      loiThuongGap: [
        { gt: '-2xy^3', giaiThich: 'Trừ một số âm: $3 - (-5) = 3 + 5 = 8$, không phải $-2$.' },
        { gt: '8x^2y^6', giaiThich: 'Em đã cộng cả số mũ. Giữ nguyên phần biến $xy^3$.' }] },
    { id: '1.7', muc: 2, de: 'Tính giá trị của đơn thức $-3x^2y$ tại $x = -2$, $y = \\frac{1}{3}$.',
      dapAn: { kieu: 'so', gt: -4 },
      goiY: ['Thay giá trị của $x$, $y$ vào đơn thức. Tính lũy thừa trước rồi mới nhân.', '$(-2)^2 = (-2) \\cdot (-2) = ?$'],
      loiGiai: ['$-3x^2y = -3 \\cdot (-2)^2 \\cdot \\frac{1}{3}$', '$= -3 \\cdot 4 \\cdot \\frac{1}{3} = -4$'],
      loiThuongGap: [
        { gt: 4, giaiThich: '$(-2)^2 = (-2) \\cdot (-2) = 4$ (dương), không phải $-4$.' },
        { gt: 12, giaiThich: 'Chỉ có $x$ được bình phương: $-3x^2 = -3 \\cdot x^2$, không phải $(-3x)^2$.' }] },
    { id: '1.8', muc: 2, de: 'Thu gọn đơn thức $-\\frac{1}{3}x^2y \\cdot 6xy^2z$, rồi cho biết hệ số và bậc của nó.',
      dapAn: { kieu: 'nhieuO', o: [
        { kieu: 'bieuThuc', gt: '-2x^3y^3z', dang: 'khaiTrien', nhan: 'Đơn thức thu gọn',
          loiThuongGap: [{ gt: '-2x^2y^2z', giaiThich: 'Nhân lũy thừa cùng biến phải cộng số mũ: $x^2 \\cdot x = x^3$, $y \\cdot y^2 = y^3$.' }] },
        { kieu: 'so', gt: -2, nhan: 'Hệ số' },
        { kieu: 'so', gt: 7, nhan: 'Bậc',
          loiThuongGap: [{ gt: 6, giaiThich: 'Biến $z$ có số mũ $1$, cũng phải cộng vào bậc: $3 + 3 + 1 = 7$.' }] }] },
      goiY: ['Thu gọn: nhân các số, nhân lũy thừa cùng biến. Bậc = tổng số mũ các biến.', '$-\\frac{1}{3} \\cdot 6 = -2$; $x^2 \\cdot x = x^3$; $y \\cdot y^2 = y^3$; còn $z$.'],
      loiGiai: ['$-\\frac{1}{3}x^2y \\cdot 6xy^2z = \\left(-\\frac{1}{3} \\cdot 6\\right)(x^2 \\cdot x)(y \\cdot y^2)z = -2x^3y^3z$',
        'Hệ số là $-2$; bậc là $3 + 3 + 1 = 7$.'] },
    { id: '1.9', muc: 3, de: 'Mỗi phần quà gồm $x$ kg gạo (giá 15 nghìn đồng/kg) và $x$ hộp sữa (giá 8 nghìn đồng/hộp). Viết **đơn thức thu gọn** biểu thị tổng số tiền (nghìn đồng) của $y$ phần quà.',
      dapAn: { kieu: 'bieuThuc', gt: '23xy', dang: 'khaiTrien' },
      goiY: ['Tiền gạo của $y$ phần quà là $15xy$; tiền sữa là $8xy$.', 'Cộng hai đơn thức đồng dạng $15xy + 8xy$.'],
      loiGiai: ['Tiền gạo: $15 \\cdot x \\cdot y = 15xy$; tiền sữa: $8 \\cdot x \\cdot y = 8xy$.', 'Tổng số tiền: $15xy + 8xy = 23xy$'],
      loiThuongGap: [
        { gt: '23x^2y^2', giaiThich: 'Em đã cộng cả số mũ. $15xy$ và $8xy$ đồng dạng: chỉ cộng hệ số, phần biến vẫn là $xy$.' },
        { gt: '23x', giaiThich: 'Đó là giá tiền **một** phần quà. Có $y$ phần quà nên phải nhân thêm với $y$.' }] },
    { id: '1.10', muc: 3, de: 'Một mảnh đất gồm hai hình chữ nhật ghép sát nhau (xem hình, kích thước tính bằng mét): hình cam có hai cạnh $3y$ và $2x$, hình xanh có hai cạnh $3y$ và $x$. Viết đơn thức thu gọn biểu thị diện tích cả mảnh đất.',
      hinh: { widget: 'dienTich', config: {
        hang: [{ nhan: '3y', dai: 3, mau: '#d9480f' }],
        cot: [{ nhan: '2x', dai: 4, mau: '#d9480f' }, { nhan: 'x', dai: 2, mau: '#1971c2' }],
        o: [['?', '?']] } },
      dapAn: { kieu: 'bieuThuc', gt: '9xy', dang: 'khaiTrien' },
      goiY: ['Tính diện tích từng hình chữ nhật (dài nhân rộng), rồi cộng lại.', 'Hình cam: $3y \\cdot 2x = 6xy$. Hình xanh: $3y \\cdot x = ?$'],
      loiGiai: ['Hình cam: $3y \\cdot 2x = 6xy$; hình xanh: $3y \\cdot x = 3xy$.', 'Diện tích mảnh đất: $6xy + 3xy = 9xy$'],
      loiThuongGap: [
        { gt: '9x^2y^2', giaiThich: 'Khi cộng $6xy + 3xy$ chỉ cộng hệ số, giữ nguyên phần biến $xy$.' },
        { gt: '18xy', giaiThich: 'Diện tích hai hình phải **cộng** lại: $6xy + 3xy$, không nhân.' }] }
  ],
  timLoi: [
    { de: 'Bạn Nam tính tổng $5x^2y + 3x^2y$ như sau. Dòng nào sai?',
      loiGiaiSai: ['Hai đơn thức $5x^2y$ và $3x^2y$ đồng dạng (cùng phần biến $x^2y$).', '$5x^2y + 3x^2y = 8x^4y^2$'],
      dongSai: 1,
      giaiThich: 'Khi cộng hai đơn thức đồng dạng, ta chỉ cộng hệ số $5 + 3 = 8$ và **giữ nguyên phần biến** $x^2y$. Không được cộng số mũ.',
      sua: '$5x^2y + 3x^2y = 8x^2y$' },
    { de: 'Bạn Nam tìm bậc của đơn thức $-4x^3yz^2$ như sau. Dòng nào sai?',
      loiGiaiSai: ['Hệ số là $-4$, phần biến là $x^3yz^2$.', 'Số mũ của $x$, $y$, $z$ lần lượt là $3$, $0$, $2$.', 'Vậy bậc của đơn thức là $3 + 0 + 2 = 5$.'],
      dongSai: 1,
      giaiThich: 'Biến $y$ không ghi số mũ nghĩa là số mũ bằng $1$ (vì $y = y^1$), không phải $0$.',
      sua: 'Số mũ của $x$, $y$, $z$ là $3$, $1$, $2$ nên bậc là $3 + 1 + 2 = 6$.' }
  ]
});
