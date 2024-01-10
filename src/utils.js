import BN from 'bn.js';
import { Config } from './db/models/Config.js';

export const bn = (value) => new BN(value);

export const ZERO_BI = bn(0);

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const isExecutionLock = async () => {
  const lock = await Config.findOne({
      param: "executionLock"
  });
  if(!lock) {
    await Config.create({
      param: "executionLock",
      value: "false"
    });
    
    return false;
  }
  return lock.value == "true";
}

export const lockExecution = async () => {
  console.log("Lock execution");
  const lock = await Config.findOne({
    param: "executionLock"
  });
  lock.set({value: "true"});
  await lock.save();
}

export const unlockExecution = async () => {
  console.log("Unlock execution");
  const lock = await Config.findOne({
    param: "executionLock"
  });
  lock.set({value: "false"});
  await lock.save();
}