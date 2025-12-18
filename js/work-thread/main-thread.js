// 메인 스레드에서 여러 이미지를 순차적으로 처리
// 모든 이미지 처리 중에는 UI가 완전히 블로킹됨

let mainImages = [];
const mainImageList = document.getElementById('mainImageList');
const mainProgress = document.getElementById('mainProgress');
const mainStatus = document.getElementById('mainStatus');

// 파일 업로드
document.getElementById('mainUpload').addEventListener('click', () => {
    document.getElementById('mainFileInput').click();
});

document.getElementById('mainFileInput').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // 캔버스에 그려서 ImageData 추출
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // 이미지 저장
                const imageObj = {
                    id: Date.now() + Math.random(),
                    original: imageData,
                    current: imageData,
                    url: event.target.result,
                    width: img.width,
                    height: img.height
                };

                mainImages.push(imageObj);
                renderMainImages();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    e.target.value = '';
});

// 이미지 렌더링
function renderMainImages() {
    mainImageList.innerHTML = '';
    mainImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.id = `main-img-${img.id}`;

        const imgEl = document.createElement('img');
        imgEl.src = img.url;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
            mainImages.splice(index, 1);
            renderMainImages();
        };

        div.appendChild(imgEl);
        div.appendChild(removeBtn);
        mainImageList.appendChild(div);
    });

    mainProgress.textContent = `이미지 ${mainImages.length}개`;
}

// 모두 삭제
document.getElementById('mainResetBtn').addEventListener('click', () => {
    mainImages = [];
    renderMainImages();
    mainStatus.textContent = '모두 삭제됨';
});

// 전체 처리 (노이즈 제거 + 샤프닝 + 블러 순차 적용)
document.getElementById('mainAllFiltersBtn').addEventListener('click', () => {
    if (mainImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    mainStatus.textContent = `${mainImages.length}개 이미지 전체 처리 중... (노이즈+샤프닝+블러) (UI가 완전히 멈춥니다!)`;
    mainStatus.classList.add('processing');

    setTimeout(() => {
        const startTime = performance.now();

        mainImages.forEach((img, index) => {
            const imgEl = document.getElementById(`main-img-${img.id}`);
            if (imgEl) imgEl.classList.add('processing');

            // 1. 노이즈 제거
            let result = applyNoiseReduction(img.current);

            // 2. 샤프닝
            result = applySharpen(result);

            // 3. 블러
            result = applyBlur(result);

            img.current = result;

            // 결과를 이미지로 변환
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(result, 0, 0);
            img.url = canvas.toDataURL();

            if (imgEl) {
                imgEl.classList.remove('processing');
                imgEl.classList.add('completed');
            }
        });

        renderMainImages();

        const endTime = performance.now();
        mainStatus.textContent = `${mainImages.length}개 이미지 전체 처리 완료 (${(endTime - startTime).toFixed(2)}ms)`;
        mainStatus.classList.remove('processing');
    }, 50);
});

// 전체 노이즈 제거
document.getElementById('mainNoiseBtn').addEventListener('click', () => {
    if (mainImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    mainStatus.textContent = `${mainImages.length}개 이미지 노이즈 제거 중... (UI가 완전히 멈춥니다!)`;
    mainStatus.classList.add('processing');

    // 메인 스레드에서 모든 이미지를 순차 처리 - UI 블로킹 발생
    setTimeout(() => {
        const startTime = performance.now();

        mainImages.forEach((img, index) => {
            const imgEl = document.getElementById(`main-img-${img.id}`);
            if (imgEl) imgEl.classList.add('processing');

            const result = applyNoiseReduction(img.current);
            img.current = result;

            // 결과를 이미지로 변환
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(result, 0, 0);
            img.url = canvas.toDataURL();

            if (imgEl) {
                imgEl.classList.remove('processing');
                imgEl.classList.add('completed');
            }
        });

        renderMainImages();

        const endTime = performance.now();
        mainStatus.textContent = `${mainImages.length}개 이미지 노이즈 제거 완료 (${(endTime - startTime).toFixed(2)}ms)`;
        mainStatus.classList.remove('processing');
    }, 50);
});

// 전체 샤프닝
document.getElementById('mainSharpenBtn').addEventListener('click', () => {
    if (mainImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    mainStatus.textContent = `${mainImages.length}개 이미지 샤프닝 중... (UI가 완전히 멈춥니다!)`;
    mainStatus.classList.add('processing');

    setTimeout(() => {
        const startTime = performance.now();

        mainImages.forEach((img, index) => {
            const imgEl = document.getElementById(`main-img-${img.id}`);
            if (imgEl) imgEl.classList.add('processing');

            const result = applySharpen(img.current);
            img.current = result;

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(result, 0, 0);
            img.url = canvas.toDataURL();

            if (imgEl) {
                imgEl.classList.remove('processing');
                imgEl.classList.add('completed');
            }
        });

        renderMainImages();

        const endTime = performance.now();
        mainStatus.textContent = `${mainImages.length}개 이미지 샤프닝 완료 (${(endTime - startTime).toFixed(2)}ms)`;
        mainStatus.classList.remove('processing');
    }, 50);
});

// 전체 블러
document.getElementById('mainBlurBtn').addEventListener('click', () => {
    if (mainImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    mainStatus.textContent = `${mainImages.length}개 이미지 블러 적용 중... (UI가 완전히 멈춥니다!)`;
    mainStatus.classList.add('processing');

    setTimeout(() => {
        const startTime = performance.now();

        mainImages.forEach((img, index) => {
            const imgEl = document.getElementById(`main-img-${img.id}`);
            if (imgEl) imgEl.classList.add('processing');

            const result = applyBlur(img.current);
            img.current = result;

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(result, 0, 0);
            img.url = canvas.toDataURL();

            if (imgEl) {
                imgEl.classList.remove('processing');
                imgEl.classList.add('completed');
            }
        });

        renderMainImages();

        const endTime = performance.now();
        mainStatus.textContent = `${mainImages.length}개 이미지 블러 완료 (${(endTime - startTime).toFixed(2)}ms)`;
        mainStatus.classList.remove('processing');
    }, 50);
});

// 이미지 처리 함수들

// 노이즈 제거 (미디언 필터)
function applyNoiseReduction(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result = new ImageData(width, height);
    const resultData = result.data;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                const values = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const idx = ((y + dy) * width + (x + dx)) * 4 + c;
                        values.push(data[idx]);
                    }
                }
                values.sort((a, b) => a - b);
                const median = values[4];
                const idx = (y * width + x) * 4 + c;
                resultData[idx] = median;
            }
            const idx = (y * width + x) * 4 + 3;
            resultData[idx] = 255;
        }
    }

    return result;
}

// 샤프닝 (엣지 강조)
function applySharpen(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result = new ImageData(width, height);
    const resultData = result.data;

    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                        const kernelIdx = (ky + 1) * 3 + (kx + 1);
                        sum += data[idx] * kernel[kernelIdx];
                    }
                }
                const idx = (y * width + x) * 4 + c;
                resultData[idx] = Math.min(255, Math.max(0, sum));
            }
            const idx = (y * width + x) * 4 + 3;
            resultData[idx] = 255;
        }
    }

    return result;
}

// 블러 (가우시안 블러)
function applyBlur(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result = new ImageData(width, height);
    const resultData = result.data;

    const kernel = [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ];
    const kernelSum = 16;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                        const kernelIdx = (ky + 1) * 3 + (kx + 1);
                        sum += data[idx] * kernel[kernelIdx];
                    }
                }
                const idx = (y * width + x) * 4 + c;
                resultData[idx] = sum / kernelSum;
            }
            const idx = (y * width + x) * 4 + 3;
            resultData[idx] = 255;
        }
    }

    return result;
}
