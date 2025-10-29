import { randomBytes } from 'node:crypto';
import { hash, verify } from 'argon2';

export const hashPassword = async (password: string) => hash(password);

export const verifyPassword = async (hashed: string, plain: string) => verify(hashed, plain);

export const generateRandomToken = (size = 48) => {
  if (size <= 0) {
    throw new Error('Token size must be greater than zero');
  }

  return randomBytes(size).toString('hex');
};
