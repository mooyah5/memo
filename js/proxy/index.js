const target = {};
const proxy = new Proxy(target, {
    get(target, prop, receiver) {
        console.log(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        console.log(target, prop, value, receiver);
    },
}); // 핸들러 없는 proxy 객체 정의

proxy.test = 5; // 1) add a new property 'test' in proxy
console.log(proxy.test); // 2) proxy의 test 프로퍼티 읽기
console.log(target.test); // 3) 원래 객체인 target의 test 프로퍼티에서 5 저장
console.log(proxy);
console.log(target);
