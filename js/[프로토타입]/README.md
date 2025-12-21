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

### 다중 프로토타입 체인

`js는 타입 설계가 느슨하여, 프로토타입을 변경할 수 있다.`

    - prototype == 객체
    - prototype에 다튼 타입 객체도 넣을 수 있음
    - 따라서 프로토타입 체인 증가
    ```
    var Grad = function () {
        var args = Array.prototype.slice.call(arguments)
        for (var i = 0; i < args.length; i++) {
            this[i] = args[i]
        }
        this.length = args.length
    }
    var g = new Grade(100, 80)  // { 0: 100, 1: 80, length: 2}
    ```
    현재 Grade를 상속받은 g는 유사배열객체로, g.push(90) 등 배열 메서드를 사용할 수 없는 상태다.

    ```
    Grade.prototype = [];
    ```
    위와같이 Grade 인스턴스의 프로토타입을 '배열 인스턴스'로 변경하면, g.push(90) 등 배열 메서드를 사용할 수 있게 된다.
    체인: `g -> [] -> Array.prototype -> Object.prototype -> null`

### 정리

어떤 생성자 함수를 new 연산자랑 같이 호출하면,
Constructore에서 정의된 내용을 바탕으로 new Instance가 생성된다.
이 Instance에는 `__proto__`라는 Constructor의 prototype 프로퍼티를 참조하는 프로퍼티가 자동 부여된다.

**proto**는 생략 가능한 속성으로, 인스턴스는 Constructor.prototype의 메서드를 마치 자기 메서드처럼 호출할 수 있게 된다.

Constructor.prototype에는 constructor라는 프로퍼티가 있는데, 자기 자신(생성자 함수)를 가리킨다.
이 프로ㅓ퍼티는 인스턴스가 자기 생성자 함수가 뭔지 알고자 할 때 필요하다.

직각삼각형 대각선방향을 계속 찾아가면(**proto**), 최종은 Object.prototype에 도달한다.
이런 식으로 **proto**안의 **proto**를 연속적으로 찾아가는 과정을 `프로토타입 체이닝`이라고 부른다.
이를 통해 각 프로토타입 메서드를 자기 것인냥 호출할 수 있다.
자기자신으로부터 가장 가까운곳부터 먼대상으로 점차 나아가며, 값을 찾으면 검색을 중단한다.

Object.prototype에는 모든 데이터타입에서 사용 가능한 범용적 메서드만 존재하며
객체전용 메서드는 여느 데이터 타입과 달리, Object 새엇ㅇ자 함수에 `스태틱하게` 담겨 있다.

프로토타입 체인은 무한대의 단계를 생성할 수 있는데, 어차피 같은 값을 참조하는 거라 무한대로 저장돼있는 건 아님.
