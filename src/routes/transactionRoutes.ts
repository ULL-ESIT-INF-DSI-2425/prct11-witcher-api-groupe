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

// Create a transaction
router.post('/', async (req, res) => {
  const { consumerName, consumerType, goods } = req.body;

  try {
    const consumer =
      consumerType === 'Hunter'
        ? await HunterModel.findOne({ name: consumerName })
        : await MerchantModel.findOne({ name: consumerName });

    if (!consumer) {
      res.status(404).send({ error: `${consumerType} with name ${consumerName} not found` });
    } else {
      const totalAmount = await calculateTotalAmount(goods);
      const transaction = new TransactionModel({
      consumer: consumer._id,
      consumerType,
      goods,
      date: new Date(),
      purchaseType: consumerType === 'Hunter' ? 'Purchase' : 'Sale',
      totalAmount,
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

// Get transactions by query (consumer name, date range, or ID)
router.get('/', async (req, res) => {
  const { consumerName, startDate, endDate, type } = req.query;

  try {
    let filter: any = {};

    if (consumerName) {
      const hunter = await HunterModel.findOne({ name: consumerName });
      const merchant = await MerchantModel.findOne({ name: consumerName });
      if (!hunter || !merchant) {
        res.status(404).send({ error: 'Consumer not found' });
      } else {
        filter.consumer = hunter ? hunter._id : merchant._id;
      }
    }

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate.toString()), $lte: new Date(endDate.toString()) };
    }

    if (type) {
      filter.purchaseType = type;
    }

    const transactions = await TransactionModel.find(filter).populate('goods.good');
    if (transactions.length === 0) {
      res.status(404).send({ error: 'No transactions found' });
    }
    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id).populate('goods.good');
    if (!transaction) {
      res.status(404).send({ error: 'Transaction not found' });
    }
    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch transaction' });
  }
});

// Update transaction by ID
// router.patch('/:id', async (req, res) => {
//   try {
//     const transaction = await TransactionModel.findById(req.params.id);
//     if (!transaction) {
//       res.status(404).send({ error: 'Transaction not found' });
//     }

//     // Revert stock changes from the original transaction
//     await updateStock(transaction.goods, transaction.purchaseType === 'Sale');

//     // Update transaction fields
//     transaction.goods = req.body.goods || transaction.goods;
//     transaction.date = req.body.date || transaction.date;
//     transaction.totalAmount = await calculateTotalAmount(transaction.goods);

//     // Apply new stock changes
//     await updateStock(transaction.goods, transaction.purchaseType === 'Purchase');
//     await transaction.save();

//     res.status(200).send(transaction);
//   } catch (err) {
//     const error = err as Error;
//     if (error.message.includes('Good with ID')) {
//       res.status(400).send({ error: error.message });
//     } else if (error.message.includes('Insufficient stock')) {
//       res.status(409).send({ error: error.message });
//     } else {
//       res.status(500).send({ error: 'Failed to update transaction' });
//     }
//   }
// });

// // Delete transaction by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const transaction = await TransactionModel.findById(req.params.id);
//     if (!transaction) {
//       res.status(404).send({ error: 'Transaction not found' });
//     }

//     // Revert stock changes
//     await updateStock(transaction.goods, transaction.purchaseType === 'Sale');
//     await transaction.remove();

//     res.status(200).send(transaction);
//   } catch (err) {
//     res.status(500).send({ error: 'Failed to delete transaction' });
//   }
// });

export default router;