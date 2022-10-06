import React, { useEffect, useState } from 'react';

interface SelectBoxType {
  bgColor?: string;
  label?: string;
  listValues?: string[];
  name?: string;
  value?: string | number | undefined;
}

const SelectBox = ({
  bgColor = 'bg-white',
  label = 'a label here',
  listValues,
  name,
  value = ''
}: SelectBoxType) => {
  const [selectValue, setSelectValue] = useState(value);
  const [listValue, setListValue] = useState(listValues);
  useEffect(() => {
    setSelectValue(value);
    setListValue(listValues);
  }, [listValues, value]);

  const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  return (
    <div className='px-1 md:px-3 py-1 md:py-1 mx-2 md:mx-1 my-0 md:my-1'>
      <label htmlFor={name} className='text-slate-800 md:pl-3'>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`${bgColor} text-gray-700 border border-gray-300 rounded-lg block h-9 w-36 md:w-auto px-2 py-1 md:pl-3 mt-1`}
        value={selectValue}
        onChange={(e) => handleSelectOnChange(e)}
      >
        <option value=''>--Please Select your country or region--</option>
        {listValues &&
          listValue?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectBox;
