
import React from 'react';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl border border-cyan-500 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-lg mb-4">{children}</div>
                <button 
                    onClick={onClose}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Modal;
