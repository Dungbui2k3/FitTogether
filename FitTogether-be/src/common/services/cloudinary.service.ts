import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY, FileCategory } from '../../common/constants';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  /**
   * Upload file to Cloudinary
   * @param buffer File buffer
   * @param fileCategory File category (image, video, model3d)
   * @param originalName Original file name (optional)
   * @param customFolder Custom folder path (optional)
   * @returns Promise<UploadApiResponse>
   */
  async uploadFile(
    buffer: Buffer,
    fileCategory: FileCategory,
    originalName?: string,
    customFolder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const folder = customFolder || `fittogether/${fileCategory}`;
      const resourceType = this.getResourceType(fileCategory);

      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
      };

      // Add public_id if originalName is provided
      if (originalName) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
        uploadOptions.public_id = `${Date.now()}_${sanitizedName}`;
      }

      // Special handling for 3D model files
      if (fileCategory === 'model3d') {
        uploadOptions.raw_convert = 'aspose';
        uploadOptions.resource_type = 'raw';
      }

      const stream = this.cloudinaryClient.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(
              new Error(
                `Cloudinary upload error: ${error.message} (code: ${error.http_code ?? 'N/A'})`,
              ),
            );
          }
          if (!result) {
            return reject(new Error('Upload result is undefined'));
          }
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }

  /**
   * Upload multiple files to Cloudinary
   * @param files Array of file objects with buffer and info
   * @param fileCategory File category
   * @param customFolder Custom folder path (optional)
   * @returns Promise<UploadApiResponse[]>
   */
  async uploadMultipleFiles(
    files: { buffer: Buffer; originalName?: string }[],
    fileCategory: FileCategory,
    customFolder?: string,
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, fileCategory, file.originalName, customFolder),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete file from Cloudinary
   * @param publicIdOrUrl Public ID or full URL of the file to delete
   * @param resourceType Resource type (image, video, raw)
   * @returns Promise<any>
   */
  async deleteFile(publicIdOrUrl: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<any> {
    try {
      let publicId = publicIdOrUrl;

      // If it's a URL, extract the public ID
      if (publicIdOrUrl.startsWith('http')) {
        publicId = this.extractPublicIdFromUrl(publicIdOrUrl);
      }

      const result = await this.cloudinaryClient.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Cloudinary delete failed: ${JSON.stringify(result)}`);
      }

      return result;
    } catch (error) {
      throw new Error(`Cloudinary delete error: ${(error as Error).message}`);
    }
  }

  /**
   * Delete multiple files from Cloudinary
   * @param publicIdsOrUrls Array of public IDs or URLs
   * @param resourceType Resource type
   * @returns Promise<any[]>
   */
  async deleteMultipleFiles(
    publicIdsOrUrls: string[],
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any[]> {
    const deletePromises = publicIdsOrUrls.map((id) => this.deleteFile(id, resourceType));
    return Promise.all(deletePromises);
  }

  /**
   * Get optimized URL for image with transformations
   * @param publicId Public ID of the image
   * @param transformations Cloudinary transformations
   * @returns Optimized URL
   */
  getOptimizedUrl(publicId: string, transformations: any = {}): string {
    return this.cloudinaryClient.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...transformations,
    });
  }

  /**
   * Generate thumbnail URL
   * @param publicId Public ID of the image
   * @param width Thumbnail width
   * @param height Thumbnail height
   * @returns Thumbnail URL
   */
  getThumbnailUrl(publicId: string, width: number = 200, height: number = 200): string {
    return this.cloudinaryClient.url(publicId, {
      width,
      height,
      crop: 'fill',
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  /**
   * Get resource type based on file category
   * @param fileCategory File category
   * @returns Cloudinary resource type
   */
  private getResourceType(fileCategory: FileCategory): 'image' | 'video' | 'raw' {
    switch (fileCategory) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'model3d':
        return 'raw';
      default:
        return 'raw';
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url Cloudinary URL
   * @returns Public ID
   */
  private extractPublicIdFromUrl(url: string): string {
    try {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');
      
      if (uploadIndex === -1) {
        throw new Error('Invalid Cloudinary URL format');
      }

      // Skip version if present (starts with 'v' followed by numbers)
      let startIndex = uploadIndex + 1;
      if (parts[startIndex] && /^v\d+$/.test(parts[startIndex])) {
        startIndex++;
      }

      // Join the rest and remove file extension
      const publicId = parts.slice(startIndex).join('/');
      return publicId.replace(/\.[^/.]+$/, '');
    } catch (error) {
      throw new Error(`Failed to extract public ID from URL: ${url}`);
    }
  }

  /**
   * Check if file exists in Cloudinary
   * @param publicId Public ID of the file
   * @param resourceType Resource type
   * @returns Promise<boolean>
   */
  async fileExists(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<boolean> {
    try {
      const result = await this.cloudinaryClient.api.resource(publicId, {
        resource_type: resourceType,
      });
      return !!result;
    } catch (error) {
      return false;
    }
  }
}