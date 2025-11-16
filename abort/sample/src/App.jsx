import "./App.css";
import { useState, useRef } from "react";

function App() {
  const [post, setPost] = useState(null);
  const controllerRef = useRef(null);

  const loadPost = (id) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    const signal = controller.signal;
    controllerRef.current = controller;
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { signal })
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <>
      <button onClick={() => loadPost(1)}>post 1</button>
      <button onClick={() => loadPost(2)}>post 2</button>
      <br />
      {post && <div>{post.title}</div>}
    </>
  );
}

export default App;
