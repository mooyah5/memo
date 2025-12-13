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