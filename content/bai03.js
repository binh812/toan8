// Bài 3. Phép cộng và phép trừ đa thức – SGK Toán 8 KNTT Tập 1, trang 15–16.
TOAN8.bai({
  id: 3, ten: 'Phép cộng và phép trừ đa thức', sgk: { tap: 1, trang: 15 },
  khamPha: {
    nhiemVu: 'Hình **cam** có diện tích $A = x^2 + 2x$. Hình **xanh lá** có diện tích $B = x^2 + x$. Hai hình được ghép sát nhau. Em kéo thanh trượt **x**, quan sát các mảnh rồi tìm tổng diện tích $A + B$.',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }],
      cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#d9480f' },
        { nhan: 'x', dai: 'x', mau: '#1971c2' }, { nhan: '1', dai: 1, mau: '#1971c2' }],
      o: [['\\ca{x^2}', '\\ca{2x}', '\\cc{x^2}', '\\cc{x}']],
      thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }],
      congThuc: 'A + B = (\\ca{x^2 + 2x}) + (\\cc{x^2 + x}) = \\;?'
    },
    cauHoi: {
      de: 'Tổng diện tích $A + B$ là đa thức thu gọn nào?',
      dapAn: { kieu: 'bieuThuc', gt: '2x^2+3x', dang: 'khaiTrien' },
      goiY: ['Có mấy mảnh $x^2$? Các mảnh còn lại là $2x$ và $x$, gộp lại được bao nhiêu?'],
      loiGiai: ['$A + B = x^2 + 2x + x^2 + x$', '$= (x^2 + x^2) + (2x + x) = 2x^2 + 3x$']
    }
  },
  lyThuyet: [
    { loai: 'dinhLi', tieuDe: 'Cộng, trừ hai đa thức',
      noiDung: 'Muốn cộng (hay trừ) hai đa thức, ta nối hai đa thức đã cho bởi dấu "$+$" (hay dấu "$-$") rồi **bỏ dấu ngoặc** (nếu có) và **thu gọn** đa thức nhận được.' },
    { loai: 'dinhLi', tieuDe: 'Quy tắc bỏ dấu ngoặc',
      noiDung: '• Trước ngoặc có **dấu cộng** ($+$): bỏ ngoặc, **giữ nguyên** dấu các hạng tử trong ngoặc.\n$$+(\\ca{a} - \\cb{b} + \\cc{c}) = \\ca{a} - \\cb{b} + \\cc{c}$$\n• Trước ngoặc có **dấu trừ** ($-$): bỏ ngoặc và **đổi dấu tất cả** các hạng tử trong ngoặc ($+$ thành $-$, $-$ thành $+$).\n$$-(\\ca{a} - \\cb{b} + \\cc{c}) = -\\ca{a} + \\cb{b} - \\cc{c}$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }],
        cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#d9480f' },
          { nhan: 'x', dai: 'x', mau: '#1971c2' }, { nhan: '1', dai: 1, mau: '#1971c2' }],
        o: [['\\ca{x^2}', '\\ca{2x}', '\\cc{x^2}', '\\cc{x}']],
        thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }],
        congThuc: '(\\ca{x^2 + 2x}) + (\\cc{x^2 + x}) = (x^2 + x^2) + (2x + x) = 2x^2 + 3x'
      },
      chuThich: 'Cộng hai đa thức = ghép hai hình. Sau đó gộp các mảnh cùng loại (hạng tử đồng dạng): hai mảnh $x^2$, các mảnh dạng $x$.' },
    { loai: 'chuY',
      noiDung: '• Phép cộng đa thức có tính chất giao hoán và kết hợp: $A + B + C = (A + B) + C = A + (B + C)$.\n• Nếu $A - B = C$ thì $A = B + C$; ngược lại, nếu $A = B + C$ thì $A - B = C$.\n\nVì vậy: tìm $M$ biết $M + A = B$ thì $M = B - A$; biết $M - A = B$ thì $M = B + A$.' },
    { loai: 'chuY',
      noiDung: '**Hay nhầm:** quên đổi dấu khi bỏ ngoặc sau dấu trừ.\n$$(3x^2 + y) - (x^2 - 2y) = 3x^2 + y - x^2 \\ca{+\\, 2y} = 2x^2 + 3y$$\nPhải đổi dấu **mọi** hạng tử trong ngoặc, kể cả hạng tử cuối cùng.' }
  ],
  viDu: [
    { de: 'Cho $A = 3x^2y - 2xy + 5$ và $B = x^2y + 4xy - 1$. Tính $A + B$.', buoc: [
      { lam: '$A + B = (3x^2y - 2xy + 5) + (x^2y + 4xy - 1)$', vi: 'Nối hai đa thức bởi dấu $+$.' },
      { lam: '$= 3x^2y - 2xy + 5 + x^2y + 4xy - 1$', vi: 'Trước ngoặc là dấu $+$: bỏ ngoặc, giữ nguyên dấu.' },
      { lam: '$= (3x^2y + x^2y) + (-2xy + 4xy) + (5 - 1)$', vi: 'Nhóm các hạng tử đồng dạng.' },
      { lam: '$= 4x^2y + 2xy + 4$', vi: 'Cộng hệ số trong mỗi nhóm.' } ] },
    { de: 'Với $A$, $B$ như ví dụ trên, tính $A - B$.', buoc: [
      { lam: '$A - B = (3x^2y - 2xy + 5) - (x^2y + 4xy - 1)$', vi: 'Nối hai đa thức bởi dấu $-$. Nhớ đặt $B$ trong ngoặc.' },
      { lam: '$= 3x^2y - 2xy + 5 - x^2y - 4xy + 1$', vi: 'Trước ngoặc là dấu $-$: đổi dấu **cả ba** hạng tử: $x^2y \\to -x^2y$; $4xy \\to -4xy$; $-1 \\to +1$.' },
      { lam: '$= (3x^2y - x^2y) + (-2xy - 4xy) + (5 + 1)$', vi: 'Nhóm các hạng tử đồng dạng.' },
      { lam: '$= 2x^2y - 6xy + 6$', vi: 'Thu gọn.' } ] },
    { de: 'Tìm đa thức $M$ biết $M + (2x^2 - xy) = 5x^2 + 3xy - 1$.', buoc: [
      { lam: '$M = (5x^2 + 3xy - 1) - (2x^2 - xy)$', vi: 'Nếu $M + A = B$ thì $M = B - A$.' },
      { lam: '$= 5x^2 + 3xy - 1 - 2x^2 + xy$', vi: 'Bỏ ngoặc sau dấu trừ: $2x^2 \\to -2x^2$; $-xy \\to +xy$.' },
      { lam: '$= 3x^2 + 4xy - 1$', vi: 'Thu gọn các hạng tử đồng dạng.' } ] }
  ],
  viDuMo: [
    { de: 'Tính $(4x^2 - 3xy + y^2) - (x^2 - 5xy + 2y^2)$.', buoc: [
      { lam: '$= 4x^2 - 3xy + y^2 - x^2 + 5xy - 2y^2$', vi: 'Bỏ ngoặc sau dấu trừ: đổi dấu cả ba hạng tử của ngoặc thứ hai.' },
      { lam: '$= (4x^2 - x^2) + (-3xy + 5xy) + (y^2 - 2y^2)$', vi: 'Nhóm các hạng tử đồng dạng.' },
      { lam: '$= 3x^2 + 2xy - y^2$', vi: 'Em hãy tính kết quả:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '3x^2+2xy-y^2', dang: 'khaiTrien' },
        loiThuongGap: [{ gt: '3x^2-8xy+3y^2', giaiThich: 'Em mới đổi dấu hạng tử đầu. Phải đổi dấu **tất cả**: $-5xy \\to +5xy$, $+2y^2 \\to -2y^2$.' }] } ] }
  ],
  baiTap: [
    { id: '3.1', muc: 1, de: 'Tính $(2x^2 + 3x - 1) + (x^2 - 5x + 4)$.',
      dapAn: { kieu: 'bieuThuc', gt: '3x^2-2x+3', dang: 'khaiTrien' },
      goiY: ['Trước ngoặc là dấu $+$: bỏ ngoặc, giữ nguyên dấu.', 'Nhóm: $(2x^2 + x^2) + (3x - 5x) + (-1 + 4)$.'],
      loiGiai: ['$= 2x^2 + 3x - 1 + x^2 - 5x + 4$', '$= (2x^2 + x^2) + (3x - 5x) + (-1 + 4)$', '$= 3x^2 - 2x + 3$'],
      loiThuongGap: [
        { gt: '3x^4-2x^2+3', giaiThich: 'Em đã cộng cả số mũ. Cộng hạng tử đồng dạng chỉ cộng hệ số, giữ nguyên phần biến: $2x^2 + x^2 = 3x^2$.' },
        { gt: '3x^2+8x+3', giaiThich: 'Chú ý dấu: $3x - 5x = -2x$.' }] },
    { id: '3.2', muc: 1, de: 'Bỏ dấu ngoặc: $-(3x - 2y + 5)$.',
      dapAn: { kieu: 'bieuThuc', gt: '-3x+2y-5', dang: 'khaiTrien' },
      goiY: ['Trước ngoặc là dấu $-$: đổi dấu **tất cả** hạng tử trong ngoặc.', '$3x \\to -3x$; $-2y \\to ?$; $5 \\to ?$'],
      loiGiai: ['Đổi dấu từng hạng tử: $3x \\to -3x$; $-2y \\to +2y$; $5 \\to -5$.', '$-(3x - 2y + 5) = -3x + 2y - 5$'],
      loiThuongGap: [
        { gt: '-3x-2y+5', giaiThich: 'Em mới đổi dấu hạng tử đầu. Phải đổi dấu **tất cả**: $-2y \\to +2y$ và $+5 \\to -5$.' },
        { gt: '-3x-2y-5', giaiThich: 'Đổi dấu nghĩa là dương thành âm **và âm thành dương**: $-2y$ phải thành $+2y$.' }] },
    { id: '3.3', muc: 1, de: 'Tính $(5xy - 2y^2) - (3xy + y^2)$.',
      dapAn: { kieu: 'bieuThuc', gt: '2xy-3y^2', dang: 'khaiTrien' },
      goiY: ['Bỏ ngoặc sau dấu trừ: đổi dấu cả $3xy$ và $y^2$.', '$= 5xy - 2y^2 - 3xy - y^2$. Nhóm hạng tử đồng dạng.'],
      loiGiai: ['$= 5xy - 2y^2 - 3xy - y^2$', '$= (5xy - 3xy) + (-2y^2 - y^2)$', '$= 2xy - 3y^2$'],
      loiThuongGap: [{ gt: '2xy-y^2', giaiThich: 'Em quên đổi dấu $+y^2$ thành $-y^2$ khi bỏ ngoặc sau dấu trừ: $-2y^2 - y^2 = -3y^2$.' }] },
    { id: '3.4', muc: 2, de: 'Cho $P = x^2y - 3xy + 2$ và $Q = 4x^2y + xy - 7$. Tính $P - Q$.',
      dapAn: { kieu: 'bieuThuc', gt: '-3x^2y-4xy+9', dang: 'khaiTrien' },
      goiY: ['$P - Q = (x^2y - 3xy + 2) - (4x^2y + xy - 7)$. Bỏ ngoặc sau dấu trừ phải đổi dấu cả ba hạng tử.', '$-(-7) = +7$.'],
      loiGiai: ['$P - Q = x^2y - 3xy + 2 - 4x^2y - xy + 7$', '$= (x^2y - 4x^2y) + (-3xy - xy) + (2 + 7)$', '$= -3x^2y - 4xy + 9$'],
      loiThuongGap: [
        { gt: '-3x^2y-4xy-5', giaiThich: 'Bỏ ngoặc sau dấu trừ: $-(-7) = +7$, nên $2 + 7 = 9$.' },
        { gt: '-3x^2y-2xy-5', giaiThich: 'Em mới đổi dấu hạng tử đầu $4x^2y$. Phải đổi dấu cả $xy$ (thành $-xy$) và $-7$ (thành $+7$).' }] },
    { id: '3.5', muc: 2, de: 'Rút gọn biểu thức $(x - 2y) + (3y - z) - (x + y - z)$.',
      dapAn: { kieu: 'bieuThuc', gt: '0', dang: 'khaiTrien' },
      goiY: ['Hai ngoặc đầu: giữ nguyên dấu. Ngoặc cuối (sau dấu trừ): đổi dấu cả ba hạng tử.', '$= x - 2y + 3y - z - x - y + z$. Gộp các hạng tử $x$, $y$, $z$.'],
      loiGiai: ['$= x - 2y + 3y - z - x - y + z$', '$= (x - x) + (-2y + 3y - y) + (-z + z) = 0$'],
      loiThuongGap: [{ gt: '-2z', giaiThich: 'Bỏ ngoặc sau dấu trừ: $-(-z) = +z$, nên $-z + z = 0$.' }] },
    { id: '3.6', muc: 2, de: 'Tìm đa thức $M$ biết $M + (3x^2 - 2xy + 1) = 5x^2 + xy - 4$.',
      dapAn: { kieu: 'bieuThuc', gt: '2x^2+3xy-5', dang: 'khaiTrien' },
      goiY: ['Nếu $M + A = B$ thì $M = B - A$.', '$M = (5x^2 + xy - 4) - (3x^2 - 2xy + 1)$. Nhớ đổi dấu khi bỏ ngoặc.'],
      loiGiai: ['$M = (5x^2 + xy - 4) - (3x^2 - 2xy + 1)$', '$= 5x^2 + xy - 4 - 3x^2 + 2xy - 1$', '$= 2x^2 + 3xy - 5$'],
      loiThuongGap: [
        { gt: '2x^2-xy-5', giaiThich: 'Bỏ ngoặc sau dấu trừ: $-(-2xy) = +2xy$, nên $xy + 2xy = 3xy$.' },
        { gt: '8x^2-xy-3', giaiThich: 'Em đã cộng hai đa thức. Nếu $M + A = B$ thì $M = B - A$ (phải **trừ**).' }] },
    { id: '3.7', muc: 2, de: 'Tìm đa thức $M$ biết $M - (x^2y - 4y) = 2x^2y + y - 3$.',
      dapAn: { kieu: 'bieuThuc', gt: '3x^2y-3y-3', dang: 'khaiTrien' },
      goiY: ['Nếu $M - A = B$ thì $M = B + A$.', '$M = (2x^2y + y - 3) + (x^2y - 4y)$.'],
      loiGiai: ['$M = (2x^2y + y - 3) + (x^2y - 4y)$', '$= (2x^2y + x^2y) + (y - 4y) - 3$', '$= 3x^2y - 3y - 3$'],
      loiThuongGap: [{ gt: 'x^2y+5y-3', giaiThich: 'Nếu $M - A = B$ thì $M = B + A$ (phải **cộng**, không trừ).' }] },
    { id: '3.8', muc: 2, de: 'Cho $A = 2x^2 - xy + 3$ và $B = x^2 + xy - 1$. Tính giá trị của $A - B$ tại $x = -1$, $y = 2$.',
      dapAn: { kieu: 'so', gt: 9 },
      goiY: ['Tính $A - B$ rồi thu gọn trước, sau đó mới thay số.', '$A - B = x^2 - 2xy + 4$.'],
      loiGiai: ['$A - B = 2x^2 - xy + 3 - x^2 - xy + 1 = x^2 - 2xy + 4$', 'Tại $x = -1$, $y = 2$: $A - B = 1 - 2 \\cdot (-1) \\cdot 2 + 4 = 1 + 4 + 4 = 9$'],
      loiThuongGap: [{ gt: 3, giaiThich: 'Em quên đổi dấu $xy$ và $-1$ khi bỏ ngoặc sau dấu trừ. Đúng là $A - B = x^2 - 2xy + 4$.' }] },
    { id: '3.9', muc: 3, de: 'Cho $P = 3x^2y - xy^2 + 15$ và $Q = xy^2 - 3x^2y + 10$. Bạn Hà nói: "Với mọi giá trị của $x$, $y$, tổng $P + Q$ luôn bằng cùng một số." Số đó là bao nhiêu?',
      dapAn: { kieu: 'so', gt: 25 },
      goiY: ['Tính $P + Q$ và thu gọn.', 'Các hạng tử $3x^2y$ và $-3x^2y$ triệt tiêu nhau; $-xy^2$ và $xy^2$ cũng vậy.'],
      loiGiai: ['$P + Q = 3x^2y - xy^2 + 15 + xy^2 - 3x^2y + 10$', '$= (3x^2y - 3x^2y) + (-xy^2 + xy^2) + (15 + 10) = 25$'],
      loiThuongGap: [{ gt: 5, giaiThich: 'Đây là phép **cộng** $P + Q$: $15 + 10 = 25$, không phải $15 - 10$.' }] },
    { id: '3.10', muc: 3, de: 'Cho đa thức $A = 4x^2 - 3xy + 2$. Tìm đa thức $B$ sao cho $A - B = x^2 + xy - 5$, rồi tính giá trị của $B$ tại $x = 1$, $y = -2$.',
      dapAn: { kieu: 'nhieuO', o: [
        { kieu: 'bieuThuc', gt: '3x^2-4xy+7', dang: 'khaiTrien', nhan: 'Đa thức $B$',
          loiThuongGap: [{ gt: '5x^2-2xy-3', giaiThich: 'Nếu $A - B = C$ thì $B = A - C$ (phải **trừ**), không phải $A + C$.' }] },
        { kieu: 'so', gt: 18, nhan: 'Giá trị của $B$ tại $x = 1$, $y = -2$' }] },
      goiY: ['Nếu $A - B = C$ thì $A = B + C$, nên $B = A - C$.', '$B = (4x^2 - 3xy + 2) - (x^2 + xy - 5)$. Thu gọn rồi thay $x = 1$, $y = -2$.'],
      loiGiai: ['$B = (4x^2 - 3xy + 2) - (x^2 + xy - 5) = 4x^2 - 3xy + 2 - x^2 - xy + 5 = 3x^2 - 4xy + 7$',
        'Tại $x = 1$, $y = -2$: $B = 3 \\cdot 1 - 4 \\cdot 1 \\cdot (-2) + 7 = 3 + 8 + 7 = 18$.'] }
  ],
  timLoi: [
    { de: 'Bạn Nam tính $(5x^2 - 3xy) - (2x^2 - xy + 4)$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$(5x^2 - 3xy) - (2x^2 - xy + 4)$', '$= 5x^2 - 3xy - 2x^2 - xy + 4$', '$= 3x^2 - 4xy + 4$'],
      dongSai: 1,
      giaiThich: 'Bỏ ngoặc sau dấu trừ phải đổi dấu **tất cả** các hạng tử: $2x^2 \\to -2x^2$, $-xy \\to +xy$, $+4 \\to -4$. Bạn Nam chỉ đổi dấu hạng tử đầu.',
      sua: '$= 5x^2 - 3xy - 2x^2 + xy - 4 = 3x^2 - 2xy - 4$' },
    { de: 'Bạn Nam tìm đa thức $M$ biết $M + (x^2 - 2y) = 3x^2 + y$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$M = (3x^2 + y) + (x^2 - 2y)$', '$= 4x^2 - y$'],
      dongSai: 0,
      giaiThich: 'Nếu $M + A = B$ thì $M = B - A$. Bạn Nam đã cộng thay vì trừ.',
      sua: '$M = (3x^2 + y) - (x^2 - 2y) = 3x^2 + y - x^2 + 2y = 2x^2 + 3y$' }
  ]
});
