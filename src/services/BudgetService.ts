import { BudgetEntity } from '../entities';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { BudgetRepository } from '../repositories/BudgetRepository';

interface CreateBudgetPayload {
  monthlyLimit: string | number;
  month: string;
  spentAmount?: string | number;
}

interface UpdateBudgetPayload {
  monthlyLimit?: string | number;
  month?: string;
  spentAmount?: string | number;
}

export class BudgetService {
  private readonly budgetRepository = new BudgetRepository();

  async list(userId: string): Promise<BudgetEntity[]> {
    this.validateUserId(userId);
    return this.budgetRepository.findAllByUserId(userId);
  }

  async getById(id: string, userId: string): Promise<BudgetEntity> {
    this.validateUserId(userId);
    this.validateBudgetId(id);

    const budget = await this.budgetRepository.findByIdAndUserId(id, userId);
    if (!budget) {
      throw new HttpError(404, 'Budget not found');
    }

    return budget;
  }

  async create(userId: string, payload: CreateBudgetPayload): Promise<BudgetEntity> {
    this.validateUserId(userId);

    if (payload?.monthlyLimit === undefined || !payload?.month) {
      throw new HttpError(400, 'monthlyLimit and month are required');
    }

    const month = this.normalizeMonth(payload.month);
    const monthlyLimit = this.normalizeMoney(payload.monthlyLimit, 'monthlyLimit');
    const spentAmount = this.normalizeMoney(payload.spentAmount ?? 0, 'spentAmount');
    const remainingAmount = this.calculateRemainingAmount(monthlyLimit, spentAmount);

    const existingBudget = await this.budgetRepository.findByMonthAndUserId(month, userId);
    if (existingBudget) {
      throw new HttpError(409, 'Budget for this month already exists');
    }

    return this.budgetRepository.createAndSave({
      userId,
      month,
      monthlyLimit,
      spentAmount,
      remainingAmount,
    });
  }

  async update(id: string, userId: string, payload: UpdateBudgetPayload): Promise<BudgetEntity> {
    this.validateUserId(userId);
    this.validateBudgetId(id);

    const budget = await this.budgetRepository.findByIdAndUserId(id, userId);
    if (!budget) {
      throw new HttpError(404, 'Budget not found');
    }

    const hasMonthlyLimit = payload?.monthlyLimit !== undefined;
    const hasMonth = payload?.month !== undefined;
    const hasSpentAmount = payload?.spentAmount !== undefined;

    if (!hasMonthlyLimit && !hasMonth && !hasSpentAmount) {
      throw new HttpError(400, 'At least one of monthlyLimit, month, or spentAmount is required');
    }

    if (hasMonth) {
      const month = this.normalizeMonth(payload.month!);
      const existingBudget = await this.budgetRepository.findByMonthAndUserId(month, userId);

      if (existingBudget && existingBudget.id !== id) {
        throw new HttpError(409, 'Budget for this month already exists');
      }

      budget.month = month;
    }

    if (hasMonthlyLimit) {
      budget.monthlyLimit = this.normalizeMoney(payload.monthlyLimit!, 'monthlyLimit');
    }

    if (hasSpentAmount) {
      budget.spentAmount = this.normalizeMoney(payload.spentAmount!, 'spentAmount');
    }

    budget.remainingAmount = this.calculateRemainingAmount(
      budget.monthlyLimit,
      budget.spentAmount,
    );

    return this.budgetRepository.save(budget);
  }

  async delete(id: string, userId: string): Promise<void> {
    this.validateUserId(userId);
    this.validateBudgetId(id);

    const budget = await this.budgetRepository.findByIdAndUserId(id, userId);
    if (!budget) {
      throw new HttpError(404, 'Budget not found');
    }

    await this.budgetRepository.deleteById(id);
  }

  private validateUserId(userId: string): void {
    if (!userId) {
      throw new HttpError(401, 'Authenticated user is required');
    }
  }

  private validateBudgetId(id: string): void {
    if (!id) {
      throw new HttpError(400, 'Budget id is required');
    }
  }

  private normalizeMonth(month: string): string {
    const normalizedMonth = String(month || '').trim();

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(normalizedMonth)) {
      throw new HttpError(400, 'month must be in YYYY-MM format');
    }

    return normalizedMonth;
  }

  private normalizeMoney(value: string | number, fieldName: string): string {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new HttpError(400, `${fieldName} must be a positive number or zero`);
    }

    return amount.toFixed(2);
  }

  private calculateRemainingAmount(monthlyLimit: string, spentAmount: string): string {
    return (Number(monthlyLimit) - Number(spentAmount)).toFixed(2);
  }
}
