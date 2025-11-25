import express from "express";
const app = express();
const PORT = 3000;

app.get("/stream", async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  // res.setHeader('Transfer-Encoding', 'chunked'); // Not necessary, set automatically by Express

  const lines = [
    "First line of the response.\n",
    "Second line of the response.\n",
    "Third line of the response.\n",
    "Fourth line of the response.\n",
    "Fifth line of the response.\n"
  ];

  for (const line of lines) {
    res.write(line);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  }

  res.end();
})

app.use(express.static('./public'));
app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});