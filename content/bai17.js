// Bài 17 – Tính chất đường phân giác của tam giác (SGK Toán 8 KNTT, Tập 1, tr. 84–86)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';

  // ---------- Tiện ích vẽ hình cố định cho đề bài (toạ độ dựng từ chính số liệu đề) ----------
  var hh = TOAN8.hh, hinh = TOAN8.hinhTinh, lerp = hh.lerp, tg = hh.tg;
  function geo(o) { return { widget: 'geo', config: hinh(o) }; }

  // Tam giác có phân giác: đỉnh vai A, hai đỉnh vai B, C, chân phân giác vai D trên BC.
  // ten: tên thật của 4 điểm [A, B, C, D]; ab, ac, bc: độ dài thật (đúng số liệu đề).
  function hinhPG(ten, ab, ac, bc, nhan, them) {
    var T = tg(bc, ac, ab), Dd = lerp(T.B, T.C, ab / (ab + ac));
    var diem = {}; diem[ten[0]] = T.A; diem[ten[1]] = T.B; diem[ten[2]] = T.C; diem[ten[3]] = Dd;
    var s = Math.max(bc, ab, ac);
    var o = { diem: diem, to: [ten[0], ten[1], ten[2]],
      canh: [[ten[0], ten[1]], [ten[0], ten[2]], [ten[1], ten[2]], [ten[0], ten[3], { mau: TIM, day: 3 }]],
      goc: [[ten[1], ten[0], ten[3], { mau: CAM, r: 0.11 * s }], [ten[3], ten[0], ten[2], { mau: XANH, r: 0.14 * s }]],
      nhan: nhan || [] };
    for (var k in them || {}) o[k] = them[k];
    return geo(o);
  }

  // ---------- Hình động ----------
  function fmt(v) { return (Math.round(v * 100) / 100).toString().replace('.', ','); }
  function chanPG(board, G, A, B, C) {
    var bis = board.create('bisector', [B, A, C], { visible: false });
    var BC = G.seg(B, C);
    return { BC: BC, D: G.inter(bis, BC, 'D') };
  }
  function danhDauGoc(board, A, B, C, D) {
    board.create('nonreflexangle', [B, A, D], { radius: 0.7, name: '', fillColor: CAM, strokeColor: CAM, fillOpacity: 0.3, fixed: true });
    board.create('nonreflexangle', [D, A, C], { radius: 0.9, name: '', fillColor: XANH, strokeColor: XANH, fillOpacity: 0.3, fixed: true });
  }

  var khamPhaBuild = function (board, G) {
    var A = G.pt('A', 2.5, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.05 });
    var r = chanPG(board, G, A, B, C), D = r.D;
    G.seg(A, D, { strokeColor: TIM, strokeWidth: 4 });
    danhDauGoc(board, A, B, C, D);
    G.label(-0.8, 7.9, function () { return 'DB = ' + fmt(G.len(D, B)); });
    G.label(2.4, 7.9, function () { return 'DC = ' + fmt(G.len(D, C)); });
    G.label(5.6, 7.9, function () { return 'DB/DC = ' + fmt(G.len(D, B) / G.len(D, C)); });
    G.label(-0.8, 7.1, function () { return 'AB = ' + fmt(G.len(A, B)); });
    G.label(2.4, 7.1, function () { return 'AC = ' + fmt(G.len(A, C)); });
    G.label(5.6, 7.1, function () { return 'AB/AC = ' + fmt(G.len(A, B) / G.len(A, C)); });
  };

  var tinhChatBuild = function (board, G) {
    var A = G.pt('A', 2.5, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8.5, 0);
    G.poly([A, B, C], { fillOpacity: 0.04, borders: { visible: false } });
    var r = chanPG(board, G, A, B, C), D = r.D;
    G.seg(A, B, { strokeColor: CAM, strokeWidth: 5 }); G.seg(D, B, { strokeColor: CAM, strokeWidth: 6 });
    G.seg(A, C, { strokeColor: XANH, strokeWidth: 5 }); G.seg(D, C, { strokeColor: XANH, strokeWidth: 6 });
    G.seg(A, D, { strokeColor: TIM, strokeWidth: 3, dash: 2 });
    danhDauGoc(board, A, B, C, D);
    G.label(-0.8, 7.5, function () { return 'DB/DC = ' + fmt(G.len(D, B) / G.len(D, C)); });
    G.label(4.6, 7.5, function () { return 'AB/AC = ' + fmt(G.len(A, B) / G.len(A, C)); });
  };

  // ---------- Hình đề bài ----------
  var D4 = ['A', 'B', 'C', 'D'];

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  // Phân giác: hai tam giác ABD, ACD chung đường cao từ A, và D cách đều hai cạnh AB, AC
  function pg(tuyChon, them) { return Object.assign({ ten: 'thalesPhanGiac', tuyChon: tuyChon || {} }, them || {}); }
  function hg(c, giai) {
    var cf = Object.assign({ chiXem: true, t: 1 }, c);
    if (giai) cf.thamSo = Object.assign({}, cf.thamSo, { trangThai: 'giai' });
    return { widget: 'canh', config: cf };
  }
  function soVN(x) { return String(Math.round(x * 1000) / 1000).replace('.', '{,}'); }

  TOAN8.bai({
    id: 17, ten: 'Tính chất đường phân giác của tam giác', sgk: { tap: 1, trang: 84 },
    nhin: {
      tieuDe: 'Hai mảnh tam giác, tính diện tích theo hai cách', loai: 'chungMinh',
      luuY: 'Lập luận chỉ dùng công thức diện tích tam giác và tính chất điểm trên tia phân giác cách đều hai cạnh của góc (lớp 7), nên đúng với mọi tam giác. Đổi hai cạnh và góc $A$ để thử.',
      canh: { ten: 'thalesPhanGiac', thuPha: true, moTa: 'Tam giác ABC, đường phân giác AD chia tam giác thành hai mảnh ABD màu cam và ACD màu xanh. Hai mảnh chung đường cao AH; D cách đều hai cạnh AB và AC.',
        dongSo: function (p, f) {
          var g = TOAN8.canh.lay('thalesPhanGiac').tinh(p, 1, {}), so = function (x) { return f(x).replace(',', '{,}'); };
          var tron = function (x) { return Math.abs(x * 100 - Math.round(x * 100)) > 1e-6 ? '\\approx' : '='; };
          return '$\\ca{DB} ' + tron(g.DB) + ' ' + so(g.DB) + '$, $\\cb{DC} ' + tron(g.DC) + ' ' + so(g.DC) + '$; $\\frac{\\ca{DB}}{\\cb{DC}} ' + tron(g.DB / g.DC) + ' ' + so(g.DB / g.DC) +
            '$ và $\\frac{\\ca{AB}}{\\cb{AC}} ' + tron(p.ab / p.ac) + ' ' + so(p.ab / p.ac) + '$.';
        } },
      buoc: [
        { t: 0, chu: '$AD$ chia đôi góc $A$, cắt tam giác thành hai mảnh: $\\ca{ABD}$ và $\\cb{ACD}$.' },
        { t: 0.1, chu: 'Hai mảnh có **chung đường cao** $AH$ kẻ từ $A$. Diện tích tỉ lệ với đáy: $S_{\\ca{ABD}} : S_{\\cb{ACD}} = \\ca{DB} : \\cb{DC}$.' },
        { t: 0.45, chu: 'Mặt khác, $D$ nằm trên tia phân giác nên cách đều hai cạnh: hai đoạn vuông góc xanh lá dài bằng nhau. Lấy $\\ca{AB}$, $\\cb{AC}$ làm đáy: $S_{\\ca{ABD}} : S_{\\cb{ACD}} = \\ca{AB} : \\cb{AC}$.' },
        { t: 0.85, chu: 'Cùng một tỉ số diện tích, tính hai cách, nên hai tỉ số bằng nhau.' }
      ],
      ketLuan: 'Đường phân giác chia cạnh đối diện theo tỉ số hai cạnh kề: $$\\frac{\\ca{DB}}{\\cb{DC}} = \\frac{\\ca{AB}}{\\cb{AC}}$$',
      dung: {
        tieuDe: 'Đoạn nào kề cạnh nào', tuBai: '17.1',
        canh: pg({ AB: 6, AC: 8, BC: 7, nhan: { AB: '6', AC: '8', DB: '3', DC: 'x' }, giai: { DC: '4' }, thu: { tu: 'D', den: 'C' } },
          { moTa: 'Tam giác ABC có AB bằng 6, AC bằng 8, phân giác AD, DB bằng 3, cần tìm DC.' }),
        loiThuongGap: [],
        moiThu: 'Gõ độ dài $DC$. Nếu sai, hình sẽ vẽ một đoạn đỏ dài đúng số em gõ, tính từ $D$.',
        soBatKi: function (v) {
          if (v <= 0) return { t: 0, loi: 'Độ dài phải lớn hơn $0$.' };
          var loi;
          if (v === 2.25) loi = 'Em ghép ngược. Đoạn đỏ $2{,}25$ ngắn hơn $DB = 3$, nhưng $DC$ kề cạnh dài hơn $AC = 8$ nên phải dài hơn $DB$.';
          else loi = 'Đoạn đỏ dài $' + soVN(v) + '$: tỉ số $\\frac{3}{' + soVN(v) + '}$ ' + (v > 4 ? 'nhỏ hơn' : 'lớn hơn') + ' $\\frac{AB}{AC} = \\frac{6}{8}$. Đoạn kề cạnh nào thì đi với cạnh đó.';
          return { thamSo: { thu: v }, t: 1, loi: loi };
        },
        dungChu: '$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{6}{8}$, nên $DC = \\frac{3 \\cdot 8}{6} = 4$. Đoạn đỏ trùng đúng $DC$.'
      },
      suyRa: {
        tieuDe: 'Tỉ số diện tích, phân giác góc khác, mảnh vườn: vẫn hai mảnh đó',
        baDe: [
          { tuBai: '17.9', canh: pg({ AB: 9, AC: 12, BC: 14, nhan: { AB: '9', AC: '12' } }, { ghiChu: 'BC = 14' }), tenNut: 'Kẻ đường cao',
            loiThuongGap: [],
            phanUng: [{ gt: '4/3', loi: 'Đảo ngược rồi. Tam giác $ABD$ (cam) có đáy $DB$, kề cạnh ngắn $AB = 9$.' }],
            dungChu: 'Hai mảnh chung đường cao $AH$, nên tỉ số diện tích bằng $\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{9}{12} = \\frac{3}{4}$.', saiChu: 'Hai mảnh chung đường cao từ $A$: tỉ số diện tích bằng tỉ số hai đáy $DB$, $DC$.' },
          { tuBai: '17.10', canh: pg({ ten: ['B', 'A', 'C', 'D'], AB: 12, AC: 8, BC: 12, nhan: { AB: '12', AC: '8' }, giai: { DB: '7,2' } }, { ghiChu: 'AC = 12. Phân giác của góc B.' }), tenNut: 'Kẻ đường cao',
            loiThuongGap: [],
            phanUng: [{ gt: 4.8, loi: '$4{,}8$ là $DC$. $DA$ kề cạnh dài hơn $BA = 12$ nên $DA$ dài hơn.' },
              { gt: 6, loi: '$D$ không phải trung điểm của $AC$, vì $BA \\ne BC$: mảnh cam to hơn mảnh xanh.' }],
            dungChu: '$\\frac{DA}{DC} = \\frac{BA}{BC} = \\frac{12}{8}$, tức $\\frac{DA}{12} = \\frac{DC}{8} = \\frac{12}{20}$, nên $AD = 7{,}2$.', saiChu: 'Phân giác góc $B$ chia cạnh đối diện $AC$. Đoạn $DA$ kề cạnh $BA$, đoạn $DC$ kề cạnh $BC$.' },
          { tuBai: '17.11', canh: pg({ AB: 30, AC: 45, BC: 40, nhan: { AB: '30 m', AC: '45 m' }, giai: { DB: '16 m' } }, { ghiChu: 'BC = 40 m. Lối đi AD là phân giác.' }), tenNut: 'Kẻ đường cao',
            loiThuongGap: [],
            phanUng: [{ gt: 24, loi: '$24$ m là $DC$. $DB$ kề cạnh ngắn $AB = 30$ m nên ngắn hơn.' },
              { gt: 20, loi: 'Lối đi không chia đôi $BC$ vì $AB \\ne AC$: mảnh cam nhỏ hơn mảnh xanh.' }],
            dungChu: '$\\frac{DB}{30} = \\frac{DC}{45} = \\frac{40}{75}$, nên $DB = 16$ m.', saiChu: '$DB : DC = 30 : 45$ và $DB + DC = 40$.' }
        ],
        cachNhan: 'Thấy đường phân giác của một góc: nó cắt tam giác thành hai mảnh chung đỉnh. Đoạn nào trên cạnh đối diện kề cạnh nào thì đi với cạnh đó.'
      }
    },
    khamPha: {
      nhiemVu: 'Đoạn tím $AD$ là **đường phân giác** của góc $A$: nó chia góc $A$ thành hai góc bằng nhau (cam và xanh), $D$ nằm trên cạnh $BC$.\n\nEm hãy **kéo các đỉnh** $A$, $B$, $C$ và so sánh hai tỉ số $\\frac{DB}{DC}$ và $\\frac{AB}{AC}$ ở cột bên phải.',
      widget: 'geo',
      config: { bbox: [-1, 8.4, 10, -0.8], build: khamPhaBuild },
      cauHoi: {
        de: 'Khi $AD$ là phân giác của góc $A$, em thấy hai tỉ số $\\frac{DB}{DC}$ và $\\frac{AB}{AC}$ thế nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Luôn bằng nhau', '$\\frac{DB}{DC}$ luôn bằng $\\frac{AC}{AB}$', 'Không có quy luật gì'] },
        goiY: ['Kéo $A$ sang trái, sang phải rồi so hai số ở cột bên phải.'],
        loiGiai: ['Hai tỉ số luôn bằng nhau: $\\frac{DB}{DC} = \\frac{AB}{AC}$. Đó là **tính chất đường phân giác** của tam giác.']
      }
    },
    mucTieu: [
      'Giải thích được vì sao $\\frac{DB}{DC} = \\frac{AB}{AC}$ bằng cách tính diện tích hai mảnh tam giác theo hai cách.',
      'Lập đúng tỉ lệ thức: đoạn nào trên $BC$ kề cạnh nào thì đi với cạnh đó.',
      'Tính $DB$, $DC$ khi biết ba cạnh của tam giác.',
      'Biết chiều đảo: nếu $D$ chia $BC$ theo tỉ số $\\frac{AB}{AC}$ thì $AD$ là đường phân giác.'
    ],
    lyThuyet: [
      { loai: 'dinhLi', tieuDe: 'Tính chất đường phân giác của tam giác',
        noiDung: 'Trong tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng **tỉ lệ với hai cạnh kề** hai đoạn ấy.\n\n**GT:** $\\triangle ABC$, $AD$ là đường phân giác của góc $BAC$ ($D \\in BC$).\n\n**KL:** $$\\frac{\\ca{DB}}{\\cb{DC}} = \\frac{\\ca{AB}}{\\cb{AC}}.$$' },
      { loai: 'lapCM', tieuDe: 'Lắp chứng minh: vì sao $\\frac{DB}{DC} = \\frac{AB}{AC}$?', config: {
        de: 'Tam giác $ABC$, $AD$ là phân giác của góc $A$. Kẻ đường cao $AH$, và từ $D$ kẻ $DE \\perp AB$, $DF \\perp AC$ ($E \\in AB$, $F \\in AC$). Xếp các bước theo đúng thứ tự lập luận.',
        canh: { ten: 'thalesPhanGiac' },
        buoc: [
          { id: 'gt', chu: '$AD$ là phân giác của góc $A$, $D \\in BC$. Kẻ $AH \\perp BC$, $DE \\perp AB$, $DF \\perp AC$.', canh: { t: 0 } },
          { id: 'dt', chu: 'Diện tích tam giác bằng nửa tích một cạnh với đường cao ứng với cạnh đó.', canh: { t: 0 } },
          { id: 'cao', chu: 'Hai tam giác $ABD$, $ACD$ chung đường cao $AH$: $\\frac{S_{ABD}}{S_{ACD}} = \\frac{\\frac{1}{2} AH \\cdot DB}{\\frac{1}{2} AH \\cdot DC} = \\frac{DB}{DC}$.', can: ['gt', 'dt'], canh: { t: 0.4 } },
          { id: 'cach', chu: '$D$ nằm trên tia phân giác của góc $A$ nên cách đều hai cạnh của góc: $DE = DF$.', can: ['gt'], canh: { t: 0.75 } },
          { id: 'day', chu: 'Lấy $AB$, $AC$ làm đáy: $\\frac{S_{ABD}}{S_{ACD}} = \\frac{\\frac{1}{2} DE \\cdot AB}{\\frac{1}{2} DF \\cdot AC} = \\frac{AB}{AC}$.', can: ['cach', 'dt'], canh: { t: 0.75 } },
          { id: 'kl', chu: 'Cùng một tỉ số diện tích, tính hai cách, nên $\\frac{DB}{DC} = \\frac{AB}{AC}$.', can: ['cao', 'day'], canh: { t: 1 } }
        ],
        ketLuan: 'Đường phân giác $AD$ chia $BC$ thành hai đoạn tỉ lệ với hai cạnh kề: $\\frac{DB}{DC} = \\frac{AB}{AC}$.'
      } },
      { loai: 'hinh', widget: 'geo', config: { bbox: [-1, 8, 10, -0.8], build: tinhChatBuild },
        chuThich: 'Đoạn $DB$ nằm **kề** cạnh $AB$ (cùng màu cam); đoạn $DC$ kề cạnh $AC$ (cùng màu xanh). Kéo các đỉnh: hai tỉ số luôn bằng nhau.' },
      { loai: 'chuY', noiDung: '**Cách nhớ:** đoạn nào trên $BC$ chạm đỉnh $B$ thì đi với cạnh $AB$; đoạn chạm đỉnh $C$ đi với cạnh $AC$:\n\n$$\\frac{D\\ca{B}}{D\\cb{C}} = \\frac{A\\ca{B}}{A\\cb{C}}.$$\n\n**Hay nhầm:** viết ngược thành $\\frac{DB}{DC} = \\frac{AC}{AB}$ là **sai**.' },
      { loai: 'text', tieuDe: 'Tính DB, DC khi biết BC',
        noiDung: 'Vì $D$ nằm giữa $B$ và $C$ nên $DB + DC = BC$. Từ $\\frac{DB}{AB} = \\frac{DC}{AC}$, dùng tính chất dãy tỉ số bằng nhau:\n\n$$\\frac{DB}{AB} = \\frac{DC}{AC} = \\frac{DB + DC}{AB + AC} = \\frac{BC}{AB + AC}.$$' },
      { loai: 'chuY', noiDung: '**Chú ý (đảo lại):** trong tam giác $ABC$, nếu $D$ thuộc đoạn $BC$ và $\\frac{DB}{DC} = \\frac{AB}{AC}$ thì $AD$ là đường phân giác của góc $A$.\n\n**Em có biết?** Đường phân giác **ngoài** tại $A$ (cắt đường thẳng $BC$ tại $D\'$, khi $AB \\ne AC$) cũng có tính chất $\\frac{D\'B}{D\'C} = \\frac{AB}{AC}$.' }
    ],
    viDu: [
      { de: 'Cho tam giác $ABC$ có $AB = 6$ cm, $AC = 9$ cm, $AD$ là phân giác của góc $A$ ($D \\in BC$) và $DB = 4$ cm. Tính $DC$.', canh: pg({ AB: 6, AC: 9, BC: 10, nhan: { AB: '6', AC: '9', DB: '4', DC: '?' }, giai: { DC: '6' } }), buoc: [
        { canh: { t: 1 }, lam: '$\\frac{DB}{DC} = \\frac{AB}{AC}$', vi: 'Tính chất đường phân giác: $DB$ kề $AB$ (cùng màu cam), $DC$ kề $AC$ (cùng màu xanh).' },
        { canh: { t: 1 }, lam: '$\\frac{4}{DC} = \\frac{6}{9}$', vi: 'Thay số.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: '$DC = \\frac{4 \\cdot 9}{6} = 6$ (cm)', vi: 'Nhân chéo rồi chia.' } ] },
      { de: 'Cho tam giác $ABC$ có $AB = 5$ cm, $AC = 7$ cm, $BC = 6$ cm, $AD$ là phân giác của góc $A$. Tính $DB$ và $DC$.', canh: pg({ AB: 5, AC: 7, BC: 6, nhan: { AB: '5', AC: '7', DB: '?', DC: '?' }, giai: { DB: '2,5', DC: '3,5' } }, { ghiChu: 'BC = 6' }), buoc: [
        { canh: { t: 1 }, lam: '$\\frac{DB}{AB} = \\frac{DC}{AC}$, tức $\\frac{DB}{5} = \\frac{DC}{7}$', vi: 'Viết lại tính chất phân giác.' },
        { canh: { t: 1 }, lam: '$\\frac{DB}{5} = \\frac{DC}{7} = \\frac{DB + DC}{5 + 7} = \\frac{6}{12} = \\frac{1}{2}$', vi: 'Dãy tỉ số bằng nhau, và $DB + DC = BC = 6$.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: '$DB = \\frac{5}{2} = 2{,}5$ (cm); $DC = \\frac{7}{2} = 3{,}5$ (cm)', vi: 'Kiểm tra: $2{,}5 + 3{,}5 = 6$. Đúng!' } ] }
    ],
    viDuMo: [
      { de: 'Cho tam giác $ABC$ có $AB = 8$ cm, $AC = 12$ cm, $BC = 10$ cm, $AD$ là phân giác của góc $A$. Tính $DB$ và $DC$.', buoc: [
        { lam: '$\\frac{DB}{8} = \\frac{DC}{12} = \\frac{DB + DC}{8 + 12} = \\frac{10}{20} = \\frac{1}{2}$', vi: 'Tính chất phân giác và dãy tỉ số bằng nhau.' },
        { lam: '$DB = \\frac{8}{2} = 4$ (cm)', vi: 'Em hãy tính $DB$:', an: true, dapAn: { kieu: 'so', gt: 4 },
          loiThuongGap: [{ gt: 6, giaiThich: '$6$ là $DC$ (đi với $AC = 12$). $DB$ kề cạnh $AB = 8$.' }, { gt: 5, giaiThich: '$D$ không phải trung điểm $BC$ (vì $AB \\ne AC$).' }] },
        { lam: '$DC = BC - DB = 10 - 4 = 6$ (cm)', vi: 'Còn $DC$ thì sao?', an: true, dapAn: { kieu: 'so', gt: 6 } } ] }
    ],
    baiTap: [
      { id: '17.1', muc: 1, de: 'Trong hình, $AD$ là phân giác của góc $A$, $AB = 6$, $AC = 8$, $DB = 3$. Tính $x = DC$.',
        hinh: hinhPG(D4, 6, 8, 7, [['A', 'B', '6'], ['A', 'C', '8'], ['B', 'D', '3'], ['D', 'C', 'x']]),
        dapAn: { kieu: 'so', gt: 4 },
        goiY: ['Tính chất phân giác: $\\frac{DB}{DC} = \\frac{AB}{AC}$.', '$\\frac{3}{x} = \\frac{6}{8}$, nhân chéo.'],
        loiGiai: ['$\\frac{DB}{DC} = \\frac{AB}{AC}$, tức $\\frac{3}{x} = \\frac{6}{8}$', '$x = \\frac{3 \\cdot 8}{6} = 4$'],
        loiThuongGap: [{ gt: 2.25, giaiThich: 'Em ghép ngược ($\\frac{DB}{DC} = \\frac{AC}{AB}$). $DB$ kề $AB$ nên $\\frac{DB}{DC} = \\frac{AB}{AC}$.' }] },
      { id: '17.2', muc: 1, de: 'Trong hình, $AD$ là phân giác của góc $A$, $AB = 9$, $AC = 15$. Tìm tỉ số $\\frac{DB}{DC}$ (viết dạng phân số, ví dụ 3/4).',
        hinh: hinhPG(D4, 9, 15, 12, [['A', 'B', '9'], ['A', 'C', '15']]),
        dapAn: { kieu: 'so', gt: '3/5' },
        goiY: ['$\\frac{DB}{DC} = \\frac{AB}{AC}$.', 'Rút gọn $\\frac{9}{15}$.'],
        loiGiai: ['$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{9}{15}$', '$= \\frac{3}{5}$'],
        loiThuongGap: [{ gt: '5/3', giaiThich: 'Đảo ngược rồi: $DB$ đi với $AB = 9$, $DC$ đi với $AC = 15$.' }] },
      { id: '17.3', muc: 1, de: 'Trong hình, $MI$ là phân giác của góc $M$, $MN = 15$, $MP = 20$, $NI = 6$. Tính $x = IP$.',
        hinh: hinhPG(['M', 'N', 'P', 'I'], 15, 20, 14, [['M', 'N', '15'], ['M', 'P', '20'], ['N', 'I', '6'], ['I', 'P', 'x']]),
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Trong $\\triangle MNP$, phân giác $MI$: $\\frac{IN}{IP} = \\frac{MN}{MP}$.', '$\\frac{6}{x} = \\frac{15}{20}$.'],
        loiGiai: ['$\\frac{IN}{IP} = \\frac{MN}{MP}$, tức $\\frac{6}{x} = \\frac{15}{20}$', '$x = \\frac{6 \\cdot 20}{15} = 8$'],
        loiThuongGap: [{ gt: 4.5, giaiThich: 'Em ghép ngược. $IN$ kề cạnh $MN$, $IP$ kề cạnh $MP$: $\\frac{IN}{IP} = \\frac{MN}{MP}$.' }] },
      { id: '17.4', hinhGiai: hg(pg({ AB: 4, AC: 6, BC: 5, nhan: { AB: '4', AC: '6' } }, { ghiChu: 'Hình vẽ với BC = 5 cm. DB kề cạnh ngắn AB nên DB ngắn hơn DC.' })), muc: 1, de: 'Tam giác $ABC$ có $AB = 4$ cm, $AC = 6$ cm, $AD$ là phân giác của góc $A$. Khẳng định "$\\frac{DB}{DC} = \\frac{6}{4}$" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['$\\frac{DB}{DC} = \\frac{AB}{AC}$: cạnh nào ở trên?', '$AB = 4$ ở trên, $AC = 6$ ở dưới.'],
        loiGiai: ['$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{4}{6} = \\frac{2}{3}$, không phải $\\frac{6}{4}$.', 'Khẳng định **sai** (bị đảo ngược tỉ số).'] },
      { id: '17.5', muc: 2, de: 'Trong hình, $AD$ là phân giác của góc $A$, $AB = 6$ cm, $AC = 9$ cm, $BC = 10$ cm. Tính $DB$ và $DC$ (cm).',
        hinh: hinhPG(D4, 6, 9, 10, [['A', 'B', '6'], ['A', 'C', '9']]),
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'so', gt: 4, nhan: '$DB =$', loiThuongGap: [{ gt: 5, giaiThich: '$D$ không phải trung điểm $BC$ vì $AB \\ne AC$. Dùng $\\frac{DB}{6} = \\frac{DC}{9} = \\frac{10}{15}$.' }, { gt: 6, giaiThich: '$6$ là $DC$. $DB$ kề cạnh ngắn $AB = 6$ nên ngắn hơn.' }] },
          { kieu: 'so', gt: 6, nhan: '$DC =$', loiThuongGap: [{ gt: 9, giaiThich: 'Tỉ số bằng nhau chứ độ dài không bằng $AC$. Nhớ $DB + DC = BC = 10$.' }] }] },
        goiY: ['$\\frac{DB}{AB} = \\frac{DC}{AC} = \\frac{DB + DC}{AB + AC}$ và $DB + DC = BC$.', '$\\frac{DB}{6} = \\frac{DC}{9} = \\frac{10}{15} = \\frac{2}{3}$.'],
        loiGiai: ['$\\frac{DB}{6} = \\frac{DC}{9} = \\frac{DB + DC}{6 + 9} = \\frac{10}{15} = \\frac{2}{3}$', '$DB = 6 \\cdot \\frac{2}{3} = 4$ (cm); $DC = 9 \\cdot \\frac{2}{3} = 6$ (cm).'] },
      { id: '17.6', muc: 2, de: 'Trong hình, $AD$ là phân giác của góc $A$, $AB = 10$, $DB = 4$, $DC = 6$. Tính $x = AC$.',
        hinh: hinhPG(D4, 10, 15, 10, [['A', 'B', '10'], ['A', 'C', 'x'], ['B', 'D', '4'], ['D', 'C', '6']]),
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['$\\frac{DB}{DC} = \\frac{AB}{AC}$.', '$\\frac{4}{6} = \\frac{10}{x}$.'],
        loiGiai: ['$\\frac{DB}{DC} = \\frac{AB}{AC}$, tức $\\frac{4}{6} = \\frac{10}{x}$', '$x = \\frac{10 \\cdot 6}{4} = 15$'],
        loiThuongGap: [{ gt: '20/3', giaiThich: 'Em ghép ngược ($\\frac{DB}{DC} = \\frac{AC}{AB}$). $DC$ kề $AC$ nên $AC$ phải lớn hơn $AB$ như $DC > DB$.' }] },
      { id: '17.7', muc: 2, de: 'Tam giác $ABC$ có $AB = 3$ cm, $AC = 5$ cm, $BC = 4$ cm. Đường phân giác của góc $A$ cắt $BC$ tại $D$. Tính $DC$ (cm).',
        hinh: hinhPG(D4, 3, 5, 4, [['A', 'B', '3'], ['A', 'C', '5']]),
        dapAn: { kieu: 'so', gt: 2.5 },
        goiY: ['$\\frac{DB}{3} = \\frac{DC}{5} = \\frac{DB + DC}{3 + 5}$.', '$DB + DC = BC = 4$, nên mỗi tỉ số bằng $\\frac{4}{8} = \\frac{1}{2}$.'],
        loiGiai: ['$\\frac{DB}{3} = \\frac{DC}{5} = \\frac{4}{8} = \\frac{1}{2}$', '$DC = 5 \\cdot \\frac{1}{2} = 2{,}5$'],
        loiThuongGap: [{ gt: 1.5, giaiThich: '$1{,}5$ là $DB$. Đề hỏi $DC$ (kề cạnh $AC = 5$).' }, { gt: 2, giaiThich: '$D$ không phải trung điểm $BC$ vì $AB \\ne AC$.' }] },
      { id: '17.8', muc: 2, de: 'Trong hình, $PH$ là phân giác của góc $P$ trong tam giác $MNP$, $MH = 2$, $HN = 4$, $MP = 3$. Tính $x = NP$.',
        hinh: hinhPG(['P', 'M', 'N', 'H'], 3, 6, 6, [['P', 'M', '3'], ['P', 'N', 'x'], ['M', 'H', '2'], ['H', 'N', '4']]),
        dapAn: { kieu: 'so', gt: 6 },
        goiY: ['Phân giác $PH$: $\\frac{HM}{HN} = \\frac{PM}{PN}$.', '$\\frac{2}{4} = \\frac{3}{x}$.'],
        loiGiai: ['$\\frac{HM}{HN} = \\frac{PM}{PN}$, tức $\\frac{2}{4} = \\frac{3}{x}$', '$x = \\frac{3 \\cdot 4}{2} = 6$'],
        loiThuongGap: [{ gt: 1.5, giaiThich: 'Em ghép ngược. $HM$ kề $PM$, $HN$ kề $PN$.' }] },
      { id: '17.9', muc: 3, de: 'Tam giác $ABC$ có $AB = 9$ cm, $AC = 12$ cm, $BC = 14$ cm, $AD$ là phân giác của góc $A$. Tính tỉ số diện tích $\\frac{S_{ABD}}{S_{ACD}}$.',
        hinh: hinhPG(D4, 9, 12, 14, [['A', 'B', '9'], ['A', 'C', '12']]),
        dapAn: { kieu: 'so', gt: '3/4' },
        goiY: ['Hai tam giác $ABD$ và $ACD$ có **chung đường cao** kẻ từ $A$ xuống $BC$, nên tỉ số diện tích bằng $\\frac{DB}{DC}$.', '$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{9}{12}$.'],
        loiGiai: ['Hai tam giác chung đường cao từ $A$ nên $\\frac{S_{ABD}}{S_{ACD}} = \\frac{DB}{DC}$.', '$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{9}{12} = \\frac{3}{4}$'],
        loiThuongGap: [{ gt: '4/3', giaiThich: 'Đảo ngược rồi: tam giác $ABD$ chứa đoạn $DB$ (đi với $AB = 9$).' }] },
      { id: '17.10', muc: 3, de: 'Tam giác $ABC$ cân tại $A$ có $AB = AC = 12$ cm, $BC = 8$ cm. Đường phân giác của góc $B$ cắt $AC$ tại $D$. Tính $AD$ (cm).',
        hinh: hinhPG(['B', 'A', 'C', 'D'], 12, 8, 12, [['B', 'A', '12'], ['B', 'C', '8'], ['A', 'C', '12', false, 1.6]]),
        dapAn: { kieu: 'so', gt: '36/5' },
        goiY: ['Phân giác góc $B$ chia cạnh đối diện $AC$: $\\frac{DA}{DC} = \\frac{BA}{BC}$.', '$\\frac{DA}{12} = \\frac{DC}{8} = \\frac{DA + DC}{20} = \\frac{12}{20}$.'],
        loiGiai: ['$\\frac{DA}{DC} = \\frac{BA}{BC}$ nên $\\frac{DA}{12} = \\frac{DC}{8} = \\frac{DA + DC}{12 + 8} = \\frac{12}{20} = \\frac{3}{5}$', '$AD = 12 \\cdot \\frac{3}{5} = 7{,}2$'],
        loiThuongGap: [{ gt: 4.8, giaiThich: '$4{,}8$ là $DC$. $DA$ kề cạnh $BA = 12$ (dài hơn) nên $DA$ dài hơn.' }, { gt: 6, giaiThich: '$D$ không phải trung điểm của $AC$ vì $BA \\ne BC$.' }] },
      { id: '17.11', muc: 3, de: 'Mảnh vườn hình tam giác $ABC$ có $AB = 30$ m, $AC = 45$ m, $BC = 40$ m. Bác Ba làm lối đi $AD$ theo đường phân giác của góc $A$ ($D \\in BC$). Tính $DB$ (m).',
        hinh: hinhPG(D4, 30, 45, 40, [['A', 'B', '30 m'], ['A', 'C', '45 m']]),
        dapAn: { kieu: 'so', gt: 16 },
        goiY: ['$\\frac{DB}{AB} = \\frac{DC}{AC} = \\frac{BC}{AB + AC}$.', '$\\frac{DB}{30} = \\frac{40}{75}$.'],
        loiGiai: ['$\\frac{DB}{30} = \\frac{DC}{45} = \\frac{DB + DC}{30 + 45} = \\frac{40}{75}$', '$DB = \\frac{30 \\cdot 40}{75} = 16$ (m)'],
        loiThuongGap: [{ gt: 24, giaiThich: '$24$ m là $DC$. $DB$ kề cạnh ngắn $AB = 30$ m.' }, { gt: 20, giaiThich: 'Phân giác không chia đôi cạnh $BC$ (vì $AB \\ne AC$).' }] }
    ],
    timLoi: [
      { de: 'Tam giác $ABC$ có $AB = 4$, $AC = 6$, $BC = 5$, $AD$ là phân giác của góc $A$. Bạn Minh tính $DB$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{DB}{DC} = \\frac{AC}{AB}$, nên $\\frac{DB}{6} = \\frac{DC}{4}$', '$\\frac{DB}{6} = \\frac{DC}{4} = \\frac{5}{10} = \\frac{1}{2}$', '$DB = 3$'],
        dongSai: 0,
        giaiThich: 'Đảo ngược tỉ số. $DB$ kề cạnh $AB$ nên $\\frac{DB}{DC} = \\frac{AB}{AC}$, tức $\\frac{DB}{4} = \\frac{DC}{6}$. Kết quả đúng: $DB = 2$, $DC = 3$.',
        sua: '$\\frac{DB}{DC} = \\frac{AB}{AC}$, nên $\\frac{DB}{4} = \\frac{DC}{6} = \\frac{5}{10}$, $DB = 2$.' },
      { de: 'Tam giác $ABC$ có $AB = 6$ cm, $AC = 9$ cm, $BC = 10$ cm, $AD$ là phân giác của góc $A$. Bạn Hoa tính $DB$, $DC$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{6}{9}$', 'Nên $DB = 6$ cm và $DC = 9$ cm'],
        dongSai: 1,
        giaiThich: 'Hai tỉ số bằng nhau không có nghĩa là $DB = AB$, $DC = AC$. Kiểm tra: $6 + 9 = 15 \\ne 10 = BC$. Phải dùng $DB + DC = BC$: $\\frac{DB}{6} = \\frac{DC}{9} = \\frac{10}{15}$, nên $DB = 4$, $DC = 6$.',
        sua: '$\\frac{DB}{6} = \\frac{DC}{9} = \\frac{DB + DC}{15} = \\frac{10}{15}$, nên $DB = 4$ cm, $DC = 6$ cm.' }
    ]
  });
})();
