import { BudgetRepository } from '../repositories/BudgetRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { CategoryType } from '../entities';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { IncomeRepository } from '../repositories/IncomeRepository';
import { HttpError } from '../middlewares/ErrorMiddleware';

interface DateRange {
  month: string;
  start: Date;
  end: Date;
}

export class DashboardService {
  private readonly expenseRepository = new ExpenseRepository();
  private readonly incomeRepository = new IncomeRepository();
  private readonly categoryRepository = new CategoryRepository();
  private readonly budgetRepository = new BudgetRepository();

  async getDashboard(userId: string, month?: string) {
    const selectedMonth = this.resolveMonth(month);

    const [income, expenses, monthlySummary, categoryBreakdown, budgetOverview] = await Promise.all([
      this.getPersonalIncome(userId),
      this.getPersonalExpenses(userId),
      this.getMonthlySummary(userId, selectedMonth.month),
      this.getCategoryBreakdown(userId, selectedMonth.month),
      this.getBudgetOverview(userId, selectedMonth.month),
    ]);

    return {
      personalIncome: income,
      personalExpenses: expenses,
      personalBalance: await this.getPersonalBalance(userId),
      monthlySummary,
      categoryBreakdown,
      budgetOverview,
    };
  }

  async getPersonalIncome(userId: string) {
    const totalIncome = await this.incomeRepository.sumByUserId(userId);
    return { totalIncome: totalIncome.toFixed(2) };
  }

  async getPersonalExpenses(userId: string) {
    const totalExpenses = await this.expenseRepository.sumByUserId(userId);
    return { totalExpenses: totalExpenses.toFixed(2) };
  }

  async getPersonalBalance(userId: string) {
    const totalIncome = await this.incomeRepository.sumByUserId(userId);
    const totalExpenses = await this.expenseRepository.sumByUserId(userId);
    const balance = totalIncome - totalExpenses;
    return { balance: balance.toFixed(2) };
  }

  async getMonthlySummary(userId: string, month?: string) {
    const resolved = this.resolveMonth(month);
    const totalIncome = await this.incomeRepository.sumByUserIdByDateRange(
      userId,
      resolved.start,
      resolved.end,
    );
    const totalExpenses = await this.expenseRepository.sumByUserIdByDateRange(
      userId,
      resolved.start,
      resolved.end,
    );

    return {
      month: resolved.month,
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: (totalIncome - totalExpenses).toFixed(2),
    };
  }

  async getCategoryBreakdown(userId: string, month?: string) {
    const resolved = this.resolveMonth(month);
    const categories = await this.categoryRepository.findAll();
    const expenseCategories = categories.filter((category) => category.type === CategoryType.EXPENSE);
    const breakdownRows = await this.expenseRepository.getCategoryBreakdownByUserId(
      userId,
      resolved.start,
      resolved.end,
    );

    const categoryTotals = expenseCategories.map((category) => {
      const row = breakdownRows.find((item) => item.categoryId === category.id);
      return {
        categoryId: category.id,
        categoryName: category.name,
        total: (row?.total ?? 0).toFixed(2),
      };
    });

    const otherRows = breakdownRows.filter(
      (row) => !expenseCategories.some((category) => category.id === row.categoryId),
    );

    return {
      month: resolved.month,
      breakdown: [...categoryTotals, ...otherRows.map((row) => ({
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        total: row.total.toFixed(2),
      }))],
    };
  }

  async getBudgetOverview(userId: string, month?: string) {
    const resolved = this.resolveMonth(month);
    const existingBudget = await this.budgetRepository.findByUserIdAndMonth(userId, resolved.month);
    const spentAmount = await this.expenseRepository.sumByUserIdByDateRange(
      userId,
      resolved.start,
      resolved.end,
    );

    if (existingBudget) {
      return {
        month: existingBudget.month,
        monthlyLimit: existingBudget.monthlyLimit,
        spentAmount: spentAmount.toFixed(2),
        remainingAmount: existingBudget.remainingAmount,
        hasBudget: true,
      };
    }

    return {
      month: resolved.month,
      monthlyLimit: '0.00',
      spentAmount: spentAmount.toFixed(2),
      remainingAmount: '0.00',
      hasBudget: false,
    };
  }

  private resolveMonth(month?: string): DateRange {
    if (!month) {
      const now = new Date();
      return this.buildMonthRange(now.getUTCFullYear(), now.getUTCMonth() + 1);
    }

    const [yearValue, monthValue] = month.split('-');
    const year = Number(yearValue);
    const monthNumber = Number(monthValue);

    if (!Number.isInteger(year) || !Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw new HttpError(400, 'Invalid month format. Expected YYYY-MM.');
    }

    return this.buildMonthRange(year, monthNumber);
  }

  private buildMonthRange(year: number, monthNumber: number): DateRange {
    const start = new Date(Date.UTC(year, monthNumber - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthNumber, 0, 23, 59, 59, 999));

    return {
      month: `${year.toString().padStart(4, '0')}-${monthNumber.toString().padStart(2, '0')}`,
      start,
      end,
    };
  }
}
