// Cái cân: phương trình ax + b = cx + d (ẩn mặc định là x, đổi bằng tuyChon.bien). Số dương là quả nặng, số âm là bóng bay kéo lên. Lệch = vế trái − vế phải khi thay x.
(function (C) {
  'use strict';
  function nghiemCua(s) {
    var a = s.trai.x - s.phai.x, b = s.phai.so - s.trai.so;
    return a === 0 ? null : b / a;
  }
  // Số trong $…$: dấu phẩy thập phân viết {,}
  function so(x) { return C.fmt(x).replace(',', '{,}'); }
  // Một vế viết cho KaTeX, như trong đề: 7 - 2x thay vì -2x + 7
  function vietTex(v) {
    var tx = v.x ? (Math.abs(v.x) === 1 ? '' : so(Math.abs(v.x))) + 'x' : '', ts = v.so ? so(Math.abs(v.so)) : '';
    if (v.x < 0 && v.so > 0) return ts + ' - ' + tx;
    var ra = tx ? (v.x < 0 ? '-' : '') + tx : '';
    if (ts) ra += ra ? (v.so < 0 ? ' - ' : ' + ') + ts : (v.so < 0 ? '-' : '') + ts;
    return ra || '0';
  }
  function giaTri(v, x) { return v.x * x + v.so; }
  function nhanVe(v, h) { return { x: v.x * h, so: v.so * h }; }
  // Thử phá: nhân hai vế với h. h khác 0 thì nghiệm giữ nguyên; h = 0 thì hai vế thành 0 = 0, mọi x đều là nghiệm
  function phaCua(goc, s0, s, h) {
    if (Math.abs(h) > 1e-9) {
      return { hong: false, h: h, chu: 'Nhân hai vế với $' + so(h) + '$ (khác $0$): hai đĩa thành $' + vietTex(nhanVe(s.trai, h)) + '$ và $' + vietTex(nhanVe(s.phai, h)) + '$. Cân vẫn chỉ thăng bằng khi ' +
        (goc === null ? 'không có $x$ nào: tập nghiệm không đổi.' : '$x = ' + so(goc) + '$: tập nghiệm không đổi.') };
    }
    var xt = goc === null ? 0 : goc + 3;
    return { hong: true, h: 0, xThu: xt, truoc: [giaTri(s0.trai, xt), giaTri(s0.phai, xt)],
      chu: 'Nhân hai vế với $0$: hai đĩa đều thành $0$, cân thăng bằng với **mọi** $x$. Thử $x = ' + so(xt) + '$: phương trình gốc cho vế trái $' + so(giaTri(s0.trai, xt)) + '$, vế phải $' + so(giaTri(s0.phai, xt)) +
        '$, không bằng nhau; nhân với $0$ thì cả hai thành $0$. Tập nghiệm đổi từ ' + (goc === null ? '$S = \\varnothing$' : '$S = \\{' + so(goc) + '\\}$') + ' thành mọi số, nên phương trình mới không còn cho biết $x$. Chia cho $0$ thì không làm được. Vì vậy quy tắc nhân đòi số **khác $0$**.' };
  }
  C.dangKi('caiCan', {
    thamSo: { nhan: { min: 0, max: 3, step: 0.5, md: 1, nhan: 'Nhân hai vế với', pha: true } },
    tinh: function (p, t, o) {
      var cacBuoc = [{ trai: o.trai, phai: o.phai }].concat(o.buoc || []);
      var goc = nghiemCua(cacBuoc[0]);
      cacBuoc.forEach(function (s, i) {
        var n = nghiemCua(s);
        if (n === null ? goc !== null : goc === null || Math.abs(n - goc) > 1e-9) throw new Error('caiCan: bước ' + i + ' làm đổi nghiệm');
      });
      var i = Math.min(cacBuoc.length - 1, Math.floor(t * cacBuoc.length));
      var s = cacBuoc[i], coThu = typeof p.thu === 'number' && isFinite(p.thu);
      var x = coThu ? p.thu : (goc === null ? 0 : goc);
      // Thử phá: nhân cả hai vế của bước đang xem với cùng một số (mặc định 1, tức là không đổi)
      var h = typeof p.nhan === 'number' && isFinite(p.nhan) ? p.nhan : 1, sh = { trai: nhanVe(s.trai, h), phai: nhanVe(s.phai, h) };
      return { trai: sh.trai, phai: sh.phai, nghiem: goc, buocHienTai: i, thu: coThu ? p.thu : null, xAm: x < 0,
        lech: (sh.trai.x - sh.phai.x) * x + (sh.trai.so - sh.phai.so), gia: !!o.anLucDau && t === 0,
        goc: { trai: s.trai, phai: s.phai }, pha: phaCua(goc, cacBuoc[0], s, h) };
    }
  });
  // Soi chi tiết: số đo chỉ hiện khi em đã gõ thử một số, để không lộ nghiệm ở bài tập
  C.lay('caiCan').soi = function (k, p, o) {
    if (k.gia) {
      var cho = { tieuDe: 'Cân còn trống', chu: 'Em tự đọc đề, nghĩ xem mỗi đĩa là vế nào, rồi bấm nút để đặt đề lên cân.' };
      return { trai: cho, phai: cho, don: cho };
    }
    var bien = o.bien || 'x', ve = function (v) { return vietTex(v).replace(/x/g, bien); };
    var duong = function (v) { return Math.max(0, v); }, am = function (v) { return Math.max(0, -v); };
    function dia(ten, v) {
      return { tieuDe: 'Đĩa ' + ten + ' (vế ' + ten + ')', chu: 'Đĩa ' + ten + ' là vế ' + ten + ' $' + ve(v) + '$. ' + (k.thu !== null
        ? 'Thay $' + bien + ' = ' + so(k.thu) + '$: đĩa nặng $' + so(giaTri(v, k.thu)) + '$.'
        : 'Mỗi khối cam là một $' + bien + '$, mỗi quả ghi $1$ nặng $1$, quả ghi $10$ nặng $10$.') };
    }
    var bang = Math.abs(k.lech) < 1e-9;
    return {
      trai: dia('trái', k.trai),
      phai: dia('phải', k.phai),
      khoiX: { tieuDe: 'Khối $' + bien + '$', chu: 'Mỗi khối cam nặng $' + bien + '$, là số chưa biết. Đĩa trái có $' + so(Math.abs(k.trai.x)) + '$ khối, đĩa phải có $' + so(Math.abs(k.phai.x)) + '$ khối.' + (k.xAm ? ' Ở đây $' + bien + '$ âm nên khối cũng kéo lên như bóng bay.' : '') },
      qua: { tieuDe: 'Quả nặng', chu: 'Quả ghi số nào thì nặng bấy nhiêu. Phần số dương: đĩa trái $' + so(duong(k.trai.so)) + '$, đĩa phải $' + so(duong(k.phai.so)) + '$. Bỏ cùng số quả ở **cả hai** đĩa thì cân vẫn như cũ: đó là chuyển vế.' },
      bong: { tieuDe: 'Bóng bay', chu: 'Bóng bay kéo đĩa lên, nên là số âm. Đĩa trái có $' + so(am(k.trai.so)) + '$, đĩa phải có $' + so(am(k.phai.so)) + '$. Thả thêm bấy nhiêu quả $1$ vào **cả hai** đĩa thì hết bóng mà cân không đổi.' },
      don: { tieuDe: 'Đòn cân', chu: bang ? 'Đòn nằm ngang: hai vế bằng nhau. Làm cùng một việc ở cả hai đĩa thì đòn vẫn nằm ngang.'
        : 'Đòn nghiêng về đĩa nặng hơn: vế trái trừ vế phải bằng $' + so(k.lech) + '$. Đòn chỉ nằm ngang khi thay đúng nghiệm.' }
    };
  };

  /* ---------- Phần vẽ: khung 100 × 70, trục ở giữa ---------- */
  var O = 5.2, MOI_HANG = 6;
  function viet(v, bien) {
    // Viết như trong đề: 7 − 2x thay vì −2x + 7
    var tx = v.x ? (Math.abs(v.x) === 1 ? '' : C.fmt(Math.abs(v.x))) + (bien || 'x') : '', ts = v.so ? C.fmt(Math.abs(v.so)) : '';
    if (v.x < 0 && v.so > 0) return ts + ' − ' + tx;
    var ra = tx ? (v.x < 0 ? '−' : '') + tx : '';
    if (ts) ra += ra ? (v.so < 0 ? ' − ' : ' + ') + ts : (v.so < 0 ? '−' : '') + ts;
    return ra || '0';
  }
  // Tách một vế thành các vật: x, quả 10, quả 1; số âm thành bóng bay
  function vatCua(v, xAm) {
    var nang = [], bong = [], i, tach = function (so, ds, duoi) {
      var chuc = duoi ? 0 : Math.floor(so / 10), don = Math.floor(so - chuc * 10), le = Math.round((so - chuc * 10 - don) * 100) / 100;
      for (i = 0; i < chuc; i++) ds.push('10');
      for (i = 0; i < don; i++) ds.push(duoi ? 'x' : '1');
      if (le) ds.push(C.fmt(le) + (duoi ? 'x' : ''));
    };
    // x âm thì khối x kéo lên như bóng bay, để cân luôn đúng về lực
    tach(Math.abs(v.x), (v.x > 0) !== xAm ? nang : bong, true);
    tach(Math.abs(v.so), v.so > 0 ? nang : bong, false);
    return { nang: nang, bong: bong };
  }
  function veDia(svg, cx, cy, v, xAm, bien, ben) {
    var vat = vatCua(v, xAm), mk = C.mk;
    mk('path', { d: 'M' + (cx - 17) + ' ' + cy + 'H' + (cx + 17) + 'L' + (cx + 13) + ' ' + (cy + 3) + 'H' + (cx - 13) + 'Z', fill: 'var(--tg)', 'data-soi': ben }, svg);
    var tungHang = function (i) { return { x: cx - (MOI_HANG - 1) * O / 2 + (i % MOI_HANG) * O, h: Math.floor(i / MOI_HANG) }; };
    vat.nang.forEach(function (ten, i) {
      var q = tungHang(i), y = cy - O - q.h * O;
      mk('rect', { x: q.x - O / 2 + 0.2, y: y + 0.2, width: O - 0.4, height: O - 0.4, rx: 0.5, fill: /x/.test(ten) ? 'var(--a)' : ten === '10' ? 'var(--muc)' : 'var(--tg)', 'data-soi': /x/.test(ten) ? 'khoiX' : 'qua' }, svg);
      C.chu(svg, q.x, y + O / 2, bien ? ten.replace('x', bien) : ten, ten.length > 2 ? 1.7 : 2.9, null, { style: 'fill:var(--mat)' });
    });
    var dinhVat = cy - O * Math.ceil(vat.nang.length / MOI_HANG);
    vat.bong.forEach(function (ten, i) {
      var q = tungHang(i), y = dinhVat - 8 - q.h * O;
      mk('line', { x1: q.x, y1: y + O / 2 - 0.2, x2: q.x, y2: dinhVat, stroke: 'var(--nhat)', 'stroke-width': 0.2 }, svg);
      mk('circle', { cx: q.x, cy: y, r: O / 2 - 0.1, fill: 'var(--b)', 'fill-opacity': 0.85, 'data-soi': /x/.test(ten) ? 'khoiX' : 'bong' }, svg);
      C.chu(svg, q.x, y, bien ? ten.replace('x', bien) : ten, ten.length > 2 ? 1.6 : 2.2, null, { style: 'fill:var(--mat)' });
    });
  }
  C.lay('caiCan').ve = function (svg, k, p, t, o) {
    var mk = C.mk, cao = 30, nua = 34, tam = 50, gia = o.anLucDau && t === 0;
    // Có bóng bay ở bước nào thì mới chừa chỗ phía trên; cả cảnh dùng một khung để hình không nhảy giữa các bước
    var coBong = [{ trai: o.trai, phai: o.phai }].concat(o.buoc || []).some(function (s) { return s.trai.x < 0 || s.trai.so < 0 || s.phai.x < 0 || s.phai.so < 0; });
    svg.setAttribute('viewBox', coBong || k.xAm ? '-3 -12 106 90' : '-3 14 106 64');
    // Đề lời văn: chưa bấm nút thì cân còn trống, để em tự lập phương trình trước
    if (gia) k = { trai: { x: 0, so: 0 }, phai: { x: 0, so: 0 }, lech: 0, thu: null, xAm: false };
    // Lệch thì nghiêng ít nhất 3°, để lệch nhỏ vẫn nhìn ra; vế nặng hơn đi xuống
    var goc = Math.abs(k.lech) < 1e-9 ? 0 : (k.lech > 0 ? 1 : -1) * C.kep(Math.abs(k.lech) * 3, 3, 14);
    var r = goc * Math.PI / 180, dx = nua * Math.cos(r), dy = nua * Math.sin(r);
    var trai = { x: tam - dx, y: cao + dy }, phai = { x: tam + dx, y: cao - dy }, treo = 22;
    mk('path', { d: 'M' + tam + ' ' + cao + 'L' + (tam - 8) + ' 66H' + (tam + 8) + 'Z', fill: 'var(--nhat)' }, svg);
    mk('line', { x1: trai.x, y1: trai.y, x2: phai.x, y2: phai.y, stroke: 'var(--muc)', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'data-soi': 'don' }, svg);
    [trai, phai].forEach(function (d) {
      mk('line', { x1: d.x, y1: d.y, x2: d.x - 16, y2: d.y + treo, stroke: 'var(--nhat)', 'stroke-width': 0.25 }, svg);
      mk('line', { x1: d.x, y1: d.y, x2: d.x + 16, y2: d.y + treo, stroke: 'var(--nhat)', 'stroke-width': 0.25 }, svg);
    });
    veDia(svg, trai.x, trai.y + treo, k.trai, !!k.xAm, o.bien, 'trai');
    veDia(svg, phai.x, phai.y + treo, k.phai, !!k.xAm, o.bien, 'phai');
    // Thử phá: nhân với 0 thì mọi vật trên đĩa biến mất; khung đứt nét đỏ là chỗ các vật vừa có
    if (k.pha && k.pha.hong && !gia) {
      [[trai, k.goc.trai], [phai, k.goc.phai]].forEach(function (d) {
        var vat = vatCua(d[1], !!k.xAm), n = vat.nang.length;
        if (!n) return;
        var w = Math.min(n, MOI_HANG) * O, h = Math.ceil(n / MOI_HANG) * O, cy = d[0].y + treo;
        mk('rect', { x: d[0].x - w / 2, y: cy - h, width: w, height: h, fill: 'none', stroke: 'var(--sai)', 'stroke-width': 0.4, 'stroke-dasharray': '1.2 0.8' }, svg);
        C.chu(svg, d[0].x, cy - h / 2, '× 0', 3.4, '--sai');
      });
      C.chu(svg, tam, 18, 'Nhân với 0: mọi ' + (o.bien || 'x') + ' đều làm cân thăng bằng', 3.4, '--sai');
    }
    var bang = Math.abs(k.lech) < 1e-9;
    // Số đã làm tròn thì ghi ≈, không ghi =
    var tron = [k.trai.x, k.trai.so, k.phai.x, k.phai.so].some(function (n) { return Math.abs(n * 100 - Math.round(n * 100)) > 1e-9; });
    C.chu(svg, tam, 73, gia ? 'Hai đĩa là hai vế nào?' : viet(k.trai, o.bien) + (bang ? (tron ? ' ≈ ' : ' = ') : ' ≠ ') + viet(k.phai, o.bien), 4.4, bang ? null : '--sai');
    if (k.xAm && !gia && k.thu == null) C.chu(svg, tam, 18, (o.bien || 'x') + ' âm nên khối ' + (o.bien || 'x') + ' cũng kéo lên', 3.2, '--nhat');
    if (k.thu != null) {
      var x = k.thu, vt = k.trai.x * x + k.trai.so, vp = k.phai.x * x + k.phai.so;
      C.chu(svg, trai.x, trai.y + treo + 7, C.fmt(vt), 3.4, bang ? '--cc' : '--sai');
      C.chu(svg, phai.x, phai.y + treo + 7, C.fmt(vp), 3.4, bang ? '--cc' : '--sai');
    }
  };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
