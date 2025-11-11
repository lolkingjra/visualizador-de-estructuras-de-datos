
import React from 'react';
import { Operation } from '../types';
import { CPP_CODE } from '../constants';

interface CodePanelProps {
    operation: Operation;
    activeLine?: number;
}

const CodePanel: React.FC<CodePanelProps> = ({ operation, activeLine }) => {
    const { title, code } = CPP_CODE[operation];
    const lines = code.split('\n');

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex-grow">
            <h3 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-2">{title}</h3>
            <pre className="text-sm overflow-auto text-gray-300">
                <code className="font-mono">
                    {lines.map((line, index) => (
                        <div
                            key={index}
                            className={`transition-colors duration-300 px-2 rounded ${index + 1 === activeLine ? 'bg-cyan-900/50' : ''}`}
                        >
                           <span className="text-gray-500 w-6 inline-block select-none">{index + 1}</span> 
                           {line}
                        </div>
                    ))}
                </code>
            </pre>
        </div>
    );
};

export default CodePanel;
