import React, { useState } from "react";
import Cookies from 'universal-cookie';
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
import { useLocation } from "react-router-dom";
//import useWeb3Modal from "../hooks/useWeb3Modal";
import MetaMaskOnboarding from '@metamask/onboarding';

import addresses from "./abi/addresses";
import abis from "./abi/abis";
import { Grid, Form, Box, Card, Text, CardBody, Spinner, TextInput, FormField, Heading, ResponsiveContext, RadioButtonGroup, Grommet, Menu } from "grommet";
import { ButtonForm, StyledButton, HeadingDark, StyledTextDark, customBreakpoints } from ".";
import Web3 from "web3";

import ethLogo from "../img/eth.svg";
import luxLogo from "../img/lux-logo-2.svg";
import EthereumLogo from "../img/matic.svg";
import { Blank, FormDown } from 'grommet-icons';

const cookies = new Cookies();
var pktTID;
var provider;
var signer;
var LBTC_Lux = null;
var LBTC_Eth = null;
var Teleport_Lux = null;
var Teleport_Eth = null;
var fromTeleportAddr;
var LBTC_From_Con;
var TeleportContractBurn, TeleportContractMint;
var toTokenAddress = addresses.LBTC_Lux;
var fromTokenAddress = addresses.LBTC_Eth;
var fromNetRadio, toNetRadio, fromChainId, toChainId;
/* Net Id  stuff */
var luxNetId = 43113;
var ethNetId = 4;
var fromNetId = ethNetId;
var toNetId = luxNetId;
var toTargetAddrHash, toTokenAddrHash, toNetIdHash, signature, hashedTxId, tokenAddrHash, vault, networkType;
var dv, dv1, dv3, dv4, dv5;
var initialAmt, amt;
var mm_provider, usrBalance, loc;
var completePhase = false;
var tokenName = null;
var msgSig = null;
var evmToAddress = null;
var msg ="Sign to prove you are initiator of transaction.";
var cookieArr = ['amount', 'cnt', 'fromNetId', 'toNetId', 'tx', 'msgSig', 'tokenName', 'evmToAddress','toTokenAddress', 'fromNetRadio', 'toNetRadio'];


/*const chainParams = new Map();
chainParams.set('97', {chainName:"Smart Chain Testnet", rpcUrl:"https://data-seed-preLux-1-s1.binance.org:8545", nativeCurrencyName:"BNB", nativeCurrencySymbol:"BNB", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://testnet.Luxscan.com"});
chainParams.set('56', {chainName:"Smart Chain", rpcUrl:"https://Lux-dataseed.binance.org/", nativeCurrencyName:"BNB", nativeCurrencySymbol:"BNB", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://Luxscan.com/"});
chainParams.set('137', {chainName:"Ethereum", rpcUrl:"https://rpc-mainnet.Ethereumvigil.com", nativeCurrencyName:"Ethereum", nativeCurrencySymbol:"Ethereum", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://explorer.Ethereum.network"});
chainParams.set('80001', {chainName:"Mumbai Testnet", rpcUrl:"https://rpc-mumbai.Ethereumvigil.com/", nativeCurrencyName:"Ethereum", nativeCurrencySymbol:"Ethereum", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://mumbai-explorer.Ethereum.today"});
chainParams.set('43114', {chainName:"AVAX", rpcUrl:"https://api.avax.network/ext/bc/C/rpc", nativeCurrencyName:"AVAX", nativeCurrencySymbol:"AVAX", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://cchain.explorer.avax.network/"});
chainParams.set('250', {chainName:"Fantom", rpcUrl:"https://rpc.ftm.tools/", nativeCurrencyName:"FTM", nativeCurrencySymbol:"FTM", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://ftmscan.com"});
*/

export const EthIcon = props => (
  <Blank {...props}>
    <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <image href={ethLogo} height="24" width="24"/>text
    </svg>
  </Blank>
);

export const LuxIcon = props => (
  <Blank {...props}>
    <svg viewBox="4 4 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <image href={luxLogo} height="32" width="32"/>
    </svg>
  </Blank>
);



/* Testnet / Main net flipping */
if (luxNetId===43113|| ethNetId===4 ){
    networkType = "testnet";
}
else if (luxNetId===43114 || ethNetId===1 ){
    networkType = "mainnet";
}


var formWrapStyle = {
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.161)",
    width: "85%"
  }
  var formWrapStyleMed = {
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.161)",
    width: "80%"
  };
  var formWrapStyleMob = {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    minWidth: "50vw",
    width: "auto"
  };

function getImageForTokenName(tokenName){
  var imageLink;
  switch(tokenName) {
      case "LuxBTC":
        imageLink = 'https://lux.wpkt.cash/LuxLogoLarge.png';
        break;
      case "LuxETH":
        imageLink = 'https://lux.wpkt.cash/LuxLogoLarge.png';
        break;
      case "LuxUSD":
        imageLink = 'https://lux.wpkt.cash/LuxLogoLarge.png';
        break;
  }

  return imageLink;
}

async function addTeleport(){

    const tokenSymbol = tokenName;
    const tokenDecimals = 18;
    const tokenImage = getImageForTokenName(tokenName);
    await setNets();
    console.log('toTokenAddress', toTokenAddress);

    try {

        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: toTokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                },
            },
        });

    } catch (error) {
        console.log(error);
    }
}

function getBlockHeight(str){
  var arr = str.split('|');
  return arr[1];
}


async function switchChain(chainId){
  if (window.ethereum) {
     try {
       // check if the chain to connect to is installed
       await window.ethereum.request({
         method: 'wallet_switchEthereumChain',
         params: [{ chainId: chainId }],
       });
     } catch (error) {

       // Error indicates that the chain has not been added to MetaMask
       if (error.code === 4902) {
         try {

           /*
            // Adds a wider range of chains with more detail
            const params = [{
                "chainId": chainId,
                "chainName": chainParams.get(chainId.toString()).chainName,
                "rpcUrls": [
                    chainParams.get(chainId.toString()).rpcUrl
                ],
                "nativeCurrency": {
                    "name": chainParams.get(chainId.toString()).nativeCurrencyName,
                    "symbol": chainParams.get(chainId.toString()).nativeCurrencySymbol,
                    "decimals": chainParams.get(chainId.toString()).nativeCurrencyDecimals
                },
                "blockExplorerUrls": [
                    chainParams.get(chainId.toString()).blockExplorerUrl
                ]
            }]*/

           await window.ethereum.request({
             method: 'wallet_addEthereumChain',
             params: [
               {
                 chainId: chainId,
                 //params
               },
             ],
           });
         } catch (addError) {
           console.error(addError);
         }

       }//
       console.error(error);
     }
  }

}

async function completeTransaction(){
  console.log("CompleteTransaction - switching to:", toChainId);
  completePhase = true;
  var complete = false;
  var keyExists = false;

  await setNets();
  var switching = await switchChain(toChainId);

  dv4.style.display= 'none';
  dv5.style.display= 'none';



  try {
          if (!TeleportContractMint){
            console.log('TeleportContractMintError:', TeleportContractMint);
            throw new Error('Bad contract mint object.');
          }
          // Check if key exists to know if transaction was already completed.
          keyExists = await TeleportContractMint.keyExistsTx(signature);
          console.log('keyExists', keyExists);

          if (keyExists){
              complete = true;
              console.log("Payout Status?:", complete);
          }
  }

  catch (err){
      console.log('Transaction Failure.', err);
      if (err !=null &&err.toString().includes('unknown account')){
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Please connect your metamask wallet.</h4>";
      }
      else{
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>"+err+"</h4>";//err.data.message
      }
      //}
      dv1.style.display= 'none';
      dv3.style.display= 'none';
      dv4.style.display= 'none';
      dv5.style.display= 'block';
      return;
  }

  console.log('amt:', amt, 'toTokenAddress:', toTokenAddress, 'TID:', hashedTxId, 'ethAddr:', evmToAddress, 'Sig:',signature);

  if (signature && hashedTxId && !complete){

      if (mm_provider) {

          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Pending...</h4>";
          dv.style.display= 'block';

          try{

              toNetIdHash = Web3.utils.keccak256(toNetId.toString());
              toTargetAddrHash = Web3.utils.keccak256(evmToAddress);//Web3.utils.keccak256(evmToAddress.slice(2));
              console.log("toTargetAddrHash", toTargetAddrHash, "toNetIdHash", toNetIdHash);

              //amt = Web3.utils.toWei(amt.toString());
              console.log('amt:', amt, 'toTokenAddrHash:', toTokenAddrHash, 'tokenAddrHash:', tokenAddrHash, '*toTokenAddress',toTokenAddress, 'TID:', hashedTxId.toString(), 'ethAddr:', evmToAddress, 'toTargetAddrHash', toTargetAddrHash, 'Sig:',signature, 'toNetID:', toNetId, 'toChainID:', toChainId, 'toNetIdHash', toNetIdHash, 'vault:', vault);
              var tx = await TeleportContractMint.bridgeMintStealth(amt, hashedTxId.toString(), evmToAddress.toString(), signature, toTokenAddress.toString(), toNetId.toString(), "false");
              //var tx = await TeleportContractMint.unvaultStealth(amt, hashedTxId.toString(), evmToAddress.toString(), signature, toTokenAddress.toString(), toNetId.toString(), "true");

              console.log('TX:',tx);
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Pending Transaction ID:</h4><Text margin='small' >" + tx.hash + "</Text><h4 style={{backgroundColor: '#2B2F36'}}>Please wait for on-chain confirmation...</h4>";
              dv1.style.display= 'block';

              TeleportContractMint.once("BridgeMinted", async (recip, tokenAddr, amount) => {
                  var feesNoWei = 0;
                  console.log('Recipient:',recip);
                  console.log('Amount:', amount.toString());
                  var amtNoWei = Web3.utils.fromWei(amount.toString());
                  initialAmt = Web3.utils.fromWei(amt.toString());
                  console.log('amtNoWei', amtNoWei, initialAmt);
                  if (Number(amtNoWei) > 0){
                    var fees = Number(initialAmt) - (Number(amtNoWei));
                    feesNoWei = fees.toFixed(10);
                  }

                  console.log("Amount:", amtNoWei, 'Fees:', feesNoWei, 'Token Address:', tokenAddr);

                  if (Number(amtNoWei) > 0) {
                      if (receipt2 !== undefined) {
                          dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Pending Transaction Complete.</h4><h4 style={{backgroundColor: '#2B2F36'}}><b>Your transaction hash is " + receipt2.transactionHash + "</h4>";
                      }

                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>You received "+amtNoWei+" "+tokenName+" tokens.</h4>";//LBTC
                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your fees were "+feesNoWei+" "+tokenName+" tokens.</h4>";
                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>If the Teleport token hasn't already been added to your wallet yet, use the button below to add it. Make sure to add it to the right MetaMask account.</h4>";
                      dv3.style.display= 'block';
                      dv1.style.display= 'none';
                      complete = true;
                      await cookieReSetter();
                      return;

                  }
                  else {
                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failed.</h4>";
                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Bad transaction. Check your sender / recipient address pair or transaction hash. </h4>";
                      dv1.style.display= 'none';
                      dv4.style.display= 'block';
                      return;
                  }

              });

              var receipt2 = await tx.wait();
              console.log('Receipt:', receipt2, (receipt2.status === 1));

              if (receipt2.status !== 1) {
                  console.log('Transaction Failure.');
                  dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
                  dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>It's possible you have already claimed this transaction.</h6>";
                  dv1.style.display= 'none';
                  dv4.style.display= 'block';
                  return;
              }
              else {
                  console.log('Receipt received');
                  if (!complete){
                    dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>If the Teleport token hasn't already been added to your wallet yet, use the button below to add it. Make sure to add it to the right MetaMask account.</h4>";
                    dv1.style.display= 'none';
                    dv3.style.display= 'block';
                    complete = true;
                  }

                  TeleportContractMint.removeAllListeners(["BridgeMinted"]);
              }

          }
          catch (err) {
              console.log('Error:', err);
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
              if (err.toString().includes('unknown account')){
                dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Please connect your metamask wallet to this site.</h6>";
              }
              else{//if (err.code.toString().includes('-32603')){
                dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>"+err.message+"</h6>";
              }
              dv4.style.display= 'block';
              dv1.style.display= 'none';
              return;
          }

      }
      else {
          console.log('Metamask not running. Is it installed?');
          dv.style.display='block';
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Please Install <a href='https://metamask.io/download.html' style='color:#F0B90C;' />Metamask</a></h4>";
          return;
      }
  }
  else {
      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
      dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Can\'t retrieve data from bridge servers.</h6>";
      dv.style.display= 'block';
      dv1.style.display= 'none';
      dv4.style.display= 'block';
      return;
  }
}

function setNet(){

    if (fromNetRadio === 'LUX'){
      if (networkType ==='mainnet') {
        luxNetId = 43113;//**
      }
      else{
        luxNetId = 43113;
      }
      fromNetId = luxNetId;
    }
    if (fromNetRadio === 'Ethereum'){
      if (networkType ==='mainnet') {
        ethNetId = 1;
      }
      else{
        ethNetId = 4;
      }
      fromNetId = ethNetId;
    }
    console.log("fromNetRadio", fromNetRadio, fromNetId);
}

function setNets(){

  console.log("fromNetRadio:", fromNetRadio);
  console.log("toNetRadio:", toNetRadio);

  if (fromNetRadio == 'LUX' && toNetRadio == 'Ethereum'){ // && tokenName == "LuxBTC" => check if token is LBTC or LETH

    console.log('luxNetId:', luxNetId, 'ethNetId:', ethNetId);
    TeleportContractBurn = Teleport_Lux;
    TeleportContractMint = Teleport_Eth;
    fromTeleportAddr = addresses.Teleport_Lux;
    toTokenAddress = addresses.LBTC_Eth;
    fromTokenAddress = addresses.LBTC_Lux; // or LETH_Lux
    LBTC_From_Con = new Contract(fromTokenAddress, abis.LBTC, signer);
    fromNetId = luxNetId;
    toNetId = ethNetId;

  }

  else if (fromNetRadio == 'Ethereum' && toNetRadio == 'LUX') {

    console.log('luxNetId:', luxNetId, 'ethNetId:', ethNetId);
    TeleportContractBurn = Teleport_Eth;
    TeleportContractMint = Teleport_Lux;
    fromTeleportAddr = addresses.Teleport_Eth;
    toTokenAddress = addresses.LBTC_Lux;
    fromTokenAddress = addresses.LBTC_Eth;
    LBTC_From_Con = new Contract(fromTokenAddress, abis.LBTC, signer);
    fromNetId = ethNetId;
    toNetId = luxNetId;

  }

  fromChainId = ("0x"+fromNetId.toString(16)).toString();
  toChainId = ("0x"+toNetId.toString(16)).toString();
  console.log('toTokenAddress', toTokenAddress);
  return LBTC_From_Con;

}
function getCurrentNetworkName(fromNetId){
  var currentNetworkName;
  if (fromNetId==ethNetId){
    currentNetworkName = "Ethereum";
  }
  else if (fromNetId==luxNetId){
    currentNetworkName = "Lux";
  }
  return currentNetworkName;
}

async function checkNetsMatch(){
  dv = document.getElementById("output");
  dv1 = document.getElementById("spin");
  dv3 = document.getElementById("addToken");
  dv4 = document.getElementById("continue");
  dv.style.display= 'none';
  dv3.style.display= 'none';
  //dv4.style.display= 'none';

  var network = await window.ethereum.request({ method: 'net_version' })
  var currentNetworkName = getCurrentNetworkName(fromNetId);
  console.log('currentNetworkName:',currentNetworkName, fromNetId, network);

  if (Number(network)!== Number(fromNetId)){
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Connect Metamask to "+currentNetworkName+" "+networkType+" and resubmit.</h4>";
      dv.style.display= 'block';
      dv1.style.display= 'none';
      return false;
  } else{
    return true;
  }
}



async function getProvider(){
  mm_provider = await detectEthereumProvider();

  if (mm_provider !== window.ethereum){
      console.log('Multiple wallets installed');
      return;
  }
  else {
      console.log('window.ethereum is current wallet.');
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      signer = provider.getSigner();
  }
}

if (typeof window.ethereum !== 'undefined') {

  window.ethereum.on('accountsChanged', function (accounts) {
    if (loc && loc.pathname === '/Teleport'){
      dv = document.getElementById("output");
      dv.style.display= 'none';
      let balOk = checkBalanceInput(initialAmt);
    }

  });

  window.ethereum.on('networkChanged', function (network) {
    console.log("complete:", completePhase);
    if (loc && loc.pathname === '/Teleport' && (!completePhase)){
      dv = document.getElementById("output");
      dv.style.display= 'none';
      setNets();
      console.log("complete:", completePhase);
      checkNetsMatch();
    }
  });
}


function balanceError(){
  dv = document.getElementById("output");
  dv.style.display= 'block';
  console.log("mm_provider", signer);
  if (!mm_provider){
    dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your MetaMask is not connected to this site.</h4>";
  }
  else {
    dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your balance is too low for this transaction. Make sure to connect the correct account to this site.</h4>";
  }
}

async function checkBalanceInput(value){
  if ((fromNetRadio != 'Select') && (toNetRadio != 'Select')){
    dv = document.getElementById("output");
    dv.style.display= 'none';
    usrBalance = await userBalance();

    console.log('User Balance:', Number(value), Number(usrBalance), Number(value)>Number(usrBalance));

    if (value && usrBalance){
      if (Number(value)>Number(usrBalance)){
        balanceError();
        return false;
      }
      else{
          return true;
      }
    }
    else {
      return false;
    }

  }
}

async function userBalance(){

  LBTC_From_Con = await setNets(); // sets correct Teleport
  let correctNets = await checkNetsMatch();

  if (!correctNets){
    console.log('Wrong network');
    return;
  }

  var thisAccount = await provider.listAccounts();
  console.log('Signer is:', thisAccount[0], LBTC_From_Con);

  try {
    usrBalance = Web3.utils.fromWei((await LBTC_From_Con.balanceOf(thisAccount[0])).toString());
    if (isNaN(usrBalance)){
      usrBalance = 0;
    }

    console.log('Balance:', usrBalance);
    console.log('LBTC_From_Con:', LBTC_From_Con.address);
    return usrBalance;
  }
  catch (err){
    console.log('Error:', err);
  }

}


function handleValueFromDrop(valueFrom, setValueFrom, setValueTo){
  fromNetRadio=valueFrom;
  setValueFrom(valueFrom);
  setNet();
  checkNetsMatch();
  if ((fromNetRadio != toNetRadio) && (fromNetRadio != 'Select' && toNetRadio != 'Select')){
    let balOk = checkBalanceInput(initialAmt);
  }
}

function handleValueToDrop(valueTo, setValueFrom, setValueTo){
  toNetRadio=valueTo;
  setValueTo(valueTo);
}


async function handleInput(e){

    // Reset
    signature = null;
    hashedTxId = null;

    e.preventDefault();

    // Get Details
    initialAmt = e.value.Amt.trim();

    dv = document.getElementById("output");
    dv1 = document.getElementById("spin");
    dv3 = document.getElementById("addToken");
    dv4 = document.getElementById("continue");
    dv5 = document.getElementById("retry");

    // Reset Interface
    dv.style.display= 'none';
    dv1.style.display= 'none';
    dv3.style.display= 'none';
    dv4.style.display= 'none';
    dv5.style.display= 'none';


    if (!mm_provider){
        console.log('Metamask not running. Is it installed?');
        dv.style.display='block';
        dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Please Install <a href='https://metamask.io/download.html' style='color:#F0B90C;' />Metamask</a></h4>";
        return;
    }

    if(isNaN(initialAmt)){
      dv.style.display= 'block';
      console.log('Teleport amount is not a number');
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your amount must be a number.</h4>";
      return;
    }

    initialAmt = initialAmt.toString();
    console.log(toNetRadio, fromNetRadio, initialAmt);

    // Make sure networks are different
    if (fromNetRadio === 'Select' ||  toNetRadio === 'Select'){
      console.log("Networks are not different.");
      dv.style.display= 'block';
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>You must select to and from networks.</h4>";
      return;
    }

    if (!toNetRadio || !fromNetRadio){
      console.log("Network selection error.");
      dv.style.display= 'block';
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>NetworkSelectionError: Please select your from and to networks again.</h4>";
      return;
    }

    // Make sure networks are different
    if (fromNetRadio === toNetRadio){
      console.log("Networks are not different.");
      dv.style.display= 'block';
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your from and to networks must be different.</h4>";
      return;
    }

    // Get contracts.
    Teleport_Lux = new Contract(addresses.Teleport_Lux, abis.Teleport, signer);
    Teleport_Eth = new Contract(addresses.Teleport_Eth, abis.Teleport, signer);
    TeleportContractBurn = null;

    // Set correct contracts for from and to chains
    console.log("fromNetRadio", fromNetRadio, "toNetRadio", toNetRadio);

    setNets();
    var switching = await switchChain(fromChainId);

    let correctNets = checkNetsMatch();
    if (!correctNets)
      return;

    let balOk = await checkBalanceInput(initialAmt);
    if(!balOk){
      return;
    }

    console.log('signer:', signer);
    msgSig = await signer.signMessage(msg);
    console.log('msgSig:', msgSig);


    try{

        dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Pending...</h4>";
        dv.style.display= 'block';

        amt = Web3.utils.toWei(initialAmt.toString()); // Convert intialAmt toWei
        console.log("TeleportContractBurn:", TeleportContractBurn.address);

        console.log('fromTokenAddress:', fromTokenAddress);
        var tx = await TeleportContractBurn.bridgeBurn(amt, fromTokenAddress); // Burn coins
        dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Pending Transaction ID:</h4><Text margin='small' >" + tx.hash + "</Text><h4 style={{backgroundColor: '#2B2F36'}}>Please wait for on-chain confirmation...</h4>";
        dv1.style.display= 'block';

        var cnt = 0;
        vault = false;

        // Listen for burning completion
        TeleportContractBurn.once("BridgeBurned", async (caller, amount) => {
            console.log('Recipient:', caller);
            console.log('Amount:', amount.toString());

            if (cnt == 0){
              handleMint(amount, cnt, fromNetId, toNetId, tx);
              cnt++;
            }
        });

        var receipt = await tx.wait();
        console.log('Receipt:', receipt, (receipt.status === 1));

        if (receipt.status !== 1) {
            console.log('Transaction Failure.');
            dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed.</h4>";
            dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Did you pay the network fees?</h4>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }

        else {
            console.log('Receipt received');
            TeleportContractBurn.off("BridgeBurned");
            TeleportContractBurn.removeAllListeners(["BridgeBurned"]);

            if (cnt == 0){
              console.log('cookie array:', amt, cnt, fromNetId, toNetId, tx, msgSig, tokenName);
              await handleMint(amt, cnt, fromNetId, toNetId, tx);
              cnt++;
            }
        }
    }

    catch (err) {
        console.log('Error:', err);
        dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
        if (err.toString().includes('unknown account')){
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Please connect your metamask wallet to this site.</h4>";
        }
        else if (err.code.toString().includes('-32603')){
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>"+err.data.message+"</h4>";
        }
        else {
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Check you have enough coin to afford this transaction\'s gas fees.</h4>";
        }
        dv.style.display= 'block';
        dv1.style.display= 'none';
        return;
    }
}


//async function handleMint(amount, cnt, fromNetId, toNetId, receipt, tx){
async function handleMint(amount, cnt, fromNetId, toNetId, tx){
  amt = amount; // in wei
  var amtNoWei = Web3.utils.fromWei(amount.toString());
  console.log('amtNoWei', Number(amtNoWei), 'cnt', cnt);
  var txid = tx.hash;
  var toNetId
  console.log('txid:', txid);
  dv = document.getElementById("output");
  dv1 = document.getElementById("spin");
  dv3 = document.getElementById("addToken");
  dv4 = document.getElementById("continue");
  dv5 = document.getElementById("retry");
  dv5.style.display= 'none';
  dv.style.display= 'none';
  dv3.style.display= 'none';


  if (Number(amtNoWei) > 0 && cnt == 0) {

      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Bridge Received Coins.</h4><h4 style={{backgroundColor: '#2B2F36'}}><b>Your transaction hash is " + txid + "</h4>";

      try {
        if (cookies.get('toNetId')!==null && cookies.get('toNetId')!=='' && toNetId === null){
          toNetId = cookies.get('toNetId');
        }
        if (cookies.get('msgSig')!==null && cookies.get('msgSig')!=='' && msgSig === null){
          msgSig = cookies.get('msgSig');
        }
        if (cookies.get('tokenName')!==null && cookies.get('tokenName')!=='' && tokenName === null){
          tokenName = cookies.get('tokenName');
        }
        if (cookies.get('evmToAddress')!==null && cookies.get('evmToAddress')!=='' && evmToAddress === null){
           evmToAddress = cookies.get('evmToAddress');
        }
        if (cookies.get('toTokenAddress')!==null && cookies.get('toTokenAddress')!=='' && toTokenAddress === null){
          toTokenAddress = cookies.get('toTokenAddress');
        }
        if (cookies.get('toNetId')!==null && cookies.get('toNetId')!=='' && (toNetId === '' || toNetId == null)){
          toNetId = cookies.get('toNetId');
        }
        if (cookies.get('fromNetId')!==null && cookies.get('fromNetId')!=='' && (fromNetId === '' || fromNetId == null)){
          fromNetId = cookies.get('fromNetId');
        }
      }
      catch (error) {
        dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure. Cookies not available. This DApp requires cookies to complete transaction.</h4>";
        dv.style.display= 'block';
        console.log('Transaction Failure...');
        return;
      }


      dv1.style.display= 'none';
      toNetIdHash = Web3.utils.keccak256(toNetId.toString());
      toTargetAddrHash = Web3.utils.keccak256(evmToAddress);//Web3.utils.keccak256(evmToAddress.slice(2));
      toTokenAddrHash = Web3.utils.keccak256(toTokenAddress);//Web3.utils.keccak256(toTokenAddress.slice(2));
      console.log("toTargetAddrHash", toTargetAddrHash, "toNetIdHash", toNetIdHash, "toTokenAddrHash", toTokenAddrHash);
      //var cmd = "http://localhost:5000/api/v1/getsig/txid/"+txid+"/fromNetId/"+fromNetId+"/toNetIdHash/"+toNetIdHash+"/tokenName/"+tokenName+"/tokenAddrHash/"+toTokenAddrHash+"/msgSig/"+msgSig+"/toTargetAddrHash/"+toTargetAddrHash;
      var cmd = "https://teleporter.wpkt.cash/api/v1/getsig/txid/"+txid+"/fromNetId/"+fromNetId+"/toNetIdHash/"+toNetIdHash+"/tokenName/"+tokenName+"/tokenAddrHash/"+toTokenAddrHash+"/msgSig/"+msgSig+"/toTargetAddrHash/"+toTargetAddrHash;


      console.log('cmd', cmd);
      dv1.style.display= 'block';
      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Bridge Signature Pending...</h4>";
      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Retrieving signature from the bridge network.</h4>";
      dv.style.display= 'block';
      dv1.style.display= 'block';
      dv3.style.display= 'none';

      fetch(cmd)
      .then((response) => response.json())
      .then( async (result) => {
          console.log('Data:', result);

          if (result.signature && result.hashedTxId){
            // Set globals
            signature = result.signature;
            hashedTxId = result.hashedTxId;
            toTargetAddrHash = result.from;
            tokenAddrHash = result.tokenAddrHash;
            console.log('hashedTxId:', hashedTxId, 'signature:', signature, 'toTargetAddrHash:', toTargetAddrHash, 'tokenAddrHash:', tokenAddrHash);
            dv1.style.display= 'none';
            dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Click continue to complete your transaction.</h4>";
            dv.style.display= 'block';
            dv4.style.display= 'block'; // Show the continue button
            dv5.style.display= 'none';
          }
          else if (Number(result.output) === -1)  {
              console.log('Duplicate transaction.');
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>You can't claim the same transaction more than once.</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>If the Teleport token hasn't already been added to your wallet yet, use the button below to add it. </h4>";
              dv.style.display= 'block';
              dv3.style.display= 'block';
              return;
          }
          else if (Number(result.output) === -3)  {
              console.log('Gas price error.');
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Non-specific gas price error.</h4>";
              dv.style.display= 'block';
              dv1.style.display= 'none';
              await cookieSetter([amount, cnt, fromNetId, toNetId, tx, msgSig, tokenName, evmToAddress, toTokenAddress, fromNetRadio, toNetRadio]);
              return;
          }
          else if (Number(result.output) === -4)  {
              console.log('Unknown Error.');
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Unknown error.</h4>";
              dv.style.display= 'block';
              dv1.style.display= 'none';
              await cookieSetter([amount, cnt, fromNetId, toNetId, tx, msgSig, tokenName, evmToAddress, toTokenAddress, fromNetRadio, toNetRadio]);
              return;
          }
          else if (Number(result.output) === -5)  {
              console.log('Front Run Attempt.');
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Potential front run attempt.</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your address pair does not match the pre-committed pair</h4>";
              dv.style.display= 'block';
              dv1.style.display= 'none';
              return;
          }
          else {
              console.log('Bad transaction.');
              dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}> Either transaction doesn't exist or it was for a zero amount.</h4>";
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}> It is possible you used a different sender address for this transaction.</h4>";
              dv.style.display= 'block';
              dv1.style.display= 'none';
              await cookieSetter([amount, cnt, fromNetId, toNetId, tx, msgSig, tokenName, evmToAddress, toTokenAddress, fromNetRadio, toNetRadio]);
              return;
          }

      }).catch(async function(err) {
          console.log("error", err);
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>There was a problem communicating with the bridge servers.</h4>";
          dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Click retry to complete your transaction.</h4>";
          dv.style.display= 'block';
          dv1.style.display= 'none';
          dv4.style.display= 'block'; // Show the handleMint() button -- which takes cookies.amount as args
          dv5.style.display= 'none';
          await cookieSetter([amount, cnt, fromNetId, toNetId, tx, msgSig, tokenName, evmToAddress, toTokenAddress, fromNetRadio, toNetRadio]);
          return;
      });

      return;
  }
  else {
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failed.</h4>";
      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Bad transaction. Check your transaction hash. </h4>";
      dv.style.display= 'block';
      dv1.style.display= 'none';
      await cookieSetter([amount, cnt, fromNetId, toNetId, tx, msgSig, tokenName, evmToAddress, toTokenAddress, fromNetRadio, toNetRadio]);
      return;
  }

}


function cookieSetter(cookieVals){

  // Iterate and array instead
  for (var i=0; i < cookieArr.length; i++){
    console.log('Cookie Vals', cookieVals[i]);
    cookies.set(cookieArr[i], cookieVals[i], { path: '/' });
    console.log(cookieArr[i], cookies.get(cookieArr[i]));
  }
}

function cookieReSetter(){
  for (var i=0; i < cookieArr.length; i++){
    cookies.set(cookieArr[i], '', { path: '/' });
    console.log(cookieArr[i], cookies.get(cookieArr[i]));
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('Loaded');
  if (cookies.get("msgSig") && cookies.get("msgSig") !==''){
    console.log('Unprocessed transaction detected...');
    dv = document.getElementById("output");
    dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Unprocessed transaction detected. Click \"Retry\"</h4>";
    dv5 = document.getElementById("retry");
    dv.style.display= 'block';
    dv5.style.display= 'block';
  }
});

var initialValue = "LUX";
var initialValue2 = "Ethereum";
fromNetRadio = "Select";
toNetRadio = "Select";

function Teleport({btn}) {
    const [valueFrom, setValueFrom] = useState('Select');
    const [valueTo, setValueTo] = useState('Select');
    const [fromIcn, setFromIcn] = useState(<FormDown color='white'/>);
    const [toIcn, setToIcn] = useState(<FormDown color='white'/>);
    getProvider();
    loc = useLocation();
    console.log('valueTo:', valueTo, 'valueFrom:', valueFrom);

    return (
    <Grommet theme={customBreakpoints}>
    <ResponsiveContext.Consumer>
        {responsive => (responsive === 'smallmob') ? (
            <Box background="#fff">
                <Card width="full" round="none" background="#fff" pad="75px 20px 100px">
                    <CardBody>
                            <Box background="#fff" justify="center" alignSelf="center">
                                <HeadingDark textAlign="center" margin={{ bottom: "35px", top: "0", horizontal: "0" }} size="4xl" weight="bold" color="#222323" level="2">Bridge More Chains</HeadingDark>
                                <StyledTextDark textAlign="center">Send coins privately between chains. The bridge fee is .75%.Enter your transaction amount, choose the from and to chains, and provide a target recipient address.
                                Additionally, you must hold the native coins of the chains you wish to bridge between. For example, to execute a LUX-to-Ethereum swap, you must also own Lux and Ethereum.</StyledTextDark>
                            </Box>
                            <Box background="#fff" justify="center" alignSelf="center" pad="50px 0 0">


                                <Box background="#f9f9f9" pad={{ top: "40px", bottom: "50px", horizontal: "20px" }} round="23px" justify="center" alignSelf="center" style={formWrapStyleMob}>
                                <Box pad={{ top: "40px", bottom: "50px", horizontal: "10px" }} justify="center" alignSelf="center">{btn}</Box>

                                <Form name="bridgeTeleport" id="bridgeTeleport" onSubmit={handleInput}>
                                <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="20px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Bridge Your Assets: </Heading>
                                <Box justify="center" alignSelf="center" >
                                    <Box justify="center" alignSelf="center"  width="medium" pad="small" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">From:</Text>
                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setFromIcn(<EthIcon/>); handleValueFromDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setFromIcn(<LuxIcon/>); handleValueFromDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >
                                        <Box direction="row" gap="small" alignSelf="center" pad="small">
                                            <ButtonForm size='large' pad='medium' icon={fromIcn} style={{borderRadius: '10px'}} color='#F0B90C' margin={{top: "15px", horizontal: "auto"}} label={valueFrom} id='slctFromBtn'/>
                                        </Box>
                                      </Menu>

                                    </Box>


                                    <FormField
                                      name="Amt"
                                      alignSelf="center"
                                      pad="small"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^\s*(?=.*[1-9])\d*(?:\.\d*)?\s*$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="Amt"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">0.0
                                          </Text>}
                                          onChange={event =>{initialAmt=event.target.value; checkBalanceInput(initialAmt)}}
                                        />
                                    </FormField>

                                    <Box justify="center" alignSelf="center" pad="small" width="medium" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">To:</Text>



                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setToIcn(<EthIcon/>); handleValueToDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setToIcn(<LuxIcon/>); handleValueToDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >

                                        <Box direction="row" gap="small" pad="small">
                                            <ButtonForm size='large' style={{borderRadius: '10px'}} pad='medium' margin={{top: "15px", horizontal: "auto"}} icon={toIcn} color='#F0B90C' label={valueTo} id='slctToBtn'/>
                                        </Box>
                                      </Menu>

                                    </Box>

                                    <FormField
                                      name="targetAddress"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^0x[a-fA-F0-9]{40}$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="targetAddress"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">Enter destination address
                                          </Text>}
                                          onChange={event =>{evmToAddress=event.target.value; tokenName="LuxBTC";}}
                                        />
                                    </FormField>

                                    <ButtonForm width="medium" style={{width: '50%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} size='medium' color="#fff" type="submit" label="Submit"></ButtonForm>
                                </Box>
                                </Form>
                                <div style={{paddingTop: '2%'}}>

                                    <Box hidden id="outputCard" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                        <div hidden align="center" id="output" style={{padding:'2%'}}>
                                        </div>
                                        <div id="spin" align="center" hidden pad="medium" style={{padding:'2%'}}><Spinner size="large" /></div>
                                        <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%'}}>
                                            <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addTeleport()}/>
                                        </div>
                                    </Box>
                                </div>
                                </Box>
                            </Box>
                    </CardBody>
                </Card>
            </Box>
        ) : (responsive === 'small') ? (
            <Box background="#fff">
                <Card width="full" round="none" background="#fff" pad="75px 20px 100px">
                    <CardBody>
                            <Box background="#fff" justify="center" alignSelf="center">
                                <HeadingDark textAlign="center" margin={{ bottom: "35px", top: "0", horizontal: "0" }} size="4xl" weight="bold" color="#222323" level="2">Bridge More Chains </HeadingDark>
                                <StyledTextDark textAlign="center">Send coins privately between chains. The bridge fee is .75%.Enter your transaction amount, choose the from and to chains, and provide a target recipient address.
                                Additionally, you must hold the native coins of the chains you wish to bridge between. For example, to execute a LUX-to-Ethereum swap, you must also own Lux and Ethereum.</StyledTextDark>
                            </Box>
                            <Box background="#fff" justify="center" alignSelf="center" pad="50px 0 0">
                                <Box background="#f9f9f9" pad={{ top: "40px", bottom: "50px", horizontal: "20px" }} round="23px" justify="center" alignSelf="center" style={formWrapStyleMob}>
                                <Box pad={{ top: "40px", bottom: "50px", horizontal: "10px" }} justify="center" alignSelf="center">{btn}</Box>

                                <Form name="bridgeTeleport" id="bridgeTeleport" onSubmit={handleInput}>
                                <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="20px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Bridge Your Assets: </Heading>
                                <Box justify="center" alignSelf="center" >
                                    <Box justify="center" alignSelf="center"  width="medium" pad="small" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setFromIcn(<EthIcon/>); handleValueFromDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setFromIcn(<LuxIcon/>); handleValueFromDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >
                                        <Box direction="row" gap="small" alignSelf="center" pad="small">
                                            <ButtonForm size='large' pad='medium' icon={fromIcn} style={{borderRadius: '10px'}} color='#F0B90C' margin={{top: "15px", horizontal: "auto"}} label={valueFrom} id='slctFromBtn'/>
                                        </Box>
                                      </Menu>
                                    </Box>


                                    <FormField
                                      name="Amt"
                                      alignSelf="center"
                                      pad="small"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^\s*(?=.*[1-9])\d*(?:\.\d*)?\s*$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="Amt"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">0.0
                                          </Text>}
                                          onChange={event =>{initialAmt=event.target.value; checkBalanceInput(initialAmt)}}
                                        />
                                    </FormField>

                                    <Box justify="center" alignSelf="center" pad="small" width="medium" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">To:</Text>


                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setToIcn(<EthIcon/>); handleValueToDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setToIcn(<LuxIcon/>); handleValueToDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >

                                        <Box direction="row" gap="small" pad="small">
                                            <ButtonForm size='large' style={{borderRadius: '10px'}} pad='medium' margin={{top: "15px", horizontal: "auto"}} icon={toIcn} color='#F0B90C' label={valueTo} id='slctToBtn'/>
                                        </Box>
                                      </Menu>

                                    </Box>

                                    <FormField
                                      name="targetAddress"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^0x[a-fA-F0-9]{40}$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="targetAddress"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">Enter destination address
                                          </Text>}
                                          onChange={event =>{evmToAddress=event.target.value; tokenName="LuxBTC";}}
                                        />
                                    </FormField>

                                    <ButtonForm width="medium" style={{width: '50%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} size='medium' color="#fff" type="submit" label="Submit"></ButtonForm>
                                </Box>
                                </Form>

                                <div style={{paddingTop: '2%'}}>

                                    <Box hidden id="outputCard" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                        <div hidden align="center" id="output" style={{padding:'2%'}}>
                                        </div>
                                        <div id="spin" align="center" hidden pad="medium" style={{padding:'2%'}}><Spinner size="large" /></div>
                                        <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%'}}>
                                            <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addTeleport()}/>
                                        </div>
                                    </Box>

                                </div>
                                </Box>
                            </Box>
                    </CardBody>
                </Card>
            </Box>
        ) : (responsive === 'tablet') ? (
            <Box background="#fff">
                <Card width="full" round="none" background="#fff" pad="75px 30px 100px">
                    <CardBody>

                            <Box background="#fff" justify="center" alignSelf="center">
                                <HeadingDark textAlign="center" margin={{ bottom: "35px", top: "0", horizontal: "0" }} size="4xl" weight="bold" color="#222323" level="2">Bridge More Chains </HeadingDark>
                                <StyledTextDark textAlign="left">Send coins privately between chains. The bridge fee is .75%.Enter your transaction amount, choose the from and to chains, and provide a target recipient address.
                                Additionally, you must hold the native coins of the chains you wish to bridge between. For example, to execute a LUX-to-Ethereum swap, you must also own Lux and Ethereum.</StyledTextDark>

                            </Box>

                            <div style={{paddingTop: '2%'}}>

                            <Box background="#fff" justify="center" alignSelf="center" pad="50px 0 0">

                                <Box background="#f9f9f9" round="25px" justify="center" alignSelf="center" pad={{ top: "40px", bottom: "50px", horizontal: "20px" }} style={formWrapStyleMob}>

                                <Form name="bridgeTeleport" id="bridgeTeleport" onSubmit={handleInput}>
                                <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="20px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Bridge Your Assets: </Heading>
                                <Box justify="center" alignSelf="center" >
                                    <Box pad={{ top: "40px", bottom: "50px", horizontal: "10px" }} justify="center" alignSelf="center">{btn}</Box>

                                    <Box justify="center" alignSelf="center"  width="medium" pad="small" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">From:</Text>


                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setFromIcn(<EthIcon/>); handleValueFromDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setFromIcn(<LuxIcon/>); handleValueFromDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >
                                        <Box direction="row" gap="small" alignSelf="center" pad="small">
                                            <ButtonForm size='large' pad='medium' icon={fromIcn} style={{borderRadius: '10px'}} color='#F0B90C' margin={{top: "15px", horizontal: "auto"}} label={valueFrom} id='slctFromBtn'/>
                                        </Box>
                                      </Menu>

                                    </Box>


                                    <FormField
                                      name="Amt"
                                      alignSelf="center"
                                      pad="small"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^\s*(?=.*[1-9])\d*(?:\.\d*)?\s*$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="Amt"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">0.0
                                          </Text>}
                                          onChange={event =>{initialAmt=event.target.value; checkBalanceInput(initialAmt)}}
                                        />
                                    </FormField>

                                    <Box justify="center" alignSelf="center" pad="small" width="medium" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">To:</Text>


                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setToIcn(<EthIcon/>); handleValueToDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setToIcn(<LuxIcon/>); handleValueToDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >

                                        <Box direction="row" gap="small" pad="small">
                                            <ButtonForm size='large' style={{borderRadius: '10px'}} pad='medium' margin={{top: "15px", horizontal: "auto"}} icon={toIcn} color='#F0B90C' label={valueTo} id='slctToBtn'/>
                                        </Box>
                                      </Menu>
                                    </Box>

                                    <FormField
                                      name="targetAddress"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^0x[a-fA-F0-9]{40}$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="targetAddress"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">Enter destination address
                                          </Text>}
                                          onChange={event =>{evmToAddress=event.target.value; tokenName="LuxBTC";}}
                                        />
                                    </FormField>

                                    <ButtonForm width="medium" style={{width: '50%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} size='medium' color="#fff" type="submit" label="Submit"></ButtonForm>
                                </Box>
                                </Form>

                                <div style={{paddingTop: '2%'}}>
                                    <Box hidden id="outputCard" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                        <div hidden align="center" id="output" style={{padding:'2%', wordBreak: "break-word"}}>
                                        </div>
                                        <div id="spin" align="center" hidden pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>

                                          <div hidden align="center" id="continue" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Continue' id='continue' onClick={() => completeTransaction()}/>
                                          </div>

                                          <div hidden align="center" id="retry" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Retry' id='retry' onClick={() => handleMint(cookies.get("amount"),cookies.get("cnt"), cookies.get("fromNetId"), cookies.get("toNetId"), cookies.get("tx"))}/>
                                          </div>
                                        <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}>
                                            <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addTeleport()}/>
                                        </div>
                                    </Box>
                                </div>
                                </Box>
                            </Box>
                            </div>

                    </CardBody>
                </Card>
            </Box>
        ) : (responsive === 'medium') ? (
            <Box background="#fff">
                <Card width="full" round="none" background="#fff" pad="150px 50px">
                    <CardBody>

                        <Grid fill areas={[ { name: 'left', start: [0, 0], end: [0, 0] }, { name: 'right', start: [1, 0], end: [1, 0] },]}
                            columns={['flex', 'flex']} alignContent="center" justifyContent="between" rows={['flex']} gap="none"
                            background="#fff">

                            <Box gridArea="left" background="#fff" justify="center" alignSelf="start">
                                <HeadingDark textAlign="start" margin={{ bottom: "50px", top: "0", horizontal: "0" }} size="4xl" weight="bold" color="#222323" level="2">Bridge More Chains </HeadingDark>
                                <StyledTextDark textAlign="left">Send coins privately between chains. The bridge fee is .75%.Enter your transaction amount, choose the from and to chains, and provide a target recipient address.
                                Additionally, you must hold the native coins of the chains you wish to bridge between. For example, to execute a LUX-to-Ethereum swap, you must also own Lux and Ethereum.</StyledTextDark>

                            </Box>

                            <Box gridArea="right" background="#fff" justify="end" alignSelf="center" pad="0">
                                <Box background="#f9f9f9" pad={{ vertical: "large", horizontal: "large" }} round="25px" justify="center" alignSelf="center" style={formWrapStyleMed}>
                                <Box pad={{ vertical: "large", horizontal: "large" }} round="25px" justify="end" alignSelf="center">{btn}</Box>

                                <Form name="bridgeTeleport" id="bridgeTeleport" onSubmit={handleInput}>
                                <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="20px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Bridge Your Assets: </Heading>
                                <Box justify="center" alignSelf="center" width="100%">
                                    <Box justify="center" alignSelf="center"  width="medium" pad="small" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">From:</Text>



                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setFromIcn(<EthIcon/>); handleValueFromDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setFromIcn(<LuxIcon/>); handleValueFromDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >
                                        <Box direction="row" gap="small" alignSelf="center" pad="small">
                                            <ButtonForm size='large' pad='medium' icon={fromIcn} style={{borderRadius: '10px'}} color='#F0B90C' margin={{top: "15px", horizontal: "auto"}} label={valueFrom} id='slctFromBtn'/>
                                        </Box>
                                      </Menu>


                                    </Box>


                                    <FormField
                                      name="Amt"
                                      alignSelf="center"
                                      pad="small"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^\s*(?=.*[1-9])\d*(?:\.\d*)?\s*$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="Amt"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">0.0
                                          </Text>}
                                          onChange={event =>{initialAmt=event.target.value; checkBalanceInput(initialAmt)}}
                                        />
                                    </FormField>

                                    <Box justify="center" alignSelf="center" pad="small" width="medium" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">To:</Text>



                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setToIcn(<EthIcon/>); handleValueToDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setToIcn(<LuxIcon/>); handleValueToDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >

                                        <Box direction="row" gap="small" pad="small">
                                            <ButtonForm size='large' style={{borderRadius: '10px'}} pad='medium' margin={{top: "15px", horizontal: "auto"}} icon={toIcn} color='#F0B90C' label={valueTo} id='slctToBtn'/>
                                        </Box>
                                      </Menu>
                                    </Box>

                                    <FormField
                                      name="targetAddress"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^0x[a-fA-F0-9]{40}$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="targetAddress"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">Enter destination address
                                          </Text>}
                                          onChange={event =>{evmToAddress=event.target.value; tokenName="LuxBTC";}}
                                        />
                                    </FormField>


                                    <ButtonForm style={{width: '65%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} size='large' color="#fff" type="submit" label="Submit"></ButtonForm>


                                </Box>
                                </Form>

                                <div style={{paddingTop: '2%'}}>
                                    <Box hidden id="outputCard" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                        <div hidden align="center" id="output" style={{padding:'2%', wordBreak: "break-word"}}>
                                        </div>
                                        <div id="spin" align="center" hidden pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>

                                          <div hidden align="center" id="continue" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Continue' id='continue' onClick={() => completeTransaction()}/>
                                          </div>

                                          <div hidden align="center" id="retry" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Retry' id='retry' onClick={() => handleMint(cookies.get("amount"),cookies.get("cnt"), cookies.get("fromNetId"), cookies.get("toNetId"), cookies.get("tx"))}/>
                                          </div>

                                        <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}>
                                            <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addTeleport()}/>
                                        </div>
                                    </Box>
                                </div>
                                </Box>
                            </Box>
                        </Grid>
                    </CardBody>
                </Card>
            </Box>
        ) : (
            <Box background="#fff">
                <Card width="full" round="none" background="#fff" pad="0 8rem" size="large">
                    <CardBody>
                        <Grid fill areas={[ { name: 'left', start: [0, 0], end: [0, 0] }, { name: 'right', start: [1, 0], end: [1, 0] },]}
                            columns={['1/2', 'flex']} alignContent="center" justifyContent="between" rows={['flex']} gap="none"
                            background="#fff">

                            <Box gridArea="left" background="#fff" height={{ min: "85vh" }} justify="center" alignSelf="start">
                                <HeadingDark textAlign="start" margin={{ bottom: "50px", top: "0", horizontal: "0" }} size="4xl" weight="bold" color="#222323" level="2">Bridge More Chains </HeadingDark>
                                <StyledTextDark textAlign="left">Send coins privately between chains. The bridge fee is .75%.Enter your transaction amount, choose the from and to chains, and provide a target recipient address.
                                Additionally, you must hold the native coins of the chains you wish to bridge between. For example, to execute a LUX-to-Ethereum swap, you must also own Lux and Ethereum.</StyledTextDark>

                            </Box>

                            <Box gridArea="right" background="#fff" justify="end" alignSelf="center" pad="0">
                              <Box background="#f9f9f9" pad={{ vertical: "large", horizontal: "large" }} round="25px" justify="end" alignSelf="center" style={formWrapStyleMed}>
                              <Box pad={{ vertical: "large", horizontal: "large" }} round="25px" justify="end" alignSelf="center">{btn}</Box>
                                <Form name="bridgeTeleport" id="bridgeTeleport" onSubmit={handleInput}>
                                <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="20px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Bridge Your Assets: </Heading>

                                <Box justify="center" alignSelf="center" width="100%">
                                    <Box justify="center" alignSelf="center"  width="medium" pad="small" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">From:</Text>


                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setFromIcn(<EthIcon/>); handleValueFromDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setFromIcn(<LuxIcon/>); handleValueFromDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >
                                        <Box direction="row" gap="small" alignSelf="center" pad="small">
                                            <ButtonForm size='large' pad='medium' icon={fromIcn} style={{borderRadius: '10px'}} color='#F0B90C' margin={{top: "15px", horizontal: "auto"}} label={valueFrom} id='slctFromBtn'/>
                                        </Box>
                                      </Menu>

                                    </Box>


                                    <FormField
                                      name="Amt"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^\s*(?=.*[1-9])\d*(?:\.\d*)?\s*$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="Amt"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">0.0
                                          </Text>}
                                          onChange={event =>{initialAmt=event.target.value;console.log("initialAmt",initialAmt); checkBalanceInput(initialAmt)}}
                                        />
                                    </FormField>

                                    <Box justify="center" alignSelf="center" pad="small" width="medium" background="white" round="xsmall">
                                      <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                                      <Menu plain closed
                                        items={[
                                          {
                                            label: <Box alignSelf="center">Ethereum</Box>,
                                            value: 'Ethereum',
                                            onClick: () => {console.log('Ethereum'); setToIcn(<EthIcon/>); handleValueToDrop('Ethereum', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <EthIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                            {
                                            label: <Box alignSelf="center">LUX</Box>,
                                            onClick: () => {console.log('LUX'); setToIcn(<LuxIcon/>); handleValueToDrop('LUX', setValueFrom, setValueTo)
                                            },
                                              icon: (
                                                <Box pad="medium">
                                                  <LuxIcon size="large" />
                                                </Box>
                                              ),
                                            },
                                        ]}
                                        >

                                        <Box direction="row" gap="small" pad="small">
                                            <ButtonForm size='large' style={{borderRadius: '10px'}} pad='medium' margin={{top: "15px", horizontal: "auto"}} icon={toIcn} color='#F0B90C' label={valueTo} id='slctToBtn'/>
                                        </Box>
                                      </Menu>


                                    </Box>

                                    <FormField
                                      name="targetAddress"
                                      alignSelf="center"
                                      required
                                      width="medium"
                                      contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"} }}
                                      validate={[
                                        { regexp: /^0x[a-fA-F0-9]{40}$/}
                                      ]}
                                    >
                                        <TextInput
                                          style={{background: 'white', color: '#222323', fontSize: "20px", fontWeight: "normal", borderRadius: "6px", height: "50px" }}
                                          name="targetAddress"
                                          placeholder={<Text weight="normal" size="20px" color="#707070">Enter destination address
                                          </Text>}
                                          onChange={event =>{evmToAddress=event.target.value;tokenName="LuxBTC";}}
                                        />
                                    </FormField>

                                    <ButtonForm style={{width: '55%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} color="#fff" type="submit" label="Submit"></ButtonForm>
                                </Box>
                                </Form>

                                <div style={{paddingTop: '2%'}}>
                                    <Box hidden id="outputCard" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                        <div hidden align="center" id="output" style={{padding:'2%', wordBreak: "break-word"}}>
                                        </div>
                                        <div id="spin" align="center" hidden pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>

                                          <div hidden align="center" id="continue" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Continue' id='continue' onClick={() => completeTransaction()}/>
                                          </div>

                                          <div hidden align="center" id="retry" pad="medium" style={{padding:'2%'}}>
                                          <StyledButton size='large' pad="medium" color='#F0B90C' label='Retry' id='retry' onClick={() => handleMint(cookies.get("amount"),cookies.get("cnt"), cookies.get("fromNetId"), cookies.get("toNetId"), cookies.get("tx"))}/>
                                          </div>

                                        <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}>
                                            <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addTeleport()}/>
                                        </div>
                                    </Box>
                                </div>
                              </Box>
                            </Box>
                        </Grid>
                    </CardBody>
                </Card>
            </Box>
        )}
    </ResponsiveContext.Consumer>
    </Grommet>
  );



}

export default Teleport;
