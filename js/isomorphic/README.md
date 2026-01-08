# Isomorphic

서버/클라이언트 모두 사용 가능한 코드

그리스어 합성어 `iso(같은)` + `morphe(형태)`
**같은 코드가 서버/브라우저 양쪽에서 실행될 수 있다** (Universal JS)

Node.js서버에서도, 브라우저에서도 실행 가능한 코드

## 필요성

#### 과거의 문제점

php, jsp 시절 섭/클 완전 분리 형태였음 (섭은 php로 html 생성, 클은 jquery로 인터랙션)

-   섭: php로 날짜 포맷팅
-   클: js로 또 날짜 포맷팅
    => 2번 구현, 버그 가능성 2배

#### isomorphic 장점

코드 한 번만 작성
섭/클 항상 같은 결과 보장

#### not isomorphic code

```
// 브라우저 전용
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value); // 서버에서 에러
}

// Node.js 전용
const fs = require('fs');
function readFile(path) {
  return fs.readFileSync(path); // 브라우저에서 에러
}

// DOM 직접 조작
function updateTitle(text) {
  document.title = text; // 서버에 document 없음
}
```

## isomorphic pattern

#### 1. 환경 체크

```
export const isServer = () => typeof window === 'undefined' || "Deno" in globalThis;
export const isClient = () => !isServer;

if (isClient()) {
    // 브라우저 전용 코드
    const width = window.innerWidth;
}
```

#### 2. 동적 Import

-   Nextjs의 dynamic import
-   Nuxt

    -   <CleintOnly> 컴포넌트로 감싸기
    -   `.client.vue` 파일명 사용
    -   `Lazy` 접두사 컴포넌트로 지연 로드
    -   권장 조합: ClienOnly + defineAsyncComponent 또는 Lazy 접두사로 동적 import

        ```
        <script setup lang="ts">
        import { defineAsyncComponent } from 'vue'

        const MapComponent = defineAsyncComponent({
        loader: () => import('~/components/MapComponent.client.vue'),
        loadingComponent: { template: '<p>지도 로딩중...</p>' },
        })
        </script>

        <template>
        <ClientOnly>
            <MapComponent />
            <template #fallback>
            <p>지도 로딩중...</p>
            </template>
        </ClientOnly>
        </template>
        ```

    -   구분
        -   `<ClientOnly>`로 충분한 케이스
            -   최상위 컴포넌트에서 브라우저 API 접근이 전혀 없을 때
            -   import하는 라이브러리들이 ESM 모듈 로드 시점에 브라우저 API에 접근하지 않는 경우
            -   SSR에서 fallback을 보여주기만 하면 되고, 서버가 해당 컴포넌트 읽는 정도는 문제 없는 경우
        -   `.client.vue` 필요 케이스
            -   컴포넌트 최상단에서 즉시 브라우저 api를 쓰거나, 라이브러리 자체가 로드 시 window/document 참조하는 경우
            -   서버 번들에 절대 포함되면 안 되는 코드(WebRTC, WebGL 확장 등)
            -   SSR 빌드/실행 시 에러 나는 라이브러리 안전 격리 원할 때

## 다른 활용 사례

#### Isomorphic Storage

```
class IsomorphicStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return this.store.get(key);
  }

  setItem(key, value) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      this.store.set(key, value);
    }
  }
}

export const storage = new IsomorphicStorage();
```

#### Isomorphic Fetch

Node.js 구버전에서는 fetch가 없었기 때문에 이런 패턴을 사용

```
export const fetch = (() => {
  if (typeof window !== 'undefined') {
    return window.fetch;
  } else {
    return require('node-fetch');
  }
})();
```

#### Isomorphic Cookie

```
export const cookies = {
  get(name) {
    if (typeof window !== 'undefined') {
      // 브라우저: document.cookie 파싱
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
    } else {
      // 서버: req.headers.cookie 파싱
      // Next.js의 경우 cookies() 함수 사용
    }
  }
};
```

## 마무리

```
// 나쁜 예
const width = window.innerWidth; // 서버에서 에러

// 좋은 예
const width = typeof window !== 'undefined' ? window.innerWidth : 0;

// 더 좋은 예
const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
    }
  }, []);

  return width;
};
```

## 참고

https://velog.io/@hyojun99222/Isomorphic-%EC%84%9C%EB%B2%84%EC%99%80-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8%EC%97%90%EC%84%9C-%EB%AA%A8%EB%91%90-%EC%82%AC%EC%9A%A9-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%BD%94%EB%93%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0
