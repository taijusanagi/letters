import React from "react";

export const Hero: React.FC = () => {
  return (
    <section>
      <div className="w-full py-12">
        <h2 className="text-center text-secondary text-5xl">Letters.</h2>
        <p className="text-center text-tertiary mt-2">
          just 32 bytes, on{" "}
          <a href="https://etherscan.io/">
            <span className="text-blue-400">blockchain.</span>
          </a>
        </p>
      </div>
    </section>
  );
};
