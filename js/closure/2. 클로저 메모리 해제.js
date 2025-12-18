/// 클로저 메모리 해제 방법 - 참조 카운트를 0으로 만들기: => 식별자에 참조형 말고 기본형 데이터 할당(null, undefined)

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
