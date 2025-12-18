import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * 고정된 응답 데이터 (10줄의 문장)
 * @type {string[]}
 */
const RESPONSE_SENTENCES = [
  '안녕하세요! 오늘 어떤 도움이 필요하신가요?',
  '저는 여러분의 질문에 답변하기 위해 여기 있습니다.',
  '스트리밍 방식으로 응답을 전달하고 있습니다.',
  '각 문장은 1초 간격으로 전송됩니다.',
  '이 방식은 실시간 대화 경험을 제공합니다.',
  'Server-Sent Events를 활용한 구현입니다.',
  '서버에서 클라이언트로 단방향 통신이 가능합니다.',
  '효율적이고 간단한 스트리밍 솔루션입니다.',
  '웹 애플리케이션에서 유용하게 사용할 수 있습니다.',
  '감사합니다. 더 궁금한 점이 있으시면 언제든 물어보세요!'
];

/**
 * SSE 이벤트 메시지 포맷 생성
 * @param {string} data - 전송할 데이터
 * @returns {string} SSE 포맷 문자열
 */
const createSSEMessage = (data) => {
  return `data: ${JSON.stringify(data)}\n\n`;
};

/**
 * 지연 실행을 위한 Promise 기반 타이머
 * @param {number} ms - 지연 시간(밀리초)
 * @returns {Promise<void>}
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 문장을 순차적으로 스트리밍하는 함수
 * @param {Response} res - Express 응답 객체
 * @param {string[]} sentences - 전송할 문장 배열
 * @returns {Promise<void>}
 */
const streamSentences = async (res, sentences) => {
  // 각 문장을 1초 간격으로 스트리밍
  for (const sentence of sentences) {
    res.write(createSSEMessage({ text: sentence }));
    await delay(1000);
  }

  // 스트림 종료 신호 전송
  res.write(createSSEMessage({ done: true }));
  res.end();
};

/**
 * SSE 엔드포인트 - 스트리밍 응답 제공
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 */
app.post('/api/chat', async (req, res) => {
  // SSE 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 클라이언트 연결 유지
  res.flushHeaders();

  try {
    await streamSentences(res, RESPONSE_SENTENCES);
  } catch (error) {
    console.error('Streaming error:', error);
    res.end();
  }
});

/**
 * 서버 시작
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
