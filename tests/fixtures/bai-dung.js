TOAN8.bai({
  id: 901, ten: 'Bài mẫu hợp lệ', sgk: { tap: 1, trang: 29 },
  khamPha: { nhiemVu: 'Quan sát hình.', widget: 'dienTich', config: {} },
  lyThuyet: [{ loai: 'dinhLi', tieuDe: 'HĐT', noiDung: '$$(A+B)^2 = A^2 + 2AB + B^2$$' }],
  viDu: [
    { de: 'Khai triển $(x+3)^2$.', buoc: [{ lam: '$= x^2 + 6x + 9$', vi: 'HĐT 1.' }] },
    { de: 'Tính $101^2$.', buoc: [{ lam: '$= 10201$', vi: 'HĐT 1.' }] }
  ],
  viDuMo: [{ de: 'Khai triển $(x+1)^2$.', buoc: [{ lam: '$= x^2+2x+1$', vi: 'Kết quả:', an: true, dapAn: { kieu: 'bieuThuc', gt: 'x^2+2x+1', dang: 'khaiTrien' } }] }],
  baiTap: [
    { id: '901.1', muc: 1, de: 'Khai triển $(x+5)^2$.', dapAn: { kieu: 'bieuThuc', gt: 'x^2+10x+25', dang: 'khaiTrien' }, goiY: ['HĐT 1'], loiGiai: ['$(x+5)^2 = x^2 + 10x + 25$'], loiThuongGap: [{ gt: 'x^2+25', giaiThich: 'Thiếu 2AB' }] },
    { id: '901.2', muc: 1, de: 'Tính $11^2$.', dapAn: { kieu: 'so', gt: 121 }, goiY: ['$(10+1)^2$'], loiGiai: ['$= 121$'] },
    { id: '901.3', muc: 1, de: 'Đúng hay sai?', dapAn: { kieu: 'dungSai', gt: false }, goiY: ['Thử số'], loiGiai: ['Sai'] },
    { id: '901.4', muc: 2, de: 'Chọn', dapAn: { kieu: 'chon', gt: 0, luaChon: ['$a$', '$b$'] }, goiY: ['…'], loiGiai: ['$a$'] },
    { id: '901.5', muc: 2, de: 'Phân tích $x^2-9$.', dapAn: { kieu: 'bieuThuc', gt: '(x-3)(x+3)', dang: 'nhanTu' }, goiY: ['HĐT 3'], loiGiai: ['$x^2 - 9 = (x-3)(x+3)$'] },
    { id: '901.6', muc: 2, de: 'Tìm $x$: $x^2=4$.', dapAn: { kieu: 'nghiem', gt: [2, -2] }, goiY: ['…'], loiGiai: ['$x = 2$ hoặc $x = -2$'] },
    { id: '901.7', muc: 3, de: 'Tính nhanh $99^2$.', dapAn: { kieu: 'so', gt: 9801 }, goiY: ['$(100-1)^2$'], loiGiai: ['$= 9801$'] },
    { id: '901.8', muc: 1, de: 'Khai triển $(x-1)^2$.', dapAn: { kieu: 'bieuThuc', gt: 'x^2-2x+1', dang: 'khaiTrien' }, goiY: ['HĐT 2'], loiGiai: ['$(x-1)^2 = x^2-2x+1$'] }
  ],
  timLoi: [{ de: 'Tìm lỗi', loiGiaiSai: ['$a$', '$b$'], dongSai: 1, giaiThich: 'Vì…' }]
});
