import React from "react";
import { RequestedDnp } from "types";
import Ok from "components/Ok";
import { prettyDnpName } from "utils/format";
import "./signedStatus.scss";

export function SignedStatus({
  signedSafe
}: {
  signedSafe: RequestedDnp["signedSafe"];
}) {
  return (
    <div className="signed-status-grid">
      {Object.entries(signedSafe).map(([dnpName, { safe, message }]) => (
        <React.Fragment key={dnpName}>
          <span>{prettyDnpName(dnpName)}</span>
          <span>
            <Ok ok={safe} msg={""} />
          </span>
          <span>{message}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
