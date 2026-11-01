// Bài 22 – Tính chất cơ bản của phân thức đại số (SGK Toán 8 KNTT Tập 2, tr. 8–14, gồm Luyện tập chung)
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

  // Khám phá: P = (x² + 2x)/(x² − 4). Rút gọn đúng: x/(x − 2). "Gạch bừa" x²: 2x/(−4).
  function goc(x) { return (x * x + 2 * x) / (x * x - 4); }
  function dung(x) { return x / (x - 2); }
  function sai(x) { return 2 * x / -4; }
  var hinhKhamPha = bangGiaTri({
    bbox: [-6, 5, 6, -4], x0: 4,
    ham: [{ fn: goc, mau: LA, day: 8, mo: 0.45 }, { fn: dung, mau: XANH, dash: 2, diem: false }, { fn: sai, mau: DO }],
    tiemCan: [2], lo: [[-2, 0.5, LA]],
    dong: [
      { chu: 'Phân thức ban đầu', tex: '\\dfrac{x^2+2x}{x^2-4}', fn: goc, mau: LA },
      { chu: 'Cách 1 – phân tích rồi chia:', tex: '\\dfrac{x(x+2)}{(x-2)(x+2)} = \\dfrac{x}{x-2}', fn: dung, mau: XANH },
      { chu: 'Cách 2 – "gạch" x²:', tex: '\\dfrac{2x}{-4}', fn: sai, mau: DO }
    ]
  });

  // Rút gọn xong vẫn nhớ điều kiện xác định: (x² − 4)/(x − 2) = x + 2 nhưng có "lỗ" tại x = 2.
  function lt(x) { return (x * x - 4) / (x - 2); }
  var hinhLo = bangGiaTri({
    bbox: [-5, 7, 5, -1.5], x0: 1,
    ham: [{ fn: lt, mau: XANH }], lo: [[2, 4, XANH]],
    dong: [
      { chu: 'Phân thức', tex: 'P = \\dfrac{x^2-4}{x-2}', fn: lt, mau: XANH },
      { chu: 'Sau khi rút gọn', tex: 'Q = x + 2', fn: function (x) { return x + 2; }, mau: LA }
    ]
  });

  // Mô hình diện tích: 2x² + 2x là hình chữ nhật cạnh 2x và x + 1.
  var hinhNhanTu = {
    hang: [{ nhan: '2x', dai: '2*x', mau: CAM }],
    cot: [{ nhan: 'x', dai: 'x', mau: CAM }, { nhan: '1', dai: 1, mau: XANH }],
    thanhTruot: [{ ten: 'x', min: 1, max: 4, buoc: 0.5, gt: 2 }],
    congThuc: '\\ca{2x^2} + \\cc{2x} = 2x\\,(x+1)'
  };

  TOAN8.bai({
    id: 22, ten: 'Tính chất cơ bản của phân thức đại số', sgk: { tap: 2, trang: 8 },

    khamPha: {
      nhiemVu: 'Hai bạn rút gọn phân thức $\\frac{x^2+2x}{x^2-4}$ theo hai cách khác nhau. Kéo **điểm cam** trên trục hoành để đổi $x$ và so sánh các giá trị ở bảng dưới hình.\n\nĐường **xanh lá** (đậm) là phân thức ban đầu, đường **xanh dương nét đứt** là cách 1, đường **đỏ** là cách 2. Cách nào luôn "trùng khít" với phân thức ban đầu?',
      widget: 'geo',
      config: hinhKhamPha,
      cauHoi: {
        de: 'Cách rút gọn nào **đúng** (luôn cho cùng giá trị với phân thức ban đầu)?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Cách 1: phân tích tử và mẫu thành nhân tử rồi chia cho nhân tử chung $x + 2$', 'Cách 2: gạch $x^2$ ở tử và ở mẫu', 'Cả hai cách đều đúng'] },
        goiY: ['Kéo điểm cam tới $x = 4$: so ba giá trị trong bảng.', 'Đường đỏ có nằm trên đường xanh lá không?'],
        loiGiai: [
          'Tại $x = 4$: phân thức ban đầu $= \\frac{24}{12} = 2$; cách 1 $= \\frac{4}{2} = 2$; cách 2 $= \\frac{8}{-4} = -2$. Cách 2 sai!',
          '$x^2$ chỉ là một **hạng tử** (một số hạng của tổng), không phải nhân tử của cả tử, cả mẫu. **Chỉ được chia cả tử và mẫu cho một nhân tử chung.**',
          'Cách 1 đúng: $\\frac{x^2+2x}{x^2-4} = \\frac{x(x+2)}{(x-2)(x+2)} = \\frac{x}{x-2}$.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhLi', tieuDe: '1. Tính chất cơ bản của phân thức',
        noiDung: '• Nhân cả tử và mẫu với cùng một đa thức $M$ khác đa thức 0 thì được phân thức bằng phân thức đã cho:\n\n$$\\frac{A}{B} = \\frac{A\\cdot \\cc{M}}{B\\cdot \\cc{M}}.$$\n\n• Chia cả tử và mẫu cho một **nhân tử chung** $N$ thì được phân thức bằng phân thức đã cho:\n\n$$\\frac{A}{B} = \\frac{A : \\cc{N}}{B : \\cc{N}}.$$' },
      { loai: 'chuY', tieuDe: 'Quy tắc đổi dấu',
        noiDung: 'Đổi dấu **cả tử và mẫu** thì được phân thức bằng phân thức đã cho: $\\frac{A}{B} = \\frac{-A}{-B}$.\n\nĐổi dấu một đa thức là đổi dấu **tất cả** các hạng tử của nó: $-(1-x) = x - 1$; $\\;-(4-x) = x - 4$.\n\nVí dụ: $\\frac{-x}{1-x} = \\frac{x}{x-1}$; $\\;\\frac{y-x}{4-x} = \\frac{x-y}{x-4}$.' },
      { loai: 'dinhLi', tieuDe: '2. Rút gọn phân thức',
        noiDung: 'Muốn rút gọn một phân thức ta làm như sau:\n\n**Bước 1.** Phân tích tử và mẫu thành **nhân tử** (nếu cần) để tìm nhân tử chung.\n\n**Bước 2.** Chia cả tử và mẫu cho nhân tử chung đó.\n\nVí dụ: $\\frac{2x^2+2x}{x^2-1} = \\frac{2x\\cc{(x+1)}}{(x-1)\\cc{(x+1)}} = \\frac{2x}{x-1}$.' },
      { loai: 'hinh', widget: 'dienTich', config: hinhNhanTu,
        chuThich: 'Tử $2x^2 + 2x$ là diện tích của hình chữ nhật có hai cạnh $2x$ và $x + 1$, nên $2x^2 + 2x = 2x(x+1)$. Mẫu $x^2 - 1 = (x-1)(x+1)$. Cả hai đều có **nhân tử** $(x+1)$ – đó mới là thứ được phép chia đi.' },
      { loai: 'chuY', tieuDe: 'Lỗi hay gặp nhất: "gạch bừa" hạng tử',
        noiDung: 'Chỉ được gạch (chia) **nhân tử chung của cả tử và cả mẫu**, không được gạch một **hạng tử** đứng trong tổng/hiệu.\n\n✘ $\\frac{x+3}{x+6} = \\frac{3}{6}$ (sai! thử $x = 1$: $\\frac{4}{7} \\ne \\frac{1}{2}$).\n\n✘ $\\frac{x^2+2x}{3x^3+2x} = \\frac{x^2}{3x^3}$ (gạch hạng tử $2x$ – sai).\n\n✔ $\\frac{x^2+2x}{3x^3+2x} = \\frac{x(x+2)}{x(3x^2+2)} = \\frac{x+2}{3x^2+2}$.\n\n**Mẹo tự kiểm tra:** thay một số (ví dụ $x = 1$) vào phân thức trước và sau khi rút gọn; hai giá trị phải bằng nhau.' },
      { loai: 'dinhLi', tieuDe: '3. Quy đồng mẫu thức nhiều phân thức',
        noiDung: '**Bước 1.** Phân tích các mẫu thành nhân tử rồi tìm **mẫu thức chung** (MTC):\n– phần số: BCNN của các hệ số;\n– mỗi nhân tử (lũy thừa của cùng một biểu thức): lấy với **số mũ cao nhất**.\n\n**Bước 2.** Tìm **nhân tử phụ** của mỗi mẫu: MTC chia cho mẫu đó.\n\n**Bước 3.** Nhân **cả tử và mẫu** của mỗi phân thức với nhân tử phụ tương ứng.\n\nVí dụ: $\\frac{1}{2x^2+2x}$ và $\\frac{1}{3x^2-6x}$: mẫu là $2x(x+1)$ và $3x(x-2)$, MTC $= 6x(x+1)(x-2)$.' },
      { loai: 'hinh', widget: 'geo', config: hinhLo,
        chuThich: '$P = \\frac{x^2-4}{x-2} = \\frac{(x-2)(x+2)}{x-2} = x + 2$. Đồ thị giống hệt đường thẳng $y = x + 2$, nhưng có một **lỗ hổng** tại $x = 2$: kéo điểm cam tới $x = 2$, $P$ không xác định còn $Q$ vẫn bằng $4$.\n\n**Chú ý:** muốn tính giá trị phân thức, ta nên rút gọn rồi thay số – nhưng phải kiểm tra giá trị đó thoả mãn điều kiện xác định của phân thức **ban đầu**.' }
    ],

    viDu: [
      { de: 'Dùng tính chất cơ bản của phân thức, giải thích vì sao $\\frac{2x+2}{x^2-1} = \\frac{2}{x-1}$.', buoc: [
        { lam: '$\\frac{2x+2}{x^2-1} = \\frac{2\\cc{(x+1)}}{(x-1)\\cc{(x+1)}}$', vi: 'Phân tích tử (đặt nhân tử chung 2) và mẫu (hiệu hai bình phương) thành nhân tử.' },
        { lam: '$= \\frac{2}{x-1}$', vi: 'Chia cả tử và mẫu cho nhân tử chung $x + 1$.' } ] },
      { de: 'Rút gọn phân thức $P = \\frac{x^2-xy}{3(xy^2-y^3)}$.', buoc: [
        { lam: 'Tử: $x^2 - xy = x(x-y)$. Mẫu: $3(xy^2 - y^3) = 3y^2(x-y)$.', vi: 'Bước 1: phân tích thành nhân tử (đặt nhân tử chung).' },
        { lam: '$P = \\frac{x\\cc{(x-y)}}{3y^2\\cc{(x-y)}} = \\frac{x}{3y^2}$', vi: 'Bước 2: chia cả tử và mẫu cho nhân tử chung $x - y$.' } ] },
      { de: 'Tìm đa thức thích hợp thay cho dấu "?": $\\frac{y-x}{4-x} = \\frac{?}{x-4}$.', buoc: [
        { lam: 'Mẫu $4 - x$ đã được đổi dấu thành $x - 4$.', vi: 'Vì $-(4 - x) = x - 4$.' },
        { lam: 'Đổi dấu tử: $-(y - x) = x - y$. Vậy $\\frac{y-x}{4-x} = \\frac{x-y}{x-4}$.', vi: 'Quy tắc đổi dấu: đổi dấu **cả tử và mẫu** thì phân thức không đổi.' } ] },
      { de: 'Quy đồng mẫu thức hai phân thức $\\frac{1}{2x^2+2x}$ và $\\frac{1}{3x^2-6x}$.', buoc: [
        { lam: '$2x^2 + 2x = 2x(x+1)$; $\\;3x^2 - 6x = 3x(x-2)$.', vi: 'Bước 1: phân tích các mẫu thành nhân tử.' },
        { lam: 'MTC $= 6x(x+1)(x-2)$.', vi: 'BCNN$(2, 3) = 6$; nhân tử $x$, $x+1$, $x-2$ mỗi cái lấy một lần (số mũ cao nhất là 1).' },
        { lam: 'Nhân tử phụ: $6x(x+1)(x-2) : [2x(x+1)] = 3(x-2)$ và $6x(x+1)(x-2) : [3x(x-2)] = 2(x+1)$.', vi: 'Bước 2: lấy MTC chia cho từng mẫu.' },
        { lam: '$\\frac{1}{2x^2+2x} = \\frac{3(x-2)}{6x(x+1)(x-2)}$; $\\;\\frac{1}{3x^2-6x} = \\frac{2(x+1)}{6x(x+1)(x-2)}$.', vi: 'Bước 3: nhân **cả tử và mẫu** với nhân tử phụ.' } ] },
      { de: '(Luyện tập chung) Cho $P = \\frac{x^2-4}{x-2}$. Viết điều kiện xác định, rút gọn $P$ rồi tính giá trị của $P$ tại $x = 13$.', buoc: [
        { lam: 'Điều kiện xác định: $x - 2 \\ne 0$, tức $x \\ne 2$.', vi: 'Mẫu phải khác $0$.' },
        { lam: '$P = \\frac{(x-2)(x+2)}{x-2} = x + 2$.', vi: 'Phân tích tử bằng hiệu hai bình phương rồi chia cho nhân tử chung $x - 2$.' },
        { lam: '$x = 13 \\ne 2$ nên thay vào phân thức đã rút gọn: $P = 13 + 2 = 15$.', vi: 'Tính trên phân thức rút gọn nhanh hơn nhiều so với $\\frac{13^2-4}{13-2} = \\frac{165}{11}$.' } ] }
    ],

    viDuMo: [
      { de: 'Rút gọn phân thức $\\frac{3x+6}{x^2+2x}$.', buoc: [
        { lam: '$\\frac{3x+6}{x^2+2x} = \\frac{3(x+2)}{x(x+2)}$', vi: 'Phân tích tử và mẫu thành nhân tử.' },
        { lam: '$= \\frac{3}{x}$', vi: 'Em hãy chia cho nhân tử chung và ghi kết quả:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '3/x', dang: 'rutGon' },
          loiThuongGap: [{ gt: '3', giaiThich: 'Không gạch được $x$ ở mẫu: $x$ không phải nhân tử chung của tử $3(x+2)$. Chỉ chia cho $x + 2$ thôi.' }] } ] },
      { de: 'Tìm mẫu thức chung của $\\frac{3}{4x^2y}$ và $\\frac{5}{6xy^2}$.', buoc: [
        { lam: 'Phần số: BCNN$(4, 6) = 12$.', vi: 'Lấy BCNN chứ không nhân $4\\cdot 6 = 24$.' },
        { lam: 'Lũy thừa cao nhất của $x$ là $x^2$, của $y$ là $y^2$. MTC $= 12x^2y^2$', vi: 'Em hãy viết mẫu thức chung:', an: true,
          dapAn: { kieu: 'bieuThuc', gt: '12x^2y^2' },
          loiThuongGap: [
            { gt: '24x^3y^3', giaiThich: 'Em đã nhân hai mẫu với nhau. MTC chỉ lấy BCNN$(4,6) = 12$ và mỗi biến với **số mũ cao nhất**: $x^2$, $y^2$.' },
            { gt: '12xy', giaiThich: 'Phải lấy số mũ **cao nhất** của mỗi biến: $x^2$ và $y^2$.' }] } ] }
    ],

    baiTap: [
      { id: '22.1', muc: 1, de: 'Tìm đa thức thay cho dấu "?": $\\frac{x+1}{x-3} = \\frac{?}{2x(x-3)}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2x(x+1)' },
        goiY: ['Mẫu $x - 3$ đã được nhân với gì để thành $2x(x-3)$?', 'Nhân cả tử với đúng đa thức đó.'],
        loiGiai: ['Mẫu được nhân với $2x$: $(x-3)\\cdot 2x$.', 'Tử cũng phải nhân với $2x$: $? = 2x(x+1)$'],
        loiThuongGap: [{ gt: 'x+1', giaiThich: 'Mẫu đã nhân với $2x$ thì tử cũng phải nhân với $2x$ (tính chất cơ bản).' }] },

      { id: '22.2', muc: 1, de: 'Tìm đa thức thay cho dấu "?": $\\frac{5-x}{3-x} = \\frac{?}{x-3}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x-5' },
        goiY: ['Mẫu $3 - x$ đã được đổi dấu thành $x - 3$.', 'Quy tắc đổi dấu: đổi dấu cả tử: $-(5 - x) = ?$'],
        loiGiai: ['Mẫu đổi dấu: $-(3 - x) = x - 3$.', 'Tử cũng đổi dấu: $? = -(5-x) = x - 5$'],
        loiThuongGap: [{ gt: '5-x', giaiThich: 'Mẫu đã đổi dấu thì tử cũng phải đổi dấu: $-(5 - x) = x - 5$.' }, { gt: '-x-5', giaiThich: 'Đổi dấu **tất cả** hạng tử: $5 \\to -5$ và $-x \\to x$, được $x - 5$.' }] },

      { id: '22.3', muc: 1, de: 'Rút gọn phân thức $\\frac{12x^3y^2}{18xy^5}$.',
        dapAn: { kieu: 'bieuThuc', gt: '2x^2/(3y^3)', dang: 'rutGon' },
        goiY: ['Nhân tử chung của tử và mẫu là $6xy^2$.', 'Chia: $12 : 6 = 2$; $18 : 6 = 3$; $x^3 : x = x^2$; $y^5 : y^2 = y^3$.'],
        loiGiai: ['$\\frac{12x^3y^2}{18xy^5} = \\frac{6xy^2\\cdot 2x^2}{6xy^2\\cdot 3y^3}$', '$= \\frac{2x^2}{3y^3}$'],
        loiThuongGap: [{ gt: '2x^3/(3y^3)', giaiThich: 'Mẫu còn $x$, nên tử phải chia cho $x$: $x^3 : x = x^2$.' }, { gt: '2x^2y^3/3', giaiThich: '$y^2$ ở tử, $y^5$ ở mẫu: sau khi chia còn $y^3$ ở **mẫu**.' }] },

      { id: '22.4', muc: 1, de: 'Rút gọn phân thức $\\frac{x^2-9}{2x+6}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(x-3)/2', dang: 'rutGon' },
        goiY: ['Phân tích: $x^2 - 9 = (x-3)(x+3)$; $2x + 6 = 2(x+3)$.', 'Chia cả tử và mẫu cho nhân tử chung $x + 3$.'],
        loiGiai: ['$\\frac{x^2-9}{2x+6} = \\frac{(x-3)(x+3)}{2(x+3)}$', '$= \\frac{x-3}{2}$'],
        loiThuongGap: [
          { gt: '(x-9)/8', giaiThich: 'Em đã "gạch bừa" $x$ ở hạng tử $x^2$ và $2x$. Phải phân tích thành nhân tử trước rồi mới chia.' },
          { gt: '(x+3)/2', giaiThich: '$x^2 - 9 = (x-3)(x+3)$. Nhân tử chung là $x + 3$, nên còn lại $x - 3$ ở tử.' }] },

      { id: '22.5', muc: 2, de: 'Rút gọn phân thức $\\frac{20x(2-x)}{8x(x-2)^3}$.',
        dapAn: { kieu: 'bieuThuc', gt: '-5/(2(x-2)^2)', dang: 'rutGon' },
        goiY: ['Đổi dấu: $2 - x = -(x - 2)$.', 'Nhân tử chung là $4x(x-2)$. Đừng quên dấu trừ!'],
        loiGiai: ['$\\frac{20x(2-x)}{8x(x-2)^3} = \\frac{-20x(x-2)}{8x(x-2)^3}$', '$= \\frac{-5\\cdot 4x(x-2)}{2(x-2)^2\\cdot 4x(x-2)}$', '$= \\frac{-5}{2(x-2)^2}$'],
        loiThuongGap: [{ gt: '5/(2(x-2)^2)', giaiThich: '$2 - x = -(x - 2)$: khi đổi $2 - x$ thành $x - 2$ phải thêm dấu trừ.' }] },

      { id: '22.6', muc: 2, de: 'Rút gọn phân thức $\\frac{x^2-6x+9}{x^2-9}$.',
        dapAn: { kieu: 'bieuThuc', gt: '(x-3)/(x+3)', dang: 'rutGon' },
        goiY: ['Tử là bình phương của một hiệu, mẫu là hiệu hai bình phương.', '$x^2 - 6x + 9 = (x-3)^2$; $x^2 - 9 = (x-3)(x+3)$.'],
        loiGiai: ['$\\frac{x^2-6x+9}{x^2-9} = \\frac{(x-3)^2}{(x-3)(x+3)}$', '$= \\frac{x-3}{x+3}$'],
        loiThuongGap: [{ gt: '(-6x+9)/(-9)', giaiThich: 'Không được gạch hạng tử $x^2$! Phải phân tích tử và mẫu thành nhân tử rồi chia cho nhân tử chung $x - 3$.' }] },

      { id: '22.7', muc: 2, de: 'Tìm số $a$ sao cho hai phân thức $\\frac{3x}{x+2}$ và $\\frac{ax(x-2)}{(2-x)(x+2)}$ bằng nhau.',
        dapAn: { kieu: 'so', gt: -3 },
        goiY: ['Đổi dấu: $2 - x = -(x-2)$.', 'Rút gọn phân thức thứ hai rồi so sánh với $\\frac{3x}{x+2}$.'],
        loiGiai: ['$\\frac{ax(x-2)}{(2-x)(x+2)} = \\frac{ax(x-2)}{-(x-2)(x+2)} = \\frac{-ax}{x+2}$.', 'Để bằng $\\frac{3x}{x+2}$ thì $-a = 3$.', 'Vậy $a = -3$'],
        loiThuongGap: [{ gt: 3, giaiThich: 'Em quên dấu trừ khi đổi $2 - x = -(x - 2)$.' }] },

      { id: '22.8', muc: 2, de: 'Tìm mẫu thức chung (gọn nhất) của hai phân thức $\\frac{1}{x^2-4}$ và $\\frac{3}{x^2+2x}$.',
        dapAn: { kieu: 'bieuThuc', gt: 'x(x-2)(x+2)' },
        goiY: ['Phân tích: $x^2 - 4 = (x-2)(x+2)$; $x^2 + 2x = x(x+2)$.', 'Lấy mỗi nhân tử $x$, $x-2$, $x+2$ một lần.'],
        loiGiai: ['$x^2 - 4 = (x-2)(x+2)$; $\\;x^2 + 2x = x(x+2)$.', 'MTC $= x(x-2)(x+2)$'],
        loiThuongGap: [{ gt: 'x(x-2)(x+2)^2', giaiThich: 'Em nhân hai mẫu với nhau. Nhân tử $x + 2$ có ở cả hai mẫu nhưng chỉ cần lấy **một lần** (số mũ cao nhất là 1).' }] },

      { id: '22.9', muc: 2, de: 'Quy đồng mẫu thức hai phân thức $\\frac{3}{4x^2y}$ và $\\frac{1}{10xy^3}$. Điền mẫu thức chung và tử mới của từng phân thức.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'MTC', kieu: 'bieuThuc', gt: '20x^2y^3',
            loiThuongGap: [{ gt: '40x^3y^4', giaiThich: 'Không nhân hai mẫu: lấy BCNN$(4, 10) = 20$ và $x^2$, $y^3$ (số mũ cao nhất).' }] },
          { nhan: 'Tử mới của $\\frac{3}{4x^2y}$', kieu: 'bieuThuc', gt: '15y^2',
            loiThuongGap: [{ gt: '3', giaiThich: 'Mẫu đã nhân với nhân tử phụ $5y^2$ thì tử cũng phải nhân: $3\\cdot 5y^2$.' }] },
          { nhan: 'Tử mới của $\\frac{1}{10xy^3}$', kieu: 'bieuThuc', gt: '2x',
            loiThuongGap: [{ gt: '1', giaiThich: 'Tử phải nhân với nhân tử phụ $2x$.' }] }] },
        goiY: ['MTC: BCNN$(4, 10)$ nhân $x^2$ và $y^3$.', 'Nhân tử phụ: $20x^2y^3 : 4x^2y = 5y^2$ và $20x^2y^3 : 10xy^3 = 2x$.'],
        loiGiai: ['MTC $= 20x^2y^3$.', 'Nhân tử phụ lần lượt là $5y^2$ và $2x$.', '$\\frac{3}{4x^2y} = \\frac{15y^2}{20x^2y^3}$; $\\;\\frac{1}{10xy^3} = \\frac{2x}{20x^2y^3}$.'] },

      { id: '22.10', muc: 3, de: 'Cho phân thức $P = \\frac{x^3-9x}{(x+3)^2}$.\n\na) Tìm giá trị của $x$ làm $P$ không xác định.\n\nb) Rút gọn $P$.\n\nc) Tính giá trị của $P$ tại $x = 97$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $x$ làm $P$ không xác định', kieu: 'nghiem', gt: [-3],
            loiThuongGap: [{ gt: [3], giaiThich: '$(x+3)^2 = 0$ khi $x + 3 = 0$, tức $x = -3$.' }] },
          { nhan: 'b) $P$ rút gọn', kieu: 'bieuThuc', gt: 'x(x-3)/(x+3)', dang: 'rutGon' },
          { nhan: 'c) Giá trị tại $x = 97$', kieu: 'so', gt: 91.18 }] },
        goiY: ['$x^3 - 9x = x(x^2 - 9) = x(x-3)(x+3)$.', 'Chia cả tử và mẫu cho $x + 3$; thay $x = 97$ vào phân thức đã rút gọn.'],
        loiGiai: ['a) Mẫu $(x+3)^2 = 0$ khi $x = -3$.', 'b) $P = \\frac{x(x-3)(x+3)}{(x+3)^2} = \\frac{x(x-3)}{x+3}$.', 'c) $97 \\ne -3$ nên $P = \\frac{97\\cdot 94}{100} = 91{,}18$.'] },

      { id: '22.11', muc: 3, de: 'Bạn Mai vẽ lá cờ hình chữ nhật có chiều rộng $16$ cm, chiều dài $25$ cm. Nếu tăng mỗi cạnh thêm $x$ (cm):\n\na) Viết phân thức biểu thị tỉ số giữa chiều rộng và chiều dài hình mới.\n\nb) Tính tỉ số đó khi $x = 2$ (quốc kì Việt Nam có tỉ lệ chuẩn $2 : 3$).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Tỉ số', kieu: 'bieuThuc', gt: '(16+x)/(25+x)',
            loiThuongGap: [{ gt: '(25+x)/(16+x)', giaiThich: 'Tỉ số giữa chiều **rộng** và chiều **dài**: rộng ở trên, dài ở dưới.' }, { gt: '16/25+x', giaiThich: 'Phải cộng $x$ vào cả hai cạnh rồi mới chia: $\\frac{16+x}{25+x}$.' }] },
          { nhan: 'b) Khi $x = 2$', kieu: 'so', gt: '2/3',
            loiThuongGap: [{ gt: '16/25', giaiThich: 'Em quên cộng thêm $x = 2$ vào mỗi cạnh.' }] }] },
        goiY: ['Chiều rộng mới $16 + x$, chiều dài mới $25 + x$.', 'Thay $x = 2$ rồi rút gọn phân số.'],
        loiGiai: ['a) $\\frac{16+x}{25+x}$.', 'b) $\\frac{16+2}{25+2} = \\frac{18}{27} = \\frac{2}{3}$: đúng tỉ lệ chuẩn của quốc kì.'] },

      { id: '22.12', muc: 3, de: 'Tính nhanh giá trị của phân thức $\\frac{x^2-25}{x^2+5x}$ tại $x = 25$ (gợi ý: rút gọn trước).',
        dapAn: { kieu: 'so', gt: 0.8 },
        goiY: ['$x^2 - 25 = (x-5)(x+5)$; $x^2 + 5x = x(x+5)$.', 'Phân thức rút gọn là $\\frac{x-5}{x}$. Thay $x = 25$.'],
        loiGiai: ['$\\frac{x^2-25}{x^2+5x} = \\frac{(x-5)(x+5)}{x(x+5)} = \\frac{x-5}{x}$.', '$x = 25$ thoả mãn điều kiện ($x \\ne 0$, $x \\ne -5$).', 'Giá trị: $\\frac{25-5}{25} = 0{,}8$'],
        loiThuongGap: [{ gt: -0.2, giaiThich: 'Em đã gạch hạng tử $x^2$ được $\\frac{-25}{5x} = -\\frac{5}{x}$ – sai! Phải phân tích thành nhân tử rồi mới chia.' }] }
    ],

    timLoi: [
      { de: 'Bạn Tròn rút gọn phân thức $\\frac{x^2+2x}{3x^3+2x}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{x^2+2x}{3x^3+2x} = \\frac{x^2}{3x^3}$ (gạch $2x$ ở tử và mẫu)', '$= \\frac{1}{3x}$'],
        dongSai: 0, giaiThich: '$2x$ chỉ là một **hạng tử**, không phải nhân tử chung của cả tử và mẫu, nên không được gạch. Thử $x = 1$: phân thức ban đầu $= \\frac{3}{5}$, còn $\\frac{1}{3x} = \\frac{1}{3}$.', sua: '$\\frac{x(x+2)}{x(3x^2+2)} = \\frac{x+2}{3x^2+2}$' },
      { de: 'Bạn Nam rút gọn phân thức $\\frac{3x-6}{2-x}$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$\\frac{3x-6}{2-x} = \\frac{3(x-2)}{2-x}$', '$= \\frac{3(x-2)}{x-2}$', '$= 3$'],
        dongSai: 1, giaiThich: '$2 - x = -(x - 2)$. Bạn Nam đổi dấu mẫu mà quên đổi dấu (thêm dấu trừ).', sua: '$= \\frac{3(x-2)}{-(x-2)} = -3$' }
    ]
  });
})();
