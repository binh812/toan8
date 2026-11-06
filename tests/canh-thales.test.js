// Cảnh chương IV: kiểm tính chất toán thật của phần tinh (không đụng DOM).
const test = require('node:test'), assert = require('node:assert');
const canh = require('../js/canh/loi.js');
require('../js/canh/thales.js');

const GAN = (x, y, msg, e) => assert.ok(Math.abs(x - y) < (e || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);
const TT = [0, .25, .5, .75, 1];
const tinh = (ten, p, t, o) => canh.lay(ten).tinh(p, t, o || {});
const dai = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
const cheo = (u, v) => u[0] * v[1] - u[1] * v[0];
const tru = (P, Q) => [P[0] - Q[0], P[1] - Q[1]];
const songSong = (P, Q, R, S) => Math.abs(cheo(tru(Q, P), tru(S, R))) < 1e-9 * (1 + dai(P, Q) * dai(R, S));
const huuHan = o => JSON.stringify(o, (k, v) => { if (typeof v === 'number') assert.ok(Number.isFinite(v), 'số hỏng ở ' + k); return v; });
// Nhiều dạng tam giác: mặc định, hai cạnh và góc, ba cạnh, toạ độ (bờ sông)
const HINH = [{}, { AB: 9, AC: 12, gocA: 58 }, { AB: 6, AC: 7.5, BC: 9 }, { AB: 5, AC: 6.5, BC: 7.5 }, { dinh: { A: [0, 10], B: [0, 0], C: [7.5, 0] } }, { AB: 12, AC: 9, gocA: 110 }];
const MK = []; for (let m = 1; m <= 5; m++) for (let k = 1; k <= 5; k++) MK.push({ m, k });

test('thalesLuoi: đường song song với BC qua vạch thứ m cắt AC sao cho AN : NC = m : k', () => {
  HINH.forEach(o => MK.forEach(p => {
    const g = tinh('thalesLuoi', p, 1, o);
    GAN(g.AM / g.MB, p.m / p.k, 'AM/MB'); GAN(g.AN / g.NC, p.m / p.k, 'AN/NC');
    GAN(g.AM / (g.AM + g.MB), g.AN / (g.AN + g.NC), 'AM/AB = AN/AC');
    assert.ok(songSong(g.M, g.N, g.B, g.C), 'MN ∥ BC');
    // Các khúc trên AC bằng nhau
    for (let i = 1; i <= g.n; i++) GAN(dai(g.Q[i - 1], g.Q[i]), dai(g.A, g.C) / g.n, 'khúc ' + i);
    GAN(dai(g.Q[g.n], g.C), 0, 'Q cuối là C');
  }));
});

test('thalesLuoi: bản sao tam giác nhỏ bằng tam giác trên cùng, đỉnh thứ ba nằm trên đường song song kế tiếp', () => {
  HINH.forEach(o => MK.forEach(p => {
    const g = tinh('thalesLuoi', p, 1, o), goc = g.banSao[0].dinh;
    g.banSao.forEach((b, i) => {
      const d = b.dinh;
      [[0, 1], [1, 2], [0, 2]].forEach(([u, v]) => GAN(dai(d[u], d[v]), dai(goc[u], goc[v]), 'cạnh bản sao ' + i));
      GAN(dai(d[0], g.P[i]), 0, 'đỉnh trên ở vạch ' + i); GAN(dai(d[1], g.P[i + 1]), 0, 'đỉnh dưới ở vạch ' + (i + 1));
      assert.ok(songSong(d[1], d[2], g.B, g.C), 'cạnh đáy bản sao ' + i + ' song song BC');
      assert.ok(songSong(d[0], d[2], g.A, g.C), 'cạnh phải bản sao ' + i + ' song song AC');
      assert.strictEqual(b.hien, 1);
    });
  }));
});

test('thalesLuoi: trượt xong, cạnh song song với AC của mỗi bản sao trùng đúng một khúc trên AC', () => {
  HINH.forEach(o => MK.forEach(p => {
    const g = tinh('thalesLuoi', p, 1, o);
    g.canhTruot.forEach((d, i) => { GAN(dai(d[0], g.Q[i]), 0, 'đầu khúc ' + i); GAN(dai(d[1], g.Q[i + 1]), 0, 'cuối khúc ' + i); });
    assert.strictEqual(g.canhTruot.length, g.n);
  }));
});

test('thalesLuoi: Thalès đảo nhận ra khi nào MN song song', () => {
  const o = { AB: 5, AC: 10, gocA: 60 };
  assert.ok(tinh('thalesLuoi', { m: 2, k: 3 }, 1, Object.assign({ dao: { AN: 4, NC: 6 } }, o)).songSong);
  assert.ok(!tinh('thalesLuoi', { m: 3, k: 4 }, 1, Object.assign({ dao: { AN: 4, NC: 5 } }, o)).songSong);
  assert.ok(!tinh('thalesLuoi', { m: 1, k: 2 }, 1, Object.assign({ dao: { AN: 2, NC: 3 } }, o)).songSong);
});

test('thalesLuoi: mọi t, mọi số đều hữu hạn; bản sao chưa trượt thì ẩn', () => {
  HINH.forEach(o => MK.forEach(p => TT.forEach(t => huuHan(tinh('thalesLuoi', p, t, Object.assign({ thu: { tu: 'N', den: 'C' }, luoi: true }, o))))));
  const g = tinh('thalesLuoi', { m: 2, k: 3 }, 0, {});
  assert.ok(g.banSao.every(b => b.hien === 0), 'ở t=0 chưa có bản sao');
});

test('thalesLuoi: đoạn em gõ dài đúng số em gõ, số hỏng thì không vẽ', () => {
  const o = { AB: 9, AC: 12, gocA: 58, m: 2, k: 1, thu: { tu: 'N', den: 'C' } };
  GAN(dai(tinh('thalesLuoi', { thu: 12 }, 1, o).thu.tu, tinh('thalesLuoi', { thu: 12 }, 1, o).thu.cuoi), 12);
  [-1, 0, NaN, undefined, Infinity].forEach(v => assert.strictEqual(tinh('thalesLuoi', { thu: v }, 1, o).thu, null));
  assert.ok(dai(tinh('thalesLuoi', { thu: 1e6 }, 1, o).thu.tu, tinh('thalesLuoi', { thu: 1e6 }, 1, o).thu.cuoi) < 40, 'số quá lớn thì dừng ở trần');
});

test('đoạn em gõ: lỗi hay gặp (gấp đôi BC) vẽ đủ dài, chỉ số quá lớn mới bị cắt và có đánh dấu cắt bớt', () => {
  const tb = { AB: 9, AC: 10, BC: 12, thu: { tu: 'M', den: 'N' } };
  const g24 = tinh('thalesTrungBinh', { thu: 24 }, 1, tb);
  GAN(dai(g24.thu.tu, g24.thu.cuoi), 24); assert.strictEqual(g24.thu.catBot, false);
  const gLon = tinh('thalesTrungBinh', { thu: 500 }, 1, tb);
  assert.strictEqual(gLon.thu.catBot, true); assert.ok(dai(gLon.thu.tu, gLon.thu.cuoi) < 500);
  const pg = { AB: 6, AC: 8, BC: 7, thu: { tu: 'D', den: 'C' } };
  [2.25, 12, 14].forEach(v => { const g = tinh('thalesPhanGiac', { thu: v }, 1, pg); GAN(dai(g.thu.tu, g.thu.cuoi), v); assert.strictEqual(g.thu.catBot, false); });
  const t15 = { AB: 9, AC: 12, gocA: 58, m: 2, k: 1, thu: { tu: 'N', den: 'C' } };
  [12, 16].forEach(v => { const g = tinh('thalesLuoi', { thu: v }, 1, t15); GAN(dai(g.thu.tu, g.thu.cuoi), v); assert.strictEqual(g.thu.catBot, false); });
});

test('thalesDoan: số phần nhân đơn vị bằng độ dài', () => {
  [[6, 15, 3], [40, 200, 40], [17, 13, 1], [90, 300, 30]].forEach(([a, b, u]) => {
    const g = tinh('thalesDoan', {}, 1, { a, b, u });
    GAN(g.na * u, a); GAN(g.nb * u, b); GAN(g.na / g.nb, a / b);
  });
});

const TB = []; for (let ax = -1; ax <= 9; ax += 1) for (let bc = 6; bc <= 12; bc += 1.5) TB.push({ ax, bc });
const TB_O = [{}, { AB: 9, AC: 10, BC: 12 }, { AB: 240, AC: 360, BC: 260 }, { AB: 8, AC: 12, BC: 10 }];

test('thalesTrungBinh: quay nửa vòng quanh N đưa A tới C và tạo hình bình hành MBCM′, nên MN = BC/2 và MN ∥ BC', () => {
  TB_O.forEach(o => TB.forEach(p => {
    const g = tinh('thalesTrungBinh', p, 1, o);
    GAN(dai(g.manh[0], g.C), 0, 'A tới C', 1e-7);
    GAN(dai(g.manh[1], g.M2), 0, 'M tới M′', 1e-7);
    GAN(g.M2[0] - g.C[0], g.M[0] - g.B[0], 'CM′ = BM (x)', 1e-7); GAN(g.M2[1] - g.C[1], g.M[1] - g.B[1], 'CM′ = BM (y)', 1e-7);
    GAN(dai(g.M, g.M2), g.BC, 'MM′ = BC', 1e-7); GAN(g.MN, g.BC / 2, 'MN = BC/2', 1e-7);
    assert.ok(songSong(g.M, g.N, g.B, g.C), 'MN ∥ BC');
  }));
});

test('thalesTrungBinh: mảnh quay không đổi hình ở mọi t, N đứng yên', () => {
  TB.forEach(p => TT.forEach(t => {
    const g = tinh('thalesTrungBinh', p, t, {}), A = g.A, M = g.M, N = g.N, h = g.manh;
    GAN(dai(h[0], h[1]), dai(A, M)); GAN(dai(h[1], h[2]), dai(M, N)); GAN(dai(h[0], h[2]), dai(A, N)); GAN(dai(h[2], N), 0);
    huuHan(g);
  }));
});

test('thalesTrungBinh: ba đường trung bình, mỗi đường hai lần vừa khít cạnh song song với nó', () => {
  TB_O.forEach(o => TB.forEach(p => {
    const g = tinh('thalesTrungBinh', p, 1, Object.assign({ dang: 'ba' }, o));
    const canh = [[g.B, g.C], [g.A, g.B], [g.A, g.C]];
    g.banSao.forEach((b, j) => {
      GAN(dai(b.doan[0][0], canh[j][0]), 0, 'đầu cạnh ' + j, 1e-7);
      GAN(dai(b.doan[0][1], b.doan[1][0]), 0, 'hai bản sao nối nhau ' + j, 1e-7);
      GAN(dai(b.doan[1][1], canh[j][1]), 0, 'cuối cạnh ' + j, 1e-7);
    });
    huuHan(tinh('thalesTrungBinh', p, .5, Object.assign({ dang: 'ba' }, o)));
  }));
});

const PG = []; for (let ab = 3; ab <= 9; ab += 1.5) for (let ac = 3; ac <= 9; ac += 1.5) for (let gocA = 40; gocA <= 120; gocA += 20) PG.push({ ab, ac, gocA });

test('thalesPhanGiac: chân phân giác chia BC theo tỉ số AB : AC, cách đều hai cạnh, tỉ số diện tích khớp', () => {
  PG.forEach(p => {
    const g = tinh('thalesPhanGiac', p, 1);
    GAN(g.DB / g.DC, g.AB / g.AC, 'DB/DC', 1e-9);
    GAN(g.DB + g.DC, dai(g.B, g.C), 'D nằm giữa B và C', 1e-9);
    GAN(g.DE, g.DF, 'DE = DF', 1e-9);
    GAN(g.S1 / g.S2, g.DB / g.DC, 'chung đường cao', 1e-9);
    GAN(g.S1, g.AB * g.DE / 2, 'S1 theo đáy AB', 1e-9); GAN(g.S2, g.AC * g.DF / 2, 'S2 theo đáy AC', 1e-9);
    TT.forEach(t => huuHan(tinh('thalesPhanGiac', p, t, { thu: { tu: 'D', den: 'C' } })));
  });
  [[6, 8, 7], [9, 12, 14], [12, 8, 12], [30, 45, 40]].forEach(([AB, AC, BC]) => {
    const g = tinh('thalesPhanGiac', {}, 1, { AB, AC, BC });
    GAN(g.AB, AB, 'AB', 1e-9); GAN(g.AC, AC, 'AC', 1e-9); GAN(g.DB, BC * AB / (AB + AC), 'DB', 1e-9);
  });
});
