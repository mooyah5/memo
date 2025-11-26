# MicroTask Queue

### 1. 실행 순서를 나열하며 흐름 설명하기

```
console.log("A")

setTimeout(() => {
  console.log("B")
}, 0)

Promise.resolve().then(() => {
  console.log("C")
})

console.log("D")
```

1. A - 동기적으로 즉시 실행
2. D - 동기적으로 즉시 실행
3. C - 마이크로태스크 큐 - Promise의 `.then()`콜백. 콜스택이 비워지면 즉시 처리
4. B - 매크로태스트 큐 - `setTimeout` 콜백. 마이크로태스트가 모두 끝난 뒤 실행

### 2. 이벤트 루프의 흐름 구조

1. Call Stack (콜스택)

    - 동기 코드가 실행되는 곳.
    - 모든 동기 작업이 끝나야 비동기 큐를 처리함.

2. Web APIs (브라우저 환경)

    - `setTimeout`, `fetch`, `DOM event`, `XHR` 등이 여기서 기다림.
    - 완료되면 결과 콜백에 '큐'로 전달됨

3. Task Queue (Macrotask Queue)

    - `setTimeout`, `setInterval`, `I/O`, `UI Rendering` 등이 여기 들어감.

4. Microtask Queue

    - `Promise.then`, `queueMicrotask`, `MutationObserver`, `async/await` 등이 여기 들어감.
        - mutationObserver: DOM 변경을 감지하고 그 콜백을 마이크로태스크 큐에 등록한다.
    - 이벤트 루프는 Macrotask 하나 끝날 때마다 Microtask 큐를 전부 비우러 간다.

5. Event Loop

    - 콜스택 비었나?
    - 마이크로태스크 있나?
    - 없으면 다음 매크로태스크로 이동
    이걸 반복.

### 3. 실행 순서의 핵심

- 동기
    - 바로 실행
- 마이크로태스크
    - 현재 태스크가 끝난 직후, 가장 먼저 실행
    - `Promise.then`, `queueMicrotask`, `await`
- 매크로태스크
    - 마이크로태스크가 모두 끝난 후 실행
    - `setTimeout`, `setInterval`, `I/O`, `UI 이벤트`

### 4. 추가 지식

##### 1.  `process.nextTick` (Node.js 전용)

- Node.js에만 있음
- 마이크로태스크보다 우선순위 높음
- 즉 이벤트 루프가 다음 단계로 가기 전에 항상 먼저 처리됨

```
process.nextTick(() => console.log('nextTick'))
promise.resolve().then(() => console.log('promise'))
// 출력: nextTick -> promise
```

##### 2. `queueMicrotask`

- 명시적으로 마이크로태스크를 추가하는 API
- `Promise.then`과 같은 타이밍에 실행됨

```
queueMicrotask(() => console.log("microtask"))
```

##### 3. 렌더링 시점과의 관계 (브라우저)

- 브라우저는 렌더링(화면 갱신)도 '매크로태스크 사이'에서 수행함.
- 즉, 너무 많은 마이크로태스크를 한 번에 처리하면 **렌더링 지연** 발생
- 예) 무한 루프 형태의 `Promise.then()` 체인은 UI가 멈춘다.

##### 4. async/awiat 내부 동작

```
async function test() {
  console.log("1")
  await null
  console.log("2")
}
test()
console.log("3")

// test 함수 실행하면 아래와 같음.

function test() {
  console.log("1")
  return Promise.resolve(null).then(() => console.log("2"))
}
```

- 실행 결과: 1 > 3 > 2
- `await`는 내부적으로 Promise.then 처럼 동작하므로,
- 비동기 구간 이후의 코드는 마이크로태스크로 스케줄된다.
- async 함수는 호출 즉시 Promise를 반환한다.
    - console.log("1") => 동기. 바로 실행됨.
    - await null => 여기서 잠시 멈춘 것처럼 보이지만, 실제로는 `Promise.resolce(null).then(...)` 과 동일한 동작. `.then(...)`콜백인 `console.log("2")`은 마이크로태스크로 스케줄됨.

##### 5. Node.js vs 브라우저 차이

- setTimeout
    - 브라우저: 매크로
    - Node.js: 매크로
- Promise.then
    - 브라우저: 마이크로
    - Node.js: 마이크로
- process.nextTick
    - 브라우저: 없음
    - Node.js: 마이크로보다 먼저 실행
- 렌더링 타이밍
    - 브라우저: 매크로 사이 (한 매크로태스크 끝내고 다음 매크로태스크 넘어가기 전의 틈 - 마이크로태스크도 하고 브라우저 렌더링도 함.)
    - Node.js: 없음 (CLI 환경)

##### 6. one tick

- 이벤트 루프의 한 틱 (one tick)

    - = '한 번의 매크로태스크 실행 주기'
    - = 매크로태스크 한 번 + 그 직후의 매크로 처리까지를 묶은 싸이클
    - 매크로 1개 + 매크로 전부 + (렌더링)

- 자바스크립트의 `타이밍 제어`와 `비동기 동작의 미세한 차이`를 다룰 수 있음
- JS는 "한 스레드"다.

    - 싱글스레드라서 "언제" 실행되느냐가 "무엇"이 실행되느냐 만큼 중요함.

- 렌더링 타이밍 제어

```
button.textContent = 'Loading...'
doHeavyWork()
button.textContent = 'Done'
```
Loading이 화면에 안 뜨고 바로 Done으로 바뀜. 렌더링은 매크로 사이에만 발생하므로...
loading으로 렌더링해야겠다 하고 렌더 큐에 등록만 하고
바로 doHeavyWork부터 시작함(렌더링 불가능.. 다음 틱에서 해야지!)
doHeavyWork 끝나자마자 바로 Done으로 덮어씀. Loading은 렌더링큐엔 있었지만 덮어 써져버림.

```
button.textContent = 'Loading...' // 다음 틱에 렌더링해야징
await Promise.resolve() // 현재 함수가 잠시 멈추고, 다음 마이크로태스크(다음 틱)로 넘어감. (바로 loading으로 바뀜)
doHeavyWork()
button.textContent 'Done'
```
이렇게 하면 한 틱 끝난 뒤 렌더링이 일어나고, Loading이 먼저 표시됨.


- Vue의 `nextTick()`

```
// DOM 업데이트가 '다음 렌더링 전'에 일어나야 할 때 사용
this.count++
await nextTick()
console.log(document.querySelector("#count").textContent)
// => count가 갱신된 DOM을 안전하게 읽을 수 있음.
```

- Node.js의 `process.nextTick()

    - 현재 콜스택 비워지기 직전에 실행됨 (Promise보다 빠름)
    - 즉, 이번 틱 끝에 실행할 콜백 예약

- React의 batching

## 요약

- 동기 => 마이크로태스크 => 매크로태스크
