import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export class BcryptUtil {
  static async hash(value: string): Promise<string> {
    return bcrypt.hash(value, SALT_ROUNDS);
  }

  static async compare(value: string, hashedValue: string): Promise<boolean> {
    const isBcryptHash =
      hashedValue.startsWith('$2a$') ||
      hashedValue.startsWith('$2b$') ||
      hashedValue.startsWith('$2y$');

    if (!isBcryptHash) {
      return value === hashedValue;
    }

    return bcrypt.compare(value, hashedValue);
  }

  static isHashed(value: string): boolean {
    return (
      value.startsWith('$2a$') ||
      value.startsWith('$2b$') ||
      value.startsWith('$2y$')
    );
  }
}
