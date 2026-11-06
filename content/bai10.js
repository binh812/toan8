// Bài 10 – Tứ giác (SGK Toán 8 KNTT, Tập 1, tr. 48–51)
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
  function doiTen(T, ten) { var o = {}; ['A', 'B', 'C', 'D'].forEach(function (k, i) { o[ten[i]] = T[k]; }); return o; }

  // Hình 10.3: Â = 100°, B̂ = 70°, Ĉ = 110°, D̂ = ?
  var h3 = hinhTG({ diem: tg4(100, 70, 80, 6, 3.5), vong: ['A', 'B', 'C', 'D'],
    goc: [['B', 'A', 'D'], ['A', 'B', 'C'], ['B', 'C', 'D'], ['C', 'D', 'A', { mau: XANH }]],
    soGoc: [['B', 'A', 'D', '100°'], ['A', 'B', 'C', '70°', 1.3], ['B', 'C', 'D', '110°'], ['C', 'D', 'A', '?', 1, XANH]] });
  // Hình 10.4: ba góc vuông A, B, D
  var h4 = hinhTG({ diem: { A: [0, 4], B: [6.5, 4], C: [6.5, 0], D: [0, 0] }, vong: ['A', 'B', 'C', 'D'],
    goc: [['B', 'A', 'D'], ['C', 'B', 'A'], ['A', 'D', 'C']], soGoc: [['B', 'C', 'D', '?', 1, XANH]] });
  // Hình 10.5: M̂ = 90°, góc ngoài tại N bằng 65°, P̂ = 80°, Q̂ = ?
  var T5 = doiTen(tg4(90, 115, 75, 5.5, 4), ['M', 'N', 'P', 'Q']);
  T5.x = [7.4, 0];
  var h5 = hinhTG({ diem: T5, vong: ['M', 'N', 'P', 'Q'], canh: [['N', 'x', { day: 2 }]],
    goc: [['N', 'M', 'Q'], ['x', 'N', 'P'], ['N', 'P', 'Q'], ['P', 'Q', 'M', { mau: XANH }]],
    soGoc: [['x', 'N', 'P', '65°', 1.2], ['N', 'P', 'Q', '80°'], ['P', 'Q', 'M', '?', 1, XANH]] });
  // Hình 10.6: Ĝ = 60°, F̂ = 70°, Ĥ = Ê + 30°
  var h6 = hinhTG({ diem: doiTen(tg4(60, 70, 130, 7, 3), ['G', 'F', 'E', 'H']), vong: ['E', 'F', 'G', 'H'],
    goc: [['H', 'G', 'F'], ['G', 'F', 'E']],
    soGoc: [['H', 'G', 'F', '60°', 1.2], ['G', 'F', 'E', '70°', 1.2], ['F', 'E', 'H', '?', 1, XANH], ['E', 'H', 'G', '?', 1, XANH]] });
  // Hình 10.7: "cái diều" AB = AD, CB = CD, Â = 120°, Ĉ = 50°
  function dieu(gA, gC, a) {
    var A = [0, 0], B = toi(A, 180 + gA / 2, a), D = toi(A, 180 - gA / 2, a);
    var c = -B[1] / Math.sin(rad(gC / 2));
    return { A: A, B: B, C: [B[0] - c * Math.cos(rad(gC / 2)), 0], D: D };
  }
  var h7 = hinhTG({ diem: dieu(120, 50, 2.6), vong: ['A', 'B', 'C', 'D'], vach: { AB: 2, DA: 2, BC: 1, CD: 1 },
    goc: [['D', 'A', 'B'], ['B', 'C', 'D'], ['A', 'B', 'C', { mau: XANH }]],
    soGoc: [['D', 'A', 'B', '120°', 1.1], ['B', 'C', 'D', '50°', 1.6], ['A', 'B', 'C', '?', 1, XANH]] });

  // ---------- Hình động ----------
  function doGoc(P, O, Q) {
    var ux = P.X() - O.X(), uy = P.Y() - O.Y(), vx = Q.X() - O.X(), vy = Q.Y() - O.Y();
    var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  // Tứ giác lồi ⇔ bốn lần rẽ cùng một chiều (không có ba đỉnh liên tiếp thẳng hàng).
  function laLoi(Q) {
    var dau = 0;
    for (var i = 0; i < 4; i++) {
      var P = Q[i], R = Q[(i + 1) % 4], S = Q[(i + 2) % 4];
      var c = (R.X() - P.X()) * (S.Y() - R.Y()) - (R.Y() - P.Y()) * (S.X() - R.X());
      if (Math.abs(c) < 0.05) return false;
      if (!dau) dau = c > 0 ? 1 : -1; else if ((c > 0 ? 1 : -1) !== dau) return false;
    }
    return true;
  }
  // Làm tròn bốn số đo sao cho tổng các số đã làm tròn vẫn đúng bằng tổng thật (làm tròn theo phần dư lớn nhất).
  function lamTron(a) {
    var tong = Math.round(a.reduce(function (s, x) { return s + x; }, 0));
    var r = a.map(Math.floor), du = tong - r.reduce(function (s, x) { return s + x; }, 0);
    a.map(function (x, i) { return [x - Math.floor(x), i]; }).sort(function (p, q) { return q[0] - p[0]; })
      .slice(0, Math.max(0, du)).forEach(function (p) { r[p[1]]++; });
    return r;
  }
  function cung(board, P, O, Q, mau, r) {
    board.create('nonreflexangle', [P, O, Q], { radius: r || 0.7, name: '', fillColor: mau, strokeColor: mau, fillOpacity: 0.35, fixed: true, highlight: false });
  }

  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 0.5, 0.5), B = G.pt('B', 7.5, 0), C = G.pt('C', 6.5, 5), D = G.pt('D', 1.5, 4.2), Q = [A, B, C, D];
    G.poly(Q, { fillOpacity: 0.06 });
    var mau = [CAM, XANH, LA, TIM], ten = ['A', 'B', 'C', 'D'];
    cung(board, D, A, B, CAM); cung(board, A, B, C, XANH); cung(board, B, C, D, LA); cung(board, C, D, A, TIM);
    function goc() {
      var a = [doGoc(D, A, B), doGoc(A, B, C), doGoc(B, C, D), doGoc(C, D, A)];
      return laLoi(Q) ? lamTron(a) : a.map(Math.round);
    }
    ten.forEach(function (t, i) {
      G.label(-0.8 + 2.6 * i, 7.5, function () { return 'góc ' + t + ' = ' + goc()[i] + '°'; }, { strokeColor: mau[i] });
    });
    G.label(-0.8, 6.6, function () {
      if (!laLoi(Q)) return 'Tứ giác không còn lồi – em kéo lại cho lồi nhé';
      var g = goc();
      return 'Tổng: ' + g.join('° + ') + '° = ' + (g[0] + g[1] + g[2] + g[3]) + '°';
    }, { cssStyle: 'font-weight:700' });
  };

  var chiaBuild = function (board, G) {
    var A = G.pt('A', 0.5, 0.5), B = G.pt('B', 7.5, 0.3), C = G.pt('C', 7.8, 4.6), D = G.pt('D', 1.8, 4);
    G.poly([A, B, D], { fillColor: CAM, fillOpacity: 0.18 });
    G.poly([C, D, B], { fillColor: XANH, fillOpacity: 0.18 });
    G.seg(B, D, { strokeColor: TIM, strokeWidth: 3, dash: 2 });
    cung(board, D, A, B, CAM); cung(board, B, C, D, XANH);
    cung(board, A, B, D, CAM, 0.9); cung(board, D, B, C, XANH, 0.6); cung(board, B, D, A, CAM, 0.6); cung(board, C, D, B, XANH, 0.9);
    G.label(-0.8, 7.3, 'Tam giác ABD (cam): ba góc cộng lại = 180°', { strokeColor: CAM, fontSize: 16 });
    G.label(-0.8, 6.6, 'Tam giác CBD (xanh): ba góc cộng lại = 180°', { strokeColor: XANH, fontSize: 16 });
    G.label(-0.8, 5.9, 'Tứ giác ABCD: 180° + 180° = 360°', { fontSize: 16, cssStyle: 'font-weight:700' });
  };

  // ---------- Cấu hình cảnh cho "Nhìn là hiểu" ----------
  function so(x) { return String(x).replace('.', '{,}'); }
  function vong(goc, them) { return { ten: 'gocTuGiac', tuyChon: Object.assign({ goc: goc }, them || {}) }; }
  // Hình ở lời giải: đã ghép xong; đáp án chỉ hiện khi em bấm "Xem lời giải" (trang tự đặt trạng thái giai)
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  // Em gõ một số đo: hình đặt góc đó vào chỗ hở (n góc bằng nhau thì n quạt), để thấy còn hở hay bị đè
  function datGoc(ho, n) {
    return function (v) {
      if (v <= 0) return { t: 1, loi: 'Số đo góc phải lớn hơn $0^\\circ$.' };
      var ten = n > 1 ? n + ' góc $' + so(v) + '^\\circ$' : 'Góc $' + so(v) + '^\\circ$';
      if (v >= 180) return { thamSo: { thu: v }, t: 1, loi: 'Góc của tứ giác lồi luôn nhỏ hơn $180^\\circ$. Nhìn hình: phần đỏ đè lên các góc khác.' };
      return { thamSo: { thu: v }, t: 1, loi: n * v < ho ? ten + ' chưa lấp kín chỗ hở: các góc chưa khép được một vòng.' : ten + ' đè lên góc khác: các góc vượt quá một vòng $360^\\circ$.' };
    };
  }
  var dieuDiem = (function () { var P = dieu(120, 50, 2.6); return [P.A, P.B, P.C, P.D]; })();

  var hinhCheo = hinhTG({ diem: { A: [0, 2.4], B: [3.2, 0], C: [6.5, 2.2], D: [2.6, 4.6] }, vong: ['A', 'B', 'C', 'D'],
    canh: [['A', 'C', { mau: TIM, day: 2, net: 2 }], ['B', 'D', { mau: TIM, day: 2, net: 2 }], ['A', 'B', { mau: CAM, day: 4 }], ['C', 'D', { mau: CAM, day: 4 }]],
    ghiChu: 'Cặp cạnh đối AB, CD (cam) – hai đường chéo AC, BD (tím)' });

  TOAN8.bai({
    id: 10, ten: 'Tứ giác', sgk: { tap: 1, trang: 48 },
    nhin: {
      tieuDe: 'Kẻ một đường chéo: các góc ghép đủ một vòng', loai: 'chungMinh',
      luuY: 'Hình vẽ tứ giác lồi. Ở tứ giác lồi, đường chéo $BD$ luôn nằm bên trong nên chia góc $B$ và góc $D$ làm hai phần. Kéo hai thanh để đổi hình: cách ghép vẫn đúng.',
      canh: { ten: 'gocTuGiac', tuyChon: { dang: 'chia' }, moTa: 'Tứ giác ABCD có bốn góc tô bốn màu. Đường chéo BD chia nó thành hai tam giác; sáu góc của hai tam giác được đặt quanh một điểm và lấp kín một vòng tròn.',
        dongSo: function (p) {
          var g = lamTron(TOAN8.canh.lay('gocTuGiac').tinh(p, 0, { dang: 'chia' }).g);
          return 'Đo bốn góc: $\\ca{\\widehat{A}} \\approx ' + g[0] + '^\\circ$, $\\cb{\\widehat{B}} \\approx ' + g[1] + '^\\circ$, $\\cc{\\widehat{C}} \\approx ' + g[2] + '^\\circ$, $\\widehat{D} \\approx ' + g[3] + '^\\circ$. Cộng lại: $' + (g[0] + g[1] + g[2] + g[3]) + '^\\circ$.';
        } },
      buoc: [
        { t: 0, chu: 'Tứ giác $ABCD$, mỗi góc một màu. Bên phải là một vòng tròn còn trống.' },
        { t: 0.1, chu: 'Kẻ đường chéo $BD$. Tứ giác tách thành hai tam giác $ABD$ và $CBD$. Góc $B$ và góc $D$ mỗi góc bị chia làm hai phần.' },
        { t: 0.25, chu: 'Đặt ba góc của tam giác $ABD$ sát nhau: chúng ghép thành một góc bẹt, tức $180^\\circ$ (tổng ba góc của một tam giác, em đã học ở lớp 7).' },
        { t: 0.6, chu: 'Ba góc của tam giác $CBD$ lấp nửa vòng còn lại, thêm $180^\\circ$.' },
        { t: 1, chu: 'Hai phần của góc $B$ nằm sát nhau, hai phần của góc $D$ cũng vậy. Cả vòng tròn chính là bốn góc $\\ca{A}$, $\\cb{B}$, $\\cc{C}$, $D$ của tứ giác.' }
      ],
      ketLuan: 'Bốn góc của tứ giác lấp kín đúng một vòng: $$\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 180^\\circ + 180^\\circ = 360^\\circ$$',
      dung: {
        tieuDe: 'Góc D chính là chỗ còn hở', tuBai: '10.3',
        canh: Object.assign(vong([100, 70, 110, 80], { an: [3] }), { moTa: 'Tứ giác có ba góc 100 độ, 70 độ, 110 độ. Ba góc này được ghép quanh một điểm, còn hở một phần vòng tròn.' }),
        moiThu: 'Bốn góc phải khép kín đúng một vòng. Ba góc đã biết để lại một chỗ hở: đó là góc $D$. Gõ số đo góc $D$; nếu sai, hình sẽ đặt đúng góc em gõ vào chỗ hở.',
        phanUng: [
          { gt: -100, loi: 'Em lấy $180^\\circ - 280^\\circ$. Bốn góc của tứ giác lấp kín cả một vòng $360^\\circ$, không phải nửa vòng $180^\\circ$.' },
          { gt: 280, loi: '$280^\\circ$ là tổng **ba** góc đã biết. Góc $D$ là phần còn hở của vòng tròn: lấy $360^\\circ$ trừ đi tổng đó.' }
        ],
        soBatKi: datGoc(80, 1),
        dungChu: '$100^\\circ + 70^\\circ + 110^\\circ + 80^\\circ = 360^\\circ$: bốn góc khép kín một vòng.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng các góc vẫn phải khép kín một vòng',
        baDe: [
          { tuBai: '10.5', canh: Object.assign(vong([90, 115, 80, 75], { ten: ['M', 'N', 'P', 'Q'], an: [3], ngoai: { i: 1, nhan: '65°' }, nhan: { 1: { dau: '', cuoi: '115°' } } }),
            { moTa: 'Tứ giác MNPQ có góc M 90 độ, góc P 80 độ, góc ngoài tại N 65 độ. Bấm nút để ghép các góc trong quanh một điểm.' }), tenNut: 'Ghép các góc trong',
            phanUng: [{ gt: 125, loi: 'Em lấy góc ngoài $65^\\circ$ làm góc $N$ của tứ giác. Góc trong tại $N$ kề bù với nó: $180^\\circ - 65^\\circ = 115^\\circ$.' }],
            soBatKi: datGoc(75, 1),
            dungChu: '$90^\\circ + 115^\\circ + 80^\\circ + 75^\\circ = 360^\\circ$.', saiChu: 'Đổi góc ngoài sang góc trong trước: $180^\\circ - 65^\\circ$. Rồi xem chỗ hở còn lại.' },
          { tuBai: '10.7', canh: { ten: 'gocTuGiac', tuyChon: { diem: dieuDiem, an: [1, 3], bang: true }, moTa: 'Hình cái diều ABCD có góc A 120 độ, góc C 50 độ; góc B và góc D bằng nhau.' }, tenNut: 'Ghép các góc',
            phanUng: [{ gt: 190, loi: '$190^\\circ$ là chỗ hở dành cho **cả hai** góc $B$ và $D$. Hai góc bằng nhau chia đôi chỗ hở đó.' }],
            soBatKi: datGoc(190, 2),
            dungChu: '$120^\\circ + 50^\\circ + 95^\\circ + 95^\\circ = 360^\\circ$.', saiChu: 'Chỗ hở là $360^\\circ - (120^\\circ + 50^\\circ)$, chia đều cho hai góc bằng nhau.' },
          { tuBai: '10.8', canh: Object.assign(vong([60, 90, 90, 120], { phan: [2, 3, 3, 4], nhan: ['2x', '3x', '3x', { dau: '4x', giai: '120°' }] }),
            { moTa: 'Tứ giác có bốn góc tỉ lệ 2, 3, 3, 4. Mỗi góc chia thành các phần bằng nhau.' }), tenNut: 'Chia vòng thành phần bằng nhau',
            phanUng: [{ gt: 30, loi: '$30^\\circ$ là **một phần** $x$. Góc lớn nhất gồm $4$ phần.' }, { gt: 90, loi: 'Em chia $360^\\circ$ cho $4$ góc. Nhưng các góc không bằng nhau: vòng tròn có $2 + 3 + 3 + 4 = 12$ phần bằng nhau.' }],
            dungChu: 'Vòng tròn có $12$ phần, mỗi phần $30^\\circ$; góc lớn nhất có $4$ phần: $120^\\circ$.', saiChu: 'Đếm xem cả vòng tròn có bao nhiêu phần bằng nhau, rồi tìm cỡ một phần.' }
        ],
        cachNhan: 'Biết vài góc của tứ giác, hỏi góc còn lại: ghép các góc quanh một điểm, chúng phải khép kín đúng một vòng $360^\\circ$. Gặp góc ngoài thì đổi sang góc trong trước.'
      }
    },
    khamPha: {
      nhiemVu: 'Kéo bốn đỉnh $A$, $B$, $C$, $D$ để thay đổi hình tứ giác. Mỗi góc có một màu, số đo của nó hiện ở dòng trên cùng.\n\nEm hãy để ý **dòng tổng** bên dưới: dù tứ giác méo thế nào (miễn là còn **lồi**), tổng bốn góc có thay đổi không?',
      widget: 'geo',
      config: { bbox: [-1, 8.2, 10, -1], build: khamPhaBuild },
      cauHoi: {
        de: 'Khi tứ giác còn lồi, tổng bốn góc của nó luôn bằng bao nhiêu độ?',
        dapAn: { kieu: 'so', gt: 360 },
        goiY: ['Kéo các đỉnh tới vài vị trí khác nhau rồi đọc dòng "Tổng".', 'Tổng hai tam giác: $180^\\circ + 180^\\circ$.'],
        loiGiai: ['Dù kéo thế nào, tổng bốn góc luôn là $360^\\circ$.', 'Đó chính là **định lí tổng các góc của một tứ giác**: $\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ$.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Tứ giác',
        noiDung: '**Tứ giác** $ABCD$ là hình gồm bốn đoạn thẳng $AB$, $BC$, $CD$, $DA$, trong đó **không có hai đoạn thẳng nào nằm trên cùng một đường thẳng**.\n\n- Các điểm $A$, $B$, $C$, $D$ là các **đỉnh**.\n- Các đoạn thẳng $AB$, $BC$, $CD$, $DA$ là các **cạnh**.\n\nVí dụ: nếu $B$, $C$, $D$ thẳng hàng thì $BC$ và $CD$ nằm trên một đường thẳng, hình đó **không** là tứ giác (nhìn như một tam giác).' },
      { loai: 'dinhNghia', tieuDe: 'Tứ giác lồi',
        noiDung: '**Tứ giác lồi** là tứ giác mà hai đỉnh thuộc một cạnh bất kì luôn nằm về **một phía** của đường thẳng đi qua hai đỉnh còn lại.\n\nNói nôm na: tứ giác lồi không có chỗ nào bị "lõm" vào trong.\n\nTrong tứ giác lồi $ABCD$, các góc $ABC$, $BCD$, $CDA$, $DAB$ gọi là các **góc** của tứ giác, viết gọn là $\\widehat{B}$, $\\widehat{C}$, $\\widehat{D}$, $\\widehat{A}$.' },
      { loai: 'chuY', noiDung: '- Từ nay, nói "tứ giác" mà không chú thích gì thêm thì hiểu là **tứ giác lồi**.\n- Tên tứ giác đọc theo thứ tự các đỉnh đi vòng quanh hình: tứ giác $ABCD$ cũng có thể gọi là $BCDA$, $CDAB$, $DABC$, $ADCB$, $DCBA$, $CBAD$, $BADC$. Nhưng **không** được gọi là $ACBD$ (nhảy cóc qua đường chéo).' },
      { loai: 'dinhNghia', tieuDe: 'Đỉnh đối, cạnh đối, góc đối, đường chéo',
        noiDung: 'Trong tứ giác $ABCD$:\n\n- Hai đỉnh **không** cùng thuộc một cạnh là **hai đỉnh đối nhau**: $A$ và $C$; $B$ và $D$.\n- Đoạn thẳng nối hai đỉnh đối nhau là **đường chéo**: $\\cd{AC}$ và $\\cd{BD}$.\n- Hai cạnh không có đỉnh chung là **cặp cạnh đối**: $\\ca{AB}$ và $\\ca{CD}$; $BC$ và $DA$.\n- Hai góc ở hai đỉnh đối nhau là **cặp góc đối**: $\\widehat{A}$ và $\\widehat{C}$; $\\widehat{B}$ và $\\widehat{D}$.\n\nTrong tứ giác (lồi), hai đường chéo cắt nhau tại một điểm nằm giữa mỗi đường.' },
      { loai: 'hinh', widget: hinhCheo.widget, config: hinhCheo.config,
        chuThich: 'Cặp cạnh đối $\\ca{AB}$, $\\ca{CD}$ tô cam; hai đường chéo $\\cd{AC}$, $\\cd{BD}$ là nét đứt màu tím.' },
      { loai: 'dinhLi', tieuDe: 'Tổng các góc của một tứ giác',
        noiDung: '**Tổng các góc của một tứ giác bằng $360^\\circ$.**\n\n$$\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ$$\n\n**Vì sao?** Kẻ đường chéo $BD$, tứ giác bị chia thành hai tam giác $\\ca{ABD}$ và $\\cb{CBD}$. Tổng ba góc của mỗi tam giác là $180^\\circ$, nên tổng các góc của tứ giác là $180^\\circ + 180^\\circ = 360^\\circ$.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 7.9, 10, -1], build: chiaBuild },
        chuThich: 'Kéo các đỉnh. Đường chéo $BD$ chia tứ giác thành tam giác **cam** và tam giác **xanh**. Góc $B$ và góc $D$ của tứ giác bị chia làm hai phần, mỗi phần thuộc một tam giác.' },
      { loai: 'chuY', noiDung: '**Cách tìm góc còn lại:** $\\widehat{D} = 360^\\circ - (\\widehat{A} + \\widehat{B} + \\widehat{C})$.\n\n**Hay nhầm 1 – nhớ nhầm $180^\\circ$.** $180^\\circ$ là tổng ba góc của **tam giác**. Tứ giác là $360^\\circ$.\n\n**Hay nhầm 2 – lấy góc ngoài làm góc trong.** Nếu hình cho góc **ngoài** tại một đỉnh (góc tạo bởi một cạnh và phần kéo dài của cạnh kề), thì góc trong của tứ giác tại đỉnh đó $= 180^\\circ -$ góc ngoài.' }
    ],
    viDu: [
      { de: 'Cho tứ giác $ABCD$ có $\\widehat{A} = 105^\\circ$, $\\widehat{B} = 95^\\circ$, $\\widehat{C} = 70^\\circ$. Tính $\\widehat{D}$.', canh: vong([105, 95, 70, 90], { an: [3], loCuoi: true }), buoc: [
        { lam: '$\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ$', vi: 'Định lí tổng các góc của một tứ giác.', canh: { t: 0.9 } },
        { lam: '$\\widehat{D} = 360^\\circ - (105^\\circ + 95^\\circ + 70^\\circ)$', vi: 'Lấy $360^\\circ$ trừ đi tổng ba góc đã biết.', canh: { t: 0.95 } },
        { lam: '$\\widehat{D} = 360^\\circ - 270^\\circ = 90^\\circ$', vi: 'Tính tổng trong ngoặc trước: $105 + 95 + 70 = 270$.', canh: { t: 1 } } ] },
      { de: 'Tứ giác $EFGH$ có $\\widehat{E} = \\widehat{G} = 90^\\circ$ và $\\widehat{H} = 65^\\circ$. Tính $\\widehat{F}$.', canh: vong([90, 115, 90, 65], { ten: ['E', 'F', 'G', 'H'], an: [1], loCuoi: true }), buoc: [
        { lam: '$\\widehat{F} = 360^\\circ - (\\widehat{E} + \\widehat{G} + \\widehat{H})$', vi: 'Tổng bốn góc là $360^\\circ$, biết ba góc thì tìm được góc thứ tư.', canh: { t: 0.9 } },
        { lam: '$\\widehat{F} = 360^\\circ - (90^\\circ + 90^\\circ + 65^\\circ) = 360^\\circ - 245^\\circ = 115^\\circ$', vi: 'Thay số rồi tính.', canh: { t: 1 } } ] },
      { de: 'Tứ giác $EFGH$ có $\\widehat{F} = 60^\\circ$, $\\widehat{G} = 70^\\circ$ và $\\widehat{H} = \\widehat{E} + 20^\\circ$. Tính $\\widehat{E}$ và $\\widehat{H}$.',
        canh: vong([105, 60, 70, 125], { ten: ['E', 'F', 'G', 'H'], an: [0, 3], loCuoi: true, nhanHo: { dau: '?', cuoi: '230°' } }), buoc: [
        { lam: '$\\widehat{E} + \\widehat{H} = 360^\\circ - (60^\\circ + 70^\\circ) = 230^\\circ$', vi: 'Hai góc chưa biết có tổng bằng $360^\\circ$ trừ hai góc đã biết: đó là chỗ hở trên vòng tròn.', canh: { t: 0.9 } },
        { lam: '$\\widehat{E} + (\\widehat{E} + 20^\\circ) = 230^\\circ$, nên $2\\widehat{E} = 210^\\circ$', vi: 'Thay $\\widehat{H} = \\widehat{E} + 20^\\circ$ vào tổng.', canh: { t: 0.95 } },
        { lam: '$\\widehat{E} = 105^\\circ$; $\\widehat{H} = 105^\\circ + 20^\\circ = 125^\\circ$', vi: 'Chia đôi rồi cộng thêm $20^\\circ$. Thử lại: $105 + 125 + 60 + 70 = 360$ ✓.', canh: { t: 1 } } ] },
      { de: 'Tứ giác $RSUV$ có $\\widehat{V} = 90^\\circ$. Góc ngoài tại đỉnh $U$ bằng $60^\\circ$, góc ngoài tại đỉnh $S$ bằng $110^\\circ$. Tính góc $R$.',
        canh: vong([80, 70, 120, 90], { ten: ['R', 'S', 'U', 'V'], an: [0], loCuoi: true, ngoai: [{ i: 1, nhan: '110°' }, { i: 2, nhan: '60°' }], nhan: { 1: { dau: '', cuoi: '70°' }, 2: { dau: '', cuoi: '120°' } } }), buoc: [
        { lam: '$\\widehat{U} = 180^\\circ - 60^\\circ = 120^\\circ$; $\\widehat{S} = 180^\\circ - 110^\\circ = 70^\\circ$', vi: 'Góc trong và góc ngoài tại cùng một đỉnh là hai góc **kề bù**, tổng bằng $180^\\circ$.', canh: { t: 0.9 } },
        { lam: '$\\widehat{R} = 360^\\circ - (90^\\circ + 120^\\circ + 70^\\circ) = 80^\\circ$', vi: 'Bây giờ đã đủ ba góc **trong**, dùng định lí tổng bốn góc.', canh: { t: 1 } } ] }
    ],
    viDuMo: [
      { de: 'Cho tứ giác $ABCD$ có $\\widehat{A} = 75^\\circ$, $\\widehat{B} = 115^\\circ$, $\\widehat{C} = 100^\\circ$. Tính $\\widehat{D}$ (độ).', buoc: [
        { lam: '$\\widehat{D} = 360^\\circ - (75^\\circ + 115^\\circ + 100^\\circ)$', vi: 'Định lí tổng các góc của tứ giác.' },
        { lam: '$\\widehat{D} = 360^\\circ - 290^\\circ = 70^\\circ$', vi: 'Em hãy tính $\\widehat{D}$ (độ):', an: true,
          dapAn: { kieu: 'so', gt: 70 },
          loiThuongGap: [{ gt: -110, giaiThich: 'Em dùng tổng $180^\\circ$ của tam giác. Tứ giác có tổng bốn góc là $360^\\circ$.' }] } ] },
      { de: 'Tứ giác $ABCD$ có $\\widehat{A} : \\widehat{B} : \\widehat{C} : \\widehat{D} = 1 : 2 : 3 : 4$. Tính góc lớn nhất (độ).', buoc: [
        { lam: 'Đặt $\\widehat{A} = x$, $\\widehat{B} = 2x$, $\\widehat{C} = 3x$, $\\widehat{D} = 4x$.', vi: 'Bốn góc tỉ lệ với $1, 2, 3, 4$ nên viết được theo cùng một $x$.' },
        { lam: '$x + 2x + 3x + 4x = 360^\\circ$, tức $10x = 360^\\circ$, $x = 36^\\circ$', vi: 'Tổng bốn góc là $360^\\circ$.' },
        { lam: '$\\widehat{D} = 4 \\cdot 36^\\circ = 144^\\circ$', vi: 'Em hãy tính góc lớn nhất $\\widehat{D}$ (độ):', an: true,
          dapAn: { kieu: 'so', gt: 144 },
          loiThuongGap: [{ gt: 36, giaiThich: '$36^\\circ$ mới là $x$ (góc nhỏ nhất). Góc lớn nhất là $4x$.' }] } ] }
    ],
    baiTap: [
      { id: '10.1', khongHinh: 'Câu về định nghĩa tứ giác: chỉ cần hình dung ba điểm thẳng hàng, không có số để tính.', muc: 1, de: 'Cho bốn đoạn thẳng $AB$, $BC$, $CD$, $DA$. Trường hợp nào dưới đây hình đó **không** phải là tứ giác?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Không có ba điểm nào trong $A$, $B$, $C$, $D$ thẳng hàng', 'Ba điểm $B$, $C$, $D$ thẳng hàng ($C$ nằm giữa $B$ và $D$)', 'Tứ giác có một góc tù', 'Hai đường chéo cắt nhau'] },
        goiY: ['Định nghĩa: không có **hai đoạn thẳng nào nằm trên cùng một đường thẳng**.', 'Nếu $B$, $C$, $D$ thẳng hàng thì hai đoạn $BC$ và $CD$ ra sao?'],
        loiGiai: ['Khi $B$, $C$, $D$ thẳng hàng, hai đoạn $BC$ và $CD$ nằm trên cùng một đường thẳng.', 'Hình nhận được trông như tam giác $ABD$, **không** phải tứ giác.'] },
      { id: '10.2', khongHinh: 'Câu gọi tên đường chéo theo thứ tự đỉnh; hình đường chéo đã có ở phần Lý thuyết.', muc: 1, de: 'Hai đường chéo của tứ giác $MNPQ$ là cặp đoạn thẳng nào?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$MN$ và $PQ$', '$MP$ và $NQ$', '$MQ$ và $NP$', '$MN$ và $NP$'] },
        goiY: ['Đường chéo nối hai đỉnh **đối nhau** (không cùng thuộc một cạnh).', 'Đi vòng $M \\to N \\to P \\to Q$: đỉnh đối của $M$ là đỉnh cách nó một đỉnh.'],
        loiGiai: ['Các cặp đỉnh đối nhau: $M$ và $P$; $N$ và $Q$.', 'Vậy hai đường chéo là $MP$ và $NQ$. ($MN$, $PQ$ là cặp **cạnh đối**.)'] },
      { id: '10.3', muc: 1, de: 'Tính góc $D$ của tứ giác $ABCD$ trong hình (đơn vị: độ).', hinh: h3,
        dapAn: { kieu: 'so', gt: 80 },
        goiY: ['Tổng bốn góc của tứ giác bằng $360^\\circ$.', '$\\widehat{D} = 360^\\circ - (100^\\circ + 70^\\circ + 110^\\circ)$.'],
        loiGiai: ['$\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ$', '$\\widehat{D} = 360^\\circ - (100^\\circ + 70^\\circ + 110^\\circ) = 360^\\circ - 280^\\circ$', '$\\widehat{D} = 80^\\circ$'],
        loiThuongGap: [{ gt: -100, giaiThich: 'Em dùng tổng $180^\\circ$ của tam giác. Tứ giác có tổng bốn góc là $360^\\circ$.' }] },
      { id: '10.4', muc: 1, de: 'Tứ giác $ABCD$ trong hình có ba góc $A$, $B$, $D$ đều vuông. Tính góc $C$ (độ).', hinh: h4,
        dapAn: { kieu: 'so', gt: 90 },
        goiY: ['Ba góc vuông có tổng bao nhiêu độ?', '$\\widehat{C} = 360^\\circ - 3 \\cdot 90^\\circ$.'],
        loiGiai: ['$\\widehat{C} = 360^\\circ - (90^\\circ + 90^\\circ + 90^\\circ) = 360^\\circ - 270^\\circ$', 'Tứ giác có ba góc vuông thì góc còn lại cũng vuông: $\\widehat{C} = 90^\\circ$'] },
      { id: '10.5', muc: 2, de: 'Trong hình, tứ giác $MNPQ$ có $\\widehat{M} = 90^\\circ$, $\\widehat{P} = 80^\\circ$; tia $Nx$ là tia đối của tia $NM$ và $\\widehat{xNP} = 65^\\circ$. Tính góc $Q$ (độ).', hinh: h5,
        dapAn: { kieu: 'so', gt: 75 },
        goiY: ['$65^\\circ$ là góc **ngoài** tại $N$. Góc trong $\\widehat{MNP}$ kề bù với nó.', '$\\widehat{N} = 180^\\circ - 65^\\circ = 115^\\circ$. Rồi dùng tổng bốn góc.'],
        loiGiai: ['$\\widehat{MNP} = 180^\\circ - 65^\\circ = 115^\\circ$ (hai góc kề bù).', '$\\widehat{Q} = 360^\\circ - (90^\\circ + 115^\\circ + 80^\\circ) = 360^\\circ - 285^\\circ$', '$\\widehat{Q} = 75^\\circ$'],
        loiThuongGap: [{ gt: 125, hinh: { widget: 'canh', config: { ten: 'gocTuGiac', chiXem: true, t: 1, thamSo: { thu: 125 }, ghiChu: 'Phần đỏ là góc 125° em tìm: nó đè lên góc khác, bốn góc vượt quá một vòng.',
          tuyChon: { goc: [90, 115, 80, 75], ten: ['M', 'N', 'P', 'Q'], an: [3], ngoai: { i: 1, nhan: '65°' } } } },
          giaiThich: 'Em lấy luôn góc ngoài $65^\\circ$ làm góc $N$ của tứ giác. Góc trong tại $N$ là $180^\\circ - 65^\\circ = 115^\\circ$.' }] },
      { id: '10.6', muc: 2, de: 'Tứ giác $EFGH$ trong hình có $\\widehat{F} = 70^\\circ$, $\\widehat{G} = 60^\\circ$ và $\\widehat{H} = \\widehat{E} + 30^\\circ$. Tính $\\widehat{E}$ và $\\widehat{H}$ (độ).', hinh: h6,
        dapAn: { kieu: 'nhieuO', o: [{ nhan: '$\\widehat{E} =$', kieu: 'so', gt: 100 }, { nhan: '$\\widehat{H} =$', kieu: 'so', gt: 130 }] },
        goiY: ['Tính tổng $\\widehat{E} + \\widehat{H}$ trước: $360^\\circ - (70^\\circ + 60^\\circ)$.', '$\\widehat{E} + \\widehat{E} + 30^\\circ = 230^\\circ$, giải ra $\\widehat{E}$.'],
        loiGiai: ['$\\widehat{E} + \\widehat{H} = 360^\\circ - (70^\\circ + 60^\\circ) = 230^\\circ$', '$2\\widehat{E} + 30^\\circ = 230^\\circ$, nên $\\widehat{E} = 100^\\circ$', '$\\widehat{H} = 100^\\circ + 30^\\circ = 130^\\circ$'] },
      { id: '10.7', muc: 2, de: 'Tứ giác $ABCD$ trong hình có $AB = AD$, $CB = CD$ (hình "cái diều"), $\\widehat{A} = 120^\\circ$, $\\widehat{C} = 50^\\circ$. Biết $\\widehat{B} = \\widehat{D}$. Tính góc $B$ (độ).', hinh: h7,
        dapAn: { kieu: 'so', gt: 95 },
        goiY: ['Hai góc $B$ và $D$ bằng nhau, tổng của chúng là $360^\\circ - (120^\\circ + 50^\\circ)$.', 'Chia đôi tổng đó.'],
        loiGiai: ['$\\widehat{B} + \\widehat{D} = 360^\\circ - (120^\\circ + 50^\\circ) = 190^\\circ$', 'Vì $\\widehat{B} = \\widehat{D}$ nên $\\widehat{B} = 190^\\circ : 2 = 95^\\circ$'],
        loiThuongGap: [{ gt: 190, giaiThich: '$190^\\circ$ là tổng của **hai** góc $B$ và $D$. Còn phải chia đôi.' }] },
      { id: '10.8', hinhGiai: hg(vong([60, 90, 90, 120], { phan: [2, 3, 3, 4], nhan: ['2x', '3x', '3x', { dau: '4x', giai: '120°' }] })), muc: 2, de: 'Bốn góc $A$, $B$, $C$, $D$ của một tứ giác tỉ lệ với $2 : 3 : 3 : 4$. Tính góc lớn nhất của tứ giác (độ).',
        dapAn: { kieu: 'so', gt: 120 },
        goiY: ['Đặt các góc là $2x$, $3x$, $3x$, $4x$.', '$2x + 3x + 3x + 4x = 12x = 360^\\circ$.'],
        loiGiai: ['$2x + 3x + 3x + 4x = 360^\\circ$, tức $12x = 360^\\circ$, $x = 30^\\circ$', 'Góc lớn nhất: $4x = 4 \\cdot 30^\\circ = 120^\\circ$'],
        loiThuongGap: [{ gt: 30, giaiThich: '$30^\\circ$ mới là $x$. Góc lớn nhất ứng với phần $4$: $4x$.' }, { gt: 90, giaiThich: 'Em chia $360^\\circ$ cho $4$ (số góc). Phải chia cho tổng số phần $2 + 3 + 3 + 4 = 12$.' }] },
      { id: '10.9', hinhGiai: hg(vong([100, 100, 100, 60])), muc: 3, de: 'Một tứ giác có **nhiều nhất** bao nhiêu góc tù?',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Góc tù lớn hơn $90^\\circ$. Nếu cả bốn góc đều tù thì tổng sẽ thế nào so với $360^\\circ$?', 'Thử tìm một tứ giác có ba góc tù, ví dụ $100^\\circ, 100^\\circ, 100^\\circ$ và góc thứ tư?'],
        loiGiai: ['Nếu cả bốn góc đều tù thì tổng lớn hơn $4 \\cdot 90^\\circ = 360^\\circ$: vô lí. Vậy không thể có $4$ góc tù.', 'Tứ giác có các góc $100^\\circ, 100^\\circ, 100^\\circ, 60^\\circ$ (tổng $360^\\circ$) có ba góc tù.', 'Vậy: $\\text{số góc tù nhiều nhất} = 3$'],
        loiThuongGap: [{ gt: 2, giaiThich: 'Vẫn có tứ giác có **ba** góc tù, ví dụ $100^\\circ, 100^\\circ, 100^\\circ, 60^\\circ$.' }, { gt: 4, giaiThich: 'Bốn góc tù thì tổng lớn hơn $360^\\circ$, không thể có.' }] },
      { id: '10.10', khongHinh: 'Đề không cho hình; lời giải tính trong tam giác $ICD$, em tự vẽ tứ giác và hai tia phân giác để theo dõi.', muc: 3, de: 'Tứ giác $ABCD$ có $\\widehat{A} = 70^\\circ$, $\\widehat{B} = 80^\\circ$. Tia phân giác của góc $C$ và góc $D$ cắt nhau tại $I$. Tính góc $CID$ (độ).',
        dapAn: { kieu: 'so', gt: 75 },
        goiY: ['Tính $\\widehat{C} + \\widehat{D}$ trước.', 'Trong tam giác $ICD$: $\\widehat{ICD} + \\widehat{IDC} = \\frac{\\widehat{C} + \\widehat{D}}{2}$, rồi dùng tổng ba góc tam giác.'],
        loiGiai: ['$\\widehat{C} + \\widehat{D} = 360^\\circ - (70^\\circ + 80^\\circ) = 210^\\circ$', 'Vì $CI$, $DI$ là phân giác: $\\widehat{ICD} + \\widehat{IDC} = \\frac{210^\\circ}{2} = 105^\\circ$', 'Trong tam giác $ICD$: $\\widehat{CID} = 180^\\circ - 105^\\circ = 75^\\circ$'],
        loiThuongGap: [{ gt: 105, giaiThich: '$105^\\circ$ là tổng hai góc $\\widehat{ICD} + \\widehat{IDC}$. Góc $CID$ bằng $180^\\circ$ trừ đi tổng đó.' }] },
      { id: '10.11', khongHinh: 'Câu chọn khẳng định đúng; lời giải thử từng khẳng định bằng số đo cụ thể.', muc: 2, de: 'Khẳng định nào dưới đây là **đúng**?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Tứ giác nào cũng có ít nhất một góc tù', 'Nếu tứ giác có ba góc nhọn thì góc còn lại là góc tù', 'Nếu tứ giác có hai góc tù thì hai góc còn lại phải là góc nhọn', 'Không có tứ giác nào có ba góc tù'] },
        goiY: ['Thử từng khẳng định với các ví dụ cụ thể: hình chữ nhật, tứ giác có góc $100^\\circ, 100^\\circ, 90^\\circ, 70^\\circ$…', 'Ba góc nhọn có tổng nhỏ hơn $3 \\cdot 90^\\circ = 270^\\circ$. Góc còn lại lớn hơn bao nhiêu?'],
        loiGiai: ['Ba góc nhọn có tổng nhỏ hơn $270^\\circ$, nên góc còn lại lớn hơn $360^\\circ - 270^\\circ = 90^\\circ$: là góc tù. Khẳng định thứ hai **đúng**.', 'Các khẳng định khác sai: hình chữ nhật không có góc tù; tứ giác $100^\\circ, 100^\\circ, 90^\\circ, 70^\\circ$ có một góc vuông; tứ giác $100^\\circ, 100^\\circ, 100^\\circ, 60^\\circ$ có ba góc tù.'] }
    ],
    timLoi: [
      { de: 'Tứ giác $ABCD$ có $\\widehat{A} = 90^\\circ$, $\\widehat{C} = 100^\\circ$, góc **ngoài** tại đỉnh $B$ bằng $70^\\circ$. Bạn Minh tính $\\widehat{D}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Góc $B$ của tứ giác là $\\widehat{B} = 70^\\circ$.', '$\\widehat{D} = 360^\\circ - (90^\\circ + 70^\\circ + 100^\\circ)$', '$\\widehat{D} = 100^\\circ$'],
        dongSai: 0,
        giaiThich: '$70^\\circ$ là góc **ngoài** tại $B$. Góc trong của tứ giác tại $B$ kề bù với nó: $\\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$.',
        sua: '$\\widehat{B} = 110^\\circ$, nên $\\widehat{D} = 360^\\circ - (90^\\circ + 110^\\circ + 100^\\circ) = 60^\\circ$.' },
      { de: 'Tứ giác $ABCD$ có $\\widehat{A} : \\widehat{B} : \\widehat{C} : \\widehat{D} = 1 : 2 : 3 : 4$. Bạn Hoa tính góc $A$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Đặt $\\widehat{A} = x$ thì $\\widehat{B} = 2x$, $\\widehat{C} = 3x$, $\\widehat{D} = 4x$.', 'Tứ giác có $4$ góc nên $x = 360^\\circ : 4 = 90^\\circ$.', 'Vậy $\\widehat{A} = 90^\\circ$.'],
        dongSai: 1,
        giaiThich: 'Không được chia cho số góc. Phải cộng cả bốn góc: $x + 2x + 3x + 4x = 10x = 360^\\circ$.',
        sua: '$10x = 360^\\circ$ nên $x = 36^\\circ$, tức $\\widehat{A} = 36^\\circ$.' }
    ]
  });
})();
