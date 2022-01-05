import Dockerode from "dockerode";
import { extendError } from "../../../utils/extendError";

/**
 * Import validator into web3signer by calling API endpoint: /eth/v1/keystores
 * - Docs: https://consensys.github.io/web3signer/web3signer-eth2.html#operation/KEYMANAGER_IMPORT
 * - Files needed :
 *  - validator_keystore_x.json
 *  - walletpassword.txt
 *  - slashing_protection.json
 */
export async function importValidatorKeystores({
  signerDnpName,
  volume
}: {
  signerDnpName: string;
  volume: Dockerode.Volume;
}): Promise<void> {
  try {
  } catch (e) {
    throw extendError(e, "Eth2 migration: importValidatorKeystores failed");
  }
}

/**
 * Returns the validator files needed for the import:
 * - validator_keystore_x.json
 * - walletpassword.txt
 * - slashing_protection.json
 */
function getValidatorFiles({ volume }: { volume: Dockerode.Volume }) {
  try {
  } catch (e) {
    throw e;
  }
}
