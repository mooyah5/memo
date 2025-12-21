// Web Worker - 백그라운드에서 이미지 처리 수행
// 메인 스레드와 분리되어 있어 UI 블로킹이 발생하지 않음

self.onmessage = (e) => {
    const { type, imageData, imageId } = e.data;
    const startTime = performance.now();

    let result;

    switch (type) {
        case 'noiseReduction':
            result = applyNoiseReduction(imageData);
            break;
        case 'sharpen':
            result = applySharpen(imageData);
            break;
        case 'blur':
            result = applyBlur(imageData);
            break;
        case 'allFilters':
            // 노이즈 제거 + 샤프닝 + 블러를 순차적으로 적용
            result = applyNoiseReduction(imageData);
            result = applySharpen(result);
            result = applyBlur(result);
            break;
        default:
            return;
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // 메인 스레드에 결과 전송
    self.postMessage({
        type: 'result',
        imageData: result,
        processingTime: processingTime,
        imageId: imageId
    });
};

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
