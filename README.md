# Toán 8 – Học cùng hình động

Ứng dụng học Toán 8 theo SGK **Toán 8 – Kết nối tri thức với cuộc sống** (NXB Giáo dục Việt Nam).
Mỗi bài có 5 bước: Khám phá → Lý thuyết → Ví dụ → Tự làm → Tìm lỗi sai.

## Cách mở
Bấm đúp `index.html` (Chrome hoặc Edge). Không cần mạng, không cần cài đặt.
Tiến độ lưu trong trình duyệt của máy đang dùng; nút "Lưu tiến độ ra file" ở cuối trang chủ để sao lưu.

## Cho người phát triển
- `npm install` rồi `npm run libs` – chép thư viện vào `lib/` (đã có sẵn trong repo).
- `npm test` – kiểm thử parser, chấm đáp án, lưu tiến độ, kiểm tra nội dung.
- `npm run validate` – kiểm tra toàn bộ file bài học trong `content/`.

## Nguồn và giấy phép
- Nội dung bài tập, ví dụ, lời giải là tự soạn theo dạng bài SGK; mỗi bài ghi trang SGK tương ứng.
  SGK gốc (bản PDF, chỉ dùng tham khảo trong gia đình) không nằm trong repo.
- Thư viện (xem `lib/VERSIONS.txt`): KaTeX (MIT), JSXGraph (LGPL/MIT), MathLive (MIT), nerdamer (Apache-2.0 / xem `lib/nerdamer/LICENSE.md`).
