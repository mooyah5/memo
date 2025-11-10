
async function fetchData() {
    console.log('Fetching data...');
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.json();
        return data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}
// const data = await fetchData();
// console.log('Data from async function:', data);

console.log(1)
fetchData()
console.log(2)