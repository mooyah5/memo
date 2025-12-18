# Getter & Setter

객체 지향 프로그래밍에서 사용되는 개념으로,
일종의 메서드

Getter: 객체의 속성 값을 반환하는 메서드
Setter: 객체의 속성 값을 설정/변경하는 메서드

```
const user = {
    name: 'hanna',
    age: 30,

    getName() {
        return user.name;
    },
    setName(value) {
        user.name = value;
    }
}

console.log(user.getName())
user.setName("babo")
```

### why?
- 정보 은닉
    객체 내부 속성에 직접 접근하지 않아 보안 강화
- 코드 안정성
    함부로 바뀌지 않게 내부 컨트롤 가넝
- 유지보수성

### js getter and setter
getter, setter는 이론적 개념이다
보통 `get프로퍼티명()`, `set프로퍼티명()`
형식의 메서드명으로 약속하긴 하지만,
ES6부터는 간단 정의 가능한 문법이 생겼다.

객체 리터럴 안에서 속성명 앞에 get, set 키워드만 붙이면 된다.

```
const user = {
    name: 'hanna',
    age: 31,

    get userName() {
        return user.name
    },
    set userName(value) {
        user.name = value
    }
}

console.log(user.userName)
userName = 'dooul'
// 함수 호출 형식이 아닌, 일반 프로퍼티처럼 접근해서 사용
// 가상 프로퍼티(userName)가 생기는데, 읽쓰는 되는데 실제 존재는 안함
```

### 접근자 프로퍼티

JS 객체의 프로퍼티는 크게 2종류
- 데이터 프로퍼티 (data)
    일반적인, 객체 내부에 저장된 실제 데이터 값
- 접근자 프로퍼티 (accessor)
    key, value를 가지지 않고, getter, setter 함수를 가지는 특수 프로퍼티
    이것을 호출하면, 함수 호출 문법이 아녀도 getter, setter 함수가 호출되는 것과 같은 원리
    Getter, Setter 함수 자체가 접근자 프로퍼티다.

```
let person = {

    // 데이터 프로퍼티
    firstName: 'Hanna',
    lastName: "Baek",

    // 접근자 프로퍼티
    get fullName() {
        return this.firstName + " " + lastName
    },
    set fullName (name) {
        let names = name.split(" ")
        this.firstName = names[0]
        this.lastName = names[1]
    }
}
console.log(person.firstName)
console.log(person.lastName)

console.log(person.fullName)
person.fullName = 'Dooul Baek'
```

### 주의할 점

- Getter만 선언할 때
    값을 할당하려 하면 에러 발생
- Setter 무한 루프
    데이터 프로퍼니명과 접근자 프로퍼티명이 같을 경우,
    Setter의 무한 루프에 빠지므로, 중복되게 하지 말 것.
    - setter 함수 안에서 자기 자신을 호출하였기 때문
    ```
    const user = {
        name: 'hanna', 
        age: 30,
        get name() {
            return user.name
        },
        set name(value) {
            user.name = value
        }
    }
    user.name = 'hanna2'    // Uncaught RangeError: Maximun call stack size exceeded
    ```
