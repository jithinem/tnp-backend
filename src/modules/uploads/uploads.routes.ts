import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';

import { accessGuard } from '@/plugins/access.guard';
import { uploadFileController } from '@/modules/uploads/controllers';

const uploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
]);

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_request, file, callback) => {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    callback(null, `${timestamp}-${cleanName}`);
  },
});

const fileFilter = (
  _request: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error('Unsupported file type'));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

const uploadsRoutes = Router();

uploadsRoutes.post('/', accessGuard, upload.single('file'), uploadFileController);

export default uploadsRoutes;
