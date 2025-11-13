// 기타 Promise 함수들
// Promise.all(): 모두 완료된 결과 확인. / 모든 req가 성공해야 함. (하나라도 실패 시 전체가 reject).
// Promise.allSettled(): 모두 완료된 결과 확인. / 성공/실패 상관없이 끝날 때까지 기다림. 모두 실패해도 reject되지 않음.
// Promise.race(): 가장 빨리 완료된 결과 확인. / 가장 빨리 완료된 req의 res만 처리.
// Promise.any(): 가장 빨리 성공한 결과 확인. / 가장 빨리 성공한 req의 res만 처리. 모두 실패 시에만 reject됨.