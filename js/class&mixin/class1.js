class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Duck extends Animal {
    flyTo(destination) {
        console.log(`${this.name} is flying to the ${destination}`);
    }

    eat(food) {
        console.log(`${this.name} is eating ${food}`);
    }

    swimAt(place) {
        console.log(`${this.name} is swiming at the ${place}`);
    }
}

const duck = new Duck("Donald duck");
duck.flyTo("home"); // Donald duck is flying to the home

// 전개 연산자 (Spread Operator) 구문으로 생성자 명시적 선언 (부모에 전달할 파라미터 편리하게 작성)
class Duck2 extends Animal {
    constructor(...args) {
        super(...args);
    }
}
