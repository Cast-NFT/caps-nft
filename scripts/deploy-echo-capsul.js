const { ethers } = require("hardhat");

async function main() {
  const owner = process.env.OWNER_ADDRESS;
  const treasury = process.env.TREASURY_ADDRESS;
  const prerevealURI = process.env.PREREVEAL_URI;

  if (!owner) throw new Error("Missing OWNER_ADDRESS in environment");
  if (!treasury) throw new Error("Missing TREASURY_ADDRESS in environment");
  if (!prerevealURI) throw new Error("Missing PREREVEAL_URI in environment");

  const factory = await ethers.getContractFactory("EchoCapsulNFT");
  const contract = await factory.deploy(owner, treasury, prerevealURI);

  await contract.waitForDeployment();

  console.log("EchoCapsulNFT deployed to:", await contract.getAddress());
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);
  console.log("Prereveal URI:", prerevealURI);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
