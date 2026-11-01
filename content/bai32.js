// Bài 32 – Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng (SGK Toán 8 KNTT, Tập 2, tr. 67–73)
(function () {
  'use strict';

  // Bảng tần số dạng biểu đồ cột kèm bảng số liệu
  function bang(tieuDe, tenNhan, nhan, tenSo, so) {
    return { widget: 'bieuDo', config: { loai: 'cot', tieuDe: tieuDe, tenNhan: tenNhan, nhan: nhan, chuoi: [{ ten: tenSo, so: so }], hienBang: true } };
  }

  var cuocGoi = bang('Số cuộc gọi ông An nhận mỗi ngày (59 ngày)', 'Số cuộc gọi', ['0', '1', '2', '3', '4', '5', '6', '7', '8'], 'Số ngày', [5, 9, 15, 10, 5, 6, 4, 2, 3]);
  var diemThi = bang('Điểm kiểm tra của 100 học sinh', 'Điểm', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'Số học sinh', [2, 5, 8, 10, 15, 18, 17, 12, 8, 5]);
  var haiXucXac = bang('Kết quả 100 lần gieo hai xúc xắc của Mai', 'Tổng số chấm', ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'Số lần', [3, 6, 8, 11, 13, 17, 14, 10, 8, 6, 4]);

  TOAN8.bai({
    id: 32, ten: 'Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng', sgk: { tap: 2, trang: 67 },

    khamPha: {
      nhiemVu: 'Túi có 5 viên bi cùng kích thước: **3 bi đỏ** và **2 bi xanh**. **Trước khi bấm**, em hãy đoán: nếu lấy bi (rồi trả lại) thật nhiều lần thì tỉ lệ số lần lấy được bi đỏ sẽ gần số nào? Sau đó bấm **Thử 10 lần**, rồi **Thử 100 lần**, **Thử 1000 lần** vài lượt. Đường đỏ lúc đầu nhảy lung tung, về sau thì sao?',
      widget: 'xacSuat',
      config: { loai: 'tui', tui: [{ ten: 'Đỏ', so: 3, mau: '#e03131' }, { ten: 'Xanh', so: 2, mau: '#1971c2' }], suKien: { ten: 'Lấy được bi đỏ', thuanLoi: ['Đỏ'] }, anLiThuyet: true },
      cauHoi: {
        de: 'Khi số lần thử rất lớn, xác suất thực nghiệm của biến cố "Lấy được bi đỏ" tiến dần về số nào? (Đó chính là xác suất của biến cố này.)',
        dapAn: { kieu: 'so', gt: '3/5' },
        goiY: ['Dùng công thức ở Bài 31: số kết quả thuận lợi chia cho tổng số kết quả có thể.', 'Có 5 viên bi đồng khả năng, trong đó 3 viên đỏ.'],
        loiGiai: [
          'Xác suất của biến cố: $P = \\dfrac{3}{5} = 0{,}6$.',
          'Khi thử ít lần, tỉ lệ $\\dfrac{k}{n}$ có thể khác xa $0{,}6$. Thử càng nhiều lần, tỉ lệ càng **gần** $0{,}6$.',
          'Vậy xác suất thực nghiệm tiến về $\\dfrac{3}{5}$. Ngược lại, khi không tính được xác suất bằng công thức, ta dùng xác suất thực nghiệm để **ước lượng** nó.'
        ]
      }
    },

    lyThuyet: [
      { loai: 'dinhNghia', tieuDe: '1. Xác suất thực nghiệm của một biến cố',
        noiDung: 'Giả sử trong $\\cb{n}$ lần thực nghiệm hoặc $\\cb{n}$ lần theo dõi (quan sát) một hiện tượng, ta thấy biến cố $E$ xảy ra $\\cc{k}$ lần. Khi đó **xác suất thực nghiệm** của biến cố $E$ bằng $\\dfrac{\\cc{k}}{\\cb{n}}$:\n\ntỉ số giữa **số lần xuất hiện biến cố $E$** và **số lần thực hiện thực nghiệm** (hoặc theo dõi hiện tượng).' },
      { loai: 'hinh', widget: cuocGoi.widget, config: cuocGoi.config,
        chuThich: 'Ông An theo dõi 59 ngày. Biến cố $A$: "Trong một ngày ông nhận được **nhiều hơn 6** cuộc gọi" xảy ra vào các ngày có 7 hoặc 8 cuộc gọi: $2 + 3 = 5$ ngày. Xác suất thực nghiệm của $A$ là $\\dfrac{5}{59}$.' },
      { loai: 'dinhLi', tieuDe: '2. Mối liên hệ với xác suất',
        noiDung: 'Nhiều tình huống **không** có các kết quả đồng khả năng (tắc đường, ti vi hỏng, trẻ sơ sinh là bé gái…), nên không dùng được công thức tỉ số ở Bài 31. Khi đó:\n\nXác suất của biến cố $E$ được **ước lượng** bằng xác suất thực nghiệm của $E$:\n\n$$P(E) \\approx \\dfrac{\\cc{k}}{\\cb{n}},$$\n\ntrong đó $\\cb{n}$ là số lần thực nghiệm hay theo dõi, $\\cc{k}$ là số lần biến cố $E$ xảy ra.' },
      { loai: 'hinh', widget: 'xacSuat', config: { loai: 'dongXu', suKien: { ten: 'Mặt ngửa', thuanLoi: ['N'] } },
        chuThich: 'Tung đồng xu: xác suất ra mặt ngửa là $\\dfrac{1}{2}$ (đường xanh lá đứt nét). Bấm **Thử 10 lần** thì tỉ lệ có thể là $0{,}3$ hay $0{,}7$; bấm thêm nhiều lần, đường đỏ **càng ngày càng sát** đường xanh. Số lần thử $n$ càng lớn thì ước lượng $P(E) \\approx \\dfrac{k}{n}$ càng đáng tin.' },
      { loai: 'dinhLi', tieuDe: '3. Ứng dụng: dự báo',
        noiDung: 'Xác suất thực nghiệm dùng để **dự báo** số lần xảy ra một sự kiện trong tương lai.\n\nNếu $P(E) \\approx p$ thì trong $m$ lần tới, biến cố $E$ xảy ra khoảng $m \\cdot p$ lần.\n\nVí dụ: kiểm tra 100 sản phẩm thấy 62 sản phẩm không lỗi, nên $P \\approx 0{,}62$. Kiểm tra 120 sản phẩm khác thì có khoảng $120 \\cdot 0{,}62 = 74{,}4$, tức **khoảng 74** sản phẩm không lỗi.' },
      { loai: 'chuY', tieuDe: 'Hay nhầm',
        noiDung: 'Mẫu số là **tổng số lần** thực nghiệm $n$, không phải số lần biến cố **không** xảy ra.\n\nKhi dự báo thì **nhân** với xác suất: $m \\cdot p$, không phải chia $m : p$.\n\nKết quả dự báo là **số lượng** (người, ngày, sản phẩm) nên làm tròn thành số tự nhiên và nói "**khoảng**".\n\nĐọc kĩ bảng: "ít nhất 5" gồm 5, 6, 7…; "nhiều nhất 3" gồm 0, 1, 2, 3.' }
    ],

    viDu: [
      { de: 'Dùng bảng số cuộc gọi của ông An trong 59 ngày (xem phần Lý thuyết: 0 cuộc: 5 ngày; 1: 9; 2: 15; 3: 10; 4: 5; 5: 6; 6: 4; 7: 2; 8: 3). Tính xác suất thực nghiệm của $E$: "Trong một ngày ông An nhận được ít nhất 5 cuộc gọi" và $F$: "… nhiều nhất 3 cuộc gọi".', buoc: [
        { lam: 'Số ngày có ít nhất 5 cuộc gọi: $6 + 4 + 2 + 3 = 15$ ngày. Xác suất thực nghiệm của $E$ là $\\dfrac{15}{59}$.', vi: '"Ít nhất 5" là 5, 6, 7 hoặc 8 cuộc. Mẫu số là tổng số ngày theo dõi: 59.' },
        { lam: 'Số ngày có nhiều nhất 3 cuộc gọi: $5 + 9 + 15 + 10 = 39$ ngày. Xác suất thực nghiệm của $F$ là $\\dfrac{39}{59}$.', vi: '"Nhiều nhất 3" là 0, 1, 2 hoặc 3 cuộc (có cả ngày không có cuộc nào).' } ] },
      { de: 'Kiểm tra ngẫu nhiên 500 chiếc ti vi của nhà máy X thì có 4 chiếc không đạt chất lượng. Ước lượng xác suất để một ti vi của nhà máy X không đạt chất lượng.', buoc: [
        { lam: 'Trong $n = 500$ lần quan sát, biến cố xảy ra $k = 4$ lần.', vi: 'Ti vi đạt hay không đạt **không** đồng khả năng, nên phải dùng số liệu thực tế.' },
        { lam: '$\\dfrac{4}{500} = 0{,}008 = 0{,}8\\%$. Vậy xác suất được ước lượng là $0{,}8\\%$.', vi: 'Xác suất thực nghiệm $\\dfrac{k}{n}$ dùng để ước lượng xác suất.' } ] },
      { de: 'Trong 240 000 trẻ sơ sinh có 123 120 bé trai. Ước lượng xác suất của biến cố "Trẻ sơ sinh là bé gái".', buoc: [
        { lam: 'Số bé gái: $240\\,000 - 123\\,120 = 116\\,880$.', vi: 'Biến cố hỏi bé **gái**, không phải bé trai.' },
        { lam: '$\\dfrac{116\\,880}{240\\,000} = 0{,}487$. Vậy xác suất được ước lượng là $0{,}487$ (khoảng $48{,}7\\%$).', vi: 'Chia số lần biến cố xảy ra cho tổng số trẻ được theo dõi.' } ] },
      { de: 'Kiểm tra 100 linh kiện: 62 cái không lỗi, 35 cái có đúng 1 lỗi, 3 cái có nhiều hơn 1 lỗi. Nếu kiểm tra 120 linh kiện khác, dự đoán có bao nhiêu linh kiện có đúng 1 lỗi?', buoc: [
        { lam: 'Xác suất linh kiện có đúng 1 lỗi được ước lượng: $P \\approx \\dfrac{35}{100} = 0{,}35$.', vi: 'Dùng số liệu 100 linh kiện đã kiểm tra.' },
        { lam: 'Gọi $h$ là số linh kiện có đúng 1 lỗi trong 120 cái: $\\dfrac{h}{120} \\approx 0{,}35$.', vi: 'Tỉ lệ trong lần kiểm tra mới cũng xấp xỉ xác suất.' },
        { lam: '$h \\approx 120 \\cdot 0{,}35 = 42$. Dự đoán có khoảng 42 linh kiện có đúng 1 lỗi.', vi: 'Dự báo = số lần $\\times$ xác suất.' } ] }
    ],

    viDuMo: [
      { de: 'Camera theo dõi một con đường trong 365 ngày, ghi nhận 217 ngày tắc đường vào giờ cao điểm buổi chiều. Ước lượng xác suất của biến cố "Tắc đường vào giờ cao điểm buổi chiều" (làm tròn đến hàng phần trăm).', buoc: [
        { lam: 'Ta có $n = 365$ ngày theo dõi, biến cố xảy ra $k = 217$ ngày.', vi: 'Không thể tính bằng công thức tỉ số vì "tắc" và "không tắc" không đồng khả năng.' },
        { lam: '$P \\approx \\dfrac{217}{365} \\approx 0{,}59$', vi: 'Em hãy tính xác suất thực nghiệm:', an: true,
          dapAn: { kieu: 'so', gt: '217/365', saiSo: 0.005 },
          loiThuongGap: [{ gt: '217/148', giaiThich: 'Mẫu số là **tổng** số ngày theo dõi (365), không phải số ngày không tắc (148).' }] } ] },
      { de: 'Nhà máy kiểm tra 800 chiếc điều hoà thì thấy 6 chiếc bị lỗi. Trong lô hàng 2 000 chiếc, dự đoán có khoảng bao nhiêu chiếc **không** bị lỗi?', buoc: [
        { lam: 'Xác suất một chiếc bị lỗi: $P \\approx \\dfrac{6}{800}$. Số chiếc bị lỗi trong lô: khoảng $2000 \\cdot \\dfrac{6}{800} = 15$ chiếc.', vi: 'Dự báo = số lượng $\\times$ xác suất.' },
        { lam: 'Số chiếc không bị lỗi: khoảng $2000 - 15 = 1985$ chiếc.', vi: 'Em hãy tính số chiếc không bị lỗi:', an: true,
          dapAn: { kieu: 'so', gt: 1985 },
          loiThuongGap: [{ gt: 15, giaiThich: '15 là số chiếc **bị lỗi**. Đề hỏi số chiếc **không** bị lỗi: $2000 - 15$.' }] } ] }
    ],

    baiTap: [
      { id: '32.1', muc: 1, de: 'Tung một chiếc kẹp giấy 160 lần xuống sàn lát gạch hình vuông, thấy 120 lần chiếc kẹp nằm hoàn toàn bên trong một viên gạch. Tính xác suất thực nghiệm của biến cố "Chiếc kẹp nằm hoàn toàn trong viên gạch".',
        dapAn: { kieu: 'so', gt: '3/4' },
        goiY: ['Xác suất thực nghiệm $= \\dfrac{k}{n}$: $k$ là số lần biến cố xảy ra, $n$ là tổng số lần tung.', '$k = 120$, $n = 160$.'],
        loiGiai: ['Tung $n = 160$ lần, biến cố xảy ra $k = 120$ lần.', 'Xác suất thực nghiệm $= \\dfrac{120}{160} = \\dfrac{3}{4}$'],
        loiThuongGap: [
          { gt: 3, giaiThich: 'Em chia 120 cho 40 (số lần không xảy ra). Mẫu số phải là tổng số lần tung: 160.' },
          { gt: '1/4', giaiThich: '$\\frac{40}{160}$ là tỉ lệ số lần kẹp **không** nằm hoàn toàn trong viên gạch.' }] },

      { id: '32.2', muc: 1, de: 'Kiểm tra ngẫu nhiên 400 bóng đèn của một nhà máy thấy có 6 bóng hỏng. Ước lượng xác suất để một bóng đèn của nhà máy bị hỏng (có thể ghi phân số, số thập phân hoặc phần trăm).',
        dapAn: { kieu: 'so', gt: '3/200' },
        goiY: ['$n = 400$ bóng được kiểm tra, $k = 6$ bóng hỏng.', '$P \\approx \\dfrac{6}{400}$. Đổi ra số thập phân hoặc phần trăm.'],
        loiGiai: ['$P \\approx \\dfrac{6}{400} = 0{,}015 = 1{,}5\\%$.', 'Vậy $P \\approx \\dfrac{6}{400} = \\dfrac{3}{200}$'],
        loiThuongGap: [{ gt: '6/394', giaiThich: 'Mẫu số là tổng số bóng được kiểm tra (400), không phải số bóng tốt (394).' }] },

      { id: '32.3', muc: 1, de: 'Khi số lần thực nghiệm càng lớn thì xác suất thực nghiệm của một biến cố:',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['càng gần với xác suất của biến cố đó', 'luôn bằng $0{,}5$', 'càng xa xác suất của biến cố đó', 'càng gần $1$'] },
        goiY: ['Nhớ lại thí nghiệm tung đồng xu và rút bi ở phần Khám phá.', 'Đường đỏ (xác suất thực nghiệm) về sau nằm sát đường nào?'],
        loiGiai: ['Thử càng nhiều lần, xác suất thực nghiệm càng gần xác suất của biến cố. Vì vậy ta dùng nó để **ước lượng** xác suất.', 'Đáp án: càng gần với xác suất của biến cố đó.'] },

      { id: '32.4', muc: 1, de: 'Bạn Long tung một đồng xu 50 lần thì thấy 23 lần xuất hiện mặt ngửa. Tính xác suất thực nghiệm của biến cố "Xuất hiện mặt ngửa".',
        dapAn: { kieu: 'so', gt: '23/50' },
        goiY: ['Tung $n = 50$ lần, mặt ngửa xuất hiện $k = 23$ lần.', 'Lập tỉ số $\\dfrac{k}{n}$.'],
        loiGiai: ['Xác suất thực nghiệm $= \\dfrac{23}{50} = 0{,}46$.', 'Lưu ý: xác suất thực nghiệm ($0{,}46$) có thể khác xác suất $\\dfrac{1}{2}$, vì mới tung 50 lần.', 'Đáp số: $\\dfrac{23}{50}$.'],
        loiThuongGap: [
          { gt: '23/27', giaiThich: 'Mẫu số là tổng số lần tung (50), không phải số lần ra mặt sấp (27).' },
          { gt: '1/2', giaiThich: '$\\frac{1}{2}$ là **xác suất** lí thuyết. Đề hỏi **xác suất thực nghiệm** theo kết quả 50 lần tung của Long.' }] },

      { id: '32.5', muc: 2, de: 'Một nhân viên ghi lại số phế phẩm của nhà máy mỗi ngày trong 20 ngày: 12 ngày không có phế phẩm, 4 ngày có 1 phế phẩm, 2 ngày có 2 phế phẩm, 1 ngày có 3 phế phẩm, 1 ngày có từ 4 phế phẩm trở lên. Tính xác suất thực nghiệm của các biến cố:',
        hinh: bang('Số phế phẩm mỗi ngày (20 ngày)', 'Số phế phẩm', ['0', '1', '2', '3', '≥ 4'], 'Số ngày', [12, 4, 2, 1, 1]),
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$M$: "Trong một ngày không có phế phẩm"', kieu: 'so', gt: '3/5',
            loiThuongGap: [{ gt: '3/2', giaiThich: 'Mẫu số là tổng số ngày theo dõi (20), không phải số ngày có phế phẩm (8).' }] },
          { nhan: '$N$: "Trong một ngày chỉ có 1 phế phẩm"', kieu: 'so', gt: '1/5' },
          { nhan: '$K$: "Trong một ngày có ít nhất 2 phế phẩm"', kieu: 'so', gt: '1/5',
            loiThuongGap: [{ gt: '1/10', giaiThich: '"Ít nhất 2" gồm cả ngày có 2, 3 và từ 4 trở lên: $2 + 1 + 1 = 4$ ngày.' }] }] },
        goiY: ['Mẫu số luôn là 20 (số ngày theo dõi).', '"Ít nhất 2 phế phẩm" gồm các cột 2, 3 và ≥ 4.'],
        loiGiai: ['$M$: $\\dfrac{12}{20} = \\dfrac{3}{5}$.', '$N$: $\\dfrac{4}{20} = \\dfrac{1}{5}$.', '$K$: $\\dfrac{2 + 1 + 1}{20} = \\dfrac{4}{20} = \\dfrac{1}{5}$.'] },

      { id: '32.6', muc: 2, de: 'Thống kê thời lượng 80 chương trình quảng cáo trên một đài truyền hình: từ 0 đến 19 giây: 18 chương trình; từ 20 đến 39 giây: 36; từ 40 đến 59 giây: 20; trên 60 giây: 6. Tính xác suất thực nghiệm để một chương trình quảng cáo kéo dài:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'từ 20 đến 39 giây', kieu: 'so', gt: '9/20' },
          { nhan: 'trên 1 phút', kieu: 'so', gt: '3/40',
            loiThuongGap: [{ gt: '3/37', giaiThich: 'Mẫu số là **tổng** số chương trình được thống kê (80), không phải số chương trình còn lại ($80 - 6 = 74$). "Trên 1 phút" là nhóm trên 60 giây: $\\frac{6}{80}$.' }] },
          { nhan: 'từ 20 đến 59 giây', kieu: 'so', gt: '7/10',
            loiThuongGap: [{ gt: '9/20', giaiThich: '"Từ 20 đến 59 giây" gồm **hai** nhóm: 20–39 giây (36) và 40–59 giây (20).' }] }] },
        goiY: ['Tổng số chương trình là 80: đó là mẫu số.', '"Từ 20 đến 59 giây" gồm hai nhóm 20–39 và 40–59.'],
        loiGiai: ['Từ 20 đến 39 giây: $\\dfrac{36}{80} = \\dfrac{9}{20}$.', 'Trên 1 phút: $\\dfrac{6}{80} = \\dfrac{3}{40}$.', 'Từ 20 đến 59 giây: $\\dfrac{36 + 20}{80} = \\dfrac{56}{80} = \\dfrac{7}{10}$.'] },

      { id: '32.7', muc: 2, de: 'Một cửa hàng bán được trong năm qua: 600 điện thoại loại A, 900 chiếc loại B và 1 000 chiếc loại C. Tính xác suất thực nghiệm của biến cố "Chiếc điện thoại được bán ra là loại A".',
        dapAn: { kieu: 'so', gt: '6/25' },
        goiY: ['Tổng số điện thoại bán được là bao nhiêu?', 'Lấy số điện thoại loại A chia cho tổng.'],
        loiGiai: ['Tổng số điện thoại: $600 + 900 + 1000 = 2500$.', 'Xác suất thực nghiệm $= \\dfrac{600}{2500} = \\dfrac{6}{25}$'],
        loiThuongGap: [
          { gt: '1/3', giaiThich: 'Ba loại điện thoại **không** bán được số lượng như nhau. Phải dùng số liệu: $\\frac{600}{2500}$.' },
          { gt: '6/19', giaiThich: 'Mẫu số là tổng số điện thoại (2 500), không phải số điện thoại không phải loại A (1 900).' }] },

      { id: '32.8', muc: 2, de: 'Một trạm nông nghiệp gieo thử 1 200 hạt giống thì có 1 080 hạt nảy mầm. Ước lượng xác suất để một hạt giống loại này nảy mầm.',
        dapAn: { kieu: 'so', gt: '9/10' },
        goiY: ['$n = 1200$ hạt được gieo, $k = 1080$ hạt nảy mầm.', 'Lập tỉ số $\\dfrac{k}{n}$ rồi rút gọn.'],
        loiGiai: ['$P \\approx \\dfrac{1080}{1200}$.', '$P \\approx \\dfrac{1080}{1200} = \\dfrac{9}{10}$'],
        loiThuongGap: [{ gt: '1/10', giaiThich: '$\\frac{120}{1200}$ là tỉ lệ hạt **không** nảy mầm.' }] },

      { id: '32.9', muc: 2, de: 'Điểm kiểm tra môn Toán của 100 học sinh lớp 8 chọn ngẫu nhiên ở trường X được cho trong biểu đồ. Chọn ngẫu nhiên một học sinh lớp 8 của trường X. Ước lượng xác suất của các biến cố:',
        hinh: diemThi,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: '$A$: "Học sinh đó có điểm nhỏ hơn hoặc bằng 5"', kieu: 'so', gt: '2/5',
            loiThuongGap: [{ gt: '1/4', giaiThich: '"Nhỏ hơn hoặc bằng 5" có cả điểm 5 (15 bạn): $2 + 5 + 8 + 10 + 15 = 40$.' }] },
          { nhan: '$B$: "Học sinh đó có điểm từ 4 đến 9"', kieu: 'so', gt: '4/5',
            loiThuongGap: [{ gt: '7/10', giaiThich: '"Từ 4 đến 9" gồm cả điểm 4 và điểm 9: $10 + 15 + 18 + 17 + 12 + 8 = 80$.' }] }] },
        goiY: ['Mẫu số là 100 (số học sinh được thống kê).', 'Cộng số học sinh ở các cột thoả mãn biến cố.'],
        loiGiai: ['$A$: $2 + 5 + 8 + 10 + 15 = 40$ học sinh → $P(A) \\approx \\dfrac{40}{100} = 0{,}4$.', '$B$: $10 + 15 + 18 + 17 + 12 + 8 = 80$ học sinh → $P(B) \\approx \\dfrac{80}{100} = 0{,}8$.'] },

      { id: '32.10', muc: 3, de: 'Dùng số liệu điểm kiểm tra ở biểu đồ (100 học sinh). Trong một nhóm 80 học sinh lớp 8 khác của trường X, hãy dự đoán:',
        hinh: diemThi,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'số học sinh có điểm không vượt quá 5', kieu: 'so', gt: 32,
            loiThuongGap: [{ gt: 200, giaiThich: 'Dự báo phải **nhân**: $80 \\cdot 0{,}4 = 32$, không phải chia $80 : 0{,}4$.' }] },
          { nhan: 'số học sinh có điểm từ 4 đến 9', kieu: 'so', gt: 64,
            loiThuongGap: [{ gt: 80, giaiThich: '80 là cả nhóm. Chỉ khoảng $80\\%$ trong nhóm có điểm từ 4 đến 9: $80 \\cdot 0{,}8 = 64$.' }] }] },
        goiY: ['Trước hết ước lượng xác suất: xác suất điểm không vượt quá 5 là khoảng $0{,}4$ và xác suất điểm từ 4 đến 9 là khoảng $0{,}8$.', 'Số học sinh dự đoán = 80 $\\times$ xác suất.'],
        loiGiai: ['Điểm không vượt quá 5: $P \\approx 0{,}4$, nên có khoảng $80 \\cdot 0{,}4 = 32$ học sinh.', 'Điểm từ 4 đến 9: $P \\approx 0{,}8$, nên có khoảng $80 \\cdot 0{,}8 = 64$ học sinh.'] },

      { id: '32.11', muc: 3, de: 'Thống kê số vụ tai nạn giao thông mỗi ngày trong 61 ngày (tháng 8 và 9) ở thành phố X: 0 vụ: 5 ngày; 1 vụ: 10 ngày; 2 vụ: 14 ngày; 3 vụ: 11 ngày; 4 vụ: 8 ngày; 5 vụ: 5 ngày; 6 vụ: 4 ngày; 7 vụ: 2 ngày; từ 8 vụ trở lên: 2 ngày. Hãy dự đoán trong ba tháng 10, 11, 12 (92 ngày) tới có khoảng bao nhiêu ngày:',
        hinh: bang('Số vụ tai nạn mỗi ngày (61 ngày)', 'Số vụ', ['0', '1', '2', '3', '4', '5', '6', '7', '≥ 8'], 'Số ngày', [5, 10, 14, 11, 8, 5, 4, 2, 2]),
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'có nhiều nhất 3 vụ tai nạn (làm tròn đến hàng đơn vị)', kieu: 'so', gt: 60, saiSo: 0.5,
            loiThuongGap: [{ gt: 40, giaiThich: '40 là số ngày trong **61 ngày đã theo dõi**. Em cần dự đoán cho 92 ngày: $92 \\cdot \\frac{40}{61}$.' }] },
          { nhan: 'có ít nhất 5 vụ tai nạn (làm tròn đến hàng đơn vị)', kieu: 'so', gt: 20, saiSo: 0.5,
            loiThuongGap: [{ gt: 32, giaiThich: '"Ít nhất 5" gồm 5, 6, 7 và từ 8 vụ trở lên: $5 + 4 + 2 + 2 = 13$ ngày, không tính ngày có 4 vụ.' }] }] },
        goiY: ['Ước lượng xác suất từ 61 ngày đã theo dõi.', '"Nhiều nhất 3" gồm 0, 1, 2, 3 vụ. Số ngày dự đoán $= 92 \\times$ xác suất.'],
        loiGiai: ['Nhiều nhất 3 vụ: $5 + 10 + 14 + 11 = 40$ ngày, $P \\approx \\dfrac{40}{61}$. Dự đoán: $92 \\cdot \\dfrac{40}{61} \\approx 60{,}3$, tức **khoảng 60 ngày**.', 'Ít nhất 5 vụ: $5 + 4 + 2 + 2 = 13$ ngày, $P \\approx \\dfrac{13}{61}$. Dự đoán: $92 \\cdot \\dfrac{13}{61} \\approx 19{,}6$, tức **khoảng 20 ngày**.'] },

      { id: '32.12', muc: 3, de: 'Mai và Việt chơi gieo đồng thời hai con xúc xắc, mỗi lần được số điểm bằng tổng số chấm. Mai gieo 100 lần, kết quả ở biểu đồ. Việt sẽ gieo 120 lần. Trước khi Việt gieo, hãy dự đoán số lần điểm của Việt là:',
        hinh: haiXucXac,
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'một số chẵn', kieu: 'so', gt: 60, saiSo: 0.5,
            loiThuongGap: [{ gt: 50, giaiThich: '50 là số lần của **Mai** trong 100 lần. Việt gieo 120 lần: $120 \\cdot 0{,}5 = 60$.' }] },
          { nhan: 'một số nguyên tố (làm tròn đến hàng đơn vị)', kieu: 'so', gt: 52, saiSo: 0.5,
            loiThuongGap: [{ gt: 48, giaiThich: 'Em quên tổng bằng **2** (2 cũng là số nguyên tố). Các tổng là số nguyên tố: 2; 3; 5; 7; 11, số lần $3 + 6 + 11 + 17 + 6 = 43$.' }] },
          { nhan: 'một số lớn hơn 7 (làm tròn đến hàng đơn vị)', kieu: 'so', gt: 50, saiSo: 0.5,
            loiThuongGap: [{ gt: 71, giaiThich: '"Lớn hơn 7" không lấy tổng 7. Chỉ gồm 8; 9; 10; 11; 12: $14 + 10 + 8 + 6 + 4 = 42$ lần.' }] }] },
        goiY: ['Ước lượng xác suất từ 100 lần gieo của Mai.', 'Số chẵn: 2; 4; 6; 8; 10; 12. Số nguyên tố: 2; 3; 5; 7; 11. Rồi nhân xác suất với 120.'],
        loiGiai: [
          'Tổng là số chẵn: $3 + 8 + 13 + 14 + 8 + 4 = 50$ lần → $P \\approx 0{,}5$ → Việt: $120 \\cdot 0{,}5 = 60$ lần.',
          'Số nguyên tố: $3 + 6 + 11 + 17 + 6 = 43$ lần → $P \\approx 0{,}43$ → $120 \\cdot 0{,}43 = 51{,}6$, khoảng 52 lần.',
          'Lớn hơn 7: $14 + 10 + 8 + 6 + 4 = 42$ lần → $P \\approx 0{,}42$ → $120 \\cdot 0{,}42 = 50{,}4$, khoảng 50 lần.'] }
    ],

    timLoi: [
      { de: 'Tung một đồng xu 40 lần thấy 18 lần ra mặt sấp. Bạn Hùng tính xác suất thực nghiệm của biến cố "Ra mặt sấp" như sau. Dòng nào sai?',
        loiGiaiSai: ['Số lần ra mặt sấp: $k = 18$.', 'Số lần ra mặt ngửa: $40 - 18 = 22$.', 'Xác suất thực nghiệm: $\\dfrac{18}{22} = \\dfrac{9}{11}$.'],
        dongSai: 2, giaiThich: 'Mẫu số là **tổng số lần tung** $n = 40$, không phải số lần ra mặt ngửa.', sua: 'Xác suất thực nghiệm: $\\dfrac{18}{40} = \\dfrac{9}{20}$.' },
      { de: 'Biết xác suất để một sản phẩm không có lỗi được ước lượng là $0{,}62$. Bạn Lan dự đoán số sản phẩm không lỗi khi kiểm tra 150 sản phẩm như sau. Dòng nào sai?',
        loiGiaiSai: ['Gọi $k$ là số sản phẩm không lỗi trong 150 sản phẩm: $\\dfrac{k}{150} \\approx 0{,}62$.', 'Suy ra $k \\approx 150 : 0{,}62 \\approx 242$.', 'Vậy có khoảng 242 sản phẩm không lỗi.'],
        dongSai: 1, giaiThich: 'Từ $\\dfrac{k}{150} \\approx 0{,}62$ ta **nhân** hai vế với 150: $k \\approx 150 \\cdot 0{,}62$. (Kết quả 242 còn lớn hơn cả 150 sản phẩm, vô lí!)', sua: 'Suy ra $k \\approx 150 \\cdot 0{,}62 = 93$, khoảng 93 sản phẩm không lỗi.' }
    ]
  });
})();
