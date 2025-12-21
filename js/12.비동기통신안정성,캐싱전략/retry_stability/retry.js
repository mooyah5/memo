// 1st version with simple retry mechanism
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retryCnt = 5, delay = 1000) {
  for (let attempt = 0; attempt < retryCnt; attempt++) {
    try {
      const res = await fetch(url)
      return await res.json()
    } catch (error) {
      if (attempt === retryCnt) {
        throw error;
      }
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await wait(delay * 2 ** attempt);
    }
  }
}

fetchWithRetry('https://jsonpceholder.typicode.com/posts/1')
  .then(data => console.log(data))
  .catch(err => console.error(err))

// 2nd version with exponential backoff
async function fetchWithRetry2(url, options = {}, retries = 5, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2; // 지수 백오프
    }
  }
}
fetchWithRetry2('https://jsonpleholder.typicode.com/posts/1')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 3rd version with recursive approach

async function fetchWithJisooBackoff(url, options = {}, retries = 5, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
    await wait(delay);
    return fetchWithJisooBackoff(url, options, retries - 1, delay * 2);
  }
}

fetchWithJisooBackoff('https://jsonpleholder.typicode.com/posts/1')
  .then(data => console.log(data))
  .catch(err => console.error(err));