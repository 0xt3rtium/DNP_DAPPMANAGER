import "mocha";
import { expect } from "chai";
import shell from "../../../src/utils/shell";
import { shellSafe } from "../../testUtils";

describe.only("eth2migrations", function () {
  const prysmComposePath = `${__dirname}/DAppNodePackage-prysm-prater/docker-compose.yml`;
  const web3signerComposePath = `${__dirname}/DAppNodePackage-prysm-prater/docker-compose.yml`;
  const tekuComposePath = `${__dirname}/DAppNodePackage-prysm-prater/docker-compose.yml`;

  before(async () => {
    // Create necessary network
    await shellSafe("docker network create dncore_network");
  });

  /**
   * Set-up web3signer
   */
  before(async () => {
    // Setup validator container: run DAppNodePackage-prysm-prater
    await shell(`docker-compose -f ${web3signerComposePath} up -d`);
  });

  /**
   * Set-up eth2client
   */
  before(async () => {
    // Setup validator container: run DAppNodePackage-prysm-prater
    await shell(`docker-compose -f ${tekuComposePath} up -d`);
  });

  /**
   * Set-up validator
   */
  before(async () => {
    const validatorContainerName =
      "DAppNodePackage-validator.prysm-prater.dnp.dappnode.eth";
    // Setup validator container: run DAppNodePackage-prysm-prater
    await shell(`docker-compose -f ${prysmComposePath} up -d`);

    // Import keystores: https://docs.prylabs.network/docs/install/install-with-docker/#step-3-import-keystores-into-prysm
    await shell(
      `docker exec ${validatorContainerName} validator accounts import --accept-terms-of-use --prater \
--wallet-password-file=/files/password.txt --wallet-dir=/root/.eth2validators \
--account-password-file=/files/password.txt --keys-dir=/files/keystore_0.json`
    );
    // Import slashing protection: https://docs.prylabs.network/docs/wallet/slashing-protect
    await shell(
      `docker exec  ${validatorContainerName} validator slashing-protection import --datadir=/files/slashing_protection.json --accept-terms-of-use --prater`
    );
  });

  it("should migrate validator", async () => {
    // Run migration: https://docs.prylabs.network/docs/install/install-with-docker/#step-4-run-migration
  });

  /**
   * Compose down all packages
   */
  after(async () => {
    await shell(`docker-compose -f ${prysmComposePath} down -v`);
    await shell(`docker-compose -f ${web3signerComposePath} down -v`);
    await shell(`docker-compose -f ${tekuComposePath} down -v`);
  });

  /**
   * Remove dncore_network
   */
  after(async () => {
    // Remove validator container
    await shell(`docker network rm dncore_network`);
  });
});
