// Bài nền (lớp 7): Tam giác cân, đường trung trực, các đường đồng quy của tam giác – cần cho Chương III, IV.
(function () {
  'use strict';
  function giaTri(s) { if (typeof s === 'number') return s; var p = String(s).split('/'); return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(s); }
  function themLoi(ds, gt, dap, giaiThich) {
    var v = giaTri(gt);
    if (!isFinite(v) || Math.abs(v - giaTri(dap)) < 1e-9) return;
    if (ds.some(function (l) { return Math.abs(giaTri(l.gt) - v) < 1e-9; })) return;
    ds.push({ gt: gt, giaiThich: giaiThich });
  }

  TOAN8.nen({
    id: 'tamGiacCan', ten: 'Tam giác cân, đường trung trực, các đường đồng quy', lop: 7,
    tomTat: [
      { loai: 'dinhNghia', tieuDe: 'Tam giác cân, tam giác đều',
        noiDung: 'Tam giác $ABC$ **cân tại $A$** khi $AB = AC$; $A$ là đỉnh, $BC$ là cạnh đáy.\n\nTrong tam giác cân, **hai góc ở đáy bằng nhau**: $\\widehat{B} = \\widehat{C} = \\frac{180^\\circ - \\widehat{A}}{2}$. Ngược lại, tam giác có hai góc bằng nhau là tam giác cân.\n\nTam giác **đều** có ba cạnh bằng nhau, mỗi góc bằng $60^\\circ$.' },
      { loai: 'dinhNghia', tieuDe: 'Đường trung trực của đoạn thẳng',
        noiDung: 'Đường trung trực của đoạn $AB$ là đường thẳng **vuông góc** với $AB$ tại **trung điểm** của $AB$.\n\nĐiểm $M$ nằm trên đường trung trực của $AB$ thì **cách đều** hai đầu mút: $MA = MB$ (và ngược lại).' },
      { loai: 'dinhLi', tieuDe: 'Các đường đồng quy của tam giác',
        noiDung: '• Ba **đường trung tuyến** cắt nhau tại **trọng tâm** $G$: $AG = \\frac{2}{3}AM$, $GM = \\frac{1}{3}AM$ ($AM$ là trung tuyến).\n\n• Ba **đường phân giác** cắt nhau tại một điểm **cách đều ba cạnh**.\n\n• Ba **đường trung trực** cắt nhau tại một điểm **cách đều ba đỉnh**.\n\n• Ba **đường cao** cắt nhau tại **trực tâm**.' },
      { loai: 'chuY', noiDung: 'Trong tam giác cân tại $A$, đường trung tuyến kẻ từ $A$ đồng thời là đường cao, đường phân giác và đường trung trực của cạnh đáy $BC$.' }
    ],
    viDu: [
      { de: 'Tam giác $ABC$ cân tại $A$ có $\\widehat{A} = 40^\\circ$. Tính $\\widehat{B}$.', buoc: [
        { lam: '$\\widehat{B} + \\widehat{C} = 180^\\circ - 40^\\circ = 140^\\circ$', vi: 'Tổng ba góc của tam giác bằng $180^\\circ$.' },
        { lam: '$\\widehat{B} = \\widehat{C} = 140^\\circ : 2 = 70^\\circ$', vi: 'Hai góc ở đáy của tam giác cân bằng nhau.' }] },
      { de: 'Tam giác $ABC$ có trung tuyến $AM = 9$ cm, $G$ là trọng tâm. Tính $AG$.', buoc: [
        { lam: '$AG = \\frac{2}{3}AM = \\frac{2}{3} \\cdot 9 = 6$ (cm)', vi: 'Trọng tâm nằm trên trung tuyến, cách đỉnh $\\frac{2}{3}$ độ dài trung tuyến.' }] }
    ],
    luyen: [
      { ten: 'Góc ở đáy, góc ở đỉnh của tam giác cân', muc: 1, sinh: function (r) {
        var ten = r.chon([['A', 'B', 'C'], ['M', 'N', 'P'], ['D', 'E', 'F']]), D0 = ten[0], D1 = ten[1], D2 = ten[2];
        var g = function (v) { return '\\widehat{' + v + '}'; };
        if (r.dau() > 0) {
          var a = 2 * r.so(10, 70); while (a === 60 || a === 90) a = 2 * r.so(10, 70);
          var kq = (180 - a) / 2;
          return {
            de: 'Tam giác $' + ten.join('') + '$ cân tại $' + D0 + '$ có $' + g(D0) + ' = ' + a + '^\\circ$. Tính $' + g(D1) + '$.',
            dapAn: { kieu: 'so', gt: kq },
            goiY: ['Hai góc ở đáy $' + g(D1) + '$ và $' + g(D2) + '$ bằng nhau.', '$' + g(D1) + ' + ' + g(D2) + ' = 180^\\circ - ' + a + '^\\circ$.'],
            loiGiai: ['$' + g(D1) + ' + ' + g(D2) + ' = 180^\\circ - ' + a + '^\\circ = ' + (180 - a) + '^\\circ$', '$' + g(D1) + ' = ' + g(D2) + ' = ' + (180 - a) + '^\\circ : 2 = ' + kq + '^\\circ$'],
            loiThuongGap: [{ gt: 180 - a, giaiThich: 'Đó là **tổng** hai góc ở đáy. Hai góc đáy bằng nhau nên mỗi góc bằng một nửa.' }]
          };
        }
        var b = r.so(25, 85); while (b === 60) b = r.so(25, 85);
        var kq2 = 180 - 2 * b, ltg = [];
        themLoi(ltg, 180 - b, kq2, 'Tam giác cân có **hai** góc ở đáy bằng nhau, đều bằng $' + b + '^\\circ$: phải trừ $2 \\cdot ' + b + '^\\circ$.');
        return {
          de: 'Tam giác $' + ten.join('') + '$ cân tại $' + D0 + '$ có $' + g(D1) + ' = ' + b + '^\\circ$. Tính $' + g(D0) + '$.',
          dapAn: { kieu: 'so', gt: kq2 },
          goiY: ['Tam giác cân tại $' + D0 + '$ thì $' + g(D2) + ' = ' + g(D1) + '$.', '$' + g(D0) + ' = 180^\\circ - ' + g(D1) + ' - ' + g(D2) + '$.'],
          loiGiai: ['Tam giác cân tại $' + D0 + '$ nên $' + g(D2) + ' = ' + g(D1) + ' = ' + b + '^\\circ$.', '$' + g(D0) + ' = 180^\\circ - 2 \\cdot ' + b + '^\\circ = ' + kq2 + '^\\circ$'],
          loiThuongGap: ltg
        };
      } },
      { ten: 'Nhận biết các đường đồng quy', muc: 1, sinh: function (r) {
        var duong = ['ba đường trung tuyến', 'ba đường phân giác', 'ba đường trung trực', 'ba đường cao'];
        var cau = r.chon([
          ['Điểm **cách đều ba đỉnh** của một tam giác là giao điểm của', 2],
          ['Điểm **cách đều ba cạnh** của một tam giác là giao điểm của', 1],
          ['**Trọng tâm** $G$ của tam giác (có $AG = \\frac{2}{3}AM$) là giao điểm của', 0],
          ['**Trực tâm** của tam giác là giao điểm của', 3],
          ['Tâm của đường tròn đi qua ba đỉnh tam giác (cách đều ba đỉnh) là giao điểm của', 2],
          ['Điểm nằm trong tam giác và cách đều ba cạnh của tam giác là giao điểm của', 1]]);
        var lc = r.xaoTron(duong), dung = duong[cau[1]];
        var giai = ['Ba đường trung tuyến cắt nhau tại **trọng tâm** ($AG = \\frac{2}{3}AM$).', 'Ba đường phân giác cắt nhau tại điểm **cách đều ba cạnh**.', 'Ba đường trung trực cắt nhau tại điểm **cách đều ba đỉnh** (vì mỗi điểm trên trung trực cách đều hai đầu cạnh).', 'Ba đường cao cắt nhau tại **trực tâm**.'][cau[1]];
        return {
          de: cau[0] + ':',
          dapAn: { kieu: 'chon', gt: lc.indexOf(dung), luaChon: lc },
          goiY: ['Nhớ: trung trực ↔ cách đều hai đầu đoạn thẳng; phân giác ↔ cách đều hai cạnh của góc.', 'Trọng tâm ↔ trung tuyến; trực tâm ↔ đường cao.'],
          loiGiai: [giai]
        };
      } },
      { ten: 'Trọng tâm của tam giác', muc: 2, sinh: function (r, cc) {
        var k = r.so(2, 8), loai = r.chon([0, 1, 2]), AM = 3 * k, AG = 2 * k, GM = k, de, kq, lg, ltg = [];
        if (loai === 0) {
          de = 'Tam giác $ABC$ có trung tuyến $AM = ' + AM + '$ cm, $G$ là trọng tâm. Tính $AG$ (cm).'; kq = AG;
          lg = ['$AG = \\frac{2}{3}AM = \\frac{2}{3} \\cdot ' + AM + ' = ' + AG + '$'];
          themLoi(ltg, cc.phanSo(AM, 2).ascii, kq, 'Trọng tâm không phải trung điểm của $AM$: $AG = \\frac{2}{3}AM$.');
          themLoi(ltg, GM, kq, 'Đó là $GM = \\frac{1}{3}AM$. Đoạn $AG$ (từ đỉnh đến trọng tâm) dài gấp đôi $GM$.');
        } else if (loai === 1) {
          de = 'Tam giác $ABC$ có trung tuyến $AM = ' + AM + '$ cm, $G$ là trọng tâm. Tính $GM$ (cm).'; kq = GM;
          lg = ['$GM = \\frac{1}{3}AM = \\frac{1}{3} \\cdot ' + AM + ' = ' + GM + '$'];
          themLoi(ltg, AG, kq, 'Đó là $AG = \\frac{2}{3}AM$. $GM$ chỉ bằng $\\frac{1}{3}AM$.');
        } else {
          de = 'Tam giác $ABC$ có trọng tâm $G$ và trung tuyến $AM$, biết $AG = ' + AG + '$ cm. Tính $AM$ (cm).'; kq = AM;
          lg = ['$AG = \\frac{2}{3}AM$ nên $AM = AG : \\frac{2}{3} = ' + AG + ' \\cdot \\frac{3}{2}$', '$AM = ' + AM + '$'];
          themLoi(ltg, cc.phanSo(2 * AG, 3).ascii, kq, 'Em đã lấy $\\frac{2}{3}$ của $AG$. Phải làm ngược lại: $AM = \\frac{3}{2}AG$.');
          themLoi(ltg, 2 * AG, kq, '$G$ không phải trung điểm của $AM$: $AM = \\frac{3}{2}AG$.');
        }
        return {
          de: de, dapAn: { kieu: 'so', gt: kq },
          goiY: ['Trọng tâm $G$ nằm trên trung tuyến $AM$ với $AG = \\frac{2}{3}AM$, $GM = \\frac{1}{3}AM$.', 'Chia trung tuyến thành $3$ phần bằng nhau: $AG$ chiếm $2$ phần, $GM$ chiếm $1$ phần.'],
          loiGiai: lg, loiThuongGap: ltg
        };
      } },
      { ten: 'Chu vi tam giác cân, đường trung trực', muc: 3, sinh: function (r) {
        if (r.dau() > 0) {
          var a = r.so(4, 15), b = r.so(3, 2 * a - 1);
          return {
            de: 'Điểm $M$ nằm trên đường trung trực của đoạn thẳng $AB$, biết $MA = ' + a + '$ cm và $AB = ' + b + '$ cm. Tính chu vi tam giác $MAB$ (cm).',
            dapAn: { kieu: 'so', gt: 2 * a + b },
            goiY: ['Điểm trên đường trung trực của $AB$ thì cách đều $A$ và $B$.', '$MB = MA = ' + a + '$ cm; chu vi $= MA + MB + AB$.'],
            loiGiai: ['$M$ thuộc đường trung trực của $AB$ nên $MB = MA = ' + a + '$ cm.', 'Chu vi $\\triangle MAB = ' + a + ' + ' + a + ' + ' + b + ' = ' + (2 * a + b) + '$ (cm).'],
            loiThuongGap: [{ gt: a + b, giaiThich: 'Em còn thiếu cạnh $MB$. Vì $M$ thuộc trung trực của $AB$ nên $MB = MA = ' + a + '$ cm.' }]
          };
        }
        var canh = r.so(5, 20), day = r.so(4, 2 * canh - 2);
        var P = 2 * canh + day;
        return {
          de: 'Tam giác $ABC$ cân tại $A$ có chu vi $' + P + '$ cm và cạnh đáy $BC = ' + day + '$ cm. Tính độ dài cạnh bên $AB$ (cm).',
          dapAn: { kieu: 'so', gt: canh },
          goiY: ['Tam giác cân tại $A$ nên $AB = AC$.', '$AB + AC = ' + P + ' - ' + day + '$; chia đôi.'],
          loiGiai: ['$AB + AC = ' + P + ' - ' + day + ' = ' + (P - day) + '$ (cm).', 'Vì $AB = AC$ nên $AB = ' + (P - day) + ' : 2 = ' + canh + '$ (cm).'],
          loiThuongGap: [{ gt: P - day, giaiThich: 'Đó là **tổng** hai cạnh bên $AB + AC$. Mỗi cạnh bên bằng một nửa.' }]
        };
      } }
    ]
  });
})();
