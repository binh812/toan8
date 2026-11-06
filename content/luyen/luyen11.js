// Luyện thêm – Bài 11: Hình thang cân
(function () {
  'use strict';
  var CAM = '#d9480f', XANH = '#1971c2', TIM = '#9c36b5', XAM = { mau: '#868e96' };
  var TEN = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']];

  // ---------- Hình tĩnh (toạ độ dựng từ chính số liệu trong đề) ----------
  function rad(d) { return d * Math.PI / 180; }
  function toi(P, goc, l) { return [P[0] + l * Math.cos(rad(goc)), P[1] + l * Math.sin(rad(goc))]; }
  function lerp(P, Q, t) { return [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]; }
  function chuGoc(P, O, Q, k) {
    var ux = P[0] - O[0], uy = P[1] - O[1], vx = Q[0] - O[0], vy = Q[1] - O[1];
    var lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
    var wx = ux / lu + vx / lv, wy = uy / lu + vy / lv, lw = Math.hypot(wx, wy);
    if (lw < 1e-6) { wx = -uy / lu; wy = ux / lu; lw = 1; }
    return [O[0] + k * wx / lw, O[1] + k * wy / lw];
  }
  // o: { diem, vong, vach?:{AB:1}, canh?, goc?, soGoc?:[[P,O,Q,'chữ',hệ số xa?,màu?]], nhan?, lechTen?, ghiChu? }
  function hinhTG(o) {
    var D = o.diem, v = o.vong || [], canh = [], ten = Object.keys(D);
    v.forEach(function (a, i) { var b = v[(i + 1) % v.length], k = (o.vach || {})[a + b]; canh.push([a, b, k ? { vach: k } : {}]); });
    var xs = ten.map(function (n) { return D[n][0]; }), ys = ten.map(function (n) { return D[n][1]; });
    var s = Math.max(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys));
    var chu = (o.soGoc || []).map(function (g) {
      var p = chuGoc(D[g[0]], D[g[1]], D[g[2]], 0.17 * s * (g[4] || 1));
      return [p[0], p[1], g[3], g[5] || CAM];
    });
    return TOAN8.hinhGeo({ diem: D, to: v, canh: canh.concat(o.canh || []), goc: o.goc, nhan: o.nhan, lechTen: o.lechTen, ghiChu: o.ghiChu,
      them: function (board, G) {
        chu.forEach(function (c) { G.label(c[0], c[1], c[2], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: c[3] }); });
      } });
  }
  // Hình thang cân t[0]t[1]t[2]t[3] (đáy nhỏ t[0]t[1] ở trên, đáy lớn t[3]t[2] ở dưới) biết đáy lớn d, góc ở đáy lớn g, chiều cao h.
  function thangCan(t, d, g, h) {
    var x = h / Math.tan(rad(g)), o = {};
    o[t[0]] = [x, h]; o[t[1]] = [d - x, h]; o[t[2]] = [d, 0]; o[t[3]] = [0, 0];
    return o;
  }
  // Biết hai đáy a < b và cạnh bên c (c > (b − a)/2): toạ độ đúng tỉ lệ.
  function thangCanCanh(t, a, b, c) {
    var e = (b - a) / 2, h = Math.sqrt(c * c - e * e), o = {};
    o[t[0]] = [e, h]; o[t[1]] = [e + a, h]; o[t[2]] = [b, 0]; o[t[3]] = [0, 0];
    return o;
  }
  function G(n) { return '\\widehat{' + n + '}'; }
  function d(x) { return x + '^\\circ'; }
  function xa(v) { return v < 60 ? 1.4 : 1.05; }
  function boTrung(gt, ds) {
    var da = [gt];
    return ds.filter(function (l) {
      if (da.some(function (v) { return Math.abs(l.gt - v) < 1e-9; })) return false;
      da.push(l.gt); return true;
    });
  }
  function vachBen(t) { var o = {}; o[t[1] + t[2]] = 1; o[t[3] + t[0]] = 1; return o; }
  function bo(t, i) { return [t[(i + 3) % 4], t[i], t[(i + 1) % 4]]; }
  // Hình ở lời giải (cảnh "Nhìn là hiểu" bài 11): gập hình thang cân theo trục, theo chính số của đề
  function hg(them) { return { widget: 'canh', config: { ten: 'thangCan', chiXem: true, t: 1, thamSo: { trangThai: 'giai' }, tuyChon: them } }; }
  var VAI = ['A', 'B', 'C', 'D'];

  TOAN8.luyen(11, [
    { ten: 'Góc của hình thang cân', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), g = r.so(9, 16) * 5, h = r.chon([3, 3.5, 4]);
      var gt = [180 - g, 180 - g, g, g], i = r.so(0, 3), j;
      do { j = r.so(0, 3); } while (j === i);
      var v = gt[i], kq = gt[j], cungDay = (i < 2) === (j < 2);
      var dayI = i < 2 ? t[0] + t[1] : t[3] + t[2], m = [1, 0, 3, 2][i];
      var loiGiai;
      if (cungDay) loiGiai = ['Hai góc $' + t[i] + '$, $' + t[j] + '$ cùng kề đáy $' + dayI + '$ của hình thang cân nên bằng nhau.', '$' + G(t[j]) + ' = ' + G(t[i]) + ' = ' + d(kq) + '$'];
      else if ((i + j) % 2 === 1) loiGiai = ['Hai góc $' + t[i] + '$, $' + t[j] + '$ kề cùng một cạnh bên nên bù nhau: $' + G(t[i]) + ' + ' + G(t[j]) + ' = 180^\\circ$.', '$' + G(t[j]) + ' = 180^\\circ - ' + d(v) + ' = ' + d(kq) + '$'];
      else loiGiai = ['$' + G(t[m]) + ' = ' + G(t[i]) + ' = ' + d(v) + '$ (hai góc kề đáy $' + dayI + '$ của hình thang cân).',
        'Góc $' + t[j] + '$ và góc $' + t[m] + '$ kề cùng một cạnh bên nên bù nhau.', '$' + G(t[j]) + ' = 180^\\circ - ' + d(v) + ' = ' + d(kq) + '$'];
      return {
        de: 'Hình thang cân $' + t.join('') + '$ ($' + t[0] + t[1] + ' \\parallel ' + t[3] + t[2] + '$) trong hình có $' + G(t[i]) + ' = ' + d(v) + '$. Tính $' + G(t[j]) + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Hình thang cân: hai góc kề **một đáy** bằng nhau.', 'Trong hình thang, hai góc kề **một cạnh bên** thì bù nhau (tổng $180^\\circ$).'],
        loiGiai: loiGiai,
        loiThuongGap: boTrung(kq, [cungDay
          ? { gt: 180 - v, giaiThich: 'Hai góc $' + t[i] + '$, $' + t[j] + '$ cùng kề một đáy nên **bằng** nhau, không phải bù nhau.' }
          : { gt: v, giaiThich: 'Góc $' + t[j] + '$ không bằng góc $' + t[i] + '$. Hai góc kề một cạnh bên thì **bù** nhau.' }]),
        hinh: hinhTG({ diem: thangCan(t, 9, g, h), vong: t, vach: vachBen(t),
          goc: [bo(t, i), bo(t, j).concat([{ mau: XANH }])], soGoc: [bo(t, i).concat([v + '°', xa(v)]), bo(t, j).concat(['?', 1, XANH])] }),
        hinhGiai: hg((function () {
          var goc = {}; goc[VAI[i]] = v + '°'; goc[VAI[j]] = { dau: '?', giai: kq + '°' };
          return { dl: 9, gocDay: g, h: h, ten: t, goc: goc };
        })())
      };
    } },
    { ten: 'Chu vi hình thang cân', muc: 1, sinh: function (r) {
      var t = r.chon(TEN), e = r.so(1, 4), a = r.so(3, 9), b = a + 2 * e, c = r.so(e + 2, e + 6), P = a + b + 2 * c;
      return {
        de: 'Hình thang cân $' + t.join('') + '$ ($' + t[0] + t[1] + ' \\parallel ' + t[3] + t[2] + '$) trong hình có đáy nhỏ $' + t[0] + t[1] + ' = ' + a + '$ cm, đáy lớn $' + t[3] + t[2] + ' = ' + b + '$ cm và cạnh bên $' + t[3] + t[0] + ' = ' + c + '$ cm. Tính chu vi hình thang (cm).',
        dapAn: { kieu: 'so', gt: P },
        goiY: ['Hai cạnh bên của hình thang cân bằng nhau.', 'Chu vi bằng tổng **bốn** cạnh: hai đáy và hai cạnh bên.'],
        loiGiai: ['$' + t[1] + t[2] + ' = ' + t[3] + t[0] + ' = ' + c + '$ cm (hai cạnh bên của hình thang cân).',
          'Chu vi $= ' + a + ' + ' + b + ' + ' + c + ' + ' + c + ' = ' + P + '$ (cm)'],
        loiThuongGap: boTrung(P, [{ gt: a + b + c, giaiThich: 'Em mới cộng **một** cạnh bên. Hình thang có hai cạnh bên, mỗi cạnh $' + c + '$ cm.' }]),
        hinh: hinhTG({ diem: thangCanCanh(t, a, b, c), vong: t, vach: vachBen(t),
          nhan: [[t[0], t[1], a + ' cm', true], [t[3], t[2], b + ' cm'], [t[3], t[0], c + ' cm']] }),
        hinhGiai: hg({ dl: b, dn: a, canhBen: c, ten: t, nhan: { AB: a + ' cm', DC: b + ' cm', AD: c + ' cm', BC: { dau: '?', giai: c + ' cm' } } })
      };
    } },
    { ten: 'Đường cao hình thang cân', muc: 2, sinh: function (r) {
      var t = r.chon(TEN.slice(0, 2)), e = r.so(2, 6), a = r.so(4, 10), b = a + 2 * e, hoiD = r.dau() > 0, kq = hoiD ? e : a + e;
      var D = thangCan(t, b, r.chon([50, 55, 60, 65]), 0), h = Math.max(3, Math.min(0.5 * b, e * Math.tan(rad(r.chon([50, 55, 60])))));
      D[t[0]] = [e, h]; D[t[1]] = [e + a, h]; D.H = [e, 0];
      var lg = ['Kẻ $' + t[1] + 'K \\perp ' + t[3] + t[2] + '$. Ta có $HK = ' + t[0] + t[1] + ' = ' + a + '$ cm và $\\triangle ' + t[0] + 'H' + t[3] + ' = \\triangle ' + t[1] + 'K' + t[2] + '$ (cạnh huyền – góc nhọn) nên $' + t[3] + 'H = K' + t[2] + '$.',
        '$' + t[3] + 'H + K' + t[2] + ' = ' + t[3] + t[2] + ' - HK = ' + b + ' - ' + a + ' = ' + 2 * e + '$ (cm), nên $' + t[3] + 'H = ' + 2 * e + ' : 2 = ' + e + '$ cm.'];
      if (hoiD) lg[1] = '$' + t[3] + 'H + K' + t[2] + ' = ' + t[3] + t[2] + ' - HK = ' + b + ' - ' + a + ' = ' + 2 * e + '$ (cm)';
      lg.push(hoiD ? '$' + t[3] + 'H = ' + 2 * e + ' : 2 = ' + e + '$' : '$' + t[2] + 'H = ' + t[3] + t[2] + ' - ' + t[3] + 'H = ' + b + ' - ' + e + ' = ' + kq + '$');
      return {
        de: 'Hình thang cân $' + t.join('') + '$ trong hình có đáy nhỏ $' + t[0] + t[1] + ' = ' + a + '$ cm, đáy lớn $' + t[3] + t[2] + ' = ' + b + '$ cm, $' + t[0] + 'H$ là đường cao ($H \\in ' + t[3] + t[2] + '$). Tính $' + (hoiD ? t[3] + 'H' : t[2] + 'H') + '$ (cm).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Kẻ thêm đường cao $' + t[1] + 'K$. Hai tam giác vuông ở hai bên bằng nhau nên $' + t[3] + 'H = K' + t[2] + '$.', '$HK = ' + t[0] + t[1] + '$, nên phần còn lại $' + t[3] + t[2] + ' - ' + t[0] + t[1] + '$ chia đều cho hai bên.' + (hoiD ? '' : ' Rồi lấy $' + t[3] + t[2] + ' - ' + t[3] + 'H$.')],
        loiGiai: lg,
        loiThuongGap: boTrung(kq, hoiD
          ? [{ gt: 2 * e, giaiThich: '$' + 2 * e + '$ cm là tổng $' + t[3] + 'H + K' + t[2] + '$ ở **hai** bên. Hình thang cân đối xứng nên chia đôi.' }]
          : [{ gt: e, giaiThich: '$' + e + '$ cm là $' + t[3] + 'H$. Đề hỏi $' + t[2] + 'H = ' + t[3] + t[2] + ' - ' + t[3] + 'H$.' }, { gt: b - 2 * e, giaiThich: 'Em trừ cả hai phần thừa. $' + t[2] + 'H$ chỉ thiếu phần $' + t[3] + 'H$ ở một bên.' }]),
        hinh: hinhTG({ diem: D, vong: t, vach: vachBen(t), canh: [[t[0], 'H', { mau: TIM, day: 2, net: 2 }]], goc: [[t[0], 'H', t[2], XAM]],
          nhan: [[t[0], t[1], a + ' cm', true], [t[3], t[2], b + ' cm', false, 1.4], hoiD ? [t[3], 'H', '?', true, 0.8, XANH] : ['H', t[2], '?', true, 0.8, XANH]], lechTen: { H: [0, -18] } }),
        hinhGiai: hg({ dl: b, dn: a, h: h, duongCao: true, ten: t, nhan: hoiD ? { AB: a + ' cm', DC: b + ' cm', DH: { dau: '?', giai: e + ' cm' } } : { AB: a + ' cm', DC: b + ' cm', DH: e + ' cm', HC: { dau: '?', giai: kq + ' cm' } } })
      };
    } },
    { ten: 'Tam giác cân cắt bởi đường song song', muc: 2, sinh: function (r) {
      var al = r.so(20, 50) * 2, B = (180 - al) / 2, kq = 180 - B;
      var A = [0, 4 / Math.tan(rad(al / 2))], Bp = [-4, 0], C = [4, 0], k = r.chon([0.5, 0.55, 0.6]);
      var Dp = lerp(A, Bp, k), E = lerp(A, C, k), hoi = r.dau() > 0 ? ['B', 'D', 'E'] : ['C', 'E', 'D'];
      return {
        de: 'Tam giác $ABC$ cân tại $A$ có $\\widehat{BAC} = ' + d(al) + '$. Đường thẳng song song với $BC$ cắt $AB$ tại $D$, cắt $AC$ tại $E$ (hình). Tính góc $' + hoi.join('') + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$DE \\parallel BC$ và $\\widehat{B} = \\widehat{C}$ nên $DECB$ là hình thang cân. Tính $\\widehat{' + hoi[0] + '}$ trước.',
          'Trong hình thang $DECB$, góc $' + hoi.join('') + '$ và góc $' + hoi[0] + '$ kề cạnh bên $' + hoi[1] + hoi[0] + '$ nên bù nhau.'],
        loiGiai: ['$\\widehat{B} = \\widehat{C} = (180^\\circ - ' + d(al) + ') : 2 = ' + d(B) + '$ (tam giác $ABC$ cân tại $A$).',
          '$DE \\parallel BC$ nên $\\widehat{' + hoi.join('') + '} + \\widehat{' + hoi[0] + '} = 180^\\circ$ (hai góc kề cạnh bên $' + hoi[1] + hoi[0] + '$ của hình thang $DECB$).',
          '$\\widehat{' + hoi.join('') + '} = 180^\\circ - ' + d(B) + ' = ' + d(kq) + '$'],
        loiThuongGap: boTrung(kq, [{ gt: B, giaiThich: '$' + d(B) + '$ là góc $A' + hoi[1] + hoi[2] + '$ (đồng vị với $\\widehat{' + hoi[0] + '}$). Góc $' + hoi.join('') + '$ kề bù với nó.' }]),
        hinh: hinhTG({ diem: { A: A, B: Bp, C: C, D: Dp, E: E }, vong: ['A', 'B', 'C'], vach: { AB: 1, CA: 1 },
          canh: [['D', 'E', { mau: TIM, day: 4 }]], goc: [['B', 'A', 'C'], [hoi[0], hoi[1], hoi[2], { mau: XANH }]],
          soGoc: [['B', 'A', 'C', al + '°', al < 70 ? 1.2 : 0.9], [hoi[0], hoi[1], hoi[2], '?', 0.8, XANH]], lechTen: { D: [-16, 8], E: [16, 8] } }),
        hinhGiai: hg((function () {
          var goc = { S: al + '°', D: B + '°', C: B + '°' };
          goc[hoi[0] === 'B' ? 'A' : 'B'] = { dau: '?', giai: kq + '°' };
          return { dl: 8, gocDay: B, h: A[1] * (1 - k), dinh: 'A', ten: ['D', 'E', 'C', 'B'], goc: goc };
        })())
      };
    } },
    { ten: 'Hình thang cân có cạnh bên bằng đáy nhỏ', muc: 3, sinh: function (r) {
      var b = r.so(20, 40), D2 = 2 * b, A = 180 - D2, loai = r.chon(['A', 'C', 'DBC']);
      var Ap = toi([0, 0], D2, 4), Bp = [Ap[0] + 4, Ap[1]], Cp = [Bp[0] + 4 * Math.cos(rad(D2)), 0];
      var lg = ['$AB = AD$ nên tam giác $ABD$ cân tại $A$: $\\widehat{ADB} = \\widehat{ABD} = ' + d(b) + '$.',
        '$AB \\parallel CD$ nên $\\widehat{BDC} = \\widehat{ABD} = ' + d(b) + '$ (so le trong). Do đó $\\widehat{ADC} = ' + d(b) + ' + ' + d(b) + ' = ' + d(D2) + '$.'];
      var kq, hoi, ltg;
      if (loai === 'A') { kq = A; hoi = 'DAB'; lg.push('$\\widehat{DAB} = 180^\\circ - ' + d(D2) + ' = ' + d(A) + '$');
        ltg = [{ gt: 180 - b, giaiThich: 'Em lấy $\\widehat{D} = ' + d(b) + '$. Góc $D$ của hình thang gồm hai phần $\\widehat{ADB} + \\widehat{BDC} = ' + d(D2) + '$.' }];
      } else if (loai === 'C') { kq = D2; hoi = 'BCD'; lg.push('Hình thang cân nên $\\widehat{BCD} = \\widehat{ADC} = ' + d(D2) + '$');
        ltg = [{ gt: b, giaiThich: 'Góc $D$ của hình thang là $\\widehat{ADB} + \\widehat{BDC}$, gấp đôi $' + d(b) + '$.' }];
      } else { kq = A - b; hoi = 'DBC'; lg.push('$\\widehat{ABC} = \\widehat{DAB} = 180^\\circ - ' + d(D2) + ' = ' + d(A) + '$ (hai góc kề đáy $AB$).', '$\\widehat{DBC} = \\widehat{ABC} - \\widehat{ABD} = ' + d(A) + ' - ' + d(b) + ' = ' + d(kq) + '$');
        ltg = [{ gt: A, giaiThich: '$' + d(A) + '$ là cả góc $ABC$. Góc $DBC$ chỉ là phần còn lại sau khi bớt $\\widehat{ABD}$.' }];
      }
      return {
        de: 'Hình thang cân $ABCD$ ($AB \\parallel CD$) trong hình có $AB = AD$ và $\\widehat{ABD} = ' + d(b) + '$. Tính góc $' + hoi + '$ (độ).',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tam giác $ABD$ có $AB = AD$ nên cân tại $A$. $AB \\parallel CD$ cho một cặp góc so le trong.', 'Tính góc $ADC$ của hình thang trước, rồi dùng tính chất góc của hình thang cân.'],
        loiGiai: lg,
        loiThuongGap: boTrung(kq, ltg),
        hinh: hinhTG({ diem: { A: Ap, B: Bp, C: Cp, D: [0, 0] }, vong: ['A', 'B', 'C', 'D'], vach: { AB: 1, DA: 1 }, canh: [['B', 'D', { mau: TIM, day: 2 }]],
          goc: [['A', 'B', 'D'], [hoi[0], hoi[1], hoi[2], { mau: XANH }]],
          soGoc: [['A', 'B', 'D', b + '°', 1.7], [hoi[0], hoi[1], hoi[2], '?', loai === 'DBC' ? 1.2 : 0.9, XANH]] })
      };
    } },
    { ten: 'Bài toán thực tế: cạnh bên', muc: 3, sinh: function (r) {
      var bc = r.chon([{ vat: 'Một khung ảnh', dv: 'cm' }, { vat: 'Một mảnh vườn', dv: 'm' }, { vat: 'Mặt cắt ngang của một con đê', dv: 'm' }, { vat: 'Một tấm kính cửa sổ', dv: 'dm' }]);
      var a = r.so(4, 12), k = r.so(1, 4) * 2, c = r.so(k / 2 + 2, k / 2 + 8), b = a + k, P = a + b + 2 * c, t = ['A', 'B', 'C', 'D'];
      return {
        de: bc.vat + ' có dạng hình thang cân $ABCD$ ($AB \\parallel CD$) với chu vi $' + P + '$ ' + bc.dv + '. Đáy nhỏ $AB = ' + a + '$ ' + bc.dv + ', đáy lớn dài hơn đáy nhỏ $' + k + '$ ' + bc.dv + '. Tính độ dài mỗi cạnh bên (' + bc.dv + ').',
        dapAn: { kieu: 'so', gt: c },
        goiY: ['Tính đáy lớn trước, rồi tính tổng hai cạnh bên = chu vi − tổng hai đáy.', 'Hai cạnh bên của hình thang cân bằng nhau: chia đôi.'],
        loiGiai: ['Đáy lớn: $CD = ' + a + ' + ' + k + ' = ' + b + '$ (' + bc.dv + ').',
          'Tổng hai cạnh bên: $' + P + ' - (' + a + ' + ' + b + ') = ' + 2 * c + '$ (' + bc.dv + ').',
          'Mỗi cạnh bên: $AD = BC = ' + 2 * c + ' : 2 = ' + c + '$'],
        loiThuongGap: boTrung(c, [{ gt: 2 * c, giaiThich: '$' + 2 * c + '$ ' + bc.dv + ' là tổng **hai** cạnh bên. Chia đôi mới được mỗi cạnh.' },
          { gt: (P - a - k) / 2, giaiThich: 'Em trừ $' + k + '$ thay cho đáy lớn. Đáy lớn là $' + a + ' + ' + k + ' = ' + b + '$ ' + bc.dv + '.' }]),
        hinh: hinhTG({ diem: thangCanCanh(t, a, b, c), vong: t, vach: vachBen(t),
          nhan: [['A', 'B', a + ' ' + bc.dv, true],['D', 'A', '?', false, 1, XANH], ['B', 'C', '?', false, 1, XANH]] })
      };
    } }
  ]);
})();
