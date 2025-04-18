import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

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
