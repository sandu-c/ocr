#!/usr/bin/env python3
"""Download PP-OCRv5 mobile models (already in inference format)"""

import os
import urllib.request
import tarfile
import shutil

# Target directory
models_dir = "packages/models/assets"
os.makedirs(models_dir, exist_ok=True)

print("📥 Downloading PP-OCRv5 mobile models...")

# Download mobile detection model
print("\n1. Downloading mobile detection model...")
det_url = "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv5_mobile_det_infer.tar"
det_tar = "temp_det.tar"
urllib.request.urlretrieve(det_url, det_tar)
print("   ✓ Downloaded")

print("   Extracting...")
with tarfile.open(det_tar, 'r') as tar:
    tar.extractall()
os.remove(det_tar)
print("   ✓ Extracted")

# Download mobile recognition model
print("\n2. Downloading mobile recognition model...")
rec_url = "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv5_mobile_rec_infer.tar"
rec_tar = "temp_rec.tar"
urllib.request.urlretrieve(rec_url, rec_tar)
print("   ✓ Downloaded")

print("   Extracting...")
with tarfile.open(rec_tar, 'r') as tar:
    tar.extractall()
os.remove(rec_tar)
print("   ✓ Extracted")

# These are Paddle inference models, we need to convert to ONNX
print("\n🔄 Converting models to ONNX format...")

det_model_dir = "PP-OCRv5_mobile_det_infer"
rec_model_dir = "PP-OCRv5_mobile_rec_infer"

print("\n3. Converting detection model...")
import subprocess
subprocess.run([
    "paddle2onnx",
    "--model_dir", det_model_dir,
    "--model_filename", "inference.pdmodel",
    "--params_filename", "inference.pdiparams",
    "--save_file", f"{models_dir}/PP-OCRv5_mobile_det_infer.onnx",
    "--opset_version", "11"
], check=True)
print("   ✓ Converted")

print("\n4. Converting recognition model...")
subprocess.run([
    "paddle2onnx",
    "--model_dir", rec_model_dir,
    "--model_filename", "inference.pdmodel",
    "--params_filename", "inference.pdiparams",
    "--save_file", f"{models_dir}/PP-OCRv5_mobile_rec_infer.onnx",
    "--opset_version", "11"
], check=True)
print("   ✓ Converted")

# Copy dictionary
print("\n5. Copying dictionary...")
dict_file = f"{rec_model_dir}/ppocr_keys_v1.txt"
if os.path.exists(dict_file):
    shutil.copy(dict_file, f"{models_dir}/ppocr_keys_v1.txt")
    print("   ✓ Copied")
else:
    print("   ⚠ Dictionary not found in model, downloading separately...")
    dict_url = "https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/main/ppocr/utils/ppocr_keys_v1.txt"
    urllib.request.urlretrieve(dict_url, f"{models_dir}/ppocr_keys_v1.txt")
    print("   ✓ Downloaded")

# Cleanup
print("\n🧹 Cleaning up...")
shutil.rmtree(det_model_dir)
shutil.rmtree(rec_model_dir)

print("\n✅ Download and conversion complete!")
print(f"\nModels saved to: {os.path.abspath(models_dir)}")
print("\nFiles created:")
print(f"  - PP-OCRv5_mobile_det_infer.onnx")
print(f"  - PP-OCRv5_mobile_rec_infer.onnx")
print(f"  - ppocr_keys_v1.txt")

# Convert to ONNX
print("\n🔄 Converting models to ONNX format...")

print("\n4. Converting detection model...")
subprocess.run([
    "paddle2onnx",
    "--model_dir", det_model_dir,
    "--model_filename", "inference.pdmodel",
    "--params_filename", "inference.pdiparams",
    "--save_file", f"{models_dir}/PP-OCRv5_mobile_det_infer.onnx",
    "--opset_version", "11"
], check=True)
print("   ✓ Converted detection model")

print("\n5. Converting recognition model...")
subprocess.run([
    "paddle2onnx",
    "--model_dir", rec_model_dir,
    "--model_filename", "inference.pdmodel",
    "--params_filename", "inference.pdiparams",
    "--save_file", f"{models_dir}/PP-OCRv5_mobile_rec_infer.onnx",
    "--opset_version", "11"
], check=True)
print("   ✓ Converted recognition model")

# Cleanup
print("\n🧹 Cleaning up temporary files...")
import shutil
shutil.rmtree(det_model_dir)
shutil.rmtree(rec_model_dir)

print("\n✅ Download and conversion complete!")
print(f"\nModels saved to: {os.path.abspath(models_dir)}")
print("\nFiles created:")
print(f"  - PP-OCRv5_mobile_det_infer.onnx")
print(f"  - PP-OCRv5_mobile_rec_infer.onnx")
print(f"  - ppocr_keys_v5.txt")
