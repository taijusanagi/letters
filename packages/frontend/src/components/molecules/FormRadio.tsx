import React from "react";

export interface FormRadioProps {
  labels: string[];
  values: string[];
  setState: (input: any) => void;
}

export const FormRadio: React.FC<FormRadioProps> = ({ labels, values, setState }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!setState) return;
    setState(event.target.value);
  };

  return (
    <div onChange={handleChange} className="text-xs text-secondary">
      {labels.map((label, i) => {
        return (
          <label key={i} className="inline-flex items-center">
            <input type="radio" defaultChecked={i == 0 ? true : false} name="radio" value={values[i]} />
            <span className="ml-1 mr-4">{label}</span>
          </label>
        );
      })}
    </div>
  );
};
