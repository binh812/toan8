// Bài 12 – Hình bình hành (SGK Toán 8 KNTT, Tập 1, tr. 57–63)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hinh = TOAN8.hinhTinh;
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
  // Tứ giác ABCD (đi ngược chiều kim đồng hồ, A ở gốc, B bên phải) biết góc A, B, D và hai cạnh AB, AD.
  function tg4(gA, gB, gD, ab, ad) {
    var A = [0, 0], B = [ab, 0], D = toi(A, gA, ad);
    var u = [Math.cos(rad(180 - gB)), Math.sin(rad(180 - gB))], v = [Math.cos(rad(gA + 180 + gD)), Math.sin(rad(gA + 180 + gD))];
    var rx = D[0] - B[0], ry = D[1] - B[1], det = -u[0] * v[1] + u[1] * v[0];
    var t = (-rx * v[1] + ry * v[0]) / det;
    return { A: A, B: B, C: [B[0] + t * u[0], B[1] + t * u[1]], D: D };
  }
  // Chỗ đặt chữ số đo của góc POQ: trên tia phân giác, cách đỉnh O một đoạn k.
  function chuGoc(P, O, Q, k) {
    var ux = P[0] - O[0], uy = P[1] - O[1], vx = Q[0] - O[0], vy = Q[1] - O[1];
    var lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
    var wx = ux / lu + vx / lv, wy = uy / lu + vy / lv, lw = Math.hypot(wx, wy);
    if (lw < 1e-6) { wx = -uy / lu; wy = ux / lu; lw = 1; }
    return [O[0] + k * wx / lw, O[1] + k * wy / lw];
  }
  // o: { diem, vong:[đỉnh theo thứ tự], vach?:{AB:1}, canh?, goc?, soGoc?:[[P,O,Q,'chữ',hệ số xa?,màu?]], nhan?, ve?, lechTen?, ghiChu? }
  function hinhTG(o) {
    var D = o.diem, v = o.vong || [], canh = [], ten = Object.keys(D);
    v.forEach(function (a, i) { var b = v[(i + 1) % v.length], k = (o.vach || {})[a + b]; canh.push([a, b, k ? { vach: k } : {}]); });
    var xs = ten.map(function (n) { return D[n][0]; }), ys = ten.map(function (n) { return D[n][1]; });
    var s = Math.max(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys));
    var chu = (o.soGoc || []).map(function (g) {
      var p = chuGoc(D[g[0]], D[g[1]], D[g[2]], 0.17 * s * (g[4] || 1));
      return [p[0], p[1], g[3], g[5] || CAM];
    });
    return { widget: 'geo', config: hinh({ diem: D, to: v.length ? v : null, canh: canh.concat(o.canh || []), goc: o.goc, nhan: o.nhan, ve: o.ve,
      lechTen: o.lechTen, ghiChu: o.ghiChu,
      them: function (board, G) {
        chu.forEach(function (c) { G.label(c[0], c[1], c[2], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: c[3] }); });
      } }) };
  }
  function cong(P, Q) { return [P[0] + Q[0], P[1] + Q[1]]; }

  var A2 = toi([0, 0], 65, 3.5);
  var h2 = hinhTG({ diem: { A: A2, B: cong(A2, [6, 0]), C: [6, 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    goc: [['D', 'A', 'B']], soGoc: [['D', 'A', 'B', '115°', 1.1], ['A', 'B', 'C', '?', 1, XANH], ['B', 'C', 'D', '?', 1, XANH], ['C', 'D', 'A', '?', 1.2, XANH]] });
  var A4 = toi([0, 0], 160, 4), B4 = toi([0, 0], 60, 2.5);
  var h4 = hinhTG({ diem: { A: A4, B: B4, C: [-A4[0], -A4[1]], D: [-B4[0], -B4[1]], O: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    nhan: [['O', 'A', '4', false, 0.8, TIM], ['O', 'B', '2,5', true, 0.8, TIM]], lechTen: { O: [0, -18] } });
  var h6 = hinhTG({ diem: tg4(115, 65, 70, 6, 3.5), vong: ['A', 'B', 'C', 'D'],
    goc: [['B', 'A', 'D'], ['A', 'B', 'C'], ['C', 'D', 'A']],
    soGoc: [['B', 'A', 'D', '115°', 1.1], ['A', 'B', 'C', '65°', 1.3], ['C', 'D', 'A', '70°', 1.2]] });
  var A7 = toi([0, 0], 60, 6);
  var h7 = hinhTG({ diem: { A: A7, B: cong(A7, [10, 0]), C: [10, 0], D: [0, 0], E: cong(A7, [6, 0]) }, vong: ['A', 'B', 'C', 'D'],
    canh: [['D', 'E', { mau: CAM, day: 3 }]], goc: [['A', 'D', 'E', { r: 1.1 }], ['E', 'D', 'C', { r: 1.3 }]],
    nhan: [['D', 'A', '6 cm'], ['D', 'C', '10 cm', true], ['E', 'B', '?', false, 1, XANH]] });
  var B8 = toi([0, 0], 60, 4);
  var h8 = hinhTG({ diem: { A: [0, 0], B: B8, C: cong(B8, [7, 0]), D: [7, 0], E: cong(B8, [4, 0]) }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'E', { mau: CAM, day: 3 }]], goc: [['B', 'A', 'E', { r: 1.0 }], ['E', 'A', 'D', { r: 1.2 }]],
    nhan: [['A', 'B', '4 cm'], ['A', 'D', '7 cm', true], ['E', 'C', '?', false, 1, XANH]] });

  // ---------- Cấu hình cảnh cho "Nhìn là hiểu" ----------
  function so(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }
  function qh(them, moTa) { return { ten: 'quayHBH', tuyChon: them, moTa: moTa }; }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  // Ví dụ 3: hai đường chéo dài 10 và 6 (nửa là 5 và 3); ví dụ 4: AB = 8, AD = 5, phân giác góc D
  var A3v = toi([0, 0], 160, 5), B3v = toi([0, 0], 70, 3);
  var hVD3 = hinhTG({ diem: { A: A3v, B: B3v, C: [-A3v[0], -A3v[1]], D: [-B3v[0], -B3v[1]], O: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    nhan: [['O', 'A', '?', false, 0.8, XANH], ['O', 'B', '?', true, 0.8, XANH]], lechTen: { O: [0, -18] }, ghiChu: 'AC = 10 cm, BD = 6 cm' });
  var A4v = toi([0, 0], 60, 5);
  var hVD4 = hinhTG({ diem: { A: A4v, B: cong(A4v, [8, 0]), C: [8, 0], D: [0, 0], E: cong(A4v, [5, 0]) }, vong: ['A', 'B', 'C', 'D'],
    canh: [['D', 'E', { mau: CAM, day: 3 }]], goc: [['A', 'D', 'E', { r: 1.1 }], ['E', 'D', 'C', { r: 1.3 }]],
    nhan: [['D', 'A', '5 cm'], ['D', 'C', '8 cm', true]] });

  // ---------- Hình động ----------
  var LBL = { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700' };
  function fmt(v) { return (Math.round(v * 10) / 10).toString().replace('.', ','); }
  function doGoc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  function cung(board, P, O, Q, mau, r) {
    board.create('nonreflexangle', [P, O, Q], { radius: r || 0.6, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.35, fixed: true, highlight: false });
  }
  function diemPhu(board, ten, fx, fy, o) {
    return board.create('point', [fx, fy], Object.assign({ name: ten, size: 4, color: '#495057', fixed: true, label: LBL, showInfobox: false }, o || {}));
  }

  // Hình bình hành: kéo A, B, D; C = B + D − A.
  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 1.6, 4), B = G.pt('B', 7.6, 4), D = G.pt('D', 0, 0);
    var C = diemPhu(board, 'C', function () { return B.X() + D.X() - A.X(); }, function () { return B.Y() + D.Y() - A.Y(); });
    var O = G.mid(A, C, 'O', { label: { offset: [0, -16], fontSize: 18 } });
    G.poly([A, B, C, D], { fillOpacity: 0.06 });
    G.seg(A, O, { strokeColor: CAM, strokeWidth: 3 }); G.seg(O, C, { strokeColor: CAM, strokeWidth: 3, dash: 2 });
    G.seg(B, O, { strokeColor: TIM, strokeWidth: 3 }); G.seg(O, D, { strokeColor: TIM, strokeWidth: 3, dash: 2 });
    cung(board, D, A, B, XANH); cung(board, B, C, D, XANH);
    G.label(-1.3, 8.2, function () { return 'AB = ' + fmt(G.len(A, B)) + ';  CD = ' + fmt(G.len(C, D)); });
    G.label(5.0, 8.2, function () { return 'AD = ' + fmt(G.len(A, D)) + ';  BC = ' + fmt(G.len(B, C)); });
    G.label(-1.3, 7.4, function () { return 'OA = ' + fmt(G.len(O, A)) + ';  OC = ' + fmt(G.len(O, C)); }, { strokeColor: CAM });
    G.label(5.0, 7.4, function () { return 'OB = ' + fmt(G.len(O, B)) + ';  OD = ' + fmt(G.len(O, D)); }, { strokeColor: TIM });
    G.label(-1.3, 6.6, function () { return 'góc A = ' + Math.round(doGoc(D, A, B)) + '°;  góc C = ' + Math.round(doGoc(B, C, D)) + '°'; }, { strokeColor: XANH });
  };

  // Dấu hiệu theo đường chéo: O cố định là trung điểm của AC và BD.
  var cheoBuild = function (board, G) {
    var O = G.pt('O', 4, 2.6, { fixed: true, label: { offset: [0, -18], fontSize: 18 } });
    var A = G.pt('A', 0.8, 4.4), B = G.pt('B', 6.5, 5);
    var C = diemPhu(board, 'C', function () { return 2 * O.X() - A.X(); }, function () { return 2 * O.Y() - A.Y(); });
    var D = diemPhu(board, 'D', function () { return 2 * O.X() - B.X(); }, function () { return 2 * O.Y() - B.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.06 });
    [[A, O, 1, CAM], [O, C, 1, CAM], [B, O, 2, TIM], [O, D, 2, TIM]].forEach(function (s) {
      board.create('hatch', [G.seg(s[0], s[1], { strokeColor: s[3], strokeWidth: 2 }), s[2]], { strokeColor: s[3], fixed: true });
    });
    G.label(-1.3, 7.7, function () { return 'AB = ' + fmt(G.len(A, B)) + ';  CD = ' + fmt(G.len(C, D)); });
    G.label(5.0, 7.7, function () { return 'AD = ' + fmt(G.len(A, D)) + ';  BC = ' + fmt(G.len(B, C)); });
  };

  // Lưới ô vuông cạnh 1 (vẽ tay cho thưa, lưới mặc định của JSXGraph quá dày).
  function luoiNen(board, x1, x2, y1, y2) {
    var o = { strokeColor: '#e9ecef', strokeWidth: 1, fixed: true, highlight: false };
    for (var x = x1; x <= x2; x++) board.create('segment', [[x, y1], [x, y2]], o);
    for (var y = y1; y <= y2; y++) board.create('segment', [[x1, y], [x2, y]], o);
  }
  // Máy kiểm tra trên lưới: bốn đỉnh đều kéo được, bám vào điểm lưới.
  var kiemTraBuild = function (board, G) {
    luoiNen(board, -1, 9, -1, 6);
    var luoi = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    var A = G.pt('A', 1, 4, luoi), B = G.pt('B', 6, 5, luoi), C = G.pt('C', 7, 1, luoi), D = G.pt('D', 0, 0, luoi);
    G.poly([A, B, C, D], { fillOpacity: 0.08 });
    function v(P, Q) { return [Q.X() - P.X(), Q.Y() - P.Y()]; }
    function ss(P, Q, R, S) { var a = v(P, Q), b = v(R, S); return Math.abs(a[0] * b[1] - a[1] * b[0]) < 1e-6; }
    function bang(P, Q, R, S) { return Math.abs(G.len(P, Q) - G.len(R, S)) < 1e-6; }
    function dau(ok) { return ok ? ' ✓' : ' ✗'; }
    // Ba đỉnh liên tiếp thẳng hàng (hoặc trùng nhau) thì không còn là tứ giác.
    function suyBien() { return ss(A, B, B, C) || ss(B, C, C, D) || ss(C, D, D, A) || ss(D, A, A, B); }
    function laHBH() { return !suyBien() && ss(A, B, D, C) && ss(A, D, B, C); }
    G.label(-0.6, 8.4, function () { return 'AB // CD' + dau(ss(A, B, D, C)) + ';   AD // BC' + dau(ss(A, D, B, C)); });
    G.label(-0.6, 7.6, function () { return 'AB = CD' + dau(bang(A, B, C, D)) + ';   AD = BC' + dau(bang(A, D, B, C)); });
    G.label(-0.6, 6.8, function () {
      if (suyBien()) return 'Có ba đỉnh thẳng hàng – chưa phải tứ giác';
      return laHBH() ? 'ABCD là HÌNH BÌNH HÀNH' : 'Chưa phải hình bình hành – kéo các đỉnh thử xem';
    }, { cssStyle: 'font-weight:700', strokeColor: function () { return laHBH() ? LA : '#868e96'; } });
  };

  TOAN8.bai({
    id: 12, ten: 'Hình bình hành', sgk: { tap: 1, trang: 57 },
    nhin: {
      tieuDe: 'Quay nửa vòng: nửa hình bình hành trùng khít nửa kia', loai: 'chungMinh',
      luuY: 'Cắt theo đường chéo $BD$ và quay như vậy, em được thêm $\\widehat{A} = \\widehat{C}$. Lập luận này chính là $\\triangle ABC = \\triangle CDA$ (g.c.g) trong SGK, chỉ khác là em nhìn thấy nó.',
      canh: { ten: 'quayHBH', tuyChon: { cheo: 'sau' }, moTa: 'Hình bình hành ABCD, O là trung điểm đường chéo AC. Tam giác ABC được cắt ra và quay nửa vòng quanh O, rơi đúng vào tam giác CDA.',
        dongSo: function (p) { return 'Đo: $\\ca{AB} = \\ca{CD} = 6$; $\\cb{AD} = \\cb{BC} = ' + so(p.b) + '$; $\\cc{\\widehat{B}} = \\cc{\\widehat{D}} = ' + p.g + '^\\circ$.'; } },
      buoc: [
        { t: 0, chu: 'Hình bình hành $ABCD$: $AB \\parallel CD$ và $AD \\parallel BC$. $O$ là trung điểm của đường chéo $AC$.' },
        { t: 0.1, chu: 'Cắt theo đường chéo $AC$, tách tam giác $ABC$ ra.' },
        { t: 0.25, chu: 'Quay tam giác $ABC$ nửa vòng quanh $O$. Vì $OA = OC$, đỉnh $A$ đi tới đúng chỗ $C$, đỉnh $C$ đi tới đúng chỗ $A$.' },
        { t: 0.55, chu: 'Quay thì góc giữ nguyên. Mà $\\widehat{BAC} = \\widehat{DCA}$ và $\\widehat{BCA} = \\widehat{DAC}$ (so le trong), nên cạnh $\\ca{AB}$ nằm lên đường $CD$, cạnh $\\cb{CB}$ nằm lên đường $AD$.' },
        { t: 1, chu: 'Hai cạnh đó gặp nhau ở $D$: đỉnh $B$ rơi đúng vào $D$. Tam giác $ABC$ trùng khít tam giác $CDA$.' }
      ],
      ketLuan: '$$\\ca{AB} = \\ca{CD},\\quad \\cb{BC} = \\cb{DA},\\quad \\cc{\\widehat{B}} = \\cc{\\widehat{D}}$$ $B$ quay nửa vòng quanh $O$ thì tới $D$, nên $OB = OD$: hai đường chéo cắt nhau tại trung điểm mỗi đường.',
      dung: {
        tieuDe: 'Quay nửa vòng cho biết hai cạnh còn lại', tuBai: '12.3',
        canh: qh({ a: 9, b: 5, g: 65, nhan: { AB: '9 cm', DA: '5 cm', CD: { dau: '?', cuoi: '9 cm' }, BC: { dau: '?', cuoi: '5 cm' } } },
          'Hình bình hành ABCD có AB 9 cm, AD 5 cm; hai cạnh CD và BC chưa ghi.'),
        moiThu: 'Đề chỉ cho hai cạnh. Quay nửa vòng thì $AB$ nằm lên $CD$, $BC$ nằm lên $DA$. Gõ chu vi; nếu thiếu cạnh nào, hình sẽ tô đỏ cạnh đó.',
        phanUng: [
          { gt: 14, trangThai: 'thieu-CD-BC', loi: 'Em mới cộng $AB + AD$, mới đi nửa vòng quanh hình. Còn hai cạnh đỏ $CD = 9$ và $BC = 5$.' },
          { gt: 18, trangThai: 'thieu-BC-DA', loi: 'Em mới tính hai cạnh dài $9$ cm. Còn hai cạnh đỏ, mỗi cạnh $5$ cm.' },
          { gt: 10, trangThai: 'thieu-AB-CD', loi: 'Em mới tính hai cạnh ngắn $5$ cm. Còn hai cạnh đỏ, mỗi cạnh $9$ cm.' },
          { gt: 23, trangThai: 'thieu-BC', loi: 'Còn thiếu cạnh đỏ $BC = 5$ cm.' },
          { gt: 19, trangThai: 'thieu-CD', loi: 'Còn thiếu cạnh đỏ $CD = 9$ cm.' },
          { gt: 45, loi: '$9 \\cdot 5$ là phép nhân hai cạnh. Chu vi là **tổng** độ dài bốn cạnh.' }
        ],
        dungChu: '$9 + 5 + 9 + 5 = 2 \\cdot (9 + 5) = 28$.', saiChu: 'Chu vi là tổng bốn cạnh. Quay nửa vòng cho thấy $CD = AB$ và $BC = AD$.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng mỗi phần đều có "bạn" đối diện qua O',
        baDe: [
          { tuBai: '12.4', de: 'Hình bình hành $ABCD$ có hai đường chéo cắt nhau tại $O$, $OA = 4$ cm. Tính $AC$ (cm).', dapAn: { kieu: 'so', gt: 8 },
            goiY: ['Quay nửa vòng quanh $O$, $A$ đi tới $C$: $OC = OA$.'], loiGiai: ['$O$ là trung điểm của $AC$ nên $OC = OA = 4$ cm.', '$AC = OA + OC = 4 + 4 = 8$'],
            loiThuongGap: [{ gt: 2, giaiThich: '$OA$ là **một nửa** $AC$, nên phải nhân đôi chứ không chia đôi.' }],
            canh: qh({ a: 6, b: 3.5, g: 60, cheo: true, nhan: { OA: '4', OC: { dau: '?', cuoi: '4' } } }, 'Hình bình hành ABCD có hai đường chéo cắt nhau tại O, OA bằng 4.'), tenNut: 'Quay nửa vòng',
            phanUng: [{ gt: 2, loi: '$OA$ là **một nửa** $AC$: quay nửa vòng, $OA$ nằm lên $OC$. Cả đường chéo là hai nửa.' }, { gt: 4, loi: '$4$ là $OA$, mới là nửa đường chéo. Còn nửa $OC$ nữa.' }],
            dungChu: '$OC = OA = 4$, nên $AC = 8$ cm.', saiChu: 'Quay nửa vòng quanh $O$ thì $A$ tới $C$. Vậy $OC$ bằng bao nhiêu?' },
          { tuBai: '12.9', canh: qh({ a: 6, b: 3.5, g: 60, cat: 'BD', goc: { A: '2x', B: 'x', C: { dau: '?', cuoi: '2x', giai: '120°' } } }, 'Hình bình hành ABCD có góc A gấp đôi góc B. Cắt theo đường chéo BD rồi quay nửa vòng.'), tenNut: 'Quay nửa vòng',
            phanUng: [{ gt: 60, loi: '$60^\\circ$ là góc $B$. Quay nửa vòng, góc $A$ rơi đúng vào góc $C$: $\\widehat{C} = \\widehat{A} = 2 \\cdot 60^\\circ$.' }, { gt: 90, loi: 'Hai góc kề cạnh $AB$ bù nhau: $2x + x = 180^\\circ$. Tìm $x$ trước.' }],
            dungChu: '$2x + x = 180^\\circ$ nên $x = 60^\\circ$, và $\\widehat{C} = \\widehat{A} = 120^\\circ$.', saiChu: 'Góc $A$ và góc $B$ kề cạnh $AB$ nên bù nhau. Quay nửa vòng thì góc $A$ trùng góc $C$.' },
          { tuBai: '12.10', canh: qh({ dang: 'baDiem' }, 'Ba điểm A, B, C không thẳng hàng. Quay tam giác ABC nửa vòng quanh trung điểm một cạnh để được đỉnh thứ tư D.'), tenNut: 'Quay quanh trung điểm AC',
            phanUng: [{ gt: 1, loi: 'Đó mới là một vị trí, khi $AC$ là đường chéo. Đường chéo còn có thể là $AB$, hoặc $BC$.' }, { gt: 2, loi: 'Thử đủ ba cạnh $AB$, $BC$, $CA$: mỗi cạnh làm đường chéo cho một điểm $D$.' }],
            dungChu: 'Quay quanh trung điểm $AC$, $AB$, $BC$: ba vị trí $D$ khác nhau.', saiChu: 'Mỗi đoạn $AB$, $BC$, $CA$ đều có thể là một đường chéo.' }
        ],
        cachNhan: 'Hình bình hành quay nửa vòng quanh giao điểm hai đường chéo thì trùng chính nó. Mỗi phần có một "bạn" đối diện qua $O$: cạnh đối, góc đối, hai nửa đường chéo bằng nhau từng đôi.'
      }
    },
    khamPha: {
      nhiemVu: 'Đây là **hình bình hành** $ABCD$. Kéo $A$, $B$ hoặc $D$ (đỉnh $C$ tự đi theo để các cạnh đối luôn song song). $O$ là giao điểm hai đường chéo.\n\nEm hãy so sánh: các cặp cạnh đối; góc $A$ với góc $C$; đoạn $\\ca{OA}$ với $\\ca{OC}$, đoạn $\\cd{OB}$ với $\\cd{OD}$.',
      widget: 'geo',
      config: { bbox: [-1.5, 8.8, 10, -1.2], build: khamPhaBuild,
        // Kéo lần lượt A, B, D tới vài vị trí (C luôn trong khung): OA = OC, OB = OD và các cạnh đối luôn bằng nhau.
        tuChay: [{ diem: 'A', den: [0.4, 3.2], giay: 2 }, { cho: 1.2 }, { diem: 'A', den: [2.8, 4.4], giay: 2 }, { cho: 1.2 },
          { diem: 'B', den: [9, 5.2], giay: 2 }, { cho: 1.2 }, { diem: 'D', den: [-0.8, 0.8], giay: 2 }, { cho: 1.2 },
          { diem: 'A', den: [1.6, 4], giay: 1.5 }, { diem: 'B', den: [7.6, 4], giay: 1.5 }, { diem: 'D', den: [0, 0], giay: 1.5 }, { cho: 1 }] },
      cauHoi: {
        de: 'Giao điểm $O$ của hai đường chéo nằm ở đâu?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Luôn là trung điểm của **cả hai** đường chéo', 'Chỉ là trung điểm của $AC$', 'Không có quy luật gì'] },
        goiY: ['So $OA$ với $OC$ và $OB$ với $OD$ khi kéo hình tới vài vị trí.'],
        loiGiai: ['Luôn có $OA = OC$ và $OB = OD$: hai đường chéo cắt nhau tại **trung điểm của mỗi đường**.', 'Ngoài ra các cạnh đối luôn bằng nhau và các góc đối luôn bằng nhau.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình bình hành',
        noiDung: '**Hình bình hành** là tứ giác có **các cạnh đối song song**.\n\nTứ giác $ABCD$ là hình bình hành $\\Leftrightarrow$ $AB \\parallel CD$ và $AD \\parallel BC$.\n\n(Hình bình hành cũng là một hình thang đặc biệt.)' },
      { loai: 'dinhLi', tieuDe: 'Tính chất (Định lí 1)',
        noiDung: 'Trong hình bình hành $ABCD$ ($O$ là giao điểm hai đường chéo):\n\na) **Các cạnh đối bằng nhau:** $AB = CD$, $AD = BC$.\n\nb) **Các góc đối bằng nhau:** $\\widehat{A} = \\widehat{C}$, $\\widehat{B} = \\widehat{D}$.\n\nc) **Hai đường chéo cắt nhau tại trung điểm của mỗi đường:** $\\ca{OA} = \\ca{OC}$, $\\cd{OB} = \\cd{OD}$.\n\n**Nhận xét.** Trong hình bình hành, hai góc kề một cạnh bất kì thì **bù nhau**: $\\widehat{A} + \\widehat{B} = 180^\\circ$.' },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết theo cạnh (Định lí 2)',
        noiDung: 'a) Tứ giác có **các cạnh đối bằng nhau** là một hình bình hành.\n\nb) Tứ giác có **một cặp cạnh đối song song và bằng nhau** là một hình bình hành.' },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết theo góc và đường chéo (Định lí 3)',
        noiDung: 'a) Tứ giác có **các góc đối bằng nhau** là một hình bình hành.\n\nb) Tứ giác có **hai đường chéo cắt nhau tại trung điểm của mỗi đường** là một hình bình hành.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1.5, 8.2, 10, -1.2], build: cheoBuild },
        chuThich: 'Hai đoạn $AC$, $BD$ cắt nhau tại trung điểm $O$ của mỗi đoạn (kéo $A$, $B$). Tứ giác $ABCD$ luôn là hình bình hành: các cạnh đối luôn bằng nhau.' },
      { loai: 'chuY', noiDung: '**Tóm tắt 5 cách nhận biết hình bình hành.** Tứ giác có:\n1. Các cạnh đối song song (định nghĩa);\n2. Các cạnh đối bằng nhau;\n3. Một cặp cạnh đối song song **và** bằng nhau;\n4. Các góc đối bằng nhau;\n5. Hai đường chéo cắt nhau tại trung điểm mỗi đường.\n\n**Hay nhầm:** "một cặp cạnh song song, cặp cạnh kia bằng nhau" **không** đủ: hình thang cân cũng như vậy! Ở dấu hiệu 3, **cùng một cặp** cạnh phải vừa song song vừa bằng nhau.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 9, 9, -1], build: kiemTraBuild,
        // Kéo C cho thành hình bình hành (máy báo ✓), rồi đổi thành hình thang cân (máy báo ✗), rồi trả về.
        tuChay: [{ cho: 0.8 }, { diem: 'C', den: [5, 1], giay: 2 }, { cho: 2 }, { diem: 'B', den: [5, 4], giay: 1.5 }, { diem: 'C', den: [6, 0], giay: 1.5 }, { cho: 2 },
          { diem: 'B', den: [6, 5], giay: 1.5 }, { diem: 'C', den: [7, 1], giay: 1.5 }] },
        chuThich: 'Máy kiểm tra: kéo bốn đỉnh (chúng bám vào điểm lưới). Em hãy tạo một hình bình hành, rồi thử tạo một hình thang cân để thấy nó **không** đạt.' }
    ],
    viDu: [
      { de: 'Cho hình bình hành $ABCD$ có $\\widehat{A} = 70^\\circ$. Tính các góc còn lại.',
        canh: qh({ a: 6, b: 3.5, g: 110, cat: 'BD', loCuoi: true, goc: { A: '70°', C: { dau: '?', cuoi: '70°' }, B: { dau: '?', giai: '110°' }, D: { dau: '?', giai: '110°' } } }), buoc: [
        { lam: '$\\widehat{C} = \\widehat{A} = 70^\\circ$', vi: 'Hai góc đối của hình bình hành bằng nhau: quay nửa vòng, góc $A$ rơi đúng vào góc $C$.', canh: { t: 0.9 } },
        { lam: '$\\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$', vi: 'Hai góc kề cạnh $AB$ bù nhau ($AD \\parallel BC$).', canh: { t: 1 } },
        { lam: '$\\widehat{D} = \\widehat{B} = 110^\\circ$', vi: 'Cặp góc đối còn lại.', canh: { t: 1 } } ] },
      { de: 'Hình bình hành $ABCD$ có $AB = 7$ cm, $BC = 4$ cm. Tính chu vi.',
        canh: qh({ a: 7, b: 4, g: 65, loCuoi: true, nhan: { AB: '7', BC: '4', CD: { dau: '?', cuoi: '7' }, DA: { dau: '?', cuoi: '4' } } }), buoc: [
        { lam: '$CD = AB = 7$ cm, $AD = BC = 4$ cm', vi: 'Các cạnh đối của hình bình hành bằng nhau: quay nửa vòng, $AB$ nằm lên $CD$, $BC$ nằm lên $DA$.', canh: { t: 1 } },
        { lam: 'Chu vi $= 2 \\cdot (7 + 4) = 22$ (cm)', vi: 'Chu vi bằng hai lần tổng hai cạnh kề.', canh: { t: 1 } } ] },
      { de: 'Hình bình hành $ABCD$ có hai đường chéo cắt nhau tại $O$, $AC = 10$ cm, $BD = 6$ cm. Tính $OA$ và $OB$.', hinh: hVD3, buoc: [
        { lam: '$OA = AC : 2 = 5$ cm', vi: 'Hai đường chéo cắt nhau tại trung điểm mỗi đường, nên $O$ là trung điểm của $AC$.' },
        { lam: '$OB = BD : 2 = 3$ cm', vi: '$O$ cũng là trung điểm của $BD$.' } ] },
      { de: 'Hình bình hành $ABCD$ có $AB = 8$ cm, $AD = 5$ cm. Tia phân giác của góc $D$ cắt cạnh $AB$ tại $E$. Tính $AE$ và $EB$.', hinh: hVD4, buoc: [
        { lam: '$\\widehat{AED} = \\widehat{EDC}$', vi: '$AB \\parallel CD$ nên đây là hai góc so le trong.' },
        { lam: '$\\widehat{EDC} = \\widehat{ADE}$, nên $\\widehat{AED} = \\widehat{ADE}$', vi: '$DE$ là phân giác góc $D$.' },
        { lam: '$\\triangle ADE$ cân tại $A$: $AE = AD = 5$ cm', vi: 'Tam giác có hai góc bằng nhau là tam giác cân; cạnh đối diện hai góc đó bằng nhau.' },
        { lam: '$EB = AB - AE = 8 - 5 = 3$ (cm)', vi: '$E$ nằm giữa $A$ và $B$.' } ] }
    ],
    viDuMo: [
      { de: 'Hình bình hành $ABCD$ có $\\widehat{A} - \\widehat{B} = 40^\\circ$. Tính $\\widehat{A}$ (độ).', buoc: [
        { lam: '$\\widehat{A} + \\widehat{B} = 180^\\circ$', vi: 'Hai góc kề một cạnh của hình bình hành bù nhau.' },
        { lam: '$\\widehat{A} = (180^\\circ + 40^\\circ) : 2 = 110^\\circ$', vi: 'Em hãy tính $\\widehat{A}$ (độ):', an: true,
          dapAn: { kieu: 'so', gt: 110 },
          loiThuongGap: [{ gt: 70, giaiThich: '$70^\\circ$ là góc nhỏ hơn ($\\widehat{B}$). $\\widehat{A}$ lớn hơn $\\widehat{B}$ $40^\\circ$: $(180 + 40) : 2$.' }] } ] },
      { de: 'Hình bình hành $ABCD$ có hai đường chéo cắt nhau tại $O$, $OA = 3{,}5$ cm. Tính $AC$ (cm).', buoc: [
        { lam: '$O$ là trung điểm của $AC$.', vi: 'Hai đường chéo cắt nhau tại trung điểm mỗi đường.' },
        { lam: '$AC = 2 \\cdot OA = 2 \\cdot 3{,}5 = 7$ (cm)', vi: 'Em hãy tính $AC$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 7 },
          loiThuongGap: [{ gt: 1.75, giaiThich: '$OA$ là **một nửa** $AC$, nên phải nhân đôi chứ không chia đôi.' }] } ] }
    ],
    baiTap: [
      { id: '12.1', khongHinh: 'Câu hỏi định nghĩa, không có số đo để vẽ.', muc: 1, de: 'Hình bình hành là tứ giác có tính chất nào (theo **định nghĩa**)?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Có hai cạnh đối song song', 'Có các cạnh đối song song', 'Có hai đường chéo bằng nhau', 'Có hai cạnh kề bằng nhau'] },
        goiY: ['Chú ý chữ "các": **cả hai** cặp cạnh đối.', 'Tứ giác chỉ có **một** cặp cạnh đối song song là hình thang.'],
        loiGiai: ['Hình bình hành là tứ giác có **các** cạnh đối song song (cả hai cặp).', 'Chỉ một cặp cạnh đối song song thì mới là hình thang.'] },
      { id: '12.2', muc: 1, de: 'Hình bình hành $ABCD$ trong hình có $\\widehat{A} = 115^\\circ$. Tính các góc $B$, $C$, $D$ (độ).', hinh: h2,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$\\widehat{B} =$', kieu: 'so', gt: 65 }, { nhan: '$\\widehat{C} =$', kieu: 'so', gt: 115 }, { nhan: '$\\widehat{D} =$', kieu: 'so', gt: 65 }] },
        goiY: ['Góc đối bằng nhau: $\\widehat{C} = \\widehat{A}$.', 'Hai góc kề một cạnh bù nhau: $\\widehat{B} = 180^\\circ - \\widehat{A}$.'],
        loiGiai: ['$\\widehat{C} = \\widehat{A} = 115^\\circ$ (góc đối).', '$\\widehat{B} = 180^\\circ - 115^\\circ = 65^\\circ$ (hai góc kề cạnh $AB$ bù nhau).', '$\\widehat{D} = \\widehat{B} = 65^\\circ$.'] },
      { id: '12.3', hinhGiai: hg(qh({ a: 9, b: 5, g: 65, nhan: { AB: '9 cm', DA: '5 cm', CD: { dau: '?', cuoi: '9 cm' }, BC: { dau: '?', cuoi: '5 cm' } } })), muc: 1, de: 'Hình bình hành $ABCD$ có $AB = 9$ cm, $AD = 5$ cm. Tính chu vi của nó (cm).',
        dapAn: { kieu: 'so', gt: 28 },
        goiY: ['Các cạnh đối bằng nhau: $CD = AB$, $BC = AD$.', 'Chu vi $= 2 \\cdot (AB + AD)$.'],
        loiGiai: ['$CD = AB = 9$ cm, $BC = AD = 5$ cm.', 'Chu vi $= 2 \\cdot (9 + 5) = 28$'],
        loiThuongGap: [{ gt: 14, giaiThich: '$14$ cm là nửa chu vi ($AB + AD$). Hình bình hành có bốn cạnh: nhân đôi.' }] },
      { id: '12.4', muc: 1, de: 'Hình bình hành $ABCD$ trong hình có hai đường chéo cắt nhau tại $O$, $OA = 4$ cm, $OB = 2{,}5$ cm. Tính $AC$ và $BD$ (cm).', hinh: h4,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$AC =$', kieu: 'so', gt: 8 }, { nhan: '$BD =$', kieu: 'so', gt: 5 }] },
        goiY: ['$O$ là trung điểm của mỗi đường chéo.', '$AC = 2 \\cdot OA$, $BD = 2 \\cdot OB$.'],
        loiGiai: ['$O$ là trung điểm của $AC$ nên $AC = 2 \\cdot 4 = 8$ (cm).', '$O$ là trung điểm của $BD$ nên $BD = 2 \\cdot 2{,}5 = 5$ (cm).'] },
      { id: '12.5', khongHinh: 'Câu chọn dấu hiệu: em tính góc thứ tư bằng số rồi so các góc đối; mỗi phương án là một hình khác nhau.', muc: 2, de: 'Tứ giác $ABCD$ nào dưới đây **chắc chắn** là hình bình hành?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['$\\widehat{A} = 100^\\circ$, $\\widehat{B} = 80^\\circ$, $\\widehat{C} = 100^\\circ$', '$\\widehat{A} = \\widehat{C} = 75^\\circ$, $\\widehat{D} = 90^\\circ$', '$AB \\parallel CD$ và $AD = BC$', '$AC = BD$'] },
        goiY: ['Với hai phương án đầu, tính góc thứ tư rồi xem các góc đối có bằng nhau không.', 'Phương án "$AB \\parallel CD$, $AD = BC$" có thể là hình thang cân.'],
        loiGiai: ['Phương án 1: $\\widehat{D} = 360^\\circ - 280^\\circ = 80^\\circ = \\widehat{B}$ và $\\widehat{A} = \\widehat{C}$: các góc đối bằng nhau nên là **hình bình hành**.', 'Phương án 2: $\\widehat{B} = 360^\\circ - 240^\\circ = 120^\\circ \\ne \\widehat{D}$. Phương án 3 có thể là hình thang cân. Phương án 4 có thể là hình thang cân.'] },
      { id: '12.6', muc: 2, de: 'Tứ giác $ABCD$ trong hình có $\\widehat{A} = 115^\\circ$, $\\widehat{B} = 65^\\circ$, $\\widehat{D} = 70^\\circ$. Khẳng định "$ABCD$ là hình bình hành" đúng hay sai?', hinh: h6,
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Tính góc $C$ bằng tổng bốn góc $360^\\circ$.', 'So sánh cặp góc đối $\\widehat{A}$ và $\\widehat{C}$.'],
        loiGiai: ['$\\widehat{C} = 360^\\circ - (115^\\circ + 65^\\circ + 70^\\circ) = 110^\\circ$.', '$\\widehat{A} = 115^\\circ \\ne 110^\\circ = \\widehat{C}$: hai góc đối không bằng nhau.', 'Vậy $ABCD$ **không** là hình bình hành. Khẳng định **sai**. (Dù $\\widehat{A} + \\widehat{B} = 180^\\circ$ cho $AD \\parallel BC$, nó chỉ là hình thang.)'] },
      { id: '12.7', muc: 2, de: 'Hình bình hành $ABCD$ trong hình có $CD = 10$ cm, $AD = 6$ cm. Tia phân giác của góc $D$ cắt cạnh $AB$ tại $E$. Tính $EB$ (cm).', hinh: h7,
        dapAn: { kieu: 'so', gt: 4 },
        goiY: ['$\\widehat{AED} = \\widehat{EDC}$ (so le trong) $= \\widehat{ADE}$ (phân giác). Tam giác $ADE$ cân tại đâu?', '$AE = AD = 6$; $AB = CD = 10$.'],
        loiGiai: ['$AB \\parallel CD$ nên $\\widehat{AED} = \\widehat{EDC} = \\widehat{ADE}$, do đó $\\triangle ADE$ cân tại $A$: $AE = AD = 6$ cm.', '$AB = CD = 10$ cm (cạnh đối).', '$EB = AB - AE = 10 - 6 = 4$'],
        loiThuongGap: [{ gt: 6, giaiThich: '$6$ cm là $AE$. Đề hỏi phần còn lại $EB = AB - AE$.' }] },
      { id: '12.8', muc: 2, de: 'Hình bình hành $ABCD$ trong hình có $AB = 4$ cm, $AD = 7$ cm. Tia phân giác của góc $A$ cắt cạnh $BC$ tại $E$. Tính $EC$ (cm).', hinh: h8,
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['$AD \\parallel BC$ nên $\\widehat{BEA} = \\widehat{EAD} = \\widehat{BAE}$. Tam giác $ABE$ cân tại $B$.', '$BE = AB = 4$; $BC = AD = 7$.'],
        loiGiai: ['$AD \\parallel BC$ nên $\\widehat{BEA} = \\widehat{EAD}$ (so le trong) $= \\widehat{BAE}$ (phân giác). Vậy $\\triangle ABE$ cân tại $B$: $BE = AB = 4$ cm.', '$BC = AD = 7$ cm.', '$EC = BC - BE = 7 - 4 = 3$'],
        loiThuongGap: [{ gt: 4, giaiThich: '$4$ cm là $BE$. Đề hỏi $EC = BC - BE$.' }] },
      { id: '12.9', hinhGiai: hg(qh({ a: 6, b: 3.5, g: 60, cat: 'BD', goc: { A: '120°', B: '60°', C: { dau: '?', cuoi: '2x', giai: '120°' } } })), muc: 2, de: 'Hình bình hành $ABCD$ có $\\widehat{A} = 2\\widehat{B}$. Tính $\\widehat{C}$ (độ).',
        dapAn: { kieu: 'so', gt: 120 },
        goiY: ['$\\widehat{A} + \\widehat{B} = 180^\\circ$, tức $2\\widehat{B} + \\widehat{B} = 180^\\circ$.', '$\\widehat{C} = \\widehat{A}$ (góc đối).'],
        loiGiai: ['$\\widehat{A} + \\widehat{B} = 180^\\circ$ nên $3\\widehat{B} = 180^\\circ$, $\\widehat{B} = 60^\\circ$, $\\widehat{A} = 120^\\circ$.', '$\\widehat{C} = \\widehat{A} = 120^\\circ$'],
        loiThuongGap: [{ gt: 60, giaiThich: '$60^\\circ$ là $\\widehat{B}$ (và $\\widehat{D}$). $\\widehat{C}$ đối với $\\widehat{A}$ nên bằng $120^\\circ$.' }] },
      { id: '12.10', hinhGiai: hg(qh({ dang: 'baDiem' })), muc: 3, de: 'Cho ba điểm $A$, $B$, $C$ không thẳng hàng. Có **bao nhiêu** điểm $D$ để bốn điểm $A$, $B$, $C$, $D$ là bốn đỉnh của một hình bình hành?',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Mỗi đoạn $AB$, $BC$, $CA$ đều có thể là một **đường chéo** của hình bình hành.', 'Ví dụ $AC$ là đường chéo: $D$ đối xứng với $B$ qua trung điểm $AC$. Còn hai trường hợp nữa.'],
        loiGiai: ['Hai đường chéo cắt nhau tại trung điểm mỗi đường. Chọn đường chéo là $AC$, $AB$ hoặc $BC$; mỗi cách cho một điểm $D$ (đối xứng với đỉnh còn lại qua trung điểm đường chéo).', 'Ba điểm này khác nhau, nên: $\\text{số điểm } D = 3$'],
        loiThuongGap: [{ gt: 1, giaiThich: 'Em mới xét hình bình hành $ABCD$ theo đúng thứ tự. Đường chéo có thể là $AC$, $AB$ hoặc $BC$: có ba vị trí.' }] },
      { id: '12.11', hinhGiai: hg(qh({ a: 6, b: 3.5, g: 115, cat: 'BD', goc: { A: '65°', C: { cuoi: '65°' }, B: { dau: '?', giai: '115°' } } })), muc: 3, de: 'Một sợi dây xích được chia thành bốn đoạn: hai đoạn dài bằng nhau, hai đoạn ngắn bằng nhau, đoạn dài và đoạn ngắn xen kẽ. Móc hai đầu lại và căng thành tứ giác $ABCD$ (đỉnh ở các điểm chia) có $\\widehat{A} = 65^\\circ$. Tính $\\widehat{B}$ (độ).',
        dapAn: { kieu: 'so', gt: 115 },
        goiY: ['Tứ giác $ABCD$ có các cạnh đối bằng nhau: đó là hình gì?', 'Trong hình bình hành, hai góc kề một cạnh bù nhau.'],
        loiGiai: ['Đoạn dài, đoạn ngắn xen kẽ nên $AB = CD$, $BC = DA$: tứ giác có các cạnh đối bằng nhau là **hình bình hành** (Định lí 2a).', '$\\widehat{B} = 180^\\circ - \\widehat{A} = 180^\\circ - 65^\\circ = 115^\\circ$'],
        loiThuongGap: [{ gt: 65, giaiThich: '$\\widehat{B}$ **kề** $\\widehat{A}$ (chung cạnh $AB$) nên bù với nó. Góc bằng $\\widehat{A}$ là góc đối $\\widehat{C}$.' }] }
    ],
    timLoi: [
      { de: 'Tứ giác $ABCD$ có $AB \\parallel CD$ và $AD = BC$. Bạn An kết luận như sau. Dòng nào sai?',
        loiGiaiSai: ['Tứ giác $ABCD$ có $AB \\parallel CD$.', 'Lại có $AD = BC$, nên $ABCD$ là hình bình hành (có một cặp cạnh song song và bằng nhau).', 'Suy ra $\\widehat{A} = \\widehat{C}$.'],
        dongSai: 1,
        giaiThich: 'Dấu hiệu đúng là **cùng một cặp** cạnh đối vừa song song vừa bằng nhau. Ở đây cặp song song là $AB$, $CD$ còn cặp bằng nhau là $AD$, $BC$ – khác nhau. Hình thang cân cũng thoả mãn các điều kiện này.',
        sua: 'Chưa kết luận được $ABCD$ là hình bình hành. Cần, chẳng hạn, $AB \\parallel CD$ **và** $AB = CD$.' },
      { de: 'Hình bình hành $ABCD$ có $\\widehat{A} = 70^\\circ$. Bạn Bình tính $\\widehat{B}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$ABCD$ là hình bình hành.', 'Trong hình bình hành, hai góc kề một cạnh bằng nhau, nên $\\widehat{B} = \\widehat{A}$.', 'Vậy $\\widehat{B} = 70^\\circ$.'],
        dongSai: 1,
        giaiThich: 'Hai góc kề một cạnh của hình bình hành **bù** nhau (tổng $180^\\circ$). Cặp góc **bằng** nhau là hai góc **đối**: $\\widehat{A} = \\widehat{C}$.',
        sua: '$\\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$.' }
    ]
  });
})();
