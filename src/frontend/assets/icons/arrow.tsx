import React from "react";

const ArrowIcon = ({ width = 18, className = "" }: { width?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} fill="none" viewBox="0 0 48 48" className={className}>
    <path fill="#fff" fillOpacity="0.01" d="M0 0H48V48H0z" />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
      d="M24 6v36M12 18L24 6l12 12"
    />
  </svg>
);

export default ArrowIcon;
