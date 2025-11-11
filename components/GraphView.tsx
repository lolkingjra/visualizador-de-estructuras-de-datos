// components/GraphView.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { VisualizationStep, GraphNode, GraphEdge } from '../types';

interface GraphViewProps {
    graphData: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    } | null;
    currentStep: VisualizationStep | null;
}

const NODE_RADIUS = 20;
const ANIMATION_DURATION = 500;

const GraphView: React.FC<GraphViewProps> = ({ graphData, currentStep }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);

    useEffect(() => {
        const updateDimensions = () => { if (containerRef.current) { setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight, }); } };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;
        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);
        svg.selectAll('.links-container').data([null]).join('g').attr('class', 'links-container');
        svg.selectAll('.nodes-container').data([null]).join('g').attr('class', 'nodes-container');
        
        const sim = d3.forceSimulation<GraphNode>()
            .force('link', d3.forceLink<GraphNode, GraphEdge>().id(d => d.id).distance(120))
            .force('charge', d3.forceManyBody().strength(-400))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .on('tick', () => {
                svg.selectAll<SVGLineElement, GraphEdge>('.link').attr('x1', d => (d.source as any).x).attr('y1', d => (d.source as any).y).attr('x2', d => (d.target as any).x).attr('y2', d => (d.target as any).y);
                svg.selectAll<SVGGElement, GraphNode>('.node-group').attr('transform', d => `translate(${d.x = Math.max(NODE_RADIUS, Math.min(width - NODE_RADIUS, d.x!))}, ${d.y = Math.max(NODE_RADIUS, Math.min(height - NODE_RADIUS, d.y!))})`);
            });
        simulationRef.current = sim;
    }, [dimensions]);

    useEffect(() => {
        if (!graphData || !simulationRef.current) return;

        const svg = d3.select(svgRef.current);
        const simulation = simulationRef.current;
        
        simulation.nodes(graphData.nodes);
        simulation.force<d3.ForceLink<GraphNode, GraphEdge>>('link')?.links(graphData.edges);
        
        const link = svg.select('.links-container').selectAll<SVGLineElement, GraphEdge>('line.link').data(graphData.edges, d => `${(d.source as GraphNode).id}-${(d.target as GraphNode).id}`).join('line').attr('class', 'link');
        
        const nodeGroup = svg.select('.nodes-container').selectAll<SVGGElement, GraphNode>('g.node-group').data(graphData.nodes, d => d.id)
            .join(enter => {
                const g = enter.append('g').attr('class', 'node-group');
                g.append('circle').attr('r', NODE_RADIUS);
                g.append('text').text(d => d.value).attr('fill', 'white').attr('stroke', 'none').attr('text-anchor', 'middle').attr('dy', '0.35em').style('pointer-events', 'none').style('font-size', '14px');
                return g;
            });
        
        nodeGroup.call(d3.drag().on('start', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y;
        }).on('drag', (event: any, d: any) => {
            d.fx = Math.max(NODE_RADIUS, Math.min(dimensions.width - NODE_RADIUS, event.x)); d.fy = Math.max(NODE_RADIUS, Math.min(dimensions.height - NODE_RADIUS, event.y));
        }).on('end', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null;
        }) as any);

        const highlightedNodeId = currentStep?.highlightedNodeId;
        const processingNodeId = currentStep?.graphState?.currentProcessingNodeId;
        const highlightedEdge = currentStep?.highlightedEdge;
        const finalPath = currentStep?.graphState?.highlightedPath || [];
        const pathNodeIds = new Set(finalPath);
        const visitedNodes = new Set(currentStep?.graphState?.visitedNodes || []);
        const mstEdges = currentStep?.graphState?.mstEdges || [];
        const mstEdgeSet = new Set(mstEdges.map(e => `${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`));
        
        const isKruskalMode = mstEdges.length > 0 || (currentStep?.explanation.toLowerCase().includes('kruskal'));

        nodeGroup.select('circle').transition().duration(ANIMATION_DURATION)
            .attr('fill', d => {
                if (pathNodeIds.has(d.id)) return '#10b981';
                if (d.id === processingNodeId) return '#eab308';
                if (d.id === highlightedNodeId) return '#f59e0b';
                if (visitedNodes.has(d.id)) return '#52525b';
                return '#2563eb';
            });
        
        // LÓGICA DE ESTILO DE ARISTAS 
        link.transition().duration(ANIMATION_DURATION)
            .attr('stroke', d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;
                const edgeKey = `${Math.min(sourceId, targetId)}-${Math.max(targetId, sourceId)}`;

                if (isKruskalMode && mstEdgeSet.has(edgeKey)) return '#ffffff'; 
                
                let isPathEdge = finalPath.some((nodeId, i) => {
                    if (i === finalPath.length - 1) return false;
                    const nextNodeId = finalPath[i+1];
                    return (nodeId === sourceId && nextNodeId === targetId) || (nodeId === targetId && nextNodeId === sourceId);
                });
                if (isPathEdge) return '#10b981'; 

                if (highlightedEdge && ((highlightedEdge.source === sourceId && highlightedEdge.target === targetId) || (highlightedEdge.source === targetId && highlightedEdge.target === sourceId))) return '#f59e0b'; // 3. Highlighted
                
                return '#999';
            })
            .attr('stroke-width', d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;
                const edgeKey = `${Math.min(sourceId, targetId)}-${Math.max(targetId, sourceId)}`;

                if (isKruskalMode && mstEdgeSet.has(edgeKey)) return 5;

                let isPathEdge = finalPath.some((nodeId, i) => {
                    if (i === finalPath.length - 1) return false;
                    const nextNodeId = finalPath[i+1];
                    return (nodeId === sourceId && nextNodeId === targetId) || (nodeId === targetId && nextNodeId === sourceId);
                });
                if (isPathEdge) return 4;
                
                return 2;
            })
            .attr('stroke-opacity', d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;
                const edgeKey = `${Math.min(sourceId, targetId)}-${Math.max(targetId, sourceId)}`;
                
                if (isKruskalMode && !mstEdgeSet.has(edgeKey)) return 0.1;

                return 1;
            })
            .attr('stroke-dasharray', d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;
                const edgeKey = `${Math.min(sourceId, targetId)}-${Math.max(targetId, sourceId)}`;

                if (isKruskalMode && !mstEdgeSet.has(edgeKey)) return '3, 5';

                return null;
            });

        simulation.alpha(0.3).restart();

    }, [graphData, dimensions, currentStep]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GraphView;