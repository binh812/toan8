// Luyện thêm – Bài 23: Phép cộng và phép trừ phân thức đại số
(function () {
  'use strict';

  // ---- Đa thức theo x: mảng hệ số từ bậc 0 lên; nhân tử (x − r) ghi bằng nghiệm r ----
  function nhanDT(p, q) {
    var o = [];
    for (var i = 0; i < p.length + q.length - 1; i++) o.push(0);
    p.forEach(function (a, i) { q.forEach(function (b, j) { o[i + j] += a * b; }); });
    return o;
  }
  function congDT(p, q, s) { // p + s·q
    var o = [];
    for (var i = 0; i < Math.max(p.length, q.length); i++) o.push((p[i] || 0) + s * (q[i] || 0));
    while (o.length > 1 && !o[o.length - 1]) o.pop();
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
  var DIEM = [0.37, 1.73, -2.41, 3.19, -0.83];
  function trung(f, g) {
    return DIEM.every(function (x) { var a = f(x), b = g(x); return !isFinite(a) || !isFinite(b) || Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a)); });
  }
  function hamDT(N, D) { return function (x) { return giaTri(N, x) / giaTri(D, x); }; }
  function ndChung(cc, p) { return p.reduce(function (g, a) { return a ? cc.ucln(g, a) : g; }, 0) || 1; }
  function ngoac(s) { return s.indexOf('+') < 0 && s.indexOf('-') < 0 ? s : '(' + s + ')'; } // đơn thức không cần ngoặc
  function heSoNT(k, q) { return (k === 1 ? '' : k === -1 ? '-' : String(k)) + (q === 0 ? 'x' : '(' + coSo(q) + ')'); }
  function don(c, ex, ey) {
    var s = c !== 1 || (!ex && !ey) ? String(c) : '';
    if (ex) s += ex === 1 ? 'x' : 'x^' + ex;
    if (ey) s += ey === 1 ? 'y' : 'y^' + ey;
    return s;
  }
  function lcm(cc, a, b) { return a / cc.ucln(a, b) * b; }
  // Phân thức N/D (mảng hệ số) → chia cho ƯCLN các hệ số; mẫu hệ số đầu dương
  function rutSo(cc, N, D) {
    var g = cc.ucln(ndChung(cc, N), ndChung(cc, D));
    if (D[D.length - 1] < 0) g = -g;
    return { N: N.map(function (a) { return a / g; }), D: D.map(function (a) { return a / g; }) };
  }
  function vietND(cc, N, D) {
    if (D.length === 1 && D[0] === 1) return { ascii: vietDT(cc, N), tex: vietDT(cc, N) };
    return { ascii: '(' + vietDT(cc, N) + ')/(' + vietDT(cc, D) + ')', tex: frac(vietDT(cc, N), vietDT(cc, D)) };
  }

  TOAN8.luyen(23, [
    { ten: 'Cộng, trừ hai phân thức cùng mẫu', muc: 1, sinh: function (r, cc) {
      var loaiM = r.so(0, 2), m = r.khac0(-6, 6), Mng, Mk = 1;
      if (loaiM === 0) Mng = [m];
      else if (loaiM === 1) { Mng = [0]; Mk = r.so(2, 5); }
      else { m = r.so(1, 6); Mng = [m, -m]; }
      var M = trienKhai(Mk, Mng), s = r.dau(), S, lan = 0;
      var goc = r.chon(Mng), rutDuoc = r.dau() > 0;
      if (rutDuoc) S = trienKhai(r.khac0(-4, 4), [goc]);
      else {
        do { S = [r.khac0(-7, 7), r.khac0(-4, 4)]; } while (Mng.some(function (x) { return giaTri(S, x) === 0; }) && ++lan < 30);
        if (Mng.some(function (x) { return giaTri(S, x) === 0; })) { rutDuoc = true; S = trienKhai(1, [goc]); }
      }
      var N1 = [r.so(-7, 7), r.khac0(-5, 5)], N2 = congDT(S, N1, -1).map(function (a) { return s * a; });
      if (N2.every(function (a) { return !a; })) { N1 = [N1[0] + 1, N1[1]]; N2 = congDT(S, N1, -1).map(function (a) { return s * a; }); }
      var dau = s > 0 ? '+' : '-', Ms = vietDT(cc, M), n1 = vietDT(cc, N1), n2 = vietDT(cc, N2), Ss = vietDT(cc, S);
      var kq, buoc;
      if (rutDuoc) {
        var k = S[S.length - 1], con = Mng.slice(); con.splice(con.indexOf(goc), 1);
        var g = cc.ucln(k, Mk), kk = k / g, mm = Mk / g;
        kq = !con.length && mm === 1 ? { ascii: String(kk), tex: String(kk) } : { ascii: '(' + kk + ')/(' + tich(mm, con, true) + ')', tex: (kk < 0 ? '-' : '') + frac(Math.abs(kk), tich(mm, con, true)) };
        buoc = '$= ' + frac(tich(Math.abs(k), [goc], false).replace(/^/, k < 0 ? '-' : ''), tich(Mk, Mng, true)) + ' = ' + kq.tex + '$';
      } else {
        var R = rutSo(cc, S, M); kq = vietND(cc, R.N, R.D);
        buoc = kq.tex === frac(Ss, Ms) ? null : '$= ' + kq.tex + '$';
      }
      var ltg = [];
      if (s > 0) ltg.push({ gt: '(' + Ss + ')/(2(' + Ms + '))', giaiThich: 'Cùng mẫu thì **giữ nguyên** mẫu, chỉ cộng các tử. Không cộng mẫu với mẫu.' });
      else if (N2[0]) {
        var sai = congDT(N1, [N2[0], -N2[1] || 0], 1);
        if (!trung(hamDT(sai, M), hamDT(S, M))) ltg.push({ gt: '(' + vietDT(cc, sai) + ')/(' + Ms + ')', giaiThich: 'Em quên đổi dấu **cả** hạng tử $' + (N2[0] > 0 ? '+' : '') + N2[0] + '$: trừ một đa thức thì đặt nó trong ngoặc, $-(' + n2 + ')$ đổi dấu mọi hạng tử.' });
      }
      var deS = frac(n1, Ms) + ' ' + dau + ' ' + frac(n2, Ms);
      return {
        de: 'Tính và rút gọn: $' + deS + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Hai phân thức cùng mẫu: ' + (s > 0 ? 'cộng' : 'trừ') + ' các tử, giữ nguyên mẫu.' + (s < 0 ? ' Tử thứ hai đặt trong ngoặc.' : ''), 'Thu gọn tử rồi xem tử và mẫu có nhân tử chung không.'],
        loiGiai: ['$' + deS + ' = ' + frac(n1 + ' ' + dau + ' ' + ngoac(n2), Ms) + ' = ' + frac(Ss, Ms) + '$'].concat(buoc ? [buoc] : []),
        loiThuongGap: ltg
      };
    } },

    { ten: 'Hai mẫu đối nhau', muc: 2, sinh: function (r, cc) {
      var a = r.so(1, 7), amx = cc.daThuc([[a, ''], [-1, 'x']]), s, N1, N2;
      if (r.dau() > 0) { s = 1; N1 = [0, 0, 1]; N2 = [a * a]; } // x²/(x−a) + a²/(a−x) = x + a
      else {
        s = r.dau();
        var S0 = r.dau() > 0 ? trienKhai(r.khac0(-4, 4), [a]) : [r.khac0(-7, 7), r.khac0(-3, 3)];
        N1 = [r.so(-6, 6), r.khac0(-4, 4)];
        N2 = congDT(N1, S0, -1).map(function (c) { return s * c; }); // N1 − s·N2 = S0
        if (N2.every(function (c) { return !c; })) { N1 = [N1[0] + 1, N1[1]]; N2 = congDT(N1, S0, -1).map(function (c) { return s * c; }); }
      }
      var dau = s > 0 ? '+' : '-', S = congDT(N1, N2, -s);
      var n1 = vietDT(cc, N1), n2 = vietDT(cc, N2), Ss = vietDT(cc, S), kq, buoc;
      if (giaTri(S, a) === 0) { // S = (x − a)·thương
        var thuong = S.length === 3 ? [S[0] / -a, 1] : [S[1]];
        kq = vietDT(cc, thuong);
        buoc = '$= ' + frac((thuong.length > 1 ? '(' + kq + ')' : kq) + '(' + coSo(a) + ')', coSo(a)) + ' = ' + kq + '$';
      } else {
        var R = rutSo(cc, S, [-a, 1]); kq = vietND(cc, R.N, R.D).ascii;
        buoc = '$= ' + vietND(cc, R.N, R.D).tex + '$';
      }
      var sai = congDT(N1, N2, s), ltg = [];
      if (!trung(hamDT(sai, [-a, 1]), hamDT(S, [-a, 1]))) ltg.push({ gt: '(' + vietDT(cc, sai) + ')/(' + coSo(a) + ')', giaiThich: 'Mẫu $' + amx + '$ và $' + coSo(a) + '$ **đối nhau**: phải đổi dấu $' + frac(n2, amx) + ' = ' + frac('-' + ngoac(n2), coSo(a)) + '$, rồi mới ' + (s > 0 ? 'cộng' : 'trừ') + '.' });
      var deS = frac(n1, coSo(a)) + ' ' + dau + ' ' + frac(n2, amx);
      return {
        de: 'Tính và rút gọn: $' + deS + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'rutGon' },
        goiY: ['Mẫu $' + amx + ' = -(' + coSo(a) + ')$. Đổi dấu phân thức thứ hai để có cùng mẫu $' + coSo(a) + '$.', 'Cùng mẫu rồi thì cộng (trừ) các tử, sau đó rút gọn.'],
        loiGiai: ['$' + frac(n2, amx) + ' = ' + frac('-' + ngoac(n2), coSo(a)) + '$, nên biểu thức bằng $' + frac(n1 + ' ' + (s > 0 ? '-' : '+') + ' ' + ngoac(n2), coSo(a)) + ' = ' + frac(Ss, coSo(a)) + '$.', buoc],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Cộng, trừ hai phân thức khác mẫu', muc: 2, sinh: function (r, cc) {
      var s = r.dau(), dau = s > 0 ? '+' : '-';
      if (r.dau() > 0) {
        // a/(x − p) ± b/(x − q)
        var p = r.so(-5, 5), q = r.so(-5, 5), a = r.khac0(-5, 5), b = r.so(1, 5);
        while (q === p) q = r.so(-5, 5);
        var N = congDT(trienKhai(a, [q]), trienKhai(b, [p]), s), D = trienKhai(1, [p, q]);
        var R = rutSo(cc, N, D), kq = { ascii: '(' + vietDT(cc, R.N) + ')/(' + tich(R.D[R.D.length - 1], [p, q], true) + ')', tex: frac(vietDT(cc, R.N), tich(R.D[R.D.length - 1], [p, q], true)) };
        var ltg = [];
        if (s > 0) ltg.push({ gt: '(' + (a + b) + ')/(' + vietDT(cc, congDT([-p, 1], [-q, 1], 1)) + ')', giaiThich: 'Không được cộng tử với tử, mẫu với mẫu! Phải **quy đồng** mẫu thức trước.' });
        else if (p !== 0) {
          var sai = congDT(trienKhai(a, [q]), [b * p, b], -1);
          if (!trung(hamDT(sai, D), hamDT(N, D))) ltg.push({ gt: '(' + vietDT(cc, sai) + ')/(' + tich(1, [p, q], true) + ')', giaiThich: 'Quên đổi dấu: $-' + b + '(' + coSo(p) + ') = ' + vietDT(cc, trienKhai(-b, [p])) + '$ (đổi dấu **cả hai** hạng tử).' });
        }
        var deS = frac(a, coSo(p)) + ' ' + dau + ' ' + frac(b, coSo(q)), mtc = tich(1, [p, q], true);
        return {
          de: 'Tính: $' + deS + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
          goiY: ['Mẫu thức chung: $' + mtc + '$.', 'Nhân tử phụ của phân thức thứ nhất là $' + coSo(q) + '$, của phân thức thứ hai là $' + coSo(p) + '$.'],
          loiGiai: ['$' + deS + ' = ' + frac(heSoNT(a, q) + ' ' + dau + ' ' + heSoNT(b, p), mtc) + '$',
            '$= ' + frac(vietDT(cc, trienKhai(a, [q])) + ' ' + dau + ' ' + ngoac(vietDT(cc, trienKhai(b, [p]))), mtc) + ' = ' + kq.tex + '$'],
          loiThuongGap: ltg
        };
      }
      // c1/(k1 xᵖ y^q) ± c2/(k2 x^u y^v)
      var c1 = r.so(1, 5), c2 = r.so(1, 5), k1 = r.chon([1, 2, 3, 4, 6]), k2 = r.chon([1, 2, 3, 4, 6]);
      while (cc.ucln(c1, k1) > 1) c1 = r.so(1, 5);
      while (cc.ucln(c2, k2) > 1) c2 = r.so(1, 5);
      var e = [r.so(1, 3), r.so(0, 2), r.so(0, 2), r.so(1, 3)];
      if (e[0] === e[2] && e[1] === e[3]) e[3]++;
      var L = lcm(cc, k1, k2), mx = Math.max(e[0], e[2]), my = Math.max(e[1], e[3]);
      var A = c1 * L / k1, B = c2 * L / k2, g = cc.ucln(cc.ucln(A, B), L);
      var mA = don(1, mx - e[0], my - e[1]), mB = don(1, mx - e[2], my - e[3]);
      var tuS = cc.daThuc([[A / g, mA === '1' ? '' : mA], [s * B / g, mB === '1' ? '' : mB]]), mauS = don(L / g, mx, my);
      var tuGoc = cc.daThuc([[A, mA === '1' ? '' : mA], [s * B, mB === '1' ? '' : mB]]), mauGoc = don(L, mx, my);
      var d1 = don(k1, e[0], e[1]), d2 = don(k2, e[2], e[3]), deS2 = frac(c1, d1) + ' ' + dau + ' ' + frac(c2, d2);
      return {
        de: 'Tính: $' + deS2 + '$.',
        dapAn: { kieu: 'bieuThuc', gt: '(' + tuS + ')/(' + mauS + ')', dang: 'rutGon' },
        goiY: ['Mẫu thức chung: BCNN của hệ số là $' + L + '$, mỗi biến lấy số mũ cao nhất: MTC $= ' + mauGoc + '$.', 'Nhân tử phụ: $' + don(L / k1, mx - e[0], my - e[1]) + '$ và $' + don(L / k2, mx - e[2], my - e[3]) + '$.'],
        loiGiai: ['MTC $= ' + mauGoc + '$.', '$' + deS2 + ' = ' + frac(tuGoc, mauGoc) + '$'].concat(g > 1 ? ['$= ' + frac(tuS, mauS) + '$'] : []),
        loiThuongGap: c1 + s * c2 ? [{ gt: '(' + (c1 + s * c2) + ')/(' + cc.daThuc([[k1, d1.replace(/^[0-9]+/, '')], [s * k2, d2.replace(/^[0-9]+/, '')]]) + ')', giaiThich: 'Không được ' + (s > 0 ? 'cộng' : 'trừ') + ' tử với tử, mẫu với mẫu! Phải **quy đồng** mẫu thức trước.' }] : []
      };
    } },

    { ten: 'Cộng, trừ rồi rút gọn (mẫu có nhân tử chung)', muc: 3, sinh: function (r, cc) {
      var loai = r.so(0, 2), a = r.so(1, 5), de, kq, lg, ltg = [], dung;
      if (loai === 0) {
        var k = r.so(1, 5), s = r.dau(); // k/(x − s·a) − s·2ka/(x² − a²) = k/(x + s·a)
        var ra = s * a, mau2 = vietDT(cc, trienKhai(1, [a, -a]));
        de = frac(k, coSo(ra)) + ' ' + (s > 0 ? '-' : '+') + ' ' + frac(2 * k * a, mau2);
        kq = { ascii: k + '/(' + coSo(-ra) + ')', tex: frac(k, coSo(-ra)) };
        lg = ['$' + mau2 + ' = (' + coSo(ra) + ')(' + coSo(-ra) + ')$; MTC $= ' + mau2 + '$.',
          '$' + de + ' = ' + frac(heSoNT(k, -ra) + ' ' + (s > 0 ? '-' : '+') + ' ' + 2 * k * a, '(' + coSo(ra) + ')(' + coSo(-ra) + ')') + ' = ' + frac(vietDT(cc, trienKhai(k, [ra])), '(' + coSo(ra) + ')(' + coSo(-ra) + ')') + '$',
          '$= ' + frac(tich(k, [ra], k === 1), '(' + coSo(ra) + ')(' + coSo(-ra) + ')') + ' = ' + kq.tex + '$'];
        dung = function (x) { return k / (x + ra); };
        var saiK = k - s * 2 * k * a;
        ltg.push({ gt: '(' + saiK + ')/(' + mau2 + ')', giaiThich: 'Em quên nhân tử $' + k + '$ với nhân tử phụ $' + coSo(-ra) + '$. Quy đồng thì **tử và mẫu** cùng nhân với nhân tử phụ.' });
      } else if (loai === 1) {
        // 1/(x(x+a)) + 1/((x+a)(x+2a)) = 2/(x(x+2a))
        de = frac(1, 'x(' + coSo(-a) + ')') + ' + ' + frac(1, '(' + coSo(-a) + ')(' + coSo(-2 * a) + ')');
        kq = { ascii: '2/(x(' + coSo(-2 * a) + '))', tex: frac(2, 'x(' + coSo(-2 * a) + ')') };
        var mtc = 'x(' + coSo(-a) + ')(' + coSo(-2 * a) + ')';
        lg = ['MTC $= ' + mtc + '$. Nhân tử phụ: $' + coSo(-2 * a) + '$ và $x$.',
          '$' + de + ' = ' + frac('(' + coSo(-2 * a) + ') + x', mtc) + ' = ' + frac('2x + ' + 2 * a, mtc) + '$',
          '$= ' + frac('2(' + coSo(-a) + ')', mtc) + ' = ' + kq.tex + '$'];
        dung = function (x) { return 2 / (x * (x + 2 * a)); };
        ltg.push({ gt: '1/(x(' + coSo(-2 * a) + '))', giaiThich: 'Tử là $(x + ' + 2 * a + ') + x = 2x + ' + 2 * a + ' = 2(x + ' + a + ')$; sau khi rút gọn tử còn $2$, không phải $1$.' });
      } else {
        // x/(x − a) + a/(x + a) − 2a²/(x² − a²) = (x + 3a)/(x + a)
        var m2 = vietDT(cc, trienKhai(1, [a, -a])), mtc2 = '(' + coSo(a) + ')(' + coSo(-a) + ')';
        de = frac('x', coSo(a)) + ' + ' + frac(a, coSo(-a)) + ' - ' + frac(2 * a * a, m2);
        kq = { ascii: '(' + coSo(-3 * a) + ')/(' + coSo(-a) + ')', tex: frac(coSo(-3 * a), coSo(-a)) };
        lg = ['MTC $= ' + m2 + ' = ' + mtc2 + '$.',
          '$' + de + ' = ' + frac('x(' + coSo(-a) + ') + ' + a + '(' + coSo(a) + ') - ' + 2 * a * a, mtc2) + '$',
          '$= ' + frac(vietDT(cc, [-3 * a * a, 2 * a, 1]), mtc2) + ' = ' + frac('(' + coSo(a) + ')(' + coSo(-3 * a) + ')', mtc2) + ' = ' + kq.tex + '$'];
        dung = function (x) { return (x + 3 * a) / (x + a); };
        var saiN = [-3 * a * a, 1 + a]; // quên nhân x với (x + a): x + a(x − a) − 2a²
        if (!trung(hamDT(saiN, trienKhai(1, [a, -a])), dung)) ltg.push({ gt: '(' + vietDT(cc, saiN) + ')/(' + m2 + ')', giaiThich: 'Em quên nhân tử $x$ với nhân tử phụ $' + coSo(-a) + '$. Quy đồng thì tử của **mọi** phân thức đều nhân với nhân tử phụ của nó.' });
      }
      return {
        de: 'Tính và rút gọn: $' + de + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq.ascii, dang: 'rutGon' },
        goiY: ['Phân tích các mẫu thành nhân tử để tìm mẫu thức chung **gọn nhất**.', 'Quy đồng, cộng (trừ) các tử, rồi phân tích tử thành nhân tử để rút gọn.'],
        loiGiai: lg,
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế (tổng thời gian)', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var v, x0, S, lan = 0;
        do { v = r.so(10, 20); x0 = r.so(1, 4); S = lcm(cc, v + x0, v - x0); } while (S > 72 && ++lan < 80);
        if (S > 72) { v = 14; x0 = 2; S = 48; }
        var t = S / (v + x0) + S / (v - x0), tau = r.chon(['Một tàu du lịch', 'Một ca nô', 'Một chiếc thuyền máy']);
        var tu = 2 * S * v, mau = cc.daThuc([[v * v, ''], [-1, 'x^2']]);
        return {
          de: tau + ' chạy xuôi dòng $' + S + '$ km rồi quay ngược lại về chỗ cũ. Vận tốc khi nước yên lặng là $' + v + '$ km/h, vận tốc dòng nước là $x$ (km/h).\n\na) Viết **một phân thức** (đã thu gọn) biểu thị tổng thời gian chạy (giờ).\n\nb) Tính tổng thời gian đó khi $x = ' + x0 + '$.',
          dapAn: { kieu: 'nhieuO', o: [
            { nhan: 'a) Tổng thời gian (giờ)', kieu: 'bieuThuc', gt: tu + '/(' + mau + ')', dang: 'rutGon',
              loiThuongGap: [{ gt: (2 * S) + '/' + (2 * v), giaiThich: 'Không cộng tử với tử, mẫu với mẫu. Quy đồng với MTC $(' + v + ' + x)(' + v + ' - x)$.' }] },
            { nhan: 'b) Khi $x = ' + x0 + '$ (giờ)', kieu: 'so', gt: t,
              loiThuongGap: [{ gt: cc.phanSo(2 * S, v).ascii, giaiThich: 'Em quên vận tốc dòng nước: xuôi dòng $' + v + ' + ' + x0 + '$, ngược dòng $' + v + ' - ' + x0 + '$ km/h.' }] }] },
          goiY: ['Vận tốc xuôi dòng $' + v + ' + x$, ngược dòng $' + v + ' - x$. Thời gian: $' + frac(S, v + ' + x') + '$ và $' + frac(S, v + ' - x') + '$.', 'Quy đồng: MTC $= (' + v + ' + x)(' + v + ' - x) = ' + mau + '$.'],
          loiGiai: ['a) $' + frac(S, v + '+x') + ' + ' + frac(S, v + '-x') + ' = ' + frac(S + '(' + v + '-x) + ' + S + '(' + v + '+x)', '(' + v + '+x)(' + v + '-x)') + ' = ' + frac(tu, mau) + '$ (giờ).',
            'b) $' + frac(S, v + x0) + ' + ' + frac(S, v - x0) + ' = ' + cc.so(S / (v + x0)) + ' + ' + cc.so(S / (v - x0)) + ' = ' + cc.so(t) + '$ (giờ).']
        };
      }
      var x1 = r.chon([30, 40, 50, 60]), d = r.chon([10, 20, 30, 40]), t1 = r.chon([0.5, 1, 1.5]), t2 = r.chon([0.5, 1, 1.5, 2]);
      var a = x1 * t1, b = (x1 + d) * t2, ten = r.chon(['Chú Đức', 'Bác Hùng', 'Cô Lan', 'Anh Nam']);
      var N = [a * d, a + b], D = trienKhai(1, [0, -d]), R = rutSo(cc, N, D);
      return {
        de: ten + ' lái ô tô về quê: $' + a + '$ km đường thành phố với vận tốc $x$ (km/h), rồi $' + b + '$ km đường cao tốc với vận tốc lớn hơn $' + d + '$ km/h.\n\na) Viết **một phân thức** (đã thu gọn) biểu thị tổng thời gian đi (giờ).\n\nb) Tính tổng thời gian khi $x = ' + x1 + '$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Tổng thời gian (giờ)', kieu: 'bieuThuc', gt: '(' + vietDT(cc, R.N) + ')/(' + (R.D[R.D.length - 1] === 1 ? '' : R.D[R.D.length - 1]) + 'x(x+' + d + '))', dang: 'rutGon',
            loiThuongGap: [{ gt: (a + b) + '/(2x+' + d + ')', giaiThich: 'Không cộng tử với tử, mẫu với mẫu. Quy đồng với MTC $x(x + ' + d + ')$.' }] },
          { nhan: 'b) Khi $x = ' + x1 + '$ (giờ)', kieu: 'so', gt: t1 + t2,
            loiThuongGap: [{ gt: (a + b) / x1, giaiThich: 'Trên cao tốc vận tốc là $' + x1 + ' + ' + d + ' = ' + (x1 + d) + '$ km/h, không phải $' + x1 + '$.' }] }] },
        goiY: ['Thời gian = quãng đường : vận tốc: $' + frac(a, 'x') + '$ và $' + frac(b, 'x+' + d) + '$.', 'Quy đồng với MTC $x(x + ' + d + ')$ rồi cộng.'],
        loiGiai: ['a) $' + frac(a, 'x') + ' + ' + frac(b, 'x+' + d) + ' = ' + frac(a + '(x+' + d + ') + ' + b + 'x', 'x(x+' + d + ')') + ' = ' + frac(vietDT(cc, N), 'x(x+' + d + ')') + '$ (giờ).',
          'b) $' + frac(a, x1) + ' + ' + frac(b, x1 + d) + ' = ' + cc.so(t1) + ' + ' + cc.so(t2) + ' = ' + cc.so(t1 + t2) + '$ (giờ).']
      };
    } }
  ]);
})();
