// src/components/CustomTooltip.jsx
import { Tooltip } from "@material-tailwind/react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomTooltip = ({ title, description, learnMoreLink }) => {
  const navigate = useNavigate();

  const tooltipContent = (
    <div className="text-left">
      <h3 className="font-semibold text-xs mb-1">{title}</h3>
      <p className="text-[10px] mb-2">{description}</p>
      <button
        onClick={() => navigate(learnMoreLink)}
        className="text-blue-500 underline text-[10px]"
      >
        Learn More
      </button>
    </div>
  );

  return (
    <Tooltip
      content={tooltipContent}
      placement="top"
      className="!p-2 !bg-gray-200 !text-gray-700 !rounded-md"
    >
      <span className="inline-flex ml-2 text-gray-500 cursor-pointer">
        <FaQuestionCircle className="text-[0.75rem]" /> {/* Smaller icon */}
      </span>
    </Tooltip>
  );
};

export default CustomTooltip;
