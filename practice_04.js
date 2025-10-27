const toggleBtn = document.querySelector('#toggleBtn');
const log = document.getElementById('log');

let intervalId = null;

toggleBtn?.addEventListener('click', () => {
    window.alert("clicked")
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    } else {
        intervalId = setInterval(() => {
            const currentTime = new Date().toLocaleTimeString();
            log.textContent += currentTime + '\n';
        })
    }
})