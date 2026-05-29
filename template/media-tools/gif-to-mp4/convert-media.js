const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let ffmpegPath;
try {
    ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
} catch {
    ffmpegPath = "ffmpeg";
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
        mode: "gif-to-mp4", // gif-to-mp4 | mp4-optimize | mp4-to-webm

        in: "./assets/gifs_in",
        out: "./assets/out",

        width: 800,
        poster: true,
        crf: 18,
        preset: "slow",
        scaler: "lanczos",
        tune: "animation",
        posterExt: "jpg",
        public: "",

        // MP4 최적화/WebM용 옵션
        mp4Crf: 28,
        webmCrf: 32,
        audio: true
    };

    for (let i = 0; i < args.length; i += 2) {
        const k = args[i].replace(/^--/, "");
        const v = args[i + 1];

        if (v === undefined) continue;

        if (v === "true") {
            opts[k] = true;
        } else if (v === "false") {
            opts[k] = false;
        } else {
            const num = Number(v);
            opts[k] = Number.isNaN(num) ? v : num;
        }
    }

    if (typeof opts.public === "string") {
        opts.public = opts.public.replace(/\/+$/, "");
    }

    return opts;
}

function toSafeName(name, fallback = "video") {
    const safe = name
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[\\/:*?"<>|]/g, "");

    return safe || fallback;
}

function verifyFfmpegOrExit() {
    try {
        execSync(`"${ffmpegPath}" -version`, { stdio: "ignore" });
    } catch {
        console.error("❌ ffmpeg 실행 파일을 찾을 수 없습니다.");
        console.error(" - npm 패키지로: yarn add @ffmpeg-installer/ffmpeg");
        console.error(" - 또는 시스템 설치 후 PATH 설정");
        process.exit(1);
    }
}

function getInputExtByMode(mode) {
    if (mode === "gif-to-mp4") return ".gif";
    if (mode === "mp4-optimize") return ".mp4";
    if (mode === "mp4-to-webm") return ".mp4";

    console.error(`❌ 지원하지 않는 mode입니다: ${mode}`);
    console.error("사용 가능 mode: gif-to-mp4 | mp4-optimize | mp4-to-webm");
    process.exit(1);
}

function getVideoFilter(opts) {
    // 다운스케일만 하고 업스케일은 하지 않음
    return `scale='if(gt(iw,${opts.width}),${opts.width},iw)':-2:flags=${opts.scaler},setsar=1`;
}

function createHtmlSnippet({ opts, safe, videoExt, mimeType, posterPath }) {
    const srcBase = opts.public ? `${opts.public}` : "";
    const videoPath = srcBase ? `${srcBase}/${safe}.${videoExt}` : `${safe}.${videoExt}`;

    const posterAttr = posterPath ? ` poster="${posterPath}"` : "";

    const htmlSnippet = `
<video autoplay muted playsinline loop${posterAttr} width="${opts.width}">
    <source src="${videoPath}" type="${mimeType}">
</video>
`;

    fs.appendFileSync(path.join(opts.out, "video-snippets.html"), htmlSnippet);
}

function createPosterFromInput({ inputPath, outPoster, opts }) {
    if (!opts.poster) return;

    if (!fs.existsSync(outPoster)) {
        run(`"${ffmpegPath}" -y -i "${inputPath}" ` + `-vf "scale='if(gt(iw,${opts.width}),${opts.width},iw)':-2:flags=${opts.scaler}" ` + `-frames:v 1 "${outPoster}"`);
        console.log(`🖼️ Poster created: ${path.basename(outPoster)}`);
    } else {
        console.log(`↪︎ 이미 존재: ${path.basename(outPoster)} — 스킵`);
    }
}

function convertGifToMp4(file, opts, index) {
    const basename = path.basename(file, path.extname(file));
    const safe = toSafeName(basename, `video-${index + 1}`);

    const inPath = file;
    const outMp4 = path.join(opts.out, `${safe}.mp4`);
    const outPoster = path.join(opts.out, `${safe}.${opts.posterExt}`);

    console.log(`\n[${basename}] GIF → MP4 변환 시작`);

    if (!fs.existsSync(outMp4)) {
        const scaleExpr = getVideoFilter(opts);
        const tune = opts.tune ? `-tune ${opts.tune}` : "";

        run(
            `"${ffmpegPath}" -y -i "${inPath}" ` +
                `-vf "${scaleExpr},format=yuv420p,gradfun=10" ` +
                `-crf ${opts.crf} ` +
                `-movflags +faststart ` +
                `-pix_fmt yuv420p ` +
                `-profile:v main ` +
                `-level 4.0 ` +
                `-preset ${opts.preset} ` +
                `${tune} ` +
                `"${outMp4}"`
        );

        console.log(`✅ Converted: ${basename} → ${safe}.mp4`);
    } else {
        console.log(`↪︎ 이미 존재: ${path.basename(outMp4)} — 스킵`);
    }

    createPosterFromInput({
        inputPath: inPath,
        outPoster,
        opts
    });

    const srcBase = opts.public ? `${opts.public}` : "";
    const posterPath = srcBase ? `${srcBase}/${safe}.${opts.posterExt}` : `${safe}.${opts.posterExt}`;

    createHtmlSnippet({
        opts,
        safe,
        videoExt: "mp4",
        mimeType: "video/mp4",
        posterPath: opts.poster ? posterPath : ""
    });
}

function optimizeMp4(file, opts, index) {
    const basename = path.basename(file, path.extname(file));
    const safe = toSafeName(basename, `video-${index + 1}`);

    const inPath = file;
    const outMp4 = path.join(opts.out, `${safe}_optimized.mp4`);
    const outPoster = path.join(opts.out, `${safe}_optimized.${opts.posterExt}`);

    console.log(`\n[${basename}] MP4 최적화 시작`);

    if (!fs.existsSync(outMp4)) {
        const scaleExpr = getVideoFilter(opts);
        const audioOption = opts.audio ? "-c:a aac -b:a 128k" : "-an";

        run(
            `"${ffmpegPath}" -y -i "${inPath}" ` +
                `-vf "${scaleExpr},format=yuv420p" ` +
                `-c:v libx264 ` +
                `-crf ${opts.mp4Crf} ` +
                `-preset ${opts.preset} ` +
                `-movflags +faststart ` +
                `-pix_fmt yuv420p ` +
                `-profile:v main ` +
                `-level 4.0 ` +
                `-vsync 0 ` +
                `${audioOption} ` +
                `"${outMp4}"`
        );

        console.log(`✅ Optimized: ${basename} → ${safe}_optimized.mp4`);
    } else {
        console.log(`↪︎ 이미 존재: ${path.basename(outMp4)} — 스킵`);
    }

    createPosterFromInput({
        inputPath: inPath,
        outPoster,
        opts
    });

    const srcBase = opts.public ? `${opts.public}` : "";
    const posterPath = srcBase ? `${srcBase}/${safe}_optimized.${opts.posterExt}` : `${safe}_optimized.${opts.posterExt}`;

    createHtmlSnippet({
        opts,
        safe: `${safe}_optimized`,
        videoExt: "mp4",
        mimeType: "video/mp4",
        posterPath: opts.poster ? posterPath : ""
    });
}

function convertMp4ToWebm(file, opts, index) {
    const basename = path.basename(file, path.extname(file));
    const safe = toSafeName(basename, `video-${index + 1}`);

    const inPath = file;
    const outWebm = path.join(opts.out, `${safe}.webm`);
    const outPoster = path.join(opts.out, `${safe}.${opts.posterExt}`);

    console.log(`\n[${basename}] MP4 → WebM 변환 시작`);

    if (!fs.existsSync(outWebm)) {
        const scaleExpr = getVideoFilter(opts);
        const audioOption = opts.audio ? "-c:a libopus -b:a 96k" : "-an";

        run(`"${ffmpegPath}" -y -i "${inPath}" ` + `-vf "${scaleExpr}" ` + `-c:v libvpx-vp9 ` + `-crf ${opts.webmCrf} ` + `-b:v 0 ` + `${audioOption} ` + `"${outWebm}"`);

        console.log(`✅ Converted: ${basename} → ${safe}.webm`);
    } else {
        console.log(`↪︎ 이미 존재: ${path.basename(outWebm)} — 스킵`);
    }

    createPosterFromInput({
        inputPath: inPath,
        outPoster,
        opts
    });

    const srcBase = opts.public ? `${opts.public}` : "";
    const posterPath = srcBase ? `${srcBase}/${safe}.${opts.posterExt}` : `${safe}.${opts.posterExt}`;

    createHtmlSnippet({
        opts,
        safe,
        videoExt: "webm",
        mimeType: "video/webm",
        posterPath: opts.poster ? posterPath : ""
    });
}

function convertOne(file, opts, index) {
    if (opts.mode === "gif-to-mp4") {
        convertGifToMp4(file, opts, index);
        return;
    }

    if (opts.mode === "mp4-optimize") {
        optimizeMp4(file, opts, index);
        return;
    }

    if (opts.mode === "mp4-to-webm") {
        convertMp4ToWebm(file, opts, index);
        return;
    }

    console.error(`❌ 지원하지 않는 mode입니다: ${opts.mode}`);
    process.exit(1);
}

(function main() {
    const opts = parseArgs();

    console.log("▶︎ 옵션:", opts);

    ensureDir(opts.in);
    ensureDir(opts.out);

    verifyFfmpegOrExit();

    const targetExt = getInputExtByMode(opts.mode);

    const files = fs
        .readdirSync(opts.in)
        .filter((f) => f.toLowerCase().endsWith(targetExt))
        .map((f) => path.join(opts.in, f));

    if (files.length === 0) {
        console.log(`⚠️ ${targetExt} 파일을 찾지 못했습니다. 폴더 확인:`, opts.in);
        process.exit(0);
    }

    console.log(`📦 발견된 파일: ${files.length}개`);
    files.forEach((f, index) => convertOne(f, opts, index));

    console.log(`\n🎉 변환 완료. 출력 폴더: ${opts.out}`);
})();
