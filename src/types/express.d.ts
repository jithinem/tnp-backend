import type { User } from '@/generated/prisma';

type JwtPayload = {
  sub?: number;
  email?: string;
  role?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: JwtPayload;
      authUserDetails?: User;
      file?: Express.Multer.File;
    }
  }
}

export {};