// Luyện thêm – Bài 9: Phân tích đa thức thành nhân tử
(function () {
  'use strict';
  function nhan(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  function tx(cc, s) { s = String(s); return s.charAt(0) === '-' ? '-' + cc.tex(s.slice(1)) : cc.tex(s); }
  function bp(s) { return /^([0-9]+|[a-z])$/.test(s) ? s + '^2' : '(' + s + ')^2'; }
  // Hình lời giải theo chính số của đề: xếp các mảnh thành hình chữ nhật (xepChuNhat), cắt ghép hình vuông (manhVuong),
  // khối lập phương (haiLapPhuong). Cạnh có chữ nên hình không theo tỉ lệ.
  function dep(s) { return String(s).replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/-/g, '−'); }
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  function xn(hang, cot, o, rong, cao, ghiChu, ket) {
    return hg({ ten: 'xepChuNhat', ghiChu: ghiChu || 'Hình không theo tỉ lệ.', tuyChon: { hang: hang, cot: cot, o: o, tenRong: rong, tenCao: cao, tenKet: ket } });
  }
  function hbp(A, B, a2, b2, ghiChu) {
    return hg({ ten: 'manhVuong', thamSo: { a: 5, b: 2 }, tuyChon: { dang: 'hieuHaiBP', tenA: A, tenB: B, nhan: { a2: a2, b2: b2 } }, ghiChu: ghiChu || 'Hình vẽ khi ' + A + ' lớn hơn ' + B + '.' });
  }

  TOAN8.luyen(9, [
    { ten: 'Đặt nhân tử chung', muc: 1, sinh: function (r, cc) {
      // g·x^e·(p·x + q) với ƯCLN(p, q) = 1
      var g = r.chon([1, 2, 3, 4, 5, 6]), e = r.so(1, 2), p = r.so(1, 5), q = r.khac0(-9, 9);
      while (cc.ucln(p, q) !== 1) q = r.khac0(-9, 9);
      if (g === 1 && e === 1 && p === 1) { p = 2; while (cc.ucln(p, q) !== 1) q = r.khac0(-9, 9); }
      var chung = nhan(g) + (e === 1 ? 'x' : 'x^2');
      var trong = cc.daThuc([[p, 'x'], [q, '']]);
      var de = cc.daThuc([[g * p, 'x^' + (e + 1)], [g * q, e === 1 ? 'x' : 'x^2']]);
      var kq = chung + '(' + trong + ')';
      var ltg = [{ gt: chung + '(' + cc.daThuc([[p, 'x'], [-q, '']]) + ')', giaiThich: 'Kiểm tra dấu: $' + tx(cc, cc.daThuc([[g * q, e === 1 ? 'x' : 'x^2']])) + ' = ' + cc.tex(chung) + ' \\cdot (' + q + ')$.' }];
      if (g > 1) ltg.push({ gt: chung + '(' + cc.daThuc([[p, 'x'], [g * q, '']]) + ')', giaiThich: 'Hạng tử thứ hai cũng phải chia cho nhân tử chung $' + cc.tex(chung) + '$: $' + tx(cc, cc.daThuc([[g * q, e === 1 ? 'x' : 'x^2']])) + ' : ' + cc.tex(chung) + ' = ' + q + '$.' });
      return {
        de: 'Phân tích $' + tx(cc, de) + '$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
        hinhGiai: xn([{ ten: dep(chung), dai: 3 }], [{ ten: dep(cc.daThuc([[p, 'x']])), dai: 5 }, { ten: String(Math.abs(q)), dai: 2, tru: q < 0 }], [[dep(cc.daThuc([[g * p, 'x^' + (e + 1)]])), dep(cc.daThuc([[Math.abs(g * q), e === 1 ? 'x' : 'x^2']]))]], dep(trong), null, null, dep(chung) + '(' + dep(trong) + ')'),
        goiY: ['Nhân tử chung = ƯCLN của các hệ số nhân với lũy thừa của $x$ có số mũ nhỏ nhất.', 'Nhân tử chung là $' + cc.tex(chung) + '$. Chia từng hạng tử cho nó.'],
        loiGiai: ['$' + tx(cc, de) + ' = ' + cc.tex(chung) + ' \\cdot ' + cc.tex(cc.daThuc([[p, 'x']])) + (q < 0 ? ' - ' : ' + ') + cc.tex(chung) + ' \\cdot ' + Math.abs(q) + '$',
          '$= ' + cc.tex(kq) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Dùng hằng đẳng thức', muc: 2, sinh: function (r, cc) {
      var loai = r.so(0, 2);
      if (loai === 0) {
        // a²x² − b²
        var a = r.chon([1, 1, 2, 3]), b = r.so(1, 9);
        while (cc.ucln(a, b) !== 1 || (a === 1 && b === 1)) b = r.so(1, 9);
        var A = nhan(a) + 'x', de = cc.daThuc([[a * a, 'x^2'], [-b * b, '']]), kq = '(' + A + '-' + b + ')(' + A + '+' + b + ')';
        return {
          de: 'Phân tích $' + cc.tex(de) + '$ thành nhân tử.',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
          hinhGiai: hbp(dep(A), String(b), dep(cc.daThuc([[a * a, 'x^2']])), String(b * b)),
          goiY: ['Đa thức có 2 hạng tử, là hiệu hai bình phương.', '$' + cc.tex(de) + ' = ' + bp(A) + ' - ' + b + '^2$; dùng $A^2 - B^2 = (A - B)(A + B)$.'],
          loiGiai: ['$' + cc.tex(de) + ' = ' + bp(A) + ' - ' + b + '^2$', '$= ' + cc.tex(kq) + '$'],
          loiThuongGap: [{ gt: '(' + A + '-' + b + ')^2', giaiThich: '$A^2 - B^2 = (A - B)(A + B)$, không phải $(A - B)^2$.' }]
        };
      }
      if (loai === 1) {
        // x² ± 2bx + b² hoặc a²x² ± 2abx + b²
        var a2 = r.chon([1, 1, 2, 3]), b2 = r.so(1, 6), s = r.dau(), dau = s > 0 ? '+' : '-';
        while (cc.ucln(a2, b2) !== 1) b2 = r.so(1, 6);
        var A2 = nhan(a2) + 'x', de2 = cc.daThuc([[a2 * a2, 'x^2'], [2 * a2 * b2 * s, 'x'], [b2 * b2, '']]), kq2 = '(' + A2 + dau + b2 + ')^2';
        return {
          de: 'Phân tích $' + cc.tex(de2) + '$ thành nhân tử.',
          dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'nhanTu' },
          hinhGiai: hg({ ten: 'manhVuong', thamSo: { a: s > 0 ? 4 : 5, b: 2 }, ghiChu: s > 0 ? null : 'Hình vẽ khi ' + dep(A2) + ' lớn hơn ' + b2 + '.', tuyChon: { dang: s > 0 ? 'tong' : 'hieu', tenA: dep(A2), tenB: String(b2), nhan: { a2: dep(cc.daThuc([[a2 * a2, 'x^2']])), ab: dep(cc.daThuc([[a2 * b2, 'x']])), b2: String(b2 * b2), hieu: dep(A2) + '−' + b2 } } }),
          goiY: ['Đa thức có 3 hạng tử: thử bình phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + '.', 'Hai đầu là $' + bp(A2) + '$ và $' + b2 + '^2$; kiểm tra hạng tử giữa $2 \\cdot ' + A2 + ' \\cdot ' + b2 + ' = ' + 2 * a2 * b2 + 'x$.'],
          loiGiai: ['$' + cc.tex(de2) + ' = ' + bp(A2) + ' ' + dau + ' 2 \\cdot ' + A2 + ' \\cdot ' + b2 + ' + ' + b2 + '^2$', '$= ' + cc.tex(kq2) + '$'],
          loiThuongGap: [{ gt: '(' + A2 + (s > 0 ? '-' : '+') + b2 + ')^2', giaiThich: 'Hạng tử giữa mang dấu ' + (s > 0 ? 'cộng nên là bình phương của một **tổng**.' : 'trừ nên là bình phương của một **hiệu**.') }]
        };
      }
      // x³ ± b³
      var b3 = r.so(1, 5), s3 = r.dau(), d3 = s3 > 0 ? '+' : '-', n3 = s3 > 0 ? '-' : '+';
      var de3 = cc.daThuc([[1, 'x^3'], [s3 * b3 * b3 * b3, '']]);
      var kq3 = '(x' + d3 + b3 + ')(x^2' + n3 + nhan(b3) + 'x+' + b3 * b3 + ')';
      return {
        de: 'Phân tích $' + cc.tex(de3) + '$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: kq3, dang: 'nhanTu' },
        hinhGiai: s3 < 0 ? hg({ ten: 'haiLapPhuong', thamSo: { a: 3.5, b: 1.5 }, ghiChu: 'Hình vẽ khi x lớn hơn ' + b3 + '.', tuyChon: { dang: 'hieu', tenA: 'x', tenB: String(b3), nhan: { a2: 'x²', ab: dep(cc.daThuc([[b3, 'x']])), b2: String(b3 * b3), b3: String(b3 * b3 * b3), hieu: 'x−' + b3 } } })
          : hg({ ten: 'haiLapPhuong', thamSo: { a: 3, b: 1.5 }, tuyChon: { dang: 'tong', tenA: 'x', tenB: String(b3), nhan: { a3: 'x³', b3: String(b3 * b3 * b3), a2b: dep(cc.daThuc([[b3, 'x^2']])), ab2: dep(cc.daThuc([[b3 * b3, 'x']])), hop: dep(cc.daThuc([[b3, 'x']])) + '(x+' + b3 + ')' } } }),
        goiY: ['Đa thức có 2 hạng tử bậc ba: ' + (s3 > 0 ? 'tổng' : 'hiệu') + ' hai lập phương.', '$' + b3 * b3 * b3 + ' = ' + b3 + '^3$; dùng $A^3 ' + d3 + ' B^3 = (A ' + d3 + ' B)(A^2 ' + n3 + ' AB + B^2)$.'],
        loiGiai: ['$' + cc.tex(de3) + ' = x^3 ' + d3 + ' ' + b3 + '^3$', '$= ' + cc.tex(kq3) + '$'],
        loiThuongGap: [{ gt: '(x' + d3 + b3 + ')(x^2' + d3 + nhan(b3) + 'x+' + b3 * b3 + ')', giaiThich: 'Trong thừa số thứ hai, hạng tử $AB$ mang dấu **ngược** với dấu của đề.' }]
      };
    } },

    { ten: 'Nhóm hạng tử', muc: 2, sinh: function (r, cc) {
      // (x + a)(x + b·y) = x² + b·xy + a·x + ab·y
      var a = r.khac0(-6, 6), b = r.khac0(-4, 4);
      while (Math.abs(b) === Math.abs(a)) b = r.khac0(-4, 4);
      var de = cc.daThuc([[1, 'x^2'], [b, 'xy'], [a, 'x'], [a * b, 'y']]);
      var kq = '(' + cc.daThuc([[1, 'x'], [a, '']]) + ')(' + cc.daThuc([[1, 'x'], [b, 'y']]) + ')';
      var nh1 = cc.daThuc([[1, 'x^2'], [b, 'xy']]), nh2 = cc.daThuc([[a, 'x'], [a * b, 'y']]);
      var by = cc.daThuc([[1, 'x'], [b, 'y']]);
      return {
        de: 'Phân tích $' + cc.tex(de) + '$ thành nhân tử.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
        hinhGiai: xn([{ ten: 'x', dai: 5 }, { ten: String(Math.abs(a)), dai: 2, tru: a < 0 }], [{ ten: 'x', dai: 5 }, { ten: dep(cc.daThuc([[Math.abs(b), 'y']])), dai: 2, tru: b < 0 }],
          [['x²', dep(cc.daThuc([[Math.abs(b), 'xy']]))], [dep(cc.daThuc([[Math.abs(a), 'x']])), dep(cc.daThuc([[Math.abs(a * b), 'y']]))]], dep(cc.daThuc([[1, 'x'], [b, 'y']])), dep(cc.daThuc([[1, 'x'], [a, '']])), null, ['(' + dep(cc.daThuc([[1, 'x'], [b, 'y']])) + ')', '(' + dep(cc.daThuc([[1, 'x'], [a, '']])) + ')']),
        goiY: ['Nhóm hai hạng tử đầu và hai hạng tử cuối: $(' + cc.tex(nh1) + ') + (' + tx(cc, nh2) + ')$.', 'Đặt nhân tử chung trong mỗi nhóm, sẽ xuất hiện nhân tử chung $(' + cc.tex(by) + ')$.'],
        loiGiai: ['$= (' + cc.tex(nh1) + ') + (' + tx(cc, nh2) + ')$',
          '$= x(' + cc.tex(by) + ') ' + (a < 0 ? '- ' : '+ ') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + '(' + cc.tex(by) + ')$',
          '$= ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: '(' + cc.daThuc([[1, 'x'], [-a, '']]) + ')(' + by + ')', giaiThich: 'Nhóm thứ hai là $' + tx(cc, nh2) + ' = ' + a + '(' + cc.tex(by) + ')$, nên thừa số còn lại là $' + cc.tex(cc.daThuc([[1, 'x'], [a, '']])) + '$.' }]
      };
    } },

    { ten: 'Tìm x', muc: 2, sinh: function (r, cc) {
      var loai = r.so(0, 2);
      if (loai === 0) {
        // a·x² + b·x = 0 → x = 0 hoặc x = −b/a (nguyên)
        var a = r.so(1, 4), k = r.khac0(-6, 6), b = -a * k;
        var de = cc.daThuc([[a, 'x^2'], [b, 'x']]);
        return {
          de: 'Tìm $x$, biết $' + cc.tex(de) + ' = 0$. (Ghi các giá trị cách nhau bằng dấu ;)',
          dapAn: { kieu: 'nghiem', gt: [0, k] },
          hinhGiai: xn([{ ten: dep(nhan(a) + 'x'), dai: 3 }], [{ ten: 'x', dai: 5 }, { ten: String(Math.abs(k)), dai: 2, tru: k > 0 }], [[dep(cc.daThuc([[a, 'x^2']])), dep(cc.daThuc([[a * Math.abs(k), 'x']]))]], dep(cc.daThuc([[1, 'x'], [-k, '']])), null, 'Hình cho bước phân tích, không theo tỉ lệ.', dep(nhan(a) + 'x') + '(' + dep(cc.daThuc([[1, 'x'], [-k, '']])) + ')'),
          loiThuongGap: [{ gt: [k], giaiThich: 'Em làm mất giá trị $x = 0$ (có lẽ đã chia hai vế cho $x$). Thừa số $' + nhan(a) + 'x$ bằng $0$ khi $x = 0$, khi đó tích cũng bằng $0$.' }],
          goiY: ['Đặt nhân tử chung: $' + cc.tex(de) + ' = ' + nhan(a) + 'x(' + cc.daThuc([[1, 'x'], [-k, '']]) + ')$.', 'Tích bằng $0$ khi một trong các thừa số bằng $0$. **Đừng** chia hai vế cho $x$ (sẽ mất nghiệm $x = 0$).'],
          loiGiai: ['$' + cc.tex(de) + ' = 0 \\Rightarrow ' + nhan(a) + 'x(' + cc.tex(cc.daThuc([[1, 'x'], [-k, '']])) + ') = 0$',
            '$x = 0$ hoặc $' + cc.tex(cc.daThuc([[1, 'x'], [-k, '']])) + ' = 0$', 'Vậy $x = 0$; $x = ' + k + '$.']
        };
      }
      if (loai === 1) {
        var m = r.so(1, 9), c = r.chon([1, 1, 2, 3]);
        var de2 = cc.daThuc([[c, 'x^2'], [-c * m * m, '']]);
        return {
          de: 'Tìm $x$, biết $' + cc.tex(de2) + ' = 0$. (Ghi các giá trị cách nhau bằng dấu ;)',
          dapAn: { kieu: 'nghiem', gt: [m, -m] },
          hinhGiai: hbp('x', String(m), 'x²', String(m * m), (c > 1 ? 'Hình cho phần x² − ' + m * m + ' sau khi đặt ' + c + ' ra ngoài, ' : 'Hình ') + 'vẽ khi x lớn hơn ' + m + '.'),
          loiThuongGap: [{ gt: [m], giaiThich: 'Còn giá trị âm: $(-' + m + ')^2 = ' + m * m + '$ nên $x = -' + m + '$ cũng thỏa mãn.' }],
          goiY: [c > 1 ? 'Đặt $' + c + '$ ra ngoài, rồi dùng hiệu hai bình phương.' : 'Dùng hiệu hai bình phương: $x^2 - ' + m * m + ' = x^2 - ' + m + '^2$.', 'Có **hai** giá trị của $x$ (một dương, một âm).'],
          loiGiai: ['$' + cc.tex(de2) + ' = 0 \\Rightarrow ' + nhan(c) + '(x - ' + m + ')(x + ' + m + ') = 0$',
            '$x - ' + m + ' = 0$ hoặc $x + ' + m + ' = 0$', 'Vậy $x = ' + m + '$; $x = -' + m + '$.']
        };
      }
      // c·x³ − c·m²·x = 0 → x = 0; ±m
      var m3 = r.so(1, 5), c3 = r.chon([1, 2, 3, 5]);
      var de3 = cc.daThuc([[c3, 'x^3'], [-c3 * m3 * m3, 'x']]);
      return {
        de: 'Tìm $x$, biết $' + cc.tex(de3) + ' = 0$. (Ghi các giá trị cách nhau bằng dấu ;)',
        dapAn: { kieu: 'nghiem', gt: [0, m3, -m3] },
        hinhGiai: hbp('x', String(m3), 'x²', String(m3 * m3), 'Hình cho phần x² − ' + m3 * m3 + ' sau khi đặt ' + nhan(c3) + 'x ra ngoài, vẽ khi x lớn hơn ' + m3 + '.'),
        loiThuongGap: [{ gt: [m3, -m3], giaiThich: 'Còn thừa số $' + nhan(c3) + 'x$: nó bằng $0$ khi $x = 0$, nên $x = 0$ cũng là một giá trị cần tìm.' },
          { gt: [0, m3], giaiThich: 'Còn giá trị âm: $x + ' + m3 + ' = 0$ khi $x = -' + m3 + '$.' }],
        goiY: ['Đặt nhân tử chung $' + nhan(c3) + 'x$ trước, rồi phân tích tiếp bằng hiệu hai bình phương.', 'Có **ba** thừa số chứa $x$ nên có ba giá trị của $x$.'],
        loiGiai: ['$' + cc.tex(de3) + ' = ' + nhan(c3) + 'x(x^2 - ' + m3 * m3 + ') = ' + nhan(c3) + 'x(x - ' + m3 + ')(x + ' + m3 + ')$',
          '$x = 0$ hoặc $x - ' + m3 + ' = 0$ hoặc $x + ' + m3 + ' = 0$', 'Vậy $x = 0$; $x = ' + m3 + '$; $x = -' + m3 + '$.']
      };
    } },

    { ten: 'Phân tích đến cùng', muc: 3, sinh: function (r, cc) {
      var loai = r.dau() > 0;
      if (loai) {
        // c·x·(x ± b)² = c x³ ± 2cb x² + c b² x
        var c = r.chon([1, 2, 3]), b = r.so(1, 5), s = r.dau(), dau = s > 0 ? '+' : '-';
        var de = cc.daThuc([[c, 'x^3'], [2 * c * b * s, 'x^2'], [c * b * b, 'x']]);
        var kq = nhan(c) + 'x(x' + dau + b + ')^2';
        return {
          de: 'Phân tích $' + cc.tex(de) + '$ thành nhân tử (phân tích đến cùng).',
          dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'nhanTu' },
          goiY: ['Đặt nhân tử chung $' + cc.tex(nhan(c) + 'x') + '$ trước.', 'Đa thức còn lại trong ngoặc là bình phương của một ' + (s > 0 ? 'tổng' : 'hiệu') + '.'],
          loiGiai: ['$' + cc.tex(de) + ' = ' + cc.tex(nhan(c) + 'x') + '(' + cc.tex(cc.daThuc([[1, 'x^2'], [2 * b * s, 'x'], [b * b, '']])) + ')$',
            '$= ' + cc.tex(kq) + '$'],
          loiThuongGap: [{ gt: nhan(c) + 'x(x' + (s > 0 ? '-' : '+') + b + ')^2', giaiThich: 'Hạng tử giữa $' + tx(cc, cc.daThuc([[2 * b * s, 'x']])) + '$ mang dấu ' + (s > 0 ? 'cộng nên là bình phương của một **tổng**.' : 'trừ nên là bình phương của một **hiệu**.') }]
        };
      }
      // c·x³ − c·m²·x = c·x(x − m)(x + m)
      var c2 = r.chon([2, 3, 5]), m = r.so(1, 6);
      var de2 = cc.daThuc([[c2, 'x^3'], [-c2 * m * m, 'x']]);
      var kq2 = c2 + 'x(x-' + m + ')(x+' + m + ')';
      return {
        de: 'Phân tích $' + cc.tex(de2) + '$ thành nhân tử (phân tích đến cùng).',
        dapAn: { kieu: 'bieuThuc', gt: kq2, dang: 'nhanTu' },
        goiY: ['Đặt nhân tử chung $' + c2 + 'x$ trước.', 'Trong ngoặc còn $x^2 - ' + m * m + '$: hiệu hai bình phương.'],
        loiGiai: ['$' + cc.tex(de2) + ' = ' + c2 + 'x(x^2 - ' + m * m + ')$', '$= ' + cc.tex(kq2) + '$'],
        loiThuongGap: [{ gt: c2 + 'x(x-' + m + ')^2', giaiThich: '$x^2 - ' + m * m + ' = (x - ' + m + ')(x + ' + m + ')$, không phải $(x - ' + m + ')^2$.' }]
      };
    } },

    { ten: 'Tính nhanh', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        // a·b + a·c với b + c = 100
        var a = r.so(12, 89), b = r.so(11, 89), c = 100 - b, kq = a * 100;
        return {
          de: 'Tính nhanh $' + a + ' \\cdot ' + b + ' + ' + a + ' \\cdot ' + c + '$.',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Hai tích có chung thừa số $' + a + '$.', 'Đặt nhân tử chung: $' + a + ' \\cdot (' + b + ' + ' + c + ')$.'],
          loiGiai: ['$' + a + ' \\cdot ' + b + ' + ' + a + ' \\cdot ' + c + ' = ' + a + ' \\cdot (' + b + ' + ' + c + ')$', '$= ' + a + ' \\cdot 100 = ' + kq + '$']
        };
      }
      // A = x² − xy + k·x − k·y = (x − y)(x + k) tại x, y sao cho x − y tròn
      var k = r.so(1, 9), y = r.so(1, 9), hieu = r.chon([10, 20, 100]), x = y + hieu;
      var de = cc.daThuc([[1, 'x^2'], [-1, 'xy'], [k, 'x'], [-k, 'y']]);
      var kq2 = hieu * (x + k);
      return {
        de: 'Tính nhanh giá trị của $A = ' + cc.tex(de) + '$ tại $x = ' + x + '$, $y = ' + y + '$.',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Phân tích $A$ thành nhân tử bằng cách nhóm: $(x^2 - xy) + (' + cc.tex(cc.daThuc([[k, 'x'], [-k, 'y']])) + ')$.', '$A = (x - y)(x + ' + k + ')$; thay số vào dạng tích sẽ nhanh hơn.'],
        loiGiai: ['$A = x(x - y) + ' + (k === 1 ? '' : k) + '(x - y) =(x - y)(x + ' + k + ')$',
          'Tại $x = ' + x + '$, $y = ' + y + '$: $A = (' + x + ' - ' + y + ')(' + x + ' + ' + k + ') = ' + hieu + ' \\cdot ' + (x + k) + ' = ' + kq2 + '$'],
        loiThuongGap: [{ gt: hieu * (x - k), giaiThich: 'Nhóm thứ hai là $+' + (k === 1 ? '' : k) + '(x - y)$ nên thừa số còn lại là $x + ' + k + '$.' }]
      };
    } }
  ]);
})();
