// Trang "Nhìn là hiểu": Nhìn (hình cho thấy vì sao đúng) → Dùng (giải ngay trên hình, sai thì hình chỉ ra) → Suy ra (ba đề cùng một khuôn).
(function (T) {
  'use strict';
  var el = T.el, THOI_GIAN_HIEN = 1200, SO_QUA_LON = 1e6;

  // Câu Dùng và Suy ra lấy đề từ bài tập gốc; khối nhin có thể ghi đè từng trường.
  // Không lấy lỗi thường gặp của bài gốc: lời giải thích ở đó hay ghi luôn đáp số; ở đây hình và phanUng đã phản ứng theo lỗi
  function cauHoi(bai, d, tien) {
    var goc = (bai.baiTap || []).filter(function (q) { return q.id === d.tuBai; })[0] || {};
    return { id: tien + '-' + d.tuBai, de: d.de || goc.de, dapAn: d.dapAn || goc.dapAn, goiY: d.goiY || goc.goiY, loiGiai: d.loiGiai || goc.loiGiai, loiThuongGap: (d.loiThuongGap || []).map(function (l) { return { gt: l.gt, giaiThich: l.giaiThich }; }) };
  }
  function phan(nhan, tieuDe, lop) {
    return el('section', { class: 'nhin-phan ' + lop }, el('p', { class: 'nhin-nhan' }, nhan), el('h2', { html: T.mdInline(tieuDe) }));
  }
  // Giá trị em gõ khi đó đúng là một số: "x = 4", "6,96 m", "−1", "13/2". Biểu thức như sqrt(48.5) thì trả null
  function soTrong(v) {
    var m = /^\s*(?:[a-zA-Z]\s*=\s*)?([-−]?)(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+(?:[.,]\d+)?))?\s*(?:k?m)?\s*$/.exec(String(v));
    if (!m) return null;
    var so = parseFloat(m[2].replace(',', '.')), mau = m[3] ? parseFloat(m[3].replace(',', '.')) : 1;
    return mau ? (m[1] ? -1 : 1) * so / mau : null;
  }
  function dat(tin, lop, noiDung) { tin.className = 'nhin-tin ' + lop; tin.innerHTML = noiDung ? T.md(noiDung).replace(/^<p>|<\/p>$/g, '') : ''; }
  // Phản ứng của hình cho một đáp án sai: theo danh sách lỗi đã biết, rồi theo số em gõ
  function timPhanUng(d, kieu, v) {
    var khop = (d.phanUng || []).filter(function (u) {
      try { return T.checker.checkAnswer({ kieu: kieu, gt: u.gt }, v).ok; } catch (e) { return false; }
    })[0];
    if (khop) return khop;
    var so = soTrong(v);
    if (so === null || !d.soBatKi) return null;
    return Math.abs(so) > SO_QUA_LON ? { t: 0, loi: 'Số này lớn quá, em thử một số nhỏ hơn.' } : d.soBatKi(so);
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
  // Xử lý kết quả chấm, dùng chung cho Dùng và Suy ra
  function khiCham(w, tin, d, kieu) {
    return function (r, ct) {
      // Mỗi lần thử bắt đầu lại từ hình gốc, để hình và lời nhắc không nói trái nhau
      w.datThamSo({ thu: undefined, trangThai: null });
      if (r.code === 'khongDoc') { w.datT(0); dat(tin, '', ''); return; }
      if (r.ok) {
        if (d.khiDung) w.datThamSo(d.khiDung);
        w.datTrangThai('giai');
        w.datT(1);
        dat(tin, 'dung', 'Đúng! ' + d.dungChu);
        return;
      }
      if (r.code === 'saiDang') { w.datT(1); dat(tin, '', d.saiDangChu || 'Đúng giá trị rồi, giờ viết gọn lại theo yêu cầu của đề.'); return; }
      var u = timPhanUng(d, kieu, ct.giaTri);
      if (u) {
        if (u.thamSo) w.datThamSo(u.thamSo);
        if (u.trangThai) w.datTrangThai(u.trangThai);
        w.datT(u.t != null ? u.t : 1);
        dat(tin, 'sai', u.loi);
        return;
      }
      w.datT(d.saiT != null ? d.saiT : 1);
      dat(tin, 'sai', d.saiChu || 'Chưa đúng. Nhìn lại hình rồi thử lần nữa.');
    };
  }

  function veNhin(c, n) {
    var s = phan('Nhìn', n.tieuDe, 'nhin-nhin'), hinh = el('div'), chu = el('div');
    var ket = el('div', { class: 'nhin-ket cho', html: T.md(n.ketLuan) });
    s.appendChild(el('div', { class: 'hai-ben' }, hinh, chu));
    c.appendChild(s);
    // Công thức sáng lên khi hình đã chạy tới cuối, và giữ nguyên từ đó
    T.mountWidget(hinh, 'canh', Object.assign({ buoc: n.buoc, choBuoc: chu, khiDoiT: function (t) { if (t > 0.95) ket.classList.remove('cho'); } }, n.canh));
    chu.appendChild(ket);
    var luuY = (n.loai === 'minhHoa' ? 'Hình cho thấy một trường hợp, chưa phải chứng minh. ' : '') + (n.luuY || '');
    if (luuY) chu.appendChild(el('p', { class: 'nhin-luu-y', html: T.md(luuY).replace(/^<p>|<\/p>$/g, '') }));
  }

  function veDung(c, bai, d) {
    var s = phan('Dùng', d.tieuDe || 'Giải ngay trên hình', 'nhin-dung'), hinh = el('div'), chu = el('div');
    s.appendChild(el('div', { class: 'hai-ben' }, hinh, chu));
    c.appendChild(s);
    var w = T.mountWidget(hinh, 'canh', Object.assign({ chiXem: true }, d.canh));
    var tin = el('p', { class: 'nhin-tin', role: 'status' }), q = cauHoi(bai, d, 'nhin');
    dat(tin, '', d.moiThu || 'Gõ thử đi. Nếu sai, hình sẽ cho thấy vì sao.');
    T.mountQuestion(chu, q, { record: false, onResult: khiCham(w, tin, d, q.dapAn.kieu) });
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
      var tin = el('p', { class: 'nhin-tin', role: 'status' }), q = cauHoi(bai, d, 'nhin');
      T.mountQuestion(the, q, { record: false, onResult: khiCham(w, tin, d, q.dapAn.kieu) });
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
