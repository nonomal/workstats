import React, { useState } from 'react';

interface InputBoxType {
  bgColor?: string;
  disabled?: boolean;
  inputType?: string;
  label?: string;
  max?: number;
  min?: number;
  name?: string;
  placeholder?: string;
  // required?: boolean;
  value?: string | number | undefined;
}

const InputBox = ({
  bgColor = 'bg-white',
  disabled = false,
  inputType = 'text',
  label = 'a label here',
  max,
  min,
  name,
  placeholder = 'a placeholder here',
  // required = false,
  value = undefined
}: InputBoxType) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='px-1 md:px-3 py-1 md:py-1 mx-2 md:mx-1 my-0 md:my-1'>
      <label htmlFor={name} className='text-slate-800 md:pl-3'>
        {label}
      </label>
      <input
        type={inputType}
        id={name}
        max={max}
        min={min}
        name={name}
        className={`${bgColor} text-gray-700 border border-gray-300 rounded-lg block w-36 md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 px-2 py-1 md:pl-3 mt-1`}
        placeholder={placeholder} // Placeholder is NOT recommended, see https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/number#placeholder
        value={inputValue}
        disabled={disabled}
        onChange={(e) => handleInputOnChange(e)}
      />
    </div>
  );
};

export default InputBox;
