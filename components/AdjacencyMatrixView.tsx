import React from "react";
import { GraphNode } from '../types';

interface Props {
  matrix: number[][];
  nodes: GraphNode[];
  highlightedCell?: { row: number; col: number }; 
}
export const AdjacencyMatrixView: React.FC<Props> = ({matrix, nodes, highlightedCell}) => {
    if (!matrix || matrix.length === 0){
    return <div className="matrix-container empty">No hay datos de matriz de adyacencia para mostrar. A;ada nodos para iniciar.</div>;
    }
    return (
        <div className="matrix-container">
            <h3>Matriz de Adyacencia</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {nodes.map((node) => (
                                <th key={node.id}>{node.id}</th>
                            ))}
                        </tr>
                    </thead>
                     <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th>{nodes[i]?.value}</th>
              {row.map((val, j) => {
                const isHighlighted = highlightedCell?.row === i && highlightedCell?.col === j;
                const className = isHighlighted ? 'highlighted' : '';
                return (
                  <td key={j} className={className}>
                    {val === Infinity ? '∞' : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
                </table>
        </div>
    )

}
