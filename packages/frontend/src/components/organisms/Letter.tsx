import { ethers } from "ethers";
import React from "react";
import { ChainId } from "../../../../contracts/helpers/types";
import { chainIdLabels, chainIdValues, getContractsForChainId, getNetworkNameFromChainId } from "../../modules/web3";

import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";
import { FormRadio } from "../molecules/FormRadio";
import { useNotificationToast, useWallet } from "../utils/hooks";

export const Letter: React.FC = () => {
  const [chainId, setChainId] = React.useState<ChainId>(chainIdValues[0] as ChainId);
  const [sendTo, setSendTo] = React.useState("");
  const [letter, setLetter] = React.useState("");

  const { openNotificationToast } = useNotificationToast();
  const { connectWallet } = useWallet();

  const validateForm = () => {
    let errorMessage = "";

    if (!ethers.utils.isAddress(sendTo)) {
      errorMessage = "send to address is invalid";
    }
    if (!letter || letter.trim() == "") {
      errorMessage = "please input letter to send";
    }
    const test = ethers.utils.formatBytes32String(letter);
    console.log(test);
    if (errorMessage == "") {
      return true;
    } else {
      openNotificationToast({ type: "error", text: errorMessage });
    }
  };

  const sendLetter = async () => {
    if (!validateForm()) return;
    const { signer, signerAddress } = await connectWallet();
    const signerNetwork = await signer.provider.getNetwork();
    if (chainId != signerNetwork.chainId.toString()) {
      const networkName = getNetworkNameFromChainId(chainId);
      openNotificationToast({ type: "error", text: `Please connect ${networkName} network` });
      return;
    }
    getContractsForChainId(chainId as ChainId);
  };

  return (
    <section>
      <form className="mb-4">
        <div className="mb-2">
          <FormRadio labels={chainIdLabels} values={chainIdValues} setState={setChainId} />
        </div>
        <FormInput type="text" placeholder="send to address" value={sendTo} setState={setSendTo} />
        <FormInput type="text" placeholder="letter" value={letter} setState={setLetter} />
      </form>
      <div className="w-32 mx-auto">
        <Button onClick={sendLetter}>Send</Button>
      </div>
    </section>
  );
};
