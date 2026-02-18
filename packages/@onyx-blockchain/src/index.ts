import { createConfig, http, injected, WagmiProvider, type Config } from 'wagmi'
import { anvil } from 'wagmi/chains'
import { metaMask, safe, walletConnect } from 'wagmi/connectors'

const config: Config = createConfig({
  chains: [anvil],
  connectors: [
    injected(),
    walletConnect({projectId: '<WALLET_CONNECT_PROJECT_ID>'}),
    metaMask(),
    safe()
  ],
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'),
  },
})

export default config

export * from "@/actions/index"
export * from "@/contracts/index"
export * from "@/hooks/index"
export * from "@/types/index"

