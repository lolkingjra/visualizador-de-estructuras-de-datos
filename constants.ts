import { Operation, CppCode } from './types';

export const ANIMATION_SPEED = 800;
export const NODE_SIZE = 24;

export const CPP_CODE: Record<Operation, CppCode> = {
  INSERT: {
    title: "Inserción en C++ (BST)",
    code: `
struct Node {
    int data;
    Node *left, *right;
};

Node* insert(Node* root, int data) {
    if (root == nullptr) {
        Node* newNode = new Node();
        newNode->data = data;
        newNode->left = newNode->right = nullptr;
        return newNode;
    }
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    return root;
}`.trim(),
  },
  SEARCH: {
    title: "Búsqueda en C++",
    code: `
Node* search(Node* root, int data) {
    if (root == nullptr || root->data == data) {
        return root;
    }
    if (data < root->data) {
        return search(root->left, data);
    }
    return search(root->right, data);
}`.trim(),
  },
  DELETE: {
    title: "Eliminación en C++ (BST)",
    code: `
Node* findMin(Node* node) {
    while(node->left != nullptr) node = node->left;
    return node;
}

Node* deleteNode(Node* root, int data) {
    if (root == nullptr) return root;

    if (data < root->data) {
        root->left = deleteNode(root->left, data);
    } else if (data > root->data) {
        root->right = deleteNode(root->right, data);
    } else {
        if (root->left == nullptr) {
            Node* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}`.trim(),
  },
  AVL_INSERT: {
    title: "Inserción en C++ (AVL)",
    code: `
int height(Node* n) {
    return n == nullptr ? 0 : n->height;
}

int getBalance(Node* n) {
    return n == nullptr ? 0 : height(n->left) - height(n->right);
}

Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}

Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = max(height(x->left), height(x->right)) + 1;
    y->height = max(height(y->left), height(y->right)) + 1;
    return y;
}

Node* insert(Node* node, int data) {
    if (node == nullptr) return new Node(data);

    if (data < node->data)
        node->left = insert(node->left, data);
    else if (data > node->data)
        node->right = insert(node->right, data);
    else
        return node;

    node->height = 1 + max(height(node->left), height(node->right));

    int balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && data < node->left->data)
        return rightRotate(node);

    // Right Right Case
    if (balance < -1 && data > node->right->data)
        return leftRotate(node);

    // Left Right Case
    if (balance > 1 && data > node->left->data) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && data < node->right->data) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}`.trim()
  },
  AVL_DELETE: {
      title: "Eliminación en C++ (AVL)",
      code: `
// (Las funciones height, getBalance, rotations son las mismas que en inserción)

Node* minValueNode(Node* node) {
    Node* current = node;
    while (current->left != nullptr)
        current = current->left;
    return current;
}

Node* deleteNode(Node* root, int data) {
    if (root == nullptr) return root;

    if (data < root->data)
        root->left = deleteNode(root->left, data);
    else if (data > root->data)
        root->right = deleteNode(root->right, data);
    else {
        if ((root->left == nullptr) || (root->right == nullptr)) {
            Node* temp = root->left ? root->left : root->right;
            if (temp == nullptr) {
                temp = root;
                root = nullptr;
            } else
                *root = *temp;
            delete temp;
        } else {
            Node* temp = minValueNode(root->right);
            root->data = temp->data;
            root->right = deleteNode(root->right, temp->data);
        }
    }

    if (root == nullptr) return root;

    root->height = 1 + max(height(root->left), height(root->right));
    int balance = getBalance(root);

    // Left Left Case
    if (balance > 1 && getBalance(root->left) >= 0)
        return rightRotate(root);

    // Left Right Case
    if (balance > 1 && getBalance(root->left) < 0) {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && getBalance(root->right) <= 0)
        return leftRotate(root);

    // Right Left Case
    if (balance < -1 && getBalance(root->right) > 0) {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }

    return root;
}`.trim()
  },
  IN_ORDER: {
    title: "Recorrido In-Order en C++",
    code: `
void inOrder(Node* root) {
    if (root == nullptr) {
        return;
    }
    inOrder(root->left);
    cout << root->data << " ";
    inOrder(root->right);
}`.trim(),
  },
  GET_HEIGHT: {
    title: "Obtener Altura en C++",
    code: `
int getHeight(Node* root) {
    if (root == nullptr) {
        return -1; // O 0, dependiendo de la definición
    }
    int leftHeight = getHeight(root->left);
    int rightHeight = getHeight(root->right);
    return max(leftHeight, rightHeight) + 1;
}`.trim(),
  },
  COUNT_LEAVES: {
    title: "Contar Hojas en C++",
    code: `
int countLeaves(Node* root) {
    if (root == nullptr) {
        return 0;
    }
    if (root->left == nullptr && root->right == nullptr) {
        return 1;
    }
    return countLeaves(root->left) + countLeaves(root->right);
}`.trim(),
  },
  CLEAR: {
      title: "Limpiar Árbol",
      code: `// No hay código C++ para esta operación de UI.`
  },
  
  ADD_NODE: {
    title: "C++: Añadir Vértice (Matriz Ady.)",
    code: `
// Grafo con Matriz de Adyacencia y mapa para IDs
const int INF = 1e9;
std::vector<std::vector<int>> adjMatrix;
std::map<int, int> nodeIdToIndex;

void addNode(int nodeId) {
    if (nodeIdToIndex.count(nodeId)) {
        return; // El nodo ya existe
    }
    int newIndex = adjMatrix.size();
    nodeIdToIndex[nodeId] = newIndex;
    
    // Añade nueva columna a filas existentes
    for (auto& row : adjMatrix) {
        row.push_back(INF);
    }
    
    // Añade nueva fila
    std::vector<int> newRow(newIndex + 1, INF);
    newRow[newIndex] = 0; // Distancia a sí mismo es 0
    adjMatrix.push_back(newRow);
}`.trim()
  },
  ADD_EDGE: {
    title: "C++: Añadir Arista (Matriz Ady.)",
    code: `
// ... (misma declaración de adjMatrix y nodeIdToIndex)

void addEdge(int u_id, int v_id, int weight) {
    if (!nodeIdToIndex.count(u_id) || !nodeIdToIndex.count(v_id)) {
        return; // Error: uno o ambos nodos no existen
    }

    int u_idx = nodeIdToIndex[u_id];
    int v_idx = nodeIdToIndex[v_id];
    
    // Grafo no dirigido
    adjMatrix[u_idx][v_idx] = weight;
    adjMatrix[v_idx][u_idx] = weight;
}`.trim()
  },
  GRAPH_CLEAR: {
      title: "Limpiar Grafo",
      code: `// En C++, esto implicaría llamar a clear()
// adjMatrix.clear();
// nodeIdToIndex.clear();`
  },
  
  RUN_DIJKSTRA: {
    title: "C++: Algoritmo de Dijkstra (STL)",
    code: `
#include <vector>
#include <queue>
#include <map>

// Usando Matriz de Adyacencia
// V es el número de vértices (adjMatrix.size())
// startIdx es el índice del nodo de inicio
void dijkstra(int startIdx, int V) {
    const int INF = 1e9;
    std::vector<int> dist(V, INF);
    dist[startIdx] = 0;

    // Cola de prioridad: {distancia, índice_vértice}
    std::priority_queue<
        std::pair<int, int>,
        std::vector<std::pair<int, int>>,
        std::greater<std::pair<int, int>>
    > pq;
    pq.push({0, startIdx});

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) {
            continue; // Optimización: ya hay un camino mejor
        }

        for (int v = 0; v < V; ++v) {
            int weight = adjMatrix[u][v];
            if (weight != INF && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`.trim()
  },
  RUN_FLOYD_WARSHALL: {
    title: "C++: Algoritmo de Floyd-Warshall",
    code: `
#include <vector>
#include <algorithm> // para std::min

// Usando Matriz de Adyacencia
void floydWarshall() {
    int V = adjMatrix.size();
    // Se asume que dist es una copia de adjMatrix
    std::vector<std::vector<int>> dist = adjMatrix;

    for (int k = 0; k < V; ++k) {
        for (int i = 0; i < V; ++i) {
            for (int j = 0; j < V; ++j) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    dist[i][j] = std::min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
}`.trim()
  },

  RUN_BFS: {
    title: "C++: Recorrido en Anchura (BFS)",
    code: `
#include <iostream>
#include <vector>
#include <queue>
#include <map>

// Usando Matriz de Adyacencia
void bfs(int startNodeId) {
    int startIdx = nodeIdToIndex[startNodeId];
    int V = adjMatrix.size();
    std::vector<bool> visited(V, false);
    std::queue<int> q;

    q.push(startIdx);
    visited[startIdx] = true;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        std::cout << indexToNodeId[u] << " "; // Procesa el nodo

        for (int v = 0; v < V; ++v) {
            if (adjMatrix[u][v] != INF && !visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`.trim()
  },
  RUN_DFS: {
    title: "C++: Recorrido en Profundidad (DFS)",
    code: `
#include <iostream>
#include <vector>
#include <map>

// Usando Matriz de Adyacencia
std::vector<bool> visited;

void dfs(int u) {
    visited[u] = true;
    std::cout << indexToNodeId[u] << " "; // Procesa el nodo

    for (int v = 0; v < adjMatrix.size(); ++v) {
        if (adjMatrix[u][v] != INF && !visited[v]) {
            dfs(v);
        }
    }
}

void run_dfs(int startNodeId) {
    int V = adjMatrix.size();
    visited.assign(V, false);
    int startIdx = nodeIdToIndex[startNodeId];
    dfs(startIdx);
}`.trim()
  },
  RUN_KRUSKAL: {
    title: "C++: Algoritmo de Kruskal (MST)",
    code: `
#include <vector>
#include <algorithm>

struct Edge {
    int u, v, weight;
};

// Estructura Union-Find (DSU)
std::vector<int> parent;
int find_set(int v) {
    if (v == parent[v]) return v;
    return parent[v] = find_set(parent[v]);
}
void unite_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) parent[b] = a;
}

void kruskal() {
    int V = /* número de nodos */;
    std::vector<Edge> edges = /* lista de todas las aristas */;
    std::vector<Edge> mst;
    
    // 1. Ordenar aristas por peso
    std::sort(edges.begin(), edges.end(), 
              [](Edge a, Edge b){ return a.weight < b.weight; });

    // 2. Inicializar DSU
    parent.resize(V);
    for(int i=0; i<V; ++i) parent[i] = i;

    // 3. Iterar sobre aristas ordenadas
    for (Edge e : edges) {
        if (find_set(e.u) != find_set(e.v)) {
            mst.push_back(e);
            unite_sets(e.u, e.v);
        }
    }
}`.trim()
  }
}; 
