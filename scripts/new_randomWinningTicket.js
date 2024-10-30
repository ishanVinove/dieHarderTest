// const fs = require('fs');
// const crypto = require('crypto');

// // Function to generate a secure random number within a specified range
// function secureRandomIntFromInterval(min, max) {
//   const range = max - min + 1;
//   const randomBytes = crypto.randomBytes(4); // 4 bytes = 32 bits
//   const randomInt = randomBytes.readUInt32BE(0); // Read as unsigned 32-bit integer

//   return min + (randomInt % range);
// }

// // Function to write random numbers directly to a file in chunks
// function writeRandomNumbersToFile(filename, numValues, min, max) {
//   const fileStream = fs.createWriteStream(filename, { flags: 'w' });

//   // Set a chunk size to write a batch of random numbers at once
//   const chunkSize = 100000;
//   const buffer = Buffer.alloc(chunkSize * 4); // 4 bytes per number

//   for (let i = 0; i < numValues; i += chunkSize) {
//     const remaining = Math.min(chunkSize, numValues - i);

//     for (let j = 0; j < remaining; j++) {
//       const randomNumber = secureRandomIntFromInterval(min, max);
//       buffer.writeUInt32BE(randomNumber, j * 4); // Write the number to the buffer
//     }

//     fileStream.write(buffer.slice(0, remaining * 4)); // Write only the filled part of the buffer

//     // Log progress every million iterations for large files
//     if (i % 1000000 === 0) {
//       console.log(`Written ${i} random numbers to file...`);
//     }
//   }

//   fileStream.end(() => {
//     console.log(`Finished writing ${numValues} random numbers to ${filename}`);
//   });
// }

// // Number of random values to generate
// const numValues = 100000000; // Adjust this for desired file size
// const min = 1;
// const max = 150000;

// writeRandomNumbersToFile('large_random_bitstream.bin', numValues, min, max);
const fs = require('fs');
const crypto = require('crypto');

// Function to generate a secure random number within a specified range
function secureRandomIntFromInterval(min, max) {
  const range = max - min + 1;
  const randomBytes = crypto.randomBytes(4); // 4 bytes = 32 bits
  const randomInt = randomBytes.readUInt32BE(0); // Read as unsigned 32-bit integer

  return min + (randomInt % range);
}

// Function to write random numbers directly to a file in chunks
function writeRandomNumbersToFile(filename, numValues, min, max) {
  const fileStream = fs.createWriteStream(filename, { flags: 'w' });

  const chunkSize = 100000; // Adjust chunk size to process in batches
  const buffer = Buffer.alloc(chunkSize * 4); // 4 bytes per number

  let totalWritten = 0;

  for (let i = 0; i < numValues; i += chunkSize) {
    const remaining = Math.min(chunkSize, numValues - i);

    for (let j = 0; j < remaining; j++) {
      const randomNumber = secureRandomIntFromInterval(min, max);
      buffer.writeUInt32BE(randomNumber, j * 4); // Write the number to the buffer
    }

    // Write only the portion of the buffer that is filled
    fileStream.write(buffer.slice(0, remaining * 4)); 

    totalWritten += remaining;

    // Log progress every million iterations
    if (totalWritten % 1000000 === 0) {
      console.log(`Written ${totalWritten} random numbers to file...`);
    }
  }

  // Ensure the file is closed after writing
  fileStream.end(() => {
    console.log(`Finished writing ${numValues} random numbers to ${filename}`);
  });
}

// Number of random values to generate
const numValues = 100000000; // Adjust this for desired file size
const min = 1;
const max = 150000;

writeRandomNumbersToFile('large_random_bitstream.bin', numValues, min, max);
