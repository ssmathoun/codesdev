import { createPortal } from 'react-dom';
import type { ModalProps } from '../types/types';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return createPortal (
        /* Overlay to Dim the Background */
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}>

            { /* Modal Container */ }
            <div 
                className="bg-[#1E1E1E] border border-zinc-700 w-full max-w-md rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}>
                
                { /* Modal Header */ }
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h3 className="text-white font-medium">{title}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">< X /></button>
                </div>

                { /* Modal Body */ }
                <div className="p-4 text-zinc-300">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}