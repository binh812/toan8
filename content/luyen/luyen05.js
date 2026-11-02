// Luyện thêm – Bài 5: Phép chia đa thức cho đơn thức
(function () {
  'use strict';
  function bien(ex, ey) {
    var s = '';
    if (ex) s += 'x' + (ex > 1 ? '^' + ex : '');
    if (ey) s += 'y' + (ey > 1 ? '^' + ey : '');
    return s;
  }
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  function ngoac(v) { return v < 0 ? '(' + v + ')' : String(v); }
  // lũy thừa trong lời giải: x^1 viết gọn là x
  function lt(b, e) { return e === 1 ? b : b + '^{' + e + '}'; }
  // đa thức = [[hệ số, mũ x, mũ y], …]
  function ds(cc, D) { return cc.daThuc(D.map(function (h) { return [h[0], bien(h[1], h[2])]; })); }
  function nhanDon(D, b, r, s) { return D.map(function (h) { return [h[0] * b, h[1] + r, h[2] + s]; }); }
  function chiaTex(cc, b, r, s) { var t = tx(cc, ds(cc, [[b, r, s]])); return b < 0 ? '(' + t + ')' : t; }
  // sinh thương gồm n hạng tử khác phần biến
  function sinhThuong(r, n, coHangSo) {
    var dung = {}, out = [];
    while (out.length < n) {
      var e = r.so(0, 3), f = r.so(0, 2);
      if (coHangSo && out.length === n - 1) { e = 0; f = 0; } else if (coHangSo && !e && !f) continue;
      if (dung[e + ',' + f]) continue;
      dung[e + ',' + f] = 1;
      out.push([r.khac0(-6, 6), e, f]);
    }
    return out;
  }

  TOAN8.luyen(5, [
    { ten: 'Chia đơn thức cho đơn thức', muc: 1, sinh: function (r, cc) {
      var q = r.khac0(-6, 6), e = r.so(0, 4), f = r.so(0, 2), b = r.khac0(-5, 5), rr = r.so(1, 3), s = r.so(0, 2);
      if (e + f === 0) e = 1;
      if (Math.abs(b) === 1) b = b * r.so(2, 4);
      var A = ds(cc, [[q * b, e + rr, f + s]]), Q = ds(cc, [[q, e, f]]);
      var ltg = [];
      var px = e + rr;
      if (px % rr === 0 && px / rr !== e && rr > 1) ltg.push({ gt: ds(cc, [[q, px / rr, f]]), giaiThich: 'Chia hai lũy thừa cùng cơ số thì **trừ** số mũ: $x^{' + px + '} : x^{' + rr + '} = x^{' + px + ' - ' + rr + '}$, không chia số mũ.' });
      if (b < 0) ltg.push({ gt: ds(cc, [[-q, e, f]]), giaiThich: 'Chú ý dấu khi chia hệ số: $' + q * b + ' : ' + ngoac(b) + ' = ' + q + '$.' });
      return {
        de: 'Thực hiện phép chia $' + tx(cc, A) + ' : ' + chiaTex(cc, b, rr, s) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: Q, dang: 'khaiTrien' },
        goiY: ['Chia hệ số cho hệ số; chia lũy thừa của từng biến cho lũy thừa cùng biến (trừ số mũ).', 'Hệ số: $' + q * b + ' : ' + ngoac(b) + '$. Phần $x$: $' + lt('x', px) + ' : ' + lt('x', rr) + '$' + (s ? '; phần $y$: $' + lt('y', f + s) + ' : ' + lt('y', s) + '$' : '') + '.'],
        loiGiai: ['$= [' + q * b + ' : ' + ngoac(b) + '] \\cdot (' + lt('x', px) + ' : ' + lt('x', rr) + ')' + (s ? ' \\cdot (' + lt('y', f + s) + ' : ' + lt('y', s) + ')' : f ? ' \\cdot ' + lt('y', f) : '') + '$',
          '$' + tx(cc, A) + ' : ' + chiaTex(cc, b, rr, s) + ' = ' + tx(cc, Q) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Đơn thức có chia hết không', muc: 1, sinh: function (r, cc) {
      var a = r.so(2, 9) * r.dau(), p = r.so(1, 4), q = r.so(1, 4), b = r.chon([1, 2, 3]) * r.dau();
      var rr = r.so(1, p), s = r.so(0, q), dung = r.dau() > 0;
      var ly;
      if (!dung) {
        if (r.dau() > 0) { s = q + r.so(1, 2); ly = 'Số mũ của $y$ trong đơn thức chia là $' + s + '$, **lớn hơn** số mũ của $y$ trong đơn thức bị chia (là $' + q + '$).'; }
        else { rr = p + 1; ly = 'Số mũ của $x$ trong đơn thức chia là $' + rr + '$, **lớn hơn** số mũ của $x$ trong đơn thức bị chia (là $' + p + '$).'; }
      } else ly = 'Mỗi biến của đơn thức chia đều có trong đơn thức bị chia với số mũ không lớn hơn ($' + rr + ' \\le ' + p + '$' + (s ? ', $' + s + ' \\le ' + q + '$' : '') + ').';
      var A = tx(cc, ds(cc, [[a, p, q]])), B = tx(cc, ds(cc, [[b, rr, s]]));
      return {
        de: 'Đúng hay sai: Đơn thức $' + A + '$ chia hết cho đơn thức $' + B + '$.',
        dapAn: { kieu: 'dungSai', gt: dung },
        goiY: ['$A$ chia hết cho $B$ khi mỗi biến của $B$ đều là biến của $A$ với số mũ **không lớn hơn** số mũ của nó trong $A$.', 'So sánh số mũ của $x$, rồi của $y$ trong hai đơn thức. (Hệ số không ảnh hưởng.)'],
        loiGiai: [ly, 'Vậy khẳng định **' + (dung ? 'đúng' : 'sai') + '**.']
      };
    } },

    { ten: 'Chia đa thức cho đơn thức', muc: 2, sinh: function (r, cc) {
      var n = r.chon([2, 3]), coHs = r.dau() > 0;
      var Q = sinhThuong(r, n, coHs);
      if (coHs) Q[n - 1][0] = r.dau();
      var b = r.chon([2, 3, 4, 5]) * r.dau(), rr = r.so(1, 2), s = r.so(0, 1);
      var A = nhanDon(Q, b, rr, s), kq = ds(cc, Q);
      var ltg = [];
      if (coHs) ltg.push({ gt: ds(cc, Q.slice(0, n - 1)), giaiThich: 'Hạng tử $' + tx(cc, ds(cc, [A[n - 1]])) + '$ chia cho $' + chiaTex(cc, b, rr, s) + '$ được $' + Q[n - 1][0] + '$, không phải $0$. Đừng bỏ quên.' });
      else if (b < 0) ltg.push({ gt: ds(cc, Q.map(function (h) { return [-h[0], h[1], h[2]]; })), giaiThich: 'Đơn thức chia có hệ số âm: chia xong **mỗi** hạng tử đều đổi dấu.' });
      return {
        de: 'Thực hiện phép chia $(' + tx(cc, ds(cc, A)) + ') : ' + chiaTex(cc, b, rr, s) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Chia **từng** hạng tử của đa thức cho đơn thức rồi cộng các kết quả.', 'Với mỗi hạng tử: chia hệ số, trừ số mũ của từng biến.'],
        loiGiai: ['$= ' + A.map(function (h, i) { var t = tx(cc, ds(cc, [h])); return (h[0] < 0 && i ? '(' + t + ')' : t) + ' : ' + chiaTex(cc, b, rr, s); }).join(' + ') + '$',
          '$= ' + tx(cc, kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tìm đa thức (đơn thức) chưa biết', muc: 2, sinh: function (r, cc) {
      var b = r.chon([2, 3, 4]) * r.dau(), rr = r.so(1, 2), s = r.so(1, 2);
      if (r.dau() > 0) {
        var Q = sinhThuong(r, 2, false), C = nhanDon(Q, b, rr, s);
        var Bt = chiaTex(cc, b, rr, s), kq = ds(cc, Q);
        return {
          de: 'Tìm đa thức $A$, biết $A \\cdot ' + Bt + ' = ' + tx(cc, ds(cc, C)) + '$.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Thừa số chưa biết bằng tích chia cho thừa số đã biết: $A = (' + tx(cc, ds(cc, C)) + ') : ' + Bt + '$.', 'Chia từng hạng tử cho $' + Bt + '$.'],
          loiGiai: ['$A = (' + tx(cc, ds(cc, C)) + ') : ' + Bt + '$', '$A = ' + tx(cc, kq) + '$'],
          loiThuongGap: b < 0 ? [{ gt: ds(cc, Q.map(function (h) { return [-h[0], h[1], h[2]]; })), giaiThich: 'Chia cho đơn thức có hệ số âm thì mỗi hạng tử đổi dấu.' }] : []
        };
      }
      // A : M = Q (đơn thức) → M = A : Q
      var q = r.chon([2, 3, 4, 5]), e = r.so(1, 2), f = r.so(0, 1), mx = r.so(1, 3), my = r.so(1, 2), m = r.chon([2, 3, -2, -3]);
      var A = ds(cc, [[q * m, e + mx, f + my]]), Qd = ds(cc, [[q, e, f]]), M = ds(cc, [[m, mx, my]]);
      return {
        de: 'Tìm đơn thức $M$, biết $' + tx(cc, A) + ' : M = ' + tx(cc, Qd) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: M, dang: 'khaiTrien' },
        goiY: ['Số chia bằng số bị chia chia cho thương: $M = ' + tx(cc, A) + ' : ' + tx(cc, Qd) + '$.', 'Chia hệ số, trừ số mũ của từng biến.'],
        loiGiai: ['$M = ' + tx(cc, A) + ' : ' + tx(cc, Qd) + '$', '$M = ' + tx(cc, M) + '$'],
        loiThuongGap: [{ gt: ds(cc, [[q * m * q, e + mx + e, f + my + f]]), giaiThich: 'Em đã **nhân** với thương. Muốn tìm số chia thì lấy số bị chia **chia** cho thương.' }]
      };
    } },

    { ten: 'Bài toán vận dụng', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        // hình chữ nhật: diện tích = rộng · dài
        var w = r.chon([2, 3, 4]), wx = 1, wy = r.so(0, 1);
        var p = r.so(1, 4), q = r.so(1, 4) * r.chon([1, 1, -1]);
        var L = q > 0 ? [[p, 1, 0], [q, 0, 1]] : [[p, 1, 0], [-q, 0, 0]];
        var S = nhanDon(L, w, wx, wy), kq = ds(cc, L);
        var noi = r.chon(['mảnh đất', 'tấm kính', 'bức tường', 'tấm bìa']);
        return {
          de: 'Một ' + noi + ' hình chữ nhật có diện tích $' + tx(cc, ds(cc, S)) + '$ (m²) và chiều rộng $' + tx(cc, ds(cc, [[w, wx, wy]])) + '$ (m). Tìm chiều dài của ' + noi + '.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
          goiY: ['Chiều dài = diện tích : chiều rộng.', 'Chia từng hạng tử của diện tích cho $' + tx(cc, ds(cc, [[w, wx, wy]])) + '$.'],
          loiGiai: ['Chiều dài: $(' + tx(cc, ds(cc, S)) + ') : ' + tx(cc, ds(cc, [[w, wx, wy]])) + '$', '$= ' + tx(cc, kq) + '$'],
          loiThuongGap: [{ gt: ds(cc, L.map(function (h, i) { return [h[0], S[i][1], S[i][2]]; })), giaiThich: 'Em mới chia hệ số, còn phải chia cả phần biến: trừ số mũ của từng biến.' }]
        };
      }
      // giá trị (đa thức : đơn thức) tại x, y
      var Q = [[r.khac0(-4, 4), r.so(1, 2), 0], [r.khac0(-4, 4), 0, 1]];
      var b = r.chon([2, 3, 5]) * r.dau(), rr = r.so(1, 3), s = r.so(1, 2);
      var A = nhanDon(Q, b, rr, s), x = r.chon([-2, -1, 2, 3]), y = r.chon([-3, -2, -1, 1, 2]);
      var kq2 = Q.reduce(function (t, h) { return t + h[0] * Math.pow(x, h[1]) * Math.pow(y, h[2]); }, 0);
      var gon = ds(cc, Q);
      var thay = Q.map(function (h, i) {
        var v = h[0], dau = v < 0 ? ' - ' : (i ? ' + ' : '');
        var t = (Math.abs(v) === 1 ? '' : Math.abs(v) + ' \\cdot ') + (h[1] ? ngoac(x) + (h[1] > 1 ? '^' + h[1] : '') : ngoac(y));
        return (i === 0 && v < 0 ? '-' : dau) + t;
      }).join('');
      return {
        de: 'Tính giá trị của biểu thức $(' + tx(cc, ds(cc, A)) + ') : ' + chiaTex(cc, b, rr, s) + '$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Thực hiện phép chia trước để biểu thức gọn hơn, rồi mới thay số.', 'Thương chỉ còn hai hạng tử bậc thấp.'],
        loiGiai: ['$(' + tx(cc, ds(cc, A)) + ') : ' + chiaTex(cc, b, rr, s) + ' = ' + tx(cc, gon) + '$',
          'Tại $x = ' + x + '$, $y = ' + y + '$: $' + thay + ' = ' + kq2 + '$']
      };
    } }
  ]);
})();
