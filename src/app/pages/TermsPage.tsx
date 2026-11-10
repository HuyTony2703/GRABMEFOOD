import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg">Điều khoản sử dụng</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg mb-4">Điều khoản của GrabMeFood</h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium mb-2">1. Chấp nhận điều khoản</h3>
              <p className="text-gray-600">
                Bằng việc truy cập và sử dụng ứng dụng GrabMeFood, bạn đồng ý tuân thủ
                các điều khoản và điều kiện được quy định dưới đây.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Sử dụng dịch vụ</h3>
              <p className="text-gray-600">
                Bạn đồng ý sử dụng dịch vụ một cách hợp pháp và không vi phạm bất kỳ
                quy định nào. GrabMeFood có quyền từ chối hoặc chấm dứt quyền truy
                cập của bạn nếu phát hiện hành vi vi phạm.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Tài khoản người dùng</h3>
              <p className="text-gray-600">
                Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của
                mình. Mọi hoạt động dưới tài khoản của bạn đều thuộc trách nhiệm
                của bạn.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">4. Quyền riêng tư</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách
                Quyền riêng tư. Thông tin của bạn chỉ được sử dụng để cải thiện
                trải nghiệm dịch vụ.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">5. Nội dung đánh giá</h3>
              <p className="text-gray-600">
                Khi đăng đánh giá, bạn đồng ý rằng nội dung phải trung thực, không
                chứa ngôn từ xúc phạm, và không vi phạm quyền của bên thứ ba.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">6. Thay đổi điều khoản</h3>
              <p className="text-gray-600">
                GrabMeFood có quyền thay đổi các điều khoản này bất cứ lúc nào.
                Chúng tôi sẽ thông báo cho bạn về những thay đổi quan trọng.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">7. Liên hệ</h3>
              <p className="text-gray-600">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên
                hệ với chúng tôi qua Trung tâm hỗ trợ.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500">
            Cập nhật lần cuối: 18/04/2026
          </div>
        </div>
      </div>
    </div>
  );
}
