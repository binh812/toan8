// Luyện thêm – Bài 37: Hình đồng dạng
(function () {
  'use strict';
  var TIM = '#9c36b5', XANH = '#1971c2';
  var geo = TOAN8.hinhGeo;
  // Số lớn viết tách nhóm nghìn trong công thức: 1\,225\,000
  function lon(x) {
    var s = String(x), out = '';
    for (var i = 0; i < s.length; i++) out += (i > 0 && (s.length - i) % 3 === 0 ? '\\,' : '') + s[i];
    return out;
  }
  function nh(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }

  TOAN8.luyen(37, [
    { ten: 'Hình đồng dạng phối cảnh', muc: 1, sinh: function (r, cc) {
      var k = r.chon([2, 3, 4, 0.5, 1.5, 2.5]), oa = k === 0.5 || k === 1.5 || k === 2.5 ? 2 * r.so(1, 4) : r.so(1, 5);
      var oa1 = oa * k, hoiK = r.dau() > 0, P = r.chon(['A', 'M', 'B']);
      var ang = 35 * Math.PI / 180, ux = Math.cos(ang), uy = Math.sin(ang);
      var D = { O: [0, 0] }; D[P] = [oa * ux, oa * uy]; D[P + "'"] = [oa1 * ux, oa1 * uy];
      var lon = Math.max(oa, oa1);
      var hinh = geo({ diem: D, ve: [[[0, 0], [1.15 * lon * ux, 1.15 * lon * uy], { mau: '#e8590c', net: 2, day: 1.5 }]],
        canh: [['O', P, { mau: XANH, day: 3 }]], nhan: [['O', P, nh(oa) + ' cm', false, 1.4]],
        lechTen: (function () { var o = {}; o[P] = [-6, 16]; o[P + "'"] = [-6, 16]; return o; })() });
      if (hoiK) {
        var kq = cc.phanSo(Math.round(oa1 * 2), oa * 2);
        return {
          de: "Điểm $" + P + "'$ là ảnh của điểm $" + P + "$ qua phép đồng dạng phối cảnh tâm $O$ ($" + P + "'$ nằm trên tia $O" + P + "$). Biết $O" + P + " = " + oa + "$ cm, $O" + P + "' = " + cc.so(oa1) + "$ cm. Tìm tỉ số đồng dạng $k$ (viết dạng phân số tối giản hoặc số).",
          dapAn: { kieu: 'so', gt: kq.ascii },
          goiY: ["Tỉ số đồng dạng phối cảnh là $k = \\frac{O" + P + "'}{O" + P + "}$.", 'Chia rồi rút gọn. $k > 1$ là phóng to, $k < 1$ là thu nhỏ.'],
          loiGiai: ["$k = \\frac{O" + P + "'}{O" + P + "} = \\frac{" + cc.so(oa1) + '}{' + oa + '}' + (Number.isInteger(oa1) && cc.ucln(oa1, oa) === 1 ? '' : ' = ' + kq.tex) + '$'],
          loiThuongGap: [{ gt: cc.phanSo(oa * 2, Math.round(oa1 * 2)).ascii, giaiThich: "Em lật ngược tỉ số: $k = \\frac{O" + P + "'}{O" + P + "}$ (ảnh ở trên tử)." }]
        };
      }
      return {
        de: "Hình $\\mathcal{H}'$ là hình " + (k > 1 ? 'phóng to' : 'thu nhỏ') + " của hình $\\mathcal{H}$ với tâm phối cảnh $O$, tỉ số $k = " + cc.so(k) + "$. Điểm $" + P + "$ thuộc $\\mathcal{H}$ có $O" + P + " = " + oa + "$ cm. Tính $O" + P + "'$ (cm), với $" + P + "'$ là điểm tương ứng.",
        hinh: hinh,
        dapAn: { kieu: 'so', gt: oa1 },
        goiY: ["$" + P + "'$ nằm trên tia $O" + P + "$ và $O" + P + "' = k \\cdot O" + P + "$.", 'Nhân $' + oa + '$ với $' + cc.so(k) + '$.'],
        loiGiai: ["$O" + P + "' = k \\cdot O" + P + " = " + cc.so(k) + ' \\cdot ' + oa + ' = ' + cc.so(oa1) + '$'],
        loiThuongGap: [{ gt: oa / k, giaiThich: "Em chia cho $k$. Theo định nghĩa $O" + P + "' = k \\cdot O" + P + "$." }]
      };
    } },
    { ten: 'Chọn hình chữ nhật đồng dạng', muc: 1, sinh: function (r) {
      var a, b;
      do { a = r.so(2, 6); b = r.so(3, 9); } while (b <= a);
      var k = r.chon([2, 3, 1.5]);
      if (k === 1.5 && (a % 2 || b % 2)) k = 2;
      var dung = [a * k, b * k];
      var d = r.so(1, 3), sai = [[a + d, b + d], [a * k, b * k + r.chon([1, 2])], [a + 1, 2 * b], [a * 2, b + a]];
      var ok = sai.filter(function (s) { return s[0] * b !== s[1] * a && s[1] * b !== s[0] * a && s[0] !== s[1]; });
      var luaChon = r.xaoTron([dung].concat(r.xaoTron(ok).slice(0, 3)));
      var hinhChu = function (s) { return '$' + String(s[0]).replace('.', '{,}') + ' \\times ' + String(s[1]).replace('.', '{,}') + '$'; };
      return {
        de: 'Hình chữ nhật nào dưới đây đồng dạng với hình chữ nhật $' + a + ' \\times ' + b + '$ (cm)?',
        dapAn: { kieu: 'chon', gt: luaChon.indexOf(dung), luaChon: luaChon.map(hinhChu) },
        goiY: ['Hai hình chữ nhật đồng dạng khi tỉ số **dài : rộng** bằng nhau (hay cả hai chiều cùng nhân một số $k$).', 'Tính $\\frac{\\text{dài}}{\\text{rộng}}$ của từng hình rồi so với $\\frac{' + b + '}{' + a + '}$.'],
        loiGiai: ['Hình $' + String(dung[0]).replace('.', '{,}') + ' \\times ' + String(dung[1]).replace('.', '{,}') + '$ có cả hai chiều bằng $' + String(k).replace('.', '{,}') + '$ lần hình $' + a + ' \\times ' + b + '$ nên đồng dạng.',
          'Các hình còn lại có tỉ số dài : rộng khác $\\frac{' + b + '}{' + a + '}$. Chú ý: cộng thêm cùng một số vào hai chiều **không** cho hình đồng dạng.']
      };
    } },
    { ten: 'Phóng to, thu nhỏ ảnh', muc: 2, sinh: function (r, cc) {
      var t = r.chon([[2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [5, 7]]), g = r.so(1, 3), w = t[0] * g * 2, l = t[1] * g * 2;
      var W = t[0] * r.so(2, 6), L = W * t[1] / t[0];
      if (W === w) { W += t[0]; L = W * t[1] / t[0]; }
      var vat = r.chon(['Một bức ảnh', 'Một tấm thiệp', 'Một tấm áp phích']), kt = cc.phanSo(W, w).tex;
      var sai = l + (W - w);
      return {
        de: vat + ' hình chữ nhật $' + w + '$ cm $\\times$ $' + l + '$ cm được ' + (W > w ? 'phóng to' : 'thu nhỏ') + ' (giữ nguyên hình dạng) sao cho cạnh ngắn dài $' + W + '$ cm. Cạnh dài mới là bao nhiêu cm?',
        dapAn: { kieu: 'so', gt: L },
        goiY: ['Giữ nguyên hình dạng nghĩa là hai hình đồng dạng: hai chiều cùng nhân với một tỉ số $k$.', '$k = \\frac{' + W + '}{' + w + '}$; cạnh dài mới $= k \\cdot ' + l + '$.'],
        loiGiai: ['$k = \\frac{' + W + '}{' + w + '} = ' + kt + '$.', 'Cạnh dài mới $= ' + kt + ' \\cdot ' + l + ' = ' + cc.so(L) + '$'],
        loiThuongGap: Math.abs(sai - L) > 1e-9 ? [{ gt: sai, giaiThich: 'Em **cộng thêm** ' + (W > w ? '' : '(bớt đi) ') + 'cùng một số vào hai chiều. Hình đồng dạng phải **nhân** cả hai chiều với cùng tỉ số.' }] : []
      };
    } },
    { ten: 'Chu vi và diện tích hình đồng dạng', muc: 2, sinh: function (r, cc) {
      var k = r.chon([[2, 1], [3, 1], [3, 2], [1, 2], [2, 3], [5, 2], [1, 3]]), kt = cc.phanSo(k[0], k[1]).tex, kv = k[0] / k[1];
      var hinh = r.chon(['hai ngũ giác', 'hai hình thang', 'hai mảnh vườn', 'hai lá cờ', 'hai hình lục giác']);
      if (r.dau() > 0) {
        var S = k[1] * k[1] * r.so(2, 12), kq = S * kv * kv;
        return {
          de: 'Hình $\\mathcal{H}\'$ đồng dạng với hình $\\mathcal{H}$ theo tỉ số $k = ' + kt + '$ (' + hinh + '). Diện tích hình $\\mathcal{H}$ là $' + S + '$ cm². Tính diện tích hình $\\mathcal{H}\'$ (cm²).',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Hai hình đồng dạng tỉ số $k$ thì mọi độ dài nhân $k$, còn **diện tích** nhân $k^2$.', 'Tính $k^2 = \\left(' + kt + '\\right)^2$ rồi nhân với $' + S + '$.'],
          loiGiai: ['$k^2 = \\left(' + kt + '\\right)^2 = ' + cc.phanSo(k[0] * k[0], k[1] * k[1]).tex + '$.', 'Diện tích $\\mathcal{H}\' = ' + cc.phanSo(k[0] * k[0], k[1] * k[1]).tex + ' \\cdot ' + S + ' = ' + cc.so(kq) + '$'],
          loiThuongGap: [{ gt: S * kv, giaiThich: 'Em nhân diện tích với $k$. Diện tích tỉ lệ với $k^2$ (cả hai chiều đều nhân $k$).' }]
        };
      }
      var P = k[1] * r.so(4, 20), kq2 = P * kv;
      return {
        de: 'Hình $\\mathcal{H}\'$ đồng dạng với hình $\\mathcal{H}$ theo tỉ số $k = ' + kt + '$ (' + hinh + '). Chu vi hình $\\mathcal{H}$ là $' + P + '$ cm. Tính chu vi hình $\\mathcal{H}\'$ (cm).',
        dapAn: { kieu: 'so', gt: kq2 },
        goiY: ['Chu vi là một **độ dài** (tổng các cạnh).', 'Mọi cạnh nhân $k$ nên chu vi cũng nhân $k$.'],
        loiGiai: ['Mỗi cạnh của $\\mathcal{H}\'$ bằng $k$ lần cạnh tương ứng của $\\mathcal{H}$, nên chu vi cũng gấp $k$ lần.', 'Chu vi $\\mathcal{H}\' = ' + kt + ' \\cdot ' + P + ' = ' + cc.so(kq2) + '$'],
        loiThuongGap: [{ gt: P * kv * kv, giaiThich: 'Em nhân với $k^2$. Chỉ **diện tích** mới nhân $k^2$; chu vi là độ dài nên chỉ nhân $k$.' }]
      };
    } },
    { ten: 'Mô hình, bản vẽ theo tỉ lệ', muc: 3, sinh: function (r, cc) {
      var n = r.chon([100, 200, 500, 1000]), vat = r.chon([['sân bóng', 'Mặt sân'], ['khu vườn', 'Khu vườn'], ['căn phòng', 'Sàn phòng'], ['bể bơi', 'Mặt bể bơi']]);
      if (vat[0] === 'căn phòng') n = r.chon([50, 100]);
      // diện tích thật (m²) = s · n² / 10000, chọn s để ra số đẹp
      var s, that;
      do { s = r.so(2, 60) * (n >= 500 ? 2 : 10); that = s * n * n / 10000; } while (that > 20000 || that !== Math.round(that * 100) / 100);
      return {
        de: 'Một mô hình ' + vat[0] + ' được làm theo tỉ lệ $1 : ' + n + '$ (mọi độ dài thật gấp $' + n + '$ lần độ dài trên mô hình). ' + vat[1] + ' trên mô hình có diện tích $' + s + '$ cm². Diện tích thật là bao nhiêu m²?',
        dapAn: { kieu: 'so', gt: that },
        goiY: ['Hình thật đồng dạng với mô hình theo tỉ số $k = ' + n + '$, nên diện tích thật gấp $k^2 = ' + n * n + '$ lần.', 'Đổi đơn vị: $1$ m² $= 10\\,000$ cm².'],
        loiGiai: ['Diện tích thật $= ' + s + ' \\cdot ' + n + '^2 = ' + lon(s * n * n) + '$ (cm²).', 'Đổi ra m²: $' + lon(s * n * n) + ' : 10\\,000 = ' + cc.so(that) + '$'],
        loiThuongGap: [{ gt: s * n / 10000, giaiThich: 'Em chỉ nhân với $' + n + '$. Diện tích tỉ lệ với **bình phương** tỉ số: nhân $' + n + '^2$.' },
          { gt: s * n * n, giaiThich: 'Đó là diện tích tính bằng cm². Em đổi ra m² (chia cho $10\\,000$).' }]
      };
    } },
    { ten: 'Tivi, màn hình đồng dạng', muc: 3, sinh: function (r, cc) {
      var cap = r.chon([[32, 48], [40, 50], [32, 40], [40, 60], [50, 75], [32, 56], [43, 86], [55, 65]]);
      var g = cc.ucln(cap[0], cap[1]), d1 = cap[0], d2 = cap[1], buoc = d1 / g, lo = Math.ceil(2.05 * d1 / buoc), hi = Math.floor(2.3 * d1 / buoc), w1 = buoc * (lo <= hi ? r.so(lo, hi) : Math.round(2.2 * d1 / buoc));
      var w2 = w1 * d2 / d1, kt = cc.phanSo(d2, d1).tex, sai = w1 + d2 - d1;
      return {
        de: 'Bác Minh có tivi $' + d1 + '$ inch, chiều ngang màn hình $' + w1 + '$ cm. Bác muốn mua tivi $' + d2 + '$ inch cùng tỉ lệ khung hình (hai màn hình đồng dạng; số inch là độ dài đường chéo). Chiều ngang màn hình mới là bao nhiêu cm?',
        dapAn: { kieu: 'so', gt: w2 },
        goiY: ['Hai màn hình đồng dạng: tỉ số hai chiều ngang bằng tỉ số hai đường chéo.', '$k = \\frac{' + d2 + '}{' + d1 + '}$; chiều ngang mới $= k \\cdot ' + w1 + '$ (không cần đổi inch ra cm).'],
        loiGiai: ['$k = \\frac{' + d2 + '}{' + d1 + '} = ' + kt + '$.', 'Chiều ngang mới $= ' + kt + ' \\cdot ' + w1 + ' = ' + cc.so(w2) + '$'],
        loiThuongGap: [{ gt: sai, giaiThich: 'Em cộng thêm $' + (d2 - d1) + '$. Hình đồng dạng thì độ dài **nhân** với tỉ số, không cộng.' }]
      };
    } }
  ]);
})();
