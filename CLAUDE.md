# 접점

그린피스 모금가가 미팅 내용을 업무와 개인으로 구분해 체계적으로 기록·관리하는 도구. Orange Build로 만든 입문자 MVP다.

## 스택
Next.js (App Router, TypeScript) · Tailwind CSS v4 · shadcn/ui · Supabase · Vercel · Google Calendar API (OAuth)

## 규칙
- 화면·디자인은 `PLAN.md`를 따른다 — 특히 `## 디자인` 토큰과 각 화면의 `상태:` 명세.
- UI는 `components/ui/`의 shadcn/ui 컴포넌트를 우선 쓴다. 색·모서리는 `app/globals.css`의
  CSS 변수를 따른다.
- `app/globals.css`의 `@import` 줄은 건드리지 않는다 (Tailwind v4 파서가 깨진다). 본문 폰트는
  `app/layout.tsx`에 Noto Sans KR로 설정돼 있다 — 그대로 쓴다.
- URL 경로·slug·DB 키는 ASCII만 쓴다. 한글은 화면 표시용으로만.
- Supabase는 `lib/supabase.ts`의 클라이언트로 읽고 쓴다.
- 구글 캘린더 OAuth 토큰·LLM API 키는 서버 라우트(`app/api/...`)에서만 쓴다 — 브라우저에 노출 금지.
- `PLAN.md`에 없는 화면·기능을 임의로 더하지 않는다.
- `personal_meetings`는 RLS로 `owner_id = auth.uid()`인 행만 보이게 막혀 있다 — 동료 계정에는
  메뉴 자체도 보이지 않게 `profiles.role`로 분기한다.
