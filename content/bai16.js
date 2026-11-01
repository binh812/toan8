// Bài 16 – Đường trung bình của tam giác (SGK Toán 8 KNTT, Tập 1, tr. 81–83)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hh = TOAN8.hh, hinh = TOAN8.hinhTinh, lerp = hh.lerp, giua = hh.giua, tg = hh.tg;
  function geo(o) { return { widget: 'geo', config: hinh(o) }; }

  // Tam giác ABC có M, N là trung điểm AB, AC (có vạch kí hiệu bằng nhau).
  function tgTrungBinh(a, b, c, them) {
    var T = tg(a, b, c);
    var o = { diem: { A: T.A, B: T.B, C: T.C, M: giua(T.A, T.B), N: giua(T.A, T.C) }, to: ['A', 'B', 'C'],
      canh: [['A', 'M', { vach: 1 }], ['M', 'B', { vach: 1 }], ['A', 'N', { vach: 2 }], ['N', 'C', { vach: 2 }], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]] };
    for (var k in them || {}) o[k] = them[k];
    return geo(o);
  }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function doGoc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.round(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI);
  }
  function vach(board, G, P, Q, n) { board.create('hatch', [G.seg(P, Q), n], { strokeColor: '#343a40', fixed: true }); }

  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8, 0);
    G.poly([A, B, C], { fillOpacity: 0.05, borders: { visible: false } });
    var M = G.mid(A, B, 'M'), N = G.mid(A, C, 'N');
    vach(board, G, A, M, 1); vach(board, G, M, B, 1); vach(board, G, A, N, 2); vach(board, G, N, C, 2);
    G.seg(B, C, { strokeColor: XANH, strokeWidth: 4 });
    G.seg(M, N, { strokeColor: TIM, strokeWidth: 5 });
    board.create('nonreflexangle', [A, M, N], { radius: 0.6, name: '', fillColor: CAM, strokeColor: CAM, fillOpacity: 0.3, fixed: true });
    board.create('nonreflexangle', [A, B, C], { radius: 0.6, name: '', fillColor: CAM, strokeColor: CAM, fillOpacity: 0.3, fixed: true });
    G.label(-0.8, 7.9, function () { return 'MN = ' + fmt(G.len(M, N)); });
    G.label(2.6, 7.9, function () { return 'BC = ' + fmt(G.len(B, C)); });
    G.label(6.0, 7.9, function () { return 'BC : 2 = ' + fmt(G.len(B, C) / 2); });
    G.label(-0.8, 7.1, function () { return 'góc AMN = ' + doGoc(A, M, N) + '°'; });
    G.label(4.0, 7.1, function () { return 'góc ABC = ' + doGoc(A, B, C) + '°'; });
  };

  var tinhChatBuild = function (board, G) {
    var A = G.pt('A', 2.5, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.05, borders: { visible: false } });
    var D = G.mid(A, B, 'D'), E = G.mid(A, C, 'E'), F = G.mid(B, C, 'F');
    vach(board, G, A, D, 1); vach(board, G, D, B, 1); vach(board, G, A, E, 2); vach(board, G, E, C, 2);
    G.seg(B, F, { strokeColor: CAM, strokeWidth: 5 }); G.seg(F, C, { strokeColor: XANH, strokeWidth: 5 });
    G.seg(E, F, { strokeColor: '#adb5bd', strokeWidth: 2, dash: 2 });
    G.seg(D, E, { strokeColor: CAM, strokeWidth: 5 });
    G.label(-0.8, 7.5, function () { return 'DE = ' + fmt(G.len(D, E)); });
    G.label(2.6, 7.5, function () { return 'BF = ' + fmt(G.len(B, F)); });
    G.label(6.0, 7.5, function () { return 'FC = ' + fmt(G.len(F, C)); });
  };

  var chuYBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.05, borders: { visible: false } });
    var M = G.mid(A, B, 'M');
    vach(board, G, A, M, 1); vach(board, G, M, B, 1);
    var BC = G.seg(B, C), AC = G.seg(A, C, { strokeColor: '#ced4da' });
    var N = G.inter(G.par(M, BC), AC, 'N');
    G.seg(A, N, { strokeColor: CAM, strokeWidth: 5 }); G.seg(N, C, { strokeColor: XANH, strokeWidth: 5 });
    G.seg(M, N, { strokeColor: TIM, strokeWidth: 4 });
    G.label(-0.8, 7.5, function () { return 'AN = ' + fmt(G.len(A, N)); });
    G.label(3.4, 7.5, function () { return 'NC = ' + fmt(G.len(N, C)); });
  };

  // ---------- Hình đề bài ----------
  var h3 = (function () {
    var T = tg(10, 8, 7);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, D: giua(T.A, T.B), E: giua(T.A, T.C), F: giua(T.B, T.C) }, to: ['A', 'B', 'C'],
      canh: [['A', 'D', { vach: 1 }], ['D', 'B', { vach: 1 }], ['A', 'E', { vach: 2 }], ['E', 'C', { vach: 2 }], ['B', 'F', { vach: 3 }], ['F', 'C', { vach: 3 }],
        ['D', 'E', { mau: TIM }], ['E', 'F', { mau: TIM }], ['D', 'F', { mau: TIM }], ['A', 'F', { mau: CAM, net: 2 }]] });
  })();

  var h5 = (function () {
    var T = tg(10, 12, 8);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, M: giua(T.A, T.B), N: giua(T.A, T.C), P: giua(T.B, T.C) }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM }], ['N', 'P', { mau: TIM }], ['P', 'M', { mau: TIM }]] });
  })();

  var h6 = geo({ diem: { A: [0, 0], B: [0, 8], C: [6, 0], M: [0, 4], N: [3, 4] }, to: ['A', 'B', 'C'],
    canh: [['A', 'B'], ['B', 'C'], ['A', 'C'], ['M', 'N', { mau: TIM }]],
    goc: [['B', 'M', 'N', { mau: '#495057', r: 0.6 }], ['B', 'A', 'C', { mau: '#495057', r: 0.6 }]],
    nhan: [['B', 'M', '4'], ['M', 'A', '4'], ['B', 'N', '5'], ['M', 'N', '3', true, 0.6]] });

  var h7 = (function () {
    var k = 1 / 40, T = tg(260 * k, 360 * k, 240 * k), Pp = giua(T.A, T.B), Q = giua(T.A, T.C);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, P: Pp, Q: Q },
      canh: [['A', 'B', { net: 2 }], ['A', 'C', { net: 2 }], ['B', 'C', { net: 2 }], ['P', 'Q', { mau: TIM, day: 3 }]],
      nhan: [['A', 'P', '120 m'], ['P', 'B', '120 m'], ['A', 'Q', '180 m'], ['Q', 'C', '180 m'], ['B', 'C', '260 m']],
      them: function (board) {
        // hai tiêu điểm nằm trong đoạn PQ, elip đi qua P (và đối xứng qua Q) nên P, Q nằm đúng trên bờ hồ
        var Mx = (Pp[0] + Q[0]) / 2, My = (Pp[1] + Q[1]) / 2;
        var F1 = [Mx + 0.7 * (Pp[0] - Mx), My + 0.7 * (Pp[1] - My)], F2 = [Mx + 0.7 * (Q[0] - Mx), My + 0.7 * (Q[1] - My)];
        board.create('ellipse', [F1, F2, Pp],
          { fillColor: '#74c0fc', fillOpacity: 0.35, strokeColor: '#74c0fc', fixed: true, highlight: false });
      },
      ghiChu: 'P, Q ở hai bờ hồ' });
  })();

  var h10 = geo({ diem: { A: [1.5, 5], B: [7.5, 5], C: [10, 0], D: [0, 0], E: [0.75, 2.5], F: [8.75, 2.5], K: [5.75, 2.5] },
    canh: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C', { mau: '#adb5bd', net: 2 }], ['E', 'K', { mau: TIM, day: 4 }], ['K', 'F', { mau: CAM, day: 4 }]],
    nhan: [['A', 'B', '6'], ['D', 'C', '10']], lechTen: { K: [0, -16] } });

  TOAN8.bai({
    id: 16, ten: 'Đường trung bình của tam giác', sgk: { tap: 1, trang: 81 },
    khamPha: {
      nhiemVu: '$M$ là trung điểm của $AB$, $N$ là trung điểm của $AC$. Đoạn tím $MN$ nối hai trung điểm đó.\n\nEm hãy **kéo các đỉnh** $A$, $B$, $C$ và quan sát: độ dài $MN$ so với $BC$ thế nào? Hai góc tô màu $\\angle AMN$ và $\\angle ABC$ thì sao?',
      widget: 'geo',
      config: { bbox: [-1, 8.4, 10, -0.8], build: khamPhaBuild },
      cauHoi: {
        de: 'Dù tam giác thay đổi, em thấy độ dài $MN$ luôn bằng bao nhiêu?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['$MN = \\frac{1}{2}BC$', '$MN = BC$', '$MN = 2BC$', 'Không có quy luật'] },
        goiY: ['So số ở ô "MN" với ô "BC : 2".'],
        loiGiai: ['$MN$ luôn bằng **một nửa** $BC$. Hai góc đồng vị $\\angle AMN = \\angle ABC$ nên $MN \\parallel BC$. Đoạn $MN$ gọi là **đường trung bình** của tam giác.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Đường trung bình của tam giác',
        noiDung: '**Đường trung bình của tam giác** là đoạn thẳng nối **trung điểm hai cạnh** của tam giác.\n\nMỗi tam giác có ba đường trung bình.' },
      { loai: 'dinhLi', tieuDe: 'Tính chất đường trung bình',
        noiDung: 'Đường trung bình của tam giác **song song** với cạnh thứ ba và **bằng nửa** cạnh đó.\n\n**GT:** $\\triangle ABC$, $AD = DB$, $AE = EC$ ($D \\in AB$, $E \\in AC$); $F$ là trung điểm của $BC$.\n\n**KL:** $DE \\parallel BC$; $$\\ca{DE} = \\frac{1}{2}BC = \\ca{BF}.$$' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8, 10, -0.8], build: tinhChatBuild },
        chuThich: '$F$ là trung điểm $BC$. Kéo các đỉnh: đoạn cam $DE$ luôn dài bằng đoạn cam $BF$ (một nửa $BC$). Tứ giác $DEFB$ là hình bình hành.' },
      { loai: 'text', tieuDe: 'Vì sao?',
        noiDung: 'Vì $\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{2}$ nên $DE \\parallel BC$ (định lí Thalès đảo). Tương tự $EF \\parallel AB$. Tứ giác $DEFB$ có các cặp cạnh đối song song nên là hình bình hành, suy ra $DE = BF = \\frac{1}{2}BC$.' },
      { loai: 'chuY', noiDung: 'Trong một tam giác, nếu một đường thẳng đi qua **trung điểm một cạnh** và **song song với cạnh thứ hai** thì nó đi qua **trung điểm của cạnh thứ ba**.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8, 10, -0.8], build: chuYBuild },
        chuThich: '$M$ là trung điểm $AB$, đường tím qua $M$ song song với $BC$. Kéo các đỉnh: luôn có $AN = NC$.' },
      { loai: 'chuY', noiDung: '**Hay nhầm 1:** đường trung bình bằng **nửa** cạnh thứ ba, không phải gấp đôi: $MN = \\frac{1}{2}BC$, tức $BC = 2MN$.\n\n**Hay nhầm 2:** đường trung bình nối trung điểm **hai cạnh**. Đoạn nối **một đỉnh** với trung điểm cạnh đối diện là **đường trung tuyến**, không phải đường trung bình.\n\n**Mẹo:** ba đường trung bình tạo thành một tam giác có chu vi bằng **nửa** chu vi tam giác ban đầu.' }
    ],
    viDu: [
      { de: 'Cho tam giác $ABC$ với $M$, $N$ lần lượt là trung điểm của $AB$, $AC$ và $BC = 14$ cm. Tính $MN$.', buoc: [
        { lam: '$MN$ là đường trung bình của $\\triangle ABC$', vi: '$MN$ nối trung điểm hai cạnh $AB$ và $AC$.' },
        { lam: '$MN = \\frac{1}{2}BC = \\frac{1}{2} \\cdot 14 = 7$ (cm)', vi: 'Đường trung bình bằng nửa cạnh thứ ba.' } ] },
      { de: 'Cho tam giác $ABC$, $D$ và $E$ lần lượt là trung điểm của $AB$, $AC$, biết $DE = 4{,}5$ cm. Tính $BC$.', buoc: [
        { lam: '$DE$ là đường trung bình nên $DE = \\frac{1}{2}BC$', vi: 'Tính chất đường trung bình.' },
        { lam: '$BC = 2 \\cdot DE = 2 \\cdot 4{,}5 = 9$ (cm)', vi: 'Cạnh thứ ba gấp đôi đường trung bình.' } ] },
      { de: 'Tam giác $ABC$ có $AB = 6$ cm, $BC = 8$ cm, $CA = 10$ cm. Gọi $M$, $N$, $P$ là trung điểm của $AB$, $AC$, $BC$. Tính chu vi tam giác $MNP$.', buoc: [
        { lam: '$MN = \\frac{1}{2}BC = 4$; $NP = \\frac{1}{2}AB = 3$; $MP = \\frac{1}{2}AC = 5$', vi: 'Mỗi cạnh của $\\triangle MNP$ là một đường trung bình, bằng nửa cạnh **song song** với nó.' },
        { lam: 'Chu vi $\\triangle MNP = 4 + 3 + 5 = 12$ (cm)', vi: 'Bằng nửa chu vi $\\triangle ABC$ ($24 : 2 = 12$).' } ] }
    ],
    viDuMo: [
      { de: 'Hai điểm $B$, $C$ bị một hồ nước ngăn cách. Người ta chọn điểm $A$ rồi đánh dấu $D$, $E$ là trung điểm của $AB$, $AC$, đo được $DE = 350$ m. Tính khoảng cách $BC$.', buoc: [
        { lam: '$DE$ là đường trung bình của $\\triangle ABC$', vi: '$D$, $E$ là trung điểm của hai cạnh $AB$, $AC$.' },
        { lam: '$BC = 2 \\cdot DE = 2 \\cdot 350 = 700$ (m)', vi: 'Em hãy tính $BC$ (m):', an: true,
          dapAn: { kieu: 'so', gt: 700 },
          loiThuongGap: [{ gt: 175, giaiThich: 'Ngược rồi: $DE$ mới là một nửa của $BC$, nên $BC = 2 \\cdot DE$.' }] } ] },
      { de: 'Cho tam giác $ABC$ có $AC = 10$ cm. Qua trung điểm $M$ của $AB$ kẻ đường thẳng song song với $BC$, cắt $AC$ tại $N$. Tính $AN$.', buoc: [
        { lam: 'Đường thẳng qua trung điểm $M$ của $AB$, song song với $BC$ nên đi qua trung điểm của $AC$', vi: 'Dùng chú ý trong bài.' },
        { lam: '$AN = \\frac{1}{2}AC = 5$ (cm)', vi: 'Em hãy tính $AN$:', an: true, dapAn: { kieu: 'so', gt: 5 } } ] }
    ],
    baiTap: [
      { id: '16.1', muc: 1, de: 'Trong hình, $M$, $N$ là trung điểm của $AB$, $AC$ và $BC = 12$. Tính $x = MN$.',
        hinh: tgTrungBinh(12, 10, 9, { nhan: [['B', 'C', '12'], ['M', 'N', 'x', true, 0.7]] }),
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['$MN$ nối trung điểm hai cạnh, là đường trung bình.', 'Đường trung bình bằng nửa cạnh thứ ba: $MN = \\frac{1}{2}BC$.'],
        loiGiai: ['$MN$ là đường trung bình của $\\triangle ABC$.', '$x = \\frac{1}{2} \\cdot 12 = 6$'],
        loiThuongGap: [{ gt: 24, giaiThich: 'Em nhân đôi rồi. Đường trung bình **bằng nửa** cạnh thứ ba: $MN = \\frac{1}{2}BC$.' }] },
      { id: '16.2', muc: 1, de: 'Cho tam giác $ABC$, $D$ và $E$ là trung điểm của $AB$ và $AC$, $DE = 5{,}5$ cm. Tính $BC$ (cm).',
        dapAn: { kieu: 'so', gt: 11 },
        goiY: ['$DE$ là đường trung bình: $DE = \\frac{1}{2}BC$.', 'Vậy $BC = 2 \\cdot DE$.'],
        loiGiai: ['$DE = \\frac{1}{2}BC$ nên $BC = 2 \\cdot DE$', '$BC = 2 \\cdot 5{,}5 = 11$'],
        loiThuongGap: [{ gt: 2.75, giaiThich: 'Em chia đôi $DE$. Ở đây $BC$ là cạnh lớn, gấp đôi đường trung bình.' }] },
      { id: '16.3', muc: 1, de: 'Trong hình, $D$, $E$, $F$ lần lượt là trung điểm của $AB$, $AC$, $BC$. Đoạn nào **không phải** là đường trung bình của tam giác $ABC$?',
        hinh: h3,
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['$DE$', '$EF$', '$DF$', '$AF$'] },
        goiY: ['Đường trung bình nối trung điểm của **hai cạnh**.', '$AF$ nối đỉnh $A$ với trung điểm $F$: đó là loại đường gì?'],
        loiGiai: ['$DE$, $EF$, $DF$ đều nối trung điểm hai cạnh nên là đường trung bình.', '$AF$ nối đỉnh $A$ với trung điểm cạnh đối diện, là **đường trung tuyến**, không phải đường trung bình.'] },
      { id: '16.4', muc: 1, de: 'Cho $MN$ là đường trung bình của tam giác $ABC$ ($M \\in AB$, $N \\in AC$). Khẳng định "$MN \\parallel BC$ và $MN = 2BC$" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Nhớ lại tính chất: song song với cạnh thứ ba và bằng ... cạnh đó.', 'Đường trung bình ngắn hơn hay dài hơn cạnh thứ ba?'],
        loiGiai: ['$MN \\parallel BC$ là đúng, nhưng $MN = \\frac{1}{2}BC$ chứ không phải $2BC$.', 'Vậy khẳng định **sai**.'] },
      { id: '16.5', muc: 2, de: 'Tam giác $ABC$ có $AB = 8$ cm, $BC = 10$ cm, $CA = 12$ cm. $M$, $N$, $P$ là trung điểm của $AB$, $AC$, $BC$. Tính chu vi tam giác $MNP$ (cm).',
        hinh: h5,
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Mỗi cạnh của $\\triangle MNP$ là đường trung bình, bằng nửa một cạnh của $\\triangle ABC$.', '$MN = \\frac{1}{2}BC$, $NP = \\frac{1}{2}AB$, $MP = \\frac{1}{2}AC$.'],
        loiGiai: ['$MN = \\frac{1}{2}BC = 5$; $NP = \\frac{1}{2}AB = 4$; $MP = \\frac{1}{2}AC = 6$.', 'Chu vi $\\triangle MNP = 5 + 4 + 6 = 15$'],
        loiThuongGap: [
          { gt: 30, giaiThich: '$30$ là chu vi $\\triangle ABC$. Chu vi $\\triangle MNP$ chỉ bằng một nửa.' },
          { gt: 60, giaiThich: 'Mỗi đường trung bình bằng **nửa** cạnh tương ứng, không phải gấp đôi.' }] },
      { id: '16.6', muc: 2, de: 'Trong hình, tam giác $ABC$ vuông tại $A$, $M$ là trung điểm của $AB$ ($BM = MA = 4$), $MN \\perp AB$ ($N \\in BC$), $BN = 5$, $MN = 3$. Tính $NC$ và $AC$.',
        hinh: h6,
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'so', gt: 5, nhan: '$NC =$', loiThuongGap: [{ gt: 10, giaiThich: '$10$ là cả cạnh $BC$. $N$ là trung điểm nên $NC = BN$.' }] },
          { kieu: 'so', gt: 6, nhan: '$AC =$', loiThuongGap: [{ gt: 1.5, giaiThich: '$MN$ là đường trung bình nên $AC = 2 \\cdot MN$, không phải $MN : 2$.' }] }] },
        goiY: ['$MN \\perp AB$ và $AC \\perp AB$ nên $MN \\parallel AC$. Đường thẳng qua trung điểm $M$ của $AB$, song song với $AC$ thì đi qua trung điểm của $BC$.', 'Vậy $N$ là trung điểm $BC$ và $MN$ là đường trung bình: $AC = 2MN$.'],
        loiGiai: ['$MN \\perp AB$, $AC \\perp AB$ nên $MN \\parallel AC$.', '$M$ là trung điểm $AB$, $MN \\parallel AC$ nên $N$ là trung điểm $BC$: $NC = BN = 5$.', '$MN$ là đường trung bình nên $AC = 2 \\cdot MN = 6$.'] },
      { id: '16.7', muc: 2, de: 'Bác Mến muốn biết khoảng cách giữa hai điểm $P$, $Q$ ở hai bờ hồ. Bác chọn các vị trí $A$, $B$, $C$ và đo được $AP = PB = 120$ m, $AQ = QC = 180$ m, $BC = 260$ m (xem hình). Tính $PQ$ (m).',
        hinh: h7,
        dapAn: { kieu: 'so', gt: 130 },
        goiY: ['$P$ là trung điểm $AB$, $Q$ là trung điểm $AC$. Vậy $PQ$ là gì của $\\triangle ABC$?', '$PQ = \\frac{1}{2}BC$.'],
        loiGiai: ['$P$, $Q$ là trung điểm của $AB$, $AC$ nên $PQ$ là đường trung bình của $\\triangle ABC$.', '$PQ = \\frac{1}{2} \\cdot 260 = 130$ (m)'],
        loiThuongGap: [{ gt: 520, giaiThich: 'Đường trung bình bằng **nửa** cạnh thứ ba: $PQ = 260 : 2$.' }, { gt: 150, giaiThich: 'Em lấy trung bình cộng $(120 + 180) : 2$. Hãy dùng tính chất đường trung bình: $PQ = \\frac{1}{2}BC$.' }] },
      { id: '16.8', muc: 2, de: 'Cho tam giác $ABC$ có $AC = 9$ cm, $M$ là trung điểm của $AB$. Đường thẳng qua $M$ song song với $BC$ cắt $AC$ tại $N$. Tính $x = AN$ (cm).',
        // không vạch AN = NC: đó chính là điều em phải suy ra
        hinh: tgTrungBinh(8, 9, 7, { nhan: [['A', 'N', 'x', false, 1.6]],
          canh: [['A', 'M', { vach: 1 }], ['M', 'B', { vach: 1 }], ['A', 'N'], ['N', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]] }),
        dapAn: { kieu: 'so', gt: '9/2' },
        goiY: ['Đường thẳng qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba.', 'Vậy $N$ là trung điểm của $AC$.'],
        loiGiai: ['$M$ là trung điểm $AB$, $MN \\parallel BC$ nên $N$ là trung điểm $AC$.', '$x = \\frac{1}{2} \\cdot 9 = 4{,}5$'],
        loiThuongGap: [{ gt: 18, giaiThich: '$N$ là trung điểm của $AC$, nên $AN$ là một nửa $AC$.' }] },
      { id: '16.9', muc: 3, de: 'Tam giác $ABC$ có $AB = 10$ cm, $AC = 12$ cm, $BC = 16$ cm. $M$, $N$ là trung điểm của $AB$, $AC$. Tính chu vi tứ giác $BMNC$ (cm).',
        hinh: tgTrungBinh(16, 12, 10),
        dapAn: { kieu: 'so', gt: 35 },
        goiY: ['Chu vi $BMNC = BM + MN + NC + CB$.', '$BM = \\frac{1}{2}AB$, $NC = \\frac{1}{2}AC$, $MN = \\frac{1}{2}BC$.'],
        loiGiai: ['$BM = 5$, $NC = 6$, $MN = \\frac{1}{2}BC = 8$.', 'Chu vi $BMNC = 5 + 8 + 6 + 16 = 35$'],
        loiThuongGap: [{ gt: 19, giaiThich: 'Em quên cạnh đáy $BC = 16$. Chu vi gồm cả bốn cạnh $BM$, $MN$, $NC$, $CB$.' },
          { gt: 59, giaiThich: 'Kiểm tra lại $MN$: đường trung bình bằng **nửa** $BC$, tức $8$ cm.' }] },
      { id: '16.10', muc: 3, de: 'Cho tứ giác $ABCD$ có $AB = 6$ cm, $CD = 10$ cm. $E$, $F$, $K$ lần lượt là trung điểm của $AD$, $BC$, $AC$. Tính $EK + KF$ (cm).',
        hinh: h10,
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Xét $\\triangle ACD$: $E$, $K$ là trung điểm của $AD$, $AC$. Xét $\\triangle CAB$: $K$, $F$ là trung điểm của $CA$, $CB$.', '$EK = \\frac{1}{2}CD$, $KF = \\frac{1}{2}AB$.'],
        loiGiai: ['Trong $\\triangle ACD$, $EK$ là đường trung bình nên $EK = \\frac{1}{2}CD = 5$.', 'Trong $\\triangle ABC$, $KF$ là đường trung bình nên $KF = \\frac{1}{2}AB = 3$.', '$EK + KF = 5 + 3 = 8$'],
        loiThuongGap: [{ gt: 16, giaiThich: '$16 = AB + CD$. Mỗi đường trung bình chỉ bằng **nửa** cạnh song song với nó.' }] }
    ],
    timLoi: [
      { de: 'Cho tam giác $ABC$, $M$ và $N$ là trung điểm của $AB$ và $AC$, $BC = 8$ cm. Bạn Tùng tính $MN$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$MN$ là đường trung bình của $\\triangle ABC$', 'Nên $MN = 2 \\cdot BC = 2 \\cdot 8 = 16$ (cm)'],
        dongSai: 1,
        giaiThich: 'Đường trung bình bằng **nửa** cạnh thứ ba, không phải gấp đôi. Đường trung bình nối hai trung điểm nên ngắn hơn $BC$.',
        sua: '$MN = \\frac{1}{2}BC = \\frac{1}{2} \\cdot 8 = 4$ (cm)' },
      { de: 'Cho tam giác $ABC$ có $M$ là trung điểm của $BC$, $AB = 10$ cm. Bạn Hà tính $AM$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$AM$ là đường trung bình của $\\triangle ABC$', 'Nên $AM = \\frac{1}{2}AB = 5$ (cm)'],
        dongSai: 0,
        giaiThich: '$AM$ nối **đỉnh** $A$ với trung điểm cạnh đối diện nên là **đường trung tuyến**, không phải đường trung bình (đường trung bình nối trung điểm **hai cạnh**). Với dữ kiện này không tính được $AM$.',
        sua: '$AM$ là đường trung tuyến của $\\triangle ABC$; chưa đủ dữ kiện để tính $AM$.' }
    ]
  });
})();
