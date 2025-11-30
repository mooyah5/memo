const worker = new Worker("worker.js");

worker.onmessage = (e) => {
  console.log(`main thread: ${e.data}`)
}
worker.postMessage('hello, worker!');

console.log("start main thread");