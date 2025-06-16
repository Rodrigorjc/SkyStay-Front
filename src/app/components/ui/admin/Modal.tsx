import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onSubmit?: () => void;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ onSubmit, children, onClose, className }) => {
  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <form onSubmit={onSubmit} className={`bg-zinc-800 px-8 py-6 rounded-3xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto ${className}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>
        {children}
      </form>
    </div>
  );
};

export default Modal;
