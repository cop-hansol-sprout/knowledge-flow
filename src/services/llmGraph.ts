import type { ConceptType, KnowledgeGraph } from '../types/graph';

interface LlmGraphResult {
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

interface AtlasSessionCreateResponse {
  id?: string;
  session?: {
    id?: string;
  };
  data?: {
    id?: string;
    session?: {
      id?: string;
    };
  };
  error?: {
    message?: string;
  };
  message?: string;
}

interface AtlasMessageResponse {
  message?: string;
  error?: {
    message?: string;
  };
}

interface JsonResponseResult<T> {
  data: T | null;
  error?: string;
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
const DEFAULT_ATLAS_API_BASE = 'https://api.example.com/api/v1/public';
const conceptTypes: ConceptType[] = ['product', 'factor', 'event', 'industry', 'decision', 'concept'];

export async function generateGraphWithOpenAI(question: string): Promise<LlmGraphResult> {
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
      graph: parseKnowledgeGraphPayload(content, cleanQuestion),
    };
  } catch (error) {
    return {
      graph: null,
      error: error instanceof Error ? error.message : 'OpenAI API 호출 중 알 수 없는 오류가 발생했습니다.',
    };
  }
}

export async function generateGraphWithAtlas(question: string): Promise<LlmGraphResult> {
  const apiKey = import.meta.env.VITE_ATLAS_API_KEY;
  const agentId = import.meta.env.VITE_ATLAS_AGENT_ID;
  const apiBase = (import.meta.env.VITE_ATLAS_API_BASE || DEFAULT_ATLAS_API_BASE).replace(/\/$/, '');
  const cleanQuestion = question.trim();

  if (!apiKey) {
    return { graph: null, error: 'VITE_ATLAS_API_KEY가 비어 있습니다.' };
  }

  if (!agentId) {
    return { graph: null, error: 'VITE_ATLAS_AGENT_ID가 비어 있습니다.' };
  }

  if (!cleanQuestion) {
    return { graph: null, error: '질문을 입력해야 합니다.' };
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    const sessionResponse = await fetch(`${apiBase}/agents/${agentId}/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title: `Knowledge graph: ${cleanQuestion.slice(0, 50)}` }),
    });
    const sessionResult = await readJsonResponse<AtlasSessionCreateResponse>(
      sessionResponse,
      'Atlas 세션 생성',
    );

    if (!sessionResult.data) {
      return { graph: null, error: sessionResult.error };
    }

    const sessionPayload = sessionResult.data;

    if (!sessionResponse.ok) {
      return {
        graph: null,
        error: sessionPayload.error?.message ?? sessionPayload.message ?? `Atlas 세션 생성 실패: HTTP ${sessionResponse.status}`,
      };
    }

    const sessionId = getAtlasSessionId(sessionPayload);

    if (!sessionId) {
      return {
        graph: null,
        error: `Atlas 세션 응답에서 session id를 찾지 못했습니다. 응답 필드: ${Object.keys(sessionPayload).join(', ') || '없음'}`,
      };
    }

    const messageResponse = await fetch(`${apiBase}/agents/${agentId}/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: buildGraphPrompt(cleanQuestion) }),
    });
    const messageResult = await readJsonResponse<AtlasMessageResponse>(
      messageResponse,
      'Atlas 메시지',
    );

    if (!messageResult.data) {
      return { graph: null, error: messageResult.error };
    }

    const messagePayload = messageResult.data;

    if (!messageResponse.ok) {
      return {
        graph: null,
        error: messagePayload.error?.message ?? messagePayload.message ?? `Atlas 메시지 요청 실패: HTTP ${messageResponse.status}`,
      };
    }

    if (!messagePayload.message) {
      return { graph: null, error: 'Atlas 응답에서 message를 찾지 못했습니다.' };
    }

    return {
      graph: parseKnowledgeGraphPayload(messagePayload.message, cleanQuestion),
    };
  } catch (error) {
    return {
      graph: null,
      error: error instanceof Error ? error.message : 'Atlas API 호출 중 알 수 없는 오류가 발생했습니다.',
    };
  }
}

function getAtlasSessionId(payload: AtlasSessionCreateResponse): string | undefined {
  return payload.session?.id ?? payload.data?.session?.id ?? payload.data?.id ?? payload.id;
}

async function readJsonResponse<T>(
  response: Response,
  label: string,
): Promise<JsonResponseResult<T>> {
  const text = await response.text();

  if (!text.trim()) {
    return { data: null, error: `${label} 응답이 비어 있습니다. HTTP ${response.status}` };
  }

  try {
    return { data: JSON.parse(text) as T };
  } catch {
    return {
      data: null,
      error: `${label} 응답이 JSON이 아닙니다. HTTP ${response.status}. API base URL, 사내망 접속, 프록시/인증 페이지 여부를 확인하세요. 응답 시작: ${text.trim().slice(0, 80)}`,
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

function buildGraphPrompt(question: string): string {
  return `질문: ${question}

아래 TypeScript 타입에 맞는 JSON만 응답해줘. 설명 문장, markdown, 코드블록은 붙이지 마.

type KnowledgeGraphPayload = {
  title: string;
  keywords: string[];
  nodes: Array<{
    id: string;
    label: string;
    type: 'product' | 'factor' | 'event' | 'industry' | 'decision' | 'concept';
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
};

조건:
- 핵심 개념 6~9개, 관계 6~10개를 만들어줘.
- id, source, target은 영문 kebab-case로 맞춰줘.
- label, description, summary, conclusion, recommendation은 한국어로 작성해줘.
- summary는 그래프 관계가 어떤 판단 흐름을 만드는지 설명해줘.
- conclusion은 질문에 대한 결론을 한 문장으로 답해줘.
- recommendation은 사용자가 바로 할 수 있는 다음 행동 하나를 제안해줘.`;
}

function parseKnowledgeGraphPayload(content: string, question: string): KnowledgeGraph | null {
  const jsonText = extractJsonText(content);
  return normalizeGraph(JSON.parse(jsonText) as LlmGraphPayload, question);
}

function extractJsonText(content: string): string {
  const trimmed = content.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');

  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
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
