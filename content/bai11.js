// Bài 11 – Hình thang cân (SGK Toán 8 KNTT, Tập 1, tr. 52–56)
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
  // Hình thang cân ABCD (AB // CD), đáy lớn CD = d nằm dưới, góc ở đáy lớn = g, chiều cao h.
  function thangCan(d, g, h) {
    var x = h / Math.tan(rad(g));
    return { A: [x, h], B: [d - x, h], C: [d, 0], D: [0, 0] };
  }

  var h2 = hinhTG({ diem: thangCan(8, 55, 3.5), vong: ['A', 'B', 'C', 'D'],
    goc: [['B', 'C', 'D'], ['D', 'A', 'B', { mau: XANH }]], soGoc: [['B', 'C', 'D', '55°', 1.3], ['D', 'A', 'B', '?', 1, XANH]] });
  // Cạnh bên 6, góc đáy 65°, đáy lớn chọn sao cho đường chéo AC = 9 (đúng tỉ lệ 6 : 9).
  var h3 = hinhTG({ diem: thangCan(6 * Math.cos(rad(65)) + Math.sqrt(81 - Math.pow(6 * Math.sin(rad(65)), 2)), 65, 6 * Math.sin(rad(65))), vong: ['A', 'B', 'C', 'D'], vach: { DA: 1, BC: 1 },
    canh: [['A', 'C', { mau: TIM, day: 2 }], ['B', 'D', { mau: TIM, day: 2 }]],
    nhan: [['D', 'A', '6 cm'], ['A', 'C', '9 cm', false, 1.2, TIM]] });
  var D4 = { D: [0, 0], A: toi([0, 0], 55, 4) };
  D4.B = [D4.A[0] + 4, D4.A[1]]; D4.C = [8.5, 0];
  var h4 = hinhTG({ diem: { A: D4.A, B: D4.B, C: D4.C, D: D4.D }, vong: ['A', 'B', 'C', 'D'],
    goc: [['D', 'A', 'B'], ['A', 'D', 'C', { mau: XANH }]], soGoc: [['D', 'A', 'B', '125°', 1.2], ['A', 'D', 'C', '?', 1.3, XANH]] });
  var A5 = toi([0, 0], 65, 4), B5 = [A5[0] + 3.5, A5[1]];
  var h5 = hinhTG({ diem: { A: A5, B: B5, C: [B5[0] + B5[1] / Math.tan(rad(70)), 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    goc: [['D', 'A', 'B'], ['B', 'C', 'D']], soGoc: [['D', 'A', 'B', '115°', 1.2], ['B', 'C', 'D', '70°', 1.4]] });
  var A6 = toi([0, 0], 50, 4), B6 = [A6[0] + 4, A6[1]];
  var h6 = hinhTG({ diem: { A: A6, B: B6, C: [B6[0] + 4 * Math.cos(rad(50)), 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    vach: { AB: 1, DA: 1 }, canh: [['B', 'D', { mau: TIM, day: 2 }]],
    goc: [['A', 'B', 'D'], ['D', 'A', 'B', { mau: XANH }]], soGoc: [['A', 'B', 'D', '25°', 1.6], ['D', 'A', 'B', '?', 0.9, XANH]] });
  var h7 = hinhTG({ diem: { A: [4, 5], B: [10, 5], C: [14, 0], D: [0, 0], H: [4, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'H', { mau: TIM, day: 2, net: 2 }]], goc: [['A', 'H', 'C', { mau: TIM }]],
    nhan: [['A', 'B', '6 cm'], ['D', 'C', '14 cm', false, 1.3, '#212529'], ['D', 'H', '?', true, 0.8, XANH]],
    lechTen: { H: [0, -18] } });
  // Tam giác ABC cân tại A, d // BC cắt AB, AC tại D, E.
  function tamGiacCan(them) {
    var A = [4, 5.5], B = [0, 0], C = [8, 0], D = lerp(A, B, 0.42), E = lerp(A, C, 0.42);
    var o = { diem: { A: A, B: B, C: C, D: D, E: E }, vong: ['A', 'B', 'C'], vach: { AB: 1, CA: 1 },
      canh: [['D', 'E', { mau: TIM, day: 4 }]], ve: [[[D[0] - 1.8, D[1]], [E[0] + 1.8, E[1]], { mau: '#adb5bd', day: 2 }]],
      lechTen: { D: [-14, 10], E: [14, 10] } };
    for (var k in them || {}) o[k] = them[k];
    return hinhTG(o);
  }
  var h8 = tamGiacCan();
  var h9 = tamGiacCan({ goc: [['B', 'A', 'C'], ['B', 'D', 'E', { mau: XANH }]], soGoc: [['B', 'A', 'C', '40°', 1.1], ['B', 'D', 'E', '?', 0.8, XANH]] });
  var A10 = toi([0, 0], 70, 6);
  var h10 = hinhTG({ diem: { A: A10, B: [12 - A10[0], A10[1]], C: [12, 0], D: [0, 0], E: [6, 0] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'E', { mau: CAM, day: 2 }], ['B', 'E', { mau: XANH, day: 2 }]],
    goc: [['D', 'A', 'E', { mau: CAM, r: 0.9 }], ['E', 'A', 'B', { mau: CAM, r: 1.1 }], ['A', 'B', 'E', { mau: XANH, r: 0.9 }], ['E', 'B', 'C', { mau: XANH, r: 1.1 }]],
    nhan: [['D', 'C', 'DC = 12 cm', false, 1.4]], lechTen: { E: [0, -16] } });
  // Hình bình hành ABCD có AB // CD và AD = BC nhưng không phải hình thang cân.
  var hBinhHanh = hinhTG({ diem: { A: [1.8, 3], B: [6.8, 3], C: [5, 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'], vach: { BC: 1, DA: 1 },
    canh: [['A', 'C', { mau: TIM, day: 2, net: 2 }], ['B', 'D', { mau: TIM, day: 2, net: 2 }]],
    ghiChu: 'AB // CD, AD = BC nhưng AC ≠ BD' });

  // ---------- Cấu hình cảnh cho "Nhìn là hiểu" ----------
  function so(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }
  function tc(them, moTa) { return { ten: 'thangCan', tuyChon: them, moTa: moTa }; }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  // Hình thang cân 11.9: tam giác ABC cân tại A (góc A 40°), DE cắt AB, AC tại 0,42 cạnh tính từ A
  var TAM_GIAC = { dl: 8, gocDay: 70, h: 4 * Math.tan(rad(70)) * 0.58, dinh: 'A', ten: ['D', 'E', 'C', 'B'] };
  // Hình cho ví dụ 2 (hình thang thường, Â = 110°, D̂ = 70°) và ví dụ 3 (AB = AD, góc ABD = 35°)
  var A2v = toi([0, 0], 70, 4);
  var hVD2 = hinhTG({ diem: { A: A2v, B: [A2v[0] + 4, A2v[1]], C: [9, 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    goc: [['D', 'A', 'B', { mau: XANH }], ['A', 'D', 'C', { mau: XANH }]], soGoc: [['D', 'A', 'B', '?', 1, XANH], ['A', 'D', 'C', '?', 1.3, XANH]], ghiChu: 'Góc A hơn góc D 40°' });
  var A3v = toi([0, 0], 70, 4), B3v = [A3v[0] + 4, A3v[1]];
  var hVD3 = hinhTG({ diem: { A: A3v, B: B3v, C: [B3v[0] + 4 * Math.cos(rad(70)), 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    vach: { AB: 1, DA: 1 }, canh: [['B', 'D', { mau: TIM, day: 2 }]], goc: [['A', 'B', 'D']], soGoc: [['A', 'B', 'D', '35°', 1.6]] });

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
  function diemPhu(board, ten, fx, fy) {
    return board.create('point', [fx, fy], { name: ten, size: 4, color: '#495057', fixed: true, label: LBL, showInfobox: false });
  }

  // Hình thang cân: B, C là ảnh đối xứng của A, D qua trục x = 4 nên AB // CD và hình luôn cân.
  var khamPhaBuild = function (board, G) {
    var TRUC = 4;
    board.create('line', [[TRUC, -1], [TRUC, 6]], { strokeColor: '#adb5bd', strokeWidth: 2, dash: 2, fixed: true, highlight: false });
    var A = G.pt('A', 2.6, 4), D = G.pt('D', 0.3, 0);
    A.on('drag', function () { A.moveTo([Math.min(A.X(), TRUC - 0.3), Math.max(A.Y(), D.Y() + 1)]); });
    D.on('drag', function () { D.moveTo([Math.min(D.X(), TRUC - 0.3), Math.min(D.Y(), A.Y() - 1)]); });
    var B = diemPhu(board, 'B', function () { return 2 * TRUC - A.X(); }, function () { return A.Y(); });
    var C = diemPhu(board, 'C', function () { return 2 * TRUC - D.X(); }, function () { return D.Y(); });
    G.poly([A, B, C, D], { fillOpacity: 0.06 });
    G.seg(A, C, { strokeColor: TIM, strokeWidth: 2 }); G.seg(B, D, { strokeColor: TIM, strokeWidth: 2 });
    G.seg(A, D, { strokeColor: CAM, strokeWidth: 4 }); G.seg(B, C, { strokeColor: CAM, strokeWidth: 4 });
    cung(board, A, D, C, XANH); cung(board, B, C, D, XANH);
    G.label(-1.3, 7.6, function () { return 'góc D = ' + Math.round(doGoc(A, D, C)) + '°'; }, { strokeColor: XANH });
    G.label(4.6, 7.6, function () { return 'góc C = ' + Math.round(doGoc(B, C, D)) + '°'; }, { strokeColor: XANH });
    G.label(-1.3, 6.9, function () { return 'AD = ' + fmt(G.len(A, D)); }, { strokeColor: CAM });
    G.label(4.6, 6.9, function () { return 'BC = ' + fmt(G.len(B, C)); }, { strokeColor: CAM });
    G.label(-1.3, 6.2, function () { return 'AC = ' + fmt(G.len(A, C)); }, { strokeColor: TIM });
    G.label(4.6, 6.2, function () { return 'BD = ' + fmt(G.len(B, D)); }, { strokeColor: TIM });
    G.label(TRUC + 0.15, -0.7, 'trục đối xứng', { fontSize: 13, strokeColor: '#868e96' });
  };

  // Hình thang bất kì: B chạy trên đường thẳng qua A song song với DC.
  var thangBuild = function (board, G) {
    var D = G.pt('D', 0, 0), C = G.pt('C', 8, 0.4), A = G.pt('A', 1.6, 4);
    var dc = G.line(D, C, { visible: false });
    var d = G.par(A, dc, { strokeColor: '#dee2e6' });
    var B = G.glider('B', 5.5, 4.2, d);
    // Giữ B ở bên phải A (cùng chiều với D → C) để ABCD không bị bắt chéo.
    function giuB() {
      var ux = C.X() - D.X(), uy = C.Y() - D.Y(), l = Math.hypot(ux, uy) || 1; ux /= l; uy /= l;
      if ((B.X() - A.X()) * ux + (B.Y() - A.Y()) * uy < 0.8) B.moveTo([A.X() + 0.8 * ux, A.Y() + 0.8 * uy]);
    }
    [A, B, C, D].forEach(function (P) { P.on('drag', giuB); });
    G.poly([A, B, C, D], { fillOpacity: 0.06 });
    cung(board, B, A, D, CAM); cung(board, A, D, C, CAM); cung(board, A, B, C, XANH); cung(board, B, C, D, XANH);
    G.label(-1.3, 7.2, function () { var a = Math.round(doGoc(B, A, D)); return 'góc A + góc D = ' + a + '° + ' + (180 - a) + '° = 180°'; }, { strokeColor: CAM });
    G.label(-1.3, 6.4, function () { var b = Math.round(doGoc(A, B, C)); return 'góc B + góc C = ' + b + '° + ' + (180 - b) + '° = 180°'; }, { strokeColor: XANH });
  };

  TOAN8.bai({
    id: 11, ten: 'Hình thang cân', sgk: { tap: 1, trang: 52 },
    nhin: {
      tieuDe: 'Gập theo trục: hai nửa hình thang cân trùng khít', loai: 'chungMinh',
      luuY: 'Kéo hai thanh để đổi đáy nhỏ và chiều cao: lần gập nào cũng trùng khít, vì lập luận chỉ dùng $\\widehat{D} = \\widehat{C}$ và $AB \\parallel CD$.',
      canh: { ten: 'thangCan', tuyChon: { cheo: true, goc: { D: '', C: '' } }, thuPha: true, moTa: 'Hình thang cân ABCD, đáy lớn DC ở dưới. Đường nét đứt là trục. Hình được lật qua trục: cạnh AD trùng BC, đường chéo AC trùng BD.',
        dongSo: function (p) {
          var k = TOAN8.canh.lay('thangCan').tinh(p, 0, {});
          if (k.pha.hong) return 'Đo: $\\ca{AD} \\approx ' + so(k.AD) + '$, $\\ca{BC} \\approx ' + so(k.BC) + '$; $\\cb{AC} \\approx ' + so(k.AC) + '$, $\\cb{BD} \\approx ' + so(k.BD) + '$; $\\cc{\\widehat{D}} \\approx ' + Math.round(k.gocDay) + '^\\circ$, $\\cc{\\widehat{C}} \\approx ' + Math.round(k.gocC) + '^\\circ$.';
          return 'Đo: $\\ca{AD} = \\ca{BC} \\approx ' + so(k.AD) + '$; $\\cb{AC} = \\cb{BD} \\approx ' + so(k.AC) + '$; $\\cc{\\widehat{D}} = \\cc{\\widehat{C}} \\approx ' + Math.round(k.gocDay) + '^\\circ$.';
        } },
      buoc: [
        { t: 0, chu: 'Hình thang $ABCD$ có $AB \\parallel CD$ và hai góc ở đáy $\\cc{\\widehat{D}} = \\cc{\\widehat{C}}$: đó là hình thang cân. Nét đứt là đường trung trực của đáy $DC$.' },
        { t: 0.2, chu: 'Gập hình theo nét đứt. $D$ rơi đúng vào $C$, vì nét đứt là trung trực của $DC$.' },
        { t: 0.5, chu: 'Vì $\\widehat{D} = \\widehat{C}$, cạnh $DA$ rơi đúng lên tia $CB$. Đáy $AB$ vuông góc với nét đứt nên gập xong vẫn nằm trên chính nó.' },
        { t: 1, chu: 'Vậy $A$ rơi đúng vào $B$: cạnh bên $\\ca{AD}$ trùng $\\ca{BC}$, đường chéo $\\cb{AC}$ trùng $\\cb{BD}$.' }
      ],
      ketLuan: 'Trong hình thang cân: $$\\ca{AD} = \\ca{BC}, \\qquad \\cb{AC} = \\cb{BD}$$',
      dung: {
        tieuDe: 'Hai đoạn hai bên đường cao bằng nhau', tuBai: '11.7',
        canh: tc({ dl: 14, dn: 6, h: 5, duongCao: true, nhan: { AB: '6 cm', DC: '14 cm', DH: { dau: '?', giai: '4' } } },
          'Hình thang cân ABCD, đáy nhỏ AB 6 cm, đáy lớn DC 14 cm, hai đường cao AH và BK. Gập theo trục thì đoạn DH trùng đoạn KC.'),
        moiThu: 'Gập theo trục: đoạn $DH$ trùng đoạn $KC$, còn ở giữa $HK = AB = 6$. Gõ độ dài $DH$; nếu sai, hình sẽ đặt hai đoạn đỏ dài đúng như em gõ ở hai đầu đáy.',
        phanUng: [
          { gt: 8, loi: '$14 - 6 = 8$ là tổng **hai** đoạn $DH$ và $KC$. Gập lại thì hai đoạn bằng nhau, nên mỗi đoạn chỉ bằng một nửa.' },
          { gt: 7, loi: '$7$ là nửa đáy lớn, tính tới trục giữa. Từ $H$ tới trục còn nửa đáy nhỏ $3$ cm nữa.' },
          { gt: 20, loi: 'Đáy nhỏ nằm **bên trong** đáy lớn: phải lấy $14 - 6$, không cộng.' }
        ],
        soBatKi: function (v) {
          if (v <= 0) return { t: 1, loi: 'Độ dài phải lớn hơn $0$.' };
          return { thamSo: { thu: v }, t: 1, loi: 2 * v + 6 < 14 ? 'Hai đoạn đỏ cộng với $HK = 6$ chưa phủ hết đáy $14$ cm: còn hở ở giữa.' : 'Hai đoạn đỏ cộng với $HK = 6$ đã dài hơn đáy $14$ cm: chúng chồng lên nhau.' };
        },
        dungChu: '$DH + 6 + KC = 14$ và $DH = KC$, nên $DH = 8 : 2 = 4$.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn gập được theo trục',
        baDe: [
          { tuBai: '11.11', canh: tc({ dl: 18, dn: 10, canhBen: 9, nhan: { AB: '10', DC: '18', AD: { dau: '?', giai: '9' }, BC: { dau: '?', giai: '9' } } },
            'Khung ảnh hình thang cân, hai đáy 10 cm và 18 cm, hai cạnh bên chưa biết.'), tenNut: 'Gập theo trục',
            phanUng: [{ gt: 18, loi: '$46 - 28 = 18$ là tổng **hai** cạnh bên. Gập lại thì hai cạnh bên trùng nhau, mỗi cạnh một nửa.' }, { gt: 4, loi: '$4$ là phần đáy lớn thò ra mỗi bên ($\\frac{18 - 10}{2}$), không phải cạnh bên.' }],
            dungChu: 'Hai cạnh bên bằng nhau, tổng là $46 - (10 + 18) = 18$, mỗi cạnh $9$ cm.', saiChu: 'Chu vi gồm hai đáy và hai cạnh bên bằng nhau.' },
          { tuBai: '11.2', canh: tc({ dl: 8, gocDay: 55, h: 3.5, goc: { C: '55°', D: { dau: '', cuoi: '55°' }, A: { dau: '?', giai: '125°' } } },
            'Hình thang cân ABCD có góc C 55 độ; hỏi góc A.'), tenNut: 'Gập theo trục',
            phanUng: [{ gt: 55, loi: 'Gập lại, góc $C$ trùng góc $D$ (cùng kề đáy lớn), không trùng góc $A$. Góc $A$ và góc $D$ kề cạnh bên $AD$ nên bù nhau.' }, { gt: 35, loi: 'Góc $A$ là góc tù ở đáy nhỏ. Nó bù với góc $D$: $180^\\circ - 55^\\circ$.' }],
            dungChu: '$\\widehat{D} = \\widehat{C} = 55^\\circ$, nên $\\widehat{A} = 180^\\circ - 55^\\circ = 125^\\circ$.', saiChu: 'Gập theo trục để thấy góc $D$ bằng góc nào, rồi dùng: hai góc kề một cạnh bên bù nhau.' },
          { tuBai: '11.9', canh: tc(Object.assign({ goc: { S: '40°', A: { dau: '?', giai: '110°' }, D: { dau: '', cuoi: '70°' }, C: { dau: '', cuoi: '70°' } } }, TAM_GIAC),
            'Tam giác ABC cân tại A, góc A 40 độ; DE song song BC tạo hình thang DECB. Hỏi góc BDE.'), tenNut: 'Gập theo trục',
            phanUng: [{ gt: 70, loi: '$70^\\circ$ là góc $B$ (và góc $ADE$ đồng vị với nó). Góc $BDE$ kề bù với góc $ADE$.' }, { gt: 140, loi: '$140^\\circ$ là tổng hai góc $B$ và $C$. Gập lại, hai góc này trùng nhau, mỗi góc $70^\\circ$.' }],
            dungChu: '$\\widehat{B} = \\widehat{C} = (180^\\circ - 40^\\circ) : 2 = 70^\\circ$, nên $\\widehat{BDE} = 180^\\circ - 70^\\circ = 110^\\circ$.', saiChu: 'Gập theo trục: góc $B$ trùng góc $C$. Tìm góc $B$ trước.' }
        ],
        cachNhan: 'Thấy hình thang cân, hay tam giác cân bị cắt bởi một đường song song với đáy: gập theo trục giữa. Cạnh bên, góc ở đáy, đường chéo, hai đoạn hai bên đường cao đều trùng nhau từng đôi.'
      }
    },
    khamPha: {
      nhiemVu: 'Đây là một **hình thang cân** $ABCD$ ($AB \\parallel CD$). Kéo đỉnh $A$ hoặc $D$: đỉnh $B$, $C$ tự di chuyển theo, **đối xứng** với $A$, $D$ qua trục nét đứt.\n\nEm hãy so sánh: hai góc ở đáy $\\cb{\\widehat{D}}$, $\\cb{\\widehat{C}}$; hai cạnh bên $\\ca{AD}$, $\\ca{BC}$; hai đường chéo $\\cd{AC}$, $\\cd{BD}$.',
      widget: 'geo',
      config: { bbox: [-1.5, 8.2, 9.5, -1.2], build: khamPhaBuild },
      cauHoi: {
        de: 'Khi kéo hình thang cân, hai đường chéo $AC$ và $BD$ thế nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Luôn bằng nhau', '$AC$ luôn dài hơn $BD$', 'Lúc bằng nhau, lúc không'] },
        goiY: ['Kéo $A$ tới vài vị trí rồi so hai số $AC$ và $BD$ (màu tím).'],
        loiGiai: ['Hai đường chéo luôn bằng nhau. Hai cạnh bên cũng luôn bằng nhau và hai góc ở đáy luôn bằng nhau.', 'Đó là các **tính chất của hình thang cân** mà ta học trong bài này.']
      }
    },
    mucTieu: [
      'Nhận ra hình thang, hình thang cân qua hai đáy song song và hai góc kề một đáy.',
      'Giải thích được vì sao hình thang cân có hai cạnh bên bằng nhau và hai đường chéo bằng nhau.',
      'Tính góc và cạnh của hình thang cân, dùng tính chất hai góc kề một cạnh bên bù nhau.',
      'Dùng dấu hiệu hai đường chéo bằng nhau để chứng minh một hình thang là hình thang cân.',
      'Nhận ra hình thang có hai cạnh bên bằng nhau chưa chắc là hình thang cân.'
    ],
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình thang',
        noiDung: '**Hình thang** là tứ giác có hai cạnh đối **song song**.\n\nHình thang $ABCD$ ($AB \\parallel CD$):\n- Hai cạnh song song $AB$, $CD$ là **hai đáy** (đáy nhỏ, đáy lớn).\n- Hai cạnh còn lại $AD$, $BC$ là **hai cạnh bên**.\n- Đoạn vuông góc $AH$ kẻ từ $A$ đến $CD$ là một **đường cao**.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1.5, 7.8, 9.5, -1], build: thangBuild },
        chuThich: 'Kéo $A$, $C$, $D$, hoặc kéo $B$ trên đường xám (luôn song song với $DC$). Hai góc kề một **cạnh bên** luôn có tổng $180^\\circ$.' },
      { loai: 'chuY', noiDung: '**Trong hình thang, hai góc kề một cạnh bên bù nhau** (tổng $180^\\circ$): $\\widehat{A} + \\widehat{D} = 180^\\circ$, $\\widehat{B} + \\widehat{C} = 180^\\circ$.\n\n**Vì sao?** Kéo dài cạnh $DA$ về phía $A$ thành tia $Ax$. Vì $AB \\parallel CD$ nên $\\widehat{xAB} = \\widehat{D}$ (hai góc đồng vị), mà $\\widehat{xAB} + \\widehat{A} = 180^\\circ$ (hai góc kề bù). Vậy $\\widehat{A} + \\widehat{D} = 180^\\circ$.' },
      { loai: 'dinhNghia', tieuDe: 'Hình thang cân',
        noiDung: '**Hình thang cân** là hình thang có **hai góc kề một đáy bằng nhau**.\n\nHình thang cân $ABCD$ ($AB \\parallel CD$): $\\widehat{A} = \\widehat{B}$ và $\\widehat{C} = \\widehat{D}$.\n\n(Hai góc kề một đáy bằng nhau thì hai góc kề đáy kia cũng bằng nhau, vì mỗi góc bù với một góc của đáy kia.)' },
      { loai: 'dinhLi', tieuDe: 'Tính chất của hình thang cân',
        noiDung: '**Định lí 1.** Trong hình thang cân, **hai cạnh bên bằng nhau**: $\\ca{AD} = \\ca{BC}$.\n\n**Định lí 2.** Trong hình thang cân, **hai đường chéo bằng nhau**: $\\cd{AC} = \\cd{BD}$.\n\n(Chứng minh Định lí 2: $\\triangle ACD = \\triangle BDC$ (c.g.c) vì $AD = BC$, $\\widehat{ADC} = \\widehat{BCD}$, $DC$ chung.)' },
      { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao $AD = BC$ và $AC = BD$?', config: {
        de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$, $AB < CD$). Xếp các bước theo đúng thứ tự lập luận. Bước nào chưa đủ căn cứ, máy sẽ nói còn thiếu bước nào.',
        // E hiện từ bước kéo dài hai cạnh bên (t = 0,05), hai đường chéo từ bước c.g.c (t = 0,1); gập hình (t > 0,2) chỉ ở bước cuối
        canh: { ten: 'thangCan', tuyChon: { cheo: true, cheoTu: 0.1, dinh: 'E', dinhTu: 0.05, goc: { D: '', C: '' } } },
        buoc: [
          { id: 'gt', chu: 'Hình thang $ABCD$ có $AB \\parallel CD$, $AB < CD$ và $\\widehat{D} = \\widehat{C}$.', canh: { t: 0 } },
          { id: 'E', chu: 'Kéo dài $DA$ và $CB$, chúng cắt nhau tại $E$ (vì $AB < CD$).', can: ['gt'], canh: { t: 0.05 } },
          { id: 'EDC', chu: 'Tam giác $EDC$ có $\\widehat{D} = \\widehat{C}$ nên cân tại $E$: $ED = EC$.', can: ['E'], canh: { t: 0.05 } },
          { id: 'dongVi', chu: '$AB \\parallel CD$ nên $\\widehat{EAB} = \\widehat{EDC}$ và $\\widehat{EBA} = \\widehat{ECD}$ (hai cặp góc đồng vị).', can: ['E'], canh: { t: 0.05 } },
          { id: 'EAB', chu: 'Suy ra $\\widehat{EAB} = \\widehat{EBA}$: tam giác $EAB$ cân tại $E$, $EA = EB$.', can: ['dongVi'], canh: { t: 0.05 } },
          { id: 'ben', chu: '$AD = ED - EA = EC - EB = BC$.', can: ['EDC', 'EAB'], canh: { t: 0.05 } },
          { id: 'cgc', chu: '$\\triangle ACD = \\triangle BDC$ (c.g.c): $AD = BC$, $\\widehat{ADC} = \\widehat{BCD}$, cạnh $DC$ chung.', can: ['ben'], canh: { t: 0.1 } },
          { id: 'cheo', chu: 'Vậy $AC = BD$.', can: ['cgc'], canh: { t: 1 } }
        ],
        ketLuan: 'Trong hình thang cân, $AD = BC$ và $AC = BD$.'
      } },
      { loai: 'dinhLi', tieuDe: 'Dấu hiệu nhận biết (Định lí 3)',
        noiDung: '**Hình thang có hai đường chéo bằng nhau là hình thang cân.**\n\nĐây là định lí **đảo** của Định lí 2. Vậy có hai cách nhận biết hình thang cân:\n1. Hình thang có hai góc kề một đáy bằng nhau (định nghĩa).\n2. Hình thang có hai đường chéo bằng nhau.' },
      { loai: 'chuY', noiDung: '**Hay nhầm – hai cạnh bên bằng nhau.** Hình thang có hai cạnh bên bằng nhau **chưa chắc** là hình thang cân! Hình bình hành ở dưới có $AB \\parallel CD$, $AD = BC$ nhưng hai góc kề đáy không bằng nhau, hai đường chéo cũng không bằng nhau.\n\n(Nếu thêm điều kiện hai đáy **không bằng nhau** thì hình thang có hai cạnh bên bằng nhau mới là hình thang cân.)' },
      { loai: 'hinh', widget: hBinhHanh.widget, config: hBinhHanh.config,
        chuThich: 'Phản ví dụ: hình thang $ABCD$ có hai cạnh bên bằng nhau nhưng **không** cân.' }
    ],
    viDu: [
      { de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) có $\\widehat{C} = 65^\\circ$. Tính các góc còn lại.',
        canh: tc({ dl: 8, gocDay: 65, h: 3.5, loCuoi: true, goc: { C: '65°', D: { dau: '?', cuoi: '65°' }, A: { dau: '?', giai: '115°' }, B: { dau: '?', giai: '115°' } } }), buoc: [
        { lam: '$\\widehat{D} = \\widehat{C} = 65^\\circ$', vi: 'Hình thang cân có hai góc kề đáy $CD$ bằng nhau: gập theo trục thì góc $D$ trùng góc $C$.', canh: { t: 0.9 } },
        { lam: '$\\widehat{A} = 180^\\circ - \\widehat{D} = 180^\\circ - 65^\\circ = 115^\\circ$', vi: 'Hai góc kề cạnh bên $AD$ bù nhau.', canh: { t: 1 } },
        { lam: '$\\widehat{B} = \\widehat{A} = 115^\\circ$', vi: 'Hai góc kề đáy $AB$ cũng bằng nhau.', canh: { t: 1 } } ] },
      { de: 'Hình thang $ABCD$ ($AB \\parallel CD$) có $\\widehat{A} - \\widehat{D} = 40^\\circ$. Tính $\\widehat{A}$ và $\\widehat{D}$.', hinh: hVD2, buoc: [
        { lam: '$\\widehat{A} + \\widehat{D} = 180^\\circ$', vi: 'Hai góc kề cạnh bên $AD$ của hình thang bù nhau.' },
        { lam: '$\\widehat{A} = (180^\\circ + 40^\\circ) : 2 = 110^\\circ$', vi: 'Biết tổng và hiệu: số lớn $= ($tổng $+$ hiệu$) : 2$.' },
        { lam: '$\\widehat{D} = 180^\\circ - 110^\\circ = 70^\\circ$', vi: 'Lấy tổng trừ góc vừa tìm.' } ] },
      { de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) có $AB = AD$ và $\\widehat{ABD} = 35^\\circ$. Tính các góc của hình thang.', hinh: hVD3, buoc: [
        { lam: '$\\widehat{ADB} = \\widehat{ABD} = 35^\\circ$', vi: '$AB = AD$ nên tam giác $ABD$ cân tại $A$: hai góc ở đáy $BD$ bằng nhau.' },
        { lam: '$\\widehat{BDC} = \\widehat{ABD} = 35^\\circ$', vi: '$AB \\parallel CD$ nên đây là hai góc so le trong.' },
        { lam: '$\\widehat{D} = \\widehat{ADB} + \\widehat{BDC} = 70^\\circ$, nên $\\widehat{C} = 70^\\circ$', vi: 'Hình thang cân: hai góc kề đáy $CD$ bằng nhau.' },
        { lam: '$\\widehat{A} = \\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$', vi: 'Hai góc kề một cạnh bên bù nhau.' } ] },
      { de: 'Hình thang $ABCD$ ($AB \\parallel CD$) có hai đường chéo $AC = BD = 7$ cm và cạnh bên $AD = 5$ cm. Tính $BC$.',
        canh: tc({ dl: 8, dn: 3, canhBen: 5, cheo: true, loCuoi: true, nhan: { AC: '7', BD: '7', AD: '5', BC: { dau: '?', giai: '5' } } }), buoc: [
        { lam: 'Hình thang $ABCD$ có $AC = BD$ nên là hình thang cân.', vi: 'Dấu hiệu nhận biết (Định lí 3): hình thang có hai đường chéo bằng nhau.', canh: { t: 0.5 } },
        { lam: '$BC = AD = 5$ cm', vi: 'Hình thang cân có hai cạnh bên bằng nhau (Định lí 1): gập theo trục thì $AD$ trùng $BC$.', canh: { t: 1 } } ] }
    ],
    viDuMo: [
      { de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) có $\\widehat{A} = 105^\\circ$. Tính $\\widehat{D}$ (độ).', buoc: [
        { lam: '$\\widehat{A} + \\widehat{D} = 180^\\circ$', vi: 'Hai góc kề cạnh bên $AD$ bù nhau.' },
        { lam: '$\\widehat{D} = 180^\\circ - 105^\\circ = 75^\\circ$', vi: 'Em hãy tính $\\widehat{D}$ (độ):', an: true,
          dapAn: { kieu: 'so', gt: 75 },
          loiThuongGap: [{ gt: 105, giaiThich: '$\\widehat{A}$ và $\\widehat{D}$ kề cùng cạnh bên $AD$ nên **bù** nhau, không bằng nhau. Góc bằng $\\widehat{A}$ là $\\widehat{B}$.' }] } ] },
      { de: 'Hình thang cân $ABCD$ có hai đáy $AB = 4$ cm, $CD = 10$ cm và cạnh bên $AD = 5$ cm. Tính chu vi hình thang (cm).', buoc: [
        { lam: '$BC = AD = 5$ cm', vi: 'Hai cạnh bên của hình thang cân bằng nhau.' },
        { lam: 'Chu vi $= 4 + 10 + 5 + 5 = 24$ (cm)', vi: 'Em hãy tính chu vi (cm):', an: true,
          dapAn: { kieu: 'so', gt: 24 },
          loiThuongGap: [{ gt: 19, giaiThich: 'Em mới cộng một cạnh bên. Hình thang có **hai** cạnh bên, mỗi cạnh $5$ cm.' }] } ] }
    ],
    baiTap: [
      { id: '11.1', khongHinh: 'Câu hỏi định nghĩa, không có số đo; hình gập theo trục ở phần Nhìn đã cho thấy.', muc: 1, de: 'Hình thang cân là hình thang có tính chất nào dưới đây (theo **định nghĩa**)?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Có hai cạnh bên bằng nhau', 'Có hai góc kề một đáy bằng nhau', 'Có một góc vuông', 'Có hai cạnh đáy bằng nhau'] },
        goiY: ['Nhớ lại định nghĩa trong phần Lý thuyết.', 'Cẩn thận: "hai cạnh bên bằng nhau" chưa đủ để là hình thang cân.'],
        loiGiai: ['Theo định nghĩa: **hình thang cân là hình thang có hai góc kề một đáy bằng nhau**.', 'Hình thang có hai cạnh bên bằng nhau có thể là hình bình hành.'] },
      { id: '11.2', muc: 1, de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) trong hình có $\\widehat{C} = 55^\\circ$. Tính $\\widehat{A}$ (độ).', hinh: h2,
        dapAn: { kieu: 'so', gt: 125 },
        goiY: ['Hình thang cân: $\\widehat{D} = \\widehat{C}$.', '$\\widehat{A}$ và $\\widehat{D}$ kề cạnh bên $AD$ nên bù nhau.'],
        loiGiai: ['$\\widehat{D} = \\widehat{C} = 55^\\circ$ (hai góc kề đáy $CD$).', '$\\widehat{A} = 180^\\circ - \\widehat{D} = 180^\\circ - 55^\\circ = 125^\\circ$'],
        loiThuongGap: [{ gt: 55, giaiThich: '$\\widehat{A}$ kề đáy nhỏ $AB$, không bằng $\\widehat{C}$. $\\widehat{A}$ bù với $\\widehat{D}$.' }] },
      { id: '11.3', muc: 1, de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) trong hình có cạnh bên $AD = 6$ cm, đường chéo $AC = 9$ cm. Tính $BC$ và $BD$ (cm).', hinh: h3,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$BC =$', kieu: 'so', gt: 6 }, { nhan: '$BD =$', kieu: 'so', gt: 9 }] },
        goiY: ['Hình thang cân có hai cạnh bên bằng nhau.', 'Hình thang cân có hai đường chéo bằng nhau.'],
        loiGiai: ['$BC = AD = 6$ cm (Định lí 1).', '$BD = AC = 9$ cm (Định lí 2).'] },
      { id: '11.4', muc: 1, de: 'Hình thang $ABCD$ ($AB \\parallel CD$) trong hình có $\\widehat{A} = 125^\\circ$. Tính $\\widehat{D}$ (độ).', hinh: h4,
        dapAn: { kieu: 'so', gt: 55 },
        goiY: ['Trong hình thang, hai góc kề một cạnh bên bù nhau.', '$\\widehat{D} = 180^\\circ - \\widehat{A}$.'],
        loiGiai: ['$\\widehat{A} + \\widehat{D} = 180^\\circ$ (hai góc kề cạnh bên $AD$).', '$\\widehat{D} = 180^\\circ - 125^\\circ = 55^\\circ$'],
        loiThuongGap: [{ gt: 125, giaiThich: 'Hai góc kề một cạnh bên **bù** nhau (tổng $180^\\circ$), không phải bằng nhau.' }] },
      { id: '11.5', muc: 2, de: 'Hình thang $ABCD$ ($AB \\parallel CD$) trong hình có $\\widehat{A} = 115^\\circ$, $\\widehat{C} = 70^\\circ$. Khẳng định "$ABCD$ là hình thang cân" đúng hay sai?', hinh: h5,
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Tính $\\widehat{D}$ từ $\\widehat{A}$ (hai góc kề cạnh bên $AD$).', 'So sánh $\\widehat{D}$ với $\\widehat{C}$: hai góc kề đáy $CD$ có bằng nhau không?'],
        loiGiai: ['$\\widehat{D} = 180^\\circ - 115^\\circ = 65^\\circ$.', '$\\widehat{D} = 65^\\circ \\ne 70^\\circ = \\widehat{C}$: hai góc kề đáy $CD$ không bằng nhau.', 'Vậy $ABCD$ **không** là hình thang cân. Khẳng định **sai**.'] },
      { id: '11.6', muc: 2, de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) trong hình có $AB = AD$ và $\\widehat{ABD} = 25^\\circ$. Tính $\\widehat{DAB}$ (độ).', hinh: h6,
        dapAn: { kieu: 'so', gt: 130 },
        goiY: ['Tam giác $ABD$ cân tại $A$ nên $\\widehat{ADB} = 25^\\circ$. $AB \\parallel CD$ nên $\\widehat{BDC} = 25^\\circ$ (so le trong).', '$\\widehat{ADC} = 50^\\circ$; góc $A$ bù với góc $D$.'],
        loiGiai: ['$AB = AD$ nên $\\widehat{ADB} = \\widehat{ABD} = 25^\\circ$.', '$AB \\parallel CD$ nên $\\widehat{BDC} = \\widehat{ABD} = 25^\\circ$ (so le trong). Do đó $\\widehat{ADC} = 50^\\circ$.', '$\\widehat{DAB} = 180^\\circ - 50^\\circ = 130^\\circ$'],
        loiThuongGap: [{ gt: 155, giaiThich: 'Em lấy $\\widehat{D} = 25^\\circ$. Góc $D$ của hình thang gồm hai phần $\\widehat{ADB} + \\widehat{BDC} = 50^\\circ$.' }, { gt: 50, giaiThich: '$50^\\circ$ là góc $D$. Góc $A$ bù với góc $D$: $180^\\circ - 50^\\circ$.' }] },
      { id: '11.7', muc: 2, de: 'Hình thang cân $ABCD$ trong hình có đáy nhỏ $AB = 6$ cm, đáy lớn $CD = 14$ cm, $AH$ là đường cao ($H \\in CD$). Tính $DH$ (cm).', hinh: h7,
        dapAn: { kieu: 'so', gt: 4 },
        goiY: ['Kẻ thêm đường cao $BK$. Hai tam giác vuông $AHD$ và $BKC$ bằng nhau nên $DH = KC$.', '$HK = AB = 6$, nên $DH + KC = 14 - 6 = 8$.'],
        loiGiai: ['Kẻ $BK \\perp CD$. Ta có $HK = AB = 6$ cm và $\\triangle AHD = \\triangle BKC$ (cạnh huyền – góc nhọn) nên $DH = KC$.', '$DH + KC = CD - HK = 14 - 6 = 8$ (cm)', '$DH = 8 : 2 = 4$'],
        loiThuongGap: [{ gt: 8, giaiThich: '$8$ cm là tổng $DH + KC$ ở **hai** bên. Hình thang cân đối xứng nên chia đôi.' }] },
      { id: '11.8', muc: 2, de: 'Tam giác $ABC$ cân tại $A$. Đường thẳng $d$ song song với $BC$ cắt $AB$ tại $D$, cắt $AC$ tại $E$ (hình). Tứ giác $DECB$ là hình gì?', hinh: h8,
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hình thang cân', 'Hình thang nhưng không cân', 'Hình bình hành', 'Không phải hình thang'] },
        goiY: ['$DE \\parallel BC$ nên $DECB$ là hình thang.', 'Hai góc kề đáy $BC$ là $\\widehat{B}$ và $\\widehat{C}$ của tam giác cân.'],
        loiGiai: ['$DE \\parallel BC$ nên $DECB$ là hình thang.', 'Tam giác $ABC$ cân tại $A$ nên $\\widehat{B} = \\widehat{C}$: hai góc kề đáy $BC$ bằng nhau.', 'Vậy $DECB$ là **hình thang cân**.'] },
      { id: '11.9', muc: 2, de: 'Cũng hình như câu trước, biết thêm $\\widehat{BAC} = 40^\\circ$. Tính góc $BDE$ (độ).', hinh: h9,
        dapAn: { kieu: 'so', gt: 110 },
        goiY: ['Tam giác cân: $\\widehat{B} = \\widehat{C} = (180^\\circ - 40^\\circ) : 2$.', 'Trong hình thang $DECB$, $\\widehat{BDE}$ và $\\widehat{B}$ kề cạnh bên $DB$ nên bù nhau.'],
        loiGiai: ['$\\widehat{B} = (180^\\circ - 40^\\circ) : 2 = 70^\\circ$.', '$DE \\parallel BC$ nên $\\widehat{BDE} + \\widehat{B} = 180^\\circ$.', '$\\widehat{BDE} = 180^\\circ - 70^\\circ = 110^\\circ$'],
        loiThuongGap: [{ gt: 70, giaiThich: '$70^\\circ$ là $\\widehat{ADE}$ (đồng vị với $\\widehat{B}$). Góc $BDE$ kề bù với nó.' }] },
      { id: '11.10', muc: 3, de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) có tia phân giác của góc $A$ và góc $B$ cắt nhau tại điểm $E$ nằm trên đáy $CD$ (hình). Biết $CD = 12$ cm. Tính $ED$ và cạnh bên $AD$ (cm).', hinh: h10,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$ED =$', kieu: 'so', gt: 6 }, { nhan: '$AD =$', kieu: 'so', gt: 6 }] },
        goiY: ['$AB \\parallel CD$ nên $\\widehat{BAE} = \\widehat{AED}$ (so le trong). Mà $\\widehat{BAE} = \\widehat{DAE}$ (phân giác). Tam giác $ADE$ thế nào?', 'Tam giác $ADE$ cân tại $D$: $AD = DE$. Tương tự $BC = CE$. Mà $AD = BC$.'],
        loiGiai: ['$\\widehat{AED} = \\widehat{BAE}$ (so le trong) $= \\widehat{DAE}$ (phân giác), nên $\\triangle ADE$ cân tại $D$: $DE = AD$.', 'Tương tự $\\triangle BCE$ cân tại $C$: $CE = BC$. Mà $AD = BC$ (hình thang cân) nên $DE = CE = 12 : 2 = 6$ cm.', 'Vậy $ED = 6$ cm và $AD = DE = 6$ cm.'] },
      { id: '11.11', hinhGiai: hg(tc({ dl: 18, dn: 10, canhBen: 9, nhan: { AB: '10 cm', DC: '18 cm', AD: { dau: '?', giai: '9 cm' }, BC: { dau: '?', giai: '9 cm' } } })), muc: 3, de: 'Một khung ảnh có dạng hình thang cân, chu vi $46$ cm, hai đáy dài $10$ cm và $18$ cm. Tính độ dài mỗi cạnh bên của khung (cm).',
        dapAn: { kieu: 'so', gt: 9 },
        goiY: ['Chu vi = tổng hai đáy + hai cạnh bên, mà hai cạnh bên bằng nhau.', 'Hai cạnh bên có tổng $46 - (10 + 18)$.'],
        loiGiai: ['Hai cạnh bên bằng nhau, tổng của chúng là $46 - (10 + 18) = 18$ (cm).', 'Mỗi cạnh bên: $18 : 2 = 9$'],
        loiThuongGap: [{ gt: 18, giaiThich: '$18$ cm là tổng **hai** cạnh bên. Chia đôi mới được mỗi cạnh.' }] }
    ],
    timLoi: [
      { de: 'Hình thang $ABCD$ ($AB \\parallel CD$) có $AD = BC = 5$ cm. Bạn Tròn lập luận như sau. Dòng nào sai?',
        loiGiaiSai: ['Hình thang $ABCD$ có hai cạnh bên $AD = BC$.', 'Hình thang có hai cạnh bên bằng nhau là hình thang cân, nên $ABCD$ là hình thang cân.', 'Do đó hai đường chéo $AC = BD$.'],
        dongSai: 1,
        giaiThich: 'Hình thang có hai cạnh bên bằng nhau **chưa chắc** là hình thang cân: hình bình hành cũng là hình thang có hai cạnh bên bằng nhau, nhưng hai đường chéo thường không bằng nhau.',
        sua: 'Chỉ kết luận được hình thang cân nếu biết thêm, ví dụ, hai góc kề một đáy bằng nhau hoặc hai đường chéo bằng nhau.' },
      { de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) có $\\widehat{C} = 70^\\circ$. Bạn Vuông tính $\\widehat{A}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$ABCD$ là hình thang cân nên $\\widehat{D} = \\widehat{C} = 70^\\circ$.', '$\\widehat{A}$ và $\\widehat{C}$ là hai góc đối nên $\\widehat{A} = \\widehat{C} = 70^\\circ$.', 'Vậy $\\widehat{A} = 70^\\circ$.'],
        dongSai: 1,
        giaiThich: 'Hình thang cân **không** có tính chất "hai góc đối bằng nhau" (đó là tính chất của hình bình hành). $\\widehat{A}$ kề cạnh bên $AD$ với $\\widehat{D}$ nên bù với $\\widehat{D}$.',
        sua: '$\\widehat{A} = 180^\\circ - \\widehat{D} = 180^\\circ - 70^\\circ = 110^\\circ$.' }
    ]
  });
})();
