# 파일 업로드와 멀티파트

### 텍스트 데이터 vs 바이너리 파일
- 일반 데이터 => JSON 포맷으로 전송
- 이미지, PDF, 영상
    - 텍스트로 바꿀까? =>  Base64 인코딩
    - 문제: 용량 증가, 네트워크 성능 저하
    - 원형 그대로 전송할 수 있을까?


### content-type
- binary 파일 전송에 유용한 `multipart/form-data`
- File 전송과 함께 form 입력 필드도 함께 전송 가능.

[참고]
boundary라는 경계 문자열을 기준으로 구분한다.
그래서 multipart라고 부른다.

### multipart form submission
- `multipart/form-data` 인코딩은 form이 파일이나 많은 데이터를 포함할 때 사용된다.
- 이 요청 바디는 




### 이미지 업로더 구현

1. 파일 선택 시 이미지 파일 선택
2. `FormData.append("image", file)`로 서버 전송용 데이터 생성
3. Fetch API 업로드 (`fetch("/upload", { method: "POST", body: formData })`)
4. 에러처리 생략
5. 서버코드는 바이브로...

##### [참고] [Node js] __filename, __dirname, path.resolve, path.join
- path 모듈
    OS 별로 경로 구분자가 달라 생기는 문제를 쉽게 해결
    - window: C:\Users\... `\`로 구분
    - Posix(macOS, Linux): /Users/... `/`로 구분
```
const path = require("path");   // 내장 모듈이라 별도 설치 없이 불러올 수 있다.
console.log(__filename);    // 파일명 포함 절대 경로
console.log(__dirname);     // 파일명 제외 절대 경로

// Path.join
const paths = ['/foo', 'bar', 'baz/asdf', 'quux', '..'];    // Returns: '/foo/bar/baz/asdf' -> ..가 상위 폴더라 quux가 미포함
path.join('foo', {}, 'bar')l    // 타입에러. 항상 string이어야 함.

// Path.resolve: 오른쪽에서 왼쪽으로 경로 읽음. 상대/절대 경로 구분함.
path.resolve("/foo/bar", "./baz");      // '/foo/bar/baz' => ./폴더명으로 확실하게 구분해줘야 함.
path.resolve("/foo/bar", "/tmp/flie/"); // '/tmp/file' => 폴더명을 만나면 절대 경로로 인식하여 그 경로를 바로 반환
```