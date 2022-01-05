import Dockerode from "dockerode";
import { extendError } from "../../../utils/extendError";
import { checkImportRequirements } from "./checkImportRequirements";
import { importValidatorKeystores } from "./importValidator";
import { verifyImport } from "./verifyImport";

/** Import validator public keys into eth2-client web3signer */
export async function importValidator({
  signerDnpName,
  volume
}: {
  signerDnpName: string;
  volume: Dockerode.Volume;
}): Promise<void> {
  try {
    // Check import requirements
    await checkImportRequirements({ signerDnpName });

    // Import validator
    await importValidatorKeystores({ signerDnpName, volume });

    // Verify import
    await verifyImport();

    // Restart web3signer ??
  } catch (e) {
    throw extendError(e, "Eth2 migration: import failed");
  }
}
