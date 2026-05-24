import { useState } from "react";

import Card from "../common/Card";

import { useNavigate } from "react-router-dom";

import {
  getMorningMotivation,
  getWeeklyReport,
  suggestIdeas,
  getRecoveryPlan,
  chatAnalysis
} from "../../services/aiService";

import "../../styles/aiInsights.css";

function AIInsightsSection() {

  const [morning, setMorning] = useState("");
  const [weekly, setWeekly] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  const generateCoreInsights = async () => {

    try {

      setLoading(true);

      const [m, w] = await Promise.all([
        getMorningMotivation(),
        getWeeklyReport()
      ]);

      setMorning(m.content);
      setWeekly(w.content);

      setGenerated(true);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestions = () => {
  navigate("/ai/suggestions");
};

  const handleRecovery = async () => {
    try {
      setLoading(true);

      const res = await getRecoveryPlan("sampleHabitId");

      alert("recovery plan generated");
      console.log(res);

    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    const question = prompt("ask anything about your habits:");

    if (!question) return;

    try {
      setLoading(true);

      const res = await chatAnalysis(question);

      alert(res.answer);

    } finally {
      setLoading(false);
    }
  };

  return (

    <Card className="ai-section">

      <div className="ai-header">
        <h2>ai insights</h2>
        <span>your habit coach</span>
      </div>

      {!generated && !loading && (

        <div className="ai-empty">

          <p>meet your ai habit coach</p>

          <div className="ai-btn-group">

            <button onClick={generateCoreInsights} className="ai-button">
              generate insights
            </button>

            <button onClick={handleSuggestions} className="ai-button">
              suggest habits
            </button>

            <button onClick={handleRecovery} className="ai-button">
              recovery plans
            </button>

            <button onClick={handleChat} className="ai-button">
              ask away
            </button>

          </div>

        </div>

      )}

      {loading && (
        <p className="ai-loading">
          generating insights...
        </p>
      )}

      {generated && !loading && (

        <div className="ai-content">

          <div className="ai-card">
            <h3>morning motivation</h3>
            <p>{morning}</p>
          </div>

          <div className="ai-card">
            <h3>weekly reflection</h3>
            <p>{weekly}</p>
          </div>

          <button
            className="ai-button secondary"
            onClick={generateCoreInsights}
          >
            regenerate
          </button>

        </div>

      )}

    </Card>

  );
}

export default AIInsightsSection;