# Toán 8 – Học cùng hình động

Ứng dụng học Toán 8 theo SGK **Toán 8 – Kết nối tri thức với cuộc sống** (NXB Giáo dục Việt Nam).
Mỗi bài có 5 bước: Khám phá → Lý thuyết → Ví dụ → Tự làm → Tìm lỗi sai.

## Cách mở
**Dùng ngay trên mạng:** https://binh812.github.io/toan8/

Hoặc tải về rồi bấm đúp `index.html` (Chrome hoặc Edge) – chạy được không cần mạng, không cần cài đặt.
Tiến độ lưu trong trình duyệt của máy đang dùng; nút "Lưu tiến độ ra file" ở cuối trang chủ để sao lưu.

## Hướng dẫn cho phụ huynh
- **Học một bài:** ở trang chủ bấm vào thẻ bài → đi lần lượt 5 tab. Khuyến khích con làm thử trước khi bấm Gợi ý;
  gợi ý có 3 nấc: nhắc kiến thức → gợi ý bước làm → lời giải đầy đủ.
- **Cách gõ đáp án:** ô nhập công thức hiểu cả kiểu gõ thường: `x^2+6x+9`, `2x(x+1)`, `(x+1)/(x-2)`, số thập phân `0,5`, phân số `3/4`.
  Bài tìm x ghi các nghiệm cách nhau bằng dấu `;` (vd `x = 2; x = -3`).
- **Máy chấm thế nào:** đúng giá trị nhưng chưa đúng dạng đề yêu cầu (chưa khai triển hết, chưa phân tích triệt để, chưa rút gọn)
  sẽ báo màu vàng; gõ trúng một lỗi hay gặp (vd $(a+b)^2 = a^2+b^2$) sẽ được giải thích đúng lỗi đó.
- **Thành thạo:** đúng ≥ 80% bài mức 1–2 mà không phải mở lời giải, và đúng ít nhất 1 bài mức 3.
- **Ôn 5 câu hôm nay** (góc trên phải): câu làm sai quay lại sau 1 ngày, làm đúng thì giãn ra 2, 4, 8, 16 ngày.
- **Ôn tập cuối năm** (nút ở trang chủ): chọn các chương cần ôn, bấm "Tạo đề" để có 10 câu vận dụng trộn từ các chương; bấm lại để có đề mới.
- **Hình động tự chạy**: ở Khám phá và Lý thuyết, hình tự chuyển động khi hiện ra để con nhìn thấy quy luật; con chạm vào hình là dừng để tự kéo thử, nút ▶/⏸ ở góc hình để bật lại.
- **6. Luyện thêm** (tab cuối mỗi bài): máy tự tạo bài tương tự bài học, làm bao nhiêu cũng được; đúng 3 câu liền thì lên mức khó hơn, sai nhiều thì xuống mức dễ hơn. Có nút **In phiếu 10 câu** (đáp án ở trang sau).
- **Kiểm tra đầu chương** (bên cạnh tên chương ở trang chủ): 5–6 câu kiến thức cũ; làm xong máy chỉ ra phần lớp 6–7 cần ôn. Các bài **Ôn kiến thức cũ** nằm cuối trang chủ.
- **✏️ Nháp**: nút dưới mỗi câu hỏi mở khung vẽ tay bằng chuột hoặc bút.
- **Phụ huynh xem tiến độ:** thanh tiến độ trên từng thẻ bài ở trang chủ; tab có dấu ✓ là con đã mở.

## Hiện có
Đủ cả năm: 10 chương, 39 bài của SGK (Tập 1 và Tập 2), 447 bài tập có lời giải.
Hình động theo từng chương: mô hình diện tích (hằng đẳng thức), hình kéo được (tứ giác, Thalès, đồng dạng), đồ thị có thanh trượt
(hàm số bậc nhất), biểu đồ đổi dạng (thống kê), thí nghiệm tung đồng xu/gieo xúc xắc/vòng quay (xác suất), hình chóp 3D xoay và trải phẳng.

Cách học "Nhìn là hiểu" đang thử trên 3 bài: bài 6 (hằng đẳng thức), bài 25 (phương trình), bài 35 (Pythagore). Tab đầu cho thấy bằng hình vì sao công thức đúng, giải một bài ngay trên hình (gõ sai thì hình chỉ ra sai ở đâu), rồi đến ba đề cùng một khuôn.

## Cho người phát triển
- `npm install` rồi `npm run libs` – chép thư viện vào `lib/` (đã có sẵn trong repo).
- `npm test` – kiểm thử parser, chấm đáp án, lưu tiến độ, kiểm tra nội dung.
- `npm run validate` – kiểm tra toàn bộ file bài học trong `content/`.
- `node tools/smoke.js bai/6/tuLam --shot out.png` – mở app bằng Edge/Chrome chạy ngầm, báo lỗi console, chụp màn hình.
- Sửa/thêm bài: `content/baiNN.js` theo khuôn trong `docs/superpowers/plans/` (mỗi bài có sẵn thẻ `<script>` trong `index.html`), chạy validate.
- Luyện thêm: `content/luyen/luyenNN.js` – `TOAN8.luyen(id, [{ ten, muc, sinh(r, cc) }], { deCo })`, mỗi dạng trả về một câu hỏi theo hạt giống (`js/core/rng.js`); validator sinh thử 300 đề mỗi dạng. In mẫu đề để soát: `node tools/dump-luyen.js <id>`.
- Bài nền lớp 6–7: `content/nen/*.js` – `TOAN8.nen({ id, ten, lop, tomTat, viDu, luyen })`; kiểm tra đầu chương: `kiemTra` trong `content/index.js`.
- Tự chạy: `js/widgets/autoplay.js` dựng sẵn cho thanh trượt, điểm kéo, xác suất, hình chóp, biểu đồ; kịch bản riêng qua `config.tuChay`. Kiểm: `node tools/smoke-tuchay.js`.
- Nhìn là hiểu: khối `nhin` trong `content/baiNN.js` (khuôn ở `docs/superpowers/specs/2026-11-04-toan8-nhin-la-hieu-design.md`); cảnh hình ở `js/canh/` gồm `tinh` (test trong `tests/canh.test.js`) và `ve`; kiểm bằng `node tools/smoke-canh.js`, `node tools/smoke-nhin.js`.
- Hình động: `js/widgets/` – `dienTich`, `geo` (JSXGraph), `figure.js` (hình tĩnh cho đề), `doThi`, `hinhChop`, `bieuDo`, `xacSuat`; cấu hình ghi ở chú thích `cfg:` đầu mỗi hàm.

## Nguồn và giấy phép
- Nội dung bài tập, ví dụ, lời giải là tự soạn theo dạng bài SGK; mỗi bài ghi trang SGK tương ứng.
  SGK gốc (bản PDF, chỉ dùng tham khảo trong gia đình) không nằm trong repo.
- Thư viện (xem `lib/VERSIONS.txt`): phông Be Vietnam Pro và Bricolage Grotesque (OFL, `lib/fonts`), KaTeX (MIT), JSXGraph (LGPL/MIT), MathLive (MIT), nerdamer (Apache-2.0 / xem `lib/nerdamer/LICENSE.md`).
