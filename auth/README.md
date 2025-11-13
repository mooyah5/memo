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

