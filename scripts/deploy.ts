import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Starting deployment...");
  console.log("Deploying with account:", deployer.address);

  const balance = await deployer.provider?.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance!), "VT");

  console.log("📦 Getting contract factory...");
  const Voting = await ethers.getContractFactory("Voting");

  console.log("⏳ Deploying contract...");
  const voting = await Voting.deploy();

  const txHash = voting.deploymentTransaction()?.hash;
  console.log("Transaction hash:", txHash);

  await voting.waitForDeployment();
  const address = await voting.getAddress();
  console.log("\n✅ Contract deployed to:", address);
    
  // Save address to constants file
  console.log("\n📝 Updating contract address in constants...");
  const fs = require('fs');
  const constantsPath = './src/constants/contracts.ts';
  const constantsContent = `export const VOTING_CONTRACT_ADDRESS = "${address}";\n`;
  fs.writeFileSync(constantsPath, constantsContent);
  console.log("Constants updated!");

  console.log("\n✨ Deployment Summary:");
  console.log("Contract Address:", address);
  console.log("Explorer URL:", `https://volta-explorer.energyweb.org/address/${address}`);
}

main().catch((error) => {
  console.error("❌ Top-level error:", error);
  process.exit(1);
});


