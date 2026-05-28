require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1); // skip header
  
  const wallets = lines.map(line => {
    const [index, address, privateKey] = line.split(',');
    return { index: parseInt(index), address, privateKey };
  });
  
  const amount = ethers.parseEther('0.000003');
  const balance = await provider.getBalance(signer.address);
  
  console.log(`Deployer: ${signer.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
  console.log(`Sending 0.000003 ETH to ${wallets.length} wallets...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const w of wallets) {
    try {
      const tx = await signer.sendTransaction({
        to: w.address,
        value: amount,
      });
      console.log(`[${w.index}/100] TX: ${tx.hash} → ${w.address}`);
      await tx.wait();
      success++;
    } catch (e) {
      console.error(`[${w.index}/100] FAILED: ${w.address} — ${e.shortMessage || e.message}`);
      failed++;
    }
  }
  
  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
  
  const newBalance = await provider.getBalance(signer.address);
  console.log(`Remaining balance: ${ethers.formatEther(newBalance)} ETH`);
}

main().catch(console.error);
