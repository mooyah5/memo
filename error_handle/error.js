try {
  const data = JSON.parse('{"key" : "value"');
  console.log('데이터: ', data);

  throw new Error("강제 에러 발생");
} catch (error) {
  console.error("에러: ", error.message);
}