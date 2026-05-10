export type ConceptType = 'product' | 'factor' | 'event' | 'industry' | 'decision' | 'concept';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: ConceptType;
  description: string;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: string;
  description: string;
}

export interface KnowledgeGraph {
  id: string;
  question: string;
  title: string;
  keywords: string[];
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  summary: string;
  conclusion?: string;
  recommendation?: string;
}

export type SelectedGraphItem =
  | { kind: 'node'; item: KnowledgeNode }
  | { kind: 'edge'; item: KnowledgeEdge }
  | null;
