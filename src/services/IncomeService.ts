import { HttpError } from '../middlewares/ErrorMiddleware';
import { IncomeRepository } from '../repositories/IncomeRepository';

interface CreateIncomePayload {
  source: string;
  amount: number | string;
  description?: string;
}

interface UpdateIncomePayload {
  source?: string;
  amount?: number | string;
  description?: string | null;
}

export class IncomeService {
  private readonly incomeRepository = new IncomeRepository();

  private normalizeAmount(amount: number | string): string {
    const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new HttpError(400, 'Amount must be a positive number');
    }

    return numericAmount.toFixed(2);
  }

  async createIncome(userId: string, payload: CreateIncomePayload) {
    const source = payload.source?.trim();

    if (!source) {
      throw new HttpError(400, 'Income source is required');
    }

    return this.incomeRepository.createAndSave({
      userId,
      source,
      amount: this.normalizeAmount(payload.amount),
      description: payload.description?.trim() || null,
    });
  }

  async listIncomes(userId: string) {
    return this.incomeRepository.findByUserId(userId);
  }

  async getIncomeById(userId: string, incomeId: string) {
    const income = await this.incomeRepository.findById(incomeId);

    if (!income) {
      throw new HttpError(404, 'Income not found');
    }

    if (income.userId !== userId) {
      throw new HttpError(403, 'You are not allowed to access this income');
    }

    return income;
  }

  async updateIncome(userId: string, incomeId: string, payload: UpdateIncomePayload) {
    const income = await this.getIncomeById(userId, incomeId);

    if (payload.source !== undefined) {
      const source = payload.source.trim();

      if (!source) {
        throw new HttpError(400, 'Income source is required');
      }

      income.source = source;
    }

    if (payload.amount !== undefined) {
      income.amount = this.normalizeAmount(payload.amount);
    }

    if (payload.description !== undefined) {
      income.description = payload.description?.trim() || null;
    }

    return this.incomeRepository.save(income);
  }

  async deleteIncome(userId: string, incomeId: string): Promise<void> {
    const income = await this.getIncomeById(userId, incomeId);
    await this.incomeRepository.delete(income.id);
  }
}
