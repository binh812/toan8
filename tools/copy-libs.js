const fs = require('fs'), path = require('path');
const NM = path.join(__dirname, '..', 'node_modules'), LIB = path.join(__dirname, '..', 'lib');
const jobs = [
  ...[['be-vietnam-pro', [400, 500, 700]], ['bricolage-grotesque', [700, 800]]].flatMap(([ten, cacDo]) =>
    ['vietnamese', 'latin-ext', 'latin'].flatMap(bo => cacDo.map(d => {
      const f = ten + '-' + bo + '-' + d + '-normal.woff2';
      return ['@fontsource/' + ten + '/files/' + f, 'fonts/' + f];
    })).concat([['@fontsource/' + ten + '/LICENSE', 'fonts/' + ten + '-LICENSE']])),
  ['katex/dist/katex.min.js', 'katex/katex.min.js'],
  ['katex/dist/katex.min.css', 'katex/katex.min.css'],
  ['katex/dist/fonts', 'katex/fonts'],
  ['katex/LICENSE', 'katex/LICENSE'],
  ['jsxgraph/distrib/jsxgraphcore.js', 'jsxgraph/jsxgraphcore.js'],
  ['jsxgraph/distrib/jsxgraph.css', 'jsxgraph/jsxgraph.css'],
  ['jsxgraph/LICENSE.MIT', 'jsxgraph/LICENSE.MIT'],
  ['jsxgraph/LICENSE.LGPL', 'jsxgraph/LICENSE.LGPL'],
  ['mathlive/mathlive.min.js', 'mathlive/mathlive.min.js'],
  ['mathlive/fonts', 'mathlive/fonts'],
  ['mathlive/LICENSE.txt', 'mathlive/LICENSE.txt'],
  ['nerdamer/dist/bundle.js', 'nerdamer/nerdamer.js'],
  ['nerdamer/LICENSE.md', 'nerdamer/LICENSE.md'],
];
for (const [from, to] of jobs) {
  const src = path.join(NM, from), dst = path.join(LIB, to);
  if (!fs.existsSync(src)) { console.error('THIẾU', src); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true });
  console.log('ok', to);
}
const pkg = require('../package.json');
fs.writeFileSync(path.join(LIB, 'VERSIONS.txt'),
  Object.entries(pkg.devDependencies).map(([k, v]) => k + ' ' + v).join('\n') + '\n');
