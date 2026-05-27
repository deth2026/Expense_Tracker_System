import { UserEntity } from '../entities';
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

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
