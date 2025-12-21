async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch error: ' + res.statusText);
  const data = await res.json()
  console.log('Data:', data);
  return data
}

fetchData('https://jsonplaceholder.typicode.com/posts/1')