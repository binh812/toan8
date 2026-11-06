// Mảnh đại số: hằng đẳng thức nhìn thành diện tích các mảnh. Mỗi mảnh có dinh (4 đỉnh) để cả mảnh đang xoay cũng tính được diện tích.
(function (C) {
  'use strict';
  function manh(ten, x, y, w, h, dau, mau) { return { ten: ten, x: x, y: y, w: w, h: h, dau: dau, mau: mau, dinh: C.chuNhat({ x: x, y: y, w: w, h: h }) }; }
  // a−b phải dương mới vẽ được: khi b ≥ a thì giữ b nhỏ hơn a nửa đơn vị
  function hopLe(p) { return { a: p.a, b: Math.max(0.5, Math.min(p.b, p.a - 0.5)) }; }

  function tong(p, t) {
    var a = p.a, b = p.b, g = (a + b) * 0.1 * (1 - C.muot((t - 0.1) / 0.7));
    var m = [manh('a2', -g, -g, a, a, 1, '--a'), manh('ab1', a + g, -g, b, a, 1, '--cc'), manh('ab2', -g, a + g, a, b, 1, '--cc'), manh('b2', a + g, a + g, b, b, 1, '--b')];
    if (p.trangThai === 'thieuHaiManh') { m[1].an = true; m[2].an = true; }
    if (p.trangThai === 'thieuMotManh') m[2].an = true;
    if (p.trangThai === 'thieuManhB') m[3].an = true;
    return { a: a, b: b, manh: m, khung: { w: a + b, h: a + b }, pha: phaTong(a, b, p.dau) };
  }
  // Thử phá: b âm. Hình vẫn vẽ theo b dương; k.pha tính lại hai vế với b âm
  function so(x) { return String(+x.toFixed(6)).replace('.', '{,}'); }
  function soN(x) { return x < 0 ? '(' + so(x) + ')' : so(x); }
  function phaTong(a, b, dau) {
    var am = dau != null && dau < 0, bs = am ? -b : b, ve = (a + bs) * (a + bs), ab2 = 2 * a * bs;
    var dong = '$(' + so(a) + ' + ' + soN(bs) + ')^2 = ' + so(ve) + '$ và $a^2 + 2ab + b^2 = ' + so(a * a) + (ab2 < 0 ? ' - ' : ' + ') + so(Math.abs(ab2)) + ' + ' + so(bs * bs) + ' = ' + so(ve) + '$';
    if (!am) return { hong: false, chu: 'Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: ' + dong + '.' };
    var cuoi = a + bs > 0 ? ' Với $b$ âm, $(a + b)^2$ chính là bình phương của một hiệu, $(' + so(a) + ' - ' + so(b) + ')^2$: hình vuông $a^2$ bị cắt bớt hai dải, như hình ở phần Suy ra.' : '';
    return { hong: true, chiHinh: true, chu: 'Hình không dựng được: với $b = ' + so(bs) + '$, mảnh $ab = ' + so(a) + ' \\cdot ' + soN(bs) + ' = ' + so(a * bs) + '$ có diện tích âm, mảnh $b^2$ có cạnh âm: không có mảnh nào như thế. ' +
      'Viền đỏ đứt đánh dấu các mảnh có cạnh âm (khác mảnh âm ở bài 2, 3, là mảnh có thật được trừ đi). Công thức thì vẫn đúng: ' + dong + '.' + cuoi };
  }
  function hieu(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b;
    var m = [manh('a2', 0, 0, a, a, 1, '--a'), manh('ab1', r, 0, b, a, -1, '--cc'), manh('ab2', 0, r, a, b, -1, '--cc'), manh('b2', r, r, b, b, 1, '--b')];
    m[1].hien = C.muot((t - 0.15) / 0.25); m[2].hien = C.muot((t - 0.4) / 0.25); m[3].hien = C.muot((t - 0.7) / 0.25);
    return { a: a, b: b, manh: m, khung: { w: a, h: a }, conLai: { x: 0, y: 0, w: r, h: r } };
  }
  function hieuHaiBP(p, t) {
    var q = hopLe(p), a = q.a, b = q.b, r = a - b, k = C.muot((t - 0.25) / 0.6);
    // Mảnh dưới (rộng a−b, cao b) xoay 90° sang bên phải mảnh trên
    // Trượt ngang ra khỏi mảnh trên trước, rồi mới xoay và nhấc lên, để hai mảnh không đè nhau
    var ngang = C.muot(k / 0.5), xoay = C.muot((k - 0.5) / 0.5);
    var tx = C.noiSuy(r / 2, a + b / 2, ngang), ty = C.noiSuy(r + b / 2, r / 2, xoay), goc = xoay * Math.PI / 2;
    var cs = Math.cos(goc), sn = Math.sin(goc);
    var dinh = [[-r / 2, -b / 2], [r / 2, -b / 2], [r / 2, b / 2], [-r / 2, b / 2]].map(function (d) { return [tx + d[0] * cs - d[1] * sn, ty + d[0] * sn + d[1] * cs]; });
    return { a: a, b: b, manh: [manh('tren', 0, 0, a, r, 1, '--a'), { ten: 'duoi', dau: 1, mau: '--b', dinh: dinh }],
      khung: { w: a + b, h: a }, lo: { x: r, y: r, w: b, h: b, hien: 1 - C.muot(t / 0.2) } };
  }
  C.dangKi('manhVuong', {
    thamSo: { a: { min: 1, max: 6, step: 0.5, md: 4, nhan: 'Cạnh a', mau: '--a' }, b: { min: 1, max: 6, step: 0.5, md: 2, nhan: 'Cạnh b', mau: '--b' },
      dau: { min: -1, max: 1, step: 2, md: 1, nhan: 'Dấu của b', pha: true, hienSo: function (v) { return v < 0 ? 'b < 0' : 'b > 0'; } } },
    trangThai: { thieuHaiManh: true, thieuMotManh: true, thieuManhB: true },
    tinh: function (p, t, o) {
      var dang = (o && o.dang) || 'tong';
      if (dang === 'tong') return tong(p, t);
      if (dang === 'hieu') return hieu(p, t);
      if (dang === 'hieuHaiBP') return hieuHaiBP(p, t);
      throw new Error('manhVuong: dạng lạ ' + dang);
    }
  });

  /* ---------- Phần vẽ ---------- */
  function veManh(svg, m, co, nhan, them) {
    var g = C.mk('g', them || {}, svg);
    C.mk('polygon', { points: C.diem(m.dinh), fill: 'var(' + m.mau + ')', 'fill-opacity': 0.3, stroke: 'var(--muc)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, g);
    if (nhan) {
      var x = 0, y = 0; m.dinh.forEach(function (q) { x += q[0] / 4; y += q[1] / 4; });
      C.chu(g, x, y, nhan, co, m.mau);
    }
    return g;
  }
  C.lay('manhVuong').ve = function (svg, k, p, t, o) {
    var dang = o.dang || 'tong', nh = o.nhan || {}, tenA = o.tenA || 'a', tenB = o.tenB || 'b', a = k.a, b = k.b;
    var ab = nh.ab || (tenA + tenB), a2 = nh.a2 || (tenA + '²'), b2 = nh.b2 || (tenB + '²');
    // nhan.an: chưa giải thì hai cạnh của hình chữ nhật ghép lại ghi '?'
    var anCanh = nh.an && p.trangThai !== 'giai';
    var rong = k.khung.w, cao = k.khung.h, l = Math.max(rong, cao), lech = dang === 'tong' ? 0.1 * l : 0, d = (dang === 'hieuHaiBP' ? 0.22 : 0.14) * l + lech, co = 0.072 * l;
    svg.setAttribute('viewBox', [-d, -d, rong + 2 * d, cao + 2 * d].join(' '));
    var nhCanh = { 'font-style': 'italic' };
    if (dang === 'tong') {
      k.manh.forEach(function (m) {
        // o.anAb: chưa làm thì hai mảnh giữa ghi dấu hỏi, để em tự tính
        var chu = m.ten === 'a2' ? a2 : m.ten === 'b2' ? b2 : o.anAb && t < 1 && !m.an && !p.trangThai ? '?' : ab;
        if (!m.an) { veManh(svg, m, co, chu, { 'data-soi': m.ten === 'a2' || m.ten === 'b2' ? m.ten : 'ab' }); return; }
        // Mảnh bị thiếu: chỉ còn viền đứt, để thấy ngay chỗ trống
        C.mk('polygon', { points: C.diem(m.dinh), fill: 'none', stroke: 'var(--sai)', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4' }, svg);
        var x = 0, y = 0; m.dinh.forEach(function (q) { x += q[0] / 4; y += q[1] / 4; });
        C.chu(svg, x, y, 'thiếu ' + chu, co * 0.85, '--sai');
      });
      // Thử phá: mảnh có cạnh b âm thì viền đỏ đứt, vì không có mảnh nào như thế
      if (k.pha && k.pha.hong) k.manh.forEach(function (m) {
        if (m.ten !== 'a2' && !m.an) C.mk('polygon', { points: C.diem(m.dinh), fill: 'var(--sai)', 'fill-opacity': 0.12, stroke: 'var(--sai)', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '7 4' }, svg);
      });
      var g = lech * (1 - C.muot((t - 0.1) / 0.7)), gc = C.mk('g', { 'data-soi': 'canh' }, svg);
      C.chu(gc, a / 2, -g - d * 0.35, tenA, co, '--a', nhCanh);
      C.chu(gc, a + g + b / 2, -g - d * 0.35, tenB, co, '--b', nhCanh);
      C.chu(gc, -g - d * 0.35, a / 2, tenA, co, '--a', nhCanh);
      C.chu(gc, -g - d * 0.35, a + g + b / 2, tenB, co, '--b', nhCanh);
    } else if (dang === 'hieu') {
      veManh(svg, k.manh[0], co, null);
      var r = k.conLai.w;
      k.manh.slice(1, 3).forEach(function (m) {
        var mo = C.mk('g', { opacity: m.hien }, svg);
        C.mk('polygon', { points: C.diem(m.dinh), fill: 'var(--mat)', 'fill-opacity': 0.75, stroke: 'var(--sai)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4' }, mo);
      });
      var b2m = k.manh[3];
      veManh(svg, b2m, co * 0.8, '+' + b2, { opacity: b2m.hien });
      // Chưa cắt thì cạnh là a; cắt dải đầu tiên rồi mới lộ phần a−b còn lại
      C.chu(svg, a / 2, -d * 0.35, tenA, co, '--a', Object.assign({ opacity: 1 - k.manh[1].hien }, nhCanh));
      C.chu(svg, r / 2, -d * 0.35, nh.hieu || (tenA + '−' + tenB), co, '--a', Object.assign({ opacity: k.manh[1].hien }, nhCanh));
      C.chu(svg, r + b / 2, -d * 0.35, tenB, co, '--b', Object.assign({ opacity: k.manh[1].hien }, nhCanh));
      C.chu(svg, r + b / 2, r / 2, '−' + ab, co * 0.8, '--sai', { opacity: k.manh[1].hien });
      C.chu(svg, r / 2, r + b / 2, '−' + ab, co * 0.8, '--sai', { opacity: k.manh[2].hien });
      C.chu(svg, r / 2, r / 2, a2, co, '--a', { opacity: 1 - C.muot((t - 0.8) / 0.2) });
      var mc = C.muot((t - 0.8) / 0.2);
      C.mk('rect', { width: r, height: r, fill: 'none', stroke: 'var(--muc)', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke', opacity: mc }, svg);
      C.chu(svg, r / 2, r / 2, '(' + (nh.hieu || (tenA + '−' + tenB)) + ')²', co, '--a', { opacity: mc });
    } else {
      var lo = k.lo, xa = a - b, ket = C.muot((t - 0.85) / 0.15);
      C.mk('rect', { x: lo.x, y: lo.y, width: lo.w, height: lo.h, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '6 4', opacity: lo.hien }, svg);
      C.chu(svg, lo.x + lo.w / 2, lo.y + lo.h / 2, 'bỏ ' + b2, co * 0.8, '--sai', { opacity: lo.hien });
      k.manh.forEach(function (m) { veManh(svg, m, co, null); });
      C.chu(svg, a / 2, -d * 0.35, tenA, co, '--a', Object.assign({ opacity: 1 - ket }, nhCanh));
      // Hai cạnh mới chỉ hiện khi đã ghép xong, kẻo lộ đáp án từ đầu
      C.chu(svg, a / 2, xa / 2, a2 + ' − ' + b2, co * 0.85, '--a', { opacity: 1 - ket });
      C.chu(svg, lo.x + lo.w + d * 0.3, lo.y + lo.h / 2, tenB, co, '--b', Object.assign({ opacity: lo.hien }, nhCanh));
      C.chu(svg, (a + b) / 2, -d * 0.35, anCanh ? '?' : nh.tong || (tenA + '+' + tenB), co, '--muc', Object.assign({ opacity: ket }, nhCanh));
      C.chu(svg, -d * 0.5, xa / 2, anCanh ? '?' : nh.hieu || (tenA + '−' + tenB), co, '--muc', Object.assign({ opacity: ket }, nhCanh));
    }
  };
  // Soi (dạng tổng): ba loại mảnh và cạnh hình vuông lớn. Đề đặt tên cạnh riêng (tenA, tenB) thì hình chỉ là mô hình, không ghi số đo.
  // o.anAb mà em chưa giải: không nói diện tích mảnh giữa.
  function tex(s) { return String(s).replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/·/g, ' \\cdot '); }
  C.lay('manhVuong').tieuDePha = 'Thử số âm: hình không vẽ được, công thức vẫn đúng';
  C.lay('manhVuong').soi = function (k, p, o) {
    if ((o.dang || 'tong') !== 'tong') return {};
    var ra = soiTong(k, p, o);
    // Đang thử số âm: số đo trong thẻ là của hình đang vẽ (b dương)
    if (p.dau != null && p.dau < 0) Object.keys(ra).forEach(function (kh) { ra[kh].chu += ' (Hình vẽ theo độ dài $|b| = ' + so(k.b) + '$; với $b$ âm xem ô báo vàng.)'; });
    return ra;
  };
  function soiTong(k, p, o) {
    var a = k.a, b = k.b, nh = o.nhan || {}, A = tex(o.tenA || 'a'), B = tex(o.tenB || 'b'), coSo = !o.tenA && !o.tenB;
    var vab = o.anAb && p.trangThai !== 'giai', ab = tex(nh.ab || (A + B)), a2 = tex(nh.a2 || A + '^2'), b2 = tex(nh.b2 || B + '^2');
    var voi = function (s, x) { return coSo ? ' Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: $' + s + ' = ' + so(x) + '$.' : ''; };
    return {
      a2: { tieuDe: 'Hình vuông $' + a2 + '$', chu: 'Hai cạnh đều là $' + A + '$, nên diện tích là $' + A + ' \\cdot ' + A + ' = ' + a2 + '$.' + voi('a^2', a * a) },
      b2: { tieuDe: 'Hình vuông $' + b2 + '$', chu: 'Hai cạnh đều là $' + B + '$, nên diện tích là $' + B + ' \\cdot ' + B + ' = ' + b2 + '$.' + voi('b^2', b * b) },
      ab: { tieuDe: 'Mảnh chữ nhật', chu: vab ? 'Một cạnh bằng cạnh hình vuông $' + a2 + '$, cạnh kia bằng cạnh hình vuông $' + b2 + '$. Diện tích là tích hai cạnh.'
        : 'Một cạnh $' + A + '$, một cạnh $' + B + '$: diện tích $' + ab + '$.' + voi('ab', a * b) + ' Có **hai** mảnh như thế, một bên phải, một bên dưới, nên trong công thức có $2 \\cdot ' + ab + '$.' },
      canh: { tieuDe: 'Cạnh hình vuông lớn', chu: 'Mỗi cạnh gồm một đoạn $' + A + '$ và một đoạn $' + B + '$, nên dài $' + A + ' + ' + B + '$. Diện tích hình vuông lớn là $(' + A + ' + ' + B + ')^2$, cũng bằng tổng các mảnh ghép khít bên trong.' +
        (coSo ? ' Với $a = ' + so(a) + '$, $b = ' + so(b) + '$: $(a + b)^2 = ' + so((a + b) * (a + b)) + '$.' : '') }
    };
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
