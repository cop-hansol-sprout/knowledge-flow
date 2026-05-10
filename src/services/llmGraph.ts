import type { ConceptType, KnowledgeGraph } from '../types/graph';

interface OpenAIGraphResult {
  graph: KnowledgeGraph | null;
  error?: string;
}

interface ResponsesApiResponse {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
}

interface LlmGraphPayload {
  title: string;
  keywords: string[];
  nodes: Array<{
    id: string;
    label: string;
    type: ConceptType;
    description: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    relation: string;
    description: string;
  }>;
  summary: string;
  conclusion: string;
  recommendation: string;
}

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const conceptTypes: ConceptType[] = ['product', 'factor', 'event', 'industry', 'decision', 'concept'];

export async function generateGraphWithOpenAI(question: string): Promise<OpenAIGraphResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const cleanQuestion = question.trim();

  if (!apiKey) {
    return { graph: null, error: 'VITE_OPENAI_API_KEY가 비어 있습니다.' };
  }

  if (!cleanQuestion) {
    return { graph: null, error: '질문을 입력해야 합니다.' };
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        instructions:
          'You create concise knowledge graph data for a Korean classroom demo. Return only JSON that matches the schema. Do not claim to perform hidden reasoning. Focus on concepts, causal/temporal/comparative relations, and decision factors. The summary must explain the reasoning flow. The conclusion must answer the user question directly with a conditional but practical judgement. The recommendation must give one concrete next action.',
        input: `질문: ${cleanQuestion}\n\n이 질문을 판단하거나 이해하는 데 필요한 핵심 개념 6~9개와 관계 6~10개를 만들어줘. label과 description은 한국어 중심으로 작성해줘. id는 영문 kebab-case로 만들어줘.\n\nsummary는 그래프 관계가 어떤 판단 흐름을 만드는지 설명해줘. conclusion은 질문에 대한 결론을 반드시 한 문장으로 답해줘. recommendation은 사용자가 바로 할 수 있는 다음 행동 하나를 제안해줘.`,
        text: {
          format: {
            type: 'json_schema',
            name: 'knowledge_graph',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [
                'title',
                'keywords',
                'nodes',
                'edges',
                'summary',
                'conclusion',
                'recommendation',
              ],
              properties: {
                title: { type: 'string' },
                keywords: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 8,
                  items: { type: 'string' },
                },
                nodes: {
                  type: 'array',
                  minItems: 4,
                  maxItems: 10,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['id', 'label', 'type', 'description'],
                    properties: {
                      id: { type: 'string' },
                      label: { type: 'string' },
                      type: { type: 'string', enum: conceptTypes },
                      description: { type: 'string' },
                    },
                  },
                },
                edges: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 12,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['source', 'target', 'relation', 'description'],
                    properties: {
                      source: { type: 'string' },
                      target: { type: 'string' },
                      relation: { type: 'string' },
                      description: { type: 'string' },
                    },
                  },
                },
                summary: { type: 'string' },
                conclusion: { type: 'string' },
                recommendation: { type: 'string' },
              },
            },
          },
        },
      }),
    });

    const payload = (await response.json()) as ResponsesApiResponse;

    if (!response.ok) {
      return {
        graph: null,
        error: payload.error?.message ?? `OpenAI API 요청 실패: HTTP ${response.status}`,
      };
    }

    const content = extractResponseText(payload);

    if (!content) {
      return { graph: null, error: 'OpenAI 응답에서 JSON 텍스트를 찾지 못했습니다.' };
    }

    return {
      graph: normalizeGraph(JSON.parse(content) as LlmGraphPayload, cleanQuestion),
    };
  } catch (error) {
    return {
      graph: null,
      error: error instanceof Error ? error.message : 'OpenAI API 호출 중 알 수 없는 오류가 발생했습니다.',
    };
  }
}

function extractResponseText(payload: ResponsesApiResponse): string | undefined {
  if (payload.output_text) {
    return payload.output_text;
  }

  return payload.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === 'output_text' || content.text)
    ?.text;
}

function normalizeGraph(payload: LlmGraphPayload, question: string): KnowledgeGraph | null {
  const nodes = payload.nodes.map((node) => ({
    ...node,
    id: normalizeId(node.id || node.label),
    type: conceptTypes.includes(node.type) ? node.type : 'concept',
  }));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = payload.edges
    .map((edge) => ({
      ...edge,
      source: normalizeId(edge.source),
      target: normalizeId(edge.target),
    }))
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  if (nodes.length < 2 || edges.length === 0) {
    return null;
  }

  return {
    id: `llm-${Date.now()}`,
    question,
    title: payload.title || 'AI 생성 관계 그래프',
    keywords: payload.keywords,
    nodes,
    edges,
    summary: payload.summary,
    conclusion: payload.conclusion,
    recommendation: payload.recommendation,
  };
}

function normalizeId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
