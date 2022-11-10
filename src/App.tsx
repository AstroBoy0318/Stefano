import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import Home from './home';
import { Web3ContextProvider } from 'ethers-react'
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './utils/Web3React';

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Container fluid>
        <Row>
          <Col>
            <Home />
          </Col>
        </Row>
      </Container>
    </Web3ReactProvider>
  );
}

export default App;
