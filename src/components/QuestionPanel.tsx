import { FormEvent } from 'react';
import { Bot, Search } from 'lucide-react';
import { mockGraphs } from '../data/mockGraphs';

interface QuestionPanelProps {
  query: string;
  status: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string, options?: { source?: 'mock' | 'ai' }) => void;
}

function QuestionPanel({ query, status, onQueryChange, onSubmit }: QuestionPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(query);
  }

  return (
    <aside className="question-panel">
      <div>
        <span className="panel-kicker">Question</span>
        <h2>질문 또는 키워드</h2>
        <p>
          발표 중에는 예시 질문을 누르면 즉시 안정적인 mock graph가 표시됩니다. AI 생성은
          임시 OpenAI API 키가 있을 때만 동작합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <label htmlFor="question">탐색 질문</label>
        <textarea
          id="question"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="예: 유가 상승이 제조업에 미치는 영향은?"
          rows={5}
        />
        <div className="form-actions">
          <button type="submit" className="primary-button">
            <Search size={16} aria-hidden="true" />
            Mock 탐색
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onSubmit(query, { source: 'ai' })}
          >
            <Bot size={16} aria-hidden="true" />
            AI 생성
          </button>
        </div>
      </form>

      <div className="examples">
        <span className="panel-kicker">Examples</span>
        {mockGraphs.map((graph) => (
          <button
            type="button"
            key={graph.id}
            className="example-button"
            onClick={() => onSubmit(graph.question)}
          >
            {graph.question}
          </button>
        ))}
      </div>

      <div className="status-box" role="status">
        {status}
      </div>
    </aside>
  );
}

export default QuestionPanel;
