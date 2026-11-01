// Biến chuỗi nội dung (chữ + $công thức$ + **đậm**) thành HTML; tiện ích tạo phần tử DOM.
(function (root, factory) {
  var m = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.md = m.md; root.TOAN8.mdInline = m.mdInline; root.TOAN8.el = m.el; root.TOAN8.tex = m.tex; }
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  // Màu dùng chung giữa công thức và hình: \ca{A} cam, \cb{B} xanh dương, \cc{} xanh lá, \cd{} tím.
  var MACROS = {
    '\\ca': '\\textcolor{##d9480f}{#1}', '\\cb': '\\textcolor{##1971c2}{#1}',
    '\\cc': '\\textcolor{##2f9e44}{#1}', '\\cd': '\\textcolor{##9c36b5}{#1}'
  };
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function bold(s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }

  function tex(src, display) {
    var K = root && root.katex;
    if (!K) return display ? '<div class="mb">' + src + '</div>' : '<span class="m">' + src + '</span>';
    return K.renderToString(src, { displayMode: !!display, throwOnError: false, macros: Object.assign({}, MACROS) });
  }

  // Thay công thức bằng chỗ giữ (\u0000k\u0000) trước, xử lí chữ (escape, **đậm**, xuống dòng) rồi mới trả công thức về:
  // nhờ vậy **đậm** bọc được công thức và <br> không lọt vào HTML/SVG của KaTeX.
  function inline(s) {
    var maths = [];
    var text = s.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, function (_, d, i) {
      maths.push(d != null ? tex(d, true) : tex(i, false));
      return '\u0000' + (maths.length - 1) + '\u0000';
    });
    return bold(esc(text)).replace(/\n/g, '<br>').replace(/\u0000(\d+)\u0000/g, function (_, k) { return maths[k]; });
  }

  function md(s) {
    if (s == null || s === '') return '';
    return String(s).split(/\n\s*\n/).map(function (para) {
      var p = para.trim(), h = inline(p);
      var onlyDisplay = /^\$\$[^$]+\$\$$/.test(p); // đoạn chỉ gồm một công thức khối: không bọc <p>
      return onlyDisplay ? h : '<p>' + h + '</p>';
    }).join('');
  }
  // Một dòng (tiêu đề, nhãn): không bọc <p>.
  function mdInline(s) { return s == null ? '' : inline(String(s).trim()); }

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
  return { md: md, mdInline: mdInline, el: el, tex: tex, MACROS: MACROS };
});
