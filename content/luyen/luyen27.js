// Luyện thêm – Bài 27: Khái niệm hàm số và đồ thị của hàm số
(function () {
  'use strict';
  var LA_MA = ['', 'I', 'II', 'III', 'IV'];
  function ng(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function heSo(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  function lin(cc, a, b) { return cc.daThuc([[a, 'x'], [b, '']]); }
  function gocPhanTu(x, y) { return x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3); }
  function loc(ds, ans) {
    var out = [];
    ds.forEach(function (l) {
      if (!isFinite(l.gt) || Math.abs(l.gt - ans) < 1e-9) return;
      if (out.some(function (o) { return Math.abs(o.gt - l.gt) < 1e-9; })) return;
      out.push(l);
    });
    return out;
  }
  // "p·(t) + q" khi thay x = t vào px + q
  function thay(p, q, t) {
    var dau = Math.abs(p) === 1 ? (p < 0 ? '-' : '') + ng(t) : p + '\\cdot ' + ng(t);
    return dau + (q ? (q > 0 ? ' + ' : ' - ') + Math.abs(q) : '');
  }
  // hàm số ngẫu nhiên: bậc nhất px + q hoặc k/x; trả { tex, f(t), thay(t), chon giá trị x hợp lệ }
  function hamSo(r, cc) {
    if (r.dau() > 0) {
      var p = r.khac0(-5, 5), q = r.so(-9, 9);
      return { tex: lin(cc, p, q), f: function (t) { return p * t + q; }, thay: function (t) { return thay(p, q, t); },
        xTot: function () { return r.khac0(-5, 5); }, p: p, q: q };
    }
    var k = r.chon([6, 8, 12, 18, 24, -6, -12]), uoc = [];
    for (var d = 1; d <= Math.abs(k); d++) if (k % d === 0) uoc.push(d, -d);
    return { tex: '\\frac{' + k + '}{x}', f: function (t) { return k / t; }, thay: function (t) { return '\\frac{' + k + '}{' + ng(t) + '}'; },
      xTot: function () { return r.chon(uoc); }, k: k };
  }

  TOAN8.luyen(27, [
    { ten: 'Tính giá trị f(a)', muc: 1, sinh: function (r, cc) {
      var h = hamSo(r, cc), t = h.xTot(), kq = h.f(t), ds = [];
      if (h.k == null) {
        ds.push({ gt: h.p * t - h.q, giaiThich: 'Công thức là $' + h.tex + '$: em cộng/trừ nhầm hạng tử tự do $' + h.q + '$.' });
        if (t < 0) ds.push({ gt: -h.p * t + h.q, giaiThich: 'Thay $x = ' + t + '$ phải đặt trong ngoặc: $' + h.p + '\\cdot(' + t + ') = ' + h.p * t + '$ (chú ý dấu).' });
      } else {
        ds.push({ gt: -kq, giaiThich: 'Chú ý dấu: $' + h.k + ' : ' + ng(t) + ' = ' + kq + '$.' }, { gt: h.k * t, giaiThich: 'Phải **chia** $' + h.k + '$ cho $' + t + '$, không nhân.' });
      }
      return {
        de: 'Cho hàm số $y = f(x) = ' + h.tex + '$. Tính $f(' + t + ')$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['$f(' + t + ')$ là giá trị của hàm số khi $x = ' + t + '$.', 'Thay $x = ' + t + '$ vào công thức (số âm đặt trong ngoặc).'],
        loiGiai: ['$f(' + t + ') = ' + h.thay(t) + ' = ' + kq + '$'],
        loiThuongGap: loc(ds, kq)
      };
    } },
    { ten: 'Đọc toạ độ điểm trên hình', muc: 1, sinh: function (r) {
      var x = r.khac0(-4, 4), y = r.so(-4, 4), ten = r.chon(['A', 'M', 'N', 'P', 'Q']);
      if (y === x) y = -y || 2;
      return {
        de: 'Đọc toạ độ của điểm $' + ten + '$ trong hình.',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], diem: [{ x: x, y: y, ten: ten }],
          doan: y ? [[x, y, x, 0, { net: true, mau: '#868e96' }], [x, y, 0, y, { net: true, mau: '#868e96' }]] : [] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Hoành độ của $' + ten + '$', kieu: 'so', gt: x, loiThuongGap: loc([{ gt: y, giaiThich: 'Hoành độ đọc trên trục **ngang** $Ox$. Số $' + y + '$ là tung độ.' }, { gt: -x, giaiThich: 'Chú ý dấu: $' + ten + '$ ở bên ' + (x < 0 ? '**trái**' : '**phải**') + ' trục $Oy$.' }], x) },
          { nhan: 'Tung độ của $' + ten + '$', kieu: 'so', gt: y, loiThuongGap: loc([{ gt: x, giaiThich: 'Tung độ đọc trên trục **dọc** $Oy$. Số $' + x + '$ là hoành độ.' }], y) }] },
        goiY: ['Từ $' + ten + '$ kẻ đường thẳng đứng xuống trục $Ox$: được hoành độ.', 'Từ $' + ten + '$ kẻ đường nằm ngang sang trục $Oy$: được tung độ.'],
        loiGiai: ['Kẻ vuông góc xuống $Ox$ gặp tại $' + x + '$: hoành độ là $' + x + '$.', 'Kẻ vuông góc sang $Oy$ gặp tại $' + y + '$: tung độ là $' + y + '$.', 'Vậy $' + ten + '(' + x + '; ' + y + ')$.']
      };
    } },
    { ten: 'Góc phần tư', muc: 1, sinh: function (r) {
      var x = r.khac0(-9, 9), y = r.khac0(-9, 9), ten = r.chon(['A', 'B', 'M', 'N', 'P']), g = gocPhanTu(x, y), gs = gocPhanTu(y, x);
      return {
        de: 'Điểm $' + ten + '(' + x + '; ' + y + ')$ nằm ở góc phần tư thứ mấy? (gõ một số từ $1$ đến $4$)',
        dapAn: { kieu: 'so', gt: g },
        goiY: ['Hoành độ (số đứng trước) cho biết điểm ở bên trái hay bên phải $Oy$; tung độ (số đứng sau) cho biết ở trên hay dưới $Ox$.',
          'Các góc phần tư đánh số I, II, III, IV **ngược chiều kim đồng hồ**, bắt đầu từ góc trên bên phải.'],
        loiGiai: ['Hoành độ $' + x + (x > 0 ? ' > 0$: bên phải' : ' < 0$: bên trái') + ' trục $Oy$; tung độ $' + y + (y > 0 ? ' > 0$: phía trên' : ' < 0$: phía dưới') + ' trục $Ox$.',
          'Đó là góc phần tư thứ **' + LA_MA[g] + '**, tức là đáp số $' + g + '$.'],
        loiThuongGap: gs !== g ? [{ gt: gs, giaiThich: 'Em đọc ngược hoành độ và tung độ. Trong $(' + x + '; ' + y + ')$, số đứng **trước** là hoành độ.' }] : []
      };
    } },
    { ten: 'Điểm nằm trên trục toạ độ', muc: 1, sinh: function (r) {
      var hoiOx = r.dau() > 0, a = r.khac0(-4, 4), b = r.khac0(-4, 4);
      var dung = hoiOx ? [a, 0] : [0, a], nham = hoiOx ? [0, b] : [b, 0];
      var p1 = [r.khac0(-4, 4), r.khac0(-4, 4)], p2;
      do { p2 = [r.khac0(-4, 4), r.khac0(-4, 4)]; } while (p2[0] === p1[0] && p2[1] === p1[1]);
      var ds = r.xaoTron([{ p: dung, ok: true }, { p: nham }, { p: p1 }, { p: p2 }]), ten = ['A', 'B', 'C', 'D'];
      var gt = ds.findIndex(function (d) { return d.ok; });
      var nhamTen = ten[ds.findIndex(function (d) { return d.p === nham; })];
      return {
        de: 'Trong hình có bốn điểm $A$, $B$, $C$, $D$. Điểm nào nằm **trên trục ' + (hoiOx ? 'hoành' : 'tung') + '**?',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], diem: ds.map(function (d, i) { return { x: d.p[0], y: d.p[1], ten: ten[i] }; }) } },
        dapAn: { kieu: 'chon', gt: gt, luaChon: ds.map(function (d, i) { return '$' + ten[i] + '(' + d.p[0] + '; ' + d.p[1] + ')$'; }) },
        goiY: ['Trục hoành là trục **nằm ngang** $Ox$, trục tung là trục **thẳng đứng** $Oy$.', 'Điểm trên trục hoành có **tung độ bằng 0**; điểm trên trục tung có **hoành độ bằng 0**.'],
        loiGiai: ['$' + ten[gt] + '(' + dung[0] + '; ' + dung[1] + ')$ có ' + (hoiOx ? 'tung' : 'hoành') + ' độ $0$ nên nằm trên trục ' + (hoiOx ? 'hoành' : 'tung') + '.',
          '$' + nhamTen + '(' + nham[0] + '; ' + nham[1] + ')$ có ' + (hoiOx ? 'hoành' : 'tung') + ' độ $0$ nên nằm trên trục **' + (hoiOx ? 'tung' : 'hoành') + '**, không phải. Đáp án: $' + ten[gt] + '$.']
      };
    } },
    { ten: 'Tìm x khi biết giá trị của hàm số', muc: 2, sinh: function (r, cc) {
      var nua = r.dau() > 0, p = nua ? r.chon([1, -1]) : r.khac0(-5, 5), q = r.khac0(-8, 8), x0 = nua ? 2 * r.khac0(-5, 5) : r.khac0(-6, 6);
      var y0 = nua ? p * x0 / 2 + q : p * x0 + q;
      var tex = nua ? (p < 0 ? '-' : '') + '\\frac{1}{2}x ' + (q > 0 ? '+ ' : '- ') + Math.abs(q) : lin(cc, p, q);
      var hs = nua ? (p < 0 ? '-' : '') + '\\frac{1}{2}' : heSo(p);
      var fy = nua ? p * y0 / 2 + q : p * y0 + q;
      return {
        de: 'Cho hàm số $f(x) = ' + tex + '$. Tìm $x$ sao cho $f(x) = ' + y0 + '$.',
        dapAn: { kieu: 'so', gt: x0 },
        goiY: ['$f(x) = ' + y0 + '$ nghĩa là $' + tex + ' = ' + y0 + '$: một phương trình ẩn $x$.', 'Chuyển $' + q + '$ sang vế phải (đổi dấu) rồi chia cho hệ số của $x$.'],
        loiGiai: ['$' + tex + ' = ' + y0 + '$', '$' + hs + 'x = ' + (y0 - q) + '$', '$x = ' + x0 + '$'],
        loiThuongGap: loc([{ gt: fy, giaiThich: 'Em đã tính $f(' + y0 + ')$. Đề cho **giá trị của hàm số** bằng $' + y0 + '$ và hỏi $x$.' },
          { gt: nua ? 2 * (y0 + q) * p : (y0 + q) / p, giaiThich: 'Chuyển $' + q + '$ sang vế phải phải đổi dấu: $' + hs + 'x = ' + y0 + ' - ' + ng(q) + '$.' }], x0)
      };
    } },
    { ten: 'Bảng giá trị có xác định hàm số?', muc: 2, sinh: function (r) {
      var xs = r.khacNhau(4, -3, 5).sort(function (a, b) { return a - b; }), ys = xs.map(function () { return r.so(-5, 9); });
      var loai = r.chon(['lap', 'lap', 'thuong', 'hang']), la = true, ghi;
      if (loai === 'lap') {
        var i = r.so(0, 3), j;
        do { j = r.so(0, 3); } while (j === i);
        var yv, xi = xs[i], yi = ys[i];
        do { yv = r.so(-5, 9); } while (yv === yi);
        xs.splice(j + 1, 0, xi); ys.splice(j + 1, 0, yv); la = false;
        ghi = 'Giá trị $x = ' + xi + '$ ứng với **hai** giá trị $y$ khác nhau ($' + yi + '$ và $' + yv + '$). Vậy $y$ **không** phải là hàm số của $x$. Chọn **Sai**.';
      } else if (loai === 'hang') {
        var c = r.so(-5, 9);
        ys = xs.map(function () { return c; });
        ghi = 'Mỗi giá trị $x$ chỉ ứng với **một** giá trị $y$ (đều bằng $' + c + '$). Vậy $y$ **là** hàm số của $x$ (hàm hằng). Chọn **Đúng**.';
      } else {
        ys[r.so(1, 3)] = ys[0];
        ghi = 'Mỗi giá trị $x$ chỉ ứng với **một** giá trị $y$ (hai giá trị $x$ khác nhau có cùng $y$ vẫn được). Vậy $y$ **là** hàm số của $x$. Chọn **Đúng**.';
      }
      var cot = xs.map(function () { return 'c'; }).join('|');
      return {
        de: 'Cho bảng giá trị:\n\n$$\\begin{array}{c|' + cot + '} x & ' + xs.join(' & ') + ' \\\\ \\hline y & ' + ys.join(' & ') + ' \\end{array}$$\n\nĐại lượng $y$ **có phải** là hàm số của $x$ không?',
        dapAn: { kieu: 'dungSai', gt: la },
        goiY: ['$y$ là hàm số của $x$ khi **mỗi** giá trị của $x$ chỉ ứng với **một** giá trị của $y$.', 'Xem có giá trị $x$ nào xuất hiện hai lần mà $y$ khác nhau không.'],
        loiGiai: [ghi]
      };
    } },
    { ten: 'Hoàn thành bảng giá trị', muc: 2, sinh: function (r, cc) {
      var h = hamSo(r, cc), xs = [];
      while (xs.length < 3) { var t = h.xTot(); if (xs.indexOf(t) < 0) xs.push(t); }
      xs.sort(function (a, b) { return a - b; });
      return {
        de: 'Cho hàm số $y = f(x) = ' + h.tex + '$. Hoàn thành các giá trị còn thiếu.',
        dapAn: { kieu: 'nhieuO', o: xs.map(function (t) {
          var v = h.f(t);
          return { nhan: 'Khi $x = ' + t + '$: $y =$', kieu: 'so', gt: v,
            loiThuongGap: loc(h.k == null ? [{ gt: h.p * t - h.q, giaiThich: 'Công thức là $' + h.tex + '$: $' + h.thay(t) + ' = ' + v + '$.' }] : [{ gt: -v, giaiThich: 'Chú ý dấu: $' + h.thay(t) + ' = ' + v + '$.' }], v) };
        }) },
        goiY: ['Thay từng giá trị $x$ vào công thức.', 'Số âm nhớ đặt trong ngoặc khi thay.'],
        loiGiai: xs.map(function (t) { return '$x = ' + t + '$: $y = ' + h.thay(t) + ' = ' + h.f(t) + '$.'; })
      };
    } },
    { ten: 'Diện tích tam giác trên mặt phẳng toạ độ', muc: 3, sinh: function (r, cc) {
      var x1, x2, y1, y3, lan = 0;
      do { x1 = r.so(-4, 2); x2 = r.so(-2, 4); y1 = r.so(-4, 4); y3 = r.so(-4, 4); lan++; } while ((x2 - x1 < 2 || Math.abs(y3 - y1) < 2) && lan < 100);
      if (x2 - x1 < 2 || Math.abs(y3 - y1) < 2) { x1 = -2; x2 = 3; y1 = 1; y3 = -3; }
      var dai = x2 - x1, cao = Math.abs(y3 - y1), S = dai * cao / 2;
      return {
        de: 'Trên mặt phẳng toạ độ cho $A(' + x1 + '; ' + y1 + ')$, $B(' + x2 + '; ' + y1 + ')$, $C(' + x2 + '; ' + y3 + ')$. Tam giác $ABC$ vuông tại $B$. Tính diện tích tam giác $ABC$ (mỗi đơn vị trên trục ứng với $1$ cm).',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], doan: [[x1, y1, x2, y1], [x2, y1, x2, y3], [x1, y1, x2, y3]],
          diem: [{ x: x1, y: y1, ten: 'A' }, { x: x2, y: y1, ten: 'B' }, { x: x2, y: y3, ten: 'C' }] } },
        dapAn: { kieu: 'so', gt: S },
        goiY: ['$A$ và $B$ cùng tung độ nên $AB$ nằm ngang: $AB$ = hiệu hai hoành độ. $B$ và $C$ cùng hoành độ nên $BC$ thẳng đứng.', 'Diện tích tam giác vuông $= \\frac{1}{2}\\cdot AB\\cdot BC$.'],
        loiGiai: ['$AB = ' + x2 + ' - ' + ng(x1) + ' = ' + dai + '$ (cm); $BC = ' + (y1 > y3 ? y1 + ' - ' + ng(y3) : y3 + ' - ' + ng(y1)) + ' = ' + cao + '$ (cm).',
          '$S_{ABC} = \\frac{1}{2}\\cdot ' + dai + '\\cdot ' + cao + ' = ' + cc.so(S) + '$'],
        loiThuongGap: [{ gt: dai * cao, giaiThich: 'Em quên nhân $\\frac{1}{2}$: diện tích tam giác vuông bằng **nửa** tích hai cạnh góc vuông.' }]
      };
    } },
    { ten: 'Hàm số trong thực tế', muc: 3, sinh: function (r) {
      var V = r.chon([120, 180, 240, 360, 600, 720, 1200]), uoc = [];
      for (var d = 2; d <= 60; d++) if (V % d === 0 && V / d >= 2) uoc.push(d);
      var v1 = r.chon(uoc), t2;
      do { t2 = r.chon(uoc); } while (V / t2 === v1);
      var be = r.chon([['Một bể chứa', 'lít nước', 'Mở vòi xả, mỗi phút chảy ra $x$ lít thì thời gian xả hết bể là', 'phút', 'lít/phút'],
        ['Một vòi chảy đầy bể', 'lít', 'Với lưu lượng $x$ (lít/phút) thì thời gian chảy đầy bể là', 'phút', 'lít/phút']]);
      return {
        de: be[0] + ' $' + V + '$ ' + be[1] + '. ' + be[2] + ' $t = \\frac{' + V + '}{x}$ (' + be[3] + ').',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) Khi $x = ' + v1 + '$ thì $t =$ (phút)', kieu: 'so', gt: V / v1, loiThuongGap: [{ gt: V * v1, giaiThich: 'Phải **chia** $' + V + '$ cho $' + v1 + '$.' }] },
          { nhan: 'b) Muốn $t = ' + t2 + '$ phút thì $x =$ (' + be[4] + ')', kieu: 'so', gt: V / t2, loiThuongGap: loc([{ gt: t2 * V, giaiThich: 'Từ $' + t2 + ' = \\frac{' + V + '}{x}$ suy ra $x = ' + V + ' : ' + t2 + '$.' }], V / t2) }] },
        goiY: ['a) Thay $x = ' + v1 + '$ vào công thức.', 'b) Giải $' + t2 + ' = \\frac{' + V + '}{x}$: $x = \\frac{' + V + '}{' + t2 + '}$.'],
        loiGiai: ['a) $t = \\frac{' + V + '}{' + v1 + '} = ' + V / v1 + '$ (phút).', 'b) $' + t2 + ' = \\frac{' + V + '}{x}$ nên $x = \\frac{' + V + '}{' + t2 + '} = ' + V / t2 + '$ (' + be[4] + ').']
      };
    } }
  ]);
})();
