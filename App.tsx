// App.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
// PDF Export
import { PDFDownloadLink } from '@react-pdf/renderer';

// Lógica de estructuras
import { BinarySearchTree } from './lib/tree';
import { AVLTree } from './lib/avl';
import { Graph } from './lib/graph';
import { runDijkstra, reconstructPath } from './lib/dijkstra';
import { runFloydWarshall } from './lib/floydWarshall';
import { runBFS } from './lib/bfs';
import { runDFS } from './lib/dfs';
import { runKruskal } from './lib/kruskal';

// Tipos
import { VisualizationStep, TreeNode as BSTNode, Operation, GraphNode } from './types';

// Componentes
import TreeView from './components/TreeView';
import GraphView from './components/GraphView';
import { AdjacencyMatrixView } from './components/AdjacencyMatrixView';
import Controls from './components/Controls';
import GraphControls from './components/GraphControls';
import CodePanel from './components/CodePanel';
import ExplanationPanel from './components/ExplanationPanel';
import SummaryPanel from './components/SummaryPanel';
import Modal from './components/Modal';
import { ReportePDF } from './components/ReportePDF';
import { LandingPage } from './components/LandingPage';

// Constantes
import { CPP_CODE, ANIMATION_SPEED } from './constants';

type DataType = 'tree' | 'graph';

const App: React.FC = () => {
    // --- ESTADOS DE LA APLICACIÓN ---
    const [showApp, setShowApp] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [dataType, setDataType] = useState<DataType>('tree');
    const [steps, setSteps] = useState<VisualizationStep[]>([]);
    const [summarySteps, setSummarySteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const timerRef = useRef<number | null>(null);
    const [activeGraphTab, setActiveGraphTab] = useState<'view' | 'matrix'>('view');
    const [tree, setTree] = useState<BinarySearchTree | AVLTree>(new BinarySearchTree());
    const [treeType, setTreeType] = useState<'BST' | 'AVL'>('BST');
    const [graph, setGraph] = useState(new Graph());
    const [startNodeId, setStartNodeId] = useState<number | undefined>();
    const [endNodeId, setEndNodeId] = useState<number | undefined>();
    const [reportData, setReportData] = useState<any>(null);

    // --- MANEJADORES Y LÓGICA ---
    const handleEnterApp = () => {
        setIsExiting(true); 
        setTimeout(() => {
            setShowApp(true); 
        }, 800); 
    };

    const resetState = useCallback(() => {
        setSteps([]);
        setSummarySteps([]);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        setReportData(null);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const handleDataTypeChange = (newType: DataType) => {
        if (newType === dataType) return;
        setDataType(newType);
        resetState();
        setActiveOperation(null);
        if (newType === 'tree') {
            handleTreeTypeChange('BST', true);
        } else {
            const newGraph = new Graph();
            setGraph(newGraph);
        }
    };

    const handleTreeTypeChange = (newType: 'BST' | 'AVL', force: boolean = false) => {
        if (newType === treeType && !force) return;
        setTreeType(newType);
        const newTree = newType === 'BST' ? new BinarySearchTree() : new AVLTree();
        setTree(newTree);
        setActiveOperation(null);
        resetState();
    };

    const handleOperation = (op: Operation, value?: any) => {
        resetState();
        
        let opForCodePanel: Operation = op;
        if (dataType === 'tree' && treeType === 'AVL') {
            if (op === 'INSERT') opForCodePanel = 'AVL_INSERT';
            if (op === 'DELETE') opForCodePanel = 'AVL_DELETE';
        }
        setActiveOperation(opForCodePanel);

        let newSteps: VisualizationStep[] = [];
        let startAnimation = true;

        if (dataType === 'tree') {
            if (op === 'INSERT' && Array.isArray(value)) {
                for (const num of value) {
                    newSteps.push(...tree.insert(num));
                }
            } else {
                 switch (op) {
                    case 'INSERT':
                        if (typeof value !== 'number') return;
                        newSteps = tree.insert(value);
                        break;
                    case 'SEARCH':
                        if (typeof value !== 'number') return;
                        newSteps = tree.search(value);
                        break;
                    case 'DELETE':
                        if (typeof value !== 'number') return;
                        newSteps = tree.delete(value);
                        break;
                    case 'IN_ORDER':
                        newSteps = tree.inOrderTraversal();
                        setModalContent(<><strong>Recorrido In-Order:</strong> {newSteps.length > 0 ? newSteps[newSteps.length - 1].traversalOrder?.join(', ') : 'Árbol vacío'}</>);
                        break;
                    case 'GET_HEIGHT':
                        const height = tree.getHeight();
                        newSteps = [{ treeState: tree.root, explanation: `La altura del árbol es ${height}.` }];
                        setModalContent(<><strong>Altura del Árbol:</strong> {height}</>);
                        break;
                    case 'COUNT_LEAVES':
                        const leaves = tree.countLeaves();
                        newSteps = [{ treeState: tree.root, explanation: `El número de hojas es ${leaves}.` }];
                        setModalContent(<><strong>Número de Hojas:</strong> {leaves}</>);
                        break;
                    case 'CLEAR':
                        handleTreeTypeChange(treeType, true);
                        return;
                    default: return;
                }
            }
        } else { // Graph operations
             switch(op) {
                case 'ADD_NODE':
                    if (typeof value !== 'number') return;
                    newSteps = graph.addNode(value);
                    startAnimation = false;
                    break;
                case 'ADD_EDGE':
                    if (!value || typeof value.source !== 'number' || typeof value.target !== 'number' || typeof value.weight !== 'number') return;
                    newSteps = graph.addEdge(value.source, value.target, value.weight);
                    startAnimation = false;
                    break;
                case 'GRAPH_CLEAR':
                    const newGraph = new Graph();
                    setGraph(newGraph);
                    setActiveOperation(null);
                    setStartNodeId(undefined);
                    setEndNodeId(undefined);
                    return;
                case 'RUN_DIJKSTRA': {
                    if (typeof value?.start !== 'number' || typeof value?.end !== 'number') return;
                    const { start, end } = value;
                    const { nodes, edges } = { nodes: graph.getNodeInfo().nodes, edges: graph.getEdges() };
                    const adjMatrix = graph.getAdjacencyMatrix();
                    newSteps = runDijkstra(nodes, edges, adjMatrix, start);

                    if (newSteps.length > 0) {
                        const lastStep = newSteps[newSteps.length - 1];
                        if (lastStep.graphState?.previousNodes) {
                            const path = reconstructPath(lastStep.graphState.previousNodes, start, end);
                            const finalPathStep: VisualizationStep = {
                                ...lastStep,
                                explanation: path.length > 0 ? `Camino más corto de ${start} a ${end} encontrado: ${path.join(' → ')}.` : `No se encontró un camino de ${start} a ${end}.`,
                                graphState: { ...lastStep.graphState, highlightedPath: path }
                            };
                            newSteps.push(finalPathStep);
                            setReportData({
                                operationName: "Dijkstra (A → B)",
                                nodes, edges, summarySteps: newSteps.map(s => s.explanation),
                                finalStep: finalPathStep, startNode: start, endNode: end
                            });
                        }
                    }
                    break;
                }
                case 'RUN_FLOYD_WARSHALL': {
                    const { nodes, edges } = { nodes: graph.getNodeInfo().nodes, edges: graph.getEdges() };
                    const adjMatrix = graph.getAdjacencyMatrix();
                    newSteps = runFloydWarshall(nodes, edges, adjMatrix);
                    if (newSteps.length > 0) {
                        setReportData({
                            operationName: "Floyd-Warshall",
                            nodes, edges, summarySteps: newSteps.map(s => s.explanation),
                            finalStep: newSteps[newSteps.length - 1]
                        });
                    }
                    break;
                }
                case 'RUN_BFS': {
                    if (typeof value !== 'number') return;
                    const { nodes, edges } = { nodes: graph.getNodeInfo().nodes, edges: graph.getEdges() };
                    const adjMatrix = graph.getAdjacencyMatrix();
                    newSteps = runBFS(nodes, edges, adjMatrix, value);
                    if (newSteps.length > 0) {
                        setReportData({
                            operationName: "Recorrido en Anchura (BFS)",
                            nodes, edges, summarySteps: newSteps.map(s => s.explanation),
                            finalStep: newSteps[newSteps.length - 1], startNode: value
                        });
                    }
                    break;
                }
                case 'RUN_DFS': {
                    if (typeof value !== 'number') return;
                    const { nodes, edges } = { nodes: graph.getNodeInfo().nodes, edges: graph.getEdges() };
                    const adjMatrix = graph.getAdjacencyMatrix();
                   newSteps = runDFS(nodes, edges, adjMatrix, value);
                    if (newSteps.length > 0) {
                         setReportData({
                            operationName: "Recorrido en Profundidad (DFS)",
                            nodes, edges, summarySteps: newSteps.map(s => s.explanation),
                            finalStep: newSteps[newSteps.length - 1], startNode: value
                        });
                    }
                    break;
                }
                case 'RUN_KRUSKAL': {
                    const { nodes, edges } = { nodes: graph.getNodeInfo().nodes, edges: graph.getEdges() };
                    newSteps = runKruskal(nodes, edges);
                     if (newSteps.length > 0) {
                         setReportData({
                            operationName: "Kruskal (MST)",
                            nodes, edges, summarySteps: newSteps.map(s => s.explanation),
                            finalStep: newSteps[newSteps.length - 1]
                        });
                    }
                    break;
                }
                default: return;
            }
        }
       
        setSteps(newSteps);
        setSummarySteps(newSteps.map(s => s.explanation));
        if (newSteps.length === 0) return;
        const targetStepIndex = startAnimation ? 0 : newSteps.length - 1;
        setCurrentStepIndex(targetStepIndex);
        if (startAnimation && newSteps.length > 1) {
            setIsPlaying(true);
        }
    };

    const handlePlayPause = () => setIsPlaying(prev => !prev);
    const handleNext = () => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    const handleResetAnimation = () => { setCurrentStepIndex(0); setIsPlaying(false); };

    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timerRef.current = window.setTimeout(() => { setCurrentStepIndex(currentStepIndex + 1); }, ANIMATION_SPEED);
        } else if (currentStepIndex === steps.length - 1) { setIsPlaying(false); }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [isPlaying, currentStepIndex, steps.length]);

    const currentStep = steps[currentStepIndex] || null;
    const isAnimationFinished = currentStepIndex === steps.length - 1 && steps.length > 1;
    const treeDataToRender = dataType === 'tree' ? (currentStep?.treeState ?? tree.root) : null;
    const graphDataToRender = dataType === 'graph' ? (currentStep?.graphState ?? graph.getCurrentState()) : null;

    if (!showApp) {
        return (
            <div className={`h-screen w-screen overflow-auto transition-opacity duration-700 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
                <LandingPage onEnterApp={handleEnterApp} />
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 text-gray-200 flex flex-col font-sans overflow-hidden animate-fade-in">
            <header className="bg-gray-800 p-4 shadow-lg flex-shrink-0 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">Visualizador de Estructuras de Datos</h1>
                <div className="flex bg-gray-700 rounded-lg p-1">
                    <button onClick={() => handleDataTypeChange('tree')} className={`w-28 rounded-md py-1.5 text-sm font-semibold transition-colors ${dataType === 'tree' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        Árboles
                    </button>
                    <button onClick={() => handleDataTypeChange('graph')} className={`w-28 rounded-md py-1.5 text-sm font-semibold transition-colors ${dataType === 'graph' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        Grafos
                    </button>
                </div>
            </header>
            <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
                <div className="lg:w-1/4 flex flex-col gap-4 overflow-y-auto pr-2">
                    {dataType === 'tree' ? (
                         <Controls onOperation={handleOperation} isAnimating={isPlaying} onPlayPause={handlePlayPause} onNext={handleNext} onPrev={handlePrev} onReset={handleResetAnimation} disabled={steps.length === 0} treeType={treeType} onTreeTypeChange={handleTreeTypeChange}/>
                    ) : (
                        <GraphControls 
                            onOperation={handleOperation}
                            nodes={graph.getNodeInfo().nodes}
                            startNodeId={startNodeId}
                            setStartNodeId={setStartNodeId}
                            endNodeId={endNodeId}
                            setEndNodeId={setEndNodeId}
                        />
                    )}
                    {activeOperation && CPP_CODE[activeOperation] && <CodePanel operation={activeOperation} activeLine={currentStep?.codeLine} />}
                    <SummaryPanel steps={summarySteps} />
                </div>
                <div className="flex-grow lg:w-3/4 bg-gray-800 rounded-lg shadow-2xl p-4 flex flex-col">
                    {dataType === 'tree' ? (
                         <>
                            <TreeView treeData={treeDataToRender} currentStep={currentStep} />
                            <ExplanationPanel text={currentStep?.explanation || `Seleccione una operación para comenzar.`} />
                         </>
                    ) : (
                        <>
                            <div className="flex-grow flex flex-col min-h-0">
                                <div className="flex-shrink-0 border-b border-gray-700 mb-2">
                                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                        <button onClick={() => setActiveGraphTab('view')} className={`${activeGraphTab === 'view' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors`}>
                                            Vista Gráfica
                                        </button>
                                        <button onClick={() => setActiveGraphTab('matrix')} className={`${activeGraphTab === 'matrix' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors`}>
                                            Vista de Matriz
                                        </button>
                                    </nav>
                                </div>
                                <div className="flex-grow relative">
                                    {activeGraphTab === 'view' && (<GraphView graphData={graphDataToRender} currentStep={currentStep} />)}
                                    {activeGraphTab === 'matrix' && (
                                        <div className="overflow-auto h-full">
                                            <AdjacencyMatrixView matrix={graphDataToRender?.adjacencyMatrix || []} nodes={graphDataToRender?.nodes || []} highlightedCell={currentStep?.graphState?.highlightedMatrixCell} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-shrink-0 mt-4">
                                <ExplanationPanel text={currentStep?.explanation || `Seleccione una operación para comenzar.`} />
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <button onClick={handlePrev} disabled={steps.length === 0} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">Anterior</button>
                                    <button onClick={handlePlayPause} disabled={steps.length === 0} className="px-6 py-2 bg-cyan-600 rounded hover:bg-cyan-500 disabled:opacity-50 font-bold">{isPlaying ? 'Pausa' : 'Play'}</button>
                                    <button onClick={handleNext} disabled={steps.length === 0} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">Siguiente</button>
                                    <button onClick={handleResetAnimation} disabled={steps.length === 0} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">Reiniciar</button>
                                    
                                    {isAnimationFinished && reportData && (
                                        <PDFDownloadLink
                                            document={<ReportePDF {...reportData} />}
                                            fileName={`reporte_${reportData.operationName.replace(/[^\w]/g, '_')}.pdf`}
                                        >
                                            {({ loading }) => 
                                                <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50 font-bold">
                                                    {loading ? 'Generando PDF...' : 'Exportar PDF'}
                                                </button>
                                            }
                                        </PDFDownloadLink>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            {modalContent && <Modal onClose={() => setModalContent(null)}>{modalContent}</Modal>}
        </div>
    );
};

export default App;