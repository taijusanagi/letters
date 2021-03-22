import { ethers } from "ethers";
import React from "react";
import { ChainId } from "../../../../contracts/helpers/types";
import { chainIdLabels, chainIdValues, getContractsForChainId, getNetworkNameFromChainId } from "../../modules/web3";

import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";
import { FormRadio } from "../molecules/FormRadio";
import { useLoadingOverlay, useNotificationToast, useMessageModal, useWallet } from "../utils/hooks";

export const Letter: React.FC = () => {
  const [chainId, setChainId] = React.useState<ChainId>(chainIdValues[0] as ChainId);
  const [sendTo, setSendTo] = React.useState("");
  const [letter, setLetter] = React.useState("");

  const { openMessageModal, closeMessageModal } = useMessageModal();
  const { openNotificationToast } = useNotificationToast();
  const { connectWallet } = useWallet();
  const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlay();

  const validateForm = () => {
    let errorMessage = "";
    if (!ethers.utils.isAddress(sendTo)) {
      errorMessage = "send to address is invalid";
    }
    if (!letter || letter.trim() == "") {
      errorMessage = "please input letter to send";
    }
    if (Buffer.from(letter).length > 32) {
      errorMessage = "letter must be within 32 bytes";
    }
    if (errorMessage == "") {
      return true;
    } else {
      openNotificationToast({ type: "error", text: errorMessage });
    }
  };

  const sendLetter = async () => {
    if (!validateForm()) return;
    const { signer } = await connectWallet();
    const signerNetwork = await signer.provider.getNetwork();
    if (chainId != signerNetwork.chainId.toString()) {
      const networkName = getNetworkNameFromChainId(chainId);
      openNotificationToast({ type: "error", text: `Please connect ${networkName} network` });
      return;
    }
    openLoadingOverlay();
    try {
      const { lettersContract, explore } = getContractsForChainId(chainId as ChainId);
      const { hash } = await lettersContract
        .connect(signer)
        .sendLetter(sendTo, ethers.utils.formatBytes32String(letter));
      closeLoadingOverlay();
      openMessageModal({
        messageText: "Your letter has been sent.",
        buttonText: "Check",
        onClickConfirm: () => window.open(`${explore}tx/${hash}`),
        onClickDismiss: closeMessageModal,
      });
    } catch (err) {
      closeLoadingOverlay();
      openNotificationToast({ type: "error", text: err.message });
    }
  };

  return (
    <section>
      <form className="mb-4">
        <div className="mb-4">
          <FormRadio labels={chainIdLabels} values={chainIdValues} setState={setChainId} />
        </div>
        <div className="mb-2">
          <FormInput type="text" placeholder="send to address" value={sendTo} setState={setSendTo} />
        </div>
        <FormInput type="text" placeholder="letter" value={letter} setState={setLetter} />
      </form>
      <div className="w-32 mx-auto">
        <Button onClick={sendLetter}>Send</Button>
      </div>
    </section>
  );
};
