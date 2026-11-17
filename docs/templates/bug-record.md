# Bug record template — chưa phải một bug đã kiểm chứng

<!-- Copy into the assigned issue/record only for a real bug. Do not fill invented evidence. -->

- Jira bug / task / FR / contract: _điền reference thật_
- Trạng thái: _Investigating / Reproduced / Fixing / Verified / Blocked_
- Môi trường, version/commit, fixture và quyền tác nhân: _điền đã kiểm_
- Phạm vi được giao / file allowlist / phê duyệt liên quan: _điền thật_

## Tái hiện

1. _Điều kiện và bước tối thiểu._
2. _Expected theo nguồn đã duyệt._
3. _Actual và evidence đã loại secrets._

## Nguyên nhân

_Phân biệt nguyên nhân đã xác minh với giả thuyết; không khẳng định nếu chưa kiểm._

## Regression RED → GREEN

| Mốc | Lệnh/test | Kết quả và evidence |
| --- | --- | --- |
| RED — chưa fix | _lệnh thật_ | _assertion liên quan bị fail; chưa chạy thì ghi chưa chạy_ |
| Fix | _files/migrations/contract approval_ | _thay đổi nhỏ nhất_ |
| GREEN — sau fix | _cùng test_ | _kết quả thật_ |
| Baseline/lân cận | _lệnh phù hợp_ | _kết quả hoặc blocker_ |

## Review và handoff

- Quyền/dữ liệu/contract/UI bị ảnh hưởng: _liệt kê hoặc giải thích không ảnh hưởng_
- Evidence render/API/DB/event phù hợp: _dẫn chứng, không bịa PASS_
- Kiểm không skip/nới assertion/đổi expected để che lỗi: _review thật_
- AC Đã đạt / Chưa đạt / Bị chặn, rủi ro còn lại: _điền thật_
- Next step: _điểm tiếp tục_
