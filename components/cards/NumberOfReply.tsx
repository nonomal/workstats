const NumberOfReplies = () => {
    return (
      <div className="bg-white shadow rounded p-4 hover:bg-slate-200">
        <div className="flex space-x-4 items-center">
          <div>
            <div className="bg-orange-50 rounded-full w-12 h-12 text-orange-400 flex justify-center items-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 16.685S16.775 6.953 8 6.953V2.969L1 9.542l7 6.69v-4.357c4.763-.001 8.516.421 11 4.81z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-gray-400"># of replies</div>
            <div className=" text-2xl font-bold text-gray-900">123 times</div>
          </div>
        </div>
      </div>
    );
  };
  export default NumberOfReplies;
  