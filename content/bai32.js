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

  // ---------- Cấu hình hình cho "Nhìn là hiểu" ----------
  // lanThu: mỗi lần thử là một ô, ô sáng là lần biến cố xảy ra. moPhong: rút bi có trả lại, tỉ lệ k/n theo số lần rút.
  function lt(tuyChon, them) { return Object.assign({ ten: 'lanThu', tuyChon: tuyChon }, them); }
  // Hình lời giải: số đáp án chỉ hiện khi em đã xem lời giải (cảnh sang trạng thái giai)
  function hg(c) { return { widget: 'canh', config: Object.assign({ chiXem: true, t: 1 }, c, { tuyChon: Object.assign({ anSo: true }, c.tuyChon) }) }; }
  function nh(ten, so, mau) { return { ten: ten, so: so, mau: mau }; }
  var TUI = { nhom: [nh('Đỏ', 3, '#e03131'), nh('Xanh', 2, '#1971c2')], thuan: ['Đỏ'] };
  var CUOC_GOI = ['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(function (t, i) { return nh(t, [5, 9, 15, 10, 5, 6, 4, 2, 3][i]); });
  var PHE_PHAM = [nh('0', 12), nh('1', 4), nh('2', 2), nh('3', 1), nh('≥4', 1)];
  var THANH = 'Hình không vẽ từng lần: thanh tượng trưng cho tất cả, phần sáng theo đúng tỉ lệ.';
  function soBatKi(v) {
    if (v > 1) return { thamSo: { thu: v }, t: 1, loi: 'Tỉ lệ không lớn hơn $1$: số ô sáng không thể nhiều hơn tất cả các ô.' };
    return { thamSo: { thu: v }, t: 1, loi: 'Vạch đỏ là số em gõ, chưa trùng chỗ phần sáng kết thúc. Đếm ô sáng rồi chia cho **tất cả** các ô.' };
  }

  TOAN8.bai({
    id: 32, ten: 'Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng', sgk: { tap: 2, trang: 67 },

    nhin: {
      tieuDe: 'Rút càng nhiều lần, tỉ lệ càng sát xác suất', loai: 'minhHoa',
      luuY: 'Máy rút bi theo một **hạt giống** cố định, nên lần nào xem cũng ra đúng đường này. Kéo thanh **Lần chạy** để xem lần rút khác: đường lúc đầu khác hẳn, khi $n$ lớn thì đường nào cũng dồn về gần $0{,}6$ nhưng hiếm khi trúng đúng $0{,}6$. Ở lớp 8, điều này được thừa nhận qua thí nghiệm, chưa chứng minh.',
      canh: { ten: 'moPhong', tuyChon: TUI, giay: 14, moTa: 'Đồ thị tỉ lệ số lần rút được bi đỏ theo số lần rút, từ 1 đến 1000 lần. Đường đứt nét là xác suất 0,6.' },
      buoc: [
        { t: 0, chu: 'Túi có $3$ bi đỏ và $2$ bi xanh. Theo bài 31, xác suất lấy được bi đỏ là $\\frac{3}{5} = 0{,}6$ (đường xanh lá đứt nét).' },
        { t: 0.08, chu: 'Lấy một viên, ghi màu, trả lại túi, rồi lặp lại. Sau $\\cb{n}$ lần có $\\cc{k}$ lần ra đỏ. Tỉ lệ $\\ca{\\frac{k}{n}}$ là đường cam.' },
        { t: 0.39, chu: 'Mới $10$ lần: tỉ lệ nhảy lên xuống, có thể còn xa $0{,}6$.' },
        { t: 0.7, chu: 'Khoảng $100$ lần: đường cam thường đã gần đường xanh lá.' },
        { t: 1, chu: '$1000$ lần: tỉ lệ $\\frac{k}{n}$ rất gần $0{,}6$ nhưng vẫn lệch một chút, mỗi lần chạy lệch khác nhau.' }
      ],
      ketLuan: 'Thử càng nhiều lần, xác suất thực nghiệm càng gần xác suất: $$\\ca{\\dfrac{\\cc{k}}{\\cb{n}}} \\approx P(E)$$ Khi không đếm được kết quả đồng khả năng, ta dùng $\\frac{k}{n}$ để **ước lượng** $P(E)$.',
      dung: {
        tieuDe: 'Xác suất thực nghiệm của mặt ngửa là bao nhiêu?', tuBai: '32.4',
        canh: lt({ n: 50, k: 23, hat: 5, tenCo: 'N', tenKhong: 'S', p: 0.5, pNhan: '1/2', tieuDe: 'Mặt ngửa (N) trong 50 lần tung', anSo: true },
          { t: 0.54, moTa: 'Năm mươi ô, mỗi ô là một lần tung. Ô sáng là lần ra mặt ngửa.' }),
        moiThu: 'Mỗi ô là một lần tung, ô sáng là lần ra mặt ngửa. Gõ xác suất thực nghiệm. Nếu sai, hình vẽ đúng số em gõ.',
        phanUng: [
          { gt: '1/2', trangThai: 'lyThuyet', t: 1, loi: '$\\frac12$ là **xác suất** (đồng xu có hai mặt đồng khả năng), là vạch đứt nét. Đề hỏi xác suất **thực nghiệm**: phần sáng thật trong $50$ lần tung của Long.' },
          { gt: '23/27', trangThai: 'chiaKhong', t: 1, loi: 'Em chia cho $27$ ô **không sáng** (số lần ra sấp, viền đỏ). Mẫu số là **tất cả** $50$ lần tung.' },
          { gt: 23, thamSo: { thu: 23 }, t: 1, loi: '$23$ là **số** ô sáng. Xác suất thực nghiệm là **tỉ lệ**: số ô sáng chia cho tổng số ô.' }
        ],
        soBatKi: soBatKi,
        dungChu: '$23$ ô sáng trong $50$ ô: $\\frac{23}{50} = 0{,}46$. Hơi khác xác suất $\\frac12$ vì Long mới tung $50$ lần.'
      },
      suyRa: {
        tieuDe: 'Đề đổi, nhưng vẫn là ô sáng chia tất cả các ô',
        baDe: [
          { tuBai: '32.1', canh: lt({ n: 160, k: 120, hat: 11, tieuDe: 'Kẹp nằm trọn trong một viên gạch', anSo: true }, { moTa: 'Một trăm sáu mươi ô, mỗi ô là một lần tung kẹp.' }), tenNut: 'Xếp ô sáng lên đầu',
            phanUng: [{ gt: 3, trangThai: 'chiaKhong', loi: 'Em chia $120$ cho $40$ ô **không sáng** (viền đỏ). Mẫu số là **tất cả** $160$ lần tung.' }],
            dungChu: '$\\frac{120}{160} = \\frac{3}{4}$.', saiChu: 'Ô sáng chia cho **tất cả** các ô: $120$ trên $160$.' },
          { tuBai: '32.5', canh: lt({ nhom: PHE_PHAM, nhomThuan: ['2', '3', '≥4'], tieuDe: 'Ngày có ít nhất 2 phế phẩm', donVi: 'ngày', anSo: true }, { moTa: 'Hai mươi ô, mỗi ô là một ngày, ghi số phế phẩm của ngày đó.' }), tenNut: 'Sáng các ngày thuận lợi',
            de: 'Một nhân viên ghi lại số phế phẩm của nhà máy mỗi ngày trong 20 ngày: 12 ngày không có phế phẩm, 4 ngày có 1 phế phẩm, 2 ngày có 2 phế phẩm, 1 ngày có 3 phế phẩm, 1 ngày có từ 4 phế phẩm trở lên. Tính xác suất thực nghiệm của biến cố "Trong một ngày có ít nhất 2 phế phẩm".',
            dapAn: { kieu: 'so', gt: '1/5' }, goiY: ['"Ít nhất 2" gồm các ngày có 2, 3 và từ 4 phế phẩm trở lên.'], loiGiai: ['Số ngày có ít nhất 2 phế phẩm: $2 + 1 + 1 = 4$.', 'Xác suất thực nghiệm $= \\dfrac{4}{20} = \\dfrac{1}{5}$'],
            loiThuongGap: [],
            phanUng: [{ gt: '1/10', loi: '"Ít nhất 2" gồm cả ngày có $2$, $3$ và từ $4$ phế phẩm trở lên. Đếm mọi ô sáng.' }, { gt: '1/4', trangThai: 'chiaKhong', loi: 'Em chia $4$ cho $16$ ô **không sáng** (viền đỏ). Mẫu số là **tất cả** $20$ ngày.' }],
            dungChu: '$4$ ô sáng trong $20$ ô: $\\frac{4}{20} = \\frac15$.', saiChu: 'Đếm các ô ghi 2, 3, ≥4 rồi chia cho cả $20$ ngày.' },
          { tuBai: '32.10', canh: lt({ n: 100, k: 40, duBao: 80, nhan1: '100 học sinh đã biết điểm', nhan2: '80 học sinh khác', tenCo: 'Có điểm ≤ 5', donVi: 'học sinh', anSo: true }, { moTa: 'Hai thanh: 100 học sinh đã biết điểm và 80 học sinh khác, phần sáng cùng một tỉ lệ.' }), tenNut: 'Giữ đúng tỉ lệ',
            de: 'Trong 100 học sinh lớp 8 chọn ngẫu nhiên ở trường X, có 40 bạn được điểm kiểm tra không vượt quá 5. Trong một nhóm 80 học sinh lớp 8 khác của trường X, hãy dự đoán có khoảng bao nhiêu bạn được điểm không vượt quá 5.',
            dapAn: { kieu: 'so', gt: 32 }, goiY: ['Xác suất được ước lượng là $\\frac{40}{100} = 0{,}4$. Giữ tỉ lệ đó cho nhóm $80$ bạn.'], loiGiai: ['$P \\approx \\dfrac{40}{100} = 0{,}4$.', 'Số học sinh dự đoán: $80 \\cdot 0{,}4 = 32$'],
            loiThuongGap: [],
            phanUng: [{ gt: 200, thamSo: { thu: 200 }, loi: 'Dự đoán phải **nhân**: $80 \\cdot 0{,}4$. Số em gõ còn nhiều hơn cả nhóm $80$ bạn!' }, { gt: 40, thamSo: { thu: 40 }, loi: '$40$ là số bạn trong **100** bạn đã biết điểm. Nhóm mới chỉ có $80$ bạn: giữ đúng tỉ lệ $0{,}4$.' }],
            soBatKi: function (v) { return { thamSo: { thu: v }, t: 1, loi: 'Vạch đỏ là số em gõ. Phần sáng của thanh dưới phải chiếm đúng tỉ lệ như thanh trên: $80 \\cdot \\frac{40}{100}$.' }; },
            dungChu: '$80 \\cdot 0{,}4 = 32$: phần sáng của thanh dưới cùng tỉ lệ với thanh trên.', saiChu: 'Giữ đúng tỉ lệ $\\frac{40}{100}$ cho $80$ bạn.' }
        ],
        cachNhan: 'Ba đề, một khuôn: mỗi lần thử (mỗi lần tung, mỗi ngày, mỗi học sinh) là một ô. Ô sáng chia cho **tất cả** các ô là xác suất thực nghiệm. Muốn dự đoán thì giữ nguyên tỉ lệ đó cho số lần mới.'
      }
    },

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
      { de: 'Dùng bảng số cuộc gọi của ông An trong 59 ngày (xem phần Lý thuyết: 0 cuộc: 5 ngày; 1: 9; 2: 15; 3: 10; 4: 5; 5: 6; 6: 4; 7: 2; 8: 3). Tính xác suất thực nghiệm của $E$: "Trong một ngày ông An nhận được ít nhất 5 cuộc gọi" và $F$: "… nhiều nhất 3 cuộc gọi".', canh: lt({ nhom: CUOC_GOI, bienCo: [{ ten: 'E: Ít nhất 5 cuộc gọi', nhom: ['5', '6', '7', '8'] }, { ten: 'F: Nhiều nhất 3 cuộc gọi', nhom: ['0', '1', '2', '3'] }], donVi: 'ngày' }, { ghiChu: 'Mỗi ô là một ngày, số trong ô là số cuộc gọi của ngày đó.' }), buoc: [
        { lam: 'Số ngày có ít nhất 5 cuộc gọi: $6 + 4 + 2 + 3 = 15$ ngày. Xác suất thực nghiệm của $E$ là $\\dfrac{15}{59}$.', vi: '"Ít nhất 5" là 5, 6, 7 hoặc 8 cuộc. Mẫu số là tổng số ngày theo dõi: 59.', canh: { t: 1, thamSo: { chon: 0 } } },
        { lam: 'Số ngày có nhiều nhất 3 cuộc gọi: $5 + 9 + 15 + 10 = 39$ ngày. Xác suất thực nghiệm của $F$ là $\\dfrac{39}{59}$.', vi: '"Nhiều nhất 3" là 0, 1, 2 hoặc 3 cuộc (có cả ngày không có cuộc nào).', canh: { t: 1, thamSo: { chon: 1 } } } ] },
      { de: 'Kiểm tra ngẫu nhiên 500 chiếc ti vi của nhà máy X thì có 4 chiếc không đạt chất lượng. Ước lượng xác suất để một ti vi của nhà máy X không đạt chất lượng.', canh: lt({ n: 500, k: 4, nhan1: '500 ti vi đã kiểm tra', tenCo: 'Không đạt' }, { ghiChu: THANH }), buoc: [
        { lam: 'Trong $n = 500$ lần quan sát, biến cố xảy ra $k = 4$ lần.', vi: 'Ti vi đạt hay không đạt **không** đồng khả năng, nên phải dùng số liệu thực tế.', canh: { t: 0.4 } },
        { lam: '$\\dfrac{4}{500} = 0{,}008 = 0{,}8\\%$. Vậy xác suất được ước lượng là $0{,}8\\%$.', vi: 'Xác suất thực nghiệm $\\dfrac{k}{n}$ dùng để ước lượng xác suất.', canh: { t: 1 } } ] },
      { de: 'Trong 240 000 trẻ sơ sinh có 123 120 bé trai. Ước lượng xác suất của biến cố "Trẻ sơ sinh là bé gái".', canh: lt({ nhom: [nh('Bé trai', 123120), nh('Bé gái', 116880)], nhomThuan: ['Bé gái'], nhan1: '240 000 trẻ sơ sinh', tenCo: 'Bé gái' }, { ghiChu: THANH }), buoc: [
        { lam: 'Số bé gái: $240\\,000 - 123\\,120 = 116\\,880$.', vi: 'Biến cố hỏi bé **gái**, không phải bé trai.', canh: { t: 0.7 } },
        { lam: '$\\dfrac{116\\,880}{240\\,000} = 0{,}487$. Vậy xác suất được ước lượng là $0{,}487$ (khoảng $48{,}7\\%$).', vi: 'Chia số lần biến cố xảy ra cho tổng số trẻ được theo dõi.', canh: { t: 1 } } ] },
      { de: 'Kiểm tra 100 linh kiện: 62 cái không lỗi, 35 cái có đúng 1 lỗi, 3 cái có nhiều hơn 1 lỗi. Nếu kiểm tra 120 linh kiện khác, dự đoán có bao nhiêu linh kiện có đúng 1 lỗi?', canh: lt({ n: 100, k: 35, duBao: 120, nhan1: '100 linh kiện đã kiểm tra', nhan2: '120 linh kiện khác', tenCo: 'Có đúng 1 lỗi', donVi: 'linh kiện' }), buoc: [
        { lam: 'Xác suất linh kiện có đúng 1 lỗi được ước lượng: $P \\approx \\dfrac{35}{100} = 0{,}35$.', vi: 'Dùng số liệu 100 linh kiện đã kiểm tra.', canh: { t: 0.6 } },
        { lam: 'Gọi $h$ là số linh kiện có đúng 1 lỗi trong 120 cái: $\\dfrac{h}{120} \\approx 0{,}35$.', vi: 'Tỉ lệ trong lần kiểm tra mới cũng xấp xỉ xác suất.', canh: { t: 0.8 } },
        { lam: '$h \\approx 120 \\cdot 0{,}35 = 42$. Dự đoán có khoảng 42 linh kiện có đúng 1 lỗi.', vi: 'Dự báo = số lần $\\times$ xác suất.', canh: { t: 1 } } ] }
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
      { id: '32.1', hinhGiai: hg(lt({ n: 160, k: 120, hat: 11, tieuDe: 'Kẹp nằm trọn trong một viên gạch' })), muc: 1, de: 'Tung một chiếc kẹp giấy 160 lần xuống sàn lát gạch hình vuông, thấy 120 lần chiếc kẹp nằm hoàn toàn bên trong một viên gạch. Tính xác suất thực nghiệm của biến cố "Chiếc kẹp nằm hoàn toàn trong viên gạch".',
        dapAn: { kieu: 'so', gt: '3/4' },
        goiY: ['Xác suất thực nghiệm $= \\dfrac{k}{n}$: $k$ là số lần biến cố xảy ra, $n$ là tổng số lần tung.', '$k = 120$, $n = 160$.'],
        loiGiai: ['Tung $n = 160$ lần, biến cố xảy ra $k = 120$ lần.', 'Xác suất thực nghiệm $= \\dfrac{120}{160} = \\dfrac{3}{4}$'],
        loiThuongGap: [
          { gt: 3, giaiThich: 'Em chia 120 cho 40 (số lần không xảy ra). Mẫu số phải là tổng số lần tung: 160.' },
          { gt: '1/4', giaiThich: '$\\frac{40}{160}$ là tỉ lệ số lần kẹp **không** nằm hoàn toàn trong viên gạch.' }] },

      { id: '32.2', hinhGiai: hg(lt({ n: 400, k: 6, thanh: true, nhan1: '400 bóng đèn đã kiểm tra', tenCo: 'Hỏng' }, { ghiChu: THANH })), muc: 1, de: 'Kiểm tra ngẫu nhiên 400 bóng đèn của một nhà máy thấy có 6 bóng hỏng. Ước lượng xác suất để một bóng đèn của nhà máy bị hỏng (có thể ghi phân số, số thập phân hoặc phần trăm).',
        dapAn: { kieu: 'so', gt: '3/200' },
        goiY: ['$n = 400$ bóng được kiểm tra, $k = 6$ bóng hỏng.', '$P \\approx \\dfrac{6}{400}$. Đổi ra số thập phân hoặc phần trăm.'],
        loiGiai: ['$P \\approx \\dfrac{6}{400} = 0{,}015 = 1{,}5\\%$.', 'Vậy $P \\approx \\dfrac{6}{400} = \\dfrac{3}{200}$'],
        loiThuongGap: [{ gt: '6/394', giaiThich: 'Mẫu số là tổng số bóng được kiểm tra (400), không phải số bóng tốt (394).' }] },

      { id: '32.3', hinhGiai: hg({ ten: 'moPhong', tuyChon: TUI }), muc: 1, de: 'Khi số lần thực nghiệm càng lớn thì xác suất thực nghiệm của một biến cố:',
        dapAn: { kieu: 'chon', gt: 0, luaChon: ['càng gần với xác suất của biến cố đó', 'luôn bằng $0{,}5$', 'càng xa xác suất của biến cố đó', 'càng gần $1$'] },
        goiY: ['Nhớ lại thí nghiệm tung đồng xu và rút bi ở phần Khám phá.', 'Trong hình, đường cam (xác suất thực nghiệm) về sau nằm sát đường nào?'],
        loiGiai: ['Thử càng nhiều lần, xác suất thực nghiệm càng gần xác suất của biến cố. Vì vậy ta dùng nó để **ước lượng** xác suất.', 'Đáp án: càng gần với xác suất của biến cố đó.'] },

      { id: '32.4', hinhGiai: hg(lt({ n: 50, k: 23, hat: 5, tenCo: 'N', tenKhong: 'S', p: 0.5, pNhan: '1/2', hienP: true, tieuDe: 'Mặt ngửa (N) trong 50 lần tung' })), muc: 1, de: 'Bạn Long tung một đồng xu 50 lần thì thấy 23 lần xuất hiện mặt ngửa. Tính xác suất thực nghiệm của biến cố "Xuất hiện mặt ngửa".',
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

      { id: '32.6', hinhGiai: hg(lt({ nhom: [nh('0–19 giây', 18), nh('20–39 giây', 36), nh('40–59 giây', 20), nh('trên 60 giây', 6)], bienCo: [{ ten: 'Từ 20 đến 39 giây', nhom: ['20–39 giây'] }, { ten: 'Trên 1 phút', nhom: ['trên 60 giây'] }, { ten: 'Từ 20 đến 59 giây', nhom: ['20–39 giây', '40–59 giây'] }], thanh: true, nhan1: '80 chương trình' }, { thamSo: { chon: 2 } })), muc: 2, de: 'Thống kê thời lượng 80 chương trình quảng cáo trên một đài truyền hình: từ 0 đến 19 giây: 18 chương trình; từ 20 đến 39 giây: 36; từ 40 đến 59 giây: 20; trên 60 giây: 6. Tính xác suất thực nghiệm để một chương trình quảng cáo kéo dài:',
        dapAn: { kieu: 'nhieuO', o: [
          { nhan: 'từ 20 đến 39 giây', kieu: 'so', gt: '9/20' },
          { nhan: 'trên 1 phút', kieu: 'so', gt: '3/40',
            loiThuongGap: [{ gt: '3/37', giaiThich: 'Mẫu số là **tổng** số chương trình được thống kê (80), không phải số chương trình còn lại ($80 - 6 = 74$). "Trên 1 phút" là nhóm trên 60 giây: $\\frac{6}{80}$.' }] },
          { nhan: 'từ 20 đến 59 giây', kieu: 'so', gt: '7/10',
            loiThuongGap: [{ gt: '9/20', giaiThich: '"Từ 20 đến 59 giây" gồm **hai** nhóm: 20–39 giây (36) và 40–59 giây (20).' }] }] },
        goiY: ['Tổng số chương trình là 80: đó là mẫu số.', '"Từ 20 đến 59 giây" gồm hai nhóm 20–39 và 40–59.'],
        loiGiai: ['Từ 20 đến 39 giây: $\\dfrac{36}{80} = \\dfrac{9}{20}$.', 'Trên 1 phút: $\\dfrac{6}{80} = \\dfrac{3}{40}$.', 'Từ 20 đến 59 giây: $\\dfrac{36 + 20}{80} = \\dfrac{56}{80} = \\dfrac{7}{10}$.'] },

      { id: '32.7', hinhGiai: hg(lt({ nhom: [nh('Loại A', 600), nh('Loại B', 900), nh('Loại C', 1000)], nhomThuan: ['Loại A'], nhan1: '2 500 điện thoại đã bán', tenCo: 'Loại A' }, { ghiChu: THANH })), muc: 2, de: 'Một cửa hàng bán được trong năm qua: 600 điện thoại loại A, 900 chiếc loại B và 1 000 chiếc loại C. Tính xác suất thực nghiệm của biến cố "Chiếc điện thoại được bán ra là loại A".',
        dapAn: { kieu: 'so', gt: '6/25' },
        goiY: ['Tổng số điện thoại bán được là bao nhiêu?', 'Lấy số điện thoại loại A chia cho tổng.'],
        loiGiai: ['Tổng số điện thoại: $600 + 900 + 1000 = 2500$.', 'Xác suất thực nghiệm $= \\dfrac{600}{2500} = \\dfrac{6}{25}$'],
        loiThuongGap: [
          { gt: '1/3', giaiThich: 'Ba loại điện thoại **không** bán được số lượng như nhau. Phải dùng số liệu: $\\frac{600}{2500}$.' },
          { gt: '6/19', giaiThich: 'Mẫu số là tổng số điện thoại (2 500), không phải số điện thoại không phải loại A (1 900).' }] },

      { id: '32.8', hinhGiai: hg(lt({ n: 1200, k: 1080, nhan1: '1 200 hạt đã gieo', tenCo: 'Nảy mầm' }, { ghiChu: THANH })), muc: 2, de: 'Một trạm nông nghiệp gieo thử 1 200 hạt giống thì có 1 080 hạt nảy mầm. Ước lượng xác suất để một hạt giống loại này nảy mầm.',
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
