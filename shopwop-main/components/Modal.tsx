import React from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <dialog
      className={`modal ${
        isOpen ? "modal-open" : ""
      } transition-opacity duration-300 ease-in-out`}
      open={isOpen}
      onClose={onClose}
    >
      <div
        className={`modal-box bg-background border border-primary text-text shadow-lg ${
          isOpen ? "fade-in" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
