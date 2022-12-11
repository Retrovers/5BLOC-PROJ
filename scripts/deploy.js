const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const contractsDir = path.join(__dirname, "..", "src", "contracts");

async function main() {

    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const NFTRailRoadShop = await hre.ethers.getContractFactory("NFTRailRoadShop"); // M
  const NFTRailRoadShopDeployed = await NFTRailRoadShop.deploy(); //m

  await NFTRailRoadShopDeployed.deployed();

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  saveFrontendFiles(token);

  const data = {
    address: NFTRailRoadShopDeployed.address,
    abi: JSON.parse(NFTRailRoadShopDeployed.interface.format('json'))
  }

  fs.writeFileSync(path.join(contractsDir, 'NFTRailRoadShop.json'), JSON.stringify(data));
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
