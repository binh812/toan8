// Bài 23 – Phép cộng và phép trừ phân thức đại số (SGK Toán 8 KNTT Tập 2, tr. 15–19)
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

  // Khám phá: 1/x + 1/(x+1). Đúng: (2x+1)/(x(x+1)). Sai ("cộng tử với tử, mẫu với mẫu"): 2/(2x+1).
  function A(x) { return 1 / x; }
  function B(x) { return 1 / (x + 1); }
  function tong(x) { return A(x) + B(x); }
  function dung(x) { return (2 * x + 1) / (x * (x + 1)); }
  function sai(x) { return 2 / (2 * x + 1); }
  var hinhKhamPha = bangGiaTri({
    bbox: [-4, 4, 4, -3], x0: 1,
    ham: [{ fn: tong, mau: LA, day: 8, mo: 0.45 }, { fn: dung, mau: XANH, dash: 2, diem: false }, { fn: sai, mau: DO }],
    tiemCan: [0, -1],
    dong: [
      { chu: 'Phân thức thứ nhất', tex: '\\dfrac{1}{x}', fn: A, mau: CAM },
      { chu: 'Phân thức thứ hai', tex: '\\dfrac{1}{x+1}', fn: B, mau: CAM },
      { chu: 'Cộng hai giá trị trên:', tex: '\\dfrac{1}{x} + \\dfrac{1}{x+1}', fn: tong, mau: LA },
      { chu: 'Cách 1 – quy đồng rồi cộng:', tex: '\\dfrac{(x+1) + x}{x(x+1)} = \\dfrac{2x+1}{x(x+1)}', fn: dung, mau: XANH },
      { chu: 'Cách 2 – cộng tử với tử, mẫu với mẫu:', tex: '\\dfrac{1+1}{x + (x+1)} = \\dfrac{2}{2x+1}', fn: sai, mau: DO }
    ]
  });

  // Kiểm tra ví dụ 2 bằng số: 5/x + 3/(1 − x) = (5 − 2x)/(x(1 − x)).
  function C(x) { return 5 / x; }
  function D(x) { return 3 / (1 - x); }
  var hinhKiemTra = bangGiaTri({
    bbox: [-4, 4, 5, -2.75], x0: 2,
    ham: [{ fn: function (x) { return C(x) + D(x); }, mau: LA, day: 8, mo: 0.45 }, { fn: function (x) { return (5 - 2 * x) / (x * (1 - x)); }, mau: XANH, dash: 2, diem: false }],
    tiemCan: [0, 1],
    dong: [
      { chu: '', tex: '\\dfrac{5}{x}', fn: C, mau: CAM },
      { chu: '', tex: '\\dfrac{3}{1-x}', fn: D, mau: CAM },
      { chu: 'Tổng hai giá trị:', tex: '\\dfrac{5}{x} + \\dfrac{3}{1-x}', fn: function (x) { return C(x) + D(x); }, mau: LA },
      { chu: 'Kết quả đã tính:', tex: '\\dfrac{5-2x}{x(1-x)}', fn: function (x) { return (5 - 2 * x) / (x * (1 - x)); }, mau: XANH }
    ]
  });

  TOAN8.bai({
    id: 23, ten: 'Phép cộng và phép trừ phân thức đại số', sgk: { tap: 2, trang: 15 },

    khamPha: {
      nhiemVu: 'Hai bạn tính tổng $\\frac{1}{x} + \\frac{1}{x+1}$ theo hai cách. Kéo **điểm cam** trên trục hoành để đổi $x$ và so sánh với dòng **xanh lá** (cộng trực tiếp hai giá trị).\n\nĐường **xanh dương nét đứt** là cách 1 (quy đồng), đường **đỏ** là cách 2 (cộng tử với tử, mẫu với mẫu). Cách nào trùng khít với tổng thật?',
      widget: 'geo',
      config: hinhKhamPha,
      cauHoi: {
        de: 'Tại $x = 1$, tổng $\\frac{1}{x} + \\frac{1}{x+1}$ bằng bao nhiêu?',
        dapAn: { kieu: 'so', gt: 1.5 },
        goiY: ['Kéo điểm cam tới $x = 1$ và đọc dòng xanh lá.', '$\\frac{1}{1} + \\frac{1}{2} = ?$'],
        loiGiai: [
          '$\\frac{1}{1} + \\frac{1}{2} = 1{,}5$. Cách 1 cho $\\frac{2\\cdot 1+1}{1\\cdot 2} = \\frac{3}{2}$: **đúng**.',
          'Cách 2 cho $\\frac{2}{3}$: **sai**! Giống như $\\frac{1}{2} + \\frac{1}{3} \\ne \\frac{2}{5}$ ở phân số.',
          'Muốn cộng hai phân thức khác mẫu, phải **quy đồng mẫu** trước, rồi chỉ cộng các tử, **giữ nguyên** mẫu chung.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Cộng hai phân thức cùng mẫu',
        noiDung: 'Muốn cộng hai phân thức có **cùng mẫu thức**, ta cộng các tử thức với nhau và **giữ nguyên** mẫu thức:\n\n$$\\frac{\\ca{A}}{M} + \\frac{\\cb{B}}{M} = \\frac{\\ca{A} + \\cb{B}}{M}.$$\n\nKết quả gọi là **tổng**; ta thường viết tổng dưới dạng **rút gọn**.\n\nVí dụ: $\\frac{5x^2}{x-1} + \\frac{5-10x}{x-1} = \\frac{5x^2-10x+5}{x-1} = \\frac{5(x-1)^2}{x-1} = 5(x-1)$.' },
      { loai: 'dinhLi', tieuDe: '2. Cộng hai phân thức khác mẫu',
        noiDung: 'Muốn cộng hai phân thức có mẫu thức khác nhau, ta **quy đồng mẫu thức** rồi cộng các phân thức có cùng mẫu vừa tìm được.\n\nVí dụ: $\\frac{5}{x} + \\frac{3}{1-x} = \\frac{5(1-x)}{x(1-x)} + \\frac{3x}{x(1-x)} = \\frac{5 - 5x + 3x}{x(1-x)} = \\frac{5-2x}{x(1-x)}$.' },
      { loai: 'hinh', widget: 'geo', config: hinhKiemTra,
        chuThich: '**Kiểm tra kết quả bằng số:** kéo điểm cam tới vài giá trị của $x$ (khác $0$ và $1$). Dòng xanh lá (cộng trực tiếp) luôn bằng dòng xanh dương (kết quả đã tính) – hai đường trùng nhau. Em có thể dùng mẹo này để tự kiểm tra bài làm: thay một số vào đề và vào đáp án.' },
      { loai: 'dinhLi', tieuDe: '3. Trừ hai phân thức',
        noiDung: '• Cùng mẫu: trừ các tử thức và giữ nguyên mẫu: $\\frac{A}{M} - \\frac{B}{M} = \\frac{A - \\cd{(B)}}{M}$.\n\n• Khác mẫu: quy đồng mẫu thức rồi trừ.\n\n**Phân thức đối:** $\\frac{-C}{D}$ là phân thức đối của $\\frac{C}{D}$, kí hiệu $-\\frac{C}{D}$. Tổng của một phân thức và phân thức đối của nó bằng $0$. Do đó $\\frac{A}{B} - \\frac{C}{D} = \\frac{A}{B} + \\frac{-C}{D}$.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: '**1. Cộng tử với tử, mẫu với mẫu** – SAI: $\\frac{1}{x} + \\frac{1}{y} \\ne \\frac{2}{x+y}$. Mẫu chung **giữ nguyên**, chỉ cộng tử.\n\n**2. Quên đổi dấu khi trừ.** Tử thứ hai phải đặt trong **ngoặc**: $\\frac{x-1}{x+1} - \\frac{2x+3}{x+1} = \\frac{x - 1 \\cd{- 2x - 3}}{x+1} = \\frac{-x-4}{x+1}$ (đổi dấu **cả** $+3$ thành $-3$).\n\n**3. Mẫu đối nhau** như $x - 1$ và $1 - x$: đổi dấu một phân thức là có cùng mẫu, MTC chỉ là $x - 1$: $\\frac{x}{1-x} = \\frac{-x}{x-1}$.\n\n**4. Chưa rút gọn** kết quả cuối cùng.' },
      { loai: 'text', tieuDe: '4. Cộng, trừ nhiều phân thức',
        noiDung: 'Phép cộng phân thức có tính chất **giao hoán**, **kết hợp**: ta được đổi chỗ, nhóm các số hạng (kèm theo dấu của nó) một cách tuỳ ý. Ví dụ\n\n$\\frac{1}{x} + \\frac{1}{y} - \\frac{1}{x} = \\left(\\frac{1}{x} - \\frac{1}{x}\\right) + \\frac{1}{y} = \\frac{1}{y}$.\n\n**Quy tắc dấu ngoặc:** trước ngoặc có dấu "+" thì bỏ ngoặc giữ nguyên các số hạng; trước ngoặc có dấu "−" thì bỏ ngoặc và **đổi dấu** các số hạng trong ngoặc.' }
    ],

    viDu: [
      { de: 'Cộng hai phân thức $\\frac{5x^2}{x-1}$ và $\\frac{5-10x}{x-1}$.', buoc: [
        { lam: '$\\frac{5x^2}{x-1} + \\frac{5-10x}{x-1} = \\frac{5x^2 - 10x + 5}{x-1}$', vi: 'Cùng mẫu: cộng các tử, giữ nguyên mẫu.' },
        { lam: '$= \\frac{5(x^2-2x+1)}{x-1} = \\frac{5(x-1)^2}{x-1}$', vi: 'Phân tích tử thành nhân tử để rút gọn.' },
        { lam: '$= 5(x-1)$', vi: 'Chia cả tử và mẫu cho nhân tử chung $x - 1$.' } ] },
      { de: 'Tính tổng $\\frac{5}{x} + \\frac{3}{1-x}$.', buoc: [
        { lam: 'MTC $= x(1-x)$.', vi: 'Hai mẫu $x$ và $1 - x$ không có nhân tử chung nên MTC là tích của chúng.' },
        { lam: '$= \\frac{5(1-x)}{x(1-x)} + \\frac{3x}{x(1-x)}$', vi: 'Nhân tử phụ của $x$ là $1 - x$; của $1 - x$ là $x$.' },
        { lam: '$= \\frac{5 - 5x + 3x}{x(1-x)} = \\frac{5-2x}{x(1-x)}$', vi: 'Cộng các tử, giữ nguyên mẫu chung.' } ] },
      { de: 'Tính $\\frac{2x+1}{x} - \\frac{y-1}{y}$.', buoc: [
        { lam: '$= \\frac{(2x+1)y}{xy} - \\frac{x(y-1)}{xy}$', vi: 'Quy đồng với MTC $= xy$.' },
        { lam: '$= \\frac{(2x+1)y - x(y-1)}{xy}$', vi: 'Trừ các tử. Tử thứ hai giữ trong **ngoặc**.' },
        { lam: '$= \\frac{2xy + y - xy + x}{xy} = \\frac{xy+x+y}{xy}$', vi: 'Bỏ ngoặc có dấu trừ phía trước: đổi dấu $xy - x$ thành $-xy + x$.' } ] },
      { de: 'Tính $\\frac{x}{x-2} + \\frac{2}{2-x}$ (hai mẫu đối nhau).', buoc: [
        { lam: '$\\frac{2}{2-x} = \\frac{-2}{x-2}$', vi: 'Đổi dấu cả tử và mẫu để có cùng mẫu $x - 2$.' },
        { lam: '$\\frac{x}{x-2} + \\frac{-2}{x-2} = \\frac{x-2}{x-2} = 1$', vi: 'Cộng hai phân thức cùng mẫu rồi rút gọn.' } ] },
      { de: 'Rút gọn $P = \\frac{3}{2x+1} + \\left[\\frac{5}{4x-1} - \\left(\\frac{5}{4x-1} + \\frac{3}{2x+1}\\right)\\right]$.', buoc: [
        { lam: '$P = \\frac{3}{2x+1} + \\frac{5}{4x-1} - \\frac{5}{4x-1} - \\frac{3}{2x+1}$', vi: 'Bỏ ngoặc: trước ngoặc tròn có dấu "−" nên đổi dấu các số hạng trong đó.' },
        { lam: '$= \\left(\\frac{3}{2x+1} - \\frac{3}{2x+1}\\right) + \\left(\\frac{5}{4x-1} - \\frac{5}{4x-1}\\right) = 0$', vi: 'Giao hoán, kết hợp: nhóm từng cặp phân thức đối nhau.' } ] }
    ],

    viDuMo: [
      { de: 'Tính $\\frac{x-1}{x+1} - \\frac{2x+3}{x+1}$.', buoc: [
        { lam: '$= \\frac{(x-1) - (2x+3)}{x+1}$', vi: 'Cùng mẫu: trừ các tử, tử thứ hai đặt trong ngoặc.' },
        { lam: '$= \\frac{x - 1 - 2x - 3}{x+1} = \\frac{-x-4}{x+1}$', vi: 'Em hãy bỏ ngoặc, thu gọn và ghi kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '(-x-4)/(x+1)', dang: 'rutGon' },
          loiThuongGap: [{ gt: '(-x+2)/(x+1)', giaiThich: 'Trước ngoặc $(2x + 3)$ có dấu trừ nên phải đổi dấu **cả hai** hạng tử: $-2x - 3$, không phải $-2x + 3$.' }] } ] },
      { de: 'Tính $\\frac{1}{x+1} - \\frac{1}{x}$.', buoc: [
        { lam: '$= \\frac{x}{x(x+1)} - \\frac{x+1}{x(x+1)}$', vi: 'Quy đồng với MTC $= x(x+1)$.' },
        { lam: '$= \\frac{x - (x+1)}{x(x+1)} = \\frac{-1}{x(x+1)}$', vi: 'Em hãy trừ các tử và ghi kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '-1/(x(x+1))', dang: 'rutGon' },
          loiThuongGap: [
            { gt: '0', giaiThich: 'Không được trừ tử với tử, mẫu với mẫu ($\\frac{1-1}{(x+1)-x}$). Phải quy đồng mẫu trước.' },
            { gt: '1/(x(x+1))', giaiThich: 'Tử là $x - (x+1) = -1$ (phân thức thứ nhất trừ phân thức thứ hai), không phải $(x+1) - x$.' }] } ] }
    ],

    baiTap: [
      { id: '23.1', muc: 1, de: 'Tính và rút gọn: $\\frac{3x+1}{xy} + \\frac{2x-1}{xy}$.',
        dapAn: { kieu: 'bieuThuc', gt: '5/y', dang: 'rutGon' },
        goiY: ['Hai phân thức cùng mẫu: cộng các tử, giữ nguyên mẫu.', 'Được $\\frac{5x}{xy}$. Rút gọn tiếp.'],
        loiGiai: ['$\\frac{3x+1}{xy} + \\frac{2x-1}{xy} = \\frac{3x + 1 + 2x - 1}{xy} = \\frac{5x}{xy}$', '$= \\frac{5}{y}$'],
        loiThuongGap: [{ gt: '5/(2y)', giaiThich: 'Mẫu chung **giữ nguyên** là $xy$, không cộng hai mẫu $xy + xy$.' }] },

      { id: '23.2', muc: 1, de: 'Tính: $\\frac{4x}{x^2+2} + \\frac{2-4x}{x^2+2}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2/(x^2+2)', dang: 'rutGon' },
        goiY: ['Cùng mẫu: cộng các tử, giữ nguyên mẫu.'],
        loiGiai: ['$= \\frac{4x + 2 - 4x}{x^2+2}$', '$= \\frac{2}{x^2+2}$'],
        loiThuongGap: [{ gt: '2/(2x^2+4)', giaiThich: 'Không cộng hai mẫu với nhau. Mẫu chung giữ nguyên là $x^2 + 2$.' }] },

      { id: '23.3', muc: 1, de: 'Tính: $\\frac{4-x}{x+2} - \\frac{1-3x}{x+2}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(2x+3)/(x+2)', dang: 'rutGon' },
        goiY: ['Cùng mẫu: tử là $(4 - x) - (1 - 3x)$.', 'Bỏ ngoặc có dấu trừ: đổi dấu cả $1$ và $-3x$.'],
        loiGiai: ['$= \\frac{(4-x) - (1-3x)}{x+2} = \\frac{4 - x - 1 + 3x}{x+2}$', '$= \\frac{2x+3}{x+2}$'],
        loiThuongGap: [{ gt: '(3-4x)/(x+2)', giaiThich: 'Quên đổi dấu: $-(1 - 3x) = -1 + 3x$, không phải $-1 - 3x$.' }] },

      { id: '23.4', muc: 1, de: 'Phân thức **đối** của $\\frac{x-3}{x+1}$ là phân thức nào?',
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$\\frac{x+3}{x+1}$', '$\\frac{3-x}{x+1}$', '$\\frac{x+1}{x-3}$', '$\\frac{x-3}{x-1}$'] },
        goiY: ['Phân thức đối của $\\frac{C}{D}$ là $\\frac{-C}{D}$ (tổng của chúng bằng $0$).', 'Đổi dấu tử: $-(x - 3) = ?$'],
        loiGiai: ['Phân thức đối của $\\frac{x-3}{x+1}$ là $\\frac{-(x-3)}{x+1} = \\frac{3-x}{x+1}$.', '(Còn $\\frac{x+1}{x-3}$ là phân thức **nghịch đảo**, sẽ học ở bài 24.)'] },

      { id: '23.5', muc: 2, de: 'Tính: $\\frac{1}{2x^2y} - \\frac{1}{3xy^2}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(3y-2x)/(6x^2y^2)', dang: 'rutGon' },
        goiY: ['MTC $= 6x^2y^2$.', 'Nhân tử phụ: $3y$ và $2x$.'],
        loiGiai: ['$= \\frac{3y}{6x^2y^2} - \\frac{2x}{6x^2y^2}$', '$= \\frac{3y-2x}{6x^2y^2}$'],
        loiThuongGap: [{ gt: '0', giaiThich: 'Không được trừ tử với tử, mẫu với mẫu. Phải quy đồng (MTC $= 6x^2y^2$) rồi mới trừ.' }, { gt: '1/(6x^2y^2)', giaiThich: 'Đổi mẫu thì phải nhân cả tử với nhân tử phụ: $1\\cdot 3y$ và $1\\cdot 2x$.' }] },

      { id: '23.6', muc: 2, de: 'Tính và rút gọn: $\\frac{x^2}{x-2} + \\frac{4}{2-x}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x+2', dang: 'rutGon' },
        goiY: ['Hai mẫu đối nhau: $\\frac{4}{2-x} = \\frac{-4}{x-2}$.', 'Cộng xong được $\\frac{x^2-4}{x-2}$, rút gọn tiếp.'],
        loiGiai: ['$= \\frac{x^2}{x-2} + \\frac{-4}{x-2} = \\frac{x^2-4}{x-2}$', '$= \\frac{(x-2)(x+2)}{x-2} = x+2$'],
        loiThuongGap: [{ gt: '(x^2+4)/(x-2)', giaiThich: 'Đổi mẫu $2 - x$ thành $x - 2$ thì phải đổi dấu tử: $\\frac{4}{2-x} = \\frac{-4}{x-2}$.' }] },

      { id: '23.7', muc: 2, de: 'Tính: $\\frac{2}{x-2} + \\frac{2}{x+2}$.',
        dapAn: { kieu: 'bieuThuc', gt: '4x/(x^2-4)', dang: 'rutGon' },
        goiY: ['MTC $= (x-2)(x+2)$.', 'Tử: $2(x+2) + 2(x-2)$.'],
        loiGiai: ['$= \\frac{2(x+2) + 2(x-2)}{(x-2)(x+2)}$', '$= \\frac{4x}{(x-2)(x+2)} = \\frac{4x}{x^2-4}$'],
        loiThuongGap: [{ gt: '4/(2x)', giaiThich: 'Cộng tử với tử, mẫu với mẫu là **sai**. Phải quy đồng mẫu rồi chỉ cộng các tử.' }] },

      { id: '23.8', muc: 2, de: 'Tính và rút gọn: $\\frac{x}{3x-12} + \\frac{16}{3x(4-x)}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(x+4)/(3x)', dang: 'rutGon' },
        goiY: ['$3x - 12 = 3(x-4)$ và $\\frac{16}{3x(4-x)} = \\frac{-16}{3x(x-4)}$.', 'MTC $= 3x(x-4)$; tử sau khi cộng là $x^2 - 16$, phân tích rồi rút gọn.'],
        loiGiai: ['$= \\frac{x}{3(x-4)} - \\frac{16}{3x(x-4)} = \\frac{x^2 - 16}{3x(x-4)}$', '$= \\frac{(x-4)(x+4)}{3x(x-4)} = \\frac{x+4}{3x}$'],
        loiThuongGap: [{ gt: '(x^2+16)/(3x(x-4))', giaiThich: '$4 - x = -(x - 4)$, nên phân thức thứ hai đổi thành $\\frac{-16}{3x(x-4)}$ (tử mang dấu trừ).' }] },

      { id: '23.9', muc: 2, de: 'Tính và rút gọn: $\\frac{1}{x-1} - \\frac{2}{x^2-1}$.',
        dapAn: { kieu: 'bieuThuc', gt: '1/(x+1)', dang: 'rutGon' },
        goiY: ['$x^2 - 1 = (x-1)(x+1)$ chính là MTC.', 'Tử: $(x + 1) - 2 = x - 1$. Rút gọn tiếp.'],
        loiGiai: ['$= \\frac{x+1}{(x-1)(x+1)} - \\frac{2}{(x-1)(x+1)} = \\frac{x - 1}{(x-1)(x+1)}$', '$= \\frac{1}{x+1}$'],
        loiThuongGap: [{ gt: '(x+3)/(x^2-1)', giaiThich: 'Đây là phép **trừ**: tử là $(x+1) - 2 = x - 1$.' }] },

      { id: '23.10', muc: 3, de: 'Biết $\\frac{1}{x(x+1)} = \\frac{1}{x} - \\frac{1}{x+1}$. Rút gọn $\\frac{1}{x(x+1)} + \\frac{1}{(x+1)(x+2)}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2/(x(x+2))', dang: 'rutGon' },
        goiY: ['Tương tự: $\\frac{1}{(x+1)(x+2)} = \\frac{1}{x+1} - \\frac{1}{x+2}$.', 'Cộng lại, hai phân thức $\\frac{1}{x+1}$ triệt tiêu, còn $\\frac{1}{x} - \\frac{1}{x+2}$.'],
        loiGiai: ['$= \\frac{1}{x} - \\frac{1}{x+1} + \\frac{1}{x+1} - \\frac{1}{x+2} = \\frac{1}{x} - \\frac{1}{x+2}$', '$= \\frac{(x+2) - x}{x(x+2)} = \\frac{2}{x(x+2)}$'],
        loiThuongGap: [{ gt: '1/(x(x+2))', giaiThich: 'Tử là $(x + 2) - x = 2$, không phải $1$.' }] },

      { id: '23.11', muc: 3, de: 'Một tàu du lịch chạy xuôi dòng $24$ km rồi quay ngược lại về chỗ cũ. Vận tốc tàu khi nước yên lặng là $14$ km/h, vận tốc dòng nước là $x$ (km/h).\n\na) Viết phân thức (thu gọn) biểu thị tổng thời gian tàu chạy.\n\nb) Tính tổng thời gian khi $x = 2$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Tổng thời gian (giờ)', kieu: 'bieuThuc', gt: '672/(196-x^2)',
            loiThuongGap: [{ gt: '48/28', giaiThich: 'Không cộng tử với tử, mẫu với mẫu. Quy đồng với MTC $(14+x)(14-x)$.' }] },
          { nhan: 'b) Khi $x = 2$ (giờ)', kieu: 'so', gt: 3.5,
            loiThuongGap: [{ gt: '24/7', giaiThich: 'Em quên vận tốc dòng nước: xuôi dòng $14 + 2 = 16$, ngược dòng $14 - 2 = 12$ km/h.' }] }] },
        goiY: ['Vận tốc xuôi dòng $14 + x$, ngược dòng $14 - x$. Thời gian: $\\frac{24}{14+x}$ và $\\frac{24}{14-x}$.', 'Quy đồng: MTC $= (14+x)(14-x) = 196 - x^2$.'],
        loiGiai: ['a) $\\frac{24}{14+x} + \\frac{24}{14-x} = \\frac{24(14-x) + 24(14+x)}{196 - x^2} = \\frac{672}{196-x^2}$.', 'b) $\\frac{672}{196-4} = \\frac{672}{192} = 3{,}5$ giờ (hoặc $\\frac{24}{16} + \\frac{24}{12} = 1{,}5 + 2$).'] },

      { id: '23.12', muc: 3, de: 'Chú Đức lái ô tô về quê: $30$ km đường thành phố với vận tốc $x$ (km/h), rồi $60$ km đường cao tốc với vận tốc lớn hơn vận tốc trong thành phố $40$ km/h, cuối cùng chạy thêm nửa giờ nữa.\n\na) Viết biểu thức biểu thị tổng thời gian (giờ) theo $x$.\n\nb) Tính tổng thời gian khi $x = 40$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Tổng thời gian', kieu: 'bieuThuc', gt: '30/x+60/(x+40)+1/2',
            loiThuongGap: [{ gt: '30/x+60/x+1/2', giaiThich: 'Trên cao tốc vận tốc là $x + 40$, không phải $x$.' }] },
          { nhan: 'b) Khi $x = 40$ (giờ)', kieu: 'so', gt: 2,
            loiThuongGap: [{ gt: 1.5, giaiThich: 'Em quên cộng thêm nửa giờ chạy cuối cùng.' }] }] },
        goiY: ['Thời gian = quãng đường : vận tốc. Hai chặng: $\\frac{30}{x}$ và $\\frac{60}{x+40}$; thêm $\\frac{1}{2}$ giờ.', 'Thay $x = 40$: vận tốc cao tốc là $80$ km/h.'],
        loiGiai: ['a) $\\frac{30}{x} + \\frac{60}{x+40} + \\frac{1}{2} = \\frac{x^2 + 220x + 2400}{2x(x+40)}$ (giờ).', 'b) $\\frac{30}{40} + \\frac{60}{80} + \\frac{1}{2} = 0{,}75 + 0{,}75 + 0{,}5 = 2$ giờ.'] }
    ],

    timLoi: [
      { de: 'Bạn Nam tính $\\frac{1}{x} + \\frac{2}{x+1}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{1}{x} + \\frac{2}{x+1} = \\frac{1+2}{x + x + 1}$', '$= \\frac{3}{2x+1}$'],
        dongSai: 0, giaiThich: 'Không được cộng tử với tử, mẫu với mẫu. Phải quy đồng mẫu (MTC $= x(x+1)$), cộng các tử, giữ nguyên mẫu chung. Thử $x = 1$: $1 + 1 = 2$ nhưng $\\frac{3}{3} = 1$.', sua: '$\\frac{x+1}{x(x+1)} + \\frac{2x}{x(x+1)} = \\frac{3x+1}{x(x+1)}$' },
      { de: 'Bạn Lan tính $\\frac{2x+1}{x-3} - \\frac{x-2}{x-3}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$= \\frac{2x + 1 - x - 2}{x-3}$', '$= \\frac{x-1}{x-3}$'],
        dongSai: 0, giaiThich: 'Trừ cả tử $(x - 2)$ nên phải đổi dấu **tất cả** hạng tử: $-(x - 2) = -x + 2$. Bạn Lan quên đổi dấu số $-2$.', sua: '$= \\frac{2x + 1 - x + 2}{x-3} = \\frac{x+3}{x-3}$' },
      { de: 'Bạn Minh tính $\\frac{5}{x-1} + \\frac{x}{1-x}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{5}{x-1} + \\frac{x}{1-x} = \\frac{5}{x-1} + \\frac{x}{x-1}$', '$= \\frac{5+x}{x-1}$'],
        dongSai: 0, giaiThich: 'Đổi dấu mẫu ($1 - x$ thành $x - 1$) thì phải đổi dấu cả tử: $\\frac{x}{1-x} = \\frac{-x}{x-1}$.', sua: '$\\frac{5}{x-1} + \\frac{-x}{x-1} = \\frac{5-x}{x-1}$' }
    ]
  });
})();
