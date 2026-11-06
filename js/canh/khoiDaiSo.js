// Cảnh cho chương I: đơn thức, đa thức nhìn thành mảnh và khối (khoiGop), thẻ thừa số (thuaSo), hình chữ nhật diện tích (hcnNhan).
// Đơn thức viết như trong đáp án: '3x^2y', '-xy', '1/3x^2', '5'. Đa thức: '3x^2-2xy+5' hoặc mảng các đơn thức.
(function (C) {
  'use strict';
  var TRU = '−', SO_MU = '⁰¹²³⁴⁵⁶⁷⁸⁹', MAU = ['--a', '--b', '--cc', '#9c36b5', '--tg', '#e67700'];
  var MAU_CHU = { x: '--a', y: '--b', z: '--cc' }, BIEN = ['x', 'y', 'z'], Z = 3.4;

  /* ---------- Số hữu tỉ [tử, mẫu] ---------- */
  function ucln(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a || 1; }
  function ps(t, m) { if (m < 0) { t = -t; m = -m; } var g = ucln(t, m); return [t / g, m / g]; }
  function nhanPS(a, b) { return ps(a[0] * b[0], a[1] * b[1]); }
  function chiaPS(a, b) { return ps(a[0] * b[1], a[1] * b[0]); }
  function congPS(a, b) { return ps(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function soPS(s) {
    var mot = function (x) { var k = (x.split('.')[1] || '').length, m = Math.pow(10, k); return [Math.round(parseFloat(x) * m), m]; };
    var p = String(s).replace(/,/g, '.').replace(/−/g, '-').split('/'), a = mot(p[0]);
    return p[1] ? chiaPS(a, mot(p[1])) : ps(a[0], a[1]);
  }
  function chuPS(a) { return (a[0] < 0 ? TRU : '') + Math.abs(a[0]) + (a[1] === 1 ? '' : '/' + a[1]); }

  /* ---------- Đơn thức { he: [tử, mẫu], mu: { x: 2, y: 1 } } ---------- */
  function sach(s) { return String(s).replace(/[\s{}*·]/g, '').replace(/−/g, '-'); }
  function docDon(s) {
    if (s && typeof s === 'object') return s;
    var g = sach(s), m = /^([+-]?)(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?)?((?:[a-z](?:\^\d+)?)*)$/.exec(g);
    if (!m || (!m[2] && !m[3])) throw new Error('khoiDaiSo: không đọc được đơn thức "' + s + '"');
    var he = m[2] ? soPS(m[2]) : [1, 1], mu = {}, re = /([a-z])(?:\^(\d+))?/g, k;
    while ((k = re.exec(m[3]))) mu[k[1]] = (mu[k[1]] || 0) + (k[2] ? +k[2] : 1);
    return { he: m[1] === '-' ? [-he[0], he[1]] : he, mu: mu };
  }
  function docDa(s) {
    if (Array.isArray(s)) return s.map(docDon);
    return (sach(s).match(/[+-]?[^+-]+/g) || []).map(docDon);
  }
  function chuCai(mu) { return Object.keys(mu).filter(function (k) { return mu[k] > 0; }).sort(); }
  function khoa(mu) { return chuCai(mu).map(function (k) { return k + mu[k]; }).join(''); }
  function bacDon(mu) { return chuCai(mu).reduce(function (s, k) { return s + mu[k]; }, 0); }
  function soMu(n) { return n === 1 ? '' : String(n).split('').map(function (c) { return SO_MU[+c]; }).join(''); }
  function chuBien(mu) { return chuCai(mu).map(function (k) { return k + soMu(mu[k]); }).join(''); }
  // '3x²y', '−x', '1', '(1/3)x²'; boDau: bỏ dấu trừ đứng đầu
  function chuDon(d, boDau) {
    var b = chuBien(d.mu), t = Math.abs(d.he[0]), m = d.he[1], dau = d.he[0] < 0 && !boDau ? TRU : '';
    if (!b || t === 0) return dau + t + (m === 1 || t === 0 ? '' : '/' + m);
    return dau + (m !== 1 ? '(' + t + '/' + m + ')' : t === 1 ? '' : String(t)) + b;
  }
  function chuDa(ds) {
    var s = '';
    ds.forEach(function (d) {
      if (d.he[0] === 0) return;
      s += (s ? (d.he[0] < 0 ? ' − ' : ' + ') : (d.he[0] < 0 ? TRU : '')) + chuDon(d, true);
    });
    return s || '0';
  }
  function nhanDon(a, b) {
    var mu = {};
    [a.mu, b.mu].forEach(function (m) { Object.keys(m).forEach(function (k) { mu[k] = (mu[k] || 0) + m[k]; }); });
    return { he: nhanPS(a.he, b.he), mu: mu };
  }
  function chiaDon(a, b) {
    var mu = Object.assign({}, a.mu), duoc = true;
    Object.keys(b.mu).forEach(function (k) { mu[k] = (mu[k] || 0) - b.mu[k]; if (mu[k] < 0) duoc = false; if (mu[k] === 0) delete mu[k]; });
    return { he: chiaPS(a.he, b.he), mu: mu, duoc: duoc };
  }
  // Gộp các hạng tử đồng dạng, giữ thứ tự xuất hiện, bỏ hạng tử bằng 0
  function gon(ds) {
    var bang = {}, thu = [];
    ds.forEach(function (d) {
      var k = khoa(d.mu);
      if (!bang[k]) { bang[k] = { he: [0, 1], mu: d.mu }; thu.push(k); }
      bang[k].he = congPS(bang[k].he, d.he);
    });
    return thu.map(function (k) { return bang[k]; }).filter(function (d) { return d.he[0] !== 0; });
  }
  function giaTri(mu, v) { return chuCai(mu).reduce(function (s, k) { return s * Math.pow(v[k] == null ? 1 : v[k], mu[k]); }, 1); }
  function giaTriDon(d, v) { return d.he[0] / d.he[1] * giaTri(d.mu, v); }

  /* ---------- Chữ TeX cho thẻ soi và thử phá ---------- */
  // Thanh kéo bước 0,25 hay 0,5 nên các số ở đây đúng tới vài chữ số thập phân: ghi đúng, không làm tròn
  function soT(x) { return String(+x.toFixed(6)).replace('.', '{,}'); }
  function soN(x) { return x < 0 ? '(' + soT(x) + ')' : soT(x); }
  // '= 7{,}5' hoặc '\approx 7{,}59' khi phải làm tròn tới hai chữ số thập phân
  function bangT(x) { var r = Math.round(x * 100) / 100; return (Math.abs(r - x) < 1e-9 ? '= ' : '\\approx ') + soT(r); }
  function texBien(mu) { return chuCai(mu).map(function (k) { return k + (mu[k] > 1 ? '^' + mu[k] : ''); }).join(''); }
  function texDon(d, boDau) {
    var b = texBien(d.mu), t = Math.abs(d.he[0]), m = d.he[1], dau = d.he[0] < 0 && !boDau ? '-' : '';
    var ps = m === 1 ? String(t) : '\\frac{' + t + '}{' + m + '}';
    if (!b || t === 0) return dau + (t === 0 ? '0' : ps);
    return dau + (m === 1 && t === 1 ? '' : ps) + b;
  }
  function texNgoac(d) { return d.he[0] < 0 ? '(' + texDon(d) + ')' : texDon(d); }
  function texDa(ds) {
    var s = '';
    ds.forEach(function (d) { if (d.he[0] === 0) return; s += (s ? (d.he[0] < 0 ? ' - ' : ' + ') : (d.he[0] < 0 ? '-' : '')) + texDon(d, true); });
    return s || '0';
  }
  // Dãy số cộng lại: 9 + 9 - 6 + 6
  function texTong(ds) { return ds.map(function (x, i) { return i === 0 ? soT(x) : (x < 0 ? ' - ' : ' + ') + soT(Math.abs(x)); }).join(''); }
  function cong(ds) { return ds.reduce(function (s, x) { return s + x; }, 0); }

  /* ---------- Tiện ích vẽ ---------- */
  function mau(m) { return m && m.charAt(0) === '-' ? 'var(' + m + ')' : m; }
  function viet(svg, x, y, s, co, m, op, neo) {
    if (op != null && op <= 0.01) return;
    var st = (m ? 'fill:' + mau(m) + ';' : '') + (neo ? 'text-anchor:' + neo : '');
    C.chu(svg, x, y, s, co, null, { style: st || null, opacity: op != null && op < 1 ? op : null });
  }
  // Khung bao: gom điểm và chữ để viewBox vừa khít, cố định theo t
  function khungBao() {
    var b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    b.gom = function (x, y) { b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); };
    b.chu = function (x, y, s, co, neo) {
      var r = 0.52 * co * String(s).length + 0.2 * co, a = neo === 'start' ? x : neo === 'end' ? x - r : x - r / 2;
      b.gom(a, y - 0.6 * co); b.gom(a + r, y + 0.6 * co);
    };
    b.hop = function (le) { return [b.x0 - le, b.y0 - le, b.x1 - b.x0 + 2 * le, b.y1 - b.y0 + 2 * le]; };
    return b;
  }
  var NET = { 'vector-effect': 'non-scaling-stroke' };
  function da(svg, pts, nen, op, vien, them) {
    return C.mk('polygon', Object.assign({ points: C.diem(pts), fill: nen ? mau(nen) : 'none', 'fill-opacity': op, stroke: vien ? mau(vien) : 'none', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, NET, them || {}), svg);
  }

  /* ================= 1. khoiGop: mỗi hạng tử là một nhóm mảnh giống nhau ================= */
  // Hình của một loại mảnh: số là ô 1×1, bậc 1 là thanh, bậc 2 là tấm, bậc 3 là khối; bậc từ 4 trở lên là thẻ tròn đầu ghi phần biến
  // (không theo kích thước). Riêng hình báo lỗi có thể vẽ x⁴ thành tấm cạnh x² (tamX4).
  var SAU = 0.4, GAP = 0.25, DAI_DONG = 20;
  function hinhManh(mu, v, tamX4) {
    var f = [];
    chuCai(mu).forEach(function (k) { for (var i = 0; i < mu[k]; i++) f.push(k); });
    var la = f.some(function (k) { return BIEN.indexOf(k) < 0; });
    if (!f.length) return { w: 1, h: 1, d: 0, loai: 'so', canh: [] };
    if (tamX4 && !la && f.length === 4 && f[0] === f[3]) return { w: v[f[0]] * v[f[0]], h: v[f[0]] * v[f[0]], d: 0, loai: 'tam', canh: [f[0] + '²', f[0] + '²'] };
    if (la || f.length > 3) return { w: 3, h: 1.6, d: 0, loai: 'the', canh: [] };
    var g = f.map(function (k) { return v[k]; });
    if (f.length === 1) return { w: 1, h: g[0], d: 0, loai: 'thanh', canh: [null, f[0]] };
    if (f.length === 2) return { w: g[1], h: g[0], d: 0, loai: 'tam', canh: [f[1], f[0]] };
    return { w: g[1], h: g[0], d: g[2], loai: 'khoi', canh: [f[1], f[0], f[2]] };
  }
  function nhanNhom(d, dau, latDau) {
    var s = chuDon(d, true);
    if (latDau) return (d.he[0] < 0 ? TRU : '') + s;
    return (d.he[0] < 0 ? (dau ? TRU + ' ' : TRU) : (dau ? '+ ' : '')) + s;
  }

  // o.anNhan (cả ba cảnh): chưa có trạng thái nào (em chưa giải) thì dòng kết quả ghi dấu ?, kẻo nút chạy hình lộ đáp án
  C.dangKi('khoiGop', {
    thamSo: { x: { min: 2, max: 3, step: 0.25, md: 2.25, nhan: 'Giá trị x', mau: '--a' }, y: { min: 1.25, max: 1.75, step: 0.25, md: 1.5, nhan: 'Giá trị y', mau: '--b' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var v = { x: p.x, y: p.y, z: Z }, sai = (o.sai && p.trangThai && o.sai[p.trangThai]) || {};
      var ds = (o.nhom || []).map(function (g) { return typeof g === 'string' ? { don: g } : g; });
      if (o.da) ds = ds.concat(docDa(o.da).map(function (d) { return { don: d }; }));
      if (o.tru) ds = ds.concat(docDa(o.tru).map(function (d) { return { don: d, lat: true }; }));
      var loai = [], mauLoai = {};
      var nhom = ds.map(function (g, i) {
        var d = docDon(g.don), k = khoa(d.mu), lat = !!g.lat && (sai.khongLat || []).indexOf(i) < 0;
        if (loai.indexOf(k) < 0) { mauLoai[k] = (o.mau && o.mau[k]) || MAU[loai.length % MAU.length]; loai.push(k); }
        var nguyen = d.he[1] === 1 && Math.abs(d.he[0]) <= 30, n = nguyen ? Math.abs(d.he[0]) : 1;
        return { i: i, sau: !!g.sau, d: d, k: k, lat: lat, latSai: !!g.lat && !lat, coLat: !!g.lat, nhan: g.nhan, hinh: hinhManh(d.mu, v), n: n, gon: !nguyen,
          dau0: d.he[0] < 0 ? -1 : 1, heSo: nguyen ? 1 : Math.abs(d.he[0] / d.he[1]) };
      });
      var coLat = nhom.some(function (g) { return g.coLat; }), gop = o.gop !== false;
      var M = coLat ? { lat: [0.1, 0.3], xep: [0.35, 0.7], huy: [0.74, 0.88], ket: 0.9 } : { xep: [0.1, 0.6], huy: [0.64, 0.84], ket: 0.88 };
      var kLat = coLat ? C.muot((t - 0.1) / 0.2) : 0, kXep = gop ? C.muot((t - M.xep[0]) / (M.xep[1] - M.xep[0])) : 0;
      var kHuy = gop ? C.muot((t - M.huy[0]) / (M.huy[1] - M.huy[0])) : 0, ket = C.muot((t - M.ket) / 0.08);
      var heCua = function (m) { return { he: [m.dau * (m.g.gon ? Math.abs(m.g.d.he[0]) : 1), m.g.gon ? m.g.d.he[1] : 1], mu: m.g.d.mu }; };
      var b, manh, hang, ngoac, tong, ma, tatCa, ketQua, co;
      // Dựng bố cục với cỡ chữ co; chữ phải đạt 1/16 bề rộng khung, nên dựng lại một lần nếu khung rộng ra
      dung(1.3);
      if ((b.x1 - b.x0) / 16 > co) dung(Math.min(2.6, 1.06 * (b.x1 - b.x0) / 16));

      function dung(coMoi) {
      co = coMoi; b = khungBao();
      // Bày: các nhóm theo thứ tự trong đề, xuống dòng khi quá dài; mảnh kê đáy bằng nhau
      var dong = [[]], cx = 0;
      nhom.forEach(function (g, i) {
        var h = g.hinh, buoc = h.w + GAP + SAU * h.d, rong = g.n * buoc - GAP;
        // Chỉ bày mà có ghi bậc: nhóm cách xa hơn để chữ "bậc n" không chồng nhau
        var cach = i === 0 ? 0 : (g.coLat && !nhom[i - 1].coLat ? 0.8 + 1.6 * co : !gop && o.bac ? 0.4 + 2.6 * co : 0.6 + 0.6 * co);
        // Đầu một ngoặc bị trừ: cả ngoặc không vừa dòng thì xuống dòng, để một ngoặc nằm trọn một dòng
        var rongKhoi = rong;
        if (g.coLat && (i === 0 || !nhom[i - 1].coLat)) for (var j = i + 1; j < nhom.length && nhom[j].coLat; j++) rongKhoi += 0.6 + 0.6 * co + nhom[j].n * (nhom[j].hinh.w + GAP + SAU * nhom[j].hinh.d) - GAP;
        if (cx > 0 && cx + cach + rongKhoi > DAI_DONG) { dong.push([]); cx = 0; cach = g.coLat ? 0.4 + 1.6 * co : 0; }
        g.bx = cx + cach; g.buoc = buoc; g.rong = rong; cx = g.bx + rong;
        dong[dong.length - 1].push(g);
      });
      var y = 0;
      dong.forEach(function (dg) {
        var H = Math.max.apply(null, dg.map(function (g) { return g.hinh.h + SAU * g.hinh.d; }));
        dg.forEach(function (g) { g.by = y + H - g.hinh.h; g.nhanY = y + H + 0.3 + 0.7 * co; });
        y += H + 0.7 + 1.6 * co + (!gop && o.bac ? 1.3 * co : 0);
      });

      // Xếp: mỗi loại một hàng; mảnh dương hàng trên, mảnh âm hàng dưới, mảnh thứ i của hai hàng thành một cặp
      manh = [];
      nhom.forEach(function (g) {
        for (var j = 0; j < g.n; j++) manh.push({ g: g, k: g.k, dau: g.lat ? -g.dau0 : g.dau0, bx: g.bx + j * g.buoc, by: g.by });
      });
      hang = [];
      var yh = 0, rongMax = 0;
      loai.forEach(function (k) {
        var cua = manh.filter(function (m) { return m.k === k; }), h = cua[0].g.hinh, buoc = h.w + GAP + SAU * h.d;
        var TOI_DA = h.loai === 'the' ? 4 : Math.max(8, Math.floor(DAI_DONG / buoc));
        var duong = cua.filter(function (m) { return m.dau > 0; }), am = cua.filter(function (m) { return m.dau < 0; });
        // Mỗi dòng mảnh cách nhau thêm phần chiều sâu của khối, để khối dòng dưới không chồng lên dòng trên
        var dD = Math.ceil(duong.length / TOI_DA), dA = Math.ceil(am.length / TOI_DA), top = yh + SAU * h.d, bd = h.h + GAP + SAU * h.d;
        duong.forEach(function (m, i) { m.xx = (i % TOI_DA) * buoc; m.xy = top + Math.floor(i / TOI_DA) * bd; m.cap = i < am.length; });
        var y2 = top + dD * bd + (dD ? GAP : 0);
        am.forEach(function (m, i) { m.xx = (i % TOI_DA) * buoc; m.xy = y2 + Math.floor(i / TOI_DA) * bd; m.cap = i < duong.length; });
        // Mảnh ghi hệ số phân số không đếm được từng cái: không ghép cặp
        if (cua.some(function (m) { return m.g.gon; })) cua.forEach(function (m) { m.cap = false; });
        var cot = Math.min(TOI_DA, Math.max(duong.length, am.length)), net = gon(cua.map(heCua));
        var tong = net.length ? net[0] : { he: [0, 1], mu: cua[0].g.d.mu };
        hang.push({ k: k, x: cot * buoc - GAP + 0.9, y: top + h.h / 2, s: '= ' + chuDon(tong), bac: bacDon(tong.mu), con: tong.he[0] !== 0 });
        rongMax = Math.max(rongMax, cot * buoc);
        yh = y2 + dA * bd + 0.3 + 0.6 * co;
      });
      if (!gop) manh.forEach(function (m) { m.xx = m.bx; m.xy = m.by; m.cap = false; });

      manh.forEach(function (m) {
        var h = m.g.hinh;
        [[m.bx, m.by], [m.xx, m.xy]].forEach(function (q) { b.gom(q[0], q[1] - SAU * h.d); b.gom(q[0] + h.w + SAU * h.d, q[1] + h.h); });
      });
      // Tên cạnh của mảnh đầu mỗi loại nằm bên trái và phía trên
      if (o.nhanCanh) { b.gom(b.x0 - 1.1 * co, b.y0); b.gom(b.x0, b.y0 - 0.9 * co); }
      ma = null;
      if (sai.ma) {
        var dm = docDon(sai.ma.don), hm = hinhManh(dm.mu, v, true), xm = Math.max(b.x1, rongMax + 4 * co) + 1;
        ma = { x: xm, y: SAU * hm.d, hinh: hm, nhan: sai.ma.nhan || chuBien(dm.mu) };
        b.gom(xm, 0); b.gom(xm + hm.w + SAU * hm.d, ma.y + hm.h);
        b.chu(ma.x + ma.hinh.w / 2, ma.y + ma.hinh.h + 0.9 * co, ma.nhan, 0.9 * co);
      }
      nhom.forEach(function (g, i) {
        g.chu = g.nhan || nhanNhom(g.d, i > 0 && !(g.coLat && !nhom[i - 1].coLat), g.coLat && i > 0 && !nhom[i - 1].coLat);
        b.chu(g.bx + g.rong / 2, g.nhanY, g.chu, co);
        // Chỉ bày, không xếp: ghi bậc dưới từng nhóm
        g.bac = bacDon(g.d.mu);
        if (!gop && o.bac) b.chu(g.bx + g.rong / 2, g.nhanY + 1.15 * co, 'bậc ' + g.bac, 0.85 * co);
      });
      // Ngoặc của đa thức bị trừ
      ngoac = [];
      nhom.forEach(function (g, i) {
        if (g.coLat && (i === 0 || !nhom[i - 1].coLat)) ngoac.push({ x: g.bx - 0.2, y: g.by + g.hinh.h / 2, s: TRU + '(', neo: 'end' });
        if (g.coLat && (i === nhom.length - 1 || !nhom[i + 1].coLat)) ngoac.push({ x: g.bx + g.rong + 0.2, y: g.by + g.hinh.h / 2, s: ')', neo: 'start' });
      });
      ngoac.forEach(function (n) { b.chu(n.x, n.y, n.s, 1.5 * co, n.neo); });
      if (gop) hang.forEach(function (h) { h.x = h.x - 0.9 + 0.5 * co; b.chu(h.x, h.y, h.s + (o.bac ? ' (bậc ' + h.bac + ')' : ''), co, 'start'); });
      tatCa = manh.map(heCua);
      ketQua = gon(tatCa); tong = null;
      if (gop && o.tong !== false) { tong = { x: 0, y: Math.max(yh, b.y1) + 0.9 * co, s: '= ' + chuDa(ketQua) }; b.chu(0, tong.y, tong.s, 1.1 * co, 'start'); }
      if (o.demNhom) b.chu(0, b.y1 + co, nhom.length + ' nhóm', co, 'start');
      }

      // Vị trí tại thời điểm t; nhóm ghi sau: chỉ hiện ra khi hình chạy
      var kSau = C.muot((t - 0.12) / 0.3);
      nhom.forEach(function (g) { g.hien = g.sau ? kSau : 1; });
      manh.forEach(function (m) {
        m.hien = m.g.hien;
        var h = m.g.hinh, x = C.noiSuy(m.bx, m.xx, kXep), yy = C.noiSuy(m.by, m.xy, kXep);
        var kl = m.g.lat ? kLat : 0, s = m.g.lat ? Math.abs(Math.cos(Math.PI * kl)) : 1;
        m.x = x; m.y = yy; m.w = h.w; m.h = h.h; m.d = h.d; m.loai = h.loai; m.mau = mauLoai[m.k]; m.co = Math.max(0.04, s);
        m.dauNay = m.g.lat && kl < 0.5 ? m.g.dau0 : m.dau;
        m.op = (m.cap ? 1 - 0.85 * kHuy : 1) * m.hien;
        m.gt = giaTri(m.g.d.mu, v) * m.g.heSo;
      });
      return { manh: manh, nhom: nhom, hang: hang, ngoac: ngoac, tong: tong, ma: ma, co: co, khung: b.hop(0.5 * co), loai: loai,
        nhanHet: gop ? M.xep[0] : 2, kLat: kLat, kXep: kXep, kHuy: kHuy, ket: ket, gop: gop, ketQua: ketQua, giaTri: tatCa.reduce(function (s, d) { return s + d.he[0] / d.he[1] * giaTri(d.mu, v); }, 0) };
    }
  });

  function veMot(svg, m, co, thuChu, soi) {
    var w = m.w * m.co, x = m.x + (m.w - w) / 2, y = m.y, d = m.d, s = SAU * d, am = m.dauNay < 0;
    var g = C.mk('g', { opacity: m.op < 1 ? m.op : null, 'data-soi': soi }, svg);
    var vien = am ? '--sai' : '--muc', net = am ? { 'stroke-dasharray': '5 3' } : null;
    if (m.loai === 'the') {
      C.mk('rect', Object.assign({ x: x, y: y, width: w, height: m.h, rx: Math.min(w, m.h) / 2, fill: mau(m.mau), 'fill-opacity': am ? 0.08 : 0.3, stroke: mau(vien), 'stroke-width': 1.4 }, NET, net || {}), g);
      if (m.co > 0.5) viet(g, x + w / 2, y + m.h / 2, (am ? TRU : '') + thuChu, Math.min(co, 0.5 * m.h), am ? '--sai' : m.mau);
      return;
    }
    if (d > 0) {
      da(g, [[x, y], [x + w, y], [x + w + s, y - s], [x + s, y - s]], m.mau, am ? 0.06 : 0.5, vien, net);
      da(g, [[x + w, y], [x + w + s, y - s], [x + w + s, y + m.h - s], [x + w, y + m.h]], m.mau, am ? 0.04 : 0.2, vien, net);
    }
    da(g, [[x, y], [x + w, y], [x + w, y + m.h], [x, y + m.h]], m.mau, am ? 0.08 : 0.35, vien, net);
    if (am && m.co > 0.5 && Math.min(w, m.h) > 0.7 && !(m.g && m.g.gon)) viet(g, x + w / 2, y + m.h / 2, TRU, Math.min(1.2 * co, 0.9 * Math.min(w, m.h)), '--sai');
  }

  C.lay('khoiGop').ve = function (svg, k, p, t, o) {
    var co = k.co, giai = p.trangThai === 'giai', giau = o.anNhan && !p.trangThai;
    svg.setAttribute('viewBox', k.khung.join(' '));
    var anNhan = 1 - C.muot((t - k.nhanHet + 0.02) / 0.06);
    if (k.ma) {
      var mm = k.ma, h = mm.hinh;
      veMot(svg, { x: mm.x, y: mm.y, w: h.w, h: h.h, d: h.d, loai: h.loai, mau: '--sai', co: 1, op: 1, dauNay: 1 }, co, mm.nhan);
      viet(svg, mm.x + h.w / 2, mm.y + h.h + 0.9 * co, mm.nhan, 0.9 * co, '--sai');
    }
    var dauLoai = {};
    k.manh.forEach(function (m) {
      veMot(svg, m, co, chuBien(m.g.d.mu), m.dauNay < 0 ? 'am' : 'loai-' + m.k);
      // Mảnh lẽ ra phải lật mà em chưa lật: viền đỏ
      if (m.g.latSai && t > 0.3) C.mk('rect', Object.assign({ x: m.x - 0.12, y: m.y - SAU * m.d - 0.12, width: m.w + SAU * m.d + 0.24, height: m.h + SAU * m.d + 0.24, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2.5 }, NET), svg);
      // Mảnh có hệ số phân số: ghi hệ số ngay trên mặt mảnh
      if (m.g.gon && m.co > 0.5) { var hs = chuPS([Math.abs(m.g.d.he[0]), m.g.d.he[1]]); viet(svg, m.x + m.w / 2, m.y + m.h / 2, (m.dauNay < 0 ? TRU : '') + hs, Math.min(0.8 * co, 1.35 * m.w / (hs.length + 1)), m.dauNay < 0 ? '--sai' : '--muc'); }
      // Tên cạnh mờ đi khi các mảnh đang di chuyển, kẻo bay qua đè lên mảnh khác
      var opCanh = Math.pow(Math.abs(2 * k.kXep - 1), 3) * m.hien;
      if (o.nhanCanh && !dauLoai[m.k] && m.co > 0.9) {
        dauLoai[m.k] = true;
        var c = hinhManh(m.g.d.mu, { x: p.x, y: p.y, z: Z }).canh, s = SAU * m.d, cn = 0.9 * co;
        if (c[0]) viet(svg, m.x + m.w / 2, m.y - s - 0.45 * cn, c[0], cn, MAU_CHU[c[0].charAt(0)], opCanh);
        if (c[1]) viet(svg, m.x - 0.4 * cn, m.y + m.h / 2, c[1], cn, MAU_CHU[c[1].charAt(0)], opCanh, 'end');
        // Cạnh chiều sâu: ghi bên trái cạnh xiên, khỏi chồng lên khối kế bên
        if (c[2]) viet(svg, m.x + s / 2 - 0.3 * cn, m.y - s / 2 - 0.2 * cn, c[2], cn, MAU_CHU[c[2].charAt(0)], opCanh, 'end');
      }
    });
    k.nhom.forEach(function (g) {
      viet(svg, g.bx + g.rong / 2, g.nhanY, g.chu, co, null, anNhan * g.hien);
      if (!k.gop && o.bac) viet(svg, g.bx + g.rong / 2, g.nhanY + 1.15 * co, 'bậc ' + g.bac, 0.85 * co, '--nhat', C.muot((t - 0.3) / 0.3) * g.hien);
    });
    var gNgoac = k.ngoac.length ? C.mk('g', { 'data-soi': 'ngoac' }, svg) : null;
    k.ngoac.forEach(function (n) { viet(gNgoac, n.x, n.y, n.s, 1.5 * co, null, anNhan, n.neo); });
    var gTong = k.gop ? C.mk('g', { 'data-soi': 'tong' }, svg) : null;
    if (k.gop) k.hang.forEach(function (h) {
      viet(gTong, h.x, h.y, giau ? '= ?' : h.s + (o.bac && h.con ? '  (bậc ' + h.bac + ')' : ''), co, h.con ? k.manh.filter(function (m) { return m.k === h.k; })[0].mau : '--nhat', k.ket, 'start');
    });
    if (k.tong) viet(gTong, k.tong.x, k.tong.y, giau ? '= ?' : k.tong.s, 1.1 * co, giai ? '--cc' : null, k.ket, 'start');
    if (o.demNhom && !giau) viet(svg, 0, k.khung[1] + k.khung[3] - 1.1 * co, k.nhom.length + ' nhóm', co, '--cc', C.muot((t - 0.85) / 0.1), 'start');
  };

  // Soi: mỗi loại mảnh một khoá, cộng mảnh âm, ngoặc bị trừ và dòng kết quả.
  // o.anNhan mà em chưa giải xong: chỉ nói cạnh và giá trị một mảnh, không nói số mảnh, bậc hay kết quả.
  C.lay('khoiGop').soi = function (k, p, o) {
    var hien = !o.anNhan || p.trangThai === 'giai', v = { x: p.x, y: p.y, z: Z }, ra = {}, chuDung = {};
    k.loai.forEach(function (kk) { chuCai(k.manh.filter(function (m) { return m.k === kk; })[0].g.d.mu).forEach(function (c) { chuDung[c] = true; }); });
    var voiCua = function (ds) { return ds.map(function (c) { return '$' + c + ' = ' + soT(v[c]) + '$'; }).join(', '); };
    var voi = voiCua(Object.keys(chuDung).sort());
    k.loai.forEach(function (kk) {
      var cua = k.manh.filter(function (m) { return m.k === kk; }), d = cua[0].g.d, h = hinhManh(d.mu, v), bien = texBien(d.mu);
      var f = [], chu, voi = voiCua(chuCai(d.mu));
      chuCai(d.mu).forEach(function (c) { for (var i = 0; i < d.mu[c]; i++) f.push(c); });
      var gt = '$' + bien + ' ' + bangT(giaTri(d.mu, v)) + '$';
      if (h.loai === 'so') chu = 'Ô vuông cạnh $1$: hạng tử chỉ có số, mỗi ô là $1$.';
      else if (h.loai === 'the') chu = 'Thẻ ghi phần biến $' + bien + '$: có hơn ba thừa số chữ nên không vẽ thành khối được.';
      else if (h.loai === 'thanh') chu = 'Thanh dài $' + f[0] + '$, rộng $1$, nên giá trị là $' + f[0] + '$. Với ' + voi + ': ' + gt + '.';
      else chu = (h.loai === 'tam' ? 'Tấm có hai cạnh ' : 'Khối có ba cạnh ') + f.map(function (c) { return '$' + c + '$'; }).join(', ') +
        ', nên ' + (h.loai === 'tam' ? 'diện tích' : 'thể tích') + ' là $' + f.join(' \\cdot ') + ' = ' + bien + '$. Với ' + voi + ': ' + gt + '.';
      if (hien) {
        if (cua.some(function (m) { return m.g.gon; })) chu += ' Hệ số là phân số nên ghi ngay trên mảnh, không đếm từng mảnh.';
        else {
          var nd = cua.filter(function (m) { return m.dauNay > 0; }).length, na = cua.length - nd;
          chu += ' Lúc này có $' + nd + '$ mảnh dương' + (na ? ' và $' + na + '$ mảnh âm' : '') + '.';
          if (cua.some(function (m) { return m.op < 0.5; })) chu += ' Các mảnh mờ đi là những cặp dương, âm đã triệt tiêu.';
        }
        chu += ' Bậc $' + bacDon(d.mu) + '$' + (h.loai === 'so' ? ': không có chữ nào.' : ': bằng số thừa số chữ nhân với nhau.');
      }
      if (h.loai !== 'so') chu += ' Các mảnh cùng loại có cùng các cạnh, tức cùng phần biến: đó là các đơn thức đồng dạng.';
      ra['loai-' + kk] = { tieuDe: bien ? 'Mảnh $' + bien + '$' : 'Ô số', chu: chu };
    });
    var am = k.manh.filter(function (m) { return m.dauNay < 0; })[0];
    if (am) {
      var b = texBien(am.g.d.mu) || '1';
      ra.am = { tieuDe: 'Mảnh âm', chu: 'Viền đỏ đứt là mảnh âm. Một mảnh dương và một mảnh âm cùng loại cộng lại bằng $0$, như $' + b + ' + (-' + b + ') = 0$, nên chúng triệt tiêu nhau.' };
    }
    if (k.ngoac.length) ra.ngoac = { tieuDe: 'Dấu trừ trước ngoặc', chu: 'Bớt đi cả đa thức trong ngoặc cũng là thêm số đối của **từng** hạng tử trong đó. Vì vậy mọi mảnh trong ngoặc đều bị lật: dương thành âm, âm thành dương.' };
    if (k.gop) ra.tong = { tieuDe: 'Kết quả', chu: !hien ? 'Kết quả là điều em cần tự đếm: mỗi hàng cộng mảnh dương, trừ mảnh âm.'
      : k.ket < 0.5 ? 'Chạy hình tới cuối để xem kết quả.'
      : 'Sau khi gộp và triệt tiêu còn $' + texDa(k.ketQua) + '$. ' + (voi ? 'Với ' + voi + ', cả hình' : 'Cả hình') + ' có giá trị $' + texDa(k.ketQua) + ' ' + bangT(k.giaTri) + '$.' };
    return ra;
  };

  /* ================= 2. thuaSo: đơn thức là tích các thừa số, mỗi chữ một thẻ ================= */
  // Chế độ: nhân (o.don: các đơn thức nhân với nhau), thay số (o.thay: { x: 3 }), chia (o.chia: [A, B]).
  var RTHE = 0.62, KC = 0.3;
  function rongThe(the) { return the.loai === 'so' ? Math.max(1.24, 0.6 * the.s.length + 0.55) : 2 * RTHE; }
  function cacThe(d, nhomDon, luonSo) {
    var ds = [], coBien = chuCai(d.mu).length > 0;
    if (luonSo || !coBien || d.he[0] !== d.he[1]) ds.push({ loai: 'so', s: chuPS(d.he), he: d.he, don: nhomDon });
    chuCai(d.mu).forEach(function (k) { for (var i = 0; i < d.mu[k]; i++) ds.push({ loai: 'chu', s: k, chu: k, don: nhomDon }); });
    return ds;
  }
  function xepHang(ds, x0, y, cachDon) {
    var x = x0;
    ds.forEach(function (the, i) {
      if (i > 0) x += ds[i - 1].don !== the.don ? cachDon : KC;
      the.w = rongThe(the); the.x = x + the.w / 2; the.y = y; x += the.w;
    });
    return x;
  }
  C.dangKi('thuaSo', {
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var b = khungBao(), the = [], nhan = [], dongCuoi = null, chia = !!o.chia, thay = o.thay || null;
      var co = 0.95, ket = C.muot((t - 0.86) / 0.08);
      if (chia) {
        var A = docDon(o.chia[0]), B = docDon(o.chia[1]), q = chiaDon(A, B);
        var tA = cacThe(A, 0, true), tB = cacThe(B, 1, true);
        xepHang(tA, 0, 0, 0); xepHang(tB, 0, 2.4, 0);
        var kGhep = C.muot((t - 0.12) / 0.38), kHuy = C.muot((t - 0.55) / 0.15), dung = {};
        tA.forEach(function (a) { a.x0 = a.x; a.y0 = a.y; });
        var xThua = Math.max(tA[tA.length - 1].x + tA[tA.length - 1].w / 2, 0) + 1.2;
        tB.forEach(function (c) {
          c.x0 = c.x; c.y0 = c.y;
          var ban = c.loai === 'so' ? tA[0] : tA.filter(function (a) { return a.chu === c.chu && !dung[tA.indexOf(a)]; })[0];
          if (ban) { if (c.loai !== 'so') dung[tA.indexOf(ban)] = true; c.ban = ban; c.x1 = ban.x; c.y1 = 1.4; }
          else { c.thua = true; c.x1 = xThua; c.y1 = 1.4; xThua += 2 * RTHE + KC; }
        });
        tA.forEach(function (a, i) { a.cap = !!dung[i]; });
        tA.concat(tB).forEach(function (c) {
          var x1 = c.x1 == null ? c.x0 : c.x1, y1 = c.y1 == null ? c.y0 : c.y1;
          c.x = C.noiSuy(c.x0, x1, kGhep); c.y = C.noiSuy(c.y0, y1, kGhep);
          b.gom(c.x0 - c.w / 2, c.y0 - RTHE); b.gom(c.x0 + c.w / 2, c.y0 + RTHE); b.gom(x1 - c.w / 2, y1 - RTHE); b.gom(x1 + c.w / 2, y1 + RTHE);
          c.op = (c.cap || (c.ban && c.loai !== 'so')) ? 1 - 0.85 * kHuy : c.loai === 'so' && c.don === 1 ? 1 - 0.85 * kHuy : 1;
          c.mau = c.loai === 'so' ? '--tg' : (MAU_CHU[c.chu] || '--tg');
          if (c.thua && kHuy > 0.5) c.mau = '--sai';
          the.push(c);
        });
        // Thẻ số của A đổi thành thương của hai hệ số
        tA[0].sSau = chuPS(q.he); tA[0].kDoi = kHuy;
        nhan.push({ x: tA[0].x0, y: 3.9, s: chuPS(A.he) + ' : ' + (B.he[0] < 0 ? '(' + chuPS(B.he) + ')' : chuPS(B.he)) + ' = ' + chuPS(q.he), sAn: chuPS(A.he) + ' : ' + (B.he[0] < 0 ? '(' + chuPS(B.he) + ')' : chuPS(B.he)) + ' = ?', op: kHuy, mau: '--tg' });
        tB.filter(function (c) { return c.thua; }).forEach(function (c) { nhan.push({ x: c.x1, y: 2.6, s: 'thừa', op: kHuy, mau: '--sai', co: 0.75 }); });
        dongCuoi = { s: q.duoc ? '= ' + chuDon({ he: q.he, mu: q.mu }) : 'Không chia hết', duoc: q.duoc };
        b.chu(tA[0].x0, 3.9, nhan[0].s, co);
        return ketThuc();
      }
      var ds = (Array.isArray(o.don) ? o.don : [o.don]).map(docDon), tich = ds.reduce(function (a, d) { return nhanDon(a, d); }, { he: [1, 1], mu: {} });
      var tt = [];
      ds.forEach(function (d, j) { tt = tt.concat(cacThe(d, j, false)); });
      xepHang(tt, 0, 0, 1.1);
      for (var j = 1; j < ds.length; j++) {
        var dau = tt.filter(function (c) { return c.don === j; })[0];
        if (dau) nhan.push({ x: dau.x - dau.w / 2 - 0.55, y: 0, s: '·', op: 1 - C.muot((t - 0.1) / 0.05), co: 1.3 });
      }
      tt.forEach(function (c) { c.x0 = c.x; c.y0 = c.y; c.mau = c.loai === 'so' ? '--tg' : (MAU_CHU[c.chu] || '--tg'); });
      if (thay) {
        // Thay số: thẻ chữ lật lại thành giá trị, thẻ số giữ nguyên
        var kThay = C.muot((t - 0.15) / 0.4), gtri = [1, 1];
        tt.forEach(function (c) {
          if (c.loai === 'so') { gtri = nhanPS(gtri, c.he); return; }
          var g = soPS(thay[c.chu]); gtri = nhanPS(gtri, g);
          c.sSau = g[0] < 0 ? '(' + chuPS(g) + ')' : chuPS(g); c.kLat = kThay;
        });
        tt.forEach(function (c) { if (c.sSau) c.wSau = Math.max(c.w, 0.6 * c.sSau.length + 0.55); });
        xepLai(tt);
        dongCuoi = { s: '= ' + tt.map(function (c) { return c.sSau || (c.he[0] < 0 && tt.indexOf(c) > 0 ? '(' + c.s + ')' : c.s); }).join(' · ') + ' = ' + chuPS(gtri) };
        tt.forEach(function (c) {
          the.push(c); b.gom(c.x0 - (c.wSau || c.w) / 2, -RTHE); b.gom(c.x0 + (c.wSau || c.w) / 2, RTHE); c.x = c.x0; c.y = 0; c.op = 1;
          // Thẻ đã lật vẫn ghi chữ nhỏ phía trên, để biết số đó thay cho chữ nào
          if (c.sSau) { nhan.push({ x: c.x0, y: -1.1, s: c.chu, op: kThay, mau: MAU_CHU[c.chu] || '--tg', co: 0.75 }); b.gom(c.x0, -1.6); }
        });
        return ketThuc();
      }
      // Nhân: các thẻ số về một nhóm, mỗi chữ về một nhóm
      var nhomThe = [{ ten: 'so', ds: [] }];
      chuCai(tich.mu).forEach(function (k) { nhomThe.push({ ten: k, ds: [] }); });
      tt.forEach(function (c) { nhomThe.filter(function (n) { return n.ten === (c.loai === 'so' ? 'so' : c.chu); })[0].ds.push(c); });
      if (!nhomThe[0].ds.length) nhomThe.shift();
      var x = 0, kXep = C.muot((t - 0.12) / 0.48), dem = 0;
      nhomThe.forEach(function (n, i) {
        if (i > 0) x += 1.0;
        var x0 = x;
        n.ds.forEach(function (c, k) { if (k > 0) x += KC; c.x1 = x + c.w / 2; x += c.w; if (c.loai === 'chu') c.so = ++dem; });
        var s = n.ten === 'so' ? chuPS(tich.he) : n.ten + soMu(tich.mu[n.ten]);
        nhan.push({ x: (x0 + x) / 2, y: 1.55, s: s, sAn: '?', op: ket, mau: n.ten === 'so' ? '--tg' : MAU_CHU[n.ten] });
        b.chu((x0 + x) / 2, 1.55, s, co);
      });
      tt.forEach(function (c) {
        c.x = C.noiSuy(c.x0, c.x1, kXep); c.y = 0; c.op = c.loai === 'so' && o.bac ? 1 - 0.6 * ket : 1;
        b.gom(c.x0 - c.w / 2, -RTHE); b.gom(c.x0 + c.w / 2, RTHE); b.gom(c.x1 - c.w / 2, -RTHE); b.gom(c.x1 + c.w / 2, RTHE);
        if (o.bac && c.so) nhan.push({ x: c.x1, y: -1.05, s: String(c.so), op: ket, mau: '--nhat', co: 0.7 });
        the.push(c);
      });
      if (o.bac) b.gom(0, -1.6);
      var kq = { he: tich.he, mu: tich.mu };
      dongCuoi = { s: ds.length > 1 || o.thuGon ? '= ' + chuDon(kq) : chuDon(kq) };
      if (o.bac) dongCuoi.s2 = 'Bậc: đếm thẻ chữ, ' + chuCai(tich.mu).map(function (k) { return tich.mu[k]; }).join(' + ') + ' = ' + bacDon(tich.mu);
      return ketThuc();

      function xepLai(ds2) {
        // Thẻ sau khi lật có thể rộng hơn: dời các thẻ cho khỏi chồng
        var x2 = 0;
        ds2.forEach(function (c, i) { var w = Math.max(c.w, c.wSau || 0); if (i > 0) x2 += ds2[i - 1].don !== c.don ? 1.1 : KC; c.x0 = x2 + w / 2; c.wMax = w; x2 += w; });
      }
      function ketThuc() {
        // Cỡ chữ theo hàng thẻ, rồi nâng lên nếu dòng chữ cuối làm khung rộng ra (chữ ít nhất 1/16 bề rộng khung)
        co = C.kep((b.x1 - b.x0) / 12, 0.8, 1.3);
        var y = b.y1 + 0.6 + 0.8 * co;
        dongCuoi.x = 0; dongCuoi.y = y; b.chu(0, y, dongCuoi.s, 1.1 * co, 'start');
        if (dongCuoi.s2) { dongCuoi.y2 = y + 1.5 * co; b.chu(0, dongCuoi.y2, dongCuoi.s2, 0.85 * co, 'start'); }
        if ((b.x1 - b.x0) / 16 > co) {
          co = 1.05 * (b.x1 - b.x0) / 16;
          b.chu(0, y, dongCuoi.s, 1.1 * co, 'start');
          if (dongCuoi.s2) b.chu(0, dongCuoi.y2, dongCuoi.s2, 0.85 * co, 'start');
        }
        // Đo lại các nhãn với cỡ chữ cuối cùng, kẻo nhãn dài tràn khung
        nhan.forEach(function (n) { b.chu(n.x, n.y, n.s, (n.co || 1) * co); });
        return { the: the, nhan: nhan, dong: dongCuoi, co: co, ket: ket, khung: b.hop(0.6), chia: chia, thay: !!thay };
      }
    }
  });
  C.lay('thuaSo').ve = function (svg, k, p, t, o) {
    svg.setAttribute('viewBox', k.khung.join(' '));
    // o.anNhan: chưa giải thì các nhãn kết quả ghi dấu ? (trạng thái lỗi thì hình đã tính đúng điều em làm, cứ hiện)
    var giai = p.trangThai === 'giai', giau = o.anNhan && !p.trangThai;
    k.the.forEach(function (c) {
      var lat = c.kLat || 0, sc = c.sSau ? Math.abs(Math.cos(Math.PI * lat)) : 1, sau = c.sSau && lat >= 0.5, doi = c.kDoi != null && c.kDoi >= 0.5 && !giau;
      var w = (sau ? c.wSau || c.w : c.w) * Math.max(0.04, sc), g = C.mk('g', { opacity: c.op < 1 ? c.op : null }, svg);
      var nen = sau ? '--tg' : c.mau, s = sau || doi ? c.sSau : c.s;
      if (c.loai === 'so' || sau) C.mk('rect', Object.assign({ x: c.x - w / 2, y: c.y - RTHE, width: w, height: 2 * RTHE, rx: 0.2, fill: mau(nen), 'fill-opacity': 0.15, stroke: mau(nen), 'stroke-width': 1.4 }, NET), g);
      else C.mk('ellipse', Object.assign({ cx: c.x, cy: c.y, rx: RTHE * Math.max(0.04, sc), ry: RTHE, fill: mau(nen), 'fill-opacity': 0.22, stroke: mau(nen), 'stroke-width': 1.4 }, NET), g);
      if (sc > 0.4) viet(g, c.x, c.y + 0.03, s, Math.min(c.loai === 'chu' && !sau ? 1 : 0.9, 1.65 * w / s.length), sau ? null : nen);
    });
    k.nhan.forEach(function (n) { viet(svg, n.x, n.y, giau && n.sAn ? n.sAn : n.s, (n.co || 1) * k.co, n.mau, n.op); });
    var d = k.dong;
    viet(svg, d.x, d.y, giau ? '= ?' : d.s, 1.1 * k.co, giai ? '--cc' : d.duoc === false ? '--sai' : null, k.ket, 'start');
    if (d.s2 && !giau) viet(svg, d.x, d.y2, d.s2, 0.85 * k.co, '--nhat', k.ket, 'start');
  };

  /* ================= 3. hcnNhan: tích hai đa thức là diện tích hình chữ nhật ================= */
  // o.hang, o.cot: hai thừa số (cạnh trái, cạnh trên). o.chia: đơn thức chia, o.dt: đa thức bị chia (diện tích các mảnh).
  // Hạng tử nào cũng dương thì vẽ đúng tỉ lệ theo x, y; có hạng tử âm (hoặc o.bang) thì vẽ thành bảng ô bằng nhau.
  var O_RONG = 3, O_CAO = 2.8;
  C.dangKi('hcnNhan', {
    thamSo: { x: { min: 1.5, max: 5, step: 0.5, md: 3, nhan: 'Giá trị x', mau: '--a' }, y: { min: 1, max: 4, step: 0.5, md: 2, nhan: 'Giá trị y', mau: '--b' } },
    trangThai: { giai: true },
    tinh: function (p, t, o) {
      var v = { x: p.x, y: p.y, z: 2.5 }, chia = !!o.chia, sai = (o.sai && p.trangThai && o.sai[p.trangThai]) || {};
      var hang, cot, dt;
      if (chia) { hang = [docDon(o.chia)]; dt = docDa(o.dt); cot = dt.map(function (d) { return chiaDon(d, hang[0]); }); }
      else { hang = docDa(o.hang); cot = docDa(o.cot); }
      var duong = function (d) { return d.he[0] > 0; };
      var thuc = !o.bang && hang.every(duong) && cot.every(function (d) { return duong(d) && d.duoc !== false; });
      var dai = function (d) { return d.he[0] / d.he[1] * giaTri(d.mu, v); };
      // Bảng: cột đủ rộng cho chữ dài nhất trong cột (chữ cỡ khoảng 1)
      var rongBang = function (j) {
        var dai1 = Math.max(chuDon(cot[j]).length, chia ? chuDon(dt[j]).length : Math.max.apply(null, hang.map(function (h) { return chuDon(nhanDon(h, cot[j])).length; })));
        return Math.max(O_RONG, 0.75 * dai1 + 1.4);
      };
      var rong = cot.map(function (d, j) { return thuc ? dai(d) : rongBang(j); }), cao = hang.map(function (d) { return thuc ? dai(d) : O_CAO; });
      var W = rong.reduce(function (s, a) { return s + a; }, 0), H = cao.reduce(function (s, a) { return s + a; }, 0);
      var co = C.kep(Math.max(W, 0.9 * H) / 9, 0.55, 1.4);
      var loai = [], o2 = [], n = hang.length * cot.length, bo = {}, an = {}, nhanSai = sai.nhan || {};
      (o.bo || []).forEach(function (q) { bo[q[0] + ',' + q[1]] = true; });
      (sai.an || []).forEach(function (q) { an[q[0] + ',' + q[1]] = true; });
      var y = 0, dem = 0;
      hang.forEach(function (hd, i) {
        var x = 0;
        cot.forEach(function (cd, j) {
          var tich = chia ? dt[j] : nhanDon(hd, cd), kk = khoa(tich.mu);
          if (loai.indexOf(kk) < 0) loai.push(kk);
          var ma = i + ',' + j, k = dem++;
          o2.push({ i: i, j: j, x: x, y: y, w: rong[j], h: cao[i], tich: tich, s: nhanSai[ma] || chuDon(tich), sai: !!nhanSai[ma], mau: MAU[loai.indexOf(kk) % MAU.length], li: loai.indexOf(kk),
            sChia: chia ? chuDon(tich) + ' : ' + chuDon(hd) : null, bo: !!bo[ma], an: !!an[ma], khong: chia && cd.duoc === false, gt: thuc ? rong[j] * cao[i] : null,
            op: chia ? 1 : C.muot((t - (0.35 + 0.4 * k / Math.max(1, n))) / 0.08) });
          x += rong[j];
        });
        y += cao[i];
      });
      var cat = chia ? 1 : C.muot((t - 0.1) / 0.25), ket = C.muot((t - 0.88) / 0.08);
      // Chia, trạng thái lỗi: sai.tren là đoạn em gõ cho từng cột (null là bỏ sót). Ô nào nhân lại không ra diện tích thì tô đỏ, ghi tích của đoạn em gõ
      var tren = chia && sai.tren ? sai.tren.map(function (g) { return g == null ? null : docDon(g); }) : null;
      if (tren) o2.forEach(function (c) {
        var g = tren[c.j];
        if (!g) { c.thieu = true; return; }
        var tich = nhanDon(hang[0], g);
        if (khoa(tich.mu) !== khoa(c.tich.mu) || tich.he[0] * c.tich.he[1] !== c.tich.he[0] * tich.he[1]) { c.lech = true; c.s = chuDon(tich) + ' ≠'; c.sai = true; }
      });
      var canhTren = cot.map(function (d, j) {
        var x0 = rong.slice(0, j).reduce(function (s, a) { return s + a; }, 0);
        var lo = chia ? C.muot((t - (0.15 + 0.55 * j / cot.length)) / 0.1) : 1;
        if (tren) return { x: x0 + rong[j] / 2, x0: x0, x1: x0 + rong[j], s: tren[j] ? chuDon(tren[j]) : '?', lo: 1, sai: true };
        return { x: x0 + rong[j] / 2, x0: x0, x1: x0 + rong[j], s: chia ? (d.duoc === false ? '✗' : chuDon(d)) : chuDon(d), lo: lo, khong: d.duoc === false };
      });
      var canhTrai = hang.map(function (d, i) {
        var y0 = cao.slice(0, i).reduce(function (s, a) { return s + a; }, 0);
        return { y: y0 + cao[i] / 2, y0: y0, y1: y0 + cao[i], s: chuDon(d) };
      });
      // Ô bị bỏ (đề cắt đi) và ô em bỏ sót (trạng thái lỗi) không tính: tổng đúng bằng điều em đã làm
      var conLai = o2.filter(function (c) { return !c.bo && !c.an; }).map(function (c) { return c.tich; });
      var tong, chiaHet = cot.every(function (d) { return d.duoc !== false; });
      if (chia) tong = chiaHet ? (o.tienTo || '= ') + chuDa(gon(cot)) : 'Có ô ✗: không chia hết';
      else tong = (o.tienTo || '= ') + chuDa(gon(conLai));
      var b = khungBao();
      b.gom(0, 0); b.gom(W, H);
      canhTren.forEach(function (c) { b.chu(c.x, -0.75 * co, c.s, co); });
      canhTrai.forEach(function (c) { b.chu(-0.4 * co, c.y, c.s, co, 'end'); });
      var tenTren = o.tenCot || chuDa(cot), tenTrai = o.tenHang || chuDa(hang);
      if (!chia) { b.chu(W / 2, -0.75 * co, tenTren, co); b.chu(-0.4 * co, H / 2, tenTrai, co, 'end'); }
      var yTong = H + 1.3 * co;
      b.chu(0, yTong, tong, 1.05 * co, 'start');
      var pha = phaHcn(p, v, hang, cot, dt, chia);
      return { o: o2, W: W, H: H, co: co, cat: cat, ket: ket, chia: chia, thuc: thuc, canhTren: canhTren, canhTrai: canhTrai, tenTren: tenTren, tenTrai: tenTrai,
        tong: { s: tren ? '' : tong, y: yTong, duoc: !chia || chiaHet }, khung: b.hop(0.45 * co), dienTich: thuc ? W * H : null,
        hang: hang, cot: cot, dt: dt || null, v: v, pha: pha,
        phaO: pha.hong ? o2.filter(function (c) { return pha.amHang[c.i] || pha.amCot[c.j]; }) : [] };
    }
  });
  // Thử phá cho hcnNhan: x âm thì có đoạn cạnh âm, hình không còn là hình chữ nhật thật; nhưng tính lại hai vế vẫn bằng nhau
  function phaHcn(p, v, hang, cot, dt, chia) {
    var am = p.dau != null && p.dau < 0, vs = { x: am ? -v.x : v.x, y: v.y, z: v.z };
    var gt = function (d) { return giaTriDon(d, vs); };
    var coY = hang.concat(cot, dt || []).some(function (d) { return d.mu.y; });
    var voi = '$x = ' + soT(vs.x) + '$' + (coY ? ', $y = ' + soT(vs.y) + '$' : '');
    var nhom = function (ds) { return ds.length > 1 ? '(' + texDa(ds) + ')' : texDon(ds[0]); };
    var dong;
    if (chia) {
      var B = hang[0], S = cong(dt.map(gt)), Q = cong(cot.map(gt));
      dong = '$' + nhom(dt) + ' : ' + texNgoac(B) + ' = ' + soN(S) + ' : ' + soN(gt(B)) + ' = ' + soT(S / gt(B)) + '$' + (am ? ', và cạnh trên tìm được trên hình, tính lại với $x = ' + soT(vs.x) + '$, cũng bằng $' + soT(Q) + '$' : ', đúng bằng độ dài cạnh trên');
    } else {
      var L = cong(hang.map(gt)), T = cong(cot.map(gt)), oS = [];
      hang.forEach(function (h) { cot.forEach(function (c) { oS.push(gt(h) * gt(c)); }); });
      dong = '$' + nhom(hang) + nhom(cot) + ' = ' + soN(L) + ' \\cdot ' + soN(T) + ' = ' + soT(L * T) + '$, tổng các mảnh $' + texTong(oS) + ' = ' + soT(cong(oS)) + '$';
    }
    var amHang = hang.map(function (d) { return gt(d) < 0; }), amCot = cot.map(function (d) { return gt(d) < 0; }), thay = {}, ds = [];
    // Phép chia: chỉ nói cạnh đã cho, kẻo lộ các đoạn của cạnh trên (thương) trước khi hình chạy tới
    (chia ? hang : hang.concat(cot)).forEach(function (d) {
      var s = '$' + texDon(d) + ' = ' + soT(gt(d)) + '$';
      if (am && d.mu.x && gt(d) < 0 && !thay[s]) { thay[s] = true; ds.push(s); }
    });
    if (!am) return { hong: false, amHang: amHang, amCot: amCot, chu: 'Với ' + voi + ': ' + dong + '.' };
    return { hong: true, amHang: amHang, amCot: amCot, chu: 'Hình hỏng: với ' + voi + (ds.length ? ', đoạn ' + ds.join(' và ') + ' âm, mà độ dài không thể âm, nên không có hình chữ nhật nào như thế' : '') +
      '. ' + (chia ? 'Phép chia' : 'Phép nhân') + ' thì không hỏng: ' + dong + '. Quy tắc dựa vào tính chất phân phối nên đúng với mọi $x$; chỉ cách nhìn bằng diện tích mới cần $x > 0$.' };
  }
  C.lay('hcnNhan').ve = function (svg, k, p, t, o) {
    // o.anNhan: chưa giải thì cạnh cần tìm và dòng tổng ghi dấu ?
    var giau = o && o.anNhan && !p.trangThai;
    var co = k.co, giai = p.trangThai === 'giai', W = k.W, H = k.H, cat = k.cat;
    svg.setAttribute('viewBox', k.khung.join(' '));
    // Chưa cắt: cả hình một màu xám
    C.mk('rect', Object.assign({ x: 0, y: 0, width: W, height: H, fill: 'var(--tg)', 'fill-opacity': 0.08 * (1 - cat) }, NET), svg);
    var nen = svg;
    k.o.forEach(function (c) {
      var hien = k.chia ? 1 : cat;
      // Mỗi ô (nền và chữ) nằm trong một nhóm để bấm vào đâu trên ô cũng soi được; ô bị bỏ, ô em bỏ sót thì không soi
      var svg = C.mk('g', { 'data-soi': c.bo || c.an ? null : 'loai' + c.li }, nen);
      if (c.bo || c.an) {
        C.mk('rect', Object.assign({ x: c.x, y: c.y, width: c.w, height: c.h, fill: 'var(--mat)', stroke: 'var(--sai)', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, NET), svg);
        viet(svg, c.x + c.w / 2, c.y + c.h / 2, (c.bo ? 'bỏ ' : 'thiếu ') + c.s, 0.85 * co, '--sai', c.bo ? 1 : 1);
        return;
      }
      C.mk('rect', Object.assign({ x: c.x, y: c.y, width: c.w, height: c.h, fill: mau(c.khong || c.lech ? '--sai' : c.mau), 'fill-opacity': 0.28 * Math.max(hien * c.op, 0) }, NET), svg);
      if (c.thieu || c.lech) C.mk('rect', Object.assign({ x: c.x, y: c.y, width: c.w, height: c.h, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 3, 'stroke-dasharray': c.thieu ? '6 4' : null }, NET), svg);
      // Chia mà chưa giải: nút chạy hình đổi nhãn ô thành phép chia cần làm, cạnh trên vẫn là dấu ?
      // (hai dòng: diện tích ở trên, ": số chia" ở dưới, cho vừa ô hẹp)
      if (giau && k.chia && !c.sai && k.canhTren[c.j].lo > 0.5) {
        var duoi = ': ' + c.sChia.split(' : ')[1], coO = Math.min(co, 0.3 * c.h + 0.1, 1.9 * c.w / Math.max(2, c.s.length, duoi.length));
        viet(svg, c.x + c.w / 2, c.y + c.h / 2 - 0.6 * coO, c.s, coO, null, c.op);
        viet(svg, c.x + c.w / 2, c.y + c.h / 2 + 0.6 * coO, duoi, coO, '--nhat', c.op);
      } else viet(svg, c.x + c.w / 2, c.y + c.h / 2, c.s, Math.min(co, 0.55 * c.h + 0.1, 1.9 * c.w / Math.max(2, c.s.length)), c.sai ? '--sai' : c.khong ? '--sai' : null, c.op);
    });
    // Thử phá: ô có đoạn cạnh âm thì viền đỏ đứt, vì không có ô nào như thế
    (k.phaO || []).forEach(function (c) {
      C.mk('rect', Object.assign({ x: c.x + 0.04 * co, y: c.y + 0.04 * co, width: c.w - 0.08 * co, height: c.h - 0.08 * co, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2.5, 'stroke-dasharray': '7 4' }, NET), svg);
    });
    // Đường cắt
    if (cat > 0) {
      k.canhTren.slice(1).forEach(function (c) { C.mk('line', Object.assign({ x1: c.x0, y1: 0, x2: c.x0, y2: H * cat, stroke: 'var(--muc)', 'stroke-width': 1.5 }, NET), svg); });
      k.canhTrai.slice(1).forEach(function (c) { C.mk('line', Object.assign({ x1: 0, y1: c.y0, x2: W * cat, y2: c.y0, stroke: 'var(--muc)', 'stroke-width': 1.5 }, NET), svg); });
    }
    C.mk('rect', Object.assign({ x: 0, y: 0, width: W, height: H, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 2 }, NET), svg);
    // Nhãn cạnh: lúc đầu ghi cả thừa số, cắt xong ghi từng đoạn
    var tach = k.chia ? 1 : C.muot((cat - 0.5) / 0.5);
    var gTren = C.mk('g', { 'data-soi': 'canhTren' }, svg), gTrai = C.mk('g', { 'data-soi': 'canhTrai' }, svg);
    if (!k.chia) {
      viet(gTren, W / 2, -0.75 * co, k.tenTren, co, null, 1 - tach);
      viet(gTrai, -0.4 * co, H / 2, k.tenTrai, co, null, 1 - tach, 'end');
    }
    k.canhTren.forEach(function (c) {
      C.mk('line', Object.assign({ x1: c.x0, y1: -0.15 * co, x2: c.x0, y2: 0.15 * co, stroke: 'var(--muc)', 'stroke-width': 1.4, opacity: tach }, NET), gTren);
      if (c.sai) viet(gTren, c.x, -0.75 * co, c.s, co, '--sai');
      else if (k.chia) { var lo = giau ? 0 : c.lo; viet(gTren, c.x, -0.75 * co, '?', co, '--nhat', 1 - lo); viet(gTren, c.x, -0.75 * co, c.s, co, c.khong ? '--sai' : giai ? '--cc' : null, lo); }
      else viet(gTren, c.x, -0.75 * co, c.s, co, null, tach);
    });
    k.canhTrai.forEach(function (c) { viet(gTrai, -0.4 * co, c.y, c.s, co, null, tach, 'end'); });
    if (k.tong.s) viet(C.mk('g', { 'data-soi': 'tong' }, svg), 0, k.tong.y, giau ? '= ?' : k.tong.s, 1.05 * co, giai ? '--cc' : k.tong.duoc ? null : '--sai', k.ket, 'start');
  };
  // Soi: cạnh trái, cạnh trên, mỗi nhóm ô cùng màu, dòng tổng.
  // o.anNhan mà em chưa giải xong: không nói cạnh cần tìm, không nói tổng (thẻ chỉ nói điều đã thấy trên hình và vì sao).
  C.lay('hcnNhan').soi = function (k, p, o) {
    var hien = !o.anNhan || p.trangThai === 'giai', v = k.v, ra = {};
    var gt = function (d) { return giaTriDon(d, v); };
    var coY = k.hang.concat(k.cot, k.dt || []).some(function (d) { return d.mu.y; });
    var voi = 'Với $x = ' + soT(v.x) + '$' + (coY ? ', $y = ' + soT(v.y) + '$' : '');
    var doDai = function (ds) { var g = ds.map(gt); return '$' + texDa(ds) + ' = ' + (ds.length > 1 ? texTong(g) + ' = ' : '') + soT(cong(g)) + '$'; };
    var doan = function (ds) { return ds.map(function (d) { return '$' + texDon(d) + '$'; }).join(', '); };
    var canh = function (ds, ten) {
      if (!k.thuc) return 'Mỗi ' + ten + ' của bảng là một hạng tử: ' + doan(ds) + '. Có hạng tử âm nên các ô vẽ bằng nhau, không theo tỉ lệ.';
      return (ds.length > 1 ? 'Gồm các đoạn ' + doan(ds) + '. ' : '') + voi + ', cạnh này dài ' + doDai(ds) + '.';
    };
    ra.canhTrai = { tieuDe: 'Cạnh trái $' + texDa(k.hang) + '$', chu: k.chia
      ? 'Cạnh chung của mọi mảnh: mỗi mảnh là hình chữ nhật có một cạnh $' + texDon(k.hang[0]) + '$.' + (k.thuc ? ' ' + voi + ', cạnh này dài ' + doDai(k.hang) + '.' : '')
      : canh(k.hang, 'hàng') };
    var daHien = hien && k.canhTren.every(function (c) { return c.lo > 0.5; });
    ra.canhTren = k.chia
      ? { tieuDe: 'Cạnh trên', chu: daHien && k.canhTren.every(function (c) { return !c.khong; })
        ? 'Gồm các đoạn ' + doan(k.cot) + ', mỗi đoạn là diện tích một mảnh chia cho $' + texDon(k.hang[0]) + '$. Cả cạnh là $' + texDa(k.cot) + '$.' + (k.thuc ? ' ' + voi + ', cạnh này dài ' + doDai(k.cot) + '.' : '')
        : 'Cạnh trên chưa biết. Mỗi mảnh có một cạnh $' + texDon(k.hang[0]) + '$, nên đoạn trên của mảnh là đơn thức nhân với $' + texDon(k.hang[0]) + '$ ra diện tích mảnh.' }
      : { tieuDe: 'Cạnh trên $' + texDa(k.cot) + '$', chu: canh(k.cot, 'cột') };
    var nhomLi = {};
    k.o.forEach(function (c) { if (!c.bo && !c.an) (nhomLi[c.li] = nhomLi[c.li] || []).push(c); });
    Object.keys(nhomLi).forEach(function (li) {
      var ds = nhomLi[li], c0 = ds[0], chu;
      if (k.chia) {
        var B = k.hang[0], q = k.cot[c0.j], dtj = k.dt[c0.j];
        chu = 'Diện tích $' + texDon(dtj) + '$, một cạnh $' + texDon(B) + '$. ';
        if (!(hien && k.canhTren[c0.j].lo > 0.5)) chu += 'Cạnh kia là đơn thức nhân với $' + texDon(B) + '$ ra $' + texDon(dtj) + '$.';
        else if (q.duoc === false) chu += 'Không có đơn thức nào nhân với $' + texDon(B) + '$ ra $' + texDon(dtj) + '$: số mũ của một biến ở số chia lớn hơn ở mảnh này, nên không chia hết.';
        else chu += 'Cạnh kia là $' + texDon(dtj) + ' : ' + texNgoac(B) + ' = ' + texDon(q) + '$, vì $' + texDon(B) + ' \\cdot ' + texNgoac(q) + ' = ' + texDon(dtj) + '$.';
      } else {
        chu = ds.map(function (c) { return '$' + texDon(k.hang[c.i]) + ' \\cdot ' + texNgoac(k.cot[c.j]) + ' = ' + texDon(c.tich) + '$'; }).join('; ') +
          '. Diện tích một mảnh bằng tích hai đoạn cạnh của nó.' + (k.thuc ? ' ' + voi + ': ' + ds.map(function (c) { return '$' + soT(gt(c.tich)) + '$'; }).join(', ') + '.' : '');
        if (ds.length > 1) chu += ' Các mảnh cùng màu có cùng phần biến (đồng dạng)' + (hien ? ', gộp lại được $' + texDa(gon(ds.map(function (c) { return c.tich; }))) + '$.' : ', nên gộp được.');
      }
      ra['loai' + li] = { tieuDe: ds.length > 1 ? ds.length + ' mảnh cùng màu' : 'Mảnh $' + texDon(c0.tich) + '$', chu: chu };
    });
    if (k.tong.s) {
      var conLai = k.o.filter(function (c) { return !c.bo && !c.an; }), du = conLai.length === k.o.length, chuT;
      if (!hien) chuT = k.chia ? 'Thương là điều em cần tìm: chia **từng** mảnh rồi cộng các đoạn.' : 'Tổng là điều em cần tìm: cộng mọi mảnh, gộp các mảnh cùng màu.';
      else if (k.ket < 0.5) chuT = 'Chạy hình tới cuối để xem ' + (k.chia ? 'thương.' : 'tổng.');
      else if (k.chia) chuT = 'Thương là tổng các đoạn của cạnh trên: $' + texDa(gon(k.cot)) + '$. Kiểm lại bằng phép nhân: $' + texDon(k.hang[0]) + '(' + texDa(gon(k.cot)) + ') = ' + texDa(k.dt) + '$.';
      else {
        var tichs = conLai.map(function (c) { return c.tich; });
        chuT = 'Cộng các mảnh, gộp các mảnh cùng màu: $' + texDa(gon(tichs)) + '$.';
        if (k.thuc && du) chuT += ' ' + voi + ': tổng các mảnh bằng $' + soT(cong(tichs.map(gt))) + '$, đúng bằng diện tích cả hình $' + soT(cong(k.hang.map(gt))) + ' \\cdot ' + soT(cong(k.cot.map(gt))) + '$.';
      }
      ra.tong = { tieuDe: k.chia ? 'Thương' : 'Tổng các mảnh', chu: chuT };
    }
    return ra;
  };

  // Cùng cảnh nhưng chỉ có thanh đổi x, cho đề chỉ có một biến (khỏi hiện thanh y thừa)
  var hcn = C.lay('hcnNhan');
  C.dangKi('hcnNhanX', { thamSo: { x: hcn.thamSo.x }, trangThai: hcn.trangThai, tinh: function (p, t, o) { return hcn.tinh(Object.assign({ y: hcn.thamSo.y.md }, p), t, o); } });
  C.lay('hcnNhanX').ve = function (svg, k, p, t, o) { return hcn.ve(svg, k, p, t, o); };
  C.lay('hcnNhanX').soi = function (k, p, o) { return hcn.soi(k, p, o); };
  // Cảnh của phần Nhìn bài 4, 5: như hcnNhanX, thêm thanh Thử phá đổi x thành số âm.
  // Hình vẫn vẽ theo x dương (độ dài không âm được), k.pha tính lại hai vế với x âm.
  C.dangKi('hcnNhanXPha', { thamSo: { x: hcn.thamSo.x, dau: { min: -1, max: 1, step: 2, md: 1, nhan: 'Dấu của x', pha: true } }, trangThai: hcn.trangThai,
    tinh: function (p, t, o) { return hcn.tinh(Object.assign({ y: hcn.thamSo.y.md }, p), t, o); } });
  C.lay('hcnNhanXPha').ve = function (svg, k, p, t, o) { return hcn.ve(svg, k, p, t, o); };
  C.lay('hcnNhanXPha').soi = function (k, p, o) { return hcn.soi(k, p, o); };

  // Cho test và nội dung dùng lại
  C.daiSo = { docDon: docDon, docDa: docDa, chuDon: chuDon, chuDa: chuDa, nhanDon: nhanDon, chiaDon: chiaDon, gon: gon, giaTri: giaTri, bacDon: bacDon, khoa: khoa };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
