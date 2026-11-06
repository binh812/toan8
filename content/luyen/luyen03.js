// Luyện thêm – Bài 3: Phép cộng và phép trừ đa thức
(function () {
  'use strict';
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  // Hình lời giải theo chính số của đề: mảnh bày sẵn (da), đa thức bị trừ thì lật mọi mảnh (tru)
  // Quá nhiều mảnh thì mảnh bé tí: đề đó không kèm hình
  function hg(da, tru) {
    var o = { da: da }; if (tru) o.tru = tru;
    var ds = (String(da) + (tru ? '+' + tru : '')).match(/[+-]?[^+-]+/g) || [];
    if (ds.reduce(function (s, d) { var m = /^[+-]?([0-9]*)/.exec(d); return s + (m[1] ? +m[1] : 1); }, 0) > 22) return undefined;
    return { widget: 'canh', config: { ten: 'khoiGop', tuyChon: o, chiXem: true, t: 1 } };
  }
  function noi(a, b) { return a + (String(b).charAt(0) === '-' ? '' : '+') + b; }
  function ngoac(v) { return v < 0 ? '(' + v + ')' : String(v); }
  // đa thức = [[hệ số, phần biến], …] theo cùng một thứ tự phần biến
  function cong(A, B, s) {
    var out = A.map(function (h) { return [h[0], h[1]]; });
    B.forEach(function (h) {
      var o = out.filter(function (k) { return k[1] === h[1]; })[0];
      if (o) o[0] += s * h[0]; else out.push([s * h[0], h[1]]);
    });
    return out;
  }
  function soMu(ph, b) { var m = ph.match(new RegExp(b + '(\\^(\\d+))?')); return m ? (m[2] ? +m[2] : 1) : 0; }
  function giaTri(D, x, y) { return D.reduce(function (s, h) { return s + h[0] * Math.pow(x, soMu(h[1], 'x')) * Math.pow(y, soMu(h[1], 'y')); }, 0); }
  function daThuc(r, phan, lon) {
    return phan.map(function (p) { return [r.khac0(-lon, lon), p]; });
  }
  var BO = [['x^2', 'x', ''], ['x^2', 'xy', 'y^2'], ['x^2y', 'xy', ''], ['xy', 'y^2', 'y'], ['x^2', 'xy', '']];

  TOAN8.luyen(3, [
    { ten: 'Cộng hai đa thức', muc: 1, sinh: function (r, cc) {
      var ph = r.chon(BO), A = daThuc(r, ph, 7), B = daThuc(r, ph, 7);
      // tránh tổng có hạng tử bị triệt tiêu hết
      if (A[0][0] + B[0][0] === 0) B[0][0] = -B[0][0];
      var S = cong(A, B, 1), kq = cc.daThuc(S);
      var a = cc.daThuc(A), b = cc.daThuc(B);
      return {
        hinhGiai: hg(noi(a, b)),
        de: 'Tính $(' + tx(cc, a) + ') + (' + tx(cc, b) + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Trước ngoặc có dấu cộng: bỏ ngoặc, **giữ nguyên** dấu các hạng tử.', 'Nhóm các hạng tử đồng dạng rồi cộng hệ số.'],
        loiGiai: ['$= ' + tx(cc, a) + ' ' + (b.charAt(0) === '-' ? '' : '+ ') + tx(cc, b) + '$',
          '$= ' + ph.map(function (p, i) { return '(' + tx(cc, cc.daThuc([[A[i][0], p], [B[i][0], p]])) + ')'; }).join(' + ') + ' = ' + tx(cc, kq) + '$']
      };
    } },

    { ten: 'Trừ hai đa thức', muc: 1, sinh: function (r, cc) {
      var ph = r.chon(BO), A = daThuc(r, ph, 7), B = daThuc(r, ph, 6);
      if (A[0][0] === B[0][0]) A[0][0] += 1;
      if (A[0][0] === 0) A[0][0] = 2;
      var H = cong(A, B, -1), kq = cc.daThuc(H);
      // lỗi: chỉ đổi dấu hạng tử đầu của B
      var Bsai = B.map(function (h, i) { return [i ? -h[0] : h[0], h[1]]; });
      var sai = cc.daThuc(cong(A, Bsai, -1));
      var a = cc.daThuc(A), b = cc.daThuc(B), bDoi = cc.daThuc(B.map(function (h) { return [-h[0], h[1]]; }));
      var ten = r.chon([['P', 'Q'], ['A', 'B'], ['M', 'N']]);
      return {
        hinhGiai: hg(a, b),
        de: 'Cho $' + ten[0] + ' = ' + tx(cc, a) + '$ và $' + ten[1] + ' = ' + tx(cc, b) + '$. Tính $' + ten[0] + ' - ' + ten[1] + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Viết $' + ten[0] + ' - ' + ten[1] + ' = (' + tx(cc, a) + ') - (' + tx(cc, b) + ')$.', 'Trước ngoặc có dấu trừ: bỏ ngoặc và **đổi dấu tất cả** các hạng tử trong ngoặc.'],
        loiGiai: ['$' + ten[0] + ' - ' + ten[1] + ' = (' + tx(cc, a) + ') - (' + tx(cc, b) + ')$',
          '$= ' + tx(cc, a) + ' ' + (bDoi.charAt(0) === '-' ? '' : '+ ') + tx(cc, bDoi) + '$',
          '$= ' + tx(cc, kq) + '$'],
        loiThuongGap: sai !== kq ? [{ gt: sai, giaiThich: 'Khi bỏ ngoặc có dấu trừ phải đổi dấu **tất cả** các hạng tử trong ngoặc, không chỉ hạng tử đầu tiên.' }] : []
      };
    } },

    { ten: 'Tìm đa thức M', muc: 2, sinh: function (r, cc) {
      var ph = r.chon(BO), A = daThuc(r, ph, 6), K = daThuc(r, ph, 7), cong1 = r.dau() > 0;
      if (A[0][0] === K[0][0]) K[0][0] += 1;
      if (K[0][0] === 0) K[0][0] = 3;
      var a = cc.daThuc(A), k = cc.daThuc(K);
      // M + A = K → M = K − A;  M − A = K → M = K + A
      var M = cong(K, A, cong1 ? -1 : 1), sai = cong(K, A, cong1 ? 1 : -1);
      var kq = cc.daThuc(M);
      return {
        hinhGiai: cong1 ? hg(k, a) : hg(noi(k, a)),
        de: 'Tìm đa thức $M$, biết $M ' + (cong1 ? '+' : '-') + ' (' + tx(cc, a) + ') = ' + tx(cc, k) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: [cong1 ? 'Nếu $M + A = B$ thì $M = B - A$.' : 'Nếu $M - A = B$ thì $M = B + A$.',
          'Viết $M = (' + tx(cc, k) + ') ' + (cong1 ? '-' : '+') + ' (' + tx(cc, a) + ')$ rồi bỏ ngoặc, thu gọn.'],
        loiGiai: ['$M = (' + tx(cc, k) + ') ' + (cong1 ? '-' : '+') + ' (' + tx(cc, a) + ')$',
          '$M = ' + tx(cc, kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc(sai), giaiThich: cong1 ? 'Chuyển $A$ sang vế kia thì phải **trừ**: $M = B - A$, không phải $B + A$.' : 'Từ $M - A = B$ suy ra $M = B + A$ (cộng thêm $A$ vào cả hai vế), không phải $B - A$.' }]
      };
    } },

    { ten: 'Bỏ ngoặc rồi rút gọn', muc: 2, sinh: function (r, cc) {
      // (x + a·y) + (b·y − z) − (x + c·y − z): nhiều dấu ngoặc, ba biến
      var a = r.khac0(-5, 5), b = r.khac0(-5, 5), c = r.khac0(-5, 5), d = r.khac0(-3, 3), e = r.khac0(-3, 3);
      var p1 = [[1, 'x'], [a, 'y']], p2 = [[b, 'y'], [d, 'z']], p3 = [[1, 'x'], [c, 'y'], [e, 'z']];
      var kq = cc.daThuc([[a + b - c, 'y'], [d - e, 'z']]);
      if (kq === '0') { b += 1; kq = cc.daThuc([[a + b - c, 'y'], [d - e, 'z']]); p2[0][0] = b; }
      var sai = cc.daThuc([[0, 'x'], [a + b - c, 'y'], [d + e, 'z']]);
      var s1 = cc.daThuc(p1), s2 = cc.daThuc(p2), s3 = cc.daThuc(p3);
      var bo = cc.daThuc([[1, 'x'], [a, 'y'], [b, 'y'], [d, 'z'], [-1, 'x'], [-c, 'y'], [-e, 'z']]);
      var ltg = [];
      var hinhGiai = hg(noi(s1, s2), s3);
      if (d + e !== d - e) ltg.push({ gt: sai, giaiThich: 'Trước ngoặc thứ ba có dấu trừ: phải đổi dấu **tất cả** các hạng tử, kể cả $' + tx(cc, cc.daThuc([[e, 'z']])) + '$.' });
      return {
        hinhGiai: hinhGiai,
        de: 'Rút gọn biểu thức $(' + tx(cc, s1) + ') + (' + tx(cc, s2) + ') - (' + tx(cc, s3) + ')$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Bỏ ngoặc: trước ngoặc dấu $+$ giữ nguyên dấu; trước ngoặc dấu $-$ đổi dấu mọi hạng tử.', 'Nhóm các hạng tử chứa $x$, chứa $y$, chứa $z$ rồi thu gọn.'],
        loiGiai: ['$= ' + tx(cc, bo) + '$',
          '$= (x - x) + (' + tx(cc, cc.daThuc([[a, 'y'], [b, 'y'], [-c, 'y']])) + ') + (' + tx(cc, cc.daThuc([[d, 'z'], [-e, 'z']])) + ') = ' + tx(cc, kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tìm đa thức rồi tính giá trị', muc: 3, sinh: function (r, cc) {
      var ph = r.chon([['x^2', 'xy', ''], ['x^2', 'y', ''], ['xy', 'y^2', '']]);
      var A = daThuc(r, ph, 6), C = daThuc(r, ph, 6);
      var x = r.chon([-2, -1, 1, 2, 3]), y = r.chon([-2, -1, 1, 2]);
      var B = cong(A, C, -1), kq = giaTri(B, x, y), sai = giaTri(cong(A, C, 1), x, y);
      var a = cc.daThuc(A), c = cc.daThuc(C);
      return {
        de: 'Cho đa thức $A = ' + tx(cc, a) + '$. Tìm đa thức $B$ sao cho $A - B = ' + tx(cc, c) + '$, rồi tính giá trị của $B$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Từ $A - B = C$ suy ra $B = A - C$.', 'Tìm $B$ ở dạng thu gọn trước, rồi mới thay $x = ' + x + '$, $y = ' + y + '$.'],
        loiGiai: ['$B = (' + tx(cc, a) + ') - (' + tx(cc, c) + ') = ' + tx(cc, cc.daThuc(B)) + '$',
          'Thay $x = ' + x + '$, $y = ' + y + '$: $B = ' + kq + '$'],
        loiThuongGap: sai !== kq ? [{ gt: sai, giaiThich: 'Từ $A - B = C$ thì $B = A - C$, không phải $A + C$.' }] : []
      };
    } },

    { ten: 'Tổng không phụ thuộc vào biến', muc: 3, sinh: function (r, cc) {
      var a = r.so(2, 9), b = r.so(2, 9), m = r.so(-20, 20), n = r.so(1, 30);
      var u = r.chon(['x^2y', 'x^3']), v = r.chon(['xy^2', 'y^3', 'xy']);
      var P = [[a, u], [-b, v], [m, '']], Q = [[b, v], [-a, u], [n, '']];
      var ten = r.chon(['Hà', 'Lan', 'Minh', 'Tuấn']);
      var p = cc.daThuc(P), q = cc.daThuc(Q);
      return {
        de: 'Cho $P = ' + tx(cc, p) + '$ và $Q = ' + tx(cc, q) + '$. Bạn ' + ten + ' nói: "Với mọi giá trị của $x$, $y$, tổng $P + Q$ luôn bằng cùng một số." Số đó là bao nhiêu?',
        dapAn: { kieu: 'so', gt: m + n },
        goiY: ['Tính $P + Q$ rồi thu gọn.', 'Các hạng tử chứa biến có triệt tiêu nhau không?'],
        loiGiai: ['$P + Q = (' + tx(cc, cc.daThuc([[a, u], [-a, u]])) + ') + (' + tx(cc, cc.daThuc([[-b, v], [b, v]])) + ') + (' + m + ' + ' + n + ')$',
          '$P + Q = 0 + 0 + ' + ngoac(m + n) + ' = ' + (m + n) + '$'],
        loiThuongGap: m - n !== m + n ? [{ gt: m - n, giaiThich: 'Hạng tử tự do của $Q$ là $+' + n + '$; cộng $' + ngoac(m) + ' + ' + n + '$.' }] : []
      };
    } }
  ]);
})();
