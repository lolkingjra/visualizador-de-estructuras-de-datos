import React, { useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode as BSTNode } from '../types';
import { VisualizationStep } from '../types';
import { NODE_SIZE, ANIMATION_SPEED } from '../constants';

interface TreeViewProps {
    treeData: BSTNode | null;
    currentStep: VisualizationStep | null;
}

interface D3Node extends d3.HierarchyPointNode<BSTNode> {
    x0?: number;
    y0?: number;
}
interface D3Link extends d3.HierarchyPointLink<BSTNode> {
    source: D3Node;
    target: D3Node;
}

const TreeView: React.FC<TreeViewProps> = ({ treeData, currentStep }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { nodes, links, svgHeight } = useMemo(() => {
        if (!treeData) return { nodes: [], links: [], svgHeight: '100%' };

        const root = d3.hierarchy(treeData, d => {
            const children = [];
            if (d.left) children.push(d.left);
            if (d.right) children.push(d.right);
            return children.length > 0 ? children : undefined;
        });

        const depth = root.height;
        const vSpacing = 90;
        const calculatedHeight = (depth + 1) * vSpacing + 60; 

        const width = containerRef.current?.clientWidth || 800;
        const layoutHeight = calculatedHeight - 60;
        
        const treeLayout = d3.tree<BSTNode>().size([width - 80, layoutHeight]);
        const treeRoot = treeLayout(root);

        return { 
            nodes: treeRoot.descendants() as D3Node[], 
            links: treeRoot.links() as D3Link[],
            svgHeight: calculatedHeight
        };
    }, [treeData]);

    const getNodeColor = (nodeId: number): string => {
        if (currentStep?.highlightedNodeId === nodeId) return 'fill-cyan-400';
        if (currentStep?.secondaryHighlightId === nodeId) return 'fill-yellow-400';
        if (currentStep?.pathIds?.includes(nodeId)) return 'fill-indigo-500';
        return 'fill-slate-600';
    };
    
    const getTextColor = (nodeId: number): string => {
        if (currentStep?.highlightedNodeId === nodeId || currentStep?.secondaryHighlightId === nodeId) return 'fill-gray-900 font-bold';
        if (currentStep?.pathIds?.includes(nodeId)) return 'fill-white';
        return 'fill-gray-200';
    };

    return (
        <div ref={containerRef} className="w-full flex-grow relative overflow-auto rounded-lg bg-gray-900/50 border border-gray-700">
            <svg ref={svgRef} className="w-full" style={{ minHeight: '100%', height: `${svgHeight}px` }}>
                <g transform={`translate(40, 60)`}>
                    {links.map((link, i) => (
                        <path
                            key={`link-${i}`}
                            d={d3.linkVertical<any, D3Node>()
                                .x(d => d.x!)
                                .y(d => d.y!)
                                (link as any)!}
                            className="stroke-gray-500 fill-none"
                            style={{ transition: `all ${ANIMATION_SPEED / 1000}s ease` }}
                            strokeWidth={1.5}
                        />
                    ))}
                    {nodes.map(node => (
                        <g key={`node-${node.data.id}`} transform={`translate(${node.x}, ${node.y})`} style={{ transition: `transform ${ANIMATION_SPEED / 1000}s ease` }}>
                            <circle
                                r={NODE_SIZE}
                                className={`${getNodeColor(node.data.id)} stroke-2 stroke-gray-400`}
                                style={{ transition: `fill ${ANIMATION_SPEED / 1000}s ease` }}
                            />
                            <text
                                dy=".35em"
                                textAnchor="middle"
                                className={`${getTextColor(node.data.id)} text-sm select-none`}
                                style={{ transition: `fill ${ANIMATION_SPEED / 1000}s ease` }}
                            >
                                {node.data.value}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default TreeView;