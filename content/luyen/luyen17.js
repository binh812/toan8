// Luyện thêm – Bài 17: Tính chất đường phân giác của tam giác
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5';

  function so(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); }
  function lech(a, b) { return Math.abs(a - b) > 1e-9; }
  function fr(a, b) { return '\\frac{' + a + '}{' + b + '}'; }
  function tron(x) { return Math.round(x * 1e6) / 1e6; }

  // Tam giác có phân giác (giống bai17.js): ten = [đỉnh có phân giác, hai đỉnh còn lại, chân phân giác].
  function hinhPG(ten, ab, ac, bc, nhan) {
    var hh = TOAN8.hh, T = hh.tg(bc, ac, ab), Dd = hh.lerp(T.B, T.C, ab / (ab + ac)), s = Math.max(bc, ab, ac), diem = {};
    diem[ten[0]] = T.A; diem[ten[1]] = T.B; diem[ten[2]] = T.C; diem[ten[3]] = Dd;
    return TOAN8.hinhGeo({ diem: diem, to: [ten[0], ten[1], ten[2]],
      canh: [[ten[0], ten[1]], [ten[0], ten[2]], [ten[1], ten[2]], [ten[0], ten[3], { mau: TIM, day: 3 }]],
      goc: [[ten[1], ten[0], ten[3], { mau: CAM, r: 0.11 * s }], [ten[3], ten[0], ten[2], { mau: XANH, r: 0.14 * s }]],
      nhan: nhan || [] });
  }
  // Bộ số: AB = p·k, AC = q·k, DB = p·t, DC = q·t (BC = (p + q)·t), tam giác không dẹt.
  function boSo(r) {
    var p, q, k, t, n = 0, ok;
    do {
      p = r.so(1, 5); q = r.so(1, 5); k = r.so(2, 5); t = r.so(1, 4); n++;
      var AB = p * k, AC = q * k, BC = (p + q) * t;
      ok = p !== q && cc_ucln(p, q) === 1 && BC < AB + AC - 1 && BC > Math.abs(AB - AC) + 1 &&
        Math.min(AB, AC, BC) >= 0.55 * Math.max(AB, AC, BC);
    } while (n < 200 && !ok);
    if (!ok) { p = 2; q = 3; k = 3; t = 2; }
    return { p: p, q: q, AB: p * k, AC: q * k, DB: p * t, DC: q * t, BC: (p + q) * t };
  }
  function cc_ucln(a, b) { while (b) { var x = a % b; a = b; b = x; } return a; }
  var BO_TEN = [['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'E'], ['M', 'N', 'P', 'I'], ['D', 'E', 'F', 'K'], ['P', 'Q', 'R', 'S']];

  TOAN8.luyen(17, [
    { ten: 'Tính một đoạn trên cạnh đối diện', muc: 1, sinh: function (r) {
      var d = boSo(r), t = r.chon(BO_TEN), A = t[0], B = t[1], C = t[2], D = t[3];
      var hoiDC = r.dau() > 0, ltg = [];
      var tl = fr(D + B, D + C) + ' = ' + fr(A + B, A + C);
      var kq = hoiDC ? d.DC : d.DB;
      var thay = hoiDC ? fr(d.DB, 'x') + ' = ' + fr(d.AB, d.AC) : fr('x', d.DC) + ' = ' + fr(d.AB, d.AC);
      var cong = hoiDC ? fr(d.DB + ' \\cdot ' + d.AC, d.AB) : fr(d.DC + ' \\cdot ' + d.AB, d.AC);
      var nguoc = hoiDC ? d.DB * d.AB / d.AC : d.DC * d.AC / d.AB;
      if (lech(nguoc, kq)) ltg.push({ gt: tron(nguoc), giaiThich: 'Em ghép ngược ($' + fr(D + B, D + C) + ' = ' + fr(A + C, A + B) + '$). Đoạn $' + D + B + '$ kề cạnh $' + A + B + '$ nên $' + tl + '$.' });
      return {
        de: 'Trong hình, $' + A + D + '$ là đường phân giác của góc $' + A + '$, $' + A + B + ' = ' + d.AB + '$, $' + A + C + ' = ' + d.AC + '$, ' +
          (hoiDC ? '$' + D + B + ' = ' + d.DB + '$. Tính $x = ' + D + C + '$.' : '$' + D + C + ' = ' + d.DC + '$. Tính $x = ' + D + B + '$.'),
        hinh: hinhPG(t, d.AB, d.AC, d.BC, [[A, B, String(d.AB)], [A, C, String(d.AC)], [B, D, hoiDC ? String(d.DB) : 'x'], [D, C, hoiDC ? 'x' : String(d.DC)]]),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tính chất đường phân giác: $' + tl + '$ (đoạn nào kề cạnh nào thì đi với cạnh đó).', 'Thay số: $' + thay + '$ rồi nhân chéo.'],
        loiGiai: ['$' + A + D + '$ là phân giác nên $' + tl + '$, tức $' + thay + '$', '$x = ' + cong + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Tỉ số hai đoạn do phân giác chia ra', muc: 1, sinh: function (r, cc) {
      var t = r.chon(BO_TEN), A = t[0], B = t[1], C = t[2], D = t[3];
      var k = r.so(2, 6), p, q;
      do { p = r.so(2, 7); q = r.so(2, 7); } while (p === q || cc.ucln(p, q) !== 1 || Math.abs(p - q) > 3);
      var AB = p * k, AC = q * k, BC = Math.max(Math.round((AB + AC) * r.so(55, 75) / 100), Math.abs(AB - AC) + 3);
      var kq = cc.phanSo(AB, AC), ng = cc.phanSo(AC, AB);
      return {
        de: 'Trong hình, $' + A + D + '$ là đường phân giác của góc $' + A + '$, $' + A + B + ' = ' + AB + '$, $' + A + C + ' = ' + AC + '$. Tìm tỉ số $' + fr(D + B, D + C) + '$ (viết dạng phân số tối giản, ví dụ 3/4).',
        hinh: hinhPG(t, AB, AC, BC, [[A, B, String(AB)], [A, C, String(AC)]]),
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: ['$' + fr(D + B, D + C) + ' = ' + fr(A + B, A + C) + '$.', 'Rút gọn $' + fr(AB, AC) + '$.'],
        loiGiai: ['$' + fr(D + B, D + C) + ' = ' + fr(A + B, A + C) + ' = ' + fr(AB, AC) + '$', '$= ' + kq.tex + '$'],
        loiThuongGap: [{ gt: ng.ascii, giaiThich: 'Đảo ngược rồi: $' + D + B + '$ đi với $' + A + B + ' = ' + AB + '$, $' + D + C + '$ đi với $' + A + C + ' = ' + AC + '$.' }]
      };
    } },

    { ten: 'Biết ba cạnh, tính hai đoạn', muc: 2, sinh: function (r) {
      var d = boSo(r), dv = r.chon(['cm', 'dm', 'm']);
      var ltgB = [], ltgC = [], giua = d.BC / 2;
      if (lech(giua, d.DB)) ltgB.push({ gt: tron(giua), giaiThich: '$D$ không phải trung điểm $BC$ vì $AB \\ne AC$. Dùng $' + fr('DB', d.AB) + ' = ' + fr('DC', d.AC) + ' = ' + fr(d.BC, d.AB + d.AC) + '$.' });
      if (lech(d.DC, d.DB)) ltgB.push({ gt: d.DC, giaiThich: '$' + d.DC + '$ là $DC$ (đi với $AC$). $DB$ kề cạnh $AB = ' + d.AB + '$.' });
      if (lech(d.AC, d.DC) && lech(d.AC, giua)) ltgC.push({ gt: d.AC, giaiThich: 'Tỉ số bằng nhau chứ độ dài không bằng $AC$. Nhớ $DB + DC = BC = ' + d.BC + '$.' });
      var ti = d.BC + ' : ' + (d.AB + d.AC);
      return {
        de: 'Tam giác $ABC$ có $AB = ' + d.AB + '$ ' + dv + ', $AC = ' + d.AC + '$ ' + dv + ', $BC = ' + d.BC + '$ ' + dv + '. Đường phân giác của góc $A$ cắt $BC$ tại $D$. Tính $DB$ và $DC$ (' + dv + ').',
        hinh: hinhPG(['A', 'B', 'C', 'D'], d.AB, d.AC, d.BC, [['A', 'B', String(d.AB)], ['A', 'C', String(d.AC)], ['B', 'C', String(d.BC), false, 2.6]]),
        dapAn: { kieu: 'nhieuO', o: [
          { kieu: 'so', gt: d.DB, nhan: '$DB =$', loiThuongGap: ltgB },
          { kieu: 'so', gt: d.DC, nhan: '$DC =$', loiThuongGap: ltgC }] },
        goiY: ['$' + fr('DB', 'AB') + ' = ' + fr('DC', 'AC') + ' = ' + fr('DB + DC', 'AB + AC') + '$ và $DB + DC = BC$.',
          '$' + fr('DB', d.AB) + ' = ' + fr('DC', d.AC) + ' = ' + fr(d.BC, d.AB + d.AC) + '$.'],
        loiGiai: ['$' + fr('DB', d.AB) + ' = ' + fr('DC', d.AC) + ' = ' + fr('DB + DC', d.AB + ' + ' + d.AC) + ' = ' + fr(d.BC, d.AB + d.AC) + '$',
          '$DB = ' + fr(d.AB + ' \\cdot ' + d.BC, d.AB + d.AC) + ' = ' + d.DB + '$; $DC = ' + d.BC + ' - ' + d.DB + ' = ' + d.DC + '$ (' + dv + ').',
          'Kiểm tra: $' + d.DB + ' + ' + d.DC + ' = ' + d.BC + '$ (tỉ số chung là $' + ti + '$).']
      };
    } },

    { ten: 'Tính cạnh của tam giác', muc: 2, sinh: function (r) {
      var d = boSo(r), t = r.chon(BO_TEN), A = t[0], B = t[1], C = t[2], D = t[3];
      var hoiAC = r.dau() > 0, kq = hoiAC ? d.AC : d.AB, ltg = [];
      var tl = fr(D + B, D + C) + ' = ' + fr(A + B, A + C);
      var thay = hoiAC ? fr(d.DB, d.DC) + ' = ' + fr(d.AB, 'x') : fr(d.DB, d.DC) + ' = ' + fr('x', d.AC);
      var cong = hoiAC ? fr(d.AB + ' \\cdot ' + d.DC, d.DB) : fr(d.AC + ' \\cdot ' + d.DB, d.DC);
      var nguoc = hoiAC ? d.AB * d.DB / d.DC : d.AC * d.DC / d.DB;
      if (lech(nguoc, kq)) ltg.push({ gt: tron(nguoc), giaiThich: 'Em ghép ngược. $' + D + C + '$ kề $' + A + C + '$: đoạn dài hơn trên $' + B + C + '$ đi với cạnh dài hơn.' });
      return {
        de: 'Trong hình, $' + A + D + '$ là đường phân giác của góc $' + A + '$, ' + (hoiAC ? '$' + A + B + ' = ' + d.AB + '$' : '$' + A + C + ' = ' + d.AC + '$') +
          ', $' + D + B + ' = ' + d.DB + '$, $' + D + C + ' = ' + d.DC + '$. Tính $x = ' + (hoiAC ? A + C : A + B) + '$.',
        hinh: hinhPG(t, d.AB, d.AC, d.BC, [[A, B, hoiAC ? String(d.AB) : 'x'], [A, C, hoiAC ? 'x' : String(d.AC)], [B, D, String(d.DB)], [D, C, String(d.DC)]]),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$' + tl + '$.', '$' + thay + '$, nhân chéo.'],
        loiGiai: ['$' + tl + '$, tức $' + thay + '$', '$x = ' + cong + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Phân giác góc khác, tỉ số diện tích', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        // tỉ số diện tích hai tam giác chung đường cao
        var d = boSo(r), kq = cc.phanSo(d.AB, d.AC), ng = cc.phanSo(d.AC, d.AB);
        return {
          de: 'Tam giác $ABC$ có $AB = ' + d.AB + '$ cm, $AC = ' + d.AC + '$ cm, $BC = ' + d.BC + '$ cm, $AD$ là phân giác của góc $A$. Tính tỉ số diện tích $' + fr('S_{ABD}', 'S_{ACD}') + '$ (phân số tối giản).',
          hinh: hinhPG(['A', 'B', 'C', 'D'], d.AB, d.AC, d.BC, [['A', 'B', String(d.AB)], ['A', 'C', String(d.AC)]]),
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ['Hai tam giác $ABD$ và $ACD$ có **chung đường cao** kẻ từ $A$ xuống $BC$, nên tỉ số diện tích bằng $' + fr('DB', 'DC') + '$.', '$' + fr('DB', 'DC') + ' = ' + fr('AB', 'AC') + ' = ' + fr(d.AB, d.AC) + '$.'],
          loiGiai: ['Hai tam giác chung đường cao từ $A$ nên $' + fr('S_{ABD}', 'S_{ACD}') + ' = ' + fr('DB', 'DC') + '$.', '$' + fr('DB', 'DC') + ' = ' + fr('AB', 'AC') + ' = ' + fr(d.AB, d.AC) + ' = ' + kq.tex + '$'],
          loiThuongGap: [{ gt: ng.ascii, giaiThich: 'Đảo ngược rồi: tam giác $ABD$ chứa đoạn $DB$ (đi với $AB = ' + d.AB + '$).' }]
        };
      }
      // phân giác của góc B, cắt AC tại D: DA/DC = BA/BC
      var e = boSo(r); // vai: đỉnh B có phân giác; BA = e.AB, BC = e.AC, AC = e.BC
      var kq2 = e.DB, ltg = [];
      if (lech(e.DC, kq2)) ltg.push({ gt: e.DC, giaiThich: '$' + e.DC + '$ là $DC$. $DA$ kề cạnh $BA = ' + e.AB + '$.' });
      if (lech(e.BC / 2, kq2) && lech(e.BC / 2, e.DC)) ltg.push({ gt: tron(e.BC / 2), giaiThich: '$D$ không phải trung điểm của $AC$ vì $BA \\ne BC$.' });
      return {
        de: 'Tam giác $ABC$ có $AB = ' + e.AB + '$ cm, $BC = ' + e.AC + '$ cm, $AC = ' + e.BC + '$ cm. Đường phân giác của góc $B$ cắt $AC$ tại $D$. Tính $AD$ (cm).',
        hinh: hinhPG(['B', 'A', 'C', 'D'], e.AB, e.AC, e.BC, [['B', 'A', String(e.AB)], ['B', 'C', String(e.AC)], ['A', 'C', String(e.BC), false, 3]]),
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Phân giác góc $B$ chia cạnh **đối diện** $AC$: $' + fr('DA', 'DC') + ' = ' + fr('BA', 'BC') + '$.', '$' + fr('DA', e.AB) + ' = ' + fr('DC', e.AC) + ' = ' + fr('DA + DC', e.AB + ' + ' + e.AC) + ' = ' + fr(e.BC, e.AB + e.AC) + '$.'],
        loiGiai: ['$BD$ là phân giác của góc $B$ nên $' + fr('DA', 'DC') + ' = ' + fr('BA', 'BC') + '$, tức $' + fr('DA', e.AB) + ' = ' + fr('DC', e.AC) + ' = ' + fr(e.BC, e.AB + e.AC) + '$',
          '$AD = ' + fr(e.AB + ' \\cdot ' + e.BC, e.AB + e.AC) + ' = ' + kq2 + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế: lối đi phân giác', muc: 3, sinh: function (r) {
      var d = boSo(r), m = r.chon([5, 10]), AB = d.AB * m, AC = d.AC * m, BC = d.BC * m, DB = d.DB * m, DC = d.DC * m;
      var vat = r.chon(['Mảnh vườn', 'Khu đất', 'Thửa ruộng', 'Sân chơi']), nguoi = r.chon(['Bác Ba', 'Chú Nam', 'Cô Hoa', 'Ông Tư']);
      var hoiDB = r.dau() > 0, kq = hoiDB ? DB : DC, ltg = [];
      var khac = hoiDB ? DC : DB;
      if (lech(khac, kq)) ltg.push({ gt: khac, giaiThich: '$' + khac + '$ m là $' + (hoiDB ? 'DC' : 'DB') + '$. $' + (hoiDB ? 'DB' : 'DC') + '$ kề cạnh $' + (hoiDB ? 'AB' : 'AC') + '$.' });
      if (lech(BC / 2, kq) && lech(BC / 2, khac)) ltg.push({ gt: tron(BC / 2), giaiThich: 'Phân giác không chia đôi cạnh $BC$ (vì $AB \\ne AC$).' });
      return {
        de: vat + ' hình tam giác $ABC$ có $AB = ' + AB + '$ m, $AC = ' + AC + '$ m, $BC = ' + BC + '$ m. ' + nguoi + ' làm lối đi $AD$ theo đường phân giác của góc $A$ ($D \\in BC$). Tính $' + (hoiDB ? 'DB' : 'DC') + '$ (m).',
        hinh: hinhPG(['A', 'B', 'C', 'D'], AB, AC, BC, [['A', 'B', AB + ' m'], ['A', 'C', AC + ' m'], ['B', 'C', BC + ' m', false, 2.6]]),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$' + fr('DB', 'AB') + ' = ' + fr('DC', 'AC') + ' = ' + fr('BC', 'AB + AC') + '$.', '$' + fr(hoiDB ? 'DB' : 'DC', hoiDB ? AB : AC) + ' = ' + fr(BC, AB + AC) + '$.'],
        loiGiai: ['$' + fr('DB', AB) + ' = ' + fr('DC', AC) + ' = ' + fr('DB + DC', AB + ' + ' + AC) + ' = ' + fr(BC, AB + AC) + '$',
          '$' + (hoiDB ? 'DB' : 'DC') + ' = ' + fr((hoiDB ? AB : AC) + ' \\cdot ' + BC, AB + AC) + ' = ' + kq + '$ (m)'],
        loiThuongGap: ltg
      };
    } }
  ]);
})();
