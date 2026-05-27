const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x7C53D108F24F69ee8EB43437a9D0E9766355f384";

async function main() {
  const desiredState = process.argv.includes("--off") ? false : true;
  const [signer] = await hre.ethers.getSigners();
  const signerAddress = await signer.getAddress();

  const contract = await hre.ethers.getContractAt("EchoCapsulNFT", CONTRACT_ADDRESS, signer);
  const owner = await contract.owner();
  const before = await contract.mintActive();

  console.log("Signer:", signerAddress);
  console.log("Owner:", owner);
  console.log("Mint active before:", before);

  if (signerAddress.toLowerCase() !== owner.toLowerCase()) {
    throw new Error("Configured DEPLOYER_PRIVATE_KEY is not the contract owner");
  }

  if (before === desiredState) {
    console.log(`No change needed. mintActive already ${desiredState}.`);
    return;
  }

  const tx = await contract.setMintActive(desiredState);
  console.log("Submitted tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);

  const after = await contract.mintActive();
  console.log("Mint active after:", after);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
