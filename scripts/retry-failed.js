require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const REMAINING = [9,10,11,18,20,23,29,32,33,38,40,41,44,46,48,59,60,73,76,80,84,86,90,97,98,99,100];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

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
  const contractAddr = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintAbi = ['function mint(uint256 quantity) payable'];
  const checkAbi = ['function mintedPerWallet(address) view returns (uint256)'];
  const checkC = new ethers.Contract(contractAddr, checkAbi, provider);
  
  let ok = 0, skip = 0, fail = 0;
  
  for (const idx of REMAINING) {
    const w = wallets[idx];
    if (!w) { console.log('['+idx+'] NOT FOUND'); fail++; continue; }
    
    try {
      // Check existing mints
      const minted = await checkC.mintedPerWallet(w.address);
      if (Number(minted) >= 5) {
        console.log('[' + String(idx).padStart(3,'0') + '] SKIP (already ' + minted + ' NFT)');
        skip++;
        await delay(200);
        continue;
      }
      
      // Check balance
      const bal = await provider.getBalance(w.address);
      if (bal < ethers.parseEther('0.0000005')) {
        const ftx = await funder.sendTransaction({
          to: w.address, value: fundAmount, gasLimit: 21000,
        });
        await ftx.wait();
      }
      
      // Mint
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const c = new ethers.Contract(contractAddr, mintAbi, wallet);
      const qty = Math.min(5, 10 - Number(minted));
      const mtx = await c.mint(qty, { value: 0 });
      await mtx.wait();
      ok++;
      console.log('[' + String(idx).padStart(3,'0') + '] OK ' + qty + 'NFT ' + w.address);
      
      await delay(300);
    } catch (e) {
      fail++;
      console.log('[' + String(idx).padStart(3,'0') + '] FAIL ' + (e.shortMessage || e.message));
      await delay(500);
    }
  }
  
  console.log('\nRETRY: OK=' + ok + ' SKIP=' + skip + ' FAIL=' + fail);
}

main().catch(e => console.error('FATAL:', e));
