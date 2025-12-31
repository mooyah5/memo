# JS의 Symbol

https://pozafly.github.io/javascript/symbol/

고유하고 중복되지 않는 식별자를 만드는 데이터 타입.
같은 문자열로 만들더라도 서로 다른 값이고, 객체 키로 쓰면 다른 키와 절대 충돌하지 않는다.
그래서 클래스 믹스인이나 라이브러리 확장처럼 같은 객체를 여러 곳에서 건드려야 할 때, 안전하게 속성 추가하기 좋다.

### 요약

-   primitive type(기본형)으로, ES6에 추가됨
-   변경 불가능 원시 값으로, 고유 ID 역할 수행
-   객체의 속성 key로 사용됨
-   상수 개념으로 사용 가능하여, [class 믹스인](../class&mixin/) 등 동일 객체 속 key를 중복되지 않게 할 수 있다.
-   객체의 `private`한 변수/메서드로 사용할 수 있다.
-   라이브러리 등 `meta-level`한 `property`로 사용 가능
-   Symbol 레지스트리가 있어, 영역 간 고유한 심볼 사용 가능
-   `react`에서는 심볼이 `JSON에 담기지 않는 특성`을 이용해 `xss 공격 방어`

## 1. new primitive type

symbol은 **변경 불가능한 원시 값**이다.
고유 ID 역할을 하는 토큰

-   생성

    ```
    const symbol1 = Symbol();
    ```

-   description(설명)
    `Symbol()` 코드에는 `description(설명)`을 넣어줄 수 있다.
    description은 문자열이 들어가는데, Symbol 생성에 영향을 주지 않으며, `디버깅 용도`로만 사용된다.

    ```
    const symbol2 = Symbol("symbol2");
    console.log(String(symbol2));       // Symbol(symbol2)
    ```

-   고유성
    심볼은 고유하며 모든 심볼에는 `고유 ID`가 있어,
    생성할 때 description가 같아도 서로 다르게 평가한다.
    ```
    const a = Symbol('symbol')
    const b = Symbol('symbol')
    console.log(a===b, a==b)    // false false
    ```

### 1) 속성 key로서의 심볼

심볼을 객체 속성의 key로 사용할 수 있다.

```
const MY_KEY = Symbol()
let obj = {}

obj[MY_KEY] = 123
console.log(obj[MY_KEY])
```

위와 같이 클래스와 객체 리터럴에는 `Computed Property`를 사용할 수 있다.
이는 key 값을 표현식(변수, 함수)으로 지정하는 문법이다.

```
const FOO = Symbol()
let obj = {
    [FOO]() {
        return 'bar'
    }
}
console.log(obj[FOO]())     // bar
```

### 2) 심볼과 열거(enumerable)

-   프로퍼티 키는 String 또는 Symbol만 될 수 있다.
-   프로퍼티 이름은 String이다.

하지만 Symbol은 열거 가능할까?

```
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3,
};
Object.defineProperty(obj, 'nonEnum', { enumerable: false });
```
