# Bug và regression workflow — SCRUM-58

## Nguồn và phạm vi

[Spec V2](../../specs/003-grabmefood-v2/spec.md) quản lý hành vi đúng;
[permissions](../permissions.md) quản lý quyền thao tác agent.
Workflow này không thay Spec Kit plan/tasks hoặc tự mở scope.

Đã kiểm `.specify/`: không có bug extension/extension registry được cài trong
cây hiện tại. Vì vậy dùng một template record tối thiểu, không tạo một hệ thống
bug song song. Nếu sau này cài extension, kiểm và liên kết record hiện có trước
khi thay workflow; không tự cài trong gói này.

## Quy trình bắt buộc

1. **Khoanh vùng**: đọc Jira/spec/contract liên quan và Git status. Nếu hành vi
   mong đợi chưa được duyệt, hỏi trước, không gọi thay đổi nghiệp vụ là bug fix.
2. **Record**: tạo Jira bug hoặc record theo [template](../templates/bug-record.md),
   liên kết task/spec FR và test. Chỉ ghi dữ liệu đã kiểm; không tạo lịch sử giả.
3. **Tái hiện**: ghi môi trường/phiên bản, bước tối thiểu, expected/actual,
   affected identities/permissions và dữ liệu fixture đã loại secret.
4. **RED**: thêm regression test phù hợp lớp lỗi; chạy trên code chưa fix và
   lưu đúng lệnh, failure/assertion chứng minh lỗi. Lỗi setup/timeout không liên
   quan không phải bằng chứng red.
5. **Sửa nhỏ nhất**: chỉ file allowlist. Đổi contract/kiến trúc/nghiệp vụ hoặc
   thao tác dữ liệu phá hủy phải được duyệt trước theo permissions.
6. **GREEN**: chạy lại cùng test trên code đã fix; giữ assertion bảo vệ hành vi.
   Chạy tests lân cận và baseline bắt buộc; UI có render/interaction evidence,
   quyền/DB/event có negative/integration tests phù hợp khi hệ thống đó tồn tại.
7. **Review**: kiểm diff không nới assertion, skip test hoặc thay expected để
   che lỗi; cập nhật record nguyên nhân, fix, red/green và rủi ro còn lại.
8. **Gate Done**: link evidence thật vào Jira; chỉ Done khi AC và kiểm bắt buộc
   đạt. Nếu không tái hiện được, thiếu tool/quyền hoặc không có red hợp lệ,
   ghi blocker, không tuyên bố fail-before/pass-after.

Không revert/reset checkout đang có user work để tái hiện RED. Nếu bug đã được
sửa trước khi viết test, dùng môi trường tách biệt được duyệt hoặc fixture
đại diện đã giải thích; ghi rõ hạn chế và xin review, không sửa lời báo cáo để
giả đã chạy trước fix.

## Chọn loại regression

| Lớp lỗi | Kiểm tối thiểu phù hợp |
| --- | --- |
| Hàm thuần/normalization/0-1-n | Unit test deterministic và input biên |
| HTTP/event contract | Contract + consumer/provider compatibility |
| Ownership/Auth/DB/Storage | Negative tests A/B/admin/service roles, supported API/SQL local |
| Retry/outbox/duplicate | Integration test delivery lặp, trễ hoặc dependency gián đoạn |
| UI/focus/navigation/state | Browser interaction + render/keyboard/empty/error trên màn hình liên quan |
| Permission cấu hình agent | Unit/config checks **và** canary live; không lấy matcher tự viết thay live gate |

Các bước RED/GREEN áp dụng cho **bug fix thật**, không ép viết một app bug giả
cho nhiệm vụ tài liệu/config. Tests guardrail mới là kiểm chính sách mới; không
được ghi chúng như lịch sử sửa một sự cố production.

## Bàn giao

Record chứa nguyên nhân đã xác minh, files/migrations, red/green command+result,
baseline, evidence phù hợp, approved scope/contract impact, remaining risk và
điểm tiếp tục. Không commit secret, production data hoặc dump tài khoản.
