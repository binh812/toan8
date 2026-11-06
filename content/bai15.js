// Bài 15 – Định lí Thalès trong tam giác (SGK Toán 8 KNTT, Tập 1, tr. 76–80)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hh = TOAN8.hh, hinh = TOAN8.hinhTinh, lerp = hh.lerp, tg = hh.tg, tgGoc = hh.tgGoc;

  // Hình Thalès chuẩn: tam giác ABC, M ∈ AB, N ∈ AC với độ dài đúng số liệu.
  function hinhThales(AM, MB, AN, NC, gocA, nhan, them) {
    var T = (gocA && gocA.bc) ? tg(gocA.bc, AN + NC, AM + MB) : tgGoc(AM + MB, AN + NC, gocA || 58);
    var o = { diem: { A: T.A, B: T.B, C: T.C, M: lerp(T.A, T.B, AM / (AM + MB)), N: lerp(T.A, T.C, AN / (AN + NC)) },
      to: ['A', 'B', 'C'], canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]], nhan: nhan };
    for (var k in them || {}) o[k] = them[k];
    return { widget: 'geo', config: hinh(o) };
  }

  // ---------- Hình động ----------
  function tiSo(a, b) { return b < 0.02 ? '—' : G0.fmt(a / b); }
  var G0 = { fmt: function (v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); } };

  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8, 0);
    G.poly([A, B, C], { fillOpacity: 0.05 });
    var AB = G.seg(A, B), AC = G.seg(A, C), BC = G.seg(B, C);
    var M = G.glider('M', 1.5, 3, AB);
    var d = G.par(M, BC), N = G.inter(d, AC, 'N');
    G.seg(A, M, { strokeColor: CAM, strokeWidth: 5 });
    G.seg(A, N, { strokeColor: CAM, strokeWidth: 5 });
    G.seg(M, B, { strokeColor: XANH, strokeWidth: 5 });
    G.seg(N, C, { strokeColor: XANH, strokeWidth: 5 });
    G.seg(M, N, { strokeColor: TIM, strokeWidth: 4 });
    G.label(-0.8, 7.9, function () { return 'AM/AB = ' + tiSo(G.len(A, M), G.len(A, B)); });
    G.label(4.6, 7.9, function () { return 'AN/AC = ' + tiSo(G.len(A, N), G.len(A, C)); });
    G.label(-0.8, 7.1, function () { return 'AM/MB = ' + tiSo(G.len(A, M), G.len(M, B)); });
    G.label(4.6, 7.1, function () { return 'AN/NC = ' + tiSo(G.len(A, N), G.len(N, C)); });
  };

  var thuanBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.04 });
    var AB = G.seg(A, B), AC = G.seg(A, C), BC = G.seg(B, C);
    var B1 = G.glider("B'", 1.2, 2.4, AB);
    var N = G.inter(G.par(B1, BC), AC, "C'");
    G.seg(A, B1, { strokeColor: CAM, strokeWidth: 5 }); G.seg(A, N, { strokeColor: CAM, strokeWidth: 5 });
    G.seg(B1, B, { strokeColor: XANH, strokeWidth: 5 }); G.seg(N, C, { strokeColor: XANH, strokeWidth: 5 });
    G.seg(B1, N, { strokeColor: TIM, strokeWidth: 4 });
    G.label(-0.8, 7.5, function () { return "AB'/B'B = " + tiSo(G.len(A, B1), G.len(B1, B)); });
    G.label(4.8, 7.5, function () { return "AC'/C'C = " + tiSo(G.len(A, N), G.len(N, C)); });
  };

  var daoBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.04 });
    var AB = G.seg(A, B), AC = G.seg(A, C);
    G.seg(B, C);
    var B1 = G.glider("B'", 1.5, 3, AB), C1 = G.glider("C'", 6.2, 2.4, AC);
    function bang() { return Math.abs(G.len(A, B1) / G.len(A, B) - G.len(A, C1) / G.len(A, C)) < 0.02; }
    G.seg(B1, C1, { strokeWidth: 5, strokeColor: function () { return bang() ? LA : '#adb5bd'; } });
    G.label(-0.8, 7.9, function () { return "AB'/AB = " + tiSo(G.len(A, B1), G.len(A, B)); });
    G.label(4.8, 7.9, function () { return "AC'/AC = " + tiSo(G.len(A, C1), G.len(A, C)); });
    G.label(-0.8, 7.1, function () { return bang() ? "Hai tỉ số bằng nhau → B'C' // BC" : 'Kéo B\', C\' cho hai tỉ số bằng nhau'; });
  };

  var heQuaBuild = function (board, G) {
    var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.04 });
    var AB = G.seg(A, B), AC = G.seg(A, C), BC = G.seg(B, C, { strokeColor: TIM, strokeWidth: 4 });
    var B1 = G.glider("B'", 1.5, 3, AB);
    var N = G.inter(G.par(B1, BC), AC, "C'");
    G.seg(A, B1, { strokeColor: CAM, strokeWidth: 5 }); G.seg(A, N, { strokeColor: CAM, strokeWidth: 5 });
    G.seg(B1, N, { strokeColor: TIM, strokeWidth: 4 });
    G.label(-0.8, 7.9, function () { return "AB'/AB = " + tiSo(G.len(A, B1), G.len(A, B)); });
    G.label(4.8, 7.9, function () { return "AC'/AC = " + tiSo(G.len(A, N), G.len(A, C)); });
    G.label(1.6, 7.1, function () { return "B'C'/BC = " + tiSo(G.len(B1, N), G.len(B, C)); });
  };

  // Hình bài thực tế đo sông (đơn vị m, chia 40 để vẽ)
  var hinhSong = { widget: 'geo', config: hinh({
    diem: { E: [0, 10], A: [0, 4], B: [0, 0], C: [4.5, 4], D: [7.5, 0] },
    ve: [[[-1.5, 4], [10, 4], { mau: '#74c0fc', day: 3 }], [[-1.5, 0], [10, 0], { mau: '#74c0fc', day: 3 }]],
    canh: [['E', 'B'], ['E', 'D'], ['A', 'C', { mau: CAM, day: 3 }], ['B', 'D', { mau: XANH, day: 3 }]],
    nhan: [['E', 'A', '240 m'], ['A', 'B', '160 m'], ['E', 'C', '300 m', false, 1.3]],
    lechTen: { A: [-14, 12], B: [-14, -14], C: [6, 16], D: [8, -16], E: [-14, 6] },
    ghiChu: 'Hai bờ sông song song'
  }) };

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  // Lưới Thalès: chia AB thành m + k phần bằng nhau, các đường song song với BC chia AC y như thế
  function luoi(m, k, tuyChon, them) { return Object.assign({ ten: 'thalesLuoi', thamSo: { m: m, k: k }, tuyChon: tuyChon || {} }, them || {}); }
  function hg(c, giai) {
    var cf = Object.assign({ chiXem: true, t: 1 }, c);
    if (giai) cf.thamSo = Object.assign({}, cf.thamSo, { trangThai: 'giai' });
    return { widget: 'canh', config: cf };
  }
  function soVN(x) { return String(Math.round(x * 1000) / 1000).replace('.', '{,}'); }

  TOAN8.bai({
    id: 15, ten: 'Định lí Thalès trong tam giác', sgk: { tap: 1, trang: 76 },
    nhin: {
      tieuDe: 'Chia một cạnh thành các phần bằng nhau, cạnh kia cũng bị chia y như thế', loai: 'chungMinh',
      luuY: 'Hình chứng minh định lí khi tỉ số $\\frac{AM}{MB}$ là một phân số $\\frac{m}{k}$, tức là chia được $AB$ thành $m + k$ phần bằng nhau. Khi tỉ số không viết được thành phân số (ví dụ $\\sqrt{2}$), cần một lập luận khác, vượt quá lớp 8.',
      canh: { ten: 'thalesLuoi', moTa: 'Tam giác ABC, cạnh AB chia thành các phần bằng nhau. Qua mỗi vạch kẻ đường song song với BC; tam giác nhỏ trượt dọc AB cho thấy cạnh AC cũng bị chia thành các phần bằng nhau.',
        dongSo: function (p) { return '$AB$ chia thành $\\ca{' + p.m + '} + \\cb{' + p.k + '} = ' + (p.m + p.k) + '$ phần bằng nhau, $M$ ở vạch thứ $\\ca{' + p.m + '}$.'; } },
      buoc: [
        { t: 0, chu: 'Chia $AB$ thành $\\ca{m} + \\cb{k}$ phần bằng nhau. $M$ ở vạch thứ $\\ca{m}$, và $MN \\parallel BC$.' },
        { t: 0.1, chu: 'Qua mỗi vạch, kẻ một đường song song với $BC$. Các khúc trên $AC$ có bằng nhau không?' },
        { t: 0.4, chu: 'Trượt tam giác nhỏ xanh lá dọc $AB$, mỗi lần một nấc. Trượt không làm đổi hình, cạnh đáy vẫn song song với $BC$, nên nó vừa khít giữa hai đường song song kề nhau.' },
        { t: 0.72, chu: 'Cạnh phải của mỗi tam giác nhỏ song song với $AC$. Trượt ngang nó sang $AC$ (hai cặp cạnh đối song song tạo hình bình hành): nó trùng đúng một khúc. Vậy mọi khúc trên $AC$ bằng nhau.' },
        { t: 0.9, chu: '$\\ca{AM}$ và $\\ca{AN}$ cùng có $\\ca{m}$ phần; $\\cb{MB}$ và $\\cb{NC}$ cùng có $\\cb{k}$ phần.' }
      ],
      ketLuan: 'Hai cạnh bị chia thành cùng số phần bằng nhau, nên $$\\frac{\\ca{AM}}{\\cb{MB}} = \\frac{\\ca{AN}}{\\cb{NC}} = \\frac{\\ca{m}}{\\cb{k}}, \\qquad \\frac{\\ca{AM}}{AB} = \\frac{\\ca{AN}}{AC}.$$',
      dung: {
        tieuDe: 'Đếm phần trên hai cạnh', tuBai: '15.3',
        canh: luoi(2, 1, { AB: 9, AC: 12, gocA: 58, anLucDau: true, nhan: { AM: '6', MB: '3', AN: '8', NC: 'x' }, giai: { NC: '4' }, thu: { tu: 'N', den: 'C' } },
          { moTa: 'Tam giác ABC có MN song song BC, AM bằng 6, MB bằng 3, AN bằng 8, cần tìm NC.' }),
        loiThuongGap: [],
        moiThu: '$AM = 6$ gấp đôi $MB = 3$. Vậy $NC$ dài bao nhiêu? Nếu gõ sai, hình sẽ vẽ đúng độ dài em gõ để em thấy vì sao.',
        soBatKi: function (v) {
          if (v <= 0) return { t: 0, loi: 'Độ dài phải lớn hơn $0$.' };
          var loi;
          if (v === 12) loi = 'Em lập tỉ số lệch kiểu ($\\frac{AM}{AB} = \\frac{AN}{NC}$). Nhìn hình: $AN$ có $2$ phần, $NC$ chỉ có $1$ phần, mà đoạn đỏ $12$ còn dài hơn cả $AN$.';
          else if (v === 16) loi = 'Em đặt ngược một vế: đoạn đỏ $16$ dài gấp đôi $AN$. Trên $AB$ thì ngược lại, $MB$ chỉ bằng nửa $AM$.';
          else loi = 'Đoạn đỏ là $NC = ' + soVN(v) + '$, ' + (v > 4 ? 'dài quá' : 'ngắn quá') + '. Trên $AB$, $MB$ bằng nửa $AM$; trên $AC$, $NC$ cũng phải bằng nửa $AN$.';
          return { thamSo: { thu: v }, t: 1, loi: loi };
        },
        dungChu: '$AB$ chia $3$ phần nên $AC$ cũng chia $3$ phần. $AN = 8$ gồm $2$ phần, mỗi phần $4$; $NC$ là $1$ phần: $NC = 4$.'
      },
      suyRa: {
        tieuDe: 'Bờ sông, hai góc bằng nhau, đoạn song song: vẫn là đếm phần',
        baDe: [
          { tuBai: '15.9', canh: luoi(3, 2, { dinh: { A: [0, 10], B: [0, 0], C: [7.5, 0] }, song: true, anLucDau: true, ten: ['E', 'B', 'D', 'A', 'C'],
            nhan: { AM: '240 m', MB: '160 m', AN: '300 m', NC: '?' }, giai: { NC: '200 m' } }, { moTa: 'Hai bờ sông song song, E A B thẳng hàng, E C D thẳng hàng.' }), tenNut: 'Chia đều hai bờ',
            loiThuongGap: [],
            phanUng: [{ gt: 500, loi: '$500$ m là cả đoạn $ED$ ($5$ phần). Đề hỏi $CD$, chỉ $2$ phần.' },
              { gt: 128, loi: 'Em ghép lệch. $EA$ ($3$ phần) đi với $EC$ ($3$ phần), $AB$ ($2$ phần) đi với $CD$.' }],
            dungChu: '$EB$ chia $5$ phần, mỗi phần $80$ m. $ED$ cũng $5$ phần, mỗi phần $300 : 3 = 100$ m. $CD$ là $2$ phần: $200$ m.',
            saiChu: 'Hai bờ sông song song. $EA$ có $3$ phần, $AB$ có $2$ phần; trên $ED$ cũng vậy: $EC$ có $3$ phần, $CD$ có $2$ phần.' },
          { tuBai: '15.10', canh: luoi(2, 1, { AB: 12, AC: 9, gocA: 52, goc: true, anLucDau: true, nhan: { AM: 'y', MB: '4', AN: '6' }, giai: { AM: '8' } },
            { ghiChu: 'AC = 9. Hai góc tô màu bằng nhau.' }), tenNut: 'Tìm đường song song',
            loiThuongGap: [],
            phanUng: [{ gt: '8/3', loi: 'Em so $AN$ với cả cạnh $AC$. Phải tính $NC = 9 - 6 = 3$ trước: $AN$ là $2$ phần, $NC$ là $1$ phần.' },
              { gt: 2, loi: 'Em đặt ngược một vế. $AN$ dài gấp đôi $NC$, nên $AM$ cũng dài gấp đôi $MB$.' }],
            dungChu: 'Hai góc đồng vị bằng nhau nên $MN \\parallel BC$. $NC = 9 - 6 = 3$, nên $AC$ chia $3$ phần, $AN$ là $2$ phần. $AB$ cũng vậy: $AM = 2 \\cdot 4 = 8$.',
            saiChu: 'Hai góc đồng vị bằng nhau cho $MN \\parallel BC$. Tính $NC = AC - AN$ trước, rồi đếm phần.' },
          { tuBai: '15.11', canh: luoi(1, 2, { AB: 6, AC: 7.5, BC: 9, luoi: true, anLucDau: true, nhan: { AM: '2', MB: '4', BC: '9', MN: 'x' }, giai: { MN: '3' } }), tenNut: 'Kẻ lưới',
            loiThuongGap: [],
            phanUng: [{ gt: 4.5, loi: 'Em so $MN$ với $MB$. Nhìn lưới: $BC$ gồm $3$ đoạn bằng $MN$, nên phải so với cả cạnh $AB = 6$.' }],
            dungChu: '$AB$ chia $3$ phần. Lưới chia $BC$ thành $3$ đoạn bằng nhau và $MN$ dài đúng $1$ đoạn: $9 : 3 = 3$.',
            saiChu: 'Đếm trên lưới: $BC$ gồm mấy đoạn dài bằng $MN$?' }
        ],
        cachNhan: 'Thấy một đường song song với một cạnh (hoặc hai góc đồng vị bằng nhau): hai cạnh kia bị chia thành cùng số phần bằng nhau, cứ đếm phần. Đoạn song song thì so với cả cạnh song song với nó.'
      }
    },
    khamPha: {
      nhiemVu: 'Kéo điểm **M** trên cạnh $AB$ (đoạn tím $MN$ luôn song song với $BC$). Em cũng có thể kéo $A$, $B$, $C$ để đổi hình tam giác.\n\nĐoạn **cam** là $AM$, $AN$; đoạn **xanh** là $MB$, $NC$. Hai tỉ số $\\frac{AM}{AB}$ và $\\frac{AN}{AC}$ thay đổi thế nào?',
      widget: 'geo',
      config: { bbox: [-1, 8.4, 10, -0.8], build: khamPhaBuild,
        // kéo M dọc AB: hai tỉ số luôn bằng nhau; đổi hình tam giác rồi kéo M lần nữa
        tuChay: [{ diem: 'M', den: [0.6, 1.2], giay: 2 }, { cho: 1 }, { diem: 'M', den: [2.4, 4.8], giay: 2.5 }, { cho: 1 },
          { diem: 'A', den: [5.5, 6.5], giay: 2 }, { diem: 'M', den: [1.4, 1.6], giay: 2 }, { cho: 1 },
          { diem: 'A', den: [3, 6], giay: 2 }, { diem: 'M', den: [1.5, 3], giay: 1.5 }] },
      cauHoi: {
        de: 'Khi $MN$ song song với $BC$, em thấy hai tỉ số $\\frac{AM}{AB}$ và $\\frac{AN}{AC}$ thế nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Luôn bằng nhau', '$\\frac{AM}{AB}$ luôn lớn hơn', 'Không có quy luật gì'] },
        goiY: ['Kéo M tới vài vị trí khác nhau rồi so hai con số ở dòng trên cùng.'],
        loiGiai: ['Dù M ở đâu, hai tỉ số luôn bằng nhau. Cặp $\\frac{AM}{MB}$ và $\\frac{AN}{NC}$ cũng luôn bằng nhau. Đó chính là **định lí Thalès**.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Tỉ số của hai đoạn thẳng',
        noiDung: '**Tỉ số của hai đoạn thẳng** là tỉ số độ dài của chúng theo **cùng một đơn vị đo**.\n\nTỉ số của $AB$ và $CD$ kí hiệu là $\\frac{AB}{CD}$. Ví dụ $AB = 2$ cm, $CD = 3$ cm thì $\\frac{AB}{CD} = \\frac{2}{3}$.' },
      { loai: 'chuY', noiDung: 'Phải đổi về **cùng đơn vị** trước khi lập tỉ số. Ví dụ $EF = 25$ cm, $HK = 10$ dm $= 100$ cm thì $\\frac{EF}{HK} = \\frac{25}{100} = \\frac{1}{4}$.' },
      { loai: 'dinhNghia', tieuDe: 'Đoạn thẳng tỉ lệ',
        noiDung: 'Hai đoạn thẳng $AB$ và $CD$ gọi là **tỉ lệ** với hai đoạn thẳng $A\'B\'$ và $C\'D\'$ nếu có tỉ lệ thức\n\n$$\\frac{AB}{CD} = \\frac{A\'B\'}{C\'D\'} \\quad\\text{hay}\\quad \\frac{AB}{A\'B\'} = \\frac{CD}{C\'D\'}.$$' },
      { loai: 'dinhLi', tieuDe: 'Định lí Thalès (thuận)',
        noiDung: 'Nếu một đường thẳng **song song** với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.\n\n**GT:** $\\triangle ABC$, $B\'C\' \\parallel BC$ ($B\' \\in AB$, $C\' \\in AC$).\n\n**KL:** $$\\frac{\\ca{AB\'}}{AB} = \\frac{\\ca{AC\'}}{AC};\\quad \\frac{\\ca{AB\'}}{\\cb{B\'B}} = \\frac{\\ca{AC\'}}{\\cb{C\'C}};\\quad \\frac{\\cb{B\'B}}{AB} = \\frac{\\cb{C\'C}}{AC}.$$' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8, 10, -0.8], build: thuanBuild,
        tuChay: [{ diem: "B'", den: [0.4, 0.8], giay: 2 }, { cho: 1 }, { diem: "B'", den: [2.6, 5.2], giay: 2.5 }, { cho: 1 }, { diem: "B'", den: [1.2, 2.4], giay: 1.5 }] },
        chuThich: 'Kéo $B\'$. Đoạn **cam** ($AB\'$, $AC\'$) ở phía đỉnh $A$, đoạn **xanh** ($B\'B$, $C\'C$) ở phía đáy. Cam trên xanh của cạnh này luôn bằng cam trên xanh của cạnh kia.' },
      { loai: 'dinhLi', tieuDe: 'Định lí Thalès đảo',
        noiDung: 'Nếu một đường thẳng cắt hai cạnh của một tam giác và định ra trên hai cạnh này những đoạn thẳng tương ứng tỉ lệ thì đường thẳng đó **song song** với cạnh còn lại của tam giác.\n\n**GT:** $\\triangle ABC$, $B\' \\in AB$, $C\' \\in AC$, $\\frac{AB\'}{AB} = \\frac{AC\'}{AC}$.\n\n**KL:** $B\'C\' \\parallel BC$.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8.4, 10, -0.8], build: daoBuild,
        // đưa C' tới đúng tỉ số với B' → đoạn B'C' hoá xanh (song song); đổi B' thì mất song song cho tới khi C' theo kịp
        tuChay: [{ diem: "C'", den: [5.75, 3], giay: 2 }, { cho: 1.5 }, { diem: "B'", den: [0.6, 1.2], giay: 2 }, { cho: 1 },
          { diem: "C'", den: [7.4, 1.2], giay: 2 }, { cho: 1.5 }, { diem: "B'", den: [1.5, 3], giay: 1.5 }, { diem: "C'", den: [6.2, 2.4], giay: 1.5 }] },
        chuThich: 'Kéo riêng từng điểm $B\'$ và $C\'$. Khi hai tỉ số bằng nhau, đoạn $B\'C\'$ chuyển sang màu **xanh lá**: lúc đó nó song song với $BC$.' },
      { loai: 'dinhLi', tieuDe: 'Hệ quả của định lí Thalès (mở rộng)',
        noiDung: 'Nếu $B\'C\' \\parallel BC$ ($B\' \\in AB$, $C\' \\in AC$) thì tam giác $AB\'C\'$ có ba cạnh tương ứng tỉ lệ với ba cạnh của tam giác $ABC$:\n\n$$\\frac{\\ca{AB\'}}{AB} = \\frac{\\ca{AC\'}}{AC} = \\frac{\\cd{B\'C\'}}{\\cd{BC}}.$$\n\nDùng hệ quả này để tính độ dài đoạn **song song** $B\'C\'$.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8.4, 10, -0.8], build: heQuaBuild,
        tuChay: [{ diem: "B'", den: [0.5, 1], giay: 2 }, { cho: 1 }, { diem: "B'", den: [2.5, 5], giay: 2.5 }, { cho: 1 }, { diem: "B'", den: [1.5, 3], giay: 1.5 }] },
        chuThich: 'Kéo $B\'$: ba tỉ số luôn bằng nhau. Chú ý mẫu số là **cả cạnh** $AB$, $AC$, $BC$.' },
      { loai: 'chuY', noiDung: '**Hay nhầm 1 – lập tỉ số lệch đoạn.** Hai vế phải cùng "kiểu": $\\frac{AM}{MB} = \\frac{AN}{NC}$ (đoạn trên / đoạn dưới) hoặc $\\frac{AM}{AB} = \\frac{AN}{AC}$ (đoạn trên / cả cạnh). **Không** được viết $\\frac{AM}{MB} = \\frac{AN}{AC}$.\n\n**Hay nhầm 2 – chưa có song song.** Chỉ được dùng định lí Thalès khi đề cho (hoặc em đã chứng minh được) $MN \\parallel BC$.' }
    ],
    viDu: [
      { de: 'Cho tam giác $DEF$ có $MN \\parallel EF$ ($M \\in DE$, $N \\in DF$), $DM = 3$, $ME = 4{,}5$, $DN = 4$. Tính $NF$.', canh: luoi(2, 3, { ten: ['D', 'E', 'F', 'M', 'N'], AB: 7.5, AC: 10, gocA: 55, nhan: { AM: '3', MB: '4,5', AN: '4', NC: '?' }, giai: { NC: '6' } }), buoc: [
        { canh: { t: 0.4 }, lam: 'Vì $MN \\parallel EF$, theo định lí Thalès: $\\frac{DM}{ME} = \\frac{DN}{NF}$', vi: 'Có song song nên dùng được Thalès. Ghép đoạn trên / đoạn dưới ở cả hai cạnh.' },
        { canh: { t: 1 }, lam: '$\\frac{3}{4{,}5} = \\frac{4}{NF}$', vi: 'Thay số đã biết. Trên hình: $DM = 3$ là $2$ phần, $ME = 4{,}5$ là $3$ phần, mỗi phần dài $1{,}5$.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: '$NF = \\frac{4 \\cdot 4{,}5}{3} = 6$', vi: 'Nhân chéo rồi chia. Trên hình: $DN = 4$ là $2$ phần, mỗi phần dài $2$; $NF$ có $3$ phần nên bằng $6$.' } ] },
      { de: 'Cho tam giác $ABC$, $M \\in AB$, $N \\in AC$ với $AM = 3$, $MB = 6$, $AN = 2{,}5$, $NC = 5$. Chứng minh $MN \\parallel BC$.', canh: luoi(1, 2, { AB: 9, AC: 7.5, gocA: 60, dao: { AN: 2.5, NC: 5 }, nhan: { AM: '3', MB: '6', AN: '2,5', NC: '5' } }), buoc: [
        { canh: { t: 0.4 }, lam: '$\\frac{AM}{MB} = \\frac{3}{6} = \\frac{1}{2}$; $\\frac{AN}{NC} = \\frac{2{,}5}{5} = \\frac{1}{2}$', vi: 'Tính hai tỉ số tương ứng ở hai cạnh.' },
        { canh: { t: 1 }, lam: 'Vì $\\frac{AM}{MB} = \\frac{AN}{NC}$ nên $MN \\parallel BC$', vi: 'Hai tỉ số bằng nhau, áp dụng **định lí Thalès đảo**. Trên hình: chia $AB$ thành $3$ phần, đường song song với $BC$ qua $M$ đi đúng qua $N$.' } ] },
      { de: 'Cho tam giác $ABC$ có $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$), $AM = 2$, $AB = 5$, $BC = 7{,}5$. Tính $MN$.', canh: luoi(2, 3, { AB: 5, AC: 6.5, BC: 7.5, luoi: true, nhan: { AM: '2', BC: '7,5', MN: '?' }, giai: { MN: '3' } }, { ghiChu: 'AB = 5' }), buoc: [
        { canh: { t: 1 }, lam: 'Vì $MN \\parallel BC$: $\\frac{AM}{AB} = \\frac{MN}{BC}$', vi: 'Hệ quả của định lí Thalès: tam giác nhỏ $AMN$ và tam giác lớn $ABC$ có cạnh tương ứng tỉ lệ. Trên lưới: $AB$ có $5$ phần, $AM$ có $2$; $BC$ có $5$ đoạn, $MN$ có $2$.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: '$\\frac{2}{5} = \\frac{MN}{7{,}5}$ nên $MN = \\frac{2 \\cdot 7{,}5}{5} = 3$', vi: 'Thay số rồi nhân chéo. Mỗi đoạn trên $BC$ dài $7{,}5 : 5 = 1{,}5$, $MN$ gồm $2$ đoạn.' } ] }
    ],
    viDuMo: [
      { de: 'Cho tam giác $ABC$ có $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$), $AM = 4$, $MB = 2$, $AN = 6$. Tính $NC$.', buoc: [
        { lam: 'Vì $MN \\parallel BC$: $\\frac{AM}{MB} = \\frac{AN}{NC}$', vi: 'Định lí Thalès: đoạn trên / đoạn dưới.' },
        { lam: '$\\frac{4}{2} = \\frac{6}{NC}$', vi: 'Thay số.' },
        { lam: '$NC = \\frac{6 \\cdot 2}{4} = 3$', vi: 'Em hãy tính $NC$:', an: true,
          dapAn: { kieu: 'so', gt: 3 },
          loiThuongGap: [{ gt: 12, giaiThich: 'Em đã nhân $6 \\cdot 4 : 2$. Từ $\\frac{4}{2} = \\frac{6}{NC}$ suy ra $NC = \\frac{6 \\cdot 2}{4}$.' }] } ] },
      { de: 'Cho tam giác $ABC$, $M \\in AB$, $N \\in AC$ với $AM = 6$, $AB = 9$, $AN = 4$, $AC = 6$. Hỏi $MN$ có song song với $BC$ không?', buoc: [
        { lam: '$\\frac{AM}{AB} = \\frac{6}{9} = \\frac{2}{3}$; $\\frac{AN}{AC} = \\frac{4}{6} = \\frac{2}{3}$', vi: 'Tính hai tỉ số đoạn trên / cả cạnh.' },
        { lam: 'Hai tỉ số bằng nhau nên $MN \\parallel BC$ (Thalès đảo)', vi: 'Khẳng định "$MN \\parallel BC$" đúng hay sai?', an: true,
          dapAn: { kieu: 'dungSai', gt: true } } ] }
    ],
    baiTap: [
      { id: '15.1', hinhGiai: hg({ ten: 'thalesDoan', tuyChon: { a: 6, b: 15, u: 3, tenA: 'AB', tenB: 'CD' }, ghiChu: 'Mỗi phần dài 3 cm.' }), muc: 1, de: 'Cho $AB = 6$ cm và $CD = 15$ cm. Tìm tỉ số $\\frac{AB}{CD}$ (viết dạng phân số, ví dụ 3/4).',
        dapAn: { kieu: 'so', gt: '2/5' },
        goiY: ['Tỉ số của hai đoạn thẳng là tỉ số độ dài của chúng (cùng đơn vị).', 'Tính $\\frac{6}{15}$ rồi rút gọn.'],
        loiGiai: ['$\\frac{AB}{CD} = \\frac{6}{15}$', '$= \\frac{2}{5}$'],
        loiThuongGap: [{ gt: '5/2', giaiThich: 'Em lấy $CD : AB$ rồi. Tỉ số $\\frac{AB}{CD}$ thì $AB$ ở trên.' }] },
      { id: '15.2', hinhGiai: hg({ ten: 'thalesDoan', tuyChon: { a: 40, b: 200, u: 40, tenA: 'MN', tenB: 'PQ' }, ghiChu: 'Đổi PQ = 2 m = 200 cm. Mỗi phần dài 40 cm.' }), muc: 1, de: 'Cho $MN = 40$ cm và $PQ = 2$ m. Tìm tỉ số $\\frac{MN}{PQ}$.',
        dapAn: { kieu: 'so', gt: '1/5' },
        goiY: ['Hai đoạn phải cùng đơn vị đo.', 'Đổi $2$ m $= 200$ cm rồi lập tỉ số.'],
        loiGiai: ['Đổi $PQ = 2$ m $= 200$ cm.', '$\\frac{MN}{PQ} = \\frac{40}{200} = \\frac{1}{5}$'],
        loiThuongGap: [{ gt: 20, giaiThich: 'Em chưa đổi đơn vị: $40$ là cm còn $2$ là m. Đổi $2$ m $= 200$ cm trước nhé.' }] },
      { id: '15.3', muc: 1, de: 'Trong hình, $MN \\parallel BC$, $AM = 6$, $MB = 3$, $AN = 8$. Tính $x = NC$.',
        hinh: hinhThales(6, 3, 8, 4, 58, [['A', 'M', '6'], ['M', 'B', '3'], ['A', 'N', '8'], ['N', 'C', 'x']]),
        dapAn: { kieu: 'so', gt: 4 },
        goiY: ['$MN \\parallel BC$ nên dùng định lí Thalès: $\\frac{AM}{MB} = \\frac{AN}{NC}$.', 'Thay số: $\\frac{6}{3} = \\frac{8}{x}$ rồi nhân chéo.'],
        loiGiai: ['Vì $MN \\parallel BC$: $\\frac{AM}{MB} = \\frac{AN}{NC}$, tức $\\frac{6}{3} = \\frac{8}{x}$', '$x = \\frac{8 \\cdot 3}{6} = 4$'],
        loiThuongGap: [
          { gt: 12, giaiThich: 'Em lập tỉ số lệch đoạn ($\\frac{AM}{AB} = \\frac{AN}{NC}$). Hai vế phải cùng kiểu: đoạn trên / đoạn dưới.' },
          { gt: 16, giaiThich: 'Em đặt ngược một vế ($\\frac{MB}{AM} = \\frac{AN}{NC}$). Đoạn sát đỉnh $A$ phải cùng ở trên ở cả hai vế.' }] },
      { id: '15.4', hinhGiai: hg(luoi(2, 3, { AB: 5, AC: 10, gocA: 60, dao: { AN: 4, NC: 6 }, nhan: { AM: '2', MB: '3', AN: '4', NC: '6' } }, { ghiChu: 'Chia AB thành 5 phần: đường song song với BC qua M đi đúng qua N.' })), muc: 1, de: 'Trong hình, $AM = 2$, $MB = 3$, $AN = 4$, $NC = 6$. Khẳng định "$MN \\parallel BC$" đúng hay sai?',
        hinh: hinhThales(2, 3, 4, 6, 60, [['A', 'M', '2'], ['M', 'B', '3'], ['A', 'N', '4'], ['N', 'C', '6']]),
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Dùng định lí Thalès đảo: so sánh $\\frac{AM}{MB}$ và $\\frac{AN}{NC}$.', '$\\frac{2}{3}$ và $\\frac{4}{6}$ có bằng nhau không?'],
        loiGiai: ['$\\frac{AM}{MB} = \\frac{2}{3}$; $\\frac{AN}{NC} = \\frac{4}{6} = \\frac{2}{3}$.', 'Hai tỉ số bằng nhau nên $MN \\parallel BC$ (định lí Thalès đảo). Khẳng định **đúng**.'] },
      { id: '15.5', muc: 2, de: 'Trong hình, $MN \\parallel BC$, $MB = 5$, $AN = 6$, $NC = 4$. Tính $x = AM$.',
        hinh: hinhThales(7.5, 5, 6, 4, 50, [['A', 'M', 'x'], ['M', 'B', '5'], ['A', 'N', '6'], ['N', 'C', '4']]),
        dapAn: { kieu: 'so', gt: '15/2' },
        goiY: ['$MN \\parallel BC$ nên $\\frac{AM}{MB} = \\frac{AN}{NC}$.', '$\\frac{x}{5} = \\frac{6}{4}$, suy ra $x = \\frac{6 \\cdot 5}{4}$.'],
        loiGiai: ['Vì $MN \\parallel BC$: $\\frac{x}{5} = \\frac{6}{4}$', '$x = \\frac{6 \\cdot 5}{4} = 7{,}5$'],
        loiThuongGap: [{ gt: '10/3', giaiThich: 'Em đặt ngược tỉ số ($\\frac{x}{5} = \\frac{4}{6}$). $AM$ ứng với $AN$ (cùng sát đỉnh $A$), $MB$ ứng với $NC$.' }] },
      { id: '15.6', muc: 2, de: 'Trong hình, $MN \\parallel BC$, $AM = 3$, $MB = 2$, $AN = 6$. Tính độ dài **cả cạnh** $AC$.',
        hinh: hinhThales(3, 2, 6, 4, 62, [['A', 'M', '3'], ['M', 'B', '2'], ['A', 'N', '6']]),
        dapAn: { kieu: 'so', gt: 10 },
        goiY: ['Có thể tính $NC$ trước bằng $\\frac{AM}{MB} = \\frac{AN}{NC}$, rồi $AC = AN + NC$.', '$NC = \\frac{6 \\cdot 2}{3} = 4$.'],
        loiGiai: ['Vì $MN \\parallel BC$: $\\frac{AM}{MB} = \\frac{AN}{NC}$, tức $\\frac{3}{2} = \\frac{6}{NC}$, nên $NC = 4$.', '$AC = AN + NC = 6 + 4 = 10$'],
        loiThuongGap: [{ gt: 4, giaiThich: '$4$ mới là $NC$ (hoặc em lập tỉ số lệch $\\frac{AM}{MB} = \\frac{AN}{AC}$). Đề hỏi cả cạnh $AC = AN + NC$.' }] },
      { id: '15.7', hinhGiai: hg(luoi(3, 4, { AB: 7, AC: 9, gocA: 56, dao: { AN: 4, NC: 5 }, nhan: { AM: '3', MB: '4', AN: '4', NC: '5' } }, { ghiChu: 'Chia AB thành 7 phần: đường song song với BC qua M (nét đứt) không đi qua N, dù lệch rất ít.' })), muc: 2, de: 'Trong hình, $AM = 3$, $MB = 4$, $AN = 4$, $NC = 5$. Nhìn hình thì $MN$ có vẻ song song với $BC$. Khẳng định "$MN \\parallel BC$" đúng hay sai?',
        hinh: hinhThales(3, 4, 4, 5, 56, [['A', 'M', '3'], ['M', 'B', '4'], ['A', 'N', '4'], ['N', 'C', '5']]),
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Đừng tin mắt, hãy tính tỉ số: $\\frac{AM}{MB}$ và $\\frac{AN}{NC}$.', 'So sánh $\\frac{3}{4} = 0{,}75$ và $\\frac{4}{5} = 0{,}8$.'],
        loiGiai: ['$\\frac{AM}{MB} = \\frac{3}{4} = 0{,}75$; $\\frac{AN}{NC} = \\frac{4}{5} = 0{,}8$.', 'Hai tỉ số khác nhau nên $MN$ **không** song song với $BC$. Khẳng định **sai**.'] },
      { id: '15.8', hinhGiai: hg(luoi(2, 1, {}, { ghiChu: 'Hai vế phải cùng kiểu: phần trên chia phần dưới, hoặc một đoạn chia cả cạnh của nó.' })), muc: 2, de: 'Cho tam giác $ABC$ có $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$). Tỉ lệ thức nào dưới đây **sai**?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['$\\frac{AM}{AB} = \\frac{AN}{AC}$', '$\\frac{AM}{MB} = \\frac{AN}{NC}$', '$\\frac{MB}{AB} = \\frac{NC}{AC}$', '$\\frac{AM}{MB} = \\frac{AN}{AC}$'] },
        goiY: ['Hai vế phải cùng kiểu đoạn: (trên/dưới), (trên/cả cạnh) hoặc (dưới/cả cạnh).', 'Ở phương án cuối, vế trái là trên/dưới còn vế phải là trên/cả cạnh.'],
        loiGiai: ['Ba tỉ lệ thức đầu đúng theo định lí Thalès.', '$\\frac{AM}{MB} = \\frac{AN}{AC}$ sai vì lệch đoạn: vế trái là đoạn trên/đoạn dưới, vế phải là đoạn trên/cả cạnh.'] },
      { id: '15.9', muc: 3, de: 'Để đo khoảng cách giữa hai điểm $C$ và $D$ ở hai bờ sông ($A$, $C$ nằm trên một bờ; $B$, $D$ nằm trên bờ kia; hai bờ song song), người ta chọn điểm $E$ trên đường thẳng $AB$ ($AB$ vuông góc với hai bờ) sao cho $E$, $C$, $D$ thẳng hàng. Đo được $EA = 240$ m, $AB = 160$ m (chiều rộng sông), $EC = 300$ m. Tính $CD$ (m).',
        hinh: hinhSong,
        dapAn: { kieu: 'so', gt: 200 },
        goiY: ['Hai bờ sông song song nên $AC \\parallel BD$. Xét tam giác $EBD$.', 'Định lí Thalès: $\\frac{EA}{AB} = \\frac{EC}{CD}$, tức $\\frac{240}{160} = \\frac{300}{CD}$.'],
        loiGiai: ['Hai bờ sông song song nên $AC \\parallel BD$. Trong $\\triangle EBD$, theo định lí Thalès: $\\frac{EA}{AB} = \\frac{EC}{CD}$', '$\\frac{240}{160} = \\frac{300}{CD}$', '$CD = \\frac{300 \\cdot 160}{240} = 200$ (m)'],
        loiThuongGap: [
          { gt: 500, giaiThich: '$500$ m là cả đoạn $ED$. Đề hỏi $CD = ED - EC$.' },
          { gt: 128, giaiThich: 'Em ghép lệch: $EA$ phải ứng với $EC$ (cùng sát đỉnh $E$), $AB$ ứng với $CD$.' }] },
      { id: '15.10', muc: 3, de: 'Trong hình, $\\angle AMN = \\angle ABC$, $MB = 4$, $AN = 6$, $AC = 9$. Tính $y = AM$.',
        hinh: hinhThales(8, 4, 6, 3, 52, [['A', 'M', 'y'], ['M', 'B', '4'], ['A', 'N', '6']],
          { goc: [['A', 'M', 'N'], ['A', 'B', 'C']] }),
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['$\\angle AMN$ và $\\angle ABC$ là hai góc đồng vị bằng nhau, nên $MN \\parallel BC$. Tính $NC = AC - AN$.', '$NC = 3$. Rồi $\\frac{AM}{MB} = \\frac{AN}{NC}$: $\\frac{y}{4} = \\frac{6}{3}$.'],
        loiGiai: ['$\\angle AMN = \\angle ABC$ (đồng vị) nên $MN \\parallel BC$.', '$NC = AC - AN = 9 - 6 = 3$.', 'Theo định lí Thalès: $\\frac{y}{4} = \\frac{6}{3}$', '$y = \\frac{4 \\cdot 6}{3} = 8$'],
        loiThuongGap: [
          { gt: '8/3', giaiThich: 'Em lập tỉ số lệch $\\frac{AM}{MB} = \\frac{AN}{AC}$. Phải dùng $NC = 9 - 6 = 3$.' },
          { gt: 2, giaiThich: 'Em đặt ngược một vế. $AM$ ứng với $AN$, $MB$ ứng với $NC$: $\\frac{y}{4} = \\frac{6}{3}$.' }] },
      { id: '15.11', muc: 3, de: 'Trong hình, $MN \\parallel BC$, $AM = 2$, $MB = 4$, $BC = 9$. Tính $x = MN$.',
        hinh: hinhThales(2, 4, 2.5, 5, { bc: 9 }, [['A', 'M', '2'], ['M', 'B', '4'], ['B', 'C', '9'], ['M', 'N', 'x', true, 0.8]]),
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Dùng hệ quả của định lí Thalès: $\\frac{AM}{AB} = \\frac{MN}{BC}$ (mẫu số là **cả cạnh**).', '$AB = 2 + 4 = 6$, nên $\\frac{2}{6} = \\frac{x}{9}$.'],
        loiGiai: ['$AB = AM + MB = 6$. Vì $MN \\parallel BC$: $\\frac{AM}{AB} = \\frac{MN}{BC}$', '$\\frac{2}{6} = \\frac{x}{9}$', '$x = \\frac{2 \\cdot 9}{6} = 3$'],
        loiThuongGap: [{ gt: 4.5, giaiThich: 'Em dùng $\\frac{AM}{MB} = \\frac{MN}{BC}$. Với cạnh song song $MN$, phải so với **cả cạnh** $AB = 6$.' }] }
    ],
    timLoi: [
      { de: 'Cho tam giác $ABC$ có $MN \\parallel BC$, $AM = 2$, $MB = 4$, $AN = 3$. Bạn Nam tính $AC$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Vì $MN \\parallel BC$ nên $\\frac{AM}{MB} = \\frac{AN}{AC}$', '$\\frac{2}{4} = \\frac{3}{AC}$', '$AC = \\frac{3 \\cdot 4}{2} = 6$'],
        dongSai: 0,
        giaiThich: 'Lập tỉ số **lệch đoạn**: vế trái là đoạn trên/đoạn dưới nhưng vế phải là đoạn trên/cả cạnh. Đúng ra $\\frac{AM}{MB} = \\frac{AN}{NC}$ cho $NC = 6$, rồi $AC = 3 + 6 = 9$.',
        sua: 'Vì $MN \\parallel BC$ nên $\\frac{AM}{AB} = \\frac{AN}{AC}$, tức $\\frac{2}{6} = \\frac{3}{AC}$, $AC = 9$.' },
      { de: 'Cho tam giác $ABC$, $M \\in AB$, $N \\in AC$ với $AM = 3$, $MB = 2$, $AN = 4$. Bạn Lan tính $NC$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Theo định lí Thalès: $\\frac{AM}{MB} = \\frac{AN}{NC}$', '$\\frac{3}{2} = \\frac{4}{NC}$', '$NC = \\frac{8}{3}$'],
        dongSai: 0,
        giaiThich: 'Đề **không cho** $MN \\parallel BC$, nên chưa được dùng định lí Thalès. Với dữ kiện này, $N$ có thể ở bất kì đâu trên $AC$: không tính được $NC$.',
        sua: 'Cần thêm giả thiết $MN \\parallel BC$ thì mới lập được $\\frac{AM}{MB} = \\frac{AN}{NC}$.' }
    ]
  });
})();
