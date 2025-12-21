import fs from "fs";

// 1. 기본 콜백 - 비동기지만 콜백지옥 가능, try/catch 불가, 낮은 가독성
fs.readFile("./promisify/hello.txt", "utf-8", (err, result) => {
    // 파일 읽은 후 비동기적으로 실행됨.
    console.log(1, result);
});

// 콜백 지옥 예시
fs.readFile(file1, "utf-8", (err, data1) => {
    fs.readFile(file2, "utf-8", (err, data2) => {
        fs.readFile(file3, "utf-8", (err, data3) => {
            // ...
        });
    });
});

// 2. 비동기 방식 - 조금 깔끔해지지만 여전히 콜백 전달 필요 (await 제어 안됨)
// GetFileData로 fs.readFile()이라는 비동기 함수를 감싼 거라 비동기 도작을 그대로 유지함.
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

// 3. Promise 반환 - then/catch, async/await 가능. 가독성 향상 BUT 래퍼 작성 반복적
const getDataFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

getDataFromFile("./promisify/hello.txt")
    .then((data) => console.log(3, data))
    .catch((err) => console.error(err));

// 4. async/await - 동기처럼 작성 가능, 에러처리 쉬움
async function run() {
    try {
        const result = await getDataFromFile("./promisify/hello.txt");
        console.log(4, result);
    } catch (err) {
        console.error(err);
    }
}
run();

// 5. util.promisify() 사용 - 기존 콜백 API를 자동으로 Promise로 변환, 래퍼 안 써도 됨.
import util from "util";

const readFile = util.promisify(fs.readFile);
readFile("./promisify/hello.txt", "utf-8").then((result) => {
    console.log(4, result);
});
