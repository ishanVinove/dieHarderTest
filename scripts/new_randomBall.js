// const fs = require('fs');
// const crypto = require('crypto');

// const TOTAL_BALLS = 7; // Total balls to generate
// const OUTPUT_FILE = 'random_balls.bin'; // Output file for the binary data
// const NUMBER_OF_GENERATIONS = 100_000_000; // Number of random balls to generate

// async function generateRandomBalls() {
//   const randomBalls = [];

//   for (let i = 0; i < NUMBER_OF_GENERATIONS; i++) {
//     const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes
//     const randomIndex = randomBytes.readUInt32BE(0) % TOTAL_BALLS; // Get a random index for balls
//     randomBalls.push(randomIndex + 1); // Store the ball number (1 to 7)
//     console.log("At",i)
//   }

//   // Convert the random balls to a continuous bitstream
//   const bitstream = randomBalls.map(ball => {
//     const bits = (ball).toString(2).padStart(3, '0'); // Convert to binary and pad to 3 bits
//     return bits;
//   }).join(''); // Join all bits into a single string

//   // Write the bitstream to a binary file
//   const buffer = Buffer.from(bitstream, 'binary');
//   fs.writeFileSync(OUTPUT_FILE, buffer);
//   console.log(`Generated ${NUMBER_OF_GENERATIONS} random balls and saved to ${OUTPUT_FILE}`);
// }

// // Call the function to generate the random balls
// generateRandomBalls().catch(console.error);



// const fs = require('fs');
// const crypto = require('crypto');

// const TOTAL_BALLS = 7; // Total balls to generate (1 to 7)
// const OUTPUT_FILE = 'random_balls.bin'; // Output file for the binary data
// const NUMBER_OF_GENERATIONS = 100_000_000; // Total number of random balls to generate
// const BATCH_SIZE = 100_000; // Number of balls to process in each batch

// // Function to generate a secure random number between 1 and TOTAL_BALLS
// function generateRandomBall() {
//   const randomBytes = crypto.randomBytes(4);
//   const randomIndex = randomBytes.readUInt32BE(0) % TOTAL_BALLS;
//   return randomIndex + 1; // Store ball numbers as 1 to 7
// }

// // Function to generate and write random balls incrementally to the file
// async function generateRandomBalls() {
//   const fileStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

//   for (let batchStart = 0; batchStart < NUMBER_OF_GENERATIONS; batchStart += BATCH_SIZE) {
//     const currentBatchSize = Math.min(BATCH_SIZE, NUMBER_OF_GENERATIONS - batchStart);
//     const bitstreamArray = [];

//     for (let i = 0; i < currentBatchSize; i++) {
//       const randomBall = generateRandomBall();
//       const bits = randomBall.toString(2).padStart(3, '0'); // Convert to binary (3 bits)
//       bitstreamArray.push(bits);
//     }

//     const bitstream = bitstreamArray.join('');
//     const buffer = Buffer.from(bitstream, 'binary');
//     fileStream.write(buffer);

//     console.log(`Processed ${batchStart + currentBatchSize} of ${NUMBER_OF_GENERATIONS} random balls...`);
//   }

//   // Close the file stream after writing all data
//   fileStream.end(() => {
//     console.log(`Generated ${NUMBER_OF_GENERATIONS} random balls and saved to ${OUTPUT_FILE}`);
//   });
// }

// // Call the function to generate the random balls
// generateRandomBalls().catch(console.error);





const fs = require('fs');
const crypto = require('crypto');

const TOTAL_BALLS = 7; // Total balls to generate (1 to 7)
const OUTPUT_FILE = 'random_balls.bin'; // Output file for the binary data
const NUMBER_OF_GENERATIONS = 100_000_000; // Total number of random balls to generate
const BATCH_SIZE = 100_000; // Number of balls to process in each batch
const BITS_PER_BALL = 3; // We need 3 bits to store numbers 1 through 7
const BALLS_PER_UINT32 = Math.floor(32 / BITS_PER_BALL); // Number of balls per 32-bit integer

// Generate a secure random mask using 4 random bytes
const xorMask = crypto.randomBytes(4).readUInt32BE(0);

// Function to generate a secure random number between 1 and TOTAL_BALLS, applying XOR mask for added entropy
function generateMaskedRandomBall() {
  const randomBytes = crypto.randomBytes(4);
  const randomIndex = randomBytes.readUInt32BE(0) % TOTAL_BALLS;
  const maskedBall = ((randomIndex + 1) ^ xorMask) >>> 0; // XOR with mask
  return maskedBall;
}

// Function to generate and write packed masked random balls incrementally to the file
async function generateRandomBalls() {
  const fileStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

  for (let batchStart = 0; batchStart < NUMBER_OF_GENERATIONS; batchStart += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, NUMBER_OF_GENERATIONS - batchStart);
    const packedBuffer = Buffer.alloc(Math.ceil((currentBatchSize * BITS_PER_BALL) / 8)); // Adjust buffer size

    let bitOffset = 0;

    for (let i = 0; i < currentBatchSize; i++) {
      const maskedRandomBall = generateMaskedRandomBall();
      
      // Shift the masked ball value into its position in the 32-bit packed integer
      const byteIndex = Math.floor(bitOffset / 8);
      const bitIndex = bitOffset % 8;

      // Apply the ball value into the buffer using bitwise operations
      packedBuffer[byteIndex] |= (maskedRandomBall << (5 - bitIndex)); // Align to 3 bits
      if (bitIndex > 5) packedBuffer[byteIndex + 1] |= (maskedRandomBall >> (bitIndex - 5));

      bitOffset += BITS_PER_BALL;
    }

    fileStream.write(packedBuffer);
    console.log(`Processed ${batchStart + currentBatchSize} of ${NUMBER_OF_GENERATIONS} packed random balls...`);
  }

  // Close the file stream after writing all data
  fileStream.end(() => {
    console.log(`Generated ${NUMBER_OF_GENERATIONS} packed random balls and saved to ${OUTPUT_FILE}`);
  });
}

// Call the function to generate the packed random balls
generateRandomBalls().catch(console.error);
