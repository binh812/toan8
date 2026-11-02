// Bài nền (lớp 7): Tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận – tỉ lệ nghịch – cần cho Chương IV, VII, IX.
(function () {
  'use strict';
  function giaTri(s) { if (typeof s === 'number') return s; var p = String(s).split('/'); return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(s); }
  function themLoi(ds, gt, dap, giaiThich) {
    var v = giaTri(gt);
    if (!isFinite(v) || Math.abs(v - giaTri(dap)) < 1e-9) return;
    if (ds.some(function (l) { return Math.abs(giaTri(l.gt) - v) < 1e-9; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }
  function fr(a, b) { return '\\frac{' + a + '}{' + b + '}'; }

  TOAN8.nen({
    id: 'tiLeThuc', ten: 'Tỉ lệ thức và đại lượng tỉ lệ', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Tỉ lệ thức',
        noiDung: 'Tỉ lệ thức là đẳng thức của hai tỉ số: $\\frac{a}{b} = \\frac{c}{d}$ (đọc: $a$ chia $b$ bằng $c$ chia $d$).\n\nTính chất: $\\frac{a}{b} = \\frac{c}{d} \\Rightarrow a \\cdot d = b \\cdot c$ ("nhân chéo").\n\nTìm số hạng chưa biết: $\\frac{x}{b} = \\frac{c}{d} \\Rightarrow x = \\frac{b \\cdot c}{d}$.' },
      { loai: 'dinhLi', tieuDe: 'Dãy tỉ số bằng nhau',
        noiDung: '$\\frac{a}{b} = \\frac{c}{d} = \\frac{a + c}{b + d} = \\frac{a - c}{b - d}$ (các mẫu khác $0$).\n\nVí dụ: $\\frac{x}{2} = \\frac{y}{3}$ và $x + y = 20$ thì $\\frac{x}{2} = \\frac{y}{3} = \\frac{x + y}{2 + 3} = \\frac{20}{5} = 4$, nên $x = 8$, $y = 12$.' },
      { loai: 'dinhNghia', tieuDe: 'Đại lượng tỉ lệ thuận, tỉ lệ nghịch',
        noiDung: '**Tỉ lệ thuận**: $y = k \\cdot x$ ($k \\ne 0$). Tỉ số $\\frac{y}{x} = k$ không đổi; $x$ gấp lên bao nhiêu lần thì $y$ cũng gấp lên bấy nhiêu lần. Ví dụ: số vở và số tiền mua vở.\n\n**Tỉ lệ nghịch**: $y = \\frac{a}{x}$ ($a \\ne 0$). Tích $x \\cdot y = a$ không đổi; $x$ gấp lên bao nhiêu lần thì $y$ giảm đi bấy nhiêu lần. Ví dụ: số công nhân và số ngày làm xong một công việc.' },
      { loai: 'chuY', noiDung: '**Lỗi hay gặp:** nhầm tỉ lệ thuận với tỉ lệ nghịch. Hỏi lại: "Đại lượng này tăng thì đại lượng kia tăng hay giảm?" – cùng tăng là tỉ lệ thuận, một tăng một giảm là tỉ lệ nghịch.' }
    ],
    viDu: [
      { de: 'Tìm $x$, biết $\\frac{x}{6} = \\frac{4}{3}$.', buoc: [
        { lam: '$3 \\cdot x = 6 \\cdot 4$', vi: 'Tính chất tỉ lệ thức: nhân chéo hai vế.' },
        { lam: '$x = \\frac{24}{3} = 8$', vi: 'Chia cả hai vế cho $3$.' }] },
      { de: '$6$ công nhân làm xong một công việc trong $10$ ngày. Hỏi $4$ công nhân (năng suất như nhau) làm xong công việc đó trong bao nhiêu ngày?', buoc: [
        { lam: 'Số công nhân và số ngày là hai đại lượng **tỉ lệ nghịch**.', vi: 'Càng nhiều người thì càng ít ngày.' },
        { lam: '$4 \\cdot x = 6 \\cdot 10 = 60$, nên $x = 15$ (ngày)', vi: 'Tích của hai đại lượng tỉ lệ nghịch không đổi.' }] }
    ],
    luyen: [
      { ten: 'Tìm x trong tỉ lệ thức', muc: 1, sinh: function (r, cc) {
        var b = r.so(1, 12), c = r.so(2, 9), k = r.so(2, 6), dang = r.chon([0, 1, 2]);
        while (cc.ucln(b, c) !== 1 || b === c) { b = r.so(1, 12); c = r.so(2, 9); }
        var de, x0, cheo, ltg = [];
        if (dang === 0) { var a = c * k; x0 = b * k; de = fr('x', a) + ' = ' + fr(b, c); cheo = ['$' + c + ' \\cdot x = ' + a + ' \\cdot ' + b + '$', '$x = ' + fr(a + ' \\cdot ' + b, c) + ' = ' + x0 + '$'];
          themLoi(ltg, cc.phanSo(a * c, b).ascii, x0, 'Nhân chéo cho đúng cặp: $x \\cdot ' + c + ' = ' + a + ' \\cdot ' + b + '$.'); }
        else if (dang === 1) { var a1 = b * k; x0 = c * k; de = fr(a1, 'x') + ' = ' + fr(b, c); cheo = ['$' + b + ' \\cdot x = ' + a1 + ' \\cdot ' + c + '$', '$x = ' + fr(a1 + ' \\cdot ' + c, b) + ' = ' + x0 + '$'];
          themLoi(ltg, cc.phanSo(a1 * b, c).ascii, x0, 'Nhân chéo cho đúng cặp: $' + a1 + ' \\cdot ' + c + ' = x \\cdot ' + b + '$.'); }
        else { var c2 = c * k; x0 = b * k; de = fr(b, c) + ' = ' + fr('x', c2); cheo = ['$' + c + ' \\cdot x = ' + b + ' \\cdot ' + c2 + '$', '$x = ' + fr(b + ' \\cdot ' + c2, c) + ' = ' + x0 + '$'];
          themLoi(ltg, cc.phanSo(c * c2, b).ascii, x0, 'Nhân chéo cho đúng cặp: $' + b + ' \\cdot ' + c2 + ' = ' + c + ' \\cdot x$.'); }
        return {
          de: 'Tìm $x$, biết $' + de + '$.',
          dapAn: { kieu: 'so', gt: x0 },
          goiY: ['Tính chất tỉ lệ thức: $\\frac{a}{b} = \\frac{c}{d} \\Rightarrow a \\cdot d = b \\cdot c$.', 'Nhân chéo rồi chia cho hệ số của $x$.'],
          loiGiai: cheo, loiThuongGap: ltg
        };
      } },
      { ten: 'Dãy tỉ số bằng nhau', muc: 2, sinh: function (r) {
        var a = r.so(2, 9), b = r.so(2, 9), k = r.so(2, 9), tong = r.dau() > 0;
        while (b === a) b = r.so(2, 9);
        if (!tong && a < b) { var t = a; a = b; b = t; }
        var x = a * k, y = b * k, s = tong ? x + y : x - y, dau = tong ? '+' : '-';
        return {
          de: 'Tìm hai số $x$ và $y$, biết $\\frac{x}{' + a + '} = \\frac{y}{' + b + '}$ và $x ' + dau + ' y = ' + s + '$.',
          dapAn: { kieu: 'nhieuO', o: [{ nhan: 'x', kieu: 'so', gt: x }, { nhan: 'y', kieu: 'so', gt: y }] },
          goiY: ['Dùng tính chất dãy tỉ số bằng nhau: $\\frac{x}{' + a + '} = \\frac{y}{' + b + '} = \\frac{x ' + dau + ' y}{' + a + ' ' + dau + ' ' + b + '}$.', 'Tính giá trị chung của các tỉ số, rồi nhân với mẫu để ra $x$, $y$.'],
          loiGiai: ['$\\frac{x}{' + a + '} = \\frac{y}{' + b + '} = \\frac{x ' + dau + ' y}{' + a + ' ' + dau + ' ' + b + '} = \\frac{' + s + '}{' + (tong ? a + b : a - b) + '} = ' + k + '$',
            '$x = ' + a + ' \\cdot ' + k + ' = ' + x + '$; $y = ' + b + ' \\cdot ' + k + ' = ' + y + '$']
        };
      } },
      { ten: 'Đại lượng tỉ lệ thuận', muc: 2, sinh: function (r, cc) {
        var ngu = r.chon([0, 1, 2]), x1 = r.so(2, 9), x2 = r.so(2, 12), k, de, dv;
        while (x2 === x1) x2 = r.so(2, 12);
        if (ngu === 0) { k = r.so(3, 15); dv = 'nghìn đồng'; de = 'Mua $' + x1 + '$ quyển vở hết $' + k * x1 + '$ nghìn đồng. Hỏi mua $' + x2 + '$ quyển vở cùng loại hết bao nhiêu nghìn đồng?'; }
        else if (ngu === 1) { k = r.chon([40, 45, 50, 55, 60]); dv = 'km'; de = 'Một ô tô chạy với vận tốc không đổi, trong $' + x1 + '$ giờ đi được $' + k * x1 + '$ km. Hỏi trong $' + x2 + '$ giờ ô tô đi được bao nhiêu ki-lô-mét?'; }
        else { k = r.khac0(-9, 9); while (Math.abs(k) < 2) k = r.khac0(-9, 9); dv = ''; de = 'Cho $y$ tỉ lệ thuận với $x$; khi $x = ' + x1 + '$ thì $y = ' + k * x1 + '$. Tính $y$ khi $x = ' + x2 + '$.'; }
        var y1 = k * x1, kq = k * x2, ltg = [];
        themLoi(ltg, cc.phanSo(x1 * y1, x2).ascii, kq, 'Đây là hai đại lượng tỉ lệ **thuận** (tỉ số $\\frac{y}{x}$ không đổi), không phải tỉ lệ nghịch.');
        return {
          de: de,
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Hai đại lượng tỉ lệ thuận thì tỉ số $\\frac{y}{x} = k$ không đổi.', 'Tìm $k = \\frac{' + y1 + '}{' + x1 + '}$ rồi nhân với $' + x2 + '$.'],
          loiGiai: ['Hệ số tỉ lệ $k = \\frac{' + y1 + '}{' + x1 + '} = ' + k + '$' + (ngu === 0 ? ' (giá một quyển vở, nghìn đồng).' : ngu === 1 ? ' (vận tốc, km/h).' : '.'),
            '$y = ' + k + ' \\cdot ' + x2 + ' = ' + kq + '$' + (dv ? ' (' + dv + ')' : '')],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Đại lượng tỉ lệ nghịch (bài toán)', muc: 3, sinh: function (r, cc) {
        var n, t, P, uoc;
        do {
          n = r.so(3, 12); t = r.so(2, 12); P = n * t; uoc = [];
          for (var d = 2; d <= 30; d++) if (P % d === 0 && d !== n) uoc.push(d);
        } while (!uoc.length);
        var m = r.chon(uoc), kq = P / m, ngu = r.chon([0, 1]);
        var ai = ngu === 0 ? ['công nhân', 'làm xong một công việc', 'ngày', '(năng suất như nhau)', 'làm xong công việc đó'] : ['máy bơm', 'bơm đầy một bể nước', 'giờ', '(cùng loại)', 'bơm đầy bể đó'];
        var ltg = []; themLoi(ltg, cc.phanSo(t * m, n).ascii, kq, 'Số ' + ai[0] + ' và số ' + ai[2] + ' là hai đại lượng tỉ lệ **nghịch** (càng nhiều ' + ai[0] + ' thì càng ít ' + ai[2] + '), không phải tỉ lệ thuận.');
        return {
          de: '$' + n + '$ ' + ai[0] + ' ' + ai[3] + ' ' + ai[1] + ' trong $' + t + '$ ' + ai[2] + '. Hỏi $' + m + '$ ' + ai[0] + ' như thế ' + ai[4] + ' trong bao nhiêu ' + ai[2] + '?',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Nhiều ' + ai[0] + ' hơn thì xong nhanh hơn: đây là hai đại lượng tỉ lệ nghịch.', 'Tích (số ' + ai[0] + ') $\\cdot$ (số ' + ai[2] + ') không đổi và bằng $' + n + ' \\cdot ' + t + '$.'],
          loiGiai: ['Số ' + ai[0] + ' và số ' + ai[2] + ' tỉ lệ nghịch nên $' + m + ' \\cdot x = ' + n + ' \\cdot ' + t + ' = ' + P + '$.', '$x = ' + P + ' : ' + m + ' = ' + kq + '$ (' + ai[2] + ')'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Chia theo tỉ lệ', muc: 3, sinh: function (r) {
        var ts = r.khacNhau(3, 2, 8), k = r.so(2, 12), S = (ts[0] + ts[1] + ts[2]) * k;
        var ngu = r.chon([
          { de: 'Ba lớp 7A, 7B, 7C trồng được tổng cộng $' + S + '$ cây. Số cây của ba lớp tỉ lệ với $' + ts.join('$; $') + '$. Tính số cây mỗi lớp trồng.', ten: ['Lớp 7A', 'Lớp 7B', 'Lớp 7C'], goi: 'số cây của ba lớp 7A, 7B, 7C' },
          { de: 'Chia $' + S + '$ quyển sách cho ba tủ A, B, C theo tỉ lệ $' + ts.join(' : ') + '$. Mỗi tủ có bao nhiêu quyển?', ten: ['Tủ A', 'Tủ B', 'Tủ C'], goi: 'số sách của ba tủ A, B, C' },
          { de: 'Ba số $a$, $b$, $c$ tỉ lệ với $' + ts.join('$; $') + '$ và $a + b + c = ' + S + '$. Tìm $a$, $b$, $c$.', ten: ['a', 'b', 'c'] }]);
        return {
          de: ngu.de,
          dapAn: { kieu: 'nhieuO', o: ts.map(function (t, i) { return { nhan: ngu.ten[i], kieu: 'so', gt: t * k }; }) },
          goiY: ['Gọi ba số cần tìm là $a$, $b$, $c$: $\\frac{a}{' + ts[0] + '} = \\frac{b}{' + ts[1] + '} = \\frac{c}{' + ts[2] + '}$.', 'Dùng dãy tỉ số bằng nhau: $\\frac{a + b + c}{' + ts[0] + ' + ' + ts[1] + ' + ' + ts[2] + '}$.'],
          loiGiai: (ngu.goi ? ['Gọi ' + ngu.goi + ' lần lượt là $a$, $b$, $c$.'] : []).concat(['$\\frac{a}{' + ts[0] + '} = \\frac{b}{' + ts[1] + '} = \\frac{c}{' + ts[2] + '} = \\frac{a + b + c}{' + ts[0] + ' + ' + ts[1] + ' + ' + ts[2] + '} = \\frac{' + S + '}{' + (ts[0] + ts[1] + ts[2]) + '} = ' + k + '$',
            '$a = ' + ts[0] + ' \\cdot ' + k + ' = ' + ts[0] * k + '$; $b = ' + ts[1] + ' \\cdot ' + k + ' = ' + ts[1] * k + '$; $c = ' + ts[2] + ' \\cdot ' + k + ' = ' + ts[2] * k + '$'])
        };
      } }
    ]
  });
})();
