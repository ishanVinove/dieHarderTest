async function main() {
  try{
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const MervCoin = await ethers.getContractFactory("MervCoin");
    const mervCoin = await MervCoin.deploy();
    // await mervCoin.waitForDeployment();

    
    console.log("MervCoin contract deployed to:", await mervCoin.getAddress());
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