# GrabMeFood V2 — Jira → yêu cầu → nghiệm thu

Nguồn nghiệp vụ duy nhất: [spec.md](spec.md). Bảng này là chỉ mục coverage tại
SCRUM-56, không phải tasks/plan triển khai hoặc evidence E2E đã chạy.

`USx.y` là scenario số y trong User Story x; `FR`/`SC` nằm trong spec.
Tasks trong bảng là nơi triển khai tương lai, không phải trạng thái đã hoàn tất.

| Jira thực thi | Yêu cầu | Scenario nghiệm thu | Kết quả hướng tới |
| --- | --- | --- | --- |
| SCRUM-13, SCRUM-15, SCRUM-9, SCRUM-24, SCRUM-30 | FR-001–004, FR-026 | US1.1–3, US6.1–4 | Catalog/detail công khai, offering đúng, quyền admin; SC-001 |
| SCRUM-12 | FR-005–006 | US1.4–7 + edge cases search | Có/không dấu, query rỗng, kết hợp filter trên cùng offering, sắp xếp/state; SC-001 |
| SCRUM-26, SCRUM-48 | FR-007–008, FR-031 | US2.1–2, US2.5–7, US4.6 | Email/password/verify/reset, role/session boundaries; SC-002 |
| SCRUM-27 | FR-009–010, FR-012 | US2.3–4, US2.8–9, US4.2, US4.10 | Identity/profile/onboarding/theme riêng tư và persistence; SC-002 |
| SCRUM-27, SCRUM-51, SCRUM-52 | FR-011 | US5.7–10, US2.8 | Nhóm thông báo được xét lúc tạo mục, không ảnh hưởng thư Auth; SC-002/005 |
| SCRUM-28 | FR-013–014 | US3.1–2, US3.7 | Saved món/quán riêng tư, idempotent, không rò draft; SC-003 |
| SCRUM-29 | FR-015–016 | US3.3–8 | Random hai loại 0/1/n, không filter/fallback hoặc lặp tức thì khi còn lựa chọn; SC-003 |
| SCRUM-16 | FR-017–019 | US4.1–10, US6.4 | Comment/reply/mention, một tầng, ownership/report/moderation, không rating; SC-004 |
| SCRUM-51, SCRUM-52 | FR-020–025 | US5.1–10 | Đúng recipient, chống trùng/self, inbox/read/broadcast, quán đổi giá/thực đơn; SC-005 |
| SCRUM-14 | FR-027 | US7.1, US6.4 | 20 món/8 quán/tài khoản và ảnh demo mới; SC-007 |
| SCRUM-21, SCRUM-49, SCRUM-8 | FR-028 | US7.1–3 | Apps localhost + Cloud prereqs, startup không reset; hai vòng trên isolated approved target (hiện blocked); SC-007 |
| SCRUM-20, SCRUM-25, SCRUM-17 | FR-029 | US7.4 + các luồng chính US1–6 | UI mới hoàn toàn, mobile/desktop/keyboard/reduced motion; SC-006 |
| SCRUM-10, SCRUM-23, SCRUM-31 và task sở hữu từng flow | FR-030 | US1.2–3, US2.2/5/9, US3.6–8, US4.3–5, US5.2/4–5, US6.2–3, US7.4 | Lỗi an toàn/không giả thành công, authz không UI-only; SC-001–007 |

## Gate cho gói hiện tại

Cloud amendment SCRUM-59 thay topology Local trước đó, không đổi FR IDs/coverage.
Auth FR-007/031 dùng Cloud email và session A, task SCRUM-26/48/81/82 sau scaffold.
SCRUM-59 đã Done theo closure2026-11-16; SCRUM-60 được giao riêng và owner duyệt
6 contract decisions + receipt clarification tại ADR-0002. Lịch sử gate dưới đây
được giữ, không dùng câu “chưa60” ở snapshot cũ để chặn task mới đã giao.

- **SCRUM-55**: constitution được đồng bộ có căn cứ; spec V2 phù hợp, decisions đã
  ghi nhận; không cần dựng lại hai spec UI legacy hoặc chạy plan/tasks.
- **SCRUM-56**: rà các scenario/coverage, checklist chất lượng, trình chủ dự án duyệt
  toàn bộ spec và amendment constitution. Chưa được coi là đạt chỉ vì hết marker.
- **SCRUM-57**: chỉ sau SCRUM-18 được duyệt; merge AGENTS, permission matrix dẫn
  về nguồn chuẩn, không sao chép spec hoặc tự sửa quyền tài khoản/GitHub.
- **SCRUM-58**: chỉ sau SCRUM-57; regression fail-before/pass-after và kiểm chứng
  permission gate thực ở harness/config hỗ trợ. Không lấy tài liệu làm bằng chứng
   công cụ đã bị chặn; nếu thiếu quyền/capability phải báo blocker, không Done.

## Contract → model → task trace — SCRUM-60

Đây là index, không bản sao yêu cầu. FR/scenario/SC definitions vẫn ở spec.
`H`=[HTTP](contracts/http.md), `A`=[authorization](contracts/authorization.md),
`E`=[events](contracts/events.md), `D`=[data model](data-model.md).
Task IDs ở [tasks](tasks.md), actual Jira execution package ghi trên từng task.

| Requirement | Contract/model | Task IDs | Acceptance source |
| --- | --- | --- | --- |
| FR-001 | H Public Catalog / D C01 | T018 T020 T022 | US1 / SC-001 |
| FR-002 | H publication/404 / D C01–02 | T018 T020 T024 T025 T053 | US1.1–3 / SC-001 |
| FR-003 | H Offering / D C02 | T004 T020 T024 T025 T053 | US1.1 / US6.4 |
| FR-004 | H null-price/media/demo / D C01–03 | T012 T018 T020 T052 T053 | US1.3 / US6.3–4 |
| FR-005 | H search normalization/URL | T019 T020 T023 | US1.4 / SC-001 |
| FR-006 | H same-offering/cursor / D C02 | T019 T020 T023 | US1.5–7 / SC-001 |
| FR-007 | H Auth/reauth/resume / A state machine / D C23 | T011 T026 T027 T028 T029 T030 T031 | US2.1–2,5–7,11 / SC-002 |
| FR-008 | A action matrix / D C09–11,C20 | T009 T010 T026 T028 T062 | US2 / US4.6 |
| FR-009 | H Profile / D C04 | T005 T032 T033 | US2.3,9 / US4.2,10 |
| FR-010 | H preferences/onboarding / D C05 | T005 T032 T033 | US2.3–4,8 |
| FR-011 | H Preferences defaults / E receipt / D C05,C21 | T032 T033 T044 T045 T046 | US2.10 / US5.7–10 |
| FR-012 | A own-user / H suggestions/media | T010 T032 T033 T041 T048 T062 | US2.9 / US4.2 / US5.2 |
| FR-013 | H Saved / D C06 | T034 T036 T037 | US3.1–2 |
| FR-014 | H Saved resolve / D C06 | T034 T035 T036 T037 | US3.6–8 |
| FR-015 | H Random / D C06 | T034 T035 T038 T039 | US3.3–8 |
| FR-016 | H Random CAS/no-repeat | T034 T035 T038 T039 | US3.3–8 / SC-003 |
| FR-017 | H Comments / E interaction / D C07 | T040 T042 T043 | US4 / SC-004 |
| FR-018 | H owner/thread/text / D C07 | T010 T041 T042 T043 T062 | US4.2–5 |
| FR-019 | H tombstone/moderation/handle / D C04,07–08 | T005 T032 T041 T042 T043 | US4.7–10 |
| FR-020 | E immutable creation payloads/receipt / D C12,15,21 | T040 T042 T044 T045 T046 T047 | US4.11 / US5 / SC-005 |
| FR-021 | E dedup/intake / D C12,15–16 | T014 T015 T045 T046 T047 | US5.1,9 |
| FR-022 | H inbox/read-all / D C15 | T044 T048 T049 | US5.2–3 |
| FR-023 | H broadcast / A Admin / D C14 | T044 T050 T062 | US5.4 |
| FR-024 | H polling/deep link | T048 T049 T058 | US5.5 / FR-024 |
| FR-025 | E recipient snapshot/menu events / D C12,17 | T021 T036 T045 T046 T047 T050 | US5.6–10 |
| FR-026 | H Admin Catalog/media GET matrix/no-store / D C01–03,C22 | T009 T032 T051 T052 T053 T054 | US6.1–5 / SC-001 |
| FR-027 | H demo markers / D C01 | T003 T011 T012 T055 T056 T057 | US7.1 / SC-007 |
| FR-028 | quickstart/run/provisioning split | T001 T002 T003 T013 T055 T056 T057 | US7.1–3 / SC-007 |
| FR-029 | UI gate/new paths / quickstart | T016 T017 T022 T023 T024 T025 T031 T033 T037 T039 T043 T049 T050 T054 T060 T063 T064 | US7.4 / SC-006 |
| FR-030 | H Problem Details / A fail-closed / E faults | T002 T010 T015 T026 T035 T041 T045 T052 T058 T059 T061 T062 | US1–7 failures / SC-001–007 |
| FR-031 | A revocation / D C09–11 | T006 T027 T028 T029 T030 T031 T059 T062 | US2.5–7 / SC-002 |

SC coverage:001→T018–25/T051–54;002→T026–33;003→T034–39;
004→T040–43;005→T044–50;006→T017/T060/T063;007→T012–13/T055–57.
31/31 mapped là plan coverage, không acceptance pass. T013/75–76 blocked hiện tại.

## Deferred runtime gates

64 local resources/scaffold/config-negative guards +actual GitHub CI;
65 live network/TLS chain+hostname/Connect/quota inventory;67–68 role creation;
69 grants;70 authenticated service-role TLS/isolation;62 events;81/82 Auth/revocation;
103/104 receipt/inbox;107/108 integrated faults;109/110 render/a11y;
111 capacity/performance;112 security;75/76 isolated rebuild;116 portable demo.
Không đổi trạng thái/dependency/assignment các package đó bằng trace table.

Remediation approval **mới** C1/U1/U2/I1: giữ31 FR và64 tasks; thêm scenarios
US2.10–11/US4.11/US6.5 để kiểm default4 nhóm, fresh-purpose resume, immutable
creation recipients và media cache/authorization. Constraints C21–C23 phải được
propagate exact quote tới schema/story tasks, không lẫn vào approval6/6 trước.
Không marker task parallel nào được giữ khi coarse tasks còn trải package tuần tự.
