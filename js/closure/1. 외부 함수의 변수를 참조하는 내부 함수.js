
// 1.(X) 외부 함수의 변수를 참조하는 내부 함수
var outer = function () {
  var a = 1;
  var inner = function () {
    console.log(++a)
  }
  inner()
}
outer() // outer 함수 시런 종료 시 LE에 저장된 식별자 참조 지움. 수집 대상.

// 2.(X)
var outer = function () {
  var a = 1
  var inner = function () {
    return ++a
  }
  return inner()
}
var newOuter = outer()
console.log(outer2)     // 수집 대상

// 3.(O)
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


  // 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우, 실컨이 종료된 후에도 변수 a가 사라지지 않는 현상.
  // `외부로 전달`: return만이 아님

  // 1. setInterval / setTimeout
  (function () {
    var a = 0
    var intervalId = null
    var inner = function () {
      if (++a >= 10) {
        clearInterval(intervalId)
      }
      console.log(a)
    }
    intervalId = setInterval(inner, 1000)
  })()

  // 2. eventListener
  (function () {
    var count = 0
    var btn = document.querySelector("button")
    btn.innerText = 'click'
    btn.addEventListener("click", function () {
      console.log(++count, 'times clicked')
    })
    document.body.appendChild(btn)
  })

