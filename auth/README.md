1. 세션 방식

### 쿠키에 있는 인증정보 전송 (세션id, token)
- credentials 옵션 (쿠키 전송 여부)
    - same-origin: 같은 origin일 때만 포함 (default). 
    - omit: 미포함
    - include: 다른 도메인에서도 포함.
```
fetch("/api/data", {
    credentials: "same-origin"
});
```

### 크로스도메인 인증정보 전송
- 쿠키 발급 설정 시 sameSite: none, secure: true 설정 필요
- fetch 요청 시 credentials: include 설정하면 타 도메인에서도 쿠키 포함되어 전송.
- CORS 설정 (하기 작업을 내부적으로 설정해준 것)
    - Access-Control-Allow-Origin: https://my-domain.com
    - Access-Control-Allow-Credentials: true
    - Access-Control-Allow-Methods: GET, POST, ...
    - Access-Control-Allow-Headers: Authorization

