let nodeIdCounter = 0;

export class TreeNode {
    id: number;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    height: number;

    constructor(value: number) {
        this.id = nodeIdCounter++;
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 0;
    }
}

export class GraphNode {
    id: number;
    value: number;
    
    constructor(value: number) {
        this.id = value;
        this.value = value;
    }
}

export interface GraphEdge {
    source: number;
    target: number;
    weight: number;
}

export type Operation =
  | 'INSERT' | 'SEARCH' | 'DELETE' | 'IN_ORDER' | 'GET_HEIGHT' | 'COUNT_LEAVES' | 'CLEAR' | 'AVL_INSERT' | 'AVL_DELETE'
  | 'ADD_NODE' | 'ADD_EDGE' | 'GRAPH_CLEAR'
  | 'RUN_DIJKSTRA' | 'RUN_FLOYD_WARSHALL'
  | 'RUN_BFS' | 'RUN_DFS' | 'RUN_KRUSKAL';
  
export interface VisualizationStep {
  explanation: string;
  codeLine?: number;
  
  treeState?: TreeNode | null;
  highlightedNodeId?: number;
  secondaryHighlightId?: number;
  pathIds?: number[];
  traversalOrder?: number[];

  graphState?: { 
    nodes: GraphNode[],
    edges: GraphEdge[],
    adjacencyMatrix?: number[][]; 
    
    distances?: Record<number, number>;
    previousNodes?: Record<number, number | null>;
    
    currentProcessingNodeId?: number; 
    highlightedMatrixCell?: { row: number; col: number };
    highlightedPath?: number[];

    visitedNodes?: number[];
    queue?: number[]; 
traversalOrder?: number[];

    mstEdges?: GraphEdge[];
    mstTotalWeight?: number;
  };
  highlightedEdge?: GraphEdge;
}

export interface CppCode {
    title: string;
    code: string;
}