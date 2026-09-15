import type { NextFunction, Request, Response } from 'express';

const roleGuard = (roles: string[]) => {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const user = request.authUserDetails;
    const role = user?.role?.name;

    if (!user || !role) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    if (!roles.includes(role)) {
      return response.status(403).json({
        success: false,
        message: 'Permission denied',
        data: null,
      });
    }

    return next();
  };
};

export { roleGuard };