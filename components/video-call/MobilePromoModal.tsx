import { useEffect } from "react";

interface MobilePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function MobilePromoModal({ isOpen, onClose, title = "Connectez-vous sur Zeeta pour plus d'infos" }: MobilePromoModalProps) {
  
  // Fermer avec la touche Echap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-8 text-center flex flex-col items-center">
          
          <div className="w-16 h-16 bg-red-50 text-[#D32F2F] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-red-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
          </div>

          <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
            Disponible sur mobile
          </h3>
          
          <p className="text-sm font-medium text-gray-500 mb-8 px-2">
            {title}
          </p>

          {/* Faux QR Code stylisé remplacé par un VRAI QR Code avec QuickChart API */}
          <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative group cursor-pointer hover:border-[#D32F2F] hover:bg-red-50 transition-all p-2">
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[1px] rounded-xl">
               <span className="text-[#D32F2F] font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">Télécharger l'App</span>
            </div>
            
            {/* L'URL encodée mène simulé vers l'App Store */}
            <img 
              src="https://quickchart.io/qr?text=https%3A%2F%2Fapps.apple.com%2Fapp%2Fzeeta&margin=1&size=180&dark=1a1a1a" 
              alt="QR Code Zeeta"
              className="w-full h-full object-contain rounded-xl mix-blend-multiply"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
