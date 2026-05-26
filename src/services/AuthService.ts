import { UserEntity, UserRole } from '../entities';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { BcryptUtil } from '../utils/BcryptUtil';
import { JwtUtil } from '../utils/JwtUtil';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

type SafeUser = Omit<UserEntity, 'password'>;

export class AuthService {
  private readonly userRepository = new UserRepository();

  private sanitizeUser(user: UserEntity): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private validateCredentials(payload: LoginPayload): void {
    if (!payload.email || !payload.password) {
      throw new HttpError(400, 'Email and password are required');
    }
  }

  private buildAuthResponse(user: UserEntity): { token: string; user: SafeUser } {
    const token = JwtUtil.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async register(payload: RegisterPayload): Promise<{ token: string; user: SafeUser }> {
    if (!payload.name || !payload.email || !payload.password) {
      throw new HttpError(400, 'Name, email, and password are required');
    }

    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new HttpError(409, 'Email already exists');
    }

    const user = await this.userRepository.createAndSave({
      name: payload.name,
      email: payload.email,
      password: await BcryptUtil.hash(payload.password),
      role: UserRole.USER,
    });

    return this.buildAuthResponse(user);
  }

  private async authenticateByRole(
    payload: LoginPayload,
    role: UserRole,
  ): Promise<{ token: string; user: SafeUser }> {
    this.validateCredentials(payload);

    const user = await this.userRepository.findByEmail(payload.email);
    if (!user || user.role !== role) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const passwordMatches = await BcryptUtil.compare(payload.password, user.password);
    if (!passwordMatches) {
      throw new HttpError(401, 'Invalid email or password');
    }

    if (!BcryptUtil.isHashed(user.password)) {
      user.password = await BcryptUtil.hash(payload.password);
      await this.userRepository.save(user);
    }

    return this.buildAuthResponse(user);
  }

  async loginUser(payload: LoginPayload): Promise<{ token: string; user: SafeUser }> {
    return this.authenticateByRole(payload, UserRole.USER);
  }

  async loginAdmin(payload: LoginPayload): Promise<{ token: string; user: SafeUser }> {
    return this.authenticateByRole(payload, UserRole.ADMIN);
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return this.sanitizeUser(user);
  }
}
