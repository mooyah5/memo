# 고차함수 (Higher-Order Function)

다른 함수를 인자로 받거나(매개변수) 함수를 결과로 반환하는 함수.

함수형 프로그래밍의 핵심 개념.
함수를 값처럼 다룰 수 있는 `일급 객체` 특성을 기반으로 함.

-   `일급 객체(first class object)`
    언어 안에서 값으로 표현되고 전달될 수 있는 자료형
    함수를 인자로 받거나 결과로 반환하는 함수를 고차함수라고 한다. (<-> 일차 함수)
    자바스크립트가 함수를 `일급 시민(first-class citizen)`으로 대해준다. (js나 다른 함수형 프로그래밍 언어 함수들은 전부 `객체`이기 때문이다.)

-   함수를 인자로 하여 호출할 수 있는 함수

    ```
    const increase = val => val + 1;
    const apply = (fx, val) => fx(val);
    console.log(apply(increase, 9));    // 10
    ```

-   함수를 결과로 반환하는 함수

    ```
    const greeting = msg => name => `#{msg}, ${name}!`;
    const koreanGreeting = greeting("안녕");
    const englishGreeting = greeting("Hello");

    console.log(koreanGreeting("세계"));        // 안녕, 세계!
    console.log(englishGreeting("world"));      // Hello, world!
    ```

-   함수를 인자로 하여 호출할 수 있고 결과로 함수를 반환하는 함수 (currying)

    ```
    const add = (valX, valY) => valX + valY;
    const curry = (fx, valX) => valY => fx(valX, valY);
    const addTen = curry(add, 10);

    console.log(addTen(5));         // 15
    ```

-   활용 예제
    -   `map()`: 배열 각 요소를 변환하여 새로운 배열 반환
    -   `filter()`: 배열에서 조건(클로저)을 만족하는 요소만 필터링하여 새 배열 반환.
    -   `reduce()`: 배열의 값들을 하나로 합쳐 단일 값 반환.
