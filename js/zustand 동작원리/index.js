const createStore = (createState) => {
    /** 내부 상태 (클로저로 감춤) */
    let state;

    /** 구독자 (상태 변경 알림 받을 콜백들) */
    const listeners = new Set();

    /** (책임) 최신 상태 반환 */
    const getState = () => state;

    /** 상태 변경 알림 구독 */
    const subscribe = (cb) => {
        listeners.add(cb);

        // 언구독 함수 반호나
        return () => {
            listeners.delete(cb);
        };
    };

    /** 상태 변경 */
    const setState = (partial) => {
        const prevState = state;

        // partial이 함수면 (prevState) => nextState 형태 처리
        //          아니면 partial 자체를 다음 상태로
        const nextState = typeof partial === "function" ? partial(state) : partial;

        // 두 값이 다른지 확인하여 변경 여부 확인
        if (!Object.is(prevState, nextState)) {
            state = nextState;
            // 상태가 실제로 바뀐 경우에만 구독자들에게 알림
            listeners.forEach((listener) => listener(state));
        }
    };

    /** 외부에서 상태/설정에 접근 가능한 최소 API */
    const api = { setState, getState, subscribe };

    /** 클로저 기반 초기 상태 객체 만들기: 외부에서 createState로 전략 주입 */
    state = createState(setState, getState, api);

    return { getState, setState, subscribe };
};
