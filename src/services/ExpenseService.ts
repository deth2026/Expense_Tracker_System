import { CategoryType } from '../entities';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { IncomeRepository } from '../repositories/IncomeRepository';

interface CreateExpensePayload {
  title: string;
  amount: number | string;
  categoryId: string;
  transactionDate: string;
  description?: string;
}

interface UpdateExpensePayload {
  title?: string;
  amount?: number | string;
  categoryId?: string;
  transactionDate?: string;
  description?: string | null;
}

interface SearchExpenseQuery {
  q?: string;
  categoryId?: string;
  from?: string;
  to?: string;
}

export class ExpenseService {
  private readonly expenseRepository = new ExpenseRepository();
  private readonly categoryRepository = new CategoryRepository();
  private readonly incomeRepository = new IncomeRepository();

  private normalizeAmount(amount: number | string): string {
    const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new HttpError(400, 'Amount must be a positive number');
    }

    return numericAmount.toFixed(2);
  }

  private parseDate(value: string, fieldName: string): Date {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new HttpError(400, `${fieldName} must be a valid date`);
    }

    return date;
  }

  private async validateExpenseCategory(categoryId: string): Promise<void> {
    if (!categoryId) {
      throw new HttpError(400, 'Category id is required');
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    if (category.type !== CategoryType.EXPENSE) {
      throw new HttpError(400, 'Category must be an expense category');
    }
  }

  private async validateAvailableBalance(
    userId: string,
    amount: number,
    excludeExpenseId?: string,
  ): Promise<void> {
    const [totalIncome, totalExpenses] = await Promise.all([
      this.incomeRepository.sumByUserId(userId),
      this.expenseRepository.sumByUserId(userId, excludeExpenseId),
    ]);

    if (totalExpenses + amount > totalIncome) {
      const availableBalance = totalIncome - totalExpenses;
      throw new HttpError(
        400,
        `Expense cannot be greater than available income balance. Available balance is ${availableBalance.toFixed(2)}`,
      );
    }
  }

  async createExpense(userId: string, payload: CreateExpensePayload) {
    const title = payload.title?.trim();

    if (!title) {
      throw new HttpError(400, 'Expense title is required');
    }

    await this.validateExpenseCategory(payload.categoryId);
    const amount = this.normalizeAmount(payload.amount);
    await this.validateAvailableBalance(userId, Number(amount));

    return this.expenseRepository.createAndSave({
      userId,
      title,
      amount,
      categoryId: payload.categoryId,
      transactionDate: this.parseDate(payload.transactionDate, 'transactionDate'),
      description: payload.description?.trim() || null,
    });
  }

  async listExpenses(userId: string) {
    return this.expenseRepository.findByUserId(userId);
  }

  async getExpenseById(userId: string, expenseId: string) {
    const expense = await this.expenseRepository.findById(expenseId);

    if (!expense) {
      throw new HttpError(404, 'Expense not found');
    }

    if (expense.userId !== userId) {
      throw new HttpError(403, 'You are not allowed to access this expense');
    }

    return expense;
  }

  async updateExpense(userId: string, expenseId: string, payload: UpdateExpensePayload) {
    const expense = await this.getExpenseById(userId, expenseId);

    if (payload.title !== undefined) {
      const title = payload.title.trim();

      if (!title) {
        throw new HttpError(400, 'Expense title is required');
      }

      expense.title = title;
    }

    if (payload.amount !== undefined) {
      const amount = this.normalizeAmount(payload.amount);
      await this.validateAvailableBalance(userId, Number(amount), expenseId);
      expense.amount = amount;
    }

    if (payload.categoryId !== undefined) {
      await this.validateExpenseCategory(payload.categoryId);
      expense.categoryId = payload.categoryId;
    }

    if (payload.transactionDate !== undefined) {
      expense.transactionDate = this.parseDate(payload.transactionDate, 'transactionDate');
    }

    if (payload.description !== undefined) {
      expense.description = payload.description?.trim() || null;
    }

    return this.expenseRepository.save(expense);
  }

  async deleteExpense(userId: string, expenseId: string): Promise<void> {
    const expense = await this.getExpenseById(userId, expenseId);
    await this.expenseRepository.delete(expense.id);
  }

  async searchExpenses(userId: string, query: SearchExpenseQuery) {
    return this.expenseRepository.searchByUserId(userId, {
      query: query.q?.trim() || undefined,
      categoryId: query.categoryId?.trim() || undefined,
      from: query.from ? this.parseDate(query.from, 'from') : undefined,
      to: query.to ? this.parseDate(query.to, 'to') : undefined,
    });
  }
}
