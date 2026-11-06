// Bài 37 – Hình đồng dạng (SGK Toán 8 KNTT, Tập 2, tr. 104–107)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5', XAM = '#adb5bd';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var geo = TOAN8.hinhGeo;
  function rad(d) { return d * Math.PI / 180; }
  function tia(goc, t) { return [t * Math.cos(rad(goc)), t * Math.sin(rad(goc))]; }
  // Hình phối cảnh của đoạn AB, tâm O, tỉ số k: OA, OB đo theo hai tia lệch góc.
  function phoiCanh(OA, OB, k, nhan, ghiChu, gA, gB) {
    gA = gA == null ? 14 : gA; gB = gB == null ? -12 : gB;
    var A = tia(gA, OA), B = tia(gB, OB), A1 = tia(gA, k * OA), B1 = tia(gB, k * OB);
    var xa = Math.max(1, k) * 1.08;
    return geo({ diem: { O: [0, 0], A: A, B: B, "A'": A1, "B'": B1 },
      ve: [[[0, 0], tia(gA, xa * OA), { mau: XAM, net: 2 }], [[0, 0], tia(gB, xa * OB), { mau: XAM, net: 2 }]],
      canh: [['A', 'B', { mau: XANH, day: 4 }], ["A'", "B'", { mau: TIM, day: 4 }]], nhan: nhan,
      lechTen: { O: [-14, 0] }, ghiChu: ghiChu });
  }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function anh(board, O, P, k, ten) {
    return board.create('point', [function () { return O.X() + k.Value() * (P.X() - O.X()); }, function () { return O.Y() + k.Value() * (P.Y() - O.Y()); }],
      { name: ten, size: 3, color: TIM, fixed: true, showInfobox: false, label: { fontSize: 17, offset: [6, 8], cssStyle: 'font-weight:700', strokeColor: TIM } });
  }
  function tiaNet(board, O, P, Q) {
    // vẽ nét đứt từ O tới điểm xa hơn trong hai điểm P, Q
    board.create('segment', [O, function () { return O.Dist(P) > O.Dist(Q) ? [P.X(), P.Y()] : [Q.X(), Q.Y()]; }],
      { strokeColor: '#e8590c', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false });
  }

  // Ngôi nhà ABCDE và hình phối cảnh của nó qua tâm O, tỉ số k.
  var khamPhaBuild = function (board, G) {
    var O = G.pt('O', 10, 2);
    var P = [G.pt('A', 5, 1), G.pt('B', 7, 1), G.pt('C', 7, 2.5), G.pt('D', 6, 3.5), G.pt('E', 5, 2.5)];
    var k = board.create('slider', [[-3.4, -1.6], [1.6, -1.6], [0.3, 1.8, 2.5]], { name: 'k', snapWidth: 0.1, digits: 1, label: { fontSize: 18, strokeColor: TIM } });
    var ten = ["A'", "B'", "C'", "D'", "E'"];
    var Q = P.map(function (p, i) { return anh(board, O, p, k, ten[i]); });
    P.forEach(function (p, i) { tiaNet(board, O, p, Q[i]); });
    G.poly(P, { fillColor: XANH, fillOpacity: 0.2 });
    G.poly(Q, { fillColor: TIM, fillOpacity: 0.15, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    G.label(11, 7.4, function () { return "OA' : OA = " + fmt(O.Dist(Q[0]) / O.Dist(P[0])); });
    G.label(11, 6.6, function () { return "A'B' : AB = " + fmt(Q[0].Dist(Q[1]) / P[0].Dist(P[1])); });
    G.label(11, 5.8, function () { return "C'D' : CD = " + fmt(Q[2].Dist(Q[3]) / P[2].Dist(P[3])); });
    G.label(11, 4.8, function () { var v = k.Value(); return v > 1.001 ? 'k > 1: phóng to' : (v < 0.999 ? 'k < 1: thu nhỏ' : 'k = 1: trùng nhau'); }, { strokeColor: TIM });
  };
  var khamPhaCfg = { bbox: [-4, 8, 15.5, -2.4], wide: true, build: khamPhaBuild,
    tuChay: [{ thanhTruot: 'k', den: 0.5, giay: 2.5 }, { cho: 1.2 }, { thanhTruot: 'k', den: 2.2, giay: 3 }, { cho: 1.2 }, { thanhTruot: 'k', den: 1.8, giay: 1 },
      { diem: 'O', den: [12, 3], giay: 2 }, { cho: 1.2 }, { diem: 'O', den: [10, 2], giay: 2 }] };

  // Tam giác ABC, trung điểm M của AB và hình phối cảnh (HĐ1).
  var tamGiacBuild = function (board, G) {
    var O = G.pt('O', 11, 2.5);
    var A = G.pt('A', 2, 6), B = G.pt('B', 0, 2.5), C = G.pt('C', 4.5, 0);
    var k = board.create('slider', [[0, -1.2], [4.5, -1.2], [0.2, 0.5, 0.9]], { name: 'k', snapWidth: 0.1, digits: 1, label: { fontSize: 18, strokeColor: TIM } });
    var M = G.mid(A, B, 'M');
    var A1 = anh(board, O, A, k, "A'"), B1 = anh(board, O, B, k, "B'"), C1 = anh(board, O, C, k, "C'"), M1 = anh(board, O, M, k, "M'");
    [A, B, C, M].forEach(function (p) { board.create('segment', [O, p], { strokeColor: '#e8590c', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false }); });
    G.poly([A, B, C], { fillColor: XANH, fillOpacity: 0.15 });
    G.poly([A1, B1, C1], { fillColor: TIM, fillOpacity: 0.15, borders: { strokeWidth: 3, strokeColor: TIM, fixed: true } });
    G.label(6.5, 7.4, function () { return "A'B' : AB = " + fmt(A1.Dist(B1) / A.Dist(B)); });
    G.label(6.5, 6.6, function () { return "A'M' : M'B' = " + fmt(A1.Dist(M1) / M1.Dist(B1)); });
  };

  // ---------- Hình tĩnh cho bài tập ----------
  var h3 = phoiCanh(2, 1.6, 3, [['O', 'A', '2', false, 1.2]], "Tỉ số k = 3; tìm OA'");
  // OA = 5, AB = 7,5: hai tia vuông góc nên OB = √(7,5² − 5²) ≈ 5,59 (hình đúng tỉ lệ).
  var h5 = phoiCanh(5, Math.sqrt(7.5 * 7.5 - 25), 0.4, [['O', "A'", '2', false, 1.2], ["A'", "B'", '3', true, 1.2, TIM]], 'A, B ở xa O; A\', B\' ở gần O', 40, -50);

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  function an(s, anChu) { return { s: s, an: true, anChu: anChu }; }
  function luoi(chuNhat, k, nhan, them) { return Object.assign({ ten: 'luoiO', tuyChon: { chuNhat: chuNhat, k: k, nhan: nhan } }, them || {}); }
  // Tấm thảm chữ L ghép từ 3 ô vuông cạnh 1 m, phóng to 3 lần
  var thamL = { ten: 'luoiO', moTa: 'Tấm thảm chữ L ghép từ 3 ô vuông cạnh 1 mét, và tấm thảm mới mỗi cạnh dài gấp 3 lần.',
    tuyChon: { k: 3, nhan: { cu: '3 m²', moi: an('27 m²', '? m²') } } };
  // Phối cảnh tâm O: đoạn AB, OA = 3 (tia 15°), AB = 2, tỉ số 2,5
  var PA = [3 * Math.cos(rad(15)), 3 * Math.sin(rad(15))], PB = [PA[0] + 2 * Math.cos(rad(105)), PA[1] + 2 * Math.sin(rad(105))];
  var phoiCanhAB = { ten: 'trungKhit', moTa: 'Đoạn AB và hình phối cảnh A phẩy B phẩy của nó, tâm O, tỉ số 2,5.',
    tuyChon: { hinh: [{ diem: [PA, PB], kin: false, ten: ['A', 'B'], canh: ['2'], mau: '--b', day: 3 }],
      them: [{ k: 'chu', p: [-0.5, -0.4], s: 'O', nghieng: true }, { k: 'chu', p: [1.5, -0.25], s: '3' },
        { k: 'chu', p: [2.5 * PA[0] + 0.5, 2.5 * PA[1] - 0.4], s: "A'", nghieng: true, mau: '--a', hien: [0.9, 1] },
        { k: 'chu', p: [2.5 * PB[0], 2.5 * PB[1] + 0.5], s: "B'", nghieng: true, mau: '--a', hien: [0.9, 1] },
        { k: 'chu', p: [2.5 * (PA[0] + PB[0]) / 2 + 0.7, 2.5 * (PA[1] + PB[1]) / 2], s: an('5', '?'), mau: '--a', hien: [0.9, 1] }],
      di: [{ tu: 0, tam: [0, 0], k: 2.5, tia: true, mau: '--a' }], loiCuoi: [{ s: "OA' : OA = 7,5 : 3 = 2,5", hien: [0.9, 1] }] } };
  // 37.11: đèn O, tấm bìa cách 30 cm, tường cách 90 cm (hình nhìn ngang, không theo tỉ lệ)
  var bongDen = { ten: 'trungKhit', ghiChu: 'Nhìn ngang, không theo tỉ lệ.', moTa: 'Bóng đèn O, tấm bìa cách đèn 30 xăng-ti-mét, tường cách đèn 90 xăng-ti-mét.',
    tuyChon: { hinh: [{ diem: [[3, -2], [3, 2]], kin: false, canh: ['4'], mau: '--b', day: 4 }],
      them: [{ k: 'doan', a: [9, -7], b: [9, 7], mau: '--nhat', day: 5 }, { k: 'chu', p: [-0.6, 0], s: 'O', nghieng: true },
        { k: 'chu', p: [1.5, -2.6], s: '30 cm' }, { k: 'chu', p: [6, -7.6], s: '90 cm' }, { k: 'chu', p: [10, 0], s: an('12', '?'), mau: '--a', hien: [0.9, 1] }],
      di: [{ tu: 0, tam: [0, 0], k: 3, tia: true, mau: '--a' }] } };

  TOAN8.bai({
    id: 37, ten: 'Hình đồng dạng', sgk: { tap: 2, trang: 104 },
    nhin: {
      tieuDe: 'Cạnh gấp k lần, diện tích gấp k · k lần', loai: 'chungMinh',
      luuY: 'Đếm ô nhỏ chỉ làm được khi $k$ là số nguyên. Với $k$ bất kì, mỗi ô vuông cạnh $1$ vẫn thành hình vuông cạnh $k$, diện tích $k \\cdot k$, nên hình ghép từ $n$ ô có diện tích $n \\cdot k^2$. Với tam giác cũng vậy: đáy và chiều cao cùng nhân $k$, nên diện tích $\\frac{1}{2} \\cdot \\text{đáy} \\cdot \\text{cao}$ nhân $k \\cdot k$.',
      canh: { ten: 'luoiO', moTa: 'Hình chữ L ghép từ 3 ô vuông cạnh 1, và hình phóng to k lần. Mỗi ô vuông cạnh k chia thành k nhân k ô nhỏ.',
        thuPha: true,
        tuyChon: { chiTiet: true, nhan: { cu: '3 ô', moi: function (k, d) { return String(3 * k * (d || k)).replace('.', ',') + ' ô'; } } },
        dongSo: function (p) {
          var d = p.k + (p.them || 0) >= 1 ? p.k + (p.them || 0) : 0.5, s = function (x) { return String(x).replace('.', '{,}'); };
          if (d !== p.k) return 'Ngang nhân $' + p.k + '$, dọc nhân $' + s(d) + '$: diện tích $3$ thành $3 \\cdot ' + p.k + ' \\cdot ' + s(d) + ' = ' + s(3 * p.k * d) + '$. Hình bị kéo dãn, không còn đồng dạng.';
          return '$k = ' + p.k + '$: $3$ ô thành $3 \\cdot ' + p.k + '^2 = ' + 3 * p.k * p.k + '$ ô. Diện tích gấp $' + p.k * p.k + '$ lần.';
        } },
      buoc: [
        { t: 0, chu: 'Hình xanh ghép từ $3$ ô vuông cạnh $1$.' },
        { t: 0.1, chu: 'Phóng to $k$ lần: mọi cạnh nhân $k$, nên mỗi ô vuông cạnh $1$ thành ô vuông cạnh $k$.' },
        { t: 0.5, chu: 'Mỗi ô vuông cạnh $k$ chia được thành $k \\cdot k$ ô nhỏ cạnh $1$. Hai màu xen kẽ là các ô cũ.' },
        { t: 0.85, chu: 'Hình mới có $3 \\cdot k^2$ ô nhỏ: diện tích gấp $k^2$ lần, không phải $k$ lần.' }
      ],
      ketLuan: 'Hai hình đồng dạng theo tỉ số $k$: mọi độ dài nhân $k$, còn diện tích nhân $k^2$: $$\\frac{S\'}{S} = k^2$$',
      dung: {
        tieuDe: 'Tấm thảm mới rộng bao nhiêu?', tuBai: '37.9', canh: thamL,
        de: 'Một tấm thảm hình chữ L ghép từ $3$ ô vuông cạnh $1$ m. Người ta làm một tấm thảm mới đồng dạng với nó, mỗi cạnh dài gấp $3$ lần. Tấm thảm mới có diện tích bao nhiêu m²? *(Đề mới, cùng khuôn với bài 37.9.)*',
        dapAn: { kieu: 'so', gt: 27 },
        goiY: ['Mỗi ô vuông cạnh $1$ m thành ô vuông cạnh $3$ m.', 'Ô vuông cạnh $3$ m có diện tích $3 \\cdot 3 = 9$ m². Có $3$ ô như vậy.'],
        loiGiai: ['Tấm thảm cũ có diện tích $3$ m², tỉ số đồng dạng $k = 3$.', 'Diện tích mới $= 3 \\cdot 3^2 = 27$'],
        loiThuongGap: [{ gt: 9, giaiThich: 'Em chỉ nhân với $k = 3$. Cả chiều dài lẫn chiều rộng đều nhân $3$, nên diện tích nhân $3 \\cdot 3 = 9$.' }],
        moiThu: 'Gõ thử diện tích. Hình sẽ tô đỏ đúng chừng ấy ô vuông $1$ m² trên tấm thảm mới, để em xem có phủ vừa kín không.',
        phanUng: [{ gt: 9, thamSo: { thu: 9 }, t: 1, loi: 'Em mới nhân $3$ một lần. $9$ ô đỏ chỉ phủ một phần ba tấm thảm: **mỗi** ô cũ đã thành $3 \\cdot 3 = 9$ ô mới, mà có $3$ ô cũ.' }],
        soBatKi: function (v) {
          if (v <= 0) return { t: 0, loi: 'Diện tích phải lớn hơn $0$.' };
          var so = String(Math.round(v * 1000) / 1000).replace('.', '{,}');
          return { thamSo: { thu: v }, t: 1, loi: v < 27 ? '$' + so + '$ ô vuông $1$ m² (tô đỏ) chưa phủ kín tấm thảm mới. Đếm xem mỗi ô cũ thành mấy ô mới.' : '$' + so + '$ ô vuông $1$ m² nhiều hơn số ô của tấm thảm mới: tô kín rồi vẫn còn thừa.' };
        },
        dungChu: 'Mỗi ô cũ thành $3 \\cdot 3 = 9$ ô mới; $3$ ô cũ thành $27$ ô: $27$ m².', saiChu: 'Đếm trên hình: một ô cũ thành mấy ô vuông $1$ m²?'
      },
      suyRa: {
        tieuDe: 'Hỏi diện tích thì nhân hai lần',
        baDe: [
          { tuBai: '37.9', canh: { ten: 'luoiO', tuyChon: { o: [[0, 0]], k: 4, nhan: { rong: '1', rongMoi: '500', cu: '1 cm²', moi: '500² cm²' } }, ghiChu: 'Hình không theo tỉ lệ: thật ra mỗi cạnh gấp 500 lần, mỗi ô thành 500 · 500 ô.' }, tenNut: 'Phóng to',
            phanUng: [{ gt: 14, loi: 'Em chỉ nhân $280$ với $500$ (rồi đổi đơn vị). Mỗi chiều đều gấp $500$ lần, nên diện tích gấp $500 \\cdot 500$ lần.' }, { gt: 70000000, loi: 'Đó là diện tích tính bằng cm². Đổi ra m²: chia cho $10\\,000$.' }],
            dungChu: '$280 \\cdot 500^2 = 70\\,000\\,000$ cm² $= 7000$ m².', saiChu: 'Diện tích thật gấp $500 \\cdot 500 = 250\\,000$ lần. Nhớ đổi cm² ra m².' },
          { tuBai: '37.7', canh: luoi([6, 9], 5 / 3, { rong: '6', cao: '9', rongMoi: '10', caoMoi: '15', cu: '54 ô', moi: an('150 ô', '? ô') }), tenNut: 'Phóng to',
            de: 'Một bức ảnh $6$ cm $\\times$ $9$ cm được phóng to thành ảnh $10$ cm $\\times$ $15$ cm. Diện tích ảnh mới gấp mấy lần ảnh cũ? (viết phân số) *(Đề mới, dựa theo bài 37.7.)*',
            dapAn: { kieu: 'so', gt: '25/9' },
            goiY: ['Tỉ số phóng to $k = \\frac{10}{6} = \\frac{5}{3}$.', 'Diện tích gấp $k^2$ lần.'],
            loiGiai: ['$k = \\frac{10}{6} = \\frac{5}{3}$.', 'Diện tích gấp $k^2 = \\frac{25}{9}$ lần (đếm ô: $\\frac{150}{54} = \\frac{25}{9}$)', '$\\frac{25}{9}$'],
            loiThuongGap: [{ gt: '5/3', giaiThich: '$\\frac{5}{3}$ là tỉ số các cạnh. Diện tích gấp $\\left(\\frac{5}{3}\\right)^2$ lần.' }],
            phanUng: [{ gt: '5/3', loi: '$\\frac{5}{3}$ là tỉ số các cạnh. Ảnh cũ có $54$ ô; đếm ô ảnh mới rồi chia: diện tích gấp $k \\cdot k$ lần, không phải $k$ lần.' }],
            dungChu: '$\\left(\\frac{5}{3}\\right)^2 = \\frac{25}{9}$; đếm ô cũng thấy $\\frac{150}{54} = \\frac{25}{9}$.', saiChu: 'Đếm ô vuông $1$ cm² trên hai ảnh rồi chia.' },
          { tuBai: '37.4', canh: luoi([3, 5], 2, { rong: '3', cao: '5', rongMoi: '6', caoMoi: '10', cu: '15 cm²', moi: an('60 cm²', '? cm²') }), tenNut: 'Phóng to',
            de: 'Phóng to một hình chữ nhật $3$ cm $\\times$ $5$ cm theo tỉ số $2$. Diện tích hình mới là bao nhiêu cm²? *(Đề mới, dựa theo bài 37.4.)*',
            dapAn: { kieu: 'so', gt: 60 },
            goiY: ['Hình mới có kích thước $6$ cm $\\times$ $10$ cm.', 'Hoặc: diện tích cũ $15$ cm² nhân $k^2 = 4$.'],
            loiGiai: ['Diện tích cũ $3 \\cdot 5 = 15$ (cm²), tỉ số $k = 2$.', 'Diện tích mới $= 15 \\cdot 2^2 = 60$'],
            loiThuongGap: [{ gt: 30, giaiThich: 'Em chỉ nhân với $2$. Hai chiều đều nhân $2$, nên diện tích nhân $4$.' }],
            phanUng: [{ gt: 30, loi: 'Em chỉ nhân với $2$. Trên hình, mỗi ô cũ thành $2 \\cdot 2 = 4$ ô mới.' }],
            dungChu: '$15 \\cdot 2^2 = 60$ cm², cũng bằng $6 \\cdot 10$.', saiChu: 'Mỗi ô vuông cũ thành mấy ô vuông mới?' }
        ],
        cachNhan: 'Đề hỏi **diện tích** của hình phóng to, thu nhỏ: nhân tỉ số hai lần ($k^2$), vì chiều dài và chiều rộng đều nhân $k$. Còn độ dài, chu vi thì chỉ nhân $k$.'
      }
    },
    khamPha: {
      nhiemVu: "Ngôi nhà xanh $ABCDE$ có một **hình phối cảnh** màu tím: mỗi điểm $A'$ nằm trên tia $OA$ với $OA' = k \\cdot OA$.\n\nKéo thanh trượt **k**, kéo **tâm $O$** hoặc các đỉnh của ngôi nhà. Em thấy hình tím có **hình dạng** thế nào so với hình xanh? Các tỉ số bên phải ra sao?",
      widget: 'geo',
      config: khamPhaCfg,
      cauHoi: {
        de: "Đặt $k = 0{,}5$. Khi đó tỉ số $\\frac{A'B'}{AB}$ bằng bao nhiêu?",
        dapAn: { kieu: 'so', gt: 0.5 },
        goiY: ['Kéo thanh trượt về $0{,}5$ rồi đọc dòng $A\'B\' : AB$.', 'Mọi đoạn thẳng của hình tím đều bằng $k$ lần đoạn tương ứng của hình xanh.'],
        loiGiai: ['Hình tím là ngôi nhà **thu nhỏ** (khi $k < 1$) hoặc **phóng to** (khi $k > 1$), hình dạng giữ nguyên.', "Mọi tỉ số đều bằng $k$: $\\frac{A'B'}{AB} = 0{,}5$"],
        loiThuongGap: [{ gt: 2, giaiThich: '$2$ là tỉ số $\\frac{AB}{A\'B\'}$. Hình tím nhỏ hơn nên $\\frac{A\'B\'}{AB} < 1$.' }] }
    },
    mucTieu: [
      'Nói được vì sao phóng to $k$ lần thì diện tích gấp $k^2$ lần, bằng cách đếm ô vuông trên hình.',
      'Nhận ra hai hình đồng dạng phối cảnh, chỉ ra tâm $O$ và tỉ số $k = \\frac{OA\'}{OA}$.',
      'Nhận ra cặp hình luôn đồng dạng (hai hình vuông, hai tam giác đều…) và cặp hình chưa chắc đồng dạng (hai hình chữ nhật…).',
      'Tính độ dài, chu vi (nhân $k$) và diện tích (nhân $k^2$) của hình đồng dạng, kể cả khi đổi đơn vị.'
    ],
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình đồng dạng phối cảnh',
        noiDung: "Cho điểm $O$ và số $k > 0$. Lấy mỗi điểm $A$ của hình $\\mathcal{H}$, đặt điểm $A'$ trên tia $OA$ sao cho $OA' = k \\cdot OA$. Các điểm $A'$ tạo thành hình $\\mathcal{H}'$.\n\nHình $\\mathcal{H}'$ gọi là **đồng dạng phối cảnh** với hình $\\mathcal{H}$; điểm $O$ là **tâm phối cảnh**, $k = \\frac{OA'}{OA}$ là **tỉ số đồng dạng**.\n\n• $k > 1$: $\\mathcal{H}'$ là hình **phóng to** của $\\mathcal{H}$. • $k < 1$: $\\mathcal{H}'$ là hình **thu nhỏ** của $\\mathcal{H}$.\n\nĐường thẳng nối hai điểm tương ứng **bất kì** ($AA'$, $MM'$, …) đều đi qua tâm $O$." },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8, 13, -2], wide: true, build: tamGiacBuild,
        tuChay: [{ thanhTruot: 'k', den: 0.9, giay: 2 }, { cho: 1.2 }, { thanhTruot: 'k', den: 0.2, giay: 3 }, { cho: 1.2 }, { thanhTruot: 'k', den: 0.5, giay: 1.5 },
          { diem: 'O', den: [12, 5], giay: 2 }, { cho: 1.2 }, { diem: 'O', den: [11, 2.5], giay: 2 }] },
        chuThich: "Tam giác $A'B'C'$ là hình thu nhỏ của tam giác $ABC$ với tâm $O$. Trung điểm $M$ của $AB$ biến thành trung điểm $M'$ của $A'B'$ ($A'M' : M'B' = 1$), và đường thẳng $MM'$ cũng đi qua $O$. Ta có $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $k$." },
      { loai: 'dinhNghia', tieuDe: 'Hình đồng dạng',
        noiDung: "Hình $\\mathcal{H}'$ gọi là **đồng dạng** với hình $\\mathcal{H}$ nếu nó **bằng** $\\mathcal{H}$ hoặc bằng **một hình phóng to hay thu nhỏ** của $\\mathcal{H}$.\n\nNói gọn: hai hình đồng dạng có **hình dạng giống nhau**, chỉ có thể khác về kích thước và vị trí (bị dời chỗ, xoay, lật)." },
      { loai: 'chuY', noiDung: '**Những cặp hình luôn đồng dạng:** hai hình vuông bất kì; hai hình tròn bất kì; hai tam giác đều bất kì; hai lục giác đều bất kì.\n\n**Không chắc đồng dạng:** hai hình chữ nhật (phải có tỉ lệ dài : rộng bằng nhau), hai hình thoi, hai tam giác cân…\n\nVí dụ: hình chữ nhật $2 \\times 3$ và $4 \\times 6$ đồng dạng ($\\frac{4}{2} = \\frac{6}{3}$); còn $3 \\times 4$ và $4 \\times 5$ thì không.' },
      { loai: 'chuY', noiDung: '**Chu vi và diện tích.** Hai hình đồng dạng theo tỉ số $k$ thì:\n\n• mọi độ dài (cạnh, chu vi, đường chéo…) tỉ lệ $k$;\n\n• **diện tích** tỉ lệ $k^2$.\n\nPhóng to bức ảnh lên $2$ lần (mỗi chiều) thì diện tích gấp $4$ lần.' },
      { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao diện tích gấp $k^2$ lần?', config: {
        de: 'Xếp các bước theo đúng thứ tự lập luận. Bước nào chưa đủ căn cứ, máy sẽ nói thiếu gì.',
        canh: { ten: 'luoiO' },
        buoc: [
          { id: 'gt', chu: 'Hình $\\mathcal{H}$ ghép từ $n$ ô vuông cạnh $1$, diện tích $n$. Hình $\\mathcal{H}\'$ đồng dạng với nó theo tỉ số $k$.', canh: { t: 0 } },
          { id: 'canh', chu: 'Mọi độ dài nhân $k$, nên mỗi ô biến thành một hình có bốn cạnh dài $k$.', can: ['gt'], canh: { t: 0.5 } },
          { id: 'goc', chu: 'Hai hình đồng dạng có các góc tương ứng bằng nhau, nên bốn góc của hình ấy vẫn vuông.', can: ['gt'], canh: { t: 0.5 } },
          { id: 'hv', chu: 'Mỗi ô thành một hình vuông cạnh $k$, diện tích $k \\cdot k = k^2$.', can: ['canh', 'goc'], canh: { t: 0.6 } },
          { id: 'ghep', chu: 'Các ô cũ ghép khít, không chồng lên nhau, nên các ô mới cũng ghép khít thành $\\mathcal{H}\'$.', can: ['gt'], canh: { t: 0.5 } },
          { id: 'tong', chu: 'Diện tích $\\mathcal{H}\'$ bằng $n \\cdot k^2$.', can: ['hv', 'ghep'], canh: { t: 0.9 } },
          { id: 'kl', chu: 'Tỉ số diện tích: $\\frac{S\'}{S} = \\frac{n \\cdot k^2}{n} = k^2$.', can: ['tong'], canh: { t: 1 } }
        ],
        ketLuan: 'Với hình ghép từ các ô vuông: hình đồng dạng với nó theo tỉ số $k$ có diện tích gấp $k^2$ lần, không phải $k$ lần.'
      } },
      { loai: 'chuY', noiDung: "**Hay nhầm 1 – đồng dạng ≠ đồng dạng phối cảnh.** Hai tam giác đều luôn đồng dạng, nhưng nếu một hình bị **xoay** thì các đường nối điểm tương ứng không đồng quy, nên chúng **không** phối cảnh.\n\n**Hay nhầm 2 – tỉ số ngược.** $k = \\frac{OA'}{OA}$: khoảng cách tới điểm của hình **mới** ở trên tử số." }
    ],
    viDu: [
      { de: 'Phóng to tam giác có ba cạnh $3$ cm, $4$ cm, $5$ cm theo tỉ số $2$. Tính ba cạnh của hình mới.',
        canh: { ten: 'trungKhit', tuyChon: { hinh: [{ dai: [3, 5, 4], ten: ['A', 'B', 'C'], canh: ['3', '5', '4'], mau: '--b' }], di: [{ tu: 0, tam: [0, 0], k: 2, mau: '--a' }],
          loiCuoi: [{ s: 'Ba cạnh mới: 6, 10, 8', an: true, anChu: 'Ba cạnh mới: ?, ?, ?', hien: [0.9, 1] }] } }, buoc: [
        { lam: 'Mọi độ dài của hình mới gấp $2$ lần độ dài tương ứng.', vi: 'Hình phóng to theo tỉ số $k$ thì mọi đoạn thẳng nhân với $k$.' },
        { lam: 'Ba cạnh mới: $6$ cm, $8$ cm, $10$ cm.', vi: '$3 \\cdot 2$, $4 \\cdot 2$, $5 \\cdot 2$. Hai tam giác đồng dạng theo tỉ số $2$.' } ] },
      { de: "Hình $\\mathcal{H}'$ đồng dạng phối cảnh với $\\mathcal{H}$, tâm $O$. Điểm $A$ của $\\mathcal{H}$ có $OA = 3$ cm, điểm tương ứng $A'$ có $OA' = 7{,}5$ cm. Đoạn $AB = 2$ cm của $\\mathcal{H}$ ứng với đoạn $A'B'$ dài bao nhiêu?", canh: phoiCanhAB, buoc: [
        { lam: "$k = \\frac{OA'}{OA} = \\frac{7{,}5}{3} = 2{,}5$.", vi: 'Tỉ số đồng dạng phối cảnh đo bằng khoảng cách tới tâm $O$.' },
        { lam: "$A'B' = k \\cdot AB = 2{,}5 \\cdot 2 = 5$ (cm).", vi: 'Mọi đoạn thẳng của hình mới bằng $k$ lần đoạn tương ứng.' } ] },
      { de: 'Hình chữ nhật $2 \\times 3$ có đồng dạng với hình chữ nhật $4 \\times 6$ không? Còn hình chữ nhật $3 \\times 4$ và $4 \\times 5$?', canh: luoi([2, 3], 2, { rong: '2', cao: '3', rongMoi: '4', caoMoi: '6' }), buoc: [
        { lam: '$\\frac{4}{2} = 2$ và $\\frac{6}{3} = 2$: hai hình chữ nhật đầu đồng dạng, tỉ số $2$.', vi: 'Chiều rộng ghép chiều rộng, chiều dài ghép chiều dài; góc đều là góc vuông.' },
        { lam: '$\\frac{4}{3} \\ne \\frac{5}{4}$: hai hình sau **không** đồng dạng.', vi: 'Tỉ lệ khác nhau thì hình dạng khác nhau (một hình "dẹt" hơn).' } ] },
      { de: 'Một bức ảnh $10 \\times 15$ cm được phóng to thành $20 \\times 30$ cm. Diện tích gấp mấy lần?', canh: luoi([2, 3], 2, { rong: '10', cao: '15', rongMoi: '20', caoMoi: '30', cu: '6 ô', moi: an('24 ô') }, { ghiChu: 'Mỗi ô là hình vuông 5 cm × 5 cm.' }), buoc: [
        { lam: 'Tỉ số đồng dạng $k = \\frac{20}{10} = \\frac{30}{15} = 2$.', vi: 'Mỗi chiều gấp $2$.' },
        { lam: 'Diện tích: $150$ cm² $\\to 600$ cm², gấp $4 = 2^2$ lần.', vi: 'Diện tích tỉ lệ với $k^2$ vì cả chiều dài lẫn chiều rộng đều gấp $2$.' } ] }
    ],
    viDuMo: [
      { de: "Hình $\\mathcal{H}'$ là hình thu nhỏ của $\\mathcal{H}$ với tâm phối cảnh $O$, tỉ số $k = \\frac{1}{2}$. Điểm $A$ có $OA = 4$ cm. Tính $OA'$.", buoc: [
        { lam: "$OA' = k \\cdot OA$", vi: 'Định nghĩa hình đồng dạng phối cảnh.' },
        { lam: "$OA' = \\frac{1}{2} \\cdot 4 = 2$", vi: 'Em hãy tính $OA\'$ (cm):', an: true,
          dapAn: { kieu: 'so', gt: 2 },
          loiThuongGap: [{ gt: 8, giaiThich: 'Em nhân với $2$. Thu nhỏ với $k = \\frac{1}{2}$ thì $OA\'$ chỉ bằng một nửa $OA$.' }] } ] },
      { de: 'Hai hình vuông có cạnh $3$ cm và $5$ cm. Tìm tỉ số diện tích của hình vuông lớn so với hình vuông nhỏ.', buoc: [
        { lam: 'Hai hình vuông luôn đồng dạng, tỉ số $k = \\frac{5}{3}$.', vi: 'Mọi hình vuông có cùng hình dạng.' },
        { lam: 'Tỉ số diện tích $= k^2 = \\frac{25}{9}$', vi: 'Em hãy nhập tỉ số (phân số):', an: true,
          dapAn: { kieu: 'so', gt: '25/9' },
          loiThuongGap: [{ gt: '5/3', giaiThich: '$\\frac{5}{3}$ là tỉ số cạnh. Diện tích tỉ lệ với **bình phương**: $\\frac{25}{9}$.' }] } ] }
    ],
    baiTap: [
      { id: '37.1', khongHinh: 'Câu chọn loại hình: vẽ hình đúng là lộ đáp án.', muc: 1, de: 'Cặp hình nào dưới đây **luôn** đồng dạng?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hai hình vuông bất kì', 'Hai hình chữ nhật bất kì', 'Hai hình thoi bất kì', 'Hai tam giác cân bất kì'] },
        goiY: ['Hai hình đồng dạng phải có cùng hình dạng.', 'Hình nào chỉ cần biết **một** độ dài là xác định cả hình?'],
        loiGiai: ['Hình vuông chỉ phụ thuộc độ dài cạnh nên hai hình vuông bất kì luôn đồng dạng.', 'Hình chữ nhật có thể dài – ngắn khác nhau, hình thoi có thể có góc khác nhau, tam giác cân có thể có góc đỉnh khác nhau.'] },
      { id: '37.2', khongHinh: 'Câu lí thuyết về phối cảnh; phần Lý thuyết đã có hình kéo thử.', muc: 1, de: 'Khẳng định sau đúng hay sai: "Hai tam giác đều bất kì luôn **đồng dạng phối cảnh** với nhau."',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Hai tam giác đều luôn đồng dạng. Nhưng "phối cảnh" đòi hỏi thêm điều gì?', 'Nếu một tam giác bị xoay lệch đi, các đường nối đỉnh tương ứng có đồng quy không?'],
        loiGiai: ['Hai tam giác đều luôn **đồng dạng**, nhưng muốn **phối cảnh** thì các đường nối điểm tương ứng phải đi qua một điểm chung $O$ (cạnh tương ứng song song hoặc cùng nằm trên một đường).', 'Nếu một tam giác bị xoay thì điều đó không xảy ra. Khẳng định **sai**.'] },
      { id: '37.3', muc: 1, de: "Trong hình, $A'B'$ là hình phóng to của $AB$ với tâm phối cảnh $O$, tỉ số $k = 3$. Biết $OA = 2$ cm, tính $OA'$ (cm).",
        hinh: h3,
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ["Theo định nghĩa: $OA' = k \\cdot OA$."],
        loiGiai: ["$OA' = 3 \\cdot 2 = 6$"],
        loiThuongGap: [{ gt: 4, giaiThich: "$4$ cm là đoạn $AA'$. Đề hỏi $OA'$, tính từ tâm $O$: $3 \\cdot 2 = 6$." }] },
      { id: '37.4', hinhGiai: hg(luoi([3, 5], 2, { rong: '3', cao: '5', rongMoi: an('6'), caoMoi: an('10') })), muc: 1, de: 'Phóng to một hình chữ nhật kích thước $3$ cm $\\times$ $5$ cm theo tỉ số $2$. Hình mới có kích thước bao nhiêu?',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Chiều rộng =', kieu: 'so', gt: 6, loiThuongGap: [{ gt: 5, giaiThich: 'Phóng to tỉ số $2$ là **nhân** $2$, không phải cộng $2$.' }] },
          { nhan: 'Chiều dài =', kieu: 'so', gt: 10, loiThuongGap: [{ gt: 7, giaiThich: 'Phóng to tỉ số $2$ là **nhân** $2$, không phải cộng $2$.' }] }] },
        goiY: ['Mọi độ dài của hình phóng to bằng $k$ lần độ dài tương ứng.'],
        loiGiai: ['Chiều rộng: $3 \\cdot 2 = 6$ (cm); chiều dài: $5 \\cdot 2 = 10$ (cm).'] },
      { id: '37.5', muc: 2, de: "Trong hình, $A'B'$ là hình thu nhỏ của $AB$ với tâm $O$. Biết $OA = 5$, $OA' = 2$, $A'B' = 3$. Tính $AB$.",
        hinh: h5,
        dapAn: { kieu: 'so', gt: 7.5 },
        goiY: ["Tỉ số $k = \\frac{OA'}{OA} = \\frac{2}{5}$, và $A'B' = k \\cdot AB$.", 'Vậy $AB = A\'B\' : k$.'],
        loiGiai: ["$k = \\frac{OA'}{OA} = \\frac{2}{5}$.", "$AB = \\frac{A'B'}{k} = 3 : \\frac{2}{5} = 7{,}5$"],
        loiThuongGap: [{ gt: 1.2, giaiThich: '$AB$ thuộc hình **lớn** (xa $O$ hơn) nên phải dài hơn $A\'B\' = 3$. Em đã nhân thay vì chia.' }] },
      { id: '37.6', khongHinh: 'Câu chọn phương án: vẽ hình đúng là lộ đáp án.', muc: 2, de: 'Hình chữ nhật nào dưới đây đồng dạng với hình chữ nhật $4 \\times 6$?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$6 \\times 8$', '$6 \\times 9$', '$5 \\times 7$', '$8 \\times 10$'] },
        goiY: ['Hai hình chữ nhật đồng dạng khi $\\frac{\\text{rộng}}{\\text{rộng}} = \\frac{\\text{dài}}{\\text{dài}}$.', 'Tỉ lệ dài : rộng của $4 \\times 6$ là $1{,}5$. Hình nào cũng có tỉ lệ $1{,}5$?'],
        loiGiai: ['$\\frac{6}{4} = 1{,}5$ và $\\frac{9}{6} = 1{,}5$: hai tỉ số bằng nhau.', 'Vậy hình $6 \\times 9$ đồng dạng với $4 \\times 6$ (tỉ số $1{,}5$). Các hình khác có tỉ lệ dài : rộng khác $1{,}5$.'] },
      { id: '37.7', hinhGiai: hg(luoi([6, 9], 5 / 3, { rong: '6', cao: '9', rongMoi: '10', caoMoi: an('15') })), muc: 2, de: 'Một bức ảnh $6$ cm $\\times$ $9$ cm được phóng to (giữ nguyên hình dạng) sao cho cạnh ngắn dài $10$ cm. Cạnh dài của ảnh mới là bao nhiêu cm?',
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Tỉ số phóng to $k = \\frac{10}{6}$.', 'Cạnh dài mới $= 9 \\cdot k$.'],
        loiGiai: ['$k = \\frac{10}{6} = \\frac{5}{3}$.', 'Cạnh dài mới $= 9 \\cdot \\frac{5}{3} = 15$'],
        loiThuongGap: [{ gt: 13, giaiThich: 'Em cộng thêm $4$ cm như cạnh ngắn. Phóng to là **nhân** cùng một tỉ số, không phải cộng cùng một số.' }] },
      { id: '37.8', hinhGiai: hg({ ten: 'luoiO', tuyChon: { chuNhat: [2, 2], k: 1.5, nhan: { rong: '2', rongMoi: '3' }, loiCuoi: ['Chu vi: 8 → 12 (nhân 1,5)', 'Diện tích: 4 → 9 (nhân 2,25)'] }, ghiChu: 'Ví dụ: hình vuông cạnh 2 phóng 1,5 lần.' }), muc: 2, de: 'Hai hình đồng dạng theo tỉ số $\\frac{3}{2}$ (hình lớn so với hình nhỏ). Chu vi hình nhỏ là $20$ cm. Tính chu vi hình lớn (cm).',
        dapAn: { kieu: 'so', gt: 30 },
        goiY: ['Chu vi là một độ dài nên tỉ lệ theo $k$.'],
        loiGiai: ['Chu vi hình lớn $= \\frac{3}{2} \\cdot 20 = 30$'],
        loiThuongGap: [{ gt: 45, giaiThich: 'Em nhân với $k^2$. Chỉ **diện tích** mới tỉ lệ $k^2$; chu vi tỉ lệ $k$.' }] },
      { id: '37.9', hinhGiai: hg({ ten: 'luoiO', tuyChon: { o: [[0, 0]], k: 4, nhan: { rong: '1', rongMoi: '500' } }, ghiChu: 'Hình không theo tỉ lệ: thật ra mỗi cạnh gấp 500 lần, mỗi ô thành 500 · 500 ô.' }), muc: 3, de: 'Mô hình một sân bóng được làm theo tỉ lệ $1 : 500$ (mọi độ dài thật gấp $500$ lần độ dài trên mô hình). Mặt sân trên mô hình có diện tích $280$ cm². Diện tích sân thật là bao nhiêu m²?',
        dapAn: { kieu: 'so', gt: 7000 },
        goiY: ['Sân thật đồng dạng với mô hình, tỉ số $k = 500$. Diện tích gấp $k^2 = 250\\,000$ lần.', 'Đổi cm² sang m²: $1$ m² $= 10\\,000$ cm².'],
        loiGiai: ['Diện tích thật $= 280 \\cdot 500^2 = 280 \\cdot 250\\,000 = 70\\,000\\,000$ (cm²).', 'Đổi ra m²: $70\\,000\\,000 : 10\\,000 = 7000$'],
        loiThuongGap: [{ gt: 14, giaiThich: 'Em chỉ nhân với $500$. Diện tích tỉ lệ với **bình phương** tỉ số: nhân $500^2$.' }, { gt: 70000000, giaiThich: 'Đây là số cm². Đề hỏi m²: chia cho $10\\,000$.' }] },
      { id: '37.10', khongHinh: 'Cùng cách làm như bài 37.7: nhân chiều ngang với tỉ số hai đường chéo.', muc: 3, de: 'Bác Minh có tivi $32$ inch, chiều ngang màn hình $72$ cm. Bác muốn mua tivi $55$ inch cùng tỉ lệ khung hình (hai màn hình đồng dạng; số inch là độ dài đường chéo). Chiều ngang màn hình mới là bao nhiêu cm? Có đặt vừa vào hốc tủ hình vuông cạnh $1$ m không?',
        dapAn: { kieu: 'so', gt: 123.75, saiSo: 0.01 },
        goiY: ['Hai màn hình đồng dạng với tỉ số $k = \\frac{55}{32}$ (tỉ số hai đường chéo).', 'Chiều ngang mới $= 72 \\cdot \\frac{55}{32}$.'],
        loiGiai: ['$k = \\frac{55}{32}$; chiều ngang mới $= 72 \\cdot \\frac{55}{32} = 123{,}75$ (cm).', '$123{,}75$ cm $> 100$ cm nên tivi mới **không** đặt vừa hốc tủ.', 'Chiều ngang $= 123{,}75$'],
        loiThuongGap: [{ gt: 95, giaiThich: 'Em cộng thêm $55 - 32 = 23$. Hai màn hình đồng dạng thì phải **nhân** cùng tỉ số $\\frac{55}{32}$.' }] },
      { id: '37.11', hinhGiai: hg(bongDen), muc: 3, de: 'Một bóng đèn nhỏ (coi như điểm $O$) chiếu một tấm bìa hình tam giác đều cạnh $4$ cm lên bức tường song song với tấm bìa. Đèn cách tấm bìa $30$ cm và cách tường $90$ cm. Bóng của tấm bìa trên tường là hình đồng dạng phối cảnh tâm $O$. Tính cạnh của bóng (cm).',
        dapAn: { kieu: 'so', gt: 12 },
        goiY: ['Tỉ số phối cảnh $k = \\frac{\\text{khoảng cách đèn – tường}}{\\text{khoảng cách đèn – bìa}}$.', '$k = \\frac{90}{30} = 3$.'],
        loiGiai: ['$k = \\frac{90}{30} = 3$ (bóng là hình phóng to của tấm bìa).', 'Cạnh của bóng $= 3 \\cdot 4 = 12$'],
        loiThuongGap: [{ gt: 8, giaiThich: 'Em dùng khoảng cách bìa – tường $60$ cm. Tỉ số phối cảnh đo từ **tâm $O$**: $\\frac{90}{30}$.' }] }
    ],
    timLoi: [
      { de: 'Một bức tranh $20 \\times 30$ cm được phóng to theo tỉ số $2$. Bạn Nga tính diện tích tranh mới như sau. Dòng nào sai?',
        loiGiaiSai: ['Diện tích tranh cũ: $20 \\cdot 30 = 600$ (cm²)', 'Phóng to tỉ số $2$ nên diện tích gấp $2$ lần', 'Diện tích tranh mới: $1200$ cm²'],
        dongSai: 1,
        giaiThich: 'Cả chiều dài lẫn chiều rộng đều gấp $2$, nên diện tích gấp $2 \\cdot 2 = 4$ lần. Tranh mới là $40 \\times 60$ cm.',
        sua: 'Diện tích gấp $2^2 = 4$ lần: $4 \\cdot 600 = 2400$ cm².' },
      { de: "Hình $\\mathcal{H}'$ đồng dạng phối cảnh với $\\mathcal{H}$, tâm $O$, có $OA = 2$ cm, $OA' = 6$ cm, $AB = 3$ cm. Bạn Duy tính $A'B'$. Dòng nào sai?",
        loiGiaiSai: ["Tỉ số đồng dạng $k = \\frac{OA}{OA'} = \\frac{2}{6} = \\frac{1}{3}$", "$A'B' = k \\cdot AB = \\frac{1}{3} \\cdot 3$", "$A'B' = 1$ cm"],
        dongSai: 0,
        giaiThich: "Tỉ số đồng dạng của $\\mathcal{H}'$ với $\\mathcal{H}$ là $k = \\frac{OA'}{OA}$ (hình mới ở trên tử). $A'$ xa $O$ hơn $A$ nên $\\mathcal{H}'$ là hình phóng to, $A'B'$ phải dài hơn $AB$.",
        sua: "$k = \\frac{OA'}{OA} = 3$, nên $A'B' = 3 \\cdot 3 = 9$ cm." }
    ]
  });
})();
