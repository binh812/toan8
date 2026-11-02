// Luyện thêm – Bài 33: Hai tam giác đồng dạng
(function () {
  'use strict';
  var TIM = '#9c36b5', CAM = '#d9480f', XANH = '#1971c2';
  var geo = TOAN8.hinhGeo, hh = TOAN8.hh;
  var CAP = [[['A', 'B', 'C'], ['D', 'E', 'F']], [['A', 'B', 'C'], ['M', 'N', 'P']], [['M', 'N', 'P'], ['D', 'E', 'F']],
    [['D', 'E', 'F'], ['H', 'I', 'K']], [['A', 'B', 'C'], ['H', 'I', 'K']], [['M', 'N', 'P'], ['A', 'B', 'C']]];
  // Tỉ số đồng dạng hay gặp: [tử, mẫu]
  var KS = [[2, 1], [3, 1], [1, 2], [3, 2], [5, 2], [2, 3], [4, 3], [1, 3]];

  // Tên cạnh nối đỉnh i, j của tam giác chữ L, viết theo thứ tự chữ cái trong bộ gốc G.
  function canh(L, i, j, G) {
    var a = L[i], b = L[j];
    return G.indexOf(a) <= G.indexOf(b) ? a + b : b + a;
  }
  // Nhãn cạnh PQ đặt ra phía ngoài tam giác (R là đỉnh thứ ba), bù cho cách figure.js chọn phía theo trọng tâm chung.
  function nhanNgoai(D, P, Q, R, chu, mau) {
    var ten = Object.keys(D), cx = 0, cy = 0;
    ten.forEach(function (n) { cx += D[n][0] / ten.length; cy += D[n][1] / ten.length; });
    var A = D[P], B = D[Q], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    var dx = B[0] - A[0], dy = B[1] - A[1], l = Math.sqrt(dx * dx + dy * dy), nx = -dy / l, ny = dx / l;
    var far = Math.pow(mx + nx - cx, 2) + Math.pow(my + ny - cy, 2) > Math.pow(mx - nx - cx, 2) + Math.pow(my - ny - cy, 2);
    var sgMacDinh = far ? 1 : -1, sgMuon = nx * (mx - D[R][0]) + ny * (my - D[R][1]) > 0 ? 1 : -1;
    return [P, Q, chu, sgMacDinh !== sgMuon, 1, mau];
  }
  // Số viết cho nhãn trên hình (chữ thường, không phải KaTeX): 1,2
  function nh(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }
  // Ba số nguyên khác nhau từ lo..hi tạo thành tam giác (không quá dẹt).
  function baCanh(r, lo, hi) {
    for (var t = 0; t < 200; t++) {
      var x = r.khacNhau(3, lo, hi);
      var s = x.slice().sort(function (p, q) { return p - q; });
      if (s[0] + s[1] > s[2] + 1) return x;
    }
    return [4, 5, 6];
  }

  TOAN8.luyen(33, [
    { ten: 'Tỉ số đồng dạng', muc: 1, sinh: function (r, cc) {
      var cap = r.chon(CAP), T = cap[0], U = cap[1], k = r.chon(KS), t = r.so(1, 4);
      var i = r.so(0, 2), j = (i + r.so(1, 2)) % 3, a = Math.min(i, j), b = Math.max(i, j);
      var dU = k[0] * t, dT = k[1] * t, tenU = U[a] + U[b], tenT = T[a] + T[b];
      var nguoc = r.dau() > 0; // hỏi tỉ số của △T với △U
      var kq = nguoc ? cc.phanSo(dT, dU) : cc.phanSo(dU, dT), sai = nguoc ? cc.phanSo(dU, dT) : cc.phanSo(dT, dU);
      var truoc = nguoc ? T.join('') : U.join(''), sau = nguoc ? U.join('') : T.join('');
      var tu = nguoc ? tenT : tenU, mau = nguoc ? tenU : tenT, vTu = nguoc ? dT : dU, vMau = nguoc ? dU : dT;
      return {
        de: 'Cho $\\triangle ' + U.join('') + ' \\backsim \\triangle ' + T.join('') + '$ có $' + tenU + ' = ' + dU + '$ cm và $' + tenT + ' = ' + dT + '$ cm. Tìm tỉ số đồng dạng của $\\triangle ' + truoc + '$ với $\\triangle ' + sau + '$ (viết dạng phân số tối giản hoặc số nguyên).',
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: ['Tỉ số đồng dạng của $\\triangle ' + truoc + '$ với $\\triangle ' + sau + '$ là tỉ số một cạnh của tam giác **đứng trước** với cạnh tương ứng của tam giác đứng sau.',
          'Em lấy $\\frac{' + tu + '}{' + mau + '}$ rồi rút gọn.'],
        loiGiai: ['$' + tenU + '$ và $' + tenT + '$ là hai cạnh tương ứng (cùng vị trí chữ trong kí hiệu).',
          '$k = \\frac{' + tu + '}{' + mau + '} = \\frac{' + vTu + '}{' + vMau + '} = ' + kq.tex + '$'],
        loiThuongGap: [{ gt: sai.ascii, giaiThich: 'Em lật ngược tỉ số. Tam giác $' + truoc + '$ đứng trước nên cạnh của nó nằm ở **tử số**.' }]
      };
    } },
    { ten: 'Góc tương ứng', muc: 1, sinh: function (r) {
      var cap = r.chon(CAP), T = cap[0], U0 = cap[1], V = r.xaoTron(U0);
      var al = r.so(4, 9) * 5 + r.chon([0, 5]), be = r.so(4, 10) * 5;
      while (al + be > 150 || al === be) { al = r.so(4, 9) * 5; be = r.so(4, 10) * 5; }
      var i = r.so(0, 2), j = (i + r.so(1, 2)) % 3, l = 3 - i - j, kq = 180 - al - be;
      var ltg = al !== kq ? [{ gt: al, giaiThich: 'Góc $' + V[l] + '$ ứng với góc $' + T[l] + '$ (cùng vị trí thứ ' + (l + 1) + ' trong kí hiệu), không phải góc $' + T[i] + '$.' }] : [];
      return {
        de: 'Cho $\\triangle ' + T.join('') + ' \\backsim \\triangle ' + V.join('') + '$, biết $\\widehat{' + T[i] + '} = ' + al + '^\\circ$ và $\\widehat{' + V[j] + '} = ' + be + '^\\circ$. Tính $\\widehat{' + V[l] + '}$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Ghép cặp đỉnh theo vị trí chữ: $' + T[0] + ' \\leftrightarrow ' + V[0] + '$, $' + T[1] + ' \\leftrightarrow ' + V[1] + '$, $' + T[2] + ' \\leftrightarrow ' + V[2] + '$. Các góc tương ứng bằng nhau.',
          'Tìm hai góc của $\\triangle ' + V.join('') + '$ rồi dùng tổng ba góc bằng $180^\\circ$.'],
        loiGiai: ['$\\widehat{' + V[i] + '} = \\widehat{' + T[i] + '} = ' + al + '^\\circ$ (cặp đỉnh tương ứng).',
          'Trong $\\triangle ' + V.join('') + '$: $\\widehat{' + V[l] + '} = 180^\\circ - ' + al + '^\\circ - ' + be + '^\\circ = ' + kq + '^\\circ$'],
        loiThuongGap: ltg
      };
    } },
    { ten: 'Tính cạnh tương ứng (có hình)', muc: 2, sinh: function (r, cc) {
      var cap = r.chon(CAP), T = cap[0], G = cap[1], V = r.xaoTron(G), k = r.chon([[2, 1], [3, 2], [5, 2], [1, 2], [2, 3], [4, 3]]);
      var b3 = baCanh(r, 2, 7).map(function (x) { return x * k[1]; });
      // b3[0] = cạnh (0,1), b3[1] = cạnh (1,2), b3[2] = cạnh (0,2)
      var cs = [[0, 1], [1, 2], [0, 2]], s1 = r.so(0, 2), s2 = (s1 + r.so(1, 2)) % 3, s3 = 3 - s1 - s2;
      var kv = k[0] / k[1], biet = b3[s1] * kv, kq = b3[s2] * kv, saiCap = b3[s3] * kv, latNguoc = b3[s2] / kv;
      var tT = function (s) { return canh(T, cs[s][0], cs[s][1], T); }, tV = function (s) { return canh(V, cs[s][0], cs[s][1], G); };
      var D = {}, Tg = hh.tg(b3[1], b3[2], b3[0]);
      D[T[0]] = Tg.A; D[T[1]] = Tg.B; D[T[2]] = Tg.C;
      var dx = b3[1] + Math.max(2, 0.35 * b3[1]);
      D[V[0]] = [dx + kv * Tg.A[0], kv * Tg.A[1]]; D[V[1]] = [dx, 0]; D[V[2]] = [dx + kv * b3[1], 0];
      var nhan = [];
      cs.forEach(function (c, s) {
        nhan.push(nhanNgoai(D, T[c[0]], T[c[1]], T[3 - c[0] - c[1]], nh(b3[s])));
        if (s === s1) nhan.push(nhanNgoai(D, V[c[0]], V[c[1]], V[3 - c[0] - c[1]], nh(biet), TIM));
        if (s === s2) nhan.push(nhanNgoai(D, V[c[0]], V[c[1]], V[3 - c[0] - c[1]], 'x', TIM));
      });
      var canhT = [[T[0], T[1]], [T[1], T[2]], [T[2], T[0]]], canhV = [[V[0], V[1], { mau: TIM }], [V[1], V[2], { mau: TIM }], [V[2], V[0], { mau: TIM }]];
      var ltg = [];
      if (Math.abs(saiCap - kq) > 1e-9) ltg.push({ gt: saiCap, giaiThich: 'Em ghép sai cặp cạnh. Cạnh $' + tV(s2) + '$ ứng với $' + tT(s2) + '$ (cùng vị trí chữ), không phải $' + tT(s3) + '$.' });
      if (Math.abs(latNguoc - kq) > 1e-9 && Math.abs(latNguoc - saiCap) > 1e-9) ltg.push({ gt: latNguoc, giaiThich: 'Em lật ngược tỉ số. $' + tV(s1) + ' = ' + cc.so(biet) + '$ so với $' + tT(s1) + ' = ' + cc.so(b3[s1]) + '$ cho biết tam giác $' + G.join('') + '$ ' + (kv > 1 ? 'lớn hơn' : 'nhỏ hơn') + '.' });
      var kt = cc.phanSo(k[0], k[1]).tex;
      return {
        de: 'Trong hình, $\\triangle ' + T.join('') + ' \\backsim \\triangle ' + V.join('') + '$ với $' + tT(0) + ' = ' + cc.so(b3[0]) + '$, $' + tT(1) + ' = ' + cc.so(b3[1]) + '$, $' + tT(2) + ' = ' + cc.so(b3[2]) + '$ và $' + tV(s1) + ' = ' + cc.so(biet) + '$. Tính $x = ' + tV(s2) + '$.',
        hinh: geo({ diem: D, to: T, canh: canhT.concat(canhV), nhan: nhan }),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Ghép cặp đỉnh theo vị trí chữ trong kí hiệu: $' + T[0] + ' \\leftrightarrow ' + V[0] + '$, $' + T[1] + ' \\leftrightarrow ' + V[1] + '$, $' + T[2] + ' \\leftrightarrow ' + V[2] + '$. Cạnh $' + tV(s2) + '$ ứng với cạnh nào của $\\triangle ' + T.join('') + '$?',
          'Tỉ số đồng dạng $k = \\frac{' + tV(s1) + '}{' + tT(s1) + '}$. Nhân cạnh tương ứng với $k$.'],
        loiGiai: ['$' + tV(s1) + ' \\leftrightarrow ' + tT(s1) + '$ và $' + tV(s2) + ' \\leftrightarrow ' + tT(s2) + '$.',
          '$k = \\frac{' + tV(s1) + '}{' + tT(s1) + '} = \\frac{' + cc.so(biet) + '}{' + cc.so(b3[s1]) + '} = ' + kt + '$.',
          '$x = ' + kt + ' \\cdot ' + cc.so(b3[s2]) + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: ltg
      };
    } },
    { ten: 'Đường thẳng song song với một cạnh', muc: 2, sinh: function (r, cc) {
      var m = r.so(1, 6), n = r.so(1, 6), s = m + n, D, nhan, de, kq, ltg, goiY, loiGiai;
      if (r.dau() > 0) {
        var b = s / cc.ucln(s, m) * r.so(1, 3);
        while (b < 4) b *= 2;
        kq = m * b / s;
        var ac = Math.sqrt(s * s + b * b - s * b), Tg = hh.tg(b, ac, s);
        D = { A: Tg.A, B: Tg.B, C: Tg.C, M: hh.lerp(Tg.A, Tg.B, m / s), N: hh.lerp(Tg.A, Tg.C, m / s) };
        nhan = [['A', 'M', String(m), true], ['M', 'B', String(n), true], ['B', 'C', String(b)], ['M', 'N', 'x', true, 0.8, TIM]];
        de = 'Trong hình, $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$), $AM = ' + m + '$, $MB = ' + n + '$, $BC = ' + b + '$. Tính $x = MN$.';
        ltg = [{ gt: m * b / n, giaiThich: 'Em dùng $\\frac{AM}{MB}$. Cạnh $AM$ của $\\triangle AMN$ ứng với **cả cạnh** $AB = ' + s + '$ của $\\triangle ABC$.' }];
        goiY = ['$MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$.', 'Cạnh $AM$ ứng với cả cạnh $AB = ' + m + ' + ' + n + '$; cạnh $MN$ ứng với $BC$.'];
        loiGiai = ['Vì $MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$, suy ra $\\frac{MN}{BC} = \\frac{AM}{AB}$.',
          '$AB = ' + m + ' + ' + n + ' = ' + s + '$, nên $\\frac{x}{' + b + '} = \\frac{' + m + '}{' + s + '}$.',
          '$x = \\frac{' + m + ' \\cdot ' + b + '}{' + s + '} = ' + cc.so(kq) + '$'];
      } else {
        var t = m / cc.ucln(m, n) * r.so(1, 3);
        while (t < 2) t *= 2;
        kq = t * n / m;
        var acL = t * s / m, bc = Math.sqrt(s * s + acL * acL - s * acL), T2 = hh.tg(bc, acL, s);
        D = { A: T2.A, B: T2.B, C: T2.C, M: hh.lerp(T2.A, T2.B, m / s), N: hh.lerp(T2.A, T2.C, m / s) };
        nhan = [['A', 'M', String(m), true], ['M', 'B', String(n), true], ['A', 'N', nh(t)], ['N', 'C', 'x', false, 1, TIM]];
        de = 'Trong hình, $MN \\parallel BC$ ($M \\in AB$, $N \\in AC$), $AM = ' + m + '$, $MB = ' + n + '$, $AN = ' + cc.so(t) + '$. Tính $x = NC$.';
        ltg = [{ gt: t * s / m, giaiThich: 'Em tính ra $AC$ rồi dừng lại. Đề hỏi $NC = AC - AN$.' }];
        goiY = ['$MN \\parallel BC$ nên $\\triangle AMN \\backsim \\triangle ABC$, do đó $\\frac{AN}{AC} = \\frac{AM}{AB}$.', 'Tính $AC$ trước, rồi $NC = AC - AN$.'];
        loiGiai = ['$\\triangle AMN \\backsim \\triangle ABC$ nên $\\frac{AN}{AC} = \\frac{AM}{AB} = \\frac{' + m + '}{' + s + '}$.',
          '$AC = ' + cc.so(t) + ' \\cdot \\frac{' + s + '}{' + m + '} = ' + cc.so(acL) + '$.',
          '$x = NC = ' + cc.so(acL) + ' - ' + cc.so(t) + ' = ' + cc.so(kq) + '$'];
      }
      return {
        de: de,
        hinh: geo({ diem: D, to: ['A', 'B', 'C'], canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]], nhan: nhan }),
        dapAn: { kieu: 'so', gt: kq }, goiY: goiY, loiGiai: loiGiai, loiThuongGap: ltg
      };
    } },
    { ten: 'Chu vi hai tam giác đồng dạng', muc: 2, sinh: function (r, cc) {
      var cap = r.chon(CAP), T = cap[0], U = cap[1], k = r.chon([[2, 1], [3, 1], [3, 2], [5, 2], [1, 2], [2, 3], [4, 3]]);
      var t = r.so(1, 4), dT = k[1] * t * r.so(1, 2), dU = dT * k[0] / k[1], P = k[1] * r.so(4, 12) * (k[0] === 1 ? 2 : 1);
      var kq = P * k[0] / k[1], kt = cc.phanSo(k[0], k[1]).tex;
      return {
        de: 'Cho $\\triangle ' + U.join('') + ' \\backsim \\triangle ' + T.join('') + '$ có $' + U[0] + U[1] + ' = ' + cc.so(dU) + '$ cm, $' + T[0] + T[1] + ' = ' + cc.so(dT) + '$ cm. Chu vi tam giác $' + T.join('') + '$ bằng $' + P + '$ cm. Tính chu vi tam giác $' + U.join('') + '$ (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Mỗi cạnh của $\\triangle ' + U.join('') + '$ bằng $k = \\frac{' + U[0] + U[1] + '}{' + T[0] + T[1] + '}$ lần cạnh tương ứng của $\\triangle ' + T.join('') + '$.',
          'Ba cạnh cùng nhân $k$ thì chu vi cũng nhân $k$.'],
        loiGiai: ['$k = \\frac{' + U[0] + U[1] + '}{' + T[0] + T[1] + '} = \\frac{' + cc.so(dU) + '}{' + cc.so(dT) + '} = ' + kt + '$.',
          'Chu vi $' + U.join('') + ' = ' + kt + ' \\cdot ' + P + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: P * k[1] / k[0], giaiThich: 'Em chia cho $k$ thay vì nhân. Tam giác $' + U.join('') + '$ ' + (k[0] > k[1] ? 'lớn hơn' : 'nhỏ hơn') + ' nên chu vi phải ' + (k[0] > k[1] ? 'lớn hơn' : 'nhỏ hơn') + ' $' + P + '$.' }]
      };
    } },
    { ten: 'Đo chiều cao cột đèn bằng bóng', muc: 3, sinh: function (r, cc) {
      var c = r.chon([1, 1.2, 1.5, 1.6, 2]), e = r.chon([0.8, 1, 1.2, 1.5, 2]), q = r.chon([4, 5, 6, 8]);
      var L = +(e * q).toFixed(6), h = +(c * q).toFixed(6), cb = +(L - e).toFixed(6), choCB = r.dau() > 0;
      var vat = r.chon([['cột đèn', 'bác Dương'], ['cột đèn đường', 'bạn An'], ['đèn chiếu sáng sân trường', 'thầy Hùng']]);
      var de = 'Để đo chiều cao $AB$ của ' + vat[0] + ', ' + vat[1] + ' cắm một cọc $CD$ cao $' + cc.so(c) + '$ m thẳng đứng. Bóng của cọc do ánh đèn tạo ra dài $EC = ' + cc.so(e) + '$ m; ' +
        (choCB ? 'khoảng cách từ chân cọc $C$ đến chân cột $B$ là $CB = ' + cc.so(cb) + '$ m.' : 'khoảng cách từ đầu bóng $E$ đến chân cột $B$ là $EB = ' + cc.so(L) + '$ m.') + ' Tính chiều cao $h$ của cột (m).';
      var ltg = choCB ? [{ gt: c * cb / e, giaiThich: 'Em dùng $CB$ thay cho $EB$. Cạnh tương ứng với $EC$ là **cả đoạn** $EB = EC + CB$ (cùng xuất phát từ $E$).' }]
        : [{ gt: c * e / L, giaiThich: 'Em lật ngược tỉ số. Cột đèn xa $E$ hơn cọc nên phải cao hơn cọc.' }];
      return {
        de: de,
        hinh: geo({ diem: { E: [0, 0], C: [e, 0], D: [e, c], B: [L, 0], A: [L, h] }, ve: [[[0, -0.16 * Math.max(L, h)], [0.01, -0.16 * Math.max(L, h)], { mau: '#ffffff', day: 0 }]],
          canh: [['E', 'B'], ['C', 'D', { mau: CAM, day: 5 }], ['B', 'A', { mau: XANH, day: 5 }], ['E', 'A', { mau: '#f59f00', day: 2, net: 2 }]],
          nhan: [['C', 'D', nh(c) + ' m', true, 1.6], choCB ? ['C', 'B', nh(cb) + ' m'] : ['E', 'B', nh(L) + ' m', false, 4.2], ['E', 'C', nh(e) + ' m', false, 2.4], ['B', 'A', 'h', true]],
          lechTen: { A: [14, 8], D: [-12, 10], C: [10, -14], E: [-14, 2] }, goc: [['C', 'B', 'A', { mau: '#495057', r: 0.06 * L }]] }),
        dapAn: { kieu: 'so', gt: h },
        goiY: ['Cọc và cột cùng thẳng đứng nên $CD \\parallel BA$. Xét tam giác $EBA$.', 'Vì $CD \\parallel BA$ nên $\\triangle ECD \\backsim \\triangle EBA$, suy ra $\\frac{CD}{BA} = \\frac{EC}{EB}$.'],
        loiGiai: (choCB ? ['$EB = EC + CB = ' + cc.so(e) + ' + ' + cc.so(cb) + ' = ' + cc.so(L) + '$ (m).'] : []).concat([
          '$CD \\parallel BA$ nên $\\triangle ECD \\backsim \\triangle EBA$, suy ra $\\frac{CD}{BA} = \\frac{EC}{EB}$, tức $\\frac{' + cc.so(c) + '}{h} = \\frac{' + cc.so(e) + '}{' + cc.so(L) + '}$.',
          '$h = \\frac{' + cc.so(c) + ' \\cdot ' + cc.so(L) + '}{' + cc.so(e) + '} = ' + cc.so(h) + '$']),
        loiThuongGap: ltg
      };
    } },
    { ten: 'Tỉ số đồng dạng bắc cầu', muc: 3, sinh: function (r, cc) {
      var k = r.chon([[2, 1], [3, 1], [3, 2], [1, 2], [2, 3], [5, 2]]), m = r.chon([[3, 4], [2, 3], [4, 3], [1, 2], [5, 4], [3, 2]]);
      while (k[0] * m[0] === k[1] * m[1]) m = r.chon([[3, 4], [2, 3], [4, 3], [1, 2], [5, 4], [3, 2]]);
      var AB = m[1] * k[1] * r.so(1, 3), A1 = AB * m[0] / m[1], kq = A1 * k[0] / k[1];
      var kt = cc.phanSo(k[0], k[1]).tex, mt = cc.phanSo(m[0], m[1]).tex, tich = cc.phanSo(k[0] * m[0], k[1] * m[1]).tex;
      return {
        de: "Cho $\\triangle A''B''C'' \\backsim \\triangle A'B'C'$ theo tỉ số $" + kt + "$ và $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $" + mt + "$. Biết $AB = " + AB + "$ cm, tính $A''B''$ (cm).",
        dapAn: { kieu: 'so', gt: kq },
        goiY: ["Tính $A'B'$ trước: $A'B' = " + mt + " \\cdot AB$.", "Rồi $A''B'' = " + kt + " \\cdot A'B'$. (Hoặc: $\\triangle A''B''C'' \\backsim \\triangle ABC$ theo tỉ số " + '$' + kt + ' \\cdot ' + mt + '$.)'],
        loiGiai: ["$A'B' = " + mt + ' \\cdot ' + AB + ' = ' + cc.so(A1) + '$ (cm).', "Cách khác: tỉ số của $\\triangle A''B''C''$ với $\\triangle ABC$ là $" + kt + ' \\cdot ' + mt + ' = ' + tich + '$.',
          "$A''B'' = " + kt + ' \\cdot ' + cc.so(A1) + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: AB * m[1] / m[0] * k[0] / k[1], giaiThich: "Em chia cho $" + mt + "$ thay vì nhân. $\\triangle A'B'C' \\backsim \\triangle ABC$ theo tỉ số $" + mt + "$ nghĩa là $A'B' = " + mt + ' \\cdot AB$.' }]
      };
    } }
  ]);
})();
