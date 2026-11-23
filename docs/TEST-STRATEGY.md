# Test strategy — GrabMeFood

**Trạng thái:** Nhóm 3 đã duyệt, thuộc chiến lược B1; đây không là kết quả test.
Nguồn chuẩn: [PRD](PRD.md), [DOMAIN](DOMAIN.md), [SECURITY](SECURITY.md), [API](API.md).
Nhóm 2 được duyệt để tiếp tục tài liệu; các phương án thay thế/TBD chưa có đáp án vẫn mở.

## 1. Phạm vi và phương pháp

Kiểm chứng frontend và năm service Catalog, Collection, Community, Notification, Account Administration.
Ưu tiên kiểm thử local, dữ liệu tổng hợp và TDD khi triển khai. Không dùng Cloud mặc định làm test sandbox.
Không triển khai tính năng chưa duyệt chỉ để hoàn tất bộ test.
Framework/version/lệnh chạy sẽ được chốt trong kế hoạch sau baseline; chưa có test executable.

## 2. Các tầng bằng chứng

| Tầng | Cần chứng minh | Không được suy ra |
| --- | --- | --- |
| Static | Types, contracts, SQL review, link tài liệu, không secret | API hoặc quyền hoạt động |
| Unit/component | Quy tắc owner, validation, UI states, dedup | Tích hợp Supabase thật |
| Service integration | Transaction local, persistence, HTTP adapter, rollback và lỗi upstream | Luồng năm service hoàn tất |
| DB/grants/RLS | Quyền theo role/user, constraints, functions và view | Browser/Auth thật chỉ từ SQL giả claims |
| Data API/Auth thực tế | Token/key thật đúng môi trường, email/Google, user A/B, phiên cũ | Spring hoạt động nếu chưa gọi Spring |
| Inter-service/E2E | Request UI→owner→data→event→consumer→chuông, lỗi từng hop | Đúng chỉ vì happy-path chạy một lần |
| Migration/recovery | Replay, upgrade, restore và reconciliation | Có backup đồng nghĩa restore được |

Mỗi báo cáo ghi target, revision, command/tool, fixture, expected/actual, evidence, cleanup và phần chưa chạy.
Không log token/password/email thật. Mock phải được ghi rõ, không gắn nhãn “thực tế”.

## 3. Ma trận coverage nghiệp vụ

| Requirement | Ca kiểm thử chính và âm |
| --- | --- |
| REQ-EXP-01, REQ-EXP-02, REQ-EXP-03 | Quán→món đúng cha; tìm món trả quán distinct; lọc vùng; không kết quả, query đặc biệt, pagination; không lộ hidden qua join/search |
| REQ-EXP-04 | Map/link đúng quán, URL không hợp lệ bị chặn; iframe lỗi vẫn có link, không phát sinh Maps billing |
| REQ-CNT-01, REQ-CNT-02, REQ-CNT-03 | Nội dung/tuyển chọn public, nhãn demo, provenance ảnh; không tự dùng ảnh không có quyền |
| REQ-UX-01, REQ-UX-02, REQ-UX-03 | Việt/Anh, chuỗi dài/dấu Việt, keyboard/zoom/điện thoại; HTML/OG trước JS đúng từng URL; hidden không còn trong output được quản lý |
| REQ-AUTH-01, REQ-AUTH-02 | Email/Google, chưa xác thực, link sai/hết hạn, recovery; khách đọc public nhưng không thao tác cá nhân |
| REQ-SAV-01, REQ-SAV-02 | Owner A/B, bộ tách loại, một mục nhiều bộ, duplicate request; không đổi owner/type qua payload |
| REQ-RND-01, REQ-RND-02, REQ-RND-03 | All/selected chỉ saved distinct; có thể lặp; rỗng/ẩn/xóa; Catalog timeout là lỗi, không stale fallback hoặc kết quả rỗng giả |
| REQ-COM-01, REQ-COM-02, REQ-COM-03 | Quán/món, reply một cấp/cùng target, owner sửa/xóa; admin xóa nhưng không sửa lời người khác; XSS/plain text, target bị gỡ |
| REQ-NOT-01, REQ-NOT-02, REQ-NOT-03, REQ-NOT-04 | Năm loại, đúng recipient, realtime/chấm đỏ, mark-one/all cutoff, nhiều tab/reconnect, admin gửi riêng/all; A subscribe B bị chặn |
| REQ-ADM-01, REQ-ADM-02, REQ-ADM-03 | Admin-only; hidden giữ bình luận, deleted mới cleanup; marker vẫn giữ; missing receipt không báo full completion |
| REQ-ADM-04, REQ-ADM-05 | Lock/unlock/delete, JWT cũ, phiên đang mở, fail-closed, operation cạnh tranh/retry; cleanup từng owner và Auth, event trễ không tái tạo dữ liệu |

Parent/reply cascade, recipient hai mốc, SSR/public ảnh/staging upload và admin safety đã chọn.
Retentions, temporal boundary, wire contracts và numeric limits chưa chốt thì test tương ứng BLOCKED,
không bịa expected behavior để đạt coverage.

## 4. Security và distributed failure suite

- RLS/grants: anon, A, B, admin, blocked và role từng service; thử SELECT/INSERT/UPDATE/DELETE.
  Deny trả zero rows phải kèm kiểm tra row gốc không đổi; allowed write phải chứng minh affected row.
- Quyền cột/function/view, giả owner/role/recipient; gọi internal API bằng public key/user JWT không được phép.
- Data API/RPC priority: test credential từng owner không ghi schema/RPC owner khác, user/anon không gọi
  internal commands, gate helper chỉ đọc, actor spoof bị chặn. Không dùng service_role làm proof scope.
- Outbox: rollback không phát event; crash sau commit/trước send, sau consumer commit/trước ack;
  duplicate/out-of-order/version gap, poison event, một destination down và replay có kiểm soát.
- Producer/event-type giả, payload khác cùng event ID, service gọi vượt phạm vi; không coi network local là auth.
- Account/Catalog down: quyền hoặc availability không xác nhận được thì không cho thao tác nhạy cảm.
- Storage: nonadmin/blocked upload, MIME giả/oversize, overwrite sau validate, orphan cleanup, asset dùng chung;
  policy/signed URL/cache phù hợp phương án được chọn.
- Xóa user/quán có nhiều owner: partial failure, restart, operation conflict và late event.
- Parent delete/user delete phải xóa replies người khác; hide chỉ giấu target, không xóa comments.
- Notification: save sau event không nhận, save trước rồi bỏ trước gửi không nhận, nhiều bộ không nhân bản,
  self-reply không gửi, món/quán ẩn không báo; re-save boundary cần chốt trước assertion.
- HMAC: chữ ký sai/đích sai/body bị đổi/replay/hết hạn, nonce request mới cho retry cùng event ID;
  key rotation theo wire contract duyệt, không dùng user JWT thay service authentication.
- Admin: chặn self-lock/delete và concurrent operations làm mất admin active cuối.
- Ảnh: staging không đọc public, malformed byte không promote; ảnh hợp lệ public/OG;
  hide quán không đòi thu hồi public URL ảnh cũ.

Các suite phụ thuộc transport/connection chỉ kích hoạt theo phương án đã được duyệt, không tự thêm broker.

## 5. Migration, fixture và môi trường

Đề xuất local stack trước, sau đó spike target được duyệt riêng; chưa cài CLI/container runtime.
Fixture A/B/admin/blocked, nội dung public/hidden/deleted, collection trùng, comment/reply và events tổng hợp.
Không tạo user/email/seed/bucket thật khi chưa có target, phạm vi và cleanup được duyệt.
Replay từ local sạch và upgrade từ trạng thái hiện có; kiểm tra grants/RLS sau migration.
Test restore/backup theo OPERATIONS; không reset Cloud để làm test pass.

## 6. Definition of Done đề xuất

- Requirement/rule liên quan đã rõ, test traceable và đạt ở đúng tầng; blockers không bị che bằng mock.
- UI/data/quyền/negative cases và tài liệu lát cắt cập nhật; owner isolation/contract không bị bypass.
- Inter-service delivery/cleanup có evidence nếu thuộc lát cắt, không chỉ build một service.
- Không secret, không vượt scope/chi phí; kiểm chứng mutation retry và cleanup fixture.
- Evidence được review; chủ dự án nghiệm thu trước Done/release. Không auto commit hoặc đổi Jira status.
- Hiệu năng/concurrency, độ trễ chuông/cleanup, RPO/RTO và coverage threshold còn TBD;
  không tự đặt số liệu như đã duyệt. Những blocker ảnh hưởng acceptance phải đóng trước triển khai liên quan.
