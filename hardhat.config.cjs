require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    volta: {
      url: "https://volta-rpc.energyweb.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 73799
    }
  }
};
