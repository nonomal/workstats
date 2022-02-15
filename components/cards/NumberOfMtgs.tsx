const NumberOfMeetings = () => {
    return (
      <div className="bg-white shadow rounded p-4 hover:bg-slate-200">
        <div className="flex space-x-4 items-center">
          <div>
            <div className="bg-indigo-50 rounded-full w-12 h-12 text-indigo-400 flex justify-center items-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 420 430"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M293.333,45V20h-30v25H161.667V20h-30v25H0v360h316.213L425,296.213V45H293.333z M131.667,75v25h30V75h101.667v20h30V75
                  H395v50H30V75H131.667z M30,155h365v120H295v100H30V155z M373.787,305L325,353.787V305H373.787z"
                  stroke="currentColor "
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-gray-400"># of meetings</div>
            <div className=" text-2xl font-bold text-gray-900">123 times</div>
          </div>
        </div>
      </div>
    );
  };
  export default NumberOfMeetings;
  