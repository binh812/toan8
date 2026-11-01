// Tiến độ học: lần làm bài, tab đã xem, hộp ôn tập Leitner. Lưu trong localStorage (nếu dùng được).
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.TOAN8 = root.TOAN8 || {}; root.TOAN8.createStore = m.createStore; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var KEY = 'toan8.v1';
  var GAP = [0, 1, 2, 4, 8, 16]; // số ngày chờ của hộp 1..5
  var MASTERY = 0.8;

  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function empty() { return { v: 1, ex: {}, tabs: {}, box: {} }; }
  function valid(p) { return p && p.v === 1 && p.ex && typeof p.ex === 'object'; }
  function withDefaults(p) { return { v: 1, ex: p.ex, tabs: p.tabs || {}, box: p.box || {} }; }

  function createStore(storage, now) {
    now = now || function () { return new Date(); };
    var ok = !!storage, data = empty();
    if (ok) {
      try {
        var raw = storage.getItem(KEY);
        if (raw) {
          try { var p = JSON.parse(raw); if (valid(p)) data = withDefaults(p); }
          catch (e) { console.warn('Tiến độ cũ bị hỏng, bắt đầu lại.', e); }
        }
        storage.setItem(KEY, JSON.stringify(data));
      } catch (e) { ok = false; }
    }

    var api = { ok: ok };
    function save() {
      if (!api.ok) return;
      try { storage.setItem(KEY, JSON.stringify(data)); }
      catch (e) { api.ok = false; console.warn('Không lưu được tiến độ.', e); }
    }

    api.recordAttempt = function (id, r) {
      var e = data.ex[id] || (data.ex[id] = { tries: 0, correct: false, usedSolution: false, lastOk: false });
      var sol = r.hintLevel >= r.hintMax;
      e.tries++;
      e.lastOk = r.ok;
      if (sol) e.usedSolution = true;
      if (r.ok && !sol) e.correct = true;
      var today = dayNum(now()), b = data.box[id];
      if (!r.ok || sol) data.box[id] = { box: 1, due: today + GAP[1] };
      else if (b) { var nb = Math.min(5, b.box + 1); data.box[id] = { box: nb, due: today + GAP[nb] }; }
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
    api.dueToday = function (limit) {
      var today = dayNum(now());
      return Object.keys(data.box)
        .filter(function (id) { return data.box[id].due <= today; })
        .sort(function (a, b) { return data.box[a].due - data.box[b].due; })
        .slice(0, limit);
    };
    api.exportJSON = function () { return JSON.stringify(data); };
    api.importJSON = function (s) {
      try {
        var p = JSON.parse(s);
        if (!valid(p)) return false;
        data = withDefaults(p);
        save();
        return true;
      } catch (e) { return false; }
    };
    return api;
  }
  return { createStore: createStore };
});
