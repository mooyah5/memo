setTimeout(() => console.log("후순위"), 10)
for (let i = 0; i < 1e10; i++) { }
console.log("끗")



// setTimeout, setInterval 같은 비동기 함수들은 부정확할 수 있다.
