import express from 'express';
import cors from 'cors';
import storage from 'node-persist';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 8080;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// 미들웨어
app.use(cors());
app.use(express.json());

// node-persist 초기화
await storage.init({ dir: './.data' });

// 초기 데이터 설정
const initializeTodos = async () => {
  const existingTodos = await storage.getItem('todos');

  if (!existingTodos) {
    const initialTodos = [
      {
        id: 1,
        title: '리액트 공부하기',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Todo 앱 완성하기',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'API 서버 구축',
        completed: true,
        createdAt: new Date().toISOString()
      }
    ];

    await storage.setItem('todos', initialTodos);
    console.log('초기 Todo 데이터가 생성되었습니다.');
  }
};

// 시작 시 초기화
await initializeTodos();

// ============ JWT 미들웨어 ============

// 토큰 검증 미들웨어
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '토큰이 없습니다.'
    });
  }

  // "Bearer <token>" 형식에서 토큰만 추출
  const tokenWithoutBearer = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.',
      error: error.message
    });
  }
}

// ============ API 엔드포인트 ============

// POST /login - 로그인 (토큰 발급)
app.post('/login', (req, res) => {
  try {
    // 간단한 로그인 (id, pw 없이 바로 토큰 발급)
    const token = jwt.sign(
      {
        userId: 'user1',
        username: 'User',
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: '로그인 성공'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '로그인 실패',
      error: error.message
    });
  }
});

// POST /logout - 로그아웃 (클라이언트에서 토큰 삭제 후 호출 가능)
app.post('/logout', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: '로그아웃 되었습니다.'
  });
});

// GET /me - 현재 사용자 정보
app.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// GET /todos - 모든 todo 조회 (2초 지연)
app.get('/todos', verifyToken, async (req, res) => {
  try {
    // 의도적으로 2초 지연 (로딩 상태 테스트용)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const todos = await storage.getItem('todos');
    res.json({
      success: true,
      data: todos || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Todo 목록을 불러올 수 없습니다.',
      error: error.message
    });
  }
});

// POST /todos - 새로운 todo 추가
app.post('/todos', verifyToken, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title은 필수입니다.'
      });
    }

    const todos = await storage.getItem('todos') || [];
    const newTodo = {
      id: Math.max(...todos.map(t => t.id), 0) + 1,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await storage.setItem('todos', todos);

    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo가 추가되었습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Todo 추가에 실패했습니다.',
      error: error.message
    });
  }
});

// PATCH /todos/:id - todo 완료 여부 업데이트
app.patch('/todos/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const todos = await storage.getItem('todos') || [];
    const todo = todos.find(t => t.id === parseInt(id));

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo를 찾을 수 없습니다.'
      });
    }

    todo.completed = completed;
    await storage.setItem('todos', todos);

    res.json({
      success: true,
      data: todo,
      message: 'Todo가 업데이트되었습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Todo 업데이트에 실패했습니다.',
      error: error.message
    });
  }
});

// DELETE /todos/:id - todo 삭제 (의도적으로 500 에러 반환)
app.delete('/todos/:id', verifyToken, async (req, res) => {
  try {
    // 의도적으로 500 에러 반환 (에러 핸들링 테스트용)
    res.status(500).json({
      success: false,
      message: '서버 오류: Todo 삭제에 실패했습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Todo 삭제에 실패했습니다.',
      error: error.message
    });
  }
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API Server',
    endpoints: {
      login: 'POST /login',
      logout: 'POST /logout',
      getMe: 'GET /me',
      getTodos: 'GET /todos (require token)',
      addTodo: 'POST /todos (require token)',
      updateTodo: 'PATCH /todos/:id (require token)',
      deleteTodo: 'DELETE /todos/:id (require token)'
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Todo Server is running on http://localhost:${PORT}`);
});
