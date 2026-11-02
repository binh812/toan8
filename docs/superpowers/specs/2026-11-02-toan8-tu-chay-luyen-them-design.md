# Toán 8 – Tự chạy hình động, Luyện thêm, Ôn kiến thức cũ, In phiếu, Nháp (thiết kế)

Ngày: 02/11/2026 · Phạm vi: app `D:\Appdev2-2026\toan-hoc` (đã có 39 bài, 447 bài tập, web https://binh812.github.io/toan8/)
Người dùng: một học sinh lớp 8 đang hổng kiến thức, học chủ yếu trên máy tính; phụ huynh theo dõi.

## 1. Mục tiêu và tiêu chí thành công
- Hình động **tự chạy** khi hiện ra, để chỉ cần nhìn là thấy quy luật; chạm vào là dừng để tự điều khiển.
- Mỗi bài có phần **Luyện thêm** không giới hạn, bài tương tự bài học, tự chấm, có lời giải và gợi ý, độ khó tự điều chỉnh.
- Phát hiện và vá **kiến thức nền lớp 6–7** bị hổng trước mỗi chương.
- **In phiếu** bài tập có đáp án; **nháp vẽ tay** khi làm bài.
- Thành công khi: mọi khamPha và hình lý thuyết có tự chạy có ý nghĩa; mọi bài có ≥ 3 dạng luyện thêm (bài khái niệm có thể dùng câu soạn tay); validator sinh 300 đề/dạng không lỗi; smoke toàn bộ sạch; soát toán độc lập không còn lỗi.

Giữ nguyên ràng buộc cũ: web tĩnh, chạy được qua `file://` và GitHub Pages; chỉ script thường (không module/fetch/CDN); mọi thứ gắn vào `window.TOAN8`; giao diện tiếng Việt, xưng "em".

## 2. Tự chạy hình động (`js/widgets/autoplay.js`)
### Hành vi
- Mỗi hình động đăng kí một **trình tự chạy** với `T.tuChay.dangKi(khung, trinh)`; `trinh = { buoc(dt), batDau?(), dung?() }` – `buoc` được gọi mỗi khung hình (requestAnimationFrame) với `dt` giây.
- Bắt đầu khi khung hình hiện ≥ 50% trên màn hình (IntersectionObserver); tạm dừng khi khuất; dừng hẳn khi trang đổi (`route` gọi `T.tuChay.huyHet()`).
- Người dùng `pointerdown`, `keydown`, `wheel` trong khung hoặc `input` trên thanh trượt của hình → **dừng** (không tự bật lại). Nút nổi góc trên phải khung: "⏸ Dừng" khi đang chạy / "▶ Tự chạy" khi dừng.
- `prefers-reduced-motion: reduce` → không tự bật, chỉ có nút.
- Khi tự chạy, phải cập nhật **giống hệt** người dùng thao tác (số đo, công thức, ràng buộc).
### Trình tự mặc định
| Hình | Mặc định |
|---|---|
| Thanh trượt HTML (`T.makeSliders`) | Lần lượt từng thanh: đi từ giá trị đầu → max → min → giá trị đầu (dạng sóng, ~4 s/thanh), tôn trọng `buoc` và `rangBuoc`, phát sự kiện `input` như người dùng |
| Thanh trượt JSXGraph trong `geo` | Như trên qua `slider.setValue` + `board.update()` |
| Điểm kéo được trong `geo` (không `fixed`, không phải glider) | Lần lượt từng điểm đi một vòng elip nhỏ (bán kính ~10% khung) quanh vị trí ban đầu rồi về chỗ cũ; mỗi bước `moveTo` + gọi các handler `drag` của điểm (giữ ràng buộc) + `board.update()`; điểm glider trượt qua lại trên đường của nó |
| `xacSuat` | Bấm "Thử 1 lần" mỗi 0,6 s đến 20 lần, rồi "Thử 10 lần" mỗi 0,8 s đến 500 lần, rồi "Làm lại" |
| `hinhChop` | Xoay đều; mỗi 8 s chạy thanh "Trải phẳng" 0 → 1 → 0 |
| `bieuDo` có `doiLoai` | Đổi loại mỗi 3 s |
| `dienTich`, `hieuHaiBinhPhuong` | Thanh trượt như trên; "Cắt và ghép" bật/tắt mỗi 3 s |
### Kịch bản riêng (ghi trong config hình)
`tuChay: false` (tắt) hoặc `tuChay: [ bước… ]`, mỗi bước là một trong:
- `{ thanhTruot: 'k', den: 2, giay: 2 }` – trượt thanh tên `k` tới giá trị 2 trong 2 s;
- `{ diem: 'M', den: [x, y], giay: 2 }` – kéo điểm tên `M` tới toạ độ (gọi handler `drag`);
- `{ nut: 'Cắt và ghép' }` – bấm nút có nhãn đó trong khung;
- `{ cho: 1 }` – đứng yên 1 s.
Kịch bản chạy lặp. Tác giả nội dung dùng kịch bản khi mặc định không thể hiện đúng ý bài (vd "kéo M từ A tới B để thấy tỉ số không đổi").

## 3. Luyện thêm (tab thứ 6)
### Nội dung: `content/luyen/luyenNN.js`
```js
TOAN8.luyen(6, [
  { ten: 'Khai triển (a ± b)²', muc: 1, sinh: function (r) {
      // r: bộ ngẫu nhiên có hạt giống
      return { de, dapAn, goiY: [...], loiGiai: [...], loiThuongGap?: [...], hinh? };
  } },
  …
], { deCo: [ câu hỏi cố định theo khuôn baiTap … ] });
```
- `r` (trong `js/core/rng.js`, UMD để Node dùng được): `r.so(a, b)` số nguyên trong [a, b], `r.khac0(a, b)`, `r.chon(mang)`, `r.dau()` (±1), `r.xaoTron(mang)`, `r.phanSo(...)`. Hạt giống cố định → cùng đề (để in phiếu, kiểm tra).
- Câu sinh ra có **đúng khuôn câu hỏi `baiTap`** (cùng widget hiển thị `T.mountQuestion`, cùng checker, cùng `hinh`).
- Mỗi bài ≥ 3 dạng, phủ mức 1–3; số liệu chọn để đáp số "đẹp" (nguyên hoặc phân số gọn) trừ khi đề yêu cầu làm tròn.
- Bài khái niệm (dự kiến: 10, 13, 14, 18, 19, 30 – tác giả quyết) bổ sung `deCo` ≥ 10 câu soạn tay.
### Giao diện tab "6. Luyện thêm"
- Hiện một câu một lúc; sau khi đúng (hoặc xem lời giải) có nút "Câu tiếp ▸".
- Mức thích ứng: bắt đầu mức 1; đúng 3 câu liên tiếp (không xem lời giải) → lên mức; sai 2 lần ở cùng câu hoặc phải xem lời giải ở 2 câu liên tiếp → xuống mức. Chọn dạng ngẫu nhiên trong mức, tránh lặp dạng vừa ra.
- Dòng trạng thái: mức hiện tại, chuỗi đúng, hôm nay đã luyện N câu (đúng M).
- Nút "🖨 In phiếu 10 câu" (mục 5).
- Lưu tiến độ: store thêm `luyen[id] = { lam, dung, ngay: {YYYY-MM-DD: [lam, dung]} }`; không ảnh hưởng `lessonStatus`/mastery; có trong xuất/nhập file tiến độ.
- Ôn tập cuối năm: mỗi chương được chọn lấy thêm câu sinh từ luyện thêm (mức 2–3) khi kho `baiTap` không đủ đa dạng.

## 4. Ôn kiến thức cũ
- `content/nen/nenXX.js` – khoảng 12 bài nền lớp 6–7, khuôn rút gọn: `TOAN8.nen({ id:'phanSo', ten, lop, tomTat:[khối lý thuyết như lyThuyet], viDu:[…], luyen:[dạng sinh như mục 3] })`. Route `#/nen/<id>` hiện tóm tắt → ví dụ → luyện thêm.
- Kiểm tra đầu chương: trong `content/index.js` mỗi chương có `kiemTra: [ { nen:'phanSo', cau: {câu hỏi khuôn baiTap} } … ]` (5–6 câu). Route `#/kiem-tra/<so>`: làm tất cả rồi bấm "Xem kết quả" → danh sách bài nền cần ôn (câu sai/không làm) kèm link; câu đúng hết → "Em sẵn sàng học chương này!".
- Trang chủ: mỗi đầu chương có nút "Kiểm tra đầu chương"; có mục "Ôn kiến thức cũ (lớp 6–7)" liệt kê các bài nền.

## 5. In phiếu bài tập
- Route `#/phieu/<nguon>` (nguon = `bai-NN` hoặc `cuoi-nam-<danh sách chương>`), tham số số câu (mặc định 10) và hạt giống.
- Trang in: tiêu đề, họ tên/ngày (dòng trống), 10 câu đánh số kèm hình (nếu có), chỗ trống để làm; **trang sau**: đáp án và lời giải ngắn. CSS `@media print` ẩn thanh điều hướng/nút; khổ A4; công thức KaTeX in rõ.
- Nút "In" gọi `window.print()`; nút "Đề khác" đổi hạt giống.
- Câu `chon` in phương án A–D; câu `nhieuO` in các ô kèm nhãn.

## 6. Nháp vẽ tay
- Mỗi thẻ câu hỏi (`T.mountQuestion`, kể cả luyện thêm, ôn tập) có nút "✏️ Nháp" bật/tắt khung `<canvas>` ngay dưới câu (cao 260 px, rộng theo thẻ).
- Pointer events (chuột, bút, cảm ứng; có áp lực nếu bút hỗ trợ), bút 3 màu, tẩy, "Xoá hết". Không lưu khi rời trang. Canvas co giãn theo kích thước, xử lý devicePixelRatio.

## 7. Thay đổi kiến trúc
- File mới: `js/core/rng.js`, `js/widgets/autoplay.js`, `js/widgets/luyen.js` (tab luyện thêm + đăng kí `T.luyen`), `js/widgets/nen.js` (bài nền + kiểm tra đầu chương), `js/widgets/phieu.js`, `js/widgets/nhap.js`, `content/luyen/luyen01–39.js`, `content/nen/*.js`.
- Sửa: `app.js` (tab 6, các route mới, nút trang chủ, gọi `huyHet`), `sliders.js`/`geo.js`/`prob.js`/`solid3d.js`/`chart.js`/`tiles.js` (đăng kí trình tự chạy), `practice.js` (nút Nháp), `store.js` (luyen), `review.js` (dùng thêm câu sinh), `index.html`, `css/app.css`, `tools/validate-content.js`, `tools/smoke-all.js` (thêm tab 6 và route mới).
- Validator: nạp `rng.js`; mỗi dạng sinh 300 hạt giống – kiểm như `baiTap` (đáp án tự chấm đúng, dòng cuối lời giải khớp, lỗi thường gặp ≠ đáp án, KaTeX render, không có `undefined`/`NaN`/`Infinity` trong chữ, không ném lỗi); kiểm `kiemTra` trỏ tới bài nền có thật; kiểm kịch bản `tuChay` trỏ tới thanh trượt/điểm/nút có tên đúng (ở mức tĩnh: tên có trong config/build).

## 8. Kiểm thử
- Node: `rng` (cùng hạt giống → cùng dãy; khoảng giá trị), store `luyen` (ghi, xuất/nhập), thuật toán mức thích ứng (hàm thuần `T.mucTiepTheo(trangThai, ketQua)`), validator với fixture dạng sinh đúng/sai.
- Trình duyệt (Edge chạy ngầm): smoke-all có 6 tab + route `nen`, `kiem-tra`, `phieu`; kiểm tự chạy: mở khamPha, chờ 2 s → trạng thái hình đã đổi; phát `pointerdown` → dừng, nút hiện "▶ Tự chạy"; trang phieu có đủ 10 câu và trang đáp án; nháp vẽ được nét.
- Soát toán độc lập theo chương trên **mẫu đề sinh ra** (mỗi dạng ≥ 20 đề in ra file) và trên `deCo`, bài nền, kiểm tra đầu chương.
- Rà code độc lập toàn bộ phần mới trước khi gộp vào `main`.

## 9. Ngoài phạm vi
Đọc to (anh chưa chọn); AI gia sư (cần máy chủ/khoá API); tài khoản người dùng, đồng bộ đám mây; lưu nét nháp.
