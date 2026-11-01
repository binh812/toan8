// Bài 18 – Thu thập và phân loại dữ liệu (SGK Toán 8 KNTT, Tập 1, tr. 90–92)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  // ---------- Hình động: số liệu liên tục (chiều cao) và số liệu rời rạc (số môn thể thao) ----------
  var khamPhaBuild = function (board, G) {
    var env = { h: 132.9, n: 2 };
    var fmt = TOAN8.fmtSo;
    function xh(h) { return (h - 120) / 30 * 12; }
    // Trục chiều cao: 120 → 150 cm, kẻ vạch mỗi 5 cm
    G.label(0, 6.1, '(A) Chiều cao h (cm) – đo bằng thước', { fontSize: 16, strokeColor: XANH, highlightStrokeColor: XANH });
    G.seg([0, 4], [12, 4], { strokeColor: XANH, strokeWidth: 6 });
    for (var h = 120; h <= 150; h += 5) {
      G.seg([xh(h), 3.8], [xh(h), 4.2], { strokeColor: '#343a40', strokeWidth: 2 });
      G.label(xh(h) - 0.35, 3.35, String(h), { fontSize: 13, cssClass: '', highlightCssClass: '' });
    }
    board.create('point', [function () { return xh(env.h); }, 4], { name: '', size: 8, color: XANH, fixed: true, showInfobox: false });
    G.label(function () { return xh(env.h) - 0.9; }, 5.1, function () { return 'h = ' + fmt(env.h, 1) + ' cm'; }, { fontSize: 16 });

    // Trục số môn thể thao: chỉ có các giá trị 0, 1, 2, …, 6
    G.label(0, 2.1, '(B) Số môn thể thao n – đếm', { fontSize: 16, strokeColor: CAM, highlightStrokeColor: CAM });
    G.seg([0, 0], [12, 0], { strokeColor: '#ced4da', strokeWidth: 2 });
    for (var k = 0; k <= 6; k++) {
      board.create('point', [2 * k, 0], { name: '', size: 4, color: CAM, fixed: true, showInfobox: false });
      G.label(2 * k - 0.15, -0.6, String(k), { fontSize: 13, cssClass: '', highlightCssClass: '' });
    }
    board.create('point', [function () { return 2 * env.n; }, 0], { name: '', size: 9, color: CAM, fixed: true, showInfobox: false });
    G.label(function () { return 2 * env.n - 0.7; }, 1.05, function () { return 'n = ' + env.n; }, { fontSize: 16 });

    var sl = TOAN8.makeSliders([
      { ten: 'h', min: 120, max: 150, buoc: 0.1, gt: env.h, nhan: '<b style="color:' + XANH + '">Chiều cao h</b>' },
      { ten: 'n', min: 0, max: 6, buoc: 1, gt: env.n, nhan: '<b style="color:' + CAM + '">Số môn n</b>' }
    ], env, function () { board.update(); });
    board.containerObj.parentNode.appendChild(sl);
  };

  // ---------- Sơ đồ phân loại dữ liệu (SGK tr. 91) ----------
  function hop(board, x, y, html, mau) {
    var css = 'background:' + mau + ';color:#fff;padding:6px 10px;border-radius:8px;text-align:center;font-weight:600;line-height:1.25';
    board.create('text', [x, y, html], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: '#fff', highlightStrokeColor: '#fff', fixed: true, cssStyle: css, highlightCssStyle: css, display: 'html' });
  }
  function muiTen(board, a, b) { board.create('arrow', [a, b], { strokeColor: '#495057', strokeWidth: 2, fixed: true }); }
  var soDoBuild = function (board) {
    hop(board, 8, 8, 'Dữ liệu', '#495057');
    hop(board, 4, 5.2, 'Dữ liệu là số<br>(số liệu)', XANH);
    hop(board, 12, 5.2, 'Dữ liệu<br>không là số', CAM);
    hop(board, 2, 1.8, 'Số liệu<br>rời rạc', XANH);
    hop(board, 6, 1.8, 'Số liệu<br>liên tục', XANH);
    hop(board, 10, 1.8, 'Không là số,<br>không thể<br>sắp thứ tự', CAM);
    hop(board, 14, 1.8, 'Không là số,<br>có thể<br>sắp thứ tự', CAM);
    muiTen(board, [7.2, 7.6], [4.8, 6]); muiTen(board, [8.8, 7.6], [11.2, 6]);
    muiTen(board, [3.5, 4.4], [2.4, 2.9]); muiTen(board, [4.5, 4.4], [5.6, 2.9]);
    muiTen(board, [11.5, 4.4], [10.4, 3]); muiTen(board, [12.5, 4.4], [13.6, 3]);
  };

  TOAN8.bai({
    id: 18, ten: 'Thu thập và phân loại dữ liệu', sgk: { tap: 1, trang: 90 },

    khamPha: {
      nhiemVu: 'Kéo hai thanh trượt. **(A)** là chiều cao của một bạn (đo bằng thước), **(B)** là số môn thể thao bạn đó biết chơi (đếm). Em thấy $h$ dừng được ở $131{,}3$; $131{,}4$;… (đo bằng thước chính xác hơn thì còn được $131{,}35$ cm). Còn $n$ có dừng được ở giữa $3$ và $4$ không?',
      widget: 'geo',
      config: { bbox: [-1, 7, 13, -1.4], wide: true, build: khamPhaBuild },
      cauHoi: {
        de: 'Số môn thể thao $n$ có thể bằng $3{,}5$ không? Vậy $n$ thuộc loại số liệu nào?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Có; $n$ là số liệu liên tục', 'Không; $n$ là số liệu rời rạc', 'Có; $n$ là số liệu rời rạc', 'Không; $n$ là số liệu liên tục'] },
        goiY: ['Có ai biết chơi "ba môn rưỡi" không?', '$n$ có được bằng cách **đếm** nên chỉ nhận các giá trị $0, 1, 2, 3, \\ldots$'],
        loiGiai: [
          'Chiều cao $h$ có thể nhận **bất kì** giá trị nào giữa $120$ và $150$ cm ($131{,}3$; $131{,}35$; …): đó là **số liệu liên tục**.',
          'Số môn $n$ chỉ nhận các số tự nhiên, không thể bằng $3{,}5$: đó là **số liệu rời rạc**.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Thu thập dữ liệu',
        noiDung: 'Thu thập dữ liệu có thể là **trực tiếp** hoặc **gián tiếp**.\n\n• **Trực tiếp**: thu thập qua **quan sát, làm thí nghiệm, lập bảng hỏi, phỏng vấn**,… (em tự đi lấy dữ liệu).\n\n• **Gián tiếp**: thu thập từ **những nguồn có sẵn** như sách, báo, mạng Internet,…\n\nĐể đưa ra kết luận hợp lí, dữ liệu thu thập được phải **đảm bảo tính đại diện** cho toàn bộ đối tượng đang quan tâm.' },
      { loai: 'chuY', tieuDe: 'Ví dụ cho dễ nhớ',
        noiDung: '• Tra bảng xếp hạng FIFA trên website của FIFA → **gián tiếp** (nguồn có sẵn).\n\n• Trồng cây rồi định kì đo chiều cao → **trực tiếp** (làm thí nghiệm, đo).\n\n• Muốn biết cả khối 8 ngủ mấy tiếng mỗi đêm mà chỉ hỏi 3 bạn cùng bàn → **không** đại diện cho cả khối.' },
      { loai: 'dinhNghia', tieuDe: '2. Số liệu liên tục và số liệu rời rạc',
        noiDung: 'Số liệu có thể nhận **giá trị tuỳ ý trong một khoảng** nào đó được gọi là **số liệu liên tục**.\n\nSố liệu không phải là số liệu liên tục được gọi là **số liệu rời rạc**.' },
      { loai: 'chuY',
        noiDung: '1) Dạng hay gặp của **số liệu liên tục** là số liệu thu được từ các **phép đo** như chiều cao, cân nặng, nhiệt độ, thời gian,…\n\n2) Dạng hay gặp của **số liệu rời rạc** là số liệu **đếm** số phần tử của một tập nào đó, chẳng hạn số học sinh trong lớp, số sản phẩm một công nhân làm được trong ngày,…\n\n**Mẹo:** hỏi "**đo**" được → liên tục; hỏi "**bao nhiêu cái/người**" (đếm) → rời rạc.' },
      { loai: 'hinh', widget: 'geo', config: { bbox: [0, 9.2, 16, 0.2], wide: true, build: soDoBuild },
        chuThich: '**Sơ đồ phân loại dữ liệu.** Dữ liệu không là số lại chia làm hai loại: **có thể sắp thứ tự** (ví dụ mức đánh giá: Rất khó, Khó, Trung bình, Dễ) và **không thể sắp thứ tự** (ví dụ tên môn thể thao, màu sắc, mạng điện thoại đang dùng).' },
      { loai: 'chuY', tieuDe: 'Phát hiện giá trị không hợp lí',
        noiDung: 'Sau khi thu thập, em nên rà lại xem có giá trị nào **vô lí** không. Ví dụ hỏi cân nặng các bạn lớp 8 mà có kết quả $145$ kg, hoặc hỏi số ti vi trong nhà mà có kết quả $52$ chiếc: đó là những giá trị **không hợp lí** (có thể do ghi nhầm).' }
    ],

    viDu: [
      { de: 'Để thu thập mỗi dữ liệu sau, ta nên làm thế nào? Đó là cách thu thập trực tiếp hay gián tiếp?\n\na) Số dân của các tỉnh miền Trung năm 2023.\n\nb) Nhiệt độ ngoài sân trường lúc 7 giờ sáng mỗi ngày trong một tuần.', buoc: [
        { lam: 'a) Vào website của Cục Thống kê (hoặc sách, báo) để tra số dân: thu thập **gián tiếp**.', vi: 'Số dân của cả một tỉnh thì em không tự đếm được; dữ liệu này **đã có sẵn** ở nguồn chính thức.' },
        { lam: 'b) Đặt nhiệt kế ngoài sân, mỗi sáng lúc 7 giờ đọc và ghi lại: thu thập **trực tiếp**.', vi: 'Em tự **đo** (quan sát, làm thí nghiệm) nên đó là thu thập trực tiếp.' } ] },
      { de: 'Quỳnh hỏi 4 bạn và ghi lại câu trả lời.\n\na) "Nhà bạn có mấy chiếc xe máy?" Kết quả: $2$; $1$; $30$; $3$.\n\nb) "Bạn đi từ nhà đến trường mất bao lâu (phút)?" Kết quả: $12{,}5$; $8$; $20{,}3$; $15$.\n\nMỗi dãy dữ liệu thuộc loại nào? Chỉ ra giá trị không hợp lí nếu có.', buoc: [
        { lam: 'a) Số xe máy có được bằng cách **đếm** → **số liệu rời rạc**.', vi: 'Không có nhà nào có "$1{,}5$ chiếc xe máy": giá trị chỉ là số tự nhiên.' },
        { lam: 'Giá trị $30$ (chiếc xe máy) **không hợp lí** với một gia đình.', vi: 'Có thể bạn ghi nhầm $3$ thành $30$.' },
        { lam: 'b) Thời gian có được bằng **phép đo** (đồng hồ) → **số liệu liên tục**.', vi: 'Thời gian có thể nhận mọi giá trị trong một khoảng: $12{,}5$ phút, $12{,}55$ phút,…' } ] },
      { de: 'Các dữ liệu sau thuộc loại nào?\n\na) Mức độ hài lòng của khách: Rất hài lòng; Hài lòng; Bình thường; Không hài lòng.\n\nb) Màu áo yêu thích của các bạn: Xanh; Đỏ; Trắng; Vàng.', buoc: [
        { lam: 'Cả hai dãy đều là **dữ liệu không là số**.', vi: 'Các giá trị là chữ (tên mức, tên màu), không phải số.' },
        { lam: 'a) Các mức hài lòng **sắp xếp được** từ cao xuống thấp → dữ liệu không là số, **có thể sắp thứ tự**.', vi: '"Rất hài lòng" rõ ràng cao hơn "Hài lòng", "Hài lòng" cao hơn "Bình thường",…' },
        { lam: 'b) Các màu không có màu nào "lớn hơn" màu nào → dữ liệu không là số, **không thể sắp thứ tự**.', vi: 'Không có thứ tự tự nhiên nào giữa Xanh, Đỏ, Trắng, Vàng.' } ] },
      { de: 'Em muốn ước lượng **thời gian tự học ở nhà** mỗi ngày (đơn vị: giờ) của các bạn trong lớp. Hãy đưa ra cách thu thập dữ liệu và cho biết dữ liệu thu được thuộc loại nào.', buoc: [
        { lam: 'Lập phiếu hỏi "Mỗi ngày bạn tự học ở nhà khoảng bao nhiêu giờ?" và phát cho **tất cả** các bạn trong lớp.', vi: 'Hỏi cả lớp (không chỉ vài bạn thân) để dữ liệu **đại diện** cho cả lớp. Đây là thu thập **trực tiếp** (lập bảng hỏi).' },
        { lam: 'Dữ liệu thu được (ví dụ $1{,}5$; $2$; $2{,}25$ giờ) là **số liệu liên tục**.', vi: 'Thời gian là đại lượng **đo** được, có thể nhận mọi giá trị trong một khoảng.' } ] }
    ],

    viDuMo: [
      { de: 'Hà hỏi 5 bạn: "Bạn nặng bao nhiêu kilôgam?" Kết quả: $45$; $50$; $47$; $154$; $49$. Dãy này thuộc loại nào, giá trị nào không hợp lí?', buoc: [
        { lam: 'Cân nặng có được nhờ **phép đo** nên đây là **số liệu liên tục**.', vi: 'Cân nặng có thể là $47{,}3$ kg, $47{,}35$ kg,…; ở đây chỉ ghi tròn số.' },
        { lam: 'Giá trị không hợp lí là $154$ (kg).', vi: 'Em hãy nhập giá trị không hợp lí:', an: true,
          dapAn: { kieu: 'so', gt: 154 },
          loiThuongGap: [{ gt: 45, giaiThich: '$45$ kg là cân nặng bình thường của học sinh lớp 8. Em tìm giá trị **quá lớn** so với các bạn còn lại.' }] } ] },
      { de: 'Hỏi 5 bạn "Bạn có mấy anh chị em ruột?", kết quả: $1$; $0$; $2$; $1$; $3$. Dãy dữ liệu này thuộc loại nào?', buoc: [
        { lam: 'Đây là dữ liệu là số (số liệu).', vi: 'Các giá trị đều là số.' },
        { lam: 'Số anh chị em có được bằng cách **đếm** nên là **số liệu rời rạc**.', vi: 'Em hãy chọn loại dữ liệu:', an: true,
          dapAn: { kieu: 'chon', gt: 0, luaChon: ['Số liệu rời rạc', 'Số liệu liên tục', 'Dữ liệu không là số, có thể sắp thứ tự', 'Dữ liệu không là số, không thể sắp thứ tự'] } } ] }
    ],

    baiTap: [
      { id: '18.1', muc: 1, de: 'Dữ liệu nào sau đây là **số liệu liên tục**?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Tên các bạn trong đội tuyển cờ vua của trường.', 'Mức độ yêu thích môn Toán: Thích, Bình thường, Không thích.', 'Thời gian chạy $100$ m (giây) của các bạn lớp 8B.', 'Số bạn nữ trong mỗi tổ của lớp.'] },
        goiY: ['Số liệu liên tục thường có được từ **phép đo**.', 'Trong bốn dữ liệu, cái nào phải dùng đồng hồ, thước, cân… để đo?'],
        loiGiai: ['Tên các bạn và mức độ yêu thích là dữ liệu **không là số**.', 'Số bạn nữ có được bằng cách **đếm** → rời rạc.', 'Thời gian chạy đo bằng đồng hồ, có thể nhận mọi giá trị trong một khoảng ($14{,}2$ s; $14{,}25$ s;…) → **liên tục**.'] },

      { id: '18.2', muc: 1, de: 'Minh đứng ở cổng trường và ghi lại những bạn đi xe đạp có đội mũ bảo hiểm. Minh thu thập dữ liệu bằng phương pháp nào?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Từ nguồn có sẵn', 'Quan sát', 'Lập bảng hỏi', 'Phỏng vấn'] },
        goiY: ['Minh có hỏi ai, có phát phiếu cho ai không?', 'Minh chỉ **nhìn** và ghi lại.'],
        loiGiai: ['Minh không hỏi ai, không dùng phiếu, không tra sách báo: Minh chỉ nhìn và ghi lại.', 'Đó là phương pháp **quan sát** (thu thập trực tiếp).'] },

      { id: '18.3', muc: 1, de: 'Lan lên mạng Internet tra số huy chương vàng của đoàn Việt Nam tại một kì SEA Games. Khẳng định "Lan thu thập dữ liệu **trực tiếp**" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Thu thập gián tiếp là lấy từ những nguồn **có sẵn** như sách, báo, Internet.', 'Dữ liệu Lan tra đã có sẵn trên mạng.'],
        loiGiai: ['Lan lấy dữ liệu từ nguồn có sẵn (Internet) → thu thập **gián tiếp**.', 'Khẳng định đã cho là **sai**.'] },

      { id: '18.4', muc: 1, de: 'Câu hỏi "Gia đình bạn có bao nhiêu người?" cho ta dữ liệu thuộc loại nào?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Số liệu rời rạc', 'Số liệu liên tục', 'Dữ liệu không là số, không thể sắp thứ tự', 'Dữ liệu không là số, có thể sắp thứ tự'] },
        goiY: ['Câu trả lời là số hay chữ?', 'Số người có được bằng cách đo hay đếm?'],
        loiGiai: ['Câu trả lời là số ($3$, $4$, $5$,…) nên là số liệu.', 'Số người có được bằng cách **đếm**, không thể là $4{,}5$ người → **số liệu rời rạc**.'] },

      { id: '18.5', muc: 2, de: 'Xếp loại học tập của các bạn tổ 1: Tốt; Khá; Tốt; Đạt; Khá. Dữ liệu này thuộc loại nào?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['Số liệu rời rạc', 'Số liệu liên tục', 'Dữ liệu không là số, không thể sắp thứ tự', 'Dữ liệu không là số, có thể sắp thứ tự'] },
        goiY: ['Các giá trị là chữ nên đây là dữ liệu không là số.', 'Có thể xếp "Tốt", "Khá", "Đạt" theo thứ tự cao – thấp không?'],
        loiGiai: ['Tốt, Khá, Đạt là chữ → dữ liệu **không là số**.', 'Ta xếp được: Tốt > Khá > Đạt → **có thể sắp thứ tự**.'] },

      { id: '18.6', muc: 2, de: 'An hỏi 6 bạn lớp 8: "Bạn cao bao nhiêu xăng-ti-mét?" và ghi được: $152$; $148{,}5$; $160$; $15{,}5$; $155$; $149$. Giá trị nào **không hợp lí**?',
        dapAn: { kieu: 'so', gt: 15.5 },
        goiY: ['Học sinh lớp 8 thường cao khoảng $140$ – $175$ cm.', 'Giá trị nào nhỏ đến mức vô lí?'],
        loiGiai: ['Các giá trị $148{,}5$; $149$; $152$; $155$; $160$ đều là chiều cao bình thường của học sinh lớp 8.', 'Không bạn lớp 8 nào cao $15{,}5$ cm (có thể An ghi nhầm $155$). Giá trị không hợp lí là $15{,}5$.'],
        loiThuongGap: [{ gt: 160, giaiThich: 'Cao $160$ cm vẫn rất bình thường với học sinh lớp 8. Em tìm giá trị **nhỏ** vô lí.' }] },

      { id: '18.7', muc: 2, de: 'Trong 5 dãy dữ liệu sau, có **bao nhiêu** dãy là số liệu rời rạc?\n\n(1) Số bàn thắng mỗi trận của một đội bóng: $2$; $0$; $1$; $3$.\n\n(2) Nhiệt độ lúc 7 giờ sáng (°C) trong 3 ngày: $24{,}5$; $26{,}1$; $25$.\n\n(3) Số tin nhắn em nhận được mỗi ngày: $12$; $8$; $15$.\n\n(4) Thời gian ngủ mỗi đêm (giờ): $8$; $7{,}5$; $9$.\n\n(5) Số trang sách em đọc mỗi ngày: $20$; $35$; $18$.',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Dãy nào có được bằng cách **đếm**? Dãy nào có được bằng **phép đo**?', 'Nhiệt độ và thời gian là đo; bàn thắng, tin nhắn, trang sách là đếm.'],
        loiGiai: ['Đếm (rời rạc): (1) số bàn thắng, (3) số tin nhắn, (5) số trang sách.', 'Đo (liên tục): (2) nhiệt độ, (4) thời gian ngủ.', 'Số dãy rời rạc là $3$.'],
        loiThuongGap: [
          { gt: 5, giaiThich: 'Không phải dãy số nào cũng rời rạc: nhiệt độ và thời gian ngủ là số liệu **đo** → liên tục.' },
          { gt: 4, giaiThich: 'Thời gian ngủ $8$; $9$ giờ trông như số nguyên nhưng vẫn là đại lượng **đo** (có thể là $7{,}5$ giờ) → liên tục.' }] },

      { id: '18.8', muc: 2, de: 'Để biết **tên 5 con sông dài nhất thế giới**, nên thu thập dữ liệu bằng cách nào?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['Làm thí nghiệm', 'Phỏng vấn các bạn trong lớp', 'Tìm trong sách, báo, Internet', 'Quan sát'] },
        goiY: ['Em có tự đi đo chiều dài các con sông được không?', 'Dữ liệu này đã được các nhà khoa học công bố sẵn.'],
        loiGiai: ['Không thể tự đo hay quan sát các con sông trên thế giới; hỏi các bạn thì dễ sai.', 'Nên tra từ **nguồn có sẵn**: sách, báo, Internet (thu thập gián tiếp).'] },

      { id: '18.9', muc: 2, de: 'Nam muốn biết thời gian tự học trung bình của **học sinh cả khối 8** nên chỉ hỏi 5 bạn trong đội tuyển Toán. Khẳng định "Dữ liệu Nam thu được đại diện tốt cho cả khối 8" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Dữ liệu phải đảm bảo **tính đại diện** cho toàn bộ đối tượng quan tâm.', '5 bạn đội tuyển Toán có giống mọi bạn trong khối không?'],
        loiGiai: ['5 bạn đội tuyển thường học nhiều hơn hẳn các bạn khác, và 5 bạn là quá ít so với cả khối.', 'Dữ liệu **không** đại diện cho cả khối 8. Khẳng định **sai**.'] },

      { id: '18.10', muc: 3, de: 'Lớp 8C có $40$ học sinh. Hoa phát phiếu hỏi "Mỗi tuần bạn đọc mấy cuốn sách?" cho cả lớp và thu về $38$ phiếu, trong đó có $3$ phiếu ghi giá trị không hợp lí (như $70$ cuốn). Số phiếu **dùng được** chiếm bao nhiêu phần trăm số học sinh của lớp?',
        dapAn: { kieu: 'so', gt: 87.5 },
        goiY: ['Phiếu dùng được = phiếu thu về − phiếu không hợp lí.', 'Tỉ lệ phần trăm = (số phiếu dùng được) : $40 \\cdot 100\\%$.'],
        loiGiai: ['Số phiếu dùng được: $38 - 3 = 35$.', 'Tỉ lệ: $\\frac{35}{40} \\cdot 100\\% = 87{,}5\\%$.', 'Đáp số: $87{,}5\\%$.'],
        loiThuongGap: [
          { gt: 92.5, giaiThich: 'Em lấy $40 - 3 = 37$ phiếu? Chỉ thu về $38$ phiếu, nên số phiếu dùng được là $38 - 3 = 35$.' },
          { gt: 95, giaiThich: '$\\frac{38}{40} = 95\\%$ là tỉ lệ phiếu thu về; còn phải bỏ $3$ phiếu không hợp lí.' }] },

      { id: '18.11', muc: 3, de: 'Em muốn ước lượng **thời gian dùng điện thoại mỗi ngày** (đơn vị: giờ) của các bạn trong lớp. Cách làm nào hợp lí nhất, và dữ liệu thu được thuộc loại nào?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Hỏi 3 bạn ngồi cạnh; số liệu rời rạc.', 'Phát phiếu hỏi cho cả lớp; số liệu liên tục.', 'Tìm trên Internet; số liệu liên tục.', 'Phát phiếu hỏi cho cả lớp; số liệu rời rạc.'] },
        goiY: ['Muốn biết về **các bạn trong lớp** thì phải hỏi ai? Hỏi mấy bạn mới đại diện?', 'Thời gian là đại lượng đếm hay đo?'],
        loiGiai: ['Hỏi 3 bạn thì không đại diện; Internet không có dữ liệu về lớp em → phát phiếu hỏi **cả lớp**.', 'Thời gian là đại lượng **đo** → **số liệu liên tục**.'] },

      { id: '18.12', muc: 3, de: 'Khối 8 tổ chức giải bóng đá giữa 5 lớp A, B, C, D, E. Bình hỏi $12$ bạn dự đoán đội vô địch và ghi được: A, B, A, C, A, B, D, A, B, A, E, A. Có bao nhiêu **phần trăm** số bạn được hỏi dự đoán đội A vô địch?',
        dapAn: { kieu: 'so', gt: 50 },
        goiY: ['Đếm số lần chữ A xuất hiện.', 'Tỉ lệ phần trăm = (số lần A) : $12 \\cdot 100\\%$.'],
        loiGiai: ['(Dữ liệu Bình thu được là dữ liệu **không là số**, không thể sắp thứ tự.)', 'Chữ A xuất hiện $6$ lần (vị trí thứ 1, 3, 5, 8, 10, 12).', 'Tỉ lệ: $\\frac{6}{12} \\cdot 100\\% = 50\\%$.'],
        loiThuongGap: [{ gt: 6, giaiThich: '$6$ là **số bạn**; đề hỏi **phần trăm**: $\\frac{6}{12} = 50\\%$.' }] }
    ],

    timLoi: [
      { de: 'Tùng phân loại dãy cân nặng (kg) của 5 bạn: $42$; $45$; $50$; $47$; $44$. Dòng nào sai?',
        loiGiaiSai: ['Các giá trị đều là số nguyên.', 'Vậy dãy cân nặng này là số liệu rời rạc.'],
        dongSai: 1,
        giaiThich: 'Cân nặng có được nhờ **phép đo**, có thể nhận mọi giá trị trong một khoảng ($44{,}5$ kg, $44{,}55$ kg…). Ghi số nguyên chỉ là do làm tròn. Đây là **số liệu liên tục**.',
        sua: 'Cân nặng là đại lượng đo được nên dãy này là **số liệu liên tục**.' },
      { de: 'Mai phân loại dữ liệu "Mức độ hài lòng của khách: Rất hài lòng; Hài lòng; Không hài lòng". Dòng nào sai?',
        loiGiaiSai: ['Dữ liệu này không phải là số.', 'Các mức này không thể sắp xếp theo thứ tự.', 'Vậy đây là dữ liệu không là số, không thể sắp thứ tự.'],
        dongSai: 1,
        giaiThich: 'Các mức hài lòng **xếp được** theo thứ tự: Rất hài lòng > Hài lòng > Không hài lòng. Nên đây là dữ liệu không là số, **có thể sắp thứ tự**.',
        sua: 'Các mức này sắp xếp được theo thứ tự, nên đây là dữ liệu không là số, **có thể sắp thứ tự**.' }
    ]
  });
})();
