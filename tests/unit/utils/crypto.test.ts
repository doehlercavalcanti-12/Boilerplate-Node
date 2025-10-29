import { hashPassword, verifyPassword, generateRandomToken } from '../../../src/utils/crypto.ts';

describe('crypto utilities', () => {
  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('StrongPassword123!');
    await expect(verifyPassword(hash, 'StrongPassword123!')).resolves.toBe(true);
    await expect(verifyPassword(hash, 'WrongPassword!')).resolves.toBe(false);
  });

  it('generates random tokens with expected length', () => {
    const token = generateRandomToken(16);
    expect(token).toHaveLength(32);
    const token2 = generateRandomToken(16);
    expect(token).not.toEqual(token2);
  });

  it('throws when size is not positive', () => {
    expect(() => generateRandomToken(0)).toThrow('Token size must be greater than zero');
  });
});
