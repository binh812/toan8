// Tab 1 (Khám phá) và tab 2 (Lý thuyết).
(function (T) {
  'use strict';
  var el = T.el;

  T.tabs.lyThuyet = function (c, bai) {
    (bai.lyThuyet || []).forEach(function (k) {
      if (k.loai === 'lapCM') {
        var hop = el('div', { class: 'the lap-cm' }, el('h3', { html: T.mdInline(k.tieuDe || 'Lắp chứng minh') }));
        c.appendChild(hop);
        T.mountWidget(hop, 'lapCM', k.config);
        return;
      }
      if (k.loai === 'hinh') {
        var box = el('div', { class: 'the hinh' });
        c.appendChild(box);
        T.mountWidget(box, k.widget, k.config, { tuChay: true });
        if (k.chuThich) box.appendChild(el('div', { class: 'chu-thich', html: T.md(k.chuThich) }));
        return;
      }
      c.appendChild(el('div', { class: 'the ' + (k.loai || 'text'), html: (k.tieuDe ? '<h3>' + T.mdInline(k.tieuDe) + '</h3>' : '') + T.md(k.noiDung) }));
    });
  };

  T.tabs.khamPha = function (c, bai) {
    var kp = bai.khamPha || {};
    if (bai.nhin) {
      T.nhin(c, bai);
      if (!kp.nhiemVu) return;
      c.appendChild(el('h2', { class: 'muc-h' }, 'Tự kéo thử'));
    }
    c.appendChild(el('div', { class: 'nhiem-vu', html: '<b>Nhiệm vụ:</b> ' + T.md(kp.nhiemVu).replace(/^<p>|<\/p>$/g, '') }));
    if (kp.widget) {
      var box = el('div', { class: 'widget' });
      c.appendChild(box);
      T.mountWidget(box, kp.widget, kp.config, { tuChay: true });
    }
    if (kp.cauHoi) {
      c.appendChild(el('h2', { class: 'muc-h' }, 'Em rút ra được gì?'));
      T.mountQuestion(c, {
        id: 'kp' + bai.id, de: kp.cauHoi.de, dapAn: kp.cauHoi.dapAn,
        goiY: kp.cauHoi.goiY, loiGiai: kp.cauHoi.loiGiai || []
      }, { record: false });
    }
  };
})(window.TOAN8);
