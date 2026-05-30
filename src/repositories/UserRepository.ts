import { UserEntity, UserRole } from '../entities';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async createAndSave(payload: Partial<UserEntity>): Promise<UserEntity> {
    return this.create(payload);
  }

  async countUsers(): Promise<number> {
    return this.repository.count({ where: { role: UserRole.USER } });
  }

  async findRecentlyRegisteredUsers(limit = 5): Promise<UserEntity[]> {
    return this.repository.find({
      where: { role: UserRole.USER },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
