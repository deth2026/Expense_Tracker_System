import { Router } from 'express';
import { IncomeController } from '../controllers/IncomeController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const incomeController = new IncomeController();

router.use(authMiddleware);

router.post('/', incomeController.createIncome);
router.get('/', incomeController.listIncomes);
router.get('/:id', incomeController.getIncomeById);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

export default router;
