import { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { getRecoveryPlan } from "../services/aiService";
import api from "../services/api"; // Imported to fetch your habits list
import "../styles/recoveryPlan.css";

function RecoveryPlan() {
  const [habits, setHabits] = useState([]); // Stores the list of habits
  const [selectedHabitId, setSelectedHabitId] = useState(""); // Stores the chosen habit's Mongo _id
  const [loading, setLoading] = useState(false);
  const [fetchingHabits, setFetchingHabits] = useState(true);
  const [plan, setPlan] = useState("");

  // 1. Fetch user habits when the page loads
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Adjust endpoint path if your habits router uses a prefix (e.g., "/api/habits")
        const response = await api.get("/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHabits(response.data || []);
      } catch (err) {
        console.error("Failed to load habits:", err);
      } finally {
        setFetchingHabits(false);
      }
    };

    fetchHabits();
  }, []);

  // 2. Pass the extracted habit ID to the AI Service
  const handleGenerate = async () => {
    if (!selectedHabitId) return;

    try {
      setLoading(true);
      const res = await getRecoveryPlan(selectedHabitId);
      setPlan(res.content);
    } catch (err) {
      console.log(err);
    } finally {
      loading(false);
    }
  };

  return (
    <div className="recovery-page">
      <Card className="recovery-card">
        <h2>recovery plan</h2>
        <p className="subtext">
          dropped your streak? let’s fix it in 3 days
        </p>

        <div className="form">
          <label>select habit</label>
          
          {fetchingHabits ? (
            <p className="loading-text">loading your habits...</p>
          ) : (
            <select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              className="habit-dropdown"
            >
              <option value="">-- choose a habit to recover --</option>
              {habits.map((habit) => (
                <option key={habit._id} value={habit._id}>
                  {habit.name} {habit.category ? `(${habit.category.toLowerCase()})` : ""}
                </option>
              ))}
            </select>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={loading || !selectedHabitId || fetchingHabits}
          >
            generate
          </Button>
        </div>
      </Card>

      {plan && (
        <div className="recovery-result">
          <Card className="plan-card">
            <h3>your comeback plan</h3>
            <pre>{plan}</pre>
          </Card>
        </div>
      )}
    </div>
  );
}

export default RecoveryPlan;