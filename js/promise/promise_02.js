function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`aasdf ${ms}ms`), ms)
    });
}
async function delayAsync(ms) {
    const message = await delay(ms);
    console.log("Async message: ", message);
    return `Return Async message: ${message}`;
}

const asdf = await delayAsync(1000)

console.log('asdfasdf', asdf)