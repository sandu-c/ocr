import Ocr, { registerBackend } from '@sanduc/ocr-common'
import { splitIntoLineImages } from '@sanduc/ocr-common/splitIntoLineImages'
import { InferenceSession } from 'onnxruntime-web'
import { FileUtils } from './FileUtils'
import { ImageRaw } from './ImageRaw'

registerBackend({ FileUtils, ImageRaw, InferenceSession, splitIntoLineImages, defaultModels: undefined })

export * from '@sanduc/ocr-common'
export default Ocr
