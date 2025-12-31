# JavaScript에서 배열은 객체다.

https://pozafly.github.io/javascript/array-is-object/#%EC%9C%A0%EC%82%AC-%EB%B0%B0%EC%97%B4-%EA%B0%9D%EC%B2%B4%EC%99%80-%EB%B0%B0%EC%97%B4%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90

### 요약

-   js 배열은 `인덱스를 키로` 갖고 있고, `length 프로퍼티를 갖는` 특수한 객체다.
-   배열의 prototype은 객체를 가리키고 있고, 객체 기반으로 만들어졌다.
-   `유사 배열 객체`는 배열 구조와 비슷하게 생긴 객체로, 프로퍼티로 index, length를 가진다.
-   `배열과 유사배열객체의 차이`는 `length 프로퍼티의 열거 가능 여부`와 `Array 내장 메서드 사용 가능 여부`다.

### JS의 배열

js의 배열은 `리스트같은 객체(list-like objects)`로 기술된다. (mdn)
배열은 리스트에 저장된 다수 값들을 포함하고 있는 하나의 객체다.

자료구조에서의 배열은, 동일 크기 메모리 공간이 빈틈없이 연속 나열된 구조다.
즉, 배열 속 요소는 동일 데이터 타입이고, 그래서 동일 크기 메모리 공간을 차지한다.
순서가 있고 순서 따라 값을 가져올 수 있도록 서로 연속적으로 메모리에 인접해있다.

따라서 인덱스를 통해 1회 연산으로 요소에 접근할 수 있다.
그러나 정렬되지 않았다면, 아래와 같이 발견까지 차례대로 검색해야 한다.

```
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
        return -1;
    }
}
```

js 배열은 위의 `자료구조에서 말하는 배열과는 다르다.`
배열 요소를 위한 각 메모리 공간은

-   동일 크기를 갖지 않아도 되며,
-   배열 타입이 달라도 되고,
-   연속적으로 이어져 있지 않을 수도 있다.

```
const arr = ['a', 'b', 'c', 'd']
console.log(arr[1])         // b
console.log(arr.length)     // 4
console.log(typeof arr)     // object
```

위 배열을 `객체 리터럴`로 표현하면 아래와 같다.

```
const obj = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    '3': 'd',
    'length': 4
}
console.log(arr[1])         // b
console.log(arr.length)     // 4
console.log(typeof arr)     // object
```

`console.log`에 평가되는 값은 arr, obj 모두 동일하다.
두 객체의 차이

-   배열 리터럴 `arr`의 프로토타입 객체는 `Array.prototype`
-   객체 리터럴 `obj`의 프로토타입 객체는 `Object.prototype`

```
const emptyArr = [];
const emptyObj = {};
console.dir(emptyArr.__proto__)
console.dir(emptyObj.__proto__)
```

따라서, 배열은 인덱스를 키로 갖고 있고, length 프로퍼티를 갖는 특수한 객체이다.
js는 일반적 배열 동작을 흉내낸 특수 객체다.

### 일반 배열과 js 배열의 장단점 (비교적)

-   일반 배열
    -   요소 접근 빠름
    -   요소 삽입/삭제 비효율
-   js 배열 (hash table로 구현된 객체)
    -   요소 접근 느림
    -   특정 요소 겁색/삽입/삭제 빠름

하지만, 인덱스 접근 시 느린 구조 개선을 위해
모던 js엔진은 일반 객체와 구별하여 좀 더 배열처럼 동작하도록 최적화 구현되었다.

```
const arr = []
console.tile("Arr Perform Test")

for (let i = 0; i < 10000000; i++) {
    arr[i] = i
}
console.timeEnd("Arr Perform Test")
// 약 340ms

const obj = {}
console.tile("Obj Perform Test")
for (let i = 0; i < 10000000; i++) {
    obj[i] = i
}
console.timeEnd("Obj Perform Test")
// 약 600ms
```

### 유사 배열 객체와 배열의 차이점

-   유사 배열(array-like)
    인덱스, length 프로퍼티가 있어서 배열처럼 보이는 객체

js에서 Array는 Object의 프로토타입을 상속받아 구현되었다.
그렇다면 Object의 `Object.getOwnPropertyDescriptors()`를 통해 프로퍼티 디스크립터를 알아보자.

```
console.log(Object.getOwnPropertyDescriptors([]))
console.log(Object.getOwnPropertyDescriptors({}))

// {
//   '0': { value: 'a', writable: true, enumerable: true, configurable: true },
//   '1': { value: 'b', writable: true, enumerable: true, configurable: true },
//   '2': { value: 'c', writable: true, enumerable: true, configurable: true },
//   '3': { value: 'd', writable: true, enumerable: true, configurable: true },
//   length: { value: 4, writable: true, enumerable: false, configurable: false }
// }
// {
//   '0': { value: 'a', writable: true, enumerable: true, configurable: true },
//   '1': { value: 'b', writable: true, enumerable: true, configurable: true },
//   '2': { value: 'c', writable: true, enumerable: true, configurable: true },
//   '3': { value: 'd', writable: true, enumerable: true, configurable: true },
//   length: { value: 4, writable: true, enumerable: true, configurable: true }
// }
```

`차이점은 length에 있다.`
arr는 [[enumerable]], [[/configurable]]이 false이고, obj는 true다.

즉, 배열 리터럴로 만든 객체 length는 새 값을 넣을 수는 있지만, 반복문에서 빠지며 프로퍼티 어트리뷰트를 수정/삭제할 수 없다.

```
const arr = ['a', 'b', 'c'];
const obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
for (let key in arr) {
  console.log(key); // a b c
}
for (let key in obj) {
  console.log(key); // a b c length
}
```

-   `for in`은 객체의 모든 열거 가능 속성에 대한 반복이다.

---

배열과 유사배열을 구분해야 하는 이유는, 유사 배열의 경우, 배열의 메서드를 사용할 수 없기 때문이다.

```
obj.forEach(v => console.log(v))    // obj.forEach is not a function
```

이럴 때는 배열 프로토타입에서 배열 메서드를 빌려서 사용할 수 있다. (call, apply, bind)

```
Array.prototype.forEach.call(obj, v => console.log(v))
```

또, `Array.from()` 메서드로 유사배열객체를 얕게 복사해 새 겍체로 만드는 방법이 있다.
