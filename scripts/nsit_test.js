const fs = require('fs');
const crypto = require('crypto');

const generateRandomBits = async () => {
  const totalBits = 100000000; // 100 million bits
  const totalBytes = Math.ceil(totalBits / 8);

  const writeStream = fs.createWriteStream('winTicket2.bin');
  const chunkSize = 1024 * 1024 * 1024; // 1 MB chunks
  let bytesWritten = 0;

  while (bytesWritten < totalBytes) {
    const bytesToWrite = Math.min(chunkSize, totalBytes - bytesWritten);
    const randomData = crypto.randomBytes(bytesToWrite);
    console.log("random Data in bytes", randomData);
    writeStream.write(randomData);
    bytesWritten += bytesToWrite;
  }

  writeStream.end();
  writeStream.on('finish', () => {
    console.log('Random bitstream generation complete.');
  });
};

generateRandomBits();