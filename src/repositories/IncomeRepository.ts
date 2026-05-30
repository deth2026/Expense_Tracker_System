import { IncomeEntity } from '../entities';
import { BaseRepository } from './BaseRepository';

export class IncomeRepository extends BaseRepository<IncomeEntity> {
  constructor() {
    super(IncomeEntity);
  }

  async findByUserId(userId: string): Promise<IncomeEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createAndSave(payload: Partial<IncomeEntity>): Promise<IncomeEntity> {
    return this.create(payload);
  }

  async save(income: IncomeEntity): Promise<IncomeEntity> {
    return this.repository.save(income);
  }
}