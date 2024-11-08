async function main() {
  try{
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const G2F = await ethers.getContractFactory("G2F");
    const g2f = await G2F.deploy();
    // await G2F.waitForDeployment();

    
    console.log("G2F contract deployed to:", await g2f.getAddress());
    }catch(error){
      console.log(error);
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    // npx hardhat deploy_1.js --network besu