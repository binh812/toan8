// Luyện thêm – Bài 32: Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng
(function () {
  'use strict';
  var TEN = ['An', 'Bình', 'Mai', 'Lan', 'Minh', 'Hà', 'Tùng', 'Vy'];

  // số nguyên kiểu Việt trong $…$: 2\,000
  function so(n) {
    var t = String(n), out = '';
    while (t.length > 3) { out = '\\,' + t.slice(-3) + out; t = t.slice(0, -3); }
    return t + out;
  }
  function pTex(cc, m, n) { var p = cc.phanSo(m, n); return '\\dfrac{' + so(m) + '}{' + so(n) + '}' + (p.mau === n ? '' : ' = ' + p.tex); }
  // số lượng "tròn" trong danh sách, chia hết cho mẫu của xác suất (để dự đoán ra số nguyên), LỚN HƠN số đã khảo sát
  // (tổng thể phải lớn hơn mẫu khảo sát; mẫu của xác suất luôn là ước của số đã khảo sát nên tranh·j chia hết cho mau)
  function chonM(r, mau, ds, tranh) {
    var hop = ds.filter(function (M) { return M % mau === 0 && M > tranh; });
    return hop.length ? r.chon(hop) : tranh * r.chon([2, 3, 4, 5, 10]);
  }
  // Hình lời giải: mỗi lần thử là một ô, ô sáng là lần biến cố xảy ra (nhiều lần quá thì vẽ thanh theo tỉ lệ)
  // Số đáp án chỉ hiện khi em đã xem lời giải (cảnh sang trạng thái giai)
  function hg(tuyChon) { return { widget: 'canh', config: { ten: 'lanThu', tuyChon: Object.assign({ anSo: true }, tuyChon), chiXem: true, t: 1 } }; }
  function hoa(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function tong(m) { return m.reduce(function (s, x) { return s + x; }, 0); }
  // lỗi dạng phân số: bỏ nếu mẫu ≤ 0, trùng đáp án hoặc trùng nhau
  function locPS(cc, dung, m) {
    var thay = [dung], out = [];
    m.forEach(function (l) {
      if (!(l.mau > 0) || l.tu < 0) return;
      var v = l.tu / l.mau;
      if (thay.some(function (x) { return Math.abs(x - v) < 1e-12; })) return;
      thay.push(v); out.push({ gt: cc.phanSo(l.tu, l.mau).ascii, giaiThich: l.giaiThich });
    });
    return out;
  }
  function locSo(dung, m) {
    var thay = [dung];
    return m.filter(function (l) { if (!(l.gt >= 0) || Math.round(l.gt) !== l.gt || thay.indexOf(l.gt) >= 0) return false; thay.push(l.gt); return true; });
  }

  // Bảng tần số "số lượng" 0..m kèm biến cố ngưỡng: { boi, hinh, N, s, sSai, bc, giai[] }
  var BANG = [
    { tieuDe: 'Số cuộc gọi {T} nhận được mỗi ngày', tenNhan: 'Số cuộc gọi', tenSo: 'Số ngày', dt: 'ngày', mo: 'Trong một ngày {T} nhận được', dong: 'nhận được', dv: 'cuộc gọi', boi: '{T} ghi lại số cuộc gọi nhận được mỗi ngày trong một thời gian' },
    { tieuDe: 'Số lỗi trên mỗi sản phẩm', tenNhan: 'Số lỗi', tenSo: 'Số sản phẩm', dt: 'sản phẩm', mo: 'Một sản phẩm có', dong: 'có', dv: 'lỗi', boi: 'Một nhà máy kiểm tra ngẫu nhiên một số sản phẩm và đếm số lỗi trên mỗi sản phẩm' },
    { tieuDe: 'Số bàn thắng mỗi trận của đội bóng', tenNhan: 'Số bàn thắng', tenSo: 'Số trận', dt: 'trận', mo: 'Trong một trận đội bóng ghi được', dong: 'ghi được', dv: 'bàn thắng', boi: 'Một đội bóng thống kê số bàn thắng ghi được trong mỗi trận của mùa giải' },
    { tieuDe: 'Số học sinh đi muộn mỗi ngày', tenNhan: 'Số học sinh đi muộn', tenSo: 'Số ngày', dt: 'ngày', mo: 'Trong một ngày có', dong: 'có', dv: 'học sinh đi muộn', boi: 'Lớp trưởng ghi lại số học sinh đi muộn mỗi ngày trong một thời gian' }];
  function bangTanSo(r, cc) {
    var b = r.chon(BANG), T = r.chon(TEN), m = r.so(4, 6), f = [];
    for (var i = 0; i <= m; i++) f.push(r.so(1, 14));
    var N = tong(f), v = r.so(2, m - 1);
    var loai = r.chon([
      { cum: 'ít nhất ' + v, loc: function (x) { return x >= v; }, sai: function (x) { return x > v; }, vi: '"Ít nhất ' + v + '" là ' + v + ' trở lên, **có** lấy ' + v + '.' },
      { cum: 'nhiều nhất ' + v, loc: function (x) { return x <= v; }, sai: function (x) { return x < v; }, vi: '"Nhiều nhất ' + v + '" là từ 0 đến ' + v + ', **có** lấy ' + v + '.' },
      { cum: 'nhiều hơn ' + v, loc: function (x) { return x > v; }, sai: function (x) { return x >= v; }, vi: '"Nhiều hơn ' + v + '" **không** lấy ' + v + '.' },
      { cum: 'ít hơn ' + v, loc: function (x) { return x < v; }, sai: function (x) { return x <= v; }, vi: '"Ít hơn ' + v + '" **không** lấy ' + v + '.' }]);
    var chon = [], s = 0, sSai = 0, thuanTen = [];
    f.forEach(function (k, x) { if (loai.loc(x)) { chon.push(k); s += k; thuanTen.push(String(x)); } if (loai.sai(x)) sSai += k; });
    var nhan = f.map(function (_, x) { return String(x); });
    var thay = function (t) { return t.replace('{T}', T); };
    return {
      boi: thay(b.boi) + '. Kết quả cho trong bảng và biểu đồ dưới đây.',
      hinh: { widget: 'bieuDo', config: { loai: 'cot', tieuDe: thay(b.tieuDe), tenNhan: b.tenNhan, nhan: nhan, chuoi: [{ ten: b.tenSo, so: f }], hienBang: true } },
      N: N, s: s, sSai: sSai, dt: b.dt, vi: loai.vi,
      hinhGiai: hg({ nhom: f.map(function (k, x) { return { ten: String(x), so: k }; }), nhomThuan: thuanTen, tieuDe: hoa(loai.cum) + ' ' + b.dv }),
      bc: thay(b.mo) + ' ' + loai.cum + ' ' + b.dv,
      giai: ['Tổng số ' + b.dt + ' theo dõi: $' + f.join(' + ') + ' = ' + N + '$.',
        'Số ' + b.dt + ' ' + b.dong + ' ' + loai.cum + ' ' + b.dv + ': $' + (chon.length > 1 ? chon.join(' + ') + ' = ' : '') + s + '$.']
    };
  }

  TOAN8.luyen(32, [
    { ten: 'Xác suất thực nghiệm k/n', muc: 1, sinh: function (r, cc) {
      var ctx = r.chon([
        { de: function (n, k) { return 'Tung một chiếc kẹp giấy ' + n + ' lần xuống sàn lát gạch hình vuông, thấy ' + k + ' lần chiếc kẹp nằm hoàn toàn bên trong một viên gạch.'; }, bc: 'Chiếc kẹp nằm hoàn toàn trong một viên gạch', bu: 'Chiếc kẹp không nằm hoàn toàn trong một viên gạch', n: 'số lần tung' },
        { de: function (n, k) { return 'Bạn ' + r.chon(TEN) + ' ném bóng vào rổ ' + n + ' lần thì có ' + k + ' lần bóng vào rổ.'; }, bc: 'Bóng vào rổ', bu: 'Bóng không vào rổ', n: 'số lần ném' },
        { de: function (n, k) { return 'Gieo ' + n + ' hạt đậu giống, sau một tuần thấy có ' + k + ' hạt nảy mầm.'; }, bc: 'Hạt đậu nảy mầm', bu: 'Hạt đậu không nảy mầm', n: 'số hạt đã gieo' },
        { de: function (n, k) { return 'Theo dõi thời tiết trong ' + n + ' ngày, thấy có ' + k + ' ngày có mưa.'; }, bc: 'Một ngày có mưa', bu: 'Một ngày không có mưa', n: 'số ngày theo dõi' },
        { de: function (n, k) { return 'Kiểm tra ngẫu nhiên ' + n + ' chiếc bóng đèn của một nhà máy, thấy có ' + k + ' chiếc bị lỗi.'; }, bc: 'Một bóng đèn bị lỗi', bu: 'Một bóng đèn không bị lỗi', n: 'số bóng đèn kiểm tra' }]);
      var n = r.chon([20, 25, 40, 50, 60, 80, 100, 120, 150, 200, 250, 400, 500]), k = r.so(Math.round(n * 0.1), Math.round(n * 0.9));
      var hoiBu = r.so(1, 3) === 1, tu = hoiBu ? n - k : k, kq = cc.phanSo(tu, n);
      var loi = [{ tu: tu, mau: n - tu, giaiThich: 'Mẫu số là **' + ctx.n + '** (' + n + '), không phải số lần biến cố không xảy ra.' }];
      if (hoiBu) loi.push({ tu: k, mau: n, giaiThich: 'Đó là xác suất thực nghiệm của biến cố "' + ctx.bc + '". Đề hỏi biến cố ngược lại.' });
      return {
        de: ctx.de(n, k) + ' Tính xác suất thực nghiệm của biến cố "' + (hoiBu ? ctx.bu : ctx.bc) + '".',
        dapAn: { kieu: 'so', gt: kq.ascii },
        hinhGiai: hg({ n: n, k: tu, hat: n + k, tieuDe: hoiBu ? ctx.bu : ctx.bc }),
        goiY: ['Xác suất thực nghiệm $= \\dfrac{k}{n}$: $k$ là số lần biến cố xảy ra, $n$ là ' + ctx.n + '.', hoiBu ? 'Biến cố xảy ra $' + n + ' - ' + k + '$ lần.' : 'Ở đây $n = ' + n + '$.'],
        loiGiai: (hoiBu ? ['Số lần biến cố "' + ctx.bu + '" xảy ra: $' + n + ' - ' + k + ' = ' + (n - k) + '$.'] : ['Biến cố xảy ra $k = ' + k + '$ lần trong $n = ' + n + '$ lần.'])
          .concat(['Xác suất thực nghiệm $= ' + pTex(cc, tu, n) + '$']),
        loiThuongGap: locPS(cc, kq.tu / kq.mau, loi)
      };
    } },

    { ten: 'Thực nghiệm và lí thuyết', muc: 1, sinh: function (r, cc) {
      var xx = r.dau() > 0, n, k, ten, lt;
      if (xx) {
        var mat = r.so(1, 6); n = r.chon([30, 50, 60, 100, 120]); k = Math.round(n / 6) + r.so(-4, 4);
        ten = 'Mặt ' + mat + ' chấm xuất hiện'; lt = [1, 6];
        var de = 'Gieo một con xúc xắc cân đối ' + n + ' lần, thấy mặt ' + mat + ' chấm xuất hiện ' + k + ' lần.';
      } else {
        n = r.chon([20, 40, 50, 80, 100]); k = Math.round(n / 2) + r.so(-5, 5);
        if (k === n / 2) k++;
        ten = 'Đồng xu ra mặt ngửa'; lt = [1, 2];
        de = 'Tung một đồng xu cân đối ' + n + ' lần, thấy có ' + k + ' lần ra mặt ngửa.';
      }
      if (k * lt[1] === n) k++;
      var kq = cc.phanSo(k, n);
      return {
        de: de + ' Tính xác suất thực nghiệm và xác suất của biến cố "' + ten + '".',
        hinhGiai: hg({ n: n, k: k, hat: n + k, p: lt[0] / lt[1], pNhan: '1/' + lt[1], hienP: true, tieuDe: ten }),
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'Xác suất thực nghiệm', kieu: 'so', gt: kq.ascii, loiThuongGap: [{ gt: lt[0] + '/' + lt[1], giaiThich: 'Đó là xác suất tính bằng công thức. Xác suất **thực nghiệm** dùng số liệu thực tế: $\\dfrac{' + k + '}{' + n + '}$.' }] },
          { nhan: 'Xác suất (tính bằng tỉ số)', kieu: 'so', gt: lt[0] + '/' + lt[1], loiThuongGap: locPS(cc, lt[0] / lt[1], [{ tu: k, mau: n, giaiThich: 'Đó là xác suất **thực nghiệm**. Xác suất tính theo các kết quả đồng khả năng: ' + (xx ? '1 trong 6 mặt.' : '1 trong 2 mặt.') }]) }] },
        goiY: ['Xác suất thực nghiệm $= \\dfrac{\\text{số lần biến cố xảy ra}}{\\text{số lần thử}}$.', 'Xác suất tính bằng tỉ số: ' + (xx ? 'xúc xắc có 6 mặt đồng khả năng.' : 'đồng xu có 2 mặt đồng khả năng.')],
        loiGiai: ['Xác suất thực nghiệm: $' + pTex(cc, k, n) + '$.', 'Xác suất: $\\dfrac{1}{' + lt[1] + '}$ (' + (xx ? '6' : '2') + ' kết quả đồng khả năng, 1 kết quả thuận lợi).',
          'Hai số này thường không bằng nhau; số lần thử càng lớn thì xác suất thực nghiệm càng gần xác suất.']
      };
    } },

    { ten: 'Bảng tần số: ít nhất, nhiều nhất', muc: 2, sinh: function (r, cc) {
      var b = bangTanSo(r, cc), kq = cc.phanSo(b.s, b.N);
      return {
        de: b.boi + ' Tính xác suất thực nghiệm của biến cố "' + b.bc + '".',
        hinh: b.hinh,
        hinhGiai: b.hinhGiai,
        dapAn: { kieu: 'so', gt: kq.ascii },
        goiY: ['Mẫu số là **tổng** số ' + b.dt + ' được theo dõi (cộng cả hàng số liệu).', 'Đọc kĩ điều kiện: ' + b.vi.replace(/\*\*/g, '')],
        loiGiai: b.giai.concat(['Xác suất thực nghiệm $= ' + pTex(cc, b.s, b.N) + '$']),
        loiThuongGap: locPS(cc, kq.tu / kq.mau, [{ tu: b.sSai, mau: b.N, giaiThich: b.vi }, { tu: b.s, mau: b.N - b.s, giaiThich: 'Mẫu số là **tổng** số ' + b.dt + ' (' + b.N + '), không phải số ' + b.dt + ' mà biến cố không xảy ra.' }])
      };
    } },

    { ten: 'Bảng kết quả theo loại: "hoặc", "không"', muc: 2, sinh: function (r, cc) {
      // ten: tên loại trong câu; co(i) / khong(i) / hoac(i, j): tên biến cố
      var ctx = r.chon([
        { boi: 'Bạn ' + r.chon(TEN) + ' lấy ngẫu nhiên một quả bóng từ hộp, ghi lại màu rồi trả lại hộp. Lặp lại nhiều lần, kết quả như sau.', tieuDe: 'Màu bóng lấy được', tenNhan: 'Màu', tenSo: 'Số lần',
          loai: ['Xanh', 'Đỏ', 'Vàng', 'Trắng'], ten: ['bóng xanh', 'bóng đỏ', 'bóng vàng', 'bóng trắng'], dt: 'lần lấy', khong: 'Không lấy được ', hoac: 'Lấy được ' },
        { boi: 'Hỏi ngẫu nhiên một số học sinh của trường về môn thể thao yêu thích nhất (mỗi bạn chọn một môn), kết quả như sau.', tieuDe: 'Môn thể thao yêu thích', tenNhan: 'Môn', tenSo: 'Số học sinh',
          loai: ['Bóng đá', 'Cầu lông', 'Bơi', 'Bóng rổ'], ten: ['bóng đá', 'cầu lông', 'bơi', 'bóng rổ'], dt: 'học sinh được hỏi', khong: 'Học sinh được hỏi không thích nhất môn ', hoac: 'Học sinh được hỏi thích nhất môn ' },
        { boi: 'Thống kê cách đến trường của một số học sinh được chọn ngẫu nhiên, kết quả như sau.', tieuDe: 'Cách đến trường', tenNhan: 'Cách đi', tenSo: 'Số học sinh',
          loai: ['Đi bộ', 'Xe đạp', 'Bố mẹ đưa', 'Xe buýt'], ten: ['đi bộ', 'đi xe đạp', 'được bố mẹ đưa', 'đi xe buýt'], dt: 'học sinh được hỏi', khong: 'Học sinh được hỏi không ', hoac: 'Học sinh được hỏi ' }]);
      var f = ctx.loai.map(function () { return r.so(3, 25); }), N = tong(f), ij = r.khacNhau(2, 0, 3).sort(), i = ij[0], j = ij[1];
      var khong = r.dau() > 0, s, bc, giai, loi;
      if (khong) {
        s = N - f[i]; bc = ctx.khong + ctx.ten[i];
        giai = 'Số ' + ctx.dt + ' không thuộc cột "' + ctx.loai[i] + '": $' + N + ' - ' + f[i] + ' = ' + s + '$.';
        loi = [{ tu: f[i], mau: N, giaiThich: 'Đó là xác suất thực nghiệm của cột "' + ctx.loai[i] + '". Đề hỏi biến cố **không** thuộc cột đó.' }];
      } else {
        s = f[i] + f[j]; bc = ctx.hoac + ctx.ten[i] + ' hoặc ' + ctx.ten[j];
        giai = 'Số ' + ctx.dt + ' thuộc cột "' + ctx.loai[i] + '" hoặc "' + ctx.loai[j] + '": $' + f[i] + ' + ' + f[j] + ' = ' + s + '$.';
        loi = [{ tu: f[i], mau: N, giaiThich: '"Hoặc" gồm cả cột "' + ctx.loai[i] + '" **và** cột "' + ctx.loai[j] + '".' }];
      }
      loi.push({ tu: s, mau: N - s, giaiThich: 'Mẫu số là **tổng** số ' + ctx.dt + ' (' + N + ').' });
      var kq = cc.phanSo(s, N);
      var thuanLoai = khong ? ctx.loai.filter(function (x, h) { return h !== i; }) : [ctx.loai[i], ctx.loai[j]];
      return {
        de: ctx.boi + ' Tính xác suất thực nghiệm của biến cố "' + bc + '".',
        hinh: { widget: 'bieuDo', config: { loai: 'cot', tieuDe: ctx.tieuDe, tenNhan: ctx.tenNhan, nhan: ctx.loai, chuoi: [{ ten: ctx.tenSo, so: f }], hienBang: true } },
        dapAn: { kieu: 'so', gt: kq.ascii },
        hinhGiai: hg({ nhom: ctx.loai.map(function (x, h) { return { ten: x, so: f[h] }; }), nhomThuan: thuanLoai, tieuDe: bc }),
        goiY: ['Tính tổng số ' + ctx.dt + ' (cộng cả hàng số liệu): đó là mẫu số.', khong ? 'Lấy tổng trừ đi số liệu của cột "' + ctx.loai[i] + '".' : 'Cộng số liệu của hai cột "' + ctx.loai[i] + '" và "' + ctx.loai[j] + '".'],
        loiGiai: ['Tổng số ' + ctx.dt + ': $' + f.join(' + ') + ' = ' + N + '$.', giai, 'Xác suất thực nghiệm $= ' + pTex(cc, s, N) + '$'],
        loiThuongGap: locPS(cc, kq.tu / kq.mau, loi)
      };
    } },

    { ten: 'Dự đoán số lần xảy ra', muc: 2, sinh: function (r, cc) {
      var ctx = r.chon([
        { de: function (n, k, M) { return 'Hỏi ngẫu nhiên ' + n + ' học sinh của một trường thì có ' + k + ' bạn thích đọc truyện tranh. Trường có $' + so(M) + '$ học sinh. Hãy dự đoán trường có khoảng bao nhiêu học sinh thích đọc truyện tranh.'; }, dt: 'học sinh', bc: 'một học sinh thích đọc truyện tranh', bu: 'không thích' },
        { de: function (n, k, M) { return 'Kiểm tra ngẫu nhiên ' + n + ' bóng đèn thì thấy ' + k + ' bóng bị hỏng. Trong một lô $' + so(M) + '$ bóng đèn cùng loại, hãy dự đoán có khoảng bao nhiêu bóng bị hỏng.'; }, dt: 'bóng', bc: 'một bóng đèn bị hỏng', bu: 'không hỏng' },
        { de: function (n, k, M) { return 'Một xạ thủ bắn ' + n + ' viên đạn thì có ' + k + ' viên trúng hồng tâm. Nếu xạ thủ bắn tiếp $' + so(M) + '$ viên, hãy dự đoán có khoảng bao nhiêu viên trúng hồng tâm.'; }, dt: 'viên', bc: 'một viên đạn trúng hồng tâm', bu: 'không trúng' },
        { de: function (n, k, M) { return 'Gieo thử ' + n + ' hạt giống thì có ' + k + ' hạt nảy mầm. Nếu gieo $' + so(M) + '$ hạt giống cùng loại, hãy dự đoán có khoảng bao nhiêu hạt nảy mầm.'; }, dt: 'hạt', bc: 'một hạt nảy mầm', bu: 'không nảy mầm' }]);
      var n = r.chon([20, 25, 40, 50, 80, 100, 200, 250, 400, 500]), k = r.so(Math.round(n * 0.05), Math.round(n * 0.9)), p = cc.phanSo(k, n);
      var M = chonM(r, p.mau, [100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000], n);
      var kq = M * p.tu / p.mau;
      return {
        de: ctx.de(n, k, M),
        dapAn: { kieu: 'so', gt: kq },
        hinhGiai: hg({ n: n, k: k, duBao: M, nhan1: n + ' ' + ctx.dt + ' đã biết', nhan2: M + ' ' + ctx.dt + ' cần dự đoán', tenCo: hoa(ctx.bc.replace(/^một /, '')), donVi: ctx.dt }),
        goiY: ['Ước lượng xác suất của biến cố "' + ctx.bc + '" bằng xác suất thực nghiệm $\\dfrac{' + k + '}{' + n + '}$.', 'Số lần dự đoán = số lượng mới $\\times$ xác suất.'],
        loiGiai: ['Xác suất của biến cố "' + ctx.bc + '" được ước lượng là $' + pTex(cc, k, n) + '$.', 'Số ' + ctx.dt + ' dự đoán $\\approx ' + so(M) + ' \\cdot ' + p.tex + ' = ' + so(kq) + '$'],
        loiThuongGap: locSo(kq, [{ gt: M - kq, giaiThich: 'Đó là số ' + ctx.dt + ' **' + ctx.bu + '**. Em xem lại đề hỏi biến cố nào.' }, { gt: Math.round(M * p.mau / p.tu), giaiThich: 'Dự đoán thì **nhân** với xác suất, không chia.' }])
      };
    } },

    { ten: 'Lô hàng, khảo sát: dự đoán phần còn lại', muc: 3, sinh: function (r, cc) {
      var ctx = r.chon([
        { vat: 'chiếc điều hoà', mo: 'Nhà máy kiểm tra {n} chiếc điều hoà thì thấy {k} chiếc bị lỗi. Trong lô hàng $' + '{M}' + '$ chiếc, hãy dự đoán có khoảng bao nhiêu chiếc **không** bị lỗi.', a: 'bị lỗi', b: 'không bị lỗi' },
        { vat: 'linh kiện', mo: 'Kiểm tra {n} linh kiện thì thấy {k} linh kiện bị lỗi. Trong $' + '{M}' + '$ linh kiện sản xuất ra, hãy dự đoán có khoảng bao nhiêu linh kiện **đạt** (không bị lỗi).', a: 'bị lỗi', b: 'đạt' },
        { vat: 'người', mo: 'Khảo sát ngẫu nhiên {n} người dân của một phường thì có {k} người chưa từng đi xe buýt. Phường có $' + '{M}' + '$ người, hãy dự đoán có khoảng bao nhiêu người **đã từng** đi xe buýt.', a: 'chưa từng đi xe buýt', b: 'đã từng đi xe buýt' },
        { vat: 'hạt', mo: 'Gieo thử {n} hạt giống thì có {k} hạt không nảy mầm. Nếu gieo $' + '{M}' + '$ hạt cùng loại, hãy dự đoán có khoảng bao nhiêu hạt **nảy mầm**.', a: 'không nảy mầm', b: 'nảy mầm' }]);
      var n = r.chon([50, 80, 100, 200, 250, 400, 500, 800, 1000]), k = r.so(Math.max(1, Math.round(n * 0.01)), Math.round(n * 0.3)), p = cc.phanSo(k, n);
      var M = chonM(r, p.mau, [500, 600, 800, 1000, 1200, 1500, 2000, 2400, 2500, 3000, 4000, 5000, 6000, 8000, 10000], n);
      var a = M * p.tu / p.mau, kq = M - a;
      return {
        de: ctx.mo.replace('{n}', '$' + so(n) + '$').replace('{k}', k).replace('{M}', so(M)),
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Trước hết ước lượng xác suất ' + ctx.a + ' bằng $\\dfrac{' + k + '}{' + so(n) + '}$ rồi dự đoán số ' + ctx.vat + ' ' + ctx.a + '.', 'Số ' + ctx.vat + ' ' + ctx.b + ' = tổng số − số ' + ctx.vat + ' ' + ctx.a + '.'],
        loiGiai: ['Xác suất ' + ctx.a + ' được ước lượng là $' + pTex(cc, k, n) + '$.', 'Số ' + ctx.vat + ' ' + ctx.a + ' khoảng $' + so(M) + ' \\cdot ' + p.tex + ' = ' + so(a) + '$.',
          'Số ' + ctx.vat + ' ' + ctx.b + ' khoảng $' + so(M) + ' - ' + so(a) + ' = ' + so(kq) + '$'],
        loiThuongGap: locSo(kq, [{ gt: a, giaiThich: '$' + so(a) + '$ là số ' + ctx.vat + ' **' + ctx.a + '**. Đề hỏi số ' + ctx.vat + ' ' + ctx.b + ': lấy tổng trừ đi.' }])
      };
    } },

    { ten: 'Bảng tần số rồi dự đoán', muc: 3, sinh: function (r, cc) {
      var b = bangTanSo(r, cc), p = cc.phanSo(b.s, b.N);
      var M = chonM(r, p.mau, [2, 3, 4, 5, 10].map(function (j) { return b.N * j; }), b.N), cuoi = b.dt === 'sản phẩm' ? 'sản phẩm khác' : b.dt + ' tới';
      var kq = M * p.tu / p.mau, sai = M * b.sSai / b.N;
      return {
        de: b.boi + ' Dựa vào bảng, hãy dự đoán trong $' + so(M) + '$ ' + cuoi + ' có khoảng bao nhiêu ' + b.dt + ' xảy ra biến cố "' + b.bc + '".',
        hinh: b.hinh,
        dapAn: { kieu: 'so', gt: kq },
        goiY: ['Tính xác suất thực nghiệm của biến cố từ bảng: số ' + b.dt + ' thoả mãn chia cho tổng số ' + b.dt + '.', 'Dự đoán = $' + so(M) + '$ $\\times$ xác suất vừa tính.'],
        loiGiai: b.giai.concat(['Xác suất của biến cố được ước lượng là $' + pTex(cc, b.s, b.N) + '$.', 'Số ' + b.dt + ' dự đoán $\\approx ' + so(M) + ' \\cdot ' + p.tex + ' = ' + so(kq) + '$']),
        loiThuongGap: locSo(kq, [{ gt: sai, giaiThich: b.vi }, { gt: M - kq, giaiThich: 'Đó là số ' + b.dt + ' mà biến cố **không** xảy ra.' }])
      };
    } }
  ]);
})();
