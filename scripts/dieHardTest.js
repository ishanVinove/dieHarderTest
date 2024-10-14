const Web3 = require('web3');
const Contract = require('../artifacts/contracts/Lottery.sol/Lottery.json');

const web3 = new Web3('http://35.154.131.54:8540');
const contractAddress = '0x79306966344032dA160C8Ef9a8fe6A4ec8d62987';
const contract = new web3.eth.Contract(Contract.abi, contractAddress);

const testRandomness = async () => {
    const lotteryId = 'test_lottery';
    const initialTab = Array.from({ length: 1000 }, (_, i) => i + 1);
    const results = [];

    for (let i = 0; i < 100000; i++) {
        const randomNumbers = await contract.methods.randomNumbersGenerate(lotteryId, initialTab).call();
        console.log("Where we at", i);
        results.push(randomNumbers);
    }

    const buffer = Buffer.alloc(results.reduce((acc, numbers) => acc + numbers.length, 0) * 4); // 4 bytes per number
    let offset = 0;
    results.forEach(numbers => {
        numbers.forEach((num) => {
            buffer.writeUInt32BE(num, offset);
            offset += 4;
        });
    });

      const fs = require('fs');
      fs.writeFileSync('smart_contracts.bin', buffer);
};

testRandomness();

