import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

export interface ImageUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

@Injectable()
export class ImageService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Upload single image with validation
   */
  async uploadImage(
    buffer: Buffer,
    originalName?: string,
    options: {
      maxSize?: number; // in bytes
      allowedFormats?: string[];
      folder?: string;
    } = {},
  ): Promise<ImageUploadResult> {
    const { maxSize = 10 * 1024 * 1024, allowedFormats = ['jpg', 'jpeg', 'png', 'webp'] } = options;

    // Validate file size
    if (buffer.length > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Validate format
    if (originalName) {
      const ext = originalName.split('.').pop()?.toLowerCase();
      if (ext && !allowedFormats.includes(ext)) {
        throw new Error(`File format ${ext} is not allowed. Allowed formats: ${allowedFormats.join(', ')}`);
      }
    }

    const result = await this.cloudinaryService.uploadFile(
      buffer,
      'image',
      originalName,
      options.folder,
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  /**
   * Delete image by URL or public ID
   */
  async deleteImage(urlOrPublicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinaryService.deleteFile(urlOrPublicId, 'image');
      return result.result === 'ok';
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }

  /**
   * Generate thumbnail URL
   */
  getThumbnail(urlOrPublicId: string, width = 200, height = 200): string {
    const publicId = this.extractPublicId(urlOrPublicId);
    return this.cloudinaryService.getThumbnailUrl(publicId, width, height);
  }

  /**
   * Extract public ID from URL or return as-is if already public ID
   */
  private extractPublicId(urlOrPublicId: string): string {
    if (urlOrPublicId.startsWith('http')) {
      const parts = urlOrPublicId.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1) {
        let startIndex = uploadIndex + 1;
        if (parts[startIndex] && /^v\d+$/.test(parts[startIndex])) {
          startIndex++;
        }
        const publicId = parts.slice(startIndex).join('/');
        return publicId.replace(/\.[^/.]+$/, '');
      }
    }
    return urlOrPublicId;
  }
}