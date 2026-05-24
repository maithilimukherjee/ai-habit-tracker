import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { chatAnalysis } from "../services/aiService";
import "../styles/habitChat.css";

function HabitChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = question;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg }
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const res = await chatAnalysis(userMsg);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.answer }
      ]);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">

      <Card className="chat-card">
        <h2>ask your habit coach</h2>
        <p className="subtext">
          ask anything about your habits, patterns, or discipline
        </p>

        <div className="chat-box">

          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="hint">
                try: “why do i always fail on weekends?”
              </p>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`bubble ${msg.role}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="ask something..."
              onKeyDown={(e) =>
                e.key === "Enter" && handleAsk()
              }
            />

            <Button onClick={handleAsk} disabled={loading}>
              {loading ? "thinking..." : "ask"}
            </Button>
          </div>

        </div>
      </Card>

    </div>
  );
}

export default HabitChat;