import { VisualizationStep, GraphNode, GraphEdge } from '../types';

export function runDFS(
    nodes: GraphNode[],
    edges: GraphEdge[], 
    adjacencyMatrix: number[][],
    startNodeId: number
): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const nodeIdToIndexMap = new Map(nodes.map((node, index) => [node.id, index]));
    
    if (!nodeIdToIndexMap.has(startNodeId)) return steps;

    const startIndex = nodeIdToIndexMap.get(startNodeId)!;
    const visited: number[] = [];
    const traversalOrder: number[] = [];

    const addStep = (explanation: string, codeLine: number, currentProcessingNodeId?: number) => {
        steps.push({
            explanation, codeLine,
            graphState: {
                nodes,
                edges: edges, 
                adjacencyMatrix,
                visitedNodes: [...visited],
                traversalOrder: [...traversalOrder],
                currentProcessingNodeId,
            },
        });
    };
    
    function dfsRecursive(u_idx: number) {
        const u_id = nodes[u_idx].id;
        visited.push(u_id);
        traversalOrder.push(u_id);
        
        addStep(`Visitando nodo ${u_id}. Se marca como visitado y se añade al recorrido.`, 8, u_id);

        for (let v_idx = 0; v_idx < nodes.length; v_idx++) {
            const v_id = nodes[v_idx].id;
            if (adjacencyMatrix[u_idx][v_idx] !== Infinity && adjacencyMatrix[u_idx][v_idx] > 0 && !visited.includes(v_id)) {
                addStep(`Desde ${u_id}, explorando vecino no visitado ${v_id}.`, 11, u_id);
                dfsRecursive(v_idx);
                addStep(`Regresando a ${u_id} después de visitar la rama de ${v_id}.`, 8, u_id);
            }
        }
    }

    addStep(`Iniciando DFS desde el nodo ${startNodeId}.`, 21);
    dfsRecursive(startIndex);
    addStep(`DFS completado. Orden de recorrido: ${traversalOrder.join(' → ')}.`, 21);

    return steps;
}