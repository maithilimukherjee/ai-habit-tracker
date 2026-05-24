import Card from "../common/Card";
import "../../styles/habits.css"

import { useState } from "react";
import { useEffect } from "react";

import {
  markHabitComplete,
  unmarkHabitComplete
} from "../../services/logService";

import {
  getHabitStats
} from "../../services/logService";

function HabitCard({
  habit,
  completedToday,
  setCompletedToday
}) {

  const isCompleted =
    completedToday.includes(habit._id);

  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0
  });

  useEffect(() => {

  const fetchStats = async () => {

    try {

      const data =
        await getHabitStats(
          habit._id
        );

      setStats(data);

    } catch (error) {

      console.log(error);

    }
  };

  fetchStats();

}, [habit._id, isCompleted]);


  const handleToggleComplete =
    async () => {

      try {

        if (isCompleted) {

          await unmarkHabitComplete(
            habit._id
          );

          setCompletedToday((prev) =>
            prev.filter(
              (id) => id !== habit._id
            )
          );

        } else {

          await markHabitComplete(
            habit._id
          );

          setCompletedToday((prev) => [
            ...prev,
            habit._id
          ]);

        }

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <Card
      className={`habit-card ${
        isCompleted
          ? "completed"
          : ""
      }`}
    >

      <div className="habit-top">

        <div
          className="habit-color"
          style={{
            background: habit.color
          }}
        />

        <div className="habit-info">

          <h3>
            {habit.icon} {habit.name}
          </h3>

          <p>
            {habit.description}
          </p>

        </div>

      </div>

      <div className="habit-meta">

        <span>
          {habit.category}
        </span>

        <span>
          {habit.frequency}
        </span>

      </div>

      <div className="habit-streak">

      🔥 {stats.currentStreak}

      </div>

      <button
        className={`complete-button ${
          isCompleted
            ? "done"
            : ""
        }`}
        onClick={handleToggleComplete}
      >

        {
          isCompleted
            ? "completed"
            : "mark complete"
        }

      </button>

    </Card>
  );
}

export default HabitCard;