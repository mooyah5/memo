function delay(ms) {
    return new Promise(resolve => {
        debugger;
        setTimeout(() => resolve(`aasdf ${ms}ms`), ms)
    });
}

delay(500)
    .then((message) => {
        return message
    })
    .then((finalMsg) => {
        console.log("Final message: ", finalMsg);
    })