import React from "react";
import { FiWifiOff } from "react-icons/fi";
import { StandaloneContainer } from "./StandaloneContainer";

export const NoConnection = () => (
  <StandaloneContainer TopIcon={FiWifiOff} title="No connection">
    <div className="text">
      Could not connect to DAppNode. Please make sure your VPN connection is
      still active. Otherwise, stop the connection and reconnect and try
      accessing this page again. If the problems persist, please reach us via{" "}
      <a href="https://riot.im/app/#/room/#DAppNode:matrix.org">Riot</a> or{" "}
      <a href="https://github.com/dappnode/DAppNode/issues/new">
        opening a Github issue
      </a>
      .
    </div>
  </StandaloneContainer>
);
