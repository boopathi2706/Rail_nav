import React from "react";

const FormInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  rightElement,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon size={19} className="text-slate-400" />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={type === "password" ? "new-password" : undefined}
          className={`
            w-full rounded-xl border border-slate-200
            bg-slate-50 py-3.5
            ${Icon ? "pl-11" : "pl-4"}
            ${rightElement ? "pr-12" : "pr-4"}
            text-sm text-slate-800
            outline-none
            transition-all duration-300
            placeholder:text-slate-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
          `}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;