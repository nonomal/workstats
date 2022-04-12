import React from 'react';

const InputBox = ({
  label = 'a label here',
  inputType = 'text',
  placeholder = 'a placeholder here',
  width = 36,
  value = undefined,
}: {
  label?: string;
  inputType?: string;
  placeholder?: string;
  width?: number;
  value?: string | number | undefined;
}) => {
  return (
    <>
      <div className="px-3 py-1 mx-2 my-1">
        <span className="text-slate-800 pl-3">{label}</span>
        <input
          type={inputType}
          className={`bg-white text-gray-700 border border-gray-300 rounded-lg block w-${width} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 px-2 py-1 pl-3 mt-1`}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </>
  );
};

export default InputBox;
