import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-75 focus:outline-none w-full text-secondary rounded-md bg-white border text-sm py-2 px-4`}
    >
      {children}
    </button>
  );
};
