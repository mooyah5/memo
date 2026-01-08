export class Subject {
    constructor(initialState = null) {
        this.state = initialState;
        this.observers = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = newState;
        this.notify();
    }

    addObserver(observer) {
        if (observer && typeof observer.update === "function") {
            this.observers.push(observer);
        }
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);

        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        for (const observer of this.observers) {
            observer.update(this.state);
        }
    }

    initialize() {
        this.notify();
    }
}

export class Observer {
    update(newState) {}
}
