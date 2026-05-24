import { useEffect, useState } from "react";

import Card from "../common/Card";

import {
  getAllStats
} from "../../services/logService";

import "../../styles/stats.css";

function StatsSection() {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const data =
          await getAllStats();

        setStats(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchStats();

  }, []);

  if (loading) {

    return (

      <Card className="stats-section">

        <h2>
          momentum
        </h2>

        <p>
          loading stats...
        </p>

      </Card>

    );

  }

  const perHabit =
    stats?.perHabit || [];

  const totalCompletions =
    perHabit.reduce(
      (acc, h) =>
        acc + h.completions30d,
      0
    );

  const bestStreak =
    Math.max(
      ...perHabit.map(
        h => h.longestStreak
      ),
      0
    );

  const activeStreak =
    Math.max(
      ...perHabit.map(
        h => h.currentStreak
      ),
      0
    );

  const mostConsistent =
  [...perHabit]
    .filter(
      h => h.currentStreak > 0
    )
    .sort(
      (a, b) =>
        b.currentStreak -
        a.currentStreak
    )[0];

  return (

    <Card className="stats-section">

      <h2>
        momentum
      </h2>

      <div className="stats-grid">

        <div className="stat-card">

          <h3>
            {totalCompletions}
          </h3>

          <p>
            completions (30d)
          </p>

        </div>

        <div className="stat-card">

          <h3>
            {activeStreak}
          </h3>

          <p>
            current best streak
          </p>

        </div>

        <div className="stat-card">

          <h3>
            {bestStreak}
          </h3>

          <p>
            longest streak
          </p>

        </div>

        <div className="stat-card">

          <h3>

            {
              mostConsistent
                ? `${mostConsistent.icon} ${mostConsistent.name}`
                : "none"
            }

          </h3>

          <p>
            most consistent
          </p>

        </div>

      </div>

    </Card>

  );

}

export default StatsSection;