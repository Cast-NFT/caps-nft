require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const funder = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  
  const wallets = [];
  lines.forEach(line => {
    const [index, address, privateKey] = line.split(',');
    wallets.push({ index: parseInt(index), address, privateKey });
  });
  
  const fundAmount = ethers.parseEther('0.000001');
  const CA = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintAbi = ['function mint(uint256 quantity) payable'];
  
  // PHASE 1: Fund wallets #5-100 (skip #1-4, user already funded)
  console.log('=== PHASE 1: FUNDING 96 wallets (#5-#100) ===\n');
  let fundOk = 0, fundFail = 0;
  
  for (const w of wallets) {
    if (w.index <= 4) continue; // skip already funded
    
    try {
      const ftx = await funder.sendTransaction({
        to: w.address, value: fundAmount, gasLimit: 21000,
      });
      await ftx.wait();
      fundOk++;
      console.log('[' + String(w.index).padStart(3,'0') + '] funded');
      await delay(300);
    } catch (e) {
      fundFail++;
      console.log('[' + String(w.index).padStart(3,'0') + '] FUND FAIL: ' + (e.shortMessage || e.message));
      await delay(500);
    }
  }
  
  console.log('\nFund done: ' + fundOk + '/' + (100-4) + '\n');
  
  // PHASE 2: Mint 5 NFT for ALL 100 wallets
  console.log('=== PHASE 2: MINTING 5 NFT × 100 ===\n');
  let mintOk = 0, mintFail = 0;
  
  for (const w of wallets) {
    try {
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const c = new ethers.Contract(CA, mintAbi, wallet);
      const mtx = await c.mint(5, { value: 0 });
      await mtx.wait();
      mintOk++;
      console.log('[' + String(w.index).padStart(3,'0') + '] 5NFT minted');
      await delay(300);
    } catch (e) {
      mintFail++;
      console.log('[' + String(w.index).padStart(3,'0') + '] MINT FAIL: ' + (e.shortMessage || e.message));
      await delay(500);
    }
  }
  
  console.log('\n=== DONE ===');
  console.log('Funded: ' + fundOk + '/' + (100-4));
  console.log('Minted: ' + mintOk + '/100');
  console.log('Total NFT: ' + (mintOk * 5));
}

main().catch(e => console.error('FATAL:', e));
