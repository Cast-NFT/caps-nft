require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const REMAINING = [1,8,11,14,40,60];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  
  const wallets = {};
  lines.forEach(line => {
    const [index, address, privateKey] = line.split(',');
    wallets[parseInt(index)] = { index: parseInt(index), address, privateKey };
  });
  
  const fee = await provider.getFeeData();
  const gasPrice = fee.gasPrice;
  const CA = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintData = '0xa0712d680000000000000000000000000000000000000000000000000000000000000005';
  const checkAbi = ['function mintedPerWallet(address) view returns (uint256)'];
  const checkC = new ethers.Contract(CA, checkAbi, provider);
  
  let ok = 0, skip = 0, fail = 0;
  
  for (const idx of REMAINING) {
    const w = wallets[idx];
    try {
      const minted = await checkC.mintedPerWallet(w.address);
      if (Number(minted) >= 5) {
        console.log('[' + String(idx).padStart(3,'0') + '] SKIP (already ' + minted + ')');
        skip++;
        continue;
      }
      
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const tx = {
        to: CA, data: mintData, value: '0x0',
        gasLimit: '0x1FB00',
        gasPrice: '0x' + gasPrice.toString(16),
        chainId: 8453, type: 0,
      };
      const signed = await wallet.signTransaction(tx);
      const sent = await provider.broadcastTransaction(signed);
      await sent.wait();
      ok++;
      console.log('[' + String(idx).padStart(3,'0') + '] 5NFT ✓');
      await delay(500);
    } catch (e) {
      fail++;
      console.log('[' + String(idx).padStart(3,'0') + '] FAIL: ' + (e.shortMessage || e.message));
      await delay(500);
    }
  }
  
  console.log('\nOK=' + ok + ' SKIP=' + skip + ' FAIL=' + fail);
}

main().catch(e => console.error('FATAL:', e));
