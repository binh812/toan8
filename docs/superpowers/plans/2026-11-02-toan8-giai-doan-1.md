# Toán 8 KNTT – Giai đoạn 1: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ứng dụng web tĩnh mở bằng `index.html` (file://), có khung đầy đủ (bản đồ 39 bài, chuỗi 5 bước, chấm đáp án, gợi ý 3 nấc, ôn tập Leitner) và nội dung hoàn chỉnh cho Chương I, II, IV (12 bài).

**Architecture:** Script cổ điển (không module), mọi thứ treo dưới `window.TOAN8`. Logic thuần (parser, checker, store) viết theo mẫu UMD để chạy được cả trong trình duyệt lẫn Node (`node --test`). Nội dung mỗi bài là một file `.js` gọi `TOAN8.bai({...})`.

**Tech Stack:**
- Ngôn ngữ: HTML/CSS/JS thuần.
- Thư viện: KaTeX 0.19.1, JSXGraph 1.14.2, MathLive 0.111.4, nerdamer 2.0.0. Tất cả sao chép vào `lib/`.
- Kiểm thử: Node 24 (`node:test`).

**Spec:** `docs/superpowers/specs/2026-11-02-toan8-app-design.md`

## Global Constraints

- Chạy được qua `file://` trong Chrome: không ES module, không `fetch`, không service worker, không CDN.
- Toàn bộ chữ trên giao diện là tiếng Việt. Thuật ngữ theo SGK KNTT: "Thalès", "Pythagore", "phân tích đa thức thành nhân tử", "hằng đẳng thức đáng nhớ".
- Chữ thân ≥ 18px. Điểm kéo trên hình bán kính ≥ 12px. Chỉ tối ưu cho màn hình ≥ 1280px.
- Mỗi bài: ≥ 2 ví dụ, ≥ 1 ví dụ mờ dần, 8–12 bài tập (≈ 4 mức 1, 4 mức 2, 2 mức 3), ≥ 1 bài tìm lỗi sai.
- Thành thạo một bài: đúng ≥ 80% số bài mức 1–2, không dùng nấc gợi ý cuối ở các bài tính là đúng, và đúng ít nhất 1 bài mức 3.
- Nội dung là bài tự soạn theo dạng bài SGK, không chép nguyên văn. Mỗi bài có `sgk: {tap, trang}`.
- localStorage key: `toan8.v1`. Leitner gồm 5 hộp, khoảng cách ôn 1/2/4/8/16 ngày.
- Thư viện có ghi phiên bản và giữ nguyên LICENSE trong `lib/<tên>/`.

## Review Focus

1. **Nhập kiểu Việt Nam:** `0,75`, `3:4`, `x²`, `2·x`, `2×3`, dấu `−` (U+2212) và khoảng trắng thừa phải được hiểu đúng. Test ở Task 2.
2. **Đúng giá trị nhưng sai dạng:** ví dụ đề "phân tích thành nhân tử" mà em gõ lại đề bài, hoặc khai triển chưa thu gọn. Phải trả về `saiDang` kèm lời nhắc, không được báo "sai". Test ở Task 3.
3. **Điểm thử rơi vào mẫu bằng 0** (phân thức): bỏ qua điểm đó, không được kết luận "không tương đương". Test ở Task 3.
4. **localStorage lỗi:** bị chặn, hoặc JSON hỏng. App vẫn chạy, có cảnh báo, không mất trang. Test ở Task 4.
5. **MathLive không khởi tạo được qua file://:** tự chuyển sang ô nhập chữ có xem trước KaTeX. Test ở Task 7 (bằng cờ `?nomathlive`).

---

## Cấu trúc file

```
index.html                 nạp lib → core → widgets → content (thứ tự cố định)
css/app.css
lib/{katex,jsxgraph,mathlive,nerdamer}/   bản phát hành + LICENSE
js/core/parser.js          chuỗi ascii-math → AST; evaluate; toLatex; toNerdamer; variables
js/core/checker.js         equivalent, isExpanded, isFactored, isReduced, parseNumber, checkAnswer
js/core/store.js           createStore(storage) → tiến độ + Leitner + export/import
js/core/render.js          md(str) → HTML (KaTeX cho $..$, $$..$$, **đậm**); el() helper
js/core/app.js             registry TOAN8.bai, router hash, trang chủ, khung bài, tab
js/widgets/mathinput.js    tạo ô nhập (MathLive hoặc fallback) → {el, getValue(), clear()}
js/widgets/stepper.js      ví dụ từng bước + ví dụ mờ dần
js/widgets/practice.js     thẻ bài tập: nhập, chấm, gợi ý, lời giải, ghi store
js/widgets/timloi.js       tìm dòng sai
js/widgets/review.js       trang Ôn 5 câu
js/widgets/tiles.js        mô hình diện tích (HĐT, nhân đa thức) bằng SVG
js/widgets/geo.js          tiện ích JSXGraph (board, điểm, đoạn, nhãn số đo động)
content/index.js           10 chương / 39 bài (tên, trang SGK)
content/bai01.js … bai17.js  (Giai đoạn 1: 01–09, 15–17)
tools/copy-libs.js         chép thư viện từ node_modules sang lib/
tools/validate-content.js  kiểm tra nội dung tự động
tests/*.test.js
```

Mẫu UMD dùng cho `parser.js`, `checker.js`, `store.js`:

```js
(function (root, factory) {
  var m = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.<ten> = m; }
})(typeof self !== 'undefined' ? self : this, function (root) { /* ... */ return {/* API */}; });
```

---

### Task 1: Khởi tạo dự án và thư viện

**Files:**
- Create: `package.json`, `.gitignore`, `tools/copy-libs.js`, `README.md`, `lib/**`

**Interfaces:**
- Produces:
  - `lib/katex/katex.min.js`, `lib/katex/katex.min.css`, `lib/katex/fonts/`
  - `lib/jsxgraph/jsxgraphcore.js`, `lib/jsxgraph/jsxgraph.css`
  - `lib/mathlive/mathlive.min.js`, `lib/mathlive/fonts/`
  - `lib/nerdamer/nerdamer.js`
  - Lệnh `npm test`

- [ ] **Step 1: git init + package.json**

```bash
cd D:/Appdev2-2026/toan-hoc && git init
npm init -y
npm install --save-dev --save-exact katex@0.19.1 jsxgraph@1.14.2 mathlive@0.111.4 nerdamer@2.0.0
```

Sửa `package.json`: `"scripts": {"test": "node --test tests/", "libs": "node tools/copy-libs.js", "validate": "node tools/validate-content.js"}`.

- [ ] **Step 2: `.gitignore`**

```
node_modules/
sach-giao-khoa/*.pdf
sach-giao-khoa/pages/
```

- [ ] **Step 3: `tools/copy-libs.js`**

```js
const fs = require('fs'), path = require('path');
const NM = path.join(__dirname, '..', 'node_modules'), LIB = path.join(__dirname, '..', 'lib');
const jobs = [
  ['katex/dist/katex.min.js', 'katex/katex.min.js'],
  ['katex/dist/katex.min.css', 'katex/katex.min.css'],
  ['katex/dist/fonts', 'katex/fonts'],
  ['katex/LICENSE', 'katex/LICENSE'],
  ['jsxgraph/distrib/jsxgraphcore.js', 'jsxgraph/jsxgraphcore.js'],
  ['jsxgraph/distrib/jsxgraph.css', 'jsxgraph/jsxgraph.css'],
  ['jsxgraph/LICENSE.MIT', 'jsxgraph/LICENSE.MIT'],
  ['mathlive/mathlive.min.js', 'mathlive/mathlive.min.js'],
  ['mathlive/fonts', 'mathlive/fonts'],
  ['mathlive/LICENSE.txt', 'mathlive/LICENSE.txt'],
  ['nerdamer/dist/bundle.js', 'nerdamer/nerdamer.js'],
  ['nerdamer/LICENSE.md', 'nerdamer/LICENSE.md'],
];
for (const [from, to] of jobs) {
  const src = path.join(NM, from), dst = path.join(LIB, to);
  if (!fs.existsSync(src)) { console.error('THIẾU', src); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true });
  console.log('ok', to);
}
const pkg = require('../package.json');
fs.writeFileSync(path.join(LIB, 'VERSIONS.txt'),
  Object.entries(pkg.devDependencies).map(([k, v]) => k + ' ' + v).join('\n') + '\n');
```

Nếu tên file LICENSE của jsxgraph khác (kiểm tra bằng `ls node_modules/jsxgraph`), sửa lại cho đúng tên.

- [ ] **Step 4: Chạy `npm run libs`.** Kết quả mong đợi: mọi dòng `ok`, không có dòng `THIẾU`.

- [ ] **Step 5: `README.md`** ngắn:
  - cách mở (bấm đúp `index.html`);
  - cách chạy test (`npm test`);
  - nguồn SGK;
  - giấy phép các thư viện.

- [ ] **Step 6: Commit** `chore: khởi tạo dự án, thư viện offline`.

---

### Task 2: Parser biểu thức (`js/core/parser.js`)

**Files:**
- Create: `js/core/parser.js`
- Test: `tests/parser.test.js`

**Interfaces:**
- Produces: `TOAN8.parser` / `require('../js/core/parser.js')` gồm:
  - `parse(str) → AST`. Ném `Error` có `.code = 'khongDoc'` khi không đọc được.
  - `evaluate(ast, env) → number`.
  - `variables(ast) → string[]` (đã sắp xếp).
  - `toLatex(ast) → string`.
  - `toNerdamer(ast) → string`.
  - `normalize(str) → string`.
- Kiểu AST: `{t:'num',v}`, `{t:'var',n}`, `{t:'add',terms:[AST]}`, `{t:'neg',a}`, `{t:'mul',fs:[AST]}`, `{t:'div',a,b}`, `{t:'pow',b,e}`, `{t:'fn',n:'sqrt',a}`.

- [ ] **Step 1: Viết test**

```js
const test = require('node:test'), assert = require('node:assert');
const P = require('../js/core/parser.js');
const ev = (s, env = {}) => P.evaluate(P.parse(s), env);

test('số và phép tính cơ bản', () => {
  assert.strictEqual(ev('2+3*4'), 14);
  assert.strictEqual(ev('2^3^2'), 512);          // lũy thừa kết hợp phải
  assert.strictEqual(ev('-2^2'), -4);
  assert.strictEqual(ev('(3)/(4)'), 0.75);
});
test('nhân ngầm', () => {
  assert.strictEqual(ev('2x', { x: 5 }), 10);
  assert.strictEqual(ev('2x^2', { x: 3 }), 18);
  assert.strictEqual(ev('x(x+1)', { x: 2 }), 6);
  assert.strictEqual(ev('(a+b)(a-b)', { a: 5, b: 2 }), 21);
  assert.strictEqual(ev('xy', { x: 2, y: 3 }), 6);
  assert.strictEqual(ev('(3)/(4)x', { x: 8 }), 6);
  assert.strictEqual(ev('2(x+1)^2', { x: 1 }), 8);
});
test('kiểu nhập Việt Nam', () => {
  assert.strictEqual(ev('0,75'), 0.75);
  assert.strictEqual(ev('3:4'), 0.75);
  assert.strictEqual(ev('x²', { x: 3 }), 9);
  assert.strictEqual(ev('x³', { x: 2 }), 8);
  assert.strictEqual(ev('2·x', { x: 4 }), 8);
  assert.strictEqual(ev('2×3'), 6);
  assert.strictEqual(ev('5 − 2'), 3);
  assert.strictEqual(ev(' x ^ 2 + 1 ', { x: 2 }), 5);
});
test('căn bậc hai', () => {
  assert.strictEqual(ev('sqrt(9)'), 3);
  assert.strictEqual(ev('√16'), 4);
});
test('biến', () => {
  assert.deepStrictEqual(P.variables(P.parse('x^2y+3z-x')), ['x', 'y', 'z']);
});
test('không đọc được', () => {
  for (const bad of ['', '2+', '(x+1', 'x)', '2**3', '#'])
    assert.throws(() => P.parse(bad), e => e.code === 'khongDoc', bad);
});
test('toNerdamer tương đương', () => {
  assert.strictEqual(P.toNerdamer(P.parse('2x(x-1)')), '2*x*(x-1)');
  assert.strictEqual(P.toNerdamer(P.parse('-x^2')), '-(x^2)');
});
test('toLatex', () => {
  assert.strictEqual(P.toLatex(P.parse('(x+1)/(x-1)')), '\\frac{x+1}{x-1}');
  assert.strictEqual(P.toLatex(P.parse('2x^2')), '2x^{2}');
});
```

- [ ] **Step 2: Chạy `node --test tests/parser.test.js`.** Kết quả mong đợi: FAIL (thiếu module).

- [ ] **Step 3: Cài đặt**

```js
(function (root, factory) {
  var m = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.parser = m; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function fail(msg) { var e = new Error(msg); e.code = 'khongDoc'; return e; }

  function normalize(s) {
    return String(s)
      .replace(/[−–]/g, '-').replace(/[·×⋅]/g, '*').replace(/:/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/√/g, 'sqrt')
      .replace(/\s+/g, '');
  }

  function tokenize(s) {
    var out = [], i = 0, m;
    while (i < s.length) {
      var rest = s.slice(i);
      if ((m = /^\d+([.,]\d+)?/.exec(rest))) { out.push({ k: 'num', v: parseFloat(m[0].replace(',', '.')) }); i += m[0].length; continue; }
      if ((m = /^sqrt/.exec(rest))) { out.push({ k: 'fn', v: 'sqrt' }); i += 4; continue; }
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
    switch (n.t) {
      case 'num': return String(n.v);
      case 'var': return n.n;
      case 'fn': return 'sqrt(' + toNerdamer(n.a) + ')';
      case 'add': return n.terms.map(function (x, i) {
        if (x.t === 'neg') return '-' + wrap(x.a);
        return (i ? '+' : '') + toNerdamer(x);
      }).join('');
      case 'neg': return '-' + wrap(n.a);
      case 'mul': return n.fs.map(wrap).join('*');
      case 'div': return wrap(n.a) + '/' + wrap(n.b);
      case 'pow': return (isAtom(n.b) ? toNerdamer(n.b) : '(' + toNerdamer(n.b) + ')') + '^' + (isAtom(n.e) ? toNerdamer(n.e) : '(' + toNerdamer(n.e) + ')');
    }
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
  }

  return { parse: parse, evaluate: evaluate, variables: variables, toLatex: toLatex, toNerdamer: toNerdamer, normalize: normalize };
});
```

Ghi chú: `normalize` đổi `:` thành `/` cho mọi dấu `:`. Các bài loại `nghiem` không gửi dấu `:` vào parser, vì đã tách `x =` ở checker.

- [ ] **Step 4: Chạy `node --test tests/parser.test.js`.** Kết quả mong đợi: PASS hết. Nếu `toLatex`/`toNerdamer` lệch chuỗi, sửa code cho khớp test, không sửa test, trừ khi test sai về toán.

- [ ] **Step 5: Commit** `feat: parser biểu thức ascii-math kiểu Việt Nam`.

---

### Task 3: Chấm đáp án (`js/core/checker.js`)

**Files:**
- Create: `js/core/checker.js`
- Test: `tests/checker.test.js`

**Interfaces:**
- Consumes:
  - `parser` (Task 2): trong Node lấy bằng `require('./parser.js')`, trong trình duyệt là `root.TOAN8.parser`.
  - `nerdamer`: trong Node lấy bằng `require('../../lib/nerdamer/nerdamer.js')`, trong trình duyệt là `root.nerdamer`.
- Produces: `TOAN8.checker`:
  - `equivalent(strA, strB) → boolean`
  - `isExpanded(ast) → {ok, ly}`
  - `isFactored(ast) → {ok, ly}`
  - `isReduced(ast) → {ok, ly}`
  - `parseNumber(str) → number | NaN`
  - `checkAnswer(dapAn, input) → {ok:boolean, code:'dung'|'sai'|'saiDang'|'loiThuongGap'|'khongDoc', msg:string}`
- Kiểu `dapAn`, đúng như mục 4 của spec:
  - `{kieu:'bieuThuc', gt, dang?:'khaiTrien'|'nhanTu'|'rutGon'}`
  - `{kieu:'so', gt:number|string, saiSo?}`
  - `{kieu:'nghiem', gt:number[]|'voNghiem'|'voSoNghiem'}`
  - `{kieu:'chon', gt:index}`
  - `{kieu:'dungSai', gt:boolean}`
  - `{kieu:'nhieuO', o:[dapAn...]}`, với input là mảng
  - `loiThuongGap` truyền qua tham số thứ 3: `checkAnswer(dapAn, input, loiThuongGap?)`.

- [ ] **Step 1: Viết test**

```js
const test = require('node:test'), assert = require('node:assert');
const C = require('../js/core/checker.js');
const P = require('../js/core/parser.js');

test('tương đương: hằng đẳng thức', () => {
  assert.ok(C.equivalent('(x+1)^2', 'x^2+2x+1'));
  assert.ok(C.equivalent('(a-b)(a+b)', 'a^2-b^2'));
  assert.ok(C.equivalent('(a+b)^3', 'a^3+3a^2b+3ab^2+b^3'));
  assert.ok(!C.equivalent('(x+1)^2', 'x^2+1'));
  assert.ok(!C.equivalent('x^2-2x+1', 'x^2+2x+1'));
});
test('tương đương: phân thức, bỏ qua điểm mẫu = 0', () => {
  assert.ok(C.equivalent('(x^2-1)/(x-1)', 'x+1'));
  assert.ok(C.equivalent('1/(x-1)+1/(x+1)', '2x/(x^2-1)'));
});
test('dạng khai triển', () => {
  const k = s => C.isExpanded(P.parse(s)).ok;
  assert.ok(k('x^2+6x+9'));
  assert.ok(k('-3x^2y+2xy^2-1'));
  assert.ok(k('(1)/(2)x^2-3'));
  assert.ok(!k('(x+3)^2'));
  assert.ok(!k('x(x+6)+9'));
  assert.ok(!k('x^2+3x+3x+9'));            // chưa thu gọn
});
test('dạng nhân tử', () => {
  const f = s => C.isFactored(P.parse(s)).ok;
  assert.ok(f('(x-3)(x+3)'));
  assert.ok(f('3(x-1)'));
  assert.ok(f('2x(x+2)'));
  assert.ok(f('(x+2)^2'));
  assert.ok(f('-(x-1)(x+1)'));
  assert.ok(f('(a+2b)(a^2-2ab+4b^2)'));
  assert.ok(!f('x^2-9'));
  assert.ok(!f('(x^2-4)(x+1)'));           // x^2-4 còn phân tích được
  assert.ok(!f('x(x+1)+2(x+1)'));
});
test('dạng rút gọn phân thức', () => {
  const r = s => C.isReduced(P.parse(s)).ok;
  assert.ok(r('(x+1)/(x-2)'));
  assert.ok(r('x+1'));
  assert.ok(!r('(x^2-1)/(x-1)'));
  assert.ok(!r('(2x+2)/(4x+4)'));
});
test('số kiểu Việt Nam', () => {
  assert.strictEqual(C.parseNumber('0,75'), 0.75);
  assert.strictEqual(C.parseNumber('3/4'), 0.75);
  assert.strictEqual(C.parseNumber('-1,5'), -1.5);
  assert.ok(Number.isNaN(C.parseNumber('abc')));
});
test('checkAnswer biểu thức', () => {
  const d = { kieu: 'bieuThuc', gt: 'x^2+6x+9', dang: 'khaiTrien' };
  assert.strictEqual(C.checkAnswer(d, 'x^2+6x+9').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, '9+6x+x²').code, 'dung');
  assert.strictEqual(C.checkAnswer(d, '(x+3)^2').code, 'saiDang');
  const l = C.checkAnswer(d, 'x^2+9', [{ gt: 'x^2+9', giaiThich: 'Thiếu 2AB' }]);
  assert.strictEqual(l.code, 'loiThuongGap');
  assert.strictEqual(l.msg, 'Thiếu 2AB');
  assert.strictEqual(C.checkAnswer(d, 'x^2+5x+9').code, 'sai');
  assert.strictEqual(C.checkAnswer(d, 'x^2+').code, 'khongDoc');
  const f = { kieu: 'bieuThuc', gt: '(x-3)(x+3)', dang: 'nhanTu' };
  assert.strictEqual(C.checkAnswer(f, 'x^2-9').code, 'saiDang');
  assert.strictEqual(C.checkAnswer(f, '(x+3)(x-3)').code, 'dung');
});
test('checkAnswer số, nghiệm, chọn, đúng/sai, nhiều ô', () => {
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 0.75 }, '3/4').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: '3/4' }, '0,75').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'so', gt: 5, saiSo: 0.1 }, '5,05').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [2, -3] }, 'x = -3; x = 2').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: [2, -3] }, '2').code, 'sai');
  assert.strictEqual(C.checkAnswer({ kieu: 'nghiem', gt: 'voNghiem' }, 'vô nghiệm').code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'chon', gt: 2 }, 2).code, 'dung');
  assert.strictEqual(C.checkAnswer({ kieu: 'dungSai', gt: false }, false).code, 'dung');
  const m = { kieu: 'nhieuO', o: [{ kieu: 'so', gt: 2 }, { kieu: 'bieuThuc', gt: 'x+1' }] };
  assert.strictEqual(C.checkAnswer(m, ['2', '1+x']).code, 'dung');
  const r = C.checkAnswer(m, ['2', 'x']);
  assert.strictEqual(r.code, 'sai');
  assert.deepStrictEqual(r.tungO.map(x => x.ok), [true, false]);
});
```

- [ ] **Step 2: Chạy `node --test tests/checker.test.js`.** Kết quả mong đợi: FAIL.

- [ ] **Step 3: Cài đặt**

```js
(function (root, factory) {
  var dep = typeof module === 'object' && module.exports
    ? { P: require('./parser.js'), N: require('../../lib/nerdamer/nerdamer.js') }
    : { P: root.TOAN8.parser, N: root.nerdamer };
  var m = factory(dep.P, dep.N);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else root.TOAN8.checker = m;
})(typeof self !== 'undefined' ? self : this, function (P, N) {
  'use strict';
  var TRIALS = 12, NEED = 6;

  function rnd() { var v = 0.3 + Math.random() * 2.7; return Math.random() < 0.5 ? -v : v; }
  function close(a, b) { return Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)); }

  function equivalentAst(a, b) {
    var vars = P.variables(a).concat(P.variables(b)).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    var good = 0;
    for (var i = 0; i < TRIALS * 3 && good < TRIALS; i++) {
      var env = {}; vars.forEach(function (v) { env[v] = rnd(); });
      var x = P.evaluate(a, env), y = P.evaluate(b, env);
      if (!isFinite(x) || !isFinite(y)) continue;          // mẫu = 0 hoặc căn âm: bỏ điểm này
      if (!close(x, y)) return false;
      good++;
      if (!vars.length) break;
    }
    return vars.length ? good >= NEED : good === 1;
  }
  function equivalent(sa, sb) { return equivalentAst(P.parse(sa), P.parse(sb)); }

  function hasVar(n) { return P.variables(n).length > 0; }
  function isConst(n) { return !hasVar(n); }

  // đơn thức: tích của hằng số và (biến | biến^số nguyên); cho phép neg, và div cho hằng số
  function monoSig(n) {
    if (n.t === 'neg') return monoSig(n.a);
    if (n.t === 'div') return isConst(n.b) ? monoSig(n.a) : null;
    var fs = n.t === 'mul' ? n.fs : [n], pw = {};
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (isConst(f)) continue;
      if (f.t === 'var') pw[f.n] = (pw[f.n] || 0) + 1;
      else if (f.t === 'pow' && f.b.t === 'var' && f.e.t === 'num') pw[f.b.n] = (pw[f.b.n] || 0) + f.e.v;
      else if (f.t === 'div' && isConst(f.b)) { var s = monoSig(f.a); if (s === null) return null; s.split(' ').forEach(function (p) { if (p) { var kv = p.split('^'); pw[kv[0]] = (pw[kv[0]] || 0) + (+kv[1]); } }); }
      else return null;
    }
    return Object.keys(pw).sort().map(function (k) { return k + '^' + pw[k]; }).join(' ');
  }
  function isExpanded(ast) {
    var terms = ast.t === 'add' ? ast.terms : [ast], seen = {};
    for (var i = 0; i < terms.length; i++) {
      var s = monoSig(terms[i]);
      if (s === null) return { ok: false, ly: 'Em cần khai triển hết, không còn dấu ngoặc.' };
      if (seen[s]) return { ok: false, ly: 'Em còn các hạng tử đồng dạng chưa thu gọn.' };
      seen[s] = 1;
    }
    return { ok: true };
  }

  function nonConstFactorCount(str) {
    var f = P.parse(String(N.factor(str).toString()));
    if (f.t === 'neg') f = f.a;
    var fs = f.t === 'mul' ? f.fs : [f], c = 0;
    fs.forEach(function (x) {
      if (isConst(x)) return;
      if (x.t === 'pow' && x.e.t === 'num') c += x.e.v; else c += 1;
    });
    return c;
  }
  function isFactored(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    var fs = n.t === 'mul' ? n.fs : (n.t === 'pow' ? [n] : null);
    var no = { ok: false, ly: 'Đúng giá trị nhưng chưa phân tích thành nhân tử (kết quả phải là một tích).' };
    if (!fs) return no;
    var total = 0, nonConst = 0;
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i], base = f, mult = 1;
      if (f.t === 'pow' && f.e.t === 'num' && Number.isInteger(f.e.v)) { base = f.b; mult = f.e.v; }
      total += mult;
      if (isConst(base)) continue;
      nonConst += mult;
      if (nonConstFactorCount(P.toNerdamer(base)) > 1)
        return { ok: false, ly: 'Nhân tử ' + P.toNerdamer(base) + ' vẫn còn phân tích tiếp được.' };
    }
    if (total < 2 || nonConst < 1) return no;
    return { ok: true };
  }

  function isReduced(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    if (n.t !== 'div') return { ok: true };
    var g = P.parse(String(N('gcd(' + P.toNerdamer(n.a) + ',' + P.toNerdamer(n.b) + ')').toString()));
    if (hasVar(g)) return { ok: false, ly: 'Tử và mẫu vẫn còn nhân tử chung, em rút gọn tiếp nhé.' };
    // nhân tử chung là hằng số (vd 2x+2 và 4x+4 → gcd = x+1 đã bắt ở trên; 2x và 4 → hằng 2)
    var ca = Math.abs(contentOf(n.a)), cb = Math.abs(contentOf(n.b));
    if (gcdInt(ca, cb) > 1) return { ok: false, ly: 'Tử và mẫu còn ước chung là số, em chia tiếp nhé.' };
    return { ok: true };
  }
  function contentOf(n) {   // ước chung nguyên của các hệ số (0 nếu không xác định)
    var e = String(N(P.toNerdamer(n)).expand().toString());
    var nums = (e.match(/(^|[+\-(])\d+(?=\*|$|[+\-)])/g) || []).map(function (s) { return parseInt(s.replace(/[^\d]/g, ''), 10); });
    var terms = e.split(/[+-](?![^(]*\))/).filter(Boolean).length;
    if (nums.length < terms) return 1;          // có hạng tử hệ số 1
    return nums.reduce(gcdInt, 0) || 1;
  }
  function gcdInt(a, b) { return b ? gcdInt(b, a % b) : a; }

  function parseNumber(s) {
    try { var a = P.parse(s); return isConst(a) ? P.evaluate(a, {}) : NaN; } catch (e) { return NaN; }
  }

  var MSG = {
    dung: 'Chính xác!',
    sai: 'Chưa đúng. Em thử lại hoặc xem gợi ý nhé.',
    khongDoc: 'Máy chưa đọc được. Viết lũy thừa là x^2, phép nhân có thể viết liền: 2x(x+1).'
  };
  function res(code, msg, extra) { var r = { ok: code === 'dung', code: code, msg: msg || MSG[code] }; for (var k in extra || {}) r[k] = extra[k]; return r; }

  function checkAnswer(d, input, ltg) {
    ltg = ltg || [];
    switch (d.kieu) {
      case 'bieuThuc': {
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
      case 'so': {
        var x = parseNumber(input), y = typeof d.gt === 'number' ? d.gt : parseNumber(d.gt);
        if (Number.isNaN(x)) return res('khongDoc', 'Em nhập một số, ví dụ 12 hoặc 0,5 hoặc 3/4.');
        var tol = d.saiSo != null ? d.saiSo : 1e-9;
        if (Math.abs(x - y) <= tol + 1e-12) return res('dung');
        for (var j = 0; j < ltg.length; j++) if (Math.abs(x - parseNumber(String(ltg[j].gt))) <= tol + 1e-12) return res('loiThuongGap', ltg[j].giaiThich);
        return res('sai');
      }
      case 'nghiem': {
        var s = String(input).toLowerCase().trim();
        if (/vô\s*nghiệm|vo\s*nghiem/.test(s)) return res(d.gt === 'voNghiem' ? 'dung' : 'sai');
        if (/vô\s*số|vo\s*so/.test(s)) return res(d.gt === 'voSoNghiem' ? 'dung' : 'sai');
        if (!Array.isArray(d.gt)) return res('sai');
        var parts = s.split(';').map(function (t) { return t.replace(/^[a-z]\s*=/, '').trim(); }).filter(Boolean);
        var vals = parts.map(parseNumber);
        if (!vals.length || vals.some(Number.isNaN)) return res('khongDoc', 'Ghi các nghiệm cách nhau bằng dấu ; ví dụ: x = 2; x = -3');
        var want = d.gt.slice(), okAll = vals.length === want.length && vals.every(function (v) {
          var k = want.findIndex(function (w) { return Math.abs(w - v) < 1e-9; });
          if (k < 0) return false; want.splice(k, 1); return true;
        });
        return res(okAll ? 'dung' : 'sai', okAll ? null : (vals.length < d.gt.length ? 'Em còn thiếu nghiệm.' : null));
      }
      case 'chon': return res(Number(input) === d.gt ? 'dung' : 'sai');
      case 'dungSai': return res(Boolean(input) === d.gt ? 'dung' : 'sai');
      case 'nhieuO': {
        var tung = d.o.map(function (sub, i) { return checkAnswer(sub, (input || [])[i], sub.loiThuongGap); });
        var all = tung.every(function (r) { return r.ok; });
        return res(all ? 'dung' : 'sai', all ? null : 'Có ô chưa đúng (đánh dấu đỏ).', { tungO: tung });
      }
    }
    throw new Error('Kiểu đáp án lạ: ' + d.kieu);
  }

  return { equivalent: equivalent, equivalentAst: equivalentAst, isExpanded: isExpanded, isFactored: isFactored, isReduced: isReduced, parseNumber: parseNumber, checkAnswer: checkAnswer };
});
```

- [ ] **Step 4: Chạy `node --test tests/`.** Kết quả mong đợi: PASS hết.
  - Nếu một case `isReduced` hay `contentOf` sai, đơn giản hoá `contentOf` theo hướng: lấy hệ số từ `N(...).expand()` qua `N.coeffs` nếu nerdamer 2 có, hoặc dùng regex như trên.
  - Không được nới test.

- [ ] **Step 5: Commit** `feat: chấm đáp án tương đương, dạng khai triển/nhân tử/rút gọn`.

---

### Task 4: Lưu tiến độ (`js/core/store.js`)

**Files:**
- Create: `js/core/store.js`
- Test: `tests/store.test.js`

**Interfaces:**
- Produces: `TOAN8.createStore(storage, now?)`. `storage` là đối tượng giống localStorage hoặc `null`; `now()` trả về `Date`. Trả về:
  - `ok`: false nếu storage không dùng được.
  - `recordAttempt(exId, {ok:boolean, hintLevel:number, hintMax:number}) → void`
  - `exState(exId) → {tries, correct, usedSolution, lastOk} | null`
  - `markTab(baiId, tab) → void`
  - `tabsSeen(baiId) → string[]`
  - `lessonStatus(bai) → {done, total, mastered}`. `bai.baiTap` là các bài có `id` và `muc`.
  - `dueToday(limit) → exId[]`
  - `exportJSON() → string`
  - `importJSON(str) → boolean`

- [ ] **Step 1: Viết test**

```js
const test = require('node:test'), assert = require('node:assert');
const { createStore } = require('../js/core/store.js');
function mem() { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, _m: m }; }
const day = d => () => new Date(2026, 10, d, 10);

test('ghi lần làm và đọc lại sau khi tạo store mới', () => {
  const s = mem(); const a = createStore(s, day(2));
  a.recordAttempt('6.1', { ok: true, hintLevel: 0, hintMax: 3 });
  const b = createStore(s, day(2));
  assert.deepStrictEqual(b.exState('6.1'), { tries: 1, correct: true, usedSolution: false, lastOk: true });
});
test('dùng nấc gợi ý cuối thì usedSolution', () => {
  const a = createStore(mem(), day(2));
  a.recordAttempt('6.2', { ok: true, hintLevel: 3, hintMax: 3 });
  assert.strictEqual(a.exState('6.2').usedSolution, true);
});
test('thành thạo', () => {
  const a = createStore(mem(), day(2));
  const bai = { baiTap: [{ id: 'a', muc: 1 }, { id: 'b', muc: 1 }, { id: 'c', muc: 2 }, { id: 'd', muc: 2 }, { id: 'e', muc: 2 }, { id: 'f', muc: 3 }] };
  ['a', 'b', 'c', 'd'].forEach(id => a.recordAttempt(id, { ok: true, hintLevel: 0, hintMax: 3 }));
  assert.strictEqual(a.lessonStatus(bai).mastered, false);       // chưa có mức 3
  a.recordAttempt('f', { ok: true, hintLevel: 1, hintMax: 3 });
  assert.strictEqual(a.lessonStatus(bai).mastered, true);        // 4/5 = 80%
  assert.strictEqual(a.lessonStatus(bai).done, 5);
});
test('Leitner: sai → ôn ngày mai; đúng khi ôn → lên hộp', () => {
  const s = mem();
  createStore(s, day(2)).recordAttempt('x', { ok: false, hintLevel: 0, hintMax: 3 });
  assert.deepStrictEqual(createStore(s, day(2)).dueToday(5), []);
  assert.deepStrictEqual(createStore(s, day(3)).dueToday(5), ['x']);
  createStore(s, day(3)).recordAttempt('x', { ok: true, hintLevel: 0, hintMax: 3 });
  assert.deepStrictEqual(createStore(s, day(4)).dueToday(5), []);  // hộp 2: +2 ngày
  assert.deepStrictEqual(createStore(s, day(5)).dueToday(5), ['x']);
});
test('storage hỏng hoặc bị chặn', () => {
  const s = mem(); s.setItem('toan8.v1', '{hỏng');
  const a = createStore(s, day(2));
  assert.strictEqual(a.ok, true);
  assert.strictEqual(a.exState('z'), null);
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const b = createStore(blocked, day(2));
  assert.strictEqual(b.ok, false);
  b.recordAttempt('q', { ok: true, hintLevel: 0, hintMax: 3 });   // không ném lỗi
  assert.strictEqual(b.exState('q').tries, 1);                     // vẫn nhớ trong phiên
  assert.strictEqual(createStore(null).ok, false);
});
test('xuất / nhập', () => {
  const a = createStore(mem(), day(2));
  a.recordAttempt('k', { ok: true, hintLevel: 0, hintMax: 3 });
  const b = createStore(mem(), day(2));
  assert.strictEqual(b.importJSON(a.exportJSON()), true);
  assert.strictEqual(b.exState('k').tries, 1);
  assert.strictEqual(b.importJSON('rác'), false);
});
```

- [ ] **Step 2: Chạy test.** Kết quả mong đợi: FAIL.

- [ ] **Step 3: Cài đặt**

```js
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.createStore = m.createStore; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var KEY = 'toan8.v1', GAP = [0, 1, 2, 4, 8, 16];
  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function empty() { return { v: 1, ex: {}, tabs: {}, box: {} }; }

  function createStore(storage, now) {
    now = now || function () { return new Date(); };
    var ok = !!storage, data = empty();
    if (ok) {
      try {
        var raw = storage.getItem(KEY);
        if (raw) { try { var p = JSON.parse(raw); if (p && p.v === 1) data = p; } catch (e) { /* JSON hỏng: bắt đầu lại */ } }
        storage.setItem(KEY, JSON.stringify(data));
      } catch (e) { ok = false; }
    }
    function save() { if (!ok) return; try { storage.setItem(KEY, JSON.stringify(data)); } catch (e) { ok = false; api.ok = false; } }

    var api = {
      ok: ok,
      recordAttempt: function (id, r) {
        var e = data.ex[id] || (data.ex[id] = { tries: 0, correct: false, usedSolution: false, lastOk: false });
        e.tries++;
        var sol = r.hintLevel >= r.hintMax;
        if (sol) e.usedSolution = true;
        e.lastOk = r.ok;
        if (r.ok && !sol) e.correct = true;
        var today = dayNum(now()), b = data.box[id];
        if (!r.ok || sol) data.box[id] = { box: 1, due: today + GAP[1] };
        else if (b) { var nb = Math.min(5, b.box + 1); data.box[id] = { box: nb, due: today + GAP[nb] }; }
        save();
      },
      exState: function (id) { var e = data.ex[id]; return e ? { tries: e.tries, correct: e.correct, usedSolution: e.usedSolution, lastOk: e.lastOk } : null; },
      markTab: function (baiId, tab) { var t = data.tabs[baiId] || (data.tabs[baiId] = []); if (t.indexOf(tab) < 0) { t.push(tab); save(); } },
      tabsSeen: function (baiId) { return (data.tabs[baiId] || []).slice(); },
      lessonStatus: function (bai) {
        var list = bai.baiTap || [], done = 0, base = 0, baseOk = 0, hardOk = false;
        list.forEach(function (x) {
          var e = data.ex[x.id], good = !!(e && e.correct);
          if (good) done++;
          if (x.muc <= 2) { base++; if (good) baseOk++; } else if (good) hardOk = true;
        });
        return { done: done, total: list.length, mastered: base > 0 && baseOk / base >= 0.8 && hardOk };
      },
      dueToday: function (limit) {
        var today = dayNum(now());
        return Object.keys(data.box).filter(function (id) { return data.box[id].due <= today; })
          .sort(function (a, b) { return data.box[a].due - data.box[b].due; }).slice(0, limit);
      },
      exportJSON: function () { return JSON.stringify(data); },
      importJSON: function (s) {
        try { var p = JSON.parse(s); if (!p || p.v !== 1 || !p.ex) return false; data = p; save(); return true; } catch (e) { return false; }
      }
    };
    return api;
  }
  return { createStore: createStore };
});
```

- [ ] **Step 4: Chạy `npm test`.** Kết quả mong đợi: PASS.

- [ ] **Step 5: Commit** `feat: lưu tiến độ, thành thạo, ôn tập Leitner`.

---

### Task 5: Khung app: render, registry, router, trang chủ, mục lục

**Files:**
- Create: `index.html`, `css/app.css`, `js/core/render.js`, `js/core/app.js`, `content/index.js`
- Test: `tests/render.test.js` (cho hàm `md` thuần)

**Interfaces:**
- Consumes: `TOAN8.createStore` (Task 4); `katex` toàn cục.
- Produces:
  - `TOAN8.md(str) → htmlString`:
    - `$..$` render inline, `$$..$$` render dạng khối, `**x**` thành `<b>`, xuống dòng kép thành đoạn mới;
    - escape HTML phần chữ;
    - macro màu `\ca{}`, `\cb{}`, `\cc{}`, `\cd{}`.
  - `TOAN8.el(tag, attrs, ...children) → Element`.
  - `TOAN8.bai(def)`: đăng kí bài vào `TOAN8.lessons[def.id]`.
  - `TOAN8.mucLuc`: mảng `[{so, ten, tap, bai:[{id, ten, trang}]}]`.
  - `TOAN8.store`: store dùng chung.
  - `TOAN8.widgets = {}`: widget đăng kí `TOAN8.widgets.ten = function (container, config) {}`.
  - `TOAN8.tabs = {khamPha, lyThuyet, viDu, tuLam, timLoi}`: mỗi tab là hàm `(container, bai)`, các task sau gán vào.
  - Hash route: `#/`, `#/bai/<id>/<tab>`, `#/on-tap`.

- [ ] **Step 1: Test `md`.** `render.js` cũng theo UMD. Trong Node, nếu thiếu `katex` thì công thức trả về `<span class="m">..</span>`.

```js
const test = require('node:test'), assert = require('node:assert');
const R = require('../js/core/render.js');
test('escape và đậm', () => {
  assert.strictEqual(R.md('a < b **đậm**'), '<p>a &lt; b <b>đậm</b></p>');
});
test('tách công thức không escape bên trong', () => {
  assert.match(R.md('Ta có $a<b$.'), /<span class="m">a<b<\/span>/);
  assert.match(R.md('$$x^2$$'), /<div class="mb">x\^2<\/div>/);
});
test('đoạn văn', () => {
  assert.strictEqual(R.md('một\n\nhai'), '<p>một</p><p>hai</p>');
});
```

- [ ] **Step 2: `js/core/render.js`**

```js
(function (root, factory) {
  var m = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.md = m.md; root.TOAN8.el = m.el; root.TOAN8.tex = m.tex; }
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  var MACROS = {
    '\\ca': '\\textcolor{#d9480f}{#1}', '\\cb': '\\textcolor{#1971c2}{#1}',
    '\\cc': '\\textcolor{#2f9e44}{#1}', '\\cd': '\\textcolor{#9c36b5}{#1}'
  };
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tex(src, display) {
    var K = root && root.katex;
    if (!K) return display ? '<div class="mb">' + src + '</div>' : '<span class="m">' + src + '</span>';
    return K.renderToString(src, { displayMode: !!display, throwOnError: false, macros: Object.assign({}, MACROS) });
  }
  function inline(s) {
    var out = '', re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, last = 0, m;
    while ((m = re.exec(s))) {
      out += esc(s.slice(last, m.index)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      out += m[1] != null ? tex(m[1], true) : tex(m[2], false);
      last = re.lastIndex;
    }
    return out + esc(s.slice(last)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function md(s) {
    return String(s).split(/\n\s*\n/).map(function (para) {
      var h = inline(para.trim()).replace(/\n/g, '<br>');
      return /^<div class="mb">|^<span class="katex-display">/.test(h) ? h : '<p>' + h + '</p>';
    }).join('');
  }
  function el(tag, attrs) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c == null) continue;
      (Array.isArray(c) ? c : [c]).forEach(function (x) { e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
    }
    return e;
  }
  return { md: md, el: el, tex: tex };
});
```

Sửa test cho khớp: khi có KaTeX, `md('$$x^2$$')` trả về `katex-display` mà không bọc `<p>`. Test chạy trong Node nên nhận nhánh `mb`.

- [ ] **Step 3: `content/index.js`.** Mục lục đủ 10 chương / 39 bài, lấy từ `sach-giao-khoa/muc-luc.md`.

```js
TOAN8.mucLuc = [
  { so: 1, ten: 'Đa thức', tap: 1, mau: '#e8590c', bai: [
    { id: 1, ten: 'Đơn thức', trang: 5 }, { id: 2, ten: 'Đa thức', trang: 11 },
    { id: 3, ten: 'Phép cộng và phép trừ đa thức', trang: 15 }, { id: 4, ten: 'Phép nhân đa thức', trang: 19 },
    { id: 5, ten: 'Phép chia đa thức cho đơn thức', trang: 22 } ] },
  { so: 2, ten: 'Hằng đẳng thức đáng nhớ và ứng dụng', tap: 1, mau: '#1971c2', bai: [
    { id: 6, ten: 'Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', trang: 29 },
    { id: 7, ten: 'Lập phương của một tổng. Lập phương của một hiệu', trang: 34 },
    { id: 8, ten: 'Tổng và hiệu hai lập phương', trang: 37 },
    { id: 9, ten: 'Phân tích đa thức thành nhân tử', trang: 42 } ] },
  { so: 3, ten: 'Tứ giác', tap: 1, mau: '#2f9e44', bai: [
    { id: 10, ten: 'Tứ giác', trang: 48 }, { id: 11, ten: 'Hình thang cân', trang: 52 },
    { id: 12, ten: 'Hình bình hành', trang: 57 }, { id: 13, ten: 'Hình chữ nhật', trang: 64 },
    { id: 14, ten: 'Hình thoi và hình vuông', trang: 67 } ] },
  { so: 4, ten: 'Định lí Thalès', tap: 1, mau: '#9c36b5', bai: [
    { id: 15, ten: 'Định lí Thalès trong tam giác', trang: 76 },
    { id: 16, ten: 'Đường trung bình của tam giác', trang: 81 },
    { id: 17, ten: 'Tính chất đường phân giác của tam giác', trang: 84 } ] },
  { so: 5, ten: 'Dữ liệu và biểu đồ', tap: 1, mau: '#f08c00', bai: [
    { id: 18, ten: 'Thu thập và phân loại dữ liệu', trang: 90 },
    { id: 19, ten: 'Biểu diễn dữ liệu bằng bảng, biểu đồ', trang: 93 },
    { id: 20, ten: 'Phân tích số liệu thống kê dựa vào biểu đồ', trang: 99 } ] },
  { so: 6, ten: 'Phân thức đại số', tap: 2, mau: '#0c8599', bai: [
    { id: 21, ten: 'Phân thức đại số', trang: 4 }, { id: 22, ten: 'Tính chất cơ bản của phân thức đại số', trang: 8 },
    { id: 23, ten: 'Phép cộng và phép trừ phân thức đại số', trang: 15 },
    { id: 24, ten: 'Phép nhân và phép chia phân thức đại số', trang: 20 } ] },
  { so: 7, ten: 'Phương trình bậc nhất và hàm số bậc nhất', tap: 2, mau: '#c2255c', bai: [
    { id: 25, ten: 'Phương trình bậc nhất một ẩn', trang: 27 },
    { id: 26, ten: 'Giải bài toán bằng cách lập phương trình', trang: 33 },
    { id: 27, ten: 'Khái niệm hàm số và đồ thị của hàm số', trang: 40 },
    { id: 28, ten: 'Hàm số bậc nhất và đồ thị của hàm số bậc nhất', trang: 47 },
    { id: 29, ten: 'Hệ số góc của đường thẳng', trang: 51 } ] },
  { so: 8, ten: 'Mở đầu về tính xác suất của biến cố', tap: 2, mau: '#5c940d', bai: [
    { id: 30, ten: 'Kết quả có thể và kết quả thuận lợi', trang: 59 },
    { id: 31, ten: 'Cách tính xác suất của biến cố bằng tỉ số', trang: 63 },
    { id: 32, ten: 'Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng', trang: 67 } ] },
  { so: 9, ten: 'Tam giác đồng dạng', tap: 2, mau: '#3b5bdb', bai: [
    { id: 33, ten: 'Hai tam giác đồng dạng', trang: 78 },
    { id: 34, ten: 'Ba trường hợp đồng dạng của hai tam giác', trang: 83 },
    { id: 35, ten: 'Định lí Pythagore và ứng dụng', trang: 93 },
    { id: 36, ten: 'Các trường hợp đồng dạng của hai tam giác vuông', trang: 98 },
    { id: 37, ten: 'Hình đồng dạng', trang: 104 } ] },
  { so: 10, ten: 'Một số hình khối trong thực tiễn', tap: 2, mau: '#e67700', bai: [
    { id: 38, ten: 'Hình chóp tam giác đều', trang: 112 },
    { id: 39, ten: 'Hình chóp tứ giác đều', trang: 117 } ] }
];
```

- [ ] **Step 4: `index.html`.** Thứ tự nạp script cố định. Danh sách file nội dung khai báo tường minh.

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toán 8 – Học cùng hình động</title>
  <link rel="stylesheet" href="lib/katex/katex.min.css">
  <link rel="stylesheet" href="lib/jsxgraph/jsxgraph.css">
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <header id="top"><a href="#/" class="logo">Toán 8 <small>Kết nối tri thức</small></a>
    <nav><a href="#/on-tap" id="nav-ontap">Ôn 5 câu hôm nay</a></nav></header>
  <div id="warn" hidden></div>
  <main id="app"></main>
  <script src="lib/katex/katex.min.js"></script>
  <script src="lib/jsxgraph/jsxgraphcore.js"></script>
  <script src="lib/nerdamer/nerdamer.js"></script>
  <script>if (!/nomathlive/.test(location.search)) document.write('<script src="lib/mathlive/mathlive.min.js"><\/script>');</script>
  <script src="js/core/parser.js"></script>
  <script src="js/core/checker.js"></script>
  <script src="js/core/store.js"></script>
  <script src="js/core/render.js"></script>
  <script src="js/core/app.js"></script>
  <script src="js/widgets/mathinput.js"></script>
  <script src="js/widgets/stepper.js"></script>
  <script src="js/widgets/practice.js"></script>
  <script src="js/widgets/timloi.js"></script>
  <script src="js/widgets/review.js"></script>
  <script src="js/widgets/tiles.js"></script>
  <script src="js/widgets/geo.js"></script>
  <script src="content/index.js"></script>
  <!-- NOI DUNG: thêm file bài ở đây -->
  <script>TOAN8.start();</script>
</body>
</html>
```

Ở Task 5, những file widget chưa tạo thì tạo sẵn file rỗng chứa `/* Task N */` để trang không lỗi 404 trên console. Task tương ứng sẽ thay nội dung.

- [ ] **Step 5: `js/core/app.js`**

```js
(function (T) {
  'use strict';
  var el = T.el, TABS = [['khamPha', 'Khám phá'], ['lyThuyet', 'Lý thuyết'], ['viDu', 'Ví dụ'], ['tuLam', 'Tự làm'], ['timLoi', 'Tìm lỗi sai']];
  T.lessons = {}; T.widgets = T.widgets || {}; T.tabs = T.tabs || {};
  T.bai = function (def) { T.lessons[def.id] = def; };
  T.findMeta = function (id) {
    for (var i = 0; i < T.mucLuc.length; i++) for (var j = 0; j < T.mucLuc[i].bai.length; j++)
      if (T.mucLuc[i].bai[j].id === id) return { chuong: T.mucLuc[i], meta: T.mucLuc[i].bai[j] };
    return null;
  };

  function safeStorage() { try { return window.localStorage; } catch (e) { return null; } }

  function home(app) {
    app.appendChild(el('section', { class: 'hero' },
      el('h1', null, 'Chào em! Hôm nay mình học bài nào?'),
      el('p', null, 'Mỗi bài có 5 bước: Khám phá → Lý thuyết → Ví dụ → Tự làm → Tìm lỗi sai.')));
    T.mucLuc.forEach(function (c) {
      var grid = el('div', { class: 'grid' });
      c.bai.forEach(function (b) {
        var L = T.lessons[b.id], st = L ? T.store.lessonStatus(L) : null;
        var pct = st && st.total ? Math.round(100 * st.done / st.total) : 0;
        grid.appendChild(el(L ? 'a' : 'div', { class: 'card' + (L ? '' : ' locked') + (st && st.mastered ? ' mastered' : ''), href: L ? '#/bai/' + b.id + '/khamPha' : null, style: '--c:' + c.mau },
          el('span', { class: 'num' }, 'Bài ' + b.id),
          el('span', { class: 'ten' }, b.ten),
          L ? el('span', { class: 'bar' }, el('i', { style: 'width:' + pct + '%' })) : el('span', { class: 'soon' }, 'Sắp có'),
          st && st.mastered ? el('span', { class: 'badge' }, '✓ Thành thạo') : null));
      });
      app.appendChild(el('section', { class: 'chuong', style: '--c:' + c.mau },
        el('h2', null, 'Chương ' + c.so + '. ' + c.ten, el('small', null, ' · SGK Tập ' + c.tap)), grid));
    });
    app.appendChild(el('section', { class: 'backup' },
      el('button', { onclick: exportProgress }, 'Lưu tiến độ ra file'),
      el('label', { class: 'btn' }, 'Mở file tiến độ', el('input', { type: 'file', accept: '.json', hidden: true, onchange: importProgress }))));
  }
  function exportProgress() {
    var a = el('a', { href: URL.createObjectURL(new Blob([T.store.exportJSON()], { type: 'application/json' })), download: 'tien-do-toan8.json' });
    document.body.appendChild(a); a.click(); a.remove();
  }
  function importProgress(ev) {
    var f = ev.target.files[0]; if (!f) return;
    f.text().then(function (s) { T.toast(T.store.importJSON(s) ? 'Đã mở tiến độ.' : 'File không đúng định dạng.'); route(); });
  }
  T.toast = function (msg) {
    var t = el('div', { class: 'toast' }, msg); document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2500);
  };

  function lesson(app, id, tab) {
    var L = T.lessons[id], info = T.findMeta(id);
    if (!L || !info) { app.appendChild(el('p', null, 'Bài này chưa có nội dung.')); return; }
    document.documentElement.style.setProperty('--c', info.chuong.mau);
    var bar = el('nav', { class: 'tabs' });
    TABS.forEach(function (t, i) {
      bar.appendChild(el('a', { href: '#/bai/' + id + '/' + t[0], class: t[0] === tab ? 'on' : (T.store.tabsSeen(id).indexOf(t[0]) >= 0 ? 'seen' : '') }, (i + 1) + '. ' + t[1]));
    });
    var body = el('div', { class: 'tab-body' });
    app.appendChild(el('div', { class: 'lesson-head' },
      el('a', { href: '#/', class: 'back' }, '← Mục lục'),
      el('h1', null, 'Bài ' + id + '. ' + L.ten),
      el('span', { class: 'sgk' }, 'SGK Tập ' + L.sgk.tap + ', trang ' + L.sgk.trang)));
    app.appendChild(bar); app.appendChild(body);
    T.store.markTab(id, tab);
    (T.tabs[tab] || function (c) { c.textContent = 'Tab chưa có.'; })(body, L);
    var idx = TABS.findIndex(function (t) { return t[0] === tab; });
    if (idx < TABS.length - 1) body.appendChild(el('div', { class: 'next' }, el('a', { class: 'btn primary', href: '#/bai/' + id + '/' + TABS[idx + 1][0] }, 'Sang bước ' + (idx + 2) + ': ' + TABS[idx + 1][1] + ' →')));
  }

  function route() {
    var app = document.getElementById('app'); app.innerHTML = '';
    document.documentElement.style.removeProperty('--c');
    var h = location.hash.replace(/^#\/?/, '').split('/');
    try {
      if (h[0] === 'bai') lesson(app, +h[1], h[2] || 'khamPha');
      else if (h[0] === 'on-tap' && T.review) T.review(app);
      else home(app);
    } catch (e) {
      console.error(e);
      app.appendChild(el('p', { class: 'err' }, 'Có lỗi khi hiển thị trang: ' + e.message));
    }
    window.scrollTo(0, 0);
  }
  T.route = route;

  T.start = function () {
    T.store = T.createStore(safeStorage());
    if (!T.store.ok) { var w = document.getElementById('warn'); w.hidden = false; w.textContent = 'Trình duyệt đang chặn lưu dữ liệu – tiến độ sẽ không được lưu sau khi đóng trang.'; }
    window.addEventListener('hashchange', route);
    route();
  };
})(window.TOAN8);
```

- [ ] **Step 6: `css/app.css`.** Các yêu cầu cụ thể:
  - `body{font:18px/1.6 system-ui,"Segoe UI",sans-serif;background:#fbfaf7;color:#212529;margin:0}`
  - `main{max-width:1100px;margin:0 auto;padding:24px}`
  - Thẻ bài `.card`: nền trắng, viền trái 6px màu `var(--c)`, `border-radius:12px`, bóng nhẹ, hover nhấc lên 2px. `.locked` giảm độ đậm còn 0.45.
  - `.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}`
  - `.tabs a`: dạng viên thuốc. `.on` nền `var(--c)` chữ trắng. `.seen` có dấu ✓ (`::after`).
  - `.btn`: cao ≥ 44px, `padding:10px 18px`, bo 10px. `.primary` nền `var(--c,#1971c2)`.
  - Thẻ nội dung:
    - `.the`: nền trắng, bo 14px, padding 20px.
    - `.the.dinhLi`: viền trái màu `var(--c)`.
    - `.the.chuY`: nền vàng nhạt `#fff9db`.
  - Phản hồi:
    - `.fb.dung`: nền `#ebfbee`, viền `#2f9e44`.
    - `.fb.sai`, `.fb.loiThuongGap`: nền `#fff5f5`, viền `#e03131`.
    - `.fb.saiDang`: nền `#fff9db`, viền `#f08c00`.
  - `.board`: `width:100%;aspect-ratio:4/3;max-height:520px;border-radius:12px;background:#fff`.
  - Toast: cố định góc dưới phải.
  - `@media (max-width:700px)`: `main{padding:12px}`, tabs cuộn ngang được.

- [ ] **Step 7: Chạy `npm test`** (có test render). Sau đó mở `index.html` bằng Chrome qua Claude in Chrome (`file:///D:/Appdev2-2026/toan-hoc/index.html`). Kết quả mong đợi:
  - trang chủ hiện đủ 10 chương, các thẻ "Sắp có";
  - console không có lỗi (dùng `read_console_messages`).

- [ ] **Step 8: Commit** `feat: khung app, mục lục 39 bài, router`.

---

### Task 6: Tab Lý thuyết, Khám phá; widget mô hình diện tích và tiện ích hình học

**Files:**
- Create: `js/widgets/tiles.js`, `js/widgets/geo.js`
- Modify: `js/core/app.js` (thêm `T.tabs.lyThuyet`, `T.tabs.khamPha`)

**Interfaces:**
- Consumes: `T.md`, `T.el`, `JXG`, `T.widgets`, `T.mountQuestion` (Task 7; nếu Task 7 chưa có thì tab Khám phá chỉ hiện câu hỏi dạng chữ).
- Produces:
  - Kiểu khối lý thuyết: `{loai:'dinhNghia'|'dinhLi'|'chuY'|'text', tieuDe?, noiDung}`, hoặc `{loai:'hinh', widget, config, chuThich?}`.
  - `bai.khamPha` có dạng `{nhiemVu, widget, config, cauHoi?:{de, dapAn, loiGiai}}`.
  - `T.widgets.dienTich(container, config)`. Config gồm:
    - `{hang:[{nhan:'a', dai:3, mau:'#d9480f'}, …], cot:[…], tru?:boolean, thanhTruot?:[{ten:'a', min, max, buoc}]}`;
    - ô `[i][j]` ghi `nhãnHàng·nhãnCột` dưới dạng KaTeX và tô màu trộn của hàng và cột;
    - thanh trượt đổi `dai` của các đoạn cùng `ten`;
    - dòng tổng diện tích được tính lại theo thanh trượt.
  - `T.widgets.hieuHaiBinhPhuong(container, {a, b})`: hình vuông a² bị khoét b², nút "Cắt và ghép" chạy animation để chuyển thành hình chữ nhật (a+b)×(a−b).
  - `T.widgets.geo(container, {bbox:[x1,y1,x2,y2], build:function(board, G){…}})`. `G` là bộ tiện ích:
    - `G.pt(name, x, y, opts)` tạo điểm kéo được, kích thước 6, màu theo chương;
    - `G.glider(name, x, y, line)`;
    - `G.seg(A, B, opts)`, `G.line(A, B, opts)`, `G.poly([..], opts)`, `G.par(A, line)` (đường song song qua A);
    - `G.inter(l1, l2, name)`;
    - `G.len(A, B) → number`;
    - `G.label(x, y, fnText)` hiện nhãn động; `fnText` trả chuỗi, dùng `G.fmt(n)` để định dạng 2 chữ số thập phân, dấu phẩy;
    - `G.angle(A, O, B, opts)`.

- [ ] **Step 1: `T.tabs.lyThuyet`.** Với mỗi khối:
  - khối chữ: `el('div',{class:'the '+loai, html: (tieuDe? '<h3>'+tieuDe+'</h3>':'') + T.md(noiDung)})`;
  - khối hình: tạo `div.board` rồi gọi `T.widgets[widget](div, config)`, kèm chú thích `md`.

- [ ] **Step 2: `T.tabs.khamPha`.** Thứ tự hiển thị:
  1. hộp "Nhiệm vụ" (md);
  2. widget;
  3. nếu có `cauHoi` thì gọi `T.mountQuestion(container, {id:'kp'+bai.id, de, dapAn, loiGiai:[...]}, {record:false})`;
  4. nếu không có `cauHoi` thì hiện nút "Em đã quan sát xong".

- [ ] **Step 3: `tiles.js`.** Mô hình diện tích bằng SVG:
  - tổng chiều rộng là tổng `dai` của các cột, tỉ lệ để vừa 560px;
  - mỗi ô là `<rect>` tô màu trộn có độ mờ 0.35, nhãn đặt chính giữa là một `foreignObject` chứa `T.tex(nhanH+nhanC)`;
  - nhãn cạnh nằm ở phía trên và bên trái;
  - thanh trượt là `<input type=range>`, `oninput` vẽ lại.

  `hieuHaiBinhPhuong`:
  - vẽ hình vuông a×a, tô vùng b×b ở góc;
  - phần còn lại chia thành 2 hình chữ nhật: (a−b)×a và (a−b)×b;
  - nút bấm dùng CSS transition (transform) để xoay và dời hình chữ nhật nhỏ sang cạnh, tạo thành (a+b)×(a−b);
  - hiện công thức $a^2-b^2=(a+b)(a-b)$.

- [ ] **Step 4: `geo.js`**

```js
(function (T) {
  'use strict';
  var n = 0;
  T.widgets.geo = function (container, cfg) {
    var id = 'jxg' + (++n), div = T.el('div', { id: id, class: 'board' });
    container.appendChild(div);
    var board = JXG.JSXGraph.initBoard(id, { boundingbox: cfg.bbox || [-1, 7, 9, -1], axis: !!cfg.axis, showCopyright: false, showNavigation: false, keepAspectRatio: true, pan: { enabled: false }, zoom: { enabled: false } });
    var C = getComputedStyle(document.documentElement).getPropertyValue('--c').trim() || '#1971c2';
    var G = {
      board: board,
      pt: function (name, x, y, o) { return board.create('point', [x, y], Object.assign({ name: name, size: 6, color: C, label: { fontSize: 18, offset: [8, 8] } }, o)); },
      glider: function (name, x, y, on, o) { return board.create('glider', [x, y, on], Object.assign({ name: name, size: 6, color: '#e8590c', label: { fontSize: 18 } }, o)); },
      seg: function (A, B, o) { return board.create('segment', [A, B], Object.assign({ strokeWidth: 3, strokeColor: '#343a40' }, o)); },
      line: function (A, B, o) { return board.create('line', [A, B], Object.assign({ strokeWidth: 2, strokeColor: '#adb5bd', dash: 2 }, o)); },
      par: function (A, l, o) { return board.create('parallel', [l, A], Object.assign({ strokeWidth: 2, strokeColor: '#adb5bd', dash: 2 }, o)); },
      inter: function (a, b, name, o) { return board.create('intersection', [a, b, 0], Object.assign({ name: name, size: 4, color: '#495057', label: { fontSize: 18 } }, o)); },
      poly: function (pts, o) { return board.create('polygon', pts, Object.assign({ fillOpacity: 0.12, fillColor: C, borders: { strokeWidth: 3 }, vertices: { visible: false } }, o)); },
      angle: function (A, O, B, o) { return board.create('angle', [A, O, B], Object.assign({ radius: 0.6, fillOpacity: 0.3 }, o)); },
      len: function (A, B) { return A.Dist(B); },
      fmt: function (v, d) { return (Math.round(v * Math.pow(10, d == null ? 2 : d)) / Math.pow(10, d == null ? 2 : d)).toString().replace('.', ','); },
      label: function (x, y, fn, o) { return board.create('text', [x, y, fn], Object.assign({ fontSize: 18, fixed: true, cssClass: 'geo-label' }, o)); }
    };
    cfg.build(board, G);
    return board;
  };
})(window.TOAN8);
```

- [ ] **Step 5: Tạo bài thử tạm `content/_demo.js`** gồm 1 khối lý thuyết, 1 hình dienTich và 1 hình geo (tam giác kéo được, có nhãn độ dài). Nạp tạm vào `index.html`. Kiểm tra trên Chrome:
  - kéo được điểm;
  - thanh trượt vẽ lại hình;
  - console không có lỗi;
  - chụp màn hình.

  Xoá `_demo.js` trước khi commit.

- [ ] **Step 6: Commit** `feat: tab lý thuyết, khám phá; widget diện tích, hình học`.

---

### Task 7: Ô nhập, thẻ bài tập, ví dụ từng bước, tìm lỗi sai

**Files:**
- Create: `js/widgets/mathinput.js`, `js/widgets/practice.js`, `js/widgets/stepper.js`, `js/widgets/timloi.js`
- Modify: `js/core/app.js` (gán `T.tabs.viDu`, `T.tabs.tuLam`, `T.tabs.timLoi`)

**Interfaces:**
- Consumes: `T.checker.checkAnswer`, `T.store`, `T.md`, `T.el`, `T.parser.toLatex`, `MathfieldElement` (có thể không tồn tại).
- Produces:
  - `T.mathInput(opts) → {el, getValue():string, setValue(s), focus(), onEnter(fn)}`.
  - `T.mountQuestion(container, q, opts) → {check()}`:
    - `q` gồm `{id, muc?, de, dapAn, goiY?:string[], loiGiai:string[], loiThuongGap?}`;
    - `opts` gồm `{record:true}`.
  - `T.tabs.viDu(container, bai)`, `T.tabs.tuLam(container, bai)`, `T.tabs.timLoi(container, bai)`.
  - Ví dụ mờ dần: `bai.viDuMo[i] = {de, buoc:[{lam, vi, an?:true, dapAn?}]}`. Bước có `an:true` hiện thành ô điền và được chấm bằng `dapAn`.

- [ ] **Step 1: `mathinput.js`**

```js
(function (T) {
  'use strict';
  var mlOk = null;
  function mathliveUsable() {
    if (mlOk !== null) return mlOk;
    try {
      if (!window.MathfieldElement) return (mlOk = false);
      MathfieldElement.fontsDirectory = 'lib/mathlive/fonts';
      MathfieldElement.soundsDirectory = null;
      var probe = new MathfieldElement(); mlOk = typeof probe.getValue === 'function';
    } catch (e) { console.warn('MathLive không dùng được, chuyển sang ô chữ', e); mlOk = false; }
    return mlOk;
  }
  T.mathInput = function (opts) {
    opts = opts || {};
    if (opts.kieu !== 'bieuThuc' || !mathliveUsable()) return textInput(opts);
    var mf = new MathfieldElement();
    mf.className = 'mf';
    mf.mathVirtualKeyboardPolicy = 'manual';
    mf.setAttribute('aria-label', 'Ô nhập đáp án');
    var enter = function () {};
    mf.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enter(); } });
    return {
      el: mf,
      getValue: function () { return mf.getValue('ascii-math'); },
      setValue: function (s) { mf.setValue(s, { format: 'ascii-math' }); },
      focus: function () { mf.focus(); },
      onEnter: function (fn) { enter = fn; }
    };
  };
  function textInput(opts) {
    var inp = T.el('input', { type: 'text', class: 'ti', autocomplete: 'off', spellcheck: 'false', placeholder: opts.kieu === 'nghiem' ? 'vd: x = 2; x = -3' : opts.kieu === 'so' ? 'vd: 12 hoặc 0,5 hoặc 3/4' : 'vd: x^2 + 6x + 9' });
    var prev = T.el('div', { class: 'preview' }), box = T.el('div', { class: 'ti-box' }, inp, prev), enter = function () {};
    inp.addEventListener('input', function () {
      if (opts.kieu !== 'bieuThuc') { prev.innerHTML = ''; return; }
      try { prev.innerHTML = inp.value.trim() ? T.tex(T.parser.toLatex(T.parser.parse(inp.value))) : ''; } catch (e) { prev.textContent = '…'; }
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') enter(); });
    return { el: box, getValue: function () { return inp.value; }, setValue: function (s) { inp.value = s; inp.dispatchEvent(new Event('input')); }, focus: function () { inp.focus(); }, onEnter: function (fn) { enter = fn; } };
  }
  T.mathInputMode = function () { return mathliveUsable() ? 'mathlive' : 'text'; };
})(window.TOAN8);
```

- [ ] **Step 2: `practice.js`.** Hàm `T.mountQuestion`.

```js
(function (T) {
  'use strict';
  var el = T.el;
  function answerControl(d) {
    if (d.kieu === 'chon') {
      var val = null, wrap = el('div', { class: 'choices' });
      d.luaChon.forEach(function (c, i) {
        var b = el('button', { class: 'choice', html: T.md(c), onclick: function () { val = i; [].forEach.call(wrap.children, function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); } });
        wrap.appendChild(b);
      });
      return { el: wrap, getValue: function () { return val; }, onEnter: function () {} };
    }
    if (d.kieu === 'dungSai') {
      var v = null, w = el('div', { class: 'choices' });
      [['Đúng', true], ['Sai', false]].forEach(function (p) {
        var b = el('button', { class: 'choice', onclick: function () { v = p[1]; [].forEach.call(w.children, function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); } }, p[0]);
        w.appendChild(b);
      });
      return { el: w, getValue: function () { return v; }, onEnter: function () {} };
    }
    if (d.kieu === 'nhieuO') {
      var subs = d.o.map(function (sub) { return T.mathInput({ kieu: sub.kieu }); });
      var g = el('div', { class: 'nhieu-o' });
      subs.forEach(function (s, i) { g.appendChild(el('label', { class: 'o' }, el('span', { html: T.md(d.o[i].nhan || ('Ô ' + (i + 1))) }), s.el)); });
      return { el: g, subs: subs, getValue: function () { return subs.map(function (s) { return s.getValue(); }); }, onEnter: function (fn) { subs.forEach(function (s) { s.onEnter(fn); }); } };
    }
    return T.mathInput({ kieu: d.kieu });
  }

  T.mountQuestion = function (container, q, opts) {
    opts = opts || { record: true };
    var hints = q.goiY || [], hintMax = hints.length + 1, level = 0;
    var ctl = answerControl(q.dapAn);
    var fb = el('div', { class: 'fb', hidden: true, role: 'status' });
    var hintBox = el('div', { class: 'hints' });
    var hintBtn = el('button', { class: 'btn ghost', onclick: showHint }, hints.length ? 'Gợi ý (1/' + hintMax + ')' : 'Xem lời giải');
    var card = el('div', { class: 'q muc' + (q.muc || 1) },
      el('div', { class: 'q-de', html: (q.muc ? '<span class="muc-tag">Mức ' + q.muc + '</span>' : '') + T.md(q.de) }),
      q.hinh ? el('div', { class: 'q-hinh' }) : null,
      el('div', { class: 'q-input' }, ctl.el, el('button', { class: 'btn primary', onclick: check }, 'Kiểm tra')),
      fb, el('div', { class: 'q-actions' }, hintBtn), hintBox);
    container.appendChild(card);
    if (q.hinh) T.widgets[q.hinh.widget](card.querySelector('.q-hinh'), q.hinh.config);
    ctl.onEnter(check);
    var st = opts.record ? T.store.exState(q.id) : null;
    if (st && st.correct) card.classList.add('done');

    function showHint() {
      if (level >= hintMax) return;
      level++;
      if (level <= hints.length) hintBox.appendChild(el('div', { class: 'hint', html: '<b>Gợi ý ' + level + ':</b> ' + T.md(hints[level - 1]) }));
      else hintBox.appendChild(solution());
      hintBtn.textContent = level < hints.length ? 'Gợi ý (' + (level + 1) + '/' + hintMax + ')' : level === hints.length ? 'Xem lời giải' : 'Đã hiện lời giải';
      hintBtn.disabled = level >= hintMax;
    }
    function solution() {
      var s = el('div', { class: 'loigiai' }, el('h4', null, 'Lời giải'));
      q.loiGiai.forEach(function (b) { s.appendChild(el('div', { class: 'buoc', html: T.md(b) })); });
      return s;
    }
    function check() {
      var v = ctl.getValue();
      if (v == null || (typeof v === 'string' && !v.trim())) { show({ code: 'khongDoc', msg: 'Em chưa nhập đáp án.' }); return; }
      var r;
      try { r = T.checker.checkAnswer(q.dapAn, v, q.loiThuongGap); }
      catch (e) { console.error(e); r = { ok: false, code: 'khongDoc', msg: 'Máy chưa đọc được đáp án này.' }; }
      show(r);
      if (r.tungO && ctl.subs) ctl.subs.forEach(function (s, i) { s.el.classList.toggle('o-sai', !r.tungO[i].ok); });
      if (opts.record && r.code !== 'khongDoc') T.store.recordAttempt(q.id, { ok: r.ok, hintLevel: level, hintMax: hintMax });
      if (r.ok) card.classList.add('done');
      if (opts.onResult) opts.onResult(r);
    }
    function show(r) {
      fb.hidden = false; fb.className = 'fb ' + r.code;
      fb.innerHTML = (r.ok ? '✔ ' : r.code === 'saiDang' ? '◐ ' : '✘ ') + T.md(r.msg).replace(/^<p>|<\/p>$/g, '');
      if (r.ok && level < hintMax) fb.appendChild(el('button', { class: 'link', onclick: function () { hintBox.appendChild(solution()); this.remove(); } }, 'Xem lời giải mẫu'));
    }
    return { check: check };
  };

  T.tabs.tuLam = function (c, bai) {
    [1, 2, 3].forEach(function (m) {
      var list = bai.baiTap.filter(function (x) { return x.muc === m; });
      if (!list.length) return;
      c.appendChild(el('h2', { class: 'muc-h' }, ['', 'Mức 1 – Nhận biết', 'Mức 2 – Thông hiểu', 'Mức 3 – Vận dụng'][m]));
      list.forEach(function (q) { T.mountQuestion(c, q, { record: true }); });
    });
    var st = T.store.lessonStatus(bai);
    c.insertBefore(el('div', { class: 'status' }, 'Em đã làm đúng ' + st.done + '/' + st.total + ' bài.' + (st.mastered ? ' 🎉 Em đã thành thạo bài này!' : ' Thành thạo khi đúng 80% bài mức 1–2 (không xem lời giải) và 1 bài mức 3.')), c.firstChild);
  };
})(window.TOAN8);
```

Ghi chú: lời giải mẫu hiện sau khi em làm đúng không tính là "dùng lời giải", vì không gọi `recordAttempt` lần nữa.

- [ ] **Step 3: `stepper.js`.** `T.tabs.viDu`:
  - Với mỗi `bai.viDu[i]`: thẻ có tiêu đề "Ví dụ i", đề bài (md), danh sách bước. Ban đầu hiện bước 1. Nút "Bước tiếp ▸" hiện bước kế tiếp, nút "Hiện hết" hiện mọi bước.
  - Mỗi bước gồm dòng `lam` (md) và nút nhỏ "Vì sao?". Nút này bật/tắt dòng `vi` in nghiêng màu `var(--c)`.
  - Sau đó là tiêu đề "Em thử điền bước còn thiếu". Với mỗi `bai.viDuMo[i]`:
    - bước thường hiện đầy đủ;
    - bước `an:true` hiện câu hỏi bằng `T.mountQuestion(div, {id:'vdm'+bai.id+'.'+i+'.'+k, de: buoc.vi, dapAn: buoc.dapAn, loiGiai:[buoc.lam]}, {record:false})`;
    - các bước sau một bước ẩn chỉ hiện khi bước ẩn đã đúng (dùng `onResult`).

- [ ] **Step 4: `timloi.js`.** `T.tabs.timLoi`:
  - Với mỗi `bai.timLoi[i]`: đề bài, và lời giải của "bạn Nam" gồm các dòng là `<button class="dong">`.
  - Bấm vào một dòng:
    - đúng dòng sai: tô đỏ, hiện `giaiThich` (md) và nếu có `sua` thì hiện dòng "Sửa lại: …";
    - không phải dòng sai: hiện "Dòng này đúng rồi, em tìm tiếp nhé".
  - Không ghi vào store.

- [ ] **Step 5: Kiểm tra trên Chrome bằng bài `_demo.js`.** Bài demo gồm 1 ví dụ, 1 ví dụ mờ dần, 3 bài tập (bieuThuc khaiTrien, nghiem, nhieuO) và 1 bài tìm lỗi sai. Kiểm tra:
  - gõ `x^2+9` thì hiện lời giải thích lỗi thường gặp;
  - gõ `(x+3)^2` thì hiện thông báo vàng "saiDang";
  - mở `index.html?nomathlive#/bai/<demo>/tuLam` thì ô chữ có xem trước KaTeX chạy được;
  - với MathLive: ô nhập hiện ra, `getValue` trả về ascii-math;
  - nếu MathLive báo lỗi font qua file://, giữ cấu hình `fontsDirectory` như trên, hoặc chuyển mặc định sang ô chữ (đặt `mlOk=false`) và ghi lại quyết định này vào README.

  Sau đó reload và kiểm tra tiến độ vẫn còn. Xoá `_demo.js`.

- [ ] **Step 6: Commit** `feat: ô nhập, bài tập có gợi ý 3 nấc, ví dụ từng bước, tìm lỗi sai`.

---

### Task 8: Ôn 5 câu hôm nay (`js/widgets/review.js`)

**Files:**
- Create: `js/widgets/review.js`

**Interfaces:**
- Consumes: `T.store.dueToday`, `T.store.exState`, `T.lessons`, `T.mountQuestion`.
- Produces: `T.review(container)`.

- [ ] **Step 1: Cài đặt**

```js
(function (T) {
  'use strict';
  T.findExercise = function (id) {
    for (var k in T.lessons) { var L = T.lessons[k]; for (var i = 0; i < L.baiTap.length; i++) if (L.baiTap[i].id === id) return { bai: L, q: L.baiTap[i] }; }
    return null;
  };
  T.review = function (c) {
    var due = T.store.dueToday(5).map(T.findExercise).filter(Boolean);
    if (due.length < 5) {   // bù bằng bài đã làm đúng ở các bài khác nhau (xen kẽ)
      var pool = [];
      Object.keys(T.lessons).forEach(function (k) { T.lessons[k].baiTap.forEach(function (q) { var s = T.store.exState(q.id); if (s && s.correct && q.muc <= 2) pool.push({ bai: T.lessons[k], q: q }); }); });
      pool.sort(function () { return Math.random() - 0.5; });
      var used = {}; due.forEach(function (x) { used[x.q.id] = 1; });
      for (var i = 0; i < pool.length && due.length < 5; i++) if (!used[pool[i].q.id]) { due.push(pool[i]); used[pool[i].q.id] = 1; }
    }
    c.appendChild(T.el('h1', null, 'Ôn 5 câu hôm nay'));
    if (!due.length) { c.appendChild(T.el('p', null, 'Chưa có câu nào để ôn. Em làm bài tập ở một bài học trước nhé!')); return; }
    c.appendChild(T.el('p', null, 'Các câu được trộn từ nhiều bài – trộn lẫn giúp em nhớ lâu hơn.'));
    due.forEach(function (x) {
      c.appendChild(T.el('div', { class: 'from' }, 'Từ Bài ' + x.bai.id + '. ' + x.bai.ten));
      T.mountQuestion(c, x.q, { record: true });
    });
  };
})(window.TOAN8);
```

- [ ] **Step 2: Kiểm tra trên Chrome:**
  - làm sai 1 câu;
  - trong console chạy lệnh dời ngày để kiểm tra: `TOAN8.store = TOAN8.createStore(localStorage, () => new Date(Date.now() + 864e5))`;
  - mở `#/on-tap`: câu sai phải xuất hiện.

- [ ] **Step 3: Commit** `feat: ôn tập 5 câu mỗi ngày`.

---

### Task 9: Kiểm tra nội dung tự động (`tools/validate-content.js`)

**Files:**
- Create: `tools/validate-content.js`
- Test: chạy trên file mẫu `tests/fixtures/bai-sai.js` (cố ý sai) và `tests/fixtures/bai-dung.js`

**Interfaces:**
- Consumes: `checker`, `parser` (Node). Nạp từng file `content/bai*.js` vào `vm` có `TOAN8 = {bai: fn}`.
- Produces: `node tools/validate-content.js [file…]`. Thoát với mã 1 nếu có lỗi, in mỗi lỗi một dòng `bai06 6.3: …`.

**Các luật kiểm tra:**
1. Có đủ trường `id`, `ten`, `sgk.tap`, `sgk.trang`, `khamPha.nhiemVu`, `lyThuyet` (≥ 1), `viDu` (≥ 2), `viDuMo` (≥ 1, mỗi ví dụ có ≥ 1 bước `an` kèm `dapAn`), `baiTap` (8–12), `timLoi` (≥ 1, `dongSai` nằm trong khoảng hợp lệ).
2. Số bài tập theo mức: ≥ 3 bài mức 1, ≥ 3 bài mức 2, ≥ 1 bài mức 3. `id` các bài tập không trùng nhau trên toàn bộ nội dung.
3. Mỗi bài tập có `goiY` (≥ 1) và `loiGiai` (≥ 1). Kiểu `chon` có `luaChon` và `gt` nằm trong khoảng.
4. `bieuThuc`:
   - `checkAnswer(dapAn, dapAn.gt).code === 'dung'` (đáp án đúng với dạng nó yêu cầu);
   - mọi `loiThuongGap.gt` không tương đương với `gt`;
   - nếu dòng cuối của `loiGiai` có dạng `... = <biểu thức>$` thì biểu thức cuối đó tương đương `gt`. Bắt bằng regex `/=\s*([^=$]+)\$\s*\.?\s*$/`, sau khi bỏ `\left`, `\right`, `\cdot`, đổi `^{n}` thành `^n`. Nếu parse không được thì bỏ qua luật này, không báo lỗi.
5. `so` và `nghiem`: `checkAnswer(dapAn, String(gt))` cho kết quả đúng.
6. `md` không còn `$` lẻ: số dấu `$` trong mọi chuỗi phải chẵn.

- [ ] **Step 1: Viết hai fixture.** `bai-dung.js` là một bài tối thiểu hợp lệ. `bai-sai.js` có:
  - `gt` dạng `nhanTu` là `x^2-9`;
  - `loiThuongGap` trùng với đáp án;
  - chỉ có 2 bài tập.

  Viết `tests/validate.test.js`: chạy script bằng `child_process.spawnSync('node', ['tools/validate-content.js', fixture])`. Kết quả mong đợi: fixture đúng cho mã 0; fixture sai cho mã 1 và đầu ra chứa `nhanTu`, `loiThuongGap`, `baiTap`.

- [ ] **Step 2: Chạy test.** Kết quả mong đợi: FAIL.

- [ ] **Step 3: Cài đặt script** theo các luật trên. Không truyền file thì quét `content/bai*.js`.

- [ ] **Step 4: Chạy `npm test`.** Kết quả mong đợi: PASS.

- [ ] **Step 5: Commit** `test: kiểm tra nội dung bài học tự động`.

---

## Quy trình soạn nội dung (dùng cho Task 10–12)

**A. Đọc SGK.** Render các trang của bài thành ảnh PNG để đọc:

```bash
python -I -c "import fitz,sys; d=fitz.open(sys.argv[1]); [d[i].get_pixmap(dpi=110).save(f'{sys.argv[2]}/t{sys.argv[3]}-p{i+1:03d}.png') for i in range(int(sys.argv[4])-1,int(sys.argv[5]))]" sach-giao-khoa/Toan8-KNTT-Tap1.pdf sach-giao-khoa/pages 1 29 33
```

Thư mục `sach-giao-khoa/pages/` đã nằm trong .gitignore. Đọc ảnh bằng Read. Ghi lại:
- định nghĩa, định lí, quy tắc đúng như SGK phát biểu (được phép diễn đạt lại cho dễ hiểu, nhưng không đổi nghĩa);
- kí hiệu SGK dùng;
- các dạng bài trong mục "Luyện tập", "Vận dụng" và "Bài tập".

**B. Viết `content/baiNN.js`** theo khuôn mẫu ở mục C:
- bài tập tự soạn với số liệu mới;
- `loiThuongGap` lấy từ các lỗi thật của học sinh lớp 8 (ví dụ (A+B)² = A² + B²; quên đổi dấu khi bỏ ngoặc có dấu trừ; cộng cả số mũ khi cộng đơn thức đồng dạng; rút gọn phân thức theo từng hạng tử; nhầm tỉ số Thalès AM/MB với AM/AB);
- lời giải viết từng bước, mỗi bước một dòng.

**C. Khuôn mẫu.** Bài 6 rút gọn, dùng làm mẫu chuẩn. Các bài khác dùng đúng các trường này.

```js
TOAN8.bai({
  id: 6, ten: 'Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', sgk: { tap: 1, trang: 29 },
  khamPha: {
    nhiemVu: 'Kéo thanh trượt **a** và **b**. Hình vuông lớn có cạnh $a+b$ được chia thành 4 mảnh. Em hãy quan sát diện tích từng mảnh.',
    widget: 'dienTich',
    config: { hang: [{ nhan: 'a', ten: 'a', dai: 3, mau: '#d9480f' }, { nhan: 'b', ten: 'b', dai: 2, mau: '#1971c2' }],
              cot:  [{ nhan: 'a', ten: 'a', dai: 3, mau: '#d9480f' }, { nhan: 'b', ten: 'b', dai: 2, mau: '#1971c2' }],
              thanhTruot: [{ ten: 'a', min: 1, max: 6, buoc: 0.5 }, { ten: 'b', min: 1, max: 6, buoc: 0.5 }] },
    cauHoi: { de: 'Hình vuông cạnh $a+b$ gồm mấy hình chữ nhật có diện tích $ab$?', dapAn: { kieu: 'so', gt: 2 },
              loiGiai: ['Có hai mảnh $a \\times b$ nên tổng diện tích là $a^2 + \\ca{2ab} + b^2$.'] }
  },
  lyThuyet: [
    { loai: 'dinhLi', tieuDe: 'Bình phương của một tổng', noiDung: '$$(\\ca{A}+\\cb{B})^2 = \\ca{A}^2 + 2\\ca{A}\\cb{B} + \\cb{B}^2$$' },
    { loai: 'hinh', widget: 'dienTich', config: { /* như trên */ }, chuThich: 'Mỗi mảnh màu ứng với một hạng tử.' },
    { loai: 'chuY', noiDung: '**Hay nhầm:** $(A+B)^2 \\ne A^2 + B^2$. Em đừng quên hạng tử $2AB$!' }
  ],
  viDu: [
    { de: 'Khai triển $(x+3)^2$.', buoc: [
      { lam: '$(x+3)^2 = x^2 + 2\\cdot x\\cdot 3 + 3^2$', vi: 'Áp dụng bình phương của một tổng với $A = x$, $B = 3$.' },
      { lam: '$= x^2 + 6x + 9$', vi: 'Tính $2\\cdot x\\cdot 3 = 6x$ và $3^2 = 9$.' } ] },
    { de: 'Tính nhanh $101^2$.', buoc: [
      { lam: '$101^2 = (100+1)^2$', vi: 'Viết 101 thành tổng của hai số dễ bình phương.' },
      { lam: '$= 10000 + 200 + 1 = 10201$', vi: '$A^2 = 10000$, $2AB = 200$, $B^2 = 1$.' } ] }
  ],
  viDuMo: [
    { de: 'Khai triển $(2x-1)^2$.', buoc: [
      { lam: '$(2x-1)^2 = (2x)^2 - 2\\cdot 2x\\cdot 1 + 1^2$', vi: 'Bình phương của một hiệu với $A = 2x$, $B = 1$.' },
      { lam: '$= 4x^2 - 4x + 1$', vi: 'Em hãy tính kết quả cuối cùng:', an: true, dapAn: { kieu: 'bieuThuc', gt: '4x^2-4x+1', dang: 'khaiTrien' } } ] }
  ],
  baiTap: [
    { id: '6.1', muc: 1, de: 'Khai triển $(x+5)^2$.', dapAn: { kieu: 'bieuThuc', gt: 'x^2+10x+25', dang: 'khaiTrien' },
      goiY: ['Dùng $(A+B)^2 = A^2 + 2AB + B^2$.', '$A = x$, $B = 5$. Vậy $2AB = ?$'],
      loiGiai: ['$(x+5)^2 = x^2 + 2\\cdot x\\cdot 5 + 5^2$', '$= x^2 + 10x + 25$'],
      loiThuongGap: [{ gt: 'x^2+25', giaiThich: 'Em quên hạng tử $2AB = 10x$ rồi. $(A+B)^2 \\ne A^2 + B^2$.' },
                     { gt: 'x^2+5x+25', giaiThich: 'Hạng tử giữa là $2AB$, tức $2\\cdot x\\cdot 5 = 10x$, không phải $5x$.' }] }
    /* … 8–12 bài */
  ],
  timLoi: [
    { de: 'Bạn Nam khai triển $(x-4)^2$ như sau. Dòng nào sai?',
      loiGiaiSai: ['$(x-4)^2 = x^2 - 2\\cdot x\\cdot 4 + 4^2$', '$= x^2 - 8x - 16$'],
      dongSai: 1, giaiThich: '$B^2 = 4^2 = 16$ luôn **dương**, nên phải là $+16$.', sua: '$= x^2 - 8x + 16$' }
  ]
});
```

**D. Sau mỗi file:**
- chạy `node tools/validate-content.js content/baiNN.js` cho tới khi sạch lỗi;
- thêm `<script src="content/baiNN.js"></script>` vào `index.html` dưới dòng `<!-- NOI DUNG -->`;
- mở trên Chrome và đi qua đủ 5 tab;
- xem console không có lỗi.

**E. Sau mỗi chương:** dispatch một agent độc lập (general-purpose). Agent này chỉ đọc file `content/` của chương, tự giải lại từng bài tập, từng ví dụ và từng bài tìm lỗi sai, rồi báo các chỗ sai toán, đáp án không khớp lời giải, hoặc lời lẽ khó hiểu với học sinh lớp 8. Sửa hết các lỗi agent báo, sau đó commit.

---

### Task 10: Nội dung Chương I – Đa thức (Bài 1–5, SGK Tập 1 tr. 5–27)

**Files:** Create `content/bai01.js` … `content/bai05.js`. Modify `index.html`.

Bảng sau ghi các yêu cầu bắt buộc. Phải đọc SGK theo quy trình A để bổ sung phần còn thiếu.

| Bài | Khám phá (widget) | Lý thuyết cốt lõi | Dạng bài tập bắt buộc | Lỗi thường gặp cần bắt |
|---|---|---|---|---|
| 1 Đơn thức (tr.5) | `dienTich`: hình chữ nhật 3x × 2y → đơn thức 6xy | Đơn thức, đơn thức thu gọn, hệ số, phần biến, bậc. Đơn thức đồng dạng. Cộng/trừ đơn thức đồng dạng | Nhận biết đơn thức (`chon`/`dungSai`), thu gọn (`bieuThuc` khaiTrien), bậc (`so`), cộng đơn thức đồng dạng, tính giá trị (`so`) | cộng cả số mũ: $2x^2+3x^2=5x^4$; bậc của $5x^2y^3$ là 3 |
| 2 Đa thức (tr.11) | `chon`: chọn các hạng tử đồng dạng trong một đa thức (bỏ widget, dùng cauHoi) | Đa thức, hạng tử, thu gọn, bậc của đa thức | Thu gọn, tìm bậc, tính giá trị tại x, y | bậc đa thức = tổng bậc các hạng tử |
| 3 Cộng trừ đa thức (tr.15) | `dienTich` ghép hai hình chữ nhật | Quy tắc bỏ ngoặc, nhóm hạng tử đồng dạng | Cộng, trừ, tìm đa thức M thỏa M + A = B | không đổi dấu khi bỏ ngoặc sau dấu trừ |
| 4 Nhân đa thức (tr.19) | `dienTich` (x+2)(x+3) bằng 4 mảnh | Nhân đơn thức với đa thức, đa thức với đa thức | Khai triển (khaiTrien), rút gọn biểu thức, chứng minh giá trị không phụ thuộc biến (`so`) | quên nhân hết các hạng tử; $x\cdot x = 2x$ |
| 5 Chia đa thức cho đơn thức (tr.22) | `cauHoi`: $6x^3 : 2x = ?$ kèm hình chữ nhật diện tích/cạnh | Chia đơn thức cho đơn thức (điều kiện chia hết), chia đa thức cho đơn thức | Thực hiện phép chia, xét tính chia hết (`dungSai`), tìm thương | trừ hệ số thay vì chia; chia số mũ |

- [ ] **Step 1:** Đọc SGK tr. 5–27 (quy trình A).
- [ ] **Step 2:** Viết `bai01.js`, chạy validate, xem trên Chrome.
- [ ] **Step 3:** `bai02.js`, như Step 2.
- [ ] **Step 4:** `bai03.js`.
- [ ] **Step 5:** `bai04.js`.
- [ ] **Step 6:** `bai05.js`.
- [ ] **Step 7:** Agent soát toán độc lập (quy trình E), sửa lỗi.
- [ ] **Step 8:** Commit `content: chương I đa thức`.

### Task 11: Nội dung Chương II – Hằng đẳng thức (Bài 6–9, SGK Tập 1 tr. 29–47)

**Files:** Create `content/bai06.js` … `content/bai09.js`. Modify `index.html`.

| Bài | Khám phá | Lý thuyết | Dạng bài tập | Lỗi thường gặp |
|---|---|---|---|---|
| 6 (tr.29) | `dienTich` (a+b)²; lý thuyết thêm `hieuHaiBinhPhuong` | Khái niệm hằng đẳng thức; 3 HĐT: $(A+B)^2$, $(A-B)^2$, $A^2-B^2$ | Khai triển; viết thành bình phương/tích (nhanTu); tính nhanh ($99^2$, $52\cdot 48$) (`so`) | $(A+B)^2=A^2+B^2$; $(A-B)^2=A^2-B^2$; $-B^2$ |
| 7 (tr.34) | `dienTich` dạng bậc 3 chia lớp. Nếu khó thì dùng `geo` với 8 khối lập phương vẽ phẳng, hoặc `cauHoi` kết hợp nhân $(a+b)^2(a+b)$ | $(A+B)^3$, $(A-B)^3$ | Khai triển, viết dưới dạng lập phương (nhanTu), tính giá trị nhanh | $(A+B)^3=A^3+B^3$; sai dấu ở $(A-B)^3$ |
| 8 (tr.37) | `cauHoi` kiểm chứng bằng số: tính $2^3+1^3$ và $(2+1)(4-2+1)$ | $A^3+B^3$, $A^3-B^3$ | Viết thành tích (nhanTu), rút gọn biểu thức | nhầm với $(A+B)^3$; dấu của $AB$ trong thừa số thứ hai |
| 9 (tr.42) | `dienTich` ngược: cho tổng diện tích, tìm cạnh | Đặt nhân tử chung, dùng HĐT, nhóm hạng tử | Phân tích (nhanTu) đủ 3 phương pháp; tìm x từ tích bằng 0 (`nghiem`); tính nhanh | đặt nhân tử chưa hết ($2x^2-4x = 2(x^2-2x)$, checker trả saiDang); bỏ sót nghiệm |

- [ ] **Step 1:** Đọc SGK tr. 29–47.
- [ ] **Step 2:** Viết `bai06.js`, theo đúng khuôn mẫu C và mở rộng đủ 8–12 bài tập. Validate, xem trên Chrome.
- [ ] **Step 3:** `bai07.js`.
- [ ] **Step 4:** `bai08.js`.
- [ ] **Step 5:** `bai09.js`. Bắt buộc có ≥ 1 bài `nghiem`, và ≥ 1 bài tìm lỗi sai kiểu "phân tích chưa triệt để".
- [ ] **Step 6:** Agent soát toán, sửa lỗi.
- [ ] **Step 7:** Commit `content: chương II hằng đẳng thức`.

### Task 12: Nội dung Chương IV – Định lí Thalès (Bài 15–17, SGK Tập 1 tr. 76–89)

**Files:** Create `content/bai15.js`, `bai16.js`, `bai17.js`. Modify `index.html`.

Khám phá hình học dùng `geo`. Ví dụ build cho Bài 15:

```js
build: function (board, G) {
  var A = G.pt('A', 3, 6), B = G.pt('B', 0, 0), C = G.pt('C', 8, 0);
  G.poly([A, B, C], { fillOpacity: 0.05 });
  var AB = G.seg(A, B), AC = G.seg(A, C), BC = G.seg(B, C);
  var M = G.glider('M', 1.5, 3, AB);
  var d = G.par(M, BC), N = G.inter(d, AC, 'N');
  G.seg(M, N, { strokeColor: '#e8590c', strokeWidth: 4 });
  G.label(0.2, 6.6, function () { return 'AM/AB = ' + G.fmt(G.len(A, M) / G.len(A, B)); });
  G.label(4.8, 6.6, function () { return 'AN/AC = ' + G.fmt(G.len(A, N) / G.len(A, C)); });
}
```

Nhiệm vụ: "Kéo điểm M trên cạnh AB (đường cam luôn song song với BC). Hai tỉ số thay đổi thế nào?". Câu hỏi chốt (`chon`): "Hai tỉ số luôn bằng nhau / AM/AB lớn hơn / không có quy luật".

| Bài | Khám phá | Lý thuyết | Dạng bài tập (có `hinh` geo cố định cho đề) | Lỗi thường gặp |
|---|---|---|---|---|
| 15 (tr.76) | như trên | Đoạn thẳng tỉ lệ; định lí Thalès thuận; định lí Thalès đảo; hệ quả | Tính độ dài (`so`) bằng Thalès/hệ quả; nhận biết MN // BC từ tỉ số (`dungSai`); bài thực tế đo chiều rộng sông | lập AM/MB = AN/AC (lệch đoạn); dùng định lí khi chưa có song song |
| 16 (tr.81) | `geo`: M, N là trung điểm, kéo A, B, C → hiện MN, BC/2, góc đồng vị | Định nghĩa đường trung bình; tính chất song song và bằng nửa cạnh đáy | Tính độ dài (`so`); tính chu vi tam giác tạo bởi 3 đường trung bình; bài thực tế (khoảng cách hai đầu hồ) | MN = 2BC; nhầm đường trung bình với trung tuyến |
| 17 (tr.84) | `geo`: AD phân giác góc A (tạo bằng `board.create('bisector')` rồi giao với BC), hiện DB/DC và AB/AC | Tính chất đường phân giác: DB/DC = AB/AC | Tính DB, DC (`so`, `nhieuO`); tìm tỉ số; vận dụng tính cạnh | DB/DC = AC/AB (đảo ngược); quên DB + DC = BC |

- [ ] **Step 1:** Đọc SGK tr. 76–89.
- [ ] **Step 2:** `bai15.js`: hình cho đề dùng `hinh:{widget:'geo', config:{bbox, build}}` với điểm `fixed:true`. Validate và xem trên Chrome.
- [ ] **Step 3:** `bai16.js`.
- [ ] **Step 4:** `bai17.js`.
- [ ] **Step 5:** Agent soát toán, sửa lỗi.
- [ ] **Step 6:** Commit `content: chương IV định lí Thalès`.

---

### Task 13: Nghiệm thu giai đoạn 1

**Files:** Modify `README.md` (thêm hướng dẫn cho phụ huynh, thêm phần những gì chưa có).

- [ ] **Step 1:** Chạy `npm test` và `npm run validate`. Cả hai phải PASS và không có lỗi.
- [ ] **Step 2:** Trên Chrome, mở `file:///D:/Appdev2-2026/toan-hoc/index.html`, quay GIF `toan8-nghiem-thu.gif`:
  - vào trang chủ, chọn Bài 6;
  - kéo thanh trượt ở tab Khám phá;
  - xem lý thuyết;
  - bấm hết các bước một ví dụ;
  - làm 1 bài đúng, 1 bài gõ lỗi thường gặp, 1 bài sai dạng;
  - mở gợi ý;
  - tìm lỗi sai;
  - quay về trang chủ: vòng tiến độ phải tăng.

  Sau đó lặp lại với Bài 15 (kéo M).
- [ ] **Step 3:** Mở `?nomathlive` để kiểm tra ô chữ. Kiểm tra console sạch ở 12 bài, mỗi bài đi qua đủ 5 tab.
- [ ] **Step 4:** Dispatch `typescript-reviewer` (JS) và `silent-failure-hunter` song song để soát `js/`. Sửa lỗi có thật.
- [ ] **Step 5:** Commit `docs: hướng dẫn sử dụng, nghiệm thu GĐ1`.
