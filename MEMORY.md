# 접점 — 만들기 기록

이 파일은 "접점"을 어떤 과정으로 만들었는지 남기는 기록입니다. 나중에 복기하거나 수업 사례로 쓸 수 있게, 결정의 이유와 막혔다 푼 과정을 구체적으로 적습니다.

## 기획 (2026-06-20)

**무엇을 / 누구를 위해**
그린피스 모금가인 사용자가 매일 만나는 사람들과의 미팅 내용을 업무(모금·기부자·전략회의)와 개인으로 구분해 기록·관리하는 CRM 스타일 웹앱. 만든 사람 본인이 첫 사용자이고, 업무미팅 기록은 초대받은 동료와도 공유한다.

**왜 이렇게 정했나**
- 지금은 메모앱/노트에 텍스트로만 기록하고 있어 나중에 찾기 어렵고, 특히 "다음에 이거 해야 한다"는 후속작업을 놓치기 쉬운 게 가장 큰 불편이었다. 이 불편함이 핵심 화면 설계의 기준이 됐다 — 모든 미팅 기록에 후속작업 필드를 두고, 홈 화면 1순위를 "다가오는 후속작업"으로 잡았다.
- 업무미팅과 개인미팅의 공개 범위가 완전히 다르다(업무는 동료와 공유, 개인은 본인만)는 점이 데이터 모델과 화면 접근 제어를 가르는 핵심 기준이 됐다. 처음에는 "로그인 구조가 필요없다"는 사용자 표현 때문에 개인미팅을 비로그인 영역으로 오해할 뻔했으나, 실제로는 "같은 로그인 안에서 개인미팅은 본인 행만 보이게"가 맞는 요구라는 걸 대화로 확인했다.
- 동료 계정으로 로그인했을 때 "개인미팅"이라는 메뉴 항목 자체가 보이면 안 된다는 점을 사용자가 명확히 짚어줬다 — 데이터만 안 보이는 것(빈 화면)과 메뉴 자체가 안 보이는 것(역할 기반 네비게이션)은 다르다. 이를 위해 `profiles.role`(`owner`/`colleague`) 필드를 두고 사이드바 메뉴를 역할별로 다르게 그리기로 했다.
- 업무미팅의 "대상자별 히스토리" 화면은 사용자가 화면 구성 1차 제안에서 "특정 화면을 더 자세히" 요청해 추가됐다 — 기부자나 동료와의 과거 미팅 전체를 한눈에 보고 싶다는 실제 업무 필요(모금가가 같은 기부자를 반복해서 만나며 맥락을 이어가야 하는 특성) 때문.
- 구글 캘린더 연동은 단순 링크 생성(설정 불필요)과 완전 자동 동기화(OAuth) 중 선택지를 줬는데, 사용자가 후속작업을 절대 놓치지 않는 게 핵심 목표라며 완전 자동 동기화를 선택했다. 이는 다음 '연결' 단계에서 Google Cloud Console OAuth 설정이 필요해 구현 복잡도가 늘어나지만, 이 앱의 존재 이유(후속작업 관리)에 직결되는 선택이라 그대로 반영했다.

**고민하다 버린 선택지**
- 업무미팅을 "미팅마다 공개 대상 동료를 따로 지정"하는 방식도 고려했으나, 동료가 1~2명뿐이라 불필요하게 복잡하다고 판단해 "초대받은 사람은 업무미팅 전체를 다 본다"는 단순한 모델로 갔다.
- 개인미팅의 종교·세례명·건강이슈 등을 법적 암호화 의무 대상(주민등록번호·바이오정보 등)으로 분류할지 검토했으나, 해당 항목들은 법상 암호화 의무 목록에 들지 않아 "민감정보: 없음"으로 정리했다 — 다만 이 데이터는 어차피 본인(오너)만 볼 수 있게 RLS로 막혀 있다.

**범위를 줄였거나 방향을 튼 지점**
- 화면 구성 1차안은 4개(로그인·홈·업무미팅·개인미팅)였으나, 사용자 요청으로 "대상자별 히스토리"(업무미팅)와 "개인미팅 목록/상세 분리"를 추가해 최종 6개 화면이 됐다. 6개는 "한 세션에 벅찬" 임계값에 닿아 있어, 구현 단계에서는 화면 단위로 하나씩 슬라이스해 나가는 게 중요하다.

다음 단계: Stitch 프로토타입으로 화면을 눈으로 먼저 확인한다.

## 연결 (2026-06-20)

**어떻게 붙였나**
- Stitch zip을 풀어 `design/`에 6개 화면(로그인·홈·업무미팅·대상자별 히스토리·개인미팅 목록·개인미팅 상세)을 정리했다. Stitch가 두 가지 스타일 패키지("Junjeom CRM" 파란색, "Lush Professionalism" 초록색)를 만들어줬는데, 사용자가 초록색(Lush Professionalism)을 선택해 `## 디자인` 토큰을 그 실제 색상값(#2DCC70 강조색 등)으로 갱신했다.
- Node.js·GitHub CLI·Vercel CLI가 전혀 설치돼 있지 않아 winget으로 Node.js·GitHub CLI를 설치하고, Vercel CLI는 npm 전역설치로 받았다. Supabase CLI는 winget에 없어 Scoop으로 설치했다.
- `create-next-app` → shadcn/ui 초기화(`-b radix -t next -d -y -f`로 비대화형 처리) → `app/globals.css`의 CSS 변수를 Stitch 실제 색상으로 교체 → Noto Sans KR 폰트 적용 → GitHub repo(`bluepond77/junjeom`) 생성 → Vercel 프로젝트 연결 → Supabase를 Vercel Marketplace 통합으로 프로비저닝(`vercel integration add supabase`)했다.
- 구글 캘린더 완전 자동 동기화를 위해 Google Cloud Console에서 프로젝트(`jundeom` — 사용자가 직접 만들며 슬러그를 오타냈다)를 만들고 Calendar API 활성화, OAuth 동의 화면(외부/테스트 중), `.../auth/calendar` 범위 추가, OAuth 클라이언트(웹 애플리케이션, 리디렉션 URI 2개: localhost와 프로덕션)를 만들어 `GOOGLE_CLIENT_ID`·`GOOGLE_CLIENT_SECRET`을 `.env.local`과 Vercel 환경변수(production/preview/development)에 등록했다.

**왜 이렇게 했나**
- Supabase CLI 로그인이 비TTY 환경(자동화 셸)에서 자동 로그인 플로우를 거부해(`LegacyLoginMissingTokenError`/`Cannot use automatic login flow inside non-TTY environments`), 액세스 토큰을 사용자가 직접 발급받아 셸 환경변수로 넘기는 방식으로 우회했다 — 토큰 값은 화면에 다시 출력하거나 파일에 남기지 않았다.
- shadcn init이 기본 `--yes` 플래그만으로는 인터랙티브 프롬프트(컴포넌트 라이브러리 선택)를 건너뛰지 못해, `--defaults`(`-d`)와 `-b radix -t next`를 명시해 완전 비대화형으로 만들었다.

**막힌 지점과 해결 — 가장 많은 시간을 쓴 부분**
- **GitHub 계정 혼동**: Vercel ↔ GitHub 연결(Login Connection)과 Vercel GitHub App 설치를 처음에 `bluepond777`(7이 3개, 브라우저에 이미 로그인돼 있던 다른 계정)에 해버려서 `vercel git connect`가 "Failed to connect... make sure you have access"로 계속 실패했다. 실제 레포는 `bluepond77`(7이 2개)에 있었다 — 사용자 이름의 한 글자 차이를 놓친 게 원인. 브라우저에서 모든 GitHub 세션을 로그아웃하고 `bluepond77`로 다시 로그인한 뒤, Vercel의 GitHub Login Connection을 Disconnect→Re-connect, GitHub App도 올바른 계정에 재설치해서 해결했다.
- **Vercel 계정도 혼동**: 같은 브라우저에서 Vercel 계정이 `torch-8645`(torch@korea.ac.kr, 처음 로그인된 계정)와 `okupark-6935`(okupark@gmail.com, CLI로 프로젝트를 만든 계정)로 나뉘어 있어, 처음엔 잘못된 계정에서 GitHub 연결을 시도했다. 브라우저에서 명시적으로 로그아웃 후 올바른 계정으로 재로그인해 해결.
- **Google 계정 다중 세션 문제**: Claude in Chrome이 제어하는 브라우저 프로필에는 `torch@korea.ac.kr`만 로그인돼 있고 `okupark@gmail.com`을 추가하려는 시도(계정 전환 → 다른 계정 추가)가 여러 번 새 탭/팝업으로 흩어지며 세션이 반영되지 않았다. `accounts.google.com/AddSession`으로 직접 이동해 이메일을 입력하고 사용자가 비밀번호를 직접 치는 방식으로 겨우 추가됐다 — 다중 Google 계정 환경에서는 "계정 전환" UI보다 AddSession 직접 이동이 더 안정적이었다.
- **Supabase 마켓플레이스 약관 미동의**: `vercel integration add supabase`가 `integration_terms_acceptance_required` 에러를 던졌다 — 브라우저에서 약관 동의 페이지(`vercel.com/.../integrations/accept-terms/supabase`)를 한 번 거쳐야 CLI 재시도가 통과했다.
- **OAuth 클라이언트 생성 화면의 "만들기" 버튼**이 쿠키 동의 배너에 가려져 안 보였다 — 배너의 "확인"을 먼저 닫아야 버튼이 드러났다.

**다음에 참고할 점**: 멀티 계정(GitHub·Vercel·Google) 환경에서 브라우저 자동화를 할 때는 작업 시작 전에 반드시 "지금 로그인된 계정이 어느 것인지"부터 확인하고 시작하는 게 시간을 가장 아낀다.

## 구현 (2026-06-20)

만든 화면: 로그인, 홈(대시보드), 업무미팅(목록+작성/상세 펼침), 대상자별 히스토리, 개인미팅 목록, 개인미팅 상세/작성, 구글 캘린더 자동 동기화(연결 버튼 + 후속작업 등록 시 이벤트 생성).

**핵심 기술 결정**

1. **역할 기반 라우팅을 서버 미들웨어가 아니라 클라이언트 컴포넌트(`AppShell`)로 처리**. Next.js App Router + Supabase Auth를 쿠키 기반 SSR 세션(`@supabase/ssr`) 없이 브라우저 전용 클라이언트(`lib/supabase.ts`)로만 썼기 때문에, 서버에서는 "누가 로그인했는지" 알 방법이 없었다. 그래서 모든 화면을 `<AppShell>`로 감싸고, 마운트 시 `supabase.auth.getSession()` → `profiles.role` 조회 → 미로그인 시 `/login`으로, 개인미팅처럼 오너 전용 화면은 `requireOwner` prop으로 콜리그를 `/`로 리다이렉트하는 구조로 통일했다. 단순한 MVP에 SSR 세션 관리를 새로 들이는 비용이 더 크다고 판단했다.
2. **개인정보 컬럼은 PLAN.md엔 한글(`가족관계`, `후속작업_마감일` 등)로 적었지만, 실제 DB 컬럼명은 전부 영문 ASCII로 만들었다** (`family_info`, `follow_up_due` 등). `CLAUDE.md`의 "URL 경로·slug·DB 키는 ASCII만" 규칙이 PLAN.md의 한글 표기보다 우선한다고 판단했다 — 한글 컬럼명이 Supabase REST/PostgREST 쿼리스트링에서 인코딩 문제를 일으킬 수 있기 때문. 화면에는 한글 라벨로만 보이게 했다.
3. **구글 캘린더는 "사용자별 토큰"이 아니라 "오너 1명의 단일 캘린더"로 설계**. PLAN상 캘린더 동기화 대상이 항상 okupark@gmail.com 하나뿐이라, `google_tokens` 테이블에 owner_id를 키로 refresh_token 하나만 저장하고, 업무미팅(동료가 작성해도)·개인미팅 후속작업 모두 이 단일 토큰으로 이벤트를 만든다. RLS 정책을 아예 두지 않아 anon/authenticated 키로는 이 테이블에 전혀 접근할 수 없고, service_role 키를 쓰는 서버 라우트(`app/api/...`)만 읽고 쓴다.

**구현 중 막혔다 푼 지점**
- **개인미팅 목록의 "대상자별 카드"**: PLAN 데이터 모델상 `personal_meetings`는 미팅 1건당 1행이고 대상자는 자유 텍스트(`contact_name`)라 별도 contacts 테이블처럼 정규화돼 있지 않다. 그래서 목록 화면에서는 `occurred_at desc`로 가져온 뒤 클라이언트에서 `contact_name` 기준으로 첫 번째(=최신) 행만 남기는 방식으로 "대상자별 최근 미팅" 카드를 만들었다 — 별도 그룹핑 쿼리나 뷰를 만들지 않고 가장 단순하게 처리했다.
- **캘린더 연동 토글의 무반응 버튼 문제**: Stitch 디자인엔 모든 후속작업 입력에 "캘린더에 자동 등록" 토글이 있었지만, 캘린더 연동 슬라이스를 만들기 전까지는 토글을 눌러도 아무 일도 안 일어나는 죽은 UI가 된다. 그래서 업무미팅/개인미팅 작성 화면 모두 이 토글을 마지막 슬라이스(캘린더 동기화)를 구현할 때 한꺼번에 추가했고, 후속작업 내용과 마감일이 둘 다 입력됐을 때만 토글이 보이게 했다(빈 후속작업에 토글이 떠 있는 것도 무의미한 UI라 판단).
- **OAuth 콜백에서 "누가 연결을 시도했는지"를 알아야 하는데, 서버 라우트엔 로그인 세션이 없다**: 클라이언트의 Supabase 세션은 브라우저 로컬스토리지에만 있어 서버 라우트가 쿠키로 읽을 수 없다. 이 앱은 캘린더 연동 대상이 항상 단일 오너 계정이므로, `/api/auth/google/start`에서 `profiles.role = 'owner'`인 행을 직접 찾아 그 id를 OAuth `state` 파라미터로 넘기고, 콜백에서 그 state를 그대로 `google_tokens.owner_id`로 써서 별도의 로그인 세션 전달 없이 해결했다.

### [2026-06-20] 보안 점검
- **점검 항목**: .env git 커밋 여부 · NEXT_PUBLIC 키 노출 · 하드코딩 비밀 키 · service_role 클라이언트 사용 · RLS 활성화 · 민감정보 평문 저장(법상 암호화 의무 대상)
- **결과**: CRITICAL 0건. 모두 통과.
  - `.env.local`은 git에 커밋된 적 없음(`.gitignore`로 처음부터 제외).
  - `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`만 브라우저에 노출되고, `GOOGLE_CLIENT_SECRET`·`SUPABASE_SERVICE_ROLE_KEY`는 `NEXT_PUBLIC_` 접두사 없이 서버 전용으로 분리돼 있음.
  - `lib/supabase-admin.ts`(service_role)는 `app/api/auth/google/*`·`app/api/calendar/create-event`의 서버 라우트 3곳에서만 import됨 — 클라이언트 컴포넌트에서 쓰는 곳 없음.
  - `profiles`·`contacts`·`work_meetings`·`personal_meetings`·`google_tokens` 5개 테이블 모두 `enable row level security` 적용 확인.
  - 6번 검사(민감정보 평문)에서 `card`·`password` 키워드가 잡혔지만 모두 오탐: `card`는 shadcn UI 디자인 토큰(`bg-card`), `password`는 로그인 폼 필드로 `supabase.auth.signInWithPassword()`를 거쳐 Supabase Auth가 처리하므로 우리 DB에 평문으로 저장되지 않음.
- **남은 위험**: 이름 기반 휴리스틱 검사라 한계가 있음 — 개인미팅의 `health_notes`·`family_info` 등은 법상 암호화 의무 대상(주민번호·카드·생체정보 등)은 아니지만 민감한 개인정보이며, 현재는 평문 저장 + RLS(owner_id 본인만 접근)로만 보호하고 있음. 의무 대상은 아니라 암호화하지 않았지만, 추후 요구사항이 바뀌면 재검토 필요.
