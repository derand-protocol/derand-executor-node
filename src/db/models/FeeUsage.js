import { Schema, model } from 'mongoose';

const FeeUsageSchema = new Schema({
  chainId: { type: Number },
  consumer: { type: String },
  amount: { type: BigInt }
});

FeeUsageSchema.index({ chainId: 1, consumer: 1}, { unique: true });

export const FeeUsage = model('FeeUsage', FeeUsageSchema)