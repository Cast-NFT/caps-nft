require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  
  const wallets = lines.map(line => {
    const [index, address, privateKey] = line.split(',');
    return { index: parseInt(index), address, privateKey };
  });
  
  const fee = await provider.getFeeData();
  const gasPrice = fee.gasPrice;
  const gasLimit = '0x1FB00'; // 129792
  const CA = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintData = '0xa0712d680000000000000000000000000000000000000000000000000000000000000005';
  
  console.log('Gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');
  console.log('Minting 5 NFT on ' + wallets.length + ' wallets...\n');
  
  let ok = 0, fail = 0;
  
  for (const w of wallets) {
    try {
      const wallet = new ethers.Wallet(w.privateKey, provider);
      
      const tx = {
        to: CA,
        data: mintData,
        value: '0x0',
        gasLimit: gasLimit,
        gasPrice: '0x' + gasPrice.toString(16),
        chainId: 8453,
        type: 0,
      };
      
      const signed = await wallet.signTransaction(tx);
      const sent = await provider.broadcastTransaction(signed);
      await sent.wait();
      ok++;
      console.log('[' + String(w.index).padStart(3,'0') + '] 5NFT minted');
      await delay(200);
    } catch (e) {
      fail++;
      console.log('[' + String(w.index).padStart(3,'0') + '] FAIL: ' + (e.shortMessage || e.message));
      await delay(300);
    }
  }
  
  console.log('\nDONE: OK=' + ok + ' FAIL=' + fail + ' | Total NFT: ' + (ok * 5));
}

main().catch(e => console.error('FATAL:', e));
