# Knowledge Graph Explorer

질문 또는 키워드를 입력해 관계 그래프를 확인하는 정적 React + Vite + TypeScript 앱입니다. mock data와 OpenAI 기반 생성을 함께 지원하며, 그래프를 클릭해 개별 노드와 관계 설명을 확인할 수 있습니다.

## 주요 기능

- 질문 입력 및 예시 질문 버튼 제공
- React Flow 기반 관계 그래프 시각화
- 노드와 엣지 클릭 시 그래프 아래 상세 패널 표시
- 판단 흐름 요약 영역 제공
- `src/services/llmGraph.ts`에 OpenAI API 기반 그래프 생성 로직 분리
- API 실패 또는 CORS 문제가 있어도 mock data로 안정적으로 동작

## 실행

```bash
npm install
npm run dev
```

## OpenAI 설정

AI 생성을 사용하려면 각 사용자가 자신의 OpenAI API 키를 로컬 환경에 설정합니다.

```bash
VITE_OPENAI_API_KEY=sk-your-temporary-openai-api-key
VITE_OPENAI_MODEL=gpt-4o-mini
```

`.env.local`은 Git에 올리지 않습니다. 테스트가 끝나면 로컬 설정 파일과 API 키를 정리하세요.

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
