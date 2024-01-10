import cron from 'node-cron';
import { run } from './src/executor.js';
import db from "./src/db/index.js";
import { syncFeeUsages } from './src/fees.js';
import { isExecutionLock, unlockExecution } from './src/utils.js';


const main = async () => {
  await db.init();

  if(await isExecutionLock()) {
    await unlockExecution();
  }

  cron.schedule('* * * * *', async () => {
    try {
      await run();
    } catch (error) {
      await unlockExecution();
      console.log(error.message);
    }
  });

  cron.schedule('* * * * *', async () => {
    syncFeeUsages();
  });
}


main();