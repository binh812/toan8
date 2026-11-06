// Bài 4. Phép nhân đa thức – SGK Toán 8 KNTT Tập 1, trang 19–21.
(function () {
  'use strict';
  // Hình cho "Nhìn là hiểu": hcnNhan (tích = diện tích hình chữ nhật; có hạng tử âm thì thành bảng nhân), thuaSo (nhân hai đơn thức)
  // Đề chỉ có biến x thì dùng cảnh chỉ có thanh đổi x
  function hcn(hang, cot, them) { return { ten: /y/.test(hang + cot) ? 'hcnNhan' : 'hcnNhanX', tuyChon: Object.assign({ hang: hang, cot: cot }, them || {}) }; }
  function bang(hang, cot, them) { return Object.assign(hcn(hang, cot, Object.assign({ bang: true }, them || {})), { ghiChu: BANG }); }
  function hg(c, t) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: t == null ? 1 : t }, c) }; }
  var BANG = 'Có hạng tử âm nên vẽ thành bảng nhân, ô không theo tỉ lệ.', TRUOC_TONG = 0.85;
  function so(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }

// Dùng và Suy ra: kết quả trên hình chỉ hiện khi em đã giải (nút chạy hình không được lộ đáp án)
  function anKetQua(L) {
    [L.nhin.dung].concat(L.nhin.suyRa.baDe).forEach(function (d) { d.canh.tuyChon = Object.assign({}, d.canh.tuyChon, { anNhan: true }); });
    return L;
  }

TOAN8.bai(anKetQua({
  id: 4, ten: 'Phép nhân đa thức', sgk: { tap: 1, trang: 19 },
  nhin: {
    tieuDe: 'Nhân hai đa thức là tính diện tích hình chữ nhật', loai: 'chungMinh',
    luuY: 'Hình chứng minh khi $x$ dương (kéo thanh để đổi $x$): diện tích cả hình bằng tổng diện tích bốn mảnh. Với số bất kì quy tắc vẫn đúng, vì nó chỉ dùng tính chất phân phối: $(x + 2)(x + 3) = x(x + 3) + 2(x + 3)$.',
    canh: Object.assign(hcn('x+2', 'x+3'), { moTa: 'Hình chữ nhật cạnh x cộng 2 và x cộng 3, cắt thành bốn mảnh: x bình phương, 3x, 2x và 6.',
      dongSo: function (p) { var x = p.x; return 'Với $x = ' + so(x) + '$: cả hình $(' + so(x) + ' + 2)(' + so(x) + ' + 3) = ' + so((x + 2) * (x + 3)) + '$; bốn mảnh $' + so(x * x) + ' + ' + so(3 * x) + ' + ' + so(2 * x) + ' + 6 = ' + so(x * x + 5 * x + 6) + '$.'; } }),
    buoc: [
      { t: 0, chu: 'Hình chữ nhật có hai cạnh $x + 2$ và $x + 3$, nên diện tích là $(x + 2)(x + 3)$.' },
      { t: 0.1, chu: 'Cắt mỗi cạnh ở chỗ nối hai đoạn. Hình chia thành $2 \\cdot 2 = 4$ mảnh chữ nhật.' },
      { t: 0.35, chu: 'Mỗi mảnh có diện tích bằng tích hai đoạn cạnh của nó: $x \\cdot x$, $x \\cdot 3$, $2 \\cdot x$, $2 \\cdot 3$.' },
      { t: 0.88, chu: 'Cộng bốn mảnh. Hai mảnh $3x$ và $2x$ cùng màu (đồng dạng) nên gộp được.' }
    ],
    ketLuan: '$$(x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6$$ Mỗi hạng tử của đa thức này nhân với từng hạng tử của đa thức kia: bao nhiêu mảnh thì bấy nhiêu tích.',
    dung: {
      tieuDe: 'Đủ bốn mảnh chưa?', tuBai: '4.3',
      canh: Object.assign(hcn('x+2', 'x+4', { sai: { thieuHai: { an: [[0, 1], [1, 0]] }, thieuTren: { an: [[0, 1]] }, thieuDuoi: { an: [[1, 0]] }, xx: { nhan: { '0,0': '2x ?' } } } }),
        { moTa: 'Hình chữ nhật cạnh x cộng 2 và x cộng 4, cắt thành bốn mảnh.' }),
      moiThu: 'Tính diện tích từng mảnh rồi cộng lại. Nếu gõ sai, hình sẽ chỉ mảnh em tính sai hoặc bỏ sót.',
      phanUng: [
        { gt: 'x^2+8', trangThai: 'thieuHai', t: 1, loi: 'Còn trống hai mảnh (viền đỏ): $x \\cdot 4$ và $2 \\cdot x$. Có $4$ mảnh nên phải có $4$ tích.' },
        { gt: 'x^2+4x+8', trangThai: 'thieuDuoi', t: 1, loi: 'Còn trống mảnh $2 \\cdot x$ ở góc dưới bên trái.' },
        { gt: 'x^2+2x+8', trangThai: 'thieuTren', t: 1, loi: 'Còn trống mảnh $x \\cdot 4$ ở góc trên bên phải.' },
        { gt: '2x+6x+8', trangThai: 'xx', t: TRUOC_TONG, loi: 'Mảnh góc trên bên trái là hình vuông cạnh $x$: diện tích $x \\cdot x = x^2$. Còn $2x$ là $x + x$.' },
        { gt: '8x+8', trangThai: 'xx', t: TRUOC_TONG, loi: 'Mảnh góc trên bên trái là hình vuông cạnh $x$: diện tích $x \\cdot x = x^2$, không phải $2x$.' }
      ],
      saiT: TRUOC_TONG,
      dungChu: 'Bốn mảnh $x^2$, $4x$, $2x$, $8$; gộp hai mảnh cùng màu: $x^2 + 6x + 8$.',
      saiChu: 'Đọc diện tích bốn mảnh trên hình, rồi gộp các mảnh cùng màu.'
    },
    suyRa: {
      tieuDe: 'Cắt góc, có số âm, nhiều hạng tử: vẫn là bảng các mảnh',
      baDe: [
        { tuBai: '4.10', canh: hcn('x+2', 'x+5', { bo: [[0, 0]] }), tenNut: 'Chia mảnh', saiT: TRUOC_TONG,
          phanUng: [{ gt: 'x^2+7x+10', t: TRUOC_TONG, loi: 'Đó là cả tấm bìa. Mảnh $x^2$ (viền đỏ) đã bị cắt bỏ.' },
            { gt: '10', t: TRUOC_TONG, loi: 'Còn hai mảnh $5x$ và $2x$ nữa.' }],
          dungChu: 'Còn ba mảnh: $5x + 2x + 10 = 7x + 10$.', saiChu: 'Bấm "Chia mảnh": tấm bìa còn lại những mảnh nào?' },
        { tuBai: '4.4', canh: bang('2x-3', 'x+5', { sai: { thieuHai: { an: [[0, 1], [1, 0]] } } }), tenNut: 'Kẻ bảng', saiT: TRUOC_TONG,
          phanUng: [{ gt: '2x^2-15', trangThai: 'thieuHai', t: 1, loi: 'Còn trống hai ô: $2x \\cdot 5$ và $(-3) \\cdot x$. Bảng $2 \\times 2$ có $4$ ô.' },
            { gt: '2x^2+7x+15', t: TRUOC_TONG, loi: 'Ô góc dưới bên phải là $(-3) \\cdot 5$: âm nhân dương ra âm.' }],
          dungChu: 'Bốn ô $2x^2$, $10x$, $-3x$, $-15$; gộp hai ô cùng màu: $2x^2 + 7x - 15$.', saiChu: 'Bấm "Kẻ bảng", đọc bốn ô rồi gộp hai ô cùng màu.' },
        { tuBai: '4.5', canh: bang('x-y', 'x^2+xy+y^2', { sai: { thieuHai: { an: [[1, 0], [1, 1]] } } }), tenNut: 'Kẻ bảng', saiT: TRUOC_TONG,
          phanUng: [{ gt: 'x^3+x^2y+xy^2-y^3', trangThai: 'thieuHai', t: 1, loi: 'Hàng $-y$ còn trống hai ô: $-y$ phải nhân với **cả** $x^2$ và $xy$.' }],
          dungChu: 'Sáu ô. Các ô cùng màu ngược dấu nhau triệt tiêu, còn $x^3 - y^3$.', saiChu: 'Bảng $2 \\times 3$ có $6$ ô. Gộp các ô cùng màu.' }
      ],
      cachNhan: 'Gặp tích hai đa thức: kẻ bảng, mỗi hạng tử bên trái nhân với mỗi hạng tử bên trên. Số ô bằng số tích; ô cùng màu là hạng tử đồng dạng, gộp lại.'
    }
  },
  khamPha: {
    nhiemVu: 'Hình chữ nhật có hai cạnh là $\\ca{x} + \\cb{2}$ và $\\ca{x} + \\cb{3}$. Nó được chia thành **4 mảnh**. Em kéo thanh trượt **x** và quan sát diện tích từng mảnh: mảnh nào là $x \\cdot x$, mảnh nào là $x \\cdot 3$, $2 \\cdot x$, $2 \\cdot 3$?',
    widget: 'dienTich',
    config: {
      hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#1971c2' }],
      cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '3', dai: 3, mau: '#1971c2' }],
      thanhTruot: [{ ten: 'x', min: 1, max: 6, buoc: 0.5, gt: 3 }],
      congThuc: '(x+2)(x+3) = \\;?'
    },
    cauHoi: {
      de: 'Cộng diện tích 4 mảnh, em viết $(x + 2)(x + 3)$ thành đa thức thu gọn.',
      dapAn: { kieu: 'bieuThuc', gt: 'x^2+5x+6', dang: 'khaiTrien' },
      goiY: ['Bốn mảnh là $x^2$; $3x$; $2x$; $6$. Cộng lại rồi thu gọn.'],
      loiGiai: ['Bốn mảnh: $x \\cdot x = x^2$; $x \\cdot 3 = 3x$; $2 \\cdot x = 2x$; $2 \\cdot 3 = 6$.',
        '$(x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6$']
    }
  },
  lyThuyet: [
    { loai: 'dinhLi', tieuDe: 'Nhân hai đơn thức',
      noiDung: 'Muốn nhân hai đơn thức, ta nối hai đơn thức với nhau bởi dấu nhân rồi bỏ dấu ngoặc (nếu có) và thu gọn đơn thức nhận được.\n$$3x^2y \\cdot (-2xy^3) = [3 \\cdot (-2)] \\cdot (x^2 \\cdot x) \\cdot (y \\cdot y^3) = -6x^3y^4$$' },
    { loai: 'chuY',
      noiDung: 'Nhân lũy thừa cùng cơ số thì **cộng số mũ**: $x^m \\cdot x^n = x^{m+n}$.\n\n**Hay nhầm:** $x \\cdot x = x^2$, **không phải** $2x$. (Còn $x + x = 2x$.)' },
    { loai: 'dinhLi', tieuDe: 'Nhân đơn thức với đa thức',
      noiDung: 'Muốn nhân một đơn thức với một đa thức, ta nhân đơn thức với **từng** hạng tử của đa thức rồi cộng các tích với nhau.\n$$\\ca{A}(\\cb{B} + C) = \\ca{A}\\cb{B} + \\ca{A}C$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: '2x', dai: '2x', mau: '#d9480f' }],
        cot: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '3', dai: 3, mau: '#1971c2' }],
        o: [['2x^2', '6x']],
        thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }],
        congThuc: '2x(x + 3) = 2x \\cdot x + 2x \\cdot 3 = 2x^2 + 6x',
        // x đổi: hình co giãn nhưng luôn gồm đúng hai mảnh 2x·x và 2x·3
        tuChay: [{ thanhTruot: 'x', den: 4, giay: 2 }, { cho: 1 }, { thanhTruot: 'x', den: 1, giay: 2.5 }, { cho: 1 },
          { thanhTruot: 'x', den: 2, giay: 1.5 }, { cho: 1 }]
      },
      chuThich: 'Cạnh $2x$ nhân với **từng** đoạn của cạnh kia: được hai mảnh $2x^2$ và $6x$.' },
    { loai: 'dinhLi', tieuDe: 'Nhân đa thức với đa thức',
      noiDung: 'Muốn nhân một đa thức với một đa thức, ta nhân **mỗi** hạng tử của đa thức này với **từng** hạng tử của đa thức kia rồi cộng các kết quả với nhau.\n$$(A + B)(C + D) = AC + AD + BC + BD$$' },
    { loai: 'hinh', widget: 'dienTich',
      config: {
        hang: [{ nhan: 'x', dai: 'x', mau: '#d9480f' }, { nhan: '1', dai: 1, mau: '#1971c2' }],
        cot: [{ nhan: '2x', dai: '2x', mau: '#d9480f' }, { nhan: '3', dai: 3, mau: '#1971c2' }],
        o: [['2x^2', '3x'], ['2x', '3']],
        thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }],
        congThuc: '(x + 1)(2x + 3) = 2x^2 + 3x + 2x + 3 = 2x^2 + 5x + 3'
      },
      chuThich: 'Hai hạng tử nhân với hai hạng tử: $2 \\times 2 = 4$ tích, đúng bằng **4 mảnh**. Thiếu một tích là thiếu một mảnh!' },
    { loai: 'chuY',
      noiDung: 'Phép nhân đa thức có các tính chất như phép nhân các số:\n$A \\cdot B = B \\cdot A$ (giao hoán); $(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C)$ (kết hợp); $A(B + C) = AB + AC$ (phân phối).\n\nTích của hai đa thức cũng là một đa thức. Sau khi nhân, nhớ **thu gọn** các hạng tử đồng dạng.' }
  ],
  viDu: [
    { canh: bang('-3xy', '2x^2-xy+4y'), de: 'Tính $(-3xy) \\cdot (2x^2 - xy + 4y)$.', buoc: [
      { canh: { t: 0.37 }, lam: '$= (-3xy)(2x^2) + (-3xy)(-xy) + (-3xy)(4y)$', vi: 'Nhân đơn thức $-3xy$ với **từng** hạng tử, giữ cả dấu của hạng tử.' },
      { canh: { t: 1 }, lam: '$= -6x^3y + 3x^2y^2 - 12xy^2$', vi: '$(-3) \\cdot (-1) = 3$; $x \\cdot x = x^2$; $y \\cdot y = y^2$.' } ] },
    { de: 'Tính $(x + 2y)(x - 3y)$.', canh: bang('x+2y', 'x-3y'), buoc: [
      { lam: '$= x \\cdot x + x \\cdot (-3y) + 2y \\cdot x + 2y \\cdot (-3y)$', vi: 'Nhân mỗi hạng tử của đa thức đầu với từng hạng tử của đa thức sau: 4 tích, đúng bằng 4 ô của bảng.', canh: { t: 0.37 } },
      { lam: '$= x^2 - 3xy + 2xy - 6y^2$', vi: 'Tính từng tích.', canh: { t: 0.8 } },
      { canh: { t: 1 }, lam: '$= x^2 - xy - 6y^2$', vi: 'Thu gọn: $-3xy + 2xy = -xy$.' } ] },
    { de: 'Chứng tỏ giá trị của biểu thức $(x - 3)(x + 2) - x(x - 1)$ không phụ thuộc vào giá trị của $x$.', canh: bang('x-3', 'x+2'), buoc: [
      { canh: { t: 1 }, lam: '$(x - 3)(x + 2) = x^2 + 2x - 3x - 6 = x^2 - x - 6$', vi: 'Nhân hai đa thức. Bảng trên hình chỉ vẽ tích đầu $(x - 3)(x + 2)$.' },
      { canh: { t: 1 }, lam: '$x(x - 1) = x^2 - x$', vi: 'Nhân đơn thức với đa thức (tích thứ hai, không vẽ trên hình).' },
      { canh: { t: 1 }, lam: '$(x^2 - x - 6) - (x^2 - x) = x^2 - x - 6 - x^2 + x = -6$', vi: 'Bỏ ngoặc sau dấu trừ, đổi dấu. Kết quả là số $-6$, không còn $x$, nên giá trị không phụ thuộc vào $x$.' } ] }
  ],
  viDuMo: [
    { de: 'Tính $(2x - 1)(x^2 + 3x - 2)$.', buoc: [
      { lam: '$= 2x \\cdot x^2 + 2x \\cdot 3x + 2x \\cdot (-2) - x^2 - 3x + 2$', vi: 'Nhân $2x$ với từng hạng tử, rồi nhân $-1$ với từng hạng tử.' },
      { lam: '$= 2x^3 + 6x^2 - 4x - x^2 - 3x + 2$', vi: 'Tính từng tích.' },
      { lam: '$= 2x^3 + 5x^2 - 7x + 2$', vi: 'Em hãy thu gọn:', an: true,
        dapAn: { kieu: 'bieuThuc', gt: '2x^3+5x^2-7x+2', dang: 'khaiTrien' },
        loiThuongGap: [{ gt: '2x^3+6x^2-4x-1', giaiThich: 'Em quên nhân $-1$ với **từng** hạng tử của đa thức thứ hai. Phải có thêm $-x^2 - 3x + 2$.' }] } ] }
  ],
  baiTap: [
    { id: '4.1', hinhGiai: hg({ ten: 'thuaSo', tuyChon: { don: ['4x^2y', '-3xy^3'] } }), muc: 1, de: 'Nhân hai đơn thức $4x^2y$ và $-3xy^3$.',
      dapAn: { kieu: 'bieuThuc', gt: '-12x^3y^4', dang: 'khaiTrien' },
      goiY: ['Nhân hệ số với hệ số, nhân lũy thừa cùng biến (cộng số mũ).', '$4 \\cdot (-3) = ?$; $x^2 \\cdot x = ?$; $y \\cdot y^3 = ?$'],
      loiGiai: ['$4x^2y \\cdot (-3xy^3) = [4 \\cdot (-3)](x^2 \\cdot x)(y \\cdot y^3)$', '$= -12x^3y^4$'],
      loiThuongGap: [
        { gt: '-12x^2y^3', giaiThich: 'Nhân lũy thừa cùng biến phải **cộng** số mũ: $x^2 \\cdot x = x^3$; $y \\cdot y^3 = y^4$.' },
        { gt: 'x^3y^4', giaiThich: 'Khi nhân hai đơn thức, hệ số được **nhân**: $4 \\cdot (-3) = -12$, không cộng.' }] },
    { id: '4.2', hinhGiai: hg(bang('3x', 'x-4')), muc: 1, de: 'Tính $3x(x - 4)$.',
      dapAn: { kieu: 'bieuThuc', gt: '3x^2-12x', dang: 'khaiTrien' },
      goiY: ['Nhân $3x$ với **từng** hạng tử $x$ và $-4$.', '$3x \\cdot x = 3x^2$ (vì $x \\cdot x = x^2$).'],
      loiGiai: ['$3x(x - 4) = 3x \\cdot x + 3x \\cdot (-4)$', '$= 3x^2 - 12x$'],
      loiThuongGap: [
        { gt: '6x-12x', giaiThich: '$x \\cdot x = x^2$, không phải $2x$. Vậy $3x \\cdot x = 3x^2$.' },
        { gt: '3x^2-4', giaiThich: 'Em quên nhân $3x$ với $-4$. Phải nhân với **mọi** hạng tử: $3x \\cdot (-4) = -12x$.' }] },
    { id: '4.3', hinhGiai: hg(hcn('x+2', 'x+4')), muc: 1, de: 'Tính $(x + 2)(x + 4)$. (Hình chữ nhật dưới đây có hai cạnh $x + 2$ và $x + 4$.)',
      hinh: { widget: 'dienTich', config: {
        hang: [{ nhan: 'x', dai: 3, mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#1971c2' }],
        cot: [{ nhan: 'x', dai: 3, mau: '#d9480f' }, { nhan: '4', dai: 4, mau: '#1971c2' }],
        o: [['?', '?'], ['?', '?']] } },
      dapAn: { kieu: 'bieuThuc', gt: 'x^2+6x+8', dang: 'khaiTrien' },
      goiY: ['Có 4 mảnh, ứng với 4 tích: $x \\cdot x$; $x \\cdot 4$; $2 \\cdot x$; $2 \\cdot 4$.', '$= x^2 + 4x + 2x + 8$. Thu gọn.'],
      loiGiai: ['$(x + 2)(x + 4) = x \\cdot x + x \\cdot 4 + 2 \\cdot x + 2 \\cdot 4$', '$= x^2 + 4x + 2x + 8 = x^2 + 6x + 8$'],
      loiThuongGap: [
        { gt: 'x^2+8', hinh: hg(Object.assign(hcn('x+2', 'x+4', { sai: { thieuHai: { an: [[0, 1], [1, 0]] } } }), { thamSo: { trangThai: 'thieuHai' } })), giaiThich: 'Em quên hai mảnh $4x$ và $2x$. Mỗi hạng tử phải nhân với **từng** hạng tử: có 4 tích.' },
        { gt: '2x+6x+8', giaiThich: '$x \\cdot x = x^2$, không phải $2x$.' }] },
    { id: '4.4', hinhGiai: hg(bang('2x-3', 'x+5')), muc: 2, de: 'Tính $(2x - 3)(x + 5)$.',
      dapAn: { kieu: 'bieuThuc', gt: '2x^2+7x-15', dang: 'khaiTrien' },
      goiY: ['Nhân $2x$ với $x$ và $5$; nhân $-3$ với $x$ và $5$.', '$= 2x^2 + 10x - 3x - 15$.'],
      loiGiai: ['$= 2x \\cdot x + 2x \\cdot 5 + (-3) \\cdot x + (-3) \\cdot 5$', '$= 2x^2 + 10x - 3x - 15 = 2x^2 + 7x - 15$'],
      loiThuongGap: [
        { gt: '2x^2-15', giaiThich: 'Em quên hai tích $2x \\cdot 5$ và $(-3) \\cdot x$. Phải đủ 4 tích.' },
        { gt: '2x^2+7x+15', giaiThich: 'Chú ý dấu: $(-3) \\cdot 5 = -15$.' }] },
    { id: '4.5', hinhGiai: hg(bang('x-y', 'x^2+xy+y^2')), muc: 2, de: 'Tính $(x - y)(x^2 + xy + y^2)$.',
      dapAn: { kieu: 'bieuThuc', gt: 'x^3-y^3', dang: 'khaiTrien' },
      goiY: ['Nhân $x$ với ba hạng tử, rồi nhân $-y$ với ba hạng tử: 6 tích.', '$= x^3 + x^2y + xy^2 - x^2y - xy^2 - y^3$. Thu gọn.'],
      loiGiai: ['$= x \\cdot x^2 + x \\cdot xy + x \\cdot y^2 - y \\cdot x^2 - y \\cdot xy - y \\cdot y^2$', '$= x^3 + x^2y + xy^2 - x^2y - xy^2 - y^3$', '$= x^3 - y^3$'],
      loiThuongGap: [{ gt: 'x^3+x^2y+xy^2-y^3', giaiThich: 'Em mới nhân $-y$ với $y^2$. Phải nhân $-y$ với **cả** $x^2$ và $xy$ nữa.' }] },
    { id: '4.6', khongHinh: 'Hai phép nhân đơn thức với đa thức rồi thu gọn; cách nhân đã có hình bảng ở bài 4.2.', muc: 2, de: 'Rút gọn biểu thức $x(x^2 - 2y) - x^2(x + y) + 2xy$.',
      dapAn: { kieu: 'bieuThuc', gt: '-x^2y', dang: 'khaiTrien' },
      goiY: ['Nhân từng phần: $x(x^2 - 2y)$ và $x^2(x + y)$. Phần thứ hai đứng sau dấu trừ.', '$= x^3 - 2xy - x^3 - x^2y + 2xy$.'],
      loiGiai: ['$= x^3 - 2xy - (x^3 + x^2y) + 2xy$', '$= x^3 - 2xy - x^3 - x^2y + 2xy$', '$= -x^2y$'],
      loiThuongGap: [{ gt: 'x^2y', giaiThich: 'Dấu trừ trước $x^2(x + y)$ áp dụng cho cả hai tích: $-x^3$ **và** $-x^2y$.' }] },
    { id: '4.7', hinhGiai: hg(bang('x+4', 'x-1')), muc: 2, de: 'Chứng tỏ giá trị của biểu thức $(x + 4)(x - 1) - x(x + 3)$ không phụ thuộc vào $x$. Giá trị đó bằng bao nhiêu?',
      dapAn: { kieu: 'so', gt: -4 },
      goiY: ['Khai triển $(x + 4)(x - 1)$ và $x(x + 3)$ rồi trừ.', '$(x + 4)(x - 1) = x^2 + 3x - 4$.'],
      loiGiai: ['$(x + 4)(x - 1) = x^2 - x + 4x - 4 = x^2 + 3x - 4$; $x(x + 3) = x^2 + 3x$.', '$(x^2 + 3x - 4) - (x^2 + 3x) = -4$'],
      loiThuongGap: [{ gt: 4, giaiThich: 'Chú ý dấu: $4 \\cdot (-1) = -4$.' }] },
    { id: '4.8', hinhGiai: hg(bang('2x+1', 'x-3')), muc: 2, de: 'Rút gọn rồi tính giá trị của $(2x + 1)(x - 3) - 2x^2$ tại $x = -2$.',
      dapAn: { kieu: 'so', gt: 7 },
      goiY: ['$(2x + 1)(x - 3) = 2x^2 - 6x + x - 3$.', 'Rút gọn được $-5x - 3$. Thay $x = -2$.'],
      loiGiai: ['$(2x + 1)(x - 3) - 2x^2 = 2x^2 - 6x + x - 3 - 2x^2 = -5x - 3$', 'Tại $x = -2$: $-5 \\cdot (-2) - 3 = 10 - 3 = 7$'],
      loiThuongGap: [{ gt: -13, giaiThich: '$-5 \\cdot (-2) = +10$ (âm nhân âm ra dương), nên kết quả là $10 - 3 = 7$.' }] },
    { id: '4.9', khongHinh: 'Hai tích như bài 4.3 rồi trừ cho nhau; khai triển từng tích là đủ, hình hai bảng không giúp thêm.', muc: 3, de: 'Cho $P = (n + 3)(n + 4) - (n + 1)(n + 6)$. Chứng tỏ $P$ luôn bằng một số không đổi với mọi $n$. Số đó là bao nhiêu?',
      dapAn: { kieu: 'so', gt: 6 },
      goiY: ['Khai triển từng tích: $(n + 3)(n + 4)$ và $(n + 1)(n + 6)$.', '$= (n^2 + 7n + 12) - (n^2 + 7n + 6)$. Nhớ đổi dấu khi bỏ ngoặc.'],
      loiGiai: ['$(n + 3)(n + 4) = n^2 + 7n + 12$; $(n + 1)(n + 6) = n^2 + 7n + 6$.', '$P = n^2 + 7n + 12 - n^2 - 7n - 6 = 6$'],
      loiThuongGap: [{ gt: 18, giaiThich: 'Bỏ ngoặc sau dấu trừ phải đổi dấu cả $+6$: $-(n^2 + 7n + 6) = -n^2 - 7n - 6$. Vậy $12 - 6 = 6$.' }] },
    { id: '4.10', hinhGiai: hg(hcn('x+2', 'x+5', { bo: [[0, 0]] })), muc: 3, de: 'Một tấm bìa hình chữ nhật có chiều dài $x + 5$ và chiều rộng $x + 2$ (cm). Người ta cắt bỏ ở góc một hình vuông cạnh $x$ (mảnh $x^2$ trên hình). Viết đa thức thu gọn biểu thị diện tích phần bìa còn lại.',
      hinh: { widget: 'dienTich', config: {
        hang: [{ nhan: 'x', dai: 3, mau: '#d9480f' }, { nhan: '2', dai: 2, mau: '#1971c2' }],
        cot: [{ nhan: 'x', dai: 3, mau: '#d9480f' }, { nhan: '5', dai: 5, mau: '#1971c2' }],
        o: [['x^2', '?'], ['?', '?']] } },
      dapAn: { kieu: 'bieuThuc', gt: '7x+10', dang: 'khaiTrien' },
      goiY: ['Diện tích còn lại = diện tích tấm bìa − diện tích hình vuông bị cắt.', '$(x + 5)(x + 2) - x^2$. Khai triển tích trước.'],
      loiGiai: ['$(x + 5)(x + 2) = x^2 + 2x + 5x + 10 = x^2 + 7x + 10$', 'Diện tích còn lại: $x^2 + 7x + 10 - x^2 = 7x + 10$'],
      loiThuongGap: [
        { gt: 'x^2+7x+10', giaiThich: 'Đó là diện tích cả tấm bìa. Em chưa trừ đi hình vuông $x^2$ bị cắt bỏ.' },
        { gt: '10', giaiThich: 'Em quên hai mảnh $5x$ và $2x$ khi nhân $(x + 5)(x + 2)$.' }] }
  ],
  timLoi: [
    { de: 'Bạn Nam tính $(x + 3)(x - 2)$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$= x \\cdot x + x \\cdot (-2) + 3 \\cdot x + 3 \\cdot (-2)$', '$= 2x - 2x + 3x - 6$', '$= 3x - 6$'],
      dongSai: 1,
      giaiThich: '$x \\cdot x = x^2$ (nhân lũy thừa: cộng số mũ $1 + 1 = 2$), không phải $2x$. Chỉ có $x + x = 2x$.',
      sua: '$= x^2 - 2x + 3x - 6 = x^2 + x - 6$' },
    { de: 'Bạn Nam tính $2x(x^2 - 3x + 1)$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$= 2x \\cdot x^2 - 2x \\cdot 3x + 1$', '$= 2x^3 - 6x^2 + 1$'],
      dongSai: 0,
      giaiThich: 'Bạn Nam quên nhân $2x$ với hạng tử cuối $1$. Phải nhân đơn thức với **từng** hạng tử: $2x \\cdot 1 = 2x$.',
      sua: '$= 2x \\cdot x^2 - 2x \\cdot 3x + 2x \\cdot 1 = 2x^3 - 6x^2 + 2x$' }
  ]
}));
})();
