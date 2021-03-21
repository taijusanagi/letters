import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 text-xs text-tertiary">
      <Link to="/">@Letters.</Link>
    </footer>
  );
};
