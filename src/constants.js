import 'dotenv/config';

export const MUON_APP_URL = `http://${process.env.MUON_GATEWAY}/v1/?app=vrf&method=random-number`
export const EMPTY_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const FEE_MANAGER_ADDRESS = "0x0a91e04C4947D0Ba9B62b84d735A345b6018D762";

export const EVM_NETWORKS = {
  80001: {
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    coordinator_address: "0x6e3cf66cb5b6F56B2e57849833e02Ac98637eB83",
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