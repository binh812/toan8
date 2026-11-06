// Luyện thêm – Bài 31: Cách tính xác suất của biến cố bằng tỉ số
(function () {
  'use strict';
  var MAU = ['#e03131', '#1971c2', '#f08c00', '#2f9e44', '#9c36b5', '#0c8599'];
  // màu vẽ đúng tên màu của bi/bóng (để hình không nói "Xanh" mà tô đỏ)
  var MAU_TEN = { 'đỏ': '#e03131', 'xanh': '#1971c2', 'vàng': '#f08c00', 'trắng': '#adb5bd' };
  var VONG = ['#94d82d', '#fcc419', '#ffa94d', '#fd7e14', '#e03131', '#c2255c', '#9c36b5', '#6741d9', '#1971c2', '#1098ad', '#2f9e44', '#74b816'];

  function laNT(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  function laCP(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function ds(m) { return m.join(';\\ '); }
  // Hình lời giải: mỗi kết quả là một chấm, thanh xác suất 1 chia đều cho các chấm, phần sáng là xác suất
  function hg(tuyChon, cheDo) { return { widget: 'canh', config: { ten: 'luoiKetQua', tuyChon: Object.assign({ cheDo: cheDo || 'chia' }, tuyChon), chiXem: true, t: 1 } }; }
  // Màu theo tên (kẹo đen, bóng tím…), không có tên màu thì lấy theo thứ tự
  var MAU_CHU = { 'đỏ': '#e03131', 'xanh': '#1971c2', 'vàng': '#f08c00', 'trắng': '#868e96', 'đen': '#343a40', 'tím': '#9c36b5', 'cam': '#e8590c' };
  function mauTen(ten, j) { return MAU_CHU[ten.split(' ').pop()] || MAU[j]; }
  function hoa(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function day(a, b) { var m = []; for (var k = a; k <= b; k++) m.push(k); return m; }
  // "m/n = phân số tối giản" (bỏ vế sau nếu đã tối giản)
  function pTex(cc, m, n) { var p = cc.phanSo(m, n); return '\\dfrac{' + m + '}{' + n + '}' + (p.mau === n ? '' : ' = ' + p.tex); }
  // lỗi thường gặp dạng phân số m/n: bỏ nếu mẫu 0, trùng đáp án hoặc trùng nhau
  function locLoi(cc, dung, m) {
    var thay = [dung.tu / dung.mau], out = [];
    m.forEach(function (l) {
      if (!l || !(l.mau > 0) || l.tu < 0) return;
      var v = l.tu / l.mau;
      if (thay.some(function (x) { return Math.abs(x - v) < 1e-12; })) return;
      thay.push(v);
      out.push({ gt: cc.phanSo(l.tu, l.mau).ascii, giaiThich: l.giaiThich });
    });
    return out;
  }
  function chiaKhongTL(m, n) { return { tu: m, mau: n - m, giaiThich: 'Mẫu số là **tổng** số kết quả có thể (' + n + '), không phải số kết quả không thuận lợi (' + (n - m) + ').' + (m > n - m ? ' Xác suất không bao giờ lớn hơn 1.' : '') }; }

  function bienCoXucXac(r) {
    var k = r.so(2, 4);
    return r.chon([
      { ten: 'Số chấm xuất hiện lớn hơn ' + k, loc: function (x) { return x > k; }, sai: { d: 1, giaiThich: '"Lớn hơn ' + k + '" **không** lấy số ' + k + '.' } },
      { ten: 'Số chấm xuất hiện nhỏ hơn ' + (k + 1), loc: function (x) { return x < k + 1; }, sai: { d: 1, giaiThich: '"Nhỏ hơn ' + (k + 1) + '" **không** lấy số ' + (k + 1) + '.' } },
      { ten: 'Số chấm xuất hiện không vượt quá ' + k, loc: function (x) { return x <= k; }, sai: { d: -1, giaiThich: '"Không vượt quá ' + k + '" **có** lấy số ' + k + '.' } },
      { ten: 'Số chấm xuất hiện là số nguyên tố', loc: laNT, sai: { d: 1, giaiThich: 'Số 1 **không** phải số nguyên tố.' } },
      { ten: 'Số chấm xuất hiện là hợp số', loc: function (x) { return x > 1 && !laNT(x); }, sai: { d: 1, giaiThich: 'Số 1 không phải hợp số. Hợp số từ 1 đến 6 chỉ có 4 và 6.' } },
      { ten: 'Số chấm xuất hiện chia hết cho 3', loc: function (x) { return x % 3 === 0; }, sai: null },
      { ten: 'Số chấm xuất hiện là số chẵn', loc: function (x) { return x % 2 === 0; }, sai: null }
    ]);
  }

  TOAN8.luyen(31, [
    { ten: 'Xúc xắc cân đối', muc: 1, sinh: function (r, cc) {
      var bc = bienCoXucXac(r), tl = day(1, 6).filter(bc.loc), m = tl.length, kq = cc.phanSo(m, 6);
      var loi = [chiaKhongTL(m, 6)];
      if (bc.sai) loi.push({ tu: m + bc.sai.d, mau: 6, giaiThich: bc.sai.giaiThich });
      return {
        de: 'Gieo một con xúc xắc cân đối. Tính xác suất của biến cố "' + bc.ten + '".',
        dapAn: { kieu: 'so', gt: kq.ascii },
        hinhGiai: hg({ loai: 'xucXac', thuanLoi: tl, tenBienCo: bc.ten }),
        goiY: ['Xúc xắc cân đối nên 6 kết quả $1;\\ 2;\\ \\dots;\\ 6$ là đồng khả năng.', 'Đếm các kết quả thuận lợi rồi chia cho 6.'],
        loiGiai: ['Có 6 kết quả có thể, đồng khả năng.', 'Kết quả thuận lợi: $' + ds(tl) + '$ (' + m + ' kết quả).', '$P = ' + pTex(cc, m, 6) + '$'],
        loiThuongGap: locLoi(cc, kq, loi)
      };
    } },

    { ten: 'Túi bi, túi kẹo', muc: 1, sinh: function (r, cc) {
      var loai = r.chon([{ vat: 'viên bi', mau: ['đỏ', 'xanh', 'vàng'] }, { vat: 'quả bóng', mau: ['xanh', 'đỏ', 'trắng'] }, { vat: 'viên kẹo', mau: ['sữa', 'chanh', 'dừa'], kieu: 'kẹo ' }]);
      var so = [r.so(2, 12), r.so(2, 12), r.so(2, 12)], tong = so[0] + so[1] + so[2], j = r.so(0, 2);
      var ten = function (i) { return (loai.kieu || loai.vat + ' ') + loai.mau[i]; };
      var kq = cc.phanSo(so[j], tong);
      var loi = [{ tu: 1, mau: 3, giaiThich: 'Ba ' + (loai.kieu ? 'loại kẹo' : 'màu') + ' **không** đồng khả năng (số lượng khác nhau). Mỗi ' + loai.vat + ' mới là một kết quả.' }, chiaKhongTL(so[j], tong)];
      return {
        de: 'Một túi có ' + so[0] + ' ' + ten(0) + ', ' + so[1] + ' ' + ten(1) + ' và ' + so[2] + ' ' + ten(2) + ', giống hệt nhau trừ ' + (loai.kieu ? 'vị' : 'màu') + '. Lấy ngẫu nhiên một ' + loai.vat + '. Tính xác suất lấy được ' + ten(j) + '.',
        hinh: { widget: 'xacSuat', config: { loai: 'tui', tui: [0, 1, 2].map(function (i) { return { ten: loai.mau[i].charAt(0).toUpperCase() + loai.mau[i].slice(1), so: so[i], mau: loai.kieu ? MAU[i] : MAU_TEN[loai.mau[i]] }; }) } },
        dapAn: { kieu: 'so', gt: kq.ascii },
        hinhGiai: hg({ tenBienCo: 'Lấy được ' + ten(j), nhom: [0, 1, 2].map(function (i) { return { ten: hoa(loai.mau[i]), so: so[i], mau: loai.kieu ? MAU[i] : MAU_TEN[loai.mau[i]] === '#adb5bd' ? '#868e96' : MAU_TEN[loai.mau[i]] }; }), nhomThuan: [hoa(loai.mau[j])] }),
        goiY: ['Mỗi ' + loai.vat + ' là một kết quả có thể, các kết quả đồng khả năng.', 'Số kết quả thuận lợi là số ' + ten(j) + '; chia cho **tổng** số ' + loai.vat + '.'],
        loiGiai: ['Có $' + so.join(' + ') + ' = ' + tong + '$ kết quả có thể, đồng khả năng.', 'Có ' + so[j] + ' kết quả thuận lợi (' + so[j] + ' ' + ten(j) + ').', '$P = ' + pTex(cc, so[j], tong) + '$'],
        loiThuongGap: locLoi(cc, kq, loi)
      };
    } },

    { ten: 'Biến cố chắc chắn, không thể', muc: 1, sinh: function (r) {
      var x = r.so(2, 9), y = r.so(2, 9), n = r.so(10, 30), loai = r.so(0, 2);
      var ngu = r.chon([
        { boi: 'Hộp có ' + x + ' viên bi đỏ và ' + y + ' viên bi xanh. Lấy ngẫu nhiên một viên bi.',
          bc: ['Lấy được viên bi đỏ hoặc xanh', 'Lấy được viên bi màu vàng', 'Lấy được viên bi đỏ'],
          vi: ['Viên bi nào trong hộp cũng là đỏ hoặc xanh.', 'Trong hộp không có viên bi vàng nào.', 'Có thể lấy được bi đỏ, cũng có thể lấy được bi xanh.'],
          tl: [x + y, 0, x], tong: x + y,
          hinh: function (i) { return { nhom: [{ ten: 'Đỏ', so: x, mau: MAU_TEN['đỏ'] }, { ten: 'Xanh', so: y, mau: MAU_TEN['xanh'] }], nhomThuan: [['Đỏ', 'Xanh'], [], ['Đỏ']][i] }; } },
        { boi: 'Hộp có các thẻ ghi số $1;\\ 2;\\ \\dots;\\ ' + n + '$. Rút ngẫu nhiên một thẻ.',
          bc: ['Rút được thẻ ghi số không vượt quá ' + n, 'Rút được thẻ ghi số lớn hơn ' + n, 'Rút được thẻ ghi số chẵn'],
          vi: ['Mọi thẻ đều ghi số từ 1 đến ' + n + '.', 'Không có thẻ nào ghi số lớn hơn ' + n + '.', 'Có thể rút được thẻ chẵn, cũng có thể rút được thẻ lẻ.'],
          tl: [n, 0, Math.floor(n / 2)], tong: n,
          hinh: function (i) { return { loai: 'theSo', tu: 1, den: n, loc: [function () { return true; }, function () { return false; }, function (v) { return v % 2 === 0; }][i] }; } },
        { boi: 'Gieo một con xúc xắc cân đối.',
          bc: ['Số chấm xuất hiện nhỏ hơn 7', 'Số chấm xuất hiện bằng 7', 'Số chấm xuất hiện lớn hơn ' + (x % 4 + 2)],
          vi: ['Số chấm luôn là một trong các số từ 1 đến 6, đều nhỏ hơn 7.', 'Xúc xắc không có mặt 7 chấm.', 'Biến cố có thể xảy ra, cũng có thể không.'],
          tl: [6, 0, 6 - (x % 4 + 2)], tong: 6,
          hinh: function (i) { var h = x % 4 + 2; return { loai: 'xucXac', loc: [function () { return true; }, function () { return false; }, function (v) { return v > h; }][i] }; } }]);
      var LUA = ['Biến cố chắc chắn, xác suất bằng $1$', 'Biến cố không thể, xác suất bằng $0$', 'Biến cố có thể xảy ra hoặc không, xác suất lớn hơn $0$ và nhỏ hơn $1$'];
      return {
        de: ngu.boi + ' Biến cố "' + ngu.bc[loai] + '" là:',
        dapAn: { kieu: 'chon', gt: loai, luaChon: LUA },
        hinhGiai: hg(Object.assign({ tenBienCo: ngu.bc[loai] }, ngu.hinh(loai)), 'dem'),
        goiY: ['Biến cố chắc chắn luôn xảy ra; biến cố không thể không bao giờ xảy ra.', 'Đếm số kết quả thuận lợi: bằng tất cả, bằng 0, hay ở giữa?'],
        loiGiai: [ngu.vi[loai] + ' Có ' + ngu.tl[loai] + ' trên ' + ngu.tong + ' kết quả thuận lợi.', 'Đáp án: ' + LUA[loai] + '.']
      };
    } },

    { ten: 'Thẻ số, vòng quay', muc: 2, sinh: function (r, cc) {
      var vong = r.dau() > 0, a, b, bc, tl, lan = 0;
      do {
        if (vong) { a = 1; b = r.chon([8, 10, 12, 15, 16, 18, 20, 24]); } else { a = r.chon([1, 1, 10, 11, 15, 20, 21]); b = a + r.so(9, 24); }
        var d = r.so(3, 6);
        bc = r.chon([
          { ten: 'số chia hết cho ' + d, loc: function (x) { return x % d === 0; } },
          { ten: 'số nguyên tố', loc: laNT, mot: 1 },
          { ten: 'số **không** phải số nguyên tố', loc: function (x) { return !laNT(x); }, mot: -1, bu: 'số nguyên tố' },
          { ten: 'số chính phương', loc: laCP, mot: -1 },
          { ten: 'số lẻ', loc: function (x) { return x % 2 === 1; } }]);
        tl = day(a, b).filter(bc.loc);
      } while ((tl.length < 2 || tl.length === b - a + 1) && ++lan < 30);
      var n = b - a + 1, m = tl.length, kq = cc.phanSo(m, n);
      var loi = [chiaKhongTL(m, n)];
      if (a > 1) loi.push({ tu: m, mau: n - 1, giaiThich: 'Từ ' + a + ' đến ' + b + ' có $' + b + ' - ' + a + ' + 1 = ' + n + '$ số. Em quên cộng 1.' });
      if (a === 1 && bc.mot) loi.push({ tu: m + bc.mot, mau: n, giaiThich: bc.mot > 0 || bc.bu ? 'Số 1 **không** phải số nguyên tố.' : 'Số $1 = 1^2$ cũng là số chính phương.' });
      if (bc.bu) loi.push({ tu: n - m, mau: n, giaiThich: 'Đó là xác suất của biến cố ra **' + bc.bu + '**. Đề hỏi số **không** phải số nguyên tố.' });
      var hinh = vong
        ? { widget: 'xacSuat', config: { loai: 'vongQuay', tui: day(1, b).map(function (k) { return { ten: String(k), so: 1, mau: VONG[(k - 1) % VONG.length] }; }) } }
        : { widget: 'xacSuat', config: { loai: 'theSo', tu: a, den: b } };
      return {
        de: vong ? 'Tấm bìa tròn được chia thành ' + n + ' hình quạt như nhau, đánh số $1;\\ 2;\\ \\dots;\\ ' + b + '$, gắn vào trục quay có mũi tên cố định. Quay tấm bìa. Tính xác suất để mũi tên chỉ vào ' + bc.ten + '.'
          : 'Hộp có các tấm thẻ giống nhau ghi số $' + a + ';\\ ' + (a + 1) + ';\\ \\dots;\\ ' + b + '$. Rút ngẫu nhiên một thẻ. Tính xác suất rút được thẻ ghi ' + bc.ten + '.',
        hinh: hinh,
        hinhGiai: hg({ loai: 'theSo', tu: a, den: b, thuanLoi: tl, tenBienCo: hoa(bc.ten.replace(/\*\*/g, '')) }),
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: [(vong ? 'Các hình quạt như nhau' : 'Các thẻ giống nhau') + ' nên các kết quả đồng khả năng. Đếm số kết quả có thể (nhớ cộng 1).', 'Liệt kê các kết quả thuận lợi rồi lập tỉ số.'],
        loiGiai: ['Có $' + b + ' - ' + a + ' + 1 = ' + n + '$ kết quả có thể, đồng khả năng.', 'Kết quả thuận lợi: $' + ds(tl) + '$ (' + m + ' kết quả).', '$P = ' + pTex(cc, m, n) + '$'],
        loiThuongGap: locLoi(cc, kq, loi)
      };
    } },

    { ten: 'Biến cố "không", "hoặc"', muc: 2, sinh: function (r, cc) {
      var bt = r.chon([
        { boi: 'Trên giá có', vat: 'cuốn sách', dong: 'Chọn ngẫu nhiên một cuốn', ten: ['tiểu thuyết', 'sách Lịch sử', 'sách Khoa học tự nhiên', 'sách Toán'], noi: 'cuốn ' },
        { boi: 'Túi có', vat: 'viên kẹo', dong: 'Lấy ngẫu nhiên một viên', ten: ['kẹo đen', 'kẹo đỏ', 'kẹo trắng', 'kẹo vàng'], noi: 'viên ', them: ', giống hệt nhau trừ màu' },
        { boi: 'Hộp có', vat: 'quả bóng', dong: 'Lấy ngẫu nhiên một quả', ten: ['bóng xanh', 'bóng đỏ', 'bóng tím', 'bóng cam'], noi: 'quả ', them: ', các quả bóng cùng kích thước' }]);
      var k = r.so(3, 4), so = day(1, k).map(function () { return r.so(2, 10); }), tong = so.reduce(function (s, x) { return s + x; }, 0);
      var i = r.so(0, k - 1), i2 = (i + 1 + r.so(0, k - 2)) % k, khong = r.dau() > 0, tl, hoi, giai, loi;
      if (khong) {
        tl = tong - so[i]; hoi = '**không** lấy được ' + bt.ten[i]; var tlTen = bt.ten.slice(0, k).filter(function (x, j) { return j !== i; });
        giai = 'Số kết quả thuận lợi: $' + tong + ' - ' + so[i] + ' = ' + tl + '$.';
        loi = [{ tu: so[i], mau: tong, giaiThich: 'Đó là xác suất **lấy được** ' + bt.ten[i] + '. Đề hỏi **không** lấy được.' }];
      } else {
        if (i2 < i) { var t = i; i = i2; i2 = t; }
        tl = so[i] + so[i2]; hoi = 'lấy được ' + bt.ten[i] + ' hoặc ' + bt.ten[i2]; tlTen = [bt.ten[i], bt.ten[i2]];
        giai = 'Số kết quả thuận lợi: $' + so[i] + ' + ' + so[i2] + ' = ' + tl + '$.';
        loi = [{ tu: so[i], mau: tong, giaiThich: '"Hoặc" gồm cả ' + bt.ten[i] + ' **và** ' + bt.ten[i2] + '.' }];
      }
      var kq = cc.phanSo(tl, tong);
      loi.push(chiaKhongTL(tl, tong));
      return {
        de: bt.boi + ' ' + so.map(function (s, j) { return s + ' ' + bt.noi + bt.ten[j]; }).join(', ') + (bt.them || '') + '. ' + bt.dong + '. Tính xác suất của biến cố "' + hoi.replace(/\*\*/g, '') + '".',
        dapAn: { kieu: 'so', gt: kq.ascii },
        hinhGiai: hg({ tenBienCo: hoa(hoi.replace(/\*\*/g, '')), nhom: so.map(function (s, j) { return { ten: hoa(bt.ten[j]), so: s, mau: mauTen(bt.ten[j], j) }; }), nhomThuan: tlTen.map(hoa) }),
        goiY: ['Mỗi ' + bt.vat + ' là một kết quả có thể. Có tất cả bao nhiêu ' + bt.vat + '?', khong ? 'Không lấy được ' + bt.ten[i] + ' nghĩa là lấy được một trong các loại còn lại.' : 'Cộng số ' + bt.vat + ' của hai loại.'],
        loiGiai: ['Có $' + so.join(' + ') + ' = ' + tong + '$ kết quả có thể, đồng khả năng.', giai, '$P = ' + pTex(cc, tl, tong) + '$'],
        loiThuongGap: locLoi(cc, kq, loi)
      };
    } },

    { ten: 'Hai bước: hai đồng xu, đồng xu và xúc xắc, hai xúc xắc', muc: 3, sinh: function (r, cc) {
      var loai = r.so(0, 2), kqCo = [], bc, sai = [];
      if (loai === 0) {
        kqCo = ['SS', 'SN', 'NS', 'NN'];
        bc = r.chon([
          { ten: 'Hai đồng xu ra hai mặt khác nhau', loc: function (x) { return x[0] !== x[1]; }, sai: [{ tu: 1, mau: 3, giaiThich: 'SN và NS là **hai** kết quả khác nhau; có 4 kết quả có thể chứ không phải 3.' }] },
          { ten: 'Có ít nhất một đồng xu ra mặt ngửa', loc: function (x) { return x.indexOf('N') >= 0; }, sai: [{ tu: 2, mau: 3, giaiThich: 'Em đã gộp SN và NS làm một. Có 4 kết quả: SS, SN, NS, NN.' }] },
          { ten: 'Cả hai đồng xu đều ra mặt sấp', loc: function (x) { return x === 'SS'; }, sai: [{ tu: 1, mau: 3, giaiThich: 'Có 4 kết quả đồng khả năng SS, SN, NS, NN (không phải 3).' }, { tu: 1, mau: 2, giaiThich: 'Em mới tính cho một đồng xu. Với hai đồng xu có 4 kết quả.' }] }]);
        var tl0 = kqCo.filter(bc.loc);
        return cauHaiBuoc(cc, 'Tung cùng lúc hai đồng xu cân đối (đồng thứ nhất và đồng thứ hai).', bc.ten, kqCo, tl0, bc.sai,
          'Viết kết quả thành cặp: mặt đồng thứ nhất trước, mặt đồng thứ hai sau.', 'Các kết quả có thể: SS, SN, NS, NN.');
      }
      if (loai === 1) {
        var k = r.so(2, 4), mat = r.chon(['S', 'N']), tenMat = mat === 'S' ? 'sấp' : 'ngửa';
        ['S', 'N'].forEach(function (m) { for (var i = 1; i <= 6; i++) kqCo.push(m + i); });
        bc = r.chon([
          { ten: 'Đồng xu ra mặt ' + tenMat + ' và xúc xắc ra số chấm chẵn', loc: function (x) { return x[0] === mat && Number(x[1]) % 2 === 0; }, mot: 3 },
          { ten: 'Đồng xu ra mặt ' + tenMat + ' và xúc xắc ra số chấm lớn hơn ' + k, loc: function (x) { return x[0] === mat && Number(x[1]) > k; }, mot: 6 - k },
          { ten: 'Đồng xu ra mặt ' + tenMat + ' và xúc xắc ra số chấm là số nguyên tố', loc: function (x) { return x[0] === mat && laNT(Number(x[1])); }, mot: 3 }]);
        var tl1 = kqCo.filter(bc.loc);
        sai = [{ tu: bc.mot, mau: 6, giaiThich: 'Em mới xét con xúc xắc, quên bước tung đồng xu. Mỗi kết quả là một **cặp** (mặt đồng xu, số chấm): có $2 \\cdot 6 = 12$ cặp.' }];
        return cauHaiBuoc(cc, 'Tung một đồng xu cân đối rồi gieo một con xúc xắc cân đối.', bc.ten, kqCo, tl1, sai,
          'Mỗi kết quả là một cặp, ví dụ S3 là "đồng xu sấp, xúc xắc 3 chấm". Có $2 \\cdot 6 = 12$ kết quả.', 'Các kết quả có thể: S1, S2, …, S6, N1, N2, …, N6 (12 kết quả), đồng khả năng.');
      }
      for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) kqCo.push([i, j]);
      var s = r.so(3, 11);
      bc = r.chon([
        { ten: 'Tổng số chấm trên hai con xúc xắc bằng ' + s, loc: function (x) { return x[0] + x[1] === s; } },
        { ten: 'Hai con xúc xắc ra số chấm bằng nhau', loc: function (x) { return x[0] === x[1]; } }]);
      var tl2 = kqCo.filter(bc.loc), khongThuTu = tl2.filter(function (x) { return x[0] <= x[1]; }).length;
      sai = [{ tu: khongThuTu, mau: 36, giaiThich: 'Cặp $(1; 2)$ và $(2; 1)$ là **hai** kết quả khác nhau (con thứ nhất 1 chấm hay con thứ hai 1 chấm).' }];
      return cauHaiBuoc(cc, 'Gieo đồng thời hai con xúc xắc cân đối (con thứ nhất và con thứ hai).', bc.ten,
        kqCo, tl2.map(function (x) { return '(' + x[0] + '; ' + x[1] + ')'; }), sai,
        'Mỗi kết quả là một cặp $(a; b)$: $a$ là số chấm con thứ nhất, $b$ là số chấm con thứ hai. Có $6 \\cdot 6 = 36$ cặp.', 'Có $6 \\cdot 6 = 36$ kết quả có thể là các cặp $(a; b)$, đồng khả năng.');
    } },

    { ten: 'Tìm số lượng từ xác suất', muc: 3, sinh: function (r, cc) {
      var PS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]], lan = 0, p, T, x, k, S;
      if (r.dau() > 0) {
        // Hộp có x bi đỏ và một số bi xanh; P(đỏ) = a/b → số bi xanh
        do { p = r.chon(PS); x = p[0] * r.so(2, 6); T = x * p[1] / p[0]; } while (T > 40 && ++lan < 30);
        var xanh = T - x, mau = r.chon([['đỏ', 'xanh'], ['vàng', 'trắng'], ['trắng', 'đen']]);
        return {
          de: 'Hộp có ' + x + ' viên bi ' + mau[0] + ' và một số viên bi ' + mau[1] + ', các viên bi cùng kích thước. Lấy ngẫu nhiên một viên bi thì xác suất lấy được bi ' + mau[0] + ' là $\\dfrac{' + p[0] + '}{' + p[1] + '}$. Hỏi trong hộp có bao nhiêu viên bi ' + mau[1] + '?',
          dapAn: { kieu: 'so', gt: xanh },
          goiY: ['Gọi $n$ là tổng số bi: $\\dfrac{' + x + '}{n} = \\dfrac{' + p[0] + '}{' + p[1] + '}$.', 'Tìm tổng số bi $n$ rồi trừ đi số bi ' + mau[0] + '.'],
          loiGiai: ['Gọi $n$ là tổng số bi. Ta có $\\dfrac{' + x + '}{n} = \\dfrac{' + p[0] + '}{' + p[1] + '}$ nên $n = ' + x + ' \\cdot ' + p[1] + (p[0] > 1 ? ' : ' + p[0] : '') + ' = ' + T + '$.',
            'Số bi ' + mau[1] + ' $= ' + T + ' - ' + x + ' = ' + xanh + '$'],
          loiThuongGap: T !== xanh ? [{ gt: T, giaiThich: T + ' là **tổng** số bi. Em còn phải trừ đi ' + x + ' viên bi ' + mau[0] + '.' }] : []
        };
      }
      // Giá có S cuốn, thêm k cuốn tiểu thuyết, xác suất chọn được tiểu thuyết là a/b → số tiểu thuyết lúc đầu
      var t0;
      do { p = r.chon(PS.slice(0, 8)); T = p[1] * r.so(3, 10); k = r.so(2, 8); S = T - k; t0 = T * p[0] / p[1] - k; } while ((t0 < 1 || t0 >= S) && ++lan < 50);
      if (t0 < 1 || t0 >= S) { p = [3, 4]; T = 20; k = 5; S = 15; t0 = 10; }
      var sau = T * p[0] / p[1];
      return {
        de: 'Trên giá có ' + S + ' cuốn sách, trong đó có một số cuốn tiểu thuyết. Thủ thư đặt thêm ' + k + ' cuốn tiểu thuyết mới vào giá. Khi đó, chọn ngẫu nhiên một cuốn sách trên giá thì xác suất chọn được tiểu thuyết là $\\dfrac{' + p[0] + '}{' + p[1] + '}$. Lúc đầu trên giá có bao nhiêu cuốn tiểu thuyết?',
        dapAn: { kieu: 'so', gt: t0 },
        goiY: ['Xác suất $\\dfrac{' + p[0] + '}{' + p[1] + '}$ được tính **sau khi** đã thêm sách. Lúc đó giá có bao nhiêu cuốn?', 'Số tiểu thuyết lúc sau = tổng số sách $\\cdot \\dfrac{' + p[0] + '}{' + p[1] + '}$; rồi bớt đi số cuốn mới thêm.'],
        loiGiai: ['Sau khi thêm, giá có $' + S + ' + ' + k + ' = ' + T + '$ cuốn.', 'Số tiểu thuyết lúc này: $' + T + ' \\cdot \\dfrac{' + p[0] + '}{' + p[1] + '} = ' + sau + '$ cuốn.', 'Số tiểu thuyết lúc đầu $= ' + sau + ' - ' + k + ' = ' + t0 + '$'],
        loiThuongGap: [{ gt: sau, giaiThich: sau + ' là số tiểu thuyết **sau khi** thêm. Lúc đầu phải bớt đi ' + k + ' cuốn mới.' }]
      };
    } }
  ]);

  // Câu hỏi "hai bước": tl là danh sách kết quả thuận lợi (chuỗi để in), kqCo là danh sách kết quả có thể
  function cauHaiBuoc(cc, boi, tenBC, kqCo, tl, sai, goiY2, giai1) {
    var n = kqCo.length, m = tl.length, kq = cc.phanSo(m, n);
    return {
      de: boi + ' Tính xác suất của biến cố "' + tenBC + '".',
      dapAn: { kieu: 'so', gt: kq.ascii },
      goiY: [goiY2, 'Liệt kê các kết quả thuận lợi rồi chia cho tổng số kết quả có thể.'],
      loiGiai: [giai1, 'Kết quả thuận lợi: ' + tl.join(', ') + ' (' + m + ' kết quả).', '$P = ' + pTex(cc, m, n) + '$'],
      loiThuongGap: locLoi(cc, kq, sai)
    };
  }
})();
