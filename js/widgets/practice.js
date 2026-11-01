// Thẻ câu hỏi: nhập đáp án → chấm → phản hồi (đúng / sai / sai dạng / lỗi thường gặp), gợi ý 3 nấc, lời giải.
(function (T) {
  'use strict';
  var el = T.el;

  function choiceGroup(items) {
    var val = null, wrap = el('div', { class: 'choices', role: 'radiogroup' });
    items.forEach(function (it) {
      var b = el('button', { class: 'choice', type: 'button', html: T.md(it.label), onclick: function () {
        val = it.value;
        [].forEach.call(wrap.children, function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
      } });
      wrap.appendChild(b);
    });
    return { el: wrap, getValue: function () { return val; }, onEnter: function () {} };
  }

  function answerControl(d) {
    if (d.kieu === 'chon') return choiceGroup(d.luaChon.map(function (c, i) { return { label: c, value: i }; }));
    if (d.kieu === 'dungSai') return choiceGroup([{ label: 'Đúng', value: true }, { label: 'Sai', value: false }]);
    if (d.kieu === 'nhieuO') {
      var subs = d.o.map(function (sub) { return T.mathInput({ kieu: sub.kieu }); });
      var g = el('div', { class: 'nhieu-o' });
      subs.forEach(function (s, i) { g.appendChild(el('label', { class: 'o' }, el('span', { html: T.md(d.o[i].nhan || ('Ô ' + (i + 1))) }), s.el)); });
      return {
        el: g, subs: subs,
        getValue: function () { return subs.map(function (s) { return s.getValue(); }); },
        onEnter: function (fn) { subs.forEach(function (s) { s.onEnter(fn); }); }
      };
    }
    return T.mathInput({ kieu: d.kieu });
  }

  function isEmpty(v) {
    if (v == null) return true;
    if (typeof v === 'string') return !v.trim();
    if (Array.isArray(v)) return v.every(isEmpty);
    return false;
  }

  // q: { id, muc?, de, hinh?:{widget,config}, dapAn, goiY?:[], loiGiai:[], loiThuongGap?:[] }
  // opts: { record: ghi vào tiến độ?, onResult?: fn(kết quả) }
  T.mountQuestion = function (container, q, opts) {
    opts = opts || { record: true };
    var hints = q.goiY || [], hintMax = hints.length + 1, level = 0;
    var ctl = answerControl(q.dapAn);
    var fb = el('div', { class: 'fb', hidden: true, role: 'status', 'aria-live': 'polite' });
    var hintBox = el('div', { class: 'hints' });
    var hintBtn = el('button', { class: 'btn ghost', type: 'button', onclick: showHint });
    var card = el('div', { class: 'q muc' + (q.muc || 1) },
      el('div', { class: 'q-de', html: (q.muc ? '<span class="muc-tag">Mức ' + q.muc + '</span>' : '') + T.md(q.de) }),
      q.hinh ? el('div', { class: 'q-hinh' }) : null,
      el('div', { class: 'q-input' }, ctl.el, el('button', { class: 'btn primary', type: 'button', onclick: check }, 'Kiểm tra')),
      fb, el('div', { class: 'q-actions' }, hintBtn), hintBox);
    container.appendChild(card);
    if (q.hinh) T.mountWidget(card.querySelector('.q-hinh'), q.hinh.widget, q.hinh.config);
    ctl.onEnter(check);
    updateHintBtn();
    var st = opts.record ? T.store.exState(q.id) : null;
    if (st && st.correct) card.classList.add('done');

    function updateHintBtn() {
      hintBtn.textContent = level < hints.length ? '💡 Gợi ý (' + (level + 1) + '/' + hintMax + ')'
        : level === hints.length ? '📖 Xem lời giải' : 'Đã hiện lời giải';
      hintBtn.disabled = level >= hintMax;
    }
    function showHint() {
      if (level >= hintMax) return;
      level++;
      if (level <= hints.length) hintBox.appendChild(el('div', { class: 'hint', html: '<b>Gợi ý ' + level + ':</b> ' + T.md(hints[level - 1]) }));
      else hintBox.appendChild(solution());
      updateHintBtn();
    }
    function solution() {
      var s = el('div', { class: 'loigiai' }, el('h4', null, 'Lời giải'));
      (q.loiGiai || []).forEach(function (b) { s.appendChild(el('div', { class: 'buoc', html: T.md(b) })); });
      return s;
    }
    function show(r) {
      fb.hidden = false;
      fb.className = 'fb ' + r.code;
      fb.innerHTML = (r.ok ? '✔ ' : r.code === 'saiDang' ? '◐ ' : r.code === 'khongDoc' ? '? ' : '✘ ') + T.md(r.msg).replace(/^<p>|<\/p>$/g, '');
      if (r.ok && level < hintMax && (q.loiGiai || []).length)
        fb.appendChild(el('button', { class: 'link', type: 'button', onclick: function () { hintBox.appendChild(solution()); this.remove(); } }, 'Xem lời giải mẫu'));
    }
    function check() {
      var v = ctl.getValue();
      if (isEmpty(v)) { show({ ok: false, code: 'khongDoc', msg: 'Em chưa nhập đáp án.' }); return; }
      var r;
      try { r = T.checker.checkAnswer(q.dapAn, v, q.loiThuongGap); }
      catch (e) { console.error('Lỗi chấm câu ' + q.id, e); r = { ok: false, code: 'khongDoc', msg: 'Máy chưa đọc được đáp án này. Em kiểm tra lại cách viết nhé.' }; }
      show(r);
      if (r.tungO && ctl.subs) ctl.subs.forEach(function (s, i) { s.el.classList.toggle('o-sai', !r.tungO[i].ok); });
      if (opts.record && r.code !== 'khongDoc') T.store.recordAttempt(q.id, { ok: r.ok, hintLevel: level, hintMax: hintMax });
      if (r.ok) card.classList.add('done');
      if (opts.onResult) opts.onResult(r);
    }
    return { check: check, card: card, control: ctl };
  };

  T.tabs.tuLam = function (c, bai) {
    var status = el('div', { class: 'status', 'aria-live': 'polite' });
    function refresh() {
      var st = T.store.lessonStatus(bai);
      status.innerHTML = '';
      status.appendChild(el('span', null, 'Em đã làm đúng ', el('b', null, st.done + '/' + st.total), ' bài. '));
      status.appendChild(st.mastered ? el('b', { style: 'color:var(--ok)' }, '🎉 Em đã thành thạo bài này!')
        : el('span', null, 'Thành thạo khi đúng 80% bài mức 1–2 (không phải xem lời giải) và ít nhất 1 bài mức 3.'));
    }
    refresh();
    c.appendChild(status);
    [1, 2, 3].forEach(function (m) {
      var list = (bai.baiTap || []).filter(function (x) { return x.muc === m; });
      if (!list.length) return;
      c.appendChild(el('h2', { class: 'muc-h' }, ['', 'Mức 1 – Nhận biết', 'Mức 2 – Thông hiểu', 'Mức 3 – Vận dụng'][m]));
      list.forEach(function (q) { T.mountQuestion(c, q, { record: true, onResult: refresh }); });
    });
  };
})(window.TOAN8);
