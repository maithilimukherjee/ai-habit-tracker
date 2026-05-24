import { useEffect, useState } from "react";

import Section from "../common/Section";
import Button from "../common/Button";
import CreateHabitModal from "./CreateHabitModal";
import HabitCard from "./HabitCard";
import { getTodayLogs } from "../../services/logService";
import "../../styles/section.css"
import { getHabits } from "../../services/habitService";

function HabitsSection() {

  const [habits, setHabits] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [completedToday, setCompletedToday] = useState([]);

  useEffect(() => {

    const fetchHabits = async () => {

      try {

        const data = await getHabits();

        setHabits(data);

        const todayData = await getTodayLogs();

        const completedIds = todayData.logs.map((log) => log.habitId);

        setCompletedToday(completedIds);

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "failed to load habits"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchHabits();

  }, []);

  return (
    <Section
      title="your habits"
      subtitle="small actions repeated daily create massive transformation."
    >

      <div className="habits-header">

        <p>
          {habits.length} active habits
        </p>

        <Button onClick={() => setShowModal(true)}>
        + add habit
        </Button>

      </div>

      {
        loading ? (

          <p className="dashboard-message">
            loading habits...
          </p>

        ) : error ? (

          <p className="dashboard-error">
            {error}
          </p>

        ) : habits.length === 0 ? (

          <div className="empty-state">

            <h3>
              no habits yet
            </h3>

            <p>
              start building your first habit today.
            </p>

          </div>

        ) : (

          <div className="habits-grid">

            {
              habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  completedToday={completedToday}
                  setCompletedToday={setCompletedToday}
                />
              ))
            }

          </div>

        )
      }
      {
  showModal && (
    <CreateHabitModal
  closeModal={() => setShowModal(false)}
  setHabits={setHabits}
/>
  )
}

    </Section>
  );
}

export default HabitsSection;