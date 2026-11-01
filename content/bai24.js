// Bài 24 – Phép nhân và phép chia phân thức đại số (SGK Toán 8 KNTT Tập 2, tr. 20–27, gồm Luyện tập chung và Bài tập cuối chương VI)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44', TIM = '#9c36b5', DO = '#e03131';

  // Hình động "bảng giá trị": kéo điểm cam trên trục hoành để chọn x; bảng dưới hình cho giá trị từng biểu thức.
  // o: { bbox, x0, buoc, ham:[{fn, mau, dash, day, mo, diem}], tiemCan:[x mà mẫu = 0], lo:[[x, y, mau]] (điểm rỗng), dong:[{chu, tex, fn, mau, mau0}] }
  function bangGiaTri(o) {
    return { bbox: o.bbox, axis: true, grid: true, build: function (board, G) {
      var T = TOAN8, buoc = o.buoc || 0.5, X;
      function xv() { return Math.round(X.X() / buoc) * buoc; }
      (o.tiemCan || []).forEach(function (a) {
        board.create('line', [[a, 0], [a, 1]], { strokeColor: DO, dash: 2, strokeWidth: 2, fixed: true, highlight: false });
      });
      (o.ham || []).forEach(function (h) {
        board.create('functiongraph', [h.fn], { strokeColor: h.mau, strokeWidth: h.day || 3, strokeOpacity: h.mo || 1, dash: h.dash || 0, fixed: true, highlight: false });
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
          if (!isFinite(v)) gt = '<b style="color:' + DO + '">không xác định</b> (mẫu bằng 0)';
          else if (d.mau0 && Math.abs(v) < 1e-12) gt = '<b style="color:' + DO + '">0</b> ⟵ mẫu bằng 0!';
          else gt = '<b>' + T.fmtSo(v) + '</b>';
          return '<div style="margin:8px 0;color:' + (d.mau || 'inherit') + '">' + (d.chu ? d.chu + ' ' : '') + T.tex(d.tex) + ' = ' + gt + '</div>';
        }).join('');
      }
      board.on('update', ve);
      ve();
    } };
  }

  // Khám phá: 2x/(x+1) · (x−1)/x = 2(x−1)/(x+1), nhưng tích không xác định tại x = 0 và x = −1.
  function A(x) { return 2 * x / (x + 1); }
  function B(x) { return (x - 1) / x; }
  function tich(x) { return A(x) * B(x); }
  function gon(x) { return 2 * (x - 1) / (x + 1); }
  var hinhKhamPha = bangGiaTri({
    bbox: [-5, 5, 5, -2.5], x0: 3,
    ham: [{ fn: tich, mau: LA, day: 8, mo: 0.45 }, { fn: gon, mau: XANH, dash: 2, diem: false }],
    tiemCan: [-1], lo: [[0, -2, LA]],
    dong: [
      { chu: 'Phân thức thứ nhất', tex: '\\dfrac{2x}{x+1}', fn: A, mau: CAM },
      { chu: 'Phân thức thứ hai', tex: '\\dfrac{x-1}{x}', fn: B, mau: CAM },
      { chu: 'Nhân hai giá trị trên:', tex: '\\dfrac{2x}{x+1}\\cdot\\dfrac{x-1}{x}', fn: tich, mau: LA },
      { chu: 'Nhân tử với tử, mẫu với mẫu rồi rút gọn:', tex: '\\dfrac{2x(x-1)}{(x+1)x} = \\dfrac{2(x-1)}{x+1}', fn: gon, mau: XANH }
    ]
  });

  // Phép chia: 5/(x²−1) : 3/(x²−x) = 5x/(3(x+1)); không xác định tại x = ±1 và tại x = 0 (phân thức chia bằng 0 hoặc mẫu bằng 0).
  function bi(x) { return 5 / (x * x - 1); }
  function chia(x) { return 3 / (x * x - x); }
  function thuong(x) { var c = chia(x); return !isFinite(c) || c === 0 ? NaN : bi(x) / c; }
  var hinhChia = bangGiaTri({
    bbox: [-4, 4, 4, -2], x0: 2,
    ham: [{ fn: thuong, mau: XANH }], tiemCan: [-1], lo: [[0, 0, XANH], [1, 5 / 6, XANH]],
    dong: [
      { chu: 'Phân thức bị chia', tex: '\\dfrac{5}{x^2-1}', fn: bi, mau: CAM },
      { chu: 'Phân thức chia', tex: '\\dfrac{3}{x^2-x}', fn: chia, mau: CAM },
      { chu: 'Thương:', tex: '\\dfrac{5}{x^2-1} : \\dfrac{3}{x^2-x}', fn: thuong, mau: XANH },
      { chu: 'Kết quả rút gọn', tex: '\\dfrac{5x}{3(x+1)}', fn: function (x) { return 5 * x / (3 * (x + 1)); }, mau: LA }
    ]
  });

  TOAN8.bai({
    id: 24, ten: 'Phép nhân và phép chia phân thức đại số', sgk: { tap: 2, trang: 20 },

    khamPha: {
      nhiemVu: 'Anh Pi nói: "Nhân hai phân thức thì nhân các tử với nhau và nhân các mẫu với nhau." Kéo **điểm cam** để đổi $x$ và so sánh dòng **xanh lá** (nhân trực tiếp hai giá trị) với dòng **xanh dương** (kết quả theo cách của anh Pi).\n\nEm thử thêm $x = 0$: chuyện gì xảy ra ở đó?',
      widget: 'geo',
      config: hinhKhamPha,
      cauHoi: {
        de: 'Tại $x = 3$, tích $\\frac{2x}{x+1}\\cdot\\frac{x-1}{x}$ bằng bao nhiêu?',
        dapAn: { kieu: 'so', gt: 1 },
        goiY: ['Kéo điểm cam tới $x = 3$ và đọc bảng.', '$\\frac{6}{4}\\cdot\\frac{2}{3} = ?$'],
        loiGiai: [
          '$\\frac{2\\cdot 3}{3+1}\\cdot\\frac{3-1}{3} = \\frac{6}{4}\\cdot\\frac{2}{3} = 1$, và $\\frac{2(3-1)}{3+1} = 1$: hai cách bằng nhau.',
          'Vậy nhân phân thức giống nhân phân số: **tử nhân tử, mẫu nhân mẫu**, rồi rút gọn.',
          'Tại $x = 0$ phân thức $\\frac{x-1}{x}$ không xác định nên tích cũng không xác định (lỗ hổng trên đồ thị), dù $\\frac{2(x-1)}{x+1}$ vẫn tính được.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Nhân hai phân thức',
        noiDung: 'Muốn nhân hai phân thức, ta **nhân các tử thức với nhau, nhân các mẫu thức với nhau**:\n\n$$\\frac{\\ca{A}}{\\cb{B}}\\cdot\\frac{\\ca{C}}{\\cb{D}} = \\frac{\\ca{A\\cdot C}}{\\cb{B\\cdot D}}.$$\n\nKết quả gọi là **tích**, ta thường viết dưới dạng rút gọn. Nhân phân thức **không cần quy đồng**.\n\n**Mẹo:** phân tích các tử, mẫu thành nhân tử **trước** rồi mới nhân, để thấy ngay nhân tử chung mà rút gọn:\n\n$\\frac{2x-1}{5x+1}\\cdot\\frac{5x+1}{4x^2-1} = \\frac{(2x-1)(5x+1)}{(5x+1)(2x-1)(2x+1)} = \\frac{1}{2x+1}$.' },
      { loai: 'chuY', tieuDe: 'Tính chất của phép nhân',
        noiDung: '• Giao hoán: $\\frac{A}{B}\\cdot\\frac{C}{D} = \\frac{C}{D}\\cdot\\frac{A}{B}$.\n\n• Kết hợp: $\\left(\\frac{A}{B}\\cdot\\frac{C}{D}\\right)\\cdot\\frac{E}{F} = \\frac{A}{B}\\cdot\\left(\\frac{C}{D}\\cdot\\frac{E}{F}\\right)$.\n\n• Phân phối với phép cộng: $\\frac{A}{B}\\left(\\frac{C}{D} + \\frac{E}{F}\\right) = \\frac{A}{B}\\cdot\\frac{C}{D} + \\frac{A}{B}\\cdot\\frac{E}{F}$.\n\nVí dụ: $\\frac{x}{y}\\cdot\\frac{x-1}{x+1}\\cdot\\frac{y}{x} = \\left(\\frac{x}{y}\\cdot\\frac{y}{x}\\right)\\cdot\\frac{x-1}{x+1} = \\frac{x-1}{x+1}$.' },
      { loai: 'dinhNghia', tieuDe: '2. Phân thức nghịch đảo',
        noiDung: 'Vì $\\frac{C}{D}\\cdot\\frac{D}{C} = 1$ nên ta nói $\\frac{D}{C}$ là **phân thức nghịch đảo** của $\\frac{C}{D}$ (với $\\frac{C}{D} \\ne 0$): chỉ việc **lật ngược** tử và mẫu.\n\nVí dụ: nghịch đảo của $\\frac{x+2}{x-3}$ là $\\frac{x-3}{x+2}$. (Đừng nhầm với phân thức **đối** $\\frac{-(x+2)}{x-3}$.)' },
      { loai: 'dinhLi', tieuDe: '3. Chia hai phân thức',
        noiDung: 'Muốn chia phân thức $\\frac{A}{B}$ cho phân thức $\\frac{C}{D}$ khác $0$, ta nhân $\\frac{A}{B}$ với phân thức **nghịch đảo** của $\\frac{C}{D}$:\n\n$$\\frac{A}{B} : \\frac{\\cd{C}}{\\cd{D}} = \\frac{A}{B}\\cdot\\frac{\\cd{D}}{\\cd{C}}, \\quad \\frac{C}{D} \\ne 0.$$\n\nVí dụ: $\\frac{5}{x^2-1} : \\frac{3}{x^2-x} = \\frac{5}{x^2-1}\\cdot\\frac{x^2-x}{3} = \\frac{5x(x-1)}{3(x-1)(x+1)} = \\frac{5x}{3(x+1)}$.' },
      { loai: 'hinh', widget: 'geo', config: hinhChia,
        chuThich: 'Đồ thị của thương $\\frac{5}{x^2-1} : \\frac{3}{x^2-x}$. Nó gần giống đồ thị của $\\frac{5x}{3(x+1)}$ nhưng có **hai lỗ hổng**: tại $x = 1$ (mẫu $x^2 - 1 = 0$) và tại $x = 0$ (phân thức chia $\\frac{3}{x^2-x}$ không xác định). Kéo điểm cam tới $0$ và $1$ để xem.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '**1. Lật nhầm phân thức.** Khi chia, chỉ lật phân thức **thứ hai** (số chia), giữ nguyên phân thức thứ nhất.\n\n**2. Quên lật.** $\\frac{A}{B} : \\frac{C}{D} \\ne \\frac{A\\cdot C}{B\\cdot D}$.\n\n**3. "Gạch bừa" hạng tử** khi rút gọn tích: $\\frac{2(x+3)}{x+6}$ **không** rút gọn được thành $\\frac{2\\cdot 3}{6}$.\n\n**4. Dấu:** âm nhân âm được dương; $\\left(-\\frac{A}{B}\\right)\\cdot\\frac{C}{D} = -\\frac{AC}{BD}$.' }
    ],

    viDu: [
      { de: 'Nhân hai phân thức $\\frac{2x-1}{5x+1}$ và $\\frac{5x+1}{4x^2-1}$.', buoc: [
        { lam: '$\\frac{2x-1}{5x+1}\\cdot\\frac{5x+1}{4x^2-1} = \\frac{(2x-1)(5x+1)}{(5x+1)(4x^2-1)}$', vi: 'Tử nhân tử, mẫu nhân mẫu. Giữ dạng tích, **chưa** nhân phá ngoặc.' },
        { lam: '$= \\frac{(2x-1)(5x+1)}{(5x+1)(2x-1)(2x+1)}$', vi: 'Phân tích $4x^2 - 1 = (2x-1)(2x+1)$ để thấy nhân tử chung.' },
        { lam: '$= \\frac{1}{2x+1}$', vi: 'Chia cả tử và mẫu cho các nhân tử chung $(2x-1)$ và $(5x+1)$.' } ] },
      { de: 'Tính $\\left(-\\frac{3x}{5xy^2}\\right)\\cdot\\left(-\\frac{5y^2}{12xy}\\right)$.', buoc: [
        { lam: '$= \\frac{3x\\cdot 5y^2}{5xy^2\\cdot 12xy}$', vi: 'Âm nhân âm được dương.' },
        { lam: '$= \\frac{15xy^2}{60x^2y^3} = \\frac{1}{4xy}$', vi: 'Chia cả tử và mẫu cho $15xy^2$.' } ] },
      { de: 'Làm tính chia $\\frac{5}{x^2-1} : \\frac{3}{x^2-x}$.', buoc: [
        { lam: '$= \\frac{5}{x^2-1}\\cdot\\frac{x^2-x}{3}$', vi: 'Nhân với phân thức nghịch đảo của số chia (lật $\\frac{3}{x^2-x}$ thành $\\frac{x^2-x}{3}$).' },
        { lam: '$= \\frac{5x(x-1)}{3(x-1)(x+1)}$', vi: 'Nhân tử với tử, mẫu với mẫu; phân tích $x^2 - x = x(x-1)$, $x^2 - 1 = (x-1)(x+1)$.' },
        { lam: '$= \\frac{5x}{3(x+1)}$', vi: 'Chia cho nhân tử chung $x - 1$.' } ] },
      { de: 'Làm tính chia $\\frac{3x}{2y^2} : \\left(-\\frac{5x^2}{12y^3}\\right)$.', buoc: [
        { lam: '$= \\frac{3x}{2y^2}\\cdot\\left(-\\frac{12y^3}{5x^2}\\right)$', vi: 'Lật phân thức thứ hai, giữ dấu trừ.' },
        { lam: '$= -\\frac{36xy^3}{10x^2y^2} = -\\frac{18y}{5x}$', vi: 'Nhân rồi chia cả tử và mẫu cho $2xy^2$.' } ] },
      { de: 'Tính nhanh $\\frac{x}{y}\\cdot\\frac{x-1}{x+1}\\cdot\\frac{y}{x}$.', buoc: [
        { lam: '$= \\left(\\frac{x}{y}\\cdot\\frac{y}{x}\\right)\\cdot\\frac{x-1}{x+1}$', vi: 'Giao hoán và kết hợp: ghép hai phân thức nghịch đảo của nhau.' },
        { lam: '$= 1\\cdot\\frac{x-1}{x+1} = \\frac{x-1}{x+1}$', vi: 'Tích của một phân thức với nghịch đảo của nó bằng $1$.' } ] }
    ],

    viDuMo: [
      { de: 'Làm tính nhân $\\frac{x}{x+y}\\cdot\\frac{2x+2y}{3xy}$.', buoc: [
        { lam: '$= \\frac{x\\cdot 2(x+y)}{(x+y)\\cdot 3xy}$', vi: 'Nhân tử với tử, mẫu với mẫu; phân tích $2x + 2y = 2(x+y)$.' },
        { lam: '$= \\frac{2}{3y}$', vi: 'Em hãy rút gọn và ghi kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '2/(3y)', dang: 'rutGon' },
          loiThuongGap: [{ gt: '1/(3y)', giaiThich: 'Em làm rơi mất hệ số $2$ ở tử: $2x + 2y = 2(x + y)$.' }] } ] },
      { de: 'Làm tính chia $\\frac{x^2-4}{3x} : \\frac{x+2}{6x^2}$.', buoc: [
        { lam: '$= \\frac{x^2-4}{3x}\\cdot\\frac{6x^2}{x+2} = \\frac{(x-2)(x+2)\\cdot 6x^2}{3x(x+2)}$', vi: 'Lật phân thức thứ hai rồi nhân; phân tích $x^2 - 4$.' },
        { lam: '$= 2x(x-2)$', vi: 'Em hãy rút gọn và ghi kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '2x(x-2)' },
          loiThuongGap: [{ gt: '1/(2x(x-2))', giaiThich: 'Em lật nhầm phân thức **thứ nhất**. Chỉ lật phân thức chia (thứ hai).' }] } ] }
    ],

    baiTap: [
      { id: '24.1', muc: 1, de: 'Làm tính nhân và rút gọn: $\\frac{2x}{x+1}\\cdot\\frac{x+1}{4x^2}$.',
        dapAn: { kieu: 'bieuThuc', gt: '1/(2x)', dang: 'rutGon' },
        goiY: ['Tử nhân tử, mẫu nhân mẫu: $\\frac{2x(x+1)}{(x+1)\\cdot 4x^2}$.', 'Chia cả tử và mẫu cho $2x(x+1)$.'],
        loiGiai: ['$= \\frac{2x(x+1)}{4x^2(x+1)}$', '$= \\frac{1}{2x}$'],
        loiThuongGap: [{ gt: '8x^3/(x+1)^2', giaiThich: 'Em nhân chéo (tử của phân thức này với mẫu của phân thức kia). Phép nhân là **tử nhân tử, mẫu nhân mẫu**.' }] },

      { id: '24.2', muc: 1, de: 'Viết phân thức **nghịch đảo** của $\\frac{x-2}{x+5}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(x+5)/(x-2)' },
        goiY: ['Nghịch đảo: lật ngược tử và mẫu.'],
        loiGiai: ['Vì $\\frac{x-2}{x+5}\\cdot\\frac{x+5}{x-2} = 1$, phân thức nghịch đảo là $\\frac{x+5}{x-2}$.'],
        loiThuongGap: [{ gt: '(2-x)/(x+5)', giaiThich: 'Đó là phân thức **đối** (tổng bằng 0). Nghịch đảo là phân thức có **tích** bằng 1: lật ngược tử và mẫu.' }] },

      { id: '24.3', muc: 1, de: 'Làm tính nhân: $\\frac{4y^2}{x^3}\\cdot\\frac{x^2}{6y}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2y/(3x)', dang: 'rutGon' },
        goiY: ['Tử: $4y^2\\cdot x^2$; mẫu: $x^3\\cdot 6y$.', 'Chia cả tử và mẫu cho $2x^2y$.'],
        loiGiai: ['$= \\frac{4x^2y^2}{6x^3y}$', '$= \\frac{2y}{3x}$'],
        loiThuongGap: [{ gt: '24y^3/x^5', giaiThich: 'Em nhân chéo rồi. Phép nhân: tử $4y^2$ nhân tử $x^2$, mẫu $x^3$ nhân mẫu $6y$.' }] },

      { id: '24.4', muc: 1, de: 'Làm tính chia: $\\frac{3x}{2y} : \\frac{9x^2}{4y^3}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2y^2/(3x)', dang: 'rutGon' },
        goiY: ['Lật phân thức thứ hai: $\\frac{3x}{2y}\\cdot\\frac{4y^3}{9x^2}$.', 'Nhân rồi chia cả tử và mẫu cho $6xy$.'],
        loiGiai: ['$= \\frac{3x}{2y}\\cdot\\frac{4y^3}{9x^2} = \\frac{12xy^3}{18x^2y}$', '$= \\frac{2y^2}{3x}$'],
        loiThuongGap: [{ gt: '27x^3/(8y^4)', giaiThich: 'Em nhân thẳng mà **quên lật** phân thức chia. $\\frac{A}{B} : \\frac{C}{D} = \\frac{A}{B}\\cdot\\frac{D}{C}$.' }] },

      { id: '24.5', muc: 2, de: 'Làm tính nhân và rút gọn: $\\frac{x^2+x}{3x-1}\\cdot\\frac{9x^2-1}{x^3+1}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x(3x+1)/(x^2-x+1)', dang: 'rutGon' },
        goiY: ['Phân tích: $x^2 + x = x(x+1)$; $9x^2 - 1 = (3x-1)(3x+1)$; $x^3 + 1 = (x+1)(x^2-x+1)$.', 'Chia cho các nhân tử chung $x + 1$ và $3x - 1$.'],
        loiGiai: ['$= \\frac{x(x+1)(3x-1)(3x+1)}{(3x-1)(x+1)(x^2-x+1)}$', '$= \\frac{x(3x+1)}{x^2-x+1}$'],
        loiThuongGap: [{ gt: 'x(3x+1)/(x^2+x+1)', giaiThich: 'Tổng hai lập phương: $x^3 + 1 = (x+1)(x^2 - x + 1)$ (dấu **trừ** ở giữa).' }] },

      { id: '24.6', muc: 2, de: 'Làm tính chia và rút gọn: $\\frac{x^2-9}{x+1} : \\frac{x-3}{x^2+x}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x(x+3)' },
        goiY: ['Lật phân thức thứ hai: $\\frac{x^2-9}{x+1}\\cdot\\frac{x^2+x}{x-3}$.', '$x^2 - 9 = (x-3)(x+3)$; $x^2 + x = x(x+1)$.'],
        loiGiai: ['$= \\frac{(x-3)(x+3)\\cdot x(x+1)}{(x+1)(x-3)}$', '$= x(x+3)$'],
        loiThuongGap: [{ gt: '1/(x(x+3))', giaiThich: 'Em lật nhầm phân thức thứ nhất. Chỉ lật phân thức **chia** (đứng sau dấu :).' }] },

      { id: '24.7', muc: 2, de: 'Làm tính chia: $\\left(-\\frac{2x}{3y^2}\\right) : \\left(-\\frac{4x^2}{9y}\\right)$.',
        dapAn: { kieu: 'bieuThuc', gt: '3/(2xy)', dang: 'rutGon' },
        goiY: ['Âm chia âm được dương.', 'Lật phân thức thứ hai: $\\frac{2x}{3y^2}\\cdot\\frac{9y}{4x^2}$.'],
        loiGiai: ['$= \\frac{2x}{3y^2}\\cdot\\frac{9y}{4x^2} = \\frac{18xy}{12x^2y^2}$', '$= \\frac{3}{2xy}$'],
        loiThuongGap: [
          { gt: '-3/(2xy)', giaiThich: 'Hai phân thức đều âm: âm chia âm được **dương**.' },
          { gt: '8x^3/(27y^3)', giaiThich: 'Em quên lật phân thức chia.' }] },

      { id: '24.8', muc: 2, de: 'Làm tính chia và rút gọn: $\\frac{x^2-9}{x^3-27} : \\frac{x^2+6x+9}{x^2+3x+9}$.',
        dapAn: { kieu: 'bieuThuc', gt: '1/(x+3)', dang: 'rutGon' },
        goiY: ['$x^3 - 27 = (x-3)(x^2+3x+9)$; $x^2 + 6x + 9 = (x+3)^2$.', 'Lật phân thức thứ hai rồi nhân, chia các nhân tử chung.'],
        loiGiai: ['$= \\frac{(x-3)(x+3)}{(x-3)(x^2+3x+9)}\\cdot\\frac{x^2+3x+9}{(x+3)^2}$', '$= \\frac{1}{x+3}$'],
        loiThuongGap: [{ gt: 'x+3', giaiThich: 'Kết quả bị lộn ngược: em đã lật nhầm phân thức thứ nhất.' }] },

      { id: '24.9', muc: 2, de: 'Tìm phân thức $P$ thoả mãn $P\\cdot\\frac{x-2}{3x+1} = \\frac{x^2-2x}{9x^2-1}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x/(3x-1)', dang: 'rutGon' },
        goiY: ['$P = \\frac{x^2-2x}{9x^2-1} : \\frac{x-2}{3x+1}$.', 'Lật phân thức chia: $\\frac{x(x-2)}{(3x-1)(3x+1)}\\cdot\\frac{3x+1}{x-2}$.'],
        loiGiai: ['$P = \\frac{x(x-2)}{(3x-1)(3x+1)}\\cdot\\frac{3x+1}{x-2}$', '$P = \\frac{x}{3x-1}$'],
        loiThuongGap: [{ gt: '(x^2-2x)(x-2)/((9x^2-1)(3x+1))', giaiThich: 'Muốn tìm thừa số chưa biết, ta lấy tích **chia** cho thừa số đã biết, không phải nhân.' }] },

      { id: '24.10', muc: 3, de: 'Cho $P = \\frac{x^2-4x+4}{x^2-2x}$ và $Q = \\frac{x^2-2x}{x^2-4}$.\n\na) Rút gọn $P$ và $Q$.\n\nb) Dùng kết quả câu a, tính $P\\cdot Q$ và $P : Q$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$P$ rút gọn', kieu: 'bieuThuc', gt: '(x-2)/x', dang: 'rutGon' },
          { nhan: '$Q$ rút gọn', kieu: 'bieuThuc', gt: 'x/(x+2)', dang: 'rutGon' },
          { nhan: '$P\\cdot Q$', kieu: 'bieuThuc', gt: '(x-2)/(x+2)', dang: 'rutGon' },
          { nhan: '$P : Q$', kieu: 'bieuThuc', gt: '(x^2-4)/x^2',
            loiThuongGap: [{ gt: 'x^2/(x^2-4)', giaiThich: 'Em lật nhầm $P$. $P : Q = P\\cdot\\frac{1}{Q}$: chỉ lật $Q$.' }] }] },
        goiY: ['$x^2 - 4x + 4 = (x-2)^2$; $x^2 - 2x = x(x-2)$; $x^2 - 4 = (x-2)(x+2)$.', '$P\\cdot Q = \\frac{x-2}{x}\\cdot\\frac{x}{x+2}$; $P : Q = \\frac{x-2}{x}\\cdot\\frac{x+2}{x}$.'],
        loiGiai: ['a) $P = \\frac{(x-2)^2}{x(x-2)} = \\frac{x-2}{x}$; $\\;Q = \\frac{x(x-2)}{(x-2)(x+2)} = \\frac{x}{x+2}$.', 'b) $P\\cdot Q = \\frac{x-2}{x}\\cdot\\frac{x}{x+2} = \\frac{x-2}{x+2}$.', '$P : Q = \\frac{x-2}{x}\\cdot\\frac{x+2}{x} = \\frac{x^2-4}{x^2}$.'] },

      { id: '24.11', muc: 3, de: 'Bác Châu vay $600$ triệu đồng, trả góp trong $y$ tháng. Mỗi tháng bác trả $x$ (triệu đồng) gồm: tiền gốc $\\frac{600}{y}$ và tiền lãi bằng $600$ nhân lãi suất tháng $\\frac{r}{12}$ ($r$ là lãi suất năm, viết dạng số thập phân).\n\na) Viết công thức tính $r$ theo $x$ và $y$.\n\nb) Tính $r$ khi mỗi tháng trả $15$ triệu đồng trong $5$ năm (ghi số thập phân hoặc phần trăm, ví dụ $0{,}05$ hay $5\\%$).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $r =$', kieu: 'bieuThuc', gt: '(xy-600)/(50y)' },
          { nhan: 'b) Lãi suất năm $r$', kieu: 'so', gt: 0.1,
            loiThuongGap: [{ gt: 0.2, giaiThich: '$5$ năm là $60$ tháng (không phải $30$). Thay $y = 60$.' }, { gt: 10, giaiThich: 'Gần đúng rồi! $r = 0{,}1$, tức là $10\\%$. Nếu ghi phần trăm em nhớ gõ cả dấu %: **10%** (hoặc ghi số thập phân **0,1**).' }] }] },
        goiY: ['$x = \\frac{600}{y} + 600\\cdot\\frac{r}{12} = \\frac{600}{y} + 50r$.', 'Suy ra $r = \\left(x - \\frac{600}{y}\\right) : 50$, rồi quy đồng. Câu b: $x = 15$, $y = 60$.'],
        loiGiai: ['a) $50r = x - \\frac{600}{y} = \\frac{xy - 600}{y}$, nên $r = \\frac{xy-600}{50y}$.', 'b) $r = \\frac{15\\cdot 60 - 600}{50\\cdot 60} = \\frac{300}{3000} = 0{,}1$, tức $10\\%$ một năm.'] },

      { id: '24.12', muc: 3, de: 'Một xưởng lập kế hoạch làm $48\\,000$ sản phẩm trong $x$ ngày. Nhờ cải tiến kĩ thuật, xưởng xong sớm $20$ ngày và làm vượt $2\\,000$ sản phẩm.\n\na) Viết phân thức biểu thị số sản phẩm thực tế làm mỗi ngày.\n\nb) Nếu theo kế hoạch mỗi ngày làm $400$ sản phẩm, thì thực tế mỗi ngày làm nhiều hơn kế hoạch bao nhiêu sản phẩm?',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Mỗi ngày thực tế', kieu: 'bieuThuc', gt: '50000/(x-20)',
            loiThuongGap: [{ gt: '48000/(x-20)', giaiThich: 'Thực tế làm vượt $2\\,000$ sản phẩm: tổng là $50\\,000$.' }, { gt: '50000/(x+20)', giaiThich: 'Xong **sớm** $20$ ngày nên số ngày là $x - 20$.' }] },
          { nhan: 'b) Nhiều hơn (sản phẩm/ngày, chỉ ghi số)', kieu: 'so', gt: 100,
            loiThuongGap: [{ gt: 80, giaiThich: 'Em quên phần vượt $2\\,000$: thực tế làm $50\\,000$ sản phẩm trong $100$ ngày.' }] }] },
        goiY: ['Thực tế: $48\\,000 + 2\\,000$ sản phẩm trong $x - 20$ ngày.', 'Kế hoạch $400$ sản phẩm/ngày nên $x = 48\\,000 : 400 = 120$ ngày.'],
        loiGiai: ['a) $\\frac{50\\,000}{x-20}$ (sản phẩm/ngày).', 'b) $x = \\frac{48\\,000}{400} = 120$; thực tế mỗi ngày $\\frac{50\\,000}{100} = 500$ sản phẩm.', 'Nhiều hơn kế hoạch: $500 - 400 = 100$ sản phẩm mỗi ngày.'] }
    ],

    timLoi: [
      { de: 'Bạn Nam làm tính chia $\\frac{x-2}{3x} : \\frac{x-2}{6x^2}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{x-2}{3x} : \\frac{x-2}{6x^2} = \\frac{3x}{x-2}\\cdot\\frac{x-2}{6x^2}$', '$= \\frac{3x(x-2)}{(x-2)\\cdot 6x^2}$', '$= \\frac{1}{2x}$'],
        dongSai: 0, giaiThich: 'Bạn Nam lật nhầm phân thức **thứ nhất**. Khi chia chỉ lật phân thức chia (thứ hai).', sua: '$= \\frac{x-2}{3x}\\cdot\\frac{6x^2}{x-2} = 2x$' },
      { de: 'Bạn Lan làm tính nhân $\\frac{x+3}{x}\\cdot\\frac{2x}{x+6}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{x+3}{x}\\cdot\\frac{2x}{x+6} = \\frac{(x+3)\\cdot 2x}{x(x+6)}$', '$= \\frac{2(x+3)}{x+6}$', '$= \\frac{2\\cdot 3}{6} = 1$ (gạch $x$ ở tử và mẫu)'],
        dongSai: 2, giaiThich: '$x$ trong $x + 3$ và $x + 6$ chỉ là **hạng tử**, không phải nhân tử chung, nên không được gạch. Thử $x = 1$: $\\frac{2\\cdot 4}{7} \\ne 1$.', sua: 'Kết quả là $\\frac{2(x+3)}{x+6}$ (không rút gọn được nữa).' }
    ]
  });
})();
