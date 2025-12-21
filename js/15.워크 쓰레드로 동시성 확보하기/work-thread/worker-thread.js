// 워커 스레드를 활용한 여러 이미지 처리
// 이미지 처리 중에도 UI가 반응함

let workerImages = [];
const workerImageList = document.getElementById('workerImageList');
const workerProgress = document.getElementById('workerProgress');
const workerStatus = document.getElementById('workerStatus');

// Web Worker 생성
const imageWorker = new Worker('image-worker.js');

// 처리 중인 이미지 추적
let processingQueue = [];
let processedCount = 0;
let totalToProcess = 0;

// 워커로부터 메시지 수신
imageWorker.onmessage = (e) => {
    const { type, imageData, processingTime, imageId } = e.data;

    if (type === 'result') {
        processedCount++;

        // 해당 이미지 찾아서 업데이트
        const img = workerImages.find(i => i.id === imageId);
        if (img) {
            img.current = imageData;

            // 결과를 이미지로 변환
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(imageData, 0, 0);
            img.url = canvas.toDataURL();

            // UI 업데이트
            const imgEl = document.getElementById(`worker-img-${img.id}`);
            if (imgEl) {
                imgEl.classList.remove('processing');
                imgEl.classList.add('completed');
            }
        }

        renderWorkerImages();

        // 진행 상황 업데이트
        workerStatus.textContent = `처리 중... ${processedCount}/${totalToProcess} (${processingTime.toFixed(2)}ms) - UI는 계속 반응합니다!`;

        // 모두 완료되었는지 확인
        if (processedCount >= totalToProcess) {
            workerStatus.textContent = `${totalToProcess}개 이미지 모두 완료! UI는 계속 반응했습니다!`;
            workerStatus.classList.remove('processing');
            processingQueue = [];
        }
    }
};

// 파일 업로드
document.getElementById('workerUpload').addEventListener('click', () => {
    document.getElementById('workerFileInput').click();
});

document.getElementById('workerFileInput').addEventListener('change', (e) => {
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

                workerImages.push(imageObj);
                renderWorkerImages();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    e.target.value = '';
});

// 이미지 렌더링
function renderWorkerImages() {
    workerImageList.innerHTML = '';
    workerImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.id = `worker-img-${img.id}`;

        const imgEl = document.createElement('img');
        imgEl.src = img.url;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
            workerImages.splice(index, 1);
            renderWorkerImages();
        };

        div.appendChild(imgEl);
        div.appendChild(removeBtn);
        workerImageList.appendChild(div);
    });

    workerProgress.textContent = `이미지 ${workerImages.length}개`;
}

// 모두 삭제
document.getElementById('workerResetBtn').addEventListener('click', () => {
    workerImages = [];
    renderWorkerImages();
    workerStatus.textContent = '모두 삭제됨';
});

// 전체 처리 (노이즈 제거 + 샤프닝 + 블러 순차 적용)
document.getElementById('workerAllFiltersBtn').addEventListener('click', () => {
    if (workerImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    workerStatus.textContent = `${workerImages.length}개 이미지 전체 처리 중... (노이즈+샤프닝+블러) (UI는 여전히 반응합니다!)`;
    workerStatus.classList.add('processing');

    processedCount = 0;
    totalToProcess = workerImages.length;

    // 모든 이미지를 워커에게 전송 (전체 필터 적용)
    workerImages.forEach((img) => {
        const imgEl = document.getElementById(`worker-img-${img.id}`);
        if (imgEl) imgEl.classList.add('processing');

        imageWorker.postMessage({
            type: 'allFilters',
            imageData: img.current,
            imageId: img.id
        });
    });
});

// 전체 노이즈 제거
document.getElementById('workerNoiseBtn').addEventListener('click', () => {
    if (workerImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    workerStatus.textContent = `${workerImages.length}개 이미지 노이즈 제거 중... (UI는 여전히 반응합니다!)`;
    workerStatus.classList.add('processing');

    processedCount = 0;
    totalToProcess = workerImages.length;

    // 모든 이미지를 워커에게 전송
    workerImages.forEach((img) => {
        const imgEl = document.getElementById(`worker-img-${img.id}`);
        if (imgEl) imgEl.classList.add('processing');

        imageWorker.postMessage({
            type: 'noiseReduction',
            imageData: img.current,
            imageId: img.id
        });
    });
});

// 전체 샤프닝
document.getElementById('workerSharpenBtn').addEventListener('click', () => {
    if (workerImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    workerStatus.textContent = `${workerImages.length}개 이미지 샤프닝 중... (UI는 여전히 반응합니다!)`;
    workerStatus.classList.add('processing');

    processedCount = 0;
    totalToProcess = workerImages.length;

    workerImages.forEach((img) => {
        const imgEl = document.getElementById(`worker-img-${img.id}`);
        if (imgEl) imgEl.classList.add('processing');

        imageWorker.postMessage({
            type: 'sharpen',
            imageData: img.current,
            imageId: img.id
        });
    });
});

// 전체 블러
document.getElementById('workerBlurBtn').addEventListener('click', () => {
    if (workerImages.length === 0) {
        alert('먼저 이미지를 업로드하세요!');
        return;
    }

    workerStatus.textContent = `${workerImages.length}개 이미지 블러 적용 중... (UI는 여전히 반응합니다!)`;
    workerStatus.classList.add('processing');

    processedCount = 0;
    totalToProcess = workerImages.length;

    workerImages.forEach((img) => {
        const imgEl = document.getElementById(`worker-img-${img.id}`);
        if (imgEl) imgEl.classList.add('processing');

        imageWorker.postMessage({
            type: 'blur',
            imageData: img.current,
            imageId: img.id
        });
    });
});
