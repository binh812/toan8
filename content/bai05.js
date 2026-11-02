// Bài 5. Phép chia đa thức cho đơn thức – SGK Toán 8 KNTT Tập 1, trang 22–24.
TOAN8.bai({
  id: 5, ten: 'Phép chia đa thức cho đơn thức', sgk: { tap: 1, trang: 22 },
  khamPha: {
    nhiemVu: 'Hình chữ nhật có **diện tích** $\\ca{6x^2} + \\cb{4x}$ và một cạnh là $2x$. Cạnh còn lại (dấu ?) gồm hai đoạn. Em kéo thanh trượt **x** và suy nghĩ: đoạn nào nhân với $2x$ được $6x^2$? Đoạn nào nhân với $2x$ được $4x$?',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: '2x', dai: '2x', mau: '#d9480f' }],
      cot: [{ nhan: '?', dai: '3x', mau: '#d9480f' }, { nhan: '?', dai: 2, mau: '#1971c2' }],
      o: [['\\ca{6x^2}', '\\cc{4x}']],
      thanhTruot: [{ ten: 'x', min: 1, max: 3, buoc: 0.5, gt: 2 }],
      congThuc: '(6x^2 + 4x) : 2x = \\;?'
    },
    cauHoi: {
      de: 'Cạnh còn lại của hình chữ nhật là đa thức nào? (Em thực hiện phép chia rồi viết kết quả dạng thu gọn.)',
      dapAn: { kieu: 'bieuThuc', gt: '3x+2', dang: 'khaiTrien' },
      goiY: ['Diện tích = cạnh × cạnh, nên cạnh còn lại = diện tích : $2x$. Chia **từng** mảnh cho $2x$.'],
      loiGiai: ['$6x^2 : 2x = 3x$ vì $2x \\cdot 3x = 6x^2$; $4x : 2x = 2$ vì $2x \\cdot 2 = 4x$.',
        'Cạnh còn lại: $(6x^2 + 4x) : 2x = 3x + 2$']
    }
  },
  lyThuyet: [
    { loai: 'dinhNghia', tieuDe: 'Phép chia hết',
      noiDung: 'Cho hai đa thức $A$ và $B$ với $B \\ne 0$. Ta nói đa thức $A$ **chia hết** cho đa thức $B$ nếu có đa thức $Q$ sao cho $A = B \\cdot Q$.\n\nKhi đó ta viết $A : B = Q$ hoặc $\\frac{A}{B} = Q$. Trong bài này ta chỉ xét phép chia hết cho một đơn thức.' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: '2x', dai: '2x', mau: '#d9480f' }],
        cot: [{ nhan: '3x^2', dai: '3x^2', mau: '#d9480f' }],
        o: [['6x^3']],
        thanhTruot: [{ ten: 'x', min: 1, max: 2, buoc: 0.25, gt: 1.5 }],
        congThuc: '2x \\cdot 3x^2 = 6x^3 \\;\\Rightarrow\\; 6x^3 : 2x = 3x^2'
      },
      chuThich: 'Biết diện tích $6x^3$ và một cạnh $2x$, cạnh kia là $6x^3 : 2x = 3x^2$: hệ số $6 : 2 = 3$, lũy thừa $x^3 : x = x^{3-1} = x^2$.' },
    { loai: 'dinhLi', tieuDe: 'Chia đơn thức cho đơn thức',
      noiDung: 'a) Đơn thức $A$ chia hết cho đơn thức $B$ ($B \\ne 0$) khi mỗi biến của $B$ đều là biến của $A$ với số mũ **không lớn hơn** số mũ của nó trong $A$.\n\nb) Muốn chia đơn thức $A$ cho đơn thức $B$ (trường hợp chia hết):\n• Chia hệ số của $A$ cho hệ số của $B$;\n• Chia lũy thừa của từng biến trong $A$ cho lũy thừa của cùng biến đó trong $B$;\n• Nhân các kết quả tìm được với nhau.\n$$12x^4y^2 : (-4x^2y) = [12 : (-4)] \\cdot (x^4 : x^2) \\cdot (y^2 : y) = -3x^2y$$' },
    { loai: 'chuY',
      noiDung: '**Hay nhầm 1:** chia lũy thừa cùng cơ số thì **trừ** số mũ: $x^6 : x^2 = x^{6-2} = x^4$, **không phải** $x^{6:2} = x^3$.\n\n**Hay nhầm 2:** hệ số thì **chia**: $12 : 4 = 3$, không trừ $12 - 4$.\n\nVí dụ $6x^2y$ **không** chia hết cho $2xy^2$ vì số mũ của $y$ trong $2xy^2$ là $2$, lớn hơn số mũ của $y$ trong $6x^2y$ (là $1$).' },
    { loai: 'dinhLi', tieuDe: 'Chia đa thức cho đơn thức',
      noiDung: 'Đa thức $A$ chia hết cho đơn thức $B$ nếu **mọi hạng tử** của $A$ đều chia hết cho $B$.\n\nMuốn chia đa thức $A$ cho đơn thức $B$, ta chia **từng hạng tử** của $A$ cho $B$ rồi cộng các kết quả với nhau.\n$$(\\ca{6x^2} + \\cc{4x}) : 2x = \\ca{6x^2} : 2x + \\cc{4x} : 2x = \\ca{3x} + \\cc{2}$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: '2x', dai: '2x', mau: '#d9480f' }],
        cot: [{ nhan: '3x', dai: '3x', mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#1971c2' }],
        o: [['\\ca{6x^2}', '\\cc{4x}']],
        thanhTruot: [{ ten: 'x', min: 1, max: 3, buoc: 0.5, gt: 2 }],
        congThuc: '(6x^2 + 4x) : 2x = 3x + 2',
        // x đổi: cạnh 2x và hai đoạn 3x, 2 của cạnh kia co giãn theo, phép chia vẫn đúng
        tuChay: [{ thanhTruot: 'x', den: 3, giay: 2 }, { cho: 1 }, { thanhTruot: 'x', den: 1, giay: 2.5 }, { cho: 1 },
          { thanhTruot: 'x', den: 2, giay: 1.5 }, { cho: 1 }]
      },
      chuThich: 'Mỗi mảnh chia cho cạnh $2x$ ra một đoạn của cạnh kia. **Kiểm tra lại:** $2x \\cdot (3x + 2) = 6x^2 + 4x$. Đúng!' }
  ],
  viDu: [
    { de: 'Thực hiện phép chia $15x^3y^2 : 5xy$.', buoc: [
      { lam: '$15x^3y^2 : 5xy = (15 : 5) \\cdot (x^3 : x) \\cdot (y^2 : y)$', vi: 'Chia hệ số cho hệ số, lũy thừa của từng biến cho lũy thừa của cùng biến đó.' },
      { lam: '$= 3x^2y$', vi: '$15 : 5 = 3$; $x^3 : x = x^{3-1} = x^2$; $y^2 : y = y$.' } ] },
    { de: 'Cho đơn thức $A = 4x^2y^3z$. a) Vì sao $A$ không chia hết cho $B = 2xy^2z^2$? b) Vì sao $A$ chia hết cho $C = -2xy^2$? Tìm $A : C$.', buoc: [
      { lam: 'a) Số mũ của $z$ trong $B$ là $2$, lớn hơn số mũ của $z$ trong $A$ (là $1$). Vậy $A$ không chia hết cho $B$.', vi: 'Chỉ cần một biến không thỏa mãn là không chia hết.' },
      { lam: 'b) Các biến $x$, $y$ của $C$ đều có trong $A$, với số mũ $1 \\le 2$ và $2 \\le 3$. Vậy $A$ chia hết cho $C$.', vi: 'Kiểm tra từng biến của số chia.' },
      { lam: '$A : C = 4x^2y^3z : (-2xy^2) = -2xyz$', vi: '$4 : (-2) = -2$; $x^2 : x = x$; $y^3 : y^2 = y$; $z$ giữ nguyên.' } ] },
    { de: 'Thực hiện phép chia $(12x^3y^2 - 8x^2y + 4xy) : 4xy$.', buoc: [
      { lam: '$= 12x^3y^2 : 4xy - 8x^2y : 4xy + 4xy : 4xy$', vi: 'Chia **từng** hạng tử cho $4xy$.' },
      { lam: '$= 3x^2y - 2x + 1$', vi: '$4xy : 4xy = 1$. Đừng bỏ quên hạng tử này!' } ] }
  ],
  viDuMo: [
    { de: 'Thực hiện phép chia $(10x^4 - 6x^3 + 2x^2) : 2x^2$.', buoc: [
      { lam: '$= 10x^4 : 2x^2 - 6x^3 : 2x^2 + 2x^2 : 2x^2$', vi: 'Chia từng hạng tử cho $2x^2$.' },
      { lam: '$= 5x^2 - 3x + 1$', vi: 'Em hãy tính kết quả:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '5x^2-3x+1', dang: 'khaiTrien' },
        loiThuongGap: [
          { gt: '5x^2-3x', giaiThich: 'Hạng tử cuối: $2x^2 : 2x^2 = 1$, em đừng bỏ quên.' },
          { gt: '8x^2-4x', giaiThich: 'Hệ số phải **chia**: $10 : 2 = 5$, không trừ $10 - 2$.' }] } ] },
    { de: 'Tìm đa thức $A$ biết $A \\cdot 3xy = 9x^2y^2 - 6xy^2$.', buoc: [
      { lam: '$A = (9x^2y^2 - 6xy^2) : 3xy$', vi: 'Nếu $A \\cdot B = C$ thì $A = C : B$.' },
      { lam: '$= 3xy - 2y$', vi: 'Em hãy tính $A$:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '3xy-2y', dang: 'khaiTrien' } } ] }
  ],
  baiTap: [
    { id: '5.1', muc: 1, de: 'Thực hiện phép chia $12x^6 : 3x^2$.',
      dapAn: { kieu: 'bieuThuc', gt: '4x^4', dang: 'khaiTrien' },
      goiY: ['Chia hệ số cho hệ số, chia lũy thừa cùng biến (trừ số mũ).', '$12 : 3 = ?$; $x^6 : x^2 = x^{6-2}$.'],
      loiGiai: ['$12x^6 : 3x^2 = (12 : 3) \\cdot (x^6 : x^2)$', '$= 4x^4$'],
      loiThuongGap: [
        { gt: '4x^3', giaiThich: 'Chia lũy thừa thì **trừ** số mũ: $6 - 2 = 4$, không chia $6 : 2 = 3$.' },
        { gt: '9x^4', giaiThich: 'Hệ số phải **chia**: $12 : 3 = 4$, không trừ $12 - 3$.' }] },
    { id: '5.2', muc: 1, de: 'Thực hiện phép chia $-20x^3y^2 : 5xy$.',
      dapAn: { kieu: 'bieuThuc', gt: '-4x^2y', dang: 'khaiTrien' },
      goiY: ['$(-20) : 5 = ?$', '$x^3 : x = x^2$; $y^2 : y = y$.'],
      loiGiai: ['$-20x^3y^2 : 5xy = [(-20) : 5] \\cdot (x^3 : x) \\cdot (y^2 : y)$', '$= -4x^2y$'],
      loiThuongGap: [
        { gt: '4x^2y', giaiThich: 'Chú ý dấu: số âm chia số dương ra số âm, $(-20) : 5 = -4$.' },
        { gt: '-4x^3y^2', giaiThich: 'Em mới chia hệ số. Còn phải chia lũy thừa: $x^3 : x = x^2$; $y^2 : y = y$.' }] },
    { id: '5.3', muc: 1, de: 'Đúng hay sai: Đơn thức $6x^2y$ chia hết cho đơn thức $2xy^2$.',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Mỗi biến của số chia phải có trong số bị chia, với số mũ **không lớn hơn**.', 'So sánh số mũ của $y$ trong hai đơn thức.'],
      loiGiai: ['Số mũ của $y$ trong $2xy^2$ là $2$, lớn hơn số mũ của $y$ trong $6x^2y$ (là $1$).', 'Vậy $6x^2y$ **không** chia hết cho $2xy^2$. Khẳng định **sai**.'] },
    { id: '5.4', muc: 1, de: 'Đơn thức $A = 8x^3y^2z$ chia hết cho đơn thức nào sau đây?',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['$2x^4y$', '$4xy^3$', '$-2x^2yz$', '$x^2z^2$'] },
      goiY: ['Kiểm tra từng biến của số chia: có trong $A$ không, số mũ có lớn hơn trong $A$ không?', 'Trong $A$: $x$ mũ 3, $y$ mũ 2, $z$ mũ 1.'],
      loiGiai: ['$2x^4y$: $x$ mũ 4 > 3. $4xy^3$: $y$ mũ 3 > 2. $x^2z^2$: $z$ mũ 2 > 1. Ba đơn thức này không thỏa mãn.',
        '$-2x^2yz$: $x$ mũ 2 ≤ 3, $y$ mũ 1 ≤ 2, $z$ mũ 1 ≤ 1. Vậy $A$ chia hết cho $-2x^2yz$.'] },
    { id: '5.5', muc: 2, de: 'Thực hiện phép chia $(9x^3 - 6x^2 + 3x) : 3x$.',
      dapAn: { kieu: 'bieuThuc', gt: '3x^2-2x+1', dang: 'khaiTrien' },
      goiY: ['Chia **từng** hạng tử cho $3x$, giữ dấu.', '$9x^3 : 3x = 3x^2$; $-6x^2 : 3x = -2x$; $3x : 3x = ?$'],
      loiGiai: ['$= 9x^3 : 3x - 6x^2 : 3x + 3x : 3x$', '$= 3x^2 - 2x + 1$'],
      loiThuongGap: [{ gt: '3x^2-2x', giaiThich: 'Đừng quên hạng tử cuối: $3x : 3x = 1$.' }] },
    { id: '5.6', muc: 2, de: 'Thực hiện phép chia $(8x^3y^2 - 12x^2y^3 + 4x^2y^2) : 4x^2y$.',
      dapAn: { kieu: 'bieuThuc', gt: '2xy-3y^2+y', dang: 'khaiTrien' },
      goiY: ['Chia từng hạng tử cho $4x^2y$.', '$8x^3y^2 : 4x^2y = 2xy$; $-12x^2y^3 : 4x^2y = -3y^2$; $4x^2y^2 : 4x^2y = y$.'],
      loiGiai: ['$= 8x^3y^2 : 4x^2y - 12x^2y^3 : 4x^2y + 4x^2y^2 : 4x^2y$', '$= 2xy - 3y^2 + y$'],
      loiThuongGap: [
        { gt: '2xy-3y^2', giaiThich: 'Đừng quên hạng tử thứ ba: $4x^2y^2 : 4x^2y = y$.' },
        { gt: '2xy+3y^2+y', giaiThich: 'Giữ dấu của hạng tử: $-12x^2y^3 : 4x^2y = -3y^2$.' }] },
    { id: '5.7', muc: 2, de: 'Đúng hay sai: Đa thức $6x^3y - 4x^2y^2 + 2xy$ chia hết cho đơn thức $2x^2y$.',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Đa thức chia hết cho đơn thức khi **mọi** hạng tử đều chia hết.', 'Hạng tử $2xy$ có chia hết cho $2x^2y$ không? So sánh số mũ của $x$.'],
      loiGiai: ['Hai hạng tử đầu chia hết cho $2x^2y$, nhưng hạng tử $2xy$ thì không (số mũ của $x$ là $1 < 2$).', 'Vậy đa thức **không** chia hết cho $2x^2y$. Khẳng định **sai**.'] },
    { id: '5.8', muc: 2, de: 'Tìm đơn thức $M$ biết $12x^4y^3 : M = 4x^2y$.',
      dapAn: { kieu: 'bieuThuc', gt: '3x^2y^2', dang: 'khaiTrien' },
      goiY: ['Nếu $A : M = Q$ thì $M = A : Q$.', '$M = 12x^4y^3 : 4x^2y$.'],
      loiGiai: ['$M = 12x^4y^3 : 4x^2y = (12 : 4) \\cdot (x^4 : x^2) \\cdot (y^3 : y)$', '$= 3x^2y^2$'],
      loiThuongGap: [
        { gt: '48x^6y^4', giaiThich: 'Em đã nhân. Nếu $A : M = Q$ thì $M = A : Q$ (phải **chia**).' },
        { gt: '3x^2y^3', giaiThich: 'Biến $y$: $y^3 : y = y^{3-1} = y^2$.' }] },
    { id: '5.9', muc: 2, de: 'Tính giá trị của biểu thức $(15x^4y^2 - 10x^3y^3) : 5x^3y^2$ tại $x = 2$, $y = -1$.',
      dapAn: { kieu: 'so', gt: 8 },
      goiY: ['Thực hiện phép chia trước cho gọn, rồi mới thay số.', 'Thương là $3x - 2y$.'],
      loiGiai: ['$(15x^4y^2 - 10x^3y^3) : 5x^3y^2 = 3x - 2y$', 'Tại $x = 2$, $y = -1$: $3 \\cdot 2 - 2 \\cdot (-1) = 6 + 2 = 8$'],
      loiThuongGap: [{ gt: 4, giaiThich: 'Chú ý dấu: $-2 \\cdot (-1) = +2$, nên kết quả là $6 + 2 = 8$.' }] },
    { id: '5.10', muc: 3, de: 'Một hình chữ nhật có diện tích $12x^2y + 8xy^2$ (cm²) và chiều rộng $4xy$ (cm). Tìm chiều dài của hình chữ nhật.',
      hinh: { widget: 'dienTich', config: {
        hang: [{ nhan: '4xy', dai: 4, mau: '#d9480f' }],
        cot: [{ nhan: '?', dai: 6, mau: '#d9480f' }, { nhan: '?', dai: 4, mau: '#1971c2' }],
        o: [['12x^2y', '8xy^2']] } },
      dapAn: { kieu: 'bieuThuc', gt: '3x+2y', dang: 'khaiTrien' },
      goiY: ['Chiều dài = diện tích : chiều rộng.', 'Chia từng mảnh cho $4xy$: $12x^2y : 4xy$ và $8xy^2 : 4xy$.'],
      loiGiai: ['Chiều dài $= (12x^2y + 8xy^2) : 4xy = 12x^2y : 4xy + 8xy^2 : 4xy$', '$= 3x + 2y$'],
      loiThuongGap: [
        { gt: '3x^2y+2xy^2', giaiThich: 'Em mới chia hệ số. Còn phải chia phần biến: $x^2y : xy = x$; $xy^2 : xy = y$.' },
        { gt: '8x+4y', giaiThich: 'Hệ số phải **chia**: $12 : 4 = 3$; $8 : 4 = 2$, không trừ.' }] },
    { id: '5.11', muc: 3, de: 'Tìm đa thức $A$ biết $A \\cdot (-2xy) = 6x^3y^2 - 4x^2y^3 + 2xy^2$.',
      dapAn: { kieu: 'bieuThuc', gt: '-3x^2y+2xy^2-y', dang: 'khaiTrien' },
      goiY: ['$A = (6x^3y^2 - 4x^2y^3 + 2xy^2) : (-2xy)$.', 'Chia cho đơn thức có hệ số âm: $6 : (-2) = -3$; $(-4) : (-2) = 2$; $2 : (-2) = -1$.'],
      loiGiai: ['$A = 6x^3y^2 : (-2xy) - 4x^2y^3 : (-2xy) + 2xy^2 : (-2xy)$', '$= -3x^2y + 2xy^2 - y$'],
      loiThuongGap: [
        { gt: '3x^2y-2xy^2+y', giaiThich: 'Số chia $-2xy$ có hệ số âm nên mỗi hạng tử đều đổi dấu: $6 : (-2) = -3$.' },
        { gt: '-3x^2y+2xy^2', giaiThich: 'Đừng quên hạng tử cuối: $2xy^2 : (-2xy) = -y$.' }] }
  ],
  timLoi: [
    { de: 'Bạn Nam thực hiện phép chia $(6x^6 + 3x^3) : 3x^3$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$= 6x^6 : 3x^3 + 3x^3 : 3x^3$', '$= 2x^2 + 1$'],
      dongSai: 1,
      giaiThich: 'Chia hai lũy thừa cùng cơ số thì **trừ** số mũ: $x^6 : x^3 = x^{6-3} = x^3$, không phải $x^{6:3} = x^2$.',
      sua: '$= 2x^3 + 1$' },
    { de: 'Bạn Nam thực hiện phép chia $(12x^3y - 4xy) : 4xy$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$= 12x^3y : 4xy - 4xy : 4xy$', '$= 8x^2 - 1$'],
      dongSai: 1,
      giaiThich: 'Hệ số phải **chia**: $12 : 4 = 3$. Bạn Nam đã trừ $12 - 4 = 8$.',
      sua: '$= 3x^2 - 1$' }
  ]
});
