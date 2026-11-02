// Bài 33 – Hai tam giác đồng dạng (SGK Toán 8 KNTT, Tập 2, tr. 78–82)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hh = TOAN8.hh, geo = TOAN8.hinhGeo, lerp = hh.lerp, tg = hh.tg;

  // Đặt tam giác tên ten = [đỉnh trên, đỉnh trái, đỉnh phải] có cạnh đáy a, cạnh phải b, cạnh trái c; dời (dx, dy).
  function dat(diem, ten, a, b, c, dx, dy) {
    var T = tg(a, b, c);
    diem[ten[0]] = [T.A[0] + dx, T.A[1] + (dy || 0)];
    diem[ten[1]] = [dx, dy || 0];
    diem[ten[2]] = [a + dx, dy || 0];
    return diem;
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
  function diemAnh(board, ten, fx, fy) {
    return board.create('point', [fx, fy], { name: ten, size: 3, color: TIM, fixed: true, showInfobox: false,
      label: { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700', strokeColor: TIM } });
  }

  // Thanh trượt k: tam giác A'B'C' là ảnh phóng to/thu nhỏ của ABC (đặt sang bên phải).
  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 1.5, 4), B = G.pt('B', 0, 0), C = G.pt('C', 4.5, 0);
    var k = board.create('slider', [[0.3, -1.3], [5.3, -1.3], [0.5, 1.5, 2.5]],
      { name: 'k', snapWidth: 0.1, digits: 1, label: { fontSize: 18, strokeColor: TIM } });
    var gx = 6.5;
    function anh(P, ten) {
      return diemAnh(board, ten, function () { return gx + k.Value() * (P.X() - B.X()); }, function () { return k.Value() * (P.Y() - B.Y()); });
    }
    var A1 = anh(A, "A'"), B1 = anh(B, "B'"), C1 = anh(C, "C'");
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: TIM, fillOpacity: 0.12, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    danhGoc(board, B, A, C, CAM); danhGoc(board, B1, A1, C1, CAM);
    danhGoc(board, A, B, C, XANH); danhGoc(board, A1, B1, C1, XANH);
    danhGoc(board, A, C, B, LA); danhGoc(board, A1, C1, B1, LA);
    G.label(-0.7, 10.9, function () { return "A'B' : AB = " + fmt(G.len(A1, B1) / G.len(A, B)); });
    G.label(-0.7, 10.1, function () { return "B'C' : BC = " + fmt(G.len(B1, C1) / G.len(B, C)); });
    G.label(-0.7, 9.3, function () { return "C'A' : CA = " + fmt(G.len(C1, A1) / G.len(C, A)); });
    G.label(-0.7, 8.1, function () { return 'góc A = ' + Math.round(goc(B, A, C)) + "°,  góc A' = " + Math.round(goc(B1, A1, C1)) + '°'; }, { strokeColor: CAM });
    G.label(-0.7, 7.3, function () { return 'góc B = ' + Math.round(goc(A, B, C)) + "°,  góc B' = " + Math.round(goc(A1, B1, C1)) + '°'; }, { strokeColor: XANH });
    G.label(-0.7, 6.5, function () { return 'góc C = ' + Math.round(goc(A, C, B)) + "°,  góc C' = " + Math.round(goc(A1, C1, B1)) + '°'; }, { strokeColor: LA });
  };

  // Định lí: MN // BC thì tam giác AMN đồng dạng với tam giác ABC.
  var dinhLiBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.04 });
    var AB = G.seg(A, B), AC = G.seg(A, C), BC = G.seg(B, C, { strokeColor: XANH, strokeWidth: 4 });
    var M = G.glider('M', 1.6, 3.2, AB);
    var N = G.inter(G.par(M, BC), AC, 'N');
    G.poly([A, M, N], { fillColor: TIM, fillOpacity: 0.15, borders: { strokeWidth: 0, strokeColor: TIM, fixed: true } });
    G.seg(M, N, { strokeColor: TIM, strokeWidth: 4 });
    danhGoc(board, A, M, N, CAM, 0.5); danhGoc(board, A, B, C, CAM, 0.5);
    G.label(-0.8, 7.9, function () { return 'AM : AB = ' + fmt(G.len(A, M) / G.len(A, B)); });
    G.label(3.4, 7.9, function () { return 'AN : AC = ' + fmt(G.len(A, N) / G.len(A, C)); });
    G.label(7.4, 7.9, function () { return 'MN : BC = ' + fmt(G.len(M, N) / G.len(B, C)); });
  };

  // ---------- Hình tĩnh cho bài tập ----------
  var h5 = (function () {
    var d = {}; dat(d, ['A', 'B', 'C'], 5, 6, 3, 0, 0); dat(d, ['D', 'E', 'F'], 7.5, 9, 4.5, 7.5, 0);
    return geo({ diem: d, to: ['D', 'E', 'F'],
      canh: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E', { mau: TIM }], ['E', 'F', { mau: TIM }], ['F', 'D', { mau: TIM }]],
      nhan: [['A', 'B', '3'], ['B', 'C', '5'], ['C', 'A', '6', true], ['D', 'E', '4,5', true], ['E', 'F', 'x'], ['F', 'D', 'y']] });
  })();
  var h7 = (function () {
    var T = tg(10, 7, 5), M = lerp(T.A, T.B, 3 / 5), N = lerp(T.A, T.C, 3 / 5);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, M: M, N: N }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]],
      nhan: [['A', 'M', '3'], ['M', 'B', '2'], ['B', 'C', '10'], ['M', 'N', 'x', true, 0.8]] });
  })();
  var h9 = (function () {
    var T = tg(8, 7, 6.5), M = lerp(T.A, T.B, 0.5), N = lerp(T.A, T.C, 0.5), P = lerp(T.A, T.B, 0.25), Q = lerp(T.A, T.C, 0.25);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, M: M, N: N, P: P, Q: Q }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM }], ['P', 'Q', { mau: CAM }]],
      lechTen: { P: [-16, 4], Q: [16, 4], M: [-16, 4], N: [16, 4] } });
  })();
  var hDen = geo({
    diem: { E: [0, 0], C: [0.9, 0], D: [0.9, 1.2], B: [6, 0], A: [6, 8] },
    ve: [[[0, -0.9], [0.01, -0.9], { mau: '#ffffff', day: 0 }]],
    canh: [['E', 'B'], ['C', 'D', { mau: CAM, day: 5 }], ['B', 'A', { mau: XANH, day: 5 }], ['E', 'A', { mau: '#f59f00', day: 2, net: 2 }]],
    nhan: [['C', 'D', '1,2 m', true, 2.2], ['E', 'C', '0,9 m', false, 1.6], ['C', 'B', '5,1 m'], ['B', 'A', 'h', true]],
    lechTen: { A: [14, 8], D: [-12, 10], C: [16, -12], E: [-14, 2] },
    goc: [['C', 'B', 'A', { mau: '#495057', r: 0.5 }]],
    ghiChu: 'Cọc CD, cột đèn BA, tia sáng EDA'
  });

  TOAN8.bai({
    id: 33, ten: 'Hai tam giác đồng dạng', sgk: { tap: 2, trang: 78 },
    khamPha: {
      nhiemVu: "Kéo thanh trượt **k** để phóng to hoặc thu nhỏ tam giác. Tam giác tím $A'B'C'$ được tạo bằng cách nhân **mọi** khoảng cách của tam giác $ABC$ với $k$. Em cũng kéo được các đỉnh $A$, $B$, $C$.\n\nHãy quan sát: ba tỉ số cạnh ở trên cùng thay đổi thế nào? Các góc (cùng màu) thì sao?",
      widget: 'geo',
      config: { bbox: [-1, 11.6, 17, -2], wide: true, build: khamPhaBuild },
      cauHoi: {
        de: "Kéo thanh trượt tới $k = 2$. Khi đó ba tỉ số $\\frac{A'B'}{AB}$, $\\frac{B'C'}{BC}$, $\\frac{C'A'}{CA}$ cùng bằng bao nhiêu?",
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Đặt thanh trượt ở $k = 2$ rồi đọc ba dòng trên cùng.', 'Mọi cạnh của tam giác tím đều gấp $k$ lần cạnh tương ứng của tam giác $ABC$.'],
        loiGiai: ['Ba tỉ số luôn bằng nhau và bằng đúng $k$; còn các góc cùng màu thì **không đổi**.', 'Hai tam giác như vậy gọi là **đồng dạng**. Với $k = 2$: $\\frac{A\'B\'}{AB} = 2$']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hai tam giác đồng dạng',
        noiDung: "Tam giác $A'B'C'$ gọi là **đồng dạng** với tam giác $ABC$ nếu:\n\n$$\\frac{A'B'}{AB} = \\frac{B'C'}{BC} = \\frac{A'C'}{AC};\\qquad \\widehat{A'} = \\widehat{A},\\ \\widehat{B'} = \\widehat{B},\\ \\widehat{C'} = \\widehat{C}.$$\n\nKí hiệu: $\\triangle A'B'C' \\backsim \\triangle ABC$ (viết **theo thứ tự cặp đỉnh tương ứng**).\n\nTỉ số $k = \\frac{A'B'}{AB} = \\frac{B'C'}{BC} = \\frac{A'C'}{AC}$ gọi là **tỉ số đồng dạng** của $\\triangle A'B'C'$ với $\\triangle ABC$." },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 11.6, 17, -2], wide: true, build: khamPhaBuild },
        chuThich: 'Ba tỉ số cạnh luôn bằng nhau (bằng $k$), các góc cùng màu luôn bằng nhau. $k > 1$: phóng to; $k < 1$: thu nhỏ; $k = 1$: hai tam giác **bằng nhau**.' },
      { loai: 'chuY', noiDung: "**Đọc kí hiệu đúng thứ tự.** Từ $\\triangle \\ca{A}\\cb{B}\\cc{C} \\backsim \\triangle \\ca{M}\\cb{N}\\cc{P}$, các chữ **cùng vị trí** là cặp đỉnh tương ứng: $\\ca{A} \\leftrightarrow \\ca{M}$, $\\cb{B} \\leftrightarrow \\cb{N}$, $\\cc{C} \\leftrightarrow \\cc{P}$.\n\nSuy ra góc bằng nhau: $\\widehat{A} = \\widehat{M}$, $\\widehat{B} = \\widehat{N}$, $\\widehat{C} = \\widehat{P}$; cạnh tương ứng lấy **cùng vị trí chữ**: $AB \\leftrightarrow MN$, $BC \\leftrightarrow NP$, $AC \\leftrightarrow MP$." },
      { loai: 'dinhLi', tieuDe: 'Nhận xét',
        noiDung: "• Nếu $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $k$ thì $\\triangle ABC \\backsim \\triangle A'B'C'$ theo tỉ số $\\frac{1}{k}$. Ta nói hai tam giác **đồng dạng với nhau**.\n\n• Hai tam giác bằng nhau thì đồng dạng với nhau theo tỉ số $k = 1$. Mọi tam giác đồng dạng với chính nó.\n\n• Nếu $\\triangle A''B''C'' \\backsim \\triangle A'B'C'$ theo tỉ số $k$ và $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $m$ thì $\\triangle A''B''C'' \\backsim \\triangle ABC$ theo tỉ số $k \\cdot m$." },
      { loai: 'dinhLi', tieuDe: 'Định lí (đường thẳng song song với một cạnh)',
        noiDung: 'Nếu một đường thẳng cắt hai cạnh của một tam giác và **song song** với cạnh còn lại thì nó tạo thành một tam giác mới đồng dạng với tam giác đã cho.\n\n**GT:** $\\triangle ABC$, $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$).\n\n**KL:** $\\triangle AMN \\backsim \\triangle ABC$.\n\n**Chú ý.** Định lí vẫn đúng nếu đường thẳng cắt **phần kéo dài** của hai cạnh tam giác.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8.6, 10, -0.8], build: dinhLiBuild },
        chuThich: 'Kéo $M$ (đoạn tím $MN$ luôn song song với $BC$). Ba tỉ số $\\frac{AM}{AB}$, $\\frac{AN}{AC}$, $\\frac{MN}{BC}$ luôn bằng nhau, góc $A$ chung, $\\widehat{AMN} = \\widehat{ABC}$ (đồng vị): $\\triangle AMN \\backsim \\triangle ABC$.' },
      { loai: 'chuY', noiDung: "**Hay nhầm 1 – ghép sai cặp cạnh.** Với $\\triangle ABC \\backsim \\triangle DEF$, cạnh $AC$ (chữ thứ 1 và 3) tương ứng với $DF$ (chữ thứ 1 và 3), **không** phải $EF$.\n\n**Hay nhầm 2 – lật ngược tỉ số.** Tỉ số đồng dạng của $\\triangle A'B'C'$ với $\\triangle ABC$ là $\\frac{A'B'}{AB}$ (cạnh tam giác **đứng trước** ở trên)." }
    ],
    viDu: [
      { de: "Cho $ABC$ và $A'B'C'$ là hai tam giác đều có $AB = 6$ cm, $A'B' = 4$ cm. Chứng minh $\\triangle A'B'C' \\backsim \\triangle ABC$ và tìm tỉ số đồng dạng.", buoc: [
        { lam: "Tam giác đều: $BC = CA = AB = 6$ cm; $B'C' = C'A' = A'B' = 4$ cm.", vi: 'Tam giác đều có ba cạnh bằng nhau.' },
        { lam: "$\\widehat{A} = \\widehat{B} = \\widehat{C} = 60^\\circ$ và $\\widehat{A'} = \\widehat{B'} = \\widehat{C'} = 60^\\circ$.", vi: 'Mỗi góc của tam giác đều bằng $60^\\circ$, nên ba cặp góc bằng nhau.' },
        { lam: "$\\frac{A'B'}{AB} = \\frac{B'C'}{BC} = \\frac{C'A'}{CA} = \\frac{4}{6} = \\frac{2}{3}$.", vi: 'Ba cặp cạnh tương ứng tỉ lệ.' },
        { lam: "Vậy $\\triangle A'B'C' \\backsim \\triangle ABC$ với tỉ số đồng dạng $\\frac{2}{3}$.", vi: 'Đủ cả hai điều kiện của định nghĩa. Tam giác $A\'B\'C\'$ đứng trước nên cạnh của nó nằm trên tử số.' } ] },
      { de: 'Cho $\\triangle ABC \\backsim \\triangle DEF$ có $AB = 4$ cm, $BC = 6$ cm, $CA = 5$ cm và $DE = 6$ cm. Tính $EF$ và $FD$.', buoc: [
        { lam: 'Cặp đỉnh tương ứng: $A \\leftrightarrow D$, $B \\leftrightarrow E$, $C \\leftrightarrow F$. Nên $AB \\leftrightarrow DE$, $BC \\leftrightarrow EF$, $CA \\leftrightarrow FD$.', vi: 'Đọc theo vị trí chữ trong kí hiệu. Làm bước này trước để không ghép nhầm cạnh.' },
        { lam: '$\\frac{DE}{AB} = \\frac{EF}{BC} = \\frac{FD}{CA}$, tức $\\frac{6}{4} = \\frac{EF}{6} = \\frac{FD}{5}$.', vi: 'Hai tam giác đồng dạng thì các cạnh tương ứng tỉ lệ. Tỉ số đã biết là $\\frac{6}{4} = \\frac{3}{2}$.' },
        { lam: '$EF = 6 \\cdot \\frac{3}{2} = 9$ (cm); $FD = 5 \\cdot \\frac{3}{2} = 7{,}5$ (cm).', vi: 'Mỗi cạnh của $\\triangle DEF$ bằng $\\frac{3}{2}$ cạnh tương ứng của $\\triangle ABC$.' } ] },
      { de: 'Cho tam giác $ABC$ có $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$), $AM = 2$ cm, $AB = 6$ cm, $BC = 9$ cm. Tính $MN$.', buoc: [
        { lam: 'Vì $MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$.', vi: 'Định lí: đường thẳng song song với một cạnh tạo ra tam giác đồng dạng.' },
        { lam: '$\\frac{AM}{AB} = \\frac{MN}{BC}$, tức $\\frac{2}{6} = \\frac{MN}{9}$.', vi: '$A \\leftrightarrow A$, $M \\leftrightarrow B$, $N \\leftrightarrow C$: cạnh $AM$ ứng với $AB$, cạnh $MN$ ứng với $BC$.' },
        { lam: '$MN = \\frac{2 \\cdot 9}{6} = 3$ (cm).', vi: 'Nhân chéo rồi chia.' } ] },
      { de: 'Cho $\\triangle ABC \\backsim \\triangle MNP$, biết $\\widehat{A} = 50^\\circ$, $\\widehat{N} = 60^\\circ$. Tính $\\widehat{P}$.', buoc: [
        { lam: '$\\widehat{M} = \\widehat{A} = 50^\\circ$.', vi: '$A$ và $M$ cùng đứng thứ nhất trong kí hiệu nên là cặp đỉnh tương ứng.' },
        { lam: '$\\widehat{P} = 180^\\circ - 50^\\circ - 60^\\circ = 70^\\circ$.', vi: 'Tổng ba góc của tam giác $MNP$ bằng $180^\\circ$.' } ] }
    ],
    viDuMo: [
      { de: 'Cho $\\triangle MNP \\backsim \\triangle ABC$ với $AB = 8$ cm, $BC = 10$ cm và $MN = 4$ cm. Tính $NP$.', buoc: [
        { lam: '$M \\leftrightarrow A$, $N \\leftrightarrow B$, $P \\leftrightarrow C$ nên $\\frac{MN}{AB} = \\frac{NP}{BC}$.', vi: 'Ghép cặp đỉnh theo vị trí chữ.' },
        { lam: '$\\frac{4}{8} = \\frac{NP}{10}$', vi: 'Thay số.' },
        { lam: '$NP = \\frac{4 \\cdot 10}{8} = 5$', vi: 'Em hãy tính $NP$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 5 },
          loiThuongGap: [{ gt: 20, giaiThich: 'Em lật ngược tỉ số ($\\frac{8}{4} = \\frac{NP}{10}$). Tam giác $MNP$ nhỏ hơn ($MN = 4 < AB = 8$) nên $NP$ phải nhỏ hơn $BC$.' }] } ] },
      { de: "Biết $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số đồng dạng $k = 3$. Hỏi $\\triangle ABC \\backsim \\triangle A'B'C'$ theo tỉ số nào?", buoc: [
        { lam: "$\\frac{A'B'}{AB} = 3$ nên $A'B' = 3 \\cdot AB$.", vi: 'Tỉ số đồng dạng $3$ nghĩa là mỗi cạnh tam giác $A\'B\'C\'$ gấp $3$ lần cạnh tương ứng.' },
        { lam: "Tỉ số của $\\triangle ABC$ với $\\triangle A'B'C'$ là $\\frac{AB}{A'B'} = \\frac{1}{3}$", vi: 'Em hãy nhập tỉ số (dạng phân số, ví dụ 1/2):', an: true,
          dapAn: { kieu: 'so', gt: '1/3' },
          loiThuongGap: [{ gt: 3, giaiThich: 'Đổi chỗ hai tam giác thì tỉ số đổi thành **nghịch đảo**: $\\frac{1}{k} = \\frac{1}{3}$.' }] } ] }
    ],
    baiTap: [
      { id: '33.1', muc: 1, de: 'Cho $\\triangle ABC \\backsim \\triangle MNP$. Khẳng định nào dưới đây **sai**?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['$\\triangle MNP \\backsim \\triangle ABC$', '$\\triangle BCA \\backsim \\triangle NPM$', '$\\triangle CAB \\backsim \\triangle PMN$', '$\\triangle ACB \\backsim \\triangle MNP$'] },
        goiY: ['Các cặp đỉnh tương ứng là $A \\leftrightarrow M$, $B \\leftrightarrow N$, $C \\leftrightarrow P$.', 'Kiểm tra từng phương án: chữ cùng vị trí có phải là một cặp tương ứng không?'],
        loiGiai: ['Ba phương án đầu giữ đúng các cặp $A$–$M$, $B$–$N$, $C$–$P$.', 'Phương án cuối ghép $C$ với $N$ và $B$ với $P$: **sai** thứ tự. Đúng phải là $\\triangle ACB \\backsim \\triangle MPN$.'] },
      { id: '33.2', muc: 1, de: 'Cho $\\triangle ABC \\backsim \\triangle DEF$, biết $\\widehat{A} = 65^\\circ$ và $\\widehat{E} = 45^\\circ$. Tính số đo các góc $\\widehat{B}$, $\\widehat{C}$, $\\widehat{F}$ (đơn vị độ).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$\\widehat{B} =$', kieu: 'so', gt: 45 },
          { nhan: '$\\widehat{C} =$', kieu: 'so', gt: 70 },
          { nhan: '$\\widehat{F} =$', kieu: 'so', gt: 70 }] },
        goiY: ['Hai tam giác đồng dạng thì các góc tương ứng bằng nhau: $\\widehat{A} = \\widehat{D}$, $\\widehat{B} = \\widehat{E}$, $\\widehat{C} = \\widehat{F}$.', 'Có $\\widehat{A}$ và $\\widehat{B}$ rồi thì tính $\\widehat{C}$ bằng tổng ba góc $180^\\circ$.'],
        loiGiai: ['$\\widehat{B} = \\widehat{E} = 45^\\circ$.', '$\\widehat{C} = 180^\\circ - 65^\\circ - 45^\\circ = 70^\\circ$.', '$\\widehat{F} = \\widehat{C} = 70^\\circ$.'] },
      { id: '33.3', muc: 1, de: "Cho $\\triangle A'B'C' \\backsim \\triangle ABC$ có $A'B' = 6$ cm và $AB = 4$ cm. Tìm tỉ số đồng dạng của $\\triangle A'B'C'$ với $\\triangle ABC$ (viết dạng phân số).",
        dapAn: { kieu: 'so', gt: '3/2' },
        goiY: ["Tỉ số đồng dạng của $\\triangle A'B'C'$ với $\\triangle ABC$ là $k = \\frac{A'B'}{AB}$.", 'Tính $\\frac{6}{4}$ rồi rút gọn.'],
        loiGiai: ["$k = \\frac{A'B'}{AB} = \\frac{6}{4} = \\frac{3}{2}$"],
        loiThuongGap: [{ gt: '2/3', giaiThich: "Em lật ngược tỉ số. Tam giác $A'B'C'$ đứng trước nên cạnh $A'B'$ nằm ở **tử số**." }] },
      { id: '33.4', muc: 1, de: 'Khẳng định sau đúng hay sai: "Hai tam giác đều bất kì luôn đồng dạng với nhau."',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Mọi góc của tam giác đều bằng bao nhiêu độ?', 'Ba cạnh của tam giác đều bằng nhau, nên ba tỉ số cạnh có bằng nhau không?'],
        loiGiai: ['Hai tam giác đều có các góc đều bằng $60^\\circ$, và ba tỉ số cạnh đều bằng $\\frac{a\'}{a}$ ($a$, $a\'$ là cạnh hai tam giác).', 'Nên chúng luôn đồng dạng. Khẳng định **đúng**. (Còn hai tam giác vuông bất kì thì **không** chắc đồng dạng.)'] },
      { id: '33.5', muc: 2, de: 'Trong hình, $\\triangle ABC \\backsim \\triangle DEF$ với $AB = 3$, $BC = 5$, $CA = 6$ và $DE = 4{,}5$. Tính $x = EF$ và $y = FD$.',
        hinh: h5,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$x = EF =$', kieu: 'so', gt: 7.5, loiThuongGap: [{ gt: 9, giaiThich: 'Cạnh $EF$ ứng với $BC = 5$ (chữ thứ 2 và 3), không phải $CA$.' }] },
          { nhan: '$y = FD =$', kieu: 'so', gt: 9, loiThuongGap: [{ gt: 4, giaiThich: 'Em lật ngược tỉ số. $\\triangle DEF$ lớn hơn ($DE = 4{,}5 > AB = 3$) nên $FD > CA$.' }] }] },
        goiY: ['Ghép cặp: $AB \\leftrightarrow DE$, $BC \\leftrightarrow EF$, $CA \\leftrightarrow FD$.', 'Tỉ số $\\frac{DE}{AB} = \\frac{4{,}5}{3} = 1{,}5$. Nhân các cạnh của $\\triangle ABC$ với $1{,}5$.'],
        loiGiai: ['Tỉ số đồng dạng của $\\triangle DEF$ với $\\triangle ABC$: $k = \\frac{DE}{AB} = \\frac{4{,}5}{3} = 1{,}5$.', '$EF = 1{,}5 \\cdot BC = 1{,}5 \\cdot 5 = 7{,}5$.', '$FD = 1{,}5 \\cdot CA = 1{,}5 \\cdot 6 = 9$.'] },
      { id: '33.6', muc: 2, de: "Cho $\\triangle ABC \\backsim \\triangle A'B'C'$ có $AB = 4$ cm, $A'B' = 10$ cm. Chu vi tam giác $ABC$ bằng $18$ cm. Tính chu vi tam giác $A'B'C'$ (cm).",
        dapAn: { kieu: 'so', gt: 45 },
        goiY: ["Mỗi cạnh của $\\triangle A'B'C'$ gấp $\\frac{A'B'}{AB}$ lần cạnh tương ứng của $\\triangle ABC$.", 'Cả ba cạnh cùng gấp lên như vậy thì chu vi cũng gấp lên đúng bấy nhiêu lần.'],
        loiGiai: ["$\\frac{A'B'}{AB} = \\frac{10}{4} = 2{,}5$: mỗi cạnh của $\\triangle A'B'C'$ gấp $2{,}5$ lần cạnh tương ứng.", "Cộng ba cạnh lại: chu vi $\\triangle A'B'C'$ cũng gấp $2{,}5$ lần chu vi $\\triangle ABC$.", "Chu vi $A'B'C' = 2{,}5 \\cdot 18 = 45$"],
        loiThuongGap: [{ gt: 7.2, giaiThich: "Em chia thay vì nhân ($18 : 2{,}5$). $A'B' = 10 > AB = 4$ nên tam giác $A'B'C'$ lớn hơn, chu vi phải lớn hơn $18$." }] },
      { id: '33.7', muc: 2, de: 'Trong hình, $MN \\parallel BC$, $AM = 3$, $MB = 2$, $BC = 10$. Tính $x = MN$.',
        hinh: h7,
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['$MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$.', 'Cạnh $MN$ ứng với $BC$, cạnh $AM$ ứng với **cả cạnh** $AB = 3 + 2 = 5$.'],
        loiGiai: ['Vì $MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$, suy ra $\\frac{MN}{BC} = \\frac{AM}{AB}$.', '$AB = 3 + 2 = 5$, nên $\\frac{x}{10} = \\frac{3}{5}$.', '$x = \\frac{3 \\cdot 10}{5} = 6$'],
        loiThuongGap: [{ gt: 15, giaiThich: 'Em dùng $\\frac{AM}{MB}$. Hai tam giác là $AMN$ và $ABC$: cạnh $AM$ ứng với cả cạnh $AB = 5$, không phải $MB$.' }] },
      { id: '33.8', muc: 2, de: 'Cho tam giác $ABC$ cân tại $A$ và tam giác $MNP$ cân tại $M$, biết $\\widehat{BAC} = \\widehat{NMP}$ và $AB = 2MN$. Biết $\\triangle MNP \\backsim \\triangle ABC$. Tìm tỉ số đồng dạng của $\\triangle MNP$ với $\\triangle ABC$.',
        dapAn: { kieu: 'so', gt: '1/2' },
        goiY: ['Tỉ số đồng dạng của $\\triangle MNP$ với $\\triangle ABC$ là $\\frac{MN}{AB}$.', '$AB = 2MN$ nghĩa là $MN$ bằng một nửa $AB$.'],
        loiGiai: ['$AB = 2MN$ nên $\\frac{MN}{AB} = \\frac{1}{2}$.', 'Tỉ số đồng dạng $k = \\frac{MN}{AB} = \\frac{1}{2}$'],
        loiThuongGap: [{ gt: 2, giaiThich: '$2$ là tỉ số của $\\triangle ABC$ với $\\triangle MNP$. Đề hỏi $\\triangle MNP$ (đứng trước) với $\\triangle ABC$: $\\frac{MN}{AB}$.' }] },
      { id: '33.9', muc: 2, de: 'Trong hình, $M$, $N$ là trung điểm của $AB$, $AC$; $P$, $Q$ là trung điểm của $AM$, $AN$. Trong hình có bao nhiêu cặp tam giác (phân biệt) đồng dạng?',
        hinh: h9,
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['$MN$ và $PQ$ là đường trung bình nên $MN \\parallel BC$, $PQ \\parallel MN$, do đó cả ba đoạn song song với nhau.', 'Có ba tam giác chung đỉnh $A$: $APQ$, $AMN$, $ABC$. Mỗi hai tam giác trong đó là một cặp.'],
        loiGiai: ['$MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$; $PQ \\parallel MN$ nên $\\triangle APQ \\backsim \\triangle AMN$; $PQ \\parallel BC$ nên $\\triangle APQ \\backsim \\triangle ABC$.', 'Số cặp tam giác đồng dạng $= 3$'],
        loiThuongGap: [{ gt: 2, giaiThich: 'Em quên cặp $\\triangle APQ \\backsim \\triangle ABC$ (tam giác nhỏ nhất và tam giác lớn nhất cũng đồng dạng).' }] },
      { id: '33.10', muc: 3, de: 'Để đo chiều cao $AB$ của cột đèn, bác Dương cắm cọc gỗ $CD$ cao $1{,}2$ m thẳng đứng. Bóng cọc do ánh đèn tạo ra dài $EC = 0{,}9$ m; khoảng cách từ đầu bóng $E$ đến chân cột đèn là $EB = 6$ m. Tính chiều cao $h$ của cột đèn (m).',
        hinh: hDen,
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Cọc và cột đèn cùng thẳng đứng nên $CD \\parallel BA$. Xét tam giác $EBA$.', 'Vì $CD \\parallel BA$ nên $\\triangle ECD \\backsim \\triangle EBA$, suy ra $\\frac{CD}{BA} = \\frac{EC}{EB}$.'],
        loiGiai: ['Cọc và cột cùng vuông góc với mặt đất nên $CD \\parallel BA$, do đó $\\triangle ECD \\backsim \\triangle EBA$.', '$\\frac{CD}{BA} = \\frac{EC}{EB}$, tức $\\frac{1{,}2}{h} = \\frac{0{,}9}{6}$.', '$h = \\frac{1{,}2 \\cdot 6}{0{,}9} = 8$ (m)'],
        loiThuongGap: [{ gt: 6.8, giaiThich: 'Em dùng $CB = 5{,}1$ m thay cho $EB = 6$ m. Cạnh tương ứng với $EC$ là **cả đoạn** $EB$ (cùng xuất phát từ $E$).' }] },
      { id: '33.11', muc: 3, de: "Cho $\\triangle A''B''C'' \\backsim \\triangle A'B'C'$ theo tỉ số $2$ và $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $\\frac{3}{4}$. Biết $AB = 8$ cm, tính $A''B''$ (cm).",
        dapAn: { kieu: 'so', gt: 12 },
        goiY: ["Tính $A'B'$ trước: $A'B' = \\frac{3}{4} \\cdot AB$.", "Rồi $A''B'' = 2 \\cdot A'B'$. (Hoặc dùng: $\\triangle A''B''C'' \\backsim \\triangle ABC$ theo tỉ số $2 \\cdot \\frac{3}{4}$.)"],
        loiGiai: ["$A'B' = \\frac{3}{4} \\cdot 8 = 6$ (cm).", "$A''B'' = 2 \\cdot 6 = 12$ (cm).", "Cách khác: tỉ số của $\\triangle A''B''C''$ với $\\triangle ABC$ là $2 \\cdot \\frac{3}{4} = \\frac{3}{2}$, nên $A''B'' = \\frac{3}{2} \\cdot 8 = 12$"],
        loiThuongGap: [{ gt: 21.33, giaiThich: "Em chia cho $\\frac{3}{4}$ thay vì nhân. $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $\\frac{3}{4}$ nghĩa là $A'B' = \\frac{3}{4} AB$." }] }
    ],
    timLoi: [
      { de: 'Cho $\\triangle ABC \\backsim \\triangle DEF$ với $AB = 4$, $AC = 5$, $DE = 6$. Bạn Minh tính một cạnh của $\\triangle DEF$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Vì $\\triangle ABC \\backsim \\triangle DEF$ nên $\\frac{AB}{DE} = \\frac{AC}{EF}$', '$\\frac{4}{6} = \\frac{5}{EF}$', '$EF = \\frac{5 \\cdot 6}{4} = 7{,}5$'],
        dongSai: 0,
        giaiThich: 'Ghép **sai cặp cạnh**. $AC$ gồm chữ thứ 1 và thứ 3 của $ABC$, nên nó ứng với $DF$ (chữ thứ 1 và thứ 3 của $DEF$), không phải $EF$.',
        sua: '$\\frac{AB}{DE} = \\frac{AC}{DF}$, tức $\\frac{4}{6} = \\frac{5}{DF}$, nên $DF = 7{,}5$. (Muốn tính $EF$ thì cần biết $BC$.)' },
      { de: "Cho $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $3$ và $AB = 12$ cm. Bạn Hà viết như sau. Dòng nào sai?",
        loiGiaiSai: ["Tỉ số $3$ nghĩa là $\\frac{A'B'}{AB} = 3$", "Nên $A'B' = 3 \\cdot 12 = 36$ (cm)", "Vậy $\\triangle ABC \\backsim \\triangle A'B'C'$ cũng theo tỉ số $3$"],
        dongSai: 2,
        giaiThich: "Khi đổi chỗ hai tam giác, tỉ số đồng dạng đổi thành **nghịch đảo**: $\\frac{AB}{A'B'} = \\frac{12}{36} = \\frac{1}{3}$.",
        sua: "Vậy $\\triangle ABC \\backsim \\triangle A'B'C'$ theo tỉ số $\\frac{1}{3}$." }
    ]
  });
})();
