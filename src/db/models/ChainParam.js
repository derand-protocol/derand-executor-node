import { Schema, model } from 'mongoose';

const ChainParamSchema = new Schema({
  chainId: { type: Number },
  param: { type: String },
  value: { type: String }
});

ChainParamSchema.index({ chainId: 1, param: 1}, { unique: true });

export const ChainParam = model('ChainParam', ChainParamSchema)