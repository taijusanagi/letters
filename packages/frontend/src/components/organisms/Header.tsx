import React from "react";
import { Link } from "react-router-dom";

import { shortenAddress } from "../../modules/util";

import { Button } from "../atoms/Button";
import { useWallet } from "../utils/hooks";
import { useLoadingOverlay, useNotificationToast } from "../utils/hooks";

export const Header: React.FC = () => {
  const { connectWallet, userAddress } = useWallet();

  const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlay();
  const { openNotificationToast } = useNotificationToast();

  const signIn = async () => {
    try {
      openLoadingOverlay();
      await connectWallet();
      closeLoadingOverlay();
    } catch (err) {
      closeLoadingOverlay();
      openNotificationToast({ type: "error", text: err.message });
    }
  };

  return (
    <header>
      <div className="relative h-20">
        <Link to="/">
          <div className="px-4 py-8 absolute left-0 font-bold">Letters.</div>
        </Link>
        <div className="px-4 py-6 absolute right-0">
          {!userAddress ? <Button onClick={signIn}>Connect</Button> : <Button>{shortenAddress(userAddress)}</Button>}
        </div>
      </div>
    </header>
  );
};
