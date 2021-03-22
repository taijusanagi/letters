import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MessageModal, MessageModalProps } from "./MessageModal";

const args: MessageModalProps = {
  messageText: "Your NFT is Registered!",
  buttonText: "Check",
};

export default {
  title: "Molecules/MessageModal",
  component: MessageModal,
  args,
};

export const Control: React.FC<MessageModalProps> = (props) => (
  <MemoryRouter>
    <MessageModal {...props}>{props.children}</MessageModal>
  </MemoryRouter>
);
