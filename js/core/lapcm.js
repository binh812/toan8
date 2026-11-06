// Lõi "Lắp chứng minh": mỗi bước có các căn cứ (can) phải có trước. Thuần JS, dùng được trong Node (kiểm thử, validator).
// Ý tưởng kiểm thứ tự theo "needs" phỏng theo nclamvn/bai-giang (MIT, © 2026 Nguyễn Cảnh Lâm), tools/robotics/kit/lap.js.
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.lapCMLoi = m; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function timBuoc(cm, id) { return cm.buoc.filter(function (b) { return b.id === id; })[0] || null; }

  // Thêm bước id được không, khi đã có các bước trong daCo (mảng id)? Trả về các căn cứ còn thiếu.
  function kiemBuoc(cm, daCo, id) {
    var b = timBuoc(cm, id);
    if (!b) return { ok: false, thieu: [], la: true };
    var thieu = (b.can || []).filter(function (c) { return daCo.indexOf(c) < 0; });
    return { ok: thieu.length === 0, thieu: thieu };
  }

  // Một thứ tự lắp đúng: giữ thứ tự soạn khi có thể. Trả về null nếu căn cứ vòng tròn.
  function thuTuMau(cm) {
    var ra = [], con = cm.buoc.map(function (b) { return b.id; });
    while (con.length) {
      var duoc = con.filter(function (id) { return kiemBuoc(cm, ra, id).ok; })[0];
      if (duoc === undefined) return null;
      ra.push(duoc);
      con.splice(con.indexOf(duoc), 1);
    }
    return ra;
  }

  // Bước có thể lắp tiếp ngay (dùng cho nút Gợi ý)
  function buocKeTiep(cm, daCo) {
    return cm.buoc.filter(function (b) { return daCo.indexOf(b.id) < 0 && kiemBuoc(cm, daCo, b.id).ok; }).map(function (b) { return b.id; });
  }

  // Lỗi dữ liệu: id trùng, căn cứ không có thật, tự làm căn cứ cho mình, vòng tròn, thiếu chữ
  function kiemDuLieu(cm) {
    var loi = [], thay = {};
    if (!cm || !Array.isArray(cm.buoc) || cm.buoc.length < 2) return ['cần ít nhất 2 bước'];
    cm.buoc.forEach(function (b, i) {
      if (!b.id) loi.push('bước ' + i + ' thiếu id');
      else if (thay[b.id]) loi.push('id trùng: ' + b.id);
      thay[b.id] = true;
      if (!b.chu) loi.push('bước ' + (b.id || i) + ' thiếu chu');
    });
    cm.buoc.forEach(function (b) {
      (b.can || []).forEach(function (c) {
        if (c === b.id) loi.push('bước ' + b.id + ' tự làm căn cứ cho mình');
        else if (!thay[c]) loi.push('bước ' + b.id + ' cần căn cứ không có: ' + c);
      });
    });
    if (!loi.length && !thuTuMau(cm)) loi.push('căn cứ vòng tròn, không lắp được');
    if (!cm.ketLuan) loi.push('thiếu ketLuan');
    return loi;
  }

  return { kiemBuoc: kiemBuoc, thuTuMau: thuTuMau, buocKeTiep: buocKeTiep, kiemDuLieu: kiemDuLieu };
});
