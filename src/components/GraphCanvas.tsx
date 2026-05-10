import { useMemo } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import type { KnowledgeGraph, SelectedGraphItem } from '../types/graph';

interface GraphCanvasProps {
  graph: KnowledgeGraph;
  selectedItem: SelectedGraphItem;
  onSelect: (item: SelectedGraphItem) => void;
}

const nodeColors = {
  product: '#dbeafe',
  factor: '#dcfce7',
  event: '#fee2e2',
  industry: '#fef3c7',
  decision: '#ede9fe',
  concept: '#e0f2fe',
};

function GraphCanvas({ graph, selectedItem, onSelect }: GraphCanvasProps) {
  const nodes = useMemo<Node[]>(
    () =>
      graph.nodes.map((node, index) => {
        const angle = (index / graph.nodes.length) * Math.PI * 2;
        const radius = node.type === 'decision' ? 70 : 210;
        const isSelected = selectedItem?.kind === 'node' && selectedItem.item.id === node.id;

        return {
          id: node.id,
          position: {
            x: 300 + Math.cos(angle) * radius,
            y: 220 + Math.sin(angle) * radius,
          },
          data: { label: node.label },
          style: {
            width: 150,
            minHeight: 54,
            borderRadius: 8,
            border: isSelected ? '2px solid #2563eb' : '1px solid #94a3b8',
            background: nodeColors[node.type],
            color: '#172033',
            fontWeight: 700,
            boxShadow: isSelected
              ? '0 16px 30px rgba(37, 99, 235, 0.18)'
              : '0 10px 24px rgba(15, 23, 42, 0.08)',
          },
        };
      }),
    [graph.nodes, selectedItem],
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((edge) => {
        const isSelected =
          selectedItem?.kind === 'edge' &&
          selectedItem.item.source === edge.source &&
          selectedItem.item.target === edge.target &&
          selectedItem.item.relation === edge.relation;

        return {
          id: `${edge.source}-${edge.target}-${edge.relation}`,
          source: edge.source,
          target: edge.target,
          label: edge.relation,
          animated: isSelected,
          markerEnd: { type: MarkerType.ArrowClosed, color: isSelected ? '#2563eb' : '#64748b' },
          style: {
            stroke: isSelected ? '#2563eb' : '#64748b',
            strokeWidth: isSelected ? 2.6 : 1.6,
          },
          labelStyle: {
            fill: '#334155',
            fontWeight: 700,
            fontSize: 12,
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.9,
          },
        };
      }),
    [graph.edges, selectedItem],
  );

  return (
    <div className="graph-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        onNodeClick={(_, node) => {
          const item = graph.nodes.find((graphNode) => graphNode.id === node.id);
          if (item) {
            onSelect({ kind: 'node', item });
          }
        }}
        onEdgeClick={(_, edge) => {
          const item = graph.edges.find(
            (graphEdge) =>
              `${graphEdge.source}-${graphEdge.target}-${graphEdge.relation}` === edge.id,
          );
          if (item) {
            onSelect({ kind: 'edge', item });
          }
        }}
        onPaneClick={() => onSelect(null)}
      >
        <Background color="#cbd5e1" gap={18} />
        <MiniMap pannable zoomable nodeStrokeWidth={3} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default GraphCanvas;
