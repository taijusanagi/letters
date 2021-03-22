import React from "react";
import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";

export const Letter: React.FC = () => {
  const [sendTo, setSendTo] = React.useState("");
  return (
    <section>
      <form className="mb-4">
        <FormInput type="text" placeholder="send to address" value={sendTo} setState={setSendTo} />
        <FormInput type="text" placeholder="letter" value={sendTo} setState={setSendTo} />
      </form>
      <div className="w-32 mx-auto">
        <Button>Send</Button>
      </div>
    </section>
  );
};
