import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-18 h-18 border-8 border-t-8 border-gray-300 rounded-full animate-spin border-t-glacier-700"></div>
    </div>
  );
};

export default Loader;
