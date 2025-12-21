import fs from "fs";
import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const app = express()
const port = 3000;

// test
app.get("/", (req, res) => {
  res.send("Hello World!");
})

// 업로드 디렉토리 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {  // 파일이 존재하는지 확인
  fs.mkdirSync(uploadDir, { recursive: true });  // 디렉토리 생성. recursive: true 옵션은 중간 디렉토리도 생성
}

// Multer (multipart/form-data를 처리(파싱)하는 미들웨어)
const upload = multer({ dest: uploadDir })

// 이미지 업로드 API
app.post("/upload", upload.single("image"), (req, res) => {
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  const fileName = req.file.originalname;
  res.json({ fileUrl, fileName });
})

// 업로드된 파일 제공
app.use("/uploads", express.static(uploadDir));
app.use(express.static('public'));

app.listen(port, () => {
  console.log("Example app listening on port", port)
})