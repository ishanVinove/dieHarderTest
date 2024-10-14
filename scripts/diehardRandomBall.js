const fs = require('fs');

async function generateRandomBall(lottery) {
    const availableBalls = lottery.availableBalls;

    if (availableBalls && availableBalls.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableBalls.length);
        const randomGeneratedBall = availableBalls[randomIndex];
        lottery.randomGeneratedBall = randomGeneratedBall;

        // Remove the selected ball from the availableBalls array
        lottery.availableBalls.splice(randomIndex, 1);

        return randomGeneratedBall;
    } else {
        throw new Error("No available balls to generate.");
    }
}

async function generateRandomBallsMultiple() {
    const results = [];
    const lotteryTemplate = {
        availableBalls: [1, 2, 3, 4, 5, 6, 7],
        randomGeneratedBall: null
    };

    for (let i = 0; i < 100_000_000; i++) {
        const lottery = { ...lotteryTemplate, availableBalls: [...lotteryTemplate.availableBalls] };

        try {
            const randomBall = await generateRandomBall(lottery);
            results.push(randomBall);
            // console.log("Counter at",i);
        } catch (error) {
            console.error("Error generating random ball:", error);
        }
    }

    const buffer = Buffer.alloc(results.length * 4); // 4 bytes per number

    results.forEach((num, index) => {
        buffer.writeUInt32BE(num, index * 4);
    });

    fs.writeFileSync('random_balls.bin', buffer);
    console.log("Random balls have been generated and saved to random_balls.bin");
}

generateRandomBallsMultiple();
