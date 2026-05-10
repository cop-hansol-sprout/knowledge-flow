import type { KnowledgeGraph } from '../types/graph';

export const mockGraphs: KnowledgeGraph[] = [
  {
    id: 'iphone-upgrade',
    question: '아이폰17을 지금 사는 게 합리적일까?',
    title: '아이폰 교체 의사결정 그래프',
    keywords: ['아이폰', 'iphone', '구매', '배터리', '감가상각', '출시'],
    nodes: [
      {
        id: 'iphone-13-mini',
        label: 'iPhone 13 mini',
        type: 'product',
        description: '현재 보유 기기로 가정한 소형 아이폰입니다. 사용 기간이 길어질수록 배터리와 성능 체감이 구매 판단에 영향을 줍니다.',
      },
      {
        id: 'iphone-17',
        label: 'iPhone 17',
        type: 'product',
        description: '구매 후보가 되는 새 모델입니다. 출시 직후에는 가격 방어가 강하지만 다음 세대가 가까워질수록 감가상각 리스크가 커질 수 있습니다.',
      },
      {
        id: 'iphone-18',
        label: 'iPhone 18',
        type: 'product',
        description: '다음 세대로 예상되는 모델입니다. 기다릴 때 얻을 수 있는 성능 개선과 기회비용을 비교하는 기준점입니다.',
      },
      {
        id: 'release-cycle',
        label: '출시 주기',
        type: 'factor',
        description: '스마트폰 신제품이 반복적으로 공개되는 시간 패턴입니다. 구매 시점을 늦출지 결정할 때 중요한 맥락입니다.',
      },
      {
        id: 'depreciation',
        label: '감가상각',
        type: 'factor',
        description: '새 제품 구매 후 시간이 지나며 중고 가치가 하락하는 현상입니다. 총소유비용을 판단할 때 고려합니다.',
      },
      {
        id: 'battery-health',
        label: '배터리 성능',
        type: 'factor',
        description: '현재 기기를 계속 써도 되는지 결정하는 가장 직접적인 체감 지표입니다.',
      },
      {
        id: 'purchase-rationality',
        label: '구매 합리성',
        type: 'decision',
        description: '필요성, 비용, 기다림의 가치, 현재 기기의 불편함을 함께 본 최종 판단 지점입니다.',
      },
    ],
    edges: [
      {
        source: 'iphone-13-mini',
        target: 'battery-health',
        relation: 'affected_by',
        description: '오래 사용한 iPhone 13 mini는 배터리 성능 저하의 영향을 받습니다.',
      },
      {
        source: 'iphone-17',
        target: 'iphone-18',
        relation: 'followed_by',
        description: 'iPhone 17 이후 다음 세대인 iPhone 18이 출시될 가능성을 고려합니다.',
      },
      {
        source: 'iphone-18',
        target: 'release-cycle',
        relation: 'expected_by',
        description: 'iPhone 18의 등장은 일반적인 출시 주기 예측과 연결됩니다.',
      },
      {
        source: 'iphone-17',
        target: 'depreciation',
        relation: 'affected_by',
        description: '새 모델 구매 시점과 다음 세대 출시 시점은 감가상각에 영향을 줍니다.',
      },
      {
        source: 'depreciation',
        target: 'purchase-rationality',
        relation: 'affects',
        description: '감가상각이 크면 지금 구매의 경제성이 낮아질 수 있습니다.',
      },
      {
        source: 'battery-health',
        target: 'purchase-rationality',
        relation: 'affects',
        description: '배터리 불편이 크면 교체의 합리성이 높아집니다.',
      },
    ],
    summary:
      '현재 기기의 배터리 불편이 크면 즉시 구매 쪽으로 판단이 기울고, 불편이 작다면 다음 출시 주기와 감가상각을 비교해 기다림의 가치를 검토하는 흐름이 생깁니다.',
    conclusion:
      '배터리 불편이 크고 현재 가격을 감당할 수 있다면 iPhone 17 구매는 합리적이지만, 불편이 작다면 다음 출시 주기까지 기다리는 편이 더 합리적입니다.',
    recommendation: '배터리 성능, 현재 중고가, 예상 사용 기간을 먼저 확인해 총소유비용을 비교하세요.',
  },
  {
    id: 'oil-manufacturing',
    question: '유가 상승이 제조업에 미치는 영향은?',
    title: '유가와 제조업 비용 구조 그래프',
    keywords: ['유가', '제조업', '원가', '물류', '인플레이션'],
    nodes: [
      {
        id: 'oil-price',
        label: '유가 상승',
        type: 'event',
        description: '원유 가격 상승은 에너지 비용과 석유 기반 원자재 가격을 동시에 밀어 올릴 수 있습니다.',
      },
      {
        id: 'energy-cost',
        label: '에너지 비용',
        type: 'factor',
        description: '공장 가동, 냉난방, 설비 운영에 들어가는 비용입니다.',
      },
      {
        id: 'logistics-cost',
        label: '물류비',
        type: 'factor',
        description: '운송 연료비와 배송 단가에 영향을 받는 비용 항목입니다.',
      },
      {
        id: 'raw-material',
        label: '원자재 가격',
        type: 'factor',
        description: '플라스틱, 화학 소재처럼 원유와 연결된 투입재 가격입니다.',
      },
      {
        id: 'production-cost',
        label: '생산 원가',
        type: 'factor',
        description: '제품을 만드는 데 필요한 총비용입니다.',
      },
      {
        id: 'margin',
        label: '영업 마진',
        type: 'decision',
        description: '매출에서 비용을 뺀 수익성 지표입니다. 원가 상승을 가격에 전가하지 못하면 악화됩니다.',
      },
      {
        id: 'price-transfer',
        label: '가격 전가',
        type: 'decision',
        description: '상승한 비용을 판매 가격에 반영하는 전략입니다.',
      },
    ],
    edges: [
      {
        source: 'oil-price',
        target: 'energy-cost',
        relation: 'raises',
        description: '유가 상승은 전력과 연료 사용 비용을 증가시킬 수 있습니다.',
      },
      {
        source: 'oil-price',
        target: 'logistics-cost',
        relation: 'raises',
        description: '운송 연료비 상승은 물류비를 높입니다.',
      },
      {
        source: 'oil-price',
        target: 'raw-material',
        relation: 'raises',
        description: '석유화학 기반 원자재 가격이 함께 오를 수 있습니다.',
      },
      {
        source: 'energy-cost',
        target: 'production-cost',
        relation: 'affects',
        description: '에너지 비용 증가는 생산 원가를 올립니다.',
      },
      {
        source: 'logistics-cost',
        target: 'production-cost',
        relation: 'affects',
        description: '물류비 증가는 제품 공급 비용에 반영됩니다.',
      },
      {
        source: 'raw-material',
        target: 'production-cost',
        relation: 'affects',
        description: '원자재 가격 상승은 생산 원가의 핵심 압박 요인입니다.',
      },
      {
        source: 'production-cost',
        target: 'margin',
        relation: 'reduces',
        description: '생산 원가가 오르면 가격을 올리지 않는 한 영업 마진이 줄어듭니다.',
      },
      {
        source: 'production-cost',
        target: 'price-transfer',
        relation: 'requires',
        description: '원가 상승은 가격 전가 여부를 검토하게 만듭니다.',
      },
    ],
    summary:
      '유가 상승은 에너지, 물류, 원자재 경로로 생산 원가를 압박합니다. 따라서 제조업 영향은 원가 상승 폭과 가격 전가 가능성을 함께 봐야 판단할 수 있습니다.',
    conclusion:
      '유가 상승은 제조업 수익성에 대체로 부정적이며, 가격 전가력이 약한 기업일수록 타격이 큽니다.',
    recommendation: '분석 대상 기업의 에너지 사용 비중과 가격 전가 가능성을 먼저 확인하세요.',
  },
  {
    id: 'remote-work-productivity',
    question: '재택근무는 생산성을 높일까?',
    title: '재택근무 생산성 판단 그래프',
    keywords: ['재택근무', '생산성', '협업', '몰입', '출퇴근'],
    nodes: [
      {
        id: 'remote-work',
        label: '재택근무',
        type: 'concept',
        description: '사무실이 아닌 장소에서 업무를 수행하는 방식입니다.',
      },
      {
        id: 'commute-time',
        label: '출퇴근 시간',
        type: 'factor',
        description: '이동에 쓰는 시간과 피로도입니다. 재택근무에서는 크게 줄어듭니다.',
      },
      {
        id: 'focus-time',
        label: '몰입 시간',
        type: 'factor',
        description: '방해 없이 깊게 일할 수 있는 시간입니다.',
      },
      {
        id: 'communication',
        label: '커뮤니케이션 비용',
        type: 'factor',
        description: '정보 공유, 회의, 문맥 전달에 필요한 노력입니다.',
      },
      {
        id: 'team-alignment',
        label: '팀 정렬',
        type: 'factor',
        description: '팀원이 같은 우선순위와 맥락을 공유하는 정도입니다.',
      },
      {
        id: 'productivity',
        label: '생산성',
        type: 'decision',
        description: '성과를 내는 속도와 품질을 함께 본 결과 지표입니다.',
      },
    ],
    edges: [
      {
        source: 'remote-work',
        target: 'commute-time',
        relation: 'reduces',
        description: '재택근무는 출퇴근 시간을 줄입니다.',
      },
      {
        source: 'commute-time',
        target: 'focus-time',
        relation: 'frees',
        description: '줄어든 이동 시간은 몰입 가능한 시간으로 전환될 수 있습니다.',
      },
      {
        source: 'focus-time',
        target: 'productivity',
        relation: 'improves',
        description: '몰입 시간이 늘면 개인 생산성이 높아질 수 있습니다.',
      },
      {
        source: 'remote-work',
        target: 'communication',
        relation: 'can_raise',
        description: '비대면 환경에서는 문맥 공유와 의사결정 비용이 증가할 수 있습니다.',
      },
      {
        source: 'communication',
        target: 'team-alignment',
        relation: 'weakens',
        description: '커뮤니케이션 비용이 높아지면 팀 정렬이 약해질 수 있습니다.',
      },
      {
        source: 'team-alignment',
        target: 'productivity',
        relation: 'affects',
        description: '팀 정렬은 협업 생산성에 직접 영향을 줍니다.',
      },
    ],
    summary:
      '재택근무의 생산성은 출퇴근 시간 감소와 몰입 시간 증가라는 이점, 커뮤니케이션 비용과 팀 정렬 약화라는 비용을 비교해 판단하는 구조입니다.',
    conclusion:
      '업무가 개인 몰입 중심이면 재택근무는 생산성을 높일 가능성이 크고, 실시간 협업 비중이 높으면 혼합근무가 더 적합합니다.',
    recommendation: '업무를 개인 몰입형과 협업형으로 나눠 재택 비율을 다르게 설계하세요.',
  },
  {
    id: 'ai-education',
    question: '생성형 AI는 학습에 도움이 될까?',
    title: 'AI 학습 지원 효과 그래프',
    keywords: ['생성형 ai', 'ai', '학습', '교육', '피드백'],
    nodes: [
      {
        id: 'gen-ai',
        label: '생성형 AI',
        type: 'concept',
        description: '질문에 답하고 예시를 만들며 학습 과정을 보조하는 도구입니다.',
      },
      {
        id: 'instant-feedback',
        label: '즉시 피드백',
        type: 'factor',
        description: '학습자가 바로 설명과 수정 방향을 받을 수 있는 특성입니다.',
      },
      {
        id: 'personalization',
        label: '개인화 설명',
        type: 'factor',
        description: '학습자의 수준과 관심사에 맞춰 설명을 조절하는 방식입니다.',
      },
      {
        id: 'overreliance',
        label: '의존성',
        type: 'factor',
        description: '스스로 사고하기보다 답변에 지나치게 기대는 위험입니다.',
      },
      {
        id: 'critical-thinking',
        label: '비판적 사고',
        type: 'factor',
        description: '답변의 타당성을 검토하고 근거를 확인하는 능력입니다.',
      },
      {
        id: 'learning-outcome',
        label: '학습 효과',
        type: 'decision',
        description: '이해도, 기억, 적용 능력으로 본 최종 학습 결과입니다.',
      },
    ],
    edges: [
      {
        source: 'gen-ai',
        target: 'instant-feedback',
        relation: 'enables',
        description: '생성형 AI는 질문에 빠르게 반응해 즉시 피드백을 제공합니다.',
      },
      {
        source: 'gen-ai',
        target: 'personalization',
        relation: 'enables',
        description: '학습자의 배경에 맞춘 설명을 만들 수 있습니다.',
      },
      {
        source: 'instant-feedback',
        target: 'learning-outcome',
        relation: 'improves',
        description: '빠른 피드백은 오류 수정을 돕고 학습 흐름을 유지합니다.',
      },
      {
        source: 'personalization',
        target: 'learning-outcome',
        relation: 'improves',
        description: '개인화 설명은 이해 장벽을 낮출 수 있습니다.',
      },
      {
        source: 'gen-ai',
        target: 'overreliance',
        relation: 'can_cause',
        description: 'AI 답변을 그대로 받아들이면 의존성이 생길 수 있습니다.',
      },
      {
        source: 'overreliance',
        target: 'critical-thinking',
        relation: 'reduces',
        description: '의존성이 커지면 비판적 사고 훈련이 줄어들 수 있습니다.',
      },
      {
        source: 'critical-thinking',
        target: 'learning-outcome',
        relation: 'affects',
        description: '비판적 사고는 AI를 학습 도구로 건강하게 쓰는 핵심 조건입니다.',
      },
    ],
    summary:
      '생성형 AI는 즉시 피드백과 개인화 설명으로 학습을 도울 수 있지만, 의존성이 커지면 비판적 사고가 약해질 수 있어 검증 습관이 함께 필요합니다.',
    conclusion:
      '생성형 AI는 검증과 자기 설명을 함께 요구할 때 학습에 도움이 되지만, 답만 받아쓰면 학습 효과가 떨어질 수 있습니다.',
    recommendation: 'AI 답변을 받은 뒤 근거 확인과 자기 말로 재설명하는 단계를 과제에 포함하세요.',
  },
  {
    id: 'presentation-prep',
    question: '내일 회의 발표인데 준비를 내일 아침에 해도 될까?',
    title: '발표 준비 시점 판단 그래프',
    keywords: ['발표', '회의', '준비', '내일', '아침', '시간관리'],
    nodes: [
      {
        id: 'presentation',
        label: '회의 발표',
        type: 'event',
        description: '정해진 시간에 내용을 전달하고 질문에 대응해야 하는 업무 이벤트입니다.',
      },
      {
        id: 'prep-time',
        label: '준비 시간',
        type: 'factor',
        description: '자료 정리, 흐름 점검, 예상 질문 준비에 필요한 시간입니다.',
      },
      {
        id: 'morning-condition',
        label: '아침 컨디션',
        type: 'factor',
        description: '집중력과 돌발 상황 대응력을 좌우하는 당일 상태입니다.',
      },
      {
        id: 'unexpected-issues',
        label: '돌발 변수',
        type: 'factor',
        description: '회의 일정 변경, 자료 오류, 이동 지연처럼 당일에 생길 수 있는 변수입니다.',
      },
      {
        id: 'storyline',
        label: '발표 흐름',
        type: 'factor',
        description: '핵심 메시지와 근거가 자연스럽게 이어지는 발표 구조입니다.',
      },
      {
        id: 'confidence',
        label: '발표 자신감',
        type: 'factor',
        description: '준비 정도에 따라 발표 중 말의 안정성과 대응력이 달라집니다.',
      },
      {
        id: 'decision',
        label: '준비 시점 결정',
        type: 'decision',
        description: '오늘 저녁에 일부 준비할지, 내일 아침에 몰아서 할지 정하는 판단입니다.',
      },
    ],
    edges: [
      {
        source: 'presentation',
        target: 'prep-time',
        relation: 'requires',
        description: '회의 발표는 일정 수준 이상의 준비 시간을 요구합니다.',
      },
      {
        source: 'prep-time',
        target: 'storyline',
        relation: 'improves',
        description: '충분한 준비 시간은 발표 흐름을 더 명확하게 만듭니다.',
      },
      {
        source: 'morning-condition',
        target: 'prep-time',
        relation: 'affects',
        description: '아침 컨디션이 나쁘면 계획한 준비 시간을 제대로 쓰기 어렵습니다.',
      },
      {
        source: 'unexpected-issues',
        target: 'decision',
        relation: 'raises_risk',
        description: '돌발 변수가 많을수록 내일 아침에 몰아 준비하는 위험이 커집니다.',
      },
      {
        source: 'storyline',
        target: 'confidence',
        relation: 'supports',
        description: '발표 흐름이 잡히면 자신감과 질의응답 대응력이 좋아집니다.',
      },
      {
        source: 'confidence',
        target: 'decision',
        relation: 'affects',
        description: '자신감이 낮으면 최소한의 리허설을 오늘 해두는 편이 유리합니다.',
      },
    ],
    summary:
      '발표 준비는 준비 시간, 당일 컨디션, 돌발 변수, 발표 흐름이 함께 연결됩니다. 내일 아침만 믿으면 변수에 취약하고, 오늘 일부라도 흐름을 잡으면 안정성이 올라갑니다.',
    conclusion:
      '자료가 거의 완성된 상태가 아니라면 내일 아침에 전부 준비하는 것은 위험하고, 오늘 최소한 발표 흐름과 핵심 메시지는 잡아두는 편이 합리적입니다.',
    recommendation: '오늘 30분만 써서 목차, 핵심 메시지 3개, 예상 질문 2개를 먼저 적어두세요.',
  },
  {
    id: 'coffee-sleep',
    question: '밤에 커피를 마시면 내일 집중력에 도움이 될까?',
    title: '밤 커피와 다음날 집중력 판단 그래프',
    keywords: ['밤에 커피', '커피', '카페인', '수면', '집중력', '밤', '내일 집중력'],
    nodes: [
      {
        id: 'night-coffee',
        label: '밤 커피',
        type: 'event',
        description: '늦은 시간에 카페인을 섭취해 당장 졸림을 줄이려는 선택입니다.',
      },
      {
        id: 'short-term-alertness',
        label: '단기 각성',
        type: 'factor',
        description: '커피를 마신 직후 졸림이 줄고 잠깐 집중이 쉬워지는 효과입니다.',
      },
      {
        id: 'sleep-quality',
        label: '수면 질',
        type: 'factor',
        description: '잠드는 속도, 깊은 잠, 중간 각성 여부를 포함한 회복 지표입니다.',
      },
      {
        id: 'sleep-debt',
        label: '수면 부족',
        type: 'factor',
        description: '수면 시간이 줄거나 질이 낮아져 다음날 회복이 덜 된 상태입니다.',
      },
      {
        id: 'tomorrow-focus',
        label: '내일 집중력',
        type: 'factor',
        description: '다음날 업무나 학습에 몰입할 수 있는 능력입니다.',
      },
      {
        id: 'urgent-deadline',
        label: '긴급 마감',
        type: 'factor',
        description: '오늘 밤에 반드시 끝내야 하는 일이 있는지의 정도입니다.',
      },
      {
        id: 'non-caffeine-options',
        label: '대안 행동',
        type: 'factor',
        description: '짧은 휴식, 물 마시기, 작업 범위 줄이기처럼 수면을 덜 해치는 대안입니다.',
      },
      {
        id: 'coffee-decision',
        label: '커피 선택',
        type: 'decision',
        description: '밤에 커피를 마시는 것이 내일 집중력 관점에서 합리적인지 판단하는 지점입니다.',
      },
    ],
    edges: [
      {
        source: 'night-coffee',
        target: 'short-term-alertness',
        relation: 'increases',
        description: '밤 커피는 당장의 졸림을 줄이고 단기 각성을 높입니다.',
      },
      {
        source: 'night-coffee',
        target: 'sleep-quality',
        relation: 'can_reduce',
        description: '늦은 카페인은 잠들기 어렵게 하거나 수면 깊이를 낮출 수 있습니다.',
      },
      {
        source: 'sleep-quality',
        target: 'sleep-debt',
        relation: 'affects',
        description: '수면 질이 낮아지면 수면 부족과 피로가 커집니다.',
      },
      {
        source: 'sleep-debt',
        target: 'tomorrow-focus',
        relation: 'reduces',
        description: '수면 부족은 다음날 집중력을 떨어뜨릴 가능성이 큽니다.',
      },
      {
        source: 'short-term-alertness',
        target: 'coffee-decision',
        relation: 'supports_only_if_urgent',
        description: '단기 각성 효과는 오늘 반드시 끝낼 일이 있을 때만 커피 선택을 일부 정당화합니다.',
      },
      {
        source: 'urgent-deadline',
        target: 'coffee-decision',
        relation: 'may_justify',
        description: '긴급 마감이 있으면 내일 컨디션보다 오늘 처리의 가치가 커질 수 있습니다.',
      },
      {
        source: 'tomorrow-focus',
        target: 'coffee-decision',
        relation: 'discourages',
        description: '내일 집중력이 더 중요하다면 밤 커피 선택은 불리합니다.',
      },
      {
        source: 'non-caffeine-options',
        target: 'coffee-decision',
        relation: 'alternative_to',
        description: '대안 행동이 가능하면 커피 없이 오늘 할 일을 줄이고 수면을 지키는 편이 낫습니다.',
      },
    ],
    summary:
      '밤 커피는 단기 각성을 높이지만 수면 질을 낮춰 수면 부족과 다음날 집중력 저하로 이어질 수 있습니다. 긴급 마감이 있는지와 대안 행동이 가능한지가 최종 판단을 가릅니다.',
    conclusion:
      '내일 집중력이 중요하다면 밤 커피는 대체로 도움이 되지 않으며, 오늘 반드시 끝내야 하는 긴급 마감이 있을 때만 예외적으로 고려할 만합니다.',
    recommendation: '커피 대신 물을 마시고 20분만 핵심 작업을 줄인 뒤, 수면 시간을 확보하는 쪽을 우선하세요.',
  },
  {
    id: 'subscription-pricing',
    question: '구독 서비스 가격을 올려도 고객 이탈이 적을까?',
    title: '구독 가격 인상 판단 그래프',
    keywords: ['구독', '가격', '고객 이탈', '가격 인상', '서비스'],
    nodes: [
      {
        id: 'price-increase',
        label: '가격 인상',
        type: 'event',
        description: '구독료를 현재보다 높이는 정책 변화입니다.',
      },
      {
        id: 'perceived-value',
        label: '체감 가치',
        type: 'factor',
        description: '고객이 가격 대비 서비스에서 얻는 효용입니다.',
      },
      {
        id: 'switching-cost',
        label: '전환 비용',
        type: 'factor',
        description: '다른 서비스로 옮길 때 드는 시간, 학습, 데이터 이전 비용입니다.',
      },
      {
        id: 'competitor-price',
        label: '경쟁사 가격',
        type: 'factor',
        description: '고객이 비교할 수 있는 대체 서비스의 가격 수준입니다.',
      },
      {
        id: 'churn-risk',
        label: '고객 이탈 위험',
        type: 'decision',
        description: '가격 인상 후 해지하거나 경쟁사로 이동할 가능성입니다.',
      },
      {
        id: 'communication',
        label: '고객 커뮤니케이션',
        type: 'factor',
        description: '가격 인상 이유와 추가 가치를 설명하는 방식입니다.',
      },
      {
        id: 'revenue',
        label: '매출',
        type: 'decision',
        description: '가격과 고객 수를 함께 반영한 결과 지표입니다.',
      },
    ],
    edges: [
      {
        source: 'price-increase',
        target: 'churn-risk',
        relation: 'raises',
        description: '가격 인상은 고객 이탈 위험을 높일 수 있습니다.',
      },
      {
        source: 'perceived-value',
        target: 'churn-risk',
        relation: 'reduces',
        description: '체감 가치가 높으면 가격 인상에도 이탈이 줄어듭니다.',
      },
      {
        source: 'switching-cost',
        target: 'churn-risk',
        relation: 'reduces',
        description: '전환 비용이 크면 고객은 쉽게 떠나지 않습니다.',
      },
      {
        source: 'competitor-price',
        target: 'churn-risk',
        relation: 'affects',
        description: '경쟁사 가격이 낮으면 이탈 위험이 커집니다.',
      },
      {
        source: 'communication',
        target: 'perceived-value',
        relation: 'supports',
        description: '명확한 커뮤니케이션은 고객이 인상 이유와 가치를 이해하도록 돕습니다.',
      },
      {
        source: 'churn-risk',
        target: 'revenue',
        relation: 'affects',
        description: '이탈이 커지면 가격을 올려도 매출 개선이 제한될 수 있습니다.',
      },
    ],
    summary:
      '가격 인상은 이탈 위험을 높이지만, 체감 가치와 전환 비용이 높고 고객 커뮤니케이션이 명확하면 이탈을 줄일 수 있습니다. 경쟁사 가격은 고객 비교 기준으로 작동합니다.',
    conclusion:
      '고객이 느끼는 가치가 충분하고 대체 서비스로 옮기는 비용이 높다면 가격 인상 후 이탈은 제한적일 가능성이 큽니다.',
    recommendation: '전체 인상 전에 충성 고객군과 가격 민감 고객군을 나눠 소규모 테스트를 먼저 진행하세요.',
  },
  {
    id: 'used-ev',
    question: '중고 전기차를 지금 사도 괜찮을까?',
    title: '중고 전기차 구매 판단 그래프',
    keywords: ['전기차', '중고차', '배터리', '충전', '구매'],
    nodes: [
      {
        id: 'used-ev',
        label: '중고 전기차',
        type: 'product',
        description: '이미 사용 이력이 있는 전기차 구매 후보입니다.',
      },
      {
        id: 'battery-degradation',
        label: '배터리 열화',
        type: 'factor',
        description: '사용 기간과 충전 습관에 따라 배터리 용량이 줄어드는 현상입니다.',
      },
      {
        id: 'charging-access',
        label: '충전 접근성',
        type: 'factor',
        description: '집, 회사, 생활권에서 충전이 가능한 정도입니다.',
      },
      {
        id: 'maintenance-cost',
        label: '유지비',
        type: 'factor',
        description: '연료비, 정비비, 보험료 등을 포함한 운용 비용입니다.',
      },
      {
        id: 'subsidy-policy',
        label: '보조금 정책',
        type: 'factor',
        description: '전기차 구매와 운행 비용에 영향을 주는 정책 조건입니다.',
      },
      {
        id: 'resale-value',
        label: '잔존 가치',
        type: 'factor',
        description: '나중에 되팔 때 받을 수 있는 예상 가격입니다.',
      },
      {
        id: 'purchase-fit',
        label: '구매 적합성',
        type: 'decision',
        description: '생활 패턴과 비용 조건을 종합해 구매해도 되는지 판단하는 지점입니다.',
      },
    ],
    edges: [
      {
        source: 'used-ev',
        target: 'battery-degradation',
        relation: 'affected_by',
        description: '중고 전기차는 배터리 상태 확인이 중요합니다.',
      },
      {
        source: 'battery-degradation',
        target: 'resale-value',
        relation: 'reduces',
        description: '배터리 열화가 심하면 잔존 가치가 떨어집니다.',
      },
      {
        source: 'charging-access',
        target: 'purchase-fit',
        relation: 'affects',
        description: '충전 접근성이 낮으면 전기차 사용 편의성이 크게 떨어집니다.',
      },
      {
        source: 'maintenance-cost',
        target: 'purchase-fit',
        relation: 'affects',
        description: '유지비 절감 폭은 구매 적합성을 높일 수 있습니다.',
      },
      {
        source: 'subsidy-policy',
        target: 'maintenance-cost',
        relation: 'affects',
        description: '정책 혜택은 총비용 계산에 영향을 줍니다.',
      },
      {
        source: 'resale-value',
        target: 'purchase-fit',
        relation: 'affects',
        description: '잔존 가치는 중고 전기차의 경제성을 좌우합니다.',
      },
    ],
    summary:
      '중고 전기차 구매는 배터리 열화, 충전 접근성, 유지비, 보조금, 잔존 가치가 연결된 판단입니다. 싸게 사는 것보다 생활권에서 편하게 충전하고 배터리 상태가 검증되는지가 중요합니다.',
    conclusion:
      '충전 환경이 안정적이고 배터리 진단 결과가 양호하다면 중고 전기차 구매는 괜찮지만, 둘 중 하나라도 불확실하면 신중해야 합니다.',
    recommendation: '구매 전 배터리 진단서, 실제 주행 가능 거리, 집이나 회사 충전 가능 여부를 먼저 확인하세요.',
  },
];

export const defaultGraph = mockGraphs[0];

export function findGraphByQuestion(query: string): KnowledgeGraph {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return defaultGraph;
  }

  return (
    mockGraphs.find((graph) =>
      [graph.question, graph.title, ...graph.keywords].some((term) =>
        normalized.includes(term.toLowerCase()),
      ),
    ) ?? defaultGraph
  );
}
