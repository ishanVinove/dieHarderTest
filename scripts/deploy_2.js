async function main() {
    try{
      const [deployer] = await ethers.getSigners();
    
      console.log("Deploying contracts with the account:", deployer.address);
    
      const Lottery = await ethers.getContractFactory("Lottery");
      const lottery = await Lottery.deploy("0xA0C5A5A4CDFb115dC8d49A446B6406b6E6728e9c");
      // await lottery.waitForDeployment();
  
      
      console.log("Lottery contract deployed to:", await lottery.getAddress());
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