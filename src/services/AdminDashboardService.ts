import { BudgetRepository } from '../repositories/BudgetRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { IncomeRepository } from '../repositories/IncomeRepository';
import { UserRepository } from '../repositories/UserRepository';

export class AdminDashboardService {
  private readonly userRepository = new UserRepository();
  private readonly expenseRepository = new ExpenseRepository();
  private readonly incomeRepository = new IncomeRepository();
  private readonly categoryRepository = new CategoryRepository();
  private readonly budgetRepository = new BudgetRepository();

  async getDashboard() {
    const [
      totalUsers,
      totalSystemExpenses,
      totalSystemIncome,
      totalCategories,
      totalBudgets,
      topSpendingCategories,
      recentlyRegisteredUsers,
      budgetTotals,
    ] = await Promise.all([
      this.userRepository.countUsers(),
      this.expenseRepository.sumAll(),
      this.incomeRepository.sumAll(),
      this.categoryRepository.countAll(),
      this.budgetRepository.countAll(),
      this.expenseRepository.getTopSpendingCategories(5),
      this.userRepository.findRecentlyRegisteredUsers(5),
      this.budgetRepository.getSystemTotals(),
    ]);

    const netBalance = totalSystemIncome - totalSystemExpenses;
    const expenseRate =
      totalSystemIncome > 0
        ? Number(((totalSystemExpenses / totalSystemIncome) * 100).toFixed(2))
        : 0;
    const budgetUsageRate =
      budgetTotals.totalMonthlyLimit > 0
        ? Number(
            ((budgetTotals.totalSpentAmount / budgetTotals.totalMonthlyLimit) * 100).toFixed(2),
          )
        : 0;

    return {
      totals: {
        users: totalUsers,
        expenses: Number(totalSystemExpenses.toFixed(2)),
        income: Number(totalSystemIncome.toFixed(2)),
        categories: totalCategories,
        budgets: totalBudgets,
      },
      topSpendingCategories,
      recentlyRegisteredUsers: recentlyRegisteredUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
      financialOverview: {
        totalIncome: Number(totalSystemIncome.toFixed(2)),
        totalExpenses: Number(totalSystemExpenses.toFixed(2)),
        netBalance: Number(netBalance.toFixed(2)),
        expenseRate,
        budgets: {
          totalMonthlyLimit: Number(budgetTotals.totalMonthlyLimit.toFixed(2)),
          totalSpentAmount: Number(budgetTotals.totalSpentAmount.toFixed(2)),
          totalRemainingAmount: Number(budgetTotals.totalRemainingAmount.toFixed(2)),
          budgetUsageRate,
        },
      },
    };
  }
}
