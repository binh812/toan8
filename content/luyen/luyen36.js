// Luyện thêm – Bài 36: Các trường hợp đồng dạng của hai tam giác vuông
(function () {
  'use strict';
  var TIM = '#9c36b5', CAM = '#d9480f', XANH = '#1971c2', NAU = '#7f4f24', VANG = '#f59f00';
  var geo = TOAN8.hinhGeo;
  var BO3 = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]];
  function nh(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }
  // Hai tam giác vuông tại T[0], U[0]: cạnh đứng d1/d2, cạnh ngang n1/n2; đặt cạnh nhau.
  function haiVuong(T, d1, n1, U, d2, n2, nhan) {
    var D = {}, dx = n1 + Math.max(1.5, 0.3 * n1);
    D[T[0]] = [0, 0]; D[T[1]] = [0, d1]; D[T[2]] = [n1, 0];
    D[U[0]] = [dx, 0]; D[U[1]] = [dx, d2]; D[U[2]] = [dx + n2, 0];
    var s = 0.08 * Math.max(d1, n1, d2, n2);
    return geo({ diem: D, to: T,
      canh: [[T[0], T[1]], [T[0], T[2]], [T[1], T[2]], [U[0], U[1], { mau: TIM }], [U[0], U[2], { mau: TIM }], [U[1], U[2], { mau: TIM }]],
      goc: [[T[1], T[0], T[2], { mau: '#495057', r: s }], [U[1], U[0], U[2], { mau: '#495057', r: s }]], nhan: nhan });
  }

  TOAN8.luyen(36, [
    { ten: 'Đồng dạng nhờ một góc nhọn (đúng/sai)', muc: 1, sinh: function (r) {
      var b = r.so(5, 15) * 5 + r.chon([0, 0, 2]), cach = r.so(0, 2), f;
      if (b === 45) b = 40;
      f = cach === 0 ? b : cach === 1 ? 90 - b : r.chon([b + 10, b - 10, 90 - b + 5]);
      if (f === 45 && b !== 45) f = 50;
      var dung = f === b || f === 90 - b;
      return {
        de: 'Tam giác $ABC$ vuông tại $A$ có $\\widehat{B} = ' + b + '^\\circ$; tam giác $DEF$ vuông tại $D$ có $\\widehat{F} = ' + f + '^\\circ$. Khẳng định "hai tam giác này đồng dạng" đúng hay sai?',
        dapAn: { kieu: 'dungSai', gt: dung },
        goiY: ['Hai tam giác vuông đồng dạng nếu có **một góc nhọn** bằng nhau.', 'Tính góc nhọn còn lại của mỗi tam giác: $\\widehat{C} = 90^\\circ - \\widehat{B}$, $\\widehat{E} = 90^\\circ - \\widehat{F}$.'],
        loiGiai: ['$\\widehat{C} = 90^\\circ - ' + b + '^\\circ = ' + (90 - b) + '^\\circ$; $\\widehat{E} = 90^\\circ - ' + f + '^\\circ = ' + (90 - f) + '^\\circ$.',
          dung ? 'Có một cặp góc nhọn bằng nhau (' + (f === b ? '$\\widehat{B} = \\widehat{F}$' : '$\\widehat{C} = \\widehat{F}$') + ') nên hai tam giác vuông đồng dạng. Khẳng định **đúng**.'
            : 'Các góc nhọn $' + b + '^\\circ, ' + (90 - b) + '^\\circ$ và $' + f + '^\\circ, ' + (90 - f) + '^\\circ$ không có cặp nào bằng nhau nên hai tam giác **không** đồng dạng. Khẳng định **sai**.']
      };
    } },
    { ten: 'Hai cạnh góc vuông tỉ lệ', muc: 2, sinh: function (r, cc) {
      var t = r.chon(BO3.slice(0, 4)), m = r.chon([1, 2]), k = r.chon([1.5, 2, 2.5, 3, 0.5]);
      if (k === 0.5) m = 2;
      var a = t[0] * m, b = t[1] * m, c = t[2] * m, a2 = a * k, b2 = b * k, kq = c * k;
      var U = ["A'", "B'", "C'"];
      return {
        de: "Tam giác $ABC$ vuông tại $A$ có $AB = " + a + "$, $AC = " + b + "$; tam giác $A'B'C'$ vuông tại $A'$ có $A'B' = " + cc.so(a2) + "$, $A'C' = " + cc.so(b2) + "$. Tính $x = B'C'$.",
        hinh: haiVuong(['A', 'B', 'C'], a, b, U, a2, b2, [['A', 'B', String(a)], ['A', 'C', String(b)], ["A'", "B'", nh(a2), false, 1, TIM], ["A'", "C'", nh(b2), false, 1, TIM], ["B'", "C'", 'x', true, 1, TIM]]),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ["So sánh $\\frac{A'B'}{AB}$ và $\\frac{A'C'}{AC}$: hai cạnh góc vuông tỉ lệ thì hai tam giác vuông đồng dạng.", "Tính $BC$ bằng Pythagore rồi nhân với tỉ số đồng dạng (hoặc dùng Pythagore ngay trong $\\triangle A'B'C'$)."],
        loiGiai: ["$\\frac{A'B'}{AB} = \\frac{" + cc.so(a2) + '}{' + a + "} = " + cc.so(k) + "$, $\\frac{A'C'}{AC} = \\frac{" + cc.so(b2) + '}{' + b + '} = ' + cc.so(k) + "$ nên $\\triangle A'B'C' \\backsim \\triangle ABC$ với tỉ số $" + cc.so(k) + '$.',
          '$BC = \\sqrt{' + a + '^2 + ' + b + '^2} = \\sqrt{' + c * c + '} = ' + c + '$.',
          "$x = " + cc.so(k) + ' \\cdot ' + c + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: c, giaiThich: "Đó là $BC$. Em còn phải nhân với tỉ số đồng dạng $" + cc.so(k) + "$ để ra $B'C'$." }]
      };
    } },
    { ten: 'Cạnh huyền – cạnh góc vuông', muc: 2, sinh: function (r, cc) {
      var t = r.chon(BO3), k = r.chon([[3, 2], [2, 1], [1, 2], [5, 2], [3, 1], [2, 3]]), m = k[1];
      var a = t[0] * m, b = t[1] * m, c = t[2] * m, kv = k[0] / k[1];
      if (r.dau() > 0) { var tmp = a; a = b; b = tmp; }
      var DE = a * kv, EF = c * kv, kq = b * kv, kt = cc.phanSo(k[0], k[1]).tex;
      return {
        de: 'Tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = ' + c + '$, $AB = ' + a + '$; tam giác $DEF$ vuông tại $D$ có cạnh huyền $EF = ' + cc.so(EF) + '$, $DE = ' + cc.so(DE) + '$. Tính $x = DF$.',
        hinh: haiVuong(['A', 'B', 'C'], a, b, ['D', 'E', 'F'], DE, kq, [['A', 'B', String(a)], ['B', 'C', String(c)], ['D', 'E', nh(DE), false, 1, TIM], ['E', 'F', nh(EF), false, 1, TIM], ['D', 'F', 'x', false, 1, TIM]]),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['So sánh $\\frac{EF}{BC}$ và $\\frac{DE}{AB}$. Cạnh huyền và một cạnh góc vuông tỉ lệ thì hai tam giác vuông đồng dạng.', 'Tính $AC$ bằng Pythagore rồi nhân với tỉ số đồng dạng.'],
        loiGiai: ['$\\frac{EF}{BC} = \\frac{DE}{AB} = ' + kt + '$ nên $\\triangle DEF \\backsim \\triangle ABC$ với tỉ số $' + kt + '$.',
          '$AC = \\sqrt{' + c + '^2 - ' + a + '^2} = \\sqrt{' + b * b + '} = ' + b + '$.',
          '$x = DF = ' + kt + ' \\cdot ' + b + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: b, giaiThich: 'Đó là $AC$ của tam giác $ABC$. Cạnh $DF$ phải nhân thêm tỉ số đồng dạng $' + kt + '$.' }]
      };
    } },
    { ten: 'Đường cao trong tam giác vuông', muc: 2, sinh: function (r, cc) {
      var m = r.chon([0.2, 0.4, 0.6, 1, 2]), dao = r.dau() > 0;
      var bh = 9 * m, ch = 16 * m, ah = 12 * m, ab = 15 * m, ac = 20 * m;
      if (dao) { var t1 = bh; bh = ch; ch = t1; t1 = ab; ab = ac; ac = t1; }
      var f = function (x) { return +x.toFixed(6); };
      bh = f(bh); ch = f(ch); ah = f(ah); ab = f(ab); ac = f(ac);
      var bc = f(bh + ch), H = [bh, 0], A = [bh, ah];
      return {
        de: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$ với $BH = ' + cc.so(bh) + '$ cm, $CH = ' + cc.so(ch) + '$ cm. Tính $AH$, $AB$, $AC$ (cm).',
        hinh: geo({ diem: { B: [0, 0], C: [bc, 0], A: A, H: H }, to: ['A', 'B', 'C'],
          canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'H', { mau: TIM, net: 2 }]],
          goc: [['B', 'A', 'C', { mau: '#495057', r: 0.06 * bc }], ['A', 'H', 'C', { mau: '#495057', r: 0.05 * bc }]],
          nhan: [['B', 'H', nh(bh)], ['H', 'C', nh(ch)]], lechTen: { H: [0, -16], A: [0, 16] } }),
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$AH =$', kieu: 'so', gt: ah, loiThuongGap: [{ gt: (bh + ch) / 2, giaiThich: '$AH$ không phải trung bình cộng của $BH$ và $CH$. Từ $\\triangle HBA \\backsim \\triangle HAC$: $AH^2 = BH \\cdot CH$.' }] },
          { nhan: '$AB =$', kieu: 'so', gt: ab },
          { nhan: '$AC =$', kieu: 'so', gt: ac }] },
        goiY: ['$\\triangle HBA \\backsim \\triangle HAC$ (cùng vuông tại $H$, $\\widehat{HBA} = \\widehat{HAC}$ vì cùng phụ $\\widehat{HAB}$), suy ra $AH^2 = BH \\cdot CH$.',
          'Có $AH$ rồi thì tính $AB$, $AC$ bằng Pythagore trong hai tam giác vuông $AHB$, $AHC$.'],
        loiGiai: ['$\\triangle HBA \\backsim \\triangle HAC$ nên $\\frac{AH}{CH} = \\frac{BH}{AH}$, tức $AH^2 = BH \\cdot CH = ' + cc.so(bh) + ' \\cdot ' + cc.so(ch) + ' = ' + cc.so(f(ah * ah)) + '$, nên $AH = ' + cc.so(ah) + '$.',
          '$AB = \\sqrt{AH^2 + BH^2} = \\sqrt{' + cc.so(f(ah * ah)) + ' + ' + cc.so(f(bh * bh)) + '} = ' + cc.so(ab) + '$.',
          '$AC = \\sqrt{AH^2 + CH^2} = \\sqrt{' + cc.so(f(ah * ah)) + ' + ' + cc.so(f(ch * ch)) + '} = ' + cc.so(ac) + '$.']
      };
    } },
    { ten: 'Tỉ số đường cao và diện tích', muc: 2, sinh: function (r, cc) {
      var k = r.chon([[3, 2], [2, 1], [3, 1], [1, 2], [2, 3], [5, 2], [4, 3]]), t = r.so(1, 3);
      var h1 = k[0] * t, h0 = k[1] * t, S = k[1] * k[1] * r.so(2, 9), kq = S * k[0] * k[0] / (k[1] * k[1]), kt = cc.phanSo(k[0], k[1]).tex;
      return {
        de: "Cho $\\triangle A'B'C' \\backsim \\triangle ABC$; đường cao $A'H' = " + h1 + "$ cm, đường cao tương ứng $AH = " + h0 + "$ cm. Diện tích $\\triangle ABC$ là $" + S + "$ cm². Tính diện tích $\\triangle A'B'C'$ (cm²).",
        dapAn: { kieu: 'so', gt: kq },
        goiY: ["Tỉ số hai đường cao tương ứng bằng tỉ số đồng dạng $k = \\frac{A'H'}{AH}$. Cạnh đáy $B'C'$ cũng bằng $k \\cdot BC$.", 'Diện tích $= \\frac{1}{2}$ đáy $\\cdot$ cao: cả đáy và cao cùng nhân $k$ nên diện tích nhân $k^2$.'],
        loiGiai: ["$k = \\frac{A'H'}{AH} = \\frac{" + h1 + '}{' + h0 + '}' + (t > 1 || k[1] === 1 ? ' = ' + kt : '') + "$; $B'C' = k \\cdot BC$, $A'H' = k \\cdot AH$.",
          "$S_{A'B'C'} = \\frac{1}{2} B'C' \\cdot A'H' = k^2 \\cdot S_{ABC}$.",
          "$S_{A'B'C'} = \\left(" + kt + '\\right)^2 \\cdot ' + S + ' = ' + cc.so(kq) + '$'],
        loiThuongGap: [{ gt: S * k[0] / k[1], giaiThich: 'Em chỉ nhân với $k$. Diện tích tỉ lệ với $k^2$ (cả đáy và chiều cao đều nhân $k$).' }]
      };
    } },
    { ten: 'Đo chiều cao bằng bóng nắng, cọc ngắm', muc: 3, sinh: function (r, cc) {
      if (r.dau() > 0) {
        var ng = r.chon([[1.5, 2], [1.6, 2], [1.2, 1.5], [1.4, 2], [1.8, 2.4], [1.5, 1.2]]), q = r.chon([4, 5, 6, 8, 10]);
        var bong = +(ng[1] * q).toFixed(6), h = +(ng[0] * q).toFixed(6);
        var ai = r.chon(['bạn Việt', 'bạn Lan', 'chú Nam']), vat = r.chon(['cột cờ', 'cây bàng', 'ngôi nhà', 'cột điện']);
        return {
          de: 'Cùng một thời điểm, ' + ai + ' cao $' + cc.so(ng[0]) + '$ m có bóng trên mặt đất dài $' + cc.so(ng[1]) + '$ m, còn ' + vat + ' có bóng dài $' + cc.so(bong) + '$ m. Tính chiều cao $h$ của ' + vat + ' (m).',
          hinh: geo({ diem: { A: [bong, 0], C: [bong, h], B: [0, 0] },
            canh: [['B', 'A'], ['A', 'C', { mau: NAU, day: 5 }], ['C', 'B', { mau: VANG, day: 2, net: 2 }]],
            goc: [['B', 'A', 'C', { mau: '#495057', r: 0.07 * Math.max(bong, h) }], ['A', 'B', 'C', { mau: VANG, r: 0.12 * Math.max(bong, h) }]],
            nhan: [['B', 'A', nh(bong) + ' m'], ['A', 'C', 'h', true]],
            ghiChu: 'Tia nắng CB, bóng BA' }),
          dapAn: { kieu: 'so', gt: h },
          goiY: ['Tia nắng song song nên góc tạo bởi tia nắng với mặt đất như nhau: hai tam giác vuông (vật – bóng – tia nắng) đồng dạng (g.g).', 'Tỉ số chiều cao : bóng của ' + vat + ' bằng tỉ số đó của ' + ai + '.'],
          loiGiai: ['Hai tam giác vuông có góc nắng bằng nhau nên đồng dạng: $\\frac{h}{' + cc.so(bong) + '} = \\frac{' + cc.so(ng[0]) + '}{' + cc.so(ng[1]) + '}$.',
            '$h = \\frac{' + cc.so(ng[0]) + ' \\cdot ' + cc.so(bong) + '}{' + cc.so(ng[1]) + '} = ' + cc.so(h) + '$'],
          loiThuongGap: [{ gt: ng[1] * bong / ng[0], giaiThich: 'Em lật ngược tỉ số. Lập đúng: $\\frac{\\text{cao}}{\\text{bóng}}$ của hai vật bằng nhau.' }]
        };
      }
      // cọc ngắm: mắt cao e, cọc cao c, người cách cọc d1, cọc cách cây d2
      var e = 1.5, c = r.chon([2, 2.5, 3]), d1 = r.chon([1, 1.5, 2]), q2 = r.chon([3, 4, 5, 6]);
      var d2 = +(d1 * (q2 - 1)).toFixed(6), hc = +(e + (c - e) * q2).toFixed(6);
      return {
        de: 'Để đo chiều cao $h$ của một cái cây, người ta cắm cọc cao $' + cc.so(c) + '$ m thẳng đứng cách gốc cây $' + cc.so(d2) + '$ m. Người đo đứng cách cọc $' + cc.so(d1) + '$ m (cọc ở giữa người và cây), mắt cách mặt đất $1{,}5$ m, nhìn thấy đỉnh cọc và ngọn cây thẳng hàng. Tính $h$ (m).',
        hinh: geo({ diem: { M: [0, e], K: [d1, e], P: [d1, c], H: [d1 + d2, e], N: [d1 + d2, hc] },
          canh: [['M', 'H', { mau: '#adb5bd', net: 2, day: 1 }], ['K', 'P', { mau: CAM, day: 4 }], ['H', 'N', { mau: NAU, day: 5 }], ['M', 'N', { mau: VANG, net: 2, day: 2 }]],
          nhan: [['M', 'K', nh(d1) + ' m', false, 1.2], ['K', 'H', nh(d2) + ' m', false, 1.2]], lechTen: { K: [12, -12], M: [-16, 6] },
          ghiChu: 'Mắt M cao 1,5 m; đỉnh cọc P; ngọn cây N',
          ve: [[[0, 0], [d1 + d2 + 0.5, 0], { mau: '#868e96', day: 3 }], [[0, 0], [0, e], { mau: XANH, day: 4 }], [[d1, 0], [d1, e], { mau: CAM, day: 4 }], [[d1 + d2, 0], [d1 + d2, e], { mau: NAU, day: 5 }], [[0, 1.2 * hc], [0.01, 1.2 * hc], { mau: '#ffffff', day: 0 }]] }),
        dapAn: { kieu: 'so', gt: hc },
        goiY: ['Kẻ đường ngang qua mắt $M$ cắt cọc tại $K$, cắt cây tại $H$. Hai tam giác vuông $MKP$ và $MHN$ đồng dạng (chung góc $M$).', '$PK = ' + cc.so(c) + ' - 1{,}5$; $\\frac{NH}{PK} = \\frac{MH}{MK}$. Cuối cùng cộng thêm $1{,}5$ m.'],
        loiGiai: ['$PK = ' + cc.so(c) + ' - 1{,}5 = ' + cc.so(c - e) + '$ (m); $MK = ' + cc.so(d1) + '$, $MH = ' + cc.so(d1) + ' + ' + cc.so(d2) + ' = ' + cc.so(d1 + d2) + '$ (m).',
          '$\\triangle MKP \\backsim \\triangle MHN$ nên $NH = ' + cc.so(c - e) + ' \\cdot \\frac{' + cc.so(d1 + d2) + '}{' + cc.so(d1) + '} = ' + cc.so(hc - e) + '$ (m).',
          '$h = ' + cc.so(hc - e) + ' + 1{,}5 = ' + cc.so(hc) + '$'],
        loiThuongGap: [{ gt: +(hc - e).toFixed(6), giaiThich: 'Em quên cộng chiều cao từ mặt đất lên tới mắt ($1{,}5$ m).' }]
      };
    } }
  ]);
})();
