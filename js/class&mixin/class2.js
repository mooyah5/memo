class Animal {
    constructor(name) {
        this.name = name;
    }

    // 부모로 이동된 flyTo, eat, swimAt 메서드
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

class Duck extends Animal {}
class Swan extends Animal {}
