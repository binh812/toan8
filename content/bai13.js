// Bài 13 – Hình chữ nhật (SGK Toán 8 KNTT, Tập 1, tr. 64–66)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hinh = TOAN8.hinhTinh, lerp = TOAN8.hh.lerp;
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
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
  var VUONG = { mau: '#868e96' };

  var h2 = hinhTG({ diem: { A: [0, 7.2], B: [9.6, 7.2], C: [9.6, 0], D: [0, 0], O: [4.8, 3.6] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    goc: [['B', 'A', 'D', VUONG], ['C', 'B', 'A', VUONG], ['D', 'C', 'B', VUONG], ['A', 'D', 'C', VUONG]],
    nhan: [['O', 'B', '?', false, 1, XANH]], lechTen: { O: [0, -18] }, ghiChu: 'AC = 12 cm' });
  var h3 = hinhTG({ diem: { A: [0, 0], B: [0, 9], C: [12, 0], M: [6, 4.5] }, vong: ['A', 'B', 'C'],
    canh: [['A', 'M', { mau: TIM, day: 3 }]], goc: [['C', 'A', 'B', VUONG]],
    nhan: [['B', 'C', '15 cm'], ['A', 'M', '?', false, 1, XANH]] });
  var M7 = [4, 0], A7 = toi(M7, 115, 4);
  var h7 = hinhTG({ diem: { A: A7, B: [0, 0], C: [8, 0], M: M7 }, vong: ['A', 'B', 'C'], vach: {},
    canh: [['A', 'M', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
    nhan: [['A', 'M', '4 cm', true, 1, TIM]], ghiChu: 'BC = 8 cm',
    soGoc: [['B', 'A', 'C', '?', 1, XANH]], goc: [['B', 'A', 'C', { mau: XANH }]], lechTen: { M: [0, -18] } });
  var A8 = toi([0, 0], 150, 4), B8 = toi([0, 0], 30, 4);
  var h8 = hinhTG({ diem: { A: A8, B: B8, C: [-A8[0], -A8[1]], D: [-B8[0], -B8[1]], O: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    goc: [['A', 'O', 'B'], ['O', 'A', 'B', { mau: XANH }]],
    soGoc: [['A', 'O', 'B', '120°', 0.6], ['O', 'A', 'B', '?', 1, XANH]], lechTen: { O: [0, -18] } });
  var h9 = hinhTG({ diem: { A: [0, 6], B: [10, 6], C: [10, 0], D: [0, 0], O: [5, 3], H: [5, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }], ['O', 'H', { mau: CAM, day: 2 }]],
    goc: [['O', 'H', 'C', { mau: CAM }]],
    nhan: [['D', 'H', '?', true, 0.9, XANH]], lechTen: { H: [0, -18], O: [0, 18] }, ghiChu: 'DC = 10 cm' });
  var h10 = hinhTG({ diem: { A: [0, 8], B: [0, 0], C: [16, 0], D: [16, 8], M: [8, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['M', 'A', { mau: TIM, day: 3 }], ['M', 'D', { mau: TIM, day: 3 }], ['B', 'M', { vach: 1 }], ['M', 'C', { vach: 1 }]],
    goc: [['A', 'M', 'D', { mau: TIM }]], lechTen: { M: [0, -18] } });
  var B11 = [7.071, 0], C11 = [0, 7.071], M11 = lerp(B11, C11, 0.35);
  var h11 = hinhTG({ diem: { A: [0, 0], B: B11, C: C11, M: M11, N: [M11[0], 0], P: [0, M11[1]] }, vong: ['A', 'B', 'C'],
    canh: [['M', 'N', { mau: TIM, day: 2 }], ['M', 'P', { mau: TIM, day: 2 }], ['N', 'P', { mau: CAM, day: 3, net: 2 }]],
    goc: [['B', 'A', 'C', VUONG], ['M', 'N', 'A', VUONG], ['A', 'P', 'M', VUONG]],
    nhan: [['B', 'C', 'BC = 10 cm', false, 1.2]], lechTen: { N: [0, -18], P: [-18, 0] } });

  // ---------- Cấu hình cảnh cho "Nhìn là hiểu" ----------
  function so(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }
  function ht(them, moTa) { return { ten: 'haiThanh', tuyChon: them, moTa: moTa }; }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1, thamSo: { trangThai: 'giai' } }, c) }; }
  // Góc giữa hai đường chéo của hình chữ nhật dài a, rộng b (góc nhìn cạnh a từ tâm)
  function gocCheo(a, b) { return 2 * Math.atan2(a, b) * 180 / Math.PI; }
  var hVD3 = hinhTG({ diem: { A: [0, 4], B: [7, 4], C: [7, 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'], goc: [['B', 'A', 'D', VUONG]],
    soGoc: [['A', 'B', 'C', '?', 1, XANH], ['B', 'C', 'D', '?', 1, XANH], ['C', 'D', 'A', '?', 1, XANH]], ghiChu: 'Hình bình hành có góc A vuông' });

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

  // Hai thanh tre dài bằng nhau gắn tại trung điểm O: A, B chạy trên đường tròn tâm O, C, D đối xứng qua O.
  var khamPhaBuild = function (board, G) {
    var O = G.pt('O', 4, 2.8, { fixed: true, label: { offset: [0, -18], fontSize: 18 } });
    var tron = board.create('circle', [O, 3.2], { strokeColor: '#e9ecef', strokeWidth: 1, dash: 2, fixed: true, highlight: false });
    var A = G.glider('A', 4 - 2.77, 4.4, tron), B = G.glider('B', 4 + 2.77, 4.4, tron);
    var C = diemPhu(board, 'C', function () { return 2 * O.X() - A.X(); }, function () { return 2 * O.Y() - A.Y(); });
    var D = diemPhu(board, 'D', function () { return 2 * O.X() - B.X(); }, function () { return 2 * O.Y() - B.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.07, borders: { strokeWidth: 2 } });
    G.seg(A, C, { strokeColor: LA, strokeWidth: 7, strokeOpacity: 0.8 }); G.seg(B, D, { strokeColor: LA, strokeWidth: 7, strokeOpacity: 0.8 });
    cung(board, D, A, B, CAM); cung(board, A, B, C, CAM); cung(board, B, C, D, CAM); cung(board, C, D, A, CAM);
    G.label(-1.3, 8.0, function () {
      return 'góc A = ' + Math.round(doGoc(D, A, B)) + '°;  góc B = ' + Math.round(doGoc(A, B, C)) + '°;  góc C = ' + Math.round(doGoc(B, C, D)) + '°;  góc D = ' + Math.round(doGoc(C, D, A)) + '°';
    }, { strokeColor: CAM, fontSize: 16 });
    G.label(-1.3, 7.2, function () { return 'Thanh AC = ' + fmt(G.len(A, C)) + ';  thanh BD = ' + fmt(G.len(B, D)); }, { strokeColor: LA, fontSize: 16 });
  };

  // Trung tuyến ứng với cạnh huyền: A chạy trên đường tròn đường kính BC.
  var trungTuyenBuild = function (board, G) {
    var B = G.pt('B', 0, 0), C = G.pt('C', 8, 0);
    var M = G.mid(B, C, 'M', { label: { offset: [0, -18], fontSize: 18 } });
    var tron = board.create('circle', [M, B], { strokeColor: '#dee2e6', strokeWidth: 1, dash: 2, fixed: true, highlight: false });
    var A = G.glider('A', 2.4, 3.67, tron);
    G.poly([A, B, C], { fillOpacity: 0.06 });
    G.seg(A, M, { strokeColor: TIM, strokeWidth: 4 });
    G.seg(B, M, { strokeColor: XANH, strokeWidth: 4 }); G.seg(M, C, { strokeColor: XANH, strokeWidth: 4 });
    cung(board, B, A, C, CAM, 0.6);
    G.label(-1.3, 6.9, function () { return 'góc BAC = ' + Math.round(doGoc(B, A, C)) + '°'; }, { strokeColor: CAM });
    G.label(3.2, 6.9, function () { return 'AM = ' + fmt(G.len(A, M)) + ';  BC : 2 = ' + fmt(G.len(B, C) / 2); }, { strokeColor: TIM });
  };

  // Máy kiểm tra trên lưới: hình bình hành ABCD (kéo A, B, D), khi nào là hình chữ nhật?
  var kiemTraBuild = function (board, G) {
    luoiNen(board, -1, 9, -1, 6);
    var luoi = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    var A = G.pt('A', 1, 4, luoi), B = G.pt('B', 7, 5, luoi), D = G.pt('D', 0, 0, luoi);
    var C = diemPhu(board, 'C', function () { return B.X() + D.X() - A.X(); }, function () { return B.Y() + D.Y() - A.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.08 });
    G.seg(A, C, { strokeColor: TIM, strokeWidth: 2, dash: 2 }); G.seg(B, D, { strokeColor: TIM, strokeWidth: 2, dash: 2 });
    cung(board, D, A, B, CAM, 0.6);
    // A, B, D thẳng hàng (hoặc trùng nhau) thì không còn là hình bình hành.
    function suyBien() { return Math.abs((B.X() - A.X()) * (D.Y() - A.Y()) - (B.Y() - A.Y()) * (D.X() - A.X())) < 1e-6; }
    function vuong() { return !suyBien() && Math.abs((B.X() - A.X()) * (D.X() - A.X()) + (B.Y() - A.Y()) * (D.Y() - A.Y())) < 1e-6; }
    function cheoBang() { return Math.abs(G.len(A, C) - G.len(B, D)) < 1e-6; }
    G.label(-0.6, 8.4, function () { return 'góc A = ' + Math.round(doGoc(D, A, B)) + '°' + (vuong() ? ' ✓' : ' ✗'); }, { strokeColor: CAM });
    G.label(3.4, 8.4, function () { return 'AC = ' + fmt(G.len(A, C)) + ';  BD = ' + fmt(G.len(B, D)) + (cheoBang() ? ' ✓' : ' ✗'); }, { strokeColor: TIM });
    G.label(-0.6, 7.6, function () { if (suyBien()) return 'A, B, D thẳng hàng – chưa phải tứ giác'; return vuong() ?'HÌNH CHỮ NHẬT (có góc vuông, hai đường chéo bằng nhau)' : 'Hình bình hành – kéo cho góc A vuông xem'; },
      { cssStyle: 'font-weight:700', strokeColor: function () { return vuong() ? LA : '#868e96'; } });
  };

  TOAN8.bai({
    id: 13, ten: 'Hình chữ nhật', sgk: { tap: 1, trang: 64 },
    nhin: {
      tieuDe: 'Hai thanh bằng nhau, gắn ở trung điểm: góc nào cũng vuông', loai: 'chungMinh',
      luuY: 'Kéo thanh "Góc giữa hai thanh": $x$ và $y$ đổi, nhưng $x + y$ luôn là $90^\\circ$. Chiều ngược lại (hình chữ nhật có hai đường chéo bằng nhau, cắt nhau tại trung điểm) đúng vì hình chữ nhật vừa là hình bình hành vừa là hình thang cân.',
      canh: { ten: 'haiThanh', tuyChon: { chungMinh: true }, moTa: 'Hai thanh xanh bằng nhau AC và BD gắn ở trung điểm O. Tam giác ABC gồm hai tam giác cân; bốn góc x, x, y, y của nó được ghép thành nửa vòng tròn, phần của góc B đúng một góc vuông.',
        dongSo: function (p) { return 'Lúc này $\\ca{x} = ' + so((180 - p.phi) / 2) + '^\\circ$, $\\cb{y} = ' + so(p.phi / 2) + '^\\circ$, và $\\ca{x} + \\cb{y} = 90^\\circ$.'; } },
      buoc: [
        { t: 0, chu: 'Hai thanh $AC$, $BD$ dài bằng nhau, gắn với nhau tại trung điểm $O$ của mỗi thanh. Vậy $OA = OB = OC = OD$.' },
        { t: 0.1, chu: 'Nối bốn đầu thanh, được tứ giác $ABCD$. Ta xem góc $B$.' },
        { t: 0.25, chu: '$OA = OB$ nên tam giác $OAB$ cân: hai góc ở đáy bằng nhau, gọi là $\\ca{x}$. $OB = OC$ nên tam giác $OBC$ cân, hai góc ở đáy là $\\cb{y}$.' },
        { t: 0.45, chu: 'Tam giác $ABC$ có ba góc: $\\ca{x}$ ở $A$, $\\ca{x} + \\cb{y}$ ở $B$, $\\cb{y}$ ở $C$. Đặt bốn phần sát nhau: chúng ghép đủ nửa vòng, $180^\\circ$.' },
        { t: 0.9, chu: 'Hai phần $\\ca{x}$ ghép với hai phần $\\cb{y}$ được $180^\\circ$, nên phần của góc $B$ là $\\ca{x} + \\cb{y} = 90^\\circ$. Làm như vậy ở mỗi đỉnh: bốn góc đều vuông.' }
      ],
      ketLuan: 'Tứ giác có hai đường chéo **bằng nhau** và **cắt nhau tại trung điểm mỗi đường** là hình chữ nhật: $$\\widehat{A} = \\widehat{B} = \\widehat{C} = \\widehat{D} = 90^\\circ$$',
      dung: {
        tieuDe: 'Đặt thêm một đỉnh, tam giác vuông thành hình chữ nhật', tuBai: '13.3',
        canh: ht({ dang: 'trungTuyen', ab: 9, ac: 12, thuDoan: 'AM', nhan: { BC: '15 cm', AM: { dau: '?', giai: '7,5 cm' } } },
          'Tam giác ABC vuông tại A, cạnh huyền BC 15 cm, M là trung điểm BC. Kéo dài AM thêm một đoạn bằng nó tới D: ABDC là hình chữ nhật.'),
        moiThu: 'Kéo dài $AM$ thêm một đoạn bằng nó tới $D$: hai thanh $AD$ và $BC$ cắt nhau tại trung điểm $M$. Gõ độ dài $AM$; nếu sai, hình sẽ vẽ từ $A$ một đoạn đỏ dài đúng như em gõ.',
        phanUng: [
          { gt: 15, loi: '$15$ là cả thanh $BC$, cũng là cả thanh $AD$. $M$ là trung điểm nên $AM$ chỉ bằng một nửa thanh.' },
          { gt: 30, loi: 'Ngược rồi: $AM$ là **nửa** thanh $AD = BC$, không phải gấp đôi.' }
        ],
        soBatKi: function (v) {
          if (v <= 0) return { t: 1, loi: 'Độ dài phải lớn hơn $0$.' };
          return { thamSo: { thu: v }, t: 1, loi: v < 7.5 ? 'Đoạn đỏ dài $' + so(v) + '$ cm từ $A$ chưa tới trung điểm $M$ của $BC$.' : 'Đoạn đỏ dài $' + so(v) + '$ cm từ $A$ đã đi quá trung điểm $M$.' };
        },
        dungChu: 'Hình chữ nhật $ABDC$ có hai đường chéo bằng nhau: $AD = BC = 15$. $M$ là trung điểm của $AD$, nên $AM = 15 : 2 = 7{,}5$.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng hai thanh vẫn nấp trong hình',
        baDe: [
          { tuBai: '13.2', canh: ht({ phi: gocCheo(9.6, 7.2), L: 6, nhan: { AC: '12 cm', OB: { dau: '?', giai: '6 cm' } } }, 'Hình chữ nhật ABCD, đường chéo AC 12 cm, O là giao điểm hai đường chéo.'), tenNut: 'Tìm hai thanh',
            phanUng: [{ gt: 12, loi: '$12$ là cả thanh $BD$ (bằng thanh $AC$). $OB$ chỉ là nửa thanh.' }, { gt: 24, loi: '$OB$ là **nửa** thanh $BD$, mà $BD = AC = 12$.' }],
            dungChu: '$BD = AC = 12$, $O$ là trung điểm nên $OB = 6$ cm.', saiChu: 'Hai thanh $AC$, $BD$ bằng nhau và gắn ở trung điểm $O$.' },
          { tuBai: '13.8', canh: ht({ phi: 120, goc: { AOB: '120°', OAB: { dau: '?', giai: '30°' } }, to: 'OAB' }, 'Hình chữ nhật ABCD, góc AOB giữa hai đường chéo bằng 120 độ.'), tenNut: 'Tìm hai thanh',
            phanUng: [{ gt: 60, loi: '$60^\\circ$ là tổng **hai** góc ở đáy của tam giác cân $OAB$. Mỗi góc một nửa.' }, { gt: 120, loi: '$120^\\circ$ là góc ở đỉnh $O$. Góc $OAB$ là góc ở đáy của tam giác cân $OAB$.' }],
            dungChu: '$OA = OB$ (hai nửa thanh) nên $\\widehat{OAB} = (180^\\circ - 120^\\circ) : 2 = 30^\\circ$.', saiChu: 'Hai nửa thanh $OA$, $OB$ bằng nhau: tam giác $OAB$ cân tại $O$.' },
          { tuBai: '13.7', canh: ht({ dang: 'trungTuyen', bc: 8, gocB: 32, vuongA: false, nhan: { BC: '8 cm', AM: '4 cm' }, goc: { A: { dau: '?', giai: '90°' } } }, 'Tam giác ABC, M là trung điểm BC, BC 8 cm, AM 4 cm. Hỏi góc BAC.'), tenNut: 'Tìm hai thanh',
            phanUng: [{ gt: 60, loi: 'Kéo dài $AM$ thêm $4$ cm tới $D$: hai thanh $AD$, $BC$ đều dài $8$ cm và cắt nhau tại trung điểm. Tứ giác $ABDC$ là hình gì?' }, { gt: 45, loi: 'Hai thanh bằng nhau cắt nhau tại trung điểm tạo ra hình chữ nhật: góc ở đỉnh $A$ là góc gì?' }],
            dungChu: '$AD = BC = 8$ và cắt nhau tại trung điểm $M$: $ABDC$ là hình chữ nhật, nên $\\widehat{BAC} = 90^\\circ$.', saiChu: 'Kéo dài $AM$ thêm một đoạn bằng nó: hai thanh bằng nhau, cắt nhau tại trung điểm.' }
        ],
        cachNhan: 'Thấy hai đoạn bằng nhau cắt nhau tại trung điểm của mỗi đoạn (hai đường chéo hình chữ nhật, hay trung tuyến bằng nửa cạnh): đó là hai thanh của một hình chữ nhật. Bốn nửa thanh bằng nhau, bốn góc ở đỉnh đều vuông.'
      }
    },
    khamPha: {
      nhiemVu: 'Hai **thanh tre** xanh dài bằng nhau được gắn với nhau tại **trung điểm** $O$ của mỗi thanh. Bốn đầu mút $A$, $B$, $C$, $D$ tạo thành một tứ giác.\n\nKéo đầu mút $A$ hoặc $B$ để xoay thanh tre. Em hãy quan sát số đo bốn góc của tứ giác $ABCD$.',
      widget: 'geo',
      config: { bbox: [-1.5, 8.6, 9.5, -1], build: khamPhaBuild },
      cauHoi: {
        de: 'Dù xoay thế nào, mỗi góc của tứ giác $ABCD$ luôn bằng bao nhiêu độ?',
        dapAn: { kieu: 'so', gt: 90 },
        goiY: ['Đọc dòng số đo các góc khi kéo $A$, $B$ tới vài vị trí.'],
        loiGiai: ['Bốn góc luôn bằng $90^\\circ$: tứ giác $ABCD$ luôn là **hình chữ nhật**.', 'Lí do: hai đường chéo (hai thanh tre) **bằng nhau** và **cắt nhau tại trung điểm mỗi đường**.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình chữ nhật',
        noiDung: '**Hình chữ nhật** là tứ giác có **bốn góc vuông**.\n\n**Chú ý.** Nếu một tứ giác có **ba góc vuông** thì góc còn lại cũng vuông ($360^\\circ - 3 \\cdot 90^\\circ = 90^\\circ$), và tứ giác đó là hình chữ nhật.' },
      { loai: 'chuY', noiDung: 'Hình chữ nhật **là hình bình hành** (các góc đối bằng nhau) và **là hình thang cân** (hai góc kề một đáy bằng nhau). Vì vậy hình chữ nhật có **tất cả** tính chất của hình bình hành và của hình thang cân.' },
      { loai: 'dinhLi', tieuDe: 'Tính chất đường chéo (Định lí 1)',
        noiDung: 'Trong hình chữ nhật, **hai đường chéo bằng nhau** và **cắt nhau tại trung điểm của mỗi đường**.\n\nHình chữ nhật $ABCD$, $O$ là giao điểm hai đường chéo: $AC = BD$ và $OA = OB = OC = OD$.' },
      { loai: 'dinhLi', tieuDe: 'Nhận xét: trung tuyến của tam giác vuông',
        noiDung: '**Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng một nửa cạnh huyền.**\n\nTam giác $ABC$ vuông tại $A$, $M$ là trung điểm $BC$ thì $\\cd{AM} = \\frac{\\cb{BC}}{2}$.\n\n**Ngược lại:** nếu tam giác có một đường trung tuyến bằng nửa cạnh tương ứng thì tam giác đó **vuông** (tại đỉnh xuất phát trung tuyến).' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1.5, 7.6, 9.5, -1.4], build: trungTuyenBuild },
        chuThich: 'Kéo $A$ trên nửa đường tròn đường kính $BC$: góc $A$ luôn vuông và $\\cd{AM}$ luôn bằng nửa $\\cb{BC}$ (vì $A$, $B$, $C$ là ba đỉnh của một hình chữ nhật có tâm $M$).' },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết (Định lí 2)',
        noiDung: 'a) **Hình bình hành có một góc vuông** là hình chữ nhật.\n\nb) **Hình bình hành có hai đường chéo bằng nhau** là hình chữ nhật.\n\nCùng với định nghĩa và chú ý: tứ giác có **ba góc vuông**; tứ giác có hai đường chéo **bằng nhau và cắt nhau tại trung điểm mỗi đường** cũng là hình chữ nhật.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 9, 9.5, -1], build: kiemTraBuild,
        // Kéo D, B cho góc A vuông: hình bình hành thành hình chữ nhật (hai đường chéo cũng bằng nhau), rồi trả về.
        tuChay: [{ cho: 0.8 }, { diem: 'D', den: [1, 0], giay: 2 }, { diem: 'B', den: [7, 4], giay: 2 }, { cho: 2.5 },
          { diem: 'B', den: [7, 5], giay: 1.5 }, { diem: 'D', den: [0, 0], giay: 1.5 }] },
        chuThich: 'Hình bình hành $ABCD$ trên lưới (kéo $A$, $B$, $D$). Khi góc $A$ vuông thì hai đường chéo cũng bằng nhau: hình bình hành trở thành hình chữ nhật.' },
      { loai: 'chuY', noiDung: '**Hay nhầm:** "tứ giác có hai đường chéo bằng nhau là hình chữ nhật" là **sai**! Hình thang cân cũng có hai đường chéo bằng nhau. Phải là **hình bình hành** có hai đường chéo bằng nhau (hoặc hai đường chéo bằng nhau **và** cắt nhau tại trung điểm mỗi đường).' }
    ],
    viDu: [
      { de: 'Hình chữ nhật $ABCD$ có hai đường chéo cắt nhau tại $O$, $AC = 10$ cm. Tính $BD$ và $OA$.',
        canh: ht({ phi: 70, L: 5, loCuoi: true, nhan: { AC: '10 cm', BD: { dau: '?', cuoi: '10 cm' }, OA: { dau: '?', giai: '5 cm' } } }), buoc: [
        { lam: '$BD = AC = 10$ cm', vi: 'Hai đường chéo của hình chữ nhật bằng nhau: hai thanh dài như nhau.', canh: { t: 0.9 } },
        { lam: '$OA = AC : 2 = 5$ cm', vi: 'Hai đường chéo cắt nhau tại trung điểm mỗi đường.', canh: { t: 1 } } ] },
      { de: 'Tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 13$ cm, $M$ là trung điểm $BC$. Tính $AM$.',
        canh: ht({ dang: 'trungTuyen', bc: 13, gocB: 40, loCuoi: true, nhan: { BC: '13 cm', AM: { dau: '?', giai: '6,5 cm' } } }), buoc: [
        { lam: '$AM$ là trung tuyến ứng với cạnh huyền $BC$.', vi: '$M$ là trung điểm của cạnh huyền. Kéo dài $AM$ thêm một đoạn bằng nó tới $D$: $ABDC$ là hình chữ nhật.', canh: { t: 0.9 } },
        { lam: '$AM = \\frac{BC}{2} = \\frac{13}{2} = 6{,}5$ (cm)', vi: 'Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền (nửa thanh $AD = BC$).', canh: { t: 1 } } ] },
      { de: 'Hình bình hành $ABCD$ có $\\widehat{A} = 90^\\circ$. Tính các góc còn lại. $ABCD$ là hình gì?', hinh: hVD3, buoc: [
        { lam: '$\\widehat{C} = \\widehat{A} = 90^\\circ$; $\\widehat{B} = \\widehat{D} = 180^\\circ - 90^\\circ = 90^\\circ$', vi: 'Góc đối bằng nhau; hai góc kề một cạnh bù nhau.' },
        { lam: '$ABCD$ có bốn góc vuông nên là hình chữ nhật.', vi: 'Đây chính là dấu hiệu "hình bình hành có một góc vuông".' } ] },
      { de: 'Hình chữ nhật $ABCD$ có chu vi $36$ cm. $M$ là trung điểm cạnh $BC$ và $MA \\perp MD$. Tính $AB$ và $BC$.', hinh: h10, buoc: [
        { lam: '$\\triangle ABM = \\triangle DCM$ (c.g.c) nên $MA = MD$.', vi: '$AB = DC$, $\\widehat{B} = \\widehat{C} = 90^\\circ$, $MB = MC$.' },
        { lam: '$\\triangle AMD$ vuông cân tại $M$, nên $\\widehat{MAD} = 45^\\circ$, suy ra $\\widehat{BMA} = \\widehat{MAD} = 45^\\circ$.', vi: 'Tam giác vuông có hai cạnh góc vuông bằng nhau là vuông cân; $AD \\parallel BC$ cho hai góc so le trong.' },
        { lam: '$\\triangle ABM$ vuông cân tại $B$: $AB = BM = \\frac{BC}{2}$, tức $BC = 2AB$.', vi: 'Tam giác vuông có một góc $45^\\circ$ là tam giác vuông cân.' },
        { lam: 'Chu vi $= 2(AB + 2AB) = 6AB = 36$, nên $AB = 6$ cm, $BC = 12$ cm.', vi: 'Thay $BC = 2AB$ vào công thức chu vi.' } ] }
    ],
    viDuMo: [
      { de: 'Hình chữ nhật $ABCD$ có hai đường chéo cắt nhau tại $O$, $BD = 14$ cm. Tính $OC$ (cm).', buoc: [
        { lam: '$AC = BD = 14$ cm', vi: 'Hai đường chéo của hình chữ nhật bằng nhau.' },
        { lam: '$OC = AC : 2 = 7$ (cm)', vi: 'Em hãy tính $OC$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 7 },
          loiThuongGap: [{ gt: 14, giaiThich: '$14$ cm là cả đường chéo. $O$ là trung điểm nên $OC$ chỉ bằng một nửa.' }] } ] },
      { de: 'Tam giác $ABC$ vuông tại $A$ có trung tuyến $AM = 5$ cm ($M$ là trung điểm $BC$). Tính $BC$ (cm).', buoc: [
        { lam: '$AM = \\frac{BC}{2}$', vi: 'Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.' },
        { lam: '$BC = 2 \\cdot AM = 10$ (cm)', vi: 'Em hãy tính $BC$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 10 },
          loiThuongGap: [{ gt: 2.5, giaiThich: 'Ngược rồi: $AM$ là **nửa** $BC$, nên $BC$ gấp đôi $AM$.' }] } ] }
    ],
    baiTap: [
      { id: '13.1', khongHinh: 'Câu hỏi định nghĩa, không có số đo để vẽ.', muc: 1, de: 'Theo định nghĩa, hình chữ nhật là:',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Tứ giác có bốn góc vuông', 'Tứ giác có hai đường chéo bằng nhau', 'Tứ giác có hai góc vuông', 'Hình thang có một góc vuông'] },
        goiY: ['Nhớ lại định nghĩa trong phần Lý thuyết.', 'Hình thang có một góc vuông (hình thang vuông) chưa chắc là hình chữ nhật.'],
        loiGiai: ['Hình chữ nhật là tứ giác có **bốn góc vuông**.'] },
      { id: '13.2', muc: 1, de: 'Hình chữ nhật $ABCD$ trong hình có đường chéo $AC = 12$ cm, $O$ là giao điểm hai đường chéo. Tính $OB$ (cm).', hinh: h2,
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Hai đường chéo hình chữ nhật bằng nhau: $BD = AC$.', '$O$ là trung điểm $BD$.'],
        loiGiai: ['$BD = AC = 12$ cm (hai đường chéo bằng nhau).', '$OB = BD : 2 = 12 : 2 = 6$'],
        loiThuongGap: [{ gt: 12, giaiThich: '$12$ cm là cả đường chéo $BD$. $OB$ chỉ là một nửa.' }] },
      { id: '13.3', muc: 1, de: 'Tam giác $ABC$ trong hình vuông tại $A$, cạnh huyền $BC = 15$ cm, $M$ là trung điểm $BC$. Tính $AM$ (cm).', hinh: h3,
        dapAn: { kieu: 'so', gt: 7.5 },
        goiY: ['$AM$ là trung tuyến ứng với cạnh huyền.', 'Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.'],
        loiGiai: ['$AM = \\frac{BC}{2} = \\frac{15}{2} = 7{,}5$'],
        loiThuongGap: [{ gt: 15, giaiThich: 'Trung tuyến ứng với cạnh huyền chỉ bằng **một nửa** cạnh huyền.' }] },
      { id: '13.4', khongHinh: 'Lời giải chỉ là một phép tính $360^\\circ - 3 \\cdot 90^\\circ$, không cần hình.', muc: 1, de: 'Khẳng định "Tứ giác có ba góc vuông là hình chữ nhật" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Tính góc thứ tư bằng định lí tổng các góc của tứ giác.'],
        loiGiai: ['Góc thứ tư bằng $360^\\circ - 3 \\cdot 90^\\circ = 90^\\circ$.', 'Tứ giác có bốn góc vuông nên là hình chữ nhật. Khẳng định **đúng**.'] },
      { id: '13.5', khongHinh: 'Câu chọn dấu hiệu nhận biết, không có số đo; hình hai thanh ở phần Nhìn đã cho thấy dấu hiệu đường chéo.', muc: 2, de: 'Hình bình hành $ABCD$ cần thêm điều kiện nào dưới đây để trở thành hình chữ nhật?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$AB = BC$', '$AC \\perp BD$', '$AC = BD$', '$AC$ là tia phân giác của góc $A$'] },
        goiY: ['Dấu hiệu: hình bình hành có **một góc vuông** hoặc có **hai đường chéo bằng nhau**.', 'Các điều kiện còn lại không bảo đảm có góc vuông (chúng cho một hình khác, sẽ học ở bài Hình thoi).'],
        loiGiai: ['Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật (Định lí 2b). Chọn $AC = BD$.', 'Ba điều kiện kia ($AB = BC$, $AC \\perp BD$, đường chéo là phân giác) không làm cho góc của hình bình hành thành góc vuông: chúng cho **hình thoi** (bài sau).'] },
      { id: '13.6', hinhGiai: { widget: 'canh', config: { ten: 'thangCan', chiXem: true, t: 0, tuyChon: { dl: 8, dn: 3, h: 3.5, cheo: true },
        ghiChu: 'Phản ví dụ: hình thang cân có hai đường chéo bằng nhau nhưng không có góc vuông.' } }, muc: 2, de: 'Khẳng định "Tứ giác có hai đường chéo bằng nhau là hình chữ nhật" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Nhớ lại: hình thang cân có hai đường chéo thế nào?'],
        loiGiai: ['Hình thang cân (không có góc vuông) cũng có hai đường chéo bằng nhau nhưng không phải hình chữ nhật.', 'Khẳng định **sai**. Cần thêm điều kiện hai đường chéo cắt nhau tại trung điểm mỗi đường.'] },
      { id: '13.7', muc: 2, de: 'Tam giác $ABC$ trong hình có $M$ là trung điểm $BC$, $BC = 8$ cm và trung tuyến $AM = 4$ cm. Tính góc $BAC$ (độ).', hinh: h7,
        dapAn: { kieu: 'so', gt: 90 },
        goiY: ['So sánh $AM$ với $\\frac{BC}{2}$.', 'Tam giác có trung tuyến bằng nửa cạnh tương ứng thì vuông.'],
        loiGiai: ['$\\frac{BC}{2} = 4 = AM$: trung tuyến $AM$ bằng nửa cạnh $BC$.', 'Vậy tam giác $ABC$ vuông tại $A$: $\\widehat{BAC} = 90^\\circ$'] },
      { id: '13.8', muc: 2, de: 'Hình chữ nhật $ABCD$ trong hình có hai đường chéo cắt nhau tại $O$, $\\widehat{AOB} = 120^\\circ$. Tính góc $OAB$ (độ).', hinh: h8,
        dapAn: { kieu: 'so', gt: 30 },
        goiY: ['Trong hình chữ nhật $OA = OB$ (nửa hai đường chéo bằng nhau). Tam giác $OAB$ là tam giác gì?', 'Tam giác cân $OAB$: hai góc ở đáy bằng $(180^\\circ - 120^\\circ) : 2$.'],
        loiGiai: ['$OA = OB$ (bằng nửa hai đường chéo bằng nhau) nên $\\triangle OAB$ cân tại $O$.', '$\\widehat{OAB} = (180^\\circ - 120^\\circ) : 2 = 30^\\circ$'],
        loiThuongGap: [{ gt: 60, giaiThich: '$60^\\circ$ là tổng hai góc ở đáy. Tam giác cân nên mỗi góc chỉ bằng một nửa.' }] },
      { id: '13.9', muc: 2, de: 'Hình chữ nhật $ABCD$ trong hình có $DC = 10$ cm, hai đường chéo cắt nhau tại $O$, $OH \\perp DC$ ($H \\in DC$). Tính $DH$ (cm).', hinh: h9,
        dapAn: { kieu: 'so', gt: 5 },
        goiY: ['$OD = OC$ nên tam giác $ODC$ cân tại $O$.', 'Trong tam giác cân, đường cao $OH$ cũng là trung tuyến: $H$ là trung điểm $DC$.'],
        loiGiai: ['$OD = OC$ (nửa hai đường chéo bằng nhau) nên $\\triangle ODC$ cân tại $O$.', 'Đường cao $OH$ cũng là đường trung tuyến, nên $H$ là trung điểm $DC$.', '$DH = 10 : 2 = 5$'] },
      { id: '13.10', muc: 3, de: 'Hình chữ nhật $ABCD$ trong hình có chu vi $48$ cm, $M$ là trung điểm cạnh $BC$ và $MA \\perp MD$. Tính $AB$ và $BC$ (cm).', hinh: h10,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$AB =$', kieu: 'so', gt: 8 }, { nhan: '$BC =$', kieu: 'so', gt: 16 }] },
        goiY: ['$\\triangle ABM = \\triangle DCM$ nên $MA = MD$: tam giác $AMD$ vuông cân, suy ra $\\widehat{AMB} = 45^\\circ$.', 'Tam giác $ABM$ vuông cân: $AB = BM = \\frac{BC}{2}$. Chu vi $= 2(AB + 2AB) = 6AB$.'],
        loiGiai: ['$\\triangle ABM = \\triangle DCM$ (c.g.c) nên $MA = MD$; $\\triangle AMD$ vuông cân tại $M$, nên $\\widehat{AMB} = \\widehat{MAD} = 45^\\circ$.', '$\\triangle ABM$ vuông cân tại $B$: $AB = BM$, tức $BC = 2AB$.', 'Chu vi $6AB = 48$, nên $AB = 8$ cm và $BC = 16$ cm.'] },
      { id: '13.11', muc: 3, de: 'Tam giác $ABC$ vuông cân tại $A$ có cạnh huyền $BC = 10$ cm. $M$ là một điểm trên $BC$; $N$, $P$ lần lượt là hình chiếu vuông góc của $M$ trên $AB$, $AC$ (hình). Khi $M$ chạy trên $BC$, đoạn $NP$ ngắn nhất bằng bao nhiêu cm?', hinh: h11,
        dapAn: { kieu: 'so', gt: 5 },
        goiY: ['Tứ giác $ANMP$ có ba góc vuông nên là hình chữ nhật, do đó $NP = AM$ (hai đường chéo).', '$AM$ ngắn nhất khi $AM \\perp BC$. Khi đó $M$ là trung điểm $BC$ (tam giác vuông cân).'],
        loiGiai: ['$ANMP$ có ba góc vuông nên là hình chữ nhật, suy ra $NP = AM$.', '$AM$ ngắn nhất khi $AM \\perp BC$; tam giác $ABC$ cân tại $A$ nên lúc đó $M$ là trung điểm $BC$ và $AM$ là trung tuyến ứng với cạnh huyền.', '$NP_{\\min} = AM = \\frac{BC}{2} = \\frac{10}{2} = 5$'],
        loiThuongGap: [{ gt: 10, giaiThich: '$10$ cm là cạnh huyền. Đường trung tuyến (cũng là đường cao) $AM$ chỉ bằng nửa cạnh huyền.' }] }
    ],
    timLoi: [
      { de: 'Tứ giác $ABCD$ có hai đường chéo $AC = BD = 8$ cm. Bạn Nam kết luận như sau. Dòng nào sai?',
        loiGiaiSai: ['Tứ giác $ABCD$ có $AC = BD$.', 'Tứ giác có hai đường chéo bằng nhau là hình chữ nhật.', 'Vậy $\\widehat{A} = 90^\\circ$.'],
        dongSai: 1,
        giaiThich: 'Chỉ **hình bình hành** có hai đường chéo bằng nhau mới là hình chữ nhật. Một hình thang cân, hay một tứ giác bất kì có hai đường chéo dài $8$ cm, chưa chắc có góc vuông.',
        sua: 'Cần biết thêm $ABCD$ là hình bình hành (ví dụ: hai đường chéo cắt nhau tại trung điểm mỗi đường) thì mới kết luận được.' },
      { de: 'Tam giác $ABC$ vuông tại $A$ có $BC = 10$ cm, $M$ là trung điểm $BC$. Bạn Lan tính $AM$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$AM$ là trung tuyến ứng với cạnh huyền $BC$.', 'Trong tam giác vuông, trung tuyến ứng với cạnh huyền bằng cạnh huyền.', 'Vậy $AM = BC = 10$ cm.'],
        dongSai: 1,
        giaiThich: 'Trung tuyến ứng với cạnh huyền bằng **một nửa** cạnh huyền (vì $A$, $B$, $C$ là ba đỉnh của một hình chữ nhật có hai đường chéo bằng nhau, cắt nhau tại trung điểm $M$).',
        sua: '$AM = \\frac{BC}{2} = 5$ cm.' }
    ]
  });
})();
