import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onSubmit, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <form onSubmit={onSubmit} className="bg-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>
        {children}
      </form>
    </div>
  );
};

export default Modal;
