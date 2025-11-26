// Debounce 함수: 일정 시간 지연 후에야 함수 실행을 허용
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}

// Throttle 함수: 주어진 시간 간격 내에 한 번만 함수 실행을 허용
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      // 실행 허용
      func.apply(this, args);
      inThrottle = true;  // 실행 후 제한 상태로 전환
      setTimeout(() => inThrottle = false, limit);  // 제한 시간 후에 다시 실행 허용
    }
  }
}