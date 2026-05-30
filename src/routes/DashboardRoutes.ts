import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const dashboardController = new DashboardController();

router.use(authMiddleware);

router.get('/', dashboardController.getDashboard);
router.get('/income', dashboardController.getPersonalIncome);
router.get('/expenses', dashboardController.getPersonalExpenses);
router.get('/balance', dashboardController.getPersonalBalance);
router.get('/monthly-summary', dashboardController.getMonthlySummary);
router.get('/category-breakdown', dashboardController.getCategoryBreakdown);
router.get('/budget-overview', dashboardController.getBudgetOverview);

export default router;
