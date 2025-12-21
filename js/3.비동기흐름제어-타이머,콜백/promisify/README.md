# Node.js `fs.readFile` 비동기 처리 방식 정리

## 1. 기본 콜백

```js
fs.readFile("./promisify/hello.txt", "utf-8", (err, result) => {
    console.log(1, result);
});
```

-   특징: Node.js 전통적 비동기 패턴
-   단점:
    -   콜백 지옥 발생 가능
    -   try/catch로 에러 처리 불가 (에러는 첫 인자로 전달).
    -   가독성 낮음

콜백 지옥 예시

```
fs.readFile(file1, "utf-8", (err, data1) => {
    fs.readFile(file2, "utf-8", (err, data2) => {
        fs.readFile(file3, "utf-8", (err, data3) => {
            // ...
        });
    });
});
```

## 2. 콜백 래퍼

```
const getFileData = (filePath, callback) => {
    fs.readFile(filePath, "utf-8", (err, result) => {
        if (result === undefined) callback(err, null);
        else callback(null, result);
    });
};

getFileData("./promisify/hello.txt", (err, result) => {
    if (err) console.log(err);
    else console.log(2, result);
});
```

-   의도: 콜백 단순화
-   단점: 여전히 콜백 전달 필요, await 불가

## 3. Promise 반환

```
const getDataFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

getDataFromFile("./promisify/hello.txt")
    .then(data => console.log(3, data))
    .catch(err => console.error(err));
```

-   장점: then/catch, async/await 가능, 가독성 향상
-   단점: 매번 래퍼 작성

## 4. async/await

```
async function run() {
    try {
        const result = await getDataFromFile("./promisify/hello.txt");
        console.log(4, result);
    } catch (err) {
        console.error(err);
    }
}
run();
```

-   장점: 동기처럼 작성 가능, try/catch로 에러 처리

## 5. util/promisify()

```
import util from "util";
const readFile = util.promisify(fs.readFile);

readFile("./promisify/hello.txt", "utf-8")
    .then(result => console.log(5, result))
    .catch(err => console.error(err));
```

-   장점
    -   기존 콜백 API를 자동으로 Promise로 변환.
    -   래퍼 작성 불필요
    -   async/await 바로 사용 가능
