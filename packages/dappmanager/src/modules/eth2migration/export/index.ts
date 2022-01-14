import { Eth2Network } from "../params";
import { exportValidatorKeys } from "./exportKeys";
import { exportSlashingProtectionData } from "./exportSlashing";
import { checkExportRequirements } from "./checkExportRequirements";
import { verifyExport } from "./verifyExport";
import Dockerode from "dockerode";
import { extendError } from "../../../utils/extendError";

/**
 * Export eth2 validator from Prysm non-web3signer version to docker volume:
 * - backup.zip: contains keystore-x.json
 * - walletpassword.txt
 * - slashing_protection.json
 */
export async function exportValidator({
  network,
  validatorContainerName,
  volume,
  signerDnpName
}: {
  network: Eth2Network;
  validatorContainerName: string;
  volume: Dockerode.Volume;
  signerDnpName: string;
}): Promise<void> {
  try {
    // Check export requirements
    await checkExportRequirements({
      validatorContainerName,
      volume,
      signerDnpName
    });

    // Export keys
    await exportValidatorKeys({ network, validatorContainerName });
    // Export slashing protection
    await exportSlashingProtectionData({ network, validatorContainerName });

    // Verify export
    await verifyExport(volume);
  } catch (e) {
    throw extendError(e, "Eth2 migration: export failed");
  }
}
