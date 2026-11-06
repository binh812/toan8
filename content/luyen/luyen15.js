// Luyện thêm – Bài 15: Định lí Thalès trong tam giác
(function () {
  'use strict';
  var TIM = '#9c36b5', CAM = '#d9480f', XANH = '#1971c2';

  // Hình Thalès: tam giác ABC, M ∈ AB, N ∈ AC đúng số liệu (giống bai15.js). gocA là số đo góc A hoặc { bc: độ dài BC }.
  function hinhThales(AM, MB, AN, NC, gocA, nhan, them) {
    var hh = TOAN8.hh;
    var T = (gocA && gocA.bc) ? hh.tg(gocA.bc, AN + NC, AM + MB) : hh.tgGoc(AM + MB, AN + NC, gocA || 58);
    var o = { diem: { A: T.A, B: T.B, C: T.C, M: hh.lerp(T.A, T.B, AM / (AM + MB)), N: hh.lerp(T.A, T.C, AN / (AN + NC)) },
      to: ['A', 'B', 'C'], canh: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N', { mau: TIM, day: 4 }]], nhan: nhan };
    for (var k in them || {}) o[k] = them[k];
    return TOAN8.hinhGeo(o);
  }
  function fr(a, b) { return '\\frac{' + a + '}{' + b + '}'; }
  function ucln(a, b) { while (b) { var x = a % b; a = b; b = x; } return a; }
  function chuSo(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', ','); }
  // Hình lời giải: lưới Thalès theo chính số của đề. AB chia (AM : MB rút gọn) phần bằng nhau, giai: số cần tìm hiện màu xanh
  function hinhLuoi(AM, MB, tuyChon) {
    var g = ucln(AM, MB);
    return { widget: 'canh', config: { ten: 'thalesLuoi', thamSo: { m: AM / g, k: MB / g, trangThai: 'giai' }, tuyChon: tuyChon, chiXem: true, t: 1 } };
  }
  function lech(a, b) { return Math.abs(a - b) > 1e-9; }
  // Hai cạnh AB, AC không chênh nhau quá 2 lần để hình đẹp.
  function boSo(r) {
    var p, q, t, s, n = 0;
    do {
      p = r.so(1, 5); q = r.so(1, 5); t = r.so(1, 3); s = r.so(1, 3); n++;
    // max(p, q) ≤ 2,5·min(p, q): tránh M sát B (hay N sát C) làm nhãn đè nhau
    } while (n < 80 && (p === q || Math.max(p, q) > 2.5 * Math.min(p, q) || (p + q) * t < 4 || (p + q) * s < 4 || Math.max(t, s) > 2 * Math.min(t, s)));
    if (p === q) q = p + 1;
    return { AM: p * t, MB: q * t, AN: p * s, NC: q * s };
  }

  TOAN8.luyen(15, [
    { ten: 'Tỉ số hai đoạn thẳng (đổi đơn vị)', muc: 1, sinh: function (r, cc) {
      var dv = r.chon([{ ten: 'dm', he: 10 }, { ten: 'm', he: 100 }, { ten: 'cm', he: 1 }]);
      var a, b;
      if (dv.he === 100) { a = 10 * r.so(1, 9); b = r.so(1, 3); }
      else if (dv.he === 10) { a = r.so(2, 30); b = r.so(1, 5); if (a === 10 * b) a += 3; }
      else { a = r.so(2, 20); b = r.so(2, 20); if (a === b) b = a + r.so(1, 5); }
      var ten = r.chon([['AB', 'CD'], ['MN', 'PQ'], ['EF', 'HK']]);
      var kq = cc.phanSo(a, b * dv.he), nguoc = cc.phanSo(b * dv.he, a), chuaDoi = cc.phanSo(a, b);
      var ltg = [];
      if (dv.he > 1 && lech(chuaDoi.tu / chuaDoi.mau, kq.tu / kq.mau)) ltg.push({ gt: chuaDoi.ascii, giaiThich: 'Em chưa đổi đơn vị: $' + a + '$ là cm còn $' + b + '$ là ' + dv.ten + '. Đổi $' + b + '$ ' + dv.ten + ' $= ' + b * dv.he + '$ cm trước.' });
      if (lech(nguoc.tu / nguoc.mau, kq.tu / kq.mau)) ltg.push({ gt: nguoc.ascii, giaiThich: 'Em lấy ngược $\\frac{' + ten[1] + '}{' + ten[0] + '}$. Tỉ số $\\frac{' + ten[0] + '}{' + ten[1] + '}$ thì $' + ten[0] + '$ ở trên.' });
      var u = ucln(a, b * dv.he);
      return {
        de: 'Cho $' + ten[0] + ' = ' + a + '$ cm và $' + ten[1] + ' = ' + b + '$ ' + dv.ten + '. Tìm tỉ số $\\frac{' + ten[0] + '}{' + ten[1] + '}$ (viết dạng phân số tối giản, ví dụ 3/4).',
        hinhGiai: { widget: 'canh', config: { ten: 'thalesDoan', tuyChon: { a: a, b: b * dv.he, u: u, tenA: ten[0], tenB: ten[1] }, chiXem: true, t: 1,
          ghiChu: (dv.he > 1 ? 'Đổi ' + b + ' ' + dv.ten + ' = ' + b * dv.he + ' cm. ' : '') + 'Đo cả hai bằng đoạn dài ' + u + ' cm.' } },
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: ['Tỉ số của hai đoạn thẳng là tỉ số độ dài của chúng **theo cùng một đơn vị đo**.',
          dv.he > 1 ? 'Đổi $' + b + '$ ' + dv.ten + ' ra cm rồi lập tỉ số, sau đó rút gọn.' : 'Lập tỉ số $\\frac{' + a + '}{' + b + '}$ rồi rút gọn.'],
        loiGiai: [dv.he > 1 ? 'Đổi $' + ten[1] + ' = ' + b + '$ ' + dv.ten + ' $= ' + b * dv.he + '$ cm.' : 'Hai đoạn đã cùng đơn vị cm.',
          '$\\frac{' + ten[0] + '}{' + ten[1] + '} = ' + fr(a, b * dv.he) + (kq.mau === b * dv.he ? '' : ' = ' + kq.tex) + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Định lí Thalès: tính một đoạn', muc: 1, sinh: function (r) {
      var d = boSo(r), goc = r.so(50, 68);
      var hoi = r.chon(['NC', 'AN', 'MB', 'AM']);
      var ten = { AM: 'AM', MB: 'MB', AN: 'AN', NC: 'NC' };
      var nhan = [['A', 'M', hoi === 'AM' ? 'x' : String(d.AM)], ['M', 'B', hoi === 'MB' ? 'x' : String(d.MB)],
        ['A', 'N', hoi === 'AN' ? 'x' : String(d.AN)], ['N', 'C', hoi === 'NC' ? 'x' : String(d.NC)]];
      var biet = Object.keys(ten).filter(function (k) { return k !== hoi; }).map(function (k) { return '$' + k + ' = ' + d[k] + '$'; }).join(', ');
      var kq = d[hoi], tl = '\\frac{AM}{MB} = \\frac{AN}{NC}';
      var v = { AM: d.AM, MB: d.MB, AN: d.AN, NC: d.NC };
      function sx(k) { return k === hoi ? 'x' : String(v[k]); }
      var thay = fr(sx('AM'), sx('MB')) + ' = ' + fr(sx('AN'), sx('NC'));
      var cong, ltg = [];
      // x = (tích chéo của hai số đối diện) / số còn lại
      if (hoi === 'NC') cong = fr(d.AN + ' \\cdot ' + d.MB, d.AM);
      if (hoi === 'AN') cong = fr(d.AM + ' \\cdot ' + d.NC, d.MB);
      if (hoi === 'MB') cong = fr(d.AM + ' \\cdot ' + d.NC, d.AN);
      if (hoi === 'AM') cong = fr(d.AN + ' \\cdot ' + d.MB, d.NC);
      // lỗi đặt ngược một vế: AM/MB = NC/AN
      var nguoc = { NC: d.AN * d.AM / d.MB, AN: d.MB * d.NC / d.AM, MB: d.AM * d.AN / d.NC, AM: d.MB * d.NC / d.AN }[hoi];
      if (lech(nguoc, kq)) ltg.push({ gt: Math.round(nguoc * 1e6) / 1e6, giaiThich: 'Em đặt ngược một vế. Đoạn sát đỉnh $A$ ($AM$, $AN$) phải cùng ở trên ở cả hai vế: $' + tl + '$.' });
      if (hoi === 'NC') {
        var lechDoan = d.AN * (d.AM + d.MB) / d.AM;
        if (lech(lechDoan, kq) && lech(lechDoan, nguoc)) ltg.push({ gt: Math.round(lechDoan * 1e6) / 1e6, giaiThich: 'Em lập tỉ số lệch đoạn ($\\frac{AM}{AB} = \\frac{AN}{NC}$). Hai vế phải cùng kiểu: đoạn trên / đoạn dưới.' });
      }
      return {
        de: 'Trong hình, $MN \\parallel BC$, ' + biet + '. Tính $x = ' + hoi + '$.',
        hinh: hinhThales(d.AM, d.MB, d.AN, d.NC, goc, nhan),
        hinhGiai: hinhLuoi(d.AM, d.MB, { AB: d.AM + d.MB, AC: d.AN + d.NC, gocA: goc,
          nhan: { AM: nhan[0][2], MB: nhan[1][2], AN: nhan[2][2], NC: nhan[3][2] }, giai: (function () { var o = {}; o[hoi] = chuSo(kq); return o; })() }),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$MN \\parallel BC$ nên dùng định lí Thalès: $' + tl + '$.', 'Thay số: $' + thay + '$ rồi nhân chéo.'],
        loiGiai: ['Vì $MN \\parallel BC$, theo định lí Thalès: $' + tl + '$, tức $' + thay + '$', '$x = ' + cong + ' = ' + kq + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Thalès đảo: có song song không?', muc: 1, sinh: function (r) {
      var d = boSo(r), dung = r.dau() > 0;
      if (!dung) {
        var doi = r.chon(['AN', 'NC']), cu = d[doi];
        d[doi] = cu + (cu > 2 ? r.chon([-1, 1]) : 1);
      }
      var goc = r.so(52, 66);
      var bang = d.AM * d.NC === d.MB * d.AN;
      return {
        de: 'Trong hình, $AM = ' + d.AM + '$, $MB = ' + d.MB + '$, $AN = ' + d.AN + '$, $NC = ' + d.NC + '$. Khẳng định "$MN \\parallel BC$" đúng hay sai?',
        hinh: hinhThales(d.AM, d.MB, d.AN, d.NC, goc, [['A', 'M', String(d.AM)], ['M', 'B', String(d.MB)], ['A', 'N', String(d.AN)], ['N', 'C', String(d.NC)]]),
        hinhGiai: hinhLuoi(d.AM, d.MB, { AB: d.AM + d.MB, AC: d.AN + d.NC, gocA: goc, dao: { AN: d.AN, NC: d.NC },
          nhan: { AM: String(d.AM), MB: String(d.MB), AN: String(d.AN), NC: String(d.NC) } }),
        dapAn: { kieu: 'dungSai', gt: bang },
        goiY: ['Đừng tin mắt: dùng định lí Thalès đảo, so sánh $\\frac{AM}{MB}$ và $\\frac{AN}{NC}$.',
          'Hai phân số $\\frac{' + d.AM + '}{' + d.MB + '}$ và $\\frac{' + d.AN + '}{' + d.NC + '}$ bằng nhau khi tích chéo bằng nhau: so $' + d.AM + ' \\cdot ' + d.NC + '$ với $' + d.MB + ' \\cdot ' + d.AN + '$.'],
        loiGiai: ['$\\frac{AM}{MB} = \\frac{' + d.AM + '}{' + d.MB + '}$; $\\frac{AN}{NC} = \\frac{' + d.AN + '}{' + d.NC + '}$. Tích chéo: $' + d.AM + ' \\cdot ' + d.NC + ' = ' + d.AM * d.NC + '$ và $' + d.MB + ' \\cdot ' + d.AN + ' = ' + d.MB * d.AN + '$.',
          bang ? 'Hai tỉ số bằng nhau nên $MN \\parallel BC$ (định lí Thalès đảo). Khẳng định **đúng**.'
            : 'Hai tỉ số khác nhau nên $MN$ **không** song song với $BC$. Khẳng định **sai**.']
      };
    } },

    { ten: 'Hệ quả: tính đoạn song song', muc: 2, sinh: function (r) {
      var p, q, k, n = 0;
      do { p = r.so(1, 4); q = r.so(1, 5); k = r.so(1, 2); n++; } while (n < 50 && (p + q < 3 || (p + q) * k < 6));
      var AB = p + q, BC = AB * k, MN = p * k;
      // AC (không ghi trên hình): dựng từ góc A khoảng 55°–75° để tam giác không dẹt (BC ≥ AB nên luôn có nghiệm)
      var gA = r.so(55, 75) * Math.PI / 180;
      var AC = AB * Math.cos(gA) + Math.sqrt(BC * BC - AB * AB * Math.sin(gA) * Math.sin(gA));
      var tinhMN = r.dau() > 0, ltg = [];
      var nhan = [['A', 'M', String(p)], ['M', 'B', String(q)], tinhMN ? ['B', 'C', String(BC)] : ['B', 'C', 'x'], ['M', 'N', tinhMN ? 'x' : String(MN), true, 0.8]];
      var hinh = hinhThales(p, q, AC * p / AB, AC * q / AB, { bc: BC }, nhan);
      var hinhGiai = hinhLuoi(p, q, { AB: AB, AC: AC, BC: BC, luoi: true,
        nhan: { AM: String(p), MB: String(q), BC: tinhMN ? String(BC) : 'x', MN: tinhMN ? 'x' : String(MN) }, giai: tinhMN ? { MN: String(MN) } : { BC: String(BC) } });
      if (tinhMN) {
        var sai = BC * p / q;
        if (lech(sai, MN)) ltg.push({ gt: Math.round(sai * 1e6) / 1e6, giaiThich: 'Em dùng $\\frac{AM}{MB} = \\frac{MN}{BC}$. Với đoạn song song $MN$, phải so với **cả cạnh** $AB = ' + AB + '$.' });
        return {
          de: 'Trong hình, $MN \\parallel BC$, $AM = ' + p + '$, $MB = ' + q + '$, $BC = ' + BC + '$. Tính $x = MN$.',
          hinh: hinh, hinhGiai: hinhGiai, dapAn: { kieu: 'so', gt: MN },
          goiY: ['Hệ quả của định lí Thalès: $\\frac{AM}{AB} = \\frac{MN}{BC}$ (mẫu số là **cả cạnh**).', '$AB = ' + p + ' + ' + q + ' = ' + AB + '$, nên $' + fr(p, AB) + ' = ' + fr('x', BC) + '$.'],
          loiGiai: ['$AB = AM + MB = ' + AB + '$. Vì $MN \\parallel BC$: $\\frac{AM}{AB} = \\frac{MN}{BC}$, tức $' + fr(p, AB) + ' = ' + fr('x', BC) + '$', '$x = ' + fr(p + ' \\cdot ' + BC, AB) + ' = ' + MN + '$'],
          loiThuongGap: ltg
        };
      }
      var sai2 = MN * q / p;
      if (lech(sai2, BC)) ltg.push({ gt: Math.round(sai2 * 1e6) / 1e6, giaiThich: 'Em dùng $\\frac{AM}{MB} = \\frac{MN}{BC}$. Phải là $\\frac{AM}{AB} = \\frac{MN}{BC}$ với $AB = ' + AB + '$.' });
      return {
        de: 'Trong hình, $MN \\parallel BC$, $AM = ' + p + '$, $MB = ' + q + '$, $MN = ' + MN + '$. Tính $x = BC$.',
        hinh: hinh, hinhGiai: hinhGiai, dapAn: { kieu: 'so', gt: BC },
        goiY: ['Hệ quả của định lí Thalès: $\\frac{AM}{AB} = \\frac{MN}{BC}$.', '$AB = ' + AB + '$, nên $' + fr(p, AB) + ' = ' + fr(MN, 'x') + '$.'],
        loiGiai: ['$AB = AM + MB = ' + AB + '$. Vì $MN \\parallel BC$: $\\frac{AM}{AB} = \\frac{MN}{BC}$, tức $' + fr(p, AB) + ' = ' + fr(MN, 'x') + '$', '$x = ' + fr(MN + ' \\cdot ' + AB, p) + ' = ' + BC + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Hai bước: cả cạnh, góc đồng vị', muc: 2, sinh: function (r) {
      var d = boSo(r), goc = r.so(50, 66), AC = d.AN + d.NC, ltg = [];
      if (r.dau() > 0) {
        // biết AM, MB, AN → tính cả cạnh AC
        if (lech(d.NC, AC)) ltg.push({ gt: d.NC, giaiThich: '$' + d.NC + '$ mới là $NC$. Đề hỏi cả cạnh $AC = AN + NC$.' });
        var lechTi = d.AN * d.MB / d.AM; // AM/MB = AN/AC
        if (lech(lechTi, AC) && lech(lechTi, d.NC)) ltg.push({ gt: Math.round(lechTi * 1e6) / 1e6, giaiThich: 'Em lập tỉ số lệch $\\frac{AM}{MB} = \\frac{AN}{AC}$. Hai vế phải cùng kiểu.' });
        return {
          de: 'Trong hình, $MN \\parallel BC$, $AM = ' + d.AM + '$, $MB = ' + d.MB + '$, $AN = ' + d.AN + '$. Tính độ dài **cả cạnh** $AC$.',
          hinh: hinhThales(d.AM, d.MB, d.AN, d.NC, goc, [['A', 'M', String(d.AM)], ['M', 'B', String(d.MB)], ['A', 'N', String(d.AN)]]),
          hinhGiai: hinhLuoi(d.AM, d.MB, { AB: d.AM + d.MB, AC: AC, gocA: goc, nhan: { AM: String(d.AM), MB: String(d.MB), AN: String(d.AN) }, giai: { NC: String(d.NC) } }),
          dapAn: { kieu: 'so', gt: AC },
          goiY: ['Tính $NC$ trước bằng $\\frac{AM}{MB} = \\frac{AN}{NC}$, rồi $AC = AN + NC$.', 'Hoặc dùng luôn $\\frac{AM}{AB} = \\frac{AN}{AC}$ với $AB = ' + (d.AM + d.MB) + '$.'],
          loiGiai: ['Vì $MN \\parallel BC$: $\\frac{AM}{MB} = \\frac{AN}{NC}$, tức $' + fr(d.AM, d.MB) + ' = ' + fr(d.AN, 'NC') + '$, nên $NC = ' + fr(d.AN + ' \\cdot ' + d.MB, d.AM) + ' = ' + d.NC + '$.',
            '$AC = AN + NC = ' + d.AN + ' + ' + d.NC + ' = ' + AC + '$'],
          loiThuongGap: ltg
        };
      }
      // góc đồng vị bằng nhau → song song; biết MB, AN, AC → tính AM
      var lech2 = d.MB * d.AN / AC; // AM/MB = AN/AC
      if (lech(lech2, d.AM)) ltg.push({ gt: Math.round(lech2 * 1e6) / 1e6, giaiThich: 'Em lập tỉ số lệch $\\frac{AM}{MB} = \\frac{AN}{AC}$. Phải dùng $NC = ' + AC + ' - ' + d.AN + ' = ' + d.NC + '$.' });
      var nguoc = d.MB * d.NC / d.AN;
      if (lech(nguoc, d.AM) && lech(nguoc, lech2)) ltg.push({ gt: Math.round(nguoc * 1e6) / 1e6, giaiThich: 'Em đặt ngược một vế. $AM$ ứng với $AN$, $MB$ ứng với $NC$.' });
      return {
        de: 'Trong hình, $\\angle AMN = \\angle ABC$, $MB = ' + d.MB + '$, $AN = ' + d.AN + '$, $AC = ' + AC + '$. Tính $y = AM$.',
        hinh: hinhThales(d.AM, d.MB, d.AN, d.NC, goc, [['A', 'M', 'y'], ['M', 'B', String(d.MB)], ['A', 'N', String(d.AN)]],
          { goc: [['A', 'M', 'N'], ['A', 'B', 'C']] }),
        hinhGiai: hinhLuoi(d.AM, d.MB, { AB: d.AM + d.MB, AC: AC, gocA: goc, goc: true, nhan: { AM: 'y', MB: String(d.MB), AN: String(d.AN), NC: String(d.NC) }, giai: { AM: String(d.AM) } }),
        dapAn: { kieu: 'so', gt: d.AM },
        goiY: ['$\\angle AMN$ và $\\angle ABC$ là hai góc đồng vị bằng nhau, nên $MN \\parallel BC$. Tính $NC = AC - AN$.',
          '$NC = ' + d.NC + '$. Rồi $\\frac{AM}{MB} = \\frac{AN}{NC}$: $' + fr('y', d.MB) + ' = ' + fr(d.AN, d.NC) + '$.'],
        loiGiai: ['$\\angle AMN = \\angle ABC$ (đồng vị) nên $MN \\parallel BC$.', '$NC = AC - AN = ' + AC + ' - ' + d.AN + ' = ' + d.NC + '$.',
          'Theo định lí Thalès: $' + fr('y', d.MB) + ' = ' + fr(d.AN, d.NC) + '$', '$y = ' + fr(d.MB + ' \\cdot ' + d.AN, d.NC) + ' = ' + d.AM + '$'],
        loiThuongGap: ltg
      };
    } },

    { ten: 'Bài toán thực tế: đo khoảng cách, chiều cao', muc: 3, sinh: function (r) {
      if (r.dau() > 0) {
        // Đo chiều rộng/ khoảng cách qua sông: E, A, B thẳng hàng; AC // BD; EA, AB, EC → CD
        var k = r.chon([20, 30, 40, 50]), a = r.so(2, 6), b = r.so(2, 5), c = r.so(3, 8);
        var EA = a * k, AB = b * k, EC = c * k, CD = c * b * k / a;
        var n = 0;
        while (n < 50 && (CD % 1 !== 0 || c * k <= EA)) { a = r.so(2, 6); b = r.so(2, 5); c = r.so(3, 8); EA = a * k; AB = b * k; EC = c * k; CD = c * b * k / a; n++; }
        if (CD % 1 !== 0) { a = 4; b = 2; c = 6; EA = 4 * k; AB = 2 * k; EC = 6 * k; CD = 3 * k; }
        // hình: E trên cao, A, B trên đường thẳng đứng; C, D theo tỉ lệ thật (chia cho k để vẽ)
        var sc = 1 / k, xC = Math.sqrt(Math.max(1, c * c - a * a)), ltg = [];
        var hinh = TOAN8.hinhGeo({ diem: { E: [0, (EA + AB) * sc], A: [0, AB * sc], B: [0, 0], C: [xC, AB * sc], D: [xC * (a + b) / a, 0] },
          ve: [[[-1.5, AB * sc], [xC * (a + b) / a + 1.5, AB * sc], { mau: '#74c0fc', day: 3 }], [[-1.5, 0], [xC * (a + b) / a + 1.5, 0], { mau: '#74c0fc', day: 3 }]],
          canh: [['E', 'B'], ['E', 'D'], ['A', 'C', { mau: CAM, day: 3 }], ['B', 'D', { mau: XANH, day: 3 }]],
          nhan: [['E', 'A', EA + ' m'], ['A', 'B', AB + ' m'], ['E', 'C', EC + ' m', false, 1.3]],
          lechTen: { A: [-14, 12], B: [-14, -14], C: [6, 16], D: [8, -16], E: [-14, 6] }, ghiChu: 'Hai bờ sông song song' });
        if (lech(EC + CD, CD)) ltg.push({ gt: EC + CD, giaiThich: '$' + (EC + CD) + '$ m là cả đoạn $ED$. Đề hỏi $CD = ED - EC$.' });
        var sai = EC * EA / AB;
        if (lech(sai, CD) && lech(sai, EC + CD)) ltg.push({ gt: Math.round(sai * 1e6) / 1e6, giaiThich: 'Em ghép lệch: $EA$ phải ứng với $EC$ (cùng sát đỉnh $E$), $AB$ ứng với $CD$.' });
        return {
          de: 'Để đo khoảng cách $CD$ ($C$ ở bờ bên này, $D$ ở bờ bên kia, hai bờ sông song song), người ta chọn điểm $E$ sao cho $E$, $A$, $B$ thẳng hàng và $E$, $C$, $D$ thẳng hàng ($A$, $C$ ở một bờ; $B$, $D$ ở bờ kia). Đo được $EA = ' + EA + '$ m, $AB = ' + AB + '$ m, $EC = ' + EC + '$ m. Tính $CD$ (m).',
          hinh: hinh, dapAn: { kieu: 'so', gt: CD },
          goiY: ['Hai bờ sông song song nên $AC \\parallel BD$. Xét tam giác $EBD$.', 'Định lí Thalès: $\\frac{EA}{AB} = \\frac{EC}{CD}$, tức $' + fr(EA, AB) + ' = ' + fr(EC, 'CD') + '$.'],
          loiGiai: ['Hai bờ sông song song nên $AC \\parallel BD$. Trong $\\triangle EBD$, theo định lí Thalès: $\\frac{EA}{AB} = \\frac{EC}{CD}$, tức $' + fr(EA, AB) + ' = ' + fr(EC, 'CD') + '$',
            '$CD = ' + fr(EC + ' \\cdot ' + AB, EA) + ' = ' + CD + '$ (m)'],
          loiThuongGap: ltg
        };
      }
      // Đo chiều cao cây bằng cọc: cọc và cây cùng vuông góc mặt đất nên song song
      var vat = r.chon(['cây', 'cột cờ', 'cột điện', 'toà nhà nhỏ']);
      var coc = r.chon([1, 1.5, 2]), a2, b2, H, m = 0;
      do { a2 = r.so(3, 6); b2 = r.so(4, 16); H = coc * (a2 + b2) / a2; m++; } while (m < 80 && (Math.abs(H * 2 - Math.round(H * 2)) > 1e-9 || H < 3 || H > 15));
      if (Math.abs(H * 2 - Math.round(H * 2)) > 1e-9 || H < 3 || H > 15) { coc = 2; a2 = 4; b2 = 16; H = 10; }
      var OB = a2 + b2, ltg2 = [];
      var sai1 = coc * b2 / a2;
      if (lech(sai1, H)) ltg2.push({ gt: Math.round(sai1 * 1e6) / 1e6, giaiThich: 'Em dùng $\\frac{OA}{AB}$ (đoạn trên / đoạn dưới) để so với cạnh song song. Với đoạn song song phải dùng **cả cạnh**: $\\frac{AA\'}{BB\'} = \\frac{OA}{OB}$, $OB = ' + OB + '$ m.' });
      var hinh2 = TOAN8.hinhGeo({ diem: { O: [0, 0], A: [a2, 0], "A'": [a2, coc], B: [OB, 0], "B'": [OB, H] },
        canh: [['O', 'B'], ['O', "B'", { mau: '#f08c00', net: 2 }], ['A', "A'", { mau: CAM, day: 4 }], ['B', "B'", { mau: '#2f9e44', day: 5 }]],
        nhan: [['O', 'A', a2 + ' m', false, 1.6], ['A', 'B', b2 + ' m', false, 1.6], ['A', "A'", String(coc).replace('.', ',') + ' m', false, 1.6]],
        lechTen: { O: [-12, -12], A: [0, -16], B: [0, -16], "A'": [12, 12], "B'": [14, 8] }, ghiChu: 'Tia nắng đi qua đỉnh cọc và đỉnh ' + vat });
      return {
        de: 'Để đo chiều cao $BB\'$ của một ' + vat + ', bạn ' + r.chon(['Nam', 'Lan', 'Minh', 'Hà']) + ' cắm một cọc thẳng đứng $AA\'$ cao $' + cc_so(coc) + '$ m sao cho bóng nắng của đỉnh cọc và đỉnh ' + vat + ' trùng nhau tại điểm $O$ trên mặt đất. Đo được $OA = ' + a2 + '$ m, $AB = ' + b2 + '$ m. Tính chiều cao $BB\'$ (m).',
        hinh: hinh2, dapAn: { kieu: 'so', gt: H },
        goiY: ['Cọc và ' + vat + ' cùng vuông góc với mặt đất nên $AA\' \\parallel BB\'$. Xét tam giác $OBB\'$.',
          'Hệ quả của định lí Thalès: $\\frac{OA}{OB} = \\frac{AA\'}{BB\'}$ với $OB = ' + a2 + ' + ' + b2 + ' = ' + OB + '$ m.'],
        loiGiai: ['$AA\' \\parallel BB\'$ (cùng vuông góc với mặt đất), $OB = OA + AB = ' + OB + '$ m.',
          'Hệ quả của định lí Thalès trong $\\triangle OBB\'$: $\\frac{OA}{OB} = \\frac{AA\'}{BB\'}$, tức $' + fr(a2, OB) + ' = ' + fr(cc_so(coc), 'BB\'') + '$',
          '$BB\' = ' + fr(cc_so(coc) + ' \\cdot ' + OB, a2) + ' = ' + cc_so(H) + '$ (m)'],
        loiThuongGap: ltg2
      };
    } }
  ]);
  function cc_so(x) { return String(Math.round(x * 1e6) / 1e6).replace('.', '{,}'); }
})();
