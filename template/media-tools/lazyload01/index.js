//  데이터 보관용 Map

// const srcMap = new Map();

// window.addEventListener("DOMContentLoaded", () => {
//     const images = document.querySelectorAll("img");
//     images.forEach((img) => {
//         // 각 이미지 요소 data-src 속성을 Map에 보관
//         srcMap.set(img, img.dataset.src);
//         // 로딩 지연 위한 요소의 속성 제거
//         console.log(img.dataset.src);
//         img.removeAttribute("src");
//     });
//     const btn = document.querySelector(".btn");
//     btn?.addEventListener("click", () => {
//         console.log(btn);
//         const imgs = document.querySelectorAll("img");
//         console.log(imgs);
//         imgs.forEach((img) => {
//             // Map에 보관한 값을 src 속성에 대입
//             const source = srcMap.get(img);
//             img.src = source;
//         });
//     });
// });

// lazyLoadImages({ selector, rootMargin, onLoad })
function lazyLoadImages({ selector = "img[data-src]", rootMargin = "200px", onLoad = (img) => {} } = {}) {
    const io = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(({ isIntersecting, target }) => {
                console.log(isIntersecting, target);
                if (!isIntersecting) return;
                const src = target.dataset.src;
                if (src) {
                    target.src = src;
                    onLoad(target);
                }
                observer.unobserve(target);
            });
        },
        { rootMargin }
    );
    document.querySelectorAll(selector).forEach((img) => io.observe(img));
    return io;
}

window.addEventListener("DOMContentLoaded", () => lazyLoadImages());
