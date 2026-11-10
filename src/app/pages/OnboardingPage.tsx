import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Search, Star, ChevronRight, ChevronLeft } from "lucide-react";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: MapPin,
      title: "Tìm quán gần bạn",
      description: "Khám phá hàng ngàn nhà hàng và quán ăn xung quanh vị trí của bạn",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Search,
      title: "Tìm kiếm món ăn",
      description: "Dễ dàng tìm kiếm món ăn yêu thích với bộ lọc thông minh",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Star,
      title: "Đánh giá & Chia sẻ",
      description: "Đọc đánh giá từ cộng đồng và chia sẻ trải nghiệm của bạn",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/login");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col px-6">
      <div className="py-6 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          Bỏ qua hướng dẫn
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        <div className={`w-32 h-32 rounded-full ${currentStepData.color} flex items-center justify-center mb-8`}>
          <Icon className="w-16 h-16" />
        </div>

        <h2 className="text-2xl text-center mb-4 text-black">
          {currentStepData.title}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-sm">
          {currentStepData.description}
        </p>

        <div className="flex gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-red-600"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="w-full flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-full hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {currentStep < steps.length - 1 ? "Tiếp tục" : "Bắt đầu"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
