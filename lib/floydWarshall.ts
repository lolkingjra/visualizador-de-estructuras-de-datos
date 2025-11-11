import { VisualizationStep, GraphNode, GraphEdge } from '../types';

export function runFloydWarshall(
    nodes: GraphNode[],
    edges: GraphEdge[],
    initialMatrix: number[][]
): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const numNodes = nodes.length;

    let dist = JSON.parse(JSON.stringify(initialMatrix));

    const addStep = (
        explanation: string,
        codeLine?: number,
        k_idx?: number,
        i_idx?: number,
        j_idx?: number
    ) => {
        steps.push({
            explanation, codeLine, highlightedNodeId: i_idx !== undefined ? nodes[i_idx].id : undefined,
            graphState: {
                nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)),
                adjacencyMatrix: JSON.parse(JSON.stringify(dist)),
                currentProcessingNodeId: k_idx !== undefined ? nodes[k_idx].id : undefined,
                highlightedMatrixCell: (i_idx !== undefined && j_idx !== undefined)
                    ? { row: i_idx, col: j_idx } : undefined,
            },
        });
    };

    addStep('Iniciando Floyd-Warshall. La matriz inicial representa las distancias directas.', 5);

    for (let k_idx = 0; k_idx < numNodes; k_idx++) {
        const kNodeId = nodes[k_idx].id;
        addStep(`Iteración principal (k=${k_idx}): Considerando el nodo ${kNodeId} como intermediario.`, 7, k_idx);

        for (let i_idx = 0; i_idx < numNodes; i_idx++) {
            const iNodeId = nodes[i_idx].id;
            for (let j_idx = 0; j_idx < numNodes; j_idx++) {
                const jNodeId = nodes[j_idx].id;
                
                if (i_idx === j_idx || i_idx === k_idx || j_idx === k_idx) continue;

                addStep(`Evaluando camino de ${iNodeId} a ${jNodeId} vía ${kNodeId}.`, 9, k_idx, i_idx, j_idx);

                const directDist = dist[i_idx][j_idx];
                const detourDist = dist[i_idx][k_idx] + dist[k_idx][j_idx];

                if (detourDist < directDist) {
                    const oldDistance = directDist === Infinity ? '∞' : directDist;
                    
                    dist[i_idx][j_idx] = detourDist;

                    addStep(
                        `¡Actualizado! Nueva distancia de ${iNodeId} a ${jNodeId} es ${detourDist} (antes ${oldDistance}).`,
                        12, k_idx, i_idx, j_idx
                    );

                }
            }
        }
    }

    addStep('Algoritmo de Floyd-Warshall completado. Matriz de distancias finales calculada.', 17);
    return steps;
}