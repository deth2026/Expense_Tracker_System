import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserRole } from '../entities';

export interface JwtPayloadData {
  userId: string;
  email: string;
  role: UserRole;
}

const getJwtSecret = (): Secret => process.env.JWT_SECRET || 'super_secret_key';
const getJwtExpiresIn = (): SignOptions['expiresIn'] =>
  (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

export class JwtUtil {
  static sign(payload: JwtPayloadData): string {
    return jwt.sign(payload, getJwtSecret(), {
      expiresIn: getJwtExpiresIn(),
    });
  }

  static verify(token: string): JwtPayloadData {
    return jwt.verify(token, getJwtSecret()) as JwtPayloadData;
  }
}
