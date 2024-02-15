import 'dotenv/config';

export const MUON_APP_URL = `http://${process.env.MUON_GATEWAY}/v1/?app=derand`
export const EMPTY_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const FEE_MANAGER_ADDRESS = "0x0a91e04C4947D0Ba9B62b84d735A345b6018D762";
export const MUON_APP_ID = "93503201847067459816865778983521324688116667814772937141130154736249866362126";
export const MUON_EXPLORER_API = "https://explorer.muon.net/alice/api/v1/requests";

export const EVM_NETWORKS = {
  80001: {
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    coordinator_address: "0x3abAAD56d723b0aBEC11d5e8a2F1918AaaFbf698",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-mumbai"
  },
  97: {
    rpc_url: "https://bsc-testnet.publicnode.com",
    coordinator_address: "0xfb0522d3c1F3236560f79040f01A35af327098c9",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-bsc-testnet"
  },
  11155111: {
    rpc_url: "https://rpc.ankr.com/eth_sepolia",
    coordinator_address: "0x518D6d9e790457C9E822894D4AeBB757a170b443",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-sepolia"
  },
  5: {
    rpc_url: "https://rpc.ankr.com/eth_goerli",
    coordinator_address: "0x52136E7D4714214f3fEF223648f984b08700da23",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-goerli"
  },
  43113: {
    rpc_url: "https://rpc.ankr.com/avalanche_fuji",
    coordinator_address: "0x3D1CBd70145b4025579DBFbBe643517C299bD423",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-avalanche-fuji"
  }
}