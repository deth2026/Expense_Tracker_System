import { Repository } from 'typeorm';
import AppDataSource from '../config/Database';
import { BudgetEntity } from '../entities';

export class BudgetRepository {
  private readonly repository: Repository<BudgetEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BudgetEntity);
  }

  async findAllByUserId(userId: string): Promise<BudgetEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<BudgetEntity | null> {
    return this.repository.findOne({
      where: { id, userId },
    });
  }

  async findByMonthAndUserId(month: string, userId: string): Promise<BudgetEntity | null> {
    return this.repository.findOne({
      where: { month, userId },
    });
  }

  async createAndSave(payload: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const budget = this.repository.create(payload);
    return this.repository.save(budget);
  }

  async save(budget: BudgetEntity): Promise<BudgetEntity> {
    return this.repository.save(budget);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
