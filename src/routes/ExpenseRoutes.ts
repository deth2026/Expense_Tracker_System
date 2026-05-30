import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);

router.post('/', expenseController.createExpense);
router.get('/', expenseController.listExpenses);
router.get('/search', expenseController.searchExpenses);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
