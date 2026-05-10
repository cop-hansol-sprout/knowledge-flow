# Knowledge Graph Explorer

GitHub Pages에 배포할 수 있는 정적 React + Vite + TypeScript 데모입니다. 질문 또는 키워드를 입력하면 mock data 기반의 관계 그래프를 React Flow로 시각화하고, 노드와 엣지를 클릭해 설명을 확인할 수 있습니다.

## 주요 기능

- 질문 입력 및 예시 질문 버튼
- React Flow 기반 관계 그래프 시각화
- 노드/엣지 클릭 시 오른쪽 상세 패널 표시
- 판단 흐름 요약 영역
- `src/services/llmGraph.ts`에 임시 OpenAI API 기반 그래프 생성 함수 분리
- API 실패 또는 CORS 문제가 있어도 mock data로 안정 동작

## 실행

```bash
npm install
npm run dev
```

## 임시 OpenAI API 키 설정

로컬 시연에서만 OpenAI API를 사용하려면 `.env.local`에 키를 넣습니다.

```bash
VITE_OPENAI_API_KEY=sk-your-temporary-openai-api-key
VITE_OPENAI_MODEL=gpt-4o-mini
```

`.env.local`은 Git에 올리지 않습니다. GitHub Pages에 키를 넣어 빌드하면 브라우저 번들에 키가 포함될 수 있으므로, 발표 후에는 반드시 해당 키를 폐기하세요.

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

이 저장소는 GitHub Actions로 Pages에 배포하도록 `.github/workflows/pages.yml`을 포함합니다.

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

## 구조

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

## 데모 범위

이 프로젝트는 발표와 실습을 위해 mock graph와 임시 OpenAI 생성 결과를 바탕으로 판단 흐름을 탐색하는 정적 프론트엔드 데모입니다.
