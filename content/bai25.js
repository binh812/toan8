// Bài 25 – Phương trình bậc nhất một ẩn (SGK Toán 8 KNTT, Tập 2, tr. 27–32)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', LA = '#2f9e44';

  // ---------- Cái cân đĩa: hộp cam = một hộp nặng x kg, quả xanh = quả cân 1 kg ----------
  // o: { buoc:[{ L:{x,c}, R:{x,c}, pt:'…', ghi?:'…' }], x?: giá trị x ban đầu, keoX?: true (có thanh trượt x) }
  // Có nhiều bước thì hiện thanh "Bước" (x cố định); có keoX thì hiện thanh x (cân nghiêng khi hai bên lệch).
  function canBuild(o) {
    return function (board, G) {
      var T = window.TOAN8, env = G.env;
      if (env.x == null) env.x = o.x != null ? o.x : 1;
      if (env.buoc == null) env.buoc = 0;
      var CX = 6, CY = 3.2, L = 4.2;
      function st() { return o.buoc[Math.round(env.buoc)] || o.buoc[0]; }
      function nang(d) { return d.x * env.x + d.c; }
      function lech() { var s = st(); return nang(s.R) - nang(s.L); }
      function goc() { return Math.max(-0.28, Math.min(0.28, lech() * 0.07)); }
      function dau(k) { var g = goc(); return [CX + k * L * Math.cos(g), CY - k * L * Math.sin(g)]; }
      var thang = function () { return Math.abs(lech()) < 1e-9; };

      // chân cân và đòn cân
      G.poly([G.pt('', CX - 0.9, -1.3, { visible: false }), G.pt('', CX + 0.9, -1.3, { visible: false }), G.pt('', CX, CY, { visible: false })],
        { fillColor: '#868e96', fillOpacity: 0.35, borders: { strokeColor: '#495057', strokeWidth: 2 } });
      var E = [-1, 1].map(function (k) {
        return board.create('point', [function () { return dau(k)[0]; }, function () { return dau(k)[1]; }], { visible: false });
      });
      board.create('segment', E, { strokeColor: '#495057', strokeWidth: 6, fixed: true, highlight: false });
      board.create('point', [CX, CY], { name: '', size: 4, color: '#343a40', fixed: true, showInfobox: false });
      // hai đĩa cân treo dưới hai đầu đòn
      [-1, 1].forEach(function (k, i) {
        var p1 = board.create('point', [function () { return dau(k)[0] - 1.9; }, function () { return dau(k)[1] - 2.2; }], { visible: false });
        var p2 = board.create('point', [function () { return dau(k)[0] + 1.9; }, function () { return dau(k)[1] - 2.2; }], { visible: false });
        board.create('segment', [E[i], p1], { strokeColor: '#adb5bd', strokeWidth: 1, fixed: true, highlight: false });
        board.create('segment', [E[i], p2], { strokeColor: '#adb5bd', strokeWidth: 1, fixed: true, highlight: false });
        board.create('segment', [p1, p2], { strokeColor: '#495057', strokeWidth: 5, fixed: true, highlight: false });
      });

      // các khối trên đĩa (tạo sẵn đủ số lớn nhất, khối thừa đẩy ra ngoài khung hình)
      var maxX = 0, maxC = 0;
      o.buoc.forEach(function (s) { maxX = Math.max(maxX, s.L.x, s.R.x); maxC = Math.max(maxC, s.L.c, s.R.c); });
      function khoi(k, loai, j) {
        var w = loai === 'x' ? 0.62 : 0.46;
        function pos() {
          var s = st()[k < 0 ? 'L' : 'R'], n = loai === 'x' ? s.x : s.c;
          if (j >= n) return null;
          var i = loai === 'x' ? j : s.x + j, e = dau(k);
          return [e[0] - 1.75 + (i % 5) * 0.72, e[1] - 2.15 + Math.floor(i / 5) * 0.72];
        }
        function px(d) { return function () { var p = pos(); return p ? p[0] + d : 100; }; }
        function py(d) { return function () { var p = pos(); return p ? p[1] + d : 100; }; }
        var pts = [[0, 0], [w, 0], [w, w], [0, w]].map(function (c) { return board.create('point', [px(c[0]), py(c[1])], { visible: false }); });
        board.create('polygon', pts, { fillColor: loai === 'x' ? CAM : XANH, fillOpacity: 0.9, hasInnerPoints: false, fixed: true, highlight: false,
          borders: { strokeColor: '#343a40', strokeWidth: 1, highlight: false, fixed: true }, vertices: { visible: false } });
        board.create('text', [px(w / 2), py(w / 2), loai === 'x' ? 'x' : '1'], { anchorX: 'middle', anchorY: 'middle', fontSize: loai === 'x' ? 17 : 12,
          strokeColor: '#ffffff', fixed: true, highlight: false, cssStyle: 'font-weight:700' });
      }
      [-1, 1].forEach(function (k) {
        for (var j = 0; j < maxX; j++) khoi(k, 'x', j);
        for (var m = 0; m < maxC; m++) khoi(k, 'c', m);
      });

      // chữ: phương trình, khối lượng hai bên
      var f = T.fmtSo;
      G.label(CX, 6.6, function () { return st().pt; }, { anchorX: 'middle', fontSize: 22, cssStyle: 'font-weight:700' });
      G.label(CX, 5.8, function () {
        if (!o.keoX) return st().ghi || '';
        var s = st();
        return 'Trái: ' + f(nang(s.L)) + ' kg   |   Phải: ' + f(nang(s.R)) + ' kg' + (thang() ? '   →  Thăng bằng!' : '');
      }, { anchorX: 'middle', fontSize: 16, strokeColor: function () { return o.keoX && thang() ? LA : '#495057'; } });
    };
  }

  // cấu hình geo: thanh trượt do widget geo tạo (giá trị đọc qua G.env)
  function canCfg(o) {
    return { bbox: [-0.6, 7.2, 12.6, -1.6], build: canBuild(o),
      thanhTruot: o.keoX ? [{ ten: 'x', min: 0, max: 6, buoc: 0.5, gt: o.x != null ? o.x : 1 }]
        : [{ ten: 'buoc', nhan: 'Bước', min: 0, max: o.buoc.length - 1, buoc: 1, gt: 0 }] };
  }

  var canKhamPha = canCfg({ keoX: true, x: 1,
    buoc: [{ L: { x: 3, c: 2 }, R: { x: 1, c: 8 }, pt: '3x + 2 = x + 8' }] });

  var canGiai = canCfg({ x: 3, buoc: [
    { L: { x: 3, c: 2 }, R: { x: 1, c: 8 }, pt: '3x + 2 = x + 8', ghi: 'Cân đang thăng bằng' },
    { L: { x: 2, c: 2 }, R: { x: 0, c: 8 }, pt: '2x + 2 = 8', ghi: 'Bỏ đi 1 hộp x ở CẢ HAI đĩa' },
    { L: { x: 2, c: 0 }, R: { x: 0, c: 6 }, pt: '2x = 6', ghi: 'Bỏ đi 2 quả cân 1 kg ở CẢ HAI đĩa' },
    { L: { x: 1, c: 0 }, R: { x: 0, c: 3 }, pt: 'x = 3', ghi: 'Giữ lại một nửa ở CẢ HAI đĩa (chia hai vế cho 2)' }] });

  // Tự chạy: trượt x để cân nghiêng bên này rồi bên kia, dừng ở x = 3 (cân thăng bằng = nghiệm)
  canKhamPha.tuChay = [{ thanhTruot: 'x', den: 0, giay: 1.5 }, { thanhTruot: 'x', den: 6, giay: 3 }, { thanhTruot: 'x', den: 3, giay: 1.5 }, { cho: 2.5 }];
  // Tự chạy: đi lần lượt từng bước giải, cân luôn thăng bằng, rồi quay về đầu
  canGiai.tuChay = [{ thanhTruot: 'buoc', den: 3, giay: 5 }, { cho: 2 }, { thanhTruot: 'buoc', den: 0, giay: 1 }];

  // Cấu hình hình cho "Nhìn là hiểu": v(hệ số x, số) là một vế; hai vế luôn được kiểm cùng nghiệm khi vẽ
  function v(x, so) { return { x: x, so: so }; }
  function b2(tr, ph) { return { trai: tr, phai: ph }; }
  function can(tr, ph, buoc, them) { return Object.assign({ ten: 'caiCan', tuyChon: { trai: tr, phai: ph, buoc: buoc } }, them); }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  var SAU_QUY_DONG = 'Hình bắt đầu từ lúc đã quy đồng và bỏ dấu ngoặc.';

  TOAN8.bai({
    id: 25, ten: 'Phương trình bậc nhất một ẩn', sgk: { tap: 2, trang: 27 },

    nhin: {
      tieuDe: 'Phương trình là một cái cân đang thăng bằng', loai: 'chungMinh',
      luuY: 'Quả nặng là số dương, bóng bay kéo lên là số âm.',
      canh: can(v(3, 2), v(1, 6), [b2(v(2, 2), v(0, 6)), b2(v(2, 0), v(0, 4)), b2(v(1, 0), v(0, 2))], { giay: 16, moTa: 'Cái cân với hai vế của phương trình, luôn thăng bằng sau mỗi bước.' }),
      buoc: [
        { t: 0, chu: 'Hai đĩa nặng bằng nhau: $3x + 2 = x + 6$. Mỗi khối cam là một $x$ chưa biết.' },
        { t: 0.25, chu: 'Nhấc một $x$ khỏi **cả hai** đĩa: cân vẫn thăng bằng.' },
        { t: 0.5, chu: 'Nhấc hai quả $1$ khỏi **cả hai** đĩa: vẫn thăng bằng.' },
        { t: 0.75, chu: 'Chia đôi **cả hai** đĩa: một $x$ nặng bằng hai quả $1$.' }
      ],
      ketLuan: 'Làm gì ở vế này thì làm y như vậy ở vế kia, cân luôn thăng bằng, nghiệm không đổi: $x = 2$.',
      dung: {
        tieuDe: 'Thay số vào, xem cân có thăng bằng không', tuBai: '25.3',
        canh: can(v(4, -12), v(0, 0), [], { moTa: 'Cái cân của phương trình 4x trừ 12 bằng 0.' }),
        moiThu: 'Gõ một số: cân sẽ thay số đó vào $x$ và nghiêng theo kết quả.',
        soBatKi: function (x) {
          var so = function (n) { return String(Math.round(n * 100) / 100).replace('.', '{,}'); };
          return { thamSo: { thu: x }, loi: 'Thay $x = ' + so(x) + '$: vế trái bằng $' + so(4 * x - 12) + '$, vế phải bằng $0$. Hai vế khác nhau nên cân lệch.' };
        },
        khiDung: { thu: 3 }, dungChu: 'Thay $x = 3$: $4 \\cdot 3 - 12 = 0$, cân thăng bằng.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là cái cân đó',
        baDe: [
          { tuBai: '25.4', canh: can(v(-2, 7), v(0, 0), [b2(v(-2, 0), v(0, -7)), b2(v(2, 0), v(0, 7))]), tenNut: 'Chuyển dần sang hai đĩa',
            dungChu: '$7 - 2x = 0$ nên $2x = 7$, tức $x = 3{,}5$.', saiChu: 'Bóng bay $2x$ đang kéo lên. Cân thăng bằng khi $2x$ bằng $7$.' },
          { tuBai: '25.8', canh: can(v(1, 6), v(1, 5), [b2(v(0, 6), v(0, 5))]), tenNut: 'Nhấc x khỏi hai đĩa',
            dungChu: 'Nhấc $x$ khỏi hai đĩa, còn $6$ và $5$: cân lệch với **mọi** $x$, nên phương trình vô nghiệm.', saiChu: 'Rút gọn vế trái được $x + 6$. Nhấc $x$ khỏi hai đĩa rồi xem cân.' },
          { tuBai: '25.10', canh: can(v(5, 10), v(0, 50), [b2(v(5, 0), v(0, 40))], { tuyChon: { trai: v(5, 10), phai: v(0, 50), buoc: [b2(v(5, 0), v(0, 40))], anLucDau: true } }), tenNut: 'Đưa đề lên cân',
            dungChu: 'Hai người cùng thêm $5$ tuổi: $(x + 5) + (4x + 5) = 50$, nên $5x + 10 = 50$ và $x = 8$.', saiChu: 'Sau $5$ năm **cả hai** đều thêm $5$ tuổi, nên đĩa trái có thêm $10$ chứ không phải $5$.' }
        ],
        cachNhan: 'Dù đề là phương trình hay lời văn: hai vế là hai đĩa cân, và cân phải thăng bằng.'
      }
    },
    khamPha: {
      nhiemVu: 'Đĩa trái có **3 hộp** $\\ca{x}$ (mỗi hộp nặng $x$ kg) và **2 quả cân** $\\cb{1}$ kg. Đĩa phải có **1 hộp** $\\ca{x}$ và **8 quả cân** $\\cb{1}$ kg. Em kéo thanh trượt $x$ để thử các khối lượng khác nhau của mỗi hộp. Khi nào cân **thăng bằng**?',
      widget: 'geo',
      config: canKhamPha,
      cauHoi: {
        de: 'Mỗi hộp nặng bao nhiêu kg thì cân thăng bằng (tức là $3x + 2 = x + 8$)?',
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Kéo $x$ từ từ và nhìn dòng "Trái … | Phải …".', 'Cân thăng bằng khi khối lượng hai đĩa **bằng nhau**.'],
        loiGiai: [
          'Với $x = 3$: đĩa trái nặng $3\\cdot 3 + 2 = 11$ kg, đĩa phải nặng $3 + 8 = 11$ kg. Hai bên bằng nhau.',
          'Ta nói $x = 3$ là **nghiệm** của phương trình $3x + 2 = x + 8$.',
          'Vậy $x = 3$'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Phương trình một ẩn',
        noiDung: 'Một **phương trình với ẩn $x$** có dạng $A(x) = B(x)$, trong đó **vế trái** $A(x)$ và **vế phải** $B(x)$ là hai biểu thức của cùng một biến $x$.\n\nVí dụ: $2x + 9 = 3 - x$ là phương trình ẩn $x$; vế trái là $2x + 9$, vế phải là $3 - x$.' },
      { loai: 'dinhNghia', tieuDe: 'Nghiệm của phương trình',
        noiDung: 'Số $x_0$ gọi là **nghiệm** của phương trình $A(x) = B(x)$ nếu giá trị của $A(x)$ và $B(x)$ tại $x_0$ **bằng nhau**.\n\n**Giải** một phương trình là tìm **tất cả** các nghiệm của nó. Tập hợp tất cả các nghiệm gọi là **tập nghiệm**, kí hiệu $S$.\n\nVí dụ: thay $x = -2$ vào $2x + 9 = 3 - x$: vế trái $= 5$, vế phải $= 5$. Vậy $x = -2$ là một nghiệm.' },
      { loai: 'dinhNghia', tieuDe: '2. Phương trình bậc nhất một ẩn',
        noiDung: 'Phương trình dạng $$\\ca{a}x + \\cb{b} = 0,$$ với $a$, $b$ là hai số đã cho và $\\ca{a \\ne 0}$, gọi là **phương trình bậc nhất một ẩn** $x$.\n\n$\\ca{a}$ là **hệ số** của $x$, $\\cb{b}$ là **hạng tử tự do**, $x$ là **ẩn**.\n\nVí dụ: $2x + 1 = 0$, $\\;-x + 1 = 0$, $\\;-2x = 0$ là phương trình bậc nhất; còn $0x + 2 = 0$ **không** phải (vì $a = 0$).' },
      { loai: 'dinhLi', tieuDe: 'Hai quy tắc biến đổi phương trình',
        noiDung: '**Quy tắc chuyển vế:** chuyển một hạng tử từ vế này sang vế kia thì phải **đổi dấu** hạng tử đó.\n\nNếu $A + C = B$ thì $A = B - C$.\n\n**Quy tắc nhân (chia):** nhân (hoặc chia) **cả hai vế** với cùng một số **khác 0**.\n\nNếu $A = B$ và $C \\ne 0$ thì $A\\cdot C = B\\cdot C$.' },
      { loai: 'hinh', widget: 'geo', config: canGiai,
        chuThich: 'Kéo thanh **Bước** để xem cách giải $3x + 2 = x + 8$ bằng cái cân. Mỗi bước ta làm **giống nhau ở cả hai đĩa** nên cân luôn thăng bằng. Bỏ quả cân ở hai bên chính là **chuyển vế**; giữ một nửa ở hai bên chính là **chia hai vế cho 2**.' },
      { loai: 'dinhLi', tieuDe: 'Cách giải phương trình bậc nhất',
        noiDung: '$$\\begin{aligned} ax + b &= 0 \\\\ ax &= -b \\\\ x &= -\\frac{b}{a} \\end{aligned}$$\n\nDòng 2: chuyển $b$ sang vế phải, **đổi dấu**. Dòng 3: chia hai vế cho $a \\ne 0$.\n\nPhương trình bậc nhất $ax + b = 0$ $(a \\ne 0)$ **luôn có một nghiệm duy nhất** $x = -\\dfrac{b}{a}$.' },
      { loai: 'text', tieuDe: '3. Phương trình đưa được về dạng $ax + b = 0$',
        noiDung: 'Nhiều phương trình chưa có dạng $ax + b = 0$ nhưng biến đổi được về dạng đó. Thứ tự làm:\n\n**1.** Nếu có mẫu: **quy đồng** rồi **nhân hai vế với mẫu chung** để khử mẫu.\n\n**2.** **Bỏ dấu ngoặc** (nhớ đổi dấu khi trước ngoặc là dấu trừ).\n\n**3.** **Chuyển vế:** hạng tử chứa $x$ sang trái, hạng tử không chứa $x$ sang phải.\n\n**4.** **Thu gọn** rồi **chia** hai vế cho hệ số của $x$.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Chuyển vế mà **quên đổi dấu**: $2x - 6 = 0$ thì $2x = 6$ (không phải $2x = -6$).\n\n$3x = 12$ thì $x = 12 : 3 = 4$, **không** phải $x = 12 - 3$.\n\nChia hai vế phải chia **mọi hạng tử**: $\\frac{2x + 5}{2} = x + \\frac{5}{2}$, không phải $x + 5$.\n\nNếu thu gọn được $0x = 3$ thì phương trình **vô nghiệm**; được $0x = 0$ thì **mọi** số đều là nghiệm (vô số nghiệm).\n\n**Không** chia hai vế cho một biểu thức chứa $x$ (như chia cho $x$): biểu thức đó có thể bằng $0$.' }
    ],

    viDu: [
      { de: 'Cho phương trình $3x - 4 = 6 - 2x$. Kiểm tra xem $x = 2$ và $x = -1$ có là nghiệm không.', canh: can(v(3, -4), v(-2, 6), []), buoc: [
        { canh: { t: 0, thamSo: { thu: 2 } }, lam: 'Thay $x = 2$: vế trái $3\\cdot 2 - 4 = 2$; vế phải $6 - 2\\cdot 2 = 2$.', vi: 'Thay số vào **từng vế** rồi tính riêng.' },
        { canh: { t: 0, thamSo: { thu: 2 } }, lam: 'Hai vế bằng nhau nên $x = 2$ **là** nghiệm.', vi: 'Đúng định nghĩa nghiệm: hai vế nhận cùng một giá trị.' },
        { canh: { t: 0, thamSo: { thu: -1 } }, lam: 'Thay $x = -1$: vế trái $3\\cdot(-1) - 4 = -7$; vế phải $6 - 2\\cdot(-1) = 8$.', vi: 'Số âm nhớ đặt trong ngoặc: $-2\\cdot(-1) = +2$.' },
        { canh: { t: 0, thamSo: { thu: -1 } }, lam: '$-7 \\ne 8$ nên $x = -1$ **không** là nghiệm.', vi: 'Chỉ cần hai vế khác nhau là kết luận được.' } ] },
      { de: 'Giải phương trình $4x + 10 = 0$.', canh: can(v(4, 10), v(0, 0), [b2(v(4, 0), v(0, -10)), b2(v(1, 0), v(0, -2.5)), b2(v(1, 0), v(0, -2.5))]), buoc: [
        { lam: '$4x = -10$', vi: 'Chuyển $10$ sang vế phải và **đổi dấu** thành $-10$.' },
        { lam: '$x = \\frac{-10}{4} = -\\frac{5}{2}$', vi: 'Chia hai vế cho hệ số $4$, rồi rút gọn phân số.' },
        { lam: 'Vậy nghiệm là $x = -\\frac{5}{2}$ (tập nghiệm $S = \\{-\\frac{5}{2}\\}$).', vi: 'Thử lại: $4\\cdot(-\\frac{5}{2}) + 10 = -10 + 10 = 0$. Đúng!' } ] },
      { de: 'Giải phương trình $3 - \\frac{1}{2}x = 0$.', canh: can(v(-0.5, 3), v(0, 0), [b2(v(-0.5, 0), v(0, -3)), b2(v(1, 0), v(0, 6))]), buoc: [
        { lam: '$-\\frac{1}{2}x = -3$', vi: 'Chuyển $3$ sang vế phải thành $-3$.' },
        { lam: '$x = (-3) : \\left(-\\frac{1}{2}\\right) = 6$', vi: 'Chia hai vế cho hệ số $-\\frac{1}{2}$. Chia cho $-\\frac{1}{2}$ cũng là nhân với $-2$.' } ] },
      { de: 'Giải phương trình $4x - (3 - 2x) = 2(x + 5)$.', canh: can(v(6, -3), v(2, 10), [b2(v(6, -3), v(2, 10)), b2(v(4, 0), v(0, 13)), b2(v(4, 0), v(0, 13)), b2(v(1, 0), v(0, 13 / 4))], { ghiChu: SAU_QUY_DONG }), buoc: [
        { lam: '$4x - 3 + 2x = 2x + 10$', vi: 'Bỏ ngoặc: trước $(3 - 2x)$ là dấu trừ nên đổi dấu cả hai hạng tử; nhân $2$ vào $(x + 5)$.' },
        { lam: '$4x + 2x - 2x = 10 + 3$', vi: 'Hạng tử chứa $x$ sang trái, số sang phải. $2x$ sang trái thành $-2x$; $-3$ sang phải thành $+3$.' },
        { lam: '$4x = 13$', vi: 'Thu gọn hai vế.' },
        { lam: '$x = \\frac{13}{4}$', vi: 'Chia hai vế cho $4$.' } ] },
      { de: 'Giải phương trình $\\frac{2x - 1}{3} + x = 2 + \\frac{x + 1}{2}$.', canh: can(v(10, -2), v(3, 15), [b2(v(10, -2), v(3, 15)), b2(v(10, -2), v(3, 15)), b2(v(7, 0), v(0, 17)), b2(v(1, 0), v(0, 17 / 7)), b2(v(1, 0), v(0, 17 / 7))], { ghiChu: SAU_QUY_DONG }), buoc: [
        { lam: '$\\frac{2(2x - 1) + 6x}{6} = \\frac{12 + 3(x + 1)}{6}$', vi: 'Quy đồng hai vế với mẫu chung $6$ (BCNN của $3$ và $2$).' },
        { lam: '$2(2x - 1) + 6x = 12 + 3(x + 1)$', vi: 'Nhân hai vế với $6$ để khử mẫu.' },
        { lam: '$4x - 2 + 6x = 12 + 3x + 3$', vi: 'Bỏ dấu ngoặc.' },
        { lam: '$4x + 6x - 3x = 12 + 3 + 2$, tức là $7x = 17$', vi: 'Chuyển vế rồi thu gọn.' },
        { lam: '$x = \\frac{17}{7}$', vi: 'Chia hai vế cho $7$.' } ] }
    ],

    viDuMo: [
      { de: 'Giải phương trình $5x - 7 = 0$.', buoc: [
        { lam: '$5x = 7$', vi: 'Chuyển $-7$ sang vế phải thành $+7$.' },
        { lam: '$x = \\frac{7}{5}$', vi: 'Em hãy tìm nghiệm $x$:', an: true,
          dapAn: { kieu: 'nghiem', gt: [1.4] },
          loiThuongGap: [
            { gt: [-1.4], giaiThich: 'Chuyển $-7$ sang vế phải phải **đổi dấu** thành $+7$, nên $5x = 7$ chứ không phải $-7$.' },
            { gt: [35], giaiThich: 'Từ $5x = 7$ phải **chia** hai vế cho $5$: $x = \\frac{7}{5}$, không nhân.' }] } ] },
      { de: 'Giải phương trình $2(x - 3) = x + 4$.', buoc: [
        { lam: '$2x - 6 = x + 4$', vi: 'Nhân $2$ vào từng hạng tử trong ngoặc.' },
        { lam: '$2x - x = 4 + 6$', vi: 'Chuyển $x$ sang trái thành $-x$, chuyển $-6$ sang phải thành $+6$.' },
        { lam: '$x = 10$', vi: 'Em hãy tìm nghiệm:', an: true,
          dapAn: { kieu: 'nghiem', gt: [10] },
          loiThuongGap: [{ gt: [-2], giaiThich: 'Em quên đổi dấu khi chuyển $-6$ sang vế phải: phải là $4 + 6$, không phải $4 - 6$.' }] } ] }
    ],

    baiTap: [
      { id: '25.1', khongHinh: 'Câu hỏi nhận dạng dạng phương trình, không cần cân.', muc: 1, de: 'Phương trình nào dưới đây là **phương trình bậc nhất một ẩn**?',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$0x + 3 = 0$', '$x^2 - 4 = 0$', '$5 - 2x = 0$', '$\\frac{1}{x} + 1 = 0$'] },
        goiY: ['Phương trình bậc nhất có dạng $ax + b = 0$ với $a \\ne 0$.', 'Loại phương trình có $a = 0$, có $x^2$ hoặc có $x$ ở mẫu.'],
        loiGiai: ['$0x + 3 = 0$ có $a = 0$: không phải.', '$x^2 - 4 = 0$ có $x^2$: không phải.', '$\\frac{1}{x} + 1 = 0$ có $x$ ở mẫu: không phải.', '$5 - 2x = 0$ viết được thành $-2x + 5 = 0$ với $a = -2 \\ne 0$. Đáp án: $5 - 2x = 0$.'] },

      { id: '25.2', hinhGiai: hg(can(v(3, 7), v(-1, 3), [], { thamSo: { thu: -1 } })), muc: 1, de: '$x = -1$ có phải là nghiệm của phương trình $3x + 7 = 3 - x$ không?',
        dapAn: { kieu: 'dungSai', gt: true },
        goiY: ['Thay $x = -1$ vào **từng vế** rồi tính.', 'Nếu hai vế bằng nhau thì $x = -1$ là nghiệm.'],
        loiGiai: ['Vế trái: $3\\cdot(-1) + 7 = 4$.', 'Vế phải: $3 - (-1) = 4$.', 'Hai vế bằng nhau nên $x = -1$ **là** nghiệm. Chọn **Đúng**.'] },

      { id: '25.3', hinhGiai: hg(can(v(4, -12), v(0, 0), [b2(v(4, 0), v(0, 12)), b2(v(1, 0), v(0, 3))])), muc: 1, de: 'Giải phương trình $4x - 12 = 0$.',
        dapAn: { kieu: 'nghiem', gt: [3] },
        goiY: ['Chuyển $-12$ sang vế phải (nhớ đổi dấu).', 'Được $4x = 12$, chia hai vế cho $4$.'],
        loiGiai: ['$4x = 12$', '$x = 3$'],
        loiThuongGap: [
          { gt: [-3], giaiThich: 'Chuyển $-12$ sang vế phải thành $+12$, nên $4x = 12$, $x = 3$.' },
          { gt: [8], giaiThich: 'Từ $4x = 12$ phải **chia** cho $4$, không phải trừ đi $4$.' }] },

      { id: '25.4', hinhGiai: hg(can(v(-2, 7), v(0, 0), [b2(v(2, 0), v(0, 7)), b2(v(1, 0), v(0, 3.5))])), muc: 1, de: 'Giải phương trình $7 - 2x = 0$.',
        dapAn: { kieu: 'nghiem', gt: [3.5] },
        goiY: ['Chuyển $7$ sang vế phải: $-2x = -7$.', 'Chia hai vế cho $-2$ (âm chia âm được dương).'],
        loiGiai: ['$-2x = -7$', '$x = \\frac{-7}{-2} = \\frac{7}{2}$'],
        loiThuongGap: [{ gt: [-3.5], giaiThich: '$(-7) : (-2) = \\frac{7}{2}$ (âm chia âm ra **dương**). Em nhớ hệ số của $x$ là $-2$ chứ không phải $2$.' }] },

      { id: '25.5', hinhGiai: hg(can(v(0.75, 0.5), v(0, 0), [b2(v(0.75, 0), v(0, -0.5)), b2(v(1, 0), v(0, -2 / 3))])), muc: 2, de: 'Giải phương trình $\\frac{1}{2} + \\frac{3}{4}x = 0$.',
        dapAn: { kieu: 'nghiem', gt: [-2 / 3] },
        goiY: ['Chuyển $\\frac{1}{2}$ sang vế phải: $\\frac{3}{4}x = -\\frac{1}{2}$.', 'Chia cho $\\frac{3}{4}$ tức là nhân với $\\frac{4}{3}$.'],
        loiGiai: ['$\\frac{3}{4}x = -\\frac{1}{2}$', '$x = -\\frac{1}{2}\\cdot\\frac{4}{3} = -\\frac{2}{3}$'],
        loiThuongGap: [
          { gt: [-3 / 8], giaiThich: 'Em đã **nhân** với $\\frac{3}{4}$. Muốn tìm $x$ phải **chia** cho $\\frac{3}{4}$, tức là nhân với $\\frac{4}{3}$.' },
          { gt: [2 / 3], giaiThich: 'Chuyển $\\frac{1}{2}$ sang vế phải phải đổi dấu thành $-\\frac{1}{2}$, nên nghiệm âm.' }] },

      { id: '25.6', hinhGiai: hg(can(v(4, -5), v(3, -3), [b2(v(1, 0), v(0, 2))], { ghiChu: SAU_QUY_DONG })), muc: 2, de: 'Giải phương trình $6x - (2x + 5) = 3(x - 1)$.',
        dapAn: { kieu: 'nghiem', gt: [2] },
        goiY: ['Bỏ ngoặc: trước $(2x + 5)$ là dấu trừ nên **đổi dấu cả hai** hạng tử.', '$6x - 2x - 5 = 3x - 3$. Chuyển $x$ sang trái, số sang phải.'],
        loiGiai: ['$6x - 2x - 5 = 3x - 3$', '$6x - 2x - 3x = -3 + 5$', '$x = 2$'],
        loiThuongGap: [{ gt: [-8], giaiThich: 'Bỏ ngoặc $-(2x + 5)$ phải được $-2x - 5$ (đổi dấu **cả** số $5$), em đã viết $-2x + 5$.' }] },

      { id: '25.7', hinhGiai: hg(can(v(8, -4), v(-3, 21), [b2(v(11, 0), v(0, 25)), b2(v(1, 0), v(0, 25 / 11))], { ghiChu: SAU_QUY_DONG })), muc: 2, de: 'Giải phương trình $x + \\frac{x - 2}{3} = 4 - \\frac{x + 1}{2}$.',
        dapAn: { kieu: 'nghiem', gt: [25 / 11] },
        goiY: ['Mẫu chung là $6$. Nhân **mọi** hạng tử của hai vế với $6$.', '$6x + 2(x - 2) = 24 - 3(x + 1)$. Bỏ ngoặc rồi chuyển vế.'],
        loiGiai: ['$6x + 2(x - 2) = 24 - 3(x + 1)$', '$6x + 2x - 4 = 24 - 3x - 3$', '$8x + 3x = 21 + 4$, tức là $11x = 25$', '$x = \\frac{25}{11}$'],
        loiThuongGap: [{ gt: [5 / 11], giaiThich: 'Khi khử mẫu, số $4$ (không có mẫu) cũng phải nhân với $6$ thành $24$.' }] },

      { id: '25.8', hinhGiai: hg(can(v(1, 6), v(1, 5), [b2(v(0, 6), v(0, 5))])), muc: 2, de: 'Giải phương trình $2(x + 3) - x = x + 5$. (Nếu vô nghiệm, em gõ **vô nghiệm**; nếu mọi số đều là nghiệm, gõ **vô số nghiệm**.)',
        dapAn: { kieu: 'nghiem', gt: 'voNghiem' },
        goiY: ['Bỏ ngoặc rồi thu gọn vế trái: $2x + 6 - x$ thu gọn thành $x + 6$.', 'Chuyển vế, em được $0x = \\ldots$. Có số nào nhân với $0$ ra số khác $0$ không?'],
        loiGiai: ['$2x + 6 - x = x + 5$', '$x + 6 = x + 5$', '$x - x = 5 - 6$, tức là $0x = -1$', 'Không có số nào nhân với $0$ được $-1$. Vậy phương trình **vô nghiệm**.'],
        loiThuongGap: [{ gt: [-1], giaiThich: '$0x = -1$ không có nghĩa $x = -1$: thay $x = -1$ vào thì $0\\cdot(-1) = 0 \\ne -1$. Phương trình vô nghiệm.' }] },

      { id: '25.9', khongHinh: 'Bài thay số vào công thức, không cần cân.', muc: 2, de: 'Độ C và độ F liên hệ bởi công thức $C = \\frac{5}{9}(F - 32)$. Hỏi $25\\,^{\\circ}\\mathrm{C}$ ứng với bao nhiêu độ F?',
        dapAn: { kieu: 'so', gt: 77 },
        goiY: ['Thay $C = 25$: được phương trình ẩn $F$.', '$25 = \\frac{5}{9}(F - 32)$. Nhân hai vế với $\\frac{9}{5}$.'],
        loiGiai: ['$25 = \\frac{5}{9}(F - 32)$', '$F - 32 = 25\\cdot\\frac{9}{5} = 45$', '$F = 45 + 32 = 77$'],
        loiThuongGap: [
          { gt: 45, giaiThich: '$45$ mới là $F - 32$. Còn phải cộng thêm $32$.' },
          { gt: 13, giaiThich: 'Từ $F - 32 = 45$, chuyển $-32$ sang vế phải thành $+32$: $F = 45 + 32$.' }] },

      { id: '25.10', hinhGiai: hg(can(v(5, 10), v(0, 50), [b2(v(5, 0), v(0, 40)), b2(v(1, 0), v(0, 8))])), muc: 3, de: 'Hiện nay tuổi mẹ gấp $4$ lần tuổi Minh. Sau $5$ năm nữa, tổng số tuổi của hai mẹ con là $50$. Hỏi hiện nay Minh bao nhiêu tuổi?',
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Gọi $x$ là tuổi Minh hiện nay thì tuổi mẹ là $4x$.', 'Sau $5$ năm, **cả hai** người đều thêm $5$ tuổi: $(x + 5) + (4x + 5) = 50$.'],
        loiGiai: ['Gọi $x$ (tuổi) là tuổi Minh hiện nay, $x > 0$. Tuổi mẹ là $4x$.', 'Sau $5$ năm: $(x + 5) + (4x + 5) = 50$', '$5x + 10 = 50$, nên $5x = 40$', 'Tuổi Minh hiện nay: $x = 8$'],
        loiThuongGap: [{ gt: 9, giaiThich: 'Sau $5$ năm **cả Minh lẫn mẹ** đều thêm $5$ tuổi, tổng tăng $10$ chứ không phải $5$.' }] },

      { id: '25.11', hinhGiai: hg(can(v(4, 45), v(2, 63), [b2(v(2, 0), v(0, 18)), b2(v(1, 0), v(0, 9))])), muc: 3, de: 'Lan mua $4$ quyển vở và $1$ quyển truyện; riêng quyển truyện giá $45$ nghìn đồng. Hương mua $2$ quyển vở cùng loại và $1$ quyển sách; riêng quyển sách giá $63$ nghìn đồng. Tổng số tiền hai bạn trả bằng nhau. Mỗi quyển vở giá bao nhiêu nghìn đồng?',
        dapAn: { kieu: 'so', gt: 9 },
        goiY: ['Gọi $x$ (nghìn đồng) là giá một quyển vở. Lan trả $4x + 45$, Hương trả $2x + 63$.', 'Lập phương trình $4x + 45 = 2x + 63$ rồi giải.'],
        loiGiai: ['Gọi $x$ (nghìn đồng) là giá một quyển vở, $x > 0$.', '$4x + 45 = 2x + 63$', '$4x - 2x = 63 - 45$, tức là $2x = 18$', 'Giá một quyển vở: $x = 9$'],
        loiThuongGap: [{ gt: 18, giaiThich: '$18$ nghìn đồng là giá của **hai** quyển vở ($2x = 18$). Em còn phải chia cho $2$.' }] },

      { id: '25.12', khongHinh: 'Bài về lãi suất, tính bằng phần trăm trực tiếp.', muc: 3, de: 'Bác Ba gửi tiết kiệm $200$ triệu đồng kì hạn $1$ năm. Cuối kì bác nhận cả vốn lẫn lãi $213$ triệu đồng. Lãi suất là bao nhiêu **phần trăm** một năm?',
        dapAn: { kieu: 'so', gt: 6.5 },
        goiY: ['Gọi $x$ là lãi suất (số thập phân). Tiền lãi là $200x$.', 'Vốn + lãi: $200 + 200x = 213$. Giải ra $x$ rồi đổi sang phần trăm.'],
        loiGiai: ['$200 + 200x = 213$', '$200x = 13$, nên $x = 0{,}065$', 'Đổi sang phần trăm: lãi suất $= 6{,}5$ (%)'],
        loiThuongGap: [{ gt: 13, giaiThich: '$13$ triệu là **tiền lãi**. Lãi suất là $13 : 200 = 0{,}065 = 6{,}5\\%$.' }] }
    ],

    timLoi: [
      { de: 'Bạn Tròn giải phương trình $2x + 5 = 17$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$2x + 5 = 17$', '$x + 5 = \\frac{17}{2}$', '$x = 8{,}5 - 5 = 3{,}5$'],
        dongSai: 1, giaiThich: 'Chia hai vế cho $2$ thì phải chia **mọi hạng tử**: $\\frac{2x + 5}{2} = x + \\frac{5}{2}$, không phải $x + 5$. Cách gọn hơn: chuyển $5$ sang vế phải trước.',
        sua: '$2x = 17 - 5 = 12$, nên $x = 6$' },
      { de: 'Bạn Nam giải phương trình $x(x + 3) = x(x + 5)$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$x(x + 3) = x(x + 5)$', '$x + 3 = x + 5$', '$0x = 2$', 'Vậy phương trình vô nghiệm.'],
        dongSai: 1, giaiThich: 'Nam đã chia hai vế cho $x$, nhưng $x$ có thể bằng $0$! Không được chia hai vế cho biểu thức chứa ẩn. Thử lại: $x = 0$ làm hai vế đều bằng $0$, vậy $x = 0$ là nghiệm.',
        sua: '$x^2 + 3x = x^2 + 5x$, nên $-2x = 0$, $x = 0$' },
      { de: 'Bạn Minh giải phương trình $3x - 4 = x + 6$ như sau. Dòng nào sai?',
        loiGiaiSai: ['$3x - 4 = x + 6$', '$3x - x = 6 - 4$', '$2x = 2$', '$x = 1$'],
        dongSai: 1, giaiThich: 'Chuyển $-4$ sang vế phải phải **đổi dấu** thành $+4$. Thử lại $x = 1$: vế trái $-1$, vế phải $7$ – sai.',
        sua: '$3x - x = 6 + 4$, nên $2x = 10$, $x = 5$' }
    ]
  });
})();
