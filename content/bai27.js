// Bài 27 – Khái niệm hàm số và đồ thị của hàm số (SGK Toán 8 KNTT, Tập 2, tr. 40–46)
(function () {
  'use strict';

  TOAN8.bai({
    id: 27, ten: 'Khái niệm hàm số và đồ thị của hàm số', sgk: { tap: 2, trang: 40 },

    khamPha: {
      nhiemVu: 'Đây là **mặt phẳng toạ độ** $Oxy$. Em hãy **kéo điểm $M$** đi khắp nơi. Con số đứng trước trong ngoặc là **hoành độ** (đọc trên trục ngang $Ox$), con số đứng sau là **tung độ** (đọc trên trục dọc $Oy$). Thử đưa $M$ đến điểm $(-3; 2)$, rồi đến $(2; -3)$: hai điểm này có trùng nhau không?',
      widget: 'doThi',
      config: { bbox: [-6, 6, 6, -6], diem: [{ x: 2, y: 1, ten: 'M', keo: true }] },
      cauHoi: {
        de: 'Kéo $M$ tới một điểm có **hoành độ âm** và **tung độ âm**, ví dụ $(-3; -2)$. Điểm đó nằm ở góc phần tư thứ mấy (gõ một số từ 1 đến 4)?',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Hoành độ âm: $M$ ở **bên trái** trục $Oy$. Tung độ âm: $M$ ở **phía dưới** trục $Ox$.', 'Các góc phần tư đánh số I, II, III, IV ngược chiều kim đồng hồ, bắt đầu từ góc trên bên phải.'],
        loiGiai: [
          'Hoành độ âm nên $M$ ở bên trái $Oy$; tung độ âm nên $M$ ở dưới $Ox$.',
          'Góc dưới bên trái là góc phần tư thứ **III**.',
          'Vậy đáp số là $3$.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Hàm số',
        noiDung: 'Nếu đại lượng $y$ phụ thuộc vào đại lượng thay đổi $x$ sao cho **với mỗi giá trị của $x$** ta luôn xác định được **chỉ một** giá trị tương ứng của $y$ thì $y$ được gọi là **hàm số** của $x$, và $x$ gọi là **biến số**.\n\nVí dụ: ô tô đi với vận tốc $60$ km/h thì quãng đường $S = 60t$. Mỗi thời gian $t$ cho đúng một quãng đường $S$, nên $S$ là hàm số của $t$.' },
      { loai: 'chuY', tieuDe: 'Kí hiệu và các cách cho hàm số',
        noiDung: 'Khi $y$ là hàm số của $x$, ta viết $y = f(x)$, $y = g(x)$…\n\nVí dụ với $y = f(x) = 2x + 1$: "khi $x = 1$ thì $y = 3$" được viết gọn là $f(1) = 3$.\n\nHàm số có thể cho bằng **công thức** (như $S = 60t$), bằng **bảng** hoặc bằng **biểu đồ**.\n\n**Không phải hàm số** khi có một giá trị $x$ ứng với **hai** giá trị $y$ khác nhau. Còn nhiều $x$ khác nhau cho **cùng** một $y$ thì vẫn là hàm số (ví dụ $y = 5$ với mọi $x$).' },
      { loai: 'dinhNghia', tieuDe: '2. Mặt phẳng toạ độ',
        noiDung: 'Hai trục số $Ox$, $Oy$ vuông góc với nhau tại gốc $O$ tạo thành **hệ trục toạ độ** $Oxy$. $Ox$ (nằm ngang) là **trục hoành**, $Oy$ (thẳng đứng) là **trục tung**, $O$ là **gốc toạ độ**.\n\nMỗi điểm $M$ xác định **duy nhất** một cặp số $(x_0; y_0)$ và ngược lại. Ta viết $M(x_0; y_0)$: $x_0$ là **hoành độ**, $y_0$ là **tung độ** của $M$.\n\nCách đọc: từ $M$ kẻ đường vuông góc xuống $Ox$ được hoành độ, kẻ vuông góc sang $Oy$ được tung độ. **Hoành độ viết trước, tung độ viết sau.**' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-5, 5, 5, -5], diem: [{ x: 2, y: -3, ten: 'A' }, { x: -2, y: 1, ten: 'B' }, { x: 0, y: -2, ten: 'C' }, { x: -1, y: 0, ten: 'D' }, { x: 3, y: 2.5, ten: 'M' }] },
        chuThich: '$A(2; -3)$, $B(-2; 1)$, $M\\left(3; \\frac{5}{2}\\right)$. Điểm $C(0; -2)$ có hoành độ $0$ nên nằm **trên trục tung**; điểm $D(-1; 0)$ có tung độ $0$ nên nằm **trên trục hoành**. Gốc toạ độ là $O(0; 0)$.' },
      { loai: 'chuY', tieuDe: 'Bốn góc phần tư',
        noiDung: 'Hai trục chia mặt phẳng thành **4 góc phần tư**, đánh số ngược chiều kim đồng hồ:\n\n**I** (trên phải): $x > 0$, $y > 0$; **II** (trên trái): $x < 0$, $y > 0$;\n\n**III** (dưới trái): $x < 0$, $y < 0$; **IV** (dưới phải): $x > 0$, $y < 0$.\n\nĐiểm nằm trên trục toạ độ thì **không** thuộc góc phần tư nào.' },
      { loai: 'dinhNghia', tieuDe: '3. Đồ thị của hàm số',
        noiDung: '**Đồ thị** của hàm số $y = f(x)$ là tập hợp **tất cả các điểm** biểu diễn các cặp giá trị tương ứng $(x; y)$ trên mặt phẳng toạ độ.\n\nVí dụ: hàm số cho bởi bảng\n\n$$\\begin{array}{c|c|c|c|c|c} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & -1 & 0 & 1 & 2 & 3 \\end{array}$$\n\ncó đồ thị gồm **5 điểm** $(-2; -1)$, $(-1; 0)$, $(0; 1)$, $(1; 2)$, $(2; 3)$.' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-4, 4, 4, -4], diem: [{ x: -2, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }] },
        chuThich: 'Đồ thị của hàm số cho bởi bảng trên chỉ gồm **5 điểm** (không nối thành đường), vì hàm số chỉ cho tại 5 giá trị của $x$.' }
    ],

    viDu: [
      { de: 'Cho hàm số $y = f(x) = 2x - 3$. Lập bảng giá trị của $y$ khi $x$ lần lượt bằng $-2; -1; 0; 1; 2$.', buoc: [
        { lam: '$f(-2) = 2\\cdot(-2) - 3 = -7$; $\\;f(-1) = 2\\cdot(-1) - 3 = -5$', vi: 'Thay từng giá trị của $x$ vào công thức. Số âm đặt trong ngoặc.' },
        { lam: '$f(0) = -3$; $\\;f(1) = -1$; $\\;f(2) = 1$', vi: 'Tính tương tự.' },
        { lam: '$$\\begin{array}{c|c|c|c|c|c} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & -7 & -5 & -3 & -1 & 1 \\end{array}$$', vi: 'Ghi kết quả thành bảng. Mỗi $x$ cho đúng một $y$.' } ] },
      { de: 'Cho bảng: $x$ lần lượt là $1; 2; 3; 2$ và $y$ tương ứng là $4; 5; 6; 7$. Đại lượng $y$ có phải là hàm số của $x$ không?', buoc: [
        { lam: 'Với $x = 2$, bảng cho **hai** giá trị $y = 5$ và $y = 7$.', vi: 'Soát xem có giá trị $x$ nào xuất hiện hai lần với hai $y$ khác nhau.' },
        { lam: 'Vậy $y$ **không** phải là hàm số của $x$.', vi: 'Hàm số đòi hỏi mỗi $x$ chỉ cho **một** $y$.' } ] },
      { de: 'Cho hàm số $y = f(x) = \\frac{6}{x}$. Tính $f(-3)$ và $f(2)$.', buoc: [
        { lam: '$f(-3) = \\frac{6}{-3} = -2$', vi: 'Thay $x = -3$ vào công thức.' },
        { lam: '$f(2) = \\frac{6}{2} = 3$', vi: 'Thay $x = 2$.' } ] },
      { de: 'Cho các điểm $P(-3; 4)$, $Q(2; -1)$, $R(0; -3)$. Mỗi điểm nằm ở đâu trên mặt phẳng toạ độ?', buoc: [
        { lam: '$P(-3; 4)$: hoành độ âm, tung độ dương $\\Rightarrow$ góc phần tư thứ **II**.', vi: 'Trái và trên.' },
        { lam: '$Q(2; -1)$: hoành độ dương, tung độ âm $\\Rightarrow$ góc phần tư thứ **IV**.', vi: 'Phải và dưới.' },
        { lam: '$R(0; -3)$: hoành độ bằng $0$ $\\Rightarrow$ nằm **trên trục tung**.', vi: 'Điểm có hoành độ $0$ không thuộc góc phần tư nào.' } ] },
      { de: 'Ô tô đi quãng đường $120$ km với vận tốc $v$ (km/h) không đổi. Viết công thức tính thời gian $t$ (giờ). $t$ có phải hàm số của $v$ không? Tính $t$ khi $v = 40$.', buoc: [
        { lam: '$t = \\frac{120}{v}$', vi: 'Thời gian $=$ quãng đường $:$ vận tốc.' },
        { lam: 'Mỗi giá trị $v$ cho đúng một giá trị $t$, nên $t$ là hàm số của $v$.', vi: 'Đúng định nghĩa hàm số.' },
        { lam: 'Khi $v = 40$: $t = \\frac{120}{40} = 3$ (giờ).', vi: 'Thay số vào công thức.' } ] }
    ],

    viDuMo: [
      { de: 'Cho hàm số $f(x) = 3 - 2x$. Tính $f(-2)$.', buoc: [
        { lam: '$f(-2) = 3 - 2\\cdot(-2)$', vi: 'Thay $x = -2$ (đặt trong ngoặc).' },
        { lam: '$= 3 + 4 = 7$', vi: 'Em hãy tính $f(-2)$:', an: true,
          dapAn: { kieu: 'so', gt: 7 },
          loiThuongGap: [{ gt: -1, giaiThich: '$-2\\cdot(-2) = +4$ (âm nhân âm ra dương), nên $3 + 4 = 7$.' }] } ] },
      { de: 'Một vòi chảy đầy bể $180$ lít với lưu lượng $v$ (lít/phút) thì mất $t = \\frac{180}{v}$ phút. Tính $t$ khi $v = 60$.', buoc: [
        { lam: '$t = \\frac{180}{60}$', vi: 'Thay $v = 60$ vào công thức.' },
        { lam: '$= 3$ (phút)', vi: 'Em hãy tính $t$:', an: true,
          dapAn: { kieu: 'so', gt: 3 },
          loiThuongGap: [{ gt: 10800, giaiThich: 'Công thức là $\\frac{180}{v}$: phải **chia** $180$ cho $60$, không nhân.' }] } ] }
    ],

    baiTap: [
      { id: '27.1', muc: 1, de: 'Cho hàm số $f(x) = 4x - 1$. Tính $f(2)$.',
        dapAn: { kieu: 'so', gt: 7 },
        goiY: ['$f(2)$ là giá trị của hàm số khi $x = 2$.', 'Thay $x = 2$: $4\\cdot 2 - 1$.'],
        loiGiai: ['$f(2) = 4\\cdot 2 - 1 = 7$'],
        loiThuongGap: [{ gt: 9, giaiThich: 'Công thức là $4x \\mathbf{-} 1$: $8 - 1 = 7$, không phải $8 + 1$.' }] },

      { id: '27.2', muc: 1, de: 'Cho hàm số $y = f(x) = \\frac{12}{x}$. Tính $f(-4)$.',
        dapAn: { kieu: 'so', gt: -3 },
        goiY: ['Thay $x = -4$ vào công thức.', 'Dương chia âm được số âm.'],
        loiGiai: ['$f(-4) = \\frac{12}{-4} = -3$'],
        loiThuongGap: [{ gt: 3, giaiThich: '$12 : (-4)$ là số **âm**: $-3$.' }, { gt: -48, giaiThich: 'Phải **chia** $12$ cho $-4$, không nhân.' }] },

      { id: '27.3', muc: 1, de: 'Đọc toạ độ của điểm $A$ trong hình.',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], diem: [{ x: -3, y: 2, ten: 'A' }] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Hoành độ của $A$', kieu: 'so', gt: -3, loiThuongGap: [{ gt: 2, giaiThich: 'Hoành độ đọc trên trục **ngang** $Ox$. Số $2$ là tung độ.' }, { gt: 3, giaiThich: '$A$ ở bên **trái** trục $Oy$ nên hoành độ âm.' }] },
          { nhan: 'Tung độ của $A$', kieu: 'so', gt: 2, loiThuongGap: [{ gt: -3, giaiThich: 'Tung độ đọc trên trục **dọc** $Oy$. Số $-3$ là hoành độ.' }] }] },
        goiY: ['Từ $A$ kẻ đường thẳng đứng xuống trục $Ox$: được hoành độ.', 'Từ $A$ kẻ đường nằm ngang sang trục $Oy$: được tung độ.'],
        loiGiai: ['Kẻ vuông góc xuống $Ox$ gặp tại $-3$: hoành độ là $-3$.', 'Kẻ vuông góc sang $Oy$ gặp tại $2$: tung độ là $2$.', 'Vậy $A(-3; 2)$.'] },

      { id: '27.4', muc: 1, de: 'Trong hình có bốn điểm $A$, $B$, $C$, $D$. Điểm nào nằm **trên trục hoành**?',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], diem: [{ x: -2, y: 3, ten: 'A' }, { x: 0, y: -2, ten: 'B' }, { x: 3, y: 0, ten: 'C' }, { x: 1, y: 2, ten: 'D' }] } },
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$A(-2; 3)$', '$B(0; -2)$', '$C(3; 0)$', '$D(1; 2)$'] },
        goiY: ['Trục hoành là trục **nằm ngang** $Ox$.', 'Điểm trên trục hoành có **tung độ bằng 0**.'],
        loiGiai: ['$C(3; 0)$ có tung độ $0$ nên nằm trên trục hoành.', '$B(0; -2)$ có hoành độ $0$ nên nằm trên trục **tung**, không phải trục hoành. Đáp án: $C$.'] },

      { id: '27.5', muc: 2, de: 'Điểm $N(-2; -5)$ nằm ở góc phần tư thứ mấy? (gõ một số từ 1 đến 4)',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Xét dấu hoành độ và tung độ.', 'Hoành độ âm: bên trái; tung độ âm: phía dưới.'],
        loiGiai: ['Hoành độ $-2 < 0$, tung độ $-5 < 0$.', '$N$ ở góc dưới bên trái, là góc phần tư thứ III.', 'Đáp số: góc phần tư $= 3$'],
        loiThuongGap: [{ gt: 2, giaiThich: 'Góc phần tư II có tung độ **dương** (phía trên). $N$ có tung độ âm nên ở góc III.' }, { gt: 4, giaiThich: 'Góc phần tư IV có hoành độ **dương** (bên phải). $N$ có hoành độ âm.' }] },

      { id: '27.6', muc: 2, de: 'Cho hàm số $y = f(x) = \\frac{6}{x}$. Hoàn thành các giá trị còn thiếu.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$f(-3) =$', kieu: 'so', gt: -2, loiThuongGap: [{ gt: 2, giaiThich: '$6 : (-3)$ là số âm.' }] },
          { nhan: 'Giá trị $x$ để $f(x) = -6$: $x =$', kieu: 'so', gt: -1, loiThuongGap: [{ gt: -36, giaiThich: 'Từ $\\frac{6}{x} = -6$ suy ra $x = 6 : (-6) = -1$.' }] },
          { nhan: '$f(4) =$', kieu: 'so', gt: 1.5, loiThuongGap: [{ gt: 24, giaiThich: 'Phải chia: $\\frac{6}{4} = 1{,}5$.' }] }] },
        goiY: ['Tính $f(-3)$ và $f(4)$ bằng cách thay số vào $\\frac{6}{x}$.', 'Muốn $\\frac{6}{x} = -6$ thì $x = 6 : (-6)$.'],
        loiGiai: ['$f(-3) = \\frac{6}{-3} = -2$.', '$\\frac{6}{x} = -6$ khi $x = 6 : (-6) = -1$.', '$f(4) = \\frac{6}{4} = 1{,}5$.'] },

      { id: '27.7', muc: 2, de: 'Cho bảng: $x$ lần lượt là $-2; -1; 0; 1; 2$ và $y$ tương ứng đều bằng $3$. Đại lượng $y$ **có phải** là hàm số của $x$ không?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Kiểm tra: có giá trị $x$ nào ứng với **hai** giá trị $y$ khác nhau không?', 'Nhiều $x$ cùng cho một $y$ thì không vi phạm định nghĩa.'],
        loiGiai: ['Mỗi giá trị của $x$ cho đúng một giá trị $y = 3$.', 'Vậy $y$ **là** hàm số của $x$ (gọi là hàm hằng). Chọn **Đúng**.'] },

      { id: '27.8', muc: 2, de: 'Cho hàm số $f(x) = \\frac{1}{2}x + 1$. Tìm $x$ sao cho $f(x) = 4$.',
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Giải phương trình $\\frac{1}{2}x + 1 = 4$.', '$\\frac{1}{2}x = 3$, nhân hai vế với $2$.'],
        loiGiai: ['$\\frac{1}{2}x + 1 = 4$', '$\\frac{1}{2}x = 3$', '$x = 6$'],
        loiThuongGap: [{ gt: 3, giaiThich: '$\\frac{1}{2}x = 3$ nghĩa là **một nửa** của $x$ bằng $3$, nên $x = 6$.' }, { gt: 10, giaiThich: 'Chuyển $1$ sang vế phải phải đổi dấu: $\\frac{1}{2}x = 4 - 1 = 3$, không phải $4 + 1$.' }] },

      { id: '27.9', muc: 2, de: 'Nhiệt độ $T$ ($^{\\circ}$C) tại thời điểm $t$ (giờ) trong một ngày cho bởi bảng:\n\n$$\\begin{array}{c|c|c|c|c|c|c} t & 0 & 4 & 8 & 12 & 16 & 20 \\\\ \\hline T & 22 & 21 & 25 & 31 & 29 & 26 \\end{array}$$\n\nNhiệt độ lúc $12$ giờ cao hơn lúc $4$ giờ bao nhiêu độ?',
        dapAn: { kieu: 'so', gt: 10 },
        goiY: ['Đọc $T(12)$ và $T(4)$ trong bảng.', 'Tính hiệu $T(12) - T(4)$.'],
        loiGiai: ['$T(12) = 31$, $T(4) = 21$.', '$T(12) - T(4) = 31 - 21 = 10$'],
        loiThuongGap: [{ gt: 8, giaiThich: 'Em đọc nhầm cột: lúc $4$ giờ nhiệt độ là $21$, lúc $12$ giờ là $31$.' }] },

      { id: '27.10', muc: 3, de: 'Một bể chứa $1200$ lít nước. Mở vòi xả, mỗi phút chảy ra $x$ lít thì thời gian xả hết bể là $t = \\frac{1200}{x}$ (phút).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Thời gian xả hết bể khi $x = 40$ (phút)', kieu: 'so', gt: 30, loiThuongGap: [{ gt: 48000, giaiThich: 'Phải chia $1200$ cho $40$.' }] },
          { nhan: 'Lưu lượng $x$ để xả hết bể trong $24$ phút (lít/phút)', kieu: 'so', gt: 50, loiThuongGap: [{ gt: 28800, giaiThich: 'Từ $\\frac{1200}{x} = 24$ suy ra $x = 1200 : 24$.' }] }] },
        goiY: ['Thay $x = 40$ vào công thức để tính $t$.', 'Với $t = 24$: giải $\\frac{1200}{x} = 24$, tức là $x = \\frac{1200}{24}$.'],
        loiGiai: ['$x = 40$: $t = \\frac{1200}{40} = 30$ (phút).', '$t = 24$: $x = \\frac{1200}{24} = 50$ (lít/phút).'] },

      { id: '27.11', muc: 3, de: 'Trên mặt phẳng toạ độ cho $A(-2; 1)$, $B(3; 1)$, $C(3; -3)$. Tam giác $ABC$ vuông tại $B$. Tính diện tích tam giác $ABC$ (mỗi đơn vị trên trục ứng với $1$ cm).',
        hinh: { widget: 'doThi', config: { bbox: [-4, 4, 5, -5], doan: [[-2, 1, 3, 1], [3, 1, 3, -3], [3, -3, -2, 1]], diem: [{ x: -2, y: 1, ten: 'A' }, { x: 3, y: 1, ten: 'B' }, { x: 3, y: -3, ten: 'C' }] } },
        dapAn: { kieu: 'so', gt: 10 },
        goiY: ['$A$ và $B$ cùng tung độ $1$ nên $AB$ nằm ngang: $AB = 3 - (-2)$.', '$B$ và $C$ cùng hoành độ $3$ nên $BC$ thẳng đứng: $BC = 1 - (-3)$. Diện tích tam giác vuông $= \\frac{1}{2}\\cdot AB\\cdot BC$.'],
        loiGiai: ['$AB = 3 - (-2) = 5$ (cm), $BC = 1 - (-3) = 4$ (cm).', '$S = \\frac{1}{2}\\cdot 5\\cdot 4 = 10$'],
        loiThuongGap: [{ gt: 20, giaiThich: 'Diện tích tam giác vuông là **một nửa** tích hai cạnh góc vuông.' }, { gt: 2, giaiThich: '$AB = 3 - (-2) = 5$, không phải $3 - 2 = 1$. Khoảng cách phải lấy số lớn trừ số bé (cẩn thận số âm).' }] },

      { id: '27.12', muc: 3, de: 'Điểm $M$ nằm trên **trục tung**, cách gốc $O$ một khoảng $4$ đơn vị và ở **phía dưới** trục hoành. Tìm toạ độ của $M$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Hoành độ của $M$', kieu: 'so', gt: 0, loiThuongGap: [{ gt: -4, giaiThich: '$M$ nằm **trên trục tung** nên hoành độ bằng $0$.' }] },
          { nhan: 'Tung độ của $M$', kieu: 'so', gt: -4, loiThuongGap: [{ gt: 4, giaiThich: '$M$ ở **phía dưới** trục hoành nên tung độ âm.' }] }] },
        goiY: ['Điểm trên trục tung có hoành độ bằng bao nhiêu?', 'Phía dưới trục hoành thì tung độ âm.'],
        loiGiai: ['$M$ thuộc trục tung nên hoành độ bằng $0$.', '$M$ ở dưới trục hoành, cách $O$ là $4$ nên tung độ là $-4$.', 'Vậy $M(0; -4)$.'] }
    ],

    timLoi: [
      { de: 'Bạn Vuông xác định vị trí điểm $N(-3; -2)$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Hoành độ $-3 < 0$ nên $N$ nằm bên trái trục $Oy$.', 'Tung độ $-2 < 0$ nên $N$ nằm phía dưới trục $Ox$.', 'Vậy $N$ nằm ở góc phần tư thứ II.'],
        dongSai: 2, giaiThich: 'Góc dưới bên trái là góc phần tư thứ **III**. Góc II là góc **trên** bên trái (tung độ dương).',
        sua: 'Vậy $N$ nằm ở góc phần tư thứ III.' },
      { de: 'Bạn Tròn đọc toạ độ điểm $M$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Từ $M$ kẻ vuông góc xuống trục $Ox$, gặp tại điểm $4$.', 'Từ $M$ kẻ vuông góc sang trục $Oy$, gặp tại điểm $-1$.', 'Vậy $M(-1; 4)$.'],
        dongSai: 2, giaiThich: 'Trong cặp toạ độ, **hoành độ** (đọc trên $Ox$) viết **trước**, tung độ viết sau. $M(-1; 4)$ là một điểm khác hẳn!',
        sua: 'Vậy $M(4; -1)$.' },
      { de: 'Cho bảng: $x$ là $1; 2; 3; 4$ và $y$ tương ứng là $5; 5; 6; 6$. Bạn Nam lập luận như sau. Dòng nào sai?',
        loiGiaiSai: ['Với $x = 1$ và $x = 2$ ta đều có $y = 5$.', 'Hai giá trị $x$ khác nhau cho cùng một $y$.', 'Vậy $y$ không phải là hàm số của $x$.'],
        dongSai: 2, giaiThich: 'Định nghĩa chỉ cấm **một** $x$ ứng với **hai** $y$. Hai $x$ khác nhau cho cùng một $y$ thì vẫn được. Ở đây mỗi $x$ cho đúng một $y$.',
        sua: 'Vậy $y$ là hàm số của $x$.' }
    ]
  });
})();
