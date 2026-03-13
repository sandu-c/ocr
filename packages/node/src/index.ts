import fs from 'node:fs/promises'
import BaseOcr, { registerBackend, type ModelCreateOptions } from '@sanduc/ocr-common'
import { splitIntoLineImages } from '@sanduc/ocr-common/splitIntoLineImages'
import defaultModels from '@sanduc/ocr-models/node'
import { InferenceSession } from 'onnxruntime-node'
import { FileUtils } from './FileUtils'
import { ImageRaw } from './ImageRaw'

registerBackend({
  FileUtils,
  ImageRaw,
  InferenceSession,
  splitIntoLineImages,
  defaultModels,
})

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Ocr extends BaseOcr {
  static async create(options: ModelCreateOptions = {}) {
    // Handle modelVersion selection
    if (options.modelVersion && !options.models) {
      const version = options.modelVersion
      if (version === 'v5_mobile') {
        options.models = {
          detectionPath: defaultModels.detectionPathV5Mobile,
          recognitionPath: defaultModels.recognitionPathV5Mobile,
          dictionaryPath: defaultModels.dictionaryPathV5Mobile,
        }
      } else if (version === 'v4') {
        options.models = {
          detectionPath: defaultModels.detectionPathV4,
          recognitionPath: defaultModels.recognitionPathV4,
          dictionaryPath: defaultModels.dictionaryPathV4,
        }
      } else if (version === 'v5' || version === 'auto') {
        // Default to v5 server
        options.models = {
          detectionPath: defaultModels.detectionPath,
          recognitionPath: defaultModels.recognitionPath,
          dictionaryPath: defaultModels.dictionaryPath,
        }
      }
    }

    const ocr = await BaseOcr.create(options)
    if (options.debugOutputDir) {
      await fs.mkdir(options.debugOutputDir, { recursive: true })
    }
    return ocr
  }
}

export * from '@sanduc/ocr-common'

export default Ocr
