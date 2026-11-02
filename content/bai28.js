// Bài 28 – Hàm số bậc nhất và đồ thị của hàm số bậc nhất (SGK Toán 8 KNTT, Tập 2, tr. 47–50; Luyện tập chung tr. 55–56)
(function () {
  'use strict';

  TOAN8.bai({
    id: 28, ten: 'Hàm số bậc nhất và đồ thị của hàm số bậc nhất', sgk: { tap: 2, trang: 47 },

    khamPha: {
      nhiemVu: 'Kéo hai thanh trượt $a$ và $b$ để thay đổi hàm số $y = ax + b$. Em quan sát: đồ thị luôn có hình dạng gì? Hai chấm màu là **giao điểm với hai trục**. Chấm trên trục tung luôn nằm ở tung độ bằng mấy?',
      widget: 'doThi',
      config: { bbox: [-6, 6, 6, -6], giaoTruc: true,
        thanhTruot: [{ ten: 'a', min: -3, max: 3, buoc: 0.5, gt: 2 }, { ten: 'b', min: -5, max: 5, buoc: 1, gt: 1 }],
        duong: [{ a: 'a', b: 'b' }],
        tuChay: [{ thanhTruot: 'a', den: 0.5, giay: 1.5 }, { thanhTruot: 'a', den: -2, giay: 2 }, { cho: 1 }, { thanhTruot: 'a', den: 2, giay: 2 },
          { thanhTruot: 'b', den: 4, giay: 2 }, { thanhTruot: 'b', den: -3, giay: 2.5 }, { thanhTruot: 'b', den: 1, giay: 1.5 }] },
      cauHoi: {
        de: 'Đặt $a = 2$, $b = -4$. Đường thẳng $y = 2x - 4$ cắt **trục hoành** tại điểm có hoành độ bằng bao nhiêu?',
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Nhìn chấm màu nằm trên trục ngang $Ox$.', 'Điểm trên trục hoành có tung độ $y = 0$: giải $2x - 4 = 0$.'],
        loiGiai: [
          'Cho $y = 0$: $2x - 4 = 0$, nên $x = 2$.',
          'Đồ thị cắt trục hoành tại $(2; 0)$ và cắt trục tung tại $(0; -4)$, đúng bằng $b$.',
          'Vậy hoành độ giao điểm $x = 2$'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Hàm số bậc nhất',
        noiDung: '**Hàm số bậc nhất** là hàm số cho bởi công thức $$y = \\ca{a}x + \\cb{b},$$ trong đó $a$, $b$ là các số cho trước và $\\ca{a \\ne 0}$.\n\nVí dụ: $y = -2x + 3$ ($a = -2$, $b = 3$); $\\;y = kx$ với $k \\ne 0$ ($a = k$, $b = 0$) cũng là hàm số bậc nhất.' },
      { loai: 'chuY', tieuDe: 'Nhận biết cho đúng',
        noiDung: 'Phải **thu gọn** về dạng $ax + b$ rồi mới kết luận:\n\n$y = 3(x - 1) = 3x - 3$: **là** hàm số bậc nhất ($a = 3$, $b = -3$).\n\n$y = \\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$: **là** hàm số bậc nhất ($a = \\frac{1}{2}$).\n\n$y = 0x + 1$: **không** phải (vì $a = 0$). $\\;y = 2x^2 + 3$: **không** phải (có $x^2$).' },
      { loai: 'dinhLi', tieuDe: '2. Đồ thị của hàm số bậc nhất',
        noiDung: 'Đồ thị của hàm số $y = ax + b$ $(a \\ne 0)$ là **một đường thẳng**.\n\nĐồ thị này còn được gọi là **đường thẳng** $y = ax + b$. Đường thẳng này cắt trục tung tại điểm có tung độ bằng $\\cb{b}$.' },
      { loai: 'dinhLi', tieuDe: 'Cách vẽ đồ thị $y = ax + b$',
        noiDung: 'Đồ thị là đường thẳng nên chỉ cần **hai điểm** phân biệt.\n\n• Khi $b = 0$ ($y = ax$): đường thẳng đi qua gốc $O(0; 0)$ và điểm $A(1; a)$.\n\n• Khi $b \\ne 0$: lấy hai giao điểm với hai trục:\n\n– Cho $x = 0$ thì $y = b$: điểm $P(0; b)$ trên trục tung;\n\n– Cho $y = 0$ thì $x = -\\frac{b}{a}$: điểm $Q\\left(-\\frac{b}{a}; 0\\right)$ trên trục hoành;\n\n– Vẽ đường thẳng $PQ$.' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-5, 6, 5, -2], duong: [{ a: 2, b: 4 }], diem: [{ x: 0, y: 4, ten: 'P' }, { x: -2, y: 0, ten: 'Q' }] },
        chuThich: 'Vẽ $y = 2x + 4$: cho $x = 0$ được $P(0; 4)$; cho $y = 0$ thì $2x + 4 = 0$, $x = -2$, được $Q(-2; 0)$. Đồ thị là đường thẳng $PQ$.' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-4, 3, 4, -3], duong: [{ a: 0.5, b: 0 }], diem: [{ x: 0, y: 0, ten: 'O' }, { x: 2, y: 1, ten: 'A' }] },
        chuThich: 'Vẽ $y = \\frac{1}{2}x$ ($b = 0$): đường thẳng đi qua $O(0; 0)$. Lấy thêm một điểm, chọn $x = 2$ cho dễ tính: $y = 1$, được $A(2; 1)$.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Giao điểm với trục hoành là $x = -\\frac{b}{a}$, **có dấu trừ**: $y = 2x + 4$ cắt $Ox$ tại $x = -2$, không phải $x = 2$.\n\nĐiểm $P(0; b)$ nằm trên **trục tung**, điểm $Q$ nằm trên **trục hoành** – đừng viết ngược toạ độ.\n\nMuốn biết điểm $M(x_0; y_0)$ có thuộc đồ thị không: thay $x_0$ vào công thức, xem có ra đúng $y_0$ không.' }
    ],

    viDu: [
      { de: 'Hàm số nào là hàm số bậc nhất? Xác định $a$, $b$: $\\;y = 1 - 4x$; $\\;y = x^2 + 1$; $\\;y = 2(x + 3)$; $\\;y = 0x + 7$.', buoc: [
        { lam: '$y = 1 - 4x = -4x + 1$: là hàm số bậc nhất, $a = -4$, $b = 1$.', vi: 'Viết hạng tử chứa $x$ lên trước cho dễ đọc $a$. Nhớ $a$ mang **cả dấu**.' },
        { lam: '$y = x^2 + 1$: không phải (có $x^2$).', vi: 'Hàm số bậc nhất chỉ có $x$ mũ $1$.' },
        { lam: '$y = 2(x + 3) = 2x + 6$: là hàm số bậc nhất, $a = 2$, $b = 6$.', vi: 'Nhân phá ngoặc mới thấy rõ dạng $ax + b$.' },
        { lam: '$y = 0x + 7$: không phải (vì $a = 0$).', vi: 'Điều kiện bắt buộc là $a \\ne 0$.' } ] },
      { de: 'Cho hàm số $y = -3x + 2$. a) Lập bảng giá trị với $x = -2; -1; 0; 1; 2$. b) Tìm $x$ để $y = 11$.', buoc: [
        { lam: '$$\\begin{array}{c|c|c|c|c|c} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & 8 & 5 & 2 & -1 & -4 \\end{array}$$', vi: 'Ví dụ $x = -2$: $y = -3\\cdot(-2) + 2 = 6 + 2 = 8$.' },
        { lam: '$-3x + 2 = 11$, nên $-3x = 9$, $x = -3$.', vi: 'Biết $y$, tìm $x$: lập phương trình rồi giải như Bài 25.' } ] },
      { de: 'Vẽ đồ thị của hàm số $y = -2x + 6$.', buoc: [
        { lam: 'Cho $x = 0$ thì $y = 6$: được $P(0; 6)$.', vi: 'Giao điểm với trục tung luôn có tung độ bằng $b$.' },
        { lam: 'Cho $y = 0$ thì $-2x + 6 = 0$, $x = 3$: được $Q(3; 0)$.', vi: 'Giải phương trình bậc nhất để tìm giao điểm với trục hoành.' },
        { lam: 'Đồ thị là đường thẳng $PQ$ (đi xuống từ trái sang phải).', vi: 'Vẽ đường thẳng đi qua hai điểm vừa tìm.' } ] },
      { de: 'Một ô tô xuất phát từ bến xe cách trung tâm thành phố $7$ km, đi ra xa trung tâm với vận tốc $60$ km/h. Viết công thức tính khoảng cách $d$ (km) từ ô tô đến trung tâm sau $t$ giờ. Tính $d$ khi $t = 3$.', buoc: [
        { lam: 'Sau $t$ giờ ô tô đi được $60t$ km, nên $d = 60t + 7$.', vi: 'Khoảng cách $=$ đoạn có sẵn $7$ km $+$ đoạn vừa đi.' },
        { lam: '$d$ là hàm số bậc nhất của $t$ với $a = 60$, $b = 7$.', vi: 'Đúng dạng $y = ax + b$, $a \\ne 0$.' },
        { lam: 'Khi $t = 3$: $d = 60\\cdot 3 + 7 = 187$ (km).', vi: 'Thay $t = 3$ vào công thức.' } ] },
      { de: '$1$ dặm $\\approx 1{,}609$ km. Một ô tô chạy $50$ dặm/giờ trên đường giới hạn tốc độ $80$ km/h. Ô tô có vi phạm không?', buoc: [
        { lam: 'Đổi $x$ dặm sang $y$ km: $y = 1{,}609x$ (hàm số bậc nhất, $b = 0$).', vi: 'Mỗi dặm bằng $1{,}609$ km nên nhân với $1{,}609$.' },
        { lam: '$x = 50$: $y = 1{,}609\\cdot 50 = 80{,}45$ (km).', vi: 'Thay số.' },
        { lam: '$80{,}45 > 80$ nên ô tô **vi phạm** tốc độ.', vi: 'So sánh với giới hạn.' } ] }
    ],

    viDuMo: [
      { de: 'Cho hàm số $y = ax + 3$. Tìm $a$, biết đồ thị đi qua điểm $(2; 7)$.', buoc: [
        { lam: '$7 = a\\cdot 2 + 3$', vi: 'Đồ thị đi qua $(2; 7)$ nghĩa là thay $x = 2$ thì được $y = 7$.' },
        { lam: '$2a = 4$, nên $a = 2$', vi: 'Em hãy tìm $a$:', an: true,
          dapAn: { kieu: 'so', gt: 2 },
          loiThuongGap: [{ gt: 4, giaiThich: '$2a = 4$ thì $a = 4 : 2 = 2$. Em quên chia cho $2$.' }, { gt: 5, giaiThich: 'Chuyển $3$ sang vế trái phải đổi dấu: $2a = 7 - 3 = 4$, không phải $7 + 3$.' }] } ] },
      { de: 'Tìm giao điểm của đường thẳng $y = 3x - 6$ với trục hoành.', buoc: [
        { lam: 'Cho $y = 0$: $3x - 6 = 0$', vi: 'Điểm trên trục hoành có tung độ bằng $0$.' },
        { lam: '$x = 2$; giao điểm là $(2; 0)$', vi: 'Em hãy tìm hoành độ giao điểm:', an: true,
          dapAn: { kieu: 'so', gt: 2 },
          loiThuongGap: [{ gt: -2, giaiThich: '$3x = 6$ nên $x = 2$ (dương). Nhớ đổi dấu khi chuyển $-6$ sang vế phải.' }, { gt: -6, giaiThich: '$-6$ là tung độ giao điểm với **trục tung** (cho $x = 0$). Ở đây cần cho $y = 0$.' }] } ] }
    ],

    baiTap: [
      { id: '28.1', muc: 1, de: 'Hàm số nào dưới đây là **hàm số bậc nhất**?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$y = 0\\cdot x - 5$', '$y = 2x^2 + 1$', '$y = 1 - 3x$', '$y = 5$'] },
        goiY: ['Hàm số bậc nhất có dạng $y = ax + b$ với $a \\ne 0$.', 'Loại các hàm có $a = 0$ hoặc có $x^2$.'],
        loiGiai: ['$y = 0\\cdot x - 5$ và $y = 5$ có $a = 0$: không phải.', '$y = 2x^2 + 1$ có $x^2$: không phải.', '$y = 1 - 3x = -3x + 1$ có $a = -3 \\ne 0$. Đáp án: $y = 1 - 3x$.'] },

      { id: '28.2', muc: 1, de: 'Xác định các hệ số $a$, $b$ của hàm số bậc nhất $y = 4 - 0{,}5x$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$a =$', kieu: 'so', gt: -0.5, loiThuongGap: [{ gt: 4, giaiThich: '$a$ là hệ số **của $x$**, không phải số đứng đầu. Viết lại: $y = -0{,}5x + 4$.' }, { gt: 0.5, giaiThich: '$a$ mang cả dấu trừ: $a = -0{,}5$.' }] },
          { nhan: '$b =$', kieu: 'so', gt: 4, loiThuongGap: [{ gt: -0.5, giaiThich: '$b$ là hạng tử **không chứa $x$**: $b = 4$.' }] }] },
        goiY: ['Viết lại theo thứ tự $y = ax + b$.', '$y = -0{,}5x + 4$.'],
        loiGiai: ['$y = 4 - 0{,}5x = -0{,}5x + 4$.', 'Vậy $a = -0{,}5$, $b = 4$.'] },

      { id: '28.3', muc: 1, de: 'Cho hàm số $y = -2x + 5$. Tính giá trị của $y$ khi $x = -3$.',
        dapAn: { kieu: 'so', gt: 11 },
        goiY: ['Thay $x = -3$ vào công thức, đặt $-3$ trong ngoặc.', '$-2\\cdot(-3) = +6$.'],
        loiGiai: ['$y = -2\\cdot(-3) + 5 = 6 + 5 = 11$'],
        loiThuongGap: [{ gt: -1, giaiThich: '$-2\\cdot(-3) = +6$ (âm nhân âm ra dương), nên $y = 6 + 5 = 11$.' }] },

      { id: '28.4', muc: 1, de: 'Đường thẳng $y = 2x - 6$ cắt trục tung tại $P$ và cắt trục hoành tại $Q$. Tìm tung độ của $P$ và hoành độ của $Q$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Tung độ của $P$', kieu: 'so', gt: -6, loiThuongGap: [{ gt: 3, giaiThich: '$3$ là hoành độ của $Q$. Với $P$ trên trục tung, cho $x = 0$: $y = -6$.' }] },
          { nhan: 'Hoành độ của $Q$', kieu: 'so', gt: 3, loiThuongGap: [{ gt: -3, giaiThich: '$2x - 6 = 0$ thì $2x = 6$, $x = 3$ (dương).' }] }] },
        goiY: ['Trên trục tung $x = 0$; trên trục hoành $y = 0$.', 'Cho $y = 0$: giải $2x - 6 = 0$.'],
        loiGiai: ['Cho $x = 0$: $y = -6$, được $P(0; -6)$.', 'Cho $y = 0$: $2x - 6 = 0$, $x = 3$, được $Q(3; 0)$.'] },

      { id: '28.5', muc: 2, de: 'Cho hàm số bậc nhất $y = ax + 3$. Tìm $a$, biết đồ thị đi qua điểm $(2; -1)$.',
        dapAn: { kieu: 'so', gt: -2 },
        goiY: ['Thay $x = 2$, $y = -1$ vào công thức.', '$-1 = 2a + 3$. Giải ra $a$.'],
        loiGiai: ['$-1 = a\\cdot 2 + 3$', '$2a = -4$', '$a = -2$'],
        loiThuongGap: [{ gt: 2, giaiThich: 'Chuyển $3$ sang trái: $2a = -1 - 3 = -4$, nên $a = -2$ (âm).' }, { gt: 1, giaiThich: '$2a = -1 - 3 = -4$, không phải $-1 + 3$.' }] },

      { id: '28.6', muc: 2, de: 'Cho hàm số $y = \\frac{1}{2}x - 1$. Hoàn thành bảng giá trị.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Khi $x = -2$: $y =$', kieu: 'so', gt: -2, loiThuongGap: [{ gt: 0, giaiThich: '$\\frac{1}{2}\\cdot(-2) = -1$, rồi $-1 - 1 = -2$.' }] },
          { nhan: 'Khi $x = 0$: $y =$', kieu: 'so', gt: -1 },
          { nhan: 'Khi $x = 4$: $y =$', kieu: 'so', gt: 1, loiThuongGap: [{ gt: 3, giaiThich: '$\\frac{1}{2}\\cdot 4 = 2$, rồi **trừ** $1$: $2 - 1 = 1$.' }] }] },
        goiY: ['Thay từng giá trị $x$ vào công thức.', '$\\frac{1}{2}x$ là **một nửa** của $x$.'],
        loiGiai: ['$x = -2$: $y = -1 - 1 = -2$.', '$x = 0$: $y = 0 - 1 = -1$.', '$x = 4$: $y = 2 - 1 = 1$.'] },

      { id: '28.7', muc: 2, de: 'Điểm $A(-1; 5)$ có thuộc đồ thị của hàm số $y = -3x + 2$ không?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Thay hoành độ $x = -1$ vào công thức.', 'So sánh kết quả với tung độ $5$ của $A$.'],
        loiGiai: ['Với $x = -1$: $y = -3\\cdot(-1) + 2 = 5$.', 'Đúng bằng tung độ của $A$, nên $A$ **thuộc** đồ thị. Chọn **Đúng**.'] },

      { id: '28.8', muc: 2, de: 'Cước điện thoại gồm thuê bao $25\\,000$ đồng/tháng và $900$ đồng mỗi phút gọi. Viết công thức tính số tiền $y$ (đồng) phải trả trong tháng khi gọi $x$ phút. (Gõ số liền, không có dấu cách.)',
        dapAn: { kieu: 'bieuThuc', gt: '900x+25000' },
        goiY: ['Tiền gọi $x$ phút là $900x$.', 'Cộng thêm tiền thuê bao cố định.'],
        loiGiai: ['Tiền gọi: $900x$ (đồng); thuê bao: $25\\,000$ (đồng).', '$y = 900x + 25000$'],
        loiThuongGap: [{ gt: '25000x+900', giaiThich: 'Số tiền **mỗi phút** ($900$) mới nhân với số phút $x$; thuê bao là phần cố định.' }, { gt: '900x', giaiThich: 'Em quên tiền thuê bao $25\\,000$ đồng phải trả dù gọi hay không.' }] },

      { id: '28.9', muc: 2, de: 'Với gói cước ở câu trên ($y = 900x + 25\\,000$), một tháng gọi $80$ phút thì phải trả bao nhiêu đồng?',
        dapAn: { kieu: 'so', gt: 97000 },
        goiY: ['Thay $x = 80$.', '$900\\cdot 80 = 72\\,000$.'],
        loiGiai: ['$y = 900\\cdot 80 + 25000 = 72000 + 25000 = 97000$'],
        loiThuongGap: [{ gt: 72000, giaiThich: 'Còn phải cộng tiền thuê bao $25\\,000$ đồng.' }] },

      { id: '28.10', muc: 3, de: 'Một xưởng sản xuất xe đạp có chi phí cố định mỗi ngày là $40$ triệu đồng, mỗi chiếc xe có chi phí sản xuất $2$ triệu đồng. Hàm chi phí là $y = 2x + 40$ (triệu đồng) với $x$ là số xe làm trong ngày. Nếu chi phí trong ngày là $100$ triệu đồng thì xưởng làm được bao nhiêu chiếc xe?',
        dapAn: { kieu: 'so', gt: 30 },
        goiY: ['Biết $y = 100$, tìm $x$.', 'Giải $2x + 40 = 100$.'],
        loiGiai: ['$2x + 40 = 100$', '$2x = 60$', '$x = 30$'],
        loiThuongGap: [{ gt: 50, giaiThich: 'Phải trừ chi phí cố định $40$ triệu trước: $2x = 100 - 40 = 60$.' }, { gt: 70, giaiThich: 'Chuyển $40$ sang vế phải phải đổi dấu: $2x = 100 - 40$, không phải $100 + 40$.' }] },

      { id: '28.11', muc: 3, de: 'Một công ty mua máy in giá $24$ triệu đồng, khấu hao đều trong $4$ năm (mỗi năm giá trị giảm $24 : 4 = 6$ triệu đồng). Giá trị sổ sách sau $x$ năm là $V(x) = 24 - 6x$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Giá trị máy sau $2$ năm (triệu đồng)', kieu: 'so', gt: 12, loiThuongGap: [{ gt: 18, giaiThich: 'Sau $2$ năm giảm $2\\cdot 6 = 12$ triệu, còn $24 - 12 = 12$.' }] },
          { nhan: 'Sau bao nhiêu năm thì giá trị còn $6$ triệu đồng?', kieu: 'so', gt: 3, loiThuongGap: [{ gt: 1, giaiThich: '$1$ năm là lúc giá trị còn $18$ triệu. Giải $24 - 6x = 6$: $x = 3$.' }] }] },
        goiY: ['Thay $x = 2$ vào $V(x)$.', 'Giải $24 - 6x = 6$.'],
        loiGiai: ['$V(2) = 24 - 6\\cdot 2 = 12$ (triệu đồng).', '$24 - 6x = 6$ nên $6x = 18$, $x = 3$ (năm).'] },

      { id: '28.12', muc: 3, de: 'Một ngày, tỉ giá là $1$ EUR $= 1{,}1$ USD. Công thức đổi $x$ euro sang $y$ đô la là $y = 1{,}1x$. Hỏi $300$ USD đổi được khoảng bao nhiêu euro? (Làm tròn đến hàng đơn vị.)',
        dapAn: { kieu: 'so', gt: 273, saiSo: 0.5 },
        goiY: ['Ở đây biết $y = 300$ (đô la), cần tìm $x$ (euro).', 'Giải $1{,}1x = 300$.'],
        loiGiai: ['$1{,}1x = 300$', '$x = 300 : 1{,}1 \\approx 272{,}7$', 'Làm tròn: $x \\approx 273$'],
        loiThuongGap: [{ gt: 330, giaiThich: '$330$ là số đô la đổi được từ $300$ **euro**. Đề cho $300$ **đô la** nên phải **chia** cho $1{,}1$.' }] }
    ],

    timLoi: [
      { de: 'Bạn Vuông tìm hai điểm để vẽ đồ thị $y = 2x + 4$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Cho $x = 0$ thì $y = 4$, được $P(0; 4)$.', 'Cho $y = 0$ thì $2x + 4 = 0$, nên $x = 2$, được $Q(2; 0)$.', 'Đồ thị là đường thẳng $PQ$.'],
        dongSai: 1, giaiThich: '$2x + 4 = 0$ thì $2x = -4$, $x = -2$. Chuyển $4$ sang vế phải phải đổi dấu. Kiểm tra: $2\\cdot 2 + 4 = 8 \\ne 0$.',
        sua: 'Cho $y = 0$ thì $x = -2$, được $Q(-2; 0)$.' },
      { de: 'Bạn Tròn nói về hàm số $y = \\frac{x + 1}{2}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Biến $x$ nằm trên tử, mẫu là số $2$.', 'Vì có phân số nên không viết được dưới dạng $y = ax + b$.', 'Vậy đây không phải hàm số bậc nhất.'],
        dongSai: 1, giaiThich: 'Tách phân số: $\\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$. Đây đúng là dạng $ax + b$ với $a = \\frac{1}{2} \\ne 0$, $b = \\frac{1}{2}$.',
        sua: '$y = \\frac{1}{2}x + \\frac{1}{2}$ nên là hàm số bậc nhất.' },
      { de: 'Bạn Nam định vẽ đồ thị $y = 3x$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Cho $x = 0$ thì $y = 0$, được điểm $O(0; 0)$.', 'Cho $y = 0$ thì $x = 0$, lại được điểm $O$.', 'Chỉ có một điểm nên không vẽ được đường thẳng.'],
        dongSai: 2, giaiThich: 'Khi $b = 0$, hai giao điểm với hai trục trùng nhau tại $O$. Ta lấy điểm thứ hai bất kì, thường là $A(1; a)$: $x = 1$ thì $y = 3$.',
        sua: 'Lấy thêm $A(1; 3)$; đồ thị là đường thẳng $OA$.' }
    ]
  });
})();
