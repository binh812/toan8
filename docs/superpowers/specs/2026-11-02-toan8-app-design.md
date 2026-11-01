# Đặc tả: Ứng dụng học Toán 8 (Kết nối tri thức)

Ngày: 02/11/2026 · Trạng thái: chờ duyệt

## 1. Mục tiêu và người dùng

- **Người dùng:** một học sinh lớp 8 đang học SGK *Toán 8 – Kết nối tri thức với cuộc sống* (Tổng chủ biên Hà Huy Khoái, NXB GDVN). Em đang gặp khó ở cả Đại số lẫn Hình học.
- **Mục tiêu:** em tự học được từng bài. Với mỗi bài, em:
  - hiểu khái niệm qua hình động,
  - xem bài mẫu giải từng bước,
  - tự làm bài tập, được chấm ngay, có gợi ý và lời giải.
- **Thành công khi:**
  - em mở được bất kỳ bài nào trong 39 bài và đi hết chuỗi 5 bước mà không cần người lớn giải thích cách dùng;
  - khi gõ sai một lỗi điển hình, ứng dụng nói đúng chỗ sai.
- **Thiết bị:** chủ yếu máy tính (màn hình ≥ 1280px). Điện thoại chỉ cần mở được và đọc được, không cần tối ưu.
- **Ngoài phạm vi:** tài khoản, máy chủ, đồng bộ nhiều máy, trang phụ huynh, video, AI chấm tự luận.

## 2. Nguồn nội dung

- SGK quét ảnh: `sach-giao-khoa/Toan8-KNTT-Tap1.pdf` (126 tr.) và `Toan8-KNTT-Tap2.pdf` (142 tr.). Mục lục ở `sach-giao-khoa/muc-luc.md`.
- Khi soạn từng bài, đọc các trang SGK tương ứng (render trang thành ảnh) để bám đúng:
  - thuật ngữ và kí hiệu SGK dùng (ví dụ "Thalès", "Pythagore", "phân tích đa thức thành nhân tử");
  - thứ tự kiến thức;
  - các dạng bài.
- Ví dụ, bài tập và lời giải là **nội dung tự soạn** theo dạng bài SGK, không chép nguyên văn. Mỗi bài ghi "SGK Tập X, trang Y" để em đối chiếu.

## 3. Kiến trúc

**Web app tĩnh, mở trực tiếp bằng bấm đúp `index.html` (giao thức `file://`), chạy offline.**

Ràng buộc do `file://`:
- Chỉ dùng thẻ `<script>` thường. Không dùng ES module, không dùng `fetch`, không dùng service worker.
- Nội dung bài viết dưới dạng file `.js` tự đăng kí vào một biến toàn cục.
- Thư viện đặt sẵn trong `lib/`, không dùng CDN.

```
toan-hoc/
  index.html              trang duy nhất; nạp lib, core, widgets, content
  css/app.css
  lib/                    katex/, jsxgraph/, mathlive/, nerdamer/ (bản phát hành, có ghi phiên bản + LICENSE)
  js/core/
    app.js                điều hướng theo hash (#/bai/15/kham-pha), dựng khung trang
    store.js              tiến độ trong localStorage + xuất/nhập file JSON
    render.js             biến khối nội dung (text, công thức, hình) thành DOM; gọi KaTeX
    checker.js            chấm đáp án (mục 6)
    practice.js           vòng làm bài: nhập, chấm, gợi ý 3 nấc, lỗi điển hình
    review.js             "Ôn 5 câu" mỗi ngày (hộp Leitner)
  js/widgets/
    tiles.js              mảnh đại số kéo thả (SVG)
    geo.js                tiện ích dựng hình JSXGraph dùng chung (điểm kéo, đo, tô màu)
    graph.js              đồ thị y = ax + b có thanh trượt
    solid3d.js            hình chóp 3D xoay được + trải phẳng
    stepper.js            hiện lời giải từng bước
  content/
    index.js              mục lục 10 chương / 39 bài (từ muc-luc.md)
    c01-bai01.js ...      mỗi bài một file
  sach-giao-khoa/         PDF gốc (không nạp vào app)
```

- Mỗi đơn vị một việc:
  - `checker.js` không biết gì về giao diện.
  - Widget nhận một đối tượng cấu hình và trả về phần tử DOM.
  - File nội dung chỉ chứa dữ liệu, cùng các hàm nhỏ khi bài cần sinh số ngẫu nhiên.

## 4. Mô hình nội dung một bài

```js
TOAN8.bai({
  id: 6, chuong: 2, ten: "Hiệu hai bình phương. Bình phương của một tổng hay một hiệu",
  sgk: { tap: 1, trang: 29 },
  khamPha: { widget: "tiles", config: {...}, nhiemVu: "Ghép hình vuông cạnh a+b ...", cauHoi: {...} },
  lyThuyet: [ { loai: "dinhNghia"|"dinhLi"|"chuY"|"text"|"hinh", noiDung: "... $$(a+b)^2$$ ...", mau: {...} } ],
  viDu: [ { de: "...", buoc: [ { lam: "$...$", vi: "Áp dụng HĐT 1 với A = x, B = 3" } ] } ],
  viDuMo: [ { de: "...", buoc: [...], anTu: 1 } ],   // ẩn dần từ bước cuối
  baiTap: [ {
    id: "6.1", muc: 1|2|3, de: "Khai triển $(x+3)^2$",
    dapAn: { kieu: "bieuThuc", gt: "x^2+6x+9", dang: "khaiTrien" },
    goiY: ["Nhắc HĐT ...", "A = x, B = 3; tính 2AB = ?"],
    loiGiai: [ ...các bước... ],
    loiThuongGap: [ { gt: "x^2+9", giaiThich: "Thiếu hạng tử 2AB. (a+b)² ≠ a² + b²" } ]
  } ],
  timLoi: [ { de: "...", loiGiaiSai: ["dòng 1", "dòng 2 (sai)", ...], dongSai: 1, giaiThich: "..." } ]
});
```

**Kiểu đáp án:**
- `bieuThuc`: biểu thức đại số, có kiểm tra dạng `khaiTrien`, `nhanTu` hoặc `rutGon`.
- `so`: số nguyên, phân số hoặc số thập phân, có sai số.
- `nghiem`: tập nghiệm của phương trình.
- `chon`: trắc nghiệm.
- `dungSai`: Đúng/Sai.
- `diem`: kéo điểm trên hình đến đúng vị trí, chấm theo vị trí với sai số.
- `nhieuO`: một bài có nhiều ô trống.

## 5. Chuỗi 5 bước trong một bài (giao diện)

Thanh tab trên đầu bài: **Khám phá · Lý thuyết · Ví dụ · Tự làm · Tìm lỗi sai**.

1. **Khám phá:** một hình động kèm một nhiệm vụ cụ thể và một câu hỏi chốt.
   - Em trả lời xong mới thấy nút "Sang Lý thuyết". Nút "Bỏ qua" vẫn có.
2. **Lý thuyết:** các thẻ ngắn (định nghĩa, định lí, chú ý).
   - Công thức và hình dùng chung màu: phần tô màu nào trong công thức thì phần tương ứng trên hình cùng màu đó.
   - Hình trong thẻ lý thuyết cũng kéo được.
3. **Ví dụ:** bấm "Bước tiếp" để hiện từng bước. Mỗi bước có dòng "Vì sao?".
   - Sau đó là ví dụ mờ dần: em tự điền bước bị ẩn, ô điền được chấm như bài tập.
4. **Tự làm:** bài tập xếp theo mức 1 (nhận biết), 2 (thông hiểu), 3 (vận dụng).
   - Em làm bài trước. Nút "Gợi ý" mở lần lượt từng nấc. Nấc cuối là lời giải đầy đủ.
   - Bài có xem lời giải thì không tính là "thành thạo".
   - Bài sai đưa vào hộp ôn tập.
5. **Tìm lỗi sai:** lời giải sai của "bạn Nam". Em bấm vào dòng sai, sau đó xem giải thích.

**Màn hình chính:**
- bản đồ 10 chương / 39 bài theo mục lục SGK, mỗi bài có vòng tiến độ;
- nút **"Ôn 5 câu hôm nay"**;
- nút xuất/nhập tiến độ.

**Thành thạo một bài:** đúng ≥ 80% số bài tập mức 1–2, không dùng nấc gợi ý cuối, và làm ít nhất 1 bài mức 3.

**Thiết kế giao diện:**
- chữ thân ≥ 18px, công thức to, nền sáng dịu;
- mỗi chương một màu nhấn;
- điểm kéo trên hình có bán kính ≥ 12px;
- không có điểm thưởng hay huy hiệu ngoài vòng tiến độ;
- toàn bộ giao diện tiếng Việt.

## 6. Chấm đáp án (`checker.js`)

- **Nhập:** ô MathLive (`<math-field>`) có bàn phím ảo gồm x, y, ², phân số, căn. Lấy ra chuỗi ASCII-math.
  - Nếu MathLive không chạy được trên `file://`, dùng ô nhập văn bản thường có xem trước bằng KaTeX.
- **Tương đương:** thay ≥ 6 bộ giá trị ngẫu nhiên vào biểu thức của em và vào đáp án, so sánh với sai số 1e-9.
  - Bộ giá trị rơi vào mẫu bằng 0 thì bỏ qua và lấy bộ khác.
  - Dùng nerdamer để tính.
- **Kiểm tra dạng** (chỉ khi đã tương đương):
  - `khaiTrien`: cây biểu thức là tổng các đơn thức, không còn ngoặc chứa phép cộng.
  - `nhanTu`: nút gốc là tích (hoặc lũy thừa) của ≥ 2 nhân tử không phải hằng, và không nhân tử nào phân tích tiếp được trên ℤ. Dùng `nerdamer.factor` để so.
  - `rutGon`: phân thức không còn nhân tử chung giữa tử và mẫu.
  - Tương đương nhưng sai dạng thì nhắc riêng, ví dụ: "Đúng giá trị nhưng chưa phân tích thành nhân tử."
- **Lỗi điển hình:** nếu bài làm tương đương với một mục trong `loiThuongGap`, hiện giải thích của mục đó.
- **Số:** chấp nhận cả `3/4`, `0,75` và `0.75`. Dấu phẩy thập phân kiểu Việt Nam được hỗ trợ.

## 7. Tiến độ (`store.js`)

- Khóa localStorage `toan8.v1` chứa:
  - mỗi bài tập: số lần làm, đúng/sai, đã dùng nấc gợi ý nào;
  - mỗi bài: tab đã xem;
  - hộp Leitner gồm 5 hộp, ôn lại sau 1, 2, 4, 8, 16 ngày.
- Nút "Xuất tiến độ" tải file JSON xuống. Nút "Nhập" đọc file JSON lên.
- Nếu localStorage lỗi (chế độ riêng tư), app vẫn chạy và hiện thông báo nhỏ "Tiến độ sẽ không được lưu".

## 8. Giai đoạn

| GĐ | Nội dung | Kết quả để duyệt |
|---|---|---|
| 1 | Khung app (mục 3–7) + tiles, geo, stepper; **Chương I (B1–5), II (B6–9), IV (B15–17)** | Cháu dùng thử, anh góp ý |
| 2 | Chương VI–VII (phân thức, PT, hàm số + graph.js); III, IX (hình); X (+ solid3d.js) | |
| 3 | Chương V, VIII (thống kê, xác suất); Ôn tập cuối năm | |

Mỗi bài có ≥ 2 ví dụ, ≥ 1 ví dụ mờ dần, 8–12 bài tập (khoảng 4 mức 1, 4 mức 2, 2 mức 3), ≥ 1 bài tìm lỗi sai.

## 9. Kiểm thử

- `checker.js` có bộ kiểm thử chạy bằng Node:
  - các cặp tương đương và không tương đương, có cả hằng đẳng thức;
  - kiểm tra dạng khai triển, nhân tử, rút gọn;
  - nhập số kiểu Việt Nam.
  - Viết test trước khi viết code (TDD).
- **Kiểm tra nội dung tự động** (script Node): mọi bài tập có đáp án, gợi ý và lời giải, và đáp án khớp với chính lời giải ở bước cuối (tương đương).
- **Kiểm tra trên trình duyệt thật:** mở `index.html` qua `file://` trong Chrome, đi hết 5 tab của 1 bài mỗi chương, chụp màn hình, xem console không có lỗi.
- **Soát toán học:** sau mỗi chương, một agent độc lập giải lại toàn bộ bài tập và so với đáp án.

## 10. Rủi ro

- **MathLive trên `file://`:** chưa chắc chạy được. Kiểm tra ngay đầu GĐ1. Nếu không được, dùng ô nhập văn bản có xem trước (mục 6).
- **`nerdamer.factor` với đa thức nhiều biến:** cần kiểm thử sớm. Nếu yếu, kiểm tra dạng nhân tử bằng cách xét từng nhân tử ở nút gốc (bậc ≥ 1, không chia hết cho nhau).
- **Nội dung lớn:** khoảng 400 bài tập. Soạn theo từng chương, kiểm tra tự động + agent soát toán học trước khi chuyển chương.
