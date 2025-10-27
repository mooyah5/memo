# async_js

### 비동기 프로그래밍

- main thread - non block
- Web API - 비동기

### 03. 이벤트루프와 콜백큐

- call stack - 함수 실행 시 사용하는 순서 스택
- web apis 모듈에서 콜백함수 관리
  - callback queue에 쌓음
- event loop
  - 콜백 queue에서 하나씩 가져와서 call stack에 올려주는 역할 (콜스택이 비어져있는지?)
  - 안 쉰다.
    - 콜스택이 바쁘면 대기 상태에 빠짐
  - JS 엔진에 있지 않음 (런타임 환경에서 제공 - 브라우저/노드)
    ''
