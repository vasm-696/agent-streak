require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Optimizer explicitly ON, 200 runs — BscScan verification must use these exact settings.
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
    },
  },
};
