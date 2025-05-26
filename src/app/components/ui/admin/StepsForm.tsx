import React from "react";

interface StepsFormProps {
  step: number;
  totalSteps: number;
}

const StepsForm: React.FC<StepsFormProps> = ({ step, totalSteps }) => {
  return (
    <div className="flex justify-between items-center m-8 relative">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="relative flex items-center">
          <div className={`flex text-center px-4 py-2 rounded-full transition ${step > index ? "bg-glacier-400 text-white" : "bg-gray-700 text-gray-300"}`}>{index + 1}</div>
        </div>
      ))}
    </div>
  );
};

export default StepsForm;
