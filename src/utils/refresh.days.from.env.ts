const refreshDaysFromEnv = () => {
  const raw = process.env.REFRESH_TOKEN_EXPIRES_DAYS;
  if (!raw) return 7;
  const n = Number(raw.trim());
  return Number.isFinite(n) && n > 0 ? n : 7;
};

export { refreshDaysFromEnv };

