# Toán 8 – Học cùng hình động

Ứng dụng học Toán 8 theo SGK **Toán 8 – Kết nối tri thức với cuộc sống** (NXB Giáo dục Việt Nam).
Mỗi bài có 5 bước: Khám phá → Lý thuyết → Ví dụ → Tự làm → Tìm lỗi sai.

## Cách mở
Bấm đúp `index.html` (Chrome hoặc Edge). Không cần mạng, không cần cài đặt.
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
- **Phụ huynh xem tiến độ:** thanh tiến độ trên từng thẻ bài ở trang chủ; tab có dấu ✓ là con đã mở.

## Hiện có
Giai đoạn 1: Chương I (Đa thức), Chương II (Hằng đẳng thức), Chương IV (Định lí Thalès) – 12 bài.
Các chương còn lại hiện "Sắp có" (giai đoạn 2: Chương III, VI, VII, IX, X; giai đoạn 3: Chương V, VIII, ôn tập cuối năm).

## Cho người phát triển
- `npm install` rồi `npm run libs` – chép thư viện vào `lib/` (đã có sẵn trong repo).
- `npm test` – kiểm thử parser, chấm đáp án, lưu tiến độ, kiểm tra nội dung.
- `npm run validate` – kiểm tra toàn bộ file bài học trong `content/`.
- `node tools/smoke.js bai/6/tuLam --shot out.png` – mở app bằng Edge/Chrome chạy ngầm, báo lỗi console, chụp màn hình.
- Thêm bài mới: tạo `content/baiNN.js` theo khuôn trong `docs/superpowers/plans/`, thêm thẻ `<script>` vào `index.html`, chạy validate.

## Nguồn và giấy phép
- Nội dung bài tập, ví dụ, lời giải là tự soạn theo dạng bài SGK; mỗi bài ghi trang SGK tương ứng.
  SGK gốc (bản PDF, chỉ dùng tham khảo trong gia đình) không nằm trong repo.
- Thư viện (xem `lib/VERSIONS.txt`): KaTeX (MIT), JSXGraph (LGPL/MIT), MathLive (MIT), nerdamer (Apache-2.0 / xem `lib/nerdamer/LICENSE.md`).
