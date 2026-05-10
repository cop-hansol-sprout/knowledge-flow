import { Route } from 'lucide-react';

interface ReasoningSummaryProps {
  summary: string;
  conclusion?: string;
  recommendation?: string;
}

function ReasoningSummary({ summary, conclusion, recommendation }: ReasoningSummaryProps) {
  return (
    <section className="reasoning-summary">
      <div className="summary-icon">
        <Route size={22} aria-hidden="true" />
      </div>
      <div>
        <span className="panel-kicker">Reasoning Flow</span>
        <h2>판단 흐름 요약</h2>
        <div className="summary-grid">
          <article>
            <strong>흐름</strong>
            <p>{summary}</p>
          </article>
          <article className="conclusion-box">
            <strong>결론</strong>
            <p>{conclusion ?? '그래프의 주요 관계를 따라 판단 기준을 비교해 보세요.'}</p>
          </article>
          {recommendation ? (
            <article>
              <strong>다음 행동</strong>
              <p>{recommendation}</p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ReasoningSummary;
