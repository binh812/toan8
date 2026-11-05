// Khung ứng dụng: đăng kí bài học, điều hướng theo hash, trang chủ (mục lục), khung bài 5 bước.
(function (T) {
  'use strict';
  var el = T.el;
  var TABS = [['khamPha', 'Khám phá'], ['lyThuyet', 'Lý thuyết'], ['viDu', 'Ví dụ'], ['tuLam', 'Tự làm'], ['timLoi', 'Tìm lỗi sai'], ['luyenThem', 'Luyện thêm']];
  T.TABS = TABS;
  T.lessons = {};
  T.widgets = T.widgets || {};
  T.tabs = T.tabs || {};

  T.bai = function (def) { T.lessons[def.id] = def; };

  T.findMeta = function (id) {
    for (var i = 0; i < T.mucLuc.length; i++)
      for (var j = 0; j < T.mucLuc[i].bai.length; j++)
        if (T.mucLuc[i].bai[j].id === id) return { chuong: T.mucLuc[i], meta: T.mucLuc[i].bai[j] };
    return null;
  };

  T.toast = function (msg) {
    var t = el('div', { class: 'toast', role: 'status' }, msg);
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  };

  // Gắn widget theo tên; nếu widget lỗi thì báo ngay trên trang thay vì im lặng.
  // opts.tuChay: hình ở Khám phá/Lý thuyết – tự chạy khi hiện ra (xem js/widgets/autoplay.js)
  T.mountWidget = function (container, name, config, opts) {
    var w = T.widgets[name];
    if (!w) { container.appendChild(el('p', { class: 'err' }, 'Thiếu hình minh họa "' + name + '".')); return null; }
    try {
      var kq = w(container, config || {});
      if (opts && opts.tuChay && T.tuChay) T.tuChay.tuDong(container, name, config || {});
      return kq;
    }
    catch (e) { console.error(e); container.appendChild(el('p', { class: 'err' }, 'Hình minh họa bị lỗi: ' + e.message)); return null; }
  };

  function safeStorage() { try { return window.localStorage; } catch (e) { return null; } }

  function lessonCard(c, b) {
    var L = T.lessons[b.id], st = L ? T.store.lessonStatus(L) : null;
    var pct = st && st.total ? Math.round(100 * st.done / st.total) : 0;
    return el(L ? 'a' : 'div', {
      class: 'card' + (L ? '' : ' locked') + (st && st.mastered ? ' mastered' : ''),
      href: L ? '#/bai/' + b.id + '/khamPha' : null, style: '--c:' + c.mau
    },
      el('span', { class: 'num' }, 'Bài ' + b.id),
      el('span', { class: 'ten' }, b.ten),
      L ? el('span', { class: 'bar', title: pct + '% bài tập đã làm đúng' }, el('i', { style: 'width:' + pct + '%' }))
        : el('span', { class: 'soon' }, 'Sắp có'),
      st && st.mastered ? el('span', { class: 'badge' }, '✓ Thành thạo') : null);
  }

  function home(app) {
    var due = T.store.dueToday(5, function (id) { return !!T.findExercise(id); }).length;
    app.appendChild(el('section', { class: 'hero' },
      el('h1', null, 'Chào em! Hôm nay mình học bài nào?'),
      el('p', null, 'Mỗi bài có 5 bước: ', el('b', null, 'Khám phá → Lý thuyết → Ví dụ → Tự làm → Tìm lỗi sai'), '. Cứ làm thử – sai cũng không sao, máy sẽ chỉ cho em chỗ sai.'),
      el('div', { class: 'hero-nut' },
        due ? el('a', { class: 'btn primary', href: '#/on-tap' }, 'Có ' + due + ' câu cần ôn hôm nay →') : null,
        el('a', { class: 'btn', href: '#/on-tap-cuoi-nam' }, 'Ôn tập cuối năm'))));
    T.mucLuc.forEach(function (c) {
      var grid = el('div', { class: 'grid' });
      c.bai.forEach(function (b) { grid.appendChild(lessonCard(c, b)); });
      app.appendChild(el('section', { class: 'chuong', style: '--c:' + c.mau },
        el('h2', null, el('span', { class: 'chip' }, 'Chương ' + c.so), ' ' + c.ten, el('small', null, ' · SGK Tập ' + c.tap),
          c.kiemTra ? el('a', { class: 'kt-link', href: '#/kiem-tra/' + c.so }, '🔎 Kiểm tra đầu chương') : null), grid));
    });
    var nen = Object.keys(T.nenBai || {});
    if (nen.length) {
      var gn = el('div', { class: 'grid' });
      nen.forEach(function (id) {
        var N = T.nenBai[id];
        gn.appendChild(el('a', { class: 'card', href: '#/nen/' + id, style: '--c:#495057' }, el('span', { class: 'num' }, 'Lớp ' + N.lop), el('span', { class: 'ten' }, N.ten)));
      });
      app.appendChild(el('section', { class: 'chuong', style: '--c:#495057' },
        el('h2', null, el('span', { class: 'chip' }, 'Ôn lại'), ' Kiến thức cũ (lớp 6–7)', el('small', null, ' · khi thấy bí, ôn phần nền này trước')), gn));
    }
    app.appendChild(el('section', { class: 'backup' },
      el('p', null, 'Tiến độ được lưu trên máy này. Muốn chuyển sang máy khác thì lưu ra file rồi mở lại ở máy kia.'),
      el('button', { class: 'btn', onclick: exportProgress }, 'Lưu tiến độ ra file'), ' ',
      el('label', { class: 'btn' }, 'Mở file tiến độ', el('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: importProgress }))));
  }

  function exportProgress() {
    var url = URL.createObjectURL(new Blob([T.store.exportJSON()], { type: 'application/json' }));
    var a = el('a', { href: url, download: 'tien-do-toan8.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importProgress(ev) {
    var input = ev.target, f = input.files[0];
    input.value = ''; // để chọn lại đúng file đó lần sau vẫn kích hoạt
    if (!f) return;
    if (!window.confirm('Mở file này sẽ thay tiến độ hiện tại trên máy. Tiếp tục?')) return;
    f.text().then(function (s) {
      T.toast(T.store.importJSON(s) ? 'Đã mở tiến độ.' : 'File không đúng định dạng tiến độ.');
      route();
    }, function (e) { T.toast('Không đọc được file: ' + e.message); });
  }

  function lesson(app, id, tab) {
    var L = T.lessons[id], info = T.findMeta(id);
    if (!L || !info) { app.appendChild(el('p', null, 'Bài này chưa có nội dung. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    var idx = TABS.findIndex(function (t) { return t[0] === tab; });
    if (idx < 0) { idx = 0; tab = TABS[0][0]; }
    document.documentElement.style.setProperty('--c', info.chuong.mau);
    var seen = T.store.tabsSeen(id);
    var bar = el('nav', { class: 'tabs' });
    TABS.forEach(function (t, i) {
      bar.appendChild(el('a', { href: '#/bai/' + id + '/' + t[0], class: t[0] === tab ? 'on' : (seen.indexOf(t[0]) >= 0 ? 'seen' : '') }, (i + 1) + '. ' + (t[0] === 'khamPha' && L.nhin ? 'Nhìn là hiểu' : t[1])));
    });
    app.appendChild(el('div', { class: 'lesson-head' },
      el('a', { href: '#/', class: 'back' }, '← Mục lục'),
      el('div', { class: 'crumb' }, 'Chương ' + info.chuong.so + '. ' + info.chuong.ten),
      el('h1', null, 'Bài ' + id + '. ' + L.ten),
      el('span', { class: 'sgk' }, '📖 SGK Tập ' + L.sgk.tap + ', trang ' + L.sgk.trang)));
    app.appendChild(bar);
    var body = el('div', { class: 'tab-body tab-' + tab });
    app.appendChild(body);
    T.store.markTab(id, tab);
    (T.tabs[tab] || function (c) { c.textContent = 'Phần này chưa có.'; })(body, L);
    if (idx < TABS.length - 1)
      app.appendChild(el('div', { class: 'next' }, el('a', { class: 'btn primary', href: '#/bai/' + id + '/' + TABS[idx + 1][0] }, 'Sang bước ' + (idx + 2) + ': ' + TABS[idx + 1][1] + ' →')));
    else
      app.appendChild(el('div', { class: 'next' }, el('a', { class: 'btn primary', href: '#/' }, 'Xong bài! Về mục lục →')));
  }

  function route() {
    var app = document.getElementById('app');
    if (T.tuChay) T.tuChay.huyHet(); // tắt tự chạy của trang trước
    if (T.freeBoards) T.freeBoards(); // giải phóng hình JSXGraph của trang trước
    app.innerHTML = '';
    document.documentElement.style.removeProperty('--c');
    var h = location.hash.replace(/^#\/?/, '').split('/');
    try {
      if (h[0] === 'bai') lesson(app, Number(h[1]), h[2] || 'khamPha');
      else if (h[0] === 'on-tap' && T.review) T.review(app);
      else if (h[0] === 'on-tap-cuoi-nam' && T.onTapCuoiNam) T.onTapCuoiNam(app);
      else if (h[0] === 'nen' && T.trangNen) T.trangNen(app, h[1]);
      else if (h[0] === 'kiem-tra' && T.kiemTraChuong) T.kiemTraChuong(app, Number(h[1]));
      else if (h[0] === 'phieu' && T.phieu) T.phieu(app, h[1], h[2] ? Number(h[2]) : 0);
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
    var w = document.getElementById('warn');
    if (!T.store.ok) {
      w.hidden = false;
      w.textContent = 'Trình duyệt đang chặn lưu dữ liệu – tiến độ sẽ không được lưu sau khi đóng trang.';
    } else if (T.store.recovered) {
      w.hidden = false;
      w.textContent = 'Tiến độ cũ trên máy này bị hỏng nên đã bắt đầu lại (bản cũ vẫn được giữ trong trình duyệt). Nếu có file tiến độ đã lưu, bấm "Mở file tiến độ" ở cuối trang chủ.';
    }
    window.addEventListener('hashchange', route);
    route();
  };
})(window.TOAN8);
