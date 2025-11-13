// 병렬 처리 시 순서 보장되지 않음.

console.log("START");

fetch("https://dummyjson.com/products/1")
  .then((res) => res.json())
  .then((json) => console.log("Dummyjson 1:", json))
  .catch((err) => console.error("Error fetching product 1:", err));
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => res.json())
  .then((json) => console.log("Jsonplaceholder 1:", json))
  .catch((err) => console.error("Error fetching post 1:", err));
console.log("END");