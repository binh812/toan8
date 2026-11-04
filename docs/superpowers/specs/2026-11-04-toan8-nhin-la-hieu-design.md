# Toán 8: "Nhìn là hiểu" – thiết kế

## 1. Mục tiêu

Vẫn những bài toán của SGK Kết nối tri thức, nhưng học sinh **dễ hiểu, dễ hình dung, dễ cảm nhận và dễ suy ra bài tương tự hơn**.

Nguyên tắc do phụ huynh chốt: mỗi bài và cả bài tập phải có cách tiếp cận trực quan. Nhìn hình là thấy vì sao đúng, công thức chỉ là cách ghi lại điều vừa thấy (ví dụ: định lí Pythagore chứng minh bằng hình).

Bản mẫu đã được duyệt hướng: `docs/mau/pythagore-nhin-la-hieu.html`.

**Dấu hiệu thành công**
- Cháu học bản mới một bài, rồi tự làm được một bài cùng khuôn chưa gặp mà không xem lời giải.
- Cháu nói được vì sao công thức đúng bằng cách chỉ vào hình.
- Cháu thấy bản mới dễ hiểu hơn bản cũ (hỏi trực tiếp sau bản thử).

**Không làm trong đợt này:** game hoá (điểm, xu, trùm), gia sư AI, âm thanh, app cài đặt, tài khoản và máy chủ. Nền tảng vẫn là web tĩnh, chạy được cả `file://` lẫn GitHub Pages.

## 2. Trải nghiệm một bài

Tab đầu tiên đổi tên từ "Khám phá" thành **"Nhìn là hiểu"**, gồm bốn phần trên một trang, theo đúng bản mẫu:

1. **Nhìn:** một cảnh hình động lớn, chữ ngắn bên cạnh, các bước sáng lên theo hình. Hình tự chạy và chạm là dừng; có thanh tua và thanh đổi số. Công thức hiện ra sau cùng.
2. **Dùng:** một bài của chính bài học được giải ngay trên hình đó. Gõ sai thì hình vẽ đúng điều em vừa gõ để em thấy vì sao sai.
3. **Suy ra bài khác:** ba đề trông khác nhau nhưng cùng một khuôn. Nút "Tìm …" làm hình phần cốt lõi đang nấp trong đề hiện ra. Cuối phần là một câu nêu cách nhận dạng khuôn.
4. **Tự kéo thử:** hình tương tác và câu hỏi của Khám phá cũ, giữ nguyên.

Các tab còn lại giữ nguyên thứ tự và nội dung, cộng thêm hình theo mục 4: Lý thuyết, Ví dụ, Tự làm, Tìm lỗi sai, Luyện thêm.

Bài chưa có khối `nhin` vẫn hiện như cũ, nên có thể phát hành dần từng chương mà không hỏng gì.

Route vẫn là `#/bai/N/khamPha` để không gãy liên kết, bộ kiểm tra và tiến độ đã lưu.

## 3. Giao diện

- **Nhận diện:** nền giấy kẻ ô, chữ Be Vietnam Pro, tiêu đề Bricolage Grotesque, các khung ít bo góc. Phông được chép vào `lib/fonts` qua `npm run libs` vì app không dùng CDN.
- **Màu có nghĩa:** cam, xanh dương, xanh lá, tím luôn gắn với cùng một đại lượng trong cả hình lẫn công thức, dùng lại macro `\ca \cb \cc \cd`.
- **Bố cục:** từ 900px trở lên, hình một bên và chữ một bên. Hẹp hơn thì xếp dọc.
- **Trang chủ:** mỗi thẻ bài có một hình nhỏ là khung cuối của cảnh Nhìn, tiến độ hiện rõ hơn. Nhìn mục lục đã thấy được từng bài nói về điều gì.
- Chỉ thiết kế giao diện sáng (app hiện cũng vậy). Giữ `prefers-reduced-motion`: không tự chạy, vẫn tua tay được.

## 4. Bài tập cũng trực quan

| Chỗ | Thay đổi |
|---|---|
| **Ví dụ** | Mọi ví dụ có hình đi cùng. Ví dụ đầu mỗi bài dùng cảnh: tới bước nào, phần hình đó sáng lên (`buoc[i].canh`) |
| **Tự làm** | Mỗi bài có `hinh` ở đề, hoặc `hinhGiai` hiện cùng gợi ý và lời giải. Bài không có hình tự nhiên phải ghi `khongHinh: 'lý do'`, để việc bỏ qua là có chủ ý |
| **Sai** | `loiThuongGap[i].hinh` đưa cảnh tới trạng thái thể hiện đúng lỗi đó, ví dụ thiếu hai mảnh `3x` |
| **Luyện thêm** | Dạng mức 1 và 2 trả về `hinhGiai` theo chính số của đề. Mức 3 có hình khi đề cần |

Đề, đáp án, bộ chấm và 296 dạng tự sinh **giữ nguyên**. Phần Dùng và Suy ra lấy đề từ chính bài học, gắn với bài tập gốc qua `tuBai: '35.11'`, và chấm bằng `T.mountQuestion`. Đề được đổi câu hỏi hoặc viết mới vẫn phải qua kiểm tự động và soát toán như mọi đề khác.

## 5. Kiến trúc

**Cảnh (`js/canh/`)**

Một cảnh gồm hai phần:

```js
T.canh.dangKi('oVuongToHop', {
  thamSo: { a: { min: 1, max: 6, step: .5, md: 3 }, b: { ... } },
  tinh: function (p, t) { return { tamGiac: [...], oTrong: [...], kiemTra: {...} }; }, // thuần toán, không đụng DOM
  ve: function (svg, kq, p, t) { ... }                                                 // chỉ vẽ
});
```

- `tinh` là hàm thuần, chạy và kiểm được trong Node. File cảnh viết theo kiểu UMD như `js/core`.
- Widget `canh` lo phần chung: SVG co giãn, chạy, tua, đổi số, các bước sáng theo mốc `t`, chạm là dừng, nối với `T.tuChay`, và `datTrangThai(ten)` để bài tập đưa hình tới một trạng thái.
- Cảnh nhận `tuyChon`, nên một họ cảnh dùng được cho nhiều bài. Dự kiến khoảng 15 họ (mục 8), không viết riêng 39 cảnh rời.
- Không thêm thư viện hoạt hình: SVG và `requestAnimationFrame` đã đủ. Hình khối dùng lại phép chiếu của `solid3d.js`; đại số dùng lại ý của `tiles.js`.

**Khuôn nội dung, thêm vào `T.bai`**

```js
nhin: {
  tieuDe: 'Xếp lại bốn tam giác, phần trống không đổi',
  loai: 'chungMinh',           // hoặc 'minhHoa' (xem mục 6)
  canh: { ten: 'oVuongToHop', tuyChon: {...} },
  buoc: [{ t: 0, chu: '...' }, { t: .5, chu: '...' }, { t: 1, chu: '...' }],
  ketLuan: '$\\ca{a}^2+\\cb{b}^2=\\cc{c}^2$',
  dung: { tuBai: '35.11', de, dapAn, canh, phanUng: [{ gt, trangThai, loi }], dungChu },
  suyRa: { baDe: [{ tuBai, de, dapAn, canh, tenNut, dungChu, saiChu }], cachNhan: '...' }
}
```

Viết nội dung vẫn theo từng file `content/baiNN.js`. Cảnh dùng chung nằm ở `js/canh/`, nên agent soạn bài không phải sửa code chung.

## 6. Tính trung thực của hình

- Mỗi cảnh Nhìn khai báo `loai`. `chungMinh` nghĩa là hình đúng với mọi giá trị trong phạm vi. `minhHoa` thì trang ghi rõ: "Hình cho thấy một trường hợp, chưa phải chứng minh", rồi nêu cách lập luận tổng quát hoặc nói SGK chứng minh ở đâu.
- Hình vẽ theo đúng tỉ lệ. Khi nào không thể thì phải ghi "hình không theo tỉ lệ".
- Không cố nặn hình khi không tự nhiên. Một số bài như phân thức sẽ chủ yếu dùng `minhHoa`, và có thể không đẹp như Pythagore. Nói thẳng điều này còn hơn dùng hình sai.

## 7. Kiểm tra

- **`tests/canh.test.js`:** với mỗi họ cảnh, thử nhiều tham số và `t`, kiểm tính chất toán thật. Ví dụ: Pythagore giữ nguyên phần trống, khai triển có tổng diện tích bằng đa thức, cân luôn thăng bằng sau mỗi bước, tọa độ không có `NaN`.
- **`tools/validate-content.js`:** thêm kiểm `nhin` đủ phần, `tuBai` có thật, tên cảnh và tham số có thật, `t` tăng dần, `phanUng` khác đáp án, mọi `tuLam` có `hinh`, `hinhGiai` hoặc `khongHinh`.
- **Trình duyệt:** kiểm từng cảnh ở `t = 0` và `t = 1` có vẽ ra, hình nằm trong khung, không có lỗi console; hình tự chạy và chạm thì dừng. `smoke-all` chạy lại toàn bộ; chụp ảnh một vòng để người xem bằng mắt.
- **Soát độc lập theo từng chương:** agent mở cảnh và kiểm xem hình có nói đúng toán không, nhãn `chungMinh` có xứng đáng không, học sinh lớp 8 có đọc được không.
- **Thử với cháu:** ở mốc 1, theo tiêu chí mục 1.

## 8. Ý tưởng hình cho 39 bài

Bảng này là điểm xuất phát; khi soạn có thể đổi nếu tìm được hình rõ hơn, và đổi `loai` nếu kiểm ra hình chưa đủ tổng quát.

| Bài | Họ cảnh | Điều nhìn thấy | Loại dự kiến |
|---|---|---|---|
| 1 Đơn thức | Khối gạch | `3x²y` là 3 khối giống nhau; đồng dạng là cùng hình khối nên gộp được | Minh hoạ |
| 2 Đa thức | Mảnh đại số | Các mảnh lẫn lộn, xếp cùng loại lại là thu gọn | Minh hoạ |
| 3 Cộng, trừ đa thức | Mảnh đại số | Mảnh dương và âm cùng loại triệt tiêu nhau | Minh hoạ |
| 4 Nhân đa thức | Mảnh đại số | Hình chữ nhật chia lưới, mỗi ô là một tích | Chứng minh |
| 5 Chia cho đơn thức | Mảnh đại số | Biết diện tích và một cạnh, tìm cạnh kia | Chứng minh |
| 6 Hiệu hai bình phương, bình phương | Mảnh đại số | Khoét, cắt và ghép lại; ghép hình vuông `a+b` | Chứng minh |
| 7 Lập phương tổng, hiệu | Khối 3D | Tách khối cạnh `a+b` thành 8 khối con | Chứng minh |
| 8 Tổng, hiệu hai lập phương | Khối 3D | Khối lớn bỏ khối nhỏ, tách thành 3 tấm | Chứng minh |
| 9 Phân tích nhân tử | Mảnh đại số | Xếp các mảnh thành một hình chữ nhật, hai cạnh là hai nhân tử | Chứng minh |
| 10 Tứ giác | Biến hình | Cắt theo đường chéo thành hai tam giác, các góc ghép đủ một vòng | Chứng minh |
| 11 Hình thang cân | Biến hình | Gập theo trục đối xứng, hai nửa trùng khít | Chứng minh |
| 12 Hình bình hành | Biến hình | Quay nửa vòng quanh tâm, hình trùng chính nó | Chứng minh |
| 13 Hình chữ nhật | Biến hình | Hai thanh bằng nhau cắt tại trung điểm luôn tạo hình chữ nhật | Chứng minh |
| 14 Hình thoi, hình vuông | Biến hình | Khung bốn thanh bản lề bóp lại; hai đường chéo luôn vuông góc | Chứng minh |
| 15 Thalès | Đường song song | Các đường song song cách đều chia hai cạnh thành các phần bằng nhau | Chứng minh với tỉ số hữu tỉ, ghi rõ |
| 16 Đường trung bình | Biến hình | Cắt tam giác rồi quay phần trên thành hình bình hành | Chứng minh |
| 17 Phân giác | Diện tích | Hai tam giác cùng chiều cao, tỉ số diện tích cho hai tỉ số bằng nhau | Chứng minh |
| 18 Dữ liệu | Thẻ dữ liệu | Xếp thẻ vào đúng giá; thẻ vô lí tự nổi bật | Minh hoạ |
| 19 Biểu đồ | Biểu đồ | Một bộ số biến hình giữa bảng, cột, tròn, đường | Minh hoạ |
| 20 Phân tích biểu đồ | Biểu đồ | Cắt trục làm chênh lệch trông lớn hơn; so hai biểu đồ cạnh nhau | Minh hoạ |
| 21 Phân thức | Băng tỉ lệ | Băng thay đổi theo `x`; mẫu về 0 thì băng không còn nghĩa | Minh hoạ |
| 22 Tính chất cơ bản | Băng tỉ lệ | Chia lưới mịn gấp đôi, phần tô không đổi | Minh hoạ cùng lập luận tổng quát |
| 23 Cộng, trừ phân thức | Băng tỉ lệ | Hai lưới khác nhau đưa về cùng lưới | Minh hoạ cùng lập luận tổng quát |
| 24 Nhân, chia phân thức | Băng tỉ lệ | Tô chồng hai chiều; phép chia là "chứa được bao nhiêu" | Minh hoạ cùng lập luận tổng quát |
| 25 Phương trình | Cái cân | Làm gì ở bên này thì làm y như vậy ở bên kia | Chứng minh |
| 26 Lập phương trình | Sơ đồ đoạn | Đề bài thành các đoạn thẳng, từ đó đọc ra phương trình | Minh hoạ |
| 27 Hàm số | Máy và đồ thị | Máy nhận `x` và trả `y`; các điểm rơi lên mặt phẳng tọa độ | Minh hoạ |
| 28 Hàm bậc nhất | Đồ thị | Mỗi bước sang phải lên đều nhau, nên các điểm thẳng hàng | Chứng minh bằng đồng dạng |
| 29 Hệ số góc | Đồ thị | Bậc thang dốc hơn hay thoải hơn; cùng độ dốc thì song song | Chứng minh |
| 30 Kết quả có thể | Lưới kết quả | Mọi kết quả là lưới chấm, kết quả thuận lợi sáng lên | Chứng minh |
| 31 Xác suất bằng tỉ số | Lưới kết quả | Số chấm sáng chia tổng số chấm | Chứng minh |
| 32 Xác suất thực nghiệm | Mô phỏng | Chạy nhiều lần, tỉ lệ tiến dần về xác suất | Minh hoạ |
| 33 Tam giác đồng dạng | Phóng to | Phóng to từ một điểm, các góc giữ nguyên và các cạnh cùng tỉ số | Chứng minh |
| 34 Ba trường hợp đồng dạng | Phóng to | Phóng một tam giác để trùng tam giác kia | Chứng minh |
| 35 Pythagore | Tổ hợp hình vuông | Bản mẫu đã duyệt | Chứng minh |
| 36 Đồng dạng tam giác vuông | Phóng to | Đường cao chia thành hai tam giác nhỏ, lật và phóng trùng tam giác lớn | Chứng minh |
| 37 Hình đồng dạng | Phóng to | Cạnh gấp `k` thì diện tích gấp `k²`, đếm bằng ô | Chứng minh |
| 38 Chóp tam giác đều | Khối 3D | Trải phẳng; đổ nước sang lăng trụ cùng đáy, cùng chiều cao thấy gấp 3 | Minh hoạ (thí nghiệm) |
| 39 Chóp tứ giác đều | Khối 3D | Trải phẳng; thí nghiệm đổ nước như bài 38 | Minh hoạ (thí nghiệm) |

## 9. Lộ trình

**Mốc 1: bản thử, có điểm dừng.** Làm khung cảnh, giao diện mới và trọn vẹn **bài 35** (đại diện hình học), **bài 6** (đại số), **bài 25** (phương trình). Đưa lên web cho cháu thử theo mục 1. Phụ huynh quyết định đi tiếp hoặc điều chỉnh; không có phản hồi thì không làm tiếp phần lớn.

**Mốc 2: bộ cảnh.** Hoàn thiện các họ cảnh còn lại, có test.

**Mốc 3: nội dung.** Các agent soạn song song theo chương, mỗi agent chỉ sửa file của chương mình. Sau mỗi chương chạy kiểm tự động, soát độc lập, rồi đưa lên web. Thứ tự: IX, II, I, VII, III, IV, X, VIII, V, VI (dễ làm hình đẹp trước, phân thức sau cùng).

**Mốc 4: Tự làm và Luyện thêm có hình** (mục 4), trang chủ có hình nhỏ, rà code toàn nhánh, cập nhật README, skill và memory.

## 10. Rủi ro

| Rủi ro | Cách xử lý |
|---|---|
| Khối lượng lớn: 39 cảnh Nhìn và vài trăm bài tập cần hình | Dùng lại họ cảnh; phát hành từng chương; `khongHinh` cho chỗ không cần hình |
| Hình đẹp nhưng sai toán, hoặc làm tưởng đã chứng minh | Tách `tinh` để test; nhãn `chungMinh`/`minhHoa`; soát độc lập |
| Hình động làm rối thay vì làm rõ | Mỗi cảnh chỉ nói một ý; các phần trượt lần lượt; có điểm dừng thử với cháu ở mốc 1 |
| Trang nặng khi có nhiều hình | Chỉ chạy cảnh đang hiện trên màn hình, dùng lại cơ chế của `T.tuChay` |
| Phương pháp không hiệu quả với cháu | Biết ngay ở mốc 1, khi mới làm 3 bài |
