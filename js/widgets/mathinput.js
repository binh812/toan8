// Ô nhập đáp án: MathLive (gõ công thức đẹp) nếu dùng được, nếu không thì ô chữ có xem trước bằng KaTeX.
(function (T) {
  'use strict';
  var mlOk = null;

  function mathliveUsable() {
    if (mlOk !== null) return mlOk;
    try {
      if (!window.MathfieldElement) return (mlOk = false);
      MathfieldElement.soundsDirectory = null; // không phát âm thanh, không tải file âm thanh
      var probe = new MathfieldElement();
      mlOk = typeof probe.getValue === 'function';
    } catch (e) {
      console.warn('MathLive không dùng được, chuyển sang ô nhập chữ.', e);
      mlOk = false;
    }
    return mlOk;
  }

  function placeholder(kieu) {
    return kieu === 'nghiem' ? 'vd: x = 2; x = -3' : kieu === 'so' ? 'vd: 12 hoặc 0,5 hoặc 3/4' : 'vd: x^2 + 6x + 9';
  }

  function textInput(opts) {
    var inp = T.el('input', { type: 'text', class: 'ti', autocomplete: 'off', spellcheck: 'false', placeholder: placeholder(opts.kieu), 'aria-label': 'Ô nhập đáp án' });
    var prev = T.el('div', { class: 'preview', 'aria-hidden': 'true' });
    var box = T.el('div', { class: 'ti-box' }, inp, prev), enter = function () {};
    inp.addEventListener('input', function () {
      if (opts.kieu !== 'bieuThuc' || !inp.value.trim()) { prev.innerHTML = ''; return; }
      try { prev.innerHTML = 'Máy đọc là: ' + T.tex(T.parser.toLatex(T.parser.parse(inp.value))); }
      catch (e) { prev.textContent = 'Máy đọc là: …'; }
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') enter(); });
    return {
      el: box, input: inp,
      getValue: function () { return inp.value; },
      setValue: function (s) { inp.value = s; inp.dispatchEvent(new Event('input')); },
      focus: function () { inp.focus(); },
      onEnter: function (fn) { enter = fn; }
    };
  }

  function mathField() {
    var mf = new MathfieldElement();
    mf.className = 'mf';
    mf.mathVirtualKeyboardPolicy = 'manual';
    mf.setAttribute('aria-label', 'Ô nhập đáp án');
    var enter = function () {};
    mf.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enter(); } });
    return {
      el: mf, input: mf,
      getValue: function () { return mf.getValue('ascii-math'); },
      setValue: function (s) { mf.setValue(s, { format: 'ascii-math' }); },
      focus: function () { mf.focus(); },
      onEnter: function (fn) { enter = fn; }
    };
  }

  // opts: { kieu: 'bieuThuc' | 'so' | 'nghiem' }. Chỉ biểu thức mới dùng MathLive; số và nghiệm dùng ô chữ.
  T.mathInput = function (opts) {
    opts = opts || {};
    return opts.kieu === 'bieuThuc' && mathliveUsable() ? mathField() : textInput(opts);
  };
  T.mathInputMode = function () { return mathliveUsable() ? 'mathlive' : 'text'; };
})(window.TOAN8);
