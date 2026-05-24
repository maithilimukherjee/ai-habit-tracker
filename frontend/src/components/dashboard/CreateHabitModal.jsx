import "../../styles/habits.css"

function CreateHabitModal({ closeModal }) {

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

        <p>
          build consistency one step at a time.
        </p>

      </div>

    </div>
  );
}

export default CreateHabitModal;