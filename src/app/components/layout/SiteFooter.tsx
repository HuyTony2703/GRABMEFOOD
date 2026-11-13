import { Link } from "react-router"

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      id="site-footer"
      aria-label="Thông tin GrabMeFood"
    >
      <div className="app-container">
        <div className="footer-groups">
          <section aria-labelledby="footer-about">
            <h2 id="footer-about">Giới thiệu</h2>
            <p>
              GrabMeFood giúp bạn khám phá món ăn, tìm hiểu quán và tham khảo
              đánh giá để chọn nơi ăn.
            </p>
          </section>
          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact">Liên hệ</h2>
            <ul>
              <li>Email — Cần bổ sung</li>
              <li>Số điện thoại — Cần bổ sung</li>
              <li>Địa chỉ đơn vị vận hành — Cần bổ sung</li>
            </ul>
          </section>
          <section aria-labelledby="footer-help">
            <h2 id="footer-help">Hỗ trợ khách hàng</h2>
            <ul>
              <li>
                <Link to="/settings/guide">Hướng dẫn</Link>
              </li>
              <li>
                <Link to="/settings/support">Trung tâm hỗ trợ</Link>
              </li>
            </ul>
            <p>Chưa kết nối dịch vụ hỗ trợ; tin nhắn chưa thể gửi.</p>
          </section>
          <section aria-labelledby="footer-terms">
            <h2 id="footer-terms">Điều khoản</h2>
            <Link to="/settings/terms">Điều khoản sử dụng</Link>
          </section>
          <section aria-labelledby="footer-privacy">
            <h2 id="footer-privacy">Quyền riêng tư</h2>
            <Link to="/settings/terms">Quyền riêng tư — trong điều khoản</Link>
            <p>Chính sách riêng tư độc lập — Cần bổ sung</p>
          </section>
          <section aria-labelledby="footer-social">
            <h2 id="footer-social">Mạng xã hội</h2>
            <p>Liên kết mạng xã hội chính thức — Cần bổ sung</p>
          </section>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} GrabMeFood</p>
          <p>Chủ thể sở hữu/đơn vị vận hành — Cần xác nhận</p>
        </div>
      </div>
    </footer>
  )
}
