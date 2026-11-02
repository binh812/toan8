// Phiếu bài tập để in: 10 câu (có hình), chỗ trống để làm; trang sau là đáp án và lời giải.
// Route: #/phieu/bai-<id>[/<hạt giống>]  ·  #/phieu/cuoi-nam-<chương.chương…>[/<hạt giống>]
(function (T) {
  'use strict';
  var el = T.el, CHU = 'ABCDEFGH';
  function bo(s) { return T.md(String(s)).replace(/^<p>|<\/p>$/g, ''); }
  function soTex(v) {
    var s = String(v);
    return /[\/a-z]/i.test(s) ? T.parser.toLatex(T.parser.parse(s)) : s.replace('.', '{,}');
  }

  // Đáp án viết thành chữ/công thức để in ở trang đáp án
  T.dapAnChu = function (d) {
    switch (d.kieu) {
      case 'so': return T.tex(soTex(d.gt));
      case 'bieuThuc': return T.tex(T.parser.toLatex(T.parser.parse(d.gt)));
      case 'nghiem':
        if (d.gt === 'voNghiem') return 'Phương trình vô nghiệm';
        if (d.gt === 'voSoNghiem') return 'Phương trình có vô số nghiệm';
        return d.gt.map(function (x) { return T.tex('x = ' + soTex(x)); }).join('; ');
      case 'chon': return CHU[d.gt] + '. ' + bo(d.luaChon[d.gt]);
      case 'dungSai': return d.gt ? 'Đúng' : 'Sai';
      case 'nhieuO': return d.o.map(function (o) { return bo(o.nhan || '') + ' ' + T.dapAnChu(o); }).join('; ');
    }
    return '';
  };

  function hat(r) { return r.so(1, 2147483646); }
  function chonCau(nguon, seed) {
    var r = T.taoRng(seed), cau = [], m;
    if ((m = /^bai-(\d+)$/.exec(nguon))) {
      var id = Number(m[1]), truoc = null;
      if (!T.nguonLuyen(id).length) return ((T.lessons[id] && T.lessons[id].baiTap) || []).slice(0, 10);
      [1, 1, 1, 2, 2, 2, 2, 3, 3, 3].forEach(function (muc) {
        var q = T.cauLuyen(id, muc, hat(r), truoc);
        truoc = q.nguon;
        cau.push(q);
      });
      return cau;
    }
    if ((m = /^cuoi-nam-([\d.]+)$/.exec(nguon))) {
      var chuong = m[1].split('.').map(Number), bai = [];
      T.mucLuc.forEach(function (c) { if (chuong.indexOf(c.so) >= 0) c.bai.forEach(function (b) { if (T.lessons[b.id]) bai.push(b.id); }); });
      var daCo = {};
      for (var lan = 0; cau.length < 10 && bai.length && lan < 60; lan++) {
        var id2 = bai[r.so(0, bai.length - 1)], q2 = T.cauLuyen(id2, r.chon([2, 2, 3]), hat(r));
        if (!q2) {
          var ds = T.lessons[id2].baiTap.filter(function (x) { return x.muc >= 2; });
          q2 = ds[r.so(0, ds.length - 1)];
        }
        // không lặp câu (câu sinh có id theo hạt giống nên gần như không trùng; câu trong sách thì có thể)
        if (!q2 || daCo[q2.id]) continue;
        daCo[q2.id] = 1;
        cau.push(q2);
      }
      return cau;
    }
    return [];
  }

  T.phieu = function (app, nguon, seed) {
    seed = seed || hat(T.taoRng(Date.now()));
    var cau = chonCau(nguon || '', seed);
    var m = /^bai-(\d+)$/.exec(nguon || ''), L = m && T.lessons[m[1]];
    if (!cau.length) { app.appendChild(el('p', null, 'Không tạo được phiếu này. ', el('a', { href: '#/' }, 'Về mục lục'))); return; }
    app.appendChild(el('div', { class: 'phieu-nut' },
      el('button', { class: 'btn primary', type: 'button', onclick: function () { window.print(); } }, '🖨 In phiếu'),
      el('a', { class: 'btn', href: '#/phieu/' + nguon + '/' + hat(T.taoRng(seed + 1)) }, '🔄 Đề khác'),
      el('a', { class: 'btn ghost', href: L ? '#/bai/' + m[1] + '/luyenThem' : '#/on-tap-cuoi-nam' }, '← Quay lại')));
    var de = el('section', { class: 'phieu' },
      el('h1', null, 'Phiếu bài tập – ' + (L ? 'Bài ' + m[1] + '. ' + L.ten : 'Ôn tập cuối năm')),
      el('p', { class: 'phieu-ten' }, 'Họ và tên: ……………………………………   Ngày: …………   Mã đề: ' + seed));
    app.appendChild(de);
    cau.forEach(function (q, i) {
      var c = el('div', { class: 'phieu-cau' }, el('div', { html: '<b>Câu ' + (i + 1) + '.</b> ' + bo(q.de) }));
      de.appendChild(c);
      if (q.hinh) T.mountWidget(c.appendChild(el('div', { class: 'phieu-hinh' })), q.hinh.widget, q.hinh.config);
      if (q.dapAn.kieu === 'chon') {
        var ol = el('ol', { class: 'phieu-chon', type: 'A' });
        q.dapAn.luaChon.forEach(function (x) { ol.appendChild(el('li', { html: bo(x) })); });
        c.appendChild(ol);
      } else if (q.dapAn.kieu === 'dungSai') c.appendChild(el('div', { class: 'phieu-o' }, '☐ Đúng    ☐ Sai'));
      else if (q.dapAn.kieu === 'nhieuO') q.dapAn.o.forEach(function (o) { c.appendChild(el('div', { class: 'phieu-o', html: bo(o.nhan || '') + ' ……………………' })); });
      c.appendChild(el('div', { class: 'phieu-lam' }));
    });
    var da = el('section', { class: 'phieu phieu-dapan' }, el('h2', null, 'Đáp án – Mã đề ' + seed));
    cau.forEach(function (q, i) {
      var d = el('div', { class: 'phieu-cau' }, el('div', { html: '<b>Câu ' + (i + 1) + ':</b> ' + T.dapAnChu(q.dapAn) }));
      (q.loiGiai || []).forEach(function (b) { d.appendChild(el('div', { class: 'phieu-lg', html: T.md(b) })); });
      da.appendChild(d);
    });
    app.appendChild(da);
  };
})(window.TOAN8);
