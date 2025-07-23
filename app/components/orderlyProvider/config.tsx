import { init } from "@web3-onboard/react";
import type { OnboardAPI, WalletState } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import binanceModule from "@binance/w3w-blocknative-connector";

let onboardInstance: OnboardAPI | null = null;
let hasAttemptedSwitch = false;
let lastConnectedWallet: string | null = null;

const getDefaultChainId = (isMainnet: boolean = true): string => {
  return isMainnet ? "0x38" : "0x66eee";
};

// const handleNetworkSwitch = async (walletState: WalletState[]) => {
//   if (!onboardInstance || !walletState || walletState.length === 0) return;

//   const connectedWallet = walletState[0];
//   if (!connectedWallet?.chains?.[0] || !connectedWallet.accounts?.length)
//     return;

//   const currentWalletId = `${connectedWallet.label}-${connectedWallet.accounts[0].address}`;

//   if (hasAttemptedSwitch && lastConnectedWallet === currentWalletId) {
//     return;
//   }

//   hasAttemptedSwitch = true;
//   lastConnectedWallet = currentWalletId;

//   const currentNetworkId =
//     typeof window !== "undefined"
//       ? localStorage.getItem("orderly_network_id") || "mainnet"
//       : "mainnet";

//   const isMainnet = currentNetworkId === "mainnet";
//   const expectedChainId = getDefaultChainId(isMainnet);
//   const currentChainId = connectedWallet.chains[0].id;

//   if (currentChainId !== expectedChainId) {
//     console.log(`Switching from ${currentChainId} to ${expectedChainId}`);

//     try {
//       const success = await onboardInstance.setChain({
//         chainId: expectedChainId,
//         wallet: connectedWallet.label,
//       });

//       if (success) {
//         console.log(`Successfully switched to chain ${expectedChainId}`);
//       } else {
//         console.warn(`Failed to switch to chain ${expectedChainId}`);
//       }
//     } catch (error) {
//       console.error("Error switching chain:", error);
//     }
//   }
// };

const resetSwitchTracking = (walletState: WalletState[]) => {
  if (!walletState || walletState.length === 0) {
    hasAttemptedSwitch = false;
    lastConnectedWallet = null;
  }
};

export async function initOnBoard() {
  const mainChains = [
    {
      id: `0x${(42161).toString(16)}`,
      token: "ETH",
      label: "Arbitrum",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
    },
    {
      id: `0x${(10).toString(16)}`,
      token: "ETH",
      label: "Optimism",
      rpcUrl: "https://mainnet.optimism.io",
    },
    {
      id: `0x${(137).toString(16)}`,
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://rpc-mainnet.matic.network",
    },
    {
      id: `0x${(8453).toString(16)}`,
      label: "Base",
      token: "ETH",
      rpcUrl: "https://base-rpc.publicnode.com",
    },
    {
      id: `0x${(43114).toString(16)}`,
      label: "Avalanche",
      token: "AVAX",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    },
    {
      id: `0x${(1).toString(16)}`,
      label: "Ethereum",
      token: "ETH",
      rpcUrl: "https://mainnet.infura.io/v3/9155d40884554acdb17699a18a1fe348",
    },
    {
      id: `0x${(56).toString(16)}`,
      label: "BNB Chain",
      token: "BNB",
      rpcUrl: "https://bsc-dataseed1.binance.org/",
    },
    {
      id: `0x${(5000).toString(16)}`,
      label: "Mantle",
      token: "MNT",
      rpcUrl: "https://rpc.mantle.xyz",
    },
    {
      id: `0x${(1329).toString(16)}`,
      label: "Sei Network",
      token: "SEI",
      rpcUrl: "https://sei.drpc.org",
    },
    {
      id: `0x${(2818).toString(16)}`,
      label: "Morph",
      token: "ETH",
      rpcUrl: "https://rpc-quicknode.morphl2.io",
    },
    {
      id: `0x${(146).toString(16)}`,
      label: "Sonic",
      token: "S",
      rpcUrl: "https://sonic.therpc.io",
    },
    {
      id: `0x${(80094).toString(16)}`,
      label: "Berachain",
      token: "BERA",
      rpcUrl: "https://rpc.berachain.com",
    },
    {
      id: `0x${(34443).toString(16)}`,
      label: "Mode",
      token: "ETH",
      rpcUrl: "https://mode.drpc.org",
    },
    {
      id: `0x${(98866).toString(16)}`,
      label: "Plume Mainnet",
      token: "PLUME",
      rpcUrl: "https://rpc.plume.org",
    },
    {
      id: `0x${(1514).toString(16)}`,
      label: "Story",
      token: "IP",
      rpcUrl: "https://mainnet.storyrpc.io",
    },
  ];

  // const testChains = [
  //   {
  //     id: `0x${(421614).toString(16)}`,
  //     token: "ETH",
  //     label: "Arbitrum Sepolia",
  //     rpcUrl: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  //   },
  //   {
  //     id: `0x${(4460).toString(16)}`,
  //     token: "ETH",
  //     label: "Orderly Network Testnet",
  //     rpcUrl: "https://rpc-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz",
  //   },
  //   {
  //     id: `0x${(11155111).toString(16)}`,
  //     label: "Sepolia",
  //     token: "SepoliaETH",
  //     rpcUrl: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
  //   },
  //   {
  //     id: `0x${(43113).toString(16)}`,
  //     label: "Avalanche Fuji Testnet",
  //     rpcUrl: "https://api.zan.top/avax-fuji/ext/bc/C/rpc",
  //     token: "AVAX",
  //     blockExplorerUrl: "https://testnet.snowscan.xyz",
  //   },
  //   {
  //     id: `0x${(84532).toString(16)}`,
  //     label: "Base Sepolia",
  //     token: "ETH",
  //     rpcUrl: "https://base-sepolia.publicnode.com",
  //   },
  //   {
  //     id: `0x${(11155420).toString(16)}`,
  //     label: "Optimism Sepolia",
  //     token: "ETH",
  //     rpcUrl: "https://optimism-sepolia.publicnode.com",
  //   },
  // ];

  const binance = binanceModule({ options: { lng: "en" } });
  const wcV2InitOptions = {
    version: 2,
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    dappUrl: window.location.origin,
  };
  const injected = injectedModule();
  const walletConnect = walletConnectModule(wcV2InitOptions);
  const wallets = [injected, walletConnect];
  if (!checkIfBinanceApp()) {
    wallets.push(binance);
  }

  return Promise.resolve().then(() => {
    if (onboardInstance) {
      return onboardInstance;
    }
    onboardInstance = init({
      wallets,
      chains: [...mainChains],
      appMetadata: {
        name: "Aden DEX",
        description: "Aden DEX",
        icon: `${import.meta.env.VITE_BASE_URL || ""}/logo-secondary.svg`,
      },
      theme: {
        "--w3o-background-color": "#1b112c",
        "--w3o-foreground-color": "#28183e",
        "--w3o-text-color": "#ffffff",
        "--w3o-border-color": "#3a2b50",
        "--w3o-action-color": "#b084e9",
        "--w3o-border-radius": "16px",
        "--w3o-font-family": "Atyp Text, sans-serif",
      },
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        },
      },
      connect: {
        autoConnectLastWallet: true,
      },
    });

    // Subscribe to wallet state changes to detect connections/disconnections
    const walletState = onboardInstance.state.select("wallets");
    // walletState.subscribe((wallets: WalletState[]) => {
    //   // Reset tracking when wallet disconnects
    //   resetSwitchTracking(wallets);

    //   // Check if a wallet just connected (has an account) and we haven't attempted switch yet
    //   if (wallets && wallets.length > 0 && wallets[0].accounts?.length > 0) {
    //     // Add a small delay to ensure the wallet is fully connected
    //     setTimeout(() => {
    //       handleNetworkSwitch(wallets);
    //     }, 500);
    //   }
    // });

    return onboardInstance;
  });
}

function checkIfBinanceApp() {
  const userAgent = navigator.userAgent;
  console.log("userAgent", userAgent);
  return userAgent.includes("BNC");
}
