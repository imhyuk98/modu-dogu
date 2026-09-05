export const MAX_IMAGE_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 24_000_000;
export const MAX_IMAGE_DIMENSION = 8_192;
export const MAX_IMAGE_BATCH_COUNT = 12;
export const MAX_IMAGE_BATCH_BYTES = 60 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function imageFileError(file: File): string | null {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return "JPG, PNG, WebP 또는 GIF 이미지만 사용할 수 있습니다.";
  }
  if (file.size <= 0) return "비어 있는 이미지 파일은 사용할 수 없습니다.";
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return "이미지 한 장의 크기는 15MB 이하여야 합니다.";
  }
  return null;
}

export function imageDimensionError(width: number, height: number): string | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return "이미지 해상도를 확인할 수 없습니다.";
  }
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION || width * height > MAX_IMAGE_PIXELS) {
    return "이미지는 한 변 8,192px 이하, 총 2,400만 픽셀 이하여야 합니다.";
  }
  return null;
}

export function imageBatchError(files: File[], existingFiles: File[] = []): string | null {
  for (const file of files) {
    const error = imageFileError(file);
    if (error) return `${file.name}: ${error}`;
  }
  if (files.length + existingFiles.length > MAX_IMAGE_BATCH_COUNT) {
    return `이미지는 한 번에 최대 ${MAX_IMAGE_BATCH_COUNT}장까지 처리할 수 있습니다.`;
  }
  const totalBytes = [...files, ...existingFiles].reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_IMAGE_BATCH_BYTES) {
    return "선택한 이미지의 전체 크기는 60MB 이하여야 합니다.";
  }
  return null;
}

export function imageSafetySummary(): string {
  return "JPG, PNG, WebP, GIF · 파일당 15MB · 최대 8,192px/2,400만 픽셀";
}

export interface SafeImageProbe {
  url: string;
  width: number;
  height: number;
}

export function probeSafeImage(file: File): Promise<SafeImageProbe> {
  const fileError = imageFileError(file);
  if (fileError) return Promise.reject(new Error(fileError));

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const dimensionError = imageDimensionError(image.naturalWidth, image.naturalHeight);
      if (dimensionError) {
        URL.revokeObjectURL(url);
        reject(new Error(dimensionError));
        return;
      }
      resolve({ url, width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 열 수 없습니다."));
    };
    image.src = url;
  });
}
