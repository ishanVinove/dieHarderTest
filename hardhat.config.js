require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    besu: {
      url: "http://62.3.32.217:9500",
      accounts: ["ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f"]
    },
  },
};
