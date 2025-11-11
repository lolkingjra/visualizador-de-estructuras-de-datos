import { VisualizationStep, GraphNode, GraphEdge } from '../types';

class DSU {
    parent: { [key: number]: number } = {};
    constructor(nodes: GraphNode[]) {
        nodes.forEach(node => this.parent[node.id] = node.id);
    }
    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }
    union(i: number, j: number) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootJ] = rootI;
        }
    }
}

export function runKruskal(nodes: GraphNode[], edges: GraphEdge[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    const dsu = new DSU(nodes);
    const mst: GraphEdge[] = [];
    let totalWeight = 0;

    const addStep = (explanation: string, codeLine: number, highlightedEdge?: GraphEdge) => {
        steps.push({
            explanation, codeLine, highlightedEdge,
            graphState: {
                nodes, edges,
                mstEdges: [...mst],
                mstTotalWeight: totalWeight,
            },
        });
    };

    addStep("Iniciando Kruskal. Se ordenan todas las aristas por peso de menor a mayor.", 26);

    for (const edge of sortedEdges) {
        addStep(`Considerando arista (${edge.source} ↔ ${edge.target}) con peso ${edge.weight}.`, 33, edge);

        const rootSource = dsu.find(edge.source);
        const rootTarget = dsu.find(edge.target);

        if (rootSource !== rootTarget) {
            mst.push(edge);
            totalWeight += edge.weight;
            dsu.union(edge.source, edge.target);
            addStep(`Los nodos ${edge.source} y ${edge.target} están en componentes diferentes. Se añade la arista al MST.`, 35, edge);
        } else {
            addStep(`Los nodos ${edge.source} y ${edge.target} ya están conectados. Se descarta la arista para evitar un ciclo.`, 33, edge);
        }
    }

    addStep(`Algoritmo de Kruskal completado. Peso total del MST: ${totalWeight}.`, 38);
    return steps;
}