// Bài 20 – Phân tích số liệu thống kê dựa vào biểu đồ (SGK Toán 8 KNTT, Tập 1, tr. 99–105)
(function () {
  'use strict';
  var XANH = '#1971c2', CAM = '#e8590c', VANG = '#f08c00', LA = '#2f9e44';
  var MAU = [XANH, CAM, LA, '#9c36b5', VANG];
  var W = 10, H = 6;               // khung vẽ biểu đồ trong toạ độ JSXGraph
  var BBOX = [-2.2, 7.9, 10.6, -1.3];
  function fmt(v, d) { return TOAN8.fmtSo(v, d == null ? 2 : d); }
  function chu(G, x, y, s, o) {
    return G.label(x, y, s, Object.assign({ fontSize: 14, anchorX: 'middle', anchorY: 'middle', cssClass: '', highlightCssClass: '' }, o || {}));
  }

  // Biểu đồ cột (tĩnh) có gốc trục đứng tuỳ ý – dùng để minh hoạ biểu đồ "gây hiểu nhầm" (bieuDo luôn bắt đầu từ 0).
  // o: { tieuDe, nhan:[…], so:[…], goc, dinh, buoc, donVi?, mau?:[…] }
  function cotGoc(o) {
    return { widget: 'geo', config: { bbox: BBOX, build: function (board, G) {
      var s = H / (o.dinh - o.goc), n = o.nhan.length, bw = W / n;
      chu(G, W / 2, H + 1.15, o.tieuDe, { fontSize: 16, cssStyle: 'font-weight:700' });
      for (var v = o.goc; v <= o.dinh + 1e-9; v += o.buoc) {
        var y = (v - o.goc) * s;
        G.seg([0, y], [W, y], { strokeColor: v === o.goc ? '#343a40' : '#dee2e6', strokeWidth: v === o.goc ? 2 : 1 });
        chu(G, -0.2, y, fmt(v), { anchorX: 'right', fontSize: 13 });
      }
      G.seg([0, 0], [0, H + 0.4], { strokeColor: '#343a40', strokeWidth: 2 });
      if (o.donVi) chu(G, -0.2, H + 0.6, '(' + o.donVi + ')', { anchorX: 'right', fontSize: 13 });
      o.nhan.forEach(function (nh, i) {
        var x1 = bw * (i + 0.2), x2 = bw * (i + 0.8), h = (o.so[i] - o.goc) * s;
        var mau = (o.mau && o.mau[i]) || XANH;
        board.create('polygon', [[x1, 0], [x2, 0], [x2, h], [x1, h]], { fillColor: mau, fillOpacity: 0.9, fixed: true, hasInnerPoints: false,
          borders: { strokeWidth: 0, fixed: true }, vertices: { visible: false } });
        chu(G, (x1 + x2) / 2, h + 0.3, fmt(o.so[i]), { cssStyle: 'font-weight:700' });
        chu(G, (x1 + x2) / 2, -0.45, nh);
      });
    } } };
  }

  // Biểu đồ đoạn thẳng có trục ngang chia đều từng mốc (dù các năm cách nhau không đều) – hoặc đúng tỉ lệ.
  // o: { tieuDe, nam:[…], so:[…], dinh, buoc, donVi?, nut?: có nút chuyển }
  function duongLech(o) {
    return { widget: 'geo', config: { bbox: BBOX, build: function (board, G) {
      var st = { deu: true }, s = H / o.dinh, n = o.nam.length;
      var a = o.nam[0], b = o.nam[n - 1];
      function X(i) { return st.deu ? 0.8 + i * (W - 1.6) / (n - 1) : 0.8 + (o.nam[i] - a) * (W - 1.6) / (b - a); }
      chu(G, W / 2, H + 1.15, o.tieuDe, { fontSize: 16, cssStyle: 'font-weight:700' });
      for (var v = 0; v <= o.dinh + 1e-9; v += o.buoc) {
        G.seg([0, v * s], [W, v * s], { strokeColor: v === 0 ? '#343a40' : '#dee2e6', strokeWidth: v === 0 ? 2 : 1 });
        chu(G, -0.2, v * s, fmt(v), { anchorX: 'right', fontSize: 13 });
      }
      G.seg([0, 0], [0, H + 0.4], { strokeColor: '#343a40', strokeWidth: 2 });
      if (o.donVi) chu(G, -0.2, H + 0.6, '(' + o.donVi + ')', { anchorX: 'right', fontSize: 13 });
      var P = o.nam.map(function (nm, i) {
        var xi = function () { return X(i); };
        chu(G, xi, -0.45, String(nm));
        chu(G, xi, o.so[i] * s + 0.4, fmt(o.so[i]), { cssStyle: 'font-weight:700' });
        return board.create('point', [xi, o.so[i] * s], { name: '', size: 5, color: XANH, fixed: true, showInfobox: false });
      });
      for (var i = 0; i + 1 < n; i++) G.seg(P[i], P[i + 1], { strokeColor: i === n - 2 ? CAM : XANH, strokeWidth: 4 });
      if (o.nut) {
        chu(G, W / 2, 0.55, function () { return st.deu ? 'Trục ngang chia ĐỀU từng mốc (không đúng khoảng cách năm)' : 'Trục ngang chia ĐÚNG khoảng cách giữa các năm'; },
          { fontSize: 14, strokeColor: '#495057', cssClass: 'geo-label', highlightCssClass: 'geo-label' });
        var btn = TOAN8.el('button', { class: 'btn primary', type: 'button', onclick: function () {
          st.deu = !st.deu;
          btn.textContent = st.deu ? 'Chia trục ngang đúng khoảng cách năm' : 'Quay lại trục chia đều từng mốc';
          board.update();
        } }, 'Chia trục ngang đúng khoảng cách năm');
        board.containerObj.parentNode.appendChild(TOAN8.el('div', { class: 'sliders' }, btn));
      }
    } } };
  }

  // ---------- Hình động khám phá: kéo gốc trục đứng của biểu đồ cột ----------
  var khamPhaBuild = function (board, G) {
    var env = { goc: 0 }, DINH = 84, so = [81, 82], mau = [VANG, XANH], nhan = ['2019 – 2020', '2020 – 2021'];
    function s() { return H / (DINH - env.goc); }
    chu(G, W / 2, H + 1.15, 'Tỉ lệ học sinh khá, giỏi (%)', { fontSize: 16, cssStyle: 'font-weight:700' });
    for (var k = 0; k <= 4; k++) (function (k) {
      var y = H * k / 4;
      G.seg([0, y], [W, y], { strokeColor: k ? '#dee2e6' : '#343a40', strokeWidth: k ? 1 : 2 });
      chu(G, -0.2, y, function () { return fmt(env.goc + (DINH - env.goc) * k / 4, 1); }, { anchorX: 'right', fontSize: 13 });
    })(k);
    G.seg([0, 0], [0, H + 0.4], { strokeColor: '#343a40', strokeWidth: 2 });
    so.forEach(function (v, i) {
      var x1 = 1.5 + i * 4.5, x2 = x1 + 2.5, h = function () { return (v - env.goc) * s(); };
      board.create('polygon', [[x1, 0], [x2, 0], [x2, h], [x1, h]], { fillColor: mau[i], fillOpacity: 0.9, fixed: true, hasInnerPoints: false,
        borders: { strokeWidth: 0, fixed: true }, vertices: { visible: false } });
      chu(G, (x1 + x2) / 2, function () { return h() + 0.3; }, String(v), { cssStyle: 'font-weight:700' });
      chu(G, (x1 + x2) / 2, -0.45, nhan[i]);
    });
    G.label(0.3, -1.0, function () {
      var r = (82 - env.goc) / (81 - env.goc);
      return 'Cột xanh cao gấp ' + fmt(r) + ' lần cột vàng  |  Số liệu: 82 : 81 ≈ 1,01';
    }, { fontSize: 15 });
    var sl = TOAN8.makeSliders([{ ten: 'goc', min: 0, max: 80, buoc: 1, gt: 0, nhan: '<b>Gốc trục đứng</b>' }], env, function () { board.update(); });
    board.containerObj.parentNode.appendChild(sl);
  };

  // ---------- Dữ liệu ----------
  var monAnLech = cotGoc({ tieuDe: 'Món ăn Việt Nam được ưa thích (gốc 950)', nhan: ['Phở', 'Nem', 'Bánh mì'], so: [972, 987, 955],
    goc: 950, dinh: 990, buoc: 10, donVi: 'lượt chọn', mau: ['#e03131', XANH, VANG] });
  var monAnDung = { loai: 'cot', tieuDe: 'Món ăn Việt Nam được ưa thích (gốc 0)', nhan: ['Phở', 'Nem', 'Bánh mì'],
    chuoi: [{ ten: 'Số lượt chọn', so: [972, 987, 955] }], donVi: 'lượt chọn' };
  var doanhThuLech = { tieuDe: 'Số thành viên câu lạc bộ', nam: [2015, 2016, 2017, 2018, 2022], so: [20, 22, 24, 26, 34], dinh: 40, buoc: 10, donVi: 'người' };
  var gioBanNgay = { loai: 'duong', tieuDe: 'Số giờ ban ngày theo tháng', tenNhan: 'Tháng', hienBang: true,
    nhan: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    chuoi: [{ ten: 'Canberra', so: [14.2, 13.4, 12.3, 11.2, 10.3, 9.8, 10.1, 10.9, 11.9, 13, 14, 14.5] },
      { ten: 'Moscow', so: [7.8, 9.7, 11.9, 14.3, 16.4, 17.5, 16.8, 14.9, 12.7, 10.4, 8.3, 7.1] }], donVi: 'giờ' };
  var chiTieu = { loai: 'tron', tieuDe: 'Cơ cấu chi tiêu một tháng của gia đình', nhan: ['Ăn uống', 'Học tập', 'Điện nước', 'Khác'], chuoi: [{ so: [40, 20, 15, 25] }] };
  var thiPhan = { loai: 'cotKep', doiLoai: ['cotKep', 'duong'], tieuDe: 'Thị phần xuất khẩu gạo (%)', tenNhan: 'Năm',
    nhan: ['2017', '2018', '2019', '2020'], chuoi: [{ ten: 'Việt Nam', so: [13, 14, 16, 15] }, { ten: 'Thái Lan', so: [25, 22, 18, 13] }], donVi: '%' };

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  // Hình lời giải: trang tự đưa cảnh sang trạng thái 'giai' khi em xem lời giải, nên ở đây không đặt sẵn
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  function soVN(x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); }
  var KHA_GIOI = { nhan: ['2019 – 2020', '2020 – 2021'], so: [81, 82], goc: 80, dinh: 84, don: '%', hoi: [1, 0], tenCot: ['vàng', 'xanh'] };
  var THI_DUA = { nhan: ['2021', '2022'], so: [84, 92], goc: 80, dinh: 96, don: 'điểm', hoi: [1, 0], nguoc: true };
  var PHE_LIEU = { nhan: ['An', 'Bình', 'Tuyết', 'Khánh', 'Hải'], so: [225, 250, 290, 245, 340], goc: 200, dinh: 360, don: 'nghìn đồng', hoi: [2, 3], nguoc: true };
  var CLB = { nam: [2015, 2016, 2017, 2018, 2022], so: [20, 22, 24, 26, 34], dinh: 40, buoc: 10, don: 'người' };
  var DOANH_THU = { cu: 32, moi: 40, nhanCu: '2017', nhanMoi: '2021', don: 'tỉ đồng' };
  function them(a, b) { return Object.assign({}, a, b); }

  TOAN8.bai({
    id: 20, ten: 'Phân tích số liệu thống kê dựa vào biểu đồ', sgk: { tap: 1, trang: 99 },
    nhin: {
      tieuDe: 'Cắt trục đứng: con số không đổi, chiều cao cột thì đổi', loai: 'minhHoa',
      luuY: 'Lập luận chung: khi gốc trục là $g$, cột biểu diễn số $a$ chỉ cao $a - g$ phần. Nên tỉ số chiều cao hai cột là $\\frac{a - g}{b - g}$, chỉ bằng $\\frac{a}{b}$ khi $g = 0$ (hoặc $a = b$).',
      canh: { ten: 'catTruc', tuyChon: KHA_GIOI, moTa: 'Hai cột 81% và 82%. Một đường cắt nâng dần lên 80, bỏ phần dưới, rồi kéo giãn phần còn lại cho đầy khung. Cuối cùng cột xanh cao gấp đôi cột vàng.' },
      buoc: [
        { t: 0, chu: 'Tỉ lệ học sinh khá, giỏi: $81\\%$ và $82\\%$. Trục bắt đầu từ $0$, hai cột cao gần bằng nhau, đúng như số liệu.' },
        { t: 0.1, chu: 'Kẻ một đường cắt ngang, nâng dần lên mức $80$. Phần cột dưới đường cắt sẽ bị bỏ đi.' },
        { t: 0.55, chu: 'Kéo giãn phần còn lại cho đầy khung. Con số trên đầu cột vẫn y nguyên, chỉ có trục giờ bắt đầu từ $80$.' },
        { t: 0.9, chu: 'Cột xanh cao $82 - 80 = 2$ phần, cột vàng cao $81 - 80 = 1$ phần: hai cột vàng chồng lên vừa bằng cột xanh. Nhưng số liệu chỉ gấp $82 : 81 \\approx 1{,}01$ lần.' }
      ],
      ketLuan: 'Gốc trục đứng khác $0$ thì chiều cao cột chỉ ứng với phần **trên gốc**: $$\\frac{\\text{cột A}}{\\text{cột B}} = \\frac{a - \\text{gốc}}{b - \\text{gốc}} \\ne \\frac{a}{b}.$$ Cột cao hơn vẫn là số lớn hơn, nhưng muốn biết gấp mấy lần thì đọc con số.',
      dung: {
        tieuDe: 'Trên biểu đồ, cột 2022 cao gấp mấy lần cột 2021?', tuBai: '20.6',
        canh: { ten: 'catTruc', tuyChon: them(THI_DUA, { anLucDau: true }), moTa: 'Biểu đồ cột có gốc trục đứng là 80: năm 2021 là 84 điểm, năm 2022 là 92 điểm.' },
        moiThu: 'Đo phần cột nằm trên gốc $80$. Nếu gõ sai, hình sẽ dựng một cột nét đứt cao đúng số lần em gõ để em so với cột 2022.',
        phanUng: [
          { gt: 1.1, trangThai: 'goc0', loi: '$1{,}1$ là tỉ lệ **số liệu** $92 : 84$, đúng khi trục bắt đầu từ $0$ như hình bên. Đề hỏi chiều cao cột trên biểu đồ gốc $80$.' },
          { gt: 8, t: 0, loi: '$8$ là $92 - 84$: cột 2022 cao hơn bao nhiêu điểm, chưa phải gấp bao nhiêu lần. Trên gốc $80$, cột 2021 chỉ cao $84 - 80 = 4$ phần.' }
        ],
        soBatKi: function (v) {
          if (v <= 0) return { t: 1, loi: 'Số lần phải lớn hơn $0$.' };
          return { thamSo: { thu: v }, t: 1, loi: 'Cột nét đứt cao gấp $' + soVN(v) + '$ lần cột 2021, ' + (v < 3 ? 'còn thấp hơn' : 'đã cao hơn') + ' cột 2022. Chỉ đo phần cột nằm trên gốc $80$.' };
        },
        dungChu: 'Trên gốc $80$: cột 2021 cao $84 - 80 = 4$, cột 2022 cao $92 - 80 = 12$. Ba cột 2021 chồng lên vừa bằng cột 2022: gấp $3$ lần, dù số liệu chỉ gấp $92 : 84 \\approx 1{,}1$ lần.'
      },
      suyRa: {
        tieuDe: 'Trục đứng cắt, trục ngang lệch, so sai giá trị: đo lại bằng đúng thước',
        baDe: [
          { tuBai: '20.3', canh: { ten: 'catTruc', tuyChon: them(PHE_LIEU, { anLucDau: true }), moTa: 'Biểu đồ tiền bán phế liệu, gốc trục đứng là 200.' }, tenNut: 'Dựng lại từ 0',
            phanUng: [{ gt: true, trangThai: 'goc0', loi: 'Dựng lại từ $0$: cột Tuyết ($290$) chỉ cao hơn cột Khánh ($245$) một chút, không gấp đôi.' }],
            dungChu: '$290 : 245 \\approx 1{,}18$, không phải $2$. Cột Tuyết cao gấp đôi cột Khánh chỉ vì trục bắt đầu từ $200$.',
            saiChu: 'Gốc trục đứng là $200$. Dựng lại các cột từ $0$ rồi so hai cột Tuyết và Khánh.' },
          { tuBai: '20.11', canh: { ten: 'trucNgang', tuyChon: them(CLB, { anLucDau: true }), moTa: 'Biểu đồ đoạn thẳng số thành viên câu lạc bộ, trục ngang chia đều từng mốc.' }, tenNut: 'Chia trục đúng khoảng năm',
            phanUng: [{ gt: 8, loi: '$8$ người là mức tăng của cả đoạn cuối. Chia trục đúng thì đoạn cuối dài bằng $4$ khoảng năm.' }],
            soBatKi: function (v) {
              if (v <= 0) return { t: 1, loi: 'Số thành viên tăng lên, nên mỗi năm tăng một số lớn hơn $0$.' };
              return { t: 1, loi: 'Nếu mỗi năm tăng $' + soVN(v) + '$ người thì $4$ năm tăng $' + soVN(4 * v) + '$ người, mà từ 2018 đến 2022 tăng $34 - 26 = 8$ người.' };
            },
            dungChu: 'Chia đúng thì từ 2018 đến 2022 là $4$ khoảng năm, tăng $8$ người: $8 : 4 = 2$ người mỗi năm. Đường gần như thẳng, không có tăng đột biến.',
            saiChu: 'Từ 2018 đến 2022 là mấy năm? Chia trục đúng khoảng năm rồi chia mức tăng cho số năm.' },
          { tuBai: '20.9', canh: { ten: 'soVoiCu', tuyChon: them(DOANH_THU, { anLucDau: true }), moTa: 'Doanh thu năm 2017 là 32 tỉ, năm 2021 là 40 tỉ đồng.' }, tenNut: 'Đặt phần tăng lên cột cũ',
            phanUng: [{ gt: 20, trangThai: 'chiaMoi', loi: 'Em đã so phần tăng $8$ với cột **mới** $40$ (vừa $5$ lần, $20\\%$). Mức tăng phải so với giá trị **cũ** $32$.' },
              { gt: 8, loi: '$8$ tỉ đồng là phần tăng. Đặt phần tăng chồng lên cột cũ $32$ xem vừa mấy lần.' }],
            dungChu: 'Phần tăng $8$ chồng $4$ lần vừa khít cột cũ $32$, nên phần tăng bằng $\\frac{1}{4}$ giá trị cũ: $\\frac{8}{32} \\cdot 100\\% = 25\\%$.',
            saiChu: 'Đặt phần tăng $8$ chồng lên cột cũ $32$: vừa mấy lần?' }
        ],
        cachNhan: 'Biểu đồ trông thế nào chưa chắc số liệu như thế. Đo lại bằng đúng thước: chiều cao cột đo từ $0$, khoảng cách theo số năm thật, phần tăng so với giá trị cũ.'
      }
    },

    khamPha: {
      nhiemVu: 'Biểu đồ cho biết tỉ lệ học sinh khá, giỏi của một trường: năm 2019 – 2020 là $81\\%$, năm 2020 – 2021 là $82\\%$. Em kéo thanh **Gốc trục đứng** từ $0$ lên dần tới $80$. Số liệu không đổi, nhưng **chiều cao hai cột** thay đổi thế nào? Biểu đồ nào làm người xem tưởng tỉ lệ khá, giỏi "tăng vọt"?',
      widget: 'geo',
      config: { bbox: [-2.2, 7.9, 10.6, -1.5], build: khamPhaBuild,
        // nâng dần gốc trục từ 0 lên 80: cột xanh "gấp đôi" cột vàng dù số liệu gần bằng nhau
        tuChay: [{ cho: 1 }, { thanhTruot: 'goc', den: 60, giay: 2.5 }, { thanhTruot: 'goc', den: 80, giay: 2 }, { cho: 2.5 }, { thanhTruot: 'goc', den: 0, giay: 2 }] },
      cauHoi: {
        de: 'Khi gốc trục đứng là $80$, cột màu xanh cao gấp bao nhiêu lần cột màu vàng?',
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Kéo thanh trượt tới $80$ và đọc dòng chữ dưới biểu đồ.', 'Chiều cao cột chỉ tính phần **trên gốc**: cột xanh $82 - 80$, cột vàng $81 - 80$.'],
        loiGiai: [
          'Gốc là $80$ nên cột xanh cao $82 - 80 = 2$ (đơn vị), cột vàng cao $81 - 80 = 1$ (đơn vị).',
          'Cột xanh cao gấp $2$ lần cột vàng, trong khi số liệu chỉ là $82 : 81 \\approx 1{,}01$ lần.',
          'Vậy khi gốc trục đứng **khác 0**, tỉ lệ chiều cao các cột **không bằng** tỉ lệ số liệu. Em phải đọc **con số**, đừng chỉ nhìn chiều cao cột!'
        ]
      }
    },

    mucTieu: [
      'Nhận ra biểu đồ cột có gốc trục đứng khác $0$, và nói được vì sao khi đó chiều cao cột không cho đúng tỉ số hai số liệu.',
      'Tính tỉ số chiều cao hai cột và so với tỉ số của hai số liệu.',
      'Phát hiện trục ngang chia không đúng khoảng thời gian.',
      'Tính tăng (giảm) bao nhiêu phần trăm, chia cho đúng giá trị cũ.',
      'Rút ra kết luận từ biểu đồ: lớn nhất, nhỏ nhất, tăng hay giảm, chênh lệch bao nhiêu.'
    ],
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Lưu ý khi đọc biểu đồ cột',
        noiDung: 'Trong biểu đồ cột, khi **gốc của trục đứng khác 0** thì tỉ lệ chiều cao của các cột **không bằng** tỉ lệ số liệu mà chúng biểu diễn.\n\nCột cao hơn vẫn biểu diễn số liệu lớn hơn, nhưng **không** được kết luận "gấp bao nhiêu lần" chỉ bằng cách nhìn chiều cao cột.' },
      { loai: 'hinh', widget: 'geo', config: monAnLech.config,
        chuThich: 'Gốc trục đứng là $950$: cột Nem cao $987 - 950 = 37$ vạch, cột Bánh mì chỉ cao $955 - 950 = 5$ vạch: trông gấp hơn $7$ lần, nhưng thật ra $987 : 955 \\approx 1{,}03$ – hai món được chọn **gần như nhau**.' },
      { loai: 'hinh', widget: 'bieuDo', config: monAnDung,
        chuThich: 'Cùng dữ liệu đó, vẽ với gốc trục đứng là $0$: ba cột cao gần bằng nhau – đúng với thực tế.' },

      { loai: 'dinhNghia', tieuDe: '2. Lưu ý khi đọc biểu đồ đoạn thẳng',
        noiDung: 'Trong biểu đồ đoạn thẳng, khi các điểm quan sát trên **trục ngang không đều nhau**, ta **không thể** dựa vào **độ dốc** để kết luận về tốc độ tăng, giảm của đại lượng được biểu diễn.' },
      { loai: 'hinh', widget: 'geo', config: Object.assign(duongLech(Object.assign({ nut: true }, doanhThuLech)).config,
        { tuChay: [{ cho: 0.8 }, { nut: 'Chia trục ngang đúng' }, { cho: 3 }, { nut: 'Quay lại trục chia đều' }, { cho: 2 }] }),
        chuThich: 'Từ 2015 đến 2018, mỗi năm tăng $2$ người. Từ 2018 đến 2022 tăng $34 - 26 = 8$ người nhưng là trong **4 năm**, tức vẫn $2$ người mỗi năm. Trục chia đều từng mốc làm đoạn cuối (màu cam) dốc đứng như "tăng đột biến". Bấm nút để chia trục đúng: đường gần như thẳng!' },

      { loai: 'dinhNghia', tieuDe: '3. Đọc và phân tích số liệu từ biểu đồ',
        noiDung: '• Đọc **đúng** số liệu: xem tiêu đề, đơn vị, gốc trục đứng, cách chia trục ngang.\n\n• So sánh, tính toán: hơn kém (phép trừ), gấp bao nhiêu lần (phép chia), tỉ lệ phần trăm.\n\n• Từ tỉ lệ ra số lượng: **số lượng = tổng × tỉ lệ**.\n\n• Khi phân tích số liệu, ta có thể **kết hợp thông tin** từ hai hay nhiều biểu đồ.\n\n• Để **so sánh sự thay đổi theo thời gian** của hai hay nhiều đại lượng, người ta thường biểu diễn chúng **trên cùng một biểu đồ**.' },
      { loai: 'hinh', widget: 'bieuDo', config: gioBanNgay,
        chuThich: 'Hai đường cắt nhau vào khoảng **tháng 3** và **tháng 9**: khi đó số giờ ban ngày ở hai nơi gần như nhau. Ở Canberra số giờ ban ngày giảm dần, thấp nhất vào tháng 6 rồi tăng lại; ở Moscow thì ngược lại – vì hai thành phố nằm ở **hai bán cầu** khác nhau.' },
      { loai: 'chuY', tieuDe: 'Muốn biết tăng (giảm) bao nhiêu phần trăm',
        noiDung: 'Từ giá trị cũ $a$ lên giá trị mới $b$:\n\n**Mức tăng** $= \\dfrac{b - a}{a} \\cdot 100\\%$\n\n(luôn chia cho **giá trị cũ** $a$). Ví dụ: từ $40$ lên $50$ là tăng $\\frac{10}{40} \\cdot 100\\% = 25\\%$.' }
    ],

    viDu: [
      { de: 'Một biểu đồ cột có gốc trục đứng là $86$ biểu diễn tỉ lệ học sinh đạt yêu cầu: năm 2021 là $88\\%$, năm 2022 là $90\\%$. So sánh tỉ lệ chiều cao hai cột với tỉ lệ hai số liệu.',
        canh: { ten: 'catTruc', tuyChon: { nhan: ['2021', '2022'], so: [88, 90], goc: 86, dinh: 94, don: '%', hoi: [1, 0], anLucDau: true } },
        buoc: [
        { canh: { t: 1 }, lam: 'Cột năm 2021 cao $88 - 86 = 2$; cột năm 2022 cao $90 - 86 = 4$ (đơn vị chia).', vi: 'Gốc là $86$ nên chiều cao cột chỉ ứng với **phần vượt trên 86**.' },
        { canh: { t: 1, trangThai: 'giai' }, lam: 'Cột 2022 cao gấp $4 : 2 = 2$ lần cột 2021.', vi: 'Nhìn biểu đồ, người xem dễ tưởng tỉ lệ đạt yêu cầu tăng gấp đôi.' },
        { canh: { t: 1, trangThai: 'goc0' }, lam: 'Nhưng số liệu: $90 : 88 \\approx 1{,}02$ lần – chỉ tăng rất ít.', vi: 'Gốc trục đứng khác $0$ nên tỉ lệ chiều cao cột **không bằng** tỉ lệ số liệu.' } ] },
      { de: 'Một xã có $12\\,000$ người. Biểu đồ hình quạt tròn cho biết: nhóm $0$ – $14$ tuổi chiếm $24\\%$, nhóm $15$ – $64$ tuổi chiếm $68\\%$, nhóm trên $64$ tuổi chiếm $8\\%$. Tính số người mỗi nhóm.',
        hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: 'Cơ cấu dân số của xã theo nhóm tuổi', nhan: ['0 – 14 tuổi', '15 – 64 tuổi', 'Trên 64 tuổi'], chuoi: [{ so: [24, 68, 8] }] } },
        buoc: [
        { lam: 'Nhóm $0$ – $14$ tuổi: $12\\,000 \\cdot 24\\% = 2\\,880$ (người).', vi: 'Số lượng = tổng × tỉ lệ.' },
        { lam: 'Nhóm $15$ – $64$ tuổi: $12\\,000 \\cdot 68\\% = 8\\,160$ (người).', vi: '$12\\,000 \\cdot \\frac{68}{100} = 120 \\cdot 68$.' },
        { lam: 'Nhóm trên $64$ tuổi: $12\\,000 \\cdot 8\\% = 960$ (người).', vi: 'Kiểm tra: $2\\,880 + 8\\,160 + 960 = 12\\,000$. Đúng!' } ] },
      { de: 'Xem biểu đồ **Số giờ ban ngày theo tháng** ở Canberra và Moscow. Tháng nào số giờ ban ngày ở hai thành phố chênh lệch nhiều nhất, chênh bao nhiêu giờ?',
        hinh: { widget: 'bieuDo', config: gioBanNgay },
        buoc: [
        { lam: 'Hai đường cách xa nhau nhất ở tháng 6: Moscow $17{,}5$ giờ, Canberra $9{,}8$ giờ.', vi: 'Khoảng cách theo chiều đứng giữa hai đường lớn nhất ở tháng 6 (tháng 12 cũng xa nhưng ít hơn: $14{,}5 - 7{,}1 = 7{,}4$).' },
        { lam: 'Chênh lệch: $17{,}5 - 9{,}8 = 7{,}7$ (giờ).', vi: 'Hai đại lượng vẽ trên **cùng một biểu đồ** nên so sánh rất dễ.' } ] },
      { de: 'Biểu đồ đoạn thẳng về số thành viên một câu lạc bộ có trục ngang ghi lần lượt 2015, 2016, 2017, 2018, 2022 cách đều nhau, với số liệu $20$; $22$; $24$; $26$; $34$. Đoạn cuối rất dốc. Có đúng là số thành viên tăng đột biến sau 2018 không?',
        canh: { ten: 'trucNgang', tuyChon: CLB },
        buoc: [
        { canh: { t: 0 }, lam: 'Các năm 2015 → 2018 mỗi mốc cách $1$ năm, nhưng 2018 → 2022 cách $4$ năm.', vi: 'Trục ngang **không đều** nhưng lại vẽ cách đều nhau.' },
        { canh: { t: 1 }, lam: 'Từ 2018 đến 2022 tăng $34 - 26 = 8$ người, trung bình $8 : 4 = 2$ người mỗi năm.', vi: 'Cùng tốc độ với các năm trước ($2$ người/năm).' },
        { canh: { t: 1, trangThai: 'giai' }, lam: 'Vậy **không** có tăng đột biến; độ dốc lớn chỉ do trục ngang chia không đều.', vi: 'Không dựa vào độ dốc khi trục ngang không đều.' } ] },
      { de: 'Doanh thu của một cửa hàng tăng từ $30$ triệu đồng (tháng 1) lên $38$ triệu đồng (tháng 2). Doanh thu tăng bao nhiêu phần trăm (làm tròn đến hai chữ số thập phân)?',
        canh: { ten: 'soVoiCu', tuyChon: { cu: 30, moi: 38, nhanCu: 'Tháng 1', nhanMoi: 'Tháng 2', don: 'triệu đồng' } }, buoc: [
        { canh: { t: 0.45 }, lam: 'Mức tăng: $38 - 30 = 8$ (triệu đồng).', vi: 'Tính phần tăng trước.' },
        { canh: { t: 1 }, lam: 'Tỉ lệ tăng: $\\frac{8}{30} \\cdot 100\\% \\approx 26{,}67\\%$.', vi: 'Chia cho **giá trị cũ** ($30$), không chia cho $38$.' } ] }
    ],

    viDuMo: [
      { de: 'Một huyện có diện tích $800$ km², biểu đồ cho biết đất rừng chiếm $35\\%$. Tính diện tích đất rừng.', buoc: [
        { lam: 'Diện tích đất rừng $= 800 \\cdot 35\\%$', vi: 'Số lượng = tổng × tỉ lệ.' },
        { lam: '$= 280$ (km²)', vi: 'Em hãy tính kết quả:', an: true,
          dapAn: { kieu: 'so', gt: 280 },
          loiThuongGap: [{ gt: 35, giaiThich: '$35$ là tỉ lệ phần trăm. Diện tích là $800 \\cdot \\frac{35}{100}$.' }] } ] },
      { de: 'Biểu đồ cột có gốc trục đứng $200$ biểu diễn số tiền (nghìn đồng): Tuyết $280$, Khánh $240$. Trên biểu đồ cột của Tuyết cao gấp đôi cột của Khánh. Số tiền của Tuyết thật ra gấp bao nhiêu lần của Khánh?',
        hinh: { widget: 'bieuDo', config: { loai: 'cot', gocTruc: 200, tieuDe: 'Tiền bán phế liệu (gốc 200)', nhan: ['Tuyết', 'Khánh'], chuoi: [{ ten: 'Số tiền', so: [280, 240] }], donVi: 'nghìn đồng' } },
        buoc: [
        { lam: 'Chiều cao cột: Tuyết $280 - 200 = 80$, Khánh $240 - 200 = 40$ → gấp đôi.', vi: 'Gốc $200$ làm cột "gấp đôi".' },
        { lam: '$280 : 240 \\approx 1{,}17$', vi: 'Em hãy tính số lần thật (làm tròn đến hàng phần trăm):', an: true,
          dapAn: { kieu: 'so', gt: 1.17, saiSo: 0.01 },
          loiThuongGap: [{ gt: 2, giaiThich: '$2$ lần là tỉ lệ **chiều cao cột** (vì gốc là $200$). Số liệu thật là $280 : 240$.' }] } ] }
    ],

    baiTap: [
      { id: '20.1', hinhGiai: hg({ ten: 'catTruc', tuyChon: KHA_GIOI }), muc: 1, de: 'Trong biểu đồ cột với gốc trục đứng **không** bắt đầu từ $0$, khẳng định nào sau đây **không đúng**?',
        dapAn: { kieu: 'chon', gt: 3, luaChon: ['Cột cao hơn biểu diễn số liệu lớn hơn.', 'Hai cột cao bằng nhau biểu diễn số liệu bằng nhau.', 'Cột thấp hơn biểu diễn số liệu bé hơn.', 'Tỉ lệ chiều cao của hai cột bằng tỉ lệ hai số liệu được biểu diễn.'] },
        goiY: ['Nhớ lại hình động ở tab Khám phá: gốc $80$, số liệu $81$ và $82$.', 'Cột xanh cao gấp đôi cột vàng nhưng $82$ có gấp đôi $81$ không?'],
        loiGiai: ['Thứ tự cao – thấp vẫn đúng (A, B, C đúng).', 'Nhưng tỉ lệ chiều cao **không** bằng tỉ lệ số liệu khi gốc khác $0$. Khẳng định D không đúng.'] },

      { id: '20.2', muc: 1, de: 'Biểu đồ cho biết số khách tham quan một bảo tàng. Năm 2022 có nhiều hơn năm 2021 bao nhiêu nghìn lượt khách?',
        hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: 'Số khách tham quan bảo tàng', nhan: ['2018', '2019', '2020', '2021', '2022', '2023'], chuoi: [{ ten: 'Số khách', so: [42, 45, 12, 8, 30, 48] }], donVi: 'nghìn lượt' } },
        dapAn: { kieu: 'so', gt: 22 },
        goiY: ['Đọc số liệu tại năm 2021 và năm 2022.', 'Nhiều hơn bao nhiêu → phép trừ.'],
        loiGiai: ['Năm 2021: $8$ nghìn; năm 2022: $30$ nghìn lượt khách.', '$30 - 8 = 22$'],
        loiThuongGap: [{ gt: 38, giaiThich: '$30 + 8 = 38$ là tổng hai năm. Đề hỏi **nhiều hơn bao nhiêu**: phép trừ.' }] },

      { id: '20.3', hinhGiai: hg({ ten: 'catTruc', tuyChon: them(PHE_LIEU, { anLucDau: true }) }), muc: 1, de: 'Biểu đồ cho biết số tiền mỗi bạn có được nhờ bán phế liệu. Bạn Tâm nói: "Số tiền của Tuyết gấp đôi số tiền của Khánh, vì cột của Tuyết cao gấp đôi." Bạn Tâm nói đúng hay sai?',
        hinh: cotGoc({ tieuDe: 'Tiền bán phế liệu (gốc 200)', nhan: ['An', 'Bình', 'Tuyết', 'Khánh', 'Hải'], so: [225, 250, 290, 245, 340], goc: 200, dinh: 360, buoc: 20, donVi: 'nghìn đồng' }),
        dapAn: { kieu: 'dungSai', gt: false },
        goiY: ['Gốc trục đứng của biểu đồ là bao nhiêu?', 'Đọc số tiền của Tuyết và Khánh rồi chia.'],
        loiGiai: ['Gốc trục đứng là $200$ nên chiều cao cột không tỉ lệ với số liệu.', 'Tuyết $290$, Khánh $245$ nghìn đồng: $290 : 245 \\approx 1{,}18$, không phải $2$.', 'Bạn Tâm nói **sai**.'] },

      { id: '20.4', muc: 1, de: 'Biểu đồ cho biết cơ cấu chi tiêu một tháng của một gia đình. Khoản **Ăn uống** chiếm bao nhiêu phần trăm?',
        hinh: { widget: 'bieuDo', config: chiTieu },
        dapAn: { kieu: 'so', gt: 40 },
        goiY: ['Tìm màu của "Ăn uống" trong chú giải.', 'Đọc số phần trăm ghi trên hình quạt đó.'],
        loiGiai: ['Theo chú giải, hình quạt màu xanh dương là Ăn uống, ghi $40\\%$.'] },

      { id: '20.5', hinhGiai: hg({ ten: 'bienHinh', tuyChon: { nhan: ['Ăn uống', 'Học tập', 'Điện nước', 'Khác'], so: [40, 20, 15, 25], don: 'triệu đồng', nguoc: true, thuoc: { tong: 15 }, hoi: 1, anLucDau: true } }), muc: 2, de: 'Gia đình ở câu trên chi tiêu tất cả $15$ triệu đồng một tháng. Khoản **Học tập** là bao nhiêu triệu đồng?',
        hinh: { widget: 'bieuDo', config: chiTieu },
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Đọc tỉ lệ của Học tập trên biểu đồ.', 'Số tiền = tổng × tỉ lệ $= 15 \\cdot 20\\%$.'],
        loiGiai: ['Học tập chiếm $20\\%$.', 'Số tiền: $15 \\cdot 20\\% = 15 \\cdot \\frac{20}{100} = 3$'],
        loiThuongGap: [{ gt: 20, giaiThich: '$20$ là tỉ lệ phần trăm. Số tiền là $15 \\cdot 20\\% = 3$ triệu đồng.' }, { gt: 0.75, giaiThich: 'Em lấy $15 : 20$ rồi. Biết tổng và tỉ lệ thì **nhân**: $15 \\cdot \\frac{20}{100} = 3$.' }] },

      { id: '20.6', hinhGiai: hg({ ten: 'catTruc', tuyChon: them(THI_DUA, { anLucDau: true }) }), muc: 2, de: 'Biểu đồ cột có gốc trục đứng là $80$ biểu diễn điểm trung bình thi đua của lớp 8A: năm 2021 là $84$, năm 2022 là $92$. Trên biểu đồ, cột năm 2022 cao gấp bao nhiêu lần cột năm 2021?',
        hinh: cotGoc({ tieuDe: 'Điểm thi đua lớp 8A (gốc 80)', nhan: ['2021', '2022'], so: [84, 92], goc: 80, dinh: 96, buoc: 4, donVi: 'điểm', mau: [VANG, XANH] }),
        dapAn: { kieu: 'so', gt: 3 },
        goiY: ['Chiều cao cột chỉ tính phần **trên gốc** $80$.', 'Cột 2021 cao $84 - 80$, cột 2022 cao $92 - 80$.'],
        loiGiai: ['Cột 2021 cao $84 - 80 = 4$; cột 2022 cao $92 - 80 = 12$.', 'Cột 2022 cao gấp $12 : 4 = 3$ lần (còn số liệu thật chỉ gấp $92 : 84 \\approx 1{,}1$ lần).', '$12 : 4 = 3$'],
        loiThuongGap: [{ gt: 1.1, giaiThich: 'Đó là tỉ lệ **số liệu** ($92 : 84$). Đề hỏi tỉ lệ **chiều cao cột** khi gốc là $80$.' }] },

      { id: '20.7', muc: 2, de: 'Biểu đồ cho biết thị phần xuất khẩu gạo (%) của Việt Nam và Thái Lan. Năm 2020, thị phần của Việt Nam hơn thị phần của Thái Lan bao nhiêu? (Tính hiệu hai thị phần, đơn vị %.)',
        hinh: { widget: 'bieuDo', config: thiPhan },
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Đọc hai cột của năm 2020.', 'Lấy thị phần Việt Nam trừ thị phần Thái Lan.'],
        loiGiai: ['Năm 2020: Việt Nam $15\\%$, Thái Lan $13\\%$.', '$15 - 13 = 2$'],
        loiThuongGap: [{ gt: 28, giaiThich: '$15 + 13 = 28$ là tổng. Đề hỏi lớn hơn bao nhiêu: phép trừ.' }] },

      { id: '20.8', muc: 2, de: 'Cũng biểu đồ thị phần xuất khẩu gạo. Nhận xét nào đúng về thị phần của **Thái Lan** từ năm 2017 đến năm 2020?',
        hinh: { widget: 'bieuDo', config: thiPhan },
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['Tăng liên tục.', 'Giảm liên tục.', 'Lúc tăng lúc giảm.', 'Không thay đổi.'] },
        goiY: ['Đọc các cột màu cam (Thái Lan) theo thứ tự năm.', 'Bấm **Biểu đồ đoạn thẳng** để thấy xu thế rõ hơn.'],
        loiGiai: ['Thái Lan: $25\\% \\to 22\\% \\to 18\\% \\to 13\\%$.', 'Năm sau luôn thấp hơn năm trước → **giảm liên tục**.'] },

      { id: '20.9', hinhGiai: hg({ ten: 'soVoiCu', tuyChon: them(DOANH_THU, { anLucDau: true }) }), muc: 2, de: 'Doanh thu (tỉ đồng) của một nhà máy được cho trong biểu đồ. Từ năm 2017 đến năm 2021 doanh thu tăng bao nhiêu phần trăm?',
        hinh: { widget: 'bieuDo', config: { loai: 'duong', tieuDe: 'Doanh thu của nhà máy', nhan: ['2017', '2018', '2019', '2020', '2021'], chuoi: [{ ten: 'Doanh thu', so: [32, 34, 35, 37, 40] }], donVi: 'tỉ đồng' } },
        dapAn: { kieu: 'so', gt: 25 },
        goiY: ['Đọc doanh thu năm 2017 (giá trị cũ) và năm 2021 (giá trị mới).', 'Mức tăng = (mới − cũ) : cũ $\\cdot\\, 100\\%$.'],
        loiGiai: ['Năm 2017: $32$ tỉ; năm 2021: $40$ tỉ đồng. Tăng $40 - 32 = 8$ tỉ.', 'Tỉ lệ tăng: $\\frac{8}{32} \\cdot 100\\% = 25\\%$'],
        loiThuongGap: [{ gt: 20, giaiThich: 'Em chia cho $40$. Phải chia cho **giá trị cũ** $32$: $\\frac{8}{32} = 25\\%$.' }, { gt: 8, giaiThich: '$8$ tỉ đồng là mức tăng; đề hỏi tăng bao nhiêu **phần trăm**.' }] },

      { id: '20.10', hinhGiai: hg({ ten: 'bienHinh', tuyChon: { nhan: ['Rừng năm 2018', 'Rừng thêm', 'Đất khác'], so: [52, 3, 45], don: 'km²', den: 'bang', giai: 'bang', thuoc: { tong: 4860, don: 'km²' }, hoi: 1, ptTrong: true, anLucDau: true, tongChu: 'Cả băng: đất của tỉnh, 4 860 km²' } }), muc: 3, de: 'Một tỉnh có diện tích đất là $4\\,860$ km². Biểu đồ cho biết tỉ lệ đất rừng của tỉnh năm 2018 là $52\\%$, năm 2022 là $55\\%$. Diện tích đất rừng năm 2022 nhiều hơn năm 2018 bao nhiêu kilômét vuông?',
        dapAn: { kieu: 'so', gt: 145.8 },
        goiY: ['Tính diện tích rừng mỗi năm: tổng × tỉ lệ.', 'Hoặc nhanh hơn: tỉ lệ tăng $55\\% - 52\\% = 3\\%$, rồi lấy $4\\,860 \\cdot 3\\%$.'],
        loiGiai: ['Năm 2018: $4\\,860 \\cdot 52\\% = 2\\,527{,}2$ (km²).', 'Năm 2022: $4\\,860 \\cdot 55\\% = 2\\,673$ (km²).', 'Nhiều hơn: $2\\,673 - 2\\,527{,}2 = 145{,}8$'],
        loiThuongGap: [{ gt: 3, giaiThich: '$3$ là chênh lệch **tỉ lệ** ($3\\%$). Diện tích chênh lệch là $4\\,860 \\cdot 3\\%$.' }] },

      { id: '20.11', hinhGiai: hg({ ten: 'trucNgang', tuyChon: them(CLB, { anLucDau: true }) }), muc: 3, de: 'Biểu đồ đoạn thẳng về số thành viên một câu lạc bộ có trục ngang chia **đều** từng mốc dù các năm cách nhau không đều. Trung bình mỗi năm từ 2018 đến 2022 số thành viên tăng bao nhiêu người?',
        hinh: duongLech(doanhThuLech),
        dapAn: { kieu: 'so', gt: 2 },
        goiY: ['Từ 2018 đến 2022 là mấy năm?', 'Lấy mức tăng $34 - 26$ chia cho số năm.'],
        loiGiai: ['Từ 2018 đến 2022 tăng $34 - 26 = 8$ người trong $4$ năm.', 'Trung bình mỗi năm: $8 : 4 = 2$', 'Bằng đúng tốc độ các năm trước: đoạn cuối dốc chỉ vì trục ngang chia không đều.'],
        loiThuongGap: [{ gt: 8, giaiThich: '$8$ người là mức tăng của **cả 4 năm** (2018 → 2022). Chia cho $4$ để được mỗi năm.' }] },

      { id: '20.12', khongHinh: 'Hai năm có dân số khác nhau, lời giải là hai phép nhân riêng; hình băng không giúp thêm.', muc: 3, de: 'Một tỉnh có $2\\,000\\,000$ người năm 2010 và $2\\,200\\,000$ người năm 2020. Hai biểu đồ hình quạt tròn cho biết nhóm trên $64$ tuổi chiếm $6{,}5\\%$ (năm 2010) và $8\\%$ (năm 2020). Số người trên $64$ tuổi năm 2020 nhiều hơn năm 2010 bao nhiêu người?',
        dapAn: { kieu: 'so', gt: 46000 },
        goiY: ['Kết hợp hai biểu đồ: tính số người trên 64 tuổi của **từng** năm (dân số mỗi năm khác nhau).', '$2\\,000\\,000 \\cdot 6{,}5\\%$ và $2\\,200\\,000 \\cdot 8\\%$.'],
        loiGiai: ['Năm 2010: $2\\,000\\,000 \\cdot 6{,}5\\% = 130\\,000$ (người).', 'Năm 2020: $2\\,200\\,000 \\cdot 8\\% = 176\\,000$ (người).', 'Nhiều hơn: $176\\,000 - 130\\,000 = 46\\,000$'],
        loiThuongGap: [{ gt: 30000, giaiThich: 'Em lấy $2\\,000\\,000 \\cdot 1{,}5\\%$: dân số hai năm **khác nhau**, phải tính riêng từng năm.' }, { gt: 33000, giaiThich: 'Em lấy $2\\,200\\,000 \\cdot 1{,}5\\%$: phải tính riêng từng năm với dân số của năm đó.' }] }
    ],

    timLoi: [
      { de: 'Biểu đồ cột có gốc trục đứng là $50$; cột A biểu diễn $80$, cột B biểu diễn $60$. Bạn Huy nhận xét như sau. Dòng nào sai?',
        loiGiaiSai: ['Trên biểu đồ, cột A cao $80 - 50 = 30$, cột B cao $60 - 50 = 10$ (đơn vị chia).', 'Cột A cao gấp $3$ lần cột B.', 'Vậy số liệu của A gấp $3$ lần số liệu của B.'],
        dongSai: 2,
        giaiThich: 'Gốc trục đứng khác $0$ nên tỉ lệ chiều cao cột **không bằng** tỉ lệ số liệu. Số liệu thật: $80 : 60 \\approx 1{,}33$ lần.',
        sua: 'Số liệu của A chỉ gấp $80 : 60 \\approx 1{,}33$ lần số liệu của B.' },
      { de: 'Một xã có $12\\,000$ người, nhóm $0$ – $14$ tuổi chiếm $24\\%$. Bạn Lan tính số người nhóm này như sau. Dòng nào sai?',
        loiGiaiSai: ['Số người $0$ – $14$ tuổi $= 12\\,000 : 24$', '$= 500$ (người)'],
        dongSai: 0,
        giaiThich: 'Biết tổng và tỉ lệ thì **nhân**: số lượng = tổng × tỉ lệ, và $24\\% = \\frac{24}{100}$.',
        sua: 'Số người $0$ – $14$ tuổi $= 12\\,000 \\cdot 24\\% = 2\\,880$ (người).' },
      { de: 'Số học sinh đăng kí CLB tăng từ $40$ bạn lên $50$ bạn. Bạn Minh tính mức tăng phần trăm như sau. Dòng nào sai?',
        loiGiaiSai: ['Số bạn tăng thêm: $50 - 40 = 10$.', 'Mức tăng: $\\frac{10}{50} \\cdot 100\\% = 20\\%$.'],
        dongSai: 1,
        giaiThich: 'Mức tăng phần trăm phải chia cho **giá trị cũ** ($40$), không chia cho giá trị mới.',
        sua: 'Mức tăng: $\\frac{10}{40} \\cdot 100\\% = 25\\%$.' }
    ]
  });
})();
