import { Router } from 'express';
import {
  logoutController,
  refreshTokenController,
  userLoginController,
  userMeController,
  updateMyProfileController,
  userSignupController,
  userSignupVerifyOtpController,
  forgotPasswordController,
  resetPasswordController,
} from '@/modules/auth/controllers';
import { userLoginValidation } from '@/modules/auth/user.login.validation';
import { userSignupValidation } from '@/modules/auth/user.signup.validation';
import { userSignupVerifyOtpValidation } from '@/modules/auth/user.signup.verify.otp.validation';
import { forgotPasswordValidation } from '@/modules/auth/forgot.password.validation';
import { resetPasswordValidation } from '@/modules/auth/reset.password.validation';
import { authMiddleware } from '@/modules/auth/middleware/auth.middleware';
import { accessGuard } from '@/plugins/access.guard';
import { roleGuard } from '@/plugins/role.guard';

const authRoutes = Router();

authRoutes.post('/login', userLoginValidation, userLoginController);
authRoutes.post('/forgot-password', forgotPasswordValidation, forgotPasswordController);
authRoutes.post('/reset-password', resetPasswordValidation, resetPasswordController);

authRoutes.post('/signup', userSignupValidation, userSignupController);
authRoutes.post('/signup/verify-otp', userSignupVerifyOtpValidation, userSignupVerifyOtpController);

authRoutes.get('/me',
  accessGuard,roleGuard(['applicant']), 
  authMiddleware, userMeController);
authRoutes.put('/me', accessGuard, roleGuard(['applicant']), authMiddleware, updateMyProfileController);

authRoutes.post('/refresh-token', refreshTokenController);

authRoutes.post('/logout', logoutController);

export default authRoutes;
