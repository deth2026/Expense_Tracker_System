import { BudgetEntity } from '../entities';
import { BaseRepository } from './BaseRepository';

export class BudgetRepository extends BaseRepository<BudgetEntity> {
  constructor() {
    super(BudgetEntity);
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }

  async getSystemTotals(): Promise<{
    totalMonthlyLimit: number;
    totalSpentAmount: number;
    totalRemainingAmount: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('budget')
      .select('COALESCE(SUM(budget.monthlyLimit), 0)', 'totalMonthlyLimit')
      .addSelect('COALESCE(SUM(budget.spentAmount), 0)', 'totalSpentAmount')
      .addSelect('COALESCE(SUM(budget.remainingAmount), 0)', 'totalRemainingAmount')
      .getRawOne<{
        totalMonthlyLimit: string | number | null;
        totalSpentAmount: string | number | null;
        totalRemainingAmount: string | number | null;
      }>();

    return {
      totalMonthlyLimit: Number(result?.totalMonthlyLimit ?? 0),
      totalSpentAmount: Number(result?.totalSpentAmount ?? 0),
      totalRemainingAmount: Number(result?.totalRemainingAmount ?? 0),
    };
  }
}
