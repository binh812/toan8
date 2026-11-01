// Biến chuỗi nội dung (chữ + $công thức$ + **đậm**) thành HTML; tiện ích tạo phần tử DOM.
(function (root, factory) {
  var m = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.md = m.md; root.TOAN8.el = m.el; root.TOAN8.tex = m.tex; }
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  // Màu dùng chung giữa công thức và hình: \ca{A} cam, \cb{B} xanh dương, \cc{} xanh lá, \cd{} tím.
  var MACROS = {
    '\\ca': '\\textcolor{#d9480f}{#1}', '\\cb': '\\textcolor{#1971c2}{#1}',
    '\\cc': '\\textcolor{#2f9e44}{#1}', '\\cd': '\\textcolor{#9c36b5}{#1}'
  };
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function bold(s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }

  function tex(src, display) {
    var K = root && root.katex;
    if (!K) return display ? '<div class="mb">' + src + '</div>' : '<span class="m">' + src + '</span>';
    return K.renderToString(src, { displayMode: !!display, throwOnError: false, macros: Object.assign({}, MACROS) });
  }

  function inline(s) {
    var out = '', re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, last = 0, m;
    while ((m = re.exec(s))) {
      out += bold(esc(s.slice(last, m.index)));
      out += m[1] != null ? tex(m[1], true) : tex(m[2], false);
      last = re.lastIndex;
    }
    return out + bold(esc(s.slice(last)));
  }

  function md(s) {
    if (s == null || s === '') return '';
    return String(s).split(/\n\s*\n/).map(function (para) {
      var p = para.trim(), h = inline(p).replace(/\n/g, '<br>');
      var onlyDisplay = /^\$\$[^$]+\$\$$/.test(p); // đoạn chỉ gồm một công thức khối: không bọc <p>
      return onlyDisplay ? h : '<p>' + h + '</p>';
    }).join('');
  }

  function el(tag, attrs) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      (Array.isArray(c) ? c : [c]).forEach(function (x) {
        if (x != null) e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x);
      });
    }
    return e;
  }
  return { md: md, el: el, tex: tex };
});
