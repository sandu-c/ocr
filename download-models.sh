#!/bin/bash
# Download models from GitHub Releases to packages/models/assets/

set -e

VERSION=${1:-"v1.5.0"}
MODELS_DIR="packages/models/assets"
REPO="sandu-c/ocr"
BASE_URL="https://github.com/$REPO/releases/download/$VERSION"

echo "📥 Downloading OCR models from GitHub Releases ($VERSION)..."
echo ""

mkdir -p "$MODELS_DIR"

MODELS=(
  "PP-OCRv5_mobile_det_infer.onnx"
  "PP-OCRv5_mobile_rec_infer.onnx"
  "PP-OCRv5_server_det_infer.onnx"
  "PP-OCRv5_server_rec_infer.onnx"
  "ch_PP-OCRv4_det_infer.onnx"
  "ch_PP-OCRv4_rec_infer.onnx"
)

for model in "${MODELS[@]}"; do
  # Check if file exists and is larger than 1KB (not an LFS pointer)
  if [ -f "$MODELS_DIR/$model" ] && [ $(wc -c < "$MODELS_DIR/$model") -gt 1024 ]; then
    echo "  ✓ $model (already exists, skipping)"
  else
    echo "  ⬇ Downloading $model..."
    curl -L "$BASE_URL/$model" -o "$MODELS_DIR/$model"
    echo "  ✓ $model downloaded"
  fi
done

echo ""
echo "✅ All models downloaded to $MODELS_DIR"
