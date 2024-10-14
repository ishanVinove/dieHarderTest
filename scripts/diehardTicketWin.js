const generateRandomNumber = async () => {
    const results = [];
    // Example usage: Generating 100 million random numbers between 1 and 5000
    for (let i = 0; i < 100000000; i++) {
      const randomNumber = randomIntFromInterval(1, 5000);
      console.log(`Random Number ${i + 1}: ${randomNumber}`);
      results.push(randomNumber);
    }
  
    // Create a buffer to hold the results
    const buffer = Buffer.alloc(results.length * 4); // 4 bytes per number
    results.forEach((num, index) => {
      buffer.writeUInt32BE(num, index * 4);
    });
  
    const fs = require('fs');
    fs.writeFileSync('winTicket.bin', buffer);
  }
  
  // Example helper function to generate random integers in a given range
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  generateRandomNumber();
  