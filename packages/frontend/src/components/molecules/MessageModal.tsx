import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Button";

export interface MessageModalProps {
  messageText: string;
  buttonText?: string;
  onClickConfirm?: () => void;
  onClickDismiss?: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  messageText,
  buttonText,
  onClickConfirm,
  onClickDismiss,
}) => {
  return (
    <div className="fixed z-1 inset-0">
      <div className="flex p-4 items-center justify-center min-h-screen text-center">
        <div onClick={onClickDismiss} className="absolute inset-0 overflow-hidden bg-black opacity-10"></div>
        <div className="bg-white p-6 px-4 transform max-w-lg w-full rounded-md">
          {onClickDismiss && (
            <button onClick={onClickDismiss} className="focus:outline-none absolute right-4 top-2 text-tertiary">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <p className="my-8 text-sm text-secondary">{messageText}</p>
          {onClickConfirm && (
            <div className="flex justify-center">
              <div className="w-6/12">
                {typeof onClickConfirm == "string" ? (
                  <Link to={onClickConfirm}>
                    <Button>{buttonText}</Button>
                  </Link>
                ) : (
                  <Button onClick={onClickConfirm}>{buttonText}</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
