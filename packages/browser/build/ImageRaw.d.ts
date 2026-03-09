import { ImageRawBase } from '@gutenye/ocr-common';
import type { ImageRawData, LineImage, SizeOption } from '@gutenye/ocr-common';
export declare class ImageRaw extends ImageRawBase {
    #private;
    data: Uint8ClampedArray;
    static open(url: string): Promise<ImageRaw>;
    constructor({ data, width, height }: ImageRawData);
    write(path: string): Promise<void>;
    resize({ width, height }: SizeOption): Promise<this>;
    drawBox(lineImages: LineImage[]): Promise<this>;
}
