// Tab 3 (Ví dụ): ví dụ mẫu hiện từng bước có "Vì sao?", rồi ví dụ mờ dần để em tự điền bước bị ẩn.
(function (T) {
  'use strict';
  var el = T.el;

  function stepItem(b) {
    var vi = el('div', { class: 'vi', hidden: true, html: T.md(b.vi || '') });
    var lam = el('div', { class: 'buoc-lam' }, el('div', { html: T.md(b.lam) }),
      b.vi ? el('button', { class: 'vi-sao', type: 'button', onclick: function () { vi.hidden = !vi.hidden; } }, 'Vì sao?') : null);
    return el('li', null, lam, vi);
  }

  function workedExample(c, vd, i) {
    var list = el('ol', { class: 'buoc-list' });
    var shown = 0;
    var next = el('button', { class: 'btn primary', type: 'button', onclick: function () { reveal(1); } }, 'Bước tiếp ▸');
    var all = el('button', { class: 'btn ghost', type: 'button', onclick: function () { reveal(vd.buoc.length); } }, 'Hiện hết');
    function reveal(n) {
      for (var k = 0; k < n && shown < vd.buoc.length; k++) list.appendChild(stepItem(vd.buoc[shown++]));
      if (shown >= vd.buoc.length) { next.disabled = true; all.disabled = true; next.textContent = 'Xong ✓'; }
    }
    var hinh = vd.hinh ? el('div', { class: 'q-hinh' }) : null;
    c.appendChild(el('div', { class: 'vidu' },
      el('h3', null, 'Ví dụ ' + (i + 1)), el('div', { html: T.md(vd.de) }), hinh, list,
      el('div', { class: 'stepper-actions' }, next, all)));
    if (hinh) T.mountWidget(hinh, vd.hinh.widget, vd.hinh.config);
    reveal(1);
  }

  // Ví dụ mờ dần: các bước thường hiện sẵn; bước "an" là câu hỏi; bước sau bước ẩn chỉ hiện khi đã điền đúng.
  function fadedExample(c, bai, vd, i) {
    var box = el('div', { class: 'vidu' }, el('h3', null, 'Em thử ' + (i + 1)), el('div', { html: T.md(vd.de) }));
    var hinhMo = vd.hinh ? box.appendChild(el('div', { class: 'q-hinh' })) : null;
    var list = el('ol', { class: 'buoc-list' });
    box.appendChild(list);
    c.appendChild(box);
    if (hinhMo) T.mountWidget(hinhMo, vd.hinh.widget, vd.hinh.config); // gắn sau khi box vào trang: JSXGraph cần tìm thấy phần tử
    (function showFrom(k) {
      for (; k < vd.buoc.length; k++) {
        var b = vd.buoc[k];
        if (!b.an) { list.appendChild(stepItem(b)); continue; }
        var li = el('li');
        list.appendChild(li);
        var resume = k + 1;
        T.mountQuestion(li, {
          id: 'vdm' + bai.id + '.' + i + '.' + k, de: b.vi || 'Em điền bước này:', dapAn: b.dapAn,
          goiY: b.goiY, loiGiai: [b.lam], loiThuongGap: b.loiThuongGap
        }, { record: false, onResult: (function (from) {
          var done = false;
          return function (r) { if (r.ok && !done) { done = true; showFrom(from); } };
        })(resume) });
        return;
      }
      list.appendChild(el('li', { class: 'xong' }, el('b', { style: 'color:var(--ok)' }, '✓ Hoàn thành!')));
    })(0);
  }

  T.tabs.viDu = function (c, bai) {
    (bai.viDu || []).forEach(function (vd, i) { workedExample(c, vd, i); });
    if ((bai.viDuMo || []).length) {
      c.appendChild(el('h2', { class: 'muc-h' }, 'Em thử điền bước còn thiếu'));
      bai.viDuMo.forEach(function (vd, i) { fadedExample(c, bai, vd, i); });
    }
  };
})(window.TOAN8);
