# Tự chạy hình động, Luyện thêm, Ôn kiến thức cũ, In phiếu, Nháp – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hình động tự chạy khi hiện ra (chạm là dừng); tab "6. Luyện thêm" sinh bài vô hạn có mức thích ứng; bài nền lớp 6–7 + kiểm tra đầu chương; in phiếu có đáp án; nháp vẽ tay.

**Architecture:** Thêm lõi thuần (UMD, chạy cả Node) `js/core/rng.js` (ngẫu nhiên có hạt giống + công cụ định dạng) và `js/core/luyen.js` (chọn dạng, mức thích ứng); widget trình duyệt `autoplay.js`, `luyen.js`, `nen.js`, `phieu.js`, `nhap.js`. Nội dung mới ở `content/luyen/luyenNN.js` và `content/nen/*.js`, kiểm bằng validator sinh 300 đề/dạng. Tự chạy gắn tập trung ở `T.mountWidget` (chỉ cho khamPha và hình lý thuyết), dựng trình tự mặc định từ DOM/JSXGraph, hoặc chạy kịch bản `config.tuChay`.

**Tech Stack:** JS ES5-style classic scripts, KaTeX, JSXGraph 1.14.2, MathLive, nerdamer; Node 24 `node --test`; puppeteer-core + Edge chạy ngầm.

**Spec:** `docs/superpowers/specs/2026-11-02-toan8-tu-chay-luyen-them-design.md`

## Global Constraints
- Web tĩnh chạy qua `file://` và GitHub Pages; chỉ `<script>` thường – không ES module, không `fetch`, không CDN, không service worker.
- Mọi thứ gắn vào `window.TOAN8`; file lõi dùng được trong Node theo mẫu UMD như `js/core/store.js`.
- Giao diện tiếng Việt có dấu, xưng "em"; số thập phân dấu phẩy.
- File có dấu `\` phải ghi bằng Write/Edit (không heredoc/sed/python); xuống dòng LF.
- Commit message kết thúc bằng hai dòng `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` và `Claude-Session: https://claude.ai/code/session_01XmA7hztF1aEiVgT22p4eQK`.
- Tự chạy: bắt đầu khi khung hiện ≥ 50%; dừng khi người dùng `pointerdown`/`keydown`/`wheel`/`input` thật (isTrusted) trong khung; `prefers-reduced-motion: reduce` → không tự bật.
- Mức luyện thêm: đúng 3 câu liên tiếp (không xem lời giải, sai < 2 lần) → lên; sai ≥ 2 lần ở một câu → xuống ngay; xem lời giải ở 2 câu liên tiếp → xuống.
- Validator sinh 300 hạt giống mỗi dạng.

## Review Focus
1. Tự chạy làm hình rơi vào trạng thái vô nghĩa (tứ giác bắt chéo, điểm ra ngoài khung) vì bỏ qua ràng buộc `drag` – kỳ vọng: luôn qua handler `drag` và kẹp trong khung (Task 7 kiểm bằng smoke-tuchay chụp ảnh).
2. Tự chạy vẫn chạy sau khi đổi trang / đổi tab (rò requestAnimationFrame, observer) – kỳ vọng: `route` huỷ hết (Task 6 test `soDangChay()` = 0 sau đổi trang).
3. Dạng sinh ra đề trùng đáp án lỗi thường gặp, chia cho 0, số rất xấu ở vài hạt giống hiếm – kỳ vọng: validator 300 hạt giống bắt (Task 4 fixture sai).
4. File tiến độ cũ (không có `luyen`) hoặc `luyen` hỏng khi mở – kỳ vọng: vẫn mở được, bỏ phần hỏng (Task 2 test).
5. In phiếu với câu có hình JSXGraph/biểu đồ, câu `nhieuO`/`chon` – kỳ vọng: in đủ hình, phương án A–D, ô có nhãn; trang đáp án riêng (Task 9 smoke).

---

### Task 1: Bộ ngẫu nhiên có hạt giống và công cụ định dạng (`js/core/rng.js`)

**Files:** Create `js/core/rng.js`, `tests/rng.test.js`; Modify `index.html` (thêm `<script src="js/core/rng.js">` ngay sau `js/core/parser.js`).

**Interfaces – Produces:**
- `taoRng(seed:number) → r` với `r.ngauNhien():[0,1)`, `r.so(a,b)` số nguyên ∈[a,b], `r.khac0(a,b)`, `r.chon(mang)`, `r.dau()` ±1, `r.xaoTron(mang)` (mảng mới), `r.khacNhau(k,a,b)` k số nguyên khác nhau.
- `congCu(P) → cc` với `cc.tex(ascii)` (= `P.toLatex(P.parse(ascii))`), `cc.so(x)` → chuỗi số kiểu Việt (dấu `{,}` để dùng trong `$…$`), `cc.ucln(a,b)`, `cc.phanSo(a,b)` → `{ tu, mau, tex, ascii }` đã rút gọn, mẫu dương (`mau===1` thì tex là số nguyên), `cc.daThuc(heSo:[[c, 'x^2'], [c, 'x'], [c, '']])` → ascii gọn (bỏ hệ số 1, bỏ hạng tử 0, dấu đúng; toàn 0 → `'0'`).
- Trình duyệt: `TOAN8.taoRng`, `TOAN8.congCu` (gọi `TOAN8.congCu(TOAN8.parser)`).

- [ ] **Step 1: Viết test (RED)** – `tests/rng.test.js`
```js
const test = require('node:test'), assert = require('node:assert');
const { taoRng, congCu } = require('../js/core/rng.js');
const P = require('../js/core/parser.js');
test('cùng hạt giống → cùng dãy; khác hạt giống → khác', () => {
  const a = taoRng(42), b = taoRng(42), c = taoRng(43);
  const da = [1, 2, 3, 4, 5].map(() => a.so(1, 1000)), db = [1, 2, 3, 4, 5].map(() => b.so(1, 1000)), dc = [1, 2, 3, 4, 5].map(() => c.so(1, 1000));
  assert.deepStrictEqual(da, db); assert.notDeepStrictEqual(da, dc);
});
test('so, khac0, chon, khacNhau nằm trong khoảng', () => {
  const r = taoRng(7);
  for (let i = 0; i < 2000; i++) {
    const x = r.so(-3, 3); assert.ok(Number.isInteger(x) && x >= -3 && x <= 3);
    assert.notStrictEqual(r.khac0(-2, 2), 0);
    assert.ok(['a', 'b'].includes(r.chon(['a', 'b'])));
  }
  const k = r.khacNhau(4, 1, 6); assert.strictEqual(new Set(k).size, 4);
});
test('công cụ định dạng', () => {
  const cc = congCu(P);
  assert.strictEqual(cc.daThuc([[1, 'x^2'], [-6, 'x'], [9, '']]), 'x^2-6x+9');
  assert.strictEqual(cc.daThuc([[-1, 'x^2'], [0, 'x'], [1, '']]), '-x^2+1');
  assert.strictEqual(cc.daThuc([[0, 'x'], [0, '']]), '0');
  assert.deepStrictEqual([cc.phanSo(6, -8).tu, cc.phanSo(6, -8).mau], [-3, 4]);
  assert.strictEqual(cc.phanSo(6, 3).tex, '2');
  assert.strictEqual(cc.phanSo(-3, 4).tex, '-\\frac{3}{4}');
  assert.strictEqual(cc.so(0.5), '0{,}5');
  assert.strictEqual(cc.so(-2), '-2');
  assert.strictEqual(cc.tex('x^2-6x+9'), P.toLatex(P.parse('x^2-6x+9')));
});
```
- [ ] **Step 2:** `npm test` → FAIL "Cannot find module '../js/core/rng.js'".
- [ ] **Step 3: Cài đặt** – `js/core/rng.js`
```js
// Ngẫu nhiên có hạt giống (cùng hạt giống → cùng đề, dùng cho in phiếu và kiểm tra) và công cụ định dạng cho bài sinh tự động.
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.taoRng = m.taoRng; root.TOAN8.congCu = m.congCu; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // mulberry32
  function taoRng(seed) {
    var a = (seed >>> 0) || 1;
    function next() {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var r = {
      ngauNhien: next,
      so: function (a, b) { return a + Math.floor(next() * (b - a + 1)); },
      khac0: function (a, b) { var x; do { x = r.so(a, b); } while (x === 0); return x; },
      chon: function (m) { return m[Math.floor(next() * m.length)]; },
      dau: function () { return next() < 0.5 ? -1 : 1; },
      xaoTron: function (m) {
        var x = m.slice();
        for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)), t = x[i]; x[i] = x[j]; x[j] = t; }
        return x;
      },
      khacNhau: function (k, a, b) {
        var all = [];
        for (var v = a; v <= b; v++) all.push(v);
        return r.xaoTron(all).slice(0, k);
      }
    };
    return r;
  }

  function ucln(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  function congCu(P) {
    var cc = {
      ucln: ucln,
      tex: function (ascii) { return P.toLatex(P.parse(ascii)); },
      so: function (x) {
        var s = String(Math.round(x * 1e6) / 1e6);
        return s.replace('.', '{,}');
      },
      phanSo: function (a, b) {
        if (b === 0) throw new Error('phanSo: mẫu bằng 0');
        var g = ucln(a, b), tu = a / g, mau = b / g;
        if (mau < 0) { tu = -tu; mau = -mau; }
        var tex = mau === 1 ? String(tu) : (tu < 0 ? '-' : '') + '\\frac{' + Math.abs(tu) + '}{' + mau + '}';
        return { tu: tu, mau: mau, tex: tex, ascii: mau === 1 ? String(tu) : tu + '/' + mau };
      },
      daThuc: function (heSo) {
        var s = '';
        heSo.forEach(function (h) {
          var c = h[0], m = h[1];
          if (!c) return;
          var abs = Math.abs(c), dau = c < 0 ? '-' : (s ? '+' : '');
          s += dau + (m && abs === 1 ? '' : String(abs)) + m;
        });
        return s || '0';
      }
    };
    return cc;
  }
  return { taoRng: taoRng, congCu: congCu };
});
```
- [ ] **Step 4:** `npm test` → PASS (tất cả).
- [ ] **Step 5:** Thêm `<script src="js/core/rng.js"></script>` sau `parser.js` trong `index.html`; commit `feat: bộ ngẫu nhiên có hạt giống và công cụ định dạng cho bài sinh tự động`.

### Task 2: Lưu tiến độ luyện thêm (`js/core/store.js`)

**Files:** Modify `js/core/store.js`; Test `tests/store.test.js`.

**Interfaces – Produces:** `store.recordLuyen(baiId:number|string, ok:boolean)`; `store.luyenHomNay(baiId) → {lam, dung}`; `store.luyenTong(baiId) → {lam, dung}`. Dữ liệu `data.luyen[baiId] = { lam, dung, ngay: { <dayNum>: [lam, dung] } }`, giữ tối đa 60 ngày gần nhất. `v` vẫn là 1; thiếu `luyen` là hợp lệ.

- [ ] **Step 1: Test (RED)** – thêm vào `tests/store.test.js`
```js
test('luyện thêm: ghi, đếm hôm nay, xuất/nhập; file cũ không có luyen vẫn mở được; luyen hỏng bị bỏ', () => {
  const mem = memStorage(); // dùng lại helper sẵn có trong file test (nếu tên khác, dùng helper tạo storage giả đang có)
  let day = new Date(2026, 10, 2);
  const s = createStore(mem, () => day);
  s.recordLuyen(6, true); s.recordLuyen(6, false); s.recordLuyen(6, true);
  assert.deepStrictEqual(s.luyenHomNay(6), { lam: 3, dung: 2 });
  day = new Date(2026, 10, 3);
  s.recordLuyen(6, true);
  assert.deepStrictEqual(s.luyenHomNay(6), { lam: 1, dung: 1 });
  assert.deepStrictEqual(s.luyenTong(6), { lam: 4, dung: 3 });
  const s2 = createStore(memStorage(), () => day);
  assert.ok(s2.importJSON(s.exportJSON()));
  assert.deepStrictEqual(s2.luyenTong(6), { lam: 4, dung: 3 });
  assert.ok(s2.importJSON(JSON.stringify({ v: 1, ex: {} })));
  assert.deepStrictEqual(s2.luyenTong(6), { lam: 0, dung: 0 });
  assert.ok(s2.importJSON(JSON.stringify({ v: 1, ex: {}, luyen: { 6: 'hỏng', 7: { lam: 2, dung: 1, ngay: { x: 'y' } } } })));
  assert.deepStrictEqual(s2.luyenTong(6), { lam: 0, dung: 0 });
  assert.deepStrictEqual(s2.luyenTong(7), { lam: 2, dung: 1 });
});
```
- [ ] **Step 2:** `npm test` → FAIL `s.recordLuyen is not a function`.
- [ ] **Step 3: Cài đặt** trong `js/core/store.js`:
  - `empty()` trả thêm `luyen: {}`.
  - Trong `sanitize(p)` thêm:
```js
    if (isObj(p.luyen)) Object.keys(p.luyen).forEach(function (id) {
      var l = p.luyen[id];
      if (!isObj(l) || !Number.isFinite(l.lam) || !Number.isFinite(l.dung)) return;
      var ngay = {};
      if (isObj(l.ngay)) Object.keys(l.ngay).forEach(function (k) {
        var v = l.ngay[k];
        if (/^\d+$/.test(k) && Array.isArray(v) && v.length === 2 && v.every(Number.isFinite)) ngay[k] = [v[0], v[1]];
      });
      out.luyen[id] = { lam: l.lam, dung: l.dung, ngay: ngay };
    });
```
  - API mới (trước `api.exportJSON`):
```js
    api.recordLuyen = function (baiId, ok) {
      var l = data.luyen[baiId] || (data.luyen[baiId] = { lam: 0, dung: 0, ngay: {} });
      var k = String(dayNum(now())), d = l.ngay[k] || (l.ngay[k] = [0, 0]);
      l.lam++; d[0]++;
      if (ok) { l.dung++; d[1]++; }
      var keys = Object.keys(l.ngay).sort(function (a, b) { return a - b; });
      while (keys.length > 60) delete l.ngay[keys.shift()];
      save();
    };
    api.luyenHomNay = function (baiId) {
      var l = data.luyen[baiId], d = l && l.ngay[String(dayNum(now()))];
      return d ? { lam: d[0], dung: d[1] } : { lam: 0, dung: 0 };
    };
    api.luyenTong = function (baiId) {
      var l = data.luyen[baiId];
      return l ? { lam: l.lam, dung: l.dung } : { lam: 0, dung: 0 };
    };
```
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: lưu tiến độ luyện thêm (theo ngày), an toàn với file tiến độ cũ`.

### Task 3: Lõi luyện thêm – chọn dạng và mức thích ứng (`js/core/luyen.js`)

**Files:** Create `js/core/luyen.js`, `tests/luyen.test.js`; Modify `index.html` (script sau `rng.js`).

**Interfaces:**
- Consumes: `taoRng`, `congCu` (Task 1).
- Produces (UMD; trình duyệt `TOAN8.luyenLoi`):
  - `mucTiepTheo(tt, kq) → tt mới`; `tt = { muc:1|2|3, dungLien:int, xemLien:int }`; `kq ∈ 'dung' | 'sai2' | 'xemLoiGiai'`.
  - `ketQuaCau({ dung:boolean, soLanSai:int, xemLoiGiai:boolean }) → 'dung'|'sai2'|'xemLoiGiai'` (ưu tiên `sai2` > `xemLoiGiai` > `dung`; chưa đúng mà bỏ qua → `'xemLoiGiai'`).
  - `danhSachNguon(goi) → [{ muc, ten, sinh(r, cc) }]` từ `goi = { dang:[…], deCo:[…] }` (mỗi câu `deCo` thành một nguồn trả về chính nó).
  - `chonNguon(nguon, muc, tenTruoc, r) → nguồn` – ưu tiên đúng mức, không có thì mức gần nhất; tránh trùng `tenTruoc` khi có lựa chọn khác.
  - `sinhCau(nguon, seed, cc, baiId) → câu` – gọi `nguon.sinh(taoRng(seed), cc)`, gắn `id: 'L' + baiId + '-' + seed`, `muc: nguon.muc`.

- [ ] **Step 1: Test (RED)** – `tests/luyen.test.js`
```js
const test = require('node:test'), assert = require('node:assert');
const L = require('../js/core/luyen.js');
const { taoRng, congCu } = require('../js/core/rng.js');
const P = require('../js/core/parser.js');
test('lên mức sau 3 câu đúng liền; xuống ngay khi sai 2 lần; xuống khi xem lời giải 2 câu liền', () => {
  let t = { muc: 1, dungLien: 0, xemLien: 0 };
  t = L.mucTiepTheo(t, 'dung'); t = L.mucTiepTheo(t, 'dung'); assert.strictEqual(t.muc, 1);
  t = L.mucTiepTheo(t, 'dung'); assert.strictEqual(t.muc, 2); assert.strictEqual(t.dungLien, 0);
  t = L.mucTiepTheo(t, 'sai2'); assert.strictEqual(t.muc, 1);
  t = L.mucTiepTheo(t, 'sai2'); assert.strictEqual(t.muc, 1);
  t = { muc: 3, dungLien: 2, xemLien: 0 };
  t = L.mucTiepTheo(t, 'xemLoiGiai'); assert.strictEqual(t.muc, 3);
  t = L.mucTiepTheo(t, 'xemLoiGiai'); assert.strictEqual(t.muc, 2);
  t = L.mucTiepTheo({ muc: 3, dungLien: 2, xemLien: 0 }, 'dung'); assert.strictEqual(t.muc, 3);
});
test('kết quả một câu', () => {
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 1, xemLoiGiai: false }), 'dung');
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 2, xemLoiGiai: false }), 'sai2');
  assert.strictEqual(L.ketQuaCau({ dung: true, soLanSai: 0, xemLoiGiai: true }), 'xemLoiGiai');
  assert.strictEqual(L.ketQuaCau({ dung: false, soLanSai: 0, xemLoiGiai: false }), 'xemLoiGiai');
});
test('chọn nguồn đúng mức, tránh lặp; sinh câu có hạt giống', () => {
  const goi = { dang: [
    { ten: 'A', muc: 1, sinh: r => ({ de: 'a' + r.so(1, 9), dapAn: { kieu: 'so', gt: 1 } }) },
    { ten: 'B', muc: 1, sinh: r => ({ de: 'b', dapAn: { kieu: 'so', gt: 1 } }) },
    { ten: 'C', muc: 3, sinh: r => ({ de: 'c', dapAn: { kieu: 'so', gt: 1 } }) }],
    deCo: [{ id: '6.L1', muc: 2, de: 'cố định', dapAn: { kieu: 'so', gt: 2 } }] };
  const ng = L.danhSachNguon(goi), r = taoRng(1);
  assert.strictEqual(ng.length, 4);
  for (let i = 0; i < 50; i++) assert.notStrictEqual(L.chonNguon(ng, 1, 'A', r).ten, 'A');
  assert.strictEqual(L.chonNguon(ng, 2, null, r).ten, '6.L1');
  assert.strictEqual(L.chonNguon(ng.filter(n => n.muc !== 2), 2, null, r).muc !== 2, true);
  const cc = congCu(P);
  const q1 = L.sinhCau(ng[0], 99, cc, 6), q2 = L.sinhCau(ng[0], 99, cc, 6);
  assert.strictEqual(q1.de, q2.de); assert.strictEqual(q1.id, 'L6-99'); assert.strictEqual(q1.muc, 1);
});
```
- [ ] **Step 2:** `npm test` → FAIL module not found.
- [ ] **Step 3: Cài đặt** – `js/core/luyen.js`
```js
// Lõi "Luyện thêm": mức thích ứng, chọn dạng bài, sinh câu từ hạt giống. Thuần JS, dùng được trong Node (kiểm thử, validator).
(function (root, factory) {
  var rng = typeof module === 'object' && module.exports ? require('./rng.js') : { taoRng: root.TOAN8.taoRng };
  var m = factory(rng);
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.luyenLoi = m; }
})(typeof self !== 'undefined' ? self : this, function (rng) {
  'use strict';
  var LEN = 3, XEM = 2;

  function mucTiepTheo(tt, kq) {
    var t = { muc: tt.muc, dungLien: tt.dungLien, xemLien: tt.xemLien };
    if (kq === 'dung') {
      t.dungLien++; t.xemLien = 0;
      if (t.dungLien >= LEN && t.muc < 3) { t.muc++; t.dungLien = 0; }
    } else if (kq === 'sai2') {
      t.muc = Math.max(1, t.muc - 1); t.dungLien = 0; t.xemLien = 0;
    } else {
      t.dungLien = 0; t.xemLien++;
      if (t.xemLien >= XEM) { t.muc = Math.max(1, t.muc - 1); t.xemLien = 0; }
    }
    return t;
  }

  function ketQuaCau(c) {
    if (c.soLanSai >= 2) return 'sai2';
    if (c.xemLoiGiai || !c.dung) return 'xemLoiGiai';
    return 'dung';
  }

  function danhSachNguon(goi) {
    var out = (goi.dang || []).map(function (d) { return { ten: d.ten, muc: d.muc, sinh: d.sinh }; });
    (goi.deCo || []).forEach(function (q) {
      out.push({ ten: q.id, muc: q.muc, coDinh: true, sinh: function () { return JSON.parse(JSON.stringify(q, function (k, v) { return typeof v === 'function' ? undefined : v; })); }, cau: q });
    });
    return out;
  }

  function chonNguon(nguon, muc, tenTruoc, r) {
    var kc = function (n) { return Math.abs(n.muc - muc); };
    var best = Math.min.apply(null, nguon.map(kc));
    var hop = nguon.filter(function (n) { return kc(n) === best; });
    var khac = hop.filter(function (n) { return n.ten !== tenTruoc; });
    return r.chon(khac.length ? khac : hop);
  }

  function sinhCau(nguon, seed, cc, baiId) {
    var q = nguon.coDinh ? nguon.cau : nguon.sinh(rng.taoRng(seed), cc);
    var out = {};
    for (var k in q) out[k] = q[k];
    out.id = nguon.coDinh ? q.id : 'L' + baiId + '-' + seed;
    out.muc = nguon.muc;
    return out;
  }

  return { mucTiepTheo: mucTiepTheo, ketQuaCau: ketQuaCau, danhSachNguon: danhSachNguon, chonNguon: chonNguon, sinhCau: sinhCau };
});
```
(Ghi chú: câu `deCo` dùng thẳng đối tượng gốc – `hinh.config` có thể chứa hàm `build`, nên `sinhCau` không sao chép sâu; bỏ nhánh JSON trong `danhSachNguon` nếu không dùng.)
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** script vào `index.html` sau `rng.js`; commit `feat: lõi luyện thêm – mức thích ứng, chọn dạng, sinh câu theo hạt giống`.

### Task 4: Validator cho luyện thêm (`tools/validate-content.js`)

**Files:** Modify `tools/validate-content.js`; Create `tests/fixtures/luyen-dung.js`, `tests/fixtures/luyen-sai.js`; Test `tests/validate.test.js`.

**Interfaces:** Consumes `taoRng`, `congCu`, `danhSachNguon`, `sinhCau`. Validator nhận thêm file `content/luyen/luyen*.js` (mặc định quét cả `content/luyen/`) và file truyền tay; dòng tổng kết thêm `, N dạng luyện thêm (M đề thử)`.

- [ ] **Step 1: Fixture** – `tests/fixtures/luyen-dung.js`
```js
TOAN8.luyen(901, [
  { ten: 'Khai triển (x + a)²', muc: 1, sinh: function (r, cc) {
    var a = r.khac0(-9, 9), kq = cc.daThuc([[1, 'x^2'], [2 * a, 'x'], [a * a, '']]);
    return { de: 'Khai triển $' + cc.tex('(x' + (a > 0 ? '+' : '') + a + ')^2') + '$.',
      dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
      goiY: ['Dùng hằng đẳng thức bình phương của một tổng/hiệu.'],
      loiGiai: ['$' + cc.tex('(x' + (a > 0 ? '+' : '') + a + ')^2') + ' = ' + cc.tex(kq) + '$'],
      loiThuongGap: [{ gt: 'x^2+' + (a * a), giaiThich: 'Em quên hạng tử $2ab$.' }] };
  } }
]);
```
  `tests/fixtures/luyen-sai.js`
```js
TOAN8.luyen(902, [
  { ten: 'Sai đáp án', muc: 1, sinh: function (r) { var a = r.so(1, 5); return { de: 'Tính $' + a + '+1$', dapAn: { kieu: 'so', gt: a + 2 }, goiY: ['Cộng.'], loiGiai: ['$' + a + '+1 = ' + (a + 2) + '$'] }; } },
  { ten: 'Chia 0', muc: 2, sinh: function (r) { var a = r.so(0, 3); return { de: 'Tính $6 : ' + a + '$', dapAn: { kieu: 'so', gt: 6 / a }, goiY: ['Chia.'], loiGiai: ['$= ' + 6 / a + '$'] }; } },
  { ten: 'Ném lỗi', muc: 3, sinh: function (r) { if (r.so(1, 10) === 3) throw new Error('hỏng'); return { de: 'x', dapAn: { kieu: 'so', gt: 1 }, goiY: ['g'], loiGiai: ['$x = 1$'] }; } }
]);
```
- [ ] **Step 2: Test (RED)** – thêm vào `tests/validate.test.js`
```js
test('luyện thêm hợp lệ: không lỗi', () => {
  const r = run('luyen-dung.js');
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /1 dạng luyện thêm/);
});
test('luyện thêm có lỗi: bắt đáp án sai, chia 0 (Infinity/NaN), dạng ném lỗi; thiếu mức', () => {
  const r = run('luyen-sai.js');
  assert.strictEqual(r.status, 1);
  for (const s of ['Sai đáp án', 'Chia 0', 'Infinity', 'Ném lỗi', 'hạt giống']) assert.ok(r.stdout.includes(s), 'thiếu: ' + s + '\n' + r.stdout);
});
```
  (`run` hiện đang truyền một file; với file `luyen-*.js` validator phải không đòi đủ 8 bài tập – chỉ kiểm phần luyện thêm của file đó.)
- [ ] **Step 3:** `npm test` → FAIL.
- [ ] **Step 4: Cài đặt** trong `tools/validate-content.js`:
  - Đầu file: `const R = require('../js/core/rng.js'); const LL = require('../js/core/luyen.js'); const CC = R.congCu(P); const SO_HAT = 300;`
  - `loadLessons(file)` → đổi thành `loadFile(file)` trả `{ lessons, luyen, nen }`; trong ctx thêm `TOAN8.luyen = (id, dang, opts) => luyen.push({ id, dang, deCo: (opts && opts.deCo) || [] })` và `TOAN8.nen = def => nen.push(def)` (Task 10 dùng).
  - Hàm mới:
```js
function checkCauSinh(tag, q) {
  if (!q || typeof q !== 'object') { errors.push(tag + ': sinh() không trả về câu hỏi'); return; }
  if (!q.de) errors.push(tag + ': thiếu de');
  if (!q.goiY || !q.goiY.length) errors.push(tag + ': thiếu goiY');
  if (!q.loiGiai || !q.loiGiai.length) errors.push(tag + ': thiếu loiGiai');
  walkStrings(q, (s, where) => {
    if (/undefined|NaN|Infinity|\[object/.test(s)) errors.push(tag + where + ': có "undefined/NaN/Infinity" trong chữ: "' + s.slice(0, 60) + '"');
    if ((s.match(/\$/g) || []).length % 2) errors.push(tag + where + ': số dấu $ lẻ');
    else checkMath(s, tag + where);
  }, '');
  const d = q.dapAn;
  if (d && d.kieu === 'so' && !Number.isFinite(C.parseNumber(String(d.gt)))) errors.push(tag + ': đáp án không phải số hữu hạn (' + d.gt + ')');
  checkDapAn(tag, d, q.loiThuongGap);
  checkLastLine(tag, q);
}
function checkLuyen(g) {
  const tagBai = 'luyen' + g.id;
  if (!Array.isArray(g.dang)) { errors.push(tagBai + ': danh sách dạng phải là mảng'); return 0; }
  g.dang.forEach((d, i) => {
    const tag = tagBai + ' dạng "' + (d.ten || i) + '"';
    if (![1, 2, 3].includes(d.muc)) errors.push(tag + ': muc phải là 1/2/3');
    if (typeof d.sinh !== 'function') { errors.push(tag + ': thiếu hàm sinh'); return; }
    const truoc = errors.length;
    for (let s = 1; s <= SO_HAT && errors.length - truoc < 3; s++) {
      let q;
      try { q = LL.sinhCau(d, s, CC, g.id); } catch (e) { errors.push(tag + ' hạt giống ' + s + ': ném lỗi (' + e.message + ')'); continue; }
      const n = errors.length;
      checkCauSinh(tag + ' hạt giống ' + s, q);
      if (errors.length > n) break; // một hạt giống hỏng là đủ để báo dạng này
    }
  });
  g.deCo.forEach(q => {
    const tag = tagBai + ' ' + q.id;
    if (seenIds[q.id]) errors.push(tag + ': id trùng'); seenIds[q.id] = 'luyen' + g.id;
    if (![1, 2, 3].includes(q.muc)) errors.push(tag + ': muc phải là 1/2/3');
    checkCauSinh(tag, q);
  });
  const muc = new Set(g.dang.map(d => d.muc).concat(g.deCo.map(q => q.muc)));
  if (g.dang.length + g.deCo.length && !(muc.has(1) && muc.has(2))) errors.push(tagBai + ': cần có ít nhất mức 1 và mức 2');
  return g.dang.length;
}
```
  - Danh sách file mặc định: thêm `content/luyen/luyen*.js` (nếu thư mục tồn tại). Vòng lặp: với mỗi file gọi `checkBackslashes`, rồi `loadFile`; `lessons` → `checkLesson` như cũ; `luyen` → `soDang += checkLuyen(g)`. Dòng OK: `'OK: ' + count + ' bài, ' + Object.keys(seenIds).length + ' bài tập, ' + soDang + ' dạng luyện thêm (' + soDang * SO_HAT + ' đề thử), không có lỗi.'`
  - Mỗi bài có `T.lessons` mà không có luyện thêm: không phải lỗi ở validator (Task 11 có bước kiểm đủ 39 bài riêng: `node tools/validate-content.js --du-luyen` báo bài thiếu luyện thêm; thêm cờ này: khi có `--du-luyen`, sau vòng lặp, với mọi `L.id` không có `luyen` tương ứng → lỗi `baiNN: chưa có luyện thêm`, và với mọi `g` có `< 3` nguồn (dạng + deCo/3 làm tròn lên) → lỗi `cần ≥ 3 dạng`).
- [ ] **Step 5:** `npm test` → PASS; `node tools/validate-content.js` → OK như cũ (chưa có file luyện).
- [ ] **Step 6:** Commit `feat: validator sinh 300 đề mỗi dạng luyện thêm`.

### Task 5: Tab "6. Luyện thêm" (`js/widgets/luyen.js`) + mẫu `content/luyen/luyen06.js`

**Files:** Create `js/widgets/luyen.js`, `content/luyen/luyen06.js`; Modify `js/core/app.js` (TABS thêm `['luyenThem', 'Luyện thêm']`), `index.html` (script `js/widgets/luyen.js` sau `practice.js`; khối script `content/luyen/luyen01.js … luyen39.js` sau các `content/baiNN.js`), `tools/smoke-all.js` (TABS thêm `'luyenThem'`), `css/app.css`.

**Interfaces:**
- Consumes: `T.luyenLoi.*` (Task 3), `T.taoRng`, `T.congCu(T.parser)`, `T.store.recordLuyen/luyenHomNay` (Task 2), `T.mountQuestion(container, q, { record:false, onResult })` (có sẵn; trả `{ check, card, control }`).
- Produces: `TOAN8.luyen(baiId, dang, opts)` lưu vào `T.luyenBai[baiId] = { dang, deCo }`; `T.tabs.luyenThem(c, bai)`; `T.cauLuyen(baiId, muc, seed) → câu` (dùng cho phiếu và ôn tập).
- `T.mountQuestion` cần báo thêm: số lần sai và đã xem lời giải. Thêm vào `practice.js`: biến `soLanSai` (tăng khi `r.code === 'sai' || r.code === 'loiThuongGap' || r.code === 'saiDang'`), `opts.onResult(r, { soLanSai, xemLoiGiai: level >= hintMax })`, và `opts.onXemLoiGiai()` gọi khi hiện lời giải.

- [ ] **Step 1: Content mẫu** `content/luyen/luyen06.js` (ghi bằng Write) – 3 dạng: (1) khai triển `(ax ± b)^2` mức 1; (2) viết `x^2 ± 2kx + k^2` thành bình phương (dạng `nhanTu`) mức 2; (3) tính nhanh `(10n ± d)^2` hoặc `(100 - d)(100 + d)` mức 3 – mỗi dạng đủ `de, dapAn, goiY[2], loiGiai[≥2, dòng cuối "$… = đáp số$"], loiThuongGap[1]`. Ví dụ dạng 1:
```js
// Luyện thêm – Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu
(function () {
  'use strict';
  TOAN8.luyen(6, [
    { ten: 'Khai triển (ax ± b)²', muc: 1, sinh: function (r, cc) {
      var a = r.chon([1, 1, 2, 3]), b = r.so(1, 9), s = r.dau();
      var de = '(' + (a === 1 ? '' : a) + 'x' + (s > 0 ? '+' : '-') + b + ')^2';
      var kq = cc.daThuc([[a * a, 'x^2'], [2 * a * b * s, 'x'], [b * b, '']]);
      return {
        de: 'Khai triển $' + cc.tex(de) + '$.',
        dapAn: { kieu: 'bieuThuc', gt: kq, dang: 'khaiTrien' },
        goiY: ['Dùng $(A ' + (s > 0 ? '+' : '-') + ' B)^2 = A^2 ' + (s > 0 ? '+' : '-') + ' 2AB + B^2$ với $A = ' + cc.tex((a === 1 ? '' : a) + 'x') + '$, $B = ' + b + '$.',
          'Tính lần lượt $A^2$, $2AB$, $B^2$.'],
        loiGiai: ['$A^2 = ' + cc.tex(a * a + 'x^2') + '$, $2AB = ' + cc.tex(2 * a * b + 'x') + '$, $B^2 = ' + b * b + '$.',
          '$' + cc.tex(de) + ' = ' + cc.tex(kq) + '$'],
        loiThuongGap: [{ gt: cc.daThuc([[a * a, 'x^2'], [b * b * s, '']]) === kq ? 'x^2' : cc.daThuc([[a * a, 'x^2'], [b * b, '']]), giaiThich: 'Em quên hạng tử ở giữa $2AB$. $(A ' + (s > 0 ? '+' : '-') + ' B)^2$ không bằng $A^2 + B^2$.' }]
      };
    } }
    // + 2 dạng nữa theo mô tả trên
  ]);
})();
```
- [ ] **Step 2:** `node tools/validate-content.js content/luyen/luyen06.js` → `OK … 3 dạng luyện thêm (900 đề thử)`. Sửa đến khi OK.
- [ ] **Step 3: Cài đặt** `js/widgets/luyen.js`
```js
// Tab "Luyện thêm": từng câu một, sinh từ dạng bài (hạt giống ngẫu nhiên), mức tự điều chỉnh, đếm chuỗi đúng.
(function (T) {
  'use strict';
  var el = T.el, L = T.luyenLoi;
  T.luyenBai = {};
  T.luyen = function (id, dang, opts) { T.luyenBai[id] = { dang: dang, deCo: (opts && opts.deCo) || [] }; };
  var cc = null;
  function congCu() { return cc || (cc = T.congCu(T.parser)); }
  function hatGiong() { return 1 + Math.floor(Math.random() * 2147483646); }

  T.nguonLuyen = function (baiId) { var g = T.luyenBai[baiId]; return g ? L.danhSachNguon(g) : []; };
  T.cauLuyen = function (baiId, muc, seed, tenTruoc) {
    var ng = T.nguonLuyen(baiId);
    if (!ng.length) return null;
    var n = L.chonNguon(ng, muc, tenTruoc || null, T.taoRng(seed));
    var q = L.sinhCau(n, seed, congCu(), baiId);
    q.nguon = n.ten;
    return q;
  };

  T.tabs.luyenThem = function (c, bai) {
    if (!T.nguonLuyen(bai.id).length) { c.appendChild(el('p', null, 'Phần luyện thêm của bài này đang được soạn.')); return; }
    var tt = { muc: 1, dungLien: 0, xemLien: 0 }, truoc = null, soCau = 0;
    var status = el('div', { class: 'status luyen-status', 'aria-live': 'polite' });
    var cho = el('div', { class: 'luyen-cau' });
    c.appendChild(el('p', { class: 'goi-y-nho' }, 'Bài tương tự bài học, máy tự tạo – làm bao nhiêu cũng được. Đúng 3 câu liền thì lên mức khó hơn.'));
    c.appendChild(status);
    c.appendChild(el('div', { class: 'luyen-nut' },
      el('a', { class: 'btn', href: '#/phieu/bai-' + bai.id }, '🖨 In phiếu 10 câu')));
    c.appendChild(cho);
    function capNhat() {
      var h = T.store.luyenHomNay(bai.id);
      status.innerHTML = '';
      status.appendChild(el('span', null, 'Mức ', el('b', null, String(tt.muc)), ' · chuỗi đúng ', el('b', null, String(tt.dungLien)),
        ' · hôm nay em đã luyện ', el('b', null, String(h.lam)), ' câu (đúng ', el('b', null, String(h.dung)), ').'));
    }
    function cauMoi() {
      if (T.freeBoards) T.freeBoards();
      cho.innerHTML = '';
      var seed = hatGiong(), q = T.cauLuyen(bai.id, tt.muc, seed, truoc);
      truoc = q.nguon; soCau++;
      var trangThai = { dung: false, soLanSai: 0, xemLoiGiai: false }, daGhi = false;
      var tiep = el('button', { class: 'btn primary', type: 'button', hidden: true, onclick: xong }, 'Câu tiếp ▸');
      var boQua = el('button', { class: 'btn ghost', type: 'button', onclick: xong }, 'Bỏ qua câu này');
      cho.appendChild(el('div', { class: 'from' }, 'Câu ' + soCau));
      T.mountQuestion(cho, q, {
        record: false,
        onResult: function (r, ct) {
          trangThai.soLanSai = ct.soLanSai; trangThai.xemLoiGiai = ct.xemLoiGiai;
          if (r.ok) { trangThai.dung = true; ghi(); tiep.hidden = false; boQua.hidden = true; tiep.focus(); }
        },
        onXemLoiGiai: function () { trangThai.xemLoiGiai = true; tiep.hidden = false; boQua.hidden = true; }
      });
      cho.appendChild(el('div', { class: 'luyen-nut' }, tiep, boQua));
      function ghi() { if (!daGhi) { daGhi = true; T.store.recordLuyen(bai.id, trangThai.dung && !trangThai.xemLoiGiai); capNhat(); } }
      function xong() {
        ghi();
        tt = L.mucTiepTheo(tt, L.ketQuaCau(trangThai));
        capNhat();
        cauMoi();
      }
    }
    capNhat();
    cauMoi();
  };
})(window.TOAN8);
```
  `practice.js`: trong `T.mountQuestion` thêm `var soLanSai = 0;`; trong `check()` sau khi có `r`: `if (r.code === 'sai' || r.code === 'loiThuongGap' || r.code === 'saiDang') soLanSai++;` và đổi `opts.onResult(r)` thành `opts.onResult(r, { soLanSai: soLanSai, xemLoiGiai: level >= hintMax })`; trong `showHint()` nhánh hiện lời giải gọi `if (opts.onXemLoiGiai) opts.onXemLoiGiai();`; nút "Xem lời giải mẫu" (khi đã đúng) không tính là xem lời giải.
  `app.js`: `TABS` thêm `['luyenThem', 'Luyện thêm']` cuối mảng (nút "Sang bước 6: Luyện thêm" tự xuất hiện sau tab 5).
  CSS: `.luyen-nut { display:flex; gap:10px; margin:10px 0; } .luyen-status b { color: var(--c); }`.
- [ ] **Step 4: Kiểm trên trình duyệt** – `node tools/smoke.js bai/6/luyenThem --eval "<script>"` với script: điền đáp án đúng của câu hiện tại 3 lần liền (đọc `q` qua `TOAN8.cauLuyen` không được vì hạt giống ngẫu nhiên – thay vào đó gán `Math.random = () => 0.5` trước khi bấm Câu tiếp để hạt giống cố định, rồi lấy câu bằng `TOAN8.cauLuyen(6, muc, seed)`; đơn giản hơn: bấm "Xem lời giải" 2 lần liên tiếp ở mức 1 và kiểm chữ "Mức 1"; bấm "Bỏ qua" và kiểm "Câu 2"). Kỳ vọng: không lỗi console; dòng trạng thái cập nhật; `TOAN8.store.luyenHomNay(6).lam` tăng.
  Viết script ở `C:\Users\Ben\AppData\Local\Temp\claude\D--Appdev2-2026-toan-hoc\1fe54acb-b589-4134-b32a-c8b66fb9ef92\scratchpad\luyen-ui.js`:
```js
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = {};
out.cau1 = document.querySelector('.luyen-cau .from').textContent;
document.querySelector('.luyen-nut .btn.ghost') || null;
[...document.querySelectorAll('.luyen-cau .btn.ghost')].find(b => /Bỏ qua/.test(b.textContent)).click(); await sleep(100);
out.cau2 = document.querySelector('.luyen-cau .from').textContent;
out.lam = TOAN8.store.luyenHomNay(6).lam;
out.status = document.querySelector('.luyen-status').textContent;
return out;
```
  Kỳ vọng: `cau1 = "Câu 1"`, `cau2 = "Câu 2"`, `lam = 1`.
- [ ] **Step 5:** `npm test`, `node tools/validate-content.js`, `node tools/smoke-all.js` (giờ 6 tab) → sạch. Commit `feat: tab Luyện thêm sinh bài vô hạn, mức tự điều chỉnh; mẫu luyện thêm bài 6`.

### Task 6: Bộ máy tự chạy (`js/widgets/autoplay.js`) + thanh trượt HTML

**Files:** Create `js/widgets/autoplay.js`, `tools/smoke-tuchay.js`; Modify `js/core/app.js` (`T.mountWidget` nhận `opts`, `route` gọi `T.tuChay.huyHet()`), `js/widgets/lythuyet.js` (gọi `T.mountWidget(box, name, config, { tuChay: true })`), `js/widgets/sliders.js` (range có `data-ten`), `index.html` (script sau `sliders.js`), `css/app.css`.

**Interfaces – Produces:**
- `T.tuChay.dangKi(khung:Element, trinh:{ buoc(dt:number):void, dung?():void }) → { trangThai():'cho'|'chay'|'dung', batLai(), dungLai() }`.
- `T.tuChay.huyHet()`; `T.tuChay.soDangChay() → int` (số trình đang ở trạng thái 'chay').
- `T.tuChay.tuDong(khung, tenWidget, config)` – dựng trình mặc định hoặc kịch bản; không làm gì nếu `config.tuChay === false` hoặc không có tác tử.
- `T.tuChay.tacTu(khung) → [{ ten, giay, buoc(t∈[0,1]) , batDau?(), ketThuc?() }]` (Task 7 thêm tác tử JSXGraph/ widget).
- Trình tự từ danh sách tác tử: `T.tuChay.noiTiep(tacTu, nghi=0.8)` → `trinh` chạy lần lượt từng tác tử (mỗi cái `giay` giây, nghỉ `nghi` giây), lặp vô hạn.

- [ ] **Step 1: Cài đặt** `js/widgets/autoplay.js`
```js
// Tự chạy hình động: bắt đầu khi hình hiện trên màn hình, dừng khi em chạm vào; nút ▶/⏸ ở góc hình.
(function (T) {
  'use strict';
  var el = T.el, ds = [], raf = null, last = 0;
  var giam = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function vong(ts) {
    raf = null;
    var dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
    last = ts;
    var con = false;
    ds.forEach(function (m) {
      if (m.tt !== 'chay' || !m.hien || document.hidden) return;
      con = true;
      try { m.trinh.buoc(dt); } catch (e) { console.error('Tự chạy lỗi', e); dat(m, 'dung'); }
    });
    if (con) raf = requestAnimationFrame(vong); else last = 0;
  }
  function keo() { if (!raf) raf = requestAnimationFrame(vong); }

  function dat(m, tt) {
    if (m.tt === tt) return;
    if (m.tt === 'chay' && m.trinh.dung) m.trinh.dung();
    m.tt = tt;
    m.nut.textContent = tt === 'chay' ? '⏸ Dừng' : '▶ Tự chạy';
    m.nut.setAttribute('aria-pressed', tt === 'chay' ? 'true' : 'false');
    if (tt === 'chay') keo();
  }

  function dangKi(khung, trinh) {
    khung.classList.add('co-tu-chay');
    var nut = el('button', { class: 'nut-tu-chay', type: 'button', 'aria-label': 'Tự chạy hình' });
    var m = { khung: khung, trinh: trinh, tt: 'cho', hien: false, nut: nut };
    nut.addEventListener('click', function () { dat(m, m.tt === 'chay' ? 'dung' : 'chay'); m.hien = true; });
    khung.appendChild(nut);
    nut.textContent = '▶ Tự chạy';
    var thatSu = function (e) {
      if (!e.isTrusted || e.target === nut || nut.contains(e.target)) return;
      dat(m, 'dung');
    };
    ['pointerdown', 'keydown', 'wheel', 'input'].forEach(function (t) { khung.addEventListener(t, thatSu, true); });
    if ('IntersectionObserver' in window) {
      m.ob = new IntersectionObserver(function (en) {
        m.hien = en[0].intersectionRatio >= 0.5;
        if (m.hien && m.tt === 'cho' && !giam) dat(m, 'chay');
        if (m.hien) keo();
      }, { threshold: [0, 0.5] });
      m.ob.observe(khung);
    } else { m.hien = true; if (!giam) dat(m, 'chay'); }
    ds.push(m);
    return { trangThai: function () { return m.tt; }, batLai: function () { dat(m, 'chay'); }, dungLai: function () { dat(m, 'dung'); } };
  }

  function huyHet() {
    ds.forEach(function (m) { if (m.ob) m.ob.disconnect(); if (m.tt === 'chay' && m.trinh.dung) m.trinh.dung(); });
    ds = [];
    if (raf) cancelAnimationFrame(raf);
    raf = null; last = 0;
  }

  // Lần lượt từng tác tử (mỗi cái `giay` giây), nghỉ giữa chừng, lặp mãi.
  function noiTiep(tacTu, nghi) {
    nghi = nghi == null ? 0.8 : nghi;
    var i = 0, t = 0, dangNghi = true;
    return {
      buoc: function (dt) {
        if (!tacTu.length) return;
        t += dt;
        if (dangNghi) { if (t >= nghi) { dangNghi = false; t = 0; if (tacTu[i].batDau) tacTu[i].batDau(); } return; }
        var a = tacTu[i], p = Math.min(1, t / a.giay);
        a.buoc(p);
        if (p >= 1) { if (a.ketThuc) a.ketThuc(); i = (i + 1) % tacTu.length; t = 0; dangNghi = true; }
      },
      dung: function () { var a = tacTu[i]; if (!dangNghi && a && a.ketThuc) a.ketThuc(); dangNghi = true; t = 0; }
    };
  }

  // Thanh trượt HTML: giá trị đầu → max → min → giá trị đầu (sóng), làm tròn theo bước, phát sự kiện input như người dùng.
  function tacTuThanhTruot(inp) {
    var v0, min, max, step;
    function dat(v) {
      var s = Math.round((v - min) / step) * step + min;
      s = Math.max(min, Math.min(max, +s.toFixed(6)));
      if (String(s) !== inp.value) { inp.value = s; inp.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    return {
      ten: 'thanh ' + (inp.getAttribute('data-ten') || ''), giay: 4,
      batDau: function () { v0 = Number(inp.value); min = Number(inp.min); max = Number(inp.max); step = Number(inp.step) || 0.1; },
      buoc: function (p) {
        // 0→0,25: v0→max; 0,25→0,75: max→min; 0,75→1: min→v0
        var v = p < 0.25 ? v0 + (max - v0) * (p / 0.25) : p < 0.75 ? max + (min - max) * ((p - 0.25) / 0.5) : min + (v0 - min) * ((p - 0.75) / 0.25);
        dat(v);
      },
      ketThuc: function () { dat(v0); }
    };
  }

  var boTacTu = [function (khung) {
    return [].slice.call(khung.querySelectorAll('input[type=range]')).map(tacTuThanhTruot);
  }];

  function tacTu(khung, ten, config) {
    var out = [];
    boTacTu.forEach(function (f) { out = out.concat(f(khung, ten, config) || []); });
    return out;
  }

  function tuDong(khung, ten, config) {
    config = config || {};
    if (config.tuChay === false) return null;
    var trinh = Array.isArray(config.tuChay) && T.tuChay.kichBan ? T.tuChay.kichBan(khung, config.tuChay) : null;
    if (!trinh) {
      var tt = tacTu(khung, ten, config);
      if (!tt.length) return null;
      trinh = noiTiep(tt);
    }
    return dangKi(khung, trinh);
  }

  T.tuChay = {
    dangKi: dangKi, huyHet: huyHet, noiTiep: noiTiep, tuDong: tuDong, tacTu: tacTu,
    themTacTu: function (f) { boTacTu.push(f); },
    tacTuThanhTruot: tacTuThanhTruot,
    soDangChay: function () { return ds.filter(function (m) { return m.tt === 'chay'; }).length; }
  };
})(window.TOAN8);
```
  `app.js` – `T.mountWidget = function (container, name, config, opts)`: sau khi `w(container, config || {})` thành công, nếu `opts && opts.tuChay && T.tuChay` thì `T.tuChay.tuDong(container, name, config || {})`; `route()` dòng đầu thêm `if (T.tuChay) T.tuChay.huyHet();`.
  `lythuyet.js`: hai lệnh `T.mountWidget(box, …)` thêm đối số `{ tuChay: true }`.
  `sliders.js`: thêm `'data-ten': t.ten` vào thuộc tính `input` range.
  CSS:
```css
.co-tu-chay { position: relative; }
.nut-tu-chay { position: absolute; top: 8px; right: 8px; z-index: 5; border: 1px solid var(--line); background: rgba(255,255,255,.92); border-radius: 999px; padding: 4px 12px; font: inherit; font-size: .85rem; cursor: pointer; }
.nut-tu-chay[aria-pressed=true] { color: var(--c); border-color: var(--c); }
@media print { .nut-tu-chay { display: none; } }
```
- [ ] **Step 2: Công cụ kiểm** `tools/smoke-tuchay.js` – mở từng bài, tab `khamPha` và `lyThuyet`; với mỗi khung `.co-tu-chay`: chụp "dấu vân" trạng thái (giá trị mọi range + toạ độ mọi điểm JSXGraph trong khung + `innerHTML.length` của svg trong khung), chờ 2,5 s, chụp lại → phải khác (đang chạy thật); rồi `page.mouse.click` vào giữa khung → `TOAN8.tuChay.soDangChay()` giảm và nút ghi "▶ Tự chạy"; đổi trang `#/` → `soDangChay() === 0`. In danh sách khung "không đổi" (= tự chạy vô nghĩa) và bài khamPha **không có** khung tự chạy. Mã thoát 1 nếu có lỗi console hoặc khung không đổi.
```js
// Kiểm tự chạy: mọi hình ở Khám phá/Lý thuyết có tự chạy, đang chạy thì hình đổi, chạm thì dừng, đổi trang thì tắt hết.
// Dùng: node tools/smoke-tuchay.js [id…]
const path = require('path'), fs = require('fs'), url = require('url');
const puppeteer = require('puppeteer-core');
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const VAN = `(k => [...k.querySelectorAll('input[type=range]')].map(i => i.value).join(',') + '|' +
  Object.values(JXG.boards).filter(b => k.contains(b.containerObj)).map(b => b.objectsList.filter(o => o.elType === 'point' || o.elType === 'glider').map(o => o.X().toFixed(2) + ':' + o.Y().toFixed(2)).join(',')).join('/') + '|' +
  [...k.querySelectorAll('svg')].map(s => s.innerHTML.length).join(',') + '|' + k.textContent.length)`;
async function main() {
  const ids = process.argv.slice(2).map(Number);
  const exe = BROWSERS.find(p => fs.existsSync(p));
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, protocolTimeout: 60000 });
  const loi = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 1000 });
    let where = '';
    page.on('console', m => { if (['error', 'warn', 'warning'].includes(m.type())) loi.push(where + ' – ' + m.text()); });
    page.on('pageerror', e => loi.push(where + ' – pageerror: ' + e.message));
    await page.goto(url.pathToFileURL(path.join(__dirname, '..', 'index.html')).href + '#/', { waitUntil: 'load' });
    await sleep(400);
    const all = await page.evaluate(() => Object.keys(TOAN8.lessons).map(Number).sort((a, b) => a - b));
    let khung = 0;
    for (const id of (ids.length ? ids : all)) for (const tab of ['khamPha', 'lyThuyet']) {
      where = 'bai' + id + '/' + tab;
      await page.evaluate(h => { location.hash = h; }, '#/bai/' + id + '/' + tab);
      await sleep(300);
      const n = await page.evaluate(() => document.querySelectorAll('.co-tu-chay').length);
      if (tab === 'khamPha' && !n) loi.push(where + ' – Khám phá không có hình tự chạy');
      for (let i = 0; i < n; i++) {
        khung++;
        await page.evaluate(i => document.querySelectorAll('.co-tu-chay')[i].scrollIntoView({ block: 'center' }), i);
        await sleep(400);
        const a = await page.evaluate((i, V) => eval(V)(document.querySelectorAll('.co-tu-chay')[i]), i, VAN);
        await sleep(2500);
        const b = await page.evaluate((i, V) => eval(V)(document.querySelectorAll('.co-tu-chay')[i]), i, VAN);
        if (a === b) loi.push(where + ' – hình ' + (i + 1) + ': tự chạy không làm hình thay đổi');
        const box = await page.evaluate(i => { const r = document.querySelectorAll('.co-tu-chay')[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, i);
        const truoc = await page.evaluate(() => TOAN8.tuChay.soDangChay());
        await page.mouse.click(box.x, box.y);
        await sleep(150);
        const sau = await page.evaluate(i => ({ n: TOAN8.tuChay.soDangChay(), nut: document.querySelectorAll('.co-tu-chay')[i].querySelector('.nut-tu-chay').textContent }), i);
        if (!(sau.n < truoc) || !/Tự chạy/.test(sau.nut)) loi.push(where + ' – hình ' + (i + 1) + ': chạm vào không dừng');
      }
    }
    await page.evaluate(() => { location.hash = '#/'; });
    await sleep(200);
    if (await page.evaluate(() => TOAN8.tuChay.soDangChay())) loi.push('đổi trang mà tự chạy vẫn còn');
    console.log('Đã kiểm ' + khung + ' hình tự chạy.');
  } finally { await browser.close(); }
  if (loi.length) { console.log(loi.join('\n')); process.exitCode = 1; } else console.log('Không có lỗi.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
```
- [ ] **Step 3:** `node tools/smoke-tuchay.js 6 28` → bài 6 (dienTich có thanh trượt) và bài 28 (doThi có thanh trượt) có hình đổi, chạm thì dừng; các khung khác của bài 6/28 không có range thì chưa có tự chạy (chờ Task 7). Kỳ vọng: không còn lỗi "không đổi"/"chạm không dừng" ở các khung đã đăng kí.
- [ ] **Step 4:** `npm test`, `node tools/smoke-all.js` sạch. Commit `feat: bộ máy tự chạy hình động (thanh trượt), chạm là dừng, nút ▶/⏸`.

### Task 7: Tác tử tự chạy cho JSXGraph, xác suất, hình chóp, biểu đồ, cắt ghép + kịch bản

**Files:** Modify `js/widgets/autoplay.js`; Modify `js/widgets/solid3d.js` (gắn `holder.tuChayXoay = function (dg) { goc.quay += dg; draw(); }`); Validator: `tools/validate-content.js` (kiểm kịch bản).

**Interfaces – Produces:** `T.tuChay.kichBan(khung, buoc[]) → trinh`; bước: `{ thanhTruot, den, giay? }`, `{ diem, den:[x,y], giay? }`, `{ nut }`, `{ cho }`.

- [ ] **Step 1: Cài đặt tác tử** (thêm cuối IIFE trong `autoplay.js`, trước `T.tuChay = …` gán, rồi `boTacTu.push(...)`):
```js
  function bangTrong(khung) {
    return window.JXG ? Object.keys(JXG.boards).map(function (k) { return JXG.boards[k]; }).filter(function (b) { return b.containerObj && khung.contains(b.containerObj); }) : [];
  }
  function keoDiem(b, p, x, y) {
    var bb = b.getBoundingBox(), mx = (bb[2] - bb[0]) * 0.04, my = (bb[1] - bb[3]) * 0.04;
    x = Math.max(bb[0] + mx, Math.min(bb[2] - mx, x)); y = Math.max(bb[3] + my, Math.min(bb[1] - my, y));
    p.moveTo([x, y]);
    if (p.triggerEventHandlers) p.triggerEventHandlers(['drag'], [{ type: 'drag', tuChay: true }]);
    b.update();
  }
  function tacTuDiem(b, p) {
    var bb = b.getBoundingBox(), rx = (bb[2] - bb[0]) * 0.1, ry = (bb[1] - bb[3]) * 0.1, x0, y0;
    return { ten: 'điểm ' + p.name, giay: 4,
      batDau: function () { x0 = p.X(); y0 = p.Y(); },
      buoc: function (t) { var g = 2 * Math.PI * t; keoDiem(b, p, x0 + rx * Math.sin(g), y0 + ry * (1 - Math.cos(g)) * 0.8); },
      ketThuc: function () { keoDiem(b, p, x0, y0); } };
  }
  function tacTuSliderJXG(b, s) {
    var v0, mn, mx;
    return { ten: 'slider ' + s.name, giay: 4,
      batDau: function () { v0 = s.Value(); mn = s._smin; mx = s._smax; },
      buoc: function (p) {
        var v = p < 0.25 ? v0 + (mx - v0) * (p / 0.25) : p < 0.75 ? mx + (mn - mx) * ((p - 0.25) / 0.5) : mn + (v0 - mn) * ((p - 0.75) / 0.25);
        s.setValue(v); b.update();
      },
      ketThuc: function () { s.setValue(v0); b.update(); } };
  }
  boTacTu.push(function (khung) {
    var out = [];
    bangTrong(khung).forEach(function (b) {
      b.objectsList.forEach(function (o) {
        if (o.elType === 'slider' && o.visProp.visible !== false) out.push(tacTuSliderJXG(b, o));
        else if ((o.elType === 'point' || o.elType === 'glider') && !o.visProp.fixed && o.visProp.visible !== false && o.isDraggable !== false && o.name && !o.ancestors_slider)
          out.push(tacTuDiem(b, o));
      });
    });
    return out.slice(0, 6);
  });
  function nutCo(khung, re) { return [].slice.call(khung.querySelectorAll('button')).filter(function (b) { return re.test(b.textContent) && !b.classList.contains('nut-tu-chay'); })[0]; }
  // xác suất: gieo dần
  boTacTu.push(function (khung, ten) {
    if (ten !== 'xacSuat') return [];
    var dem = 0, cho = 0;
    return [{ ten: 'gieo', giay: 30, batDau: function () { dem = 0; cho = 0; var l = nutCo(khung, /Làm lại/); if (l) l.click(); },
      buoc: function (p) {
        var t = p * 30;
        if (t < cho) return;
        if (dem < 20) { nutCo(khung, /Thử 1 lần/).click(); dem++; cho = t + 0.6; }
        else { nutCo(khung, /Thử 10 lần/).click(); dem += 10; cho = t + 0.8; }
      } }];
  });
  // hình chóp: xoay đều, thỉnh thoảng trải phẳng
  boTacTu.push(function (khung, ten) {
    if (ten !== 'hinhChop') return [];
    var h = khung.querySelector('.chop'), trai = [].slice.call(khung.querySelectorAll('input[type=range]')).filter(function (i) { return i.getAttribute('data-ten') === 't'; })[0];
    var out = [{ ten: 'xoay', giay: 6, buoc: function (p) { if (h && h.tuChayXoay) h.tuChayXoay(0.012); } }];
    if (trai) out.push(tacTuThanhTruot(trai));
    return out;
  });
  // biểu đồ đổi loại; cắt và ghép
  boTacTu.push(function (khung, ten) {
    var out = [];
    var nutLoai = [].slice.call(khung.querySelectorAll('.doi-loai button'));
    if (nutLoai.length > 1) out.push({ ten: 'đổi loại', giay: 3 * nutLoai.length, buoc: function (p) {
      var k = Math.min(nutLoai.length - 1, Math.floor(p * nutLoai.length));
      if (!nutLoai[k].classList.contains('primary')) nutLoai[k].click();
    } });
    var cat = nutCo(khung, /Cắt và ghép|Trả về/);
    if (cat) out.push({ ten: 'cắt ghép', giay: 6, buoc: function (p) {
      var muon = p < 0.5 ? /Cắt và ghép/ : /Trả về/;
      if (muon.test(cat.textContent)) cat.click();
    } });
    return out;
  });
```
  Lưu ý: tác tử thanh trượt HTML (bộ đầu) đã gồm thanh "t" của hình chóp – trong bộ hình chóp **không** thêm lại thanh `t`, thay vào đó bộ thanh trượt HTML bỏ qua range trong `.chop`-widget? Đơn giản hơn: với `ten === 'hinhChop'`, bộ thanh trượt chung trả `[]` (sửa bộ đầu: `if (ten === 'hinhChop') return [];`), bộ hình chóp tự thêm thanh `a`, `h`, `t`.
  Với `hinhChop`, tác tử "xoay" chạy nối tiếp các thanh; thêm `buoc` xoay nhẹ trong mọi tác tử khác bằng cách bọc: trong bộ hình chóp, trả `[xoay, a, xoay, h, xoay, t]`.
  `solid3d.js`: sau `container.appendChild(holder); bindDrag(holder);` thêm `holder.tuChayXoay = function (dg) { goc.quay += dg; draw(); };`.
- [ ] **Step 2: Kịch bản**
```js
  function kichBan(khung, cacBuoc) {
    var bangs = bangTrong(khung);
    function timDiem(ten) { for (var i = 0; i < bangs.length; i++) { var o = bangs[i].objectsList.filter(function (x) { return x.name === ten && (x.elType === 'point' || x.elType === 'glider' || x.elType === 'slider'); })[0]; if (o) return { b: bangs[i], o: o }; } return null; }
    function timRange(ten) { return khung.querySelector('input[type=range][data-ten="' + ten + '"]'); }
    var tacTu = cacBuoc.map(function (s) {
      if (s.cho != null) return { ten: 'chờ', giay: s.cho, buoc: function () {} };
      if (s.nut) return { ten: 'nút', giay: 0.3, buoc: function (p) { if (p >= 1) { var n = nutCo(khung, new RegExp(s.nut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); if (n) n.click(); } } };
      if (s.thanhTruot) {
        var inp = timRange(s.thanhTruot), j = inp ? null : timDiem(s.thanhTruot), v0;
        return { ten: 'thanh ' + s.thanhTruot, giay: s.giay || 2,
          batDau: function () { v0 = inp ? Number(inp.value) : j ? j.o.Value() : 0; },
          buoc: function (p) {
            var v = v0 + (s.den - v0) * p;
            if (inp) { var st = Number(inp.step) || 0.1, q = Math.round((v - Number(inp.min)) / st) * st + Number(inp.min); q = +q.toFixed(6); if (String(q) !== inp.value) { inp.value = q; inp.dispatchEvent(new Event('input', { bubbles: true })); } }
            else if (j) { j.o.setValue(v); j.b.update(); }
          } };
      }
      if (s.diem) {
        var d = timDiem(s.diem), x0, y0;
        return { ten: 'điểm ' + s.diem, giay: s.giay || 2,
          batDau: function () { if (d) { x0 = d.o.X(); y0 = d.o.Y(); } },
          buoc: function (p) { if (d) keoDiem(d.b, d.o, x0 + (s.den[0] - x0) * p, y0 + (s.den[1] - y0) * p); } };
      }
      return { ten: 'bước lạ', giay: 0.1, buoc: function () {} };
    });
    return noiTiep(tacTu, 0.3);
  }
```
  gán `T.tuChay.kichBan = kichBan;`.
  Validator: trong `checkLesson`, hàm `checkTuChay(tag, cfg)` – nếu `Array.isArray(cfg.tuChay)`: mỗi bước có đúng một khoá trong `thanhTruot|diem|nut|cho`; với `thanhTruot`/`diem`, tên phải xuất hiện trong `JSON.stringify(cfg.thanhTruot||[])` hoặc trong `String(cfg.build)` (dạng `'M'` hoặc `"M"`) hoặc `cfg.diem` – sai → lỗi `tuChay: không thấy "<tên>"`. Áp dụng cho `khamPha.config` và mọi `lyThuyet[i].config` loại hình.
- [ ] **Step 3:** `node tools/smoke-tuchay.js` (cả 39 bài) – ghi lại danh sách "không có tự chạy"/"không đổi" vào `scratchpad\tuchay-thieu.txt` (dùng cho Task 11 – tác giả nội dung thêm kịch bản). Lỗi console phải = 0. Chụp ảnh 3 hình (bài 10 khamPha, bài 31 lyThuyet, bài 38 khamPha) giữa lúc chạy và xem: không bắt chéo, không ra ngoài khung.
- [ ] **Step 4:** `npm test`, `node tools/validate-content.js`, `node tools/smoke-all.js` sạch. Commit `feat: tự chạy cho điểm/thanh trượt JSXGraph, xác suất, hình chóp, biểu đồ, cắt ghép; kịch bản tuChay`.

### Task 8: Nháp vẽ tay (`js/widgets/nhap.js`)

**Files:** Create `js/widgets/nhap.js`; Modify `js/widgets/practice.js` (nút "✏️ Nháp" trong `.q-actions`), `index.html`, `css/app.css`.

**Interfaces – Produces:** `T.nhap(chua:Element) → { el, xoa() }` – khung nháp gắn vào `chua`.

- [ ] **Step 1: Cài đặt**
```js
// Khung nháp vẽ tay dưới mỗi câu hỏi: bút 3 màu, tẩy, xoá hết. Không lưu.
(function (T) {
  'use strict';
  var el = T.el, MAU = ['#212529', '#1971c2', '#e03131'];
  T.nhap = function (chua) {
    var cv = el('canvas', { class: 'nhap-cv', 'aria-label': 'Khung nháp – vẽ bằng chuột hoặc bút' });
    var mau = MAU[0], tay = false, ve = null;
    var thanh = el('div', { class: 'nhap-thanh' });
    MAU.forEach(function (m, i) {
      thanh.appendChild(el('button', { type: 'button', class: 'nhap-mau' + (i ? '' : ' on'), style: 'background:' + m, 'aria-label': 'Bút màu ' + (i + 1), onclick: function () {
        mau = m; tay = false; [].forEach.call(thanh.children, function (b) { b.classList.remove('on'); }); this.classList.add('on');
      } }));
    });
    thanh.appendChild(el('button', { type: 'button', class: 'btn ghost', onclick: function () {
      tay = true; [].forEach.call(thanh.children, function (b) { b.classList.remove('on'); }); this.classList.add('on');
    } }, '🧽 Tẩy'));
    thanh.appendChild(el('button', { type: 'button', class: 'btn ghost', onclick: xoa }, 'Xoá hết'));
    var wrap = el('div', { class: 'nhap' }, thanh, cv);
    chua.appendChild(wrap);
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
    function coGian() {
      var r = cv.getBoundingClientRect();
      if (!r.width) return;
      var anh = cv.width ? ctx.getImageData(0, 0, cv.width, cv.height) : null;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(260 * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (anh) ctx.putImageData(anh, 0, 0);
    }
    function xy(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); ve = xy(e); e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) {
      if (!ve) return;
      var p = xy(e), ap = e.pressure && e.pointerType === 'pen' ? e.pressure : 0.5;
      ctx.globalCompositeOperation = tay ? 'destination-out' : 'source-over';
      ctx.strokeStyle = mau; ctx.lineWidth = tay ? 22 : 1.5 + 3 * ap; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(ve[0], ve[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      ve = p;
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { cv.addEventListener(t, function () { ve = null; }); });
    function xoa() { ctx.clearRect(0, 0, cv.width, cv.height); }
    requestAnimationFrame(coGian);
    window.addEventListener('resize', coGian);
    return { el: wrap, xoa: xoa, huy: function () { window.removeEventListener('resize', coGian); wrap.remove(); } };
  };
})(window.TOAN8);
```
  `practice.js`: tạo `var nhapBtn = el('button', { class: 'btn ghost', type: 'button' }, '✏️ Nháp'), nhap = null;` thêm vào `el('div', { class: 'q-actions' }, hintBtn, nhapBtn)`; `nhapBtn.onclick = function () { if (nhap) { nhap.huy(); nhap = null; nhapBtn.textContent = '✏️ Nháp'; } else { nhap = T.nhap(card); nhapBtn.textContent = '✏️ Đóng nháp'; } };`.
  CSS:
```css
.nhap { margin-top: 10px; border: 1px dashed #adb5bd; border-radius: 10px; background: #fffef8; }
.nhap-thanh { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-bottom: 1px dashed #dee2e6; }
.nhap-mau { width: 26px; height: 26px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 1px #adb5bd; cursor: pointer; }
.nhap-mau.on { box-shadow: 0 0 0 3px var(--c); }
.nhap-cv { display: block; width: 100%; height: 260px; touch-action: none; cursor: crosshair; }
@media print { .nhap, .q-actions { display: none; } }
```
- [ ] **Step 2: Kiểm** – `node tools/smoke.js bai/6/tuLam --eval "<script>"`: bấm nút Nháp của câu đầu, phát `PointerEvent` pointerdown/move/up qua canvas, đọc `getImageData` có pixel khác 0; bấm "Xoá hết" → toàn 0; bấm "Đóng nháp" → không còn `.nhap`. Kỳ vọng `{ve:true, xoa:true, dong:true}`, console sạch.
- [ ] **Step 3:** Commit `feat: nháp vẽ tay dưới mỗi câu hỏi`.

### Task 9: In phiếu bài tập (`js/widgets/phieu.js`)

**Files:** Create `js/widgets/phieu.js`; Modify `js/core/app.js` (route `phieu`), `js/widgets/review.js` (nút in ở ôn tập cuối năm), `index.html`, `css/app.css`.

**Interfaces:** Consumes `T.cauLuyen(baiId, muc, seed, tenTruoc)` (Task 5), `T.lessons`, `T.mucLuc`. Produces `T.phieu(app, nguon:string, seed:number)`; route `#/phieu/bai-<id>[/<seed>]` và `#/phieu/cuoi-nam-<so.so.so>[/<seed>]`; `T.dapAnChu(dapAn) → string (HTML)`.

- [ ] **Step 1: Cài đặt**
```js
// Phiếu bài tập để in: 10 câu (có hình), chỗ trống để làm; trang sau là đáp án và lời giải.
(function (T) {
  'use strict';
  var el = T.el, CHU = 'ABCDEFGH';
  T.dapAnChu = function (d) {
    var md = function (s) { return T.md(String(s)).replace(/^<p>|<\/p>$/g, ''); };
    switch (d.kieu) {
      case 'so': return T.tex(String(d.gt).indexOf('/') > 0 || /sqrt/.test(String(d.gt)) ? T.parser.toLatex(T.parser.parse(String(d.gt))) : String(d.gt).replace('.', '{,}'));
      case 'bieuThuc': return T.tex(T.parser.toLatex(T.parser.parse(d.gt)));
      case 'nghiem': return d.gt === 'voNghiem' ? 'Phương trình vô nghiệm' : d.gt === 'voSoNghiem' ? 'Vô số nghiệm' : d.gt.map(function (x) { return T.tex('x = ' + String(x).replace('.', '{,}')); }).join('; ');
      case 'chon': return CHU[d.gt] + '. ' + md(d.luaChon[d.gt]);
      case 'dungSai': return d.gt ? 'Đúng' : 'Sai';
      case 'nhieuO': return d.o.map(function (o) { return md(o.nhan || '') + ' ' + T.dapAnChu(o); }).join('; ');
    }
    return '';
  };
  function chonCau(nguon, seed) {
    var r = T.taoRng(seed), cau = [], m;
    if ((m = /^bai-(\d+)$/.exec(nguon))) {
      var id = Number(m[1]), muc = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3], truoc = null;
      if (!T.nguonLuyen(id).length) return (T.lessons[id] && T.lessons[id].baiTap || []).slice(0, 10);
      muc.forEach(function (mm) { var q = T.cauLuyen(id, mm, r.so(1, 2147483646), truoc); truoc = q.nguon; cau.push(q); });
      return cau;
    }
    if ((m = /^cuoi-nam-([\d.]+)$/.exec(nguon))) {
      var chuong = m[1].split('.').map(Number), bai = [];
      T.mucLuc.forEach(function (c) { if (chuong.indexOf(c.so) >= 0) c.bai.forEach(function (b) { if (T.lessons[b.id]) bai.push(b.id); }); });
      for (var i = 0; i < 10 && bai.length; i++) {
        var id2 = bai[r.so(0, bai.length - 1)], q2 = T.cauLuyen(id2, r.chon([2, 2, 3]), r.so(1, 2147483646));
        if (!q2) { var ds = T.lessons[id2].baiTap.filter(function (x) { return x.muc >= 2; }); q2 = ds[r.so(0, ds.length - 1)]; }
        cau.push(q2);
      }
      return cau;
    }
    return [];
  }
  T.phieu = function (app, nguon, seed) {
    seed = seed || 1 + Math.floor(Math.random() * 2147483646);
    var cau = chonCau(nguon, seed);
    var m = /^bai-(\d+)$/.exec(nguon), tieuDe = m && T.lessons[m[1]] ? 'Bài ' + m[1] + '. ' + T.lessons[m[1]].ten : 'Ôn tập cuối năm';
    app.appendChild(el('div', { class: 'phieu-nut' },
      el('button', { class: 'btn primary', type: 'button', onclick: function () { window.print(); } }, '🖨 In phiếu'),
      el('a', { class: 'btn', href: '#/phieu/' + nguon + '/' + (1 + Math.floor(Math.random() * 2147483646)) }, '🔄 Đề khác'),
      el('a', { class: 'btn ghost', href: m ? '#/bai/' + m[1] + '/luyenThem' : '#/on-tap-cuoi-nam' }, '← Quay lại')));
    var de = el('section', { class: 'phieu' },
      el('h1', null, 'Phiếu bài tập – ' + tieuDe),
      el('p', { class: 'phieu-ten' }, 'Họ và tên: ........................................   Ngày: ..........   Mã đề: ' + seed));
    cau.forEach(function (q, i) {
      var c = el('div', { class: 'phieu-cau' }, el('div', { html: '<b>Câu ' + (i + 1) + '.</b> ' + T.md(q.de).replace(/^<p>|<\/p>$/g, '') }));
      de.appendChild(c);
      if (q.hinh) T.mountWidget(c.appendChild(el('div', { class: 'phieu-hinh' })), q.hinh.widget, q.hinh.config);
      if (q.dapAn.kieu === 'chon') c.appendChild(el('ol', { class: 'phieu-chon', type: 'A' }, q.dapAn.luaChon.map(function (x) { return el('li', { html: T.md(x).replace(/^<p>|<\/p>$/g, '') }); })));
      else if (q.dapAn.kieu === 'nhieuO') q.dapAn.o.forEach(function (o) { c.appendChild(el('div', { class: 'phieu-o', html: T.md(o.nhan || '').replace(/^<p>|<\/p>$/g, '') + ' ..................' })); });
      c.appendChild(el('div', { class: 'phieu-lam' }));
    });
    var da = el('section', { class: 'phieu phieu-dapan' }, el('h2', null, 'Đáp án – Mã đề ' + seed));
    cau.forEach(function (q, i) {
      var d = el('div', { class: 'phieu-cau' }, el('div', { html: '<b>Câu ' + (i + 1) + ':</b> ' + T.dapAnChu(q.dapAn) }));
      (q.loiGiai || []).forEach(function (b) { d.appendChild(el('div', { class: 'phieu-lg', html: T.md(b) })); });
      da.appendChild(d);
    });
    app.appendChild(de);
    app.appendChild(da);
  };
})(window.TOAN8);
```
  `app.js` `route()`: `else if (h[0] === 'phieu' && T.phieu) T.phieu(app, h[1], h[2] ? Number(h[2]) : 0);`.
  `review.js` (`T.onTapCuoiNam`): cạnh nút "Tạo đề" thêm nút `🖨 In phiếu` dẫn tới `'#/phieu/cuoi-nam-' + <các chương đang chọn nối bằng '.'>` (cập nhật href khi tick/bỏ tick).
  CSS:
```css
.phieu-nut { display: flex; gap: 10px; margin-bottom: 14px; }
.phieu { background: #fff; padding: 24px 28px; border-radius: 12px; border: 1px solid var(--line); }
.phieu-cau { margin: 14px 0; break-inside: avoid; }
.phieu-lam { height: 90px; border-bottom: 1px dotted #adb5bd; }
.phieu-hinh .board { max-height: 260px; max-width: 360px; margin: 6px 0; }
.phieu-dapan { margin-top: 24px; }
.phieu-lg { color: #495057; margin-left: 18px; font-size: .95rem; }
@media print {
  header, .phieu-nut, .tabs, .next, #warn { display: none !important; }
  body { background: #fff; font-size: 13pt; }
  .phieu { border: 0; padding: 0; }
  .phieu-dapan { break-before: page; }
  @page { size: A4; margin: 15mm; }
}
```
- [ ] **Step 2: Kiểm** – `node tools/smoke.js phieu/bai-6/123 --eval "return [document.querySelectorAll('.phieu:not(.phieu-dapan) .phieu-cau').length, document.querySelectorAll('.phieu-dapan .phieu-cau').length, document.querySelector('.phieu-ten').textContent.includes('123')]"` → `[10,10,true]`; cùng hạt giống mở lại → cùng nội dung câu 1. `phieu/cuoi-nam-1.9.10/5` → 10 câu, câu có hình hiện hình. Console sạch. (Giả lập in: `page.emulateMediaType('print')` + `--shot` để xem trang in – thêm cờ `--print` vào `tools/smoke.js`: nếu có thì gọi `await page.emulateMediaType('print')` trước khi chụp.)
- [ ] **Step 3:** Commit `feat: in phiếu bài tập 10 câu có đáp án (theo bài, ôn tập cuối năm)`.

### Task 10: Bài nền lớp 6–7 và kiểm tra đầu chương (`js/widgets/nen.js`)

**Files:** Create `js/widgets/nen.js`, `content/nen/phanSo.js` (bài nền mẫu); Modify `js/core/app.js` (route `nen`, `kiem-tra`; nút ở trang chủ), `content/index.js` (thêm `kiemTra` cho 1 chương mẫu – Chương 6), `index.html`, `tools/validate-content.js`, `tools/smoke-all.js`, `css/app.css`.

**Interfaces:**
- Produces: `TOAN8.nen({ id, ten, lop, tomTat:[khối như lyThuyet], viDu:[như viDu], luyen:[dạng như luyện thêm] })` → `T.nenBai[id]`; `T.luyenBai['nen-' + id]` (để tái dùng tab luyện thêm/ phiếu); route `#/nen/<id>`, `#/kiem-tra/<so chương>`; chương trong `T.mucLuc` có `kiemTra: [{ nen:'<id>', cau:{ de, dapAn, goiY, loiGiai, loiThuongGap? } }]`.
- Validator: `TOAN8.nen` thu thập; kiểm bài nền (có `tomTat` ≥ 1, `viDu` ≥ 1, `luyen` ≥ 2 dạng – kiểm như luyện thêm); kiểm `content/index.js`: mỗi `kiemTra[i].nen` trỏ bài nền có thật, `cau` kiểm như bài tập (`checkDapAn`, `checkLastLine`, KaTeX).
- [ ] **Step 1: Test validator (RED)** – fixture `tests/fixtures/nen-sai.js`:
```js
TOAN8.nen({ id: 'thuNghiem', ten: 'Thử', lop: 7, tomTat: [], viDu: [], luyen: [] });
```
  test: `run('nen-sai.js')` → status 1, stdout chứa `tomTat`, `viDu`, `luyen`.
- [ ] **Step 2: Cài đặt** `js/widgets/nen.js`
```js
// Ôn kiến thức cũ (lớp 6–7): bài nền ngắn + kiểm tra đầu chương chỉ ra bài nền cần ôn.
(function (T) {
  'use strict';
  var el = T.el;
  T.nenBai = {};
  T.nen = function (def) {
    T.nenBai[def.id] = def;
    if (def.luyen && def.luyen.length) T.luyen('nen-' + def.id, def.luyen);
  };
  T.trangNen = function (app, id) {
    var N = T.nenBai[id];
    if (!N) { app.appendChild(el('p', null, 'Không có bài ôn này. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    app.appendChild(el('div', { class: 'lesson-head' }, el('a', { href: '#/', class: 'back' }, '← Mục lục'),
      el('div', { class: 'crumb' }, 'Ôn kiến thức lớp ' + N.lop), el('h1', null, N.ten)));
    var tt = el('div');
    app.appendChild(tt);
    T.tabs.lyThuyet(tt, { lyThuyet: N.tomTat });
    if (N.viDu && N.viDu.length) { app.appendChild(el('h2', { class: 'muc-h' }, 'Ví dụ')); var vd = el('div'); app.appendChild(vd); T.tabs.viDu(vd, { id: 'nen-' + id, viDu: N.viDu, viDuMo: [] }); }
    app.appendChild(el('h2', { class: 'muc-h' }, 'Luyện tập'));
    var lt = el('div'); app.appendChild(lt);
    T.tabs.luyenThem(lt, { id: 'nen-' + id });
  };
  T.kiemTraChuong = function (app, so) {
    var C = T.mucLuc.filter(function (c) { return c.so === so; })[0];
    if (!C || !C.kiemTra) { app.appendChild(el('p', null, 'Chương này chưa có bài kiểm tra. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    app.appendChild(el('h1', null, 'Kiểm tra đầu chương ' + so + ': ' + C.ten));
    app.appendChild(el('p', null, 'Em làm thử ' + C.kiemTra.length + ' câu về kiến thức cũ cần cho chương này. Không tính điểm – làm xong bấm "Xem kết quả" để biết nên ôn phần nào.'));
    var kq = C.kiemTra.map(function (k, i) {
      var st = { dung: false };
      T.mountQuestion(app, Object.assign({ id: 'kt' + so + '.' + i }, k.cau), { record: false, onResult: function (r) { if (r.ok) st.dung = true; } });
      return st;
    });
    var out = el('div', { class: 'kt-ketqua', 'aria-live': 'polite' });
    app.appendChild(el('button', { class: 'btn primary', type: 'button', onclick: function () {
      out.innerHTML = '';
      var can = [];
      C.kiemTra.forEach(function (k, i) { if (!kq[i].dung && can.indexOf(k.nen) < 0) can.push(k.nen); });
      if (!can.length) { out.appendChild(el('p', { class: 'fb dung' }, '🎉 Em sẵn sàng học chương này!')); return; }
      out.appendChild(el('p', null, 'Em nên ôn lại trước:'));
      out.appendChild(el('ul', null, can.map(function (id) { var N = T.nenBai[id]; return el('li', null, el('a', { href: '#/nen/' + id }, N ? N.ten + ' (lớp ' + N.lop + ')' : id)); })));
    } }, 'Xem kết quả'));
    app.appendChild(out);
  };
})(window.TOAN8);
```
  Ghi chú: `T.tabs.viDu` đọc `bai.viDu`/`bai.viDuMo`; `T.tabs.luyenThem` đọc `bai.id`; `T.luyen` khai báo trong `luyen.js` nên `nen.js` nạp **sau** `luyen.js`.
  `app.js` `route()`: `else if (h[0] === 'nen' && T.trangNen) T.trangNen(app, h[1]); else if (h[0] === 'kiem-tra' && T.kiemTraChuong) T.kiemTraChuong(app, Number(h[1]));`. Trang chủ: trong tiêu đề chương, nếu `c.kiemTra` có → thêm `el('a', { class: 'kt-link', href: '#/kiem-tra/' + c.so }, '🔎 Kiểm tra đầu chương')`; cuối trang chủ (trước phần sao lưu) thêm mục "Ôn kiến thức cũ (lớp 6–7)" là lưới thẻ `#/nen/<id>` từ `T.nenBai`.
  `content/nen/phanSo.js` (bài nền mẫu "Phân số và các phép tính", lớp 6): `tomTat` 2–3 khối (rút gọn, quy đồng, cộng/trừ/nhân/chia), `viDu` 2, `luyen` 3 dạng (rút gọn phân số; cộng hai phân số khác mẫu; nhân/chia phân số) – mỗi dạng đúng khuôn luyện thêm. `content/index.js` chương 6 thêm `kiemTra` 5 câu gắn `nen: 'phanSo'` (rút gọn, quy đồng, cộng, chia phân số; phân tích nhân tử `x^2 - 4` gắn `nen: 'phanSo'` tạm thời – Task 12 thay bằng bài nền đúng).
  `smoke-all.js`: sau vòng bài, mở `#/nen/<id>` cho mọi `TOAN8.nenBai` và `#/kiem-tra/<so>` cho mọi chương có `kiemTra`.
- [ ] **Step 3:** `npm test` → PASS; `node tools/validate-content.js` OK; smoke `nen/phanSo`, `kiem-tra/6` sạch; script kiểm: không làm câu nào, bấm "Xem kết quả" → có link `#/nen/phanSo`.
- [ ] **Step 4:** Commit `feat: bài nền lớp 6–7 và kiểm tra đầu chương (mẫu: phân số, chương 6)`.

### Task 11: Nội dung luyện thêm 39 bài + kịch bản tự chạy (7 agent song song, theo chương)

**Files:** Create `content/luyen/luyen01.js … luyen39.js` (trừ `luyen06.js` đã có – agent chương II mở rộng thêm nếu cần); Modify `content/baiNN.js` chỉ để thêm `tuChay` (kịch bản) / `tuChay:false` vào `config` của khamPha/hình lý thuyết.

- [ ] **Step 1:** Viết bản hướng dẫn `scratchpad\brief-luyen.md` cho agent, gồm: khuôn `TOAN8.luyen(id, [dạng…], { deCo })` (chép đoạn mẫu từ `content/luyen/luyen06.js`), API `r`/`cc` (Task 1), quy tắc: ≥ 4 dạng mỗi bài (≥ 1 mức 1, ≥ 1 mức 2, ≥ 1 mức 3), số liệu đẹp, đề diễn đạt tự nhiên khác nhau giữa các hạt giống (dùng `r.chon` cho bối cảnh/tên người), mỗi dạng có `goiY` 2 nấc, `loiGiai` từng bước với dòng cuối `$… = đáp số$`, `loiThuongGap` 1–2 lỗi thật tính theo số đã sinh (và khác đáp án – nếu trùng thì bỏ); dạng hình học dùng `hinh: TOAN8.hinhGeo({...})` dựng đúng số liệu; bài khái niệm 10, 13, 14, 18, 19, 30 có thêm `deCo` ≥ 10 câu (id `NN.L1…`); không dùng `Math.random` trong `sinh` (chỉ `r`). Kịch bản tự chạy: chạy `node tools/smoke-tuchay.js <các id>`; với hình "không đổi"/"không có tự chạy" hoặc chạy vô nghĩa (xem ảnh chụp giữa lúc chạy bằng `node tools/smoke.js bai/NN/khamPha --wait 3000 --shot …`), thêm `tuChay: [...]` hoặc `tuChay: false` (hình tĩnh không cần chạy). Kiểm: `node tools/validate-content.js content/luyen/luyenNN.js content/baiNN.js` OK; `node tools/smoke.js bai/NN/luyenThem` sạch; `node tools/smoke-tuchay.js NN` sạch.
- [ ] **Step 2:** Giao 7 agent song song (chương I+II; III; IV+V; VI; VII; VIII; IX+X), mỗi agent chỉ sửa file của mình.
- [ ] **Step 3:** Khi xong: `node tools/validate-content.js --du-luyen` → OK (39 bài đều có ≥ 3 nguồn); `node tools/smoke-tuchay.js` → 0 lỗi; `node tools/smoke-all.js` (6 tab) sạch.
- [ ] **Step 4:** Commit theo chương `feat: luyện thêm + tự chạy chương …`.

### Task 12: Nội dung bài nền + kiểm tra đầu 10 chương (1 agent)

**Files:** Create `content/nen/*.js` (~12 bài: `phanSo` (đã có, mở rộng), `soHuuTi` (lũy thừa, quy tắc dấu ngoặc, chuyển vế), `bieuThucDaiSo` (lớp 7: biểu thức, đa thức một biến), `tiLeThuc`, `gocSongSong` (góc, hai đường thẳng song song, tổng ba góc tam giác), `tamGiacBang` (các trường hợp bằng nhau), `tamGiacCan`, `hinhKhoi7` (hình hộp, lăng trụ đứng), `thongKe7` (thu thập, biểu đồ đoạn/quạt lớp 7), `xacSuat7` (biến cố, xác suất lớp 7), `toaDo` (mặt phẳng toạ độ lớp 7… nếu SGK lớp 7 KNTT không có thì dùng `dongDaiLuong` – đại lượng tỉ lệ), `phanTichSo` (ƯCLN, BCNN)); Modify `content/index.js` (`kiemTra` 5–6 câu mỗi chương, gắn đúng bài nền), `index.html` (script `content/nen/*.js`).
- [ ] **Step 1:** Brief cho agent (tương tự Task 11 + khuôn `TOAN8.nen`, gắn nội dung theo SGK lớp 6–7 bộ KNTT – kiến thức phổ thông, không cần ảnh SGK lớp 6–7; tóm tắt ngắn, ví dụ có "Vì sao?", luyện ≥ 3 dạng sinh). Mỗi chương: chọn kiến thức nền thật sự cần (vd chương VI cần phân số, phân tích nhân tử; chương IX cần tam giác bằng nhau, tỉ lệ thức).
- [ ] **Step 2:** Kiểm: `node tools/validate-content.js` OK; smoke `nen/*`, `kiem-tra/1…10` sạch.
- [ ] **Step 3:** Commit `feat: 12 bài ôn kiến thức lớp 6–7 và kiểm tra đầu 10 chương`.

### Task 13: Soát toán độc lập trên mẫu đề sinh

**Files:** Create `tools/dump-luyen.js`; sửa nội dung theo kết quả soát.

- [ ] **Step 1: Công cụ** `tools/dump-luyen.js` – `node tools/dump-luyen.js <id|nen-id> [số đề=20]` in ra Markdown: với mỗi dạng, 20 đề (hạt giống 1…20): đề, đáp án (`dapAn` dạng chữ), gợi ý, lời giải, lỗi thường gặp; dùng cùng cách nạp file như validator (chép hàm `loadFile` thành module nhỏ `tools/nap-noi-dung.js` dùng chung cho cả hai).
- [ ] **Step 2:** Giao agent soát (gộp chương: I+II, III+IV, V+VIII, VI, VII, IX+X, bài nền + kiểm tra): đọc bản dump, tự giải ≥ 5 đề mỗi dạng, kiểm số đẹp, đề tự nhiên, gợi ý/lời giải đúng với chính số đã sinh, lỗi thường gặp có thật; xem ảnh hình của dạng hình học; sửa bằng Edit; chạy lại validator.
- [ ] **Step 3:** Commit `fix: sửa luyện thêm theo soát toán độc lập`.

### Task 14: Ôn tập cuối năm dùng câu sinh, README, rà code, phát hành

**Files:** Modify `js/widgets/review.js`, `README.md`.
- [ ] **Step 1:** `T.onTapCuoiNam` – với mỗi chương được chọn, kho câu = `baiTap` mức ≥ 2 + 3 câu sinh (`T.cauLuyen(id, r.chon([2,3]), seed)`) mỗi bài có luyện thêm; trộn như cũ. Kiểm smoke `on-tap-cuoi-nam` tạo đề 10 câu sạch.
- [ ] **Step 2:** README: mục phụ huynh thêm Luyện thêm, Tự chạy, Kiểm tra đầu chương/Ôn kiến thức cũ, In phiếu, Nháp; mục phát triển thêm khuôn `content/luyen`, `content/nen`, các công cụ `smoke-tuchay`, `dump-luyen`.
- [ ] **Step 3:** Rà code độc lập (model mạnh) toàn bộ `git diff main...HEAD -- js tools tests css index.html`; sửa Critical/Important với test RED→GREEN.
- [ ] **Step 4:** Kiểm cuối: `npm test`; `node tools/validate-content.js --du-luyen`; `node tools/smoke-all.js` và `--query nomathlive`; `node tools/smoke-tuchay.js`.
- [ ] **Step 5:** Gộp `--ff-only` vào `main`, `git push`, chờ Pages "built", chạy thử bản trên mạng (trang chủ, `bai/6/luyenThem`, `bai/38/khamPha`, `kiem-tra/6`, `nen/phanSo`, `phieu/bai-6/1`). Cập nhật skill `pb-toan8-soan-bai` và memory.
