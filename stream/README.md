# Stream API

- chat GPT - 기다렸다가 한 번에 주는 게 아니라, 서버에서 데이터를 나눠서 완료된 것부터 준다.
- 사용자 입장에서 화면 렌더링을 부분적이나 계속 볼 수 있음
- 준비된 데이터를 조각 단위(chunk)로 먼저 보내고 나머지는 천천히 이어 보내기!

- 활용
    - React Server Components (chunked streaming) 점진적 렌더링

- 구현 방법
    - 스트림 형태임을 알리기: Transfet-Encoding: chunked (명시적임)
    - 청크 단위 데이터 젙송: response.write 함수로 전송 (이게 중요)

- 백엔드 예시
```
app.get("/stream", async (req, res) => {
    res.setHeader("Content-Type", "text/plain"; charset=utf-8);
    res.setHeader("Transfet-Encoding", "chunked");

    const lines = ["첫 줄입니다.\n", "두 번째 줄입니다.\n", "마지막 줄입니다.\n"];

    fot (const line of lines) {
        res.write(line);
        await new Promise(r => setTimeout(r, 1000));
    }

    res.end();
})
```

- 표준적임. 클라이언트 예시
```
const res = await fetch("/fetch");

// 1. 바이트 형태로 전송되므로, 문자열로 변환 (TextDecoderStream)
// 2. 데이터 스트림 수신 (res.body.pipeThrough())
// readableThrough라는 메서드는 readableStream을 반환하는데, 그건 반복문으로 돌려야 함. (비동기 스트림)

const textStream = res.body.pipeThrough(new TextDecoderStream());

// 3. stream에서 데이터 꺼내기 (for await of)
for await (const line of textStream) {
    console.log("받은 줄: ", line);
}
```