# 커링 함수

**여러 인자를 받는 함수를
하나의 인자만 받는 함수로
나누어서,
순차적으로 호출될 수 있게
체인 형태로 구성한 것.**

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

```

-   장점: 재사용성, 모듈성, 유연성
-   단점: 인자가 많아질수록 가독성 떨어지고 성능 저하 (추가 함수 호출, 메모리 할당 발생)

---

### 활용 사례 1. 지연 실행

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

```
function multiply(a) {
	return function(b) {
		return a * b
	}
}

const double = multiply(2); // a = 2 상태를 기억하는 클로저

console.log(double(4));     // 2번째 인자를 전달해 함수를 지연 실행 => multiply(2)(4)
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

-   위 두 미들웨어는 공통적으로 `store`, `next`, `action` 순서로 인자를 받음 - store: 플젝 내에서 한 번 생성된 이후로는 바뀌지 않는 속성 - next: dispatch의 의미를 가짐. - action: 매번 달라짐
    store, enxt 값이 결정되면 리덕스 내부에서 logger, thunk에 store, next를 미리 넘겨서 반환된 함수를 저장시켜놓고, 이후에는 action만 받아서 처리할 수 있게끔 한 것.

---

### 활용 사례 2. 리액트 이벤트 핸들러 간소화

```
function MyComponent() {
	// 이벤트 핸들러를 커링 함수로 사용하면 가독성 좋아짐
	const handleItemClick = itemId => event => console.log(`Item ${itemId} clicked`, event);
}

return (
	<div>
		{['item1', 'item2', 'item3'].map(itemId => (
			<button key={itemId} onClick={handleItemClick(itemId)}>
				Click {itemId}
			</button>
		))}
	</div>
)
```

리액트 컴포넌트에서 이벤트 핸들러에 추가적인 매개변수를 전달할 때 유용
더 이상 `onClick={(e) => handleItemClick(itemId)}`처럼 선언하지 않아도 됨.

---

### 활용 사례 3. API 호출 처리

```
const createAPIEndpoint = base => endpoint => params => {
	const query = new URLSearchParams(params).toString();
	return `${base}/${endpoint}?${query}`
}

// 기본 api url
const baseAPI = createAPIEndpoint('https://example.com/api')

// 엔드포인트 확장
const fetchUser = baseAPI('user');
const fetchPosts = baseAPI('posts');

// using example
const userAPIPath = fetchUser({ id: '123' })
console.log(userAPIPath);   // "https://example.com/api/user?id=123"

const postsAPIPath = fetchPosts({ userId: '123', limit: 10 });
console.log(postsAPIPath);  // "https://example.com/api/posts?userId=123&limit=10"
```

---

### 활용 사례 4. 고차 컴포넌트 (HoC)

```
// 커링 함수를 이용한 HOC 선언
function withLoading(WrappedComponent) {
	return function ({ isLoading, ...rest }) {
		if (isLoading) {
			return <div>Loading...</div>;
		} else {
			return <WrappedComponent {...rest} />;
		|
	}
}

// 예시 컴포넌트 선언
function MyComponent({ data }) {
	return {
		<div>
			<h1>My Component</h1>
			<p>{data}</p>
		</div>
	}
}

// using example
const MyCOmponentWithLoading = withLoading(MyComponent);

function App() {
  // simulation
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  ...
  return (
	  <MyComponentWithLoading isLoading={loading} data={data} />
  );
}
```

---

### 활용 사례 5. 팩토리 패턴

```
import React from "react";

// 커링 함수 사용 컴포넌트 생성 함수
const createComponent = (component) => (properties) => {
	return <Component {...propertiees} />;
}

// 커링 함수 사용 특정 컴포넌트 생성 함수 만들기
const createButton = createCompoent("button");   // HTML button 요소
const createLabel = createComponent("label");    // HTML label 요소

// 개별 컴포넌트 생성
const BlueButton = () => createButton({ style: { color: "blue" }, children: "Click me" });
const BlueLabel = () => createLabel({ style: { fontSize: "large" }, children: "Label text" });

// using example
function App () {
	return (
		<div>
			<BlueButton/>
			<LargeLabel/>
		</div>
	)
}

export default App;
```

-   팩토리 패턴: 객체 지향 프로그래밍에서 객체 생성을 캡슐화하는 디자인 패턴

---

### 활용 사례 6. Reducer 간소화

```
/** 커링 함수로 구현한 상태 업데이트 함수
* filed: 업데이트할 상태 필드명
* newValue: 새로 설정할 값
* state: 현재 상태
**/

const updateField = field => newValue => state => ({
	...state,
	[filed]: newValue
});

function userReducer(state = {}, action) {
	switch (action.type) {
        // 커링 함수 사용 시
        case "UPDATE_USER_FIELD":
            return updateField(action.field)(action.value)(state);
        // 일반적 사용 시
        case "UPDATE_USER_FIELD":
            return {
                ...state,
                [action.field]: action.value
            }
        // 다른 액션 핸들링...
        default:
            return state
    }
}

// 이하 사용 방식 동일
const updateUserField = (field, value) => ({
    type: "UPDATE_USER_FIELD",
    field,
    value
})

dispatch(updateUserField(field, value))
```
