-- 업무미팅 샘플: 고액기부팀 미팅 (업무_고액기부_기부팀.md)
with new_contact as (
  insert into public.contacts (name, type, created_by)
  select '고액기부팀 (한수정·최예리)', '동료', id
  from public.profiles where role = 'owner'
  returning id
)
insert into public.work_meetings (contact_id, occurred_at, content, follow_up, created_by)
select
  new_contact.id,
  '2026-06-15 10:00:00+09',
  '고액기부팀 매니저 한수정, 신입 최예리와 팀 미팅. 고액기부(major gift) 모금이 사업·마케팅 부서의 KPI와 어긋나 있어 부서 간 공동 목표 설정이 필요하다는 논의. 고액기부는 다른 부서와의 협업이 핵심인데 각 부서가 자기 KPI에만 집중해 협업 동기가 부족함을 공유. 최예리(입사 6개월차)에게 고액기부 업무의 외로움과 동료·선배 멘토의 중요성을 안내하고, 팀 빌딩 차원에서 서로를 알아가는 시간을 가짐.',
  '사업·마케팅 부서와 고액기부 공동 KPI 설정을 위한 논의를 리더십 라인에서 시작하기',
  profiles.id
from new_contact, public.profiles where profiles.role = 'owner';

-- 개인미팅 샘플: 최석탁 선배 (개인_최석탁선배.md)
insert into public.personal_meetings (
  owner_id, contact_name, occurred_at, family_info, religion,
  health_notes, recent_joy, values_notes, follow_up
)
select
  id,
  '최석탁',
  '2026-06-10 18:30:00+09',
  '아내가 6살 연상(63세). 막내 자녀는 현재 미국 거주.',
  '가톨릭',
  '아내가 작년 3월 뇌하수체 종양 제거 수술(내시경적 수술)을 받음. 이후 건강 관리를 위해 낮에 함께 걷는 습관을 챙기려 노력 중. 본인은 2021년부터 달리기를 시작해 무릎(장경인대) 통증을 겪었으나 근육이 붙으며 호전.',
  '2021년부터 시작한 달리기로 하프 코스를 완주했고, 매일 턱걸이 80개를 꾸준히 해 체형이 달라짐. 수영도 주 2회 꾸준히 배우는 중.',
  '체력이 업무·정신력의 근간이라는 철학을 가지고 있음("체력이 있어야 변화를 감당할 수 있다"). 가족과 오래 건강하게 함께 지내는 것을 가장 중요하게 여기며, 아내의 건강을 위해 이직 후에도 함께 운동할 시간을 만들려 함.',
  '다음 만남은 면 요리로 식사 약속'
from public.profiles where role = 'owner';
