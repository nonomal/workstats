import React, { useEffect, useState } from 'react';

interface InputBoxType {
  bgColor?: string;
  disabled?: boolean;
  inputType?: string;
  label?: string;
  listValues?: string[];
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
  listValues,
  max,
  min,
  name,
  placeholder = 'a placeholder here',
  // required = false,
  value = ''
}: InputBoxType) => {
  const [inputValue, setInputValue] = useState(value);
  const [listValue, setListValue] = useState(listValues);
  useEffect(() => {
    setInputValue(value);
    setListValue(listValues);
  }, [listValues, value]);

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
        list={'list for ' + name} // Must match the id in datalist
        max={max}
        min={min}
        name={name}
        className={`${bgColor} text-gray-700 border border-gray-300 rounded-lg block w-36 md:w-auto px-2 py-1 md:pl-3 mt-1`}
        placeholder={placeholder} // Placeholder is NOT recommended, see https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/number#placeholder
        value={inputValue}
        disabled={disabled}
        onChange={(e) => handleInputOnChange(e)}
      />
      {listValues && (
        // Must not match the input tag id or any other id
        <datalist id={'list for ' + name}>
          {listValue?.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      )}
    </div>
  );
};

export default InputBox;
