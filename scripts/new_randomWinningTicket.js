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
// const fs = require('fs');
// const crypto = require('crypto');

// // Function to generate a secure random number within a specified range
// function secureRandomIntFromInterval(min, max) {
//   const range = max - min + 1;
//   const randomBytes = crypto.randomBytes(4); // 4 bytes = 32 bits
//   const randomInt = randomBytes.readUInt32BE(0); // Read as unsigned 32-bit integer

//   return min + (randomInt % range);
// }

// // Function to write random numbers directly to a file
// function writeRandomNumbersToFile(filename, numValues, min, max) {
//   const fileStream = fs.createWriteStream(filename, { flags: 'w' });

//   let totalWritten = 0;

//   for (let i = 0; i < numValues; i++) {
//     const randomNumber = secureRandomIntFromInterval(min, max);

//     // Write each random number as a 4-byte unsigned integer directly to the file
//     const buffer = Buffer.alloc(4); // 4 bytes per number
//     buffer.writeUInt32BE(randomNumber, 0);
//     fileStream.write(buffer);

//     totalWritten++;

//     // Log progress every million iterations
//     if (totalWritten % 1000000 === 0) {
//       console.log(`Written ${totalWritten} random numbers to file...`);
//     }
//   }

//   // Ensure the file is closed after writing
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
  const randomBytes = crypto.randomBytes(4);
  let randomInt = randomBytes.readUInt32BE(0);

  // Generate an XOR mask and apply it to the random integer
  const xorMask = crypto.randomBytes(4).readUInt32BE(0);
  randomInt = (randomInt ^ xorMask) >>> 0;

  return min + (randomInt % range);
}
// Function to write random numbers in smaller increments
function writeRandomNumbersIncrementally(filename, totalNumValues, min, max, incrementSize = 100_000) {
  let totalWritten = 0;

  // Start with an empty file
  fs.writeFileSync(filename, '');

  while (totalWritten < totalNumValues) {
    const remainingValues = Math.min(incrementSize, totalNumValues - totalWritten);
    const buffer = Buffer.alloc(remainingValues * 4); // Buffer for the current increment batch

    for (let i = 0; i < remainingValues; i++) {
      const randomNumber = secureRandomIntFromInterval(min, max);
      buffer.writeUInt32BE(randomNumber, i * 4);
    }

    // Write the current batch to the file
    fs.appendFileSync(filename, buffer);

    totalWritten += remainingValues;

    // Log progress
    console.log(`Written ${totalWritten} random numbers to ${filename}`);
  }

  console.log(`Finished writing ${totalNumValues} random numbers to ${filename}`);
}

// Number of total random values to generate
const totalNumValues = 100_000_000;
const min = 1;
const max = 150_000;

// Run the function with smaller increment size
writeRandomNumbersIncrementally('large_random_bitstream.bin', totalNumValues, min, max);

