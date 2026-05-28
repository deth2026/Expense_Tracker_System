import { Repository } from 'typeorm';
import AppDataSource from '../config/Database';
import { UserEntity } from '../entities';

export class UserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async createAndSave(payload: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(payload);
    return this.repository.save(user);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
