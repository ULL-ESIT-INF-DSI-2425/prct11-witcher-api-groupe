import express from 'express';
import { TransactionModel } from '../models/transactions.js';
import { HunterModel } from '../models/hunter.js';
import { MerchantModel } from '../models/merchant.js';
import { GoodModel } from '../models/good.js';

const router = express.Router();

// Helper function to calculate total amount
const calculateTotalAmount = async (goods: { good: string; quantity: number }[]) => {
  let total = 0;
  for (const item of goods) {
    const good = await GoodModel.findById(item.good);
    if (!good) throw new Error(`Good with ID ${item.good} not found`);
    total += good.crownValue * item.quantity;
  }
  return total;
};

// Helper function to update stock
const updateStock = async (goods: { good: string; quantity: number }[], isPurchase: boolean) => {
  for (const item of goods) {
    const good = await GoodModel.findById(item.good);
    if (!good) throw new Error(`Good with ID ${item.good} not found`);
    good.stock = isPurchase ? good.stock - item.quantity : good.stock + item.quantity;
    if (good.stock < 0) throw new Error(`Insufficient stock for good ${good.name}`);
    await good.save();
  }
};

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.post('/', async (req, res) => {
  const { consumerName, consumerType, goods, date } = req.body;

  try {
    const consumer =
      consumerType === 'Hunter'
        ? await HunterModel.findOne({ name: consumerName })
        : await MerchantModel.findOne({ name: consumerName });

    if (!consumer) {
      res.status(404).send({ error: `${consumerType} with name ${consumerName} not found` });
    } else if (!goods || !Array.isArray(goods) || goods.length === 0) {
      res.status(400).send({ error: 'Goods must be a non-empty array' });
    } else if (!date || isNaN(Date.parse(date))) {
      res.status(400).send({ error: 'Invalid or missing date' });
    } else {
      const totalAmount = await calculateTotalAmount(goods);

      const transaction = new TransactionModel({
        consumer: consumer._id,
        consumerType,
        goods,
        date: new Date(date),
        purchaseType: consumerType === 'Hunter' ? 'purchase' : 'sale',
        totalAmount
      });

      await updateStock(goods, consumerType === 'Hunter');
      await transaction.save();

      res.status(201).send(transaction);
    }
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('Good with ID')) {
      res.status(400).send({ error: error.message });
    } else if (error.message.includes('Insufficient stock')) {
      res.status(409).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.get('/', async (req, res) => {
  try {
    const transactions = await TransactionModel.find(req.query).populate('goods.good');
    if (transactions.length !== 0) {
      res.status(200).send(transactions);
    } else {
      res.status(404).send('No Transactions found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.get('/date-range', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).send({ error: 'Both startDate and endDate are required' });
    return;
  }

  try {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).send({ error: 'Invalid date format. Use ISO 8601 format like 2025-05-07T14:40:02.153Z' });
      return;
    }

    const transactions = await TransactionModel.find({
      date: { $gte: start, $lte: end }
    }).populate('goods.good');

    if (transactions.length === 0) {
      res.status(404).send({ error: 'No transactions found in the given date range' });
      return;
    }

    res.status(200).send(transactions);
  } catch (err) {
    console.error('Error fetching transactions by date range:', err);
    res.status(500).send({ error: 'Failed' });
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.get('/:id', async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id).populate('goods.good');
    if (!transaction) {
      res.status(404).send({ error: 'Transaction not found' });
    }
    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (!transaction) {
     res.status(404).send({ error: 'Transaction not found' });
    } else {
      // Revert stock changes
      await updateStock(
        transaction.goods.map(item => ({ good: item.good.toString(), quantity: item.quantity })),
        transaction.purchaseType === 'sale'
      );
      await transaction.deleteOne();

      res.status(200).send(transaction);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;