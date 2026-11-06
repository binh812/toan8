// Bài 6 – Hiệu hai bình phương. Bình phương của một tổng hay một hiệu (SGK Toán 8 KNTT Tập 1, tr. 29–33)
(function () {
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';

  // Mô hình (a+b)²: hình vuông cạnh a+b chia thành 4 mảnh.
  var hinhTong = {
    hang: [{ nhan: 'a', dai: 'a', mau: CAM }, { nhan: 'b', dai: 'b', mau: XANH }],
    cot: [{ nhan: 'a', dai: 'a', mau: CAM }, { nhan: 'b', dai: 'b', mau: XANH }],
    thanhTruot: [{ ten: 'a', min: 1, max: 6, buoc: 0.5, gt: 3 }, { ten: 'b', min: 1, max: 6, buoc: 0.5, gt: 2 }],
    congThuc: '(\\ca{a}+\\cb{b})^2 = \\ca{a^2} + \\cc{2ab} + \\cb{b^2}'
  };

  // Mô hình (a−b)²: hình vuông cạnh a chia thành (a−b) và b.
  var hinhHieu = {
    hang: [{ nhan: 'a{-}b', dai: 'a-b', mau: TIM }, { nhan: 'b', dai: 'b', mau: XANH }],
    cot: [{ nhan: 'a{-}b', dai: 'a-b', mau: TIM }, { nhan: 'b', dai: 'b', mau: XANH }],
    thanhTruot: [{ ten: 'a', min: 2, max: 7, buoc: 0.5, gt: 5 }, { ten: 'b', min: 0.5, max: 4, buoc: 0.5, gt: 2 }],
    rangBuoc: function (env) { return env.b < env.a; },
    congThuc: '\\cd{(a-b)^2} = a^2 - \\cc{2(a-b)b} - \\cb{b^2} = a^2 - 2ab + b^2'
  };

  // Cấu hình hình cho "Nhìn là hiểu": x, y là số bất kì nên chỉ số cụ thể mới cần ghi "không theo tỉ lệ"
  var KHONG_TI_LE = 'Hình không theo tỉ lệ.';
  function mv(dang, tenA, tenB, a, b, nhan, ghiChu) {
    // Hình cắt bớt chỉ vẽ được khi cạnh lớn hơn phần cắt: nói rõ điều kiện đó
    var chu = ghiChu || (dang === 'tong' ? null : 'Hình vẽ khi ' + tenA + ' lớn hơn ' + tenB + '.');
    return { ten: 'manhVuong', thamSo: { a: a, b: b }, tuyChon: { dang: dang, tenA: tenA, tenB: tenB, nhan: nhan }, ghiChu: chu };
  }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }

  TOAN8.bai({
    id: 6, ten: 'Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', sgk: { tap: 1, trang: 29 },

    nhin: {
      tieuDe: 'Bốn mảnh ghép khít thành một hình vuông', loai: 'chungMinh',
      luuY: 'Hình đúng khi $a$, $b$ dương. Nhân phá ngoặc cho thấy công thức đúng với mọi số.',
      canh: { ten: 'manhVuong', thuPha: true, tuyChon: { dang: 'tong' }, moTa: 'Bốn mảnh a bình phương, hai mảnh ab, b bình phương ghép lại thành hình vuông cạnh a cộng b.',
        dongSo: (function (g) { return function (p, f) { var s = g(p, f); return p.dau < 0 ? '(Hình vẽ theo độ dài dương $|b| = ' + String(p.b).replace('.', '{,}') + '$.) ' + s : s; }; })(function (p, f) { var so = function (x) { return f(x).replace(',', '{,}'); };
          return '$\\ca{' + so(p.a * p.a) + '} + \\cc{2 \\cdot ' + so(p.a * p.b) + '} + \\cb{' + so(p.b * p.b) + '} = ' + so((p.a + p.b) * (p.a + p.b)) + ' = (' + so(p.a) + ' + ' + so(p.b) + ')^2$'; }) },
      buoc: [
        { t: 0, chu: 'Bốn mảnh: một hình vuông $\\ca{a^2}$, một hình vuông $\\cb{b^2}$ và **hai** mảnh chữ nhật $\\cc{ab}$.' },
        { t: 0.1, chu: 'Đẩy các mảnh lại gần nhau. Không mảnh nào đổi kích thước.' },
        { t: 1, chu: 'Chúng ghép khít thành hình vuông cạnh $\\ca{a} + \\cb{b}$.' }
      ],
      ketLuan: 'Diện tích hình vuông lớn bằng tổng bốn mảnh: $$(\\ca{a} + \\cb{b})^2 = \\ca{a}^2 + \\cc{2ab} + \\cb{b}^2$$',
      dung: {
        tieuDe: 'Đừng quên hai mảnh ở giữa', tuBai: '6.1',
        canh: { ten: 'manhVuong', thamSo: { a: 5, b: 3 }, tuyChon: { dang: 'tong', tenA: 'x', tenB: '5', anAb: true, nhan: { a2: 'x²', ab: '5x', b2: '25' } } },
        phanUng: [
          { gt: 'x^2+10x', trangThai: 'thieuManhB', loi: 'Còn trống góc dưới: em chưa tính mảnh $5 \\cdot 5 = 25$.' },
          { gt: 'x^2+25', trangThai: 'thieuHaiManh', loi: 'Hình vuông cạnh $x + 5$ còn trống hai chỗ. Em mới tính mảnh $x^2$ và mảnh $25$, còn thiếu **hai** mảnh $5x$.' },
          { gt: 'x^2+5x+25', trangThai: 'thieuMotManh', loi: 'Còn trống một chỗ: có **hai** mảnh $5x$, em mới tính một.' }
        ],
        dungChu: 'Đủ bốn mảnh: $x^2$, hai mảnh $5x$ và $25$.', saiChu: 'Đếm từng mảnh trên hình: một mảnh $x^2$, hai mảnh $5x$, một mảnh $25$.'
      },
      suyRa: {
        tieuDe: 'Cắt và ghép: vẫn là chuyện diện tích',
        baDe: [
          { tuBai: '6.8', canh: mv('hieuHaiBP', '50', '2', 5, 1, { a2: '50²', b2: '2²' }, KHONG_TI_LE), tenNut: 'Cắt và ghép lại',
            dungChu: '$52 \\cdot 48 = (50 + 2)(50 - 2) = 50^2 - 2^2 = 2496$.', saiChu: 'Hình chữ nhật $(50 + 2)(50 - 2)$ chính là hình vuông $50^2$ bỏ đi góc $2^2$.' },
          { tuBai: '6.9', canh: mv('hieu', '100', '1', 5, 1, { a2: '100²', ab: '100', b2: '1', hieu: '99' }, KHONG_TI_LE), tenNut: 'Cắt hai dải',
            dungChu: '$99^2 = 100^2 - 2 \\cdot 100 + 1 = 9801$.', saiChu: 'Bỏ đi hai dải $100$, nhưng góc $1$ bị trừ hai lần nên phải cộng trả lại.' },
          { tuBai: '6.7', canh: mv('hieuHaiBP', '2x', '3', 5, 2, { a2: '4x²', b2: '9' }), tenNut: 'Cắt và ghép lại',
            dungChu: '$4x^2 - 9 = (2x)^2 - 3^2 = (2x - 3)(2x + 3)$.', saiChu: '$4x^2$ là hình vuông cạnh $2x$, $9$ là hình vuông cạnh $3$. Sau khi ghép lại, hai cạnh là gì?' }
        ],
        cachNhan: 'Thấy hai số cách đều một số tròn, hoặc một hiệu của hai bình phương: nghĩ tới hình vuông bị khoét góc. Thấy một số gần số tròn được bình phương: nghĩ tới hình vuông bị cắt hai dải.'
      }
    },
    khamPha: {
      nhiemVu: 'Kéo thanh trượt **a** và **b**. Hình vuông lớn có cạnh $\\ca{a}+\\cb{b}$ được chia thành 4 mảnh. Em hãy quan sát diện tích từng mảnh: mảnh cam là $\\ca{a^2}$, mảnh xanh dương là $\\cb{b^2}$, còn các mảnh xanh lá thì sao?',
      widget: 'dienTich',
      config: hinhTong,
      cauHoi: {
        de: 'Hình vuông cạnh $a+b$ có mấy mảnh hình chữ nhật (màu xanh lá) có diện tích $ab$?',
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Đếm các mảnh màu xanh lá trong hình.', 'Mỗi mảnh xanh lá có một cạnh $a$ và một cạnh $b$.'],
        loiGiai: [
          'Có **hai** mảnh $a \\times b$ (màu xanh lá).',
          'Vậy diện tích hình vuông là $(\\ca{a}+\\cb{b})^2 = \\ca{a^2} + \\cc{2ab} + \\cb{b^2}$.',
          'Đó là lí do có hạng tử $\\cc{2ab}$: em **không** được bỏ quên nó!'
        ]
      }
    },

    mucTieu: [
      'Nói được vì sao $(a + b)^2 = a^2 + 2ab + b^2$ bằng cách chỉ vào bốn mảnh ghép thành hình vuông.',
      'Khai triển bình phương của một tổng, bình phương của một hiệu và viết hiệu hai bình phương thành tích.',
      'Viết biểu thức dạng $A^2 + 2AB + B^2$ thành bình phương của một tổng (dùng hằng đẳng thức theo chiều ngược lại).',
      'Tính nhanh các số như $99^2$ hay $52 \\cdot 48$ bằng hằng đẳng thức.',
      'Chỉ ra chỗ sai khi một bạn viết $(a + b)^2 = a^2 + b^2$, bằng cách chỉ vào hai mảnh $ab$ bị bỏ quên.'
    ],
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hằng đẳng thức',
        noiDung: 'Nếu hai biểu thức $A$ và $B$ luôn cùng nhận giá trị bằng nhau **với mọi giá trị của biến** thì ta nói $A = B$ là một **đồng nhất thức** hay một **hằng đẳng thức**.\n\nVí dụ: $a(a-2) = a^2 - 2a$ là hằng đẳng thức (nhân phá ngoặc là thấy).\n\nCòn $a^2 - 1 = 3a$ **không** là hằng đẳng thức: thay $a = 1$ thì vế trái bằng $0$, vế phải bằng $3$.' },
      { loai: 'chuY', noiDung: '**Mẹo kiểm tra:** chỉ cần tìm **một** giá trị của biến làm hai vế khác nhau là đủ kết luận đẳng thức đó **không** phải hằng đẳng thức.' },

      { loai: 'dinhLi', tieuDe: '1. Hiệu hai bình phương',
        noiDung: 'Với $A$, $B$ là hai biểu thức tuỳ ý:\n\n$$\\ca{A}^2 - \\cb{B}^2 = (\\ca{A} - \\cb{B})(\\ca{A} + \\cb{B})$$\n\nĐọc là: hiệu hai bình phương bằng tích của **hiệu** và **tổng**.' },
      { loai: 'hinh', widget: 'hieuHaiBinhPhuong', config: { a: 5, b: 2 },
        chuThich: 'Hình vuông cạnh $a$ bị khoét đi hình vuông cạnh $b$: phần còn lại có diện tích $a^2 - b^2$. Bấm **Cắt và ghép**: mảnh trên xoay sang phải, ta được hình chữ nhật có hai cạnh $a+b$ và $a-b$.' },

      { loai: 'dinhLi', tieuDe: '2. Bình phương của một tổng',
        noiDung: '$$(\\ca{A}+\\cb{B})^2 = \\ca{A}^2 + \\cc{2\\ca{A}\\cb{B}} + \\cb{B}^2$$\n\nBiến đổi từ vế trái sang vế phải gọi là **khai triển** $(A+B)^2$.' },
      { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao $(a + b)^2 = a^2 + 2ab + b^2$?', config: {
        de: 'Xếp các bước theo đúng thứ tự lập luận (với $a$, $b$ dương). Bước nào chưa đủ căn cứ, máy sẽ nói thiếu gì.',
        canh: { ten: 'manhVuong', tuyChon: { dang: 'tong' } },
        buoc: [
          { id: 'gt', chu: 'Vẽ hình vuông cạnh $a + b$.', canh: { t: 1 } },
          { id: 'dt', chu: 'Diện tích hình vuông đó là $(a + b)^2$.', can: ['gt'], canh: { t: 1 } },
          { id: 'cat', chu: 'Cắt mỗi cạnh thành một đoạn $a$ và một đoạn $b$, kẻ hai đường cắt: hình chia thành bốn mảnh.', can: ['gt'], canh: { t: 0.5 } },
          { id: 'a2', chu: 'Mảnh có hai cạnh đều là $a$ là hình vuông, diện tích $a^2$.', can: ['cat'], canh: { t: 0 } },
          { id: 'b2', chu: 'Mảnh có hai cạnh đều là $b$ là hình vuông, diện tích $b^2$.', can: ['cat'], canh: { t: 0 } },
          { id: 'ab', chu: 'Hai mảnh có một cạnh $a$, một cạnh $b$: mỗi mảnh diện tích $ab$, cả hai là $2ab$.', can: ['cat'], canh: { t: 0 } },
          { id: 'cong', chu: 'Bốn mảnh ghép khít, không chồng lên nhau, nên diện tích cả hình bằng tổng bốn mảnh: $a^2 + 2ab + b^2$.', can: ['a2', 'b2', 'ab'], canh: { t: 1 } },
          { id: 'kl', chu: 'Vậy $(a + b)^2 = a^2 + 2ab + b^2$.', can: ['dt', 'cong'], canh: { t: 1 } }
        ],
        ketLuan: 'Cùng một hình vuông, tính diện tích hai cách: $(a + b)^2 = a^2 + 2ab + b^2$.'
      } },
      { loai: 'hinh', widget: 'dienTich', config: hinhTong,
        chuThich: 'Mỗi mảnh màu ứng với một hạng tử: mảnh cam $\\ca{a^2}$, mảnh xanh dương $\\cb{b^2}$ và **hai** mảnh xanh lá, mỗi mảnh $ab$, cộng lại là $\\cc{2ab}$.' },

      { loai: 'dinhLi', tieuDe: '3. Bình phương của một hiệu',
        noiDung: '$$(\\ca{A}-\\cb{B})^2 = \\ca{A}^2 - \\cc{2\\ca{A}\\cb{B}} + \\cb{B}^2$$\n\nCách nhớ: giống bình phương của một tổng, chỉ **hạng tử giữa** đổi thành dấu trừ. Hạng tử cuối $\\cb{B}^2$ **luôn cộng**.' },
      { loai: 'hinh', widget: 'dienTich', config: hinhHieu,
        chuThich: 'Hình vuông lớn có cạnh $a$, diện tích $a^2$. Mảnh tím là $\\cd{(a-b)^2}$. Muốn có mảnh tím, ta lấy $a^2$ bỏ đi hai mảnh xanh lá (mỗi mảnh $(a-b)b$) và mảnh xanh dương $\\cb{b^2}$:\n\n$(a-b)^2 = a^2 - 2(a-b)b - b^2 = a^2 - 2ab + 2b^2 - b^2 = a^2 - 2ab + b^2$. (Kéo thanh trượt: luôn giữ $b < a$.)' },

      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '$(A+B)^2 \\ne A^2 + B^2$ — em đừng quên hạng tử $\\cc{2AB}$!\n\n$(A-B)^2 \\ne A^2 - B^2$ — vế phải này là **hiệu hai bình phương**, bằng $(A-B)(A+B)$ chứ không phải $(A-B)^2$.\n\nTrong $(A-B)^2 = A^2 - 2AB + B^2$, hạng tử cuối là $+B^2$, **không** phải $-B^2$.\n\nKhi $A = 2x$ thì $A^2 = (2x)^2 = 4x^2$ (bình phương cả hệ số), không phải $2x^2$.' },
      { loai: 'text', tieuDe: 'Dùng theo chiều ngược lại',
        noiDung: 'Ba hằng đẳng thức còn dùng để **viết một biểu thức thành bình phương hoặc thành tích**:\n\n$x^2 + 6x + 9 = x^2 + 2\\cdot x\\cdot 3 + 3^2 = (x+3)^2$;\n\n$x^2 - 16 = x^2 - 4^2 = (x-4)(x+4)$.\n\nVà để **tính nhanh**: $99^2 = (100-1)^2$, $\\;51\\cdot 49 = (50+1)(50-1) = 50^2 - 1^2$.' }
    ],

    viDu: [
      { de: 'Đẳng thức $a(a+3) = a^2 + 3a$ có phải hằng đẳng thức không? Còn $a + 2 = 2a$ thì sao?', hinh: { widget: 'dienTich', config: { hang: [{ nhan: 'a', dai: 'a', mau: CAM }, { nhan: '3', dai: '3', mau: XANH }], cot: [{ nhan: 'a', dai: 'a', mau: CAM }], thanhTruot: [{ ten: 'a', min: 1, max: 6, buoc: 0.5, gt: 3 }], congThuc: '\\ca{a}(\\ca{a}+\\cb{3}) = \\ca{a^2} + \\cc{3a}' } }, buoc: [
        { lam: '$a(a+3) = a\\cdot a + a\\cdot 3 = a^2 + 3a$', vi: 'Nhân phá ngoặc vế trái được đúng vế phải với **mọi** $a$, nên đây là hằng đẳng thức.' },
        { lam: 'Thay $a = 0$ vào $a + 2 = 2a$: vế trái $= 2$, vế phải $= 0$.', vi: 'Tìm được một giá trị làm hai vế khác nhau.' },
        { lam: 'Vậy $a + 2 = 2a$ **không** là hằng đẳng thức.', vi: 'Chỉ cần một giá trị sai là đủ kết luận.' } ] },
      { de: 'Khai triển $(x+3)^2$.', canh: mv('tong', 'x', '3', 5, 3, { a2: 'x²', ab: '3x', b2: '9' }), buoc: [
        { lam: '$(\\ca{x}+\\cb{3})^2 = \\ca{x}^2 + \\cc{2\\cdot x\\cdot 3} + \\cb{3}^2$', vi: 'Áp dụng bình phương của một tổng với $\\ca{A = x}$, $\\cb{B = 3}$.' },
        { lam: '$= x^2 + 6x + 9$', vi: 'Tính $2\\cdot x\\cdot 3 = 6x$ và $3^2 = 9$.' } ] },
      { de: 'Khai triển $(3x - y)^2$.', canh: mv('hieu', '3x', 'y', 5, 2, { a2: '9x²', ab: '3xy', b2: 'y²', hieu: '3x−y' }), buoc: [
        { lam: '$(\\ca{3x}-\\cb{y})^2 = (\\ca{3x})^2 - \\cc{2\\cdot 3x\\cdot y} + \\cb{y}^2$', vi: 'Bình phương của một hiệu với $\\ca{A = 3x}$, $\\cb{B = y}$.' },
        { lam: '$= 9x^2 - 6xy + y^2$', vi: '$(3x)^2 = 9x^2$ (bình phương cả hệ số 3), $2\\cdot 3x\\cdot y = 6xy$.' } ] },
      { de: 'Tính nhanh $198\\cdot 202$ (bài toán mở đầu trong SGK).', canh: mv('hieuHaiBP', '200', '2', 5, 1, { a2: '200²', b2: '2²' }, KHONG_TI_LE), buoc: [
        { lam: '$198\\cdot 202 = (200-2)(200+2)$', vi: 'Hai số cách đều 200: một số kém 2, một số hơn 2.' },
        { lam: '$= 200^2 - 2^2$', vi: 'Hiệu hai bình phương: $(A-B)(A+B) = A^2 - B^2$.' },
        { lam: '$= 40000 - 4 = 39996$', vi: 'Tính nhẩm được ngay.' } ] },
      { de: 'Viết $x^2 + 10x + 25$ dưới dạng bình phương của một tổng.', canh: mv('tong', 'x', '5', 5, 3, { a2: 'x²', ab: '5x', b2: '25' }), buoc: [
        { lam: '$x^2 + 10x + 25 = x^2 + 2\\cdot x\\cdot 5 + 5^2$', vi: 'Nhận ra $x^2 = A^2$, $25 = 5^2 = B^2$, và kiểm tra hạng tử giữa: $2\\cdot x\\cdot 5 = 10x$. Khớp!' },
        { lam: '$= (x+5)^2$', vi: 'Dùng $(A+B)^2 = A^2 + 2AB + B^2$ theo chiều ngược lại.' } ] }
    ],

    viDuMo: [
      { de: 'Khai triển $(2x-1)^2$.', buoc: [
        { lam: '$(2x-1)^2 = (2x)^2 - 2\\cdot 2x\\cdot 1 + 1^2$', vi: 'Bình phương của một hiệu với $A = 2x$, $B = 1$.' },
        { lam: '$= 4x^2 - 4x + 1$', vi: 'Em hãy tính kết quả cuối cùng:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '4x^2-4x+1', dang: 'khaiTrien' },
          loiThuongGap: [{ gt: '4x^2-4x-1', giaiThich: '$B^2 = 1^2 = 1$ luôn cộng: $+1$ chứ không phải $-1$.' }] } ] },
      { de: 'Viết $x^2 - 49$ dưới dạng tích.', buoc: [
        { lam: '$x^2 - 49 = x^2 - 7^2$', vi: 'Viết $49 = 7^2$ để thấy hiệu hai bình phương.' },
        { lam: '$= (x-7)(x+7)$', vi: 'Em hãy viết thành tích:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '(x-7)(x+7)', dang: 'nhanTu' },
          loiThuongGap: [{ gt: '(x-7)^2', giaiThich: '$(x-7)^2 = x^2 - 14x + 49$, không phải $x^2 - 49$. Hiệu hai bình phương là **hiệu nhân tổng**.' }] } ] }
    ],

    baiTap: [
      { id: '6.1', hinhGiai: hg(mv('tong', 'x', '5', 5, 3, { a2: 'x²', ab: '5x', b2: '25' })), muc: 1, de: 'Khai triển $(x+5)^2$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x^2+10x+25', dang: 'khaiTrien' },
        goiY: ['Dùng $(A+B)^2 = A^2 + 2AB + B^2$.', '$A = x$, $B = 5$. Vậy $2AB = 2\\cdot x\\cdot 5 = ?$'],
        loiGiai: ['$(x+5)^2 = x^2 + 2\\cdot x\\cdot 5 + 5^2$', '$= x^2 + 10x + 25$'],
        loiThuongGap: [
          { gt: 'x^2+25', hinh: hg({ ten: 'manhVuong', thamSo: { a: 5, b: 3, trangThai: 'thieuHaiManh' }, tuyChon: { dang: 'tong', tenA: 'x', tenB: '5', nhan: { a2: 'x²', ab: '5x', b2: '25' } } }), giaiThich: 'Em quên hạng tử $2AB = 10x$ rồi. $(A+B)^2 \\ne A^2 + B^2$.' },
          { gt: 'x^2+5x+25', giaiThich: 'Hạng tử giữa là $2AB$, tức $2\\cdot x\\cdot 5 = 10x$, không phải $5x$ (em quên hệ số 2).' }] },

      { id: '6.2', hinhGiai: hg(mv('hieu', 'x', '6', 5, 2, { a2: 'x²', ab: '6x', b2: '36', hieu: 'x−6' })), muc: 1, de: 'Khai triển $(x-6)^2$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x^2-12x+36', dang: 'khaiTrien' },
        goiY: ['Dùng $(A-B)^2 = A^2 - 2AB + B^2$.', '$A = x$, $B = 6$. Hạng tử cuối $B^2 = 36$ mang dấu gì?'],
        loiGiai: ['$(x-6)^2 = x^2 - 2\\cdot x\\cdot 6 + 6^2$', '$= x^2 - 12x + 36$'],
        loiThuongGap: [
          { gt: 'x^2-36', giaiThich: '$(A-B)^2 \\ne A^2 - B^2$. Em còn thiếu hạng tử $-2AB = -12x$, và $B^2$ phải là $+36$.' },
          { gt: 'x^2-12x-36', giaiThich: '$B^2 = 6^2 = 36$ luôn **dương**: phải là $+36$.' },
          { gt: 'x^2-6x+36', giaiThich: 'Hạng tử giữa là $2\\cdot x\\cdot 6 = 12x$. Em quên hệ số 2.' }] },

      { id: '6.3', hinhGiai: hg(mv('hieuHaiBP', 'y', '7', 5, 2, { a2: 'y²', b2: '49' })), muc: 1, de: 'Tính $(y-7)(y+7)$.',
        dapAn: { kieu: 'bieuThuc', gt: 'y^2-49', dang: 'khaiTrien' },
        goiY: ['Đây là dạng $(A-B)(A+B)$.', '$(A-B)(A+B) = A^2 - B^2$ với $A = y$, $B = 7$.'],
        loiGiai: ['$(y-7)(y+7) = y^2 - 7^2$', '$= y^2 - 49$'],
        loiThuongGap: [
          { gt: 'y^2+49', giaiThich: 'Hiệu hai bình phương: $A^2 - B^2$, dấu **trừ**.' },
          { gt: 'y^2-14y+49', giaiThich: 'Đó là $(y-7)^2$. Ở đây là $(y-7)(y+7)$: hai hạng tử $-7y$ và $+7y$ triệt tiêu nhau.' },
          { gt: 'y^2-7', giaiThich: '$B^2 = 7^2 = 49$, em quên bình phương số 7.' }] },

      { id: '6.4', khongHinh: 'Câu hỏi về khái niệm hằng đẳng thức: chỉ cần thử số.', muc: 1, de: 'Đẳng thức nào dưới đây là **hằng đẳng thức**?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$x + 4 = 3x$', '$2x(x-3) = 2x^2 - 6x$', '$(a+1)^2 = a^2 + 1$', '$a^2 - 4 = (a-2)^2$'] },
        goiY: ['Hằng đẳng thức phải đúng với **mọi** giá trị của biến.', 'Thử thay $x = 1$ hoặc $a = 1$ vào từng đẳng thức.'],
        loiGiai: ['$x + 4 = 3x$: thay $x = 0$ được $4 = 0$, sai.', '$(a+1)^2 = a^2 + 1$: thay $a = 1$ được $4 = 2$, sai.', '$a^2 - 4 = (a-2)^2$: thay $a = 0$ được $-4 = 4$, sai.', '$2x(x-3) = 2x^2 - 6x$ đúng với mọi $x$ (nhân phá ngoặc). Đáp án: $2x(x-3) = 2x^2 - 6x$.'] },

      { id: '6.5', hinhGiai: hg(mv('tong', '3x', '2y', 5, 3, { a2: '9x²', ab: '6xy', b2: '4y²' })), muc: 2, de: 'Khai triển $(3x + 2y)^2$.',
        dapAn: { kieu: 'bieuThuc', gt: '9x^2+12xy+4y^2', dang: 'khaiTrien' },
        goiY: ['$A = 3x$, $B = 2y$.', 'Nhớ bình phương cả hệ số: $(3x)^2 = 9x^2$, $(2y)^2 = 4y^2$; còn $2AB = 2\\cdot 3x\\cdot 2y$.'],
        loiGiai: ['$(3x+2y)^2 = (3x)^2 + 2\\cdot 3x\\cdot 2y + (2y)^2$', '$= 9x^2 + 12xy + 4y^2$'],
        loiThuongGap: [
          { gt: '9x^2+4y^2', giaiThich: 'Thiếu hạng tử $2AB = 12xy$. $(A+B)^2 \\ne A^2 + B^2$.' },
          { gt: '3x^2+12xy+2y^2', giaiThich: '$(3x)^2 = 3x\\cdot 3x = 9x^2$: phải bình phương cả hệ số 3. Tương tự $(2y)^2 = 4y^2$.' },
          { gt: '9x^2+6xy+4y^2', giaiThich: 'Quên hệ số 2: $2\\cdot 3x\\cdot 2y = 12xy$.' }] },

      { id: '6.6', hinhGiai: hg(mv('hieu', 'x', '4', 5, 2, { a2: 'x²', ab: '4x', b2: '16', hieu: 'x−4' })), muc: 2, de: 'Viết $x^2 - 8x + 16$ dưới dạng bình phương của một hiệu.',
        dapAn: { kieu: 'bieuThuc', gt: '(x-4)^2', dang: 'nhanTu' },
        goiY: ['So với $A^2 - 2AB + B^2$: $x^2 = A^2$, $16 = B^2$.', '$A = x$, $B = 4$. Kiểm tra: $2AB = 2\\cdot x\\cdot 4 = 8x$ — khớp với hạng tử giữa.'],
        loiGiai: ['$x^2 - 8x + 16 = x^2 - 2\\cdot x\\cdot 4 + 4^2$', '$= (x-4)^2$'],
        loiThuongGap: [
          { gt: '(x-8)^2', giaiThich: '$(x-8)^2 = x^2 - 16x + 64$. $B$ là số mà $B^2 = 16$, tức $B = 4$.' },
          { gt: '(x+4)^2', giaiThich: 'Hạng tử giữa là $-8x$ (dấu trừ) nên là bình phương của một **hiệu**: $(x-4)^2$.' }] },

      { id: '6.7', hinhGiai: hg(mv('hieuHaiBP', '2x', '3', 5, 2, { a2: '4x²', b2: '9' })), muc: 2, de: 'Viết $4x^2 - 9$ dưới dạng tích.',
        dapAn: { kieu: 'bieuThuc', gt: '(2x-3)(2x+3)', dang: 'nhanTu' },
        goiY: ['$4x^2 = (2x)^2$ và $9 = 3^2$.', 'Dùng $A^2 - B^2 = (A-B)(A+B)$ với $A = 2x$, $B = 3$.'],
        loiGiai: ['$4x^2 - 9 = (2x)^2 - 3^2$', '$= (2x-3)(2x+3)$'],
        loiThuongGap: [
          { gt: '(2x-3)^2', giaiThich: '$(2x-3)^2 = 4x^2 - 12x + 9$. Hiệu hai bình phương là **hiệu nhân tổng**: $(2x-3)(2x+3)$.' },
          { gt: '(4x-9)(4x+9)', giaiThich: '$A$ là biểu thức mà $A^2 = 4x^2$, tức $A = 2x$ (không phải $4x$). Tương tự $B = 3$.' }] },

      { id: '6.8', hinhGiai: hg(mv('hieuHaiBP', '50', '2', 5, 1, { a2: '50²', b2: '2²' }, KHONG_TI_LE)), muc: 2, de: 'Tính nhanh $52\\cdot 48$.',
        dapAn: { kieu: 'so', gt: 2496 },
        goiY: ['52 và 48 cách đều số 50.', '$52\\cdot 48 = (50+2)(50-2) = 50^2 - 2^2$.'],
        loiGiai: ['$52\\cdot 48 = (50+2)(50-2)$', '$= 50^2 - 2^2 = 2500 - 4$', '$= 2496$'],
        loiThuongGap: [
          { gt: 2504, giaiThich: '$(A+B)(A-B) = A^2 - B^2$: phải **trừ** $2^2 = 4$, không cộng.' },
          { gt: 2500, giaiThich: 'Em quên trừ đi $B^2 = 2^2 = 4$.' }] },

      { id: '6.9', hinhGiai: hg(mv('hieu', '100', '1', 5, 1, { a2: '100²', ab: '100', b2: '1', hieu: '99' }, KHONG_TI_LE)), muc: 2, de: 'Tính nhanh $99^2$.',
        dapAn: { kieu: 'so', gt: 9801 },
        goiY: ['$99 = 100 - 1$.', '$(100-1)^2 = 100^2 - 2\\cdot 100\\cdot 1 + 1^2$.'],
        loiGiai: ['$99^2 = (100-1)^2 = 100^2 - 2\\cdot 100\\cdot 1 + 1^2$', '$= 10000 - 200 + 1$', '$= 9801$'],
        loiThuongGap: [
          { gt: 9999, giaiThich: '$(A-B)^2 \\ne A^2 - B^2$. Còn thiếu $-2AB = -200$, và $B^2 = 1$ phải **cộng**.' },
          { gt: 9799, giaiThich: 'Hạng tử cuối $B^2 = 1$ luôn cộng: $10000 - 200 + 1$.' }] },

      { id: '6.10', hinhGiai: hg(mv('tong', 'x', '3y', 5, 3, { a2: 'x²', ab: '3xy', b2: '9y²' })), muc: 2, de: 'Điền vào hai ô trống để được hằng đẳng thức: $x^2 + 6xy + \\boxed{?} = (x + \\boxed{?})^2$.',
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'bieuThuc', gt: '9y^2', nhan: 'Ô thứ nhất ($B^2$)',
            loiThuongGap: [{ gt: '3y^2', giaiThich: '$B^2 = (3y)^2 = 9y^2$: bình phương cả hệ số 3.' }] },
          { kieu: 'bieuThuc', gt: '3y', nhan: 'Ô thứ hai ($B$)',
            loiThuongGap: [{ gt: '6y', giaiThich: 'Hạng tử giữa là $2AB = 2\\cdot x\\cdot B = 6xy$, nên $B = 3y$ (nhớ hệ số 2).' }] }] },
        goiY: ['So với $A^2 + 2AB + B^2 = (A+B)^2$ với $A = x$.', '$2\\cdot x\\cdot B = 6xy$ nên $B = 3y$. Ô thứ nhất là $B^2$.'],
        loiGiai: ['$2\\cdot x\\cdot B = 6xy$ nên $B = 3y$.', '$B^2 = (3y)^2 = 9y^2$.', 'Vậy $x^2 + 6xy + 9y^2 = (x + 3y)^2$.'] },

      { id: '6.11', khongHinh: 'Lời giải là khai triển hai lần, đã có hình ở bài 6.1 và 6.2.', muc: 3, de: 'Rút gọn biểu thức $(x+2)^2 - (x-2)^2$ (viết kết quả dưới dạng đa thức thu gọn).',
        dapAn: { kieu: 'bieuThuc', gt: '8x', dang: 'khaiTrien' },
        goiY: ['Khai triển từng bình phương rồi bỏ ngoặc. Cẩn thận dấu trừ đứng trước ngoặc!', 'Hoặc dùng hiệu hai bình phương: $A^2 - B^2$ với $A = x+2$, $B = x-2$.'],
        loiGiai: ['$(x+2)^2 - (x-2)^2 = (x^2 + 4x + 4) - (x^2 - 4x + 4)$', '$= x^2 + 4x + 4 - x^2 + 4x - 4$', '$= 8x$'],
        loiThuongGap: [
          { gt: '8', giaiThich: 'Khi bỏ ngoặc có dấu trừ đằng trước, phải đổi dấu **mọi** hạng tử: $-(x^2 - 4x + 4) = -x^2 + 4x - 4$.' },
          { gt: '0', giaiThich: 'Hai bình phương này **không** bằng nhau: $(x+2)^2 = x^2 + 4x + 4$ còn $(x-2)^2 = x^2 - 4x + 4$.' },
          { gt: '2x^2+8', giaiThich: 'Dấu trừ ở giữa là phép trừ: $(x^2+4x+4) - (x^2-4x+4)$, không phải phép cộng.' }] },

      { id: '6.12', hinhGiai: hg(mv('hieuHaiBP', '2023', '2022', 5, 4, { a2: '2023²', b2: '2022²', hieu: '1', tong: '4045' }, KHONG_TI_LE)), muc: 3, de: 'Tính nhanh $2023^2 - 2022^2$ (câu hỏi mở đầu chương II).',
        dapAn: { kieu: 'so', gt: 4045 },
        goiY: ['Đây là hiệu hai bình phương $A^2 - B^2$.', '$2023^2 - 2022^2 = (2023 - 2022)(2023 + 2022)$.'],
        loiGiai: ['$2023^2 - 2022^2 = (2023 - 2022)(2023 + 2022)$', '$= 1\\cdot 4045$', '$= 4045$'],
        loiThuongGap: [
          { gt: 1, giaiThich: '$A^2 - B^2 \\ne (A-B)^2$. Phải là $(A-B)(A+B) = 1\\cdot 4045$.' }] }
    ],

    timLoi: [
      { de: 'Bạn Nam khai triển $(x-4)^2$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$(x-4)^2 = x^2 - 2\\cdot x\\cdot 4 + 4^2$', '$= x^2 - 8x - 16$'],
        dongSai: 1, giaiThich: '$B^2 = 4^2 = 16$ luôn **dương**, nên phải là $+16$.', sua: '$= x^2 - 8x + 16$' },
      { de: 'Bạn Lan tính $(a+5)^2$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$(a+5)^2 = a^2 + 5^2$', '$= a^2 + 25$'],
        dongSai: 0, giaiThich: '$(A+B)^2 \\ne A^2 + B^2$. Bạn Lan quên hạng tử $2AB = 2\\cdot a\\cdot 5 = 10a$ (hai mảnh xanh lá trong mô hình diện tích).', sua: '$(a+5)^2 = a^2 + 2\\cdot a\\cdot 5 + 5^2 = a^2 + 10a + 25$' },
      { de: 'Bạn Minh viết $9x^2 - 1$ thành tích như sau. Dòng nào sai?',
        loiGiaiSai: ['$9x^2 - 1 = (3x)^2 - 1^2$', '$= (3x - 1)^2$'],
        dongSai: 1, giaiThich: '$A^2 - B^2 = (A-B)(A+B)$, không phải $(A-B)^2$. Thử lại: $(3x-1)^2 = 9x^2 - 6x + 1 \\ne 9x^2 - 1$.', sua: '$= (3x-1)(3x+1)$' }
    ]
  });
})();
