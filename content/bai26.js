// Bài 26 – Giải bài toán bằng cách lập phương trình (SGK Toán 8 KNTT, Tập 2, tr. 33–36; Luyện tập chung tr. 37–39)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  // ---------- Hình động: ô tô đuổi theo xe máy (1 đơn vị trên hình = 20 km) ----------
  // Xe máy đi lúc 7 giờ với 40 km/h; 1 giờ sau ô tô đi cùng chỗ với 60 km/h.
  var duoiBuild = function (board, G) {
    var T = window.TOAN8, env = { t: 0 }, f = T.fmtSo;
    function sXe() { return 40 * env.t; }
    function sOto() { return env.t <= 1 ? 0 : 60 * (env.t - 1); }
    var kip = function () { return env.t > 1 && Math.abs(sXe() - sOto()) < 1e-9; };
    board.create('segment', [[0, 0], [10.6, 0]], { strokeColor: '#adb5bd', strokeWidth: 10, fixed: true, highlight: false });
    for (var k = 0; k <= 10; k += 2) {
      board.create('segment', [[k, -0.25], [k, 0.25]], { strokeColor: '#495057', strokeWidth: 2, fixed: true, highlight: false });
      G.label(k, -0.7, String(k * 20) + ' km', { anchorX: 'middle', fontSize: 13, strokeColor: '#495057' });
    }
    G.label(0, 1.9, 'Điểm xuất phát', { anchorX: 'middle', fontSize: 13, strokeColor: '#495057' });
    var X = board.create('point', [function () { return sXe() / 20; }, 0.9], { name: 'Xe máy', size: 7, color: XANH, fixed: true, showInfobox: false,
      label: { fontSize: 15, offset: [-20, 18], strokeColor: XANH, cssStyle: 'font-weight:700' } });
    var O = board.create('point', [function () { return sOto() / 20; }, -1.6], { name: 'Ô tô', size: 7, color: CAM, fixed: true, showInfobox: false,
      label: { fontSize: 15, offset: [-14, -20], strokeColor: CAM, cssStyle: 'font-weight:700' } });
    board.create('segment', [[0, 0.9], X], { strokeColor: XANH, strokeWidth: 3, fixed: true, highlight: false });
    board.create('segment', [[0, -1.6], O], { strokeColor: CAM, strokeWidth: 3, fixed: true, highlight: false });
    G.label(0, 4.1, function () {
      var gio = 7 + env.t, h = Math.floor(gio), m = Math.round((gio - h) * 60);
      return 'Đồng hồ: ' + h + ' giờ ' + (m ? m + ' phút' : '');
    }, { fontSize: 17, cssStyle: 'font-weight:700' });
    G.label(0, 3.3, function () { return 'Xe máy đã đi: 40 · ' + f(env.t) + ' = ' + f(sXe()) + ' km'; }, { fontSize: 15, strokeColor: XANH });
    G.label(0, 2.6, function () {
      return env.t <= 1 ? 'Ô tô: chưa xuất phát' : 'Ô tô đã đi: 60 · ' + f(env.t - 1) + ' = ' + f(sOto()) + ' km';
    }, { fontSize: 15, strokeColor: CAM });
    G.label(6.2, 4.1, function () { return kip() ? 'Ô tô đuổi kịp xe máy!' : ''; }, { fontSize: 17, strokeColor: LA, cssStyle: 'font-weight:700' });
    board.containerObj.parentNode.appendChild(T.makeSliders([{ ten: 't', nhan: 'Thời gian kể từ lúc xe máy đi (giờ)', min: 0, max: 4.5, buoc: 0.25, gt: 0 }],
      env, function () { board.update(); }));
  };

  // Hình chữ nhật cho bài chu vi (chiều dài 15, chiều rộng 10 – thu nhỏ để vẽ)
  var hinhVuon = TOAN8.hinhGeo({
    diem: { A: [0, 4], B: [6, 4], C: [6, 0], D: [0, 0] }, to: ['A', 'B', 'C', 'D'],
    canh: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']],
    nhan: [['A', 'B', 'x (m)'], ['B', 'C', 'x − 5 (m)']]
  });

  // Cấu hình hình cho "Nhìn là hiểu": sơ đồ đoạn. Mỗi vế của phương trình là một đoạn; thay đúng nghiệm thì hai đoạn dài bằng nhau.
  // m(hệ số của x, số, nhãn, bỏ?) là một mảnh của đoạn
  function m(x, so, nhan, bo) { return { x: x, so: so, nhan: nhan, bo: bo }; }
  function doan(tenTren, tren, tenDuoi, duoi, them) {
    var c = Object.assign({}, them);
    c.ten = 'soDoDoan';
    c.tuyChon = Object.assign({ tenTren: tenTren, tren: tren, tenDuoi: tenDuoi, duoi: duoi }, them && them.tuyChon);
    return c;
  }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  var CHU_VI = doan('Bốn cạnh: dài + rộng + dài + rộng', [m(1, 0, 'x'), m(1, -5, 'x − 5'), m(1, 0, 'x'), m(1, -5, 'x − 5')], 'Chu vi', [m(0, 50, '50 m')],
    { moTa: 'Đoạn trên gồm bốn cạnh của mảnh vườn, đoạn dưới là chu vi 50 mét.' });

  TOAN8.bai({
    id: 26, ten: 'Giải bài toán bằng cách lập phương trình', sgk: { tap: 2, trang: 33 },

    nhin: {
      tieuDe: 'Đề bài thành hai đoạn dài bằng nhau', loai: 'minhHoa',
      luuY: 'Sơ đồ giúp đọc ra phương trình. Đáp số chắc chắn đến từ việc giải phương trình rồi thử lại với đề, không phải từ việc đo hình.',
      canh: doan('Ô tô đi (km)', [m(60, 0, '60x')], 'Xe máy đi (km)', [m(0, 40, '40'), m(40, 0, '40x')], {
        tuyChon: { donVi: ' giờ', hienX: true, ghi: '60x = 40 + 40x', buoc: [
          { tren: [m(40, 0, '40x'), m(20, 0, '20x')], duoi: [m(40, 0, '40x'), m(0, 40, '40')], ghi: '40x + 20x = 40x + 40' },
          { tren: [m(40, 0, '40x', true), m(20, 0, '20x')], duoi: [m(40, 0, '40x', true), m(0, 40, '40')], ghi: 'Bỏ phần 40x ở cả hai đoạn' },
          { tren: [m(20, 0, '20x')], duoi: [m(0, 40, '40')], ghi: '20x = 40' }] },
        giay: 14, moTa: 'Hai đoạn thẳng: quãng đường ô tô đi và quãng đường xe máy đi, dài bằng nhau lúc đuổi kịp.' }),
      buoc: [
        { t: 0, chu: 'Gọi $x$ là số giờ ô tô đi. Đoạn trên: ô tô đi $\\ca{60x}$ km. Đoạn dưới: xe máy đi trước $1$ giờ được $\\cb{40}$ km, rồi đi thêm $\\ca{40x}$ km.' },
        { t: 0.25, chu: 'Lúc đuổi kịp, hai xe ở cùng một chỗ, nên **hai đoạn dài bằng nhau**. Tách $60x$ thành $40x + 20x$.' },
        { t: 0.5, chu: 'Hai đoạn có chung phần $40x$. Bỏ phần chung ở **cả hai** đoạn, hai đoạn vẫn bằng nhau.' },
        { t: 0.75, chu: 'Còn lại $20x = 40$, nên $x = 2$: ô tô đi $2$ giờ, đuổi kịp lúc $10$ giờ.' }
      ],
      ketLuan: 'Vẽ hai đoạn cùng chỉ một đại lượng, đoạn này bằng đoạn kia: đó chính là phương trình $$\\ca{60x} = \\cb{40} + \\ca{40x}$$',
      dung: {
        tieuDe: 'Chiều dài bao nhiêu thì bốn cạnh vừa đủ 50 m?', tuBai: '26.6',
        canh: Object.assign({ t: 1 }, CHU_VI),
        moiThu: 'Gõ chiều dài. Hình sẽ vẽ bốn cạnh theo đúng số em gõ, rồi so với đoạn $50$ m.',
        phanUng: [
          { gt: 27.5, thamSo: { thu: 27.5 }, loi: 'Em đã lấy $50$ làm **nửa** chu vi. Nhìn hình: bốn cạnh dài gấp đôi đoạn $50$ m.' },
          { gt: 10, thamSo: { thu: 10 }, loi: '$10$ m là chiều **rộng**. Nếu chiều dài là $10$ m thì bốn cạnh chỉ dài $30$ m.' }
        ],
        soBatKi: function (v) {
          var so = function (n) { return String(Math.round(n * 1000) / 1000).replace('.', '{,}'); };
          if (v <= 5) return { thamSo: { thu: v }, loi: 'Chiều rộng là $x - 5$, nên chiều dài phải lớn hơn $5$ m.' };
          return { thamSo: { thu: v }, loi: 'Chiều dài $' + so(v) + '$ m thì chiều rộng $' + so(v - 5) + '$ m, bốn cạnh dài $' + so(4 * v - 10) + '$ m, ' + (4 * v - 10 > 50 ? 'dài hơn' : 'ngắn hơn') + ' đoạn $50$ m.' };
        },
        dungChu: '$2(15 + 10) = 50$: bốn cạnh vừa đúng bằng đoạn $50$ m.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là hai đoạn bằng nhau',
        baDe: [
          { tuBai: '26.4', canh: doan('Lương 12 tháng + thưởng Tết', [m(12, 0, '12x'), m(3, 0, '3x')], 'Thu nhập cả năm', [m(0, 225, '225')]), tenNut: 'Vẽ sơ đồ',
            phanUng: [{ gt: 18.75, thamSo: { thu: 18.75 }, loi: 'Em mới chia cho $12$. Thưởng Tết còn $3$ tháng lương nữa: đoạn trên là $12x + 3x = 15x$.' }],
            dungChu: '$12x + 3x = 15x = 225$, nên $x = 15$.', saiChu: 'Đoạn trên có $12$ phần lương và $3$ phần thưởng, tất cả bằng $225$.' },
          { tuBai: '26.8', canh: doan('Bình đi (km)', [m(16, 0, '16x')], 'An đi (km)', [m(0, 4, '4'), m(12, 0, '12x')]), tenNut: 'Vẽ sơ đồ',
            phanUng: [{ gt: 1, loi: '$x = 1$ giờ là đúng rồi, nhưng đề hỏi số **phút**.' }, { gt: 80, thamSo: { thu: 4 / 3 }, loi: '$80$ phút là thời gian **An** đi. Bình đi sau An $20$ phút.' }],
            dungChu: '$16x = 4 + 12x$, nên $4x = 4$, $x = 1$ giờ, tức $60$ phút.', saiChu: 'An đi trước $20$ phút $= \\frac{1}{3}$ giờ, được $4$ km. Lúc đuổi kịp, hai đoạn bằng nhau.' },
          { tuBai: '26.7', canh: doan('Giá ban đầu x', [m(0.75, 0, '0,75x'), m(0.25, 0, '25%', true)], 'Giá bán + phần đã giảm', [m(0, 450, '450'), m(0.25, 0, '25%', true)]), tenNut: 'Vẽ sơ đồ',
            phanUng: [{ gt: 562.5, thamSo: { thu: 562.5 }, loi: '$25\\%$ được tính trên **giá ban đầu**, không phải trên $450$. Trên hình, hai phần $25\\%$ phải dài bằng nhau.' }],
            dungChu: '$0{,}75x = 450$, nên $x = 600$.', saiChu: 'Giá bán là phần còn lại, $75\\%$ của giá ban đầu: $0{,}75x = 450$.' }
        ],
        cachNhan: 'Đề nào cũng vậy: tìm một đại lượng tính được bằng hai cách (cùng quãng đường, cùng số tiền, cùng chu vi). Hai cách là hai đoạn bằng nhau, và đó là phương trình.'
      }
    },

    khamPha: {
      nhiemVu: 'Một xe máy xuất phát lúc **7 giờ** với vận tốc $\\cb{40}$ km/h. Sau đó **1 giờ**, một ô tô xuất phát từ cùng chỗ, đi cùng đường với vận tốc $\\ca{60}$ km/h. Em kéo thanh thời gian và theo dõi quãng đường hai xe. Lúc nào ô tô đuổi kịp xe máy?',
      widget: 'geo',
      config: { bbox: [-0.8, 4.8, 11.2, -2.6], build: duoiBuild,
        tuChay: [{ thanhTruot: 't', den: 3, giay: 5 }, { cho: 2.5 }, { thanhTruot: 't', den: 4.5, giay: 1.5 }, { thanhTruot: 't', den: 0, giay: 1.5 }] },
      cauHoi: {
        de: 'Ô tô đuổi kịp xe máy lúc mấy giờ?',
        dapAn: { kieu: 'so', gt: 10 },
        goiY: ['Ô tô đuổi kịp xe máy khi **hai quãng đường bằng nhau**.', 'Gọi $x$ (giờ) là thời gian ô tô đi. Xe máy đã đi $x + 1$ giờ. Lập phương trình $60x = 40(x + 1)$.'],
        loiGiai: [
          'Gọi $x$ (giờ) là thời gian ô tô đi đến lúc đuổi kịp, $x > 0$. Khi đó xe máy đã đi $x + 1$ (giờ).',
          'Quãng đường ô tô: $60x$; quãng đường xe máy: $40(x + 1)$ (km).',
          '$60x = 40(x + 1)$, tức là $60x = 40x + 40$, nên $20x = 40$, $x = 2$.',
          'Ô tô xuất phát lúc $8$ giờ, đi $2$ giờ, nên đuổi kịp lúc $8 + 2 = 10$ (giờ).'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhLi', tieuDe: 'Các bước giải bài toán bằng cách lập phương trình',
        noiDung: '**Bước 1. Lập phương trình:**\n\n• Chọn **ẩn số** (nói rõ ẩn là gì, **đơn vị** gì) và đặt **điều kiện** thích hợp cho ẩn;\n\n• Biểu diễn các đại lượng chưa biết theo ẩn và các đại lượng đã biết;\n\n• Lập phương trình biểu thị mối quan hệ giữa các đại lượng.\n\n**Bước 2. Giải phương trình.**\n\n**Bước 3. Trả lời:** kiểm tra nghiệm nào thoả mãn điều kiện của ẩn, nghiệm nào không, rồi kết luận.' },
      { loai: 'chuY', tieuDe: 'Mẹo chọn ẩn',
        noiDung: 'Thường chọn **chính đại lượng đề hỏi** làm ẩn.\n\nĐiều kiện của ẩn đến từ thực tế: số người, số sản phẩm phải là **số tự nhiên**; độ dài, vận tốc, thời gian phải **dương**; một phần của tổng thì **nhỏ hơn tổng**.\n\nCác đại lượng phải **cùng đơn vị**: đổi phút ra giờ ($20$ phút $= \\frac{1}{3}$ giờ), đồng ra nghìn đồng… **trước khi** lập phương trình.' },
      { loai: 'text', tieuDe: 'Lập bảng cho dễ nhìn',
        noiDung: '**Chuyển động:** quãng đường $=$ vận tốc $\\times$ thời gian.\n\n$$\\begin{array}{l|c|c|c} & \\text{v (km/h)} & \\text{t (h)} & \\text{s (km)} \\\\ \\hline \\text{Xe máy} & 40 & x + 1 & 40(x + 1) \\\\ \\text{Ô tô} & 60 & x & 60x \\end{array}$$\n\n**Năng suất:** tổng sản phẩm $=$ năng suất (mỗi ngày) $\\times$ số ngày.\n\n**Phần trăm:** giảm giá $a\\%$ thì giá mới $= \\left(1 - \\frac{a}{100}\\right)\\cdot$ giá cũ; lãi suất $r$ thì tiền lãi $= r\\cdot$ tiền gốc.\n\n**Nồng độ:** khối lượng chất tan $=$ nồng độ $\\times$ khối lượng dung dịch.\n\n**Hình học:** chu vi hình chữ nhật $= 2\\cdot$(dài $+$ rộng); diện tích $=$ dài $\\times$ rộng.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Giảm $20\\%$ rồi giảm **thêm** $10\\%$ trên giá đã giảm **không** bằng giảm $30\\%$: giá còn $0{,}8\\cdot 0{,}9 = 0{,}72$ giá gốc (giảm $28\\%$).\n\nSau $n$ năm, **mọi người** đều thêm $n$ tuổi.\n\nTìm được $x$ chưa phải là xong: đọc lại đề xem đề hỏi gì (có thể phải tính thêm một bước).' }
    ],

    viDu: [
      { de: 'Cô Hương đầu tư $400$ triệu đồng vào hai khoản: trái phiếu doanh nghiệp lãi $7\\%$ một năm và trái phiếu chính phủ lãi $4\\%$ một năm. Cuối năm cô nhận $25$ triệu đồng tiền lãi. Cô đầu tư vào mỗi khoản bao nhiêu?', canh: doan('Lãi khoản 7% + lãi khoản 4%', [m(0.07, 0, '0,07x'), m(-0.04, 16, '0,04(400 − x)')], 'Tổng tiền lãi', [m(0, 25, '25')], { tuyChon: { donVi: ' triệu đồng' } }), buoc: [
        { lam: 'Gọi $x$ (triệu đồng) là số tiền mua trái phiếu doanh nghiệp, $0 \\le x \\le 400$. Số tiền mua trái phiếu chính phủ là $400 - x$.', vi: 'Biết tổng là $400$ thì khoản kia là **tổng trừ khoản này**.', canh: { t: 0.5 } },
        { lam: 'Tiền lãi: $0{,}07x$ và $0{,}04(400 - x)$. Phương trình: $0{,}07x + 0{,}04(400 - x) = 25$.', vi: 'Tiền lãi $=$ lãi suất $\\times$ tiền gốc; tổng tiền lãi hai khoản là $25$.', canh: { t: 1 } },
        { lam: '$0{,}07x + 16 - 0{,}04x = 25$, nên $0{,}03x = 9$, $x = 300$.', vi: 'Bỏ ngoặc, chuyển vế, chia cho $0{,}03$.', canh: { t: 1 } },
        { lam: '$x = 300$ thoả mãn điều kiện. Vậy cô đầu tư $300$ triệu vào trái phiếu doanh nghiệp và $100$ triệu vào trái phiếu chính phủ.', vi: 'Bước 3: kiểm tra điều kiện rồi trả lời **đủ cả hai** khoản.', canh: { t: 1, trangThai: 'giai' } } ] },
      { de: 'Một món hàng giảm giá $20\\%$, khách quen được giảm thêm $10\\%$ trên giá đã giảm nên chỉ phải trả $360$ nghìn đồng. Giá ban đầu là bao nhiêu?', canh: doan('Giá phải trả', [m(0.72, 0, '0,9 · 0,8x = 0,72x')], 'Số tiền đã trả', [m(0, 360, '360')], { tuyChon: { hienX: true } }), buoc: [
        { lam: 'Gọi $x$ (nghìn đồng) là giá ban đầu, $x > 0$.', vi: 'Chọn ngay đại lượng đề hỏi làm ẩn.' },
        { lam: 'Sau lần giảm thứ nhất: $0{,}8x$. Sau lần giảm thứ hai: $0{,}9\\cdot 0{,}8x = 0{,}72x$.', vi: 'Giảm $10\\%$ **trên giá đã giảm** nên nhân $0{,}9$ với $0{,}8x$, không phải với $x$.' },
        { lam: '$0{,}72x = 360$, nên $x = 500$.', vi: 'Chia hai vế cho $0{,}72$.' },
        { lam: 'Giá ban đầu là $500$ nghìn đồng.', vi: 'Thử lại: $500\\cdot 0{,}8 = 400$, $400\\cdot 0{,}9 = 360$. Đúng!' } ] },
      { de: 'Hai thành phố cách nhau $150$ km. Một xe máy đi từ thành phố A với vận tốc $40$ km/h. Sau $30$ phút, một ô tô đi từ B về A với vận tốc $60$ km/h. Sau bao lâu kể từ lúc xe máy đi thì hai xe gặp nhau?', canh: doan('Xe máy đi + ô tô đi (km)', [m(40, 0, '40x'), m(60, -30, '60(x − ½)')], 'Quãng đường AB', [m(0, 150, '150 km')], { tuyChon: { hienX: true, donVi: ' giờ' } }), buoc: [
        { lam: 'Gọi $x$ (giờ) là thời gian từ lúc xe máy đi đến lúc gặp nhau, $x > \\frac{1}{2}$.', vi: 'Đổi $30$ phút $= \\frac{1}{2}$ giờ cho cùng đơn vị với vận tốc (km/**h**).' },
        { lam: 'Xe máy đi được $40x$ km; ô tô đi trong $x - \\frac{1}{2}$ giờ, được $60\\left(x - \\frac{1}{2}\\right)$ km.', vi: 'Ô tô đi **muộn** hơn nửa giờ nên thời gian ít hơn.' },
        { lam: '$40x + 60\\left(x - \\frac{1}{2}\\right) = 150$', vi: 'Đi **ngược chiều** gặp nhau: tổng hai quãng đường bằng cả quãng $AB$.' },
        { lam: '$100x - 30 = 150$, nên $x = 1{,}8$ (giờ) $= 1$ giờ $48$ phút.', vi: '$0{,}8$ giờ $= 0{,}8\\cdot 60 = 48$ phút. Thoả mãn điều kiện.' } ] },
      { de: 'Một mảnh vườn hình chữ nhật có chu vi $56$ m, chiều dài hơn chiều rộng $6$ m. Tìm chiều dài và chiều rộng.', canh: doan('Bốn cạnh', [m(1, 0, 'x'), m(1, 6, 'x + 6'), m(1, 0, 'x'), m(1, 6, 'x + 6')], 'Chu vi', [m(0, 56, '56 m')], { tuyChon: { hienX: true, donVi: ' m' } }), buoc: [
        { lam: 'Gọi $x$ (m) là chiều rộng, $x > 0$. Chiều dài là $x + 6$.', vi: 'Biểu diễn chiều dài theo chiều rộng.' },
        { lam: '$2(x + x + 6) = 56$', vi: 'Chu vi $= 2\\cdot$(dài $+$ rộng). Đừng quên nhân $2$!' },
        { lam: '$2x + 6 = 28$, nên $x = 11$.', vi: 'Chia hai vế cho $2$ trước cho gọn.' },
        { lam: 'Chiều rộng $11$ m, chiều dài $17$ m.', vi: 'Thử lại: $2\\cdot(11 + 17) = 56$. Đúng!' } ] }
    ],

    viDuMo: [
      { de: 'Cần trộn bao nhiêu gam dung dịch muối $20\\%$ với dung dịch muối $5\\%$ để được $300$ g dung dịch muối $10\\%$?', buoc: [
        { lam: 'Gọi $x$ (g) là khối lượng dung dịch $20\\%$, $0 < x < 300$. Dung dịch $5\\%$ là $300 - x$ (g).', vi: 'Tổng khối lượng hai dung dịch là $300$ g.' },
        { lam: '$0{,}2x + 0{,}05(300 - x) = 0{,}1\\cdot 300 = 30$', vi: 'Lượng muối hai phần cộng lại bằng lượng muối trong $300$ g dung dịch $10\\%$.' },
        { lam: '$0{,}15x + 15 = 30$, nên $x = 100$ (g)', vi: 'Em hãy giải phương trình, tìm khối lượng dung dịch $20\\%$ (gam):', an: true,
          dapAn: { kieu: 'so', gt: 100 },
          loiThuongGap: [{ gt: 200, giaiThich: '$200$ g là khối lượng dung dịch **$5\\%$**. Ẩn $x$ là dung dịch $20\\%$: $x = 100$.' }] } ] },
      { de: 'Bố hơn con $28$ tuổi. Bốn năm nữa tuổi bố gấp $3$ lần tuổi con. Tính tuổi con hiện nay.', buoc: [
        { lam: 'Gọi $x$ là tuổi con hiện nay ($x$ nguyên dương). Tuổi bố là $x + 28$.', vi: 'Biểu diễn tuổi bố theo tuổi con.' },
        { lam: '$x + 28 + 4 = 3(x + 4)$', vi: 'Sau $4$ năm, **cả hai** đều thêm $4$ tuổi.' },
        { lam: '$x + 32 = 3x + 12$, nên $2x = 20$, $x = 10$', vi: 'Em hãy giải phương trình, tìm tuổi con hiện nay:', an: true,
          dapAn: { kieu: 'so', gt: 10 },
          loiThuongGap: [{ gt: 14, giaiThich: '$3(x + 4) = 3x + 12$: phải nhân $3$ với **cả** số $4$, không phải $3x + 4$.' }] } ] }
    ],

    baiTap: [
      { id: '26.1', hinhGiai: hg(doan('Xe đạp 2 giờ, rồi đi bộ', [m(1, 0, 'x'), m(1, 0, 'x'), m(0, 3, '3')], null, null, { tuyChon: { x: 10, ghi: 'x + x + 3 = 2x + 3' }, ghiChu: 'Mỗi đoạn x là quãng đường đi trong 1 giờ. Hình vẽ với một vận tốc x bất kì.' })), muc: 1, de: 'Một người đi xe đạp $2$ giờ với vận tốc $x$ (km/h), rồi đi bộ thêm $3$ km. Viết biểu thức biểu thị tổng quãng đường người đó đã đi (km).',
        dapAn: { kieu: 'bieuThuc', gt: '2x+3' },
        goiY: ['Quãng đường $=$ vận tốc $\\times$ thời gian.', 'Đi xe đạp được $2\\cdot x$ km, cộng thêm $3$ km đi bộ.'],
        loiGiai: ['Đi xe đạp: $2x$ (km).', 'Tổng quãng đường: $s = 2x + 3$'],
        loiThuongGap: [{ gt: 'x+3', giaiThich: 'Đi $2$ giờ nên quãng đường xe đạp là $2x$, không phải $x$.' }, { gt: '5x', giaiThich: '$2x + 3$ không gộp thành $5x$ được: $3$ không chứa $x$.' }] },

      { id: '26.2', hinhGiai: hg(doan('Giá cũ x', [m(0.85, 0, 'giá mới'), m(0.15, 0, '15%', true)], null, null, { tuyChon: { x: 100, ghi: 'x − 0,15x = 0,85x' }, ghiChu: 'Phần gạch đứt là 15% bị giảm.' })), muc: 1, de: 'Một chiếc áo giá $x$ nghìn đồng được giảm giá $15\\%$. Viết biểu thức biểu thị giá mới của chiếc áo.',
        dapAn: { kieu: 'bieuThuc', gt: '0.85x' },
        goiY: ['Giảm $15\\%$ thì còn lại $100\\% - 15\\% = 85\\%$ giá cũ.', '$85\\% = 0{,}85$.'],
        loiGiai: ['Số tiền được giảm: $0{,}15x$.', 'Giá mới: $x - 0{,}15x = 0{,}85x$'],
        loiThuongGap: [{ gt: '0.15x', giaiThich: '$0{,}15x$ là **số tiền được giảm**, không phải giá mới.' }, { gt: 'x-15', giaiThich: 'Giảm $15\\%$ là giảm $15\\%$ **của $x$**, tức $0{,}15x$, không phải giảm $15$ nghìn.' }] },

      { id: '26.3', khongHinh: 'Câu hỏi về điều kiện của ẩn (số người là số tự nhiên), không cần hình.', muc: 1, de: 'Gọi $x$ là số học sinh của lớp 8A. Điều kiện thích hợp của ẩn $x$ là gì?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$x > 0$ (số thực bất kì)', '$x$ là số tự nhiên khác $0$', '$x < 0$', '$x$ là phân số'] },
        goiY: ['Số học sinh có thể là $12{,}5$ không?', 'Số người phải là số **tự nhiên**, và lớp phải có học sinh.'],
        loiGiai: ['Số học sinh không thể là số thập phân hay số âm.', 'Vậy điều kiện: $x$ là số tự nhiên khác $0$.'] },

      { id: '26.4', hinhGiai: hg(doan('Lương 12 tháng + thưởng Tết', [m(12, 0, '12x'), m(3, 0, '3x')], 'Thu nhập cả năm', [m(0, 225, '225')], { tuyChon: { hienX: true } })), muc: 1, de: 'Chị Linh được thưởng Tết bằng $3$ tháng lương. Tổng thu nhập một năm (lương $12$ tháng và thưởng Tết) là $225$ triệu đồng. Lương mỗi tháng của chị là bao nhiêu triệu đồng?',
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Gọi $x$ (triệu đồng) là lương một tháng. Thưởng Tết là $3x$.', 'Phương trình: $12x + 3x = 225$.'],
        loiGiai: ['Gọi $x$ (triệu đồng) là lương một tháng, $x > 0$.', '$12x + 3x = 225$, tức là $15x = 225$', 'Lương mỗi tháng: $x = 15$'],
        loiThuongGap: [{ gt: 18.75, giaiThich: 'Em quên tiền thưởng Tết ($3x$). Tổng thu nhập là $12x + 3x = 15x$.' }] },

      { id: '26.5', hinhGiai: hg(doan('Lãi khoản 9% + lãi khoản 6%', [m(0.09, 0, '0,09x'), m(-0.06, 15, '0,06(250 − x)')], 'Tổng tiền lãi', [m(0, 18, '18')], { tuyChon: { hienX: true } })), muc: 2, de: 'Bác Hùng đầu tư $250$ triệu đồng vào hai khoản: một khoản lãi $9\\%$ một năm, khoản còn lại gửi tiết kiệm lãi $6\\%$ một năm. Cuối năm bác nhận $18$ triệu đồng tiền lãi. Hỏi bác đầu tư vào khoản lãi $9\\%$ bao nhiêu triệu đồng?',
        dapAn: { kieu: 'so', gt: 100 },
        goiY: ['Gọi $x$ (triệu đồng) là tiền đầu tư khoản $9\\%$; khoản kia là $250 - x$.', '$0{,}09x + 0{,}06(250 - x) = 18$.'],
        loiGiai: ['$0{,}09x + 0{,}06(250 - x) = 18$', '$0{,}09x + 15 - 0{,}06x = 18$', '$0{,}03x = 3$', 'Khoản lãi $9\\%$: $x = 100$'],
        loiThuongGap: [{ gt: 150, giaiThich: '$150$ triệu là khoản gửi tiết kiệm $6\\%$. Đề hỏi khoản lãi $9\\%$.' }] },

      { id: '26.6', muc: 2, de: 'Một mảnh vườn hình chữ nhật có chu vi $50$ m, chiều rộng ngắn hơn chiều dài $5$ m. Tính chiều dài mảnh vườn (m).',
        hinh: hinhVuon,
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Gọi chiều dài là $x$ (m) thì chiều rộng là $x - 5$.', 'Chu vi: $2\\cdot(x + x - 5) = 50$.'],
        loiGiai: ['Gọi $x$ (m) là chiều dài, $x > 5$. Chiều rộng là $x - 5$.', '$2(x + x - 5) = 50$, nên $2x - 5 = 25$', 'Chiều dài: $x = 15$'],
        loiThuongGap: [{ gt: 27.5, giaiThich: 'Chu vi $= 2\\cdot$(dài $+$ rộng). Em quên nhân $2$: $x + (x - 5)$ mới là **nửa** chu vi.' }, { gt: 10, giaiThich: '$10$ m là chiều **rộng**. Đề hỏi chiều dài.' }] },

      { id: '26.7', hinhGiai: hg(doan('Giá ban đầu x', [m(0.75, 0, '0,75x'), m(0.25, 0, '25%', true)], 'Giá bán + phần đã giảm', [m(0, 450, '450'), m(0.25, 0, '25%', true)], { tuyChon: { hienX: true } })), muc: 2, de: 'Một chiếc áo len sau khi giảm giá $25\\%$ được bán với giá $450$ nghìn đồng. Giá ban đầu của chiếc áo là bao nhiêu nghìn đồng?',
        dapAn: { kieu: 'so', gt: 600 },
        goiY: ['Gọi giá ban đầu là $x$. Sau khi giảm $25\\%$, giá còn $0{,}75x$.', 'Giải $0{,}75x = 450$.'],
        loiGiai: ['Gọi $x$ (nghìn đồng) là giá ban đầu, $x > 450$.', '$0{,}75x = 450$', 'Giá ban đầu: $x = 600$'],
        loiThuongGap: [{ gt: 562.5, giaiThich: 'Lấy $450$ cộng thêm $25\\%$ **của $450$** là sai: $25\\%$ được tính trên **giá ban đầu**, chưa biết. Phải giải $0{,}75x = 450$.' }] },

      { id: '26.8', hinhGiai: hg(doan('Bình đi (km)', [m(16, 0, '16x')], 'An đi (km)', [m(0, 4, '4'), m(12, 0, '12x')], { tuyChon: { hienX: true, donVi: ' giờ' } })), muc: 2, de: 'An đi xe đạp rời nhà lúc $7$ giờ với vận tốc $12$ km/h. Lúc $7$ giờ $20$ phút, Bình đi xe đạp từ nhà An đuổi theo với vận tốc $16$ km/h. Sau bao nhiêu **phút** kể từ lúc Bình xuất phát thì Bình đuổi kịp An?',
        dapAn: { kieu: 'so', gt: 60 },
        goiY: ['Đổi $20$ phút $= \\frac{1}{3}$ giờ. Gọi $x$ (giờ) là thời gian Bình đi thì An đã đi $x + \\frac{1}{3}$ giờ.', 'Đuổi kịp khi hai quãng đường bằng nhau: $16x = 12\\left(x + \\frac{1}{3}\\right)$.'],
        loiGiai: ['Gọi $x$ (giờ) là thời gian Bình đi đến lúc đuổi kịp, $x > 0$.', '$16x = 12\\left(x + \\frac{1}{3}\\right) = 12x + 4$, nên $4x = 4$, $x = 1$ (giờ).', 'Vậy Bình đuổi kịp An sau $1$ giờ, tức là $t = 60$ phút.'],
        loiThuongGap: [{ gt: 80, giaiThich: '$80$ phút là thời gian tính từ lúc **An** đi. Đề hỏi tính từ lúc Bình xuất phát.' }, { gt: 1, giaiThich: 'Em tìm đúng $1$ giờ rồi, nhưng đề hỏi số **phút**: $1$ giờ $= 60$ phút.' }] },

      { id: '26.9', hinhGiai: hg(doan('Gói A (nghìn đồng)', [m(0, 30, '30'), m(0.8, 0, '0,8x')], 'Gói B (nghìn đồng)', [m(0, 40, '40'), m(0.6, 0, '0,6x')], { tuyChon: { hienX: true } })), muc: 2, de: 'Gói cước A: thuê bao $30\\,000$ đồng/tháng và $800$ đồng mỗi phút gọi. Gói cước B: thuê bao $40\\,000$ đồng/tháng và $600$ đồng mỗi phút gọi. Gọi bao nhiêu phút trong tháng thì tiền phải trả của hai gói bằng nhau?',
        dapAn: { kieu: 'so', gt: 50 },
        goiY: ['Đổi hết ra **nghìn đồng**: gói A trả $30 + 0{,}8x$, gói B trả $40 + 0{,}6x$.', 'Giải $30 + 0{,}8x = 40 + 0{,}6x$.'],
        loiGiai: ['Gọi $x$ là số phút gọi trong tháng, $x > 0$.', '$30 + 0{,}8x = 40 + 0{,}6x$ (nghìn đồng)', '$0{,}2x = 10$, nên $x = 50$'],
        loiThuongGap: [{ gt: 0.05, giaiThich: 'Đơn vị không thống nhất: thuê bao tính bằng **nghìn đồng** ($30$, $40$) mà cước gọi lại để **đồng** ($800$, $600$). Đổi $800$ đồng $= 0{,}8$ nghìn đồng.' }] },

      { id: '26.10', hinhGiai: hg(doan('Thực tế: 18 ngày', [m(18, 54, '18(x + 3)')], 'Kế hoạch + 6 áo vượt', [m(20, 0, '20x'), m(0, 6, '6')], { tuyChon: { hienX: true } })), muc: 3, de: 'Một xưởng may dự định hoàn thành kế hoạch trong $20$ ngày. Nhưng mỗi ngày xưởng may vượt mức $3$ chiếc áo nên đã xong sớm $2$ ngày và còn vượt kế hoạch $6$ chiếc áo. Hỏi theo kế hoạch xưởng phải may bao nhiêu chiếc áo?',
        dapAn: { kieu: 'so', gt: 480 },
        goiY: ['Gọi $x$ là số áo dự định may mỗi ngày. Kế hoạch là $20x$ áo.', 'Thực tế may $x + 3$ áo mỗi ngày trong $18$ ngày, được $20x + 6$ áo: $18(x + 3) = 20x + 6$.'],
        loiGiai: ['Gọi $x$ (chiếc) là số áo dự định may mỗi ngày, $x$ nguyên dương.', '$18(x + 3) = 20x + 6$, tức là $18x + 54 = 20x + 6$', '$2x = 48$, nên $x = 24$ (chiếc mỗi ngày).', 'Số áo theo kế hoạch: $20\\cdot 24 = 480$'],
        loiThuongGap: [{ gt: 24, giaiThich: '$24$ là số áo may **mỗi ngày** theo dự định. Đề hỏi cả kế hoạch: $20\\cdot 24$.' }, { gt: 486, giaiThich: '$486$ là số áo **thực tế** đã may. Kế hoạch ít hơn $6$ chiếc.' }] },

      { id: '26.11', hinhGiai: hg(doan('Xe thứ nhất đi AB (2,5 giờ)', [m(2.5, 25, '2,5(x + 10)')], 'Xe thứ hai đi AB (3 giờ)', [m(3, 0, '3x')], { tuyChon: { hienX: true } })), muc: 3, de: 'Hai ô tô cùng xuất phát lúc $7$ giờ từ A đi B. Vận tốc xe thứ nhất lớn hơn xe thứ hai $10$ km/h. Xe thứ nhất đến B lúc $9$ giờ $30$ phút, sớm hơn xe thứ hai $30$ phút. Tính độ dài quãng đường AB (km).',
        dapAn: { kieu: 'so', gt: 150 },
        goiY: ['Xe thứ nhất đi $2{,}5$ giờ, xe thứ hai đi $3$ giờ.', 'Gọi $x$ (km/h) là vận tốc xe thứ hai: $2{,}5(x + 10) = 3x$ (cùng quãng đường AB).'],
        loiGiai: ['Gọi $x$ (km/h) là vận tốc xe thứ hai, $x > 0$; xe thứ nhất $x + 10$.', 'Thời gian: xe thứ nhất $2{,}5$ giờ, xe thứ hai $3$ giờ.', '$2{,}5(x + 10) = 3x$, nên $0{,}5x = 25$, $x = 50$.', 'Quãng đường $AB = 3\\cdot 50 = 150$'],
        loiThuongGap: [{ gt: 50, giaiThich: '$50$ km/h là **vận tốc** xe thứ hai. Đề hỏi quãng đường: $3\\cdot 50$.' }, { gt: 125, giaiThich: 'Xe thứ hai đi $3$ giờ (đến lúc $10$ giờ), không phải $2{,}5$ giờ.' }] },

      { id: '26.12', hinhGiai: hg(doan('Vàng (g), không đổi', [m(0, 108, '108')], '80% của hợp kim mới', [m(0.8, 96, '0,8(120 + x)')], { tuyChon: { hienX: true } })), muc: 3, de: 'Người thợ có $8$ chiếc nhẫn, mỗi chiếc nặng $15$ g, làm bằng hợp kim $10\\%$ bạc và $90\\%$ vàng. Người thợ nấu chảy chúng và thêm bạc để hàm lượng vàng còn $80\\%$. Cần thêm bao nhiêu gam bạc?',
        dapAn: { kieu: 'so', gt: 15 },
        goiY: ['Tổng khối lượng $8\\cdot 15 = 120$ g, trong đó vàng $108$ g. Thêm bạc thì lượng **vàng không đổi**.', 'Gọi $x$ (g) là bạc thêm vào: $108 = 0{,}8(120 + x)$.'],
        loiGiai: ['Khối lượng nhẫn: $120$ g; vàng: $0{,}9\\cdot 120 = 108$ g.', 'Gọi $x$ (g) là khối lượng bạc thêm vào, $x > 0$. Hợp kim mới nặng $120 + x$.', '$108 = 0{,}8(120 + x)$, nên $120 + x = 135$', 'Khối lượng bạc cần thêm: $x = 15$'],
        loiThuongGap: [{ gt: 30, giaiThich: 'Em quên lượng bạc **sẵn có** ($12$ g) trong nhẫn. Bạc sau khi thêm là $12 + x$, chiếm $20\\%$ của $120 + x$.' }] }
    ],

    timLoi: [
      { de: 'Đề: "Xe máy đi trước ô tô $30$ phút với vận tốc $40$ km/h; ô tô đi cùng đường với vận tốc $60$ km/h. Sau bao lâu ô tô đuổi kịp?" Bạn Vuông giải như sau. Dòng nào sai?',
        loiGiaiSai: ['Gọi $x$ (giờ) là thời gian ô tô đi đến lúc đuổi kịp, $x > 0$.', 'Quãng đường ô tô đi: $60x$ (km).', 'Quãng đường xe máy đi: $40(x + 30)$ (km).', '$60x = 40(x + 30)$, nên $x = 60$ giờ.'],
        dongSai: 2, giaiThich: 'Ẩn $x$ tính bằng **giờ** mà Vuông cộng thêm $30$ **phút**. Phải đổi $30$ phút $= \\frac{1}{2}$ giờ. (Kết quả $60$ giờ cũng vô lí!)',
        sua: '$40\\left(x + \\frac{1}{2}\\right)$; khi đó $60x = 40x + 20$, $x = 1$ giờ' },
      { de: 'Đề: "Món hàng giảm $20\\%$, rồi giảm thêm $10\\%$ trên giá đã giảm, còn $360$ nghìn đồng. Tìm giá gốc." Bạn Tròn giải như sau. Dòng nào sai?',
        loiGiaiSai: ['Gọi $x$ (nghìn đồng) là giá gốc, $x > 0$.', 'Tổng cộng được giảm $20\\% + 10\\% = 30\\%$, nên giá phải trả là $0{,}7x$.', '$0{,}7x = 360$, nên $x \\approx 514$.'],
        dongSai: 1, giaiThich: 'Lần giảm thứ hai tính trên **giá đã giảm** ($0{,}8x$), không phải trên giá gốc. Hai lần giảm phải **nhân**: $0{,}9\\cdot 0{,}8x = 0{,}72x$.',
        sua: 'Giá phải trả là $0{,}72x$; $0{,}72x = 360$, $x = 500$' },
      { de: 'Đề: "Hiện nay mẹ $36$ tuổi, con $8$ tuổi. Sau bao nhiêu năm thì tuổi mẹ gấp $3$ lần tuổi con?" Bạn Minh giải như sau. Dòng nào sai?',
        loiGiaiSai: ['Gọi $x$ (năm) là số năm cần tìm, $x > 0$.', 'Sau $x$ năm: mẹ $36 + x$ tuổi, con $8 + x$ tuổi.', '$36 + x = 3(8 + x) = 24 + x$', 'Vậy $36 = 24$, vô lí, bài toán không có đáp số.'],
        dongSai: 2, giaiThich: 'Nhân $3$ vào ngoặc phải nhân **cả** $x$: $3(8 + x) = 24 + 3x$.',
        sua: '$36 + x = 24 + 3x$, nên $2x = 12$, $x = 6$ năm' }
    ]
  });
})();
