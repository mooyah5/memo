// scripts/svg2sass-raw.mjs
// 목적: SVG → 퍼센트 인코딩된 SCSS "한 줄 @function" 생성
// B 패턴(위험 감수): 최종 결과에 #{$extrastyles}, #{$fillcolor}, #{$strokecolor} 그대로 삽입
// 안전장치:
//  - 자식 노드 색상은 절대 변경하지 않고, 루트 <svg>만 변수화
//  - 전역(g) 치환, %27/ %22 모두 대응
//  - 파일명 → 함수명: prefix + 파일명(언더스코어 보존) = sassvg-ico_{filename}
//  - SVGO 플러그인 중 시각 변화 유발 가능성 높은 것 비활성화, --no-svgo 옵션 제공
//  - 헤더에 실제 적용된 옵션(특히 prefix) 기록

import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    input: 'svgs',
    output: 'styles/_svg-data.scss',
    // 기본 prefix (필요 시 하드코딩)
    prefix: 'sassvg-ico_',
    quote: 'single',              // single | double
    fillMode: 'none',             // none | keep | force  ← 기본 none(상속 이슈 회피)
    strokeMode: 'keep',           // none | keep | force
    styleMode: 'force',           // none | keep | force
    useSvgo: true,                // --no-svgo 로 끌 수 있음
    debug: false
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--input' && args[i + 1]) opts.input = args[++i];
    else if (a === '--output' && args[i + 1]) opts.output = args[++i];
    else if (a.startsWith('--prefix=')) opts.prefix = a.split('=')[1];
    else if (a === '--prefix' && args[i + 1]) opts.prefix = args[++i];
    else if (a === '--quote' && args[i + 1]) opts.quote = args[++i]; // single|double
    else if (a === '--fill-mode' && args[i + 1]) opts.fillMode = args[++i]; // none|keep|force
    else if (a === '--stroke-mode' && args[i + 1]) opts.strokeMode = args[++i]; // none|keep|force
    else if (a === '--style-mode' && args[i + 1]) opts.styleMode = args[++i]; // none|keep|force
    else if (a === '--no-svgo') opts.useSvgo = false;
    else if (a === '--debug') opts.debug = true;
  }
  return opts;
}

// 파일명 → 함수명: 언더스코어/하이픈 보존
function slugForFnName(str) {
  return str
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^-+|-+$/g, '');
}

function cleanSvg(svg, quote) {
  let s = svg
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
  if (quote === 'single') {
    s = s.replace(/"/g, `'`);
  }
  return s;
}

// 루트 <svg ...>만 수정: style/fill/stroke를 정책대로 __STYLE__/__FILL__/__STROKE__로
function mutateSvgOpeningTagOnly(svg, { quote, styleMode, fillMode, strokeMode }) {
  const m = svg.match(/^<svg\b[^>]*>/i);
  if (!m) return svg;

  const q = quote === 'single' ? `'` : `"`;
  let tag = m[0];
  const rest = svg.slice(tag.length);

  // style
  const styleRe = /\sstyle=['"][^'"]*['"]/i;
  const hasStyle = styleRe.test(tag);
  if (styleMode === 'force') {
    if (hasStyle) tag = tag.replace(styleRe, ` style=${q}__STYLE__${q}`);
    else tag = tag.replace(/^<svg\b/i, `<svg style=${q}__STYLE__${q}`);
  } else if (styleMode === 'keep') {
    if (hasStyle) tag = tag.replace(styleRe, ` style=${q}__STYLE__${q}`);
  }
  // fill (루트만)
  const fillRe = /\sfill=['"][^'"]*['"]/i;
  const hasFill = fillRe.test(tag);
  if (fillMode === 'force') {
    if (hasFill) tag = tag.replace(fillRe, ` fill=${q}__FILL__${q}`);
    else tag = tag.replace(/^<svg\b/i, `<svg fill=${q}__FILL__${q}`);
  } else if (fillMode === 'keep') {
    if (hasFill) tag = tag.replace(fillRe, ` fill=${q}__FILL__${q}`);
  }
  // stroke (루트만)
  const strokeRe = /\sstroke=['"][^'"]*['"]/i;
  const hasStroke = strokeRe.test(tag);
  if (strokeMode === 'force') {
    if (hasStroke) tag = tag.replace(strokeRe, ` stroke=${q}__STROKE__${q}`);
    else tag = tag.replace(/^<svg\b/i, `<svg stroke=${q}__STROKE__${q}`);
  } else if (strokeMode === 'keep') {
    if (hasStroke) tag = tag.replace(strokeRe, ` stroke=${q}__STROKE__${q}`);
  }

  return tag + rest;
}

// 전체 퍼센트 인코딩 후, 토큰을 Sass 변수로 전역 치환(단/쌍따옴표 모두)
function encodeAndInjectTokens(s) {
  let enc = encodeURIComponent(s)
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');

  enc = enc
    .replace(/%27__STYLE__%27/g,  "%27#{$extrastyles}%27")
    .replace(/%27__FILL__%27/g,   "%27#{$fillcolor}%27")
    .replace(/%27__STROKE__%27/g, "%27#{$strokecolor}%27")
    .replace(/%22__STYLE__%22/g,  "%22#{$extrastyles}%22")
    .replace(/%22__FILL__%22/g,   "%22#{$fillcolor}%22")
    .replace(/%22__STROKE__%22/g, "%22#{$strokecolor}%22");

  return enc;
}

function optimizeMaybe(svg, useSvgo) {
  if (!useSvgo) return svg;
  return optimize(svg, {
    multipass: true,
    // 시각 변화 유발 가능성 낮추기 위한 설정
    plugins: [
      'preset-default',
      { name: 'removeXMLNS', active: false },
      { name: 'removeViewBox', active: false },
      { name: 'removeUnknownsAndDefaults', active: false },
      { name: 'removeUselessStrokeAndFill', active: false },
      { name: 'convertShapeToPath', active: false },
      // 필요 시 더 끌 수 있음: mergePaths, convertPathData 등
    ],
  }).data;
}

function convertOne(filePath, opts) {
  const raw = fs.readFileSync(filePath, 'utf8');

  const pre = optimizeMaybe(raw, opts.useSvgo);
  let s = cleanSvg(pre, opts.quote);
  const before = s;

  s = mutateSvgOpeningTagOnly(s, opts); // 루트만 변수화
  const after = s;

  const encoded = encodeAndInjectTokens(s);
  const dataUri = `data:image/svg+xml;charset=US-ASCII,${encoded}`;
  return { dataUri, before, after, encoded };
}

function buildOneFunction(funcName, dataUri) {
  return `@function ${funcName}($fillcolor, $strokecolor, $extrastyles){ @return '${dataUri}'; }\n`;
}

async function main() {
  const opts = parseArgs();
  const inputDir = path.isAbsolute(opts.input) ? opts.input : path.join(process.cwd(), opts.input);
  const outputFile = path.isAbsolute(opts.output) ? opts.output : path.join(process.cwd(), opts.output);

  if (!fs.existsSync(inputDir)) {
    console.error(`[svg2sass-raw] 입력 폴더 없음: ${inputDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.svg'));
  if (files.length === 0) console.warn('[svg2sass-raw] 변환할 SVG 없음.');

  const out = [];
  out.push(`// Auto-generated by svg2sass-raw.mjs on ${new Date().toISOString()}`);
  out.push(`// OPTIONS: prefix="${opts.prefix}", quote=${opts.quote}, fillMode=${opts.fillMode}, strokeMode=${opts.strokeMode}, styleMode=${opts.styleMode}, svgo=${opts.useSvgo}`);
  out.push(`// NOTE: Root <svg> only; children keep original colors.`);
  out.push('');

  for (const f of files) {
    const base = path.basename(f, path.extname(f));
    const fnBase = slugForFnName(base);
    const funcName = `${opts.prefix}${fnBase}`;  // ← prefix 적용
    try {
      const { dataUri, before, after, encoded } = convertOne(path.join(inputDir, f), opts);

      // 토큰 잔존 검사
      if (/__STYLE__|__FILL__|__STROKE__/.test(encoded)) {
        console.warn(`[svg2sass-raw][WARN] 토큰 잔존: ${f} (치환 누락)`);
      }

      out.push(buildOneFunction(funcName, dataUri));
    } catch (e) {
      console.error(`[svg2sass-raw] 실패: ${f}`, e);
    }
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, out.join('\n'), 'utf8');
  console.log(`[svg2sass-raw] 완료: ${files.length}개 함수 → ${outputFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});