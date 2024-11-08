async function main() {
    try{
      const [deployer] = await ethers.getSigners();
    
      console.log("Deploying contracts with the account:", deployer.address);
    
      const Lottery = await ethers.getContractFactory("Lottery");
      const lottery = await Lottery.deploy("0xA9F8FeF0B3DF9159F1443427dAa79210fCEB009C");
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