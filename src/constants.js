import 'dotenv/config';

export const MUON_APP_URL = `http://${process.env.MUON_GATEWAY}/v1/?app=vrf&method=random-number`
export const EMPTY_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const FEE_MANAGER_ADDRESS = "0x2519C3f3A714DeC1b5fe882725ECC4F1eB6CaAAD";

export const EVM_NETWORKS = {
  80001: {
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    coordinator_address: "0x6e3cf66cb5b6F56B2e57849833e02Ac98637eB83",
    graph_url: "https://api.thegraph.com/subgraphs/name/shayanshiravani/derand-mumbai"
  }
}