// components/GraphControls.tsx

import React, { useState } from 'react';
import { Operation, GraphNode } from '../types';
import { PlusIcon } from './Icons';

interface GraphControlsProps {
    onOperation: (op: Operation, value?: any) => void;
    nodes: GraphNode[];
    startNodeId: number | undefined;
    setStartNodeId: (id: number | undefined) => void;
    endNodeId: number | undefined;
    setEndNodeId: (id: number | undefined) => void;
}

const ControlButton: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string, disabled?: boolean }> = 
({ onClick, children, className = '', disabled=false }) => (
    <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 ${className} disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}>
        {children}
    </button>
);

const GraphControls: React.FC<GraphControlsProps> = ({ 
    onOperation, 
    nodes,
    startNodeId, 
    setStartNodeId,
    endNodeId,
    setEndNodeId
}) => {
    const [nodeValue, setNodeValue] = useState('');
    const [sourceEdge, setSourceEdge] = useState('');
    const [targetEdge, setTargetEdge] = useState('');
    const [weight, setWeight] = useState('1');

    const handleAddNode = () => {
        const value = parseInt(nodeValue, 10);
        if (!isNaN(value)) {
            onOperation('ADD_NODE', value);
            setNodeValue('');
        }
    };

    const handleAddEdge = () => {
        const source = parseInt(sourceEdge, 10);
        const target = parseInt(targetEdge, 10);
        const w = parseInt(weight, 10);
        if (!isNaN(source) && !isNaN(target) && !isNaN(w) && w > 0) {
            onOperation('ADD_EDGE', { source, target, weight: w });
            setSourceEdge('');
            setTargetEdge('');
            setWeight('1');
        }
    };
    
    const handleClear = () => {
        onOperation('GRAPH_CLEAR');
    };

    const handleRunDijkstra = () => {
        if (startNodeId !== undefined && endNodeId !== undefined) {
            onOperation('RUN_DIJKSTRA', { start: startNodeId, end: endNodeId });
        }
    };

    const handleRunFloydWarshall = () => {
        onOperation('RUN_FLOYD_WARSHALL');
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2">Controles del Grafo</h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="node-value" className="text-sm font-medium text-gray-400">Añadir Nodo</label>
                <div className="flex gap-2">
                    <input id="node-value" type="number" value={nodeValue} onChange={(e) => setNodeValue(e.target.value)} placeholder="Valor" className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                    <ControlButton onClick={handleAddNode} className="bg-green-600 hover:bg-green-500 text-white"><PlusIcon />Añadir</ControlButton>
                </div>
            </div>

            {/* Add Edge Section */}
            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4 mt-2">
                <label className="text-sm font-medium text-gray-400">Añadir Arista (No dirigida)</label>
                <div className="flex items-center gap-2">
                    <input type="number" value={sourceEdge} onChange={(e) => setSourceEdge(e.target.value)} placeholder="Origen" className="w-1/3 bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                    <input type="number" value={targetEdge} onChange={(e) => setTargetEdge(e.target.value)} placeholder="Destino" className="w-1/3 bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Peso" min="1" className="w-1/3 bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                </div>
                <ControlButton onClick={handleAddEdge} className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2">Conectar Nodos</ControlButton>
            </div>
            
            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4 mt-2">
                <h3 className="text-lg font-semibold text-cyan-400">Algoritmos de Camino Más Corto</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <select value={startNodeId ?? ''} onChange={(e) => setStartNodeId(e.target.value ? parseInt(e.target.value) : undefined)} className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                            <option value="">Nodo Inicio</option>
                            {nodes.map(node => <option key={node.id} value={node.id}>Nodo {node.value}</option>)}
                        </select>
                        <select value={endNodeId ?? ''} onChange={(e) => setEndNodeId(e.target.value ? parseInt(e.target.value) : undefined)} className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                            <option value="">Nodo Destino</option>
                            {nodes.map(node => <option key={node.id} value={node.id}>Nodo {node.value}</option>)}
                        </select>
                    </div>
                    <ControlButton 
                        onClick={handleRunDijkstra} 
                        disabled={startNodeId === undefined || endNodeId === undefined || startNodeId === endNodeId} 
                        className="bg-purple-600 hover:bg-purple-500 text-white"
                    >
                        Ejecutar Dijkstra (A → B)
                    </ControlButton>
                </div>
                <ControlButton onClick={handleRunFloydWarshall} className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-2">Ejecutar Floyd-Warshall</ControlButton>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4 mt-2">
                <h3 className="text-lg font-semibold text-cyan-400">Recorridos y Expansión Mínima</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => startNodeId !== undefined && onOperation('RUN_BFS', startNodeId)} disabled={startNodeId === undefined} className="flex-grow bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-600">
                        BFS (desde Inicio)
                    </button>
                    <button onClick={() => startNodeId !== undefined && onOperation('RUN_DFS', startNodeId)} disabled={startNodeId === undefined} className="flex-grow bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-600">
                        DFS (desde Inicio)
                    </button>
                </div>
                <ControlButton onClick={() => onOperation('RUN_KRUSKAL')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-2">
                    Kruskal (MST)
                </ControlButton>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-2">
                <ControlButton onClick={handleClear} className="bg-red-800 hover:bg-red-700 text-white w-full">Limpiar Grafo</ControlButton>
            </div>
        </div>
    );
};

export default GraphControls;