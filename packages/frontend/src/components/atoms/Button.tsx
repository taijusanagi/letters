import React from "react";

export interface ButtonProps {
  type: "primary" | "secondary";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ type, children, disabled, onClick }) => {
  return type === "primary" ? (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-75 focus:outline-none w-full text-secondary rounded-md shadow text-white bg-green-400 text-sm py-2 px-4`}
    >
      {children}
    </button>
  ) : type === "secondary" ? (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-75 focus:outline-none w-full text-secondary rounded-md shadow bg-white border text-sm py-2 px-4`}
    >
      {children}
    </button>
  ) : (
    <></>
  );
};
