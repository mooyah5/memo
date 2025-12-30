// function _pipe(f, g) {
//     return function () {
//         return g.call(this, f.apply(this, arguments));
//     };
// }

// pipe란?

// 출력을 다음 함수 입력으로 연결하는 합성 방식
// 수학적 합성 g(f(x)) 를 좌 => 우 가독성으로 만들면 pipe(f, g)(x)가 된다.
function _pipe(f, g) {
    return function () {
        // 1) f.apply(this, arguments) === f(...arguments) 와 유사 (this 전달 + 가변 인자)
        const intermediate = f.apply(this, arguments); // 현재 함수의 this와 전달된 모든 인자를 그대로 f에 넘김
        // 2) g.call(this, intermediate) === g(intermediate) with this binding
        return g.call(this, intermediate); // f의 결과를 g에 넘기면서 같은 this를 유지함

        // 메서드 컨텍스트(this)를 보존하면서 g(f(...))를 만들었다.
        // 일반적으로는 pipe 구현으로 this거의 안쓰지만, 이 코드는 메서드 체인, Vue 컴포넌트 메서드에서 유용
    };
}

// 개선 버전
function pipe2(f, g) {
    return function (...args) {
        const mid = f.apply(this, args);
        return g.call(this, mid);
    };
}
