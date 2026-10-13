import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  baseUrl: process.env.BASE_URL || 'https://litecart.stqa.ru/en/',
  login: process.env.LOGIN || '',
  password: process.env.PASSWORD || '',
} as const;

export function requireEnv(key: 'login' | 'password' | 'baseUrl'): string {
  const value = config[key];
  if (!value) {
    throw new Error(`Environment variable ${key.toUpperCase()} is not set. Check your .env file.`);
  }
  return value;
}
