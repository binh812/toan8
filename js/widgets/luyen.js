// Tab "Luyện thêm": từng câu một, sinh từ dạng bài (hạt giống ngẫu nhiên), mức tự điều chỉnh, đếm chuỗi đúng.
(function (T) {
  'use strict';
  var el = T.el, L = T.luyenLoi;
  T.luyenBai = {};
  // TOAN8.luyen(idBài, [dạng…], { deCo: [câu soạn sẵn…] }) – gọi trong content/luyen/luyenNN.js
  T.luyen = function (id, dang, opts) { T.luyenBai[id] = { dang: dang || [], deCo: (opts && opts.deCo) || [] }; };
  var cc = null;
  function congCu() { return cc || (cc = T.congCu(T.parser)); }
  function hatGiong() { return 1 + Math.floor(Math.random() * 2147483646); }

  T.nguonLuyen = function (baiId) { var g = T.luyenBai[baiId]; return g ? L.danhSachNguon(g) : []; };
  // Một câu luyện thêm của bài, ở mức muc, theo hạt giống (cùng hạt giống → cùng câu); tránh lặp nguồn tenTruoc.
  T.cauLuyen = function (baiId, muc, seed, tenTruoc) {
    var ng = T.nguonLuyen(baiId);
    if (!ng.length) return null;
    var n = L.chonNguon(ng, muc, tenTruoc || null, T.taoRng(L.hatChon(seed)));
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
    if (typeof bai.id === 'number') c.appendChild(el('div', { class: 'luyen-nut' }, el('a', { class: 'btn', href: '#/phieu/bai-' + bai.id }, '🖨 In phiếu 10 câu')));
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
      var q = T.cauLuyen(bai.id, tt.muc, hatGiong(), truoc);
      truoc = q.nguon; soCau++;
      var kq = { dung: false, soLanSai: 0, xemLoiGiai: false }, daGhi = false;
      var tiep = el('button', { class: 'btn primary', type: 'button', hidden: true, onclick: xong }, 'Câu tiếp ▸');
      var boQua = el('button', { class: 'btn ghost', type: 'button', onclick: xong }, 'Bỏ qua câu này');
      cho.appendChild(el('div', { class: 'from' }, 'Câu ' + soCau));
      T.mountQuestion(cho, q, {
        record: false,
        // kết quả câu chốt ở lần đúng đầu tiên (khớp với tiến độ đã ghi); bấm gợi ý hay gõ lại sau đó không tính
        onResult: function (r, ct) {
          if (kq.dung) return;
          kq.soLanSai = ct.soLanSai;
          if (ct.xemLoiGiai) kq.xemLoiGiai = true;
          if (r.ok) { kq.dung = true; ghi(); tiep.hidden = false; boQua.hidden = true; tiep.focus(); }
        },
        onXemLoiGiai: function () { if (kq.dung) return; kq.xemLoiGiai = true; tiep.hidden = false; boQua.hidden = true; }
      });
      cho.appendChild(el('div', { class: 'luyen-nut' }, tiep, boQua));
      function ghi() {
        if (daGhi) return;
        daGhi = true;
        T.store.recordLuyen(bai.id, kq.dung && !kq.xemLoiGiai);
        capNhat();
      }
      function xong() {
        ghi();
        tt = L.mucTiepTheo(tt, L.ketQuaCau(kq));
        capNhat();
        cauMoi();
      }
    }
    capNhat();
    cauMoi();
  };
})(window.TOAN8);
