import {restore_keystore} from './Lightwallet'
import {signing, txutils} from 'eth-lightwallet'
const SignerProvider = require('ethjs-provider-signer');
const Web3 = require('web3')

//let instanceContract = null
let web3;
let ks;

function signTransaction(rawTx, cb) {
  console.log('signing', rawTx)
  let tx = {
    nonce: rawTx.nonce,
    gasPrice: rawTx.gasPrice,
    to: rawTx.to,
    value: rawTx.value,
    gasLimit: rawTx.gas,
    data: rawTx.data
  }
  console.log(tx)
  get_derived_key('asdf').then(pwDerivedKey => {
    let contractTx = txutils.createContractTx(rawTx.from, tx)
    console.log(contractTx)
    let signedTx = signing.signTx(ks, pwDerivedKey, contractTx.tx, rawTx.from)
    console.log(signedTx)
    cb(null, '0x' + signedTx)
  }).catch(e => cb(e))
}

export function initWeb3(keystore){
    ks = restore_keystore(keystore)
    ks.signTransaction = signTransaction
    const provider = new SignerProvider('https://rinkeby.infura.io', ks);
    web3 = new Web3(provider)
    //initContract()
}
/*
export function initContract() {
  return web3.eth.net.getId().then(networkId => {
    let artifact = AllowanceRegistry.v1;
    let abi = artifact.abi;
    let addr = artifact.networks[networkId].address
    instanceContract = new web3.eth.Contract(abi, addr, {
      from: '0x' + ks.addresses[0]
      ,gas: 300000,
      //gasPrice: '10000000000'
    });
  })
}

export function isRegistrar() {
  if (instanceContract !== null) {
    return instanceContract.methods.registrars('0x' + ks.addresses[0]).call()
  }
  return Promise.reject('Contrato no inicializado')
}

export function isAllowed(address) {
  if (instanceContract !== null) {
    return instanceContract.methods.isAllowed(address).call()
  }
  return Promise.reject('Contrato no inicializado')
}

export function allowUser(address) {
  if (instanceContract !== null) {
    return instanceContract.methods.allowUser(address).send()
  }
  return Promise.reject('Contrato no inicializado')
}

export function denyUser(address) {
  if (instanceContract !== null) {
    return instanceContract.methods.denyUser(address).send()
  }
  return Promise.reject('Contrato no inicializado')
}
*/
export function get_accounts() {
    return ks.addresses
}

export function get_seed_words(password) {
  return get_derived_key(password).then(pwDerivedKey => {
    return Promise.resolve(ks.getSeed(pwDerivedKey).toString())
  })
}

function get_derived_key(password) {
  return new Promise((resolve, reject) => {
    ks.keyFromPassword(password, (e, pwDerivedKey) => {
      if (e) return reject(e)
      resolve(pwDerivedKey)
    })
  })
}

export function getWeiBalance(address) {
    return web3.eth.getBalance(address)
}

export function getTransaction(txHash) {
  return web3.eth.getTransaction(txHash)
}

export function network() {
  return web3.eth.net.getId()
}

export function net_label(netId) {
  switch (netId) {
    case 1:
      return 'Mainnet'
    case 2:
      return 'Deprecated'
    case 3:
      return 'Ropsten'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return 'Unknown'
  }
}

export function from_wei(wei) {
  return (parseInt(wei, 10) / 1000000000000000000)
}

export function sendTransaction(password, tx) {
  return get_derived_key(password).then(pwDerivedKey => {
    tx.pwDerivedKey = pwDerivedKey
    console.log('send', pwDerivedKey)
    return web3.eth.sendTransaction(tx)
  })
}
