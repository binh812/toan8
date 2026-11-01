// Trang "Ôn 5 câu hôm nay": câu đến hạn ôn (Leitner) + bù bằng câu đã làm đúng ở nhiều bài khác nhau (xen kẽ).
(function (T) {
  'use strict';
  var el = T.el, N = 5;

  T.findExercise = function (id) {
    for (var k in T.lessons) {
      var L = T.lessons[k], list = L.baiTap || [];
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return { bai: L, q: list[i] };
    }
    return null;
  };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  T.review = function (c) {
    var due = T.store.dueToday(N).map(T.findExercise).filter(Boolean);
    var used = {};
    due.forEach(function (x) { used[x.q.id] = 1; });
    if (due.length < N) {
      var pool = [];
      Object.keys(T.lessons).forEach(function (k) {
        (T.lessons[k].baiTap || []).forEach(function (q) {
          var s = T.store.exState(q.id);
          if (s && s.correct && q.muc <= 2 && !used[q.id]) pool.push({ bai: T.lessons[k], q: q });
        });
      });
      shuffle(pool).slice(0, N - due.length).forEach(function (x) { due.push(x); });
    }
    c.appendChild(el('h1', null, 'Ôn 5 câu hôm nay'));
    if (!due.length) {
      c.appendChild(el('p', null, 'Chưa có câu nào để ôn. Em làm bài tập ở một bài học trước nhé!'));
      c.appendChild(el('a', { class: 'btn primary', href: '#/' }, 'Về mục lục'));
      return;
    }
    c.appendChild(el('p', null, 'Các câu được trộn từ nhiều bài. Câu em từng làm sai sẽ quay lại sau 1 ngày, làm đúng thì giãn ra 2, 4, 8, 16 ngày – nhờ vậy em nhớ lâu hơn.'));
    due.forEach(function (x) {
      c.appendChild(el('div', { class: 'from' }, 'Từ ', el('a', { href: '#/bai/' + x.bai.id + '/lyThuyet' }, 'Bài ' + x.bai.id + '. ' + x.bai.ten), ' (xem lại lý thuyết)'));
      T.mountQuestion(c, x.q, { record: true });
    });
  };
})(window.TOAN8);
