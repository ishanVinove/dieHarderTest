async function main() {
    try{
      const [deployer] = await ethers.getSigners();
    
      console.log("Deploying contracts with the account:", deployer.address);
    
      const Lottery = await ethers.getContractFactory("Lottery");
      const lottery = await Lottery.deploy("0xb9A219631Aed55eBC3D998f17C3840B7eC39C0cc");
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