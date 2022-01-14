import { PackageContainer } from "../../types";
import { packageGet } from "../../calls";
import { docker } from "../docker/api/docker";
import Dockerode from "dockerode";
import { Eth2Network, eth2migrationParams, Eth2Client } from "./params";

/**
 * Returns the validator container specs
 * @param dnpName
 * @param containerName
 */
export async function getValidatorContainerSpecs(
  dnpName: string,
  containerName: string
): Promise<{ container: PackageContainer; volume: Dockerode.Volume }> {
  const container = await getEth2ClientValidatorContainer(
    dnpName,
    containerName
  );
  const volume = await getEth2ClientValidatorVolumes(container);
  return {
    container,
    volume
  };
}

/**
 * Returns the prysm validator container
 * @param dnpName
 * @param containerName
 */
export async function getEth2ClientValidatorContainer(
  dnpName: string,
  containerName: string
): Promise<PackageContainer> {
  const prysmPackage = await packageGet({
    dnpName
  });

  const eth2ClientValidatorContainer = prysmPackage.containers.find(
    container => container.containerName === containerName
  );
  if (!eth2ClientValidatorContainer)
    throw Error(
      `Eth2 client validator container not found in package ${dnpName}`
    );

  return eth2ClientValidatorContainer;
}

/**
 * Get dnpname, container and network of eth2 client validator
 * @param client
 * @param testnet
 * @returns {dnpName, containerName, network}
 *  Example:
 * [ I ]
 *    - network: "mainnet"
 *    - dnpName: "prysm.dnp.dappnode.eth"
 *    - containerName: "DAppNodePackage-validator.prysm.dnp.dappnode.eth"
 * [ II ]
 *    - network: "prater"
 *    - dnpName: "prater.dnp.dappnode.eth"
 *    - containerName: "DAppNodePackage-validator.prysm.dnp.dappnode.eth"
 */
export function getMigrationParams(
  client: Eth2Client,
  testnet: boolean
): {
  network: Eth2Network;
  dnpName: string;
  validatorContainerName: string;
  signerDnpName: string;
} {
  /*   mainnet: {
    signerDnpName: "web3signer.dnp.dappnode.eth",
    clientDnpName: "prysm.dnp.dappnode.eth",
    validatorContainerName: "DAppNodePackage-validator.prysm.dnp.dappnode.eth"
  },
  testnet: {
    signerDnpName: "web3signer-prater.dnp.dappnode.eth",
    clientDnpName: "prater.dnp.dappnode.eth",
    validatorContainerName:
      "DAppNodePackage-validator.prysm-prater.dnp.dappnode.eth"
  } */
  return {
    network: testnet ? "prater" : "mainnet",
    dnpName: testnet
      ? client + "-prater" + eth2migrationParams.dappnodeDomain
      : client + eth2migrationParams.dappnodeDomain,
    validatorContainerName: testnet
      ? eth2migrationParams.dappnodePackagePrefix +
        "-validator." +
        client +
        "-prater" +
        eth2migrationParams.dappnodeDomain
      : eth2migrationParams.dappnodePackagePrefix +
        "-validator." +
        client +
        eth2migrationParams.dappnodeDomain,
    signerDnpName: testnet
      ? "web3signer" + "-prater" + eth2migrationParams.dappnodeDomain
      : "web3signer" + eth2migrationParams.dappnodeDomain
  };
}

/**
 * Returns the volume of the Eth2 client validator container
 * @param container
 */
export async function getEth2ClientValidatorVolumes(
  container: PackageContainer
): Promise<Dockerode.Volume> {
  const eth2ClientValidatorVolume = container.volumes.find(volume => {
    volume.container;
  });

  if (!eth2ClientValidatorVolume)
    throw Error(`Eth2 client validator container has no volume`);

  const volume = docker.getVolume(eth2ClientValidatorVolume.host);
  if (!volume) throw Error(`Eth2 client validator volume not found`);

  return volume;
}
