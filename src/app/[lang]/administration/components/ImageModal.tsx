import { IoMdClose } from "react-icons/io";

interface Props {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-3xl shadow-2xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>
        <div className="flex items-center justify-center mt-8">
          <img src={imageUrl} alt="Airplane" className="max-w-full max-h-[70vh] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
