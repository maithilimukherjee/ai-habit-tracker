import { useState } from "react";

import Card from "../common/Card";
import Button from "../common/Button";

import {
  getMorningMotivation,
  getWeeklyReport
} from "../../services/aiService";

import "../../styles/aiInsights.css";

function AIInsightsSection() {

  const [morning, setMorning] = useState("");
  const [weekly, setWeekly] = useState("");

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateInsights = async () => {

    try {

      setLoading(true);

      const [morningData, weeklyData] =
        await Promise.all([
          getMorningMotivation(),
          getWeeklyReport()
        ]);

      setMorning(morningData.content);
      setWeekly(weeklyData.content);

      setGenerated(true);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <Card className="ai-section">

      <div className="ai-header">

        <h2>ai insights</h2>

        <span>powered by your habits</span>

      </div>

      {!generated && !loading && (

        <div className="ai-empty">

          <p>
            no insights yet.
          </p>

          <div className="ai-btn-group">
          <button
            className="ai-button"
            onClick={generateInsights}
          >
            generate insights
          </button>

          <button className="ai-button"> suggest habits </button>

          <button className="ai-button"> recovery plans </button>
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
            onClick={generateInsights}
          >
            regenerate
          </button>

        </div>

      )}

    </Card>

  );

}

export default AIInsightsSection;