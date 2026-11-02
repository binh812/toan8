TOAN8.luyen(902, [
  { ten: 'Sai đáp án', muc: 1, sinh: function (r) { var a = r.so(1, 5); return { de: 'Tính $' + a + '+1$', dapAn: { kieu: 'so', gt: a + 2 }, goiY: ['Cộng.'], loiGiai: ['$' + a + '+1 = ' + (a + 1) + '$'] }; } },
  { ten: 'Chia 0', muc: 1, sinh: function (r) { var a = r.so(0, 3); return { de: 'Tính $6 : ' + a + '$ bằng ' + 6 / a, dapAn: { kieu: 'so', gt: 6 / a }, goiY: ['Chia.'], loiGiai: ['$6 : ' + a + '$'] }; } },
  { ten: 'Ném lỗi', muc: 1, sinh: function (r) { if (r.so(1, 10) === 3) throw new Error('hỏng'); return { de: 'x', dapAn: { kieu: 'so', gt: 1 }, goiY: ['g'], loiGiai: ['$x = 1$'] }; } }
]);
