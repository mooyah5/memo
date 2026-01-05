# GIF to MP4 Converter

Node.js 기반 GIF → MP4 변환 툴입니다.  
포스터 이미지 생성과 HTML `<video>` 스니펫 자동 생성까지 지원합니다.

### 실행

```
# 실행
npm run convert_gif

# 옵션과 함께 실행
npm run convert_gif -- --width 278

# 직접 실행
node gif-to-mp4.js --in ./assets/gifs_in --out ./assets/out --width 278
```

### 출력 결과

-   mp4 파일
-   포스터 이미지
-   html 스니펫

### options

| 옵션        | 기본값           | 설명                                   |
| ----------- | ---------------- | -------------------------------------- |
| --in        | ./assets/gifs_in | 입력 gif 폴더                          |
| --out       | ./assets/out     | 출력 폴더                              |
| --width     | 800              | 최대 가로 크기 (짝수 권장)             |
| --poster    | true             | 포스터 이미지 생성 여부                |
| --posterExt | jpg              | 포스터 확장자 (jpg / png)              |
| --crf       | 18               | 품질 (낮을수록 고화질 / 용량 상)       |
| --preset    | slow             | 인코딩 속도/압축율                     |
| --scaler    | lanczos          | 스케일링 알고리즘 (lanczos / neighbor) |
| --tune      | animation        | ffmpeg 튜닝 옵션                       |
| --public    | ""               | html에서 참조할 prefix 경로            |

### 추가 기능 아이디어

-   crop (--cropLeft, --cropTop, --cropWidth, --cropHeight)
-   aspect 비율
-   짝수 해상도 강제
-   벼환 실패 시 로깅

### 개발 정보

-   Node.js
-   ffmpeg
-   패키지 매니저: pnpm@10.21.0
-   의존성: @ffmpeg-installer/ffmpeg
