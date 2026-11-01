// Chấm đáp án: tương đương bằng thay số ngẫu nhiên, kiểm tra dạng (khai triển / nhân tử / rút gọn).
(function (root, factory) {
  var isNode = typeof module === 'object' && module.exports;
  var P = isNode ? require('./parser.js') : root.TOAN8.parser;
  var N = isNode ? require('../../lib/nerdamer/nerdamer.js') : root.nerdamer;
  var m = factory(P, N);
  if (isNode) module.exports = m;
  else root.TOAN8.checker = m;
})(typeof self !== 'undefined' ? self : this, function (P, N) {
  'use strict';
  var TRIALS = 12, NEED = 6;

  function rnd() { var v = 0.3 + Math.random() * 2.7; return Math.random() < 0.5 ? -v : v; }
  function close(a, b) { return Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)); }

  function equivalentAst(a, b) {
    var vars = P.variables(a).concat(P.variables(b)).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    if (!vars.length) {
      var x0 = P.evaluate(a, {}), y0 = P.evaluate(b, {});
      return isFinite(x0) && isFinite(y0) && close(x0, y0);
    }
    var good = 0;
    for (var i = 0; i < TRIALS * 3 && good < TRIALS; i++) {
      var env = {};
      vars.forEach(function (v) { env[v] = rnd(); });
      var x = P.evaluate(a, env), y = P.evaluate(b, env);
      if (!isFinite(x) || !isFinite(y)) continue; // mẫu = 0 hoặc căn số âm: bỏ điểm này
      if (!close(x, y)) return false;
      good++;
    }
    return good >= NEED;
  }
  function equivalent(sa, sb) { return equivalentAst(P.parse(sa), P.parse(sb)); }

  function isConst(n) { return P.variables(n).length === 0; }

  // Chữ kí đơn thức ("x^2 y^1"), hoặc null nếu không phải đơn thức.
  function monoSig(n) {
    if (n.t === 'neg') return monoSig(n.a);
    if (n.t === 'div') return isConst(n.b) ? monoSig(n.a) : null;
    var fs = n.t === 'mul' ? n.fs : [n], pw = {};
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (isConst(f)) continue;
      if (f.t === 'var') pw[f.n] = (pw[f.n] || 0) + 1;
      else if (f.t === 'pow' && f.b.t === 'var' && f.e.t === 'num') pw[f.b.n] = (pw[f.b.n] || 0) + f.e.v;
      else if (f.t === 'div' || f.t === 'neg') {
        var s = monoSig(f);
        if (s === null) return null;
        s.split(' ').filter(Boolean).forEach(function (p) { var kv = p.split('^'); pw[kv[0]] = (pw[kv[0]] || 0) + Number(kv[1]); });
      } else return null;
    }
    return Object.keys(pw).sort().map(function (k) { return k + '^' + pw[k]; }).join(' ');
  }

  function isExpanded(ast) {
    var terms = ast.t === 'add' ? ast.terms : [ast], seen = {};
    for (var i = 0; i < terms.length; i++) {
      var s = monoSig(terms[i]);
      if (s === null) return { ok: false, ly: 'Đúng giá trị, nhưng em cần khai triển hết (không còn dấu ngoặc).' };
      if (seen[s]) return { ok: false, ly: 'Đúng giá trị, nhưng em còn các hạng tử đồng dạng chưa thu gọn.' };
      seen[s] = 1;
    }
    return { ok: true };
  }

  // Tách biểu thức (sau khi nerdamer phân tích) thành các nhân tử ở nút gốc.
  function topFactors(n) {
    if (n.t === 'neg') return topFactors(n.a);
    return n.t === 'mul' ? n.fs : [n];
  }
  function factorOf(str) { return P.parse(String(N.factor(str).toString())); }

  function nonConstFactorCount(str) {
    var c = 0;
    topFactors(factorOf(str)).forEach(function (x) {
      if (isConst(x)) return;
      c += x.t === 'pow' && x.e.t === 'num' ? x.e.v : 1;
    });
    return c;
  }

  function isFactored(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    var no = { ok: false, ly: 'Đúng giá trị, nhưng chưa phân tích thành nhân tử (kết quả phải là một tích).' };
    var fs = n.t === 'mul' ? n.fs : n.t === 'pow' ? [n] : null;
    if (!fs) return no;
    var total = 0, nonConst = 0;
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i], base = f, mult = 1;
      if (f.t === 'pow' && f.e.t === 'num' && Number.isInteger(f.e.v)) { base = f.b; mult = f.e.v; }
      total += mult;
      if (isConst(base)) continue;
      nonConst += mult;
      if (nonConstFactorCount(P.toNerdamer(base)) > 1)
        return { ok: false, ly: 'Gần đúng rồi! Nhân tử $' + P.toLatex(base) + '$ vẫn còn phân tích tiếp được.' };
    }
    if (total < 2 || nonConst < 1) return no;
    return { ok: true };
  }

  function gcdInt(a, b) { return b ? gcdInt(b, a % b) : a; }
  // Ước chung nguyên (dương) của các hệ số: lấy tích các nhân tử hằng ở nút gốc sau khi phân tích.
  function intContent(n) {
    var c = 1;
    topFactors(factorOf(P.toNerdamer(n))).forEach(function (x) { if (isConst(x)) c *= Math.abs(P.evaluate(x, {})); });
    return Number.isInteger(c) ? c : 1;
  }

  function isReduced(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    if (n.t !== 'div') return { ok: true };
    var g = P.parse(String(N('gcd(' + P.toNerdamer(n.a) + ',' + P.toNerdamer(n.b) + ')').toString()));
    if (!isConst(g)) return { ok: false, ly: 'Đúng giá trị, nhưng tử và mẫu vẫn còn nhân tử chung. Em rút gọn tiếp nhé.' };
    if (gcdInt(intContent(n.a), intContent(n.b)) > 1) return { ok: false, ly: 'Đúng giá trị, nhưng tử và mẫu còn ước chung là số. Em chia tiếp nhé.' };
    return { ok: true };
  }

  function parseNumber(s) {
    try { var a = P.parse(s); return isConst(a) ? P.evaluate(a, {}) : NaN; } catch (e) { return NaN; }
  }

  var MSG = {
    dung: 'Chính xác!',
    sai: 'Chưa đúng. Em thử lại hoặc bấm Gợi ý nhé.',
    khongDoc: 'Máy chưa đọc được. Lũy thừa viết là x^2, phép nhân có thể viết liền: 2x(x+1).'
  };
  function res(code, msg, extra) {
    var r = { ok: code === 'dung', code: code, msg: msg || MSG[code] };
    for (var k in extra || {}) r[k] = extra[k];
    return r;
  }
  function near(x, y, tol) { return Math.abs(x - y) <= tol + 1e-12; }

  function checkExpr(d, input, ltg) {
    var a;
    try { a = P.parse(input); } catch (e) { return res('khongDoc'); }
    var g = P.parse(d.gt);
    if (!equivalentAst(a, g)) {
      for (var i = 0; i < ltg.length; i++)
        if (ltg[i].gt != null && equivalentAst(a, P.parse(ltg[i].gt))) return res('loiThuongGap', ltg[i].giaiThich);
      return res('sai');
    }
    var chk = d.dang === 'khaiTrien' ? isExpanded(a) : d.dang === 'nhanTu' ? isFactored(a) : d.dang === 'rutGon' ? isReduced(a) : { ok: true };
    return chk.ok ? res('dung') : res('saiDang', chk.ly);
  }

  function checkNumber(d, input, ltg) {
    var x = parseNumber(input), y = typeof d.gt === 'number' ? d.gt : parseNumber(d.gt);
    if (Number.isNaN(x)) return res('khongDoc', 'Em nhập một số, ví dụ 12 hoặc 0,5 hoặc 3/4.');
    var tol = d.saiSo != null ? d.saiSo : 1e-9;
    if (near(x, y, tol)) return res('dung');
    for (var j = 0; j < ltg.length; j++)
      if (near(x, parseNumber(String(ltg[j].gt)), tol)) return res('loiThuongGap', ltg[j].giaiThich);
    return res('sai');
  }

  function checkRoots(d, input) {
    var s = String(input == null ? '' : input).toLowerCase().trim();
    if (/vô\s*nghiệm|vo\s*nghiem/.test(s)) return res(d.gt === 'voNghiem' ? 'dung' : 'sai');
    if (/vô\s*số|vo\s*so/.test(s)) return res(d.gt === 'voSoNghiem' ? 'dung' : 'sai');
    if (!Array.isArray(d.gt)) return res('sai');
    var parts = s.split(';').map(function (t) { return t.trim().replace(/^[a-z]\s*=/, '').trim(); }).filter(Boolean);
    var vals = parts.map(parseNumber);
    if (!vals.length || vals.some(Number.isNaN)) return res('khongDoc', 'Ghi các nghiệm cách nhau bằng dấu ; ví dụ: x = 2; x = -3');
    var want = d.gt.slice();
    var okAll = vals.length === want.length && vals.every(function (v) {
      var k = want.findIndex(function (w) { return near(w, v, 1e-9); });
      if (k < 0) return false;
      want.splice(k, 1);
      return true;
    });
    if (okAll) return res('dung');
    return res('sai', vals.length < d.gt.length ? 'Chưa đủ: em còn thiếu nghiệm.' : null);
  }

  function checkAnswer(d, input, ltg) {
    ltg = ltg || [];
    switch (d.kieu) {
      case 'bieuThuc': return checkExpr(d, input, ltg);
      case 'so': return checkNumber(d, input, ltg);
      case 'nghiem': return checkRoots(d, input);
      case 'chon': return res(input != null && Number(input) === d.gt ? 'dung' : 'sai');
      case 'dungSai': return res(input === d.gt ? 'dung' : 'sai');
      case 'nhieuO': {
        var tung = d.o.map(function (sub, i) { return checkAnswer(sub, (input || [])[i], sub.loiThuongGap); });
        var all = tung.every(function (r) { return r.ok; });
        return res(all ? 'dung' : 'sai', all ? null : 'Có ô chưa đúng (viền đỏ).', { tungO: tung });
      }
    }
    throw new Error('Kiểu đáp án lạ: ' + d.kieu);
  }

  return {
    equivalent: equivalent, equivalentAst: equivalentAst,
    isExpanded: isExpanded, isFactored: isFactored, isReduced: isReduced,
    parseNumber: parseNumber, checkAnswer: checkAnswer
  };
});
