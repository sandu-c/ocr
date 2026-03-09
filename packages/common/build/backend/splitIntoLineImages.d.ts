import type { ImageRaw as ImageRawType, LineImage } from '../types/index.js';
export declare function splitIntoLineImages(image: ImageRawType, sourceImage: ImageRawType, unclipRatio?: number, boxThreshold?: number): Promise<LineImage[]>;
