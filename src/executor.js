import Web3 from 'web3';
import axios from "axios";
import COORDINATOR_ABI from '../abis/DeRandCoordinator.json'  assert { type: "json" };
import { EMPTY_BYTES, EVM_NETWORKS } from './constants.js';
import { ChainParam } from './db/models/ChainParam.js';
import { isExecutionLock, lockExecution, sleep, unlockExecution } from './utils.js';
import "dotenv/config";
import { consumerHasBalance, saveTransaction } from './fees.js';
import { MuonApp } from './muon-helper.js';


const getRequests = async (graph_url, fromBlock) => {
  let response = [];
  let skip = 0;
  while(true) {
    try {
      const query = `
        {
          randomWordsRequesteds(
            first: 1000
            skip: ${skip}
            orderBy: blockNumber
            orderDirection: asc
            where: {
              blockNumber_gt: ${fromBlock}
            }
          ) {
            requestId
            sender
            callbackGasLimit
            blockNumber
            minimumRequestConfirmations
            numWords
            transactionHash
          }
        }
      `;

      const graph_response = await axios.post(graph_url, {
        query: query
      });

      const {
        data: { data },
        status
      } = graph_response;

      if (status == 200 && data) {
        const {
          randomWordsRequesteds,
        } = data;
        if(randomWordsRequesteds.length) {
          response = response.concat(randomWordsRequesteds);
          skip += 1000;
        } else {
          break;
        }
      } else {
        console.log(graph_response["data"]["errors"]);
        throw { message: 'INVALID_SUBGRAPH_RESPONSE' };
      }
    } catch (error) {
      console.log(error.message);
      await sleep(5000);
    }
  }
  return response;
}

class Coordinator {

  constructor(rpc_url, address) {
    this.web3 = new Web3(rpc_url);
    this.account = this.web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.WALLET_PRIVATE_KEY}`
    );
    this.address = address;
    this.contract = new this.web3.eth.Contract(COORDINATOR_ABI, address);
  }
  
  async commitmentExists (requestId) {
    const commitment = await this.contract.methods.getCommitment(requestId).call();
    return commitment != EMPTY_BYTES;
  }

  async fulfillRandomNumbers (
    requestId,
    blockNum,
    callbackGasLimit,
    numWords,
    sender,
    reqId,
    sig
  ) {
    const tx = this.contract.methods.fulfillRandomWords(
      requestId,
      {
        blockNum: blockNum,
        callbackGasLimit: callbackGasLimit,
        numWords: numWords,
        sender: sender
      },
      process.env.EXECUTOR_ADDRESS,
      reqId,
      sig
    );

    const options = {
      to: this.address,
      data: tx.encodeABI(),
      // gas: callbackGasLimit,
      gasPrice: await this.web3.eth.getGasPrice(),
      nonce: await this.web3.eth.getTransactionCount(this.account.address)
    };

    const signed  = await this.account.signTransaction(options);
    const receipt = await this.web3.eth.sendSignedTransaction(signed.rawTransaction);
    if(!receipt.status) {
      return false;
    }
    return receipt.transactionHash;
  }
}

export const run = async () => {
  if(await isExecutionLock()) {
    console.log("Execution is lock");
    return false;
  }
  await lockExecution();

  const muonApp = new MuonApp();

  await Promise.all(Object.keys(EVM_NETWORKS).map(async(chainId) => {
    try {
      const {
        rpc_url,
        coordinator_address,
        graph_url
      } = EVM_NETWORKS[chainId];
  
      const coordinator = new Coordinator(rpc_url, coordinator_address);
      
      const lastReadBlock = await ChainParam.findOne(
        { chainId: chainId, param: "lastReadBlock" }
      );
  
      let fromBlock =  parseInt(lastReadBlock?.value) || 0;
      const requests = await getRequests(graph_url, fromBlock);
  
      console.log("FromBlock:", fromBlock);
      console.log("Requests length:", requests.length);
  
      /**
       * We should do it serially because consumer can have multiple requests
       * and we should reduce its credit before processing the next request
       */
      for (let i = 0; i < requests.length; i++) {
        const {
          requestId,
          callbackGasLimit,
          numWords,
          sender,
          blockNumber,
          transactionHash
        } = requests[i];
  
        fromBlock = blockNumber > fromBlock ? blockNumber : fromBlock;
  
        if(!await coordinator.commitmentExists(requestId.toString())) {
          continue;
        }

        if(!await consumerHasBalance(chainId, sender)) {
          continue;
        }
  
        console.log(`Consumer: ${sender}`);
        console.log(`Process the request ${requestId}`);

        const { reqId, signature } = await muonApp.getSignature(chainId, transactionHash);

        const txHash = await coordinator.fulfillRandomNumbers(
          requestId,
          blockNumber, 
          callbackGasLimit, 
          numWords,
          sender,
          reqId,
          signature
        );
  
        saveTransaction(chainId, sender, txHash);    
      }
  
      if(
        lastReadBlock
      ) {
        lastReadBlock.set({value: fromBlock});
        await lastReadBlock.save();
      } else {
        await ChainParam.create({
          chainId: chainId,
          param: "lastReadBlock",
          value: fromBlock
        });
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }));

  unlockExecution();
}