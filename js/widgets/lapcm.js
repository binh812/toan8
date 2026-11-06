// Widget "Lắp chứng minh": em chọn bước tiếp theo trong danh sách xáo trộn; thiếu căn cứ thì máy nói thiếu bước nào.
// cfg: { de, buoc: [{ id, chu, can: [id], canh?: { t, trangThai } }], ketLuan, canh?: cấu hình hình đi kèm }
(function (T) {
  'use strict';
  var el = T.el, L = T.lapCMLoi;

  T.widgets.lapCM = function (chua, cfg) {
    var daCo = [], vuong = 0, hinh = null;
    var hop = el('div', { class: 'lcm' });
    chua.appendChild(hop);
    if (cfg.de) hop.appendChild(el('div', { class: 'lcm-de', html: T.md(cfg.de) }));
    var hinhO = cfg.canh ? hop.appendChild(el('div', { class: 'lcm-hinh' })) : null;
    var bai = hop.appendChild(el('ol', { class: 'lcm-bai' }));
    var tin = hop.appendChild(el('p', { class: 'lcm-tin', role: 'status' }, 'Chọn bước tiếp theo trong danh sách dưới đây.'));
    var chon = hop.appendChild(el('div', { class: 'lcm-chon' }));
    var nut = hop.appendChild(el('div', { class: 'lcm-nut' }));
    if (hinhO) hinh = T.mountWidget(hinhO, 'canh', Object.assign({ chiXem: true }, cfg.canh));

    // Xếp theo chữ để thứ tự trên màn hình không lộ thứ tự đúng
    var thuTu = cfg.buoc.slice().sort(function (a, b) { return String(a.chu).localeCompare(String(b.chu), 'vi'); });
    function chuCua(id) { return (cfg.buoc.filter(function (b) { return b.id === id; })[0] || {}).chu || id; }
    function nhan(s) { return T.md(s).replace(/^<p>|<\/p>$/g, ''); }
    function datTin(lop, s) { tin.className = 'lcm-tin ' + lop; tin.innerHTML = nhan(s); }
    function veLai() {
      while (chon.firstChild) chon.removeChild(chon.firstChild);
      thuTu.forEach(function (b) {
        if (daCo.indexOf(b.id) >= 0) return;
        chon.appendChild(el('button', { class: 'lcm-the', type: 'button', 'data-id': b.id, html: nhan(b.chu), onclick: function () { lap(b.id); } }));
      });
      if (daCo.length === cfg.buoc.length) {
        datTin('dung', 'Xong! ' + cfg.ketLuan + (vuong ? ' (Em vướng ' + vuong + ' lần.)' : ''));
      }
    }
    function them(id) {
      daCo.push(id);
      bai.appendChild(el('li', { html: nhan(chuCua(id)) }));
      var b = cfg.buoc.filter(function (x) { return x.id === id; })[0];
      if (hinh && b.canh) { if (b.canh.trangThai !== undefined) hinh.datTrangThai(b.canh.trangThai); hinh.datT(b.canh.t != null ? b.canh.t : daCo.length / cfg.buoc.length); }
    }
    function lap(id) {
      var r = L.kiemBuoc(cfg, daCo, id);
      if (!r.ok) {
        vuong++;
        datTin('sai', 'Chưa lắp được: bước này cần có trước ' + r.thieu.map(function (c) { return '"' + chuCua(c) + '"'; }).join(' và ') + '.');
        var the = chon.querySelector('[data-id="' + id + '"]');
        if (the) { the.classList.add('vuong'); setTimeout(function () { the.classList.remove('vuong'); }, 600); }
        return;
      }
      them(id);
      datTin('', 'Đúng chỗ. Chọn bước tiếp theo.');
      veLai();
    }
    nut.appendChild(el('button', { class: 'btn ghost', type: 'button', onclick: function () {
      var ke = L.buocKeTiep(cfg, daCo);
      if (!ke.length) return;
      var the = chon.querySelector('[data-id="' + ke[0] + '"]');
      if (the) { the.classList.add('goi-y'); setTimeout(function () { the.classList.remove('goi-y'); }, 1500); }
      datTin('', 'Gợi ý: bước sáng lên là bước lắp được ngay.');
    } }, '💡 Gợi ý'));
    nut.appendChild(el('button', { class: 'btn ghost', type: 'button', onclick: function () {
      L.thuTuMau(cfg).forEach(function (id) { if (daCo.indexOf(id) < 0) them(id); });
      veLai();
    } }, 'Lắp mẫu'));
    nut.appendChild(el('button', { class: 'btn ghost', type: 'button', onclick: function () {
      daCo = []; vuong = 0;
      while (bai.firstChild) bai.removeChild(bai.firstChild);
      if (hinh) { hinh.datTrangThai(null); hinh.datT(0); }
      datTin('', 'Chọn bước tiếp theo trong danh sách dưới đây.');
      veLai();
    } }, 'Làm lại'));
    veLai();
    return { daCo: function () { return daCo.slice(); } };
  };
})(window.TOAN8);
