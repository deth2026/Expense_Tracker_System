import { ExpenseEntity } from '../entities';
import { BaseRepository } from './BaseRepository';

interface ExpenseSearchFilters {
  query?: string;
  categoryId?: string;
  from?: Date;
  to?: Date;
}

export class ExpenseRepository extends BaseRepository<ExpenseEntity> {
  constructor() {
    super(ExpenseEntity);
  }

  async findByUserId(userId: string): Promise<ExpenseEntity[]> {
    return this.repository.find({
      where: { userId },
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ExpenseEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async createAndSave(payload: Partial<ExpenseEntity>): Promise<ExpenseEntity> {
    return this.create(payload);
  }

  async sumByUserId(userId: string, excludeExpenseId?: string): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.user_id = :userId', { userId });

    if (excludeExpenseId) {
      queryBuilder.andWhere('expense.id != :excludeExpenseId', { excludeExpenseId });
    }

    const result = await queryBuilder.getRawOne<{ total: string | number | null }>();

    return Number(result?.total ?? 0);
  }

  async sumAll(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .getRawOne<{ total: string | number | null }>();

    return Number(result?.total ?? 0);
  }

  async getTopSpendingCategories(limit = 5): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      totalExpense: number;
      transactionCount: number;
    }>
  > {
    const results = await this.repository
      .createQueryBuilder('expense')
      .leftJoin('expense.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'totalExpense')
      .addSelect('COUNT(expense.id)', 'transactionCount')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('totalExpense', 'DESC')
      .limit(limit)
      .getRawMany<{
        categoryId: string;
        categoryName: string;
        totalExpense: string | number;
        transactionCount: string | number;
      }>();

    return results.map((result) => ({
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      totalExpense: Number(result.totalExpense),
      transactionCount: Number(result.transactionCount),
    }));
  }

  async save(expense: ExpenseEntity): Promise<ExpenseEntity> {
    return this.repository.save(expense);
  }

  async searchByUserId(
    userId: string,
    filters: ExpenseSearchFilters,
  ): Promise<ExpenseEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .where('expense.userId = :userId', { userId });

    if (filters.query) {
      queryBuilder.andWhere(
        '(expense.title LIKE :query OR expense.description LIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.categoryId) {
      queryBuilder.andWhere('expense.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.from) {
      queryBuilder.andWhere('expense.transactionDate >= :from', {
        from: filters.from,
      });
    }

    if (filters.to) {
      queryBuilder.andWhere('expense.transactionDate <= :to', {
        to: filters.to,
      });
    }

    return queryBuilder.orderBy('expense.createdAt', 'DESC').getMany();
  }
}
