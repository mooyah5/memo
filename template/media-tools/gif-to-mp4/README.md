# Media Converter

Node.js 기반 미디어 변환 툴입니다.

GIF → MP4 변환, MP4 최적화, MP4 → WebM 변환을 지원하며,  
포스터 이미지 생성과 HTML `<video>` 스니펫 자동 생성까지 지원합니다.

## 지원 기능

- GIF → MP4 변환
- MP4 최적화
- MP4 → WebM 변환
- 포스터 이미지 자동 생성
- HTML `<video>` 스니펫 자동 생성
- 최대 가로 크기 기준 리사이징
- 업스케일 방지
- ffmpeg 자동 경로 탐색

## 실행

### GIF → MP4 변환

```bash
npm run convert_gif

# 옵션과 함께 실행
npm run convert_gif -- --width 278

# 직접 실행
node convert-media.js --mode gif-to-mp4 --in ./assets/gifs_in --out ./assets/out --width 278
```

### MP4 최적화

```
npm run optimize_mp4

# 직접 실행
node convert-media.js --mode mp4-optimize --in ./assets/mp4_in --out ./assets/out
```

### Mp4 -> WebM 변환

```
npm run convert_webm

# 직접 실행
node convert-media.js --mode mp4-to-webm --in ./assets/mp4_in --out ./assets/out
```

## 입력 폴더

기본 npm script 기준 입력 폴더

- GIF -> MP4
    - `./assets/gifs_in`
- MP4 최적화
    - `./assets/mp4_in`
- MP4 -> WebM
    - `./assets/mp4_in`

## 출력 결과

출력 폴더 기본값은 `./assets/out` 입니다.
생성되는 파일은 mode에 따라 다릅니다.

- GIF -> Mp4
    - {파일명}.mp4
    - {파일명}.jpg
    - video-snippets.html
- MP4 최적화
    - {파일명}\_optimized.mp4
    - {파일명}\_optimized.jpg
    - video-snippets.html

- MP4 → WebM
    - {파일명}.webm
    - {파일명}.jpg
    - video-snippets.html

## options

| 옵션        | 기본값           | 설명                                                            |
| ----------- | ---------------- | --------------------------------------------------------------- |
| --mode      | gif-to-mp4       | 변환 모드. `gif-to-mp4`, `mp4-optimize`, `mp4-to-webm`          |
| --in        | ./assets/gifs_in | 입력 gif 폴더                                                   |
| --out       | ./assets/out     | 출력 폴더                                                       |
| --width     | 800              | 최대 가로 크기 (원본이 더 작으면 업스케일하지 않음. 짝수 권장.) |
| --poster    | true             | 포스터 이미지 생성 여부                                         |
| --posterExt | jpg              | 포스터 확장자 (jpg, png 등)                                     |
| --crf       | 18               | GIF -> Mp4 변환 품질 (낮을수록 고화질/고용량)                   |
| --mp4Crt    | 28               | MP4 최적화 품질. (낮을수록 고화질/고용량)                       |
| --webmCrt   | 32               | WEbM 변환 품질. (낮을수록 고화질/고용량)                        |
| --preset    | slow             | 인코딩 속도/압축율 옵션                                         |
| --scaler    | lanczos          | 스케일링 알고리즘 (예: lanczos, neighbor)                       |
| --tune      | false            | GIF → MP4 변환 시 ffmpeg 튜닝 옵션                              |
| --audio     | animation        | MP4/WebM 변환 시 오디오 포함 여부                               |
| --public    | ""               | HTML 스니펫에서 참조할 public 경로 prefix                       |

## 사용 예시

### GIF를 278px 너비 기준으로 mp4 변환

```
npm run convert_gif -- --width 278
```

### 포스터 이미지 없이 변환

```
npm run convert_gif -- --poster false
```

### public 경로 포함 HTML 스니펫 생성

```
npm run convert_gif -- --public /assets/videos

# 생성 예시
<video autoplay muted playsinline loop poster="/assets/videos/sample.jpg" width="800">
    <source src="/assets/videos/sample.mp4" type="video/mp4">
</video>
```

### MP4 최적화 시 오디오 유지

```
npm run optimize_mp4 -- --audio true
```

### WebM 변환 시 품질 조정

```
npm run convert_webm -- --webmCrf 28
```

### npm scripts

```
{
    "convert_gif": "node convert-media.js --in ./assets/gifs_in --out ./assets/out",
    "optimize_mp4": "node convert-media.js --mode mp4-optimize --in ./assets/mp4_in --out ./assets/out",
    "convert_webm": "node convert-media.js --mode mp4-to-webm --in ./assets/mp4_in --out ./assets/out"
}
```

## 추가 기능 아이디어

- crop 옵션 추가
    - 예: --cropLeft, --cropTop, --cropWidth, --cropHeight
- aspect ratio 고정 옵션
- 짝수 해상도 강제 옵션
- 변환 실패 시 로그 파일 저장
- 기존 출력 파일 덮어쓰기 옵션
- 여러 format 동시 출력 옵션
    - 예: MP4 + WebM 동시 생성

## 개발 정보

- Node.js
- ffmpeg
- 패키지 매니저: pnpm@10.21.0
- 의존성: @ffmpeg-installer/ffmpeg
