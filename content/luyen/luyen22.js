// Luyện thêm – Bài 22: Tính chất cơ bản của phân thức đại số
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
  function giaTri(p, x) { return p.reduceRight(function (s, a) { return s * x + a; }, 0); }
  function coSo(r) { return r === 0 ? 'x' : 'x' + (r > 0 ? '-' + r : '+' + (-r)); }
  function frac(t, m) { return '\\frac{' + t + '}{' + m + '}'; }
  // k·(x − r₁)(x − r₂)… (k > 0); boNgoac: một nhân tử đứng riêng thì bỏ ngoặc
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
  // Phân thức dạng nhân tử F = { k, m, n:[nghiệm tử], d:[nghiệm mẫu] }: chia cho nhân tử chung và ƯCLN hệ số
  function gon(cc, F) {
    var n = F.n.slice(), d = [];
    F.d.forEach(function (r) { var i = n.indexOf(r); if (i >= 0) n.splice(i, 1); else d.push(r); });
    var k = F.k, m = F.m;
    if (m < 0) { k = -k; m = -m; }
    var g = cc.ucln(k, m);
    return { k: k / g, m: m / g, n: n, d: d };
  }
  function vietPT(F) {
    var dau = F.k < 0 ? '-' : '', k = Math.abs(F.k);
    if (F.m === 1 && !F.d.length) { var s = dau ? dau + tich(k, F.n, false) : tich(k, F.n, true); return { ascii: s, tex: s }; }
    var tu = tich(k, F.n, true), mau = tich(F.m, F.d, true);
    return { ascii: dau + '(' + tu + ')/(' + mau + ')', tex: dau + frac(tu, mau) };
  }
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
  function hamDT(N, D) { return function (x) { return giaTri(N, x) / giaTri(D, x); }; }
  function don(c, ex, ey) {
    var s = c !== 1 || (!ex && !ey) ? String(c) : '';
    if (ex) s += ex === 1 ? 'x' : 'x^' + ex;
    if (ey) s += ey === 1 ? 'y' : 'y^' + ey;
    return s;
  }
  function lcm(cc, a, b) { return a / cc.ucln(a, b) * b; }
  function hopNghiem(a, b) { // bội lớn nhất của từng nghiệm
    var o = a.slice(), con = a.slice();
    b.forEach(function (r) { var i = con.indexOf(r); if (i >= 0) con.splice(i, 1); else o.push(r); });
    return o;
  }
  function quenPhu(c, phu) {
    return phu.k === 1 && !phu.ng.length ? [] : [{ gt: String(c), giaiThich: 'Mẫu đã nhân với nhân tử phụ $' + tich(phu.k, phu.ng, true) + '$ thì tử cũng phải nhân với $' + tich(phu.k, phu.ng, true) + '$.' }];
  }
  function bot(a, b) { var o = a.slice(); b.forEach(function (r) { o.splice(o.indexOf(r), 1); }); return o; }

  TOAN8.luyen(22, [
    { ten: 'Điền đa thức (tính chất cơ bản)', muc: 1, sinh: function (r, cc) {
      var loai = r.so(0, 2);
      if (loai === 0) {
        var a = r.khac0(-6, 6), b = r.khac0(-6, 6);
        while (b === -a) b = r.khac0(-6, 6);
        var M = r.chon([{ k: r.so(2, 5), ng: [0] }, { k: 1, ng: [0] }, { k: r.so(2, 6), ng: [] }]);
        var Ms = tich(M.k, M.ng, true), mau2 = tich(M.k, M.ng.concat([b]), false), kq = tich(M.k, M.ng.concat([-a]), false);
        return {
          de: 'Tìm đa thức thay cho dấu "?": $' + frac(coSo(-a), coSo(b)) + ' = ' + frac('?', mau2) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq },
          goiY: ['Mẫu $' + coSo(b) + '$ đã được nhân với gì để thành $' + mau2 + '$?', 'Tính chất cơ bản: nhân cả tử với đúng $' + Ms + '$.'],
          loiGiai: ['Mẫu được nhân với $' + Ms + '$: $(' + coSo(b) + ')\\cdot ' + Ms + ' = ' + mau2 + '$.', 'Tử cũng phải nhân với $' + Ms + '$: $? = ' + kq + '$'],
          loiThuongGap: [{ gt: coSo(-a), giaiThich: 'Mẫu đã nhân với $' + Ms + '$ thì tử cũng phải nhân với $' + Ms + '$ (tính chất cơ bản).' }]
        };
      }
      if (loai === 1) {
        var c = r.so(1, 9), d = r.so(1, 9);
        while (d === c) d = r.so(1, 9);
        var tuTruoc = r.dau() > 0; // tử viết "c − x" hay "x − c"
        var tu = tuTruoc ? cc.daThuc([[c, ''], [-1, 'x']]) : coSo(c), kq2 = tuTruoc ? coSo(c) : cc.daThuc([[c, ''], [-1, 'x']]);
        var mau = cc.daThuc([[d, ''], [-1, 'x']]);
        var ltg = [{ gt: tu, giaiThich: 'Mẫu đã đổi dấu ($' + mau + ' \\to ' + coSo(d) + '$) thì tử cũng phải đổi dấu.' }];
        if (tuTruoc) ltg.push({ gt: '-x' + (c > 0 ? '-' + c : '+' + (-c)), giaiThich: 'Đổi dấu **tất cả** hạng tử của tử: $-(' + tu + ') = ' + kq2 + '$.' });
        return {
          de: 'Tìm đa thức thay cho dấu "?": $' + frac(tu, mau) + ' = ' + frac('?', coSo(d)) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq2 },
          goiY: ['Mẫu $' + mau + '$ đã được đổi dấu thành $' + coSo(d) + '$.', 'Quy tắc đổi dấu: $\\frac{A}{B} = \\frac{-A}{-B}$. Tử cũng đổi dấu.'],
          loiGiai: ['Mẫu đổi dấu: $-(' + mau + ') = ' + coSo(d) + '$.', 'Tử cũng đổi dấu: $? = -(' + tu + ') = ' + kq2 + '$'],
          loiThuongGap: ltg
        };
      }
      var e = r.so(1, 7), k = r.chon([1, 1, 2, 3, 5]), s = r.dau(); // (k x² ± k e x)/(x² − e²) = kx/(x ∓ e)
      var giu = -s * e; // nhân tử chung (x − giu)
      var tu3 = vietDT(cc, trienKhai(k, [0, giu])), mau3 = vietDT(cc, trienKhai(1, [e, -e])), kx = k === 1 ? 'x' : k + 'x';
      return {
        de: 'Tìm đa thức thay cho dấu "?": $' + frac(tu3, mau3) + ' = ' + frac(kx, '?') + '$.',
        dapAn: { kieu: 'bieuThuc', gt: coSo(-giu) },
        goiY: ['Phân tích tử và mẫu: $' + tu3 + ' = ' + tich(k, [0, giu], false) + '$; $' + mau3 + ' = (' + coSo(e) + ')(' + coSo(-e) + ')$.', 'Tử đã được chia cho nhân tử chung $' + coSo(giu) + '$; mẫu cũng chia cho đúng nhân tử đó.'],
        loiGiai: ['$' + frac(tu3, mau3) + ' = ' + frac(tich(k, [0, giu], false), '(' + coSo(giu) + ')(' + coSo(-giu) + ')') + ' = ' + frac(kx, coSo(-giu)) + '$.', 'Vậy $? = ' + coSo(-giu) + '$'],
        loiThuongGap: [{ gt: coSo(giu), giaiThich: '$' + mau3 + ' = (' + coSo(giu) + ')(' + coSo(-giu) + ')$; chia cho $' + coSo(giu) + '$ thì còn lại $' + coSo(-giu) + '$.' }, { gt: mau3, giaiThich: 'Tử đã chia cho $' + coSo(giu) + '$ thì mẫu cũng phải chia cho $' + coSo(giu) + '$.' }]
      };
    } },

    { ten: 'Rút gọn phân thức (đơn thức)', muc: 1, sinh: function (r, cc) {
      var g = r.so(2, 6), t = r.so(1, 5), m = r.so(1, 7);
      while (cc.ucln(t, m) !== 1 || (t === 1 && m === 1)) { t = r.so(1, 5); m = r.so(1, 7); }
      var ngang = { x: r.so(1, 3), y: r.so(0, 2) }, du = { x: r.so(1, 3), y: r.so(1, 3) }, xTu = r.dau() > 0, am = r.dau() < 0 && r.dau() < 0;
      // biến x dư ở tử (hoặc mẫu), y dư ở chỗ còn lại
      var tuE = { x: ngang.x + (xTu ? du.x : 0), y: ngang.y + (xTu ? 0 : du.y) }, mauE = { x: ngang.x + (xTu ? 0 : du.x), y: ngang.y + (xTu ? du.y : 0) };
      var tuS = (am ? '-' : '') + don(g * t, tuE.x, tuE.y), mauS = don(g * m, mauE.x, mauE.y);
      var kTu = don(t, xTu ? du.x : 0, xTu ? 0 : du.y), kMau = don(m, xTu ? 0 : du.x, xTu ? du.y : 0);
      var kq = (am ? '-' : '') + (kMau === '1' ? kTu : '(' + kTu + ')/(' + kMau + ')'), kqTex = (am ? '-' : '') + (kMau === '1' ? kTu : frac(kTu, kMau));
      var chung = don(g, ngang.x, ngang.y);
      var sai = (am ? '-' : '') + '(' + don(t, du.x, du.y) + ')/(' + m + ')';
      return {
        de: 'Rút gọn phân thức $' + frac(tuS, mauS) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'rutGon' },
        goiY: ['Tìm nhân tử chung của tử và mẫu: ƯCLN của hệ số và lũy thừa nhỏ nhất của từng biến.', 'Nhân tử chung là $' + chung + '$. Chia cả tử và mẫu cho nó.'],
        loiGiai: ['Nhân tử chung: $' + chung + '$.',
          '$' + frac(tuS, mauS) + ' = ' + frac((am ? '-' : '') + chung + '\\cdot ' + kTu, chung + '\\cdot ' + kMau) + '$',
          '$= ' + kqTex + '$'],
        loiThuongGap: [{ gt: sai, giaiThich: 'Lũy thừa nào lớn hơn ở **mẫu** thì phần còn lại nằm ở **mẫu**: ví dụ $\\frac{y^2}{y^5} = \\frac{1}{y^3}$, không phải $y^3$.' }]
      };
    } },

    { ten: 'Rút gọn phân thức (phân tích thành nhân tử)', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-6, 6), loai = r.so(0, 4), k1 = r.so(1, 5), k2 = r.so(2, 6), F;
      if (loai === 0) F = { k: k1, m: 1, n: [a], d: [a, -a] };
      else if (loai === 1) F = { k: 1, m: k2, n: [0, a], d: [a] };
      else if (loai === 2) F = { k: 1, m: 1, n: [a, a], d: [a, -a] };
      else if (loai === 3) F = { k: k1, m: k2, n: [0, a], d: [a, a] };
      else F = { k: 1, m: k2, n: [a, -a], d: [0, a] };
      if (r.dau() < 0) F = { k: F.m, m: F.k, n: F.d, d: F.n }; // đảo tử – mẫu cho đa dạng
      var N = trienKhai(F.k, F.n), D = trienKhai(F.m, F.d), G = gon(cc, F), kq = vietPT(G);
      var chung = F.n.filter(function (x) { return F.d.indexOf(x) >= 0; })[0];
      var de = frac(vietDT(cc, N), vietDT(cc, D)), nt = frac(tich(F.k, F.n, true), tich(F.m, F.d, true));
      var ltg = [], dung = hamPT(G);
      if (N.length === D.length && N.length > 2 && N[N.length - 1] === D[D.length - 1]) {
        var N2 = N.slice(0, -1), D2 = D.slice(0, -1);
        if (D2.some(function (c) { return c; }) && !trung(hamDT(N2, D2), dung)) ltg.push({ gt: '(' + vietDT(cc, N2) + ')/(' + vietDT(cc, D2) + ')', giaiThich: 'Không được "gạch" hạng tử $x^2$ ở tử và mẫu! Phải phân tích tử và mẫu thành **nhân tử** rồi chia cho nhân tử chung.' });
      }
      if (G.d.indexOf(-chung) >= 0 && F.d.indexOf(-chung) >= 0 && G.n.indexOf(chung) < 0) {
        var W = { k: G.k, m: G.m, n: G.n, d: G.d.map(function (x) { return x === -chung ? chung : x; }) };
        if (!trung(hamPT(W), dung)) ltg.push({ gt: vietPT(W).ascii, giaiThich: '$' + vietDT(cc, trienKhai(1, [chung, -chung])) + ' = (' + coSo(chung) + ')(' + coSo(-chung) + ')$. Chia cho nhân tử chung $' + coSo(chung) + '$ thì còn lại $' + coSo(-chung) + '$.' });
      }
      if (G.n.indexOf(-chung) >= 0 && F.n.indexOf(-chung) >= 0 && G.d.indexOf(chung) < 0) {
        var W2 = { k: G.k, m: G.m, n: G.n.map(function (x) { return x === -chung ? chung : x; }), d: G.d };
        if (!trung(hamPT(W2), dung)) ltg.push({ gt: vietPT(W2).ascii, giaiThich: '$' + vietDT(cc, trienKhai(1, [chung, -chung])) + ' = (' + coSo(chung) + ')(' + coSo(-chung) + ')$. Chia cho nhân tử chung $' + coSo(chung) + '$ thì còn lại $' + coSo(-chung) + '$.' });
      }
      return {
        de: 'Rút gọn phân thức $' + de + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Phân tích tử và mẫu thành nhân tử (đặt nhân tử chung, hằng đẳng thức).', 'Tử và mẫu có nhân tử chung $' + coSo(chung) + '$. Chia cả tử và mẫu cho nó' + (cc.ucln(F.k, F.m) > 1 ? ' và cho $' + cc.ucln(F.k, F.m) + '$' : '') + '.'],
        loiGiai: ['$' + de + ' = ' + nt + '$', '$= ' + kq.tex + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Đổi dấu rồi rút gọn', muc: 2, sinh: function (r, cc) {
      var a = r.so(1, 7);
      var amx = cc.daThuc([[a, ''], [-1, 'x']]); // a − x
      if (r.dau() > 0) {
        var k = r.so(1, 6), tuTruoc = r.dau() > 0;
        var tu = tuTruoc ? vietDT(cc, trienKhai(k, [a])) : cc.daThuc([[k * a, ''], [-k, 'x']]), mau = tuTruoc ? amx : coSo(a);
        return {
          de: 'Rút gọn phân thức $' + frac(tu, mau) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: String(-k), dang: 'rutGon' },
          goiY: ['Đặt nhân tử chung ở tử: $' + tu + ' = ' + (tuTruoc ? tich(k, [a], false) : k === 1 ? amx : k + '(' + amx + ')') + '$.', 'Đổi dấu: $' + amx + ' = -(' + coSo(a) + ')$.'],
          loiGiai: [tuTruoc ? '$' + frac(tu, mau) + ' = ' + frac(tich(k, [a], false), '-(' + coSo(a) + ')') + '$'
            : '$' + frac(tu, mau) + ' = ' + frac('-' + tich(k, [a], false), coSo(a)) + '$', '$= ' + (-k) + '$'],
          loiThuongGap: [{ gt: String(k), giaiThich: '$' + amx + ' = -(' + coSo(a) + ')$: hai biểu thức đối nhau, khi gạch phải để lại dấu trừ.' }]
        };
      }
      var p = r.so(2, 9), q = r.so(2, 9), e1 = r.so(0, 2), e2 = r.so(0, 2), f = r.so(1, 2);
      if (e1 === 0 && e2 === 0) e1 = 1;
      var x1 = [], x2 = [], i;
      for (i = 0; i < e1; i++) x1.push(0);
      for (i = 0; i < e2; i++) x2.push(0);
      var ff = []; for (i = 0; i < f; i++) ff.push(a);
      var F = { k: -p, m: q, n: x1.concat([a]), d: x2.concat(ff) }, G = gon(cc, F), kq = vietPT(G);
      var tuS = (p === 1 ? '' : p) + tich(1, x1, false).replace(/^1$/, '') + '(' + amx + ')', mauS = tich(q, x2.concat(ff), false);
      var sai = vietPT({ k: -G.k, m: G.m, n: G.n, d: G.d });
      return {
        de: 'Rút gọn phân thức $' + frac(tuS, mauS) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Đổi dấu: $' + amx + ' = -(' + coSo(a) + ')$ để tử và mẫu có nhân tử chung.', 'Chia cả tử và mẫu cho nhân tử chung (cả phần số và phần biến). Đừng quên dấu trừ!'],
        loiGiai: ['$' + frac(tuS, mauS) + ' = ' + frac('-' + tich(p, x1.concat([a]), false), mauS) + '$', '$= ' + kq.tex + '$'],
        loiThuongGap: [{ gt: sai.ascii, giaiThich: '$' + amx + ' = -(' + coSo(a) + ')$: khi đổi $' + amx + '$ thành $' + coSo(a) + '$ phải thêm dấu trừ.' }]
      };
    } },

    { ten: 'Quy đồng mẫu thức', muc: 2, sinh: function (r, cc) {
      var a = r.so(1, 6), loai = r.so(0, 3), A, B;
      if (loai === 0) { A = { k: 1, ng: [a, -a] }; B = { k: 1, ng: [0, -a] }; }
      else if (loai === 1) { A = { k: r.so(2, 5), ng: [-a] }; B = { k: 1, ng: [a, -a] }; }
      else if (loai === 2) { A = { k: 1, ng: [a, a] }; B = { k: r.chon([1, 2, 3]), ng: [0, a] }; }
      else { A = { k: r.so(2, 4), ng: [0, 0] }; B = { k: r.so(2, 6), ng: [0, a] }; }
      if (r.dau() < 0) { var t = A; A = B; B = t; }
      var c1 = r.khac0(-5, 5), c2 = r.khac0(-5, 5);
      while (cc.ucln(c1, A.k) > 1) c1 = r.khac0(-5, 5);
      while (cc.ucln(c2, B.k) > 1) c2 = r.khac0(-5, 5);
      var L = lcm(cc, A.k, B.k), mtc = hopNghiem(A.ng, B.ng), mtcS = tich(L, mtc, true);
      var phu1 = { k: L / A.k, ng: bot(mtc, A.ng) }, phu2 = { k: L / B.k, ng: bot(mtc, B.ng) };
      var tu1 = tichD(c1 * phu1.k, phu1.ng), tu2 = tichD(c2 * phu2.k, phu2.ng);
      var D1 = vietDT(cc, trienKhai(A.k, A.ng)), D2 = vietDT(cc, trienKhai(B.k, B.ng));
      var ltgM = [], tichMau = function (x) { return giaTri(trienKhai(A.k, A.ng), x) * giaTri(trienKhai(B.k, B.ng), x); };
      if (!trung(tichMau, hamPT({ k: L, m: 1, n: mtc, d: [] }))) ltgM.push({ gt: '(' + D1 + ')(' + D2 + ')', giaiThich: 'Em nhân hai mẫu với nhau. Mẫu chung **gọn nhất**: mỗi nhân tử chỉ lấy một lần với số mũ cao nhất.' });
      var tichP = function (P) { return tich(P.k, P.ng, true); };
      var pt1 = D1 === tich(A.k, A.ng, true) ? D1 : D1 + ' = ' + tich(A.k, A.ng, true), pt2 = D2 === tich(B.k, B.ng, true) ? D2 : D2 + ' = ' + tich(B.k, B.ng, true);
      return {
        de: 'Quy đồng mẫu thức hai phân thức $' + frac(c1, D1) + '$ và $' + frac(c2, D2) + '$. Điền mẫu thức chung (gọn nhất) và tử mới của từng phân thức.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Mẫu thức chung', kieu: 'bieuThuc', gt: mtcS, loiThuongGap: ltgM },
          { nhan: 'Tử mới của phân thức thứ nhất', kieu: 'bieuThuc', gt: tu1, loiThuongGap: quenPhu(c1, phu1) },
          { nhan: 'Tử mới của phân thức thứ hai', kieu: 'bieuThuc', gt: tu2, loiThuongGap: quenPhu(c2, phu2) }] },
        goiY: ['Phân tích các mẫu thành nhân tử: $' + pt1 + '$; $\\;' + pt2 + '$.',
          'Mẫu chung: lấy BCNN của các hệ số và mỗi nhân tử với số mũ cao nhất. Nhân tử phụ = mẫu chung : mẫu riêng.'],
        loiGiai: ['$' + pt1 + '$; $\\;' + pt2 + '$.',
          'MTC $= ' + mtcS + '$. Nhân tử phụ: $' + tichP(phu1) + '$ và $' + tichP(phu2) + '$.',
          '$' + frac(c1, D1) + ' = ' + frac(tu1, mtcS) + '$; $\\;' + frac(c2, D2) + ' = ' + frac(tu2, mtcS) + '$.']
      };
    } },

    { ten: 'Rút gọn rồi tính giá trị', muc: 3, sinh: function (r, cc) {
      var a = r.so(1, 9), loai = r.so(0, 2), F, x0;
      if (loai === 0) { F = { k: 1, m: 1, n: [0, a, -a], d: [-a, -a] }; x0 = 100 - a; }
      else if (loai === 1) { F = { k: 1, m: 1, n: [a, -a], d: [0, -a] }; x0 = r.chon([20, 25, 50, 100]); }
      else { var k = r.so(2, 5); F = { k: 1, m: k, n: [a, a], d: [a] }; x0 = a + k * r.so(5, 30); }
      var N = trienKhai(F.k, F.n), D = trienKhai(F.m, F.d), G = gon(cc, F), kq = vietPT(G);
      var dk = F.d.filter(function (x, i) { return F.d.indexOf(x) === i; });
      var tuG = G.k, mauG = G.m;
      G.n.forEach(function (x) { tuG *= x0 - x; });
      G.d.forEach(function (x) { mauG *= x0 - x; });
      var v = cc.phanSo(tuG, mauG), thayS = vietPT(G).tex.replace(/x/g, '{' + x0 + '}');
      var de = frac(vietDT(cc, N), vietDT(cc, D));
      return {
        de: 'Cho phân thức $P = ' + de + '$.\n\na) Tìm các giá trị của $x$ làm $P$ không xác định.\n\nb) Rút gọn $P$.\n\nc) Tính nhanh giá trị của $P$ tại $x = ' + x0 + '$ (dùng kết quả câu b).',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $P$ không xác định khi $x =$', kieu: 'nghiem', gt: dk },
          { nhan: 'b) $P$ rút gọn', kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
          { nhan: 'c) Giá trị tại $x = ' + x0 + '$', kieu: 'so', gt: v.ascii }] },
        goiY: ['Phân tích mẫu (và tử) thành nhân tử: $P = ' + frac(tich(F.k, F.n, true), tich(F.m, F.d, true)) + '$.', 'Câu a: cho mẫu bằng $0$. Câu c: thay $x = ' + x0 + '$ vào phân thức đã rút gọn.'],
        loiGiai: ['a) $P = ' + frac(tich(F.k, F.n, true), tich(F.m, F.d, true)) + '$; mẫu bằng $0$ khi ' + dk.map(function (x) { return '$x = ' + x + '$'; }).join(' hoặc ') + '.',
          'b) $P = ' + kq.tex + '$ (với điều kiện xác định).',
          'c) Tại $x = ' + x0 + '$: $P = ' + thayS + (mauG === 1 || v.tex === frac(tuG, mauG) ? '' : ' = ' + frac(tuG, mauG)) + ' = ' + v.tex + '$']
      };
    } }
  ]);
})();
