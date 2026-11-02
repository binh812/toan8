// Luyện thêm – Bài 24: Phép nhân và phép chia phân thức đại số
(function () {
  'use strict';

  // ---- Đa thức theo x: mảng hệ số từ bậc 0 lên; nhân tử (x − r) ghi bằng nghiệm r ----
  function nhanDT(p, q) {
    var o = [];
    for (var i = 0; i < p.length + q.length - 1; i++) o.push(0);
    p.forEach(function (a, i) { q.forEach(function (b, j) { o[i + j] += a * b; }); });
    return o;
  }
  function trienKhai(k, ng) { var p = [k]; ng.forEach(function (r) { p = nhanDT(p, [-r, 1]); }); return p; }
  function vietDT(cc, p) {
    var h = [];
    for (var i = p.length - 1; i >= 0; i--) h.push([p[i], i === 0 ? '' : i === 1 ? 'x' : 'x^' + i]);
    return cc.daThuc(h);
  }
  function coSo(r) { return r === 0 ? 'x' : 'x' + (r > 0 ? '-' + r : '+' + (-r)); }
  function frac(t, m) { return '\\frac{' + t + '}{' + m + '}'; }
  function tich(k, ng, boNgoac) {
    var nhom = [];
    ng.slice().sort(function (a, b) { return (a === 0 ? -1e9 : a) - (b === 0 ? -1e9 : b); }).forEach(function (r) {
      var g = nhom[nhom.length - 1];
      if (g && g.r === r) g.mu++; else nhom.push({ r: r, mu: 1 });
    });
    if (boNgoac && k === 1 && nhom.length === 1 && nhom[0].mu === 1) return coSo(nhom[0].r);
    var s = k !== 1 || !nhom.length ? String(k) : '';
    nhom.forEach(function (g) { s += (g.r === 0 ? 'x' : '(' + coSo(g.r) + ')') + (g.mu > 1 ? '^' + g.mu : ''); });
    return s;
  }
  function tichD(k, ng) { return k < 0 ? '-' + tich(-k, ng, false) : tich(k, ng, true); }
  // Phân thức dạng nhân tử F = { k, m, n:[nghiệm tử], d:[nghiệm mẫu] }
  function gon(cc, F) {
    var n = F.n.slice(), d = [];
    F.d.forEach(function (r) { var i = n.indexOf(r); if (i >= 0) n.splice(i, 1); else d.push(r); });
    var k = F.k, m = F.m;
    if (m < 0) { k = -k; m = -m; }
    var g = cc.ucln(k, m);
    return { k: k / g, m: m / g, n: n, d: d };
  }
  function nhanPT(A, B) { return { k: A.k * B.k, m: A.m * B.m, n: A.n.concat(B.n), d: A.d.concat(B.d) }; }
  function daoPT(A) { return { k: A.m, m: A.k, n: A.d, d: A.n }; }
  function vietPT(F) {
    var dau = F.k < 0 ? '-' : '', k = Math.abs(F.k);
    if (F.m === 1 && !F.d.length) { var s = dau ? dau + tich(k, F.n, false) : tich(k, F.n, true); return { ascii: s, tex: s }; }
    var tu = tich(k, F.n, true), mau = tich(F.m, F.d, true);
    return { ascii: dau + '(' + tu + ')/(' + mau + ')', tex: dau + frac(tu, mau) };
  }
  function moRong(cc, F) { return frac(vietDT(cc, trienKhai(F.k, F.n)), vietDT(cc, trienKhai(F.m, F.d))); }
  function nhanTu(F) { return frac(tichD(F.k, F.n), tich(F.m, F.d, true)); }
  function hamPT(F) {
    return function (x) {
      var t = F.k, m = F.m;
      F.n.forEach(function (r) { t *= x - r; });
      F.d.forEach(function (r) { m *= x - r; });
      return t / m;
    };
  }
  var DIEM = [0.37, 1.73, -2.41, 3.19, -0.83];
  function trung(f, g) {
    return DIEM.every(function (x) { var a = f(x), b = g(x); return !isFinite(a) || !isFinite(b) || Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a)); });
  }
  function don(c, ex, ey) {
    var s = c !== 1 || (!ex && !ey) ? String(c) : '';
    if (ex) s += ex === 1 ? 'x' : 'x^' + ex;
    if (ey) s += ey === 1 ? 'y' : 'y^' + ey;
    return s;
  }
  // Phân thức một hạng tử { t, m (số), x, y (số mũ có dấu) } → { ascii, tex }
  function vietDon(cc, D) {
    var p = cc.phanSo(D.t, D.m), dau = p.tu < 0 ? '-' : '';
    var tu = don(Math.abs(p.tu), Math.max(D.x, 0), Math.max(D.y, 0)), mau = don(p.mau, Math.max(-D.x, 0), Math.max(-D.y, 0));
    if (mau === '1') return { ascii: dau + tu, tex: dau + tu };
    return { ascii: dau + '(' + tu + ')/(' + mau + ')', tex: dau + frac(tu, mau) };
  }
  function lcm(cc, a, b) { return a / cc.ucln(a, b) * b; }

  // Một phân thức khác mẫu dạng ±(n·xᵃyᵇ)/(m·xᶜyᵈ) (tối giản sẵn)
  function sinhDon(r, cc) {
    var n = r.so(1, 9), m = r.so(1, 9);
    while (cc.ucln(n, m) > 1 || (n === 1 && m === 1)) { n = r.so(1, 9); m = r.so(1, 9); }
    var xTu = r.dau() > 0, e1 = r.so(1, 3), e2 = r.so(1, 3), s = r.dau() > 0 ? 1 : r.dau();
    var tuS = don(n, xTu ? e1 : 0, xTu ? 0 : e1), mauS = don(m, xTu ? 0 : e2, xTu ? e2 : 0);
    return { t: s * n, m: m, x: xTu ? e1 : -e2, y: xTu ? -e2 : e1, tex: s < 0 ? '\\left(-' + frac(tuS, mauS) + '\\right)' : frac(tuS, mauS), am: s < 0 };
  }

  TOAN8.luyen(24, [
    { ten: 'Nhân, chia phân thức (đơn thức)', muc: 1, sinh: function (r, cc) {
      var A = sinhDon(r, cc), B = sinhDon(r, cc), chia = r.dau() > 0;
      var nhan = { t: A.t * B.t, m: A.m * B.m, x: A.x + B.x, y: A.y + B.y };
      var thuong = { t: A.t * B.m, m: A.m * Math.abs(B.t), x: A.x - B.x, y: A.y - B.y };
      if (B.t < 0) thuong.t = -thuong.t;
      var kq = vietDon(cc, chia ? thuong : nhan), ltg = [];
      var giong = function (P, Q) { return P.x === Q.x && P.y === Q.y && P.t * Q.m === Q.t * P.m; };
      if (chia && !giong(nhan, thuong)) ltg.push({ gt: vietDon(cc, nhan).ascii, giaiThich: 'Em quên **lật** phân thức chia: $\\frac{A}{B} : \\frac{C}{D} = \\frac{A}{B}\\cdot\\frac{D}{C}$.' });
      var kqP = chia ? thuong : nhan, doiDau = { t: -kqP.t, m: kqP.m, x: kqP.x, y: kqP.y };
      if (A.am && B.am) ltg.push({ gt: vietDon(cc, doiDau).ascii, giaiThich: 'Hai phân thức đều âm: âm nhân (chia) âm được **dương**.' });
      var Bdao = frac(don(B.m, Math.max(-B.x, 0), Math.max(-B.y, 0)), don(Math.abs(B.t), Math.max(B.x, 0), Math.max(B.y, 0)));
      var de = A.tex + (chia ? ' : ' : '\\cdot ') + B.tex;
      // Bước giữa: tử nhân tử, mẫu nhân mẫu (với phép chia: nhân với phân thức đã lật)
      var tuA = don(Math.abs(A.t), Math.max(A.x, 0), Math.max(A.y, 0)), mauA = don(A.m, Math.max(-A.x, 0), Math.max(-A.y, 0));
      var tuB = don(Math.abs(B.t), Math.max(B.x, 0), Math.max(B.y, 0)), mauB = don(B.m, Math.max(-B.x, 0), Math.max(-B.y, 0));
      var giua = (A.am !== B.am ? '-' : '') + (chia ? frac(tuA + '\\cdot ' + mauB, mauA + '\\cdot ' + tuB) : frac(tuA + '\\cdot ' + tuB, mauA + '\\cdot ' + mauB));
      return {
        de: (chia ? 'Làm tính chia: $' : 'Làm tính nhân: $') + de + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: chia ? ['Chia cho một phân thức là nhân với phân thức **nghịch đảo** của nó: lật $' + frac(don(Math.abs(B.t), Math.max(B.x, 0), Math.max(B.y, 0)), don(B.m, Math.max(-B.x, 0), Math.max(-B.y, 0))) + '$ thành $' + Bdao + '$.', 'Nhân tử với tử, mẫu với mẫu, xét dấu rồi rút gọn.']
          : ['Nhân tử với tử, mẫu với mẫu.', 'Xét dấu trước, rồi rút gọn hệ số và lũy thừa của từng biến.'],
        loiGiai: [chia ? '$' + de + ' = ' + A.tex + '\\cdot ' + (B.am ? '\\left(-' + Bdao + '\\right)' : Bdao) + '$' : 'Tử nhân tử, mẫu nhân mẫu; dấu: ' + (A.am !== B.am ? 'âm.' : 'dương.'),
          '$' + (chia ? '= ' : de + ' = ') + giua + '$',
          '$= ' + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Phân thức nghịch đảo', muc: 1, sinh: function (r, cc) {
      var loai = r.so(0, 2), a = r.khac0(-6, 6), b = r.khac0(-6, 6), F, deS;
      while (b === a) b = r.khac0(-6, 6);
      if (loai === 0) { F = { k: r.chon([1, 1, 2, 3]), m: 1, n: [a], d: [b] }; }
      else if (loai === 1) { F = { k: 1, m: 1, n: [a, -a], d: [] }; }
      else { F = { k: r.chon([1, 2, 3, 5]), m: 1, n: [], d: [0, b] }; }
      deS = F.d.length ? moRong(cc, F) : vietDT(cc, trienKhai(F.k, F.n));
      var D = daoPT(F), tuD = vietDT(cc, trienKhai(D.k, D.n)), mauD = vietDT(cc, trienKhai(D.m, D.d));
      var kq = mauD === '1' ? { ascii: tuD, tex: tuD } : { ascii: '(' + tuD + ')/(' + mauD + ')', tex: frac(tuD, mauD) };
      return {
        de: 'Viết phân thức **nghịch đảo** của ' + (F.d.length ? 'phân thức' : 'đa thức') + ' $' + deS + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii },
        goiY: ['Hai phân thức nghịch đảo nhau nếu tích của chúng bằng $1$.', F.d.length ? 'Đổi chỗ tử và mẫu: $\\frac{A}{B}$ có nghịch đảo $\\frac{B}{A}$.' : 'Một đa thức $A$ là phân thức $\\frac{A}{1}$, nên nghịch đảo là $\\frac{1}{A}$.'],
        loiGiai: ['Đổi chỗ tử và mẫu (tích của hai phân thức bằng $1$).', 'Phân thức nghịch đảo là $' + kq.tex + '$'],
        loiThuongGap: [{ gt: '-(' + (F.d.length ? '(' + vietDT(cc, trienKhai(F.k, F.n)) + ')/(' + vietDT(cc, trienKhai(F.m, F.d)) + ')' : vietDT(cc, trienKhai(F.k, F.n))) + ')', giaiThich: 'Đó là phân thức **đối** (tổng bằng $0$). Nghịch đảo là phân thức có **tích** bằng $1$: đổi chỗ tử và mẫu.' }]
      };
    } },

    { ten: 'Nhân hai phân thức (phân tích rồi rút gọn)', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), b = r.khac0(-6, 6), loai = r.so(0, 2), k1 = r.so(2, 6), k2 = r.so(1, 6), A, B;
      while (b === a || b === -a) b = r.khac0(-6, 6);
      if (loai === 0) { A = { k: 1, m: k1, n: [a, -a], d: [0] }; B = { k: k2, m: 1, n: [0, 0], d: [-a] }; }
      else if (loai === 1) { A = { k: k1, m: 1, n: [-a], d: [0, b] }; B = { k: 1, m: 1, n: [b, -b], d: [-a, -a] }; }
      else { A = { k: 1, m: k1, n: [0, a], d: [-b] }; B = { k: k2, m: 1, n: [-b], d: [a, -a] }; }
      if (r.dau() < 0) { var t = A; A = B; B = t; }
      var P = nhanPT(A, B), G = gon(cc, P), kq = vietPT(G), ltg = [];
      // Lỗi: coi x² − c² là (x − c)²
      var c = loai === 1 ? b : a, c2 = Math.abs(c);
      var doi = function (ng) { var i = ng.indexOf(-c2), o = ng.slice(); if (i >= 0 && ng.indexOf(c2) >= 0) o[i] = c2; return o; };
      var sai = function (F) { return { k: F.k, m: F.m, n: doi(F.n), d: doi(F.d) }; };
      var W = gon(cc, nhanPT(sai(A), sai(B)));
      if (!trung(hamPT(W), hamPT(G))) ltg.push({ gt: vietPT(W).ascii, giaiThich: 'Hiệu hai bình phương: $x^2 - ' + c * c + ' = (' + coSo(c2) + ')(' + coSo(-c2) + ')$, **không** phải $(' + coSo(c2) + ')^2$.' });
      var de = moRong(cc, A) + '\\cdot ' + moRong(cc, B);
      return {
        de: 'Làm tính nhân và rút gọn: $' + de + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Phân tích các tử và mẫu thành nhân tử: $' + nhanTu(A) + '\\cdot ' + nhanTu(B) + '$.', 'Nhân tử với tử, mẫu với mẫu, rồi chia cả tử và mẫu cho các nhân tử chung (đừng nhân khai triển ra).'],
        loiGiai: ['$' + de + ' = ' + nhanTu(A) + '\\cdot ' + nhanTu(B) + '$', '$= ' + nhanTu(P) + '$', '$= ' + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Chia hai phân thức', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), b = r.khac0(-6, 6), loai = r.so(0, 2), k1 = r.so(2, 6), k2 = r.so(2, 6), A, B;
      while (b === a || b === -a) b = r.khac0(-6, 6);
      if (loai === 0) { A = { k: 1, m: k1, n: [a, -a], d: [0] }; B = { k: 1, m: k2, n: [-a], d: [0, 0] }; }
      else if (loai === 1) { A = { k: k1, m: 1, n: [], d: [a, -a] }; B = { k: k2, m: 1, n: [], d: [0, a] }; }
      else { A = { k: 1, m: 1, n: [a, -a], d: [-b] }; B = { k: 1, m: 1, n: [a], d: [0, -b] }; }
      var P = nhanPT(A, daoPT(B)), G = gon(cc, P), kq = vietPT(G), ltg = [];
      var W = gon(cc, nhanPT(A, B));
      if (!trung(hamPT(W), hamPT(G))) ltg.push({ gt: vietPT(W).ascii, giaiThich: 'Em quên **lật** phân thức chia. $\\frac{A}{B} : \\frac{C}{D} = \\frac{A}{B}\\cdot\\frac{D}{C}$.' });
      var W2 = gon(cc, nhanPT(daoPT(A), B));
      if (!trung(hamPT(W2), hamPT(G)) && !trung(hamPT(W2), hamPT(W))) ltg.push({ gt: vietPT(W2).ascii, giaiThich: 'Em lật nhầm phân thức **bị chia**. Chỉ lật phân thức đứng **sau** dấu chia.' });
      var de = moRong(cc, A) + ' : ' + moRong(cc, B);
      return {
        de: 'Làm tính chia và rút gọn: $' + de + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Chia cho một phân thức là nhân với phân thức **nghịch đảo** của nó.', 'Phân tích thành nhân tử: $' + nhanTu(A) + '\\cdot ' + nhanTu(daoPT(B)) + '$, rồi rút gọn.'],
        loiGiai: ['$' + de + ' = ' + nhanTu(A) + '\\cdot ' + nhanTu(daoPT(B)) + '$', '$= ' + nhanTu(P) + '$', '$= ' + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tìm phân thức chưa biết', muc: 3, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), b = r.khac0(-6, 6), k = r.so(1, 5);
      while (b === a || b === -a) b = r.khac0(-6, 6);
      var C, E, P, nhan = r.dau() > 0, ltg = [];
      if (nhan) { // P · C = E  ⟹  P = E : C
        C = { k: 1, m: 1, n: [a], d: [-b] }; E = { k: k, m: 1, n: [0, a], d: [b, -b] };
        P = gon(cc, nhanPT(E, daoPT(C)));
        var W = gon(cc, nhanPT(E, C));
        if (!trung(hamPT(W), hamPT(P))) ltg.push({ gt: vietPT(W).ascii, giaiThich: 'Muốn tìm thừa số chưa biết, ta lấy tích **chia** cho thừa số đã biết, không phải nhân.' });
      } else { // P : C = E  ⟹  P = E · C
        var k2 = r.so(2, 5);
        C = { k: 1, m: k2, n: [a], d: [0] }; E = { k: k, m: 1, n: [0, 0], d: [a, -a] };
        P = gon(cc, nhanPT(E, C));
        var W2 = gon(cc, nhanPT(E, daoPT(C)));
        if (!trung(hamPT(W2), hamPT(P))) ltg.push({ gt: vietPT(W2).ascii, giaiThich: 'Muốn tìm số bị chia, ta lấy thương **nhân** với số chia, không phải chia.' });
      }
      var kq = vietPT(P), Cs = moRong(cc, C), Es = moRong(cc, E);
      var cach = nhan ? Es + ' : ' + Cs : Es + '\\cdot ' + Cs, nt = nhan ? nhanTu(E) + '\\cdot ' + nhanTu(daoPT(C)) : nhanTu(E) + '\\cdot ' + nhanTu(C);
      return {
        de: 'Tìm phân thức $P$ thoả mãn $P' + (nhan ? '\\cdot ' : ' : ') + Cs + ' = ' + Es + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: [nhan ? '$P$ là thừa số chưa biết: $P = ' + Es + ' : ' + Cs + '$.' : '$P$ là số bị chia: $P = ' + Es + '\\cdot ' + Cs + '$.', 'Phân tích thành nhân tử rồi rút gọn: $' + nt + '$.'],
        loiGiai: ['$P = ' + cach + '$', '$P = ' + nt + '$', '$P = ' + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế (năng suất, vận tốc)', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var p = r.chon([100, 150, 200, 250, 300, 400, 500]), x0 = r.chon([40, 50, 60, 80, 100, 120]), d = r.chon([5, 10, 20]);
        var N = p * x0, e = 10, M;
        while ((p + e) * (x0 - d) <= N) e += 10;
        M = (p + e) * (x0 - d) - N;
        var xuong = r.chon(['Một xưởng may', 'Một nhà máy', 'Một tổ sản xuất']), sp = r.chon(['sản phẩm', 'chiếc áo', 'đôi giày']);
        return {
          de: xuong + ' lập kế hoạch làm $' + N + '$ ' + sp + ' trong $x$ ngày. Nhờ cải tiến kĩ thuật, họ đã làm xong sớm $' + d + '$ ngày và còn làm vượt $' + M + '$ ' + sp + '.\n\na) Viết phân thức biểu thị số ' + sp + ' thực tế làm được mỗi ngày.\n\nb) Biết theo kế hoạch mỗi ngày làm $' + p + '$ ' + sp + '. Thực tế mỗi ngày làm nhiều hơn kế hoạch bao nhiêu ' + sp + '?',
          dapAn: { kieu: 'nhieuO', o: [
            { nhan: 'a) Mỗi ngày thực tế', kieu: 'bieuThuc', gt: (N + M) + '/(x-' + d + ')',
              loiThuongGap: [{ gt: N + '/(x-' + d + ')', giaiThich: 'Thực tế làm vượt $' + M + '$ ' + sp + ': tổng là $' + N + ' + ' + M + ' = ' + (N + M) + '$.' }, { gt: (N + M) + '/(x+' + d + ')', giaiThich: 'Xong **sớm** $' + d + '$ ngày nên số ngày là $x - ' + d + '$.' }] },
            { nhan: 'b) Nhiều hơn (chỉ ghi số)', kieu: 'so', gt: e,
              loiThuongGap: [{ gt: cc.phanSo(N - p * (x0 - d), x0 - d).ascii, giaiThich: 'Em quên phần làm vượt: thực tế làm $' + (N + M) + '$ ' + sp + ' trong $' + (x0 - d) + '$ ngày.' }] }] },
          goiY: ['Thực tế: $' + N + ' + ' + M + '$ ' + sp + ' trong $x - ' + d + '$ ngày.', 'Kế hoạch $' + p + '$ ' + sp + ' mỗi ngày nên $x = ' + N + ' : ' + p + ' = ' + x0 + '$ ngày.'],
          loiGiai: ['a) $' + frac(N + M, 'x-' + d) + '$ (' + sp + '/ngày).',
            'b) $x = ' + frac(N, p) + ' = ' + x0 + '$; thực tế mỗi ngày $' + frac(N + M, x0 - d) + ' = ' + (p + e) + '$ ' + sp + '.',
            'Nhiều hơn kế hoạch: $' + (p + e) + ' - ' + p + ' = ' + e + '$'],
        };
      }
      // Tỉ số vận tốc: xe con đi S2 km hết (x − d) giờ, xe tải đi S1 km hết x giờ
      var dd = r.chon([1, 1, 2]), xx = r.so(dd + 2, dd + 4), S1 = xx * r.chon([30, 40, 50]), S2 = (xx - dd) * r.chon([50, 60, 70, 80]);
      var g = cc.ucln(S2, S1), tuK = don(S2 / g, 1, 0), mauK = S1 / g === 1 ? 'x-' + dd : (S1 / g) + '(x-' + dd + ')';
      var kq = '(' + tuK + ')/(' + mauK + ')';
      var v = cc.phanSo(S2 * xx, S1 * (xx - dd));
      var saiA = '(' + mauK + ')/(' + tuK + ')';
      return {
        de: 'Một xe tải đi quãng đường $' + S1 + '$ km hết $x$ giờ. Một xe con đi quãng đường $' + S2 + '$ km hết ít hơn xe tải $' + dd + '$ giờ.\n\na) Vận tốc xe con gấp bao nhiêu lần vận tốc xe tải? Viết kết quả dưới dạng một phân thức rút gọn theo $x$.\n\nb) Tính tỉ số đó khi $x = ' + xx + '$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Vận tốc xe con : vận tốc xe tải', kieu: 'bieuThuc', gt: kq, dang: 'rutGon',
            loiThuongGap: [{ gt: saiA, giaiThich: 'Em chia ngược. Tỉ số cần tìm là vận tốc **xe con** chia cho vận tốc **xe tải**.' }] },
          { nhan: 'b) Khi $x = ' + xx + '$', kieu: 'so', gt: v.ascii }] },
        goiY: ['Vận tốc xe tải $' + frac(S1, 'x') + '$, xe con $' + frac(S2, 'x-' + dd) + '$ (km/h).', 'Chia hai phân thức: nhân với phân thức nghịch đảo của $' + frac(S1, 'x') + '$.'],
        loiGiai: ['a) $' + frac(S2, 'x-' + dd) + ' : ' + frac(S1, 'x') + ' = ' + frac(S2, 'x-' + dd) + '\\cdot ' + frac('x', S1) + ' = ' + frac(S2 + 'x', S1 + '(x-' + dd + ')') + (g > 1 ? ' = ' + frac(tuK, mauK) : '') + '$.',
          'b) Khi $x = ' + xx + '$: $' + frac(S2 + '\\cdot ' + xx, S1 + '\\cdot ' + (xx - dd)) + ' = ' + v.tex + '$']
      };
    } }
  ]);
})();
