import Ocr, { registerBackend, type ModelCreateOptions } from '@sanduc/ocr-common'
import { splitIntoLineImages } from '@sanduc/ocr-common/splitIntoLineImages'
import { InferenceSession } from 'onnxruntime-web'
import { FileUtils } from './FileUtils'
import { ImageRaw } from './ImageRaw'

// Model configurations - explicit filenames
const MODEL_CONFIGS = {
  v5: {
    detectionPath: 'PP-OCRv5_server_det_infer.onnx',
    recognitionPath: 'PP-OCRv5_server_rec_infer.onnx',
    dictionaryPath: 'ppocr_keys_v5.txt',
  },
  v5_mobile: {
    detectionPath: 'PP-OCRv5_mobile_det_infer.onnx',
    recognitionPath: 'PP-OCRv5_mobile_rec_infer.onnx',
    dictionaryPath: 'ppocr_keys_v5.txt',
  },
  v4: {
    detectionPath: 'ch_PP-OCRv4_det_infer.onnx',
    recognitionPath: 'ch_PP-OCRv4_rec_infer.onnx',
    dictionaryPath: 'ppocr_keys_v1.txt',
  },
}

// Auto-detect available models by trying each version
async function detectModels(basePath: string, cacheVersion?: string): Promise<{ detectionPath: string; recognitionPath: string; dictionaryPath: string } | null> {
  const buildPath = (filename: string) => {
    const path = `${basePath}${filename}`
    return cacheVersion ? `${path}?v=${cacheVersion}` : path
  }

  // Try v5, v5_mobile, then v4
  for (const config of [MODEL_CONFIGS.v5, MODEL_CONFIGS.v5_mobile, MODEL_CONFIGS.v4]) {
    try {
      const detPath = buildPath(config.detectionPath)
      const response = await fetch(detPath, { method: 'HEAD' })
      if (response.ok) {
        return {
          detectionPath: detPath,
          recognitionPath: buildPath(config.recognitionPath),
          dictionaryPath: buildPath(config.dictionaryPath),
        }
      }
    } catch {
      // Try next version
    }
  }

  return null
}

// Wrap Ocr.create to add auto-detection
const originalCreate = Ocr.create.bind(Ocr)

Ocr.create = async function(options: ModelCreateOptions = {}) {
  // If models explicitly provided, use them
  if (options.models?.detectionPath && options.models?.recognitionPath && options.models?.dictionaryPath) {
    return originalCreate(options)
  }

  const basePath = options.modelsBasePath || '/models/'
  const cacheVersion = options.cacheVersion

  const buildPath = (filename: string) => {
    const path = `${basePath}${filename}`
    return cacheVersion ? `${path}?v=${cacheVersion}` : path
  }

  // 1. Try manifest.json first (for obfuscated builds)
  try {
    const manifestUrl = buildPath('manifest.json')
    const response = await fetch(manifestUrl)
    if (response.ok) {
      const manifest = await response.json()
      return originalCreate({
        ...options,
        models: {
          detectionPath: buildPath(manifest.detection),
          recognitionPath: buildPath(manifest.recognition),
          dictionaryPath: buildPath(manifest.dictionary),
        },
      })
    }
  } catch {
    // Fallback to auto-detect
  }

  // 2. Auto-detect models (dev/prod without obfuscation)
  const version = options.modelVersion || 'auto'
  let models: { detectionPath: string; recognitionPath: string; dictionaryPath: string } | null = null

  if (version === 'auto') {
    models = await detectModels(basePath, cacheVersion)
  } else {
    // Specific version requested
    const config = MODEL_CONFIGS[version]
    models = {
      detectionPath: buildPath(config.detectionPath),
      recognitionPath: buildPath(config.recognitionPath),
      dictionaryPath: buildPath(config.dictionaryPath),
    }
  }

  if (!models) {
    throw new Error(`No OCR models found at ${basePath}. Ensure models are copied to this directory.`)
  }

  return originalCreate({ ...options, models })
}

registerBackend({ FileUtils, ImageRaw, InferenceSession, splitIntoLineImages, defaultModels: undefined })

export * from '@sanduc/ocr-common'
export default Ocr
