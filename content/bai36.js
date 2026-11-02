// Bài 36 – Các trường hợp đồng dạng của hai tam giác vuông (SGK Toán 8 KNTT, Tập 2, tr. 98–103, gồm Luyện tập chung tr. 108–109)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5', XAM = '#868e96', NAU = '#7f4f24', VANG = '#f59f00';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var geo = TOAN8.hinhGeo;
  function rad(d) { return d * Math.PI / 180; }
  var GOCV = { mau: '#495057', r: 0.45 };
  // Hai tam giác vuông đặt cạnh nhau: t = { ten:[đỉnh vuông, đỉnh trên, đỉnh phải], ngang, dung, dx }.
  function haiVuong(t1, t2, nhan, them) {
    var d = {};
    [t1, t2].forEach(function (t) {
      d[t.ten[0]] = [t.dx, 0]; d[t.ten[1]] = [t.dx, t.dung]; d[t.ten[2]] = [t.dx + t.ngang, 0];
    });
    var o = { diem: d, to: t2.ten,
      canh: [[t1.ten[0], t1.ten[1]], [t1.ten[0], t1.ten[2]], [t1.ten[1], t1.ten[2]],
        [t2.ten[0], t2.ten[1], { mau: TIM }], [t2.ten[0], t2.ten[2], { mau: TIM }], [t2.ten[1], t2.ten[2], { mau: TIM }]],
      goc: [[t1.ten[1], t1.ten[0], t1.ten[2], GOCV], [t2.ten[1], t2.ten[0], t2.ten[2], GOCV]], nhan: nhan };
    for (var k in them || {}) o[k] = them[k];
    return geo(o);
  }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function goc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  function danhGoc(board, P, O, Q, mau, r) {
    return board.create('nonreflexangle', [P, O, Q], { radius: r || 0.6, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.3, fixed: true, highlight: false });
  }
  function diem(board, ten, fx, fy, mau, off) {
    return board.create('point', [fx, fy], { name: ten, size: 3, color: mau || '#343a40', fixed: true, showInfobox: false,
      label: { fontSize: 18, offset: off || [6, 10], cssStyle: 'font-weight:700', strokeColor: mau || '#343a40' } });
  }
  function doan(board, P, Q, mau, day, net) {
    return board.create('segment', [P, Q], { strokeColor: mau, strokeWidth: day || 3, dash: net || 0, fixed: true, highlight: false });
  }
  function truot(board, x, y, ten, min, gt, max, buoc) {
    return board.create('slider', [[x, y], [x + 4.5, y], [min, gt, max]], { name: ten, snapWidth: buoc, digits: 1, label: { fontSize: 17, strokeColor: TIM } });
  }

  // Bóng nắng: cột cờ cao 12 m và bạn Việt cao 1,4 m, cùng góc nắng.
  var khamPhaBuild = function (board, G) {
    var g = truot(board, 0.3, -1.3, 'góc nắng (độ)', 50, 63, 75, 1);
    function cot() { return 1 / Math.tan(rad(g.Value())); }
    board.create('segment', [[-0.5, 0], [17.5, 0]], { strokeColor: '#adb5bd', strokeWidth: 2, fixed: true, highlight: false });
    var A = diem(board, 'A', 11, 0), C = diem(board, 'C', 11, 12), B = diem(board, 'B', function () { return 11 - 12 * cot(); }, 0, null, [-8, -16]);
    var A1 = diem(board, "A'", 15.5, 0, TIM), C1 = diem(board, "C'", 15.5, 1.4, TIM), B1 = diem(board, "B'", function () { return 15.5 - 1.4 * cot(); }, 0, TIM, [-12, -16]);
    doan(board, A, C, NAU, 6); doan(board, A1, C1, TIM, 6);
    doan(board, B, A, '#495057', 5); doan(board, B1, A1, '#495057', 5);
    doan(board, C, B, VANG, 2, 2); doan(board, C1, B1, VANG, 2, 2);
    danhGoc(board, C, B, A, VANG, 0.9); danhGoc(board, C1, B1, A1, VANG, 0.5);
    G.label(-0.3, 13.4, function () { return 'Cột cờ: cao 12 m, bóng AB = ' + fmt(12 * cot()) + ' m'; }, { strokeColor: NAU });
    G.label(-0.3, 12.5, function () { return "Việt: cao 1,4 m, bóng A'B' = " + fmt(1.4 * cot()) + ' m'; }, { strokeColor: TIM });
    G.label(-0.3, 11.4, function () { return 'cao : bóng (cột) = ' + fmt(1 / cot()); });
    G.label(-0.3, 10.6, function () { return 'cao : bóng (Việt) = ' + fmt(1 / cot()); });
  };

  // Hai cạnh góc vuông tỉ lệ.
  var haiCanhBuild = function (board, G) {
    var A = diem(board, 'A', 0, 0), B = diem(board, 'B', 0, 3), C = diem(board, 'C', 4, 0);
    var p = truot(board, 0, -1.2, "A'B':AB", 0.5, 1.5, 2, 0.1), q = truot(board, 0, -2.1, "A'C':AC", 0.5, 1.2, 2, 0.1);
    var A1 = diem(board, "A'", 6.5, 0, TIM), B1 = diem(board, "B'", 6.5, function () { return 3 * p.Value(); }, TIM),
      C1 = diem(board, "C'", function () { return 6.5 + 4 * q.Value(); }, 0, TIM);
    function dd() { return Math.abs(p.Value() - q.Value()) < 0.001; }
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: function () { return dd() ? LA : TIM; }, fillOpacity: 0.15, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    board.create('angle', [C, A, B], { radius: 0.4, name: '', color: '#495057', fillOpacity: 0.3, fixed: true });
    board.create('angle', [C1, A1, B1], { radius: 0.4, name: '', color: '#495057', fillOpacity: 0.3, fixed: true });
    danhGoc(board, A, B, C, CAM, 0.5); danhGoc(board, A1, B1, C1, CAM, 0.5);
    G.label(-0.6, 7.6, function () { return "B'C' : BC = " + fmt(G.len(B1, C1) / 5); });
    G.label(-0.6, 6.8, function () { return 'góc B = ' + Math.round(goc(A, B, C)) + "°, góc B' = " + Math.round(goc(A1, B1, C1)) + '°'; }, { strokeColor: CAM });
    G.label(-0.6, 5.9, function () { return dd() ? 'Hai tỉ số bằng nhau → đồng dạng!' : 'Chỉnh hai thanh trượt cho bằng nhau'; },
      { strokeColor: function () { return dd() ? LA : XAM; } });
  };

  // Cạnh huyền – cạnh góc vuông tỉ lệ.
  var huyenBuild = function (board, G) {
    var A = diem(board, 'A', 0, 0), B = diem(board, 'B', 0, 3), C = diem(board, 'C', 4, 0);
    var p = truot(board, 0, -1.2, "B'C':BC", 0.6, 1.2, 2, 0.1), q = truot(board, 0, -2.1, "A'B':AB", 0.6, 1.5, 2, 0.1);
    function ac() { var v = 25 * p.Value() * p.Value() - 9 * q.Value() * q.Value(); return v > 0 ? Math.sqrt(v) : 0; }
    var A1 = diem(board, "A'", 6.5, 0, TIM), B1 = diem(board, "B'", 6.5, function () { return 3 * q.Value(); }, TIM),
      C1 = diem(board, "C'", function () { return 6.5 + ac(); }, 0, TIM);
    function dd() { return Math.abs(p.Value() - q.Value()) < 0.001; }
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: function () { return dd() ? LA : TIM; }, fillOpacity: 0.15, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    board.create('angle', [C, A, B], { radius: 0.4, name: '', color: '#495057', fillOpacity: 0.3, fixed: true });
    G.label(-0.6, 7.6, function () { return ac() > 0 ? "A'C' : AC = " + fmt(ac() / 4) : 'Cạnh huyền phải dài hơn cạnh góc vuông!'; });
    G.label(-0.6, 6.8, function () { return dd() ? 'Hai tỉ số bằng nhau → tỉ số thứ ba cũng bằng!' : 'Chỉnh hai thanh trượt cho bằng nhau'; },
      { strokeColor: function () { return dd() ? LA : XAM; } });
  };

  // ---------- Hình tĩnh cho bài tập ----------
  var h3 = haiVuong({ ten: ['A', 'B', 'C'], ngang: 1, dung: 1, dx: 0 }, { ten: ['D', 'E', 'F'], ngang: 4, dung: 2, dx: 2.5 },
    [['A', 'B', '1'], ['A', 'C', '1'], ['D', 'E', '2'], ['D', 'F', '4']]);
  var h5 = haiVuong({ ten: ['A', 'B', 'C'], ngang: 8, dung: 6, dx: 0 }, { ten: ["A'", "B'", "C'"], ngang: 12, dung: 9, dx: 10 },
    [['A', 'B', '6'], ['A', 'C', '8'], ["A'", "B'", '9'], ["A'", "C'", '12'], ["B'", "C'", 'x', false, 1, TIM]]);
  var h6 = haiVuong({ ten: ['A', 'B', 'C'], ngang: 8, dung: 6, dx: 0 }, { ten: ['D', 'E', 'F'], ngang: 12, dung: 9, dx: 10 },
    [['A', 'B', '6'], ['B', 'C', '10'], ['D', 'E', '9'], ['E', 'F', '15', false, 1, TIM], ['D', 'F', 'x']]);
  var h7 = geo({ diem: { A: [3.6, 4.8], B: [0, 0], C: [10, 0], H: [3.6, 0] }, to: ['A', 'B', 'C'],
    canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
    goc: [['B', 'A', 'C', { mau: '#495057', r: 0.6 }], ['A', 'H', 'C', { mau: '#495057', r: 0.5 }]],
    nhan: [['B', 'H', '3,6', false, 1.6], ['H', 'C', '6,4', false, 1.6]], lechTen: { H: [0, -16] } });
  var h8 = geo({ diem: { A: [6, 8], B: [0, 0], C: [16.67, 0], H: [6, 0] }, to: ['A', 'B', 'C'],
    canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
    goc: [['B', 'A', 'C', { mau: '#495057', r: 1 }], ['A', 'H', 'C', { mau: '#495057', r: 0.8 }]],
    nhan: [['A', 'B', '10'], ['A', 'H', '8', true, 0.8, TIM]], lechTen: { H: [0, -16] } });
  var h10 = geo({ diem: { D: [0, 0], M: [0, 1.5], C: [1.5, 2], X: [1.5, 1.5], B: [16.5, 0], A: [16.5, 7], Y: [16.5, 1.5] },
    ve: [[[-0.5, 0], [17.5, 0], { mau: '#adb5bd', day: 2 }]],
    canh: [['D', 'M', { mau: TIM, day: 4 }], ['B', 'A', { mau: LA, day: 5 }], ['M', 'A', { mau: VANG, day: 2, net: 2 }], ['M', 'Y', { mau: XAM, day: 1, net: 1 }]],
    nhan: [['B', 'A', 'h', true]],
    lechTen: { M: [-14, 6], C: [-2, 16], X: [12, -12], Y: [14, -6] },
    them: function (board, G) {
      board.create('segment', [[1.5, 0], [1.5, 2]], { strokeColor: NAU, strokeWidth: 5, fixed: true, highlight: false });
      G.label(0.75, -0.7, '1,5 m', { anchorX: 'middle', fontSize: 14 });
      G.label(9, -0.7, '15 m', { anchorX: 'middle', fontSize: 14 });
    },
    ghiChu: 'Mắt M cao 1,5 m; cọc cao 2 m (đỉnh C); A: ngọn cây' });
  var h11 = (function () {
    var ve = [[[0, 0], [27, 0], { mau: XAM, net: 2 }]];
    for (var i = 0; i <= 5; i++) ve.push([[26, -7.2 + 3.6 * i], [28, -7.2 + 3.6 * i], { mau: '#495057' }]);
    return geo({ diem: { M: [0, 0], P: [1.5, 0.6], Q: [1.5, -0.4], A: [27, 10.8], B: [27, -7.2], K: [27, 0] },
      ve: ve,
      canh: [['M', 'A', { mau: VANG, net: 2 }], ['M', 'B', { mau: VANG, net: 2 }], ['P', 'Q', { mau: XANH, day: 5 }], ['A', 'B', { mau: NAU, day: 4 }]],
      nhan: [['A', 'B', '5 tầng', false, 1.6], ['M', 'K', 'MK: từ mắt đến toà nhà', true, 0.9]],
      lechTen: { M: [-16, 0], P: [4, 20], Q: [4, -20], K: [-14, 14] },
      ghiChu: 'Cửa sổ PQ cao 1 m, mắt M cách cửa sổ 1,5 m; mỗi tầng cao 3,6 m' });
  })();

  TOAN8.bai({
    id: 36, ten: 'Các trường hợp đồng dạng của hai tam giác vuông', sgk: { tap: 2, trang: 98 },
    khamPha: {
      nhiemVu: 'Cột cờ $AC$ cao $12$ m, bạn Việt $A\'C\'$ cao $1{,}4$ m đứng cùng một sân, nên tia nắng chiếu tới hai người dưới **cùng một góc** (góc vàng).\n\nKéo thanh trượt **góc nắng** để đổi giờ trong ngày. Bóng dài ra, ngắn lại; còn tỉ số **cao : bóng** của cột và của Việt thì sao?',
      widget: 'geo',
      config: { bbox: [-0.5, 14.2, 17.5, -2.2], wide: true, build: khamPhaBuild },
      cauHoi: {
        de: 'Cột cờ cao $12$ m, Việt cao $1{,}4$ m. Vào lúc bóng của Việt dài $0{,}7$ m thì bóng cột cờ dài bao nhiêu mét?',
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Hai tỉ số "cao : bóng" luôn bằng nhau, vì hai tam giác vuông $ABC$ và $A\'B\'C\'$ có góc nhọn $B = B\'$.', 'Việt: $1{,}4 : 0{,}7 = 2$. Vậy cột: $12 : \\text{bóng} = 2$.'],
        loiGiai: ['Cao : bóng của Việt $= \\frac{1{,}4}{0{,}7} = 2$; cột cũng vậy nên $\\frac{12}{AB} = 2$.', '$AB = 12 : 2 = 6$'],
        loiThuongGap: [{ gt: 24, giaiThich: 'Em nhân thay vì chia. Bóng ngắn hơn chiều cao (tỉ số cao : bóng là $2$) nên bóng cột là $12 : 2$.' }] }
    },
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Áp dụng trường hợp g.g và c.g.c vào tam giác vuông',
        noiDung: "Cho $\\triangle ABC$ vuông tại $A$ và $\\triangle A'B'C'$ vuông tại $A'$.\n\n**Định lí 1.** Nếu một **góc nhọn** của tam giác vuông này bằng một góc nhọn của tam giác vuông kia thì hai tam giác vuông đó đồng dạng: $\\widehat{B'} = \\widehat{B} \\Rightarrow \\triangle A'B'C' \\backsim \\triangle ABC$.\n\n**Định lí 2.** Nếu **hai cạnh góc vuông** của tam giác vuông này tỉ lệ với hai cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó đồng dạng: $\\frac{A'B'}{AB} = \\frac{A'C'}{AC} \\Rightarrow \\triangle A'B'C' \\backsim \\triangle ABC$." },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8.4, 15.5, -2.7], wide: true, build: haiCanhBuild },
        chuThich: "Góc vuông $A = A'$ chính là góc xen giữa hai cạnh góc vuông (trường hợp c.g.c). Khi hai thanh trượt bằng nhau, $\\frac{B'C'}{BC}$ cũng bằng số đó và góc $B' = B$." },
      { loai: 'dinhLi', tieuDe: '2. Trường hợp đặc biệt: cạnh huyền – cạnh góc vuông',
        noiDung: "Nếu **cạnh huyền** và **một cạnh góc vuông** của tam giác vuông này tỉ lệ với cạnh huyền và một cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó đồng dạng.\n\n$$\\frac{B'C'}{BC} = \\frac{A'B'}{AB} \\Rightarrow \\triangle A'B'C' \\backsim \\triangle ABC.$$\n\n(Chứng minh nhờ định lí Pythagore: cạnh góc vuông còn lại cũng tỉ lệ theo cùng tỉ số.)" },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8.4, 15.5, -2.7], wide: true, build: huyenBuild },
        chuThich: "Tam giác tím luôn vuông tại $A'$; cạnh $A'C'$ được tính bằng Pythagore. Khi $\\frac{B'C'}{BC} = \\frac{A'B'}{AB}$ thì $\\frac{A'C'}{AC}$ cũng bằng đúng số đó." },
      { loai: 'chuY', noiDung: "**Tam giác vuông có đường cao.** $\\triangle ABC$ vuông tại $A$, đường cao $AH$: ba tam giác $\\triangle HBA$, $\\triangle ABC$, $\\triangle HAC$ đôi một đồng dạng (chung góc nhọn). Từ đó: $$AB^2 = BH \\cdot BC;\\quad AC^2 = CH \\cdot BC;\\quad AH^2 = BH \\cdot CH.$$" },
      { loai: 'chuY', noiDung: "**Nhận xét.** Nếu $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $k$ thì tỉ số hai **đường cao** tương ứng bằng $k$, còn tỉ số **diện tích** bằng $k^2$: $$\\frac{A'H'}{AH} = k,\\qquad \\frac{S_{A'B'C'}}{S_{ABC}} = k^2.$$" },
      { loai: 'chuY', noiDung: "**Hay nhầm 1 – ghép sai đỉnh.** Hai tam giác vuông có $\\widehat{B} = \\widehat{F}$ ($ABC$ vuông tại $A$, $DEF$ vuông tại $D$) thì viết $\\triangle ABC \\backsim \\triangle DFE$: đỉnh góc vuông ghép với đỉnh góc vuông, góc bằng nhau ghép với nhau.\n\n**Hay nhầm 2 – diện tích.** Tỉ số đồng dạng $k = 2$ thì diện tích gấp $k^2 = 4$ lần, **không** phải $2$ lần." }
    ],
    viDu: [
      { de: 'Bóng cột cờ trên sân dài $6$ m. Cùng lúc đó, bạn Việt cao $1{,}4$ m có bóng dài $0{,}7$ m. Tính chiều cao cột cờ.', buoc: [
        { lam: 'Cột $AC$ và bóng $AB$ tạo thành $\\triangle ABC$ vuông tại $A$; Việt và bóng tạo thành $\\triangle A\'B\'C\'$ vuông tại $A\'$.', vi: 'Cột và người đều đứng thẳng, vuông góc với mặt đất.' },
        { lam: 'Tia nắng song song nên $\\widehat{B} = \\widehat{B\'}$, do đó $\\triangle ABC \\backsim \\triangle A\'B\'C\'$.', vi: 'Hai tam giác vuông có một cặp góc nhọn bằng nhau (Định lí 1).' },
        { lam: '$\\frac{AC}{A\'C\'} = \\frac{AB}{A\'B\'}$, tức $\\frac{AC}{1{,}4} = \\frac{6}{0{,}7}$.', vi: 'Chiều cao ứng với chiều cao, bóng ứng với bóng.' },
        { lam: '$AC = \\frac{1{,}4 \\cdot 6}{0{,}7} = 12$ (m).', vi: 'Nhân chéo rồi chia.' } ] },
      { de: 'Hai con dốc là hai tam giác vuông $AHB$ (vuông tại $H$) và $A\'H\'B\'$ (vuông tại $H\'$) có chiều dài $AB = 13$ m, $A\'B\' = 6{,}5$ m và độ cao $BH = 5$ m, $B\'H\' = 2{,}5$ m. Hai con dốc có dốc như nhau không?', buoc: [
        { lam: '$\\frac{A\'B\'}{AB} = \\frac{6{,}5}{13} = \\frac{1}{2}$; $\\frac{B\'H\'}{BH} = \\frac{2{,}5}{5} = \\frac{1}{2}$.', vi: '$AB$, $A\'B\'$ là **cạnh huyền**; $BH$, $B\'H\'$ là cạnh góc vuông.' },
        { lam: 'Do đó $\\triangle A\'H\'B\' \\backsim \\triangle AHB$ (cạnh huyền – cạnh góc vuông).', vi: 'Trường hợp đồng dạng đặc biệt của tam giác vuông.' },
        { lam: 'Suy ra $\\widehat{H\'A\'B\'} = \\widehat{HAB}$: hai con dốc **dốc như nhau**.', vi: 'Độ dốc đo bằng góc ở chân dốc; hai tam giác đồng dạng nên hai góc này bằng nhau.' } ] },
      { de: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$, $BH = 9$ cm, $CH = 16$ cm. Tính $AH$, $AB$, $AC$.', buoc: [
        { lam: '$\\triangle HBA \\backsim \\triangle HAC$ (cùng vuông tại $H$, $\\widehat{HBA} = \\widehat{HAC}$ vì cùng phụ với $\\widehat{BAH}$).', vi: 'Hai góc cùng phụ với một góc thì bằng nhau.' },
        { lam: '$\\frac{HB}{HA} = \\frac{HA}{HC}$ nên $AH^2 = BH \\cdot CH = 9 \\cdot 16 = 144$, $AH = 12$ cm.', vi: 'Nhân chéo tỉ lệ thức.' },
        { lam: '$BC = 25$; $AB^2 = BH \\cdot BC = 9 \\cdot 25 = 225$, $AB = 15$ cm; $AC^2 = CH \\cdot BC = 400$, $AC = 20$ cm.', vi: 'Dùng các hệ thức trong tam giác vuông có đường cao (hoặc Pythagore).' } ] },
      { de: 'Người ở $A$ muốn đo khoảng cách tới $B$ bên kia sông. Chọn $M$ cùng bờ với $AM = 2$ m, $AM \\perp AB$, đo góc $AMB$. Vẽ trên giấy $\\triangle A\'M\'B\'$ vuông tại $A\'$ với $A\'M\' = 1$ cm, $\\widehat{A\'M\'B\'} = \\widehat{AMB}$, đo được $A\'B\' = 5$ cm. Tính $AB$.', buoc: [
        { lam: '$\\triangle A\'M\'B\' \\backsim \\triangle AMB$ (hai tam giác vuông có góc nhọn $M\' = M$).', vi: 'Định lí 1.' },
        { lam: 'Tỉ số: $\\frac{AM}{A\'M\'} = \\frac{200 \\text{ cm}}{1 \\text{ cm}} = 200$.', vi: 'Đổi cùng đơn vị: $2$ m $= 200$ cm.' },
        { lam: '$AB = 200 \\cdot 5 = 1000$ cm $= 10$ m.', vi: 'Mọi cạnh thật gấp $200$ lần cạnh trên giấy.' } ] }
    ],
    viDuMo: [
      { de: 'Một cây cọc cao $1{,}2$ m có bóng dài $0{,}8$ m. Cùng lúc đó bóng của một toà nhà dài $20$ m. Toà nhà cao bao nhiêu mét?', buoc: [
        { lam: 'Hai tam giác vuông (cọc – bóng cọc, nhà – bóng nhà) có góc nắng bằng nhau nên đồng dạng.', vi: 'Định lí 1.' },
        { lam: '$\\frac{h}{1{,}2} = \\frac{20}{0{,}8}$', vi: 'Chiều cao ứng với chiều cao, bóng ứng với bóng.' },
        { lam: '$h = \\frac{1{,}2 \\cdot 20}{0{,}8} = 30$', vi: 'Em hãy tính $h$ (m):', an: true,
          dapAn: { kieu: 'so', gt: 30 },
          loiThuongGap: [{ gt: 13.33, giaiThich: 'Em ghép lệch (chiều cao với bóng). Cọc cao hơn bóng của nó, nên toà nhà cũng cao hơn bóng $20$ m.' }] } ] },
      { de: "Cho $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $k = 3$, diện tích $\\triangle ABC$ bằng $5$ cm². Tính diện tích $\\triangle A'B'C'$.", buoc: [
        { lam: "$\\frac{S_{A'B'C'}}{S_{ABC}} = k^2 = 9$", vi: 'Tỉ số diện tích bằng bình phương tỉ số đồng dạng (cạnh và đường cao đều gấp $3$).' },
        { lam: "$S_{A'B'C'} = 9 \\cdot 5 = 45$", vi: 'Em hãy tính diện tích (cm²):', an: true,
          dapAn: { kieu: 'so', gt: 45 },
          loiThuongGap: [{ gt: 15, giaiThich: 'Em nhân với $k = 3$. Đáy gấp $3$ **và** chiều cao cũng gấp $3$, nên diện tích gấp $3 \\cdot 3 = 9$ lần.' }] } ] }
    ],
    baiTap: [
      { id: '36.1', muc: 1, de: 'Điều kiện nào dưới đây **không** đủ để kết luận hai tam giác vuông đồng dạng?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Một góc nhọn của tam giác này bằng một góc nhọn của tam giác kia', 'Cạnh huyền và một cạnh góc vuông của tam giác này tỉ lệ với cạnh huyền và một cạnh góc vuông của tam giác kia', 'Một cạnh góc vuông của tam giác này bằng một cạnh góc vuông của tam giác kia', 'Hai cạnh góc vuông của tam giác này tỉ lệ với hai cạnh góc vuông của tam giác kia'] },
        goiY: ['Nhớ lại ba trường hợp đồng dạng của tam giác vuông.', 'Chỉ có một cặp cạnh bằng nhau thì hình dạng hai tam giác có thể rất khác.'],
        loiGiai: ['Phương án 1, 2, 4 là ba trường hợp đồng dạng của tam giác vuông.', 'Một cặp cạnh góc vuông bằng nhau thì **chưa đủ**: ví dụ tam giác vuông có hai cạnh $1;1$ và tam giác vuông có hai cạnh $1;5$.'] },
      { id: '36.2', muc: 1, de: 'Tam giác $ABC$ vuông tại $A$ có $\\widehat{B} = 40^\\circ$; tam giác $DEF$ vuông tại $D$ có $\\widehat{F} = 50^\\circ$. Khẳng định "hai tam giác đồng dạng" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Tính góc nhọn còn lại của tam giác $ABC$: $\\widehat{C} = 90^\\circ - 40^\\circ$.', 'So sánh $\\widehat{C}$ với $\\widehat{F}$.'],
        loiGiai: ['$\\widehat{C} = 90^\\circ - 40^\\circ = 50^\\circ = \\widehat{F}$.', 'Hai tam giác vuông có một cặp góc nhọn bằng nhau nên đồng dạng ($\\triangle ABC \\backsim \\triangle DFE$). Khẳng định **đúng**.'] },
      { id: '36.3', muc: 1, de: 'Trong hình, tam giác vuông $ABC$ có hai cạnh góc vuông $1$ và $1$; tam giác vuông $DEF$ có hai cạnh góc vuông $2$ và $4$. Khẳng định "hai tam giác đồng dạng" đúng hay sai?',
        hinh: h3,
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Định lí 2: hai cạnh góc vuông phải tỉ lệ.', 'So sánh $\\frac{2}{1}$ và $\\frac{4}{1}$.'],
        loiGiai: ['$\\frac{DE}{AB} = 2$ nhưng $\\frac{DF}{AC} = 4$ (đổi cặp cũng không bằng nhau).', 'Hai cạnh góc vuông không tỉ lệ nên **không** đồng dạng. Khẳng định **sai**. (Tam giác $ABC$ vuông cân, còn $DEF$ thì không.)'] },
      { id: '36.4', muc: 1, de: 'Tam giác $ABC$ vuông tại $A$ có $\\widehat{B} = 35^\\circ$; tam giác $MNP$ vuông tại $M$ có $\\widehat{P} = 35^\\circ$. Kí hiệu nào **đúng**?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$\\triangle ABC \\backsim \\triangle MNP$', '$\\triangle ABC \\backsim \\triangle MPN$', '$\\triangle ABC \\backsim \\triangle NMP$', '$\\triangle ABC \\backsim \\triangle PMN$'] },
        goiY: ['Đỉnh góc vuông ghép với đỉnh góc vuông: $A \\leftrightarrow M$.', 'Góc $35^\\circ$ ghép với góc $35^\\circ$: $B \\leftrightarrow P$.'],
        loiGiai: ['$A \\leftrightarrow M$ (góc vuông), $B \\leftrightarrow P$ (góc $35^\\circ$), nên $C \\leftrightarrow N$.', 'Vậy $\\triangle ABC \\backsim \\triangle MPN$.'] },
      { id: '36.5', muc: 2, de: "Tam giác $ABC$ vuông tại $A$ có $AB = 6$, $AC = 8$; tam giác $A'B'C'$ vuông tại $A'$ có $A'B' = 9$, $A'C' = 12$. Tính $x = B'C'$.",
        hinh: h5,
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ["$\\frac{A'B'}{AB} = \\frac{9}{6} = 1{,}5$ và $\\frac{A'C'}{AC} = \\frac{12}{8} = 1{,}5$: hai tam giác vuông đồng dạng.", "Tính $BC$ bằng Pythagore rồi nhân $1{,}5$ (hoặc dùng Pythagore trực tiếp cho $A'B'C'$)."],
        loiGiai: ["$\\frac{A'B'}{AB} = \\frac{A'C'}{AC} = 1{,}5$ nên $\\triangle A'B'C' \\backsim \\triangle ABC$ với $k = 1{,}5$.", '$BC = \\sqrt{6^2 + 8^2} = 10$.', "$x = 1{,}5 \\cdot 10 = 15$"],
        loiThuongGap: [{ gt: 21, giaiThich: '$9 + 12 = 21$ là tổng hai cạnh góc vuông. Cạnh huyền tính bằng Pythagore hoặc nhân tỉ số với $BC = 10$.' }] },
      { id: '36.6', muc: 2, de: 'Tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 10$, $AB = 6$; tam giác $DEF$ vuông tại $D$ có cạnh huyền $EF = 15$, $DE = 9$. Hai tam giác đồng dạng không? Tính $x = DF$.',
        hinh: h6,
        dapAn: { kieu: 'so', gt: 12 },
        goiY: ['So sánh $\\frac{EF}{BC}$ (hai cạnh huyền) và $\\frac{DE}{AB}$ (hai cạnh góc vuông).', 'Hai tỉ số đều bằng $1{,}5$: đồng dạng theo cạnh huyền – cạnh góc vuông. $DF = 1{,}5 \\cdot AC$.'],
        loiGiai: ['$\\frac{EF}{BC} = \\frac{15}{10} = 1{,}5$; $\\frac{DE}{AB} = \\frac{9}{6} = 1{,}5$ nên $\\triangle DEF \\backsim \\triangle ABC$.', '$AC = \\sqrt{10^2 - 6^2} = 8$.', '$x = DF = 1{,}5 \\cdot 8 = 12$'],
        loiThuongGap: [{ gt: 'sqrt(306)', giaiThich: 'Em cộng $15^2 + 9^2$. $EF$ là cạnh huyền nên $DF^2 = 15^2 - 9^2 = 144$.' }] },
      { id: '36.7', muc: 2, de: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$ với $BH = 3{,}6$ cm, $CH = 6{,}4$ cm. Tính $AH$, $AB$, $AC$ (cm).',
        hinh: h7,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$AH =$', kieu: 'so', gt: 4.8, loiThuongGap: [{ gt: 23.04, giaiThich: '$23{,}04$ là $AH^2$. Lấy căn: $AH = 4{,}8$.' }] },
          { nhan: '$AB =$', kieu: 'so', gt: 6 },
          { nhan: '$AC =$', kieu: 'so', gt: 8 }] },
        goiY: ['$\\triangle HBA \\backsim \\triangle HAC$ nên $AH^2 = BH \\cdot CH$.', '$BC = 3{,}6 + 6{,}4 = 10$; $AB^2 = BH \\cdot BC$, $AC^2 = CH \\cdot BC$.'],
        loiGiai: ['$AH^2 = 3{,}6 \\cdot 6{,}4 = 23{,}04$ nên $AH = 4{,}8$.', '$BC = 10$; $AB^2 = 3{,}6 \\cdot 10 = 36$ nên $AB = 6$.', '$AC^2 = 6{,}4 \\cdot 10 = 64$ nên $AC = 8$.'] },
      { id: '36.8', muc: 2, de: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$, $AB = 10$ cm, $AH = 8$ cm. Tính $BH$ và $CH$ (cm; $CH$ ghi dạng phân số hoặc số thập phân làm tròn đến hàng phần trăm).',
        hinh: h8,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$BH =$', kieu: 'so', gt: 6 },
          { nhan: '$CH =$', kieu: 'so', gt: '32/3', saiSo: 0.006, loiThuongGap: [{ gt: 4.5, giaiThich: 'Em ghép sai cặp cạnh (ra $CH = \\frac{BH^2}{AH}$). Từ $\\triangle AHB \\backsim \\triangle CHA$: $\\frac{AH}{CH} = \\frac{HB}{HA}$, nên $CH = \\frac{AH^2}{BH}$.' }] }] },
        goiY: ['Tam giác $AHB$ vuông tại $H$: $BH^2 = AB^2 - AH^2$.', '$\\triangle AHB \\backsim \\triangle CHA$ (vuông tại $H$, $\\widehat{ABH} = \\widehat{CAH}$) nên $\\frac{AH}{CH} = \\frac{BH}{AH}$.'],
        loiGiai: ['$BH^2 = 10^2 - 8^2 = 36$ nên $BH = 6$.', '$\\triangle AHB \\backsim \\triangle CHA$ nên $\\frac{AH}{CH} = \\frac{HB}{HA}$, suy ra $CH = \\frac{AH^2}{BH} = \\frac{64}{6} = \\frac{32}{3}$.'] },
      { id: '36.9', muc: 2, de: "Cho $\\triangle A'B'C' \\backsim \\triangle ABC$; đường cao $A'H' = 6$ cm, đường cao tương ứng $AH = 4$ cm. Diện tích $\\triangle ABC$ là $12$ cm². Tính diện tích $\\triangle A'B'C'$ (cm²).",
        dapAn: { kieu: 'so', gt: 27 },
        goiY: ["Tỉ số hai đường cao tương ứng bằng tỉ số đồng dạng: $k = \\frac{A'H'}{AH}$.", 'Tỉ số diện tích bằng $k^2$.'],
        loiGiai: ["$k = \\frac{6}{4} = 1{,}5$, nên $\\frac{S_{A'B'C'}}{S_{ABC}} = 1{,}5^2 = 2{,}25$.", "$S_{A'B'C'} = 2{,}25 \\cdot 12 = 27$"],
        loiThuongGap: [{ gt: 18, giaiThich: 'Em nhân với $k = 1{,}5$. Diện tích gấp $k^2 = 2{,}25$ lần.' }] },
      { id: '36.10', muc: 3, de: 'Để đo chiều cao $h$ của một cái cây, người ta cắm cọc cao $2$ m cách gốc cây $15$ m. Người đo đứng cách cọc $1{,}5$ m (cọc ở giữa người và cây), mắt cách mặt đất $1{,}5$ m, nhìn thấy đỉnh cọc thẳng hàng với ngọn cây. Tính $h$ (m).',
        hinh: h10,
        dapAn: { kieu: 'so', gt: 7 },
        goiY: ['Kẻ đường ngang qua mắt $M$, cắt cọc tại $X$ và cắt cây tại $Y$. Hai tam giác vuông $MXC$ và $MYA$ có chung góc nhọn $M$.', '$CX = 2 - 1{,}5 = 0{,}5$; $MX = 1{,}5$; $MY = 1{,}5 + 15 = 16{,}5$. Lập $\\frac{AY}{CX} = \\frac{MY}{MX}$.'],
        loiGiai: ['$\\triangle MXC \\backsim \\triangle MYA$ (vuông, chung góc $M$), nên $\\frac{AY}{CX} = \\frac{MY}{MX}$.', '$\\frac{AY}{0{,}5} = \\frac{16{,}5}{1{,}5} = 11$, nên $AY = 5{,}5$ (m).', '$h = AY + YB = 5{,}5 + 1{,}5 = 7$ (m)'],
        loiThuongGap: [{ gt: 5.5, giaiThich: '$5{,}5$ m mới là phần cây **trên** tầm mắt. Cộng thêm chiều cao mắt $1{,}5$ m.' }, { gt: 22, giaiThich: 'Em dùng cả chiều cao cọc $2$ m. Phải dùng phần cọc trên tầm mắt: $2 - 1{,}5 = 0{,}5$ m.' }] },
      { id: '36.11', muc: 3, de: 'Lan đứng trong phòng, mắt cách cửa sổ $1{,}5$ m, nhìn sang toà nhà đối diện thì qua khung cửa sổ cao $1$ m vừa thấy trọn $5$ tầng, mỗi tầng cao $3{,}6$ m. Coi tia nhìn qua mép trên và mép dưới cửa sổ chạm đỉnh và chân $5$ tầng đó, cửa sổ và toà nhà song song. Tính khoảng cách từ cửa sổ đến toà nhà đối diện (m).',
        hinh: h11,
        dapAn: { kieu: 'so', gt: 25.5 },
        goiY: ['Chiều cao $5$ tầng: $5 \\cdot 3{,}6 = 18$ m. Hai tam giác (mắt – cửa sổ, mắt – toà nhà) đồng dạng.', '$\\frac{1}{18} = \\frac{1{,}5}{d}$ với $d$ là khoảng cách từ **mắt** đến toà nhà. Rồi trừ $1{,}5$ m.'],
        loiGiai: ['Phần nhà nhìn thấy cao $5 \\cdot 3{,}6 = 18$ (m).', 'Cửa sổ $PQ \\parallel AB$ nên $\\triangle MPQ \\backsim \\triangle MAB$; tỉ số hai đường cao kẻ từ $M$ (dài $1{,}5$ m và $MK$) bằng tỉ số đồng dạng: $\\frac{PQ}{AB} = \\frac{1{,}5}{MK}$, tức $\\frac{1}{18} = \\frac{1{,}5}{MK}$, nên $MK = 27$ m (từ mắt đến toà nhà).', 'Khoảng cách từ cửa sổ đến toà nhà $= 27 - 1{,}5 = 25{,}5$'],
        loiThuongGap: [{ gt: 27, giaiThich: '$27$ m là khoảng cách từ **mắt** Lan. Đề hỏi từ cửa sổ: trừ đi $1{,}5$ m.' }] }
    ],
    timLoi: [
      { de: 'Tam giác $ABC$ vuông tại $A$, tam giác $DEF$ vuông tại $D$, $\\widehat{B} = \\widehat{F}$, $AB = 4$, $DF = 6$, $AC = 3$. Bạn Phong tính như sau. Dòng nào sai?',
        loiGiaiSai: ['Hai tam giác vuông có $\\widehat{B} = \\widehat{F}$ nên đồng dạng', 'Vậy $\\triangle ABC \\backsim \\triangle DEF$', 'Suy ra $\\frac{AC}{DF} = \\frac{AB}{DE}$, tức $\\frac{3}{6} = \\frac{4}{DE}$, $DE = 8$'],
        dongSai: 1,
        giaiThich: 'Ghép sai đỉnh: $A \\leftrightarrow D$ (góc vuông), $B \\leftrightarrow F$ (góc bằng nhau), nên $C \\leftrightarrow E$. Phải viết $\\triangle ABC \\backsim \\triangle DFE$.',
        sua: '$\\triangle ABC \\backsim \\triangle DFE$, nên $\\frac{AB}{DF} = \\frac{AC}{DE}$, tức $\\frac{4}{6} = \\frac{3}{DE}$, $DE = 4{,}5$.' },
      { de: "Hai tam giác đồng dạng theo tỉ số $k = 2$, tam giác nhỏ có diện tích $10$ cm². Bạn Hùng tính diện tích tam giác lớn. Dòng nào sai?",
        loiGiaiSai: ['Mỗi cạnh của tam giác lớn gấp $2$ lần cạnh tương ứng của tam giác nhỏ', 'Nên diện tích tam giác lớn gấp $2$ lần', 'Diện tích tam giác lớn là $20$ cm²'],
        dongSai: 1,
        giaiThich: 'Diện tích $= \\frac{1}{2} \\cdot \\text{đáy} \\cdot \\text{cao}$; cả đáy và đường cao đều gấp $2$ nên diện tích gấp $2^2 = 4$ lần.',
        sua: 'Diện tích tam giác lớn gấp $4$ lần: $4 \\cdot 10 = 40$ cm².' }
    ]
  });
})();
