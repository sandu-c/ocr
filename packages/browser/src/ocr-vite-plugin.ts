import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { PluginOption } from 'vite'

interface OcrVitePluginOptions {
  enableObfuscation?: boolean
  modelsPath?: string // Default: 'models/'
  modelVersion?: 'v4' | 'v5' | 'v5_mobile' | 'auto' // Default: 'v5'
}

// Explicit model filenames
const MODEL_FILES = {
  v5: {
    detection: 'PP-OCRv5_server_det_infer.onnx',
    recognition: 'PP-OCRv5_server_rec_infer.onnx',
    dictionary: 'ppocr_keys_v5.txt',
  },
  v5_mobile: {
    detection: 'PP-OCRv5_mobile_det_infer.onnx',
    recognition: 'PP-OCRv5_mobile_rec_infer.onnx',
    dictionary: 'ppocr_keys_v5.txt',
  },
  v4: {
    detection: 'ch_PP-OCRv4_det_infer.onnx',
    recognition: 'ch_PP-OCRv4_rec_infer.onnx',
    dictionary: 'ppocr_keys_v1.txt',
  },
}

export function ocrVitePlugin(options: OcrVitePluginOptions = {}): PluginOption[] {
  const {
    enableObfuscation = false,
    modelsPath = 'models/',
    modelVersion = 'v5',
  } = options

  const plugins: PluginOption[] = []
  const modelsSourcePath = 'node_modules/@sanduc/ocr-models/assets'

  // If auto, copy all models without obfuscation
  if (modelVersion === 'auto') {
    plugins.push(
      viteStaticCopy({
        targets: [
          {
            src: resolve(modelsSourcePath, '*.onnx'),
            dest: modelsPath,
          },
          {
            src: resolve(modelsSourcePath, '*.txt'),
            dest: modelsPath,
          },
        ],
      })
    )
    return plugins
  }

  // Specific version - with optional obfuscation
  const modelFiles = MODEL_FILES[modelVersion]

  // Generate obfuscated names if enabled
  const generateHash = (name: string) => createHash('md5').update(name).digest('hex').substring(0, 12)
  
  const modelNames = enableObfuscation ? {
    detection: `m_${generateHash(modelFiles.detection)}.onnx`,
    recognition: `m_${generateHash(modelFiles.recognition)}.onnx`,
    dictionary: `d_${generateHash(modelFiles.dictionary)}.txt`,
  } : modelFiles

  // Copy models
  plugins.push(
    viteStaticCopy({
      targets: [
        {
          src: resolve(modelsSourcePath, modelFiles.detection),
          dest: modelsPath,
          rename: modelNames.detection,
        },
        {
          src: resolve(modelsSourcePath, modelFiles.recognition),
          dest: modelsPath,
          rename: modelNames.recognition,
        },
        {
          src: resolve(modelsSourcePath, modelFiles.dictionary),
          dest: modelsPath,
          rename: modelNames.dictionary,
        },
      ],
    })
  )

  // Generate manifest if obfuscated
  if (enableObfuscation) {
    plugins.push({
      name: 'ocr-manifest-generator',
      writeBundle() {
        const manifestPath = resolve('dist', modelsPath, 'manifest.json')
        mkdirSync(resolve('dist', modelsPath), { recursive: true })
        writeFileSync(manifestPath, JSON.stringify(modelNames, null, 2))
        console.log('✅ Generated OCR model manifest')
      },
    })
  }

  return plugins
}
