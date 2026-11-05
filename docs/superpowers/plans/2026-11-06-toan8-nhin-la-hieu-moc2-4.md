# Nhìn là hiểu – Mốc 2 đến 4 (36 bài còn lại)

**Spec:** `docs/superpowers/specs/2026-11-04-toan8-nhin-la-hieu-design.md` (đọc mục 2, 4, 5, 6, 8).
**Bản mẫu đã duyệt:** bài 6, 25, 35 (`content/bai06.js`, `bai25.js`, `bai35.js`) và trang thật `node tools/smoke.js bai/35/khamPha --full --shot x.png`.
**Cách làm:** mỗi agent một chương, chỉ sửa file của mình; em (phiên chính) gộp, soát độc lập, rà code, rồi đưa lên web.

## Giao việc

| Agent | Bài | File được sửa |
|---|---|---|
| Chương I | 1–5 | `content/bai01–05.js`, `content/luyen/luyen01–05.js`, `js/canh/khoiDaiSo.js`, `js/canh/manhDaiSo.js`, `tests/canh-khoiDaiSo.test.js` |
| Chương II | 7, 8, 9 và luyện thêm bài 6 | `content/bai07–09.js`, `content/luyen/luyen06–09.js`, `js/canh/hangDangThuc.js`, `tests/canh-hangDangThuc.test.js` |
| Chương III | 10–14 | `content/bai10–14.js`, `content/luyen/luyen10–14.js`, `js/canh/tuGiac.js`, `tests/canh-tuGiac.test.js` |
| Chương IV | 15–17 | `content/bai15–17.js`, `content/luyen/luyen15–17.js`, `js/canh/thales.js`, `tests/canh-thales.test.js` |
| Chương V | 18–20 | `content/bai18–20.js`, `content/luyen/luyen18–20.js`, `js/canh/duLieu.js`, `tests/canh-duLieu.test.js` |
| Chương VI | 21–24 | `content/bai21–24.js`, `content/luyen/luyen21–24.js`, `js/canh/phanThuc.js`, `tests/canh-phanThuc.test.js` |
| Chương VII | 26–29 và luyện thêm bài 25 | `content/bai26–29.js`, `content/luyen/luyen25–29.js`, `js/canh/hamSo.js`, `js/canh/caiCan.js`, `tests/canh-hamSo.test.js` |
| Chương VIII | 30–32 | `content/bai30–32.js`, `content/luyen/luyen30–32.js`, `js/canh/xacSuat.js`, `tests/canh-xacSuat.test.js` |
| Chương IX | 33, 34, 36, 37 và luyện thêm bài 35 | `content/bai33,34,36,37.js`, `content/luyen/luyen33–37.js`, `js/canh/dongDang.js`, `js/canh/hinhVuong.js`, `tests/canh-dongDang.test.js` |
| Chương X | 38, 39 | `content/bai38–39.js`, `content/luyen/luyen38–39.js`, `js/canh/hinhChop.js`, `tests/canh-hinhChop.test.js` |

Mọi file khác chỉ đọc: `js/canh/loi.js`, widget, CSS, công cụ kiểm, `index.html` (đã có thẻ script cho mọi file cảnh), `tests/canh.test.js`. Cần sửa chỗ chung thì ghi vào báo cáo, không tự sửa. **Không commit.**

## Mỗi bài cần có

1. **Khối `nhin`** đặt trước `khamPha` (xem bài 35):
   - `tieuDe`, `loai: 'chungMinh' | 'minhHoa'`, `luuY` khi cần, `canh`, `buoc: [{ t, chu }]` với t tăng dần, `ketLuan`.
   - `dung`: `{ tieuDe, tuBai, canh, moiThu, phanUng: [{ gt, trangThai?, thamSo?, t?, loi }], soBatKi?(v) → { thamSo?, trangThai?, t?, loi }, khiDung?, dungChu, saiChu, saiDangChu? }`. Đề, đáp án, gợi ý lấy từ bài tập `tuBai`; ghi đè `de`, `dapAn`, `goiY`, `loiGiai`, `loiThuongGap` khi cần.
   - `suyRa`: `{ tieuDe, baDe: [3 × { tuBai, canh, tenNut, dungChu, saiChu, phanUng? }], cachNhan }`. Ba đề trông khác nhau nhưng cùng một khuôn với phần Nhìn.
2. **Mọi `viDu`** có `canh` (hình tiến theo từng bước; `buoc[i].canh = { t, thamSo?, trangThai? }` khi cần chỉ định) hoặc `hinh`.
3. **Mọi `baiTap`** có `hinh`, `hinhGiai` hoặc `khongHinh: 'lí do'`. `hinhGiai` chỉ hiện từ gợi ý cuối. Lỗi hay gặp vẽ được thì thêm `loiThuongGap[i].hinh`.
4. **Luyện thêm:** mọi dạng mức 1 và 2 trả về `hinhGiai: { widget: 'canh', config: { ten, tuyChon, thamSo, chiXem: true, t: 1 } }` theo chính số của đề, hoặc dạng ghi `khongHinh: 'lí do'`.
5. Giữ nguyên `dapAn` gốc của bài tập. Đề đổi câu hỏi hoặc viết mới phải tự giải lại.

## Viết cảnh (js/canh/<tên>.js)

```js
(function (C) {
  'use strict';
  C.dangKi('tenCanh', {
    thamSo: { a: { min, max, step, md, nhan: 'Cạnh a', mau: '--a' } },   // thanh đổi số ở phần Nhìn
    trangThai: { tenTrangThai: true },                                      // p.trangThai do bài tập đặt; 'giai' = em làm đúng
    tinh: function (p, t, o) { /* thuần toán, không đụng DOM; trả về toạ độ và số */ }
  });
  C.lay('tenCanh').ve = function (svg, k, p, t, o) { /* đặt viewBox, vẽ bằng C.mk, C.chu, C.diem, C.fmt, C.muot, C.noiSuy, C.kep */ };
})(typeof module === 'object' && module.exports ? require('./loi.js') : window.TOAN8.canh);
```

- Cấu hình cảnh trong nội dung: `{ ten, tuyChon, thamSo, moTa, ghiChu, dongSo(p, f), giay }`. `p.thu` là số em gõ (qua `soBatKi`).
- Màu: `--a` cam, `--b` xanh dương, `--cc` xanh lá, `--cd` tím chưa có (dùng `--tg` xám hoặc màu chương), `--tg`, `--sai`, `--muc`, `--mat`, `--nhat`. KaTeX: `\\ca{} \\cb{} \\cc{} \\cd{}`.
- Test `tests/canh-<tên>.test.js`: kiểm **tính chất toán thật** của `tinh` (tổng diện tích giữ nguyên, tỉ số không đổi, góc bằng 90°, xác suất cộng lại bằng 1…) với nhiều tham số và `t ∈ {0, .25, .5, .75, 1}`, không có NaN.
- Có thể dùng lại cảnh sẵn có: `toHopHinhVuong`, `baHinhVuong`, `tamGiacAn`, `manhVuong`, `caiCan` (đọc file để biết `tuyChon`).

## Chuẩn chất lượng (rút từ lần soát mốc 1)

- **Hình phải nói đúng toán**, không chỉ đáp án đúng. Hỏi: nhãn `chungMinh` có xứng không? Có chỗ nào hình ngầm giả định điều cần chứng minh? Thiếu lí do (ví dụ góc 90°) thì thêm vào `buoc`. Không chắc thì để `minhHoa` và viết `luuY` nêu lập luận chung.
- **Không lộ đáp án:** ở `t = 0` và trước khi em làm, hình không được ghi sẵn kết quả. Dùng `?`, giấu nhãn tới `t` cuối, hoặc `tuyChon.anLucDau`.
- **Số làm tròn ghi `≈`**, không ghi `=`. Hình không đúng tỉ lệ thì `ghiChu: 'Hình không theo tỉ lệ.'`. Hình chỉ đúng với một điều kiện (ví dụ x > 3) thì ghi điều kiện.
- **Mỗi lỗi hay gặp có câu nhắc riêng** qua `phanUng` (quên lấy căn, nhầm cạnh, quên đổi dấu…). Câu nhắc không được bảo em làm đúng phép em vừa làm.
- **Chữ trong hình đọc được** khi hình rộng khoảng 320px (thẻ Suy ra): cỡ chữ theo đơn vị viewBox, khoảng 1/16 chiều rộng khung trở lên. Nhãn không chồng nhau.
- **Chữ và hình khớp nhau:** bước chữ sáng đúng lúc hình làm điều đó (hình đứng yên khoảng 10% đầu).
- **Tiếng Việt tự nhiên**, câu ngắn, xưng "em". Chỉ dùng kiến thức lớp 8 trở xuống.
- Chuỗi trong file JS: `\\frac` (hai dấu `\`). Ghi file bằng Write/Edit, **không** dùng heredoc hay sed với `\`. `String.replace` có `$'` phải truyền hàm.

## Kiểm trước khi báo xong

1. `npm test`, và `node tools/validate-content.js content/baiNN.js … content/luyen/luyenNN.js` với mọi file của chương. Kết quả phải là `OK`.
2. `node tools/smoke-canh.js` và `node tools/smoke-nhin.js`. Hai lệnh này chạy cả chương khác đang làm dở, nên chỉ cần sạch các dòng về bài của mình.
3. Chụp và **tự xem** bằng Read:
   - `node tools/smoke.js bai/N/khamPha --full --shot <scratchpad>/N.png` (route không có `#/`).
   - Các tab `viDu` và `tuLam`.
   - Khổ hẹp: `--width 400`.
4. Tự giải lại mọi đề trong `nhin` và kiểm mọi số trên hình.

**Báo cáo:**
- Từng bài: cảnh dùng, `loai` và lí do.
- Các bài tập ghi `khongHinh`.
- Kết quả từng lệnh kiểm.
- Những gì cần phiên chính sửa ở chỗ chung.
