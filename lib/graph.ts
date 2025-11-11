import { VisualizationStep, GraphNode, GraphEdge } from '../types';

export class Graph {
    private nodes : GraphNode[] = [];
    private edges : GraphEdge[] = [];
    private adjacencyMatrix : number[][] = [];
    private nodeIdToIndexMap : Map<number, number> = new Map();
    
    constructor() {
  
    }
    
    public getCurrentState(){
        return {
            nodes: JSON.parse(JSON.stringify(this.nodes)),
            edges: JSON.parse(JSON.stringify(this.edges)),
            adjacencyMatrix: JSON.parse(JSON.stringify(this.adjacencyMatrix))
        };
    }

    addNode(nodeId: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];

       
        if (this.nodeIdToIndexMap.has(nodeId)){
            steps.push({
                explanation: `El nodo con id ${nodeId} ya existe en el grafo.`,
                graphState: this.getCurrentState(),
               
            });
            return steps;
        }
        steps.push({
            explanation: `Iniciando adición del nodo ${nodeId}. Se debe expandir la matriz de adyacencia.`,
            graphState: this.getCurrentState(),
           
        });
        const newIndex = this.nodes.length;
        this.nodeIdToIndexMap.set(nodeId, newIndex);
        this.nodes.push(new GraphNode(nodeId));
        
        this.adjacencyMatrix.forEach(row => row.push(Infinity));
        const newRow = new Array(this.nodes.length).fill(Infinity);
        newRow[newIndex] = 0; // distancia de un nodo a sí mismo es 0.
        this.adjacencyMatrix.push(newRow);

        steps.push({
            explanation: `Nodo ${nodeId} añadido. La matriz ahora es de ${this.nodes.length}x${this.nodes.length}.`,
            graphState: this.getCurrentState(),
            highlightedNodeId: nodeId,
        });
        return steps;
    }

    addEdge(sourceId: number, targetId: number, weight: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        
        if (!this.nodeIdToIndexMap.has(sourceId) || !this.nodeIdToIndexMap.has(targetId)) {
            steps.push({
                explanation: 'Error: Uno o ambos nodos no existen.',
                graphState: this.getCurrentState(),
            });
            return steps;
        }

        const sourceIndex = this.nodeIdToIndexMap.get(sourceId)!;
        const targetIndex = this.nodeIdToIndexMap.get(targetId)!;
        
        steps.push({
            explanation: `Añadiendo arista entre ${sourceId} y ${targetId} con peso ${weight}.`,
            graphState: this.getCurrentState(),
            highlightedNodeId: sourceId,
        });
        
        steps.push({
            explanation: `Se actualizará la matriz en las celdas [${sourceIndex}][${targetIndex}] y [${targetIndex}][${sourceIndex}].`,
            graphState: {
                ...this.getCurrentState(),
                highlightedMatrixCell: { row: sourceIndex, col: targetIndex }
            },
        });

        this.adjacencyMatrix[sourceIndex][targetIndex] = weight;
        this.adjacencyMatrix[targetIndex][sourceIndex] = weight;

        this.edges.push({ source: sourceId, target: targetId, weight });

        steps.push({
            explanation: `Arista añadida con éxito. La matriz y la visualización han sido actualizadas.`,
            graphState: this.getCurrentState(),
            highlightedEdge: { source: sourceId, target: targetId, weight },
        });
        return steps;
    }

    public getAdjacencyMatrix(): number[][] {
        return JSON.parse(JSON.stringify(this.adjacencyMatrix));
    }

    public getNodeInfo(): { nodes: GraphNode[], nodeIdToIndexMap: Map<number, number> } {
        return {
            nodes: JSON.parse(JSON.stringify(this.nodes)),
            nodeIdToIndexMap: new Map(this.nodeIdToIndexMap) 
        };
    }


    public getEdges(): GraphEdge[] {
        return JSON.parse(JSON.stringify(this.edges));
    }
}