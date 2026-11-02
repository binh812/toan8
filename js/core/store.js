// Tiến độ học: lần làm bài, tab đã xem, hộp ôn tập Leitner. Lưu trong localStorage (nếu dùng được).
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.createStore = m.createStore; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var KEY = 'toan8.v1', BACKUP = 'toan8.v1.hong';
  var GAP = [0, 1, 2, 4, 8, 16]; // số ngày chờ của hộp 1..5
  var MASTERY = 0.8;

  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  // Câu sinh tự động (luyện thêm) có id 'L<bài>-<hạt giống>': không bao giờ gặp lại nên không vào bài tập/ôn tập
  function laCauSinh(id) { return /^L/.test(id); }
  function empty() { return { v: 1, ex: {}, tabs: {}, box: {}, luyen: {} }; }
  function isObj(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
  function valid(p) { return isObj(p) && p.v === 1 && isObj(p.ex); }

  // Làm sạch dữ liệu đọc từ máy hoặc từ file: bỏ mọi mục sai cấu trúc để không làm hỏng trang.
  function sanitize(p) {
    var out = empty();
    Object.keys(p.ex).forEach(function (id) {
      var e = p.ex[id];
      if (!isObj(e) || laCauSinh(id)) return;
      out.ex[id] = { tries: Number.isFinite(e.tries) ? e.tries : 0, correct: e.correct === true, usedSolution: e.usedSolution === true, lastOk: e.lastOk === true };
    });
    if (isObj(p.tabs)) Object.keys(p.tabs).forEach(function (id) {
      if (Array.isArray(p.tabs[id])) out.tabs[id] = p.tabs[id].filter(function (t) { return typeof t === 'string'; });
    });
    if (isObj(p.box)) Object.keys(p.box).forEach(function (id) {
      var b = p.box[id];
      if (!laCauSinh(id) && isObj(b) && Number.isInteger(b.box) && b.box >= 1 && b.box <= 5 && Number.isFinite(b.due))
        out.box[id] = { box: b.box, due: b.due, day: Number.isFinite(b.day) ? b.day : null };
    });
    // luyện thêm: { lam, dung, ngay: { <số ngày>: [lam, dung] } } – bỏ mục sai cấu trúc
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
    return out;
  }

  function createStore(storage, now) {
    now = now || function () { return new Date(); };
    var ok = !!storage, data = empty(), recovered = false;
    if (ok) {
      try {
        var raw = storage.getItem(KEY);
        if (raw) {
          var p = null;
          try { p = JSON.parse(raw); } catch (e) { p = null; }
          if (valid(p)) data = sanitize(p);
          else { recovered = true; storage.setItem(BACKUP, raw); } // giữ bản hỏng để còn cứu được
        }
        storage.setItem(KEY, JSON.stringify(data));
      } catch (e) { ok = false; }
    }

    var api = { ok: ok, recovered: recovered };
    function save() {
      if (!api.ok) return;
      try { storage.setItem(KEY, JSON.stringify(data)); }
      catch (e) { api.ok = false; console.warn('Không lưu được tiến độ.', e); }
    }

    api.recordAttempt = function (id, r) {
      if (laCauSinh(id)) return;
      var e = data.ex[id] || (data.ex[id] = { tries: 0, correct: false, usedSolution: false, lastOk: false });
      var sol = r.hintLevel >= r.hintMax;
      e.tries++;
      e.lastOk = r.ok;
      if (sol) e.usedSolution = true;
      if (r.ok && !sol) e.correct = true;
      var today = dayNum(now()), b = data.box[id];
      if (!r.ok || sol) data.box[id] = { box: 1, due: today + GAP[1], day: today };
      else if (b && b.day !== today) { // mỗi ngày chỉ lên hộp một lần (bấm Kiểm tra lại không tính)
        var nb = Math.min(5, b.box + 1);
        data.box[id] = { box: nb, due: today + GAP[nb], day: today };
      }
      save();
    };
    api.exState = function (id) {
      var e = data.ex[id];
      return e ? { tries: e.tries, correct: e.correct, usedSolution: e.usedSolution, lastOk: e.lastOk } : null;
    };
    api.markTab = function (baiId, tab) {
      var t = data.tabs[baiId] || (data.tabs[baiId] = []);
      if (t.indexOf(tab) < 0) { t.push(tab); save(); }
    };
    api.tabsSeen = function (baiId) { return (data.tabs[baiId] || []).slice(); };
    api.lessonStatus = function (bai) {
      var list = bai.baiTap || [], done = 0, base = 0, baseOk = 0, hardOk = false;
      list.forEach(function (x) {
        var e = data.ex[x.id], good = !!(e && e.correct);
        if (good) done++;
        if (x.muc <= 2) { base++; if (good) baseOk++; } else if (good) hardOk = true;
      });
      return { done: done, total: list.length, mastered: base > 0 && baseOk / base >= MASTERY && hardOk };
    };
    // tonTai(id): câu còn trong nội dung không – lọc TRƯỚC khi cắt, để câu đã bị xoá không chiếm chỗ
    api.dueToday = function (limit, tonTai) {
      var today = dayNum(now());
      return Object.keys(data.box)
        .filter(function (id) { return data.box[id].due <= today && (!tonTai || tonTai(id)); })
        .sort(function (a, b) { return data.box[a].due - data.box[b].due; })
        .slice(0, limit);
    };
    api.recordLuyen = function (baiId, ok) {
      var l = data.luyen[baiId] || (data.luyen[baiId] = { lam: 0, dung: 0, ngay: {} });
      var k = String(dayNum(now())), d = l.ngay[k] || (l.ngay[k] = [0, 0]);
      l.lam++; d[0]++;
      if (ok) { l.dung++; d[1]++; }
      var keys = Object.keys(l.ngay).sort(function (a, b) { return a - b; });
      while (keys.length > 60) delete l.ngay[keys.shift()]; // chỉ giữ 60 ngày gần nhất
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
    api.exportJSON = function () { return JSON.stringify(data); };
    api.importJSON = function (s) {
      var p;
      try { p = JSON.parse(s); } catch (e) { return false; }
      if (!valid(p)) return false;
      data = sanitize(p);
      save();
      return true;
    };
    return api;
  }
  return { createStore: createStore };
});
