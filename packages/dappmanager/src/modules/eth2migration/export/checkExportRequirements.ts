import shell from "../../../utils/shell";
import { eth2migrationParams } from "../params";
import { extendError } from "../../../utils/extendError";
import Dockerode from "dockerode";
import { packageGet, packageInstall } from "../../../calls";
import { logs } from "../../../logs";

/**
 * Check export requirements: paths and walletpassword.txt
 * @param containerName
 */
export async function checkExportRequirements({
  containerName,
  volume,
  signerDnpName
}: {
  containerName: string;
  volume: Dockerode.Volume;
  signerDnpName: string;
}): Promise<void> {
  try {
    // Volume exists in host
    if (!volume.name) throw Error(`Volume ${volume.name} not found`);

    // Validator container has walletdir and walletpassword file
    await shell(
      `docker exec ${containerName} ls ${eth2migrationParams.keys.walletPasswordFile}`
    ).catch(e => {
      throw extendError(e, "walletdir or/and walletpassword file not found");
    });

    // Check web3signer package is installed, if not install it WITHOUT starting it
    await packageGet({
      dnpName: signerDnpName
    }).catch(async e => {
      // Consider typing error for dnp not found
      if (e.message.includes("No DNP was found for name")) {
        logs.info(
          "Eth2 migration: web3signer package not installed, installing it"
        );
        await packageInstall({
          name: signerDnpName
        }).catch(e => {
          throw extendError(e, "web3signer installation failled");
        });
      } else throw e;
    });
  } catch (e) {
    throw extendError(e, "Eth2 migration: backup requirements failed");
  }
}
