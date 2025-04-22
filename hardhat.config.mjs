import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: "0.8.28",
  networks: {
    volta: {
      url: "https://volta-rpc.energyweb.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 73799,
    },
  },
};

export default config;
