import React from "react";

export interface ContainerProps {
  type?: "wide" | "narrow";
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, type }) => {
  return <div className={"container mx-auto flex-grow py-6 w-11/12 max-w-md"}>{children}</div>;
};
