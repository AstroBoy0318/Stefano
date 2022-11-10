import { useWeb3React } from "@web3-react/core";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ConnectorNames } from "../constansts/types";
import { useAuth } from "../hooks/connector";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import { useStoreContract } from "../hooks/contract";

const Container = styled.div`
    max-width: 1272px;
    width: 100%;
    margin: 0 auto;
    padding-top: 10rem;
`

export default function Home() {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const { login, checkLogin, logout } = useAuth()
    const { account } = useWeb3React()
    const contract = useStoreContract()
    const [ pending, setPending ] = useState(false)
    const keyInput = useRef<HTMLInputElement>(null);
    const valueInput = useRef<HTMLInputElement>(null);

    const doLogin = (connectorId: ConnectorNames, walletType: string) => {
        switch (walletType) {
            case "metamask":
                if (!window?.ethereum?.isMetaMask) {
                    toast.error('Metamask is not installed!');
                    return;
                }
                break;
            case "trustwallet":
                if (!window?.ethereum?.isTrust) {
                    toast.error('Trustwallet is not installed!');
                    return;
                }
                break;
            case "coinbase":
                break;
            default:
                return;
        }
        login(connectorId)
        handleClose()
    }

    useEffect(() => {
        checkLogin();
    }, [])

    const doSubmit = async ()=>{
        try{
            setPending(true);
            if(keyInput?.current && valueInput?.current) {
                let tx = await contract?.putData(keyInput.current.value, valueInput.current.value);
                await tx.wait();
            }
        } catch (error: any) {
            const errorDescription = `${error.message} - ${error.data?.message}`
            toast.error(errorDescription);
            setPending(false);
        }
    }

    return (<Container className="pt-0">
        <div className="mb-3">
            <label className="form-label">Key</label>
            <input type="text" ref={keyInput} className="form-control" placeholder="Key" />
        </div>
        <div className="mb-3">
            <label className="form-label">Value</label>
            <input type="text" ref={valueInput} className="form-control" placeholder="Value" />
        </div>
        <div className="col-auto text-center">
            {
            account?
            <Button disabled={pending} className="mb-3" variant="primary" onClick={doSubmit}>Confirm identity</Button>
            :<Button className="mb-3" variant="primary" onClick={handleShow}>Connect</Button>
            }
        </div>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="colored"
        />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="text-black">Connect Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="text-center m-1 border rounded p-2" onClick={() => doLogin(ConnectorNames.Injected, "metamask")}>
                        <img className="w-100" src="https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg" />
                        <div className="text-black">
                            Metamask
                        </div>
                    </Col>
                    <Col className="text-center m-1 border rounded p-2" onClick={() => doLogin(ConnectorNames.Injected, "trustwallet")}>
                        <img className="w-100" src="https://trustwallet.com/assets/images/media/assets/trust_platform.svg" />
                        <div className="text-black">
                            TrustWallet
                        </div>
                    </Col>
                    <Col className="text-center m-1 border rounded p-2" onClick={() => doLogin(ConnectorNames.WalletLink, "coinbase")}>
                        <div className="w-100 p-3">
                            <img className="w-100" src="https://avatars.githubusercontent.com/u/18060234?s=200&v=4" />
                        </div>
                        <div className="text-black">
                            Coinbase Wallet
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    </Container>)
}