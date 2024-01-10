import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
  chainId: { type: String },
  consumer: { type: String },
  hash: { type: String },
  synced: { type: Boolean, default: false }
});

export const Transaction = model('Transaction', TransactionSchema)