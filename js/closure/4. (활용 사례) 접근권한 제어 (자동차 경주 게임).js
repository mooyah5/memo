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


// BUT, car.fuel = 1000; 이런 식으로 외부에서 연료를 마음대로 변경할 수 있다면?
// 이를 방지하기 위해 연료를 은닉화(캡슐화)할 수 있다면? (필요 멤버만 return)

// --------------------------------------------------------

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
// 이제 외부에서는 오직 run 메서드 실행과 현재 moved 값 확인 2동작만 가능 (값 변경 시도 대부분 실패)

var car = createCar()
car.run()   // 3km 이동 (총 3km.) 남은 연료: 17.4L
console.log(car.moved)   // 3
console.log(car.fuel)    // undefined
console.log(car.power)   // undefined

car.fuel = 1000
console.log(car.fuel)    // 1000 (외부에서 마음대로 추가한 멤버)
car.run()   // 1km 이동 (총 4km.) 남은 연료: 17.2L

car.power = 100
console.log(car.power)   // 100 (외부에서 마음대로 추가한 멤버)
car.run()   // 4km 이동 (총 8km.) 남은 연료: 16.4L

car.moved = 1000
console.log(car.moved)   // 8 (외부에서 마음대로 추가한 멤버와 은닉화된 멤버는 별개)
car.run()   // 2km 이동 (총 10km.) 남은 연료: 16L

// 결론: 클로저를 이용한 은닉화(캡슐화)는 외부에서 멤버를 마음대로 변경하지 못하게 막아준다.
// (run 메서드를 다른 내용으로 덮어씌우는 여뷰징은 여전히 가능...)

// --------------------------------------------------------

var createCar = function () {
  // ...
  var publicMembers = {
    // ...
  }

  Object.freeze(publicMembers)   // publicMembers 객체를 리턴하기 전에 미리 변경 불가 처리
  return publicMembers
  // ...
}

// 클로저를 활용한 접근 권한 제어
// 1. 함수에서 지역변수, 내부함수 등을 만든다.
// 2. 외부에 접근권한 주고 싶은 대상들로 구성된 참조형 데이터 (대상이 여럿이면 객체나 배열, 하나면 함수)를 리턴한다.
// 3. 리턴된 참조형 데이터가 내부의 식별자들을 참조하고 있으면, 실컨 종료 후에도 참조 카운트가 0이 아니게 되어 메모리에서 수집되지 않는다. (클로저 현상 발생)
// 4. 리턴된 참조형 데이터가 내부의 식별자들을 참조하고 있지 않으면, 실컨 종료 후 참조 카운트가 0이 되어 메모리에서 수집된다. (클로저 현상 미발생)