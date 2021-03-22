import React from "react";

export interface FormInputProps {
  type: "text" | "number";
  placeholder: string;
  value: string | number;
  setState: (input: any) => void;
}

export const FormInput: React.FC<FormInputProps> = ({ type, value, placeholder, setState }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!setState) return;
    setState(event.target.value);
  };

  return (
    <div>
      <input
        onChange={handleChange}
        value={value}
        type={type}
        placeholder={placeholder}
        className="mt-1 p-2 block w-full focus:ring-gray-200 focus:border-gray-200 text-xs text-secondary border-gray-200 rounded-md"
      />
    </div>
  );
};
