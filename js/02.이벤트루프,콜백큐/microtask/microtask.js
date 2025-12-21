// 실행 순서를 나열하며 흐름 설명하기

console.log("A")

setTimeout(() => {
  console.log("B")
}, 0)

Promise.resolve().then(() => {
  console.log("C")
})

console.log("D")
// 예상 출력 순서: A D C B