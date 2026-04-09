export const debounce = (fn, delay = 400) => {
  let timer = null

  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
