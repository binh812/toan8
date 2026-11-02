// Khung nháp vẽ tay dưới mỗi câu hỏi: bút 3 màu, tẩy, xoá hết. Không lưu khi rời trang.
(function (T) {
  'use strict';
  var el = T.el, MAU = ['#212529', '#1971c2', '#e03131'], CAO = 260, dangMo = 0;
  T.nhap = function (chua) {
    var cv = el('canvas', { class: 'nhap-cv', 'aria-label': 'Khung nháp – vẽ bằng chuột hoặc bút' });
    var mau = MAU[0], tay = false, ve = null;
    var thanh = el('div', { class: 'nhap-thanh' });
    function chon(nut) { [].forEach.call(thanh.querySelectorAll('.on'), function (b) { b.classList.remove('on'); }); nut.classList.add('on'); }
    MAU.forEach(function (m, i) {
      var b = el('button', { type: 'button', class: 'nhap-mau' + (i ? '' : ' on'), style: 'background:' + m, 'aria-label': 'Bút màu ' + (i + 1) });
      b.addEventListener('click', function () { mau = m; tay = false; chon(b); });
      thanh.appendChild(b);
    });
    var tayBtn = el('button', { type: 'button', class: 'btn ghost' }, '🧽 Tẩy');
    tayBtn.addEventListener('click', function () { tay = true; chon(tayBtn); });
    thanh.appendChild(tayBtn);
    thanh.appendChild(el('button', { type: 'button', class: 'btn ghost', onclick: xoa }, 'Xoá hết'));
    var wrap = el('div', { class: 'nhap' }, thanh, cv);
    chua.appendChild(wrap);
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;

    // Khớp kích thước điểm ảnh với kích thước hiển thị (nét không mờ), giữ nét đã vẽ khi đổi cỡ cửa sổ
    function coGian() {
      if (!cv.isConnected && daGan) { go(); return; } // câu đã bị xoá khỏi trang (đổi câu, đổi trang) mà chưa đóng nháp
      var r = cv.getBoundingClientRect();
      if (!r.width) return;
      var cu = null;
      if (cv.width && cv.height) { cu = document.createElement('canvas'); cu.width = cv.width; cu.height = cv.height; cu.getContext('2d').drawImage(cv, 0, 0); }
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(CAO * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (cu) ctx.drawImage(cu, 0, 0, cu.width / dpr, cu.height / dpr);
    }
    function xy(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    cv.addEventListener('pointerdown', function (e) {
      if (!cv.width) coGian();
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* sự kiện giả lập không có pointer thật */ }
      ve = xy(e); e.preventDefault();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!ve) return;
      var p = xy(e), ap = e.pointerType === 'pen' && e.pressure ? e.pressure : 0.5;
      ctx.globalCompositeOperation = tay ? 'destination-out' : 'source-over';
      ctx.strokeStyle = mau; ctx.lineWidth = tay ? 22 : 1.5 + 3 * ap; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(ve[0], ve[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      ve = p;
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { cv.addEventListener(t, function () { ve = null; }); });
    function xoa() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore(); }
    var daGan = true;
    function go() { if (daGan) { daGan = false; dangMo--; window.removeEventListener('resize', coGian); } }
    coGian();
    window.addEventListener('resize', coGian);
    dangMo++;
    return { el: wrap, xoa: xoa, huy: function () { go(); wrap.remove(); } };
  };
  T.nhap.soDangMo = function () { return dangMo; };
})(window.TOAN8);
