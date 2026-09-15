import { refreshDaysFromEnv } from './refresh.days.from.env';

const getRefreshExpiryDate = () => {
  const days = refreshDaysFromEnv();
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
};

export { getRefreshExpiryDate };

