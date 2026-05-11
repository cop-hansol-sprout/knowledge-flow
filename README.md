# Knowledge Graph Explorer

질문 또는 키워드를 입력해 관계 그래프를 확인하는 정적 React + Vite + TypeScript 앱입니다. mock data, OpenAI, Atlas 기반 생성을 함께 지원하며, 그래프를 클릭해 개별 노드와 관계 설명을 확인할 수 있습니다.

## 주요 기능

- 질문 입력 및 예시 질문 버튼 제공
- React Flow 기반 관계 그래프 시각화
- 노드와 엣지 클릭 시 그래프 아래 상세 패널 표시
- 판단 흐름 요약 영역 제공
- `src/services/llmGraph.ts`에 OpenAI 및 Atlas API 기반 그래프 생성 로직 분리
- API 실패 또는 CORS 문제가 있어도 mock data로 안정적으로 동작

## 실행

```bash
npm install
npm run dev
```

## LLM 설정

LLM 생성을 사용하려면 각 사용자가 자신의 API 키를 로컬 환경에 설정합니다.

프로젝트 루트에 `.env.local`을 만들고 아래 값을 채웁니다. `.env.local`은 `.gitignore`에 포함되어 있으므로 커밋하지 않습니다.

```bash
VITE_OPENAI_API_KEY=sk-your-temporary-openai-api-key
VITE_OPENAI_MODEL=gpt-4o-mini

VITE_ATLAS_API_BASE=https://ai-atlas.hansol.net/api/v1/public
VITE_ATLAS_API_KEY=sk_live_your-atlas-api-key
VITE_ATLAS_AGENT_ID=your-connected-agent-id
```

`.env.local`은 Git에 올리지 않습니다. 테스트가 끝나면 로컬 설정 파일과 API 키를 정리하세요.

Atlas는 사내망에서만 접속 가능한 API를 가정합니다. `VITE_ATLAS_AGENT_ID`는 API 키에 연결된 agent id를 넣어야 하며, 앱은 세션을 만든 뒤 비스트리밍 메시지 API로 그래프 JSON 생성을 요청합니다.

### Atlas 설정 확인

Atlas 생성 버튼을 사용하려면 다음 값이 필요합니다.

- `VITE_ATLAS_API_BASE`: Atlas public API base URL입니다. `/api/v1/public`까지 포함해야 합니다.
- `VITE_ATLAS_API_KEY`: Atlas에서 발급받은 `sk_live_...` 형식의 API key입니다.
- `VITE_ATLAS_AGENT_ID`: API key에 연결된 agent id입니다.

연결된 agent 목록은 사내망에서 아래 명령으로 확인할 수 있습니다.

```bash
curl https://ai-atlas.hansol.net/api/v1/public/agents \
  -H "x-api-key: sk_live_your-atlas-api-key"
```

응답에서 사용할 agent의 id를 `VITE_ATLAS_AGENT_ID`에 넣습니다. `.env.local`을 수정한 뒤에는 Vite dev server를 재시작해야 변경된 값이 반영됩니다.

Atlas 호출 흐름은 다음과 같습니다.

1. `POST /agents/{AGENT_ID}/sessions`로 세션을 만듭니다.
2. 응답의 session id를 사용해 `POST /agents/{AGENT_ID}/sessions/{SESSION_ID}/messages`로 질문을 보냅니다.
3. Atlas agent가 반환한 JSON을 관계 그래프로 변환합니다.

`Atlas 세션 생성 응답이 JSON이 아닙니다` 오류가 나면 `VITE_ATLAS_API_BASE`가 웹앱 주소만 가리키고 있거나, 사내망/프록시 접속이 API까지 닿지 않은 상태일 수 있습니다. base URL에 `/api/v1/public`이 포함되어 있는지 먼저 확인하세요.

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

이 저장소는 GitHub Actions를 사용해 GitHub Pages로 배포하도록 설정되어 있습니다. 배포 환경에서 OpenAI 키가 필요하면 GitHub Secrets와 Variables를 사용합니다.

1. GitHub repository Settings → Secrets and variables → Actions로 이동합니다.
2. Repository secret에 `OPENAI_API_KEY`를 추가합니다.
3. 필요하면 Repository variable에 `OPENAI_MODEL`을 추가합니다. 기본값은 `gpt-4o-mini`입니다.
4. Settings → Pages → Build and deployment에서 Source를 `GitHub Actions`로 선택합니다.
5. `main` 브랜치에 push하면 자동으로 `dist/`를 빌드해서 Pages에 배포합니다.

Actions workflow는 저장소 이름을 기준으로 Vite `base` path를 자동 설정합니다.

로컬에서 수동 배포하려면 다음 명령을 사용할 수 있습니다.

```bash
VITE_GITHUB_PAGES_BASE=/YOUR_REPOSITORY_NAME/ npm run build
npm run deploy
```

사용자 페이지 저장소처럼 루트 경로에 배포한다면 `VITE_GITHUB_PAGES_BASE=/`를 사용하면 됩니다.

## 프로젝트 구조

```text
src/
  App.tsx
  main.tsx
  components/
    QuestionPanel.tsx
    GraphCanvas.tsx
    DetailPanel.tsx
    ReasoningSummary.tsx
  data/
    mockGraphs.ts
  services/
    llmGraph.ts
  types/
    graph.ts
```

## 사용 안내

- 기본 상태에서는 mock graph로 바로 확인할 수 있습니다.
- AI 생성을 사용하려면 각자 `.env.local`에 개인 키를 넣고 실행하세요.
- 테스트가 끝나면 로컬 키 설정을 제거하고, 저장소에는 키가 남지 않도록 관리하세요.
- GitHub Pages 배포 시에는 Secrets/Variables로 키를 별도로 관리하세요.
