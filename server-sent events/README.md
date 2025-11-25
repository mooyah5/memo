# Server-sent events

전통적으로 웹은 새 데이터를 받으려면 서버로 요청을 보내야 한다.
하지만 server-sent events 방식으로 **웹 요청 없이도 언제든 서버가 새 데이터 보내는 게 가능**하다.
이렇게 보내진 메시지는 웹 안에서 **Events + 데이터**로 다룰 수 있다.

- 웹페이지 요청 없이 언제든지 서버가 데이터를 보내주는 이벤트 => 주식 등
- **초기에만 한 번 요청**을 보내면 (Initial Request) 언제든 Event Response들을 받을 수 있음.
- **Stream 기술**을 사용한 단방향 실시간 메시징 기술.


- 조건 (포맷)
    - `text/event-stream` 타입 사용
    - 전송 시 `data: 메시지` 형태 유지
```
date_default_timezone_set("America/New_York");
header("X-Accel-Buffering: no");
header("Content-Type: text/event-stream");  // event-stream이라는 컨텐츠 타입 사용해야 인식함.
header("Cache-Control: no-cache");

$counter = rand(1, 10);
while (true) {
    // Every second, send a "ping" event.

    echo "event: ping\n";
    $curDate = date(DATE_ISO8601);
    echo 'data: {"time": "' . $curDate . '"}';  // 데이터: 메시지 형태 지키기
    echo "\n\n";    // 역슬래시 두번 넣어야 함
}
```

#### SSE 방식의 ChatGPT 응답 데이터
- Content-Type: text/event-stream;charset=utf8

#### client parsing
```
const res = await fetch("/sse");
const reader = res.body.getReader();    // ReadableStream에서 바이트 청크를 순차적으로 읽어오기 위한 객체
const decoder = new TextDecoder();      // 바이트 배열(Unit8Array)을 문자열로 변환하는 객체

// 아래는 for await of 로도 구현 가능
while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(decoder.decode(value, { stream: true }));
}
```

#### GET 요청인 경우 보다 간단히 EventSource로
- GET 요청의 경우, 클라이언트 측에서는 사용이 간단해짐.
- EventSource 객체로 쉽게 메시지를 수신
```
const eventSource = new EventSource("/sse-front");

eventSource.onmessage = (event) => {
    console.log("수신 메시지: ", event.data);
};

eventSource.onerror = (error) => {
    console.error("연결 오류");
};
```

#### 실습
- AI 활용 구현
    - 바이브 코딩 (no-code, prompt로만)
- 기능 요구사항 참고하여 기능 완성
- 기술 요구사항 만들어서 요청하기
    - 클라이언트/서버구성
    - 프론트 (리액트, 스타일 설정)
    - 백엔드 (express 기반 설정)
        - DB 생략 => 하드코딩된 데이터로 응답
    - 기타 코딩스타일 규칙

##### 기능 요구사항
- chatgpt와 같은 대화창을 통해 입력할 수 있고, 결과를 화면에 표시.
- UI 구성은 chatGPT 화면과 유사하게 구성하면 Desktop용 UI로 구성
- 임의 문장 입력해서 fetch 요청 보내면 서버는 응답 결과를 주는 방식
- 응답 내용은 매번 똑같은 내용이 오고 이 데이터는 서버에서 보관.
- 서버는 요청을 받으면 stream 방식으로 응답하고, 이를 받아서 계속 렌더링한다.
- Stream 방식으로 응답해야하므로, 하나의 청크는 하나의 문장단위로 생성.
- 한 번의 요청에 총 10줄 정도의 문장을 출력해야 함.

##### 기술 요구사항
- 서버
    - express 활용 서버 구성
    - 응답 시 Content-Type: text/event-stream으로 스트림 응답
    - 응답은 1초 간격으로 settimeout을 활용해서 stream 방식으로 응답
    - 응답 데이터는 DB 없이 서버에서 고정 문자열을 객체/배열 형태 데이터로 보관
    - 최상위 디렉토리 아래 /server, /client를 구분해 만들고 그 하위에 개발코드 생성
- 클라이언트
    - vite 기반 바닐라 프로젝트로 구성