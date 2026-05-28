require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const REMAINING = [9,10,29,33,38,41,59,98,100];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function retryTx(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      console.log('    retry ' + (i+1) + ' after: ' + (e.shortMessage || e.message));
      await delay(2000);
    }
  }
}

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const funder = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  
  const wallets = {};
  lines.forEach(line => {
    const [index, address, privateKey] = line.split(',');
    wallets[parseInt(index)] = { index: parseInt(index), address, privateKey };
  });
  
  const fundAmount = ethers.parseEther('0.000001');
  const CA = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintAbi = ['function mint(uint256 quantity) payable'];
  const checkAbi = ['function mintedPerWallet(address) view returns (uint256)'];
  const checkC = new ethers.Contract(CA, checkAbi, provider);
  
  let ok = 0, skip = 0, fail = 0;
  
  for (const idx of REMAINING) {
    const w = wallets[idx];
    
    try {
      // Check
      const minted = await retryTx(() => checkC.mintedPerWallet(w.address));
      if (Number(minted) >= 5) {
        console.log('[' + String(idx).padStart(3,'0') + '] SKIP');
        skip++;
        await delay(500);
        continue;
      }
      
      // Fund
      console.log('[' + String(idx).padStart(3,'0') + '] funding...');
      const ftx = await retryTx(() => funder.sendTransaction({
        to: w.address, value: fundAmount, gasLimit: 21000,
      }));
      await retryTx(() => ftx.wait());
      
      // Mint
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const c = new ethers.Contract(CA, mintAbi, wallet);
      const mtx = await retryTx(() => c.mint(5, { value: 0 }));
      await retryTx(() => mtx.wait());
      ok++;
      console.log('[' + String(idx).padStart(3,'0') + '] OK 5NFT ✓');
      
      await delay(1000);
    } catch (e) {
      fail++;
      console.log('[' + String(idx).padStart(3,'0') + '] FAIL (' + (e.shortMessage || e.message) + ')');
      await delay(1000);
    }
  }
  
  console.log('\nFINAL: OK=' + ok + ' SKIP=' + skip + ' FAIL=' + fail);
}

main().catch(e => console.error('FATAL:', e));
