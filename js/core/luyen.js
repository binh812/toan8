// Lõi "Luyện thêm": mức thích ứng, chọn dạng bài, sinh câu từ hạt giống. Thuần JS, dùng được trong Node (kiểm thử, validator).
(function (root, factory) {
  var node = typeof module === 'object' && module.exports;
  var m = factory(node ? require('./rng.js') : { taoRng: root.TOAN8.taoRng });
  if (node) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.luyenLoi = m; }
})(typeof self !== 'undefined' ? self : this, function (rng) {
  'use strict';
  var LEN = 3, XEM = 2;

  // tt: { muc, dungLien, xemLien }; kq: 'dung' | 'sai2' | 'xemLoiGiai'
  function mucTiepTheo(tt, kq) {
    var t = { muc: tt.muc, dungLien: tt.dungLien, xemLien: tt.xemLien };
    if (kq === 'dung') {
      t.dungLien++; t.xemLien = 0;
      if (t.dungLien >= LEN && t.muc < 3) { t.muc++; t.dungLien = 0; }
    } else if (kq === 'sai2') {
      t.muc = Math.max(1, t.muc - 1); t.dungLien = 0; t.xemLien = 0;
    } else {
      t.dungLien = 0; t.xemLien++;
      if (t.xemLien >= XEM) { t.muc = Math.max(1, t.muc - 1); t.xemLien = 0; }
    }
    return t;
  }

  // Một câu: sai từ 2 lần trở lên → 'sai2'; phải xem lời giải hoặc bỏ qua → 'xemLoiGiai'; còn lại 'dung'
  function ketQuaCau(c) {
    if (c.soLanSai >= 2) return 'sai2';
    if (c.xemLoiGiai || !c.dung) return 'xemLoiGiai';
    return 'dung';
  }

  // Mỗi dạng sinh là một nguồn; mỗi câu soạn sẵn (deCo) cũng là một nguồn trả về chính nó.
  function danhSachNguon(goi) {
    var out = (goi.dang || []).map(function (d) { return { ten: d.ten, muc: d.muc, sinh: d.sinh }; });
    (goi.deCo || []).forEach(function (q) { out.push({ ten: q.id, muc: q.muc, coDinh: true, cau: q }); });
    return out;
  }

  // Ưu tiên đúng mức, không có thì mức gần nhất; tránh lặp nguồn vừa ra khi còn lựa chọn khác.
  function chonNguon(nguon, muc, tenTruoc, r) {
    var kc = function (n) { return Math.abs(n.muc - muc); };
    var best = Math.min.apply(null, nguon.map(kc));
    var hop = nguon.filter(function (n) { return kc(n) === best; });
    var khac = hop.filter(function (n) { return n.ten !== tenTruoc; });
    return r.chon(khac.length ? khac : hop);
  }

  function sinhCau(nguon, seed, cc, baiId) {
    var q = nguon.coDinh ? nguon.cau : nguon.sinh(rng.taoRng(seed), cc);
    var out = {};
    for (var k in q) out[k] = q[k];
    out.id = nguon.coDinh ? q.id : 'L' + baiId + '-' + seed;
    out.muc = nguon.muc;
    return out;
  }

  return { mucTiepTheo: mucTiepTheo, ketQuaCau: ketQuaCau, danhSachNguon: danhSachNguon, chonNguon: chonNguon, sinhCau: sinhCau };
});
