import { refreshDaysFromEnv } from './refresh.days.from.env';

const getRefreshCookieOptions = () => {
  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
  const refreshDays = refreshDaysFromEnv();

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * refreshDays, // seconds
  };
};

export { getRefreshCookieOptions };

