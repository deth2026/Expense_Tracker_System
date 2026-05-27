import { UserEntity } from '../entities';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { BcryptUtil } from '../utils/BcryptUtil';

type SafeUser = Omit<UserEntity, 'password'>;

interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export class UserService {
  private readonly userRepository = new UserRepository();

  private sanitizeUser(user: UserEntity): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private async ensureEmailIsAvailable(email: string, currentUserId: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser && existingUser.id !== currentUserId) {
      throw new HttpError(409, 'Email already exists');
    }
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<SafeUser> {
    if (!payload.name && !payload.email) {
      throw new HttpError(400, 'At least one field is required to update the profile');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    if (payload.email && payload.email !== user.email) {
      await this.ensureEmailIsAvailable(payload.email, userId);
      user.email = payload.email;
    }

    if (payload.name) {
      user.name = payload.name;
    }

    const updatedUser = await this.userRepository.save(user);
    return this.sanitizeUser(updatedUser);
  }

  async changePassword(userId: string, payload: ChangePasswordPayload): Promise<void> {
    if (!payload.currentPassword || !payload.newPassword) {
      throw new HttpError(400, 'Current password and new password are required');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const passwordMatches = await BcryptUtil.compare(payload.currentPassword, user.password);

    if (!passwordMatches) {
      throw new HttpError(401, 'Current password is incorrect');
    }

    user.password = await BcryptUtil.hash(payload.newPassword);
    await this.userRepository.save(user);
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async listUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.sanitizeUser(user));
  }

  async getUserById(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return this.sanitizeUser(user);
  }
}
