import React from 'react';

interface ExplanationPanelProps {
    text: string;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ text }) => {
    return (
        <div className="bg-gray-900/50 mt-4 p-4 rounded-lg border border-gray-700 h-28 flex-shrink-0 flex items-center justify-center">
            <p className="text-center font-mono text-cyan-300 text-lg">{text}</p>
        </div>
    );
};

export default ExplanationPanel;