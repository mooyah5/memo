# 클로저

### 이해
함수형 프로그래밍 언어에서 등장하는 보편 특성

`closure`
- 사전적: 닫혀있음, 폐쇄성, 완결성

### 예제

1. (X) 외부 함수의 변수를 참조하는 내부 함수
    ```
    var outer = function () {
        var a = 1;
        var inner = function () {
            console.log(++a)
        }
        inner()
    }
    outer() // outer 함수 시런 종료 시 LE에 저장된 식별자 참조 지움. 수집 대상.
    ```

2. (X) 
    ```
    var outer = function () {
        var a = 1
        var inner = function () {
            return ++a
        }
        return inner()
    }
    var newOuter = outer()
    console.log(outer2)     // 수집 대상
    ```

3. (O)
    ```
    var outer = function () {
        var a = 1
        var inner = function () {
            return ++a
        }
        return inner    // 함수 자체 반환
    }
    var newOuter = outer()
    console.log(newOuter())     // 2
    console.log(newOuter())     // 3
    ```

##### 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우, 실컨이 종료된 후에도 변수 a가 사라지지 않는 현상.

- `외부로 전달`: return만이 아님
    - 1. setInterval/setTimeout
        ```
        (function () {
            var a = 0
            var intervalId = null
            var inner = function () {
                if (++a >= 10) {
                    clearInterval(intervalId)
                }
                console.log(a)
            }
            intervalID = setInterval(inner, 1000)
        })()
        ```
    - 2. eventListener
        ```
        (function () {
            var = count = 0
            var btn = document.querySelector("button")
            btn.innerText = 'click'
            btn.addEventListener("click", function() {
                console.log(++count, 'times clicked')
            })
            document.body.appendChild(btn)
        })
        ```


- 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
- 이미 생명 주기가 끝난 외부 함수의 변수를 참조하는 함수
- 자신이 생성될 때의 스코프에서 알 수 있었던 변수들 중 언젠가 자신이 실행될 때 사용할 변수들만을 기억하여 유지시키는 함수



### 메모리 관리
- `가비지 컬렉터`: 어떤 값을 참조하는 변수가 하나라도 있다면 그 값은 수집 대상에 포함시키지 않음.

- `메모리 누수`: 개발자 의도와 달리 어떤 값 참조 카운트가 0이 되지 않아 GC 수거 대상이 되지 않은 경우 (의도적인 경우 클로저?)

- `클로저`: 필요에 의해 의도적으로 함수의 지역변수를 메모리를 소모하도록 함으로써 발생. (필요성 없어지면 참조 카운트를 0으로 만들면 됨)

- `참조 카운트`: 객체가 얼마나 많은 다른 객체/변수에 의해 참조되고 있는지 세는 기법.
    - 참조 발생: 카운트 증가
    - 참조 채제: 카운트 감소
    - 0이 되면: 메모리 해제
    - 단점: 순환 참조
        A <=> B가 서로 참조하면 서로 카운트가 0이 되지 않아 해제되지 않음 (=> `약한 참조(WeakMap, WeakSet)`)
    - 0으로 만들기: 식별자에 참조형 말고 기본형 데이터를 할당(null, undefined)

```
// (1) return에 의한 클로저 메모리 해제
var outer = (function () {
    var a = 1
    var inner = function () {
        return ++a
    }
    return inner
})
console.log(outer())
console.log(outer())
outer = null    // outer 식별자의 inner 함수 참조를 끊음
```

```
// (2) setInterval 클로저 메모리 해제
(function () {
    var a = 0
    var intervalId = null
    var inner = function () {
        if (++a <= 10) {
            clearInterval(intervalId)
            inner = null    // inner 식별자 함수 참조 끊음
        }
        console.log(a)
    }
    intervalId = setInterval(inner, 1000)
})()
```

```
// (3) eventListener 클로저 메모리 해제
(function () {
    var a = 0
    var btn = document.querySelector("button")
    btn.innerText = "click"

    var clickHandler = function () {
        console.log(++count, 'times clicked')
        if (count >= 10) {
            btn.removeEventListener("click", clickHandler)
            clickHandler = null // clickHandler 식별자의 함수 참조 끊음
        }
    }

    btn.addEventListener("click", clickHandler)
    document.body.appendChild(btn)

})()
```

### 활용 사례
##### 1. 콜백 함수 안에서 외부 데이터를 사용하려 할 때
이벤트 리스너 예시 (클로저의 외부 데이터에 주목)

```
var fruits = ["apple", "banana", "peach"]
var $ul = document.createElement("ul")      // 공통 코드

var alertFruit = function (fruit) {
    alert("your choice is ", + fruit)
}
var alertFruitBuilder = function (fruit) {
    return function () {
        alert("your choice is ", fruit)
    }
}
fruits.forEach(function (fruit) {
    var $li = document.createElement("li")
    $li.innerText = fruit;

    // 클로저 O: fruit라는 외부 함수를 참조
    $li.addEventListener("click", () => alertFruit(fruit))
    // $li.addEventListener("click", alertFruit.bind(null, fruit))
    // $li.addEventListener("click", alertFruitBuilder(fruit))

    $ul.appendChild($li)
})
document.body.appendChild($ul)
```


##### 2. 접근권한 제어 (정보 은닉, information hiding)
- `정보 은닉`: 어떤 모듈의 내부 로직에 대해 외부로의 노출을 최소화해서 모듈 간 결합도를 낮추고 유연성을 높이고자 하는 현대 프로그래밍 언어의 주요 개념 중 하나

- 접근 권한
    - public - 외부에서 접근 가능
    - private - 내부에서만 사용, 외부에 노출되지 않음
    - protected
js는 기본적으로 변수 자체에 접근 권한을 직접 부여하도록 설계되지 않았다.
그렇다고 불가능한 것은 아님. `클로저`를 이용해 함수 차원의 public, private한 값을 구분할 수 있음.

```
var outer = function () {
    var a = 1
    var inner = function () {
        return ++a
    }
    return inner
}
var outer2 = outer()
console.log(outer2())
console.log(outer2())
```
- outer 함수 종료 시 inner 함수 반환 => outer 지역변수 a를 외부에서도 읽을 수 있게 됨. (return을 통해)
- 클로저 `폐쇄성`
    - outer 함수는 외부로부터 철저하게 격리된 닫힌 공간임.
    - 외부에서는 외부 공간에 노출된 outer 변수로 함수 실행은 가능하나,
    - 함수 내부에는 개입할 수 없음.
    - 외부에서는 오직 outer가 리턴한 정보에만 개입 가능. (return이 외부에 정보를 제공하는 유일 수단)
    - SO, 외부 제공 정보를 모아 return하고, 내부 정보는 리턴하지 않는 것으로 접근 권한 제어가 가능한 것


**자동차 경주 게임 예시**
- 규칙
    - 각 턴 주사위 굴려 나온 숫자(km)만큼 이동함.
    - 차량별 연료량(fuel)과 연비(power)는 무작위 생성됨.
    - 남은 연료가 이동할 거리에 필요한 연료보다 부족하면 이동 못함.
    - 모든 유저가 이동할 수 없는 턴에 게임 종료
    - 게임 종료 시점에 가장 멀리 이동해 있는 사람 승리

- 간단 자동차 객체
    ```
    var car = {
        fuel: Math.ceil(Math.random() * 10 + 10),   // 연료(L)
        power: Math.ceil(Math.random() * 3 + 2),    // 연비(km/L)
        moved: 0,   // 총 이동 거리
        run: function () {
            var km = Math.ceil(Math.random * 6)
            var wasteFuel = km / this.power
            if (this.fuel < wasteFuel) {
                console.log("이동 불가")
                return
            }
            this.fuel -= wasteFuel
            this.moved += km
            console.log(km + "km 이동 (총 " + this.moved + "km)")
        }
    }

    // => 
    var createCar = function () {
    var fuel = Math.ceil(Math.random() * 10 + 10)   // 은닉화된 연료
    var power = Math.ceil(Math.random() * 3 + 2)    // 은닉화된 연비
    var moved = 0;   // 총 이동 거리
    return {
        get moved() {
            return moved
        },
        run: function () {
            var km = Math.ceil(Math.random * 6)
            var wasteFuel = km / power
            if (fuel < wasteFuel) {
                console.log("이동 불가")
                return
            }
            fuel -= wasteFuel
            moved += km
            console.log(km + "km 이동 (총 " + moved + "km.) 남은 연료: " + fuel + "L")
            }
        }
    }
    ```


##### 3. 부분 적용 함수
n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가,
나중에 (n-m)개의 인자를 넘기면 비로소 원래 함수의 실행 결과를 얻을 수 있게 하는 함수.

```
var add = function () {
    var result = 0
    for (var i = 0; i < arguments.length; i++) {
        result += arguments[i]
    }
    return result
}
var addPartial = add.bind(null, 1,2,3,4,5)
console.log(addPartial(6,7,8,9,10))     // 55
```
- addPartial 함수는 인자 5개를 미리 적용하고, 추후 추가 인자들을 전달하면 모든 인자를 모아 원 함수가 실행되는 부분적용함수.
- add 함수는 this를 사용하지 않으므로 bind메서드만으로도 문제없이 구현되었으나,
- this의 값을 변경할 수밖에 없어, 메서드에서는 사용할 수 없을 듯


```
var partial = function () {
    var originalPartialArgs = arguments
    var func = originalPartialArgs[0]
    if (typeof func !== 'function') {
        throw new Error("첫 인자가 함수가 아님!")
    }

    return function () {
        var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1)
        var restArgs = Array.prototype.slice.call(arguments)
        return func.apply(this, partialArgs.concat(restArgs))
    }
}

var add = function () {
    var result = 0
    for (var i = 0; i < arguments.length; i++) {
        result += arguments[i]
    }
    return result
}

var addPartial = partial(add, 1,2,3,4,5)
console.log(addPartial(6,7,8,9,10))

var dog = {
    name: "가나디",
    greet: partial(function(prefix, suffix) {
        return prefix + this.name + suffix
    }, '왈왈, ')
}
dog.greet("입니다!")    // 왈왈, 가나디입니다!
```