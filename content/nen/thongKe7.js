// Bài nền (lớp 7): Thu thập, phân loại dữ liệu; biểu đồ hình quạt tròn, biểu đồ đoạn thẳng – cần cho Chương V.
(function () {
  'use strict';
  var DINH_TINH = ['Màu sắc yêu thích', 'Môn thể thao yêu thích', 'Xếp loại học lực (Tốt, Khá, Đạt, Chưa đạt)', 'Nơi sinh', 'Phương tiện đến trường', 'Loại trái cây yêu thích', 'Mức độ hài lòng (Rất hài lòng, Hài lòng, Không hài lòng)'];
  var DINH_LUONG = ['Chiều cao (cm)', 'Cân nặng (kg)', 'Điểm kiểm tra môn Toán', 'Số anh chị em ruột', 'Thời gian tự học mỗi ngày (phút)', 'Số quyển sách đọc trong tháng', 'Số bước chân đi bộ mỗi ngày'];
  var MON = [
    { tieuDe: 'Môn thể thao yêu thích của học sinh lớp 7A', nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], ai: 'học sinh' },
    { tieuDe: 'Phương tiện đến trường của học sinh khối 7', nhan: ['Đi bộ', 'Xe đạp', 'Xe buýt', 'Bố mẹ đưa'], ai: 'học sinh' },
    { tieuDe: 'Loại trái cây được ưa thích nhất', nhan: ['Cam', 'Xoài', 'Chuối', 'Dưa hấu'], ai: 'người' }];

  TOAN8.nen({
    id: 'thongKe7', ten: 'Thu thập, phân loại dữ liệu và biểu đồ', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Dữ liệu và phân loại',
        noiDung: '**Dữ liệu định tính**: được mô tả bằng chữ (tên, màu sắc, xếp loại…), ví dụ: môn học yêu thích, nơi sinh.\n\n**Dữ liệu định lượng**: là các **số** (đo, đếm được), ví dụ: chiều cao, số anh chị em.\n\n**Tính hợp lí** của dữ liệu: dữ liệu phải đúng phạm vi (tuổi học sinh lớp 7 không thể là $40$; tỉ lệ phần trăm không vượt quá $100\\%$; tổng các phần phải bằng tổng thể).' },
      { loai: 'dinhNghia', tieuDe: 'Biểu đồ hình quạt tròn',
        noiDung: 'Cả hình tròn biểu diễn **tổng thể** ($100\\%$); mỗi hình quạt biểu diễn **tỉ lệ** của một phần. Tổng các tỉ lệ bằng $100\\%$.\n\nTỉ lệ một phần $= \\frac{\\text{số lượng phần đó}}{\\text{tổng số}} \\cdot 100\\%$; ngược lại, số lượng $=$ tổng số $\\cdot$ tỉ lệ.' },
      { loai: 'hinh', widget: 'bieuDo', config: { loai: 'tron', tieuDe: 'Môn thể thao yêu thích của 40 bạn lớp 7A', nhan: ['Bóng đá', 'Cầu lông', 'Bơi lội', 'Cờ vua'], chuoi: [{ ten: 'Số bạn', so: [16, 10, 8, 6] }], donVi: 'bạn' },
        chuThich: 'Bóng đá chiếm $40\\%$ của $40$ bạn, tức là $40 \\cdot 40\\% = 16$ bạn.' },
      { loai: 'dinhNghia', tieuDe: 'Biểu đồ đoạn thẳng',
        noiDung: 'Dùng để biểu diễn **sự thay đổi của một đại lượng theo thời gian**. Trục ngang ghi thời điểm, trục đứng ghi giá trị; các điểm được nối bằng đoạn thẳng. Đoạn đi lên là **tăng**, đi xuống là **giảm**.' }
    ],
    viDu: [
      { de: 'Biểu đồ hình quạt tròn cho biết $30\\%$ học sinh lớp 7B (có $40$ bạn) thích môn Toán nhất. Có bao nhiêu bạn thích môn Toán nhất?', buoc: [
        { lam: '$40 \\cdot 30\\% = 40 \\cdot \\frac{30}{100} = 12$ (bạn)', vi: 'Số lượng một phần bằng tổng số nhân với tỉ lệ của phần đó.' }] },
      { de: 'Lớp có $25$ bạn, trong đó $10$ bạn đi xe đạp đến trường. Số bạn đi xe đạp chiếm bao nhiêu phần trăm?', buoc: [
        { lam: '$\\frac{10}{25} \\cdot 100\\% = 40\\%$', vi: 'Tỉ lệ một phần bằng số lượng phần đó chia cho tổng số, nhân $100\\%$.' }] }
    ],
    luyen: [
      { ten: 'Dữ liệu định tính hay định lượng', muc: 1, sinh: function (r) {
        var tinh = r.dau() > 0, dl = r.chon(tinh ? DINH_TINH : DINH_LUONG);
        return {
          de: 'Khi điều tra các bạn trong lớp, dữ liệu "' + dl + '" là dữ liệu định tính hay định lượng?',
          dapAn: { kieu: 'chon', gt: tinh ? 0 : 1, luaChon: ['Dữ liệu định tính', 'Dữ liệu định lượng'] },
          goiY: ['Dữ liệu định lượng là các **số** (đo hoặc đếm được).', 'Câu trả lời của mỗi bạn là một con số hay là chữ (tên, loại, mức độ)?'],
          loiGiai: [tinh ? 'Câu trả lời là chữ (tên gọi, loại, mức độ), không phải số đo hay số đếm, nên đây là **dữ liệu định tính**.' : 'Câu trả lời là một **số** (đo hoặc đếm được) nên đây là **dữ liệu định lượng**.']
        };
      } },
      { ten: 'Đọc biểu đồ hình quạt tròn', muc: 2, sinh: function (r) {
        var m = r.chon(MON), p;
        do { p = [5 * r.so(2, 10), 5 * r.so(2, 8), 5 * r.so(1, 6)]; } while (p[0] + p[1] + p[2] > 90);
        p.push(100 - p[0] - p[1] - p[2]);
        var i = r.so(0, 3);
        if (r.dau() > 0) {
          var N = r.chon([20, 40, 60, 80, 100, 120, 200]), kq = N * p[i] / 100;
          var ltg = p[i] !== kq ? [{ gt: p[i], giaiThich: 'Đó là **tỉ lệ phần trăm**. Số ' + m.ai + ' $= ' + N + ' \\cdot ' + p[i] + '\\%$.' }] : [];
          return {
            de: 'Biểu đồ dưới đây cho biết tỉ lệ ' + m.tieuDe.charAt(0).toLowerCase() + m.tieuDe.slice(1) + '. Có tất cả $' + N + '$ ' + m.ai + ' được hỏi. Có bao nhiêu ' + m.ai + ' chọn **' + m.nhan[i] + '**?',
            hinh: { widget: 'bieuDo', config: { loai: 'tron', tieuDe: m.tieuDe, nhan: m.nhan, chuoi: [{ ten: 'Tỉ lệ (%)', so: p }] } },
            dapAn: { kieu: 'so', gt: kq },
            goiY: ['Đọc tỉ lệ phần trăm của ' + m.nhan[i] + ' trên biểu đồ.', 'Số lượng $=$ tổng số $\\cdot$ tỉ lệ.'],
            loiGiai: [m.nhan[i] + ' chiếm $' + p[i] + '\\%$.', '$' + N + ' \\cdot ' + p[i] + '\\% = ' + N + ' \\cdot \\frac{' + p[i] + '}{100} = ' + kq + '$'],
            loiThuongGap: ltg
          };
        }
        var biet = [0, 1, 2, 3].filter(function (k) { return k !== i; });
        return {
          de: 'Trong biểu đồ hình quạt tròn về ' + m.tieuDe.charAt(0).toLowerCase() + m.tieuDe.slice(1) + ', ' + biet.map(function (k) { return m.nhan[k] + ' chiếm $' + p[k] + '\\%$'; }).join(', ') + '. ' + m.nhan[i] + ' chiếm bao nhiêu phần trăm?',
          dapAn: { kieu: 'so', gt: p[i] },
          goiY: ['Cả hình tròn là $100\\%$.', 'Lấy $100\\%$ trừ đi tổng các phần đã biết.'],
          loiGiai: ['Tổng các phần đã biết: $' + biet.map(function (k) { return p[k]; }).join(' + ') + ' = ' + (100 - p[i]) + '$ (%).', '$100 - ' + (100 - p[i]) + ' = ' + p[i] + '$ (%).']
        };
      } },
      { ten: 'Đọc biểu đồ đoạn thẳng', muc: 2, sinh: function (r) {
        var ngu = r.chon([
          { tieuDe: 'Nhiệt độ trung bình các tháng (°C)', nhan: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6'], ten: 'Nhiệt độ (°C)', min: 14, max: 34, buoc: 1, dv: '°C' },
          { tieuDe: 'Số sách thư viện cho mượn trong tuần', nhan: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'], ten: 'Số sách', min: 10, max: 60, buoc: 5, dv: 'quyển' },
          { tieuDe: 'Doanh thu của cửa hàng (triệu đồng)', nhan: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6'], ten: 'Doanh thu', min: 20, max: 80, buoc: 5, dv: 'triệu đồng' }]);
        var so;
        do { so = ngu.nhan.map(function () { return ngu.min + ngu.buoc * r.so(0, (ngu.max - ngu.min) / ngu.buoc); }); }
        while (so.some(function (v, k) { return k > 0 && v === so[k - 1]; }) || so.filter(function (v) { return v === Math.max.apply(null, so); }).length > 1);
        var hinh = { widget: 'bieuDo', config: { loai: 'duong', tieuDe: ngu.tieuDe, nhan: ngu.nhan, chuoi: [{ ten: ngu.ten, so: so }] } };
        if (r.dau() > 0) {
          var k = r.so(0, 4), d = so[k + 1] - so[k], tang = d > 0;
          return {
            de: 'Quan sát biểu đồ. Từ ' + ngu.nhan[k] + ' đến ' + ngu.nhan[k + 1] + ', ' + ngu.ten.toLowerCase().replace(/ \(.*\)/, '') + ' **' + (tang ? 'tăng' : 'giảm') + '** bao nhiêu ' + ngu.dv + '?',
            hinh: hinh,
            dapAn: { kieu: 'so', gt: Math.abs(d) },
            goiY: ['Đọc giá trị tại ' + ngu.nhan[k] + ' và tại ' + ngu.nhan[k + 1] + '.', 'Lấy số lớn trừ số bé.'],
            loiGiai: [ngu.nhan[k] + ': $' + so[k] + '$; ' + ngu.nhan[k + 1] + ': $' + so[k + 1] + '$.', tang ? '$' + so[k + 1] + ' - ' + so[k] + ' = ' + d + '$' : '$' + so[k] + ' - ' + so[k + 1] + ' = ' + (-d) + '$']
          };
        }
        var lon = Math.max.apply(null, so), vt = so.indexOf(lon);
        return {
          de: 'Quan sát biểu đồ. Thời điểm nào có ' + ngu.ten.toLowerCase().replace(/ \(.*\)/, '') + ' **cao nhất**?',
          hinh: hinh,
          dapAn: { kieu: 'chon', gt: vt, luaChon: ngu.nhan },
          goiY: ['Tìm điểm cao nhất trên biểu đồ đoạn thẳng.', 'Đọc nhãn trên trục ngang ứng với điểm đó.'],
          loiGiai: ['Điểm cao nhất ứng với ' + ngu.nhan[vt] + ' (giá trị $' + lon + '$).']
        };
      } },
      { ten: 'Tính tỉ lệ phần trăm từ bảng', muc: 3, sinh: function (r) {
        var m = r.chon(MON), N = r.chon([20, 25, 40, 50]), so;
        do {
          so = [r.so(1, N / 2), r.so(1, N / 2), r.so(1, N / 3)];
        } while (so[0] + so[1] + so[2] >= N);
        so.push(N - so[0] - so[1] - so[2]);
        var i = r.so(0, 3), kq = so[i] * 100 / N;
        var ltg = so[i] !== kq ? [{ gt: so[i], giaiThich: 'Đó là **số lượng**. Tỉ lệ $= \\frac{' + so[i] + '}{' + N + '} \\cdot 100\\%$.' }] : [];
        return {
          de: 'Kết quả khảo sát ' + m.tieuDe.charAt(0).toLowerCase() + m.tieuDe.slice(1) + ': ' + m.nhan.map(function (n, k) { return n + ': $' + so[k] + '$'; }).join('; ') + '. Nếu vẽ biểu đồ hình quạt tròn thì phần **' + m.nhan[i] + '** chiếm bao nhiêu phần trăm?',
          dapAn: { kieu: 'so', gt: kq },
          goiY: ['Tính tổng số ' + m.ai + ' được khảo sát trước.', 'Tỉ lệ $= \\frac{\\text{số lượng}}{\\text{tổng số}} \\cdot 100\\%$.'],
          loiGiai: ['Tổng số: $' + so.join(' + ') + ' = ' + N + '$.', '$\\frac{' + so[i] + '}{' + N + '} \\cdot 100 = ' + String(kq).replace('.', '{,}') + '$ (%)'],
          loiThuongGap: ltg
        };
      } }
    ]
  });
})();
