// Bài 39 – Hình chóp tứ giác đều (SGK Toán 8 KNTT, Tập 2, tr. 117–124, gồm Luyện tập chung và Bài tập cuối chương X)
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5', DEN = '#343a40';

  // ---------- Hình tĩnh hình chóp đều (phép chiếu xiên kiểu SGK, nét khuất vẽ đứt) ----------
  // o: { n:3|4, a, h, ten:[đỉnh, các đỉnh đáy…], goc0?, chan?:tên chân đường cao, giua?:tên trung điểm cạnh đáy k, k?,
  //      toMau?:bool (tô màu cạnh bên/trung đoạn/đường cao), canhBen?:chỉ số cạnh bên tô cam, nhan?, lechTen?, ghiChu? }
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; }
  function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
  function cross(u, v) { return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; }
  function don(p) { var l = Math.sqrt(dot(p, p)); return [p[0] / l, p[1] / l, p[2] / l]; }
  function cong(p, q, t) { return [p[0] + q[0] * t, p[1] + q[1] * t, p[2] + q[2] * t]; }
  function chop(o) {
    var n = o.n, a = o.a, h = o.h, R = a / (2 * Math.sin(Math.PI / n)), kx = 0.35, ky = 0.35;
    var pj = function (p) { return [p[0] + kx * p[1], p[2] + ky * p[1]]; };
    var w = [kx, -1, ky]; // hướng về phía người nhìn
    var g0 = (o.goc0 != null ? o.goc0 : (n === 3 ? -80 : -135)) * Math.PI / 180;
    var B3 = [], S3 = [0, 0, h], ten = o.ten, D = {}, canh = [], ve = [], lech = {};
    for (var i = 0; i < n; i++) { var f = g0 + 2 * Math.PI * i / n; B3.push([R * Math.cos(f), R * Math.sin(f), 0]); }
    D[ten[0]] = pj(S3);
    B3.forEach(function (P, j) { D[ten[j + 1]] = pj(P); });
    var truoc = B3.map(function (P, j) {
      var Q = B3[(j + 1) % n], nn = cross(sub(Q, P), sub(S3, P)), m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, 0];
      if (dot(nn, m) < 0) nn = [-nn[0], -nn[1], -nn[2]];
      return dot(nn, w) > 1e-9;
    });
    B3.forEach(function (P, j) { canh.push([ten[j + 1], ten[(j + 1) % n + 1], { net: truoc[j] ? 0 : 6, day: truoc[j] ? 3 : 2 }]); });
    B3.forEach(function (P, j) {
      var hien = truoc[j] || truoc[(j - 1 + n) % n], c = { net: hien ? 0 : 6, day: hien ? 3 : 2 };
      if (o.toMau && o.canhBen === j) { c.mau = CAM; c.day = 4; }
      canh.push([ten[0], ten[j + 1], c]);
    });
    if (o.chan) {
      D[o.chan] = pj([0, 0, 0]);
      canh.push([ten[0], o.chan, { net: 6, day: o.toMau ? 3 : 2, mau: o.toMau ? TIM : DEN }]);
      if (n === 4 && o.cheo) { canh.push([ten[1], ten[3], { net: 4, day: 1.5, mau: '#868e96' }], [ten[2], ten[4], { net: 4, day: 1.5, mau: '#868e96' }]); }
      lech[o.chan] = [-14, -10];
    }
    if (o.giua) {
      var k = o.k || 0, P = B3[k], Q = B3[(k + 1) % n], M3 = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, 0];
      D[o.giua] = pj(M3);
      canh.push([ten[0], o.giua, { net: truoc[k] ? 0 : 6, day: o.toMau ? 4 : 2.5, mau: o.toMau ? XANH : DEN }]);
      if (o.chan) canh.push([o.chan, o.giua, { net: 4, day: 1.5, mau: '#868e96' }]);
      var s = 0.06 * Math.max(a, h), tE = don(sub(Q, P)), tS = don(sub(S3, M3));
      var p1 = cong(M3, tE, s), p2 = cong(p1, tS, s), p3 = cong(M3, tS, s);
      ve.push([pj(p1), pj(p2), { mau: DEN, day: 1.5 }], [pj(p2), pj(p3), { mau: DEN, day: 1.5 }]);
      var dm = [M3[0], M3[1]], lm = Math.sqrt(dm[0] * dm[0] + dm[1] * dm[1]) || 1;
      lech[o.giua] = [18 * dm[0] / lm, 18 * dm[1] / lm * 0.6 - 8];
    }
    for (var key in o.lechTen || {}) lech[key] = o.lechTen[key];
    return TOAN8.hinhGeo({ diem: D, canh: canh, ve: ve, nhan: o.nhan, lechTen: lech, ghiChu: o.ghiChu });
  }

  // Hình minh hoạ lý thuyết (đặt tên như Hình 10.18 SGK): S.ABCD (B, C ở phía trước), O là tâm đáy, H trung điểm BC; tô cam cạnh bên SC
  var hinhLyThuyet = chop({ n: 4, a: 6, h: 6, ten: ['S', 'B', 'C', 'D', 'A'], chan: 'O', giua: 'H', k: 0, toMau: true, canhBen: 1, cheo: true });

  // ---------- Cảnh "Nhìn là hiểu" (js/canh/hinhChop.js) ----------
  // dn: đổ nước từ cốc hình chóp sang cốc hình hộp cùng đáy, cùng chiều cao; tc: trải phẳng bốn mặt bên thành hình chữ nhật p × d
  function dn(a, h, ten, them) { return { ten: 'doNuoc', thamSo: { a: a, h: h }, tuyChon: Object.assign({ n: 4, ten: ten, tenLang: 'hình hộp' }, them || {}) }; }
  function tc(a, d, ten, them) { return { ten: 'traiChop', thamSo: { a: a, d: d }, tuyChon: Object.assign({ n: 4, ten: ten }, them || {}) }; }
  function hg(c, t, trangThai) {
    var cfg = Object.assign({ chiXem: true, t: t == null ? 1 : t }, c);
    if (trangThai) cfg.thamSo = Object.assign({}, c.thamSo, { trangThai: trangThai });
    return { widget: 'canh', config: cfg };
  }
  var so = function (x) { return String(Math.round(x * 100) / 100).replace('.', '{,}'); };

  TOAN8.bai({
    id: 39, ten: 'Hình chóp tứ giác đều', sgk: { tap: 2, trang: 117 },
    nhin: {
      tieuDe: 'Ba cốc hình chóp mới đầy một cốc hình hộp', loai: 'minhHoa',
      luuY: 'Đây là thí nghiệm. Đổ nước thật chỉ cho thấy gần đúng; SGK **công nhận** công thức $V = \\frac{1}{3} S \\cdot h$, không chứng minh (chứng minh cần kiến thức các lớp trên). Mực nước trong hình được tính theo chính công thức đó. Còn diện tích xung quanh $S_{xq} = p \\cdot d$ thì chứng minh được bằng cách trải phẳng (bài 38, và Ví dụ 1, 2 ở đây).',
      canh: { ten: 'doNuoc', tuyChon: { n: 4, tenLang: 'hình hộp' },
        moTa: 'Bên phải là cốc hình chóp tứ giác đều úp ngược, đầy nước. Bên trái là cốc hình hộp cùng đáy, cùng chiều cao. Đổ nước từ cốc hình chóp sang ba lần thì cốc hình hộp đầy.',
        dongSo: function (p) { return 'Hình hộp: $\\cc{a}^2 \\cdot \\cd{h} = ' + so(p.a * p.a * p.h) + '$. Hình chóp: $\\frac{1}{3} \\cdot ' + so(p.a * p.a * p.h) + (Math.abs(p.a * p.a * p.h / 3 - Math.round(p.a * p.a * p.h / 3 * 100) / 100) < 1e-9 ? ' = ' : ' \\approx ') + so(p.a * p.a * p.h / 3) + '$'; } },
      buoc: [
        { t: 0, chu: 'Hai cái cốc có **cùng đáy** (hình vuông cạnh $\\cc{a}$) và **cùng chiều cao** $\\cd{h}$: một cốc hình chóp tứ giác đều úp ngược, một cốc hình hộp. Cốc hình chóp đang đầy nước.' },
        { t: 0.1, chu: 'Đổ hết cốc hình chóp sang cốc hình hộp. Mực nước chỉ lên được một đoạn.' },
        { t: 0.37, chu: 'Múc đầy cốc hình chóp, đổ tiếp lần hai.' },
        { t: 0.64, chu: 'Đổ lần ba.' },
        { t: 0.86, chu: 'Ba lần thì cốc hình hộp vừa đầy. Vậy thể tích hình chóp bằng **một phần ba** thể tích hình hộp cùng đáy, cùng chiều cao. Chiều cao $\\cd{h}$ đo **thẳng đứng** từ đỉnh tới tâm đáy.' }
      ],
      ketLuan: 'Thể tích hình hộp là $S \\cdot \\cd{h}$, nên $$V_{\\text{chóp}} = \\frac{1}{3} S \\cdot \\cd{h}$$ với $S = \\cc{a}^2$ là diện tích đáy.',
      dung: {
        tieuDe: 'Hộp quà hình chóp: đề cho thừa một số', tuBai: '39.7',
        de: 'Một hộp quà có dạng hình chóp tứ giác đều, cạnh đáy $10$ cm, chiều cao $12$ cm, trung đoạn $13$ cm. Tính thể tích của hộp quà (cm³).',
        dapAn: { kieu: 'so', gt: 400 },
        goiY: ['Thể tích dùng **chiều cao** (đo thẳng đứng), không dùng trung đoạn.', '$S = 10^2 = 100$, rồi $V = \\frac{1}{3} \\cdot 100 \\cdot 12$.'],
        loiGiai: ['Diện tích đáy: $S = 10^2 = 100$ (cm²).', '$V = \\frac{1}{3} \\cdot 100 \\cdot 12 = 400$ (cm³).', 'Trung đoạn $13$ cm không cần cho thể tích; nó dùng để tính diện tích xung quanh.'],
        loiThuongGap: [{ gt: 1200, giaiThich: 'Em quên $\\frac{1}{3}$.' }, { gt: '1300/3', giaiThich: 'Em dùng trung đoạn $13$ thay cho chiều cao $12$.' },
          { gt: 433.33, giaiThich: 'Em dùng trung đoạn $13$ thay cho chiều cao $12$.' }, { gt: 433.3, giaiThich: 'Em dùng trung đoạn $13$ thay cho chiều cao $12$.' }, { gt: 433, giaiThich: 'Em dùng trung đoạn $13$ thay cho chiều cao $12$.' }],
        canh: dn(10, 12, { a: '10', h: '12', d: '13' }, { ketQua: 'V = 1/3 · 100 · 12 = 400', moTa: 'Cốc hình chóp đáy vuông cạnh 10, cao 12, và cốc hình hộp cùng đáy, cùng chiều cao.' }),
        moiThu: 'Đề cho cả chiều cao và trung đoạn. Gõ thể tích; nếu sai, hình sẽ chỉ chỗ nhầm.',
        phanUng: [
          { gt: 1200, trangThai: 'quen13', t: 1, loi: 'Em quên $\\frac{1}{3}$. $100 \\cdot 12 = 1200$ là thể tích **cả cốc hình hộp**; cốc hình chóp phải đổ ba lần mới đầy nó.' },
          { gt: '1300/3', trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$. Trung đoạn (xanh) nằm nghiêng trên mặt bên; chiều cao (tím) là đoạn thẳng đứng $12$ từ đỉnh tới tâm đáy.' },
          { gt: 433.33, trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$: $\\frac{1}{3} \\cdot 100 \\cdot 13 \\approx 433{,}33$. Trung đoạn (xanh) nằm nghiêng trên mặt bên; chiều cao (tím) là đoạn thẳng đứng $12$.' },
          { gt: 433.3, trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$: $\\frac{1}{3} \\cdot 100 \\cdot 13 \\approx 433{,}3$. Trung đoạn (xanh) nằm nghiêng trên mặt bên; chiều cao (tím) là đoạn thẳng đứng $12$.' },
          { gt: 433, trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$: $\\frac{1}{3} \\cdot 100 \\cdot 13 \\approx 433$. Trung đoạn (xanh) nằm nghiêng trên mặt bên; chiều cao (tím) là đoạn thẳng đứng $12$.' },
          { gt: 1300, trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$ thay cho chiều cao, lại quên $\\frac{1}{3}$. Chiều cao là đoạn thẳng đứng (tím) dài $12$.' },
          { gt: 160, t: 0, loi: 'Em lấy chu vi $4 \\cdot 10 = 40$ làm diện tích đáy. Đáy là hình vuông cạnh $10$: $S = 10^2 = 100$.' }
        ],
        // Số làm tròn khác của 1300/3 (dùng trung đoạn thay chiều cao)
        soBatKi: function (v) {
          if (Math.abs(v - 1300 / 3) <= 0.5) return { trangThai: 'trungDoan', t: 0, loi: 'Em dùng trung đoạn $13$: $\\frac{1}{3} \\cdot 100 \\cdot 13 \\approx 433$. Chiều cao (tím) là đoạn thẳng đứng $12$, không phải trung đoạn nằm nghiêng.' };
          return null; // số khác: dùng saiChu
        },
        dungChu: '$\\frac{1}{3} \\cdot 10^2 \\cdot 12 = 400$ (cm³), đúng một phần ba cốc hình hộp $1200$ cm³.',
        saiChu: 'Diện tích đáy $10^2 = 100$, chiều cao (thẳng đứng) $12$. Thể tích hình chóp là một phần ba của $100 \\cdot 12$.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là một phần ba cái hộp',
        baDe: [
          { tuBai: '39.8', canh: dn(5, 9, { a: '?', h: '9' }, { ketQua: 'V = 1/3 · 25 · 9 = 75', moTa: 'Cốc hình chóp đáy vuông chu vi 20, cao 9, và cốc hình hộp cùng đáy, cùng chiều cao.' }), tenNut: 'Đổ nước',
            phanUng: [{ gt: 225, trangThai: 'quen13', t: 1, loi: '$25 \\cdot 9 = 225$ là cả cốc hình hộp. Cốc hình chóp chỉ bằng một phần ba.' }],
            dungChu: 'Cạnh đáy $20 : 4 = 5$, $S = 25$; $V = \\frac{1}{3} \\cdot 25 \\cdot 9 = 75$ (cm³).', saiChu: 'Tìm cạnh đáy từ chu vi: $20 : 4 = 5$. Rồi lấy một phần ba của $5^2 \\cdot 9$.' },
          { tuBai: '39.11', canh: dn(12, 12, { a: '12', h: '12' }, { tenLang: 'lập phương', ketQua: 'Cắt đi 2 phần 3: 1728 − 576 = 1152', moTa: 'Cốc hình chóp đáy vuông cạnh 12, cao 12, và cốc lập phương cạnh 12.' }), tenNut: 'Đổ nước',
            phanUng: [{ gt: 576, t: 1, loi: '$576$ là hình chóp **còn lại** (một cốc). Khối lập phương chứa ba cốc như thế; phần bị cắt là hai cốc.' },
              { gt: 1728, t: 1, loi: '$1728$ là cả khối lập phương. Bỏ đi phần hình chóp giữ lại.' }],
            dungChu: 'Hình chóp là một phần ba khối lập phương: $576$ cm³. Phần bị cắt: $1728 - 576 = 1152$ (cm³).', saiChu: 'Đổ nước: ba cốc hình chóp mới đầy khối lập phương. Phần bị cắt là hai phần ba.' },
          { tuBai: '39.12', canh: Object.assign(dn(6, 9, { a: '6', h: '9' }, { anH: true, ketQua: 'Chóp 108, cả khối 216 + 108 = 324', moTa: 'Phần hình chóp của khối gỗ: đáy vuông cạnh 6, cao 9, cạnh cốc hình hộp cùng đáy, cùng chiều cao.' }), { ghiChu: 'Chỉ vẽ phần hình chóp, cao 15 − 6. Hình hộp bên cạnh là cốc để so, không phải cái đế.' }), tenNut: 'Đổ nước',
            phanUng: [{ gt: 540, trangThai: 'quen13', t: 1, loi: 'Em tính phần chóp bằng cả hình hộp $36 \\cdot 9$. Phần chóp chỉ bằng một phần ba: $108$.' },
              { gt: 396, t: 0, loi: 'Chiều cao hình chóp không phải $15$ cm: phải trừ phần lập phương, còn $15 - 6 = 9$ cm.' }],
            dungChu: 'Chóp cao $9$: $\\frac{1}{3} \\cdot 36 \\cdot 9 = 108$; cả khối $216 + 108 = 324$ (cm³).', saiChu: 'Phần chóp cao $15 - 6 = 9$ cm, thể tích bằng một phần ba hình hộp $6 \\times 6 \\times 9$. Cộng thêm khối lập phương.' }
        ],
        cachNhan: 'Gặp thể tích hình chóp: nghĩ tới cái hộp (lăng trụ) cùng đáy, cùng chiều cao, rồi lấy một phần ba. Chiều cao luôn đo thẳng đứng, không phải trung đoạn.'
      }
    },
    khamPha: {
      nhiemVu: 'Kim tự tháp Kheops (Ai Cập) và mái kính bảo tàng Louvre có dạng **hình chóp tứ giác đều**.\n\n1. **Kéo chuột** để xoay hình; kéo thanh **Trải phẳng** để mở bốn mặt bên ra.\n2. Đoạn **xanh** $SH$ là **trung đoạn** ($H$ là trung điểm một cạnh đáy), đoạn **đứt hồng** $SO$ là **đường cao** ($O$ là tâm của hình vuông đáy). Tên điểm đặt như Hình 10.18 trong SGK.\n3. Thay đổi **cạnh đáy** và **chiều cao**, xem trung đoạn $d$ thay đổi ra sao.',
      widget: 'hinhChop',
      config: { day: 4, a: 6, h: 4, hienTrungDoan: true, hienDuongCao: true, tenChan: 'O', tenGiua: 'H' },
      cauHoi: {
        de: 'Đặt **cạnh đáy = 8** và **chiều cao = 3**. Khi đó trung đoạn $d$ bằng bao nhiêu?',
        dapAn: { kieu: 'so', gt: 5 },
        goiY: ['Kéo hai thanh trượt rồi đọc giá trị trung đoạn $d$ ở dòng dưới hình.', 'Muốn tự tính: tam giác $SOH$ vuông tại $O$, với $SO = 3$ và $OH$ bằng nửa cạnh đáy.'],
        loiGiai: ['$O$ là tâm hình vuông nên $OH$ bằng **nửa cạnh đáy**: $OH = 4$.', 'Tam giác $SOH$ vuông tại $O$: $d^2 = SO^2 + OH^2 = 3^2 + 4^2 = 25$.', '$d = 5$']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình chóp tứ giác đều',
        noiDung: 'Hình chóp $S.ABCD$ có **mặt đáy $ABCD$ là hình vuông**, các **mặt bên là những tam giác cân bằng nhau**, có chung đỉnh $S$. Ta gọi $S.ABCD$ là **hình chóp tứ giác đều**.\n\n- Đỉnh: $S$.\n- Cạnh bên: $SA$, $SB$, $\\ca{SC}$, $SD$.\n- Mặt bên: $SAB$, $SBC$, $SCD$, $SDA$. Mặt đáy: $ABCD$.\n- **Đường cao** $\\cd{SO}$: nối đỉnh $S$ với **giao điểm $O$ của hai đường chéo** đáy.\n- **Trung đoạn** $\\cb{SH}$: đường cao của một mặt bên, kẻ từ $S$ ($H$ là trung điểm cạnh đáy).' },
      { loai: 'hinh', widget: 'geo', config: hinhLyThuyet.config,
        chuThich: 'Cạnh bên $\\ca{SC}$ (cam), trung đoạn $\\cb{SH}$ (xanh, vuông góc với $BC$ tại trung điểm $H$), đường cao $\\cd{SO}$ (tím). Các nét đứt là nét bị khuất.' },
      { loai: 'chuY', tieuDe: 'Nhận xét',
        noiDung: 'Hình chóp tứ giác đều có:\n\n- Mặt đáy là **hình vuông**; các mặt bên là các tam giác cân bằng nhau có chung đỉnh;\n- Chân đường cao là điểm cách đều bốn đỉnh của đáy (giao điểm hai đường chéo);\n- $5$ mặt ($1$ đáy + $4$ mặt bên), $5$ đỉnh, $8$ cạnh ($4$ cạnh đáy + $4$ cạnh bên).' },
      { loai: 'chuY', tieuDe: 'Đường cao, trung đoạn, cạnh bên: phân biệt bằng Pythagore',
        noiDung: '- **đường cao** $\\cd{SO}$ → tới **tâm** đáy;\n- **trung đoạn** $\\cb{SH}$ → tới **trung điểm** cạnh đáy;\n- **cạnh bên** $\\ca{SC}$ → tới **đỉnh** của đáy.\n\nVì $O$ là tâm hình vuông cạnh $a$ nên $OH = \\frac{a}{2}$, $HC = \\frac{a}{2}$. Hai tam giác vuông ($SOH$ vuông tại $O$, $SHC$ vuông tại $H$) cho ta:\n\n$$\\cb{d}^2 = \\cd{h}^2 + \\left(\\frac{a}{2}\\right)^2, \\qquad \\ca{SC}^2 = \\cb{d}^2 + \\left(\\frac{a}{2}\\right)^2.$$\n\nVậy luôn có: đường cao < trung đoạn < cạnh bên. Đừng nhớ theo chữ cái (Hình 10.19 trong SGK lại gọi đường cao là $SH$, trung đoạn là $SI$), hãy nhìn đoạn thẳng **đi tới đâu**.' },
      { loai: 'hinh', widget: 'hinhChop', config: { day: 4, a: 6, h: 4, hienTrungDoan: true, hienDuongCao: false, tenChan: 'O', tenGiua: 'H' },
        chuThich: 'Kéo **Trải phẳng** lên 1: bốn mặt bên là bốn tam giác cân, mỗi tam giác có đáy $a$, chiều cao $d$. Tổng diện tích:\n\n$$4 \\cdot \\frac{a \\cdot d}{2} = 2a \\cdot d = p \\cdot d,$$ với $p = 2a$ là **nửa chu vi** hình vuông đáy.' },
      { loai: 'dinhLi', tieuDe: 'Diện tích xung quanh và thể tích',
        noiDung: '- Diện tích xung quanh bằng tích của **nửa chu vi đáy** với **trung đoạn**:\n$$S_{xq} = p \\cdot \\cb{d}.$$\n- Thể tích bằng $\\frac{1}{3}$ tích của diện tích đáy với chiều cao:\n$$V = \\frac{1}{3} S \\cdot \\cd{h}.$$\n\nVới đáy là hình vuông cạnh $a$: $p = \\frac{4a}{2} = 2a$, $S = a^2$.\n\n**Diện tích toàn phần** = $S_{xq}$ + diện tích đáy = $S_{xq} + a^2$.' },
      { loai: 'chuY', tieuDe: 'Bốn lỗi hay gặp',
        noiDung: '1. **Dùng cả chu vi** $4a$ thay cho nửa chu vi $2a$ → $S_{xq}$ gấp đôi.\n2. **Dùng chiều cao hoặc cạnh bên làm trung đoạn.** Phải tính $d$ bằng Pythagore như ở trên.\n3. **Quên $\\frac{1}{3}$** khi tính thể tích → kết quả gấp 3.\n4. **Diện tích đáy** là $a^2$ (không phải chu vi $4a$).' }
    ],
    viDu: [
      { de: 'Tính diện tích xung quanh và thể tích của hình chóp tứ giác đều có cạnh đáy $8$ cm, chiều cao $3$ cm, trung đoạn $5$ cm.', canh: tc(8, 5, { a: '8', d: '5', h: '3', p: '16' }, { hienH: true, dong: 'Sxq = 16 · 5 = 80' }), buoc: [
        { lam: '$p = \\frac{4 \\cdot 8}{2} = 16$ (cm)', vi: 'Đáy là hình vuông: chu vi $4 \\cdot 8 = 32$, lấy **một nửa**. Trải bốn mặt bên ra, hình chữ nhật dài đúng $p$.', canh: { t: 1 } },
        { lam: '$S_{xq} = p \\cdot d = 16 \\cdot 5 = 80$ (cm²)', vi: 'Diện tích xung quanh dùng **trung đoạn** $5$ cm (chiều cao của hình chữ nhật), không dùng chiều cao $3$ cm.', canh: { t: 1 } },
        { lam: 'Diện tích đáy $S = 8^2 = 64$ (cm²)', vi: 'Đáy là hình vuông cạnh $8$.', canh: { t: 0 } },
        { lam: '$V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\cdot 64 \\cdot 3 = 64$ (cm³)', vi: 'Thể tích dùng **chiều cao** $h = 3$ cm (đoạn tím, thẳng đứng), và nhớ $\\frac{1}{3}$.', canh: { t: 0 } } ] },
      { de: 'Hình chóp tứ giác đều có cạnh đáy $10$ cm, chiều cao $12$ cm. Tính diện tích xung quanh.', canh: tc(10, 13, { a: '10', h: '12', r: '5', d: '13', p: '20' }, { anD: true, dong: 'Sxq = 20 · ? = 260', ketQua: 'Sxq = 20 · 13 = 260' }), buoc: [
        { lam: 'Gọi $O$ là tâm đáy, $H$ là trung điểm một cạnh đáy: $OH = \\frac{10}{2} = 5$ (cm)', vi: 'Đề chưa cho trung đoạn. Từ tâm hình vuông tới trung điểm cạnh bằng **nửa cạnh**.', canh: { t: 0, trangThai: 'soiSOM' } },
        { lam: '$d^2 = SO^2 + OH^2 = 12^2 + 5^2 = 169$, nên $d = 13$ (cm)', vi: 'Tam giác $SOH$ vuông tại $O$ (đường cao vuông góc với đáy), trung đoạn là cạnh huyền. Dùng Pythagore.', canh: { t: 0, trangThai: 'soiSOM' } },
        { lam: '$S_{xq} = p \\cdot d = 20 \\cdot 13 = 260$ (cm²)', vi: '$p = \\frac{4 \\cdot 10}{2} = 20$.', canh: { t: 1, trangThai: 'giai' } } ] },
      { de: 'Một chiếc lều có dạng hình chóp tứ giác đều, cạnh đáy $3$ m, chiều cao $2$ m, chiều cao mỗi mặt bên (kẻ từ đỉnh lều) là $2{,}5$ m.\n\na) Tính thể tích không khí trong lều.\n\nb) Lều được phủ vải bốn phía và cả mặt tiếp đất. Tính diện tích vải (mép nối không đáng kể).', canh: tc(3, 2.5, { a: '3', d: '2,5', h: '2', p: '6' }, { hienH: true, dong: 'Sxq = 6 · 2,5 = 15' }), buoc: [
        { lam: 'a) $V = \\frac{1}{3} \\cdot 3^2 \\cdot 2 = 6$ (m³)', vi: 'Diện tích đáy $3^2 = 9$ m², chiều cao $2$ m (đoạn tím, thẳng đứng).', canh: { t: 0 } },
        { lam: 'b) $S_{xq} = p \\cdot d = 6 \\cdot 2{,}5 = 15$ (m²)', vi: '"Chiều cao mỗi mặt bên kẻ từ đỉnh" chính là **trung đoạn**. $p = \\frac{4 \\cdot 3}{2} = 6$.', canh: { t: 1 } },
        { lam: 'Diện tích vải $= 15 + 9 = 24$ (m²)', vi: 'Phủ cả mặt tiếp đất nên cộng thêm diện tích đáy (diện tích toàn phần).', canh: { t: 0.45 } } ] },
      { de: 'Một khối bê tông gồm phần dưới là hình hộp chữ nhật có đáy là hình vuông cạnh $30$ cm, cao $20$ cm; phần trên là hình chóp tứ giác đều có đáy trùng với mặt trên của hộp, chiều cao $45$ cm. Tính thể tích khối bê tông.', canh: Object.assign(dn(30, 45, { a: '30', h: '45' }), { ghiChu: 'Chỉ vẽ phần hình chóp: nó bằng một phần ba hình hộp cùng đáy 30 × 30, cùng cao 45 cm.' }), buoc: [
        { lam: 'Phần hộp: $30 \\cdot 30 \\cdot 20 = 18000$ (cm³)', vi: 'Thể tích hình hộp chữ nhật = diện tích đáy × chiều cao (không có $\\frac{1}{3}$).', canh: { t: 0 } },
        { lam: 'Phần chóp: $\\frac{1}{3} \\cdot 30^2 \\cdot 45 = 13500$ (cm³)', vi: 'Chóp có cùng đáy $30 \\times 30$, chiều cao $45$; nhớ nhân $\\frac{1}{3}$: ba cốc hình chóp mới đầy một hình hộp cùng đáy, cùng cao.', canh: { t: 1 } },
        { lam: '$V = 18000 + 13500 = 31500$ (cm³)', vi: 'Khối ghép thì cộng thể tích các phần.', canh: { t: 1 } } ] }
    ],
    viDuMo: [
      { de: 'Tính diện tích xung quanh của hình chóp tứ giác đều có cạnh đáy $5$ cm, trung đoạn $8$ cm.', buoc: [
        { lam: '$p = \\frac{4 \\cdot 5}{2} = 10$ (cm)', vi: 'Nửa chu vi hình vuông đáy.' },
        { lam: '$S_{xq} = 10 \\cdot 8 = 80$ (cm²)', vi: 'Em hãy tính $S_{xq}$ (cm²):', an: true,
          dapAn: { kieu: 'so', gt: 80 },
          loiThuongGap: [{ gt: 160, giaiThich: 'Em nhân cả chu vi $20$ với $8$. Công thức dùng **nửa** chu vi $p = 10$.' }] } ] },
      { de: 'Tính thể tích hình chóp tứ giác đều có cạnh đáy $6$ cm, chiều cao $7$ cm.', buoc: [
        { lam: 'Diện tích đáy $S = 6^2 = 36$ (cm²)', vi: 'Đáy là hình vuông.' },
        { lam: '$V = \\frac{1}{3} \\cdot 36 \\cdot 7 = 84$ (cm³)', vi: 'Em hãy tính $V$ (cm³):', an: true,
          dapAn: { kieu: 'so', gt: 84 },
          loiThuongGap: [{ gt: 252, giaiThich: 'Em quên $\\frac{1}{3}$: $36 \\cdot 7 = 252$ là thể tích hình hộp cùng đáy, cùng cao.' }] } ] }
    ],
    baiTap: [
      { id: '39.1', khongHinh: 'Câu nhớ định nghĩa: hình chóp xoay được ở Khám phá và Lý thuyết.', muc: 1, de: 'Mặt đáy của hình chóp tứ giác đều là hình gì?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Hình vuông', 'Hình chữ nhật', 'Hình thoi', 'Hình bình hành'] },
        goiY: ['"Đều" nghĩa là đáy có các cạnh bằng nhau **và** các góc bằng nhau.', 'Tứ giác nào có 4 cạnh bằng nhau và 4 góc vuông?'],
        loiGiai: ['Đáy của hình chóp tứ giác đều là **hình vuông** (hình thoi có cạnh bằng nhau nhưng góc chưa chắc vuông; hình chữ nhật có góc vuông nhưng cạnh chưa chắc bằng nhau).'] },
      { id: '39.2', muc: 1, de: 'Xoay hình chóp tứ giác đều bên dưới rồi đếm: hình có bao nhiêu **mặt**, bao nhiêu **đỉnh**, bao nhiêu **cạnh**?',
        hinh: { widget: 'hinhChop', config: { day: 4, a: 5, h: 4, an: true, thanhTruot: false, trai: false, hienDuongCao: false } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số mặt', kieu: 'so', gt: 5, loiThuongGap: [{ gt: 4, giaiThich: 'Em mới đếm 4 mặt bên, còn **mặt đáy** $ABCD$.' }] },
          { nhan: 'Số đỉnh', kieu: 'so', gt: 5, loiThuongGap: [{ gt: 4, giaiThich: 'Ngoài 4 đỉnh của đáy còn **đỉnh** $S$.' }] },
          { nhan: 'Số cạnh', kieu: 'so', gt: 8, loiThuongGap: [{ gt: 4, giaiThich: 'Có 4 cạnh bên **và** 4 cạnh đáy.' }] }] },
        goiY: ['Mặt: mặt đáy và các mặt bên. Đỉnh: $S$ và các đỉnh của đáy.', 'Cạnh: cạnh bên (đi ra từ $S$) và cạnh đáy.'],
        loiGiai: ['Mặt: $1 + 4 = 5$.', 'Đỉnh: $S, A, B, C, D$: $5$ đỉnh.', 'Cạnh: $4$ cạnh bên + $4$ cạnh đáy = $8$ cạnh.'] },
      { id: '39.3', muc: 1, de: 'Cho hình chóp tứ giác đều $S.EFGH$ như hình ($I$ là giao điểm hai đường chéo của đáy, $K$ là trung điểm của $GH$). **Trung đoạn** của hình chóp là đoạn nào?',
        hinh: chop({ n: 4, a: 6, h: 6, ten: ['S', 'F', 'G', 'H', 'E'], chan: 'I', giua: 'K', k: 1, cheo: true }),
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$SE$', '$SI$', '$SK$', '$IK$'] },
        goiY: ['Trung đoạn nằm trên một **mặt bên**, đi từ $S$ tới **trung điểm** một cạnh đáy.', '$K$ là trung điểm của cạnh đáy $GH$.'],
        loiGiai: ['$SK$ nằm trên mặt bên $SGH$ và vuông góc với $GH$ tại trung điểm $K$: đó là **trung đoạn**.', '($SE$ là cạnh bên, $SI$ là đường cao, $IK$ nằm trong mặt đáy.)'] },
      { id: '39.4', muc: 1, de: 'Cho hình chóp tứ giác đều $S.ABCD$ như hình ($O$ là giao điểm hai đường chéo $AC$ và $BD$). Đoạn $SO$ là gì của hình chóp?',
        hinh: chop({ n: 4, a: 6, h: 6.5, ten: ['S', 'B', 'C', 'D', 'A'], chan: 'O', cheo: true }),
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Đường cao', 'Trung đoạn', 'Cạnh bên', 'Cạnh đáy'] },
        goiY: ['$O$ là tâm của hình vuông đáy.', 'Đoạn nối đỉnh $S$ với tâm của đáy gọi là gì?'],
        loiGiai: ['$SO$ nối đỉnh $S$ với giao điểm hai đường chéo của đáy, nên $SO$ là **đường cao** của hình chóp.'] },
      { id: '39.5', muc: 2, de: 'Hình chóp tứ giác đều có cạnh đáy $12$ cm, trung đoạn $10$ cm. Tính diện tích xung quanh (cm²).',
        hinh: chop({ n: 4, a: 12, h: 8, ten: ['S', 'B', 'C', 'D', 'A'], giua: 'M', k: 1, nhan: [['B', 'C', '12 cm'], ['S', 'M', '10 cm']] }),
        dapAn: { kieu: 'so', gt: 240 },
        goiY: ['$S_{xq} = p \\cdot d$ với $p$ là nửa chu vi đáy.', '$p = \\frac{4 \\cdot 12}{2} = 24$.'],
        loiGiai: ['$p = \\frac{4 \\cdot 12}{2} = 24$ (cm)', '$S_{xq} = p \\cdot d = 24 \\cdot 10 = 240$ (cm²)'],
        loiThuongGap: [
          { gt: 480, giaiThich: 'Em dùng cả chu vi $48$. Phải dùng **nửa** chu vi $p = 24$.' },
          { gt: 60, giaiThich: '$60$ cm² là diện tích **một** mặt bên. Có 4 mặt bên.' }] },
      { id: '39.6', hinhGiai: hg(Object.assign(tc(8, 9, { a: '8', d: '9', p: '16' }, { dong: 'Sxq = 16 · 9 = 144' }), { ghiChu: 'Đây mới là bốn mặt bên. Diện tích toàn phần còn cộng thêm mặt đáy 8 × 8.' })), muc: 2, de: 'Hình chóp tứ giác đều có cạnh đáy $8$ cm, trung đoạn $9$ cm. Tính **diện tích toàn phần** (cm²).',
        dapAn: { kieu: 'so', gt: 208 },
        goiY: ['Diện tích toàn phần = diện tích xung quanh + diện tích đáy.', '$S_{xq} = 16 \\cdot 9$; đáy là hình vuông cạnh $8$.'],
        loiGiai: ['$S_{xq} = p \\cdot d = 16 \\cdot 9 = 144$ (cm²)', 'Diện tích đáy: $8^2 = 64$ (cm²)', '$S_{tp} = 144 + 64 = 208$ (cm²)'],
        loiThuongGap: [
          { gt: 144, giaiThich: '$144$ mới là diện tích **xung quanh**. Toàn phần phải cộng thêm diện tích đáy $64$.' },
          { gt: 352, giaiThich: 'Em dùng cả chu vi $32$ khi tính $S_{xq}$. $p = 16$ nên $S_{xq} = 144$.' }] },
      { id: '39.7', hinhGiai: hg(dn(4, 3, { a: '4', h: '3' })), muc: 2, de: 'Một chiếc bánh ít có dạng hình chóp tứ giác đều, cạnh đáy $4$ cm, chiều cao $3$ cm. Tính thể tích của chiếc bánh (cm³).',
        dapAn: { kieu: 'so', gt: 16 },
        goiY: ['$V = \\frac{1}{3} S \\cdot h$, đáy là hình vuông cạnh $4$.', '$S = 16$, rồi $\\frac{1}{3} \\cdot 16 \\cdot 3$.'],
        loiGiai: ['Diện tích đáy: $S = 4^2 = 16$ (cm²)', '$V = \\frac{1}{3} \\cdot 16 \\cdot 3 = 16$ (cm³)'],
        loiThuongGap: [{ gt: 48, hinh: hg(dn(4, 3, { a: '4', h: '3' }), 1, 'quen13'), giaiThich: 'Em quên $\\frac{1}{3}$. Thể tích hình chóp $= \\frac{1}{3} \\cdot 16 \\cdot 3$.' }] },
      { id: '39.8', hinhGiai: hg(dn(5, 9, { a: '5', h: '9' })), muc: 2, de: 'Tính thể tích của hình chóp tứ giác đều có chiều cao $9$ cm và **chu vi đáy** $20$ cm (cm³).',
        dapAn: { kieu: 'so', gt: 75 },
        goiY: ['Từ chu vi tìm cạnh đáy: đáy là hình vuông nên cạnh $= 20 : 4$.', 'Cạnh $5$ cm, diện tích đáy $25$ cm². Rồi $V = \\frac{1}{3} S \\cdot h$.'],
        loiGiai: ['Cạnh đáy: $20 : 4 = 5$ (cm); diện tích đáy $S = 5^2 = 25$ (cm²)', '$V = \\frac{1}{3} \\cdot 25 \\cdot 9 = 75$ (cm³)'],
        loiThuongGap: [
          { gt: 1200, giaiThich: 'Em lấy chu vi $20$ làm cạnh đáy. Cạnh đáy là $20 : 4 = 5$ cm.' },
          { gt: 225, giaiThich: 'Em quên $\\frac{1}{3}$: $25 \\cdot 9 = 225$, chia 3 được $75$.' }] },
      { id: '39.9', muc: 2, de: 'Hình chóp tứ giác đều $S.ABCD$ có cạnh đáy $16$ cm, chiều cao $SO = 6$ cm. Tính diện tích xung quanh (cm²).',
        hinh: chop({ n: 4, a: 16, h: 6, ten: ['S', 'B', 'C', 'D', 'A'], chan: 'O', giua: 'M', k: 1, nhan: [['B', 'C', '16 cm']] }),
        dapAn: { kieu: 'so', gt: 320 },
        goiY: ['Đề cho **chiều cao**, chưa có trung đoạn $SM$ ($M$ là trung điểm $CD$). $OM$ bằng nửa cạnh đáy.', 'Tam giác $SOM$ vuông tại $O$: $SM^2 = 6^2 + 8^2$.'],
        loiGiai: ['$OM = 16 : 2 = 8$ (cm). Tam giác $SOM$ vuông tại $O$: $SM^2 = 6^2 + 8^2 = 100$, nên $d = SM = 10$ (cm).', '$p = \\frac{4 \\cdot 16}{2} = 32$ (cm).', '$S_{xq} = p \\cdot d = 32 \\cdot 10 = 320$ (cm²)'],
        loiThuongGap: [
          { gt: 192, hinh: hg(tc(16, 10, { a: '16', h: '6', r: '8', d: '?' }, { soi: 'SOM' }), 0), giaiThich: 'Em dùng **chiều cao** $6$ thay cho trung đoạn. Trung đoạn $SM = 10$ (tính bằng Pythagore).' },
          { gt: 640, hinh: hg(tc(16, 10, { a: '16', d: '10', p: '32' }), 1, 'caChuVi'), giaiThich: 'Em dùng cả chu vi $64$. Phải dùng nửa chu vi $p = 32$.' }] },
      { id: '39.10', muc: 3, de: 'Một mái che giếng trời có dạng hình chóp tứ giác đều, bốn mặt bên lợp kính. Cạnh đáy dài $10$ m, mỗi cạnh bên dài $13$ m. Tính diện tích kính cần dùng (m²), coi viền không đáng kể.',
        hinh: chop({ n: 4, a: 10, h: 10.9, ten: ['S', 'B', 'C', 'D', 'A'], giua: 'M', k: 1, nhan: [['B', 'C', '10 m'], ['S', 'D', '13 m']] }),
        dapAn: { kieu: 'so', gt: 240 },
        goiY: ['Cần **trung đoạn** $SM$ ($M$ là trung điểm $CD$). Mặt bên $SCD$ là tam giác cân, $SM \\perp CD$, $MD = 5$.', 'Tam giác $SMD$ vuông tại $M$: $SM^2 = 13^2 - 5^2$. Rồi $S_{xq} = p \\cdot d$ với $p = 20$.'],
        loiGiai: ['$MD = 10 : 2 = 5$ (m). Tam giác $SMD$ vuông tại $M$: $SM^2 = 13^2 - 5^2 = 144$, nên $d = 12$ (m).', '$p = \\frac{4 \\cdot 10}{2} = 20$ (m).', '$S_{xq} = p \\cdot d = 20 \\cdot 12 = 240$ (m²)'],
        loiThuongGap: [
          { gt: 260, hinh: hg(tc(10, 12, { a: '10', l: '13', nua: '5', d: '?' }, { soi: 'SAM' }), 0.45), giaiThich: 'Em lấy **cạnh bên** $13$ làm trung đoạn. Trung đoạn phải tính bằng Pythagore: $d = 12$.' },
          { gt: 340, giaiThich: 'Em đã cộng thêm diện tích đáy $100$. Kính chỉ lợp **bốn mặt bên**.' }] },
      { id: '39.11', hinhGiai: hg(dn(12, 12, { a: '12', h: '12' }, { tenLang: 'lập phương' })), muc: 3, de: 'Từ một khúc gỗ hình lập phương cạnh $12$ cm, người ta cắt bớt để được một hình chóp tứ giác đều có đáy là một mặt của khối lập phương và đỉnh nằm trên mặt đối diện (chiều cao cũng bằng $12$ cm). Tính thể tích phần gỗ bị cắt đi (cm³).',
        dapAn: { kieu: 'so', gt: 1152 },
        goiY: ['Phần bị cắt = thể tích lập phương − thể tích hình chóp.', 'Lập phương: $12^3 = 1728$. Chóp: $\\frac{1}{3} \\cdot 12^2 \\cdot 12$.'],
        loiGiai: ['Thể tích lập phương: $12^3 = 1728$ (cm³)', 'Thể tích hình chóp: $\\frac{1}{3} \\cdot 144 \\cdot 12 = 576$ (cm³)', 'Phần bị cắt: $1728 - 576 = 1152$ (cm³)'],
        loiThuongGap: [
          { gt: 576, giaiThich: '$576$ là thể tích **hình chóp còn lại**. Đề hỏi phần **bị cắt đi**: $1728 - 576$.' },
          { gt: 0, giaiThich: 'Em quên $\\frac{1}{3}$ nên thấy chóp bằng cả khối lập phương. Thể tích chóp chỉ bằng $\\frac{1}{3}$ khối lập phương.' }] },
      { id: '39.12', hinhGiai: hg(Object.assign(dn(6, 9, { a: '6', h: '9' }), { ghiChu: 'Phần hình chóp cao 15 − 6 = 9 cm.' })), muc: 3, de: 'Một khối gỗ gồm đế là hình lập phương cạnh $6$ cm, phía trên là một hình chóp tứ giác đều có đáy là mặt trên của lập phương. Chiều cao của cả khối gỗ là $15$ cm. Tính thể tích khối gỗ (cm³).',
        dapAn: { kieu: 'so', gt: 324 },
        goiY: ['Chiều cao hình chóp = chiều cao cả khối − cạnh lập phương.', 'Chóp cao $15 - 6 = 9$ cm. Cộng thể tích lập phương $6^3$ với thể tích chóp $\\frac{1}{3} \\cdot 6^2 \\cdot 9$.'],
        loiGiai: ['Chiều cao hình chóp: $15 - 6 = 9$ (cm)', 'Lập phương: $6^3 = 216$ (cm³); hình chóp: $\\frac{1}{3} \\cdot 36 \\cdot 9 = 108$ (cm³)', '$V = 216 + 108 = 324$ (cm³)'],
        loiThuongGap: [
          { gt: 396, giaiThich: 'Em lấy cả $15$ cm làm chiều cao hình chóp. Chóp chỉ cao $15 - 6 = 9$ cm.' },
          { gt: 540, giaiThich: 'Em quên $\\frac{1}{3}$ khi tính thể tích phần chóp: phải là $\\frac{1}{3} \\cdot 36 \\cdot 9 = 108$.' }] }
    ],
    timLoi: [
      { de: 'Hình chóp tứ giác đều có cạnh đáy $10$ cm, cạnh bên $13$ cm. Bạn Nam tính diện tích xung quanh như sau. Dòng nào sai?',
        loiGiaiSai: ['$p = \\frac{4 \\cdot 10}{2} = 20$ (cm)', 'Trung đoạn $d = 13$ cm', '$S_{xq} = p \\cdot d = 20 \\cdot 13 = 260$ (cm²)'],
        dongSai: 1,
        giaiThich: '$13$ cm là **cạnh bên** (đi tới đỉnh của đáy), không phải trung đoạn (đi tới trung điểm cạnh đáy). Trung đoạn tính bằng Pythagore trong mặt bên: $d^2 = 13^2 - 5^2 = 144$.',
        sua: 'Trung đoạn $d = 12$ cm, nên $S_{xq} = 20 \\cdot 12 = 240$ (cm²).' },
      { de: 'Hình chóp tứ giác đều có cạnh đáy $6$ cm, chiều cao $4$ cm. Bạn Lan tính thể tích như sau. Dòng nào sai?',
        loiGiaiSai: ['Diện tích đáy $S = 4 \\cdot 6 = 24$ (cm²)', '$V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\cdot 24 \\cdot 4$', '$V = 32$ (cm³)'],
        dongSai: 0,
        giaiThich: 'Lan lấy **chu vi** $4 \\cdot 6$ thay cho **diện tích** hình vuông đáy. Diện tích hình vuông cạnh $6$ là $6^2 = 36$.',
        sua: '$S = 6^2 = 36$ (cm²), $V = \\frac{1}{3} \\cdot 36 \\cdot 4 = 48$ (cm³).' }
    ]
  });
})();
