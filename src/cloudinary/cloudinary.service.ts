import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export type CloudinaryDeleteResponse = {
  result: 'ok' | 'not found' | string;
  [key: string]: any;
};

@Injectable()
export class CloudinaryService {
  constructor() {}

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'nest-ecommerce' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteFile(publicId: string): Promise<CloudinaryDeleteResponse> {
    return new Promise<CloudinaryDeleteResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(
            new InternalServerErrorException(
              'Cloudinary delete failed: No result returned.',
            ),
          );
        }

        resolve(result as CloudinaryDeleteResponse);
      });
    });
  }
}
