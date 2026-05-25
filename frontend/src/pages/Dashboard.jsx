import { useState } from "react";

import "../styles/dashboard.css";
import "../styles/habits.css";

import HabitsSection from "../components/dashboard/HabitsSection";
import HeatmapSection from "../components/dashboard/HeatmapSection";
import StatsSection from "../components/dashboard/StatsSection";
import AIInsightsSection from "../components/dashboard/AIInsightsSection";

import ProfileSidebar from "../components/profile/ProfileSidebar";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [showProfile, setShowProfile] =
    useState(false);

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

  <button
    className="profile-menu-btn"
    onClick={() => setShowProfile(true)}
  >
    ⋮
  </button>

  <div className="dashboard-heading">

    <h1>
      hello, <span>{user?.name}</span>!
    </h1>

  </div>

</div>

      <HabitsSection />

      <div className="dashboard-insights">

        <HeatmapSection />

        <StatsSection />

      </div>

      <AIInsightsSection />

      {/* PROFILE SIDEBAR */}
      <ProfileSidebar
        user={user}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

    </div>
  );
}

export default Dashboard;