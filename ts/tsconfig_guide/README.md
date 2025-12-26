# typescript 초보자를 위한 tsconfig.json 가이드

-   초기화를 위해 global install을 먼저 한다.
-   개발 단계에서만 사용하고, 컴파일 시에는 js로 변환되므로 devDependencies에 install하면 된다.

### install

`npm i -D typescript ts-node`

-   typescript: 타입스크립트 컴파일러
    ts 파일을 js로 컴파일하려면 터미널에 `tsc 파일명` 임력하면 변환된다.
    그러나 매번 코드를 수정, 삭제, 입력하긴 번거롭다.
    따라서 `tscongif.json`을 생성하여 저장 시마다 자동 컴파일되도록 설정한다.

-   ts-node: js 코드로 변환하고 실행까지 동시에 하는 프로그램

`npm i -D @types/node`

-   @types/node: js로 개발된 라이브러리 또는 ts에는 없지만 웹 브라우저나 node.js가 기본으로 제공하는 타입(Promise 등)들을 ts로 사용할 수 있게 해주는 패키지

### 타입스크립트 기본 설정 tsconfig.json 생성

`tsc --init`
