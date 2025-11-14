fetch("https://httpstat.us/500")
  .then(res => {
    // if (!res.ok) {
    //   throw new Error(`http error: ${res.status}`);
    // }
    if (res.status === 401) {
      throw new Error(`권한 없음: ${res.status}`);
    }
    if (res.status === 500) {
      throw new Error(`서버 에러: ${res.status}`);
    }
    console.log(res.ok)
  })
  .catch(error => {
    console.error("에러 발생: ", error.message);  // 에러발생: http error: 500
  });