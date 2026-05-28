require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const BATCH = parseInt(process.argv[2] || '0');

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const funder = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  
  const all = lines.map(line => {
    const [index, address, privateKey] = line.split(',');
    return { index: parseInt(index), address, privateKey };
  });
  
  const start = 6 + BATCH * 5;
  const batch = all.slice(start, start + 5);
  
  const fundAmount = ethers.parseEther('0.000001');
  const contractAddr = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintAbi = ['function mint(uint256 quantity) payable'];
  
  // Get accurate nonce
  let nonce = await provider.getTransactionCount(funder.address, 'latest');
  
  let ok = 0;
  for (const w of batch) {
    try {
      const ftx = await funder.sendTransaction({
        to: w.address,
        value: fundAmount,
        gasLimit: 21000,
        nonce: nonce++,
      });
      await ftx.wait();
      
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const c = new ethers.Contract(contractAddr, mintAbi, wallet);
      const mtx = await c.mint(5, { value: 0 });
      await mtx.wait();
      ok++;
      console.log('[' + String(w.index).padStart(3,'0') + '] OK ' + w.address);
    } catch (e) {
      console.error('[' + String(w.index).padStart(3,'0') + '] FAIL ' + (e.shortMessage || e.message));
    }
  }
  console.log('BATCH ' + BATCH + ' DONE: ' + ok + '/' + batch.length);
}

main().catch(e => console.error('FATAL:', e));
