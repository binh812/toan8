// Bài 21 – Phân thức đại số (SGK Toán 8 KNTT Tập 2, tr. 4–7)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', DO = '#e03131';

  // Hình động "bảng giá trị": kéo điểm cam trên trục hoành để chọn x; bảng dưới hình cho tử, mẫu, giá trị phân thức.
  // o: { bbox, x0, buoc, ham:[{fn, mau, dash}], tiemCan:[x mà mẫu = 0], lo:[[x, y, mau]] (điểm rỗng), dong:[{chu, tex, fn, mau, mau0}] }
  function bangGiaTri(o) {
    return { bbox: o.bbox, axis: true, grid: true, build: function (board, G) {
      var T = TOAN8, buoc = o.buoc || 0.5, X;
      function xv() { return Math.round(X.X() / buoc) * buoc; }
      (o.tiemCan || []).forEach(function (a) {
        board.create('line', [[a, 0], [a, 1]], { strokeColor: DO, dash: 2, strokeWidth: 2, fixed: true, highlight: false });
      });
      (o.ham || []).forEach(function (h) {
        board.create('functiongraph', [h.fn], { strokeColor: h.mau, strokeWidth: h.day || 3, dash: h.dash || 0, fixed: true, highlight: false });
      });
      (o.lo || []).forEach(function (p) {
        board.create('point', [p[0], p[1]], { name: '', size: 5, fillColor: '#fff', strokeColor: p[2] || '#343a40', strokeWidth: 2, fixed: true, showInfobox: false, highlight: false });
      });
      X = G.glider('', o.x0, 0, board.defaultAxes.x, { color: CAM });
      X.on('up', function () { X.moveTo([xv(), 0]); });
      (o.ham || []).forEach(function (h) {
        if (h.diem === false) return;
        board.create('point', [function () { return xv(); }, function () { var v = h.fn(xv()); return isFinite(v) ? v : NaN; }],
          { name: '', size: 4, color: h.mau, fixed: true, showInfobox: false, highlight: false });
      });
      var box = T.el('div', { class: 'dt-tong' });
      board.containerObj.parentNode.appendChild(box);
      function ve() {
        var x = xv();
        box.innerHTML = '<div>Em đang chọn ' + T.tex('x = ' + T.fmtSo(x).replace('−', '-')) + '</div>' + o.dong.map(function (d) {
          var v = d.fn(x), gt;
          if (!isFinite(v)) gt = '<b style="color:' + DO + '">không xác định</b> (mẫu bằng 0, không chia được)';
          else if (d.mau0 && Math.abs(v) < 1e-12) gt = '<b style="color:' + DO + '">0</b> ⟵ mẫu bằng 0!';
          else gt = '<b>' + T.fmtSo(v) + '</b>';
          return '<div style="margin:8px 0;color:' + (d.mau || 'inherit') + '">' + (d.chu ? d.chu + ' ' : '') + T.tex(d.tex) + ' = ' + gt + '</div>';
        }).join('');
      }
      board.on('update', ve);
      ve();
    } };
  }

  function P(x) { return (x + 1) / (x - 2); }
  var hinhKhamPha = bangGiaTri({
    bbox: [-5, 6, 7, -3], x0: 4,
    ham: [{ fn: P, mau: XANH }], tiemCan: [2],
    dong: [
      { chu: 'Tử thức', tex: 'x+1', fn: function (x) { return x + 1; }, mau: CAM },
      { chu: 'Mẫu thức', tex: 'x-2', fn: function (x) { return x - 2; }, mau: XANH, mau0: true },
      { chu: 'Giá trị', tex: '\\dfrac{x+1}{x-2}', fn: P, mau: LA }
    ]
  });

  function Q(x) { return 3 / (x * x - 4); }
  var hinhHaiChoKhongXacDinh = bangGiaTri({
    bbox: [-5, 4, 5, -3.5], x0: 0,
    ham: [{ fn: Q, mau: XANH }], tiemCan: [-2, 2],
    dong: [
      { chu: 'Mẫu thức', tex: 'x^2-4', fn: function (x) { return x * x - 4; }, mau: XANH, mau0: true },
      { chu: 'Giá trị', tex: '\\dfrac{3}{x^2-4}', fn: Q, mau: LA }
    ]
  });

  // Cấu hình hình cho "Nhìn là hiểu": đoạn chia. Đa thức ghi bằng mảng hệ số từ bậc 0 lên ([3, 2] là 3 + 2x)
  function dc(tuyChon, them) { return Object.assign({ ten: 'doanChia', tuyChon: tuyChon }, them); }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  function so(v) { return String(Math.round(v * 1000) / 1000).replace('.', '{,}'); }
  var MAU_21_7 = { tu: [4, 1], mau: [0, -2, 1], tenTu: 'x + 4', tenMau: 'x² − 2x' };

  TOAN8.bai({
    id: 21, ten: 'Phân thức đại số', sgk: { tap: 2, trang: 4 },

    nhin: {
      tieuDe: 'Đặt đoạn mẫu nối tiếp dọc đoạn tử: mẫu bằng 0 thì không đo được', loai: 'minhHoa',
      luuY: 'Hình vẽ $\\frac{x+1}{x-2}$ tại vài giá trị $x \\ge 2$, khi tử và mẫu không âm. Lập luận chung: $A : B$ là số nhân với $B$ thì được $A$. Khi $B = 0$, số nào nhân với $0$ cũng bằng $0$, nên không có số nào để làm giá trị của $\\frac{3}{0}$. Còn $\\frac{0}{0}$ thì số nào nhân với $0$ cũng ra $0$, không có một giá trị duy nhất, nên cũng không xác định. Vì thế mọi phân thức chỉ có giá trị khi mẫu khác $0$.',
      canh: dc({ tu: [1, 1], mau: [-2, 1], tenTu: 'x + 1', tenMau: 'x − 2', xs: [6, 4, 3, 2.5, 2] },
        { thuPha: true, moTa: 'Đoạn cam là tử x cộng 1, đoạn xanh là mẫu x trừ 2. Các bản của đoạn mẫu đặt nối tiếp dọc đoạn tử. Khi x giảm về 2, đoạn mẫu ngắn dần rồi bằng 0.' }),
      buoc: [
        { t: 0, chu: 'Tại $x = 6$: tử $\\ca{x + 1} = 7$, mẫu $\\cb{x - 2} = 4$. Đặt đoạn mẫu nối tiếp dọc đoạn tử: vừa $1{,}75$ lần. Vậy $\\frac{7}{4} = 1{,}75$.' },
        { t: 0.22, chu: '$x = 4$: mẫu còn $\\cb{2}$, phải đặt $5 : 2 = 2{,}5$ lần.' },
        { t: 0.44, chu: '$x = 3$: mẫu chỉ còn $\\cb{1}$, đặt $4$ lần.' },
        { t: 0.67, chu: '$x = 2{,}5$: mẫu còn $\\cb{0{,}5}$, đặt tới $7$ lần. Mẫu càng ngắn, giá trị càng lớn.' },
        { t: 0.89, chu: '$x = 2$: mẫu dài $\\cb{0}$. Đặt bao nhiêu lần cũng không phủ được đoạn tử dài $3$. Phân thức **không xác định**.' }
      ],
      ketLuan: 'Giá trị của $\\frac{\\ca{A}}{\\cb{B}}$ là số lần $\\cb{B}$ nằm vừa trong $\\ca{A}$. Mẫu bằng $0$ thì không có giá trị, nên **điều kiện xác định** là $$\\cb{B} \\ne 0.$$',
      dung: {
        tieuDe: 'Giá trị nào của x làm đoạn mẫu dài 0?', tuBai: '21.3',
        canh: dc({ tu: [3, 2], mau: [-5, 1], tenTu: '2x + 3', tenMau: 'x − 5', x: 7, xGiai: 5 },
          { moTa: 'Tử 2x cộng 3 và mẫu x trừ 5, vẽ tại x bằng 7.' }),
        moiThu: 'Hình đang vẽ tử và mẫu tại $x = 7$. Em gõ giá trị của $x$ làm phân thức không xác định. Gõ sai thì hình vẽ lại tử và mẫu tại đúng số em gõ.',
        soBatKi: function (v) {
          var loi;
          if (v === -5) loi = 'Tại $x = -5$ mẫu bằng $-10$, khác $0$: vẫn chia được. Giải $x - 5 = 0$ thì chuyển $-5$ sang vế phải thành $+5$.';
          else if (v === -1.5) loi = 'Tại $x = -1{,}5$ **tử** bằng $0$: đoạn tử biến mất, giá trị bằng $0$, vẫn tính được. Phân thức chỉ không xác định khi **mẫu** bằng $0$.';
          else loi = 'Tại $x = ' + so(v) + '$ mẫu bằng $' + so(v - 5) + '$, khác $0$: đoạn mẫu vẫn đặt được. Em tìm $x$ làm đoạn mẫu dài $0$.';
          return { thamSo: { thu: v }, t: 1, loi: loi };
        },
        saiChu: 'Chỉ có một giá trị làm mẫu bằng $0$. Giải $x - 5 = 0$.',
        dungChu: '$x - 5 = 0$ khi $x = 5$. Tại đó đoạn mẫu dài $0$, không đặt được: phân thức không xác định.'
      },
      suyRa: {
        tieuDe: 'Giá trị, điều kiện, bài thực tế: vẫn là tử chia mẫu',
        baDe: [
          { tuBai: '21.7', canh: dc(Object.assign({ x: 3, anGiaTri: true, tachMau: 'x · (x − 2)', hangGiai: [Object.assign({ x: 0 }, MAU_21_7), Object.assign({ x: 2 }, MAU_21_7)] }, MAU_21_7),
            { moTa: 'Phân thức x cộng 4 trên x bình phương trừ 2x, vẽ tại x bằng 3.' }), tenNut: 'Phân tích mẫu',
            phanUng: [{ gt: [2], loi: 'Còn thiếu một giá trị. Mẫu là tích $x \\cdot (x - 2)$: thừa số $x$ bằng $0$ cũng làm mẫu bằng $0$.' },
              { gt: [0], loi: 'Còn thiếu $x = 2$: thừa số $x - 2$ cũng có thể bằng $0$.' },
              { gt: [-4], loi: '$x = -4$ làm **tử** bằng $0$, khi đó giá trị bằng $0$ và vẫn tính được. Cần cho **mẫu** bằng $0$.' }],
            dungChu: '$x^2 - 2x = x(x - 2)$ bằng $0$ khi $x = 0$ hoặc $x = 2$. Hình vẽ cả hai chỗ: đoạn mẫu dài $0$.',
            saiChu: 'Phân tích mẫu thành tích. Một tích bằng $0$ khi một thừa số bằng $0$.' },
          { tuBai: '21.12', de: 'Chi phí để loại bỏ $x\\%$ chất ô nhiễm là $\\frac{2x}{100-x}$ (tỉ đồng). Phân thức này không xác định tại giá trị nào của $x$?',
            dapAn: { kieu: 'nghiem', gt: [100] }, goiY: ['Cho mẫu $100 - x = 0$.'], loiGiai: ['$100 - x = 0$ khi $x = 100$: phân thức không xác định.', 'Vậy không thể loại bỏ hết $100\\%$ chất ô nhiễm.'], loiThuongGap: [],
            canh: dc({ tu: [0, 2], mau: [100, -1], tenTu: '2x', tenMau: '100 − x', xs: [80, 90, 95], xGiai: 100 }, { moTa: 'Tử 2x và mẫu 100 trừ x, vẽ tại x bằng 80, 90 rồi 95.' }), tenNut: 'Tăng dần x',
            phanUng: [{ gt: [0], loi: 'Tại $x = 0$ **tử** bằng $0$: chi phí $0$ đồng, vẫn tính được. Cần cho mẫu $100 - x = 0$.' }],
            dungChu: 'Mẫu $100 - x = 0$ khi $x = 100$. Càng gần $100\\%$, đoạn mẫu càng ngắn và chi phí càng lớn; tới $100\\%$ thì không tính được.',
            saiChu: 'Nhìn đoạn mẫu $100 - x$: nó ngắn dần khi $x$ tăng. Khi nào nó dài $0$?' },
          { tuBai: '21.9', canh: dc({ tu: [-1, 3], mau: [1, 0, 1], tenTu: '3x − 1', tenMau: 'x² + 1', x: -2, anLucDau: true, anGiaTri: true, anSo: true },
            { moTa: 'Phân thức 3x trừ 1 trên x bình phương cộng 1, thay x bằng âm 2.' }), tenNut: 'Thay x = −2',
            phanUng: [{ gt: '7/3', loi: '$(-2)^2 = 4$, không phải $-4$: hình cho thấy mẫu bằng $4 + 1 = 5$.' },
              { gt: '7/5', loi: 'Tử $3 \\cdot (-2) - 1 = -7$ là số âm (đoạn tử nét đứt), nên giá trị cũng âm.' }],
            dungChu: 'Tử $-7$, mẫu $5$: đoạn mẫu nằm $1{,}4$ lần trong đoạn tử, tử âm nên giá trị là $-\\frac{7}{5}$.',
            saiChu: 'Thay $x = -2$ vào cả tử và mẫu (số âm đặt trong ngoặc), rồi lấy tử chia mẫu.' }
        ],
        cachNhan: 'Thấy phân thức thì nghĩ "tử chia mẫu". Hỏi giá trị: thay số vào cả tử và mẫu rồi chia. Hỏi khi nào không xác định: tìm $x$ làm **mẫu** bằng $0$, phân tích mẫu thành tích để không sót giá trị nào.'
      }
    },

    khamPha: {
      nhiemVu: 'Kéo **điểm cam** trên trục hoành để chọn giá trị của $x$. Bảng dưới hình cho biết **tử**, **mẫu** và **giá trị** của phân thức $\\frac{x+1}{x-2}$ (điểm xanh trên đường cong).\n\nEm thử kéo điểm cam tới đường **đỏ nét đứt** xem chuyện gì xảy ra.',
      widget: 'geo',
      config: hinhKhamPha,
      cauHoi: {
        de: 'Tại giá trị nào của $x$ thì phân thức $\\frac{x+1}{x-2}$ **không xác định** (không tính được giá trị)?',
        dapAn: { kieu: 'nghiem', gt: [2] },
        goiY: ['Kéo điểm cam tới chỗ đường đỏ nét đứt và nhìn dòng "Mẫu thức".', 'Phân thức không tính được khi **mẫu bằng 0**: giải $x - 2 = 0$.'],
        loiGiai: [
          'Tại $x = 2$ thì mẫu $x - 2 = 0$. Không chia được cho $0$ nên phân thức **không xác định**.',
          'Vì vậy ta phải có $x - 2 \\ne 0$, tức $x \\ne 2$. Đó gọi là **điều kiện xác định** của phân thức.',
          'Chú ý: tại $x = -1$ thì **tử** bằng $0$, phân thức vẫn tính được và bằng $0$.'
        ]
      }
    },

    mucTieu: [
      'Nhận ra một biểu thức có phải phân thức hay không, và chỉ ra tử, mẫu của nó.',
      'Nói được vì sao phân thức không có giá trị khi mẫu bằng $0$, bằng cách đặt đoạn mẫu dọc đoạn tử.',
      'Tìm điều kiện xác định của phân thức, kể cả khi mẫu là một tích.',
      'Tính giá trị của phân thức tại một giá trị của biến.',
      'Kiểm hai phân thức có bằng nhau không bằng cách nhân chéo.'
    ],
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Phân thức đại số',
        noiDung: 'Một **phân thức đại số** (gọi gọn là **phân thức**) là một biểu thức có dạng $\\frac{\\ca{A}}{\\cb{B}}$, trong đó $A$, $B$ là hai **đa thức** và $B$ **khác đa thức 0**.\n\n$\\ca{A}$ gọi là **tử thức** (tử), $\\cb{B}$ gọi là **mẫu thức** (mẫu).\n\nVí dụ: $\\frac{2x-1}{3x+1}$; $\\;\\frac{x^2-x+1}{2x+1}$; $\\;\\frac{x}{y}$ là các phân thức.' },
      { loai: 'chuY', tieuDe: 'Nhận xét',
        noiDung: '• Mỗi **đa thức** cũng là một phân thức có mẫu bằng $1$. Ví dụ $x^3 - xy = \\frac{x^3-xy}{1}$. Số $0$ và số $1$ cũng là phân thức.\n\n• $\\frac{y+z}{0}$ **không** phải phân thức (mẫu là đa thức 0).\n\n• $\\frac{3-2x}{3+\\frac{1}{x}}$ **không** phải phân thức, vì mẫu $3 + \\frac{1}{x}$ không phải là đa thức.' },
      { loai: 'dinhNghia', tieuDe: '2. Hai phân thức bằng nhau',
        noiDung: 'Hai phân thức $\\frac{A}{B}$ và $\\frac{C}{D}$ gọi là **bằng nhau** nếu $A\\cdot D = B\\cdot C$ ("nhân chéo bằng nhau"). Ta viết $\\frac{A}{B} = \\frac{C}{D}$ nếu $A\\cdot D = B\\cdot C$.\n\nVí dụ: $\\frac{1+x}{1-x^2} = \\frac{1}{1-x}$ vì $(1+x)(1-x) = (1-x^2)\\cdot 1$.' },
      { loai: 'dinhNghia', tieuDe: '3. Điều kiện xác định',
        noiDung: '**Điều kiện xác định** của phân thức $\\frac{A}{B}$ là điều kiện của biến để giá trị của **mẫu thức $B$ khác $0$**.\n\nCách tìm: cho mẫu bằng $0$, tìm $x$; các giá trị đó bị **loại ra**.\n\nVí dụ: $\\frac{x-3}{x+2}$ có điều kiện xác định $x + 2 \\ne 0$, tức $x \\ne -2$.' },
      { loai: 'lapCM', tieuDe: 'Lắp lập luận: điều kiện xác định của $\\frac{3}{x^2-4}$', config: {
        de: 'Xếp các bước theo đúng thứ tự lập luận. Bước nào chưa đủ căn cứ, máy sẽ nói thiếu gì.',
        buoc: [
          { id: 'mau', chu: 'Phân thức có giá trị khi mẫu $x^2 - 4 \\ne 0$.' },
          { id: 'pt', chu: 'Phân tích mẫu: $x^2 - 4 = (x-2)(x+2)$.' },
          { id: 'tich', chu: 'Một tích bằng $0$ khi có một thừa số bằng $0$.' },
          { id: 'a', chu: 'Thừa số $x - 2$ bằng $0$ khi $x = 2$.', can: ['pt', 'tich'] },
          { id: 'b', chu: 'Thừa số $x + 2$ bằng $0$ khi $x = -2$.', can: ['pt', 'tich'] },
          { id: 'kl', chu: 'Vậy điều kiện xác định là $x \\ne 2$ và $x \\ne -2$.', can: ['mau', 'a', 'b'] }
        ],
        ketLuan: 'Mẫu $(x-2)(x+2)$ bằng $0$ ở cả hai chỗ $x = 2$ và $x = -2$, nên phải loại cả hai: $x \\ne 2$ và $x \\ne -2$.'
      } },
      { loai: 'hinh', widget: 'geo', config: hinhHaiChoKhongXacDinh,
        chuThich: 'Phân thức $\\frac{3}{x^2-4}$ có mẫu $x^2 - 4 = (x-2)(x+2)$ bằng $0$ tại **hai** chỗ: $x = 2$ và $x = -2$ (hai đường đỏ nét đứt). Kéo điểm cam tới đó: phân thức không xác định. Điều kiện xác định là $x \\ne 2$ **và** $x \\ne -2$.' },
      { loai: 'dinhNghia', tieuDe: '4. Giá trị của phân thức',
        noiDung: 'Thay các giá trị cho trước của biến (thoả mãn điều kiện xác định) vào phân thức rồi tính, ta được **giá trị của phân thức**.\n\nVí dụ: $\\frac{x^2-x-1}{x^2+3x}$ tại $x = 2$ có giá trị $\\frac{2^2-2-1}{2^2+3\\cdot 2} = \\frac{1}{10}$.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '• Điều kiện xác định là **mẫu** khác $0$, **không** phải tử khác $0$. Tử bằng $0$ thì phân thức bằng $0$ (vẫn tính được).\n\n• Mẫu là tích: $x(x-3) \\ne 0$ khi $x \\ne 0$ **và** $x \\ne 3$. Đừng quên thừa số $x$!\n\n• Mẫu $x^2 + 1$ luôn dương, nên $\\frac{5}{x^2+1}$ xác định với **mọi** $x$.\n\n• Thay số âm phải đặt trong ngoặc: tại $x = -3$ thì $x^2 = (-3)^2 = 9$, không phải $-9$.' }
    ],

    viDu: [
      { de: 'Trong các cách viết sau, cách nào **không** phải phân thức? Viết mẫu thức của các phân thức còn lại: $\\frac{6y^3z}{x^2}$; $\\frac{xy+z}{-3}$; $\\frac{y+z}{0}$; $\\frac{0}{x+1}$; $x^3 - xy$.',
        canh: dc({ hang: [{ tu: 3, mau: 0, tenTu: 'y + z', tenMau: '0' }] }, { ghiChu: 'Tử y + z vẽ với một giá trị bất kì, ở đây bằng 3. Mẫu là đa thức 0 nên với mọi giá trị của biến, đoạn mẫu đều dài 0.' }), buoc: [
        { canh: { t: 1 }, lam: '$\\frac{y+z}{0}$ **không** phải phân thức.', vi: 'Mẫu của phân thức phải khác đa thức $0$. Trên hình: đoạn mẫu dài $0$, không chia được.' },
        { lam: 'Mẫu thức của $\\frac{6y^3z}{x^2}$; $\\frac{xy+z}{-3}$; $\\frac{0}{x+1}$ lần lượt là $x^2$; $-3$; $x+1$.', vi: 'Mẫu là phần nằm **dưới** gạch phân số. Số $-3$ cũng là một đa thức (đa thức bậc 0).' },
        { lam: '$x^3 - xy = \\frac{x^3-xy}{1}$ có mẫu thức là $1$.', vi: 'Mỗi đa thức là một phân thức có mẫu bằng $1$.' } ] },
      { de: 'Giải thích vì sao $\\frac{1+x}{1-x^2} = \\frac{1}{1-x}$.',
        canh: dc({ hang: [{ tu: [1, 1], mau: [1, 0, -1], tenTu: '1 + x', tenMau: '1 − x²', x: 0.5 }, { tu: 1, mau: [1, -1], tenTu: '1', tenMau: '1 − x', x: 0.5 }] },
          { ghiChu: 'Thử tại x = 0,5: hai hàng đặt mẫu cùng số lần. Một lần thử chưa đủ, nhân chéo mới cho thấy hai phân thức bằng nhau với mọi x.' }), buoc: [
        { canh: { t: 0.3 }, lam: 'Nhân chéo: $(1+x)(1-x) = 1 - x^2$.', vi: 'Tử phân thức thứ nhất nhân mẫu phân thức thứ hai. Dùng hiệu hai bình phương.' },
        { canh: { t: 0.7 }, lam: '$(1 - x^2)\\cdot 1 = 1 - x^2$.', vi: 'Mẫu phân thức thứ nhất nhân tử phân thức thứ hai.' },
        { canh: { t: 1 }, lam: 'Hai tích bằng nhau nên $\\frac{1+x}{1-x^2} = \\frac{1}{1-x}$.', vi: 'Theo định nghĩa: $\\frac{A}{B} = \\frac{C}{D}$ nếu $AD = BC$.' } ] },
      { de: 'Viết điều kiện xác định của phân thức $\\frac{x+4}{x^2-3x}$.',
        canh: dc({ tu: [4, 1], mau: [0, -3, 1], tenTu: 'x + 4', tenMau: 'x² − 3x', xs: [5, 4, 3, 1.5, 0] }, { moTa: 'Tử x cộng 4 và mẫu x bình phương trừ 3x, vẽ khi x đi từ 5 về 0.' }), buoc: [
        { canh: { t: 0 }, lam: 'Phân thức xác định khi $x^2 - 3x \\ne 0$.', vi: 'Điều kiện xác định: **mẫu** khác $0$ (không cần để ý tử).' },
        { canh: { t: 0.5 }, lam: '$x^2 - 3x = x(x-3)$.', vi: 'Phân tích mẫu thành nhân tử để thấy rõ khi nào nó bằng $0$. Trên hình: tại $x = 3$ đoạn mẫu dài $0$.' },
        { canh: { t: 1 }, lam: '$x(x-3) \\ne 0$ khi $x \\ne 0$ **và** $x \\ne 3$.', vi: 'Một tích khác $0$ khi **mọi** thừa số đều khác $0$.' } ] },
      { de: 'Tính giá trị của phân thức $\\frac{x^2-x-1}{x^2+3x}$ tại $x = 1$.',
        canh: dc({ tu: [-1, -1, 1], mau: [0, 3, 1], tenTu: 'x² − x − 1', tenMau: 'x² + 3x', x: 1 }, { ghiChu: 'Tử âm nên đoạn tử vẽ nét đứt; giá trị mang dấu trừ.' }), buoc: [
        { canh: { t: 0.3 }, lam: 'Tại $x = 1$: mẫu $1^2 + 3\\cdot 1 = 4 \\ne 0$.', vi: 'Kiểm tra trước: mẫu khác $0$ thì mới tính được.' },
        { canh: { t: 1 }, lam: '$\\frac{1^2 - 1 - 1}{1^2 + 3\\cdot 1} = \\frac{-1}{4}$', vi: 'Thay $x = 1$ vào cả tử và mẫu rồi tính. Đoạn mẫu dài $4$, đoạn tử chỉ dài $1$ nên chỉ đặt được $\\frac{1}{4}$ lần; tử âm nên giá trị âm.' } ] },
      { de: '(Tình huống mở đầu) Cuộc đua xe đạp gồm $9$ km leo dốc, $5$ km xuống dốc, $36$ km đường bằng. Vận tốc trên đường bằng là $x$ (km/h), hơn vận tốc leo dốc $5$ km/h và kém vận tốc xuống dốc $10$ km/h. Tính tổng thời gian khi $x = 30$.',
        canh: dc({ hang: [{ tu: 9, mau: [-5, 1], tenTu: '9', tenMau: 'x − 5', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Leo dốc', x: 30 },
          { tu: 5, mau: [10, 1], tenTu: '5', tenMau: 'x + 10', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Xuống dốc', x: 30 },
          { tu: 36, mau: [0, 1], tenTu: '36', tenMau: 'x', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Đường bằng', x: 30 }] },
          { ghiChu: 'Đoạn xanh là quãng đường đi được trong 1 giờ. Đoạn xanh nằm trong đoạn cam bao nhiêu lần thì đi hết bấy nhiêu giờ.' }), buoc: [
        { canh: { t: 0.3 }, lam: 'Vận tốc leo dốc $x - 5$, xuống dốc $x + 10$. Thời gian ba chặng: $\\frac{9}{x-5}$; $\\frac{5}{x+10}$; $\\frac{36}{x}$ (giờ).', vi: 'Thời gian = quãng đường : vận tốc. Mỗi thời gian là một **phân thức** của $x$.' },
        { canh: { t: 1 }, lam: 'Với $x = 30$: $\\frac{9}{25} = 0{,}36$; $\\frac{5}{40} = 0{,}125$; $\\frac{36}{30} = 1{,}2$ (giờ).', vi: 'Thay $x = 30$ vào từng phân thức (các mẫu đều khác $0$).' },
        { canh: { t: 1 }, lam: 'Tổng thời gian: $0{,}36 + 0{,}125 + 1{,}2 = 1{,}685$ giờ.', vi: 'Cộng thời gian ba chặng.' } ] }
    ],

    viDuMo: [
      { de: 'Viết điều kiện xác định của phân thức $\\frac{x+1}{x-1}$ và tính giá trị của nó tại $x = 2$.', buoc: [
        { lam: 'Điều kiện xác định: $x - 1 \\ne 0$, tức $x \\ne 1$.', vi: 'Mẫu phải khác $0$.' },
        { lam: '$x = 2$ thoả mãn điều kiện. Giá trị: $\\frac{2+1}{2-1} = 3$', vi: 'Em hãy tính giá trị của phân thức tại $x = 2$:', an: true,
          dapAn: { kieu: 'so', gt: 3 },
          loiThuongGap: [{ gt: '1/3', giaiThich: 'Em đảo ngược tử và mẫu rồi. Tử là $x + 1 = 3$ (ở trên), mẫu là $x - 1 = 1$ (ở dưới).' }] } ] },
      { de: 'Tìm các giá trị của $x$ làm phân thức $\\frac{7}{x^2-9}$ không xác định.', buoc: [
        { lam: 'Phân thức không xác định khi $x^2 - 9 = 0$.', vi: 'Không xác định khi mẫu bằng $0$.' },
        { lam: '$x^2 - 9 = (x-3)(x+3) = 0$ khi $x = 3$ hoặc $x = -3$.', vi: 'Em hãy ghi các giá trị đó (cách nhau bằng dấu ;):', an: true,
          dapAn: { kieu: 'nghiem', gt: [3, -3] },
          loiThuongGap: [{ gt: [3], giaiThich: 'Còn thiếu: $(-3)^2 = 9$ nên $x = -3$ cũng làm mẫu bằng $0$.' }, { gt: [9], giaiThich: '$x^2 = 9$ chứ không phải $x = 9$. Số nào bình phương lên bằng $9$?' }] } ] }
    ],

    baiTap: [
      { id: '21.1', hinhGiai: hg(dc({ tu: [-1, 2], mau: 0, tenTu: '2x − 1', tenMau: '0', x: 3 }, { ghiChu: 'Vẽ tại x = 3. Mẫu là đa thức 0 nên với mọi x, đoạn mẫu đều dài 0.' })), muc: 1, de: 'Cách viết nào dưới đây **không** phải là một phân thức đại số?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$\\frac{x^2+1}{5}$', '$\\frac{2x-1}{0}$', '$3x - y$', '$\\frac{0}{x-4}$'] },
        goiY: ['Phân thức $\\frac{A}{B}$ cần $A$, $B$ là đa thức và $B$ **khác đa thức 0**.', 'Đa thức $3x - y$ cũng là phân thức (mẫu bằng 1). Tử bằng $0$ thì không sao.'],
        loiGiai: ['$\\frac{x^2+1}{5}$, $\\frac{0}{x-4}$ là phân thức; $3x - y = \\frac{3x-y}{1}$ cũng là phân thức.', '$\\frac{2x-1}{0}$ có mẫu là đa thức $0$ nên **không** phải phân thức.'] },

      { id: '21.2', khongHinh: 'Chỉ cần đọc phần trên và phần dưới gạch phân số.', muc: 1, de: 'Viết tử thức và mẫu thức của phân thức $\\frac{4x-1}{x^2+2}$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Tử thức', kieu: 'bieuThuc', gt: '4x-1',
            loiThuongGap: [{ gt: 'x^2+2', giaiThich: 'Đó là mẫu thức (ở dưới gạch phân số). Tử thức nằm ở **trên**.' }] },
          { nhan: 'Mẫu thức', kieu: 'bieuThuc', gt: 'x^2+2',
            loiThuongGap: [{ gt: '4x-1', giaiThich: 'Đó là tử thức. Mẫu thức nằm ở **dưới** gạch phân số.' }] }] },
        goiY: ['Trong $\\frac{A}{B}$: $A$ (ở trên) là tử, $B$ (ở dưới) là mẫu.'],
        loiGiai: ['Tử thức là $4x - 1$, mẫu thức là $x^2 + 2$.'] },

      { id: '21.3', hinhGiai: hg(dc({ tu: [3, 2], mau: [-5, 1], tenTu: '2x + 3', tenMau: 'x − 5', x: 5 })), muc: 1, de: 'Phân thức $\\frac{2x+3}{x-5}$ **không xác định** tại giá trị nào của $x$?',
        dapAn: { kieu: 'nghiem', gt: [5] },
        goiY: ['Phân thức không xác định khi **mẫu** bằng $0$.', 'Giải $x - 5 = 0$.'],
        loiGiai: ['Mẫu $x - 5 = 0$ khi $x = 5$.', 'Vậy phân thức không xác định tại $x = 5$ (điều kiện xác định: $x \\ne 5$).'],
        loiThuongGap: [
          { gt: [-5], giaiThich: '$x - 5 = 0$ thì $x = 5$ (chuyển $-5$ sang vế phải thành $+5$).' },
          { gt: [-1.5], giaiThich: 'Đó là giá trị làm **tử** bằng $0$. Khi tử bằng $0$ phân thức vẫn xác định (bằng $0$). Em cần cho **mẫu** bằng $0$.',
            hinh: hg(dc({ tu: [3, 2], mau: [-5, 1], tenTu: '2x + 3', tenMau: 'x − 5', x: -1.5 })) }] },

      { id: '21.4', hinhGiai: hg(dc({ tu: [-3, 2, 1], mau: [3, 1], tenTu: 'x² + 2x − 3', tenMau: 'x + 3', x: 2 })), muc: 1, de: 'Tính giá trị của phân thức $\\frac{x^2+2x-3}{x+3}$ tại $x = 2$.',
        dapAn: { kieu: 'so', gt: 1 },
        goiY: ['Kiểm tra mẫu tại $x = 2$ có khác $0$ không.', 'Thay $x = 2$: tử $= 2^2 + 2\\cdot 2 - 3$, mẫu $= 2 + 3$.'],
        loiGiai: ['Tại $x = 2$: mẫu $2 + 3 = 5 \\ne 0$.', 'Tử: $4 + 4 - 3 = 5$.', 'Giá trị: $\\frac{5}{5} = 1$'],
        loiThuongGap: [{ gt: 5, giaiThich: 'Em mới tính tử thôi. Còn phải **chia cho mẫu** $2 + 3 = 5$.' }] },

      { id: '21.5', hinhGiai: hg(dc({ hang: [{ tu: [2, 1], mau: 5, tenTu: 'x + 2', tenMau: '5', x: 2 }, { tu: [0, 2, 1], mau: [0, 5], tenTu: 'x² + 2x', tenMau: '5x', x: 2 }] },
        { ghiChu: 'Thử tại x = 2: hai hàng đặt mẫu cùng 0,8 lần. Một lần thử chưa đủ chứng tỏ bằng nhau với mọi x; nhân chéo mới chắc chắn.' })), muc: 2, de: 'Khẳng định sau đúng hay sai? $$\\frac{x+2}{5} = \\frac{x^2+2x}{5x}$$',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Dùng định nghĩa: $\\frac{A}{B} = \\frac{C}{D}$ nếu $A\\cdot D = B\\cdot C$.', 'Tính $(x+2)\\cdot 5x$ và $5\\cdot(x^2+2x)$ rồi so sánh.'],
        loiGiai: ['$(x+2)\\cdot 5x = 5x^2 + 10x$.', '$5\\cdot(x^2 + 2x) = 5x^2 + 10x$.', 'Hai tích bằng nhau nên khẳng định **đúng**.'] },

      { id: '21.6', hinhGiai: hg(dc({ hang: [{ tu: [2, 1], mau: [3, 1], tenTu: 'x + 2', tenMau: 'x + 3', x: 2 }, { tu: [2, 0, 1], mau: [3, 0, 1], tenTu: 'x² + 2', tenMau: 'x² + 3', x: 2 }] },
        { ghiChu: 'Thử tại x = 2: hai hàng cho hai số khác nhau. Chỉ cần một giá trị như vậy là đủ biết khẳng định sai.' })), muc: 2, de: 'Bạn An nói: "Thêm mũ 2 vào $x$ ở cả tử và mẫu thì phân thức không đổi, nên $\\frac{x+2}{x+3} = \\frac{x^2+2}{x^2+3}$." Khẳng định đó đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Nhân chéo: so sánh $(x+2)(x^2+3)$ với $(x+3)(x^2+2)$.', 'Hoặc thử một giá trị, ví dụ $x = 2$.'],
        loiGiai: ['$(x+2)(x^2+3) = x^3 + 2x^2 + 3x + 6$.', '$(x+3)(x^2+2) = x^3 + 3x^2 + 2x + 6$.', 'Hai tích **khác nhau** (thử $x = 2$: $\\frac{4}{5} \\ne \\frac{6}{7}$). Khẳng định **sai**.'] },

      { id: '21.7', hinhGiai: hg(dc({ hang: [Object.assign({ x: 0 }, MAU_21_7), Object.assign({ x: 2 }, MAU_21_7)] })), muc: 2, de: 'Tìm **tất cả** các giá trị của $x$ làm phân thức $\\frac{x+4}{x^2-2x}$ không xác định.',
        dapAn: { kieu: 'nghiem', gt: [0, 2] },
        goiY: ['Cho mẫu bằng $0$: $x^2 - 2x = 0$.', 'Phân tích $x^2 - 2x = x(x-2)$. Một tích bằng $0$ khi một thừa số bằng $0$.'],
        loiGiai: ['$x^2 - 2x = x(x-2) = 0$ khi $x = 0$ hoặc $x = 2$.', 'Vậy phân thức không xác định tại $x = 0$ và $x = 2$.'],
        loiThuongGap: [
          { gt: [2], giaiThich: 'Còn thiếu $x = 0$: khi $x = 0$ thì $x(x-2) = 0$.' },
          { gt: [-4], giaiThich: '$x = -4$ làm **tử** bằng $0$. Ta cần cho **mẫu** bằng $0$.' }] },

      { id: '21.8', khongHinh: 'Tìm cả một đa thức A bằng phân tích nhân tử; thay số chỉ cho giá trị của A tại một điểm, không cho cả đa thức.', muc: 2, de: 'Tìm đa thức $A$ sao cho $\\frac{A}{x+3} = \\frac{2x^2-6x}{x^2-9}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2x' },
        goiY: ['Hai phân thức bằng nhau nên $A\\cdot(x^2-9) = (x+3)(2x^2-6x)$.', 'Phân tích: $x^2 - 9 = (x-3)(x+3)$ và $2x^2 - 6x = 2x(x-3)$.'],
        loiGiai: ['$A\\cdot(x-3)(x+3) = (x+3)\\cdot 2x(x-3)$.', 'So sánh hai vế: $A = 2x$'],
        loiThuongGap: [{ gt: '2x^2-6x', giaiThich: 'Mẫu đã đổi từ $x^2 - 9$ thành $x + 3$ (bị chia cho $x - 3$), nên tử cũng phải chia cho $x - 3$.' }] },

      { id: '21.9', hinhGiai: hg(dc({ tu: [-1, 3], mau: [1, 0, 1], tenTu: '3x − 1', tenMau: 'x² + 1', x: -2 }, { ghiChu: 'Tử âm nên đoạn tử vẽ nét đứt; giá trị mang dấu trừ.' })), muc: 2, de: 'Tính giá trị của phân thức $\\frac{3x-1}{x^2+1}$ tại $x = -2$.',
        dapAn: { kieu: 'so', gt: '-7/5' },
        goiY: ['Thay $x = -2$, nhớ đặt $-2$ trong ngoặc.', '$(-2)^2 = 4$; $3\\cdot(-2) = -6$.'],
        loiGiai: ['Tử: $3\\cdot(-2) - 1 = -7$.', 'Mẫu: $(-2)^2 + 1 = 5$.', 'Giá trị: $\\frac{-7}{5} = -1{,}4$'],
        loiThuongGap: [
          { gt: '7/3', giaiThich: '$(-2)^2 = (-2)\\cdot(-2) = 4$, không phải $-4$. Mẫu là $4 + 1 = 5$.' },
          { gt: '7/5', giaiThich: 'Tử $3\\cdot(-2) - 1 = -6 - 1 = -7$ là số âm.' }] },

      { id: '21.10', hinhGiai: hg(dc({ hang: [{ tu: 90, mau: [0, 1], tenTu: '90', tenMau: 'x', chuTu: 'quãng đường', chuMau: 'vận tốc', x: 36 }] },
        { ghiChu: 'Đoạn xanh là quãng đường đi trong 1 giờ; đặt được 2,5 lần nên đi hết 2,5 giờ.' })), muc: 3, de: 'Một người đi xe máy trên quãng đường dài $90$ km với vận tốc $x$ (km/h).\n\na) Viết phân thức biểu thị thời gian (giờ) người đó đi hết quãng đường.\n\nb) Tính thời gian đó khi $x = 36$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Thời gian (giờ)', kieu: 'bieuThuc', gt: '90/x',
            loiThuongGap: [{ gt: 'x/90', giaiThich: 'Thời gian = quãng đường **chia** vận tốc: $\\frac{90}{x}$, không phải $\\frac{x}{90}$.' }, { gt: '90x', giaiThich: 'Quãng đường = vận tốc × thời gian, nên thời gian = quãng đường **:** vận tốc.' }] },
          { nhan: 'b) Khi $x = 36$ (giờ)', kieu: 'so', gt: 2.5,
            loiThuongGap: [{ gt: 0.4, giaiThich: 'Em tính $\\frac{36}{90}$ rồi. Phải là $\\frac{90}{36}$.' }] }] },
        goiY: ['Thời gian = quãng đường : vận tốc.', 'Thay $x = 36$ vào phân thức ở câu a.'],
        loiGiai: ['a) Thời gian: $\\frac{90}{x}$ (giờ), với $x > 0$.', 'b) $\\frac{90}{36} = 2{,}5$ giờ (2 giờ 30 phút).'] },

      { id: '21.11', hinhGiai: hg(dc({ hang: [{ tu: 6, mau: [-6, 1], tenTu: '6', tenMau: 'x − 6', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Leo dốc', x: 30 },
        { tu: 4, mau: [10, 1], tenTu: '4', tenMau: 'x + 10', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Xuống dốc', x: 30 },
        { tu: 30, mau: [0, 1], tenTu: '30', tenMau: 'x', chuTu: 'quãng đường', chuMau: 'vận tốc', ten: 'Đường bằng', x: 30 }] })), muc: 3, de: 'Một cuộc đua xe đạp gồm $6$ km leo dốc, $4$ km xuống dốc và $30$ km đường bằng. Vận tốc trên đường bằng là $x$ (km/h); vận tốc leo dốc **kém** đường bằng $6$ km/h, vận tốc xuống dốc **hơn** đường bằng $10$ km/h. Tính tổng thời gian (giờ) hoàn thành cuộc đua khi $x = 30$.',
        dapAn: { kieu: 'so', gt: 1.35, saiSo: 0.001 },
        goiY: ['Vận tốc leo dốc $x - 6$, xuống dốc $x + 10$. Thời gian từng chặng: $\\frac{6}{x-6}$, $\\frac{4}{x+10}$, $\\frac{30}{x}$.', 'Thay $x = 30$ vào từng phân thức rồi cộng lại.'],
        loiGiai: ['Leo dốc: $\\frac{6}{30-6} = \\frac{6}{24} = 0{,}25$ giờ.', 'Xuống dốc: $\\frac{4}{30+10} = 0{,}1$ giờ; đường bằng: $\\frac{30}{30} = 1$ giờ.', 'Tổng thời gian $= 0{,}25 + 0{,}1 + 1 = 1{,}35$'],
        loiThuongGap: [{ gt: '19/15', giaiThich: 'Leo dốc **chậm hơn** đường bằng nên vận tốc là $x - 6$, không phải $x + 6$.' }] },

      { id: '21.12', hinhGiai: hg(dc({ hang: [{ tu: [0, 2], mau: [100, -1], tenTu: '2x', tenMau: '100 − x', x: 80 }, { tu: [0, 2], mau: [100, -1], tenTu: '2x', tenMau: '100 − x', x: 100 }] },
        { ghiChu: 'Loại bỏ 80% tốn 8 tỉ đồng. Tới 100% thì mẫu bằng 0: không tính được.' })), muc: 3, de: 'Để loại bỏ $x\\%$ chất ô nhiễm trong khí thải của một nhà máy, chi phí ước tính là $\\frac{2x}{100-x}$ (tỉ đồng).\n\na) Muốn loại bỏ $80\\%$ chất ô nhiễm thì cần bao nhiêu tỉ đồng?\n\nb) Phân thức trên không xác định tại giá trị nào của $x$? (Từ đó: không thể loại bỏ được $100\\%$ chất ô nhiễm.)',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Chi phí (tỉ đồng)', kieu: 'so', gt: 8,
            loiThuongGap: [{ gt: 160, giaiThich: 'Em mới tính tử $2\\cdot 80 = 160$. Còn phải chia cho mẫu $100 - 80 = 20$.' }] },
          { nhan: 'b) Giá trị $x$ làm phân thức không xác định', kieu: 'nghiem', gt: [100] }] },
        goiY: ['Câu a: thay $x = 80$ vào phân thức.', 'Câu b: cho mẫu $100 - x = 0$.'],
        loiGiai: ['a) $\\frac{2\\cdot 80}{100-80} = \\frac{160}{20} = 8$ (tỉ đồng).', 'b) $100 - x = 0$ khi $x = 100$: phân thức không xác định. Chi phí để loại bỏ $100\\%$ "không tính được" (càng gần $100\\%$ chi phí càng lớn vô cùng), nên không thể loại bỏ hết.'] }
    ],

    timLoi: [
      { de: 'Bạn Nam viết điều kiện xác định của phân thức $\\frac{x+5}{x(x-4)}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Phân thức xác định khi mẫu khác $0$: $x(x-4) \\ne 0$.', 'Suy ra $x - 4 \\ne 0$, tức $x \\ne 4$.', 'Vậy điều kiện xác định là $x \\ne 4$.'],
        dongSai: 1, giaiThich: 'Tích $x(x-4)$ khác $0$ khi **cả hai** thừa số đều khác $0$. Bạn Nam quên thừa số $x$: tại $x = 0$ mẫu cũng bằng $0$.', sua: '$x \\ne 0$ và $x \\ne 4$.' },
      { de: 'Bạn Lan tính giá trị của $\\frac{x^2+1}{x+1}$ tại $x = -3$ như sau. Dòng nào sai?',
        loiGiaiSai: ['Thay $x = -3$: $\\frac{(-3)^2+1}{-3+1}$', '$= \\frac{-9+1}{-2}$', '$= \\frac{-8}{-2} = 4$'],
        dongSai: 1, giaiThich: '$(-3)^2 = (-3)\\cdot(-3) = 9$, không phải $-9$.', sua: '$= \\frac{9+1}{-2} = \\frac{10}{-2} = -5$' }
    ]
  });
})();
