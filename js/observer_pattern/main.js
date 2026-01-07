import { Subject, Observer } from "./core.js";

class YoutubeChannel extends Subject {
    constructor(initialState) {
        super(initialState);
    }
}

class Subscriber extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update(newState) {
        console.log(`${this.name}님, ${newState}가 업로드 되었습니다.`);
    }
}

const myYoutube = new YoutubeChannel();

const subscriber1 = new Subscriber("sub1");
const subscriber2 = new Subscriber("sub2");

myYoutube.addObserver(subscriber1);
myYoutube.addObserver(subscriber2);
myYoutube.setState("new video");
