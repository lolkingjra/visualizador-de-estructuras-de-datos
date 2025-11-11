
import React, { useState } from 'react';
import { Operation } from '../types';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, ResetIcon, TrashIcon, PlusIcon, SearchIcon } from './Icons';

interface ControlsProps {
    onOperation: (op: Operation, value?: number | number[]) => void;
    isAnimating: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
    disabled: boolean;
    onTreeTypeChange: (type: 'BST' | 'AVL') => void;
    treeType: 'BST' | 'AVL';
}

const ControlButton: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string, disabled?: boolean }> = 
({ onClick, children, className = '', disabled=false }) => (
    <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 ${className} disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}>
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ onOperation, isAnimating, onPlayPause, onNext, onPrev, onReset, disabled, onTreeTypeChange, treeType }) => {
    const [inputValue, setInputValue] = useState('');

    const handleOp = (op: Operation) => {
        if (op === 'INSERT') {
            if (!inputValue.trim()) return;
            const values = inputValue
                .split(',')
                .map(v => v.trim())
                .filter(v => v !== '')
                .map(v => parseInt(v, 10))
                .filter(v => !isNaN(v));

            if (values.length > 0) {
                onOperation(op, values);
                setInputValue('');
            }
        } else if (op === 'SEARCH' || op === 'DELETE') {
            const value = parseInt(inputValue, 10);
            if (!isNaN(value)) {
                onOperation(op, value);
                setInputValue('');
            }
        } else {
            onOperation(op);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2">Controles</h2>
            
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Tipo de Árbol</label>
                <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => onTreeTypeChange('BST')}
                        className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${treeType === 'BST' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >
                        BST
                    </button>
                    <button
                        onClick={() => onTreeTypeChange('AVL')}
                        className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${treeType === 'AVL' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >
                        AVL
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="node-value" className="text-sm font-medium text-gray-400">Valor del Nodo</label>
                <input
                    id="node-value"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ej: 42, 25, 60"
                    className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <ControlButton onClick={() => handleOp('INSERT')} className="bg-green-600 hover:bg-green-500 text-white"><PlusIcon /> Insertar</ControlButton>
                <ControlButton onClick={() => handleOp('SEARCH')} className="bg-blue-600 hover:bg-blue-500 text-white"><SearchIcon /> Buscar</ControlButton>
                <ControlButton onClick={() => handleOp('DELETE')} className="bg-red-600 hover:bg-red-500 text-white"><TrashIcon /> Eliminar</ControlButton>
                <ControlButton onClick={() => handleOp('CLEAR')} className="bg-red-800 hover:bg-red-700 text-white col-span-2">Limpiar Árbol</ControlButton>
            </div>
            
            <div className="border-t border-gray-700 pt-4 mt-2 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-300">Otras Operaciones</h3>
                <div className="grid grid-cols-2 gap-2">
                    <ControlButton onClick={() => handleOp('IN_ORDER')} className="bg-purple-600 hover:bg-purple-500 text-white">In-Order</ControlButton>
                    <ControlButton onClick={() => handleOp('GET_HEIGHT')} className="bg-indigo-600 hover:bg-indigo-500 text-white">Altura</ControlButton>
                    {/* FIX: Removed stray closing tag </hoea> which was causing a JSX parsing error. */}
                    <ControlButton onClick={() => handleOp('COUNT_LEAVES')} className="bg-teal-600 hover:bg-teal-500 text-white col-span-2">Contar Hojas</ControlButton>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-2 flex flex-col gap-2">
                 <h3 className="text-lg font-semibold text-gray-300">Animación</h3>
                 <div className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
                    <ControlButton onClick={onPrev} disabled={disabled} className="bg-gray-600 hover:bg-gray-500"><PrevIcon /></ControlButton>
                    <ControlButton onClick={onPlayPause} disabled={disabled} className="w-20 bg-cyan-600 hover:bg-cyan-500">{isAnimating ? <PauseIcon/> : <PlayIcon/>}</ControlButton>
                    <ControlButton onClick={onNext} disabled={disabled} className="bg-gray-600 hover:bg-gray-500"><NextIcon /></ControlButton>
                    <ControlButton onClick={onReset} disabled={disabled} className="bg-gray-600 hover:bg-gray-500"><ResetIcon /></ControlButton>
                 </div>
            </div>
        </div>
    );
};

export default Controls;
