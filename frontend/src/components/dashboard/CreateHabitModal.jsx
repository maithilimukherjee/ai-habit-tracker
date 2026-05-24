import "../../styles/habits.css";
import Button from "../common/Button";
import { useState } from "react";
import { createHabit } from "../../services/habitService";

function CreateHabitModal({ closeModal, setHabits }) {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Other",
    frequency: "daily",
    targetDays: 7,
    icon: "✨",
    color: "#ffd60a"
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const categories = [
    "Health",
    "Fitness",
    "Learning",
    "Mindfulness",
    "Productivity",
    "Social",
    "Finance",
    "Creative",
    "Other"
  ];

  const icons = [
    "✨",
    "💪",
    "📚",
    "🧘",
    "💧",
    "🏃",
    "🧠",
    "🎯",
    "💤",
    "🥗",
    "📝",
    "🔥"
  ];

  const colors = [
    "#ffd60a",
    "#ff9f1c",
    "#ef476f",
    "#06d6a0",
    "#118ab2",
    "#8338ec"
  ];

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (!formData.name.trim()) {

    return setError(
      "habit name is required"
    );

  }

  try {

    setLoading(true);
    setError("");

    const newHabit =
      await createHabit(formData);

    setHabits((prev) => [
      ...prev,
      newHabit
    ]);

    closeModal();

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "failed to create habit"
    );

  } finally {

    setLoading(false);

  }
};

  return (

    <div className="modal-overlay">

      <div className="habit-modal">

        <div className="modal-header">

          <h2>
            create new habit
          </h2>

          <button
            className="close-button"
            onClick={closeModal}
          >
            ✕
          </button>

        </div>

        <form className="habit-form" onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              habit name
            </label>

            <input
              type="text"
              name="name"
              placeholder="morning workout"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              description
            </label>

            <textarea
              name="description"
              placeholder="optional description"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              {
                categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))
              }

            </select>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                frequency
              </label>

              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >

                <option value="daily">
                  daily
                </option>

                <option value="weekly">
                  weekly
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                target days
              </label>

              <input
                type="number"
                name="targetDays"
                min="1"
                max="7"
                value={formData.targetDays}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              color
            </label>

            <div className="color-options">

              {
                colors.map((color) => (

                  <button
                    key={color}
                    type="button"
                    className={`color-circle ${
                      formData.color === color
                        ? "active"
                        : ""
                    }`}
                    style={{
                      background: color
                    }}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        color
                      })
                    }
                  />

                ))
              }

            </div>

          </div>

          <div className="form-group">

            <label>
              icon
            </label>

            <div className="icon-options">

              {
                icons.map((icon) => (

                  <button
                    key={icon}
                    type="button"
                    className={`icon-button ${
                      formData.icon === icon
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        icon
                      })
                    }
                  >
                    {icon}
                  </button>

                ))
              }

            </div>

          </div>

          {
            error && (
            <p className="dashboard-error">
            {error}
            </p>
                )
          }

          <Button type="submit">

            {         
                loading? "creating..." : "create habit"
            }

        </Button>

        </form>

      </div>

    </div>

  );
}

export default CreateHabitModal;