# Contracts V2 — SCRUM-60

Nguồn business duy nhất: [spec](../spec.md). Authority:
[ADR-0001](../../../docs/adr/0001-supabase-cloud.md),
[ADR-0002](../../../docs/adr/0002-v2-contracts.md) (owner duyệt6/6, receipt clarification,
và remediation approval4 điểm **mới, không hồi tố6/6**).
Các tables là normative contract bằng Markdown, không endpoints đã triển khai.

| Artifact | Nội dung |
| --- | --- |
| [http.md](http.md) | Transport, DTO, endpoints, pagination, errors, polling |
| [authorization.md](authorization.md) | BFF/service identity, session state machine và revocation |
| [events.md](events.md) | Envelope/payload, outbox, ordering, recipients, retry/DLQ/retention |
| [data-model](../data-model.md) | Dictionary, constraints, indexes và schema ownership |
| [tasks](../tasks.md) | Jira/file/test obligations cho implementation tương lai |

## Quy tắc tương thích

- JSON camelCase; internal DB snake_case. Unknown write fields bị từ chối422,
  không silently accept role/userId/status ngoài DTO. UUID không phải quyền truy cập.
- API major `/api/v1`; event `schemaVersion=1`. Thêm optional response field là
  compatible; field required mới/đổi nghĩa/xóa field cần version mới và review.
- Dates RFC3339 UTC; IDs UUID strings; revision số nguyên tăng trong từng aggregate.
  Giá VND là integer minor-unit đồng hoặc null, không float/0 thay giá thiếu.
- Không account email/token/raw session/callback code trong events, public DTO,
  logs hoặc Problem Details. Fixtures test phải mới và đánh dấu test/demo.
- Catalog owns catalog entities/media; Community owns profiles/settings/saved/
  comments/revocation/recipient receipts; Notification owns broadcasts/inbox/read/
  projection/dedup. Không service nào đọc SQL schema bên kia hoặc Auth internals.
- Private response `Cache-Control: no-store`. Không dùng public/CDN cache cho
  personalized responses. Public reads vẫn kiểm published tại owner.
- Tất cả dependencies/timing/retry constants trong protocol là local implementation
  defaults cần test tại64/62/111, không đổi Supabase settings hoặc capacity claims.

## Design acceptance

Static contract checks + Spec Kit analyze trước implementation; runtime tests
theo [quickstart](../quickstart.md). Không gọi test legacy là proof V2.
