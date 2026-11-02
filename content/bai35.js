// Bài 35 – Định lí Pythagore và ứng dụng (SGK Toán 8 KNTT, Tập 2, tr. 93–97)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var geo = TOAN8.hinhGeo;
  // Tam giác vuông tại đỉnh ten[0]; cạnh góc vuông nằm ngang dài ngang, cạnh thẳng đứng dài dung.
  function vuong(ten, ngang, dung, nhan, them) {
    var d = {}; d[ten[0]] = [0, 0]; d[ten[1]] = [0, dung]; d[ten[2]] = [ngang, 0];
    var o = { diem: d, to: ten, canh: [[ten[0], ten[1]], [ten[0], ten[2]], [ten[1], ten[2], { mau: TIM }]],
      goc: [[ten[1], ten[0], ten[2], { mau: '#495057', r: 0.09 * Math.max(ngang, dung) }]], nhan: nhan };
    for (var k in them || {}) o[k] = them[k];
    return geo(o);
  }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function an(board, fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, withLabel: false }); }
  function truot(board, x, y, ten, gt, mau, max) {
    return board.create('slider', [[x, y], [x + 4.5, y], [1, gt, max || 6]], { name: ten, snapWidth: 0.5, digits: 1, label: { fontSize: 17, strokeColor: mau } });
  }
  function vuongMau(board, pts, mau) {
    return board.create('polygon', pts, { fillColor: mau, fillOpacity: 0.3, fixed: true, hasInnerPoints: false, vertices: { visible: false },
      borders: { strokeColor: mau, strokeWidth: 2, fixed: true } });
  }

  // Ba hình vuông dựng trên ba cạnh của tam giác vuông tại A.
  var khamPhaBuild = function (board, G) {
    var sb = truot(board, -6.6, 12, 'AB', 4, CAM), sc = truot(board, -6.6, 11, 'AC', 3, XANH);
    function b() { return sb.Value(); } function c() { return sc.Value(); }
    var A = an(board, 0, 0), B = an(board, b, 0), C = an(board, 0, c);
    vuongMau(board, [A, B, an(board, b, function () { return -b(); }), an(board, 0, function () { return -b(); })], CAM);
    vuongMau(board, [A, C, an(board, function () { return -c(); }, c), an(board, function () { return -c(); }, 0)], XANH);
    vuongMau(board, [B, C, an(board, function () { return c(); }, function () { return c() + b(); }), an(board, function () { return b() + c(); }, b)], TIM);
    G.poly([A, B, C], { fillColor: '#fff', fillOpacity: 1 });
    board.create('angle', [B, A, C], { radius: 0.5, name: '', fillOpacity: 0.3, fixed: true, color: '#495057' });
    G.label(-0.45, -0.45, 'A', { anchorX: 'middle', anchorY: 'middle', fontSize: 18 });
    G.label(function () { return b() + 0.35; }, -0.4, 'B', { anchorX: 'middle', anchorY: 'middle', fontSize: 18 });
    G.label(-0.4, function () { return c() + 0.4; }, 'C', { anchorX: 'middle', anchorY: 'middle', fontSize: 18 });
    G.label(function () { return b() / 2; }, function () { return -b() / 2; }, function () { return fmt(b() * b()); }, { anchorX: 'middle', anchorY: 'middle', strokeColor: CAM, fontSize: 20 });
    G.label(function () { return -c() / 2; }, function () { return c() / 2; }, function () { return fmt(c() * c()); }, { anchorX: 'middle', anchorY: 'middle', strokeColor: XANH, fontSize: 20 });
    G.label(function () { return (b() + c()) / 2; }, function () { return (b() + c()) / 2; }, function () { return fmt(b() * b() + c() * c()); }, { anchorX: 'middle', anchorY: 'middle', strokeColor: TIM, fontSize: 20 });
    G.label(-6.6, 9.8, function () { return 'AB² = ' + fmt(b() * b()) + '  (cam)'; }, { strokeColor: CAM });
    G.label(-6.6, 8.8, function () { return 'AC² = ' + fmt(c() * c()) + '  (xanh)'; }, { strokeColor: XANH });
    G.label(-6.6, 7.8, function () { return 'BC² = ' + fmt(b() * b() + c() * c()) + '  (tím)'; }, { strokeColor: TIM });
    G.label(-6.6, 6.8, function () { return 'BC = ' + fmt(Math.sqrt(b() * b() + c() * c())); });
  };

  // Chứng minh bằng 4 tam giác vuông trong hình vuông cạnh a + b.
  var bonTamGiacBuild = function (board, G) {
    // a, b tối đa 5 để hình vuông cạnh a + b ≤ 10 không đè lên các dòng chữ bên phải.
    var sa = truot(board, 0, -1.2, 'a', 3, CAM, 5), sb = truot(board, 7.5, -1.2, 'b', 4, XANH, 5);
    function a() { return sa.Value(); } function b() { return sb.Value(); } function s() { return a() + b(); }
    var O = an(board, 0, 0), P1 = an(board, s, 0), P2 = an(board, s, s), P3 = an(board, 0, s);
    var Q1 = an(board, a, 0), Q2 = an(board, s, a), Q3 = an(board, b, s), Q4 = an(board, 0, b);
    vuongMau(board, [O, P1, P2, P3], '#adb5bd');
    vuongMau(board, [Q1, Q2, Q3, Q4], '#f59f00');
    [[O, Q1, Q4], [P1, Q2, Q1], [P2, Q3, Q2], [P3, Q4, Q3]].forEach(function (t) { vuongMau(board, t, LA); });
    G.label(10.6, 9.4, function () { return 'Cả hình vuông: (a + b)² = ' + fmt(s() * s()); });
    G.label(10.6, 8.5, function () { return '4 tam giác xanh lá: 4 · ab/2 = ' + fmt(2 * a() * b()); }, { strokeColor: LA });
    G.label(10.6, 7.6, function () { return 'Hình vuông cam: c² = ' + fmt(s() * s() - 2 * a() * b()); }, { strokeColor: '#e67700' });
    G.label(10.6, 6.7, function () { return 'a² + b² = ' + fmt(a() * a() + b() * b()); }, { strokeColor: TIM });
  };

  // ---------- Hình tĩnh cho bài tập ----------
  var h2 = vuong(['A', 'B', 'C'], 12, 5, [['A', 'B', '5'], ['A', 'C', '12'], ['B', 'C', 'x', false, 1, TIM]]);
  var h3 = vuong(['A', 'B', 'C'], 15, 8, [['A', 'B', '8'], ['A', 'C', 'x'], ['B', 'C', '17', false, 1, TIM]]);
  var h5 = vuong(['A', 'B', 'C'], 5, 3, [['A', 'B', '3'], ['A', 'C', '5'], ['B', 'C', 'x', false, 1, TIM]]);
  var h6 = geo({ diem: { A: [3, 4], B: [0, 0], C: [6, 0], H: [3, 0] }, to: ['A', 'B', 'C'],
    canh: [['A', 'B', { vach: 1 }], ['A', 'C', { vach: 1 }], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
    goc: [['A', 'H', 'C', { mau: '#495057', r: 0.5 }]],
    nhan: [['A', 'H', '4', true, 0.7, TIM], ['B', 'C', '6', false, 1.9], ['A', 'B', 'x']], lechTen: { H: [12, -14] } });
  var h8 = (function () {
    var ve = [];
    for (var i = 0; i <= 6; i++) { ve.push([[i, 0], [i, 6], { mau: '#dee2e6', day: 1 }]); ve.push([[0, i], [6, i], { mau: '#dee2e6', day: 1 }]); }
    return geo({ diem: { A: [1, 1], B: [5, 4], C: [2, 5] }, to: ['A', 'B', 'C'], ve: ve,
      canh: [['A', 'B', { mau: CAM }], ['B', 'C', { mau: XANH }], ['C', 'A']],
      ghiChu: 'Cạnh mỗi ô vuông bằng 1 cm' });
  })();
  var h9 = (function () {
    var B = [0, 0], C = [15, 0], A = [5.4, 7.2], H = [5.4, 0];
    return geo({ diem: { A: A, B: B, C: C, H: H }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
      goc: [['B', 'A', 'C', { mau: '#495057', r: 1 }], ['A', 'H', 'C', { mau: '#495057', r: 0.8 }]],
      nhan: [['A', 'B', '9'], ['A', 'C', '12']], lechTen: { H: [0, -16] } });
  })();
  var h10 = geo({ diem: { A: [6, 8], B: [1, 8], C: [1, 0], D: [0, 0] },
    canh: [['A', 'B', { mau: XANH }], ['B', 'C', { mau: XANH }], ['C', 'D', { mau: XANH }], ['A', 'D', { mau: CAM, net: 2 }]],
    goc: [['A', 'B', 'C', { mau: '#495057', r: 0.5 }], ['B', 'C', 'D', { mau: '#495057', r: 0.5 }]],
    nhan: [['A', 'B', '5 km'], ['B', 'C', '8 km', false, 1.3], ['C', 'D', '1 km', false, 1.6]], lechTen: { A: [14, 6], D: [-14, -4] } });
  var h11 = geo({ diem: { A: [0, 0], B: [0, 6], C: [2.5, 0] },
    ve: [[[0, -0.2], [0, 7], { mau: '#868e96', day: 6 }], [[-1, 0], [4, 0], { mau: '#868e96', day: 3 }]],
    canh: [['B', 'C', { mau: '#7f4f24', day: 5 }]],
    goc: [['B', 'A', 'C', { mau: '#495057', r: 0.5 }]],
    nhan: [['B', 'C', '6,5 m', false, 1.4], ['A', 'C', '2,5 m', false, 1.8], ['A', 'B', 'h', false, 1.3]],
    ghiChu: 'Tường thẳng đứng, thang BC' });
  var h12 = geo({ diem: { A: [3, 3 * Math.sqrt(3)], B: [0, 0], C: [6, 0], H: [3, 0] }, to: ['A', 'B', 'C'],
    canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
    goc: [['A', 'H', 'C', { mau: '#495057', r: 0.5 }]],
    nhan: [['A', 'C', '6 cm'], ['A', 'H', 'h', true, 0.7, TIM]], lechTen: { H: [0, -16] } });

  TOAN8.bai({
    id: 35, ten: 'Định lí Pythagore và ứng dụng', sgk: { tap: 2, trang: 93 },
    khamPha: {
      nhiemVu: 'Tam giác $ABC$ vuông tại $A$. Trên mỗi cạnh có dựng một hình vuông; con số ở giữa mỗi hình vuông là **diện tích** của nó.\n\nKéo hai thanh trượt để đổi độ dài $\\ca{AB}$ và $\\cb{AC}$. Em so sánh diện tích hình vuông **tím** (trên cạnh $BC$) với tổng hai hình vuông **cam** và **xanh**.',
      widget: 'geo',
      config: { bbox: [-7, 12.8, 13, -6.6], build: khamPhaBuild },
      cauHoi: {
        de: 'Đặt $AB = 4$, $AC = 3$. Diện tích hình vuông dựng trên cạnh $BC$ là bao nhiêu?',
        dapAn: { kieu: 'so', gt: 25 },
        goiY: ['Đọc con số ở giữa hình vuông tím.', 'Nó bằng tổng diện tích hai hình vuông còn lại: $16 + 9$.'],
        loiGiai: ['Hình vuông cam: $4^2 = 16$; hình vuông xanh: $3^2 = 9$.', 'Hình vuông tím luôn bằng tổng hai hình kia. Diện tích hình vuông tím $= 16 + 9 = 25$'],
        loiThuongGap: [{ gt: 7, giaiThich: '$7 = 4 + 3$ là tổng hai cạnh. Đề hỏi **diện tích** hình vuông trên $BC$, tức $BC^2$.' }, { gt: 5, giaiThich: '$5$ là độ dài $BC$. Diện tích hình vuông cạnh $5$ là $5^2 = 25$.' }] }
    },
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: 'Định lí Pythagore',
        noiDung: 'Trong một tam giác vuông, **bình phương của cạnh huyền** bằng **tổng các bình phương của hai cạnh góc vuông**.\n\n$\\triangle ABC$ vuông tại $A$ thì $$\\cd{BC}^2 = \\ca{AB}^2 + \\cb{AC}^2.$$\n\n(Bình phương của một đoạn thẳng là bình phương độ dài của đoạn thẳng đó.)' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-7, 12.8, 13, -6.6], build: khamPhaBuild },
        chuThich: 'Diện tích hình vuông tím luôn bằng tổng diện tích hình vuông cam và xanh: $\\cd{BC^2} = \\ca{AB^2} + \\cb{AC^2}$.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 10.6, 19, -2.2], wide: true, build: bonTamGiacBuild,
        tuChay: [{ thanhTruot: 'a', den: 5, giay: 2 }, { cho: 1.2 }, { thanhTruot: 'b', den: 2, giay: 2 }, { cho: 1.2 }, { thanhTruot: 'a', den: 1.5, giay: 2 }, { cho: 1.2 },
          { thanhTruot: 'a', den: 3, giay: 1.5 }, { thanhTruot: 'b', den: 4, giay: 1.5 }] },
        chuThich: 'Vì sao định lí đúng? Hình vuông cạnh $a + b$ chứa **4 tam giác vuông** (cạnh góc vuông $a$, $b$, cạnh huyền $c$) và hình vuông cam cạnh $c$. Nên $c^2 = (a+b)^2 - 2ab = a^2 + b^2$.' },
      { loai: 'chuY', noiDung: '**Cạnh huyền** là cạnh **đối diện góc vuông** và là cạnh **lớn nhất**. Luôn xác định cạnh huyền trước khi viết công thức.\n\n• Tính cạnh huyền: **cộng** $\\;BC^2 = AB^2 + AC^2$.\n\n• Tính cạnh góc vuông: **trừ** $\\;AC^2 = BC^2 - AB^2$.\n\nCuối cùng nhớ **lấy căn**: từ $BC^2 = 25$ suy ra $BC = 5$. Nếu không ra số đẹp thì để dạng $\\sqrt{\\ }$ (ví dụ $\\sqrt{7}$) hoặc làm tròn.' },
      { loai: 'dinhLi', tieuDe: 'Định lí Pythagore đảo',
        noiDung: 'Nếu một tam giác có bình phương của một cạnh **bằng tổng** các bình phương của hai cạnh kia thì tam giác đó là **tam giác vuông** (góc vuông đối diện cạnh lớn nhất).\n\nVí dụ: $5^2 = 25 = 3^2 + 4^2$ nên tam giác có ba cạnh $3$, $4$, $5$ là tam giác vuông.' },
      { loai: 'chuY', noiDung: '**Ứng dụng.** Tam giác $ABC$ vuông tại $A$, đường cao $AH$: diện tích bằng $\\frac{AB \\cdot AC}{2}$ và cũng bằng $\\frac{AH \\cdot BC}{2}$, nên $$AH \\cdot BC = AB \\cdot AC.$$\n\n**Đường xiên – hình chiếu.** Kẻ $AM$ vuông góc với một đường thẳng; với cùng đường cao $AM$, **hình chiếu càng lớn thì đường xiên càng lớn** (vì $AC^2 = AM^2 + MC^2$).' },
      { loai: 'chuY', noiDung: '**Hay nhầm 1 – cộng thay vì trừ.** Tính cạnh góc vuông khi biết cạnh huyền phải **trừ**: $AC^2 = BC^2 - AB^2$.\n\n**Hay nhầm 2 – quên lấy căn.** $BC^2 = 25$ thì $BC = 5$, **không** phải $25$.\n\n**Hay nhầm 3 – cộng cạnh chứ không cộng bình phương.** $BC \\ne AB + AC$: với $3$, $4$ thì $BC = 5$ chứ không phải $7$.' }
    ],
    viDu: [
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6$ cm, $AC = 8$ cm. Tính $BC$.', buoc: [
        { lam: '$BC^2 = AB^2 + AC^2$', vi: '$BC$ đối diện góc vuông $A$ nên là cạnh huyền. Tính cạnh huyền thì **cộng**.' },
        { lam: '$BC^2 = 6^2 + 8^2 = 36 + 64 = 100$', vi: 'Thay số, bình phương từng cạnh rồi cộng.' },
        { lam: '$BC = \\sqrt{100} = 10$ (cm).', vi: 'Lấy căn bậc hai (độ dài luôn dương).' } ] },
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $BC = 13$ cm, $AB = 5$ cm. Tính $AC$.', buoc: [
        { lam: '$AC^2 = BC^2 - AB^2$', vi: '$BC$ là cạnh huyền. Muốn tính cạnh góc vuông thì lấy bình phương cạnh huyền **trừ** bình phương cạnh góc vuông kia.' },
        { lam: '$AC^2 = 13^2 - 5^2 = 169 - 25 = 144$', vi: 'Thay số.' },
        { lam: '$AC = 12$ (cm).', vi: '$12^2 = 144$.' } ] },
      { de: 'Cho tam giác $ABC$ vuông tại $A$, $AB = 6$ cm, $AC = 8$ cm, đường cao $AH$. Tính $AH$, $BH$, $CH$.', buoc: [
        { lam: '$BC = 10$ cm (ví dụ 1).', vi: 'Cần $BC$ trước.' },
        { lam: '$AH \\cdot BC = AB \\cdot AC$ nên $AH = \\frac{6 \\cdot 8}{10} = 4{,}8$ (cm).', vi: 'Hai cách tính diện tích tam giác $ABC$ cho cùng một kết quả.' },
        { lam: '$BH^2 = AB^2 - AH^2 = 36 - 23{,}04 = 12{,}96$, nên $BH = 3{,}6$ (cm).', vi: 'Tam giác $AHB$ vuông tại $H$, cạnh huyền là $AB$.' },
        { lam: '$CH = BC - BH = 10 - 3{,}6 = 6{,}4$ (cm).', vi: '$H$ nằm giữa $B$ và $C$.' } ] },
      { de: 'Tam giác có ba cạnh $7$ cm, $24$ cm, $25$ cm có phải tam giác vuông không?', buoc: [
        { lam: 'Cạnh lớn nhất: $25^2 = 625$.', vi: 'Nếu là tam giác vuông thì cạnh huyền phải là cạnh lớn nhất.' },
        { lam: 'Tổng bình phương hai cạnh kia: $7^2 + 24^2 = 49 + 576 = 625$.', vi: 'So sánh với $625$.' },
        { lam: 'Bằng nhau nên tam giác vuông (định lí Pythagore đảo), góc vuông đối diện cạnh $25$ cm.', vi: 'Định lí đảo cho phép kết luận tam giác vuông.' } ] },
      { de: 'Bạn Lan vẽ hình chữ nhật có chiều rộng $1$ và chiều dài $3$, rồi đặt trên trục số đoạn $OM$ bằng đường chéo ($M$ bên phải $O$). Điểm $M$ biểu diễn số nào?', buoc: [
        { lam: 'Đường chéo $d$ là cạnh huyền của tam giác vuông có hai cạnh $1$ và $3$.', vi: 'Đường chéo chia hình chữ nhật thành hai tam giác vuông.' },
        { lam: '$d^2 = 1^2 + 3^2 = 10$, nên $d = \\sqrt{10} \\approx 3{,}16$.', vi: '$10$ không là bình phương số tự nhiên nào nên để dạng căn.' },
        { lam: 'Điểm $M$ biểu diễn số $\\sqrt{10}$.', vi: 'Độ dài $OM$ chính là toạ độ của $M$.' } ] }
    ],
    viDuMo: [
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 9$ cm, $AC = 12$ cm. Tính $BC$.', buoc: [
        { lam: '$BC^2 = 9^2 + 12^2 = 81 + 144 = 225$', vi: '$BC$ là cạnh huyền nên cộng hai bình phương.' },
        { lam: '$BC = 15$', vi: 'Em hãy tính $BC$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 15 },
          loiThuongGap: [{ gt: 21, giaiThich: 'Em cộng hai cạnh ($9 + 12$). Phải cộng **bình phương** rồi lấy căn.' }, { gt: 225, giaiThich: '$225$ là $BC^2$. Còn phải lấy căn: $\\sqrt{225} = 15$.' }] } ] },
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $BC = 10$ cm, $AB = 6$ cm. Tính $AC$.', buoc: [
        { lam: '$AC^2 = BC^2 - AB^2 = 100 - 36 = 64$', vi: '$BC$ là cạnh huyền nên **trừ**.' },
        { lam: '$AC = 8$', vi: 'Em hãy tính $AC$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 8 },
          loiThuongGap: [{ gt: 'sqrt(136)', giaiThich: 'Em cộng $100 + 36$. $AC$ là cạnh góc vuông nên phải **trừ**: $100 - 36 = 64$.' }] } ] }
    ],
    baiTap: [
      { id: '35.1', muc: 1, de: 'Cho tam giác $ABC$ vuông tại $A$. Khẳng định nào **đúng**?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$AB^2 + BC^2 = AC^2$', '$AC^2 + BC^2 = AB^2$', '$BC^2 - AC^2 = AB^2$', '$AB^2 - AC^2 = BC^2$'] },
        goiY: ['Cạnh huyền là cạnh đối diện góc vuông $A$, tức $BC$.', 'Định lí: $BC^2 = AB^2 + AC^2$. Chuyển vế xem phương án nào khớp.'],
        loiGiai: ['Tam giác vuông tại $A$ nên $BC^2 = AB^2 + AC^2$.', 'Chuyển $AC^2$ sang vế trái: $BC^2 - AC^2 = AB^2$. Đó là phương án thứ ba.'] },
      { id: '35.2', muc: 1, de: 'Tam giác $ABC$ vuông tại $A$ có $AB = 5$, $AC = 12$. Tính $x = BC$.',
        hinh: h2,
        dapAn: { kieu: 'so', gt: 13 },
        goiY: ['$BC$ là cạnh huyền: $BC^2 = AB^2 + AC^2$.', '$5^2 + 12^2 = 25 + 144$.'],
        loiGiai: ['$BC^2 = 5^2 + 12^2 = 25 + 144 = 169$', '$x = \\sqrt{169} = 13$'],
        loiThuongGap: [{ gt: 17, giaiThich: 'Em cộng hai cạnh. Phải cộng **bình phương**: $25 + 144 = 169$, rồi lấy căn.' }, { gt: 169, giaiThich: '$169$ là $BC^2$. Lấy căn: $BC = 13$.' }] },
      { id: '35.3', muc: 1, de: 'Tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 17$ và $AB = 8$. Tính $x = AC$.',
        hinh: h3,
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Tính cạnh góc vuông thì **trừ**: $AC^2 = BC^2 - AB^2$.', '$17^2 - 8^2 = 289 - 64$.'],
        loiGiai: ['$AC^2 = 17^2 - 8^2 = 289 - 64 = 225$', '$x = \\sqrt{225} = 15$'],
        loiThuongGap: [{ gt: 'sqrt(353)', giaiThich: 'Em cộng $289 + 64$. $AC$ là cạnh góc vuông nên phải **trừ**.' }] },
      { id: '35.4', muc: 1, de: 'Bộ ba số đo nào dưới đây là độ dài ba cạnh của một tam giác vuông?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$4$ cm; $5$ cm; $6$ cm', '$9$ cm; $12$ cm; $15$ cm', '$2$ cm; $3$ cm; $5$ cm', '$5$ cm; $6$ cm; $7$ cm'] },
        goiY: ['Dùng định lí Pythagore đảo: bình phương cạnh lớn nhất có bằng tổng bình phương hai cạnh kia không?', 'Thử: $9^2 + 12^2 = 81 + 144 = ?$'],
        loiGiai: ['$4^2 + 5^2 = 41 \\ne 36$; $2^2 + 3^2 = 13 \\ne 25$; $5^2 + 6^2 = 61 \\ne 49$.', '$9^2 + 12^2 = 225 = 15^2$. Chỉ bộ $9;\\ 12;\\ 15$ là ba cạnh của tam giác vuông.'] },
      { id: '35.5', muc: 2, de: 'Tam giác $ABC$ vuông tại $A$ có $AB = 3$, $AC = 5$. Tính $x = BC$ (viết dạng căn như $\\sqrt{7}$, hoặc số thập phân làm tròn đến hàng phần trăm).',
        hinh: h5,
        dapAn: { kieu: 'so', gt: 'sqrt(34)', saiSo: 0.006 },
        goiY: ['$BC^2 = AB^2 + AC^2 = 9 + 25$.', '$34$ không phải số chính phương: viết $\\sqrt{34}$ hoặc bấm máy tính rồi làm tròn.'],
        loiGiai: ['$BC^2 = 3^2 + 5^2 = 9 + 25 = 34$', '$x = \\sqrt{34} \\approx 5{,}83$'],
        loiThuongGap: [{ gt: 8, giaiThich: 'Em cộng hai cạnh. $BC = \\sqrt{3^2 + 5^2} = \\sqrt{34}$.' }, { gt: 34, giaiThich: '$34$ là $BC^2$. Còn phải lấy căn: $BC = \\sqrt{34}$.' }, { gt: 5.8, giaiThich: 'Gần đúng rồi! Đề yêu cầu làm tròn đến **hàng phần trăm** (hai chữ số sau dấu phẩy): $\\sqrt{34} \\approx 5{,}83$.' }] },
      { id: '35.6', muc: 2, de: 'Tam giác $ABC$ cân tại $A$ có đường cao $AH = 4$ và cạnh đáy $BC = 6$. Tính cạnh bên $x = AB$.',
        hinh: h6,
        dapAn: { kieu: 'so', gt: 5 },
        goiY: ['Trong tam giác cân, đường cao $AH$ cũng là đường trung tuyến: $BH = \\frac{BC}{2}$.', 'Tam giác $ABH$ vuông tại $H$: $AB^2 = AH^2 + BH^2$.'],
        loiGiai: ['$BH = \\frac{6}{2} = 3$.', '$AB^2 = AH^2 + BH^2 = 16 + 9 = 25$', '$x = 5$'],
        loiThuongGap: [{ gt: 'sqrt(52)', giaiThich: 'Em dùng cả cạnh $BC = 6$. Tam giác vuông là $ABH$, cạnh góc vuông $BH$ chỉ bằng **nửa** đáy: $3$.' }] },
      { id: '35.7', muc: 2, de: 'Một hình chữ nhật có chiều rộng $9$ cm và đường chéo $15$ cm. Tính diện tích hình chữ nhật (cm²).',
        dapAn: { kieu: 'so', gt: 108 },
        goiY: ['Đường chéo, chiều rộng, chiều dài tạo thành tam giác vuông (đường chéo là cạnh huyền).', 'Chiều dài $= \\sqrt{15^2 - 9^2}$. Rồi diện tích = dài × rộng.'],
        loiGiai: ['Chiều dài: $\\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12$ (cm).', 'Diện tích $= 12 \\cdot 9 = 108$'],
        loiThuongGap: [{ gt: 135, giaiThich: 'Em nhân đường chéo với chiều rộng. Phải tìm **chiều dài** $12$ cm trước.' }] },
      { id: '35.8', muc: 2, de: 'Trên lưới ô vuông cạnh $1$ cm có tam giác $ABC$ như hình. Tính $AB$ và $BC$ (cm). ($BC$ viết dạng căn hoặc làm tròn đến hàng phần trăm.)',
        hinh: h8,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$AB =$', kieu: 'so', gt: 5, loiThuongGap: [{ gt: 7, giaiThich: 'Em cộng số ô ngang ($4$) và dọc ($3$). $AB$ là cạnh huyền: $\\sqrt{4^2 + 3^2}$.' }] },
          { nhan: '$BC =$', kieu: 'so', gt: 'sqrt(10)', saiSo: 0.006, loiThuongGap: [{ gt: 4, giaiThich: 'Em cộng $3 + 1$ ô. $BC = \\sqrt{3^2 + 1^2} = \\sqrt{10}$.' }, { gt: 3.2, giaiThich: 'Gần đúng rồi! Đề yêu cầu làm tròn đến **hàng phần trăm**: $\\sqrt{10} \\approx 3{,}16$.' }] }] },
        goiY: ['Mỗi đoạn là cạnh huyền của một tam giác vuông có cạnh nằm theo đường kẻ ô. Đếm số ô ngang và dọc.', '$AB$: $4$ ô ngang, $3$ ô dọc. $BC$: $3$ ô ngang, $1$ ô dọc.'],
        loiGiai: ['$AB^2 = 4^2 + 3^2 = 25$ nên $AB = 5$ (cm).', '$BC^2 = 3^2 + 1^2 = 10$ nên $BC = \\sqrt{10} \\approx 3{,}16$ (cm).'] },
      { id: '35.9', muc: 2, de: 'Tam giác $ABC$ vuông tại $A$ có $AB = 9$, $AC = 12$, đường cao $AH$. Tính $BC$, $AH$ và $BH$.',
        hinh: h9,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$BC =$', kieu: 'so', gt: 15 },
          { nhan: '$AH =$', kieu: 'so', gt: 7.2, loiThuongGap: [{ gt: 54, giaiThich: '$54$ là diện tích tam giác. $AH = \\frac{AB \\cdot AC}{BC}$.' }] },
          { nhan: '$BH =$', kieu: 'so', gt: 5.4 }] },
        goiY: ['$BC^2 = 9^2 + 12^2$.', '$AH \\cdot BC = AB \\cdot AC$; rồi tam giác $ABH$ vuông tại $H$: $BH^2 = AB^2 - AH^2$.'],
        loiGiai: ['$BC^2 = 81 + 144 = 225$ nên $BC = 15$.', '$AH = \\frac{AB \\cdot AC}{BC} = \\frac{9 \\cdot 12}{15} = 7{,}2$.', '$BH^2 = 9^2 - 7{,}2^2 = 81 - 51{,}84 = 29{,}16$ nên $BH = 5{,}4$.'] },
      { id: '35.10', muc: 3, de: 'Một xe taxi xuất phát từ $A$, chạy thẳng $5$ km đến $B$, rẽ vuông góc sang trái chạy $8$ km đến $C$, rồi rẽ vuông góc sang phải chạy $1$ km đến $D$ gặp khách. Lúc đầu, khoảng cách (đường chim bay) từ xe đến khách là bao nhiêu km?',
        hinh: h10,
        dapAn: { kieu: 'so', gt: 10 },
        goiY: ['Từ $A$ đến $D$: đi ngang tổng cộng $5 + 1 = 6$ km, đi dọc $8$ km.', '$AD$ là cạnh huyền của tam giác vuông có hai cạnh góc vuông $6$ và $8$.'],
        loiGiai: ['Theo phương ngang: $5 + 1 = 6$ (km); theo phương dọc: $8$ km.', '$AD^2 = 6^2 + 8^2 = 100$', '$AD = 10$ (km)'],
        loiThuongGap: [{ gt: 14, giaiThich: '$14$ km là quãng đường xe chạy. Khoảng cách đường chim bay là cạnh huyền $\\sqrt{6^2 + 8^2}$.' }, { gt: 'sqrt(89)', giaiThich: 'Em quên đoạn $1$ km cùng phương với $AB$: cạnh ngang là $5 + 1 = 6$.' }] },
      { id: '35.11', muc: 3, de: 'Một chiếc thang dài $6{,}5$ m dựa vào tường thẳng đứng, chân thang cách chân tường $2{,}5$ m. Đầu thang chạm tường ở độ cao $h$ bằng bao nhiêu mét?',
        hinh: h11,
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Thang là cạnh huyền, khoảng cách chân thang và độ cao là hai cạnh góc vuông.', '$h^2 = 6{,}5^2 - 2{,}5^2$.'],
        loiGiai: ['$h^2 = 6{,}5^2 - 2{,}5^2 = 42{,}25 - 6{,}25 = 36$', '$h = 6$ (m)'],
        loiThuongGap: [{ gt: 'sqrt(48.5)', giaiThich: 'Em cộng hai bình phương. Thang là cạnh **huyền** nên phải trừ.' }] },
      { id: '35.12', muc: 3, de: 'Tính chiều cao $h$ của tam giác đều cạnh $6$ cm (viết dạng căn, hoặc làm tròn đến hàng phần trăm).',
        hinh: h12,
        dapAn: { kieu: 'so', gt: 'sqrt(27)', saiSo: 0.006 },
        goiY: ['Đường cao $AH$ của tam giác đều cũng là trung tuyến: $BH = HC = 3$.', 'Tam giác $AHC$ vuông tại $H$: $h^2 = 6^2 - 3^2$.'],
        loiGiai: ['$HC = 3$ cm. Tam giác $AHC$ vuông tại $H$: $h^2 = AC^2 - HC^2 = 36 - 9 = 27$.', '$h = \\sqrt{27} = 3\\sqrt{3} \\approx 5{,}20$ (cm)'],
        loiThuongGap: [{ gt: 'sqrt(45)', giaiThich: 'Em cộng $36 + 9$. Cạnh $AC = 6$ là cạnh huyền nên phải trừ.' }, { gt: 6, giaiThich: 'Đường cao luôn **ngắn hơn** cạnh bên $AC = 6$ (cạnh huyền của tam giác $AHC$).' }] }
    ],
    timLoi: [
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $BC = 10$ cm, $AB = 6$ cm. Bạn Khoa tính $AC$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Theo định lí Pythagore: $AC^2 = BC^2 + AB^2$', '$AC^2 = 100 + 36 = 136$', '$AC = \\sqrt{136} \\approx 11{,}66$ (cm)'],
        dongSai: 0,
        giaiThich: '$BC$ là cạnh **huyền** (đối diện góc vuông $A$), còn $AC$ là cạnh góc vuông. Tính cạnh góc vuông phải **trừ**. Dấu hiệu sai: $AC \\approx 11{,}66$ lại lớn hơn cả cạnh huyền $10$!',
        sua: '$AC^2 = BC^2 - AB^2 = 100 - 36 = 64$, nên $AC = 8$ cm.' },
      { de: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 3$ cm, $AC = 4$ cm. Bạn Mai tính $BC$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$BC^2 = AB^2 + AC^2$', '$BC^2 = 3^2 + 4^2 = 9 + 16 = 25$', 'Vậy $BC = 25$ cm'],
        dongSai: 2,
        giaiThich: 'Bạn Mai **quên lấy căn**. $25$ là $BC^2$, không phải $BC$.',
        sua: 'Vậy $BC = \\sqrt{25} = 5$ cm.' }
    ]
  });
})();
