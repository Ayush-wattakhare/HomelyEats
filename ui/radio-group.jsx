import React from "react";

export const RadioGroup = ({ children, className = "" }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export const RadioGroupItem = ({ label, value, selected, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
        className="form-radio text-blue-600"
      />
      <span>{label}</span>
    </label>
  );
};
