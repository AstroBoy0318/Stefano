import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { CHAIN_ID, ProviderKey, RPC_URL } from "../constansts";
import { ConnectorNames } from "../constansts/types";

const POLLING_INTERVAL = 12000

const chainId = parseInt(CHAIN_ID.toString(), 10)

const injected = new InjectedConnector({ supportedChainIds: [chainId] })
const walletLink = new WalletLinkConnector({
    url: RPC_URL,
    appName: "Yonko NFT staking"
});

export const connectorsByName = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletLink]: walletLink,
} as const

export const getLibrary = (provider: any): Web3Provider => {
    const library = new Web3Provider(provider)
    library.pollingInterval = POLLING_INTERVAL
    return library
}

export const setProvider = (type: string) => {
    window.localStorage.setItem(ProviderKey, type);
};

export const getProvider = () => {
    return window.localStorage.getItem(ProviderKey);
};