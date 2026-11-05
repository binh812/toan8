# Nhìn là hiểu – Mốc 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng khung "cảnh" hình động, giao diện mới và làm trọn vẹn bài 35, 6, 25 theo cách "Nhìn là hiểu", đưa lên web cho cháu thử rồi dừng để phụ huynh duyệt.

**Architecture:** Mỗi cảnh tách `tinh` (thuần toán, test trong Node) khỏi `ve` (SVG). Widget `canh` lo chạy, tua, đổi số, sáng bước và nối `T.tuChay`. Tab đầu vẫn có khoá `khamPha`, nhưng bài có khối `nhin` sẽ hiện trang mới và giữ hình cũ ở cuối; bài chưa có `nhin` không đổi.

**Tech Stack:** JS thuần (script thường, `window.TOAN8`), SVG, `node --test`, puppeteer-core + Edge, KaTeX, `@fontsource` cho phông.

**Spec:** `docs/superpowers/specs/2026-11-04-toan8-nhin-la-hieu-design.md`. Bản mẫu chuẩn: `docs/mau/pythagore-nhin-la-hieu.html`.

## Global Constraints

- Chạy được cả `file://` lẫn GitHub Pages: không ES module, không fetch, không CDN; mọi thư viện và phông nằm trong `lib/` qua `npm run libs`.
- Đề, đáp án, bộ chấm và 296 dạng tự sinh giữ nguyên. Đề đổi câu hỏi hoặc viết mới phải qua validator và soát toán.
- Màu có nghĩa: cam, xanh dương, xanh lá, tím luôn gắn với cùng đại lượng trong hình và công thức (`\ca \cb \cc \cd`).
- Hình đúng tỉ lệ, khác đi thì ghi "hình không theo tỉ lệ". `loai: 'minhHoa'` phải hiện câu "Hình cho thấy một trường hợp, chưa phải chứng minh".
- `prefers-reduced-motion`: không tự chạy, vẫn tua tay được. Chạm thật vào hình là dừng.
- Giao diện chỉ thiết kế sáng. Từ 900px trở lên hình một bên, chữ một bên; hẹp hơn xếp dọc.
- Không game hoá, không AI, không âm thanh, không máy chủ.
- Nội dung có `\` chỉ viết bằng Write/Edit, không dùng heredoc hay sed. Không commit PDF SGK.
- Phần Dùng và Suy ra không ghi vào tiến độ (`record: false`).

## Review Focus

1. Đổi tham số giữa lúc đang tự chạy hoặc khi `a`, `b` ở biên: hình không nhảy sai, không có `NaN`, nhãn không rơi khỏi khung. (Task 1, Task 2)
2. Gõ số rất lớn, âm, bằng 0 hoặc chữ vào phần Dùng: hình không vỡ, có câu nhắc rõ ràng. (Task 2, Task 3)
3. Chuyển trang khi cảnh đang chạy, rồi quay lại: không chạy ngầm, không lỗi console. (Task 2)
4. Cách gõ hợp lệ khác của đáp án (`x^2+10x+25`, `x²+10x+25`, `25+10x+x^2`) đều được nhận và không kích hoạt nhầm `phanUng`. (Task 3)
5. Bài chưa có `nhin` (36 bài còn lại) hiện y như cũ, kể cả tên tab và tự chạy. (Task 3, Task 5)

---

### Task 1: Lõi cảnh và ba họ cảnh thuần toán

**Files:**
- Create: `js/canh/loi.js`, `js/canh/hinhVuong.js`, `js/canh/manhDaiSo.js`, `js/canh/caiCan.js`
- Test: `tests/canh.test.js`

**Interfaces:**
- Produces, UMD như `js/core` (`module.exports` trong Node, `window.TOAN8.canh` trên web):
  - `canh.dangKi(ten, { thamSo, trangThai?, tinh(p, t, tuyChon), ve(svg, kq, p, t, tuyChon) })`, `canh.lay(ten)`; trùng tên thì ném lỗi.
  - `canh.muot(x)`, `canh.noiSuy(a, b, k)`, `canh.kep(x, a, b)`.
  - `thamSo`: `{ ten: { min, max, step, md, nhan? } }`. `t` trong `[0, 1]`.
- Họ cảnh (`ve` viết ở Task 2):
  - `toHopHinhVuong`: `tinh({a,b}, t)` → `{ s, tamGiac: [[x,y]×3]×4, oC, oA, oB, phanTrong }`; bốn tam giác trượt lần lượt như bản mẫu (mốc bắt đầu `0, 0, .3, .6`, độ dài `.4`).
  - `baHinhVuong`: `tuyChon { a, c, tenA, tenC }`, `p.thu` là độ cao em gõ; `tinh` → `{ h, dienTich: {a, c, h}, thu: { h, dai } | null }`.
  - `tamGiacAn`: `tuyChon.mau` là `'hcn' | 'can' | 'taxi'`; `tinh` → `{ canhA, canhB, huyen, dinh }`.
  - `manhVuong`: `tuyChon.dang` là `'tong' | 'hieu' | 'hieuHaiBP'`; `tinh({a,b}, t)` → `{ manh: [{ ten, x, y, w, h, dau }], khung }`. `trangThai.thieuHaiManh` ẩn hai mảnh `ab`.
  - `caiCan`: `tuyChon { trai: {x, so}, phai: {x, so}, buoc: [...] }`; số âm vẽ là bóng bay kéo lên; `tinh({thu}, t)` → `{ trai, phai, lech, buocHienTai }`, với `lech = (hệ số x trái − phải)·thu + (số trái − phải)`.

- [ ] **Step 1: Viết test đỏ** trong `tests/canh.test.js`, thử `a, b` từ 1 đến 6 bước .5 và `t ∈ {0, .25, .5, .75, 1}`:

```js
test('toHopHinhVuong: phần trống luôn bằng c² lúc đầu và a²+b² lúc cuối', ...) // phanTrong(t=0) === phanTrong(t=1) === a*a+b*b
test('toHopHinhVuong: tọa độ không có NaN, nằm trong khung ở t=0 và t=1', ...)
test('toHopHinhVuong: ở t=1 bốn tam giác không chồng nhau, trùng bố cục bản mẫu', ...)
test('baHinhVuong: a=2.5, c=6.5 cho h=6, dienTich.h=36', ...)
test('baHinhVuong: thu=6.96 cho thu.dai≈7.39; thu âm, 0, NaN cho thu=null, không ném lỗi', ...)
test('tamGiacAn: hcn huyen=15 canh 9,12; can 3,4,5; taxi 6,8,10', ...)
test('manhVuong tong: tổng diện tích các mảnh = (a+b)²', ...)
test('manhVuong hieu: tổng có dấu = (a-b)² với a>b', ...)
test('manhVuong hieuHaiBP: diện tích giữ nguyên = a²-b² ở mọi t', ...)
test('caiCan: 4x-12=0, thu=3 lech=0; thu=4 lech=4', ...)
test('caiCan: 2(x+3)-x=x+5 có lech=1 với mọi thu', ...)
test('caiCan: mỗi bước biến đổi giữ nguyên nghiệm', ...)
test('dangKi trùng tên thì ném lỗi', ...)
```

- [ ] **Step 2: Chạy** `npm test`. Expected: FAIL, thiếu `js/canh/loi.js`.
- [ ] **Step 3: Viết bốn file**, `tinh` không đụng DOM. Công thức dịch chuyển của tam giác lấy từ bản mẫu.
- [ ] **Step 4: Chạy** `npm test`. Expected: tất cả PASS (66 test cũ cùng test mới).
- [ ] **Step 5: Commit** `feat: lõi cảnh và tính toán ba họ hình`.

### Task 2: Widget `canh` và phần vẽ

**Files:**
- Create: `js/widgets/canh.js`, `tools/smoke-canh.js`, `tools/phong-canh.html`
- Modify: `js/canh/hinhVuong.js`, `js/canh/manhDaiSo.js`, `js/canh/caiCan.js` (thêm `ve`), `index.html`, `css/app.css`

**Interfaces:**
- Consumes: `T.canh` (Task 1); `T.tuChay.dangKi(khung, { buoc(dt), dung? })`, trả về `{ trangThai, batLai, dungLai }`.
- Produces: `T.widgets.canh(container, { ten, tuyChon, thamSo?, buoc?, tuChay?, chiXem? })` trả về `{ datT(t), datThamSo(obj), datTrangThai(ten|null), layT(), huy() }`.
  - `buoc`: `[{ t, chu }]`; bước đang tới có class `dang`.
  - Vòng lặp: đứng 14%, chạy 32%, đứng 22%, chạy về 32% trong 9 giây.
  - `tuChay` mặc định `true`, `chiXem: true` thì không có nút và thanh (dùng cho hình nhỏ).
  - `T.canh.veTinh(container, ten, tuyChon, t)` vẽ một khung tĩnh.
- Thêm `'canh'` vào `KNOWN_WIDGETS` của `tools/validate-content.js`.

- [ ] **Step 1: Viết `tools/smoke-canh.js`** mở `tools/phong-canh.html` (nạp widget và mọi cảnh). Với mỗi cảnh, ở `t=0` và `t=1`: có phần tử vẽ; không thuộc tính chứa `NaN`; `getBBox` nằm trong `viewBox`. Thêm: tự chạy đổi `t`; click thật vào hình làm `soDangChay` giảm và nút hiện "Tự chạy"; đổi tham số ở biên không lỗi; `location.hash` đổi thì `soDangChay() === 0`.
- [ ] **Step 2: Chạy** `node tools/smoke-canh.js`. Expected: FAIL, chưa có widget.
- [ ] **Step 3: Viết widget và `ve`** theo bản mẫu. Thêm script vào `index.html`: `js/canh/*.js` sau `js/core/app.js`, `js/widgets/canh.js` sau `js/widgets/geo.js`.
- [ ] **Step 4: Chạy** `node tools/smoke-canh.js`. Expected: `Không có lỗi.` Chụp `t=.5` của từng cảnh và xem bằng mắt.
- [ ] **Step 5: Commit** `feat: widget cảnh hình động`.

### Task 3: Trang "Nhìn là hiểu" và kiểm nội dung

**Files:**
- Create: `js/widgets/nhin.js`, `tests/fixtures/nhin-dung.js`, `tests/fixtures/nhin-sai.js`
- Modify: `js/widgets/lythuyet.js` (`T.tabs.khamPha`), `js/core/app.js`, `js/widgets/practice.js`, `js/widgets/stepper.js`, `tools/validate-content.js`, `tools/nap-noi-dung.js`, `tests/validate.test.js`, `index.html`

**Interfaces:**
- Consumes: `T.widgets.canh`; `T.mountQuestion`; `T.checker.checkAnswer(d, input, ltg)`.
- Produces khuôn `bai.nhin` đúng mục 5 của spec, với hai bổ sung:
  - `dung.phanUng: [{ gt, trangThai?, thamSo?, loi }]` khớp bằng `checkAnswer({ kieu: dapAn.kieu, gt }, giaTri).ok`.
  - `dung.soBatKi: function (v) → { thamSo?, trangThai?, loi } | null` cho đáp án số hoặc nghiệm, gọi khi không khớp `phanUng`.
- `T.mountQuestion`: `onResult(r, { soLanSai, xemLoiGiai, giaTri })` thêm `giaTri` là giá trị em gõ.
- `T.tabs.khamPha`: có `bai.nhin` thì gọi `T.nhin(c, bai)` rồi, nếu có `khamPha`, thêm mục "Tự kéo thử" với nội dung cũ. Không có thì như cũ.
- Tên tab đầu: `bai.nhin ? 'Nhìn là hiểu' : 'Khám phá'`, khoá vẫn là `khamPha`.
- `stepper`: `vd.canh` thì hình đứng cạnh các bước, `buoc[i].canh = { t, trangThai? }` đưa hình tới đó khi bước hiện ra.
- `practice`: thêm `q.hinh` như cũ; `q.hinhGiai` hiện cùng gợi ý nấc đầu và lời giải; `loiThuongGap[i].hinh = { widget, config }` hiện khi khớp lỗi đó.
- `validate`: chỉ áp dụng cho bài có `nhin`: đủ `canh, buoc, ketLuan, dung, suyRa`; `suyRa.baDe` đúng 3 đề; `loai` hợp lệ; tên cảnh có thật qua `canh.lay`; `tuyChon` chạy được `tinh` ở `t=0, 1`; `t` tăng dần; `tuBai` có thật trong bài; đáp án tự chấm đúng; `phanUng[i].gt` khác đáp án; mọi `tuLam` có `hinh`, `hinhGiai` hoặc `khongHinh`; mọi `viDu` có `hinh` hoặc `canh`.

- [ ] **Step 1: Viết test đỏ** trong `tests/validate.test.js`: fixture đúng cho `OK`; fixture sai báo đủ `cảnh lạ`, `t không tăng`, `tuBai không có`, `phanUng trùng đáp án`, `tuLam thiếu hình`.
- [ ] **Step 2: Chạy** `npm test`. Expected: FAIL ở các test mới.
- [ ] **Step 3: Viết validator, `nhin.js` và các chỗ sửa.** Bố cục, chữ và nút theo bản mẫu; chấm bằng `T.mountQuestion(..., { record: false, onResult })`. Đáp án đúng chạy tới `t=1` và hiện `dungChu`. Sai thì theo thứ tự `phanUng`, `soBatKi`, rồi câu chung. Nút `tenNut` chạy `t` của đề từ 0 tới 1. `minhHoa` hiện câu ở Global Constraints.
- [ ] **Step 4: Viết thêm vào `tools/smoke-all.js`**: bài có `nhin` có đủ `.nhin-nhin`, `.nhin-dung`, `.nhin-suy-ra`; gõ `x^2+25` ở bài 6 làm hình đổi trạng thái; gõ `-1`, `0`, `9999`, `abc` không lỗi console; bài 1 tab đầu vẫn tên "Khám phá" và không có `.nhin-nhin`.
- [ ] **Step 5: Chạy** `npm test && npm run validate`. Expected: PASS, `OK: 39 bài…`. Phần trình duyệt của Step 4 chạy được từ Task 6.
- [ ] **Step 6: Commit** `feat: trang Nhìn là hiểu, hình trong ví dụ và lời giải, kiểm nội dung`.

### Task 4: Soạn ba bài

**Files:**
- Modify: `content/bai35.js`, `content/bai06.js`, `content/bai25.js`

**Interfaces:**
- Consumes: khuôn `nhin` và các họ cảnh ở trên. Đề và đáp án lấy từ chính `tuLam` của bài; không đổi `dapAn` gốc.

| Bài | Nhìn | Dùng | Suy ra (`tuBai`) |
|---|---|---|---|
| 35 `chungMinh` | `toHopHinhVuong` | 35.11 cái thang, `baHinhVuong`, `soBatKi` vẽ độ cao em gõ | `tamGiacAn`: 35.7 đổi câu hỏi thành tìm chiều dài (12), 35.6, 35.10 |
| 6 `chungMinh` | `manhVuong` `tong` | 6.1 `(x+5)²`, `phanUng`: `x^2+25` → `thieuHaiManh` | 6.8 `52·48` và 6.7 `4x²−9` với `hieuHaiBP`; 6.9 `99²` với `hieu` |
| 25 `chungMinh` | `caiCan`, ba bước biến đổi | 25.3 `4x−12=0`, `soBatKi` đặt `thu`, cân lệch theo số em gõ | 25.4; 25.8 (cân lệch với mọi `x`, vô nghiệm); 25.10 (`4x`, `x`, hai người cùng thêm 5 tuổi) |

Mỗi bài còn: mọi `viDu` có `canh` hoặc `hinh`; ví dụ đầu có `buoc[i].canh`; mọi `tuLam` có `hinh`, `hinhGiai` hoặc `khongHinh`; `loiThuongGap` chính có `hinh` khi cảnh thể hiện được. Luyện thêm thuộc mốc 4.

- [ ] **Step 1: Soạn bài 35**, chạy `npm run validate`. Expected: `OK`.
- [ ] **Step 2: Soạn bài 6**, chạy `npm run validate`. Expected: `OK`.
- [ ] **Step 3: Soạn bài 25**, chạy `npm run validate`. Expected: `OK`.
- [ ] **Step 4: Xem bằng mắt.** `node tools/smoke.js bai/35/khamPha --shot <scratchpad>/35.png`, tương tự bài 6 và 25 (route không có `#/`). Hình đúng tỉ lệ, không chồng nhãn.
- [ ] **Step 5: Commit** `feat: bài 35, 6, 25 theo cách Nhìn là hiểu`.

### Task 5: Giao diện mới

**Files:**
- Modify: `css/app.css`, `js/core/app.js` (`home`, `lessonCard`), `tools/copy-libs.js`, `package.json`, `index.html`
- Create: `lib/fonts/*`

**Interfaces:**
- Consumes: `T.canh.veTinh` (Task 2), `L.nhin.canh`.
- Phông: `@fontsource/be-vietnam-pro` (400, 500, 700), `@fontsource/bricolage-grotesque` (700, 800), các bộ `latin`, `latin-ext`, `vietnamese`, kèm giấy phép. Khai báo `@font-face` có `unicode-range`, đường dẫn tương đối, fallback `"Segoe UI", system-ui`.
- CSS: đổi token ở `:root` theo bản mẫu (giấy kẻ ô, mực, màu `a b c`), giảm bo góc và bóng; giữ tên class cũ để 36 bài còn lại không hỏng.
- `lessonCard`: bài có `nhin` thêm `.hinh-nho` là `veTinh(..., t=1)`; thanh tiến độ cao hơn. Cập nhật câu chào ở `home` vì các bước đã đổi.

- [ ] **Step 1: Thêm vào `tools/smoke.js` tuỳ chọn `--font`** in `document.fonts.check('700 20px "Be Vietnam Pro"')` và kiểm chữ "Pythagore ấ ệ" không rơi về fallback; thêm vào `smoke-all` kiểm thẻ bài 35 có `.hinh-nho svg`. Chạy. Expected: FAIL.
- [ ] **Step 2: Cài phông, chạy `npm run libs`, sửa CSS và trang chủ.**
- [ ] **Step 3: Chạy lại.** Expected: PASS; không có request lỗi từ `file://`.
- [ ] **Step 4: Xem bằng mắt** trang chủ, một bài cũ (bài 12 mọi tab) và ba bài mới ở 1366px và 400px. Không tràn ngang.
- [ ] **Step 5: Commit** `feat: giao diện mới, phông riêng, hình nhỏ ở trang chủ`.

### Task 6: Kiểm toàn bộ, đưa lên web, dừng

**Files:**
- Modify: `README.md`; sửa các lỗi tìm được

- [ ] **Step 1: Chạy toàn bộ.** `npm test`; `node tools/validate-content.js --du-luyen`; `node tools/smoke-canh.js`; `node tools/smoke-tuchay.js`; `node tools/smoke-all.js`; `node tools/smoke-all.js --query nomathlive`. Expected: tất cả sạch.
- [ ] **Step 2: Soát toán và sư phạm độc lập** ba bài bằng agent: tự giải lại đề; hình có nói đúng toán không; nhãn `chungMinh` có xứng không; học sinh lớp 8 đọc có hiểu không. Sửa rồi chạy lại Step 1.
- [ ] **Step 3: Rà code toàn nhánh** bằng reviewer mới, theo Review Focus. Lỗi nghiêm trọng và quan trọng sửa theo đỏ rồi xanh.
- [ ] **Step 4: Đưa lên web.** `git merge --ff-only` vào `main`, `git push`, đợi `gh api repos/binh812/toan8/pages/builds/latest` báo `built`. Chạy thử bản trên mạng 3 bài mới và một bài cũ, bắt `pageerror` và phản hồi ≥ 400.
- [ ] **Step 5: Gửi phụ huynh** link 3 bài, cách cháu thử: học bài 6 rồi tự làm `(3x−2)²` và `x²−10x+25`, không xem lời giải, nói được vì sao bằng cách chỉ vào hình; so với bài cũ. **Dừng tại đây**, mốc 2 chỉ bắt đầu khi có phản hồi.
