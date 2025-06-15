"use client";
import { useDictionary } from "@/app/context/DictionaryContext";

const TransitionSection: React.FC = () => {
  const { dict } = useDictionary();

  return (
    <section className="relative w-full py-12">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-4 left-1/4 w-16 h-16 bg-glacier-700 rounded-full opacity-30"></div>
      <div className="absolute bottom-4 right-1/4 w-12 h-12 bg-glacier-600 rounded-full opacity-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="space-y-6">
          {/* Divider minimalista */}
          <div className="flex items-center justify-center space-x-4">
            <div className="w-8 h-px bg-glacier-300 opacity-40"></div>
            <div className="w-2 h-2 bg-glacier-400 rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-glacier-300 rounded-full"></div>
            <div className="w-2 h-2 bg-glacier-400 rounded-full opacity-60"></div>
            <div className="w-8 h-px bg-glacier-300 opacity-40"></div>
          </div>

          {/* Mensaje discreto */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold text-glacier-100">
              {dict.ACCOMMODATION?.READY_TO_EXPLORE || "¿Listo para tu próxima aventura?"}
            </h3>
            <p className="text-sm md:text-base text-glacier-300 max-w-2xl mx-auto opacity-80">
              {dict.ACCOMMODATION?.TRANSITION_MESSAGE || "Miles de alojamientos únicos te esperan."}
            </p>
          </div>

          {/* Elementos decorativos pequeños */}
          <div className="flex justify-center items-center space-x-6 pt-2">
            <div className="w-12 h-px bg-glacier-400 opacity-50"></div>
            <div className="w-1.5 h-1.5 bg-glacier-300 rounded-full"></div>
            <div className="w-8 h-px bg-glacier-400 opacity-50"></div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default TransitionSection;