const Web3 = require('web3');
const fs = require('fs');
const crypto = require('crypto');
const Contract = require('../artifacts/contracts/Lottery.sol/Lottery.json');

// Initialize Web3 and contract
const web3 = new Web3('http://62.3.32.217:9500');
const contractAddress = '0xC8c03647d39a96f02f6Ce8999bc22493C290e734';
const contract = new web3.eth.Contract(Contract.abi, contractAddress);

// Function to generate a secure random XOR mask
function generateXorMask() {
  return crypto.randomBytes(4).readUInt32BE(0);
}

// Function to test randomness and write data to file in a bitstream format
const testRandomness = async () => {
  const lotteryId = 'test_lottery';
  const initialTab = Array.from({ length: 1000 }, (_, i) => i + 1);
  const fileStream = fs.createWriteStream('smart_contracts.bin', { flags: 'w' });
  const BATCH_SIZE = 1000;

  for (let i = 0; i < 100000; i++) {
    const randomNumbers = await contract.methods.randomNumbersGenerate(lotteryId, initialTab).call();
    console.log(`Generating random numbers, iteration: ${i + 1}`);

    // Apply XOR mask and convert each random number to a 4-byte binary string
    randomNumbers.forEach((num) => {
      const xorMask = generateXorMask();
      const maskedNum = (num ^ xorMask) >>> 0;

      const binaryString = maskedNum.toString(2).padStart(32, '0'); 
      fileStream.write(binaryString, 'binary'); 
    });

    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`Saved ${i + 1} batches of random numbers to file...`);
    }
  }

  fileStream.end(() => {
    console.log(`Finished writing random numbers to 'smart_contracts.bin'`);
  });
};

testRandomness().catch(console.error);
