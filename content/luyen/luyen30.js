// Luyện thêm – Bài 30: Kết quả có thể và kết quả thuận lợi
(function () {
  'use strict';
  var MAU = ['#e03131', '#1971c2', '#f08c00', '#2f9e44', '#9c36b5', '#0c8599'];

  function laNT(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  function laCP(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function ds(m) { return m.join(';\\ '); }
  function day(a, b) { var m = []; for (var k = a; k <= b; k++) m.push(k); return m; }
  // bỏ lỗi trùng đáp án hoặc trùng nhau, bỏ giá trị âm
  function locLoi(dung, m) {
    var thay = [dung];
    return m.filter(function (l) { if (l.gt < 0 || thay.indexOf(l.gt) >= 0) return false; thay.push(l.gt); return true; });
  }

  // Các biến cố khi gieo một con xúc xắc: { ten, loc, loi: function(soDung) → [{gt, giaiThich}] }
  function bienCoXucXac(r) {
    var k = r.so(2, 4);
    return r.chon([
      { ten: 'Số chấm xuất hiện lớn hơn ' + k, loc: function (x) { return x > k; },
        loi: function (m) { return [{ gt: m + 1, giaiThich: '"Lớn hơn ' + k + '" **không** lấy số ' + k + '.' }]; } },
      { ten: 'Số chấm xuất hiện nhỏ hơn ' + (k + 1), loc: function (x) { return x < k + 1; },
        loi: function (m) { return [{ gt: m + 1, giaiThich: '"Nhỏ hơn ' + (k + 1) + '" **không** lấy số ' + (k + 1) + '.' }]; } },
      { ten: 'Số chấm xuất hiện không vượt quá ' + k, loc: function (x) { return x <= k; },
        loi: function (m) { return [{ gt: m - 1, giaiThich: '"Không vượt quá ' + k + '" nghĩa là nhỏ hơn **hoặc bằng** ' + k + ': có lấy số ' + k + '.' }]; } },
      { ten: 'Số chấm xuất hiện ít nhất là ' + k, loc: function (x) { return x >= k; },
        loi: function (m) { return [{ gt: m - 1, giaiThich: '"Ít nhất ' + k + '" là ' + k + ' trở lên, **có** lấy số ' + k + '.' }]; } },
      { ten: 'Số chấm xuất hiện là số nguyên tố', loc: laNT,
        loi: function (m) { return [{ gt: m + 1, giaiThich: 'Số 1 **không** phải số nguyên tố.' }]; } },
      { ten: 'Số chấm xuất hiện là hợp số', loc: function (x) { return x > 1 && !laNT(x); },
        loi: function (m) { return [{ gt: m + 1, giaiThich: 'Số 1 không phải hợp số (cũng không phải số nguyên tố). Hợp số từ 1 đến 6 chỉ có 4 và 6.' }]; } },
      { ten: 'Số chấm xuất hiện không chia hết cho 3', loc: function (x) { return x % 3 !== 0; },
        loi: function (m) { return [{ gt: 6 - m, giaiThich: 'Đó là số kết quả **chia hết** cho 3. Đề hỏi **không** chia hết cho 3.' }]; } },
      { ten: 'Số chấm xuất hiện là số lẻ', loc: function (x) { return x % 2 === 1; }, loi: function () { return []; } }
    ]);
  }

  TOAN8.luyen(30, [
    { ten: 'Đếm kết quả có thể', muc: 1, sinh: function (r) {
      if (r.dau() > 0) {
        var a = r.chon([1, 5, 10, 11, 12, 15, 20, 21, 25, 30]), b = a + r.so(8, 30);
        var vat = r.chon(['tấm thẻ', 'quả bóng', 'phiếu']), n = b - a + 1;
        return {
          de: 'Một hộp có các ' + vat + ' giống nhau, ghi các số $' + a + ';\\ ' + (a + 1) + ';\\ \\dots;\\ ' + b + '$ (mỗi số một ' + vat + '). Lấy ngẫu nhiên một ' + vat + '. Có bao nhiêu kết quả có thể?',
          dapAn: { kieu: 'so', gt: n },
          goiY: ['Mỗi ' + vat + ' lấy ra là một kết quả có thể.', 'Từ $a$ đến $b$ có $b - a + 1$ số.'],
          loiGiai: ['Các kết quả có thể là $' + a + ';\\ ' + (a + 1) + ';\\ \\dots;\\ ' + b + '$.', 'Số kết quả có thể $= ' + b + ' - ' + a + ' + 1 = ' + n + '$'],
          loiThuongGap: [{ gt: n - 1, giaiThich: 'Em quên **cộng 1**: từ ' + a + ' đến ' + b + ' có $' + b + ' - ' + a + ' + 1$ số.' }]
        };
      }
      var loai = r.chon([
        { vat: 'viên bi', nhom: ['đỏ', 'xanh', 'vàng', 'trắng'] },
        { vat: 'quả bóng', nhom: ['xanh', 'đỏ', 'tím', 'cam'] },
        { vat: 'chiếc bút', nhom: ['bút bi', 'bút chì', 'bút dạ', 'bút máy'] }]);
      var k = r.so(2, 4), so = [], tong = 0, cau = [];
      for (var i = 0; i < k; i++) { so.push(r.so(2, 9)); tong += so[i]; cau.push(so[i] + ' ' + (loai.vat === 'chiếc bút' ? loai.nhom[i] : loai.vat + ' ' + loai.nhom[i])); }
      return {
        de: 'Một hộp có ' + cau.join(', ') + (loai.vat === 'chiếc bút' ? '. ' : '; các ' + loai.vat + ' có cùng kích thước. ') + 'Lấy ngẫu nhiên một ' + loai.vat + '. Có bao nhiêu kết quả có thể?',
        dapAn: { kieu: 'so', gt: tong },
        goiY: ['Mỗi **' + loai.vat + '** là một kết quả có thể, không phải mỗi loại.', 'Cộng số ' + loai.vat + ' của tất cả các loại.'],
        loiGiai: ['Đặt kí hiệu riêng cho từng ' + loai.vat + ': mỗi cái là một kết quả có thể.', 'Số kết quả có thể $= ' + so.join(' + ') + ' = ' + tong + '$'],
        loiThuongGap: locLoi(tong, [{ gt: k, giaiThich: 'Có ' + k + ' **loại**, nhưng mỗi ' + loai.vat + ' mới là một kết quả có thể.' }])
      };
    } },

    { ten: 'Xúc xắc, đồng xu: đếm kết quả thuận lợi', muc: 1, sinh: function (r) {
      if (r.so(1, 4) === 1) {
        var bc = r.chon([
          { ten: 'Hai đồng xu ra hai mặt khác nhau', tl: ['SN', 'NS'], loi: [{ gt: 1, giaiThich: 'SN và NS là **hai** kết quả khác nhau (hai đồng xu khác nhau).' }] },
          { ten: 'Hai đồng xu ra hai mặt giống nhau', tl: ['SS', 'NN'], loi: [] },
          { ten: 'Có ít nhất một đồng xu ra mặt ngửa', tl: ['SN', 'NS', 'NN'], loi: [{ gt: 2, giaiThich: 'Em quên một trong hai kết quả SN, NS – đồng 1 ngửa hay đồng 2 ngửa là hai kết quả khác nhau.' }, { gt: 1, giaiThich: '"Ít nhất một" gồm cả trường hợp một đồng ngửa, không chỉ cả hai ngửa.' }] },
          { ten: 'Cả hai đồng xu đều ra mặt sấp', tl: ['SS'], loi: [{ gt: 2, giaiThich: 'Chỉ có một kết quả SS (đồng 1 sấp **và** đồng 2 sấp).' }] }]);
        var m = bc.tl.length;
        return {
          de: 'Tung cùng lúc hai đồng xu: đồng thứ nhất và đồng thứ hai. Mỗi đồng ra mặt sấp (S) hoặc ngửa (N). Có bao nhiêu kết quả thuận lợi cho biến cố "' + bc.ten + '"?',
          dapAn: { kieu: 'so', gt: m },
          goiY: ['Viết kết quả thành cặp: mặt đồng thứ nhất trước, mặt đồng thứ hai sau. Có 4 kết quả: SS, SN, NS, NN.', 'Chọn trong 4 kết quả đó những kết quả làm biến cố xảy ra.'],
          loiGiai: ['Các kết quả có thể: SS, SN, NS, NN.', 'Kết quả thuận lợi: ' + bc.tl.join(', ') + '.', 'Số kết quả thuận lợi $= ' + m + '$'],
          loiThuongGap: locLoi(m, bc.loi)
        };
      }
      var b2 = bienCoXucXac(r), tl = day(1, 6).filter(b2.loc), m2 = tl.length;
      return {
        de: 'Gieo một con xúc xắc. Có bao nhiêu kết quả thuận lợi cho biến cố "' + b2.ten + '"?',
        dapAn: { kieu: 'so', gt: m2 },
        goiY: ['Các kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$.', 'Thử từng số xem biến cố có xảy ra không. Chú ý số ở "biên".'],
        loiGiai: ['Các kết quả có thể: $1;\\ 2;\\ 3;\\ 4;\\ 5;\\ 6$.', 'Kết quả thuận lợi: $' + ds(tl) + '$.', 'Số kết quả thuận lợi $= ' + m2 + '$'],
        loiThuongGap: locLoi(m2, b2.loi(m2))
      };
    } },

    { ten: 'Thẻ số: chia hết, nguyên tố, chính phương', muc: 2, sinh: function (r) {
      var a, b, bc, tl, lan = 0;
      do {
        a = r.chon([1, 1, 1, 5, 10, 11, 20, 21, 30]); b = a + r.so(9, 24);
        var d = r.so(3, 7);
        bc = r.chon([
          { ten: 'là bội của ' + d, loc: function (x) { return x % d === 0; },
            loi: function (m) { return a > 1 ? [{ gt: Math.floor(b / d), giaiThich: 'Em đếm cả các bội của ' + d + ' **nhỏ hơn ' + a + '** – những thẻ đó không có trong hộp.' }] : []; } },
          { ten: 'không chia hết cho ' + d, loc: function (x) { return x % d !== 0; },
            loi: function (m) { return [{ gt: b - a + 1 - m, giaiThich: 'Đó là số thẻ **chia hết** cho ' + d + '. Đề hỏi thẻ **không** chia hết cho ' + d + '.' }]; } },
          { ten: 'là số nguyên tố', loc: laNT,
            loi: function (m) { return a === 1 ? [{ gt: m + 1, giaiThich: 'Số 1 **không** phải số nguyên tố.' }] : []; } },
          { ten: 'là số chính phương', loc: laCP,
            loi: function (m) { return a === 1 ? [{ gt: m - 1, giaiThich: 'Số $1 = 1^2$ cũng là số chính phương, em đừng bỏ sót.' }] : []; } },
          { ten: 'là số lẻ', loc: function (x) { return x % 2 === 1; }, loi: function () { return []; } }]);
        tl = day(a, b).filter(bc.loc);
      } while ((tl.length < 2 || tl.length > 20) && ++lan < 30);
      var n = b - a + 1, m = tl.length;
      return {
        de: 'Hộp có các tấm thẻ giống nhau ghi số $' + a + ';\\ ' + (a + 1) + ';\\ \\dots;\\ ' + b + '$. Rút ngẫu nhiên một thẻ. Hãy đếm:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: n, loiThuongGap: [{ gt: n - 1, giaiThich: 'Từ ' + a + ' đến ' + b + ' có $' + b + ' - ' + a + ' + 1 = ' + n + '$ số. Em quên cộng 1.' }] },
          { nhan: 'Số kết quả thuận lợi cho "Rút được thẻ ghi số ' + bc.ten + '"', kieu: 'so', gt: m, loiThuongGap: locLoi(m, bc.loi(m)) }] },
        goiY: ['Mỗi tấm thẻ là một kết quả có thể; nhớ cộng 1 khi đếm các số liên tiếp.', 'Liệt kê các số từ ' + a + ' đến ' + b + ' mà ' + bc.ten + ' rồi đếm.'],
        loiGiai: ['Số kết quả có thể: $' + b + ' - ' + a + ' + 1 = ' + n + '$.', 'Các kết quả thuận lợi: $' + ds(tl) + '$, có $' + m + '$ kết quả.']
      };
    } },

    { ten: 'Túi bóng, đội văn nghệ: "hoặc", "không"', muc: 2, sinh: function (r) {
      var doi = r.dau() > 0, nhom, tl, ten, loi, giai;
      if (doi) {
        var lop = ['8A', '8B', '8C', '8D'], gioi = r.chon([['nam', 'nữ', 'nam', 'nữ'], ['nữ', 'nam', 'nữ', 'nam']]);
        nhom = lop.map(function (l, i) { return { ten: 'bạn ' + gioi[i] + ' lớp ' + l, chu: String.fromCharCode(65 + i), so: r.so(2, 6), gioi: gioi[i] }; });
        var g = r.chon(['nam', 'nữ']), cap = r.khacNhau(2, 0, 3).sort(), i1 = cap[0], i2 = cap[1];
        if (r.dau() > 0) {
          var co = nhom.filter(function (x) { return x.gioi === g; });
          ten = 'Chọn được một bạn ' + g; tl = co[0].so + co[1].so;
          loi = [{ gt: co[0].so, giaiThich: 'Bạn ' + g + ' có ở **hai** lớp: ' + co[0].ten.split('lớp ')[1] + ' và ' + co[1].ten.split('lớp ')[1] + '.' }];
          giai = 'Bạn ' + g + ': $' + co[0].so + ' + ' + co[1].so + ' = ' + tl + '$ kết quả thuận lợi.';
        } else {
          ten = 'Chọn được một bạn lớp ' + lop[i1] + ' hoặc ' + lop[i2]; tl = nhom[i1].so + nhom[i2].so;
          loi = [{ gt: nhom[i1].so, giaiThich: '"Hoặc" gồm cả bạn lớp ' + lop[i1] + ' **và** bạn lớp ' + lop[i2] + '.' }];
          giai = 'Bạn lớp ' + lop[i1] + ' hoặc ' + lop[i2] + ': $' + nhom[i1].so + ' + ' + nhom[i2].so + ' = ' + tl + '$ kết quả thuận lợi.';
        }
      } else {
        var mau = r.xaoTron([['đỏ', MAU[0]], ['xanh', MAU[1]], ['vàng', MAU[2]], ['trắng', '#adb5bd']]).slice(0, r.so(3, 4));
        nhom = mau.map(function (m) { return { ten: 'bóng ' + m[0], so: r.so(2, 8), mau: m[1] }; });
        var j = r.so(0, nhom.length - 1), tong0 = nhom.reduce(function (s, x) { return s + x.so; }, 0);
        if (r.dau() > 0) {
          ten = 'Không lấy được ' + nhom[j].ten; tl = tong0 - nhom[j].so;
          loi = [{ gt: nhom[j].so, giaiThich: 'Đó là số ' + nhom[j].ten + '. Biến cố là **không** lấy được ' + nhom[j].ten + '.' }];
          giai = 'Không phải ' + nhom[j].ten + ': $' + tong0 + ' - ' + nhom[j].so + ' = ' + tl + '$ kết quả thuận lợi.';
        } else {
          var j2 = (j + 1) % nhom.length;
          ten = 'Lấy được ' + nhom[j].ten + ' hoặc ' + nhom[j2].ten; tl = nhom[j].so + nhom[j2].so;
          loi = [{ gt: nhom[j].so, giaiThich: '"Hoặc" gồm cả ' + nhom[j].ten + ' **và** ' + nhom[j2].ten + '.' }];
          giai = nhom[j].ten.charAt(0).toUpperCase() + nhom[j].ten.slice(1) + ' hoặc ' + nhom[j2].ten + ': $' + nhom[j].so + ' + ' + nhom[j2].so + ' = ' + tl + '$ kết quả thuận lợi.';
        }
      }
      var tong = nhom.reduce(function (s, x) { return s + x.so; }, 0);
      var moTa = nhom.map(function (x) { return x.so + ' ' + x.ten; }).join(', ');
      var tui = [];
      if (doi) nhom.forEach(function (x, i) { for (var k = 1; k <= x.so; k++) tui.push({ ten: x.chu + k, so: 1, mau: MAU[i + 1] }); });
      else tui = nhom.map(function (x) { return { ten: x.ten.charAt(5).toUpperCase() + x.ten.slice(6), so: x.so, mau: x.mau }; });
      return {
        de: doi ? 'Đội văn nghệ khối 8 có ' + moTa + '. Chọn ngẫu nhiên một bạn. Hãy đếm:'
          : 'Một túi có ' + moTa + ', các quả bóng có cùng kích thước. Lấy ngẫu nhiên một quả bóng. Hãy đếm:',
        hinh: { widget: 'xacSuat', config: { loai: 'tui', tui: tui } },
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: tong, loiThuongGap: locLoi(tong, [{ gt: nhom.length, giaiThich: 'Mỗi ' + (doi ? '**bạn**' : '**quả bóng**') + ' là một kết quả có thể, không phải mỗi nhóm.' }]) },
          { nhan: 'Số kết quả thuận lợi cho "' + ten + '"', kieu: 'so', gt: tl, loiThuongGap: locLoi(tl, loi) }] },
        goiY: ['Mỗi ' + (doi ? 'bạn' : 'quả bóng') + ' là một kết quả có thể: cộng số lượng tất cả các nhóm.', 'Biến cố xảy ra khi ' + (doi ? 'bạn' : 'quả bóng') + ' được chọn thuộc những nhóm nào? Cộng số lượng các nhóm đó.'],
        loiGiai: ['Số kết quả có thể: $' + nhom.map(function (x) { return x.so; }).join(' + ') + ' = ' + tong + '$.', giai]
      };
    } },

    { ten: 'Bài toán lớp học, câu lạc bộ', muc: 3, sinh: function (r) {
      var lop = '8' + r.chon(['A', 'B', 'C', 'D', 'E']), clb = r.chon(['bóng đá', 'cờ vua', 'bơi lội', 'cầu lông', 'âm nhạc']);
      var N = r.so(30, 44), g = r.so(12, N - 14), nam = N - g, a = r.so(2, g - 3), b = r.so(3, nam - 4), namCo = nam - b;
      var hoi = r.chon(['namCo', 'thamGia', 'nuKhong', 'khong']), kq, loi, giai;
      if (hoi === 'namCo') {
        kq = namCo; hoi = 'Chọn được một bạn nam có tham gia câu lạc bộ ' + clb;
        loi = [{ gt: b, giaiThich: b + ' là số bạn nam **không** tham gia.' }, { gt: namCo + a, giaiThich: 'Biến cố chỉ nói về bạn **nam**, không cộng ' + a + ' bạn nữ.' }];
        giai = ['Số bạn nam: $' + N + ' - ' + g + ' = ' + nam + '$.', 'Số kết quả thuận lợi $= ' + nam + ' - ' + b + ' = ' + kq + '$'];
      } else if (hoi === 'thamGia') {
        kq = namCo + a; hoi = 'Chọn được một bạn có tham gia câu lạc bộ ' + clb;
        loi = [{ gt: namCo, giaiThich: 'Em quên ' + a + ' bạn **nữ** cũng tham gia câu lạc bộ.' }, { gt: a + b, giaiThich: b + ' bạn nam **không** tham gia, em phải lấy số bạn nam trừ đi ' + b + '.' }];
        giai = ['Số bạn nam: $' + N + ' - ' + g + ' = ' + nam + '$; số bạn nam tham gia: $' + nam + ' - ' + b + ' = ' + namCo + '$.', 'Số kết quả thuận lợi $= ' + namCo + ' + ' + a + ' = ' + kq + '$'];
      } else if (hoi === 'nuKhong') {
        kq = g - a; hoi = 'Chọn được một bạn nữ không tham gia câu lạc bộ ' + clb;
        loi = [{ gt: a, giaiThich: a + ' là số bạn nữ **có** tham gia.' }, { gt: g - a + b, giaiThich: 'Biến cố chỉ nói về bạn **nữ**, không cộng bạn nam.' }];
        giai = ['Có ' + g + ' bạn nữ, trong đó ' + a + ' bạn tham gia câu lạc bộ.', 'Số kết quả thuận lợi $= ' + g + ' - ' + a + ' = ' + kq + '$'];
      } else {
        kq = g - a + b; hoi = 'Chọn được một bạn không tham gia câu lạc bộ ' + clb;
        loi = [{ gt: b, giaiThich: 'Em quên các bạn **nữ** không tham gia: $' + g + ' - ' + a + ' = ' + (g - a) + '$ bạn.' }, { gt: g - a, giaiThich: 'Em quên ' + b + ' bạn **nam** không tham gia.' }];
        giai = ['Số bạn nữ không tham gia: $' + g + ' - ' + a + ' = ' + (g - a) + '$.', 'Số kết quả thuận lợi $= ' + (g - a) + ' + ' + b + ' = ' + kq + '$'];
      }
      return {
        de: 'Lớp ' + lop + ' có ' + N + ' học sinh, trong đó có ' + g + ' bạn nữ. Có ' + a + ' bạn nữ tham gia câu lạc bộ ' + clb + ' và ' + b + ' bạn nam **không** tham gia câu lạc bộ này. Chọn ngẫu nhiên một học sinh của lớp. Có bao nhiêu kết quả thuận lợi cho biến cố "' + hoi + '"?',
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Mỗi học sinh là một kết quả có thể. Chia lớp thành 4 nhóm: nữ tham gia, nữ không tham gia, nam tham gia, nam không tham gia.', 'Tính số học sinh của từng nhóm rồi cộng các nhóm làm biến cố xảy ra.'],
        loiGiai: giai,
        loiThuongGap: locLoi(kq, loi)
      };
    } },

    { ten: 'Chọn số có hai chữ số', muc: 3, sinh: function (r) {
      var d = r.so(3, 9), c = r.so(1, 9), k = r.chon([20, 25, 30, 40, 50]);
      var bc = r.chon([
        { ten: 'Số được chọn chia hết cho ' + d, loc: function (x) { return x % d === 0; },
          loi: [{ gt: Math.floor(99 / d), giaiThich: 'Em đếm cả các bội của ' + d + ' có **một** chữ số (nhỏ hơn 10).' }],
          cach: 'Bội của ' + d + ' có hai chữ số từ $' + (Math.ceil(10 / d) * d) + '$ đến $' + (Math.floor(99 / d) * d) + '$.' },
        { ten: 'Số được chọn có chữ số hàng chục là ' + c, loc: function (x) { return Math.floor(x / 10) === c; },
          loi: [{ gt: 9, giaiThich: 'Chữ số hàng đơn vị có thể là $0;\\ 1;\\ \\dots;\\ 9$: **10** khả năng.' }], cach: 'Các số $' + c + '0;\\ ' + c + '1;\\ \\dots;\\ ' + c + '9$.' },
        { ten: 'Số được chọn nhỏ hơn ' + k, loc: function (x) { return x < k; },
          loi: [{ gt: k - 1, giaiThich: 'Số có hai chữ số bắt đầu từ **10**, không phải từ 1.' }, { gt: k - 9, giaiThich: '"Nhỏ hơn ' + k + '" không lấy số ' + k + '.' }], cach: 'Các số từ $10$ đến $' + (k - 1) + '$.' },
        { ten: 'Số được chọn là số chính phương', loc: laCP,
          loi: [{ gt: 9, giaiThich: '$1;\\ 4;\\ 9$ chỉ có một chữ số. Số chính phương có hai chữ số bắt đầu từ $4^2 = 16$.' }], cach: 'Đó là $4^2;\\ 5^2;\\ \\dots;\\ 9^2$ ($10^2 = 100$ có ba chữ số).' }]);
      var tl = day(10, 99).filter(bc.loc), m = tl.length;
      return {
        de: 'Chọn ngẫu nhiên một số tự nhiên có hai chữ số. Hãy đếm:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Số kết quả có thể', kieu: 'so', gt: 90, loiThuongGap: [{ gt: 99, giaiThich: 'Số có hai chữ số bắt đầu từ **10**: $99 - 10 + 1 = 90$.' }, { gt: 89, giaiThich: 'Từ 10 đến 99 có $99 - 10 + 1 = 90$ số. Em quên cộng 1.' }] },
          { nhan: 'Số kết quả thuận lợi cho "' + bc.ten + '"', kieu: 'so', gt: m, loiThuongGap: locLoi(m, bc.loi) }] },
        goiY: ['Số nhỏ nhất có hai chữ số là 10, lớn nhất là 99.', 'Liệt kê (hoặc đếm theo quy luật) các số có hai chữ số làm biến cố xảy ra.'],
        loiGiai: ['Kết quả có thể: $10;\\ 11;\\ \\dots;\\ 99$, có $99 - 10 + 1 = 90$ kết quả.', bc.cach + ' Có $' + m + '$ kết quả thuận lợi' + (m <= 12 ? ': $' + ds(tl) + '$.' : '.')]
      };
    } }
  ], { deCo: [
    { id: '30.L1', muc: 1, de: 'Tung một đồng xu. Các kết quả có thể là:',
      dapAn: { kieu: 'chon', gt: 1, luaChon: ['Chỉ có mặt ngửa', 'Mặt sấp; mặt ngửa', 'Mặt sấp; mặt ngửa; đồng xu đứng', '$1;\\ 2$'] },
      goiY: ['Đồng xu có mấy mặt?', 'Liệt kê tất cả những gì có thể xảy ra (coi như đồng xu không bao giờ đứng).'],
      loiGiai: ['Tung đồng xu chỉ có thể ra mặt sấp (S) hoặc mặt ngửa (N).', 'Đáp án: Mặt sấp; mặt ngửa.'] },
    { id: '30.L2', muc: 1, de: 'Khẳng định sau đúng hay sai: "Trước khi gieo một con xúc xắc, ta biết chắc số chấm sẽ xuất hiện."',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Gieo xúc xắc là một hành động mà ta không biết trước kết quả.', 'Ta chỉ liệt kê được các kết quả **có thể** xảy ra.'],
      loiGiai: ['Ta không biết trước kết quả, chỉ biết 6 kết quả có thể: $1;\\ 2;\\ \\dots;\\ 6$.', 'Vậy khẳng định **sai**.'] },
    { id: '30.L3', muc: 1, de: 'Rút ngẫu nhiên một thẻ từ hộp có các thẻ ghi số $1;\\ 2;\\ \\dots;\\ 10$. Các kết quả thuận lợi cho biến cố "Rút được thẻ ghi số chia hết cho 4" là:',
      dapAn: { kieu: 'chon', gt: 2, luaChon: ['$4$', '$1;\\ 2;\\ 4$', '$4;\\ 8$', '$4;\\ 8;\\ 10$'] },
      goiY: ['Số chia hết cho 4 là bội của 4.', 'Bội của 4 không vượt quá 10 là những số nào?'],
      loiGiai: ['Bội của 4 từ 1 đến 10: $4;\\ 8$ ($12 > 10$).', 'Đáp án: $4;\\ 8$.'] },
    { id: '30.L4', muc: 1, de: 'Túi có 3 viên bi đỏ và 2 viên bi xanh cùng kích thước. Bạn Vuông nói: "Lấy ngẫu nhiên một viên bi thì có 2 kết quả có thể là đỏ và xanh." Bạn Vuông nói đúng hay sai?',
      dapAn: { kieu: 'dungSai', gt: false },
      goiY: ['Mỗi **viên bi** là một kết quả có thể.', 'Kí hiệu các viên bi: Đ1, Đ2, Đ3, X1, X2.'],
      loiGiai: ['Có 5 viên bi khác nhau nên có **5** kết quả có thể: Đ1, Đ2, Đ3, X1, X2.', 'Vậy bạn Vuông nói **sai**.'] },
    { id: '30.L5', muc: 1, de: 'Gieo một con xúc xắc. Các kết quả thuận lợi cho biến cố "Số chấm xuất hiện là số lẻ lớn hơn 2" là:',
      dapAn: { kieu: 'chon', gt: 0, luaChon: ['$3;\\ 5$', '$1;\\ 3;\\ 5$', '$5$', '$3;\\ 4;\\ 5$'] },
      goiY: ['Các số lẻ từ 1 đến 6 là $1;\\ 3;\\ 5$.', 'Trong đó số nào lớn hơn 2?'],
      loiGiai: ['Số lẻ: $1;\\ 3;\\ 5$. Lớn hơn 2 thì bỏ số 1.', 'Đáp án: $3;\\ 5$.'] },
    { id: '30.L6', muc: 1, de: 'Gieo một con xúc xắc. Khẳng định sau đúng hay sai: "Kết quả 6 chấm là một kết quả thuận lợi cho biến cố ‘Số chấm xuất hiện là hợp số’."',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Hợp số là số lớn hơn 1 có nhiều hơn hai ước.', '6 có những ước nào?'],
      loiGiai: ['$6$ có các ước $1;\\ 2;\\ 3;\\ 6$ nên 6 là hợp số. Gieo được 6 chấm thì biến cố xảy ra.', 'Vậy khẳng định **đúng**.'] },
    { id: '30.L7', muc: 1, de: 'Gieo một con xúc xắc. Biến cố nào có các kết quả thuận lợi là $1;\\ 2;\\ 3$?',
      dapAn: { kieu: 'chon', gt: 3, luaChon: ['Số chấm nhỏ hơn 3', 'Số chấm không vượt quá 4', 'Số chấm là số nguyên tố', 'Số chấm nhỏ hơn 4'] },
      goiY: ['Thử liệt kê kết quả thuận lợi của từng biến cố.', '"Nhỏ hơn 3" có lấy số 3 không?'],
      loiGiai: ['"Nhỏ hơn 3": $1;\\ 2$. "Không vượt quá 4": $1;\\ 2;\\ 3;\\ 4$. "Số nguyên tố": $2;\\ 3;\\ 5$. "Nhỏ hơn 4": $1;\\ 2;\\ 3$.', 'Đáp án: Số chấm nhỏ hơn 4.'] },
    { id: '30.L8', muc: 2, de: 'Hộp có 4 quả cầu đỏ đánh số 1 đến 4 và 3 quả cầu xanh đánh số 1 đến 3. Lấy ngẫu nhiên một quả cầu. Có bao nhiêu kết quả có thể?',
      dapAn: { kieu: 'so', gt: 7 },
      goiY: ['Quả đỏ số 1 và quả xanh số 1 là **hai** quả khác nhau.', 'Kí hiệu Đ1–Đ4 và X1–X3 rồi đếm.'],
      loiGiai: ['Các kết quả có thể: Đ1, Đ2, Đ3, Đ4, X1, X2, X3.', 'Số kết quả có thể $= 4 + 3 = 7$'],
      loiThuongGap: [{ gt: 4, giaiThich: 'Em chỉ đếm các **số** khác nhau. Quả đỏ số 1 và quả xanh số 1 là hai kết quả khác nhau.' }] },
    { id: '30.L9', muc: 2, de: 'Hộp có 4 quả cầu đỏ đánh số 1 đến 4 và 3 quả cầu xanh đánh số 1 đến 3. Lấy ngẫu nhiên một quả. Có bao nhiêu kết quả thuận lợi cho biến cố "Lấy được quả cầu ghi số chẵn"?',
      dapAn: { kieu: 'so', gt: 3 },
      goiY: ['Quả đỏ ghi số chẵn: Đ2, Đ4. Còn quả xanh?', 'Đừng quên quả xanh ghi số 2.'],
      loiGiai: ['Kết quả thuận lợi: Đ2, Đ4, X2.', 'Số kết quả thuận lợi $= 3$'],
      loiThuongGap: [{ gt: 2, giaiThich: 'Em quên quả cầu **xanh** ghi số 2 (X2).' }] },
    { id: '30.L10', muc: 2, de: 'Chọn ngẫu nhiên một tháng trong năm. Hãy đếm:',
      dapAn: { kieu: 'nhieuO', o: [
        { nhan: 'Số kết quả có thể', kieu: 'so', gt: 12 },
        { nhan: 'Số kết quả thuận lợi cho "Tháng được chọn có 31 ngày"', kieu: 'so', gt: 7,
          loiThuongGap: [{ gt: 6, giaiThich: 'Tháng 7 **và** tháng 8 đều có 31 ngày. Các tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.' }] }] },
      goiY: ['Mỗi tháng là một kết quả có thể.', 'Đếm các tháng có 31 ngày (có thể đếm trên các khớp nắm tay).'],
      loiGiai: ['Có 12 kết quả có thể: tháng 1, tháng 2, …, tháng 12.', 'Tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12 → 7 kết quả thuận lợi.'] },
    { id: '30.L11', muc: 2, de: 'Gieo một con xúc xắc. Khẳng định sau đúng hay sai: "Biến cố ‘Số chấm xuất hiện lớn hơn 6’ không có kết quả thuận lợi nào."',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Số chấm lớn nhất của xúc xắc là bao nhiêu?', 'Có kết quả nào trong $1;\\ 2;\\ \\dots;\\ 6$ lớn hơn 6 không?'],
      loiGiai: ['Không có số nào trong $1;\\ 2;\\ \\dots;\\ 6$ lớn hơn 6, nên biến cố không có kết quả thuận lợi nào (biến cố này không thể xảy ra).', 'Vậy khẳng định **đúng**.'] },
    { id: '30.L12', muc: 2, de: 'Hộp có 20 tấm thẻ **giống hệt nhau** ghi số $1;\\ 2;\\ \\dots;\\ 20$, được trộn đều. Rút ngẫu nhiên một thẻ. Khẳng định sau đúng hay sai: "Thẻ số 7 và thẻ số 15 có khả năng được rút ra như nhau."',
      dapAn: { kieu: 'dungSai', gt: true },
      goiY: ['Các thẻ giống hệt nhau, chỉ khác số ghi trên thẻ.', 'Khi rút ngẫu nhiên, có thẻ nào "dễ" được rút hơn thẻ khác không?'],
      loiGiai: ['Các thẻ giống hệt nhau và được trộn đều nên mỗi thẻ có khả năng được rút ra như nhau: các kết quả có thể là **đồng khả năng**.', 'Vậy khẳng định **đúng**.'] }
  ] });
})();
