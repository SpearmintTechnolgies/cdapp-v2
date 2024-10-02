'use client';
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, fallback, http } from "wagmi";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  phantomWallet,
  trustWallet,
  metaMaskWallet

} from '@rainbow-me/rainbowkit/wallets';

import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import ContractContextProvider from "./Context/ContractContext";
import { bscTestnet, coreDao, mainnet } from "viem/chains";
import { createConfig } from 'wagmi';


const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet,walletConnectWallet,phantomWallet,trustWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
  }
);
 
 const _coreDao = {
  id: 1116, // Tron Mainnet chain ID
  name: "Core Blockchain Mainnet",
  network: "core",
  nativeCurrency: {
    name: "CORE",
    symbol: "CORE",
    decimals: 18,
  },
  rpcUrls: {
     default: {
      http: [process.env.NEXT_PUBLIC_CORE_RPC],
    },
  },
  blockExplorers: {
    default: { name: "CoreScan", url: "https://scan.coredao.org/" },
  },
  iconUrl: "https://icons.llamao.fi/icons/chains/rsz_core.jpg", // Tron logo URL
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, bscTestnet,_coreDao]  
});

// const config = createConfig({
//   chains: [mainnet, bscTestnet],
//   connectors,
//   transports: {
//     [mainnet.id]: http(),
//     [bscTestnet.id]: http(),
//   },
// });
const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
  <>
  <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          // theme={darkTheme({
          //   // accentColor: 'linear-gradient(270deg, #960065 0%, #B651C5 100%)',
          //   accentColor: "#45125E",
          //   accentColorForeground: "white",
          //   borderRadius: "large",
          //   fontFamily: "latoBold",
          // })}
        >
          <ContractContextProvider>
          {children}
          </ContractContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider></>
  );
}
