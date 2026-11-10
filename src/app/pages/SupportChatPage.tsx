import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function SupportChatPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      text: "Xin chào! Bạn cần hỗ trợ gì?",
      time: "10:30",
    },
  ]);

  const quickQuestions = [
    "Làm sao để đặt món?",
    "Cách thêm địa chỉ mới?",
    "Chính sách hoàn tiền?",
    "Cách viết đánh giá?",
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      text: message,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot" as const,
        text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ trả lời trong giây lát.",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg">Trung tâm hỗ trợ</h1>
            <p className="text-xs text-gray-500">Thường trả lời trong vài phút</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Câu hỏi thường gặp:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-red-600 hover:text-red-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  msg.type === "user"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.type === "user" ? "text-red-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
