const fs = require('fs');
const crypto = require('crypto');

const TOTAL_BALLS = 7; // Total balls to generate
const OUTPUT_FILE = 'random_balls.bin'; // Output file for the binary data
const NUMBER_OF_GENERATIONS = 100_000_000; // Number of random balls to generate

async function generateRandomBalls() {
  const randomBalls = [];

  for (let i = 0; i < NUMBER_OF_GENERATIONS; i++) {
    const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes
    const randomIndex = randomBytes.readUInt32BE(0) % TOTAL_BALLS; // Get a random index for balls
    randomBalls.push(randomIndex + 1); // Store the ball number (1 to 7)
    console.log("At",i)
  }

  // Convert the random balls to a continuous bitstream
  const bitstream = randomBalls.map(ball => {
    const bits = (ball).toString(2).padStart(3, '0'); // Convert to binary and pad to 3 bits
    return bits;
  }).join(''); // Join all bits into a single string

  // Write the bitstream to a binary file
  const buffer = Buffer.from(bitstream, 'binary');
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log(`Generated ${NUMBER_OF_GENERATIONS} random balls and saved to ${OUTPUT_FILE}`);
}

// Call the function to generate the random balls
generateRandomBalls().catch(console.error);
