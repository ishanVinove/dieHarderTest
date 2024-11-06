const fs = require('fs');
const crypto = require('crypto');

// Function to generate a secure random number within a specified range with a dynamic XOR mask
function secureRandomIntFromInterval(min, max) {
  const range = max - min + 1;
  const randomBytes = crypto.randomBytes(4);
  let randomInt = randomBytes.readUInt32BE(0);

  // Generate a new XOR mask for each number
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
