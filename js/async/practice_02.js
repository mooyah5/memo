function asyncPrint() {
    debugger;
    setTimeout(() => {
        debugger;
        console.log('2초뒤');
    }, 2000);
}
asyncPrint();
console.log('This message appears first.');