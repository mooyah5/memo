# `try/catch` vs `await .catch()`

### try/catch

-   동기 throw
    함수를 호출하는 순간 trhow new Error() => try/catch에서 잡힘
-   비동기 reject: await someAsync()에서 recht => 그 지점에서 throw로 변환되어 catch에서 잡힘.
-   정리 가능 (finally): 락 채제, 리소스 정리 등

```
try {
    const a = maySyncThrow()    // 동기 throw 발생 가능 -> catch에서 잡힙
    const b = await mayReject() // 비동기 reject -> await 지점에서 throw -> catch에서 잡힙
} catch (err) {
    console.log("여기서 다 잡힙", err)
} finally {
    cleanup()
}
```

### await promise.catch(...)

-   그 Promise의 reject만 잡읍.
-   함수 호출 자체가 동기 throw면, `.catch`를 붙일 기회가 없어서 바깥으로 튐.
-   정리가 불편하고, 에러를 `값으로` 변환해서 계속 진행할 땐 간편.

```
// O: 비동기 실패를 값으로 바꿔서 계속 진행하려는 경우 좋음
const result = await mayReject()
    .catch(e => {
        console.warn("실패, 기본값으로 진행", e)
        return null
    })

// X: 동기 throw는 여기서 못 잡음 (함수 호출 순간에 이미 터짐)
const result2 = await maySyncThrow()    // 호출 순간 throw -> .catch로 못 감
    .catch(e => console.log("미실행"))
```
