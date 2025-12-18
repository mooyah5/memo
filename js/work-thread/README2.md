js 싱글 스레드
다행히 이벤트, 네트워크 통신 등은 비동기로 활용 가능했삼
근데 CPU 작업에서 느리면 (대규모 데이터 처리, 이미지 필터링, 복잡한 수학 계싼) => 그다음 작업이 계속 대기상태 (느린 UI 렌더링, 이벤트 처리 지연, 페이지 멈춤까지)

별도 스레드가 있다면? 브라우저에도 그런 너낌으로 동작되는 도우미가 있다. (Web Worker 직원)

메인스레드가 바쁘니까 니가 하고 끝나면 알려줘 할 수 있음

스레드 기반의 협력적 통신이 가능하고,
백그라운드에서 웹워커가 동작하면서 병렬로 처리할 수 있게 됨.


`메시지 기반`으로 협력적 통신함
main thread => postMessage(Data) => Web Worker
Web worker => onmessage(data) => main thread

```
// main.js (메인 스레드)

const worker = new Worker("worker.js");

worker.onmessage = (e) => {
    console.log(`결과는 ${e.data}`)
}
worker.postMessage(40);

console.log("UI는 여전히 반응 가능")
```

```
// worker.js (웹 워커)

self.onmessage = (e) => {
    const num = d.data;
    const res = fibonacci(num);
    postMessage(res)    // main thread에 결과 전송
}
function fibonacci(n) {
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n-2);
}
```

### 실습: 이미지 처리 속도 체감해보기
- AI 활용
- 여러 이미지 필터링
    - 이미지 분석해서 노이즈 제거, 샤프닝 효과 (엣지 강조 효과)
- 처리된 결과 동안 input box 입력이 가능한지 테스트
- maint thread vs worker thread 비교 (각각에서의 사용성을 체감)

### 활용
- 실시간 비디오 인코딩/캔버스 렌더링
- TensorFlow.js 등 모델 추론
- 실시간 게임 서버 로직 (물리적 연산)

- 암호화/해시처리 등
- Shared Worker로 웹소켓 연결 유지