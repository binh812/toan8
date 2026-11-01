// Bài 38 – Hình chóp tam giác đều (SGK Toán 8 KNTT, Tập 2, tr. 112–116)
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
      lech[o.chan] = [14, -10];
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

  // Hình minh hoạ chung trong lý thuyết (đặt tên như Hình 10.2 SGK): S.ABC, O chân đường cao (trọng tâm đáy), H trung điểm AB
  var hinhLyThuyet = chop({ n: 3, a: 6, h: 6.5, ten: ['S', 'A', 'B', 'C'], chan: 'O', giua: 'H', k: 0, toMau: true, canhBen: 0 });

  TOAN8.bai({
    id: 38, ten: 'Hình chóp tam giác đều', sgk: { tap: 2, trang: 112 },
    khamPha: {
      nhiemVu: 'Trên đỉnh Fansipan có một chóp inox dạng **hình chóp tam giác đều**. Hãy làm quen với hình này:\n\n1. **Kéo chuột** trên hình để xoay, nhìn từ nhiều phía.\n2. Kéo thanh **Trải phẳng** từ 0 lên 1: các mặt bên "mở" ra nằm trên mặt bàn.\n3. Đổi **cạnh đáy**, **chiều cao** và quan sát: đoạn **xanh** $SH$ là **trung đoạn**, đoạn **đứt hồng** $SO$ là **đường cao** (tên điểm đặt như Hình 10.2 trong SGK).',
      widget: 'hinhChop',
      config: { day: 3, a: 5, h: 4, hienTrungDoan: true, hienDuongCao: true, tenChan: 'O', tenGiua: 'H' },
      cauHoi: {
        de: 'Khi trải phẳng hẳn (thanh Trải phẳng = 1), ba mặt bên của hình chóp tam giác đều là những hình gì?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Ba tam giác cân bằng nhau', 'Ba tam giác vuông', 'Ba hình vuông', 'Ba tam giác có kích thước khác nhau'] },
        goiY: ['Kéo thanh Trải phẳng tới cuối rồi so ba mảnh màu cam.', 'Mỗi mảnh có hai cạnh bên bằng nhau (cùng là cạnh bên của hình chóp).'],
        loiGiai: ['Ba mặt bên là **ba tam giác cân bằng nhau**, chung đỉnh $S$. Đáy của mỗi tam giác là một cạnh của tam giác đều ở đáy. Vì vậy diện tích các mặt bên tính rất gọn: $S_{xq} = p \\cdot d$.']
      }
    },
    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: 'Hình chóp tam giác đều',
        noiDung: 'Hình chóp tam giác đều có **mặt đáy là một tam giác đều**, các **mặt bên là các tam giác cân bằng nhau** chung một đỉnh. Đỉnh chung này gọi là **đỉnh** của hình chóp.\n\nVới hình chóp tam giác đều $S.ABC$:\n\n- Đỉnh: $S$.\n- Cạnh bên: $\\ca{SA}$, $SB$, $SC$ (nối đỉnh $S$ với một đỉnh của đáy).\n- Mặt bên: $SAB$, $SBC$, $SCA$. Mặt đáy: $ABC$.\n- Cạnh đáy: $AB$, $BC$, $CA$.' },
      { loai: 'dinhNghia', tieuDe: 'Đường cao và trung đoạn',
        noiDung: '- **Đường cao** $\\cd{SO}$: đoạn nối đỉnh $S$ với **trọng tâm** $O$ của tam giác đáy. Nó "dựng đứng" từ tâm đáy lên đỉnh.\n- **Trung đoạn** $\\cb{SH}$: đường cao vẽ từ đỉnh $S$ của **một mặt bên**. Vì mặt bên là tam giác cân nên $H$ là **trung điểm** của cạnh đáy và $SH \\perp AB$.' },
      { loai: 'hinh', widget: 'geo', config: hinhLyThuyet.config,
        chuThich: 'Cạnh bên $\\ca{SA}$ (cam), trung đoạn $\\cb{SH}$ (xanh, vuông góc với $AB$ tại trung điểm $H$), đường cao $\\cd{SO}$ (tím, nét đứt vì nằm bên trong hình). Nét đứt là nét bị khuất.' },
      { loai: 'chuY', tieuDe: 'Ba đoạn hay bị nhầm',
        noiDung: 'Cả ba đoạn đều xuất phát từ đỉnh $S$, nhưng đi tới **ba chỗ khác nhau**:\n\n- **cạnh bên** $\\ca{SA}$ → tới một **đỉnh** của đáy;\n- **trung đoạn** $\\cb{SH}$ → tới **trung điểm một cạnh đáy** (nằm trên mặt bên);\n- **đường cao** $\\cd{SO}$ → tới **tâm của đáy** (nằm bên trong hình).\n\nLuôn có: đường cao < trung đoạn < cạnh bên.\n\n**Đừng nhớ theo chữ cái!** Mỗi đề đặt tên khác nhau: Hình 10.2 gọi đường cao là $SO$, trung đoạn là $SH$; nhưng ở bài 10.3 (SGK), $H$ lại là chân **đường cao** và trung đoạn là $SI$. Hãy nhìn xem đoạn thẳng **đi tới đâu**.' },
      { loai: 'chuY', tieuDe: 'Nhận xét',
        noiDung: 'Hình chóp tam giác đều có:\n\n- Đáy là tam giác đều; các mặt bên là các tam giác cân bằng nhau có chung đỉnh;\n- Chân đường cao là điểm **cách đều ba đỉnh** của tam giác đáy;\n- $4$ mặt ($1$ đáy + $3$ mặt bên), $4$ đỉnh, $6$ cạnh ($3$ cạnh đáy + $3$ cạnh bên).' },
      { loai: 'hinh', widget: 'hinhChop', config: { day: 3, a: 6, h: 5, hienTrungDoan: true, hienDuongCao: false, tenChan: 'O', tenGiua: 'H' },
        chuThich: 'Kéo **Trải phẳng** lên 1: ba mặt bên là ba tam giác cân, mỗi tam giác có đáy $a$ và chiều cao $d$ (trung đoạn). Tổng diện tích:\n\n$$3 \\cdot \\frac{a \\cdot d}{2} = \\frac{3a}{2} \\cdot d = p \\cdot d,$$ trong đó $\\frac{3a}{2}$ chính là **nửa chu vi** đáy.' },
      { loai: 'dinhLi', tieuDe: 'Diện tích xung quanh',
        noiDung: 'Diện tích xung quanh (tổng diện tích các mặt bên) của hình chóp tam giác đều bằng tích của **nửa chu vi đáy** với **trung đoạn**:\n\n$$S_{xq} = p \\cdot \\cb{d},$$\n\ntrong đó $p$ là **nửa** chu vi đáy, $\\cb{d}$ là trung đoạn.\n\n**Diện tích toàn phần** = diện tích xung quanh + diện tích đáy.' },
      { loai: 'dinhLi', tieuDe: 'Thể tích',
        noiDung: 'Thể tích hình chóp tam giác đều bằng $\\frac{1}{3}$ tích của diện tích đáy với chiều cao:\n\n$$V = \\frac{1}{3} S \\cdot \\cd{h},$$\n\ntrong đó $S$ là diện tích đáy, $\\cd{h}$ là chiều cao (độ dài đường cao).\n\n**Vì sao có $\\frac{1}{3}$?** Lấy cái cốc hình chóp múc đầy nước đổ vào cốc hình lăng trụ đứng cùng đáy, cùng chiều cao: phải đổ **3 lần** mới đầy. Vậy thể tích hình chóp $= \\frac{1}{3}$ thể tích lăng trụ $= \\frac{1}{3} S \\cdot h$.' },
      { loai: 'chuY', tieuDe: 'Tính diện tích đáy (tam giác đều cạnh a)',
        noiDung: 'Kẻ đường cao $CK$ của tam giác đều $ABC$ thì $K$ là trung điểm $AB$, $AK = \\frac{a}{2}$. Theo định lí Pythagore: $CK^2 = a^2 - \\left(\\frac{a}{2}\\right)^2$.\n\nRồi $S_{ABC} = \\frac{1}{2} \\cdot a \\cdot CK$.\n\nVí dụ $a = 6$: $CK^2 = 36 - 9 = 27$, $CK = \\sqrt{27} \\approx 5{,}2$; $S \\approx \\frac{1}{2} \\cdot 6 \\cdot 5{,}2 = 15{,}6$.' },
      { loai: 'chuY', tieuDe: 'Ba lỗi hay gặp',
        noiDung: '1. **Dùng cả chu vi** thay cho nửa chu vi: $S_{xq}$ ra gấp đôi.\n2. **Lấy cạnh bên làm trung đoạn.** Nếu đề cho cạnh bên, phải tính trung đoạn bằng Pythagore trong mặt bên: $d^2 = SA^2 - \\left(\\frac{a}{2}\\right)^2$ ($SA$ là cạnh bên, $a$ là cạnh đáy).\n3. **Quên $\\frac{1}{3}$** khi tính thể tích: kết quả gấp 3 lần.' }
    ],
    viDu: [
      { de: 'Tính diện tích xung quanh của hình chóp tam giác đều có cạnh đáy $8$ cm, trung đoạn $10$ cm.', buoc: [
        { lam: 'Nửa chu vi đáy: $p = \\frac{8 + 8 + 8}{2} = 12$ (cm)', vi: 'Đáy là tam giác đều nên ba cạnh bằng nhau. Nhớ chia đôi: $p$ là **nửa** chu vi.' },
        { lam: 'Trung đoạn $d = 10$ cm', vi: 'Đề cho thẳng trung đoạn, dùng luôn.' },
        { lam: '$S_{xq} = p \\cdot d = 12 \\cdot 10 = 120$ (cm²)', vi: 'Áp dụng công thức $S_{xq} = p \\cdot d$.' } ] },
      { de: 'Hình chóp tam giác đều $S.ABC$ có cạnh đáy $10$ cm, cạnh bên $13$ cm. Tính diện tích xung quanh.', buoc: [
        { lam: 'Gọi $M$ là trung điểm $AB$. Trung đoạn là $SM$, $AM = \\frac{10}{2} = 5$ (cm)', vi: 'Đề cho **cạnh bên**, chưa có trung đoạn. Trong mặt bên cân $SAB$, trung đoạn $SM$ vuông góc $AB$ tại trung điểm $M$.' },
        { lam: '$SM^2 = SA^2 - AM^2 = 13^2 - 5^2 = 144$, nên $SM = 12$ (cm)', vi: 'Tam giác $SAM$ vuông tại $M$, dùng định lí Pythagore.' },
        { lam: '$p = \\frac{3 \\cdot 10}{2} = 15$ (cm); $S_{xq} = 15 \\cdot 12 = 180$ (cm²)', vi: 'Có trung đoạn rồi thì áp dụng $S_{xq} = p \\cdot d$.' } ] },
      { de: 'Tính thể tích hình chóp tam giác đều có cạnh đáy $4$ cm, chiều cao $9$ cm. Cho biết $\\sqrt{12} \\approx 3{,}46$.', buoc: [
        { lam: 'Đường cao của tam giác đáy: $k^2 = 4^2 - 2^2 = 12$, $k = \\sqrt{12} \\approx 3{,}46$ (cm)', vi: 'Muốn có diện tích đáy cần đường cao của tam giác đều cạnh $4$. Chân đường cao là trung điểm cạnh nên nửa cạnh là $2$, dùng Pythagore.' },
        { lam: 'Diện tích đáy: $S \\approx \\frac{1}{2} \\cdot 4 \\cdot 3{,}46 = 6{,}92$ (cm²)', vi: 'Diện tích tam giác = $\\frac{1}{2}$ · cạnh đáy · đường cao.' },
        { lam: '$V = \\frac{1}{3} S \\cdot h \\approx \\frac{1}{3} \\cdot 6{,}92 \\cdot 9 = 20{,}76$ (cm³)', vi: 'Nhân diện tích đáy với chiều cao rồi **chia 3**.' } ] },
      { de: 'Một hình chóp tam giác đều có diện tích đáy $15{,}6$ cm², chiều cao $10$ cm. Tính thể tích.', buoc: [
        { lam: '$V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\cdot 15{,}6 \\cdot 10$', vi: 'Đã có sẵn diện tích đáy, chỉ việc thay vào công thức.' },
        { lam: '$V = 52$ (cm³)', vi: '$15{,}6 \\cdot 10 = 156$, chia 3 được $52$.' } ] }
    ],
    viDuMo: [
      { de: 'Tính diện tích xung quanh của hình chóp tam giác đều có cạnh đáy $6$ cm và trung đoạn $7$ cm.', buoc: [
        { lam: '$p = \\frac{6 \\cdot 3}{2} = 9$ (cm)', vi: 'Nửa chu vi đáy.' },
        { lam: '$S_{xq} = p \\cdot d = 9 \\cdot 7 = 63$ (cm²)', vi: 'Em hãy tính $S_{xq}$ (cm²):', an: true,
          dapAn: { kieu: 'so', gt: 63 },
          loiThuongGap: [{ gt: 126, giaiThich: 'Em đã nhân **cả chu vi** $18$ với $7$. Công thức dùng **nửa** chu vi $p = 9$.' }] } ] },
      { de: 'Hình chóp tam giác đều có diện tích đáy $20$ cm², chiều cao $6$ cm. Tính thể tích.', buoc: [
        { lam: '$V = \\frac{1}{3} S \\cdot h$', vi: 'Công thức thể tích hình chóp.' },
        { lam: '$V = \\frac{1}{3} \\cdot 20 \\cdot 6 = 40$ (cm³)', vi: 'Em hãy tính $V$ (cm³):', an: true,
          dapAn: { kieu: 'so', gt: 40 },
          loiThuongGap: [{ gt: 120, giaiThich: 'Em quên nhân $\\frac{1}{3}$. Thể tích hình chóp chỉ bằng một phần ba "đáy nhân cao".' }] } ] }
    ],
    baiTap: [
      { id: '38.1', muc: 1, de: 'Mặt đáy của hình chóp tam giác đều là hình gì?',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['Tam giác đều', 'Tam giác cân (không đều)', 'Tam giác vuông', 'Hình vuông'] },
        goiY: ['Nhớ lại định nghĩa: tên "tam giác **đều**" nói về mặt đáy.', 'Các mặt **bên** mới là tam giác cân.'],
        loiGiai: ['Hình chóp tam giác đều có mặt đáy là **tam giác đều**; các mặt bên là các tam giác cân bằng nhau.'] },
      { id: '38.2', muc: 1, de: 'Xoay hình chóp tam giác đều bên dưới rồi đếm: hình có bao nhiêu **mặt**, bao nhiêu **đỉnh**, bao nhiêu **cạnh**?',
        hinh: { widget: 'hinhChop', config: { day: 3, a: 5, h: 5, an: true, thanhTruot: false, trai: false, hienDuongCao: false } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số mặt', kieu: 'so', gt: 4, loiThuongGap: [{ gt: 3, giaiThich: 'Em mới đếm 3 mặt bên, còn **mặt đáy** $ABC$ nữa.' }] },
          { nhan: 'Số đỉnh', kieu: 'so', gt: 4, loiThuongGap: [{ gt: 3, giaiThich: 'Ngoài 3 đỉnh của đáy còn **đỉnh** $S$ của hình chóp.' }] },
          { nhan: 'Số cạnh', kieu: 'so', gt: 6, loiThuongGap: [{ gt: 3, giaiThich: 'Có 3 cạnh bên $SA, SB, SC$ **và** 3 cạnh đáy $AB, BC, CA$.' }] }] },
        goiY: ['Mặt: mặt đáy và các mặt bên. Đỉnh: đỉnh $S$ và các đỉnh của đáy.', 'Cạnh: các cạnh bên (đi ra từ $S$) và các cạnh đáy.'],
        loiGiai: ['Mặt: $1$ mặt đáy + $3$ mặt bên = $4$ mặt.', 'Đỉnh: $S, A, B, C$ = $4$ đỉnh.', 'Cạnh: $3$ cạnh bên + $3$ cạnh đáy = $6$ cạnh.'] },
      { id: '38.3', muc: 1, de: 'Cho hình chóp tam giác đều $S.DEF$ như hình ($O$ là trọng tâm tam giác $DEF$, $I$ là trung điểm của $EF$). **Trung đoạn** của hình chóp là đoạn nào?',
        hinh: chop({ n: 3, a: 6, h: 6.5, ten: ['S', 'E', 'F', 'D'], chan: 'O', giua: 'I', k: 0 }),
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$SD$', '$SO$', '$SI$', '$OI$'] },
        goiY: ['Trung đoạn là đường cao **của một mặt bên**, kẻ từ đỉnh $S$.', 'Nó đi tới **trung điểm** của một cạnh đáy và vuông góc với cạnh đó.'],
        loiGiai: ['$SI$ nằm trên mặt bên $SEF$, vuông góc với $EF$ tại trung điểm $I$: đó là **trung đoạn**.', '($SD$ là cạnh bên, $SO$ là đường cao, $OI$ nằm trong mặt đáy.)'] },
      { id: '38.4', muc: 1, de: 'Cho hình chóp tam giác đều $S.MNP$ như hình ($K$ là trung điểm của $MP$, $G$ là trọng tâm của tam giác $MNP$). **Đường cao** của hình chóp là đoạn nào?',
        hinh: chop({ n: 3, a: 6, h: 7, ten: ['S', 'M', 'P', 'N'], chan: 'G', giua: 'K', k: 0 }),
        dapAn: { kieu: 'chon', gt: 1, luaChon: ['$SK$', '$SG$', '$SM$', '$GK$'] },
        goiY: ['Đường cao nối đỉnh $S$ với **trọng tâm** của tam giác đáy.', 'Trọng tâm của đáy $MNP$ là điểm nào?'],
        loiGiai: ['Đường cao nối đỉnh $S$ với trọng tâm $G$ của đáy: đó là $SG$.', '($SK$ là trung đoạn, $SM$ là cạnh bên.)'] },
      { id: '38.5', muc: 2, de: 'Hình chóp tam giác đều có cạnh đáy $10$ cm, trung đoạn $9$ cm. Tính diện tích xung quanh (cm²).',
        hinh: chop({ n: 3, a: 10, h: 8.5, ten: ['S', 'A', 'B', 'C'], giua: 'M', k: 0, nhan: [['A', 'B', '10 cm'], ['S', 'M', '9 cm', true]] }),
        dapAn: { kieu: 'so', gt: 135 },
        goiY: ['$S_{xq} = p \\cdot d$, với $p$ là **nửa** chu vi đáy.', '$p = \\frac{3 \\cdot 10}{2} = 15$.'],
        loiGiai: ['$p = \\frac{3 \\cdot 10}{2} = 15$ (cm)', '$S_{xq} = p \\cdot d = 15 \\cdot 9 = 135$ (cm²)'],
        loiThuongGap: [
          { gt: 270, giaiThich: 'Em dùng cả chu vi $30$. Công thức là **nửa** chu vi: $p = 15$.' },
          { gt: 45, giaiThich: '$45$ cm² mới là diện tích **một** mặt bên ($\\frac{10 \\cdot 9}{2}$). Có 3 mặt bên.' }] },
      { id: '38.6', muc: 2, de: 'Một hình chóp tam giác đều có trung đoạn $12$ cm và diện tích xung quanh $144$ cm². Tính độ dài cạnh đáy (cm).',
        dapAn: { kieu: 'so', gt: 8 },
        goiY: ['Từ $S_{xq} = p \\cdot d$ suy ra $p = S_{xq} : d$.', '$p$ là nửa chu vi, nên chu vi $= 2p$. Đáy có 3 cạnh bằng nhau.'],
        loiGiai: ['$p = 144 : 12 = 12$ (cm)', 'Chu vi đáy $= 2 \\cdot 12 = 24$ (cm)', 'Cạnh đáy $= 24 : 3 = 8$ (cm)'],
        loiThuongGap: [
          { gt: 12, giaiThich: '$12$ là **nửa chu vi** $p$, chưa phải cạnh đáy. Chu vi là $24$, chia cho 3 cạnh.' },
          { gt: 4, giaiThich: 'Em lấy $p = 12$ chia 3. Nhưng $p$ chỉ là **nửa** chu vi; phải nhân đôi trước: $24 : 3 = 8$.' }] },
      { id: '38.7', muc: 2, de: 'Hình chóp tam giác đều có diện tích đáy $24$ cm² và chiều cao $7$ cm. Tính thể tích (cm³).',
        dapAn: { kieu: 'so', gt: 56 },
        goiY: ['$V = \\frac{1}{3} S \\cdot h$.', '$\\frac{1}{3} \\cdot 24 = 8$, rồi nhân với $7$.'],
        loiGiai: ['$V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\cdot 24 \\cdot 7 = 56$ (cm³)'],
        loiThuongGap: [{ gt: 168, giaiThich: 'Em quên $\\frac{1}{3}$: $24 \\cdot 7 = 168$ là thể tích **lăng trụ** cùng đáy, cùng cao.' }] },
      { id: '38.8', muc: 2, de: 'Hình chóp tam giác đều $S.ABC$ có cạnh đáy $6$ cm, chiều cao $8$ cm. Cho biết $\\sqrt{27} \\approx 5{,}2$.\n\na) Tính diện tích đáy $ABC$ (cm²).\n\nb) Tính thể tích hình chóp (cm³).',
        hinh: chop({ n: 3, a: 6, h: 8, ten: ['S', 'A', 'C', 'B'], chan: 'H', nhan: [['B', 'A', '6 cm'], ['S', 'H', '8 cm', true, 0.9]] }),
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $S_{ABC}$ ≈', kieu: 'so', gt: 15.6, saiSo: 0.05,
            loiThuongGap: [{ gt: 31.2, giaiThich: 'Diện tích tam giác phải nhân $\\frac{1}{2}$: $\\frac{1}{2} \\cdot 6 \\cdot 5{,}2 = 15{,}6$.' }] },
          { nhan: 'b) $V$ ≈', kieu: 'so', gt: 41.6, saiSo: 0.1,
            loiThuongGap: [{ gt: 124.8, giaiThich: 'Em quên $\\frac{1}{3}$: $V = \\frac{1}{3} \\cdot 15{,}6 \\cdot 8$.' }] }] },
        goiY: ['Đường cao của tam giác đều cạnh $6$: dùng Pythagore với nửa cạnh $3$: $k^2 = 6^2 - 3^2 = 27$.', '$S = \\frac{1}{2} \\cdot 6 \\cdot \\sqrt{27}$; rồi $V = \\frac{1}{3} S \\cdot h$.'],
        loiGiai: ['Đường cao tam giác đáy: $k^2 = 6^2 - 3^2 = 27$, $k = \\sqrt{27} \\approx 5{,}2$ (cm).', 'a) $S_{ABC} = \\frac{1}{2} \\cdot 6 \\cdot \\sqrt{27} \\approx 3 \\cdot 5{,}2 = 15{,}6$ (cm²).', 'b) $V = \\frac{1}{3} \\cdot S \\cdot h \\approx \\frac{1}{3} \\cdot 15{,}6 \\cdot 8 = 41{,}6$ (cm³).'] },
      { id: '38.9', muc: 2, de: 'Một hình chóp tam giác đều có chiều cao $h$ và thể tích $V$. Diện tích đáy $S$ bằng:',
        dapAn: { kieu: 'chon', gt: 2, luaChon: ['$S = \\frac{h}{V}$', '$S = \\frac{V}{h}$', '$S = \\frac{3V}{h}$', '$S = \\frac{3h}{V}$'] },
        goiY: ['Bắt đầu từ $V = \\frac{1}{3} S \\cdot h$.', 'Nhân hai vế với 3: $3V = S \\cdot h$. Rồi chia cho $h$.'],
        loiGiai: ['$V = \\frac{1}{3} S \\cdot h \\Rightarrow 3V = S \\cdot h \\Rightarrow S = \\frac{3V}{h}$.', '(Phương án $\\frac{V}{h}$ là do quên $\\frac{1}{3}$.)'] },
      { id: '38.10', muc: 3, de: 'Một chóp trang trí bằng inox có dạng hình chóp tam giác đều, cạnh đáy $40$ cm, cạnh bên $52$ cm. Tính tổng diện tích các mặt bên của chóp (cm²).',
        hinh: chop({ n: 3, a: 40, h: 46.6, ten: ['S', 'A', 'B', 'C'], giua: 'M', k: 0, nhan: [['A', 'B', '40 cm'], ['S', 'C', '52 cm']] }),
        dapAn: { kieu: 'so', gt: 2880 },
        goiY: ['Đề cho **cạnh bên**, chưa có trung đoạn. Trung đoạn $SM$ vuông góc $AB$ tại trung điểm $M$, nên $AM = 20$.', 'Tam giác $SAM$ vuông tại $M$: $SM^2 = 52^2 - 20^2$. Rồi $S_{xq} = p \\cdot d$ với $p = 60$.'],
        loiGiai: ['$AM = 40 : 2 = 20$ (cm). Tam giác $SAM$ vuông tại $M$: $SM^2 = 52^2 - 20^2 = 2704 - 400 = 2304$, nên $d = SM = 48$ (cm).', '$p = \\frac{3 \\cdot 40}{2} = 60$ (cm).', '$S_{xq} = p \\cdot d = 60 \\cdot 48 = 2880$ (cm²)'],
        loiThuongGap: [
          { gt: 3120, giaiThich: 'Em lấy **cạnh bên** $52$ làm trung đoạn. Trung đoạn phải tính bằng Pythagore: $d = 48$.' },
          { gt: 5760, giaiThich: 'Em dùng cả chu vi $120$. Công thức dùng **nửa** chu vi $p = 60$.' }] },
      { id: '38.11', muc: 3, de: 'Một chiếc đèn trang trí có dạng hình chóp tam giác đều, **tất cả các cạnh** đều dài $12$ cm. Người ta dán giấy màu kín ba mặt bên. Tính diện tích giấy cần dùng (coi mép dán không đáng kể), **làm tròn đến hàng đơn vị** (cm²). Cho biết $\\sqrt{108} \\approx 10{,}39$.',
        dapAn: { kieu: 'so', gt: 187, saiSo: 0.5 },
        goiY: ['Mỗi mặt bên là tam giác đều cạnh $12$. Trung đoạn là đường cao của tam giác đó.', '$d^2 = 12^2 - 6^2 = 108$, nên $d \\approx 10{,}39$. Rồi $S_{xq} = p \\cdot d$ với $p = 18$.'],
        loiGiai: ['Trung đoạn: $d^2 = 12^2 - 6^2 = 108$, $d \\approx 10{,}39$ (cm).', '$p = \\frac{3 \\cdot 12}{2} = 18$ (cm).', '$S_{xq} = p \\cdot d \\approx 18 \\cdot 10{,}39 = 187{,}02$; làm tròn: $S_{xq} \\approx 187$ (cm²).'],
        loiThuongGap: [
          { gt: 216, giaiThich: 'Em lấy cạnh bên $12$ làm trung đoạn ($18 \\cdot 12$). Trung đoạn là đường cao của mặt bên: $d \\approx 10{,}39$.' },
          { gt: 374, giaiThich: 'Em dùng cả chu vi $36$. Phải dùng nửa chu vi $p = 18$.' }] },
      { id: '38.12', muc: 3, de: 'Bạn Trang cắt một tam giác đều cạnh $16$ cm, kẻ ba đoạn nối trung điểm các cạnh rồi gấp theo ba đoạn đó để được một hình chóp tam giác đều (tam giác ở giữa làm đáy). Tính diện tích xung quanh của hình chóp, **làm tròn đến hàng đơn vị** (cm²). Cho biết $\\sqrt{48} \\approx 6{,}93$.',
        dapAn: { kieu: 'so', gt: 83, saiSo: 0.5 },
        goiY: ['Bốn tam giác nhỏ đều là tam giác đều cạnh $8$ cm. Hình chóp có mọi cạnh bằng $8$.', 'Trung đoạn $d^2 = 8^2 - 4^2 = 48$, $d \\approx 6{,}93$; $p = 12$.'],
        loiGiai: ['Mỗi tam giác nhỏ là tam giác đều cạnh $16 : 2 = 8$ (cm).', 'Trung đoạn: $d^2 = 8^2 - 4^2 = 48$, $d \\approx 6{,}93$ (cm); $p = \\frac{3 \\cdot 8}{2} = 12$ (cm).', '$S_{xq} = p \\cdot d \\approx 12 \\cdot 6{,}93 = 83{,}16$; làm tròn: $S_{xq} \\approx 83$ (cm²).'],
        loiThuongGap: [
          { gt: 111, giaiThich: 'Em tính cả **4** tam giác (cả tấm bìa). Diện tích xung quanh chỉ gồm **3 mặt bên**, không tính mặt đáy.' },
          { gt: 96, giaiThich: 'Em lấy cạnh bên $8$ làm trung đoạn ($12 \\cdot 8$). Trung đoạn $\\approx 6{,}93$.' }] }
    ],
    timLoi: [
      { de: 'Tính diện tích xung quanh của hình chóp tam giác đều có cạnh đáy $6$ cm, trung đoạn $8$ cm. Bạn Minh làm như sau. Dòng nào sai?',
        loiGiaiSai: ['$p = 6 + 6 + 6 = 18$ (cm)', 'Trung đoạn $d = 8$ cm', '$S_{xq} = p \\cdot d = 18 \\cdot 8 = 144$ (cm²)'],
        dongSai: 0,
        giaiThich: '$p$ là **nửa** chu vi đáy, nhưng Minh lấy cả chu vi. Vì vậy kết quả gấp đôi.',
        sua: '$p = \\frac{6 + 6 + 6}{2} = 9$ (cm), nên $S_{xq} = 9 \\cdot 8 = 72$ (cm²).' },
      { de: 'Hình chóp tam giác đều có diện tích đáy $30$ cm², chiều cao $9$ cm. Bạn Hoa tính thể tích như sau. Dòng nào sai?',
        loiGiaiSai: ['Diện tích đáy $S = 30$ cm², chiều cao $h = 9$ cm', '$V = S \\cdot h = 30 \\cdot 9$', '$V = 270$ (cm³)'],
        dongSai: 1,
        giaiThich: 'Hoa dùng công thức thể tích **lăng trụ**. Thể tích hình chóp chỉ bằng $\\frac{1}{3}$ của nó.',
        sua: '$V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\cdot 30 \\cdot 9 = 90$ (cm³).' }
    ]
  });
})();
