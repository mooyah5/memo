# react 에러처리 위임
에러 상황을 캐치하지만, 에러 처리는 하지 않음.
상위 컴포넌트로 위임

```
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
} 

export function AddCommentContainer() {
  return {
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    >
      <AddCommentForm />
    </ErrorBoundary>
  };
}
```