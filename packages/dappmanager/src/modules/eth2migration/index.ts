import { exportValidator } from "./export";
import { importValidator } from "./import";
import { packageStartStop, packageRemove, volumeRemove } from "../../calls";
import { getValidatorContainerSpecs, getMigrationParams } from "./utils";
import { Eth2Client } from "./params";
import { extendError } from "../../utils/extendError";
import { eth2MigrationRollback } from "./rollback";

export async function eth2Migrate({
  client,
  testnet
}: {
  client: Eth2Client;
  testnet: boolean;
}): Promise<void> {
  // Get params deppending on the network
  const { network, dnpName, validatorContainerName, signerDnpName } =
    getMigrationParams(client, testnet);

  try {
    // Get container and volume of validator
    const { container, volume } = await getValidatorContainerSpecs(
      dnpName,
      validatorContainerName
    );

    // 1. Backup keystores and slashing protection in docker volume
    await exportValidator({
      network,
      validatorContainerName,
      volume,
      signerDnpName
    });
    // 2. Stop and remove validator container (no its volumes)
    if (container.running) packageStartStop({ dnpName });
    await packageRemove({ dnpName, deleteVolumes: false });
    // 3. Install eth2 client web3signer version
    // TODO: install Prysm-web3signer version with beaconchain volume attached

    try {
      // 3. Import validator: keystores and slashing protection from docker volume to web3signer
      await importValidator({
        validatorContainerName,
        signerDnpName,
        volume: volume.name
      });

      // 4. Delete validator docker volume
      // TODO: determine if slashin_protection is needed for Prysm-web3signer version
      await volumeRemove({ name: volume.name });
    } catch (e) {
      // Rollback: install Prysm again with docker volume
      await eth2MigrationRollback();
      throw extendError(e, "Eth2 migration: import failed");
    }
  } catch (e) {
    throw extendError(e, "Eth2 migration failed");
  }
}
