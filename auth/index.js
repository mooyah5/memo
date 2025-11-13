import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Auth Index!");
})

// express().use: 미들웨어. express에 쓸 수 있는 모듈들을 등록
app.use(express.json());  // 응답을 json으로 파싱
app.use(cookieParser());  // 쿠키를 파싱
app.use(express.static("public")); // 정적 파일 제공

const sessionStore = {};

// 로그인
app.post("/login", (req, res) => {
  const sessionId = uuidv4();
  const user = {
    user: req.body.username,
    password: req.body.password,
    createdAt: new Date()
  }
  sessionStore[sessionId] = user
  res.cookie("sessionId", sessionId, {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true
  });
  res.json({ message: "Login successful", sessionId, user });
})

app.get("/profile", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = sessionStore[sessionId];

  if (!session) res.status(401).json({ message: "Unauthorized" });
  else res.json({ message: "Profile data", session });
})

app.listen(3000, () => {
  console.log("Auth server running on http://localhost:3000");
});

