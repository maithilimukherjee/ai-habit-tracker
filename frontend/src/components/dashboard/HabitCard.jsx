import Card from "../common/Card";

function HabitCard({ habit }) {

  return (
    <Card className="habit-card">

      <div className="habit-top">

        <div
          className="habit-color"
          style={{
            background: habit.color
          }}
        />

        <div className="habit-info">

          <h3>{habit.name}</h3>

          <p>{habit.description}</p>

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

    </Card>
  );
}

export default HabitCard;