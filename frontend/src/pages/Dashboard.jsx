import "../styles/dashboard.css"
import "../styles/habits.css"
import HabitCard from "../components/dashboard/HabitCard"
import HabitsSection from "../components/dashboard/HabitsSection";
import HeatmapSection from "../components/dashboard/HeatmapSection";
import StatsSection from "../components/dashboard/StatsSection";
import AIInsightsSection from "../components/dashboard/AIInsightsSection";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>

          <h1>
            welcome back, {user?.name}!
          </h1>

          <p>
            consistency compounds into greatness.
          </p>

        </div>

      </div>

      <HabitsSection />

      
      <div className="dashboard-insights">

  <HeatmapSection />

  <StatsSection />

</div>

    <AIInsightsSection />

    </div>
  );
}

export default Dashboard;