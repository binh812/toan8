// Bài 29 – Hệ số góc của đường thẳng (SGK Toán 8 KNTT, Tập 2, tr. 51–54; Luyện tập chung, Bài tập cuối chương VII tr. 55–58)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  // ---------- Hình động: góc α tạo bởi đường thẳng y = ax + b và trục Ox ----------
  var gocBuild = function (board, G) {
    var T = window.TOAN8, env = { a: 1, b: 1 }, f = T.fmtSo;
    function a() { return env.a; }
    function b() { return env.b; }
    function xA() { return a() ? -b() / a() : NaN; }
    function alpha() { var d = Math.atan(a()) * 180 / Math.PI; return d < 0 ? d + 180 : d; }
    board.create('functiongraph', [function (x) { return a() * x + b(); }], { strokeColor: XANH, strokeWidth: 3, fixed: true, highlight: false });
    var A = board.create('point', [xA, 0], { name: 'A', size: 4, color: '#343a40', fixed: true, showInfobox: false, label: { fontSize: 18, offset: [-6, -18] } });
    var X = board.create('point', [function () { return xA() + 2; }, 0], { visible: false });
    var Tt = board.create('point', [function () { return xA() + 2.5 / a(); }, 2.5], { name: 'T', size: 3, color: XANH, fixed: true, showInfobox: false,
      label: { fontSize: 18, offset: [8, 8], strokeColor: XANH } });
    board.create('nonreflexangle', [X, A, Tt], { radius: 0.9, name: '', fillColor: CAM, strokeColor: CAM, fillOpacity: 0.35, fixed: true, highlight: false });
    G.label(-5.6, 5.3, function () { return T.ptDuongThang(a(), b()); }, { fontSize: 18, strokeColor: XANH, cssStyle: 'font-weight:700' });
    G.label(-5.6, 4.4, function () {
      if (!a()) return 'a = 0: không phải hàm số bậc nhất';
      return 'α ≈ ' + f(alpha(), 1) + '°  → góc ' + (a() > 0 ? 'NHỌN (a > 0)' : 'TÙ (a < 0)');
    }, { fontSize: 16, strokeColor: function () { return a() > 0 ? LA : CAM; }, cssStyle: 'font-weight:700' });
    board.containerObj.parentNode.appendChild(T.makeSliders([{ ten: 'a', min: -4, max: 4, buoc: 0.5, gt: 1 }, { ten: 'b', min: -3, max: 3, buoc: 1, gt: 1 }],
      env, function () { board.update(); }));
  };

  // Cấu hình hình cho "Nhìn là hiểu": bậc thang cho hệ số góc, tịnh tiến cho hai đường song song
  function mp(tuyChon, them) { return Object.assign({ ten: 'duongThang', tuyChon: tuyChon }, them); }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  var KHAC_TI_LE = 'Hai trục khác tỉ lệ.';
  var B296 = { khung: [-1, 3, -6, 4], tiLe: false, duong: [{ a: 4, b: -5, an: true }], diem: [{ x: 2, y: 3, ten: '(2; 3)' }], bac: [{ duong: 0, tu: 2, soBuoc: -2, nhan: true }] };
  var B299 = { khung: [-3, 2, -4, 7], duong: [{ a: 2, b: -1, nhan: 'y = 2x − 1' }, { a: 2, b: 5, an: true, mau: '--cc' }], diem: [{ x: -1, y: 3, ten: '(−1; 3)' }], tinhTien: { tu: 0, den: 1 } };

  TOAN8.bai({
    id: 29, ten: 'Hệ số góc của đường thẳng', sgk: { tap: 2, trang: 51 },

    nhin: {
      tieuDe: 'Cùng bậc thang thì đẩy lên được: hai đường song song', loai: 'chungMinh',
      luuY: 'Lập luận đúng với mọi $x$, không chỉ những chỗ có mũi tên: $(ax + b\') - (ax + b) = b\' - b$. Hai tung độ luôn chênh nhau cùng một số, nên hai đường không có điểm chung nào khi $b\' \\ne b$.',
      canh: { ten: 'haiDuongThang', tuyChon: { theoThamSo: 2, khung: [-4, 4, -5, 5], tinhTien: { tu: 0, den: 1 }, bac: [{ duong: 0, tu: 0, soBuoc: 1, nhan: true }] }, giay: 14,
        moTa: 'Đường thẳng y bằng a x cộng b được đẩy thẳng lên (hoặc xuống) thành đường y bằng a x cộng b phẩy; mũi tên dọc ở mọi chỗ dài bằng nhau.',
        dongSo: function (p, f) {
          var so = function (x) { return f(x).replace(',', '{,}'); }, d = p.c - p.b;
          return d === 0 ? '$b\' = b$: hai đường **trùng nhau**.' : 'Ở mọi $x$, hai đường chênh nhau $b\' - b = ' + so(d) + '$ theo chiều dọc.';
        } },
      buoc: [
        { t: 0, chu: 'Đường thẳng $y = \\ca{a}x + \\cb{b}$ và một bậc thang của nó: sang phải $1$, đứng $\\ca{a}$.' },
        { t: 0.15, chu: 'Đẩy **cả** đường thẳng theo chiều dọc. Mọi điểm dịch cùng một đoạn, bậc thang giữ nguyên.' },
        { t: 0.75, chu: 'Đường mới là $y = \\ca{a}x + \\cc{b\'}$. Ở mọi chỗ, hai đường cách nhau đúng $b\' - b$ theo chiều dọc, nên không bao giờ gặp nhau.' }
      ],
      ketLuan: 'Cùng hệ số góc $\\ca{a = a\'}$, khác $b \\ne b\'$: hai đường thẳng **song song**. Khác hệ số góc thì hai bậc thang khác nhau, hai đường cắt nhau.',
      dung: {
        tieuDe: 'Chọn $m$ để hai đường không bao giờ gặp', tuBai: '29.8',
        canh: mp({ khung: [-3, 6, -3, 7], duong: [{ a: -1, b: 5, nhan: 'y = −x + 5' }, { a: -1, b: 1, an: 'giai', mau: '--cc' }], diem: [{ x: 0, y: 1, ten: '(0; 1)' }], thu: { duong: 1, gan: 'a', cong: 3 }, giao: [0, 1] },
          { moTa: 'Đường thẳng y bằng âm x cộng 5, và đường thẳng đi qua điểm (0; 1) có hệ số góc m cộng 3.' }),
        moiThu: 'Gõ $m$. Hình sẽ vẽ đường $y = (m + 3)x + 1$ theo số em gõ; nếu nó cắt đường kia, em sẽ thấy chỗ cắt.',
        phanUng: [{ gt: 2, thamSo: { thu: 2 }, loi: 'Với $m = 2$, hệ số góc là $5$: đường đi lên, cắt đường kia. Chuyển $3$ sang vế phải phải đổi dấu: $m = -1 - 3$.' }],
        soBatKi: function (v) {
          var so = function (n) { return String(Math.round(n * 1000) / 1000).replace('.', '{,}'); };
          return { thamSo: { thu: v }, loi: 'Với $m = ' + so(v) + '$, hệ số góc là $' + so(v) + ' + 3 = ' + so(v + 3) + '$, khác $-1$: hai đường cắt nhau ở chỗ vòng tròn.' };
        },
        dungChu: '$m + 3 = -1$ nên $m = -4$: hai đường cùng bậc thang, chênh nhau $4$ ở mọi chỗ, song song.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là bậc thang',
        baDe: [
          { tuBai: '29.1', canh: mp({ khung: [-1, 4, -1, 8], duong: [{ a: -2, b: 7, nhan: 'y = 7 − 2x' }], bac: [{ duong: 0, tu: 0, soBuoc: 1 }] }), tenNut: 'Vẽ bậc thang',
            phanUng: [{ gt: 7, loi: '$7$ là chỗ đường thẳng cắt trục tung. Hệ số góc là độ dốc: sang phải $1$ thì đi xuống mấy?' }, { gt: 2, loi: 'Đường thẳng đi **xuống** từ trái sang phải nên hệ số góc âm.' }],
            dungChu: 'Sang phải $1$ thì xuống $2$: hệ số góc $-2$.', saiChu: 'Hệ số góc là hệ số của $x$, lấy cả dấu: $y = -2x + 7$.' },
          { tuBai: '29.6', canh: mp(B296, { ghiChu: KHAC_TI_LE }), tenNut: 'Vẽ bậc thang',
            phanUng: [{ gt: '4x+3', loi: '$3$ là tung độ của điểm $(2; 3)$, không phải $b$. Đi bậc thang về tới trục tung.' }],
            dungChu: 'Từ $(2; 3)$ lùi $2$ bậc, mỗi bậc xuống $4$: tới $(0; -5)$, nên $y = 4x - 5$.', saiChu: 'Hệ số góc $4$: mỗi bậc sang trái $1$ thì xuống $4$. Đi từ $(2; 3)$ về tới $x = 0$.' },
          { tuBai: '29.9', canh: mp(B299), tenNut: 'Đẩy đường thẳng',
            phanUng: [{ gt: '2x-1', loi: 'Đó chính là đường thẳng đã cho, nó không đi qua $(-1; 3)$.' }],
            dungChu: 'Đẩy $y = 2x - 1$ lên $6$ đơn vị thì đi qua $(-1; 3)$: $y = 2x + 5$.', saiChu: 'Song song nên giữ hệ số góc $2$. Thay $(-1; 3)$ vào $y = 2x + b$ để tìm $b$.' }
        ],
        cachNhan: 'Thấy "hệ số góc" hay "song song": nghĩ tới bậc thang. Cùng bậc thang (cùng $a$) thì chỉ còn tìm $b$, bằng cách cho đường thẳng đi qua một điểm đã biết.'
      }
    },

    khamPha: {
      nhiemVu: 'Đường thẳng $y = ax + b$ cắt trục $Ox$ tại $A$; $T$ là một điểm trên đường thẳng, nằm **phía trên** trục $Ox$. Góc $\\ca{\\alpha}$ (màu cam) giữa tia $Ax$ và tia $AT$ gọi là **góc tạo bởi đường thẳng và trục $Ox$**. Em kéo $a$ (và $b$): khi $a$ dương thì $\\alpha$ là góc gì, khi $a$ âm thì sao? Thay $b$ có làm $\\alpha$ thay đổi không?',
      widget: 'geo',
      config: { bbox: [-6, 6, 6, -4], axis: true, grid: true, build: gocBuild,
        tuChay: [{ thanhTruot: 'a', den: 3, giay: 2 }, { cho: 1 }, { thanhTruot: 'a', den: -2, giay: 3 }, { cho: 1.5 },
          { thanhTruot: 'b', den: -2, giay: 1.5 }, { thanhTruot: 'b', den: 3, giay: 1.5 }, { thanhTruot: 'a', den: 1, giay: 2 }, { thanhTruot: 'b', den: 1, giay: 1 }] },
      cauHoi: {
        de: 'Đặt $a = 1$. Góc $\\alpha$ tạo bởi đường thẳng $y = x + b$ và trục $Ox$ bằng bao nhiêu độ?',
        dapAn: { kieu: 'so', gt: 45 },
        goiY: ['Đọc số đo $\\alpha$ hiện trên hình khi $a = 1$.', 'Đi sang phải $1$ ô thì đi lên đúng $1$ ô: đường thẳng là đường chéo của hình vuông.'],
        loiGiai: [
          'Với $a = 1$, đi sang phải $1$ đơn vị thì lên $1$ đơn vị, tạo tam giác vuông cân.',
          'Góc nhọn của tam giác vuông cân bằng $45^{\\circ}$; đổi $b$ chỉ dời đường thẳng lên xuống, góc **không đổi**.',
          'Vậy $\\alpha = 45$'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Góc tạo bởi đường thẳng và trục $Ox$',
        noiDung: 'Góc $\\alpha$ tạo bởi đường thẳng $y = ax + b$ $(a \\ne 0)$ và trục $Ox$ là góc tạo bởi tia $Ax$ và tia $AT$, trong đó $A$ là giao điểm của đường thẳng với trục $Ox$, $T$ là một điểm thuộc đường thẳng và có **tung độ dương**. Ta có $0^{\\circ} < \\alpha < 180^{\\circ}$.' },
      { loai: 'dinhNghia', tieuDe: 'Hệ số góc',
        noiDung: 'Ta gọi $\\ca{a}$ là **hệ số góc** của đường thẳng $y = \\ca{a}x + b$ $(a \\ne 0)$.\n\nVí dụ: $y = 3x - 1$ có hệ số góc $3$; $\\;y = 2 - x$ có hệ số góc $-1$; $\\;y = \\frac{1}{2}(x - 1) = \\frac{1}{2}x - \\frac{1}{2}$ có hệ số góc $\\frac{1}{2}$.' },
      { loai: 'dinhLi', tieuDe: 'Nhận xét',
        noiDung: '• $a > 0$: đường thẳng **đi lên** từ trái sang phải, góc $\\alpha$ là **góc nhọn**.\n\n• $a < 0$: đường thẳng **đi xuống** từ trái sang phải, góc $\\alpha$ là **góc tù**.\n\nGóc $\\alpha$ chỉ phụ thuộc vào $a$, không phụ thuộc vào $b$ – vì thế $a$ mới có tên là hệ số **góc**.' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-5, 5, 5, -5], tamGiacDoc: true,
          thanhTruot: [{ ten: 'a', min: -3, max: 3, buoc: 0.5, gt: 2 }, { ten: 'b', min: -3, max: 3, buoc: 1, gt: -1 }], duong: [{ a: 'a', b: 'b' }],
          tuChay: [{ thanhTruot: 'a', den: 3, giay: 2 }, { cho: 1 }, { thanhTruot: 'a', den: 0.5, giay: 2 }, { thanhTruot: 'a', den: -2, giay: 2 }, { cho: 1 }, { thanhTruot: 'a', den: 2, giay: 2 }] },
        chuThich: 'Từ điểm $(0; b)$ trên đường thẳng, đi **sang phải 1 đơn vị** (nét đứt) thì phải đi **lên $a$ đơn vị** (nét màu) mới gặp lại đường thẳng. $a$ càng lớn, đường thẳng càng **dốc**; $a$ âm thì phải đi **xuống**.' },
      { loai: 'dinhLi', tieuDe: '2. Hai đường thẳng song song, trùng nhau, cắt nhau',
        noiDung: 'Cho hai đường thẳng $y = \\ca{a}x + \\cb{b}$ $(a \\ne 0)$ và $y = \\ca{a\'}x + \\cb{b\'}$ $(a\' \\ne 0)$:\n\n• **Song song** khi $\\ca{a = a\'}$ và $\\cb{b \\ne b\'}$ (và ngược lại);\n\n• **Trùng nhau** khi $a = a\'$ và $b = b\'$ (và ngược lại);\n\n• **Cắt nhau** khi $\\ca{a \\ne a\'}$ (và ngược lại).' },
      { loai: 'hinh', widget: 'doThi', config: { bbox: [-5, 5, 5, -5],
          thanhTruot: [{ ten: 'a', min: -3, max: 3, buoc: 0.5, gt: 2 }, { ten: 'b', min: -3, max: 3, buoc: 1, gt: 1 },
            { ten: 'c', nhan: "<i>a'</i>", min: -3, max: 3, buoc: 0.5, gt: 2 }, { ten: 'd', nhan: "<i>b'</i>", min: -3, max: 3, buoc: 1, gt: -2 }],
          duong: [{ a: 'a', b: 'b' }, { a: 'c', b: 'd' }],
          tuChay: [{ thanhTruot: 'd', den: 3, giay: 2 }, { thanhTruot: 'd', den: 1, giay: 1.5 }, { cho: 1.5 },
            { thanhTruot: 'c', den: -1, giay: 2.5 }, { cho: 1.5 }, { thanhTruot: 'c', den: 2, giay: 1.5 }, { thanhTruot: 'd', den: -2, giay: 1.5 }] },
        chuThich: 'Hai đường thẳng $y = ax + b$ (đỏ) và $y = a\'x + b\'$ (xanh). Để $a = a\'$ rồi đổi $b\'$: hai đường **song song**, không bao giờ gặp nhau (nếu $b\' = b$ thì chúng **trùng** nhau). Đổi $a\'$ khác $a$: hai đường **cắt nhau**.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Phải đưa về dạng $y = ax + b$ rồi mới đọc hệ số góc: $y = \\frac{2x + 1}{2} = x + \\frac{1}{2}$ có hệ số góc $1$, **không** phải $2$.\n\nHệ số góc là hệ số **của $x$** (kể cả dấu): $y = 5 - 3x$ có hệ số góc $-3$, không phải $5$.\n\nSong song cần **cả hai** điều kiện: $a = a\'$ **và** $b \\ne b\'$. Nếu $b = b\'$ nữa thì là trùng nhau.\n\nBài có tham số $m$: nhớ đối chiếu điều kiện hệ số góc khác $0$.' },
      { loai: 'text', tieuDe: 'Em có biết?',
        noiDung: 'Hai đường thẳng $y = x$ và $y = -x + 2$ **vuông góc** với nhau. Tích hai hệ số góc của chúng là $1\\cdot(-1) = -1$. Đây là dấu hiệu nhận biết hai đường thẳng vuông góc mà các em sẽ học kĩ hơn ở lớp trên.' }
    ],

    viDu: [
      { de: 'Xác định hệ số góc của các đường thẳng: $y = 4x + 2$; $\\;y = 5 - 3x$; $\\;y = \\frac{x - 4}{3}$.', canh: mp({ khung: [-3, 4, -4, 8], duong: [{ a: 4, b: 2, nhan: 'y = 4x + 2', nhanX: 1.3 }, { a: -3, b: 5, mau: '--cc', nhan: 'y = 5 − 3x', nhanX: 2.8 }, { a: 1 / 3, b: -4 / 3, mau: '--a' }], bac: [{ duong: 0, tu: -1, soBuoc: 1, nhan: true }, { duong: 1, tu: 0, soBuoc: 1, nhan: true }, { duong: 2, tu: -2, soBuoc: 1, dx: 3, nhan: true }] }, { ghiChu: 'Đường cam là y = (x − 4) : 3: sang phải 3 thì lên 1.' }), buoc: [
        { lam: '$y = 4x + 2$ có hệ số góc $4$.', vi: 'Hệ số góc là hệ số của $x$.' },
        { lam: '$y = 5 - 3x = -3x + 5$ có hệ số góc $-3$.', vi: 'Viết lại theo thứ tự $ax + b$, giữ nguyên dấu trừ.' },
        { lam: '$y = \\frac{x - 4}{3} = \\frac{1}{3}x - \\frac{4}{3}$ có hệ số góc $\\frac{1}{3}$.', vi: 'Tách phân số để thấy rõ hệ số của $x$.' } ] },
      { de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $-3$ và đi qua điểm $(1; 1)$.', canh: mp({ khung: [-1, 3, -1, 6], duong: [{ a: -3, b: 4, an: true }], diem: [{ x: 1, y: 1, ten: '(1; 1)' }], bac: [{ duong: 0, tu: 1, soBuoc: -1, nhan: true }] }), buoc: [
        { lam: 'Hàm số có dạng $y = -3x + b$.', vi: 'Hệ số góc đã cho chính là $a$.' },
        { lam: 'Đi qua $(1; 1)$: $1 = -3\\cdot 1 + b$, nên $b = 4$.', vi: 'Thay toạ độ điểm vào công thức để tìm $b$.' },
        { lam: 'Vậy $y = -3x + 4$.', vi: 'Thử lại: $x = 1$ thì $y = -3 + 4 = 1$. Đúng!' } ] },
      { de: 'Tìm $m$ để đường thẳng $y = (m - 2)x + 5$ $(m \\ne 2)$ song song với đường thẳng $y = 3x - 1$.', canh: mp({ khung: [-3, 3, -4, 8], duong: [{ a: 3, b: -1, nhan: 'y = 3x − 1' }, { a: 3, b: 5, an: true, mau: '--cc', nhan: 'm = 5' }], tinhTien: { tu: 0, den: 1 } }), buoc: [
        { lam: 'Song song khi $m - 2 = 3$ và $5 \\ne -1$.', vi: 'Hai hệ số góc bằng nhau, hai tung độ gốc khác nhau.' },
        { lam: '$m - 2 = 3$, nên $m = 5$.', vi: 'Giải phương trình bậc nhất ẩn $m$.' },
        { lam: '$m = 5$ thoả mãn $m \\ne 2$. Vậy $m = 5$.', vi: 'Luôn đối chiếu với điều kiện ban đầu.' } ] },
      { de: 'Tìm $m$ để đường thẳng $y = mx + 1$ $(m \\ne 0)$ cắt đường thẳng $y = 4x - 2$.', canh: mp({ khung: [-3, 3, -5, 5], duong: [{ a: 4, b: -2, nhan: 'y = 4x − 2' }, { a: 1, b: 1, mau: '--cc' }, { a: -1, b: 1, mau: '--cc' }, { a: 4, b: 1, mau: '--sai', net: true, nhan: 'm = 4' }], giao: [0, 1] }, { ghiChu: 'Các đường xanh lá (m khác 4) đều cắt; đường đứt đỏ (m = 4) song song, không cắt.' }), buoc: [
        { lam: 'Hai đường thẳng cắt nhau khi $m \\ne 4$.', vi: 'Cắt nhau khi hai hệ số góc **khác nhau**.' },
        { lam: 'Kết hợp điều kiện: $m \\ne 0$ và $m \\ne 4$.', vi: 'Điều kiện $m \\ne 0$ để hàm số là bậc nhất.' } ] },
      { de: 'Tìm hàm số bậc nhất có đồ thị song song với đường thẳng $y = 2x - 3$ và đi qua điểm $(1; 5)$.', canh: mp({ khung: [-3, 3, -5, 8], duong: [{ a: 2, b: -3, nhan: 'y = 2x − 3' }, { a: 2, b: 3, an: true, mau: '--cc', nhan: 'y = 2x + 3' }], diem: [{ x: 1, y: 5, ten: '(1; 5)' }], tinhTien: { tu: 0, den: 1 } }), buoc: [
        { lam: 'Song song với $y = 2x - 3$ nên $a = 2$: $y = 2x + b$ với $b \\ne -3$.', vi: 'Song song thì cùng hệ số góc.' },
        { lam: 'Đi qua $(1; 5)$: $5 = 2\\cdot 1 + b$, nên $b = 3$.', vi: 'Thay toạ độ điểm vào.' },
        { lam: '$b = 3 \\ne -3$ (thoả mãn). Vậy $y = 2x + 3$.', vi: 'Kiểm tra $b \\ne b\'$, nếu không thì hai đường trùng nhau.' } ] }
    ],

    viDuMo: [
      { de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $2$ và cắt trục tung tại điểm có tung độ $-5$.', buoc: [
        { lam: 'Hệ số góc $2$ nên $a = 2$.', vi: 'Hệ số góc là $a$.' },
        { lam: 'Cắt trục tung tại tung độ $-5$ nên $b = -5$.', vi: 'Đường thẳng $y = ax + b$ cắt trục tung tại $(0; b)$.' },
        { lam: '$y = 2x - 5$', vi: 'Em hãy viết công thức hàm số:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '2x-5' },
          loiThuongGap: [{ gt: '-5x+2', giaiThich: 'Em đổi chỗ $a$ và $b$: hệ số góc $2$ là hệ số **của $x$**.' }] } ] },
      { de: 'Tìm $m$ để đường thẳng $y = (2m + 1)x - 3$ song song với đường thẳng $y = 5x + 2$.', buoc: [
        { lam: 'Song song khi $2m + 1 = 5$ (và $-3 \\ne 2$, luôn đúng).', vi: 'Hai hệ số góc bằng nhau.' },
        { lam: '$2m = 4$, nên $m = 2$', vi: 'Em hãy tìm $m$:', an: true,
          dapAn: { kieu: 'so', gt: 2 },
          loiThuongGap: [{ gt: 3, giaiThich: 'Chuyển $1$ sang vế phải phải đổi dấu: $2m = 5 - 1 = 4$, không phải $5 + 1$.' }] } ] }
    ],

    baiTap: [
      { id: '29.1', hinhGiai: hg(mp({ khung: [-1, 4, -1, 8], duong: [{ a: -2, b: 7, nhan: 'y = 7 − 2x' }], bac: [{ duong: 0, tu: 0, soBuoc: 1, nhan: true }] })), muc: 1, de: 'Hệ số góc của đường thẳng $y = 7 - 2x$ là bao nhiêu?',
        dapAn: { kieu: 'so', gt: -2 },
        goiY: ['Hệ số góc là hệ số của $x$.', 'Viết lại: $y = -2x + 7$.'],
        loiGiai: ['$y = 7 - 2x = -2x + 7$.', 'Hệ số góc $a = -2$'],
        loiThuongGap: [{ gt: 7, giaiThich: '$7$ là hạng tử tự do $b$. Hệ số góc là hệ số **của $x$**.' }, { gt: 2, giaiThich: 'Hệ số góc mang cả dấu: $-2$.' }] },

      { id: '29.2', hinhGiai: hg(mp({ khung: [-3, 3, -3, 5], duong: [{ a: 2, b: 1, mau: '--nhat' }, { a: 1, b: 0, mau: '--nhat' }, { a: -3, b: 4, mau: '--a', nhan: 'y = −3x + 4' }, { a: 0.5, b: -2, mau: '--nhat' }], goc: [2] }, { ghiChu: 'Ba đường xám đi lên (a > 0), đường cam đi xuống (a < 0) nên góc α tù.' })), muc: 1, de: 'Đường thẳng nào dưới đây tạo với trục $Ox$ một **góc tù**?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$y = 2x + 1$', '$y = x$', '$y = -3x + 4$', '$y = 0{,}5x - 2$'] },
        goiY: ['Góc tù khi hệ số góc $a$ âm.', 'Tìm đường thẳng có hệ số của $x$ âm.'],
        loiGiai: ['Ba đường thẳng còn lại có $a > 0$ nên tạo góc nhọn.', '$y = -3x + 4$ có $a = -3 < 0$ nên tạo góc tù. Đáp án: $y = -3x + 4$.'] },

      { id: '29.3', hinhGiai: hg(mp({ khung: [-3, 3, -5, 5], duong: [{ a: 2, b: 1, nhan: 'y = 2x + 1' }, { a: 2, b: -3, mau: '--cc', nhan: 'y = 2x − 3' }], tinhTien: { tu: 1, den: 0 } })), muc: 1, de: 'Cặp đường thẳng nào dưới đây **song song** với nhau?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['$y = 2x + 1$ và $y = 2x - 3$', '$y = 2x + 1$ và $y = -2x + 1$', '$y = 3x$ và $y = x + 3$', '$y = x - 1$ và $y = -x - 1$'] },
        goiY: ['Song song: cùng hệ số góc, khác hạng tử tự do.', 'So sánh hệ số của $x$ trong từng cặp.'],
        loiGiai: ['Chỉ cặp $y = 2x + 1$ và $y = 2x - 3$ có $a = a\' = 2$ và $1 \\ne -3$.', 'Các cặp còn lại có hệ số góc khác nhau nên cắt nhau. Đáp án: cặp thứ nhất.'] },

      { id: '29.4', khongHinh: 'Chỉ cần đặt hệ số góc m − 1 bằng 4 rồi giải, hình không giúp thêm.', muc: 1, de: 'Đường thẳng $y = (m - 1)x + 2$ $(m \\ne 1)$ có hệ số góc bằng $4$. Tìm $m$.',
        dapAn: { kieu: 'so', gt: 5 },
        goiY: ['Hệ số góc của đường thẳng này là $m - 1$.', 'Giải $m - 1 = 4$.'],
        loiGiai: ['$m - 1 = 4$', '$m = 5$'],
        loiThuongGap: [{ gt: 3, giaiThich: 'Chuyển $-1$ sang vế phải thành $+1$: $m = 4 + 1 = 5$.' }] },

      { id: '29.5', hinhGiai: hg(mp({ khung: [-1, 5, -4, 4], duong: [{ a: 1.5, b: -3 }], diem: [{ x: 0, y: -3, ten: 'b = −3' }], bac: [{ duong: 0, tu: 0, soBuoc: 2, dx: 2, nhan: true }] }, { ghiChu: 'Sang phải 2 thì lên 3, nên sang phải 1 thì lên 1,5.' })), muc: 2, de: 'Hệ số góc của đường thẳng $y = \\frac{3x - 6}{2}$ là bao nhiêu?',
        dapAn: { kieu: 'so', gt: 1.5 },
        goiY: ['Tách phân số thành hai phân số.', '$\\frac{3x - 6}{2} = \\frac{3}{2}x - 3$.'],
        loiGiai: ['$y = \\frac{3x}{2} - \\frac{6}{2} = \\frac{3}{2}x - 3$.', 'Hệ số góc $a = \\frac{3}{2}$'],
        loiThuongGap: [{ gt: 3, giaiThich: 'Mẫu $2$ chia cho **cả** $3x$: hệ số của $x$ là $\\frac{3}{2}$, không phải $3$.' }] },

      { id: '29.6', hinhGiai: hg(mp(Object.assign({}, B296, { duong: [{ a: 4, b: -5 }] }), { ghiChu: KHAC_TI_LE })), muc: 2, de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $4$ và đi qua điểm $(2; 3)$.',
        dapAn: { kieu: 'bieuThuc', gt: '4x-5' },
        goiY: ['Hàm số có dạng $y = 4x + b$.', 'Thay $x = 2$, $y = 3$: $3 = 4\\cdot 2 + b$.'],
        loiGiai: ['$y = 4x + b$; qua $(2; 3)$: $3 = 8 + b$, nên $b = -5$.', '$y = 4x - 5$'],
        loiThuongGap: [{ gt: '4x+5', giaiThich: '$3 = 8 + b$ thì $b = 3 - 8 = -5$ (âm).' }, { gt: '4x+3', giaiThich: '$3$ là tung độ của điểm, không phải $b$. Phải thay toạ độ vào để tính $b$.' }] },

      { id: '29.7', hinhGiai: hg(mp({ khung: [-1, 3, -1, 7], duong: [{ a: -3, b: 6 }], diem: [{ x: 2, y: 0, ten: '(2; 0)' }, { x: 0, y: 6, ten: 'b = 6' }], bac: [{ duong: 0, tu: 2, soBuoc: -2, nhan: true }] })), muc: 2, de: 'Tìm hàm số bậc nhất có đồ thị là đường thẳng có hệ số góc $-3$ và cắt trục hoành tại điểm có hoành độ bằng $2$.',
        dapAn: { kieu: 'bieuThuc', gt: '-3x+6' },
        goiY: ['Cắt trục hoành tại hoành độ $2$ nghĩa là đi qua điểm $(2; 0)$.', 'Thay vào $y = -3x + b$: $0 = -6 + b$.'],
        loiGiai: ['Đường thẳng đi qua $(2; 0)$: $0 = -3\\cdot 2 + b$, nên $b = 6$.', '$y = -3x + 6$'],
        loiThuongGap: [{ gt: '-3x+2', giaiThich: 'Điểm $(2; 0)$ nằm trên trục **hoành**, còn $b$ là tung độ giao điểm với trục **tung**. Phải thay $(2; 0)$ để tính $b$.' }, { gt: '-3x-6', giaiThich: '$0 = -6 + b$ thì $b = 6$ (dương).' }] },

      { id: '29.8', hinhGiai: hg(mp({ khung: [-3, 6, -3, 7], duong: [{ a: -1, b: 5, nhan: 'y = −x + 5' }, { a: -1, b: 1, mau: '--cc', nhan: 'y = −x + 1' }], tinhTien: { tu: 1, den: 0 } })), muc: 2, de: 'Tìm $m$ để đường thẳng $y = (m + 3)x + 1$ $(m \\ne -3)$ song song với đường thẳng $y = -x + 5$.',
        dapAn: { kieu: 'so', gt: -4 },
        goiY: ['Song song khi hai hệ số góc bằng nhau (và $1 \\ne 5$).', 'Giải $m + 3 = -1$.'],
        loiGiai: ['$m + 3 = -1$ và $1 \\ne 5$ (đúng).', '$m = -4$ thoả mãn $m \\ne -3$.', 'Vậy $m = -4$'],
        loiThuongGap: [{ gt: 2, giaiThich: 'Chuyển $3$ sang vế phải phải đổi dấu: $m = -1 - 3 = -4$.' }] },

      { id: '29.9', hinhGiai: hg(mp(Object.assign({}, B299, { duong: [{ a: 2, b: -1, nhan: 'y = 2x − 1' }, { a: 2, b: 5, mau: '--cc', nhan: 'y = 2x + 5' }] }))), muc: 2, de: 'Tìm hàm số bậc nhất có đồ thị song song với đường thẳng $y = 2x - 1$ và đi qua điểm $(-1; 3)$.',
        dapAn: { kieu: 'bieuThuc', gt: '2x+5' },
        goiY: ['Song song nên cùng hệ số góc: $y = 2x + b$ ($b \\ne -1$).', 'Thay $x = -1$, $y = 3$: $3 = 2\\cdot(-1) + b$.'],
        loiGiai: ['$y = 2x + b$; qua $(-1; 3)$: $3 = -2 + b$, nên $b = 5$ (khác $-1$).', '$y = 2x + 5$'],
        loiThuongGap: [{ gt: '2x+1', giaiThich: 'Hoành độ là $-1$: $2\\cdot(-1) = -2$, nên $3 = -2 + b$, $b = 5$.' }, { gt: '2x-1', giaiThich: 'Đó chính là đường thẳng đã cho (trùng, không song song) và nó không đi qua $(-1; 3)$.' }] },

      { id: '29.10', hinhGiai: hg(mp({ khung: [-2, 2, -6, 8], tiLe: false, duong: [{ a: 6, b: 2, nhan: 'y = 6x + 2', nhanX: -0.75 }, { a: 6, b: -1, mau: '--cc', nhan: 'y = 6x − 1', nhanX: 1.2 }], tinhTien: { tu: 1, den: 0 } }, { ghiChu: 'Với m = 2. ' + KHAC_TI_LE })), muc: 3, de: 'Cho hai hàm số bậc nhất $y = 3mx + 2$ và $y = (m + 4)x - 1$. Tìm $m$ để đồ thị của chúng là hai đường thẳng song song.',
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Song song khi $3m = m + 4$ (và $2 \\ne -1$, luôn đúng).', 'Nhớ kiểm tra hai hệ số góc khác $0$.'],
        loiGiai: ['$3m = m + 4$, nên $2m = 4$, $m = 2$.', 'Khi đó $3m = 6 \\ne 0$, $m + 4 = 6 \\ne 0$ (thoả mãn).', 'Vậy $m = 2$'],
        loiThuongGap: [{ gt: 1, giaiThich: 'Chuyển $m$ sang vế trái phải đổi dấu: $3m - m = 2m$, không phải $4m$.' }] },

      { id: '29.11', hinhGiai: hg(mp({ khung: [-2, 5, -3, 6], duong: [{ a: 2, b: -1, nhan: 'y = 2x − 1', nhanX: 3.3 }, { a: -1, b: 5, mau: '--cc', nhan: 'y = −x + 5' }], giao: [0, 1], mauGiao: '--cc', diem: [{ x: 2, y: 3, ten: '', chieu: true }] })), muc: 3, de: 'Tìm toạ độ giao điểm của hai đường thẳng $y = 2x - 1$ và $y = -x + 5$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Hoành độ giao điểm', kieu: 'so', gt: 2, loiThuongGap: [{ gt: 4 / 3, giaiThich: 'Chuyển $-x$ sang trái phải thành $+x$: $2x + x = 3x$, và $-1$ sang phải thành $+1$: $3x = 6$.' }] },
          { nhan: 'Tung độ giao điểm', kieu: 'so', gt: 3, loiThuongGap: [{ gt: 2, giaiThich: '$2$ là hoành độ. Tung độ: thay $x = 2$ vào $y = 2x - 1$.' }] }] },
        goiY: ['Tại giao điểm hai giá trị $y$ bằng nhau: $2x - 1 = -x + 5$.', 'Tìm $x$ rồi thay vào một trong hai công thức để tìm $y$.'],
        loiGiai: ['$2x - 1 = -x + 5$, nên $3x = 6$, $x = 2$.', 'Thay vào: $y = 2\\cdot 2 - 1 = 3$.', 'Giao điểm là $(2; 3)$. Thử lại: $-2 + 5 = 3$. Đúng!'] },

      { id: '29.12', muc: 3, de: 'Cho hàm số bậc nhất $y = (m - 1)x + 7$. a) Tìm $m$ để đồ thị song song với đường thẳng $y = -2x$. b) Với $m$ đó, gọi $A$ là giao điểm của đồ thị với đường thẳng $y = x + 1$, $B$ là giao điểm của $y = x + 1$ với trục $Ox$. Tính diện tích tam giác $OAB$ (đơn vị đo trên trục là cm).',
        hinh: { widget: 'doThi', config: { bbox: [-3, 6, 5, -1.5], duong: [{ a: -2, b: 7 }, { a: 1, b: 1 }], doan: [[0, 0, 2, 3, { mau: CAM }], [-1, 0, 0, 0, { mau: CAM }], [-1, 0, 2, 3, { mau: CAM }]], diem: [{ x: 2, y: 3, ten: 'A' }, { x: -1, y: 0, ten: 'B' }, { x: 0, y: 0, ten: 'O' }] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $m =$', kieu: 'so', gt: -1, loiThuongGap: [{ gt: -3, giaiThich: '$m - 1 = -2$ thì $m = -2 + 1 = -1$.' }] },
          { nhan: 'Hoành độ của $A$', kieu: 'so', gt: 2 },
          { nhan: 'Tung độ của $A$', kieu: 'so', gt: 3 },
          { nhan: 'Diện tích tam giác $OAB$ (cm²)', kieu: 'so', gt: 1.5, loiThuongGap: [{ gt: 3, giaiThich: 'Diện tích tam giác $= \\frac{1}{2}\\cdot$ đáy $\\cdot$ chiều cao: $\\frac{1}{2}\\cdot 1\\cdot 3$.' }] }] },
        goiY: ['Song song: $m - 1 = -2$. Khi đó đồ thị là $y = -2x + 7$.', 'Giải $-2x + 7 = x + 1$ để tìm $A$. $B$: cho $y = 0$ trong $y = x + 1$.', 'Tam giác $OAB$ có đáy $OB$ nằm trên $Ox$, chiều cao là tung độ của $A$.'],
        loiGiai: ['a) $m - 1 = -2$ nên $m = -1$; hàm số là $y = -2x + 7$ ($7 \\ne 0$, thoả mãn).', 'b) $-2x + 7 = x + 1$, nên $3x = 6$, $x = 2$, $y = 3$: $A(2; 3)$.', '$B$: $x + 1 = 0$, $x = -1$: $B(-1; 0)$, nên $OB = 1$ cm.', 'Chiều cao từ $A$ xuống $Ox$ bằng $3$ cm. $S_{OAB} = \\frac{1}{2}\\cdot 1\\cdot 3 = 1{,}5$ (cm²).'] }
    ],

    timLoi: [
      { de: 'Bạn Tròn tìm hệ số góc của đường thẳng $y = \\frac{2x + 1}{2}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Trên tử số, hệ số của $x$ là $2$.', 'Vậy đường thẳng có hệ số góc $a = 2$.'],
        dongSai: 1, giaiThich: 'Phải đưa về dạng $y = ax + b$ trước: $\\frac{2x + 1}{2} = x + \\frac{1}{2}$. Hệ số của $x$ sau khi chia cho mẫu là $1$.',
        sua: '$y = x + \\frac{1}{2}$, hệ số góc $a = 1$.' },
      { de: 'Bạn Vuông xét hai đường thẳng $y = 2(x + 1)$ và $y = 2x + 2$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$y = 2(x + 1)$ có hệ số góc $a = 2$; $y = 2x + 2$ có hệ số góc $a\' = 2$.', 'Hai hệ số góc bằng nhau.', 'Vậy hai đường thẳng song song với nhau.'],
        dongSai: 2, giaiThich: '$y = 2(x + 1) = 2x + 2$, nên $b = b\' = 2$. Cùng $a$ **và** cùng $b$ thì hai đường thẳng **trùng nhau**, không phải song song.',
        sua: 'Vì $a = a\'$ và $b = b\' = 2$ nên hai đường thẳng trùng nhau.' },
      { de: 'Đề: "Tìm $m$ để đường thẳng $y = mx + 1$ $(m \\ne 0)$ cắt đường thẳng $y = 3x$." Bạn Minh giải như sau. Dòng nào sai?',
        loiGiaiSai: ['Hai đường thẳng cắt nhau khi hai hệ số góc bằng nhau.', 'Vậy $m = 3$.'],
        dongSai: 0, giaiThich: 'Hệ số góc **bằng nhau** là trường hợp song song (hoặc trùng). Cắt nhau khi hai hệ số góc **khác nhau**.',
        sua: 'Cắt nhau khi $m \\ne 3$; kết hợp điều kiện: $m \\ne 0$ và $m \\ne 3$.' }
    ]
  });
})();
