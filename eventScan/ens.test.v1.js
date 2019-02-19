const Web3 = require('web3');
const fs = require('fs');
const path = require("path");

async function startApp() {
  
  // Both HTTP and Websocket should work
  const provider = 'wss://mainnet.infura.io/ws';
  const web3 = await new Web3(new Web3.providers.WebsocketProvider(provider));
  
 // const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/<API - Key>'));

  const __dirname = '../build/contracts/';
  let contractAbi = fs.readFileSync(path.resolve(__dirname, "ens.json"));
  contractAbi = JSON.parse(contractAbi);

  const contractAddress = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef';

  let contract = new web3.eth.Contract(contractAbi, contractAddress);

  contract.getPastEvents('BidRevealed', {
      fromBlock: (await web3.eth.getBlockNumber() - 11520), // 4×60×48  ~ considered avg 15 sec for block generation 
      toBlock: 'latest'
    },
    (error, logs) => {
      let value;
      let owner;
      if (error) console.error(error);
      logs.forEach(log => {
        // console.log("Log  : ", log);
        console.log("Block Number : ", log.blockNumber);
        console.log("Event : ", log.event);
        console.log("Bid Hash Value : ", log.raw.topics[1]);
        owner = web3.eth.abi.decodeParameter('address', log.raw.topics[2]);
        console.log("Owner Raw : ", owner);
        console.log("Owner : ", log.returnValues.owner);
        value = web3.utils.fromWei(log.returnValues.value, 'ether');
        console.log("Bid Value in Ether: ", value);
        console.log("Bid Status : ", log.returnValues.status);
        console.log("-----------------------------------------------------------------");
      });
    });
}

startApp();
