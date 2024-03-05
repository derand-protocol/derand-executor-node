import axios from "axios";
import { MUON_APP_URL, MUON_EXPLORER_API } from "./constants.js";
// import { muonFeeSignature } from "./fees.js";

class MuonApp {
  async getSignature(chainId, txHash) {
    // const fee = muonFeeSignature(chainId);

    const requestData = {
      app: "derand",
      method: "random-number",
      // fee,
      params: {
        chainId,
        txHash
      },
      // mode: "sign"
    };

    const response = await axios.post(MUON_APP_URL, requestData);
    const muonSig = response.data;

    if(!muonSig) {
      throw new Error("Invalid muon response");
    }

    const { success, result } = muonSig

    if(!success) {
      const reqId = await this.#getLockReqId(chainId, txHash);
      if(reqId) {
        const muonExplorer = new MuonExplorer(MUON_EXPLORER_API);
        const lockRequest = await muonExplorer.fetchRequest(reqId);
        const { data, signatures } = lockRequest;
        const signature = {
          signature: signatures[0]["signature"],
          owner: signatures[0]["owner"],
          nonce: data["init"]["nonceAddress"],
        };
        return { reqId, signature };
      }
      throw new Error("Unable to retrieve muon signature");
    } else {
      const reqId = result["reqId"];
      const signature = {
        signature: result["signatures"][0]["signature"],
        owner: result["signatures"][0]["owner"],
        nonce: result["data"]["init"]["nonceAddress"],
      };
  
      return { reqId, signature };
    }
  }

  async #getLockReqId(chainId, txHash) {
    const response = await axios.get(
      `${MUON_APP_URL}&method=delete-global-memory&params[chainId]=${chainId}&params[txHash]=${txHash}`
    );
    const data = response.data;
    if(!data.success) {
      const { message } = data.error;
      if(message) {
        const matches = message.match(/0x.*/);
        if(matches && matches.length) {
          return matches[0];
        }
      }
    }
    return false;
  }
}

class MuonExplorer {
  constructor(apiUrl) {
    this.apiURL = apiUrl;
  }

  async fetchRequest(requestId) {
    return axios.get(`${this.apiURL}/${requestId}`)
      .then(({data}) => data?.request)
      .catch(e => undefined);
  }
}


export {
  MuonApp
}