import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET_KEY = 'your_secret_key';

app.use(express.json());
app.use(express.static('public'));

app.post("/get-token", (req, res) => {
  const { username, password } = req.body;
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  if (username === "admin" && password === "password") {
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
})

app.get("/profile", (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, SECRET_KEY);
  const username = decodedToken.username;
  if (decodedToken) {
    res.json({ message: username, token: decodedToken });
  } {
    res.status(403).json({ error: "Forbidden" });
  }
})

app.listen(3000, () => {
  console.log('Auth token service running on port 3000');
});
