import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { suggestIdeas } from "../services/aiService";
import "../styles/aiSuggestions.css";

function AISuggestions() {

  const [goals, setGoals] = useState("");
  const [productiveTime, setProductiveTime] = useState("");
  const [struggles, setStruggles] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!goals.trim()) return;

    try {
      setLoading(true);

      const res = await suggestIdeas({
        goals: goals.split(",").map((g) => g.trim()),
        productiveTime,
        struggles: struggles.split(",").map((s) => s.trim())
      });

      // 🔥 SAFE NORMALIZATION (fixes your missing description issue)
      const data = res?.suggestions || [];

      const normalized = Array.isArray(data)
        ? data.map((item) =>
            typeof item === "string"
              ? {
                  title: item,
                  description: "",
                  category: ""
                }
              : {
                  title: item.title || item.name || "habit idea",
                  description: item.description || "no description provided",
                  category: item.category || ""
                }
          )
        : [];

      setResult(normalized);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-suggestions-page">

      <Card className="ai-suggestions-card">
        <h2>ai habit suggestions</h2>
        <p className="subtext">
          tell me about your goals and i'll design habits for you
        </p>

        <div className="form">

          <label>goals (comma separated)</label>
          <input
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="focus, discipline, fitness"
          />

          <label>most productive time</label>
          <input
            value={productiveTime}
            onChange={(e) => setProductiveTime(e.target.value)}
            placeholder="morning / night / afternoon"
          />

          <label>struggles (comma separated)</label>
          <input
            value={struggles}
            onChange={(e) => setStruggles(e.target.value)}
            placeholder="procrastination, distraction"
          />

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "generating..." : "generate habits"}
          </Button>

        </div>
      </Card>

      {result && (
        <div className="results">
          <h3>your personalized habits</h3>

          <div className="grid">
            {result.map((item, idx) => (
              <Card key={idx} className="habit-card">

                <h4>{item.title}</h4>

                <p>
                  {item.description}
                </p>

                {item.category && (
                  <span className="tag">
                    {item.category}
                  </span>
                )}

              </Card>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export default AISuggestions;