import { useMemo, useState } from 'react';
import { BrainCircuit, Database, GitBranch, Sparkles } from 'lucide-react';
import DetailPanel from './components/DetailPanel';
import GraphCanvas from './components/GraphCanvas';
import QuestionPanel from './components/QuestionPanel';
import ReasoningSummary from './components/ReasoningSummary';
import { defaultGraph, findGraphByQuestion } from './data/mockGraphs';
import { generateGraphWithOpenAI } from './services/llmGraph';
import type { KnowledgeGraph, SelectedGraphItem } from './types/graph';

function App() {
  const [query, setQuery] = useState(defaultGraph.question);
  const [graph, setGraph] = useState<KnowledgeGraph>(defaultGraph);
  const [selectedItem, setSelectedItem] = useState<SelectedGraphItem>({
    kind: 'node',
    item: defaultGraph.nodes[0],
  });
  const [mode, setMode] = useState<'mock' | 'ai'>('mock');
  const [status, setStatus] = useState('Mock graph ready');

  const graphStats = useMemo(
    () => [
      { label: 'Concepts', value: graph.nodes.length },
      { label: 'Relations', value: graph.edges.length },
      { label: 'Mode', value: mode === 'mock' ? 'Mock' : 'AI' },
    ],
    [graph.edges.length, graph.nodes.length, mode],
  );

  async function handleSubmit(
    nextQuery: string,
    options?: { source?: 'mock' | 'ai' },
  ) {
    setQuery(nextQuery);
    setSelectedItem(null);

    if (options?.source === 'ai') {
      setStatus('OpenAI API로 관계 그래프를 생성하는 중입니다...');
      const aiResult = await generateGraphWithOpenAI(nextQuery);

      if (aiResult.graph) {
        setGraph(aiResult.graph);
        setMode('ai');
        setStatus('AI graph generated');
        setSelectedItem({ kind: 'node', item: aiResult.graph.nodes[0] });
        return;
      }

      setStatus(
        `OpenAI 실패: ${aiResult.error ?? '응답을 그래프로 변환하지 못했습니다.'}`,
      );
    } else {
      setStatus('Mock graph loaded');
    }

    const nextGraph = findGraphByQuestion(nextQuery);
    setGraph(nextGraph);
    setMode('mock');
    setSelectedItem({ kind: 'node', item: nextGraph.nodes[0] });
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <GitBranch size={16} aria-hidden="true" />
            Relationship Exploration Lab
          </div>
          <h1>Knowledge Graph 기반 관계 탐색</h1>
          <p>
            질문을 입력하면 핵심 개념과 관계를 그래프로 펼쳐 보고, 어떤 판단
            흐름이 생기는지 확인할 수 있습니다.
          </p>
        </div>
        <div className="hero-metrics" aria-label="현재 그래프 상태">
          {graphStats.map((stat) => (
            <div className="metric" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </header>

      <section className="workspace">
        <QuestionPanel
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          status={status}
        />

        <div className="graph-and-detail">
          <section className="graph-stage" aria-label="관계 그래프">
            <div className="stage-header">
              <div>
                <span className="panel-kicker">Graph Canvas</span>
                <h2>{graph.title}</h2>
              </div>
              <div className="mode-pill">
                {mode === 'mock' ? (
                  <Database size={15} />
                ) : (
                  <Sparkles size={15} />
                )}
                {mode === 'mock' ? 'Mock 안정 모드' : 'OpenAI 생성'}
              </div>
            </div>
            <GraphCanvas
              graph={graph}
              selectedItem={selectedItem}
              onSelect={setSelectedItem}
            />
          </section>

          <DetailPanel selectedItem={selectedItem} />
        </div>
      </section>

      <section className="bottom-row">
        <ReasoningSummary
          summary={graph.summary}
          conclusion={graph.conclusion}
          recommendation={graph.recommendation}
        />
        <aside className="demo-note">
          <BrainCircuit size={20} aria-hidden="true" />
          <div>
            <h2>Demo Scope</h2>
            <p>
              이 화면은 미리 정의된 관계 그래프와 임시 OpenAI 생성 결과를 통해
              판단 흐름을 탐색하는 실습용 화면입니다.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
