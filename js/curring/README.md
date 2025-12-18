## 커링 함수

여러 개의 인자를 받는 함수를
하나의 인자만 받는 함수로 나눠서
순차적으로 호출될 수 있게 
체인 형태로 구성한 것.

어떤 함수에서 선언한 변수를 참조하는 내부함수를 외부로 전달할 경우,
함수의 실컨이 종료된 후에도 해당 변수가 사라지지 않는 현상

내부 함수를 외부 전달하는 방법은 함수 return, 콜백 전달 등

그 본질이 메모리를 계속 차지하는 개념이므로, 안 사용하면 차지하지 않게 관리할 필요성 있음

```
var curry3 = function (func) {
    return function (a) {
        return function (b) {
            return func(a, b)
        }
    }
}

var getMaxWith10 = curry3(Math.max)(10)
// getMaxWith10 = (b) => Math.max(10, b)
console.log(GetMaxWith10(8))
// getMaxWith10 = Math.max(10, 8) = 10
console.log(GetMaxWith10(25))
// getMaxWith10 = Math.max(10, 32) = 25

var getMinWith10 = curry3(Math.min)(10)
// getMinWith10 = (b) => Math.min(10, b)
console.log(GetMinWith10(8))
// getMinWith10 = Math.min(10, 8) = 8
console.log(GetMinWith10(25))
// getMinWith10 = Math.min(10, 32) = 10

// 단점: 인자가 많아질수록 가독성이 떨어진다.
```

#### 커링 함수가 유용한 경우 (지연 실행)
당장 필요한 정보만 받아서 전달하고
또 필요한 정보가 들어오면 전달하는 식으로 하면
결국 마지막 인자가 넘어갈 때까지 함수 실행을 미루는 셈

원하는 시점까지 지연시켰다가 실행하는 게 요긴한 상황!

```
var getInfo = function (baseUrl) {
    return function (path) {
        return function (id) {
            return fetch(baseUrl + path + '/' + id) 
        }
    }
}
// ES6: 
// var getInfo = baseUrl => path => id => fetch(baseUrl + path + '/' + id)


var imageUrl = "http://imageAddress.com"
var productUrl = "http://productAddress.com"

// image 타입별 요청 함수 준비
var getImage = getInfo(imageUrl)
var getEmotion = getImage('emoticon')
bar getIcon = getImage('icon')

// 제품 타입별 요청 함수 준비
var getProduct = getInfo(productUrl)
var getFruit = getProduct("fruit")
var getVegetable = getProduct("vegetable")


// 실제 요청
var emoticon1 = getEmoticon(100)    // http://imageAddress.com/emoticon/100
var emoticon2 = getEmoticon(102)    // http://imageAddress.com/emoticon/102

var icon1 = getIcon(205)
var icon1 = getIcon(234)
// ...
```

이런 이유로 최근 여러 프레임워크/라이브러리 등에서 광범위하게 사용됨.

##### Flux 아키텍처의 구현체 중 하나인 Redux의 미들웨어 예시
```
// Redux Middleware 'Logger'
const logger = store => next => action => {
    console.log('dispatching', action)
    console.log('next state', store.getState())
    return next(action)
}

// Redux Middleware 'thunk'
const thunk = store => next => action => {
    return typeof action === 'function' ? action(dispatch, store.getState) : next(action)
}
```
- 위 두 미들웨어는 공통적으로 `store`, `next`, `action` 순서로 인자를 받음
    - store: 플젝 내에서 한 번 생성된 이후로는 바뀌지 않는 속성
    - next: dispatch의 의미를 가짐.
    - action: 매번 달라짐
store, enxt 값이 결정되면 리덕스 내부에서 logger, thunk에 store, next를 미리 넘겨서 반환된 함수를 저장시켜놓고, 이후에는 action만 받아서 처리할 수 있게끔 한 것.