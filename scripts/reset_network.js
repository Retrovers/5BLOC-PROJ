const hre = require("hardhat");

async function main() {
  const config = hre.config?.networks?.hardhat
  console.log('resetting chain')
  await network.provider.request({
    method: "hardhat_reset",
    params: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });