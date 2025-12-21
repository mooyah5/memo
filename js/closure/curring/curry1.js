var curry3 = function (func) {
  return function (a) {
    return function (b) {
      return func(a, b)
    }
  }
}

var getMaxWith10 = curry3(Math.max)(10)
// getMaxWith10 = (b) => Math.max(10, b)
console.log(GetMaxWith10(8))
// getMaxWith10 = Math.max(10, 8) = 10
console.log(GetMaxWith10(25))
// getMaxWith10 = Math.max(10, 32) = 25

var getMinWith10 = curry3(Math.min)(10)
// getMinWith10 = (b) => Math.min(10, b)
console.log(GetMinWith10(8))
// getMinWith10 = Math.min(10, 8) = 8
console.log(GetMinWith10(25))
// getMinWith10 = Math.min(10, 32) = 10
