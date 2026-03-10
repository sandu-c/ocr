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
    const ocr = await BaseOcr.create(options)
    if (options.debugOutputDir) {
      await fs.mkdir(options.debugOutputDir, { recursive: true })
    }
    return ocr
  }
}

export * from '@sanduc/ocr-common'

export default Ocr
