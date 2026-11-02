// Chấm đáp án: tương đương bằng thay số ngẫu nhiên, kiểm tra dạng (khai triển / nhân tử / rút gọn).
(function (root, factory) {
  var isNode = typeof module === 'object' && module.exports;
  var P = isNode ? require('./parser.js') : root.TOAN8.parser;
  var N = isNode ? require('../../lib/nerdamer/nerdamer.js') : root.nerdamer;
  var m = factory(P, N);
  if (isNode) module.exports = m;
  else root.TOAN8.checker = m;
})(typeof self !== 'undefined' ? self : this, function (P, N) {
  'use strict';
  var TRIALS = 12, NEED = 6;

  function rnd() { var v = 0.3 + Math.random() * 2.7; return Math.random() < 0.5 ? -v : v; }
  function close(a, b) { return Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)); }

  function equivalentAst(a, b) {
    var vars = P.variables(a).concat(P.variables(b)).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    if (!vars.length) {
      var x0 = P.evaluate(a, {}), y0 = P.evaluate(b, {});
      return isFinite(x0) && isFinite(y0) && close(x0, y0);
    }
    var good = 0;
    for (var i = 0; i < TRIALS * 3 && good < TRIALS; i++) {
      var env = {};
      vars.forEach(function (v) { env[v] = rnd(); });
      var x = P.evaluate(a, env), y = P.evaluate(b, env);
      if (!isFinite(x) || !isFinite(y)) continue; // mẫu = 0 hoặc căn số âm: bỏ điểm này
      if (!close(x, y)) return false;
      good++;
    }
    return good >= NEED;
  }
  function equivalent(sa, sb) { return equivalentAst(P.parse(sa), P.parse(sb)); }

  function isConst(n) { return P.variables(n).length === 0; }

  // Chữ kí đơn thức ("x^2 y^1"), hoặc null nếu không phải đơn thức.
  function monoSig(n) {
    if (n.t === 'neg') return monoSig(n.a);
    if (n.t === 'div') return isConst(n.b) ? monoSig(n.a) : null;
    var fs = n.t === 'mul' ? n.fs : [n], pw = {};
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (isConst(f)) continue;
      if (f.t === 'var') pw[f.n] = (pw[f.n] || 0) + 1;
      else if (f.t === 'pow' && f.b.t === 'var' && f.e.t === 'num') pw[f.b.n] = (pw[f.b.n] || 0) + f.e.v;
      else if (f.t === 'div' || f.t === 'neg') {
        var s = monoSig(f);
        if (s === null) return null;
        s.split(' ').filter(Boolean).forEach(function (p) { var kv = p.split('^'); pw[kv[0]] = (pw[kv[0]] || 0) + Number(kv[1]); });
      } else return null;
    }
    return Object.keys(pw).sort().map(function (k) { return k + '^' + pw[k]; }).join(' ');
  }

  // Đơn thức đã thu gọn: nhiều nhất một hệ số, mỗi biến chỉ xuất hiện một lần (2x·3x²y chưa thu gọn).
  function isCollectedMono(n) {
    while (n.t === 'neg') n = n.a;
    if (n.t !== 'mul') return true;
    var consts = 0, vars = {};
    for (var i = 0; i < n.fs.length; i++) {
      var f = n.fs[i];
      if (isConst(f)) { consts++; continue; }
      var v = f.t === 'var' ? f.n : f.t === 'pow' && f.b.t === 'var' ? f.b.n : null;
      if (v === null) continue;
      if (vars[v]) return false;
      vars[v] = 1;
    }
    return consts <= 1;
  }

  function isExpanded(ast) {
    var terms = ast.t === 'add' ? ast.terms : [ast], seen = {};
    for (var i = 0; i < terms.length; i++) {
      var s = monoSig(terms[i]);
      if (s === null) return { ok: false, ly: 'Đúng giá trị, nhưng em cần khai triển hết (không còn dấu ngoặc).' };
      if (!isCollectedMono(terms[i])) return { ok: false, ly: 'Đúng giá trị, nhưng em cần thu gọn đơn thức (nhân các hệ số với nhau, gộp các lũy thừa cùng biến).' };
      if (seen[s]) return { ok: false, ly: 'Đúng giá trị, nhưng em còn các hạng tử đồng dạng chưa thu gọn.' };
      seen[s] = 1;
    }
    return { ok: true };
  }

  // Tách biểu thức (sau khi nerdamer phân tích) thành các nhân tử ở nút gốc.
  function topFactors(n) {
    if (n.t === 'neg') return topFactors(n.a);
    return n.t === 'mul' ? n.fs : [n];
  }
  function factorOf(str) { return P.parse(String(N.factor(str).toString())); }

  function nonConstFactorCount(str) {
    var c = 0;
    topFactors(factorOf(str)).forEach(function (x) {
      if (isConst(x)) return;
      c += x.t === 'pow' && x.e.t === 'num' ? x.e.v : 1;
    });
    return c;
  }

  function isFactored(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    var no = { ok: false, ly: 'Đúng giá trị, nhưng chưa phân tích thành nhân tử (kết quả phải là một tích).' };
    var fs = n.t === 'mul' ? n.fs : n.t === 'pow' ? [n] : null;
    if (!fs) return no;
    var total = 0, nonConst = 0;
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i], base = f, mult = 1;
      if (f.t === 'pow' && f.e.t === 'num' && Number.isInteger(f.e.v)) { base = f.b; mult = f.e.v; }
      total += mult;
      if (isConst(base)) continue;
      nonConst += mult;
      if (nonConstFactorCount(P.toNerdamer(base)) > 1)
        return { ok: false, ly: 'Gần đúng rồi! Nhân tử $' + P.toLatex(base) + '$ vẫn còn phân tích tiếp được.' };
      var ct = intContent(base);
      if (ct > 1)
        return { ok: false, ly: 'Gần đúng rồi! Nhân tử $' + P.toLatex(base) + '$ còn đặt được nhân tử chung $' + ct + '$.' };
    }
    if (total < 2 || nonConst < 1) return no;
    return { ok: true };
  }

  function gcdInt(a, b) { return b ? gcdInt(b, a % b) : a; }
  // Ước chung nguyên (dương) của các hệ số: lấy tích các nhân tử hằng ở nút gốc sau khi phân tích.
  function intContent(n) {
    var c = 1;
    topFactors(factorOf(P.toNerdamer(n))).forEach(function (x) { if (isConst(x)) c *= Math.abs(P.evaluate(x, {})); });
    return Number.isInteger(c) ? c : 1;
  }

  // Có phép chia cho biểu thức chứa biến ở đâu đó bên trong (vd 1/x − 1/(x+2))?
  function hasVarDiv(n) {
    if (!n || typeof n !== 'object') return false;
    if (n.t === 'div' && !isConst(n.b)) return true;
    return [n.a, n.b].concat(n.fs || [], n.terms || []).some(hasVarDiv);
  }
  var MOT_PHAN_THUC = 'Đúng giá trị, nhưng em cần viết gọn thành **một** phân thức (quy đồng, cộng/nhân tử với tử) rồi rút gọn.';
  function isReduced(ast) {
    var n = ast.t === 'neg' ? ast.a : ast;
    // "5/(4−2x)² · (−2)": một phân thức nhân với đa thức → gộp thành một phân thức rồi xét như thường
    if (n.t === 'mul') {
      var phan = n.fs.filter(function (f) { return f.t === 'div' && !isConst(f.b); });
      var con = n.fs.filter(function (f) { return phan.indexOf(f) < 0; });
      if (phan.length === 1 && !con.some(hasVarDiv)) n = { t: 'div', a: { t: 'mul', fs: con.concat([phan[0].a]) }, b: phan[0].b };
    }
    if (n.t !== 'div') return hasVarDiv(n) ? { ok: false, ly: MOT_PHAN_THUC } : { ok: true };
    if (hasVarDiv(n.a) || hasVarDiv(n.b)) return { ok: false, ly: MOT_PHAN_THUC };
    var g = P.parse(String(N('gcd(' + P.toNerdamer(n.a) + ',' + P.toNerdamer(n.b) + ')').toString()));
    if (!isConst(g)) return { ok: false, ly: 'Đúng giá trị, nhưng tử và mẫu vẫn còn nhân tử chung. Em rút gọn tiếp nhé.' };
    if (gcdInt(intContent(n.a), intContent(n.b)) > 1) return { ok: false, ly: 'Đúng giá trị, nhưng tử và mẫu còn ước chung là số. Em chia tiếp nhé.' };
    return { ok: true };
  }

  function parseNumber(s) {
    var t = String(s == null ? '' : s).replace(/\s+/g, '');
    // "9.801", "1.234,5": dấu chấm phân cách hàng nghìn kiểu Việt Nam (không phải dấu thập phân)
    // (0.125 không bao giờ là cách viết hàng nghìn nên số đầu phải từ 1 đến 9)
    if (/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '');
    return parseNumberDot(t);
  }
  // Đọc số coi dấu chấm là dấu thập phân.
  function parseNumberDot(s) {
    try { var a = P.parse(s); return isConst(a) ? P.evaluate(a, {}) : NaN; } catch (e) { return NaN; }
  }

  var MSG = {
    dung: 'Chính xác!',
    sai: 'Chưa đúng. Em thử lại hoặc bấm Gợi ý nhé.',
    khongDoc: 'Máy chưa đọc được. Lũy thừa viết là x^2, phép nhân có thể viết liền: 2x(x+1).'
  };
  function res(code, msg, extra) {
    var r = { ok: code === 'dung', code: code, msg: msg || MSG[code] };
    for (var k in extra || {}) r[k] = extra[k];
    return r;
  }
  function near(x, y, tol) { return Math.abs(x - y) <= tol + 1e-12; }

  function isBlank(v) { return v == null || (typeof v === 'string' && !v.trim()); }
  // Chữ có dấu tiếng Việt trong ô nhập toán: gần như chắc bộ gõ (Unikey Telex/VNI) đang bật, vd "ax" → "ã".
  var VIET = /[À-ỹđĐ]/;
  var MSG_BOGO = 'Hình như bộ gõ tiếng Việt đang bật (máy thấy chữ có dấu). Em tắt bộ gõ (thường là Ctrl+Shift) rồi gõ lại nhé.';

  function checkExpr(d, input, ltg) {
    var a;
    // "y = 2x + 3", "f(x) = …": chỉ chấm vế phải
    input = String(input == null ? '' : input).replace(/^\s*([A-Za-z][A-Za-z0-9']{0,3}|[A-Za-z]\s*\(\s*x\s*\))\s*=/, '');
    try { a = P.parse(input); } catch (e) { return res('khongDoc', VIET.test(String(input)) ? MSG_BOGO : null); }
    var g = P.parse(d.gt);
    if (!equivalentAst(a, g)) {
      var low = lowerVars(a, g);
      if (low && equivalentAst(low, g))
        return res('saiDang', 'Gần đúng rồi! Em đang gõ chữ in hoa (vd X); máy phân biệt x và X. Em tắt Caps Lock rồi gõ lại nhé.');
      for (var i = 0; i < ltg.length; i++)
        if (ltg[i].gt != null && equivalentAst(a, P.parse(ltg[i].gt))) return res('loiThuongGap', ltg[i].giaiThich);
      return res('sai');
    }
    var chk = d.dang === 'khaiTrien' ? isExpanded(a) : d.dang === 'nhanTu' ? isFactored(a) : d.dang === 'rutGon' ? isReduced(a) : { ok: true };
    return chk.ok ? res('dung') : res('saiDang', chk.ly);
  }

  // Đổi chữ in hoa không có trong đáp án thành chữ thường (X → x); null nếu không có gì để đổi.
  function lowerVars(a, g) {
    var gv = P.variables(g), changed = false;
    var copy = JSON.parse(JSON.stringify(a));
    (function walk(n) {
      if (n.t === 'var' && n.n !== n.n.toLowerCase() && gv.indexOf(n.n) < 0) { n.n = n.n.toLowerCase(); changed = true; }
      ['a', 'b', 'e'].forEach(function (k) { if (n[k]) walk(n[k]); });
      (n.terms || n.fs || []).forEach(walk);
    })(copy);
    return changed ? copy : null;
  }

  // Đơn vị đo viết sau số ("6 cm", "12 cm²", "60°", "60 độ") – bỏ đi, chỉ chấm con số.
  var DON_VI = /(\d)\s*(mm|cm|dm|km|m|g|kg|l|ml|giây|phút|giờ|ngày|độ|°|đồng|người|học sinh|lần)(2|3|²|³)?\.?$/i;
  function checkNumber(d, input, ltg) {
    // "x = 2", "AB = 6 cm": chỉ lấy vế phải
    input = String(input == null ? '' : input).trim().replace(/^[A-Za-z][A-Za-z0-9']{0,3}\s*=\s*/, '').replace(DON_VI, '$1');
    input = input.replace(/\s*phần\s*trăm$/i, '%');
    // "46 nghìn", "1,5 triệu đồng": bậc của số – nhận cả khi nhân bậc (46000) lẫn khi đề đã tính theo bậc đó (0,5 triệu)
    var bac = 1, mb = /^(.*\d)\s*(nghìn|ngàn|triệu|tỉ|tỷ)(\s.*)?$/i.exec(input);
    if (mb) { bac = { 'nghìn': 1e3, 'ngàn': 1e3, 'triệu': 1e6, 'tỉ': 1e9, 'tỷ': 1e9 }[mb[2].toLowerCase()]; input = mb[1].trim(); }
    // "12 bạn", "3 quyển sách": con số rồi tới chữ (đơn vị bất kỳ) – chỉ giữ con số
    var m = /^([-−]?[\d.,/√()\s]*\d[\d.,/√()%\s]*?)\s+[A-Za-zÀ-ỹđĐ][^\d]*$/.exec(input);
    if (m) input = m[1].trim();
    var y = typeof d.gt === 'number' ? d.gt : parseNumber(d.gt);
    var tol = d.saiSo != null ? d.saiSo : 1e-9;
    // "25%" = 0,25. Khi đáp án là chính số phần trăm (|đáp án| > 1, vd đề hỏi "bao nhiêu phần trăm" → 25) thì "25%" cũng đúng.
    // Không bao giờ nhận "0,1%" cho đáp án 0,1. Phần trăm làm tròn 2 chữ số thập phân (33,33% ≈ 1/3) được chấp nhận.
    if (/%$/.test(input)) {
      var v = parseNumber(input.replace(/\s*%$/, ''));
      if (Number.isNaN(v)) return res('khongDoc', 'Em nhập một số, ví dụ 25% hoặc 0,25.');
      if (near(v / 100, y, Math.max(tol, 5e-5)) || (Math.abs(y) > 1 && near(v, y, tol))) return res('dung');
      input = String(v / 100);
    }
    var x = parseNumber(input);
    if (Number.isNaN(x)) return res('khongDoc', VIET.test(String(input)) ? MSG_BOGO : 'Em nhập một số, ví dụ 12 hoặc 0,5 hoặc 3/4.');
    if (near(x, y, tol) || (bac > 1 && near(x * bac, y, tol))) return res('dung');
    // "1.125": vừa có thể là 1125 (chấm hàng nghìn) vừa là 1,125 (chấm thập phân) – nhận nếu một trong hai đúng
    var x2 = parseNumberDot(input);
    if (!Number.isNaN(x2) && near(x2, y, tol)) return res('dung');
    for (var j = 0; j < ltg.length; j++)
      if (near(x, parseNumber(String(ltg[j].gt)), tol)) return res('loiThuongGap', ltg[j].giaiThich);
    return res('sai');
  }

  function sameSet(vals, wanted) {
    var want = wanted.slice();
    return vals.length === want.length && vals.every(function (v) {
      var k = want.findIndex(function (w) { return near(w, v, 1e-9); });
      if (k < 0) return false;
      want.splice(k, 1);
      return true;
    });
  }

  function checkRoots(d, input, ltg) {
    var s = String(input == null ? '' : input).toLowerCase().trim();
    if (/vô\s*nghiệm|vo\s*nghiem|không\s*có\s*nghiệm|khong\s*co\s*nghiem|rỗng|∅|ø|\{\s*\}/.test(s)) return res(d.gt === 'voNghiem' ? 'dung' : 'sai');
    if (/vô\s*số|vo\s*so/.test(s)) return res(d.gt === 'voSoNghiem' ? 'dung' : 'sai');
    // "S = {2; 3}", "x ∈ {2; 3}": bỏ phần ghi tập hợp, giữ các nghiệm
    s = s.replace(/^s\s*=\s*/, '').replace(/^[a-z]\s*∈\s*/, '').replace(/^\{(.*)\}$/, '$1').trim();
    // tách nghiệm theo ";", "hoặc", hoặc dấu phẩy đứng trước khoảng trắng / dấu trừ / chữ ("0,5" vẫn là một số)
    var parts = s.split(/;|hoặc|hoac|,(?=\s|-|[a-z])/).map(function (t) { return t.trim().replace(/^[a-z]\s*=/, '').trim(); }).filter(Boolean);
    var vals = parts.map(parseNumber);
    if (!vals.length || vals.some(Number.isNaN)) return res('khongDoc', 'Ghi các nghiệm cách nhau bằng dấu ; ví dụ: x = 2; x = -3' + (Array.isArray(d.gt) ? '' : ' (hoặc ghi "vô nghiệm", "vô số nghiệm")'));
    if (!Array.isArray(d.gt)) return res('sai');
    if (sameSet(vals, d.gt)) return res('dung');
    // "1.125" vừa có thể là 1125 vừa là 1,125 (như câu số): thử cách đọc dấu chấm là dấu thập phân
    var vals2 = parts.map(function (t) { var x = parseNumberDot(t.replace(/\s+/g, '')); return Number.isNaN(x) ? parseNumber(t) : x; });
    if (sameSet(vals2, d.gt)) return res('dung');
    for (var i = 0; i < ltg.length; i++)
      if (Array.isArray(ltg[i].gt) && sameSet(vals, ltg[i].gt)) return res('loiThuongGap', ltg[i].giaiThich);
    return res('sai', vals.length < d.gt.length ? 'Chưa đủ: em còn thiếu nghiệm.' : null);
  }

  function checkAnswer(d, input, ltg) {
    ltg = ltg || [];
    switch (d.kieu) {
      case 'bieuThuc': return checkExpr(d, input, ltg);
      case 'so': return checkNumber(d, input, ltg);
      case 'nghiem': return checkRoots(d, input, ltg);
      case 'chon': return res(input != null && Number(input) === d.gt ? 'dung' : 'sai');
      case 'dungSai': return res(input === d.gt ? 'dung' : 'sai');
      case 'nhieuO': {
        var vals = input || [];
        var nhan = function (i) { return d.o[i].nhan || ('ô ' + (i + 1)); };
        var trong = d.o.map(function (_, i) { return i; }).filter(function (i) { return isBlank(vals[i]); });
        if (trong.length) return res('khongDoc', 'Em chưa điền ' + trong.map(nhan).join(', ') + '.');
        var tung = d.o.map(function (sub, i) { return checkAnswer(sub, vals[i], sub.loiThuongGap); });
        var all = tung.every(function (r) { return r.ok; });
        if (all) return res('dung', null, { tungO: tung });
        // nói rõ từng ô sai và vì sao (lỗi thường gặp, sai dạng…), không chỉ "có ô sai"
        var chiTiet = tung.map(function (r, i) { return r.ok ? null : nhan(i) + ': ' + (r.code === 'sai' ? 'chưa đúng.' : r.msg); }).filter(Boolean);
        return res('sai', chiTiet.join(' \n') + (tung.some(function (r) { return r.code === 'sai'; }) ? ' \nEm xem lại các ô viền đỏ hoặc bấm Gợi ý nhé.' : ''), { tungO: tung });
      }
    }
    throw new Error('Kiểu đáp án lạ: ' + d.kieu);
  }

  return {
    equivalent: equivalent, equivalentAst: equivalentAst,
    isExpanded: isExpanded, isFactored: isFactored, isReduced: isReduced,
    parseNumber: parseNumber, checkAnswer: checkAnswer
  };
});
