// Trang "Nhìn là hiểu": Nhìn (hình cho thấy vì sao đúng) → Dùng (giải ngay trên hình, sai thì hình chỉ ra) → Suy ra (ba đề cùng một khuôn).
(function (T) {
  'use strict';
  var el = T.el, THOI_GIAN_HIEN = 1200;

  // Câu Dùng và Suy ra lấy đề từ bài tập gốc; khối nhin có thể ghi đè từng trường
  function cauHoi(bai, d, tien) {
    var goc = (bai.baiTap || []).filter(function (q) { return q.id === d.tuBai; })[0] || {};
    return { id: tien + '-' + d.tuBai, de: d.de || goc.de, dapAn: d.dapAn || goc.dapAn, goiY: d.goiY || goc.goiY, loiGiai: d.loiGiai || goc.loiGiai, loiThuongGap: d.loiThuongGap || goc.loiThuongGap };
  }
  function phan(nhan, tieuDe, lop) {
    return el('section', { class: 'nhin-phan ' + lop }, el('p', { class: 'nhin-nhan' }, nhan), el('h2', { html: T.mdInline(tieuDe) }));
  }
  // Số đầu tiên trong đáp án em gõ ("x = 4" → 4, "6,96" → 6.96); null nếu không có số
  function soTrong(v) {
    var m = /-?\d+(?:[.,]\d+)?/.exec(String(v));
    return m ? parseFloat(m[0].replace(',', '.')) : null;
  }
  function dat(tin, lop, noiDung) { tin.className = 'nhin-tin ' + lop; tin.innerHTML = T.md(noiDung).replace(/^<p>|<\/p>$/g, ''); }
  // Tìm phản ứng của hình cho một đáp án sai: theo danh sách lỗi đã biết, rồi theo số em gõ
  function timPhanUng(d, kieu, v) {
    var khop = (d.phanUng || []).filter(function (u) {
      try { return T.checker.checkAnswer({ kieu: kieu, gt: u.gt }, v).ok; } catch (e) { return false; }
    })[0];
    if (khop) return khop;
    var so = soTrong(v);
    return d.soBatKi && so !== null ? d.soBatKi(so) : null;
  }
  // Chạy t từ 0 tới 1 cho hình hiện ra; ai cần giảm chuyển động thì hiện ngay
  function chayToi(w) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { w.datT(1); return; }
    var dau = null;
    (function buoc(n) {
      if (dau === null) dau = n;
      var k = Math.min(1, (n - dau) / THOI_GIAN_HIEN);
      w.datT(k);
      if (k < 1 && document.contains(w.svg)) requestAnimationFrame(buoc);
    })(performance.now());
  }

  function veNhin(c, n) {
    var s = phan('Nhìn', n.tieuDe, 'nhin-nhin'), hinh = el('div'), chu = el('div');
    s.appendChild(el('div', { class: 'hai-ben' }, hinh, chu));
    c.appendChild(s);
    T.mountWidget(hinh, 'canh', Object.assign({ buoc: n.buoc, choBuoc: chu }, n.canh));
    chu.appendChild(el('div', { class: 'nhin-ket', html: T.md(n.ketLuan) }));
    if (n.loai === 'minhHoa') chu.appendChild(el('p', { class: 'nhin-luu-y', html: T.md('Hình cho thấy một trường hợp, chưa phải chứng minh. ' + (n.luuY || '')).replace(/^<p>|<\/p>$/g, '') }));
  }

  function veDung(c, bai, d) {
    var s = phan('Dùng', d.tieuDe || 'Giải ngay trên hình', 'nhin-dung'), hinh = el('div'), chu = el('div');
    s.appendChild(el('div', { class: 'hai-ben' }, hinh, chu));
    c.appendChild(s);
    var w = T.mountWidget(hinh, 'canh', Object.assign({ chiXem: true }, d.canh));
    var tin = el('p', { class: 'nhin-tin', role: 'status' }, d.moiThu || 'Gõ thử đi. Nếu sai, hình sẽ cho thấy vì sao.');
    var q = cauHoi(bai, d, 'nhin');
    T.mountQuestion(chu, q, { record: false, onResult: function (r, ct) {
      if (r.code === 'khongDoc') return;
      // Đưa hình về trạng thái gốc trước khi vẽ lần thử mới
      w.datThamSo({ thu: undefined, trangThai: null });
      w.datT(0);
      if (r.ok) {
        if (d.khiDung) w.datThamSo(d.khiDung);
        w.datT(1);
        dat(tin, 'dung', 'Đúng! ' + d.dungChu);
        return;
      }
      var u = timPhanUng(d, q.dapAn.kieu, ct.giaTri);
      if (u) {
        if (u.thamSo) w.datThamSo(u.thamSo);
        if (u.trangThai) w.datTrangThai(u.trangThai);
        dat(tin, 'sai', u.loi);
      } else dat(tin, 'sai', d.saiChu || 'Chưa đúng. Nhìn lại hình rồi thử lần nữa.');
    } });
    chu.appendChild(tin);
  }

  function veSuyRa(c, bai, sr) {
    var s = phan('Suy ra bài khác', sr.tieuDe || 'Đề đổi, nhưng hình vẫn là hình đó', 'nhin-suy-ra'), ba = el('div', { class: 'nhin-ba' });
    s.appendChild(ba);
    c.appendChild(s);
    sr.baDe.forEach(function (d) {
      var the = el('article', { class: 'nhin-the' }), hinh = el('div');
      the.appendChild(hinh);
      ba.appendChild(the);
      var w = T.mountWidget(hinh, 'canh', Object.assign({ chiXem: true }, d.canh));
      the.appendChild(el('button', { class: 'btn ghost', type: 'button', onclick: function () { chayToi(w); } }, d.tenNut));
      var tin = el('p', { class: 'nhin-tin', role: 'status' });
      T.mountQuestion(the, cauHoi(bai, d, 'nhin'), { record: false, onResult: function (r) {
        if (r.code === 'khongDoc') return;
        w.datT(1);
        if (r.ok) w.datTrangThai('giai');
        dat(tin, r.ok ? 'dung' : 'sai', r.ok ? 'Đúng! ' + d.dungChu : d.saiChu);
      } });
      the.appendChild(tin);
    });
    s.appendChild(el('p', { class: 'nhin-cach', html: T.mdInline(sr.cachNhan) }));
  }

  T.nhin = function (c, bai) {
    var n = bai.nhin;
    veNhin(c, n);
    veDung(c, bai, n.dung);
    veSuyRa(c, bai, n.suyRa);
  };
})(window.TOAN8);
