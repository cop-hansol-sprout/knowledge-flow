import { Info, MousePointerClick } from 'lucide-react';
import type { SelectedGraphItem } from '../types/graph';

interface DetailPanelProps {
  selectedItem: SelectedGraphItem;
}

function DetailPanel({ selectedItem }: DetailPanelProps) {
  if (!selectedItem) {
    return (
      <aside className="detail-panel empty">
        <MousePointerClick size={22} aria-hidden="true" />
        <h2>노드를 선택하세요</h2>
        <p>그래프의 노드나 관계선을 클릭하면 설명과 관계 유형이 이곳에 표시됩니다.</p>
      </aside>
    );
  }

  if (selectedItem.kind === 'node') {
    return (
      <aside className="detail-panel">
        <span className="panel-kicker">Selected Node</span>
        <h2>{selectedItem.item.label}</h2>
        <div className="tag">{selectedItem.item.type}</div>
        <p>{selectedItem.item.description}</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <span className="panel-kicker">Selected Relation</span>
      <h2>{selectedItem.item.relation}</h2>
      <div className="relation-card">
        <Info size={16} aria-hidden="true" />
        <span>
          {selectedItem.item.source} → {selectedItem.item.target}
        </span>
      </div>
      <p>{selectedItem.item.description}</p>
    </aside>
  );
}

export default DetailPanel;
