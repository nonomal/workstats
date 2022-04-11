import Head from 'next/head';
import React from 'react';

// @ts-ignore
const InputBox = ({
  label = 'a label here',
  placeholder = 'a placeholder here',
  width = 36,
}) => {
  return (
    <>
      <div className="px-3 py-1 mx-2 my-1">
        <span className="text-slate-800 pl-3">{label}</span>
        <input
          type="text"
          className={`bg-white text-gray-700 border border-gray-300 rounded-lg block w-${width} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 px-2 py-1 pl-3 mt-1`}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default InputBox;
