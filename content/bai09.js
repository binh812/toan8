// Bài 9 – Phân tích đa thức thành nhân tử (SGK Toán 8 KNTT Tập 1, tr. 42–44)
(function () {
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  TOAN8.bai({
    id: 9, ten: 'Phân tích đa thức thành nhân tử', sgk: { tap: 1, trang: 42 },

    khamPha: {
      nhiemVu: 'Làm ngược lại phép nhân! Hình chữ nhật dưới đây ghép từ hai mảnh có diện tích $\\ca{2x^2}$ (mảnh cam) và $\\cc{6x}$ (mảnh xanh lá), nhưng các cạnh bị che (dấu ?). Kéo thanh trượt **x** và quan sát: hai mảnh có **chung một cạnh** (chiều rộng). Em hãy đoán chiều rộng chung đó và hai đoạn của chiều dài, rồi viết $2x^2 + 6x$ thành **tích** của chiều rộng và chiều dài.',
      widget: 'dienTich',
      config: {
        hang: [{ nhan: '?', dai: '2x', mau: CAM }],
        cot: [{ nhan: '?', dai: 'x', mau: CAM }, { nhan: '?', dai: '3', mau: XANH }],
        o: [['2x^2', '6x']],
        thanhTruot: [{ ten: 'x', min: 1, max: 5, buoc: 0.5, gt: 2 }],
        congThuc: '\\ca{2x^2} + \\cc{6x} =\\;?\\cdot(\\;?\\;+\\;?\\;)'
      },
      cauHoi: {
        de: 'Viết $2x^2 + 6x$ thành một tích (chiều rộng × chiều dài).',
        dapAn: { kieu: 'bieuThuc', gt: '2x(x+3)', dang: 'nhanTu' },
        goiY: ['$2x^2 = 2x\\cdot x$ và $6x = 2x\\cdot 3$: cả hai mảnh đều có thừa số $2x$.', 'Chiều rộng chung là $2x$, chiều dài là $x + 3$.'],
        loiGiai: [
          '$\\ca{2x^2} = 2x\\cdot \\ca{x}$ và $\\cc{6x} = 2x\\cdot \\cb{3}$.',
          'Chiều rộng chung là $2x$, chiều dài là $\\ca{x} + \\cb{3}$.',
          'Vậy $2x^2 + 6x = 2x(x+3)$. Viết một đa thức thành tích như vậy gọi là **phân tích thành nhân tử**.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Phân tích đa thức thành nhân tử',
        noiDung: '**Phân tích đa thức thành nhân tử** (hay thừa số) là biến đổi đa thức đó thành một **tích** của những đa thức.\n\nVí dụ: $x^3 + x = x(x^2 + 1)$. Ở đây $x$ và $x^2 + 1$ là các **nhân tử**.' },

      { loai: 'dinhLi', tieuDe: 'Cách 1. Đặt nhân tử chung',
        noiDung: '$$\\cc{A}B + \\cc{A}C = \\cc{A}(B + C)$$\n\nTìm nhân tử chung: lấy **ƯCLN của các hệ số** nhân với **các biến có mặt ở mọi hạng tử** (lấy số mũ nhỏ nhất).\n\nVí dụ: $6x^2 - 9x = \\cc{3x}\\cdot 2x - \\cc{3x}\\cdot 3 = 3x(2x - 3)$.' },
      { loai: 'hinh', widget: 'dienTich',
        config: {
          hang: [{ nhan: '3x', dai: '3x', mau: CAM }],
          cot: [{ nhan: 'x', dai: 'x', mau: CAM }, { nhan: '2', dai: '2', mau: XANH }],
          o: [['3x^2', '6x']],
          thanhTruot: [{ ten: 'x', min: 1, max: 5, buoc: 0.5, gt: 2 }],
          congThuc: '\\ca{3x^2} + \\cc{6x} = 3x(\\ca{x} + \\cb{2})'
        },
        chuThich: 'Hai mảnh $\\ca{3x^2}$ và $\\cc{6x}$ có chung cạnh $3x$. Ghép lại được hình chữ nhật cạnh $3x$ và $x + 2$: đó chính là phép đặt nhân tử chung.' },

      { loai: 'dinhLi', tieuDe: 'Cách 2. Sử dụng hằng đẳng thức',
        noiDung: 'Nhìn số hạng tử để đoán hằng đẳng thức:\n\n**2 hạng tử:** $A^2 - B^2 = (A-B)(A+B)$; $\\;A^3 + B^3$, $A^3 - B^3$.\n\n**3 hạng tử:** $A^2 \\pm 2AB + B^2 = (A \\pm B)^2$.\n\n**4 hạng tử:** $(A \\pm B)^3$.\n\nVí dụ: $x^2 + 6x + 9 = \\ca{x}^2 + \\cc{2\\cdot x\\cdot 3} + \\cb{3}^2 = (\\ca{x} + \\cb{3})^2$.' },
      { loai: 'hinh', widget: 'dienTich',
        config: {
          hang: [{ nhan: 'x', dai: 'x', mau: CAM }, { nhan: '3', dai: '3', mau: XANH }],
          cot: [{ nhan: 'x', dai: 'x', mau: CAM }, { nhan: '3', dai: '3', mau: XANH }],
          o: [['x^2', '3x'], ['3x', '9']],
          thanhTruot: [{ ten: 'x', min: 1, max: 6, buoc: 0.5, gt: 4 }],
          congThuc: '\\ca{x^2} + \\cc{6x} + \\cb{9} = (\\ca{x} + \\cb{3})^2'
        },
        chuThich: 'Bốn mảnh $x^2$, $3x$, $3x$, $9$ ghép lại vừa khít một **hình vuông** cạnh $x + 3$.' },

      { loai: 'dinhLi', tieuDe: 'Cách 3. Nhóm hạng tử',
        noiDung: 'Nhóm các hạng tử thích hợp để mỗi nhóm có nhân tử chung, rồi đặt nhân tử chung **lần nữa**:\n\n$x^2 - xy + 2x - 2y = (x^2 - xy) + (2x - 2y) = x(x - y) + 2(x - y) = (x - y)(x + 2)$.\n\nMột đa thức có thể có nhiều cách nhóm khác nhau, đều cho cùng kết quả.' },

      { loai: 'chuY', tieuDe: 'Phải phân tích đến cùng',
        noiDung: 'Phân tích xong khi **không nhân tử nào còn phân tích tiếp được**.\n\n$x^3 - x = x(x^2 - 1)$ là **chưa xong**, vì $x^2 - 1 = (x-1)(x+1)$.\n\nKết quả đúng: $x^3 - x = x(x - 1)(x + 1)$.\n\n$2x^2 - 4x = 2(x^2 - 2x)$ cũng **chưa xong**: nhân tử chung phải là $2x$, nên $2x^2 - 4x = 2x(x - 2)$.\n\nThứ tự nên thử: **đặt nhân tử chung** trước, rồi **hằng đẳng thức**, rồi **nhóm hạng tử**.' },
      { loai: 'chuY', tieuDe: 'Ứng dụng: tìm x khi tích bằng 0',
        noiDung: 'Nếu $A\\cdot B = 0$ thì $A = 0$ hoặc $B = 0$.\n\nVí dụ: $x^2 - 3x = 0 \\Rightarrow x(x - 3) = 0 \\Rightarrow x = 0$ hoặc $x = 3$.\n\n**Không được chia** hai vế cho $x$ (vì $x$ có thể bằng 0) — làm vậy sẽ **mất nghiệm** $x = 0$.' }
    ],

    viDu: [
      { de: 'Phân tích $6x^2y - 9xy^2$ thành nhân tử.', buoc: [
        { lam: 'Nhân tử chung: $3xy$', vi: 'ƯCLN$(6, 9) = 3$; biến $x$ và $y$ có ở cả hai hạng tử, lấy số mũ nhỏ nhất là $x$, $y$.' },
        { lam: '$6x^2y - 9xy^2 = 3xy\\cdot 2x - 3xy\\cdot 3y$', vi: 'Viết mỗi hạng tử thành tích có chứa $3xy$.' },
        { lam: '$= 3xy(2x - 3y)$', vi: 'Đặt $3xy$ ra ngoài ngoặc.' } ] },
      { de: 'Phân tích $x^3 - 9x$ thành nhân tử.', buoc: [
        { lam: '$x^3 - 9x = x(x^2 - 9)$', vi: 'Đặt nhân tử chung $x$ trước.' },
        { lam: '$= x(x^2 - 3^2)$', vi: '$x^2 - 9$ vẫn là hiệu hai bình phương: **chưa xong**!' },
        { lam: '$= x(x - 3)(x + 3)$', vi: 'Dùng $A^2 - B^2 = (A-B)(A+B)$. Bây giờ mới phân tích đến cùng.' } ] },
      { de: 'Phân tích $x^2 + 3x + xy + 3y$ thành nhân tử.', buoc: [
        { lam: '$x^2 + 3x + xy + 3y = (x^2 + 3x) + (xy + 3y)$', vi: 'Nhóm hai hạng tử đầu và hai hạng tử cuối.' },
        { lam: '$= x(x + 3) + y(x + 3)$', vi: 'Đặt nhân tử chung trong từng nhóm. Hai nhóm có chung $(x + 3)$.' },
        { lam: '$= (x + 3)(x + y)$', vi: 'Đặt $(x + 3)$ ra ngoài.' } ] },
      { de: 'Tìm tất cả số $x$ để $2x^2 + x = 0$ (bài toán mở đầu).', buoc: [
        { lam: '$2x^2 + x = x(2x + 1)$', vi: 'Phân tích vế trái thành nhân tử.' },
        { lam: '$x(2x + 1) = 0$ nên $x = 0$ hoặc $2x + 1 = 0$', vi: 'Tích bằng 0 khi một trong các thừa số bằng 0.' },
        { lam: '$x = 0$ hoặc $x = -\\frac{1}{2}$', vi: 'Giải $2x + 1 = 0$ được $x = -\\frac{1}{2}$. Có **hai** giá trị.' } ] },
      { de: 'Tính nhanh $47\\cdot 53 + 47\\cdot 47$.', buoc: [
        { lam: '$47\\cdot 53 + 47\\cdot 47 = 47\\cdot (53 + 47)$', vi: 'Đặt nhân tử chung $47$.' },
        { lam: '$= 47\\cdot 100 = 4700$', vi: 'Tính nhẩm.' } ] }
    ],

    viDuMo: [
      { de: 'Phân tích $5x^2 - 10x$ thành nhân tử.', buoc: [
        { lam: 'Nhân tử chung là $5x$', vi: 'ƯCLN$(5, 10) = 5$, biến chung $x$ (số mũ nhỏ nhất là 1).' },
        { lam: '$5x^2 - 10x = 5x(x - 2)$', vi: 'Em hãy viết kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '5x(x-2)', dang: 'nhanTu' } } ] },
      { de: 'Tìm $x$, biết $x^2 - 9 = 0$.', buoc: [
        { lam: '$x^2 - 9 = (x - 3)(x + 3) = 0$', vi: 'Phân tích bằng hiệu hai bình phương.' },
        { lam: '$x = 3$ hoặc $x = -3$', vi: 'Em hãy ghi các giá trị của $x$ (cách nhau bằng dấu ;):', an: true,
          dapAn: { kieu: 'nghiem', gt: [3, -3] } } ] }
    ],

    baiTap: [
      { id: '9.1', muc: 1, de: 'Phân tích $3x + 12$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: '3(x+4)', dang: 'nhanTu' },
        goiY: ['ƯCLN$(3, 12) = 3$.', '$3x = 3\\cdot x$, $12 = 3\\cdot 4$.'],
        loiGiai: ['$3x + 12 = 3\\cdot x + 3\\cdot 4$', '$= 3(x + 4)$'],
        loiThuongGap: [{ gt: '3(x+12)', giaiThich: 'Khi đặt 3 ra ngoài, phải **chia** 12 cho 3: còn lại 4.' }] },

      { id: '9.2', muc: 1, de: 'Phân tích $x^2 - 7x$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: 'x(x-7)', dang: 'nhanTu' },
        goiY: ['Cả hai hạng tử đều có $x$.', '$x^2 = x\\cdot x$, $7x = x\\cdot 7$.'],
        loiGiai: ['$x^2 - 7x = x\\cdot x - x\\cdot 7$', '$= x(x - 7)$'],
        loiThuongGap: [{ gt: 'x(x+7)', giaiThich: 'Giữ nguyên dấu trừ: $x^2 - 7x = x(x - 7)$.' }] },

      { id: '9.3', muc: 1, de: 'Phân tích $2x^2 - 4x$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: '2x(x-2)', dang: 'nhanTu' },
        goiY: ['Nhân tử chung gồm cả **số** và **biến**.', 'ƯCLN$(2, 4) = 2$, biến chung là $x$: nhân tử chung là $2x$.'],
        loiGiai: ['$2x^2 - 4x = 2x\\cdot x - 2x\\cdot 2$', '$= 2x(x - 2)$'],
        loiThuongGap: [{ gt: '2x(x-4)', giaiThich: '$4x : 2x = 2$, nên trong ngoặc là $x - 2$.' }] },

      { id: '9.4', muc: 1, de: 'Đúng hay sai: viết $x^2 + 2x + 3 = x(x + 2) + 3$ là đã phân tích đa thức thành nhân tử.',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Phân tích thành nhân tử là viết thành một **tích**.', 'Vế phải $x(x+2) + 3$ là một **tổng** (còn dấu $+3$ ở ngoài).'],
        loiGiai: ['$x(x + 2) + 3$ là tổng của $x(x+2)$ và $3$, không phải một tích.', 'Vậy khẳng định **sai**.'] },

      { id: '9.5', muc: 2, de: 'Phân tích $x^2 - 16$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: '(x-4)(x+4)', dang: 'nhanTu' },
        goiY: ['Hai hạng tử, có dấu trừ: thử hiệu hai bình phương.', '$16 = 4^2$.'],
        loiGiai: ['$x^2 - 16 = x^2 - 4^2$', '$= (x - 4)(x + 4)$'],
        loiThuongGap: [{ gt: '(x-4)^2', giaiThich: '$(x-4)^2 = x^2 - 8x + 16$. Hiệu hai bình phương là $(A-B)(A+B)$.' }] },

      { id: '9.6', muc: 2, de: 'Phân tích $9x^2 + 6x + 1$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: '(3x+1)^2', dang: 'nhanTu' },
        goiY: ['Ba hạng tử: thử bình phương của một tổng.', '$9x^2 = (3x)^2$, $1 = 1^2$, kiểm tra $2\\cdot 3x\\cdot 1 = 6x$.'],
        loiGiai: ['$9x^2 + 6x + 1 = (3x)^2 + 2\\cdot 3x\\cdot 1 + 1^2$', '$= (3x + 1)^2$'],
        loiThuongGap: [{ gt: '(9x+1)^2', giaiThich: '$A^2 = 9x^2$ nên $A = 3x$, không phải $9x$.' }] },

      { id: '9.7', muc: 2, de: 'Phân tích $x^2 - xy + 4x - 4y$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: '(x-y)(x+4)', dang: 'nhanTu' },
        goiY: ['Nhóm $(x^2 - xy) + (4x - 4y)$.', 'Mỗi nhóm đặt nhân tử chung: $x(x - y) + 4(x - y)$.'],
        loiGiai: ['$x^2 - xy + 4x - 4y = (x^2 - xy) + (4x - 4y)$', '$= x(x - y) + 4(x - y)$', '$= (x - y)(x + 4)$'],
        loiThuongGap: [{ gt: '(x-y)(x-4)', giaiThich: 'Nhóm thứ hai là $4x - 4y = +4(x - y)$, nên thừa số còn lại là $x + 4$.' }] },

      { id: '9.8', muc: 2, de: 'Tìm $x$, biết $x^2 - 5x = 0$.',
        dapAn: { kieu: 'nghiem', gt: [0, 5] },
        goiY: ['Phân tích vế trái: $x^2 - 5x = x(x - 5)$.', 'Tích bằng 0 khi $x = 0$ hoặc $x - 5 = 0$. Đừng chia hai vế cho $x$!'],
        loiGiai: ['$x^2 - 5x = 0 \\Rightarrow x(x - 5) = 0$', '$x = 0$ hoặc $x - 5 = 0$', 'Vậy $x = 0$ hoặc $x = 5$.'] },

      { id: '9.9', muc: 2, de: 'Tính nhanh $37\\cdot 64 + 37\\cdot 36$.',
        dapAn: { kieu: 'so', gt: 3700 },
        goiY: ['Hai tích có chung thừa số $37$.', '$37\\cdot 64 + 37\\cdot 36 = 37\\cdot (64 + 36)$.'],
        loiGiai: ['$37\\cdot 64 + 37\\cdot 36 = 37\\cdot (64 + 36)$', '$= 37\\cdot 100$', '$= 3700$'] },

      { id: '9.10', muc: 3, de: 'Phân tích $x^3 - 4x^2 + 4x$ thành nhân tử (phân tích đến cùng).',
        dapAn: { kieu: 'bieuThuc', gt: 'x(x-2)^2', dang: 'nhanTu' },
        goiY: ['Đặt nhân tử chung $x$ trước.', '$x^2 - 4x + 4$ là bình phương của một hiệu.'],
        loiGiai: ['$x^3 - 4x^2 + 4x = x(x^2 - 4x + 4)$', '$= x(x^2 - 2\\cdot x\\cdot 2 + 2^2)$', '$= x(x - 2)^2$'] },

      { id: '9.11', muc: 3, de: 'Tìm $x$, biết $3x^3 - 12x = 0$.',
        dapAn: { kieu: 'nghiem', gt: [0, 2, -2] },
        goiY: ['$3x^3 - 12x = 3x(x^2 - 4)$, rồi phân tích tiếp $x^2 - 4$.', '$3x(x - 2)(x + 2) = 0$: có **ba** thừa số chứa $x$, nên có ba giá trị của $x$.'],
        loiGiai: ['$3x^3 - 12x = 3x(x^2 - 4) = 3x(x - 2)(x + 2)$', '$3x(x - 2)(x + 2) = 0 \\Rightarrow x = 0$ hoặc $x - 2 = 0$ hoặc $x + 2 = 0$', 'Vậy $x = 0$; $x = 2$; $x = -2$.'] },

      { id: '9.12', muc: 3, de: 'Tính nhanh giá trị của $A = x^2 - xy + 3x - 3y$ tại $x = 53$, $y = 3$.',
        dapAn: { kieu: 'so', gt: 2800 },
        goiY: ['Phân tích $A$ thành nhân tử bằng cách nhóm hạng tử.', '$A = x(x - y) + 3(x - y) = (x - y)(x + 3)$.'],
        loiGiai: ['$A = (x^2 - xy) + (3x - 3y) = x(x - y) + 3(x - y) = (x - y)(x + 3)$', 'Tại $x = 53$, $y = 3$: $A = (53 - 3)(53 + 3) = 50\\cdot 56$', '$A = 2800$'],
        loiThuongGap: [{ gt: 2500, giaiThich: 'Thừa số thứ hai là $x + 3 = 56$, không phải $x - 3 = 50$.' }] }
    ],

    timLoi: [
      { de: 'Bạn Vuông phân tích $x^3 - 25x$ thành nhân tử như sau. Dòng nào sai?',
        loiGiaiSai: ['$x^3 - 25x = x\\cdot x^2 - x\\cdot 25$', '$= x(x^2 - 25)$', 'Vậy kết quả là $x(x^2 - 25)$. Xong!'],
        dongSai: 2, giaiThich: 'Phân tích **chưa triệt để**: nhân tử $x^2 - 25 = (x - 5)(x + 5)$ vẫn còn phân tích tiếp được.', sua: '$x^3 - 25x = x(x - 5)(x + 5)$' },
      { de: 'Bạn Hoa phân tích $6x^2 - 9x$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$6x^2 - 9x = 3(2x^2 - 3x)$', 'Vậy $6x^2 - 9x = 3(2x^2 - 3x)$.'],
        dongSai: 0, giaiThich: 'Nhân tử chung chưa lấy hết: cả hai hạng tử còn có chung $x$. Nhân tử chung đúng là $3x$ (chưa triệt để).', sua: '$6x^2 - 9x = 3x(2x - 3)$' },
      { de: 'Bạn Tuấn tìm $x$ biết $x^2 = 3x$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$x^2 = 3x$', 'Chia hai vế cho $x$ được $x = 3$', 'Vậy $x = 3$.'],
        dongSai: 1, giaiThich: 'Không được chia cho $x$ vì $x$ có thể bằng 0 — bạn Tuấn làm **mất nghiệm** $x = 0$. Đúng là: $x^2 - 3x = 0 \\Rightarrow x(x - 3) = 0 \\Rightarrow x = 0$ hoặc $x = 3$.', sua: '$x^2 - 3x = 0 \\Rightarrow x(x-3) = 0 \\Rightarrow x = 0$ hoặc $x = 3$' },
      { de: 'Bạn Long phân tích $x^2 - xy - x + y$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$x^2 - xy - x + y = (x^2 - xy) - (x + y)$', '$= x(x - y) - (x + y)$'],
        dongSai: 0, giaiThich: 'Đặt dấu trừ trước ngoặc thì phải **đổi dấu** các hạng tử trong ngoặc: $-x + y = -(x - y)$.', sua: '$(x^2 - xy) - (x - y) = x(x - y) - (x - y) = (x - y)(x - 1)$' }
    ]
  });
})();
