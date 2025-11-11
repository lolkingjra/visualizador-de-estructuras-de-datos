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


export class BinarySearchTree {
    root: TreeNode | null;

    constructor() {
        this.root = null;
    }

    insert(value: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        const pathIds: number[] = [];

        const addStep = (node: TreeNode | null, explanation: string, codeLine: number, highlightedNodeId?: number) => {
            steps.push({
                treeState: cloneTree(this.root),
                highlightedNodeId,
                pathIds: [...pathIds],
                explanation,
                codeLine,
            });
        };
        
        const searchExisting = this.search(value);
        if(searchExisting[searchExisting.length-1].explanation.includes("encontrado")){
            return [{ treeState: this.root, explanation: `El valor ${value} ya existe en el árbol. No se permiten duplicados.`, codeLine: 16 }];
        }

        let current = this.root;
        let parent: TreeNode | null = null;
        
        addStep(this.root, `Iniciando inserción del valor ${value}.`, 5);
        if (this.root === null) {
            addStep(null, `El árbol está vacío.`, 6);
            this.root = new TreeNode(value);
            addStep(this.root, `Creando un nuevo nodo con valor ${value} y estableciéndolo como raíz.`, 7);
            return steps;
        }

        while (current !== null) {
            parent = current;
            pathIds.push(current.id);
            addStep(current, `Comparando ${value} con el nodo actual (${current.value}).`, 13, current.id);
            if (value < current.value) {
                addStep(current, `${value} < ${current.value}. Moviéndose al subárbol izquierdo.`, 14, current.id);
                current = current.left;
            } else {
                addStep(current, `${value} > ${current.value}. Moviéndose al subárbol derecho.`, 16, current.id);
                current = current.right;
            }
        }

        addStep(parent, `Se encontró una posición vacía. Insertando el nuevo nodo.`, 6, parent!.id);
        if (parent === null) {
            this.root = new TreeNode(value);
        } else if (value < parent.value) {
            parent.left = new TreeNode(value);
             addStep(parent, `Insertando ${value} como hijo izquierdo de ${parent.value}.`, 15);
        } else {
            parent.right = new TreeNode(value);
            addStep(parent, `Insertando ${value} como hijo derecho de ${parent.value}.`, 17);
        }

        return steps;
    }

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

    delete(value: number): VisualizationStep[] {
        const steps: VisualizationStep[] = [];
        
        const addStep = (root: TreeNode | null, explanation: string, codeLine: number, highlightId?: number, secondaryId?: number) => {
            steps.push({ 
                treeState: cloneTree(root), 
                explanation, 
                codeLine, 
                highlightedNodeId: highlightId,
                secondaryHighlightId: secondaryId
            });
        };

        const deleteNodeRecursive = (root: TreeNode | null, val: number): TreeNode | null => {
            if (root === null) {
                addStep(this.root, `El valor ${val} no se encontró en el árbol.`, 6);
                return null;
            }
            addStep(this.root, `Comparando ${val} con ${root.value}.`, 8, root.id);

            if (val < root.value) {
                addStep(this.root, `${val} < ${root.value}. Buscando en el subárbol izquierdo.`, 9, root.id);
                root.left = deleteNodeRecursive(root.left, val);
            } else if (val > root.value) {
                addStep(this.root, `${val} > ${root.value}. Buscando en el subárbol derecho.`, 11, root.id);
                root.right = deleteNodeRecursive(root.right, val);
            } else {
                addStep(this.root, `Nodo con valor ${val} encontrado. Procediendo a eliminar.`, 13, root.id);
                
                // Caso 1: Nodo sin hijos o con un solo hijo
                if (root.left === null) {
                    addStep(this.root, `El nodo a eliminar no tiene hijo izquierdo. Se reemplaza con el hijo derecho.`, 14, root.id);
                    const temp = root.right;
                    return temp;
                } else if (root.right === null) {
                    addStep(this.root, `El nodo a eliminar no tiene hijo derecho. Se reemplaza con el hijo izquierdo.`, 19, root.id);
                    const temp = root.left;
                    return temp;
                }

                // Caso 2: Nodo con dos hijos
                addStep(this.root, `El nodo a eliminar tiene dos hijos.`, 24, root.id);
                const findMin = (node: TreeNode): TreeNode => {
                    let minNode = node;
                    addStep(this.root, `Buscando el sucesor in-order (el valor mínimo en el subárbol derecho).`, 2, minNode.id);
                    while (minNode.left !== null) {
                        minNode = minNode.left;
                        addStep(this.root, `Moviéndose a la izquierda hacia ${minNode.value}.`, 2, minNode.id);
                    }
                    addStep(this.root, `Sucesor in-order encontrado: ${minNode.value}.`, 3, minNode.id, root.id);
                    return minNode;
                };

                const temp = findMin(root.right);
                addStep(this.root, `Copiando el valor del sucesor (${temp.value}) al nodo a eliminar.`, 25, root.id, temp.id);
                root.value = temp.value;
                addStep(this.root, `Ahora, eliminando el nodo del sucesor (${temp.value}) del subárbol derecho.`, 26, root.id, temp.id);
                root.right = deleteNodeRecursive(root.right, temp.value);
            }
            return root;
        };
        
        this.root = deleteNodeRecursive(this.root, value);
        addStep(this.root, `Eliminación completada.`, 28);
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
        const getHeightRecursive = (node: TreeNode | null): number => {
            if (node === null) return -1;
            const leftHeight = getHeightRecursive(node.left);
            const rightHeight = getHeightRecursive(node.right);
            return Math.max(leftHeight, rightHeight) + 1;
        };
        return getHeightRecursive(this.root);
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