import Card from "../common/Card";
import "../../styles/habits.css";

import { useState, useEffect } from "react";

import {
  markHabitComplete,
  unmarkHabitComplete,
  getHabitStats
} from "../../services/logService";

function HabitCard({
  habit,
  completedToday,
  setCompletedToday,
  onDelete
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
          await getHabitStats(habit._id);

        setStats(data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchStats();

  }, [habit._id, isCompleted]);

  const handleToggleComplete = async () => {

    try {

      const localDate =
        new Date().toLocaleDateString("en-CA");

      if (isCompleted) {

        await unmarkHabitComplete(
          habit._id,
          localDate
        );

        setCompletedToday((prev) =>
          prev.filter((id) => id !== habit._id)
        );

      } else {

        await markHabitComplete(
          habit._id,
          localDate
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
        isCompleted ? "completed" : ""
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

      <div className="habit-btn-group">
      <button
        className={`complete-button ${
          isCompleted ? "done" : ""
        }`}
        onClick={handleToggleComplete}
      >

        {
          isCompleted
            ? "completed"
            : "mark complete"
        }

      </button>

      

        <button
          className="habit-action-btn delete"
          onClick={() => onDelete(habit._id)}
        >
          delete
        </button>

      </div>

    </Card>
  );
}

export default HabitCard;