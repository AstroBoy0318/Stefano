import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useReadProvider } from "./connector";
import storeAbi from "../constansts/abi/store.json";
import {STORE_ADDRESS} from "../constansts";

export function useContract(address: string, abi: any, usingSigner = true) {
    const {library,account} = useWeb3React();
    const provider = useReadProvider();

    return useMemo(() => {
        if(!library && usingSigner)
            return null;
        return new ethers.Contract(address, abi, usingSigner?library.getSigner(account).connectUnchecked():provider);
    }, [library, usingSigner])
}

export function useStoreContract(usingSigner = true) {
    return useContract(STORE_ADDRESS, storeAbi, usingSigner);
}