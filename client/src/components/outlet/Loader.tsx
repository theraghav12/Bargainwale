import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="absolute -top-[47%] left-0 w-full h-full bg-white z-50 flex justify-center">
      <div className="mt-1 flex items-center space-x-2">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-[#004AAD]"></div>
        <span className="font-inter text-base">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
