import React from "react";

export interface FormInputProps {
  type: "text" | "number";
  placeholder: string;
  value: string | number;
  error?: string;
  readonly?: boolean;
  setState?: (input: any) => void;
}

export const FormInput: React.FC<FormInputProps> = ({ type, value, placeholder, error, readonly, setState }) => {
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
        readOnly={readonly}
        className="mt-1 p-2 block w-full focus:ring-gray-300 focus:border-gray-300 text-xs text-secondary border-gray-300 rounded-md"
      />
      <p className="mt-1 h-1 text-xs text-red-400">{error}</p>
    </div>
  );
};
