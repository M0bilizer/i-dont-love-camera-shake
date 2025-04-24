import React, { MouseEvent } from "react";

type CloseButtonProps = {
  handleClose: (e: MouseEvent<HTMLButtonElement>) => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ handleClose }) => {
  return (
    <button
      type="button"
      onClick={handleClose}
      className="px-2.5 py-1 sm:px-5 sm:py-2.5 bg-red-600 text-white text-center rounded hover:bg-green-700 transition-colors"
    >
      X
    </button>
  );
};

export default CloseButton;
