import React from 'react';

interface CheckButtonProps {
  id: string;
  label: string;
  checked?: boolean;
}

const CheckButton = ({ id, label, checked }: CheckButtonProps) => {
  return (
    <div className='check-button flex hover:bg-amber-100 mt-1 py-0.5 px-2 rounded-lg place-items-center'>
      <input
        type='checkbox'
        id={id}
        name={label}
        checked={checked}
        className=''
      />
      <label htmlFor={id} className='flex-1 text-slate-800 text-base px-2'>
        {label}
      </label>
    </div>
  );
};

export default CheckButton;
