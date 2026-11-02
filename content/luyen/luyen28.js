// Luyện thêm – Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất
(function () {
  'use strict';
  function ng(v) { return v < 0 ? '(' + v + ')' : String(v); }
  function heSo(a) { return a === 1 ? '' : a === -1 ? '-' : String(a); }
  function lin(cc, a, b) { return cc.daThuc([[a, 'x'], [b, '']]); }
  function thay(p, q, t) {
    var dau = Math.abs(p) === 1 ? (p < 0 ? '-' : '') + ng(t) : p + '\\cdot ' + ng(t);
    return dau + (q ? (q > 0 ? ' + ' : ' - ') + Math.abs(q) : '');
  }
  function loc(ds, ans) {
    var out = [];
    ds.forEach(function (l) {
      if (!isFinite(l.gt) || Math.abs(l.gt - ans) < 1e-9) return;
      if (out.some(function (o) { return Math.abs(o.gt - l.gt) < 1e-9; })) return;
      out.push(l);
    });
    return out;
  }

  TOAN8.luyen(28, [
    { ten: 'Nhận biết hàm số bậc nhất', muc: 1, sinh: function (r, cc) {
      var a = r.so(2, 6), b = r.khac0(-7, 7), c = r.so(2, 5), k = r.so(2, 5);
      var dung = r.chon([
        '$y = ' + Math.abs(b) + ' - ' + a + 'x$',
        '$y = ' + c + '(x ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + ')$',
        '$y = \\frac{x ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '}{' + k + '}$']);
      var sai = r.xaoTron([
        '$y = 0\\cdot x ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$',
        '$y = ' + heSo(a) + 'x^2 ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$',
        '$y = \\frac{' + k + '}{x} ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$',
        '$y = x(x ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + ')$']).slice(0, 3);
      var ds = r.xaoTron([dung].concat(sai)), gt = ds.indexOf(dung);
      var thuGon = /frac\{x/.test(dung) ? 'viết được thành $y = \\frac{1}{' + k + '}x ' + (b > 0 ? '+ ' : '- ') + cc.phanSo(Math.abs(b), k).tex + '$ với $a = \\frac{1}{' + k + '} \\ne 0$'
        : /\(x/.test(dung) ? 'thu gọn được $y = ' + lin(cc, c, c * b) + '$ với $a = ' + c + ' \\ne 0$'
          : 'viết được thành $y = ' + lin(cc, -a, Math.abs(b)) + '$ với $a = ' + (-a) + ' \\ne 0$';
      return {
        de: 'Hàm số nào dưới đây là **hàm số bậc nhất**?',
        dapAn: { kieu: 'chon', gt: gt, luaChon: ds },
        goiY: ['Hàm số bậc nhất có dạng $y = ax + b$ với $a \\ne 0$.', 'Thu gọn từng công thức. Loại hàm số có $a = 0$, có $x^2$ hoặc có $x$ ở mẫu.'],
        loiGiai: ['Các hàm số còn lại: có hệ số $a = 0$, hoặc có $x^2$ (kể cả sau khi nhân), hoặc có $x$ ở mẫu – không phải hàm số bậc nhất.', dung + ' ' + thuGon + '. Đây là hàm số bậc nhất.']
      };
    } },
    { ten: 'Xác định hệ số a, b', muc: 1, sinh: function (r, cc) {
      var loai = r.chon(['nguoc', 'ngoac']), a, b, tex;
      if (loai === 'nguoc') { a = r.khac0(-6, 6); b = r.khac0(-9, 9); tex = cc.daThuc([[b, ''], [a, 'x']]); }
      else { var c = r.chon([2, 3, 4, 5, -2, -3]), p = r.khac0(-5, 5); a = c; b = c * p; tex = c + '(x ' + (p > 0 ? '+ ' : '- ') + Math.abs(p) + ')'; }
      return {
        de: 'Xác định các hệ số $a$, $b$ của hàm số bậc nhất $y = ' + tex + '$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$a =$', kieu: 'so', gt: a, loiThuongGap: loc([{ gt: b, giaiThich: '$a$ là hệ số **của $x$**, còn $' + b + '$ là hạng tử tự do $b$.' }, { gt: -a, giaiThich: 'Hệ số lấy **cả dấu**: $a = ' + a + '$.' }], a) },
          { nhan: '$b =$', kieu: 'so', gt: b, loiThuongGap: loc(loai === 'ngoac' ? [{ gt: b / a, giaiThich: 'Phải nhân $' + a + '$ vào **mọi** hạng tử trong ngoặc: $b = ' + a + '\\cdot ' + ng(b / a) + ' = ' + b + '$.' }, { gt: a, giaiThich: '$' + a + '$ là hệ số $a$.' }]
            : [{ gt: a, giaiThich: '$' + a + '$ là hệ số của $x$ (tức $a$).' }], b) }] },
        goiY: ['Viết công thức về đúng dạng $y = ax + b$' + (loai === 'ngoac' ? ' (bỏ dấu ngoặc trước)' : ' (hạng tử chứa $x$ đứng trước)') + '.', '$a$ là hệ số của $x$, $b$ là hạng tử tự do – lấy cả dấu.'],
        loiGiai: ['$y = ' + tex + ' = ' + lin(cc, a, b) + '$', 'Vậy $a = ' + a + '$, $b = ' + b + '$.']
      };
    } },
    { ten: 'Tính y khi biết x', muc: 1, sinh: function (r, cc) {
      var a = r.khac0(-5, 5), b = r.so(-9, 9), t = r.khac0(-5, 5), kq = a * t + b;
      return {
        de: 'Cho hàm số $y = ' + lin(cc, a, b) + '$. Tính giá trị của $y$ khi $x = ' + t + '$.',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Thay $x = ' + t + '$ vào công thức.', 'Số âm đặt trong ngoặc; nhân trước, cộng trừ sau.'],
        loiGiai: ['$y = ' + thay(a, b, t) + ' = ' + kq + '$'],
        loiThuongGap: loc([{ gt: a * t - b, giaiThich: 'Em cộng/trừ nhầm hạng tử tự do: công thức là $' + lin(cc, a, b) + '$.' }]
          .concat(Math.abs(a) === 1 ? [] : [{ gt: a + t + b, giaiThich: '$' + a + 'x$ nghĩa là $' + a + '$ **nhân** $x$, không phải cộng.' }]), kq)
      };
    } },
    { ten: 'Giao điểm với hai trục', muc: 1, sinh: function (r, cc) {
      var x0 = r.khac0(-5, 5), a = r.chon([1, 2, 3, -1, -2, -3]), b = -a * x0;
      return {
        de: 'Đường thẳng $y = ' + lin(cc, a, b) + '$ cắt trục tung tại $P$ và cắt trục hoành tại $Q$. Tìm tung độ của $P$ và hoành độ của $Q$.',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Tung độ của $P$', kieu: 'so', gt: b, loiThuongGap: loc([{ gt: x0, giaiThich: '$' + x0 + '$ là hoành độ của $Q$. Với $P$ trên trục tung, cho $x = 0$: $y = ' + b + '$.' }], b) },
          { nhan: 'Hoành độ của $Q$', kieu: 'so', gt: x0, loiThuongGap: loc([{ gt: -x0, giaiThich: 'Giải $' + lin(cc, a, b) + ' = 0$: ' + (a === 1 ? '' : '$' + heSo(a) + 'x = ' + (-b) + '$, nên ') + '$x = ' + x0 + '$ (chú ý dấu).' }, { gt: b, giaiThich: '$' + b + '$ là tung độ của $P$ (giao với trục **tung**).' }], x0) }] },
        goiY: ['Điểm trên trục tung có $x = 0$; điểm trên trục hoành có $y = 0$.', 'Cho $y = 0$: giải $' + lin(cc, a, b) + ' = 0$.'],
        loiGiai: ['Cho $x = 0$: $y = ' + b + '$, được $P(0; ' + b + ')$.', 'Cho $y = 0$: $' + lin(cc, a, b) + ' = 0$, $x = ' + x0 + '$, được $Q(' + x0 + '; 0)$.']
      };
    } },
    { ten: 'Điểm có thuộc đồ thị không', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-4, 4), b = r.so(-6, 6), t = r.khac0(-4, 4), y = a * t + b, la = r.dau() > 0;
      var y0 = la ? y : y + r.khac0(-3, 3), ten = r.chon(['A', 'M', 'N', 'K']);
      if (!la && r.dau() > 0 && a * t - b !== y) y0 = a * t - b; // sai thường gặp: nhầm dấu b
      if (!la && y0 === y) y0 = y + 1;
      return {
        de: 'Điểm $' + ten + '(' + t + '; ' + y0 + ')$ có thuộc đồ thị của hàm số $y = ' + lin(cc, a, b) + '$ không?',
        dapAn: { kieu: 'dungSai', gt: y0 === y },
        goiY: ['Thay hoành độ $x = ' + t + '$ vào công thức.', 'So sánh kết quả với tung độ $' + y0 + '$ của $' + ten + '$.'],
        loiGiai: ['Với $x = ' + t + '$: $y = ' + thay(a, b, t) + ' = ' + y + '$.',
          y0 === y ? 'Đúng bằng tung độ của $' + ten + '$, nên $' + ten + '$ **thuộc** đồ thị. Chọn **Đúng**.' : '$' + y + ' \\ne ' + y0 + '$ nên $' + ten + '$ **không** thuộc đồ thị. Chọn **Sai**.']
      };
    } },
    { ten: 'Tìm hệ số khi biết đồ thị đi qua một điểm', muc: 2, sinh: function (r, cc) {
      var a = r.khac0(-4, 4), b = r.khac0(-6, 6), t = r.khac0(-3, 3), y = a * t + b;
      if (r.dau() > 0) {
        return {
          de: 'Cho hàm số bậc nhất $y = ax ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$. Tìm $a$, biết đồ thị đi qua điểm $(' + t + '; ' + y + ')$.',
          dapAn: { kieu: 'so', gt: a },
          goiY: ['Thay $x = ' + t + '$, $y = ' + y + '$ vào công thức.', '$' + y + ' = ' + heSo(t) + 'a ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$. Giải ra $a$.'],
          loiGiai: ['$' + y + ' = a\\cdot ' + ng(t) + ' ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$', '$' + heSo(t) + 'a = ' + (y - b) + '$', '$a = ' + a + '$'].filter(function (d, i, m) { return d !== m[i - 1]; }),
          loiThuongGap: loc([{ gt: (y + b) / t, giaiThich: 'Chuyển $' + b + '$ sang vế trái phải đổi dấu: $' + heSo(t) + 'a = ' + y + ' - ' + ng(b) + '$.' }, { gt: -a, giaiThich: 'Chú ý dấu khi chia cho $' + t + '$.' }], a)
        };
      }
      return {
        de: 'Cho hàm số bậc nhất $y = ' + heSo(a) + 'x + b$. Tìm $b$, biết đồ thị đi qua điểm $(' + t + '; ' + y + ')$.',
        dapAn: { kieu: 'so', gt: b },
        goiY: ['Thay $x = ' + t + '$, $y = ' + y + '$ vào công thức.', '$' + y + ' = ' + (a * t) + ' + b$. Giải ra $b$.'],
        loiGiai: ['$' + y + ' = ' + thay(a, 0, t) + ' + b$, tức là $' + y + ' = ' + a * t + ' + b$', '$b = ' + y + ' - ' + ng(a * t) + '$', '$b = ' + b + '$'],
        loiThuongGap: loc([{ gt: y + a * t, giaiThich: 'Chuyển $' + a * t + '$ sang vế trái phải đổi dấu: $b = ' + y + ' - ' + ng(a * t) + '$.' }, { gt: y, giaiThich: '$' + y + '$ là tung độ của điểm, không phải $b$. Phải thay toạ độ vào để tính $b$.' }], b)
      };
    } },
    { ten: 'Đọc hàm số từ đồ thị', muc: 2, sinh: function (r, cc) {
      var b = r.khac0(-4, 4), x0, a;
      // đường thẳng cắt Oy tại (0; b) và Ox tại (x0; 0) với x0 nguyên, a = -b/x0 nguyên
      var chon = [];
      [-4, -3, -2, -1, 1, 2, 3, 4].forEach(function (x) { if (b % x === 0) chon.push(x); });
      x0 = r.chon(chon); a = -b / x0;
      return {
        de: 'Đường thẳng trong hình là đồ thị của hàm số bậc nhất $y = ax + b$. Tìm $a$ và $b$.',
        hinh: { widget: 'doThi', config: { bbox: [-5, 5, 5, -5], an: true, duong: [{ a: a, b: b }], diem: [{ x: 0, y: b, ten: 'P' }, { x: x0, y: 0, ten: 'Q' }] } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$a =$', kieu: 'so', gt: a, loiThuongGap: loc([{ gt: -a, giaiThich: 'Chú ý dấu: đường thẳng đi ' + (a > 0 ? '**lên**' : '**xuống**') + ' khi đi sang phải nên $a$ ' + (a > 0 ? 'dương' : 'âm') + '.' }, { gt: x0, giaiThich: '$' + x0 + '$ là hoành độ giao điểm với trục hoành, chưa phải $a$.' }], a) },
          { nhan: '$b =$', kieu: 'so', gt: b, loiThuongGap: loc([{ gt: x0, giaiThich: '$b$ là tung độ giao điểm với trục **tung** ($P$), không phải trục hoành.' }], b) }] },
        goiY: ['Đường thẳng cắt trục tung tại $P$: tung độ của $P$ chính là $b$.', 'Đường thẳng đi qua $Q(' + x0 + '; 0)$: thay vào $y = ax + b$ để tìm $a$.'],
        loiGiai: ['$P(0; ' + b + ')$ nằm trên trục tung nên $b = ' + b + '$.', '$Q(' + x0 + '; 0)$ thuộc đồ thị: $0 = a\\cdot ' + ng(x0) + ' ' + (b > 0 ? '+ ' : '- ') + Math.abs(b) + '$, nên $a = ' + a + '$.', 'Hàm số là $y = ' + lin(cc, a, b) + '$.']
      };
    } },
    { ten: 'Hàm số bậc nhất trong thực tế', muc: 3, sinh: function (r, cc) {
      var loai = r.chon(['cuoc', 'taxi', 'khauHao']);
      if (loai === 'cuoc') {
        var tb = r.chon([20, 25, 30, 40]), gia = r.chon([0.5, 0.8, 0.9, 1.2, 1.5]), phut = r.chon([50, 60, 80, 100, 120, 150]), T = Math.round((tb + gia * phut) * 10) / 10;
        return {
          de: 'Cước điện thoại gồm thuê bao $' + tb + '$ nghìn đồng/tháng và $' + cc.so(gia) + '$ nghìn đồng mỗi phút gọi. Gọi $y$ (nghìn đồng) là số tiền phải trả trong tháng khi gọi $x$ phút. Tháng này nhà bạn ' + r.chon(['Lan', 'Minh', 'Hà']) + ' trả $' + cc.so(T) + '$ nghìn đồng. Hỏi tháng này đã gọi bao nhiêu phút?',
          dapAn: { kieu: 'so', gt: phut },
          goiY: ['Công thức: $y = ' + cc.so(gia) + 'x + ' + tb + '$.', 'Thay $y = ' + cc.so(T) + '$ rồi giải phương trình ẩn $x$.'],
          loiGiai: ['$y = ' + cc.so(gia) + 'x + ' + tb + '$', '$' + cc.so(gia) + 'x + ' + tb + ' = ' + cc.so(T) + '$, nên $' + cc.so(gia) + 'x = ' + cc.so(T - tb) + '$', '$x = ' + phut + '$'],
          loiThuongGap: loc([{ gt: Math.round(T / gia * 1000) / 1000, giaiThich: 'Em quên trừ tiền thuê bao $' + tb + '$ nghìn đồng trước khi chia.' }], phut)
        };
      }
      if (loai === 'taxi') {
        var mo = r.chon([10, 12, 15]), km = r.chon([12, 14, 15, 16]), x = r.so(3, 20), y = mo + km * x;
        return {
          de: 'Một hãng taxi tính tiền theo công thức $y = ' + km + 'x + ' + mo + '$, trong đó $x$ là số ki-lô-mét đã đi và $y$ là số tiền (nghìn đồng). a) Đi $' + x + '$ km thì trả bao nhiêu? b) Một khách trả $' + (mo + km * (x + 5)) + '$ nghìn đồng thì đã đi bao nhiêu ki-lô-mét?',
          dapAn: { kieu: 'nhieuO', o: [
            { nhan: 'a) Số tiền (nghìn đồng)', kieu: 'so', gt: y, loiThuongGap: loc([{ gt: km * x, giaiThich: 'Còn phải cộng $' + mo + '$ nghìn đồng mở cửa.' }], y) },
            { nhan: 'b) Quãng đường (km)', kieu: 'so', gt: x + 5, loiThuongGap: loc([{ gt: (mo + km * (x + 5)) / km, giaiThich: 'Trừ $' + mo + '$ trước rồi mới chia cho $' + km + '$.' }], x + 5) }] },
          goiY: ['a) Thay $x = ' + x + '$ vào công thức.', 'b) Giải $' + km + 'x + ' + mo + ' = ' + (mo + km * (x + 5)) + '$.'],
          loiGiai: ['a) $y = ' + km + '\\cdot ' + x + ' + ' + mo + ' = ' + y + '$ (nghìn đồng).', 'b) $' + km + 'x + ' + mo + ' = ' + (mo + km * (x + 5)) + '$, nên $' + km + 'x = ' + km * (x + 5) + '$, $x = ' + (x + 5) + '$ (km).']
        };
      }
      var gt0 = r.chon([24, 30, 36, 48, 60]), nam = r.chon([3, 4, 5, 6]), ky = gt0 / nam;
      while (ky % 1) { nam = r.chon([3, 4, 6]); ky = gt0 / nam; }
      var sau = r.so(1, nam - 1), con = r.so(1, nam - 1) * ky;
      return {
        de: 'Một công ty mua máy giá $' + gt0 + '$ triệu đồng, khấu hao đều trong $' + nam + '$ năm (mỗi năm giá trị giảm $' + ky + '$ triệu đồng). Giá trị sau $x$ năm là $V(x) = ' + gt0 + ' - ' + ky + 'x$ (triệu đồng). a) Tính $V(' + sau + ')$. b) Sau bao nhiêu năm thì giá trị máy còn $' + con + '$ triệu đồng?',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'a) $V(' + sau + ') =$', kieu: 'so', gt: gt0 - ky * sau, loiThuongGap: loc([{ gt: ky * sau, giaiThich: 'Đó là phần giá trị **đã giảm**. Giá trị còn lại là $' + gt0 + ' - ' + ky * sau + '$.' }], gt0 - ky * sau) },
          { nhan: 'b) Số năm', kieu: 'so', gt: (gt0 - con) / ky, loiThuongGap: loc([{ gt: con / ky, giaiThich: 'Giải $' + gt0 + ' - ' + ky + 'x = ' + con + '$: $' + ky + 'x = ' + gt0 + ' - ' + con + '$.' }], (gt0 - con) / ky) }] },
        goiY: ['a) Thay $x = ' + sau + '$ vào $V(x)$.', 'b) Giải phương trình $' + gt0 + ' - ' + ky + 'x = ' + con + '$.'],
        loiGiai: ['a) $V(' + sau + ') = ' + gt0 + ' - ' + ky + '\\cdot ' + sau + ' = ' + (gt0 - ky * sau) + '$ (triệu đồng).', 'b) $' + gt0 + ' - ' + ky + 'x = ' + con + '$, nên $' + ky + 'x = ' + (gt0 - con) + '$, $x = ' + (gt0 - con) / ky + '$ (năm).']
      };
    } }
  ]);
})();
