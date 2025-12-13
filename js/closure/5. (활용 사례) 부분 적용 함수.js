var partial = function () {
  var originalPartialArgs = arguments
  var func = originalPartialArgs[0]
  if (typeof func !== 'function') {
    throw new Error("첫 인자가 함수가 아님!")
  }

  // 클로저 반환
  return function () {
    // arguments: 함수에 전달된 모든 인자들을 담고 있는 유사 배열 객체
    // slice: arguments를 진짜 배열로 전환 (slice 내부는 this를 기준으로 동작함.)
    var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1)
    var restArgs = Array.prototype.slice.call(arguments)
    console.log(originalPartialArgs, partialArgs, restArgs)
    return func.apply(this, partialArgs.concat(restArgs))
  }
}

// var partialModern = function (func, ...fixed) {
//   return function (...rest) {
//     return func.apply(this, fixed.concat(rest))
//   }
// }

var add = function () {
  var result = 0
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i]
  }
  return result
}

var addPartial = partialModern(add, 1, 2, 3, 4, 5)
console.log(addPartial(6, 7, 8, 9, 10))

var dog = {
  name: "가나디",
  greet: partialModern(function (prefix, suffix) {
    return prefix + this.name + suffix
  }, '왈왈, ')
}
dog.greet("입니다!")    // 왈왈, 가나디입니다!