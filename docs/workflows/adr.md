# Workflow ADR và thay đổi contract

Nguồn nghiệp vụ vẫn là [Spec Kit](../../specs/003-grabmefood-v2/spec.md).
ADR chỉ ghi quyết định kỹ thuật và lý do, không tạo yêu cầu nghiệp vụ cạnh tranh.
Kiến trúc/contracts cụ thể thuộc SCRUM-19, chưa được thiết kế trong gói này.

1. Kiểm Jira/spec/contracts/ADR đã có; không tạo ADR trùng hoặc tự sửa contract.
2. Nếu đề xuất ảnh hưởng stack, service ownership, protocol/event shape, dữ liệu,
   quyền hoặc scope: nêu vấn đề, lựa chọn, tác động/migration và xin phê duyệt
   trước khi thực hiện phần phụ thuộc.
3. Soạn [template](../templates/adr.md) với trạng thái **Proposed**. Ghi rõ
   phương án khuyến nghị chưa phải quyết định đã duyệt.
4. Chỉ đổi **Accepted** khi có chủ dự án/người có thẩm quyền chấp thuận; dẫn
   ngày và reference phê duyệt thật. Không bịa approver, timestamp hoặc kết quả.
5. Sau khi được giao execution: cập nhật contract/version/compatibility tests,
   Spec Kit plan/tasks và trace Jira tương ứng ở nguồn đúng, không lách sang
   implementation khi chỉ được giao viết ADR.
6. Khi thay quyết định cũ, dùng **Superseded** và liên kết hai phía; không xóa
   lịch sử hoặc đánh dấu proposal mới là đã được chấp thuận.

Template không phải một ADR đã Accepted. Gói SCRUM-58 chỉ tạo workflow/template,
không tự chốt thêm kiến trúc, giao thức hay service contract.
