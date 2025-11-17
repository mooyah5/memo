# Retry 전략 (재시도)

### 언제 재시도를?
모든 요청을 재시도할 필요는 없음.
    - 서버가 불안할 때
    - 중요한 정보, 초기 렌더링 등 응답이 반드시 필요할 때

그런데, 네트워크 오류나 서버가 이상할 때 많은 클라이언트가 너무 자주 재시도한다면?

- 개선책 (지수 백오프)
    실패 시 바로 재시도하는 게 아니라, 간격을 점점 길게 늘려 서버/네트워크가 회복할 시간을 부여 (1 => 2 => 4 => 8초...)

#### 라이브러리 예시 (react-query)
- 상태관리 라이브러리에서도 지원
- retry 옵션 제공
- 지수백오프 지원
```
const { data, isError, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetch(`/api/posts/${id}`).then(res => res.json()),
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 3000)  // 지수 백오프
})
```

### 반복 요청 구현하기
- fetch 요청은 async/await 방식으로
- 오류 처리 위해 try/catch
- 재시도 로직은 for 반복문
- response.ok가 false인 경우도 에러로 간주하여 재시도
- 재시도 간격 점차 늘리기 (지수백오프)

