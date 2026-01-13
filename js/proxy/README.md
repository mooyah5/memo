# proxy

`Proxy` 객체를 쓰면, 한 객체에 대한 기본 작업을 가로채고 재정의하는 프록시를 만들 수 있다.
Object 대신 사용 가능한 객체를 만들고,
이 객체의 속성 가져오기, 설정, 정의 같은 기본 객체 작업을 재정의할 수 있다.

일반적으로 속성 액세스 기록, 입력 유효성 검사, 형식 지정, 삭제에 사용된다.

### proxy 생성

2개의 매개면수 사용

-   target: 프록시할 원본 객체
-   handler: 가로채는 작업, 가로채는 작업을 재정의하는 방법을 정의

```
const target = {
    msg1: 'asdf',
    msg2: 'qwer'
}

const handler1 = {}

const proxy1 = new Proxy(target, handler1)
console.log(proxy1.msg1)    // asdf
console.log(proxy1.msg2)    // qwer
```

-   핸들러가 비어있어, 프록시가 원래 대상처럼 작동함.

```
const target = {
    msg1: 'asdf',
    msg2: 'qwer'
}

const handler2 = {
    get(target, prop, receiver) {
        return '!!!'
    }
}
const proxy2 = new Proxy(target, handler2)
console.log(proxy2.msg1)    // !!!
console.log(proxy2.msg2)    // !!!
```

대표 트랩들

-   get(target, prop, receiver) : 속성 읽기 가로채기
-   set(target, prop, value, receiver) : 속성 쓰기 가로채기
-   has(target, prop) : prop in obj
-   deleteProperty(target, prop) : delete obj[prop]
-   apply(target, thisArg, args) : 함수 호출 가로채기(타겟이 함수일 때)
-   construct(target, args, newTarget) : new로 생성 가로채기(타겟이 생성자일 때)

```
const target = {
    msg1: 'asdf',
    msg2: 'qwer'
}

const handler3 = {
    get(target, prop, receiver) {
        if (prop === 'msg2') return '!!!'
        console.log(target, prop, receiver)
        return Reflect.get(...arguments)
    }
}
const proxy3 = new Proxy(target, handler3)
console.log(proxy3.msg1)
console.log(proxy3.msg2)
```

```
const target = {
    msg1: 'asdf',
    msg2: 'qwer'
}

const handler4 = {
    get(target, prop, receiver) {
        get(target, prop) {
            console.log(target)
        }
    }
}
const proxy3 = new Proxy(target, handler4)
console.log(target.msg1)
console.log(proxy3.msg1)
```
