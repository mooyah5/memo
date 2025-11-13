# fetch

## 요청

#### 첫 파라미터: method

#### 두 번째 파라미터: headers
- Content-Type: 데이터 형식 (application/json)
- Authorization: 토큰 정보 전달 ('Bearer ...')
- X-Custom-Header: 사용자 내부 규약용 (여러 이름 가능)

#### body
- GET/DELETE는 불필요
- JSON.stringify(data)를 주로 사용
- JSON, FormData, Blob 등 사용 가능

#### signal - 요청 중단
- 이미 보내 요청 취소 가능
```
const controller = new AbortController()
fetch(url, { signal: controller.signal })
controller.abort()  // 요청 중단
```


## 응답

#### response 객체
- response.status
- response.ok: 2xx 에서만 true (비정상 status 판단할 때 꿀) 
- response.headers: 응답 헤더들
- response.body: 본문 (r=ReadableStream 형태)
    - response.json()
        - 응답 본문(body)는 바로 읽을 수 있는 텍스트가 아님
        - 조각조각(stream)으로 들어오는 데이터
            => 이 데이터를 끝까지 읽어 모아서 json 파싱해주는 도구 필요 = `response.json()`
        - 이후에, js에서 다룰 수 있도록 객체 형태로 변환됨.
        - `res.json()` 결과도 Promise 객체를 반환함.
            따라서, then 또는 async 함수의 await로 받아 처리해야 함.


## 포켓몬 데이터 가져오기
- 포켓몬 데이터의 이름, 능력치를 출력하세요.

```
[참고]
- url: https://pokeapi.co/api/v2/pokemon/pikachu
- 이름: name
- 능력치: stats
- response.ok가 false면 즉시 에러 출력하고 return;
- 응답 헤더에 content-type을 콘솔에 출력.