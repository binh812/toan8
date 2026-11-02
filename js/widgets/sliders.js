// Thanh trượt dùng chung cho các hình động: list = [{ten, min, max, buoc, gt, nhan?}], env giữ giá trị hiện tại.
(function (T) {
  'use strict';
  var el = T.el;
  T.fmtSo = function (v, d) {
    var p = Math.pow(10, d == null ? 2 : d);
    var s = (Math.round(v * p) / p).toString().replace('-', '−').split('.');
    if (Math.abs(v) >= 10000) s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // 46 000
    return s.join(',');
  };

  // rangBuoc(env): điều kiện giữa các thanh trượt; sai thì trả thanh về giá trị cũ
  T.makeSliders = function (list, env, onChange, rangBuoc) {
    var sl = el('div', { class: 'sliders' });
    (list || []).forEach(function (t) {
      if (env[t.ten] == null) env[t.ten] = t.gt != null ? t.gt : (t.min + t.max) / 2;
      var out = el('b', null, T.fmtSo(env[t.ten]));
      var inp = el('input', { type: 'range', min: t.min, max: t.max, step: t.buoc || 0.5, value: env[t.ten], 'aria-label': t.nhan || t.ten });
      inp.addEventListener('input', function () {
        var prev = env[t.ten];
        env[t.ten] = Number(inp.value);
        if (rangBuoc && !rangBuoc(env)) { env[t.ten] = prev; inp.value = prev; return; }
        out.textContent = T.fmtSo(env[t.ten]);
        onChange(env);
      });
      sl.appendChild(el('label', null, el('span', { html: t.nhan ? t.nhan : T.tex(t.ten) }), inp, out));
    });
    return sl;
  };

  // Giá trị cấu hình: số, hoặc biểu thức theo các thanh trượt ("a", "2*k+1")
  T.giaTri = function (v, env) {
    if (typeof v === 'number') return v;
    return T.parser.evaluate(T.parser.parse(String(v)), env);
  };
})(window.TOAN8);
