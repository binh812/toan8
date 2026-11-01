// Đọc biểu thức dạng ascii-math (kiểu học sinh Việt Nam gõ) thành cây biểu thức (AST).
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.parser = m; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function fail(msg) { var e = new Error(msg); e.code = 'khongDoc'; return e; }

  function normalize(s) {
    return String(s == null ? '' : s)
      .replace(/[−–]/g, '-').replace(/[·×⋅]/g, '*').replace(/:/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/√/g, 'sqrt')
      .replace(/\s+/g, '');
  }

  function tokenize(s) {
    var out = [], i = 0, m;
    while (i < s.length) {
      var rest = s.slice(i);
      if ((m = /^\d+([.,]\d+)?/.exec(rest))) { out.push({ k: 'num', v: parseFloat(m[0].replace(',', '.')) }); i += m[0].length; continue; }
      if (/^sqrt/.test(rest)) { out.push({ k: 'fn', v: 'sqrt' }); i += 4; continue; }
      if (/^[a-zA-Z]/.test(rest)) { out.push({ k: 'var', v: rest[0] }); i += 1; continue; }
      if ('+-*/^()'.indexOf(rest[0]) >= 0) { out.push({ k: rest[0] }); i += 1; continue; }
      throw fail('Kí tự lạ: ' + rest[0]);
    }
    return out;
  }

  function parse(str) {
    var toks = tokenize(normalize(str)), p = 0;
    if (!toks.length) throw fail('Chưa nhập gì');
    function peek() { return toks[p]; }
    function eat(k) { var t = toks[p]; if (!t || t.k !== k) throw fail('Thiếu ' + k); p++; return t; }
    function startsPrimary(t) { return t && (t.k === 'num' || t.k === 'var' || t.k === 'fn' || t.k === '('); }
    function mul(a, b) {
      var fs = [];
      [a, b].forEach(function (x) { if (x.t === 'mul') fs.push.apply(fs, x.fs); else fs.push(x); });
      return { t: 'mul', fs: fs };
    }
    function expr() {
      var terms = [term()];
      while (peek() && (peek().k === '+' || peek().k === '-')) {
        var op = toks[p++].k, r = term();
        terms.push(op === '-' ? { t: 'neg', a: r } : r);
      }
      return terms.length === 1 ? terms[0] : { t: 'add', terms: terms };
    }
    function term() {
      var node = unary();
      for (;;) {
        var t = peek();
        if (t && t.k === '*') { p++; node = mul(node, unary()); }
        else if (t && t.k === '/') { p++; node = { t: 'div', a: node, b: unary() }; }
        else if (startsPrimary(t)) node = mul(node, power());
        else return node;
      }
    }
    function unary() {
      var t = peek();
      if (t && t.k === '-') { p++; return { t: 'neg', a: unary() }; }
      if (t && t.k === '+') { p++; return unary(); }
      return power();
    }
    function power() {
      var b = primary();
      if (peek() && peek().k === '^') { p++; return { t: 'pow', b: b, e: unary() }; }
      return b;
    }
    function primary() {
      var t = toks[p++];
      if (!t) throw fail('Biểu thức bị cụt');
      if (t.k === 'num') return { t: 'num', v: t.v };
      if (t.k === 'var') return { t: 'var', n: t.v };
      if (t.k === 'fn') return { t: 'fn', n: t.v, a: peek() && peek().k === '(' ? primary() : power() };
      if (t.k === '(') { var e = expr(); eat(')'); return e; }
      throw fail('Không đọc được ở "' + t.k + '"');
    }
    var ast = expr();
    if (p !== toks.length) throw fail('Thừa kí tự');
    return ast;
  }

  function evaluate(n, env) {
    switch (n.t) {
      case 'num': return n.v;
      case 'var': if (!(n.n in env)) throw new Error('Thiếu giá trị ' + n.n); return env[n.n];
      case 'add': return n.terms.reduce(function (s, x) { return s + evaluate(x, env); }, 0);
      case 'neg': return -evaluate(n.a, env);
      case 'mul': return n.fs.reduce(function (s, x) { return s * evaluate(x, env); }, 1);
      case 'div': return evaluate(n.a, env) / evaluate(n.b, env);
      case 'pow': return Math.pow(evaluate(n.b, env), evaluate(n.e, env));
      case 'fn': return Math.sqrt(evaluate(n.a, env));
    }
    throw new Error('AST lạ');
  }

  function variables(n) {
    var set = {};
    (function walk(x) {
      if (x.t === 'var') set[x.n] = 1;
      ['a', 'b', 'e'].forEach(function (k) { if (x[k]) walk(x[k]); });
      (x.terms || x.fs || []).forEach(walk);
    })(n);
    return Object.keys(set).sort();
  }

  function isAtom(n) { return n.t === 'num' || n.t === 'var' || n.t === 'fn'; }

  function toNerdamer(n) {
    function wrap(x) { return isAtom(x) || x.t === 'pow' ? toNerdamer(x) : '(' + toNerdamer(x) + ')'; }
    function neg(x) { return isAtom(x) ? '-' + toNerdamer(x) : '-(' + toNerdamer(x) + ')'; }
    switch (n.t) {
      case 'num': return String(n.v);
      case 'var': return n.n;
      case 'fn': return 'sqrt(' + toNerdamer(n.a) + ')';
      case 'add': return n.terms.map(function (x, i) {
        if (x.t === 'neg') return neg(x.a);
        return (i ? '+' : '') + toNerdamer(x);
      }).join('');
      case 'neg': return neg(n.a);
      case 'mul': return n.fs.map(wrap).join('*');
      case 'div': return wrap(n.a) + '/' + wrap(n.b);
      case 'pow': return (isAtom(n.b) ? toNerdamer(n.b) : '(' + toNerdamer(n.b) + ')') + '^' + (isAtom(n.e) ? toNerdamer(n.e) : '(' + toNerdamer(n.e) + ')');
    }
    throw new Error('AST lạ');
  }

  function toLatex(n) {
    function wrap(x) { return isAtom(x) || x.t === 'pow' || x.t === 'div' ? toLatex(x) : '\\left(' + toLatex(x) + '\\right)'; }
    switch (n.t) {
      case 'num': return String(n.v).replace('.', '{,}');
      case 'var': return n.n;
      case 'fn': return '\\sqrt{' + toLatex(n.a) + '}';
      case 'add': return n.terms.map(function (x, i) {
        if (x.t === 'neg') return '-' + wrap(x.a);
        return (i ? '+' : '') + toLatex(x);
      }).join('');
      case 'neg': return '-' + wrap(n.a);
      case 'mul': return n.fs.map(function (x, i) {
        var s = wrap(x);
        return i && x.t === 'num' ? '\\cdot ' + s : s;
      }).join('');
      case 'div': return '\\frac{' + toLatex(n.a) + '}{' + toLatex(n.b) + '}';
      case 'pow': return (isAtom(n.b) ? toLatex(n.b) : '\\left(' + toLatex(n.b) + '\\right)') + '^{' + toLatex(n.e) + '}';
    }
    throw new Error('AST lạ');
  }

  return { parse: parse, evaluate: evaluate, variables: variables, toLatex: toLatex, toNerdamer: toNerdamer, normalize: normalize };
});
