const express      = require('express');
const router       = express.Router();
const controller    = require('../controllers/expense.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const upload       = require('../middleware/upload.middleware');

router.post('/',             protect, upload.single('receipt'), controller.createExpense);
router.get('/',               protect, controller.getExpenses);
router.get('/:id',            protect, controller.getExpenseById);
router.patch('/:id/approve',  protect, restrictTo('MANAGER', 'ADMIN'), controller.approveExpense);
router.delete('/:id',         protect, controller.deleteExpense);

module.exports = router;