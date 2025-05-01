import { model, Schema } from "mongoose";
import { TransactionI } from "../include/interface.js";
import { TransactionType } from "../include/enum.js";

const transactionSchema = new Schema<TransactionI>({
  consumer: {
    type: Schema.Types.ObjectId,
    ref: 'Hunter', 
    required: true
  },
  consumerType: {
    type: String, 
    required: true, 
    enum: ['Hunter', 'Merchant']
  }, 
  goods: [
    {
      good: {
        type: Schema.Types.ObjectId, 
        ref: 'Good', 
        required: true
      }, 
      quantity: {
        type: Number, 
        required: true 
      }
    }
  ],
  date: {
    type: Date,
    required: true
  }, 
  purchaseType: {
    type: String, 
    required: true,
    enum: Object.values(TransactionType)
  }, 
  totalAmount: {
    type: Number, 
    required: true
  },
}, {
  timestamps: true, 
});

export const TransactionModel = model<TransactionI>('Transaction', transactionSchema); 