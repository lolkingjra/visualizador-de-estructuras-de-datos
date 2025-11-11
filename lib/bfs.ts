import { VisualizationStep, GraphNode, GraphEdge } from '../types';

export function runBFS(
    nodes: GraphNode[],
    edges: GraphEdge[], 
    adjacencyMatrix: number[][],
    startNodeId: number
): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const nodeIdToIndexMap = new Map(nodes.map((node, index) => [node.id, index]));

    if (!nodeIdToIndexMap.has(startNodeId)) return steps;

    const startIndex = nodeIdToIndexMap.get(startNodeId)!;
    const numNodes = nodes.length;

    const queue: number[] = [];
    const visited: number[] = [];
    const traversalOrder: number[] = [];

    queue.push(startIndex);
    visited.push(nodes[startIndex].id);

    const addStep = (explanation: string, codeLine: number) => {
        steps.push({
            explanation, codeLine,
            graphState: {
                nodes,
                edges: edges, 
                adjacencyMatrix,
                visitedNodes: [...visited],
                queue: [...queue.map(index => nodes[index].id)],
                traversalOrder: [...traversalOrder]
            },
        });
    };

    addStep(`Iniciando BFS desde el nodo ${startNodeId}. Se añade a la cola y se marca como visitado.`, 11);

    while (queue.length > 0) {
        const u_idx = queue.shift()!;
        const u_id = nodes[u_idx].id;
        traversalOrder.push(u_id);

        addStep(`Procesando nodo ${u_id} (sacado de la cola).`, 17);

        for (let v_idx = 0; v_idx < numNodes; v_idx++) {
            const v_id = nodes[v_idx].id;
            if (adjacencyMatrix[u_idx][v_idx] !== Infinity && adjacencyMatrix[u_idx][v_idx] > 0 && !visited.includes(v_id)) {
                visited.push(v_id);
                queue.push(v_idx);
                addStep(`Descubriendo vecino no visitado ${v_id}. Se añade a la cola y se marca como visitado.`, 22);
            }
        }
    }

    addStep(`BFS completado. Orden de recorrido: ${traversalOrder.join(' → ')}.`, 25);
    return steps;
}