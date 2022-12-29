const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

require("hardhat-deploy");
require("hardhat-deploy-ethers");
 
const fa = require("@glif/filecoin-address");
const util = require("util");
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");
const request = util.promisify(require("request"));

const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY;
  
 
async function callRpc(method, params) {
  var options = {
    method: "POST",
    url: "https://wallaby.node.glif.io/rpc/v0", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  };
  const res = await request(options); 
  return JSON.parse(res.body).result;
}

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;


  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");
  const f4Address = fa.newDelegatedEthAddress(deployer.address).toString(); 

  console.log("Wallet Ethereum Address:", deployer.address);
  console.log("Wallet f4Address: ", f4Address)


  await deploy("CryptoDevs", {
    from: deployer.address,
    args: [METADATA_URL,WHITELIST_CONTRACT_ADDRESS], 
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });  
};
 


module.exports.tags = ["CryptoDevs"];