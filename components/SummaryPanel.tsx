import React from 'react';

interface SummaryPanelProps {
    steps: string[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ steps }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-2xl">
            <h3 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-3">Resumen de la Operación</h3>
            <div className="max-h-60 overflow-y-auto pr-2 text-sm">
                {steps.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 font-mono">
                        {steps.map((step, index) => (
                            <li key={index} className="text-gray-300">{step}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">Aquí aparecerá el resumen de la operación.</p>
                )}
            </div>
        </div>
    );
};

export default SummaryPanel;
