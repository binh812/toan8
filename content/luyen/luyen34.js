// Luyện thêm – Bài 34: Ba trường hợp đồng dạng của hai tam giác
(function () {
  'use strict';
  var TIM = '#9c36b5', CAM = '#d9480f', XANH = '#1971c2';
  var geo = TOAN8.hinhGeo, hh = TOAN8.hh;
  function nh(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }
  function tang(m) { return m.slice().sort(function (p, q) { return p - q; }); }
  function baCanh(r, lo, hi) {
    for (var t = 0; t < 200; t++) {
      var x = r.khacNhau(3, lo, hi), s = tang(x);
      if (s[0] + s[1] > s[2] + 1) return x;
    }
    return [4, 5, 6];
  }
  // Hình giải: bản sao tam giác thứ nhất trượt rồi phóng lên, so với tam giác thứ hai (khít thì đồng dạng)
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c) }; }
  // Ba cạnh xếp tăng dần, cạnh lớn nhất làm đáy: [d01, d12, d20]
  function day(x) { var s = tang(x); return [s[0], s[2], s[1]]; }
  function haiTG(h1, h2, them) {
    h2.dat = { sau: 0 };
    return hg({ ten: 'trungKhit', tuyChon: Object.assign({ hinh: [h1, h2], di: [{ tu: 0, toi: 1, neo: 1, mau: '--a' }] }, them || {}) });
  }
  function lietKe(m, cc) { return m.map(function (v) { return cc.so(v); }).join('$ cm, $'); }

  TOAN8.luyen(34, [
    { ten: 'Kiểm tra c.c.c (đúng/sai)', muc: 1, sinh: function (r, cc) {
      var x = baCanh(r, 2, 8), q = r.so(1, 2), p = r.so(2, 4);
      while (p === q) p = r.so(2, 4);
      var t1 = x.map(function (v) { return v * q; }), t2 = r.xaoTron(x.map(function (v) { return v * p; }));
      var dung = r.dau() > 0;
      if (!dung) {
        var i = r.so(0, 2);
        t2 = t2.slice(); t2[i] += r.chon([-1, 1]);
        var s2 = tang(t2);
        if (s2[0] + s2[1] <= s2[2] || s2[0] < 1) { t2[i] += 2; }
      }
      var a = tang(t1), b = tang(t2);
      var ts = [0, 1, 2].map(function (j) { return '\\frac{' + b[j] + '}{' + a[j] + '}'; });
      var bang = Math.abs(b[0] * a[1] - b[1] * a[0]) < 1e-9 && Math.abs(b[1] * a[2] - b[2] * a[1]) < 1e-9;
      var kq = cc.phanSo(b[0], a[0]).tex;
      return {
        de: 'Tam giác thứ nhất có ba cạnh $' + lietKe(t1, cc) + '$ cm. Tam giác thứ hai có ba cạnh $' + lietKe(t2, cc) + '$ cm. Khẳng định "hai tam giác đồng dạng" đúng hay sai?',
        hinhGiai: haiTG({ dai: day(a), canh: day(a).map(nh) }, { dai: day(b), canh: day(b).map(nh) }),
        dapAn: { kieu: 'dungSai', gt: bang },
        goiY: ['Xếp ba cạnh mỗi tam giác từ nhỏ đến lớn rồi ghép cặp: nhỏ với nhỏ, vừa với vừa, lớn với lớn.', 'Tính ba tỉ số. Ba tỉ số bằng nhau thì hai tam giác đồng dạng (c.c.c).'],
        loiGiai: ['Xếp tăng dần: $' + a.join(', ') + '$ và $' + b.join(', ') + '$.',
          'Ba tỉ số: $' + ts.join(',\\ ') + '$.',
          bang ? 'Ba tỉ số cùng bằng $' + kq + '$ nên hai tam giác đồng dạng (c.c.c). Khẳng định **đúng**.' : 'Ba tỉ số không bằng nhau nên hai tam giác **không** đồng dạng. Khẳng định **sai**.']
      };
    } },
    { ten: 'Chọn kí hiệu đúng (g.g)', muc: 1, sinh: function (r) {
      var g;
      do { g = [r.so(6, 16) * 5, r.so(6, 16) * 5]; g.push(180 - g[0] - g[1]); }
      while (g[2] < 30 || g[0] === g[1] || g[0] === g[2] || g[1] === g[2]);
      var U = r.chon([['M', 'N', 'P'], ['D', 'E', 'F'], ['H', 'I', 'K']]);
      var gan = r.xaoTron([0, 1, 2]); // đỉnh U[i] có góc g[gan[i]]
      var dinhCo = []; gan.forEach(function (gi, i) { dinhCo[gi] = U[i]; }); // dinhCo[j]: đỉnh của U có góc g[j]
      var dung = dinhCo.join('');
      var bo = [], lo = r.so(0, 2); // không cho góc thứ lo của tam giác U
      [0, 1, 2].forEach(function (i) { if (i !== lo) bo.push('\\widehat{' + U[i] + '} = ' + g[gan[i]] + '^\\circ'); });
      var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(function (p) { return p.map(function (i) { return U[i]; }).join(''); })
        .filter(function (s) { return s !== dung; });
      var luaChon = r.xaoTron([dung].concat(r.xaoTron(perms).slice(0, 3)));
      // Tam giác thứ hai vẽ theo đúng thứ tự góc của tam giác ABC, ghi các góc đề cho
      var mauG = ['--a', '--b', '--cc'], gocU = [0, 1, 2].map(function (m) {
        var i = U.indexOf(dinhCo[m]);
        return i === lo ? mauG[m] : { mau: mauG[m], nhan: g[m] + '°' };
      });
      var hinhG = haiTG({ goc3: g, day: 3.4, ten: ['A', 'B', 'C'], goc: [{ mau: mauG[0], nhan: g[0] + '°' }, { mau: mauG[1], nhan: g[1] + '°' }, mauG[2]] },
        { goc3: g, day: 4, ten: dinhCo, goc: gocU, dat: {} });
      hinhG.config.ghiChu = 'Góc cùng màu bằng nhau.';
      return {
        hinhGiai: hinhG,
        de: 'Tam giác $ABC$ có $\\widehat{A} = ' + g[0] + '^\\circ$, $\\widehat{B} = ' + g[1] + '^\\circ$. Tam giác $' + U.join('') + '$ có $' + bo.join('$, $') + '$. Kí hiệu đồng dạng nào **đúng**?',
        dapAn: { kieu: 'chon', gt: luaChon.indexOf(dung), luaChon: luaChon.map(function (s) { return '$\\triangle ABC \\backsim \\triangle ' + s + '$'; }) },
        goiY: ['Tính góc còn lại của mỗi tam giác (tổng ba góc bằng $180^\\circ$).', 'Ghép đỉnh có góc bằng nhau rồi viết đúng thứ tự: đỉnh ứng với $A$ đứng đầu, ứng với $B$ đứng thứ hai.'],
        loiGiai: ['$\\widehat{C} = 180^\\circ - ' + g[0] + '^\\circ - ' + g[1] + '^\\circ = ' + g[2] + '^\\circ$; $\\widehat{' + U[lo] + '} = 180^\\circ - ' + bo.map(function (s) { return s.split(' = ')[1]; }).join(' - ') + ' = ' + g[gan[lo]] + '^\\circ$.',
          '$\\widehat{A} = \\widehat{' + dinhCo[0] + '}$, $\\widehat{B} = \\widehat{' + dinhCo[1] + '}$ nên $\\triangle ABC \\backsim \\triangle ' + dung + '$ (g.g).']
      };
    } },
    { ten: 'Tìm ba cạnh khi biết chu vi', muc: 2, sinh: function (r, cc) {
      var x = baCanh(r, 2, 9), k = r.chon([2, 3, 4, 5, 1.5, 2.5]), s = x[0] + x[1] + x[2];
      var P = s * k, kq = tang(x).map(function (v) { return v * k; });
      return {
        hinhGiai: haiTG({ dai: day(x), canh: day(x).map(nh) }, { dai: day(x).map(function (v) { return v * k; }), canh: [{ s: '?' }, { s: '?' }, { s: '?' }] },
          { loiCuoi: ['Chu vi: ' + s + ' cm → ' + nh(P) + ' cm'] }),
        de: 'Một tam giác có ba cạnh $' + lietKe(x, cc) + '$ cm. Một tam giác đồng dạng với nó có chu vi $' + cc.so(P) + '$ cm. Tính ba cạnh của tam giác thứ hai (từ nhỏ đến lớn, cm).',
        dapAn: { kieu: 'nhieuO', o: kq.map(function (v, i) {
          return { nhan: ['Cạnh nhỏ nhất:', 'Cạnh thứ hai:', 'Cạnh lớn nhất:'][i], kieu: 'so', gt: v,
            loiThuongGap: Math.abs(P / 3 - v) > 1e-9 ? [{ gt: P / 3, giaiThich: 'Em chia đều chu vi cho $3$. Hai tam giác đồng dạng thì các cạnh **tỉ lệ** với $' + tang(x).join(', ') + '$, không bằng nhau.' }] : [] };
        }) },
        goiY: ['Chu vi tam giác thứ nhất là $' + x.join(' + ') + ' = ' + s + '$ cm. Tỉ số đồng dạng bằng tỉ số hai chu vi.', 'Nhân mỗi cạnh của tam giác thứ nhất với tỉ số đó.'],
        loiGiai: ['Tỉ số đồng dạng $k = \\frac{' + cc.so(P) + '}{' + s + '} = ' + cc.so(k) + '$.',
          'Ba cạnh: $' + tang(x).map(function (v) { return cc.so(k) + ' \\cdot ' + v + ' = ' + cc.so(v * k); }).join('$; $') + '$ (cm).']
      };
    } },
    { ten: 'Tính cạnh nhờ c.g.c (có hình)', muc: 2, sinh: function (r, cc) {
      var q, p, u, v, t = 0;
      do { q = r.chon([2, 3, 4]); p = r.so(1, q - 1); u = r.so(2, 6); v = r.so(3, 7); t++; }
      while ((u >= v || p * v > 0.8 * q * u || u / v < 0.55 || cc.ucln(p, q) !== 1) && t < 300);
      if (t >= 300) { q = 2; p = 1; u = 3; v = 4; }
      var b = q * u, c = q * v, lo = Math.floor((c - b) / q) + 1, hi = Math.ceil((b + c) / q) - 1;
      var wl = Math.max(lo, Math.ceil(v * 0.7)), wh = Math.min(hi, Math.floor((u + v) * 0.8)), w = wl <= wh ? r.so(wl, wh) : lo, bc = q * w;
      var am = p * v, an = p * u, kq = p * w, k = cc.phanSo(p, q).tex;
      var T = hh.tg(bc, c, b), M = hh.lerp(T.A, T.B, am / b), N = hh.lerp(T.A, T.C, an / c);
      var sai = bc * am / b;
      return {
        de: 'Cho tam giác $ABC$ có $AB = ' + b + '$, $AC = ' + c + '$, $BC = ' + bc + '$. Lấy $M$ trên cạnh $AB$, $N$ trên cạnh $AC$ sao cho $AM = ' + am + '$, $AN = ' + an + '$. Tính $x = MN$.',
        hinh: geo({ diem: { A: T.A, B: T.B, C: T.C, M: M, N: N }, to: ['A', 'B', 'C'],
          canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]],
          nhan: [['A', 'M', String(am)], ['A', 'N', String(an)], ['B', 'C', String(bc)], ['M', 'N', 'x', true, 0.8, TIM]],
          ghiChu: 'AB = ' + b + ', AC = ' + c }),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['So sánh $\\frac{AM}{AC}$ và $\\frac{AN}{AB}$ (chú ý: $M$ nằm trên $AB$ nhưng $AM$ ghép với $AC$). Góc $A$ chung.',
          'Ta có $\\triangle AMN \\backsim \\triangle ACB$ (c.g.c), nên $\\frac{MN}{CB}$ bằng tỉ số đó.'],
        loiGiai: ['$\\frac{AM}{AC} = \\frac{' + am + '}{' + c + '} = ' + k + '$ và $\\frac{AN}{AB} = \\frac{' + an + '}{' + b + '} = ' + k + '$; góc $A$ chung.',
          'Vậy $\\triangle AMN \\backsim \\triangle ACB$ (c.g.c), suy ra $\\frac{MN}{CB} = ' + k + '$.',
          '$x = ' + k + ' \\cdot ' + bc + ' = ' + kq + '$'],
        loiThuongGap: Math.abs(sai - kq) > 1e-9 ? [{ gt: sai, giaiThich: 'Em ghép $AM$ với $AB$. Tỉ số $\\frac{AM}{AB}$ khác $\\frac{AN}{AC}$ nên $MN$ **không** song song $BC$; phải ghép $AM$ với $AC$, $AN$ với $AB$.' }] : []
      };
    } },
    { ten: 'Tính cạnh nhờ g.g (có hình)', muc: 2, sinh: function (r, cc) {
      var x, m, ds;
      do { x = r.chon([4, 6, 8, 9, 10, 12]); ds = []; for (var d = 2; d < x; d++) if ((x * x) % d === 0 && x * x / d - d >= 2 && x * x / d <= 2.6 * x) ds.push(d); } while (!ds.length);
      m = r.chon(ds);
      var ad = x * x / m, cd = ad - m, th = 58 * Math.PI / 180, B = [x * Math.cos(th), x * Math.sin(th)];
      var sai = Math.sqrt(m * cd), ltg = Number.isInteger(sai) && sai !== x ? [{ gt: sai, giaiThich: 'Em dùng $CD$ thay cho cả đoạn $AD$. Từ $\\triangle ABC \\backsim \\triangle ADB$: $\\frac{AB}{AD} = \\frac{AC}{AB}$, với $AD = AC + CD$.' }] : [];
      return {
        de: 'Trong hình, $C$ nằm giữa $A$ và $D$, $AC = ' + m + '$, $CD = ' + cd + '$ và $\\widehat{ABC} = \\widehat{ADB}$. Tính $x = AB$.',
        hinh: geo({ diem: { A: [0, 0], C: [m, 0], D: [ad, 0], B: B }, to: ['A', 'B', 'D'],
          canh: [['A', 'D'], ['A', 'B'], ['B', 'D'], ['B', 'C', { mau: TIM }]],
          goc: [['A', 'B', 'C', { mau: CAM, r: 0.09 * ad }], ['A', 'D', 'B', { mau: CAM, r: 0.09 * ad }]],
          nhan: [['A', 'C', String(m)], ['C', 'D', String(cd)], ['A', 'B', 'x']] }),
        dapAn: { kieu: 'so', gt: x },
        goiY: ['Xét $\\triangle ABC$ và $\\triangle ADB$: góc $A$ chung và $\\widehat{ABC} = \\widehat{ADB}$.', 'Từ $\\triangle ABC \\backsim \\triangle ADB$ suy ra $\\frac{AB}{AD} = \\frac{AC}{AB}$, tức $AB^2 = AC \\cdot AD$.'],
        loiGiai: ['$\\triangle ABC \\backsim \\triangle ADB$ (g.g) nên $\\frac{AB}{AD} = \\frac{AC}{AB}$, suy ra $AB^2 = AC \\cdot AD$.',
          '$AD = ' + m + ' + ' + cd + ' = ' + ad + '$, nên $x^2 = ' + m + ' \\cdot ' + ad + ' = ' + x * x + '$.',
          '$x = ' + x + '$'],
        loiThuongGap: ltg
      };
    } },
    { ten: 'Hai cột và hai sợi dây', muc: 3, sinh: function (r, cc) {
      var cap = r.chon([[2, 3], [3, 6], [4, 6], [4, 12], [6, 12], [5, 20], [6, 9], [10, 15], [3, 7], [6, 10]]);
      if (r.dau() > 0) cap = [cap[1], cap[0]];
      var a = cap[0], b = cap[1], d = r.chon([6, 8, 10, 12]), h = a * b / (a + b), xi = d * a / (a + b);
      return {
        de: 'Hai cột thẳng đứng $AB$ và $CD$ cao $' + a + '$ m và $' + b + '$ m, chân cột $B$, $D$ cách nhau $' + d + '$ m. Người ta căng dây từ đỉnh cột này đến chân cột kia ($AD$ và $CB$); hai sợi dây cắt nhau tại $I$. Tính độ cao $h = IH$ của điểm $I$ so với mặt đất (m).',
        hinh: geo({ diem: { B: [0, 0], A: [0, a], D: [d, 0], C: [d, b], I: [xi, h], H: [xi, 0] }, ve: [[[-0.3 * d, 0], [-0.3 * d + 0.01, 0], { mau: '#ffffff', day: 0 }], [[1.3 * d, 0], [1.3 * d + 0.01, 0], { mau: '#ffffff', day: 0 }]],
          canh: [['B', 'D'], ['A', 'B', { mau: XANH, day: 5 }], ['C', 'D', { mau: XANH, day: 5 }], ['A', 'D', { mau: '#868e96', day: 2 }], ['C', 'B', { mau: '#868e96', day: 2 }], ['I', 'H', { mau: TIM, net: 2 }]],
          nhan: [['A', 'B', nh(a) + ' m', false, 1.6], ['C', 'D', nh(b) + ' m', false, 1.6], ['I', 'H', 'h', true, 0.8, TIM]],
          lechTen: { I: [0, 16], H: [0, -16] } }),
        dapAn: { kieu: 'so', gt: h },
        goiY: ['$IH \\parallel AB$ nên $\\triangle DIH \\backsim \\triangle DAB$: $\\frac{h}{' + a + '} = \\frac{DH}{DB}$. Tương tự $\\frac{h}{' + b + '} = \\frac{BH}{BD}$.',
          'Cộng hai đẳng thức: $\\frac{h}{' + a + '} + \\frac{h}{' + b + '} = \\frac{DH + BH}{BD} = 1$.'],
        loiGiai: ['$\\triangle DIH \\backsim \\triangle DAB$ cho $\\frac{h}{' + a + '} = \\frac{DH}{BD}$; $\\triangle BIH \\backsim \\triangle BCD$ cho $\\frac{h}{' + b + '} = \\frac{BH}{BD}$.',
          'Cộng lại: $h \\left( \\frac{1}{' + a + '} + \\frac{1}{' + b + '} \\right) = 1$, nên $h = \\frac{' + a + ' \\cdot ' + b + '}{' + a + ' + ' + b + '}$.',
          '$h = \\frac{' + a * b + '}{' + (a + b) + '} = ' + cc.so(h) + '$'],
        loiThuongGap: [{ gt: (a + b) / 2, giaiThich: 'Điểm $I$ **không** ở độ cao trung bình cộng của hai cột. Em dùng hai cặp tam giác đồng dạng rồi cộng hai tỉ số.' }]
      };
    } }
  ]);
})();
