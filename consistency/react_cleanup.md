# react cleanup
input이 바뀌면 컴포넌트 리렌더링됨
리렌더링 후 useEffect 재실행 준비
이전에 등록한 useEffect의 cleanup (return) 함수 먼저 실행
그 다음 새로운 useEffect 본문 실행

```
useEffect(() => {
    // mount 시점, deps update 시점에 실행할 작업 (componentDidMount)

    return () => {
        // unmount 시점, deps update 직전에 실행할 작업 (componentWillUnmount)
    }
}, [deps])
```