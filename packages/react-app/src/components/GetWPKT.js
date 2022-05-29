import React, { useState } from "react";
import { Form, Box, Card, Text, CardBody, Grid, Heading, TextInput, Spinner, FormField, ResponsiveContext, RadioButtonGroup, Grommet, Menu } from "grommet";
import { HeadingDark, StyledTextDark, ButtonForm, StyledButton, customBreakpoints } from ".";
import { useHistory, useLocation } from "react-router-dom";

import addresses from "./abi/addresses";
import abis from "./abi/abis";
import Web3 from "web3";
import ethLogo from "../img/eth.svg";
import bscLogo from "../img/bsc2.svg";
import maticLogo from "../img/matic.svg";
import { Blank, FormDown } from 'grommet-icons';
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import detectEthereumProvider from '@metamask/detect-provider';


var pktTID;
var provider;
var signer;
var Obeah_Bsc = null;
var Obeah_Eth = null;
var Obeah_Matic = null;
var WPKT_Con;
var wpktBscAddr = addresses.WPKT;
var wpktEthAddr = addresses.WPKT_Eth;
var wpktMaticAddr = addresses.WPKT_Matic;
var ObeahContractBurn, ObeahContractMint;
var networkType;
var chainType = "BSC";
var tokenAddress = wpktBscAddr;//**
var fromNetRadio, toNetRadio;
var fromChainId, toChainId;
var fromWPKTAddr;
var bscNetId = 56;
var ethNetId = 1; //Eth
var maticNetId = 137; //Matic
var fromNetId = bscNetId; //Default
//var toNetId = ethNetId;//Default //**
var toNetId = maticNetId;//Default
var signature;
var hashedTxId;
var blockNumber;
var evmToAddress;
var amt;
var dv, dv1, dv3;
var initialAmt, amt;
var mm_provider;
var usrBalance;
var loc;
var completePhase = false;
var dv;
var dv1;
var dv2;


/*const chainParams = map();
chainParams.set('97', {chainName:"Smart Chain Testnet", rpcUrl:"https://data-seed-prebsc-1-s1.binance.org:8545", nativeCurrencyName:"BNB", nativeCurrencySymbol:"BNB", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://testnet.bscscan.com"});
chainParams.set('56', {chainName:"Smart Chain", rpcUrl:"https://bsc-dataseed.binance.org/", nativeCurrencyName:"BNB", nativeCurrencySymbol:"BNB", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://bscscan.com/"});
chainParams.set('137', {chainName:"Matic", rpcUrl:"https://rpc-mainnet.maticvigil.com", nativeCurrencyName:"Matic", nativeCurrencySymbol:"Matic", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://explorer.matic.network"});
chainParams.set('80001', {chainName:"Mumbai Testnet", rpcUrl:"https://rpc-mumbai.maticvigil.com/", nativeCurrencyName:"Matic", nativeCurrencySymbol:"Matic", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://mumbai-explorer.matic.today"});
chainParams.set('1', {chainName:"Ethereum", rpcUrl:"https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", nativeCurrencyName:"ETH", nativeCurrencySymbol:"ETH", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://etherscan.io"});
chainParams.set('3', {chainName:"Ropsten Test Network", rpcUrl:"https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", nativeCurrencyName:"ETH", nativeCurrencySymbol:"ETH", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://ropsten.etherscan.io"});
chainParams.set('43114', {chainName:"AVAX", rpcUrl:"https://api.avax.network/ext/bc/C/rpc", nativeCurrencyName:"AVAX", nativeCurrencySymbol:"AVAX", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://cchain.explorer.avax.network/"});
chainParams.set('250', {chainName:"Fantom", rpcUrl:"https://rpc.ftm.tools/", nativeCurrencyName:"FTM", nativeCurrencySymbol:"FTM", nativeCurrencyDecimals:"18", blockExplorerUrl:"https://ftmscan.com"});
*/

// Allows for swapping out net easily, when switching from testnet to mainnet
if (bscNetId===97 || ethNetId===4 || maticNetId===80001 ){
    networkType = "testnet";
}
else if (bscNetId===56 || ethNetId===1 || maticNetId===137 ){
    networkType = "mainnet";
}


export const EthIcon = props => (
  <Blank {...props}>
    <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <image href={ethLogo} height="24" width="24"/>text
    </svg>
  </Blank>
);

export const BscIcon = props => (
  <Blank {...props}>
    <svg viewBox="2 2 12 12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <image href={bscLogo} height="16" width="16"/>
    </svg>
  </Blank>
);

export const MaticIcon = props => (
  <Blank {...props}>
    <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <image href={maticLogo} height="24" width="24"/>
    </svg>
  </Blank>
);

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


function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

async function addWPKT(){

    const tokenSymbol = 'WPKT';
    const tokenDecimals = 18;
    const tokenImage = 'https://odapp.io/WPKTLogo2Large.png';
    await setNets();
    console.log('tokenAddress', tokenAddress);


    try {

        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
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



async function switchChain(chainId){
  if (window.ethereum) {
     try {
       // check if the chain to connect to is installed
       await window.ethereum.request({
         method: 'wallet_switchEthereumChain',
         params: [{ chainId: chainId }],
       });
     } catch (error) {
       /*const params = [{
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
       // Error indicates that the chain has not been added to MetaMask
       if (error.code === 4902) {
         try {
           await window.ethereum.request({
             method: 'wallet_addEthereumChain',
             params: [
               {
                 chainId: chainId,
                 //params,
               },
             ],
           });
         } catch (addError) {
           console.error(addError);
         }
       }
       console.error(error);
     }
  }

}

/*function handleValueTo(valueTo, setValueTo){
  toNetRadio=valueTo;
  setValueTo(valueTo);
  setNets();
  checkNetsMatch();
}*/


function handleValueTo(valueTo, setValueFrom, setValueTo){
  toNetRadio=valueTo;
  setValueTo(valueTo);
  //var valueFrom = (valueTo === 'Ethereum') ? 'BSC' : 'Ethereum';//**
  var valueFrom = (valueTo === 'Matic') ? 'BSC' : 'Matic';
  setValueFrom(valueFrom);
  fromNetRadio=valueFrom;
  setNets();
  checkNetsMatch();
  //checkBalanceInput(initialAmt);
}


function handleValueFrom(valueFrom, setValueFrom, setValueTo){
  fromNetRadio=valueFrom;
  setValueFrom(valueFrom);
  //var valueTo = (valueFrom === 'Ethereum') ? 'BSC' : 'Ethereum'; //**
  var valueTo = (valueFrom === 'Matic') ? 'BSC' : 'Matic';
  setValueTo(valueTo);
  toNetRadio=valueTo;
  setNets();
  checkNetsMatch();
  //checkBalanceInput(initialAmt);
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
  /*if ((fromNetRadio != toNetRadio) && (fromNetRadio != 'Select' && toNetRadio != 'Select')){
    let balOk = checkBalanceInput(initialAmt);
  }*/
}


if (typeof window.ethereum !== 'undefined'
|| (typeof window.web3 !== 'undefined')) {
  window.ethereum.on('networkChanged', function (network) {
    console.log('Network Changed', loc);
    if (loc && loc.pathname === '/GetWPKT' && (!completePhase)){
      console.log('Network Changed.');
      dv = document.getElementById("output2");
      dv1 = document.getElementById("spin");
      dv2 = document.getElementById("outputCard2")
      dv.style.display= 'none';
      dv1.style.display= 'none';
      dv2.style.display= 'none';

      setNets();
      console.log("complete:", completePhase);
      checkNetsMatch();
    }
  });

}

async function checkNetsMatch(){
  dv = document.getElementById("output2");
  dv1 = document.getElementById("spin");
  dv2 = document.getElementById("outputCard2")
  dv.style.display= 'none';
  var network = await window.ethereum.request({ method: 'net_version' })
  var currentNetworkName = "Binance Smart Chain";

  if (toNetId==ethNetId){
    currentNetworkName = "Ethereum";
  }
  else if (toNetId==maticNetId){
    currentNetworkName = "Matic";
  }
  else if (toNetId==bscNetId){
    currentNetworkName = "Binance Smart Chain";
  }

  console.log('currentNetworkName:',currentNetworkName);

  if (Number(network)!== Number(toNetId)){
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Connect Metamask to "+currentNetworkName+" "+networkType+" and resubmit.</h4>";
      dv.style.display= 'block';
      dv1.style.display= 'none';
      dv2.style.display= 'block';
      return false;
  }
  else {
    return true;
  }
}



function setNet(){
    if (fromNetRadio === 'BSC'){
      if (networkType ==='mainnet') {
        bscNetId = 56;
      }
      else{
        bscNetId = 97;
      }
      fromNetId = bscNetId;
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
    if (fromNetRadio === 'Matic'){
      if (networkType ==='mainnet') {
        maticNetId = 137;
      }
      else{
        maticNetId = 80001;
      }
      fromNetId = maticNetId;
    }
    console.log("fromNetRadio", fromNetRadio, fromNetId);
}

function setNets(){
  console.log("fromNetRadio", fromNetRadio);
  console.log("toNetRadio", toNetRadio);

  if (fromNetRadio == 'BSC' && toNetRadio == 'Ethereum'){
    ObeahContractBurn = Obeah_Bsc;
    ObeahContractMint = Obeah_Eth;
    WPKT_Con = new Contract(addresses.WPKT, abis.WPKT_Eth, signer);
    fromWPKTAddr = addresses.WPKT;
    fromNetId = bscNetId;
    toNetId = ethNetId;
    tokenAddress = wpktEthAddr;

    if (networkType =='mainnet') {
      bscNetId = 56;
    }
    else{
      bscNetId = 97;
    }
  }
  else if (fromNetRadio == 'Ethereum' && toNetRadio == 'BSC') {
    ObeahContractBurn = Obeah_Eth;
    ObeahContractMint = Obeah_Bsc;
    WPKT_Con = new Contract(addresses.WPKT, abis.WPKT, signer);
    fromWPKTAddr = addresses.WPKT_Eth;
    fromNetId = ethNetId;
    toNetId = bscNetId;
    tokenAddress = wpktBscAddr;
    if (networkType =='mainnet') {
      ethNetId = 1;
    }
    else {
      ethNetId = 4;
    }
  }

  else if (fromNetRadio == 'Matic' && toNetRadio == 'Ethereum') {
    ObeahContractBurn = Obeah_Matic;//
    ObeahContractMint = Obeah_Eth;
    WPKT_Con = new Contract(addresses.WPKT_Eth, abis.WPKT, signer);
    fromWPKTAddr = addresses.WPKT_Matic;
    fromNetId = maticNetId;
    toNetId = ethNetId;
    tokenAddress = wpktEthAddr;
    if (networkType =='mainnet') {
      maticNetId = 137;
    }
    else {
      maticNetId = 80001;
    }
  }

  else if (fromNetRadio == 'Ethereum' && toNetRadio == 'Matic') {
    ObeahContractBurn = Obeah_Eth;//
    ObeahContractMint = Obeah_Matic;
    WPKT_Con = new Contract(addresses.WPKT_Matic, abis.WPKT, signer);
    fromWPKTAddr = addresses.WPKT_Eth;
    fromNetId = ethNetId;
    toNetId = maticNetId;
    tokenAddress = wpktMaticAddr;
    if (networkType =='mainnet') {
      ethNetId = 1;
    }
    else {
      ethNetId = 4;
    }
  }

  else if (fromNetRadio == 'Matic' && toNetRadio == 'BSC') {
    ObeahContractBurn = Obeah_Matic;//
    ObeahContractMint = Obeah_Bsc;
    WPKT_Con = new Contract(addresses.WPKT, abis.WPKT, signer);
    fromWPKTAddr = addresses.WPKT_Matic;
    fromNetId = maticNetId;
    toNetId = bscNetId;
    tokenAddress = wpktBscAddr;
    if (networkType =='mainnet') {
      maticNetId = 137;
    }
    else {
      maticNetId = 80001;
    }
  }

  else if (fromNetRadio == 'BSC' && toNetRadio == 'Matic') {
    ObeahContractBurn = Obeah_Bsc;//
    ObeahContractMint = Obeah_Matic;
    WPKT_Con = new Contract(addresses.WPKT_Matic, abis.WPKT, signer);
    console.log('addresses.WPKT:', addresses.WPKT_Matic);
    fromWPKTAddr = addresses.WPKT;
    fromNetId = bscNetId;
    toNetId = maticNetId;
    tokenAddress = wpktMaticAddr;
    if (networkType =='mainnet') {
      bscNetId = 56;
    }
    else{
      bscNetId = 97;
    }
  }

  fromChainId = ("0x"+fromNetId.toString(16)).toString();
  toChainId = ("0x"+toNetId.toString(16)).toString();
  return WPKT_Con;
}



function retrieveWPKT(){
  console.log("In retrieve WPKT");
  completeTransaction();
  return;
}

async function completeTransaction(){

  dv = document.getElementById("output2");
  dv1 = document.getElementById("spin");
  dv2 = document.getElementById("outputCard2")
  dv3 = document.getElementById("addToken");

  console.log("CompleteTransaction - switching to:", toChainId);
  completePhase = true;
  var complete = false;
  var keyExists = false;
  var switching = await switchChain(toChainId);
  await setNets();

  dv3 = document.getElementById("addToken");
  dv3.style.display= 'none';
  console.log('ObeahContractMint:', ObeahContractMint);

  if (!ObeahContractMint){
    console.log('ObeahContractMintError:', ObeahContractMint);
    return;
  }

  dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Pending...</h4>";
  dv.style.display= 'block';
  dv2.style.display= 'block';

  try {
          // Check if key exists to know if transaction was already completed.
          keyExists = await ObeahContractMint.keyExistsTx(signature);
          console.log('keyExists', keyExists);

          if (keyExists){
              complete = true;
              console.log("Payout Status?:",complete);
          }
  }

  catch (err){
      console.log('Transaction Failure.', err);
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
      if (err.toString().includes('unknown account')){
          dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Please connect your metamask wallet.</h6>";
      }
      dv1.style.display= 'none';
      dv3.style.display= 'none';
      return;
  }

  if (signature && hashedTxId && blockNumber && !complete){

      if (mm_provider) {


          try{


              amt = Web3.utils.toWei(amt.toString());
              console.log('amt:', amt, 'TokenAddress:', tokenAddress, 'TID:', hashedTxId, 'ethAddr:', evmToAddress, 'Sig:',signature, 'Block Number:',blockNumber);
              var tx = await ObeahContractMint.bridgeMintStealth(amt, hashedTxId.toString(), evmToAddress.toString(), signature, blockNumber, tokenAddress.toString(), toChainId);

              console.log('TX:',tx);

              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Pending Transaction ID:</h4><Text margin='small' >" + tx.hash + "</Text><h4 style={{backgroundColor: '#2B2F36'}}>Please wait for on-chain confirmation...</h4>";
              dv1.style.display= 'block';

              ObeahContractMint.once("BridgeMinted", (recip, amount) => {
                  var feesNoWei = 0;
                  console.log('Recipient:',recip);
                  console.log('Amount:', amount.toString());
                  var amtNoWei = Web3.utils.fromWei(amount.toString());
                  initialAmt = Web3.utils.fromWei(amt.toString());
                  console.log('amtNoWei', amtNoWei, initialAmt);
                  if (Number(amtNoWei) > 0){
                    var fees = Number(initialAmt) - (Number(amtNoWei));
                    feesNoWei = fees.toFixed(4);
                  }

                  console.log("Amount:", amtNoWei, 'Fees:', feesNoWei);

                  if (Number(amtNoWei) > 0) {
                      if (receipt !== undefined) {
                          dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Pending Transaction Complete.</h4><h6 style={{backgroundColor: '#2B2F36'}}><b>Your transaction hash is " + receipt.transactionHash + "</h4>";
                      }
                      dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>You received "+amtNoWei+" WPKT tokens.</h6>";
                      dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Your fees were "+feesNoWei+" WPKT.</h6>";
                      dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>If the WPKT token hasn't already been added to your wallet yet, use the button below to add it. Make sure to add it to the right MetaMask account.</h6>";
                      dv3.style.display= 'block';
                      dv1.style.display= 'none';
                      return;
                  }
                  else {
                      dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failed.</h4>";
                      dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Bad transaction. Check your sender / recipient address pair or transaction hash. </h6>";
                      dv1.style.display= 'none';
                      return;
                  }
              });

              var receipt = await tx.wait();
              console.log('Receipt:', receipt, (receipt.status === 1));

              if (receipt.status !== 1) {
                  console.log('Transaction Failure.');
                  dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed.</h4>";
                  dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>It's possible you have already claimed this transaction.</h6>";
                  dv1.style.display= 'none';
                  return;
              }
              else {
                  console.log('Receipt received');
              }



          }
          catch (err) {
              console.log('Error:', err);
              dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
              if (err.toString().includes('unknown account')){
                dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Please connect your metamask wallet to this site.</h6>";
              }
              else if (err.code.toString().includes('-32603')){
                console.log('Err',err.message);
                dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>"+err.message+"</h4>";
              }

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
      if (complete){
        dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Payout has been completed already.</h4>";
      }
      else {
        dv.innerHTML += "<h4 style={{backgroundColor: '#2B2F36'}}>Can\'t retrieve data from bridge servers.</h4>";
      }

      dv.style.display= 'block';
      dv1.style.display= 'none';
      return;
  }
}

async function handleInput(e){

  signature = null;
  hashedTxId = null;
  blockNumber = null;

  e.preventDefault();
  //var recipAddr = e.value.recipAddr.trim().toString();
  var txid = e.value.EthTxHash.trim().toString();
  console.log("TXID:", txid);

  dv = document.getElementById("output2");
  dv1 = document.getElementById("spin");
  dv2 = document.getElementById("outputCard2")
  dv3 = document.getElementById("addToken");

  // Reset
  dv.style.display= 'none';
  dv1.style.display= 'none';
  dv2.style.display= 'none';
  dv3.style.display= 'none';

  dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Pending...</h4>";
  dv1.style.display= 'block';
  dv.style.display= 'block';
  dv2.style.display= 'block';

  // Get contracts
  Obeah_Bsc = new Contract(addresses.Obeah, abis.Obeah, signer);
  Obeah_Eth = new Contract(addresses.Obeah_Eth, abis.Obeah, signer);
  Obeah_Matic = new Contract(addresses.Obeah_Matic, abis.Obeah, signer);
  //console.log('Obeah Contract:', Obeah_Bsc, Obeah_Matic);

  setNets();
  var switching = await switchChain(toChainId);
  let correctNets = checkNetsMatch();
  if (!correctNets)
    return;

  try {
    var WPKTAmount = 0;
    var noFeeAdjAmtNoWei = 0;
    var feesNoWei = 0;
    var hash = 0;

    //Retrieve Sig
    var cmd = "https://obeah.odapp.io/api/v1/getsig/txid/"+txid+"/fromNetwork/"+fromNetId+"/toNetwork/"+toNetId+"/stealthMode/"+true;
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

        if (result.signature && result.hashedTxId && result.blockNumber){
          signature = result.signature;
          hashedTxId = result.hashedTxId;
          blockNumber = result.blockNumber;
          amt = result.tokenAmt;
          evmToAddress = result.from;
          console.log('evmToAddress', evmToAddress);
          completeTransaction();

        }
        else if (Number(result.output) === -1)  {
            console.log('Duplicate transaction.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>You can't claim the same transaction more than once.</h6>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>If the WPKT token hasn't already been added to your wallet yet, use the button below to add it. </h6>";
            dv.style.display= 'block';
            dv3.style.display= 'block';
            //dv1.style.display= 'none';
            return;
        }
        else if (Number(result.output) === -2)  {
            console.log('Bad address.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Your sender / recipient address pair was not pre-commited. Click <a href='./PreCommit' style='color:#F0B90C;' />here</a> to pre-commit an address pair. </h6>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }
        else if (Number(result.output) === -3)  {
            console.log('Gas price error.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Non-specific gas price error.</h6>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }
        else if (Number(result.output) === -4)  {
            console.log('Unknown Error.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Unknown error.</h6>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }
        else if (Number(result.output) === -5)  {
            console.log('Front Run Attempt.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Potential front run attempt.</h6>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>Your address pair does not match the pre-committed pair</h6>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }
        else {
            console.log('Bad transaction.');
            dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}> Either transaction doesn't exist or it was for a zero amount.</h6>";
            dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}> It is possible you used a different pkt address for this transaction.</h6>";
            dv.style.display= 'block';
            dv1.style.display= 'none';
            return;
        }

    }).catch(function(err) {
        console.log("error", err);
        dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Transaction Failure</h4>";
        dv.innerHTML += "<h6 style={{backgroundColor: '#2B2F36'}}>There was a problem communicating with the bridge servers.</h6>";
        dv.style.display= 'block';
        dv1.style.display= 'none';
        return;
    });


  } //try
  catch (err) {
      console.log('Transaction Failure.', err);
      dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your transaction failed</h4>";
      dv1.style.display= 'none';
      //dv2.style.display= 'block';
      dv.style.display= 'block';
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

async function userBalance(){
  WPKT_Con = await setNets(); // sets correct WPKT
  let correctNets = await checkNetsMatch();
  if (!correctNets){
    console.log('Wrong network');
    return;
  }

  try {
    var thisAccount = await provider.listAccounts();
    console.log('Signer is:', thisAccount[0]);
  }
  catch(err){
    console.log(err);
  }
  //usrBalance = Web3.utils.fromWei((await WPKT_Con.balanceOf(thisAccount[0])).toString());
  //console.log('Balance:', usrBalance);
}

function balanceError(){
  dv = document.getElementById("output2");
  dv.style.display= 'block';
  dv.innerHTML = "<h4 style={{backgroundColor: '#2B2F36'}}>Your WPKT balance is too low for this transaction.</h4>";
}

async function checkBalanceInput(value){
  dv = document.getElementById("output2");
  dv.style.display= 'none';
  await userBalance();

  if (Number(value)>Number(usrBalance)){
    balanceError();
  }
}

var initialValue = "BSC";
var initialValue2 = "Ethereum";
var initialValue3 = "Matic";
fromNetRadio = "Select"; //initialValue;
//toNetRadio = initialValue2; //**
toNetRadio = "Select"; //initialValue3;



function GetWPKT({ valueFrom: initialValue, ...props }, { valueTo: initialValue2, ...props2 }) {

  const [valueFrom, setValueFrom] = useState("Select");
  const [valueTo, setValueTo] = useState("Select");
  const [fromIcn, setFromIcn] = useState(<FormDown color='white'/>);
  const [toIcn, setToIcn] = useState(<FormDown color='white'/>);

  getProvider();
  loc = useLocation();

  return (
    <Grommet theme={customBreakpoints}>
      <ResponsiveContext.Consumer>
        {responsive => (responsive === 'smallmob') ? (
          <Box background="#fff">
          <Card width="full" round="none" background="#fff" pad="75px 20px 100px">
                   <CardBody>
                     <Box background="#fff" justify="center" alignSelf="center">
                         <HeadingDark textAlign="center" margin={{ bottom: "35px", top: "0" }} size="4xl" weight="bold" color="#222323" level="2">Recover WPKT</HeadingDark>
                         <StyledTextDark textAlign="center">If you sent your WPKT to the Teleport bridge, but failed to bridge chains, use this process to reclaim your PKT. Enter the Transaction ID you received when you sent your WPKT to the Teleport bridge, as well as your PKT recipient address. You can find your transaction id in your metamask wallet under the activity tab.</StyledTextDark>
                     </Box>
                     <Box background="#fff" justify="center" alignSelf="center" pad="50px 0 0">
                         <Box background="#f9f9f9" pad={{ top: "40px", bottom: "50px", horizontal: "20px" }} round="23px" justify="center" alignSelf="center" style={formWrapStyleMob}>
                         <Form name="ReceivePKT" id="ReceivePKT" onSubmit={handleInput}>
                         <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="18px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Enter Your WPKT Transaction and PKT Recipient Address</Heading>

                         <Box justify="center" alignSelf="center" pad="small"  background="white" round="xsmall">
                           <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                             <Menu plain closed
                               items={[
                                 {
                                   label: <Box alignSelf="center">Matic</Box>,
                                   value: 'Matic',
                                   onClick: () => {console.log('Matic'); setFromIcn(<MaticIcon/>); handleValueFromDrop('Matic', setValueFrom, setValueTo)
                                   },
                                     icon: (
                                       <Box pad="medium">
                                         <MaticIcon size="large" />
                                       </Box>
                                     ),
                                   },
                                   {
                                   label: <Box alignSelf="center">BSC</Box>,
                                   onClick: () => {console.log('BSC'); setFromIcn(<BscIcon/>); handleValueFromDrop('BSC', setValueFrom, setValueTo)
                                   },
                                     icon: (
                                       <Box pad="medium">
                                         <BscIcon size="large" />
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

                         <Box justify="center" alignSelf="center" pad={{vertical: "small"}}>
                             <FormField name="EthTxHash" required contentProps={{ border: false, margin: "0" }}>
                                 <TextInput style={{background: 'white', color: '#222323', fontSize: "18px", fontWeight: "normal", borderRadius: "6px", height: "50px" }} name="EthTxHash" placeholder={<Text weight="normal" size="18px" color="#707070">WPKT Transaction ID</Text>} />
                             </FormField>


                             <Box justify="center" alignSelf="center" pad="small" width="100%" background="white" round="xsmall">
                               <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                               <Menu plain closed
                                 items={[
                                   {
                                     label: <Box alignSelf="center">Matic</Box>,
                                     value: 'Matic',
                                     onClick: () => {console.log('Matic'); setToIcn(<MaticIcon/>); handleValueToDrop('Matic', setValueFrom, setValueTo)
                                     },
                                       icon: (
                                         <Box pad="medium">
                                           <MaticIcon size="large" />
                                         </Box>
                                       ),
                                     },
                                     {
                                     label: <Box alignSelf="center">BSC</Box>,
                                     onClick: () => {console.log('BSC'); setToIcn(<BscIcon/>); handleValueToDrop('BSC', setValueFrom, setValueTo)
                                     },
                                       icon: (
                                         <Box pad="medium">
                                           <BscIcon size="large" />
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


                             <ButtonForm hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "35px", horizontal: "auto"}} type="submit" label="Submit"/>
                         </Box>

                         </Form>
                         <div hidden id="outputCard2" style={{paddingTop: '2%'}}>
                           <Box id="outputCard2" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                               <div hidden align="center" id="output2" style={{padding:'2%'}}>
                               </div>
                               <div id="spin" align="center" pad="medium" style={{padding:'2%'}}><Spinner size="large" /></div>
                               <div hidden align="center" id="recPKT" style={{padding:'2%', wordBreak: "break-all"}}>
                                   <ButtonForm size='large' color='#F0B90C' label='Receive WPKT' id='recPKT' onClick={() => retrieveWPKT()}/>
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
            <Card width="full" round="none" background="#fff" pad="75px 50px 100px">
                    <CardBody>
                      <Box background="#fff" justify="center" alignSelf="center">
                          <HeadingDark textAlign="center" margin={{ bottom: "35px", top: "0" }} size="4xl" weight="bold" color="#222323" level="2">Recover WPKT</HeadingDark>
                          <StyledTextDark textAlign="center">If you sent your WPKT to the Teleport bridge, but failed to bridge chains, use this process to reclaim your PKT. Enter the Transaction ID you received when you sent your WPKT to the Teleport bridge, as well as your PKT recipient address. You can find your transaction id in your metamask wallet under the activity tab.</StyledTextDark>
                      </Box>
                      <Box background="#fff" justify="center" alignSelf="center" pad="50px 0 0">
                          <Box background="#f9f9f9" pad={{ top: "40px", bottom: "50px", horizontal: "20px" }} round="23px" justify="center" alignSelf="center" style={formWrapStyleMob}>
                          <Form name="ReceivePKT" id="ReceivePKT" onSubmit={handleInput}>
                          <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="18px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Enter Your WPKT Transaction and PKT Recipient Address</Heading>
                          <Box justify="center" alignSelf="center" pad="small"  background="white" round="xsmall">
                            <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                              <Menu plain closed
                                items={[
                                  {
                                    label: <Box alignSelf="center">Matic</Box>,
                                    value: 'Matic',
                                    onClick: () => {console.log('Matic'); setFromIcn(<MaticIcon/>); handleValueFromDrop('Matic', setValueFrom, setValueTo)
                                    },
                                      icon: (
                                        <Box pad="medium">
                                          <MaticIcon size="large" />
                                        </Box>
                                      ),
                                    },
                                    {
                                    label: <Box alignSelf="center">BSC</Box>,
                                    onClick: () => {console.log('BSC'); setFromIcn(<BscIcon/>); handleValueFromDrop('BSC', setValueFrom, setValueTo)
                                    },
                                      icon: (
                                        <Box pad="medium">
                                          <BscIcon size="large" />
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

                          <Box justify="center" alignSelf="center" pad={{vertical: "small"}}>
                              <FormField name="EthTxHash" required contentProps={{ border: false, margin: "0" }}>
                                  <TextInput style={{background: 'white', color: '#222323', fontSize: "18px", fontWeight: "normal", borderRadius: "6px", height: "50px" }} name="EthTxHash" placeholder={<Text weight="normal" size="18px" color="#707070">WPKT Transaction ID</Text>} />
                              </FormField>



                              <Box justify="center" alignSelf="center" pad="small" width="100%" background="white" round="xsmall">
                                <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                                <Menu plain closed
                                  items={[
                                    {
                                      label: <Box alignSelf="center">Matic</Box>,
                                      value: 'Matic',
                                      onClick: () => {console.log('Matic'); setToIcn(<MaticIcon/>); handleValueToDrop('Matic', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <MaticIcon size="large" />
                                          </Box>
                                        ),
                                      },
                                      {
                                      label: <Box alignSelf="center">BSC</Box>,
                                      onClick: () => {console.log('BSC'); setToIcn(<BscIcon/>); handleValueToDrop('BSC', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <BscIcon size="large" />
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

                              <ButtonForm hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "35px", horizontal: "auto"}} type="submit" label="Submit"/>
                          </Box>
                          </Form>
                          <div hidden id="outputCard2" style={{paddingTop: '2%'}}>
                            <Box id="outputCard2" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                <div hidden align="center" id="output2" style={{padding:'2%'}}>
                                </div>
                                <div id="spin" align="center" pad="medium" style={{padding:'2%'}}><Spinner size="large" /></div>
                                <div hidden align="center" id="recPKT" style={{padding:'2%'}}>
                                    <ButtonForm size='large' color='#F0B90C' label='Receive WPKT' id='recPKT' onClick={() => retrieveWPKT()}/>
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
             <Card width="full" round="none" background="#fff" pad="100px 30px">
                      <CardBody>
                        <Grid
                        fill
                        areas={[
                          { name: 'left', start: [0, 0], end: [0, 0] },
                          { name: 'right', start: [1, 0], end: [1, 0] },
                        ]}
                        columns={['1/2', 'flex']}
                        alignContent="center"
                        justifyContent="between"
                        rows={['flex']}
                        gap="none"
                        background="#fff"
                        >
                        <Box gridArea="left" background="#fff" justify="center" alignSelf="start">
                            <HeadingDark textAlign="start" margin={{ bottom: "50px", top: "0" }} size="4xl" weight="bold" color="#222323" level="2">Recover WPKT</HeadingDark>
                            <StyledTextDark textAlign="start" style={{ paddingRight: "6vw" }}>If you sent your WPKT to the Teleport bridge, but failed to bridge chains, use this process to reclaim your PKT. Enter the Transaction ID you received when you sent your WPKT to the Teleport bridge, as well as your PKT recipient address. You can find your transaction id in your metamask wallet under the activity tab.</StyledTextDark>
                        </Box>
                        <Box gridArea="right" background="#fff" justify="center" alignSelf="center" pad="0">
                            <Box background="#f9f9f9" pad={{ vertical: "25px", horizontal: "25px" }} round="25px" justify="center" alignSelf="center" style={formWrapStyleMed}>
                            <Form name="ReceivePKT" id="ReceivePKT" onSubmit={handleInput}>
                            <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="18px" margin={{ bottom: "35px", top: "0" }}  textAlign="center">Enter Your WPKT Transaction and PKT Recipient Address</Heading>

                            <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                              <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                                <Menu plain closed
                                  items={[
                                    {
                                      label: <Box alignSelf="center">Matic</Box>,
                                      value: 'Matic',
                                      onClick: () => {console.log('Matic'); setFromIcn(<MaticIcon/>); handleValueFromDrop('Matic', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <MaticIcon size="large" />
                                          </Box>
                                        ),
                                      },
                                      {
                                      label: <Box alignSelf="center">BSC</Box>,
                                      onClick: () => {console.log('BSC'); setFromIcn(<BscIcon/>); handleValueFromDrop('BSC', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <BscIcon size="large" />
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

                            <Box justify="center" alignSelf="center" pad={{vertical: "small"}}>
                                <FormField name="EthTxHash" required contentProps={{ border: false, margin: "0" }}>
                                    <TextInput style={{background: 'white', color: '#222323', fontSize: "18px", fontWeight: "normal", borderRadius: "6px", height: "50px", wordBreak: "break-all" }} name="EthTxHash" placeholder={<Text weight="normal" size="18px" color="#707070">WPKT Transaction ID</Text>} />
                                </FormField>



                                <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                                  <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                                  <Menu plain closed
                                    items={[
                                      {
                                        label: <Box alignSelf="center">Matic</Box>,
                                        value: 'Matic',
                                        onClick: () => {console.log('Matic'); setToIcn(<MaticIcon/>); handleValueToDrop('Matic', setValueFrom, setValueTo)
                                        },
                                          icon: (
                                            <Box pad="medium">
                                              <MaticIcon size="large" />
                                            </Box>
                                          ),
                                        },
                                        {
                                        label: <Box alignSelf="center">BSC</Box>,
                                        onClick: () => {console.log('BSC'); setToIcn(<BscIcon/>); handleValueToDrop('BSC', setValueFrom, setValueTo)
                                        },
                                          icon: (
                                            <Box pad="medium">
                                              <BscIcon size="large" />
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


                                <ButtonForm hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "35px", horizontal: "auto"}} type="submit" label="Submit"/>
                            </Box>
                            </Form>
                            <div hidden id="outputCard2" style={{paddingTop: '2%', wordBreak: "break-word"}}>
                              <Box id="outputCard2" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                  <div hidden align="center" id="output2" style={{padding:'2%', wordBreak: "break-word"}}>
                                  </div>
                                  <div id="spin" align="center" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>
                                  <div hidden align="center" id="recPKT" style={{padding:'2%', wordBreak: "break-word"}}>
                                      <ButtonForm size='large' color='#F0B90C' label='Receive WPKT' id='recPKT' onClick={() => retrieveWPKT()}/>
                                  </div>
                              </Box>
                            </div>
                            </Box>
                        </Box>
                        </Grid>
                      </CardBody>
                </Card>
            </Box>
        ) : (responsive === 'medium') ? (
          <Box background="#fff">
             <Card width="full" round="none" background="#fff" pad="150px 50px">
                      <CardBody>
                        <Grid
                        fill
                        areas={[
                          { name: 'left', start: [0, 0], end: [0, 0] },
                          { name: 'right', start: [1, 0], end: [1, 0] },
                        ]}
                        columns={['1/2', 'flex']}
                        alignContent="center"
                        justifyContent="between"
                        rows={['flex']}
                        gap="none"
                        background="#fff"
                        >
                        <Box gridArea="left" background="#fff" justify="center" alignSelf="start">
                            <HeadingDark textAlign="start" margin={{ bottom: "50px", top: "0" }} size="4xl" weight="bold" color="#222323" level="2">Recover WPKT</HeadingDark>
                            <StyledTextDark textAlign="start" style={{ paddingRight: "6vw" }}>If you sent your WPKT to the Teleport bridge, but failed to bridge chains, use this process to reclaim your PKT. Enter the Transaction ID you received when you sent your WPKT to the Teleport bridge, as well as your PKT recipient address. You can find your transaction id in your metamask wallet under the activity tab.</StyledTextDark>
                        </Box>
                        <Box gridArea="right" background="#fff" justify="center" alignSelf="center" pad="0">
                            <Box background="#f9f9f9" pad={{ vertical: "large", horizontal: "xlarge" }} round="25px" justify="center" alignSelf="center" style={formWrapStyle}>
                            <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="24px" margin={{ bottom: "50px", top: "0" }}  textAlign="center">Enter Details Below</Heading>

                            <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                              <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                                <Menu plain closed
                                  items={[
                                    {
                                      label: <Box alignSelf="center">Matic</Box>,
                                      value: 'Matic',
                                      onClick: () => {console.log('Matic'); setFromIcn(<MaticIcon/>); handleValueFromDrop('Matic', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <MaticIcon size="large" />
                                          </Box>
                                        ),
                                      },
                                      {
                                      label: <Box alignSelf="center">BSC</Box>,
                                      onClick: () => {console.log('BSC'); setFromIcn(<BscIcon/>); handleValueFromDrop('BSC', setValueFrom, setValueTo)
                                      },
                                        icon: (
                                          <Box pad="medium">
                                            <BscIcon size="large" />
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
                            <Form name="ReceivePKT" id="ReceivePKT" onSubmit={handleInput}>

                            <Box justify="center" alignSelf="center" pad={{vertical: "small"}}>
                                <FormField name="EthTxHash" required contentProps={{ border: false, margin: "0" }}>
                                    <TextInput style={{background: 'white', color: '#222323', fontSize: "24px", fontWeight: "normal", borderRadius: "6px", height: "60px" }} name="EthTxHash" placeholder={<Text weight="normal" size="24px" color="#707070">WPKT Transaction ID</Text>} />
                                </FormField>


                                <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                                  <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                                  <Menu plain closed
                                    items={[
                                      {
                                        label: <Box alignSelf="center">Matic</Box>,
                                        value: 'Matic',
                                        onClick: () => {console.log('Matic'); setToIcn(<MaticIcon/>); handleValueToDrop('Matic', setValueFrom, setValueTo)
                                        },
                                          icon: (
                                            <Box pad="medium">
                                              <MaticIcon size="large" />
                                            </Box>
                                          ),
                                        },
                                        {
                                        label: <Box alignSelf="center">BSC</Box>,
                                        onClick: () => {console.log('BSC'); setToIcn(<BscIcon/>); handleValueToDrop('BSC', setValueFrom, setValueTo)
                                        },
                                          icon: (
                                            <Box pad="medium">
                                              <BscIcon size="large" />
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

                                <ButtonForm hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "50px", horizontal: "auto"}} type="submit" label="Submit"/>
                            </Box>
                            </Form>
                            <div hidden id="outputCard2" style={{paddingTop: '2%', wordBreak: "break-word"}}>
                              <Box id="outputCard2" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                  <div hidden align="center" id="output2" style={{padding:'2%', wordBreak: "break-word"}}>
                                  </div>
                                  <div id="spin" align="center" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>
                                  <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}>
                                      <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addWPKT()}/>
                                  </div>
                                  {/*<div hidden align="center" id="recPKT" style={{padding:'2%', wordBreak: "break-word"}}>
                                      <ButtonForm size='large' color='#F0B90C' label='Receive WPKT' id='recPKT' onClick={() => retrieveWPKT()}/>
                                  </div>*/}
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
                        <Grid
                        fill
                        areas={[
                          { name: 'left', start: [0, 0], end: [0, 0] },
                          { name: 'right', start: [1, 0], end: [1, 0] },
                        ]}
                        columns={['1/2', 'flex']}
                        alignContent="center"
                        justifyContent="between"
                        rows={['flex']}
                        gap="none"
                        background="#fff"
                        >
                        <Box gridArea="left" background="#fff" height={{ min: "85vh" }} justify="center" alignSelf="start">
                            <HeadingDark textAlign="start" margin={{ bottom: "50px", top: "0" }} size="4xl" weight="bold" color="#222323" level="2">Recover WPKT</HeadingDark>
                            <StyledTextDark textAlign="start" style={{ paddingRight: "6vw" }}>If you sent your WPKT to the Teleport bridge, but failed to bridge chains, use this process to reclaim your PKT. Select the network you are bridging to. Next, enter the Transaction ID you received when you sent your WPKT to the Teleport bridge, as well as your WPKT recipient address. You can find your transaction id in your metamask wallet under the activity tab.</StyledTextDark>
                        </Box>

                        <Box gridArea="right" background="#fff" justify="end" alignSelf="center" pad="0">
                          <Box background="#f9f9f9" pad={{ vertical: "large", horizontal: "large" }} round="25px" justify="end" alignSelf="center" style={formWrapStyleMed}>
                            <Heading style={{ fontWeight: "normal"}} color="#222323" level="3" size="24px" margin={{ bottom: "50px", top: "0" }}  textAlign="center">Enter Details Below</Heading>
                            <Form name="ReceivePKT" id="ReceivePKT" onSubmit={handleInput}>
                            <Box justify="center" alignSelf="center" width="100%">
                                <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                                  <Text justify="center" alignSelf="left" weight="bold">From:</Text>

                                    <Menu plain closed
                                      items={[
                                        {
                                          label: <Box alignSelf="center">Matic</Box>,
                                          value: 'Matic',
                                          onClick: () => {console.log('Matic'); setFromIcn(<MaticIcon/>); handleValueFromDrop('Matic', setValueFrom, setValueTo)
                                          },
                                            icon: (
                                              <Box pad="medium">
                                                <MaticIcon size="large" />
                                              </Box>
                                            ),
                                          },
                                          {
                                          label: <Box alignSelf="center">BSC</Box>,
                                          onClick: () => {console.log('BSC'); setFromIcn(<BscIcon/>); handleValueFromDrop('BSC', setValueFrom, setValueTo)
                                          },
                                            icon: (
                                              <Box pad="medium">
                                                <BscIcon size="large" />
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

                                  <FormField name="EthTxHash" required contentProps={{ border: false, margin: "0", pad: {top:"small", bottom:"0", left:"0", right:"0"}}}>
                                    <TextInput style={{background: 'white', color: '#222323', fontSize: "24px", fontWeight: "normal", borderRadius: "6px", height: "60px" }} name="EthTxHash" placeholder={<Text weight="normal" size="24px" color="#707070">WPKT Transaction ID</Text>} />
                                  </FormField>



                                  <Box justify="center" alignSelf="center" pad="small" width="large" background="white" round="xsmall">
                                    <Text justify="center" alignSelf="left" weight="bold">To:</Text>

                                    <Menu plain closed
                                      items={[
                                        {
                                          label: <Box alignSelf="center">Matic</Box>,
                                          value: 'Matic',
                                          onClick: () => {console.log('Matic'); setToIcn(<MaticIcon/>); handleValueToDrop('Matic', setValueFrom, setValueTo)
                                          },
                                            icon: (
                                              <Box pad="medium">
                                                <MaticIcon size="large" />
                                              </Box>
                                            ),
                                          },
                                          {
                                          label: <Box alignSelf="center">BSC</Box>,
                                          onClick: () => {console.log('BSC'); setToIcn(<BscIcon/>); handleValueToDrop('BSC', setValueFrom, setValueTo)
                                          },
                                            icon: (
                                              <Box pad="medium">
                                                <BscIcon size="large" />
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

                                <ButtonForm style={{width: '55%' }} hoverIndicator={{background: "#222323", boxShadow: "0"}} margin={{top: "15px", horizontal: "auto"}} color="#fff" type="submit" label="Submit"></ButtonForm>
                            </Box>
                            </Form>


                            <div hidden id="outputCard2" style={{paddingTop: '2%', wordBreak: "break-word"}}>
                              <Box id="outputCard2" width="100%" responsive round="small" style={{backgroundColor:'#2B2F36', color:'white', padding:'0%'}}>
                                  <div hidden align="center" id="output2" style={{padding:'2%', wordBreak: "break-word"}}>
                                  </div>
                                  <div id="spin" align="center" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}><Spinner size="large" /></div>
                                  <div hidden align="center" id="addToken" pad="medium" style={{padding:'2%', wordBreak: "break-word"}}>
                                      <StyledButton size='large' pad="medium" color='#F0B90C' label='Add Token To Wallet' id='addToken' onClick={() => addWPKT()}/>
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

export default GetWPKT;
