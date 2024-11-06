const fs = require('fs');
const crypto = require('crypto');

const TOTAL_BALLS = 7; // Total balls to generate (1 to 7)
const OUTPUT_FILE = 'random_balls.bin'; // Output file for the binary data
const NUMBER_OF_GENERATIONS = 100_000_000; // Total number of random balls to generate
const BATCH_SIZE = 100_000; // Number of balls to process in each batch
const BITS_PER_BALL = 3; // We need 3 bits to store numbers 1 through 7
const BALLS_PER_UINT32 = Math.floor(32 / BITS_PER_BALL); // Number of balls per 32-bit integer

// Function to generate a secure random number between 1 and TOTAL_BALLS, with dynamic XOR mask for each ball
function generateMaskedRandomBall() {
  const randomBytes = crypto.randomBytes(4);
  const randomIndex = randomBytes.readUInt32BE(0) % TOTAL_BALLS;
  const dynamicXorMask = crypto.randomBytes(1).readUInt8(0); // Generate a new mask each time
  const maskedBall = ((randomIndex + 1) ^ dynamicXorMask) >>> 0; // XOR with dynamic mask
  return maskedBall % (1 << BITS_PER_BALL);;
}

// Function to generate and write packed masked random balls incrementally to the file
async function generateRandomBalls() {
  const fileStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

  for (let batchStart = 0; batchStart < NUMBER_OF_GENERATIONS; batchStart += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, NUMBER_OF_GENERATIONS - batchStart);
    const packedBuffer = Buffer.alloc(Math.ceil((currentBatchSize * BITS_PER_BALL) / 8)); 

    let bitOffset = 0;

    for (let i = 0; i < currentBatchSize; i++) {
      const maskedRandomBall = generateMaskedRandomBall();
      
      // Shift the masked ball value into its position in the packed buffer
      const byteIndex = Math.floor(bitOffset / 8);
      const bitIndex = bitOffset % 8;

      // Determine the number of bits that can fit in the current byte
      const availableBits = 8 - bitIndex;
      
      if (availableBits >= BITS_PER_BALL) {
        // If there's enough space in the current byte, simply store the masked ball here
        packedBuffer[byteIndex] |= (maskedRandomBall << (availableBits - BITS_PER_BALL));
      } else {
        // Otherwise, split the bits between the current byte and the next byte
        packedBuffer[byteIndex] |= (maskedRandomBall >> (BITS_PER_BALL - availableBits));
        packedBuffer[byteIndex + 1] |= (maskedRandomBall << (8 - (BITS_PER_BALL - availableBits)));
      }

      bitOffset += BITS_PER_BALL;
    }

    fileStream.write(packedBuffer);
    console.log(`Processed ${batchStart + currentBatchSize} of ${NUMBER_OF_GENERATIONS} packed random balls...`);
  }

  fileStream.end(() => {
    console.log(`Generated ${NUMBER_OF_GENERATIONS} packed random balls and saved to ${OUTPUT_FILE}`);
  });
}

// Call the function to generate the packed random balls
generateRandomBalls().catch(console.error);
