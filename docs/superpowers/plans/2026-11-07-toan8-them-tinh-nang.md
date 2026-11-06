# Bốn tính năng thêm: thử phá, soi chi tiết, lắp chứng minh, mục tiêu bài

**Bối cảnh:** cả 39 bài đã có phần "Nhìn là hiểu". Phụ huynh đã chọn làm thêm bốn tính năng, lấy ý từ repo nclamvn/bai-giang (MIT).

**Phần chung đã xong, có test.** Bài 35 là bài mẫu đầy đủ cả bốn tính năng, nên đọc `content/bai35.js` và cảnh `toHopHinhVuong` trong `js/canh/hinhVuong.js`.

## Cách hoạt động (phần chung)

### 1. Thử phá
- **Trong cảnh:** khai báo một tham số có `pha: true`. Giá trị `md` là giá trị giữ cho định lí đúng. Khi `p[...]` lệch khỏi `md`, `tinh` trả `k.pha = { hong: true, chu: '…' }`. Khi định lí còn đúng, `tinh` vẫn trả `k.pha`, với `hong: false` và `chu` khẳng định công thức.
  - `chu` nói rõ công thức hỏng ở đâu, kèm số. Ví dụ: "Góc 120°: $a^2 + b^2 = 25$ nhưng $c^2 \approx 37$…".
  - `ve` vẽ thêm điều cho thấy chỗ hỏng: nét đứt `--sai`, mảnh hở, đường không cắt…
- **Trong nội dung:** đặt `nhin.canh.thuPha: true`. Khi đó widget mới hiện thanh trượt "Thử phá" và ô báo. Ở mọi chỗ khác, tham số pha bị ẩn và giữ giá trị `md`.
- **Validator kiểm:** có tham số pha; `tinh` trả `k.pha` ở `min`, `md`, `max`; ở `md` thì không được báo hỏng.

### 2. Soi chi tiết
- Trong `ve`, gắn thuộc tính `'data-soi': 'khoá'` cho các phần đáng soi: mảnh, cạnh, góc, khối…
- Thêm hàm `C.lay('tenCanh').soi = function (k, p, o) { return { khoá: { tieuDe, chu } } }`.
  - `chu` có số đo hiện tại lấy từ `k`, cộng thêm "vì sao" (căn cứ toán).
  - Số dùng `C.fmt(x).replace(',', '{,}')` trong `$…$`.
- Nội dung có thể ghi đè từng khoá bằng `canh.soi: { khoá: { tieuDe, chu } }`.
- Bấm vào phần tử thì widget hiện thẻ. Thẻ tự cập nhật khi kéo thanh trượt.

### 3. Lắp chứng minh (`js/core/lapcm.js`, `js/widgets/lapcm.js`)
- Thêm một khối vào `lyThuyet`, đặt **sau** khối phát biểu định lí:
  `{ loai: 'lapCM', tieuDe, config: { de, canh?, buoc: [{ id, chu, can: [id…], canh?: { t, trangThai } }], ketLuan } }`.
- Mỗi bước ghi đúng một ý. `can` là các bước *thật sự* làm căn cứ cho ý đó.
  - Đừng nối dây chuyền giả: chỉ nối khi bước sau dùng bước trước.
  - Phải có ít nhất hai thứ tự đúng, để em được chọn chứ không chỉ đi theo đường thẳng.
  - Câu chữ ở các bước không được để lộ thứ tự, ví dụ đừng bắt đầu bằng "Bước 1", "Trước hết".
- Validator kiểm: id trùng, căn cứ không có, vòng tròn, thiếu `ketLuan`, cảnh đi kèm.

### 4. Mục tiêu bài
- Thêm `mucTieu: ['…', '…']`, từ 3 đến 5 câu, đặt ngay trước `lyThuyet`.
- Mỗi câu là một việc học sinh **làm được**, đo được. Ví dụ: "Nói được vì sao … bằng cách chỉ vào hình", "Tính …", "Nhận ra …".
- Bám nội dung bài và SGK Kết nối tri thức. Không ghi là "trích chương trình".
- Mục tiêu hiện dưới tiêu đề bài và trên trang `#/phu-huynh`.

## Giao việc

Mỗi agent làm hai chương, chỉ sửa file của mình: `content/baiNN.js` và file cảnh của chương.

| Agent | Chương | File cảnh |
|---|---|---|
| A | I, II | khoiDaiSo.js, manhDaiSo.js, hangDangThuc.js |
| B | III, IV | tuGiac.js, thales.js |
| C | V, VI | duLieu.js, phanThuc.js |
| D | VII, VIII | hamSo.js, caiCan.js, xacSuat.js |
| E | IX, X | dongDang.js, hinhVuong.js (bài 35 đã xong, giữ nguyên), hinhChop.js |

**Mỗi bài cần:**
1. `mucTieu`: mọi bài.
2. Soi chi tiết: cho cảnh Nhìn của mọi bài, mỗi cảnh 3–6 khoá có ý nghĩa.
3. Thử phá: cho cảnh Nhìn của các bài có định lí hay điều kiện rõ ràng. Gợi ý:
   - bài 4–6, 9: số âm;
   - bài 10: tứ giác lõm;
   - bài 11: hai góc đáy khác nhau;
   - bài 12–14: bỏ một điều kiện của dấu hiệu;
   - bài 15: hai đường không song song;
   - bài 16: M không là trung điểm;
   - bài 17: AD không là phân giác;
   - bài 21–24: mẫu bằng 0;
   - bài 25: nhân hai vế với 0;
   - bài 29: hai hệ số góc khác nhau;
   - bài 31: các kết quả không đồng khả năng;
   - bài 33–34: góc không bằng nhau;
   - bài 37: phóng to không đều hai chiều;
   - bài 38: đáy không đều.
   Bài không có điều kiện để phá (chương V, bài 1–3, 18–20, 26–27, 30, 32, 39) thì bỏ qua, và ghi lí do vào báo cáo.
4. Lắp chứng minh: cho các bài có chứng minh hay lập luận nhiều bước. Chủ yếu là bài 10–17, 33–34, 36–38; thêm các bài khác nếu hợp, ví dụ 6, 25, 29, 31. Mỗi bài một khối, 5–9 bước.

## Chuẩn và kiểm (như các lần trước)
- Chuẩn chất lượng: mục "Chuẩn chất lượng" trong `docs/superpowers/plans/2026-11-06-toan8-nhin-la-hieu-moc2-4.md`.
- Không commit. Ghi file có `\` bằng Write/Edit. Sửa cảnh thì giữ nguyên hành vi cũ, và mọi test hiện có phải qua.
- Thêm test cho `tinh` ở thử phá: ở `md` thì không hỏng, lệch thì hỏng, số trong `pha` đúng toán. Thêm test cho `soi`: có khoá, có số.
- Chạy:
  - `npm test`;
  - `node tools/validate-content.js <các file của mình>`;
  - `node tools/smoke-canh.js`;
  - `node tools/smoke-nhin.js`;
  - chụp `node tools/smoke.js bai/N/khamPha` và `bai/N/lyThuyet` rồi tự xem. Muốn thấy trạng thái bấm hay kéo thì dùng `--eval`.
- Báo cáo bằng tiếng Việt, cho từng bài: mục tiêu đã thêm; các khoá soi; thử phá dùng tham số nào, hoặc lí do bỏ qua; lắp chứng minh có mấy bước; kết quả từng lệnh kiểm.
