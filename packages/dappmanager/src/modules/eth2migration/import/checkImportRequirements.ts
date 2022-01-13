import { packageGet, packageStartStop } from "../../../calls";
import { extendError } from "../../../utils/extendError";

/**
 * Check web3signer import requiremments
 */
export async function checkImportRequirements({
  signerDnpName
}: {
  signerDnpName: string;
}): Promise<void> {
  try {
    // Check web3signer package is installed
    const web3SignerPackage = await packageGet({
      dnpName: signerDnpName
    }).catch(async e => {
      throw extendError(e, "web3signer package not installed");
    });

    // Check all containers from web3signer package are running
    web3SignerPackage.containers.forEach(async container => {
      if (container.state !== "running")
        await packageStartStop({ dnpName: signerDnpName });
    });

    // TODO Validate validator files
  } catch (e) {
    throw extendError(e, "Eth2 migration: checkExportRequirements failled");
  }
}

function validateValidatorFiles() {
  // TODO
}
