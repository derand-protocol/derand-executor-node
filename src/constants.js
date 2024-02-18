import 'dotenv/config';

export const MUON_APP_URL = `http://${process.env.MUON_GATEWAY}/v1/?app=derand`
export const EMPTY_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const FEE_MANAGER_ADDRESS = "0xf7BDEfbc18A3404ee2A2fF6f7598D3909b4961FD";
export const MUON_APP_ID = "93503201847067459816865778983521324688116667814772937141130154736249866362126";
export const MUON_EXPLORER_API = "https://explorer.muon.net/alice/api/v1/requests";

export const EVM_NETWORKS = {
  80001: {
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    coordinator_address: "0x7C7DA3d2a57fb63936fB4824a88Dc7C581c9bA6D",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-mumbai"
  },
  97: {
    rpc_url: "https://bsc-testnet.publicnode.com",
    coordinator_address: "0xc251Ec1ab514Aa8842B4f437b7e5c6cF4abE56Aa",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-bsc-testnet"
  },
  11155111: {
    rpc_url: "https://rpc.ankr.com/eth_sepolia",
    coordinator_address: "0xcfF6Cd4ddb0AF2f27F670f53018b5099Fd674370",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-sepolia"
  },
  5: {
    rpc_url: "https://rpc.ankr.com/eth_goerli",
    coordinator_address: "0x14157aa3B1aA584813c41511B3A34CD40774665E",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-goerli"
  },
  43113: {
    rpc_url: "https://rpc.ankr.com/avalanche_fuji",
    coordinator_address: "0xd8108Dc8d8675c84c8E7377Fc790E188c05f07A0",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-avalanche-fuji"
  }
}