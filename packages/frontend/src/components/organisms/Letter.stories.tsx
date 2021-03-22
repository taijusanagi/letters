import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Letter } from "./Letter";

export default {
  title: "Organisms/Letter",
  component: Letter,
};

export const Control: React.FC = (props) => (
  <MemoryRouter>
    <Letter {...props}>{props.children}</Letter>
  </MemoryRouter>
);
