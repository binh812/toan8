// Cảnh cho chương VI: phân thức đại số. Tại một giá trị của x, tử và mẫu là hai con số, phân thức là thương của chúng.
// doanChia: giá trị = số lần đoạn mẫu nằm vừa trong đoạn tử (mẫu bằng 0 thì không đo được).
// luoiPhanSo: phân số là phần tô của một hình chữ nhật chia ô (chia lưới mịn, đưa về cùng lưới, tô chồng hai chiều).
// theNhanTu: mỗi nhân tử là một thẻ; mẫu thức chung lấy đủ thẻ của mọi mẫu, rút gọn là bỏ từng cặp thẻ giống nhau.
// buocNhay: cộng các giá trị là nối các bước nhảy trên trục số.
(function (C) {
  'use strict';
  var GAN = 1e-9;
  function la(v) { return typeof v === 'number' && isFinite(v); }
  // Đa thức ghi bằng mảng hệ số từ bậc 0 lên: [3, 2] là 3 + 2x. Một số thì giữ nguyên
  function giaTri(v, x) {
    if (Array.isArray(v)) {
      if (!la(x)) throw new Error('phanThuc: cần giá trị của x');
      return v.reduceRight(function (s, a) { return s * x + a; }, 0);
    }
    if (!la(v)) throw new Error('phanThuc: tử hoặc mẫu không phải số');
    return v;
  }
  function nguyen(v) { return la(v) && Math.abs(v - Math.round(v)) < GAN; }
  // Số đã làm tròn thì ghi ≈, không ghi =
  // Viết tới 3 chữ số thập phân (0,125 không bị tròn thành 0,13); còn dư thì ghi ≈
  function tron(v) { return Math.abs(v * 1000 - Math.round(v * 1000)) > 1e-6; }
  function viet(v) { return (v < -GAN ? '−' : '') + String(Math.round(Math.abs(v) * 1000) / 1000).replace('.', ','); }
  function bang(v) { return (tron(v) ? ' ≈ ' : ' = ') + viet(v); }
  function ucln(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function huong(neo, mau) { return { style: 'fill:var(' + (mau || '--muc') + ');text-anchor:' + neo }; }
  function hop(a, b) { var o = {}; [a, b].forEach(function (m) { for (var k in m || {}) o[k] = m[k]; }); return o; }
  function hcn(svg, r, them) { return C.mk('rect', hop({ x: r.x, y: r.y, width: Math.max(0, r.w), height: Math.max(0, r.h) }, them), svg); }

  /* ================= 1. Đoạn chia: mẫu nằm vừa trong tử bao nhiêu lần ================= */
  function hangDoan(o) { return o.hang || [{ tu: o.tu, mau: o.mau, tenTu: o.tenTu, tenMau: o.tenMau, x: o.x }]; }
  // Đường đi của x: đứng yên 10% đầu, mỗi chặng chạy nửa đầu rồi đứng ở giá trị mới
  function theoDuong(xs, t) {
    var n = xs.length;
    if (n === 1) return xs[0];
    var s = C.kep((t - 0.1) / 0.9, 0, 1) * (n - 1), i = Math.min(n - 2, Math.floor(s));
    return C.noiSuy(xs[i], xs[i + 1], C.muot((s - i) / 0.5));
  }
  function xCuaHang(h, o, p, t) {
    if (la(p.thu)) return p.thu;
    if (p.trangThai === 'giai' && la(o.xGiai)) return o.xGiai;
    if (o.xs) return theoDuong(o.xs, t);
    return la(h.x) ? h.x : o.x;
  }
  // ep: thử phá, thu đoạn mẫu còn ep lần (1 là giữ nguyên, 0 là ép mẫu về 0)
  function doDoan(h, x, ep) {
    var A = giaTri(h.tu, x), B0 = giaTri(h.mau, x), B = ep == null ? B0 : B0 * ep, xd = Math.abs(B) > GAN;
    return { x: x, A: A, B: B, B0: B0, xd: xd, dem: xd ? Math.abs(A) / Math.abs(B) : null, gt: xd ? A / B : null };
  }
  // Số viết trong $…$: dấu trừ thường, phẩy {,}; số âm đặt trong ngoặc khi đứng sau dấu nhân
  function soL(v) { return (v < -GAN ? '-' : '') + String(Math.round(Math.abs(v) * 1000) / 1000).replace('.', '{,}'); }
  function ngoac(v) { return v < -GAN ? '(' + soL(v) + ')' : soL(v); }
  function bangL(v) { return (tron(v) ? ' \\approx ' : ' = ') + soL(v); }
  function phan(a, b) { return '\\frac{' + soL(a) + '}{' + soL(b) + '}'; }
  function khong(v) { return Math.abs(v) < GAN; }
  // "bằng $7$", "gần bằng $1{,}667$", hoặc theo cách viết nội dung đưa ("bằng $5/3$")
  function giaTriL(v, s) { return s ? 'bằng $' + String(s).replace(/−/g, '-') + '$' : (tron(v) ? 'gần bằng $' : 'bằng $') + soL(v) + '$'; }
  // Thử phá đoạn chia: ép đoạn mẫu ngắn dần về 0. Không có số nào nhân với 0 ra tử, nên tử : 0 không có giá trị.
  function phaDoan(h, ep) {
    var A = h.A, B = h.B, B0 = h.B0;
    var X = h.coX ? 'Tại $x = ' + soL(h.x) + '$' : 'Ở đây', x = h.coX ? 'tại $x = ' + soL(h.x) + '$' : 'ở đây';
    // Nhắc giá trị thật của phân thức: đoạn đã thu chỉ là phép thử, không phải phân thức
    var that = khong(B0) ? ' Còn phân thức thật ' + x + ' có mẫu bằng $0,$ cũng không có giá trị.'
      : ' Đây là đoạn đã thu, không phải giá trị phân thức: ' + x + ' phân thức vẫn bằng $' + phan(A, B0) + bangL(A / B0) + '.$';
    if (ep < GAN) {
      if (khong(A)) return { hong: true, chu: 'Đoạn mẫu thu về $0,$ mà tử cũng bằng $0$: được $\\frac{0}{0}.$ Số nào nhân với $0$ cũng ra $0,$ nên không có một giá trị duy nhất.' + that };
      return { hong: true, chu: 'Đoạn mẫu thu về $0.$ Đặt $10,$ $100$ hay $1000$ bản thì vẫn dài $1000 \\cdot 0 = 0,$ không phủ được đoạn tử dài $' + soL(Math.abs(A)) + '.$ Không có số nào nhân với $0$ ra $' + soL(A) + ',$ nên chia cho $0$ không có kết quả.' + that };
    }
    if (khong(B0)) return { hong: false, chu: X + ' mẫu đã bằng $0$: không đếm được số lần đặt, nên phân thức không xác định. Đúng như điều kiện mẫu khác $0.$' };
    if (ep < 1 - GAN) return { hong: false, chu: 'Đoạn mẫu thu còn $' + soL(ep) + ' \\cdot ' + ngoac(B0) + bangL(B) + ',$ phải đặt $' + soL(Math.abs(A)) + ' : ' + soL(Math.abs(B)) + bangL(h.dem) + '$ lần. Đoạn càng ngắn, số lần càng lớn; còn khác $0$ thì vẫn đếm được.' + that };
    return { hong: false, chu: X + ' mẫu bằng $' + soL(B) + ' \\ne 0,$ đoạn mẫu đặt vừa $' + soL(Math.abs(A)) + ' : ' + soL(Math.abs(B)) + bangL(h.dem) + '$ lần, nên $' + phan(A, B) + bangL(h.gt) + '.$' };
  }
  // "tử 2x + 3 = 17"; tên đã là chính con số thì không ghi lại "= 9"
  // Tên đa thức gõ kiểu máy (x^2-5) đổi thành kiểu sách (x² − 5)
  function dep(s) {
    return String(s).replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\*/g, '·')
      .replace(/(\S)\s*([+\-−])\s*/g, function (m, a, d) { return a + ' ' + d + ' '; }).replace(/-/g, '−');
  }
  // soChu: cách viết con số do nội dung đưa (ví dụ phân số −2/3 thay cho −0,667)
  function nhanDoan(chu, ten, v, chua, soChu) {
    var so = chua ? ' = ?' : soChu ? ' = ' + soChu : bang(v);
    if (ten) ten = dep(ten);
    if (!ten) return chu + so;
    return chu + ' ' + ten + (' = ' + String(ten).replace(/\s/g, '') === so ? '' : so);
  }
  C.dangKi('doanChia', {
    thamSo: { epMau: { min: 0, max: 1, step: 0.1, md: 1, nhan: 'Thu ngắn đoạn mẫu', pha: true } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var ep = la(p.epMau) ? C.kep(p.epMau, 0, 1) : 1;
      var giai = p.trangThai === 'giai', coThu = la(p.thu), dongDuong = !!o.xs && !coThu && !(giai && la(o.xGiai));
      // Một tỉ lệ chung cho mọi khung của đường đi, để thấy rõ đoạn nào dài ra, ngắn lại
      var L = GAN;
      // o.hangGiai: các hàng vẽ khi em giải đúng (ví dụ mọi giá trị làm mẫu bằng 0)
      var hang = (giai && o.hangGiai ? o.hangGiai : hangDoan(o)).map(function (h) {
        var cacX = [xCuaHang(h, o, p, t)].concat(o.xs || [], la(o.xGiai) ? [o.xGiai] : [], la(h.x) ? [h.x] : []);
        cacX.forEach(function (x) {
          var d = doDoan(h, Array.isArray(h.tu) || Array.isArray(h.mau) ? x : 0);
          L = Math.max(L, Math.abs(d.A), Math.abs(d.B));
        });
        return { h: h, d: doDoan(h, cacX[0], ep) };
      });
      var hienDoan = o.anLucDau && !giai && !coThu ? C.muot((t - 0.05) / 0.35) : 1;
      var hienBan = dongDuong || giai || coThu ? 1 : o.anGiaTri ? 0 : C.muot((t - 0.4) / 0.45);
      var hienGT = dongDuong || giai || coThu ? 1 : o.anGiaTri ? 0 : C.muot((t - 0.85) / 0.15);
      var ra = hang.map(function (r) {
        var d = r.d, ban = [];
        // Các bản đoạn mẫu đặt nối tiếp dọc đoạn tử; bản cuối có thể chỉ là một phần
        if (d.xd && d.dem > GAN) {
          var daDat = d.dem * hienBan, soBan = Math.ceil(d.dem - GAN);
          for (var i = 0; i < soBan && i < daDat; i++) ban.push({ tu: i * Math.abs(d.B), dai: Math.min(1, daDat - i, d.dem - i) * Math.abs(d.B), du: d.dem - i >= 1 - GAN });
        }
        return { x: d.x, A: d.A, B: d.B, B0: d.B0, xd: d.xd, dem: d.dem, gt: d.gt, ban: ban, tenTu: r.h.tenTu, tenMau: r.h.tenMau, ten: r.h.ten,
          chuTu: r.h.chuTu || 'tử', chuMau: r.h.chuMau || 'mẫu', soTu: r.h.soTu, soMau: r.h.soMau, coX: Array.isArray(r.h.tu) || Array.isArray(r.h.mau) };
      });
      return { hang: ra, L: L, hienDoan: hienDoan, hienBan: hienBan, hienGT: hienGT, hienTach: giai ? 1 : C.muot((t - 0.5) / 0.3), giai: giai, coThu: coThu,
        ep: ep, pha: phaDoan(ra[0], ep) };
    }
  });
  C.lay('doanChia').ve = function (svg, k, p, t, o) {
    var X0 = 4, RONG = 92, CO = 5.8, CAO = 7, y = 3, mk = C.mk;
    var g0 = mk('g', {}, svg);
    // Dòng x chung ở trên cùng khi mọi hàng cùng một x
    var cungX = k.hang.every(function (h) { return h.coX && Math.abs(h.x - k.hang[0].x) < GAN; }) && !o.anX;
    if (cungX) { C.chu(g0, X0, y + 3.5, 'x' + bang(k.hang[0].x) + (k.coThu ? ' (em chọn)' : ''), CO, null, huong('start', '--muc')); y += 9; }
    k.hang.forEach(function (h, iHang) {
      // o.tiLeRieng: mỗi hàng một tỉ lệ (khi các hàng chênh nhau quá nhiều)
      // o.anSo: giấu mọi con số tới khi em giải đúng (đoạn vẫn hiện)
      var g = mk('g', {}, svg), ve = k.hienDoan, chua = ve < 0.5 || (o.anSo && !k.giai && !k.coThu), s = RONG / (o.tiLeRieng ? Math.max(Math.abs(h.A), Math.abs(h.B), GAN) : k.L);
      if (h.ten) { C.chu(g, X0, y + 3, h.ten, CO * 0.85, null, huong('start', '--nhat')); y += 7; }
      var xRieng = h.coX && !cungX && !o.anX ? ' (x = ' + viet(h.x) + ')' : '';
      C.chu(g, X0, y + 3.5, nhanDoan(h.chuTu, h.tenTu, h.A, chua, h.soTu) + xRieng, CO, null, huong('start', '--a'));
      var yTu = y + 7.5, yMau = yTu + CAO + 1.6;
      var am = function (v) { return v < -GAN ? { 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-dasharray': '1.4 0.8', 'stroke-width': 0.4 } : { 'fill-opacity': 0.85 }; };
      var gd = mk('g', { opacity: ve }, g), hau = iHang ? String(iHang) : '';
      var gTu = mk('g', { 'data-soi': 'tu' + hau }, gd), gMau = mk('g', { 'data-soi': 'mau' + hau }, gd), gBan = mk('g', { 'data-soi': 'ban' + hau }, gd);
      if (Math.abs(h.A) > GAN) hcn(gTu, { x: X0, y: yTu, w: Math.abs(h.A) * s, h: CAO }, hop({ fill: 'var(--a)', rx: 0.6, style: 'color:var(--a)' }, am(h.A)));
      else mk('circle', { cx: X0, cy: yTu + CAO / 2, r: 1.3, fill: 'var(--a)' }, gTu);
      // Bản đầu tiên chính là đoạn mẫu; các bản sau nhạt hơn và đánh số
      if (h.xd) {
        if (!h.ban.length) hcn(gMau, { x: X0, y: yMau, w: Math.abs(h.B) * s, h: CAO }, hop({ fill: 'var(--b)', rx: 0.6, style: 'color:var(--b)' }, am(h.B)));
        var day = h.ban.length > 60;
        h.ban.forEach(function (b, i) {
          var r = { x: X0 + b.tu * s, y: yMau, w: b.dai * s, h: CAO }, cha = i ? gBan : gMau;
          hcn(cha, r, hop({ fill: 'var(--b)', 'fill-opacity': i ? (i % 2 ? 0.4 : 0.62) : 0.85, stroke: day ? 'none' : 'var(--mat)', 'stroke-width': 0.35 }, h.B < -GAN && !i ? { 'stroke-dasharray': '1.4 0.8', stroke: 'var(--b)' } : null));
          var so = String(i + 1), co = Math.min(4.6, r.w * 0.8 / so.length / 0.6);
          // Nhiều bản quá thì không đánh số, kẻo các số chen chúc
          if (h.ban.length <= 16 && b.du && co >= 2.4 && h.ban.length > 1) C.chu(cha, r.x + r.w / 2, yMau + CAO / 2 + 0.2, so, co, null, { style: 'fill:var(--mat)' });
        });
      } else {
        mk('circle', { cx: X0, cy: yMau + CAO / 2, r: 1.5, fill: 'var(--sai)' }, gMau);
        // Thử phá ép mẫu về 0: khung nét đứt dài bằng đoạn tử, chỗ mà các bản dài 0 không bao giờ phủ được
        if (k.ep < GAN && Math.abs(h.A) > GAN) hcn(gMau, { x: X0, y: yMau, w: Math.abs(h.A) * s, h: CAO }, { fill: 'none', stroke: 'var(--sai)', 'stroke-width': 0.45, 'stroke-dasharray': '1.4 0.8', rx: 0.6 });
      }
      var yChu = yMau + CAO + 5.5;
      // Đang thử phá thu ngắn mẫu: ghi rõ mẫu thật và mẫu sau khi thu
      var chuMau = k.ep < 1 - GAN && !chua ? h.chuMau + ' thu còn ' + viet(k.ep) + ' · ' + (h.B0 < -GAN ? '(' + viet(h.B0) + ')' : viet(h.B0)) + bang(h.B) : nhanDoan(h.chuMau, h.tenMau, h.B, chua, h.soMau);
      C.chu(g, X0, yChu, chuMau, CO, null, huong('start', h.xd ? '--b' : '--sai'));
      // o.tachMau: mẫu viết thành tích, hiện dần (nút "Phân tích mẫu")
      if (o.tachMau) { yChu += 7.5; C.chu(g, X0, yChu, 'mẫu = ' + o.tachMau, CO, null, hop(huong('start', '--b'), { opacity: k.hienTach < 0.01 ? 0 : k.hienTach })); }
      var kq, mauKq = '--muc';
      // Đang thu đoạn mẫu (thử phá): phép chia là của đoạn đã thu, không phải giá trị phân thức
      var thu = k.ep < 1 - GAN && !khong(h.B0);
      if (chua) kq = '';
      else if (thu && !h.xd) { kq = 'đoạn thu về 0: không phủ được'; mauKq = '--sai'; }
      else if (thu) kq = 'đoạn đã thu: ' + viet(h.A) + ' : ' + viet(h.B) + bang(h.gt);
      else if (!h.xd) { kq = 'mẫu bằng 0: không chia được'; mauKq = '--sai'; }
      else if (Math.abs(h.A) < GAN) kq = 'tử bằng 0, nên giá trị = 0';
      else kq = (h.soTu || viet(h.A)) + ' : ' + (h.soMau || viet(h.B)) + (k.hienGT > 0.5 ? bang(h.gt) : ' = ?');
      if (kq) C.chu(g, X0, yChu + 7.5, kq, CO, null, hop(huong('start', mauKq), hop(!h.xd || k.hienGT > 0.5 ? null : { opacity: 0.8 }, { 'data-soi': 'giaTri' + hau })));
      y = yChu + 13;
    });
    svg.setAttribute('viewBox', '0 0 100 ' + Math.max(40, y));
  };

  // Soi chi tiết: đoạn tử, đoạn mẫu, các bản đặt nối tiếp, giá trị. Số nào hình đang giấu thì thẻ soi cũng giấu.
  C.lay('doanChia').soi = function (k, p, o) {
    var ra = {};
    k.hang.forEach(function (h, i) {
      var hau = i ? String(i) : '', chua = k.hienDoan < 0.5 || (o.anSo && !k.giai && !k.coThu), anGT = chua || (o.anGiaTri && !k.giai && !k.coThu) || k.hienGT <= 0.5;
      var X = h.coX && !o.anX ? ' tại $x = ' + soL(h.x) + '$' : '', ten = function (s) { return s ? ' ' + dep(s) : ''; };
      ra['tu' + hau] = { tieuDe: 'Đoạn ' + h.chuTu, chu: chua ? 'Đoạn này dài bằng giá trị của tử. Giá trị phân thức là số lần đoạn mẫu nằm vừa trong nó.'
        : h.chuTu.charAt(0).toUpperCase() + h.chuTu.slice(1) + ten(h.tenTu) + X + ' ' + giaTriL(h.A, h.soTu) + (h.A < -GAN ? ', số âm nên vẽ nét đứt' : '') + '. Giá trị phân thức là số lần đoạn mẫu nằm vừa trong đoạn này.' };
      ra['mau' + hau] = { tieuDe: 'Đoạn ' + h.chuMau, chu: chua ? 'Đoạn này dài bằng giá trị của mẫu. Mẫu phải khác $0$ thì mới đặt nối tiếp được.'
        : k.ep < 1 - GAN && !khong(h.B0) ? 'Mẫu thật' + X + ' ' + giaTriL(h.B0) + '. ' + (h.xd ? 'Em đang thu đoạn mẫu còn $' + soL(k.ep) + '$ lần, dài $' + soL(h.B) + '$: mẫu càng ngắn, phải đặt càng nhiều bản.' : 'Em đang ép đoạn mẫu về $0$: đoạn dài $0$ thì đặt bao nhiêu bản cũng không phủ được đoạn tử.')
        : !h.xd ? 'Mẫu bằng $0$' + X + ': đoạn dài $0$, đặt bao nhiêu bản cũng không phủ được đoạn tử. Phân thức không xác định, nên điều kiện là mẫu khác $0$.'
        : h.chuMau.charAt(0).toUpperCase() + h.chuMau.slice(1) + ten(h.tenMau) + X + ' ' + giaTriL(h.B, h.soMau) + ', khác $0$, nên đặt được nối tiếp dọc đoạn tử.' };
      ra['ban' + hau] = { tieuDe: 'Các bản đoạn ' + h.chuMau, chu: anGT || !h.xd ? 'Đặt các bản của đoạn ' + h.chuMau + ' nối tiếp nhau cho tới khi phủ vừa đoạn ' + h.chuTu + '. Bản cuối có thể chỉ là một phần.'
        : 'Có $' + soL(h.dem).replace(/^/, tron(h.dem) ? '\\approx ' : '') + '$ bản (bản cuối có thể chỉ là một phần). Đó là số lần đoạn ' + h.chuMau + ' nằm vừa trong đoạn ' + h.chuTu + '.' };
      var thu = k.ep < 1 - GAN && !khong(h.B0), giaThat = (h.coX ? 'Tại $x = ' + soL(h.x) + '$' : 'Ở đây') + ' phân thức vẫn bằng $' + phan(h.A, h.B0) + bangL(h.A / h.B0) + '.$';
      if (thu) ra['ban' + hau].chu += ' (Đây là các bản của đoạn đã thu.)';
      ra['giaTri' + hau] = { tieuDe: 'Giá trị', chu: anGT ? 'Giá trị là tử chia mẫu, khi mẫu khác $0$.'
        : thu ? (h.xd ? 'Đây là $' + soL(h.A) + ' : ' + soL(h.B) + bangL(h.gt) + '$ của đoạn đã thu, không phải giá trị phân thức. ' : 'Đoạn mẫu đã thu về $0,$ chia cho $0$ không có kết quả. Đó là đoạn đã thu, không phải phân thức. ') + giaThat
        : !h.xd ? (khong(h.A) ? 'Số nào nhân với $0$ cũng ra $0,$ nên không có một giá trị duy nhất.' : 'Không có số nào nhân với $0$ ra $' + soL(h.A) + ',$ nên không có giá trị.')
        : 'Tử chia mẫu: $' + (h.soTu || h.soMau ? (tron(h.gt) ? '\\approx ' : '') : phan(h.A, h.B) + (tron(h.gt) ? ' \\approx ' : ' = ')) + soL(h.gt) + '$.' + (h.gt < -GAN ? ' Tử và mẫu khác dấu nên giá trị âm.' : '') };
    });
    return ra;
  };

  /* ================= 2. Lưới phân số ================= */
  var MAX_COT = 16, MAX_HANG = 12, MAX_O = 200;
  function phanSo(q, x) { return { a: giaTri(q.tu, x), b: giaTri(q.mau, x) }; }
  function veDuoc(a, b) { return nguyen(a) && nguyen(b) && a >= -GAN && b >= 1 - GAN; }
  function oTrong(r, cot, hang, c, h) { return { x: r.x + c * r.w / cot, y: r.y + h * r.h / hang, w: r.w / cot, h: r.h / hang }; }
  function lerpO(P, Q, k) { return { x: C.noiSuy(P.x, Q.x, k), y: C.noiSuy(P.y, Q.y, k), w: C.noiSuy(P.w, Q.w, k), h: C.noiSuy(P.h, Q.h, k) }; }
  function khongVe(ly) { return { loi: ly }; }

  // Một phân số a/b, mỗi ô cột chia thành M ô nhỏ. chieu 'chia': t đưa lưới thô thành lưới mịn; 'gop': ngược lại
  function luoiMot(o, x, t) {
    var q = phanSo(o, x), M = giaTri(o.M == null ? 1 : o.M, x), a = q.a, b = q.b;
    if (!veDuoc(a, b) || !nguyen(M) || M < 1) return khongVe('Tại x này tử, mẫu không phải số đếm được nên không vẽ ô.');
    a = Math.round(a); b = Math.round(b); M = Math.round(M);
    var n = Math.max(1, Math.ceil(a / b - GAN));
    if (b > MAX_COT || M > MAX_HANG || n > 4 || b * M * n > MAX_O) return khongVe('Số lớn quá để vẽ từng ô.');
    var k = C.muot((t - 0.15) / 0.55), mien = o.chieu === 'gop' ? 1 - k : k;
    var rong = n === 1 ? 70 : (88 - (n - 1) * 4) / n, cao = n === 1 ? 40 : Math.min(40, rong * 0.9);
    var khoi = [], x0 = (100 - (n * rong + (n - 1) * 4)) / 2;
    for (var i = 0; i < n; i++) khoi.push({ x: x0 + i * (rong + 4), y: 12, w: rong, h: cao });
    var to = [];
    for (var c = 0; c < a; c++) { var w = Math.floor(c / b); to.push(oTrong(khoi[w], b, 1, c - w * b, 0)); }
    return { dang: 'mot', x: x, a: a, b: b, M: M, n: n, khoi: khoi, cotTo: to, mien: mien, gtCu: a / b, gtMoi: a * M / (b * M), oToMoi: a * M, oCaMoi: b * M, day: 12 + cao };
  }

  // Hai phân số a1/b1, a2/b2 đưa về cùng mẫu chung Mc: phân số thứ nhất chia cột rồi cắt ngang thêm k1 = Mc/b1,
  // phân số thứ hai chia hàng rồi cắt dọc thêm k2 = Mc/b2. Các ô xanh bay sang lưới của tổng (cong) hoặc đè lên ô cam rồi cùng bỏ (tru)
  function luoiCong(o, x, t, tru) {
    var q1 = phanSo(o.p1, x), q2 = phanSo(o.p2, x);
    if (!veDuoc(q1.a, q1.b) || !veDuoc(q2.a, q2.b)) return khongVe('Tại x này tử, mẫu không phải số đếm được nên không vẽ ô.');
    var a1 = Math.round(q1.a), b1 = Math.round(q1.b), a2 = Math.round(q2.a), b2 = Math.round(q2.b);
    var Mc = o.mtc != null ? giaTri(o.mtc, x) : b1 / ucln(b1, b2) * b2;
    if (!nguyen(Mc) || Mc < 1) return khongVe('Mẫu chung không phải số đếm được.');
    Mc = Math.round(Mc);
    if (Mc % b1 || Mc % b2) throw new Error('luoiPhanSo: mẫu chung phải chia hết cho từng mẫu');
    var k1 = Mc / b1, k2 = Mc / b2, s1 = a1 * k1, s2 = a2 * k2, tong = tru ? s1 - s2 : s1 + s2;
    if (a1 > b1 || a2 > b2) return khongVe('Mỗi phân số phải không lớn hơn 1 để vẽ trong một hình.');
    if (tong < 0) return khongVe('Hiệu âm, không vẽ được bằng ô.');
    var n = Math.max(1, Math.ceil((tru ? s1 : tong) / Mc - GAN));
    if (b1 > MAX_COT || b2 > MAX_COT || k1 > MAX_HANG || k2 > MAX_COT || Mc * n > MAX_O || n > 2) return khongVe('Số lớn quá để vẽ từng ô.');
    var cungMau = b1 === b2;
    var A = { x: 5, y: 12, w: 40, h: 28 }, B = { x: 55, y: 12, w: 40, h: 28 }, khoi = [{ x: 5, y: 58, w: 40, h: 28 }, { x: 55, y: 58, w: 40, h: 28 }].slice(0, n);
    var cat = C.muot((t - 0.1) / 0.3), bay = C.muot((t - 0.5) / 0.35), ket = C.muot((t - 0.88) / 0.12);
    // Ô của mẫu chung trong lưới tổng: b1 cột × k1 hàng, đánh số theo từng cột
    function oTong(i) { var w = Math.floor(i / Mc), j = i - w * Mc, c = Math.floor(j / k1); return oTrong(khoi[w], b1, k1, c, j - c * k1); }
    var cam = [], xanh = [], i;
    for (i = 0; i < s1; i++) { var c1 = Math.floor(i / k1); cam.push({ goc: oTrong(A, b1, k1, c1, i - c1 * k1), dich: oTong(i) }); }
    for (i = 0; i < s2; i++) {
      // Cùng mẫu: hình thứ hai cũng chia cột. Khác mẫu: chia hàng, mỗi hàng cắt dọc thành k2 ô
      var q = Math.floor(i / k2), tu = cungMau ? oTrong(B, b2, k2, q, i - q * k2) : oTrong(B, k2, b2, i - q * k2, q);
      var den = oTong(tru ? s1 - s2 + i : s1 + i);
      xanh.push({ goc: tu, dich: den, o: lerpO(tu, den, bay) });
    }
    return { dang: tru ? 'tru' : 'cong', x: x, a1: a1, b1: b1, a2: a2, b2: b2, Mc: Mc, k1: k1, k2: k2, s1: s1, s2: s2, tong: tong, n: n, cungMau: cungMau,
      A: A, B: B, khoi: khoi, cam: cam, xanh: xanh, cat: cat, bay: bay, ket: ket, gt: tong / Mc, day: 58 + 28 };
  }

  // Tô chồng: phân số thứ nhất là dải dọc (a1 trong b1 cột), thứ hai là dải ngang (a2 trong b2 hàng) của hình vuông đơn vị
  function luoiNhan(o, x, t) {
    var q1 = phanSo(o.p1, x), q2 = phanSo(o.p2, x);
    if (!veDuoc(q1.a, q1.b) || !veDuoc(q2.a, q2.b)) return khongVe('Tại x này tử, mẫu không phải số đếm được nên không vẽ ô.');
    var a1 = Math.round(q1.a), b1 = Math.round(q1.b), a2 = Math.round(q2.a), b2 = Math.round(q2.b);
    var c1 = Math.max(a1, b1), c2 = Math.max(a2, b2);
    if (c1 > MAX_COT || c2 > MAX_COT || c1 * c2 > MAX_O || a1 > 2 * b1 || a2 > 2 * b2) return khongVe('Số lớn quá để vẽ từng ô.');
    // Ô vuông đơn vị cạnh S; dải dài hơn 1 thì thò ra ngoài
    var S = Math.min(56, 76 / (c1 / b1), 56 / (c2 / b2)), w = S / b1, h = S / b2;
    var X = 18 + (78 - c1 * w) / 2, Y = 14;
    var an = o.an === 'p1', cot = an ? C.muot((t - 0.3) / 0.5) : C.muot((t - 0.1) / 0.3), hang = an ? 1 : C.muot((t - 0.4) / 0.3);
    var chong = an ? 1 : C.muot((t - 0.72) / 0.2);
    return { dang: 'nhan', x: x, a1: a1, b1: b1, a2: a2, b2: b2, w: w, h: h, X: X, Y: Y, c1: c1, c2: c2,
      vuong: { x: X, y: Y, w: b1 * w, h: b2 * h }, dai1: { x: X, y: Y, w: a1 * w, h: c2 * h }, dai2: { x: X, y: Y, w: c1 * w, h: a2 * h },
      chongO: { x: X, y: Y, w: a1 * w, h: a2 * h }, oChong: a1 * a2, oCa: b1 * b2, gt: a1 * a2 / (b1 * b2),
      hienCot: cot, hienHang: hang, hienChong: chong, hienP1: an ? C.muot((t - 0.88) / 0.12) : 1, day: Y + c2 * h };
  }
  // Thử phá lưới phân số: cho x về 0 hoặc số âm để một mẫu (hay nhân tử M) bằng 0. Tính bằng số, nói rõ chỗ hỏng.
  // dong: các dòng chữ thường (không LaTeX) để vẽ trong hình khi không vẽ được ô.
  function phaLuoi(o, x, dang) {
    var X = la(x) ? 'Tại $x = ' + soL(x) + '$' : 'Ở đây', Xc = la(x) ? 'x = ' + viet(x) : '', dong = [];
    var ps = function (a, b) { return viet(a) + '/' + (b < -GAN ? '(' + viet(b) + ')' : viet(b)); };
    if (dang === 'mot') {
      var a = giaTri(o.tu, x), b = giaTri(o.mau, x), m = giaTri(o.M == null ? 1 : o.M, x), tenM = o.tenM ? String(o.tenM).replace(/−/g, '-') : '';
      dong.push('Bên trái: ' + ps(a, b) + (khong(b) ? ', mẫu bằng 0' : bang(a / b)));
      dong.push('Nhân M = ' + viet(m) + ': ' + ps(a * m, b * m) + (khong(b * m) ? ', mẫu bằng 0' : bang(a / b)));
      // M là đa thức khác 0 nên đẳng thức hai phân thức vẫn đúng; chỉ tại điểm này một vế không có giá trị (chiHinh, không phải hỏng)
      var chiCho = ' Hai phân thức chỉ cùng giá trị ở những chỗ cả hai mẫu khác $0.$ Nếu $M$ là đa thức $0$ thì không còn phân thức nào.';
      if (khong(b)) return { hong: true, chiHinh: true, dong: dong, chu: X + ' mẫu bằng $0$: ngay $' + phan(a, 0) + '$ đã không có giá trị, nên cả hai vế đều không có giá trị.' + chiCho };
      if (khong(m)) return { hong: true, chiHinh: true, dong: dong, chu: X + ' thì $M' + (tenM && tenM !== soL(m) ? ' = ' + tenM : '') + ' = 0.$ Vế trái $' + phan(a, b) + bangL(a / b) + ',$ còn vế phải là $\\frac{' + ngoac(a) + ' \\cdot 0}{' + ngoac(b) + ' \\cdot 0} = \\frac{0}{0},$ không có giá trị.' + chiCho };
      return { hong: false, dong: dong, chu: X + ': $' + phan(a, b) + ' = ' + phan(a * m, b * m) + bangL(a / b) + '.$ Ở đây $M = ' + soL(m) + ' \\ne 0$ nên phân thức không đổi.' };
    }
    var q1 = phanSo(o.p1, x), q2 = phanSo(o.p2, x), a1 = q1.a, b1 = q1.b, a2 = q2.a, b2 = q2.b;
    dong.push('Thứ nhất: ' + ps(a1, b1) + (khong(b1) ? ', mẫu bằng 0' : ''));
    dong.push('Thứ hai: ' + ps(a2, b2) + (khong(b2) ? ', mẫu bằng 0' : ''));
    var hai = phan(a1, b1) + (dang === 'nhan' ? ' \\cdot ' : dang === 'tru' ? ' - ' : ' + ') + phan(a2, b2), hongMau = khong(b1) || khong(b2);
    if (dang === 'nhan') {
      var gon = o.gon, gv = gon ? { a: giaTri(gon.tu, x), b: giaTri(gon.mau, x) } : null;
      if (hongMau) {
        dong.push('Tích: không tính được');
        var them = '';
        if (gv && !khong(gv.b)) { them = ' Thế mà kết quả rút gọn $' + gon.ten + '$ lại cho $' + soL(gv.a / gv.b) + '.$ Rút gọn xong vẫn phải giữ điều kiện $' + gon.dk + '.$'; dong.push('Kết quả rút gọn lại cho ' + viet(gv.a / gv.b) + '!'); }
        return { hong: true, dong: dong, chu: X + ': ' + (khong(b1) ? 'phân thức thứ nhất là $' + phan(a1, 0) + ',$' : 'phân thức thứ hai là $' + phan(a2, 0) + ',$') + ' không có giá trị, nên tích không tính được.' + them };
      }
      dong.push('Tích: ' + ps(a1 * a2, b1 * b2) + bang(a1 * a2 / (b1 * b2)));
      return { hong: false, dong: dong, chu: X + ': $' + hai + ' = \\frac{' + ngoac(a1) + ' \\cdot ' + ngoac(a2) + '}{' + ngoac(b1) + ' \\cdot ' + ngoac(b2) + '} = ' + phan(a1 * a2, b1 * b2) + bangL(a1 * a2 / (b1 * b2)) + ':$ tử nhân tử, mẫu nhân mẫu.' + (gv && !khong(gv.b) ? ' Khớp với $' + gon.ten + bangL(gv.a / gv.b) + '.$' : '') };
    }
    var tru = dang === 'tru', Mc = o.mtc != null ? giaTri(o.mtc, x) : b1 * b2 / (nguyen(b1) && nguyen(b2) && !hongMau ? ucln(Math.round(b1), Math.round(b2)) : 1);
    if (hongMau || khong(Mc)) {
      dong.push('Mẫu chung: ' + viet(Mc) + ', không chia được');
      return { hong: true, dong: dong, chu: X + ': trong $' + hai + '$ có mẫu bằng $0,$ phân thức đó không có giá trị. Mẫu chung bằng $' + soL(Mc) + ',$ không chia hình thành $0$ ô được, nên không ' + (tru ? 'trừ' : 'cộng') + ' được.' };
    }
    var s1 = a1 * Mc / b1, s2 = a2 * Mc / b2, kq = tru ? s1 - s2 : s1 + s2;
    dong.push((tru ? 'Hiệu: ' : 'Tổng: ') + ps(kq, Mc) + bang(kq / Mc));
    return { hong: false, dong: dong, chu: X + ': $' + hai + ' = ' + phan(s1, Mc) + (tru ? ' - ' : ' + ') + phan(s2, Mc) + ' = ' + phan(kq, Mc) + bangL(kq / Mc) + '.$ Hai mẫu khác $0$ nên quy đồng được.' };
  }
  C.dangKi('luoiPhanSo', {
    thamSo: { x: { min: 1, max: 6, step: 1, md: 3, nhan: 'x', mau: '--a' },
      xThu: { min: -3, max: 1, step: 1, md: 1, nhan: 'Thử x ≤ 0', pha: true, hienSo: function (v) { return v >= 1 ? 'tắt' : C.fmt(v); } } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var x = la(o.x) ? o.x : p.x, dang = o.dang || 'mot', k;
      // Thử phá: thanh xThu kéo xuống dưới 1 thì x lấy đúng giá trị đó (0, −1, −2, −3)
      if (la(p.xThu) && p.xThu < 1 - GAN) x = p.xThu;
      if (dang === 'mot') k = luoiMot(o, x, t);
      else if (dang === 'cong' || dang === 'tru') k = luoiCong(o, x, t, dang === 'tru');
      else if (dang === 'nhan') k = luoiNhan(o, x, t);
      else throw new Error('luoiPhanSo: dạng lạ ' + dang);
      if (!k.loi && la(p.thu)) k.thu = { dung: k.dang === 'mot' ? k.gtCu : k.gt, em: p.thu };
      k.giai = p.trangThai === 'giai';
      k.x = x;
      k.pha = phaLuoi(o, x, dang);
      return k;
    }
  });

  function veO(svg, r, mau, op, them) { return hcn(svg, r, hop({ fill: 'var(' + mau + ')', 'fill-opacity': op, stroke: 'none' }, them)); }
  function vien(svg, r, them) { return hcn(svg, r, hop({ fill: 'none', stroke: 'var(--muc)', 'stroke-width': 0.6 }, them)); }
  function keLuoi(svg, r, cot, hang, op, mau) {
    var g = C.mk('g', { opacity: op, stroke: 'var(' + (mau || '--muc') + ')', 'stroke-width': 0.3 }, svg), i;
    for (i = 1; i < cot; i++) C.mk('line', { x1: r.x + i * r.w / cot, y1: r.y, x2: r.x + i * r.w / cot, y2: r.y + r.h }, g);
    for (i = 1; i < hang; i++) C.mk('line', { x1: r.x, y1: r.y + i * r.h / hang, x2: r.x + r.w, y2: r.y + i * r.h / hang }, g);
    return g;
  }
  function chuGiua(svg, x, y, s, co, mau, op) { C.chu(svg, x, y, s, co, mau, op != null && op < 1 ? { opacity: op < 0.01 ? 0 : op } : null); }
  // Hai thanh so sánh: giá trị đúng và giá trị em gõ, cùng một thước (1 đơn vị = 1 hình)
  function veSoSanh(svg, thu, y) {
    // Thanh dài nhất dừng ở 80 để còn chỗ ghi số (tới khoảng 98) trong khung rộng 100
    var lon = Math.max(1, Math.abs(thu.dung), Math.abs(thu.em)), s = 54 / lon, X0 = 26, CO = 5.2;
    [['đúng', thu.dung, '--cc'], ['của em', thu.em, '--sai']].forEach(function (d, i) {
      var yy = y + i * 10;
      C.chu(svg, X0 - 2, yy + 3, d[0], CO, d[2], huong('end', d[2]));
      hcn(svg, { x: X0, y: yy, w: Math.abs(d[1]) * s, h: 6 }, { fill: 'var(' + d[2] + ')', 'fill-opacity': d[1] < 0 ? 0.3 : 0.75 });
      C.chu(svg, X0 + Math.abs(d[1]) * s + 2, yy + 3, viet(d[1]), CO, d[2], huong('start', d[2]));
    });
    for (var v = 1; v <= lon + GAN; v++) C.mk('line', { x1: X0 + v * s, y1: y - 1.5, x2: X0 + v * s, y2: y + 17.5, stroke: 'var(--nhat)', 'stroke-width': 0.3, 'stroke-dasharray': '1 1' }, svg);
    return y + 22;
  }
  C.lay('luoiPhanSo').ve = function (svg, k, p, t, o) {
    var CO = 5.8, y;
    if (k.loi) {
      // Đang thử phá (x ≤ 0): không vẽ được ô, nên ghi thẳng các con số và chỗ hỏng
      if (la(p.xThu) && p.xThu < 1 - GAN && k.pha) {
        C.chu(svg, 4, 6, 'x = ' + viet(k.x) + ': không vẽ được ô', CO, null, huong('start', '--muc'));
        y = 14;
        k.pha.dong.forEach(function (d) {
          var sai = /bằng 0|không|!/.test(d);
          C.chu(svg, 4, y, d, 4.8, null, huong('start', sai ? '--sai' : '--muc'));
          y += 7.5;
        });
        hcn(svg, { x: 2, y: 9.5, w: 96, h: y - 12 }, { fill: 'none', stroke: 'var(' + (k.pha.hong ? '--sai' : '--nhat') + ')', 'stroke-width': 0.5, 'stroke-dasharray': '1.4 0.8', rx: 1.5, 'data-soi': 'pha' });
        svg.setAttribute('viewBox', '0 0 100 ' + (y + 1));
        return;
      }
      C.chu(svg, 50, 12, k.loi, 4.6, '--sai'); svg.setAttribute('viewBox', '0 0 100 24'); return;
    }
    // Dòng đầu: giá trị của x đang vẽ (o.dauDe ghi đè, ví dụ khi có hai biến hoặc chỉ có số)
    var dauX = o.dauDe != null ? o.dauDe : 'x = ' + viet(k.x);
    if (dauX) C.chu(svg, 4, 6, dauX, CO, null, huong('start'));
    if (k.dang === 'mot') {
      var M = k.M, mien = k.mien;
      k.khoi.forEach(function (r) { veO(svg, r, '--mat', 1, { 'data-soi': 'ca' }); });
      k.cotTo.forEach(function (r) { veO(svg, r, '--a', 0.75, { 'data-soi': 'to' }); });
      k.khoi.forEach(function (r) { keLuoi(svg, r, k.b, 1, 1); if (M > 1) keLuoi(svg, r, 1, M, mien, '--cc').setAttribute('data-soi', 'M'); vien(svg, r); });
      y = k.day + 7;
      // Lớn hơn 1 thì nhiều hình: "tô 60 ô, mỗi hình 20 ô" (không viết "60 trong 20")
      var cu = k.n > 1 ? 'tô ' + k.a + ' cột, mỗi hình ' + k.b + ' cột' : 'tô ' + k.a + ' trong ' + k.b + ' cột';
      var moi = k.n > 1 ? 'tô ' + k.a * M + ' ô, mỗi hình ' + k.b * M + ' ô' : 'tô ' + k.a * M + ' trong ' + k.b * M + ' ô';
      // Một dòng chữ, đổi khi lưới đã mịn quá nửa (hai dòng mờ chồng nhau thì khó đọc)
      if (M > 1) chuGiua(svg, 50, y, mien < 0.5 ? cu : moi, CO, mien < 0.5 ? '--a' : '--cc');
      else chuGiua(svg, 50, y, cu, CO, '--a');
      y += 8;
      // o.anM: chưa giải thì không ghi số ô của mỗi cột (đó là nhân tử chung em cần tìm)
      var soM = o.anM && !k.giai ? '?' : (String(o.tenM) === String(M) ? '' : o.tenM + ' = ') + M;
      if (o.tenM && M > 1) { chuGiua(svg, 50, y, 'mỗi cột cắt thành ' + soM + ' ô', CO * 0.85, '--cc', k.giai ? 1 : o.chieu === 'gop' ? 1 - C.muot((t - 0.2) / 0.3) : C.muot((t - 0.3) / 0.3)); y += 7; }
    } else if (k.dang === 'cong' || k.dang === 'tru') {
      var tru = k.dang === 'tru', A = k.A, B = k.B;
      veO(svg, A, '--mat', 1, { 'data-soi': 'p1' }); veO(svg, B, '--mat', 1, { 'data-soi': 'p2' });
      k.cam.forEach(function (c) { veO(svg, c.goc, '--a', 0.75, { 'data-soi': 'p1' }); });
      // Ô xanh ở hình thứ hai, mờ dần khi bay đi
      k.xanh.forEach(function (c) { veO(svg, c.goc, '--b', 0.75 * (1 - k.bay) + 0.15 * k.bay, { 'data-soi': 'p2' }); });
      keLuoi(svg, A, k.b1, 1, 1); keLuoi(svg, A, 1, k.k1, k.cat, '--b'); vien(svg, A);
      if (k.cungMau) { keLuoi(svg, B, k.b2, 1, 1); keLuoi(svg, B, 1, k.k2, k.cat, '--a'); }
      else { keLuoi(svg, B, 1, k.b2, 1); keLuoi(svg, B, k.k2, 1, k.cat, '--a'); }
      vien(svg, B);
      chuGiua(svg, 50, A.y + A.h / 2, tru ? '−' : '+', CO * 1.4);
      var nhan = function (a, b, kk, mau, r) {
        // Không phải cắt thêm (nhân tử phụ là 1) thì không ghi lại "1/6 = 1/6"
        var doi = kk > 1 && k.cat >= 0.5;
        chuGiua(svg, r.x + r.w / 2, r.y + r.h + 6, a + '/' + b + (doi ? ' = ' + a * kk + '/' + b * kk : ''), CO, mau);
      };
      nhan(k.a1, k.b1, k.k1, '--a', A); nhan(k.a2, k.b2, k.k2, '--b', B);
      // Lưới của kết quả
      var hien = C.muot((t - 0.42) / 0.1);
      k.khoi.forEach(function (r) { veO(svg, r, '--mat', hien, { 'data-soi': 'tong' }); });
      k.cam.forEach(function (c, i) {
        var bo = tru && i >= k.s1 - k.s2;
        veO(svg, c.dich, '--a', 0.75 * hien * (bo ? 1 - 0.8 * k.bay : 1), { 'data-soi': 'tong' });
      });
      k.xanh.forEach(function (c) {
        if (tru) { if (k.bay > 0) hcn(svg, c.o, { fill: 'none', stroke: 'var(--sai)', 'stroke-width': 0.5, 'stroke-dasharray': '1 0.7', opacity: Math.min(1, 3 * k.bay) }); }
        else if (k.bay > 0) veO(svg, c.o, '--b', 0.75, { 'data-soi': 'tong' });
      });
      k.khoi.forEach(function (r) { var g = C.mk('g', { opacity: hien }, svg); keLuoi(g, r, k.b1, k.k1, 1); vien(g, r); });
      var kq = k.s1 + '/' + k.Mc + (tru ? ' − ' : ' + ') + k.s2 + '/' + k.Mc + ' = ' + (k.ket > 0.5 || k.giai ? k.tong + '/' + k.Mc : '?');
      y = k.day + 7;
      chuGiua(svg, 50, y, kq, CO, '--muc', Math.max(hien * 0.999, 0));
      y += 7;
    } else {
      var w = k.w, h = k.h, V = k.vuong;
      veO(svg, { x: k.X, y: k.Y, w: k.c1 * w, h: k.c2 * h }, '--mat', 1, { 'data-soi': 'vuong' });
      veO(svg, k.dai1, '--a', 0.45 * k.hienCot * k.hienP1, { 'data-soi': 'dai1' });
      veO(svg, k.dai2, '--b', 0.4 * k.hienHang, { 'data-soi': 'dai2' });
      veO(svg, k.chongO, '--cc', 0.75 * k.hienChong, { 'data-soi': 'chong' });
      keLuoi(svg, { x: k.X, y: k.Y, w: k.c1 * w, h: k.c2 * h }, k.c1, k.c2, 1, '--nhat');
      hcn(svg, V, { fill: 'none', stroke: 'var(--muc)', 'stroke-width': 0.9 });
      if (k.chongO.w > 0 && k.chongO.h > 0) hcn(svg, k.chongO, { fill: 'none', stroke: 'var(--cc)', 'stroke-width': 0.8, opacity: k.hienChong });
      // Nhãn hai cạnh: phân số thứ nhất ở cạnh trên, thứ hai ở cạnh trái
      var p1 = o.an === 'p1' && k.hienP1 < 0.5 && !k.giai ? '?' : k.a1 + '/' + k.b1;
      C.chu(svg, k.X + k.c1 * w / 2, k.Y - 3.5, p1, CO, '--a', { opacity: Math.max(k.hienCot, o.an === 'p1' ? 1 : 0) });
      C.chu(svg, k.X - 2, k.Y + k.c2 * h / 2, k.a2 + '/' + k.b2, CO, '--b', hop(huong('end', '--b'), { opacity: k.hienHang }));
      y = k.day + 7;
      var anP1 = o.an === 'p1' && k.hienP1 < 0.5 && !k.giai;
      chuGiua(svg, 50, y, 'ô chồng: ' + (anP1 ? '' : k.a1 + ' · ' + k.a2 + ' = ') + k.oChong, CO, '--cc', k.hienChong);
      chuGiua(svg, 50, y + 7.5, 'cả hình vuông: ' + k.b1 + ' · ' + k.b2 + ' = ' + k.oCa + ' ô', CO, '--muc', k.hienChong);
      y += 14;
    }
    if (k.thu) y = veSoSanh(svg, k.thu, y + 1);
    svg.setAttribute('viewBox', '0 0 100 ' + (y + 1));
  };

  // Soi chi tiết lưới phân số. Điều đề còn giấu (anM: số ô mỗi cột, an: 'p1', kết quả chưa hiện) thì thẻ soi không nói ra.
  C.lay('luoiPhanSo').soi = function (k, p, o) {
    if (k.loi) return k.pha ? { pha: { tieuDe: 'Không vẽ được ô', chu: k.pha.chu } } : {};
    var X = o.dauDe != null ? '' : ' tại $x = ' + soL(k.x) + '$', ps = function (a, b) { return '$\\frac{' + a + '}{' + b + '}$'; };
    var S = function (v) { return '$' + soL(v) + '$'; };
    if (k.dang === 'mot') {
      var anM = o.anM && !k.giai, M = k.M, tenM = o.tenM ? String(o.tenM).replace(/−/g, '-') : '';
      return {
        to: { tieuDe: 'Phần tô', chu: 'Tô ' + S(k.a) + ' trong ' + S(k.b) + ' cột' + X + (M > 1 && !anM ? ', tức ' + S(k.a * M) + ' trong ' + S(k.b * M) + ' ô nhỏ' : '') + '. Cắt nhỏ hay gộp ô không thêm, không bớt phần tô, nên giá trị vẫn là ' + ps(k.a, k.b) + '.' },
        ca: { tieuDe: 'Cả hình', chu: 'Cả hình chữ nhật là $1$, chia ' + S(k.b) + ' cột bằng nhau' + (M > 1 && !anM ? '; mỗi cột cắt thành ' + S(M) + ' ô, cả hình ' + S(k.b * M) + ' ô' : '') + '.' },
        M: { tieuDe: 'Đường cắt', chu: anM ? 'Mỗi cột được cắt thành cùng một số ô. Số đó là nhân tử chung em cần tìm.'
          : 'Mỗi cột cắt thành ' + S(M) + ' ô bằng nhau' + (tenM && tenM !== String(M) ? ' ($M = ' + tenM + '$)' : '') + ': cả tử và mẫu cùng nhân với $M = ' + M + ' \\ne 0$. Nếu $M = 0$ thì không còn ô nào, được $\\frac{0}{0}$.' }
      };
    }
    if (k.dang === 'cong' || k.dang === 'tru') {
      var xong = k.ket > 0.5 || k.giai, phu = function (kk) { return kk > 1 ? ', cắt thêm thành ' + S(kk) + ' phần (nhân tử phụ ' + S(kk) + ')' : ', không phải cắt thêm'; };
      return {
        p1: { tieuDe: 'Phân thức thứ nhất', chu: ps(k.a1, k.b1) + X + ': chia ' + S(k.b1) + ' cột, tô ' + S(k.a1) + phu(k.k1) + '. Thành ' + ps(k.s1, k.Mc) + '.' },
        p2: { tieuDe: 'Phân thức thứ hai', chu: ps(k.a2, k.b2) + X + ': chia ' + S(k.b2) + (k.cungMau ? ' cột' : ' hàng') + ', tô ' + S(k.a2) + phu(k.k2) + '. Thành ' + ps(k.s2, k.Mc) + '.' },
        tong: { tieuDe: k.dang === 'tru' ? 'Hình hiệu' : 'Hình tổng', chu: 'Hai hình đã cùng lưới ' + S(k.Mc) + ' ô nên chỉ việc ' + (k.dang === 'tru' ? 'bớt' : 'dồn') + ' ô, mẫu chung giữ nguyên' +
          (xong ? ': $' + k.s1 + (k.dang === 'tru' ? ' - ' : ' + ') + k.s2 + ' = ' + k.tong + '$ ô trong ' + S(k.Mc) + ' ô.' : '. Đợi hình dồn xong để đếm.') }
      };
    }
    var anP1 = o.an === 'p1' && k.hienP1 < 0.5 && !k.giai, chongXong = k.hienChong > 0.5 || k.giai;
    return {
      dai1: { tieuDe: 'Dải dọc', chu: anP1 ? 'Dải dọc là phân thức em cần tìm: chia theo cột của hình vuông.' : 'Phân thức thứ nhất ' + ps(k.a1, k.b1) + X + ': tô ' + S(k.a1) + ' trong ' + S(k.b1) + ' cột.' },
      dai2: { tieuDe: 'Dải ngang', chu: 'Phân thức thứ hai ' + ps(k.a2, k.b2) + X + ': tô ' + S(k.a2) + ' trong ' + S(k.b2) + ' hàng.' },
      chong: { tieuDe: 'Phần chồng', chu: !chongXong ? 'Phần hai dải chồng lên nhau là tích. Đợi hình tô xong để đếm.'
        : (anP1 ? 'Có ' + S(k.oChong) : '$' + k.a1 + ' \\cdot ' + k.a2 + ' = ' + k.oChong + '$') + ' ô chồng, trong ' + S(k.oCa) + ' ô của hình vuông. Lấy một phần của một phần: tử nhân tử, mẫu nhân mẫu.' },
      vuong: { tieuDe: 'Hình vuông đơn vị', chu: 'Cả hình vuông là $1$: $' + k.b1 + ' \\cdot ' + k.b2 + ' = ' + k.oCa + '$ ô (' + S(k.b1) + ' cột, ' + S(k.b2) + ' hàng).' }
    };
  };

  /* ================= 3. Thẻ nhân tử ================= */
  function chuan(n) { return String(n).replace(/\s+/g, '').replace(/-/g, '−'); }
  function laSo(n) { return /^\d+$/.test(chuan(n)); }
  function thuBac(c) { return laSo(c) ? 0 : /^[a-z]$/i.test(chuan(c)) ? 1 : 2; }
  var MU = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function mu(k) { return k > 1 ? String(k).split('').map(function (c) { return MU[+c]; }).join('') : ''; }
  // Viết tích các thẻ: số nhân lại, thẻ giống nhau thành lũy thừa, thẻ −1 cho dấu
  function tichChu(ds) {
    var he = 1, dau = 1, nhom = [], dem = {}, ten = {};
    ds.forEach(function (n) {
      var c = chuan(n);
      if (c === '−1') { dau = -dau; return; }
      if (laSo(c)) { he *= +c; return; }
      if (!(c in dem)) { dem[c] = 0; nhom.push(c); ten[c] = n; }
      dem[c]++;
    });
    // Chữ đơn (x, y) đứng trước nhị thức: 3x(x − 4), không viết 3(x − 4)x
    nhom.sort(function (a, b) { return thuBac(a) - thuBac(b); });
    var phan = nhom.map(function (c) {
      var don = /^[a-z]$/i.test(c), mot = nhom.length === 1 && he === 1 && dem[c] === 1 && dau > 0;
      return (don || mot ? ten[c] : '(' + ten[c] + ')') + mu(dem[c]);
    });
    return (dau < 0 ? '−' : '') + (he !== 1 || !phan.length ? String(he) : '') + phan.join('');
  }
  function rongThe(n) { return Math.max(7, String(n).length * 3.1 + 4); }
  // Mỗi thẻ: chuỗi, hoặc { n: 'chữ hiện', doi: 'chữ sau khi đổi dấu' } (thẻ đó bằng −1 nhân thẻ doi)
  function moThe(c) { return typeof c === 'object' ? { n: c.n, ten: c.doi, doi: true } : { n: c, ten: c, doi: false }; }
  var MAU_THE = ['--b', '--a', '--cc', '--tg'];
  function mauThe(cot, ten) { if (laSo(ten)) return '--nhat'; return MAU_THE[cot % MAU_THE.length]; }

  function theMtc(o, t) {
    var rows = o.mau.map(function (r) { return r.map(moThe); });
    var doi = C.muot((t - 0.05) / 0.15), xep = C.muot((t - 0.25) / 0.25), hienM = C.muot((t - 0.55) / 0.2), phu = C.muot((t - 0.78) / 0.17);
    // Mẫu thức chung: mỗi loại thẻ lấy số lần nhiều nhất; số đứng trước
    var so = {}, thuTu = [];
    rows.forEach(function (r) {
      var dem = {};
      r.forEach(function (c) { var k = chuan(c.ten); dem[k] = (dem[k] || 0) + 1; if (!(k in so)) { so[k] = 0; thuTu.push({ k: k, ten: c.ten }); } });
      Object.keys(dem).forEach(function (k) { so[k] = Math.max(so[k], dem[k]); });
    });
    thuTu.forEach(function (q, i) { q.i = i; });
    thuTu.sort(function (a, b) { var d = thuBac(a.k) - thuBac(b.k); return d || (thuBac(a.k) === 0 ? +a.k - +b.k : a.i - b.i); });
    var cot = [], loai = {};
    thuTu.forEach(function (q, i) { loai[q.k] = i; for (var j = 0; j < so[q.k]; j++) cot.push({ k: q.k, ten: q.ten, loai: i }); });
    var coDau = rows.some(function (r) { return r.some(function (c) { return c.doi; }); });
    var X0 = 4 + (coDau ? 9 : 0), x = X0;
    cot.forEach(function (c) { c.w = rongThe(c.ten); c.x = x; x += c.w + 1.6; });
    var rong = Math.max(100, x + 4);
    var hang = rows.map(function (r, i) {
      var y = 10 + i * 22, dung = {}, xTu = X0, the = [];
      r.forEach(function (c) {
        var k = chuan(c.ten), lan = dung[k] || 0; dung[k] = lan + 1;
        var ci = -1, gap = 0;
        for (var j = 0; j < cot.length; j++) if (cot[j].k === k && gap++ === lan) { ci = j; break; }
        var w0 = rongThe(c.n), dau = { x: xTu, w: w0 }; xTu += w0 + 1.6;
        var cuoi = cot[ci];
        the.push({ n: doi > 0.5 ? c.ten : c.n, doi: c.doi, cot: ci, y: y + 3, x: C.noiSuy(dau.x, cuoi.x, xep), w: C.noiSuy(doi > 0.5 ? rongThe(c.ten) : w0, cuoi.w, xep), mau: mauThe(cuoi.loai, c.ten) });
      });
      var coCot = the.map(function (q) { return q.cot; }), thieu = [];
      cot.forEach(function (c, j) { if (coCot.indexOf(j) < 0) thieu.push({ cot: j, ten: c.ten, x: c.x, w: c.w, y: y + 3 }); });
      return { y: y, the: the, thieu: thieu, phu: tichChu(thieu.map(function (q) { return q.ten; })), dau: r.filter(function (c) { return c.doi; }).length % 2 === 1, coDoi: r.some(function (c) { return c.doi; }), ten: o.ten && o.ten[i] };
    });
    var yM = 10 + rows.length * 22 + 2;
    return { dang: 'mtc', cot: cot, hang: hang, mtc: { y: yM, chu: tichChu(cot.map(function (c) { return c.ten; })) }, rong: rong, X0: X0,
      hienDoi: doi, hienXep: xep, hienMtc: hienM, hienPhu: phu, day: yM + 14 };
  }
  function theRutGon(o, t) {
    var tu = o.tu.map(moThe), mau = o.mau.map(moThe), doi = C.muot((t - 0.05) / 0.15);
    var xep = C.muot((t - 0.2) / 0.25), bo = C.muot((t - 0.5) / 0.2), ket = C.muot((t - 0.78) / 0.17);
    // Ghép cặp: thẻ giống nhau ở tử và mẫu; thẻ đổi dấu sinh thêm một thẻ −1
    function bung(ds) { var o2 = []; ds.forEach(function (c, i) { if (c.doi) o2.push({ ten: '−1', goc: i, sinh: true }); o2.push({ ten: c.ten, goc: i, n: c.n, doi: c.doi }); }); return o2; }
    var T = bung(tu), Mu = bung(mau), dungM = [], cap = [];
    T.forEach(function (c, i) {
      for (var j = 0; j < Mu.length; j++) if (dungM.indexOf(j) < 0 && chuan(Mu[j].ten) === chuan(c.ten)) { dungM.push(j); cap.push([i, j]); return; }
    });
    var X0 = 4, cotX = [], x = X0, viTriT = {}, viTriM = {};
    cap.forEach(function (c, i) { var w = rongThe(T[c[0]].ten); cotX.push({ x: x, w: w }); viTriT[c[0]] = i; viTriM[c[1]] = i; x += w + 1.6; });
    var conT = [], conM = [];
    T.forEach(function (c, i) { if (!(i in viTriT)) conT.push(i); });
    Mu.forEach(function (c, j) { if (!(j in viTriM)) conM.push(j); });
    var x2 = x + 3, xT = x2, xM = x2;
    conT.forEach(function (i) { var w = rongThe(T[i].ten); viTriT[i] = { x: xT, w: w }; xT += w + 1.6; });
    conM.forEach(function (j) { var w = rongThe(Mu[j].ten); viTriM[j] = { x: xM, w: w }; xM += w + 1.6; });
    function xepHang(ds, viTri, y) {
      var xa = X0;
      return ds.map(function (c, i) {
        var nDau = c.sinh ? '−1' : (doi > 0.5 || !c.doi ? c.ten : c.n), w0 = rongThe(nDau), dau = { x: xa, w: w0 };
        if (!c.sinh || doi > 0) xa += w0 + 1.6;
        var v = viTri[i], cuoi = typeof v === 'number' ? cotX[v] : v, ghep = typeof v === 'number';
        return { n: nDau, x: C.noiSuy(dau.x, cuoi.x, xep), w: C.noiSuy(w0, cuoi.w, xep), y: y, ghep: ghep, hien: c.sinh ? doi : 1, mau: laSo(c.ten) || chuan(c.ten) === '−1' ? '--nhat' : '--b' };
      });
    }
    var rong = Math.max(100, x, xT, xM) + 6;
    // Dấu trừ còn lại (ở tử hay mẫu) đều đưa lên tử
    var laDau = function (n) { return chuan(n) === '−1'; }, soDau = 0;
    var conTu = conT.map(function (i) { return T[i].ten; }), conMau = conM.map(function (j) { return Mu[j].ten; });
    conTu.concat(conMau).forEach(function (n) { if (laDau(n)) soDau++; });
    var kqTu = tichChu(conTu.filter(function (n) { return !laDau(n); }).concat(soDau % 2 ? ['−1'] : [])), kqMau = tichChu(conMau.filter(function (n) { return !laDau(n); }));
    return { dang: 'rutGon', tu: xepHang(T, viTriT, 11), mau: xepHang(Mu, viTriM, 27), cap: cap.length, hienXep: xep, hienBo: bo, hienKet: ket, rong: rong,
      conTu: conTu, conMau: conMau, kqTu: kqTu, kqMau: kqMau, boTu: T.map(function (c) { return c.ten; }), boMau: Mu.map(function (c) { return c.ten; }), day: 60 };
  }
  C.dangKi('theNhanTu', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var dang = o.dang || 'mtc';
      if (p.trangThai === 'giai') t = 1;
      if (dang === 'mtc') return theMtc(o, t);
      if (dang === 'rutGon') return theRutGon(o, t);
      throw new Error('theNhanTu: dạng lạ ' + dang);
    }
  });
  function veThe(svg, q, op, them) {
    var g = C.mk('g', hop({ opacity: op == null ? 1 : op }, them), svg);
    hcn(g, { x: q.x, y: q.y, w: q.w, h: 8.5 }, { rx: 1.4, fill: 'var(' + q.mau + ')', 'fill-opacity': 0.16, stroke: 'var(' + q.mau + ')', 'stroke-width': 0.5 });
    C.chu(g, q.x + q.w / 2, q.y + 4.5, q.n, 5.2, q.mau);
    return g;
  }
  C.lay('theNhanTu').ve = function (svg, k, p, t, o) {
    var CO = 5.4;
    if (k.dang === 'mtc') {
      k.hang.forEach(function (h, i) {
        var tieu = (h.ten || ('Mẫu ' + (i + 1))) + (k.hienPhu > 0.5 ? '   nhân tử phụ: ' + h.phu : '');
        C.chu(svg, 4, h.y - 1.6, tieu, CO * 0.9, null, huong('start', k.hienPhu > 0.5 ? '--muc' : '--nhat'));
        h.thieu.forEach(function (q) {
          var g = C.mk('g', { opacity: k.hienPhu }, svg);
          hcn(g, { x: q.x, y: q.y, w: q.w, h: 8.5 }, { rx: 1.4, fill: 'none', stroke: 'var(--tg)', 'stroke-width': 0.5, 'stroke-dasharray': '1.2 0.8' });
          C.chu(g, q.x + q.w / 2, q.y + 4.5, q.ten, 5.2, '--tg');
        });
        h.the.forEach(function (q) { veThe(svg, q); });
        if (h.coDoi) {
          var g = C.mk('g', { opacity: k.hienDoi }, svg);
          C.chu(g, 4 + 3.5, h.y + 7.3, h.dau ? '−' : '+', 7, '--sai');
        }
      });
      var m = k.mtc, g = C.mk('g', { opacity: k.hienMtc }, svg);
      C.chu(g, 4, m.y - 1.2, 'Mẫu thức chung: ' + m.chu, CO * 0.9, null, huong('start', '--cc'));
      k.cot.forEach(function (c) { veThe(g, { x: c.x, y: m.y + 3, w: c.w, n: c.ten, mau: mauThe(c.loai, c.ten) }); });
      svg.setAttribute('viewBox', '0 0 ' + k.rong + ' ' + (k.day + 2));
      return;
    }
    C.chu(svg, 4, 5, 'tử', CO * 0.85, null, huong('start', '--nhat'));
    var vach = { x1: 2, y1: 23, x2: k.rong - 2, y2: 23 };
    C.mk('line', hop(vach, { stroke: 'var(--muc)', 'stroke-width': 0.6 }), svg);
    C.chu(svg, 4, 41, 'mẫu', CO * 0.85, null, huong('start', '--nhat'));
    [k.tu, k.mau].forEach(function (ds) {
      ds.forEach(function (q) {
        var g = veThe(svg, q, q.hien * (q.ghep ? 1 - 0.5 * k.hienBo : 1));
        if (q.ghep && k.hienBo > 0) C.mk('line', { x1: q.x, y1: q.y + 8.5, x2: q.x + q.w, y2: q.y, stroke: 'var(--sai)', 'stroke-width': 0.7, opacity: Math.min(1, 2 * k.hienBo) }, svg);
        return g;
      });
    });
    var g = C.mk('g', { opacity: k.hienKet }, svg), xk = 40;
    C.chu(g, 4, 51, 'Còn lại:', CO, null, huong('start', '--cc'));
    if (k.kqMau === '1') C.chu(g, xk, 51, k.kqTu, CO, null, huong('start', '--cc'));
    else {
      var w = Math.max(k.kqTu.length, k.kqMau.length) * 3.3 + 6;
      C.chu(g, xk + w / 2, 47.5, k.kqTu, CO, '--cc');
      C.mk('line', { x1: xk, y1: 51, x2: xk + w, y2: 51, stroke: 'var(--cc)', 'stroke-width': 0.6 }, g);
      C.chu(g, xk + w / 2, 55.5, k.kqMau, CO, '--cc');
    }
    svg.setAttribute('viewBox', '0 0 ' + k.rong + ' ' + k.day);
  };

  /* ================= 4. Bước nhảy trên trục số ================= */
  C.dangKi('buocNhay', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var ds = o.nhay, n = ds.length, vt = 0, lo = 0, hi = 0, buoc = [];
      if (!n) throw new Error('buocNhay: cần ít nhất một bước');
      if (p.trangThai === 'giai') t = 1;
      ds.forEach(function (d, i) {
        if (!la(d.v)) throw new Error('buocNhay: bước ' + i + ' không phải số');
        var k = C.muot((t - 0.1 - 0.75 * i / n) / (0.75 / n));
        buoc.push({ tu: vt, den: vt + d.v, v: d.v, ten: d.ten, hien: k, dau: C.noiSuy(vt, vt + d.v, k) });
        vt += d.v; lo = Math.min(lo, vt); hi = Math.max(hi, vt);
      });
      return { buoc: buoc, tong: vt, lo: lo, hi: hi, hienKet: C.muot((t - 0.88) / 0.12) };
    }
  });
  C.lay('buocNhay').ve = function (svg, k, p, t, o) {
    var lo = Math.floor(k.lo - 0.25), hi = Math.ceil(k.hi + 0.25), s = 88 / (hi - lo || 1), X = function (v) { return 6 + (v - lo) * s; };
    var n = k.buoc.length, yTruc = 12 + n * 13, CO = 5.4, buocVach = hi - lo > 12 ? Math.ceil((hi - lo) / 10) : 1;
    C.mk('line', { x1: 3, y1: yTruc, x2: 97, y2: yTruc, stroke: 'var(--muc)', 'stroke-width': 0.5 }, svg);
    for (var v = Math.ceil(lo / buocVach) * buocVach; v <= hi; v += buocVach) {
      C.mk('line', { x1: X(v), y1: yTruc - 1.3, x2: X(v), y2: yTruc + 1.3, stroke: 'var(--muc)', 'stroke-width': 0.4 }, svg);
      C.chu(svg, X(v), yTruc + 5, viet(v), 4.6, v === 0 ? '--muc' : '--nhat');
    }
    k.buoc.forEach(function (b, i) {
      if (b.hien <= 0) return;
      var y = 8 + i * 13, mau = b.v < 0 ? '--b' : '--a', x1 = X(b.tu), x2 = X(b.dau), g = C.mk('g', {}, svg);
      C.mk('line', { x1: x1, y1: y + 3, x2: x2, y2: y + 3, stroke: 'var(' + mau + ')', 'stroke-width': 1.4 }, g);
      var d = x2 >= x1 ? 1 : -1;
      if (Math.abs(x2 - x1) > 1.5) C.mk('polygon', { points: C.diem([[x2, y + 3], [x2 - d * 2.2, y + 1.6], [x2 - d * 2.2, y + 4.4]]), fill: 'var(' + mau + ')' }, g);
      C.mk('line', { x1: x1, y1: y + 3, x2: x1, y2: yTruc, stroke: 'var(--nhat)', 'stroke-width': 0.25, 'stroke-dasharray': '0.8 0.8' }, g);
      C.chu(g, (x1 + X(b.den)) / 2, y - 1.2, (b.v < 0 ? '' : '+') + (b.ten || viet(b.v)), CO, mau, { opacity: b.hien });
    });
    var g = C.mk('g', { opacity: p.trangThai === 'giai' ? 1 : k.hienKet }, svg);
    C.mk('circle', { cx: X(k.tong), cy: yTruc, r: 1.6, fill: 'var(--cc)' }, g);
    C.chu(g, 50, yTruc + 12, (o.tenTong || 'tổng') + (o.an && p.trangThai !== 'giai' ? ' = ?' : bang(k.tong)), CO, '--cc');
    svg.setAttribute('viewBox', '0 0 100 ' + (yTruc + 17));
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
