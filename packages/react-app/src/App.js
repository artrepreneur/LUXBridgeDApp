import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button, Footer, Text, Box, Grommet, ResponsiveContext } from "grommet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Teleport from "./components/Teleport";
import Collapsible from "./components/Collapsible";
//import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";
import logoFooter from "./img/odapp-logo-footer.svg";
import { StyledButton, ButtonForm, ButtonFooter, ImageFooter, customBreakpoints } from "./components/";
import WalletConnectProvider from "@walletconnect/web3-provider";

import {
  Connect
} from 'grommet-icons';

var clr = '#FBA300';


var web3Provider, provider;
const forwarderOrigin = 'http://lux.wpkt.cash';

let connected = false;
let installed = false;
let accounts = null;
let connectedStr = "Wallet Connect";
let currentAccount = null;

async function isMetaMaskConnected() {
    const {ethereum} = window;
    accounts = await ethereum.request({method: 'eth_accounts'});
    console.log('In Metamask connection:', (accounts && accounts.length > 0));
    return Boolean(accounts && accounts.length > 0);
}

function isMetaMaskInstalled() {
    console.log('In isMetaMaskInstalled');
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
}


async function initialise() {
    connected = false;
    installed = false;
    connected = await isMetaMaskConnected();
    installed = isMetaMaskInstalled();
}

initialise();

if (typeof window.ethereum !== 'undefined') {
  window.ethereum.on('accountsChanged', async () => {
      await initialise();
      console.log('accounts changed here');
      if (connectedStr !== 'Wallet Connect'){
        window.location.reload();
      }

  });
}


const onClickConnect = async () => {
  const { ethereum } = window;
   try {
     // Will open the MetaMask UI
     console.log("Try to connect here");
     currentAccount = await ethereum.request({ method: 'eth_requestAccounts' });
     await initialise();
     console.log('current account:', currentAccount, accounts[0]);
   } catch (error) {
     console.error(error);
   }
 };

function WalletButton() {

  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  const [label, setLabel] = useState("Connect Wallet");


  return (
    <StyledButton id="connectButton" primary size='large' pad="medium" color='#F0B90C' label={label} onClick={async () => {
      await onClickConnect();
      connectedStr = (accounts && accounts.length > 0) ? ((accounts[0].toString()).slice(0,6))+'...' :  "Connect Wallet";
      console.log('currentAccount:',currentAccount, 'connectedStr:', connectedStr, 'connected:', connected, 'accounts:', (accounts && accounts.length > 0));
      setLabel(connectedStr);

      if (typeof window.ethereum === 'undefined') {
        onboarding.startOnboarding();
        return;
      }
    }}/>

  );
}



function App() {

  const { loading, error, data } = useQuery(GET_TRANSFERS);

  const items = [
    { label: 'Teleport', href: '/' },
  ];

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  //connectMetamask();

  return (
    <div>
    <Collapsible btn={ WalletButton() }/>
        <Router>
          <Switch>
            <Route exact path="/">
              <Teleport btn={ WalletButton() }/>
            </Route>

          </Switch>
        </Router>

    </div>
  );
}

export default App;
