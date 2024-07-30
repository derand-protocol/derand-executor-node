import 'dotenv/config';

export const MUON_APP_URL = `http://${process.env.MUON_GATEWAY}/v1/`
export const EMPTY_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const FEE_MANAGER_ADDRESS = "0x134686fc7F90b42Ad29Fef4E361786589F33598b";
export const MUON_APP_ID = "93503201847067459816865778983521324688116667814772937141130154736249866362126";
export const MUON_EXPLORER_API = "https://explorer.muon.net/pion/api/v1/requests";

export const EVM_NETWORKS = {
  // 56: {
  //   rpc_url: "https://rpc.ankr.com/bsc",
  //   coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
  //   graph_url: "https://api.studio.thegraph.com/query/71642/derand-bsc/version/latest"
  // },
  59144: {
    rpc_url: "https://rpc.linea.build",
    coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
    graph_url: "https://api.studio.thegraph.com/query/21879/derand-linea/version/latest"
  },
  10: {
    rpc_url: "https://rpc.ankr.com/optimism",
    coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
    graph_url: "https://api.studio.thegraph.com/query/71642/derand-optimism/version/latest"
  },
  8453: {
    rpc_url: "https://rpc.ankr.com/base",
    coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
    graph_url: "https://api.studio.thegraph.com/query/71642/derand-base/version/latest"
  },
  534352: {
    rpc_url: "https://rpc.scroll.io",
    coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
    graph_url: "https://api.studio.thegraph.com/query/71642/derand-scroll/version/latest"
  },
  7001: {
    rpc_url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    coordinator_address: "0x24092A71ae67b6773F6ecdc56a9E153e5C57D2E7",
    graph_url: "https://subgraph.satsuma-prod.com/96389a812495/shayans-team--869747/derand-zeta-testnet/api",
  },
}