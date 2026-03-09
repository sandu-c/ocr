import Ocr, { registerBackend } from '@gutenye/ocr-common';
import { splitIntoLineImages } from '@gutenye/ocr-common/splitIntoLineImages';
import { InferenceSession } from 'onnxruntime-web';
import { FileUtils } from './FileUtils.js';
import { ImageRaw } from './ImageRaw.js';
registerBackend({ FileUtils, ImageRaw, InferenceSession, splitIntoLineImages, defaultModels: undefined });
export * from '@gutenye/ocr-common';
export default Ocr;
//# sourceMappingURL=index.js.map