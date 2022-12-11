
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/faucet");
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://testnets-api.opensea.io/api/v1`,
    },
    matic: {
      url: "https://testnets-api.opensea.io/api/v1",
    },
  },
  solidity: "0.8.9"
};