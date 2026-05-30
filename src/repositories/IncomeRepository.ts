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

  async sumByUserId(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('income')
      .select('COALESCE(SUM(income.amount), 0)', 'total')
      .where('income.user_id = :userId', { userId })
      .getRawOne<{ total: string | number | null }>();

    return Number(result?.total ?? 0);
  }

  async save(income: IncomeEntity): Promise<IncomeEntity> {
    return this.repository.save(income);
  }
}
