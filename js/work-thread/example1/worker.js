self.onmessage = (e) => {
  console.log(`worker received message: ${e.data}`)
  self.postMessage('hello, main!')
  handleLongTask()
}

// long task
function handleLongTask() {
  const startTime = Date.now()
  while (Date.now() - startTime < 5000) {
    // 5초 동안 블로킹
  }
  self.postMessage("Long task 완료")
}