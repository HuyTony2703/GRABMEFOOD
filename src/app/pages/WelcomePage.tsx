import { useNavigate } from "react-router";
import logoImage from "../../imports/logo.jpg";

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-full mb-12">
          <img
            src={logoImage}
            alt="GrabMeFood Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        <h1 className="text-3xl text-center mb-4 text-black">
          Chào mừng đến với GrabMeFood
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Khám phá những món ăn ngon và nhà hàng tuyệt vời quanh bạn
        </p>

        <button
          onClick={() => navigate("/onboarding")}
          className="w-full bg-red-600 text-white py-4 rounded-full hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
}
