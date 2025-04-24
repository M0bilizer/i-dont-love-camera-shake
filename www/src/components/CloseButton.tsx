import React, { MouseEvent } from "react";

type CloseButtonProps = {
  handleClose: (e: MouseEvent<HTMLButtonElement>) => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ handleClose }) => {
  return (
    <button
      type="button"
      onClick={handleClose}
      className="rounded bg-red-600 px-2.5 py-1 text-center text-white transition-colors hover:bg-red-700 sm:px-5 sm:py-2.5"
    >
      X
    </button>
  );
};

export default CloseButton;
