# OCR Models Guide

## Available Models

### PP-OCRv5 (Recommended)

**Server Models** - Best accuracy for desktop/server deployment:
- `PP-OCRv5_server_det_infer.onnx` (84M) - Detection: 83.8% accuracy
- `PP-OCRv5_server_rec_infer.onnx` (81M) - Recognition
- `ppocr_keys_v5.txt` (72K) - Dictionary

**Mobile Models** - Best for web/mobile deployment:
- `PP-OCRv5_mobile_det_infer.onnx` (4.6M) - Detection: 79.0% accuracy
- `PP-OCRv5_mobile_rec_infer.onnx` (16M) - Recognition
- `ppocr_keys_v1.txt` (26K) - Dictionary

### PP-OCRv4 (Legacy)

- `ch_PP-OCRv4_det_infer.onnx` (4.5M) - Detection: 63.8% accuracy
- `ch_PP-OCRv4_rec_infer.onnx` (10M) - Recognition
- `ppocr_keys_v1.txt` (26K) - Dictionary

## Model Selection Guide

| Use Case | Recommended Model | Reason |
|----------|------------------|---------|
| Browser/Mobile Apps | `v5_mobile` | Small size (20M), fast, 79% accuracy |
| Desktop/Server | `v5_server` | Best accuracy (83.8%), size not critical |
| Legacy Support | `v4` | Backward compatibility only |

## Performance Comparison

| Model | Accuracy | Size | CPU Speed | GPU Speed |
|-------|----------|------|-----------|-----------|
| v5_server | 83.8% | 165M | 383ms | 90ms |
| v5_mobile | 79.0% | 20M | 58ms | 11ms |
| v4_mobile | 63.8% | 14M | 57ms | 10ms |
| v4_server | 69.2% | 119M | 586ms | 128ms |

**Key Insights:**
- v5_mobile is 15% more accurate than v4_mobile with same speed
- v5_mobile is 10% more accurate than v4_server while being 6x smaller and 10x faster
- v5_server is the most accurate but 8x larger and 6x slower than v5_mobile

## Usage

```typescript
// Browser - Auto-detect (tries v5, v5_mobile, then v4)
const ocr = await Ocr.create({ modelVersion: 'auto' })

// Browser - Explicit mobile models
const ocr = await Ocr.create({ modelVersion: 'v5_mobile' })

// Browser - Explicit server models
const ocr = await Ocr.create({ modelVersion: 'v5' })

// Vite Plugin
import { ocrVitePlugin } from '@sanduc/ocr-browser'

export default {
  plugins: [
    ocrVitePlugin({ 
      modelVersion: 'v5_mobile' // or 'v5', 'v4', 'auto'
    })
  ]
}
```

## Converting New Models

If you need to convert new PaddleOCR models to ONNX format:

### Prerequisites

```bash
python3 -m venv venv
source venv/bin/activate
pip install paddlepaddle paddlex
paddlex --install paddle2onnx
```

### Download and Convert

```bash
# Download models from PaddleOCR
wget https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv5_mobile_det_infer.tar
tar -xf PP-OCRv5_mobile_det_infer.tar

# Convert to ONNX using PaddleX
paddlex --paddle2onnx \
  --paddle_model_dir PP-OCRv5_mobile_det_infer \
  --onnx_model_dir packages/models/assets

# Rename output
mv packages/models/assets/inference.onnx packages/models/assets/PP-OCRv5_mobile_det_infer.onnx
```

### Automated Script

See `docs/scripts/download_v5_mobile_models.py` for a complete example.

## Model Sources

- **Official PaddleOCR Models**: https://www.paddleocr.ai/main/en/version3.x/module_usage/text_detection.html
- **Model Download URLs**: https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/

## Notes

- **Paddle 3.0 Format**: v5 models use JSON format (`inference.json`) instead of binary `.pdmodel` files
- **Conversion Tool**: Must use PaddleX's paddle2onnx plugin (v2.0.2rc3), not standalone paddle2onnx (v2.1.0)
- **Dictionary Files**: v5_server uses `ppocr_keys_v5.txt`, v5_mobile and v4 use `ppocr_keys_v1.txt`
- **Parameters**: Both v5_server and v5_mobile use identical parameters (thresh: 0.3, box_thresh: 0.6, unclip_ratio: 1.5)
