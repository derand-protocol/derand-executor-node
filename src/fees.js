import Web3 from 'web3';
import axios from "axios";
import "dotenv/config";
import FEE_MANAGER_ABI from '../abis/DeRandFeeManager.json'  assert { type: "json" };
import { EVM_NETWORKS, FEE_MANAGER_ADDRESS, MUON_APP_ID } from './constants.js';
import { Transaction } from './db/models/Transaction.js';
import { FeeUsage } from './db/models/FeeUsage.js';
import { ZERO_BI, bn } from './utils.js';
import ethSigUtil from "@metamask/eth-sig-util";

export const consumerHasBalance = async (chainId, consumer) => {
  const rpc_url = "https://rpc.ankr.com/bsc";
  const web3 = new Web3(rpc_url);
  const contract = new web3.eth.Contract(
    FEE_MANAGER_ABI, FEE_MANAGER_ADDRESS
  );
  const executor = process.env.EXECUTOR_ADDRESS;

  const depositAmount = await contract.methods.deposits(
    consumer, chainId, executor).call();

  const url = process.env.FEE_BACKEND + "api/consumer-fee-usage/?" + 
  `chainId=${chainId}&executor=${executor}&consumer=${consumer}`;

  const { data: { data: { feeUsed } } } = await axios.get(url);

  if(feeUsed == undefined) {
    // TODO: retrive from the local DB
    throw new Error("Unable to fetch the fee amount used by the consumer");
  }

  return bn(depositAmount).gt(bn(feeUsed));
}

const convertEthToMuon = async (chainId, weiAmount) => {
  return weiAmount;
}

const updateFeeUsage = async (chainId, consumer, txHash) => {
  let feeUsage = await FeeUsage.findOne({
    chainId: chainId,
    consumer: consumer
  });
  
  if(!feeUsage) {
    feeUsage = await FeeUsage.create({
      chainId: chainId,
      consumer: consumer,
      amount: ZERO_BI
    });
  }

  const {
    rpc_url
  } = EVM_NETWORKS[chainId];

  try {
    const web3 = new Web3(rpc_url);
    tx = await web3.eth.getTransactionReceipt(txHash);
    const txFeeInWei = bn(tx.gasUsed).mul(bn(tx.effectiveGasPrice));

    feeUsage.amount = feeUsage.amount.add(
      await convertEthToMuon(chainId, txFeeInWei)
    );

    feeUsage.save();
  } catch (error) {
    console.log(error.message);
  }
}

export const saveTransaction = async (chainId, consumer, txHash) => {
  Transaction.create({
    chainId: chainId,
    consumer: consumer,
    hash: txHash
  });
  // updateFeeUsage(chainId, consumer, txHash);
}

export const syncFeeUsages = async () => {
  const transactions = await Transaction.find({synced: false});
  const apiUrl = process.env.FEE_BACKEND + "api/record-fee-usage";

  transactions.map(async (tx) => {
    try {
      console.log(`Transaction ${tx.hash} is synchronizing`);

      const response = await axios.post(apiUrl, {
        chainId: tx.chainId,
        txHash: tx.hash
      });
  
      const {
        data,
        status
      } = response;
  
      if(
        status == 200
      ) {
        if(data.success == true) {
          tx.synced = true;
          tx.save();
        } else if(Array.isArray(data.data)) {
          const validationFailure = data.data.filter(item => (
            item.path == "txHash" && item.msg == "Duplicate TX"
          ));
          if(validationFailure.length) {
            tx.synced = true;
            tx.save();
            console.log(`Tx ${tx.hash} is already synced`);
          }
        } else {
          console.log(`Fee backend: ${data.data}`);
        }
      } 
    } catch (error) {
      console.log(error.message);
    }
  });
}

export const muonFeeSignature = (chainId) => {
  const {
    rpc_url
  } = EVM_NETWORKS[chainId];

  const web3 = new Web3(rpc_url);

  let timestamp = Math.floor(Date.now());
  let wallet = web3.eth.accounts.privateKeyToAccount(
    `0x${process.env.FEE_DEPOSITER_PK}`
  );

  const address = wallet.address;
  const privateKey = wallet.privateKey.substring(2);

  let eip712TypedData = {
    types: {
      EIP712Domain: [{ name: "name", type: "string" }],
      Message: [
        { type: "address", name: "address" },
        { type: "uint64", name: "timestamp" },
        { type: "uint256", name: "appId" },
      ],
    },
    domain: { name: "Muonize" },
    primaryType: "Message",
    message: { address: address, timestamp, appId: MUON_APP_ID },
  };
  const sign = ethSigUtil.signTypedData({
    privateKey: privateKey,
    data: eip712TypedData,
    version: ethSigUtil.SignTypedDataVersion.V4,
  });

  return {
    spender: wallet.address,
    timestamp,
    signature: sign    
  }
}