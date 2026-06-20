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
