# 프로토타입

js는 프로토타입 기반 언어다.
객체를 원형(프로토타입)으로 삼고, 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻는다.

```
[Constructor] . [prototype]
      |             /
      |           /
      |         /
      |       /
      |     /
      |   /
      | /
  [instance] . [(--proto__)]
```

-   `__proto__`
    생략 가능한 프로퍼티 (그냥 ..그런가 보다)
    ```
    var Person = function (name) {
        this._name = name
    }
    Person.prototype.getName = function () {
        return this._name
    }
    var suzi = new Person("Suzi")
    suzi.__proto__.getName()    // undefined. (this를 __proto__기준으로 삼아서 _name 못 찾음)
    suzi.getName()  // Suzi     (생략가능한 __proto__를 생략하고 suzi라는 인스턴스에서 직접 찾음)
    ```

"new 연산자로 Constructor를 호출하면 instance가 만들어지고,
생략 가능한 프로퍼티인 instance의 **proto\_는 Constructor의 prototype을 참조~!!"
(js는 함수에 자동으로 객체인 prototype 프로퍼티를 생성해 놓음. new와 함께 생성자로서 사용 시 **proto\_\_가 참조)

함수의 prototype에 어떤 메서드/프로퍼티가 있다면,
인스턴스에서도 마치 자기 것처럼 해당 메서드/프로퍼티에 접근할 수 있게 됨

### constructor 프로퍼티

원래의 생성자 함수(자기자신)을 참조한다.
읽기 전용 속성이 부여된 예외적 경우(기본형 리터럴 변수 - number, string, boolean)를 제외하고는 **값을 바꿀 수 있다**.

```
var arr = [1, 2];       // var arr = new Array(1, 2)
Array.prototype.constructor === Array   // true
arr.__proto__.constructor === Array     // true
arr.constructor === Array               // true

var arr2 = new arr.constructor(3, 4)
console.log(arr2)       // [3, 4]
```

### 프로토타입 체인

-   프로토타입 체인: **proto** 프로퍼티가 연쇄적으로 이어진 것
-   프로토타입 체이닝: 이 체인을 따라가며 검색하는 것 == 메서드 오버라이딩
    어떤 메서드를 호출하면 js엔진이 자기 프로퍼티들을 검색해서 원하는 메서드가 있으면 그 메서드를 실행하고, 없으면 **proto**를 검색해서 있으면 그걸 실행하고, 없으면 다시 또 **proto**를 검색...

### 객체 전용 메서드의 예외사항

어떤 생성자 함수이든 prototype은 반드시 객체다.
그래서 Object.prototype이 언제나 체인 최상단에 존재하게 된다.
따라서, 객체만을 대상으로 동작하는 객체 전용 메서드는 부득이하게 Object.prototype이 아닌 Object에 스태틱 메서드로 부여할 수밖에 없다.

-   객체 한정 메서드들을 Object에 직접 부여할 수밖에 없는 이유
    -   Object.prototype이 여타 참조형데이터뿐 아니라 기본형 데이터도 **proto** 반복 접근으로 도달할 수 있는 존재이기 때문.
    -   따라서 Object.prototype에는 어떤 데이터에서도 활용 가능한 범용적 메서드들만 있다. (toString, hasOwnProperty, valueOf, isPrototypeOf)

`new Object()` 나 `{}`로 만든 객체는

-   연결 됨 (Object.prototype)
-   연결 안됨 (Object 생성자 함수 자체)

Object.entries(obj) // 있음 (객체 전용)
Object.prototype.entries // 없음

`{}.entries()`가 this 기반 메서드로 만들어지면,
객체 아닌 타입도 prototype 체이닝으로 접근 가능하여 버그 발생 가능
따라서,

-   [x] : Object.prototype.entries = function () {...}
-   [O] : Object.entries(obj)

### Object.create(null)

`__proto__`가 없는 객체를 생성함.
(프로토타입 체인상 가장 마지막은 언제나 Object.prototype이 있는데,
이렇게 하면 접근할 수 없는 형태로 생성됨)

-   장점: \_proto를 직접 만들어 주면 내장(빌트인) 메서드/프로퍼티가 없어, 무게를 낮추고 성능을 높임
-   단점: 기본 기능에 제약
