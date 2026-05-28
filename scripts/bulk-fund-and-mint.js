require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

// Force unbuffered stdout
process.stdout._handle && process.stdout._handle.setBlocking(true);

function log(msg) {
  console.log(msg);
  // Force flush
  if (process.stdout.write && process.stdout.writable) {
    // Already flushed by console.log with newline in TTY, but just to be safe:
  }
}

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const funder = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  
  const csv = fs.readFileSync('bulk-wallets.csv', 'utf8');
  const lines = csv.trim().split('\n').slice(7); // skip header + wallets #1-6
  
  const wallets = lines.map(line => {
    const [index, address, privateKey] = line.split(',');
    return { index: parseInt(index), address, privateKey };
  });
  
  const fundAmount = ethers.parseEther('0.000001');
  const contractAddr = '0x6bAC7AAdf9bE28910B7E4A56C1c561F8aA3b5A58';
  const mintAbi = ['function mint(uint256 quantity) payable'];
  
  let ok = 0, fail = 0;
  
  console.error('START: ' + wallets.length + ' wallets');
  
  for (const w of wallets) {
    try {
      // Fund
      const ftx = await funder.sendTransaction({ to: w.address, value: fundAmount });
      await ftx.wait();
      
      // Mint
      const wallet = new ethers.Wallet(w.privateKey, provider);
      const contract = new ethers.Contract(contractAddr, mintAbi, wallet);
      const mtx = await contract.mint(5, { value: 0 });
      await mtx.wait();
      
      ok++;
      console.error('[' + String(w.index).padStart(3,'0') + '] OK 5NFT ' + w.address + ' tx=' + mtx.hash.substring(0,10) + '...');
    } catch (e) {
      fail++;
      console.error('[' + String(w.index).padStart(3,'0') + '] FAIL ' + (e.shortMessage || e.message));
    }
  }
  
  console.error('\nDONE: ' + ok + '/' + (ok+fail) + ' | Total NFT: ' + (ok * 5));
}

main().catch(e => console.error('FATAL:', e));
