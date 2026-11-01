// Bài 2. Đa thức – SGK Toán 8 KNTT Tập 1, trang 11–14.
TOAN8.bai({
  id: 2, ten: 'Đa thức', sgk: { tap: 1, trang: 11 },
  khamPha: {
    nhiemVu: 'Hình chữ nhật dưới đây có chiều rộng $x$ và được ghép từ **5 mảnh**. Diện tích cả hình là tổng diện tích các mảnh: $S = x^2 + xy + x^2 + xy + xy$. Em kéo thanh trượt rồi quan sát: những mảnh nào **cùng nhãn, cùng màu** (cùng phần biến)?',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }],
      cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: 'y', dai: 'y', mau: '#1971c2' }, { nhan: 'x', dai: 'x', mau: '#d9480f' },
        { nhan: 'y', dai: 'y', mau: '#1971c2' }, { nhan: 'y', dai: 'y', mau: '#1971c2' }],
      thanhTruot: [{ ten: 'x', min: 1, max: 3, buoc: 0.5, gt: 2 }, { ten: 'y', min: 1, max: 3, buoc: 0.5, gt: 1.5 }],
      congThuc: 'S = \\ca{x^2} + \\cc{xy} + \\ca{x^2} + \\cc{xy} + \\cc{xy}'
    },
    cauHoi: {
      de: 'Gộp các mảnh cùng nhãn lại, tổng diện tích $S = x^2 + xy + x^2 + xy + xy$ viết gọn là:',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['$2x^2 + 3xy$', '$5x^2y$', '$2x^4 + 3x^3y^3$', '$x^2 + xy$'] },
      goiY: ['Có mấy mảnh $x^2$? Có mấy mảnh $xy$? Mảnh $x^2$ và mảnh $xy$ có gộp được không?'],
      loiGiai: ['Có 2 mảnh $x^2$ (cam) và 3 mảnh $xy$ (xanh lá).', 'Chỉ gộp được các mảnh **cùng phần biến**: $S = (x^2 + x^2) + (xy + xy + xy) = 2x^2 + 3xy$.']
    }
  },
  lyThuyet: [
    { loai: 'dinhNghia', tieuDe: 'Đa thức',
      noiDung: '**Đa thức** là tổng của những đơn thức; mỗi đơn thức trong tổng gọi là một **hạng tử** của đa thức đó.\n\nVí dụ: $A = x^3 - 3x^2y + xy - 1$ viết được thành $x^3 + (-3x^2y) + xy + (-1)$, nên $A$ có 4 hạng tử: $x^3$; $-3x^2y$; $xy$; $-1$.\n\n**Chú ý:** Mỗi đơn thức cũng được coi là một đa thức.' },
    { loai: 'chuY', noiDung: 'Hạng tử mang theo **dấu** đứng trước nó: trong $x^3 - 3x^2y$, hạng tử thứ hai là $-3x^2y$ (không phải $3x^2y$).\n\nBiểu thức có biến ở mẫu (như $x + \\frac{2}{y}$) hoặc có căn của biến (như $\\surd\overline{x}$) thì **không** là đa thức.' },
    { loai: 'dinhNghia', tieuDe: 'Đa thức thu gọn',
      noiDung: '**Đa thức thu gọn** là đa thức không có hai hạng tử nào đồng dạng.\n\nMuốn thu gọn một đa thức: **nhóm** các hạng tử đồng dạng, rồi **cộng** các hạng tử đồng dạng trong mỗi nhóm.\n$$B = 2x^2 - 3xy + x^2 + 5xy = (\\ca{2x^2 + x^2}) + (\\cc{-3xy + 5xy}) = \\ca{3x^2} + \\cc{2xy}$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }],
        cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: 'y', dai: 'y', mau: '#1971c2' }, { nhan: 'x', dai: 'x', mau: '#d9480f' },
          { nhan: 'y', dai: 'y', mau: '#1971c2' }, { nhan: 'y', dai: 'y', mau: '#1971c2' }],
        thanhTruot: [{ ten: 'x', min: 1, max: 3, buoc: 0.5, gt: 2 }, { ten: 'y', min: 1, max: 3, buoc: 0.5, gt: 1.5 }],
        congThuc: '\\ca{x^2} + \\cc{xy} + \\ca{x^2} + \\cc{xy} + \\cc{xy} = \\ca{2x^2} + \\cc{3xy}'
      },
      chuThich: 'Các mảnh cùng màu là các hạng tử **đồng dạng**: $x^2 + x^2 = 2x^2$; $xy + xy + xy = 3xy$. Mảnh $x^2$ và mảnh $xy$ khác loại nên không gộp được.' },
    { loai: 'dinhNghia', tieuDe: 'Bậc của đa thức',
      noiDung: '**Bậc của một đa thức** là bậc của hạng tử có bậc **cao nhất** trong dạng thu gọn của đa thức đó.\n\nVí dụ: $x^2y + 3x - 1$ có các hạng tử bậc $3$; $1$; $0$. Bậc của đa thức là $3$.\n\n• Một số khác 0 là một đa thức bậc 0.\n• Số 0 là **đa thức không**, nó không có bậc.' },
    { loai: 'chuY', noiDung: '**Hay nhầm 1:** bậc của đa thức **không phải** tổng bậc các hạng tử. Với $x^2y + 3x - 1$: bậc là $3$ (lớn nhất), không phải $3 + 1 + 0 = 4$.\n\n**Hay nhầm 2:** phải **thu gọn trước** rồi mới tìm bậc. Ví dụ $x^4 + 2xy - x^4 = 2xy$ có bậc $2$, không phải $4$.\n\nMuốn tính giá trị của đa thức, nên thu gọn trước rồi mới thay số cho nhanh.' }
  ],
  viDu: [
    { de: 'Thu gọn đa thức $M = 2x^2y - 3xy + 5xy^2 + 4x^2y - xy^2 + 7$.', buoc: [
      { lam: '$M = (2x^2y + 4x^2y) + (5xy^2 - xy^2) - 3xy + 7$', vi: 'Đổi chỗ và nhóm các hạng tử đồng dạng (cùng phần biến).' },
      { lam: '$= 6x^2y + 4xy^2 - 3xy + 7$', vi: 'Cộng hệ số trong mỗi nhóm: $2 + 4 = 6$; $5 - 1 = 4$. Phần biến giữ nguyên.' } ] },
    { de: 'Cho $P = 2x^3 + xy - 2x^3 + 3x^2y - 5$. a) Tìm bậc của $P$. b) Tính giá trị của $P$ tại $x = 2$, $y = -1$.', buoc: [
      { lam: '$P = (2x^3 - 2x^3) + 3x^2y + xy - 5 = 3x^2y + xy - 5$', vi: 'Thu gọn trước: $2x^3 - 2x^3 = 0$.' },
      { lam: 'Các hạng tử $3x^2y$; $xy$; $-5$ có bậc $3$; $2$; $0$. Vậy bậc của $P$ là $3$.', vi: 'Lấy bậc **lớn nhất**, không cộng các bậc.' },
      { lam: '$P = 3 \\cdot 2^2 \\cdot (-1) + 2 \\cdot (-1) - 5 = -12 - 2 - 5 = -19$', vi: 'Thay $x = 2$, $y = -1$ vào dạng thu gọn.' } ] }
  ],
  viDuMo: [
    { de: 'Thu gọn rồi tìm bậc của đa thức $Q = 4xy^2 - x^2 + 3 - 6xy^2 + 2x^2$.', buoc: [
      { lam: '$Q = (4xy^2 - 6xy^2) + (-x^2 + 2x^2) + 3$', vi: 'Nhóm các hạng tử đồng dạng.' },
      { lam: '$= -2xy^2 + x^2 + 3$', vi: 'Em hãy viết dạng thu gọn của $Q$:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '-2xy^2+x^2+3', dang: 'khaiTrien' },
        loiThuongGap: [{ gt: '2xy^2+x^2+3', giaiThich: 'Chú ý dấu: $4 - 6 = -2$, nên hạng tử là $-2xy^2$.' }] },
      { lam: 'Bậc của $Q$ là $3$', vi: 'Các hạng tử có bậc $3$; $2$; $0$. Bậc của $Q$ là bao nhiêu?', an: true,
        dapAn: { kieu: 'so', gt: 3 },
        loiThuongGap: [{ gt: 5, giaiThich: 'Bậc của đa thức là bậc **lớn nhất** của các hạng tử ($3$), không phải tổng $3 + 2 + 0$.' }] } ] }
  ],
  baiTap: [
    { id: '2.1', muc: 1, de: 'Biểu thức nào sau đây **không** là đa thức?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['$3x^2 - 2xy + 1$', '$\\frac{x}{3} + y$', '$x + \\frac{2}{y}$', '$2025$'] },
      goiY: ['Đa thức là tổng các đơn thức. Đơn thức không chia cho biến.', 'Biểu thức nào có **biến ở mẫu**? ($\\frac{x}{3} = \\frac{1}{3}x$ vẫn là đơn thức.)'],
      loiGiai: ['$\\frac{x}{3} = \\frac{1}{3}x$ là đơn thức; $2025$ là một số nên cũng là đa thức.', '$\\frac{2}{y}$ có biến ở mẫu nên không là đơn thức. Vậy $x + \\frac{2}{y}$ **không** là đa thức.'] },
    { id: '2.2', muc: 1, de: 'Đa thức $A = 5x^2y - xy + 3x - 8$ có bao nhiêu hạng tử?',
      dapAn: { kieu: 'so', gt: 4 },
      goiY: ['Mỗi đơn thức trong tổng là một hạng tử, kể cả số.', 'Viết $A = 5x^2y + (-xy) + 3x + (-8)$ rồi đếm.'],
      loiGiai: ['$A = 5x^2y + (-xy) + 3x + (-8)$', 'Các hạng tử: $5x^2y$; $-xy$; $3x$; $-8$. Số hạng tử $= 4$'],
      loiThuongGap: [{ gt: 3, giaiThich: 'Số $-8$ cũng là một hạng tử (hạng tử bậc 0). Có 4 hạng tử.' }] },
    { id: '2.3', muc: 1, de: 'Đúng hay sai: Đa thức $x^2 + 2xy - 3x^2 + y$ là đa thức thu gọn.',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Đa thức thu gọn không có hai hạng tử nào đồng dạng.', 'Tìm xem có hai hạng tử nào cùng phần biến không.'],
      loiGiai: ['Hai hạng tử $x^2$ và $-3x^2$ đồng dạng (cùng phần biến $x^2$).', 'Vậy đa thức chưa thu gọn. Khẳng định **sai**.'] },
    { id: '2.4', muc: 1, de: 'Thu gọn đa thức $3x^2 - 2xy + x^2 + 5xy - y^2$.',
      dapAn: { kieu: 'bieuThuc', gt: '4x^2+3xy-y^2', dang: 'khaiTrien' },
      goiY: ['Nhóm các hạng tử đồng dạng: nhóm $x^2$, nhóm $xy$.', '$(3x^2 + x^2) + (-2xy + 5xy) - y^2$.'],
      loiGiai: ['$= (3x^2 + x^2) + (-2xy + 5xy) - y^2$', '$= 4x^2 + 3xy - y^2$'],
      loiThuongGap: [
        { gt: '4x^4+3x^2y^2-y^2', giaiThich: 'Em đã cộng cả số mũ. Khi cộng hạng tử đồng dạng chỉ cộng hệ số, giữ nguyên phần biến.' },
        { gt: '4x^2-7xy-y^2', giaiThich: 'Chú ý dấu: $-2xy + 5xy = (-2 + 5)xy = 3xy$.' }] },
    { id: '2.5', muc: 2, de: 'Tìm bậc của đa thức $x^3y^2 - 4xy + 2x^2 + 1$.',
      dapAn: { kieu: 'so', gt: 5 },
      goiY: ['Đa thức đã thu gọn. Tìm bậc của từng hạng tử, rồi lấy bậc **lớn nhất**.', 'Bậc của $x^3y^2$ là $3 + 2$.'],
      loiGiai: ['Các hạng tử $x^3y^2$; $-4xy$; $2x^2$; $1$ có bậc lần lượt là $5$; $2$; $2$; $0$.', 'Bậc của đa thức là $5$'],
      loiThuongGap: [
        { gt: 9, giaiThich: 'Em đã cộng bậc các hạng tử ($5 + 2 + 2 + 0$). Bậc của đa thức là bậc **lớn nhất** của các hạng tử: $5$.' },
        { gt: 3, giaiThich: 'Bậc của hạng tử $x^3y^2$ là $3 + 2 = 5$ (cộng số mũ của mọi biến), không phải $3$.' }] },
    { id: '2.6', muc: 2, de: 'Tìm bậc của đa thức $H = 2x^5 - x^2y + 4xy - 2x^5 + 3$.',
      dapAn: { kieu: 'so', gt: 3 },
      goiY: ['Phải **thu gọn trước** rồi mới tìm bậc.', '$2x^5 - 2x^5 = 0$. Còn lại những hạng tử nào?'],
      loiGiai: ['$H = (2x^5 - 2x^5) - x^2y + 4xy + 3 = -x^2y + 4xy + 3$', 'Các hạng tử có bậc $3$; $2$; $0$. Bậc của $H$ là $3$'],
      loiThuongGap: [{ gt: 5, giaiThich: 'Phải thu gọn trước! $2x^5 - 2x^5 = 0$ nên hạng tử bậc 5 không còn. Bậc của $H$ là $3$.' }] },
    { id: '2.7', muc: 2, de: 'Tính giá trị của đa thức $P = x^2y - 2xy + y^2$ tại $x = -1$, $y = 2$.',
      dapAn: { kieu: 'so', gt: 10 },
      goiY: ['Thay $x = -1$, $y = 2$ vào từng hạng tử. Tính lũy thừa trước.', '$x^2y = (-1)^2 \\cdot 2$; $-2xy = -2 \\cdot (-1) \\cdot 2$; $y^2 = 2^2$.'],
      loiGiai: ['$P = (-1)^2 \\cdot 2 - 2 \\cdot (-1) \\cdot 2 + 2^2$', '$= 2 + 4 + 4 = 10$'],
      loiThuongGap: [
        { gt: 6, giaiThich: '$(-1)^2 = (-1) \\cdot (-1) = 1$, không phải $-1$.' },
        { gt: 2, giaiThich: 'Chú ý dấu: $-2xy = -2 \\cdot (-1) \\cdot 2 = +4$ (âm nhân âm ra dương).' }] },
    { id: '2.8', muc: 2, de: 'Thu gọn rồi tính giá trị của $M = \\frac{1}{2}x^2y + 3xy - \\frac{5}{2}x^2y + xy$ tại $x = 3$, $y = -1$.',
      dapAn: { kieu: 'so', gt: 6 },
      goiY: ['Thu gọn: $\\frac{1}{2} - \\frac{5}{2} = -2$; $3 + 1 = 4$.', 'Dạng thu gọn $M = -2x^2y + 4xy$. Thay $x = 3$, $y = -1$.'],
      loiGiai: ['$M = \\left(\\frac{1}{2} - \\frac{5}{2}\\right)x^2y + (3 + 1)xy = -2x^2y + 4xy$', '$M = -2 \\cdot 9 \\cdot (-1) + 4 \\cdot 3 \\cdot (-1) = 18 - 12 = 6$'],
      loiThuongGap: [{ gt: -30, giaiThich: 'Chú ý dấu: $-2 \\cdot 9 \\cdot (-1) = +18$ (âm nhân âm ra dương).' }] },
    { id: '2.9', muc: 3, de: 'Mỗi quyển sách giá $x$ nghìn đồng, mỗi cây bút giá $y$ nghìn đồng. Lan mua 5 quyển sách và 3 hộp bút (mỗi hộp có 10 cây). Minh mua 2 quyển sách và 4 cây bút. Viết đa thức thu gọn biểu thị **tổng** số tiền cả hai bạn đã trả.',
      dapAn: { kieu: 'bieuThuc', gt: '7x+34y', dang: 'khaiTrien' },
      goiY: ['Lan trả $5x + 30y$ (vì 3 hộp có $30$ cây bút). Minh trả $2x + 4y$.', 'Cộng hai đa thức rồi thu gọn các hạng tử đồng dạng.'],
      loiGiai: ['Lan trả: $5x + 3 \\cdot 10 \\cdot y = 5x + 30y$; Minh trả: $2x + 4y$.', 'Tổng: $(5x + 2x) + (30y + 4y) = 7x + 34y$'],
      loiThuongGap: [{ gt: '7x+7y', giaiThich: 'Mỗi hộp có 10 cây bút nên 3 hộp là $30$ cây, tiền bút của Lan là $30y$, không phải $3y$.' }] },
    { id: '2.10', muc: 3, de: 'Một đa thức thu gọn **bậc hai**, có hai biến $x$ và $y$, mọi hạng tử đều có hệ số bằng $1$. Đa thức đó có **nhiều nhất** bao nhiêu hạng tử?',
      dapAn: { kieu: 'so', gt: 6 },
      goiY: ['Liệt kê mọi hạng tử có bậc không quá 2: bậc 2, bậc 1 và bậc 0.', 'Bậc 2: $x^2$, $xy$, $y^2$. Bậc 1: $x$, $y$. Bậc 0: số $1$.'],
      loiGiai: ['Đa thức có nhiều hạng tử nhất là $x^2 + xy + y^2 + x + y + 1$.', 'Số hạng tử nhiều nhất là $6$'],
      loiThuongGap: [
        { gt: 3, giaiThich: 'Ngoài $x^2$, $xy$, $y^2$ (bậc 2), đa thức bậc hai vẫn có thể có hạng tử bậc 1 ($x$, $y$) và bậc 0 (số $1$).' },
        { gt: 5, giaiThich: 'Gần đúng rồi! Em đừng quên hạng tử bậc 0: số $1$.' }] }
  ],
  timLoi: [
    { de: 'Bạn Nam tìm bậc của đa thức $A = 3x^2y - 5xy + 2y - 1$ như sau. Dòng nào sai?',
      loiGiaiSai: ['Đa thức $A$ đã thu gọn.', 'Các hạng tử có bậc lần lượt là $3$; $2$; $1$; $0$.', 'Bậc của $A$ là $3 + 2 + 1 + 0 = 6$.'],
      dongSai: 2,
      giaiThich: 'Bậc của đa thức là bậc **cao nhất** của các hạng tử trong dạng thu gọn, không phải tổng các bậc.',
      sua: 'Bậc của $A$ là $3$.' },
    { de: 'Bạn Nam tìm bậc của đa thức $B = x^4 - 2x^2y + 3 - x^4$ như sau. Dòng nào sai?',
      loiGiaiSai: ['Hạng tử $x^4$ có bậc $4$, lớn nhất trong các hạng tử.', 'Vậy bậc của $B$ là $4$.'],
      dongSai: 0,
      giaiThich: 'Bạn Nam chưa thu gọn đa thức. $x^4 - x^4 = 0$ nên dạng thu gọn là $B = -2x^2y + 3$, không còn hạng tử $x^4$.',
      sua: 'Thu gọn: $B = -2x^2y + 3$. Hạng tử bậc cao nhất là $-2x^2y$ (bậc 3), nên bậc của $B$ là $3$.' }
  ]
});
