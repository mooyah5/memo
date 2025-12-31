// 부모 클래스
class Animal {
    constructor(name) {
        this.name = name;
    }
}

// 담당 믹스인
const FlyToMixin = (superclass) =>
    class extends superclass {
        flyTo(destination) {
            console.log(`${this.name} is flying to the ${destination}`);
        }
    };

const EatMixin = (superclass) =>
    class extends superclass {
        eat(food) {
            console.log(`${this.name} is eating ${food}`);
        }
    };

const SwimAtMixin = (superclass) =>
    class extends superclass {
        swimAt(place) {
            console.log(`${this.name} is swiming at the ${place}`);
        }
    };

class Mouse extends SwimAtMixin(EatMixin(Animal)) {
    //
}

const mickyMouse = new Mouse("Micky Mouse");
mickyMouse.swimAt("river"); // Micky Mouse is swiming at the river
