import { BudgetEntity } from '../entities';
import { BaseRepository } from './BaseRepository';

export class BudgetRepository extends BaseRepository<BudgetEntity> {
  constructor() {
    super(BudgetEntity);
  }

  async findByUserId(userId: string): Promise<BudgetEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserIdAndMonth(userId: string, month: string): Promise<BudgetEntity | null> {
    return this.repository.findOne({
      where: { userId, month },
    });
  }
}

