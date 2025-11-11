import { VisualizationStep, GraphNode, GraphEdge } from '../types';

class PriorityQueue<T> {
    private elements: { item: T; priority: number }[] = [];
    enqueue(item: T, priority: number) { this.elements.push({ item, priority }); this.elements.sort((a, b) => a.priority - b.priority); }
    dequeue(): T | undefined { return this.elements.shift()?.item; }
    isEmpty(): boolean { return this.elements.length === 0; }
}

interface DijkstraNodeState {
    distance: number;
    previousNode: number | null;
    visited: boolean;
}

export function runDijkstra(
    nodes: GraphNode[],
    edges: GraphEdge[],
    adjacencyMatrix: number[][],
    startNodeId: number
): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const numNodes = nodes.length;
    const nodeIdToIndexMap = new Map(nodes.map((node, index) => [node.id, index]));

    if (!nodeIdToIndexMap.has(startNodeId)) {
        steps.push({ 
            explanation: `Error: El nodo de inicio ${startNodeId} no existe.`,
            graphState: { nodes, edges, adjacencyMatrix }
        });
        return steps;
    }

    const startIndex = nodeIdToIndexMap.get(startNodeId)!;

    const nodeStates: DijkstraNodeState[] = nodes.map(() => ({
        distance: Infinity,
        previousNode: null,
        visited: false,
    }));
    nodeStates[startIndex].distance = 0;

    const pq = new PriorityQueue<number>();
    pq.enqueue(startNodeId, 0);

    const addStep = (
        explanation: string, 
        codeLine?: number, 
        currentProcessingNodeId?: number, 
        highlightedMatrixCell?: { row: number; col: number }
    ) => {
        steps.push({
            explanation, codeLine, highlightedNodeId: currentProcessingNodeId,
            graphState: {
                nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)), adjacencyMatrix,
                distances: Object.fromEntries(nodeStates.map((state, idx) => [nodes[idx].id, state.distance])),
                previousNodes: Object.fromEntries(nodeStates.map((state, idx) => [nodes[idx].id, state.previousNode])),
                currentProcessingNodeId, highlightedMatrixCell,
            },
        });
    };

    addStep(`Iniciando Dijkstra desde el nodo ${startNodeId}. Distancia inicial a ${startNodeId} es 0.`, 10, startNodeId);

    while (!pq.isEmpty()) {
        const currentNodeId = pq.dequeue()!;
        const currentIndex = nodeIdToIndexMap.get(currentNodeId)!;
        
        addStep(`Procesando cola de prioridad. Nodo ${currentNodeId} tiene la menor distancia.`, 15);

        if (nodeStates[currentIndex].visited) {
            addStep(`Nodo ${currentNodeId} ya fue visitado. Saltando.`, 20, currentNodeId);
            continue;
        }

        nodeStates[currentIndex].visited = true;
        addStep(`Visitando nodo ${currentNodeId}. Su distancia actual es ${nodeStates[currentIndex].distance}.`, 24, currentNodeId);

        for (let neighborIndex = 0; neighborIndex < numNodes; neighborIndex++) {
            const neighborId = nodes[neighborIndex].id;
            const edgeWeight = adjacencyMatrix[currentIndex][neighborIndex];

            if (edgeWeight !== Infinity && edgeWeight > 0) {
                const newDistance = nodeStates[currentIndex].distance + edgeWeight;
                
                addStep(
                    `Evaluando vecino ${neighborId} desde ${currentNodeId}. Peso: ${edgeWeight}.`, 
                    25, currentNodeId, { row: currentIndex, col: neighborIndex }
                );
                
                if (newDistance < nodeStates[neighborIndex].distance) {
                    nodeStates[neighborIndex].distance = newDistance;
                    nodeStates[neighborIndex].previousNode = currentNodeId;
                    pq.enqueue(neighborId, newDistance);
                    
                    addStep(
                        `¡Camino mejorado! Nueva distancia a ${neighborId} es ${newDistance} (vía ${currentNodeId}).`,
                        26, neighborId, { row: currentIndex, col: neighborIndex }
                    );
                } else {
                    addStep(
                        `El camino actual a ${neighborId} (${nodeStates[neighborIndex].distance}) es mejor. No se actualiza.`,
                        25, neighborId, { row: currentIndex, col: neighborIndex }
                    );
                }
            }
        }
    }

    addStep('Algoritmo de Dijkstra completado. Distancias finales calculadas.', 30);
    return steps;
}

export function reconstructPath(
    previousNodes: Record<number, number | null>,
    startNodeId: number,
    endNodeId: number
): number[] {
    const path: number[] = [];
    let currentNodeId: number | null = endNodeId;
    while (currentNodeId !== null) {
        path.unshift(currentNodeId);
        if (currentNodeId === startNodeId) break;
        currentNodeId = previousNodes[currentNodeId];
    }
    if (path.length === 0 || path[0] !== startNodeId) return [];
    return path;
}