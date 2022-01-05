import { exportValidator } from "./export";
import { importValidator } from "./import";
import { packageStartStop, packageRemove } from "../../calls";
import { getValidatorContainerSpecs, getMigrationParams } from "./utils";
import { eth2migrationParams } from "./params";

export async function eth2Migrate(testnet: boolean): Promise<void> {
  // Get params deppending on the network
  const { network, dnpName, containerName } = getMigrationParams(testnet);

  try {
    // Get container and volume of validator
    const { container, volume } = await getValidatorContainerSpecs(
      dnpName,
      containerName
    );

    // Get container and volume of web3signer
    const signerDnpName =
      network === "mainnet"
        ? eth2migrationParams.mainnet.signerDnpName
        : eth2migrationParams.testnet.signerDnpName;

    // 1. Backup keystores and slashing protection in docker volume
    await exportValidator({ network, containerName, volume });
    // 2. Stop and remove validator container (no its volumes)
    if (container.running) packageStartStop({ dnpName });
    await packageRemove({ dnpName, deleteVolumes: false });
    // 3. Import validator: keystores and slashing protection from docker volume to web3signer
    await importValidator({ signerDnpName, volume });
    // 4. Start web3signer container
    // 5. Delete validator docker volumes
  } catch (e) {
    throw Error(`Eth2 migration failed. ${e.message}`);
  }
}
