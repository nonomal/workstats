const NumberOfCommit = () => {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex space-x-4 items-center">
        <div>
          <div className="bg-fuchsia-50 rounded-full w-12 h-12 text-fuchsia-400 flex justify-center items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <div className="text-gray-400"># of commit</div>
          <div className=" text-2xl font-bold text-gray-900">123 times</div>
        </div>
      </div>
    </div>
  );
};

export default NumberOfCommit;