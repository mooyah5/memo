// file: tools/gif-to-mp4.js

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let ffmpegPath;
try {
    ffmpegPath = require("@ffmpeg-installer/ffmpeg").path; // 패키지 내 바이너리 경로
} catch {
    ffmpegPath = "ffmpeg"; // 패키지 없으면 시스템 PATH의 ffmpeg 사용
}

function run(cmd) {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

function ensureDir(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        in: "./assets/gifs_in",
        out: "./assets/out",
        width: 800,
        poster: true,
        crf: 18,
        preset: "slow",
        scaler: "lanczos", // 'neighbor' | 'lanczos'
        tune: "animation",
        posterExt: "jpg", // 'jpg' | 'png'
        public: "", // HTML에서 참조할 prefix 경로 (예: /static/events/2025/winter)
    };
    for (let i = 0; i < args.length; i += 2) {
        const k = args[i].replace(/^--/, "");
        const v = args[i + 1];
        const num = Number(v);
        opts[k] = Number.isNaN(num) ? v : num;
    }
    // public 경로 정리 (끝 슬래시 제거)
    if (typeof opts.public === "string") {
        opts.public = opts.public.replace(/\/+$/, "");
    }
    return opts;
}

function toSafeName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "");
}

function verifyFfmpegOrExit() {
    try {
        execSync(`"${ffmpegPath}" -version`, { stdio: "ignore" });
    } catch {
        console.error("❌ ffmpeg 실행 파일을 찾을 수 없습니다.");
        console.error(" - npm 패키지로: yarn add @ffmpeg-installer/ffmpeg");
        console.error(" - 또는 시스템 설치 후 PATH 설정 (Windows: ffmpeg.org / macOS: brew install ffmpeg)");
        process.exit(1);
    }
}

function convertOne(file, opts) {
    const basename = path.basename(file, path.extname(file));
    const safe = toSafeName(basename);
    const inPath = file;
    const outMp4 = path.join(opts.out, `${safe}.mp4`);
    const outPoster = path.join(opts.out, `${safe}.${opts.posterExt}`);

    console.log(`\n[${basename}] 변환 시작`);

    if (!fs.existsSync(outMp4)) {
        // 다운스케일만 (업스케일 금지), 스케일러 선택, 밴딩 완화(gradfun), 애니메이션 튜닝
        const scaleExpr = `scale='if(gt(iw,${opts.width}),${opts.width},iw)':-2:flags=${opts.scaler},setsar=1`;
        const tune = opts.tune ? `-tune ${opts.tune}` : "";
        run(
            `"${ffmpegPath}" -y -i "${inPath}" -vf "${scaleExpr},format=yuv420p,gradfun=10" ` +
                `-crf ${opts.crf} -movflags +faststart -pix_fmt yuv420p -profile:v main -level 4.0 ` +
                `-preset ${opts.preset} ${tune} "${outMp4}"`
        );
        console.log(`✅ Converted: ${basename} → ${safe}.mp4`);
    } else {
        console.log(`↪︎ 이미 존재: ${path.basename(outMp4)} — 스킵`);
    }

    if (opts.poster) {
        if (!fs.existsSync(outPoster)) {
            run(`"${ffmpegPath}" -y -i "${inPath}" -vf "scale='if(gt(iw,${opts.width}),${opts.width},iw)':-2:flags=${opts.scaler}" -frames:v 1 "${outPoster}"`);
            console.log(`🖼️ Poster created: ${safe}.${opts.posterExt}`);
        } else {
            console.log(`↪︎ 이미 존재: ${path.basename(outPoster)} — 스킵`);
        }
    }

    // HTML 경로(prefix) 구성
    // public이 비어있지 않으면 "/prefix/파일" 형태, 비어있으면 "파일명만"
    const srcBase = opts.public ? `${opts.public}` : "";
    const posterPath = srcBase ? `${srcBase}/${safe}.${opts.posterExt}` : `${safe}.${opts.posterExt}`;
    const mp4Path = srcBase ? `${srcBase}/${safe}.mp4` : `${safe}.mp4`;

    // <source> 포함한 video 스니펫
    const htmlSnippet = `
        <video autoplay muted playsinline loop poster="${posterPath}" width="${opts.width}">
            <source src="${mp4Path}" type="video/mp4">
        </video>
    `;
    //   <!-- 폴백 (source 태그 뒤): 브라우저가 <source>를 지원하지 않을 때 텍스트로 파일 경로 표시 -->
    //   ${mp4Path}
    fs.appendFileSync(path.join(opts.out, "video-snippets.html"), htmlSnippet);
}

(function main() {
    const opts = parseArgs();
    console.log("▶︎ 옵션:", opts);
    ensureDir(opts.in);
    ensureDir(opts.out);

    verifyFfmpegOrExit();

    const files = fs
        .readdirSync(opts.in)
        .filter((f) => f.toLowerCase().endsWith(".gif"))
        .map((f) => path.join(opts.in, f));

    if (files.length === 0) {
        console.log("⚠️ GIF 파일을 찾지 못했습니다. 폴더 확인:", opts.in);
        process.exit(0);
    }

    console.log(`📦 발견된 GIF: ${files.length}개`);
    files.forEach((f) => convertOne(f, opts));
    console.log(`\n🎉 변환 완료. 출력 폴더: ${opts.out}`);
})();
