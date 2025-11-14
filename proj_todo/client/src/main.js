// DOM 요소
const loginSection = document.getElementById('login-section');
const todoSection = document.getElementById('todo-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const simpleLoginBtn = document.getElementById('simple-login-btn');
const userInfo = document.getElementById('user-info');

const todoList = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');

const API_URL = 'http://localhost:8080';
const TOKEN_KEY = 'authToken';

// 토큰 관리
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// 토큰 존재 여부 확인
function isLoggedIn() {
  return !!getToken();
}

// UI 표시 전환
function showLoginSection() {
  loginSection.classList.add('active');
  todoSection.classList.remove('active');
  loginBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
  userInfo.textContent = '';
}

function showTodoSection() {
  loginSection.classList.remove('active');
  todoSection.classList.add('active');
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  userInfo.textContent = '로그인됨';
}

// 로그인
async function login() {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST'
    });

    const result = await response.json();

    if (result.success && result.token) {
      setToken(result.token);
      showTodoSection();
      errorMessage.style.display = 'none';
      await fetchTodos();
    } else {
      errorMessage.textContent = `로그인 실패: ${result.message}`;
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = `오류: ${error.message}`;
    errorMessage.style.display = 'block';
    console.error('Error logging in:', error);
  }
}

// 로그아웃
async function logout() {
  try {
    const token = getToken();
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    removeToken();
    showLoginSection();
    errorMessage.style.display = 'none';
    todoList.innerHTML = '';
  }
}

// Todo 목록 가져오기
async function fetchTodos() {
  try {
    const token = getToken();

    if (!token) {
      showLoginSection();
      return;
    }

    // 로딩 표시
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    todoList.innerHTML = '';

    const response = await fetch(`${API_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      removeToken();
      showLoginSection();
      return;
    }

    const result = await response.json();
    loading.style.display = 'none';

    if (result.success && result.data && result.data.length > 0) {
      renderTodos(result.data);
    } else {
      todoList.innerHTML = '<div class="empty-state"><p>todo가 없습니다.</p></div>';
    }
  } catch (error) {
    loading.style.display = 'none';
    errorMessage.textContent = `오류: ${error.message}`;
    errorMessage.style.display = 'block';
    console.error('Error fetching todos:', error);
  }
}

// Todo 렌더링
function renderTodos(todos) {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const date = new Date(todo.createdAt).toLocaleDateString('ko-KR');

    todoItem.innerHTML = `
      <div class="todo-content">
        <p class="todo-text">${todo.title}</p>
        <span class="todo-date">${date}</span>
      </div>
      <div class="todo-actions">
        <button class="btn btn-check" data-id="${todo.id}">✓</button>
        <button class="btn btn-danger" data-id="${todo.id}">삭제</button>
      </div>
    `;

    todoList.appendChild(todoItem);
  });

  // 이벤트 리스너 추가
  attachEventListeners();
}

// 새로운 Todo 추가
async function addTodo() {
  const title = todoInput.value.trim();

  if (!title) {
    alert('todo를 입력하세요.');
    return;
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    if (response.status === 401) {
      removeToken();
      showLoginSection();
      return;
    }

    const result = await response.json();

    if (result.success) {
      todoInput.value = '';
      errorMessage.style.display = 'none';
      await fetchTodos();
    } else {
      errorMessage.textContent = `오류: ${result.message}`;
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = `오류: ${error.message}`;
    errorMessage.style.display = 'block';
    console.error('Error adding todo:', error);
  }
}

// Todo 완료 상태 토글
async function toggleTodo(id, currentTodos) {
  const todo = currentTodos.find(t => t.id === id);
  if (!todo) return;

  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !todo.completed })
    });

    if (response.status === 401) {
      removeToken();
      showLoginSection();
      return;
    }

    const result = await response.json();

    if (result.success) {
      errorMessage.style.display = 'none';
      await fetchTodos();
    } else {
      errorMessage.textContent = `오류: ${result.message}`;
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = `오류: ${error.message}`;
    errorMessage.style.display = 'block';
    console.error('Error updating todo:', error);
  }
}

// Todo 삭제
async function deleteTodo(id) {
  if (!confirm('정말 삭제하시겠습니까?')) {
    return;
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      removeToken();
      showLoginSection();
      return;
    }

    const result = await response.json();

    if (result.success) {
      errorMessage.style.display = 'none';
      await fetchTodos();
    } else {
      errorMessage.textContent = `오류: ${result.message}`;
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = `오류: ${error.message}`;
    errorMessage.style.display = 'block';
    console.error('Error deleting todo:', error);
  }
}

// 현재 todos 데이터 가져오기
async function getCurrentTodos() {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      removeToken();
      showLoginSection();
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting current todos:', error);
    return [];
  }
}

// 이벤트 리스너 연결
function attachEventListeners() {
  // 완료 버튼
  document.querySelectorAll('.btn-check').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = parseInt(e.target.dataset.id);
      const currentTodos = await getCurrentTodos();
      await toggleTodo(id, currentTodos);
    });
  });

  // 삭제 버튼
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      deleteTodo(id);
    });
  });
}

// 로그인/로그아웃 버튼 이벤트
simpleLoginBtn.addEventListener('click', login);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);

// 추가 버튼 이벤트
addTodoBtn.addEventListener('click', addTodo);

// 엔터 키로도 추가
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// 초기 상태 확인
if (isLoggedIn()) {
  showTodoSection();
  fetchTodos();
} else {
  showLoginSection();
}

