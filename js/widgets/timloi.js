// Tab 5 (Tìm lỗi sai): lời giải của "bạn Nam" có một dòng sai; em bấm vào dòng sai để xem giải thích.
(function (T) {
  'use strict';
  var el = T.el;

  T.tabs.timLoi = function (c, bai) {
    c.appendChild(el('p', null, 'Mỗi lời giải dưới đây có một dòng bị sai. Em bấm vào dòng mà em cho là sai nhé!'));
    (bai.timLoi || []).forEach(function (tl, i) {
      var note = el('div', { class: 'fb', hidden: true, role: 'status', 'aria-live': 'polite' });
      var lines = el('div');
      var found = false;
      tl.loiGiaiSai.forEach(function (dong, k) {
        var b = el('button', { class: 'dong', type: 'button', html: T.md(dong) });
        b.addEventListener('click', function () {
          if (found) return;
          note.hidden = false;
          if (k === tl.dongSai) {
            found = true;
            b.classList.add('loi');
            note.className = 'fb dung';
            note.innerHTML = '✔ Đúng rồi, dòng này sai! ' + T.md(tl.giaiThich).replace(/^<p>|<\/p>$/g, '') +
              (tl.sua ? '<div style="margin-top:6px"><b>Sửa lại:</b> ' + T.md(tl.sua).replace(/^<p>|<\/p>$/g, '') + '</div>' : '');
          } else if (k > tl.dongSai) {
            // dòng sau dòng sai thường "sai theo" vì dựa vào kết quả sai – không gọi là đúng
            note.className = 'fb saiDang';
            note.textContent = 'Dòng này có thể đã sai theo, nhưng lỗi bắt đầu từ một dòng phía trên. Em tìm lên trên nhé!';
          } else {
            b.classList.add('dung-roi');
            note.className = 'fb saiDang';
            note.textContent = 'Dòng này đúng rồi. Em tìm tiếp nhé!';
          }
        });
        lines.appendChild(b);
      });
      var hinh = tl.hinh ? el('div', { class: 'q-hinh' }) : null;
      c.appendChild(el('div', { class: 'q timloi' },
        el('div', { class: 'q-de', html: '<b>Bài ' + (i + 1) + '.</b> ' + T.md(tl.de).replace(/^<p>|<\/p>$/g, '') }), hinh,
        el('div', { class: 'nam' }, el('span', { class: 'av' }, '🧑'), 'Lời giải của bạn:'),
        lines, note));
      if (hinh) T.mountWidget(hinh, tl.hinh.widget, tl.hinh.config);
    });
  };
})(window.TOAN8);
