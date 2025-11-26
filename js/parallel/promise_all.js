// Promise.all
// 두 req가 독립적이지만, 두 res가 모두 필요한 경우.

Promise.all([
  fetch("https://dummyjson.com/products/1").then(res => res.json()),
  fetch("https://jsonplaceholder.typicode.com/posts/1").then(res => res.json()),
])
  .then(([dummy, place]) => {
    console.log("dummy", dummy);
    console.log("place", place);
  })
  .catch((err) => {
    console.error("요청 중 하나라도 실패함: ", err);
  });


// async로 병렬 처리하기
// promise.all을 사용하지만, async/await 문법을 사용하여 작성한 예제.

async function fetchDataParallel() {
  try {
    const [dummyRes, placeRes] = await Promise.all([
      fetch("https://dummyjson.com/products/1"),
      fetch("https://jsonplaceholder.typicode.com/posts/1"),
    ])
    const dummy = await dummyRes.json();
    const place = await placeRes.json();

    console.log("async dummy", dummy);
    console.log("async place", place);
  } catch (err) {
    console.error("async 요청 중 하나라도 실패함: ", err);
  }
}
fetchDataParallel()


