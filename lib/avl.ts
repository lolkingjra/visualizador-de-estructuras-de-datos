import { VisualizationStep, TreeNode } from '../types';

const cloneTree = (node: TreeNode | null): TreeNode | null => {
    if (node === null) return null;
    const newNode = new TreeNode(node.value);
    newNode.id = node.id;
    newNode.height = node.height;
    newNode.left = cloneTree(node.left);
    newNode.right = cloneTree(node.right);
    return newNode;
};

export class AVLTree {
    root: TreeNode | null = null;

    // Métodos públicos que llaman a los recursivos
    insert(value: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        const searchSteps = this.search(value);
        if (searchSteps[searchSteps.length - 1].explanation.includes("encontrado")) {
            return [{ treeState: this.root, explanation: `El valor ${value} ya existe en el árbol. No se permiten duplicados.`, codeLine: 43 }];
        }
        
        this.root = this._insertNode(this.root, value, steps);
        steps.push({ treeState: cloneTree(this.root), explanation: `Inserción de ${value} completada y árbol balanceado.`, codeLine: 0 });
        return steps;
    }

    delete(value: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        const searchSteps = this.search(value);
         if (!searchSteps[searchSteps.length - 1].explanation.includes("encontrado")) {
            return [{ treeState: this.root, explanation: `El valor ${value} no se encuentra en el árbol.`, codeLine: 13 }];
        }
        this.root = this._deleteNode(this.root, value, steps);
        steps.push({ treeState: cloneTree(this.root), explanation: `Eliminación de ${value} completada y árbol balanceado.`, codeLine: 0 });
        return steps;
    }

    // Métodos auxiliares
    private _getHeight(node: TreeNode | null): number {
        return node ? node.height : -1;
    }

    private _updateHeight(node: TreeNode): void {
        node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    }

    private _getBalanceFactor(node: TreeNode): number {
        return this._getHeight(node.left) - this._getHeight(node.right);
    }
    
    // Rotaciones
    private _rightRotate(y: TreeNode, steps: VisualizationStep[]): TreeNode {
        steps.push({ treeState: cloneTree(this.root), explanation: `Realizando rotación simple a la derecha en el nodo ${y.value}.`, codeLine: 10, highlightedNodeId: y.id });
        const x = y.left!;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this._updateHeight(y);
        this._updateHeight(x);
        steps.push({ treeState: cloneTree(this.root), explanation: `Rotación completada.`, codeLine: 16, highlightedNodeId: x.id });
        return x;
    }

    private _leftRotate(x: TreeNode, steps: VisualizationStep[]): TreeNode {
        steps.push({ treeState: cloneTree(this.root), explanation: `Realizando rotación simple a la izquierda en el nodo ${x.value}.`, codeLine: 19, highlightedNodeId: x.id });
        const y = x.right!;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this._updateHeight(x);
        this._updateHeight(y);
        steps.push({ treeState: cloneTree(this.root), explanation: `Rotación completada.`, codeLine: 25, highlightedNodeId: y.id });
        return y;
    }
    
    // Lógica de inserción recursiva
    private _insertNode(node: TreeNode | null, value: number, steps: VisualizationStep[]): TreeNode {
        if (!node) {
            steps.push({ treeState: cloneTree(this.root), explanation: `Insertando nuevo nodo con valor ${value}.`, codeLine: 35 });
            return new TreeNode(value);
        }
        
        steps.push({ treeState: cloneTree(this.root), explanation: `Comparando ${value} con ${node.value}.`, codeLine: 37, highlightedNodeId: node.id });
        if (value < node.value) {
            node.left = this._insertNode(node.left, value, steps);
        } else if (value > node.value) {
            node.right = this._insertNode(node.right, value, steps);
        } else {
            return node; // No duplicados
        }

        steps.push({ treeState: cloneTree(this.root), explanation: `Actualizando altura del nodo ${node.value}.`, codeLine: 44, highlightedNodeId: node.id });
        this._updateHeight(node);
        const balance = this._getBalanceFactor(node);
        steps.push({ treeState: cloneTree(this.root), explanation: `Verificando balance del nodo ${node.value}. Factor de balanceo: ${balance}.`, codeLine: 46, highlightedNodeId: node.id });

        // Casos de desbalanceo
        // Caso Izquierda-Izquierda
        if (balance > 1 && value < node.left!.value) {
            steps.push({ treeState: cloneTree(this.root), explanation: `Desbalanceo Izquierda-Izquierda detectado en el nodo ${node.value}.`, codeLine: 49, highlightedNodeId: node.id });
            return this._rightRotate(node, steps);
        }
        // Caso Derecha-Derecha
        if (balance < -1 && value > node.right!.value) {
             steps.push({ treeState: cloneTree(this.root), explanation: `Desbalanceo Derecha-Derecha detectado en el nodo ${node.value}.`, codeLine: 53, highlightedNodeId: node.id });
            return this._leftRotate(node, steps);
        }
        // Caso Izquierda-Derecha
        if (balance > 1 && value > node.left!.value) {
            steps.push({ treeState: cloneTree(this.root), explanation: `Desbalanceo Izquierda-Derecha detectado en el nodo ${node.value}.`, codeLine: 57, highlightedNodeId: node.id });
            node.left = this._leftRotate(node.left!, steps);
            return this._rightRotate(node, steps);
        }
        // Caso Derecha-Izquierda
        if (balance < -1 && value < node.right!.value) {
            steps.push({ treeState: cloneTree(this.root), explanation: `Desbalanceo Derecha-Izquierda detectado en el nodo ${node.value}.`, codeLine: 63, highlightedNodeId: node.id });
            node.right = this._rightRotate(node.right!, steps);
            return this._leftRotate(node, steps);
        }

        return node;
    }

    private _deleteNode(root: TreeNode | null, value: number, steps: VisualizationStep[]): TreeNode | null {
        if (root === null) return root;

        steps.push({ treeState: cloneTree(this.root), explanation: `Comparando ${value} con ${root.value}.`, codeLine: 15, highlightedNodeId: root.id });
        if (value < root.value) {
            root.left = this._deleteNode(root.left, value, steps);
        } else if (value > root.value) {
            root.right = this._deleteNode(root.right, value, steps);
        } else {
             if (root.left === null || root.right === null) {
                const temp = root.left ? root.left : root.right;
                steps.push({ treeState: cloneTree(this.root), explanation: `Nodo ${value} tiene uno o cero hijos. Se elimina.`, codeLine: 20, highlightedNodeId: root.id });
                root = temp;
            } else {
                steps.push({ treeState: cloneTree(this.root), explanation: `Nodo ${value} tiene dos hijos. Buscando sucesor in-order.`, codeLine: 27, highlightedNodeId: root.id });
                const temp = this._minValueNode(root.right!);
                steps.push({ treeState: cloneTree(this.root), explanation: `Sucesor es ${temp.value}. Se copia el valor y se elimina el sucesor.`, codeLine: 28, highlightedNodeId: root.id, secondaryHighlightId: temp.id });
                root.value = temp.value;
                root.right = this._deleteNode(root.right, temp.value, steps);
            }
        }

        if (root === null) return root;
        
        this._updateHeight(root);
        const balance = this._getBalanceFactor(root);
        steps.push({ treeState: cloneTree(this.root), explanation: `Verificando balance del nodo ${root.value}. Factor: ${balance}.`, codeLine: 36, highlightedNodeId: root.id });

        // Casos de desbalanceo
        if (balance > 1 && this._getBalanceFactor(root.left!) >= 0) {
            return this._rightRotate(root, steps);
        }
        if (balance > 1 && this._getBalanceFactor(root.left!) < 0) {
            root.left = this._leftRotate(root.left!, steps);
            return this._rightRotate(root, steps);
        }
        if (balance < -1 && this._getBalanceFactor(root.right!) <= 0) {
            return this._leftRotate(root, steps);
        }
        if (balance < -1 && this._getBalanceFactor(root.right!) > 0) {
            root.right = this._rightRotate(root.right!, steps);
            return this._leftRotate(root, steps);
        }

        return root;
    }
    
    private _minValueNode(node: TreeNode): TreeNode {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // Métodos heredados/reimplementados de bsst que no cambian en su lógica principal
    search(value: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        const pathIds: number[] = [];
        let current = this.root;

        const addStep = (explanation: string, codeLine: number, highlightedNodeId?: number) => {
             steps.push({ treeState: cloneTree(this.root), explanation, codeLine, highlightedNodeId, pathIds: [...pathIds] });
        };
        
        addStep(`Iniciando búsqueda del valor ${value}.`, 2);

        while (current !== null) {
            pathIds.push(current.id);
            addStep(`Comparando ${value} con el nodo actual (${current.value}).`, 3, current.id);
            if (value === current.value) {
                addStep(`Valor ${value} encontrado.`, 4, current.id);
                return steps;
            }
            if (value < current.value) {
                addStep(`${value} < ${current.value}. Moviéndose al subárbol izquierdo.`, 7, current.id);
                current = current.left;
            } else {
                addStep(`${value} > ${current.value}. Moviéndose al subárbol derecho.`, 9, current.id);
                current = current.right;
            }
        }
        
        addStep(`No se encontró el valor ${value} en el árbol.`, 3);
        return steps;
    }

    inOrderTraversal(): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        const result: number[] = [];
        
        const traverse = (node: TreeNode | null) => {
            if (node === null) {
                steps.push({ treeState: cloneTree(this.root), explanation: "Llegó a un nodo nulo (hoja), retornando.", codeLine: 3 });
                return;
            }

            steps.push({ treeState: cloneTree(this.root), highlightedNodeId: node.id, explanation: `Visitando nodo ${node.value}. Primero, recorrer subárbol izquierdo.`, codeLine: 5 });
            traverse(node.left);

            result.push(node.value);
            steps.push({ treeState: cloneTree(this.root), highlightedNodeId: node.id, traversalOrder: [...result], explanation: `Procesando nodo ${node.value}. Valor añadido al resultado: ${result.join(', ')}.`, codeLine: 6 });

            steps.push({ treeState: cloneTree(this.root), highlightedNodeId: node.id, traversalOrder: [...result], explanation: `Ahora, recorrer subárbol derecho de ${node.value}.`, codeLine: 7 });
            traverse(node.right);
        };
        
        steps.push({ treeState: cloneTree(this.root), explanation: "Iniciando recorrido In-Order desde la raíz.", codeLine: 2 });
        traverse(this.root);
        steps.push({ treeState: cloneTree(this.root), traversalOrder: [...result], explanation: `Recorrido In-Order completado. Resultado final: ${result.join(', ')}.`, codeLine: 1 });
        return steps;
    }

    getHeight(): number {
        return this.root ? this.root.height : -1;
    }
    
    countLeaves(): number {
        const countLeavesRecursive = (node: TreeNode | null): number => {
            if (node === null) return 0;
            if (node.left === null && node.right === null) return 1;
            return countLeavesRecursive(node.left) + countLeavesRecursive(node.right);
        };
        return countLeavesRecursive(this.root);
    }
}
