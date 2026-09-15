import type { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

const getExpiry = (
  value: string | undefined,
  fallback: StringValue,
): StringValue => {
  return (value as StringValue | undefined) ?? fallback;
};

export const ACCESS_EXPIRES_IN: SignOptions['expiresIn'] =
  getExpiry(process.env.ACCESS_EXPIRES_IN, '15m');

export const REFRESH_EXPIRES_IN: SignOptions['expiresIn'] =
  getExpiry(process.env.REFRESH_EXPIRES_IN, '7d');