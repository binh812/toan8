// Ôn kiến thức cũ (lớp 6–7): bài nền ngắn (tóm tắt → ví dụ → luyện tập) và kiểm tra đầu chương chỉ ra bài nền cần ôn.
(function (T) {
  'use strict';
  var el = T.el;
  T.nenBai = {};
  // TOAN8.nen({ id, ten, lop, tomTat:[khối như lyThuyet], viDu:[như viDu], luyen:[dạng như luyện thêm] }) – content/nen/*.js
  T.nen = function (def) {
    T.nenBai[def.id] = def;
    if (def.luyen && def.luyen.length) T.luyen('nen-' + def.id, def.luyen);
  };

  T.trangNen = function (app, id) {
    var N = T.nenBai[id];
    if (!N) { app.appendChild(el('p', null, 'Không có bài ôn này. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    app.appendChild(el('div', { class: 'lesson-head' },
      el('a', { href: '#/', class: 'back' }, '← Mục lục'),
      el('div', { class: 'crumb' }, 'Ôn kiến thức lớp ' + N.lop),
      el('h1', null, N.ten)));
    var tt = el('div', { class: 'tab-body' });
    app.appendChild(tt);
    T.tabs.lyThuyet(tt, { lyThuyet: N.tomTat || [] });
    if (N.viDu && N.viDu.length) {
      app.appendChild(el('h2', { class: 'muc-h' }, 'Ví dụ'));
      var vd = el('div');
      app.appendChild(vd);
      T.tabs.viDu(vd, { id: 'nen-' + id, viDu: N.viDu, viDuMo: [] });
    }
    app.appendChild(el('h2', { class: 'muc-h' }, 'Luyện tập'));
    var lt = el('div');
    app.appendChild(lt);
    T.tabs.luyenThem(lt, { id: 'nen-' + id });
  };

  T.kiemTraChuong = function (app, so) {
    var C = T.mucLuc.filter(function (c) { return c.so === so; })[0];
    if (!C || !C.kiemTra) { app.appendChild(el('p', null, 'Chương này chưa có bài kiểm tra. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    app.appendChild(el('a', { href: '#/', class: 'back' }, '← Mục lục'));
    app.appendChild(el('h1', null, 'Kiểm tra đầu chương ' + so + ': ' + C.ten));
    app.appendChild(el('p', null, 'Em làm thử ' + C.kiemTra.length + ' câu về kiến thức cũ cần cho chương này. Không tính điểm – làm xong bấm "Xem kết quả" để biết nên ôn phần nào.'));
    var kq = C.kiemTra.map(function (k, i) {
      var st = { dung: false }, q = { id: 'kt' + so + '.' + i };
      for (var key in k.cau) q[key] = k.cau[key];
      // chỉ tính là "biết" khi tự làm đúng mà chưa xem lời giải; kết quả chốt ở lần đúng đầu tiên hoặc khi xem lời giải
      T.mountQuestion(app, q, { record: false,
        onResult: function (r, ct) { if (!st.chot && r.ok) { st.dung = !ct.xemLoiGiai; st.chot = true; } },
        onXemLoiGiai: function () { if (!st.chot) { st.dung = false; st.chot = true; } } });
      return st;
    });
    var out = el('div', { class: 'kt-ketqua', 'aria-live': 'polite' });
    app.appendChild(el('button', { class: 'btn primary', type: 'button', onclick: function () {
      out.innerHTML = '';
      var can = [];
      C.kiemTra.forEach(function (k, i) { if (!kq[i].dung && can.indexOf(k.nen) < 0) can.push(k.nen); });
      if (!can.length) {
        out.appendChild(el('p', { class: 'fb dung' }, '🎉 Em sẵn sàng học chương này! ', el('a', { href: '#/bai/' + C.bai[0].id + '/khamPha' }, 'Vào bài đầu tiên →')));
        return;
      }
      out.appendChild(el('p', null, 'Em nên ôn lại trước (mỗi phần chỉ 10–15 phút):'));
      var ul = el('ul');
      can.forEach(function (id) {
        var N = T.nenBai[id];
        ul.appendChild(el('li', null, el('a', { href: '#/nen/' + id }, N ? N.ten + ' (lớp ' + N.lop + ')' : id)));
      });
      out.appendChild(ul);
    } }, 'Xem kết quả'));
    app.appendChild(out);
  };
})(window.TOAN8);
