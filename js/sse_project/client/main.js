const API_URL = 'http://localhost:3000/api/chat';

/**
 * DOM 요소를 선택하는 헬퍼 함수
 * @param {string} selector - CSS 선택자
 * @returns {HTMLElement} DOM 요소
 */
const getElement = (selector) => {
  return document.querySelector(selector);
};

/**
 * 메시지 요소 생성
 * @param {string} role - 메시지 역할 (user/assistant)
 * @param {string} content - 메시지 내용
 * @returns {HTMLElement} 메시지 DOM 요소
 */
const createMessageElement = (role, content = '') => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = role === 'user' ? 'You' : 'Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;

  messageDiv.appendChild(labelDiv);
  messageDiv.appendChild(contentDiv);

  return messageDiv;
};

/**
 * 스트리밍 인디케이터 생성
 * @returns {HTMLElement} 인디케이터 DOM 요소
 */
const createStreamingIndicator = () => {
  const indicator = document.createElement('span');
  indicator.className = 'streaming-indicator';
  return indicator;
};

/**
 * 채팅 메시지 컨테이너를 스크롤 하단으로 이동
 * @param {HTMLElement} container - 메시지 컨테이너
 */
const scrollToBottom = (container) => {
  container.scrollTop = container.scrollHeight;
};

/**
 * 메시지 컨테이너에 메시지 추가
 * @param {HTMLElement} container - 메시지 컨테이너
 * @param {HTMLElement} messageElement - 추가할 메시지 요소
 */
const appendMessage = (container, messageElement) => {
  container.appendChild(messageElement);
  scrollToBottom(container);
};

/**
 * 환영 메시지 제거
 * @param {HTMLElement} container - 메시지 컨테이너
 */
const removeWelcomeMessage = (container) => {
  const welcomeMessage = container.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
};

/**
 * 에러 메시지 표시
 * @param {HTMLElement} container - 메시지 컨테이너
 * @param {string} message - 에러 메시지
 */
const showErrorMessage = (container, message) => {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = `Error: ${message}`;
  appendMessage(container, errorDiv);
};

/**
 * fetch API를 사용하여 SSE 스트림 처리
 * @param {string} userMessage - 사용자 입력 메시지
 * @param {HTMLElement} assistantMessageContent - 응답을 추가할 요소
 * @returns {Promise<void>}
 */
const handleStreamResponse = async (userMessage, assistantMessageContent) => {
  try {
    // fetch로 POST 요청 전송
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 스트림 리더 생성
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 스트림 데이터를 청크 단위로 읽기
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // 바이트 데이터를 텍스트로 디코딩
      buffer += decoder.decode(value, { stream: true });

      // SSE 이벤트 파싱 (data: 로 시작하는 라인)
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          // 스트림 종료 신호 확인
          if (data.done) {
            return;
          }

          // 응답 텍스트를 화면에 추가
          if (data.text) {
            assistantMessageContent.textContent +=
              (assistantMessageContent.textContent ? '\n' : '') + data.text;
            scrollToBottom(getElement('#chatMessages'));
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
};

/**
 * 채팅 전송 처리
 * @param {Event} event - 폼 제출 이벤트
 * @param {HTMLElement} messageInput - 입력 필드
 * @param {HTMLElement} sendButton - 전송 버튼
 * @param {HTMLElement} chatMessages - 메시지 컨테이너
 */
const handleChatSubmit = async (event, messageInput, sendButton, chatMessages) => {
  event.preventDefault();

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // 입력 필드 초기화 및 버튼 비활성화
  messageInput.value = '';
  sendButton.disabled = true;

  // 환영 메시지 제거
  removeWelcomeMessage(chatMessages);

  // 사용자 메시지 추가
  const userMessageElement = createMessageElement('user', userMessage);
  appendMessage(chatMessages, userMessageElement);

  // 어시스턴트 메시지 요소 생성 (빈 상태)
  const assistantMessageElement = createMessageElement('assistant');
  const assistantMessageContent = assistantMessageElement.querySelector('.message-content');
  const streamingIndicator = createStreamingIndicator();

  assistantMessageElement.querySelector('.message-label').appendChild(streamingIndicator);
  appendMessage(chatMessages, assistantMessageElement);

  try {
    // SSE 스트림 처리
    await handleStreamResponse(userMessage, assistantMessageContent);

    // 스트리밍 완료 후 인디케이터 제거
    streamingIndicator.remove();
  } catch (error) {
    streamingIndicator.remove();
    showErrorMessage(chatMessages, '응답을 가져오는 중 오류가 발생했습니다.');
  } finally {
    // 전송 버튼 재활성화
    sendButton.disabled = false;
    messageInput.focus();
  }
};

/**
 * 애플리케이션 초기화
 */
const initializeApp = () => {
  const chatForm = getElement('#chatForm');
  const messageInput = getElement('#messageInput');
  const sendButton = getElement('#sendButton');
  const chatMessages = getElement('#chatMessages');

  // 폼 제출 이벤트 리스너
  chatForm.addEventListener('submit', (event) => {
    handleChatSubmit(event, messageInput, sendButton, chatMessages);
  });

  // 초기 포커스
  messageInput.focus();
};

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', initializeApp);
