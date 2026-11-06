// Bài 34 – Ba trường hợp đồng dạng của hai tam giác (SGK Toán 8 KNTT, Tập 2, tr. 83–92, gồm Luyện tập chung)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5', XAM = '#868e96';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hh = TOAN8.hh, geo = TOAN8.hinhGeo, lerp = hh.lerp, tg = hh.tg;
  function rad(d) { return d * Math.PI / 180; }
  // Tam giác có đáy PQ dài a nằm ngang (P ở (dx, 0)) và hai góc ở đáy gP, gQ (độ): trả về đỉnh trên.
  function dinhTren(a, gP, gQ, dx) {
    var t = a * Math.sin(rad(gQ)) / Math.sin(rad(180 - gP - gQ)); // độ dài cạnh từ P tới đỉnh
    return [dx + t * Math.cos(rad(gP)), t * Math.sin(rad(gP))];
  }
  // Giao điểm hai đường thẳng P1P2 và P3P4.
  function giao(P1, P2, P3, P4) {
    var d = (P1[0] - P2[0]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] - P4[0]);
    var a = P1[0] * P2[1] - P1[1] * P2[0], b = P3[0] * P4[1] - P3[1] * P4[0];
    return [(a * (P3[0] - P4[0]) - (P1[0] - P2[0]) * b) / d, (a * (P3[1] - P4[1]) - (P1[1] - P2[1]) * b) / d];
  }
  // Ghi số đo góc (chữ) ở gần đỉnh V, lùi vào trong tam giác về phía điểm G.
  function ghiGoc(V, Gc, chu, mau) {
    return function (board, G) {
      G.label(V[0] + (Gc[0] - V[0]) * 0.38, V[1] + (Gc[1] - V[1]) * 0.38, chu, { anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: mau || CAM });
    };
  }
  function tam(P, Q, R) { return [(P[0] + Q[0] + R[0]) / 3, (P[1] + Q[1] + R[1]) / 3]; }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function goc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  function danhGoc(board, P, O, Q, mau, r) {
    return board.create('nonreflexangle', [P, O, Q], { radius: r || 0.55, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.3, fixed: true, highlight: false });
  }
  function diemPhu(board, ten, fx, fy) {
    return board.create('point', [fx, fy], { name: ten, size: 3, color: TIM, fixed: true, showInfobox: false,
      label: { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700', strokeColor: TIM } });
  }
  function truot(board, y, ten, min, gt, max, buoc) {
    return board.create('slider', [[0, y], [4.5, y], [min, gt, max]], { name: ten, snapWidth: buoc, digits: 1, label: { fontSize: 17, strokeColor: TIM } });
  }

  // Khám phá: kéo A' (bắt lưới 0,5) để tam giác A'B'C' đồng dạng với ABC.
  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 1, 3, { fixed: true }), B = G.pt('B', 0, 0, { fixed: true }), C = G.pt('C', 4, 0, { fixed: true });
    var k = truot(board, -1.3, 'k', 0.5, 1.5, 2, 0.5);
    var B1 = diemPhu(board, "B'", 6, 0), C1 = diemPhu(board, "C'", function () { return 6 + 4 * k.Value(); }, 0);
    var A1 = board.create('point', [8.5, 3], { name: "A'", size: 7, color: '#e8590c', snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5, showInfobox: false,
      label: { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700' } });
    function r1() { return G.len(A1, B1) / G.len(A, B); }
    function r2() { return G.len(A1, C1) / G.len(A, C); }
    function r3() { return G.len(B1, C1) / G.len(B, C); }
    function dd() { return Math.abs(r1() - r3()) < 0.01 && Math.abs(r2() - r3()) < 0.01; }
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: function () { return dd() ? LA : TIM; }, fillOpacity: 0.15,
      borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    danhGoc(board, A, B, C, XANH); danhGoc(board, A1, B1, C1, XANH);
    danhGoc(board, A, C, B, CAM); danhGoc(board, A1, C1, B1, CAM);
    G.label(-0.7, 10.2, function () { return "A'B' : AB = " + fmt(r1()); });
    G.label(-0.7, 9.4, function () { return "A'C' : AC = " + fmt(r2()); });
    G.label(-0.7, 8.6, function () { return "B'C' : BC = " + fmt(r3()); });
    G.label(-0.7, 7.6, function () { return 'góc B = ' + Math.round(goc(A, B, C)) + "°, góc B' = " + Math.round(goc(A1, B1, C1)) + '°'; }, { strokeColor: XANH });
    G.label(-0.7, 6.8, function () { return 'góc C = ' + Math.round(goc(A, C, B)) + "°, góc C' = " + Math.round(goc(A1, C1, B1)) + '°'; }, { strokeColor: CAM });
    G.label(-0.7, 5.8, function () { return dd() ? "Đồng dạng rồi! Ba tỉ số bằng nhau" : "Kéo A' tới chỗ ba tỉ số bằng nhau"; },
      { strokeColor: function () { return dd() ? LA : XAM; } });
  };

  // Cạnh – góc – cạnh: góc A' luôn bằng góc A; hai thanh trượt là hai tỉ số A'B':AB và A'C':AC.
  var cgcBuild = function (board, G) {
    var A = G.pt('A', 1, 3.5), B = G.pt('B', 0, 0), C = G.pt('C', 4.5, 0);
    var p = truot(board, -1.2, "A'B':AB", 0.5, 1.2, 2, 0.1), q = truot(board, -2.1, "A'C':AC", 0.5, 1.6, 2, 0.1);
    var ax = 8.5, ay = 7;
    var A1 = diemPhu(board, "A'", ax, ay);
    var B1 = diemPhu(board, "B'", function () { return ax + p.Value() * (B.X() - A.X()); }, function () { return ay + p.Value() * (B.Y() - A.Y()); });
    var C1 = diemPhu(board, "C'", function () { return ax + q.Value() * (C.X() - A.X()); }, function () { return ay + q.Value() * (C.Y() - A.Y()); });
    function dd() { return Math.abs(p.Value() - q.Value()) < 0.001; }
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: function () { return dd() ? LA : TIM; }, fillOpacity: 0.15, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    danhGoc(board, B, A, C, CAM); danhGoc(board, B1, A1, C1, CAM);
    G.label(-0.7, 9.4, function () { return "B'C' : BC = " + fmt(G.len(B1, C1) / G.len(B, C)); });
    G.label(-0.7, 8.6, function () { return 'góc A = ' + Math.round(goc(B, A, C)) + "°, góc A' = " + Math.round(goc(B1, A1, C1)) + '°'; }, { strokeColor: CAM });
    G.label(-0.7, 7.6, function () { return dd() ? 'Hai tỉ số bằng nhau → tỉ số thứ ba cũng bằng!' : 'Chỉnh hai thanh trượt cho bằng nhau'; },
      { strokeColor: function () { return dd() ? LA : XAM; } });
  };

  // Góc – góc: B'C' tuỳ ý (thanh trượt), hai góc ở B', C' chép từ B, C.
  var ggBuild = function (board, G) {
    var A = G.pt('A', 1.2, 3.5), B = G.pt('B', 0, 0), C = G.pt('C', 4.5, 0);
    var L = truot(board, -1.3, "B'C'", 2, 7, 9, 0.5);
    var bx = 6.5;
    function m() { return L.Value() / G.len(B, C); }
    function anh(P, ten) { return diemPhu(board, ten, function () { return bx + m() * (P.X() - B.X()); }, function () { return m() * (P.Y() - B.Y()); }); }
    var A1 = anh(A, "A'"), B1 = anh(B, "B'"), C1 = anh(C, "C'");
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.poly([A1, B1, C1], { fillColor: TIM, fillOpacity: 0.12, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    danhGoc(board, A, B, C, XANH); danhGoc(board, A1, B1, C1, XANH);
    danhGoc(board, A, C, B, CAM); danhGoc(board, A1, C1, B1, CAM);
    G.label(-0.7, 10.2, function () { return "A'B' : AB = " + fmt(G.len(A1, B1) / G.len(A, B)); });
    G.label(-0.7, 9.4, function () { return "A'C' : AC = " + fmt(G.len(A1, C1) / G.len(A, C)); });
    G.label(-0.7, 8.6, function () { return "B'C' : BC = " + fmt(G.len(B1, C1) / G.len(B, C)); });
  };

  // ---------- Hình tĩnh cho bài tập ----------
  var h4 = (function () {
    var A = dinhTren(4, 60, 50, 0), Ac = [0, 0], Bc = [4, 0];
    var N = [6, 0], P = [10.5, 0], M = dinhTren(4.5, 60, 50, 6); // MNP: N = 60°, P = 50°, M = 70°
    var gA = tam(A, Ac, Bc), gM = tam(M, N, P);
    return geo({ diem: { A: Ac, B: Bc, C: A, N: N, P: P, M: M }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['M', 'N', { mau: TIM }], ['N', 'P', { mau: TIM }], ['P', 'M', { mau: TIM }]],
      them: function (board, G) {
        ghiGoc(Ac, gA, '60°')(board, G); ghiGoc(Bc, gA, '50°')(board, G);
        ghiGoc(M, gM, '70°', TIM)(board, G); ghiGoc(N, gM, '60°', TIM)(board, G);
      } });
  })();
  var h7 = (function () {
    var T = tg(13.5, 12, 9), M = lerp(T.A, T.B, 8 / 9), N = lerp(T.A, T.C, 6 / 12);
    return geo({ diem: { A: T.A, B: T.B, C: T.C, M: M, N: N }, to: ['A', 'B', 'C'],
      canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]],
      nhan: [['A', 'B', 'AB = 9', false, 1.6], ['A', 'C', 'AC = 12', false, 1.7], ['B', 'C', '13,5'], ['A', 'M', '8', true], ['A', 'N', '6', true], ['M', 'N', 'x', false, 0.9, TIM]],
      lechTen: { M: [-16, 4], N: [16, 6] } });
  })();
  var h8 = (function () {
    var x = 11 / 6, h = Math.sqrt(16 - x * x);
    var D = [0, 0], C = [12, 0], A = [x, h], B = [x + 3, h];
    return geo({ diem: { A: A, B: B, C: C, D: D },
      canh: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['B', 'D', { mau: TIM }]],
      goc: [['D', 'A', 'B', { mau: CAM, r: 0.7 }], ['D', 'B', 'C', { mau: CAM, r: 0.7 }]],
      nhan: [['A', 'B', '3'], ['A', 'D', '4'], ['B', 'D', '6', true, 0.8, TIM], ['B', 'C', 'x'], ['D', 'C', 'y']] });
  })();
  var h9 = (function () {
    var A = [0, 0], C = [4, 0], D = [9, 0], B = [6 * Math.cos(rad(38)), 6 * Math.sin(rad(38))];
    return geo({ diem: { A: A, B: B, C: C, D: D },
      canh: [['A', 'D'], ['A', 'B'], ['B', 'C'], ['B', 'D']],
      goc: [['A', 'B', 'C', { mau: CAM, r: 0.9 }], ['A', 'D', 'B', { mau: CAM, r: 1.2 }]],
      nhan: [['A', 'C', '4', true], ['C', 'D', '5', true], ['A', 'B', 'x']] });
  })();
  var h10 = (function () {
    var I = [2, 2.4];
    return geo({ diem: { P: [0, 0], Q: [0, 4], R: [5, 0], S: [5, 6], I: I, H: [2, 0] },
      canh: [['P', 'R'], ['P', 'Q', { mau: '#7f4f24', day: 5 }], ['R', 'S', { mau: '#7f4f24', day: 5 }],
        ['Q', 'R', { mau: '#f59f00', day: 2 }], ['S', 'P', { mau: '#f59f00', day: 2 }], ['I', 'H', { mau: TIM, net: 2 }]],
      nhan: [['P', 'Q', '4 m'], ['R', 'S', '6 m', true], ['I', 'H', 'h', true, 0.6, TIM]],
      lechTen: { I: [0, 16], H: [0, -16] } });
  })();
  var h12 = (function () {
    var ux = [Math.cos(rad(38)), Math.sin(rad(38))], uy = [Math.cos(rad(-8)), Math.sin(rad(-8))];
    function tren(u, t) { return [u[0] * t, u[1] * t]; }
    var A = tren(ux, 3), B = tren(ux, 8), C = tren(uy, 4), D = tren(uy, 6), E = giao(A, D, B, C);
    return geo({ diem: { O: [0, 0], A: A, B: B, C: C, D: D, E: E },
      ve: [[[0, 0], tren(ux, 10), { mau: '#343a40', day: 2 }], [[0, 0], tren(uy, 10), { mau: '#343a40', day: 2 }]],
      canh: [['A', 'D', { mau: XANH }], ['B', 'C', { mau: CAM }]],
      nhan: [['O', 'A', 'OA = 3', false, 1.4], ['O', 'C', 'OC = 4', false, 1.4]],
      lechTen: { E: [16, 4] }, ghiChu: 'OB = 8, OD = 6' });
  })();

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  function an(s, anChu) { return { s: s, an: true, anChu: anChu }; }
  var GOC3 = ['--a', '--b', '--cc'];
  function haiTG(h1, h2, them) {
    h2.dat = Object.assign({ sau: 0 }, h2.dat || {});
    return { ten: 'trungKhit', tuyChon: Object.assign({ hinh: [h1, h2], di: [{ tu: 0, toi: 1, neo: 1, mau: '--a' }] }, them || {}) };
  }
  // Ba cạnh (bất kì thứ tự) → [d01, d12, d20] với cạnh lớn nhất làm đáy
  function ba(x) { var s = x.slice().sort(function (p, q) { return p - q; }); return [s[0], s[2], s[1]]; }
  function chu(x) { return String(x).replace('.', ','); }
  // 34.7: AB = 9, AC = 12, BC = 13,5; M trên AB (AM = 8), N trên AC (AN = 6). Tam giác ANM lật qua phân giác góc A rồi phóng 1,5 lần
  var H7 = tg(13.5, 12, 9);
  var hinh347 = { ten: 'trungKhit', moTa: 'Tam giác ABC với M trên AB, N trên AC. Tam giác AMN nằm ngược: lật nó qua tia phân giác góc A rồi phóng lên thì trùng tam giác ABC.',
    tuyChon: { hinh: [
      { diem: [H7.A, H7.B, H7.C], ten: ['A', 'B', 'C'], canh: ['9', '13,5', '12'] },
      { diem: [H7.A, lerp(H7.A, H7.C, 0.5), lerp(H7.A, H7.B, 8 / 9)], ten: [null, 'N', 'M'], lechTen: [null, [-1.5, -0.4], [1.3, 0.5]], mau: '--cc', to: '--cc',
        canh: [{ s: '6', lech: -0.9 }, an('9', 'x'), { s: '8', lech: -0.9 }] }],
      di: [{ tu: 1, toi: 0, neo: 0, mau: '--cc' }], loiCuoi: [{ s: 'AN : AB = AM : AC = 2 : 3', hien: [0.9, 1] }] } };
  // 34.9: C nằm giữa A và D, AC = 4, CD = 5, góc ABC = góc ADB, AB = 6
  var B9 = [6 * Math.cos(rad(38)), 6 * Math.sin(rad(38))];
  var hinh349 = { ten: 'trungKhit', moTa: 'Tam giác ABC nằm trong tam giác ADB, chung góc A. Lật tam giác ABC qua tia phân giác góc A rồi phóng lên thì trùng tam giác ADB.',
    tuyChon: { hinh: [
      { diem: [[0, 0], [9, 0], B9], ten: ['A', 'D', 'B'], canh: [null, null, an('6', 'x')], goc: [null, '--a', null] },
      { diem: [[0, 0], B9, [4, 0]], ten: [null, null, 'C'], canh: [null, null, { s: '4', lech: -0.9 }], goc: [null, '--a', null], mau: '--cc', to: '--cc' }],
      them: [{ k: 'chu', p: [6.5, -0.75], s: '5' }],
      di: [{ tu: 1, toi: [[0, 0], [9, 0], B9], neo: 0, mau: '--cc' }], loiCuoi: [{ s: 'AB : AD = AC : AB', hien: [0.9, 1] }] } };
  // 34.8: hình thang, AB = 3, AD = 4, BD = 6; tam giác ABD phóng 2 lần thành tam giác BDC
  var X8 = 11 / 6, Y8 = Math.sqrt(16 - X8 * X8);
  var hinh348 = { ten: 'trungKhit', moTa: 'Hình thang ABCD có đường chéo BD. Tam giác ABD quay, trượt rồi phóng lên thì trùng tam giác BDC.',
    tuyChon: { hinh: [
      { diem: [[X8, Y8], [X8 + 3, Y8], [0, 0]], ten: ['A', 'B', 'D'], canh: ['3', '6', '4'], goc: ['--a', '--b', null] },
      { diem: [[X8 + 3, Y8], [0, 0], [12, 0]], ten: [null, null, 'C'], canh: [null, an('12', 'y'), an('8', 'x')], goc: ['--a', '--b', null] }],
      di: [{ tu: 0, toi: 1, neo: 0, mau: '--a' }] } };
  // 34.11 (SGK tr. 88, H.9.20): tam giác trên giấy A'B' = 2 cm, A'C' = 3,76 cm và tam giác thật AB = 10 m, cùng góc 80° ở A, 70° ở B
  var hinh3411 = { ten: 'trungKhit', moTa: 'Tam giác vẽ trên giấy và tam giác thật có cùng hai góc 80 độ và 70 độ.', ghiChu: 'Hình không theo tỉ lệ: tam giác thật lớn gấp 500 lần.',
    tuyChon: { chuBuoc: false, hinh: [
      { goc3: [30, 80, 70], day: 5, ten: ["C'", "A'", "B'"], canh: [null, '2 cm', null], goc: [null, { mau: '--a', nhan: '80°' }, { mau: '--b', nhan: '70°' }] },
      { goc3: [30, 80, 70], day: 10, ten: ['C', 'A', 'B'], canh: [an('18,8 m', '?'), '10 m', null], goc: [null, { mau: '--a', nhan: '80°' }, { mau: '--b', nhan: '70°' }], dat: { sau: 0 } }],
      di: [{ tu: 0, toi: 1, neo: 1, mau: '--a' }], loiCuoi: [{ s: "Trên giấy: A'C' = 3,76 cm", hien: [-1, -0.5] }, { s: 'Cạnh thật gấp 1000 : 2 = 500 lần', hien: [0.9, 1] }] } };

  TOAN8.bai({
    id: 34, ten: 'Ba trường hợp đồng dạng của hai tam giác', sgk: { tap: 2, trang: 83 },
    nhin: {
      tieuDe: 'Hai góc bằng nhau là đủ: phóng tam giác nhỏ lên, nó trùng khít', loai: 'chungMinh',
      luuY: 'Trường hợp c.c.c và c.g.c (SGK) chứng minh theo cùng ý: đặt trong tam giác lớn một tam giác bằng tam giác nhỏ, có cạnh song song với cạnh đối diện, rồi dùng bài 33.',
      canh: { ten: 'ggTrung', moTa: 'Tam giác ABC nhỏ và tam giác A phẩy B phẩy C phẩy lớn có góc B bằng góc B phẩy, góc C bằng góc C phẩy. Tam giác nhỏ trượt tới B phẩy rồi phóng lên, trùng khít tam giác lớn.',
        dongSo: function (p, f) { return "$\\cb{\\widehat{B} = \\widehat{B'} = " + p.gB + "^\\circ}$, $\\cc{\\widehat{C} = \\widehat{C'} = " + Math.min(p.gC, 150 - p.gB) + "^\\circ}$, $\\frac{B'C'}{BC} = " + f(p.k).replace(',', '{,}') + '$'; } },
      buoc: [
        { t: 0, chu: "Hai tam giác có $\\cb{\\widehat{B}} = \\cb{\\widehat{B'}}$ và $\\cc{\\widehat{C}} = \\cc{\\widehat{C'}}$. Ta chưa biết gì về các cạnh." },
        { t: 0.1, chu: "Trượt tam giác $ABC$ cho đỉnh $B$ tới $B'$, cạnh $BC$ nằm trên $B'C'$. Vì $\\widehat{B} = \\widehat{B'}$ nên cạnh $BA$ nằm trên tia $B'A'$." },
        { t: 0.5, chu: "Sau khi trượt, $C$ nằm trên $B'C'$ và $A$ nằm trên $B'A'$. $\\cc{\\widehat{C}} = \\cc{\\widehat{C'}}$ là cặp góc đồng vị, nên $AC \\parallel A'C'$. Theo bài 33, $\\triangle A'B'C' \\backsim \\triangle ABC$." },
        { t: 0.9, chu: "Phóng tam giác nhỏ từ $B'$ lên $k = \\frac{B'C'}{BC}$ lần chỉ để minh họa: nó trùng khít $A'B'C'$, mọi cạnh nhân $k$." }
      ],
      ketLuan: "Hai cặp góc bằng nhau thì hai tam giác đồng dạng (g.g): $$\\widehat{B} = \\widehat{B'},\\ \\widehat{C} = \\widehat{C'} \\Rightarrow \\triangle A'B'C' \\backsim \\triangle ABC$$",
      dung: {
        tieuDe: 'Tam giác nằm ngược: lật lại rồi phóng', tuBai: '34.7', canh: hinh347,
        moiThu: 'Tam giác $AMN$ nằm "ngược" trong tam giác $ABC$: $M$ trên $AB$ nhưng $AM = 8$ dài hơn $AN = 6$. Lật nó qua tia phân giác góc $A$ thì $AM$ nằm trên cạnh $AC$. Gõ độ dài $MN$.',
        phanUng: [{ gt: 6.75, t: 1, loi: 'Em ghép $AN = 6$ với $AC = 12$. Xem hình: $N$ nằm trên $AC$, nhưng sau khi lật thì $AN$ nằm trên $AB = 9$. Tỉ số đúng là $\\frac{AN}{AB} = \\frac{6}{9}$.' },{ gt: 12, t: 1, loi: 'Em ghép $AM = 8$ với $AB = 9$. Xem hình: chưa lật thì $MN$ không song song $BC$. Lật tam giác $AMN$ qua phân giác góc $A$: $AN = 6$ nằm trên $AB = 9$, $AM = 8$ nằm trên $AC = 12$, cùng tỉ số $\\frac{2}{3}$.' }],
        soBatKi: function (v) {
          if (v <= 0) return { t: 0, loi: 'Độ dài phải lớn hơn $0$.' };
          var so = function (x) { return String(Math.round(x * 1000) / 1000).replace('.', '{,}'); };
          return { t: 1, loi: 'Lật xong, tam giác nhỏ phóng $\\frac{3}{2}$ lần thì trùng tam giác $ABC$, nên $MN \\cdot \\frac{3}{2}$ phải bằng $BC = 13{,}5$. Với $MN = ' + so(v) + '$ thì được $' + so(v * 1.5) + '$.' };
        },
        dungChu: '$\\frac{AN}{AB} = \\frac{AM}{AC} = \\frac{2}{3}$ và góc $A$ chung, nên $MN = \\frac{2}{3} \\cdot 13{,}5 = 9$.', saiChu: 'Lật tam giác $AMN$ qua tia phân giác góc $A$ rồi phóng lên: cạnh $MN$ thành cạnh $BC$.'
      },
      suyRa: {
        tieuDe: 'Tìm hai góc bằng nhau, chồng hai tam giác lên nhau',
        baDe: [
          { tuBai: '34.9', canh: hinh349, tenNut: 'Lật và phóng',
            phanUng: [{ gt: 'sqrt(20)', loi: 'Em dùng $CD = 5$. Sau khi lật, $AC$ nằm trên $AB$ còn $AB$ nằm trên **cả đoạn** $AD = 4 + 5 = 9$.' },
              { gt: 4.47, loi: '$4{,}47 \\approx \\sqrt{20}$: em dùng $CD = 5$. Sau khi lật, $AB$ nằm trên **cả đoạn** $AD = 4 + 5 = 9$.' }, { gt: 36, loi: '$36$ là $AB^2$. $AB$ là số nào bình phương lên bằng $36$?' }],
            dungChu: '$\\frac{AB}{AD} = \\frac{AC}{AB}$, nên $AB^2 = 4 \\cdot 9 = 36$ và $AB = 6$.', saiChu: 'Hai tam giác chung góc $A$ và có $\\widehat{ABC} = \\widehat{ADB}$. Lật tam giác nhỏ qua phân giác góc $A$: $AC$ nằm lên $AB$, $AB$ nằm lên $AD$.' },
          { tuBai: '34.8', canh: hinh348, tenNut: 'Chồng hai tam giác',
            dungChu: 'Tam giác $ABD$ phóng $2$ lần thành tam giác $BDC$: $x = 2 \\cdot 4 = 8$, $y = 2 \\cdot 6 = 12$.', saiChu: 'Ghép cạnh theo cặp đỉnh có góc bằng nhau: $AB \\leftrightarrow BD$, $AD \\leftrightarrow BC$, $BD \\leftrightarrow DC$. Tỉ số là $\\frac{BD}{AB} = 2$.' },
          { tuBai: '34.11', canh: hinh3411, tenNut: 'Chồng hai tam giác',
            phanUng: [{ gt: 1880, loi: '$1880$ là số xăng-ti-mét. Đề hỏi theo mét.' }, { gt: 7.52, loi: 'Em nhân $3{,}76$ với $2$. Tỉ số phải là cạnh thật chia cạnh trên giấy, cùng đơn vị: $\\frac{1000 \\text{ cm}}{2 \\text{ cm}} = 500$.' }],
            dungChu: '$\\frac{AB}{A\'B\'} = \\frac{1000}{2} = 500$, nên $AC = 500 \\cdot 3{,}76 = 1880$ cm $= 18{,}8$ m.', saiChu: 'Hai tam giác có hai cặp góc bằng nhau nên tam giác thật là bản phóng của tam giác trên giấy. Đổi $10$ m ra cm trước khi chia.' }
        ],
        cachNhan: 'Thấy hai tam giác có hai cặp góc bằng nhau (góc chung, góc so le, góc đo được…): lật hoặc trượt cho hai góc bằng nhau chồng lên nhau, một tam giác là bản phóng của tam giác kia. Cạnh tương ứng là cạnh nằm cùng chỗ sau khi chồng.'
      }
    },
    khamPha: {
      nhiemVu: "Tam giác $ABC$ cố định. Cạnh $B'C'$ của tam giác tím dài gấp $k$ lần $BC$ (chỉnh bằng thanh trượt). Em hãy **kéo đỉnh $A'$** (điểm cam) tới vị trí làm cho ba tỉ số cạnh bằng nhau – khi đó tam giác chuyển sang **màu xanh lá**.\n\nRồi nhìn xuống các dòng số đo góc: em thấy gì?",
      widget: 'geo',
      config: { bbox: [-1, 10.8, 15.5, -2], wide: true, build: khamPhaBuild,
        tuChay: [{ diem: "A'", den: [7.5, 4.5], giay: 2.5 }, { cho: 1.5 }, { thanhTruot: 'k', den: 2, giay: 2 }, { diem: "A'", den: [8, 6], giay: 2 }, { cho: 1.5 },
          { thanhTruot: 'k', den: 1.5, giay: 1.5 }, { diem: "A'", den: [8.5, 3], giay: 2 }] },
      cauHoi: {
        de: 'Khi ba cặp cạnh tương ứng tỉ lệ (ba tỉ số bằng nhau), các cặp góc tương ứng thế nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Tự động bằng nhau từng cặp', 'Góc của tam giác lớn hơn thì lớn hơn', 'Không có quy luật gì'] },
        goiY: ['Khi tam giác chuyển màu xanh lá, so số đo góc $B$ với $B\'$, góc $C$ với $C\'$.'],
        loiGiai: ['Chỉ cần **ba cạnh tỉ lệ** là các góc tương ứng tự bằng nhau, hai tam giác đồng dạng. Đó là **trường hợp cạnh – cạnh – cạnh**. Không cần đo góc nữa!'] }
    },
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Trường hợp cạnh – cạnh – cạnh (c.c.c)',
        noiDung: "Nếu **ba cạnh** của tam giác này tỉ lệ với ba cạnh của tam giác kia thì hai tam giác đó đồng dạng với nhau.\n\n**GT:** $\\frac{A'B'}{AB} = \\frac{A'C'}{AC} = \\frac{B'C'}{BC}$. **KL:** $\\triangle A'B'C' \\backsim \\triangle ABC$." },
      { loai: 'chuY', noiDung: '**Mẹo ghép cạnh khi chỉ biết độ dài:** xếp ba cạnh của mỗi tam giác từ **nhỏ đến lớn** rồi chia từng cặp (nhỏ với nhỏ, vừa với vừa, lớn với lớn). Ba thương bằng nhau thì đồng dạng.\n\nVí dụ: $2;\\ 2{,}5;\\ 3$ và $4;\\ 5;\\ 6$ có $\\frac{4}{2} = \\frac{5}{2{,}5} = \\frac{6}{3} = 2$.' },
      { loai: 'dinhLi', tieuDe: '2. Trường hợp cạnh – góc – cạnh (c.g.c)',
        noiDung: "Nếu **hai cạnh** của tam giác này tỉ lệ với hai cạnh của tam giác kia và **hai góc tạo bởi các cặp cạnh đó** bằng nhau thì hai tam giác đồng dạng.\n\n**GT:** $\\frac{A'B'}{AB} = \\frac{A'C'}{AC}$, $\\widehat{A'} = \\widehat{A}$. **KL:** $\\triangle A'B'C' \\backsim \\triangle ABC$." },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 9.8, 16.5, -2.7], wide: true, build: cgcBuild,
        tuChay: [{ thanhTruot: "A'B':AB", den: 1.6, giay: 2.5 }, { cho: 1.5 }, { thanhTruot: "A'C':AC", den: 0.8, giay: 2 }, { thanhTruot: "A'B':AB", den: 0.8, giay: 2 }, { cho: 1.5 },
          { thanhTruot: "A'B':AB", den: 1.2, giay: 1.5 }, { thanhTruot: "A'C':AC", den: 1.6, giay: 1.5 }] },
        chuThich: "Góc $A'$ luôn bằng góc $A$. Hai thanh trượt là hai tỉ số $\\frac{A'B'}{AB}$ và $\\frac{A'C'}{AC}$. Khi chúng **bằng nhau**, tỉ số $\\frac{B'C'}{BC}$ cũng bằng đúng số đó và tam giác chuyển màu xanh lá." },
      { loai: 'dinhLi', tieuDe: '3. Trường hợp góc – góc (g.g)',
        noiDung: "Nếu **hai góc** của tam giác này lần lượt bằng hai góc của tam giác kia thì hai tam giác đó đồng dạng.\n\n**GT:** $\\widehat{A'} = \\widehat{A}$, $\\widehat{B'} = \\widehat{B}$. **KL:** $\\triangle A'B'C' \\backsim \\triangle ABC$." },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 10.8, 16, -2], wide: true, build: ggBuild,
        tuChay: [{ thanhTruot: "B'C'", den: 3, giay: 2.5 }, { cho: 1.2 }, { thanhTruot: "B'C'", den: 9, giay: 3 }, { cho: 1.2 }, { thanhTruot: "B'C'", den: 7, giay: 1.5 }] },
        chuThich: "Tam giác tím có góc $B'$, $C'$ chép đúng góc $B$, $C$ (cùng màu). Kéo thanh trượt đổi độ dài $B'C'$, hoặc kéo $A$, $B$, $C$: ba tỉ số cạnh luôn bằng nhau." },
      { loai: 'chuY', noiDung: "**Hay nhầm 1 – góc không xen giữa.** Ở c.g.c, góc bằng nhau phải là góc **tạo bởi** hai cặp cạnh tỉ lệ. Biết $\\frac{A'B'}{AB} = \\frac{A'C'}{AC}$ và $\\widehat{B'} = \\widehat{B}$ thì **chưa đủ** kết luận đồng dạng.\n\n**Hay nhầm 2 – viết sai thứ tự đỉnh.** Sau khi chứng minh, phải viết kí hiệu sao cho các đỉnh có **góc bằng nhau** đứng cùng vị trí. Ví dụ $\\widehat{A} = \\widehat{E}$, $\\widehat{B} = \\widehat{F}$ thì viết $\\triangle ABC \\backsim \\triangle EFD$." },
      { loai: 'chuY', noiDung: "**Nhận xét.** Nếu $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $k$ thì tỉ số hai **đường trung tuyến** tương ứng, hai **đường phân giác** tương ứng cũng bằng $k$; tỉ số **chu vi** cũng bằng $k$." }
    ],
    viDu: [
      { de: 'Cho $\\triangle ABC$ có $AB = 4$ cm, $BC = 6$ cm, $CA = 5$ cm và $\\triangle DEF$ có $DE = 8$ cm, $EF = 12$ cm, $FD = 10$ cm. Hai tam giác có đồng dạng không?',
        canh: haiTG({ dai: [4, 6, 5], ten: ['A', 'B', 'C'], canh: ['4', '6', '5'] }, { dai: [8, 12, 10], ten: ['D', 'E', 'F'], canh: ['8', '12', '10'] }, { loiCuoi: [{ s: 'DE : AB = EF : BC = FD : CA = 2', hien: [0.9, 1] }] }), buoc: [
        { lam: '$\\frac{DE}{AB} = \\frac{8}{4} = 2$; $\\frac{EF}{BC} = \\frac{12}{6} = 2$; $\\frac{FD}{CA} = \\frac{10}{5} = 2$.', vi: 'Ghép cạnh nhỏ với cạnh nhỏ, cạnh lớn với cạnh lớn rồi tính ba tỉ số.' },
        { lam: 'Ba tỉ số bằng nhau nên $\\triangle DEF \\backsim \\triangle ABC$ (c.c.c), tỉ số đồng dạng $2$.', vi: 'Trường hợp cạnh – cạnh – cạnh. Cặp đỉnh: $D$–$A$, $E$–$B$, $F$–$C$ (đúng theo cặp cạnh đã ghép).' } ] },
      { de: 'Cho tam giác $ABC$ có $AB = 12$ cm, $AC = 15$ cm. Trên tia $AB$, $AC$ lần lượt lấy $M$, $N$ sao cho $AM = 10$ cm, $AN = 8$ cm. Chứng minh $\\triangle ABC \\backsim \\triangle ANM$.',
        canh: { ten: 'trungKhit', tuyChon: { hinh: [
          { diem: [[0, 0], [12, 0], [15 * Math.cos(rad(65)), 15 * Math.sin(rad(65))]], ten: ['A', 'B', 'C'], canh: ['12', null, '15'] },
          { diem: [[0, 0], [8 * Math.cos(rad(65)), 8 * Math.sin(rad(65))], [10, 0]], ten: [null, 'N', 'M'], canh: [{ s: '8', lech: -0.9 }, null, { s: '10', lech: -0.9 }], mau: '--cc', to: '--cc' }],
          di: [{ tu: 1, toi: 0, neo: 0, mau: '--cc' }], loiCuoi: [{ s: 'AN : AB = AM : AC = 2 : 3', hien: [0.9, 1] }] } }, buoc: [
        { lam: '$\\frac{AN}{AB} = \\frac{8}{12} = \\frac{2}{3}$; $\\frac{AM}{AC} = \\frac{10}{15} = \\frac{2}{3}$.', vi: 'Theo kí hiệu $\\triangle ABC \\backsim \\triangle ANM$: $B \\leftrightarrow N$, $C \\leftrightarrow M$, nên $AB$ ghép với $AN$, $AC$ ghép với $AM$.' },
        { lam: '$\\widehat{BAC} = \\widehat{NAM}$ (góc chung).', vi: 'Góc $A$ là góc tạo bởi hai cặp cạnh vừa xét, đúng điều kiện "xen giữa".' },
        { lam: 'Vậy $\\triangle ABC \\backsim \\triangle ANM$ (c.g.c).', vi: 'Hai cạnh tỉ lệ và góc xen giữa bằng nhau.' } ] },
      { de: 'Cho $\\triangle ABC$ có $\\widehat{A} = 60^\\circ$, $\\widehat{B} = 50^\\circ$ và $\\triangle DEF$ có $\\widehat{D} = 60^\\circ$, $\\widehat{F} = 70^\\circ$. Hai tam giác có đồng dạng không? Viết đúng kí hiệu.',
        canh: haiTG({ goc3: [60, 50, 70], day: 3.4, ten: ['A', 'B', 'C'], goc: [{ mau: '--a', nhan: '60°' }, { mau: '--b', nhan: '50°' }, '--cc'] },
          { goc3: [60, 50, 70], day: 4.2, ten: ['D', 'E', 'F'], goc: [{ mau: '--a', nhan: '60°' }, '--b', { mau: '--cc', nhan: '70°' }] }), buoc: [
        { lam: '$\\widehat{C} = 180^\\circ - 60^\\circ - 50^\\circ = 70^\\circ$.', vi: 'Tính góc còn lại để so sánh dễ hơn.' },
        { lam: '$\\widehat{A} = \\widehat{D} = 60^\\circ$, $\\widehat{C} = \\widehat{F} = 70^\\circ$.', vi: 'Có hai cặp góc bằng nhau.' },
        { lam: 'Vậy $\\triangle ABC \\backsim \\triangle DEF$ (g.g).', vi: '$A \\leftrightarrow D$, $C \\leftrightarrow F$ nên $B \\leftrightarrow E$: viết theo thứ tự $ABC$ – $DEF$.' } ] },
      { de: 'Cho hình thang $ABCD$ ($AB \\parallel CD$) có $\\widehat{DAB} = \\widehat{DBC}$, $AB = 2$ cm, $AD = 3$ cm, $BD = 4$ cm. Tính $BC$ và $DC$.',
        canh: { ten: 'trungKhit', tuyChon: { hinh: [
          { diem: [[0.75, Math.sqrt(8.4375)], [2.75, Math.sqrt(8.4375)], [0, 0]], ten: ['A', 'B', 'D'], canh: ['2', '4', '3'], goc: ['--a', '--b', null] },
          { diem: [[2.75, Math.sqrt(8.4375)], [0, 0], [8, 0]], ten: [null, null, 'C'], canh: [null, an('8'), an('6')], goc: ['--a', '--b', null] }],
          di: [{ tu: 0, toi: 1, neo: 0, mau: '--a' }] } }, buoc: [
        { lam: '$\\widehat{ABD} = \\widehat{BDC}$ (so le trong, vì $AB \\parallel CD$).', vi: 'Tìm thêm một cặp góc bằng nhau nhờ hai đường song song.' },
        { lam: 'Kết hợp $\\widehat{DAB} = \\widehat{DBC}$ suy ra $\\triangle ABD \\backsim \\triangle BDC$ (g.g).', vi: '$A \\leftrightarrow B$ (góc bằng nhau đề cho), $B \\leftrightarrow D$ (so le trong), nên $D \\leftrightarrow C$.' },
        { lam: '$\\frac{AB}{BD} = \\frac{AD}{BC} = \\frac{BD}{DC}$, tức $\\frac{2}{4} = \\frac{3}{BC} = \\frac{4}{DC}$.', vi: 'Ghép cạnh theo vị trí chữ: $AB$–$BD$, $AD$–$BC$, $BD$–$DC$.' },
        { lam: '$BC = 6$ cm, $DC = 8$ cm.', vi: 'Tỉ số là $\\frac{1}{2}$ nên mỗi cạnh của $\\triangle BDC$ gấp đôi cạnh tương ứng của $\\triangle ABD$.', canh: { t: 1, trangThai: 'giai' } } ] }
    ],
    viDuMo: [
      { de: 'Cho $\\triangle ABC$ có $AB = 3$, $BC = 4$, $CA = 5$ và $\\triangle MNP$ có $MN = 6$, $NP = 8$, $PM = 10$. Tìm tỉ số đồng dạng của $\\triangle ABC$ với $\\triangle MNP$.', buoc: [
        { lam: '$\\frac{AB}{MN} = \\frac{3}{6}$, $\\frac{BC}{NP} = \\frac{4}{8}$, $\\frac{CA}{PM} = \\frac{5}{10}$: ba tỉ số bằng nhau.', vi: 'Ba cạnh tỉ lệ nên $\\triangle ABC \\backsim \\triangle MNP$ (c.c.c).' },
        { lam: 'Tỉ số đồng dạng $k = \\frac{AB}{MN} = \\frac{1}{2}$', vi: 'Em hãy nhập tỉ số (phân số):', an: true,
          dapAn: { kieu: 'so', gt: '1/2' },
          loiThuongGap: [{ gt: 2, giaiThich: '$2$ là tỉ số của $\\triangle MNP$ với $\\triangle ABC$. Tam giác $ABC$ đứng trước nên cạnh của nó ở tử số.' }] } ] },
      { de: 'Cho $\\triangle ABC$ và $\\triangle DEF$ có $\\widehat{B} = \\widehat{E}$, $\\widehat{C} = \\widehat{F}$, $AB = 4$, $BC = 5$, $DE = 6$. Tính $EF$.', buoc: [
        { lam: '$\\triangle ABC \\backsim \\triangle DEF$ (g.g).', vi: 'Hai cặp góc bằng nhau; $B \\leftrightarrow E$, $C \\leftrightarrow F$ nên $A \\leftrightarrow D$.' },
        { lam: '$\\frac{DE}{AB} = \\frac{EF}{BC}$, tức $\\frac{6}{4} = \\frac{EF}{5}$', vi: 'Cạnh $EF$ ứng với $BC$.' },
        { lam: '$EF = \\frac{6 \\cdot 5}{4} = 7{,}5$', vi: 'Em hãy tính $EF$:', an: true,
          dapAn: { kieu: 'so', gt: 7.5 },
          loiThuongGap: [{ gt: '10/3', giaiThich: 'Em lật ngược tỉ số. $DE = 6 > AB = 4$ nên $\\triangle DEF$ lớn hơn, $EF$ phải lớn hơn $BC = 5$.' }] } ] }
    ],
    baiTap: [
      { id: '34.1', khongHinh: 'Câu lí thuyết về ba trường hợp; phần Nhìn đã có hình.', muc: 1, de: 'Giả thiết nào dưới đây **không** đủ để kết luận hai tam giác đồng dạng?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['Ba cạnh của tam giác này tỉ lệ với ba cạnh của tam giác kia', 'Hai cạnh tỉ lệ với hai cạnh của tam giác kia và góc tạo bởi các cặp cạnh đó bằng nhau', 'Hai góc của tam giác này bằng hai góc của tam giác kia', 'Hai cạnh của tam giác này bằng hai cạnh của tam giác kia'] },
        goiY: ['Nhớ lại ba trường hợp: c.c.c, c.g.c, g.g.', 'Hai cạnh bằng nhau mà không biết gì về góc xen giữa thì hình dạng có thể khác hẳn.'],
        loiGiai: ['Ba phương án đầu đúng là ba trường hợp đồng dạng c.c.c, c.g.c, g.g.', 'Chỉ biết hai cạnh bằng nhau (không biết góc xen giữa hay cạnh thứ ba) thì **chưa** kết luận được.'] },
      { id: '34.2', hinhGiai: hg(haiTG({ dai: ba([2, 3, 4]), canh: ['2', '4', '3'] }, { dai: ba([6, 4, 8]), canh: ['4', '8', '6'] })), muc: 1, de: 'Tam giác thứ nhất có ba cạnh $2$ cm, $3$ cm, $4$ cm. Tam giác thứ hai có ba cạnh $6$ cm, $4$ cm, $8$ cm. Khẳng định "hai tam giác đồng dạng" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Xếp ba cạnh mỗi tam giác từ nhỏ đến lớn: $2; 3; 4$ và $4; 6; 8$.', 'Tính $\\frac{4}{2}$, $\\frac{6}{3}$, $\\frac{8}{4}$.'],
        loiGiai: ['$\\frac{4}{2} = \\frac{6}{3} = \\frac{8}{4} = 2$.', 'Ba cạnh tỉ lệ nên hai tam giác đồng dạng (c.c.c). Khẳng định **đúng**.'] },
      { id: '34.3', hinhGiai: hg(Object.assign(haiTG({ dai: ba([3, 4, 6]), canh: ['3', '6', '4'] }, { dai: ba([6, 8, 10]), canh: ['6', '10', '8'] }), { ghiChu: 'Phóng theo cạnh lớn nhất: xem đỉnh còn lại có khít không.' })), muc: 1, de: 'Tam giác thứ nhất có ba cạnh $3$, $4$, $6$. Tam giác thứ hai có ba cạnh $6$, $8$, $10$. Khẳng định "hai tam giác đồng dạng" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Ghép cạnh nhỏ với nhỏ, lớn với lớn rồi tính ba tỉ số.', 'So sánh $\\frac{6}{3}$, $\\frac{8}{4}$ và $\\frac{10}{6}$.'],
        loiGiai: ['$\\frac{6}{3} = 2$, $\\frac{8}{4} = 2$ nhưng $\\frac{10}{6} \\approx 1{,}67$.', 'Ba tỉ số không bằng nhau nên hai tam giác **không** đồng dạng. Khẳng định **sai**.'] },
      { id: '34.4', muc: 1, de: 'Trong hình, $\\triangle ABC$ có $\\widehat{A} = 60^\\circ$, $\\widehat{B} = 50^\\circ$; $\\triangle MNP$ có $\\widehat{M} = 70^\\circ$, $\\widehat{N} = 60^\\circ$. Kí hiệu đồng dạng nào **đúng**?',
        hinh: h4,
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$\\triangle ABC \\backsim \\triangle MNP$', '$\\triangle ABC \\backsim \\triangle NPM$', '$\\triangle ABC \\backsim \\triangle PNM$', '$\\triangle ABC \\backsim \\triangle NMP$'] },
        goiY: ['Tính góc còn lại của mỗi tam giác: $\\widehat{C}$ và $\\widehat{P}$.', 'Ghép các đỉnh có góc bằng nhau: góc $60^\\circ$ với góc $60^\\circ$, …'],
        loiGiai: ['$\\widehat{C} = 70^\\circ$, $\\widehat{P} = 50^\\circ$.', '$\\widehat{A} = \\widehat{N} = 60^\\circ$, $\\widehat{B} = \\widehat{P} = 50^\\circ$, $\\widehat{C} = \\widehat{M} = 70^\\circ$.', 'Vậy $\\triangle ABC \\backsim \\triangle NPM$ (g.g).'] },
      { id: '34.5', hinhGiai: hg(haiTG({ dai: ba([3, 5, 7]), canh: ['3', '7', '5'] }, { dai: ba([9, 15, 21]), canh: [an('9'), an('21'), an('15')] }, { loiCuoi: ['Chu vi: 15 cm → 45 cm'] })), muc: 2, de: 'Một tam giác có ba cạnh $3$ cm, $5$ cm, $7$ cm. Một tam giác đồng dạng với nó có chu vi $45$ cm. Tính ba cạnh của tam giác thứ hai (từ nhỏ đến lớn).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Cạnh nhỏ nhất =', kieu: 'so', gt: 9 },
          { nhan: 'Cạnh vừa =', kieu: 'so', gt: 15 },
          { nhan: 'Cạnh lớn nhất =', kieu: 'so', gt: 21 }] },
        goiY: ['Tỉ số chu vi của hai tam giác đồng dạng bằng tỉ số đồng dạng.', 'Chu vi tam giác thứ nhất là $3 + 5 + 7 = 15$, nên $k = \\frac{45}{15} = 3$.'],
        loiGiai: ['Chu vi tam giác thứ nhất: $3 + 5 + 7 = 15$ (cm). Tỉ số đồng dạng $k = \\frac{45}{15} = 3$.', 'Ba cạnh tam giác thứ hai: $3 \\cdot 3 = 9$; $5 \\cdot 3 = 15$; $7 \\cdot 3 = 21$ (cm).'] },
      { id: '34.6', hinhGiai: hg(haiTG({ dai: [5, 7, 8], ten: ['A', 'B', 'C'], canh: ['5', '7', an('8')] }, { dai: [7.5, 10.5, 12], ten: ['D', 'E', 'F'], canh: ['7,5', an('10,5'), '12'] })), muc: 2, de: 'Tam giác $ABC$ có chu vi $20$ cm, $AB = 5$ cm, $BC = 7$ cm. Tam giác $DEF$ có chu vi $30$ cm, $DE = 7{,}5$ cm, $FD = 12$ cm. Biết $\\triangle DEF \\backsim \\triangle ABC$, tìm tỉ số đồng dạng (phân số) và kiểm tra lại bằng ba cạnh.',
        dapAn: { kieu: 'so', gt: '3/2' },
        goiY: ['Tính cạnh còn lại: $CA = 20 - 5 - 7$, $EF = 30 - 7{,}5 - 12$.', 'Tính $\\frac{DE}{AB}$, $\\frac{EF}{BC}$, $\\frac{FD}{CA}$.'],
        loiGiai: ['$CA = 20 - 5 - 7 = 8$; $EF = 30 - 7{,}5 - 12 = 10{,}5$.', '$\\frac{DE}{AB} = \\frac{7{,}5}{5} = 1{,}5$; $\\frac{EF}{BC} = \\frac{10{,}5}{7} = 1{,}5$; $\\frac{FD}{CA} = \\frac{12}{8} = 1{,}5$.', 'Tỉ số đồng dạng $k = \\frac{3}{2}$'],
        loiThuongGap: [{ gt: '2/3', giaiThich: 'Em lật ngược. $\\triangle DEF$ đứng trước nên lấy cạnh của $\\triangle DEF$ chia cạnh của $\\triangle ABC$.' }] },
      { id: '34.7', muc: 2, de: 'Cho tam giác $ABC$ có $AB = 9$, $AC = 12$, $BC = 13{,}5$. Lấy $M$ trên cạnh $AB$, $N$ trên cạnh $AC$ sao cho $AM = 8$, $AN = 6$. Tính $x = MN$.',
        hinh: h7,
        dapAn: { kieu: 'so', gt: 9 },
        goiY: ['So sánh $\\frac{AN}{AB}$ và $\\frac{AM}{AC}$ (chú ý: $N$ ghép với $B$, $M$ ghép với $C$). Góc $A$ chung.', 'Vậy $\\triangle ANM \\backsim \\triangle ABC$ (c.g.c) với tỉ số $\\frac{2}{3}$, nên $MN = \\frac{2}{3} BC$.'],
        loiGiai: ['$\\frac{AN}{AB} = \\frac{6}{9} = \\frac{2}{3}$; $\\frac{AM}{AC} = \\frac{8}{12} = \\frac{2}{3}$; góc $A$ chung.', 'Do đó $\\triangle ANM \\backsim \\triangle ABC$ (c.g.c), suy ra $\\frac{NM}{BC} = \\frac{2}{3}$.', '$x = \\frac{2}{3} \\cdot 13{,}5 = 9$'],
        loiThuongGap: [{ gt: 12, giaiThich: 'Em ghép $AM$ với $AB$ ($\\frac{8}{9}$). Ở đây $MN$ **không** song song với $BC$: phải ghép $AN$ với $AB$ và $AM$ với $AC$ thì hai tỉ số mới bằng nhau.' }] },
      { id: '34.8', muc: 2, de: 'Hình thang $ABCD$ ($AB \\parallel CD$) có $\\widehat{DAB} = \\widehat{DBC}$, $AB = 3$, $AD = 4$, $BD = 6$. Tính $x = BC$ và $y = DC$.',
        hinh: h8,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$x = BC =$', kieu: 'so', gt: 8, loiThuongGap: [{ gt: 2, giaiThich: 'Em lật ngược tỉ số. $\\triangle BDC$ lớn hơn $\\triangle ABD$ (tỉ số $\\frac{BD}{AB} = 2$).' }] },
          { nhan: '$y = DC =$', kieu: 'so', gt: 12, loiThuongGap: [{ gt: 3, giaiThich: 'Em lật ngược tỉ số. $DC$ ứng với $BD = 6$, mà $\\triangle BDC$ lớn gấp đôi $\\triangle ABD$: $DC = 2 \\cdot 6 = 12$.' }] }] },
        goiY: ['$\\widehat{ABD} = \\widehat{BDC}$ (so le trong). Cùng với giả thiết, ta có $\\triangle ABD \\backsim \\triangle BDC$ (g.g).', 'Tỉ số $\\frac{BD}{AB} = \\frac{6}{3} = 2$: mỗi cạnh của $\\triangle BDC$ gấp đôi cạnh tương ứng của $\\triangle ABD$.'],
        loiGiai: ['$AB \\parallel CD$ nên $\\widehat{ABD} = \\widehat{BDC}$; lại có $\\widehat{DAB} = \\widehat{DBC}$. Vậy $\\triangle ABD \\backsim \\triangle BDC$ (g.g).', '$\\frac{AB}{BD} = \\frac{AD}{BC} = \\frac{BD}{DC}$, tức $\\frac{3}{6} = \\frac{4}{x} = \\frac{6}{y}$.', '$x = 8$, $y = 12$.'] },
      { id: '34.9', muc: 2, de: 'Trong hình, $C$ nằm giữa $A$ và $D$, $AC = 4$, $CD = 5$, $\\widehat{ABC} = \\widehat{ADB}$. Tính $x = AB$.',
        hinh: h9,
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['$\\triangle ABC$ và $\\triangle ADB$ có góc $A$ chung và $\\widehat{ABC} = \\widehat{ADB}$: đồng dạng (g.g).', 'Suy ra $\\frac{AB}{AD} = \\frac{AC}{AB}$, tức $AB^2 = AC \\cdot AD$, với $AD = 4 + 5 = 9$.'],
        loiGiai: ['Góc $A$ chung, $\\widehat{ABC} = \\widehat{ADB}$ nên $\\triangle ABC \\backsim \\triangle ADB$ (g.g).', '$\\frac{AB}{AD} = \\frac{AC}{AB}$, nên $AB^2 = AC \\cdot AD = 4 \\cdot 9 = 36$.', '$x = AB = 6$'],
        loiThuongGap: [{ gt: 'sqrt(20)', giaiThich: 'Em dùng $CD = 5$. Cạnh tương ứng là cả đoạn $AD = 4 + 5 = 9$: $AB^2 = 4 \\cdot 9$.' }, { gt: 36, giaiThich: '$36$ là $AB^2$. Còn phải lấy căn: $AB = 6$.' }] },
      { id: '34.10', muc: 3, de: 'Hai cột thẳng đứng cao $4$ m và $6$ m. Người ta nối dây từ đỉnh cột này đến chân cột kia; hai sợi dây cắt nhau tại $I$. Tính độ cao $h$ của điểm $I$ so với mặt đất (m).',
        hinh: h10,
        dapAn: { kieu: 'so', gt: 2.4 },
        goiY: ['Gọi $H$ là chân đường vuông góc hạ từ $I$ xuống mặt đất. $IH$ song song với hai cột.', 'Trong $\\triangle RPQ$: $\\frac{h}{4} = \\frac{RH}{PR}$; trong $\\triangle PRS$: $\\frac{h}{6} = \\frac{PH}{PR}$. Cộng hai đẳng thức lại.'],
        loiGiai: ['$IH \\parallel PQ$ nên $\\triangle RHI \\backsim \\triangle RPQ$: $\\frac{h}{4} = \\frac{RH}{PR}$.', '$IH \\parallel RS$ nên $\\triangle PHI \\backsim \\triangle PRS$: $\\frac{h}{6} = \\frac{PH}{PR}$.', 'Cộng lại: $\\frac{h}{4} + \\frac{h}{6} = \\frac{RH + PH}{PR} = 1$, nên $\\frac{5h}{12} = 1$.', '$h = \\frac{12}{5} = 2{,}4$'],
        loiThuongGap: [{ gt: 5, giaiThich: '$5$ m là trung bình cộng hai cột, không phải độ cao điểm cắt. Điểm cắt luôn **thấp hơn** cột ngắn.' }] },
      { id: '34.11', hinhGiai: hg(hinh3411), muc: 3, de: 'Để đo khoảng cách $AC$ từ bạn Tròn (điểm $A$) tới cột cờ $C$ bên kia sông, anh Pi chọn điểm $B$ cùng bờ với $AB = 10$ m, đo được $\\widehat{ABC} = 70^\\circ$, $\\widehat{BAC} = 80^\\circ$. Anh vẽ trên giấy $\\triangle A\'B\'C\'$ có $A\'B\' = 2$ cm, $\\widehat{A\'B\'C\'} = 70^\\circ$, $\\widehat{B\'A\'C\'} = 80^\\circ$ và đo được $A\'C\' = 3{,}76$ cm. Tính $AC$ (m).',
        dapAn: { kieu: 'so', gt: 18.8 },
        goiY: ['Hai tam giác có hai cặp góc bằng nhau nên $\\triangle A\'B\'C\' \\backsim \\triangle ABC$ (g.g).', 'Đổi cùng đơn vị: $AB = 10$ m $= 1000$ cm. Tỉ số $\\frac{AB}{A\'B\'} = \\frac{1000}{2} = 500$.'],
        loiGiai: ['$\\triangle A\'B\'C\' \\backsim \\triangle ABC$ (g.g), nên $\\frac{AC}{A\'C\'} = \\frac{AB}{A\'B\'} = \\frac{1000}{2} = 500$.', '$AC = 500 \\cdot 3{,}76 = 1880$ (cm).', '$AC = 18{,}8$ (m)'],
        loiThuongGap: [{ gt: 1880, giaiThich: '$1880$ là số xăng-ti-mét. Đề hỏi theo mét: $1880$ cm $= 18{,}8$ m.' }] },
      { id: '34.12', muc: 3, de: 'Cho góc $xOy$; $A$, $B$ trên tia $Ox$; $C$, $D$ trên tia $Oy$ với $OA = 3$, $OB = 8$, $OC = 4$, $OD = 6$. $AD$ cắt $BC$ tại $E$. Tính tỉ số $\\frac{BE}{DE}$ (phân số).',
        hinh: h12,
        dapAn: { kieu: 'so', gt: '5/2' },
        goiY: ['Xét $\\triangle OAD$ và $\\triangle OCB$: góc $O$ chung, $\\frac{OA}{OC} = \\frac{3}{4}$, $\\frac{OD}{OB} = \\frac{6}{8}$. Suy ra $\\widehat{ODA} = \\widehat{OBC}$.', 'Rồi $\\triangle AEB \\backsim \\triangle CED$ (g.g: góc đối đỉnh và $\\widehat{ABE} = \\widehat{CDE}$), nên $\\frac{BE}{DE} = \\frac{AB}{CD}$.'],
        loiGiai: ['$\\frac{OA}{OC} = \\frac{OD}{OB} = \\frac{3}{4}$, góc $O$ chung nên $\\triangle OAD \\backsim \\triangle OCB$ (c.g.c), suy ra $\\widehat{ODA} = \\widehat{OBC}$.', '$\\triangle AEB$ và $\\triangle CED$ có $\\widehat{AEB} = \\widehat{CED}$ (đối đỉnh), $\\widehat{ABE} = \\widehat{CDE}$, nên $\\triangle AEB \\backsim \\triangle CED$ (g.g).', '$\\frac{BE}{DE} = \\frac{AB}{CD} = \\frac{8 - 3}{6 - 4} = \\frac{5}{2}$'],
        loiThuongGap: [{ gt: '4/3', giaiThich: 'Em lấy $\\frac{OB}{OD}$. Hai tam giác cần xét là $AEB$ và $CED$: $\\frac{BE}{DE} = \\frac{AB}{CD}$ với $AB = 5$, $CD = 2$.' }] }
    ],
    timLoi: [
      { de: "Cho $\\triangle ABC$ và $\\triangle A'B'C'$ có $\\frac{A'B'}{AB} = \\frac{A'C'}{AC}$ và $\\widehat{B'} = \\widehat{B}$. Bạn Lan kết luận như sau. Dòng nào sai?",
        loiGiaiSai: ["Hai tam giác có $\\frac{A'B'}{AB} = \\frac{A'C'}{AC}$ (hai cạnh tỉ lệ)", "và $\\widehat{B'} = \\widehat{B}$ (một cặp góc bằng nhau)", "Vậy $\\triangle A'B'C' \\backsim \\triangle ABC$ (c.g.c)"],
        dongSai: 2,
        giaiThich: "Góc $B$ **không** nằm xen giữa hai cạnh $AB$ và $AC$ (góc xen giữa là góc $A$). Trường hợp c.g.c đòi hỏi góc tạo bởi hai cặp cạnh tỉ lệ, nên chưa kết luận được.",
        sua: "Cần $\\widehat{A'} = \\widehat{A}$ (góc xen giữa) thì mới có $\\triangle A'B'C' \\backsim \\triangle ABC$ (c.g.c)." },
      { de: 'Cho $\\triangle ABC$ có $\\widehat{A} = 70^\\circ$, $\\widehat{B} = 40^\\circ$ và $\\triangle DEF$ có $\\widehat{E} = 70^\\circ$, $\\widehat{F} = 40^\\circ$. Bạn Tuấn làm như sau. Dòng nào sai?',
        loiGiaiSai: ['Hai tam giác có hai cặp góc bằng nhau: $\\widehat{A} = \\widehat{E}$, $\\widehat{B} = \\widehat{F}$', 'Nên hai tam giác đồng dạng (g.g)', 'Vậy $\\triangle ABC \\backsim \\triangle DEF$', 'Suy ra $\\frac{AB}{DE} = \\frac{BC}{EF}$'],
        dongSai: 2,
        giaiThich: 'Viết sai thứ tự đỉnh. $A \\leftrightarrow E$, $B \\leftrightarrow F$ nên $C \\leftrightarrow D$: phải viết $\\triangle ABC \\backsim \\triangle EFD$. Dòng cuối cũng sai theo.',
        sua: 'Vậy $\\triangle ABC \\backsim \\triangle EFD$, suy ra $\\frac{AB}{EF} = \\frac{BC}{FD} = \\frac{CA}{DE}$.' }
    ]
  });
})();
