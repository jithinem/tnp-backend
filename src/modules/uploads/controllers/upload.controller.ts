import type { Request, Response } from 'express';

const uploadFileController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null,
      });
    }

    const host = request.get('host') ?? 'localhost';
    const protocol = request.protocol === 'https' ? 'https' : 'http';
    const url = `${protocol}://${host}/public/${file.filename}`;

    return response.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: `/public/${file.filename}`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error during file upload';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { uploadFileController };
