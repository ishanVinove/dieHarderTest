// const Web3 = require('web3');
// const Contract = require('../artifacts/contracts/Lottery.sol/Lottery.json');

// const web3 = new Web3('http://35.154.131.54:8540');
// const contractAddress = '0x79306966344032dA160C8Ef9a8fe6A4ec8d62987';
// const contract = new web3.eth.Contract(Contract.abi, contractAddress);

// const testRandomness = async () => {
//     const lotteryId = 'test_lottery';
//     const initialTab = Array.from({ length: 1000 }, (_, i) => i + 1);
//     const results = [];

//     for (let i = 0; i < 100000; i++) {
//         const randomNumbers = await contract.methods.randomNumbersGenerate(lotteryId, initialTab).call();
//         console.log("Where we at", i);
//         results.push(randomNumbers);
//     }

//     const buffer = Buffer.alloc(results.reduce((acc, numbers) => acc + numbers.length, 0) * 4); // 4 bytes per number
//     let offset = 0;
//     results.forEach(numbers => {
//         numbers.forEach((num) => {
//             buffer.writeUInt32BE(num, offset);
//             offset += 4;
//         });
//     });

//       const fs = require('fs');
//       fs.writeFileSync('smart_contracts.bin', buffer);
// };

// testRandomness();

const Web3 = require('web3');
const fs = require('fs');
const Contract = require('../artifacts/contracts/Lottery.sol/Lottery.json');

// Initialize Web3 and contract
const web3 = new Web3('http://62.3.32.217:9500');
const contractAddress = '0xc0ED63E3A70BfCB003452B1Cc083db822e1f23e1';
const contract = new web3.eth.Contract(Contract.abi, contractAddress);

// Function to test randomness and write data to file in a bitstream format
const testRandomness = async () => {
  const lotteryId = 'test_lottery';
  const initialTab = Array.from({ length: 1000 }, (_, i) => i + 1);
  const fileStream = fs.createWriteStream('smart_contracts.bin', { flags: 'w' });
  const BATCH_SIZE = 1000; // Save every 1000 numbers to reduce memory usage

  for (let i = 0; i < 100000; i++) {
    const randomNumbers = await contract.methods.randomNumbersGenerate(lotteryId, initialTab).call();
    console.log(`Generating random numbers, iteration: ${i + 1}`);

    // Convert each random number to a 4-byte binary string and save to the file incrementally
    randomNumbers.forEach((num) => {
      const binaryString = num.toString(2).padStart(32, '0'); // Convert number to 32-bit binary string
      fileStream.write(binaryString, 'binary'); // Write as a continuous bitstream
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
