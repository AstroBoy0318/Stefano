import { ExternalProvider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback } from "react";
import { CHAIN_ID, RPC_URL } from "../constansts";
import { ConnectorNames } from "../constansts/types";
import { connectorsByName, getProvider, setProvider } from "../utils/Web3React";

export function useReadProvider() {
    return new ethers.providers.JsonRpcProvider(RPC_URL);
}

export function useAuth() {
    const { chainId, activate, deactivate, setError } = useWeb3React()
    const login = useCallback(
        async (connectorID: ConnectorNames) => {
            const connector = connectorsByName[connectorID]
            if (typeof connector !== 'function' && connector) {
                await activate(connector, async (error: Error) => {
                    if (error instanceof UnsupportedChainIdError) {
                        const provider = await connector.getProvider()
                        const hasSetup = await setupNetwork(provider)
                        if (hasSetup) {
                            activate(connector)
                        }
                    }
                })                  
                setProvider(connectorID)
            }
        }, [activate]
    )

    const checkLogin = useCallback(
        async () => {
            if (getProvider() !== null && getProvider() !== "") {
                login(getProvider() as ConnectorNames)
            }
        }, [activate]
    )

    const logout = useCallback(() => {
        deactivate()
        setProvider("")
    }, [deactivate])

    return { login, logout, checkLogin }
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (externalProvider?: ExternalProvider) => {
    const provider = externalProvider || window.ethereum
    const chainId = parseInt(CHAIN_ID.toString(), 10)
    if (provider) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            })
            return true
        } catch (switchError) {
        }
    }
}