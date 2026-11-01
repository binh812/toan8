// Bài 14 – Hình thoi và hình vuông (SGK Toán 8 KNTT, Tập 1, tr. 67–73)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hinh = TOAN8.hinhTinh, lerp = TOAN8.hh.lerp, giua = TOAN8.hh.giua;
  function rad(d) { return d * Math.PI / 180; }
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
  // Hình thoi ABCD (A trái, B trên, C phải, D dưới) có nửa hai đường chéo OA = a, OB = b, tâm O ở gốc.
  function thoi(a, b) { return { A: [-a, 0], B: [0, b], C: [a, 0], D: [0, -b], O: [0, 0] }; }
  var VACH4 = { AB: 1, BC: 1, CD: 1, DA: 1 }, CHEO = [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]];

  var h3 = hinhTG({ diem: thoi(4, 4 * Math.tan(rad(35))), vong: ['A', 'B', 'C', 'D'], vach: VACH4, canh: CHEO,
    goc: [['C', 'A', 'B']], soGoc: [['C', 'A', 'B', '35°', 1.3]], lechTen: { O: [10, -16] } });
  var h6 = hinhTG({ diem: thoi(4, 4 * Math.tan(rad(30))), vong: ['A', 'B', 'C', 'D'], vach: VACH4, canh: CHEO,
    goc: [['A', 'B', 'C'], ['C', 'A', 'B', { mau: XANH }]], soGoc: [['A', 'B', 'C', '120°', 0.9], ['C', 'A', 'B', '?', 1.4, XANH]], lechTen: { O: [10, -16] } });
  var h7 = hinhTG({ diem: thoi(8 * Math.cos(rad(30)), 4), vong: ['A', 'B', 'C', 'D'], vach: VACH4,
    canh: [['B', 'D', { mau: TIM, day: 3, net: 2 }]], goc: [['D', 'A', 'B']], soGoc: [['D', 'A', 'B', '60°', 1.2]],
    nhan: [['A', 'B', '8 cm'], ['O', 'B', '?', false, 1.2, TIM]], lechTen: { O: [12, -14] } });
  var h9 = hinhTG({ diem: { A: [0, 6], B: [6, 6], C: [6, 0], D: [0, 0], O: [3, 3] }, vong: ['A', 'B', 'C', 'D'], vach: VACH4, canh: CHEO,
    goc: [['B', 'A', 'D', { mau: '#868e96' }], ['C', 'B', 'A', { mau: '#868e96' }], ['D', 'C', 'B', { mau: '#868e96' }], ['A', 'D', 'C', { mau: '#868e96' }]],
    lechTen: { O: [0, -18] } });
  var A10 = [4, 6], B10 = [0, 0], C10 = [8, 0];
  var h10 = hinhTG({ diem: { A: A10, B: B10, C: C10, D: [2.8, 0], E: lerp(A10, C10, 0.35), F: lerp(A10, B10, 0.65) }, vong: ['A', 'B', 'C'],
    canh: [['D', 'E', { mau: CAM, day: 3 }], ['D', 'F', { mau: XANH, day: 3 }]], vach: { AB: 1, CA: 1 }, lechTen: { D: [0, -18] } });
  var R11 = { A: [0, 12], B: [16, 12], C: [16, 0], D: [0, 0] };
  var h11 = hinhTG({ diem: { A: R11.A, B: R11.B, C: R11.C, D: R11.D, E: giua(R11.A, R11.B), F: giua(R11.B, R11.C), G: giua(R11.C, R11.D), H: giua(R11.D, R11.A) },
    vong: ['A', 'B', 'C', 'D'],
    canh: [['E', 'F', { mau: LA, day: 4 }], ['F', 'G', { mau: LA, day: 4 }], ['G', 'H', { mau: LA, day: 4 }], ['H', 'E', { mau: LA, day: 4 }]],
    nhan: [['D', 'C', '16 m', false, 2], ['D', 'A', '12 m', false, 3]] });

  // ---------- Hình động ----------
  var LBL = { fontSize: 20, offset: [8, 10], cssStyle: 'font-weight:700' };
  function fmt(v) { return (Math.round(v * 10) / 10).toString().replace('.', ','); }
  function doGoc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  function cung(board, P, O, Q, mau, r) {
    board.create('nonreflexangle', [P, O, Q], { radius: r || 0.5, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.35, fixed: true, highlight: false });
  }
  function diemPhu(board, ten, fx, fy) {
    return board.create('point', [fx, fy], { name: ten, size: 4, color: '#495057', fixed: true, label: LBL, showInfobox: false });
  }
  function luoiNen(board, x1, x2, y1, y2) {
    var o = { strokeColor: '#e9ecef', strokeWidth: 1, fixed: true, highlight: false };
    for (var x = x1; x <= x2; x++) board.create('segment', [[x, y1], [x, y2]], o);
    for (var y = y1; y <= y2; y++) board.create('segment', [[x1, y], [x2, y]], o);
  }

  // Máy nhận dạng: hình bình hành ABCD trên lưới (kéo A, B, D), kiểm tra các dấu hiệu, kết luận tên hình.
  var khamPhaBuild = function (board, G) {
    luoiNen(board, -1, 9, -1, 6);
    var luoi = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    var A = G.pt('A', 1, 4, luoi), B = G.pt('B', 6, 4, luoi), D = G.pt('D', 0, 0, luoi);
    var C = diemPhu(board, 'C', function () { return B.X() + D.X() - A.X(); }, function () { return B.Y() + D.Y() - A.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.08 });
    G.seg(A, C, { strokeColor: TIM, strokeWidth: 2, dash: 2 }); G.seg(B, D, { strokeColor: TIM, strokeWidth: 2, dash: 2 });
    cung(board, D, A, B, CAM, 0.6);
    function v(P, Q) { return [Q.X() - P.X(), Q.Y() - P.Y()]; }
    function vuongGoc(u, w) { return Math.abs(u[0] * w[0] + u[1] * w[1]) < 1e-6; }
    function keBang() { return Math.abs(G.len(A, B) - G.len(A, D)) < 1e-6; }
    function gocVuong() { return vuongGoc(v(A, B), v(A, D)); }
    function cheoVuong() { return vuongGoc(v(A, C), v(B, D)); }
    function cheoBang() { return Math.abs(G.len(A, C) - G.len(B, D)) < 1e-6; }
    function dau(ok) { return ok ? ' ✓' : ' ✗'; }
    // A, B, D thẳng hàng (hoặc trùng nhau) thì không còn là hình bình hành.
    function suyBien() { var u = v(A, B), w = v(A, D); return Math.abs(u[0] * w[1] - u[1] * w[0]) < 1e-6; }
    function ten() {
      if (suyBien()) return 'chưa phải tứ giác (A, B, D thẳng hàng)';
      if (keBang() && gocVuong()) return 'HÌNH VUÔNG';
      if (keBang()) return 'HÌNH THOI';
      if (gocVuong()) return 'HÌNH CHỮ NHẬT';
      return 'hình bình hành';
    }
    G.label(-0.8, 9.0, function () { return 'AB = ' + fmt(G.len(A, B)) + '; AD = ' + fmt(G.len(A, D)) + dau(keBang()); }, { strokeColor: XANH, fontSize: 16 });
    G.label(4.6, 9.0, function () { return 'góc A = ' + Math.round(doGoc(D, A, B)) + '°' + dau(gocVuong()); }, { strokeColor: CAM, fontSize: 16 });
    G.label(-0.8, 8.3, function () { return 'AC ⊥ BD' + dau(cheoVuong()); }, { strokeColor: TIM, fontSize: 16 });
    G.label(4.6, 8.3, function () { return 'AC = ' + fmt(G.len(A, C)) + '; BD = ' + fmt(G.len(B, D)) + dau(cheoBang()); }, { strokeColor: TIM, fontSize: 16 });
    G.label(-0.8, 7.5, function () { return 'ABCD là ' + ten(); },
      { cssStyle: 'font-weight:700', strokeColor: function () { return !suyBien() && (keBang() || gocVuong()) ? LA : '#868e96'; } });
  };

  // Hình thoi dựng từ hai đường chéo vuông góc cắt nhau tại trung điểm O.
  var thoiBuild = function (board, G) {
    var O = G.pt('O', 4, 3, { fixed: true, label: { offset: [8, -16], fontSize: 18 } });
    var ngang = board.create('line', [[0, 3], [8, 3]], { visible: false }), doc = board.create('line', [[4, 0], [4, 6]], { visible: false });
    var A = G.glider('A', 0.8, 3, ngang), B = G.glider('B', 4, 5.2, doc);
    A.on('drag', function () { if (A.X() > 3.6) A.moveTo([3.6, 3]); });
    B.on('drag', function () { if (B.Y() < 3.4) B.moveTo([4, 3.4]); });
    var C = diemPhu(board, 'C', function () { return 2 * O.X() - A.X(); }, function () { return 2 * O.Y() - A.Y(); });
    var D = diemPhu(board, 'D', function () { return 2 * O.X() - B.X(); }, function () { return 2 * O.Y() - B.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.08 });
    G.seg(A, C, { strokeColor: TIM, strokeWidth: 2 }); G.seg(B, D, { strokeColor: TIM, strokeWidth: 2 });
    cung(board, B, O, C, '#868e96', 0.4);
    cung(board, B, A, O, CAM, 0.9); cung(board, O, A, D, XANH, 0.9);
    function vuong() { return Math.abs(G.len(O, A) - G.len(O, B)) < 0.06; }
    G.label(-1.3, 8.0, function () { return 'AB = ' + fmt(G.len(A, B)) + '; BC = ' + fmt(G.len(B, C)) + '; CD = ' + fmt(G.len(C, D)) + '; DA = ' + fmt(G.len(D, A)); }, { fontSize: 16 });
    G.label(-1.3, 7.3, function () { return 'góc BAO = ' + Math.round(doGoc(B, A, O)) + '°'; }, { strokeColor: CAM, fontSize: 16 });
    G.label(3.0, 7.3, function () { return 'góc DAO = ' + Math.round(doGoc(D, A, O)) + '°'; }, { strokeColor: XANH, fontSize: 16 });
    G.label(-1.3, 6.6, function () { return vuong() ? 'AC = BD: hình thoi này là HÌNH VUÔNG!' : 'AC = ' + fmt(G.len(A, C)) + '; BD = ' + fmt(G.len(B, D)); },
      { fontSize: 16, cssStyle: 'font-weight:700', strokeColor: function () { return vuong() ? LA : TIM; } });
  };

  TOAN8.bai({
    id: 14, ten: 'Hình thoi và hình vuông', sgk: { tap: 1, trang: 67 },
    khamPha: {
      nhiemVu: 'Đây là **máy nhận dạng**: $ABCD$ luôn là hình bình hành (kéo $A$, $B$, $D$; các đỉnh bám vào điểm lưới, $C$ tự đi theo).\n\nMáy kiểm tra trực tiếp: hai cạnh kề $AB$, $AD$ có bằng nhau không; góc $A$ có vuông không; hai đường chéo có vuông góc, có bằng nhau không. Em hãy kéo để tạo ra **hình thoi**, **hình chữ nhật** và **hình vuông**.',
      widget: 'geo',
      config: { bbox: [-1, 9.6, 9.5, -1], build: khamPhaBuild },
      cauHoi: {
        de: 'Một hình bình hành vừa có hai cạnh kề bằng nhau, vừa có một góc vuông thì là hình gì?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Hình thoi', 'Hình chữ nhật', 'Hình vuông', 'Hình thang cân'] },
        goiY: ['Thử kéo cho $AB = AD$ trước (máy báo hình thoi), rồi chỉnh thêm cho góc $A$ vuông.', 'Ví dụ: $A(0;\\,4)$, $B(4;\\,4)$, $D(0;\\,0)$.'],
        loiGiai: ['Hai cạnh kề bằng nhau: hình thoi. Có góc vuông: hình chữ nhật. Có cả hai: **hình vuông**.', 'Em cũng thấy: khi hai cạnh kề bằng nhau thì hai đường chéo vuông góc; khi góc $A$ vuông thì hai đường chéo bằng nhau.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình thoi',
        noiDung: '**Hình thoi** là tứ giác có **bốn cạnh bằng nhau**.\n\nHình thoi có các cạnh đối bằng nhau nên **là hình bình hành**: nó có mọi tính chất của hình bình hành (các góc đối bằng nhau, hai đường chéo cắt nhau tại trung điểm mỗi đường…).' },
      { loai: 'dinhLi', tieuDe: 'Tính chất đường chéo của hình thoi (Định lí 1)',
        noiDung: 'Trong hình thoi:\n\na) Hai đường chéo **vuông góc** với nhau;\n\nb) Hai đường chéo là các **đường phân giác** của các góc trong hình thoi.\n\nVí dụ: hình thoi $ABCD$ có $AC \\perp BD$ và $\\widehat{BAC} = \\widehat{DAC} = \\frac{\\widehat{A}}{2}$.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1.5, 8.6, 9.5, -0.6], build: thoiBuild },
        chuThich: 'Hai đường chéo vuông góc, cắt nhau tại trung điểm $O$ (kéo $A$ hoặc $B$). Bốn cạnh luôn bằng nhau, đường chéo $AC$ chia góc $A$ thành hai góc bằng nhau. Kéo cho $OA = OB$ để được hình vuông.' },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết hình thoi (Định lí 2)',
        noiDung: 'a) Hình bình hành có **hai cạnh kề bằng nhau** là hình thoi.\n\nb) Hình bình hành có **hai đường chéo vuông góc** với nhau là hình thoi.\n\nc) Hình bình hành có **một đường chéo là đường phân giác của một góc** là hình thoi.\n\n(Và theo định nghĩa: tứ giác có bốn cạnh bằng nhau.)' },
      { loai: 'dinhNghia', tieuDe: 'Hình vuông',
        noiDung: '**Hình vuông** là tứ giác có **bốn góc vuông và bốn cạnh bằng nhau**.\n\nHình vuông vừa là **hình chữ nhật**, vừa là **hình thoi**, nên có tất cả các tính chất của hai hình đó.' },
      { loai: 'dinhLi', tieuDe: 'Đường chéo của hình vuông (Định lí 3)',
        noiDung: 'Trong một hình vuông, hai đường chéo **bằng nhau**, **vuông góc với nhau**, **cắt nhau tại trung điểm mỗi đường** và là các **đường phân giác** của các góc của hình vuông.\n\nVì vậy hai đường chéo chia mỗi góc vuông thành hai góc $45^\\circ$.' },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết hình vuông (Định lí 4)',
        noiDung: 'a) Hình chữ nhật có **hai cạnh kề bằng nhau** là hình vuông.\n\nb) Hình chữ nhật có **hai đường chéo vuông góc** là hình vuông.\n\nc) Hình chữ nhật có **một đường chéo là đường phân giác của một góc** là hình vuông.\n\nChú ý thêm: hình thoi có **một góc vuông** là hình vuông; hình thoi có **hai đường chéo bằng nhau** là hình vuông.' },
      { loai: 'chuY', noiDung: '**Sơ đồ ghi nhớ.**\n- Hình bình hành $+$ (hai cạnh kề bằng nhau **hoặc** hai đường chéo vuông góc) $\\Rightarrow$ **hình thoi**.\n- Hình bình hành $+$ (một góc vuông **hoặc** hai đường chéo bằng nhau) $\\Rightarrow$ **hình chữ nhật**.\n- Hình chữ nhật $+$ dấu hiệu của hình thoi, hoặc hình thoi $+$ dấu hiệu của hình chữ nhật $\\Rightarrow$ **hình vuông**.\n\n**Hay nhầm:** "tứ giác có hai đường chéo vuông góc là hình thoi" là **sai** (hình "cái diều" cũng có hai đường chéo vuông góc). Phải là **hình bình hành** có hai đường chéo vuông góc.' }
    ],
    viDu: [
      { de: 'Hình thoi $ABCD$ có cạnh $AB = 5$ cm. Tính chu vi.', buoc: [
        { lam: '$AB = BC = CD = DA = 5$ cm', vi: 'Hình thoi có bốn cạnh bằng nhau.' },
        { lam: 'Chu vi $= 4 \\cdot 5 = 20$ (cm)', vi: 'Bốn cạnh bằng nhau nên chu vi bằng bốn lần một cạnh.' } ] },
      { de: 'Hình thoi $ABCD$ có $\\widehat{A} = 70^\\circ$. Tính $\\widehat{BAC}$ và $\\widehat{ABD}$.', buoc: [
        { lam: '$\\widehat{BAC} = \\frac{70^\\circ}{2} = 35^\\circ$', vi: 'Đường chéo $AC$ là phân giác của góc $A$.' },
        { lam: '$\\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$', vi: 'Hình thoi là hình bình hành: hai góc kề cạnh $AB$ bù nhau.' },
        { lam: '$\\widehat{ABD} = \\frac{110^\\circ}{2} = 55^\\circ$', vi: 'Đường chéo $BD$ là phân giác của góc $B$.' } ] },
      { de: 'Hai đường tròn tâm $A$ và tâm $C$ có cùng bán kính, cắt nhau tại $B$ và $D$. Tứ giác $ABCD$ là hình gì? Vì sao $AC \\perp BD$?', buoc: [
        { lam: '$AB = AD = CB = CD$ (cùng bằng bán kính).', vi: '$B$, $D$ nằm trên cả hai đường tròn có cùng bán kính.' },
        { lam: '$ABCD$ có bốn cạnh bằng nhau nên là **hình thoi**.', vi: 'Định nghĩa hình thoi.' },
        { lam: 'Do đó $AC \\perp BD$.', vi: 'Hai đường chéo của hình thoi vuông góc (Định lí 1a).' } ] },
      { de: 'Hình vuông $ABCD$ có hai đường chéo cắt nhau tại $O$. Tính $\\widehat{AOB}$ và $\\widehat{OAB}$.', buoc: [
        { lam: '$\\widehat{AOB} = 90^\\circ$', vi: 'Hai đường chéo của hình vuông vuông góc với nhau.' },
        { lam: '$\\widehat{OAB} = \\frac{90^\\circ}{2} = 45^\\circ$', vi: 'Đường chéo $AC$ là phân giác của góc vuông $A$.' } ] }
    ],
    viDuMo: [
      { de: 'Một hình thoi có chu vi $28$ cm. Tính độ dài mỗi cạnh (cm).', buoc: [
        { lam: 'Hình thoi có bốn cạnh bằng nhau.', vi: 'Định nghĩa hình thoi.' },
        { lam: 'Mỗi cạnh $= 28 : 4 = 7$ (cm)', vi: 'Em hãy tính độ dài một cạnh (cm):', an: true,
          dapAn: { kieu: 'so', gt: 7 },
          loiThuongGap: [{ gt: 14, giaiThich: 'Em chia cho $2$ như với nửa chu vi hình chữ nhật. Hình thoi có **bốn** cạnh bằng nhau: chia cho $4$.' }] } ] },
      { de: 'Hình thoi $ABCD$ có $\\widehat{A} = 90^\\circ$. Hỏi $ABCD$ có phải là hình vuông không?', buoc: [
        { lam: 'Hình thoi là hình bình hành; hình bình hành có một góc vuông là hình chữ nhật.', vi: 'Dấu hiệu nhận biết hình chữ nhật.' },
        { lam: '$ABCD$ vừa là hình chữ nhật vừa có bốn cạnh bằng nhau nên là hình vuông.', vi: 'Khẳng định "$ABCD$ là hình vuông" đúng hay sai?', an: true,
          dapAn: { kieu: 'dungSai', gt: true } } ] }
    ],
    baiTap: [
      { id: '14.1', muc: 1, de: 'Theo định nghĩa, hình thoi là:',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Tứ giác có bốn cạnh bằng nhau', 'Tứ giác có hai đường chéo vuông góc', 'Tứ giác có hai cạnh kề bằng nhau', 'Tứ giác có bốn góc bằng nhau'] },
        goiY: ['Nhớ lại định nghĩa trong phần Lý thuyết.', 'Tứ giác có bốn góc bằng nhau là hình chữ nhật.'],
        loiGiai: ['Hình thoi là tứ giác có **bốn cạnh bằng nhau**.'] },
      { id: '14.2', muc: 1, de: 'Một hình thoi có cạnh dài $6$ cm. Tính chu vi của nó (cm).',
        dapAn: { kieu: 'so', gt: 24 },
        goiY: ['Hình thoi có bốn cạnh bằng nhau.'],
        loiGiai: ['Chu vi $= 4 \\cdot 6 = 24$'],
        loiThuongGap: [{ gt: 12, giaiThich: 'Em mới cộng hai cạnh. Hình thoi có **bốn** cạnh, mỗi cạnh $6$ cm.' }] },
      { id: '14.3', muc: 1, de: 'Hình thoi $ABCD$ trong hình có $\\widehat{BAC} = 35^\\circ$. Tính góc $BAD$ (độ).', hinh: h3,
        dapAn: { kieu: 'so', gt: 70 },
        goiY: ['Đường chéo $AC$ là phân giác của góc $BAD$.'],
        loiGiai: ['$AC$ là phân giác của góc $A$ nên $\\widehat{BAD} = 2 \\cdot \\widehat{BAC}$.', '$\\widehat{BAD} = 2 \\cdot 35^\\circ = 70^\\circ$'],
        loiThuongGap: [{ gt: 17.5, giaiThich: '$35^\\circ$ là **một nửa** góc $A$, nên phải nhân đôi.' }] },
      { id: '14.4', muc: 1, de: 'Hình nào dưới đây **chắc chắn** là hình vuông?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hình chữ nhật có hai cạnh kề bằng nhau', 'Hình thoi có hai cạnh kề bằng nhau', 'Hình bình hành có hai đường chéo bằng nhau', 'Tứ giác có hai đường chéo vuông góc'] },
        goiY: ['Hình vuông = vừa là hình chữ nhật, vừa là hình thoi.', 'Hình thoi thì vốn đã có hai cạnh kề bằng nhau, điều kiện đó không thêm gì mới.'],
        loiGiai: ['Hình chữ nhật có hai cạnh kề bằng nhau là hình vuông (Định lí 4a).', 'Hình thoi có hai cạnh kề bằng nhau chỉ là hình thoi; hình bình hành có hai đường chéo bằng nhau chỉ là hình chữ nhật; tứ giác có hai đường chéo vuông góc có thể là hình "cái diều".'] },
      { id: '14.5', muc: 2, de: 'Hình bình hành $ABCD$ có hai đường chéo $AC \\perp BD$ là hình gì?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Hình chữ nhật', 'Hình thoi', 'Hình vuông', 'Hình thang cân'] },
        goiY: ['Xem lại dấu hiệu nhận biết hình thoi.', 'Chưa có góc vuông nên chưa chắc là hình vuông.'],
        loiGiai: ['Hình bình hành có hai đường chéo vuông góc là **hình thoi** (Định lí 2b).', 'Muốn là hình vuông cần thêm, chẳng hạn, một góc vuông.'] },
      { id: '14.6', muc: 2, de: 'Hình thoi $ABCD$ trong hình có $\\widehat{ABC} = 120^\\circ$. Tính góc $BAC$ (độ).', hinh: h6,
        dapAn: { kieu: 'so', gt: 30 },
        goiY: ['Hai góc kề cạnh $AB$ bù nhau: $\\widehat{BAD} = 180^\\circ - 120^\\circ$.', 'Đường chéo $AC$ là phân giác của góc $BAD$.'],
        loiGiai: ['$\\widehat{BAD} = 180^\\circ - 120^\\circ = 60^\\circ$ (hình thoi là hình bình hành).', '$AC$ là phân giác góc $A$: $\\widehat{BAC} = \\frac{60^\\circ}{2} = 30^\\circ$'],
        loiThuongGap: [{ gt: 60, giaiThich: '$60^\\circ$ là cả góc $BAD$. Đường chéo $AC$ chia nó làm đôi.' }, { gt: 120, giaiThich: '$\\widehat{BAD}$ kề với $\\widehat{ABC}$ (chung cạnh $AB$) nên bù với nó, không bằng nó.' }] },
      { id: '14.7', muc: 2, de: 'Hình thoi $ABCD$ trong hình có cạnh $8$ cm và $\\widehat{A} = 60^\\circ$. Tính đường chéo $BD$ (cm).', hinh: h7,
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Tam giác $ABD$ có $AB = AD$: là tam giác cân. Góc ở đỉnh bằng $60^\\circ$ thì sao?', 'Tam giác cân có một góc $60^\\circ$ là tam giác đều.'],
        loiGiai: ['$AB = AD$ (cạnh hình thoi) nên $\\triangle ABD$ cân tại $A$, lại có $\\widehat{A} = 60^\\circ$ nên $\\triangle ABD$ đều.', '$BD = AB = 8$'],
        loiThuongGap: [{ gt: 4, giaiThich: '$4$ cm là $OB$ (nửa đường chéo). Cả đường chéo $BD$ bằng cạnh tam giác đều $ABD$.' }] },
      { id: '14.8', muc: 2, de: 'Khẳng định "Hình thoi có hai đường chéo bằng nhau là hình vuông" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Hình thoi là hình bình hành. Hình bình hành có hai đường chéo bằng nhau là hình gì?'],
        loiGiai: ['Hình thoi là hình bình hành; có hai đường chéo bằng nhau nên là hình chữ nhật.', 'Vừa là hình chữ nhật vừa là hình thoi nên là hình vuông. Khẳng định **đúng**.'] },
      { id: '14.9', muc: 2, de: 'Hình vuông $ABCD$ trong hình có hai đường chéo cắt nhau tại $O$. Tính $\\widehat{AOB}$ và $\\widehat{OAB}$ (độ).', hinh: h9,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$\\widehat{AOB} =$', kieu: 'so', gt: 90 }, { nhan: '$\\widehat{OAB} =$', kieu: 'so', gt: 45 }] },
        goiY: ['Hai đường chéo của hình vuông vuông góc với nhau.', 'Đường chéo là phân giác của góc vuông.'],
        loiGiai: ['$AC \\perp BD$ nên $\\widehat{AOB} = 90^\\circ$.', '$AC$ là phân giác góc $A$ nên $\\widehat{OAB} = 90^\\circ : 2 = 45^\\circ$.'] },
      { id: '14.10', muc: 3, de: 'Tam giác $ABC$ cân tại $A$, $D$ là điểm trên cạnh $BC$. Qua $D$ kẻ $DE \\parallel AB$ ($E \\in AC$) và $DF \\parallel AC$ ($F \\in AB$) như hình. Tứ giác $AEDF$ luôn là hình bình hành. Điểm $D$ ở vị trí nào thì $AEDF$ là **hình thoi**?', hinh: h10,
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['$D$ là trung điểm của $BC$', '$D$ trùng với $B$', '$D$ là điểm sao cho $BD = 2DC$', 'Mọi vị trí của $D$'] },
        goiY: ['Hình bình hành $AEDF$ là hình thoi khi đường chéo $AD$ là phân giác góc $A$.', 'Trong tam giác cân tại $A$, phân giác góc $A$ cắt $BC$ tại đâu?'],
        loiGiai: ['$AEDF$ là hình bình hành; nó là hình thoi khi đường chéo $AD$ là tia phân giác của góc $A$ (Định lí 2c).', 'Tam giác $ABC$ cân tại $A$ nên phân giác góc $A$ cũng là trung tuyến: $D$ là **trung điểm** của $BC$.'] },
      { id: '14.11', muc: 3, de: 'Một mảnh vườn hình chữ nhật dài $16$ m, rộng $12$ m. Nối trung điểm bốn cạnh, ta được một luống hoa (màu xanh trong hình) có dạng hình thoi. Tính diện tích luống hoa (m²).', hinh: h11,
        dapAn: { kieu: 'so', gt: 96 },
        goiY: ['Hai đường chéo của luống hoa hình thoi chính là hai đoạn nối trung điểm các cạnh đối của hình chữ nhật: dài $16$ m và $12$ m.', 'Diện tích hình thoi $= \\frac{1}{2} \\cdot d_1 \\cdot d_2$.'],
        loiGiai: ['Hai đường chéo của hình thoi $EFGH$ là $EG = 12$ m (bằng chiều rộng) và $FH = 16$ m (bằng chiều dài).', 'Diện tích $= \\frac{1}{2} \\cdot 16 \\cdot 12 = 96$'],
        loiThuongGap: [{ gt: 192, giaiThich: '$192$ m² là diện tích cả mảnh vườn. Diện tích hình thoi bằng **nửa** tích hai đường chéo.' }] }
    ],
    timLoi: [
      { de: 'Tứ giác $MNPQ$ có $MN = MQ$, $PN = PQ$ (hình "cái diều"), nên hai đường chéo $MP \\perp NQ$. Bạn Hùng kết luận như sau. Dòng nào sai?',
        loiGiaiSai: ['Tứ giác $MNPQ$ có hai đường chéo $MP \\perp NQ$.', 'Tứ giác có hai đường chéo vuông góc là hình thoi.', 'Vậy $MNPQ$ là hình thoi, suy ra $MN = NP$.'],
        dongSai: 1,
        giaiThich: 'Chỉ **hình bình hành** có hai đường chéo vuông góc mới là hình thoi. Hình "cái diều" có hai đường chéo vuông góc nhưng $MN$ thường khác $NP$.',
        sua: 'Chưa kết luận được. $MNPQ$ chỉ là hình thoi khi có thêm $MN = NP$ (bốn cạnh bằng nhau).' },
      { de: 'Hình thoi $ABCD$ có $\\widehat{A} = 80^\\circ$. Bạn Mai tính $\\widehat{ABD}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$BD$ là phân giác của góc $B$.', '$\\widehat{B} = \\widehat{A} = 80^\\circ$.', '$\\widehat{ABD} = 80^\\circ : 2 = 40^\\circ$.'],
        dongSai: 1,
        giaiThich: '$\\widehat{A}$ và $\\widehat{B}$ là hai góc **kề** cạnh $AB$ của hình thoi (hình bình hành) nên **bù** nhau. Góc bằng $\\widehat{A}$ là góc đối $\\widehat{C}$.',
        sua: '$\\widehat{B} = 180^\\circ - 80^\\circ = 100^\\circ$, nên $\\widehat{ABD} = 50^\\circ$.' }
    ]
  });
})();
