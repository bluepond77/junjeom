# 접점

기술 이름(slug): `junjeom`

## 한 줄 소개
그린피스 모금가가 미팅 내용을 업무(모금·기부자·전략회의)와 개인으로 구분해 체계적으로 기록·관리하는 CRM 스타일 도구

## 핵심 흐름
1. 미팅 후 업무미팅 또는 개인미팅을 선택해 기록 작성
2. 업무미팅은 초대받은 동료도 함께 조회, 개인미팅은 본인(오너)만 조회 — 동료 계정에는 개인미팅 메뉴 자체가 보이지 않음
3. 후속작업이 생기면 구글 캘린더에 자동 동기화되어 놓치지 않음

## 참고 앱/사이트
CRM 느낌 (세일즈포스 등) — 좌측 사이드바 네비게이션 + 표/카드 형태의 정돈된 레이아웃

## 설정
- 로그인: 필요함 (역할 구분 — 오너 / 동료). 공개 회원가입 없음, 계정은 오너가 직접 초대(Supabase에서 생성)
- LLM API: 불필요 (정해진 데이터를 입력·저장·표시·집계하는 게 핵심)
- 외부 연동: 구글 캘린더 완전 자동 동기화 (OAuth, okupark@gmail.com) — 후속작업 등록 시 캘린더 이벤트 자동 생성
- 민감정보: 없음 — 비밀번호는 Supabase Auth가 처리(직접 저장 안 함), 구글 리프레시 토큰은 서버에서만 사용하고 클라이언트에 노출하지 않음

## 디자인
Stitch "Lush Professionalism" 스타일을 기준으로 다듬음 (그린피스 느낌의 그린 강조색).
- 강조색: `#2DCC70` (그린피스 그린) — 버튼·링크·활성 메뉴 표시
- 배경: `#F8F9FF` (전체 캔버스) · 카드: `#FFFFFF` · 글자: `#0B1C30` · 테두리: `#E2E8F0`
- 상태색: 성공/강조 `#2DCC70` · 오류 `#BA1A1A`
- 폰트: Noto Sans KR (Stitch는 Plus Jakarta Sans를 썼지만 한글 가독성을 위해 Noto Sans KR로 통일)
- 모서리(radius): 버튼·인풋 8px · 카드·모달 16px · 그림자: 옅은 "Soft Bloom" (카드에만, 짙지 않게) · 간격: 16px(모바일)~32px(데스크톱) 마진, 24px 거터
- 레이아웃 원칙: 좌측 사이드바 네비게이션(역할별 메뉴 다름, 활성 항목은 4px 그린 pill 표시) + 우측 콘텐츠 영역(표/카드). 대시보드는 상단 "다가오는 후속작업" 리스트 + 하단 최근 업무/개인미팅 요약 카드

## 화면
1. **로그인** — `/login`
   - 보임: 1순위 이메일·비밀번호 입력 폼 → 2순위 로그인 버튼
   - 동작: 로그인 (공개 회원가입 없음)
   - 데이터: 읽음: 없음 · 씀: 없음 (Supabase Auth)
   - 상태: 로그인 중 표시, 실패 시 오류 메시지
   - 디자인: design/login.html

2. **홈(대시보드)** — `/`
   - 보임: 1순위 다가오는 후속작업 목록(마감일순) → 2순위 최근 업무미팅 요약 → 3순위 최근 개인미팅 요약(오너만)
   - 동작: 후속작업 클릭 시 해당 미팅 상세로 이동
   - 데이터: 읽음: work_meetings, personal_meetings(오너만) · 씀: 없음
   - 상태: 로딩 스피너, 후속작업 0건 시 "예정된 후속작업이 없어요" 안내, 오류 메시지
   - 디자인: design/home.html

3. **업무미팅** — `/work-meetings`
   - 보임: 1순위 미팅 목록(표: 일시·대상자·내용 요약·후속작업) → 2순위 새 미팅 작성 버튼 → 3순위 상세(클릭 시 펼침/이동)
   - 동작: 목록 조회·검색(대상자), 새 미팅 작성(일시·대상자·내용·후속작업·후속작업 마감일 입력), '캘린더에 자동 등록' 토글
   - 데이터: 읽음: work_meetings, contacts · 씀: work_meetings, contacts
   - 상태: 로딩 표시, 0건 시 "아직 등록된 업무미팅이 없어요" 안내, 제출 중·성공·실패 피드백, 오류 메시지
   - 디자인: design/work-meetings.html

4. **대상자별 히스토리** — `/work-meetings/contacts/[id]`
   - 보임: 1순위 대상자 이름·유형(기부자/동료/기타) → 2순위 해당 대상자와의 과거 미팅 타임라인
   - 동작: 과거 미팅 클릭 시 상세로 이동
   - 데이터: 읽음: contacts, work_meetings (contact_id 기준) · 씀: 없음
   - 상태: 로딩 표시, 미팅 이력 0건 시 "아직 기록된 미팅이 없어요" 안내, 오류 메시지
   - 디자인: design/contact-history.html

5. **개인미팅 목록** — `/personal-meetings` (오너 계정만 접근 — 동료 계정은 메뉴·경로 모두 차단)
   - 보임: 1순위 대상자별 카드 목록(이름·최근 미팅일) → 2순위 새 미팅 작성 버튼
   - 동작: 목록 조회·검색(대상자), 카드 클릭 시 상세로 이동
   - 데이터: 읽음: personal_meetings · 씀: 없음
   - 상태: 로딩 표시, 0건 시 "아직 등록된 개인미팅이 없어요" 안내, 오류 메시지
   - 디자인: design/personal-meetings-list.html

6. **개인미팅 상세/작성** — `/personal-meetings/[id]` (오너 계정만 접근)
   - 보임: 1순위 대상자 이름·미팅일시 → 2순위 가족관계(배우자·자녀 이름)·생일·세례명·종교 → 3순위 건강이슈·최근 기쁜 일·중요 가치/말 → 4순위 후속작업(선택)
   - 동작: 새 미팅 작성 또는 기존 미팅 수정, 후속작업 입력 시 '캘린더에 자동 등록' 토글
   - 데이터: 읽음: personal_meetings · 씀: personal_meetings
   - 상태: 제출 중·성공·실패 피드백, 오류 메시지
   - 디자인: design/personal-meeting-detail.html

## 데이터 (Supabase 테이블)
- **profiles**
  - `id` uuid — 기본 키, auth.users.id와 동일
  - `display_name` text — 표시 이름
  - `role` text — `owner` 또는 `colleague`. 메뉴·접근 제어 기준
  - 관계: 없음

- **contacts**
  - `id` uuid — 기본 키
  - `이름` text
  - `유형` text — 기부자 / 동료 / 기타
  - `created_by` uuid — 작성자
  - `created_at` timestamptz
  - 관계: created_by → profiles.id

- **work_meetings**
  - `id` uuid — 기본 키
  - `contact_id` uuid — 대상자
  - `일시` timestamptz
  - `내용` text — 미팅 주요 내용
  - `후속작업` text — nullable
  - `후속작업_마감일` date — nullable
  - `calendar_event_id` text — nullable, 구글 캘린더 동기화 후 저장
  - `created_by` uuid — 작성자
  - `created_at` timestamptz
  - 관계: contact_id → contacts.id, created_by → profiles.id

- **personal_meetings**
  - `id` uuid — 기본 키
  - `owner_id` uuid — 오너(작성자), RLS 기준
  - `대상자` text
  - `일시` timestamptz
  - `가족관계` text — 배우자·자녀 이름 등
  - `생일` date — nullable
  - `세례명` text — nullable
  - `종교` text — nullable
  - `건강이슈` text — nullable
  - `최근기쁜일` text — nullable
  - `중요가치` text — nullable
  - `후속작업` text — nullable
  - `후속작업_마감일` date — nullable
  - `calendar_event_id` text — nullable
  - `created_at` timestamptz
  - 관계: owner_id → profiles.id

> 접근 제어(RLS): work_meetings·contacts는 모든 로그인 사용자가 조회·작성 가능. personal_meetings는 `owner_id = auth.uid()`인 행만 조회·작성 가능(오너 본인 외에는 행 자체가 보이지 않음).

## 기술 스택
Next.js (App Router, TypeScript) · Tailwind CSS · shadcn/ui · Supabase (Auth + DB) · Vercel · Google Calendar API (OAuth)

## MVP 범위
- 포함: 로그인, 홈(대시보드), 업무미팅(목록+작성/상세), 대상자별 히스토리, 개인미팅 목록, 개인미팅 상세/작성, 구글 캘린더 자동 동기화
- 제외 — 다음에: 미팅별 동료 단위 세부 공개 설정(현재는 전체 공개/오너 전용 2단계로 단순화), 미팅 내용 자동 요약(LLM), 알림(이메일·슬랙 등)

## 진행 상황
- [x] 기획 완료
- [x] Stitch 프로토타입
- [x] 연결 (GitHub · Vercel · Supabase · Google Calendar OAuth)
- [ ] 구현: 로그인 + 역할 기반 메뉴
- [ ] 구현: 홈(대시보드)
- [ ] 구현: 업무미팅 (목록+작성/상세)
- [ ] 구현: 대상자별 히스토리
- [ ] 구현: 개인미팅 목록
- [ ] 구현: 개인미팅 상세/작성
- [ ] 구현: 구글 캘린더 자동 동기화
- [ ] 배포 확인
