const controller = new AbortController();
const signal = controller.signal;
console.log("##", controller)
fetch("https://jsonplaceholder.typicode.com/posts", { signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error:', err);
    }
  })

setTimeout(() => {
  controller.abort();
}, 100);